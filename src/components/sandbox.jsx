import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

/* ─────────────────────────────────────────────────────────────────────────
   STYLES  –  scientific / minimal  ("cold lab" aesthetic)
   Font: IBM Plex Mono + IBM Plex Sans via Google Fonts
───────────────────────────────────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg:        #080c10;
  --surface:   #0d1219;
  --card:      #111820;
  --border:    #1e2a36;
  --border2:   #263545;
  --text:      #cdd6e0;
  --text-dim:  #5a7080;
  --text-muted:#3a5060;
  --accent:    #00c8ff;
  --accent2:   #0084aa;
  --green:     #00e5a0;
  --red:       #ff4d6a;
  --yellow:    #f5c842;
  --mono:      'IBM Plex Mono', monospace;
  --sans:      'IBM Plex Sans', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lab-wrapper {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--sans);
  color: var(--text);
}

/* ── Page header ── */
.lab-topbar {
  padding: 28px 32px 0;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0;
}
.lab-title {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--accent);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent);
  margin-bottom: -1px;
}
.lab-title span { color: var(--text-dim); margin-left: 8px; }

/* ── Tab nav ── */
.tab-row {
  display: flex;
  gap: 4px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.tab-btn {
  background: none;
  border: none;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 14px 18px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-color .2s;
}
.tab-btn:hover { color: var(--text); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

/* ── Main layout ── */
.lab-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  height: calc(100vh - 115px);
  overflow: hidden;
}
.lab-sidebar {
  border-right: 1px solid var(--border);
  overflow-y: auto;
  background: var(--surface);
}
.lab-main {
  overflow-y: auto;
  padding: 24px 28px;
}

/* ── Sidebar model list ── */
.sidebar-search {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar-search input, .sidebar-search select {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 10px;
  font-family: var(--mono);
  font-size: 11px;
  border-radius: 4px;
  outline: none;
}
.sidebar-search input:focus, .sidebar-search select:focus {
  border-color: var(--accent2);
}

.model-item {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background .15s;
  position: relative;
}
.model-item:hover { background: var(--card); }
.model-item.selected { background: var(--card); border-left: 2px solid var(--accent); }
.model-item-name {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-item-meta {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.status-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.dot-pending   { background: var(--yellow); }
.dot-running   { background: var(--accent); animation: blink 1s ease-in-out infinite; }
.dot-completed { background: var(--green); }
.dot-failed    { background: var(--red); }
.dot-paused    { background: var(--text-dim); }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.new-model-btn {
  margin: 16px;
  width: calc(100% - 32px);
  padding: 10px;
  background: transparent;
  border: 1px solid var(--accent2);
  color: var(--accent);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  transition: background .2s, border-color .2s;
}
.new-model-btn:hover { background: #00c8ff0d; border-color: var(--accent); }

/* ── Cards & panels ── */
.panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 20px;
}
.panel-header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--accent);
}
.panel-body { padding: 18px; }

/* ── Form elements ── */
.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--text-dim);
}
.field-input, .field-select {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 10px;
  font-family: var(--mono);
  font-size: 12px;
  border-radius: 4px;
  outline: none;
  transition: border-color .2s;
}
.field-input:focus, .field-select:focus { border-color: var(--accent2); }

/* ── Function selector ── */
.func-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 6px;
}
.func-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  transition: all .15s;
  user-select: none;
}
.func-chip:hover { border-color: var(--border2); color: var(--text); }
.func-chip.selected {
  border-color: var(--accent2);
  color: var(--accent);
  background: #00c8ff08;
}
.func-chip-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  border: 1px solid var(--text-muted);
  flex-shrink: 0;
  transition: all .15s;
}
.func-chip.selected .func-chip-dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}

/* ── Buttons ── */
.btn {
  padding: 9px 20px;
  border: none;
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn-primary {
  background: var(--accent);
  color: #000;
  font-weight: 600;
}
.btn-primary:hover:not(:disabled) { background: #33d4ff; box-shadow: 0 0 14px #00c8ff40; }
.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
}
.btn-ghost:hover:not(:disabled) { border-color: var(--border2); color: var(--text); }
.btn-danger {
  background: transparent;
  color: var(--red);
  border: 1px solid #ff4d6a30;
}
.btn-danger:hover:not(:disabled) { background: #ff4d6a12; border-color: var(--red); }
.btn-sm { padding: 6px 13px; font-size: 10px; }

/* ── Progress ── */
.progress-bar {
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  overflow: hidden;
  margin: 10px 0;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent2), var(--accent));
  transition: width .4s ease;
  box-shadow: 0 0 8px var(--accent);
}

