import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  appName?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorCount: number
  lastErrorTime: number
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorCount: 0, lastErrorTime: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    const now = Date.now()
    const isRecentError = now - this.state.lastErrorTime < 5000
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: isRecentError ? prevState.errorCount + 1 : 1,
      lastErrorTime: now,
    }))
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      const appName = this.props.appName || '应用'
      const isFrequentError = this.state.errorCount > 2
      
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '24px',
            background: 'var(--window-bg)',
            borderRadius: '8px',
          }}
          role="alert"
          aria-live="assertive"
        >
          <span style={{ fontSize: '64px', marginBottom: '20px' }} aria-hidden="true">
            {isFrequentError ? '🚨' : '⚠️'}
          </span>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
            {isFrequentError ? `${appName}遇到了一些问题` : `${appName}加载出错`}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', textAlign: 'center', maxWidth: '400px' }}>
            {this.state.error?.message || '发生了一个未知错误'}
          </p>
          {this.state.errorCount > 1 && (
            <p style={{ color: 'var(--accent)', fontSize: '12px', marginBottom: '16px' }}>
              错误已连续发生 {this.state.errorCount} 次
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent)'}
            >
              重试
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid var(--window-border)',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--titlebar-button-hover)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              重新加载页面
            </button>
          </div>
          {isFrequentError && (
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '12px', 
              marginTop: '16px',
              textAlign: 'center'
            }}>
              如果问题持续存在，请尝试刷新整个页面
            </p>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary