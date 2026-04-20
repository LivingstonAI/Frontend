import React, { useEffect, useState, useCallback, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const BASE_URL = "https://backend-production-c0ab.up.railway.app";

// ── Design tokens ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ice:       #EAF4FB;
    --sky:       #B8DCF0;
    --blue:      #3A9FD5;
    --deep:      #1A5E8A;
    --navy:      #0D2D45;
    --white:     #FFFFFF;
    --offwhite:  #F5FAFE;
    --muted:     #7BA9C4;
    --border:    #CBE4F2;
    --stable:    #1BA86D;
    --choppy:    #E89C2A;
    --volatile:  #D63B3B;
    --bullish:   #1BA86D;
    --bearish:   #D63B3B;
    --neutral:   #7BA9C4;
    --shadow:    0 2px 16px rgba(26,94,138,0.10);
    --shadow-lg: 0 8px 40px rgba(26,94,138,0.14);
    --radius:    12px;
    --radius-sm: 7px;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  .dt-root {
    min-height: 100vh;
    background: var(--offwhite);
    font-family: var(--font-mono);
    color: var(--navy);
  }

  /* ── Top nav ── */
  .dt-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--white);
    border-bottom: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 28px;
    height: 52px;
    box-shadow: 0 2px 12px rgba(26,94,138,0.07);
  }
  .dt-topnav-brand {
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 800;
    color: var(--deep);
    letter-spacing: -0.02em;
    margin-right: 32px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dt-topnav-brand span {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--blue);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100%{ opacity:1; transform:scale(1); }
    50%{ opacity:.4; transform:scale(1.5); }
  }
  .dt-topnav-links {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    overflow-x: auto;
  }
  .dt-nav-link {
    padding: 6px 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    white-space: nowrap;
    transition: all .18s;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .dt-nav-link:hover { background: var(--ice); color: var(--deep); }
  .dt-nav-link.active { background: var(--ice); color: var(--deep); font-weight: 600; }

  /* ── Page body ── */
  .dt-body {
    max-width: 1320px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

  /* ── Page header ── */
  .dt-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .dt-page-title {
    font-family: var(--font-head);
    font-size: 26px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }
  .dt-page-subtitle {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
    letter-spacing: 0.03em;
  }

  /* ── Filter bar ── */
  .dt-filters {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 22px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 18px;
    box-shadow: var(--shadow);
  }
  .dt-filter-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .dt-filter-label {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .dt-select, .dt-input {
    padding: 7px 11px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--navy);
    background: var(--offwhite);
    outline: none;
    min-width: 120px;
    transition: border-color .18s;
  }
  .dt-select:focus, .dt-input:focus {
    border-color: var(--blue);
    background: var(--white);
  }
  .dt-input { min-width: 160px; }
  .dt-btn {
    padding: 8px 18px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all .18s;
    letter-spacing: 0.02em;
    white-space: nowrap;
    margin-top: 16px;
  }
  .dt-btn-primary {
    background: var(--deep);
    color: var(--white);
  }
  .dt-btn-primary:hover { background: var(--navy); }
  .dt-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
  .dt-btn-ghost {
    background: var(--ice);
    color: var(--deep);
    border: 1.5px solid var(--border);
  }
  .dt-btn-ghost:hover { background: var(--sky); }
  .dt-divider {
    width: 1px;
    height: 36px;
    background: var(--border);
    margin-top: 16px;
  }

  /* ── Stats bar ── */
  .dt-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    margin-bottom: 22px;
  }
  .dt-stat-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    box-shadow: var(--shadow);
    transition: transform .18s, box-shadow .18s;
  }
  .dt-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .dt-stat-label {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .dt-stat-value {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 800;
    color: var(--deep);
    margin-top: 4px;
  }
  .dt-stat-sub {
    font-size: 10px;
    color: var(--muted);
    margin-top: 2px;
  }

  /* ── Table ── */
  .dt-table-wrap {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .dt-table-scroll {
    overflow-x: auto;
  }
  table.dt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .dt-table thead tr {
    background: var(--navy);
    color: var(--white);
  }
  .dt-table thead th {
    padding: 11px 14px;
    text-align: left;
    font-family: var(--font-head);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: background .15s;
  }
  .dt-table thead th:hover { background: var(--deep); }
  .dt-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background .12s;
    animation: rowIn .25s ease both;
  }
  @keyframes rowIn {
    from { opacity:0; transform: translateY(4px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .dt-table tbody tr:nth-child(even) { background: var(--ice); }
  .dt-table tbody tr:hover { background: var(--sky) !important; }
  .dt-table td {
    padding: 10px 14px;
    white-space: nowrap;
    color: var(--navy);
  }
  .dt-symbol {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 13px;
    color: var(--deep);
  }

  /* ── Badges ── */
  .dt-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .dt-badge-stable   { background: #D6F5E8; color: #1BA86D; }
  .dt-badge-choppy   { background: #FEF0D6; color: #C07A10; }
  .dt-badge-volatile { background: #FBDEDE; color: #D63B3B; }
  .dt-badge-bullish  { background: #D6F5E8; color: #1BA86D; }
  .dt-badge-bearish  { background: #FBDEDE; color: #D63B3B; }
  .dt-badge-neutral  { background: var(--ice); color: var(--muted); }

  /* ── MSS bar ── */
  .dt-mss-bar {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dt-mss-track {
    flex: 1;
    height: 5px;
    background: var(--ice);
    border-radius: 3px;
    min-width: 60px;
    overflow: hidden;
  }
  .dt-mss-fill {
    height: 100%;
    border-radius: 3px;
    transition: width .5s ease;
  }
  .dt-mss-num {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 13px;
    min-width: 36px;
    text-align: right;
  }

  /* ── Pagination ── */
  .dt-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1.5px solid var(--border);
    background: var(--white);
    flex-wrap: wrap;
    gap: 8px;
  }
  .dt-pag-info { font-size: 11px; color: var(--muted); }
  .dt-pag-btns { display: flex; gap: 6px; }
  .dt-pag-btn {
    padding: 5px 12px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--white);
    color: var(--deep);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
    transition: all .15s;
  }
  .dt-pag-btn:hover:not(:disabled) { background: var(--ice); }
  .dt-pag-btn:disabled { opacity:.4; cursor:not-allowed; }
  .dt-pag-btn.active { background: var(--deep); color: var(--white); border-color: var(--deep); }

  /* ── Download panel ── */
  .dt-dl-panel {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    margin-bottom: 22px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  .dt-dl-title {
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 700;
    color: var(--deep);
    margin-right: 8px;
  }
  .dt-dl-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid;
    transition: all .18s;
    letter-spacing: 0.03em;
    text-decoration: none;
  }
  .dt-dl-csv  { border-color: #1BA86D; color: #1BA86D; background: #D6F5E8; }
  .dt-dl-csv:hover  { background: #1BA86D; color: #fff; }
  .dt-dl-xlsx { border-color: var(--blue); color: var(--deep); background: var(--ice); }
  .dt-dl-xlsx:hover { background: var(--blue); color: #fff; }
  .dt-dl-pdf  { border-color: #D63B3B; color: #D63B3B; background: #FBDEDE; }
  .dt-dl-pdf:hover  { background: #D63B3B; color: #fff; }
  .dt-dl-json { border-color: var(--muted); color: var(--muted); background: var(--ice); }
  .dt-dl-json:hover { background: var(--muted); color: #fff; }

  /* ── Loading ── */
  .dt-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    gap: 14px;
    color: var(--muted);
    font-size: 13px;
  }
  .dt-spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .dt-empty {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
    font-size: 13px;
  }
  .dt-empty-icon { font-size: 36px; margin-bottom: 12px; opacity:.5; }

  /* ── Chart area (sparkline) ── */
  .dt-sparkline {
    display: inline-block;
    vertical-align: middle;
  }

  /* ── Sort icon ── */
  .dt-sort { opacity:.4; margin-left:4px; font-size:10px; }
  .dt-sort.asc, .dt-sort.desc { opacity:1; color: var(--sky); }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .dt-body { padding: 16px 10px 32px; }
    .dt-page-title { font-size: 20px; }
    .dt-topnav { padding: 0 14px; }
    .dt-topnav-links { display: none; }
  }
`;

// ── Constants ─────────────────────────────────────────────────────────────────
const PERIODS = [10, 15, 20, 30, 45, 60, 90, 180];
const ASSET_CLASSES = ['all', 'stocks', 'forex', 'indices', 'commodities', 'bonds'];
const PAGE_LIMIT = 50;

// ── Colour helpers ────────────────────────────────────────────────────────────
const mssColor = (mss) => {
  if (mss >= 47) return 'var(--stable)';
  if (mss >= 30) return 'var(--choppy)';
  return 'var(--volatile)';
};

const categoryBadge = (cat) => (
  <span className={`dt-badge dt-badge-${cat}`}>
    {cat === 'stable' ? '● ' : cat === 'choppy' ? '◆ ' : '▲ '}
    {cat}
  </span>
);

const biasBadge = (bias) => {
  if (!bias) return <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>;
  return <span className={`dt-badge dt-badge-${bias}`}>{bias}</span>;
};

const MSSBar = ({ mss }) => (
  <div className="dt-mss-bar">
    <div className="dt-mss-track">
      <div
        className="dt-mss-fill"
        style={{ width: `${mss}%`, background: mssColor(mss) }}
      />
    </div>
    <span className="dt-mss-num" style={{ color: mssColor(mss) }}>
      {mss?.toFixed(1)}
    </span>
  </div>
);

const fmt = (n, dec = 4) =>
  n == null ? '—' : typeof n === 'number' ? n.toFixed(dec) : n;

// ── Main component ─────────────────────────────────────────────────────────────
export default function DataTracker() {
  // ── Filter state ────────────────────────────────────────────────────
  const [symbol, setSymbol]           = useState('');
  const [period, setPeriod]           = useState(60);
  const [assetClass, setAssetClass]   = useState('all');
  const [daysBack, setDaysBack]       = useState(365);
  const [activeTab, setActiveTab]     = useState('history');
  const [sortKey, setSortKey]         = useState('date_taken');
  const [sortDir, setSortDir]         = useState('desc');
  const [page, setPage]               = useState(1);

  // ── Data state ──────────────────────────────────────────────────────
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ── Symbol list for autocomplete ────────────────────────────────────
  const [symbols, setSymbols] = useState([]);

  // ── Summary stats ───────────────────────────────────────────────────
  const [summary, setSummary] = useState(null);

  const inputRef = useRef();

  // ── Fetch symbol list once ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/api/mss/symbols/`)
      .then(r => r.json())
      .then(d => { if (d.success) setSymbols(d.data); })
      .catch(() => {});
  }, []);

  // ── Fetch summary ───────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'summary') return;
    fetch(`${BASE_URL}/api/mss/summary/?period=${period}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSummary(d); })
      .catch(() => {});
  }, [activeTab, period]);

  // ── Fetch history ───────────────────────────────────────────────────
  const fetchHistory = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period: period,
        days: daysBack,
        page: p,
        limit: PAGE_LIMIT,
      });
      if (symbol.trim()) params.set('symbol', symbol.trim().toUpperCase());

      const res = await fetch(`${BASE_URL}/api/mss/history/?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Unknown error');

      let rows = json.data;

      // Client-side asset class filter
      if (assetClass !== 'all') {
        rows = rows.filter(r => r.asset_class === assetClass);
      }

      // Client-side sort
      rows.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });

      setData(rows);
      setTotal(json.total);
      setPage(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [symbol, period, daysBack, assetClass, sortKey, sortDir]);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory(1);
  }, [activeTab, fetchHistory]);

  // ── Sort handler ─────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="dt-sort">↕</span>;
    return <span className={`dt-sort ${sortDir}`}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  // ── Download handler ─────────────────────────────────────────────────
  const handleDownload = (fmt) => {
    const sym = symbol.trim().toUpperCase() || 'ALL';
    const params = new URLSearchParams({ format: fmt, period, days: daysBack });
    if (fmt === 'json') {
      // Client-side JSON export
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${sym}_mss_history.json`; a.click();
      URL.revokeObjectURL(url);
      return;
    }
    window.open(`${BASE_URL}/api/mss/download/${sym}/?${params}`, '_blank');
  };

  // ── Summary stats derived ────────────────────────────────────────────
  const stats = React.useMemo(() => {
    const src = activeTab === 'summary' && summary ? summary.data : data;
    if (!src.length) return null;
    const mssList = src.map(r => r.mss).filter(Boolean);
    const avgMss  = mssList.reduce((a, b) => a + b, 0) / mssList.length;
    const stable  = src.filter(r => r.category === 'stable').length;
    const choppy  = src.filter(r => r.category === 'choppy').length;
    const volatile= src.filter(r => r.category === 'volatile').length;
    const avgR2   = src.map(r => r.r_squared).filter(Boolean).reduce((a, b) => a + b, 0) / src.length;
    return { avgMss, stable, choppy, volatile, avgR2, total: src.length };
  }, [data, summary, activeTab]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="dt-root">
        {/* Global header (your existing component) */}
        <Header />
        <div>
                        <SideNavs />

        {/* Top nav */}
        <nav className="dt-topnav">
          <div className="dt-topnav-brand">
            <span /> SnowAI Tracker
          </div>
          <div className="dt-topnav-links">
            {[
              { id: 'history', label: 'History' },
              { id: 'summary', label: 'Daily Snapshot' },
              { id: 'download', label: 'Download Centre' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`dt-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="dt-body">
          {/* Page header */}
          <div className="dt-page-header">
            <div>
              <div className="dt-page-title">MSS Historical Data & Performance Tracker</div>
              <div className="dt-page-subtitle">
                Market Stability Score · R² · Analyst Bias · Put/Call Ratio — all periods, all assets
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="dt-filters">
            <div className="dt-filter-group">
              <div className="dt-filter-label">Symbol</div>
              <input
                ref={inputRef}
                className="dt-input"
                placeholder="e.g. AAPL, EURUSD=X"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                list="sym-list"
                style={{ textTransform: 'uppercase' }}
              />
              <datalist id="sym-list">
                {symbols.slice(0, 200).map(s => (
                  <option key={s.symbol} value={s.symbol} />
                ))}
              </datalist>
            </div>

            <div className="dt-filter-group">
              <div className="dt-filter-label">Period (days)</div>
              <select className="dt-select" value={period} onChange={e => setPeriod(+e.target.value)}>
                {PERIODS.map(p => <option key={p} value={p}>{p}d</option>)}
              </select>
            </div>

            <div className="dt-filter-group">
              <div className="dt-filter-label">Asset Class</div>
              <select className="dt-select" value={assetClass} onChange={e => setAssetClass(e.target.value)}>
                {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="dt-filter-group">
              <div className="dt-filter-label">Days back</div>
              <select className="dt-select" value={daysBack} onChange={e => setDaysBack(+e.target.value)}>
                {[30, 60, 90, 180, 365, 730].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>

            <div className="dt-divider" />

            <button
              className="dt-btn dt-btn-primary"
              disabled={loading}
              onClick={() => fetchHistory(1)}
            >
              {loading ? 'Loading…' : '⟳ Run Query'}
            </button>
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="dt-stats">
              <div className="dt-stat-card">
                <div className="dt-stat-label">Avg MSS</div>
                <div className="dt-stat-value" style={{ color: mssColor(stats.avgMss) }}>
                  {stats.avgMss.toFixed(1)}
                </div>
                <div className="dt-stat-sub">across {stats.total} records</div>
              </div>
              <div className="dt-stat-card">
                <div className="dt-stat-label">Stable</div>
                <div className="dt-stat-value" style={{ color: 'var(--stable)' }}>{stats.stable}</div>
                <div className="dt-stat-sub">{((stats.stable / stats.total) * 100).toFixed(0)}% of set</div>
              </div>
              <div className="dt-stat-card">
                <div className="dt-stat-label">Choppy</div>
                <div className="dt-stat-value" style={{ color: 'var(--choppy)' }}>{stats.choppy}</div>
                <div className="dt-stat-sub">{((stats.choppy / stats.total) * 100).toFixed(0)}% of set</div>
              </div>
              <div className="dt-stat-card">
                <div className="dt-stat-label">Volatile</div>
                <div className="dt-stat-value" style={{ color: 'var(--volatile)' }}>{stats.volatile}</div>
                <div className="dt-stat-sub">{((stats.volatile / stats.total) * 100).toFixed(0)}% of set</div>
              </div>
              <div className="dt-stat-card">
                <div className="dt-stat-label">Avg R²</div>
                <div className="dt-stat-value">{stats.avgR2.toFixed(3)}</div>
                <div className="dt-stat-sub">trend clarity</div>
              </div>
            </div>
          )}

          {/* Download panel */}
          {activeTab === 'download' && (
            <div className="dt-dl-panel">
              <div className="dt-dl-title">⤓ Export Data</div>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                Symbol: <strong>{symbol.toUpperCase() || 'ALL'}</strong> · Period: {period}d · Last {daysBack} days
              </span>
              <button className="dt-dl-btn dt-dl-csv" onClick={() => handleDownload('csv')}>
                📄 CSV
              </button>
              <button className="dt-dl-btn dt-dl-xlsx" onClick={() => handleDownload('xlsx')}>
                📊 Excel
              </button>
              <button className="dt-dl-btn dt-dl-pdf" onClick={() => handleDownload('pdf')}>
                📑 PDF
              </button>
              <button className="dt-dl-btn dt-dl-json" onClick={() => handleDownload('json')}>
                {'{ }'} JSON
              </button>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
                Enter a symbol above for single-asset export
              </span>
            </div>
          )}

          {/* Table */}
          <div className="dt-table-wrap">
            <div className="dt-table-scroll">
              {loading ? (
                <div className="dt-loading">
                  <div className="dt-spinner" />
                  Fetching MSS records…
                </div>
              ) : error ? (
                <div className="dt-empty">
                  <div className="dt-empty-icon">⚠</div>
                  {error}
                </div>
              ) : data.length === 0 ? (
                <div className="dt-empty">
                  <div className="dt-empty-icon">📭</div>
                  No records found. Adjust filters and run the query.
                </div>
              ) : (
                <table className="dt-table">
                  <thead>
                    <tr>
                      {[
                        ['date_taken',        'Date'],
                        ['symbol',            'Symbol'],
                        ['asset_class',       'Class'],
                        ['period_days',       'Period'],
                        ['mss',               'MSS'],
                        ['category',          'Status'],
                        ['r_squared',         'R²'],
                        ['volatility',        'Volatility'],
                        ['trend_consistency', 'Trend Cons.'],
                        ['trend_strength',    'Trend Str.'],
                        ['current_price',     'Price'],
                        ['price_change',      'Chg%'],
                        ['analyst_rating_pct','Analyst%'],
                        ['analyst_bias',      'A.Bias'],
                        ['put_call_ratio',    'P/C Ratio'],
                        ['put_call_bias',     'PC Bias'],
                      ].map(([k, label]) => (
                        <th key={k} onClick={() => handleSort(k)}>
                          {label}<SortIcon k={k} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={`${row.symbol}-${row.date_taken}-${row.period_days}-${i}`}>
                        <td style={{ color: 'var(--muted)', fontSize: 11 }}>{row.date_taken}</td>
                        <td><span className="dt-symbol">{row.symbol}</span></td>
                        <td>
                          <span style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 20,
                            background: 'var(--ice)',
                            color: 'var(--deep)',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}>
                            {row.asset_class}
                          </span>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{row.period_days}d</td>
                        <td style={{ minWidth: 130 }}><MSSBar mss={row.mss} /></td>
                        <td>{categoryBadge(row.category)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          {fmt(row.r_squared, 4)}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          {fmt(row.volatility, 5)}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          {fmt(row.trend_consistency, 3)}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          {fmt(row.trend_strength, 3)}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          ${fmt(row.current_price, 2)}
                        </td>
                        <td style={{
                          color: row.price_change >= 0 ? 'var(--stable)' : 'var(--volatile)',
                          fontWeight: 600,
                          fontSize: 12,
                        }}>
                          {row.price_change >= 0 ? '+' : ''}{fmt(row.price_change, 2)}%
                        </td>
                        <td>
                          {row.analyst_rating_pct != null ? (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                              {row.analyst_rating_pct.toFixed(1)}%
                            </span>
                          ) : '—'}
                        </td>
                        <td>{biasBadge(row.analyst_bias)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {fmt(row.put_call_ratio, 3)}
                        </td>
                        <td>{biasBadge(row.put_call_bias)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {!loading && data.length > 0 && (
              <div className="dt-pagination">
                <div className="dt-pag-info">
                  Showing {(page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)} of {total} records
                </div>
                <div className="dt-pag-btns">
                  <button className="dt-pag-btn" disabled={page <= 1} onClick={() => fetchHistory(1)}>«</button>
                  <button className="dt-pag-btn" disabled={page <= 1} onClick={() => fetchHistory(page - 1)}>‹ Prev</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = Math.max(1, page - 3) + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        className={`dt-pag-btn ${p === page ? 'active' : ''}`}
                        onClick={() => fetchHistory(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button className="dt-pag-btn" disabled={page >= totalPages} onClick={() => fetchHistory(page + 1)}>Next ›</button>
                  <button className="dt-pag-btn" disabled={page >= totalPages} onClick={() => fetchHistory(totalPages)}>»</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}