/* ── Metrics grid ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.metric-cell {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 12px 14px;
}
.metric-cell-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.metric-cell-value {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 500;
}
.val-green { color: var(--green); }
.val-red   { color: var(--red);   }
.val-blue  { color: var(--accent);}
.val-plain { color: var(--text);  }

/* ── Log terminal ── */
.log-terminal {
  background: #06090c;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 14px;
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.7;
  max-height: 220px;
  overflow-y: auto;
  color: #7fa8b8;
}
.log-terminal .log-line { margin: 1px 0; }
.log-terminal .log-line.info  { color: #7fa8b8; }
.log-terminal .log-line.good  { color: var(--green); }
.log-terminal .log-line.bad   { color: var(--red); }
.log-terminal .log-line.head  { color: var(--accent); }

/* ── Chart area ── */
.chart-container {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.chart-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-wrap: wrap;
}
.chart-style-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-family: var(--mono);
  font-size: 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all .15s;
}
.chart-style-btn.active {
  background: var(--accent2);
  border-color: var(--accent);
  color: #fff;
}
.chart-tv { width: 100%; height: 400px; }
.chart-asset-select {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 4px 8px;
  font-family: var(--mono);
  font-size: 11px;
  border-radius: 3px;
  outline: none;
}

/* ── Snapshot image ── */
.snapshot-img {
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--border);
  image-rendering: pixelated;
}
.snapshot-label {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  margin-top: 5px;
  text-align: center;
}

/* ── Function tags ── */
.func-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.func-tag {
  padding: 3px 9px;
  background: #00c8ff10;
  border: 1px solid var(--accent2);
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
}

/* ── Fitness sparkline (simple SVG) ── */
.fitness-chart { width: 100%; overflow: hidden; }

/* ── Empty state ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-family: var(--mono);
  font-size: 11px;
  text-align: center;
  gap: 10px;
}
.empty-icon { font-size: 36px; opacity: .3; }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--card);
  border: 1px solid var(--border2);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  padding: 12px 18px;
  border-radius: 4px;
  z-index: 9999;
  box-shadow: 0 4px 20px #000a;
  animation: slideup .2s ease;
}
.toast.ok    { border-left: 3px solid var(--green); }
.toast.error { border-left: 3px solid var(--red);   }
@keyframes slideup { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }

/* ── Create model form overlay ── */
.overlay-backdrop {
  position: fixed; inset: 0;
  background: #000c;
  backdrop-filter: blur(4px);
  z-index: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.overlay-panel {
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 8px;
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px #000b;
}
.overlay-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.overlay-title {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--accent);
}
.overlay-close {
  background: none; border: none;
  color: var(--text-dim); font-size: 18px;
  cursor: pointer; line-height: 1;
}
.overlay-body { padding: 24px; }
.section-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}
.section-gap { margin-bottom: 22px; }

