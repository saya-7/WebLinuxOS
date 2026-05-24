import { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function CloudSync() {
  const files = useStore((s) => s.files)
  const theme = useStore((s) => s.theme)
  const wallpaper = useStore((s) => s.wallpaper)

  const [syncStatus, setSyncStatus] = useState<'idle' | 'exporting' | 'importing'>('idle')
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncProgress, setSyncProgress] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>(['files', 'settings', 'wallpaper'])
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('weblinux-last-sync')
    if (saved) {
      setLastSync(new Date(saved))
    }
  }, [])

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const handleExport = async () => {
    setSyncStatus('exporting')
    setSyncProgress(0)
    setSyncError(null)
    setSyncSuccess(null)

    const data = {
      version: '2.2.0',
      timestamp: new Date().toISOString(),
      items: {} as {
        files?: typeof files
        settings?: { theme: string; lastSync?: string }
        wallpaper?: string
      },
    }

    const steps = [
      { key: 'files', label: '正在导出文件系统...' },
      { key: 'settings', label: '正在导出设置...' },
      { key: 'wallpaper', label: '正在导出壁纸...' },
      { key: 'complete', label: '正在生成文件...' },
    ]

    for (let i = 0; i < steps.length; i++) {
      setSyncProgress((i / (steps.length - 1)) * 100)
      await new Promise(resolve => setTimeout(resolve, 500))

      if (steps[i].key === 'files' && selectedItems.includes('files')) {
        data.items.files = files
      }
      if (steps[i].key === 'settings' && selectedItems.includes('settings')) {
        data.items.settings = {
          theme,
          lastSync: new Date().toISOString(),
        }
      }
      if (steps[i].key === 'wallpaper' && selectedItems.includes('wallpaper')) {
        data.items.wallpaper = wallpaper
      }
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weblinux-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const now = new Date()
    setLastSync(now)
    localStorage.setItem('weblinux-last-sync', now.toISOString())

    setSyncStatus('idle')
    setSyncProgress(100)
    setSyncSuccess('数据导出成功！文件已下载。')
  }

  const handleImport = () => {
    setShowImportModal(true)
  }

  const processImport = () => {
    try {
      const data = JSON.parse(importText) as {
        version: string
        items: {
          files?: unknown
          settings?: { theme: string; lastSync?: string }
          wallpaper?: string
        }
      }
      
      if (!data.version || !data.items) {
        throw new Error('无效的备份文件格式')
      }

      if (data.items.files && selectedItems.includes('files')) {
        localStorage.setItem('weblinux-files', JSON.stringify(data.items.files))
      }
      if (data.items.settings && selectedItems.includes('settings')) {
        localStorage.setItem('weblinux-theme', data.items.settings.theme)
      }
      if (data.items.wallpaper && selectedItems.includes('wallpaper')) {
        localStorage.setItem('weblinux-wallpaper', data.items.wallpaper)
      }

      setShowImportModal(false)
      setImportText('')
      setSyncSuccess('数据导入成功！请刷新页面以应用更改。')
    } catch (err) {
      setSyncError(`导入失败: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  const handleClearData = () => {
    if (confirm('确定要清除所有同步数据吗？此操作不可撤销。')) {
      localStorage.removeItem('weblinux-last-sync')
      localStorage.removeItem('weblinux-files')
      localStorage.removeItem('weblinux-settings')
      setLastSync(null)
      setSyncSuccess('所有同步数据已清除。')
    }
  }

  const syncItems = [
    { id: 'files', label: '文件系统', desc: '导出所有文件和文件夹', icon: '📁' },
    { id: 'settings', label: '系统设置', desc: '主题、窗口布局等偏好设置', icon: '⚙️' },
    { id: 'wallpaper', label: '壁纸', desc: '当前使用的壁纸设置', icon: '🖼️' },
  ]

  return (
    <div style={{
      height: '100%',
      background: theme === 'light' ? '#f5f5f7' : '#1e1e2e',
      color: theme === 'light' ? '#1c1c1e' : '#cdd6f4',
      overflow: 'auto',
      padding: '24px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>☁️</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            云同步与数据管理
          </h1>
          <p style={{ color: theme === 'light' ? '#666' : '#a6adc8', fontSize: '14px' }}>
            安全备份和恢复您的系统数据
          </p>
        </div>

        {syncError && (
          <div style={{
            background: 'rgba(244, 71, 71, 0.15)',
            border: '1px solid #f38ba8',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#f38ba8',
            fontSize: '13px',
          }}>
            ❌ {syncError}
          </div>
        )}

        {syncSuccess && (
          <div style={{
            background: 'rgba(166, 227, 161, 0.15)',
            border: '1px solid #a6e3a1',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#a6e3a1',
            fontSize: '13px',
          }}>
            ✅ {syncSuccess}
          </div>
        )}

        {syncStatus !== 'idle' && (
          <div style={{
            background: theme === 'light' ? '#fff' : '#313244',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
              {syncStatus === 'exporting' ? '正在导出...' : '正在导入...'}
            </div>
            <div style={{
              height: '8px',
              background: theme === 'light' ? '#e0e0e8' : '#45475a',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${syncProgress}%`,
                background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#a6adc8', marginTop: '8px' }}>
              {Math.round(syncProgress)}%
            </div>
          </div>
        )}

        <div style={{
          background: theme === 'light' ? '#fff' : '#313244',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            🔧 选择要同步的项目
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {syncItems.map(item => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: theme === 'light' ? '#f5f5f7' : '#45475a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedItems.includes(item.id)
                    ? '2px solid #6c5ce7'
                    : '2px solid transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '24px', marginRight: '12px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#a6adc8' }}>
                    {item.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{
          background: theme === 'light' ? '#fff' : '#313244',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📤 导出数据
          </h2>
          <p style={{ fontSize: '13px', color: theme === 'light' ? '#666' : '#a6adc8', marginBottom: '16px' }}>
            将选中的数据导出为JSON文件，方便备份或在其他设备上恢复。
          </p>
          <button
            onClick={handleExport}
            disabled={syncStatus !== 'idle' || selectedItems.length === 0}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: selectedItems.length === 0
                ? theme === 'light' ? '#ccc' : '#45475a'
                : 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {syncStatus === 'exporting' ? '正在导出...' : '导出到文件'}
          </button>
        </div>

        <div style={{
          background: theme === 'light' ? '#fff' : '#313244',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📥 导入数据
          </h2>
          <p style={{ fontSize: '13px', color: theme === 'light' ? '#666' : '#a6adc8', marginBottom: '16px' }}>
            从之前导出的JSON文件恢复数据。
          </p>
          <button
            onClick={handleImport}
            disabled={syncStatus !== 'idle'}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            选择备份文件
          </button>
        </div>

        {lastSync && (
          <div style={{
            background: theme === 'light' ? '#fff' : '#313244',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              📅 上次同步时间
            </div>
            <div style={{
              fontSize: '13px',
              color: theme === 'light' ? '#666' : '#a6adc8',
            }}>
              {lastSync.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}

        <div style={{
          background: theme === 'light' ? '#fff' : '#313244',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            🗑️ 清除数据
          </h2>
          <p style={{ fontSize: '13px', color: theme === 'light' ? '#666' : '#a6adc8', marginBottom: '16px' }}>
            清除所有本地同步数据。导出文件不会被删除。
          </p>
          <button
            onClick={handleClearData}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'rgba(244, 71, 71, 0.15)',
              color: '#f38ba8',
              border: '1px solid #f38ba8',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            清除所有同步数据
          </button>
        </div>

        {showImportModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
          }}>
            <div style={{
              background: theme === 'light' ? '#fff' : '#313244',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '16px',
              }}>
                📥 导入数据
              </h3>
              <p style={{
                fontSize: '13px',
                color: theme === 'light' ? '#666' : '#a6adc8',
                marginBottom: '16px',
              }}>
                粘贴之前导出的JSON文件内容，或直接拖拽文件到下方区域。
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="粘贴JSON数据..."
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '12px',
                  background: theme === 'light' ? '#f5f5f7' : '#45475a',
                  border: '1px solid #45475a',
                  borderRadius: '8px',
                  color: theme === 'light' ? '#1c1c1e' : '#cdd6f4',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  marginBottom: '16px',
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportText('')
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid #45475a',
                    borderRadius: '6px',
                    color: theme === 'light' ? '#1c1c1e' : '#cdd6f4',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={processImport}
                  disabled={!importText.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: importText.trim()
                      ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)'
                      : theme === 'light' ? '#ccc' : '#45475a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: importText.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  确认导入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
