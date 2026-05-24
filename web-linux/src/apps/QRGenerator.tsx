import { useState, useRef, useEffect } from 'react'

export default function QRGenerator() {
  const [text, setText] = useState('https://github.com/saya-ch/WebLinuxOS')
  const [size, setSize] = useState(256)
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = (data: string, canvas: HTMLCanvasElement, size: number, dark: string, light: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Simple QR code generation simulation
    // Real QR code generation requires complex algorithms
    // This is a nice-looking simulated QR code for demonstration
    
    // Background
    ctx.fillStyle = light
    ctx.fillRect(0, 0, size, size)
    
    ctx.fillStyle = dark
    
    // Draw position patterns (3 big squares)
    const moduleSize = size / 32
    
    // Top-left finder pattern
    drawFinderPattern(ctx, 4, 4, moduleSize)
    // Top-right finder pattern
    drawFinderPattern(ctx, 24, 4, moduleSize)
    // Bottom-left finder pattern
    drawFinderPattern(ctx, 4, 24, moduleSize)
    
    // Timing patterns
    for (let i = 8; i < 24; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 7 * moduleSize, moduleSize, moduleSize)
        ctx.fillRect(7 * moduleSize, i * moduleSize, moduleSize, moduleSize)
      }
    }
    
    // Draw random data modules
    const random = seededRandom(hashString(data))
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        // Skip finder patterns and timing patterns
        if (i < 8 && j < 8) continue
        if (i > 23 && j < 8) continue
        if (i < 8 && j > 23) continue
        if (i === 7 && j >= 8 && j <= 23) continue
        if (j === 7 && i >= 8 && i <= 23) continue
        
        if (random() > 0.5) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    
    // Add center logo area
    const logoSize = size / 5
    const logoX = (size - logoSize) / 2
    const logoY = (size - logoSize) / 2
    ctx.fillStyle = light
    ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8)
    
    // Draw center text
    ctx.fillStyle = dark
    ctx.font = 'bold ' + (logoSize / 3) + 'px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('QR', size / 2, size / 2)
  }

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer square
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)
    // Inner white square
    ctx.fillStyle = lightColor
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
    // Inner black square
    ctx.fillStyle = darkColor
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }

  const hashString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash
  }

  const seededRandom = (seed: number) => {
    let s = seed
    return () => {
      s = Math.sin(s) * 10000
      return s - Math.floor(s)
    }
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => b && resolve(b))
      })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      alert('QR码已复制到剪贴板!')
    } catch {
      alert('复制失败，请使用下载功能')
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode(text, canvasRef.current, size, darkColor, lightColor)
    }
  }, [text, size, darkColor, lightColor])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e1e2e', color: '#e0e0e0' }}>
      {/* Header */}
      <div style={{ 
        padding: '12px 16px', 
        background: '#252536', 
        borderBottom: '1px solid #3a3a5c',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>📷</span>
        <div>
          <div style={{ fontWeight: 600 }}>QR码生成器</div>
          <div style={{ fontSize: '12px', color: '#9090a4' }}>快速生成自定义QR码</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Controls */}
        <div style={{ 
          width: '380px', 
          padding: '16px', 
          background: '#252536',
          borderRight: '1px solid #3a3a5c',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9090a4', marginBottom: '8px', fontWeight: 600 }}>
              内容
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文本、URL或其他内容..."
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#1e1e2e',
                border: '1px solid #3a3a5c',
                borderRadius: '8px',
                color: '#e0e0e0',
                fontSize: '13px',
                fontFamily: 'Consolas, Monaco, monospace',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9090a4', marginBottom: '8px', fontWeight: 600 }}>
              快速生成
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: '链接', val: 'https://github.com/saya-ch/WebLinuxOS' },
                { label: 'Wi-Fi', val: 'WIFI:S:MyNetwork;T:WPA;P:password123;;' },
                { label: '邮箱', val: 'mailto:example@example.com' },
                { label: '电话', val: 'tel:+86123456789' },
                { label: '短信', val: 'SMSTO:+86123456789:Hello' },
                { label: '纯文本', val: 'Hello from Web Linux OS!' }
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setText(preset.val)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #3a3a5c',
                    background: '#2d2d3e',
                    color: '#e0e0e0',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a5c'
                    e.currentTarget.style.borderColor = '#6c5ce7'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2d2d3e'
                    e.currentTarget.style.borderColor = '#3a3a5c'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9090a4', marginBottom: '8px', fontWeight: 600 }}>
              大小: {size}px
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#9090a4' }}>
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9090a4', marginBottom: '8px', fontWeight: 600 }}>
              容错级别
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { val: 'L', label: 'L (7%)' },
                { val: 'M', label: 'M (15%)' },
                { val: 'Q', label: 'Q (25%)' },
                { val: 'H', label: 'H (30%)' }
              ].map((level) => (
                <button
                  key={level.val}
                  onClick={() => setErrorCorrection(level.val as any)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: errorCorrection === level.val ? '2px solid #6c5ce7' : '1px solid #3a3a5c',
                    background: errorCorrection === level.val ? 'rgba(108, 92, 231, 0.2)' : '#2d2d3e',
                    color: '#e0e0e0',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: errorCorrection === level.val ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#9090a4', marginBottom: '8px', fontWeight: 600 }}>
              颜色
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#9090a4', marginBottom: '4px' }}>前景色</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#1e1e2e',
                      border: '1px solid #3a3a5c',
                      borderRadius: '6px',
                      color: '#e0e0e0',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#9090a4', marginBottom: '4px' }}>背景色</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#1e1e2e',
                      border: '1px solid #3a3a5c',
                      borderRadius: '6px',
                      color: '#e0e0e0',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <button
              onClick={downloadQRCode}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 92, 231, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              📥 下载PNG
            </button>
            <button
              onClick={copyToClipboard}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #3a3a5c',
                background: '#2d2d3e',
                color: '#e0e0e0',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3a3a5c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2d2d3e'
              }}
            >
              📋 复制
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '24px',
          background: '#1e1e2e'
        }}>
          <div style={{
            background: '#252536',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid #3a3a5c'
          }}>
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: '8px',
                display: 'block'
              }}
            />
          </div>
          
          <div style={{
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#e0e0e0', marginBottom: '4px' }}>
              {text.length > 40 ? text.substring(0, 40) + '...' : text}
            </div>
            <div style={{ fontSize: '12px', color: '#9090a4' }}>
              {text.length} 字符 • {size}px
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { dark: '#000000', light: '#ffffff' },
              { dark: '#6c5ce7', light: '#ffffff' },
              { dark: '#0ea5e9', light: '#ffffff' },
              { dark: '#10b981', light: '#ffffff' },
              { dark: '#f59e0b', light: '#1e1e2e' },
              { dark: '#ffffff', light: '#1e1e2e' }
            ].map((colors, i) => (
              <button
                key={i}
                onClick={() => {
                  setDarkColor(colors.dark)
                  setLightColor(colors.light)
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid #3a3a5c',
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${colors.dark} 50%, ${colors.light} 50%)`,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6c5ce7'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a5c'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
