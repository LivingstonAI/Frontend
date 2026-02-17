import React, { useState, useEffect } from 'react';

export default function AIModelBuilder({ theme, styles, BACKEND_API_URL, onBacktestModel, onTimeframeSensitivity }) {
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [activeTab, setActiveTab] = useState('build');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Build tab
    const [modelPrompt, setModelPrompt] = useState('');
    const [modelDescription, setModelDescription] = useState('');
    const [modelName, setModelName] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCodePreview, setShowCodePreview] = useState(false);

    // Deploy config
    const [assetSymbol, setAssetSymbol] = useState('');
    const [assetName, setAssetName] = useState('');
    const [timeframe, setTimeframe] = useState('1H');
    const [direction, setDirection] = useState('BUY');
    const [takeProfitPct, setTakeProfitPct] = useState('8');
    const [stopLossPct, setStopLossPct] = useState('4');
    const [positionSize, setPositionSize] = useState('1000');
    const [isSaving, setIsSaving] = useState(false);

    // Models tab
    const [savedModels, setSavedModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);

    // Details view
    const [detailModel, setDetailModel] = useState(null);
    const [detailTrades, setDetailTrades] = useState([]);
    const [loadingTrades, setLoadingTrades] = useState(false);

    // Improve chat
    const [improvePrompt, setImprovePrompt] = useState('');
    const [improvedCode, setImprovedCode] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    const [isSavingImproved, setIsSavingImproved] = useState(false);
    const [editingCode, setEditingCode] = useState('');
    const [showEditRaw, setShowEditRaw] = useState(false);

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

    const fetchModelTrades = async (modelId) => {
        setLoadingTrades(true);
        try {
            const r = await fetch(`${BACKEND_API_URL}/api/snowai-get-model-trades/?model_id=${modelId}`);
            const d = await r.json();
            if (d.success) setDetailTrades(d.trades);
        } catch (e) { console.error(e); } finally { setLoadingTrades(false); }
    };

    const showErr = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    const showOk  = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

    const SYSTEM_PROMPT = `You are a Python quantitative analyst generating OHLC signal functions for a trading terminal.

STRICT RULES:
1. Return ONLY raw Python code — no markdown, no backticks, no prose
2. Function accepts a pandas DataFrame with columns: open, high, low, close, volume, timestamp
3. Must return a boolean (True/False)
4. Only use: pandas, numpy, or Python stdlib
5. Include a one-line docstring
6. Start directly with imports or def

REFERENCE FUNCTIONS — already available in the runtime. You may CALL these directly without redefining or importing them:

  is_stable_market(data, lookback_period=30) -> bool
    True if market MSS >= 47 (trending, low volatility, good conditions)

  is_high_trend_elasticity(data, lookback_period=30, threshold=0.50) -> bool
    True if average retracements are shallow (<50% of trend moves) — strong momentum

  get_mss_value(data, lookback_period=30) -> float
    Returns raw MSS score 0-100

  calculate_trend_elasticity(data, lookback_period=30) -> dict
    Returns: {elasticity, category, description, r_squared, consistency, slope_direction}

EXAMPLE using reference functions:
  def is_strong_uptrend_signal(df):
      """True if market is stable, elastic, and latest close is above 20-bar SMA."""
      if not is_stable_market(df) or not is_high_trend_elasticity(df):
          return False
      sma = df['close'].rolling(20).mean().iloc[-1]
      return float(df['close'].iloc[-1]) > float(sma)

NEVER include: @csrf_exempt, def view(request), JsonResponse, yf.Ticker, requests, Django, Flask`;

    const generateModel = async () => {
        if (!modelPrompt.trim()) { showErr('Describe the signal'); return; }
        if (!modelName.trim()) { showErr('Enter a function name'); return; }
        setIsGenerating(true); setError(''); setSuccess('');
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Signal: ${modelPrompt}\nFunction name: ${modelName}\nContext: ${modelDescription||'none'}\nReturn raw Python only.` }
                    ],
                    temperature: 0.7, max_tokens: 2000
                })
            });
            if (!res.ok) throw new Error(`OpenAI ${res.status}`);
            const data = await res.json();
            let code = data.choices[0].message.content.replace(/```python\n?/g,'').replace(/```\n?/g,'').trim();
            setGeneratedCode(code);
            setShowCodePreview(true);
            showOk('Code generated!');
        } catch (e) { showErr(e.message); } finally { setIsGenerating(false); }
    };

    const saveModel = async (code, name, overrideId) => {
        if (!code) { showErr('No code to save'); return; }
        if (!assetSymbol.trim() && !overrideId) { showErr('Enter an asset symbol'); return; }
        setIsSaving(true);
        try {
            const body = overrideId
                ? { model_id: overrideId, code, function_name: name }
                : { name, description: modelDescription, plain_english: modelPrompt, function_name: name, code,
                    asset_symbol: assetSymbol.toUpperCase(), asset_name: assetName, timeframe, direction,
                    take_profit_pct: parseFloat(takeProfitPct), stop_loss_pct: parseFloat(stopLossPct), position_size: parseFloat(positionSize) };
            const endpoint = overrideId ? `${BACKEND_API_URL}/api/snowai-update-model-code/` : `${BACKEND_API_URL}/api/snowai-save-trading-model/`;
            const r = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            const d = await r.json();
            if (d.success) { showOk('Model saved!'); if (!overrideId) { setActiveTab('models'); fetchSavedModels(); } else { fetchSavedModels(); setImprovedCode(''); setDetailModel(m => ({ ...m, code })); } }
            else showErr(d.error || 'Save failed');
        } catch (e) { showErr(e.message); } finally { setIsSaving(false); }
    };

    const improveModel = async () => {
        if (!improvePrompt.trim()) { showErr('Describe what to improve'); return; }
        const baseCode = improvedCode || detailModel?.code || '';
        if (!baseCode) { showErr('No code to improve'); return; }
        setIsImproving(true);
        try {
            const errorCtx = detailModel?.error_log
                ? `\n\nERROR LOG FROM LAST RUN (fix this too):\n${detailModel.error_log}`
                : '';
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiApiKey}` },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Improve this function:\n\n${baseCode}${errorCtx}\n\nRequested improvement: ${improvePrompt}\n\nReturn ONLY the improved raw Python. Keep function name and bool return.` }
                    ],
                    temperature: 0.5, max_tokens: 2000
                })
            });
            if (!res.ok) throw new Error(`OpenAI ${res.status}`);
            const data = await res.json();
            let code = data.choices[0].message.content.replace(/```python\n?/g,'').replace(/```\n?/g,'').trim();
            setImprovedCode(code);
            setEditingCode(code);
            showOk('Improved! Review below then save.');
        } catch(e) { showErr(e.message); } finally { setIsImproving(false); }
    };

    const toggleStatus = async (id, current) => {
        const next = current === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        await fetch(`${BACKEND_API_URL}/api/snowai-update-model-status/`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({model_id:id, status:next}) });
        fetchSavedModels();
        if (detailModel?.id === id) setDetailModel(m => ({ ...m, status: next }));
    };

    const deleteModel = async (id) => {
        if (!window.confirm('Delete model and all its trades?')) return;
        await fetch(`${BACKEND_API_URL}/api/snowai-delete-trading-model/`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({model_id:id}) });
        fetchSavedModels();
        if (detailModel?.id === id) { setDetailModel(null); setActiveTab('models'); }
    };

    const openDetails = (m) => { setDetailModel(m); setImprovedCode(''); setEditingCode(m.code||''); setImprovePrompt(''); setShowEditRaw(false); fetchModelTrades(m.id); setActiveTab('detail'); };

    const copyCode = (code) => { navigator.clipboard.writeText(code); showOk('Copied!'); };
    const statusColor = (s) => ({ ACTIVE: theme.accent.green, PAUSED: theme.accent.orange, DRAFT: theme.text.tertiary, ARCHIVED: theme.text.tertiary }[s] || theme.text.tertiary);

    const card = { background: theme.bg.elevated, borderRadius: '14px', padding: '24px', border: `1px solid ${theme.border.light}`, marginBottom: '18px' };
    const msg = (color) => ({ padding:'11px', borderRadius:'9px', marginBottom:'14px', fontWeight:'600', fontSize:'0.88rem', background:`${color}15`, border:`1px solid ${color}`, color });

    return (
        <div style={{ padding: '20px' }}>
            {/* Tabs */}
            <div style={{ display:'flex', gap:'10px', marginBottom:'22px', flexWrap:'wrap' }}>
                {[['build','🛠️ Build'],['models','📋 My Models'],...( detailModel ? [['detail', `🔍 ${detailModel.name}`]] : [])].map(([id,label]) => (
                    <button key={id} onClick={() => { setActiveTab(id); if (id==='models') fetchSavedModels(); }}
                        style={{ ...styles.modeButton, ...(activeTab===id ? styles.modeButtonActive : styles.modeButtonInactive), padding:'9px 20px', width:'auto' }}>
                        {label}
                    </button>
                ))}
            </div>

            {error   && <div style={msg(theme.accent.red)}>{error}</div>}
            {success && <div style={msg(theme.accent.green)}>{success}</div>}

            {/* ── BUILD ───────────────────────────────────────────────── */}
            {activeTab === 'build' && (
                <>
                <div style={card}>
                    <h2 style={{ color:theme.text.primary, marginTop:0, display:'flex', alignItems:'center', gap:'10px' }}>
                        🤖 AI Signal Generator
                        <span style={{ fontSize:'0.7rem', background:theme.accent.purple, color:'white', padding:'3px 10px', borderRadius:'20px', fontWeight:'700' }}>BETA</span>
                    </h2>
                    <p style={{ color:theme.text.secondary, marginBottom:'20px' }}>Describe a trading signal → get a Python function returning <code>True/False</code> on OHLC data. Deploy and the scheduler trades it automatically.</p>
                    <div style={{ marginBottom:'13px' }}>
                        <label style={styles.label}>Function Name *</label>
                        <input value={modelName} onChange={e=>setModelName(e.target.value)} placeholder="e.g. is_bullish_engulfing" style={styles.input} disabled={isGenerating} />
                    </div>
                    <div style={{ marginBottom:'13px' }}>
                        <label style={styles.label}>Extra Context (optional)</label>
                        <input value={modelDescription} onChange={e=>setModelDescription(e.target.value)} placeholder="e.g. use 14-period RSI" style={styles.input} disabled={isGenerating} />
                    </div>
                    <div style={{ marginBottom:'18px' }}>
                        <label style={styles.label}>Describe the Signal *</label>
                        <textarea value={modelPrompt} onChange={e=>setModelPrompt(e.target.value)} placeholder='e.g. "True if last 3 candles are bullish and volume is increasing"' style={{ ...styles.input, minHeight:'90px', resize:'vertical', fontFamily:'inherit' }} disabled={isGenerating} />
                    </div>
                    <div style={{ display:'flex', gap:'10px' }}>
                        <button onClick={generateModel} disabled={isGenerating} style={{ ...styles.buttonPrimary, flex:1, background:isGenerating?theme.bg.tertiary:`linear-gradient(135deg,${theme.accent.purple},#6d28d9)`, opacity:isGenerating?0.6:1, cursor:isGenerating?'not-allowed':'pointer' }}>
                            {isGenerating ? '⏳ Generating...' : '🚀 Generate'}
                        </button>
                        {generatedCode && <button onClick={()=>{setGeneratedCode('');setShowCodePreview(false);}} style={{ ...styles.buttonSecondary, flex:0.25 }}>🔄</button>}
                    </div>
                </div>

                {showCodePreview && generatedCode && (
                    <div style={card}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', gap:'10px', flexWrap:'wrap' }}>
                            <h3 style={{ color:theme.text.primary, margin:0 }}>📝 Generated Code</h3>
                            <button onClick={()=>copyCode(generatedCode)} style={{ ...styles.buttonSecondary, background:`linear-gradient(135deg,${theme.blue[500]},${theme.blue[600]})`, color:'white', border:'none' }}>📋 Copy</button>
                        </div>
                        <pre style={{ background:theme.bg.tertiary, padding:'14px', borderRadius:'9px', overflow:'auto', maxHeight:'240px', color:theme.text.primary, fontSize:'0.85rem', lineHeight:'1.6', border:`1px solid ${theme.border.medium}`, marginBottom:'16px' }}><code>{generatedCode}</code></pre>

                        {/* ── Quick backtest / TF test ──────────────────────── */}
                        {(onBacktestModel || onTimeframeSensitivity) && (
                            <div style={{ background:theme.bg.tertiary, borderRadius:'12px', padding:'16px', marginBottom:'20px', border:`1px solid ${theme.border.light}` }}>
                                <div style={{ fontSize:'0.78rem', fontWeight:'700', color:theme.text.tertiary, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'12px' }}>
                                    ⚡ Quick Test — run on chart without saving
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px', gap:'10px', marginBottom:'12px' }}>
                                    <div>
                                        <label style={styles.label}>Asset (leave blank = current chart)</label>
                                        <input value={assetSymbol} onChange={e=>setAssetSymbol(e.target.value)}
                                            placeholder="e.g. AAPL, BTCUSD"
                                            style={{ ...styles.input, marginBottom:0 }} />
                                    </div>
                                    <div>
                                        <label style={styles.label}>TP %</label>
                                        <input type="number" value={takeProfitPct} onChange={e=>setTakeProfitPct(e.target.value)}
                                            min="0" step="0.5" style={{ ...styles.input, marginBottom:0 }} />
                                    </div>
                                    <div>
                                        <label style={styles.label}>SL %</label>
                                        <input type="number" value={stopLossPct} onChange={e=>setStopLossPct(e.target.value)}
                                            min="0" step="0.5" style={{ ...styles.input, marginBottom:0 }} />
                                    </div>
                                </div>
                                <div style={{ display:'flex', gap:'10px' }}>
                                    {onBacktestModel && (
                                        <button onClick={() => onBacktestModel({
                                            code: generatedCode, modelName, asset: assetSymbol || null,
                                            tp: parseFloat(takeProfitPct) || 8, sl: parseFloat(stopLossPct) || 4,
                                        })} style={{ ...styles.buttonPrimary, flex:1,
                                            background:`linear-gradient(135deg,${theme.accent.cyan},#0891b2)` }}>
                                            ▶ Backtest on Chart
                                        </button>
                                    )}
                                    {onTimeframeSensitivity && (
                                        <button onClick={() => onTimeframeSensitivity({
                                            code: generatedCode, modelName, asset: assetSymbol || null,
                                            tp: parseFloat(takeProfitPct) || 8, sl: parseFloat(stopLossPct) || 4,
                                        })} style={{ ...styles.buttonPrimary, flex:1,
                                            background:`linear-gradient(135deg,${theme.accent.purple},#6d28d9)` }}>
                                            ⏱ Timeframe Sensitivity
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <h3 style={{ color:theme.text.primary, margin:'0 0 14px' }}>⚙️ Deploy Config</h3>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'11px', marginBottom:'16px' }}>
                            <div><label style={styles.label}>Asset Symbol *</label><input value={assetSymbol} onChange={e=>setAssetSymbol(e.target.value)} placeholder="AAPL / BTC-USD" style={styles.input} /></div>
                            <div><label style={styles.label}>Asset Name</label><input value={assetName} onChange={e=>setAssetName(e.target.value)} placeholder="Apple Inc." style={styles.input} /></div>
                            <div><label style={styles.label}>Timeframe</label><select value={timeframe} onChange={e=>setTimeframe(e.target.value)} style={styles.input}>{['1M','5M','15M','1H','4H','1D','1W'].map(t=><option key={t}>{t}</option>)}</select></div>
                            <div><label style={styles.label}>Direction</label><select value={direction} onChange={e=>setDirection(e.target.value)} style={styles.input}><option value="BUY">BUY (Long)</option><option value="SELL">SELL (Short)</option><option value="BOTH">BOTH</option></select></div>
                            <div><label style={styles.label}>Take Profit %</label><input type="number" value={takeProfitPct} onChange={e=>setTakeProfitPct(e.target.value)} style={styles.input} min="0" step="0.5" /></div>
                            <div><label style={styles.label}>Stop Loss %</label><input type="number" value={stopLossPct} onChange={e=>setStopLossPct(e.target.value)} style={styles.input} min="0" step="0.5" /></div>
                            <div style={{ gridColumn:'1/-1' }}><label style={styles.label}>Position Size (USD)</label><input type="number" value={positionSize} onChange={e=>setPositionSize(e.target.value)} style={styles.input} min="1" /></div>
                        </div>
                        <button onClick={()=>saveModel(generatedCode, modelName)} disabled={isSaving} style={{ ...styles.buttonPrimary, width:'100%', background:isSaving?theme.bg.tertiary:`linear-gradient(135deg,${theme.accent.green},#059669)`, opacity:isSaving?0.6:1 }}>
                            {isSaving ? '⏳ Saving...' : '💾 Save & Deploy Model'}
                        </button>
                    </div>
                )}
                </>
            )}

            {/* ── MY MODELS ───────────────────────────────────────────── */}
            {activeTab === 'models' && (
                <div style={card}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
                        <h3 style={{ color:theme.text.primary, margin:0 }}>📋 Saved Models</h3>
                        <button onClick={fetchSavedModels} style={{ ...styles.buttonSecondary, padding:'7px 14px' }}>🔄 Refresh</button>
                    </div>
                    {loadingModels ? <div style={{ textAlign:'center', padding:'40px', color:theme.text.tertiary }}>Loading...</div>
                    : savedModels.length === 0 ? <div style={{ textAlign:'center', padding:'40px', color:theme.text.tertiary }}><div style={{ fontSize:'3rem', marginBottom:'10px' }}>🤖</div><p>No models yet.</p></div>
                    : savedModels.map(m => (
                        <div key={m.id} style={{ background:theme.bg.tertiary, borderRadius:'11px', padding:'16px', border:`1px solid ${theme.border.light}`, borderLeft:`5px solid ${statusColor(m.status)}`, marginBottom:'12px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', marginBottom:'10px' }}>
                                <div>
                                    <div style={{ fontWeight:'700', color:theme.text.primary }}>{m.name}</div>
                                    <div style={{ fontSize:'0.81rem', color:theme.text.tertiary, marginTop:'2px' }}>{m.asset_symbol} · {m.timeframe} · {m.direction} · <code>{m.function_name}(df)</code></div>
                                    {m.error_log && <div style={{ fontSize:'0.78rem', color:theme.accent.red, marginTop:'3px' }}>⚠️ Has errors — view details to fix</div>}
                                </div>
                                <div style={{ display:'flex', gap:'7px', alignItems:'center', flexShrink:0 }}>
                                    <span style={{ fontSize:'0.77rem', fontWeight:'700', color:statusColor(m.status), background:`${statusColor(m.status)}20`, padding:'2px 9px', borderRadius:'10px' }}>{m.status}</span>
                                    <button onClick={()=>openDetails(m)} style={{ ...styles.buttonSecondary, padding:'6px 12px', fontSize:'0.8rem' }}>🔍 Details</button>
                                    <button onClick={()=>toggleStatus(m.id,m.status)} style={{ ...styles.buttonSecondary, padding:'6px 11px', fontSize:'0.8rem', background:m.status==='ACTIVE'?`${theme.accent.orange}20`:`${theme.accent.green}20`, border:`1px solid ${m.status==='ACTIVE'?theme.accent.orange:theme.accent.green}`, color:m.status==='ACTIVE'?theme.accent.orange:theme.accent.green }}>
                                        {m.status==='ACTIVE'?'⏸':'▶'}
                                    </button>
                                    <button onClick={()=>deleteModel(m.id)} style={{ ...styles.buttonSecondary, padding:'6px 10px', fontSize:'0.8rem', background:`${theme.accent.red}12`, border:`1px solid ${theme.accent.red}`, color:theme.accent.red }}>🗑</button>
                                </div>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(85px,1fr))', gap:'7px' }}>
                                {[['TP',`${m.take_profit_pct}%`,theme.accent.green],['SL',`${m.stop_loss_pct}%`,theme.accent.red],['$',`$${m.position_size}`,theme.blue[600]],['Trades',m.total_trades,theme.text.primary],['Open',m.open_trades,theme.blue[500]],['P&L',`${m.total_pnl>=0?'+':''}$${m.total_pnl}`,m.total_pnl>=0?theme.accent.green:theme.accent.red]].map(([l,v,c])=>(
                                    <div key={l} style={{ background:theme.bg.elevated, borderRadius:'7px', padding:'7px 9px', textAlign:'center' }}>
                                        <div style={{ fontSize:'0.68rem', color:theme.text.tertiary, textTransform:'uppercase' }}>{l}</div>
                                        <div style={{ fontSize:'0.92rem', fontWeight:'700', color:c }}>{v}</div>
                                    </div>
                                ))}
                            </div>
                            {m.last_run_at && <div style={{ marginTop:'8px', fontSize:'0.77rem', color:theme.text.tertiary }}>Last run: {new Date(m.last_run_at).toLocaleString()} · {m.last_signal===null?'—':m.last_signal?'✅ TRUE':'⬜ FALSE'}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* ── DETAIL VIEW ─────────────────────────────────────────── */}
            {activeTab === 'detail' && detailModel && (
                <>
                {/* Header info */}
                <div style={card}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px', marginBottom:'18px' }}>
                        <div>
                            <h2 style={{ color:theme.text.primary, margin:'0 0 4px' }}>{detailModel.name}</h2>
                            <div style={{ fontSize:'0.85rem', color:theme.text.tertiary }}>{detailModel.asset_symbol} · {detailModel.timeframe} · {detailModel.direction} · <code>{detailModel.function_name}(df)</code></div>
                            {detailModel.description && <div style={{ fontSize:'0.85rem', color:theme.text.secondary, marginTop:'5px' }}>{detailModel.description}</div>}
                        </div>
                        <div style={{ display:'flex', gap:'8px' }}>
                            <span style={{ fontSize:'0.8rem', fontWeight:'700', color:statusColor(detailModel.status), background:`${statusColor(detailModel.status)}20`, padding:'4px 12px', borderRadius:'12px' }}>{detailModel.status}</span>
                            <button onClick={()=>toggleStatus(detailModel.id,detailModel.status)} style={{ ...styles.buttonSecondary, padding:'6px 12px', fontSize:'0.82rem', background:detailModel.status==='ACTIVE'?`${theme.accent.orange}18`:`${theme.accent.green}18`, border:`1px solid ${detailModel.status==='ACTIVE'?theme.accent.orange:theme.accent.green}`, color:detailModel.status==='ACTIVE'?theme.accent.orange:theme.accent.green }}>
                                {detailModel.status==='ACTIVE'?'⏸ Pause':'▶ Activate'}
                            </button>
                        </div>
                    </div>

                    {/* Config grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'10px', marginBottom: detailModel.error_log ? '18px' : '0' }}>
                        {[['Take Profit',`${detailModel.take_profit_pct}%`,theme.accent.green],['Stop Loss',`${detailModel.stop_loss_pct}%`,theme.accent.red],['Pos. Size',`$${detailModel.position_size}`,theme.blue[600]],['Total Trades',detailModel.total_trades,theme.text.primary],['Open',detailModel.open_trades,theme.blue[500]],['Total P&L',`${detailModel.total_pnl>=0?'+':''}$${detailModel.total_pnl}`,detailModel.total_pnl>=0?theme.accent.green:theme.accent.red]].map(([l,v,c])=>(
                            <div key={l} style={{ background:theme.bg.tertiary, borderRadius:'9px', padding:'10px 13px' }}>
                                <div style={{ fontSize:'0.73rem', color:theme.text.tertiary, textTransform:'uppercase', marginBottom:'3px' }}>{l}</div>
                                <div style={{ fontSize:'1.05rem', fontWeight:'700', color:c }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {/* Error log — always shown */}
                    <div style={{ marginTop:'16px' }}>
                        {detailModel.error_log ? (
                            <div style={{ background:`${theme.accent.red}10`, border:`1px solid ${theme.accent.red}`, borderRadius:'10px', padding:'14px' }}>
                                <div style={{ fontWeight:'700', color:theme.accent.red, marginBottom:'6px' }}>⚠️ Last Error Log</div>
                                <pre style={{ margin:0, fontSize:'0.78rem', color:theme.accent.red, overflow:'auto', maxHeight:'150px', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{detailModel.error_log}</pre>
                                <div style={{ fontSize:'0.8rem', color:theme.text.secondary, marginTop:'8px' }}>Use the AI Improve tool below → type "fix the error above".</div>
                            </div>
                        ) : (
                            <div style={{ background:`${theme.accent.green}10`, border:`1px solid ${theme.accent.green}`, borderRadius:'10px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'10px' }}>
                                <span style={{ fontSize:'1.2rem' }}>✅</span>
                                <span style={{ color:theme.accent.green, fontWeight:'600', fontSize:'0.88rem' }}>No errors found — last run completed cleanly.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Current code */}
                <div style={card}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', gap:'10px', flexWrap:'wrap' }}>
                        <h3 style={{ color:theme.text.primary, margin:0 }}>📝 Current Code</h3>
                        <div style={{ display:'flex', gap:'8px' }}>
                            <button onClick={()=>copyCode(detailModel.code)} style={{ ...styles.buttonSecondary, fontSize:'0.82rem' }}>📋 Copy</button>
                            <button onClick={()=>setShowEditRaw(!showEditRaw)} style={{ ...styles.buttonSecondary, fontSize:'0.82rem' }}>✏️ {showEditRaw?'Hide':'Edit Raw'}</button>
                        </div>
                    </div>
                    <pre style={{ background:theme.bg.tertiary, padding:'14px', borderRadius:'9px', overflow:'auto', maxHeight:'260px', color:theme.text.primary, fontSize:'0.85rem', lineHeight:'1.6', border:`1px solid ${theme.border.medium}`, margin:0 }}><code>{detailModel.code}</code></pre>

                    {showEditRaw && (
                        <div style={{ marginTop:'14px' }}>
                            <label style={styles.label}>Edit Code Directly</label>
                            <textarea value={editingCode} onChange={e=>setEditingCode(e.target.value)} style={{ ...styles.input, minHeight:'200px', fontFamily:'monospace', fontSize:'0.84rem', resize:'vertical' }} />
                            <button onClick={()=>saveModel(editingCode, detailModel.function_name, detailModel.id)} disabled={isSaving}
                                style={{ ...styles.buttonPrimary, marginTop:'10px', background:`linear-gradient(135deg,${theme.accent.green},#059669)`, opacity:isSaving?0.6:1 }}>
                                {isSaving?'⏳ Saving...':'💾 Save Raw Edit'}
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Improve */}
                <div style={card}>
                    <h3 style={{ color:theme.text.primary, marginTop:0 }}>🤖 Improve with AI</h3>
                    <p style={{ color:theme.text.secondary, marginBottom:'16px', fontSize:'0.88rem' }}>
                        Describe what you want to change or fix. The AI will rewrite the function while keeping the same signature. If there are errors above, just ask it to fix them.
                    </p>
                    <div style={{ marginBottom:'13px' }}>
                        <label style={styles.label}>What to improve?</label>
                        <textarea value={improvePrompt} onChange={e=>setImprovePrompt(e.target.value)}
                            placeholder='e.g. "Fix the error in the log above" or "Make it use MACD crossover instead of just volume" or "Add a minimum RSI filter of 40"'
                            style={{ ...styles.input, minHeight:'85px', resize:'vertical', fontFamily:'inherit' }} disabled={isImproving} />
                    </div>
                    <button onClick={improveModel} disabled={isImproving} style={{ ...styles.buttonPrimary, background:isImproving?theme.bg.tertiary:`linear-gradient(135deg,${theme.accent.purple},#6d28d9)`, opacity:isImproving?0.6:1, cursor:isImproving?'not-allowed':'pointer' }}>
                        {isImproving?'⏳ Improving...':'✨ Improve Code'}
                    </button>

                    {improvedCode && (
                        <div style={{ marginTop:'18px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px', gap:'10px', flexWrap:'wrap' }}>
                                <div style={{ fontWeight:'600', color:theme.accent.cyan }}>✅ Improved Version</div>
                                <button onClick={()=>copyCode(improvedCode)} style={{ ...styles.buttonSecondary, fontSize:'0.82rem' }}>📋 Copy</button>
                            </div>
                            <pre style={{ background:theme.bg.tertiary, padding:'14px', borderRadius:'9px', overflow:'auto', maxHeight:'260px', color:theme.text.primary, fontSize:'0.85rem', lineHeight:'1.6', border:`1px solid ${theme.accent.cyan}`, marginBottom:'12px' }}><code>{improvedCode}</code></pre>
                            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                                <button onClick={()=>saveModel(improvedCode, detailModel.function_name, detailModel.id)} disabled={isSavingImproved}
                                    style={{ ...styles.buttonPrimary, flex:1, background:`linear-gradient(135deg,${theme.accent.green},#059669)`, opacity:isSavingImproved?0.6:1 }}>
                                    {isSavingImproved?'⏳ Saving...':'💾 Replace Code with Improved Version'}
                                </button>
                                {onBacktestModel && (
                                    <button onClick={() => onBacktestModel({
                                        code: improvedCode, modelName: detailModel.function_name,
                                        asset: detailModel.asset_symbol || null,
                                        tp: detailModel.take_profit_pct || 8, sl: detailModel.stop_loss_pct || 4,
                                    })} style={{ ...styles.buttonPrimary, flex:1, background:`linear-gradient(135deg,${theme.accent.cyan},#0891b2)` }}>
                                        ▶ Backtest Improved
                                    </button>
                                )}
                                <button onClick={()=>setImprovedCode('')} style={{ ...styles.buttonSecondary, flex:0.3 }}>Discard</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trade history */}
                <div style={card}>
                    <h3 style={{ color:theme.text.primary, marginTop:0 }}>📊 Trade History ({detailTrades.length})</h3>
                    {loadingTrades ? <div style={{ textAlign:'center', padding:'20px', color:theme.text.tertiary }}>Loading...</div>
                    : detailTrades.length === 0 ? <div style={{ textAlign:'center', padding:'20px', color:theme.text.tertiary }}>No trades yet — activate the model to start trading.</div>
                    : <div style={{ maxHeight:'400px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px' }}>
                        {detailTrades.map(t => {
                            const isOpen = t.outcome === 'OPEN';
                            const pl = t.profit_loss;
                            const borderCol = isOpen ? theme.blue[400] : pl > 0 ? theme.accent.green : theme.accent.red;
                            return (
                                <div key={t.id} style={{ background:theme.bg.tertiary, borderRadius:'10px', padding:'14px', borderLeft:`4px solid ${borderCol}` }}>
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                                        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                                            <span style={{ fontSize:'0.8rem', fontWeight:'700', background:t.order_type==='BUY'?`${theme.accent.green}25`:`${theme.accent.red}25`, color:t.order_type==='BUY'?theme.accent.green:theme.accent.red, padding:'2px 8px', borderRadius:'8px' }}>{t.order_type}</span>
                                            <span style={{ fontSize:'0.8rem', fontWeight:'700', color:isOpen?theme.blue[500]:borderCol, background:`${borderCol}15`, padding:'2px 8px', borderRadius:'8px' }}>{t.outcome}</span>
                                        </div>
                                        <div style={{ fontSize:'0.8rem', color:theme.text.tertiary }}>{new Date(t.entry_timestamp).toLocaleString()}</div>
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'8px', fontSize:'0.85rem' }}>
                                        <div><span style={{ color:theme.text.tertiary }}>Entry: </span><strong style={{ color:theme.text.primary }}>${parseFloat(t.entry_price).toFixed(4)}</strong></div>
                                        {t.exit_price && <div><span style={{ color:theme.text.tertiary }}>Exit: </span><strong style={{ color:theme.text.primary }}>${parseFloat(t.exit_price).toFixed(4)}</strong></div>}
                                        <div><span style={{ color:theme.text.tertiary }}>TP: </span><strong style={{ color:theme.accent.green }}>${parseFloat(t.take_profit_price).toFixed(4)}</strong></div>
                                        <div><span style={{ color:theme.text.tertiary }}>SL: </span><strong style={{ color:theme.accent.red }}>${parseFloat(t.stop_loss_price).toFixed(4)}</strong></div>
                                        {pl !== null && <div><span style={{ color:theme.text.tertiary }}>P&L: </span><strong style={{ color:pl>=0?theme.accent.green:theme.accent.red }}>{pl>=0?'+':''}${parseFloat(pl).toFixed(2)}</strong></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>}
                </div>
                </>
            )}
        </div>
    );
}
