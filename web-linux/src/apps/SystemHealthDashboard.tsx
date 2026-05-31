import { useState, useEffect, useRef, useCallback, memo } from 'react'

interface MetricData {
  timestamp: number
  cpu: number
  memory: number
  disk: number
  network: number
}

interface SystemInfo {
  uptime: string
  loadAvg: number[]
  processes: number
  diskUsage: { used: number; total: number }
  memory: { used: number; total: number }
  cpu: { usage: number; cores: number }
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: number
}

interface Suggestion {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
}

const SystemHealthDashboard = memo(function SystemHealthDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'diagnostics' | 'history'>('overview')
  const [isMonitoring, setIsMonitoring] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxDataPoints = 60

  // 生成模拟系统数据
  const generateSystemData = useCallback((): SystemInfo => {
    const uptimeHours = Math.floor(Math.random() * 240) + 1
    const days = Math.floor(uptimeHours / 24)
    const hours = uptimeHours % 24
    
    return {
      uptime: `${days}天 ${hours}小时`,
      loadAvg: [
        (Math.random() * 2 + 0.5).toFixed(2) as unknown as number,
        (Math.random() * 1.5 + 0.3).toFixed(2) as unknown as number,
        (Math.random() * 1 + 0.2).toFixed(2) as unknown as number
      ],
      processes: Math.floor(Math.random() * 50 + 100),
      diskUsage: {
        used: Math.floor(Math.random() * 500 + 200),
        total: 1024
      },
      memory: {
        used: Math.floor(Math.random() * 8 + 4),
        total: 16
      },
      cpu: {
        usage: Math.random() * 100,
        cores: 8
      }
    }
  }, [])

  // 生成指标数据点
  const generateMetricData = useCallback((): MetricData => {
    return {
      timestamp: Date.now(),
      cpu: Math.random() * 100,
      memory: 40 + Math.random() * 40,
      disk: 30 + Math.random() * 20,
      network: Math.random() * 50
    }
  }, [])

  // 添加警告
  const addAlert = useCallback((type: 'warning' | 'error' | 'info', message: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    }
    setAlerts(prev => [alert, ...prev].slice(0, 10))
  }, [])

  // 生成智能建议
  const generateSuggestions = useCallback((info: SystemInfo) => {
    const newSuggestions: Suggestion[] = []
    
    if (info.cpu.usage > 80) {
      newSuggestions.push({
        id: '1',
        priority: 'high',
        title: 'CPU 使用率过高',
        description: '建议关闭一些不必要的应用程序以释放系统资源'
      })
    }
    
    if (info.memory.used / info.memory.total > 0.8) {
      newSuggestions.push({
        id: '2',
        priority: 'high',
        title: '内存使用率接近饱和',
        description: '考虑关闭一些后台应用或增加系统内存'
      })
    }
    
    if (info.diskUsage.used / info.diskUsage.total > 0.7) {
      newSuggestions.push({
        id: '3',
        priority: 'medium',
        title: '磁盘空间不足',
        description: '建议清理临时文件或卸载不需要的软件'
      })
    }
    
    newSuggestions.push({
      id: '4',
      priority: 'low',
      title: '定期系统维护',
      description: '建议每周进行一次系统清理和优化'
    })
    
    setSuggestions(newSuggestions)
  }, [])

  // 绘制图表
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || metrics.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.clearRect(0, 0, width, height)

    // 绘制背景网格
    ctx.strokeStyle = 'rgba(139, 124, 240, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // 绘制 CPU 线
    const drawLine = (data: number[], color: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      data.forEach((value, i) => {
        const x = padding + (i / (maxDataPoints - 1)) * (width - 2 * padding)
        const y = height - padding - (value / 100) * (height - 2 * padding)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    // 绘制区域填充
    const drawArea = (data: number[], color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      data.forEach((value, i) => {
        const x = padding + (i / (maxDataPoints - 1)) * (width - 2 * padding)
        const y = height - padding - (value / 100) * (height - 2 * padding)
        if (i === 0) ctx.moveTo(x, height - padding)
        ctx.lineTo(x, y)
      })
      ctx.lineTo(width - padding, height - padding)
      ctx.closePath()
      ctx.fill()
    }

    const cpuData = metrics.map(m => m.cpu)
    const memoryData = metrics.map(m => m.memory)
    const networkData = metrics.map(m => m.network)

    drawArea(cpuData, 'rgba(139, 124, 240, 0.15)')
    drawArea(memoryData, 'rgba(0, 206, 201, 0.1)')
    drawArea(networkData, 'rgba(255, 107, 107, 0.08)')

    drawLine(cpuData, '#8b7cf0')
    drawLine(memoryData, '#00cec9')
    drawLine(networkData, '#ff6b6b')

    // 绘制坐标轴标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '11px monospace'
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5)
      ctx.fillText(`${100 - i * 20}%`, 5, y + 4)
    }
  }, [metrics])

  // 初始化和定时更新
  useEffect(() => {
    const initialInfo = generateSystemData()
    setSystemInfo(initialInfo)
    generateSuggestions(initialInfo)

    // 初始化指标数据
    const initialMetrics: MetricData[] = []
    for (let i = 0; i < 20; i++) {
      initialMetrics.push(generateMetricData())
    }
    setMetrics(initialMetrics)
  }, [generateSystemData, generateSuggestions, generateMetricData])

  // 定时更新数据
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const info = generateSystemData()
      setSystemInfo(info)
      
      setMetrics(prev => {
        const newMetrics = [...prev, generateMetricData()]
        return newMetrics.slice(-maxDataPoints)
      })

      // 随机生成警告
      if (Math.random() < 0.1) {
        const types: Array<'warning' | 'error' | 'info'> = ['warning', 'error', 'info']
        const type = types[Math.floor(Math.random() * types.length)]
        const messages = [
          '检测到临时文件堆积',
          '系统缓存占用过高',
          '建议进行系统优化',
          '网络连接不稳定'
        ]
        addAlert(type, messages[Math.floor(Math.random() * messages.length)])
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isMonitoring, generateSystemData, generateMetricData, addAlert])

  // 绘制图表
  useEffect(() => {
    drawChart()
  }, [metrics, drawChart])

  const currentMetric = metrics[metrics.length - 1]

  const getStatusColor = (value: number) => {
    if (value > 80) return '#ff6b6b'
    if (value > 60) return '#feca57'
    return '#00cec9'
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'error': return '🔴'
      case 'warning': return '🟡'
      case 'info': return '🔵'
      default: return '⚪'
    }
  }

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      color: '#e8e8f4'
    }}>
      {/* 顶部标题栏 */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(139, 124, 240, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🩺</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>智能系统健康监控</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
              实时监控 · 智能诊断 · 性能优化
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            style={{
              padding: '6px 16px',
              background: isMonitoring ? '#00cec9' : '#ff6b6b',
              border: 'none',
              borderRadius: '6px',
              color: '#1a1a2e',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isMonitoring ? '⏸️ 暂停监控' : '▶️ 开始监控'}
          </button>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isMonitoring ? '#00cec9' : '#666',
            boxShadow: isMonitoring ? '0 0 10px #00cec9' : 'none',
            animation: isMonitoring ? 'pulse 1.5s infinite' : 'none'
          }} />
        </div>
      </div>

      {/* 标签切换 */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {[
          { id: 'overview', label: '概览', icon: '📊' },
          { id: 'performance', label: '性能', icon: '⚡' },
          { id: 'diagnostics', label: '诊断', icon: '🔍' },
          { id: 'history', label: '历史', icon: '📜' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'rgba(139, 124, 240, 0.2)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(139, 124, 240, 0.4)' : '1px solid transparent',
              borderRadius: '8px',
              color: activeTab === tab.id ? '#8b7cf0' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 600 : 500,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 主内容区域 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 核心指标卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {currentMetric && systemInfo && [
                {
                  label: 'CPU 使用率',
                  value: `${currentMetric.cpu.toFixed(1)}%`,
                  icon: '🖥️',
                  color: getStatusColor(currentMetric.cpu),
                  detail: `${systemInfo.cpu.cores} 核心`
                },
                {
                  label: '内存使用',
                  value: `${(systemInfo.memory.used / systemInfo.memory.total * 100).toFixed(1)}%`,
                  icon: '🧠',
                  color: getStatusColor((systemInfo.memory.used / systemInfo.memory.total) * 100),
                  detail: `${systemInfo.memory.used}GB / ${systemInfo.memory.total}GB`
                },
                {
                  label: '磁盘使用',
                  value: `${(systemInfo.diskUsage.used / systemInfo.diskUsage.total * 100).toFixed(1)}%`,
                  icon: '💾',
                  color: getStatusColor((systemInfo.diskUsage.used / systemInfo.diskUsage.total) * 100),
                  detail: `${systemInfo.diskUsage.used}GB / ${systemInfo.diskUsage.total}GB`
                },
                {
                  label: '网络流量',
                  value: `${currentMetric.network.toFixed(1)} Mbps`,
                  icon: '🌐',
                  color: '#8b7cf0',
                  detail: '实时速率'
                }
              ].map((metric, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '28px' }}>{metric.icon}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: metric.color }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                        {metric.label}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '12px',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${metric.color}, ${metric.color}88)`,
                      width: metric.value.includes('%') ? metric.value : `${Math.min(parseFloat(metric.value), 100)}%`,
                      borderRadius: '2px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px' }}>
                    {metric.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* 图表区域 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>📈 实时性能趋势</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '2px', background: '#8b7cf0' }} /> CPU
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '2px', background: '#00cec9' }} /> 内存
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '2px', background: '#ff6b6b' }} /> 网络
                  </span>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            {/* 系统信息和智能建议并排 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* 系统信息 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>💻 系统信息</h3>
                {systemInfo && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: '系统运行时间', value: systemInfo.uptime, icon: '⏱️' },
                      { label: '进程数量', value: systemInfo.processes.toString(), icon: '📋' },
                      { label: '负载平均值', value: systemInfo.loadAvg.map(v => `${v}`).join(' · '), icon: '📊' },
                      { label: 'CPU 核心', value: `${systemInfo.cpu.cores} 核心`, icon: '⚡' }
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: i < 3 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                      }}>
                        <span style={{ opacity: 0.7, fontSize: '13px' }}>{item.icon} {item.label}</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 智能建议 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>💡 智能建议</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      style={{
                        padding: '12px',
                        background: suggestion.priority === 'high' ? 'rgba(255, 107, 107, 0.1)' :
                                  suggestion.priority === 'medium' ? 'rgba(254, 202, 87, 0.1)' :
                                  'rgba(0, 206, 201, 0.08)',
                        border: `1px solid ${suggestion.priority === 'high' ? 'rgba(255, 107, 107, 0.2)' :
                                      suggestion.priority === 'medium' ? 'rgba(254, 202, 87, 0.2)' :
                                      'rgba(0, 206, 201, 0.15)'}`,
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{suggestion.title}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: suggestion.priority === 'high' ? 'rgba(255, 107, 107, 0.2)' :
                                    suggestion.priority === 'medium' ? 'rgba(254, 202, 87, 0.2)' :
                                    'rgba(0, 206, 201, 0.15)',
                          color: suggestion.priority === 'high' ? '#ff6b6b' :
                                suggestion.priority === 'medium' ? '#feca57' : '#00cec9',
                          fontWeight: 600
                        }}>
                          {suggestion.priority === 'high' ? '高' : suggestion.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 警告列表 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>
                ⚠️ 系统警告 ({alerts.length})
              </h3>
              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', opacity: 0.5 }}>
                  <span style={{ fontSize: '32px' }}>✅</span>
                  <p style={{ marginTop: '8px', fontSize: '13px' }}>系统运行正常，无警告</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflow: 'auto' }}>
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{getStatusIcon(alert.type)}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13px' }}>{alert.message}</p>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: '11px',
                          opacity: 0.5
                        }}>
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>⚡</span>
              <h3 style={{ margin: '16px 0 8px 0' }}>性能分析</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
                深度性能分析和优化建议
              </p>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #8b7cf0 0%, #a29bfe 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  运行性能测试
                </button>
                <button style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  查看历史报告
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>🔍</span>
              <h3 style={{ margin: '16px 0 8px 0' }}>系统诊断</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
                自动检测和修复系统问题
              </p>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #00cec9 0%, #00b894 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  开始诊断
                </button>
                <button style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  查看诊断历史
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>📜</span>
              <h3 style={{ margin: '16px 0 8px 0' }}>历史记录</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
                查看系统性能历史和趋势分析
              </p>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  导出历史数据
                </button>
                <button style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}>
                  清除历史
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
})

export default SystemHealthDashboard
