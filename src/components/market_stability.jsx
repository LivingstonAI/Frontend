import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// ============================================================
// CSS — Sector Deep Dive Modal
// ============================================================

const sectorDeepDiveStyles = `
/* ── Sector Selector Buttons (in toolbar) ── */
.sector-selector-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}
.sector-select-btn {
    padding: 10px 18px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #e2e8f0;
    border: 2px solid #475569;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.sector-select-btn:hover:not(:disabled) {
    border-color: #0891b2;
    background: linear-gradient(135deg, #334155 0%, #475569 100%);
    transform: translateY(-2px);
}
.sector-select-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.sector-select-btn.active {
    background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
    border-color: #0891b2;
    color: white;
}

/* ── Modal ── */
.sector-dive-modal {
    /* Reuses .corr-modal base styles but with cyan accent */
}

/* Health Dashboard */
.sector-health-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    padding: 18px 28px;
}
.sector-health-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 2px solid #334155;
    border-radius: 12px;
    padding: 14px 16px;
    text-align: center;
}
.sector-health-label {
    font-size: 10px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}
.sector-health-value {
    font-size: 24px;
    font-weight: 700;
    color: #e2e8f0;
}
.sector-health-sub {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
}

/* Concentration Gauge */
.concentration-gauge-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
}
.concentration-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 6px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0,0,0,0.3);
}
.concentration-number {
    font-size: 26px;
    font-weight: 700;
    color: #e0f2fe;
}
.concentration-label {
    font-size: 10px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 8px;
}

/* Stock Performance Tables */
.stock-perf-table {
    width: 100%;
    border-collapse: collapse;
}
.stock-perf-table th {
    font-size: 10px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid #334155;
}
.stock-perf-table td {
    font-size: 12px;
    color: #cbd5e1;
    padding: 8px 10px;
    border-bottom: 1px solid #1e293b;
}
.stock-perf-table tr:hover {
    background: rgba(8,145,178,0.08);
}
.stock-symbol-cell {
    font-weight: 600;
    color: #0891b2;
}

/* Index Drivers Heatmap */
.index-drivers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}
.driver-card {
    background: rgba(8,145,178,0.08);
    border: 1px solid rgba(8,145,178,0.2);
    border-radius: 8px;
    padding: 10px 12px;
    position: relative;
    overflow: hidden;
}
.driver-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: currentColor;
}
.driver-symbol {
    font-size: 13px;
    font-weight: 700;
    color: #e2e8f0;
    margin-bottom: 4px;
}
.driver-contrib {
    font-size: 16px;
    font-weight: 700;
    color: #0891b2;
}
.driver-weight {
    font-size: 9px;
    color: #64748b;
    margin-top: 2px;
}

/* Trade Opportunities Grid */
.trade-opp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
}
.trade-opp-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 12px 14px;
    border-left: 4px solid;
}
.trade-opp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.trade-opp-symbol {
    font-size: 14px;
    font-weight: 700;
    color: #cbd5e1;
}
.trade-opp-action {
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
}
.trade-opp-body {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.4;
    margin-bottom: 8px;
}
.trade-opp-metrics {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #64748b;
}

/* Rotation Signals */
.rotation-signal-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: rgba(8,145,178,0.08);
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 3px solid #0891b2;
}
.rotation-signal-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    white-space: nowrap;
}
.rotation-signal-text {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
    .sector-health-dashboard {
        grid-template-columns: 1fr 1fr;
    }
    .index-drivers-grid,
    .trade-opp-grid {
        grid-template-columns: 1fr;
    }
}
`;

// ============================================================
// CSS — Institutional vs Retail Analysis Panel
// ============================================================

const institutionalRetailStyles = `
/* ── Institutional vs Retail Toggle Button ── */
.inst-retail-toggle {
    padding: 8px 16px;
    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(124,58,237,0.3);
}
.inst-retail-toggle:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(124,58,237,0.4);
}
.inst-retail-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ── Panel Container ── */
.inst-retail-panel {
    background: linear-gradient(135deg, #2e1065 0%, #4c1d95 100%);
    border: 2px solid #7c3aed;
    border-radius: 12px;
    margin-top: 14px;
    overflow: hidden;
    animation: instPanelSlide 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes instPanelSlide {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 1200px; }
}

.inst-retail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: rgba(124,58,237,0.15);
    user-select: none;
}
.inst-retail-title {
    font-size: 14px;
    font-weight: 700;
    color: #e9d5ff;
    display: flex;
    align-items: center;
    gap: 8px;
}
.inst-retail-chevron {
    font-size: 12px;
    color: #7c3aed;
    transition: transform 0.25s;
}
.inst-retail-chevron.open {
    transform: rotate(180deg);
}

.inst-retail-body {
    padding: 16px;
    animation: corrAccFade 0.2s ease;
}

/* ── Reliability Banner ── */
.inst-reliability-banner {
    padding: 12px 18px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    border: 2px solid;
}

/* ── Score Gauges (Dual Circular Progress) ── */
.inst-score-gauges {
    display: flex;
    justify-content: space-around;
    margin-bottom: 18px;
    gap: 16px;
}
.inst-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}
.inst-gauge-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 6px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    background: rgba(0,0,0,0.2);
}
.inst-gauge-number {
    font-size: 28px;
    font-weight: 700;
    color: #f3e8ff;
}
.inst-gauge-label {
    font-size: 10px;
    color: #a78bfa;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 8px;
}
.inst-gauge-sublabel {
    font-size: 9px;
    color: #6b21a8;
    margin-top: 2px;
}

/* ── Confidence Badge ── */
.inst-confidence-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding: 10px 16px;
    background: rgba(124,58,237,0.1);
    border-radius: 10px;
}
.inst-confidence-badge {
    padding: 5px 16px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
}
.inst-confidence-text {
    font-size: 12px;
    color: #c4b5fd;
}

/* ── Interpretation Section ── */
.inst-interpretation {
    background: rgba(124,58,237,0.08);
    border-left: 3px solid #7c3aed;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
}
.inst-interpretation-text {
    font-size: 13px;
    color: #e9d5ff;
    line-height: 1.6;
}

/* ── Signal Breakdown Grid ── */
.inst-signal-breakdown {
    margin-bottom: 16px;
}
.inst-signal-breakdown-title {
    font-size: 12px;
    color: #7c3aed;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
}
.inst-signal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
}
.inst-signal-card {
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.25);
    border-radius: 8px;
    padding: 10px 12px;
}
.inst-signal-name {
    font-size: 10px;
    color: #7c3aed;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.inst-signal-score {
    font-size: 18px;
    font-weight: 700;
    color: #f3e8ff;
    margin-bottom: 2px;
}
.inst-signal-interp {
    font-size: 9px;
    color: #a78bfa;
    line-height: 1.3;
}

/* ── Implications List ── */
.inst-implications {
    background: rgba(124,58,237,0.08);
    border-radius: 8px;
    padding: 12px 16px;
}
.inst-implications-title {
    font-size: 12px;
    color: #7c3aed;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}
.inst-implications-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.inst-implication-item {
    font-size: 12px;
    color: #c4b5fd;
    line-height: 1.5;
    padding-left: 4px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
    .inst-score-gauges {
        flex-direction: column;
        align-items: center;
    }
    .inst-signal-grid {
        grid-template-columns: 1fr;
    }
}
`;



