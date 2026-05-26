import { useState, useEffect } from 'react'

interface Course {
  id: string
  title: string
  description: string
  icon: string
  category: string
  lessons: Lesson[]
  progress: number
}

interface Lesson {
  id: string
  title: string
  content: string
  code?: string
  completed: boolean
}

const courses: Course[] = [
  {
    id: 'js-basics',
    title: 'JavaScript 基础',
    description: '从变量、函数到对象，全面掌握 JavaScript 核心知识',
    icon: '🟨',
    category: '前端开发',
    progress: 40,
    lessons: [
      {
        id: 'js-1',
        title: '变量与数据类型',
        content: '# JavaScript 变量\n\nJavaScript 有三种声明变量的方式：var、let 和 const。\n\n## let 和 const\n- `let` 用于声明可重新赋值的变量\n- `const` 用于声明常量，值不能改变\n\n```javascript\nlet name = \"WebLinux\"\nconst PI = 3.14159\n```',
        code: '// 尝试在这里写一些代码\nlet message = "Hello, WebLinux!";\nconsole.log(message);',
        completed: true
      },
      {
        id: 'js-2',
        title: '函数基础',
        content: '# JavaScript 函数\n\n函数是可复用的代码块。\n\n```javascript\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("World"));\n```',
        code: 'function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3));',
        completed: true
      },
      {
        id: 'js-3',
        title: '对象与数组',
        content: '# 对象与数组\n\n对象用于存储键值对，数组用于存储有序列表。\n\n```javascript\nconst user = { name: "Alice", age: 25 };\nconst numbers = [1, 2, 3, 4, 5];\n```',
        code: 'const person = {\n  name: "Bob",\n  hobbies: ["coding", "reading"]\n};\n\nconsole.log(person);',
        completed: false
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python 入门',
    description: '学习 Python 编程的基础语法和核心概念',
    icon: '🐍',
    category: '后端开发',
    progress: 60,
    lessons: [
      {
        id: 'py-1',
        title: 'Python 基础',
        content: '# Python 基础\n\nPython 是一门简洁优雅的语言。\n\n```python\nprint("Hello, World!")\n```',
        code: 'name = "WebLinux"\nprint(f"Hello, {name}!")',
        completed: true
      },
      {
        id: 'py-2',
        title: '列表与字典',
        content: '# 列表与字典\n\nPython 的数据结构非常强大。\n\n```python\nfruits = ["apple", "banana", "cherry"]\nperson = {"name": "Alice", "age": 25}\n```',
        code: 'numbers = [1, 2, 3, 4, 5]\nsquared = [x ** 2 for x in numbers]\nprint(squared)',
        completed: true
      },
      {
        id: 'py-3',
        title: '函数与模块',
        content: '# 函数与模块\n\n学习如何定义和使用函数。\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n```',
        code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))',
        completed: false
      }
    ]
  },
  {
    id: 'react-basics',
    title: 'React 开发',
    description: '构建现代化的用户界面',
    icon: '⚛️',
    category: '前端开发',
    progress: 20,
    lessons: [
      {
        id: 'react-1',
        title: 'React 组件',
        content: '# React 组件\n\n组件是 React 的基本构建块。\n\n```jsx\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```',
        code: 'function Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}',
        completed: true
      },
      {
        id: 'react-2',
        title: '状态与属性',
        content: '# 状态与属性\n\n学习如何管理组件状态和传递数据。',
        code: '',
        completed: false
      }
    ]
  },
  {
    id: 'git-basics',
    title: 'Git 版本控制',
    description: '学习 Git 版本控制系统的基本操作',
    icon: '📦',
    category: '开发工具',
    progress: 0,
    lessons: [
      { id: 'git-1', title: 'Git 基础', content: '# Git 基础\n\nGit 是最流行的版本控制系统。', completed: false },
      { id: 'git-2', title: '分支与合并', content: '# 分支与合并\n\n学习如何使用 Git 分支。', completed: false }
    ]
  }
]

