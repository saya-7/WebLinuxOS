import { useState, useCallback, useMemo } from 'react'
import { useStore } from '../store'

interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  tags: string[]
  folder: string
  favicon?: string
  createdAt: number
  visitedAt?: number
}

const defaultFolders = ['收藏夹', '开发工具', '学习资源', '娱乐', '其他']

const BookmarkManager = function () {
  const addNotification = useStore((s) => s.addNotification)

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('weblinux-bookmarks')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return [
          { id: '1', title: 'GitHub', url: 'https://github.com', description: '全球最大的代码托管平台', tags: ['开发', '代码'], folder: '开发工具', createdAt: Date.now() },
          { id: '2', title: 'React 官方文档', url: 'https://react.dev', description: 'React 官方文档', tags: ['开发', '文档'], folder: '学习资源', createdAt: Date.now() },
          { id: '3', title: 'WebLinuxOS', url: 'https://github.com/saya-ch/WebLinuxOS', description: 'Web 端 Linux 桌面环境', tags: ['项目', '开源'], folder: '收藏夹', createdAt: Date.now() },
        ]
      }
    }
    return []
  })

  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', description: '', tags: '', folder: defaultFolders[0] })

  const saveBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks)
    localStorage.setItem('weblinux-bookmarks', JSON.stringify(newBookmarks))
  }, [])

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesFolder = selectedFolder === 'all' || b.folder === selectedFolder
      const matchesSearch = searchQuery === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFolder && matchesSearch
    })
  }, [bookmarks, selectedFolder, searchQuery])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    bookmarks.forEach(b => b.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet)
  }, [bookmarks])

  const handleAddBookmark = useCallback(() => {
    if (!newBookmark.title || !newBookmark.url) {
      addNotification({ title: '错误', message: '请填写标题和网址', type: 'error' })
      return
    }

    const bookmark: Bookmark = {
      id: editingBookmark ? editingBookmark.id : Date.now().toString(),
      title: newBookmark.title,
      url: newBookmark.url,
      description: newBookmark.description,
      tags: newBookmark.tags.split(',').map(t => t.trim()).filter(Boolean),
      folder: newBookmark.folder,
      createdAt: editingBookmark ? editingBookmark.createdAt : Date.now(),
      visitedAt: editingBookmark ? editingBookmark.visitedAt : undefined,
    }

    let newBookmarks: Bookmark[]
    if (editingBookmark) {
      newBookmarks = bookmarks.map(b => b.id === editingBookmark.id ? bookmark : b)
      addNotification({ title: '成功', message: '书签已更新', type: 'success' })
    } else {
      newBookmarks = [bookmark, ...bookmarks]
      addNotification({ title: '成功', message: '书签已添加', type: 'success' })
    }

    saveBookmarks(newBookmarks)
    setShowAddModal(false)
    setEditingBookmark(null)
    setNewBookmark({ title: '', url: '', description: '', tags: '', folder: defaultFolders[0] })
  }, [newBookmark, editingBookmark, bookmarks, saveBookmarks, addNotification])

  const handleDeleteBookmark = useCallback((id: string) => {
    if (confirm('确定要删除这个书签吗？')) {
      saveBookmarks(bookmarks.filter(b => b.id !== id))
      addNotification({ title: '成功', message: '书签已删除', type: 'info' })
    }
  }, [bookmarks, saveBookmarks, addNotification])

  const handleVisitBookmark = useCallback((bookmark: Bookmark) => {
    window.open(bookmark.url, '_blank')
    saveBookmarks(bookmarks.map(b =>
      b.id === bookmark.id ? { ...b, visitedAt: Date.now() } : b
    ))
  }, [bookmarks, saveBookmarks])

  const handleEditBookmark = useCallback((bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setNewBookmark({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || '',
      tags: bookmark.tags.join(', '),
      folder: bookmark.folder,
    })
    setShowAddModal(true)
  }, [])

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--window-bg)', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--window-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
          📚 网络书签管理
        </h2>
        <button
          onClick={() => { setEditingBookmark(null); setNewBookmark({ title: '', url: '', description: '', tags: '', folder: defaultFolders[0] }); setShowAddModal(true) }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + 添加书签
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '220px', borderRight: '1px solid var(--window-border)', padding: '12px', overflow: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>文件夹</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
            {[
              { id: 'all', name: '全部书签', icon: '📋' },
              ...defaultFolders.map(f => ({ id: f, name: f, icon: '📁' }))
            ].map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedFolder === folder.id ? 'var(--accent-bg)' : 'transparent',
                  color: selectedFolder === folder.id ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {folder.icon} {folder.name}
                {folder.id === 'all' && <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '12px' }}>{bookmarks.length}</span>}
              </button>
            ))}
          </div>

          {allTags.length > 0 && (
            <>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>标签</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {allTags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: 'var(--titlebar-bg)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: searchQuery === tag ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--window-border)' }}>
            <input
              type="text"
              placeholder="搜索书签（标题、网址、标签、描述）..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--window-border)',
                background: 'var(--titlebar-bg)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
            {filteredBookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
                <div>没有找到书签</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {filteredBookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid var(--window-border)',
                      background: 'var(--titlebar-bg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                  >
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <img
                        src={getFaviconUrl(bookmark.url)}
                        alt=""
                        style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {bookmark.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {bookmark.url}
                        </div>
                      </div>
                    </div>
                    {bookmark.description && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {bookmark.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                        {bookmark.folder}
                      </span>
                      {bookmark.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: 'var(--window-border)', color: 'var(--text-secondary)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVisitBookmark(bookmark) }}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--accent)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        打开
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditBookmark(bookmark) }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--window-border)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBookmark(bookmark.id) }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--error)',
                          background: 'transparent',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: '480px',
              maxWidth: '90%',
              background: 'var(--window-bg)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {editingBookmark ? '编辑书签' : '添加书签'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="标题"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--window-border)',
                  background: 'var(--titlebar-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <input
                type="url"
                placeholder="网址 (https://...)"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--window-border)',
                  background: 'var(--titlebar-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <textarea
                placeholder="描述（可选）"
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--window-border)',
                  background: 'var(--titlebar-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  minHeight: '80px',
                  resize: 'vertical',
                }}
              />
              <input
                type="text"
                placeholder="标签（用逗号分隔）"
                value={newBookmark.tags}
                onChange={(e) => setNewBookmark({ ...newBookmark, tags: e.target.value })}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--window-border)',
                  background: 'var(--titlebar-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <select
                value={newBookmark.folder}
                onChange={(e) => setNewBookmark({ ...newBookmark, folder: e.target.value })}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--window-border)',
                  background: 'var(--titlebar-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              >
                {defaultFolders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--window-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleAddBookmark}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {editingBookmark ? '更新' : '添加'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookmarkManager
