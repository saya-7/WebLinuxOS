import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

interface Pyodide {
  runPython: (code: string) => unknown;
}

interface WindowWithPyodide extends Window {
  loadPyodide?: () => Promise<Pyodide>;
}

const DEFAULT_CODE = `// WebLinux Code Studio
// 一个创新的在线编程环境

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`\${i}: \${fibonacci(i)}\`);
}

// 试试运行这段代码！
`;

export default function CodeStudio() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [code, setCode] = useState(DEFAULT_CODE);
  interface OutputLine {
    message: string;
    type: 'info' | 'success' | 'error' | 'log';
    time: string;
  }
  
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'html'>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [savedFiles, setSavedFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('weblinux-codestudio-files');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [currentFileName, setCurrentFileName] = useState('untitled.js');
  const outputRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? '#1e1e2e' : '#f7f7fa';
  const editorBg = isDark ? '#1a1a2e' : '#ffffff';
  const border = isDark ? '#3a3a5c' : '#e0e0e6';
  const text = isDark ? '#e0e0e8' : '#1c1c1e';
  const accent = isDark ? '#6c5ce7' : '#007aff';
  const success = isDark ? '#00b894' : '#00a085';
  const error = isDark ? '#d63031' : '#dc3545';

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (message: string, type: 'info' | 'success' | 'error' | 'log' = 'log') => {
    setOutput(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const clearOutput = () => setOutput([]);

  const runJavaScript = async () => {
    setIsRunning(true);
    clearOutput();
    
    const logCapture: string[] = [];
    const originalConsole = { ...console };
    
    console.log = (...args) => {
      const msg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logCapture.push(msg);
      addOutput(msg, 'log');
    };
    
    console.error = (...args) => {
      const msg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logCapture.push(msg);
      addOutput(msg, 'error');
    };

    try {
      const result = new Function(code)();
      if (result !== undefined) {
        addOutput(String(result), 'success');
      }
      addOutput('✓ 代码执行完成', 'success');
    } catch (err) {
      addOutput(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      Object.assign(console, originalConsole);
      setIsRunning(false);
    }
  };

  const runPython = async () => {
    setIsRunning(true);
    clearOutput();
    addOutput('Python 运行时正在加载...', 'info');
    
    try {
      if (typeof window !== 'undefined' && (window as WindowWithPyodide).loadPyodide) {
        const loadFn = (window as WindowWithPyodide).loadPyodide;
        if (loadFn) {
          const pyodide = await loadFn();
          pyodide.runPython(`
            import sys
            from io import StringIO
            sys.stdout = StringIO()
          `);
          
          const result = pyodide.runPython(code);
          const stdout = pyodide.runPython('sys.stdout.getvalue()') as unknown;
          
          if (stdout && typeof stdout === 'string') {
            stdout.split('\\n').forEach((line: string) => {
              if (line) addOutput(line, 'log');
            });
          }
          
          if (result !== undefined && result !== null) {
            addOutput(String(result), 'success');
          }
          addOutput('✓ Python 代码执行完成', 'success');
        }
      } else {
        addOutput('⚠️ Python 运行时不可用，这是一个模拟结果', 'info');
        addOutput('Python: ' + code.slice(0, 50) + '...', 'log');
        addOutput('✓ 代码执行完成 (模拟)', 'success');
      }
    } catch (err) {
      addOutput(`Python Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const runCode = () => {
    if (language === 'javascript') {
      runJavaScript();
    } else if (language === 'python') {
      runPython();
    } else {
      addOutput('HTML 预览模式已就绪', 'info');
    }
  };

  const saveFile = () => {
    const newFiles = { ...savedFiles, [currentFileName]: code };
    setSavedFiles(newFiles);
    localStorage.setItem('weblinux-codestudio-files', JSON.stringify(newFiles));
    addOutput(`✓ 文件 "${currentFileName}" 已保存`, 'success');
  };

  const loadFile = (fileName: string) => {
    if (savedFiles[fileName]) {
      setCode(savedFiles[fileName]);
      setCurrentFileName(fileName);
      
      if (fileName.endsWith('.py')) setLanguage('python');
      else if (fileName.endsWith('.html')) setLanguage('html');
      else setLanguage('javascript');
      
      addOutput(`✓ 文件 "${fileName}" 已加载`, 'success');
    }
  };

  const deleteFile = (fileName: string) => {
    if (confirm(`确定要删除 "${fileName}" 吗？`)) {
      const newFiles = { ...savedFiles };
      delete newFiles[fileName];
      setSavedFiles(newFiles);
      localStorage.setItem('weblinux-codestudio-files', JSON.stringify(newFiles));
      addOutput(`✓ 文件 "${fileName}" 已删除`, 'info');
    }
  };

  const createNewFile = () => {
    const name = prompt('输入文件名 (例如: myscript.js):');
    if (name) {
      setCurrentFileName(name);
      setCode('');
      addOutput(`✓ 新文件 "${name}" 已创建`, 'success');
    }
  };

  const formatCode = () => {
    try {
      if (language === 'javascript') {
        const formatted = code
          .replace(/\s*([{}()[\]])\s*/g, ' $1 ')
          .replace(/\s+/g, ' ')
          .trim();
        setCode(formatted);
        addOutput('✓ 代码已格式化', 'success');
      } else {
        addOutput('⚠️ 当前语言暂不支持自动格式化', 'info');
      }
    } catch {
      addOutput('❌ 格式化失败', 'error');
    }
  };

  const shareCode = () => {
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    addOutput('✓ 分享链接已复制到剪贴板', 'success');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: bg,
      color: text,
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${border}`,
        background: editorBg,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>💻</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Code Studio</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {currentFileName}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python' | 'html')}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: bg,
              color: text,
              fontSize: '13px',
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
          </select>
          
          <button
            onClick={formatCode}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: bg,
              color: text,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🎨 格式化
          </button>
          
          <button
            onClick={saveFile}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: bg,
              color: text,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            💾 保存
          </button>
          
          <button
            onClick={shareCode}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: bg,
              color: text,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🔗 分享
          </button>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              background: isRunning ? '#999' : success,
              color: '#fff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {isRunning ? '⏳ 运行中...' : '▶ 运行'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: '200px',
          borderRight: `1px solid ${border}`,
          background: editorBg,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '12px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>
              📁 我的文件
            </span>
            <button
              onClick={createNewFile}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                background: accent,
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              + 新建
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {Object.keys(savedFiles).length === 0 ? (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                opacity: 0.5,
                fontSize: '12px'
              }}>
                暂无保存的文件
              </div>
            ) : (
              Object.keys(savedFiles).map(fileName => (
                <div
                  key={fileName}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    background: fileName === currentFileName ? `${accent}20` : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => loadFile(fileName)}
                >
                  <span style={{ fontSize: '13px' }}>
                    {fileName.endsWith('.js') ? '📜' : 
                     fileName.endsWith('.py') ? '🐍' : 
                     fileName.endsWith('.html') ? '🌐' : '📄'} {fileName}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(fileName);
                    }}
                    style={{
                      padding: '2px 6px',
                      border: 'none',
                      background: 'transparent',
                      color: error,
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div style={{
            padding: '12px',
            borderTop: `1px solid ${border}`,
            fontSize: '11px',
            opacity: 0.7,
          }}>
            💡 提示：按 Ctrl+Enter 快速运行
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '8px 12px',
              background: isDark ? '#161626' : '#f0f0f5',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>编辑器</span>
              <span style={{ opacity: 0.6 }}>
                {language === 'javascript' ? 'JavaScript' : 
                 language === 'python' ? 'Python' : 'HTML'}
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  e.preventDefault();
                  runCode();
                }
              }}
              spellCheck={false}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: editorBg,
                color: text,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
              }}
            />
          </div>
          
          <div style={{
            height: '35%',
            minHeight: '150px',
            borderTop: `1px solid ${border}`,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '8px 12px',
              background: isDark ? '#161626' : '#f0f0f5',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>控制台输出</span>
              <button
                onClick={clearOutput}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'transparent',
                  color: text,
                  cursor: 'pointer',
                  fontSize: '11px',
                  opacity: 0.7,
                }}
              >
                🗑 清空
              </button>
            </div>
            <div
              ref={outputRef}
              style={{
                flex: 1,
                padding: '12px',
                overflowY: 'auto',
                fontFamily: 'Monaco, Menlo, monospace',
                fontSize: '13px',
                background: isDark ? '#12121f' : '#fafafa',
              }}
            >
              {output.length === 0 ? (
                <div style={{ opacity: 0.4, textAlign: 'center', padding: '20px' }}>
                  点击 "运行" 开始执行代码...
                </div>
              ) : (
                output.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: '4px',
                      color: line.type === 'error' ? error :
                             line.type === 'success' ? success : text,
                    }}
                  >
                    <span style={{ opacity: 0.5, marginRight: '8px' }}>
                      {line.time}
                    </span>
                    {line.type === 'error' && '❌ '}
                    {line.type === 'success' && '✓ '}
                    {line.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
