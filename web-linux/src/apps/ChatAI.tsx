import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatAI() {
  const { theme } = useStore();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('weblinux-chatai-key') || '');
  const [apiProvider, setApiProvider] = useState<'openai' | 'anthropic' | 'mock'>('mock');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '欢迎使用 WebLinux AI 聊天助手！\n\n我可以帮你：\n• 解答编程问题\n• 写代码和调试\n• 解释技术概念\n• 提供学习建议\n\n你可以选择使用真实 API 或我内置的智能回复。',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(Date.now().toString());
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('weblinux-chatai-sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveCurrentSession = () => {
    const currentSession: ChatSession = {
      id: sessionId,
      title: messages[0]?.content.slice(0, 30) || '新对话',
      messages,
      createdAt: new Date(),
    };
    
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    updatedSessions.push(currentSession);
    setSessions(updatedSessions);
    localStorage.setItem('weblinux-chatai-sessions', JSON.stringify(updatedSessions));
  };

  const loadSession = (session: ChatSession) => {
    setSessionId(session.id);
    setMessages(session.messages);
  };

  const createNewSession = () => {
    saveCurrentSession();
    setSessionId(Date.now().toString());
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: '新对话已开始！有什么我可以帮你的吗？',
        timestamp: new Date(),
      },
    ]);
  };

  const generateMockResponse = async (userInput: string): Promise<string> => {
    const lower = userInput.toLowerCase();
    
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    if (lower.includes('你好') || lower.includes('hi') || lower.includes('hello')) {
      return '你好！很高兴见到你！有什么我可以帮你的吗？';
    }
    
    if (lower.includes('python') || lower.includes('javascript') || lower.includes('代码')) {
      return `好的，我来帮你写一个代码示例！\n\n\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("WebLinux"))
\`\`\`\n\n你可以将此代码复制到终端中运行！`;
    }
    
    if (lower.includes('算法') || lower.includes('数据结构')) {
      return '算法和数据结构是编程的核心！\n\n**重要的算法：**\n• 排序算法（快速排序、归并排序）\n• 搜索算法（二分查找）\n• 动态规划\n• 图算法\n\n**重要的数据结构：**\n• 数组和链表\n• 栈和队列\n• 树和图\n• 哈希表\n\n需要我详细解释某个概念吗？';
    }
    
    if (lower.includes('react') || lower.includes('前端')) {
      return '前端开发很有趣！\n\n**现代前端技术栈：**\n• React / Vue / Angular\n• TypeScript\n• Vite / Webpack\n• Tailwind CSS\n\n你正在学习哪个框架？';
    }
    
    const responses = [
      '这是个好问题！让我帮你分析一下。',
      '我理解了，这里有一些建议。',
      '很有意思的话题！让我们深入探讨。',
      '好的，我来帮你解决这个问题。',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const callOpenAI = async (userInput: string) => {
    if (!apiKey) {
      return '请先在设置中配置你的 OpenAI API Key！';
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: '你是一个专业的编程助手，帮助用户解决各种技术问题。' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userInput },
          ],
          temperature: 0.7,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || '抱歉，我无法生成回复。';
    } catch (error) {
      return `连接 OpenAI API 失败: ${error instanceof Error ? error.message : '未知错误'}\n\n你可以使用模拟模式继续对话！`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      let response: string;
      if (apiProvider === 'openai') {
        response = await callOpenAI(input);
      } else {
        response = await generateMockResponse(input);
      }
      
      setMessages(prev => prev.map(m => 
        m.id === aiMessage.id 
          ? { ...m, content: response, isStreaming: false }
          : m
      ));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#1e1e2e' : '#f7f7fa';
  const cardBg = isDark ? '#252536' : '#ffffff';
  const border = isDark ? '#3a3a5c' : '#e0e0e6';
  const text = isDark ? '#e0e0e8' : '#1c1c1e';
  const accent = isDark ? '#6c5ce7' : '#007aff';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: bg,
      color: text,
    }}>
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${border}`,
        background: cardBg,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>AI 智能助手</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {apiProvider === 'openai' ? 'OpenAI GPT' : '内置智能'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={createNewSession}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${border}`,
              background: cardBg,
              color: text,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            + 新对话
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: '220px',
          borderRight: `1px solid ${border}`,
          background: cardBg,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '12px',
            borderBottom: `1px solid ${border}`,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            对话历史
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {sessions.slice().reverse().map(session => (
              <button
                key={session.id}
                onClick={() => loadSession(session)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: session.id === sessionId ? accent : 'transparent',
                  color: session.id === sessionId ? '#fff' : text,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                {session.title}
              </button>
            ))}
          </div>
          
          <div style={{
            padding: '12px',
            borderTop: `1px solid ${border}`,
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              API 设置
            </div>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value as any)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: `1px solid ${border}`,
                background: bg,
                color: text,
                fontSize: '12px',
                marginBottom: '8px',
              }}
            >
              <option value="mock">内置智能 (免费)</option>
              <option value="openai">OpenAI API</option>
            </select>
            
            {apiProvider === 'openai' && (
              <input
                type="password"
                placeholder="输入 API Key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem('weblinux-chatai-key', e.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${border}`,
                  background: bg,
                  color: text,
                  fontSize: '12px',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: '70%',
                  background: msg.role === 'user' 
                    ? accent 
                    : cardBg,
                  color: msg.role === 'user' ? '#fff' : text,
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: msg.role === 'user' ? 'none' : `1px solid ${border}`,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content.split('```').map((part, i) => 
                    i % 2 === 1 ? (
                      <pre key={i} style={{
                        background: isDark ? '#1a1a2e' : '#f0f0f5',
                        padding: '12px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '13px',
                        margin: '8px 0',
                      }}>
                        <code>{part}</code>
                      </pre>
                    ) : <span key={i}>{part}</span>
                  )}
                  {msg.isStreaming && (
                    <span style={{ animation: 'pulse 1s infinite' }}>...</span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '20px',
            borderTop: `1px solid ${border}`,
            background: cardBg,
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
            }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '20px',
                  border: `1px solid ${border}`,
                  background: bg,
                  color: text,
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '50px',
                  maxHeight: '150px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isLoading || !input.trim() 
                    ? (isDark ? '#4a4a7a' : '#c7c7cc') 
                    : accent,
                  color: '#fff',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              opacity: 0.6,
              textAlign: 'center',
            }}>
              Enter 发送，Shift+Enter 换行
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
