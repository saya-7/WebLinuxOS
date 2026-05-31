import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface TranslationHistory {
  id: string;
  from: string;
  to: string;
  sourceText: string;
  translatedText: string;
  timestamp: Date;
}

const languages: Language[] = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export default function RealTimeTranslator() {
  const { theme } = useStore();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>(() => {
    try {
      const saved = localStorage.getItem('weblinux-translator-history');
      return saved ? JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })) : [];
    } catch {
      return [];
    }
  });
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const isDark = theme === 'dark';
  const bg = isDark ? '#1e1e2e' : '#f7f7fa';
  const cardBg = isDark ? '#252536' : '#ffffff';
  const border = isDark ? '#3a3a5c' : '#e0e0e6';
  const text = isDark ? '#e0e0e8' : '#1c1c1e';
  const accent = isDark ? '#6c5ce7' : '#007aff';

  const translateText = async (text: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      
      if (data.responseStatus === 200) {
        const translation = data.responseData.translatedText;
        setTranslatedText(translation);
        
        const newHistory: TranslationHistory = {
          id: Date.now().toString(),
          from: sourceLang,
          to: targetLang,
          sourceText: text,
          translatedText: translation,
          timestamp: new Date(),
        };
        
        const updatedHistory = [newHistory, ...history].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('weblinux-translator-history', JSON.stringify(updatedHistory));
      } else {
        throw new Error(data.responseDetails || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('翻译失败，请稍后重试');
      setTranslatedText(`[${languages.find(l => l.code === targetLang)?.nativeName}] ${text}`);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (sourceText.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        translateText(sourceText);
      }, 800);
    } else {
      setTranslatedText('');
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang]);

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  const clearHistory = () => {
    if (confirm('确定要清空翻译历史吗？')) {
      setHistory([]);
      localStorage.removeItem('weblinux-translator-history');
    }
  };

  const loadFromHistory = (item: TranslationHistory) => {
    setSourceLang(item.from);
    setTargetLang(item.to);
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = sourceLang;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        setSourceText(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
        setError('语音识别失败');
      };

      recognition.start();
      setIsRecording(true);
    } else {
      alert('您的浏览器不支持语音识别功能');
    }
  };

  const stopRecording = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop?.();
      recognition.abort?.();
      setIsRecording(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.nativeName : code;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, color: text }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🌐</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>实时翻译助手</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>支持多语言翻译和语音输入</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '14px',
          }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden' }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${border}`,
              background: isDark ? '#1a1a2e' : '#f0f0f5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${border}`,
                  background: cardBg,
                  color: text,
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSourceText('')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  🗑️ 清空
                </button>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isRecording ? '#ef4444' : 'transparent',
                    color: isRecording ? 'white' : text,
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {isRecording ? '⏹️ 停止' : '🎤 语音'}
                </button>
                <button
                  onClick={() => speakText(sourceText, sourceLang)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  🔊
                </button>
              </div>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="输入要翻译的文本..."
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '16px',
                border: 'none',
                background: 'transparent',
                color: text,
                fontSize: '15px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: '1.6',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={swapLanguages}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: `1px solid ${border}`,
                background: cardBg,
                color: accent,
                fontSize: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'rotate(180deg)';
                e.currentTarget.style.background = accent;
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)';
                e.currentTarget.style.background = cardBg;
                e.currentTarget.style.color = accent;
              }}
            >
              ⇄
            </button>
          </div>

          <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden' }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${border}`,
              background: isDark ? '#1a1a2e' : '#f0f0f5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${border}`,
                  background: cardBg,
                  color: text,
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  🔊
                </button>
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: text,
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0.8,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  📋 复制
                </button>
              </div>
            </div>
            <div style={{
              minHeight: '140px',
              padding: '16px',
              fontSize: '15px',
              position: 'relative',
              lineHeight: '1.6',
            }}>
              {isTranslating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                  <span>翻译中</span>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <div style={{ opacity: 0.5 }}>翻译结果将显示在这里</div>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${border}` }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>翻译历史</span>
                <button
                  onClick={clearHistory}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  清空
                </button>
              </div>
              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${border}`,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      fontSize: '12px',
                      marginBottom: '6px',
                      opacity: 0.7,
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <span>{getLanguageName(item.from)}</span>
                      <span>→</span>
                      <span>{getLanguageName(item.to)}</span>
                      <span style={{ marginLeft: 'auto' }}>
                        {new Date(item.timestamp).toLocaleTimeString('zh-CN')}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      opacity: 0.8,
                    }}>
                      {item.sourceText}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: accent,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.translatedText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