// ============================================================
// CSS ADDITIONS — Tech Subsector Modal + Per-Card Peer Panel
// ============================================================

const techSubsectorModalStyles = `
/* ── Tech Subsector Comparison Modal ── */
.tech-subsector-modal {
    /* Reuses .corr-modal base styles but with teal accent */
}

/* Subsector stats grid */
.subsector-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    padding: 18px 28px;
}
.subsector-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 14px 16px;
    transition: all 0.2s;
    cursor: pointer;
}
.subsector-card:hover {
    border-color: #0891b2;
    background: #334155;
    transform: translateY(-2px);
}
.subsector-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}
.subsector-name {
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
    line-height: 1.3;
}
.subsector-rank-badge {
    background: #0891b2;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 700;
}
.subsector-metrics {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
}
.subsector-metric-label {
    color: #64748b;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.subsector-metric-value {
    color: #cbd5e1;
    font-weight: 600;
}
.subsector-sentiment-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    margin-top: 6px;
}
.subsector-drivers {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #334155;
    font-size: 11px;
    color: #64748b;
    line-height: 1.4;
}

/* Rotation signals panel */
.rotation-signals-panel {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px;
    margin: 0 28px 12px;
}
.rotation-signal-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    background: rgba(8,145,178,0.08);
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 3px solid #0891b2;
}
.rotation-signal-row:last-child { margin-bottom: 0; }
.rotation-signal-badge {
    padding: 4px 12px;
    border-radius: 14px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    white-space: nowrap;
}
.rotation-signal-desc {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.5;
}

/* Trade recs grid for subsectors */
.subsector-trade-recs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
}
.subsector-trade-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 12px 14px;
}
.subsector-trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.subsector-trade-action {
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
}
.subsector-trade-body {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
}

/* ============================================================
   PER-CARD: Tech Stock Peer Comparison Panel
   ============================================================ */

.tech-peer-toggle {
    padding: 8px 16px;
    background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(8,145,178,0.3);
}
.tech-peer-toggle:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(8,145,178,0.4);
}
.tech-peer-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tech-peer-panel {
    background: linear-gradient(135deg, #164e63 0%, #155e75 100%);
    border: 2px solid #0891b2;
    border-radius: 12px;
    margin-top: 14px;
    overflow: hidden;
    animation: peerPanelSlide 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes peerPanelSlide {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 800px; }
}

.tech-peer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: rgba(8,145,178,0.15);
    user-select: none;
}
.tech-peer-title {
    font-size: 14px;
    font-weight: 700;
    color: #cffafe;
    display: flex;
    align-items: center;
    gap: 8px;
}
.tech-peer-subsector-badge {
    background: #0891b2;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    color: white;
    font-weight: 600;
}
.tech-peer-chevron {
    font-size: 12px;
    color: #0891b2;
    transition: transform 0.25s;
}
.tech-peer-chevron.open {
    transform: rotate(180deg);
}

.tech-peer-body {
    padding: 16px;
    animation: corrAccFade 0.2s ease;
}

/* Signal banner */
.tech-peer-signal-banner {
    padding: 10px 16px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 600;
    color: white;
}

/* Subsector sentiment mini-badge */
.tech-peer-sentiment {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    background: rgba(8,145,178,0.1);
    margin-bottom: 12px;
}
.tech-peer-sentiment-badge {
    padding: 4px 12px;
    border-radius: 14px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
}
.tech-peer-sentiment-info {
    font-size: 11px;
    color: #a5f3fc;
    line-height: 1.4;
}

/* Trade rec card */
.tech-peer-trade-card {
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
    border: 1px solid;
}
.tech-peer-trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.tech-peer-trade-action {
    display: inline-block;
    padding: 5px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
}
.tech-peer-trade-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.tech-peer-trade-row {
    font-size: 12px;
    color: #a5f3fc;
    line-height: 1.5;
}
.tech-peer-trade-row strong {
    color: #cffafe;
}

/* Score ring */
.tech-peer-score-ring {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 14px;
}
.tech-peer-score-circle {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 4px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.tech-peer-score-number {
    font-size: 22px;
    font-weight: 700;
    color: #e0f2fe;
}
.tech-peer-score-sub {
    font-size: 9px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
}
.tech-peer-score-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.tech-peer-score-detail-row {
    font-size: 12px;
    color: #a5f3fc;
}
.tech-peer-score-detail-row strong {
    color: #e0f2fe;
}

/* Mini stats */
.tech-peer-mini-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
}
.tech-peer-mini-stat {
    background: rgba(8,145,178,0.12);
    border: 1px solid rgba(8,145,178,0.25);
    border-radius: 8px;
    padding: 10px;
    text-align: center;
}
.tech-peer-mini-stat-label {
    font-size: 10px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.tech-peer-mini-stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #e0f2fe;
}

/* Top peers table */
.tech-peer-table {
    margin-top: 12px;
    border-radius: 8px;
    overflow: hidden;
}
.tech-peer-table-header {
    font-size: 11px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}
.tech-peer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: rgba(8,145,178,0.08);
    border-radius: 6px;
    margin-bottom: 4px;
    font-size: 12px;
}
.tech-peer-row:last-child {
    margin-bottom: 0;
}
.tech-peer-symbol {
    color: #a5f3fc;
    font-weight: 600;
}
.tech-peer-return {
    font-weight: 600;
}

/* Subsector drivers mini-section */
.tech-peer-drivers {
    margin-top: 10px;
    padding: 10px 12px;
    background: rgba(8,145,178,0.1);
    border-radius: 8px;
    border-left: 3px solid #0891b2;
}
.tech-peer-drivers-label {
    font-size: 11px;
    color: #0891b2;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.tech-peer-drivers-list {
    font-size: 11px;
    color: #a5f3fc;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
    .subsector-stats-grid {
        grid-template-columns: 1fr;
        padding: 14px 20px;
    }
    .subsector-trade-recs-grid {
        grid-template-columns: 1fr;
    }
    .tech-peer-mini-stats {
        grid-template-columns: 1fr 1fr;
    }
}
`;

// ============================================================
// CSS — Correlation Modal + Sentiment + Trade Recs + Per-Card
// ============================================================

