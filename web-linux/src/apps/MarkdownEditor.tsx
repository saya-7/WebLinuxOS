import { useState, useCallback } from 'react'
import { useStore } from '../store'
import { FileJson, Download, Copy, Bold, Italic, Code, List, Quote, Heading1, Heading2, Heading3 } from 'lucide-react'

export default function MarkdownEditor() {
  const { theme } = useStore()
  const isDark = theme === 'dark'
  
  const [content, setContent] = useState(`# Web Linux OS Markdown Editor

欢迎使用 Web Linux OS 内置的 Markdown 编辑器！

## 功能特性

- 实时预览
- 语法高亮
- 文件保存
- 响应式布局
- 支持导出 HTML
- 工具栏快捷操作
- 深色/浅色主题

## 支持的 Markdown 语法

### 标题
# H1
## H2
### H3

### 文本样式
**粗体** 和 *斜体*
~~删除线~~

### 列表
- 项目 1
- 项目 2
- 项目 3

1. 第一项
2. 第二项
3. 第三项

### 代码
\`\`\`javascript
console.log('Hello World!')
\`\`\`

行内代码: \`const x = 42\`

### 链接和图片
[访问 GitHub](https://github.com)

### 引用
> 这是一段引用文本
> 
> 多行引用支持

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A | B | C |
| D | E | F |

### 分割线
---

尽情编辑吧！✨
`)
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split')
  const [fileName, setFileName] = useState('untitled.md')
  const [saved, setSaved] = useState(true)
  const [showFileName, setShowFileName] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setSaved(false)
  }

  const insertText = (before: string, after = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    setSaved(false)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const renderMarkdown = useCallback((text: string) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
      const lang = code.split('\n')[0] || ''
      const content = code.slice(lang.length).trim()
      return `<pre class="code-block"><code class="language-${lang}">${content}</code></pre>`
    })

    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
    html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>')
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
    html = html.replace(/(<li>.*?<\/li>)/s, (match) => `<ul>${match}</ul>`)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    html = html.replace(/---/g, '<hr class="divider"/>')
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/^(?!<[hpu])(.*)$/gm, (match) => match ? `<p>${match}</p>` : '')

    html = html.replace(/\|(.*?)\|/g, (_match, cellContent) => {
      if (cellContent.trim().startsWith('-')) return ''
      return `<td>${cellContent.trim()}</td>`
    })
    html = html.replace(/(<td>.*?<\/td>)+/g, (match) => `<tr>${match}</tr>`)
    html = html.replace(/(<tr>.*?<\/tr>)+/s, (match) => `<table class="md-table">${match}</table>`)

    return html
  }, [])

  const saveContent = () => {
    localStorage.setItem(`weblinux-markdown-${fileName}`, content)
    setSaved(true)
  }

  const downloadAsHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #0078d4; padding-left: 15px; color: #666; margin: 15px 0; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f4f4f4; }
    hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
  ${renderMarkdown(content)}
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace('.md', '.html')
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(renderMarkdown(content))
  }

  const bg = isDark ? '#1e1e1e' : '#f5f5f5'
  const text = isDark ? '#e0e0e0' : '#333'
  const toolbarBg = isDark ? '#2d2d2d' : '#e0e0e0'
  const previewBg = isDark ? '#2d2d3e' : '#ffffff'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: bg,
      color: text
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: toolbarBg,
        borderBottom: isDark ? '1px solid #333' : '1px solid #ccc',
        gap: '4px'
      }}>
        {/* Top Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          gap: '8px'
        }}>
          <button
            onClick={() => setViewMode('edit')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: viewMode === 'edit' ? `1px solid #0078d4` : isDark ? '1px solid #555' : '1px solid #ccc',
              background: viewMode === 'edit' ? '#0078d4' : (isDark ? '#444' : '#ddd'),
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            编辑
          </button>
          <button
            onClick={() => setViewMode('split')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: viewMode === 'split' ? `1px solid #0078d4` : isDark ? '1px solid #555' : '1px solid #ccc',
              background: viewMode === 'split' ? '#0078d4' : (isDark ? '#444' : '#ddd'),
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            分屏
          </button>
          <button
            onClick={() => setViewMode('preview')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: viewMode === 'preview' ? `1px solid #0078d4` : isDark ? '1px solid #555' : '1px solid #ccc',
              background: viewMode === 'preview' ? '#0078d4' : (isDark ? '#444' : '#ddd'),
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            预览
          </button>

          <div style={{ width: '1px', height: '24px', background: isDark ? '#555' : '#ccc', margin: '0 4px' }} />

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button onClick={() => insertText('**', '**')} title="粗体" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Bold size={16} /></button>
            <button onClick={() => insertText('*', '*')} title="斜体" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Italic size={16} /></button>
            <button onClick={() => insertText('`', '`')} title="行内代码" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Code size={16} /></button>
            <button onClick={() => insertText('\n```\n', '\n```\n')} title="代码块" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><FileJson size={16} /></button>
            <button onClick={() => insertText('- ')} title="无序列表" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><List size={16} /></button>
            <button onClick={() => insertText('> ')} title="引用" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Quote size={16} /></button>
            <button onClick={() => insertText('# ')} title="H1" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Heading1 size={16} /></button>
            <button onClick={() => insertText('## ')} title="H2" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Heading2 size={16} /></button>
            <button onClick={() => insertText('### ')} title="H3" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: text }}><Heading3 size={16} /></button>
          </div>

          <div style={{ flex: 1 }} />

          {showFileName ? (
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setShowFileName(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setShowFileName(false) }}
              autoFocus
              style={{
                padding: '6px 10px',
                border: '1px solid #0078d4',
                borderRadius: '4px',
                background: isDark ? '#1e1e1e' : '#fff',
                color: text,
                fontSize: '12px',
                outline: 'none'
              }}
            />
          ) : (
            <span
              onClick={() => setShowFileName(true)}
              style={{
                color: isDark ? '#888' : '#666',
                fontSize: '12px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              {fileName} {!saved && ' • 未保存'}
            </span>
          )}

          <button
            onClick={saveContent}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#0078d4',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            保存
          </button>
          <button
            onClick={downloadAsMarkdown}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: isDark ? '#444' : '#ddd',
              color: text,
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="下载 Markdown"
          >
            <Download size={14} />
          </button>
          <button
            onClick={downloadAsHTML}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: isDark ? '#444' : '#ddd',
              color: text,
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="导出 HTML"
          >
            HTML
          </button>
          <button
            onClick={copyHTML}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: isDark ? '#444' : '#ddd',
              color: text,
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="复制 HTML"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Editor */}
        {viewMode !== 'preview' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: viewMode === 'split' ? (isDark ? '1px solid #333' : '1px solid #ccc') : 'none'
          }}>
            <textarea
              value={content}
              onChange={handleChange}
              style={{
                flex: 1,
                background: bg,
                color: text,
                border: 'none',
                outline: 'none',
                padding: '16px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '14px',
                resize: 'none',
                lineHeight: '1.6'
              }}
            />
          </div>
        )}

        {/* Preview */}
        {viewMode !== 'edit' && (
          <div style={{
            flex: 1,
            padding: '16px',
            overflow: 'auto',
            background: previewBg
          }}>
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                lineHeight: '1.7'
              }}
            />
            <style>{`
              .code-block { 
                background: ${isDark ? '#1a1a1a' : '#f4f4f4'}; 
                padding: 16px; 
                border-radius: 8px; 
                overflow-x: auto;
                font-family: 'Consolas', 'Monaco', monospace;
              }
              .inline-code { 
                background: ${isDark ? '#333' : '#f4f4f4'}; 
                padding: 2px 6px; 
                border-radius: 4px;
                font-family: 'Consolas', 'Monaco', monospace;
              }
              .md-table { border-collapse: collapse; width: 100%; margin: 16px 0; }
              .md-table th, .md-table td { border: 1px solid ${isDark ? '#444' : '#ddd'}; padding: 8px 12px; }
              .md-table th { background: ${isDark ? '#333' : '#f4f4f4'}; }
              .divider { border: none; border-top: 1px solid ${isDark ? '#444' : '#ddd'}; margin: 24px 0; }
              h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
              blockquote { 
                border-left: 4px solid #0078d4; 
                padding-left: 16px; 
                margin: 16px 0; 
                color: ${isDark ? '#aaa' : '#666'};
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  )
}
