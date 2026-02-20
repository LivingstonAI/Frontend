import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// ─── Stock Trend Quality Analyzer ────────────────────────────────────────────

const STOCK_LIST = [
    "AAPL","MSFT","GOOGL","AMZN","NVDA","TSLA","META","AMD","INTC","ORCL",
    "CSCO","ADBE","CRM","AVGO","QCOM","TXN","MU","IBM","NOW","INTU","WDAY",
    "PANW","CRWD","ZS","DDOG","NET","SNOW","PLTR","TEAM","FTNT","V","MA",
    "PYPL","JPM","BAC","WFC","GS","MS","BLK","XOM","CVX","COP","JNJ","LLY",
    "UNH","PFE","ABBV","MRK","AMGN","GILD","HD","MCD","NKE","SBUX","COST",
    "WMT","PG","KO","PEP","PM","NFLX","DIS","T","VZ","CMCSA","NEE","DUK",
    "SLB","HAL","LMT","RTX","BA","HON","CAT","GE","UPS","DE","MMM",
    "BABA","JD","PDD","BIDU","NIO","TSM","ASML","SAP",
];

const GRADE_CONFIG = {
    "A+": { color: "#00C896", bg: "rgba(0,200,150,0.12)", label: "Elite Trend Quality" },
    "A":  { color: "#22D3EE", bg: "rgba(34,211,238,0.12)", label: "Excellent Trend Quality" },
    "B+": { color: "#818CF8", bg: "rgba(129,140,248,0.12)", label: "Strong Trend Quality" },
    "B":  { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Good Trend Quality" },
    "C+": { color: "#FCD34D", bg: "rgba(252,211,77,0.12)", label: "Moderate Trend Quality" },
    "C":  { color: "#FB923C", bg: "rgba(251,146,60,0.12)", label: "Weak Trend Quality" },
    "D":  { color: "#F87171", bg: "rgba(248,113,113,0.12)", label: "Poor Trend Quality" },
};

function getGrade(score) {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C+";
    if (score >= 40) return "C";
    return "D";
}

function ScoreBar({ label, value, color }) {
    return (
        <div style={barStyles.wrapper}>
            <div style={barStyles.labelRow}>
                <span style={barStyles.label}>{label}</span>
                <span style={{ ...barStyles.value, color }}>{value.toFixed(1)}%</span>
            </div>
            <div style={barStyles.track}>
                <div style={{
                    ...barStyles.fill,
                    width: `${Math.min(value, 100)}%`,
                    background: color,
                }} />
            </div>
        </div>
    );
}

const barStyles = {
    wrapper: { marginBottom: "12px" },
    labelRow: { display: "flex", justifyContent: "space-between", marginBottom: "5px" },
    label: { fontSize: "12px", color: "#94A3B8" },
    value: { fontSize: "12px", fontWeight: "700", fontFamily: "'DM Mono', monospace" },
    track: { height: "6px", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" },
    fill: { height: "100%", borderRadius: "3px", transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" },
};

function StockTrendModal() {
    const [open, setOpen] = useState(false);
    const [symbol, setSymbol] = useState("");
    const [customSymbol, setCustomSymbol] = useState("");
    const [period, setPeriod] = useState("6mo");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const baseUrl = "https://backend-production-c0ab.up.railway.app";

    const analyze = async () => {
        const ticker = customSymbol.trim().toUpperCase() || symbol;
        if (!ticker) { setError("Please select or type a stock symbol."); return; }
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/ideas_hub_analyze_stock_trend_quality`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: ticker, period }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to analyze");
            }
            const data = await res.json();
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const grade = result ? getGrade(result.overall_score) : null;
    const gradeConf = grade ? GRADE_CONFIG[grade] : null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                @keyframes tqa-spin { to { transform: rotate(360deg); } }
                @keyframes tqa-fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                .tqa-trigger-btn:hover { opacity: 0.85; transform: translateY(-1px); }
                .tqa-analyze-btn:hover:not(:disabled) { opacity: 0.88; }
                .tqa-analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .tqa-close-btn:hover { background: rgba(255,255,255,0.1) !important; color: #CBD5E1 !important; }
                @media (max-width: 480px) {
                    .tqa-controls-grid { grid-template-columns: 1fr !important; }
                    .tqa-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
                    .tqa-score-flex { flex-direction: column !important; align-items: flex-start !important; gap: 12px; }
                }
            `}</style>

            {/* ── Trigger Button ── */}
            <button className="tqa-trigger-btn btn" onClick={() => setOpen(true)} style={tqaStyles.triggerBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: "7px", flexShrink: 0 }}>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trend Analyzer
            </button>

            {/* ── Modal Overlay ── */}
            {open && (
                <div style={tqaStyles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div style={tqaStyles.modal}>

                        {/* Modal Header */}
                        <div style={tqaStyles.modalHeader}>
                            <div>
                                <p style={tqaStyles.modalTitle}>Trend Quality Analyzer</p>
                                <p style={tqaStyles.modalSubtitle}>How well does a stock hold its trend?</p>
                            </div>
                            <button className="tqa-close-btn" style={tqaStyles.closeBtn} onClick={() => setOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="tqa-controls-grid" style={tqaStyles.controls}>
                            <div style={tqaStyles.controlGroup}>
                                <label style={tqaStyles.ctrlLabel}>Select Stock</label>
                                <select
                                    style={tqaStyles.selectStyle}
                                    value={symbol}
                                    onChange={e => { setSymbol(e.target.value); setCustomSymbol(""); }}
                                >
                                    <option value="">-- Choose from list --</option>
                                    {STOCK_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div style={tqaStyles.controlGroup}>
                                <label style={tqaStyles.ctrlLabel}>Or Type Symbol</label>
                                <input
                                    style={tqaStyles.inputStyle}
                                    placeholder="e.g. MSFT, BABA..."
                                    value={customSymbol}
                                    onChange={e => { setCustomSymbol(e.target.value.toUpperCase()); setSymbol(""); }}
                                />
                            </div>
                            <div style={tqaStyles.controlGroup}>
                                <label style={tqaStyles.ctrlLabel}>Time Period</label>
                                <select style={tqaStyles.selectStyle} value={period} onChange={e => setPeriod(e.target.value)}>
                                    <option value="3mo">3 Months</option>
                                    <option value="6mo">6 Months</option>
                                    <option value="1y">1 Year</option>
                                    <option value="2y">2 Years</option>
                                </select>
                            </div>
                            <button className="tqa-analyze-btn" style={tqaStyles.analyzeBtn} onClick={analyze} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: "tqa-spin 1s linear infinite" }}>
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                        </svg>
                                        Analyzing...
                                    </span>
                                ) : "Analyze →"}
                            </button>
                        </div>

                        {error && <div style={tqaStyles.errorBox}>{error}</div>}

                        {/* Results */}
                        {result && gradeConf && (
                            <div style={tqaStyles.results}>
                                {/* Score Hero Card */}
                                <div style={{ ...tqaStyles.scoreCard, background: gradeConf.bg, borderColor: gradeConf.color + "40" }}>
                                    <div className="tqa-score-flex" style={tqaStyles.scoreFlex}>
                                        <div>
                                            <p style={{ ...tqaStyles.gradeText, color: gradeConf.color }}>{grade}</p>
                                            <p style={tqaStyles.gradeLabel}>{gradeConf.label}</p>
                                        </div>
                                        <div style={tqaStyles.scoreCircle(gradeConf.color)}>
                                            <span style={{ ...tqaStyles.scoreNum, color: gradeConf.color }}>{result.overall_score.toFixed(0)}</span>
                                            <span style={tqaStyles.scoreMax}>/100</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        <span style={{
                                            ...tqaStyles.dirBadge,
                                            background: result.direction === "Bullish" ? "rgba(0,200,150,0.2)" : "rgba(248,113,113,0.2)",
                                            color: result.direction === "Bullish" ? "#00C896" : "#F87171"
                                        }}>
                                            {result.direction === "Bullish" ? "▲" : "▼"} {result.direction} Trend
                                        </span>
                                        <span style={tqaStyles.tickerBadge}>{result.symbol} · {result.period}</span>
                                    </div>
                                </div>

                                {/* Sub-metric bars */}
                                <div style={tqaStyles.metricsSection}>
                                    <p style={tqaStyles.metricsSectionTitle}>Breakdown</p>
                                    <ScoreBar label="Trend Consistency (R²)" value={result.r2_score * 100} color="#22D3EE" />
                                    <ScoreBar label="Trend Strength (ADX)" value={result.adx_score} color="#818CF8" />
                                    <ScoreBar label="Low Volatility Score" value={result.low_volatility_score} color="#34D399" />
                                    <ScoreBar label="Drawdown Recovery" value={result.drawdown_score} color="#FCD34D" />
                                    <ScoreBar label="Momentum Persistence" value={result.momentum_score} color="#F472B6" />
                                </div>

                                {/* Insight */}
                                <div style={tqaStyles.insightBox}>
                                    <p style={tqaStyles.insightTitle}>📊 Interpretation</p>
                                    <p style={tqaStyles.insightText}>{result.insight}</p>
                                </div>

                                {/* Stats row */}
                                <div className="tqa-stats-row" style={tqaStyles.statsRow}>
                                    {[
                                        { label: "Period Return", value: `${result.period_return > 0 ? "+" : ""}${result.period_return.toFixed(2)}%`, color: result.period_return >= 0 ? "#00C896" : "#F87171" },
                                        { label: "Avg Daily Vol", value: `${result.avg_daily_volatility.toFixed(2)}%`, color: "#94A3B8" },
                                        { label: "Max Drawdown", value: `${result.max_drawdown.toFixed(2)}%`, color: "#FB923C" },
                                        { label: "Trend Days", value: result.data_points, color: "#818CF8" },
                                    ].map(s => (
                                        <div key={s.label} style={tqaStyles.statCell}>
                                            <span style={{ ...tqaStyles.statValue, color: s.color }}>{s.value}</span>
                                            <span style={tqaStyles.statLabel}>{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

const tqaStyles = {
    triggerBtn: {
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        color: "#22D3EE",
        border: "1px solid rgba(34,211,238,0.3)",
        padding: "0.55rem 1.1rem",
        borderRadius: "6px",
        fontWeight: "600",
        fontSize: "13px",
        cursor: "pointer",
        boxShadow: "0 0 16px rgba(34,211,238,0.1)",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
    },
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "16px",
    },
    modal: {
        background: "linear-gradient(160deg, #0F172A 0%, #111827 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        width: "100%", maxWidth: "560px",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        animation: "tqa-fadeUp 0.35s cubic-bezier(0.34,1.2,0.64,1)",
    },
    modalHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "22px 22px 0",
    },
    modalTitle: {
        fontSize: "18px", fontWeight: "700", color: "#F1F5F9", margin: 0,
        letterSpacing: "-0.3px",
    },
    modalSubtitle: {
        fontSize: "12px", color: "#64748B", margin: "4px 0 0",
    },
    closeBtn: {
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        color: "#64748B", borderRadius: "8px", padding: "6px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s ease",
    },
    controls: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        padding: "18px 22px",
    },
    controlGroup: { display: "flex", flexDirection: "column", gap: "5px" },
    ctrlLabel: { fontSize: "10px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px" },
    selectStyle: {
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px", padding: "8px 10px", color: "#CBD5E1",
        fontSize: "13px", cursor: "pointer", width: "100%",
    },
    inputStyle: {
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px", padding: "8px 10px", color: "#CBD5E1",
        fontSize: "13px", width: "100%", outline: "none",
        boxSizing: "border-box",
    },
    analyzeBtn: {
        gridColumn: "1 / -1",
        background: "linear-gradient(135deg, #22D3EE, #818CF8)",
        border: "none", borderRadius: "10px", padding: "11px",
        color: "#0F172A", fontWeight: "700", fontSize: "14px",
        cursor: "pointer", transition: "opacity 0.2s",
        letterSpacing: "0.3px",
    },
    errorBox: {
        margin: "0 22px 14px", background: "rgba(248,113,113,0.1)",
        border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px",
        padding: "10px 14px", color: "#F87171", fontSize: "13px",
    },
    results: { padding: "0 22px 22px", animation: "tqa-fadeUp 0.4s ease" },
    scoreCard: {
        borderRadius: "12px", border: "1px solid",
        padding: "18px", marginBottom: "16px",
    },
    scoreFlex: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    gradeText: { fontSize: "38px", fontWeight: "800", margin: 0, fontFamily: "'DM Mono', monospace", lineHeight: 1 },
    gradeLabel: { fontSize: "12px", color: "#94A3B8", margin: "5px 0 0", fontWeight: "500" },
    scoreCircle: (color) => ({
        width: "66px", height: "66px", borderRadius: "50%",
        border: `3px solid ${color}40`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: `${color}10`, flexShrink: 0,
    }),
    scoreNum: { fontSize: "20px", fontWeight: "800", lineHeight: 1, fontFamily: "'DM Mono', monospace" },
    scoreMax: { fontSize: "9px", color: "#475569", marginTop: "1px" },
    dirBadge: { borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "600" },
    tickerBadge: { fontSize: "12px", color: "#64748B", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center" },
    metricsSection: { marginBottom: "16px" },
    metricsSectionTitle: { fontSize: "10px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" },
    insightBox: {
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "10px", padding: "14px", marginBottom: "14px",
    },
    insightTitle: { fontSize: "11px", fontWeight: "700", color: "#64748B", margin: "0 0 7px" },
    insightText: { fontSize: "13px", color: "#CBD5E1", margin: 0, lineHeight: 1.65 },
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px",
    },
    statCell: {
        background: "rgba(255,255,255,0.03)", borderRadius: "10px",
        padding: "11px 8px", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "4px",
        border: "1px solid rgba(255,255,255,0.05)",
    },
    statValue: { fontSize: "13px", fontWeight: "700", fontFamily: "'DM Mono', monospace" },
    statLabel: { fontSize: "10px", color: "#475569", textAlign: "center", lineHeight: 1.3 },
};

// ─── Main IdeasSection ────────────────────────────────────────────────────────

export default function IdeasSection() {
    const [ideas, setIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState({
        idea_category: '',
        idea_text: '',
        idea_tracker: 'Pending'
    });
    const [editingIdea, setEditingIdea] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [expandedIdeas, setExpandedIdeas] = useState({});
    const maxLength = 100;

    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const toggleText = (ideaId) => {
        setExpandedIdeas(prev => ({
            ...prev,
            [ideaId]: !prev[ideaId]
        }));
    };

    const categoryOptions = [
        { value: '', label: 'Select a category...' },
        { value: 'Feature Ideas', label: 'Feature Ideas' },
        { value: 'Trading Strategies', label: 'Trading Strategies' },
        { value: 'AI Enhancements', label: 'AI Enhancements' }
    ];

    const statusOptions = [
        { value: 'All', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
    ];

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/fetch-ideas`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Failed to fetch ideas');
            const data = await response.json();
            setIdeas(data);
            setError(null);
        } catch (err) {
            setError('Error fetching ideas: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingIdea) {
            setEditingIdea(prev => ({ ...prev, [name]: value }));
        } else {
            setNewIdea(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingIdea) {
                const response = await fetch(`${baseUrl}/update-idea`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idea_id: editingIdea.id,
                        idea_category: editingIdea.idea_category,
                        idea_text: editingIdea.idea_text,
                        idea_tracker: editingIdea.idea_tracker
                    })
                });
                if (!response.ok) throw new Error('Failed to update idea');
                setEditingIdea(null);
            } else {
                const response = await fetch(`${baseUrl}/generate-idea`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIdea)
                });
                if (!response.ok) throw new Error('Failed to create idea');
                setNewIdea({ idea_category: '', idea_text: '', idea_tracker: 'Pending' });
            }
            setShowCreateForm(false);
            fetchIdeas();
            setError(null);
        } catch (err) {
            setError(`Error ${editingIdea ? 'updating' : 'creating'} idea: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCreateForm = () => {
        if (editingIdea) setEditingIdea(null);
        setShowCreateForm(!showCreateForm);
    };

    const startEditingIdea = (idea) => {
        setEditingIdea({...idea});
        setShowCreateForm(true);
        setShowUpdateStatus(null);
    };

    const cancelEditing = () => {
        setEditingIdea(null);
        setShowCreateForm(false);
    };

    const deleteIdea = async (ideaId) => {
        setDeletingId(ideaId);
        try {
            const response = await fetch(`${baseUrl}/delete-idea`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea_id: ideaId })
            });
            if (!response.ok) throw new Error('Failed to delete idea');
            setIdeas(ideas.filter(idea => idea.id !== ideaId));
            setError(null);
            setHoveredCard(null);
            setDeleteConfirm(null);
        } catch (err) {
            setError('Error deleting idea: ' + err.message);
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const updateIdeaTracker = async (ideaId, newStatus) => {
        setUpdatingStatus(true);
        try {
            setIdeas(ideas.map(idea =>
                idea.id === ideaId ? { ...idea, idea_tracker: newStatus, isUpdating: true } : idea
            ));
            const response = await fetch(`${baseUrl}/update-idea-tracker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea_id: ideaId, idea_tracker: newStatus })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update idea status');
            }
            setIdeas(ideas.map(idea =>
                idea.id === ideaId ? { ...idea, idea_tracker: newStatus, isUpdating: false } : idea
            ));
            setShowUpdateStatus(null);
            setError(null);
        } catch (err) {
            fetchIdeas();
            setError('Error updating idea status: ' + err.message);
            console.error('Update error:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const [hoveredCard, setHoveredCard] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const toggleStatusDropdown = (ideaId) => {
        setShowUpdateStatus(showUpdateStatus === ideaId ? null : ideaId);
    };

    const StatusDropdown = ({ ideaId }) => (
        <div style={styles.statusDropdown}>
            <div style={{ ...styles.statusOption, ...styles.statusOptionPending }} onClick={() => updateIdeaTracker(ideaId, 'Pending')}>Pending</div>
            <div style={{ ...styles.statusOption, ...styles.statusOptionInProgress }} onClick={() => updateIdeaTracker(ideaId, 'In Progress')}>In Progress</div>
            <div style={{ ...styles.statusOption, ...styles.statusOptionCompleted }} onClick={() => updateIdeaTracker(ideaId, 'Completed')}>Completed</div>
        </div>
    );

    const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
    const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);

    const filteredIdeas = ideas.filter(idea => {
        const statusMatch = statusFilter === 'All' || idea.idea_tracker === statusFilter;
        const categoryMatch = categoryFilter === 'All' || idea.idea_category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    const uniqueCategories = ['All', ...new Set(ideas.map(idea => idea.idea_category))];

    return (
        <div style={styles.container}>
            {/* ── Header on top ── */}
            <div className="header">
                <Header />
            </div>

            {/* ── SideNavs below header, no flex ── */}
            <SideNavs />

            {/* ── Main body content ── */}
            <div className="main-body-info">
                {/* Page title row + action buttons */}
                <div style={styles.header}>
                    <p style={styles.sectionTitle}>Ideas Hub</p>
                    <div style={styles.headerActions}>
                        <StockTrendModal />
                        <button
                            style={styles.createButton}
                            onClick={toggleCreateForm}
                            className="btn"
                        >
                            {showCreateForm ? 'Cancel' : '+ Create New Idea'}
                        </button>
                    </div>
                </div>

                {error && <div style={styles.errorAlert}>{error}</div>}

                {/* Create / Edit Form */}
                {showCreateForm && (
                    <div style={styles.formContainer}>
                        <p style={styles.formTitle}>{editingIdea ? 'Edit Idea' : 'Create New Idea'}</p>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_category">Category</label>
                                <select
                                    style={styles.input}
                                    id="idea_category"
                                    name="idea_category"
                                    value={editingIdea ? editingIdea.idea_category : newIdea.idea_category}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                >
                                    {categoryOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_text">Description</label>
                                <textarea
                                    style={styles.input}
                                    id="idea_text"
                                    name="idea_text"
                                    rows="3"
                                    value={editingIdea ? editingIdea.idea_text : newIdea.idea_text}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Describe your idea here..."
                                ></textarea>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_tracker">Status</label>
                                <select
                                    style={styles.input}
                                    id="idea_tracker"
                                    name="idea_tracker"
                                    value={editingIdea ? editingIdea.idea_tracker : newIdea.idea_tracker}
                                    onChange={handleInputChange}
                                    className="form-control"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" style={styles.saveButton} className="btn" disabled={loading}>
                                {loading ? (editingIdea ? 'Updating...' : 'Saving...') : (editingIdea ? 'Update Idea' : 'Save Idea')}
                            </button>
                            <button type="button" style={styles.cancelButton} className="btn" onClick={editingIdea ? cancelEditing : toggleCreateForm}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Ideas List */}
                <div className="ideas-list">
                    <div style={styles.ideasListHeader}>
                        <p style={styles.ideasListTitle}>My Ideas</p>
                        <div style={styles.filtersContainer}>
                            <div style={styles.filterGroup}>
                                <label style={styles.filterLabel}>Status:</label>
                                <select style={styles.filterSelect} value={statusFilter} onChange={handleStatusFilterChange}>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.filterGroup}>
                                <label style={styles.filterLabel}>Category:</label>
                                <select style={styles.filterSelect} value={categoryFilter} onChange={handleCategoryFilterChange}>
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'All' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading && !editingIdea && !showCreateForm && (
                        <div style={styles.spinnerContainer}>
                            <div style={styles.spinner}></div>
                        </div>
                    )}

                    {!loading && filteredIdeas.length === 0 && (
                        <div style={styles.emptyState}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 9H9.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 9H15.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 14H16" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p style={styles.emptyStateText}>
                                {ideas.length === 0
                                    ? 'No ideas found. Click the "Create New Idea" button to get started!'
                                    : 'No ideas match the selected filters.'}
                            </p>
                        </div>
                    )}

                    <div>
                        {filteredIdeas.map(idea => (
                            <div key={idea.id}>
                                <div
                                    style={{
                                        ...styles.card,
                                        ...(hoveredCard === idea.id ? styles.cardHover : {})
                                    }}
                                    className="card"
                                    onMouseEnter={() => setHoveredCard(idea.id)}
                                    onMouseLeave={() => {
                                        if (deleteConfirm !== idea.id && showUpdateStatus !== idea.id) {
                                            setHoveredCard(null);
                                        }
                                    }}
                                >
                                    {/* Delete confirmation overlay */}
                                    {deleteConfirm === idea.id && (
                                        <div style={styles.deleteConfirm}>
                                            <p style={styles.deleteConfirmText}>Are you sure you want to delete this idea?</p>
                                            <div style={styles.deleteConfirmButtons}>
                                                <button
                                                    style={styles.deleteConfirmYes}
                                                    onClick={() => deleteIdea(idea.id)}
                                                    disabled={deletingId === idea.id}
                                                >
                                                    {deletingId === idea.id ? 'Deleting...' : 'Yes, Delete'}
                                                </button>
                                                <button style={styles.deleteConfirmNo} onClick={() => setDeleteConfirm(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.cardHeader}>
                                        <p style={styles.cardTitle}>{idea.idea_category}</p>
                                        {hoveredCard === idea.id && !deleteConfirm && (
                                            <div style={styles.cardActions}>
                                                <button
                                                    style={{ ...styles.iconButton, ...styles.editButton }}
                                                    onClick={() => startEditingIdea(idea)}
                                                    title="Edit Idea"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    style={{ ...styles.iconButton, ...styles.deleteButton }}
                                                    onClick={() => setDeleteConfirm(idea.id)}
                                                    title="Delete Idea"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={styles.cardBody}>
                                        <p style={styles.cardText}>
                                            {expandedIdeas[idea.id] ? idea.idea_text :
                                                (idea.idea_text.length > maxLength ?
                                                    `${idea.idea_text.slice(0, maxLength)}...` :
                                                    idea.idea_text)
                                            }
                                            {idea.idea_text.length > maxLength && (
                                                <span style={styles.readMoreLink} onClick={() => toggleText(idea.id)}>
                                                    {expandedIdeas[idea.id] ? ' Read Less' : ' Read More'}
                                                </span>
                                            )}
                                        </p>
                                        <div style={styles.cardFooter}>
                                            <div style={{ position: 'relative' }}>
                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        ...(idea.isUpdating ? styles.badgeUpdating :
                                                            idea.idea_tracker === 'Completed' ? styles.badgeCompleted :
                                                            idea.idea_tracker === 'In Progress' ? styles.badgeInProgress :
                                                            styles.badgePending)
                                                    }}
                                                    onClick={() => toggleStatusDropdown(idea.id)}
                                                >
                                                    {idea.isUpdating ? 'Updating...' : idea.idea_tracker}
                                                    {idea.isUpdating && <div style={styles.pulseAnimation}></div>}
                                                </span>
                                                {showUpdateStatus === idea.id && !idea.isUpdating && (
                                                    <StatusDropdown ideaId={idea.id} />
                                                )}
                                            </div>
                                            <small style={styles.dateText}>
                                                {new Date(idea.created_at).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Original styles (unchanged) ─────────────────────────────────────────────
const styles = {
    readMoreLink: {
        color: '#007BFF', cursor: 'pointer', fontSize: '14px',
        fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px',
        transition: 'color 0.3s ease',
    },
    container: {
        fontFamily: "'Poppins', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '10px',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    sectionTitle: {
        fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', margin: 0
    },
    createButton: {
        backgroundColor: '#3498db', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    formContainer: {
        backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    formTitle: {
        fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.2rem', color: '#34495e'
    },
    formGroup: { marginBottom: '1.2rem' },
    label: {
        fontWeight: '500', marginBottom: '0.5rem', display: 'block', color: '#4a5568'
    },
    input: {
        width: '100%', padding: '0.6rem', borderRadius: '4px',
        border: '1px solid #cbd5e0', transition: 'border-color 0.2s ease', fontSize: '1rem'
    },
    saveButton: {
        backgroundColor: '#2ecc71', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        marginRight: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#95a5a6', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer',
    },
    ideasListHeader: {
        fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', marginTop: '1.5rem',
        color: '#34495e', paddingBottom: '0.5rem', borderBottom: '1px solid #f0f0f0'
    },
    ideasListTitle: { margin: 0 },
    card: {
        borderRadius: '8px', border: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative', marginBottom: '20px',
    },
    cardHover: {
        transform: 'translateY(-5px)', boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
    },
    cardHeader: {
        backgroundColor: '#f8f9fa', borderBottom: '1px solid #f0f0f0',
        padding: '0.8rem 1rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
    },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#2c3e50' },
    cardActions: { display: 'flex', gap: '6px' },
    cardBody: {
        padding: '1rem', flex: '1 0 auto', display: 'flex', flexDirection: 'column'
    },
    cardText: { color: '#4a5568', marginBottom: '1rem', flex: '1 0 auto' },
    cardFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0'
    },
    badge: {
        padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: '500',
        fontSize: '0.75rem', cursor: 'pointer'
    },
    badgePending: { backgroundColor: 'rgba(247, 20, 247, 0.788)', color: 'white' },
    badgeInProgress: { backgroundColor: '#f39c12', color: 'white' },
    badgeCompleted: { backgroundColor: '#27ae60', color: 'white' },
    badgeUpdating: {
        backgroundColor: '#3498db', color: 'white', position: 'relative', overflow: 'hidden'
    },
    dateText: { fontSize: '0.75rem', color: '#718096' },
    spinnerContainer: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0'
    },
    spinner: {
        width: '2.5rem', height: '2.5rem', border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%', borderTopColor: '#3498db',
        animation: 'spin 1s ease-in-out infinite'
    },
    emptyState: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '1rem'
    },
    emptyStateText: {
        color: '#718096', fontWeight: '500', marginTop: '1rem', textAlign: 'center'
    },
    errorAlert: {
        backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem',
        borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #fecaca'
    },
    iconButton: {
        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
        padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s ease'
    },
    deleteButton: { color: '#e74c3c' },
    editButton: {
        color: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderRadius: '4px', padding: '4px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease',
    },
    statusDropdown: {
        top: '100%', left: '0', zIndex: 10, backgroundColor: 'white',
        borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0.5rem 0', width: '150px',
    },
    statusOption: {
        padding: '0.5rem 1rem', cursor: 'pointer',
        transition: 'background-color 0.2s ease', fontSize: '0.9rem'
    },
    statusOptionPending: { color: '#718096' },
    statusOptionInProgress: { color: '#f39c12' },
    statusOptionCompleted: { color: '#27ae60' },
    deleteConfirm: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        zIndex: 10, padding: '1rem',
    },
    deleteConfirmText: {
        fontWeight: '500', marginBottom: '1rem', textAlign: 'center', color: '#2c3e50'
    },
    deleteConfirmButtons: { display: 'flex', gap: '0.8rem' },
    deleteConfirmYes: {
        backgroundColor: '#e74c3c', color: 'white', border: 'none',
        padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '500', cursor: 'pointer',
    },
    deleteConfirmNo: {
        backgroundColor: '#3498db', color: 'white', border: 'none',
        padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '500', cursor: 'pointer',
    },
    pulseAnimation: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        animation: 'pulse 1.5s infinite'
    },
    filtersContainer: {
        display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap'
    },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    filterLabel: { fontWeight: 500, fontSize: '14px', color: '#4A5568' },
    filterSelect: {
        padding: '6px 10px', borderRadius: '4px', border: '1px solid #E2E8F0',
        backgroundColor: '#F7FAFC', fontSize: '14px', color: '#2D3748', minWidth: '150px'
    },
};
