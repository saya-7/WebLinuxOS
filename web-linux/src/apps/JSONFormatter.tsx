import { useState, useCallback } from 'react'

export default function JSONFormatter() {
  const [input, setInput] = useState(`{
  "name": "Web Linux OS",
  "version": "2.4.0",
  "features": ["Terminal", "File System", "Apps"],
  "config": {
    "theme": "dark",
    "language": "zh-CN"
  }
}`)
  const [formatted, setFormatted] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'formatted' | 'minified'>('formatted')
  const [indentSize, setIndentSize] = useState(2)
  const [copySuccess, setCopySuccess] = useState(false)

  const formatJSON = useCallback((jsonStr: string) => {
    try {
      if (!jsonStr.trim()) {
        setFormatted('')
        setError(null)
        return
      }
      const parsed = JSON.parse(jsonStr)
      if (viewMode === 'minified') {
        setFormatted(JSON.stringify(parsed))
      } else {
        setFormatted(JSON.stringify(parsed, null, indentSize))
      }
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setFormatted('')
    }
  }, [viewMode, indentSize])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted || input)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setFormatted('')
    setError(null)
  }

  const loadSample = () => {
    setInput(`{
  "name": "Web Linux OS",
  "version": "2.4.0",
  "features": [
    "Terminal Emulator",
    "Virtual File System",
    "Window Manager",
    "60+ Apps"
  ],
  "config": {
    "theme": "dark",
    "language": "zh-CN",
    "settings": {
      "notifications": true,
      "autoSave": true,
      "backup": {
        "enabled": true,
        "interval": 3600
      }
    }
  },
  "stats": {
    "users": 10000,
    "active": 4500,
    "rating": 4.8
  },
  "tags": ["web", "os", "linux", "react"]
}`)
    setError(null)
  }

  const validateJSON = useCallback(() => {
    try {
      JSON.parse(input)
      setError(null)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      return false
    }
  }, [input])

  // JSON Tree View
  const renderJSONTree = (data: any, depth: number = 0) => {
    if (data === null) return <span style={{ color: '#f38ba8' }}>null</span>
    if (typeof data === 'boolean') return <span style={{ color: '#f38ba8' }}>{String(data)}</span>
    if (typeof data === 'number') return <span style={{ color: '#74c0fc' }}>{String(data)}</span>
    if (typeof data === 'string') return <span style={{ color: '#a6e3a1' }}>"{data}"</span>
    
    if (Array.isArray(data)) {
      if (data.length === 0) return <span>[]</span>
      return (
        <>
          <span style={{ color: '#9090a4' }}>[</span>
          <div style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
            {data.map((item, i) => (
              <div key={i}>
                {renderJSONTree(item, depth + 1)}
                {i < data.length - 1 && <span style={{ color: '#9090a4' }}>,</span>}
              </div>
            ))}
          </div>
          <span style={{ color: '#9090a4' }}>]</span>
        </>
      )
    }
    
    if (typeof data === 'object') {
      const keys = Object.keys(data)
      if (keys.length === 0) return <span>{}</span>
      return (
        <>
          <span style={{ color: '#9090a4' }}>{'{'}</span>
          <div style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
            {keys.map((key, i) => (
              <div key={i}>
                <span style={{ color: '#cdd6f4' }}>"{key}"</span>
                <span style={{ color: '#9090a4' }}>: </span>
                {renderJSONTree(data[key], depth + 1)}
                {i < keys.length - 1 && <span style={{ color: '#9090a4' }}>,</span>}
              </div>
            ))}
          </div>
          <span style={{ color: '#9090a4' }}>{'}'}</span>
        </>
      )
    }
    
    return <span>{String(data)}</span>
  }

  let treeData = null
  try {
    if (input.trim()) treeData = JSON.parse(input)
  } catch {}

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
        <span style={{ fontSize: '20px' }}>📋</span>
        <div>
          <div style={{ fontWeight: 600 }}>JSON格式化工具</div>
          <div style={{ fontSize: '12px', color: '#9090a4' }}>格式化、验证和查看JSON</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        padding: '8px 16px',
        background: '#252536',
        borderBottom: '1px solid #3a3a5c',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '4px', background: '#1e1e2e', padding: '4px', borderRadius: '6px' }}>
          {(['formatted', 'tree', 'minified'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode)
                formatJSON(input)
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === mode ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : 'transparent',
                color: viewMode === mode ? '#fff' : '#9090a4',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: viewMode === mode ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {mode === 'formatted' ? '格式化' : mode === 'tree' ? '树状' : '压缩'}
            </button>
          ))}
        </div>

        <div style={{ borderLeft: '1px solid #3a3a5c', height: '24px', margin: '0 8px' }} />

        <button
          onClick={() => formatJSON(input)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3a3a5c',
            background: '#2d2d3e',
            color: '#e0e0e0',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          格式化
        </button>

        <button
          onClick={validateJSON}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3a3a5c',
            background: '#2d2d3e',
            color: '#e0e0e0',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          验证
        </button>

        <button
          onClick={copyToClipboard}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3a3a5c',
            background: '#2d2d3e',
            color: '#e0e0e0',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {copySuccess ? '✓ 已复制' : '复制'}
        </button>

        <button
          onClick={loadSample}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3a3a5c',
            background: '#2d2d3e',
            color: '#e0e0e0',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          示例
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3a3a5c',
            background: '#2d2d3e',
            color: '#f38ba8',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          清空
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span style={{ color: '#9090a4' }}>缩进:</span>
          <select
            value={indentSize}
            onChange={(e) => {
              setIndentSize(Number(e.target.value))
              formatJSON(input)
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #3a3a5c',
              background: '#2d2d3e',
              color: '#e0e0e0',
              fontSize: '12px'
            }}
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={8}>8 空格</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(243, 139, 168, 0.15)',
          borderBottom: '1px solid rgba(243, 139, 168, 0.3)',
          color: '#f38ba8',
          fontSize: '12px'
        }}>
          ❌ {error}
        </div>
      )}
      {!error && input.trim() && (
        <div style={{
          padding: '8px 16px',
          background: 'rgba(166, 227, 161, 0.15)',
          borderBottom: '1px solid rgba(166, 227, 161, 0.3)',
          color: '#a6e3a1',
          fontSize: '12px'
        }}>
          ✓ 有效的JSON
        </div>
      )}

      {/* Editor Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #3a3a5c' }}>
          <div style={{
            padding: '8px 16px',
            background: '#252536',
            fontSize: '12px',
            color: '#9090a4',
            fontWeight: 600,
            borderBottom: '1px solid #3a3a5c'
          }}>
            输入
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => formatJSON((e.target as HTMLTextAreaElement).value)}
            placeholder="在此粘贴或输入 JSON..."
            style={{
              flex: 1,
              padding: '16px',
              background: '#1e1e2e',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              color: '#e0e0e0',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '8px 16px',
            background: '#252536',
            fontSize: '12px',
            color: '#9090a4',
            fontWeight: 600,
            borderBottom: '1px solid #3a3a5c'
          }}>
            输出
          </div>
          <div style={{
            flex: 1,
            padding: '16px',
            overflow: 'auto',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '13px',
            lineHeight: '1.5',
            background: '#1e1e2e'
          }}>
            {viewMode === 'tree' && treeData ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {renderJSONTree(treeData)}
              </div>
            ) : (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#e0e0e0' }}>
                {formatted || input}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
