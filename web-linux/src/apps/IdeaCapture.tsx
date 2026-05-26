import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { Plus, Trash2, Tag, Search, Star, Calendar, LayoutGrid, List as ListIcon } from 'lucide-react'

interface Idea {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
  starred: boolean
  color: string
}

const DEFAULT_COLORS = [
  '#ffecd2',
  '#e0f7fa',
  '#f3e5f5',
  '#e8f5e9',
  '#fff3e0',
  '#ffebee',
  '#e3f2fd',
  '#fce4ec'
]

const DEFAULT_TAGS = ['创意', '项目', '待办', '学习', '想法', '任务', '灵感', '计划']

export default function IdeaCapture() {
  const { theme } = useStore()
  const isDark = theme === 'dark'

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('weblinux-idea-capture')
    return saved ? JSON.parse(saved) : []
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)
  const [newIdea, setNewIdea] = useState({
    title: '', content: '', tags: [] as string[], color: DEFAULT_COLORS[0]
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    localStorage.setItem('weblinux-idea-capture', JSON.stringify(ideas))
  }, [ideas])

  const addIdea = () => {
    if (!newIdea.title.trim()) return
    
    const idea: Idea = {
      id: Date.now().toString(),
      title: newIdea.title,
      content: newIdea.content,
      tags: newIdea.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      starred: false,
      color: newIdea.color
    }
    setIdeas([idea, ...ideas])
    setNewIdea({ title: '', content: '', tags: [], color: DEFAULT_COLORS[0] })
    setShowAddModal(false)
  }

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const toggleStar = (id: string) => {
    setIdeas(ideas.map(i =>
      i.id === id ? { ...i, starred: !i.starred, updatedAt: Date.now() } : i
    ))
  }

  const updateIdea = (idea: Idea) => {
    setIdeas(ideas.map(i => i.id === idea.id ? { ...idea, updatedAt: Date.now() } : i))
    setEditingIdea(null)
  }

  const addTag = () => {
    if (tagInput.trim() && !newIdea.tags.includes(tagInput.trim())) {
      setNewIdea({ ...newIdea, tags: [...newIdea.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setNewIdea({ ...newIdea, tags: newIdea.tags.filter(t => t !== tag) })
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag])
  }

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchQuery || 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => idea.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })

  const allTags = Array.from(new Set(ideas.flatMap(i => i.tags)))

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const bg = isDark ? '#1a1a2e' : '#f5f5f5'
  const text = isDark ? '#e0e0e0' : '#333'
  const cardBg = isDark ? '#2d2d3e' : '#ffffff'
  const border = isDark ? '#3d3d5e' : '#e0e0e0'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: bg,
      color: text,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            💡 灵感速记
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={{
                padding: '8px',
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: text
              }}
              title={viewMode === 'grid' ? '列表视图' : '网格视图'}
            >
              {viewMode === 'grid' ? <ListIcon size={18} /> : <LayoutGrid size={18} />}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: '#0078d4',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={18} />
              新想法
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: isDark ? '#888' : '#666' }} />
            <input
              type="text"
              placeholder="搜索想法、内容或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                background: cardBg,
                color: text,
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                style={{
                  padding: '4px 10px',
                  border: selectedTags.includes(tag) ? '1px solid #0078d4' : `1px solid ${border}`,
                  borderRadius: '16px',
                  background: selectedTags.includes(tag) ? '#0078d4' : cardBg,
                  color: selectedTags.includes(tag) ? 'white' : text,
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Tag size={12} />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ideas Grid/List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {filteredIdeas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#888' : '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💭</div>
            <div>还没有想法，点击「新想法」开始记录吧！</div>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                style={{
                  background: idea.color,
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onClick={() => setEditingIdea(idea)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, flex: 1, color: '#333' }}>
                    {idea.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStar(idea.id) }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                    >
                      <Star size={16} fill={idea.starred ? '#ffc107' : 'none'} color={idea.starred ? '#ffc107' : '#666'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteIdea(idea.id) }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                    >
                      <Trash2 size={16} color="#e74c3c" />
                    </button>
                  </div>
                </div>
                {idea.content && (
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#555',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {idea.content}
                  </p>
                )}
                {idea.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {idea.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          background: 'rgba(0,0,0,0.1)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#444'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '8px'
                }}>
                  <Calendar size={12} />
                  <span>{formatDate(idea.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                style={{
                  background: idea.color,
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${border}`,
                  cursor: 'pointer'
                }}
                onClick={() => setEditingIdea(idea)}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
                        {idea.title}
                      </h3>
                      {idea.starred && <Star size={14} fill='#ffc107' color='#ffc107' />}
                    </div>
                    {idea.content && (
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555' }}>
                        {idea.content}
                      </p>
                    )}
                    {idea.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {idea.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              background: 'rgba(0,0,0,0.1)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: '#444'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStar(idea.id) }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                    >
                      <Star size={16} fill={idea.starred ? '#ffc107' : 'none'} color={idea.starred ? '#ffc107' : '#666'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteIdea(idea.id) }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                    >
                      <Trash2 size={16} color="#e74c3c" />
                    </button>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  color: '#666',
                  marginTop: '8px'
                }}>
                  <Calendar size={12} />
                  <span>{formatDate(idea.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingIdea) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => {
          setShowAddModal(false)
          setEditingIdea(null)
        }}>
          <div style={{
            background: cardBg,
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px' }}>
              {editingIdea ? '编辑想法' : '新想法'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="标题..."
                value={editingIdea ? editingIdea.title : newIdea.title}
                onChange={(e) => {
                  if (editingIdea) {
                    setEditingIdea({ ...editingIdea, title: e.target.value })
                  } else {
                    setNewIdea({ ...newIdea, title: e.target.value })
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${border}`,
                  borderRadius: '8px',
                  background: isDark ? '#1a1a2e' : '#ffffff',
                  color: text,
                  fontSize: '14px',
                  outline: 'none'
                }}
                autoFocus
              />

              <textarea
                placeholder="内容（可选）..."
                value={editingIdea ? editingIdea.content : newIdea.content}
                onChange={(e) => {
                  if (editingIdea) {
                    setEditingIdea({ ...editingIdea, content: e.target.value })
                  } else {
                    setNewIdea({ ...newIdea, content: e.target.value })
                  }
                }}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: `1px solid ${border}`,
                  borderRadius: '8px',
                  background: isDark ? '#1a1a2e' : '#ffffff',
                  color: text,
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />

              <div>
                <div style={{ fontSize: '13px', marginBottom: '8px', color: isDark ? '#aaa' : '#666' }}>
                  颜色
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DEFAULT_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        if (editingIdea) {
                          setEditingIdea({ ...editingIdea, color })
                        } else {
                          setNewIdea({ ...newIdea, color })
                        }
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: color,
                        border: (editingIdea ? editingIdea.color : newIdea.color) === color
                          ? '2px solid #0078d4'
                          : '2px solid transparent',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', marginBottom: '8px', color: isDark ? '#aaa' : '#666' }}>
                  标签
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {(editingIdea ? editingIdea.tags : newIdea.tags).map(tag => (
                    <span
                      key={tag}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#0078d4',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => {
                          if (editingIdea) {
                            setEditingIdea({ ...editingIdea, tags: editingIdea.tags.filter(t => t !== tag) })
                          } else {
                            removeTag(tag)
                          }
                        }}
                        style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer', padding: 0, fontSize: '14px' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="添加标签..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (editingIdea) {
                          if (tagInput.trim() && !editingIdea.tags.includes(tagInput.trim())) {
                            setEditingIdea({ ...editingIdea, tags: [...editingIdea.tags, tagInput.trim()] })
                            setTagInput('')
                          }
                        } else {
                          addTag()
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${border}`,
                      borderRadius: '8px',
                      background: isDark ? '#1a1a2e' : '#ffffff',
                      color: text,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (editingIdea) {
                        if (tagInput.trim() && !editingIdea.tags.includes(tagInput.trim())) {
                          setEditingIdea({ ...editingIdea, tags: [...editingIdea.tags, tagInput.trim()] })
                          setTagInput('')
                        }
                      } else {
                        addTag()
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      background: '#0078d4',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    添加
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {DEFAULT_TAGS.filter(tag =>
                    !(editingIdea ? editingIdea.tags : newIdea.tags).includes(tag)).map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (editingIdea) {
                          setEditingIdea({ ...editingIdea, tags: [...editingIdea.tags, tag] })
                        } else {
                          setNewIdea({ ...newIdea, tags: [...newIdea.tags, tag] })
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        border: `1px solid ${border}`,
                        borderRadius: '12px',
                        background: 'transparent',
                        color: text,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingIdea(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    border: `1px solid ${border}`,
                    background: 'transparent',
                    color: text,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (editingIdea) {
                      updateIdea(editingIdea)
                    } else {
                      addIdea()
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: '#0078d4',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {editingIdea ? '保存' : '创建'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
