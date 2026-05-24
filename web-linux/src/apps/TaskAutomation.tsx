import { useState, useEffect, useCallback, useRef } from 'react'

interface AutomationTask {
  id: string
  name: string
  description: string
  trigger: 'manual' | 'interval' | 'file_change'
  interval?: number // in seconds
  actions: string[]
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
}

const initialTasks: AutomationTask[] = [
  {
    id: 'task-1',
    name: '备份重要文件',
    description: '定期备份 home 目录下的重要文件',
    trigger: 'interval',
    interval: 300, // 5 minutes
    actions: ['备份文档', '备份笔记'],
    enabled: true,
    lastRun: new Date(Date.now() - 3600000),
    nextRun: new Date(Date.now() + 300000),
    runCount: 12
  },
  {
    id: 'task-2',
    name: '清理临时文件',
    description: '清理 temp 目录下的临时文件',
    trigger: 'manual',
    actions: ['删除临时文件'],
    enabled: true,
    runCount: 5
  },
  {
    id: 'task-3',
    name: '系统报告',
    description: '定期生成系统使用情况报告',
    trigger: 'interval',
    interval: 600, // 10 minutes
    actions: ['CPU 检查', '内存检查', '网络检查'],
    enabled: false,
    runCount: 0
  }
]

export default function TaskAutomation() {
  const [tasks, setTasks] = useState<AutomationTask[]>(() => {
    const saved = localStorage.getItem('weblinux-automation-tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    '[系统] 任务自动化系统已启动',
    '[系统] 当前启用任务: 2 个'
  ])
  const [newTask, setNewTask] = useState<Partial<AutomationTask>>({
    name: '',
    description: '',
    trigger: 'manual',
    enabled: true,
    actions: []
  })
  const [newAction, setNewAction] = useState('')
  const logsEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  // 保存任务到 localStorage
  useEffect(() => {
    localStorage.setItem('weblinux-automation-tasks', JSON.stringify(tasks))
  }, [tasks])

  // 滚动到日志底部
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // 定时检查要运行的任务
  useEffect(() => {
    const checkTasks = () => {
      const now = new Date()
      setTasks(prev => prev.map(task => {
        if (task.enabled && task.trigger === 'interval' && task.interval && task.nextRun && now >= task.nextRun) {
          addLog(`[执行] 正在运行任务: ${task.name}`)
          // 模拟执行任务
          setTimeout(() => {
            addLog(`[完成] 任务已完成: ${task.name}`)
          }, 1000)
          
          return {
            ...task,
            lastRun: now,
            nextRun: new Date(now.getTime() + task.interval * 1000),
            runCount: task.runCount + 1
          }
        }
        return task
      }))
    }

    timerRef.current = setInterval(checkTasks, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-100))
  }, [])

  const handleAddTask = useCallback(() => {
    if (!newTask.name) return
    
    const task: AutomationTask = {
      id: `task-${Date.now()}`,
      name: newTask.name,
      description: newTask.description || '',
      trigger: newTask.trigger || 'manual',
      interval: newTask.interval,
      actions: newTask.actions || [],
      enabled: newTask.enabled !== false,
      runCount: 0,
      ...(newTask.trigger === 'interval' && newTask.interval ? {
        nextRun: new Date(Date.now() + newTask.interval * 1000)
      } : {})
    }
    
    setTasks(prev => [...prev, task])
    addLog(`[系统] 已创建新任务: ${task.name}`)
    setShowAddModal(false)
    setNewTask({ name: '', description: '', trigger: 'manual', enabled: true, actions: [] })
  }, [newTask, addLog])

  const handleDeleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      setTasks(prev => prev.filter(t => t.id !== id))
      addLog(`[系统] 已删除任务: ${task.name}`)
      if (selectedTaskId === id) {
        setSelectedTaskId(null)
      }
    }
  }, [tasks, selectedTaskId, addLog])

  const handleRunTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      addLog(`[执行] 正在手动运行任务: ${task.name}`)
      setTimeout(() => {
        addLog(`[完成] 任务已完成: ${task.name}`)
        setTasks(prev => prev.map(t => 
          t.id === id ? { ...t, lastRun: new Date(), runCount: t.runCount + 1 } : t
        ))
      }, 1000)
    }
  }, [tasks, addLog])

  const handleToggleTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      const newEnabled = !task.enabled
      setTasks(prev => prev.map(t => 
        t.id === id ? { 
          ...t, 
          enabled: newEnabled,
          ...(newEnabled && t.trigger === 'interval' && t.interval ? {
            nextRun: new Date(Date.now() + t.interval * 1000)
          } : {})
        } : t
      ))
      addLog(`[系统] 任务已${newEnabled ? '启用' : '禁用'}: ${task.name}`)
    }
  }, [tasks, addLog])

  const addActionToTask = useCallback(() => {
    if (newAction.trim()) {
      setNewTask(prev => ({
        ...prev,
        actions: [...(prev.actions || []), newAction.trim()]
      }))
      setNewAction('')
    }
  }, [newAction])

  const removeActionFromTask = useCallback((index: number) => {
    setNewTask(prev => ({
      ...prev,
      actions: (prev.actions || []).filter((_, i) => i !== index)
    }))
  }, [])

  const selectedTask = tasks.find(t => t.id === selectedTaskId)

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 顶部工具栏 */}
      <div className="app-toolbar">
        <button 
          className="app-toolbar-btn" 
          onClick={() => setShowAddModal(true)}
        >
          ➕ 新建任务
        </button>
        <span className="app-toolbar-separator" />
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
          已启用: {tasks.filter(t => t.enabled).length} / {tasks.length}
        </span>
      </div>

      {/* 主要内容区域 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 任务列表 */}
        <div style={{ 
          width: '40%', 
          borderRight: '1px solid var(--border-color)', 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border-color)',
            fontWeight: 'bold'
          }}>
            📋 自动化任务
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tasks.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                暂无任务，点击「新建任务」创建第一个任务
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: selectedTaskId === task.id ? 'var(--hover-color)' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%',
                        backgroundColor: task.enabled ? '#22c55e' : '#9ca3af'
                      }} />
                      <span style={{ fontWeight: '500' }}>{task.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {task.trigger === 'interval' ? '⏰ ' + task.interval + 's' : '👆 手动'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {task.description}
                  </div>
                  {task.lastRun && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      上次运行: {task.lastRun.toLocaleString()} · 运行 {task.runCount} 次
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 任务详情 */}
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedTask ? (
            <>
              <div style={{ 
                padding: '16px', 
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '4px' }}>{selectedTask.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    {selectedTask.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="app-toolbar-btn"
                    onClick={() => handleRunTask(selectedTask.id)}
                  >
                    ▶️ 运行
                  </button>
                  <button 
                    className="app-toolbar-btn"
                    onClick={() => handleToggleTask(selectedTask.id)}
                  >
                    {selectedTask.enabled ? '⏸️ 禁用' : '▶️ 启用'}
                  </button>
                  <button 
                    className="app-toolbar-btn"
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    style={{ color: '#ef4444' }}
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    触发方式
                  </label>
                  <div style={{ 
                    padding: '8px 12px', 
                    backgroundColor: 'var(--hover-color)',
                    borderRadius: '6px'
                  }}>
                    {selectedTask.trigger === 'interval' ? 
                      `⏰ 定时任务 (每 ${selectedTask.interval} 秒)` : 
                      '👆 手动触发'}
                  </div>
                </div>
                {selectedTask.trigger === 'interval' && selectedTask.nextRun && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                      下次运行
                    </label>
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: 'var(--hover-color)',
                      borderRadius: '6px'
                    }}>
                      {selectedTask.nextRun.toLocaleString()}
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    任务动作 ({selectedTask.actions.length})
                  </label>
                  {selectedTask.actions.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      此任务没有配置动作
                    </div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {selectedTask.actions.map((action, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{action}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    状态
                  </label>
                  <div style={{ 
                    display: 'flex',
                    gap: '16px',
                    padding: '12px', 
                    backgroundColor: 'var(--hover-color)',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>运行次数</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedTask.runCount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>启用状态</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {selectedTask.enabled ? '✅ 启用' : '⏸️ 禁用'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🤖</div>
                <div>选择一个任务查看详情</div>
              </div>
            </div>
          )}

          {/* 日志区域 */}
          <div style={{ 
            height: '40%', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '8px 12px', 
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '500' }}>📜 执行日志</span>
              <button 
                className="app-toolbar-btn"
                onClick={() => setLogs(['[系统] 日志已清空'])}
                style={{ fontSize: '12px' }}
              >
                清空
              </button>
            </div>
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '12px',
              backgroundColor: 'var(--code-bg-color)'
            }}>
              {logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '4px' }}>
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* 新建任务模态框 */}
      {showAddModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            backgroundColor: 'var(--bg-color)',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>新建自动化任务</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  任务名称 *
                </label>
                <input
                  type="text"
                  className="app-input"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入任务名称"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  任务描述
                </label>
                <textarea
                  className="app-input"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="输入任务描述"
                  style={{ width: '100%', minHeight: '60px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  触发方式
                </label>
                <select
                  className="app-input"
                  value={newTask.trigger}
                  onChange={(e) => setNewTask(prev => ({ 
                    ...prev, 
                    trigger: e.target.value as 'manual' | 'interval',
                    nextRun: e.target.value === 'interval' ? new Date() : undefined
                  }))}
                  style={{ width: '100%' }}
                >
                  <option value="manual">👆 手动触发</option>
                  <option value="interval">⏰ 定时触发</option>
                </select>
              </div>
              {newTask.trigger === 'interval' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    触发间隔 (秒)
                  </label>
                  <input
                    type="number"
                    className="app-input"
                    value={newTask.interval || ''}
                    onChange={(e) => setNewTask(prev => ({ ...prev, interval: Number(e.target.value) }))}
                    placeholder="例如: 60"
                    min="1"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  任务动作
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="app-input"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addActionToTask()}
                    placeholder="添加动作"
                    style={{ flex: 1 }}
                  />
                  <button 
                    className="app-toolbar-btn"
                    onClick={addActionToTask}
                  >
                    添加
                  </button>
                </div>
                <div>
                  {(newTask.actions || []).map((action, i) => (
                    <div 
                      key={i} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        backgroundColor: 'var(--hover-color)',
                        borderRadius: '4px',
                        marginBottom: '4px'
                      }}
                    >
                      <span>{action}</span>
                      <button 
                        onClick={() => removeActionFromTask(i)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  className="app-toolbar-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </button>
                <button 
                  className="app-toolbar-btn"
                  onClick={handleAddTask}
                  disabled={!newTask.name}
                  style={{ 
                    backgroundColor: newTask.name ? 'var(--accent-color)' : 'var(--border-color)',
                    color: 'white'
                  }}
                >
                  创建任务
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
