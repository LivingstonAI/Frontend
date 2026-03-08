import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LANGUAGES = [
    { code: 'english',  label: 'English',  flag: '🇺🇸' },
    { code: 'chinese',  label: '中文',      flag: '🇨🇳' },
    { code: 'japanese', label: '日本語',    flag: '🇯🇵' },
    { code: 'korean',   label: '한국어',    flag: '🇰🇷' },
    { code: 'russian',  label: 'Русский',   flag: '🇷🇺' },
];

export default function GoogleCalendar() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [accountData, setAccountData] = useState(null);
    const [trades, setTrades] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTrades, setSelectedTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [selectedChart, setSelectedChart] = useState(null);
    const [chartMetrics, setChartMetrics] = useState({});
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [pdfError, setPdfError] = useState(null);

    const accountName = Cookies.get('account_name');

    useEffect(() => { fetchTrades(); }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showLanguageSelector && !e.target.closest('.language-selector-wrap')) {
                setShowLanguageSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLanguageSelector]);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!accountName) throw new Error('Account name not found. Please log in again.');
            const response = await fetch(`${baseUrl}/api/trades-calendar/?account_name=${accountName}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('No trading data found for this account.');
                else if (response.status === 401) throw new Error('Unauthorized access. Please log in again.');
                else if (response.status >= 500) throw new Error('Server error. Please try again later.');
                else throw new Error(`Failed to fetch trades: ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid data format received from server.');
            const normalizedTrades = data.map(trade => ({
                ...trade,
                amount: trade.outcome === 'Loss' ? -Math.abs(trade.amount) : Math.abs(trade.amount),
                date_entered: trade.date_entered ? (() => {
                    const d = new Date(trade.date_entered);
                    d.setDate(d.getDate() - 1);
                    return d.toISOString();
                })() : null
            }));
            setTrades(normalizedTrades);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred while loading your trades.');
        } finally {
            setLoading(false);
        }
    };

    // ── PDF Download: sends trades already in state to backend ──────────
    const downloadMonthlyReport = async () => {
        setDownloadingPDF(true);
        setPdfError(null);

        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // 1-based

            // Send the trades we already have — no second fetch needed on the backend
            const response = await fetch(`${baseUrl}/api/trading-pdf-report/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_name: accountName,
                    language: selectedLanguage,
                    year,
                    month,
                    trades, // <-- already in state, avoids backend timeout
                }),
            });

            if (!response.ok) {
                let errMsg = `PDF generation failed (${response.status})`;
                try {
                    const errData = await response.json();
                    errMsg = errData.error || errMsg;
                } catch (_) {}
                throw new Error(errMsg);
            }

            // Stream the PDF blob and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const monthStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).replace(' ', '_');
            link.download = `SnowAI_Trading_Report_${monthStr}_${selectedLanguage}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('PDF download error:', err);
            setPdfError(err.message);
        } finally {
            setDownloadingPDF(false);
        }
    };

    // ── Chart helpers ────────────────────────────────────────────────────
    const getChartMetrics = (chartType) => {
        const monthTrades = getCurrentMonthTrades();
        const fieldMap = {
            dayOfWeek: 'day_of_week_entered',
            session: 'trading_session_entered',
            strategy: 'strategy',
            asset: 'asset',
        };
        const field = fieldMap[chartType];
        if (!field) return {};

        const perf = {};
        monthTrades.forEach(trade => {
            const key = trade[field];
            if (!key) return;
            if (!perf[key]) perf[key] = [];
            perf[key].push(trade.amount);
        });

        const stats = {};
        Object.keys(perf).forEach(key => {
            const amounts = perf[key];
            const wins = amounts.filter(a => a > 0);
            const losses = amounts.filter(a => a < 0);
            stats[key] = {
                total: amounts.reduce((s, a) => s + a, 0),
                trades: amounts.length,
                wins: wins.length,
                losses: losses.length,
                winRate: amounts.length > 0 ? (wins.length / amounts.length * 100).toFixed(1) : 0,
                avgTrade: amounts.length > 0 ? (amounts.reduce((s, a) => s + a, 0) / amounts.length).toFixed(2) : 0,
            };
        });
        return stats;
    };

    const getCurrentMonthTrades = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const d = new Date(trade.date_entered);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    };

    const calculateAnalytics = () => {
        const monthTrades = getCurrentMonthTrades();
        if (monthTrades.length === 0) return { winRate: 0, averageWin: 0, averageLoss: 0, profitFactor: 0, totalWins: 0, totalLosses: 0, totalTrades: 0, netPnL: 0 };
        const wins = monthTrades.filter(t => t.amount > 0);
        const losses = monthTrades.filter(t => t.amount < 0);
        const totalWins = wins.reduce((s, t) => s + t.amount, 0);
        const totalLosses = Math.abs(losses.reduce((s, t) => s + t.amount, 0));
        return {
            winRate: (wins.length / monthTrades.length) * 100,
            averageWin: wins.length > 0 ? totalWins / wins.length : 0,
            averageLoss: losses.length > 0 ? totalLosses / losses.length : 0,
            profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
            totalWins: wins.length,
            totalLosses: losses.length,
            totalTrades: monthTrades.length,
            netPnL: monthTrades.reduce((s, t) => s + t.amount, 0),
        };
    };

    const makeChartData = (field, label, colorPos, colorNeg) => {
        const monthTrades = getCurrentMonthTrades();
        const perf = {};
        monthTrades.forEach(trade => {
            if (trade[field]) {
                perf[trade[field]] = (perf[trade[field]] || 0) + trade.amount;
            }
        });
        return {
            labels: Object.keys(perf),
            datasets: [{
                label,
                data: Object.values(perf),
                backgroundColor: Object.values(perf).map(v => v >= 0 ? colorPos.bg : 'rgba(239,68,68,0.6)'),
                borderColor: Object.values(perf).map(v => v >= 0 ? colorPos.border : 'rgba(239,68,68,1)'),
                borderWidth: 1,
            }]
        };
    };

    const getDayOfWeekPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const dayPerf = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
        monthTrades.forEach(t => { if (t.day_of_week_entered && dayPerf.hasOwnProperty(t.day_of_week_entered)) dayPerf[t.day_of_week_entered] += t.amount; });
        return {
            labels: Object.keys(dayPerf),
            datasets: [{ label: 'P&L by Day', data: Object.values(dayPerf), backgroundColor: Object.values(dayPerf).map(v => v >= 0 ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'), borderColor: Object.values(dayPerf).map(v => v >= 0 ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)'), borderWidth: 1 }]
        };
    };

    const getTradingSessionPerformance = () => makeChartData('trading_session_entered', 'P&L by Session', { bg: 'rgba(59,130,246,0.6)', border: 'rgba(59,130,246,1)' });
    const getStrategyPerformance = () => makeChartData('strategy', 'P&L by Strategy', { bg: 'rgba(168,85,247,0.6)', border: 'rgba(168,85,247,1)' });
    const getAssetPerformance = () => makeChartData('asset', 'P&L by Asset', { bg: 'rgba(16,185,129,0.6)', border: 'rgba(16,185,129,1)' });

    const getEquityCurve = () => {
        const monthTrades = getCurrentMonthTrades().sort((a, b) => new Date(a.date_entered) - new Date(b.date_entered));
        let running = 0;
        const data = [0];
        const labels = ['Start'];
        monthTrades.forEach((t, i) => { running += t.amount; data.push(running); labels.push(`Trade ${i + 1}`); });
        return { labels, datasets: [{ label: 'Equity Curve', data, borderColor: 'rgba(59,130,246,1)', backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 2, fill: true, tension: 0.1 }] };
    };

    const getChartOptions = (chartType) => ({
        responsive: true, maintainAspectRatio: false,
        onClick: () => handleChartClick(chartType),
        plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}` } } },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v } } }
    });

    const getEquityChartOptions = () => ({
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}` } } },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v } } }
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear(), month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
        return days;
    };

    const getTradesForDate = (day) => {
        if (!day) return [];
        const year = currentDate.getFullYear(), month = currentDate.getMonth();
        const dateString = new Date(year, month, day).toISOString().split('T')[0];
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            return new Date(trade.date_entered).toISOString().split('T')[0] === dateString;
        });
    };

    const handleDateClick = (day) => {
        if (!day) return;
        const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (selectedDate && selectedDate.getTime() === clicked.getTime()) {
            setSelectedDate(null); setSelectedTrades([]);
        } else {
            setSelectedDate(clicked); setSelectedTrades(getTradesForDate(day));
        }
    };

    const handleChartClick = (chartType) => {
        if (selectedChart === chartType) { setSelectedChart(null); setChartMetrics({}); }
        else { setSelectedChart(chartType); setChartMetrics(getChartMetrics(chartType)); }
    };

    const navigateMonth = (dir) => {
        const d = new Date(currentDate);
        d.setMonth(currentDate.getMonth() + dir);
        setCurrentDate(d); setSelectedDate(null); setSelectedTrades([]);
    };

    const getMonthName = (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const getProfitLossColor = (outcome, amount) => amount < 0 ? 'loss' : amount > 0 ? 'profit' : 'neutral';
    const formatAmount = (amount) => { const abs = Math.abs(amount); return abs >= 1000 ? (abs / 1000).toFixed(1) + 'k' : abs.toString(); };
    const formatCurrency = (amount) => amount < 0 ? `-$${Math.abs(amount)}` : `$${amount}`;
    const getDayTotal = (dayTrades) => dayTrades.reduce((total, t) => total + t.amount, 0);

    const days = getDaysInMonth(currentDate);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const analytics = calculateAnalytics();

    // ── Error / Loading states ───────────────────────────────────────────
    if (error && !loading) {
        return (
            <div>
                <div className="header"><Header /></div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: 20, margin: '20px 0', textAlign: 'center' }}>
                            <h4 style={{ color: '#c33', marginBottom: 10 }}>Unable to Load Trading Data</h4>
                            <p style={{ color: '#666', marginBottom: 15 }}>{error}</p>
                            <button onClick={fetchTrades} style={{ background: '#007cba', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer' }}>Try Again</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                <div className="header"><Header /></div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading trades...</div>
                    </div>
                </div>
            </div>
        );
    }

    const selectedLangObj = LANGUAGES.find(l => l.code === selectedLanguage);

    return (
        <div>
            <div className="header"><Header /></div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Trading Calendar</h5><br />

                    {/* ── Control Bar ─────────────────────────────────────────── */}
                    <div style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

                        {/* Analytics toggle */}
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            style={{ background: showAnalytics ? '#ef4444' : '#007cba', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer' }}
                        >
                            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                        </button>

                        {/* Language selector */}
                        <div className="language-selector-wrap" style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                                style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <span>{selectedLangObj?.flag}</span>
                                <span>{selectedLangObj?.label}</span>
                                <span style={{ fontSize: 10 }}>▼</span>
                            </button>
                            {showLanguageSelector && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ccc', borderRadius: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, minWidth: 150, overflow: 'hidden' }}>
                                    {LANGUAGES.map(lang => (
                                        <div
                                            key={lang.code}
                                            onClick={() => { setSelectedLanguage(lang.code); setShowLanguageSelector(false); }}
                                            style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: selectedLanguage === lang.code ? '#eef2ff' : 'white', fontWeight: selectedLanguage === lang.code ? 'bold' : 'normal', borderBottom: '1px solid #f0f0f0' }}
                                            onMouseEnter={e => { if (selectedLanguage !== lang.code) e.currentTarget.style.background = '#f5f5f5'; }}
                                            onMouseLeave={e => { if (selectedLanguage !== lang.code) e.currentTarget.style.background = 'white'; }}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Download PDF button */}
                        <button
                            onClick={downloadMonthlyReport}
                            disabled={downloadingPDF}
                            style={{ background: downloadingPDF ? '#9ca3af' : '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: downloadingPDF ? 'not-allowed' : 'pointer', opacity: downloadingPDF ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            {downloadingPDF ? (
                                <>
                                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    Generating PDF...
                                </>
                            ) : (
                                <>📄 Download {selectedLangObj?.label} Report</>
                            )}
                        </button>
                    </div>

                    {/* PDF error banner */}
                    {pdfError && (
                        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '10px 16px', marginBottom: 12, color: '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>⚠️ {pdfError}</span>
                            <button onClick={() => setPdfError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>×</button>
                        </div>
                    )}

                    {/* ── Analytics Section ──────────────────────────────────── */}
                    {showAnalytics && (
                        <div style={{ marginBottom: 30 }}>
                            {/* Key Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginBottom: 24 }}>
                                {[
                                    { label: 'Win Rate', value: `${analytics.winRate.toFixed(1)}%`, color: analytics.winRate >= 50 ? '#22c55e' : '#ef4444' },
                                    { label: 'Average Win', value: `$${analytics.averageWin.toFixed(2)}`, color: '#22c55e' },
                                    { label: 'Average Loss', value: `$${analytics.averageLoss.toFixed(2)}`, color: '#ef4444' },
                                    { label: 'Profit Factor', value: analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2), color: analytics.profitFactor >= 1 ? '#22c55e' : '#ef4444' },
                                    { label: 'Net P&L', value: `$${analytics.netPnL.toFixed(2)}`, color: analytics.netPnL >= 0 ? '#22c55e' : '#ef4444' },
                                    { label: 'Total Trades', value: analytics.totalTrades, color: '#6b7280' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, border: '1px solid #e9ecef' }}>
                                        <h6 style={{ margin: '0 0 5px', color: '#666', fontSize: 12 }}>{label}</h6>
                                        <div style={{ fontSize: 20, fontWeight: 'bold', color }}>{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 20 }}>
                                {[
                                    { key: 'dayOfWeek', title: 'Performance by Day of Week', data: getDayOfWeekPerformance() },
                                    { key: 'session', title: 'Performance by Trading Session', data: getTradingSessionPerformance() },
                                    { key: 'strategy', title: 'Performance by Strategy', data: getStrategyPerformance() },
                                    { key: 'asset', title: 'Performance by Asset', data: getAssetPerformance() },
                                ].map(({ key, title, data }) => (
                                    <div
                                        key={key}
                                        data-chart={key}
                                        style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, cursor: 'pointer', border: selectedChart === key ? '2px solid #007cba' : '1px solid #e9ecef', transition: 'border-color 0.2s' }}
                                        onClick={() => handleChartClick(key)}
                                    >
                                        <h6 style={{ marginBottom: 12, fontSize: 13 }}>{title} <span style={{ color: '#999', fontWeight: 'normal', fontSize: 11 }}>(click for details)</span></h6>
                                        <div style={{ height: 280 }}>
                                            <Bar data={data} options={getChartOptions(key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart Metrics Detail */}
                            {selectedChart && Object.keys(chartMetrics).length > 0 && (
                                <div style={{ background: '#f8f9fa', border: '2px solid #007cba', borderRadius: 8, padding: 20, marginBottom: 20, position: 'relative' }}>
                                    <button onClick={() => setSelectedChart(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>×</button>
                                    <h6 style={{ marginBottom: 15, color: '#007cba' }}>
                                        Detailed Metrics — {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)}
                                    </h6>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                                        {Object.entries(chartMetrics).map(([key, metrics]) => (
                                            <div key={key} style={{ background: 'white', padding: 14, borderRadius: 6, border: '1px solid #e9ecef' }}>
                                                <h6 style={{ margin: '0 0 8px', color: '#333', fontSize: 13 }}>{key}</h6>
                                                <div style={{ fontSize: 11, color: '#666' }}>
                                                    <div>Total P&L: <span style={{ color: metrics.total >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>${metrics.total.toFixed(2)}</span></div>
                                                    <div>Trades: {metrics.trades}</div>
                                                    <div>Wins: {metrics.wins} | Losses: {metrics.losses}</div>
                                                    <div>Win Rate: {metrics.winRate}%</div>
                                                    <div>Avg Trade: ${metrics.avgTrade}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Equity Curve */}
                            <div data-chart="equity" style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
                                <h6 style={{ marginBottom: 12 }}>Equity Curve</h6>
                                <div style={{ height: 380 }}>
                                    <Line data={getEquityCurve()} options={getEquityChartOptions()} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Calendar ───────────────────────────────────────────── */}
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button className="nav-button" onClick={() => navigateMonth(-1)}>&#8249;</button>
                            <h3 className="month-year">{getMonthName(currentDate)}</h3>
                            <button className="nav-button" onClick={() => navigateMonth(1)}>&#8250;</button>
                        </div>

                        <div className="calendar-grid">
                            {weekdays.map(day => <div key={day} className="weekday-header">{day}</div>)}
                            {days.map((day, index) => {
                                const dayTrades = getTradesForDate(day);
                                const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                                return (
                                    <div key={index} className={`calendar-day ${day ? 'active' : 'inactive'} ${isSelected ? 'selected' : ''}`} onClick={() => handleDateClick(day)}>
                                        {day && (
                                            <>
                                                <span className="day-number">{day}</span>
                                                {dayTrades.length > 0 && (
                                                    <div className="trade-amounts">
                                                        {dayTrades.slice(0, 4).map((trade, i) => (
                                                            <div key={i} className={`trade-amount ${getProfitLossColor(trade.outcome, trade.amount)}`} title={`${trade.asset} - ${trade.outcome}: ${formatCurrency(trade.amount)}`}>
                                                                {trade.amount > 0 ? '+' : '-'}{formatAmount(trade.amount)}
                                                            </div>
                                                        ))}
                                                        {dayTrades.length > 4 && <div className="trade-count">+{dayTrades.length - 4}</div>}
                                                        {dayTrades.length > 1 && (
                                                            <div className={`day-total ${getProfitLossColor('', getDayTotal(dayTrades))}`}>
                                                                Total: {getDayTotal(dayTrades) > 0 ? '+' : ''}{formatAmount(getDayTotal(dayTrades))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedDate && selectedTrades.length > 0 && (
                            <div className="trade-details">
                                <h4>Trades for {selectedDate.toLocaleDateString()}</h4>
                                <div className="trades-list">
                                    {selectedTrades.map((trade, index) => (
                                        <div key={index} className="trade-card">
                                            <div className="trade-header">
                                                <h5>{trade.asset}</h5>
                                                <span className={`trade-outcome ${getProfitLossColor(trade.outcome, trade.amount)}`}>{formatCurrency(trade.amount)}</span>
                                            </div>
                                            <div className="trade-info">
                                                {[
                                                    ['Order Type', trade.order_type],
                                                    ['Strategy', trade.strategy],
                                                    ['Day Entered', trade.day_of_week_entered],
                                                    trade.day_of_week_closed ? ['Day Closed', trade.day_of_week_closed] : null,
                                                    ['Session Entered', trade.trading_session_entered],
                                                    trade.trading_session_closed ? ['Session Closed', trade.trading_session_closed] : null,
                                                    ['Outcome', trade.outcome],
                                                    trade.emotional_bias ? ['Emotional Bias', trade.emotional_bias] : null,
                                                    trade.reflection ? ['Reflection', trade.reflection] : null,
                                                ].filter(Boolean).map(([label, value]) => (
                                                    <div key={label} className="trade-row">
                                                        <span className="label">{label}:</span>
                                                        <span className={label === 'Outcome' ? getProfitLossColor(trade.outcome, trade.amount) : ''}>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}