/* ── Asset multi-select ── */
.asset-search-wrap { position: relative; }
.asset-dropdown {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 50;
  background: var(--card);
  border: 1px solid var(--border2);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
}
.asset-option {
  padding: 7px 10px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  cursor: pointer;
  transition: background .1s;
}
.asset-option:hover { background: var(--surface); color: var(--text); }
.asset-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.asset-tag {
  padding: 3px 8px;
  background: #00c8ff0d;
  border: 1px solid var(--border2);
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  cursor: pointer;
  display: flex; align-items: center; gap: 4px;
}
.asset-tag:hover { border-color: var(--red); color: var(--red); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .lab-body { grid-template-columns: 1fr; }
  .lab-sidebar { height: auto; border-right: none; border-bottom: 1px solid var(--border); overflow: visible; }
  .lab-main { padding: 16px; }
}
`;

const BASE_URL = 'https://backend-production-c0ab.up.railway.app';

const ALL_FUNCTIONS = [
  'is_uptrend','is_downtrend','is_ranging_market',
  'is_bullish_market_retracement','is_bearish_market_retracement',
  'is_resistance_level','is_support_level',
  'buy_hold','sell_hold','is_stable_market',
  'is_choppy_market','is_volatile_market',
  'is_bullish_bias','is_bearish_bias',
  'is_high_volume','is_low_volume',
  'is_bullish_engulfing','is_bearish_engulfing',
  'is_hammer','is_shooting_star',
  'snow_alpha_buy','snow_alpha_short',
  'ice_beta_buy','ice_beta_short',
  'is_high_r_squared',
];

const STATUS_DOTS = {
  pending: 'dot-pending', running: 'dot-running',
  completed: 'dot-completed', failed: 'dot-failed', paused: 'dot-paused',
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtPct(v) { return v == null ? '—' : `${parseFloat(v).toFixed(2)}%`; }
function fmtNum(v, d=2) { return v == null ? '—' : parseFloat(v).toFixed(d); }

function Sparkline({ data = [] }) {
  if (data.length < 2) return <div style={{height:36,color:'var(--text-muted)',fontFamily:'var(--mono)',fontSize:10}}>No history yet</div>;
  const vals = data.map(d => d.best_fitness ?? d);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const w = 260, h = 40;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - mn) / (mx - mn + 1e-9)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:44,overflow:'visible'}}>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity=".8"/>
      <circle cx={pts.split(' ').at(-1).split(',')[0]} cy={pts.split(' ').at(-1).split(',')[1]}
              r="3" fill="var(--accent)"/>
    </svg>
  );
}

/* ─── TradingView Lightweight Chart ──────────────────────────────────────── */
function TVChart({ modelId, asset, chartStyle, chartType }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  const themes = {
    dark:  { bg: '#080c10', grid: '#1e2a36', text: '#5a7080', border: '#1e2a36' },
    light: { bg: '#f4f6f8', grid: '#e0e6ec', text: '#4a6070', border: '#cdd6e0' },
    hud:   { bg: '#000a06', grid: '#00300a', text: '#00e590', border: '#003a10' },
  };

  useEffect(() => {
    if (!containerRef.current || !window.LightweightCharts) return;

    const th = themes[chartStyle] || themes.dark;
    const lc = window.LightweightCharts;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = lc.createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: 400,
      layout:      { background: { color: th.bg }, textColor: th.text },
      grid:        { vertLines: { color: th.grid }, horzLines: { color: th.grid } },
      crosshair:   { mode: lc.CrosshairMode.Normal },
      rightPriceScale: { borderColor: th.border },
      timeScale:   { borderColor: th.border, timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    // Series
    let series;
    if (chartType === 'candlestick') {
      series = chart.addCandlestickSeries({
        upColor: '#00e5a0', downColor: '#ff4d6a',
        borderUpColor: '#00e5a0', borderDownColor: '#ff4d6a',
        wickUpColor: '#00e5a0', wickDownColor: '#ff4d6a',
      });
    } else if (chartType === 'area') {
      series = chart.addAreaSeries({
        lineColor: '#00c8ff', topColor: '#00c8ff30', bottomColor: '#00c8ff00',
      });
    } else {
      series = chart.addLineSeries({ color: '#00c8ff', lineWidth: 1.5 });
    }
    seriesRef.current = series;

    // Fetch data
    if (modelId && asset) {
      fetch(`${BASE_URL}/api/snowai/models/${modelId}/chart/${asset}/`)
        .then(r => r.json())
        .then(({ bars = [], trades = [] }) => {
          const sortedBars = [...bars].sort((a, b) => a.time - b.time);

          if (chartType === 'candlestick') {
            series.setData(sortedBars);
          } else {
            series.setData(sortedBars.map(b => ({ time: b.time, value: b.close })));
          }

          // Trade markers
          if (trades.length > 0) {
            const markers = trades.map(t => ({
              time:     t.time,
              position: t.type === 'BUY' ? 'belowBar' : 'aboveBar',
              color:    t.hit_tp ? '#00e5a0' : '#ff4d6a',
              shape:    t.type === 'BUY' ? 'arrowUp' : 'arrowDown',
              text:     `${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}`,
            }));
            series.setMarkers(markers);
          }

          chart.timeScale().fitContent();
        })
        .catch(console.error);
    }

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; } };
  }, [modelId, asset, chartStyle, chartType]);

  return <div ref={containerRef} className="chart-tv" />;
}

/* ─── Create Model Overlay ───────────────────────────────────────────────── */
function CreateModelOverlay({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', assets: [], timeframe: '1d',
    start_year: 2020, end_year: 2024,
    initial_capital: 10000, take_profit: 4.0, stop_loss: 2.0,
    population_size: 30, max_generations: 20, mutation_rate: 0.2,
    elite_fraction: 0.3, rl_enabled: true, rl_learning_rate: 0.01,
    allowed_functions: [],
  });
  const [assetSearch, setAssetSearch] = useState('');
  const [assetDropdown, setAssetDropdown] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dupWarning, setDupWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ALL_ASSETS = [
    'AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META','AMD','INTC','ORCL',
    'JPM','BAC','V','MA','GS','MS','PYPL','JNJ','PFE','ABBV','MRK','AMGN',
    'XOM','CVX','COP','BA','HON','CAT','GE','RTX','HD','MCD','NKE','SBUX',
    'WMT','PG','KO','PEP','NFLX','DIS','TMUS','NEE','AMT','PLD','LIN',
    'BABA','NIO','BTC-USD','ETH-USD','SOL-USD','EURUSD=X','GBPUSD=X','GC=F','CL=F',
    '^GSPC','^DJI','^IXIC','^N225',
  ];

  const filtered = ALL_ASSETS.filter(a =>
    a.toLowerCase().includes(assetSearch.toLowerCase()) && !form.assets.includes(a)
  );

  const addAsset = (a) => {
    setForm(f => ({ ...f, assets: [...f.assets, a] }));
    setAssetSearch('');
    setAssetDropdown(false);
  };

  const removeAsset = (a) => setForm(f => ({ ...f, assets: f.assets.filter(x => x !== a) }));

  const toggleFunc = (fn) => {
    setForm(f => ({
      ...f,
      allowed_functions: f.allowed_functions.includes(fn)
        ? f.allowed_functions.filter(x => x !== fn)
        : [...f.allowed_functions, fn],
    }));
  };

  const checkDuplicate = async () => {
    if (form.assets.length === 0 || form.allowed_functions.length === 0) return;
    setChecking(true);
    try {
      const params = new URLSearchParams({
        functions: form.allowed_functions.join(','),
        assets:    form.assets.join(','),
        timeframe: form.timeframe,
      });
      const r = await fetch(`${BASE_URL}/api/snowai/check-combo/?${params}`);
      const d = await r.json();
      setDupWarning(d.exists ? '⚠ An identical model already exists.' : '');
    } catch (_) {}
    setChecking(false);
  };

  useEffect(() => { checkDuplicate(); }, [form.assets, form.allowed_functions, form.timeframe]);

  const submit = async () => {
    if (!form.name || form.assets.length === 0 || form.allowed_functions.length === 0) return;
    if (dupWarning) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${BASE_URL}/api/snowai/models/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (r.ok) { onCreate(d.model); onClose(); }
      else alert(d.error || 'Failed');
    } catch (e) { alert(e.message); }
    setSubmitting(false);
  };

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel" onClick={e => e.stopPropagation()}>
        <div className="overlay-header">
          <span className="overlay-title">New GA Model</span>
          <button className="overlay-close" onClick={onClose}>×</button>
        </div>
        <div className="overlay-body">

          {/* Basic */}
          <div className="section-gap">
            <div className="section-label">Identification</div>
            <div className="field-grid">
              <div className="field-group" style={{gridColumn:'1/-1'}}>
                <label className="field-label">Model name</label>
                <input className="field-input" value={form.name}
                  onChange={e => f('name', e.target.value)} placeholder="e.g. Uptrend Retracement Alpha" />
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="section-gap">
            <div className="section-label">Assets</div>
            <div className="asset-search-wrap">
              <input className="field-input" style={{width:'100%'}}
                placeholder="Search tickers…"
                value={assetSearch}
                onChange={e => { setAssetSearch(e.target.value); setAssetDropdown(true); }}
                onFocus={() => setAssetDropdown(true)}
              />
              {assetDropdown && filtered.length > 0 && (
                <div className="asset-dropdown">
                  {filtered.slice(0, 20).map(a => (
                    <div key={a} className="asset-option" onClick={() => addAsset(a)}>{a}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="asset-tags">
              {form.assets.map(a => (
                <span key={a} className="asset-tag" onClick={() => removeAsset(a)}>{a} ×</span>
              ))}
              {form.assets.length === 0 && <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-muted)'}}>No assets selected</span>}
            </div>
          </div>

          {/* Params */}
          <div className="section-gap">
            <div className="section-label">Parameters</div>
            <div className="field-grid">
              {[
                {key:'timeframe', label:'Timeframe', type:'select', opts:['1m','5m','15m','1h','4h','1d','1wk']},
                {key:'start_year', label:'Start year', type:'number'},
                {key:'end_year', label:'End year', type:'number'},
                {key:'initial_capital', label:'Capital ($)', type:'number'},
                {key:'take_profit', label:'Take profit (%)', type:'number', step:0.1},
                {key:'stop_loss', label:'Stop loss (%)', type:'number', step:0.1},
              ].map(({key, label, type, opts, step}) => (
                <div key={key} className="field-group">
                  <label className="field-label">{label}</label>
                  {type === 'select' ? (
                    <select className="field-select" value={form[key]} onChange={e => f(key, e.target.value)}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input className="field-input" type="number" step={step||1}
                      value={form[key]} onChange={e => f(key, parseFloat(e.target.value)||0)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GA / RL */}
          <div className="section-gap">
            <div className="section-label">GA / RL Hyper-parameters</div>
            <div className="field-grid">
              {[
                {key:'population_size', label:'Population'},
                {key:'max_generations', label:'Generations'},
                {key:'mutation_rate', label:'Mutation rate', step:0.01},
                {key:'elite_fraction', label:'Elite fraction', step:0.05},
                {key:'rl_learning_rate', label:'RL LR', step:0.001},
              ].map(({key, label, step}) => (
                <div key={key} className="field-group">
                  <label className="field-label">{label}</label>
                  <input className="field-input" type="number" step={step||1}
                    value={form[key]} onChange={e => f(key, parseFloat(e.target.value)||0)} />
                </div>
              ))}
              <div className="field-group">
                <label className="field-label">RL enabled</label>
                <select className="field-select" value={form.rl_enabled ? 'yes' : 'no'}
                  onChange={e => f('rl_enabled', e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Functions */}
          <div className="section-gap">
            <div className="section-label">Function pool ({form.allowed_functions.length} selected)</div>
            <div className="func-grid">
              {ALL_FUNCTIONS.map(fn => (
                <div key={fn} className={`func-chip ${form.allowed_functions.includes(fn)?'selected':''}`}
                  onClick={() => toggleFunc(fn)}>
                  <span className="func-chip-dot"/>
                  {fn}
                </div>
              ))}
            </div>
          </div>

          {dupWarning && (
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--yellow)',
              background:'#f5c84212',border:'1px solid #f5c84230',borderRadius:4,padding:'8px 12px',marginBottom:12}}>
              {dupWarning}
            </div>
          )}

          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary"
              disabled={submitting || !form.name || form.assets.length===0 || form.allowed_functions.length===0 || !!dupWarning}
              onClick={submit}>
              {submitting ? 'Creating…' : 'Create Model'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Model Detail Panel ─────────────────────────────────────────────────── */
function ModelDetail({ model: initialModel, onDelete }) {
  const [model, setModel] = useState(initialModel);
  const [tab, setTab]     = useState('overview');
  const [logs, setLogs]   = useState([]);
  const [logOffset, setLogOffset] = useState(0);
  const [chartStyle, setChartStyle] = useState('dark');
  const [chartType,  setChartType]  = useState('candlestick');
  const [chartAsset, setChartAsset] = useState(initialModel.assets?.[0] || '');
  const [chromosomes, setChromosomes] = useState([]);
  const logsEndRef = useRef(null);
  const pollRef    = useRef(null);

  useEffect(() => {
    setModel(initialModel);
    setLogs([]);
    setLogOffset(0);
    setChartAsset(initialModel.assets?.[0] || '');
    if (initialModel.status === 'running') startPolling(initialModel.id);
    return () => clearInterval(pollRef.current);
  }, [initialModel.id]);

  const startPolling = (id) => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r  = await fetch(`${BASE_URL}/api/snowai/models/${id}/status/?last_log=${logOffset}`);
        const d  = await r.json();
        setModel(m => ({ ...m, status: d.status, progress: d.progress, current_generation: d.generation }));
        if (d.logs?.length) {
          setLogs(l => [...l, ...d.logs]);
          setLogOffset(o => o + d.logs.length);
        }
        if (d.status === 'completed' || d.status === 'failed') {
          clearInterval(pollRef.current);
          // Refresh full model
          fetch(`${BASE_URL}/api/snowai/models/${id}/`).then(r=>r.json()).then(d=>setModel(d.model));
        }
      } catch (_) {}
    }, 1500);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const loadChromosomes = async () => {
    try {
      const r = await fetch(`${BASE_URL}/api/snowai/models/${model.id}/chromosomes/`);
      const d = await r.json();
      setChromosomes(d.chromosomes || []);
    } catch (_) {}
  };

  useEffect(() => {
    if (tab === 'chromosomes') loadChromosomes();
  }, [tab]);

  const handleStart = async () => {
    await fetch(`${BASE_URL}/api/snowai/models/${model.id}/start/`, { method: 'POST' });
    setModel(m => ({ ...m, status: 'running' }));
    setLogs([]);
    startPolling(model.id);
  };

  const handlePause = async () => {
    await fetch(`${BASE_URL}/api/snowai/models/${model.id}/pause/`, { method: 'POST' });
    setModel(m => ({ ...m, status: 'paused' }));
    clearInterval(pollRef.current);
  };

  const handleResume = async () => {
    await fetch(`${BASE_URL}/api/snowai/models/${model.id}/resume/`, { method: 'POST' });
    setModel(m => ({ ...m, status: 'running' }));
    startPolling(model.id);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this model and all its data?')) return;
    await fetch(`${BASE_URL}/api/snowai/models/${model.id}/`, { method: 'DELETE' });
    onDelete(model.id);
  };

  const bc = model.best_chromosome;
  const fh = model.fitness_history || [];

  const logClass = (l) => {
    if (l.startsWith('🏆') || l.startsWith('✓') || l.startsWith('🎉') || l.startsWith('✅')) return 'good';
    if (l.startsWith('❌') || l.startsWith('✗')) return 'bad';
    if (l.startsWith('🔬') || l.startsWith('🧬') || l.startsWith('📡')) return 'head';
    return 'info';
  };

  return (
    <div>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20,gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'var(--mono)',fontSize:18,fontWeight:500,color:'var(--text)',marginBottom:4}}>
            {model.name}
          </div>
          <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)',display:'flex',gap:12,flexWrap:'wrap'}}>
            <span><span className={`status-dot ${STATUS_DOTS[model.status]||'dot-pending'}`}/>
              {model.status}</span>
            <span>{model.timeframe}</span>
            <span>{model.start_year}–{model.end_year}</span>
            <span>gen {model.current_generation}/{model.max_generations}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {(model.status==='pending'||model.status==='failed'||model.status==='completed') && (
            <button className="btn btn-primary btn-sm" onClick={handleStart}>▶ Run</button>
          )}
          {model.status==='running' && (
            <button className="btn btn-ghost btn-sm" onClick={handlePause}>⏸ Pause</button>
          )}
          {model.status==='paused' && (
            <button className="btn btn-ghost btn-sm" onClick={handleResume}>▶ Resume</button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Progress */}
      {(model.status==='running'||model.status==='paused') && (
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-dim)',marginBottom:4}}>
            {model.progress}% — generation {model.current_generation}/{model.max_generations}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width:`${model.progress}%`}}/>
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div className="tab-row" style={{padding:0,marginBottom:20}}>
        {['overview','chart','chromosomes','logs'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────── */}
      {tab==='overview' && (
        <>
          {/* Config */}
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Configuration</span></div>
            <div className="panel-body">
              <div className="metrics-grid">
                {[
                  {l:'Assets', v: model.assets?.join(', ')},
                  {l:'Timeframe', v:model.timeframe},
                  {l:'Period', v:`${model.start_year}–${model.end_year}`},
                  {l:'Capital', v:`$${model.initial_capital?.toLocaleString()}`},
                  {l:'Take profit', v:`${model.take_profit}%`},
                  {l:'Stop loss', v:`${model.stop_loss}%`},
                  {l:'Population', v:model.population_size},
                  {l:'Generations', v:model.max_generations},
                  {l:'Mutation', v:model.mutation_rate},
                  {l:'RL', v:model.rl_enabled?'enabled':'off'},
                ].map(({l,v}) => (
                  <div key={l} className="metric-cell">
                    <div className="metric-cell-label">{l}</div>
                    <div className="metric-cell-value val-plain" style={{fontSize:12}}>{v??'—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best chromosome */}
          {bc ? (
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Best Strategy Found</span>
                <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-dim)'}}>gen {bc.generation}</span>
              </div>
              <div className="panel-body">
                <div className="func-tags" style={{marginBottom:14}}>
                  {bc.functions?.map(fn => <span key={fn} className="func-tag">{fn}</span>)}
                </div>
                <div className="metrics-grid">
                  <div className="metric-cell">
                    <div className="metric-cell-label">Fitness</div>
                    <div className="metric-cell-value val-blue">{fmtNum(bc.fitness)}</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-cell-label">Win rate</div>
                    <div className={`metric-cell-value ${bc.win_rate>=50?'val-green':'val-red'}`}>{fmtPct(bc.win_rate)}</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-cell-label">Trades</div>
                    <div className="metric-cell-value val-plain">{bc.total_trades}</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-cell-label">PnL</div>
                    <div className={`metric-cell-value ${bc.total_pnl>=0?'val-green':'val-red'}`}>${fmtNum(bc.total_pnl)}</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-cell-label">Sharpe</div>
                    <div className="metric-cell-value val-plain">{fmtNum(bc.sharpe_ratio)}</div>
                  </div>
                  <div className="metric-cell">
                    <div className="metric-cell-label">Max DD</div>
                    <div className="metric-cell-value val-red">{fmtPct(bc.max_drawdown)}</div>
                  </div>
                </div>

                {/* Market snapshot */}
                {bc.market_snapshot && (
                  <div style={{marginTop:18}}>
                    <div className="section-label" style={{marginBottom:8}}>Market Condition Snapshot</div>
                    <img className="snapshot-img" src={`data:image/png;base64,${bc.market_snapshot}`}
                      alt="market snapshot" />
                    <div className="snapshot-label">
                      Regime heatmap at time of evaluation — {bc.market_snapshot_meta?.is_uptrend?'uptrend':'non-uptrend'} |
                      ATR {bc.market_snapshot_meta?.atr?.toFixed?.(5)} |
                      RSI {bc.market_snapshot_meta?.rsi?.toFixed?.(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="panel">
              <div className="panel-body">
                <div className="empty-state">
                  <span className="empty-icon">⬡</span>
                  <span>No strategy evolved yet. Run the model to start.</span>
                </div>
              </div>
            </div>
          )}

          {/* Fitness history sparkline */}
          {fh.length > 1 && (
            <div className="panel">
              <div className="panel-header"><span className="panel-title">Fitness History</span></div>
              <div className="panel-body">
                <Sparkline data={fh} />
                <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-muted)',marginTop:6}}>
                  best per generation · {fh.length} generations recorded
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Chart ───────────────────────────────────────────── */}
      {tab==='chart' && (
        <div className="chart-container">
          <div className="chart-controls">
            <select className="chart-asset-select" value={chartAsset}
              onChange={e => setChartAsset(e.target.value)}>
              {(model.assets||[]).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div style={{display:'flex',gap:4}}>
              {['candlestick','line','area'].map(t => (
                <button key={t} className={`chart-style-btn ${chartType===t?'active':''}`}
                  onClick={()=>setChartType(t)}>{t}</button>
              ))}
            </div>
            <div style={{display:'flex',gap:4,marginLeft:'auto'}}>
              {['dark','light','hud'].map(s => (
                <button key={s} className={`chart-style-btn ${chartStyle===s?'active':''}`}
                  onClick={()=>setChartStyle(s)}>{s}</button>
              ))}
            </div>
          </div>
          {window.LightweightCharts ? (
            <TVChart modelId={model.id} asset={chartAsset}
              chartStyle={chartStyle} chartType={chartType} />
          ) : (
            <div className="empty-state" style={{height:400}}>
              <span className="empty-icon">📈</span>
              <span>TradingView Lightweight Charts not loaded.</span>
              <span style={{fontSize:10,color:'var(--text-muted)'}}>
                Add: &lt;script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"&gt;&lt;/script&gt;
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Chromosomes ─────────────────────────────────────── */}
      {tab==='chromosomes' && (
        <div>
          {chromosomes.length === 0 ? (
            <div className="panel">
              <div className="panel-body">
                <div className="empty-state">
                  <span className="empty-icon">⬡</span>
                  <span>No chromosomes recorded yet.</span>
                </div>
              </div>
            </div>
          ) : chromosomes.map(c => (
            <div key={c.id} className="panel" style={{marginBottom:12}}>
              <div className="panel-header">
                <div className="func-tags">
                  {c.functions?.map(fn => <span key={fn} className="func-tag">{fn}</span>)}
                </div>
                <div style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-dim)',display:'flex',gap:12}}>
                  {c.is_elite && <span style={{color:'var(--yellow)'}}>★ elite</span>}
                  <span>gen {c.generation}</span>
                </div>
              </div>
              <div className="panel-body" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:18,alignItems:'start'}}>
                <div className="metrics-grid">
                  {[
                    {l:'Fitness',  v:fmtNum(c.fitness),   cls:'val-blue'},
                    {l:'Win rate', v:fmtPct(c.win_rate),  cls:c.win_rate>=50?'val-green':'val-red'},
                    {l:'Trades',   v:c.total_trades,      cls:'val-plain'},
                    {l:'PnL',      v:`$${fmtNum(c.total_pnl)}`, cls:c.total_pnl>=0?'val-green':'val-red'},
                    {l:'Sharpe',   v:fmtNum(c.sharpe_ratio), cls:'val-plain'},
                    {l:'Max DD',   v:fmtPct(c.max_drawdown),  cls:'val-red'},
                  ].map(({l,v,cls})=>(
                    <div key={l} className="metric-cell">
                      <div className="metric-cell-label">{l}</div>
                      <div className={`metric-cell-value ${cls}`} style={{fontSize:14}}>{v}</div>
                    </div>
                  ))}
                </div>
                {c.market_snapshot && (
                  <div style={{width:180,flexShrink:0}}>
                    <img className="snapshot-img" src={`data:image/png;base64,${c.market_snapshot}`} alt="snapshot"/>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Logs ────────────────────────────────────────────── */}
      {tab==='logs' && (
        <div>
          <div className="log-terminal">
            {logs.length === 0
              ? <span className="log-line info">No logs yet. Start the model to see output.</span>
              : logs.map((l, i) => (
                  <div key={i} className={`log-line ${logClass(l)}`}>{l}</div>
                ))
            }
            <div ref={logsEndRef}/>
          </div>
          <div style={{marginTop:10,fontFamily:'var(--mono)',fontSize:10,color:'var(--text-muted)'}}>
            {logs.length} log lines · auto-scrolling
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function SnowAISandbox() {
  const [models,      setModels]      = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);
  const [search,      setSearch]      = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTf,    setFilterTf]    = useState('');
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type='ok') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const loadModels = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search)       params.set('q',         search);
      if (filterStatus) params.set('status',     filterStatus);
      if (filterTf)     params.set('timeframe',  filterTf);
      const r = await fetch(`${BASE_URL}/api/snowai/models/?${params}`);
      const d = await r.json();
      setModels(d.models || []);
    } catch (_) {}
  }, [search, filterStatus, filterTf]);

  useEffect(() => { loadModels(); }, [loadModels]);

  // Poll running models every 10s for sidebar refresh
  useEffect(() => {
    const id = setInterval(() => {
      if (models.some(m => m.status === 'running')) loadModels();
    }, 10000);
    return () => clearInterval(id);
  }, [models, loadModels]);

  const handleCreate = (model) => {
    setModels(ms => [model, ...ms]);
    setSelected(model);
    showToast('Model created and queued.');
  };

  const handleDelete = (id) => {
    setModels(ms => ms.filter(m => m.id !== id));
    setSelected(null);
    showToast('Model deleted.', 'ok');
  };

  // When a model is selected, fetch full detail
  const selectModel = async (m) => {
    try {
      const r = await fetch(`${BASE_URL}/api/snowai/models/${m.id}/`);
      const d = await r.json();
      setSelected(d.model || m);
    } catch (_) {
      setSelected(m);
    }
  };

  return (
    <div>
      <style>{styles}</style>
      {/* Inject TradingView Lightweight Charts */}
      <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js" />

      <Header />
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="lab-wrapper">

            {/* Top bar */}
            <div className="lab-topbar">
              <span className="lab-title">
                SnowAI Sandbox
                <span>· GA / RL Strategy Discovery</span>
              </span>
            </div>

            {/* Body */}
            <div className="lab-body">

              {/* ── Sidebar ── */}
              <div className="lab-sidebar">
                <div className="sidebar-search">
                  <input placeholder="Search models…"
                    value={search} onChange={e => setSearch(e.target.value)} />
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="failed">Failed</option>
                  </select>
                  <select value={filterTf} onChange={e => setFilterTf(e.target.value)}>
                    <option value="">All timeframes</option>
                    {['1m','5m','15m','1h','4h','1d','1wk'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button className="new-model-btn" onClick={() => setShowCreate(true)}>
                  + New Model
                </button>

                {models.length === 0 ? (
                  <div className="empty-state" style={{padding:'40px 16px'}}>
                    <span className="empty-icon">⬡</span>
                    <span>No models found.</span>
                    <span style={{color:'var(--text-muted)',fontSize:10}}>Create one to get started.</span>
                  </div>
                ) : models.map(m => (
                  <div key={m.id}
                    className={`model-item ${selected?.id===m.id?'selected':''}`}
                    onClick={() => selectModel(m)}>
                    <div className="model-item-name">
                      <span className={`status-dot ${STATUS_DOTS[m.status]||'dot-pending'}`}/>
                      {m.name}
                    </div>
                    <div className="model-item-meta">
                      <span>{m.assets?.slice(0,3).join(',')} {m.assets?.length>3?`+${m.assets.length-3}`:''}</span>
                      <span>{m.timeframe}</span>
                      {m.status==='running' && <span style={{color:'var(--accent)'}}>gen {m.current_generation}</span>}
                      {m.best_chromosome && (
                        <span style={{color: m.best_chromosome.win_rate>=50?'var(--green)':'var(--red)'}}>
                          wr {fmtPct(m.best_chromosome.win_rate)}
                        </span>
                      )}
                    </div>
                    {m.status==='running' && (
                      <div className="progress-bar" style={{marginTop:6}}>
                        <div className="progress-fill" style={{width:`${m.progress||0}%`}}/>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Main detail area ── */}
              <div className="lab-main">
                {selected ? (
                  <ModelDetail key={selected.id} model={selected} onDelete={handleDelete} />
                ) : (
                  <div className="empty-state" style={{height:'100%',minHeight:400}}>
                    <span className="empty-icon">⬡</span>
                    <span>Select a model from the sidebar</span>
                    <span style={{color:'var(--text-muted)',fontSize:10}}>or create a new one to begin.</span>
                    <button className="btn btn-primary" style={{marginTop:12}}
                      onClick={()=>setShowCreate(true)}>+ New Model</button>
                  </div>
                )}
              </div>
            </div>

            {/* Create overlay */}
            {showCreate && (
              <CreateModelOverlay
                onClose={() => setShowCreate(false)}
                onCreate={handleCreate} />
            )}

            {/* Toast */}
            {toast && (
              <div className={`toast ${toast.type}`}>{toast.msg}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}