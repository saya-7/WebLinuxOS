import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <AlertTriangle size={64} style={{ marginBottom: '20px', color: '#ffd93d' }} />

            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Oops! Something went wrong
            </h1>

            <p style={{
              fontSize: '16px',
              marginBottom: '30px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6'
            }}>
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#ffd93d'
                }}>
                  Error Details (Development Only)
                </summary>
                <div>
                  <p style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  <p style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
                    <strong>Stack:</strong> {this.state.error.stack?.split('\n').slice(0, 3).join('\n')}
                  </p>
                  {this.state.errorInfo && (
                    <p style={{ wordBreak: 'break-all' }}>
                      <strong>Component Stack:</strong>{' '}
                      {this.state.errorInfo.componentStack?.split('\n').slice(0, 3).join('\n')}
                    </p>
                  )}
                </div>
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <RefreshCw size={20} />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Home size={20} />
                Try Again
              </button>
            </div>

            <p style={{
              marginTop: '24px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              If this problem persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
