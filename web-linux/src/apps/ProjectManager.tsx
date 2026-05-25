import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: number
}

interface Project {
  id: string
  name: string
  description: string
  tasks: Task[]
  createdAt: number
  color: string
}

const colors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#06b6d4', '#6366f1', '#f43f5e'
]

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('weblinux-projects')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  useEffect(() => {
    localStorage.setItem('weblinux-projects', JSON.stringify(projects))
  }, [projects])

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  const addProject = () => {
    if (!newProjectName.trim()) return
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
      tasks: [],
      createdAt: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)]
    }
    setProjects([...projects, newProject])
    setSelectedProjectId(newProject.id)
    setShowAddProject(false)
    setNewProjectName('')
    setNewProjectDesc('')
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
    if (selectedProjectId === id) {
      setSelectedProjectId(null)
    }
  }

  const addTask = () => {
    if (!newTaskTitle.trim() || !selectedProjectId) return
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: 'todo',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      createdAt: Date.now()
    }
    setProjects(projects.map(p => 
      p.id === selectedProjectId 
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    ))
    setShowAddTask(false)
    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskDueDate('')
  }

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    if (!selectedProjectId) return
    setProjects(projects.map(p => 
      p.id === selectedProjectId 
        ? { ...p, tasks: p.tasks.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
          )}
        : p
    ))
  }

  const deleteTask = (taskId: string) => {
    if (!selectedProjectId) return
    setProjects(projects.map(p => 
      p.id === selectedProjectId 
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
        : p
    ))
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStats = () => {
    if (!selectedProject) return { todo: 0, inProgress: 0, done: 0, total: 0 }
    const tasks = selectedProject.tasks
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      total: tasks.length
    }
  }

  const stats = getStats()

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      height: '100%',
      background: '#0f172a'
    }}>
      <div style={{ 
        width: 280, 
        borderRight: '1px solid #1e293b', 
        padding: 16,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          fontSize: 20, 
          fontWeight: 700, 
          marginBottom: 16,
          color: '#f8fafc'
        }}>
          📋 项目管理
        </div>

        <button
          onClick={() => setShowAddProject(true)}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '2px dashed #475569',
            borderRadius: 10,
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.color = '#3b82f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#475569'
            e.currentTarget.style.color = '#94a3b8'
          }}
        >
          + 新建项目
        </button>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              style={{
                padding: 12,
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 8,
                background: selectedProjectId === project.id 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'transparent',
                border: selectedProjectId === project.id 
                  ? '1px solid rgba(59, 130, 246, 0.3)' 
                  : '1px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedProjectId !== project.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProjectId !== project.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: project.color
                  }} />
                  <span style={{ 
                    color: '#f8fafc', 
                    fontWeight: 600, 
                    fontSize: 14 
                  }}>
                    {project.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteProject(project.id)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: 4,
                    borderRadius: 4
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  🗑️
                </button>
              </div>
              <div style={{ 
                fontSize: 12, 
                color: '#64748b', 
                marginTop: 4 
              }}>
                {project.tasks.length} 个任务 · {formatDate(project.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        padding: 20,
        overflowY: 'auto'
      }}>
        {!selectedProject ? (
          <div style={{ 
            textAlign: 'center', 
            paddingTop: 80,
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>选择一个项目或创建新项目</div>
            <div style={{ fontSize: 14 }}>开始组织你的任务和项目</div>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 24
            }}>
              <div>
                <div style={{ 
                  fontSize: 24, 
                  fontWeight: 700,
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: selectedProject.color
                  }} />
                  {selectedProject.name}
                </div>
                {selectedProject.description && (
                  <div style={{ 
                    fontSize: 14, 
                    color: '#64748b',
                    marginTop: 4
                  }}>
                    {selectedProject.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 10,
                  background: '#3b82f6',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                + 添加任务
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 16,
              marginBottom: 24
            }}>
              <div style={{ 
                padding: 16, 
                background: 'rgba(248, 250, 252, 0.05)', 
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{stats.todo}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>待办</div>
              </div>
              <div style={{ 
                padding: 16, 
                background: 'rgba(248, 250, 252, 0.05)', 
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{stats.inProgress}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>进行中</div>
              </div>
              <div style={{ 
                padding: 16, 
                background: 'rgba(248, 250, 252, 0.05)', 
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{stats.done}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>已完成</div>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 16 
            }}>
              {(['todo', 'in-progress', 'done'] as const).map(status => (
                <div key={status}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: status === 'todo' ? 'rgba(245, 158, 11, 0.1)' :
                               status === 'in-progress' ? 'rgba(59, 130, 246, 0.1)' :
                               'rgba(16, 185, 129, 0.1)',
                    color: status === 'todo' ? '#f59e0b' :
                          status === 'in-progress' ? '#3b82f6' :
                          '#10b981'
                  }}>
                    {status === 'todo' ? '📝 待办' :
                     status === 'in-progress' ? '🚀 进行中' : '✅ 已完成'}
                    <span style={{ float: 'right' }}>
                      {selectedProject.tasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                  <div style={{
                    minHeight: 200,
                    padding: 8,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 12
                  }}>
                    {selectedProject.tasks.filter(t => t.status === status).map(task => (
                      <div
                        key={task.id}
                        style={{
                          padding: 14,
                          marginBottom: 10,
                          background: '#1e293b',
                          borderRadius: 10,
                          border: '1px solid #334155',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#475569'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#334155'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          justifyContent: 'space-between',
                          marginBottom: 8
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            fontSize: 14,
                            color: '#f8fafc',
                            flex: 1
                          }}>
                            {task.title}
                          </div>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: getPriorityColor(task.priority)
                            }} />
                            <button
                              onClick={() => deleteTask(task.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                fontSize: 14,
                                padding: 2
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        {task.description && (
                          <div style={{ 
                            fontSize: 13, 
                            color: '#64748b',
                            marginBottom: 10 
                          }}>
                            {task.description}
                          </div>
                        )}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 10,
                          paddingTop: 10,
                          borderTop: '1px solid #334155'
                        }}>
                          {task.dueDate && (
                            <div style={{ 
                              fontSize: 11, 
                              color: '#64748b' 
                            }}>
                              📅 {new Date(task.dueDate).toLocaleDateString('zh-CN')}
                            </div>
                          )}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid #475569',
                              background: '#0f172a',
                              color: '#94a3b8',
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="todo">待办</option>
                            <option value="in-progress">进行中</option>
                            <option value="done">已完成</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showAddProject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddProject(false)}>
          <div style={{
            background: '#1e293b',
            padding: 24,
            borderRadius: 16,
            width: 400,
            border: '1px solid #334155'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              marginBottom: 16,
              color: '#f8fafc'
            }}>
              新建项目
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 6, 
                fontSize: 13,
                color: '#94a3b8'
              }}>
                项目名称
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="输入项目名称..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #475569',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: 14
                }}
                onKeyDown={e => e.key === 'Enter' && addProject()}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 6, 
                fontSize: 13,
                color: '#94a3b8'
              }}>
                项目描述（可选）
              </label>
              <textarea
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                placeholder="输入项目描述..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #475569',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddProject(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #475569',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                取消
              </button>
              <button
                onClick={addProject}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 8,
                  background: '#3b82f6',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddTask && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddTask(false)}>
          <div style={{
            background: '#1e293b',
            padding: 24,
            borderRadius: 16,
            width: 400,
            border: '1px solid #334155'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              marginBottom: 16,
              color: '#f8fafc'
            }}>
              添加任务
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 6, 
                fontSize: 13,
                color: '#94a3b8'
              }}>
                任务标题
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="输入任务标题..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #475569',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: 14
                }}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 6, 
                fontSize: 13,
                color: '#94a3b8'
              }}>
                任务描述（可选）
              </label>
              <textarea
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
                placeholder="输入任务描述..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #475569',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 12,
              marginBottom: 20
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 6, 
                  fontSize: 13,
                  color: '#94a3b8'
                }}>
                  优先级
                </label>
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#f8fafc',
                    fontSize: 14
                  }}
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 6, 
                  fontSize: 13,
                  color: '#94a3b8'
                }}>
                  截止日期（可选）
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#f8fafc',
                    fontSize: 14
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddTask(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #475569',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                取消
              </button>
              <button
                onClick={addTask}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 8,
                  background: '#3b82f6',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
