import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

/* ─────────────────────────────────────────────────────────────────────────
   STYLES  –  all classnames prefixed .snw- to avoid collision with nav
   Two themes: [data-snw-theme="dark"] and [data-snw-theme="light"]
───────────────────────────────────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

/* ── Theme tokens ── */
[data-snw-theme="dark"] {
  --snw-bg:          #080c10;
  --snw-surface:     #0d1219;
  --snw-card:        #111820;
  --snw-border:      #1e2a36;
  --snw-border2:     #263545;
  --snw-text:        #cdd6e0;
  --snw-text-dim:    #5a7080;
  --snw-text-muted:  #3a5060;
  --snw-accent:      #00c8ff;
  --snw-accent2:     #0084aa;
  --snw-accent-bg:   #00c8ff0d;
  --snw-green:       #00e5a0;
  --snw-red:         #ff4d6a;
  --snw-yellow:      #f5c842;
  --snw-shadow:      0 4px 20px rgba(0,0,0,0.5);
  --snw-shadow-sm:   0 2px 8px rgba(0,0,0,0.4);
}

[data-snw-theme="light"] {
  --snw-bg:          #f0f5fa;
  --snw-surface:     #ffffff;
  --snw-card:        #ffffff;
  --snw-border:      #d0dce8;
  --snw-border2:     #b0c4d8;
  --snw-text:        #1a2a3a;
  --snw-text-dim:    #6080a0;
  --snw-text-muted:  #90aabf;
  --snw-accent:      #0090c8;
  --snw-accent2:     #006fa0;
  --snw-accent-bg:   #0090c810;
  --snw-green:       #00965a;
  --snw-red:         #d93050;
  --snw-yellow:      #c09000;
  --snw-shadow:      0 4px 20px rgba(0,80,140,0.10);
  --snw-shadow-sm:   0 2px 8px rgba(0,80,140,0.08);
}

/* ── Base reset (scoped) ── */
.snw-wrap *, .snw-wrap *::before, .snw-wrap *::after {
  box-sizing: border-box;
}

.snw-wrap {
  min-height: 100vh;
  background: var(--snw-bg);
  font-family: 'IBM Plex Sans', sans-serif;
  color: var(--snw-text);
  transition: background .25s, color .25s;
}

/* ── Topbar ── */
.snw-topbar {
  padding: 22px 28px 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid var(--snw-border);
}
.snw-topbar-left {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--snw-accent);
  margin-bottom: -1px;
}
.snw-logo-mark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--snw-accent);
  letter-spacing: .04em;
}
.snw-logo-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--snw-text-dim);
}
.snw-theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background: var(--snw-card);
  border: 1px solid var(--snw-border);
  border-radius: 20px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--snw-text-dim);
  transition: all .2s;
  user-select: none;
}
.snw-theme-toggle:hover {
  border-color: var(--snw-accent2);
  color: var(--snw-accent);
}
.snw-theme-pill {
  width: 28px; height: 14px;
  background: var(--snw-border2);
  border-radius: 7px;
  position: relative;
  transition: background .2s;
}
.snw-theme-pill.on { background: var(--snw-accent2); }
.snw-theme-pill::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 10px; height: 10px;
  background: var(--snw-surface);
  border-radius: 50%;
  transition: transform .2s;
}
.snw-theme-pill.on::after { transform: translateX(14px); }

/* ── Layout ── */
.snw-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  height: calc(100vh - 112px);
  overflow: hidden;
}
.snw-sidebar {
  border-right: 1px solid var(--snw-border);
  overflow-y: auto;
  background: var(--snw-surface);
}
.snw-main {
  overflow-y: auto;
  padding: 22px 26px;
  background: var(--snw-bg);
}

/* ── Sidebar ── */
.snw-sidebar-search {
  padding: 14px;
  border-bottom: 1px solid var(--snw-border);
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.snw-sidebar-search input,
.snw-sidebar-search select {
  width: 100%;
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  color: var(--snw-text);
  padding: 7px 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  border-radius: 4px;
  outline: none;
  transition: border-color .2s;
}
.snw-sidebar-search input:focus,
.snw-sidebar-search select:focus {
  border-color: var(--snw-accent2);
}
.snw-new-btn {
  margin: 14px;
  width: calc(100% - 28px);
  padding: 9px;
  background: transparent;
  border: 1px dashed var(--snw-accent2);
  color: var(--snw-accent);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 4px;
  transition: background .2s, border-color .2s;
}
.snw-new-btn:hover {
  background: var(--snw-accent-bg);
  border-style: solid;
}
.snw-model-item {
  padding: 13px 15px;
  border-bottom: 1px solid var(--snw-border);
  cursor: pointer;
  transition: background .15s;
  position: relative;
}
.snw-model-item:hover { background: var(--snw-bg); }
.snw-model-item.snw-selected {
  background: var(--snw-bg);
  border-left: 2px solid var(--snw-accent);
}
.snw-model-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--snw-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.snw-model-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--snw-text-dim);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.snw-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
  flex-shrink: 0;
}
.snw-dot-pending   { background: var(--snw-yellow); }
.snw-dot-running   { background: var(--snw-accent); animation: snw-blink 1s ease-in-out infinite; }
.snw-dot-completed { background: var(--snw-green); }
.snw-dot-failed    { background: var(--snw-red); }
.snw-dot-paused    { background: var(--snw-text-dim); }
@keyframes snw-blink { 0%,100%{opacity:1} 50%{opacity:.25} }

/* ── Progress bar ── */
.snw-progress-bar {
  height: 2px;
  background: var(--snw-border);
  border-radius: 1px;
  overflow: hidden;
  margin: 8px 0 2px;
}
.snw-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--snw-accent2), var(--snw-accent));
  transition: width .4s ease;
  box-shadow: 0 0 6px var(--snw-accent);
}

/* ── Panels ── */
.snw-panel {
  background: var(--snw-card);
  border: 1px solid var(--snw-border);
  border-radius: 6px;
  margin-bottom: 18px;
  box-shadow: var(--snw-shadow-sm);
}
.snw-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--snw-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.snw-panel-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--snw-accent);
}
.snw-panel-body { padding: 16px; }

/* ── Buttons — all prefixed snw-btn ── */
.snw-btn {
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.snw-btn:disabled { opacity: .4; cursor: not-allowed; }

.snw-btn-primary {
  background: var(--snw-accent);
  color: #fff;
  font-weight: 600;
}
[data-snw-theme="dark"] .snw-btn-primary { color: #000; }
.snw-btn-primary:hover:not(:disabled) {
  filter: brightness(1.12);
  box-shadow: 0 0 14px color-mix(in srgb, var(--snw-accent) 40%, transparent);
}
.snw-btn-ghost {
  background: transparent;
  color: var(--snw-text-dim);
  border: 1px solid var(--snw-border);
}
.snw-btn-ghost:hover:not(:disabled) {
  border-color: var(--snw-border2);
  color: var(--snw-text);
}
.snw-btn-danger {
  background: transparent;
  color: var(--snw-red);
  border: 1px solid color-mix(in srgb, var(--snw-red) 30%, transparent);
}
.snw-btn-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--snw-red) 8%, transparent);
  border-color: var(--snw-red);
}
.snw-btn-sm { padding: 5px 12px; font-size: 10px; }

