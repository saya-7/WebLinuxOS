import { useState, useRef, useEffect, useCallback, memo } from 'react'

const MusicVisualizer = memo(function MusicVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [visualizerType, setVisualizerType] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const bufferLengthRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const tracks = [
    { name: 'Ambient Waves', type: 'sine', frequency: 220, color: '#8b7cf0' },
    { name: 'Digital Pulse', type: 'square', frequency: 330, color: '#00ff88' },
    { name: 'Cosmic Drift', type: 'triangle', frequency: 277, color: '#ff6b6b' },
    { name: 'Neon Dreams', type: 'sawtooth', frequency: 440, color: '#ffd93d' },
  ]

  const visualizers = ['波形图', '频谱图', '环形图', '粒子效果']

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      bufferLengthRef.current = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLengthRef.current)
    }
  }, [])

  const startVisualization = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      
      const buffer = new Uint8Array(bufferLengthRef.current)
      analyserRef.current!.getByteFrequencyData(buffer)
      
      const width = canvas.width
      const height = canvas.height
      
      ctx.fillStyle = 'rgba(26, 26, 46, 0.3)'
      ctx.fillRect(0, 0, width, height)

      switch (visualizerType) {
        case 0: // 波形图
          drawWaveform(ctx, width, height)
          break
        case 1: // 频谱图
          drawSpectrum(ctx, width, height)
          break
        case 2: // 环形图
          drawCircle(ctx, width, height)
          break
        case 3: // 粒子效果
          drawParticles(ctx, width, height)
          break
      }
    }
    draw()
  }, [visualizerType])

  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!analyserRef.current) return
    const buffer = new Uint8Array(bufferLengthRef.current)
    analyserRef.current.getByteTimeDomainData(buffer)
    
    ctx.lineWidth = 3
    ctx.strokeStyle = tracks[currentTrack].color
    ctx.beginPath()
    
    const sliceWidth = width / bufferLengthRef.current
    let x = 0
    
    for (let i = 0; i < bufferLengthRef.current; i++) {
      const v = buffer[i] / 128.0
      const y = (v * height) / 2
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }

  const drawSpectrum = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!analyserRef.current) return
    const buffer = new Uint8Array(bufferLengthRef.current)
    analyserRef.current.getByteFrequencyData(buffer)
    const barWidth = (width / bufferLengthRef.current) * 2.5
    let x = 0
    
    for (let i = 0; i < bufferLengthRef.current; i++) {
      const barHeight = (buffer[i] / 255) * height
      
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
      gradient.addColorStop(0, tracks[currentTrack].color)
      gradient.addColorStop(1, '#ffffff')
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)
      
      x += barWidth
    }
  }

  const drawCircle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!analyserRef.current) return
    const buffer = new Uint8Array(bufferLengthRef.current)
    analyserRef.current.getByteFrequencyData(buffer)
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 4
    
    ctx.beginPath()
    for (let i = 0; i < bufferLengthRef.current; i++) {
      const angle = (i / bufferLengthRef.current) * Math.PI * 2
      const barHeight = (buffer[i] / 255) * radius
      const x = centerX + Math.cos(angle) * (radius + barHeight)
      const y = centerY + Math.sin(angle) * (radius + barHeight)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    
    ctx.strokeStyle = tracks[currentTrack].color
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.fillStyle = tracks[currentTrack].color + '20'
    ctx.fill()
  }

  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!analyserRef.current) return
    const buffer = new Uint8Array(bufferLengthRef.current)
    analyserRef.current.getByteFrequencyData(buffer)
    const centerX = width / 2
    const centerY = height / 2
    
    for (let i = 0; i < bufferLengthRef.current; i += 2) {
      const value = buffer[i] / 255
      const angle = (i / bufferLengthRef.current) * Math.PI * 2
      const distance = 50 + value * 200
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      const size = 2 + value * 8
      
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = tracks[currentTrack].color + Math.floor(value * 255).toString(16).padStart(2, '0')
      ctx.fill()
    }
  }

  const togglePlay = useCallback(() => {
    initAudio()
    
    if (!audioContextRef.current || !analyserRef.current) return

    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setIsPlaying(false)
    } else {
      const osc = audioContextRef.current.createOscillator()
      const gain = audioContextRef.current.createGain()
      
      osc.type = tracks[currentTrack].type as OscillatorType
      osc.frequency.value = tracks[currentTrack].frequency
      
      gain.gain.value = volume
      
      osc.connect(gain)
      gain.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)
      
      osc.start()
      oscillatorRef.current = osc
      gainNodeRef.current = gain
      
      setIsPlaying(true)
      startVisualization()
    }
  }, [isPlaying, currentTrack, volume, initAudio, startVisualization])

  const changeTrack = useCallback((index: number) => {
    setCurrentTrack(index)
    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.type = tracks[index].type as OscillatorType
      oscillatorRef.current.frequency.value = tracks[index].frequency
    }
  }, [isPlaying])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const resize = () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
      }
      resize()
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #161630 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 600 }}>
            🎵 音乐可视化
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            {tracks[currentTrack].name}
          </p>
        </div>
      </div>

      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12
          }}
        />
      </div>

      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16
        }}>
          {tracks.map((track, index) => (
            <button
              key={index}
              onClick={() => changeTrack(index)}
              style={{
                padding: '10px 16px',
                background: currentTrack === index ? track.color : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 10,
                color: currentTrack === index ? '#fff' : 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {track.name}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16
        }}>
          {visualizers.map((viz, index) => (
            <button
              key={index}
              onClick={() => setVisualizerType(index)}
              style={{
                padding: '8px 14px',
                background: visualizerType === index ? 'rgba(139, 124, 240, 0.3)' : 'rgba(255,255,255,0.05)',
                border: visualizerType === index ? '1px solid rgba(139, 124, 240, 0.5)' : 'none',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {viz}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: 120,
                accentColor: tracks[currentTrack].color
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, width: 40 }}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button
            onClick={togglePlay}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${tracks[currentTrack].color} 0%, #6d5df0 100%)`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: `0 4px 20px ${tracks[currentTrack].color}40`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
    </div>
  )
})

export default MusicVisualizer
