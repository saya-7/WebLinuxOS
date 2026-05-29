import { useState, useEffect } from 'react'

interface Flashcard {
  id: string
  front: string
  back: string
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed: number | null
  nextReview: number | null
  correctCount: number
  totalCount: number
}

interface Deck {
  id: string
  name: string
  flashcards: Flashcard[]
  createdAt: number
}

export default function Flashcards() {
  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const saved = localStorage.getItem('weblinux-flashcards')
      if (saved) {
        return JSON.parse(saved)
      }
      // 初始示例卡片组
      return [
        {
          id: 'default-1',
          name: '英语词汇',
          createdAt: Date.now(),
          flashcards: [
            { id: 'c1', front: 'Hello', back: '你好', tags: ['基础'], difficulty: 'easy', lastReviewed: null, nextReview: null, correctCount: 0, totalCount: 0 },
            { id: 'c2', front: 'Thank you', back: '谢谢', tags: ['基础'], difficulty: 'easy', lastReviewed: null, nextReview: null, correctCount: 0, totalCount: 0 },
            { id: 'c3', front: 'Good morning', back: '早上好', tags: ['基础'], difficulty: 'easy', lastReviewed: null, nextReview: null, correctCount: 0, totalCount: 0 },
            { id: 'c4', front: 'Computer', back: '计算机', tags: ['科技'], difficulty: 'medium', lastReviewed: null, nextReview: null, correctCount: 0, totalCount: 0 },
            { id: 'c5', front: 'Programming', back: '编程', tags: ['科技'], difficulty: 'medium', lastReviewed: null, nextReview: null, correctCount: 0, totalCount: 0 },
          ]
        }
      ]
    } catch {
      return []
    }
  })

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'study' | 'create'>('list')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 新增卡片表单
  const [newCardFront, setNewCardFront] = useState('')
  const [newCardBack, setNewCardBack] = useState('')
  const [newCardTags, setNewCardTags] = useState('')
  const [newCardDifficulty, setNewCardDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  // 新增卡片组表单
  const [newDeckName, setNewDeckName] = useState('')
  const [showCreateDeck, setShowCreateDeck] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('weblinux-flashcards', JSON.stringify(decks))
    } catch (error) {
      console.error('Failed to save flashcards:', error)
    }
  }, [decks])

  const selectedDeck = selectedDeckId ? decks.find(d => d.id === selectedDeckId) : null

  const createDeck = () => {
    if (newDeckName.trim()) {
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: newDeckName.trim(),
        createdAt: Date.now(),
        flashcards: []
      }
      setDecks(prev => [...prev, newDeck])
      setNewDeckName('')
      setShowCreateDeck(false)
    }
  }

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id))
    if (selectedDeckId === id) {
      setSelectedDeckId(null)
      setViewMode('list')
    }
  }

  const addCard = () => {
    if (!selectedDeckId || !newCardFront.trim() || !newCardBack.trim()) return
    
    const tags = newCardTags.split(',').map(t => t.trim()).filter(Boolean)
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newCardFront.trim(),
      back: newCardBack.trim(),
      tags,
      difficulty: newCardDifficulty,
      lastReviewed: null,
      nextReview: null,
      correctCount: 0,
      totalCount: 0
    }

    setDecks(prev => prev.map(d => 
      d.id === selectedDeckId 
        ? { ...d, flashcards: [...d.flashcards, newCard] }
        : d
    ))

    setNewCardFront('')
    setNewCardBack('')
    setNewCardTags('')
    setNewCardDifficulty('medium')
  }

  const deleteCard = (cardId: string) => {
    if (!selectedDeckId) return
    setDecks(prev => prev.map(d => 
      d.id === selectedDeckId 
        ? { ...d, flashcards: d.flashcards.filter(c => c.id !== cardId) }
        : d
    ))
  }

  const startStudy = () => {
    if (!selectedDeck || selectedDeck.flashcards.length === 0) return
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setViewMode('study')
  }

  const markAnswer = (correct: boolean) => {
    if (!selectedDeck) return
    
    // 更新卡片统计
    const updatedDecks = decks.map(d => {
      if (d.id !== selectedDeckId) return d
      const updatedCards = d.flashcards.map((c, idx) => {
        if (idx !== currentCardIndex) return c
        return {
          ...c,
          lastReviewed: Date.now(),
          totalCount: c.totalCount + 1,
          correctCount: correct ? c.correctCount + 1 : c.correctCount
        }
      })
      return { ...d, flashcards: updatedCards }
    })
    
    setDecks(updatedDecks)

    // 下一张卡片
    if (currentCardIndex < selectedDeck.flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setIsFlipped(false)
    } else {
      // 学习完成
      setViewMode('list')
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return '#22c55e'
      case 'medium': return '#f59e0b'
      case 'hard': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getDifficultyText = (diff: string) => {
    switch (diff) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      default: return '未知'
    }
  }

  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: '#1e1e2e', 
      color: '#cdd6f4',
      overflow: 'hidden'
    }}>
      {/* 顶部导航 */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #313244', 
        background: 'linear-gradient(135deg, #181825 0%, #1e1e2e 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>📚 单词记忆卡片</h2>
          {viewMode === 'list' && (
            <button 
              onClick={() => setShowCreateDeck(!showCreateDeck)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #89b4fa 0%, #60a5fa 100%)',
                border: 'none',
                borderRadius: 8,
                color: '#1e1e2e',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13
              }}
            >
              + 新建卡组
            </button>
          )}
        </div>
        
        {/* 搜索框 */}
        {viewMode === 'list' && (
          <input
            type="text"
            placeholder="搜索卡组..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #45475a',
              background: '#313244',
              color: '#cdd6f4',
              fontSize: 13
            }}
          />
        )}

        {/* 新建卡组表单 */}
        {showCreateDeck && (
          <div style={{ marginTop: 12, padding: 12, background: '#313244', borderRadius: 8 }}>
            <input
              type="text"
              placeholder="输入卡组名称..."
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createDeck()}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid #45475a',
                background: '#1e1e2e',
                color: '#cdd6f4',
                fontSize: 13,
                marginBottom: 8
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={createDeck}
                disabled={!newDeckName.trim()}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: newDeckName.trim() ? '#22c55e' : '#45475a',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  cursor: newDeckName.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                创建
              </button>
              <button
                onClick={() => setShowCreateDeck(false)}
                style={{
                  padding: '8px 16px',
                  background: '#45475a',
                  border: 'none',
                  borderRadius: 6,
                  color: '#cdd6f4',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {/* 列表视图 */}
        {viewMode === 'list' && !selectedDeckId && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {filteredDecks.map(deck => (
                <div 
                  key={deck.id}
                  onClick={() => { setSelectedDeckId(deck.id); setViewMode('list'); }}
                  style={{
                    padding: 16,
                    background: 'linear-gradient(135deg, #313244 0%, #45475a 100%)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: '#cdd6f4' }}>{deck.name}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: 16
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: '#a6adc8', marginBottom: 12 }}>
                    {deck.flashcards.length} 张卡片
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedDeckId(deck.id); setViewMode('create'); }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#45475a',
                        border: 'none',
                        borderRadius: 6,
                        color: '#cdd6f4',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedDeckId(deck.id); startStudy(); }}
                      disabled={deck.flashcards.length === 0}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: deck.flashcards.length > 0 ? 'linear-gradient(135deg, #89b4fa 0%, #60a5fa 100%)' : '#45475a',
                        border: 'none',
                        borderRadius: 6,
                        color: deck.flashcards.length > 0 ? '#1e1e2e' : '#6c7086',
                        cursor: deck.flashcards.length > 0 ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: 12
                      }}
                    >
                      开始学习
                    </button>
                  </div>
                </div>
              ))}
              {filteredDecks.length === 0 && (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#6c7086',
                  fontSize: 14
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                  <div>还没有卡组，点击"新建卡组"开始吧！</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 选中卡组的详情视图 */}
        {viewMode === 'list' && selectedDeck && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <button 
                onClick={() => setSelectedDeckId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#89b4fa',
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 12
                }}
              >
                ← 返回
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{selectedDeck.name}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setViewMode('create')}
                    style={{
                      padding: '8px 16px',
                      background: '#45475a',
                      border: 'none',
                      borderRadius: 8,
                      color: '#cdd6f4',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                  >
                    + 添加卡片
                  </button>
                  <button
                    onClick={startStudy}
                    disabled={selectedDeck.flashcards.length === 0}
                    style={{
                      padding: '8px 16px',
                      background: selectedDeck.flashcards.length > 0 ? 'linear-gradient(135deg, #89b4fa 0%, #60a5fa 100%)' : '#45475a',
                      border: 'none',
                      borderRadius: 8,
                      color: selectedDeck.flashcards.length > 0 ? '#1e1e2e' : '#6c7086',
                      cursor: selectedDeck.flashcards.length > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    开始学习
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedDeck.flashcards.map(card => (
                <div key={card.id} style={{
                  background: '#313244',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{card.front}</div>
                    <div style={{ fontSize: 13, color: '#a6adc8', marginBottom: 8 }}>{card.back}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        background: getDifficultyColor(card.difficulty) + '20', 
                        color: getDifficultyColor(card.difficulty),
                        borderRadius: 4, 
                        fontSize: 11 
                      }}>
                        {getDifficultyText(card.difficulty)}
                      </span>
                      {card.tags.map(tag => (
                        <span key={tag} style={{ 
                          padding: '2px 8px', 
                          background: '#45475a', 
                          borderRadius: 4, 
                          fontSize: 11,
                          color: '#a6adc8'
                        }}>
                          #{tag}
                        </span>
                      ))}
                      {card.totalCount > 0 && (
                        <span style={{ fontSize: 11, color: '#6c7086' }}>
                          正确率: {card.totalCount > 0 ? Math.round((card.correctCount / card.totalCount) * 100) : 0}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCard(card.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: 4
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {selectedDeck.flashcards.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c7086' }}>
                  这个卡组还没有卡片，点击"添加卡片"开始添加吧！
                </div>
              )}
            </div>
          </div>
        )}

        {/* 创建卡片视图 */}
        {viewMode === 'create' && selectedDeck && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <button 
                onClick={() => setViewMode('list')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#89b4fa',
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 12
                }}
              >
                ← 返回
              </button>
              <h3 style={{ margin: 0, fontSize: 18 }}>添加新卡片到 {selectedDeck.name}</h3>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #313244 0%, #45475a 100%)',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#a6adc8', marginBottom: 6 }}>正面（问题/单词）</label>
                <input
                  type="text"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="例如：Hello"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid #45475a',
                    background: '#1e1e2e',
                    color: '#cdd6f4',
                    fontSize: 14
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#a6adc8', marginBottom: 6 }}>背面（答案/释义）</label>
                <textarea
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="例如：你好"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid #45475a',
                    background: '#1e1e2e',
                    color: '#cdd6f4',
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#a6adc8', marginBottom: 6 }}>标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={newCardTags}
                    onChange={(e) => setNewCardTags(e.target.value)}
                    placeholder="例如：基础, 科技"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #45475a',
                      background: '#1e1e2e',
                      color: '#cdd6f4',
                      fontSize: 13
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#a6adc8', marginBottom: 6 }}>难度</label>
                  <select
                    value={newCardDifficulty}
                    onChange={(e) => setNewCardDifficulty(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #45475a',
                      background: '#1e1e2e',
                      color: '#cdd6f4',
                      fontSize: 13
                    }}
                  >
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>
              </div>

              <button
                onClick={addCard}
                disabled={!newCardFront.trim() || !newCardBack.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: newCardFront.trim() && newCardBack.trim() ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#45475a',
                  border: 'none',
                  borderRadius: 8,
                  color: newCardFront.trim() && newCardBack.trim() ? '#fff' : '#6c7086',
                  cursor: newCardFront.trim() && newCardBack.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                添加卡片
              </button>
            </div>
          </div>
        )}

        {/* 学习视图 */}
        {viewMode === 'study' && selectedDeck && (
          <div>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#a6adc8', marginBottom: 8 }}>
                卡片 {currentCardIndex + 1} / {selectedDeck.flashcards.length}
              </div>
              <div style={{ 
                height: 6, 
                background: '#313244', 
                borderRadius: 3, 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${((currentCardIndex + 1) / selectedDeck.flashcards.length) * 100}%`,
                  background: 'linear-gradient(90deg, #89b4fa, #60a5fa)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            {/* 卡片 */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                perspective: '1000px',
                height: 320,
                marginBottom: 20
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
              }}>
                {/* 正面 */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #313244 0%, #45475a 100%)',
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 12, color: '#6c7086', marginBottom: 16 }}>点击翻转</div>
                  <div style={{ fontSize: 32, fontWeight: 600, textAlign: 'center' }}>
                    {selectedDeck.flashcards[currentCardIndex].front}
                  </div>
                </div>
                {/* 背面 */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #45475a 0%, #585b70 100%)',
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  transform: 'rotateY(180deg)',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: 12, color: '#6c7086', marginBottom: 16 }}>答案</div>
                  <div style={{ fontSize: 28, fontWeight: 600, textAlign: 'center', color: '#89b4fa' }}>
                    {selectedDeck.flashcards[currentCardIndex].back}
                  </div>
                </div>
              </div>
            </div>

            {isFlipped && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => markAnswer(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 15
                  }}
                >
                  ❌ 记错了
                </button>
                <button
                  onClick={() => markAnswer(true)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 15
                  }}
                >
                  ✅ 记对了
                </button>
              </div>
            )}

            <button
              onClick={() => setViewMode('list')}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '10px',
                background: '#45475a',
                border: 'none',
                borderRadius: 8,
                color: '#cdd6f4',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              退出学习
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
