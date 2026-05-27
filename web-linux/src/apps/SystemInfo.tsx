import { useState, useEffect } from 'react'

interface SystemInfoData {
  platform: string
  osVersion: string
  browser: string
  browserVersion: string
  userAgent: string
  language: string
  screenWidth: number
  screenHeight: number
  colorDepth: number
  memory: { total: number; used: number; percentage: number }
  cpu: { cores: number; model: string }
  connection: { type: string; effectiveType: string; rtt: number }
  timezone: string
  online: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    type: string
    effectiveType: string
    rtt: number
  }
}

export default function SystemInfo() {
  const [info, setInfo] = useState<SystemInfoData>({
    platform: 'Unknown',
    osVersion: 'Unknown',
    browser: 'Unknown',
    browserVersion: 'Unknown',
    userAgent: '',
    language: '',
    screenWidth: 0,
    screenHeight: 0,
    colorDepth: 0,
    memory: { total: 0, used: 0, percentage: 0 },
    cpu: { cores: 4, model: 'Unknown' },
    connection: { type: 'unknown', effectiveType: 'unknown', rtt: 0 },
    timezone: '',
    online: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent
      let browser = 'Unknown'
      let version = 'Unknown'

      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browser = 'Google Chrome'
        const match = userAgent.match(/Chrome\/(\d+)/)
        version = match ? match[1] : 'Unknown'
      } else if (userAgent.includes('Edg')) {
        browser = 'Microsoft Edge'
        const match = userAgent.match(/Edg\/(\d+)/)
        version = match ? match[1] : 'Unknown'
      } else if (userAgent.includes('Firefox')) {
        browser = 'Mozilla Firefox'
        const match = userAgent.match(/Firefox\/(\d+)/)
        version = match ? match[1] : 'Unknown'
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Apple Safari'
        const match = userAgent.match(/Version\/(\d+)/)
        version = match ? match[1] : 'Unknown'
      } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        browser = 'Opera'
        const match = userAgent.match(/OPR\/(\d+)/) || userAgent.match(/Opera\/(\d+)/)
        version = match ? match[1] : 'Unknown'
      }

      return { browser, version }
    }

    const getPlatformInfo = () => {
      const platform = navigator.platform
      let os = 'Unknown'
      let osVersion = 'Unknown'

      if (platform.includes('Win')) {
        os = 'Windows'
        if (navigator.userAgent.includes('Windows NT 10.0')) osVersion = '10'
        else if (navigator.userAgent.includes('Windows NT 6.3')) osVersion = '8.1'
        else if (navigator.userAgent.includes('Windows NT 6.2')) osVersion = '8'
        else if (navigator.userAgent.includes('Windows NT 6.1')) osVersion = '7'
      } else if (platform.includes('Mac')) {
        os = 'macOS'
        const match = navigator.userAgent.match(/Mac OS X (\d+_\d+)/)
        osVersion = match ? match[1].replace('_', '.') : 'Unknown'
      } else if (platform.includes('Linux')) {
        os = 'Linux'
        osVersion = navigator.userAgent.includes('Ubuntu') ? 'Ubuntu' : 'Unknown'
      } else if (platform.includes('Android')) {
        os = 'Android'
        const match = navigator.userAgent.match(/Android (\d+\.\d+)/)
        osVersion = match ? match[1] : 'Unknown'
      } else if (platform.includes('iPhone') || platform.includes('iPad')) {
        os = 'iOS'
        const match = navigator.userAgent.match(/OS (\d+)_(\d+)/)
        osVersion = match ? `${match[1]}.${match[2]}` : 'Unknown'
      }

      return { os, osVersion }
    }

    const fetchSystemInfo = async () => {
      const { browser, version: browserVersion } = getBrowserInfo()
      const { os: platform, osVersion } = getPlatformInfo()

      const nav = navigator as NavigatorWithConnection
      const connectionInfo = nav.connection || {
        type: 'unknown',
        effectiveType: 'unknown',
        rtt: 0,
      }

      const storage = navigator.storage
      let memoryQuota = 1024 * 1024 * 1024
      let memoryUsage = 0

      if (storage && storage.estimate) {
        try {
          const memoryInfo = await storage.estimate()
          if (memoryInfo.quota !== undefined) memoryQuota = memoryInfo.quota
          if (memoryInfo.usage !== undefined) memoryUsage = memoryInfo.usage
        } catch {
          // ignore
        }
      }

      const totalMemoryGB = (memoryQuota / (1024 * 1024 * 1024)).toFixed(2)
      const usedMemoryGB = (memoryUsage / (1024 * 1024 * 1024)).toFixed(2)
      const memoryPercentage = ((memoryUsage / memoryQuota) * 100).toFixed(1)

      setInfo({
        platform,
        osVersion,
        browser,
        browserVersion,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        memory: {
          total: parseFloat(totalMemoryGB),
          used: parseFloat(usedMemoryGB),
          percentage: parseFloat(memoryPercentage),
        },
        cpu: {
          cores: navigator.hardwareConcurrency || 4,
          model: 'Unknown',
        },
        connection: {
          type: connectionInfo.type,
          effectiveType: connectionInfo.effectiveType,
          rtt: connectionInfo.rtt,
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online: navigator.onLine,
      })

      setLoading(false)
    }

    fetchSystemInfo()
  }, [])

  if (loading) {
    return (
      <div className="system-info-container" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div className="system-info-container" style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-primary)' }}>系统信息</h2>

      <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>操作系统</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🖥️</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{info.platform}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>版本 {info.osVersion}</div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>浏览器</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🌐</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{info.browser}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>版本 {info.browserVersion}</div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>屏幕信息</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🖼️</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{info.screenWidth} × {info.screenHeight}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>颜色深度: {info.colorDepth} 位</div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CPU</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>⚙️</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{info.cpu.cores} 核心</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{info.cpu.model}</div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>存储</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>💾</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>浏览器存储</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {info.memory.used.toFixed(2)} GB / {info.memory.total.toFixed(2)} GB ({info.memory.percentage}%)
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--scrollbar-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${info.memory.percentage}%`,
                    background: 'var(--accent)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>网络</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>{info.online ? '📶' : '📴'}</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: info.online ? '#10b981' : '#ef4444' }}>
                {info.online ? '在线' : '离线'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {info.connection.type} · {info.connection.effectiveType}
              </div>
            </div>
          </div>
        </div>

        <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>语言 / 时区</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🌍</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{info.language}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{info.timezone}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card" style={{ background: 'var(--window-bg)', border: '1px solid var(--window-border)', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User Agent</h3>
        <pre style={{ fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-all', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
          {info.userAgent}
        </pre>
      </div>
    </div>
  )
}