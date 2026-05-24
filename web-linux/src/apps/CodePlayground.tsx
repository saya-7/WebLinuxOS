import { useState, useEffect } from 'react';
import { useStore } from '../store';

type Language = 'javascript' | 'html' | 'css';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  createdAt: Date;
}

const defaultSnippets: Snippet[] = [
  {
    id: '1',
    title: 'Hello World',
    language: 'javascript',
    code: `console.log("Hello, WebLinuxOS!");
let a = 10;
let b = 20;
console.log(\`a + b = \${a + b}\`);
document.body.innerHTML = "<h1>运行成功!</h1>";`,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: '简单 CSS',
    language: 'css',
    code: `body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
h1 {
  color: white;
  font-family: system-ui;
}`,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'HTML 示例',
    language: 'html',
    code: `<div style="text-align: center; padding: 40px;">
  <h1>🎉 欢迎来到 WebLinuxOS!</h1>
  <p>这是一个完全在浏览器中运行的操作系统。</p>
  <button onclick="alert('你好！')">点击我</button>
</div>`,
    createdAt: new Date(),
  },
];

export default function CodePlayground() {
  const theme = useStore((s) => s.theme);
  const [activeTab, setActiveTab] = useState<Language>('javascript');
  const [code, setCode] = useState(defaultSnippets[0].code);
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem('weblinux-code-snippets');
    if (saved) {
      try {
        return JSON.parse(saved).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }));
      } catch {
        return defaultSnippets;
      }
    }
    return defaultSnippets;
  });
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('weblinux-code-snippets', JSON.stringify(snippets));
  }, [snippets]);

  const runCode = () => {
    setIsRunning(true);
    setOutput('运行中...');
    
    let htmlContent = '';
    
    try {
      if (activeTab === 'javascript') {
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                padding: 20px;
                background: #f0f0f5;
                margin: 0;
              }
              pre { 
                background: #1e1e2e;
                color: #e0e0e8;
                padding: 10px;
                border-radius: 8px;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <div id="console"></div>
            <script>
              const consoleEl = document.getElementById('console');
              const originalLog = console.log;
              const logs = [];
              console.log = function(...args) {
                logs.push(args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '));
                consoleEl.innerHTML = '<pre>' + logs.join('\\n') + '</pre>';
                originalLog.apply(console, args);
              };
              try {
                ${code}
              } catch (e) {
                console.error(e);
                document.body.innerHTML += '<pre style="color: #ff3b30;">错误: ' + e + '</pre>';
              }
            <\/script>
          </body>
          </html>
        `;
      } else if (activeTab === 'html') {
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body>${code}</body>
          </html>
        `;
      } else if (activeTab === 'css') {
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>${code}</style>
          </head>
          <body>
            <h1>样式预览</h1>
            <p>这是一个测试段落，用来展示你的CSS效果。</p>
            <button>按钮</button>
          </body>
          </html>
        `;
      }
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const outputUrl = URL.createObjectURL(blob);
      
      setOutput(`✅ 代码已生成！
你可以在新窗口预览: ${outputUrl}
(实际预览功能在完整桌面环境中运行)`);
      
      setIsRunning(false);
      
    } catch (e) {
      setOutput(`错误: ${e}`);
      setIsRunning(false);
    }
  };

  const saveSnippet = () => {
    const title = prompt('请输入代码片段标题:');
    if (title?.trim()) {
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        title: title.trim(),
        code,
        language: activeTab,
        createdAt: new Date(),
      };
      setSnippets([...snippets, newSnippet]);
    }
  };

  const loadSnippet = (snippet: Snippet) => {
    setCode(snippet.code);
    setActiveTab(snippet.language);
  };

  const deleteSnippet = (id: string) => {
    if (confirm('确定要删除此代码片段吗?')) {
      setSnippets(snippets.filter(s => s.id !== id));
    }
  };

  const clearCode = () => {
    if (confirm('确定要清空代码吗?')) {
      setCode('');
    }
  };

  return (
    <div 
      className="app-container"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme === 'light' ? '#f0f0f5' : '#1e1e2e',
        color: theme === 'light' ? '#1c1c1e' : '#e0e0e8',
      }}
    >
      <div style={{ 
        padding: '12px 16px',
        background: theme === 'light' ? '#ffffff' : '#252536',
        borderBottom: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎮</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>代码运行器</div>
            <div style={{ fontSize: '11px', color: theme === 'light' ? '#8e8e93' : '#9090a4' }}>
              在浏览器中运行代码
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearCode}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
              background: theme === 'light' ? '#ffffff' : '#252536',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🗑 清空
          </button>
          <button
            onClick={saveSnippet}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
              background: theme === 'light' ? '#ffffff' : '#252536',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            💾 保存
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              background: isRunning 
                ? '#8e8e93' 
                : (theme === 'light' ? '#007aff' : '#6c5ce7'),
              color: '#fff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isRunning ? '⏳ 运行中...' : '▶ 运行'}
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        <div style={{ 
          width: '200px',
          borderRight: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
          display: 'flex',
          flexDirection: 'column',
          background: theme === 'light' ? '#ffffff' : '#252536',
        }}>
          <div style={{ 
            padding: '12px',
            fontWeight: 600,
            fontSize: '12px',
            borderBottom: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
            textTransform: 'uppercase',
            color: theme === 'light' ? '#8e8e93' : '#9090a4',
          }}>
            代码片段
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${theme === 'light' ? '#e5e5ea' : '#2e2e44'}`,
                  transition: 'background 0.2s',
                }}
                onClick={() => loadSnippet(snippet)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme === 'light' ? '#f0f0f5' : '#1e1e2e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ 
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {snippet.title}
                </div>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ 
                    fontSize: '11px',
                    color: theme === 'light' ? '#8e8e93' : '#9090a4',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: theme === 'light' ? '#f0f0f5' : '#1e1e2e',
                  }}>
                    {snippet.language}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSnippet(snippet.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff3b30',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '2px 6px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ 
            display: 'flex',
            borderBottom: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
            background: theme === 'light' ? '#ffffff' : '#252536',
          }}>
            {(['javascript', 'html', 'css'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === lang 
                    ? (theme === 'light' ? '#007aff' : '#6c5ce7')
                    : (theme === 'light' ? '#8e8e93' : '#9090a4'),
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: activeTab === lang ? 600 : 400,
                  borderBottom: activeTab === lang 
                    ? `2px solid ${theme === 'light' ? '#007aff' : '#6c5ce7'}`
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setShowOutput(!showOutput)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: 'transparent',
                color: theme === 'light' ? '#8e8e93' : '#9090a4',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {showOutput ? '📄 隐藏输出' : '📄 显示输出'}
            </button>
          </div>

          <div style={{ 
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}>
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  background: theme === 'light' ? '#ffffff' : '#1e1e2e',
                  color: theme === 'light' ? '#1c1c1e' : '#e0e0e8',
                }}
                placeholder={`// 输入 ${activeTab} 代码并点击运行...`}
              />
            </div>

            {showOutput && (
              <div style={{ 
                width: '45%',
                borderLeft: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
                display: 'flex',
                flexDirection: 'column',
                background: theme === 'light' ? '#ffffff' : '#252536',
              }}>
                <div style={{ 
                  padding: '10px 16px',
                  borderBottom: `1px solid ${theme === 'light' ? '#d1d1d6' : '#3a3a5c'}`,
                  fontWeight: 600,
                  fontSize: '12px',
                  color: theme === 'light' ? '#8e8e93' : '#9090a4',
                }}>
                  控制台输出
                </div>
                <div style={{ 
                  flex: 1,
                  padding: '16px',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  overflowY: 'auto',
                  background: theme === 'light' ? '#f5f5f7' : '#181824',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}>
                  {output || '// 运行代码查看输出...'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
