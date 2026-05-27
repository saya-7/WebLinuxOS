import { useState, memo } from 'react'
import { useStore } from '../store'
import type { Notification } from '../types'
import { X, Bell, Check, Trash2, Clock, AlertCircle } from 'lucide-react'

const NotificationItem = memo(function NotificationItem({ 
  notification, 
  onRemove 
}: { 
  notification: Notification
  onRemove: () => void 
}) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.1)',
          border: 'rgba(34, 197, 94, 0.3)',
          icon: <Check size={16} style={{ color: '#22c55e' }} />
        }
      case 'warning':
        return {
          bg: 'rgba(251, 191, 36, 0.1)',
          border: 'rgba(251, 191, 36, 0.3)',
          icon: <AlertCircle size={16} style={{ color: '#fbbf24' }} />
        }
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: <X size={16} style={{ color: '#ef4444' }} />
        }
      default:
        return {
          bg: 'rgba(139, 124, 240, 0.1)',
          border: 'rgba(139, 124, 240, 0.3)',
          icon: <Bell size={16} style={{ color: '#8b7cf0' }} />
        }
    }
  }

  const styles = getTypeStyles(notification.type || 'info')
  
  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`
    
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        animation: 'slideIn 0.3s ease',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {styles.icon}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 4 
        }}>
          <div style={{ 
            fontSize: 13, 
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {notification.title}
          </div>
          <button
            onClick={onRemove}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <X size={14} />
          </button>
        </div>
        
        <div style={{ 
          fontSize: 12, 
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
          marginBottom: 6,
          wordBreak: 'break-word'
        }}>
          {notification.message}
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          fontSize: 11,
          color: 'var(--text-secondary)',
          opacity: 0.7
        }}>
          <Clock size={10} />
          <span>{formatTime(notification.timestamp || new Date())}</span>
        </div>
      </div>
    </div>
  )
})

export default function NotificationSystem() {
  const notifications = useStore((s) => s.notifications)
  const removeNotification = useStore((s) => s.removeNotification)
  const toggleNotificationCenter = useStore((s) => s.toggleNotificationCenter)
  const notificationCenterOpen = useStore((s) => s.notificationCenterOpen)
  const [filter, setFilter] = useState<string>('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    return n.type === filter
  })

  const handleClearAll = () => {
    if (showClearConfirm) {
      notifications.forEach(n => removeNotification(n.id))
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  const filterOptions = [
    { id: 'all', label: '全部', count: notifications.length },
    { id: 'info', label: '通知', count: notifications.filter(n => !n.type || n.type === 'info').length },
    { id: 'success', label: '成功', count: notifications.filter(n => n.type === 'success').length },
    { id: 'warning', label: '警告', count: notifications.filter(n => n.type === 'warning').length },
    { id: 'error', label: '错误', count: notifications.filter(n => n.type === 'error').length },
  ]

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .notification-center-glass {
          background: rgba(30, 30, 50, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
      `}</style>
      
      <div
        className="notification-center-glass"
        style={{
          position: 'fixed',
          top: 0,
          right: notificationCenterOpen ? 0 : '-400px',
          width: 380,
          height: '100vh',
          zIndex: 10001,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: notificationCenterOpen ? '-8px 0 32px rgba(0,0,0,0.4)' : 'none',
          borderLeft: '1px solid var(--window-border)',
        }}
      >
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--window-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: 18, 
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              通知中心
            </h2>
            <p style={{ 
              margin: '4px 0 0', 
              fontSize: 12, 
              color: 'var(--text-secondary)' 
            }}>
              {notifications.length} 条通知
            </p>
          </div>
          
          <button
            onClick={toggleNotificationCenter}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--titlebar-button-hover)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--window-border)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto'
        }}>
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 16,
                border: 'none',
                background: filter === opt.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: filter === opt.id ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: filter === opt.id ? 600 : 400,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {opt.label}
              {opt.count > 0 && (
                <span style={{
                  background: filter === opt.id ? 'rgba(255,255,255,0.2)' : 'var(--accent-bg)',
                  padding: '2px 6px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 600
                }}>
                  {opt.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
          }}
        >
          {filteredNotifications.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                padding: 40
              }}
            >
              <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <p style={{ fontSize: 14, margin: 0 }}>
                {filter === 'all' ? '暂无通知' : `暂无${filterOptions.find(o => o.id === filter)?.label}`}
              </p>
              <p style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>
                你收到的新通知将显示在这里
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRemove={() => removeNotification(notification.id)}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div
            style={{
              padding: 16,
              borderTop: '1px solid var(--window-border)',
              display: 'flex',
              gap: 8
            }}
          >
            <button
              onClick={handleClearAll}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--window-border)',
                background: showClearConfirm ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                color: showClearConfirm ? '#ef4444' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                if (!showClearConfirm) {
                  e.currentTarget.style.background = 'var(--titlebar-button-hover)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showClearConfirm) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Trash2 size={14} />
              {showClearConfirm ? '再次点击确认清空' : '清空所有通知'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
