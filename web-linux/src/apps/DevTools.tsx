import { useState, useMemo } from 'react'

interface ToolTab {
  id: string
  name: string
  icon: string
}

const TOOLS: ToolTab[] = [
  { id: 'json', name: 'JSON 格式化', icon: '📋' },
  { id: 'base64', name: 'Base64 编解码', icon: '🔐' },
  { id: 'url', name: 'URL 编解码', icon: '🔗' },
  { id: 'hash', name: '哈希计算', icon: '🔍' },
  { id: 'uuid', name: 'UUID 生成', icon: '🆔' },
  { id: 'color', name: '颜色转换', icon: '🎨' },
]

const ColorPreview = ({ output }: { output: string }) => {
  const hexMatch = output.match(/#[a-fA-F0-9]{6}/)
  return hexMatch ? (
    <div style={{ 
      width: '100%', 
      height: '80px', 
      background: hexMatch[0],
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      marginBottom: '12px'
    }} />
  ) : null
}

export default function DevTools() {
  const [activeTab, setActiveTab] = useState('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const processInput = () => {
    setError('')
    try {
      let result = ''
      switch (activeTab) {
        case 'json': {
          const parsed = JSON.parse(input)
          result = JSON.stringify(parsed, null, 2)
          break
        }
        case 'base64':
          try {
            result = atob(input)
          } catch {
            result = btoa(input)
          }
          break
        case 'url':
          try {
            result = decodeURIComponent(input)
          } catch {
            result = encodeURIComponent(input)
          }
          break
        case 'hash': {
          const encoder = new TextEncoder()
          const data = encoder.encode(input)
          result = Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2, '0')).join('')
          break
        }
        case 'uuid':
          result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
          })
          break
        case 'color': {
          const hexMatch = input.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
          if (hexMatch) {
            const hex = hexMatch[1]
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16)
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16)
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16)
            result = `RGB: ${r}, ${g}, ${b}\nHSL: ${rgbToHsl(r, g, b)}\n${input} is valid!`
          } else {
            const rgbMatch = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
            if (rgbMatch) {
              const [, r, g, b] = rgbMatch.map(Number)
              result = `Hex: #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}\nHSL: ${rgbToHsl(r, g, b)}`
            } else {
              throw new Error('无效的颜色格式')
            }
          }
          break
        }
      }
      setOutput(result)
    } catch (e) {
      setError((e as Error).message || '处理失败')
      setOutput('')
    }
  }

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0; const l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const handleGenerateUuid = () => {
    setInput('')
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    setOutput(uuid)
  }

  const handleGenerateMultipleUuids = () => {
    const count = parseInt(input) || 5
    const uuids = Array.from({ length: Math.min(count, 100) }, () => 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    )
    setOutput(uuids.join('\n'))
  }

  const currentToolConfig = useMemo(() => {
    switch (activeTab) {
      case 'json':
        return {
          placeholder: '粘贴或输入 JSON 数据...',
          buttonText: '格式化',
          outputLabel: '格式化结果',
          autoProcess: true,
        }
      case 'base64':
        return {
          placeholder: '输入要编码/解码的文本...',
          buttonText: '转换',
          outputLabel: '转换结果',
          autoProcess: true,
        }
      case 'url':
        return {
          placeholder: '输入要编码/解码的URL...',
          buttonText: '转换',
          outputLabel: '转换结果',
          autoProcess: true,
        }
      case 'hash':
        return {
          placeholder: '输入要计算哈希的文本...',
          buttonText: '计算',
          outputLabel: 'MD5 哈希',
          autoProcess: true,
        }
      case 'uuid':
        return {
          placeholder: '输入数量（可选，默认5个）',
          buttonText: '生成',
          outputLabel: '生成的 UUID',
          autoProcess: false,
          customButton: true,
        }
      case 'color':
        return {
          placeholder: '输入颜色值（#hex 或 rgb(r,g,b)...',
          buttonText: '转换',
          outputLabel: '转换结果',
          autoProcess: true,
          showPreview: true,
        }
      default:
        return {
          placeholder: '',
          buttonText: '处理',
          outputLabel: '结果',
          autoProcess: false,
        }
    }
  }, [activeTab])

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    }}>
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTab(tool.id)
              setInput('')
              setOutput('')
              setError('')
            }}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: activeTab === tool.id ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
              color: activeTab === tool.id ? '#a5b4fc' : '#aaa',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom: activeTab === tool.id ? '2px solid #667eea' : '2px solid transparent',
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{tool.icon}</div>
            <div>{tool.name}</div>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <label style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
            输入
          </label>
          {activeTab === 'uuid' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentToolConfig.placeholder}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleGenerateUuid}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                生成单个
              </button>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (currentToolConfig.autoProcess) {
                  processInput()
                }
              }}
              placeholder={currentToolConfig.placeholder}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                minHeight: '100px',
              }}
            />
          )}
          {activeTab !== 'uuid' && !currentToolConfig.autoProcess && (
            <button
              onClick={processInput}
              style={{
                marginTop: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {currentToolConfig.buttonText}
            </button>
          )}
          {activeTab === 'uuid' && (
            <button
              onClick={handleGenerateMultipleUuids}
              style={{
                marginTop: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              生成多个
            </button>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ color: '#aaa', fontSize: '12px' }}>
              {currentToolConfig.outputLabel}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: copied ? '#22c55e' : '#aaa',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {copied ? '✓ 已复制' : '📋 复制'}
              </button>
            )}
          </div>
          {currentToolConfig.showPreview && <ColorPreview output={output} />}
          {error ? (
            <div style={{ 
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '14px',
            }}>
              ⚠️ {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                minHeight: '100px',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}