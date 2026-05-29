import { useState } from 'react'
import { 
  CodeIcon, CalculatorIcon, GlobeIcon, 
  FileJsonIcon, PaletteIcon, ChevronRight
} from '../icons'

function QrCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="6" y="6" width="12" height="12" rx="2"/>
      <path d="M10 10h4M14 10h0M10 14h4M14 14h0"/>
    </svg>
  )
}

function HashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  )
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M12 2v20M3 10h18"/>
      <path d="M6 2L6 10M18 2L18 10"/>
    </svg>
  )
}

const ChevronRightIcon = ChevronRight

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

const tools: Tool[] = [
  { id: 'json', name: 'JSON 格式化', icon: <FileJsonIcon />, description: '格式化和验证JSON数据' },
  { id: 'qr', name: 'QR码生成器', icon: <QrCodeIcon />, description: '快速生成二维码' },
  { id: 'hash', name: '哈希计算器', icon: <HashIcon />, description: '计算MD5、SHA等哈希值' },
  { id: 'unit', name: '单位转换', icon: <ScaleIcon />, description: '长度、重量、温度等单位转换' },
  { id: 'color', name: '颜色工具', icon: <PaletteIcon />, description: '颜色转换和调色板' },
  { id: 'base64', name: 'Base64 编解码', icon: <CodeIcon />, description: 'Base64编码和解码' },
  { id: 'url', name: 'URL 编解码', icon: <GlobeIcon />, description: 'URL编码和解码' },
  { id: 'calc', name: '科学计算器', icon: <CalculatorIcon />, description: '高级数学计算' },
]

function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch {
      setError('JSON格式错误')
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch {
      setError('JSON格式错误')
      setOutput('')
    }
  }

  return (
    <div className="tool-panel">
      <div className="flex gap-4 h-full">
        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-2">
            <button onClick={handleFormat} className="btn btn-primary">格式化</button>
            <button onClick={handleMinify} className="btn btn-secondary">压缩</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入JSON数据..."
            className="flex-1 font-mono text-sm resize-none"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400">输出</span>
            {error && <span className="text-red-400 text-sm">{error}</span>}
          </div>
          <textarea
            value={output}
            readOnly
            className="flex-1 font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  )
}

function QRGenerator() {
  const [input, setInput] = useState('')
  const [size, setSize] = useState(128)

  return (
    <div className="tool-panel flex flex-col items-center gap-6">
      <div className="w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要转换为QR码的内容..."
          className="w-full px-4 py-2"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm">尺寸:</label>
        <input
          type="range"
          min="64"
          max="256"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm w-12">{size}px</span>
      </div>
      <div className="bg-white p-8">
        {input && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}`}
            alt="QR Code"
          />
        )}
      </div>
    </div>
  )
}

function HashCalculator() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'>('SHA-256')
  const [result, setResult] = useState('')

  const algorithms: ('MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512')[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']

  const calculateHash = async () => {
    if (!input) return
    
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    setResult(hashHex)
  }

  return (
    <div className="tool-panel flex flex-col gap-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入要计算哈希的值..."
        className="w-full px-4 py-2"
      />
      <div className="flex gap-2">
        {algorithms.map((algo) => (
          <button
            key={algo}
            onClick={() => setAlgorithm(algo)}
            className={`px-4 py-2 ${algorithm === algo ? 'bg-accent text-white' : 'bg-gray-700'}`}
          >
            {algo}
          </button>
        ))}
      </div>
      <button onClick={calculateHash} className="btn btn-primary">计算哈希</button>
      {result && (
        <div className="p-4 bg-gray-800 rounded font-mono text-sm break-all">
          {result}
        </div>
      )}
    </div>
  )
}

function UnitConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [result, setResult] = useState('')

  const units: { id: string; name: string; factor: number }[] = [
    { id: 'mm', name: '毫米', factor: 0.001 },
    { id: 'cm', name: '厘米', factor: 0.01 },
    { id: 'm', name: '米', factor: 1 },
    { id: 'km', name: '千米', factor: 1000 },
    { id: 'in', name: '英寸', factor: 0.0254 },
    { id: 'ft', name: '英尺', factor: 0.3048 },
    { id: 'yd', name: '码', factor: 0.9144 },
    { id: 'mi', name: '英里', factor: 1609.34 },
  ]

  const convert = () => {
    if (!value) return
    const from = units.find(u => u.id === fromUnit)
    const to = units.find(u => u.id === toUnit)
    if (from && to) {
      const meters = parseFloat(value) * from.factor
      const converted = meters / to.factor
      setResult(converted.toFixed(6))
    }
  }

  return (
    <div className="tool-panel flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入数值"
            className="w-full px-4 py-2"
          />
        </div>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="px-4 py-2 bg-gray-700"
        >
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <span className="flex items-center text-gray-400">→</span>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="px-4 py-2 bg-gray-700"
        >
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      <button onClick={convert} className="btn btn-primary">转换</button>
      {result && (
        <div className="p-4 bg-gray-800 rounded text-center">
          <span className="text-xl font-bold">{result}</span>
          <span className="ml-2 text-gray-400">{units.find(u => u.id === toUnit)?.name}</span>
        </div>
      )}
    </div>
  )
}

function ColorTools() {
  const [hex, setHex] = useState('#6c5ce7')
  const [rgb, setRgb] = useState({ r: 108, g: 92, b: 231 })

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHex(e.target.value)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value)
    if (result) {
      setRgb({
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      })
    }
  }

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value }
    setRgb(newRgb)
    setHex(`#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`)
  }

  return (
    <div className="tool-panel flex flex-col gap-6">
      <div className="flex gap-6">
        <div 
          className="w-32 h-32 rounded-lg shadow-lg"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <input
              type="color"
              value={hex}
              onChange={handleHexChange}
              className="w-10 h-10 cursor-pointer"
            />
            <input
              type="text"
              value={hex}
              onChange={handleHexChange}
              className="flex-1 px-4 py-2 font-mono"
            />
          </div>
          <div className="space-y-2">
            {['r', 'g', 'b'].map((channel, i) => (
              <div key={channel} className="flex items-center gap-2">
                <span className="w-6 text-center" style={{ color: ['#ff6b6b', '#4ecdc4', '#45b7d1'][i] }}>
                  {channel.toUpperCase()}
                </span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgb[channel as keyof typeof rgb]}
                  onChange={(e) => handleRgbChange(channel as 'r' | 'g' | 'b', Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 text-right font-mono">{rgb[channel as keyof typeof rgb]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-gray-800 rounded font-mono text-sm">
          <span className="text-gray-400">Hex:</span> {hex}
        </div>
        <div className="p-3 bg-gray-800 rounded font-mono text-sm">
          <span className="text-gray-400">RGB:</span> rgb({rgb.r}, {rgb.g}, {rgb.b})
        </div>
        <div className="p-3 bg-gray-800 rounded font-mono text-sm">
          <span className="text-gray-400">HSL:</span> {((Math.atan2(rgb.g - rgb.b, rgb.r - rgb.g) * 180 / Math.PI + 360) % 360).toFixed(0)}°, {(100 * (Math.max(rgb.r, rgb.g, rgb.b) + Math.min(rgb.r, rgb.g, rgb.b)) / 510).toFixed(0)}%, {(50 * (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)) / 255).toFixed(0)}%
        </div>
      </div>
    </div>
  )
}

function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(input)
        setOutput(encoded)
      } else {
        const decoded = atob(input)
        setOutput(decoded)
      }
    } catch {
      setOutput('转换错误')
    }
  }

  return (
    <div className="tool-panel flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2 ${mode === 'encode' ? 'bg-accent text-white' : 'bg-gray-700'}`}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2 ${mode === 'decode' ? 'bg-accent text-white' : 'bg-gray-700'}`}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的Base64...'}
        className="h-32 px-4 py-2 font-mono text-sm resize-none"
      />
      <button onClick={handleConvert} className="btn btn-primary">
        {mode === 'encode' ? 'Base64 编码' : 'Base64 解码'}
      </button>
      <textarea
        value={output}
        readOnly
        className="h-32 px-4 py-2 font-mono text-sm resize-none"
      />
    </div>
  )
}

function URLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const encoded = encodeURIComponent(input)
        setOutput(encoded)
      } else {
        const decoded = decodeURIComponent(input)
        setOutput(decoded)
      }
    } catch {
      setOutput('转换错误')
    }
  }

  return (
    <div className="tool-panel flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2 ${mode === 'encode' ? 'bg-accent text-white' : 'bg-gray-700'}`}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2 ${mode === 'decode' ? 'bg-accent text-white' : 'bg-gray-700'}`}
        >
          解码
        </button>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '输入要编码的URL...' : '输入要解码的URL...'}
        className="w-full px-4 py-2"
      />
      <button onClick={handleConvert} className="btn btn-primary">
        {mode === 'encode' ? 'URL 编码' : 'URL 解码'}
      </button>
      <textarea
        value={output}
        readOnly
        className="h-24 px-4 py-2 font-mono text-sm resize-none"
      />
    </div>
  )
}

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const result = new Function(`'use strict'; return (${expression})`)()
        setDisplay(result.toString())
        setExpression(result.toString())
      } catch {
        setDisplay('错误')
        setExpression('')
      }
    } else if (value === 'C') {
      setDisplay('0')
      setExpression('')
    } else if (value === 'CE') {
      setDisplay('0')
    } else if (value === 'backspace') {
      setExpression(expression.slice(0, -1))
      setDisplay(expression.slice(0, -1) || '0')
    } else {
      const newExpression = expression + value
      setExpression(newExpression)
      setDisplay(newExpression)
    }
  }

  const buttons = [
    ['C', 'CE', 'backspace', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ]

  return (
    <div className="tool-panel flex flex-col items-center">
      <div className="w-full max-w-xs">
        <div className="bg-gray-900 p-4 mb-4 rounded text-right">
          <div className="text-3xl font-mono min-h-[48px]">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`p-4 text-xl rounded ${
                btn === '=' ? 'bg-accent text-white' :
                ['C', 'CE', 'backspace'].includes(btn) ? 'bg-red-600 text-white' :
                ['/', '*', '-', '+'].includes(btn) ? 'bg-gray-600' :
                'bg-gray-700'
              }`}
            >
              {btn === 'backspace' ? '⌫' : btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const toolComponents: Record<string, React.ComponentType> = {
  json: JSONFormatter,
  qr: QRGenerator,
  hash: HashCalculator,
  unit: UnitConverter,
  color: ColorTools,
  base64: Base64Tool,
  url: URLTool,
  calc: Calculator,
}

export default function OnlineToolkit() {
  const [selectedTool, setSelectedTool] = useState('json')

  return (
    <div className="h-full flex">
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">工具中心</h2>
        <div className="space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-accent text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span>{tool.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{tool.name}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {(() => {
          const ToolComponent = toolComponents[selectedTool]
          return ToolComponent ? <ToolComponent /> : null
        })()}
      </div>
    </div>
  )
}