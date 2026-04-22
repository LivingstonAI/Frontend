import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const BASE_URL = "https://backend-production-c0ab.up.railway.app";

// ── CSS (Enhanced with dark mode, heatmap, etc.) ─────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

  /* Light Mode (Default) */
  :root {
    --bg-primary: #F5FAFE;
    --bg-secondary: #FFFFFF;
    --text-primary: #0D2D45;
    --text-secondary: #7BA9C4;
    --border-color: #CBE4F2;
    --card-bg: #FFFFFF;
    --table-header: #0D2D45;
    --table-row-even: #EAF4FB;
    --table-row-hover: #B8DCF0;
    --shadow: 0 2px 16px rgba(26,94,138,0.10);
    --shadow-lg: 0 8px 40px rgba(26,94,138,0.14);
    
    --ice: #EAF4FB;
    --sky: #B8DCF0;
    --blue: #3A9FD5;
    --deep: #1A5E8A;
    --navy: #0D2D45;
    --white: #FFFFFF;
    --offwhite: #F5FAFE;
    --muted: #7BA9C4;
    --border: #CBE4F2;
    --stable: #1BA86D;
    --choppy: #E89C2A;
    --volatile: #D63B3B;
    --bullish: #1BA86D;
    --bearish: #D63B3B;
    --neutral: #7BA9C4;
  }

  /* Dark Mode */
  [data-theme="dark"] {
    --bg-primary: #0D1117;
    --bg-secondary: #161B22;
    --text-primary: #E6EDF3;
    --text-secondary: #8B949E;
    --border-color: #30363D;
    --card-bg: #161B22;
    --table-header: #161B22;
    --table-row-even: #21262D;
    --table-row-hover: #30363D;
    --shadow: 0 2px 16px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.4);
    
    --ice: #21262D;
    --sky: #30363D;
    --blue: #58A6FF;
    --deep: #1F6FEB;
    --navy: #161B22;
    --white: #161B22;
    --offwhite: #0D1117;
    --muted: #8B949E;
    --border: #30363D;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--bg-primary); transition: background 0.3s ease; }

  .dt-root {
    min-height: 100vh;
    background: var(--bg-primary);
    font-family: 'DM Mono', monospace;
    color: var(--text-primary);
  }

  /* Dark mode toggle */
  .theme-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }
  .theme-toggle:hover { transform: scale(1.05); }

  /* Top nav */
  .dt-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-secondary);
    border-bottom: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 28px;
    height: 52px;
    box-shadow: var(--shadow);
  }
  .dt-topnav-brand {
    font-family: 'Syne', sans-serif;
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
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    background: none;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    white-space: nowrap;
    transition: all .18s;
    font-weight: 500;
  }
  .dt-nav-link:hover { background: var(--ice); color: var(--text-primary); }
  .dt-nav-link.active { background: var(--ice); color: var(--text-primary); font-weight: 600; }

  .dt-body {
    max-width: 1600px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

  /* Presets Panel */
  .dt-presets-panel {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    margin-bottom: 22px;
    padding: 16px 20px;
  }
  .dt-presets-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dt-preset-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .dt-preset-btn {
    padding: 6px 14px;
    border: 1.5px solid var(--border);
    border-radius: 7px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .dt-preset-btn:hover { background: var(--blue); color: white; border-color: var(--blue); }
  .dt-preset-save {
    background: var(--stable);
    color: white;
    border-color: var(--stable);
  }
  .dt-preset-save:hover { opacity: 0.8; }

  /* Heatmap View */
  .dt-heatmap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    margin-bottom: 22px;
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
  }
  .dt-heatmap-cell {
    padding: 12px 8px;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
    font-size: 11px;
    font-weight: 600;
  }
  .dt-heatmap-cell:hover { transform: scale(1.05); z-index: 1; }
  .dt-heatmap-symbol { font-weight: 700; margin-bottom: 4px; }
  .dt-heatmap-value { font-size: 10px; opacity: 0.8; }

  /* Comparison View */
  .dt-comparison {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 22px;
  }
  .dt-comparison-selector {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .dt-compare-card {
    flex: 1;
    min-width: 200px;
    padding: 16px;
    background: var(--bg-primary);
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  .dt-compare-header {
    font-weight: 700;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .dt-compare-metric {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 11px;
  }
  .dt-compare-win { color: var(--stable); font-weight: 700; }
  .dt-compare-loss { color: var(--volatile); }

  /* Sector Leaderboard */
  .dt-leaderboard {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 22px;
  }
  .dt-leaderboard-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .dt-leaderboard-rank {
    font-weight: 700;
    width: 40px;
    color: var(--blue);
  }
  .dt-leaderboard-name { flex: 1; font-weight: 600; }
  .dt-leaderboard-score { font-family: 'DM Mono', monospace; font-weight: 700; }

  /* Sparklines */
  .dt-sparkline {
    width: 60px;
    height: 24px;
    display: inline-block;
  }

  /* Portfolio Analysis */
  .dt-portfolio {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 22px;
  }
  .dt-portfolio-input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .dt-portfolio-input textarea {
    flex: 1;
    padding: 10px;
    border: 1.5px solid var(--border);
    border-radius: 7px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
  }
  .dt-risk-metric {
    display: inline-block;
    padding: 4px 10px;
    background: var(--ice);
    border-radius: 20px;
    font-size: 11px;
    margin: 4px;
  }

  /* Rest of existing styles (filters, table, etc.) - keeping same structure */
  .dt-filters-panel, .dt-quick-bar, .dt-stats, .dt-active-filters, 
  .dt-table-wrap, .dt-pagination, .dt-dl-panel {
    background: var(--bg-secondary);
    border-color: var(--border);
    color: var(--text-primary);
  }
  
  .dt-filter-input, .dt-filter-select, .dt-quick-input, .dt-quick-select {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--border);
  }
  
  .dt-table thead tr { background: var(--table-header); }
  .dt-table tbody tr:nth-child(even) { background: var(--table-row-even); }
  .dt-table tbody tr:hover { background: var(--table-row-hover) !important; }
  
  .dt-stat-card, .dt-filter-tag, .dt-presets-panel, .dt-comparison, 
  .dt-leaderboard, .dt-portfolio {
    background: var(--card-bg);
  }

  @media (max-width: 700px) {
    .dt-body { padding: 16px 10px 32px; }
    .dt-topnav { padding: 0 14px; }
    .dt-filters-grid { grid-template-columns: 1fr; }
    .dt-heatmap { grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); }
    .dt-compare-card { min-width: 100%; }
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

// Saved filter presets
const DEFAULT_PRESETS = {
  'High Quality Growth': { numeric: { mss: { min: 50 }, r_squared: { min: 0.7 }, analyst_rating_pct: { min: 60 } }, text: { analyst_bias: 'bullish' } },
  'Oversold Opportunities': { numeric: { price_change: { max: -15 }, mss: { max: 35 } }, text: {} },
  'Low Risk Income': { numeric: { volatility: { max: 0.2 }, mss: { min: 55 } }, text: { sector: 'Utilities', category: 'stable' } },
  'Momentum Leaders': { numeric: { price_change: { min: 10 }, trend_strength: { min: 0.6 } }, text: {} },
  'Contrarian Picks': { numeric: { put_call_ratio: { min: 1.2 }, analyst_rating_pct: { max: 40 } }, text: { analyst_bias: 'bearish' } },
};

// Helper functions
const mssColor = (mss) => {
  if (mss >= 47) return 'var(--stable)';
  if (mss >= 30) return 'var(--choppy)';
  return 'var(--volatile)';
};

const getHeatmapColor = (mss) => {
  if (mss >= 70) return '#1BA86D';
  if (mss >= 60) return '#5CB85C';
  if (mss >= 47) return '#8BC34A';
  if (mss >= 35) return '#FFC107';
  if (mss >= 25) return '#FF9800';
  if (mss >= 15) return '#F44336';
  return '#D63B3B';
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

// Sparkline component
const Sparkline = ({ data, width = 60, height = 24 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || data.length < 2) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = width, h = height;
    canvas.width = w;
    canvas.height = h;
    
    ctx.clearRect(0, 0, w, h);
    
    const values = data.map(d => d.mss).filter(v => v != null);
    if (values.length < 2) return;
    
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    
    ctx.beginPath();
    ctx.strokeStyle = mssColor(values[values.length - 1]);
    ctx.lineWidth = 1.5;
    
    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - minVal) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [data, width, height]);
  
  return <canvas ref={canvasRef} width={width} height={height} className="dt-sparkline" />;
};

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
  const [viewMode, setViewMode] = useState('table'); // 'table', 'heatmap', 'comparison', 'portfolio'
  const [darkMode, setDarkMode] = useState(false);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [numericFilters, setNumericFilters] = useState({});
  const [textFilters, setTextFilters] = useState({});
  const [savedPresets, setSavedPresets] = useState(DEFAULT_PRESETS);
  const [presetName, setPresetName] = useState('');
  
  // Data state
  const [allData, setAllData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Comparison state
  const [compareSymbols, setCompareSymbols] = useState(['AAPL', 'MSFT']);
  const [comparisonData, setComparisonData] = useState([]);
  
  // Portfolio state
  const [portfolioSymbols, setPortfolioSymbols] = useState('');
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null);
  
  // Historical data for sparklines
  const [historicalData, setHistoricalData] = useState({});
  
  const debouncedSymbol = useDebounce(symbol, 500);
  const debouncedNumericFilters = useDebounce(numericFilters, 500);
  const debouncedTextFilters = useDebounce(textFilters, 500);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Fetch symbol list
  useEffect(() => {
    fetch(`${BASE_URL}/api/mss/symbols/`)
      .then(r => r.json())
      .then(d => { if (d.success) setSymbols(d.data); })
      .catch(() => {});
  }, []);

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
      const filters = { numeric: numericFilters, text: textFilters };
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
      
      // Fetch historical data for sparklines (top 50 symbols)
      const topSymbols = json.data.slice(0, 50).map(r => r.symbol);
      const historyPromises = topSymbols.map(async (sym) => {
        const histRes = await fetch(`${BASE_URL}/api/mss/history/?symbol=${sym}&period=${period}&days=90&limit=90`);
        const histJson = await histRes.json();
        if (histJson.success) {
          setHistoricalData(prev => ({ ...prev, [sym]: histJson.data }));
        }
      });
      await Promise.all(historyPromises);
      
    } catch (e) {
      setError(e.message);
      setAllData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSymbol, period, daysBack, assetClass, numericFilters, textFilters]);

  // Fetch comparison data
  const fetchComparisonData = useCallback(async () => {
    const params = new URLSearchParams({
      period: period,
      days: daysBack,
      symbol: compareSymbols.join(','),
    });
    const res = await fetch(`${BASE_URL}/api/mss/filtered-data/?${params}`);
    const json = await res.json();
    if (json.success) {
      setComparisonData(json.data);
    }
  }, [compareSymbols, period, daysBack]);

  // Analyze portfolio
  const analyzePortfolio = useCallback(async () => {
    const symbolsList = portfolioSymbols.split(',').map(s => s.trim().toUpperCase());
    const params = new URLSearchParams({
      period: period,
      days: daysBack,
      symbol: symbolsList.join(','),
    });
    const res = await fetch(`${BASE_URL}/api/mss/filtered-data/?${params}`);
    const json = await res.json();
    if (json.success && json.data.length) {
      const portfolio = json.data;
      const avgMss = portfolio.reduce((sum, r) => sum + r.mss, 0) / portfolio.length;
      const avgVol = portfolio.reduce((sum, r) => sum + r.volatility, 0) / portfolio.length;
      const stableCount = portfolio.filter(r => r.category === 'stable').length;
      const choppyCount = portfolio.filter(r => r.category === 'choppy').length;
      const volatileCount = portfolio.filter(r => r.category === 'volatile').length;
      const bullishCount = portfolio.filter(r => r.analyst_bias === 'bullish').length;
      
      // Simple VaR approximation (5% worst case)
      const returns = portfolio.map(r => r.price_change / 100);
      returns.sort((a, b) => a - b);
      const var95 = returns[Math.floor(returns.length * 0.05)] * 100;
      
      setPortfolioAnalysis({
        total: portfolio.length,
        avgMss,
        avgVol,
        stableCount,
        choppyCount,
        volatileCount,
        bullishCount,
        var95,
        symbols: portfolio.map(r => r.symbol),
      });
    }
  }, [portfolioSymbols, period, daysBack]);

  // Apply sort and pagination
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

  // Trigger fetch when filters change
  useEffect(() => {
    if (activeTab === 'history') fetchFilteredData();
  }, [activeTab, fetchFilteredData]);

  // Fetch comparison when needed
  useEffect(() => {
    if (viewMode === 'comparison') fetchComparisonData();
  }, [viewMode, fetchComparisonData]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="dt-sort">↕</span>;
    return <span className={`dt-sort ${sortDir}`}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const handleNumericFilterChange = (key, type, value) => {
    setNumericFilters(prev => ({ ...prev, [key]: { ...prev[key], [type]: value } }));
  };

  const handleTextFilterChange = (key, value) => {
    setTextFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setNumericFilters({});
    setTextFilters({});
  };

  const clearFilter = (key, type = null) => {
    if (type) {
      setNumericFilters(prev => ({ ...prev, [key]: { ...prev[key], [type]: '' } }));
    } else {
      setTextFilters(prev => { const newFilters = { ...prev }; delete newFilters[key]; return newFilters; });
    }
  };

  const savePreset = () => {
    if (!presetName) return;
    setSavedPresets(prev => ({ ...prev, [presetName]: { numeric: numericFilters, text: textFilters } }));
    setPresetName('');
  };

  const loadPreset = (preset) => {
    setNumericFilters(preset.numeric || {});
    setTextFilters(preset.text || {});
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
  const activeFilterCount = useMemo(() => {
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
  const stats = useMemo(() => {
    if (!allData.length) return null;
    const mssList = allData.map(r => r.mss).filter(Boolean);
    const avgMss = mssList.reduce((a, b) => a + b, 0) / mssList.length;
    const stable = allData.filter(r => r.category === 'stable').length;
    const choppy = allData.filter(r => r.category === 'choppy').length;
    const volatile = allData.filter(r => r.category === 'volatile').length;
    const avgR2 = allData.map(r => r.r_squared).filter(Boolean).reduce((a, b) => a + b, 0) / allData.length;
    return { avgMss, stable, choppy, volatile, avgR2, total: allData.length };
  }, [allData]);

  // Sector leaderboard
  const sectorLeaderboard = useMemo(() => {
    const sectors = {};
    allData.forEach(row => {
      if (!row.sector) return;
      if (!sectors[row.sector]) sectors[row.sector] = { total: 0, count: 0, mssSum: 0 };
      sectors[row.sector].total++;
      sectors[row.sector].count++;
      sectors[row.sector].mssSum += row.mss || 0;
    });
    return Object.entries(sectors)
      .map(([name, data]) => ({ name, avgMss: data.mssSum / data.count, count: data.total }))
      .sort((a, b) => b.avgMss - a.avgMss)
      .slice(0, 10);
  }, [allData]);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const getDropdownOptions = (key) => {
    const values = new Set();
    allData.forEach(row => {
      const val = row[key];
      if (val && val !== 'null' && val !== 'undefined') values.add(val);
    });
    return Array.from(values).sort();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dt-root">
        <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </div>
        
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
                  Market Stability Score · R² · Analyst Bias · Put/Call Ratio — Advanced analytics & visualization
                </div>
              </div>
              <div className="dt-view-toggle">
                <button className={`dt-btn ${viewMode === 'table' ? 'dt-btn-primary' : 'dt-btn-secondary'}`} onClick={() => setViewMode('table')}>📋 Table</button>
                <button className={`dt-btn ${viewMode === 'heatmap' ? 'dt-btn-primary' : 'dt-btn-secondary'}`} onClick={() => setViewMode('heatmap')}>🔥 Heatmap</button>
                <button className={`dt-btn ${viewMode === 'comparison' ? 'dt-btn-primary' : 'dt-btn-secondary'}`} onClick={() => setViewMode('comparison')}>📊 Compare</button>
                <button className={`dt-btn ${viewMode === 'portfolio' ? 'dt-btn-primary' : 'dt-btn-secondary'}`} onClick={() => setViewMode('portfolio')}>💼 Portfolio</button>
              </div>
            </div>

            {/* Presets Panel */}
            <div className="dt-presets-panel">
              <div className="dt-presets-title">
                <span>📌 Saved Filters</span>
                <div>
                  <input type="text" placeholder="Preset name" value={presetName} onChange={e => setPresetName(e.target.value)} style={{ padding: '4px 8px', marginRight: '8px', fontSize: '11px' }} />
                  <button className="dt-preset-btn dt-preset-save" onClick={savePreset}>Save Current</button>
                </div>
              </div>
              <div className="dt-preset-buttons">
                {Object.entries(savedPresets).map(([name, preset]) => (
                  <button key={name} className="dt-preset-btn" onClick={() => loadPreset(preset)}>{name}</button>
                ))}
              </div>
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
                        <input type="number" placeholder={`Min ${col.min}`} step={col.step} value={numericFilters[col.key]?.min || ''} onChange={e => handleNumericFilterChange(col.key, 'min', e.target.value)} />
                        <span>to</span>
                        <input type="number" placeholder={`Max ${col.max}`} step={col.step} value={numericFilters[col.key]?.max || ''} onChange={e => handleNumericFilterChange(col.key, 'max', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  
                  {TEXT_COLUMNS.map(col => (
                    <div key={col.key} className="dt-filter-item">
                      <label>{col.label}</label>
                      {col.type === 'dropdown' ? (
                        <select className="dt-filter-select" value={textFilters[col.key] || 'all'} onChange={e => handleTextFilterChange(col.key, e.target.value)}>
                          <option value="all">All {col.label}s</option>
                          {getDropdownOptions(col.key).map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input className="dt-filter-input" type="text" placeholder={`Filter by ${col.label.toLowerCase()}...`} value={textFilters[col.key] || ''} onChange={e => handleTextFilterChange(col.key, e.target.value)} />
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
                <div className="dt-stat-card"><div className="dt-stat-label">Total Records</div><div className="dt-stat-value">{stats.total.toLocaleString()}</div><div className="dt-stat-sub">after filters</div></div>
                <div className="dt-stat-card"><div className="dt-stat-label">Avg MSS</div><div className="dt-stat-value" style={{ color: mssColor(stats.avgMss) }}>{stats.avgMss.toFixed(1)}</div><div className="dt-stat-sub">across filtered data</div></div>
                <div className="dt-stat-card"><div className="dt-stat-label">Stable</div><div className="dt-stat-value" style={{ color: 'var(--stable)' }}>{stats.stable}</div><div className="dt-stat-sub">{((stats.stable / stats.total) * 100).toFixed(0)}% of set</div></div>
                <div className="dt-stat-card"><div className="dt-stat-label">Choppy</div><div className="dt-stat-value" style={{ color: 'var(--choppy)' }}>{stats.choppy}</div><div className="dt-stat-sub">{((stats.choppy / stats.total) * 100).toFixed(0)}% of set</div></div>
                <div className="dt-stat-card"><div className="dt-stat-label">Volatile</div><div className="dt-stat-value" style={{ color: 'var(--volatile)' }}>{stats.volatile}</div><div className="dt-stat-sub">{((stats.volatile / stats.total) * 100).toFixed(0)}% of set</div></div>
                <div className="dt-stat-card"><div className="dt-stat-label">Avg R²</div><div className="dt-stat-value">{stats.avgR2.toFixed(3)}</div><div className="dt-stat-sub">trend clarity</div></div>
              </div>
            )}

            {/* Sector Leaderboard */}
            {sectorLeaderboard.length > 0 && (
              <div className="dt-leaderboard">
                <h3 style={{ marginBottom: '16px', fontFamily: 'Syne, sans-serif', fontSize: '14px' }}>🏆 Sector Performance Leaderboard</h3>
                {sectorLeaderboard.map((sector, idx) => (
                  <div key={sector.name} className="dt-leaderboard-item">
                    <div className="dt-leaderboard-rank">#{idx + 1}</div>
                    <div className="dt-leaderboard-name">{sector.name}</div>
                    <div className="dt-leaderboard-score" style={{ color: mssColor(sector.avgMss) }}>MSS {sector.avgMss.toFixed(1)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{sector.count} assets</div>
                  </div>
                ))}
              </div>
            )}

            {/* View Mode Content */}
            {viewMode === 'heatmap' && (
              <div className="dt-heatmap">
                {allData.slice(0, 100).map(row => (
                  <div key={row.symbol} className="dt-heatmap-cell" style={{ background: getHeatmapColor(row.mss), color: row.mss > 50 ? 'white' : 'black' }}>
                    <div className="dt-heatmap-symbol">{row.symbol}</div>
                    <div className="dt-heatmap-value">{row.mss?.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'comparison' && (
              <div className="dt-comparison">
                <div className="dt-comparison-selector">
                  <input type="text" placeholder="Symbols to compare (comma separated)" value={compareSymbols.join(',')} onChange={e => setCompareSymbols(e.target.value.toUpperCase().split(',').map(s => s.trim()))} style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '7px', background: 'var(--bg-primary)' }} />
                  <button className="dt-btn dt-btn-primary" onClick={fetchComparisonData}>Compare</button>
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {comparisonData.map(symbol => {
                    const metrics = [
                      { label: 'MSS', value: symbol.mss, color: mssColor(symbol.mss) },
                      { label: 'R²', value: symbol.r_squared },
                      { label: 'Volatility', value: symbol.volatility },
                      { label: 'Price Change %', value: symbol.price_change, suffix: '%', positiveGood: true },
                      { label: 'Analyst Rating', value: symbol.analyst_rating_pct, suffix: '%' },
                      { label: 'Put/Call Ratio', value: symbol.put_call_ratio },
                    ];
                    return (
                      <div key={symbol.symbol} className="dt-compare-card">
                        <div className="dt-compare-header">{symbol.symbol}</div>
                        {metrics.map(m => (
                          <div key={m.label} className="dt-compare-metric">
                            <span>{m.label}</span>
                            <span style={{ color: m.color, fontWeight: m.value > 0 && m.positiveGood ? 'bold' : 'normal' }}>
                              {fmt(m.value, 2)}{m.suffix || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'portfolio' && (
              <div className="dt-portfolio">
                <div className="dt-portfolio-input">
                  <textarea rows="3" placeholder="Enter portfolio symbols (comma separated)&#10;Example: AAPL, MSFT, GOOGL, NVDA, TSLA" value={portfolioSymbols} onChange={e => setPortfolioSymbols(e.target.value)} />
                  <button className="dt-btn dt-btn-primary" onClick={analyzePortfolio}>Analyze Portfolio</button>
                </div>
                {portfolioAnalysis && (
                  <div>
                    <h4 style={{ marginBottom: '16px' }}>📊 Portfolio Analysis</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <div className="dt-risk-metric">Total Assets: {portfolioAnalysis.total}</div>
                      <div className="dt-risk-metric">Avg MSS: {portfolioAnalysis.avgMss.toFixed(1)}</div>
                      <div className="dt-risk-metric">Avg Volatility: {(portfolioAnalysis.avgVol * 100).toFixed(2)}%</div>
                      <div className="dt-risk-metric">VaR (95%): {portfolioAnalysis.var95.toFixed(1)}%</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <div className="dt-risk-metric" style={{ background: 'var(--stable)' }}>Stable: {portfolioAnalysis.stableCount}</div>
                      <div className="dt-risk-metric" style={{ background: 'var(--choppy)' }}>Choppy: {portfolioAnalysis.choppyCount}</div>
                      <div className="dt-risk-metric" style={{ background: 'var(--volatile)' }}>Volatile: {portfolioAnalysis.volatileCount}</div>
                      <div className="dt-risk-metric" style={{ background: 'var(--bullish)' }}>Bullish: {portfolioAnalysis.bullishCount}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="dt-table-wrap">
                <div className="dt-table-scroll">
                  {loading ? (
                    <div className="dt-loading"><div className="dt-spinner" />Fetching {totalRecords.toLocaleString()} records…</div>
                  ) : error ? (
                    <div className="dt-empty"><div className="dt-empty-icon">⚠</div>{error}</div>
                  ) : paginatedData.length === 0 ? (
                    <div className="dt-empty"><div className="dt-empty-icon">📭</div>No records match your filters.</div>
                  ) : (
                    <table className="dt-table">
                      <thead>
                        <tr>
                          {[['date_taken','Date'],['symbol','Symbol'],['asset_class','Class'],['period_days','Period'],['mss','MSS'],['category','Status'],['r_squared','R²'],['volatility','Volatility'],['trend_consistency','Trend Cons.'],['trend_strength','Trend Str.'],['current_price','Price'],['price_change','Chg%'],['analyst_rating_pct','Analyst%'],['analyst_bias','A.Bias'],['put_call_ratio','P/C Ratio'],['put_call_bias','PC Bias'],['sparkline','Trend']].map(([k,label]) => (
                            <th key={k} onClick={() => k !== 'sparkline' && handleSort(k)}>{label}{k !== 'sparkline' && <SortIcon k={k} />}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, i) => (
                          <tr key={`${row.symbol}-${row.date_taken}-${row.period_days}-${i}`}>
                            <td style={{ color: 'var(--muted)', fontSize: 11 }}>{row.date_taken}</td>
                            <td><span className="dt-symbol">{row.symbol}</span></td>
                            <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--ice)', color: 'var(--deep)', fontWeight: 600 }}>{row.asset_class}</span></td>
                            <td style={{ color: 'var(--muted)' }}>{row.period_days}d</td>
                            <td style={{ minWidth: 130 }}><MSSBar mss={row.mss} /></td>
                            <td>{categoryBadge(row.category)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.r_squared, 4)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.volatility, 5)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.trend_consistency, 3)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{fmt(row.trend_strength, 3)}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>${fmt(row.current_price, 2)}</td>
                            <td style={{ color: row.price_change >= 0 ? 'var(--stable)' : 'var(--volatile)', fontWeight: 600 }}>{row.price_change >= 0 ? '+' : ''}{fmt(row.price_change, 2)}%</td>
                            <td>{row.analyst_rating_pct != null ? `${row.analyst_rating_pct.toFixed(1)}%` : '—'}</td>
                            <td>{biasBadge(row.analyst_bias)}</td>
                            <td>{fmt(row.put_call_ratio, 3)}</td>
                            <td>{biasBadge(row.put_call_bias)}</td>
                            <td><Sparkline data={historicalData[row.symbol] || []} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {!loading && allData.length > 0 && (
                  <div className="dt-pagination">
                    <div className="dt-pag-info">Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalRecords)} of {totalRecords.toLocaleString()} filtered records</div>
                    <div className="dt-pag-btns">
                      <button className="dt-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>«</button>
                      <button className="dt-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>‹ Prev</button>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const p = Math.max(1, currentPage - 3) + i;
                        if (p > totalPages) return null;
                        return <button key={p} className={`dt-pag-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>;
                      })}
                      <button className="dt-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next ›</button>
                      <button className="dt-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download Panel */}
            {activeTab === 'download' && (
              <div className="dt-dl-panel">
                <div className="dt-dl-title">⤓ Export Data</div>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}><strong>{allData.length.toLocaleString()} records</strong> match current filters</span>
                <button className="dt-dl-btn dt-dl-csv" onClick={() => handleDownload('csv')}>📄 CSV</button>
                <button className="dt-dl-btn dt-dl-xlsx" onClick={() => handleDownload('xlsx')}>📊 Excel</button>
                <button className="dt-dl-btn dt-dl-pdf" onClick={() => handleDownload('pdf')}>📑 PDF</button>
                <button className="dt-dl-btn dt-dl-json" onClick={() => handleDownload('json')}>{'{ }'} JSON</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}