import { useState, useCallback, memo } from 'react'

const MarkdownToHTML = memo(function MarkdownToHTML() {
  const [markdown, setMarkdown] = useState('# Markdown to HTML Converter\n\nConvert your Markdown text to beautiful HTML instantly!\n\n## Features\n\n- **Real-time preview**: See changes as you type\n- **Syntax highlighting**: Support for code blocks\n- **Export options**: Copy or download your HTML\n- **Presets**: Quick access to common templates\n\n## Code Example\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```\n\n## Lists\n\n1. First item\n2. Second item\n3. Third item\n\n- Bullet point 1\n- Bullet point 2\n')
  const [html, setHtml] = useState('')
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'source'>('preview')
  const [copyStatus, setCopyStatus] = useState('')

  const markdownToHTML = useCallback((text: string): string => {
    let result = text

    // Code blocks first
    result = result.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre><code>${code.trim()}</code></pre>`
    })

    // Inline code
    result = result.replace(/`([^`]+)`/g, (_, code) => {
      return `<code>${code}</code>`
    })

    // Headings
    result = result.replace(/^# (.*$)/gm, (_, text) => `<h1>${text}</h1>`)
    result = result.replace(/^## (.*$)/gm, (_, text) => `<h2>${text}</h2>`)
    result = result.replace(/^### (.*$)/gm, (_, text) => `<h3>${text}</h3>`)
    result = result.replace(/^#### (.*$)/gm, (_, text) => `<h4>${text}</h4>`)

    // Bold and italic
    result = result.replace(/\*\*(.*?)\*\*/g, (_, text) => `<strong>${text}</strong>`)
    result = result.replace(/__(.*?)__/g, (_, text) => `<strong>${text}</strong>`)
    result = result.replace(/\*(.*?)\*/g, (_, text) => `<em>${text}</em>`)
    result = result.replace(/_(.*?)_/g, (_, text) => `<em>${text}</em>`)

    // Blockquote
    result = result.replace(/^> (.*$)/gm, (_, text) => `<blockquote>${text}</blockquote>`)

    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`
    })

    // Horizontal rule
    result = result.replace(/^---$|^\*\*\*$|^___$/gm, '<hr>')

    // Paragraphs (last)
    result = result.split('\n\n').map(para => {
      if (para.trim() === '') return ''
      if (para.startsWith('<')) return para
      return `<p>${para.trim()}</p>`
    }).join('\n')

    return result
  }, [])

  const updateHTML = useCallback(() => {
    setHtml(markdownToHTML(markdown))
  }, [markdown, markdownToHTML])

  const copyHTML = useCallback(() => {
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Markdown</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1, h2, h3, h4 {
      color: #111;
    }
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    }
    code {
      font-family: 'Consolas', 'Monaco', monospace;
    }
    blockquote {
      border-left: 4px solid #007acc;
      padding-left: 15px;
      margin-left: 0;
      color: #666;
    }
    a {
      color: #007acc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`

    navigator.clipboard.writeText(fullHTML).then(() => {
      setCopyStatus('已复制!')
      setTimeout(() => setCopyStatus(''), 2000)
    })
  }, [html])

  const downloadHTML = useCallback(() => {
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Markdown</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1, h2, h3, h4 {
      color: #111;
    }
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    }
    code {
      font-family: 'Consolas', 'Monaco', monospace;
    }
    blockquote {
      border-left: 4px solid #007acc;
      padding-left: 15px;
      margin-left: 0;
      color: #666;
    }
    a {
      color: #007acc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`

    const blob = new Blob([fullHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }, [html])

  const presets = [
    {
      name: 'README',
      content: '# Project Name\n\nShort description of your project.\n\n## Installation\n\n```bash\nnpm install project-name\n```\n\n## Usage\n\n```javascript\nimport { example } from "project-name"\nexample()\n```\n\n## License\n\nMIT'
    },
    {
      name: 'Blog Post',
      content: '# My Awesome Blog Post\n\nPublished on January 1, 2024\n\n## Introduction\n\nWelcome to this amazing article!\n\n## Main Content\n\nHere\'s some great information...\n\n## Conclusion\n\nThanks for reading!'
    },
    {
      name: 'Resume',
      content: '# John Doe\n\nFull Stack Developer\n\n## Experience\n\n### Senior Developer\n*Company XYZ* - 2020-Present\n\n- Built amazing products\n- Led team of 5 developers\n\n## Skills\n\n- JavaScript\n- React\n- Node.js'
    }
  ]

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(180deg, #1e1e2e 0%, #181825 100%)',
      color: '#cdd6f4',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #45475a',
        background: '#313244',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#89b4fa' }}>
          📄 Markdown to HTML
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            style={{
              padding: '6px 12px',
              background: '#45475a',
              border: '1px solid #585b70',
              borderRadius: '6px',
              color: '#cdd6f4',
              fontSize: '12px'
            }}
            onChange={(e) => {
              const preset = presets[parseInt(e.target.value)]
              if (preset) {
                setMarkdown(preset.content)
              }
            }}
          >
            <option value="">加载预设...</option>
            {presets.map((p, i) => (
              <option key={i} value={i}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={copyHTML}
            style={{
              padding: '8px 16px',
              background: '#45475a',
              border: '1px solid #585b70',
              borderRadius: '6px',
              color: '#cdd6f4',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {copyStatus || '复制 HTML'}
          </button>
          <button
            onClick={downloadHTML}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #89b4fa, #74c7ec)',
              border: 'none',
              borderRadius: '6px',
              color: '#1e1e2e',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            下载
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid #45475a',
        background: '#1e1e2e'
      }}>
        {(['editor', 'preview', 'source'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab !== 'editor') {
                updateHTML()
              }
              setActiveTab(tab)
            }}
            style={{
              padding: '10px 16px',
              background: activeTab === tab ? '#313244' : 'transparent',
              border: 'none',
              color: activeTab === tab ? '#89b4fa' : '#6c7086',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeTab === tab ? 600 : 500
            }}
          >
            {tab === 'editor' && '✏️ 编辑器'}
            {tab === 'preview' && '👁️ 预览'}
            {tab === 'source' && '📜 源码'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'editor' && (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{
              flex: 1,
              padding: '20px',
              background: '#181825',
              border: 'none',
              color: '#cdd6f4',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none'
            }}
            spellCheck={false}
          />
        )}

        {activeTab === 'preview' && (
          <div style={{
            flex: 1,
            padding: '20px',
            overflow: 'auto',
            background: '#ffffff',
            color: '#333333'
          }} dangerouslySetInnerHTML={{ __html: html }} />
        )}

        {activeTab === 'source' && (
          <textarea
            value={html}
            readOnly
            style={{
              flex: 1,
              padding: '20px',
              background: '#181825',
              border: 'none',
              color: '#cdd6f4',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none'
            }}
          />
        )}
      </div>
    </div>
  )
})

export default MarkdownToHTML
