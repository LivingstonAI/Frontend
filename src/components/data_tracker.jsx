import React, { useEffect, useState, useCallback, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const BASE_URL = "https://backend-production-c0ab.up.railway.app";

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --snw-ice:       #EAF4FB;
    --snw-sky:       #B8DCF0;
    --snw-blue:      #3A9FD5;
    --snw-deep:      #1A5E8A;
    --snw-navy:      #0D2D45;
    --snw-white:     #FFFFFF;
    --snw-offwhite:  #F5FAFE;
    --snw-muted:     #7BA9C4;
    --snw-border:    #CBE4F2;
    --snw-stable:    #1BA86D;
    --snw-choppy:    #E89C2A;
    --snw-volatile:  #D63B3B;
    --snw-bullish:   #1BA86D;
    --snw-bearish:   #D63B3B;
    --snw-neutral:   #7BA9C4;
    --snw-shadow:    0 2px 16px rgba(26,94,138,0.10);
    --snw-shadow-lg: 0 8px 40px rgba(26,94,138,0.14);
    --snw-radius:    12px;
    --snw-radius-sm: 7px;
    --snw-font-head: 'Syne', sans-serif;
    --snw-font-mono: 'DM Mono', monospace;

    /* Page-level theme tokens */
    --snw-bg-primary: #F5FAFE;
    --snw-bg-secondary: #FFFFFF;
    --snw-text-primary: #0D2D45;
    --snw-text-secondary: #7BA9C4;
    --snw-border-color: #CBE4F2;
    --snw-card-bg: #FFFFFF;
  }

  /* ── Page root ── */
  .snw-root {
    min-height: 100vh;
    background: var(--snw-bg-primary);
    font-family: var(--snw-font-mono);
    color: var(--snw-text-primary);
  }

  /* ── Top nav ── */
  .snw-topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--snw-bg-secondary);
    border-bottom: 1.5px solid var(--snw-border-color);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 28px;
    height: 52px;
    box-shadow: var(--snw-shadow);
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .snw-topnav-brand {
    font-family: var(--snw-font-head);
    font-size: 15px;
    font-weight: 800;
    color: var(--snw-text-primary);
    letter-spacing: -0.02em;
    margin-right: 24px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .snw-topnav-brand-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--snw-blue);
  }
  /* Only animate the brand dot, never status cards */
  @keyframes snw-dot-pulse {
    0%,100%{ opacity:1; transform:scale(1); }
    50%{ opacity:.4; transform:scale(1.5); }
  }
  .snw-topnav-brand-dot { animation: snw-dot-pulse 2s ease-in-out infinite; }

  .snw-topnav-links {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 1;
    overflow-x: auto;
  }
  .snw-nav-link {
    padding: 6px 14px;
    font-family: var(--snw-font-mono);
    font-size: 12px;
    color: var(--snw-text-secondary);
    background: none;
    border: none;
    border-radius: var(--snw-radius-sm);
    cursor: pointer;
    white-space: nowrap;
    transition: all .18s;
    font-weight: 500;
  }
  .snw-nav-link:hover { background: var(--snw-ice); color: var(--snw-text-primary); }
  .snw-nav-link.snw-active { background: var(--snw-ice); color: var(--snw-text-primary); font-weight: 600; }

  /* ── Body ── */
  .snw-body {
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px 24px 48px;
  }

  /* ── Page header ── */
  .snw-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .snw-page-title {
    font-family: var(--snw-font-head);
    font-size: 26px;
    font-weight: 800;
    color: var(--snw-text-primary);
    letter-spacing: -0.03em;
  }
  .snw-page-subtitle {
    font-size: 12px;
    color: var(--snw-text-secondary);
    margin-top: 4px;
  }

  /* ── Status panel ── */
  .snw-status-panel {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .snw-status-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: var(--snw-deep);
    color: white;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
  }
  .snw-status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    padding: 16px;
  }
  .snw-period-card {
    background: var(--snw-ice);
    border-radius: var(--snw-radius-sm);
    padding: 12px;
    border-left: 4px solid var(--snw-muted);
  }
  .snw-period-card-running  { border-left-color: var(--snw-blue); }
  .snw-period-card-completed { border-left-color: var(--snw-stable); }
  .snw-period-card-failed   { border-left-color: var(--snw-volatile); }
  .snw-period-title {
    font-family: var(--snw-font-head);
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 6px;
    color: var(--snw-text-primary);
  }
  .snw-period-badge {
    font-size: 10px;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    margin-bottom: 8px;
    font-weight: 600;
  }
  .snw-badge-pending   { background: var(--snw-border); color: var(--snw-text-secondary); }
  .snw-badge-running   { background: var(--snw-blue); color: white; }
  .snw-badge-completed { background: var(--snw-stable); color: white; }
  .snw-badge-failed    { background: var(--snw-volatile); color: white; }
  .snw-period-info { font-size: 10px; color: var(--snw-text-secondary); margin-top: 6px; line-height: 1.5; }
  .snw-period-current { font-size: 9px; font-family: var(--snw-font-mono); color: var(--snw-text-primary); margin-top: 6px; word-break: break-all; }

  .snw-run-btn {
    margin-top: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    background: var(--snw-deep);
    color: white;
    border: none;
    border-radius: var(--snw-radius-sm);
    cursor: pointer;
    width: 100%;
    transition: opacity 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: var(--snw-font-mono);
  }
  .snw-run-btn:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
  .snw-run-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  @keyframes snw-spin { to { transform: rotate(360deg); } }
  .snw-spinner-sm {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: snw-spin 0.6s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  .snw-spinner-lg {
    width: 32px; height: 32px;
    border: 3px solid var(--snw-border-color);
    border-top-color: var(--snw-blue);
    border-radius: 50%;
    animation: snw-spin .7s linear infinite;
  }

  /* ── Quick bar ── */
  .snw-quick-bar {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    margin-bottom: 22px;
    padding: 14px 18px;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }
  .snw-quick-group { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 110px; }
  .snw-quick-label { font-size: 10px; color: var(--snw-text-secondary); text-transform: uppercase; font-weight: 500; letter-spacing: 0.05em; }
  .snw-quick-input, .snw-quick-select {
    padding: 7px 11px;
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius-sm);
    font-family: var(--snw-font-mono);
    font-size: 12px;
    background: var(--snw-bg-primary);
    color: var(--snw-text-primary);
    width: 100%;
  }
  .snw-quick-input:focus, .snw-quick-select:focus { outline: none; border-color: var(--snw-blue); }
  .snw-divider { width: 1px; height: 36px; background: var(--snw-border-color); align-self: flex-end; }

  /* ── Buttons ── */
  .snw-btn {
    padding: 8px 18px;
    border-radius: var(--snw-radius-sm);
    font-family: var(--snw-font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all .18s;
    white-space: nowrap;
  }
  .snw-btn-primary { background: var(--snw-deep); color: white; }
  .snw-btn-primary:hover:not(:disabled) { opacity: 0.8; }
  .snw-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .snw-btn-secondary { background: var(--snw-ice); color: var(--snw-text-primary); border: 1.5px solid var(--snw-border-color); }
  .snw-btn-secondary:hover { background: var(--snw-sky); }
  .snw-btn-sm { padding: 6px 14px; font-size: 11px; }

  /* ── Advanced filters ── */
  .snw-filters-panel {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    margin-bottom: 22px;
    overflow: hidden;
  }
  .snw-filters-hdr {
    padding: 14px 18px;
    background: var(--snw-ice);
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    user-select: none;
  }
  .snw-filters-grid {
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    border-top: 1px solid var(--snw-border-color);
    max-height: 500px;
    overflow-y: auto;
  }
  .snw-filter-item { display: flex; flex-direction: column; gap: 5px; }
  .snw-filter-item label { font-size: 10px; color: var(--snw-text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
  .snw-filter-input, .snw-filter-select {
    padding: 7px 10px;
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius-sm);
    font-family: var(--snw-font-mono);
    font-size: 11px;
    background: var(--snw-bg-primary);
    color: var(--snw-text-primary);
  }
  .snw-range-grp { display: flex; gap: 8px; align-items: center; }
  .snw-range-grp input {
    flex: 1; padding: 7px 10px; border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius-sm); background: var(--snw-bg-primary);
    color: var(--snw-text-primary); font-family: var(--snw-font-mono); font-size: 11px;
  }
  .snw-range-grp span { font-size: 10px; color: var(--snw-text-secondary); white-space: nowrap; }

  /* ── Active filter tags ── */
  .snw-active-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .snw-filter-tag {
    background: var(--snw-ice);
    border: 1px solid var(--snw-border-color);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--snw-font-mono);
  }
  .snw-filter-tag-rm { background: none; border: none; cursor: pointer; color: var(--snw-text-secondary); font-size: 12px; line-height: 1; }
  .snw-filter-tag-clear { background: var(--snw-volatile); color: white; }
  .snw-filter-tag-clear .snw-filter-tag-rm { color: white; }

  /* ── Column controls ── */
  .snw-col-ctrl {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding: 10px 16px;
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    font-size: 11px;
  }
  .snw-col-dropdown { position: relative; display: inline-block; }
  .snw-col-dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--snw-card-bg);
    border: 1px solid var(--snw-border-color);
    border-radius: var(--snw-radius-sm);
    z-index: 200;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: var(--snw-shadow-lg);
  }
  .snw-col-dropdown:hover .snw-col-dropdown-content { display: block; }
  .snw-col-chk {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 11px;
    font-family: var(--snw-font-mono);
    color: var(--snw-text-primary);
  }
  .snw-col-chk:hover { background: var(--snw-ice); }

  /* ── Stats ── */
  .snw-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 14px;
    margin-bottom: 22px;
  }
  .snw-stat-card {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    padding: 16px 18px;
    box-shadow: var(--snw-shadow);
  }
  .snw-stat-label { font-size: 10px; color: var(--snw-text-secondary); text-transform: uppercase; font-weight: 500; letter-spacing: 0.05em; }
  .snw-stat-value { font-family: var(--snw-font-head); font-size: 22px; font-weight: 800; color: var(--snw-text-primary); margin-top: 4px; }
  .snw-stat-sub { font-size: 10px; color: var(--snw-text-secondary); margin-top: 2px; }

  /* ── Compare panel ── */
  .snw-compare-panel {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    margin-bottom: 22px;
    padding: 16px;
  }
  .snw-compare-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .snw-compare-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .snw-compare-tag {
    background: var(--snw-ice);
    border: 1px solid var(--snw-border-color);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--snw-font-mono);
  }
  .snw-compare-tag-rm { background: none; border: none; cursor: pointer; color: var(--snw-volatile); font-size: 14px; line-height: 1; }

  /* ── Table ── */
  .snw-table-wrap {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    overflow: hidden;
  }
  .snw-table-scroll {
    overflow-x: auto;
    max-height: 65vh;
    overflow-y: auto;
  }
  table.snw-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .snw-table thead tr {
    background: var(--snw-deep);
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .snw-table thead th {
    padding: 11px 14px;
    text-align: left;
    font-family: var(--snw-font-head);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
  }
  .snw-table thead th:hover { opacity: 0.85; }
  .snw-table tbody tr { border-bottom: 1px solid var(--snw-border-color); }
  .snw-table tbody tr:nth-child(even) { background: var(--snw-ice); }
  .snw-table tbody tr:hover { background: var(--snw-sky) !important; }
  .snw-table td { padding: 10px 14px; white-space: nowrap; color: var(--snw-text-primary); vertical-align: middle; }
  .snw-symbol-name { font-family: var(--snw-font-head); font-weight: 700; font-size: 13px; }
  .snw-symbol-btns { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
  .snw-symbol-btn {
    font-size: 9px;
    padding: 2px 7px;
    border-radius: 4px;
    cursor: pointer;
    background: var(--snw-ice);
    border: 1px solid var(--snw-border-color);
    color: var(--snw-text-primary);
    font-family: var(--snw-font-mono);
    font-weight: 600;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .snw-symbol-btn:hover { background: var(--snw-blue); color: white; border-color: var(--snw-blue); }

  /* ── Badges ── */
  .snw-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .snw-badge-stable   { background: #D6F5E8; color: #1BA86D; }
  .snw-badge-choppy   { background: #FEF0D6; color: #C07A10; }
  .snw-badge-volatile { background: #FBDEDE; color: #D63B3B; }
  .snw-badge-bullish  { background: #D6F5E8; color: #1BA86D; }
  .snw-badge-bearish  { background: #FBDEDE; color: #D63B3B; }
  .snw-badge-neutral  { background: var(--snw-ice); color: var(--snw-text-secondary); }

  /* ── MSS bar ── */
  .snw-mss-bar { display: flex; align-items: center; gap: 8px; }
  .snw-mss-track { flex: 1; height: 5px; background: var(--snw-ice); border-radius: 3px; min-width: 50px; overflow: hidden; }
  .snw-mss-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
  .snw-mss-num { font-family: var(--snw-font-head); font-weight: 700; font-size: 13px; min-width: 36px; text-align: right; }

  /* ── Pagination ── */
  .snw-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1.5px solid var(--snw-border-color);
    flex-wrap: wrap;
    gap: 8px;
  }
  .snw-pag-info { font-size: 11px; color: var(--snw-text-secondary); }
  .snw-pag-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .snw-pag-btn {
    padding: 5px 12px;
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius-sm);
    background: var(--snw-card-bg);
    color: var(--snw-text-primary);
    font-family: var(--snw-font-mono);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .snw-pag-btn.snw-pag-active { background: var(--snw-deep); color: white; border-color: var(--snw-deep); }
  .snw-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Download panel ── */
  .snw-dl-panel {
    background: var(--snw-card-bg);
    border: 1.5px solid var(--snw-border-color);
    border-radius: var(--snw-radius);
    margin-bottom: 22px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  .snw-dl-btn {
    padding: 9px 16px;
    border-radius: var(--snw-radius-sm);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid;
    transition: all .18s;
    font-family: var(--snw-font-mono);
  }
  .snw-dl-csv  { border-color: #1BA86D; color: #1BA86D; background: #D6F5E8; }
  .snw-dl-xlsx { border-color: var(--snw-blue); color: var(--snw-deep); background: var(--snw-ice); }
  .snw-dl-pdf  { border-color: #D63B3B; color: #D63B3B; background: #FBDEDE; }
  .snw-dl-json { border-color: var(--snw-text-secondary); color: var(--snw-text-secondary); background: var(--snw-ice); }

  /* ── Loading / empty ── */
  .snw-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 14px; }
  .snw-empty { text-align: center; padding: 60px 24px; color: var(--snw-text-secondary); font-size: 13px; }

  /* ═══════════════════════════════════════════════════════
     CHART MODAL — fully self-contained theming
     theme is applied via data-snw-chart-theme on the overlay
  ═══════════════════════════════════════════════════════ */
  .snw-chart-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    /* default (light) */
    --cht-bg:        #F5FAFE;
    --cht-bg2:       #FFFFFF;
    --cht-text:      #0D2D45;
    --cht-text2:     #7BA9C4;
    --cht-border:    #CBE4F2;
    --cht-ice:       #EAF4FB;
    --cht-btn-bg:    #EAF4FB;
    --cht-active-bg: #3A9FD5;
    --cht-active-fg: #FFFFFF;
    --cht-cv-bg:     #FFFFFF;   /* canvas background */
    --cht-cv-grid:   #EAF4FB;
    --cht-cv-text:   #0D2D45;
  }
  .snw-chart-overlay[data-snw-chart-theme="dark"] {
    --cht-bg:        #0f172a;
    --cht-bg2:       #1e293b;
    --cht-text:      #e2e8f0;
    --cht-text2:     #94a3b8;
    --cht-border:    #334155;
    --cht-ice:       #1e293b;
    --cht-btn-bg:    #1e293b;
    --cht-active-bg: #3A9FD5;
    --cht-active-fg: #FFFFFF;
    --cht-cv-bg:     #1e293b;
    --cht-cv-grid:   #263548;
    --cht-cv-text:   #e2e8f0;
  }
  .snw-chart-overlay[data-snw-chart-theme="hud"] {
    --cht-bg:        #000a0f;
    --cht-bg2:       rgba(0,255,255,0.06);
    --cht-text:      #00ffff;
    --cht-text2:     #00fa9a;
    --cht-border:    #00ffff;
    --cht-ice:       rgba(0,255,255,0.08);
    --cht-btn-bg:    rgba(0,255,255,0.1);
    --cht-active-bg: #00ffff;
    --cht-active-fg: #000a0f;
    --cht-cv-bg:     rgba(0,0,20,0.97);
    --cht-cv-grid:   rgba(0,255,255,0.12);
    --cht-cv-text:   #00ffff;
  }

  .snw-chart-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--cht-bg);
  }

  .snw-chart-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px;
    background: var(--cht-bg2);
    border-bottom: 1.5px solid var(--cht-border);
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
  }
  .snw-chart-title-wrap h3 { font-family: var(--snw-font-head); font-size: 17px; font-weight: 800; color: var(--cht-text); }
  .snw-chart-title-wrap small { font-size: 11px; color: var(--cht-text2); }

  .snw-chart-topbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .snw-cht-btn {
    padding: 5px 11px;
    border-radius: var(--snw-radius-sm);
    font-family: var(--snw-font-mono);
    font-size: 11px;
    cursor: pointer;
    background: var(--cht-btn-bg);
    color: var(--cht-text);
    border: 1px solid var(--cht-border);
    transition: all 0.15s;
    white-space: nowrap;
  }
  .snw-cht-btn:hover { opacity: 0.8; }
  .snw-cht-btn.snw-cht-active { background: var(--cht-active-bg); color: var(--cht-active-fg); border-color: var(--cht-active-bg); }
  .snw-cht-close {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: var(--cht-text);
    line-height: 1;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .snw-cht-close:hover { background: var(--cht-ice); }

  .snw-chart-canvas-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }
  .snw-chart-canvas-wrap > div { width: 100% !important; height: 100% !important; }

  .snw-chart-controls {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 10px 18px;
    background: var(--cht-bg2);
    border-top: 1.5px solid var(--cht-border);
    flex-shrink: 0;
    align-items: center;
  }
  .snw-chart-controls-sep {
    width: 1px;
    height: 20px;
    background: var(--cht-border);
    margin: 0 4px;
  }

  /* ── Expand row for inline chart ── */
  .snw-inline-chart-row td {
    padding: 0 !important;
    background: var(--snw-bg-primary);
  }
  .snw-inline-chart-wrap {
    width: 100%;
    border-bottom: 2px solid var(--snw-border-color);
  }

  /* ── Mobile ── */
  @media (max-width: 700px) {
    .snw-body { padding: 14px 10px 32px; }
    .snw-page-title { font-size: 20px; }
    .snw-topnav { padding: 0 12px; height: 48px; }
    .snw-topnav-brand { font-size: 13px; margin-right: 12px; }
    .snw-filters-grid { grid-template-columns: 1fr; }
    .snw-status-grid { grid-template-columns: 1fr; }
    .snw-quick-bar { flex-direction: column; }
    .snw-quick-group { min-width: 100%; }
    .snw-divider { display: none; }
    .snw-stats { grid-template-columns: repeat(2, 1fr); }
    .snw-chart-topbar { gap: 6px; }
    .snw-cht-btn { font-size: 10px; padding: 4px 8px; }
  }
  @media (max-width: 480px) {
    .snw-stats { grid-template-columns: 1fr 1fr; }
    .snw-pag-btns .snw-pag-btn:not(.snw-pag-active):not(:first-child):not(:last-child) { display: none; }
  }
`;

// ── Constants ────────────────────────────────────────────────────────────────
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

const TIMEFRAMES = [
  { label: '1D', period: '1d', interval: '5m' },
  { label: '5D', period: '5d', interval: '15m' },
  { label: '1M', period: '1mo', interval: '1h' },
  { label: '3M', period: '3mo', interval: '1d' },
  { label: '6M', period: '6mo', interval: '1d' },
  { label: '1Y', period: '1y', interval: '1d' },
  { label: '2Y', period: '2y', interval: '1wk' },
  { label: '5Y', period: '5y', interval: '1wk' },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return deb;
}

// ── Lightweight Charts loader ─────────────────────────────────────────────────
// We load via CDN (v4) to avoid bundler version issues
function useLWC() {
  const [lwc, setLwc] = useState(null);
  useEffect(() => {
    if (window.LightweightCharts) { setLwc(window.LightweightCharts); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.development.js';
    s.async = true;
    s.onload = () => setLwc(window.LightweightCharts);
    document.head.appendChild(s);
  }, []);
  return lwc;
}

// ── Chart theme configs ───────────────────────────────────────────────────────
function getChartThemeOptions(theme) {
  if (theme === 'dark') return {
    layout: { background: { color: '#1e293b' }, textColor: '#e2e8f0' },
    grid: { vertLines: { color: '#263548' }, horzLines: { color: '#263548' } },
  };
  if (theme === 'hud') return {
    layout: { background: { color: 'rgba(0,0,20,0.97)' }, textColor: '#00ffff' },
    grid: { vertLines: { color: 'rgba(0,255,255,0.12)' }, horzLines: { color: 'rgba(0,255,255,0.12)' } },
  };
  return {
    layout: { background: { color: '#FFFFFF' }, textColor: '#0D2D45' },
    grid: { vertLines: { color: '#EAF4FB' }, horzLines: { color: '#EAF4FB' } },
  };
}

// ── AssetChart — full-screen modal for single asset ──────────────────────────
const AssetChart = ({ symbol, onClose }) => {
  const lwc = useLWC();
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleRef = useRef(null);
  const volRef = useRef(null);
  const mssRef = useRef(null);
  const chartCreated = useRef(false);

  const [theme, setTheme] = useState('light');
  const [tf, setTf] = useState({ period: '1mo', interval: '1h' });
  const [showMSS, setShowMSS] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create chart once LWC is ready and container is mounted
  useEffect(() => {
    if (!lwc || !containerRef.current || chartCreated.current) return;

    const chart = lwc.createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      ...getChartThemeOptions(theme),
      rightPriceScale: { visible: true },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    // v4 API: createSeriesMarkers replaced. Use addSeries with Series type refs.
    // Fallback: try addCandlestickSeries (v3) first, then v4 pattern
    try {
      candleRef.current = chart.addCandlestickSeries({
        upColor: '#1BA86D', downColor: '#D63B3B',
        borderUpColor: '#1BA86D', borderDownColor: '#D63B3B',
        wickUpColor: '#1BA86D', wickDownColor: '#D63B3B',
      });
      volRef.current = chart.addHistogramSeries({
        color: '#7BA9C4',
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      mssRef.current = chart.addLineSeries({
        color: '#3A9FD5',
        lineWidth: 2,
        priceLineVisible: false,
        title: 'MSS',
        priceScaleId: 'mss',
        scaleMargins: { top: 0, bottom: 0.7 },
      });
    } catch (e) {
      // v4 pattern
      const { CandlestickSeries, HistogramSeries, LineSeries } = lwc;
      if (CandlestickSeries) {
        candleRef.current = chart.addSeries(CandlestickSeries, {
          upColor: '#1BA86D', downColor: '#D63B3B',
          borderUpColor: '#1BA86D', borderDownColor: '#D63B3B',
          wickUpColor: '#1BA86D', wickDownColor: '#D63B3B',
        });
        volRef.current = chart.addSeries(HistogramSeries, {
          color: '#7BA9C4',
          priceFormat: { type: 'volume' },
          priceScaleId: 'vol',
        });
        mssRef.current = chart.addSeries(LineSeries, {
          color: '#3A9FD5', lineWidth: 2, priceLineVisible: false, title: 'MSS',
        });
      }
    }

    chartRef.current = chart;
    chartCreated.current = true;

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [lwc]); // eslint-disable-line

  // Fetch OHLCV data
  const fetchData = useCallback(async () => {
    if (!candleRef.current) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/mss-chart/v1/data/${symbol}/?period=${tf.period}&interval=${tf.interval}`);
      const json = await res.json();
      if (json.success && json.data.length) {
        candleRef.current.setData(json.data);
        if (volRef.current) {
          volRef.current.setData(json.data.map(d => ({
            time: d.time,
            value: d.volume || 0,
            color: d.close >= d.open ? '#1BA86D55' : '#D63B3B55',
          })));
        }
        setMeta(json.metadata);
        chartRef.current?.timeScale().fitContent();
      } else {
        setError(json.error || 'No data');
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [symbol, tf]);

  // Fetch MSS overlay
  const fetchMSS = useCallback(async () => {
    if (!mssRef.current || !showMSS) return;
    try {
      const res = await fetch(`${BASE_URL}/api/mss-chart/v1/mss-overlay/${symbol}/?period=60&days=365`);
      const json = await res.json();
      if (json.success) mssRef.current.setData(json.data.map(d => ({ time: d.time, value: d.value })));
    } catch (_) {}
  }, [symbol, showMSS]);

  // Re-fetch when series are ready + tf changes
  useEffect(() => {
    if (!chartCreated.current) return;
    const t = setTimeout(() => { fetchData(); fetchMSS(); }, 150);
    return () => clearTimeout(t);
  }, [fetchData, fetchMSS]);

  // Apply theme changes
  useEffect(() => {
    if (chartRef.current) chartRef.current.applyOptions(getChartThemeOptions(theme));
  }, [theme]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { fetchData(); fetchMSS(); }, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchData, fetchMSS]);

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="snw-chart-overlay" data-snw-chart-theme={theme} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="snw-chart-inner">
        {/* Top bar */}
        <div className="snw-chart-topbar">
          <div className="snw-chart-title-wrap">
            <h3>{symbol}{meta?.name && meta.name !== symbol ? ` — ${meta.name}` : ''}</h3>
            <small>{[meta?.sector, meta?.currency].filter(Boolean).join(' · ')}</small>
          </div>
          <div className="snw-chart-topbar-right">
            {/* Theme toggle */}
            <button className={`snw-cht-btn${theme === 'light' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('light')}>☀ Light</button>
            <button className={`snw-cht-btn${theme === 'dark' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
            <button className={`snw-cht-btn${theme === 'hud' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('hud')}>🖥 HUD</button>
            <button className="snw-cht-close" onClick={onClose} title="Close (Esc)">✕</button>
          </div>
        </div>

        {/* Canvas */}
        <div className="snw-chart-canvas-wrap">
          {loading && !chartCreated.current && (
            <div className="snw-loading"><div className="snw-spinner-lg" /></div>
          )}
          {error && <div className="snw-empty">⚠ {error}</div>}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Controls */}
        <div className="snw-chart-controls">
          {TIMEFRAMES.map(t => (
            <button
              key={t.label}
              className={`snw-cht-btn${tf.period === t.period && tf.interval === t.interval ? ' snw-cht-active' : ''}`}
              onClick={() => setTf({ period: t.period, interval: t.interval })}
            >{t.label}</button>
          ))}
          <div className="snw-chart-controls-sep" />
          <button className={`snw-cht-btn${showMSS ? ' snw-cht-active' : ''}`} onClick={() => setShowMSS(v => !v)}>📊 MSS</button>
          <button className={`snw-cht-btn${autoRefresh ? ' snw-cht-active' : ''}`} onClick={() => setAutoRefresh(v => !v)}>🔄 {autoRefresh ? 'Live ON' : 'Live OFF'}</button>
          <button className="snw-cht-btn" onClick={() => { fetchData(); fetchMSS(); }}>⟳ Refresh</button>
        </div>
      </div>
    </div>
  );
};

// ── MultiCompareChart — full-screen comparison modal ─────────────────────────
const MultiCompareChart = ({ symbols, onClose }) => {
  const lwc = useLWC();
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesMap = useRef({});
  const chartCreated = useRef(false);

  const [theme, setTheme] = useState('light');
  const [period, setPeriod] = useState('1mo');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3A9FD5','#1BA86D','#D63B3B','#E89C2A','#9B59B6','#3498DB','#E74C3C','#2ECC71'];

  const CMP_TF = [
    { label: '1M', period: '1mo' }, { label: '3M', period: '3mo' },
    { label: '6M', period: '6mo' }, { label: '1Y', period: '1y' },
    { label: '2Y', period: '2y' }, { label: '5Y', period: '5y' },
  ];

  useEffect(() => {
    if (!lwc || !containerRef.current || chartCreated.current) return;

    const chart = lwc.createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      ...getChartThemeOptions(theme),
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;
    chartCreated.current = true;

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [lwc]); // eslint-disable-line

  const fetchAll = useCallback(async () => {
    if (!chartRef.current) return;
    setLoading(true);
    for (let i = 0; i < symbols.length; i++) {
      const sym = symbols[i];
      try {
        const res = await fetch(`${BASE_URL}/api/mss-chart/v1/data/${sym}/?period=${period}&interval=1d`);
        const json = await res.json();
        if (json.success && json.data.length) {
          const priceData = json.data.map(d => ({ time: d.time, value: d.close }));
          if (seriesMap.current[sym]) {
            seriesMap.current[sym].setData(priceData);
          } else if (chartRef.current) {
            let series;
            try {
              series = chartRef.current.addLineSeries({ color: COLORS[i % COLORS.length], lineWidth: 2, title: sym, priceLineVisible: false });
            } catch (_) {
              series = chartRef.current.addSeries(lwc.LineSeries, { color: COLORS[i % COLORS.length], lineWidth: 2, title: sym });
            }
            series.setData(priceData);
            seriesMap.current[sym] = series;
          }
        }
      } catch (_) {}
    }
    chartRef.current?.timeScale().fitContent();
    setLoading(false);
  }, [symbols, period, lwc]); // eslint-disable-line

  useEffect(() => {
    if (!chartCreated.current) return;
    const t = setTimeout(fetchAll, 150);
    return () => clearTimeout(t);
  }, [fetchAll]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.applyOptions(getChartThemeOptions(theme));
  }, [theme]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchAll, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchAll]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="snw-chart-overlay" data-snw-chart-theme={theme}>
      <div className="snw-chart-inner">
        <div className="snw-chart-topbar">
          <div className="snw-chart-title-wrap">
            <h3>Compare: {symbols.join(', ')}</h3>
            <small>Normalized price lines · {symbols.length} assets</small>
          </div>
          <div className="snw-chart-topbar-right">
            <button className={`snw-cht-btn${theme === 'light' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('light')}>☀ Light</button>
            <button className={`snw-cht-btn${theme === 'dark' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
            <button className={`snw-cht-btn${theme === 'hud' ? ' snw-cht-active' : ''}`} onClick={() => setTheme('hud')}>🖥 HUD</button>
            <button className="snw-cht-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="snw-chart-canvas-wrap">
          {loading && <div className="snw-loading"><div className="snw-spinner-lg" /></div>}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="snw-chart-controls">
          {CMP_TF.map(t => (
            <button key={t.label} className={`snw-cht-btn${period === t.period ? ' snw-cht-active' : ''}`} onClick={() => setPeriod(t.period)}>{t.label}</button>
          ))}
          <div className="snw-chart-controls-sep" />
          <button className={`snw-cht-btn${autoRefresh ? ' snw-cht-active' : ''}`} onClick={() => setAutoRefresh(v => !v)}>🔄 {autoRefresh ? 'Live ON' : 'Live OFF'}</button>
          <button className="snw-cht-btn" onClick={fetchAll}>⟳ Refresh</button>
        </div>
      </div>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const mssColor = (val) => val >= 47 ? 'var(--snw-stable)' : val >= 30 ? 'var(--snw-choppy)' : 'var(--snw-volatile)';

const CategoryBadge = ({ cat }) => (
  <span className={`snw-badge snw-badge-${cat}`}>
    {cat === 'stable' ? '● ' : cat === 'choppy' ? '◆ ' : '▲ '}{cat}
  </span>
);

const BiasBadge = ({ bias }) => !bias
  ? <span style={{ color: 'var(--snw-text-secondary)', fontSize: 11 }}>—</span>
  : <span className={`snw-badge snw-badge-${bias}`}>{bias}</span>;

const MSSBar = ({ val }) => (
  <div className="snw-mss-bar">
    <div className="snw-mss-track">
      <div className="snw-mss-fill" style={{ width: `${val}%`, background: mssColor(val) }} />
    </div>
    <span className="snw-mss-num" style={{ color: mssColor(val) }}>{val?.toFixed(1)}</span>
  </div>
);

const fmt = (n, dec = 4) => n == null ? '—' : typeof n === 'number' ? n.toFixed(dec) : n;

// ── Main Component ────────────────────────────────────────────────────────────
export default function DataTracker() {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState(60);
  const [assetClass, setAssetClass] = useState('all');
  const [daysBack, setDaysBack] = useState(365);
  const [activeTab, setActiveTab] = useState('history');
  const [sortKey, setSortKey] = useState('date_taken');
  const [sortDir, setSortDir] = useState('desc');
  const [showAdvFilter, setShowAdvFilter] = useState(false);
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
  const [chartSymbol, setChartSymbol] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSymbols, setCompareSymbols] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  // Track which row is expanded for inline chart (future use)
  const [expandedRow, setExpandedRow] = useState(null);

  const debouncedSymbol = useDebounce(symbol, 500);

  const fetchPeriodStatus = useCallback(async () => {
    try {
      const r = await fetch(`${BASE_URL}/api/mss/period-status/`);
      const d = await r.json();
      if (d.success) setPeriodStatus(d.periods);
    } catch (_) {}
  }, []);

  const runPeriod = async (p) => {
    setRunningPeriods(prev => ({ ...prev, [p]: true }));
    try {
      const r = await fetch(`${BASE_URL}/api/mss/run-period/${p}/`, { method: 'POST' });
      const d = await r.json();
      if (d.success) { alert(`✅ ${p}d done! ${d.records_saved} records saved.`); fetchPeriodStatus(); fetchFilteredData(); }
      else alert(`❌ Failed: ${d.error}`);
    } catch (e) { alert(`❌ Error: ${e.message}`); }
    finally { setRunningPeriods(prev => ({ ...prev, [p]: false })); }
  };

  const fetchFilteredData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const filters = { numeric: numericFilters, text: textFilters };
      const params = new URLSearchParams({
        period, days: daysBack,
        symbol: debouncedSymbol.trim().toUpperCase(),
        asset_class: assetClass,
        filters: JSON.stringify(filters),
      });
      const r = await fetch(`${BASE_URL}/api/mss/filtered-data/?${params}`);
      const json = await r.json();
      if (json.success) { setAllData(json.data); setTotalRecords(json.total); setCurrentPage(1); }
      else throw new Error(json.error);
    } catch (e) { setError(e.message); setAllData([]); }
    finally { setLoading(false); }
  }, [debouncedSymbol, period, daysBack, assetClass, numericFilters, textFilters]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/mss/symbols/`).then(r => r.json()).then(d => { if (d.success) setSymbols(d.data); }).catch(() => {});
    fetchPeriodStatus();
    const id = setInterval(fetchPeriodStatus, 10000);
    return () => clearInterval(id);
  }, [fetchPeriodStatus]);

  useEffect(() => {
    if (activeTab === 'summary')
      fetch(`${BASE_URL}/api/mss/summary/?period=${period}`).then(r => r.json()).then(d => { if (d.success) setSummary(d); }).catch(() => {});
  }, [activeTab, period]);

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

  const SortIcon = ({ k }) => (
    <span style={{ opacity: sortKey === k ? 1 : 0.3, marginLeft: 4, fontSize: 10 }}>
      {sortKey !== k ? '↕' : sortDir === 'asc' ? '↑' : '↓'}
    </span>
  );

  const handleNumChange = (key, type, val) => setNumericFilters(p => ({ ...p, [key]: { ...p[key], [type]: val } }));
  const handleTxtChange = (key, val) => setTextFilters(p => ({ ...p, [key]: val }));
  const clearAllFilters = () => { setNumericFilters({}); setTextFilters({}); };
  const clearFilter = (key) => setTextFilters(p => { const n = { ...p }; delete n[key]; return n; });

  const handleDownload = (fmt) => {
    const sym = debouncedSymbol.trim().toUpperCase() || 'ALL';
    if (fmt === 'json') {
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${sym}_mss.json`; a.click();
      URL.revokeObjectURL(url); return;
    }
    window.open(`${BASE_URL}/api/mss/download/${sym}/?format=${fmt}&period=${period}&days=${daysBack}`, '_blank');
  };

  const addToCompare = (sym) => {
    if (!compareSymbols.includes(sym) && compareSymbols.length < 8) {
      setCompareSymbols(p => [...p, sym]);
    }
  };
  const removeFromCompare = (sym) => setCompareSymbols(p => p.filter(s => s !== sym));
  const clearCompare = () => { setCompareSymbols([]); setCompareMode(false); };

  const activeFilterCount =
    Object.values(numericFilters).filter(r => r.min || r.max).length +
    Object.values(textFilters).filter(v => v && v !== 'all').length;

  const stats = allData.length ? (() => {
    const mss = allData.map(r => r.mss).filter(Boolean);
    return {
      total: allData.length,
      avgMss: mss.reduce((a, b) => a + b, 0) / mss.length,
      stable: allData.filter(r => r.category === 'stable').length,
      choppy: allData.filter(r => r.category === 'choppy').length,
      volatile: allData.filter(r => r.category === 'volatile').length,
      avgR2: allData.map(r => r.r_squared).filter(Boolean).reduce((a, b) => a + b, 0) / allData.length,
    };
  })() : null;

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  const getDropdownOpts = (key) => [...new Set(allData.map(r => r[key]).filter(v => v && v !== 'null'))].sort();
  const visibleColumns = ALL_COLUMNS.filter(c => !hiddenColumns.includes(c.key));
  const toggleColumn = (k) => setHiddenColumns(p => p.includes(k) ? p.filter(c => c !== k) : [...p, k]);

  return (
    <div className="snw-root">
      <style>{CSS}</style>
      <Header />

      <div>
        <SideNavs />

        {/* ── Top nav ── */}
        <nav className="snw-topnav">
          <div className="snw-topnav-brand">
            <span className="snw-topnav-brand-dot" /> SnowAI Tracker
          </div>
          <div className="snw-topnav-links">
            {[{ id: 'history', label: 'History' }, { id: 'summary', label: 'Daily Snapshot' }, { id: 'download', label: 'Download Centre' }].map(tab => (
              <button key={tab.id} className={`snw-nav-link${activeTab === tab.id ? ' snw-active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Body ── */}
        <div className="snw-body">
          <div className="snw-page-header">
            <div>
              <div className="snw-page-title">MSS Historical Data &amp; Performance Tracker</div>
              <div className="snw-page-subtitle">Market Stability Score · R² · Analyst Bias · Put/Call Ratio — Click 📈 to view chart, ➕ to compare</div>
            </div>
          </div>

          {/* Compare panel */}
          {compareSymbols.length > 0 && (
            <div className="snw-compare-panel">
              <div className="snw-compare-hdr">
                <strong style={{ fontFamily: 'var(--snw-font-head)' }}>📊 Compare Mode — {compareSymbols.length} assets</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {compareSymbols.length >= 2 && (
                    <button className="snw-btn snw-btn-primary snw-btn-sm" onClick={() => setCompareMode(true)}>View Chart</button>
                  )}
                  <button className="snw-btn snw-btn-secondary snw-btn-sm" onClick={clearCompare}>Clear All</button>
                </div>
              </div>
              <div className="snw-compare-tags">
                {compareSymbols.map(s => (
                  <div key={s} className="snw-compare-tag">
                    {s}
                    <button className="snw-compare-tag-rm" onClick={() => removeFromCompare(s)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status panel */}
          <div className="snw-status-panel">
            <div className="snw-status-hdr" onClick={() => setShowStatusPanel(v => !v)}>
              <span>📊 MSS Snapshot Status — Daily runs at 20-min intervals (12:00–14:20 NYC)</span>
              <span>{showStatusPanel ? '▼' : '▲'}</span>
            </div>
            {showStatusPanel && (
              <div className="snw-status-grid">
                {PERIODS.map(p => {
                  const st = periodStatus[p] || { status: 'pending', records: 0, current_asset: '' };
                  const cardCls = `snw-period-card snw-period-card-${st.status}`;
                  return (
                    <div key={p} className={cardCls}>
                      <div className="snw-period-title">{p}d Period</div>
                      <div className={`snw-period-badge snw-badge-${st.status}`}>
                        {st.status === 'running' ? '🔄 RUNNING' : st.status === 'completed' ? '✅ DONE' : st.status === 'failed' ? '❌ FAILED' : '⏳ PENDING'}
                      </div>
                      {st.status === 'running' && st.current_asset && (
                        <div className="snw-period-current">Current: {st.current_asset}</div>
                      )}
                      <div className="snw-period-info">
                        {st.records > 0 ? `${st.records.toLocaleString()} records` : 'No data yet'}
                        {st.last_run && <div>Last: {new Date(st.last_run).toLocaleTimeString()}</div>}
                      </div>
                      <button
                        className="snw-run-btn"
                        onClick={() => runPeriod(p)}
                        disabled={st.status === 'running' || runningPeriods[p]}
                      >
                        {(st.status === 'running' || runningPeriods[p])
                          ? <><span className="snw-spinner-sm" /> Running…</>
                          : '▶ Run Now'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick bar */}
          <div className="snw-quick-bar">
            <div className="snw-quick-group">
              <div className="snw-quick-label">Symbol</div>
              <input className="snw-quick-input" placeholder="Type symbol…" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} list="snw-sym-list" />
              <datalist id="snw-sym-list">{symbols.slice(0, 200).map(s => <option key={s.symbol} value={s.symbol} />)}</datalist>
            </div>
            <div className="snw-quick-group">
              <div className="snw-quick-label">Period</div>
              <select className="snw-quick-select" value={period} onChange={e => setPeriod(+e.target.value)}>
                {PERIODS.map(p => <option key={p} value={p}>{p}d</option>)}
              </select>
            </div>
            <div className="snw-quick-group">
              <div className="snw-quick-label">Asset Class</div>
              <select className="snw-quick-select" value={assetClass} onChange={e => setAssetClass(e.target.value)}>
                {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="snw-quick-group">
              <div className="snw-quick-label">Days Back</div>
              <select className="snw-quick-select" value={daysBack} onChange={e => setDaysBack(+e.target.value)}>
                {[30, 60, 90, 180, 365, 730].map(d => <option key={d} value={d}>{d}d</option>)}
              </select>
            </div>
            <div className="snw-divider" />
            <button className="snw-btn snw-btn-primary" disabled={loading} onClick={fetchFilteredData}>{loading ? 'Loading…' : '⟳ Apply'}</button>
            <button className="snw-btn snw-btn-secondary" onClick={() => setShowAdvFilter(v => !v)}>
              🔍 {showAdvFilter ? 'Hide' : 'Filters'}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>

          {/* Advanced filters */}
          {showAdvFilter && (
            <div className="snw-filters-panel">
              <div className="snw-filters-hdr" onClick={() => setShowAdvFilter(false)}>
                <span>⚙️ Advanced Filters</span><span>▼</span>
              </div>
              <div className="snw-filters-grid">
                {NUMERIC_COLUMNS.map(col => (
                  <div key={col.key} className="snw-filter-item">
                    <label>{col.label}{col.unit ? ` (${col.unit})` : ''}</label>
                    <div className="snw-range-grp">
                      <input type="number" placeholder={`Min ${col.min}`} step={col.step} value={numericFilters[col.key]?.min || ''} onChange={e => handleNumChange(col.key, 'min', e.target.value)} />
                      <span>to</span>
                      <input type="number" placeholder={`Max ${col.max}`} step={col.step} value={numericFilters[col.key]?.max || ''} onChange={e => handleNumChange(col.key, 'max', e.target.value)} />
                    </div>
                  </div>
                ))}
                {TEXT_COLUMNS.map(col => (
                  <div key={col.key} className="snw-filter-item">
                    <label>{col.label}</label>
                    {col.type === 'dropdown'
                      ? <select className="snw-filter-select" value={textFilters[col.key] || 'all'} onChange={e => handleTxtChange(col.key, e.target.value)}>
                          <option value="all">All {col.label}s</option>
                          {getDropdownOpts(col.key).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      : <input className="snw-filter-input" type="text" placeholder={`Filter ${col.label}…`} value={textFilters[col.key] || ''} onChange={e => handleTxtChange(col.key, e.target.value)} />
                    }
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1' }}>
                  <button className="snw-btn snw-btn-secondary snw-btn-sm" onClick={clearAllFilters}>Clear All Filters</button>
                </div>
              </div>
            </div>
          )}

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="snw-active-filters">
              {Object.entries(numericFilters).map(([key, range]) => {
                const col = NUMERIC_COLUMNS.find(c => c.key === key);
                const parts = [];
                if (range.min) parts.push(`${col?.label} ≥ ${range.min}${col?.unit || ''}`);
                if (range.max) parts.push(`${col?.label} ≤ ${range.max}${col?.unit || ''}`);
                return parts.map(part => (
                  <div key={`${key}-${part}`} className="snw-filter-tag">
                    {part}
                    <button className="snw-filter-tag-rm" onClick={() => { handleNumChange(key, 'min', ''); handleNumChange(key, 'max', ''); }}>✕</button>
                  </div>
                ));
              })}
              {Object.entries(textFilters).map(([key, val]) => {
                if (!val || val === 'all') return null;
                const col = TEXT_COLUMNS.find(c => c.key === key);
                return (
                  <div key={key} className="snw-filter-tag">
                    {col?.label} = {val}
                    <button className="snw-filter-tag-rm" onClick={() => clearFilter(key)}>✕</button>
                  </div>
                );
              })}
              <div className="snw-filter-tag snw-filter-tag-clear">
                <button className="snw-filter-tag-rm" onClick={clearAllFilters}>Clear All ✕</button>
              </div>
            </div>
          )}

          {/* Column controls */}
          <div className="snw-col-ctrl">
            <span style={{ fontWeight: 600 }}>📋 Columns:</span>
            <div className="snw-col-dropdown">
              <button className="snw-btn snw-btn-secondary snw-btn-sm">☰ Toggle ▼</button>
              <div className="snw-col-dropdown-content">
                {ALL_COLUMNS.map(col => (
                  <label key={col.key} className="snw-col-chk">
                    <input type="checkbox" checked={!hiddenColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>
            <button className="snw-btn snw-btn-secondary snw-btn-sm" onClick={() => setHiddenColumns([])}>⟳ Reset</button>
            {compareSymbols.length > 0 && (
              <button className="snw-btn snw-btn-secondary snw-btn-sm" onClick={clearCompare}>
                🗑 Clear Compare ({compareSymbols.length})
              </button>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="snw-stats">
              <div className="snw-stat-card">
                <div className="snw-stat-label">Total Records</div>
                <div className="snw-stat-value">{stats.total.toLocaleString()}</div>
              </div>
              <div className="snw-stat-card">
                <div className="snw-stat-label">Avg MSS</div>
                <div className="snw-stat-value" style={{ color: mssColor(stats.avgMss) }}>{stats.avgMss.toFixed(1)}</div>
              </div>
              <div className="snw-stat-card">
                <div className="snw-stat-label">Stable</div>
                <div className="snw-stat-value" style={{ color: 'var(--snw-stable)' }}>{stats.stable}</div>
                <div className="snw-stat-sub">{((stats.stable / stats.total) * 100).toFixed(0)}%</div>
              </div>
              <div className="snw-stat-card">
                <div className="snw-stat-label">Choppy</div>
                <div className="snw-stat-value" style={{ color: 'var(--snw-choppy)' }}>{stats.choppy}</div>
                <div className="snw-stat-sub">{((stats.choppy / stats.total) * 100).toFixed(0)}%</div>
              </div>
              <div className="snw-stat-card">
                <div className="snw-stat-label">Volatile</div>
                <div className="snw-stat-value" style={{ color: 'var(--snw-volatile)' }}>{stats.volatile}</div>
                <div className="snw-stat-sub">{((stats.volatile / stats.total) * 100).toFixed(0)}%</div>
              </div>
              <div className="snw-stat-card">
                <div className="snw-stat-label">Avg R²</div>
                <div className="snw-stat-value">{stats.avgR2.toFixed(3)}</div>
              </div>
            </div>
          )}

          {/* Download panel */}
          {activeTab === 'download' && (
            <div className="snw-dl-panel">
              <span style={{ fontWeight: 600, fontSize: 12 }}>⤓ Export</span>
              <span style={{ fontSize: 11 }}><strong>{allData.length.toLocaleString()}</strong> records match current filters</span>
              <button className="snw-dl-btn snw-dl-csv"  onClick={() => handleDownload('csv')}>📄 CSV</button>
              <button className="snw-dl-btn snw-dl-xlsx" onClick={() => handleDownload('xlsx')}>📊 Excel</button>
              <button className="snw-dl-btn snw-dl-pdf"  onClick={() => handleDownload('pdf')}>📑 PDF</button>
              <button className="snw-dl-btn snw-dl-json" onClick={() => handleDownload('json')}>{ } JSON</button>
            </div>
          )}

          {/* Table */}
          <div className="snw-table-wrap">
            <div className="snw-table-scroll">
              {loading ? (
                <div className="snw-loading"><div className="snw-spinner-lg" /><span>Fetching {totalRecords.toLocaleString()} records…</span></div>
              ) : error ? (
                <div className="snw-empty">⚠ {error}</div>
              ) : paginatedData.length === 0 ? (
                <div className="snw-empty">📭 No records match your filters.</div>
              ) : (
                <table className="snw-table">
                  <thead>
                    <tr>
                      {visibleColumns.map(({ key, label }) => (
                        <th key={key} onClick={() => handleSort(key)}>
                          {label}<SortIcon k={key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, i) => {
                      const rowKey = `${row.symbol}-${row.date_taken}-${i}`;
                      return (
                        <tr key={rowKey}>
                          {visibleColumns.map(col => {
                            if (col.key === 'symbol') return (
                              <td key={col.key}>
                                <div className="snw-symbol-name">{row.symbol}</div>
                                <div className="snw-symbol-btns">
                                  <button className="snw-symbol-btn" onClick={e => { e.stopPropagation(); setChartSymbol(row.symbol); }}>📈 Chart</button>
                                  <button
                                    className="snw-symbol-btn"
                                    onClick={e => { e.stopPropagation(); addToCompare(row.symbol); }}
                                    disabled={compareSymbols.includes(row.symbol)}
                                    style={compareSymbols.includes(row.symbol) ? { opacity: 0.5, cursor: 'default' } : {}}
                                  >
                                    {compareSymbols.includes(row.symbol) ? '✓ Added' : '➕ Compare'}
                                  </button>
                                </div>
                              </td>
                            );
                            if (col.key === 'mss') return <td key={col.key} style={{ minWidth: 120 }}><MSSBar val={row.mss} /></td>;
                            if (col.key === 'category') return <td key={col.key}><CategoryBadge cat={row.category} /></td>;
                            if (col.key === 'analyst_bias' || col.key === 'put_call_bias') return <td key={col.key}><BiasBadge bias={row[col.key]} /></td>;
                            if (col.key === 'price_change') return (
                              <td key={col.key} style={{ color: row.price_change >= 0 ? 'var(--snw-stable)' : 'var(--snw-volatile)', fontWeight: 600 }}>
                                {row.price_change >= 0 ? '+' : ''}{fmt(row.price_change, 2)}%
                              </td>
                            );
                            if (col.key === 'current_price') return <td key={col.key}>${fmt(row.current_price, 2)}</td>;
                            if (col.key === 'date_taken') return <td key={col.key} style={{ color: 'var(--snw-text-secondary)', fontSize: 11 }}>{row.date_taken}</td>;
                            if (col.key === 'period_days') return <td key={col.key} style={{ color: 'var(--snw-text-secondary)' }}>{row.period_days}d</td>;
                            return <td key={col.key}>{fmt(row[col.key], col.key === 'r_squared' ? 4 : col.key === 'volatility' ? 5 : 3)}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {!loading && allData.length > 0 && (
              <div className="snw-pagination">
                <div className="snw-pag-info">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalRecords)} of {totalRecords.toLocaleString()}
                </div>
                <div className="snw-pag-btns">
                  <button className="snw-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>«</button>
                  <button className="snw-pag-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>‹ Prev</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
                    const pg = Math.max(1, Math.min(currentPage - 3, totalPages - 6)) + idx;
                    if (pg > totalPages) return null;
                    return (
                      <button key={pg} className={`snw-pag-btn${pg === currentPage ? ' snw-pag-active' : ''}`} onClick={() => setCurrentPage(pg)}>{pg}</button>
                    );
                  })}
                  <button className="snw-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next ›</button>
                  <button className="snw-pag-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Chart modals (rendered outside table to avoid stacking context issues) ── */}
      {chartSymbol && (
        <AssetChart symbol={chartSymbol} onClose={() => setChartSymbol(null)} />
      )}
      {compareMode && compareSymbols.length >= 2 && (
        <MultiCompareChart symbols={compareSymbols} onClose={() => setCompareMode(false)} />
      )}
    </div>
  );
}