import React, { useEffect, useState, useCallback, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import * as LightweightCharts from "lightweight-charts";

const BASE_URL = "https://backend-production-c0ab.up.railway.app";

// ── CSS Styles ─────────────────────────────────────────────────────────────
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

  [data-theme="light"] {
    --bg-primary: #F5FAFE;
    --bg-secondary: #FFFFFF;
    --text-primary: #0D2D45;
    --text-secondary: #7BA9C4;
    --border-color: #CBE4F2;
    --card-bg: #FFFFFF;
  }

  [data-theme="dark"] {
    --bg-primary: #1a1a2e;
    --bg-secondary: #16213e;
    --text-primary: #EEEEEE;
    --text-secondary: #AAAAAA;
    --border-color: #2a2a4a;
    --card-bg: #16213e;
    --ice: #1a1a3e;
    --sky: #2a2a5e;
    --offwhite: #1a1a2e;
    --white: #16213e;
    --border: #2a2a4a;
    --muted: #888;
    --navy: #ddd;
  }

  [data-theme="hud"] {
    --bg-primary: rgba(0, 0, 0, 0.9);
    --bg-secondary: rgba(10, 20, 30, 0.7);
    --text-primary: #0ff;
    --text-secondary: #0fa;
    --border-color: #0ff;
    --card-bg: rgba(10, 30, 40, 0.5);
    --ice: rgba(0, 255, 255, 0.1);
    --sky: rgba(0, 255, 255, 0.2);
    --offwhite: rgba(0, 0, 0, 0.8);
    --white: rgba(10, 30, 40, 0.6);
    --border: #0ff;
    --muted: #0fa;
    --navy: #0ff;
    --shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    --shadow-lg: 0 0 30px rgba(0, 255, 255, 0.3);
  }

  .dt-root {
    min-height: 100vh;
    background: var(--bg-primary);
    font-family: var(--font-mono);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  .dt-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-secondary);
    border-bottom: 1.5px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 28px;
    height: 52px;
    box-shadow: var(--shadow);
  }
  .dt-topnav-brand {
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 800;
    color: var(--text-primary);
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
    color: var(--text-secondary);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    white-space: nowrap;
    transition: all .18s;
    font-weight: 500;
  }
  .dt-nav-link:hover { background: var(--ice); color: var(--text-primary); }
  .dt-nav-link.active { background: var(--ice); color: var(--text-primary); font-weight: 600; }

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
    color: var(--text-primary);
    letter-spacing: -0.03em;
  }
  .dt-page-subtitle {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .dt-status-panel {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .dt-status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: var(--deep);
    color: white;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
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
  }
  .dt-period-card.running { border-left-color: var(--blue); }
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
  .dt-status-pending { background: var(--border); color: var(--text-secondary); }
  .dt-status-running { background: var(--blue); color: white; animation: pulse 1.5s ease-in-out infinite; }
  .dt-status-completed { background: var(--stable); color: white; }
  .dt-status-failed { background: var(--volatile); color: white; }
  .dt-period-info { font-size: 10px; color: var(--text-secondary); margin-top: 6px; }
  .dt-period-current { font-size: 9px; font-family: var(--font-mono); color: var(--text-primary); margin-top: 6px; word-break: break-all; }
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
  .dt-run-btn:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
  .dt-run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .dt-spinner-small {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .dt-quick-bar, .dt-filters-panel, .dt-dl-panel {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    margin-bottom: 22px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  .dt-filters-panel { display: block; padding: 0; overflow: hidden; }
  .dt-filters-header {
    padding: 14px 18px;
    background: var(--ice);
    cursor: pointer;
    font-weight: 600;
  }
  .dt-filters-grid {
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    border-top: 1px solid var(--border-color);
    max-height: 500px;
    overflow-y: auto;
  }
  .dt-filter-item { display: flex; flex-direction: column; gap: 5px; }
  .dt-filter-item label { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; }
  .dt-filter-input, .dt-filter-select {
    padding: 7px 10px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
  .dt-range-group { display: flex; gap: 8px; align-items: center; }
  .dt-range-group input { flex: 1; padding: 7px 10px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-primary); color: var(--text-primary); }
  .dt-quick-group { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 120px; }
  .dt-quick-label { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 500; }
  .dt-quick-input, .dt-quick-select {
    padding: 7px 11px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    background: var(--bg-primary);
    color: var(--text-primary);
    width: 100%;
  }
  .dt-divider { width: 1px; height: 36px; background: var(--border-color); }
  .dt-btn {
    padding: 8px 18px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all .18s;
  }
  .dt-btn-primary { background: var(--deep); color: white; }
  .dt-btn-primary:hover { opacity: 0.8; }
  .dt-btn-secondary { background: var(--ice); color: var(--text-primary); border: 1.5px solid var(--border-color); }
  .dt-btn-sm { padding: 6px 14px; font-size: 11px; }

  .dt-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    margin-bottom: 22px;
  }
  .dt-stat-card {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    padding: 16px 18px;
    box-shadow: var(--shadow);
  }
  .dt-stat-label { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; font-weight: 500; }
  .dt-stat-value { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--text-primary); margin-top: 4px; }

  .dt-active-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .dt-filter-tag {
    background: var(--ice);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dt-filter-tag button { background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 12px; }

  .dt-column-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding: 10px 16px;
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
  }
  .dt-column-dropdown {
    position: relative;
    display: inline-block;
  }
  .dt-column-dropdown-content {
    display: none;
    position: absolute;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    z-index: 100;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
  }
  .dt-column-dropdown:hover .dt-column-dropdown-content {
    display: block;
  }
  .dt-column-checkbox {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 11px;
  }
  .dt-column-checkbox:hover { background: var(--ice); }

  .dt-table-wrap {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
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
    background: var(--deep);
    color: white;
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
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
  }
  .dt-table tbody tr { border-bottom: 1px solid var(--border-color); }
  .dt-table tbody tr:nth-child(even) { background: var(--ice); }
  .dt-table tbody tr:hover { background: var(--sky) !important; }
  .dt-table td { padding: 10px 14px; white-space: nowrap; color: var(--text-primary); }
  .dt-symbol { font-family: var(--font-head); font-weight: 700; font-size: 13px; }

  .dt-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .dt-badge-stable { background: #D6F5E8; color: #1BA86D; }
  .dt-badge-choppy { background: #FEF0D6; color: #C07A10; }
  .dt-badge-volatile { background: #FBDEDE; color: #D63B3B; }
  .dt-badge-bullish { background: #D6F5E8; color: #1BA86D; }
  .dt-badge-bearish { background: #FBDEDE; color: #D63B3B; }
  .dt-badge-neutral { background: var(--ice); color: var(--text-secondary); }

  .dt-mss-bar { display: flex; align-items: center; gap: 8px; }
  .dt-mss-track { flex: 1; height: 5px; background: var(--ice); border-radius: 3px; min-width: 60px; overflow: hidden; }
  .dt-mss-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
  .dt-mss-num { font-family: var(--font-head); font-weight: 700; font-size: 13px; min-width: 36px; text-align: right; }

  .dt-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1.5px solid var(--border-color);
    flex-wrap: wrap;
    gap: 8px;
  }
  .dt-pag-info { font-size: 11px; color: var(--text-secondary); }
  .dt-pag-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .dt-pag-btn {
    padding: 5px 12px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--card-bg);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
  }
  .dt-pag-btn.active { background: var(--deep); color: white; border-color: var(--deep); }
  .dt-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .dt-dl-btn {
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid;
    transition: all .18s;
  }
  .dt-dl-csv { border-color: #1BA86D; color: #1BA86D; background: #D6F5E8; }
  .dt-dl-xlsx { border-color: var(--blue); color: var(--deep); background: var(--ice); }
  .dt-dl-pdf { border-color: #D63B3B; color: #D63B3B; background: #FBDEDE; }
  .dt-dl-json { border-color: var(--text-secondary); color: var(--text-secondary); background: var(--ice); }

  .dt-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 14px; }
  .dt-spinner { width: 32px; height: 32px; border: 3px solid var(--border-color); border-top-color: var(--blue); border-radius: 50%; animation: spin .7s linear infinite; }
  .dt-empty { text-align: center; padding: 60px 24px; color: var(--text-secondary); }

  .chart-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-primary);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  .chart-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .chart-modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-primary);
  }
  .chart-container {
    flex: 1;
    position: relative;
    min-height: 400px;
    background: var(--bg-secondary);
  }
  .chart-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    border-radius: 0 0 var(--radius) var(--radius);
  }
  .chart-btn {
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
    background: var(--ice);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
  .chart-btn.active {
    background: var(--blue);
    color: white;
  }
  .theme-selector { margin-left: auto; display: flex; gap: 5px; }

  .compare-panel {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    margin-bottom: 22px;
    padding: 16px;
  }
  .compare-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .compare-symbols {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  .compare-tag {
    background: var(--ice);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .compare-tag button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--volatile);
  }
  .compare-chart-container {
    height: 400px;
    position: relative;
  }

  @media (max-width: 700px) {
    .dt-body { padding: 16px 10px 32px; }
    .dt-page-title { font-size: 20px; }
    .dt-topnav { padding: 0 14px; }
    .dt-filters-grid { grid-template-columns: 1fr; }
    .dt-status-grid { grid-template-columns: 1fr; }
    .dt-quick-bar { flex-direction: column; align-items: stretch; }
  }
`;

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

const ALL_COLUMNS = [
  { key: 'date_taken', label: 'Date' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'asset_class', label: 'Class' },
  { key: 'period_days', label: 'Period' },
  { key: 'mss', label: 'MSS' },
  { key: 'category', label: 'Status' },
  { key: 'r_squared', label: 'R²' },
  { key: 'volatility', label: 'Volatility' },
  { key: 'trend_consistency', label: 'Trend Cons.' },
  { key: 'trend_strength', label: 'Trend Str.' },
  { key: 'current_price', label: 'Price' },
  { key: 'price_change', label: 'Chg%' },
  { key: 'analyst_rating_pct', label: 'Analyst%' },
  { key: 'analyst_bias', label: 'A.Bias' },
  { key: 'put_call_ratio', label: 'P/C Ratio' },
  { key: 'put_call_bias', label: 'PC Bias' },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Individual Asset Chart Component
const AssetChart = ({ symbol, onClose, initialTheme = 'light' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const mssLineSeriesRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1mo');
  const [interval, setInterval] = useState('1d');
  const [theme, setTheme] = useState(initialTheme);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showMSSOverlay, setShowMSSOverlay] = useState(true);
  const [metadata, setMetadata] = useState(null);

  const timeframes = [
    { label: '1D', period: '1d', interval: '5m' },
    { label: '5D', period: '5d', interval: '15m' },
    { label: '1M', period: '1mo', interval: '1h' },
    { label: '3M', period: '3mo', interval: '1d' },
    { label: '6M', period: '6mo', interval: '1d' },
    { label: '1Y', period: '1y', interval: '1d' },
    { label: '2Y', period: '2y', interval: '1wk' },
    { label: '5Y', period: '5y', interval: '1wk' },
  ];

  const getChartTheme = () => ({
    light: { layout: { background: { color: '#FFFFFF' }, textColor: '#0D2D45' }, grid: { vertLines: { color: '#EAF4FB' }, horzLines: { color: '#EAF4FB' } } },
    dark: { layout: { background: { color: '#16213e' }, textColor: '#EEEEEE' }, grid: { vertLines: { color: '#2a2a4a' }, horzLines: { color: '#2a2a4a' } } },
    hud: { layout: { background: { color: 'rgba(0,0,0,0.85)' }, textColor: '#0ff' }, grid: { vertLines: { color: '#0ff' }, horzLines: { color: '#0ff' } } }
  });

  const fetchChartData = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/mss-chart/v1/data/${symbol}/?period=${timeframe}&interval=${interval}`);
      const data = await res.json();
      if (data.success && candlestickSeriesRef.current && volumeSeriesRef.current) {
        candlestickSeriesRef.current.setData(data.data);
        const volumeData = data.data.map(d => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? '#1BA86D' : '#D63B3B'
        }));
        volumeSeriesRef.current.setData(volumeData);
        setMetadata(data.metadata);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }, [symbol, timeframe, interval]);

  const fetchMSSData = useCallback(async () => {
    if (!showMSSOverlay || !mssLineSeriesRef.current) return;
    try {
      const res = await fetch(`${BASE_URL}/api/mss-chart/v1/mss-overlay/${symbol}/?period=60&days=365`);
      const data = await res.json();
      if (data.success) {
        const lineData = data.data.map(d => ({ time: d.time, value: d.value }));
        mssLineSeriesRef.current.setData(lineData);
      }
    } catch (error) {
      console.error('Error fetching MSS data:', error);
    }
  }, [symbol, showMSSOverlay]);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = LightweightCharts.createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        ...getChartTheme()[theme]
      });
      
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#1BA86D', downColor: '#D63B3B', borderVisible: false,
        wickUpColor: '#1BA86D', wickDownColor: '#D63B3B'
      });
      
      volumeSeriesRef.current = chartRef.current.addHistogramSeries({
        color: '#7BA9C4', priceFormat: { type: 'volume' }, priceScaleId: ''
      });
      
      mssLineSeriesRef.current = chartRef.current.addLineSeries({
        color: '#3A9FD5', lineWidth: 2, priceLineVisible: false, title: 'MSS'
      });
      
      chartRef.current.timeScale().fitContent();
    }
    
    if (chartRef.current) {
      chartRef.current.applyOptions(getChartTheme()[theme]);
    }
    
    fetchChartData();
    fetchMSSData();
    setLoading(false);
  }, [symbol, timeframe, interval, theme, fetchChartData, fetchMSSData]);

  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => { fetchChartData(); fetchMSSData(); }, 60000);
    }
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchChartData, fetchMSSData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTimeframeChange = (tf, intv) => {
    setTimeframe(tf);
    setInterval(intv);
  };

  return React.createElement('div', { className: 'chart-modal-overlay', 'data-theme': theme },
    React.createElement('div', { className: 'chart-modal-header' },
      React.createElement('div', null,
        React.createElement('h3', null, symbol, ' - ', metadata?.name || symbol),
        React.createElement('small', null, metadata?.sector, ' | ', metadata?.currency)
      ),
      React.createElement('div', { className: 'theme-selector' },
        React.createElement('button', { className: `chart-btn ${theme === 'light' ? 'active' : ''}`, onClick: () => setTheme('light') }, '☀️ Light'),
        React.createElement('button', { className: `chart-btn ${theme === 'dark' ? 'active' : ''}`, onClick: () => setTheme('dark') }, '🌙 Dark'),
        React.createElement('button', { className: `chart-btn ${theme === 'hud' ? 'active' : ''}`, onClick: () => setTheme('hud') }, '🖥️ HUD')
      ),
      React.createElement('button', { className: 'chart-modal-close', onClick: onClose }, '✕')
    ),
    React.createElement('div', { className: 'chart-container', ref: chartContainerRef }, loading && React.createElement('div', { style: { textAlign: 'center', padding: 50 } }, 'Loading chart...')),
    React.createElement('div', { className: 'chart-controls' },
      timeframes.map(tf => React.createElement('button', { key: tf.label, className: `chart-btn ${timeframe === tf.period && interval === tf.interval ? 'active' : ''}`, onClick: () => handleTimeframeChange(tf.period, tf.interval) }, tf.label)),
      React.createElement('button', { className: `chart-btn ${showMSSOverlay ? 'active' : ''}`, onClick: () => { setShowMSSOverlay(!showMSSOverlay); fetchMSSData(); } }, '📊 MSS'),
      React.createElement('button', { className: `chart-btn ${autoRefresh ? 'active' : ''}`, onClick: () => setAutoRefresh(!autoRefresh) }, '🔄 Auto-refresh ', autoRefresh ? 'ON' : 'OFF'),
      React.createElement('button', { className: 'chart-btn', onClick: fetchChartData }, '⟳ Refresh')
    )
  );
};

