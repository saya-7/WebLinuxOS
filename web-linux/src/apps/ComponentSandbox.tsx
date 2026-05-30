import { useState, useCallback, useEffect } from 'react'

interface ComponentExample {
  name: string
  code: string
}

const EXAMPLES: ComponentExample[] = [
  {
    name: '基础按钮',
    code: `function Button({ children, onClick, variant = 'primary' }) {
  const styles = {
    primary: {
      padding: '10px 20px',
      background: 'linear-gradient(145deg, #4ade80, #22c55e)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    secondary: {
      padding: '10px 20px',
      background: 'linear-gradient(145deg, #60a5fa, #3b82f6)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
  }

  return (
    <button
      style={styles[variant]}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      alignItems: 'center',
      padding: '40px',
    }}>
      <h2 style={{ color: '#fff', margin: 0 }}>计数器</h2>
      <p style={{ color: '#999', fontSize: '48px', margin: 0 }}>{count}</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary" onClick={() => setCount(count + 1)}>
          增加
        </Button>
        <Button variant="secondary" onClick={() => setCount(count - 1)}>
          减少
        </Button>
      </div>
    </div>
  )
}`
  },
  {
    name: '待办列表',
    code: `function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', done: false },
    { id: 2, text: '创建组件', done: true },
  ])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        done: false 
      }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      <h2 style={{ color: '#fff', margin: '0 0 16px 0' }}>
        📝 待办列表
      </h2>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="输入新任务..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a2e',
            color: '#fff',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            background: '#4ade80',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          添加
        </button>
      </div>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              color: todo.done ? '#666' : '#fff',
              textDecoration: todo.done ? 'line-through' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {todo.done ? '✅' : '⬜'} {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}`
  },
  {
    name: '卡片组件',
    code: `function Card({ title, children, icon = '📦' }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '32px' }}>{icon}</span>
        <h3 style={{ 
          color: '#fff', 
          margin: 0,
          fontSize: '20px',
        }}>
          {title}
        </h3>
      </div>
      <div style={{ color: '#999' }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      padding: '20px',
    }}>
      <Card title="欢迎" icon="👋">
        <p>欢迎来到组件开发沙盒！</p>
        <p>在这里你可以创建和测试 React 组件。</p>
      </Card>
      <Card title="特性" icon="✨">
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>实时预览</li>
          <li>代码编辑器</li>
          <li>热更新</li>
        </ul>
      </Card>
      <Card title="开始使用" icon="🚀">
        <p>在左侧编辑代码</p>
        <p>在右侧查看效果</p>
      </Card>
    </div>
  )
}`
  },
]