/* ── Tab nav ── */
.snw-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--snw-border);
  margin-bottom: 18px;
}
.snw-tab {
  background: none;
  border: none;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--snw-text-dim);
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-color .2s;
  margin-bottom: -1px;
}
.snw-tab:hover { color: var(--snw-text); }
.snw-tab.snw-tab-active { color: var(--snw-accent); border-bottom-color: var(--snw-accent); }

/* ── Form fields ── */
.snw-field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 13px;
}
.snw-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.snw-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--snw-text-dim);
}
.snw-input, .snw-select {
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  color: var(--snw-text);
  padding: 8px 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  border-radius: 4px;
  outline: none;
  transition: border-color .2s;
  width: 100%;
}
.snw-input:focus, .snw-select:focus { border-color: var(--snw-accent2); }

/* ── Section label ── */
.snw-section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--snw-text-dim);
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--snw-border);
}
.snw-section-gap { margin-bottom: 20px; }

/* ── Function chips ── */
.snw-func-category {
  margin-bottom: 14px;
}
.snw-func-category-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--snw-text-muted);
  margin-bottom: 7px;
}
.snw-func-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 5px;
}
.snw-func-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  border-radius: 4px;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  color: var(--snw-text-dim);
  transition: all .15s;
  user-select: none;
}
.snw-func-chip:hover {
  border-color: var(--snw-border2);
  color: var(--snw-text);
}
.snw-func-chip.snw-func-on {
  border-color: var(--snw-accent2);
  color: var(--snw-accent);
  background: var(--snw-accent-bg);
}
.snw-func-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  border: 1px solid var(--snw-text-muted);
  flex-shrink: 0;
  transition: all .15s;
}
.snw-func-chip.snw-func-on .snw-func-dot {
  background: var(--snw-accent);
  border-color: var(--snw-accent);
  box-shadow: 0 0 5px var(--snw-accent);
}

/* ── Metrics grid ── */
.snw-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 9px;
}
.snw-metric {
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  border-radius: 4px;
  padding: 11px 13px;
}
.snw-metric-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--snw-text-muted);
  margin-bottom: 5px;
}
.snw-metric-val {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 17px;
  font-weight: 500;
}
.snw-val-green { color: var(--snw-green); }
.snw-val-red   { color: var(--snw-red); }
.snw-val-blue  { color: var(--snw-accent); }
.snw-val-plain { color: var(--snw-text); }

/* ── Function tags ── */
.snw-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.snw-tag {
  padding: 3px 8px;
  background: var(--snw-accent-bg);
  border: 1px solid var(--snw-accent2);
  border-radius: 3px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--snw-accent);
}

/* ── Log terminal ── */
.snw-terminal {
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  border-radius: 4px;
  padding: 13px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  line-height: 1.7;
  max-height: 240px;
  overflow-y: auto;
  color: var(--snw-text-dim);
}
.snw-log-good  { color: var(--snw-green); }
.snw-log-bad   { color: var(--snw-red); }
.snw-log-head  { color: var(--snw-accent); }
.snw-log-plain { color: var(--snw-text-dim); }

/* ── Chart ── */
.snw-chart-wrap {
  background: var(--snw-card);
  border: 1px solid var(--snw-border);
  border-radius: 6px;
  overflow: hidden;
}
.snw-chart-controls {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 9px 13px;
  border-bottom: 1px solid var(--snw-border);
  background: var(--snw-surface);
  flex-wrap: wrap;
}
.snw-chart-btn {
  padding: 4px 9px;
  background: transparent;
  border: 1px solid var(--snw-border);
  color: var(--snw-text-dim);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all .15s;
}
.snw-chart-btn.snw-chart-btn-active {
  background: var(--snw-accent2);
  border-color: var(--snw-accent);
  color: #fff;
}
.snw-chart-asset-sel {
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  color: var(--snw-text);
  padding: 4px 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  border-radius: 3px;
  outline: none;
}
.snw-chart-tv { width: 100%; height: 400px; }

/* ── Snapshot ── */
.snw-snapshot {
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--snw-border);
}
.snw-snapshot-cap {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--snw-text-muted);
  margin-top: 5px;
  text-align: center;
}

/* ── Asset tags ── */
.snw-asset-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.snw-asset-tag {
  padding: 3px 8px;
  background: var(--snw-accent-bg);
  border: 1px solid var(--snw-border2);
  border-radius: 3px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--snw-text-dim);
  cursor: pointer;
  display: flex; align-items: center; gap: 4px;
}
.snw-asset-tag:hover { border-color: var(--snw-red); color: var(--snw-red); }
.snw-asset-dropdown {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 50;
  background: var(--snw-card);
  border: 1px solid var(--snw-border2);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: var(--snw-shadow);
}
.snw-asset-opt {
  padding: 7px 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--snw-text-dim);
  cursor: pointer;
  transition: background .1s;
}
.snw-asset-opt:hover { background: var(--snw-bg); color: var(--snw-text); }

/* ── Overlay ── */
.snw-overlay-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(5px);
  z-index: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.snw-overlay-panel {
  background: var(--snw-card);
  border: 1px solid var(--snw-border2);
  border-radius: 8px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--snw-shadow);
}
.snw-overlay-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--snw-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky; top: 0;
  background: var(--snw-card);
  z-index: 2;
}
.snw-overlay-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--snw-accent);
}
.snw-overlay-close {
  background: none; border: none;
  color: var(--snw-text-dim);
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  transition: color .15s;
}
.snw-overlay-close:hover { color: var(--snw-text); }
.snw-overlay-body { padding: 22px; }

/* ── Dup warning ── */
.snw-dup-warn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--snw-yellow);
  background: color-mix(in srgb, var(--snw-yellow) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--snw-yellow) 30%, transparent);
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
}

/* ── Empty state ── */
.snw-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--snw-text-muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  text-align: center;
  gap: 10px;
}
.snw-empty-icon { font-size: 34px; opacity: .3; }

