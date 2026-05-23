import { useState, useCallback, useRef, useEffect } from 'react'

interface Note {
  id: string
  x: number
  y: number
  content: string
  color: string
}

const colors = [
  '#FFD700', // 金色
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#96CEB4', // 绿色
  '#FFEAA7', // 浅黄色
  '#DDA0DD', // 紫色
  '#98D8C8', // 薄荷绿
]

export default function StickyNotesWall() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', x: 50, y: 30, content: '欢迎使用便签墙！\n拖动便签到任何位置\n右键点击改变颜色', color: colors[0] },
    { id: '2', x: 200, y: 80, content: '双击编辑内容', color: colors[1] },
  ])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const handleAddNote = useCallback(() => {
    const id = Date.now().toString()
    const newNote: Note = {
      id,
      x: 100 + notes.length * 20,
      y: 100 + notes.length * 20,
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
    }
    setNotes(prev => [...prev, newNote])
    setSelectedNoteId(id)
  }, [notes.length])

  const handleDeleteNote = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotes(prev => prev.filter(note => note.id !== id))
    if (selectedNoteId === id) {
      setSelectedNoteId(null)
    }
  }, [selectedNoteId])

  const handleChangeColor = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const currentIndex = colors.indexOf(note.color)
        const nextIndex = (currentIndex + 1) % colors.length
        return { ...note, color: colors[nextIndex] }
      }
      return note
    }))
  }, [])

  const handleUpdateContent = useCallback((id: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content } : note
    ))
  }, [])

  const handleMouseDown = useCallback((id: string, e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
    const noteEl = e.currentTarget
    const rect = noteEl.getBoundingClientRect()
    dragRef.current = {
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    setSelectedNoteId(id)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const { id, offsetX, offsetY } = dragRef.current
      setNotes(prev => prev.map(note => {
        if (note.id === id) {
          return {
            ...note,
            x: e.clientX - offsetX,
            y: e.clientY - offsetY,
          }
        }
        return note
      }))
    }

    const handleMouseUp = () => {
      dragRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleClearAll = useCallback(() => {
    if (confirm('确定要删除所有便签吗？')) {
      setNotes([])
      setSelectedNoteId(null)
    }
  }, [])

  return (
    <div className="app-container" style={{ 
      height: '100%', 
      width: '100%', 
      background: '#2c3e50',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 工具栏 */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        display: 'flex',
        gap: 10,
        padding: '10px 15px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        zIndex: 100
      }}>
        <button onClick={handleAddNote} style={{
          padding: '8px 16px',
          background: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + 添加便签
        </button>
        <button onClick={handleClearAll} style={{
          padding: '8px 16px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}>
          清空所有
        </button>
        <div style={{ flex: 1 }}></div>
        <div style={{ color: '#aaa', fontSize: 13, alignSelf: 'center' }}>
          {notes.length} 个便签
        </div>
      </div>

      {/* 便签墙 */}
      <div style={{
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        {notes.map(note => (
          <div
            key={note.id}
            onMouseDown={(e) => handleMouseDown(note.id, e)}
            style={{
              position: 'absolute',
              left: note.x,
              top: note.y,
              width: 180,
              minHeight: 160,
              background: note.color,
              padding: 15,
              borderRadius: 4,
              boxShadow: selectedNoteId === note.id
                ? '0 8px 30px rgba(0,0,0,0.5)'
                : '0 4px 15px rgba(0,0,0,0.3)',
              cursor: 'move',
              zIndex: selectedNoteId === note.id ? 10 : 1,
              transform: selectedNoteId === note.id ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {/* 便签顶部装饰 */}
            <div style={{
              height: 8,
              background: 'rgba(0,0,0,0.1)',
              margin: '-15px -15px 10px -15px',
              borderRadius: '4px 4px 0 0',
            }}></div>

            {/* 控制按钮 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 6,
              marginBottom: 8,
            }}>
              <button
                onClick={(e) => handleChangeColor(note.id, e)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.2)',
                  background: colors[(colors.indexOf(note.color) + 1) % colors.length],
                  cursor: 'pointer',
                  fontSize: 10,
                }}
                title="改变颜色"
              >
                🎨
              </button>
              <button
                onClick={(e) => handleDeleteNote(note.id, e)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.2)',
                  background: 'rgba(255,0,0,0.3)',
                  cursor: 'pointer',
                  fontSize: 10,
                }}
                title="删除便签"
              >
                ✕
              </button>
            </div>

            {/* 内容输入 */}
            <textarea
              value={note.content}
              onChange={(e) => handleUpdateContent(note.id, e.target.value)}
              style={{
                width: '100%',
                height: 100,
                border: 'none',
                background: 'transparent',
                resize: 'none',
                outline: 'none',
                fontFamily: 'cursive, sans-serif',
                fontSize: 14,
                lineHeight: 1.5,
                color: '#333',
              }}
              placeholder="写下你的想法..."
            />

            {/* 便签底部装饰 */}
            <div style={{
              position: 'absolute',
              bottom: -5,
              right: 15,
              width: 40,
              height: 20,
              background: 'rgba(0,0,0,0.05)',
              transform: 'rotate(2deg)',
            }}></div>
          </div>
        ))}

        {/* 空状态提示 */}
        {notes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#aaa',
          }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📝</div>
            <div>点击上方按钮添加你的第一个便签！</div>
          </div>
        )}
      </div>
    </div>
  )
}