const correlationModalStyles = `
/* ── Modal Backdrop ── */
.corr-modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 50000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: corrModalFadeIn 0.25s ease;
}
@keyframes corrModalFadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── Modal Shell ── */
.corr-modal {
    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
    border: 2px solid #334155;
    border-radius: 20px;
    width: 100%;
    max-width: 800px;
    max-height: 88vh;
    overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    animation: corrModalSlideUp 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes corrModalSlideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.corr-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 28px 18px;
    border-bottom: 1px solid #334155;
    position: sticky; top: 0; z-index: 2;
    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
    border-radius: 20px 20px 0 0;
}
.corr-modal-header h2 {
    margin: 0; font-size: 20px; font-weight: 700; color: #f1f5f9;
    display: flex; align-items: center; gap: 10px;
}
.corr-modal-close {
    background: #334155; border: none; color: #94a3b8;
    width: 32px; height: 32px; border-radius: 8px;
    cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
}
.corr-modal-close:hover { background: #ef4444; color: white; }

/* ── Regime Banner ── */
.corr-regime-banner {
    margin: 20px 28px 0;
    padding: 14px 20px;
    border-radius: 12px;
    display: flex; align-items: center; gap: 14px;
}
.corr-regime-label {
    font-size: 15px; font-weight: 700; color: white;
    text-transform: uppercase; letter-spacing: 1px; white-space: nowrap;
}
.corr-regime-desc { font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.5; }

/* ── Sentiment Row (new) ── */
.corr-sentiment-row {
    margin: 14px 28px 0;
    padding: 14px 20px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    display: flex; align-items: center; gap: 18px;
}
.corr-sentiment-badge {
    padding: 8px 18px;
    border-radius: 24px;
    font-size: 14px; font-weight: 700;
    color: white; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.8px;
}
.corr-sentiment-details { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.corr-sentiment-score {
    font-size: 12px; color: #94a3b8;
}
.corr-sentiment-score strong { color: #cbd5e1; }
.corr-sentiment-desc { font-size: 12px; color: #64748b; line-height: 1.4; }

/* ── Stats Row ── */
.corr-stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
    gap: 10px; padding: 18px 28px;
}
.corr-stat-card {
    background: #1e293b; border: 1px solid #334155;
    border-radius: 10px; padding: 13px 8px; text-align: center;
}
.corr-stat-label {
    font-size: 10px; color: #64748b; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;
}
.corr-stat-value { font-size: 20px; font-weight: 700; color: #f1f5f9; }

/* ── Accordion ── */
.corr-accordion { margin: 0 28px 10px; }
.corr-accordion-trigger {
    width: 100%; background: #1e293b; border: 1px solid #334155;
    border-radius: 10px; padding: 13px 18px;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; transition: all 0.2s;
    color: #cbd5e1; font-size: 14px; font-weight: 600; text-align: left;
}
.corr-accordion-trigger:hover { background: #334155; border-color: #475569; }
.corr-accordion-trigger .corr-acc-arrow {
    font-size: 11px; transition: transform 0.25s; color: #64748b;
}
.corr-accordion-trigger.open .corr-acc-arrow { transform: rotate(180deg); }
.corr-accordion-body {
    background: #1e293b; border: 1px solid #334155; border-top: none;
    border-radius: 0 0 10px 10px; padding: 18px;
    animation: corrAccFade 0.2s ease;
}
@keyframes corrAccFade {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Insights List ── */
.corr-insights-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.corr-insights-list li {
    font-size: 13px; color: #cbd5e1; line-height: 1.6;
    padding: 10px 14px; background: #0f172a;
    border-radius: 8px; border-left: 3px solid #3b82f6;
}

/* ── Trade Recs Table (new) ── */
.trade-recs-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px; flex-wrap: wrap; gap: 8px;
}
.trade-recs-filter {
    display: flex; gap: 6px; flex-wrap: wrap;
}
.trade-filter-btn {
    padding: 4px 12px; border-radius: 14px; border: 1px solid #334155;
    background: transparent; color: #64748b; font-size: 11px;
    font-weight: 600; cursor: pointer; transition: all 0.15s;
    text-transform: uppercase; letter-spacing: 0.5px;
}
.trade-filter-btn:hover { border-color: #475569; color: #94a3b8; }
.trade-filter-btn.active { background: #334155; color: #e2e8f0; border-color: #475569; }

.trade-recs-table { width: 100%; border-collapse: collapse; }
.trade-recs-table th {
    font-size: 10px; color: #64748b; text-transform: uppercase;
    letter-spacing: 0.5px; padding: 7px 8px; text-align: left;
    border-bottom: 1px solid #334155; font-weight: 600;
    white-space: nowrap;
}
.trade-recs-table th[data-sort] { cursor: pointer; user-select: none; }
.trade-recs-table th[data-sort]:hover { color: #94a3b8; }
.trade-recs-table td {
    padding: 9px 8px; font-size: 12px; color: #cbd5e1;
    border-bottom: 1px solid #1e293b; vertical-align: middle;
}
.trade-recs-table tr:last-child td { border-bottom: none; }
.trade-recs-table tr:hover td { background: rgba(51,65,85,0.3); }

/* Action badge */
.trade-action-badge {
    display: inline-block; padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 700; color: white;
    text-transform: uppercase; letter-spacing: 0.5px;
}
/* Ticker badge */
.corr-ticker-badge {
    display: inline-block; background: #334155;
    padding: 3px 10px; border-radius: 6px;
    font-weight: 600; color: #e2e8f0; font-size: 12px;
}
/* Expandable row detail */
.trade-rec-detail {
    background: #0f172a; border-radius: 8px;
    padding: 12px 14px; margin: 4px 0 8px;
    border-left: 3px solid #475569;
    display: flex; flex-direction: column; gap: 6px;
}
.trade-rec-detail-row { font-size: 12px; color: #94a3b8; line-height: 1.5; }
.trade-rec-detail-row strong { color: #cbd5e1; }

/* ── Breakdown Table (commodities / contributors) ── */
.corr-breakdown-table { width: 100%; border-collapse: collapse; }
.corr-breakdown-table th {
    font-size: 10px; color: #64748b; text-transform: uppercase;
    letter-spacing: 0.5px; padding: 7px 8px; text-align: left;
    border-bottom: 1px solid #334155; font-weight: 600;
}
.corr-breakdown-table td {
    padding: 9px 8px; font-size: 13px; color: #cbd5e1;
    border-bottom: 1px solid #1e293b;
}
.corr-breakdown-table tr:last-child td { border-bottom: none; }

/* ── Chart wrap ── */
.corr-chart-wrap { background: #0f172a; border-radius: 10px; padding: 14px; height: 220px; }

/* ── Footer ── */
.corr-modal-footer {
    padding: 14px 28px 20px; font-size: 11px; color: #475569;
    text-align: center; font-style: italic;
}

/* ============================================================
   PER-CARD: Stock Alignment Panel + Trade Rec Card
   ============================================================ */

.stock-alignment-toggle {
    padding: 8px 16px;
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    color: white; border: none; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(168,85,247,0.3);
}
.stock-alignment-toggle:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(168,85,247,0.4);
}
.stock-alignment-toggle:disabled { opacity: 0.5; cursor: not-allowed; }

.stock-alignment-panel {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border: 2px solid #6366f1; border-radius: 12px;
    margin-top: 14px; overflow: hidden;
    animation: alignPanelSlide 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes alignPanelSlide {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 800px; }
}

.align-panel-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; cursor: pointer;
    background: rgba(99,102,241,0.15); user-select: none;
}
.align-panel-header-left { display: flex; align-items: center; gap: 10px; }
.align-panel-title { font-size: 14px; font-weight: 700; color: #c7d2fe; }
.align-panel-chevron { font-size: 12px; color: #6366f1; transition: transform 0.25s; }
.align-panel-chevron.open { transform: rotate(180deg); }
.align-panel-body { padding: 16px; animation: corrAccFade 0.2s ease; }

/* Signal banner */
.align-signal-banner {
    padding: 10px 16px; border-radius: 8px; text-align: center;
    margin-bottom: 14px; font-size: 13px; font-weight: 600; color: white;
}

/* Score ring */
.align-score-ring { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 14px; }
.align-score-circle {
    width: 72px; height: 72px; border-radius: 50%; border: 4px solid;
    display: flex; align-items: center; justify-content: center; flex-direction: column;
}
.align-score-number { font-size: 22px; font-weight: 700; color: #e0e7ff; }
.align-score-sub { font-size: 9px; color: #6366f1; font-weight: 600; text-transform: uppercase; }
.align-score-details { display: flex; flex-direction: column; gap: 4px; }
.align-score-detail-row { font-size: 12px; color: #a5b4fc; }
.align-score-detail-row strong { color: #e0e7ff; }

/* Mini stats */
.align-mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.align-mini-stat {
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px; padding: 10px; text-align: center;
}
.align-mini-stat-label { font-size: 10px; color: #6366f1; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
.align-mini-stat-value { font-size: 16px; font-weight: 700; color: #e0e7ff; }

/* Per-commodity rows */
.align-comm-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; border-bottom: 1px solid rgba(99,102,241,0.15); font-size: 12px;
}
.align-comm-row:last-child { border-bottom: none; }
.align-comm-ticker { color: #a5b4fc; font-weight: 600; }

/* Stock sentiment mini-badge (new) */
.align-stock-sentiment {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    background: rgba(99,102,241,0.1); margin-bottom: 12px;
}
.align-stock-sentiment-badge {
    padding: 4px 12px; border-radius: 14px;
    font-size: 11px; font-weight: 700; color: white;
    text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;
}
.align-stock-sentiment-info { font-size: 11px; color: #a5b4fc; line-height: 1.4; }

/* Trade rec card inside per-card panel (new) */
.align-trade-rec-card {
    border-radius: 10px; padding: 14px;
    margin-bottom: 12px; border: 1px solid;
}
.align-trade-rec-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
}
.align-trade-rec-action {
    display: inline-block; padding: 5px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 700; color: white;
    text-transform: uppercase; letter-spacing: 0.8px;
}
.align-trade-rec-confidence {
    font-size: 11px; color: #6366f1; font-weight: 600;
}
.align-trade-rec-body { display: flex; flex-direction: column; gap: 8px; }
.align-trade-rec-row { font-size: 12px; color: #a5b4fc; line-height: 1.5; }
.align-trade-rec-row strong { color: #c7d2fe; }

/* Implications */
.align-implications {
    margin-top: 10px; padding: 10px 12px;
    background: rgba(99,102,241,0.1); border-radius: 8px;
    border-left: 3px solid #6366f1;
}
.align-implications p { margin: 4px 0 0; font-size: 12px; color: #a5b4fc; line-height: 1.5; }
.align-implications p:first-child { margin-top: 0; }

/* ── Responsive ── */
@media (max-width: 768px) {
    .corr-modal { max-height: 92vh; border-radius: 16px; }
    .corr-modal-header { padding: 18px 20px 14px; border-radius: 16px 16px 0 0; }
    .corr-modal-header h2 { font-size: 17px; }
    .corr-regime-banner { margin: 14px 20px 0; }
    .corr-sentiment-row { margin: 10px 20px 0; flex-direction: column; align-items: flex-start; }
    .corr-stats-row { padding: 14px 20px; grid-template-columns: repeat(2, 1fr); }
    .corr-accordion { margin: 0 20px 8px; }
    .corr-modal-footer { padding: 12px 20px 16px; }
    .trade-recs-table th, .trade-recs-table td { padding: 7px 5px; font-size: 11px; }
}
`;


const chartStyles = `
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}
`;

const aiOverlayStyles = `
.ai-overlay-container {
    position: absolute;
    top: 60px;
    right: 15px;
    background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
    padding: 20px;
    border-radius: 16px;
    max-width: 350px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    border: 3px solid #8b5cf6;
    z-index: 10;
    max-height: 500px;
    overflow-y: auto;
}

.ai-overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
}

.ai-overlay-title {
    font-size: 15px;
    font-weight: 700;
    color: #6d28d9;
    display: flex;
    align-items: center;
    gap: 8px;
}

.ai-overlay-close {
    background: #f3f4f6;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 18px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.ai-overlay-close:hover {
    background: #e5e7eb;
    color: #1f2937;
}

.ai-overlay-content {
    font-size: 13px;
    color: #1f2937;
    line-height: 1.7;
    white-space: pre-wrap;
}

.ai-voice-controls {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px solid #e5e7eb;
}

.ai-voice-btn {
    flex: 1;
    padding: 8px 12px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.ai-voice-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.ai-voice-btn.stop {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.ai-voice-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

@media (max-width: 768px) {
    .ai-overlay-container {
        position: relative;
        top: 0;
        right: 0;
        max-width: 100%;
        margin-top: 10px;
    }
}
`;

const aiChatbotStyles = `
/* Chatbot Panel - Blue-Dark Theme */
.ai-chatbot-panel {
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: 450px;
    height: 600px; /* Reduced from 650px to fit settings */
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    z-index: 999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 2px solid #3b82f6;
    max-height: calc(100vh - 140px);
}

/* Header - Blue Theme */
.ai-chatbot-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    flex-shrink: 0;
}

.ai-chatbot-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
}

.ai-chatbot-close {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.ai-chatbot-close:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* Settings Section - Compact Blue-Dark */
.ai-chatbot-settings {
    background: #1e293b;
    padding: 12px 16px;
    border-bottom: 1px solid #334155;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
}

.ai-setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ai-setting-label {
    fontSize: '12px',
    fontWeight: 600,
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
}

.ai-setting-checkbox {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent-color: #3b82f6;
}

.ai-voice-select {
    width: 100%;
    padding: 6px 8px;
    borderRadius: 6px;
    border: 1px solid #334155;
    fontSize: 11px;
    background: #0f172a;
    color: #cbd5e1;
}

.ai-voice-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.ai-stop-btn {
    padding: 4px 10px;
    background: #ef4444;
    color: white;
    border: none;
    borderRadius: 6px;
    fontSize: 10px;
    fontWeight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.ai-chart-badge {
    fontSize: 10px;
    color: #10b981;
    fontWeight: 600;
    background: rgba(16, 185, 129, 0.15);
    padding: 3px 8px;
    borderRadius: 6px;
    border: 1px solid #10b981;
}

/* Messages Container - LARGER */
.ai-chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: linear-gradient(to bottom, #0f172a 0%, #1e293b 100%);
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    max-height: 100%;
    overflow-anchor: none;
}

/* Message Bubbles - Blue-Dark Theme */
.ai-message {
    padding: 12px 16px;
    border-radius: 16px;
    max-width: 75%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.6;
    font-size: 13px;
    white-space: pre-wrap;
    position: relative;
    animation: messageSlideIn 0.3s ease-out;
}

.ai-message.user {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    margin-left: auto;
    align-self: flex-end;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    border-bottom-right-radius: 4px;
}

.ai-message.assistant {
    margin-right: auto;
    align-self: flex-start;
    background: #1e293b;
    border: 2px solid #334155;
    color: #e2e8f0;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: 4px;
}

/* Welcome Message - Blue-Dark */
.ai-welcome-message {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    padding: 16px;
    border-radius: 16px;
    border: 2px solid #3b82f6;
    max-width: 90%;
    align-self: flex-start;
    line-height: 1.6;
    color: #dbeafe;
    font-size: 13px;
    position: relative;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Loading - Blue Theme */
.ai-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #3b82f6;
    font-weight: 600;
    padding: 12px 16px;
    background: #1e293b;
    border-radius: 16px;
    border: 2px solid #334155;
    max-width: 70%;
    align-self: flex-start;
    box-shadow: 0 2px 12px rgba(59, 130, 246, 0.15);
    border-bottom-left-radius: 4px;
}

.ai-loading-spinner {
    width: 18px;
    height: 18px;
    border: 3px solid #334155;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Image Preview - Dark Border */
.ai-image-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 12px;
    margin-bottom: 12px;
    object-fit: contain;
    display: block;
    border: 2px solid #334155;
}

/* Input Container - Blue-Dark */
.ai-chatbot-input-container {
    padding: 16px 20px;
    background: #1e293b;
    border-top: 1px solid #334155;
    display: flex;
    gap: 10px;
    align-items: center;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}

.ai-chatbot-input {
    flex: 1;
    padding: 12px 14px;
    border: 2px solid #334155;
    border-radius: 12px;
    font-size: 13px;
    transition: all 0.2s;
    background: #0f172a;
    color: #e2e8f0;
}

.ai-chatbot-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: #1e293b;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.ai-chatbot-input::placeholder {
    color: #64748b;
}

/* File Upload - Blue Theme */
.ai-file-upload-btn {
    padding: 12px;
    background: #1e293b;
    border: 2px solid #334155;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    min-width: 44px;
    height: 44px;
}

.ai-file-upload-btn:hover {
    background: #334155;
    border-color: #3b82f6;
    transform: translateY(-1px);
}

/* Send Button - Blue Theme */
.ai-chatbot-send {
    padding: 12px 24px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    min-width: 70px;
}

.ai-chatbot-send:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.ai-chatbot-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Scrollbar - Blue-Dark */
.ai-chatbot-messages::-webkit-scrollbar {
    width: 6px;
}

.ai-chatbot-messages::-webkit-scrollbar-track {
    background: transparent;
}

.ai-chatbot-messages::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 10px;
}

.ai-chatbot-messages::-webkit-scrollbar-thumb:hover {
    background: #475569;
}

/* Image Attached Indicator - Blue Theme */
.ai-image-attached {
    position: fixed;
    bottom: 730px;
    right: 50px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    animation: slideUp 0.3s ease-out;
    z-index: 1000;
}

.ai-image-remove {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.ai-image-remove:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .ai-chatbot-panel {
        width: calc(100vw - 40px);
        right: 20px;
        bottom: 20px;
        height: calc(100vh - 100px);
        max-height: calc(100vh - 100px);
    }
    
    .ai-image-attached {
        right: 30px;
        bottom: calc(100vh - 50px);
    }
}
`;