// Multi-Asset Comparison Chart Component
const MultiCompareChart = ({ symbols, onClose, initialTheme = 'light' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1mo');
  const [theme, setTheme] = useState(initialTheme);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const timeframes = [
    { label: '1M', period: '1mo' }, { label: '3M', period: '3mo' }, 
    { label: '6M', period: '6mo' }, { label: '1Y', period: '1y' }, 
    { label: '2Y', period: '2y' }, { label: '5Y', period: '5y' }
  ];

  const colors = ['#3A9FD5', '#1BA86D', '#D63B3B', '#E89C2A', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'];

  const getChartTheme = () => ({
    light: { layout: { background: { color: '#FFFFFF' }, textColor: '#0D2D45' }, grid: { vertLines: { color: '#EAF4FB' }, horzLines: { color: '#EAF4FB' } } },
    dark: { layout: { background: { color: '#16213e' }, textColor: '#EEEEEE' }, grid: { vertLines: { color: '#2a2a4a' }, horzLines: { color: '#2a2a4a' } } },
    hud: { layout: { background: { color: 'rgba(0,0,0,0.85)' }, textColor: '#0ff' }, grid: { vertLines: { color: '#0ff' }, horzLines: { color: '#0ff' } } }
  });

  const fetchComparisonData = useCallback(async () => {
    try {
      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const res = await fetch(`${BASE_URL}/api/mss-chart/v1/data/${symbol}/?period=${timeframe}&interval=1d`);
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          const priceData = data.data.map(d => ({
            time: d.time,
            value: d.close
          }));
          
          if (seriesRefs.current[symbol]) {
            seriesRefs.current[symbol].setData(priceData);
          } else if (chartRef.current) {
            const lineSeries = chartRef.current.addLineSeries({
              color: colors[i % colors.length],
              lineWidth: 2,
              title: symbol,
              priceLineVisible: false
            });
            lineSeries.setData(priceData);
            seriesRefs.current[symbol] = lineSeries;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
  }, [symbols, timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = LightweightCharts.createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        ...getChartTheme()[theme]
      });
      chartRef.current.timeScale().fitContent();
    }
    
    if (chartRef.current) {
      chartRef.current.applyOptions(getChartTheme()[theme]);
    }
    
    fetchComparisonData();
    setLoading(false);
  }, [symbols, timeframe, theme, fetchComparisonData]);

  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchComparisonData, 60000);
    }
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchComparisonData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return React.createElement('div', { className: 'chart-modal-overlay', 'data-theme': theme },
    React.createElement('div', { className: 'chart-modal-header' },
      React.createElement('div', null,
        React.createElement('h3', null, 'Comparison: ', symbols.join(', ')),
        React.createElement('small', null, 'Normalized price comparison')
      ),
      React.createElement('div', { className: 'theme-selector' },
        React.createElement('button', { className: `chart-btn ${theme === 'light' ? 'active' : ''}`, onClick: () => setTheme('light') }, '☀️ Light'),
        React.createElement('button', { className: `chart-btn ${theme === 'dark' ? 'active' : ''}`, onClick: () => setTheme('dark') }, '🌙 Dark'),
        React.createElement('button', { className: `chart-btn ${theme === 'hud' ? 'active' : ''}`, onClick: () => setTheme('hud') }, '🖥️ HUD')
      ),
      React.createElement('button', { className: 'chart-modal-close', onClick: onClose }, '✕')
    ),
    React.createElement('div', { className: 'chart-container', ref: chartContainerRef }, loading && React.createElement('div', { style: { textAlign: 'center', padding: 50 } }, 'Loading charts...')),
    React.createElement('div', { className: 'chart-controls' },
      timeframes.map(tf => React.createElement('button', { key: tf.label, className: `chart-btn ${timeframe === tf.period ? 'active' : ''}`, onClick: () => setTimeframe(tf.period) }, tf.label)),
      React.createElement('button', { className: `chart-btn ${autoRefresh ? 'active' : ''}`, onClick: () => setAutoRefresh(!autoRefresh) }, '🔄 Auto-refresh ', autoRefresh ? 'ON' : 'OFF'),
      React.createElement('button', { className: 'chart-btn', onClick: fetchComparisonData }, '⟳ Refresh')
    )
  );
};

