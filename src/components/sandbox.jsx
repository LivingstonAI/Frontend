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

/* ── Asset Picker Modal ── */
.snw-ap-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.82);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.snw-ap-modal {
  background: var(--snw-card);
  border: 1px solid var(--snw-border2);
  border-radius: 8px;
  width: 100%; max-width: 900px;
  height: 80vh;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 64px rgba(0,0,0,.6);
  overflow: hidden;
}
.snw-ap-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--snw-border);
  display: flex; align-items: center; gap: 12px;
  background: var(--snw-surface);
  flex-shrink: 0;
}
.snw-ap-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--snw-accent); flex: 1;
}
.snw-ap-search {
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  color: var(--snw-text);
  padding: 6px 11px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; border-radius: 4px; outline: none;
  width: 200px; transition: border-color .2s;
}
.snw-ap-search:focus { border-color: var(--snw-accent2); }
.snw-ap-count {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; color: var(--snw-text-dim);
  white-space: nowrap;
}
.snw-ap-close {
  background: none; border: none; color: var(--snw-text-dim);
  font-size: 20px; cursor: pointer; line-height: 1;
  transition: color .15s; padding: 0 4px;
}
.snw-ap-close:hover { color: var(--snw-text); }
.snw-ap-body {
  display: grid; grid-template-columns: 200px 1fr;
  flex: 1; overflow: hidden;
}
.snw-ap-cats {
  border-right: 1px solid var(--snw-border);
  overflow-y: auto; background: var(--snw-surface);
}
.snw-ap-cat-btn {
  width: 100%; padding: 10px 14px;
  background: none; border: none;
  border-bottom: 1px solid var(--snw-border);
  color: var(--snw-text-dim);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  text-align: left; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  transition: background .12s, color .12s;
}
.snw-ap-cat-btn:hover { background: var(--snw-bg); color: var(--snw-text); }
.snw-ap-cat-btn.snw-ap-cat-active {
  color: var(--snw-accent);
  background: var(--snw-accent-bg);
  border-left: 2px solid var(--snw-accent);
}
.snw-ap-cat-badge {
  font-size: 9px; padding: 1px 5px;
  background: var(--snw-accent-bg);
  border: 1px solid var(--snw-accent2);
  border-radius: 8px; color: var(--snw-accent);
}
.snw-ap-tickers {
  overflow-y: auto; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
}
.snw-ap-ticker-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2px;
}
.snw-ap-ticker-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--snw-text-dim);
}
.snw-ap-ticker-actions { display: flex; gap: 6px; }
.snw-ap-ticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 5px;
}
.snw-ap-ticker-chip {
  padding: 5px 8px;
  background: var(--snw-bg);
  border: 1px solid var(--snw-border);
  border-radius: 4px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  color: var(--snw-text-dim);
  cursor: pointer; text-align: center;
  transition: all .12s; user-select: none;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.snw-ap-ticker-chip:hover { border-color: var(--snw-border2); color: var(--snw-text); }
.snw-ap-ticker-chip.snw-ap-tick-on {
  background: var(--snw-accent-bg);
  border-color: var(--snw-accent2);
  color: var(--snw-accent);
}
.snw-ap-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--snw-border);
  display: flex; align-items: center; gap: 10px;
  background: var(--snw-surface);
  flex-shrink: 0;
}
.snw-ap-selected-tags {
  flex: 1; display: flex; flex-wrap: wrap; gap: 5px;
  max-height: 60px; overflow-y: auto;
}
.snw-ap-sel-tag {
  padding: 2px 7px;
  background: var(--snw-accent-bg);
  border: 1px solid var(--snw-accent2);
  border-radius: 3px;
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  color: var(--snw-accent); cursor: pointer; white-space: nowrap;
}
.snw-ap-sel-tag:hover { border-color: var(--snw-red); color: var(--snw-red); }

/* ── Edit config inline panel ── */
.snw-edit-panel {
  background: var(--snw-bg);
  border: 1px solid var(--snw-accent2);
  border-radius: 6px;
  padding: 18px;
  margin-bottom: 18px;
  animation: snw-fadedown .15s ease;
}
@keyframes snw-fadedown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.snw-edit-section {
  margin-bottom: 16px;
}
.snw-edit-section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--snw-text-muted);
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--snw-border);
}
.snw-edit-assets-wrap {
  display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;
}
.snw-edit-save-row {
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 18px;
}

