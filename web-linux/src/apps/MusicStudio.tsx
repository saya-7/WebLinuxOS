import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, Plus, Trash2, Volume2, VolumeX, Settings, Music, Activity } from 'lucide-react'

interface Track {
  id: string
  name: string
  color: string
  steps: boolean[]
  volume: number
  enabled: boolean
}

const MusicStudio: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([
    { id: 'kick', name: '底鼓', color: '#ef4444', steps: new Array(16).fill(false).map((_, i) => i % 4 === 0), volume: 0.8, enabled: true },
    { id: 'snare', name: '军鼓', color: '#f59e0b', steps: new Array(16).fill(false).map((_, i) => i % 8 === 4), volume: 0.7, enabled: true },
    { id: 'hihat', name: '踩镲', color: '#10b981', steps: new Array(16).fill(false).map((_, i) => i % 2 === 0), volume: 0.5, enabled: true },
    { id: 'clap', name: '拍手', color: '#3b82f6', steps: new Array(16).fill(false).map((_, i) => i % 8 === 0 || i % 8 === 6), volume: 0.6, enabled: true },
  ])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<number | null>(null)
  const stepTimeRef = useRef(0)

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
  const trackNames = ['底鼓', '军鼓', '踩镲', '拍手', '通鼓', '叮叮镲', '牛铃', '沙锤']

  const getFrequency = (trackId: string): number => {
    const freqs: Record<string, number> = {
      kick: 60, snare: 200, hihat: 800, clap: 1000, tom: 150, crash: 500, cowbell: 800, shaker: 1200
    }
    return freqs[trackId] || 440
  }

  const playSound = (track: Track, time: number) => {
    if (!audioContextRef.current || !track.enabled) return
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    const frequency = getFrequency(track.id)
    
    if (track.id === 'kick') {
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, time)
      oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.5)
      gainNode.gain.setValueAtTime(track.volume * masterVolume, time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5)
    } else if (track.id === 'snare') {
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(frequency, time)
      gainNode.gain.setValueAtTime(track.volume * masterVolume * 0.5, time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    } else if (track.id === 'hihat' || track.id === 'shaker') {
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(frequency, time)
      gainNode.gain.setValueAtTime(track.volume * masterVolume * 0.3, time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    } else {
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, time)
      gainNode.gain.setValueAtTime(track.volume * masterVolume, time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)
    }
    
    oscillator.start(time)
    oscillator.stop(time + 0.5)
  }

  const toggleStep = (trackId: string, stepIndex: number) => {
    setTracks(tracks.map(track => 
      track.id === trackId 
        ? { ...track, steps: track.steps.map((step, i) => i === stepIndex ? !step : step) }
        : track
    ))
  }

  const addTrack = () => {
    const newId = `track-${Date.now()}`
    const newColor = colors[tracks.length % colors.length]
    const newName = trackNames[tracks.length % trackNames.length]
    setTracks([...tracks, {
      id: newId,
      name: newName,
      color: newColor,
      steps: new Array(16).fill(false),
      volume: 0.6,
      enabled: true
    }])
  }

  const removeTrack = (trackId: string) => {
    if (tracks.length <= 1) return;
    setTracks(tracks.filter(track => track.id !== trackId));
  }

  const clearAll = () => {
    if (confirm('确定要清空所有轨道吗？')) {
      setTracks(tracks.map(track => ({ ...track, steps: new Array(16).fill(false) })));
    }
  }

  const togglePlay = () => {
    if (!isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      setIsPlaying(true);
      stepTimeRef.current = 0;
      
      const stepDuration = (60 / tempo) / 4;
      
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(stepTimeRef.current)
        
        const currentTime = audioContextRef.current!.currentTime
        
        tracks.forEach(track => {
          if (track.steps[stepTimeRef.current]) {
            playSound(track, currentTime)
          }
        })
        
        stepTimeRef.current = (stepTimeRef.current + 1) % 16
      }, stepDuration * 1000)
    } else {
      setIsPlaying(false)
      setCurrentStep(-1)
      if (intervalRef.current && clearInterval(intervalRef.current)) {
        intervalRef.current = null
      }
    }
  }

  const updateTrackVolume = (trackId: string, volume: number) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, volume } : track
    ))
  }

  const toggleTrackEnabled = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, enabled: !track.enabled } : track
    ))
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current)
      const stepDuration = (60 / tempo) / 4
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(stepTimeRef.current)
        
        const currentTime = audioContextRef.current!.currentTime
        
        tracks.forEach(track => {
          if (track.steps[stepTimeRef.current]) {
            playSound(track, currentTime)
          }
        })
        
        stepTimeRef.current = (stepTimeRef.current + 1) % 16
      }, stepDuration * 1000)
    }
  }, [tempo, tracks, isPlaying])

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="p-4 border-b border-indigo-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">音乐工作室</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={clearAll}
              className="p-2 hover:bg-red-900/50 rounded-lg transition-colors"
              title="清空"
            >
              <RotateCcw className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`p-3 rounded-xl rounded-lg font-semibold flex items-center gap-2 transition-all ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span className="text-white">{isPlaying ? '停止' : '播放'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-gray-300 text-sm w-16">速度:</span>
            <input
              type="range"
              min="60"
              max="240"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-white w-12 font-mono">{tempo} BPM</span>
          </div>

          <div className="flex items-center gap-2 w-48">
            <button
              onClick={() => setMasterVolume(masterVolume === 0 ? 0.7 : 0)}
              className="p-2 hover:bg-slate-700 rounded-lg"
            >
              {masterVolume === 0 ? <VolumeX className="w-5 h-5 text-gray-300" /> : <Volume2 className="w-5 h-5 text-gray-300" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {tracks.map((track) => (
          <div key={track.id} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => toggleTrackEnabled(track.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  track.enabled ? 'bg-green-600' : 'bg-slate-600'
                }`}
              >
                {track.enabled && <Activity className="w-4 h-4 text-white" />}
              </button>
              <div 
                className="w-24 font-medium text-white"
                style={{ color: track.color }}
              >
                {track.name}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => updateTrackVolume(track.id, Number(e.target.value))}
                  className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: track.color }}
                />
              </div>
              <button
                onClick={() => removeTrack(track.id)}
                className="p-1 hover:bg-red-900/50 rounded transition-colors"
                disabled={tracks.length <= 1}
              >
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-16 gap-1">
              {track.steps.map((active, stepIndex) => (
                <button
                  key={stepIndex}
                  onClick={() => toggleStep(track.id, stepIndex)}
                  className={`aspect-square rounded-lg transition-all ${
                    currentStep === stepIndex && isPlaying
                      ? 'ring-2 ring-white'
                      : ''
                  } ${
                    active
                      ? 'opacity-100'
                      : 'opacity-40 hover:opacity-60'
                  }`}
                  style={{
                    backgroundColor: active ? track.color : '#334155',
                    opacity: active ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        </div>

        <button
          onClick={addTrack}
          className="w-full mt-4 p-3 bg-slate-700/50 hover:bg-slate-700 border-2 border-dashed border-slate-600 rounded-xl text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>添加轨道</span>
        </button>
      </div>

      {showSettings && (
        <div className="p-4 border-t border-indigo-800 bg-slate-900/80">
          <h3 className="text-lg font-semibold text-white mb-3">快捷键</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <div>空格键 - 播放/停止</div>
            <div>1-9 - 切换步骤</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicStudio
