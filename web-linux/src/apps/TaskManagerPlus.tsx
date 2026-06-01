import { useState, useMemo } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
  dueDate?: string
  tags: string[]
  createdAt: Date
  completedAt?: Date
}

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
}

const STATUS_LABELS = {
  todo: '待办',
  'in-progress': '进行中',
  done: '已完成',
}

const DEFAULT_TAGS = ['工作', '学习', '生活', '健康', '创意', '其他']

export default function TaskManagerPlus() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成 Web Linux OS 开发',
      description: '继续开发和优化 Web Linux 操作系统的功能',
      priority: 'high',
      status: 'in-progress',
      tags: ['工作', '学习'],
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: '2',
      title: '学习 React 19 新特性',
      description: '研究并实践 React 19 的新功能和最佳实践',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      tags: ['学习'],
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: '健身计划',
      priority: 'low',
      status: 'done',
      tags: ['健康'],
      createdAt: new Date(Date.now() - 86400000 * 3),
      completedAt: new Date(Date.now() - 86400000),
    },
  ])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    tags: [] as string[],
    dueDate: '',
  })
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => task.tags.includes(tag))
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesStatus && matchesPriority && matchesTags && matchesSearch
    })
  }, [tasks, selectedStatus, selectedPriority, selectedTags, searchQuery])

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    }
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'todo',
      createdAt: new Date(),
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      tags: [],
      dueDate: '',
    })
    setShowAddTask(false)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'done') return false
    return new Date(task.dueDate) < new Date()
  }

  return (
    <div className="app-container" style={{ 
      padding: '20px', 
      height: '100%', 
      overflow: 'auto',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    }}>
      {/* 头部 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '24px' }}>📋 任务管理</h2>
          <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>
            高效管理你的日常任务和项目
          </p>
        </div>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {showAddTask ? '✕ 取消' : '+ 新建任务'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '总计', value: stats.total, color: '#667eea', icon: '📊' },
          { label: '待办', value: stats.todo, color: '#f59e0b', icon: '⏳' },
          { label: '进行中', value: stats['in-progress'], color: '#3b82f6', icon: '🔄' },
          { label: '已完成', value: stats.done, color: '#10b981', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 添加任务表单 */}
      {showAddTask && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <h3 style={{ color: '#fff', margin: '0 0 16px 0' }}>创建新任务</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="任务标题"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <textarea
              placeholder="任务描述（可选）"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>标签（点击切换）</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {DEFAULT_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setNewTask({
                      ...newTask,
                      tags: newTask.tags.includes(tag)
                        ? newTask.tags.filter(t => t !== tag)
                        : [...newTask.tags, tag]
                    })}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      background: newTask.tags.includes(tag)
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddTask(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={addTask}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                创建任务
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 筛选栏 */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <input
          type="text"
          placeholder="🔍 搜索任务..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '12px',
          }}
        />
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'todo', 'in-progress', 'done'] as const).map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedStatus === status
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {status === 'all' ? '全部' : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {(['all', 'low', 'medium', 'high'] as const).map(priority => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedPriority === priority
                    ? `linear-gradient(135deg, ${PRIORITY_COLORS[priority === 'all' ? 'medium' : priority]} 0%, ${PRIORITY_COLORS[priority === 'all' ? 'high' : priority]} 100%)`
                    : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {priority === 'all' ? '所有优先级' : (priority === 'low' ? '低' : priority === 'medium' ? '中' : '高')}
              </button>
            ))}
          </div>
        </div>
        {selectedTags.length > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '12px', lineHeight: '28px' }}>标签筛选：</span>
            {DEFAULT_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedTags.includes(tag)
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  opacity: selectedTags.includes(tag) ? 1 : 0.5,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 任务列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#888',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>没有找到任务</div>
            <div style={{ fontSize: '14px' }}>尝试调整筛选条件或创建新任务</div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]}`,
                opacity: task.status === 'done' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{
                      color: '#fff',
                      margin: 0,
                      fontSize: '16px',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: PRIORITY_COLORS[task.priority],
                      background: `${PRIORITY_COLORS[task.priority]}20`,
                    }}>
                      {task.priority === 'low' ? '低' : task.priority === 'medium' ? '中' : '高'}
                    </span>
                    {isOverdue(task) && (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#ef4444',
                        background: '#ef444420',
                      }}>
                        已逾期
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p style={{
                      color: '#aaa',
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {task.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#a5b4fc',
                        background: 'rgba(102, 126, 234, 0.15)',
                      }}>
                        #{tag}
                      </span>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center', color: '#666', fontSize: '12px' }}>
                      <span>创建于 {formatDate(task.createdAt)}</span>
                      {task.dueDate && <span>📅 截止 {task.dueDate}</span>}
                      {task.completedAt && <span>✅ 完成于 {formatDate(task.completedAt)}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, {
                      status: e.target.value as any,
                      completedAt: e.target.value === 'done' ? new Date() : undefined,
                    })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  >
                    <option value="todo">待办</option>
                    <option value="in-progress">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