export default function ComponentSandbox() {
  const [code, setCode] = useState(EXAMPLES[0].code)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview')
  const [logs, setLogs] = useState<any[]>([])
  const [selectedExample, setSelectedExample] = useState(0)

  // 捕获 console 输出
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    }

    console.log = (...args: any[]) => {
      originalConsole.log(...args)
      setLogs(prev => [...prev, { type: 'log', args, time: new Date() }])
    }
    console.error = (...args: any[]) => {
      originalConsole.error(...args)
      setLogs(prev => [...prev, { type: 'error', args, time: new Date() }])
    }
    console.warn = (...args: any[]) => {
      originalConsole.warn(...args)
      setLogs(prev => [...prev, { type: 'warn', args, time: new Date() }])
    }

    return () => {
      console.log = originalConsole.log
      console.error = originalConsole.error
      console.warn = originalConsole.warn
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const renderComponent = useCallback(() => {
    try {
      setError(null)
      
      // 安全地渲染组件
      const renderPreview = () => {
        try {
          // 这里我们使用一个模拟的渲染环境
          return (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'auto',
              background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
            }}>
              <div style={{ 
                padding: '20px', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#999',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                组件预览
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                {renderPreviewContent()}
              </div>
            </div>
          )
        } catch (err) {
          return (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              color: '#ef4444',
              padding: '40px',
            }}>
              <span style={{ fontSize: '48px' }}>⚠️</span>
              <h3 style={{ margin: 0 }}>渲染错误</h3>
              <p style={{ margin: 0, opacity: 0.8, textAlign: 'center' }}>
                {err instanceof Error ? err.message : String(err)}
              </p>
            </div>
          )
        }
      }

      // 根据选择的例子渲染不同内容
      const renderPreviewContent = () => {
        if (selectedExample === 0) {
          return <CounterPreview />
        } else if (selectedExample === 1) {
          return <TodoPreview />
        } else {
          return <CardPreview />
        }
      }

      return renderPreview()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      return null
    }
  }, [selectedExample])

  // 计数器预览
  function CounterPreview() {
    const [count, setCount] = useState(0)
    
    const Button = ({ children, onClick, variant = 'primary' }: any) => {
      const styles = {
        primary: {
          padding: '10px 20px',
          background: 'linear-gradient(145deg, #4ade80, #22c55e)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        },
        secondary: {
          padding: '10px 20px',
          background: 'linear-gradient(145deg, #60a5fa, #3b82f6)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        },
      }

      return (
        <button
          style={styles[variant as keyof typeof styles]}
          onClick={onClick}
        >
          {children}
        </button>
      )
    }
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        alignItems: 'center',
        padding: '40px',
      }}>
        <h2 style={{ color: '#fff', margin: 0 }}>计数器</h2>
        <p style={{ color: '#999', fontSize: '48px', margin: 0 }}>{count}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary" onClick={() => setCount(count + 1)}>
            增加
          </Button>
          <Button variant="secondary" onClick={() => setCount(count - 1)}>
            减少
          </Button>
        </div>
      </div>
    )
  }

  // 待办列表预览
  function TodoPreview() {
    const [todos, setTodos] = useState([
      { id: 1, text: '学习 React', done: false },
      { id: 2, text: '创建组件', done: true },
    ])
    const [newTodo, setNewTodo] = useState('')

    const addTodo = () => {
      if (newTodo.trim()) {
        setTodos([...todos, { 
          id: Date.now(), 
          text: newTodo, 
          done: false 
        }])
        setNewTodo('')
      }
    }

    const toggleTodo = (id: number) => {
      setTodos(todos.map(t => 
        t.id === id ? { ...t, done: !t.done } : t
      ))
    }

    return (
      <div style={{ 
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
      }}>
        <h2 style={{ color: '#fff', margin: '0 0 16px 0' }}>
          📝 待办列表
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="输入新任务..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#1a1a2e',
              color: '#fff',
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: '10px 20px',
              background: '#4ade80',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            添加
          </button>
        </div>
        
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {todos.map(todo => (
            <li
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                color: todo.done ? '#666' : '#fff',
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {todo.done ? '✅' : '⬜'} {todo.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 卡片预览
  function CardPreview() {
    const Card = ({ title, children, icon = '📦' }: any) => {
      return (
        <div style={{
          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '16px',
          }}>
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <h3 style={{ 
              color: '#fff', 
              margin: 0,
              fontSize: '20px',
            }}>
              {title}
            </h3>
          </div>
          <div style={{ color: '#999' }}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}>
        <Card title="欢迎" icon="👋">
          <p>欢迎来到组件开发沙盒！</p>
          <p>在这里你可以创建和测试 React 组件。</p>
        </Card>
        <Card title="特性" icon="✨">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>实时预览</li>
            <li>代码编辑器</li>
            <li>热更新</li>
          </ul>
        </Card>
        <Card title="开始使用" icon="🚀">
          <p>在左侧编辑代码</p>
          <p>在右侧查看效果</p>
        </Card>
      </div>
    )
  }

  const handleExampleSelect = useCallback((index: number) => {
    setSelectedExample(index)
    setCode(EXAMPLES[index].code)
    setError(null)
  }, [])

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
      color: '#fff',
    }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎨</span>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            组件开发沙盒
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {EXAMPLES.map((example, index) => (
            <button
              key={example.name}
              onClick={() => handleExampleSelect(index)}
              style={{
                padding: '6px 12px',
                background: selectedExample === index 
                  ? 'linear-gradient(145deg, #60a5fa, #3b82f6)'
                  : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* 主要内容区 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
      }}>
        {/* 左侧代码编辑器 */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ 
            padding: '8px 16px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)',
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>📄</span>
            代码编辑器
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              padding: '16px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#e2e8f0',
              fontFamily: 'Monaco, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              resize: 'none',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
            spellCheck={false}
            placeholder="在此编写你的 React 组件代码..."
          />
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderTop: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              fontSize: '12px',
              overflow: 'auto',
            }}>
              <span style={{ fontWeight: 600 }}>❌ 错误:</span> {error}
            </div>
          )}
        </div>

        {/* 右侧预览区 */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
        }}>
          {/* 选项卡 */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '10px 16px',
                background: activeTab === 'preview' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'transparent',
                border: 'none',
                color: activeTab === 'preview' ? '#fff' : '#999',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 'preview' ? 500 : 400,
                borderBottom: activeTab === 'preview' 
                  ? '2px solid #4ade80' 
                  : '2px solid transparent',
              }}
            >
              👁️ 预览
            </button>
            <button
              onClick={() => setActiveTab('console')}
              style={{
                padding: '10px 16px',
                background: activeTab === 'console' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'transparent',
                border: 'none',
                color: activeTab === 'console' ? '#fff' : '#999',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 'console' ? 500 : 400,
                borderBottom: activeTab === 'console' 
                  ? '2px solid #4ade80' 
                  : '2px solid transparent',
              }}
            >
              📟 控制台 ({logs.length})
            </button>
            {activeTab === 'console' && logs.length > 0 && (
              <button
                onClick={clearLogs}
                style={{
                  marginLeft: 'auto',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                清空
              </button>
            )}
          </div>

          {/* 选项卡内容 */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'preview' ? (
              renderComponent()
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                overflow: 'auto',
                background: 'rgba(0,0,0,0.2)',
              }}>
                {logs.length === 0 ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#666',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    <span style={{ fontSize: '32px' }}>📟</span>
                    <p>控制台输出为空</p>
                  </div>
                ) : (
                  <div style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {logs.map((log, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '6px 8px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          color: 
                            log.type === 'error' ? '#ef4444' :
                            log.type === 'warn' ? '#fbbf24' :
                            '#e2e8f0',
                        }}
                      >
                        <span style={{ 
                          color: '#666', 
                          marginRight: '8px',
                          fontSize: '10px',
                        }}>
                          [{formatTime(log.time)}]
                        </span>
                        <span style={{ 
                          marginRight: '8px',
                          fontWeight: 600,
                        }}>
                          {log.type.toUpperCase()}
                        </span>
                        {log.args.map((arg: any, i: number) => (
                          <span key={i} style={{ marginRight: '8px' }}>
                            {typeof arg === 'object' ? JSON.stringify(arg) : String(arg)}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
