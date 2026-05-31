import { memo } from 'react'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  fullScreen?: boolean
}

export default memo(function Loading({ size = 'medium', message = 'Loading...', fullScreen = false }: LoadingProps) {
  const spinnerSize = {
    small: 24,
    medium: 40,
    large: 60
  }[size]

  const containerStyle: React.CSSProperties = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--desktop-bg)',
    zIndex: 9999
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    width: '100%',
    height: '100%'
  }

  return (
    <div style={containerStyle}>
      <div style={{
        position: 'relative',
        width: spinnerSize,
        height: spinnerSize
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `3px solid var(--accent-bg)`,
          borderRadius: '50%',
          opacity: 0.3
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `3px solid transparent`,
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: spinnerSize * 0.4,
          height: spinnerSize * 0.4,
          background: 'var(--accent)',
          borderRadius: '50%',
          animation: 'pulse 1s ease-in-out infinite'
        }} />
      </div>

      {message && (
        <p style={{
          marginTop: '20px',
          fontSize: size === 'small' ? '14px' : '16px',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          {message}
        </p>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
})
