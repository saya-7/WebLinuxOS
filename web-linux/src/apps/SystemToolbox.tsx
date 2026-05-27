import { useState } from 'react'
import { Calculator, Globe, Code, FileText, Image, Link, Terminal, Shield, Database } from 'lucide-react'

export default function SystemToolbox() {
  const [activeTab, setActiveTab] = useState('tools')
  
  const toolCategories = [
    {
      id: 'dev',
      name: '开发工具',
      icon: <Code size={20} />,
      tools: [
        { name: 'JSON 格式化', desc: '格式化并验证 JSON 数据', shortcut: 'Ctrl+Shift+J' },
        { name: '正则测试器', desc: '测试和调试正则表达式', shortcut: 'Ctrl+Shift+R' },
        { name: 'Base64 编码', desc: 'Base64 编码解码工具', shortcut: 'Ctrl+Shift+B' },
        { name: 'URL 编码', desc: 'URL 参数编码解码', shortcut: 'Ctrl+Shift+U' },
        { name: 'Markdown 预览', desc: '实时预览 Markdown', shortcut: 'Ctrl+Shift+M' },
        { name: '颜色选择器', desc: '选取和转换颜色', shortcut: 'Ctrl+Shift+C' },
      ]
    },
    {
      id: 'convert',
      name: '转换工具',
      icon: <Globe size={20} />,
      tools: [
        { name: '单位转换', desc: '长度、重量、温度等', shortcut: '' },
        { name: '汇率转换', desc: '实时汇率计算', shortcut: '' },
        { name: '时区转换', desc: '不同时区时间转换', shortcut: '' },
        { name: '进制转换', desc: '二进制/十进制/十六进制', shortcut: '' },
        { name: '时间戳转换', desc: '时间戳与日期互转', shortcut: '' },
      ]
    },
    {
      id: 'generate',
      name: '生成工具',
      icon: <Link size={20} />,
      tools: [
        { name: '密码生成器', desc: '生成强密码', shortcut: 'Ctrl+Shift+P' },
        { name: 'UUID 生成器', desc: '生成唯一标识符', shortcut: '' },
        { name: 'QR 码生成', desc: '生成二维码', shortcut: '' },
        { name: '短链接生成', desc: '创建短链接', shortcut: '' },
        { name: '随机数生成', desc: '生成随机数据', shortcut: '' },
      ]
    },
    {
      id: 'security',
      name: '安全工具',
      icon: <Shield size={20} />,
      tools: [
        { name: '哈希计算', desc: 'MD5/SHA 哈希', shortcut: '' },
        { name: '加密解密', desc: 'AES/RSA 工具', shortcut: '' },
        { name: '密码强度', desc: '检查密码强度', shortcut: '' },
        { name: 'SSL 检查', desc: '检查证书有效性', shortcut: '' },
      ]
    }
  ]

  return (
    <div style={{
      padding: '24px',
      height: '100%',
      overflow: 'auto',
      background: 'linear-gradient(135deg, #0a0a12 0%, #12121f 100%)',
      color: '#e8e8f4',
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        系统工具箱
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {toolCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: '12px 20px',
              background: activeTab === cat.id ? 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: activeTab === cat.id ? '#fff' : '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#6c5ce7'
        }}>
          {toolCategories.find(c => c.id === activeTab)?.name}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {toolCategories.find(c => c.id === activeTab)?.tools.map((tool, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(108, 92, 231, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(108, 92, 231, 0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e8e8f4'
              }}>
                {tool.name}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#888',
                marginBottom: tool.shortcut ? '12px' : '0'
              }}>
                {tool.desc}
              </div>
              {tool.shortcut && (
                <div style={{
                  fontSize: '11px',
                  color: '#6c5ce7',
                  background: 'rgba(108, 92, 231, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontFamily: 'monospace'
                }}>
                  {tool.shortcut}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '20px',
        background: 'rgba(108, 92, 231, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(108, 92, 231, 0.2)'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Terminal size={18} />
          快速访问
        </div>
        <div style={{
          fontSize: '14px',
          color: '#888',
          lineHeight: '1.8'
        }}>
          <div>使用 <code style={{ background: 'rgba(108, 92, 231, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#a29bfe' }}>Ctrl+K</code> 打开全局搜索</div>
          <div>使用 <code style={{ background: 'rgba(108, 92, 231, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#a29bfe' }}>Ctrl+Shift+P</code> 打开命令面板</div>
          <div>使用 <code style={{ background: 'rgba(108, 92, 231, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#a29bfe' }}>Super+T</code> 打开终端</div>
        </div>
      </div>
    </div>
  )
}
