import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
}

interface Suggestion {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const categories = ['工作', '学习', '生活', '健康', '购物', '其他'];
const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

const AITaskAssistant = () => {
  const { theme } = useStore();
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('weblinux-ai-tasks');
      return saved ? JSON.parse(saved).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined
      })) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('其他');
  const [dueDate, setDueDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('weblinux-ai-tasks', JSON.stringify(tasks));
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    setStats({ total, completed, pending: total - completed });
  }, [tasks]);

  const analyzeTask = async (text: string) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSuggestions: Suggestion[] = [];
      
      if (text.toLowerCase().includes('会议') || text.toLowerCase().includes('meeting')) {
        newSuggestions.push({
          id: Date.now().toString(),
          text: '准备会议议程',
          priority: 'high',
          category: '工作'
        });
        newSuggestions.push({
          id: (Date.now() + 1).toString(),
          text: '发送会议提醒邮件',
          priority: 'medium',
          category: '工作'
        });
      }
      
      if (text.toLowerCase().includes('学习') || text.toLowerCase().includes('learn')) {
        newSuggestions.push({
          id: Date.now().toString(),
          text: '制定学习计划',
          priority: 'medium',
          category: '学习'
        });
      }
      
      if (text.toLowerCase().includes('健身') || text.toLowerCase().includes('运动')) {
        newSuggestions.push({
          id: Date.now().toString(),
          text: '准备运动装备',
          priority: 'low',
          category: '健康'
        });
      }
      
      if (newSuggestions.length === 0) {
        newSuggestions.push({
          id: Date.now().toString(),
          text: '将大任务拆分为小步骤',
          priority: 'medium',
          category: '其他'
        });
      }
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTask = (text: string = inputText, taskPriority: 'low' | 'medium' | 'high' = priority, taskCategory: string = category) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority: taskPriority,
      category: taskCategory,
      dueDate: dueDate ? new Date(dueDate) : undefined
    };
    
    setTasks([newTask, ...tasks]);
    setInputText('');
    setDueDate('');
    setSuggestions([]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#1e1e2e' : '#f7f7fa';
  const cardBg = isDark ? '#252536' : '#ffffff';
  const text = isDark ? '#e0e0e8' : '#1c1c1e';
  const subText = isDark ? '#9ca3af' : '#6b7280';
  const border = isDark ? '#3a3a5c' : '#e0e0e6';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, color: text }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>AI 任务助手</h2>
            <p style={{ margin: 0, fontSize: '13px', color: subText }}>智能任务管理与建议</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, background: isDark ? '#1a1a2e' : '#f0f0f5' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>{stats.total}</div>
            <div style={{ fontSize: '12px', color: subText }}>总任务</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{stats.completed}</div>
            <div style={{ fontSize: '12px', color: subText }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ fontSize: '12px', color: subText }}>待处理</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '16px', background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addTask();
                }
              }}
              placeholder="描述你的任务，AI 会帮助你分析并提供建议..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${border}`,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: text,
                fontSize: '14px',
                resize: 'none',
                minHeight: '80px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '12px' }}>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${border}`,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: text,
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${border}`,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: text,
                fontSize: '13px',
                outline: 'none'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${border}`,
                background: isDark ? '#1a1a2e' : '#ffffff',
                color: text,
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => addTask()}
              style={{
                flex: 1,
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              添加任务
            </button>
            <button
              onClick={() => analyzeTask(inputText)}
              disabled={isAnalyzing}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: isAnalyzing ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? '分析中...' : 'AI 分析'}
            </button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', borderRadius: '12px', border: `1px solid rgba(99, 102, 241, 0.3)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
              <span>💡</span>
              <span>AI 建议</span>
            </div>
            {suggestions.map(suggestion => (
              <div
                key={suggestion.id}
                onClick={() => addTask(suggestion.text, suggestion.priority, suggestion.category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: cardBg,
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: `1px solid ${border}`
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: priorityColors[suggestion.priority]
                  }} />
                  <span style={{ fontSize: '14px' }}>{suggestion.text}</span>
                  <span style={{ fontSize: '12px', color: subText, padding: '2px 8px', background: isDark ? '#1a1a2e' : '#f3f4f6', borderRadius: '4px' }}>
                    {suggestion.category}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#6366f1' }}>点击添加</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>任务列表</h3>
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent',
                color: '#ef4444',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              清除已完成
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: subText }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
              <div>还没有任务，添加一个开始吧！</div>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  background: cardBg,
                  borderRadius: '10px',
                  border: `1px solid ${border}`,
                  opacity: task.completed ? 0.6 : 1
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${task.completed ? '#10b981' : border}`,
                    background: task.completed ? '#10b981' : 'transparent',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {task.completed && '✓'}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    marginBottom: '4px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? subText : text
                  }}>
                    {task.text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}>
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span style={{ fontSize: '11px', color: subText }}>{task.category}</span>
                    {task.dueDate && (
                      <span style={{ fontSize: '11px', color: subText }}>
                        📅 {task.dueDate.toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: '4px 8px',
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0.7
                  }}
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AITaskAssistant;