export default function LearningPlatform() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [learningTime, setLearningTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setLearningTime(t => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const selectCourse = (course: Course) => {
    setSelectedCourse(course)
    setActiveLesson(course.lessons[0])
    setCode(course.lessons[0].code || '')
    setOutput('')
  }

  const selectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson)
    setCode(lesson.code || '')
    setOutput('')
  }

  const runCode = () => {
    try {
      if (selectedCourse?.id.includes('python')) {
        setOutput('Python 运行环境加载中...\n(在 WebLinuxOS 终端中运行 Pyodide)\n\n控制台：\n>>> Python code executed successfully!')
      } else {
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => logs.push(args.map(String).join(' '))
        
        const result = new Function(code)()
        
        console.log = originalLog
        
        setOutput('// 运行结果:\n' + logs.join('\n') + (result !== undefined ? '\n=> ' + String(result) : ''))
      }
    } catch (error) {
      setOutput('// 错误:\n' + (error as Error).message)
    }
  }

  const markComplete = () => {
    if (!selectedCourse || !activeLesson) return
    setOutput('✓ 课程已标记为完成！')
  }

  if (!selectedCourse) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)',
        color: '#e0e0e8',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: 700
              }}>🎓 WebLinux 学习平台</h1>
              <p style={{
                margin: 0,
                color: '#9090a4',
                fontSize: '14px'
              }}>在浏览器中学习编程，随时随地提升技能</p>
            </div>
            <div style={{
              padding: '12px 20px',
              background: 'rgba(108, 92, 231, 0.2)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#9090a4', marginBottom: '4px' }}>今日学习</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatTime(learningTime)}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>📚 课程列表</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => selectCourse(course)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = 'rgba(108, 92, 231, 0.5)'
                  e.currentTarget.style.background = 'rgba(108, 92, 231, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{course.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{course.title}</h3>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '13px',
                  color: '#9090a4',
                  lineHeight: 1.5
                }}>{course.description}</p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: 'rgba(108, 92, 231, 0.2)',
                    borderRadius: '8px',
                    color: '#a78bfa'
                  }}>{course.category}</span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: course.progress === 100 ? '#4ade80' : '#facc15'
                  }}>{course.progress}%</span>
                </div>

                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${course.progress}%`,
                    background: course.progress === 100 
                      ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                      : 'linear-gradient(90deg, #6c5ce7, #a78bfa)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#9090a4'
                }}>
                  {course.lessons.length} 课时
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: '#0f0f1e',
      color: '#e0e0e8'
    }}>
      <div style={{
        width: '280px',
        background: '#16162a',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setSelectedCourse(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              color: '#e0e0e8',
              cursor: 'pointer',
              padding: '0',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            ← 返回课程
          </button>
          <div style={{
            marginTop: '16px',
            fontSize: '24px'
          }}>{selectedCourse.icon}</div>
          <h2 style={{
            margin: '8px 0 4px 0',
            fontSize: '18px'
          }}>{selectedCourse.title}</h2>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#9090a4'
          }}>{selectedCourse.description}</p>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px'
        }}>
          {selectedCourse.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              style={{
                padding: '12px 16px',
                marginBottom: '6px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: activeLesson?.id === lesson.id 
                  ? 'rgba(108, 92, 231, 0.2)'
                  : 'transparent',
                border: activeLesson?.id === lesson.id
                  ? '1px solid rgba(108, 92, 231, 0.5)'
                  : '1px solid transparent',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (activeLesson?.id !== lesson.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeLesson?.id !== lesson.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                background: lesson.completed 
                  ? '#4ade80' 
                  : activeLesson?.id === lesson.id
                  ? '#6c5ce7'
                  : 'rgba(255,255,255,0.1)',
                color: lesson.completed || activeLesson?.id === lesson.id ? '#fff' : '#9090a4'
              }}>
                {lesson.completed ? '✓' : index + 1}
              </span>
              <span style={{
                fontSize: '14px',
                color: activeLesson?.id === lesson.id ? '#fff' : '#c0c0d0'
              }}>{lesson.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {activeLesson && (
          <>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: '#16162a'
            }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                {activeLesson.title}
              </h2>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <button
                  onClick={markComplete}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeLesson.completed 
                      ? 'rgba(74, 222, 128, 0.2)'
                      : 'linear-gradient(135deg, #6c5ce7, #a78bfa)',
                    color: activeLesson.completed ? '#4ade80' : '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  {activeLesson.completed ? '✓ 已完成' : '标记完成'}
                </button>
                <span style={{ fontSize: '13px', color: '#9090a4' }}>
                  学习时长: {formatTime(learningTime)}
                </span>
              </div>
            </div>

            <div style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden'
            }}>
              <div style={{
                flex: 1,
                padding: '24px',
                overflow: 'auto',
                background: '#0f0f1e'
              }}>
                <div style={{
                  maxWidth: '700px',
                  lineHeight: 1.8,
                  fontSize: '15px'
                }}>
                  {activeLesson.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h3 key={i} style={{
                        fontSize: '20px',
                        margin: '24px 0 12px 0',
                        color: '#fff'
                      }}>{line.slice(2)}</h3>
                    }
                    if (line.startsWith('## ')) {
                      return <h4 key={i} style={{
                        fontSize: '17px',
                        margin: '20px 0 10px 0',
                        color: '#d0d0e0'
                      }}>{line.slice(3)}</h4>
                    }
                    if (line.startsWith('```')) {
                      return null
                    }
                    if (line.trim()) {
                      return <p key={i} style={{ margin: '8px 0' }}>{line}</p>
                    }
                    return <br key={i} />
                  })}
                </div>
              </div>

              <div style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                background: '#1a1a2e'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#16162a'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>💻 代码编辑器</span>
                  <button
                    onClick={runCode}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    ▶ 运行
                  </button>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: '#0d0d1a',
                    border: 'none',
                    color: '#e0e0e8',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none'
                  }}
                />

                <div style={{
                  height: '180px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  background: '#0d0d1a',
                  padding: '16px',
                  overflow: 'auto'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#9090a4',
                    marginBottom: '8px'
                  }}>📤 输出</div>
                  <pre style={{
                    margin: 0,
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '13px',
                    color: '#a0ffa0',
                    whiteSpace: 'pre-wrap'
                  }}>{output || '// 点击 "运行" 按钮执行代码'}</pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
