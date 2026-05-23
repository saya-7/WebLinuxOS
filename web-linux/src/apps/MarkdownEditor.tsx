import { useState, useCallback } from 'react'

export default function MarkdownEditor() {
  const [content, setContent] = useState(`# Web Linux OS Markdown Editor

欢迎使用 Web Linux OS 内置的 Markdown 编辑器！

## 功能特性

- 实时预览
- 语法高亮
- 文件保存
- 响应式布局

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

### 代码
\`\`\`javascript
console.log('Hello World!')
\`\`\`

### 链接和图片
[访问 GitHub](https://github.com)
![Logo](https://via.placeholder.com/200x100)

### 引用
> 这是一段引用文本

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A | B | C |
| D | E | F |

---

尽情编辑吧！✨
`)
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split')
  const [fileName] = useState('untitled.md')
  const [saved, setSaved] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setSaved(false)
  }

  const renderMarkdown = useCallback((text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/<li>(.*?)<\/li>/s, (match) => `<ul>${match}</ul>`)
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/---/g, '<hr/>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hpu])(.*)$/gm, (match, p1) => match ? `<p>${p1}</p>` : '')
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#1e1e1e',
      color: '#fff'
    }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 12px', 
        background: '#2d2d2d',
        borderBottom: '1px solid #333',
        gap: '8px'
      }}>
        <button 
          onClick={() => setViewMode('edit')}
          style={{ 
            padding: '6px 12px',
            borderRadius: '4px',
            border: viewMode === 'edit' ? '1px solid #0078d4' : '1px solid #555',
            background: viewMode === 'edit' ? '#0078d4' : '#444',
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
            border: viewMode === 'split' ? '1px solid #0078d4' : '1px solid #555',
            background: viewMode === 'split' ? '#0078d4' : '#444',
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
            border: viewMode === 'preview' ? '1px solid #0078d4' : '1px solid #555',
            background: viewMode === 'preview' ? '#0078d4' : '#444',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          预览
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#888', fontSize: '12px', marginRight: '8px' }}>
          {fileName} {!saved && ' • 未保存'}
        </span>
        <button 
          onClick={() => {
            setSaved(true)
          }}
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
            borderRight: viewMode === 'split' ? '1px solid #333' : 'none'
          }}>
            <textarea
              value={content}
              onChange={handleChange}
              style={{
                flex: 1,
                background: '#1e1e1e',
                color: '#d4d4d4',
                border: 'none',
                outline: 'none',
                padding: '16px',
                fontFamily: 'Consolas, monospace',
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
            background: '#2d2d3e'
          }}>
            <div 
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                color: '#e0e0e0',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                lineHeight: '1.6'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
