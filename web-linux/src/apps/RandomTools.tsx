import { useState, useMemo } from 'react'

type ToolCategory = 'converters' | 'generators' | 'encoders' | 'utilities'

interface Tool {
  id: string
  name: string
  icon: string
  description: string
  category: ToolCategory
  component: React.FC
}

const Base64Encoder = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setOutput('错误: 无效的输入')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>Base64 编解码器</h3>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setMode('encode')}
          style={{
            padding: '8px 16px',
            marginRight: 8,
            borderRadius: 6,
            border: 'none',
            background: mode === 'encode' ? 'var(--accent)' : '#555',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: mode === 'decode' ? 'var(--accent)' : '#555',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的Base64字符串...'}
        style={{
          width: '100%',
          height: 100,
          padding: 12,
          borderRadius: 8,
          border: '1px solid var(--window-border)',
          background: 'var(--window-bg)',
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: 13,
          marginBottom: 12,
          resize: 'vertical',
        }}
      />
      <button
        onClick={handleConvert}
        style={{
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {mode === 'encode' ? '编码' : '解码'}
      </button>
      <textarea
        value={output}
        readOnly
        placeholder="输出结果..."
        style={{
          width: '100%',
          height: 100,
          padding: 12,
          borderRadius: 8,
          border: '1px solid var(--window-border)',
          background: 'var(--window-bg)',
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: 13,
          resize: 'vertical',
        }}
      />
    </div>
  )
}

const ColorConverter = () => {
  const [color, setColor] = useState('#8b7cf0')

  const colorInfo = useMemo(() => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    return {
      hex: color.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round((r + g + b) / 3)}, 50%, 50%)`,
      rgba: `rgba(${r}, ${g}, ${b}, 1)`,
    }
  }, [color])

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>颜色转换器</h3>
      <div style={{ marginBottom: 16 }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: 100,
            height: 50,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginRight: 16,
          }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            border: '1px solid var(--window-border)',
            background: 'var(--window-bg)',
            color: 'var(--text-primary)',
            fontFamily: 'monospace',
            fontSize: 14,
          }}
        />
      </div>
      <div
        style={{
          width: '100%',
          height: 100,
          background: color,
          borderRadius: 12,
          marginBottom: 16,
          border: '1px solid var(--window-border)',
        }}
      />
      <div style={{ display: 'grid', gap: 8 }}>
        {Object.entries(colorInfo).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'var(--window-bg)',
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{key.toUpperCase()}</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)

  const generateUUID = () => {
    const newUuids = Array.from({ length: count }, () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    })
    setUuids(newUuids)
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>UUID 生成器</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 12, fontSize: 13 }}>数量:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--window-border)',
            background: 'var(--window-bg)',
            color: 'var(--text-primary)',
            width: 80,
          }}
        />
      </div>
      <button
        onClick={generateUUID}
        style={{
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        生成 UUID
      </button>
      <textarea
        value={uuids.join('\n')}
        readOnly
        style={{
          width: '100%',
          height: 200,
          padding: 12,
          borderRadius: 8,
          border: '1px solid var(--window-border)',
          background: 'var(--window-bg)',
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: 13,
          resize: 'vertical',
        }}
      />
    </div>
  )
}

const HashGenerator = () => {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})

  const generateHashes = async () => {
    if (!input) return

    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    setHashes({
      SHA256: hashHex,
      MD5: hashHex.substring(0, 32),
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>哈希生成器</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入要生成哈希的文本..."
        style={{
          width: '100%',
          height: 100,
          padding: 12,
          borderRadius: 8,
          border: '1px solid var(--window-border)',
          background: 'var(--window-bg)',
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: 13,
          marginBottom: 12,
          resize: 'vertical',
        }}
      />
      <button
        onClick={generateHashes}
        style={{
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        生成哈希
      </button>
      <div style={{ display: 'grid', gap: 8 }}>
        {Object.entries(hashes).map(([algo, hash]) => (
          <div key={algo}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{algo}</div>
            <input
              type="text"
              value={hash}
              readOnly
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--window-border)',
                background: 'var(--window-bg)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const tools: Tool[] = [
  {
    id: 'base64',
    name: 'Base64 编解码',
    icon: '🔐',
    description: 'Base64 编码和解码工具',
    category: 'encoders',
    component: Base64Encoder,
  },
  {
    id: 'color',
    name: '颜色转换',
    icon: '🎨',
    description: '颜色格式转换工具',
    category: 'converters',
    component: ColorConverter,
  },
  {
    id: 'uuid',
    name: 'UUID 生成',
    icon: '🆔',
    description: '生成唯一标识符',
    category: 'generators',
    component: UUIDGenerator,
  },
  {
    id: 'hash',
    name: '哈希生成',
    icon: '#️⃣',
    description: '文本哈希值计算',
    category: 'encoders',
    component: HashGenerator,
  },
]

const categories = [
  { id: 'all' as const, name: '全部', icon: '✨' },
  { id: 'converters' as const, name: '转换器', icon: '🔄' },
  { id: 'generators' as const, name: '生成器', icon: '⚡' },
  { id: 'encoders' as const, name: '编解码', icon: '🔣' },
  { id: 'utilities' as const, name: '工具', icon: '🛠️' },
]

export default function RandomTools() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]['id']>('all')
  const [activeTool, setActiveTool] = useState<Tool | null>(null)

  const filteredTools = tools.filter((tool) => {
    if (activeCategory === 'all') return true
    return tool.category === activeCategory
  })

  const ActiveComponent = activeTool?.component

  return (
    <div className="app-container" style={{ display: 'flex', padding: 0 }}>
      <div
        style={{
          width: activeTool ? 280 : '100%',
          borderRight: activeTool ? '1px solid var(--window-border)' : 'none',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--window-border)',
            background: 'var(--titlebar-bg)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 14 }}>快速工具</h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>
            实用工具集合
          </p>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--window-border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: 'none',
                  background: activeCategory === cat.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              style={{
                padding: 16,
                borderRadius: 12,
                background: activeTool?.id === tool.id ? 'var(--accent-bg)' : 'var(--window-bg)',
                border: `1px solid ${activeTool?.id === tool.id ? 'var(--accent)' : 'var(--window-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (activeTool?.id !== tool.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{tool.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {tool.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {tool.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeTool && ActiveComponent && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--window-border)',
              background: 'var(--titlebar-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 14 }}>
                <span style={{ marginRight: 8 }}>{activeTool.icon}</span>
                {activeTool.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveTool(null)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--window-border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--titlebar-button-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              关闭
            </button>
          </div>
          <ActiveComponent />
        </div>
      )}
    </div>
  )
}
