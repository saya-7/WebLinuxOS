import { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '../store'
import type { FileNode } from '../types'

interface HistoryEntry {
  input: string
  output: string
  isPython?: boolean
}

declare global {
  interface Window {
    __pyodide__: any
    __pyodideLoading__: boolean
  }
}

function findNodeByPath(files: FileNode[], path: string): FileNode | null {
  if (path === '/' || path === '') return files[0]
  const parts = path.replace(/^\//, '').split('/')
  let current: FileNode | null = files[0]
  for (const part of parts) {
    if (!part || !current?.children) continue
    current = current.children.find((c) => c.name === part) || null
    if (!current) return null
  }
  return current
}

function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) return target
  const parts = (cwd + '/' + target).split('/').filter(Boolean)
  const resolved: string[] = []
  for (const part of parts) {
    if (part === '..') resolved.pop()
    else if (part !== '.') resolved.push(part)
  }
  return '/' + resolved.join('/')
}

function listDir(files: FileNode[], path: string): string {
  const node = findNodeByPath(files, path)
  if (!node || node.type !== 'folder') return `ls: 无法访问'${path}': 没有那个文件或目录`
  if (!node.children || node.children.length === 0) return ''
  return node.children.map((c) => c.name + (c.type === 'folder' ? '/' : '')).join('  ')
}

function processOutput(text: string): React.ReactNode[] {
  const parts = text.split(/(\x1b\[[0-9;]*m)/)
  const result: React.ReactNode[] = []
  let currentStyle: React.CSSProperties = {}
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('\x1b[')) {
      const code = parts[i].replace('\x1b[', '').replace('m', '')
      if (code === '0') currentStyle = {}
      else if (code === '34') currentStyle = { color: '#569cd6' }
      else if (code === '32') currentStyle = { color: '#6a9955' }
      else if (code === '31') currentStyle = { color: '#f44747' }
      else if (code === '33') currentStyle = { color: '#dcdcaa' }
      else if (code === '1') currentStyle = { ...currentStyle, fontWeight: 'bold' }
    } else {
      result.push(<span key={i} style={currentStyle}>{parts[i]}</span>)
    }
  }
  return result
}

async function loadPyodide(): Promise<any> {
  if (window.__pyodide__) return window.__pyodide__
  if (window.__pyodideLoading__) {
    while (!window.__pyodide__) await new Promise(r => setTimeout(r, 200))
    return window.__pyodide__
  }
  window.__pyodideLoading__ = true

  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
  document.head.appendChild(script)
  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide'))
  })

  const pyodide = await (window as any).loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
  })

  await pyodide.runPythonAsync(`
import sys
sys.version_info
`)

  window.__pyodide__ = pyodide
  window.__pyodideLoading__ = false
  return pyodide
}

export default function Terminal() {
  const files = useStore((s) => s.files)
  const addFile = useStore((s) => s.addFile)
  const deleteFile = useStore((s) => s.deleteFile)
  const theme = useStore((s) => s.theme)

  const [cwd, setCwd] = useState('/home/user')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: 'Web Linux 终端 v2.0\n输入 "help" 查看可用命令\n输入 "python" 进入 Python 环境' },
  ])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [pythonMode, setPythonMode] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [pythonBuffer, setPythonBuffer] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pyodideRef = useRef<any>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const executePython = useCallback(async (code: string) => {
    try {
      if (!pyodideRef.current) {
        setPyodideLoading(true)
        setHistory(prev => [...prev, { input: code, output: '⏳ 正在加载 Python 环境 (首次约需10秒)...', isPython: true }])
        pyodideRef.current = await loadPyodide()
        setPyodideReady(true)
        setPyodideLoading(false)
      }

      const pyodide = pyodideRef.current

      pyodide.globals.set('__user_code__', code)
      const result = await pyodide.runPythonAsync(`
import sys, io
__stdout_capture__ = io.StringIO()
__stderr_capture__ = io.StringIO()
__old_stdout__ = sys.stdout
__old_stderr__ = sys.stderr
sys.stdout = __stdout_capture__
sys.stderr = __stderr_capture__
__result__ = None
__error__ = None
try:
    __result__ = eval(__user_code__)
except SyntaxError:
    try:
        exec(__user_code__)
    except Exception as e:
        __error__ = e
except Exception as e:
    __error__ = e
sys.stdout = __old_stdout__
sys.stderr = __old_stderr__
__output__ = __stdout_capture__.getvalue()
__err_output__ = __stderr_capture__.getvalue()
if __error__:
    __output__ + __err_output__ + str(type(__error__).__name__) + ': ' + str(__error__)
elif __result__ is not None:
    __output__ + __err_output__ + str(__result__)
else:
    __output__ + __err_output__
`)
      return String(result) || ''
    } catch (e: any) {
      return `Error: ${e.message || String(e)}`
    }
  }, [])

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim()
    const parts = trimmed.split(/\s+/)
    const command = parts[0]
    const args = parts.slice(1)

    if (pythonMode) {
      if (trimmed === 'exit()' || trimmed === 'quit()' || trimmed === 'exit' || trimmed === 'quit') {
        setPythonMode(false)
        setPythonBuffer([])
        setHistory(prev => [...prev, { input: trimmed, output: '退出 Python 环境', isPython: true }])
        return
      }

      const newBuffer = [...pythonBuffer, trimmed]
      setPythonBuffer(newBuffer)
      const fullCode = newBuffer.join('\n')

      const result = await executePython(fullCode)
      setPythonBuffer([])
      setHistory(prev => [...prev, { input: `>>> ${trimmed}`, output: result, isPython: true }])
      return
    }

    let output = ''

    switch (command) {
      case '':
        break
      case 'python':
      case 'python3': {
        setPythonMode(true)
        setPythonBuffer([])
        if (!pyodideRef.current && !pyodideLoading) {
          setHistory(prev => [...prev, {
            input: trimmed,
            output: 'Python 3.11.3 (Pyodide)\n输入 Python 代码执行，输入 exit() 退出\n⏳ Python 环境将在首次执行代码时加载...',
            isPython: true
          }])
          try {
            setPyodideLoading(true)
            pyodideRef.current = await loadPyodide()
            setPyodideReady(true)
            setPyodideLoading(false)
            setHistory(prev => [...prev, {
              input: '',
              output: `✅ Python ${pyodideRef.current.runPython('import sys; sys.version.split()[0]')} 已就绪！\n>>> `,
              isPython: true
            }])
          } catch (e) {
            setPyodideLoading(false)
            setHistory(prev => [...prev, { input: '', output: '❌ Python 环境加载失败，请检查网络连接', isPython: true }])
          }
        } else {
          setHistory(prev => [...prev, {
            input: trimmed,
            output: `Python 3.11.3 (Pyodide)\n输入 Python 代码执行，输入 exit() 退出${pyodideReady ? '\n✅ Python 环境已就绪' : ''}`,
            isPython: true
          }])
        }
        return
      }
      case 'help':
        output = `可用命令:
  文件操作:  ls, cd, pwd, cat, echo, mkdir, touch, rm, cp, mv, find, grep
  系统信息:  uname, hostname, whoami, date, ps, top, df, free, neofetch
  网络:      ping, curl, ifconfig
  其他:      clear, history, lsb_release, tree, wc, head, tail, sort, uniq
  🐍 Python: python / python3  进入 Python 交互环境`
        break
      case 'clear':
        setHistory([])
        return
      case 'pwd':
        output = cwd
        break
      case 'whoami':
        output = 'user'
        break
      case 'hostname':
        output = 'web-linux'
        break
      case 'date':
        output = new Date().toString()
        break
      case 'uname':
        output = args.includes('-a')
          ? 'Linux web-linux 6.1.0-web x86_64 GNU/Linux'
          : 'Linux'
        break
      case 'lsb_release':
        output = args.includes('-a')
          ? 'Distributor ID: WebLinux\nDescription:    Web Linux 2.0\nRelease:        2.0\nCodename:       web'
          : 'Web Linux 2.0'
        break
      case 'neofetch':
        output = [
          '            .-/+oossssoo+/-.               user@web-linux',
          '        `:+ssssssssssssssssss+:`           -------------',
          '      -+ssssssssssssssssssssssso+-         OS: Web Linux 2.0',
          '    /osssssssssssssssssssssssssso/        Kernel: 6.1.0-web',
          '  /ossssssssssssssssssssssssssssso/       Shell: bash 5.2',
          ' :sssssssssssssssssssssssssssssssss:      DE: WebDE',
          ' ossssssssssssssssssssssssssssssssso      Theme: ' + theme,
          ' ossssssssssssssssssssssssssssssssso      Python: 3.11.3 (Pyodide)',
          ' :sssssssssssssssssssssssssssssssss:      Packages: ' + Math.floor(Math.random() * 500 + 100),
          '  /ossssssssssssssssssssssssssssso/       Memory: ' + Math.floor(Math.random() * 4096 + 1024) + 'MB / 8192MB',
          '    /osssssssssssssssssssssssssso/',
          '      -+ssssssssssssssssssssssso+-',
          '        `:+ssssssssssssssssss+:`',
          '            .-/+oossssoo+/-.',
        ].join('\n')
        break
      case 'ls': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        output = listDir(files, target)
        break
      }
      case 'cd': {
        if (args.length === 0) {
          setCwd('/home/user')
        } else {
          const resolved = resolvePath(cwd, args[0])
          const node = findNodeByPath(files, resolved)
          if (node && node.type === 'folder') setCwd(resolved)
          else output = `cd: ${args[0]}: 没有那个文件或目录`
        }
        break
      }
      case 'cat': {
        if (args.length === 0) {
          output = 'cat: 缺少操作数'
        } else {
          const resolved = resolvePath(cwd, args[0])
          const node = findNodeByPath(files, resolved)
          if (node && node.type === 'file') output = node.content || ''
          else output = `cat: ${args[0]}: 没有那个文件或目录`
        }
        break
      }
      case 'echo':
        output = args.join(' ')
        break
      case 'mkdir': {
        if (args.length === 0) { output = 'mkdir: 缺少操作数'; break }
        const resolved = resolvePath(cwd, args[0])
        const pathParts = resolved.split('/').filter(Boolean)
        const parentPath = '/' + pathParts.slice(0, -1).join('/') || '/'
        const dirName = pathParts[pathParts.length - 1]
        const parentNode = findNodeByPath(files, parentPath)
        if (parentNode) addFile(parentNode.id, dirName, 'folder')
        else output = `mkdir: 无法创建目录'${args[0]}': 没有那个文件或目录`
        break
      }
      case 'touch': {
        if (args.length === 0) { output = 'touch: 缺少操作数'; break }
        const resolved = resolvePath(cwd, args[0])
        const pathParts = resolved.split('/').filter(Boolean)
        const parentPath = '/' + pathParts.slice(0, -1).join('/') || '/'
        const fileName = pathParts[pathParts.length - 1]
        const parentNode = findNodeByPath(files, parentPath)
        const existing = findNodeByPath(files, resolved)
        if (!existing && parentNode) addFile(parentNode.id, fileName, 'file')
        else if (!parentNode) output = `touch: 无法创建'${args[0]}': 没有那个文件或目录`
        break
      }
      case 'rm': {
        if (args.length === 0) { output = 'rm: 缺少操作数'; break }
        const resolved = resolvePath(cwd, args[0])
        const node = findNodeByPath(files, resolved)
        if (node) deleteFile(node.id)
        else output = `rm: 无法删除'${args[0]}': 没有那个文件或目录`
        break
      }
      case 'cp':
        output = args.length >= 2 ? `已复制 '${args[0]}' -> '${args[1]}'` : 'cp: 用法: cp 源 目标'
        break
      case 'mv':
        output = args.length >= 2 ? `已移动 '${args[0]}' -> '${args[1]}'` : 'mv: 用法: mv 源 目标'
        break
      case 'find':
        output = args.length > 0
          ? `./${args[0]}\n./home/user/documents/${args[0]}`
          : 'find: 缺少操作数'
        break
      case 'grep':
        output = args.length >= 2
          ? `匹配到 3 行结果:\n  第10行: ...包含"${args[0]}"的内容...\n  第25行: ...包含"${args[0]}"的内容...\n  第42行: ...包含"${args[0]}"的内容...`
          : 'grep: 用法: grep 模式 文件'
        break
      case 'tree': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        const node = findNodeByPath(files, target)
        if (!node || node.type !== 'folder') { output = `tree: ${target}: 不是目录`; break }
        const buildTree = (n: FileNode, prefix: string): string => {
          if (!n.children || n.children.length === 0) return ''
          let result = ''
          n.children.forEach((child, i) => {
            const isLast = i === n.children!.length - 1
            const connector = isLast ? '└── ' : '├── '
            result += prefix + connector + child.name + (child.type === 'folder' ? '/' : '') + '\n'
            if (child.type === 'folder') {
              result += buildTree(child, prefix + (isLast ? '    ' : '│   '))
            }
          })
          return result
        }
        output = target + '\n' + buildTree(node, '')
        break
      }
      case 'wc':
        output = args.length > 0
          ? `  ${Math.floor(Math.random() * 100 + 10)}  ${Math.floor(Math.random() * 500 + 50)}  ${Math.floor(Math.random() * 3000 + 100)} ${args[0]}`
          : 'wc: 缺少操作数'
        break
      case 'head':
        if (args.length === 0) { output = 'head: 缺少操作数'; break }
        {
          const resolved = resolvePath(cwd, args[args.length - 1])
          const node = findNodeByPath(files, resolved)
          if (node && node.type === 'file') {
            const lines = (node.content || '').split('\n')
            const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
            output = lines.slice(0, n).join('\n')
          } else output = `head: ${args[args.length - 1]}: 没有那个文件或目录`
        }
        break
      case 'tail':
        if (args.length === 0) { output = 'tail: 缺少操作数'; break }
        {
          const resolved = resolvePath(cwd, args[args.length - 1])
          const node = findNodeByPath(files, resolved)
          if (node && node.type === 'file') {
            const lines = (node.content || '').split('\n')
            const n = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
            output = lines.slice(-n).join('\n')
          } else output = `tail: ${args[args.length - 1]}: 没有那个文件或目录`
        }
        break
      case 'sort':
        output = args.length > 0 ? '(排序输出)' : 'sort: 缺少操作数'
        break
      case 'uniq':
        output = args.length > 0 ? '(去重输出)' : 'uniq: 缺少操作数'
        break
      case 'ps':
        output = '  PID TTY          TIME CMD\n    1 ?        00:00:01 systemd\n  234 ?        00:00:00 terminal\n  567 ?        00:00:05 browser\n  890 ?        00:00:02 file-manager'
        break
      case 'top':
        output = `top - ${new Date().toLocaleTimeString()} up ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}, 1 user\nTasks: ${Math.floor(Math.random() * 50 + 50)} total\n%Cpu(s): ${(Math.random() * 20 + 5).toFixed(1)} us, ${(Math.random() * 5).toFixed(1)} sy\nMiB Mem: ${(Math.random() * 2000 + 6000).toFixed(1)} total, ${(Math.random() * 3000).toFixed(1)} free`
        break
      case 'df':
        output = '文件系统           大小  已用  可用 使用%\n/dev/sda1          50G   12G   38G   24%\ntmpfs             3.9G  1.2M  3.9G    1%'
        break
      case 'free':
        output = `              总计         已用         空闲\n内存:       ${Math.floor(Math.random() * 4000 + 4000)}MB      ${Math.floor(Math.random() * 3000)}MB      ${Math.floor(Math.random() * 3000)}MB\n交换:       ${Math.floor(Math.random() * 2000 + 1000)}MB           0MB      ${Math.floor(Math.random() * 2000 + 1000)}MB`
        break
      case 'history':
        output = cmdHistory.map((h, i) => `  ${i + 1}  ${h}`).join('\n')
        break
      case 'ping':
        if (args.length === 0) { output = 'ping: 用法: ping 目标地址'; break }
        output = `PING ${args[0]} 56(84) bytes of data.\n64 bytes from ${args[0]}: icmp_seq=1 ttl=64 time=${(Math.random() * 30 + 10).toFixed(1)} ms\n64 bytes from ${args[0]}: icmp_seq=2 ttl=64 time=${(Math.random() * 30 + 10).toFixed(1)} ms\n64 bytes from ${args[0]}: icmp_seq=3 ttl=64 time=${(Math.random() * 30 + 10).toFixed(1)} ms`
        break
      case 'curl':
        output = args.length > 0 ? `curl: (模拟) 请求 ${args[0]}...\n<html><body><h1>模拟响应</h1></body></html>` : 'curl: 用法: curl URL'
        break
      case 'ifconfig':
        output = 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0\n        inet6 fe80::1  prefixlen 64\n        ether 00:11:22:33:44:55  txqueuelen 1000\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0'
        break
      case 'which':
        if (args.length === 0) { output = 'which: 缺少参数'; break }
        const knownCommands = ['python', 'python3', 'ls', 'cd', 'cat', 'echo', 'mkdir', 'rm', 'grep', 'find', 'curl', 'ping']
        output = knownCommands.includes(args[0]) ? `/usr/bin/${args[0]}` : `${args[0]} not found`
        break
      case 'env':
        output = 'USER=user\nHOME=/home/user\nSHELL=/bin/bash\nPATH=/usr/local/bin:/usr/bin:/bin\nLANG=zh_CN.UTF-8\nTERM=xterm-256color\nPYTHON_VERSION=3.11.3'
        break
      case 'export':
        output = args.length > 0 ? `已设置环境变量: ${args[0]}` : 'export: 缺少参数'
        break
      case 'chmod':
        output = args.length >= 2 ? `已更改 '${args[1]}' 权限为 ${args[0]}` : 'chmod: 用法: chmod 权限 文件'
        break
      case 'man':
        output = args.length > 0 ? `${args[0].toUpperCase()}(1)\n\n名称\n    ${args[0]} - 系统命令\n\n描述\n    请使用 --help 查看详细帮助` : '你想查看哪个命令的手册？'
        break
      case 'apt':
      case 'apt-get':
        output = args.includes('update') ? '正在读取软件包列表... 完成\n正在分析软件包的依赖关系树... 完成\n所有软件包均为最新版本。'
          : args.includes('install') ? `正在读取软件包列表... 完成\n正在安装 ${args[args.indexOf('install') + 1] || '软件包'}...\n已设置 ${args[args.indexOf('install') + 1] || '软件包'}。`
          : 'apt: 用法: apt [update|install|remove] [软件包]'
        break
      case 'pip':
      case 'pip3': {
        if (args.length === 0) { output = 'pip: 用法: pip [install|list|show] [包名]'; break }
        if (args[0] === 'list') {
          output = 'Package          Version\n---------------- -------\nnumpy            1.24.3\npandas           2.0.3\nmatplotlib       3.7.2\nrequests         2.31.0\nflask            3.0.0'
        } else if (args[0] === 'install') {
          output = `Collecting ${args[1] || 'package'}\n  Downloading ${args[1] || 'package'}-latest.tar.gz\nInstalling collected packages: ${args[1] || 'package'}\nSuccessfully installed ${args[1] || 'package'}-latest`
        } else {
          output = 'pip: 未知命令'
        }
        break
      }
      case 'git':
        output = args.length === 0 ? 'usage: git [--version] [--help] <command> [<args>]\n\n常用命令:\n   init       创建新仓库\n   clone      克隆仓库\n   add        添加到暂存区\n   commit     提交更改\n   push       推送到远程\n   pull       拉取远程更改\n   log        查看提交历史\n   status     查看工作区状态'
          : args[0] === 'version' ? 'git version 2.40.0'
          : args[0] === 'status' ? 'On branch main\nnothing to commit, working tree clean'
          : args[0] === 'log' ? 'commit a1b2c3d (HEAD -> main)\nAuthor: user <user@web-linux>\nDate:   ' + new Date().toISOString().slice(0, 10) + '\n\n    Initial commit'
          : args[0] === 'init' ? '已初始化 Git 仓库于 /home/user/.git/'
          : `git: '${args[0]}' 已模拟执行`
        break
      case 'node':
        output = args.length === 0 ? 'Welcome to Node.js v20.10.0\n> ' : `Node.js 执行: ${args.join(' ')}\n(模拟输出)`
        break
      case 'npm':
        output = args.length === 0 ? 'npm v10.2.0' : `npm ${args[0]}: 已模拟执行`
        break
      default:
        output = `bash: ${command}: 未找到命令。输入 'help' 查看可用命令`
    }

    setHistory(prev => [...prev, { input: trimmed, output }])
  }, [cwd, files, addFile, deleteFile, cmdHistory, theme, pythonMode, pyodideLoading, pyodideReady, executePython, pythonBuffer])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim()
      if (cmd) {
        setCmdHistory(prev => [...prev, cmd])
        setHistoryIndex(-1)
      }
      executeCommand(cmd)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length > 0) {
        const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(cmdHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= cmdHistory.length) { setHistoryIndex(-1); setInput('') }
        else { setHistoryIndex(newIndex); setInput(cmdHistory[newIndex]) }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const commands = ['ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'touch', 'rm', 'cp', 'mv', 'find', 'grep', 'python', 'python3', 'clear', 'help', 'history', 'tree', 'head', 'tail', 'ps', 'top', 'df', 'free', 'ping', 'curl', 'ifconfig', 'git', 'node', 'npm', 'pip', 'pip3', 'apt', 'man', 'which', 'env', 'export', 'chmod', 'uname', 'whoami', 'date', 'hostname', 'neofetch', 'sort', 'uniq', 'wc']
      const partial = input.trim()
      if (partial) {
        const matches = commands.filter(c => c.startsWith(partial))
        if (matches.length === 1) setInput(matches[0] + ' ')
        else if (matches.length > 1) {
          setHistory(prev => [...prev, { input: '', output: matches.join('  ') }])
        }
      }
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1a2e', color: '#e0e0e0', fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace', fontSize: 13, overflow: 'hidden' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.5 }}
      >
        {history.map((entry, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            {entry.input && (
              <div>
                {!entry.isPython && (
                  <>
                    <span style={{ color: '#569cd6' }}>user@</span>
                    <span style={{ color: '#6a9955' }}>web-linux</span>
                    <span style={{ color: '#d4d4d4' }}>:</span>
                    <span style={{ color: '#569cd6' }}>{cwd}</span>
                    <span style={{ color: '#d4d4d4' }}>$ </span>
                  </>
                )}
                <span style={entry.isPython ? { color: '#ffd700' } : undefined}>{entry.input}</span>
              </div>
            )}
            {entry.output && <div style={{ color: entry.isPython ? '#e0e0e0' : undefined }}>{processOutput(entry.output)}</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 16px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {pythonMode ? (
          <span style={{ color: '#ffd700', whiteSpace: 'nowrap' }}>&gt;&gt;&gt; </span>
        ) : (
          <>
            <span style={{ color: '#569cd6', whiteSpace: 'nowrap' }}>user@</span>
            <span style={{ color: '#6a9955', whiteSpace: 'nowrap' }}>web-linux</span>
            <span style={{ color: '#d4d4d4', whiteSpace: 'nowrap' }}>:</span>
            <span style={{ color: '#569cd6', whiteSpace: 'nowrap' }}>{cwd}</span>
            <span style={{ color: '#d4d4d4', whiteSpace: 'nowrap' }}>$&nbsp;</span>
          </>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: pythonMode ? '#ffd700' : '#00ff00', fontFamily: 'inherit', fontSize: 'inherit',
            caretColor: pythonMode ? '#ffd700' : '#00ff00',
          }}
          spellCheck={false}
          placeholder={pythonMode ? '输入 Python 代码...' : ''}
        />
        {pyodideLoading && (
          <span style={{ color: '#ffd700', fontSize: 11, animation: 'blink 1s infinite' }}>⏳ 加载Python...</span>
        )}
        {pythonMode && pyodideReady && (
          <span style={{ color: '#4ecca3', fontSize: 11 }}>🐍 Python就绪</span>
        )}
      </div>
      <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  )
}
