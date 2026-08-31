import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const getChatApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/tnea';
  }
  if (import.meta.env.PROD) {
    return 'https://course-registration-api-gwk0.onrender.com/api/tnea';
  }
  return '/api/tnea';
};

const API_BASE_URL = getChatApiBaseUrl();
export default function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am the **TNEA College AI Assistant**.\n\nI can help you explore Tamil Nadu engineering institutions, calculate cutoff feasibility, compare colleges, and inspect branch-specific cutoffs.\n\nAsk me anything in **English, தமிழ், or Tanglish**!`,
      cards: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [suggestions, setSuggestions] = useState([
    '180 BC AD Coimbatore',
    'PSG College of Technology pathi sollu',
    'Kongu AD cutoff',
    'PSG vs Kongu',
    'How cutoff is calculated?',
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      if (data.success) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          cards: data.cards || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      } else {
        const errorMsg = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.message || 'Sorry, I encountered an issue. Please try again.',
          cards: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to connect to the TNEA AI Assistant server. Please ensure the backend is running.',
        cards: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCardClick = (url) => {
    if (url) {
      setIsOpen(false);
      navigate(url);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. Ask me anything about Tamil Nadu engineering colleges or cutoffs!`,
        cards: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'inherit' }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 8px 10px -6px rgba(37, 99, 235, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
          title="Open TNEA AI Assistant"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            🤖
          </div>
          <span>TNEA AI Assistant</span>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
            }}
          />
        </button>
      )}

      {/* Floating Chatbot Panel */}
      {isOpen && (
        <div
          style={{
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '600px',
            maxHeight: 'calc(100vh - 100px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #334155',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.2 }}>TNEA AI Assistant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verified Ground Truth DB</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={clearChat}
                title="Clear Chat History"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '6px',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '0.75rem 0.95rem',
                      borderRadius: isBot ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                      backgroundColor: isBot ? '#ffffff' : '#2563eb',
                      color: isBot ? '#1e293b' : '#ffffff',
                      border: isBot ? '1px solid #e2e8f0' : 'none',
                      boxShadow: isBot ? '0 2px 4px rgba(0,0,0,0.03)' : '0 2px 4px rgba(37,99,235,0.2)',
                      fontSize: '0.84rem',
                      lineHeight: '1.45',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* College Cards attached to message */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginTop: '0.65rem',
                        width: '100%',
                      }}
                    >
                      {msg.cards.map((card, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '0.65rem 0.8rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <span
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px',
                              }}
                            >
                              Code: {card.collegeCode}
                            </span>
                            {card.admissionChance && (
                              <span
                                style={{
                                  backgroundColor: card.admissionChance === 'SAFE' ? '#dcfce7' : card.admissionChance === 'TARGET' ? '#fef9c3' : '#fee2e2',
                                  color: card.admissionChance === 'SAFE' ? '#15803d' : card.admissionChance === 'TARGET' ? '#a16207' : '#b91c1c',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '4px',
                                }}
                              >
                                {card.admissionChance}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                            {card.collegeName}
                          </div>

                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.4rem' }}>
                            📍 {card.district} {card.departmentCode ? `• Branch: ${card.departmentCode}` : ''}
                          </div>

                          {card.historicalCutoff !== undefined && card.historicalCutoff !== null && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#334155', backgroundColor: '#f8fafc', padding: '0.3rem 0.45rem', borderRadius: '6px', marginBottom: '0.45rem' }}>
                              <span>Cutoff: <strong>{Number(card.historicalCutoff).toFixed(2)}</strong></span>
                              {card.studentCutoff && (
                                <span>Diff: <strong>{card.difference >= 0 ? `+${card.difference.toFixed(2)}` : card.difference.toFixed(2)}</strong></span>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() => handleCardClick(card.profileUrl || `/colleges/${card.collegeCode}`)}
                            style={{
                              width: '100%',
                              backgroundColor: '#f8fafc',
                              color: '#2563eb',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#2563eb';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                              e.currentTarget.style.color = '#2563eb';
                            }}
                          >
                            <span>View College Profile</span>
                            <span>→</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', paddingLeft: isBot ? '0.3rem' : '0', paddingRight: isBot ? '0' : '0.3rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', padding: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
                <span>Analyzing official TNEA records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything in English, தமிழ், or Tanglish..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                outline: 'none',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              style={{
                backgroundColor: !inputMessage.trim() || isLoading ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 0.95rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