const meanReversionStyles = `
.mean-reversion-container {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #3b82f6;
}

.mean-reversion-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.mean-reversion-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
}

.mean-reversion-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
}

.regime-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    margin: 10px 0;
    text-align: center;
}

.mr-score-container {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    margin: 15px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mr-score-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
    font-weight: 600;
}

.mr-score-value {
    font-size: 48px;
    font-weight: 700;
    margin: 10px 0;
}

.mr-signals-list {
    background: white;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
}

.mr-signal-item {
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
    font-size: 13px;
    color: #1f2937;
}

.mr-signal-item:last-child {
    border-bottom: none;
}

.mr-targets-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 15px 0;
}

.mr-target-card {
    background: white;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #dbeafe;
}

.mr-target-label {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 6px;
    font-weight: 600;
    text-transform: uppercase;
}

.mr-target-value {
    font-size: 16px;
    font-weight: 700;
    color: #1e40af;
}

.sector-peers-chart-container {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #6366f1;
}

.sector-peers-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.sector-peers-title {
    font-size: 16px;
    font-weight: 700;
    color: #4f46e5;
}

.chart-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.chart-control-btn {
    padding: 6px 12px;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #1f2937;
}

.chart-control-btn:hover {
    border-color: #4f46e5;
    background: #eff6ff;
}

.chart-control-btn.active {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
}

.ai-overlay-container {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.95);
    padding: 15px;
    border-radius: 12px;
    max-width: 300px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 2px solid #8b5cf6;
    z-index: 10;
}

.ai-overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.ai-overlay-title {
    font-size: 13px;
    font-weight: 700;
    color: #6d28d9;
}

.ai-overlay-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    width: 24px;
    height: 24px;
}

.ai-overlay-content {
    font-size: 12px;
    color: #1f2937;
    line-height: 1.6;
    max-height: 200px;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .mean-reversion-container {
        padding: 15px;
    }
    
    .mr-targets-grid {
        grid-template-columns: 1fr;
    }
    
    .sector-peers-chart-container {
        padding: 15px;
    }
    
    .chart-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .chart-control-btn {
        width: 100%;
    }
    
    .ai-overlay-container {
        position: relative;
        top: 0;
        right: 0;
        max-width: 100%;
        margin-top: 10px;
    }
}
`;

const elasticityStyles = `
.elasticity-analysis-container {
    background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #ec4899;
}

.elasticity-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.elasticity-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
}

.elasticity-title {
    font-size: 18px;
    font-weight: 700;
    color: #831843;
}

.elasticity-signal-banner {
    background: white;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    margin: 15px 0;
    font-size: 13px;
    line-height: 1.4;
}

.elasticity-signal-banner.strong {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: 2px solid #047857;
}

.elasticity-signal-banner.moderate {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
    border: 2px solid #d97706;
}

.elasticity-signal-banner.weak {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    color: white;
    border: 2px solid #dc2626;
}

.elasticity-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin: 15px 0;
}

.elasticity-metric-card {
    background: white;
    padding: 16px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.elasticity-metric-card.overall {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
    border: 2px solid #ec4899;
}

.elasticity-metric-card.bullish {
    border: 2px solid #10b981;
}

.elasticity-metric-card.bearish {
    border: 2px solid #ef4444;
}

.elasticity-metric-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 8px;
}

.elasticity-metric-value {
    font-size: 28px;
    font-weight: 700;
    color: #831843;
    margin: 8px 0;
}

.elasticity-metric-value.bullish {
    color: #059669;
}

.elasticity-metric-value.bearish {
    color: #dc2626;
}

.elasticity-metric-sublabel {
    font-size: 11px;
    color: #831843;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.elasticity-metric-detail {
    font-size: 11px;
    color: #6b7280;
    margin-top: 4px;
}

.elasticity-interpretation {
    background: white;
    padding: 16px;
    border-radius: 10px;
    margin-top: 15px;
}

.interpretation-title {
    font-size: 14px;
    font-weight: 700;
    color: #831843;
    margin-bottom: 10px;
}

.interpretation-content {
    font-size: 13px;
    color: #1f2937;
    line-height: 1.6;
}

.interpretation-content p {
    margin: 0;
}

@media (max-width: 768px) {
    .elasticity-metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .elasticity-metric-card.overall {
        grid-column: 1;
    }
}
`;

const monteCarloStyles = `

.monte-carlo-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}

.monte-carlo-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
}

.monte-carlo-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.monte-carlo-results {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 16px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #f59e0b;
}

.monte-carlo-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.monte-carlo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
}

.monte-carlo-title {
    font-size: 16px;
    font-weight: 700;
    color: #92400e;
}

.monte-carlo-probabilities {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.probability-card {
    background: white;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.probability-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
    font-weight: 600;
}

.probability-value {
    font-size: 24px;
    font-weight: 700;
}

.probability-value.bullish {
    color: #059669;
}

.probability-value.bearish {
    color: #dc2626;
}

.monte-carlo-signal {
    background: white;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
}

.monte-carlo-signal.bullish {
    color: #059669;
    border: 2px solid #059669;
}

.monte-carlo-signal.bearish {
    color: #dc2626;
    border: 2px solid #dc2626;
}

.monte-carlo-signal.neutral {
    color: #6b7280;
    border: 2px solid #9ca3af;
}

.monte-carlo-timestamp {
    font-size: 11px;
    color: #92400e;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
}
`;