/* ── Toast ── */
.snw-toast {
  position: fixed;
  bottom: 24px; right: 24px;
  background: var(--snw-card);
  border: 1px solid var(--snw-border2);
  color: var(--snw-text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding: 11px 16px;
  border-radius: 4px;
  z-index: 9999;
  box-shadow: var(--snw-shadow);
  animation: snw-slideup .2s ease;
}
.snw-toast.snw-ok    { border-left: 3px solid var(--snw-green); }
.snw-toast.snw-error { border-left: 3px solid var(--snw-red); }
@keyframes snw-slideup {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* ── Sparkline ── */
.snw-spark { width: 100%; overflow: hidden; }

/* ── Scrollbar ── */
.snw-wrap ::-webkit-scrollbar { width: 4px; height: 4px; }
.snw-wrap ::-webkit-scrollbar-track { background: transparent; }
.snw-wrap ::-webkit-scrollbar-thumb { background: var(--snw-border2); border-radius: 2px; }

/* ── Responsive ── */
@media (max-width: 860px) {
  .snw-body { grid-template-columns: 1fr; height: auto; overflow: visible; }
  .snw-sidebar { height: auto; border-right: none; border-bottom: 1px solid var(--snw-border); }
  .snw-main { padding: 14px; }
}
`;

const BASE_URL = 'https://backend-production-c0ab.up.railway.app';

/* ── Full function list grouped by category ── */
const FUNCTION_CATEGORIES = [
  {
    label: 'Trend',
    fns: [
      'is_uptrend','is_downtrend','is_ranging_market',
      'is_bullish_market_retracement','is_bearish_market_retracement',
      'is_bullish_bias','is_bearish_bias','is_high_r_squared',
    ],
  },
  {
    label: 'Support / Resistance',
    fns: [
      'is_support_level','is_resistance_level','is_fibonacci_level',
      'is_ote_buy','is_ote_sell',
      'is_bullish_orderblock','is_bearish_orderblock',
    ],
  },
  {
    label: 'Market Regime',
    fns: [
      'is_stable_market','is_choppy_market','is_volatile_market',
      'is_high_volume','is_low_volume',
      'buy_hold','sell_hold','buy_hold_regime',
    ],
  },
  {
    label: 'Candlestick Patterns',
    fns: [
      'is_bullish_candle','is_bearish_candle',
      'is_bullish_engulfing','is_bearish_engulfing',
      'is_morning_star','is_evening_star',
      'is_three_white_soldiers','is_three_black_crows',
      'is_morning_doji_star','is_evening_doji_star',
      'is_rising_three_methods','is_falling_three_methods',
      'is_hammer','is_hanging_man','is_inverted_hammer','is_shooting_star',
      'is_bullish_kicker','is_bearish_kicker',
      'is_bullish_harami','is_bearish_harami',
      'is_bullish_three_line_strike','is_bearish_three_line_strike',
    ],
  },
  {
    label: 'Session',
    fns: [
      'new_york_session','london_session','asian_session',
      'is_asian_range_buy','is_asian_range_sell',
      'is_bullish_weekly_profile','is_bearish_weekly_profile',
    ],
  },
  {
    label: 'SnowAI Proprietary',
    fns: [
      'snow_alpha_buy','snow_alpha_short',
      'ice_beta_buy','ice_beta_short',
      'frost_gamma_buy','frost_gamma_short',
      'glacier_x_buy','glacier_x_short',
      'avalanche_z_buy','avalanche_z_short',
      'polar_prime_buy','polar_prime_short',
      'blizzard_omega_buy','blizzard_omega_short',
      'tundra_sigma_buy','tundra_sigma_short',
      'arctic_delta_buy','arctic_delta_short',
      'permafrost_theta_buy','permafrost_theta_short',
    ],
  },
  {
    label: 'Statistical / Quantitative',
    fns: [
      'is_monte_carlo_bullish_prediction','is_monte_carlo_bearish_prediction',
      'average_retracement',
    ],
  },
];

const ALL_FUNCTIONS = FUNCTION_CATEGORIES.flatMap(c => c.fns);

const STATUS_DOTS = {
  pending: 'snw-dot-pending', running: 'snw-dot-running',
  completed: 'snw-dot-completed', failed: 'snw-dot-failed', paused: 'snw-dot-paused',
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtPct(v) { return v == null ? '—' : `${parseFloat(v).toFixed(2)}%`; }
function fmtNum(v, d=2) { return v == null ? '—' : parseFloat(v).toFixed(d); }

function Sparkline({ data = [] }) {
  if (data.length < 2) return (
    <div style={{height:36,color:'var(--snw-text-muted)',fontFamily:'IBM Plex Mono, monospace',fontSize:10}}>
      No history yet
    </div>
  );
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
      <polyline points={pts} fill="none" stroke="var(--snw-accent)" strokeWidth="1.5" opacity=".8"/>
      <circle cx={pts.split(' ').at(-1).split(',')[0]} cy={pts.split(' ').at(-1).split(',')[1]}
              r="3" fill="var(--snw-accent)"/>
    </svg>
  );
}

/* ─── TradingView Lightweight Chart ──────────────────────────────────────── */
function TVChart({ modelId, asset, chartStyle, chartType }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);

  const themes = {
    dark:  { bg: '#080c10', grid: '#1e2a36', text: '#5a7080', border: '#1e2a36' },
    light: { bg: '#f0f5fa', grid: '#d0dce8', text: '#6080a0', border: '#d0dce8' },
    hud:   { bg: '#000a06', grid: '#00300a', text: '#00e590', border: '#003a10' },
  };

  useEffect(() => {
    if (!containerRef.current || !window.LightweightCharts) return;
    const th = themes[chartStyle] || themes.dark;
    const lc = window.LightweightCharts;
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }

    const chart = lc.createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: 400,
      layout:          { background: { color: th.bg }, textColor: th.text },
      grid:            { vertLines: { color: th.grid }, horzLines: { color: th.grid } },
      crosshair:       { mode: lc.CrosshairMode.Normal },
      rightPriceScale: { borderColor: th.border },
      timeScale:       { borderColor: th.border, timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    let series;
    if (chartType === 'candlestick') {
      series = chart.addCandlestickSeries({
        upColor: '#00c896', downColor: '#e03060',
        borderUpColor: '#00c896', borderDownColor: '#e03060',
        wickUpColor: '#00c896', wickDownColor: '#e03060',
      });
    } else if (chartType === 'area') {
      series = chart.addAreaSeries({
        lineColor: '#0090c8', topColor: '#0090c830', bottomColor: '#0090c800',
      });
    } else {
      series = chart.addLineSeries({ color: '#0090c8', lineWidth: 1.5 });
    }

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
          if (trades.length > 0) {
            series.setMarkers(trades.map(t => ({
              time:     t.time,
              position: t.type === 'BUY' ? 'belowBar' : 'aboveBar',
              color:    t.hit_tp ? '#00c896' : '#e03060',
              shape:    t.type === 'BUY' ? 'arrowUp' : 'arrowDown',
              text:     `${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}`,
            })));
          }
          chart.timeScale().fitContent();
        })
        .catch(console.error);
    }

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current)
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      if (chartRef.current) { chartRef.current.remove(); chartRef.current = null; }
    };
  }, [modelId, asset, chartStyle, chartType]);

  return <div ref={containerRef} className="snw-chart-tv" />;
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
  const [assetSearch,   setAssetSearch]   = useState('');
  const [assetDropdown, setAssetDropdown] = useState(false);
  const [dupWarning,    setDupWarning]    = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  const ALL_ASSETS = [
    // Forex
    'EURUSD=X','GBPUSD=X','USDJPY=X','AUDUSD=X','USDCAD=X','USDCHF=X',
    'NZDUSD=X','EURGBP=X','EURJPY=X','GBPJPY=X','AUDJPY=X','EURCHF=X',
    // Tech Giants & Semiconductors
    'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC',
    'ORCL','CSCO','ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC',
    'SNPS','CDNS','MRVL','NXPI','MU','ADI','MPWR','SWKS','QRVO','ON',
    'IBM','AAOI','ACLS','ACN','ADSK','AKAM','ANSS','APH','ANET','ASML',
    'AVAV','KEYS','MCHP','MTSI','MSI','MDB','NTAP','NTNX','PAYC','PTC',
    'ROP','SAP','SLAB','STX','TER','TSM','TYL','UMC','VRSN','WDC','XLNX','ZBRA',
    // Software & Cloud
    'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR',
    'TEAM','FTNT','OKTA','S','CYBR',
    // Fintech & Payments
    'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER',
    'LYFT','DASH','PINS','SNAP','SPOT','ROKU','Z','ZG','AFRM','COIN',
    'HOOD','SOFI','RBLX','ASTS',
    // Banks & Financial Services
    'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME',
    'ICE','MCO','BK','USB','PNC','TFC','COF','AFL','AMG','AON','AJG',
    'AMP','BEN','CBOE','CINF','DFS','ERIE','FITB','FRC','GL','HBAN',
    'HIG','IVZ','JKHY','KEY','L','LNC','MTB','NTRS','NDAQ','PFG','RF',
    'RJF','SIVB','STT','SYF','TROW','WRB','ZION','CFG','CMA','FHN',
    'EWBC','WAL','WBS','ALLY',
    // Insurance
    'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
    // Healthcare & Pharma
    'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY','AMGN',
    'GILD','CVS','CI','ELV','HUM','VRTX','REGN','ISRG','BIIB','MRNA',
    'BNTX','SGEN','ALNY','BGNE','MCK','CAH','COR','IDXX','A','WAT',
    'ALGN','ATRC','BAX','BDX','BIO','BSX','CERN','DXCM','EW','EXAS',
    'HOLX','HSIC','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PKI',
    'PODD','RMD','STE','SYK','TFX','UHS','WST','XRAY','ZBH','ZTS',
    'TDOC','DOCS','VEEV','HALO','NVAX','IONS','UTHR',
    // Consumer Discretionary
    'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM',
    'ABNB','SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','QSR',
    'AAL','DAL','UAL','LUV','CCL','RCL','EA','TTWO','U','RIVN','LCID',
    'AZO','BBY','BURL','CPRT','DHI','DRI','EXPE','GPC','GRMN','HAS',
    'HLT','KMX','LEN','LVS','MGM','MHK','NVR','ORLY','PHM','POOL',
    'RL','TSCO','TPR','ULTA','VFC','WHR','WYNN','APTV','BWA','DG',
    'DLTR','DDS','FIVE','FL','FOXA','FOX','GPS','GT','HBI','LAD',
    'LKQ','M','NCLH','NWL','PVH',
    // Consumer Staples
    'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS',
    'KHC','STZ','ADM','BF-B','CAG','CHD','CLX','CPB','EL','HSY','K',
    'KDP','KR','KVUE','MKC','MNST','SJM','SYY','TAP','TSN','WBA',
    'BGS','BG','COKE','FLO','HRL','LANC','POST',
    // Energy
    'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN',
    'HES','BKR','APA','CTRA','FANG','KMI','LNG','MRO','NOV','OKE',
    'TRGP','WMB','EQT','AR','CLR','CNX','CQP','EXE','FTI','HP','MTDR',
    'NBL','OVV','PBF','PR','RIG','SM','VAL','XEC',
    // Industrials
    'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD','NOC',
    'FDX','CSX','HWM','TDG','HEI','LHX','TXT','AOS','CARR','CHRW','CMI',
    'DOV','EMR','ETN','EXPD','FAST','FTV','GNRC','GWW','IEX','IR','ITW',
    'J','JBHT','JCI','LDOS','MAS','NSC','ODFL','OTIS','PCAR','PH','PWR',
    'ROK','ROL','RSG','SNA','SWK','TT','URI','VRSK','WAB','WM','XYL',
    'ALK','JBLU','SAVE',
    // Communication Services & Media
    'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA',
    'NWS','OMC','PARA','WBD','IPG','DISH',
    // Real Estate & REITs
    'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE',
    'DLR','EQR','ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC',
    'SLG','UDR','VTR','WELL','WY','INVH','PEAK','VNO',
    // Materials & Chemicals
    'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB',
    'EMN','SQM','AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS',
    'NUE','PKG','PPG','SEE','STLD','SW','VMC','AVY','AA','MP','RS',
    // Utilities
    'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS',
    'CNP','DTE','ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG',
    'PCG','PEG','PNW','PPL','VST','WEC','XEL','CEG',
    // Chinese ADRs
    'BABA','JD','PDD','BIDU','NIO','XPEV','LI',
    // Indices
    '^GSPC','^DJI','^IXIC','^RUT','^VIX','^FTSE','^GDAXI','^FCHI',
    '^IBEX','^AEX','^SSMI','^OMXS30','^BFX','^N225','^HSI','000001.SS',
    '^STI','^BSESN','^NSEI','^KS11','^TWII','^JKSE','^AXJO','^GSPTSE',
    '^MXX','^BVSP','^MERV',
    // Commodities
    'GC=F','SI=F','PL=F','PA=F','CL=F','BZ=F','NG=F','RB=F','HO=F',
    'HG=F','ALI=F','ZC=F','ZW=F','ZS=F','KC=F','SB=F','CT=F','CC=F','LBS=F',
    // Bonds
    '^TNX','^TYX','^FVX','^IRX','ZN=F','ZB=F','ZT=F','ZF=F',
    // Crypto
    'BTC-USD','ETH-USD','BNB-USD','SOL-USD','ADA-USD','XRP-USD',
    'DOGE-USD','AVAX-USD','DOT-USD','MATIC-USD','LINK-USD','UNI-USD',
    'LTC-USD','BCH-USD','ATOM-USD',
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

  const fld = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const toggleFunc = (fn) => setForm(f => ({
    ...f,
    allowed_functions: f.allowed_functions.includes(fn)
      ? f.allowed_functions.filter(x => x !== fn)
      : [...f.allowed_functions, fn],
  }));
  const addAsset = (a) => { setForm(f => ({ ...f, assets: [...f.assets, a] })); setAssetSearch(''); setAssetDropdown(false); };
  const removeAsset = (a) => setForm(f => ({ ...f, assets: f.assets.filter(x => x !== a) }));

  const ALL_ASSETS_FULL = [
    'EURUSD=X','GBPUSD=X','USDJPY=X','AUDUSD=X','USDCAD=X','USDCHF=X','NZDUSD=X','EURGBP=X','EURJPY=X','GBPJPY=X','AUDJPY=X','EURCHF=X',
    'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC','ORCL','CSCO','ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC','SNPS','CDNS','MRVL','NXPI','MU','ADI','MPWR','SWKS','QRVO','ON','IBM','AAOI','ACLS','ACN','ADSK','AKAM','ANSS','APH','ANET','ASML','AVAV','KEYS','MCHP','MTSI','MSI','MDB','NTAP','NTNX','PAYC','PTC','ROP','SAP','SLAB','STX','TER','TSM','TYL','UMC','VRSN','WDC','XLNX','ZBRA',
    'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR','TEAM','FTNT','OKTA','S','CYBR',
    'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER','LYFT','DASH','PINS','SNAP','SPOT','ROKU','Z','ZG','AFRM','COIN','HOOD','SOFI','RBLX','ASTS',
    'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME','ICE','MCO','BK','USB','PNC','TFC','COF','AFL','AMG','AON','AJG','AMP','BEN','CBOE','CINF','DFS','ERIE','FITB','FRC','GL','HBAN','HIG','IVZ','JKHY','KEY','L','LNC','MTB','NTRS','NDAQ','PFG','RF','RJF','SIVB','STT','SYF','TROW','WRB','ZION','CFG','CMA','FHN','EWBC','WAL','WBS','ALLY',
    'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
    'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY','AMGN','GILD','CVS','CI','ELV','HUM','VRTX','REGN','ISRG','BIIB','MRNA','BNTX','SGEN','ALNY','BGNE','MCK','CAH','COR','IDXX','A','WAT','ALGN','ATRC','BAX','BDX','BIO','BSX','CERN','DXCM','EW','EXAS','HOLX','HSIC','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PKI','PODD','RMD','STE','SYK','TFX','UHS','WST','XRAY','ZBH','ZTS','TDOC','DOCS','VEEV','HALO','NVAX','IONS','UTHR',
    'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM','ABNB','SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','QSR','AAL','DAL','UAL','LUV','CCL','RCL','EA','TTWO','U','RIVN','LCID','AZO','BBY','BURL','CPRT','DHI','DRI','EXPE','GPC','GRMN','HAS','HLT','KMX','LEN','LVS','MGM','MHK','NVR','ORLY','PHM','POOL','RL','TSCO','TPR','ULTA','VFC','WHR','WYNN','APTV','BWA','DG','DLTR','DDS','FIVE','FL','FOXA','FOX','GPS','GT','HBI','LAD','LKQ','M','NCLH','NWL','PVH',
    'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS','KHC','STZ','ADM','BF-B','CAG','CHD','CLX','CPB','EL','HSY','K','KDP','KR','KVUE','MKC','MNST','SJM','SYY','TAP','TSN','WBA','BGS','BG','COKE','FLO','HRL','LANC','POST',
    'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN','HES','BKR','APA','CTRA','FANG','KMI','LNG','MRO','NOV','OKE','TRGP','WMB','EQT','AR','CLR','CNX','CQP','EXE','FTI','HP','MTDR','NBL','OVV','PBF','PR','RIG','SM','VAL','XEC',
    'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD','NOC','FDX','CSX','HWM','TDG','HEI','LHX','TXT','AOS','CARR','CHRW','CMI','DOV','EMR','ETN','EXPD','FAST','FTV','GNRC','GWW','IEX','IR','ITW','J','JBHT','JCI','LDOS','MAS','NSC','ODFL','OTIS','PCAR','PH','PWR','ROK','ROL','RSG','SNA','SWK','TT','URI','VRSK','WAB','WM','XYL','ALK','JBLU','SAVE',
    'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA','NWS','OMC','PARA','WBD','IPG','DISH',
    'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE','DLR','EQR','ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC','SLG','UDR','VTR','WELL','WY','INVH','PEAK','VNO',
    'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB','EMN','SQM','AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS','NUE','PKG','PPG','SEE','STLD','SW','VMC','AVY','AA','MP','RS',
    'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS','CNP','DTE','ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG','PCG','PEG','PNW','PPL','VST','WEC','XEL','CEG',
    'BABA','JD','PDD','BIDU','NIO','XPEV','LI',
    '^GSPC','^DJI','^IXIC','^RUT','^VIX','^FTSE','^GDAXI','^FCHI','^IBEX','^AEX','^SSMI','^OMXS30','^BFX','^N225','^HSI','000001.SS','^STI','^BSESN','^NSEI','^KS11','^TWII','^JKSE','^AXJO','^GSPTSE','^MXX','^BVSP','^MERV',
    'GC=F','SI=F','PL=F','PA=F','CL=F','BZ=F','NG=F','RB=F','HO=F','HG=F','ALI=F','ZC=F','ZW=F','ZS=F','KC=F','SB=F','CT=F','CC=F','LBS=F',
    '^TNX','^TYX','^FVX','^IRX','ZN=F','ZB=F','ZT=F','ZF=F',
    'BTC-USD','ETH-USD','BNB-USD','SOL-USD','ADA-USD','XRP-USD','DOGE-USD','AVAX-USD','DOT-USD','MATIC-USD','LINK-USD','UNI-USD','LTC-USD','BCH-USD','ATOM-USD',
  ];

  const filtered = ALL_ASSETS_FULL.filter(a =>
    a.toLowerCase().includes(assetSearch.toLowerCase()) && !form.assets.includes(a)
  );

  return (
    <div className="snw-overlay-backdrop" onClick={onClose}>
      <div className="snw-overlay-panel" onClick={e => e.stopPropagation()}>
        <div className="snw-overlay-header">
          <span className="snw-overlay-title">New GA Model</span>
          <button className="snw-overlay-close" onClick={onClose}>×</button>
        </div>
        <div className="snw-overlay-body">

          {/* Name */}
          <div className="snw-section-gap">
            <div className="snw-section-label">Identification</div>
            <div className="snw-field" style={{gridColumn:'1/-1'}}>
              <label className="snw-label">Model name</label>
              <input className="snw-input" value={form.name}
                onChange={e => fld('name', e.target.value)}
                placeholder="e.g. Uptrend Retracement Alpha" />
            </div>
          </div>

          {/* Assets */}
          <div className="snw-section-gap">
            <div className="snw-section-label">Assets</div>
            <div style={{position:'relative'}}>
              <input className="snw-input" placeholder="Search tickers…"
                value={assetSearch}
                onChange={e => { setAssetSearch(e.target.value); setAssetDropdown(true); }}
                onFocus={() => setAssetDropdown(true)}
              />
              {assetDropdown && filtered.length > 0 && (
                <div className="snw-asset-dropdown">
                  {filtered.slice(0, 25).map(a => (
                    <div key={a} className="snw-asset-opt" onClick={() => addAsset(a)}>{a}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="snw-asset-tags">
              {form.assets.map(a => (
                <span key={a} className="snw-asset-tag" onClick={() => removeAsset(a)}>{a} ×</span>
              ))}
              {form.assets.length === 0 &&
                <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-muted)'}}>
                  No assets selected
                </span>
              }
            </div>
          </div>

          {/* Parameters */}
          <div className="snw-section-gap">
            <div className="snw-section-label">Parameters</div>
            <div className="snw-field-grid">
              {[
                {key:'timeframe',       label:'Timeframe',       type:'select', opts:['1m','5m','15m','1h','4h','1d','1wk']},
                {key:'start_year',      label:'Start year',      type:'number'},
                {key:'end_year',        label:'End year',        type:'number'},
                {key:'initial_capital', label:'Capital ($)',     type:'number'},
                {key:'take_profit',     label:'Take profit (%)', type:'number', step:0.1},
                {key:'stop_loss',       label:'Stop loss (%)',   type:'number', step:0.1},
              ].map(({key, label, type, opts, step}) => (
                <div key={key} className="snw-field">
                  <label className="snw-label">{label}</label>
                  {type === 'select' ? (
                    <select className="snw-select" value={form[key]} onChange={e => fld(key, e.target.value)}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input className="snw-input" type="number" step={step||1}
                      value={form[key]} onChange={e => fld(key, parseFloat(e.target.value)||0)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GA / RL */}
          <div className="snw-section-gap">
            <div className="snw-section-label">GA / RL Hyper-parameters</div>
            <div className="snw-field-grid">
              {[
                {key:'population_size', label:'Population'},
                {key:'max_generations', label:'Generations'},
                {key:'mutation_rate',   label:'Mutation rate', step:0.01},
                {key:'elite_fraction',  label:'Elite fraction', step:0.05},
                {key:'rl_learning_rate',label:'RL learning rate', step:0.001},
              ].map(({key, label, step}) => (
                <div key={key} className="snw-field">
                  <label className="snw-label">{label}</label>
                  <input className="snw-input" type="number" step={step||1}
                    value={form[key]} onChange={e => fld(key, parseFloat(e.target.value)||0)} />
                </div>
              ))}
              <div className="snw-field">
                <label className="snw-label">RL enabled</label>
                <select className="snw-select" value={form.rl_enabled ? 'yes' : 'no'}
                  onChange={e => fld('rl_enabled', e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Functions — grouped by category */}
          <div className="snw-section-gap">
            <div className="snw-section-label">
              Function pool — {form.allowed_functions.length} selected
              <button className="snw-btn snw-btn-ghost snw-btn-sm"
                style={{marginLeft:12}}
                onClick={() => setForm(f => ({...f, allowed_functions: ALL_FUNCTIONS}))}>
                Select all
              </button>
              <button className="snw-btn snw-btn-ghost snw-btn-sm"
                style={{marginLeft:6}}
                onClick={() => setForm(f => ({...f, allowed_functions: []}))}>
                Clear
              </button>
            </div>
            {FUNCTION_CATEGORIES.map(cat => (
              <div key={cat.label} className="snw-func-category">
                <div className="snw-func-category-label">{cat.label}</div>
                <div className="snw-func-grid">
                  {cat.fns.map(fn => (
                    <div key={fn}
                      className={`snw-func-chip ${form.allowed_functions.includes(fn) ? 'snw-func-on' : ''}`}
                      onClick={() => toggleFunc(fn)}>
                      <span className="snw-func-dot"/>
                      {fn}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {dupWarning && <div className="snw-dup-warn">{dupWarning}</div>}

          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button className="snw-btn snw-btn-ghost" onClick={onClose}>Cancel</button>
            <button className="snw-btn snw-btn-primary"
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
  const [model,       setModel]       = useState(initialModel);
  const [tab,         setTab]         = useState('overview');
  const [logs,        setLogs]        = useState([]);
  const [logOffset,   setLogOffset]   = useState(0);
  const [chartStyle,  setChartStyle]  = useState('dark');
  const [chartType,   setChartType]   = useState('candlestick');
  const [chartAsset,  setChartAsset]  = useState(initialModel.assets?.[0] || '');
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
    let offset = 0;
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`${BASE_URL}/api/snowai/models/${id}/status/?last_log=${offset}`);
        const d = await r.json();
        setModel(m => ({ ...m, status: d.status, progress: d.progress, current_generation: d.generation }));
        if (d.logs?.length) {
          setLogs(l => [...l, ...d.logs]);
          offset += d.logs.length;
          setLogOffset(offset);
        }
        if (d.status === 'completed' || d.status === 'failed') {
          clearInterval(pollRef.current);
          fetch(`${BASE_URL}/api/snowai/models/${id}/`).then(r=>r.json()).then(d=>setModel(d.model));
        }
      } catch (_) {}
    }, 1500);
  };

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const loadChromosomes = async () => {
    try {
      const r = await fetch(`${BASE_URL}/api/snowai/models/${model.id}/chromosomes/`);
      const d = await r.json();
      setChromosomes(d.chromosomes || []);
    } catch (_) {}
  };

  useEffect(() => { if (tab === 'chromosomes') loadChromosomes(); }, [tab]);

  const handleStart = async () => {
    await fetch(`${BASE_URL}/api/snowai/models/${model.id}/start/`, { method: 'POST' });
    setModel(m => ({ ...m, status: 'running', progress: 0 }));
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

  const logCls = (l) => {
    if (l.startsWith('🏆') || l.startsWith('✓') || l.startsWith('🎉') || l.startsWith('✅')) return 'snw-log-good';
    if (l.startsWith('❌') || l.startsWith('✗')) return 'snw-log-bad';
    if (l.startsWith('🔬') || l.startsWith('🧬') || l.startsWith('📡')) return 'snw-log-head';
    return 'snw-log-plain';
  };

  return (
    <div>
      {/* Model header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18,gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:17,fontWeight:500,color:'var(--snw-text)',marginBottom:5}}>
            {model.name}
          </div>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--snw-text-dim)',display:'flex',gap:12,flexWrap:'wrap'}}>
            <span>
              <span className={`snw-dot ${STATUS_DOTS[model.status]||'snw-dot-pending'}`}/>
              {model.status}
            </span>
            <span>{model.timeframe}</span>
            <span>{model.start_year}–{model.end_year}</span>
            <span>gen {model.current_generation}/{model.max_generations}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
          {(model.status==='pending'||model.status==='failed'||model.status==='completed') && (
            <button className="snw-btn snw-btn-primary snw-btn-sm" onClick={handleStart}>▶ Run</button>
          )}
          {model.status==='running' && (
            <button className="snw-btn snw-btn-ghost snw-btn-sm" onClick={handlePause}>⏸ Pause</button>
          )}
          {model.status==='paused' && (
            <button className="snw-btn snw-btn-primary snw-btn-sm" onClick={handleResume}>▶ Resume</button>
          )}
          <button className="snw-btn snw-btn-danger snw-btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Progress */}
      {(model.status==='running'||model.status==='paused') && (
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-dim)',marginBottom:4}}>
            {model.progress}% · generation {model.current_generation}/{model.max_generations}
          </div>
          <div className="snw-progress-bar">
            <div className="snw-progress-fill" style={{width:`${model.progress}%`}}/>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="snw-tabs">
        {['overview','chart','chromosomes','logs'].map(t => (
          <button key={t} className={`snw-tab ${tab===t?'snw-tab-active':''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab==='overview' && (
        <>
          <div className="snw-panel">
            <div className="snw-panel-header"><span className="snw-panel-title">Configuration</span></div>
            <div className="snw-panel-body">
              <div className="snw-metrics">
                {[
                  {l:'Assets',     v: model.assets?.slice(0,4).join(', ') + (model.assets?.length>4?` +${model.assets.length-4}`:'')},
                  {l:'Timeframe',  v: model.timeframe},
                  {l:'Period',     v: `${model.start_year}–${model.end_year}`},
                  {l:'Capital',    v: `$${model.initial_capital?.toLocaleString()}`},
                  {l:'TP / SL',    v: `${model.take_profit}% / ${model.stop_loss}%`},
                  {l:'Population', v: model.population_size},
                  {l:'Generations',v: model.max_generations},
                  {l:'Mutation',   v: model.mutation_rate},
                  {l:'RL',         v: model.rl_enabled?'enabled':'off'},
                ].map(({l,v}) => (
                  <div key={l} className="snw-metric">
                    <div className="snw-metric-label">{l}</div>
                    <div className="snw-metric-val snw-val-plain" style={{fontSize:12,wordBreak:'break-word'}}>{v??'—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {bc ? (
            <div className="snw-panel">
              <div className="snw-panel-header">
                <span className="snw-panel-title">Best Strategy Found</span>
                <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-dim)'}}>gen {bc.generation}</span>
              </div>
              <div className="snw-panel-body">
                <div className="snw-tags" style={{marginBottom:14}}>
                  {bc.functions?.map(fn => <span key={fn} className="snw-tag">{fn}</span>)}
                </div>
                <div className="snw-metrics">
                  {[
                    {l:'Fitness',    v:fmtNum(bc.fitness),                    cls:'snw-val-blue'},
                    {l:'Win rate',   v:fmtPct(bc.win_rate),                   cls:bc.win_rate>=50?'snw-val-green':'snw-val-red'},
                    {l:'Trades',     v:bc.total_trades,                       cls:'snw-val-plain'},
                    {l:'PnL',        v:`$${fmtNum(bc.total_pnl)}`,            cls:bc.total_pnl>=0?'snw-val-green':'snw-val-red'},
                    {l:'Sharpe',     v:fmtNum(bc.sharpe_ratio),               cls:'snw-val-plain'},
                    {l:'Max DD',     v:fmtPct(bc.max_drawdown),               cls:'snw-val-red'},
                  ].map(({l,v,cls}) => (
                    <div key={l} className="snw-metric">
                      <div className="snw-metric-label">{l}</div>
                      <div className={`snw-metric-val ${cls}`}>{v}</div>
                    </div>
                  ))}
                </div>
                {bc.market_snapshot && (
                  <div style={{marginTop:16}}>
                    <div className="snw-section-label" style={{marginBottom:8}}>Market Condition Snapshot</div>
                    <img className="snw-snapshot" src={`data:image/png;base64,${bc.market_snapshot}`} alt="market snapshot"/>
                    <div className="snw-snapshot-cap">
                      Regime heatmap at evaluation ·
                      {bc.market_snapshot_meta?.is_uptrend ? ' uptrend' : ' non-uptrend'} ·
                      ATR {bc.market_snapshot_meta?.atr?.toFixed?.(5)} ·
                      RSI {bc.market_snapshot_meta?.rsi?.toFixed?.(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="snw-panel">
              <div className="snw-panel-body">
                <div className="snw-empty">
                  <span className="snw-empty-icon">⬡</span>
                  <span>No strategy evolved yet. Run the model to start.</span>
                </div>
              </div>
            </div>
          )}

          {fh.length > 1 && (
            <div className="snw-panel">
              <div className="snw-panel-header"><span className="snw-panel-title">Fitness History</span></div>
              <div className="snw-panel-body">
                <Sparkline data={fh}/>
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-muted)',marginTop:6}}>
                  best fitness per generation · {fh.length} recorded
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Chart ── */}
      {tab==='chart' && (
        <div className="snw-chart-wrap">
          <div className="snw-chart-controls">
            <select className="snw-chart-asset-sel" value={chartAsset}
              onChange={e => setChartAsset(e.target.value)}>
              {(model.assets||[]).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div style={{display:'flex',gap:4}}>
              {['candlestick','line','area'].map(t => (
                <button key={t} className={`snw-chart-btn ${chartType===t?'snw-chart-btn-active':''}`}
                  onClick={() => setChartType(t)}>{t}</button>
              ))}
            </div>
            <div style={{display:'flex',gap:4,marginLeft:'auto'}}>
              {['dark','light','hud'].map(s => (
                <button key={s} className={`snw-chart-btn ${chartStyle===s?'snw-chart-btn-active':''}`}
                  onClick={() => setChartStyle(s)}>{s}</button>
              ))}
            </div>
          </div>
          {window.LightweightCharts ? (
            <TVChart modelId={model.id} asset={chartAsset} chartStyle={chartStyle} chartType={chartType}/>
          ) : (
            <div className="snw-empty" style={{height:400}}>
              <span className="snw-empty-icon">📈</span>
              <span>TradingView Lightweight Charts not loaded.</span>
            </div>
          )}
        </div>
      )}

      {/* ── Chromosomes ── */}
      {tab==='chromosomes' && (
        <div>
          {chromosomes.length === 0 ? (
            <div className="snw-panel">
              <div className="snw-panel-body">
                <div className="snw-empty"><span className="snw-empty-icon">⬡</span><span>No chromosomes yet.</span></div>
              </div>
            </div>
          ) : chromosomes.map(c => (
            <div key={c.id} className="snw-panel" style={{marginBottom:10}}>
              <div className="snw-panel-header">
                <div className="snw-tags">
                  {c.functions?.map(fn => <span key={fn} className="snw-tag">{fn}</span>)}
                </div>
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-dim)',display:'flex',gap:10}}>
                  {c.is_elite && <span style={{color:'var(--snw-yellow)'}}>★ elite</span>}
                  <span>gen {c.generation}</span>
                </div>
              </div>
              <div className="snw-panel-body" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'start'}}>
                <div className="snw-metrics">
                  {[
                    {l:'Fitness',  v:fmtNum(c.fitness),              cls:'snw-val-blue'},
                    {l:'Win rate', v:fmtPct(c.win_rate),             cls:c.win_rate>=50?'snw-val-green':'snw-val-red'},
                    {l:'Trades',   v:c.total_trades,                 cls:'snw-val-plain'},
                    {l:'PnL',      v:`$${fmtNum(c.total_pnl)}`,      cls:c.total_pnl>=0?'snw-val-green':'snw-val-red'},
                    {l:'Sharpe',   v:fmtNum(c.sharpe_ratio),         cls:'snw-val-plain'},
                    {l:'Max DD',   v:fmtPct(c.max_drawdown),         cls:'snw-val-red'},
                  ].map(({l,v,cls}) => (
                    <div key={l} className="snw-metric">
                      <div className="snw-metric-label">{l}</div>
                      <div className={`snw-metric-val ${cls}`} style={{fontSize:14}}>{v}</div>
                    </div>
                  ))}
                </div>
                {c.market_snapshot && (
                  <div style={{width:160,flexShrink:0}}>
                    <img className="snw-snapshot" src={`data:image/png;base64,${c.market_snapshot}`} alt="snapshot"/>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Logs ── */}
      {tab==='logs' && (
        <div>
          <div className="snw-terminal">
            {logs.length === 0
              ? <span className="snw-log-plain">No logs yet. Start the model to see output.</span>
              : logs.map((l, i) => (
                  <div key={i} className={logCls(l)}>{l}</div>
                ))
            }
            <div ref={logsEndRef}/>
          </div>
          <div style={{marginTop:8,fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-muted)'}}>
            {logs.length} lines · auto-scrolling
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function SnowAISandbox() {
  const [models,       setModels]       = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTf,     setFilterTf]     = useState('');
  const [toast,        setToast]        = useState(null);
  const [darkMode,     setDarkMode]     = useState(true);

  const theme = darkMode ? 'dark' : 'light';

  const showToast = (msg, type='ok') => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const loadModels = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search)       params.set('q',        search);
      if (filterStatus) params.set('status',   filterStatus);
      if (filterTf)     params.set('timeframe',filterTf);
      const r = await fetch(`${BASE_URL}/api/snowai/models/?${params}`);
      const d = await r.json();
      setModels(d.models || []);
    } catch (_) {}
  }, [search, filterStatus, filterTf]);

  useEffect(() => { loadModels(); }, [loadModels]);

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
    showToast('Model deleted.');
  };

  const selectModel = async (m) => {
    try {
      const r = await fetch(`${BASE_URL}/api/snowai/models/${m.id}/`);
      const d = await r.json();
      setSelected(d.model || m);
    } catch (_) { setSelected(m); }
  };

  return (
    <div>
      <style>{styles}</style>
      <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"/>

      <Header />
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="snw-wrap" data-snw-theme={theme}>

            {/* Topbar */}
            <div className="snw-topbar">
              <div className="snw-topbar-left">
                <span className="snw-logo-mark">❄ SnowAI Sandbox</span>
                <span className="snw-logo-sub">GA · RL · Strategy Discovery</span>
              </div>
              {/* Theme toggle */}
              <div className="snw-theme-toggle" onClick={() => setDarkMode(d => !d)}>
                <span className={`snw-theme-pill ${darkMode?'on':''}`}/>
                {darkMode ? '🌙 Dark' : '☀ Light'}
              </div>
            </div>

            {/* Body */}
            <div className="snw-body">

              {/* Sidebar */}
              <div className="snw-sidebar">
                <div className="snw-sidebar-search">
                  <input placeholder="Search models…"
                    value={search} onChange={e => setSearch(e.target.value)}/>
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

                <button className="snw-new-btn" onClick={() => setShowCreate(true)}>
                  + New Model
                </button>

                {models.length === 0 ? (
                  <div className="snw-empty" style={{padding:'40px 16px'}}>
                    <span className="snw-empty-icon">⬡</span>
                    <span>No models found.</span>
                    <span style={{color:'var(--snw-text-muted)',fontSize:10}}>Create one to get started.</span>
                  </div>
                ) : models.map(m => (
                  <div key={m.id}
                    className={`snw-model-item ${selected?.id===m.id?'snw-selected':''}`}
                    onClick={() => selectModel(m)}>
                    <div className="snw-model-name">
                      <span className={`snw-dot ${STATUS_DOTS[m.status]||'snw-dot-pending'}`}/>
                      {m.name}
                    </div>
                    <div className="snw-model-meta">
                      <span>{m.assets?.slice(0,3).join(',')} {m.assets?.length>3?`+${m.assets.length-3}`:''}</span>
                      <span>{m.timeframe}</span>
                      {m.status==='running' && (
                        <span style={{color:'var(--snw-accent)'}}>gen {m.current_generation}</span>
                      )}
                      {m.best_chromosome && (
                        <span style={{color: m.best_chromosome.win_rate>=50?'var(--snw-green)':'var(--snw-red)'}}>
                          wr {fmtPct(m.best_chromosome.win_rate)}
                        </span>
                      )}
                    </div>
                    {m.status==='running' && (
                      <div className="snw-progress-bar" style={{marginTop:6}}>
                        <div className="snw-progress-fill" style={{width:`${m.progress||0}%`}}/>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="snw-main">
                {selected ? (
                  <ModelDetail key={selected.id} model={selected} onDelete={handleDelete}/>
                ) : (
                  <div className="snw-empty" style={{height:'100%',minHeight:400}}>
                    <span className="snw-empty-icon">⬡</span>
                    <span>Select a model from the sidebar</span>
                    <span style={{color:'var(--snw-text-muted)',fontSize:10}}>or create a new one to begin.</span>
                    <button className="snw-btn snw-btn-primary" style={{marginTop:14}}
                      onClick={() => setShowCreate(true)}>+ New Model</button>
                  </div>
                )}
              </div>
            </div>

            {/* Create overlay */}
            {showCreate && (
              <CreateModelOverlay
                onClose={() => setShowCreate(false)}
                onCreate={handleCreate}/>
            )}

            {/* Toast */}
            {toast && (
              <div className={`snw-toast snw-${toast.type}`}>{toast.msg}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}