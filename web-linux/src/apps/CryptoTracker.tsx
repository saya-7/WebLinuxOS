import { useState, useEffect } from 'react'

interface Crypto {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  image?: string
}

const CRYPTO_API = 'https://api.coingecko.com/api/v3'

const POPULAR_CRYPTO = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
]

const MOCK_CRYPTO: Crypto[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 67523.42, change24h: 2.34, marketCap: 1328000000000, volume24h: 28900000000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change24h: -1.23, marketCap: 416000000000, volume24h: 15200000000 },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', price: 567.89, change24h: 0.87, marketCap: 85000000000, volume24h: 1800000000 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.5234, change24h: 3.45, marketCap: 28500000000, volume24h: 1200000000 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.4567, change24h: -0.56, marketCap: 16000000000, volume24h: 450000000 },
]

function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${value.toFixed(4)}`
}

export default function CryptoTracker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({})
  const [showAddCrypto, setShowAddCrypto] = useState(false)

  const fetchCryptoData = async () => {
    try {
      setError(null)
      const ids = POPULAR_CRYPTO.map(c => c.id).join(',')
      const response = await fetch(
        `${CRYPTO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data')
      }
      
      const data = await response.json()
      
      const formatted: Crypto[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        image: coin.image,
      }))
      
      setCryptos(formatted)
      setLastUpdated(new Date())
    } catch (err) {
      console.warn('Using mock crypto data:', err)
      setError('获取加密货币数据失败，使用模拟数据')
      setCryptos(MOCK_CRYPTO)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30 * 1000) // 每30秒更新
    return () => clearInterval(interval)
  }, [])

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const portfolioValue = Object.entries(portfolio).reduce((total, [id, amount]) => {
    const crypto = cryptos.find(c => c.id === id)
    return total + (crypto ? crypto.price * amount : 0)
  }, 0)

  const addToPortfolio = (crypto: Crypto, amount: number) => {
    setPortfolio(prev => ({
      ...prev,
      [crypto.id]: (prev[crypto.id] || 0) + amount
    }))
    setShowAddCrypto(false)
  }

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev }
      delete newPortfolio[id]
      return newPortfolio
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>🪙 加密货币追踪器</h2>
            <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '12px' }}>
              {lastUpdated ? `最后更新: ${formatDate(lastUpdated)}` : '加载中...'}
            </p>
          </div>
          <button
            onClick={fetchCryptoData}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔄 刷新
          </button>
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索加密货币..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Portfolio Summary */}
      {Object.keys(portfolio).length > 0 && (
        <div style={{ padding: '16px 20px', background: 'rgba(240, 147, 251, 0.1)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>💼 投资组合价值</div>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>{formatCurrency(portfolioValue)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        {/* Portfolio Section */}
        {Object.keys(portfolio).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px' }}>📊 我的持仓</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(portfolio).map(([id, amount]) => {
                const crypto = cryptos.find(c => c.id === id)
                if (!crypto) return null
                const value = crypto.price * amount
                return (
                  <div
                    key={id}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {crypto.image && (
                        <img src={crypto.image} alt={crypto.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      )}
                      <div>
                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{crypto.name}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{amount} {crypto.symbol}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#fff', fontWeight: '600' }}>{formatCurrency(value)}</div>
                        <div style={{ 
                          color: crypto.change24h >= 0 ? '#4ade80' : '#f87171',
                          fontSize: '12px'
                        }}>
                          {crypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromPortfolio(id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'rgba(248, 113, 113, 0.2)',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Market Data */}
        <div>
          <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px' }}>🌍 市场行情</h3>
          
          {loading ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px',
              color: '#888'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px', animation: 'spin 1s linear infinite' }}>🪙</div>
              <div>加载中...</div>
            </div>
          ) : error ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px',
              color: '#f87171'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
              <div>{error}</div>
              <button
                onClick={fetchCryptoData}
                style={{
                  marginTop: '16px',
                  padding: '8px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                重试
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredCryptos.map(crypto => (
                <div
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {crypto.image && (
                      <img src={crypto.image} alt={crypto.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    )}
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{crypto.name}</div>
                      <div style={{ color: '#888', fontSize: '12px' }}>{crypto.symbol}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{formatCurrency(crypto.price)}</div>
                      <div style={{ 
                        color: crypto.change24h >= 0 ? '#4ade80' : '#f87171',
                        fontSize: '12px'
                      }}>
                        {crypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.change24h).toFixed(2)}%
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCrypto(crypto)
                        setShowAddCrypto(true)
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      + 添加
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Crypto Detail Modal */}
      {selectedCrypto && !showAddCrypto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => setSelectedCrypto(null)}>
          <div style={{
            background: '#1a1a2e',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            overflow: 'hidden',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {selectedCrypto.image && (
                    <img src={selectedCrypto.image} alt={selectedCrypto.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  )}
                  <div>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>{selectedCrypto.name}</h3>
                    <div style={{ color: '#888', fontSize: '14px' }}>{selectedCrypto.symbol}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCrypto(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  {formatCurrency(selectedCrypto.price)}
                </div>
                <div style={{ 
                  color: selectedCrypto.change24h >= 0 ? '#4ade80' : '#f87171',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {selectedCrypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(selectedCrypto.change24h).toFixed(2)}% (24h)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>市值</div>
                  <div style={{ color: '#fff', fontWeight: '600' }}>{formatCurrency(selectedCrypto.marketCap)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>24h交易量</div>
                  <div style={{ color: '#fff', fontWeight: '600' }}>{formatCurrency(selectedCrypto.volume24h)}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAddCrypto(true)
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                添加到投资组合
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Portfolio Modal */}
      {selectedCrypto && showAddCrypto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px',
        }} onClick={() => setShowAddCrypto(false)}>
          <div style={{
            background: '#1a1a2e',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            overflow: 'hidden',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 20px 0' }}>添加到投资组合</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  数量
                </label>
                <input
                  type="number"
                  id="cryptoAmount"
                  placeholder="0.00"
                  step="0.0001"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowAddCrypto(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('cryptoAmount') as HTMLInputElement
                    const amount = parseFloat(input.value)
                    if (amount > 0 && selectedCrypto) {
                      addToPortfolio(selectedCrypto, amount)
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