const styles = `
${monteCarloStyles}
${elasticityStyles}
${chartStyles}
${meanReversionStyles}
${aiOverlayStyles}
${aiChatbotStyles}
.retracement-analysis-container {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #10b981;
}

.retracement-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.retracement-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
}

.retracement-title {
    font-size: 18px;
    font-weight: 700;
    color: #065f46;
}

.entry-zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
    margin: 15px 0;
}

.entry-zone-card {
    background: white;
    padding: 12px 8px;
    border-radius: 10px;
    text-align: center;
    border: 2px solid #d1fae5;
}

.entry-zone-card.aggressive {
    border-color: #10b981;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.entry-zone-card.optimal {
    border-color: #059669;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.entry-zone-card.conservative {
    border-color: #047857;
    background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
}

.entry-zone-label {
    font-size: 10px;
    color: #065f46;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 6px;
    white-space: nowrap;
}

.entry-zone-price {
    font-size: 16px;
    font-weight: 700;
    color: #047857;
    word-break: break-all;
}

.entry-signal-banner {
    background: white;
    padding: 12px;
    border-radius: 10px;
    text-align: center;
    margin: 15px 0;
    border: 2px solid #10b981;
    font-size: 13px;
    line-height: 1.4;
}

.entry-signal-banner.excellent {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-color: #047857;
}

.entry-signal-banner.good {
    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    color: white;
    border-color: #059669;
}

.entry-signal-banner.fair {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
    border-color: #d97706;
}

.entry-signal-banner.poor {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    color: white;
    border-color: #dc2626;
}

.retracement-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    margin-top: 15px;
}

.retracement-stat-item {
    background: white;
    padding: 10px 8px;
    border-radius: 8px;
    font-size: 12px;
}

.retracement-stat-label {
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
    font-size: 11px;
}

.retracement-stat-value {
    color: #047857;
    font-weight: 700;
    font-size: 14px;
    word-break: break-all;
}

.calculate-retracement-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.calculate-retracement-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
}

.calculate-retracement-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .retracement-analysis-container {
        padding: 15px;
    }
    
    .retracement-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .entry-zones-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .entry-zone-card {
        padding: 12px;
    }
    
    .entry-zone-price {
        font-size: 18px;
    }
    
    .entry-signal-banner {
        font-size: 12px;
        padding: 10px;
    }
    
    .retracement-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
}

.ai-chatbot-orb {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #60a5fa, #2563eb, #1e40af);
    box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5), 0 0 60px rgba(37, 99, 235, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex; /* Keep this */
    align-items: center;
    justify-content: center;
    animation: pulse 2s infinite;
}

.ai-chatbot-orb:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 48px rgba(37, 99, 235, 0.6), 0 0 80px rgba(37, 99, 235, 0.4);
}

.ai-chatbot-orb svg {
    width: 35px;
    height: 35px;
    fill: white;
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 8px 32px rgba(37, 99, 235, 0.5), 0 0 60px rgba(37, 99, 235, 0.3);
    }
    50% {
        box-shadow: 0 8px 32px rgba(37, 99, 235, 0.7), 0 0 80px rgba(37, 99, 235, 0.5);
    }
}

/* Wider, better proportioned chat panel */
.ai-chatbot-panel {
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: 450px;
    height: 650px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
    z-index: 999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    max-height: calc(100vh - 140px); /* Add this to prevent overflow */
}

/* Better header styling */
.ai-chatbot-header {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.2);
}

.ai-chatbot-header h3 {
    margin: 0;
    font-size: 19px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
}

.ai-chatbot-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.ai-chatbot-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Messages container - prevent overflow on mount */
.ai-chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0; /* Keep this */
    max-height: 100%; /* Keep this */
    overflow-anchor: none; /* Add this to prevent scroll jumping */
}

/* Message bubbles - more compact */
.ai-message {
    padding: 12px 16px;
    border-radius: 16px;
    max-width: 70%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    line-height: 1.5;
    font-size: 14px;
    white-space: pre-wrap;
    position: relative;
    animation: messageSlideIn 0.3s ease-out;
    /* Remove width: fit-content */
    /* Remove display: block if you added it */
}

.ai-message.user {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    margin-left: auto;
    align-self: flex-end;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
    border-bottom-right-radius: 4px;
    padding: 12px 16px; /* Increased from 10px 14px for better spacing */
    max-width: 70%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    height: auto; /* Your fix - lets content dictate height */
    line-height: 1.5; /* Comfortable line spacing */
}

/* Assistant messages */
.ai-message.assistant {
    margin-right: auto;
    align-self: flex-start;
    background: white;
    border: 2px solid #e5e7eb;
    color: #1f2937;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border-bottom-left-radius: 4px;
    padding: 12px 16px;
}

/* Welcome message - more compact */
.ai-welcome-message {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    padding: 16px;  /* Reduced from 20px */
    border-radius: 16px;  /* Reduced from 18px */
    border: 2px solid #3b82f6;
    max-width: 90%;  /* Increased from 85% to use space better */
    align-self: flex-start;
    line-height: 1.5;  /* Reduced from 1.65 */
    color: #1e40af;
    font-size: 14px;  /* Reduced from 14.5px */
    position: relative;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

/* Loading indicator - more compact */
.ai-loading {
    display: flex;
    align-items: center;
    gap: 12px;  /* Reduced from 14px */
    color: #2563eb;
    font-weight: 600;
    padding: 10px 14px;  /* Reduced from 16px 20px */
    background: white;
    border-radius: 16px;
    border: 2px solid #dbeafe;
    max-width: 70%;
    align-self: flex-start;
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.1);
    border-bottom-left-radius: 4px;
}

.ai-loading-spinner {
    width: 18px;  /* Reduced from 22px */
    height: 18px;
    border: 3px solid #dbeafe;
    border-top: 3px solid #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}


@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}


.ai-message.assistant::before {
    content: '🎯';
    position: absolute;
    left: -32px;
    top: 0;
    font-size: 20px;
}

/* Better image preview in messages */
.ai-image-preview {
    max-width: 100%;
    max-height: 220px;
    border-radius: 12px;
    margin-bottom: 14px;
    object-fit: contain;
    display: block;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Input container with better layout */
.ai-chatbot-input-container {
    padding: 20px;
    background: white;
    border-top: 2px solid #e5e7eb;
    display: flex;
    gap: 12px;
    align-items: center;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
}

/* Input field styling */
.ai-chatbot-input {
    flex: 1;
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.2s;
    background: #f9fafb;
    color: #1f2937;
}

.ai-chatbot-input:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.ai-chatbot-input::placeholder {
    color: #9ca3af;
}

/* File upload button redesign */
.ai-file-upload-btn {
    padding: 14px;
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    min-width: 48px;
    height: 48px;
}

.ai-file-upload-btn:hover {
    background: #e5e7eb;
    border-color: #2563eb;
    transform: translateY(-1px);
}

.ai-file-upload-btn input[type="file"] {
    display: none;
}

/* Send button styling */
.ai-chatbot-send {
    padding: 14px 28px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    min-width: 80px;
}

.ai-chatbot-send:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.ai-chatbot-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Image attached indicator */
.ai-image-attached {
    position: fixed;
    bottom: 790px;
    right: 50px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    animation: slideUp 0.3s ease-out;
    z-index: 1000;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-image-remove {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.ai-image-remove:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* Welcome message styling */
.ai-welcome-message {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    padding: 20px;
    border-radius: 18px;
    border: 2px solid #3b82f6;
    max-width: 85%;
    align-self: flex-start;
    line-height: 1.65;
    color: #1e40af;
    font-size: 14.5px;
    position: relative;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.ai-welcome-message::before {
    content: '🎯';
    position: absolute;
    left: -32px;
    top: 0;
    font-size: 20px;
}

/* Better scrollbar */
.ai-chatbot-messages::-webkit-scrollbar {
    width: 6px;
}

.ai-chatbot-messages::-webkit-scrollbar-track {
    background: transparent;
}

.ai-chatbot-messages::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.ai-chatbot-messages::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.ai-analysis-container {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    padding: 20px;
    border-radius: 12px;
    margin-top: 15px;
    border: 2px solid #2563eb;
}

.ai-analysis-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.ai-analysis-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
}

.ai-analysis-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
}

.ai-analysis-content {
    color: #1f2937;
    line-height: 1.8;
    font-size: 14px;
}

.ai-analysis-section {
    margin-bottom: 15px;
}

.ai-analysis-section-title {
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 8px;
    font-size: 15px;
}

.ai-sentiment-positive {
    color: #059669;
    font-weight: 700;
}

.ai-sentiment-negative {
    color: #dc2626;
    font-weight: 700;
}

.ai-sentiment-neutral {
    color: #6b7280;
    font-weight: 700;
}

.analyze-asset-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
}

.analyze-asset-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
}

.analyze-asset-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 768px) {

    .ai-chatbot-panel {
        width: calc(100vw - 40px);
        right: 20px;
        bottom: 20px; /* Changed from 100px */
        height: calc(100vh - 100px); /* Make it fill more of the screen */
        max-height: calc(100vh - 100px);
    }
    
    .ai-chatbot-orb {
        width: 60px;
        height: 60px;
        bottom: 20px;
        right: 20px;
    }
    
    .ai-message {
        max-width: 80%;
    }
    
    .ai-message.assistant::before {
        display: none;
    }
    
    .ai-welcome-message::before {
        display: none;
    }
    
    .ai-image-attached {
        right: 20px;
        bottom: 670px;
    }
}

.mss-wrapper {
    padding: 20px;
    background: #f0f4ff;
    min-height: 100vh;
}

.mss-header {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.mss-header h1 {
    margin: 0 0 10px 0;
    font-size: 32px;
    font-weight: 700;
}

.mss-header p {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.95;
}

.mss-controls {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
}

.control-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: flex-end;
}

.control-group {
    flex: 1;
    min-width: 200px;
}

.control-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #1e40af;
    font-size: 14px;
}

.control-group select,
.control-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #dbeafe;
    border-radius: 10px;
    font-size: 14px;
    transition: all 0.2s;
    background: white;
    color: #1f2937;
}

.control-group select:focus,
.control-group input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.mss-calculate-btn {
    padding: 14px 36px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.mss-calculate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.mss-calculate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.mss-loading {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
    border: 4px solid #dbeafe;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.mss-loading p {
    color: #1e40af;
    font-size: 16px;
    font-weight: 500;
}

.mss-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.summary-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: transform 0.2s;
    border: 2px solid #dbeafe;
}

.summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.summary-card h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #1e40af;
    font-weight: 600;
}

.summary-card .big-number {
    font-size: 52px;
    font-weight: 700;
    margin: 10px 0;
}

.summary-card.stable .big-number {
    color: #2563eb;
}

.summary-card.choppy .big-number {
    color: #3b82f6;
}

.summary-card.volatile .big-number {
    color: #60a5fa;
}

.summary-card .label {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.search-filter-container {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
}

.search-box {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #dbeafe;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.2s;
    margin-bottom: 18px;
}

.search-box:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 12px 24px;
    border: 2px solid #dbeafe;
    background: white;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    color: #1e40af;
}

.filter-btn:hover {
    border-color: #2563eb;
    background: #eff6ff;
}

.filter-btn.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.category-filter {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.category-filter button {
    padding: 12px 24px;
    border: 2px solid #dbeafe;
    background: white;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    color: #1e40af;
}

.category-filter button:hover {
    border-color: #2563eb;
    background: #eff6ff;
}

.category-filter button.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.mss-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.mss-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;
    border: 2px solid #dbeafe;
}

.mss-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: #2563eb;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
}

.card-header-left {
    width: 100%;
}

.card-header h4 {
    margin: 0 0 8px 0;
    font-size: 22px;
    color: #1e40af;
    font-weight: 700;
}

.card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
}

.chart-link {
    padding: 8px 16px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.chart-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
}

.save-model-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.save-model-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
}

.save-model-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #9ca3af;
}

.save-model-btn.reactivate {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.deactivate-model-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
}

.deactivate-model-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
}

.delete-model-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(153, 27, 27, 0.3);
}

.delete-model-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(153, 27, 27, 0.4);
}

.mss-card .status {
    color: #2563eb;
    font-size: 14px;
    margin: 0 0 18px 0;
    font-weight: 600;
}

.card-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 2px solid #dbeafe;
}

.metric-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
    font-weight: 500;
}

.metric-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
}

.card-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: 8px 0;
}

.detail-item span:first-child {
    color: #6b7280;
    font-weight: 500;
}

.detail-item span:last-child {
    font-weight: 600;
    color: #1e40af;
}

.mss-empty {
    text-align: center;
    padding: 100px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
}

.mss-empty h3 {
    color: #1e40af;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 700;
}

.mss-empty p {
    color: #6b7280;
    font-size: 16px;
}

.trend-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 6px;
}

.trend-badge.uptrend {
    background: rgba(16, 185, 129, 0.2);
    color: #059669;
}

.trend-badge.downtrend {
background: rgba(239, 68, 68, 0.2);
color: #dc2626;
}
.trend-badge.ranging {
background: rgba(156, 163, 175, 0.2);
color: #6b7280;
}
.sector-name-badge {
display: inline-block;
padding: 6px 14px;
border-radius: 20px;
font-size: 12px;
font-weight: 700;
margin-top: 6px;
text-transform: uppercase;
letter-spacing: 0.5px;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.sector-Technology {
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
color: white;
}
.sector-Financial {
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
color: white;
}
.sector-Healthcare {
background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
color: white;
}
.sector-Consumer-Cyclical {
background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
color: white;
}
.sector-Consumer-Defensive {
background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
color: white;
}
.sector-Energy {
background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
color: white;
}
.sector-Industrials {
background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
color: white;
}
.sector-Communication {
background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
color: white;
}
.sector-Real-Estate {
background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
color: white;
}
.sector-Materials {
background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
color: white;
}
.sector-Utilities {
background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
color: white;
}
.sector-analysis-container {
background: white;
padding: 30px;
border-radius: 16px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
margin-bottom: 30px;
}
.sector-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 25px;
}
.sector-header h2 {
margin: 0;
font-size: 24px;
color: #1e40af;
font-weight: 700;
}
.sector-close-btn {
padding: 8px 16px;
background: #ef4444;
color: white;
border: none;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s;
}
.sector-close-btn:hover {
background: #dc2626;
}
.sector-toggle-btn {
padding: 8px 16px;
background: #8b5cf6;
color: white;
border: none;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s;
margin-left: 10px;
}
.sector-toggle-btn:hover {
background: #7c3aed;
}
.sector-filters {
display: flex;
gap: 10px;
flex-wrap: wrap;
margin-bottom: 25px;
}
.sector-filter-btn {
padding: 10px 20px;
border: 2px solid #dbeafe;
background: white;
border-radius: 10px;
font-weight: 600;
font-size: 13px;
cursor: pointer;
transition: all 0.2s;
color: #1e40af;
}
.sector-filter-btn:hover {
border-color: #2563eb;
background: #eff6ff;
}
.sector-filter-btn.active {
background: #2563eb;
color: white;
border-color: #2563eb;
}
.sector-chart-container {
background: #f8fafc;
padding: 20px;
border-radius: 12px;
margin-bottom: 20px;
}
.sector-chart-title {
font-size: 16px;
font-weight: 700;
color: #1e40af;
margin-bottom: 15px;
text-align: center;
}
.sector-charts-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 25px;
margin-bottom: 25px;
}
.sector-stats-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 15px;
margin-bottom: 25px;
}
.sector-stat-card {
background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
padding: 20px;
border-radius: 12px;
text-align: center;
}
.sector-stat-label {
font-size: 13px;
color: #6b7280;
margin-bottom: 8px;
font-weight: 500;
}
.sector-stat-value {
font-size: 28px;
font-weight: 700;
color: #1e40af;
}
.stock-comparison-container {
background: #f8fafc;
padding: 20px;
border-radius: 12px;
margin-top: 25px;
}
.stock-comparison-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}
.stock-comparison-header h3 {
margin: 0;
font-size: 20px;
color: #1e40af;
font-weight: 700;
}
.comparison-chart {
background: white;
padding: 15px;
border-radius: 10px;
height: 320px;
overflow: hidden;
}
.loading-comparison {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 200px;
background: white;
border-radius: 10px;
}
.loading-comparison .spinner {
width: 40px;
height: 40px;
border-width: 3px;
}
.loading-comparison p {
margin-top: 15px;
color: #1e40af;
font-weight: 600;
}
@media (max-width: 768px) {
.mss-wrapper {
padding: 10px;
}
.mss-grid {
grid-template-columns: 1fr;
}
.control-group {
min-width: 100%;
}
.card-metrics {
grid-template-columns: 1fr;
}
.sector-charts-grid {
grid-template-columns: 1fr;
}
.sector-chart-container {
padding: 15px;
}

}
`;


export default function MarketStabilityScore() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [loading, setLoading] = useState(false);
    const [mssData, setMssData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAssetClass, setSelectedAssetClass] = useState('forex');
    const [customSymbols, setCustomSymbols] = useState('');
    const [period, setPeriod] = useState(60);
    const [assetLists, setAssetLists] = useState(null);
    const [savingModels, setSavingModels] = useState({});
    const [savedModels, setSavedModels] = useState(new Set());
    const [activeModels, setActiveModels] = useState({});
    const [deactivatingModels, setDeactivatingModels] = useState({});
    const [deletingModels, setDeletingModels] = useState({});
    const [customPeriod, setCustomPeriod] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [modelStatusFilter, setModelStatusFilter] = useState('all');
    const [loadingVolume, setLoadingVolume] = useState(false);
    const [volumeFilter, setVolumeFilter] = useState('all');
    const [showSectorAnalysis, setShowSectorAnalysis] = useState(false);
    const [sectorData, setSectorData] = useState(null);
    const [loadingSectors, setLoadingSectors] = useState(false);
    