// Main Component
export default function DataTracker() {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState(60);
  const [assetClass, setAssetClass] = useState('all');
  const [daysBack, setDaysBack] = useState(365);
  const [activeTab, setActiveTab] = useState('history');
  const [sortKey, setSortKey] = useState('date_taken');
  const [sortDir, setSortDir] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(true);
  const [numericFilters, setNumericFilters] = useState({});
  const [textFilters, setTextFilters] = useState({});
  const [allData, setAllData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [periodStatus, setPeriodStatus] = useState({});
  const [runningPeriods, setRunningPeriods] = useState({});
  const [selectedChartSymbol, setSelectedChartSymbol] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSymbols, setCompareSymbols] = useState([]);
  const [globalTheme, setGlobalTheme] = useState('light');
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const debouncedSymbol = useDebounce(symbol, 500);

  const fetchPeriodStatus = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/mss/period-status/`);
      const data = await res.json();
      if (data.success) setPeriodStatus(data.periods);
    } catch (e) { console.error(e); }
  }, []);

  const runPeriod = async (periodDays) => {
    setRunningPeriods(prev => ({ ...prev, [periodDays]: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/mss/run-period/${periodDays}/`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Period ${periodDays}d completed! Saved ${data.records_saved} records.`);
        fetchPeriodStatus();
        if (activeTab === 'history') fetchFilteredData();
      } else alert(`❌ Failed: ${data.error}`);
    } catch (e) { alert(`❌ Error: ${e.message}`); }
    finally { setRunningPeriods(prev => ({ ...prev, [periodDays]: false })); }
  };

  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { numeric: numericFilters, text: textFilters };
      const params = new URLSearchParams({
        period, days: daysBack, symbol: debouncedSymbol.trim().toUpperCase(),
        asset_class: assetClass, filters: JSON.stringify(filters)
      });
      const res = await fetch(`${BASE_URL}/api/mss/filtered-data/?${params}`);
      const json = await res.json();
      if (json.success) { setAllData(json.data); setTotalRecords(json.total); setCurrentPage(1); }
      else throw new Error(json.error);
    } catch (e) { setError(e.message); setAllData([]); }
    finally { setLoading(false); }
  }, [debouncedSymbol, period, daysBack, assetClass, numericFilters, textFilters]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/mss/symbols/`).then(r => r.json()).then(d => { if (d.success) setSymbols(d.data); }).catch(() => {});
    fetchPeriodStatus();
    const interval = setInterval(fetchPeriodStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchPeriodStatus]);

  useEffect(() => { if (activeTab === 'summary') fetch(`${BASE_URL}/api/mss/summary/?period=${period}`).then(r => r.json()).then(d => { if (d.success) setSummary(d); }).catch(() => {}); }, [activeTab, period]);
  useEffect(() => { if (activeTab === 'history') fetchFilteredData(); }, [activeTab, fetchFilteredData]);

  useEffect(() => {
    if (!allData.length) { setPaginatedData([]); return; }
    const sorted = [...allData].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1; if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    const start = (currentPage - 1) * PAGE_SIZE;
    setPaginatedData(sorted.slice(start, start + PAGE_SIZE));
  }, [allData, sortKey, sortDir, currentPage]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return React.createElement('span', { className: 'dt-sort' }, '↕');
    return React.createElement('span', { className: `dt-sort ${sortDir}` }, sortDir === 'asc' ? '↑' : '↓');
  };

  const handleNumericFilterChange = (key, type, value) => setNumericFilters(prev => ({ ...prev, [key]: { ...prev[key], [type]: value } }));
  const handleTextFilterChange = (key, value) => setTextFilters(prev => ({ ...prev, [key]: value }));
  const clearAllFilters = () => { setNumericFilters({}); setTextFilters({}); };
  const clearFilter = (key) => setTextFilters(prev => { const newFilters = { ...prev }; delete newFilters[key]; return newFilters; });

  const handleDownload = (fmt) => {
    const sym = debouncedSymbol.trim().toUpperCase() || 'ALL';
    const params = new URLSearchParams({ format: fmt, period, days: daysBack });
    if (fmt === 'json') {
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${sym}_mss_history.json`; a.click(); URL.revokeObjectURL(url);
      return;
    }
    window.open(`${BASE_URL}/api/mss/download/${sym}/?${params}`, '_blank');
  };

  const addToCompare = (symbolName) => {
    if (!compareSymbols.includes(symbolName) && compareSymbols.length < 8) {
      setCompareSymbols([...compareSymbols, symbolName]);
      setCompareMode(true);
    }
  };

  const removeFromCompare = (symbolName) => {
    setCompareSymbols(compareSymbols.filter(s => s !== symbolName));
    if (compareSymbols.length <= 1) setCompareMode(false);
  };

  const clearCompare = () => {
    setCompareSymbols([]);
    setCompareMode(false);
  };

  const activeFilterCount = Object.values(numericFilters).filter(r => (r.min !== '' && r.min) || (r.max !== '' && r.max)).length + Object.values(textFilters).filter(v => v && v !== 'all').length;

  const stats = allData.length ? (() => {
    const mssList = allData.map(r => r.mss).filter(Boolean);
    return {
      avgMss: mssList.reduce((a, b) => a + b, 0) / mssList.length,
      stable: allData.filter(r => r.category === 'stable').length,
      choppy: allData.filter(r => r.category === 'choppy').length,
      volatile: allData.filter(r => r.category === 'volatile').length,
      avgR2: allData.map(r => r.r_squared).filter(Boolean).reduce((a, b) => a + b, 0) / allData.length,
      total: allData.length
    };
  })() : null;

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  const getDropdownOptions = (key) => [...new Set(allData.map(row => row[key]).filter(v => v && v !== 'null'))].sort();

  const mssColor = (val) => { if (val >= 47) return 'var(--stable)'; if (val >= 30) return 'var(--choppy)'; return 'var(--volatile)'; };
  const categoryBadge = (cat) => React.createElement('span', { className: `dt-badge dt-badge-${cat}` }, cat === 'stable' ? '● ' : cat === 'choppy' ? '◆ ' : '▲ ', cat);
  const biasBadge = (bias) => !bias ? React.createElement('span', { style: { color: 'var(--text-secondary)', fontSize: 11 } }, '—') : React.createElement('span', { className: `dt-badge dt-badge-${bias}` }, bias);
  const MSSBar = ({ val }) => React.createElement('div', { className: 'dt-mss-bar' },
    React.createElement('div', { className: 'dt-mss-track' },
      React.createElement('div', { className: 'dt-mss-fill', style: { width: `${val}%`, background: mssColor(val) } })
    ),
    React.createElement('span', { className: 'dt-mss-num', style: { color: mssColor(val) } }, val?.toFixed(1))
  );
  const fmt = (n, dec = 4) => n == null ? '—' : typeof n === 'number' ? n.toFixed(dec) : n;

  const toggleColumn = (colKey) => {
    if (hiddenColumns.includes(colKey)) setHiddenColumns(hiddenColumns.filter(c => c !== colKey));
    else setHiddenColumns([...hiddenColumns, colKey]);
  };
  const resetColumns = () => setHiddenColumns([]);

  const visibleColumns = ALL_COLUMNS.filter(col => !hiddenColumns.includes(col.key));

  return React.createElement('div', { className: 'dt-root', 'data-theme': globalTheme },
    React.createElement('style', null, CSS),
    React.createElement(Header, null),
    React.createElement('div', null,
      React.createElement(SideNavs, null),
      React.createElement('nav', { className: 'dt-topnav' },
        React.createElement('div', { className: 'dt-topnav-brand' }, React.createElement('span', null), ' SnowAI Tracker'),
        React.createElement('div', { className: 'dt-topnav-links' },
          [{ id: 'history', label: 'History' }, { id: 'summary', label: 'Daily Snapshot' }, { id: 'download', label: 'Download Centre' }].map(tab =>
            React.createElement('button', { key: tab.id, className: `dt-nav-link ${activeTab === tab.id ? 'active' : ''}`, onClick: () => setActiveTab(tab.id) }, tab.label)
          )
        ),
        React.createElement('div', { className: 'theme-selector' },
          React.createElement('button', { className: `chart-btn ${globalTheme === 'light' ? 'active' : ''}`, onClick: () => setGlobalTheme('light') }, '☀️'),
          React.createElement('button', { className: `chart-btn ${globalTheme === 'dark' ? 'active' : ''}`, onClick: () => setGlobalTheme('dark') }, '🌙'),
          React.createElement('button', { className: `chart-btn ${globalTheme === 'hud' ? 'active' : ''}`, onClick: () => setGlobalTheme('hud') }, '🖥️')
        )
      ),
      React.createElement('div', { className: 'dt-body' },
        React.createElement('div', { className: 'dt-page-header' },
          React.createElement('div', null,
            React.createElement('div', { className: 'dt-page-title' }, 'MSS Historical Data & Performance Tracker'),
            React.createElement('div', { className: 'dt-page-subtitle' }, 'Market Stability Score · R² · Analyst Bias · Put/Call Ratio — Click any row to view chart, or use Compare mode')
          )
        ),
        compareMode && React.createElement('div', { className: 'compare-panel' },
          React.createElement('div', { className: 'compare-header' },
            React.createElement('strong', null, '📊 Compare Mode: ', compareSymbols.length, ' assets selected'),
            React.createElement('button', { className: 'chart-btn', onClick: clearCompare }, 'Clear All')
          ),
          React.createElement('div', { className: 'compare-symbols' },
            compareSymbols.map(s => React.createElement('div', { key: s, className: 'compare-tag' }, s, React.createElement('button', { onClick: () => removeFromCompare(s) }, '✕'))),
            React.createElement('button', { className: 'chart-btn', onClick: () => setCompareMode(false) }, 'Close Compare')
          ),
          React.createElement('div', { className: 'compare-chart-container' },
            React.createElement(MultiCompareChart, { symbols: compareSymbols, onClose: () => setCompareMode(false), initialTheme: globalTheme })
          )
        ),
        React.createElement('div', { className: 'dt-status-panel' },
          React.createElement('div', { className: 'dt-status-header', onClick: () => setShowStatusPanel(!showStatusPanel) },
            React.createElement('span', null, '📊 MSS Snapshot Status — Daily runs at 20-min intervals (12:00 PM - 2:20 PM NYC)'),
            React.createElement('span', null, showStatusPanel ? '▼' : '▲')
          ),
          showStatusPanel && React.createElement('div', { className: 'dt-status-grid' },
            PERIODS.map(p => {
              const status = periodStatus[p] || { status: 'pending', records: 0, current_asset: '' };
              return React.createElement('div', { key: p, className: `dt-period-card ${status.status}` },
                React.createElement('div', { className: 'dt-period-title' }, p, ' Day Period'),
                React.createElement('div', { className: `dt-period-status dt-status-${status.status}` },
                  status.status === 'running' ? '🔄 RUNNING' : status.status === 'completed' ? '✅ COMPLETED' : status.status === 'failed' ? '❌ FAILED' : '⏳ PENDING'
                ),
                status.status === 'running' && status.current_asset && React.createElement('div', { className: 'dt-period-current' }, 'Current: ', status.current_asset),
                React.createElement('div', { className: 'dt-period-info' },
                  status.records > 0 ? `${status.records.toLocaleString()} records saved` : 'No data yet',
                  status.last_run && React.createElement('div', null, 'Last run: ', new Date(status.last_run).toLocaleTimeString())
                ),
                React.createElement('button', { className: 'dt-run-btn', onClick: () => runPeriod(p), disabled: status.status === 'running' || runningPeriods[p] },
                  (status.status === 'running' || runningPeriods[p]) ? React.createElement(React.Fragment, null, React.createElement('span', { className: 'dt-spinner-small' }), ' Running...') : '▶ Run Now'
                )
              );
            })
          )
        ),
        React.createElement('div', { className: 'dt-quick-bar' },
          React.createElement('div', { className: 'dt-quick-group' },
            React.createElement('div', { className: 'dt-quick-label' }, 'Symbol'),
            React.createElement('input', { className: 'dt-quick-input', placeholder: 'Type symbol...', value: symbol, onChange: e => setSymbol(e.target.value.toUpperCase()), list: 'sym-list' }),
            React.createElement('datalist', { id: 'sym-list' }, symbols.slice(0, 200).map(s => React.createElement('option', { key: s.symbol, value: s.symbol })))
          ),
          React.createElement('div', { className: 'dt-quick-group' },
            React.createElement('div', { className: 'dt-quick-label' }, 'Period'),
            React.createElement('select', { className: 'dt-quick-select', value: period, onChange: e => setPeriod(+e.target.value) }, PERIODS.map(p => React.createElement('option', { key: p, value: p }, p, 'd')))
          ),
          React.createElement('div', { className: 'dt-quick-group' },
            React.createElement('div', { className: 'dt-quick-label' }, 'Asset Class'),
            React.createElement('select', { className: 'dt-quick-select', value: assetClass, onChange: e => setAssetClass(e.target.value) }, ASSET_CLASSES.map(c => React.createElement('option', { key: c, value: c }, c)))
          ),
          React.createElement('div', { className: 'dt-quick-group' },
            React.createElement('div', { className: 'dt-quick-label' }, 'Days back'),
            React.createElement('select', { className: 'dt-quick-select', value: daysBack, onChange: e => setDaysBack(+e.target.value) }, [30, 60, 90, 180, 365, 730].map(d => React.createElement('option', { key: d, value: d }, d, ' days')))
          ),
          React.createElement('div', { className: 'dt-divider' }),
          React.createElement('button', { className: 'dt-btn dt-btn-primary', disabled: loading, onClick: fetchFilteredData }, loading ? 'Loading…' : '⟳ Apply Filters'),
          React.createElement('button', { className: 'dt-btn dt-btn-secondary', onClick: () => setShowAdvancedFilters(!showAdvancedFilters) }, '🔍 ', showAdvancedFilters ? 'Hide' : 'Show', ' Advanced Filters ', activeFilterCount > 0 && `(${activeFilterCount})`)
        ),
        showAdvancedFilters && React.createElement('div', { className: 'dt-filters-panel' },
          React.createElement('div', { className: 'dt-filters-header', onClick: () => setShowAdvancedFilters(false) },
            React.createElement('span', null, '⚙️ Advanced Filters'),
            React.createElement('span', null, '▼')
          ),
          React.createElement('div', { className: 'dt-filters-grid' },
            NUMERIC_COLUMNS.map(col => React.createElement('div', { key: col.key, className: 'dt-filter-item' },
              React.createElement('label', null, col.label, ' ', col.unit && `(${col.unit})`),
              React.createElement('div', { className: 'dt-range-group' },
                React.createElement('input', { type: 'number', placeholder: `Min ${col.min}`, step: col.step, value: numericFilters[col.key]?.min || '', onChange: e => handleNumericFilterChange(col.key, 'min', e.target.value) }),
                React.createElement('span', null, 'to'),
                React.createElement('input', { type: 'number', placeholder: `Max ${col.max}`, step: col.step, value: numericFilters[col.key]?.max || '', onChange: e => handleNumericFilterChange(col.key, 'max', e.target.value) })
              )
            )),
            TEXT_COLUMNS.map(col => React.createElement('div', { key: col.key, className: 'dt-filter-item' },
              React.createElement('label', null, col.label),
              col.type === 'dropdown' ? React.createElement('select', { className: 'dt-filter-select', value: textFilters[col.key] || 'all', onChange: e => handleTextFilterChange(col.key, e.target.value) },
                React.createElement('option', { value: 'all' }, 'All ', col.label, 's'),
                getDropdownOptions(col.key).map(opt => React.createElement('option', { key: opt, value: opt }, opt))
              ) : React.createElement('input', { className: 'dt-filter-input', type: 'text', placeholder: `Filter by ${col.label.toLowerCase()}...`, value: textFilters[col.key] || '', onChange: e => handleTextFilterChange(col.key, e.target.value) })
            )),
            React.createElement('div', { className: 'dt-filter-actions' },
              React.createElement('button', { className: 'dt-btn-sm dt-btn-secondary', onClick: clearAllFilters }, 'Clear All Filters')
            )
          )
        ),
        activeFilterCount > 0 && React.createElement('div', { className: 'dt-active-filters' },
          Object.entries(numericFilters).map(([key, range]) => {
            const col = NUMERIC_COLUMNS.find(c => c.key === key);
            const parts = [];
            if (range.min) parts.push(`${col?.label} ≥ ${range.min}${col?.unit || ''}`);
            if (range.max) parts.push(`${col?.label} ≤ ${range.max}${col?.unit || ''}`);
            return parts.map(part => React.createElement('div', { key: `${key}-${part}`, className: 'dt-filter-tag' }, part, React.createElement('button', { onClick: () => { if (range.min) handleNumericFilterChange(key, 'min', ''); if (range.max) handleNumericFilterChange(key, 'max', ''); } }, '✕')));
          }),
          Object.entries(textFilters).map(([key, val]) => {
            if (!val || val === 'all') return null;
            const col = TEXT_COLUMNS.find(c => c.key === key);
            return React.createElement('div', { key: key, className: 'dt-filter-tag' }, col?.label, ' = ', val, React.createElement('button', { onClick: () => clearFilter(key) }, '✕'));
          }),
          activeFilterCount > 1 && React.createElement('div', { className: 'dt-filter-tag', style: { background: 'var(--volatile)', color: 'white' } },
            React.createElement('button', { onClick: clearAllFilters, style: { color: 'white' } }, 'Clear All ✕')
          )
        ),
        React.createElement('div', { className: 'dt-column-controls' },
          React.createElement('span', { style: { fontSize: '11px', fontWeight: 600 } }, '📋 Columns:'),
          React.createElement('div', { className: 'dt-column-dropdown' },
            React.createElement('button', { className: 'dt-btn-sm dt-btn-secondary' }, '☰ Toggle Columns ▼'),
            React.createElement('div', { className: 'dt-column-dropdown-content' },
              ALL_COLUMNS.map(col => React.createElement('label', { key: col.key, className: 'dt-column-checkbox' },
                React.createElement('input', { type: 'checkbox', checked: !hiddenColumns.includes(col.key), onChange: () => toggleColumn(col.key) }),
                col.label
              ))
            )
          ),
          React.createElement('button', { className: 'dt-btn-sm dt-btn-secondary', onClick: resetColumns }, '⟳ Reset Columns'),
          compareSymbols.length < 8 && React.createElement('button', { className: 'dt-btn-sm dt-btn-primary', onClick: () => setCompareMode(true), disabled: compareMode }, '📊 Enter Compare Mode'),
          compareSymbols.length > 0 && React.createElement('button', { className: 'dt-btn-sm dt-btn-secondary', onClick: clearCompare }, '🗑️ Clear Compare (', compareSymbols.length, ')')
        ),
        stats && React.createElement('div', { className: 'dt-stats' },
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Total Records'), React.createElement('div', { className: 'dt-stat-value' }, stats.total.toLocaleString())),
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Avg MSS'), React.createElement('div', { className: 'dt-stat-value', style: { color: mssColor(stats.avgMss) } }, stats.avgMss.toFixed(1))),
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Stable'), React.createElement('div', { className: 'dt-stat-value', style: { color: 'var(--stable)' } }, stats.stable), React.createElement('div', { className: 'dt-stat-sub' }, ((stats.stable / stats.total) * 100).toFixed(0), '%')),
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Choppy'), React.createElement('div', { className: 'dt-stat-value', style: { color: 'var(--choppy)' } }, stats.choppy), React.createElement('div', { className: 'dt-stat-sub' }, ((stats.choppy / stats.total) * 100).toFixed(0), '%')),
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Volatile'), React.createElement('div', { className: 'dt-stat-value', style: { color: 'var(--volatile)' } }, stats.volatile), React.createElement('div', { className: 'dt-stat-sub' }, ((stats.volatile / stats.total) * 100).toFixed(0), '%')),
          React.createElement('div', { className: 'dt-stat-card' }, React.createElement('div', { className: 'dt-stat-label' }, 'Avg R²'), React.createElement('div', { className: 'dt-stat-value' }, stats.avgR2.toFixed(3)))
        ),
        activeTab === 'download' && React.createElement('div', { className: 'dt-dl-panel' },
          React.createElement('div', { className: 'dt-dl-title' }, '⤓ Export Data'),
          React.createElement('span', { style: { fontSize: 11 } }, React.createElement('strong', null, allData.length.toLocaleString(), ' records'), ' match current filters'),
          React.createElement('button', { className: 'dt-dl-btn dt-dl-csv', onClick: () => handleDownload('csv') }, '📄 CSV'),
          React.createElement('button', { className: 'dt-dl-btn dt-dl-xlsx', onClick: () => handleDownload('xlsx') }, '📊 Excel'),
          React.createElement('button', { className: 'dt-dl-btn dt-dl-pdf', onClick: () => handleDownload('pdf') }, '📑 PDF'),
          React.createElement('button', { className: 'dt-dl-btn dt-dl-json', onClick: () => handleDownload('json') }, '{ } JSON')
        ),
        React.createElement('div', { className: 'dt-table-wrap' },
          React.createElement('div', { className: 'dt-table-scroll' },
            loading ? React.createElement('div', { className: 'dt-loading' }, React.createElement('div', { className: 'dt-spinner' }), 'Fetching ', totalRecords.toLocaleString(), ' records…')
            : error ? React.createElement('div', { className: 'dt-empty' }, '⚠ ', error)
            : paginatedData.length === 0 ? React.createElement('div', { className: 'dt-empty' }, '📭 No records match your filters.')
            : React.createElement('table', { className: 'dt-table' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  visibleColumns.map(({ key, label }) => React.createElement('th', { key: key, onClick: () => handleSort(key) }, label, React.createElement(SortIcon, { k: key })))
                )
              ),
              React.createElement('tbody', null,
                paginatedData.map((row, i) => React.createElement('tr', { key: `${row.symbol}-${row.date_taken}-${i}` },
                  visibleColumns.map(col => {
                    if (col.key === 'symbol') return React.createElement('td', { key: col.key },
                      React.createElement('span', { className: 'dt-symbol' }, row.symbol),
                      React.createElement('div', { style: { display: 'flex', gap: '4px', marginTop: '4px' } },
                        React.createElement('button', { className: 'chart-btn', style: { fontSize: '9px', padding: '2px 6px' }, onClick: (e) => { e.stopPropagation(); setSelectedChartSymbol(row.symbol); } }, '📈 Chart'),
                        React.createElement('button', { className: 'chart-btn', style: { fontSize: '9px', padding: '2px 6px' }, onClick: (e) => { e.stopPropagation(); addToCompare(row.symbol); } }, '➕ Compare')
                      )
                    );
                    if (col.key === 'mss') return React.createElement('td', { key: col.key, style: { minWidth: 130 } }, React.createElement(MSSBar, { val: row.mss }));
                    if (col.key === 'category') return React.createElement('td', { key: col.key }, categoryBadge(row.category));
                    if (col.key === 'analyst_bias' || col.key === 'put_call_bias') return React.createElement('td', { key: col.key }, biasBadge(row[col.key]));
                    if (col.key === 'price_change') return React.createElement('td', { key: col.key, style: { color: row.price_change >= 0 ? 'var(--stable)' : 'var(--volatile)', fontWeight: 600 } }, row.price_change >= 0 ? '+' : '', fmt(row.price_change, 2), '%');
                    if (col.key === 'current_price') return React.createElement('td', { key: col.key }, '$', fmt(row.current_price, 2));
                    if (col.key === 'date_taken') return React.createElement('td', { key: col.key, style: { color: 'var(--text-secondary)', fontSize: 11 } }, row.date_taken);
                    if (col.key === 'period_days') return React.createElement('td', { key: col.key, style: { color: 'var(--text-secondary)' } }, row.period_days, 'd');
                    return React.createElement('td', { key: col.key }, fmt(row[col.key], col.key === 'r_squared' ? 4 : col.key === 'volatility' ? 5 : 3));
                  })
                ))
              )
            )
          ),
          !loading && allData.length > 0 && React.createElement('div', { className: 'dt-pagination' },
            React.createElement('div', { className: 'dt-pag-info' }, 'Showing ', ((currentPage - 1) * PAGE_SIZE) + 1, '–', Math.min(currentPage * PAGE_SIZE, totalRecords), ' of ', totalRecords.toLocaleString()),
            React.createElement('div', { className: 'dt-pag-btns' },
              React.createElement('button', { className: 'dt-pag-btn', disabled: currentPage <= 1, onClick: () => setCurrentPage(1) }, '«'),
              React.createElement('button', { className: 'dt-pag-btn', disabled: currentPage <= 1, onClick: () => setCurrentPage(currentPage - 1) }, '‹ Prev'),
              Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = Math.max(1, currentPage - 3) + i;
                if (p > totalPages) return null;
                return React.createElement('button', { key: p, className: `dt-pag-btn ${p === currentPage ? 'active' : ''}`, onClick: () => setCurrentPage(p) }, p);
              }),
              React.createElement('button', { className: 'dt-pag-btn', disabled: currentPage >= totalPages, onClick: () => setCurrentPage(currentPage + 1) }, 'Next ›'),
              React.createElement('button', { className: 'dt-pag-btn', disabled: currentPage >= totalPages, onClick: () => setCurrentPage(totalPages) }, '»')
            )
          )
        )
      )
    ),
    selectedChartSymbol && React.createElement(AssetChart, { symbol: selectedChartSymbol, onClose: () => setSelectedChartSymbol(null), initialTheme: globalTheme })
  );
}