import { useState, useCallback, useEffect } from 'react'
import { useStore } from '../store'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  createdAt: string
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: '待办',
    color: '#3b82f6',
    tasks: [
      {
        id: '1',
        title: '设计界面原型',
        description: '创建WebLinuxOS的新界面设计',
        priority: 'high',
        tags: ['设计', 'UI'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: '代码重构',
        priority: 'medium',
        tags: ['开发'],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'in-progress',
    title: '进行中',
    color: '#f59e0b',
    tasks: [
      {
        id: '3',
        title: '实现任务看板',
        description: '开发新的Kanban Board应用',
        priority: 'high',
        tags: ['开发', '新功能'],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'done',
    title: '已完成',
    color: '#22c55e',
    tasks: [
      {
        id: '4',
        title: '优化天气应用',
        priority: 'low',
        tags: ['优化'],
        createdAt: new Date().toISOString()
      }
    ]
  }
]

export default function KanbanBoard() {
  const { theme } = useStore()
  const isDark = theme === 'dark'
  
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem('kanban-data')
    return saved ? JSON.parse(saved) : initialColumns
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentColumnId, setCurrentColumnId] = useState<string>(columns[0]?.id || '')
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumnId: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(columns))
  }, [columns])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const addTask = useCallback(() => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
      createdAt: new Date().toISOString()
    }
    setColumns(prev => prev.map(col =>
      col.id === currentColumnId
        ? { ...col, tasks: [task, ...col.tasks] }
        : col
    ))
    setNewTask({ title: '', description: '', priority: 'medium', tags: [] })
    setShowAddModal(false)
  }, [newTask, currentColumnId])

  const addTag = useCallback(() => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }, [tagInput, newTask.tags])

  const removeTag = useCallback((tag: string) => {
    setNewTask(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }, [])

  const removeTask = useCallback((columnId: string, taskId: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ))
  }, [])

  const moveTask = useCallback((toColumnId: string) => {
    if (!draggedTask) return
    setColumns(prev => {
      const newColumns = [...prev]
      const fromCol = newColumns.find(c => c.id === draggedTask.fromColumnId)
      const toCol = newColumns.find(c => c.id === toColumnId)
      if (!fromCol || !toCol) return prev
      const taskIndex = fromCol.tasks.findIndex(t => t.id === draggedTask.task.id)
      if (taskIndex !== -1) {
        const [task] = fromCol.tasks.splice(taskIndex, 1)
        toCol.tasks.push(task)
      }
      return newColumns
    })
    setDraggedTask(null)
  }, [draggedTask])

  const filteredColumns = columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  }))

  const bg = isDark ? '#1e1e2e' : '#f5f5f5'
  const cardBg = isDark ? '#2a2a4a' : '#ffffff'
  const textColor = isDark ? '#cdd6f4' : '#333333'
  const secondaryText = isDark ? '#a0a0c8' : '#666666'

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: bg,
      color: textColor,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: isDark ? '1px solid #313244' : '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            📋 任务看板
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: isDark ? '1px solid #45475a' : '1px solid #ddd',
              background: isDark ? '#181825' : '#fff',
              color: textColor,
              outline: 'none',
              fontSize: '13px'
            }}
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: isDark ? '1px solid #45475a' : '1px solid #ddd',
              background: isDark ? '#181825' : '#fff',
              color: textColor,
              outline: 'none',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <option value="all">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        gap: '16px',
        padding: '16px',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        {filteredColumns.map(column => (
          <div
            key={column.id}
            style={{
              flex: '0 0 320px',
              display: 'flex',
              flexDirection: 'column',
              background: isDark ? '#181825' : '#f0f0f0',
              borderRadius: '12px',
              padding: '12px'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => moveTask(column.id)}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${column.color}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: column.color
                }} />
                <span style={{ fontWeight: 600, fontSize: '15px' }}>
                  {column.title}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: secondaryText,
                  background: isDark ? '#313244' : '#e0e0e0',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentColumnId(column.id)
                  setShowAddModal(true)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textColor,
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#313244' : '#e0e0e0'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                +
              </button>
            </div>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTask({ task, fromColumnId: column.id })}
                  onDragEnd={() => setDraggedTask(null)}
                  style={{
                    background: cardBg,
                    padding: '14px',
                    borderRadius: '10px',
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    border: isDark ? '1px solid #313244' : '1px solid #e0e0e0',
                    boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>
                      {task.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTask(column.id, task.id)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: secondaryText,
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '16px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {task.description && (
                    <p style={{
                      margin: '0 0 10px 0',
                      fontSize: '12px',
                      color: secondaryText,
                      lineHeight: 1.5
                    }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {task.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isDark ? '#313244' : '#e8e8e8',
                          color: secondaryText
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        background: getPriorityColor(task.priority),
                        color: '#fff',
                        fontWeight: 500
                      }}
                    >
                      {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                    <span style={{ fontSize: '10px', color: secondaryText }}>
                      {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: cardBg,
            padding: '24px',
            borderRadius: '16px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>
              添加新任务
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: secondaryText, display: 'block', marginBottom: '4px' }}>
                  任务标题
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="输入任务标题..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #45475a' : '1px solid #ddd',
                    background: isDark ? '#181825' : '#fff',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: secondaryText, display: 'block', marginBottom: '4px' }}>
                  描述
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="输入任务描述..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #45475a' : '1px solid #ddd',
                    background: isDark ? '#181825' : '#fff',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: secondaryText, display: 'block', marginBottom: '4px' }}>
                  优先级
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #45475a' : '1px solid #ddd',
                    background: isDark ? '#181825' : '#fff',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: secondaryText, display: 'block', marginBottom: '4px' }}>
                  标签
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  {newTask.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: isDark ? '#313244' : '#e8e8e8',
                        color: secondaryText
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: secondaryText,
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '12px',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="添加标签，按Enter确认"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #45475a' : '1px solid #ddd',
                    background: isDark ? '#181825' : '#fff',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isDark ? '#313244' : '#e8e8e8',
                    color: textColor,
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={addTask}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#8b5cf6',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                >
                  添加任务
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
