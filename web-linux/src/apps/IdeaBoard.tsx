import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit3, X, Pin, PinOff, Sparkles, Clock, Tag, Search } from 'lucide-react'

interface Idea {
  id: string
  title: string
  content: string
  tags: string[]
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  pinned: boolean
  color: string
}

const COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#fa709a',
  '#fee140', '#30cfd0', '#a8edea', '#fed6e3'
]

const IdeaBoard: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newIdea, setNewIdea] = useState({
    title: '',
    content: '',
    tags: '',
    priority: 'medium' as const,
    color: COLORS[0]
  })
  const [tagInput, setTagInput] = useState('')
  const ideasEndRef = useRef<HTMLDivElement>(null)

  // 从localStorage加载数据
  useEffect(() => {
    const savedIdeas = localStorage.getItem('weblinux-ideaboard-ideas')
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas))
    }
  }, [])

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem('weblinux-ideaboard-ideas', JSON.stringify(ideas))
  }, [ideas])

  const addIdea = () => {
    if (!newIdea.title.trim()) return

    const tags = newIdea.tags.split(',').map(t => t.trim()).filter(Boolean)
    const idea: Idea = {
      id: `idea-${Date.now()}`,
      ...newIdea,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false
    }

    setIdeas([idea, ...ideas])
    setNewIdea({
      title: '',
      content: '',
      tags: '',
      priority: 'medium',
      color: COLORS[0]
    })
  }

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(ideas.map(idea =>
      idea.id === id
        ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
        : idea
    ))
  }

  const deleteIdea = (id: string) => {
    if (confirm('确定要删除这个想法吗？')) {
      setIdeas(ideas.filter(idea => idea.id !== id))
    }
  }

  const togglePin = (id: string) => {
    const idea = ideas.find(i => i.id === id)
    if (idea) {
      updateIdea(id, { pinned: !idea.pinned })
    }
  }

  const addTagToIdea = (id: string, tag: string) => {
    const idea = ideas.find(i => i.id === id)
    if (idea && tag.trim()) {
      const newTags = [...new Set([...idea.tags, tag.trim()])]
      updateIdea(id, { tags: newTags })
    }
  }

  const removeTagFromIdea = (id: string, tagToRemove: string) => {
    const idea = ideas.find(i => i.id === id)
    if (idea) {
      const newTags = idea.tags.filter(tag => tag !== tagToRemove)
      updateIdea(id, { tags: newTags })
    }
  }

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-purple-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">灵感板</h2>
          </div>
          <span className="text-sm text-gray-400">
            {ideas.length} 个想法
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索想法..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Add Idea Form */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <input
            type="text"
            placeholder="想法标题..."
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
            className="w-full mb-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === 'Enter' && addIdea()}
          />
          <textarea
            placeholder="描述你的想法..."
            value={newIdea.content}
            onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
            className="w-full mb-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={2}
          />
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="标签（用逗号分隔）..."
              value={newIdea.tags}
              onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newIdea.priority}
              onChange={(e) => setNewIdea({ ...newIdea, priority: e.target.value as any })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewIdea({ ...newIdea, color })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${newIdea.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={addIdea}
              disabled={!newIdea.title.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              style={{ borderLeft: `4px solid ${idea.color}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {editingId === idea.id ? (
                    <input
                      type="text"
                      value={idea.title}
                      onChange={(e) => updateIdea(idea.id, { title: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {idea.pinned && <Pin className="w-4 h-4 text-yellow-400" />}
                      {idea.title}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => togglePin(idea.id)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                    title={idea.pinned ? '取消固定' : '固定'}
                  >
                    {idea.pinned ? <PinOff className="w-4 h-4 text-gray-400" /> : <Pin className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => setEditingId(editingId === idea.id ? null : idea.id)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                    title="编辑"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="p-1 hover:bg-red-900/50 rounded transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>

              {editingId === idea.id ? (
                <textarea
                  value={idea.content}
                  onChange={(e) => updateIdea(idea.id, { content: e.target.value })}
                  className="w-full mb-3 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap line-clamp-4">
                  {idea.content || <span className="text-gray-500 italic">暂无描述</span>}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      onClick={() => removeTagFromIdea(idea.id, tag)}
                      className="hover:text-purple-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {editingId === idea.id && (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="添加标签..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTagToIdea(idea.id, tagInput)
                          setTagInput('')
                        }
                      }}
                      className="w-20 px-1 py-0.5 bg-slate-700 border border-slate-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Priority & Date */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: getPriorityColor(idea.priority) }}
                  />
                  <span>{idea.priority === 'high' ? '高' : idea.priority === 'medium' ? '中' : '低'}优先级</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(idea.updatedAt)}</span>
                </div>
              </div>

              {editingId === idea.id && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    完成
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedIdeas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">还没有想法</p>
            <p className="text-sm">添加你的第一个灵感吧！</p>
          </div>
        )}
        <div ref={ideasEndRef} />
      </div>
    </div>
  )
}

export default IdeaBoard