/* ── Read-only config table ── */
.snw-config-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
}
.snw-config-table tr {
  border-bottom: 1px solid var(--snw-border);
}
.snw-config-table tr:last-child { border-bottom: none; }
.snw-config-table td {
  padding: 7px 10px;
  vertical-align: top;
}
.snw-config-table td:first-child {
  color: var(--snw-text-muted);
  text-transform: uppercase;
  letter-spacing: .1em;
  font-size: 10px;
  width: 140px;
  white-space: nowrap;
}
.snw-config-table td:last-child {
  color: var(--snw-text);
}
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

/* ── Asset catalogue — grouped by class ── */
const ASSET_CATALOGUE = [
  { label: 'Forex', tickers: [
    'EURUSD=X','GBPUSD=X','USDJPY=X','AUDUSD=X','USDCAD=X','USDCHF=X',
    'NZDUSD=X','EURGBP=X','EURJPY=X','GBPJPY=X','AUDJPY=X','EURCHF=X',
  ]},
  { label: 'Tech & Semiconductors', tickers: [
    'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC',
    'ORCL','CSCO','ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC',
    'SNPS','CDNS','MRVL','NXPI','MU','ADI','MPWR','SWKS','QRVO','ON',
    'IBM','AAOI','ACLS','ACN','ADSK','AKAM','ANSS','APH','ANET','ASML',
    'AVAV','KEYS','MCHP','MTSI','MSI','MDB','NTAP','NTNX','PAYC','PTC',
    'ROP','SAP','SLAB','STX','TER','TSM','TYL','UMC','VRSN','WDC','XLNX','ZBRA',
  ]},
  { label: 'Software & Cloud', tickers: [
    'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR',
    'TEAM','FTNT','OKTA','S','CYBR',
  ]},
  { label: 'Fintech & Payments', tickers: [
    'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER',
    'LYFT','DASH','PINS','SNAP','SPOT','ROKU','Z','ZG','AFRM','COIN',
    'HOOD','SOFI','RBLX','ASTS',
  ]},
  { label: 'Banks & Financial Services', tickers: [
    'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME',
    'ICE','MCO','BK','USB','PNC','TFC','COF','AFL','AMG','AON','AJG',
    'AMP','BEN','CBOE','CINF','DFS','ERIE','FITB','FRC','GL','HBAN',
    'HIG','IVZ','JKHY','KEY','L','LNC','MTB','NTRS','NDAQ','PFG','RF',
    'RJF','SIVB','STT','SYF','TROW','WRB','ZION','CFG','CMA','FHN','EWBC',
    'WAL','WBS','ALLY',
  ]},
  { label: 'Insurance', tickers: [
    'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
  ]},
  { label: 'Healthcare & Pharma', tickers: [
    'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY','AMGN',
    'GILD','CVS','CI','ELV','HUM','VRTX','REGN','ISRG','BIIB','MRNA',
    'BNTX','SGEN','ALNY','BGNE','MCK','CAH','COR','IDXX','A','WAT',
    'ALGN','ATRC','BAX','BDX','BIO','BSX','CERN','DXCM','EW','EXAS',
    'HOLX','HSIC','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PKI',
    'PODD','RMD','STE','SYK','TFX','UHS','WST','XRAY','ZBH','ZTS',
    'TDOC','DOCS','VEEV','HALO','NVAX','IONS','UTHR',
  ]},
  { label: 'Consumer Discretionary', tickers: [
    'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM',
    'ABNB','SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','QSR',
    'AAL','DAL','UAL','LUV','CCL','RCL','EA','TTWO','U','RIVN','LCID',
    'AZO','BBY','BURL','CPRT','DHI','DRI','EXPE','GPC','GRMN','HAS',
    'HLT','KMX','LEN','LVS','MGM','MHK','NVR','ORLY','PHM','POOL',
    'RL','TSCO','TPR','ULTA','VFC','WHR','WYNN','APTV','BWA','DG',
    'DLTR','DDS','FIVE','FL','FOXA','FOX','GPS','GT','HBI','LAD',
    'LKQ','M','NCLH','NWL','PVH',
  ]},
  { label: 'Consumer Staples', tickers: [
    'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS',
    'KHC','STZ','ADM','BF-B','CAG','CHD','CLX','CPB','EL','HSY','K',
    'KDP','KR','KVUE','MKC','MNST','SJM','SYY','TAP','TSN','WBA',
    'BGS','BG','COKE','FLO','HRL','LANC','POST',
  ]},
  { label: 'Energy', tickers: [
    'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN',
    'HES','BKR','APA','CTRA','FANG','KMI','LNG','MRO','NOV','OKE',
    'TRGP','WMB','EQT','AR','CLR','CNX','CQP','EXE','FTI','HP','MTDR',
    'NBL','OVV','PBF','PR','RIG','SM','VAL','XEC',
  ]},
  { label: 'Industrials', tickers: [
    'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD','NOC',
    'FDX','CSX','HWM','TDG','HEI','LHX','TXT','AOS','CARR','CHRW','CMI',
    'DOV','EMR','ETN','EXPD','FAST','FTV','GNRC','GWW','IEX','IR','ITW',
    'J','JBHT','JCI','LDOS','MAS','NSC','ODFL','OTIS','PCAR','PH','PWR',
    'ROK','ROL','RSG','SNA','SWK','TT','URI','VRSK','WAB','WM','XYL',
    'ALK','JBLU','SAVE',
  ]},
  { label: 'Communication & Media', tickers: [
    'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA',
    'NWS','OMC','PARA','WBD','IPG','DISH',
  ]},
  { label: 'Real Estate & REITs', tickers: [
    'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE',
    'DLR','EQR','ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC',
    'SLG','UDR','VTR','WELL','WY','INVH','PEAK','VNO',
  ]},
  { label: 'Materials & Chemicals', tickers: [
    'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB',
    'EMN','SQM','AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS',
    'NUE','PKG','PPG','SEE','STLD','SW','VMC','AVY','AA','MP','RS',
  ]},
  { label: 'Utilities', tickers: [
    'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS',
    'CNP','DTE','ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG',
    'PCG','PEG','PNW','PPL','VST','WEC','XEL','CEG',
  ]},
  { label: 'Chinese ADRs', tickers: ['BABA','JD','PDD','BIDU','NIO','XPEV','LI'] },
  { label: 'Indices', tickers: [
    '^GSPC','^DJI','^IXIC','^RUT','^VIX',
    '^FTSE','^GDAXI','^FCHI','^IBEX','^AEX','^SSMI','^OMXS30','^BFX',
    '^N225','^HSI','000001.SS','^STI','^BSESN','^NSEI','^KS11','^TWII','^JKSE',
    '^AXJO','^GSPTSE','^MXX','^BVSP','^MERV',
  ]},
  { label: 'Commodities', tickers: [
    'GC=F','SI=F','PL=F','PA=F','CL=F','BZ=F','NG=F','RB=F','HO=F',
    'HG=F','ALI=F','ZC=F','ZW=F','ZS=F','KC=F','SB=F','CT=F','CC=F','LBS=F',
  ]},
  { label: 'Bonds', tickers: ['^TNX','^TYX','^FVX','^IRX','ZN=F','ZB=F','ZT=F','ZF=F'] },
  { label: 'Crypto', tickers: [
    'BTC-USD','ETH-USD','BNB-USD','SOL-USD','ADA-USD','XRP-USD',
    'DOGE-USD','AVAX-USD','DOT-USD','MATIC-USD','LINK-USD','UNI-USD',
    'LTC-USD','BCH-USD','ATOM-USD',
  ]},
];

const ALL_TICKERS = ASSET_CATALOGUE.flatMap(c => c.tickers);

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

/* ─── Asset Picker Modal ─────────────────────────────────────────────────── */
function AssetPickerModal({ selected, onChange, onClose }) {
  const [activeCat,   setActiveCat]   = useState(0);
  const [search,      setSearch]      = useState('');

  // Filtered view — when searching, flatten all categories
  const isSearching = search.trim().length > 0;
  const searchLower = search.toLowerCase();

  const visibleCats = isSearching
    ? [{ label: `Results for "${search}"`,
         tickers: ALL_TICKERS.filter(t => t.toLowerCase().includes(searchLower)) }]
    : ASSET_CATALOGUE;

  const activeCatData = visibleCats[isSearching ? 0 : activeCat] || visibleCats[0];

  const toggle = (ticker) => {
    if (selected.includes(ticker)) onChange(selected.filter(t => t !== ticker));
    else onChange([...selected, ticker]);
  };

  const selectCatAll = (tickers) => {
    const toAdd = tickers.filter(t => !selected.includes(t));
    onChange([...selected, ...toAdd]);
  };

  const deselectCatAll = (tickers) => {
    onChange(selected.filter(t => !tickers.includes(t)));
  };

  const catSelectedCount = (tickers) => tickers.filter(t => selected.includes(t)).length;

  return (
    <div className="snw-ap-backdrop" onClick={onClose}>
      <div className="snw-ap-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="snw-ap-header">
          <span className="snw-ap-title">Select Assets</span>
          <input className="snw-ap-search" placeholder="Search tickers…"
            value={search} onChange={e => setSearch(e.target.value)} autoFocus/>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button className="snw-btn snw-btn-ghost snw-btn-sm"
              onClick={() => onChange(ALL_TICKERS)}>Select all</button>
            <button className="snw-btn snw-btn-ghost snw-btn-sm"
              onClick={() => onChange([])}>Clear</button>
          </div>
          <span className="snw-ap-count">{selected.length} selected</span>
          <button className="snw-ap-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="snw-ap-body">

          {/* Category sidebar */}
          {!isSearching && (
            <div className="snw-ap-cats">
              {ASSET_CATALOGUE.map((cat, i) => {
                const cnt = catSelectedCount(cat.tickers);
                return (
                  <button key={cat.label}
                    className={`snw-ap-cat-btn ${activeCat===i?'snw-ap-cat-active':''}`}
                    onClick={() => setActiveCat(i)}>
                    <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {cat.label}
                    </span>
                    {cnt > 0 && <span className="snw-ap-cat-badge">{cnt}</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Ticker grid */}
          <div className="snw-ap-tickers">
            <div className="snw-ap-ticker-header">
              <span className="snw-ap-ticker-label">
                {activeCatData.label} — {activeCatData.tickers.length} tickers
              </span>
              <div className="snw-ap-ticker-actions">
                <button className="snw-btn snw-btn-ghost snw-btn-sm"
                  onClick={() => selectCatAll(activeCatData.tickers)}>
                  All
                </button>
                <button className="snw-btn snw-btn-ghost snw-btn-sm"
                  onClick={() => deselectCatAll(activeCatData.tickers)}>
                  None
                </button>
              </div>
            </div>
            <div className="snw-ap-ticker-grid">
              {activeCatData.tickers.map(t => (
                <div key={t}
                  className={`snw-ap-ticker-chip ${selected.includes(t)?'snw-ap-tick-on':''}`}
                  onClick={() => toggle(t)}
                  title={t}>
                  {t}
                </div>
              ))}
              {activeCatData.tickers.length === 0 && (
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,
                  color:'var(--snw-text-muted)',gridColumn:'1/-1',padding:'20px 0'}}>
                  No results
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer — selected tags + confirm */}
        <div className="snw-ap-footer">
          <div className="snw-ap-selected-tags">
            {selected.length === 0
              ? <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--snw-text-muted)'}}>
                  No assets selected
                </span>
              : selected.map(t => (
                  <span key={t} className="snw-ap-sel-tag" onClick={() => toggle(t)}
                    title="Click to remove">{t} ×</span>
                ))
            }
          </div>
          <button className="snw-btn snw-btn-primary" onClick={onClose}>
            Confirm {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateModelOverlay({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', assets: [], timeframe: '1d',
    initial_capital: 10000, take_profit: 4.0, stop_loss: 2.0,
    population_size: 30, max_generations: 20, mutation_rate: 0.2,
    elite_fraction: 0.3, rl_enabled: true, rl_learning_rate: 0.01,
    allowed_functions: [],
  });
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [dupWarning,      setDupWarning]      = useState('');
  const [submitting,      setSubmitting]      = useState(false);
  const [dataRange,       setDataRange]       = useState(null);  // {start, end, bars, yf_max_period}
  const [rangeLoading,    setRangeLoading]    = useState(false);

  // Whenever timeframe changes, detect the actual available range using
  // the first selected asset as a representative sample
  useEffect(() => {
    const asset = form.assets[0];
    if (!asset) { setDataRange(null); return; }
    setRangeLoading(true);
    setDataRange(null);
    fetch(`${BASE_URL}/api/snowai/detect-range/?asset=${encodeURIComponent(asset)}&timeframe=${form.timeframe}`)
      .then(r => r.json())
      .then(d => { setDataRange(d); setRangeLoading(false); })
      .catch(() => setRangeLoading(false));
  }, [form.timeframe, form.assets[0]]);

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const rawText = await r.text();

      // Try to parse JSON — if it fails, show the raw response so we can see the actual error
      let d;
      try {
        d = JSON.parse(rawText);
      } catch (_) {
        console.error('[SnowAI] Non-JSON response from server:', rawText.slice(0, 500));
        alert(
          `Server returned non-JSON (HTTP ${r.status}).\n\n` +
          `This usually means a Django error. Check your server logs.\n\n` +
          `First 300 chars of response:\n${rawText.slice(0, 300)}`
        );
        setSubmitting(false);
        return;
      }

      if (r.ok) {
        onCreate(d.model);
        onClose();
      } else {
        alert(`Error ${r.status}: ${d.error || JSON.stringify(d)}`);
      }
    } catch (e) {
      console.error('[SnowAI] Fetch error:', e);
      alert(`Network error: ${e.message}`);
    }
    setSubmitting(false);
  };

  const fld = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const toggleFunc = (fn) => setForm(f => ({
    ...f,
    allowed_functions: f.allowed_functions.includes(fn)
      ? f.allowed_functions.filter(x => x !== fn)
      : [...f.allowed_functions, fn],
  }));

  return (
    <>
      {/* Asset picker sub-modal — rendered outside main overlay so z-index stacks */}
      {showAssetPicker && (
        <AssetPickerModal
          selected={form.assets}
          onChange={assets => setForm(f => ({ ...f, assets }))}
          onClose={() => setShowAssetPicker(false)}
        />
      )}

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
              <div className="snw-field">
                <label className="snw-label">Model name</label>
                <input className="snw-input" value={form.name}
                  onChange={e => fld('name', e.target.value)}
                  placeholder="e.g. Uptrend Retracement Alpha" />
              </div>
            </div>

            {/* Assets */}
            <div className="snw-section-gap">
              <div className="snw-section-label">Assets</div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <button className="snw-btn snw-btn-ghost" onClick={() => setShowAssetPicker(true)}>
                  🗂 Browse asset catalogue
                </button>
                {form.assets.length > 0 && (
                  <>
                    <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--snw-text-dim)'}}>
                      {form.assets.length} selected
                    </span>
                    <button className="snw-btn snw-btn-ghost snw-btn-sm"
                      onClick={() => fld('assets', [])}>Clear</button>
                  </>
                )}
              </div>
              {form.assets.length > 0 ? (
                <div className="snw-asset-tags">
                  {form.assets.map(a => (
                    <span key={a} className="snw-asset-tag"
                      onClick={() => fld('assets', form.assets.filter(x => x !== a))}>
                      {a} ×
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--snw-text-muted)'}}>
                  No assets selected — open the catalogue to choose
                </div>
              )}
            </div>

            {/* Parameters */}
            <div className="snw-section-gap">
              <div className="snw-section-label">Parameters</div>
              <div className="snw-field-grid">
                {/* Timeframe — drives data range detection */}
                <div className="snw-field">
                  <label className="snw-label">Timeframe</label>
                  <select className="snw-select" value={form.timeframe}
                    onChange={e => fld('timeframe', e.target.value)}>
                    {['1m','5m','15m','30m','1h','4h','1d','1wk','1mo'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                {[
                  {key:'initial_capital', label:'Capital ($)',     type:'number'},
                  {key:'take_profit',     label:'Take profit (%)', type:'number', step:0.1},
                  {key:'stop_loss',       label:'Stop loss (%)',   type:'number', step:0.1},
                ].map(({key, label, step}) => (
                  <div key={key} className="snw-field">
                    <label className="snw-label">{label}</label>
                    <input className="snw-input" type="number" step={step||1}
                      value={form[key]} onChange={e => fld(key, parseFloat(e.target.value)||0)} />
                  </div>
                ))}
              </div>

              {/* Data range preview */}
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                background: 'var(--snw-bg)',
                border: '1px solid var(--snw-border)',
                borderRadius: 4,
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11,
              }}>
                {!form.assets[0] ? (
                  <span style={{color:'var(--snw-text-muted)'}}>
                    ← Select at least one asset to preview available data range
                  </span>
                ) : rangeLoading ? (
                  <span style={{color:'var(--snw-text-dim)'}}>⏳ Detecting available data…</span>
                ) : dataRange ? (
                  dataRange.available ? (
                    <span style={{color:'var(--snw-green)'}}>
                      ✓ &nbsp;<strong>{form.assets[0]}</strong> @ <strong>{form.timeframe}</strong>
                      &nbsp;—&nbsp;{dataRange.start} → {dataRange.end}
                      &nbsp;({dataRange.bars.toLocaleString()} bars)
                      &nbsp;<span style={{color:'var(--snw-text-muted)'}}>
                        · yfinance max: {dataRange.yf_max_period}
                      </span>
                    </span>
                  ) : (
                    <span style={{color:'var(--snw-red)'}}>
                      ✗ No data available for {form.assets[0]} @ {form.timeframe}
                      — try a different timeframe
                    </span>
                  )
                ) : null}
              </div>
            </div>

            {/* GA / RL */}
            <div className="snw-section-gap">
              <div className="snw-section-label">GA / RL Hyper-parameters</div>
              <div className="snw-field-grid">
                {[
                  {key:'population_size', label:'Population'},
                  {key:'max_generations', label:'Generations'},
                  {key:'mutation_rate',   label:'Mutation rate',    step:0.01},
                  {key:'elite_fraction',  label:'Elite fraction',   step:0.05},
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
                  <select className="snw-select" value={form.rl_enabled?'yes':'no'}
                    onChange={e => fld('rl_enabled', e.target.value==='yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Functions — grouped */}
            <div className="snw-section-gap">
              <div className="snw-section-label" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span>Function pool — {form.allowed_functions.length} selected</span>
                <div style={{display:'flex',gap:6}}>
                  <button className="snw-btn snw-btn-ghost snw-btn-sm"
                    onClick={() => fld('allowed_functions', ALL_FUNCTIONS)}>Select all</button>
                  <button className="snw-btn snw-btn-ghost snw-btn-sm"
                    onClick={() => fld('allowed_functions', [])}>Clear</button>
                </div>
              </div>
              {FUNCTION_CATEGORIES.map(cat => (
                <div key={cat.label} className="snw-func-category">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                    <div className="snw-func-category-label">{cat.label}</div>
                    <div style={{display:'flex',gap:5}}>
                      <button className="snw-btn snw-btn-ghost snw-btn-sm"
                        onClick={() => fld('allowed_functions',[
                          ...form.allowed_functions,
                          ...cat.fns.filter(f => !form.allowed_functions.includes(f))
                        ])}>All</button>
                      <button className="snw-btn snw-btn-ghost snw-btn-sm"
                        onClick={() => fld('allowed_functions',
                          form.allowed_functions.filter(f => !cat.fns.includes(f)))}>None</button>
                    </div>
                  </div>
                  <div className="snw-func-grid">
                    {cat.fns.map(fn => (
                      <div key={fn}
                        className={`snw-func-chip ${form.allowed_functions.includes(fn)?'snw-func-on':''}`}
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
                disabled={submitting||!form.name||form.assets.length===0||form.allowed_functions.length===0||!!dupWarning}
                onClick={submit}>
                {submitting ? 'Creating…' : 'Create Model'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showEditAssetPicker, setShowEditAssetPicker] = useState(false);

  const startEdit = () => {
    setEditForm({
      name:            model.name,
      assets:          model.assets || [],
      timeframe:       model.timeframe,
      initial_capital: model.initial_capital,
      take_profit:     model.take_profit,
      stop_loss:       model.stop_loss,
      population_size: model.population_size,
      max_generations: model.max_generations,
      mutation_rate:   model.mutation_rate,
      elite_fraction:  model.elite_fraction,
      rl_enabled:      model.rl_enabled,
      rl_learning_rate:model.rl_learning_rate,
      allowed_functions: model.allowed_functions || [],
    });
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setEditForm(null); };

  const efld = (key, val) => setEditForm(f => ({ ...f, [key]: val }));
  const toggleEditFunc = (fn) => setEditForm(f => ({
    ...f,
    allowed_functions: f.allowed_functions.includes(fn)
      ? f.allowed_functions.filter(x => x !== fn)
      : [...f.allowed_functions, fn],
  }));

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        allowed_functions: editForm.allowed_functions,
      };
      const r    = await fetch(`${BASE_URL}/api/snowai/models/${model.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await r.text();
      let d;
      try { d = JSON.parse(text); } catch (_) {
        alert(`Server returned non-JSON (${r.status}):\n${text.slice(0, 300)}`);
        setSaving(false); return;
      }
      if (r.ok) {
        setModel(d.model);
        setEditing(false);
        setEditForm(null);
      } else {
        alert(`Error ${r.status}: ${d.error || JSON.stringify(d)}`);
      }
    } catch (e) { alert(`Network error: ${e.message}`); }
    setSaving(false);
  };

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
          {!editing && (
            <button className="snw-btn snw-btn-ghost snw-btn-sm" onClick={startEdit}>✏ Edit</button>
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
          {/* ── Edit asset picker sub-modal ── */}
          {showEditAssetPicker && editForm && (
            <AssetPickerModal
              selected={editForm.assets}
              onChange={assets => efld('assets', assets)}
              onClose={() => setShowEditAssetPicker(false)}
            />
          )}

          {/* ── Config panel — view or edit ── */}
          <div className="snw-panel">
            <div className="snw-panel-header">
              <span className="snw-panel-title">Configuration</span>
              {!editing
                ? <button className="snw-btn snw-btn-ghost snw-btn-sm" onClick={startEdit}>✏ Edit config</button>
                : <div style={{display:'flex',gap:6}}>
                    <button className="snw-btn snw-btn-ghost snw-btn-sm" onClick={cancelEdit}>Cancel</button>
                    <button className="snw-btn snw-btn-primary snw-btn-sm" onClick={saveEdit} disabled={saving}>
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
              }
            </div>
            <div className="snw-panel-body">
              {!editing ? (
                /* ── Read-only view ── */
                <table className="snw-config-table">
                  <tbody>
                    {[
                      ['Name',        model.name],
                      ['Assets',      (model.assets||[]).join(', ') || '—'],
                      ['Timeframe',   model.timeframe],
                      ['Data range',  'Auto-detected from yfinance'],
                      ['Capital',     `$${model.initial_capital?.toLocaleString()}`],
                      ['Take profit', `${model.take_profit}%`],
                      ['Stop loss',   `${model.stop_loss}%`],
                      ['Population',  model.population_size],
                      ['Generations', model.max_generations],
                      ['Mutation rate', model.mutation_rate],
                      ['Elite fraction', model.elite_fraction],
                      ['RL',          model.rl_enabled ? `enabled  (lr ${model.rl_learning_rate})` : 'off'],
                      ['Functions',   null],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>
                          {label === 'Functions' ? (
                            <div className="snw-tags" style={{gap:4}}>
                              {(model.allowed_functions||[]).map(fn => (
                                <span key={fn} className="snw-tag" style={{fontSize:9}}>{fn}</span>
                              ))}
                            </div>
                          ) : val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* ── Edit form ── */
                <div className="snw-edit-panel">

                  {/* Name */}
                  <div className="snw-edit-section">
                    <div className="snw-edit-section-label">Name</div>
                    <input className="snw-input" value={editForm.name}
                      onChange={e => efld('name', e.target.value)} style={{width:'100%'}}/>
                  </div>

                  {/* Assets */}
                  <div className="snw-edit-section">
                    <div className="snw-edit-section-label">
                      Assets — {editForm.assets.length} selected
                    </div>
                    <button className="snw-btn snw-btn-ghost snw-btn-sm"
                      style={{marginBottom:8}}
                      onClick={() => setShowEditAssetPicker(true)}>
                      🗂 Browse catalogue
                    </button>
                    <div className="snw-edit-assets-wrap">
                      {editForm.assets.map(a => (
                        <span key={a} className="snw-asset-tag"
                          onClick={() => efld('assets', editForm.assets.filter(x => x !== a))}>
                          {a} ×
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Params */}
                  <div className="snw-edit-section">
                    <div className="snw-edit-section-label">Parameters</div>
                    <div className="snw-field-grid">
                      <div className="snw-field">
                        <label className="snw-label">Timeframe</label>
                        <select className="snw-select" value={editForm.timeframe}
                          onChange={e => efld('timeframe', e.target.value)}>
                          {['1m','5m','15m','30m','1h','4h','1d','1wk','1mo'].map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                      {[
                        {key:'initial_capital', label:'Capital ($)'},
                        {key:'take_profit',     label:'Take profit (%)', step:0.1},
                        {key:'stop_loss',       label:'Stop loss (%)',   step:0.1},
                        {key:'population_size', label:'Population'},
                        {key:'max_generations', label:'Generations'},
                        {key:'mutation_rate',   label:'Mutation rate',   step:0.01},
                        {key:'elite_fraction',  label:'Elite fraction',  step:0.05},
                        {key:'rl_learning_rate',label:'RL learning rate',step:0.001},
                      ].map(({key, label, step}) => (
                        <div key={key} className="snw-field">
                          <label className="snw-label">{label}</label>
                          <input className="snw-input" type="number" step={step||1}
                            value={editForm[key]}
                            onChange={e => efld(key, parseFloat(e.target.value)||0)}/>
                        </div>
                      ))}
                      <div className="snw-field">
                        <label className="snw-label">RL enabled</label>
                        <select className="snw-select"
                          value={editForm.rl_enabled ? 'yes' : 'no'}
                          onChange={e => efld('rl_enabled', e.target.value === 'yes')}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Functions */}
                  <div className="snw-edit-section">
                    <div className="snw-edit-section-label"
                      style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span>Functions — {editForm.allowed_functions.length} selected</span>
                      <div style={{display:'flex',gap:5}}>
                        <button className="snw-btn snw-btn-ghost snw-btn-sm"
                          onClick={() => efld('allowed_functions', ALL_FUNCTIONS)}>All</button>
                        <button className="snw-btn snw-btn-ghost snw-btn-sm"
                          onClick={() => efld('allowed_functions', [])}>None</button>
                      </div>
                    </div>
                    {FUNCTION_CATEGORIES.map(cat => (
                      <div key={cat.label} className="snw-func-category">
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                          <div className="snw-func-category-label">{cat.label}</div>
                          <div style={{display:'flex',gap:4}}>
                            <button className="snw-btn snw-btn-ghost snw-btn-sm"
                              onClick={() => efld('allowed_functions',[
                                ...editForm.allowed_functions,
                                ...cat.fns.filter(f => !editForm.allowed_functions.includes(f))
                              ])}>All</button>
                            <button className="snw-btn snw-btn-ghost snw-btn-sm"
                              onClick={() => efld('allowed_functions',
                                editForm.allowed_functions.filter(f => !cat.fns.includes(f)))}>None</button>
                          </div>
                        </div>
                        <div className="snw-func-grid">
                          {cat.fns.map(fn => (
                            <div key={fn}
                              className={`snw-func-chip ${editForm.allowed_functions.includes(fn)?'snw-func-on':''}`}
                              onClick={() => toggleEditFunc(fn)}>
                              <span className="snw-func-dot"/>
                              {fn}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="snw-edit-save-row">
                    <button className="snw-btn snw-btn-ghost" onClick={cancelEdit}>Cancel</button>
                    <button className="snw-btn snw-btn-primary" onClick={saveEdit} disabled={saving}>
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </div>
              )}
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
      if (search)       params.set('q',         search);
      if (filterStatus) params.set('status',     filterStatus);
      if (filterTf)     params.set('timeframe',  filterTf);
      const r    = await fetch(`${BASE_URL}/api/snowai/models/?${params}`);
      const text = await r.text();
      try {
        const d = JSON.parse(text);
        setModels(d.models || []);
      } catch (_) {
        console.error('[SnowAI] loadModels — non-JSON response:', text.slice(0, 300));
      }
    } catch (e) {
      console.error('[SnowAI] loadModels — fetch error:', e);
    }
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
      const r    = await fetch(`${BASE_URL}/api/snowai/models/${m.id}/`);
      const text = await r.text();
      try {
        const d = JSON.parse(text);
        setSelected(d.model || m);
      } catch (_) {
        console.error('[SnowAI] selectModel — non-JSON response:', text.slice(0, 300));
        setSelected(m);
      }
    } catch (e) {
      console.error('[SnowAI] selectModel — fetch error:', e);
      setSelected(m);
    }
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