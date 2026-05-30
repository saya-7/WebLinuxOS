import { useState, useRef, useEffect } from 'react'
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Minus as LineIcon,
  Type, 
  Undo2, 
  Redo2, 
  Trash2, 
  Download,
  Palette
} from 'lucide-react'

interface Point {
  x: number
  y: number
  pressure?: number
}

interface Stroke {
  id: string
  type: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text'
  points: Point[]
  color: string
  width: number
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  text?: string
  textX?: number
  textY?: number
}

const COLORS = [
  '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
  '#ffffff', '#64748b', '#1e293b'
]

const BRUSH_SIZES = [2, 4, 6, 10, 16, 24]

export default function WhiteboardPro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text'>('pen')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [historyStack, setHistoryStack] = useState<Stroke[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const { x, y } = getCanvasCoordinates(e)

    setIsDrawing(true)
    setStartPoint({ x, y })

    const newStroke: Stroke = {
      id: Date.now().toString(),
      type: currentTool,
      points: [{ x, y }],
      color: currentTool === 'eraser' ? '#ffffff' : currentColor,
      width: currentTool === 'eraser' ? brushSize * 3 : brushSize
    }

    setCurrentStroke(newStroke)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return
    e.preventDefault()

    const { x, y } = getCanvasCoordinates(e)

    if (['line', 'rectangle', 'circle'].includes(currentTool)) {
      const updatedStroke = {
        ...currentStroke,
        startX: startPoint?.x,
        startY: startPoint?.y,
        endX: x,
        endY: y
      }
      setCurrentStroke(updatedStroke)
      redrawCanvas()
      drawShape(updatedStroke)
    } else {
      const updatedStroke = {
        ...currentStroke,
        points: [...currentStroke.points, { x, y }]
      }
      setCurrentStroke(updatedStroke)
      drawStroke(updatedStroke)
    }
  }

  const stopDrawing = () => {
    if (!currentStroke) return
    
    setIsDrawing(false)
    
    if (currentTool !== 'text') {
      saveToHistory([...strokes, currentStroke])
      setStrokes([...strokes, currentStroke])
    }
    
    setCurrentStroke(null)
    setStartPoint(null)
  }

  const drawStroke = (stroke: Stroke) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    if (stroke.points.length > 0) {
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
    }
    ctx.stroke()
  }

  const drawShape = (stroke: Stroke) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (stroke.type === 'line' && stroke.startX !== undefined && stroke.startY !== undefined) {
      ctx.moveTo(stroke.startX, stroke.startY)
      ctx.lineTo(stroke.endX ?? stroke.startX, stroke.endY ?? stroke.startY)
    } else if (stroke.type === 'rectangle' && stroke.startX !== undefined && stroke.startY !== undefined) {
      const width = (stroke.endX ?? stroke.startX) - stroke.startX
      const height = (stroke.endY ?? stroke.startY) - stroke.startY
      ctx.strokeRect(stroke.startX, stroke.startY, width, height)
    } else if (stroke.type === 'circle' && stroke.startX !== undefined && stroke.startY !== undefined) {
      const radius = Math.sqrt(
        Math.pow((stroke.endX ?? stroke.startX) - stroke.startX, 2) + 
        Math.pow((stroke.endY ?? stroke.startY) - stroke.startY, 2)
      )
      ctx.arc(stroke.startX, stroke.startY, radius, 0, Math.PI * 2)
    }
    ctx.stroke()
  }

  const drawText = (stroke: Stroke) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (stroke.text && stroke.textX !== undefined && stroke.textY !== undefined) {
      ctx.font = `${stroke.width * 4}px sans-serif`
      ctx.fillStyle = stroke.color
      ctx.fillText(stroke.text, stroke.textX, stroke.textY)
    }
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    strokes.forEach(stroke => {
      if (stroke.type === 'text') {
        drawText(stroke)
      } else if (['line', 'rectangle', 'circle'].includes(stroke.type)) {
        drawShape(stroke)
      } else {
        drawStroke(stroke)
      }
    })
  }

  const saveToHistory = (newStrokes: Stroke[]) => {
    const newHistory = historyStack.slice(0, historyIndex + 1)
    newHistory.push([...newStrokes])
    setHistoryStack(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setStrokes(historyStack[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setStrokes(historyStack[newIndex])
    }
  }

  const clearCanvas = () => {
    if (confirm('确定要清空画布吗？')) {
      saveToHistory([])
      setStrokes([])
      redrawCanvas()
    }
  }

  const saveAsImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight - 120
      }
      redrawCanvas()
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    saveToHistory([])
    
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    redrawCanvas()
  }, [strokes])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#f5f5f5' 
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '4px', 
          background: '#f3f4f6', 
          borderRadius: '8px' 
        }}>
          <ToolButton 
            active={currentTool === 'pen'} 
            onClick={() => setCurrentTool('pen')} 
            icon={<Pen size={18} />} 
            label="画笔"
          />
          <ToolButton 
            active={currentTool === 'eraser'} 
            onClick={() => setCurrentTool('eraser')} 
            icon={<Eraser size={18} />} 
            label="橡皮擦"
          />
          <ToolButton 
            active={currentTool === 'line'} 
            onClick={() => setCurrentTool('line')} 
            icon={<LineIcon size={18} />} 
            label="直线"
          />
          <ToolButton 
            active={currentTool === 'rectangle'} 
            onClick={() => setCurrentTool('rectangle')} 
            icon={<Square size={18} />} 
            label="矩形"
          />
          <ToolButton 
            active={currentTool === 'circle'} 
            onClick={() => setCurrentTool('circle')} 
            icon={<Circle size={18} />} 
            label="圆形"
          />
          <ToolButton 
            active={currentTool === 'text'} 
            onClick={() => setCurrentTool('text')} 
            icon={<Type size={18} />} 
            label="文字"
          />
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e5e7eb', margin: '0 8px' }} />

        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '4px', 
          background: '#f3f4f6', 
          borderRadius: '8px' 
        }}>
          <ToolButton 
            onClick={undo} 
            icon={<Undo2 size={18} />} 
            label="撤销"
          />
          <ToolButton 
            onClick={redo} 
            icon={<Redo2 size={18} />} 
            label="重做"
          />
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e5e7eb', margin: '0 8px' }} />

        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '6px', 
          background: '#f3f4f6', 
          borderRadius: '8px',
          alignItems: 'center'
        }}>
          <Palette size={16} style={{ color: '#6b7280' }} />
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: color,
                border: currentColor === color ? '3px solid #3b82f6' : '2px solid #d1d5db',
                cursor: 'pointer',
                padding: 0
              }}
            />
          ))}
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e5e7eb', margin: '0 8px' }} />

        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '6px', 
          background: '#f3f4f6', 
          borderRadius: '8px',
          alignItems: 'center'
        }}>
          {BRUSH_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: brushSize === size ? '#3b82f6' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: brushSize === size ? '#ffffff' : '#374151'
              }} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '4px', 
          background: '#f3f4f6', 
          borderRadius: '8px' 
        }}>
          <ToolButton 
            onClick={saveAsImage} 
            icon={<Download size={18} />} 
            label="保存"
          />
          <ToolButton 
            onClick={clearCanvas} 
            icon={<Trash2 size={18} />} 
            label="清空"
          />
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              cursor: currentTool === 'pen' ? 'crosshair' : 
                      currentTool === 'eraser' ? 'cell' :
                      currentTool === 'text' ? 'text' : 'crosshair',
              touchAction: 'none'
            }}
          />
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 16px',
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        提示：使用鼠标或触屏进行绘制 | 支持撤销/重做操作 | 可保存为图片
      </div>
    </div>
  )
}

function ToolButton({ 
  icon, 
  label, 
  onClick, 
  active = false 
}: { 
  icon: React.ReactNode 
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '6px 10px',
        borderRadius: '6px',
        background: active ? '#3b82f6' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: active ? '#ffffff' : '#374151',
        transition: 'all 0.15s'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#e5e7eb'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {icon}
      <span style={{ fontSize: '10px' }}>{label}</span>
    </button>
  )
}
