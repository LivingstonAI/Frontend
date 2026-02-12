import React, { useState, useEffect } from 'react';

export default function AIModelBuilder({ theme, styles, BACKEND_API_URL }) {
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [modelPrompt, setModelPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modelName, setModelName] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [showCodePreview, setShowCodePreview] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('build');
    const [assetSymbol, setAssetSymbol] = useState('');
    const [assetName, setAssetName] = useState('');
    const [timeframe, setTimeframe] = useState('1H');
    const [direction, setDirection] = useState('BUY');
    const [takeProfitPct, setTakeProfitPct] = useState('8');
    const [stopLossPct, setStopLossPct] = useState('4');
    const [positionSize, setPositionSize] = useState('1000');
    const [savedModels, setSavedModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);

    useEffect(() => { fetchOpenAIKey(); }, []);

    const fetchOpenAIKey = async () => {
        try {
            const r = await fetch(`${BACKEND_API_URL}/get_openai_key`);
            if (r.ok) { const { OPENAI_API_KEY } = await r.json(); setOpenaiApiKey(OPENAI_API_KEY); }
        } catch (e) { console.error(e); }
    };

    const fetchSavedModels = async () => {
        setLoadingModels(true);
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/snowai-list-trading-models/`);
            const d = await r.json();
            if (d.success) setSavedModels(d.models);
        } catch (e) { console.error(e); } finally { setLoadingModels(false); }
    };

    const showErr = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    const showOk  = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

    const generateModel = async () => {
        if (!modelPrompt.trim()) { showErr('Please describe the signal'); return; }
        if (!modelName.trim()) { showErr('Please enter a function name'); return; }
        setIsGenerating(true); setError(''); setSuccess('');
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'You are a Python quant analyst. Return ONLY raw Python code, no markdown. Function must accept a pandas DataFrame (open,high,low,close,volume,timestamp cols) and return a bool. No Django/Flask/HTTP. Only pandas/numpy/stdlib allowed.' },
                        { role: 'user', content: `Signal: ${modelPrompt}\nFunction name: ${modelName}\nContext: ${modelDescription || 'none'}\nReturn ONLY raw Python. Must accept DataFrame and return bool.` }
                    ],
                    temperature: 0.7, max_tokens: 2000
                })
            });
            if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
            const data = await res.json();
            let code = data.choices[0].message.content;
            code = code.replace(/```python\n?/g, '').replace(/```\n?/g, '').trim();
            setGeneratedCode(code);
            setShowCodePreview(true);
            showOk('Code generated!');
        } catch (e) { showErr(e.message); } finally { setIsGenerating(false); }
    };

    const saveModel = async () => {
        if (!generatedCode) { showErr('Generate code first'); return; }
        if (!assetSymbol.trim()) { showErr('Enter an asset symbol'); return; }
        setIsSaving(true);
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/snowai-save-trading-model/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: modelName, description: modelDescription, plain_english: modelPrompt,
                    function_name: modelName, code: generatedCode,
                    asset_symbol: assetSymbol.toUpperCase(), asset_name: assetName,
                    timeframe, direction,
                    take_profit_pct: parseFloat(takeProfitPct),
                    stop_loss_pct: parseFloat(stopLossPct),
                    position_size: parseFloat(positionSize),
                })
            });
            const d = await r.json();
            if (d.success) { showOk('Model saved!'); setActiveTab('models'); fetchSavedModels(); }
            else showErr(d.error);
        } catch (e) { showErr(e.message); } finally { setIsSaving(false); }
    };

    const toggleStatus = async (id, current) => {
        const next = current === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        await fetch(`${BACKEND_API_URL}/api/snowai-update-model-status/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model_id: id, status: next })
        });
        fetchSavedModels();
    };

    const deleteModel = async (id) => {
        if (!window.confirm('Delete model and all its trades?')) return;
        await fetch(`${BACKEND_API_URL}/api/snowai-delete-trading-model/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model_id: id })
        });
        fetchSavedModels();
    };

    const copyCode = () => { navigator.clipboard.writeText(generatedCode); showOk('Copied!'); };
    const downloadCode = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([generatedCode], { type: 'text/plain' }));
        a.download = `${modelName || 'signal'}.py`; a.click();
    };

    const statusColor = (s) => ({ ACTIVE: theme.accent.green, PAUSED: theme.accent.orange, DRAFT: theme.text.tertiary, ARCHIVED: theme.text.tertiary }[s] || theme.text.tertiary);
    const card = { background: theme.bg.elevated, borderRadius: '15px', padding: '28px', border: `1px solid ${theme.border.light}`, marginBottom: '20px' };
    const msgBase = { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontWeight: '600', fontSize: '0.9rem' };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[['build','🛠️ Build'], ['models','📋 My Models']].map(([id, label]) => (
                    <button key={id} onClick={() => { setActiveTab(id); if (id === 'models') fetchSavedModels(); }}
                        style={{ ...styles.modeButton, ...(activeTab === id ? styles.modeButtonActive : styles.modeButtonInactive), padding: '10px 24px', width: 'auto' }}>
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 'build' && (
                <>
                <div style={card}>
                    <h2 style={{ color: theme.text.primary, marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🤖 AI Signal Generator
                        <span style={{ fontSize: '0.7rem', background: theme.accent.purple, color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>BETA</span>
                    </h2>
                    <p style={{ color: theme.text.secondary, marginBottom: '20px' }}>
                        Describe a signal in plain English. The AI generates a Python function that takes an OHLC DataFrame and returns <code>True</code> or <code>False</code>. When deployed, the scheduler runs it every 5 minutes and opens positions automatically.
                    </p>
                    {error   && <div style={{ ...msgBase, background: `${theme.accent.red}15`,   border: `1px solid ${theme.accent.red}`,   color: theme.accent.red   }}>{error}</div>}
                    {success && <div style={{ ...msgBase, background: `${theme.accent.green}15`, border: `1px solid ${theme.accent.green}`, color: theme.accent.green }}>{success}</div>}

                    <div style={{ marginBottom: '14px' }}>
                        <label style={styles.label}>Function Name *</label>
                        <input value={modelName} onChange={e => setModelName(e.target.value)} placeholder="e.g. is_high_volume, is_bullish_engulfing" style={styles.input} disabled={isGenerating} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={styles.label}>Extra Context (optional)</label>
                        <input value={modelDescription} onChange={e => setModelDescription(e.target.value)} placeholder="e.g. use 14-period RSI, threshold at 70" style={styles.input} disabled={isGenerating} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Describe the Signal *</label>
                        <textarea value={modelPrompt} onChange={e => setModelPrompt(e.target.value)}
                            placeholder='e.g. "True if last 3 candles are all bullish and volume is increasing on each"'
                            style={{ ...styles.input, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }} disabled={isGenerating} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={generateModel} disabled={isGenerating}
                            style={{ ...styles.buttonPrimary, flex: 1, background: isGenerating ? theme.bg.tertiary : `linear-gradient(135deg,${theme.accent.purple},#6d28d9)`, opacity: isGenerating ? 0.6 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}>
                            {isGenerating ? '⏳ Generating...' : '🚀 Generate Signal Function'}
                        </button>
                        {generatedCode && <button onClick={() => { setGeneratedCode(''); setShowCodePreview(false); }} style={{ ...styles.buttonSecondary, flex: 0.28 }}>🔄 Reset</button>}
                    </div>
                </div>

                {showCodePreview && generatedCode && (
                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 style={{ color: theme.text.primary, margin: 0 }}>📝 Generated Code</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={copyCode}     style={{ ...styles.buttonSecondary, background: `linear-gradient(135deg,${theme.blue[500]},${theme.blue[600]})`, color: 'white', border: 'none' }}>📋 Copy</button>
                                <button onClick={downloadCode} style={{ ...styles.buttonSecondary, background: `linear-gradient(135deg,${theme.accent.green},#059669)`, color: 'white', border: 'none' }}>💾 .py</button>
                            </div>
                        </div>
                        <pre style={{ background: theme.bg.tertiary, padding: '16px', borderRadius: '10px', overflow: 'auto', maxHeight: '260px', color: theme.text.primary, fontSize: '0.87rem', lineHeight: '1.6', border: `1px solid ${theme.border.medium}`, marginBottom: '24px' }}>
                            <code>{generatedCode}</code>
                        </pre>

                        <h3 style={{ color: theme.text.primary, margin: '0 0 16px' }}>⚙️ Deploy Configuration</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                            <div>
                                <label style={styles.label}>Asset Symbol *</label>
                                <input value={assetSymbol} onChange={e => setAssetSymbol(e.target.value)} placeholder="e.g. AAPL, BTC-USD, EURUSD=X" style={styles.input} />
                            </div>
                            <div>
                                <label style={styles.label}>Asset Name</label>
                                <input value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. Apple Inc." style={styles.input} />
                            </div>
                            <div>
                                <label style={styles.label}>Timeframe</label>
                                <select value={timeframe} onChange={e => setTimeframe(e.target.value)} style={styles.input}>
                                    {['1M','5M','15M','1H','4H','1D','1W'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={styles.label}>Direction</label>
                                <select value={direction} onChange={e => setDirection(e.target.value)} style={styles.input}>
                                    <option value="BUY">BUY (Long)</option>
                                    <option value="SELL">SELL (Short)</option>
                                    <option value="BOTH">BOTH</option>
                                </select>
                            </div>
                            <div>
                                <label style={styles.label}>Take Profit %</label>
                                <input type="number" value={takeProfitPct} onChange={e => setTakeProfitPct(e.target.value)} style={styles.input} min="0" step="0.5" />
                            </div>
                            <div>
                                <label style={styles.label}>Stop Loss %</label>
                                <input type="number" value={stopLossPct} onChange={e => setStopLossPct(e.target.value)} style={styles.input} min="0" step="0.5" />
                            </div>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={styles.label}>Position Size (USD)</label>
                                <input type="number" value={positionSize} onChange={e => setPositionSize(e.target.value)} style={styles.input} min="1" />
                            </div>
                        </div>
                        <button onClick={saveModel} disabled={isSaving}
                            style={{ ...styles.buttonPrimary, width: '100%', background: isSaving ? theme.bg.tertiary : `linear-gradient(135deg,${theme.accent.green},#059669)`, opacity: isSaving ? 0.6 : 1 }}>
                            {isSaving ? '⏳ Saving...' : '💾 Save & Deploy Model'}
                        </button>
                    </div>
                )}
                </>
            )}

            {activeTab === 'models' && (
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: theme.text.primary, margin: 0 }}>📋 Saved Models</h3>
                        <button onClick={fetchSavedModels} style={{ ...styles.buttonSecondary, padding: '8px 16px' }}>🔄 Refresh</button>
                    </div>
                    {loadingModels ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: theme.text.tertiary }}>Loading...</div>
                    ) : savedModels.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: theme.text.tertiary }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🤖</div>
                            <p>No models yet. Build one in the Build tab!</p>
                        </div>
                    ) : savedModels.map(m => (
                        <div key={m.id} style={{ background: theme.bg.tertiary, borderRadius: '12px', padding: '18px', border: `1px solid ${theme.border.light}`, borderLeft: `5px solid ${statusColor(m.status)}`, marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', color: theme.text.primary }}>{m.name}</div>
                                    <div style={{ fontSize: '0.82rem', color: theme.text.tertiary, marginTop: '2px' }}>{m.asset_symbol} · {m.timeframe} · {m.direction} · <code>{m.function_name}(df)</code></div>
                                    {m.description && <div style={{ fontSize: '0.82rem', color: theme.text.secondary, marginTop: '3px' }}>{m.description}</div>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: statusColor(m.status), background: `${statusColor(m.status)}20`, padding: '3px 10px', borderRadius: '10px' }}>{m.status}</span>
                                    <button onClick={() => toggleStatus(m.id, m.status)}
                                        style={{ ...styles.buttonSecondary, padding: '6px 12px', fontSize: '0.8rem', background: m.status === 'ACTIVE' ? `${theme.accent.orange}20` : `${theme.accent.green}20`, border: `1px solid ${m.status === 'ACTIVE' ? theme.accent.orange : theme.accent.green}`, color: m.status === 'ACTIVE' ? theme.accent.orange : theme.accent.green }}>
                                        {m.status === 'ACTIVE' ? '⏸ Pause' : '▶ Activate'}
                                    </button>
                                    <button onClick={() => deleteModel(m.id)}
                                        style={{ ...styles.buttonSecondary, padding: '6px 10px', fontSize: '0.8rem', background: `${theme.accent.red}15`, border: `1px solid ${theme.accent.red}`, color: theme.accent.red }}>🗑</button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(90px,1fr))', gap: '8px' }}>
                                {[['TP',`${m.take_profit_pct}%`,theme.accent.green],['SL',`${m.stop_loss_pct}%`,theme.accent.red],['Size',`$${m.position_size}`,theme.blue[600]],['Trades',m.total_trades,theme.text.primary],['Open',m.open_trades,theme.blue[500]],['P&L',`${m.total_pnl>=0?'+':''}$${m.total_pnl}`,m.total_pnl>=0?theme.accent.green:theme.accent.red]].map(([lbl,val,col])=>(
                                    <div key={lbl} style={{ background: theme.bg.elevated, borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: theme.text.tertiary, textTransform: 'uppercase' }}>{lbl}</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: col }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                            {m.last_run_at && (
                                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: theme.text.tertiary }}>
                                    Last run: {new Date(m.last_run_at).toLocaleString()} · Signal: {m.last_signal === null ? '—' : m.last_signal ? '✅ TRUE' : '⬜ FALSE'}
                                    {m.error_log && <span style={{ color: theme.accent.red }}> · ⚠️ Error</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}