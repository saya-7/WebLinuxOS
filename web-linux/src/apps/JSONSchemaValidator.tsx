import { useState, useCallback, memo } from 'react'

interface ValidationError {
  message: string
  path?: string
  instancePath?: string
  keyword?: string
}

type SchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null'

interface JSONSchema {
  type?: SchemaType | SchemaType[]
  properties?: Record<string, JSONSchema>
  required?: string[]
  items?: JSONSchema
  additionalProperties?: boolean | JSONSchema
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: unknown[]
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
  format?: string
}

const JSONSchemaValidator = memo(function JSONSchemaValidator() {
  const [jsonSchema, setJsonSchema] = useState(`{
  "type": "object",
  "title": "User",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 50
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "active": {
      "type": "boolean"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    }
  },
  "required": ["name", "email"]
}`)
  const [jsonData, setJsonData] = useState(`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "tags": ["developer", "web"]
}`)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [validationTime, setValidationTime] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'schema' | 'data' | 'results'>('schema')

  const validateSchema = useCallback((schema: JSONSchema, data: unknown, path: string = ''): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!schema) return errors

    const validateType = (type: SchemaType, value: unknown): boolean => {
      switch (type) {
        case 'string': return typeof value === 'string'
        case 'number': return typeof value === 'number'
        case 'integer': return Number.isInteger(value)
        case 'boolean': return typeof value === 'boolean'
        case 'array': return Array.isArray(value)
        case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value)
        case 'null': return value === null
        default: return true
      }
    }

    if (schema.type) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type]
      if (!types.some(t => validateType(t, data))) {
        errors.push({
          message: `预期类型 ${types.join(' 或 ')}，实际类型 ${typeof data}`,
          path
        })
      }
    }

    if (schema.type === 'object' && typeof data === 'object' && data !== null && !Array.isArray(data)) {
      const obj = data as Record<string, unknown>

      if (schema.required) {
        for (const req of schema.required) {
          if (!(req in obj)) {
            errors.push({
              message: `缺少必需字段: ${req}`,
              path: path ? `${path}.${req}` : req,
              keyword: 'required'
            })
          }
        }
      }

      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (key in obj) {
            const propPath = path ? `${path}.${key}` : key
            errors.push(...validateSchema(propSchema, obj[key], propPath))
          }
        }
      }

      if (schema.additionalProperties === false) {
        const knownProps = Object.keys(schema.properties || {})
        for (const key of Object.keys(obj)) {
          if (!knownProps.includes(key)) {
            errors.push({
              message: `不允许额外的属性: ${key}`,
              path: path ? `${path}.${key}` : key,
              keyword: 'additionalProperties'
            })
          }
        }
      }
    }

    if (schema.type === 'array' && Array.isArray(data)) {
      if (schema.minItems !== undefined && data.length < schema.minItems) {
        errors.push({
          message: `数组长度不能小于 ${schema.minItems}，当前: ${data.length}`,
          path,
          keyword: 'minItems'
        })
      }
      if (schema.maxItems !== undefined && data.length > schema.maxItems) {
        errors.push({
          message: `数组长度不能大于 ${schema.maxItems}，当前: ${data.length}`,
          path,
          keyword: 'maxItems'
        })
      }
      if (schema.uniqueItems) {
        const seen = new Set()
        for (let i = 0; i < data.length; i++) {
          const item = JSON.stringify(data[i])
          if (seen.has(item)) {
            errors.push({
              message: `数组项不唯一，索引 ${i}`,
              path: path ? `${path}[${i}]` : `[${i}]`,
              keyword: 'uniqueItems'
            })
          }
          seen.add(item)
        }
      }
      if (schema.items) {
        data.forEach((item, index) => {
          errors.push(...validateSchema(schema.items!, item, path ? `${path}[${index}]` : `[${index}]`))
        })
      }
    }

    if (typeof data === 'string') {
      if (schema.minLength !== undefined && data.length < schema.minLength) {
        errors.push({
          message: `字符串长度不能小于 ${schema.minLength}，当前: ${data.length}`,
          path,
          keyword: 'minLength'
        })
      }
      if (schema.maxLength !== undefined && data.length > schema.maxLength) {
        errors.push({
          message: `字符串长度不能大于 ${schema.maxLength}，当前: ${data.length}`,
          path,
          keyword: 'maxLength'
        })
      }
      if (schema.pattern) {
        try {
          const regex = new RegExp(schema.pattern)
          if (!regex.test(data)) {
            errors.push({
              message: `字符串不匹配模式: ${schema.pattern}`,
              path,
              keyword: 'pattern'
            })
          }
        } catch {
          // 忽略无效的正则表达式
        }
      }
      if (schema.format) {
        let valid = true
        switch (schema.format) {
          case 'email':
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)
            break
          case 'uri':
            try {
              new URL(data)
            } catch {
              valid = false
            }
            break
          case 'date':
            valid = !isNaN(Date.parse(data))
            break
        }
        if (!valid) {
          errors.push({
            message: `字符串格式不是有效的 ${schema.format}`,
            path,
            keyword: 'format'
          })
        }
      }
    }

    if (typeof data === 'number') {
      if (schema.minimum !== undefined && data < schema.minimum) {
        errors.push({
          message: `数值不能小于 ${schema.minimum}，当前: ${data}`,
          path,
          keyword: 'minimum'
        })
      }
      if (schema.maximum !== undefined && data > schema.maximum) {
        errors.push({
          message: `数值不能大于 ${schema.maximum}，当前: ${data}`,
          path,
          keyword: 'maximum'
        })
      }
    }

    if (schema.enum) {
      if (!schema.enum.some(e => JSON.stringify(e) === JSON.stringify(data))) {
        errors.push({
          message: `值必须是以下之一: ${JSON.stringify(schema.enum)}`,
          path,
          keyword: 'enum'
        })
      }
    }

    return errors
  }, [])

  const runValidation = useCallback(() => {
    const startTime = performance.now()
    try {
      const schema = JSON.parse(jsonSchema) as JSONSchema
      const data = JSON.parse(jsonData)
      const validationErrors = validateSchema(schema, data)
      setErrors(validationErrors)
      setIsValid(validationErrors.length === 0)
      const endTime = performance.now()
      setValidationTime(endTime - startTime)
    } catch (e) {
      setErrors([{
        message: e instanceof Error ? `JSON 解析错误: ${e.message}` : '无效的 JSON'
      }])
      setIsValid(false)
      setValidationTime(0)
    }
  }, [jsonSchema, jsonData, validateSchema])

  const formatJson = useCallback((jsonStr: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2)
    } catch {
      return jsonStr
    }
  }, [])

  const presetSchemas = [
    {
      name: '用户数据',
      schema: `{
  "type": "object",
  "title": "User",
  "properties": {
    "name": { "type": "string", "minLength": 2 },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["name", "email"]
}`,
      data: `{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 28
}`
    },
    {
      name: '产品列表',
      schema: `{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "integer" },
      "name": { "type": "string" },
      "price": { "type": "number", "minimum": 0 }
    },
    "required": ["id", "name", "price"]
  },
  "uniqueItems": true
}`,
      data: `[{
  "id": 1,
  "name": "Laptop",
  "price": 999.99
}]`
    },
    {
      name: 'API 响应',
      schema: `{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" },
    "data": { "type": ["object", "array"] },
    "message": { "type": "string" }
  },
  "required": ["success"]
}`,
      data: `{
  "success": true,
  "data": { "result": "ok" },
  "message": "操作成功"
}`
    }
  ]

  return (
    <div className="app-container" style={{
      height: '100%',
      background: 'linear-gradient(180deg, #1e1e2e 0%, #181825 100%)',
      color: '#cdd6f4',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #45475a',
        background: '#313244',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#89b4fa' }}>
          📋 JSON Schema 验证器
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            style={{
              padding: '6px 12px',
              background: '#45475a',
              border: '1px solid #585b70',
              borderRadius: '6px',
              color: '#cdd6f4',
              fontSize: '12px'
            }}
            onChange={(e) => {
              const preset = presetSchemas[parseInt(e.target.value)]
              if (preset) {
                setJsonSchema(preset.schema)
                setJsonData(preset.data)
                setErrors([])
                setIsValid(null)
              }
            }}
          >
            <option value="">加载预设...</option>
            {presetSchemas.map((p, i) => (
              <option key={i} value={i}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={runValidation}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #89b4fa, #74c7ec)',
              border: 'none',
              borderRadius: '6px',
              color: '#1e1e2e',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            验证
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid #45475a',
        background: '#1e1e2e'
      }}>
        {(['schema', 'data', 'results'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab ? '#313244' : 'transparent',
              border: 'none',
              color: activeTab === tab ? '#89b4fa' : '#6c7086',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: activeTab === tab ? 600 : 500
            }}
          >
            {tab === 'schema' && '📝 Schema'}
            {tab === 'data' && '📄 数据'}
            {tab === 'results' && '✅ 结果'}
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {activeTab === 'schema' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              padding: '8px 16px',
              background: '#1e1e2e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#6c7086'
            }}>
              <span>JSON Schema</span>
              <button
                onClick={() => setJsonSchema(formatJson(jsonSchema))}
                style={{
                  padding: '4px 8px',
                  background: '#45475a',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#cdd6f4',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                格式化
              </button>
            </div>
            <textarea
              value={jsonSchema}
              onChange={(e) => setJsonSchema(e.target.value)}
              style={{
                flex: 1,
                padding: '16px',
                background: '#181825',
                border: 'none',
                color: '#cdd6f4',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'data' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{
              padding: '8px 16px',
              background: '#1e1e2e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#6c7086'
            }}>
              <span>JSON 数据</span>
              <button
                onClick={() => setJsonData(formatJson(jsonData))}
                style={{
                  padding: '4px 8px',
                  background: '#45475a',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#cdd6f4',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                格式化
              </button>
            </div>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              style={{
                flex: 1,
                padding: '16px',
                background: '#181825',
                border: 'none',
                color: '#cdd6f4',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'results' && (
          <div style={{
            flex: 1,
            padding: '16px',
            overflow: 'auto'
          }}>
            {isValid === null && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6c7086'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <div>点击"验证"按钮开始验证</div>
              </div>
            )}

            {isValid === true && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(166, 227, 161, 0.15), rgba(166, 227, 161, 0.05))',
                  border: '1px solid rgba(166, 227, 161, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '32px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#a6e3a1' }}>验证通过！</div>
                    <div style={{ fontSize: '13px', color: '#6c7086' }}>数据完全符合 Schema 规范</div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div style={{
                    padding: '16px',
                    background: '#313244',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#6c7086', marginBottom: '4px' }}>验证时间</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#89b4fa' }}>
                      {validationTime.toFixed(2)}ms
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: '#313244',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#6c7086', marginBottom: '4px' }}>错误数</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#a6e3a1' }}>0</div>
                  </div>
                </div>
              </div>
            )}

            {isValid === false && errors.length > 0 && (
              <div>
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(243, 139, 168, 0.15), rgba(243, 139, 168, 0.05))',
                  border: '1px solid rgba(243, 139, 168, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '32px' }}>❌</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#f38ba8' }}>验证失败</div>
                    <div style={{ fontSize: '13px', color: '#6c7086' }}>发现 {errors.length} 个错误</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '14px',
                        background: '#313244',
                        border: '1px solid #45475a',
                        borderRadius: '8px',
                        borderLeft: '4px solid #f38ba8'
                      }}
                    >
                      {error.path && (
                        <div style={{
                          fontSize: '11px',
                          color: '#74c7ec',
                          marginBottom: '4px',
                          fontFamily: 'monospace'
                        }}>
                          📍 {error.path}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: '#cdd6f4' }}>
                        {error.message}
                      </div>
                      {error.keyword && (
                        <div style={{
                          fontSize: '11px',
                          color: '#6c7086',
                          marginTop: '6px',
                          display: 'inline-block',
                          padding: '2px 8px',
                          background: '#1e1e2e',
                          borderRadius: '4px'
                        }}>
                          关键字: {error.keyword}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export default JSONSchemaValidator
