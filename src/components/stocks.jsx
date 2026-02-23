import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";

// ─── Sabrina AI Chatbot Component ────────────────────────────────────────────
function SabrinaChat({ stockData, financials, earnings, news, ticker, openaiKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: `Hey! I'm Sabrina 😼 Your AI stock analyst. Search a stock to load live data, or just ask me anything about markets, investing, or finance right now. What's on your mind?`
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [orbPulse, setOrbPulse] = useState(true);
    const [pendingImage, setPendingImage] = useState(null); // { dataUrl, base64, mimeType }
    const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState(() => {
        try { return localStorage.getItem('sabrina_voice') || ''; } catch { return ''; }
    });
    const [showVoicePanel, setShowVoicePanel] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevTickerRef = useRef(null);

    // Load voices — browsers load them async, need retry + event
    useEffect(() => {
        const load = () => {
            const v = window.speechSynthesis.getVoices();
            if (v.length > 0) {
                setVoices(v);
                setSelectedVoiceName(prev => {
                    if (prev) return prev; // keep persisted choice
                    try { const saved = localStorage.getItem('sabrina_voice'); if (saved) return saved; } catch {}
                    const english = v.find(x => x.lang.startsWith('en') && x.default)
                        || v.find(x => x.lang.startsWith('en'))
                        || v[0];
                    return english?.name || '';
                });
            }
        };

        load(); // try immediately
        window.speechSynthesis.onvoiceschanged = load; // fire when ready

        // Some browsers (Chrome) need a small delay nudge
        const t = setTimeout(load, 200);
        return () => clearTimeout(t);
    }, []);

    // Persist voice choice
    useEffect(() => {
        try { if (selectedVoiceName) localStorage.setItem('sabrina_voice', selectedVoiceName); } catch {}
    }, [selectedVoiceName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Greet when a new ticker loads
    useEffect(() => {
        if (ticker && ticker !== prevTickerRef.current) {
            prevTickerRef.current = ticker;
            setMessages([{
                role: 'assistant',
                content: `**${ticker}** data loaded 😼 I've got price, earnings, financials and news all in front of me. What do you want to know?`
            }]);
        }
    }, [ticker]);

    // Stop speech when chat closes
    useEffect(() => {
        if (!isOpen) { window.speechSynthesis.cancel(); setSpeakingMsgIdx(null); }
    }, [isOpen]);

    const buildSystemPrompt = () => {
        const hasData = !!stockData;
        let context = `You are Sabrina, a sharp, confident AI stock analyst assistant named after Sabrina Pasterski (the physicist). You're knowledgeable, direct, and occasionally witty.`;

        if (!hasData) {
            context += `\n\nIMPORTANT: No stock is currently loaded in the screener. You do NOT have access to live market data right now. You can still answer general finance and investing questions from your training knowledge, but be upfront that you don't have real-time prices or current data unless the user loads a stock first. Don't make up numbers.`;
        } else {
            context += `\n\nCURRENT STOCK DATA for ${stockData.longName || ticker} (${ticker}):
- Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'}
- Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- 52-Week High: $${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}
- 52-Week Low: $${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}
- Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
- Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}
- Business: ${stockData.longBusinessSummary?.substring(0, 400) || 'N/A'}`;

            if (earnings?.length > 0) {
                context += `\n\nRECENT QUARTERLY EARNINGS:`;
                earnings.slice(0, 8).forEach(e => {
                    context += `\n- ${e.quarter}: Revenue $${e.revenue ? (e.revenue / 1e9).toFixed(2) + 'B' : 'N/A'}, Earnings $${e.earnings ? (e.earnings / 1e9).toFixed(2) + 'B' : 'N/A'}`;
                });
            }
            if (financials?.data) {
                context += `\n\nANNUAL FINANCIALS:`;
                financials.data.forEach(row => {
                    const vals = row.values?.map((v, i) => `${financials.columns?.[i]}: $${v ? (v / 1e9).toFixed(2) + 'B' : 'N/A'}`).join(', ');
                    context += `\n- ${row.metric}: ${vals}`;
                });
            }
            if (news?.length > 0) {
                context += `\n\nRECENT NEWS:`;
                news.slice(0, 5).forEach(item => {
                    if (item?.title) context += `\n- ${item.title} (${item.publisher || 'Unknown'})`;
                });
            }
        }
        context += `\n\nBe concise but insightful. Use **bold** for key figures. Don't be overly cautious — give real analysis.`;
        return context;
    };

    const sendMessage = async () => {
        if ((!input.trim() && !pendingImage) || loading) return;
        if (!openaiKey) {
            setMessages(prev => [...prev,
                { role: 'user', content: input, image: pendingImage?.dataUrl },
                { role: 'assistant', content: "Can't reach my brain right now — OpenAI key not loaded yet. Try again in a sec 😅" }
            ]);
            setInput(''); setPendingImage(null);
            return;
        }

        const userMsg = { role: 'user', content: input, image: pendingImage?.dataUrl };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        const currentImage = pendingImage;
        setInput(''); setPendingImage(null);
        setLoading(true);

        // Build OpenAI messages — include images where present
        const apiMessages = [
            { role: 'system', content: buildSystemPrompt() },
            ...messages
                .filter(m => m.role !== 'system')
                .map(m => {
                    if (m.image) {
                        return {
                            role: m.role,
                            content: [
                                { type: 'image_url', image_url: { url: m.image } },
                                { type: 'text', text: m.content || '(image attached)' }
                            ]
                        };
                    }
                    return { role: m.role, content: m.content };
                }),
        ];

        // Add the current user message
        if (currentImage) {
            apiMessages.push({
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: currentImage.dataUrl } },
                    { type: 'text', text: currentInput || '(image attached)' }
                ]
            });
        } else {
            apiMessages.push({ role: 'user', content: currentInput });
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
                body: JSON.stringify({ model: 'gpt-4o-mini', messages: apiMessages, max_tokens: 700, temperature: 0.7 })
            });
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || "Hmm, lost my train of thought. Try again?";
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Network hiccup — give me a sec 😼" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            setPendingImage({ dataUrl, mimeType: file.type });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleSpeak = (text, idx) => {
        if (speakingMsgIdx === idx) {
            window.speechSynthesis.cancel();
            setSpeakingMsgIdx(null);
            return;
        }
        window.speechSynthesis.cancel();
        // Strip markdown for speech
        const plain = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/<[^>]+>/g, '');
        const utt = new SpeechSynthesisUtterance(plain);
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) utt.voice = voice;
        utt.onend = () => setSpeakingMsgIdx(null);
        utt.onerror = () => setSpeakingMsgIdx(null);
        window.speechSynthesis.speak(utt);
        setSpeakingMsgIdx(idx);
    };

    const renderMessage = (text) => text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <>
            {/* ── Orb ── */}
            <div
                onClick={() => { setIsOpen(o => !o); setOrbPulse(false); }}
                title="Chat with Sabrina"
                style={{
                    position: 'fixed', bottom: '30px', right: '30px',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
                    boxShadow: orbPulse ? '0 0 0 0 rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.5)' : '0 8px 32px rgba(124,58,237,0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10000, fontSize: '28px',
                    animation: orbPulse ? 'sabrinaPulse 2s infinite' : 'none',
                    transition: 'transform 0.2s', userSelect: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? '✕' : '😼'}
            </div>

            {/* ── Chat Panel ── */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '110px', right: '20px',
                    width: 'min(430px, calc(100vw - 40px))',
                    height: 'min(600px, calc(100vh - 160px))',
                    backgroundColor: '#0f0f14', borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.3)',
                    display: 'flex', flexDirection: 'column', zIndex: 9999,
                    overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                        display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
                    }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '19px', flexShrink: 0,
                        }}>😼</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px', lineHeight: 1.2 }}>Sabrina</div>
                            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
                                {ticker ? `Loaded: ${ticker}` : 'No stock loaded — ask anything'}
                                {' · '}
                                <span style={{ color: '#86efac' }}>● Online</span>
                            </div>
                        </div>
                        {/* Voice settings toggle */}
                        <button
                            onClick={() => setShowVoicePanel(v => !v)}
                            title="Voice settings"
                            style={{
                                background: showVoicePanel ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                                border: 'none', borderRadius: '8px', padding: '6px 8px',
                                color: '#fff', fontSize: '14px', cursor: 'pointer', flexShrink: 0,
                                transition: 'background 0.15s',
                            }}
                        >🔊</button>
                    </div>

                    {/* Voice panel (collapsible) */}
                    {showVoicePanel && (
                        <div style={{
                            padding: '10px 14px',
                            backgroundColor: '#1a1a2e',
                            borderBottom: '1px solid rgba(124,58,237,0.2)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>🔊 Voice</span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                                    {voices.length > 0 ? `${voices.length} available` : 'Loading…'}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: 'auto' }}>
                                    Click 🔊 on any reply to read it
                                </span>
                            </div>
                            {voices.length > 0 ? (
                                <select
                                    value={selectedVoiceName}
                                    onChange={e => setSelectedVoiceName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '7px 10px',
                                        backgroundColor: '#0f0f14',
                                        border: '1px solid rgba(124,58,237,0.4)',
                                        borderRadius: '8px', color: '#f0f0f0',
                                        fontSize: '12px', outline: 'none', cursor: 'pointer',
                                    }}
                                >
                                    {voices.map((v, i) => (
                                        <option key={i} value={v.name}>
                                            {v.name} — {v.lang}{v.default ? ' ★' : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: '6px 0' }}>
                                    No voices loaded yet — try clicking the 🔊 button on a message first
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px', alignItems: 'flex-end' }}>
                                {msg.role === 'assistant' && (
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', flexShrink: 0,
                                    }}>😼</div>
                                )}
                                <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {/* Image preview in message */}
                                    {msg.image && (
                                        <img src={msg.image} alt="uploaded" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '10px', objectFit: 'cover' }} />
                                    )}
                                    {msg.content && (
                                        <div style={{
                                            padding: '9px 13px',
                                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            backgroundColor: msg.role === 'user' ? '#7c3aed' : '#1e1e2e',
                                            color: '#f0f0f0', fontSize: '13.5px', lineHeight: '1.5',
                                            border: msg.role === 'assistant' ? '1px solid rgba(124,58,237,0.2)' : 'none',
                                        }}
                                            dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                                        />
                                    )}
                                    {/* Speak button on assistant messages */}
                                    {msg.role === 'assistant' && msg.content && (
                                        <button
                                            onClick={() => handleSpeak(msg.content, idx)}
                                            title={speakingMsgIdx === idx ? 'Stop reading' : 'Read aloud'}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '13px', padding: '2px 6px', borderRadius: '6px',
                                                color: speakingMsgIdx === idx ? '#f59e0b' : 'rgba(255,255,255,0.3)',
                                                transition: 'color 0.15s',
                                                alignSelf: 'flex-start',
                                            }}
                                            onMouseEnter={e => { if (speakingMsgIdx !== idx) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                                            onMouseLeave={e => { if (speakingMsgIdx !== idx) e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                                        >
                                            {speakingMsgIdx === idx ? '⏹ Stop' : '🔊'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>😼</div>
                                <div style={{ padding: '9px 13px', backgroundColor: '#1e1e2e', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#7c3aed', animation: `sabrnaTyping 1.2s ${i * 0.2}s infinite` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Pending image preview */}
                    {pendingImage && (
                        <div style={{
                            padding: '8px 14px',
                            backgroundColor: '#1a1a2e',
                            borderTop: '1px solid rgba(124,58,237,0.15)',
                            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
                        }}>
                            <img src={pendingImage.dataUrl} alt="pending" style={{ height: '48px', width: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', flex: 1 }}>Image ready to send</span>
                            <button onClick={() => setPendingImage(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '16px', cursor: 'pointer' }}>✕</button>
                        </div>
                    )}

                    {/* Input bar */}
                    <div style={{
                        padding: '10px 12px',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        backgroundColor: '#0f0f14',
                        display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0,
                    }}>
                        {/* Image upload button */}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach image"
                            style={{
                                background: pendingImage ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(124,58,237,0.3)',
                                borderRadius: '10px', padding: '8px 10px',
                                color: '#ccc', fontSize: '15px', cursor: 'pointer', flexShrink: 0,
                                transition: 'background 0.15s',
                            }}
                        >🖼️</button>

                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={ticker ? `Ask about ${ticker}...` : 'Ask me anything...'}
                            style={{
                                flex: 1, padding: '9px 13px', minWidth: 0,
                                backgroundColor: '#1e1e2e',
                                border: '1px solid rgba(124,58,237,0.3)',
                                borderRadius: '12px', color: '#f0f0f0',
                                fontSize: '13.5px', outline: 'none',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || (!input.trim() && !pendingImage)}
                            style={{
                                padding: '9px 14px', flexShrink: 0,
                                background: loading || (!input.trim() && !pendingImage) ? 'rgba(124,58,237,0.25)' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '16px', cursor: loading || (!input.trim() && !pendingImage) ? 'not-allowed' : 'pointer',
                                transition: 'background 0.15s',
                            }}
                        >↑</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes sabrinaPulse {
                    0%   { box-shadow: 0 0 0 0 rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.5); }
                    70%  { box-shadow: 0 0 0 16px rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.3); }
                    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.5); }
                }
                @keyframes sabrnaTyping {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30%           { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </>
    );
}

// ─── AI News Analysis Modal ───────────────────────────────────────────────────
function NewsAnalysisModal({ isOpen, onClose, analysis, ticker, onReanalyse, isAnalysing }) {
    if (!isOpen) return null;

    const biasConfig = {
        BULLISH: { color: '#10b981', headerBg: '#f0fdf4', headerBorder: '#bbf7d0', badge: '#10b981', badgeText: '#fff', icon: '📈', label: 'Bullish' },
        BEARISH: { color: '#ef4444', headerBg: '#fef2f2', headerBorder: '#fecaca', badge: '#ef4444', badgeText: '#fff', icon: '📉', label: 'Bearish' },
        NEUTRAL: { color: '#f59e0b', headerBg: '#fffbeb', headerBorder: '#fde68a', badge: '#f59e0b', badgeText: '#fff', icon: '➡️', label: 'Neutral' },
        MIXED:   { color: '#2563eb', headerBg: '#eff6ff', headerBorder: '#bfdbfe', badge: '#2563eb', badgeText: '#fff', icon: '🔀', label: 'Mixed' },
    };

    const cfg = biasConfig[analysis?.bias] || biasConfig.NEUTRAL;

    const renderRich = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/#{1,3} (.*?)(\n|$)/g, '<span style="font-weight:700;font-size:15px;display:block;margin:12px 0 6px;color:#1a1a1a">$1</span>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, padding: '16px',
                backdropFilter: 'blur(3px)',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: 'min(680px, 100%)',
                    maxHeight: '92vh',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    animation: 'modalSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Header */}
                <div style={{
                    backgroundColor: cfg.headerBg,
                    borderBottom: `2px solid ${cfg.headerBorder}`,
                    padding: '24px 24px 20px',
                    flexShrink: 0,
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '13px', color: '#666', fontWeight: '600', letterSpacing: '0.05em' }}>
                                    😼 Sabrina's Analysis
                                </span>
                                <span style={{ fontSize: '11px', color: '#888', backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                                    {ticker}
                                </span>
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', lineHeight: 1.25, marginBottom: '12px' }}>
                                {cfg.icon} News Intelligence Report
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                    backgroundColor: cfg.badge, color: cfg.badgeText,
                                    padding: '5px 14px', borderRadius: '20px',
                                    fontSize: '12px', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase',
                                }}>
                                    {cfg.label} BIAS
                                </span>
                                {analysis?.confidence && (
                                    <span style={{
                                        backgroundColor: '#fff', color: '#555',
                                        padding: '5px 12px', borderRadius: '20px',
                                        fontSize: '12px', fontWeight: '600',
                                        border: '1px solid #e0e0e0',
                                    }}>
                                        {analysis.confidence}% confidence
                                    </span>
                                )}
                                {analysis?.articleCount && (
                                    <span style={{ fontSize: '12px', color: '#999' }}>
                                        · {analysis.articleCount} articles analysed
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
                            width: '34px', height: '34px', color: '#555', fontSize: '18px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
                        >✕</button>
                    </div>

                    {/* Confidence bar */}
                    {analysis?.confidence && (
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontWeight: '600', letterSpacing: '0.07em' }}>
                                SIGNAL STRENGTH
                            </div>
                            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: '3px',
                                    width: `${analysis.confidence}%`,
                                    backgroundColor: cfg.color,
                                    transition: 'width 1s ease',
                                }} />
                            </div>
                        </div>
                    )}

                    {analysis?.generatedAt && (
                        <div style={{ marginTop: '10px', fontSize: '11px', color: '#aaa' }}>
                            Generated {analysis.generatedAt}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fff' }}>

                    {/* TL;DR */}
                    {analysis?.tldr && (
                        <div style={{
                            backgroundColor: cfg.headerBg,
                            border: `1px solid ${cfg.headerBorder}`,
                            borderLeft: `4px solid ${cfg.color}`,
                            borderRadius: '10px',
                            padding: '14px 18px',
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: cfg.color, letterSpacing: '0.1em', marginBottom: '6px' }}>TL;DR</div>
                            <div style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.6', fontWeight: '500' }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.tldr) }} />
                        </div>
                    )}

                    {/* Key themes */}
                    {analysis?.themes && analysis.themes.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>KEY THEMES</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {analysis.themes.map((theme, i) => (
                                    <span key={i} style={{
                                        backgroundColor: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        color: '#1d4ed8',
                                        padding: '5px 13px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                    }}>
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full summary */}
                    {analysis?.summary && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>FULL ANALYSIS</div>
                            <div style={{
                                fontSize: '14px', color: '#333', lineHeight: '1.75',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px', padding: '16px 18px',
                                border: '1px solid #e0e0e0',
                            }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.summary) }} />
                        </div>
                    )}

                    {/* Catalysts */}
                    {analysis?.catalysts && analysis.catalysts.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>
                                {analysis.bias === 'BEARISH' ? '⚠️ RISK CATALYSTS' : '🚀 KEY CATALYSTS'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {analysis.catalysts.map((c, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '10px', padding: '12px 16px',
                                        border: '1px solid #e8e8e8',
                                    }}>
                                        <div style={{
                                            width: '22px', height: '22px', borderRadius: '50%',
                                            backgroundColor: cfg.color + '20',
                                            color: cfg.color, fontSize: '11px', fontWeight: '800',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, marginTop: '1px',
                                        }}>{i + 1}</div>
                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: renderRich(c) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Risks */}
                    {analysis?.risks && analysis.risks.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>⚠️ WATCH-OUT RISKS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {analysis.risks.map((r, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                                        backgroundColor: '#fef2f2',
                                        borderRadius: '10px', padding: '12px 16px',
                                        border: '1px solid #fecaca',
                                    }}>
                                        <div style={{ color: '#ef4444', fontSize: '16px', flexShrink: 0, marginTop: '1px', fontWeight: '700' }}>↘</div>
                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: renderRich(r) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sabrina's Take */}
                    {analysis?.recommendation && (
                        <div style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderLeft: '4px solid #2563eb',
                            borderRadius: '10px',
                            padding: '16px 18px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '16px' }}>😼</span>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', letterSpacing: '0.1em' }}>SABRINA'S TAKE</div>
                            </div>
                            <div style={{ fontSize: '15px', color: '#1e3a5f', lineHeight: '1.65', fontStyle: 'italic' }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.recommendation) }} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    padding: '14px 24px',
                    display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
                    flexShrink: 0,
                }}>
                    <button
                        onClick={onReanalyse}
                        disabled={isAnalysing}
                        style={{
                            padding: '9px 18px',
                            backgroundColor: isAnalysing ? '#93c5fd' : '#2563eb',
                            border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '14px', fontWeight: '600',
                            cursor: isAnalysing ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (!isAnalysing) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                        onMouseLeave={e => { if (!isAnalysing) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                    >
                        {isAnalysing
                            ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Analysing...</>
                            : <><span>🔄</span> Re-ask Sabrina</>}
                    </button>
                    <button onClick={onClose} style={{
                        padding: '9px 18px',
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px', color: '#555',
                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                        transition: 'background 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        Close
                    </button>
                    <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#bbb' }}>
                        Powered by Sabrina × GPT-4o mini
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

// ─── News Section Component ───────────────────────────────────────────────────
function EnhancedNewsSection({ ticker, baseUrl, existingNews, openaiKey, stockData }) {
    const [marketauxNews, setMarketauxNews] = useState([]);
    const [fetchingNews, setFetchingNews] = useState(false);
    const [newsError, setNewsError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [activeNewsTab, setActiveNewsTab] = useState('yahoo');
    const [pendingArticle, setPendingArticle] = useState(null);

    // Analysis states
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);
    const [cachedAnalyses, setCachedAnalyses] = useState({}); // { [ticker]: analysis }

    // Load cached analyses from storage on mount
    useEffect(() => {
        const loadCached = async () => {
            try {
                const result = await window.storage.get('news-analyses');
                if (result?.value) {
                    setCachedAnalyses(JSON.parse(result.value));
                }
            } catch {
                // no cached data yet — fresh start
            }
        };
        loadCached();
    }, []);

    const currentAnalysis = cachedAnalyses[ticker] || null;

    const saveAnalysis = async (newAnalysis) => {
        const updated = { ...cachedAnalyses, [ticker]: newAnalysis };
        setCachedAnalyses(updated);
        try {
            await window.storage.set('news-analyses', JSON.stringify(updated));
        } catch (err) {
            console.error('Storage save failed:', err);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp || timestamp === 'N/A') return 'N/A';
        try {
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return timestamp; }
    };

    const fetchMarketauxNews = async () => {
        if (!ticker) return;
        setFetchingNews(true);
        setNewsError(null);
        try {
            const response = await fetch(`${baseUrl}/fetch_news_data_api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assets: [ticker], user_email: 'screener@snowai.app' })
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            setMarketauxNews(data.message || []);
            setHasFetched(true);
            setActiveNewsTab('marketaux');
        } catch (err) {
            setNewsError(err.message || 'Failed to fetch news. Please try again.');
        } finally {
            setFetchingNews(false);
        }
    };

    const runNewsAnalysis = async () => {
        if (!openaiKey) {
            setAnalysisError("OpenAI key not loaded yet. Try again in a moment.");
            return;
        }

        setIsAnalysing(true);
        setAnalysisError(null);

        // Build article corpus from whatever news is available
        const allArticles = [
            ...(existingNews || []).filter(n => n?.title).map(n => ({
                title: n.title,
                description: n.description || '',
                source: n.publisher || 'Yahoo Finance',
            })),
            ...marketauxNews.filter(n => n?.title).map(n => ({
                title: n.title,
                description: n.description || '',
                highlights: typeof n.highlights === 'string' ? n.highlights : '',
                source: n.source || 'Marketaux',
            })),
        ];

        if (allArticles.length === 0) {
            setAnalysisError("No news articles loaded yet. Fetch some news first, then run analysis.");
            setIsAnalysing(false);
            return;
        }

        const stockContext = stockData ? `
Stock: ${stockData.longName || ticker} (${ticker})
Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}
Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'} | Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}` : `Stock: ${ticker}`;

        const articleDump = allArticles.slice(0, 12).map((a, i) =>
            `[${i + 1}] "${a.title}" — ${a.source}\n${a.description || ''}${a.highlights ? '\nHighlight: ' + a.highlights : ''}`
        ).join('\n\n');

        const prompt = `You are Sabrina, a sharp AI stock analyst. Analyse these ${allArticles.length} news articles for ${ticker} and return a JSON object ONLY (no markdown, no backticks).

${stockContext}

NEWS ARTICLES:
${articleDump}

Return this exact JSON structure:
{
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "tldr": "<one punchy sentence summary>",
  "themes": ["<theme1>", "<theme2>", "<theme3>"],
  "summary": "<3-5 paragraph analysis using the news, referencing specific articles, with markdown bold for key points>",
  "catalysts": ["<catalyst 1>", "<catalyst 2>", "<catalyst 3>"],
  "risks": ["<risk 1>", "<risk 2>"],
  "recommendation": "<Sabrina's personal take in 2-3 sentences, direct and opinionated, first-person voice>"
}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1200,
                    temperature: 0.6,
                })
            });

            const data = await response.json();
            const raw = data.choices?.[0]?.message?.content || '';

            let parsed;
            try {
                // strip any accidental code fences
                const clean = raw.replace(/```json|```/g, '').trim();
                parsed = JSON.parse(clean);
            } catch {
                throw new Error("Sabrina returned unexpected format. Try again.");
            }

            const analysis = {
                ...parsed,
                generatedAt: new Date().toLocaleString(),
                articleCount: allArticles.length,
            };

            await saveAnalysis(analysis);
            setShowAnalysisModal(true);
        } catch (err) {
            setAnalysisError(err.message || 'Analysis failed. Try again.');
        } finally {
            setIsAnalysing(false);
        }
    };

    const getSentimentColor = (title) => {
        const lower = title?.toLowerCase() || '';
        if (['surge', 'rally', 'gain', 'beat', 'soar', 'rise', 'jump', 'up', 'high', 'record', 'profit', 'growth'].some(w => lower.includes(w)))
            return { dot: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' };
        if (['fall', 'drop', 'decline', 'miss', 'loss', 'down', 'low', 'crash', 'risk', 'warn', 'cut', 'layoff'].some(w => lower.includes(w)))
            return { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' };
        return { dot: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' };
    };

    const biasColors = { BULLISH: '#10b981', BEARISH: '#ef4444', NEUTRAL: '#f59e0b', MIXED: '#6366f1' };
    const biasIcons  = { BULLISH: '📈', BEARISH: '📉', NEUTRAL: '➡️', MIXED: '🔀' };
    const totalArticles = (existingNews?.filter(n => n?.title)?.length || 0) + marketauxNews.length;

    return (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>

            {/* ── Top bar: tabs + AI button ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {/* Yahoo tab */}
                <button onClick={() => setActiveNewsTab('yahoo')} style={{
                    padding: '8px 18px', borderRadius: '20px', border: '2px solid',
                    borderColor: activeNewsTab === 'yahoo' ? '#2563eb' : '#e0e0e0',
                    backgroundColor: activeNewsTab === 'yahoo' ? '#2563eb' : '#fff',
                    color: activeNewsTab === 'yahoo' ? '#fff' : '#666',
                    fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                    📰 Yahoo Finance ({existingNews?.filter(n => n?.title)?.length || 0})
                </button>

                {/* Marketaux tab */}
                <button
                    onClick={hasFetched ? () => setActiveNewsTab('marketaux') : fetchMarketauxNews}
                    disabled={fetchingNews}
                    style={{
                        padding: '8px 18px', borderRadius: '20px', border: '2px solid',
                        borderColor: activeNewsTab === 'marketaux' && hasFetched ? '#8b5cf6' : 'rgba(139,92,246,0.5)',
                        backgroundColor: activeNewsTab === 'marketaux' && hasFetched ? '#8b5cf6' : fetchingNews ? 'rgba(139,92,246,0.15)' : '#fff',
                        color: activeNewsTab === 'marketaux' && hasFetched ? '#fff' : '#8b5cf6',
                        fontWeight: '600', fontSize: '14px', cursor: fetchingNews ? 'wait' : 'pointer',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                >
                    {fetchingNews
                        ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>Fetching...</>
                        : hasFetched ? `🔮 Marketaux (${marketauxNews.length})` : '🔮 Fetch Deep News'}
                </button>

                {hasFetched && (
                    <button onClick={fetchMarketauxNews} disabled={fetchingNews} style={{
                        padding: '8px 14px', borderRadius: '20px', border: '2px solid #e0e0e0',
                        backgroundColor: '#fff', color: '#999', fontSize: '13px', cursor: 'pointer',
                    }}>🔄 Refresh</button>
                )}

                {/* Divider */}
                <div style={{ width: '1px', height: '28px', backgroundColor: '#e0e0e0', flexShrink: 0, display: totalArticles > 0 ? 'block' : 'none' }} />

                {/* AI Analyse button */}
                {totalArticles > 0 && (
                    <button
                        onClick={currentAnalysis ? () => setShowAnalysisModal(true) : runNewsAnalysis}
                        disabled={isAnalysing}
                        style={{
                            padding: '8px 18px', borderRadius: '20px',
                            border: '2px solid',
                            borderColor: currentAnalysis ? biasColors[currentAnalysis.bias] || '#db2777' : 'rgba(219,39,119,0.5)',
                            background: currentAnalysis
                                ? `linear-gradient(135deg, ${biasColors[currentAnalysis.bias]}22, ${biasColors[currentAnalysis.bias]}11)`
                                : isAnalysing ? 'rgba(219,39,119,0.1)' : '#fff',
                            color: currentAnalysis ? biasColors[currentAnalysis.bias] : '#db2777',
                            fontWeight: '700', fontSize: '14px',
                            cursor: isAnalysing ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (!isAnalysing) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        {isAnalysing ? (
                            <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>Analysing...</>
                        ) : currentAnalysis ? (
                            <>{biasIcons[currentAnalysis.bias]} View Analysis ({currentAnalysis.bias})</>
                        ) : (
                            <>😼 Ask Sabrina to Analyse</>
                        )}
                    </button>
                )}

                {/* Re-run option if cached analysis exists */}
                {currentAnalysis && (
                    <button
                        onClick={runNewsAnalysis}
                        disabled={isAnalysing}
                        style={{
                            padding: '8px 14px', borderRadius: '20px',
                            border: '2px solid #e0e0e0', backgroundColor: '#fff',
                            color: '#999', fontSize: '13px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                        }}
                        title="Re-run analysis with latest news"
                    >
                        🔄 Re-ask
                    </button>
                )}
            </div>

            {/* Cached analysis preview strip */}
            {currentAnalysis && !showAnalysisModal && (
                <div
                    onClick={() => setShowAnalysisModal(true)}
                    style={{
                        marginBottom: '16px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${biasColors[currentAnalysis.bias]}18, ${biasColors[currentAnalysis.bias]}08)`,
                        border: `1px solid ${biasColors[currentAnalysis.bias]}35`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                        transition: 'box-shadow 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${biasColors[currentAnalysis.bias]}25`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                    <span style={{ fontSize: '20px' }}>{biasIcons[currentAnalysis.bias]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: biasColors[currentAnalysis.bias], marginBottom: '2px' }}>
                            😼 Sabrina's Analysis — {currentAnalysis.bias} · {currentAnalysis.confidence}% confidence
                        </div>
                        <div style={{ fontSize: '13px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentAnalysis.tldr}
                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', flexShrink: 0 }}>Tap to expand ↗</div>
                </div>
            )}

            {/* Error states */}
            {(newsError || analysisError) && (
                <div style={{
                    padding: '14px 18px', backgroundColor: '#fef2f2', borderRadius: '10px',
                    border: '1px solid #fecaca', color: '#b91c1c', marginBottom: '16px',
                    fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                    <div><strong>{newsError ? "Couldn't load news:" : "Analysis error:"}</strong> {newsError || analysisError}</div>
                </div>
            )}

            {/* Yahoo Finance News */}
            {activeNewsTab === 'yahoo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {existingNews && existingNews.filter(n => n?.title).length > 0 ? (
                        existingNews.filter(n => n?.title).map((item, idx) => {
                            const sentiment = getSentimentColor(item.title);
                            return (
                                <div key={idx} onClick={() => item.link && setPendingArticle({ title: item.title, publisher: item.publisher, url: item.link })}
                                    style={{
                                        padding: '16px 18px', backgroundColor: sentiment.bg,
                                        borderRadius: '12px', border: `1px solid ${sentiment.border}`,
                                        cursor: item.link ? 'pointer' : 'default',
                                        transition: 'transform 0.15s, box-shadow 0.15s',
                                        display: 'flex', gap: '14px', alignItems: 'flex-start',
                                    }}
                                    onMouseEnter={e => { if (item.link) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: sentiment.dot, marginTop: '5px', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '6px', wordBreak: 'break-word' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            {item.publisher && <span style={{ backgroundColor: '#fff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e0e0e0', fontWeight: '500' }}>{item.publisher}</span>}
                                            <span>{formatDate(item.providerPublishTime)}</span>
                                            {item.link && <span style={{ color: '#2563eb' }}>↗ Read more</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyNewsState message="No Yahoo Finance news available for this stock." />
                    )}
                </div>
            )}

            {/* Marketaux News */}
            {activeNewsTab === 'marketaux' && hasFetched && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {marketauxNews.length > 0 ? (
                        marketauxNews.map((item, idx) => {
                            const sentiment = getSentimentColor(item.title);
                            return (
                                <div key={idx} onClick={() => item.url && setPendingArticle({ title: item.title, source: item.source, url: item.url })}
                                    style={{
                                        padding: '18px 20px', backgroundColor: sentiment.bg,
                                        borderRadius: '14px', border: `1px solid ${sentiment.border}`,
                                        cursor: item.url ? 'pointer' : 'default', transition: 'transform 0.15s, box-shadow 0.15s',
                                    }}
                                    onMouseEnter={e => { if (item.url) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: '#8b5cf6', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>MARKETAUX</span>
                                        {item.source && <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>via {item.source}</span>}
                                        <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sentiment.dot, flexShrink: 0 }} />
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '10px' }}>{item.title}</div>
                                    {item.description && (
                                        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
                                            {item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description}
                                        </div>
                                    )}
                                    {(() => {
                                        // Debug: log raw highlights to console so we can see exact format
                                        if (item.highlights) console.log('[SnowAI highlights]', JSON.stringify(item.highlights));

                                        const cleanText = (t) => {
                                            if (!t) return '';
                                            return String(t)
                                                .replace(/<[^>]+>/g, '')
                                                .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
                                                .replace(/\\n/g, ' ').replace(/\s+/g, ' ')
                                                .replace(/^[\s,']+|[\s,']+$/g, '')
                                                .trim();
                                        };

                                        const extractHighlight = (raw) => {
                                            if (raw == null) return '';

                                            // JS object with highlight key
                                            if (typeof raw === 'object' && !Array.isArray(raw)) {
                                                return cleanText(raw.highlight || raw.text || raw.content || '');
                                            }

                                            // Array — grab first item
                                            if (Array.isArray(raw)) {
                                                if (raw.length === 0) return '';
                                                const first = raw[0];
                                                if (typeof first === 'object') return cleanText(first.highlight || first.text || '');
                                                return cleanText(String(first));
                                            }

                                            // String handling
                                            const s = String(raw).trim();

                                            // Pure plain string with no dict artifacts → use directly
                                            if (!s.includes("'highlight'") && !s.includes('"highlight"') && !/\[\+?\d+ characters\]/.test(s)) {
                                                return cleanText(s);
                                            }

                                            // Python dict repr: {'highlight': 'text with apostrophe\'s here', 'sentiment': 0.5, ...}
                                            // GREEDY match from 'highlight': ' up to the LAST ', 'sentiment' occurrence
                                            // This handles apostrophes inside the text
                                            const pyMatch = s.match(/'highlight'\s*:\s*'([\s\S]*)',\s*'sentiment'/);
                                            if (pyMatch) return cleanText(pyMatch[1]);

                                            // Truncated repr: text[+345 characters] — extract what came before
                                            const truncMatch = s.match(/^([\s\S]+?)\[\+?\d+ characters\]/);
                                            if (truncMatch) {
                                                // Also strip leading dict key if present: {'highlight': 'ACTUAL TEXT
                                                let extracted = truncMatch[1];
                                                const keyMatch = extracted.match(/'highlight'\s*:\s*'([\s\S]+)/);
                                                if (keyMatch) extracted = keyMatch[1];
                                                return extracted.length > 15 ? cleanText(extracted) : '';
                                            }

                                            // JSON-quoted key: {"highlight": "text"}
                                            try {
                                                const parsed = JSON.parse(s);
                                                return cleanText(parsed.highlight || parsed.text || '');
                                            } catch {}

                                            // Last resort: just clean whatever we have
                                            return cleanText(s);
                                        };

                                        const hlText = extractHighlight(item.highlights);
                                        const display = hlText.length > 280 ? hlText.substring(0, 280) + '…' : hlText;

                                        return display ? (
                                            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '10px 14px', borderLeft: `3px solid ${sentiment.dot}`, marginBottom: '10px' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', marginBottom: '4px', letterSpacing: '0.08em' }}>KEY HIGHLIGHT</div>
                                                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{display}</div>
                                            </div>
                                        ) : null;
                                    })()}
                                    {item.url && <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>↗ Read full article</div>}
                                </div>
                            );
                        })
                    ) : (
                        <EmptyNewsState message="No Marketaux news found for this ticker. Try a more popular stock." />
                    )}
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes articleModalPop {
                    from { opacity: 0; transform: scale(0.93) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            {/* Article Link Confirm Modal */}
            {pendingArticle && (
                <div
                    onClick={() => setPendingArticle(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10002, padding: '20px',
                        backdropFilter: 'blur(3px)',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: 'min(420px, 100%)',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                            animation: 'articleModalPop 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '22px', flexShrink: 0,
                                }}>🔗</div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '3px' }}>
                                        Open external article?
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888' }}>
                                        {'You'll be taken to '}
                                        <strong style={{ color: '#2563eb' }}>
                                            {(() => { try { return new URL(pendingArticle.url).hostname.replace('www.', ''); } catch { return pendingArticle.url; } })()}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#f8f9fa', borderRadius: '10px',
                                padding: '12px 14px', border: '1px solid #e8e8e8', marginBottom: '20px',
                            }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '6px' }}>
                                    {pendingArticle.title}
                                </div>
                                {(pendingArticle.publisher || pendingArticle.source) && (
                                    <span style={{
                                        fontSize: '11px', fontWeight: '600', color: '#555',
                                        backgroundColor: '#fff', padding: '2px 8px',
                                        borderRadius: '8px', border: '1px solid #e0e0e0',
                                    }}>
                                        {pendingArticle.publisher || pendingArticle.source}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => { window.open(pendingArticle.url, '_blank'); setPendingArticle(null); }}
                                    style={{
                                        flex: 1, padding: '11px 16px', backgroundColor: '#2563eb',
                                        border: 'none', borderRadius: '10px', color: '#fff',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                                >
                                    <span>↗</span> Yes, open article
                                </button>
                                <button
                                    onClick={() => setPendingArticle(null)}
                                    style={{
                                        flex: 1, padding: '11px 16px', backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0', borderRadius: '10px', color: '#555',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f4f4'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    Stay here
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Modal */}
            <NewsAnalysisModal
                isOpen={showAnalysisModal}
                onClose={() => setShowAnalysisModal(false)}
                analysis={currentAnalysis}
                ticker={ticker}
                onReanalyse={() => { setShowAnalysisModal(false); runNewsAnalysis(); }}
                isAnalysing={isAnalysing}
            />
        </div>
    );
}

function EmptyNewsState({ message }) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #e0e0e0',
        }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div style={{ color: '#666', fontSize: '15px' }}>{message}</div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SnowAIStockScreener() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const popularStocks = [
        { name: "Apple", symbol: "AAPL", category: "Tech Giants" },
        { name: "Microsoft", symbol: "MSFT", category: "Tech Giants" },
        { name: "Google (Alphabet)", symbol: "GOOGL", category: "Tech Giants" },
        { name: "Amazon", symbol: "AMZN", category: "Tech Giants" },
        { name: "Meta (Facebook)", symbol: "META", category: "Tech Giants" },
        { name: "Tesla", symbol: "TSLA", category: "Tech Giants" },
        { name: "NVIDIA", symbol: "NVDA", category: "Tech Giants" },
        { name: "Netflix", symbol: "NFLX", category: "Tech Giants" },
        { name: "JPMorgan Chase", symbol: "JPM", category: "Financial" },
        { name: "Bank of America", symbol: "BAC", category: "Financial" },
        { name: "Wells Fargo", symbol: "WFC", category: "Financial" },
        { name: "Goldman Sachs", symbol: "GS", category: "Financial" },
        { name: "Morgan Stanley", symbol: "MS", category: "Financial" },
        { name: "Visa", symbol: "V", category: "Financial" },
        { name: "Mastercard", symbol: "MA", category: "Financial" },
        { name: "American Express", symbol: "AXP", category: "Financial" },
        { name: "Walmart", symbol: "WMT", category: "Retail" },
        { name: "Target", symbol: "TGT", category: "Retail" },
        { name: "Home Depot", symbol: "HD", category: "Retail" },
        { name: "Nike", symbol: "NKE", category: "Retail" },
        { name: "Starbucks", symbol: "SBUX", category: "Retail" },
        { name: "McDonald's", symbol: "MCD", category: "Retail" },
        { name: "Coca-Cola", symbol: "KO", category: "Retail" },
        { name: "PepsiCo", symbol: "PEP", category: "Retail" },
        { name: "FedEx", symbol: "FDX", category: "Retail" },
        { name: "Johnson & Johnson", symbol: "JNJ", category: "Healthcare" },
        { name: "Pfizer", symbol: "PFE", category: "Healthcare" },
        { name: "UnitedHealth", symbol: "UNH", category: "Healthcare" },
        { name: "Moderna", symbol: "MRNA", category: "Healthcare" },
        { name: "AbbVie", symbol: "ABBV", category: "Healthcare" },
        { name: "Eli Lilly", symbol: "LLY", category: "Healthcare" },
        { name: "Biogen", symbol: "BIIB", category: "Healthcare" },
        { name: "Cencora", symbol: "COR", category: "Healthcare" },
        { name: "Intel", symbol: "INTC", category: "Semiconductors" },
        { name: "AMD", symbol: "AMD", category: "Semiconductors" },
        { name: "Qualcomm", symbol: "QCOM", category: "Semiconductors" },
        { name: "Broadcom", symbol: "AVGO", category: "Semiconductors" },
        { name: "Texas Instruments", symbol: "TXN", category: "Semiconductors" },
        { name: "ExxonMobil", symbol: "XOM", category: "Energy" },
        { name: "Chevron", symbol: "CVX", category: "Energy" },
        { name: "ConocoPhillips", symbol: "COP", category: "Energy" },
        { name: "NextEra Energy", symbol: "NEE", category: "Energy" },
        { name: "Devon Energy", symbol: "DVN", category: "Energy" },
        { name: "Disney", symbol: "DIS", category: "Media" },
        { name: "Comcast", symbol: "CMCSA", category: "Media" },
        { name: "Warner Bros Discovery", symbol: "WBD", category: "Media" },
        { name: "Salesforce", symbol: "CRM", category: "Software" },
        { name: "Adobe", symbol: "ADBE", category: "Software" },
        { name: "Oracle", symbol: "ORCL", category: "Software" },
        { name: "ServiceNow", symbol: "NOW", category: "Software" },
        { name: "Ford", symbol: "F", category: "Automotive" },
        { name: "General Motors", symbol: "GM", category: "Automotive" },
        { name: "Rivian", symbol: "RIVN", category: "Automotive" },
        { name: "Lucid", symbol: "LCID", category: "Automotive" },
        { name: "NIO", symbol: "NIO", category: "Automotive" },
        { name: "Boeing", symbol: "BA", category: "Aerospace" },
        { name: "Lockheed Martin", symbol: "LMT", category: "Aerospace" },
        { name: "PayPal", symbol: "PYPL", category: "Fintech" },
        { name: "Square (Block)", symbol: "SQ", category: "Fintech" },
        { name: "Shopify", symbol: "SHOP", category: "Fintech" },
        { name: "Coinbase", symbol: "COIN", category: "Fintech" },
    ];

    const [ticker, setTicker] = useState('');
    const [stockData, setStockData] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [financialsView, setFinancialsView] = useState('table');
    const [earningsView, setEarningsView] = useState('table');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
    const [aiAnalysisResults, setAiAnalysisResults] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [analysisFilterCategory, setAnalysisFilterCategory] = useState('All');
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) setSelectedVoice(availableVoices[0]);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        const fetchOpenAIKey = async () => {
            try {
                const response = await fetch(`${baseUrl}/get_openai_key`);
                if (response.ok) {
                    const { OPENAI_API_KEY } = await response.json();
                    setOPENAI_API_KEY(OPENAI_API_KEY);
                }
            } catch (err) {
                console.error('Failed to fetch OpenAI key:', err);
            }
        };
        fetchOpenAIKey();
    }, []);

    const fetchStockData = async (symbol) => {
        if (!symbol) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${symbol}`);
            const data = await response.json();
            if (response.ok) {
                setStockData(data.stock_info);
                setFinancials(data.financials);
                setEarnings(data.earnings);
                setNews(data.news || []);
                setTicker(symbol);
            } else {
                setError(data.error || 'Failed to fetch stock data');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeStock = (stockData) => {
        const { earnings } = stockData;
        if (!earnings || earnings.length < 4) return { signal: 'INSUFFICIENT_DATA', confidence: 0, reason: 'Not enough data', revenueDeviation: 0, earningsDeviation: 0 };
        const recentQuarters = earnings.slice(0, 4);
        const olderQuarters = earnings.slice(4, 8);
        const recentRevenue = recentQuarters.filter(q => q.revenue && q.revenue !== 0).map(q => q.revenue);
        const recentEarnings = recentQuarters.filter(q => q.earnings && q.earnings !== 0).map(q => q.earnings);
        const olderRevenue = olderQuarters.filter(q => q.revenue && q.revenue !== 0).map(q => q.revenue);
        const olderEarnings = olderQuarters.filter(q => q.earnings && q.earnings !== 0).map(q => q.earnings);
        if (recentRevenue.length === 0 || olderRevenue.length === 0) return { signal: 'INSUFFICIENT_DATA', confidence: 0, reason: 'Not enough data', revenueDeviation: 0, earningsDeviation: 0 };
        const avgRecentRevenue = recentRevenue.reduce((a, b) => a + b, 0) / recentRevenue.length;
        const avgOlderRevenue = olderRevenue.reduce((a, b) => a + b, 0) / olderRevenue.length;
        const avgRecentEarnings = recentEarnings.length > 0 ? recentEarnings.reduce((a, b) => a + b, 0) / recentEarnings.length : 0;
        const avgOlderEarnings = olderEarnings.length > 0 ? olderEarnings.reduce((a, b) => a + b, 0) / olderEarnings.length : 0;
        const revenueDeviation = ((avgRecentRevenue - avgOlderRevenue) / Math.abs(avgOlderRevenue)) * 100;
        const earningsDeviation = avgOlderEarnings !== 0 ? ((avgRecentEarnings - avgOlderEarnings) / Math.abs(avgOlderEarnings)) * 100 : 0;
        const THRESHOLD = 10;
        let signal = 'NEUTRAL', confidence = 0, reason = '';
        if (Math.abs(revenueDeviation) > THRESHOLD || Math.abs(earningsDeviation) > THRESHOLD) {
            if (revenueDeviation > THRESHOLD || earningsDeviation > THRESHOLD) {
                signal = 'BULLISH';
                confidence = Math.min(95, 50 + Math.abs((revenueDeviation + earningsDeviation) / 2));
                reason = 'Revenue and/or earnings showing significant positive growth';
            } else {
                signal = 'BEARISH';
                confidence = Math.min(95, 50 + Math.abs((revenueDeviation + earningsDeviation) / 2));
                reason = 'Revenue and/or earnings showing significant decline';
            }
        } else {
            signal = 'NEUTRAL'; confidence = 70;
            reason = 'Performance is stable and within normal range';
        }
        return { signal, confidence: Math.round(confidence), reason, revenueDeviation: revenueDeviation.toFixed(2), earningsDeviation: earningsDeviation.toFixed(2), avgRecentRevenue: (avgRecentRevenue / 1e9).toFixed(2), avgOlderRevenue: (avgOlderRevenue / 1e9).toFixed(2), avgRecentEarnings: (avgRecentEarnings / 1e9).toFixed(2), avgOlderEarnings: (avgOlderEarnings / 1e9).toFixed(2) };
    };

    const runAIAnalysis = async () => {
        setAiAnalysisRunning(true);
        setError(null);
        const results = { bullish: [], bearish: [], neutral: [], insufficient: [], timestamp: new Date().toLocaleString() };
        try {
            for (const stock of popularStocks) {
                try {
                    const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${stock.symbol}`);
                    const data = await response.json();
                    if (response.ok && data.earnings) {
                        const analysis = analyzeStock(data);
                        const stockResult = { ...stock, ...analysis, currentPrice: data.stock_info?.currentPrice, marketCap: data.stock_info?.marketCap };
                        if (analysis.signal === 'BULLISH') results.bullish.push(stockResult);
                        else if (analysis.signal === 'BEARISH') results.bearish.push(stockResult);
                        else if (analysis.signal === 'NEUTRAL') results.neutral.push(stockResult);
                        else results.insufficient.push(stockResult);
                    }
                } catch (err) { console.error(`Error analyzing ${stock.symbol}:`, err); }
            }
            results.bullish.sort((a, b) => b.confidence - a.confidence);
            results.bearish.sort((a, b) => b.confidence - a.confidence);
            results.neutral.sort((a, b) => b.confidence - a.confidence);
            results.marketSentiment = calculateMarketSentiment(results);
            setAiAnalysisResults(results);
            setShowAnalysisModal(true);
        } catch (err) { setError('Failed to complete AI analysis'); }
        finally { setAiAnalysisRunning(false); }
    };

    const calculateMarketSentiment = (results) => {
        const allAnalyzedStocks = [...results.bullish, ...results.bearish, ...results.neutral];
        if (allAnalyzedStocks.length === 0) return null;
        let totalMarketCap = 0, weightedBullishScore = 0, weightedBearishScore = 0, weightedNeutralScore = 0;
        allAnalyzedStocks.forEach(stock => {
            const marketCap = stock.marketCap || 0;
            totalMarketCap += marketCap;
            if (stock.signal === 'BULLISH') weightedBullishScore += marketCap * (stock.confidence / 100);
            else if (stock.signal === 'BEARISH') weightedBearishScore += marketCap * (stock.confidence / 100);
            else weightedNeutralScore += marketCap * (stock.confidence / 100);
        });
        const bullishPercentage = totalMarketCap > 0 ? (weightedBullishScore / totalMarketCap) * 100 : 0;
        const bearishPercentage = totalMarketCap > 0 ? (weightedBearishScore / totalMarketCap) * 100 : 0;
        const neutralPercentage = totalMarketCap > 0 ? (weightedNeutralScore / totalMarketCap) * 100 : 0;
        const netSentiment = bullishPercentage - bearishPercentage;
        let marketOutlook = 'NEUTRAL', marketConfidence = 65, marketDescription = '';
        let indicesOutlook = { sp500: { direction: 'NEUTRAL', confidence: 65, reasoning: '' }, nasdaq: { direction: 'NEUTRAL', confidence: 65, reasoning: '' }, dowJones: { direction: 'NEUTRAL', confidence: 65, reasoning: '' } };
        if (netSentiment > 15) {
            marketOutlook = 'BULLISH'; marketConfidence = Math.min(85, 50 + netSentiment);
            marketDescription = 'Strong positive momentum across major stocks. Large-cap growth stocks are showing significant earnings expansion.';
            indicesOutlook = { sp500: { direction: 'BULLISH', confidence: Math.min(85, 50 + netSentiment * 0.9), reasoning: 'Broad-based strength across sectors driving index higher.' }, nasdaq: { direction: 'BULLISH', confidence: Math.min(90, 50 + netSentiment * 1.1), reasoning: 'Tech and growth stocks showing strong momentum.' }, dowJones: { direction: 'BULLISH', confidence: Math.min(80, 50 + netSentiment * 0.85), reasoning: 'Blue-chip stocks demonstrating solid performance.' } };
        } else if (netSentiment < -15) {
            marketOutlook = 'BEARISH'; marketConfidence = Math.min(85, 50 + Math.abs(netSentiment));
            marketDescription = 'Widespread weakness across major stocks. Earnings pressures and declining fundamentals suggest headwinds.';
            indicesOutlook = { sp500: { direction: 'BEARISH', confidence: Math.min(85, 50 + Math.abs(netSentiment) * 0.9), reasoning: 'Broad-based weakness across multiple sectors.' }, nasdaq: { direction: 'BEARISH', confidence: Math.min(90, 50 + Math.abs(netSentiment) * 1.1), reasoning: 'Tech sector showing significant weakness.' }, dowJones: { direction: 'BEARISH', confidence: Math.min(80, 50 + Math.abs(netSentiment) * 0.85), reasoning: 'Industrial and blue-chip stocks facing headwinds.' } };
        } else {
            marketDescription = 'Mixed signals across the market. Stocks showing stable performance with balanced signals, suggesting consolidation.';
        }
        const sectorBreakdown = {};
        allAnalyzedStocks.forEach(stock => {
            if (!sectorBreakdown[stock.category]) sectorBreakdown[stock.category] = { bullish: 0, bearish: 0, neutral: 0 };
            if (stock.signal === 'BULLISH') sectorBreakdown[stock.category].bullish++;
            else if (stock.signal === 'BEARISH') sectorBreakdown[stock.category].bearish++;
            else sectorBreakdown[stock.category].neutral++;
        });
        return { marketOutlook, marketConfidence: Math.round(marketConfidence), marketDescription, bullishPercentage: bullishPercentage.toFixed(1), bearishPercentage: bearishPercentage.toFixed(1), neutralPercentage: neutralPercentage.toFixed(1), bullishCount: results.bullish.length, bearishCount: results.bearish.length, neutralCount: results.neutral.length, totalCount: results.bullish.length + results.bearish.length + results.neutral.length, totalMarketCap: (totalMarketCap / 1e12).toFixed(2), indicesOutlook, sectorBreakdown };
    };

    const handleSearch = (e) => { e.preventDefault(); if (ticker) fetchStockData(ticker); };
    const handleStockClick = (symbol) => { fetchStockData(symbol); setShowModal(false); setShowAnalysisModal(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const formatNewsDate = (timestamp) => {
        if (!timestamp || timestamp === 'N/A') return 'N/A';
        try { return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch { return timestamp; }
    };

    const prepareFinancialsChartData = () => {
        if (!financials?.data || !financials?.columns) return [];
        return financials.columns.map((year, idx) => {
            const dataPoint = { year };
            let hasData = false;
            financials.data.forEach(row => {
                if (row.values?.[idx] !== null && row.values?.[idx] !== 0) { dataPoint[row.metric] = (row.values[idx] / 1e9).toFixed(2); hasData = true; }
            });
            return hasData ? dataPoint : null;
        }).filter(Boolean).reverse();
    };

    const prepareEarningsChartData = () => {
        if (!earnings?.length) return [];
        return earnings.map(e => {
            if ((e.revenue && e.revenue !== 0) || (e.earnings && e.earnings !== 0)) {
                return { quarter: e.quarter, revenue: e.revenue ? (e.revenue / 1e9).toFixed(2) : null, earnings: e.earnings ? (e.earnings / 1e9).toFixed(2) : null };
            }
            return null;
        }).filter(Boolean).reverse();
    };

    const getChartDomain = () => {
        const chartData = prepareEarningsChartData();
        if (!chartData.length) return [0, 'auto'];
        const allValues = chartData.flatMap(i => [parseFloat(i.revenue), parseFloat(i.earnings)].filter(v => !isNaN(v)));
        if (!allValues.length) return [0, 'auto'];
        const min = Math.min(...allValues), max = Math.max(...allValues), pad = (max - min) * 0.2;
        return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10];
    };

    const getFinancialChartDomain = () => {
        const chartData = prepareFinancialsChartData();
        if (!chartData.length) return [0, 'auto'];
        const allValues = chartData.flatMap(item => Object.entries(item).filter(([k]) => k !== 'year').map(([, v]) => parseFloat(v))).filter(v => !isNaN(v));
        if (!allValues.length) return [0, 'auto'];
        const min = Math.min(...allValues), max = Math.max(...allValues), pad = (max - min) * 0.2;
        return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10];
    };

    const handleSpeak = () => {
        if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
        else {
            const utterance = new SpeechSynthesisUtterance(stockData?.longBusinessSummary || 'No description available.');
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const categories = ['All', ...new Set(popularStocks.map(s => s.category))];
    const filteredStocks = popularStocks.filter(s => {
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const styles = {
        container: { padding: '15px', maxWidth: '1400px', width: '100%', boxSizing: 'border-box' },
        searchSection: { marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        searchForm: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
        input: { padding: '10px 15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '6px', width: '200px', maxWidth: '100%', outline: 'none', boxSizing: 'border-box' },
        searchButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' },
        browseButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' },
        aiAnalysisButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', overflow: 'auto' },
        modalContent: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '1200px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', boxSizing: 'border-box' },
        closeButton: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
        modalHeader: { fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' },
        categoryFilter: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
        categoryButton: { padding: '8px 16px', fontSize: '14px', border: '2px solid #e0e0e0', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#fff', color: '#666', fontWeight: '500' },
        categoryButtonActive: { backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' },
        stockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '15px' },
        stockCard: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer', border: '2px solid transparent', textAlign: 'center' },
        stockName: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
        stockSymbol: { fontSize: '13px', color: '#2563eb', fontWeight: '700' },
        stockCategory: { fontSize: '11px', color: '#999', marginTop: '4px' },
        analysisCard: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px', border: '2px solid transparent', cursor: 'pointer' },
        analysisCardBullish: { borderLeft: '4px solid #10b981', backgroundColor: '#f0fdf4' },
        analysisCardBearish: { borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' },
        analysisCardNeutral: { borderLeft: '4px solid #f59e0b', backgroundColor: '#fffbeb' },
        signalBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 },
        bullishBadge: { backgroundColor: '#10b981', color: '#fff' },
        bearishBadge: { backgroundColor: '#ef4444', color: '#fff' },
        neutralBadge: { backgroundColor: '#f59e0b', color: '#fff' },
        confidenceBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#e0e0e0', color: '#333', whiteSpace: 'nowrap', flexShrink: 0 },
        analysisSection: { marginBottom: '30px' },
        analysisSectionTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' },
        deviationText: { fontSize: '13px', color: '#666', marginTop: '8px' },
        tabContainer: { display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
        tab: { padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', borderBottom: '3px solid transparent', color: '#666', whiteSpace: 'nowrap', flexShrink: 0 },
        activeTabStyle: { borderBottom: '3px solid #2563eb', color: '#2563eb' },
        contentCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px', width: '100%', boxSizing: 'border-box', overflowX: 'auto' },
        viewToggle: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
        toggleButton: { padding: '8px 16px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', color: '#666', fontWeight: '500' },
        toggleButtonActive: { backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' },
        overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' },
        statBox: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #2563eb' },
        statLabel: { fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: '500' },
        statValue: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a', wordBreak: 'break-word' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', minWidth: '600px' },
        th: { textAlign: 'left', padding: '12px', backgroundColor: '#f8f9fa', fontWeight: '600', borderBottom: '2px solid #e0e0e0' },
        td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
        loading: { textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' },
        error: { padding: '15px', backgroundColor: '#fee', color: '#c33', borderRadius: '6px', marginTop: '15px' },
        companyHeader: { marginBottom: '20px' },
        companyName: { fontSize: '24px', fontWeight: '700', marginBottom: '5px' },
        companySymbol: { fontSize: '14px', color: '#666' },
        voiceControls: { display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' },
        voiceButton: { padding: '8px 16px', fontSize: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
        voiceButtonStop: { backgroundColor: '#ef4444' },
        marketSentimentCard: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '30px', border: '3px solid #e0e0e0', boxSizing: 'border-box', width: '100%', overflow: 'hidden' },
        marketSentimentBullish: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
        marketSentimentBearish: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
        marketSentimentNeutral: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
        sentimentHeader: { fontSize: '20px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%' },
        sentimentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '20px', width: '100%' },
        sentimentStatBox: { padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', boxSizing: 'border-box', minWidth: '0' },
        indicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px', width: '100%', maxWidth: '100%', margin: '20px 0 0 0' },
        indexCard: { padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid #e0e0e0', boxSizing: 'border-box', width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '0' },
        indexCardBullish: { borderColor: '#10b981' },
        indexCardBearish: { borderColor: '#ef4444' },
        indexCardNeutral: { borderColor: '#f59e0b' },
        indexName: { fontSize: '18px', fontWeight: '700', marginBottom: '10px' },
        indexDirection: { fontSize: '14px', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
        indexReasoning: { fontSize: '13px', color: '#666', lineHeight: '1.5', wordWrap: 'break-word', overflowWrap: 'break-word' },
    };

    return (
        <div>
            <div className="header"><Header /></div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header" style={{ padding: '15px', margin: 0 }}>SnowAI Stock Screener</h5>

                    <div style={styles.container}>
                        {/* Search Section */}
                        <div style={styles.searchSection}>
                            <div style={styles.searchForm}>
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                    placeholder="Enter ticker (e.g., AAPL)"
                                    style={styles.input}
                                />
                                <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
                                    {loading ? 'Loading...' : 'Search'}
                                </button>
                                <button onClick={() => setShowModal(true)} style={styles.browseButton}>
                                    📊 Browse Stocks
                                </button>
                                <button onClick={runAIAnalysis} style={styles.aiAnalysisButton} disabled={aiAnalysisRunning}>
                                    {aiAnalysisRunning ? <><span>⏳</span><span>Analyzing...</span></> : <><span>🤖</span><span>AI Stock Analysis</span></>}
                                </button>
                                {aiAnalysisResults && (
                                    <button onClick={() => setShowAnalysisModal(true)} style={{ ...styles.browseButton, backgroundColor: '#f59e0b' }}>
                                        📊 View Results
                                    </button>
                                )}
                            </div>
                            {error && <div style={styles.error}>{error}</div>}
                        </div>

                        {/* Browse Stocks Modal */}
                        {showModal && (
                            <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                    <button style={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
                                    <div style={styles.modalHeader}>Select a Stock</div>
                                    <input type="text" placeholder="Search stocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...styles.input, width: '100%', marginBottom: '15px' }} />
                                    <div style={styles.categoryFilter}>
                                        {categories.map(category => (
                                            <button key={category} onClick={() => setSelectedCategory(category)} style={{ ...styles.categoryButton, ...(selectedCategory === category ? styles.categoryButtonActive : {}) }}>
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={styles.stockGrid}>
                                        {filteredStocks.map((stock, idx) => (
                                            <div key={idx} style={styles.stockCard} onClick={() => handleStockClick(stock.symbol)}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.2)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                <div style={styles.stockName}>{stock.name}</div>
                                                <div style={styles.stockSymbol}>{stock.symbol}</div>
                                                <div style={styles.stockCategory}>{stock.category}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Analysis Modal */}
                        {showAnalysisModal && aiAnalysisResults && (
                            <div style={styles.modalOverlay} onClick={() => setShowAnalysisModal(false)}>
                                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                    <button style={styles.closeButton} onClick={() => setShowAnalysisModal(false)}>×</button>
                                    <div style={styles.modalHeader}>🤖 AI Stock Analysis Results</div>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>Analysis completed at {aiAnalysisResults.timestamp}</p>

                                    {aiAnalysisResults.marketSentiment && (
                                        <div style={{ ...styles.marketSentimentCard, ...(aiAnalysisResults.marketSentiment.marketOutlook === 'BULLISH' ? styles.marketSentimentBullish : aiAnalysisResults.marketSentiment.marketOutlook === 'BEARISH' ? styles.marketSentimentBearish : styles.marketSentimentNeutral) }}>
                                            <div style={styles.sentimentHeader}>
                                                <span style={{ fontSize: '28px', flexShrink: 0 }}>{aiAnalysisResults.marketSentiment.marketOutlook === 'BULLISH' ? '📈' : aiAnalysisResults.marketSentiment.marketOutlook === 'BEARISH' ? '📉' : '➡️'}</span>
                                                <span style={{ flex: '1 1 auto', minWidth: 0 }}>Overall Market Sentiment: {aiAnalysisResults.marketSentiment.marketOutlook}</span>
                                                <span style={styles.confidenceBadge}>{aiAnalysisResults.marketSentiment.marketConfidence}% Confidence</span>
                                            </div>
                                            <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>{aiAnalysisResults.marketSentiment.marketDescription}</p>
                                            <div style={styles.sentimentGrid}>
                                                {[
                                                    { label: 'Bullish Signals', pct: aiAnalysisResults.marketSentiment.bullishPercentage, count: aiAnalysisResults.marketSentiment.bullishCount, color: '#10b981' },
                                                    { label: 'Bearish Signals', pct: aiAnalysisResults.marketSentiment.bearishPercentage, count: aiAnalysisResults.marketSentiment.bearishCount, color: '#ef4444' },
                                                    { label: 'Neutral/Stable', pct: aiAnalysisResults.marketSentiment.neutralPercentage, count: aiAnalysisResults.marketSentiment.neutralCount, color: '#f59e0b' },
                                                    { label: 'Total Market Cap', pct: `$${aiAnalysisResults.marketSentiment.totalMarketCap}T`, count: `${aiAnalysisResults.marketSentiment.totalCount} stocks analyzed`, color: '#2563eb' },
                                                ].map((item, i) => (
                                                    <div key={i} style={styles.sentimentStatBox}>
                                                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>{item.label}</div>
                                                        <div style={{ fontSize: '24px', fontWeight: '700', color: item.color }}>{item.pct}{i < 3 ? '%' : ''}</div>
                                                        <div style={{ fontSize: '12px', color: '#999' }}>{item.count}{i < 3 ? ' stocks' : ''}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '25px' }}>
                                                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>📊 US Stock Indices Outlook</h4>
                                                <div style={styles.indicesGrid}>
                                                    {[
                                                        { name: 'S&P 500', key: 'sp500' },
                                                        { name: 'NASDAQ Composite', key: 'nasdaq' },
                                                        { name: 'Dow Jones Industrial', key: 'dowJones' },
                                                    ].map(({ name, key }) => {
                                                        const idx = aiAnalysisResults.marketSentiment.indicesOutlook[key];
                                                        return (
                                                            <div key={key} style={{ ...styles.indexCard, ...(idx.direction === 'BULLISH' ? styles.indexCardBullish : idx.direction === 'BEARISH' ? styles.indexCardBearish : styles.indexCardNeutral) }}>
                                                                <div style={styles.indexName}>{name}</div>
                                                                <div style={styles.indexDirection}>
                                                                    <span style={{ ...styles.signalBadge, ...(idx.direction === 'BULLISH' ? styles.bullishBadge : idx.direction === 'BEARISH' ? styles.bearishBadge : styles.neutralBadge) }}>{idx.direction}</span>
                                                                    <span style={styles.confidenceBadge}>{idx.confidence}%</span>
                                                                </div>
                                                                <div style={styles.indexReasoning}>{idx.reasoning}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.categoryFilter}>
                                        <button onClick={() => setAnalysisFilterCategory('All')} style={{ ...styles.categoryButton, ...(analysisFilterCategory === 'All' ? styles.categoryButtonActive : {}) }}>All Stocks</button>
                                        {categories.filter(c => c !== 'All').map(category => (
                                            <button key={category} onClick={() => setAnalysisFilterCategory(category)} style={{ ...styles.categoryButton, ...(analysisFilterCategory === category ? styles.categoryButtonActive : {}) }}>{category}</button>
                                        ))}
                                    </div>

                                    {[
                                        { key: 'bullish', icon: '📈', label: 'Bullish Opportunities', cardStyle: styles.analysisCardBullish, badgeStyle: styles.bullishBadge, hoverShadow: 'rgba(16,185,129,0.2)', devColor: '#10b981' },
                                        { key: 'bearish', icon: '📉', label: 'Bearish Warnings', cardStyle: styles.analysisCardBearish, badgeStyle: styles.bearishBadge, hoverShadow: 'rgba(239,68,68,0.2)', devColor: '#ef4444' },
                                        { key: 'neutral', icon: '➡️', label: 'Neutral / Stable', cardStyle: styles.analysisCardNeutral, badgeStyle: styles.neutralBadge, hoverShadow: 'rgba(245,158,11,0.2)', devColor: '#666' },
                                    ].map(({ key, icon, label, cardStyle, badgeStyle, hoverShadow, devColor }) => {
                                        const filtered = analysisFilterCategory === 'All' ? aiAnalysisResults[key] : aiAnalysisResults[key].filter(s => s.category === analysisFilterCategory);
                                        if (!filtered.length) return null;
                                        return (
                                            <div key={key} style={styles.analysisSection}>
                                                <div style={styles.analysisSectionTitle}><span>{icon}</span><span>{label} ({filtered.length})</span></div>
                                                {filtered.map((stock, idx) => (
                                                    <div key={idx} style={{ ...styles.analysisCard, ...cardStyle }} onClick={() => handleStockClick(stock.symbol)}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${hoverShadow}`; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                                                            <div>
                                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>{stock.name} ({stock.symbol})</div>
                                                                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{stock.category}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <span style={{ ...styles.signalBadge, ...badgeStyle }}>{key.toUpperCase()}</span>
                                                                <span style={styles.confidenceBadge}>{stock.confidence}% Confidence</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{stock.reason}</div>
                                                        <div style={styles.deviationText}>
                                                            Revenue Growth: <strong style={{ color: devColor }}>{stock.revenueDeviation > 0 ? '+' : ''}{stock.revenueDeviation}%</strong> |
                                                            Earnings Growth: <strong style={{ color: devColor }}>{stock.earningsDeviation > 0 ? '+' : ''}{stock.earningsDeviation}%</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock Data */}
                        {stockData && (
                            <>
                                <div style={styles.companyHeader}>
                                    <div style={styles.companyName}>{stockData.longName || ticker}</div>
                                    <div style={styles.companySymbol}>{stockData.symbol} • {stockData.sector} • {stockData.industry}</div>
                                </div>

                                <div style={styles.tabContainer}>
                                    {['overview', 'financials', 'earnings', 'news'].map(tab => (
                                        <button key={tab} style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTabStyle : {}) }} onClick={() => setActiveTab(tab)}>
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'overview' && (
                                    <div style={styles.contentCard}>
                                        <h3>Company Overview</h3>
                                        <div style={styles.overviewGrid}>
                                            {[
                                                { label: 'Current Price', value: `$${stockData.currentPrice?.toFixed(2) || 'N/A'}` },
                                                { label: 'Market Cap', value: stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(2)}B` : 'N/A' },
                                                { label: 'P/E Ratio', value: stockData.trailingPE?.toFixed(2) || 'N/A' },
                                                { label: '52 Week High', value: `$${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}` },
                                                { label: '52 Week Low', value: `$${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}` },
                                                { label: 'Dividend Yield', value: stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : 'N/A' },
                                            ].map(({ label, value }, i) => (
                                                <div key={i} style={styles.statBox}>
                                                    <div style={styles.statLabel}>{label}</div>
                                                    <div style={styles.statValue}>{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <h4>About</h4>
                                            <div style={styles.voiceControls}>
                                                <button onClick={handleSpeak} style={{ ...styles.voiceButton, ...(isSpeaking ? styles.voiceButtonStop : {}) }}>
                                                    {isSpeaking ? '⏹ Stop Reading' : '🔊 Read Aloud'}
                                                </button>
                                                <select value={selectedVoice?.name || ''} onChange={e => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
                                                    {voices.map((voice, idx) => <option key={idx} value={voice.name}>{voice.name} ({voice.lang})</option>)}
                                                </select>
                                            </div>
                                            <p style={{ lineHeight: '1.6', color: '#444' }}>{stockData.longBusinessSummary || 'No description available.'}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && financials && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3>Financial Statements (Annual)</h3>
                                            <div style={styles.viewToggle}>
                                                {['table', 'chart'].map(v => (
                                                    <button key={v} onClick={() => setFinancialsView(v)} style={{ ...styles.toggleButton, ...(financialsView === v ? styles.toggleButtonActive : {}) }}>
                                                        {v === 'table' ? 'Table View' : 'Chart View'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {financialsView === 'table' ? (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={styles.table}>
                                                    <thead><tr><th style={styles.th}>Metric</th>{financials.columns?.map((col, idx) => <th key={idx} style={styles.th}>{col}</th>)}</tr></thead>
                                                    <tbody>{financials.data?.map((row, idx) => (<tr key={idx}><td style={{ ...styles.td, fontWeight: '600' }}>{row.metric}</td>{row.values?.map((val, i) => <td key={i} style={styles.td}>{val && val !== 0 ? `${(val / 1e9).toFixed(2)}B` : 'N/A'}</td>)}</tr>))}</tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={prepareFinancialsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" /><YAxis domain={getFinancialChartDomain()} label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip formatter={v => `${v}B`} /><Legend />
                                                    {financials.data?.map((row, idx) => <Line key={idx} type="monotone" dataKey={row.metric} stroke={['#2563eb', '#10b981', '#f59e0b', '#ef4444'][idx % 4]} strokeWidth={2} />)}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'earnings' && earnings && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3>Quarterly Earnings</h3>
                                            <div style={styles.viewToggle}>
                                                {['table', 'chart'].map(v => (
                                                    <button key={v} onClick={() => setEarningsView(v)} style={{ ...styles.toggleButton, ...(earningsView === v ? styles.toggleButtonActive : {}) }}>
                                                        {v === 'table' ? 'Table View' : 'Chart View'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {earningsView === 'table' ? (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={styles.table}>
                                                    <thead><tr><th style={styles.th}>Quarter</th><th style={styles.th}>Revenue</th><th style={styles.th}>Earnings</th></tr></thead>
                                                    <tbody>{earnings.map((e, idx) => (<tr key={idx}><td style={styles.td}>{e.quarter}</td><td style={styles.td}>{e.revenue && e.revenue !== 0 ? `${(e.revenue / 1e9).toFixed(2)}B` : 'N/A'}</td><td style={styles.td}>{e.earnings && e.earnings !== 0 ? `${(e.earnings / 1e9).toFixed(2)}B` : 'N/A'}</td></tr>))}</tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={prepareEarningsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="quarter" /><YAxis domain={getChartDomain()} label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip formatter={v => v ? `${v}B` : 'N/A'} /><Legend />
                                                    <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                                                    <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {/* ── Enhanced News Tab ── */}
                                {activeTab === 'news' && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3 style={{ margin: 0 }}>Recent News</h3>
                                            <div style={{ fontSize: '13px', color: '#999', backgroundColor: '#f0f4ff', padding: '6px 12px', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                                                💡 Tip: Fetch Deep News for Marketaux analysis
                                            </div>
                                        </div>
                                        <EnhancedNewsSection
                                            ticker={ticker}
                                            baseUrl={baseUrl}
                                            existingNews={news}
                                            openaiKey={OPENAI_API_KEY}
                                            stockData={stockData}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {!stockData && !loading && (
                            <div style={styles.loading}>
                                Enter a stock ticker, browse stocks, or run AI analysis to get started
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sabrina AI Chatbot — always available */}
            <SabrinaChat
                stockData={stockData}
                financials={financials}
                earnings={earnings}
                news={news}
                ticker={ticker}
                openaiKey={OPENAI_API_KEY}
            />
        </div>
    );
}
