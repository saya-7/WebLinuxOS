import { useState, useRef, useEffect, useCallback } from 'react'

interface TranscriptSegment {
  id: string
  text: string
  timestamp: Date
  isFinal: boolean
}

export default function VoiceTranscriber() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([])
  const [language, setLanguage] = useState('zh-CN')
  const [status, setStatus] = useState<'ready' | 'recording' | 'error'>('ready')
  const [errorMessage, setErrorMessage] = useState('')
  const [recognitionSupported, setRecognitionSupported] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')
  const interimTranscriptRef = useRef('')

  useEffect(() => {
    // 检查浏览器是否支持 Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setRecognitionSupported(false)
      setStatus('error')
      setErrorMessage('您的浏览器不支持语音识别功能，请使用 Chrome 或 Edge 浏览器')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language
      
      recognition.onstart = () => {
        setIsRecording(true)
        setStatus('recording')
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript
          const newSegment: TranscriptSegment = {
            id: Date.now().toString(),
            text: finalTranscript,
            timestamp: new Date(),
            isFinal: true
          }
          setTranscripts(prev => [...prev, newSegment])
        }

        interimTranscriptRef.current = interimTranscript
        
        // 更新字数统计
        const fullText = finalTranscriptRef.current + interimTranscriptRef.current
        setWordCount(fullText.replace(/\s/g, '').length)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setErrorMessage(`识别错误: ${event.error}`)
          setStatus('error')
          setIsRecording(false)
        }
      }

      recognition.onend = () => {
        if (isRecording) {
          // 如果用户没有手动停止，继续识别
          try {
            recognition.start()
          } catch (e) {
            // 忽略错误
          }
        }
      }

      recognitionRef.current = recognition
    } catch (e) {
      setRecognitionSupported(false)
      setStatus('error')
      setErrorMessage('初始化语音识别失败')
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // 忽略
        }
      }
    }
  }, [language, isRecording])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return
    
    try {
      finalTranscriptRef.current = ''
      interimTranscriptRef.current = ''
      recognitionRef.current.lang = language
      recognitionRef.current.start()
    } catch (e) {
      console.error('Failed to start recording:', e)
      setErrorMessage('无法开始录音，请检查麦克风权限')
      setStatus('error')
    }
  }, [language])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return
    
    try {
      recognitionRef.current.stop()
      setIsRecording(false)
      setStatus('ready')
    } catch (e) {
      // 忽略
      setIsRecording(false)
      setStatus('ready')
    }
  }, [])

  const clearTranscripts = useCallback(() => {
    setTranscripts([])
    finalTranscriptRef.current = ''
    interimTranscriptRef.current = ''
    setWordCount(0)
  }, [])

  const copyToClipboard = useCallback(() => {
    const fullText = transcripts.map(t => t.text).join(' ')
    navigator.clipboard.writeText(fullText).then(() => {
      // 可以添加成功提示
    }).catch(() => {
      // 可以添加错误提示
    })
  }, [transcripts])

  const downloadTranscript = useCallback(() => {
    const fullText = transcripts.map(t => `${t.timestamp.toLocaleTimeString()}: ${t.text}`).join('\n')
    const blob = new Blob([fullText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [transcripts])

  const languages = [
    { code: 'zh-CN', name: '中文 (简体)' },
    { code: 'zh-TW', name: '中文 (繁体)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'es-ES', name: 'Español' },
    { code: 'it-IT', name: 'Italiano' },
  ]

  return (
    <div className="app-container" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: 16, 
      height: '100%', 
      overflow: 'auto',
      color: '#fff'
    }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>🎤 语音转录</h2>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>实时将语音转换为文字</p>
      </div>

      {!recognitionSupported || status === 'error' ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 40, 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: 12 
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h3 style={{ margin: '0 0 8px 0' }}>{!recognitionSupported ? '浏览器不支持' : '出现错误'}</h3>
          <p style={{ opacity: 0.8 }}>{!recognitionSupported ? '请使用 Chrome 或 Edge 浏览器以使用语音识别功能' : errorMessage}</p>
          {status === 'error' && (
            <button
              onClick={() => setStatus('ready')}
              style={{
                marginTop: 16,
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              重试
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 控制面板 */}
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: 16, 
            padding: 16, 
            marginBottom: 16,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  padding: '12px 32px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: 30,
                  cursor: 'pointer',
                  background: isRecording ? '#e74c3c' : '#2ecc71',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: isRecording ? '0 0 20px rgba(231, 76, 60, 0.5)' : '0 0 20px rgba(46, 204, 113, 0.3)',
                }}
              >
                {isRecording ? '⏹ 停止' : '🎤 开始录音'}
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isRecording}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} style={{ color: '#000' }}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={copyToClipboard}
                disabled={transcripts.length === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  cursor: transcripts.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: transcripts.length === 0 ? 0.5 : 1,
                }}
              >
                📋 复制全文
              </button>

              <button
                onClick={downloadTranscript}
                disabled={transcripts.length === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  cursor: transcripts.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: transcripts.length === 0 ? 0.5 : 1,
                }}
              >
                💾 下载文本
              </button>

              <button
                onClick={clearTranscripts}
                disabled={transcripts.length === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(231, 76, 60, 0.3)',
                  color: '#fff',
                  cursor: transcripts.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: transcripts.length === 0 ? 0.5 : 1,
                }}
              >
                🗑 清空
              </button>
            </div>

            {/* 状态指示器 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              {status === 'recording' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#e74c3c',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  <span>正在录音中...</span>
                </div>
              )}
              <div style={{ marginLeft: 'auto', opacity: 0.8, fontSize: 14 }}>
                字数: {wordCount}
              </div>
            </div>
          </div>

          {/* 转录文本区域 */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: 16, 
            padding: 16,
            backdropFilter: 'blur(10px)',
            minHeight: 300,
            maxHeight: 400,
            overflow: 'auto',
          }}>
            {transcripts.length === 0 && !interimTranscriptRef.current ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 40, 
                opacity: 0.6,
                fontSize: 16,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎤</div>
                点击"开始录音"开始语音识别
              </div>
            ) : (
              <div style={{ lineHeight: 1.8 }}>
                {transcripts.map((segment) => (
                  <div key={segment.id} style={{ 
                    marginBottom: 8, 
                    padding: 8,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                      {segment.timestamp.toLocaleTimeString()}
                    </div>
                    <div style={{ fontSize: 16 }}>{segment.text}</div>
                  </div>
                ))}
                {interimTranscriptRef.current && (
                  <div style={{ 
                    marginBottom: 8, 
                    padding: 8,
                    borderRadius: 8,
                    background: 'rgba(46, 204, 113, 0.2)',
                    fontStyle: 'italic',
                    opacity: 0.8,
                  }}>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                      正在识别...
                    </div>
                    <div style={{ fontSize: 16 }}>{interimTranscriptRef.current}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 使用说明 */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: 12, 
            padding: 16, 
            marginTop: 16,
            fontSize: 13,
            opacity: 0.9,
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>📝 使用提示</h4>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>首次使用时，请允许浏览器访问您的麦克风</li>
              <li>选择正确的语言可以提高识别准确率</li>
              <li>录音过程中可以随时停止和继续</li>
              <li>识别结果会自动分段保存</li>
              <li>支持下载和复制转录文本</li>
            </ul>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
