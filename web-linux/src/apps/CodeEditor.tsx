import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useStore } from '../store'
import type { FileNode } from '../types'

const PY_KEYWORDS = ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'lambda', 'yield', 'pass', 'break', 'continue', 'raise', 'global', 'nonlocal', 'assert', 'del', 'async', 'await']

const JS_KEYWORDS = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'export', 'import',
  'from', 'default', 'new', 'this', 'async', 'await', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'switch',
  'case', 'break', 'continue', 'void', 'null', 'undefined', 'true', 'false']

const BUILTINS = ['console', 'Math', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'JSON',
  'Promise', 'Set', 'Map', 'window', 'document', 'print', 'range', 'len', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set', 'type', 'input', 'open', 'self', 'super', '__init__', '__name__', '__main__']

function highlightCode(code: string, lang: string): { html: string; lineCount: number } {
  const keywords = lang === 'Python' ? PY_KEYWORDS : JS_KEYWORDS
  const lines = code.split('\n')
  const highlighted = lines.map((line) => {
    let result = line
    const regex = /(\b[a-zA-Z_$][\w$]*\b|\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\d+\.?\d*)/g
    let html = ''
    let lastIdx = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(line)) !== null) {
      html += result.slice(lastIdx, match.index).replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const token = match[0]
      if (token.startsWith('//') || token.startsWith('#')) {
        html += `<span style="color:#6a9955">${token.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`
      } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
        html += `<span style="color:#ce9178">${token.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`
      } else if (/^\d+\.?\d*$/.test(token)) {
        html += `<span style="color:#b5cea8">${token}</span>`
      } else if (keywords.includes(token)) {
        html += `<span style="color:#569cd6">${token}</span>`
      } else if (BUILTINS.includes(token)) {
        html += `<span style="color:#dcdcaa">${token}</span>`
      } else {
        html += token.replace(/</g, '&lt;').replace(/>/g,'&gt;')
      }
      lastIdx = regex.lastIndex
    }
    html += result.slice(lastIdx).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return html
  })
  return { html: highlighted.join('\n'), lineCount: lines.length }
}

function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const found = findNodeById(n.children, id)
      if (found) return found
    }
  }
  return null
}

function getFilePath(files: FileNode[], fileId: string): string {
  const parts: string[] = []
  let current = findNodeById(files, fileId)
  while (current) {
    parts.unshift(current.name)
    current = current.parentId ? findNodeById(files, current.parentId) : null
  }
  return '/' + parts.join('/')
}

export default function CodeEditor() {
  const files = useStore((s) => s.files)
  const updateFileContent = useStore((s) => s.updateFileContent)

  const [openTabs, setOpenTabs] = useState<{ id: string; name: string }[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [tabContents, setTabContents] = useState<Record<string, string>>({})
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'home', 'user', 'projects', 'documents']))
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail.appId === 'code-editor' && detail.fileId) {
        const file = findNodeById(files, detail.fileId)
        if (file && file.type === 'file') {
          openFile(file)
        }
      }
    }
    window.addEventListener('open-file', handler)
    return () => window.removeEventListener('open-file', handler)
  }, [files])

  const openFile = useCallback((file: FileNode) => {
    if (!openTabs.find((t) => t.id === file.id)) {
      setOpenTabs((prev) => [...prev, { id: file.id, name: file.name }])
      setTabContents((prev) => ({ ...prev, [file.id]: file.content || '' }))
      setSaved((prev) => ({ ...prev, [file.id]: true }))
    }
    setActiveTabId(file.id)
  }, [openTabs])

  const closeTab = useCallback((fileId: string) => {
    const idx = openTabs.findIndex((t) => t.id === fileId)
    setOpenTabs((prev) => prev.filter((t) => t.id !== fileId))
    setTabContents((prev) => { const next = { ...prev }; delete next[fileId]; return next })
    if (activeTabId === fileId) {
      const next = openTabs[idx + 1] || openTabs[idx - 1]
      setActiveTabId(next?.id || null)
    }
  }, [openTabs, activeTabId])

  const activeTab = openTabs.find((t) => t.id === activeTabId)
  const code = activeTabId ? tabContents[activeTabId] || '' : ''

  const detectLanguage = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    const map: Record<string, string> = { ts: 'TypeScript', tsx: 'TypeScript React', js: 'JavaScript', jsx: 'JavaScript React', py: 'Python', html: 'HTML', css: 'CSS', json: 'JSON', md: 'Markdown', txt: 'Plain Text', sh: 'Shell Script', xml: 'XML', yml: 'YAML', yaml: 'YAML', sql: 'SQL', java: 'Java', cpp: 'C++', c: 'C', go: 'Go', rs: 'Rust', php: 'PHP', rb: 'Ruby' }
    return map[ext || ''] || 'Plain Text'
  }

  const lang = activeTab ? detectLanguage(activeTab.name) : 'Plain Text'
  const highlighted = useMemo(() => highlightCode(code, lang), [code, lang])

  const handleCursorChange = () => {
    const ta = textareaRef.current
    if (!ta) return
    const pos = ta.selectionStart
    const lines = ta.value.substring(0, pos).split('\n')
    setCursorPos({ line: lines.length, col: lines[lines.length - 1].length + 1 })
  }

  const handleSave = useCallback(() => {
    if (activeTabId && tabContents[activeTabId] !== undefined) {
      updateFileContent(activeTabId, tabContents[activeTabId])
      setSaved((prev) => ({ ...prev, [activeTabId]: true }))
    }
  }, [activeTabId, tabContents, updateFileContent])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current
      if (ta) {
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const newValue = code.substring(0, start) + '  ' + code.substring(end)
        setTabContents((prev) => ({ ...prev, [activeTabId!]: newValue }))
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2 }, 0)
      }
    }
  }, [handleSave, code, activeTabId])

  const runPython = useCallback(async () => {
    if (!activeTabId || lang !== 'Python') return
    handleSave()
    setIsRunning(true)
    setOutput('⏳ 正在加载 Python 环境...')

    try {
      if (!(window as any).__pyodide__) {
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
        ;(window as any).__pyodide__ = pyodide
      }

      const pyodide = (window as any).__pyodide__
      const pythonCode = tabContents[activeTabId] || ''

      pyodide.globals.set('__user_code__', pythonCode)
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
    exec(__user_code__)
except Exception as e:
    __error__ = e
sys.stdout = __old_stdout__
sys.stderr = __old_stderr__
__output__ = __stdout_capture__.getvalue()
__err_output__ = __stderr_capture__.getvalue()
if __error__:
    __output__ + __err_output__ + str(type(__error__).__name__) + ': ' + str(__error__)
else:
    __output__ + __err_output__
`)
      setOutput(String(result) || '(程序执行完毕，无输出)')
    } catch (e: any) {
      setOutput(`❌ 执行错误: ${e.message || String(e)}`)
    }
    setIsRunning(false)
  }, [activeTabId, tabContents, lang, handleSave])

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderTree = (nodes: FileNode[], depth: number = 0): React.ReactNode[] => {
    const folders = nodes.filter(n => n.type === 'folder')
    const filesList = nodes.filter(n => n.type === 'file')
    const all: React.ReactNode[] = []
    for (const folder of folders) {
      const isExpanded = expandedFolders.has(folder.id)
      all.push(
        <div key={folder.id}
          style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 12, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', paddingLeft: 8 + depth * 16 }}
          onClick={() => toggleFolder(folder.id)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {isExpanded ? '📂' : '📁'} {folder.name}
        </div>
      )
      if (isExpanded && folder.children) {
        all.push(...renderTree(folder.children, depth + 1))
      }
    }
    for (const file of filesList) {
      const isOpen = openTabs.find(t => t.id === file.id)
      all.push(
        <div key={file.id}
          style={{ padding: '4px 8px', cursor: 'pointer', fontSize: 12, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', paddingLeft: 8 + depth * 16, color: isOpen ? '#6c5ce7' : '#ccc' }}
          onClick={() => openFile(file)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          📄 {file.name}
        </div>
      )
    }
    return all
  }

  const isModified = activeTabId ? !saved[activeTabId] : false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e1e1e', color: '#d4d4d4' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', background: '#2d2d2d', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 4 }}>
        <button onClick={handleSave} disabled={!activeTabId} style={{ ...toolbarBtn, opacity: activeTabId ? 1 : 0.4 }} title="保存 (Ctrl+S)">💾 保存</button>
        {lang === 'Python' && (
          <button onClick={runPython} disabled={isRunning} style={{ ...toolbarBtn, background: isRunning ? '#555' : '#4ecca3', color: '#000' }} title="运行 Python">
            {isRunning ? '⏳ 运行中...' : '▶ 运行'}
          </button>
        )}
        <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>
          {activeTab ? getFilePath(files, activeTabId!) : ''}
          {isModified && <span style={{ color: '#f5c542' }}> (未保存)</span>}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 200, background: '#252526', borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'auto', flexShrink: 0, userSelect: 'none' }}>
          <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
            资源管理器
          </div>
          {renderTree(files)}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#252526', overflow: 'hidden' }}>
            {openTabs.map((tab) => (
              <div key={tab.id}
                style={{
                  padding: '5px 14px', cursor: 'pointer', fontSize: 12,
                  background: tab.id === activeTabId ? '#1e1e1e' : '#2d2d2d',
                  borderRight: '1px solid #444', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                  borderTop: tab.id === activeTabId ? '2px solid #6c5ce7' : '2px solid transparent'
                }}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span style={{ color: !saved[tab.id] ? '#f5c542' : '#ccc' }}>{tab.name}</span>
                <span style={{ marginLeft: 4, fontSize: 14, lineHeight: 1, cursor: 'pointer', opacity: 0.6 }}
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}>×</span>
              </div>
            ))}
            {openTabs.length === 0 && (
              <div style={{ padding: '8px 14px', fontSize: 12, color: '#888' }}>打开文件以开始编辑</div>
            )}
          </div>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {activeTab ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => {
                    setTabContents((prev) => ({ ...prev, [activeTabId!]: e.target.value }))
                    setSaved((prev) => ({ ...prev, [activeTabId!]: false }))
                    handleCursorChange()
                  }}
                  onKeyUp={handleCursorChange}
                  onClick={handleCursorChange}
                  onKeyDown={handleKeyDown}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'transparent', color: 'transparent', caretColor: '#fff',
                    border: 'none', outline: 'none', resize: 'none',
                    padding: '12px 12px 12px 52px', fontSize: 14, fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                    lineHeight: 1.6, boxSizing: 'border-box', zIndex: 2, whiteSpace: 'pre', overflow: 'auto'
                  }}
                  spellCheck={false}
                />
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  padding: '12px 12px 12px 52px', fontSize: 14, fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  lineHeight: 1.6, boxSizing: 'border-box', zIndex: 1, whiteSpace: 'pre', overflow: 'auto',
                  pointerEvents: 'none', color: '#d4d4d4'
                }} dangerouslySetInnerHTML={{ __html: highlighted.html }} />
                <div style={{
                  position: 'absolute', top: 12, left: 0, width: 40,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  fontSize: 14, lineHeight: 1.6, color: '#858585', textAlign: 'right', userSelect: 'none'
                }}>
                  {Array.from({ length: highlighted.lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: 14, flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 48, opacity: 0.3 }}>⚡</div>
                <div>从左侧文件浏览器中选择文件开始编辑</div>
                <div style={{ fontSize: 11, color: '#555' }}>Ctrl+S 保存 · .py 文件可点击 ▶ 运行</div>
              </div>
            )}
          </div>

          {output !== null && (
            <div style={{ height: 160, background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'auto', padding: '8px 12px', fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#e0e0e0', whiteSpace: 'pre-wrap', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#6c5ce7', fontWeight: 600 }}>输出</span>
                <button onClick={() => setOutput(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12 }}>✕ 关闭</button>
              </div>
              {output}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#6c5ce7', color: '#fff', padding: '3px 12px', fontSize: 11, fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>行 {cursorPos.line}, 列 {cursorPos.col}</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>{lang}</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const toolbarBtn: React.CSSProperties = {
  padding: '4px 12px', border: 'none', borderRadius: 4, cursor: 'pointer',
  fontSize: 12, fontFamily: 'inherit', background: 'rgba(255,255,255,0.1)', color: '#ccc'
}
