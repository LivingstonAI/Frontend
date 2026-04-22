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

  .dt-body {
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

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

  /* Period Status Panel */
  .dt-status-panel {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .dt-status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: var(--navy);
    color: var(--white);
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
  .dt-status-header:hover { background: var(--deep); }
  .dt-status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    padding: 16px;
  }
  .dt-period-card {
    background: var(--ice);
    border-radius: var(--radius-sm);
    padding: 12px;
    border-left: 4px solid var(--muted);
    transition: all 0.2s ease;
  }
  .dt-period-card.running { border-left-color: var(--blue); background: #E8F4FD; }
  .dt-period-card.completed { border-left-color: var(--stable); }
  .dt-period-card.failed { border-left-color: var(--volatile); }
  .dt-period-title {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 6px;
  }
  .dt-period-status {
    font-size: 10px;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    margin-bottom: 8px;
  }
  .dt-status-pending { background: var(--border); color: var(--muted); }
  .dt-status-running { background: var(--blue); color: white; animation: pulse 1.5s ease-in-out infinite; }
  .dt-status-completed { background: var(--stable); color: white; }
  .dt-status-failed { background: var(--volatile); color: white; }
  .dt-period-info {
    font-size: 10px;
    color: var(--muted);
    margin-top: 6px;
  }
  .dt-period-current {
    font-size: 9px;
    font-family: var(--font-mono);
    color: var(--deep);
    margin-top: 6px;
    word-break: break-all;
  }
  .dt-run-btn {
    margin-top: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    background: var(--deep);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .dt-run-btn:hover:not(:disabled) { 
    background: var(--navy); 
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  .dt-run-btn:disabled { 
    opacity: 0.6; 
    cursor: not-allowed;
    transform: none;
  }
  .dt-run-btn-loading {
    background: var(--muted);
    cursor: wait;
  }
  .dt-spinner-small {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Advanced Filters Panel */
  .dt-filters-panel {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .dt-filters-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: var(--ice);
    cursor: pointer;
    user-select: none;
    font-weight: 600;
    font-size: 13px;
  }
  .dt-filters-header:hover { background: var(--sky); }
  .dt-filters-grid {
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    border-top: 1px solid var(--border);
    max-height: 500px;
    overflow-y: auto;
  }
  .dt-filter-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .dt-filter-item label {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .dt-filter-input, .dt-filter-select {
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    background: var(--offwhite);
    outline: none;
  }
  .dt-filter-input:focus, .dt-filter-select:focus {
    border-color: var(--blue);
    background: var(--white);
  }
  .dt-range-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .dt-range-group input {
    flex: 1;
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    background: var(--offwhite);
  }
  .dt-range-group span { font-size: 11px; color: var(--muted); }
  .dt-filter-actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .dt-btn-sm {
    padding: 6px 14px;
    font-size: 11px;
  }

  /* Quick filter bar */
  .dt-quick-bar {
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
  .dt-quick-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 120px;
  }
  .dt-quick-label {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .dt-quick-input, .dt-quick-select {
    padding: 7px 11px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    background: var(--offwhite);
    outline: none;
    width: 100%;
  }
  .dt-divider {
    width: 1px;
    height: 36px;
    background: var(--border);
  }
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
  }
  .dt-btn-primary { background: var(--deep); color: var(--white); }
  .dt-btn-primary:hover { background: var(--navy); }
  .dt-btn-secondary { background: var(--ice); color: var(--deep); border: 1.5px solid var(--border); }
  .dt-btn-secondary:hover { background: var(--sky); }

  /* Stats bar */
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

  /* Active filters tags */
  .dt-active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  .dt-filter-tag {
    background: var(--ice);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dt-filter-tag button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    font-size: 12px;
    padding: 0 2px;
  }
  .dt-filter-tag button:hover { color: var(--volatile); }

  /* Table */
  .dt-table-wrap {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .dt-table-scroll {
    overflow-x: auto;
    max-height: 65vh;
    overflow-y: auto;
  }
  table.dt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .dt-table thead tr {
    background: var(--navy);
    color: var(--white);
    position: sticky;
    top: 0;
    z-index: 10;
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
  }
  .dt-table thead th:hover { background: var(--deep); }
  .dt-table tbody tr { border-bottom: 1px solid var(--border); }
  .dt-table tbody tr:nth-child(even) { background: var(--ice); }
  .dt-table tbody tr:hover { background: var(--sky) !important; }
  .dt-table td {
    padding: 10px 14px;
    white-space: nowrap;
    color: var(--navy);
  }
  .dt-symbol { font-family: var(--font-head); font-weight: 700; font-size: 13px; color: var(--deep); }

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
  .dt-pag-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .dt-pag-btn {
    padding: 5px 12px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--white);
    color: var(--deep);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
  }
  .dt-pag-btn:hover:not(:disabled) { background: var(--ice); }
  .dt-pag-btn:disabled { opacity: .4; cursor: not-allowed; }
  .dt-pag-btn.active { background: var(--deep); color: var(--white); border-color: var(--deep); }

  .dt-dl-panel {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 22px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  .dt-dl-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--deep); }
  .dt-dl-btn {
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid;
    transition: all .18s;
  }
  .dt-dl-csv  { border-color: #1BA86D; color: #1BA86D; background: #D6F5E8; }
  .dt-dl-csv:hover  { background: #1BA86D; color: #fff; }
  .dt-dl-xlsx { border-color: var(--blue); color: var(--deep); background: var(--ice); }
  .dt-dl-xlsx:hover { background: var(--blue); color: #fff; }
  .dt-dl-pdf  { border-color: #D63B3B; color: #D63B3B; background: #FBDEDE; }
  .dt-dl-pdf:hover  { background: #D63B3B; color: #fff; }
  .dt-dl-json { border-color: var(--muted); color: var(--muted); background: var(--ice); }
  .dt-dl-json:hover { background: var(--muted); color: #fff; }

  .dt-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    gap: 14px;
    color: var(--muted);
  }
  .dt-spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  .dt-empty { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 13px; }
  .dt-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .5; }

  /* Global loading overlay */
  .dt-global-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .dt-global-loading-content {
    background: var(--white);
    padding: 24px 32px;
    border-radius: var(--radius);
    text-align: center;
    box-shadow: var(--shadow-lg);
  }
  .dt-global-loading-content .dt-spinner {
    margin: 0 auto 12px;
  }

  @media (max-width: 700px) {
    .dt-body { padding: 16px 10px 32px; }
    .dt-page-title { font-size: 20px; }
    .dt-topnav { padding: 0 14px; }
    .dt-filters-grid { grid-template-columns: 1fr; }
    .dt-status-grid { grid-template-columns: 1fr; }
  }
`;

// ── Constants ─────────────────────────────────────────────────────────────────
const PERIODS = [10, 15, 20, 30, 45, 60, 90, 180];
const ASSET_CLASSES = ['all', 'stocks', 'forex', 'indices', 'commodities', 'bonds'];
const PAGE_SIZE = 50;

const NUMERIC_COLUMNS = [
  { key: 'mss', label: 'MSS', min: 0, max: 100, step: 1, unit: '' },
  { key: 'r_squared', label: 'R²', min: 0, max: 1, step: 0.01, unit: '' },
  { key: 'volatility', label: 'Volatility', min: 0, max: 1, step: 0.01, unit: '' },
  { key: 'trend_consistency', label: 'Trend Consistency', min: 0, max: 1, step: 0.01, unit: '' },
  { key: 'trend_strength', label: 'Trend Strength', min: 0, max: 1, step: 0.01, unit: '' },
  { key: 'current_price', label: 'Price', min: 0, max: 5000, step: 10, unit: '$' },
  { key: 'price_change', label: 'Price Change %', min: -100, max: 100, step: 1, unit: '%' },
  { key: 'analyst_rating_pct', label: 'Analyst Rating %', min: 0, max: 100, step: 5, unit: '%' },
  { key: 'put_call_ratio', label: 'Put/Call Ratio', min: 0, max: 5, step: 0.1, unit: '' },
];

const TEXT_COLUMNS = [
  { key: 'symbol', label: 'Symbol', type: 'text' },
  { key: 'asset_class', label: 'Asset Class', type: 'dropdown' },
  { key: 'sector', label: 'Sector', type: 'dropdown' },
  { key: 'category', label: 'Status', type: 'dropdown' },
  { key: 'analyst_bias', label: 'Analyst Bias', type: 'dropdown' },
  { key: 'put_call_bias', label: 'Put/Call Bias', type: 'dropdown' },
];

const mssColor = (mss) => {
  if (mss >= 47) return 'var(--stable)';
  if (mss >= 30) return 'var(--choppy)';
  return 'var(--volatile)';
};

const categoryBadge = (cat) => (
  <span className={`dt-badge dt-badge-${cat}`}>
    {cat === 'stable' ? '● ' : cat === 'choppy' ? '◆ ' : '▲ '}{cat}
  </span>
);

const biasBadge = (bias) => {
  if (!bias) return <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>;
  return <span className={`dt-badge dt-badge-${bias}`}>{bias}</span>;
};

const MSSBar = ({ mss }) => (
  <div className="dt-mss-bar">
    <div className="dt-mss-track">
      <div className="dt-mss-fill" style={{ width: `${mss}%`, background: mssColor(mss) }} />
    </div>
    <span className="dt-mss-num" style={{ color: mssColor(mss) }}>{mss?.toFixed(1)}</span>
  </div>
);

const fmt = (n, dec = 4) => n == null ? '—' : typeof n === 'number' ? n.toFixed(dec) : n;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DataTracker() {
  // Base filters
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState(60);
  const [assetClass, setAssetClass] = useState('all');
  const [daysBack, setDaysBack] = useState(365);
  const [activeTab, setActiveTab] = useState('history');
  const [sortKey, setSortKey] = useState('date_taken');
  const [sortDir, setSortDir] = useState('desc');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(true);
  const [numericFilters, setNumericFilters] = useState({});
  const [textFilters, setTextFilters] = useState({});
  
  // Data state
  const [allData, setAllData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Period status state
  const [periodStatus, setPeriodStatus] = useState({});
  const [runningPeriods, setRunningPeriods] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');
  
  const debouncedSymbol = useDebounce(symbol, 500);
  const debouncedNumericFilters = useDebounce(numericFilters, 500);
  const debouncedTextFilters = useDebounce(textFilters, 500);

  // Fetch period status
  const fetchPeriodStatus = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/mss/period-status/`);
      const data = await res.json();
      if (data.success) {
        setPeriodStatus(data.periods);
      }
    } catch (e) {
      console.error("Failed to fetch period status:", e);
    }
  }, []);

  // Replace just the runPeriod function with this improved version:

const runPeriod = async (periodDays) => {
  setRunningPeriods(prev => ({ ...prev, [periodDays]: true }));
  setGlobalLoading(true);
  setGlobalLoadingMessage(`Running ${periodDays} day period snapshot... This may take a few minutes.`);
  
  try {
    console.log(`Starting manual run for period: ${periodDays}d`);
    console.log(`API URL: ${BASE_URL}/api/mss/run-period/${periodDays}/`);
    
    const res = await fetch(`${BASE_URL}/api/mss/run-period/${periodDays}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Response status: ${res.status}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`HTTP ${res.status}: ${errorText.substring(0, 100)}`);
    }
    
    const data = await res.json();
    console.log(`Response data:`, data);
    
    if (data.success) {
      alert(`✅ Period ${periodDays}d completed! Saved ${data.records_saved} records.`);
      await fetchPeriodStatus();
      // Refresh data if on history tab
      if (activeTab === 'history') {
        await fetchFilteredData();
      }
    } else {
      alert(`❌ Failed: ${data.error || 'Unknown error'}`);
    }
  } catch (e) {
    console.error(`Manual run error for period ${periodDays}:`, e);
    alert(`❌ Error: ${e.message}\n\nCheck console for details. Make sure the backend is running.`);
  } finally {
    setRunningPeriods(prev => ({ ...prev, [periodDays]: false }));
    setGlobalLoading(false);
    setGlobalLoadingMessage('');
  }
};

  // Fetch symbol list
  useEffect(() => {
    fetch(`${BASE_URL}/api/mss/symbols/`)
      .then(r => r.json())
      .then(d => { if (d.success) setSymbols(d.data); })
      .catch(() => {});
    
    fetchPeriodStatus();
    const interval = setInterval(fetchPeriodStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchPeriodStatus]);

  // Fetch summary
  useEffect(() => {
    if (activeTab !== 'summary') return;
    fetch(`${BASE_URL}/api/mss/summary/?period=${period}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSummary(d); })
      .catch(() => {});
  }, [activeTab, period]);

  // Fetch ALL filtered data from server
  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        numeric: numericFilters,
        text: textFilters
      };
      
      const params = new URLSearchParams({
        period: period,
        days: daysBack,
        symbol: debouncedSymbol.trim().toUpperCase(),
        asset_class: assetClass,
        filters: JSON.stringify(filters)
      });
      
      const res = await fetch(`${BASE_URL}/api/mss/filtered-data/?${params}`);
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error || 'Unknown error');
      
      setAllData(json.data);
      setTotalRecords(json.total);
      setCurrentPage(1);
      
    } catch (e) {
      setError(e.message);
      setAllData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSymbol, period, daysBack, assetClass, numericFilters, textFilters]);

  // Trigger fetch when filters change
  useEffect(() => {
    if (activeTab === 'history') {
      fetchFilteredData();
    }
  }, [activeTab, fetchFilteredData]);

  // Apply sorting and pagination
  useEffect(() => {
    if (!allData.length) {
      setPaginatedData([]);
      return;
    }
    
    const sorted = [...allData].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setPaginatedData(sorted.slice(start, end));
    
  }, [allData, sortKey, sortDir, currentPage]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="dt-sort">↕</span>;
    return <span className={`dt-sort ${sortDir}`}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const handleNumericFilterChange = (key, type, value) => {
    setNumericFilters(prev => ({
      ...prev,
      [key]: { ...prev[key], [type]: value }
    }));
  };

  const handleTextFilterChange = (key, value) => {
    setTextFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setNumericFilters({});
    setTextFilters({});
  };

  const clearFilter = (key, type = null) => {
    if (type) {
      setNumericFilters(prev => ({
        ...prev,
        [key]: { ...prev[key], [type]: '' }
      }));
    } else {
      setTextFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    }
  };

  const handleDownload = (fmt) => {
    const sym = debouncedSymbol.trim().toUpperCase() || 'ALL';
    const params = new URLSearchParams({ format: fmt, period, days: daysBack });
    if (fmt === 'json') {
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${sym}_mss_history.json`; a.click();
      URL.revokeObjectURL(url);
      return;
    }
    window.open(`${BASE_URL}/api/mss/download/${sym}/?${params}`, '_blank');
  };

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    for (const range of Object.values(numericFilters)) {
      if ((range.min !== '' && range.min !== undefined && range.min !== null) || 
          (range.max !== '' && range.max !== undefined && range.max !== null)) count++;
    }
    for (const val of Object.values(textFilters)) {
      if (val && val.trim() !== '' && val !== 'all') count++;
    }
    return count;
  }, [numericFilters, textFilters]);

  // Stats from filtered data
  const stats = React.useMemo(() => {
    if (!allData.length) return null;
    const mssList = allData.map(r => r.mss).filter(Boolean);
    const avgMss = mssList.reduce((a, b) => a + b, 0) / mssList.length;
    const stable = allData.filter(r => r.category === 'stable').length;
    const choppy = allData.filter(r => r.category === 'choppy').length;
    const volatile = allData.filter(r => r.category === 'volatile').length;
    const avgR2 = allData.map(r => r.r_squared).filter(Boolean).reduce((a, b) => a + b, 0) / allData.length;
    return { avgMss, stable, choppy, volatile, avgR2, total: allData.length };
  }, [allData]);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  // Get dropdown options from filtered data
  const getDropdownOptions = (key) => {
    const values = new Set();
    allData.forEach(row => {
      const val = row[key];
      if (val && val !== 'null' && val !== 'undefined') {
        values.add(val);
      }
    });
    return Array.from(values).sort();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dt-root">
        {/* Global Loading Overlay */}
        {globalLoading && (
          <div className="dt-global-loading">
            <div className="dt-global-loading-content">
              <div className="dt-spinner"></div>
              <div style={{ marginTop: 12, fontSize: 13 }}>{globalLoadingMessage}</div>
            </div>
          </div>
        )}
        
        <Header />
        <div>
          <SideNavs />
          <nav className="dt-topnav">
            <div className="dt-topnav-brand"><span /> SnowAI Tracker</div>
            <div className="dt-topnav-links">
              {[
                { id: 'history', label: 'History' },
                { id: 'summary', label: 'Daily Snapshot' },
                { id: 'download', label: 'Download Centre' },
              ].map(tab => (
                <button key={tab.id} className={`dt-nav-link ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="dt-body">
            <div className="dt-page-header">
              <div>
                <div className="dt-page-title">MSS Historical Data & Performance Tracker</div>
                <div className="dt-page-subtitle">
                  Market Stability Score · R² · Analyst Bias · Put/Call Ratio — Advanced filtering on ALL data
                </div>
              </div>
            </div>

            {/* Period Status Panel */}
            <div className="dt-status-panel">
              <div className="dt-status-header" onClick={() => setShowStatusPanel(!showStatusPanel)}>
                <span>📊 MSS Snapshot Status — Daily runs at 12:00-12:35 PM NYC</span>
                <span>{showStatusPanel ? '▼' : '▲'}</span>
              </div>
              {showStatusPanel && (
                <div className="dt-status-grid">
                  {PERIODS.map(p => {
                    const status = periodStatus[p] || { status: 'pending', records: 0, current_asset: '' };
                    const isRunning = status.status === 'running' || runningPeriods[p];
                    return (
                      <div key={p} className={`dt-period-card ${status.status}`}>
                        <div className="dt-period-title">{p} Day Period</div>
                        <div className={`dt-period-status dt-status-${status.status}`}>
                          {status.status === 'running' ? '🔄 RUNNING' : 
                           status.status === 'completed' ? '✅ COMPLETED' : 
                           status.status === 'failed' ? '❌ FAILED' : '⏳ PENDING'}
                        </div>
                        {status.status === 'running' && status.current_asset && (
                          <div className="dt-period-current">Current: {status.current_asset}</div>
                        )}
                        <div className="dt-period-info">
                          {status.records > 0 ? `${status.records.toLocaleString()} records saved` : 'No data yet'}
                          {status.last_run && <div>Last run: {new Date(status.last_run).toLocaleTimeString()}</div>}
                        </div>
                        <button 
                          className={`dt-run-btn ${isRunning ? 'dt-run-btn-loading' : ''}`}
                          onClick={() => runPeriod(p)}
                          disabled={isRunning}
                          style={{ 
                            background: isRunning ? 'var(--muted)' : 'var(--deep)',
                            cursor: isRunning ? 'wait' : 'pointer'
                          }}
                        >
                          {isRunning ? (
                            <>
                              <span className="dt-spinner-small"></span>
                              Running...
                            </>
                          ) : (
                            '▶ Run Now'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Filters Bar */}
            <div className="dt-quick-bar">
              <div className="dt-quick-group">
                <div className="dt-quick-label">Symbol</div>
                <input className="dt-quick-input" placeholder="Type symbol..." value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} list="sym-list" />
                <datalist id="sym-list">{symbols.slice(0, 200).map(s => <option key={s.symbol} value={s.symbol} />)}</datalist>
              </div>
              <div className="dt-quick-group">
                <div className="dt-quick-label">Period (days)</div>
                <select className="dt-quick-select" value={period} onChange={e => setPeriod(+e.target.value)}>
                  {PERIODS.map(p => <option key={p} value={p}>{p}d</option>)}
                </select>
              </div>
              <div className="dt-quick-group">
                <div className="dt-quick-label">Asset Class</div>
                <select className="dt-quick-select" value={assetClass} onChange={e => setAssetClass(e.target.value)}>
                  {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="dt-quick-group">
                <div className="dt-quick-label">Days back</div>
                <select className="dt-quick-select" value={daysBack} onChange={e => setDaysBack(+e.target.value)}>
                  {[30, 60, 90, 180, 365, 730].map(d => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
              <div className="dt-divider" />
              <button className="dt-btn dt-btn-primary" disabled={loading} onClick={fetchFilteredData}>
                {loading ? 'Loading…' : '⟳ Apply Filters'}
              </button>
              <button className="dt-btn dt-btn-secondary" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                🔍 {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="dt-filters-panel">
                <div className="dt-filters-header" onClick={() => setShowAdvancedFilters(false)}>
                  <span>⚙️ Advanced Filters — Filter by any column (applies to ALL {totalRecords} records)</span>
                  <span>▼</span>
                </div>
                <div className="dt-filters-grid">
                  {NUMERIC_COLUMNS.map(col => (
                    <div key={col.key} className="dt-filter-item">
                      <label>{col.label} {col.unit && `(${col.unit})`}</label>
                      <div className="dt-range-group">
                        <input 
                          type="number" 
                          placeholder={`Min ${col.min}`} 
                          step={col.step} 
                          value={numericFilters[col.key]?.min || ''} 
                          onChange={e => handleNumericFilterChange(col.key, 'min', e.target.value)} 
                        />
                        <span>to</span>
                        <input 
                          type="number" 
                          placeholder={`Max ${col.max}`} 
                          step={col.step} 
                          value={numericFilters[col.key]?.max || ''} 
                          onChange={e => handleNumericFilterChange(col.key, 'max', e.target.value)} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  {TEXT_COLUMNS.map(col => (
                    <div key={col.key} className="dt-filter-item">
                      <label>{col.label}</label>
                      {col.type === 'dropdown' ? (
                        <select 
                          className="dt-filter-select" 
                          value={textFilters[col.key] || 'all'} 
                          onChange={e => handleTextFilterChange(col.key, e.target.value)}
                        >
                          <option value="all">All {col.label}s</option>
                          {getDropdownOptions(col.key).map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          className="dt-filter-input" 
                          type="text" 
                          placeholder={`Filter by ${col.label.toLowerCase()}...`} 
                          value={textFilters[col.key] || ''} 
                          onChange={e => handleTextFilterChange(col.key, e.target.value)} 
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="dt-filter-actions">
                    <button className="dt-btn-sm dt-btn-secondary" onClick={clearAllFilters}>Clear All Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="dt-active-filters">
                {Object.entries(numericFilters).map(([key, range]) => {
                  const col = NUMERIC_COLUMNS.find(c => c.key === key);
                  const label = col?.label || key;
                  const parts = [];
                  if (range.min !== '' && range.min !== undefined && range.min !== null) parts.push(`${label} ≥ ${range.min}${col?.unit || ''}`);
                  if (range.max !== '' && range.max !== undefined && range.max !== null) parts.push(`${label} ≤ ${range.max}${col?.unit || ''}`);
                  return parts.map(part => (
                    <div key={`${key}-${part}`} className="dt-filter-tag">
                      {part}
                      <button onClick={() => {
                        if (range.min !== '') handleNumericFilterChange(key, 'min', '');
                        if (range.max !== '') handleNumericFilterChange(key, 'max', '');
                      }}>✕</button>
                    </div>
                  ));
                })}
                {Object.entries(textFilters).map(([key, value]) => {
                  if (!value || value.trim() === '' || value === 'all') return null;
                  const col = TEXT_COLUMNS.find(c => c.key === key);
                  const label = col?.label || key;
                  return (
                    <div key={key} className="dt-filter-tag">
                      {label} = {value}
                      <button onClick={() => clearFilter(key)}>✕</button>
                    </div>
                  );
                })}
                {activeFilterCount > 1 && (
                  <div className="dt-filter-tag" style={{ background: 'var(--volatile)', color: 'white' }}>
                    <button onClick={clearAllFilters} style={{ color: 'white' }}>Clear All ✕</button>
                  </div>
                )}
              </div>
            )}

            {/* Stats Bar */}
            {stats && (
              <div className="dt-stats">
                <div className="dt-stat-card">
                  <div className="dt-stat-label">Total Records</div>
                  <div className="dt-stat-value">{stats.total.toLocaleString()}</div>
                  <div className="dt-stat-sub">after filters</div>
                </div>
                <div className="dt-stat-card">
                  <div className="dt-stat-label">Avg MSS</div>
                  <div className="dt-stat-value" style={{ color: mssColor(stats.avgMss) }}>{stats.avgMss.toFixed(1)}</div>
                  <div className="dt-stat-sub">across filtered data</div>
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

            {/* Download Panel */}
            {activeTab === 'download' && (
              <div className="dt-dl-panel">
                <div className="dt-dl-title">⤓ Export Data</div>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  <strong>{allData.length.toLocaleString()} records</strong> match current filters
                </span>
                <button className="dt-dl-btn dt-dl-csv" onClick={() => handleDownload('csv')}>📄 CSV</button>
                <button className="dt-dl-btn dt-dl-xlsx" onClick={() => handleDownload('xlsx')}>📊 Excel</button>
                <button className="dt-dl-btn dt-dl-pdf" onClick={() => handleDownload('pdf')}>📑 PDF</button>
                <button className="dt-dl-btn dt-dl-json" onClick={() => handleDownload('json')}>{'{ }'} JSON</button>
              </div>
            )}

            {/* Table */}
            <div className="dt-table-wrap">
              <div className="dt-table-scroll">
                {loading ? (
                  <div className="dt-loading"><div className="dt-spinner" />Fetching {totalRecords.toLocaleString()} records…</div>
                ) : error ? (
                  <div className="dt-empty"><div className="dt-empty-icon">⚠</div>{error}</div>
                ) : paginatedData.length === 0 ? (
                  <div className="dt-empty"><div className="dt-empty-icon">📭</div>No records match your filters. Try adjusting them.</div>
                ) : (
                  <table className="dt-table">
                    <thead>
                      <tr>
                        {[['date_taken','Date'],['symbol','Symbol'],['asset_class','Class'],['period_days','Period'],['mss','MSS'],['category','Status'],['r_squared','R²'],['volatility','Volatility'],['trend_consistency','Trend Cons.'],['trend_strength','Trend Str.'],['current_price','Price'],['price_change','Chg%'],['analyst_rating_pct','Analyst%'],['analyst_bias','A.Bias'],['put_call_ratio','P/C Ratio'],['put_call_bias','PC Bias']].map(([k,label]) => (
                          <th key={k} onClick={() => handleSort(k)}>{label}<SortIcon k={k} /></th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((row, i) => (
                        <tr key={`${row.symbol}-${row.date_taken}-${row.period_days}-${i}`}>
                          <td style={{ color: 'var(--muted)', fontSize: 11 }}>{row.date_taken}</td>
                          <td><span className="dt-symbol">{row.symbol}</span></td>
                          <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--ice)', color: 'var(--deep)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{row.asset_class}</span></td>
                          <td style={{ color: 'var(--muted)' }}>{row.period_days}d</td>
                          <td style={{ minWidth: 130 }}><MSSBar mss={row.mss} /></td>
                          <td>{categoryBadge(row.category)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.r_squared, 4)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.volatility, 5)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.trend_consistency, 3)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.trend_strength, 3)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>${fmt(row.current_price, 2)}</td>
                          <td style={{ color: row.price_change >= 0 ? 'var(--stable)' : 'var(--volatile)', fontWeight: 600, fontSize: 12 }}>{row.price_change >= 0 ? '+' : ''}{fmt(row.price_change, 2)}%</td>
                          <td>{row.analyst_rating_pct != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{row.analyst_rating_pct.toFixed(1)}%</span> : '—'}</td>
                          <td>{biasBadge(row.analyst_bias)}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(row.put_call_ratio, 3)}</td>
                          <td>{biasBadge(row.put_call_bias)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {!loading && allData.length > 0 && (
                <div className="dt-pagination">
                  <div className="dt-pag-info">
                    Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalRecords)} of {totalRecords.toLocaleString()} filtered records
                  </div>
                  <div className="dt-pag-btns">
                    <button className="dt-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>«</button>
                    <button className="dt-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>‹ Prev</button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = Math.max(1, currentPage - 3) + i;
                      if (p > totalPages) return null;
                      return (
                        <button key={p} className={`dt-pag-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>
                          {p}
                        </button>
                      );
                    })}
                    <button className="dt-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next ›</button>
                    <button className="dt-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
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