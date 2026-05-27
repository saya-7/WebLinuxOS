import { useState, useCallback, useEffect } from 'react'

interface PasswordEntry {
  id: string
  site: string
  username: string
  password: string
  url?: string
  notes?: string
  category: string
  createdAt: number
  updatedAt: number
  favorite: boolean
}

const CATEGORIES = ['全部', '社交媒体', '购物', '银行', '工作', '其他']
const STRENGTH_COLORS = { weak: '#ef4444', fair: '#f59e0b', good: '#22c55e', excellent: '#10b981' }

export default function SmartPasswordManager() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(() => {
    try {
      const saved = localStorage.getItem('weblinux_passwords')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
  const [showPasswords, setShowPasswords] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')
  const [isLocked, setIsLocked] = useState(true)
  
  const [formData, setFormData] = useState({
    site: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: '其他'
  })

  useEffect(() => {
    localStorage.setItem('weblinux_passwords', JSON.stringify(passwords))
  }, [passwords])

  const generatePassword = useCallback(() => {
    const length = 16
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }, [])

  const checkStrength = useCallback((pwd: string): { level: keyof typeof STRENGTH_COLORS; score: number } => {
    let score = 0
    if (pwd.length >= 8) score += 20
    if (pwd.length >= 12) score += 20
    if (/[a-z]/.test(pwd)) score += 15
    if (/[A-Z]/.test(pwd)) score += 15
    if (/[0-9]/.test(pwd)) score += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15
    
    if (score < 40) return { level: 'weak', score }
    if (score < 60) return { level: 'fair', score }
    if (score < 80) return { level: 'good', score }
    return { level: 'excellent', score }
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      setPasswords(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, ...formData, updatedAt: Date.now() }
          : p
      ))
      setEditingId(null)
    } else {
      const newEntry: PasswordEntry = {
        id: Date.now().toString(),
        ...formData,
        favorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setPasswords(prev => [newEntry, ...prev])
    }
    
    setFormData({
      site: '',
      username: '',
      password: '',
      url: '',
      notes: '',
      category: '其他'
    })
    setShowForm(false)
  }, [editingId, formData])

  const handleEdit = useCallback((entry: PasswordEntry) => {
    setEditingId(entry.id)
    setFormData({
      site: entry.site,
      username: entry.username,
      password: entry.password,
      url: entry.url || '',
      notes: entry.notes || '',
      category: entry.category
    })
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    if (confirm('确定要删除这个密码吗？')) {
      setPasswords(prev => prev.filter(p => p.id !== id))
    }
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setPasswords(prev => prev.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ))
  }, [])

  const copyPassword = useCallback((password: string) => {
    navigator.clipboard.writeText(password)
    alert('密码已复制到剪贴板')
  }, [])

  const filteredPasswords = passwords.filter(p => {
    const matchesSearch = !search || 
      p.site.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === '全部' || p.category === category
    return matchesSearch && matchesCategory
  }).sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))

  const stats = {
    total: passwords.length,
    weak: passwords.filter(p => checkStrength(p.password).level === 'weak').length,
    favorites: passwords.filter(p => p.favorite).length,
    categories: [...new Set(passwords.map(p => p.category))].length
  }

  if (isLocked) {
    return (
      <div className="app-container" style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
        color: '#fff',
        padding: '24px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>密码管理器</h1>
        <p style={{ margin: '0 0 32px 0', color: 'rgba(255,255,255,0.6)' }}>请输入主密码解锁</p>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          setIsLocked(false)
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '350px' }}>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="输入任意密码解锁"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '16px',
              outline: 'none'
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            解锁 🔓
          </button>
        </form>
        
        <p style={{ marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          这是一个演示版本，输入任意密码即可解锁
        </p>
      </div>
    )
  }

  return (
    <div className="app-container" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
      color: '#fff'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
            🔐 密码管理器
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              {showPasswords ? '🙈 隐藏' : '👁️ 显示'}
            </button>
            <button
              onClick={() => setIsLocked(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              🔒 锁定
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: '总密码数', value: stats.total, icon: '📊', color: '#60a5fa' },
            { label: '弱密码', value: stats.weak, icon: '⚠️', color: '#ef4444' },
            { label: '收藏', value: stats.favorites, icon: '⭐', color: '#f59e0b' },
            { label: '分类', value: stats.categories, icon: '📁', color: '#10b981' }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索网站或用户名..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            + 添加密码
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: category === cat ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {filteredPasswords.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {search ? '🔍' : '📭'}
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
              {search ? '没有找到匹配的密码' : '还没有保存任何密码'}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {search ? '试试其他关键词' : '点击"添加密码"开始使用'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
            {filteredPasswords.map((entry) => {
              const strength = checkStrength(entry.password)
              return (
                <div
                  key={entry.id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{entry.site}</h3>
                        {entry.favorite && <span style={{ color: '#f59e0b' }}>⭐</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{entry.category}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => toggleFavorite(entry.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title={entry.favorite ? '取消收藏' : '收藏'}
                      >
                        {entry.favorite ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="编辑"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>用户名</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{entry.username}</div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>密码</span>
                      <button
                        onClick={() => copyPassword(entry.password)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        📋 复制
                      </button>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: 'monospace'
                    }}>
                      {showPasswords ? entry.password : '•'.repeat(Math.min(entry.password.length, 16))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${strength.score}%`,
                          height: '100%',
                          background: STRENGTH_COLORS[strength.level],
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '11px',
                      color: STRENGTH_COLORS[strength.level],
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {strength.level}
                    </span>
                  </div>

                  {entry.notes && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      {entry.notes}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{
            background: '#1a1a2e',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '450px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>
                {editingId ? '编辑密码' : '添加新密码'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>网站名称 *</label>
                <input
                  required
                  type="text"
                  value={formData.site}
                  onChange={(e) => setFormData(prev => ({ ...prev, site: e.target.value }))}
                  placeholder="例如：GitHub"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>用户名 / 邮箱 *</label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>密码 *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    required
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="输入或生成密码"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🎲 生成
                  </button>
                </div>
                {formData.password && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${checkStrength(formData.password).score}%`,
                          height: '100%',
                          background: STRENGTH_COLORS[checkStrength(formData.password).level],
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '11px',
                      color: STRENGTH_COLORS[checkStrength(formData.password).level],
                      fontWeight: '600'
                    }}>
                      {checkStrength(formData.password).level}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>网址 (可选)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {CATEGORIES.filter(c => c !== '全部').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>备注 (可选)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="添加备注..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {editingId ? '保存更改' : '保存密码'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
