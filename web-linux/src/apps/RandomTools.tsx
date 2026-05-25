import { useState, useCallback } from 'react'

export default function RandomTools() {
  const [activeTab, setActiveTab] = useState('number')
  const [minNum, setMinNum] = useState('1')
  const [maxNum, setMaxNum] = useState('100')
  const [numberResult, setNumberResult] = useState<number | null>(null)
  const [passwordLength, setPasswordLength] = useState('16')
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [passwordResult, setPasswordResult] = useState('')
  const [diceCount, setDiceCount] = useState('1')
  const [diceSides, setDiceSides] = useState('6')
  const [diceResults, setDiceResults] = useState<number[]>([])
  const [lotteryItems, setLotteryItems] = useState('苹果\n香蕉\n橙子\n葡萄\n西瓜')
  const [lotteryResult, setLotteryResult] = useState<string | null>(null)
  const [coinResult, setCoinResult] = useState<string | null>(null)

  const generateRandomNumber = useCallback(() => {
    const min = parseInt(minNum) || 1
    const max = parseInt(maxNum) || 100
    const actualMin = Math.min(min, max)
    const actualMax = Math.max(min, max)
    const result = Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin
    setNumberResult(result)
  }, [minNum, maxNum])

  const generatePassword = useCallback(() => {
    const length = parseInt(passwordLength) || 16
    let chars = ''
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (useNumbers) chars += '0123456789'
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (!chars) {
      chars = 'abcdefghijklmnopqrstuvwxyz'
    }
    
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPasswordResult(password)
  }, [passwordLength, useUppercase, useLowercase, useNumbers, useSymbols])

  const rollDice = useCallback(() => {
    const count = parseInt(diceCount) || 1
    const sides = parseInt(diceSides) || 6
    const results = []
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1)
    }
    setDiceResults(results)
  }, [diceCount, diceSides])

  const drawLottery = useCallback(() => {
    const items = lotteryItems.split('\n').filter(item => item.trim())
    if (items.length === 0) {
      setLotteryResult('请输入选项！')
      return
    }
    const winner = items[Math.floor(Math.random() * items.length)]
    setLotteryResult(winner)
  }, [lotteryItems])

  const flipCoin = useCallback(() => {
    const result = Math.random() < 0.5 ? '正面' : '反面'
    setCoinResult(result)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      const original = document.activeElement as HTMLElement
      const temp = document.createElement('div')
      temp.style.position = 'fixed'
      temp.style.bottom = '100px'
      temp.style.left = '50%'
      temp.style.transform = 'translateX(-50%)'
      temp.style.background = 'var(--accent-primary)'
      temp.style.color = 'white'
      temp.style.padding = '10px 20px'
      temp.style.borderRadius = '8px'
      temp.style.zIndex = '9999'
      temp.textContent = '已复制到剪贴板！'
      document.body.appendChild(temp)
      setTimeout(() => temp.remove(), 1500)
      original?.focus()
    })
  }

  return (
    <div className="random-tools" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--panel-bg)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--panel-bg)'
      }}>
        {[
          { id: 'number', name: '随机数', icon: '🔢' },
          { id: 'password', name: '密码生成', icon: '🔐' },
          { id: 'dice', name: '掷骰子', icon: '🎲' },
          { id: 'lottery', name: '抽奖', icon: '🎯' },
          { id: 'coin', name: '掷硬币', icon: '🪙' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activeTab === 'number' && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>🔢 随机数生成器</h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>最小值</label>
                <input
                  type="number"
                  value={minNum}
                  onChange={(e) => setMinNum(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>最大值</label>
                <input
                  type="number"
                  value={maxNum}
                  onChange={(e) => setMaxNum(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            <button
              onClick={generateRandomNumber}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              🎲 生成随机数
            </button>
            {numberResult !== null && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'var(--accent-primary)',
                borderRadius: '12px',
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {numberResult}
              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>🔐 密码生成器</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>密码长度: {passwordLength}</label>
              <input
                type="range"
                min="4"
                max="64"
                value={passwordLength}
                onChange={(e) => setPasswordLength(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} />
                <span>大写字母 (A-Z)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} />
                <span>小写字母 (a-z)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
                <span>数字 (0-9)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
                <span>特殊字符 (!@#$)</span>
              </label>
            </div>
            <button
              onClick={generatePassword}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              ✨ 生成密码
            </button>
            {passwordResult && (
              <div style={{
                background: 'var(--input-bg)',
                padding: '15px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '18px',
                wordBreak: 'break-all',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>{passwordResult}</span>
                <button
                  onClick={() => copyToClipboard(passwordResult)}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--accent-secondary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📋 复制
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dice' && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>🎲 掷骰子</h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>骰子数量</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={diceCount}
                  onChange={(e) => setDiceCount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>面数</label>
                <select
                  value={diceSides}
                  onChange={(e) => setDiceSides(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="4">4面 (D4)</option>
                  <option value="6">6面 (D6)</option>
                  <option value="8">8面 (D8)</option>
                  <option value="10">10面 (D10)</option>
                  <option value="12">12面 (D12)</option>
                  <option value="20">20面 (D20)</option>
                  <option value="100">100面 (D100)</option>
                </select>
              </div>
            </div>
            <button
              onClick={rollDice}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              🎲 掷骰子
            </button>
            {diceResults.length > 0 && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  {diceResults.map((result, i) => (
                    <div
                      key={i}
                      style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', fontSize: '18px' }}>
                  总和: <strong>{diceResults.reduce((a, b) => a + b, 0)}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lottery' && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>🎯 抽奖工具</h2>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>选项 (每行一个)</label>
              <textarea
                value={lotteryItems}
                onChange={(e) => setLotteryItems(e.target.value)}
                rows={8}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              onClick={drawLottery}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              🎰 开始抽奖
            </button>
            {lotteryResult && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                🎉 {lotteryResult}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coin' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '40px', fontSize: '18px' }}>🪙 掷硬币</h2>
            <div
              style={{
                width: '150px',
                height: '150px',
                margin: '0 auto 40px',
                borderRadius: '50%',
                background: coinResult === '正面' 
                  ? 'linear-gradient(145deg, #ffd700, #ffed4e)' 
                  : coinResult === '反面'
                  ? 'linear-gradient(145deg, #c0c0c0, #e8e8e8)'
                  : 'linear-gradient(145deg, #b8860b, #daa520)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                color: coinResult === '反面' ? '#333' : '#8B4513'
              }}
            >
              {coinResult === '正面' ? '正' : coinResult === '反面' ? '反' : '?'}
            </div>
            <button
              onClick={flipCoin}
              style={{
                padding: '15px 40px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              🎲 掷硬币
            </button>
          </div>
        )}
      </div>

      <style>{`
        .random-tools input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: var(--border-color);
        }
        .random-tools input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
