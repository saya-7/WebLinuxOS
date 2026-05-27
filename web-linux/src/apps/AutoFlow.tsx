import { useState, useRef } from 'react'

interface NodeConfig {
  [key: string]: string | number | boolean | undefined
}

interface Node {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'output'
  x: number
  y: number
  label: string
  icon: string
  config?: NodeConfig
}

interface Connection {
  id: string
  from: string
  to: string
}

export default function AutoFlow() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'trigger', x: 80, y: 150, label: '定时触发', icon: '⏰' },
    { id: '2', type: 'action', x: 280, y: 100, label: '获取天气', icon: '🌤️' },
    { id: '3', type: 'condition', x: 480, y: 80, label: '是否下雨', icon: '🔀' },
    { id: '4', type: 'action', x: 680, y: 50, label: '发送提醒', icon: '📱' },
    { id: '5', type: 'action', x: 680, y: 150, label: '记录日志', icon: '📝' },
  ])
  
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', from: '1', to: '2' },
    { id: 'c2', from: '2', to: '3' },
    { id: 'c3', from: '3', to: '4' },
    { id: 'c4', from: '3', to: '5' },
  ])
  
  const [isRunning, setIsRunning] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Mark variables as used to avoid TS errors
  void setConnections;
  void setNodes;
  
  const nodeTypes = [
    { type: 'trigger', label: '触发器', icon: '⚡' },
    { type: 'action', label: '动作', icon: '🎯' },
    { type: 'condition', label: '条件', icon: '🔀' },
    { type: 'output', label: '输出', icon: '📤' },
  ]
  
  const runWorkflow = async () => {
    setIsRunning(true)
    for (const node of nodes) {
      setActiveNode(node.id)
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    setActiveNode(null)
    setIsRunning(false)
  }
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return '#8b5cf6'
      case 'action': return '#3b82f6'
      case 'condition': return '#f59e0b'
      case 'output': return '#22c55e'
      default: return '#6b7280'
    }
  }
  
  return (
    <div 
      className="app-container app-autoflow"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        background: '#0f172a', 
        color: '#fff' 
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 20px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🔄</span>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>AutoFlow</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>可视化工作流自动化</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              const newNode: Node = {
                id: Date.now().toString(),
                type: 'action',
                x: 100 + Math.random() * 200,
                y: 100 + Math.random() * 100,
                label: '新节点',
                icon: '📦',
              }
              setNodes([...nodes, newNode])
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            + 添加节点
          </button>
          <button
            onClick={runWorkflow}
            disabled={isRunning}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: 'none',
              background: isRunning ? 'rgba(34, 197, 94, 0.3)' : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: '#fff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {isRunning ? '⏳ 运行中...' : '▶️ 运行工作流'}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ 
          width: 220, 
          borderRight: '1px solid rgba(255,255,255,0.1)', 
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              节点类型
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nodeTypes.map((nt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 12,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(${nt.type === 'trigger' ? '139,92,246' : nt.type === 'action' ? '59,130,246' : nt.type === 'condition' ? '245,158,11' : '34,197,94'},0.15)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span style={{ fontSize: 20 }}>{nt.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{nt.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              快速模板
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '📧', label: '邮件提醒', desc: '定时发送邮件' },
                { icon: '📊', label: '数据同步', desc: '定期备份数据' },
                { icon: '🔔', label: '通知系统', desc: '多渠道通知' },
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    background: 'rgba(59,130,246,0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(59,130,246,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{t.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#93c5fd' }}>{t.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'auto' }} ref={canvasRef}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}>
            {/* Connections */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {connections.map((conn) => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                if (!fromNode || !toNode) return null
                
                const startX = fromNode.x + 160
                const startY = fromNode.y + 40
                const endX = toNode.x
                const endY = toNode.y + 40
                const midX = (startX + endX) / 2
                
                return (
                  <path
                    key={conn.id}
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={activeNode === conn.from || activeNode === conn.to ? '#8b5cf6' : '#475569'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                )
              })}
            </svg>
            
            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: 160,
                  background: activeNode === node.id 
                    ? `linear-gradient(135deg, ${getNodeColor(node.type)} 0%, ${getNodeColor(node.type)}cc 100%)`
                    : 'rgba(30, 41, 59, 0.95)',
                  borderRadius: 14,
                  border: `2px solid ${activeNode === node.id ? '#fff' : getNodeColor(node.type)}`,
                  padding: 12,
                  boxShadow: activeNode === node.id 
                    ? `0 0 30px ${getNodeColor(node.type)}50` 
                    : '0 4px 6px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'grab',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{node.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{node.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{node.type}</div>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  gap: 4,
                }}>
                  <div style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    background: getNodeColor(node.type),
                    border: '2px solid #0f172a',
                  }} />
                  <div style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    background: getNodeColor(node.type),
                    border: '2px solid #0f172a',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Panel */}
        <div style={{ 
          width: 260, 
          borderLeft: '1px solid rgba(255,255,255,0.1)', 
          padding: 16,
          overflow: 'auto',
        }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            属性面板
          </h3>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 14,
            marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6, fontWeight: 600 }}>
              工作流名称
            </label>
            <input 
              type="text" 
              defaultValue="天气提醒工作流"
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.2)',
                color: '#e2e8f0',
                fontSize: 13,
              }}
            />
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 14,
            marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6, fontWeight: 600 }}>
              运行状态
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              padding: 10,
              background: isRunning ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
              borderRadius: 8,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isRunning ? '#22c55e' : '#64748b',
                animation: isRunning ? 'pulse 1.5s infinite' : 'none',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: isRunning ? '#86efac' : '#94a3b8' }}>
                {isRunning ? '正在运行' : '就绪'}
              </span>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(59,130,246,0.1)', 
            borderRadius: 12, 
            padding: 14,
            border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <div style={{ fontSize: 12, color: '#93c5fd', marginBottom: 8, fontWeight: 600 }}>
              💡 使用提示
            </div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              拖拽节点到画布，连接节点创建工作流。点击运行按钮执行自动化任务。
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
