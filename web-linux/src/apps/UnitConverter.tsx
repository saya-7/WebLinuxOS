import { useState, useCallback, useMemo } from 'react'

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'time' | 'data'

interface Unit {
  name: string
  symbol: string
  factor: number
  offset?: number
}

const unitDefinitions: Record<Category, Unit[]> = {
  length: [
    { name: '米', symbol: 'm', factor: 1 },
    { name: '千米', symbol: 'km', factor: 1000 },
    { name: '厘米', symbol: 'cm', factor: 0.01 },
    { name: '毫米', symbol: 'mm', factor: 0.001 },
    { name: '英里', symbol: 'mi', factor: 1609.344 },
    { name: '码', symbol: 'yd', factor: 0.9144 },
    { name: '英尺', symbol: 'ft', factor: 0.3048 },
    { name: '英寸', symbol: 'in', factor: 0.0254 },
  ],
  weight: [
    { name: '千克', symbol: 'kg', factor: 1 },
    { name: '克', symbol: 'g', factor: 0.001 },
    { name: '毫克', symbol: 'mg', factor: 0.000001 },
    { name: '吨', symbol: 't', factor: 1000 },
    { name: '磅', symbol: 'lb', factor: 0.453592 },
    { name: '盎司', symbol: 'oz', factor: 0.0283495 },
  ],
  temperature: [
    { name: '摄氏度', symbol: '°C', factor: 1, offset: 0 },
    { name: '华氏度', symbol: '°F', factor: 5/9, offset: -32 },
    { name: '开尔文', symbol: 'K', factor: 1, offset: -273.15 },
  ],
  area: [
    { name: '平方米', symbol: 'm²', factor: 1 },
    { name: '平方千米', symbol: 'km²', factor: 1000000 },
    { name: '公顷', symbol: 'ha', factor: 10000 },
    { name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
    { name: '平方英里', symbol: 'mi²', factor: 2589988.11 },
    { name: '英亩', symbol: 'ac', factor: 4046.86 },
  ],
  volume: [
    { name: '立方米', symbol: 'm³', factor: 1 },
    { name: '升', symbol: 'L', factor: 0.001 },
    { name: '毫升', symbol: 'mL', factor: 0.000001 },
    { name: '立方厘米', symbol: 'cm³', factor: 0.000001 },
    { name: '加仑', symbol: 'gal', factor: 0.00378541 },
    { name: '夸脱', symbol: 'qt', factor: 0.000946353 },
  ],
  speed: [
    { name: '米/秒', symbol: 'm/s', factor: 1 },
    { name: '千米/小时', symbol: 'km/h', factor: 0.277778 },
    { name: '英里/小时', symbol: 'mph', factor: 0.44704 },
    { name: '英尺/秒', symbol: 'ft/s', factor: 0.3048 },
    { name: '节', symbol: 'kn', factor: 0.514444 },
  ],
  time: [
    { name: '秒', symbol: 's', factor: 1 },
    { name: '毫秒', symbol: 'ms', factor: 0.001 },
    { name: '分钟', symbol: 'min', factor: 60 },
    { name: '小时', symbol: 'h', factor: 3600 },
    { name: '天', symbol: 'd', factor: 86400 },
    { name: '周', symbol: 'wk', factor: 604800 },
  ],
  data: [
    { name: '字节', symbol: 'B', factor: 1 },
    { name: '千字节', symbol: 'KB', factor: 1024 },
    { name: '兆字节', symbol: 'MB', factor: 1048576 },
    { name: '吉字节', symbol: 'GB', factor: 1073741824 },
    { name: '太字节', symbol: 'TB', factor: 1099511627776 },
    { name: '比特', symbol: 'bit', factor: 0.125 },
  ],
}

const categoryNames: Record<Category, string> = {
  length: '长度',
  weight: '重量',
  temperature: '温度',
  area: '面积',
  volume: '体积',
  speed: '速度',
  time: '时间',
  data: '数据',
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length')
  const [fromValue, setFromValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState<string>(unitDefinitions.length[0].symbol)
  const [toUnit, setToUnit] = useState<string>(unitDefinitions.length[1].symbol)

  const convert = useCallback((value: number, from: Unit, to: Unit): number => {
    if (category === 'temperature') {
      let celsius: number
      if (from.symbol === '°C') celsius = value
      else if (from.symbol === '°F') celsius = (value - 32) * (5 / 9)
      else celsius = value - 273.15

      if (to.symbol === '°C') return celsius
      else if (to.symbol === '°F') return (celsius * (9 / 5)) + 32
      else return celsius + 273.15
    }
    return value * from.factor / to.factor
  }, [category])

  const fromUnitObj = useMemo(() => 
    unitDefinitions[category].find(u => u.symbol === fromUnit) || unitDefinitions[category][0],
    [category, fromUnit]
  )

  const toUnitObj = useMemo(() => 
    unitDefinitions[category].find(u => u.symbol === toUnit) || unitDefinitions[category][1],
    [category, toUnit]
  )

  const toValue = useMemo(() => {
    const num = parseFloat(fromValue)
    if (isNaN(num)) return ''
    const result = convert(num, fromUnitObj, toUnitObj)
    return Number.isInteger(result) ? String(result) : result.toFixed(8).replace(/\.?0+$/, '')
  }, [fromValue, fromUnitObj, toUnitObj, convert])

  const handleSwap = useCallback(() => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setFromValue(toValue)
  }, [fromUnit, toUnit, toValue])

  const handleCategoryChange = useCallback((newCat: Category) => {
    setCategory(newCat)
    setFromValue('1')
    setFromUnit(unitDefinitions[newCat][0].symbol)
    setToUnit(unitDefinitions[newCat][1].symbol)
  }, [])

  return (
    <div className="app-container" style={{ 
      padding: 20, 
      height: '100%', 
      overflowY: 'auto',
      background: 'var(--app-bg)'
    }}>
      <style>{`
        .unit-converter {
          max-width: 600px;
          margin: 0 auto;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .category-btn {
          padding: 12px 8px;
          border: 1px solid var(--window-border);
          background: var(--window-bg);
          color: var(--text-primary);
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          text-align: center;
        }
        .category-btn:hover {
          background: var(--hover);
        }
        .category-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }
        .converter-box {
          background: var(--window-bg);
          border: 1px solid var(--window-border);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .input-group {
          margin-bottom: 16px;
        }
        .input-group:last-child {
          margin-bottom: 0;
        }
        .input-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: block;
        }
        .input-wrapper {
          display: flex;
          gap: 12px;
        }
        .number-input {
          flex: 1;
          padding: 14px 16px;
          font-size: 24px;
          background: var(--app-bg);
          border: 1px solid var(--window-border);
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
        }
        .number-input:focus {
          border-color: var(--accent);
        }
        .unit-select {
          padding: 14px 16px;
          font-size: 16px;
          background: var(--app-bg);
          border: 1px solid var(--window-border);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          outline: none;
          min-width: 120px;
        }
        .unit-select:focus {
          border-color: var(--accent);
        }
        .swap-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background: var(--app-bg);
          border: 1px solid var(--window-border);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 20px;
          margin: 8px 0;
          transition: all 0.2s;
        }
        .swap-btn:hover {
          background: var(--hover);
        }
        .quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .quick-btn {
          padding: 8px 16px;
          background: var(--app-bg);
          border: 1px solid var(--window-border);
          border-radius: 6px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .quick-btn:hover {
          background: var(--hover);
        }
      `}</style>

      <div className="unit-converter">
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: 20, 
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          📏 单位转换器
        </h2>

        <div className="category-grid">
          {(Object.keys(categoryNames) as Category[]).map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>

        <div className="converter-box">
          <div className="input-group">
            <label className="input-label">从</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="number-input"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="输入数值"
              />
              <select
                className="unit-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {unitDefinitions[category].map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="swap-btn" onClick={handleSwap}>
            ↺ 交换
          </button>

          <div className="input-group">
            <label className="input-label">到</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="number-input"
                value={toValue}
                readOnly
                placeholder="结果"
              />
              <select
                className="unit-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {unitDefinitions[category].map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {toValue && (
            <div style={{
              marginTop: 20,
              padding: 16,
              background: 'var(--app-bg)',
              borderRadius: 8,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>
                {fromValue} {fromUnitObj.name} =
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent)' }}>
                {toValue} {toUnitObj.name}
              </div>
            </div>
          )}

          <div className="quick-actions">
            <button className="quick-btn" onClick={() => setFromValue('1')}>1</button>
            <button className="quick-btn" onClick={() => setFromValue('10')}>10</button>
            <button className="quick-btn" onClick={() => setFromValue('100')}>100</button>
            <button className="quick-btn" onClick={() => setFromValue('1000')}>1000</button>
            <button className="quick-btn" onClick={() => setFromValue('')}>清空</button>
          </div>
        </div>

        <div style={{
          background: 'var(--window-bg)',
          border: '1px solid var(--window-border)',
          borderRadius: 12,
          padding: 16,
          fontSize: 13,
          color: 'var(--text-secondary)',
        }}>
          💡 提示：选择分类后，输入数值并选择源和目标单位即可自动转换。
        </div>
      </div>
    </div>
  )
}
