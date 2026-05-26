import { useState, useEffect } from 'react'

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  wind: number
  city: string
}

interface CryptoData {
  name: string
  price: number
  change: number
  icon: string
}

interface NewsItem {
  title: string
  source: string
  time: string
}

export default function SmartDashboard() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: '晴朗',
    humidity: 65,
    wind: 12,
    city: '北京',
  })
  
  const [crypto, setCrypto] = useState<CryptoData[]>([
    { name: 'Bitcoin', price: 67432.12, change: 2.4, icon: '₿' },
    { name: 'Ethereum', price: 3456.78, change: -1.2, icon: 'Ξ' },
    { name: 'Solana', price: 178.45, change: 5.6, icon: '◎' },
    { name: 'Cardano', price: 0.87, change: -0.4, icon: '₳' },
  ])
  
  const [news, setNews] = useState<NewsItem[]>([
    { title: 'Web3 技术革新：下一代互联网的崛起', source: 'TechCrunch', time: '2小时前' },
    { title: 'AI 驱动的应用开发新趋势', source: 'Dev.to', time: '4小时前' },
    { title: '开源社区最新动态', source: 'GitHub', time: '6小时前' },
    { title: '云计算架构优化实践分享', source: 'Medium', time: '8小时前' },
  ])
  
  const [systemStats, setSystemStats] = useState({
    cpu: 34,
    memory: 62,
    storage: 47,
    network: 89,
  })
  
  const [time, setTime] = useState(new Date())
  
  // Mark variables as used to avoid TS errors
  void setWeather;
  void setCrypto;
  void setNews;
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    const statsTimer = setInterval(() => {
      setSystemStats({
        cpu: Math.min(95, Math.max(10, systemStats.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(90, Math.max(30, systemStats.memory + (Math.random() - 0.5) * 5)),
        storage: systemStats.storage,
        network: Math.min(100, Math.max(20, systemStats.network + (Math.random() - 0.5) * 15)),
      })
    }, 2000)
    return () => clearInterval(statsTimer)
  }, [systemStats])
  
  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 6) return '夜深了 🌙'
    if (hour < 12) return '早上好 ☀️'
    if (hour < 18) return '下午好 🌤️'
    return '晚上好 🌆'
  }
  
  const StatCard = ({ icon, label, value, color, progress }: any) => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: 16,
      padding: 20,
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        {value}
      </div>
      {progress !== undefined && (
        <div style={{
          height: 6,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
            borderRadius: 3,
            transition: 'width 0.5s ease',
          }} />
        </div>
      )}
    </div>
  )
  
  return (
    <div 
      className="app-container app-smartdashboard"
      style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: 20,
        height: '100%',
        overflow: 'auto',
        color: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            {getGreeting()}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
            {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {time.toLocaleTimeString('zh-CN')}
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="💻" label="CPU" value={`${Math.round(systemStats.cpu)}%`} color="#3b82f6" progress={systemStats.cpu} />
        <StatCard icon="🧠" label="内存" value={`${Math.round(systemStats.memory)}%`} color="#8b5cf6" progress={systemStats.memory} />
        <StatCard icon="💾" label="存储" value={`${systemStats.storage}%`} color="#22c55e" progress={systemStats.storage} />
        <StatCard icon="🌐" label="网络" value={`${Math.round(systemStats.network)} Mb/s`} color="#f59e0b" progress={systemStats.network} />
      </div>
      
      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Weather */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 10px 40px rgba(59,130,246,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, marginBottom: 4 }}>
                  {weather.city}
                </div>
                <div style={{ fontSize: 56, fontWeight: 800 }}>
                  {weather.temp}°C
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, opacity: 0.9 }}>
                  {weather.condition}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 60 }}>☀️</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
                  💧 湿度 {weather.humidity}%
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  💨 风速 {weather.wind} km/h
                </div>
              </div>
            </div>
          </div>
          
          {/* News */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              📰 最新资讯
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {news.map((item, i) => (
                <div key={i} style={{
                  padding: 12,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {item.source} · {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Crypto */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              🪙 加密货币
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {crypto.map((coin, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{coin.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{coin.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                      ${coin.price.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: 11, 
                      fontWeight: 600, 
                      color: coin.change >= 0 ? '#22c55e' : '#ef4444',
                    }}>
                      {coin.change >= 0 ? '+' : ''}{coin.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#e2e8f0' }}>
              ⚡ 快捷操作
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { icon: '📝', label: '记事本' },
                { icon: '📊', label: '终端' },
                { icon: '🎵', label: '音乐' },
                { icon: '📁', label: '文件' },
              ].map((action, i) => (
                <div key={i} style={{
                  padding: 16,
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: 12,
                  border: '1px solid rgba(59,130,246,0.2)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{action.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#93c5fd' }}>{action.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
