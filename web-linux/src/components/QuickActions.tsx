import { memo, useState } from 'react'
import { useStore } from '../store'
import {
  Search, Calculator, TerminalIcon, Settings, Sun, Moon,
  Wifi, Volume2, Battery, Folder,
  Camera, Clock, Globe, Code
} from 'lucide-react'

const QuickActions = memo(function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const openApp = useStore((s) => s.openApp)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const windows = useStore((s) => s.windows)

  const quickActions = [
    {
      icon: <Search size={20} />,
      label: 'Search',
      action: () => openApp('smart-search'),
      category: 'search'
    },
    {
      icon: <TerminalIcon size={20} />,
      label: 'Terminal',
      action: () => openApp('terminal'),
      category: 'system'
    },
    {
      icon: <Calculator size={20} />,
      label: 'Calculator',
      action: () => openApp('calculator'),
      category: 'tools'
    },
    {
      icon: <Code size={20} />,
      label: 'Code Editor',
      action: () => openApp('code-editor'),
      category: 'development'
    },
    {
      icon: <Folder size={20} />,
      label: 'Files',
      action: () => openApp('files'),
      category: 'system'
    },
    {
      icon: <Globe size={20} />,
      label: 'Browser',
      action: () => openApp('browser'),
      category: 'internet'
    },
    {
      icon: <Clock size={20} />,
      label: 'Calendar',
      action: () => openApp('calendar'),
      category: 'office'
    },
    {
      icon: <Camera size={20} />,
      label: 'Camera',
      action: () => openApp('camera'),
      category: 'multimedia'
    },
  ]

  const toggleActions = [
    {
      icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      active: true
    },
    {
      icon: <Volume2 size={18} />,
      label: 'Volume',
      action: () => {},
      active: false
    },
    {
      icon: <Wifi size={18} />,
      label: 'WiFi',
      action: () => {},
      active: false
    },
    {
      icon: <Battery size={18} />,
      label: 'Battery',
      action: () => {},
      active: false
    },
  ]

  const recentWindows = windows.slice(-3).map(win => {
    const action = quickActions.find(a => a.label.toLowerCase().includes(win.title.toLowerCase()))
    return {
      title: win.title,
      icon: action?.icon || <TerminalIcon size={18} />,
      action: () => openApp(win.appId)
    }
  })

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          background: isOpen ? 'var(--accent-bg)' : 'transparent',
          border: 'none',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: 'var(--text-primary)',
          boxShadow: isOpen ? 'var(--glow-accent)' : 'none'
        }}
        title="Quick Actions"
        aria-label="Quick Actions"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '10px',
              width: '320px',
              background: 'var(--launcher-bg)',
              border: '1px solid var(--launcher-border)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Quick Actions
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'var(--text-primary)',
                    minWidth: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-bg)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--glass-bg)'
                    e.currentTarget.style.borderColor = 'var(--glass-border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  title={action.label}
                >
                  {action.icon}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '12px',
              marginTop: '8px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Toggles
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {toggleActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      flex: '1 1 auto',
                      minWidth: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      background: action.active ? 'var(--accent-bg)' : 'var(--glass-bg)',
                      border: action.active ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: action.active ? 'var(--accent)' : 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {recentWindows.length > 0 && (
              <div style={{
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '12px',
                marginTop: '12px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Recent
                </div>

                {recentWindows.map((win, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      win.action()
                      setIsOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--glass-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {win.icon}
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{win.title}</span>
                  </button>
                ))}
              </div>
            )}

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--glass-border)',
              textAlign: 'center'
            }}>
              <button
                onClick={() => {
                  openApp('settings')
                  setIsOpen(false)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'var(--accent-bg)',
                  border: '1px solid var(--accent)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--accent)',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-bg)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
              >
                <Settings size={16} />
                Open Settings
              </button>
            </div>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
})

export default QuickActions
