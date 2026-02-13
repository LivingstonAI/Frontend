import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



// ============================================================
// CSS — Trend Age Estimator
// ============================================================

const trendAgeStyles = `
/* Trend Age Button */
.trend-age-bulk-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(139,92,246,0.3);
}
.trend-age-bulk-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(139,92,246,0.4);
}
.trend-age-bulk-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.trend-age-card-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.trend-age-card-btn:hover:not(:disabled) {
    transform: translateY(-1px);
}

/* Modal */
.trend-age-modal {
    /* Reuse corr-modal styles */
}

/* Sorting Controls */
.trend-age-sort-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 14px 28px;
    background: rgba(139,92,246,0.08);
    border-bottom: 1px solid #334155;
}
.trend-age-sort-label {
    font-size: 12px;
    color: #8b5cf6;
    font-weight: 600;
    text-transform: uppercase;
}
.trend-age-sort-btn {
    padding: 6px 14px;
    background: #1e293b;
    border: 1px solid #475569;
    border-radius: 6px;
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.trend-age-sort-btn:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
}
.trend-age-sort-btn.active {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    border-color: #8b5cf6;
    color: white;
}

/* Trend Age Grid */
.trend-age-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    padding: 18px 28px;
}
.trend-age-card {
    background: #1e293b;
    border: 2px solid #334155;
    border-radius: 12px;
    padding: 14px 16px;
    transition: all 0.2s;
}
.trend-age-card:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
}
.trend-age-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.trend-age-symbol {
    font-size: 15px;
    font-weight: 700;
    color: #e2e8f0;
}
.trend-age-classification {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: white;
}
.trend-age-days {
    font-size: 28px;
    font-weight: 700;
    color: #a78bfa;
    margin-bottom: 4px;
}
.trend-age-days-label {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
}
.trend-age-description {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #334155;
}
.trend-age-r-values {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-top: 10px;
}
.trend-age-r-item {
    background: rgba(139,92,246,0.1);
    border-radius: 6px;
    padding: 6px;
    text-align: center;
}
.trend-age-r-label {
    font-size: 9px;
    color: #8b5cf6;
    font-weight: 600;
    text-transform: uppercase;
}
.trend-age-r-value {
    font-size: 13px;
    font-weight: 700;
    color: #c4b5fd;
    margin-top: 2px;
}

/* Per-Card Panel */
.trend-age-panel {
    background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    margin-top: 14px;
    overflow: hidden;
    animation: popPanelSlide 0.3s cubic-bezier(0.22,1,0.36,1);
}
.trend-age-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: rgba(139,92,246,0.15);
    user-select: none;
}
.trend-age-panel-title {
    font-size: 14px;
    font-weight: 700;
    color: #e9d5ff;
    display: flex;
    align-items: center;
    gap: 8px;
}
.trend-age-panel-chevron {
    font-size: 12px;
    color: #8b5cf6;
    transition: transform 0.25s;
}
.trend-age-panel-chevron.open {
    transform: rotate(180deg);
}
.trend-age-panel-body {
    padding: 16px;
    animation: corrAccFade 0.2s ease;
}

/* R² Progression Chart */
.r-squared-progression {
    background: rgba(139,92,246,0.08);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
}
.r-squared-prog-title {
    font-size: 11px;
    color: #8b5cf6;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 8px;
}
.r-squared-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 80px;
}
.r-squared-bar-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}
.r-squared-bar {
    width: 100%;
    background: linear-gradient(180deg, #8b5cf6 0%, #a78bfa 100%);
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
}
.r-squared-bar-label {
    font-size: 9px;
    color: #64748b;
    font-weight: 600;
}

/* Trend Info Grid */
.trend-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}
.trend-info-item {
    background: rgba(139,92,246,0.1);
    border-radius: 8px;
    padding: 10px 12px;
}
.trend-info-label {
    font-size: 10px;
    color: #8b5cf6;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.trend-info-value {
    font-size: 16px;
    font-weight: 700;
    color: #e9d5ff;
}

/* Responsive */
@media (max-width: 768px) {
    .trend-age-grid {
        grid-template-columns: 1fr;
    }
    .trend-age-sort-controls {
        flex-wrap: wrap;
    }
}
`;


// ============================================================
// CSS — Trade Execution Modal
// ============================================================

const tradeExecutionStyles = `
/* Trade Execution Button */
.trade-exec-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(59,130,246,0.3);
    display: flex;
    align-items: center;
    gap: 8px;
}
.trade-exec-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(59,130,246,0.4);
}
.trade-exec-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal Backdrop */
.trade-exec-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: fadeIn 0.2s ease;
}

/* Modal Container */
.trade-exec-modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Modal Header */
.trade-exec-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 2px solid #e5e7eb;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}
.trade-exec-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e3a8a;
    display: flex;
    align-items: center;
    gap: 10px;
}
.trade-exec-symbol {
    color: #3b82f6;
}
.trade-exec-close {
    background: transparent;
    border: none;
    color: #9ca3af;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.trade-exec-close:hover {
    color: #ef4444;
}

/* Modal Body */
.trade-exec-body {
    padding: 24px;
    background: white;
}

/* Form Group */
.trade-form-group {
    margin-bottom: 20px;
}
.trade-form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}
.trade-form-label.required::after {
    content: ' *';
    color: #ef4444;
}
.trade-form-input,
.trade-form-select,
.trade-form-textarea {
    width: 100%;
    padding: 12px 16px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #1e293b;
    font-size: 14px;
    transition: all 0.2s;
    font-family: inherit;
}
.trade-form-input:focus,
.trade-form-select:focus,
.trade-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
}
.trade-form-input::placeholder {
    color: #94a3b8;
}
.trade-form-textarea {
    resize: vertical;
    min-height: 80px;
}
.trade-form-helper {
    font-size: 11px;
    color: #64748b;
    margin-top: 4px;
}

/* Order Type Toggle */
.order-type-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
}
.order-type-btn {
    padding: 12px 20px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.order-type-btn:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}
.order-type-btn.active {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #10b981;
    color: white;
    box-shadow: 0 2px 8px rgba(16,185,129,0.3);
}
.order-type-btn.active.sell {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-color: #ef4444;
    box-shadow: 0 2px 8px rgba(239,68,68,0.3);
}

/* Error Display */
.trade-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    color: #991b1b;
    font-size: 13px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.trade-error-icon {
    color: #ef4444;
    font-size: 16px;
    flex-shrink: 0;
}

/* Success Display */
.trade-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    color: #166534;
    font-size: 13px;
}

/* Modal Footer */
.trade-exec-footer {
    padding: 20px 24px;
    border-top: 2px solid #e5e7eb;
    background: #f8fafc;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}
.trade-cancel-btn {
    padding: 12px 24px;
    background: white;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.trade-cancel-btn:hover {
    border-color: #94a3b8;
    background: #f8fafc;
}
.trade-submit-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(59,130,246,0.3);
}
.trade-submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}
.trade-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Two Column Grid for SL/TP */
.trade-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

/* Paper Trade Toggle */
.paper-trade-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 8px;
    margin-bottom: 20px;
}
.paper-trade-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #3b82f6;
}
.paper-trade-label {
    font-size: 13px;
    color: #1e40af;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 640px) {
    .trade-exec-modal {
        max-width: 100%;
        border-radius: 12px 12px 0 0;
        max-height: 95vh;
    }
    .trade-exec-header {
        padding: 16px 20px;
    }
    .trade-exec-title {
        font-size: 16px;
    }
    .trade-exec-body {
        padding: 20px;
    }
    .trade-exec-footer {
        padding: 16px 20px;
        flex-direction: column-reverse;
    }
    .trade-cancel-btn,
    .trade-submit-btn {
        width: 100%;
    }
    .trade-form-row {
        grid-template-columns: 1fr;
    }
}
`;

// ============================================================
// CSS — Asset of Interest + Stock Popularity
// ============================================================

const assetInterestStyles = `
/* ── Asset of Interest Button ── */
.asset-interest-btn {
    padding: 8px 16px;
    border: 2px solid #6b7280;
    background: transparent;
    color: #9ca3af;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
}
.asset-interest-btn:hover:not(:disabled) {
    border-color: #f59e0b;
    color: #f59e0b;
    transform: translateY(-1px);
}
.asset-interest-btn.saved {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
    color: white;
}
.asset-interest-btn.saved:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}
.asset-interest-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Filter button for showing only saved assets */
.show-saved-assets-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}
.show-saved-assets-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(245,158,11,0.4);
}
.show-saved-assets-btn.active {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #10b981;
}

/* ── Stock Popularity Analyzer ── */
.stock-popularity-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 6px rgba(139,92,246,0.3);
}
.stock-popularity-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(139,92,246,0.4);
}
.stock-popularity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.stock-popularity-panel {
    background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    margin-top: 14px;
    overflow: hidden;
    animation: popPanelSlide 0.3s cubic-bezier(0.22,1,0.36,1);
}
@keyframes popPanelSlide {
    from { opacity: 0; max-height: 0; }
    to   { opacity: 1; max-height: 800px; }
}

.stock-popularity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: rgba(139,92,246,0.15);
    user-select: none;
}
.stock-popularity-title {
    font-size: 14px;
    font-weight: 700;
    color: #e9d5ff;
    display: flex;
    align-items: center;
    gap: 8px;
}
.stock-popularity-chevron {
    font-size: 12px;
    color: #8b5cf6;
    transition: transform 0.25s;
}
.stock-popularity-chevron.open {
    transform: rotate(180deg);
}

.stock-popularity-body {
    padding: 16px;
    animation: corrAccFade 0.2s ease;
}

/* Popularity Score Ring */
.popularity-score-ring {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;
}
.popularity-circle {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 6px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0,0,0,0.3);
}
.popularity-number {
    font-size: 32px;
    font-weight: 700;
    color: #e9d5ff;
}
.popularity-level {
    font-size: 11px;
    color: #c4b5fd;
    text-align: center;
    margin-top: 4px;
    max-width: 140px;
}

/* Dimensions Grid */
.popularity-dimensions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
}
.popularity-dimension {
    background: rgba(139,92,246,0.12);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 8px;
    padding: 10px 12px;
}
.popularity-dim-label {
    font-size: 10px;
    color: #8b5cf6;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.popularity-dim-score {
    font-size: 20px;
    font-weight: 700;
    color: #e9d5ff;
}
.popularity-dim-bar {
    height: 4px;
    background: rgba(139,92,246,0.3);
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
}
.popularity-dim-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
}

/* Recognition Factors */
.popularity-factors {
    background: rgba(139,92,246,0.08);
    border-left: 3px solid #8b5cf6;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
}
.popularity-factors-title {
    font-size: 11px;
    color: #8b5cf6;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 8px;
}
.popularity-factors-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.popularity-factor-item {
    font-size: 12px;
    color: #c4b5fd;
    line-height: 1.5;
    padding-left: 16px;
    position: relative;
}
.popularity-factor-item::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #8b5cf6;
    font-weight: 700;
}

/* Trading Implications */
.popularity-implications {
    background: rgba(139,92,246,0.08);
    border-radius: 8px;
    padding: 12px 16px;
}
.popularity-impl-title {
    font-size: 11px;
    color: #8b5cf6;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
}
.popularity-impl-text {
    font-size: 12px;
    color: #c4b5fd;
    line-height: 1.6;
}

/* Company Info Row */
.popularity-company-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(139,92,246,0.1);
    border-radius: 8px;
    margin-bottom: 14px;
    font-size: 11px;
    color: #a78bfa;
}
.popularity-company-info strong {
    color: #e9d5ff;
}

/* Responsive */
@media (max-width: 768px) {
    .popularity-dimensions {
        grid-template-columns: repeat(2, 1fr);
    }
    .popularity-score-ring {
        flex-direction: column;
    }
}
`;

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
    
    /* Fix top/bottom performers on mobile */
    .corr-accordion-body > div[style*="grid-template-columns: 1fr 1fr"] {
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
    }
    
    /* Stack sector selector buttons */
    .sector-selector-group {
        gap: 6px;
    }
    .sector-select-btn {
        font-size: 12px;
        padding: 8px 14px;
    }
    
    /* Modal header responsive */
    .corr-modal-header h2 {
        font-size: 16px;
    }
    
    /* Trade opp metrics responsive */
    .trade-opp-metrics {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}

@media (max-width: 480px) {
    .sector-health-dashboard {
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
    // const [selectedSector, setSelectedSector] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [stockVsSectorData, setStockVsSectorData] = useState(null);
    const [loadingStockComparison, setLoadingStockComparison] = useState(false);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [analyzingAsset, setAnalyzingAsset] = useState({});
    const [assetAnalysis, setAssetAnalysis] = useState({});
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotEnabled, setChatbotEnabled] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatImage, setChatImage] = useState(null);
    const [showOrb, setShowOrb] = useState(true); // Add this new state
    const [monteCarloLoading, setMonteCarloLoading] = useState({});
    const [monteCarloResults, setMonteCarloResults] = useState({});
    const messagesEndRef = useRef(null);
    const [rSquaredFilter, setRSquaredFilter] = useState('all'); // 'all', 'high', 'medium', 'low'
    const [batchUpdating, setBatchUpdating] = useState(false);
    const [loadingElasticity, setLoadingElasticity] = useState({});
    const [elasticityData, setElasticityData] = useState({});
    // Add states
    const [adrData, setAdrData] = useState({});
    const [loadingADR, setLoadingADR] = useState({});
    const [loadingAllADR, setLoadingAllADR] = useState(false);

    // Add states
    const [targetPriceInput, setTargetPriceInput] = useState({});
    const [priceTargetData, setPriceTargetData] = useState({});
    const [loadingPriceTarget, setLoadingPriceTarget] = useState({});

    // Add these states at the top with your other states
    const [chartData, setChartData] = useState({});
    const [loadingCharts, setLoadingCharts] = useState({});
    const [showChart, setShowChart] = useState({});
    const [loadingAllCharts, setLoadingAllCharts] = useState(false);
    const [tvLoaded, setTvLoaded] = useState(false);
        // Add these new states
    const [chartTimeframes, setChartTimeframes] = useState({}); // Track timeframe per symbol
    const [fullscreenChart, setFullscreenChart] = useState(null); // Which chart is fullscreen

        // Mean Reversion Analysis States
    const [meanReversionData, setMeanReversionData] = useState({});
    const [loadingMeanReversion, setLoadingMeanReversion] = useState({});
    const [loadingAllMeanReversion, setLoadingAllMeanReversion] = useState(false);

    // Sector Peers Comparison States
    const [sectorPeersData, setSectorPeersData] = useState({});
    const [loadingSectorPeers, setLoadingSectorPeers] = useState({});
    const [showSectorPeersChart, setShowSectorPeersChart] = useState({});
    
    // Chart Auto-Refresh States
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState({});
    const [refreshingChart, setRefreshingChart] = useState({});
    
    // Chart AI Analysis Overlay State
    const [showAIOverlay, setShowAIOverlay] = useState({});

    const [commodityVsMaterialsData, setCommodityVsMaterialsData] = useState(null);
    const [loadingCommodityVsMaterials, setLoadingCommodityVsMaterials] = useState(false);
    const [showCommodityModal, setShowCommodityModal] = useState(false);

    const [sp500VsTechData, setSp500VsTechData] = useState(null);
    const [loadingSp500VsTech, setLoadingSp500VsTech] = useState(false);
    const [showSp500Modal, setShowSp500Modal] = useState(false);

    const [stockAlignmentData, setStockAlignmentData] = useState({});
    const [loadingStockAlignment, setLoadingStockAlignment] = useState({});
    const [showAlignmentPanel, setShowAlignmentPanel] = useState({});

    const [modalAccordions, setModalAccordions] = useState({
        chart: true, insights: true, tradeRecs: true, breakdown: false
    });

    // Trade recs filter + expand state (per modal)
    const [tradeRecFilter, setTradeRecFilter] = useState('ALL');         // ALL | BUY | SELL | HOLD | ...
    const [expandedTradeRec, setExpandedTradeRec] = useState(null);

    const [techSubsectorData, setTechSubsectorData] = useState(null);
    const [loadingTechSubsector, setLoadingTechSubsector] = useState(false);
    const [showTechSubsectorModal, setShowTechSubsectorModal] = useState(false);

    const [techPeerData, setTechPeerData] = useState({});             // { symbol: data }
    const [loadingTechPeer, setLoadingTechPeer] = useState({});       // { symbol: bool }
    const [showTechPeerPanel, setShowTechPeerPanel] = useState({});   // { symbol: bool }

    // Subsector modal accordion state
    const [subsectorAccordions, setSubsectorAccordions] = useState({
        rotation: true,
        tradeRecs: true,
        subsectors: true,
    });

    const [instRetailData, setInstRetailData] = useState({});           // { symbol: data }
    const [loadingInstRetail, setLoadingInstRetail] = useState({});     // { symbol: bool }
    const [showInstRetailPanel, setShowInstRetailPanel] = useState({}); // { symbol: bool }

    // ============================================================
    // STATE ADDITIONS
    // ============================================================

    const [trendAgeData, setTrendAgeData] = useState(null);
    const [loadingTrendAge, setLoadingTrendAge] = useState(false);
    const [showTrendAgeModal, setShowTrendAgeModal] = useState(false);
    const [trendAgeSortBy, setTrendAgeSortBy] = useState('shortest'); // shortest, longest, newest, established

    const [trendAgePanelData, setTrendAgePanelData] = useState({});     // { symbol: data }
    const [loadingTrendAgePanel, setLoadingTrendAgePanel] = useState({}); // { symbol: bool }
    const [showTrendAgePanel, setShowTrendAgePanel] = useState({});      // { symbol: bool }


    // ============================================================
    // FUNCTIONS
    // ============================================================

    const fetchTrendAgeBulk = async (symbols) => {
        setLoadingTrendAge(true);
        try {
            const res = await fetch(`${baseUrl}/api/mss-trend-age-estimator-bulk/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols })
            });
            const data = await res.json();
            if (data.success) {
                setTrendAgeData(data);
                setShowTrendAgeModal(true);
            } else alert(`Error: ${data.error}`);
        } catch (e) {
            console.error(e);
            alert('Failed to fetch trend age analysis.');
        } finally {
            setLoadingTrendAge(false);
        }
    };

    const fetchTrendAgeSingle = async (symbol) => {
        setLoadingTrendAgePanel(prev => ({ ...prev, [symbol]: true }));
        try {
            const res = await fetch(`${baseUrl}/api/mss-trend-age-estimator-single/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol })
            });
            const data = await res.json();
            if (data.success) {
                setTrendAgePanelData(prev => ({ ...prev, [symbol]: data }));
                setShowTrendAgePanel(prev => ({ ...prev, [symbol]: true }));
            } else alert(`Error: ${data.error}`);
        } catch (e) {
            console.error(e);
            alert('Failed to fetch trend age analysis.');
        } finally {
            setLoadingTrendAgePanel(prev => ({ ...prev, [symbol]: false }));
        }
    };

    const sortTrendAgeResults = (results, sortBy) => {
        const sorted = [...results];
        switch (sortBy) {
            case 'shortest':
                sorted.sort((a, b) => a.trend_age_days - b.trend_age_days);
                break;
            case 'longest':
                sorted.sort((a, b) => b.trend_age_days - a.trend_age_days);
                break;
            case 'newest':
                sorted.sort((a, b) => {
                    const aIsNew = ['NEW', 'EMERGING'].includes(a.trend_classification);
                    const bIsNew = ['NEW', 'EMERGING'].includes(b.trend_classification);
                    if (aIsNew && !bIsNew) return -1;
                    if (!aIsNew && bIsNew) return 1;
                    return a.trend_age_days - b.trend_age_days;
                });
                break;
            case 'established':
                sorted.sort((a, b) => {
                    const aIsEst = ['ESTABLISHED', 'MATURE'].includes(a.trend_classification);
                    const bIsEst = ['ESTABLISHED', 'MATURE'].includes(b.trend_classification);
                    if (aIsEst && !bIsEst) return -1;
                    if (!aIsEst && bIsEst) return 1;
                    return b.trend_age_days - a.trend_age_days;
                });
                break;
            default:
                break;
        }
        return sorted;
    };


    // ============================================================
    // COMPONENT — TrendAgeModal
    // ============================================================

    const TrendAgeModal = ({ data, sortBy, onSortChange, onClose }) => {
        const sortedResults = sortTrendAgeResults(data.results, sortBy);
        
        return (
            <div className="corr-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="corr-modal trend-age-modal">
                {/* Header */}
                <div className="corr-modal-header">
                    <h2>📊 Trend Age Estimator</h2>
                    <button className="corr-modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Summary */}
                <div style={{ padding: '14px 28px', fontSize: '13px', color: '#94a3b8' }}>
                    Analyzed <strong style={{ color: '#e2e8f0' }}>{data.total_analyzed}</strong> assets across {data.timeframes_analyzed.join(', ')} day timeframes using R² comparison.
                </div>

                {/* Sort Controls */}
                <div className="trend-age-sort-controls">
                    <span className="trend-age-sort-label">Sort By:</span>
                    <button
                        className={`trend-age-sort-btn ${sortBy === 'shortest' ? 'active' : ''}`}
                        onClick={() => onSortChange('shortest')}
                    >
                        Shortest First
                    </button>
                    <button
                        className={`trend-age-sort-btn ${sortBy === 'longest' ? 'active' : ''}`}
                        onClick={() => onSortChange('longest')}
                    >
                        Longest First
                    </button>
                    <button
                        className={`trend-age-sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                        onClick={() => onSortChange('newest')}
                    >
                        New Trends
                    </button>
                    <button
                        className={`trend-age-sort-btn ${sortBy === 'established' ? 'active' : ''}`}
                        onClick={() => onSortChange('established')}
                    >
                        Established
                    </button>
                </div>

                {/* Grid */}
                <div className="trend-age-grid">
                    {sortedResults.map((result, i) => (
                        <div key={i} className="trend-age-card">
                            <div className="trend-age-card-header">
                                <div className="trend-age-symbol">{result.symbol}</div>
                                <div className="trend-age-classification" style={{ background: result.classification_color }}>
                                    {result.trend_classification}
                                </div>
                            </div>

                            <div className="trend-age-days">{result.trend_age_days}</div>
                            <div className="trend-age-days-label">Days Old (Estimated)</div>

                            <div className="trend-age-description">{result.description}</div>

                            {/* R² Values */}
                            <div className="trend-age-r-values">
                                {Object.entries(result.r_squared).map(([tf, val]) => (
                                    <div key={tf} className="trend-age-r-item">
                                        <div className="trend-age-r-label">{tf}</div>
                                        <div className="trend-age-r-value">{val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Trend Alignment */}
                            <div style={{ marginTop: '8px', fontSize: '11px', color: result.alignment_color, fontWeight: 600 }}>
                                {result.trend_alignment === 'ALIGNED' ? '✓' : '⚠'} {result.trend_alignment}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="corr-modal-footer">
                    {data.timestamp && new Date(data.timestamp).toLocaleString()}
                </div>
            </div>
            </div>
        );
    };


    // ============================================================
    // COMPONENT — TrendAgePanel
    // ============================================================

    const TrendAgePanel = ({ symbol, data, onToggle, isOpen }) => {
        const classification = data.classification || {};
        const progression = data.r_squared_progression || [];
        
        return (
            <div className="trend-age-panel">
                <div className="trend-age-panel-header" onClick={onToggle}>
                    <div className="trend-age-panel-title">
                        <span style={{ fontSize: '18px' }}>📊</span>
                        Trend Age — {symbol}
                    </div>
                    <span className={`trend-age-panel-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                    <div className="trend-age-panel-body">
                        {/* Classification */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: '#a78bfa' }}>
                                {classification.trend_age_days} days
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '16px',
                                background: classification.classification_color,
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 700,
                                marginTop: '8px'
                            }}>
                                {classification.trend_classification}
                            </div>
                            <div style={{ fontSize: '12px', color: '#c4b5fd', marginTop: '8px' }}>
                                {classification.description}
                            </div>
                        </div>

                        {/* R² Progression */}
                        {progression.length > 0 && (
                            <div className="r-squared-progression">
                                <div className="r-squared-prog-title">R² Across Timeframes</div>
                                <div className="r-squared-bars">
                                    {progression.map((item, i) => (
                                        <div key={i} className="r-squared-bar-wrap">
                                            <div
                                                className="r-squared-bar"
                                                style={{ height: `${item.r_squared * 100}%` }}
                                                title={`${item.timeframe}d: ${item.r_squared}`}
                                            />
                                            <div className="r-squared-bar-label">{item.timeframe}d</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trend Info */}
                        <div className="trend-info-grid">
                            <div className="trend-info-item">
                                <div className="trend-info-label">R² Gradient</div>
                                <div className="trend-info-value" style={{
                                    color: classification.r_gradient > 0 ? '#10b981' : '#ef4444'
                                }}>
                                    {classification.r_gradient > 0 ? '+' : ''}{classification.r_gradient}
                                </div>
                            </div>
                            <div className="trend-info-item">
                                <div className="trend-info-label">Alignment</div>
                                <div className="trend-info-value" style={{ color: classification.alignment_color }}>
                                    {classification.trend_alignment}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ============================================================
    // STATE ADDITIONS
    // ============================================================

    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeModalAsset, setTradeModalAsset] = useState(null);
    const [tradeFormData, setTradeFormData] = useState({
        order_type: 'BUY',
        entry_price: '',
        quantity: '1.0',
        stop_loss: '',
        take_profit: '',
        notes: '',
        is_paper_trade: true
    });
    const [tradeError, setTradeError] = useState(null);
    const [tradeSuccess, setTradeSuccess] = useState(null);
    const [submittingTrade, setSubmittingTrade] = useState(false);


    // ============================================================
    // FUNCTIONS
    // ============================================================

    const openTradeModal = (asset) => {
        setTradeModalAsset(asset);
        setTradeFormData({
            order_type: 'BUY',
            entry_price: asset.current_price || '',  // Pre-fill with current price if available
            quantity: '1.0',
            stop_loss: '',
            take_profit: '',
            notes: '',
            is_paper_trade: true
        });
        setTradeError(null);
        setTradeSuccess(null);
        setShowTradeModal(true);
    };

    const closeTradeModal = () => {
        setShowTradeModal(false);
        setTradeModalAsset(null);
        setTradeError(null);
        setTradeSuccess(null);
    };

    const handleTradeFormChange = (field, value) => {
        setTradeFormData(prev => ({ ...prev, [field]: value }));
        setTradeError(null);  // Clear error on input change
    };

    const submitTradeOrder = async () => {
        setSubmittingTrade(true);
        setTradeError(null);
        setTradeSuccess(null);
        
        try {
            const res = await fetch(`${baseUrl}/api/mss-execute-trade-order/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: tradeModalAsset.symbol,
                    asset_name: tradeModalAsset.name || tradeModalAsset.symbol,
                    asset_class: tradeModalAsset.asset_class || 'Stocks',
                    order_type: tradeFormData.order_type,
                    entry_price: tradeFormData.entry_price,
                    quantity: tradeFormData.quantity,
                    stop_loss: tradeFormData.stop_loss || null,
                    take_profit: tradeFormData.take_profit || null,
                    notes: tradeFormData.notes,
                    is_paper_trade: tradeFormData.is_paper_trade,
                    entry_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            });
            
            const data = await res.json();
            
            if (data.success) {
                setTradeSuccess(data.message);
                // Reset form after 2 seconds and close modal
                setTimeout(() => {
                    closeTradeModal();
                }, 2000);
            } else {
                setTradeError(data.error);
            }
        } catch (e) {
            console.error(e);
            setTradeError('Failed to execute trade. Please try again.');
        } finally {
            setSubmittingTrade(false);
        }
    };


    // ============================================================
    // COMPONENT — TradeExecutionModal
    // ============================================================

    const TradeExecutionModal = ({ asset, formData, onChange, onSubmit, onClose, error, success, submitting }) => {
        if (!asset) return null;
        
        return (
            <div className="trade-exec-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="trade-exec-modal">
                    {/* Header */}
                    <div className="trade-exec-header">
                        <div className="trade-exec-title">
                            <span>📊</span>
                            Execute Trade
                            <span className="trade-exec-symbol">{asset.symbol}</span>
                        </div>
                        <button className="trade-exec-close" onClick={onClose}>×</button>
                    </div>

                    {/* Body */}
                    <div className="trade-exec-body">
                        {/* Error Display */}
                        {error && (
                            <div className="trade-error">
                                <span className="trade-error-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Display */}
                        {success && (
                            <div className="trade-success">
                                ✅ {success}
                            </div>
                        )}

                        {/* Order Type */}
                        <div className="order-type-toggle">
                            <button
                                className={`order-type-btn ${formData.order_type === 'BUY' ? 'active' : ''}`}
                                onClick={() => onChange('order_type', 'BUY')}
                                disabled={submitting}
                            >
                                🟢 BUY
                            </button>
                            <button
                                className={`order-type-btn ${formData.order_type === 'SELL' ? 'active sell' : ''}`}
                                onClick={() => onChange('order_type', 'SELL')}
                                disabled={submitting}
                            >
                                🔴 SELL
                            </button>
                        </div>

                        {/* Entry Price */}
                        <div className="trade-form-group">
                            <label className="trade-form-label required">Entry Price</label>
                            <input
                                type="number"
                                step="any"
                                className="trade-form-input"
                                value={formData.entry_price}
                                onChange={(e) => onChange('entry_price', e.target.value)}
                                placeholder="0.00"
                                disabled={submitting}
                            />
                            <div className="trade-form-helper">Price at which the order will be executed</div>
                        </div>

                        {/* Quantity */}
                        <div className="trade-form-group">
                            <label className="trade-form-label">Quantity</label>
                            <input
                                type="number"
                                step="any"
                                className="trade-form-input"
                                value={formData.quantity}
                                onChange={(e) => onChange('quantity', e.target.value)}
                                placeholder="1.0"
                                disabled={submitting}
                            />
                            <div className="trade-form-helper">Number of units (shares, lots, contracts)</div>
                        </div>

                        {/* Stop Loss & Take Profit */}
                        <div className="trade-form-row">
                            <div className="trade-form-group">
                                <label className="trade-form-label">Stop Loss</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="trade-form-input"
                                    value={formData.stop_loss}
                                    onChange={(e) => onChange('stop_loss', e.target.value)}
                                    placeholder="Optional"
                                    disabled={submitting}
                                />
                                <div className="trade-form-helper">Exit if price reaches this level</div>
                            </div>

                            <div className="trade-form-group">
                                <label className="trade-form-label">Take Profit</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="trade-form-input"
                                    value={formData.take_profit}
                                    onChange={(e) => onChange('take_profit', e.target.value)}
                                    placeholder="Optional"
                                    disabled={submitting}
                                />
                                <div className="trade-form-helper">Exit if price reaches this level</div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="trade-form-group">
                            <label className="trade-form-label">Notes</label>
                            <textarea
                                className="trade-form-textarea"
                                value={formData.notes}
                                onChange={(e) => onChange('notes', e.target.value)}
                                placeholder="Trade rationale, setup details, etc..."
                                disabled={submitting}
                            />
                        </div>

                        {/* Paper Trade Toggle */}
                        <div className="paper-trade-toggle">
                            <input
                                type="checkbox"
                                className="paper-trade-checkbox"
                                checked={formData.is_paper_trade}
                                onChange={(e) => onChange('is_paper_trade', e.target.checked)}
                                disabled={submitting}
                            />
                            <label className="paper-trade-label">
                                📝 Paper Trade (Simulated)
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="trade-exec-footer">
                        <button className="trade-cancel-btn" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button
                            className="trade-submit-btn"
                            onClick={onSubmit}
                            disabled={submitting || !formData.entry_price}
                        >
                            {submitting ? '⏳ Executing...' : `Execute ${formData.order_type}`}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================
    // STATE ADDITIONS
    // ============================================================

    const [assetsSaved, setAssetsSaved] = useState({});          // { symbol: bool }
    const [loadingSaveAsset, setLoadingSaveAsset] = useState({}); // { symbol: bool }
    const [showingSavedOnly, setShowingSavedOnly] = useState(false);
    const [savedAssetSymbols, setSavedAssetSymbols] = useState([]);

    const [popularityData, setPopularityData] = useState({});           // { symbol: data }
    const [loadingPopularity, setLoadingPopularity] = useState({});     // { symbol: bool }
    const [showPopularityPanel, setShowPopularityPanel] = useState({}); // { symbol: bool }


    // ============================================================
    // FUNCTIONS — Assets of Interest
    // ============================================================

    const toggleAssetOfInterest = async (symbol, assetClass, sector) => {
        setLoadingSaveAsset(prev => ({ ...prev, [symbol]: true }));
        try {
            const res = await fetch(`${baseUrl}/api/mss-toggle-asset-of-interest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, asset_class: assetClass, sector })
            });
            const data = await res.json();
            if (data.success) {
                setAssetsSaved(prev => ({ ...prev, [symbol]: data.is_saved }));
                // Show toast notification (optional)
                console.log(data.message);
            } else alert(`Error: ${data.error}`);
        } catch (e) {
            console.error(e);
            alert('Failed to save asset.');
        } finally {
            setLoadingSaveAsset(prev => ({ ...prev, [symbol]: false }));
        }
    };

    const fetchTodaysSavedAssets = async (assetClass) => {
        try {
            const res = await fetch(`${baseUrl}/api/mss-get-todays-assets/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset_class: assetClass })
            });
            const data = await res.json();
            if (data.success) {
                setSavedAssetSymbols(data.symbols);
                // Update assetsSaved state
                const savedMap = {};
                data.symbols.forEach(sym => { savedMap[sym] = true; });
                setAssetsSaved(savedMap);
                return data.symbols;
            }
        } catch (e) {
            console.error(e);
        }
        return [];
    };

    const toggleShowSavedOnly = async () => {
        if (!showingSavedOnly) {
            // Fetch today's saved assets
            const currentAssetClass = 'stocks'; // Or get from your state
            await fetchTodaysSavedAssets(currentAssetClass);
            setShowingSavedOnly(true);
        } else {
            setShowingSavedOnly(false);
        }
    };


    // ============================================================
    // FUNCTIONS — Stock Popularity
    // ============================================================

    const fetchStockPopularity = async (symbol) => {
        setLoadingPopularity(prev => ({ ...prev, [symbol]: true }));
        try {
            const res = await fetch(`${baseUrl}/api/mss-stock-popularity-analyzer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol })
            });
            const data = await res.json();
            if (data.success) {
                setPopularityData(prev => ({ ...prev, [symbol]: data.analysis }));
                setShowPopularityPanel(prev => ({ ...prev, [symbol]: true }));
            } else alert(`Error: ${data.error}`);
        } catch (e) {
            console.error(e);
            alert('Failed to analyze stock popularity.');
        } finally {
            setLoadingPopularity(prev => ({ ...prev, [symbol]: false }));
        }
    };


    // ============================================================
    // COMPONENT — StockPopularityPanel
    // ============================================================

    const StockPopularityPanel = ({ symbol, data, onToggle, isOpen }) => {
        const scoreColor = data.popularity_score >= 70 ? '#10b981' : 
                        data.popularity_score >= 40 ? '#f59e0b' : '#ef4444';
        
        return (
            <div className="stock-popularity-panel">
                <div className="stock-popularity-header" onClick={onToggle}>
                    <div className="stock-popularity-title">
                        <span style={{ fontSize: '18px' }}>⭐</span>
                        Stock Popularity — {symbol}
                    </div>
                    <span className={`stock-popularity-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                    <div className="stock-popularity-body">
                        {/* Company Info */}
                        <div className="popularity-company-info">
                            <span><strong>{data.company_name}</strong></span>
                            <span>{data.sector} • {data.market_cap}</span>
                        </div>

                        {/* Score Ring */}
                        <div className="popularity-score-ring">
                            <div className="popularity-circle" style={{ borderColor: scoreColor }}>
                                <span className="popularity-number" style={{ color: scoreColor }}>{data.popularity_score}</span>
                                <span style={{ fontSize: '10px', color: '#a78bfa' }}>/ 100</span>
                            </div>
                            <div>
                                <div className="popularity-level" style={{ color: scoreColor, fontWeight: 700, fontSize: '13px' }}>
                                    {data.popularity_level}
                                </div>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="popularity-dimensions">
                            {[
                                { label: 'Brand Recognition', score: data.brand_recognition },
                                { label: 'Retail Awareness', score: data.retail_awareness },
                                { label: 'Media Coverage', score: data.media_coverage },
                                { label: 'Social Presence', score: data.social_presence },
                                { label: 'Institutional Coverage', score: data.institutional_coverage }
                            ].map((dim, i) => (
                                <div key={i} className="popularity-dimension">
                                    <div className="popularity-dim-label">{dim.label}</div>
                                    <div className="popularity-dim-score">{dim.score}/10</div>
                                    <div className="popularity-dim-bar">
                                        <div className="popularity-dim-fill" style={{ width: `${dim.score * 10}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recognition Factors */}
                        {data.recognition_factors && data.recognition_factors.length > 0 && (
                            <div className="popularity-factors">
                                <div className="popularity-factors-title">📌 Recognition Factors</div>
                                <div className="popularity-factors-list">
                                    {data.recognition_factors.map((factor, i) => (
                                        <div key={i} className="popularity-factor-item">{factor}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trading Implications */}
                        {data.trading_implications && (
                            <div className="popularity-implications">
                                <div className="popularity-impl-title">💡 Trading Implications</div>
                                <div className="popularity-impl-text">{data.trading_implications}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // ============================================================
// STATE ADDITIONS
// ============================================================

const [sectorDeepDiveData, setSectorDeepDiveData] = useState(null);
const [loadingSectorDive, setLoadingSectorDive] = useState(false);
const [showSectorDiveModal, setShowSectorDiveModal] = useState(false);
const [selectedSector, setSelectedSector] = useState(null);
const [sectorFilter, setSectorFilter] = useState(null);  // NEW: for filtering MSS cards

// Modal accordion state
const [sectorDiveAccordions, setSectorDiveAccordions] = useState({
    health: true,
    topBottom: true,
    drivers: true,
    opportunities: true,
    rotation: true,
    chart: true
});

// Available sectors (based on your SECTOR_MAPPINGS)
const AVAILABLE_SECTORS = [
    'Technology',
    'Financial',
    'Healthcare',
    'Consumer Cyclical',
    'Consumer Defensive',
    'Energy',
    'Industrials',
    'Communication',
    'Real Estate',
    'Materials',
    'Utilities'
];


// ============================================================
// FUNCTIONS
// ============================================================

const fetchSectorDeepDive = async (sector) => {
    setLoadingSectorDive(true);
    setSelectedSector(sector);
    setSectorFilter(sector);  // Set filter when fetching
    try {
        const res = await fetch(`${baseUrl}/api/mss-sector-deep-dive-analyzer/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sector, lookback_hours: 720 })
        });
        const data = await res.json();
        if (data.success) {
            setSectorDeepDiveData(data);
            setShowSectorDiveModal(true);
            setSectorDiveAccordions({
                health: true,
                topBottom: true,
                drivers: true,
                opportunities: true,
                rotation: true,
                chart: true
            });
        } else alert(`Error: ${data.error}`);
    } catch (e) {
        console.error(e);
        alert('Failed to fetch sector analysis.');
    } finally {
        setLoadingSectorDive(false);
    }
};

const toggleSectorDiveAccordion = (key) => {
    setSectorDiveAccordions(prev => ({ ...prev, [key]: !prev[key] }));
};


// ============================================================
// COMPONENT — SectorDeepDiveModal
// ============================================================

const SectorDeepDiveModal = ({ data, onClose }) => {
    return (
        <div className="corr-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="corr-modal sector-dive-modal">

            {/* Header */}
            <div className="corr-modal-header">
                <h2>🏢 {data.sector_name} Deep Dive (1h)</h2>
                <button className="corr-modal-close" onClick={onClose}>✕</button>
            </div>

            {/* Summary Stats */}
            <div style={{ padding: '18px 28px 0' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>
                    Analysed <strong style={{ color: '#e2e8f0' }}>{data.total_stocks}</strong> stocks in {data.sector_name}.
                    {data.insights && data.insights.length > 0 && (
                        <div style={{ marginTop: '8px', padding: '10px 14px', background: '#1e293b', borderRadius: '8px', borderLeft: '3px solid #0891b2' }}>
                            {data.insights.map((ins, i) => <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>{ins}</div>)}
                        </div>
                    )}
                </div>
            </div>

            {/* Health Dashboard */}
            <div className="corr-accordion" style={{ marginTop: '10px' }}>
                <button
                    className={`corr-accordion-trigger ${sectorDiveAccordions.health ? 'open' : ''}`}
                    onClick={() => toggleSectorDiveAccordion('health')}
                >
                    <span>💚 Sector Health Dashboard</span>
                    <span className="corr-acc-arrow">▼</span>
                </button>
                {sectorDiveAccordions.health && (
                    <div className="corr-accordion-body" style={{ padding: 0 }}>
                        <div className="sector-health-dashboard">
                            {/* Health Score */}
                            <div className="sector-health-card" style={{ borderColor: data.health_color }}>
                                <div className="sector-health-label">Health Score</div>
                                <div className="sector-health-value" style={{ color: data.health_color }}>{data.health_score}</div>
                                <div className="sector-health-sub">{data.health_label}</div>
                            </div>

                            {/* Return */}
                            <div className="sector-health-card">
                                <div className="sector-health-label">Sector Return</div>
                                <div className="sector-health-value" style={{ color: data.sector_return >= 0 ? '#10b981' : '#ef4444' }}>
                                    {data.sector_return >= 0 ? '+' : ''}{data.sector_return}%
                                </div>
                                <div className="sector-health-sub">on 1h</div>
                            </div>

                            {/* Breadth */}
                            <div className="sector-health-card">
                                <div className="sector-health-label">Breadth</div>
                                <div className="sector-health-value" style={{ color: data.breadth_pct >= 60 ? '#10b981' : data.breadth_pct >= 40 ? '#f59e0b' : '#ef4444' }}>
                                    {data.breadth_pct}%
                                </div>
                                <div className="sector-health-sub">stocks positive</div>
                            </div>

                            {/* Momentum */}
                            <div className="sector-health-card">
                                <div className="sector-health-label">Momentum</div>
                                <div className="sector-health-value" style={{ color: data.momentum_score >= 0 ? '#10b981' : '#ef4444' }}>
                                    {data.momentum_score >= 0 ? '+' : ''}{data.momentum_score}%
                                </div>
                                <div className="sector-health-sub">EMA slope</div>
                            </div>

                            {/* Volatility */}
                            <div className="sector-health-card">
                                <div className="sector-health-label">Volatility</div>
                                <div className="sector-health-value">{data.sector_volatility}%</div>
                                <div className="sector-health-sub">annualized</div>
                            </div>

                            {/* vs SPY */}
                            {data.spy_return !== null && (
                                <div className="sector-health-card" style={{ borderColor: data.vs_spy_color }}>
                                    <div className="sector-health-label">vs SPY</div>
                                    <div className="sector-health-value" style={{ color: data.vs_spy_color }}>
                                        {data.relative_strength >= 0 ? '+' : ''}{data.relative_strength}%
                                    </div>
                                    <div className="sector-health-sub">{data.vs_spy_label}</div>
                                </div>
                            )}

                            {/* Sentiment */}
                            <div className="sector-health-card">
                                <div className="sector-health-label">Sentiment</div>
                                <div className="sector-health-value" style={{
                                    color: data.sector_sentiment.label === 'BULLISH' ? '#10b981' :
                                           data.sector_sentiment.label === 'BEARISH' ? '#ef4444' : '#f59e0b',
                                    fontSize: '16px'
                                }}>
                                    {data.sector_sentiment.label}
                                </div>
                                <div className="sector-health-sub">Score: {data.sector_sentiment.score}/100</div>
                            </div>

                            {/* Concentration */}
                            <div className="sector-health-card">
                                <div className="concentration-gauge-wrap" style={{ padding: 0 }}>
                                    <div className="concentration-circle" style={{
                                        borderColor: data.concentration_pct > 60 ? '#ef4444' : data.concentration_pct > 40 ? '#f59e0b' : '#10b981',
                                        width: '80px',
                                        height: '80px'
                                    }}>
                                        <span className="concentration-number" style={{ fontSize: '20px' }}>{data.concentration_pct}%</span>
                                    </div>
                                    <div className="concentration-label">Top 5 Impact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Index Drivers */}
            {data.index_drivers && data.index_drivers.length > 0 && (
                <div className="corr-accordion">
                    <button
                        className={`corr-accordion-trigger ${sectorDiveAccordions.drivers ? 'open' : ''}`}
                        onClick={() => toggleSectorDiveAccordion('drivers')}
                    >
                        <span>⚡ Index Drivers (Top 10 by Impact)</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {sectorDiveAccordions.drivers && (
                        <div className="corr-accordion-body">
                            <div className="index-drivers-grid">
                                {data.index_drivers.map((d, i) => (
                                    <div key={i} className="driver-card" style={{
                                        color: d.contribution >= 0 ? '#10b981' : '#ef4444'
                                    }}>
                                        <div className="driver-symbol">{d.symbol}</div>
                                        <div className="driver-contrib">{d.contribution >= 0 ? '+' : ''}{d.contribution}%</div>
                                        <div className="driver-weight">Weight: {d.weight}% • Ret: {d.return >= 0 ? '+' : ''}{d.return}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Top & Bottom Performers */}
            <div className="corr-accordion">
                <button
                    className={`corr-accordion-trigger ${sectorDiveAccordions.topBottom ? 'open' : ''}`}
                    onClick={() => toggleSectorDiveAccordion('topBottom')}
                >
                    <span>🏆 Top 10 & Bottom 10 Performers</span>
                    <span className="corr-acc-arrow">▼</span>
                </button>
                {sectorDiveAccordions.topBottom && (
                    <div className="corr-accordion-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            {/* Top 10 */}
                            <div>
                                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, marginBottom: '8px' }}>TOP 10</div>
                                <table className="stock-perf-table">
                                    <thead>
                                        <tr>
                                            <th>Symbol</th>
                                            <th>Return</th>
                                            <th>Weight</th>
                                            <th>Corr</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.top_10.map((s, i) => (
                                            <tr key={i}>
                                                <td className="stock-symbol-cell">{s.symbol}</td>
                                                <td style={{ color: s.return >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                    {s.return >= 0 ? '+' : ''}{s.return}%
                                                </td>
                                                <td>{s.weight}%</td>
                                                <td>{s.correlation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom 10 */}
                            <div>
                                <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 700, marginBottom: '8px' }}>BOTTOM 10</div>
                                <table className="stock-perf-table">
                                    <thead>
                                        <tr>
                                            <th>Symbol</th>
                                            <th>Return</th>
                                            <th>Weight</th>
                                            <th>Corr</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.bottom_10.map((s, i) => (
                                            <tr key={i}>
                                                <td className="stock-symbol-cell">{s.symbol}</td>
                                                <td style={{ color: s.return >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                    {s.return >= 0 ? '+' : ''}{s.return}%
                                                </td>
                                                <td>{s.weight}%</td>
                                                <td>{s.correlation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Trade Opportunities */}
            {data.trade_opportunities && data.trade_opportunities.length > 0 && (
                <div className="corr-accordion">
                    <button
                        className={`corr-accordion-trigger ${sectorDiveAccordions.opportunities ? 'open' : ''}`}
                        onClick={() => toggleSectorDiveAccordion('opportunities')}
                    >
                        <span>💡 Trade Opportunities ({data.trade_opportunities.length})</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {sectorDiveAccordions.opportunities && (
                        <div className="corr-accordion-body">
                            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', padding: '8px 12px', background: 'rgba(8,145,178,0.08)', borderRadius: '6px', borderLeft: '3px solid #0891b2' }}>
                                📊 <strong>Methodology:</strong> Signals based on trend quality, regime detection (trending vs mean-reverting), trend elasticity, and institutional flow. Prioritizes clean trends with institutional backing over pure mean reversion.
                            </div>
                            <div className="trade-opp-grid">
                                {data.trade_opportunities.map((opp, i) => (
                                    <div key={i} className="trade-opp-card" style={{ borderLeftColor: opp.action_color }}>
                                        <div className="trade-opp-header">
                                            <div className="trade-opp-symbol">{opp.symbol}</div>
                                            <div className="trade-opp-action" style={{ background: opp.action_color }}>{opp.action}</div>
                                        </div>
                                        <div className="trade-opp-body">{opp.rationale}</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '8px', fontSize: '10px', color: '#64748b' }}>
                                            <div>Trend: <strong style={{ color: opp.trend_quality >= 0.6 ? '#10b981' : opp.trend_quality >= 0.4 ? '#f59e0b' : '#ef4444' }}>{opp.trend_quality}</strong></div>
                                            <div>Regime: <strong style={{ color: opp.is_trending ? '#10b981' : '#f59e0b' }}>{opp.is_trending ? 'Trending' : 'Mean-Rev'}</strong></div>
                                            <div>Beta: <strong style={{ color: opp.elasticity > 1.2 ? '#0891b2' : opp.elasticity < 0.8 ? '#6b7280' : '#94a3b8' }}>{opp.elasticity}x</strong></div>
                                            <div>Inst: <strong style={{ color: opp.inst_score >= 60 ? '#10b981' : opp.inst_score >= 40 ? '#f59e0b' : '#ef4444' }}>{opp.inst_score}/100</strong></div>
                                        </div>
                                        <div className="trade-opp-metrics">
                                            <span>Ret: <strong style={{ color: opp.return >= 0 ? '#10b981' : '#ef4444' }}>{opp.return >= 0 ? '+' : ''}{opp.return}%</strong></span>
                                            <span>Gap: <strong>{opp.gap_vs_sector >= 0 ? '+' : ''}{opp.gap_vs_sector}%</strong></span>
                                            <span>Corr: <strong>{opp.correlation}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Rotation Signals */}
            {data.rotation_signals && data.rotation_signals.length > 0 && (
                <div className="corr-accordion">
                    <button
                        className={`corr-accordion-trigger ${sectorDiveAccordions.rotation ? 'open' : ''}`}
                        onClick={() => toggleSectorDiveAccordion('rotation')}
                    >
                        <span>🔄 Rotation Signals ({data.rotation_signals.length})</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {sectorDiveAccordions.rotation && (
                        <div className="corr-accordion-body">
                            {data.rotation_signals.map((sig, i) => (
                                <div key={i} className="rotation-signal-item">
                                    <div className="rotation-signal-badge" style={{
                                        background: sig.signal.includes('ACCELERATING') ? '#10b981' :
                                                   sig.signal.includes('ROLLING') ? '#ef4444' :
                                                   sig.signal.includes('BOTTOM') ? '#f59e0b' : '#0891b2'
                                    }}>
                                        {sig.signal}
                                    </div>
                                    <div className="rotation-signal-text">{sig.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Chart */}
            {data.timeseries && (
                <div className="corr-accordion">
                    <button
                        className={`corr-accordion-trigger ${sectorDiveAccordions.chart ? 'open' : ''}`}
                        onClick={() => toggleSectorDiveAccordion('chart')}
                    >
                        <span>📈 Sector vs SPY (1h)</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {sectorDiveAccordions.chart && (
                        <div className="corr-accordion-body">
                            <div className="corr-chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.timeseries} margin={{ top: 8, right: 12, left: -10, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
                                        <YAxis stroke="#475569" tick={{ fontSize: 9 }} domain={['auto','auto']} />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        <Line type="monotone" dataKey="sector" stroke="#0891b2" strokeWidth={2} dot={false} name={data.sector_name} />
                                        {data.spy_return !== null && (
                                            <Line type="monotone" dataKey="spy" stroke="#f59e0b" strokeWidth={2} dot={false} name="SPY" />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="corr-modal-footer">
                Timeframe: 1h • {data.timestamp && new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
    );
};    

    const fetchInstRetailAnalysis = async (symbol) => {
        setLoadingInstRetail(prev => ({ ...prev, [symbol]: true }));
        try {
            const res = await fetch(`${baseUrl}/api/mss-institutional-vs-retail-analyzer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, lookback_hours: 720 })
            });
            const data = await res.json();
            if (data.success) {
                setInstRetailData(prev => ({ ...prev, [symbol]: data }));
                setShowInstRetailPanel(prev => ({ ...prev, [symbol]: true }));
            } else alert(`Error: ${data.error}`);
        } catch (e) {
            console.error(e);
            alert('Failed to fetch institutional vs retail analysis.');
        } finally {
            setLoadingInstRetail(prev => ({ ...prev, [symbol]: false }));
        }
    };


    // ============================================================
    // COMPONENT — InstRetailPanel
    // Shows institutional vs retail scoring with signal breakdown
    // ============================================================

    const InstRetailPanel = ({ symbol, data, onToggle, isOpen }) => {
        const instScore = data.institutional_score || 0;
        const retailScore = data.retail_score || 0;
        
        // Gauge colors (gradient based on score)
        const instColor = instScore >= 70 ? '#10b981' : instScore >= 50 ? '#f59e0b' : '#ef4444';
        const retailColor = retailScore >= 70 ? '#ef4444' : retailScore >= 50 ? '#f59e0b' : '#10b981';
        
        // Signal breakdown sorted by score (highest first)
        const signals = data.signal_breakdown ? Object.entries(data.signal_breakdown).map(([key, val]) => ({
            name: key.replace('_', ' ').toUpperCase(),
            ...val
        })).sort((a, b) => b.score - a.score) : [];
        
        return (
            <div className="inst-retail-panel">
                {/* Header */}
                <div className="inst-retail-header" onClick={onToggle}>
                    <div className="inst-retail-title">
                        <span style={{ fontSize: '18px' }}>🏛️</span>
                        Institutional vs Retail — {symbol}
                    </div>
                    <span className={`inst-retail-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                    <div className="inst-retail-body">

                        {/* Reliability Banner */}
                        <div className="inst-reliability-banner" style={{
                            background: data.reliability_color + '22',
                            borderColor: data.reliability_color
                        }}>
                            {data.reliability === 'HIGH' && '🎯 '}
                            {data.reliability === 'MODERATE' && '⚖️ '}
                            {data.reliability === 'LOW' && '⚠️ '}
                            <strong>{data.reliability} RELIABILITY</strong> — {data.interpretation?.split('.')[0]}.
                        </div>

                        {/* Score Gauges */}
                        <div className="inst-score-gauges">
                            <div className="inst-gauge">
                                <div className="inst-gauge-circle" style={{ borderColor: instColor }}>
                                    <span className="inst-gauge-number" style={{ color: instColor }}>{instScore}</span>
                                    <span style={{ fontSize: '10px', color: '#a78bfa' }}>%</span>
                                </div>
                                <div className="inst-gauge-label">Institutional</div>
                                <div className="inst-gauge-sublabel">
                                    {instScore >= 70 ? 'Dominant' : instScore >= 50 ? 'Present' : 'Limited'}
                                </div>
                            </div>
                            <div className="inst-gauge">
                                <div className="inst-gauge-circle" style={{ borderColor: retailColor }}>
                                    <span className="inst-gauge-number" style={{ color: retailColor }}>{retailScore}</span>
                                    <span style={{ fontSize: '10px', color: '#a78bfa' }}>%</span>
                                </div>
                                <div className="inst-gauge-label">Retail</div>
                                <div className="inst-gauge-sublabel">
                                    {retailScore >= 70 ? 'Dominant' : retailScore >= 50 ? 'Present' : 'Limited'}
                                </div>
                            </div>
                        </div>

                        {/* Confidence Row */}
                        <div className="inst-confidence-row">
                            <span className="inst-confidence-badge" style={{ background: data.confidence_color }}>
                                {data.confidence} CONFIDENCE
                            </span>
                            <span className="inst-confidence-text">
                                Signal agreement: {data.confidence === 'High' ? 'Strong' : data.confidence === 'Medium' ? 'Moderate' : 'Weak'}
                            </span>
                        </div>

                        {/* Interpretation */}
                        <div className="inst-interpretation">
                            <div className="inst-interpretation-text">
                                {data.interpretation}
                            </div>
                        </div>

                        {/* Signal Breakdown */}
                        {signals.length > 0 && (
                            <div className="inst-signal-breakdown">
                                <div className="inst-signal-breakdown-title">📊 Signal Breakdown (1h)</div>
                                <div className="inst-signal-grid">
                                    {signals.map((sig, i) => (
                                        <div key={i} className="inst-signal-card">
                                            <div className="inst-signal-name">{sig.name}</div>
                                            <div className="inst-signal-score" style={{
                                                color: sig.score >= 70 ? '#10b981' : sig.score >= 50 ? '#f59e0b' : '#ef4444'
                                            }}>
                                                {sig.score}
                                            </div>
                                            <div className="inst-signal-interp">{sig.interpretation}</div>
                                            <div style={{ fontSize: '8px', color: '#6b21a8', marginTop: '2px' }}>
                                                Weight: {(sig.weight * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trading Implications */}
                        {data.implications && data.implications.length > 0 && (
                            <div className="inst-implications">
                                <div className="inst-implications-title">💡 Trading Implications</div>
                                <div className="inst-implications-list">
                                    {data.implications.map((imp, i) => (
                                        <div key={i} className="inst-implication-item">{imp}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Footer */}
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            background: 'rgba(124,58,237,0.08)',
                            borderRadius: '6px',
                            fontSize: '10px',
                            color: '#6b21a8',
                            textAlign: 'center'
                        }}>
                            Analysis Period: {data.analysis_period} • Timeframe: {data.timeframe}
                            {data.institutional_trend && ` • Trend: ${data.institutional_trend}`}
                        </div>
                    </div>
                )}
            </div>
        );
    };


    // ============================================================
// FUNCTIONS
// ============================================================

const fetchTechSubsectorAnalysis = async () => {
    setLoadingTechSubsector(true);
    try {
        const res = await fetch(`${baseUrl}/api/mss-tech-subsector-bulk-analyzer/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lookback_hours: 720 })
        });
        const data = await res.json();
        if (data.success) {
            setTechSubsectorData(data);
            setShowTechSubsectorModal(true);
            setSubsectorAccordions({ rotation: true, tradeRecs: true, subsectors: true });
        } else alert(`Error: ${data.error}`);
    } catch (e) {
        console.error(e);
        alert('Failed to fetch Tech subsector analysis.');
    } finally {
        setLoadingTechSubsector(false);
    }
};

const fetchTechPeerAlignment = async (symbol) => {
    setLoadingTechPeer(prev => ({ ...prev, [symbol]: true }));
    try {
        const res = await fetch(`${baseUrl}/api/mss-tech-stock-subsector-alignment/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol, lookback_hours: 720 })
        });
        const data = await res.json();
        if (data.success) {
            setTechPeerData(prev => ({ ...prev, [symbol]: data }));
            setShowTechPeerPanel(prev => ({ ...prev, [symbol]: true }));
        } else alert(`Error: ${data.error}`);
    } catch (e) {
        console.error(e);
        alert('Failed to fetch peer comparison.');
    } finally {
        setLoadingTechPeer(prev => ({ ...prev, [symbol]: false }));
    }
};

const toggleSubsectorAccordion = (key) => {
    setSubsectorAccordions(prev => ({ ...prev, [key]: !prev[key] }));
};


// ============================================================
// COMPONENT — TechSubsectorModal
// Shows all subsector stats, rotation signals, trade recs.
// ============================================================

    const TechSubsectorModal = ({ data, onClose }) => {
        const sortedStats = [...(data.subsector_stats || [])];

        return (
            <div className="corr-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="corr-modal tech-subsector-modal">

                {/* Header */}
                <div className="corr-modal-header">
                    <h2>💻 Technology Subsector Breakdown (1h)</h2>
                    <button className="corr-modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Summary Stats */}
                <div style={{ padding: '18px 28px 0' }}>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>
                        Analysed <strong style={{ color: '#e2e8f0' }}>{data.total_subsectors}</strong> subsectors on 1h timeframe.
                        {data.insights && data.insights.length > 0 && (
                            <div style={{ marginTop: '8px', padding: '10px 14px', background: '#1e293b', borderRadius: '8px', borderLeft: '3px solid #0891b2' }}>
                                {data.insights.map((ins, i) => <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>{ins}</div>)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rotation Signals */}
                {data.rotation_signals && data.rotation_signals.length > 0 && (
                    <div className="corr-accordion" style={{ marginTop: '10px' }}>
                        <button
                            className={`corr-accordion-trigger ${subsectorAccordions.rotation ? 'open' : ''}`}
                            onClick={() => toggleSubsectorAccordion('rotation')}
                        >
                            <span>🔄 Rotation Signals ({data.rotation_signals.length})</span>
                            <span className="corr-acc-arrow">▼</span>
                        </button>
                        {subsectorAccordions.rotation && (
                            <div className="corr-accordion-body">
                                <div className="rotation-signals-panel" style={{ margin: 0 }}>
                                    {data.rotation_signals.map((sig, i) => (
                                        <div key={i} className="rotation-signal-row">
                                            <span className="rotation-signal-badge" style={{
                                                background: sig.signal === 'ACCELERATING' ? '#10b981' :
                                                        sig.signal === 'ROLLING OVER' ? '#ef4444' :
                                                        sig.signal === 'BOTTOMING' ? '#f59e0b' : '#6b7280'
                                            }}>
                                                {sig.signal}
                                            </span>
                                            <span className="rotation-signal-desc">{sig.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Trade Recommendations */}
                {data.trade_recommendations && data.trade_recommendations.length > 0 && (
                    <div className="corr-accordion">
                        <button
                            className={`corr-accordion-trigger ${subsectorAccordions.tradeRecs ? 'open' : ''}`}
                            onClick={() => toggleSubsectorAccordion('tradeRecs')}
                        >
                            <span>🎯 Subsector Trade Recommendations</span>
                            <span className="corr-acc-arrow">▼</span>
                        </button>
                        {subsectorAccordions.tradeRecs && (
                            <div className="corr-accordion-body">
                                <div className="subsector-trade-recs-grid">
                                    {data.trade_recommendations.map((rec, i) => (
                                        <div key={i} className="subsector-trade-card">
                                            <div className="subsector-trade-header">
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>{rec.subsector}</span>
                                                <span className="subsector-trade-action" style={{ background: rec.action_color }}>{rec.action}</span>
                                            </div>
                                            <div className="subsector-trade-body">
                                                {rec.rationale}
                                            </div>
                                            <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b', display: 'flex', gap: '12px' }}>
                                                <span>Return: <strong style={{ color: rec.return >= 0 ? '#10b981' : '#ef4444' }}>{rec.return >= 0 ? '+' : ''}{rec.return}%</strong></span>
                                                <span>Momentum: <strong style={{ color: rec.momentum >= 0 ? '#10b981' : '#ef4444' }}>{rec.momentum >= 0 ? '+' : ''}{rec.momentum}%</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Subsector Stats Grid */}
                <div className="corr-accordion">
                    <button
                        className={`corr-accordion-trigger ${subsectorAccordions.subsectors ? 'open' : ''}`}
                        onClick={() => toggleSubsectorAccordion('subsectors')}
                    >
                        <span>📊 All Subsectors ({sortedStats.length})</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {subsectorAccordions.subsectors && (
                        <div className="corr-accordion-body" style={{ padding: 0 }}>
                            <div className="subsector-stats-grid">
                                {sortedStats.map((s, i) => (
                                    <div key={i} className="subsector-card">
                                        <div className="subsector-card-header">
                                            <div className="subsector-name">{s.subsector}</div>
                                            <div className="subsector-rank-badge">#{s.rank}</div>
                                        </div>
                                        <div className="subsector-metrics">
                                            <div>
                                                <div className="subsector-metric-label">Return</div>
                                                <div className="subsector-metric-value" style={{ color: s.return >= 0 ? '#10b981' : '#ef4444' }}>
                                                    {s.return >= 0 ? '+' : ''}{s.return}%
                                                </div>
                                            </div>
                                            <div>
                                                <div className="subsector-metric-label">Volatility</div>
                                                <div className="subsector-metric-value">{s.volatility}%</div>
                                            </div>
                                            <div>
                                                <div className="subsector-metric-label">Momentum</div>
                                                <div className="subsector-metric-value" style={{ color: s.momentum_score >= 0 ? '#10b981' : '#ef4444' }}>
                                                    {s.momentum_score >= 0 ? '+' : ''}{s.momentum_score}%
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <span className="subsector-sentiment-pill" style={{
                                                background: s.sentiment_label === 'BULLISH' ? '#10b981' :
                                                        s.sentiment_label === 'BEARISH' ? '#ef4444' : '#f59e0b'
                                            }}>
                                                {s.sentiment_label}
                                            </span>
                                            <span style={{ fontSize: '10px', color: '#64748b' }}>
                                                Score: {s.sentiment_score} • {s.sentiment_confidence}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                                            {s.stocks_count} stocks • {s.relative_strength}
                                        </div>
                                        {s.characteristics && (
                                            <div className="subsector-drivers">{s.characteristics}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chart (Top 3 Subsectors) */}
                {data.timeseries && data.top3_subsectors && (
                    <div className="corr-accordion">
                        <button
                            className={`corr-accordion-trigger ${subsectorAccordions.chart ? 'open' : ''}`}
                            onClick={() => toggleSubsectorAccordion('chart')}
                        >
                            <span>📈 Top 3 Subsectors Chart</span>
                            <span className="corr-acc-arrow">▼</span>
                        </button>
                        {subsectorAccordions.chart && (
                            <div className="corr-accordion-body">
                                <div className="corr-chart-wrap">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.timeseries} margin={{ top: 8, right: 12, left: -10, bottom: 4 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
                                            <YAxis stroke="#475569" tick={{ fontSize: 9 }} domain={['auto','auto']} />
                                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
                                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                                            {data.top3_subsectors.map((sub, i) => (
                                                <Line key={sub} type="monotone" dataKey={sub} stroke={['#10b981','#3b82f6','#f59e0b'][i]} strokeWidth={2} dot={false} />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="corr-modal-footer">
                    Timeframe: 1h • {data.timestamp && new Date(data.timestamp).toLocaleString()}
                </div>
            </div>
            </div>
        );
    };


    // ============================================================
    // COMPONENT — TechPeerPanel (per-card for Tech stocks)
    // Shows how a Tech stock performs vs its subsector peers.
    // ============================================================

    const TechPeerPanel = ({ symbol, data, onToggle, isOpen }) => {
        const scoreColor = data.alignment_score >= 65 ? '#10b981' : data.alignment_score >= 35 ? '#f59e0b' : '#ef4444';
        const rec = data.trade_recommendation || {};

        const recBg = rec.action === 'BUY'  ? 'rgba(16,185,129,0.08)' :
                    rec.action === 'SELL' ? 'rgba(239,68,68,0.08)' :
                    rec.action === 'HOLD' ? 'rgba(59,130,246,0.08)' :
                    rec.action === 'TRIM' ? 'rgba(245,158,11,0.08)' :
                    'rgba(107,114,128,0.08)';
        const recBorder = rec.action_color || '#0891b2';

        return (
            <div className="tech-peer-panel">
                {/* Header */}
                <div className="tech-peer-header" onClick={onToggle}>
                    <div className="tech-peer-title">
                        <span style={{ fontSize: '18px' }}>💻</span>
                        Peer Comparison — {symbol}
                        <span className="tech-peer-subsector-badge">{data.subsector}</span>
                    </div>
                    <span className={`tech-peer-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </div>

                {isOpen && (
                    <div className="tech-peer-body">

                        {/* Signal Banner */}
                        <div className="tech-peer-signal-banner" style={{ background: data.signal_color }}>
                            {data.signal === 'OUTPERFORMING PEERS' && '🚀 '}
                            {data.signal === 'UNDERPERFORMING PEERS' && '📉 '}
                            {data.signal === 'ALIGNED WITH PEERS' && '✅ '}
                            <strong>{data.signal}</strong> — {data.signal_description}
                        </div>

                        {/* Subsector Sentiment */}
                        {data.subsector_sentiment && (
                            <div className="tech-peer-sentiment">
                                <div className="tech-peer-sentiment-badge" style={{ background: data.subsector_sentiment.color }}>
                                    {data.subsector_sentiment.label}
                                </div>
                                <div className="tech-peer-sentiment-info">
                                    <strong style={{ color: '#cffafe' }}>Score: {data.subsector_sentiment.score}/100</strong>
                                    &nbsp;• Confidence: {data.subsector_sentiment.confidence} • {data.subsector} 1h
                                    <br/>{data.subsector_sentiment.description}
                                </div>
                            </div>
                        )}

                        {/* Trade Rec Card */}
                        {rec.action && (
                            <div className="tech-peer-trade-card" style={{ background: recBg, borderColor: recBorder }}>
                                <div className="tech-peer-trade-header">
                                    <span className="tech-peer-trade-action" style={{ background: rec.action_color }}>{rec.action}</span>
                                    <span style={{ fontSize: '11px', color: '#0891b2', fontWeight: 600 }}>
                                        Confidence: {rec.sector_confidence}
                                    </span>
                                </div>
                                <div className="tech-peer-trade-body">
                                    <div className="tech-peer-trade-row"><strong>📋 Why:</strong> {rec.rationale}</div>
                                    <div className="tech-peer-trade-row"><strong>📍 Entry:</strong> {rec.entry}</div>
                                    <div className="tech-peer-trade-row"><strong>⚖️ Risk/Reward:</strong> {rec.risk_reward}</div>
                                </div>
                            </div>
                        )}

                        {/* Score Ring */}
                        <div className="tech-peer-score-ring">
                            <div className="tech-peer-score-circle" style={{ borderColor: scoreColor }}>
                                <span className="tech-peer-score-number" style={{ color: scoreColor }}>{data.alignment_score}</span>
                                <span className="tech-peer-score-sub">Peer Fit</span>
                            </div>
                            <div className="tech-peer-score-details">
                                <div className="tech-peer-score-detail-row">Corr: <strong style={{ color: scoreColor }}>{data.correlation}</strong></div>
                                <div className="tech-peer-score-detail-row">Beta: <strong style={{ color: '#a5f3fc' }}>{data.beta}</strong></div>
                                <div className="tech-peer-score-detail-row">Gap: <strong style={{ color: data.return_gap >= 0 ? '#10b981' : '#ef4444' }}>{data.return_gap >= 0 ? '+' : ''}{data.return_gap}%</strong></div>
                            </div>
                        </div>

                        {/* Mini Stats */}
                        <div className="tech-peer-mini-stats">
                            <div className="tech-peer-mini-stat">
                                <div className="tech-peer-mini-stat-label">Expected</div>
                                <div className="tech-peer-mini-stat-value" style={{ color: data.expected_return >= 0 ? '#10b981' : '#ef4444' }}>
                                    {data.expected_return >= 0 ? '+' : ''}{data.expected_return}%
                                </div>
                            </div>
                            <div className="tech-peer-mini-stat">
                                <div className="tech-peer-mini-stat-label">Actual</div>
                                <div className="tech-peer-mini-stat-value" style={{ color: data.actual_return >= 0 ? '#10b981' : '#ef4444' }}>
                                    {data.actual_return >= 0 ? '+' : ''}{data.actual_return}%
                                </div>
                            </div>
                            <div className="tech-peer-mini-stat">
                                <div className="tech-peer-mini-stat-label">Peer Index</div>
                                <div className="tech-peer-mini-stat-value" style={{ color: data.peer_index_return >= 0 ? '#10b981' : '#ef4444' }}>
                                    {data.peer_index_return >= 0 ? '+' : ''}{data.peer_index_return}%
                                </div>
                            </div>
                            <div className="tech-peer-mini-stat">
                                <div className="tech-peer-mini-stat-label">Alignment</div>
                                <div className="tech-peer-mini-stat-value" style={{ color: scoreColor }}>{data.alignment_score}/100</div>
                            </div>
                        </div>

                        {/* Top Peers */}
                        {data.top_peers && data.top_peers.length > 0 && (
                            <div className="tech-peer-table">
                                <div className="tech-peer-table-header">Top {data.subsector} Peers (1h)</div>
                                {data.top_peers.map((peer, i) => (
                                    <div key={i} className="tech-peer-row">
                                        <span className="tech-peer-symbol">{peer.symbol}</span>
                                        <span style={{ display: 'flex', gap: '14px' }}>
                                            <span className="tech-peer-return" style={{ color: peer.return >= 0 ? '#10b981' : '#ef4444' }}>
                                                {peer.return >= 0 ? '+' : ''}{peer.return}%
                                            </span>
                                            <span style={{ fontSize: '11px', color: peer.vs_target >= 0 ? '#10b981' : '#ef4444' }}>
                                                ({peer.vs_target >= 0 ? '+' : ''}{peer.vs_target}% vs you)
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Subsector Drivers */}
                        {rec.key_drivers && rec.key_drivers.length > 0 && (
                            <div className="tech-peer-drivers">
                                <div className="tech-peer-drivers-label">🔑 {data.subsector} Key Drivers</div>
                                <div className="tech-peer-drivers-list">
                                    {rec.key_drivers.join(' • ')}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };
    
    // ============================================================
    // NEW FUNCTIONS — Fetch correlation analysis data
    // ============================================================

    const fetchCommodityVsMaterials = async () => {
        setLoadingCommodityVsMaterials(true);
        try {
            const response = await fetch(`${baseUrl}/api/mss-commodity-vs-materials-analyzer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lookback_days: 60 })
            });
            const data = await response.json();
            if (data.success) {
                setCommodityVsMaterialsData(data);
                setShowCommodityModal(true);
                setModalAccordions({ chart: true, insights: true, breakdown: false });
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching commodity vs materials:', error);
            alert('Failed to fetch analysis. Please try again.');
        } finally {
            setLoadingCommodityVsMaterials(false);
        }
    };

    const fetchSp500VsTech = async () => {
        setLoadingSp500VsTech(true);
        try {
            const response = await fetch(`${baseUrl}/api/mss-sp500-vs-tech-sector-analyzer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lookback_days: 60 })
            });
            const data = await response.json();
            if (data.success) {
                setSp500VsTechData(data);
                setShowSp500Modal(true);
                setModalAccordions({ chart: true, insights: true, contributors: false });
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching S&P vs Tech:', error);
            alert('Failed to fetch analysis. Please try again.');
        } finally {
            setLoadingSp500VsTech(false);
        }
    };

    const fetchStockCommodityAlignment = async (symbol) => {
        setLoadingStockAlignment(prev => ({ ...prev, [symbol]: true }));
        try {
            const response = await fetch(`${baseUrl}/api/mss-individual-stock-commodity-alignment/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, lookback_days: 60 })
            });
            const data = await response.json();
            if (data.success) {
                setStockAlignmentData(prev => ({ ...prev, [symbol]: data }));
                setShowAlignmentPanel(prev => ({ ...prev, [symbol]: true }));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching stock alignment:', error);
            alert('Failed to fetch alignment analysis.');
        } finally {
            setLoadingStockAlignment(prev => ({ ...prev, [symbol]: false }));
        }
    };

    const toggleAccordion = (key) => {
        setModalAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    

// Load TradingView CDN (add this useEffect)
useEffect(() => {
    const loadTradingViewCharts = async () => {
        if (window.LightweightCharts) {
            setTvLoaded(true);
            return;
        }
        try {
            const cdnSources = [
                'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js',
                'https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js'
            ];
            let loaded = false;
            
            for (const src of cdnSources) {
                if (loaded) break;
                
                try {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = src;
                        script.crossOrigin = 'anonymous';
                        script.onload = () => {
                            console.log(`TradingView Lightweight Charts loaded from: ${src}`);
                            setTimeout(() => {
                                if (window.LightweightCharts && window.LightweightCharts.createChart) {
                                    loaded = true;
                                    setTvLoaded(true);
                                    resolve();
                                } else {
                                    reject();
                                }
                            }, 500);
                        };
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                } catch (e) {
                    continue;
                }
            }
            if (!loaded) {
                console.error('All CDN sources failed');
                setTvLoaded(false);
            }
            
        } catch (error) {
            console.error('Error loading TradingView Lightweight Charts:', error);
            setTvLoaded(false);
        }
    };
    loadTradingViewCharts();
}, []);

// Updated fetch function with timeframe support
const fetchChartData = async (symbol, timeframe = '1h') => {
    if (!tvLoaded) {
        alert('Chart library still loading, please wait...');
        return;
    }
    
    setLoadingCharts(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-fetch-chart-data-for-visualization/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: [symbol],
                timeframe: timeframe,
                lookback_days: 60
            })
        });

        const data = await response.json();
        
        if (data.success && data.data[symbol]?.success) {
            setChartData(prev => ({
                ...prev,
                [symbol]: data.data[symbol].data
            }));
            setChartTimeframes(prev => ({
                ...prev,
                [symbol]: timeframe
            }));
            setShowChart(prev => ({ ...prev, [symbol]: true }));
        } else {
            alert(`Error loading chart: ${data.data[symbol]?.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error fetching chart:', error);
        alert('Failed to load chart data');
    } finally {
        setLoadingCharts(prev => ({ ...prev, [symbol]: false }));
    }
};


// Function to fetch all charts (displays inline on cards)
const fetchAllCharts = async () => {
    if (!tvLoaded) {
        alert('Chart library still loading, please wait...');
        return;
    }
    
    setLoadingAllCharts(true);
    
    try {
        const symbols = filteredData.map(asset => asset.symbol);
        
        const response = await fetch(`${baseUrl}/api/mss-fetch-chart-data-for-visualization/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: symbols
            })
        });

        const data = await response.json();
        
        if (data.success) {
            const chartsMap = {};
            const showChartsMap = {};
            
            Object.keys(data.data).forEach(symbol => {
                if (data.data[symbol].success) {
                    chartsMap[symbol] = data.data[symbol].data;
                    showChartsMap[symbol] = true; // Show all charts
                }
            });
            
            setChartData(chartsMap);
            setShowChart(showChartsMap);
            alert(`✅ Loaded charts for ${Object.keys(chartsMap).length} assets!`);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error fetching all charts:', error);
        alert('Failed to load charts');
    } finally {
        setLoadingAllCharts(false);
    }
};

// Function to fetch sector charts
const fetchSectorCharts = async (sector) => {
    if (!tvLoaded) {
        alert('Chart library still loading, please wait...');
        return;
    }
    
    setLoadingAllCharts(true);
    
    try {
        // Get all symbols in this sector
        const sectorAssets = mssData.filter(asset => asset.sector === sector);
        const symbols = sectorAssets.map(asset => asset.symbol);
        
        if (symbols.length === 0) {
            alert('No assets found in this sector');
            setLoadingAllCharts(false);
            return;
        }
        
        const response = await fetch(`${baseUrl}/api/mss-fetch-chart-data-for-visualization/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: symbols
            })
        });

        const data = await response.json();
        
        if (data.success) {
            const chartsMap = {};
            const showChartsMap = {};
            
            Object.keys(data.data).forEach(symbol => {
                if (data.data[symbol].success) {
                    chartsMap[symbol] = data.data[symbol].data;
                    showChartsMap[symbol] = true;
                }
            });
            
            setChartData(prev => ({ ...prev, ...chartsMap }));
            setShowChart(prev => ({ ...prev, ...showChartsMap }));
            alert(`✅ Loaded charts for ${Object.keys(chartsMap).length} ${sector} stocks!`);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error fetching sector charts:', error);
        alert('Failed to load sector charts');
    } finally {
        setLoadingAllCharts(false);
    }
};
    

    // Updated TradingView Chart Component
const TradingViewChart = ({ data, symbol, isFullscreen = false }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const currentTimeframe = chartTimeframes[symbol] || '1h';
    
    useEffect(() => {
        if (!data || data.length === 0 || !chartContainerRef.current || !window.LightweightCharts) return;
        
        // Create chart with responsive width
        const containerWidth = chartContainerRef.current.clientWidth;
        const chartHeight = isFullscreen ? Math.min(window.innerHeight - 200, 800) : 300;
        
        const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
            width: containerWidth,
            height: chartHeight,
            layout: {
                background: { color: '#1a1a1a' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: '#2a2a2a' },
                horzLines: { color: '#2a2a2a' },
            },
            crosshair: {
                mode: 1,
            },
            rightPriceScale: {
                borderColor: '#2a2a2a',
            },
            timeScale: {
                borderColor: '#2a2a2a',
                timeVisible: true,
                secondsVisible: false,
            },
        });
        
        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });
        
        candlestickSeries.setData(data);
        
        // Add overlays ONLY in fullscreen mode
        if (isFullscreen) {
            const currentPrice = data[data.length - 1]?.close || 0;
            
            // 1. Entry Points Overlay
            if (retracementData[symbol]?.entry_zones) {
                const zones = retracementData[symbol].entry_zones;
                
                // Aggressive entry line (green)
                const aggressiveLine = chart.addLineSeries({
                    color: '#10b981',
                    lineWidth: 2,
                    lineStyle: 2, // Dashed
                    priceLineVisible: false,
                });
                const aggressiveData = data.map(d => ({ time: d.time, value: zones.aggressive_entry }));
                aggressiveLine.setData(aggressiveData);
                
                // Optimal entry line (yellow)
                const optimalLine = chart.addLineSeries({
                    color: '#fbbf24',
                    lineWidth: 3,
                    lineStyle: 0, // Solid
                    priceLineVisible: false,
                });
                const optimalData = data.map(d => ({ time: d.time, value: zones.optimal_entry }));
                optimalLine.setData(optimalData);
                
                // Conservative entry line (blue)
                const conservativeLine = chart.addLineSeries({
                    color: '#3b82f6',
                    lineWidth: 2,
                    lineStyle: 2, // Dashed
                    priceLineVisible: false,
                });
                const conservativeData = data.map(d => ({ time: d.time, value: zones.conservative_entry }));
                conservativeLine.setData(conservativeData);
                
                // Invalidation level (red)
                const invalidationLine = chart.addLineSeries({
                    color: '#ef4444',
                    lineWidth: 2,
                    lineStyle: 3, // Dotted
                    priceLineVisible: false,
                });
                const invalidationData = data.map(d => ({ time: d.time, value: zones.invalidation_level }));
                invalidationLine.setData(invalidationData);
            }
            
            // 2. FIXED Trend Elasticity Bands Overlay
            if (elasticityData[symbol]) {
                const elasticity = elasticityData[symbol].overall_elasticity;
                
                // Calculate realistic band width based on elasticity and recent volatility
                // Get last 20 candles for volatility calculation
                const recentData = data.slice(-20);
                const highLowRanges = recentData.map(d => d.high - d.low);
                const avgRange = highLowRanges.reduce((a, b) => a + b, 0) / highLowRanges.length;
                
                // Band width: lower elasticity = wider bands, but keep it reasonable
                // Use average range as base, scaled by elasticity
                const bandMultiplier = (1 - elasticity) * 2; // Max 2x the average range
                const bandWidth = avgRange * Math.max(0.5, bandMultiplier); // Minimum 0.5x range
                
                // Upper band (resistance for pullbacks)
                const upperBand = chart.addLineSeries({
                    color: '#ec4899',
                    lineWidth: 2,
                    lineStyle: 2,
                    priceLineVisible: false,
                });
                const upperData = data.map(d => ({ time: d.time, value: d.close + bandWidth }));
                upperBand.setData(upperData);
                
                // Lower band (support for pullbacks)
                const lowerBand = chart.addLineSeries({
                    color: '#ec4899',
                    lineWidth: 2,
                    lineStyle: 2,
                    priceLineVisible: false,
                });
                const lowerData = data.map(d => ({ time: d.time, value: d.close - bandWidth }));
                lowerBand.setData(lowerData);
            }
            
            // 3. Price Target Overlay
            if (priceTargetData[symbol]?.target_price) {
                const targetLine = chart.addLineSeries({
                    color: '#8b5cf6',
                    lineWidth: 3,
                    lineStyle: 1, // Dashed
                    priceLineVisible: false,
                });
                const targetData = data.map(d => ({ 
                    time: d.time, 
                    value: priceTargetData[symbol].target_price 
                }));
                targetLine.setData(targetData);
            }
        }
        
        // Fit content
        chart.timeScale().fitContent();
        
        chartRef.current = chart;
        
        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                const newWidth = chartContainerRef.current.clientWidth;
                const newHeight = isFullscreen ? Math.min(window.innerHeight - 200, 800) : 300;
                chartRef.current.applyOptions({
                    width: newWidth,
                    height: newHeight,
                });
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [data, isFullscreen, retracementData, elasticityData, priceTargetData]);
    
    // Helper function to extract sentiment from AI analysis
    const getSentiment = () => {
        if (!assetAnalysis[symbol] || assetAnalysis[symbol].noData || assetAnalysis[symbol].error) {
            return null;
        }
        
        const analysis = assetAnalysis[symbol].analysis || '';
        const lowerAnalysis = analysis.toLowerCase();
        
        if (lowerAnalysis.includes('bullish')) {
            return { label: 'BULLISH', color: '#10b981' };
        } else if (lowerAnalysis.includes('bearish')) {
            return { label: 'BEARISH', color: '#ef4444' };
        } else if (lowerAnalysis.includes('neutral')) {
            return { label: 'NEUTRAL', color: '#6b7280' };
        }
        
        return null;
    };
    
    const sentiment = getSentiment();
    
    return (
        <div style={{ width: '100%', position: 'relative', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Header with timeframe selector */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '12px',
                background: '#2a2a2a',
                borderRadius: '8px 8px 0 0',
                marginBottom: '0'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#e5e7eb',
                    }}>
                        {symbol} - {currentTimeframe.toUpperCase()}
                    </div>
                    
                    {/* Sentiment Badge */}
                    {isFullscreen && sentiment && (
                        <div style={{
                            padding: '4px 12px',
                            background: sentiment.color,
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}>
                            {sentiment.label}
                        </div>
                    )}

                    {/* NEW: AI Analysis Toggle (only in fullscreen) */}
                    {isFullscreen && assetAnalysis[symbol] && !assetAnalysis[symbol].noData && !assetAnalysis[symbol].error && (
                        <button
                            onClick={() => setShowAIOverlay(prev => ({
                                ...prev,
                                [symbol]: !prev[symbol]
                            }))}
                            style={{
                                padding: '6px 12px',
                                background: showAIOverlay[symbol] ? '#8b5cf6' : '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            {showAIOverlay[symbol] ? '👁️ Hide AI' : '🤖 Show AI'}
                        </button>
                    )}
                </div>
                
                {/* Timeframe + Controls */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    {/* Timeframe Selector */}
                    {['1h', '4h', '1d', '1w'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => changeChartTimeframe(symbol, tf)}
                            disabled={loadingCharts[symbol]}
                            style={{
                                padding: '6px 10px',
                                background: currentTimeframe === tf ? '#4f46e5' : '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                minWidth: '40px'
                            }}
                        >
                            {tf.toUpperCase()}
                        </button>
                    ))}
                    
                    {/* NEW: Refresh Button */}
                    <button
                        onClick={() => refreshChartData(symbol)}
                        disabled={refreshingChart[symbol]}
                        style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',            
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                    }}
                >
                    {refreshingChart[symbol] ? '⏳' : '🔄 Refresh'}
                </button>
                
                {/* NEW: Auto-Refresh Toggle */}
                <button
                    onClick={() => toggleAutoRefresh(symbol)}
                    style={{
                        padding: '6px 12px',
                        background: autoRefreshEnabled[symbol] ? '#f59e0b' : '#374151',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {autoRefreshEnabled[symbol] ? '⏸️ Auto' : '▶️ Auto'}
                </button>
                {/* Fullscreen Button */}
                    {!isFullscreen && (
                        <button
                            onClick={() => {
                                setFullscreenChart(symbol);
                                setCurrentChartSymbol(symbol); // ✅ Set chart context when opening
                            }}
                            style={{
                                padding: '6px 12px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            ⛶ Full
                        </button>
                    )}
            </div>
            </div>
            {/* NEW: Enhanced AI Analysis Overlay with Voice */}
            {isFullscreen && showAIOverlay[symbol] && assetAnalysis[symbol] && (
                <div className="ai-overlay-container">
                    <div className="ai-overlay-header">
                        <div className="ai-overlay-title">
                            <span>🤖</span>
                            <span>AI Analysis</span>
                        </div>
                        <button 
                            className="ai-overlay-close"
                            onClick={() => setShowAIOverlay(prev => ({
                                ...prev,
                                [symbol]: false
                            }))}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="ai-overlay-content">
                        {assetAnalysis[symbol].analysis}
                    </div>
                    
                    {/* Voice Controls */}
                    {voiceEnabled && (
                        <div className="ai-voice-controls">
                            <button 
                                className="ai-voice-btn"
                                onClick={() => speakText(assetAnalysis[symbol].analysis)}
                                disabled={isSpeaking}
                            >
                                {isSpeaking ? '🔊 Speaking...' : '🔊 Read Aloud'}
                            </button>
                            {isSpeaking && (
                                <button 
                                    className="ai-voice-btn stop"
                                    onClick={stopSpeaking}
                                >
                                    ⏹️ Stop
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            

            <div 
                ref={chartContainerRef} 
                style={{ 
                    width: '100%',
                    maxWidth: '100%',
                    height: isFullscreen ? `${Math.min(window.innerHeight - 200, 700)}px` : '280px', // Reduced from 300px
                    background: '#1a1a1a',
                    borderRadius: '0 0 8px 8px',
                    overflow: 'hidden',
                    position: 'relative' // For AI overlay positioning
                }} 
            />

        </div>
    );
};

    // Single asset mean reversion analysis
const analyzeMeanReversion = async (symbol) => {
    setLoadingMeanReversion(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-mean-reversion-regime-detector-v2/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: [symbol],
                lookback_days: 100
            })
        });

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            setMeanReversionData(prev => ({
                ...prev,
                [symbol]: data.data[0]
            }));
        } else {
            alert(`Error: ${data.error || 'No data available'}`);
        }
    } catch (error) {
        console.error('Error analyzing mean reversion:', error);
        alert('Failed to analyze mean reversion');
    } finally {
        setLoadingMeanReversion(prev => ({ ...prev, [symbol]: false }));
    }
};

// Bulk mean reversion analysis for all assets
const analyzeAllMeanReversion = async () => {
    setLoadingAllMeanReversion(true);
    
    try {
        const symbols = filteredData.map(asset => asset.symbol);
        
        const response = await fetch(`${baseUrl}/api/mss-mean-reversion-regime-detector-v2/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: symbols,
                lookback_days: 100
            })
        });

        const data = await response.json();
        
        if (data.success) {
            const mrMap = {};
            data.data.forEach(item => {
                mrMap[item.symbol] = item;
            });
            setMeanReversionData(mrMap);
            alert(`✅ Analyzed ${data.data.length} assets for mean reversion!`);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error analyzing all mean reversion:', error);
        alert('Failed to analyze mean reversion');
    } finally {
        setLoadingAllMeanReversion(false);
    }
};


// ================================
// SECTOR PEERS COMPARISON FUNCTIONS
// ================================

const fetchSectorPeersIndex = async (symbol) => {
    setLoadingSectorPeers(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-sector-peers-normalized-index-v2/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                lookback_days: 60
            })
        });

        const data = await response.json();
        
        if (data.success) {
            setSectorPeersData(prev => ({
                ...prev,
                [symbol]: data
            }));
            setShowSectorPeersChart(prev => ({
                ...prev,
                [symbol]: true
            }));
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error fetching sector peers:', error);
        alert('Failed to fetch sector peers data');
    } finally {
        setLoadingSectorPeers(prev => ({ ...prev, [symbol]: false }));
    }
};


// ================================
// CHART REFRESH FUNCTIONS
// ================================

// Manual refresh for a single chart
const refreshChartData = async (symbol) => {
    setRefreshingChart(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const timeframe = chartTimeframes[symbol] || '1h';
        await fetchChartData(symbol, timeframe);
    } catch (error) {
        console.error('Error refreshing chart:', error);
    } finally {
        setRefreshingChart(prev => ({ ...prev, [symbol]: false }));
    }
};

// Toggle auto-refresh (every 60 seconds)
const toggleAutoRefresh = (symbol) => {
    const newState = !autoRefreshEnabled[symbol];
    setAutoRefreshEnabled(prev => ({
        ...prev,
        [symbol]: newState
    }));
    
    if (newState) {
        // Auto-refresh every 60 seconds
        alert(`✅ Auto-refresh enabled for ${symbol} (every 60s)`);
    } else {
        alert(`⏸️ Auto-refresh disabled for ${symbol}`);
    }
};

// Auto-refresh effect
useEffect(() => {
    const intervals = {};
    
    Object.keys(autoRefreshEnabled).forEach(symbol => {
        if (autoRefreshEnabled[symbol]) {
            intervals[symbol] = setInterval(() => {
                refreshChartData(symbol);
            }, 60000); // 60 seconds
        }
    });
    
    return () => {
        Object.values(intervals).forEach(clearInterval);
    };
}, [autoRefreshEnabled]);

    // ================================
// NEW STATE VARIABLES - Voice & Chart Features
// ================================

// Voice Settings
const [voiceEnabled, setVoiceEnabled] = useState(false);
const [selectedVoice, setSelectedVoice] = useState(null);
const [availableVoices, setAvailableVoices] = useState([]);
const [isSpeaking, setIsSpeaking] = useState(false);

// Chart Context for AI
const [useChartContext, setUseChartContext] = useState(false);
const [currentChartSymbol, setCurrentChartSymbol] = useState(null);

// Load voices on mount
useEffect(() => {
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Load saved voice from localStorage
        const savedVoiceName = localStorage.getItem('preferred_voice');
        if (savedVoiceName && voices.length > 0) {
            const voice = voices.find(v => v.name === savedVoiceName);
            if (voice) setSelectedVoice(voice);
        }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}, []);


// ================================
// VOICE FUNCTIONS
// ================================

const speakText = (text) => {
    if (!voiceEnabled || !text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
};

const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
};

const handleVoiceChange = (voiceName) => {
    const voice = availableVoices.find(v => v.name === voiceName);
    setSelectedVoice(voice);
    
    // Save to localStorage
    localStorage.setItem('preferred_voice', voiceName);
};


// ================================
// CHART CONTEXT FOR AI
// ================================

const fetchChartContextForAI = async (symbol) => {
    try {
        const timeframe = chartTimeframes[symbol] || '1h';
        
        const response = await fetch(`${baseUrl}/api/mss-generate-chart-context-for-ai-v2/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                timeframe: timeframe,
                lookback_days: 60
            })
        });

        const data = await response.json();
        
        if (data.success) {
            return data.chart_context;
        }
        return null;
    } catch (error) {
        console.error('Error fetching chart context:', error);
        return null;
    }
};
    const openFullscreenChart = (symbol) => {
setFullscreenChart(symbol);
setCurrentChartSymbol(symbol); // Enable chart context for this symbol
};


// ================================
// UPDATED CHAT SEND WITH CHART CONTEXT
// ================================

const handleChatSend = async () => {
    if ((!chatInput.trim() && !chatImage) || chatLoading) return;

    const userMessage = chatInput.trim();
    const imageToSend = chatImage;
    
    setChatInput('');
    setChatImage(null);
    
    const messageContent = userMessage || "Please analyze this image";
    setChatMessages(prev => [...prev, { 
        role: 'user', 
        content: messageContent,
        image: imageToSend 
    }]);
    
    setChatLoading(true);

    try {
        // Prepare MSS data context
        const mssContext = mssData.length > 0 
            ? `Current Market Data Analysis:
${mssData.slice(0, 10).map(asset => 
    `- ${asset.symbol}: MSS ${asset.mss}, Trend: ${asset.trend || 'unknown'}, Price: $${asset.current_price}, Change: ${asset.price_change}%${asset.sector ? `, Sector: ${asset.sector}` : ''}`
).join('\n')}`
            : 'No market data currently loaded.';

        // Get chart context if enabled
        let chartContextText = '';
        if (useChartContext && currentChartSymbol) {
            const chartContext = await fetchChartContextForAI(currentChartSymbol);
            if (chartContext) {
                chartContextText = `\n\nCURRENT CHART ANALYSIS:\n${chartContext}`;
            }
        }

        const messages = [
            {
                role: 'system',
                content: `You are Simons, a professional yet friendly trading and investing assistant named after legendary investor Jim Simons. Your purpose is to help traders analyze markets, understand trends, and make informed decisions.

${mssContext}${chartContextText}

You have access to real-time Market Stability Score (MSS) data, which evaluates assets based on volatility, trend clarity, and liquidity. Higher MSS scores indicate better trading conditions.

${useChartContext && currentChartSymbol ? `You also have access to detailed chart analysis for ${currentChartSymbol}, including technical indicators, support/resistance levels, and price action patterns.` : ''}

Be concise, actionable, and insightful. Focus on practical trading advice while maintaining a professional but approachable tone.`
            },
            ...chatMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Add image if present
        if (imageToSend) {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: userMessage || 'Please analyze this chart/image' },
                    { 
                        type: 'image_url', 
                        image_url: { url: imageToSend }
                    }
                ]
            });
        } else {
            messages.push({
                role: 'user',
                content: userMessage
            });
        }

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const aiData = await aiResponse.json();
        const response = aiData.choices[0].message.content;

        setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: response
        }]);
        
        // Speak response if voice enabled
        if (voiceEnabled) {
            speakText(response);
        }

    } catch (error) {
        console.error('Error in chat:', error);
        setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.'
        }]);
    } finally {
        setChatLoading(false);
    }
};
    
    // Function to estimate price target
    const estimatePriceTarget = async (symbol) => {
        const targetPrice = targetPriceInput[symbol];
        
        if (!targetPrice || isNaN(targetPrice)) {
            alert('Please enter a valid target price');
            return;
        }
        
        setLoadingPriceTarget(prev => ({ ...prev, [symbol]: true }));
        
        try {
            const response = await fetch(`${baseUrl}/api/mss-estimate-price-target-timeline/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol,
                    target_price: parseFloat(targetPrice),
                    lookback_days: 60
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setPriceTargetData(prev => ({
                    ...prev,
                    [symbol]: data
                }));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error estimating price target:', error);
            alert('Failed to estimate price target timeline');
        } finally {
            setLoadingPriceTarget(prev => ({ ...prev, [symbol]: false }));
        }
    };

    // Function for single asset
    const getAverageDailyRange = async (symbol) => {
        setLoadingADR(prev => ({ ...prev, [symbol]: true }));
        
        try {
            const response = await fetch(`${baseUrl}/api/mss-calculate-average-daily-range-projections/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: [symbol],
                    lookback_days: 20
                })
            });

            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                setAdrData(prev => ({
                    ...prev,
                    [symbol]: data.data[0]
                }));
            } else {
                alert(`Error: ${data.error || 'No data available'}`);
            }
        } catch (error) {
            console.error('Error getting ADR:', error);
            alert('Failed to calculate Average Daily Range');
        } finally {
            setLoadingADR(prev => ({ ...prev, [symbol]: false }));
        }
    };

    // Function for all assets
    const getAllAverageDailyRanges = async () => {
        setLoadingAllADR(true);
        
        try {
            const symbols = filteredData.map(asset => asset.symbol);
            
            const response = await fetch(`${baseUrl}/api/mss-calculate-average-daily-range-projections/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: symbols,
                    lookback_days: 20
                })
            });

            const data = await response.json();
            
            if (data.success) {
                const adrMap = {};
                data.data.forEach(item => {
                    adrMap[item.symbol] = item;
                });
                setAdrData(adrMap);
                alert(`✅ Calculated ADR for ${data.data.length} assets!`);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error getting all ADR:', error);
            alert('Failed to calculate Average Daily Ranges');
        } finally {
            setLoadingAllADR(false);
        }
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);


    useEffect(() => {
        fetchAssetLists();
        fetchExistingModels();
        fetchOpenAIKey();
    }, []);

    // Add this state at the top with your other states
    const [retracementData, setRetracementData] = useState({});
    const [loadingRetracement, setLoadingRetracement] = useState({});

    // Add these states at the top with your other states
    const [trendDurations, setTrendDurations] = useState({});
    const [loadingDurations, setLoadingDurations] = useState({});
    const [loadingAllDurations, setLoadingAllDurations] = useState(false);
    const [durationSortOrder, setDurationSortOrder] = useState('desc'); // 'asc' or 'desc'

    // Add this function
    const calculateRetracementEntry = async (symbol) => {
        setLoadingRetracement(prev => ({ ...prev, [symbol]: true }));
        
        try {
            const response = await fetch(`${baseUrl}/api/mss-quantum-retracement-fibonacci-entry-optimizer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol,
                    lookback_period: 90,
                    sensitivity: 'medium'
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setRetracementData(prev => ({
                    ...prev,
                    [symbol]: data
                }));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error calculating retracement:', error);
            alert('Failed to calculate retracement entry points');
        } finally {
            setLoadingRetracement(prev => ({ ...prev, [symbol]: false }));
        }
    };

    // Function to get duration for single asset
const getTrendDuration = async (symbol) => {
    setLoadingDurations(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-analyze-trend-duration-timeline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: [symbol]
            })
        });

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            setTrendDurations(prev => ({
                ...prev,
                [symbol]: data.data[0]
            }));
        } else {
            alert(`Error: ${data.error || 'No data available'}`);
        }
    } catch (error) {
        console.error('Error getting trend duration:', error);
        alert('Failed to get trend duration');
    } finally {
        setLoadingDurations(prev => ({ ...prev, [symbol]: false }));
    }
};

// Function to get durations for ALL assets
const getAllTrendDurations = async () => {
    setLoadingAllDurations(true);
    
    try {
        const symbols = filteredData.map(asset => asset.symbol);
        
        const response = await fetch(`${baseUrl}/api/mss-analyze-trend-duration-timeline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: symbols
            })
        });

        const data = await response.json();
        
        if (data.success) {
            const durationsMap = {};
            data.data.forEach(item => {
                durationsMap[item.symbol] = item;
            });
            setTrendDurations(durationsMap);
            alert(`✅ Analyzed trend duration for ${data.data.length} assets!`);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error getting all durations:', error);
        alert('Failed to get trend durations');
    } finally {
        setLoadingAllDurations(false);
    }
};

// Function to sort data by trend duration
const sortByTrendDuration = () => {
    const newOrder = durationSortOrder === 'desc' ? 'asc' : 'desc';
    setDurationSortOrder(newOrder);
    
    // We'll update the filteredData sorting below
};

// Update your filteredData to include duration sorting
const getSortedFilteredData = () => {
    let data = mssData.filter(item => {
        // ... your existing filters ...
        if (searchQuery && !item.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        if (modelStatusFilter === 'active') {
            if (!savedModels.has(item.symbol) || !activeModels[item.symbol]?.isActive) {
                return false;
            }
        } else if (modelStatusFilter === 'paused') {
            if (!savedModels.has(item.symbol) || activeModels[item.symbol]?.isActive) {
                return false;
            }
        } else if (modelStatusFilter === 'unsaved') {
            if (savedModels.has(item.symbol)) {
                return false;
            }
        }

        if (volumeFilter !== 'all' && item.volumeCategory) {
            if (volumeFilter !== item.volumeCategory) {
                return false;
            }
        }

        if (selectedSector !== 'all' && item.sector) {
            if (selectedSector !== item.sector) {
                return false;
            }
        }

        if (rSquaredFilter !== 'all') {
            const rSquared = parseFloat(item.r_squared);
            if (rSquaredFilter === 'high' && rSquared < 0.7) {
                return false;
            } else if (rSquaredFilter === 'medium' && (rSquared < 0.4 || rSquared >= 0.7)) {
                return false;
            } else if (rSquaredFilter === 'low' && rSquared >= 0.4) {
                return false;
            }
        }
        
        if (selectedCategory === 'all') return true;
        return item.category === selectedCategory;
    });

    // Sort by R² if filter is active
    if (rSquaredFilter !== 'all') {
        data.sort((a, b) => parseFloat(b.r_squared) - parseFloat(a.r_squared));
    }
    
    // Sort by trend duration if we have duration data
    if (Object.keys(trendDurations).length > 0) {
        data.sort((a, b) => {
            const aDuration = trendDurations[a.symbol]?.trend_duration_days || -1;
            const bDuration = trendDurations[b.symbol]?.trend_duration_days || -1;
            
            if (durationSortOrder === 'desc') {
                return bDuration - aDuration; // Longest first
            } else {
                return aDuration - bDuration; // Shortest first
            }
        });
    }
    
    return data;
};



    const runMonteCarloSimulation = async (symbol) => {
        setMonteCarloLoading(prev => ({ ...prev, [symbol]: true }));
        
        try {
            const response = await fetch(`${baseUrl}/api/monte-carlo-prediction/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol,
                    lookback_days: 85,  // Changed from 120 to 85
                    forecast_days: 5,
                    num_simulations: 10000,
                    threshold: 0.60
                })
            });
    
            const data = await response.json();
            
            if (data.success) {
                setMonteCarloResults(prev => ({
                    ...prev,
                    [symbol]: {
                        bullishProb: data.bullish_probability,
                        bearishProb: data.bearish_probability,
                        isBullish: data.is_bullish,
                        isBearish: data.is_bearish,
                        currentPrice: data.current_price,
                        timestamp: new Date().toISOString()
                    }
                }));
            } else {
                alert(`Monte Carlo Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error running Monte Carlo:', error);
            alert('Failed to run Monte Carlo simulation. Please try again.');
        } finally {
            setMonteCarloLoading(prev => ({ ...prev, [symbol]: false }));
        }
    };
    
    const fetchOpenAIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching OpenAI key:", error);
        }
    };

    // 2. ADD NEW FUNCTION - Calculate Trend Elasticity:
const calculateTrendElasticity = async (symbol) => {
    setLoadingElasticity(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-trend-elasticity-analyzer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                lookback_period: 90
            })
        });

        const data = await response.json();
        
        if (data.success) {
            setElasticityData(prev => ({
                ...prev,
                [symbol]: data
            }));
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error calculating elasticity:', error);
        alert('Failed to calculate trend elasticity');
    } finally {
        setLoadingElasticity(prev => ({ ...prev, [symbol]: false }));
    }
};
const changeChartTimeframe = async (symbol, newTimeframe) => {
    setChartTimeframes(prev => ({
        ...prev,
        [symbol]: newTimeframe
    }));
    
    // Re-fetch chart data with new timeframe
    await fetchChartData(symbol, newTimeframe);
};

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setChatImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const fetchAssetLists = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/mss/asset-lists/`);
            const data = await response.json();
            if (data.success) {
                setAssetLists(data.asset_lists);
            }
        } catch (error) {
            console.error('Error fetching asset lists:', error);
        }
    };

    const fetchExistingModels = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-models/`);
            const models = await response.json();
            const assets = new Set(models.map(m => m.asset));
            setSavedModels(assets);
            
            const activeMap = {};
            models.forEach(m => {
                activeMap[m.asset] = { id: m.id, isActive: m.is_active };
            });
            setActiveModels(activeMap);
        } catch (error) {
            console.error('Error fetching existing models:', error);
        }
    };

    const calculateMSS = async () => {
        setLoading(true);
        setSelectedStock(null);
        setStockVsSectorData(null);
        setSelectedSector('all');
        
        try {
            let symbols = [];
            
            if (selectedAssetClass === 'custom') {
                symbols = customSymbols.split(',').map(s => s.trim()).filter(s => s);
            } else if (assetLists) {
                symbols = assetLists[selectedAssetClass] || [];
            }

            let finalPeriod = period;
            if (period === 0) {
                const customVal = parseInt(customPeriod);
                if (customPeriod && !isNaN(customVal) && customVal > 0) {
                    finalPeriod = customVal;
                } else {
                    alert('Please enter a valid custom period (number of days)');
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(`${baseUrl}/api/mss/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: symbols,
                    period: finalPeriod
                })
            });

            const data = await response.json();
            
            if (data.success) {
                const enrichedData = await Promise.all(
                    data.data.map(async (asset) => {
                        try {
                            const trendResponse = await fetch(
                                `${baseUrl}/api/detect-trend/?symbol=${asset.symbol}&period=20`
                            );
                            const trendData = await trendResponse.json();
                            
                            const stockSymbol = asset.symbol;
                            const sector = await getSectorForStock(stockSymbol);
                            
                            return {
                                ...asset,
                                trend: trendData.trend || 'unknown',
                                sector: sector
                            };
                        } catch (error) {
                            return {
                                ...asset,
                                trend: 'unknown',
                                sector: null
                            };
                        }
                    })
                );
                setMssData(enrichedData);
            } else {
                alert('Error calculating MSS: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to calculate MSS. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getSectorForStock = async (symbol) => {
        try {
            const response = await fetch(`${baseUrl}/api/mss-stock-sector-identifier/?symbol=${symbol}`);
            const data = await response.json();
            return data.sector || null;
        } catch (error) {
            return null;
        }
    };



const saveToForwardTest = async (asset) => {
    setSavingModels(prev => ({ ...prev, [asset.symbol]: true }));

    try {
        let modelCode = '';
        if (asset.trend === 'uptrend') {
            modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # MSS-R²-MC Strategy - 3-Layer Confirmation
    if is_uptrend(data=dataset, lookback_days=30):
        if is_bullish_market_retracement(data=dataset, lookback_period=20):
            if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                return_statement = 'buy'`;
        } else if (asset.trend === 'downtrend') {
            modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # MSS-R²-MC Strategy - 3-Layer Confirmation
    if is_downtrend(data=dataset, lookback_days=30):
        if is_bearish_market_retracement(data=dataset, lookback_period=20):
            if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                return_statement = 'sell'`;
        } else {
            alert(`Cannot save ${asset.symbol}: No clear trend detected`);
            setSavingModels(prev => ({ ...prev, [asset.symbol]: false }));
            return;
        }

        const response = await fetch(`${baseUrl}/api/snowai-models/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `[MSS-R²-MC] ${asset.symbol} - ${asset.trend.toUpperCase()}`,
                asset: asset.symbol,
                interval: '1h',
                model_code: modelCode,
                initial_equity: 10000,
                num_positions: 1,
                take_profit: 4,
                take_profit_type: 'PERCENTAGE',
                stop_loss: 2,
                stop_loss_type: 'PERCENTAGE',
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            setSavedModels(prev => new Set([...prev, asset.symbol]));
            setActiveModels(prev => ({
                ...prev,
                [asset.symbol]: { id: data.id, isActive: true }
            }));
            alert(`✅ Successfully saved ${asset.symbol} with MSS-R²-MC Strategy:\n✓ Trend (30d)\n✓ Market Retracement (20d)\n✓ Average Retracement Pattern`);
            fetchExistingModels();
        } else {
            alert(`Error: ${data.error || 'Failed to save model'}`);
        }
    } catch (error) {
        console.error('Error saving model:', error);
        alert('Failed to save model. Please try again.');
    } finally {
        setSavingModels(prev => ({ ...prev, [asset.symbol]: false }));
    }
};


const deactivateModel = async (asset) => {
    if (!window.confirm(`Are you sure you want to deactivate the model for ${asset.symbol}?`)) {
        return;
    }

    setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: true }));

    try {
        const modelInfo = activeModels[asset.symbol];
        if (!modelInfo) {
            alert('Model not found');
            return;
        }

        const response = await fetch(`${baseUrl}/api/snowai-models/${modelInfo.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                is_active: false
            })
        });

        if (response.ok) {
            setActiveModels(prev => ({
                ...prev,
                [asset.symbol]: { ...prev[asset.symbol], isActive: false }
            }));
            alert(`⏸️ Successfully deactivated ${asset.symbol}`);
            fetchExistingModels();
        } else {
            alert('Failed to deactivate model');
        }
    } catch (error) {
        console.error('Error deactivating model:', error);
        alert('Failed to deactivate model. Please try again.');
    } finally {
        setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: false }));
    }
};

const reactivateModel = async (asset) => {
    setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: true }));

    try {
        const modelInfo = activeModels[asset.symbol];
        if (!modelInfo) {
            alert('Model not found');
            return;
        }

        if (!asset.trend || asset.trend === 'ranging' || asset.trend === 'unknown') {
            alert(`❌ Cannot reactivate ${asset.symbol}: No clear trend detected. Current market is ${asset.trend || 'unknown'}.`);
            setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: false }));
            return;
        }

        let modelCode = '';
        if (asset.trend === 'uptrend') {
            modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # MSS-R²-MC Strategy - 3-Layer Confirmation
    if is_uptrend(data=dataset, lookback_days=30):
        if is_bullish_market_retracement(data=dataset, lookback_period=20):
            if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                return_statement = 'buy'`;
        } else if (asset.trend === 'downtrend') {
            modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # MSS-R²-MC Strategy - 3-Layer Confirmation
    if is_downtrend(data=dataset, lookback_days=30):
        if is_bearish_market_retracement(data=dataset, lookback_period=20):
            if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                return_statement = 'sell'`;
        }

        const response = await fetch(`${baseUrl}/api/snowai-models/${modelInfo.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                is_active: true,
                model_code: modelCode,
                name: `[MSS-R²-MC] ${asset.symbol} - ${asset.trend.toUpperCase()}`
            })
        });

        if (response.ok) {
            setActiveModels(prev => ({
                ...prev,
                [asset.symbol]: { ...prev[asset.symbol], isActive: true }
            }));
            alert(`▶️ Successfully reactivated ${asset.symbol} with MSS-R²-MC:\n✓ Trend (30d)\n✓ Market Retracement (20d)\n✓ Average Retracement Pattern`);
            fetchExistingModels();
        } else {
            alert('Failed to reactivate model');
        }
    } catch (error) {
        console.error('Error reactivating model:', error);
        alert('Failed to reactivate model. Please try again.');
    } finally {
        setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: false }));
    }
};


    

const deleteModel = async (asset) => {
        if (!window.confirm(`⚠️ Are you sure you want to DELETE the model for ${asset.symbol}? This will remove all trading history and cannot be undone!`)) {
            return;
        }

        setDeletingModels(prev => ({ ...prev, [asset.symbol]: true }));

        try {
            const modelInfo = activeModels[asset.symbol];
            if (!modelInfo) {
                alert('Model not found');
                return;
            }

            const response = await fetch(`${baseUrl}/api/snowai-models/${modelInfo.id}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSavedModels(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(asset.symbol);
                    return newSet;
                });
                setActiveModels(prev => {
                    const newMap = { ...prev };
                    delete newMap[asset.symbol];
                    return newMap;
                });
                alert(`🗑️ Successfully deleted ${asset.symbol} model`);
                fetchExistingModels();
            } else {
                alert('Failed to delete model');
            }
        } catch (error) {
            console.error('Error deleting model:', error);
            alert('Failed to delete model. Please try again.');
        } finally {
            setDeletingModels(prev => ({ ...prev, [asset.symbol]: false }));
        }
    };

    const batchUpdateAllModels = async () => {
    if (!window.confirm(`🔄 This will update ALL saved models based on current market trends:\n\n✓ Uptrend/Downtrend → Reactivate with updated strategy\n✓ Ranging/Unknown → Pause model\n\nContinue?`)) {
        return;
    }

    setBatchUpdating(true);
    let updated = 0;
    let paused = 0;
    let failed = 0;
    const errors = [];

    try {
        // Get all saved models from mssData
        const modelsToUpdate = mssData.filter(asset => savedModels.has(asset.symbol));
        
        for (const asset of modelsToUpdate) {
            try {
                const modelInfo = activeModels[asset.symbol];
                if (!modelInfo) {
                    failed++;
                    errors.push(`${asset.symbol}: Model not found`);
                    continue;
                }

                // If ranging/unknown trend → pause
                if (!asset.trend || asset.trend === 'ranging' || asset.trend === 'unknown') {
                    const response = await fetch(`${baseUrl}/api/snowai-models/${modelInfo.id}/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            is_active: false
                        })
                    });

                    if (response.ok) {
                        paused++;
                        setActiveModels(prev => ({
                            ...prev,
                            [asset.symbol]: { ...prev[asset.symbol], isActive: false }
                        }));
                    } else {
                        failed++;
                        errors.push(`${asset.symbol}: Failed to pause`);
                    }
                    continue;
                }

                // If clear trend → update with appropriate strategy
                let modelCode = '';
                if (asset.trend === 'uptrend') {
                    modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # 5-Layer confirmation system with R² trend strength
    if is_uptrend(data=dataset, lookback_days=30):
        if is_high_r_squared(data=dataset, lookback_period=20, threshold=0.7):
            if is_bullish_market_retracement(data=dataset, lookback_period=20):
                if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                    if is_monte_carlo_bullish_prediction(data=dataset, lookback_days=30, forecast_days=5, threshold=0.60):
                        return_statement = 'buy'`;
                } else if (asset.trend === 'downtrend') {
                    modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')

if num_positions == 0:
    # 5-Layer confirmation system with R² trend strength
    if is_downtrend(data=dataset, lookback_days=30):
        if is_high_r_squared(data=dataset, lookback_period=20, threshold=0.7):
            if is_bearish_market_retracement(data=dataset, lookback_period=20):
                if average_retracement(data=dataset, min_patterns=3, sensitivity='medium'):
                    if is_monte_carlo_bearish_prediction(data=dataset, lookback_days=30, forecast_days=5, threshold=0.60):
                        return_statement = 'sell'`;
                }

                const response = await fetch(`${baseUrl}/api/snowai-models/${modelInfo.id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        is_active: true,
                        model_code: modelCode,
                        name: `[MSS-R²-MC] ${asset.symbol} - ${asset.trend.toUpperCase()}`
                    })
                });

                if (response.ok) {
                    updated++;
                    setActiveModels(prev => ({
                        ...prev,
                        [asset.symbol]: { ...prev[asset.symbol], isActive: true }
                    }));
                } else {
                    failed++;
                    errors.push(`${asset.symbol}: Failed to update`);
                }
            } catch (error) {
                failed++;
                errors.push(`${asset.symbol}: ${error.message}`);
            }

            // Small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Show summary
        let summary = `✅ Batch Update Complete!\n\n`;
        summary += `📊 Updated & Active: ${updated}\n`;
        summary += `⏸️ Paused (Ranging): ${paused}\n`;
        if (failed > 0) {
            summary += `❌ Failed: ${failed}\n`;
            if (errors.length > 0) {
                summary += `\nErrors:\n${errors.slice(0, 5).join('\n')}`;
                if (errors.length > 5) {
                    summary += `\n...and ${errors.length - 5} more`;
                }
            }
        }
        alert(summary);
        
        // Refresh the models list
        fetchExistingModels();
    } catch (error) {
        console.error('Error in batch update:', error);
        alert('Batch update encountered an error. Some models may have been updated.');
    } finally {
        setBatchUpdating(false);
    }
};

    const calculateRelativeVolume = async () => {
        setLoadingVolume(true);
        try {
            const symbols = mssData.map(asset => asset.symbol);
            
            const response = await fetch(`${baseUrl}/api/mss-hyper-volumetric-relativistic-analyzer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: symbols
                })
            });

            const data = await response.json();
            
            if (data.success) {
                const enrichedData = mssData.map(asset => {
                    const volumeData = data.volume_data.find(v => v.symbol === asset.symbol);
                    return {
                        ...asset,
                        relativeVolume: volumeData?.relative_volume || null,
                        volumeCategory: volumeData?.category || null,
                        currentVolume: volumeData?.current_volume || null,
                        avgVolume: volumeData?.avg_volume || null,
                        highVolume: volumeData?.high_volume || null,
                        lowVolume: volumeData?.low_volume || null
                    };
                });
                setMssData(enrichedData);
                alert('✅ Relative volume calculated successfully!');
            } else {
                alert('Error calculating relative volume: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to calculate relative volume. Please try again.');
        } finally {
            setLoadingVolume(false);
        }
    };

    const analyzeSectorPerformance = async () => {
        setLoadingSectors(true);
        try {
            const stockSymbols = mssData
                .filter(asset => !asset.symbol.includes('=') && !asset.symbol.startsWith('^'))
                .map(asset => asset.symbol);
            
            const response = await fetch(`${baseUrl}/api/mss-quantum-sector-momentum-flux-analyzer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: stockSymbols
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setSectorData(data);
                setShowSectorAnalysis(true);
                alert('✅ Sector analysis complete!');
            } else {
                alert('Error analyzing sectors: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to analyze sectors. Please try again.');
        } finally {
            setLoadingSectors(false);
        }
    };

    const compareStockToSector = async (symbol) => {
        const asset = mssData.find(a => a.symbol === symbol);
        
        if (!asset || !asset.sector) {
            alert('Cannot compare: Sector information not available for this stock.');
            return;
        }
        
        setLoadingStockComparison(true);
        setSelectedStock(symbol);
        setStockVsSectorData(null);
        
        try {
            const response = await fetch(`${baseUrl}/api/mss-stock-sector-relativistic-performance-comparator/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setStockVsSectorData(data);
            } else {
                alert('Error comparing stock: ' + data.error);
                setSelectedStock(null);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to compare stock. Please try again.');
            setSelectedStock(null);
        } finally {
            setLoadingStockComparison(false);
        }
    };

    const analyzeAssetSentiment = async (symbol) => {
        setAnalyzingAsset(prev => ({ ...prev, [symbol]: true }));

        try {
            // Fetch news data
            const newsResponse = await fetch(`${baseUrl}/fetch_news_data_api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assets: [symbol],
                    user_email: 'user@example.com'
                })
            });

            const newsData = await newsResponse.json();
            
            if (!newsData.message || newsData.message.length === 0) {
                setAssetAnalysis(prev => ({
                    ...prev,
                    [symbol]: {
                        noData: true,
                        message: 'No recent news or sentiment data available for this asset.'
                    }
                }));
                setAnalyzingAsset(prev => ({ ...prev, [symbol]: false }));
                return;
            }

            // Prepare context for AI analysis
            const newsContext = newsData.message.map(item => ({
                title: item.title,
                description: item.description,
                highlights: item.highlights,
                source: item.source
            }));

            const economicEvents = newsData.economic_events.find(e => e.asset === symbol)?.economic_events || [];

            // Call OpenAI for analysis
            const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a financial analyst providing concise sentiment analysis. Respond in a structured format without markdown. Use clear sections.'
                        },
                        {
                            role: 'user',
                            content: `Analyze the sentiment for ${symbol} based on this recent news and economic events:

News: ${JSON.stringify(newsContext)}
Economic Events: ${JSON.stringify(economicEvents)}

Provide:
1. Overall Sentiment (Bullish/Bearish/Neutral)
2. Key Factors (3-4 bullet points)
3. Risk Assessment
4. Short-term Outlook

Keep it concise and actionable.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const aiData = await aiResponse.json();
            const analysis = aiData.choices[0].message.content;

            setAssetAnalysis(prev => ({
                ...prev,
                [symbol]: {
                    analysis: analysis,
                    timestamp: new Date().toISOString()
                }
            }));

        } catch (error) {
            console.error('Error analyzing asset:', error);
            setAssetAnalysis(prev => ({
                ...prev,
                [symbol]: {
                    error: true,
                    message: 'Failed to generate analysis. Please try again.'
                }
            }));
        } finally {
            setAnalyzingAsset(prev => ({ ...prev, [symbol]: false }));
        }
    };

    const analyzeSectorSentiment = async (sector) => {
        if (!sectorData || !sectorData.sector_performance) return;

        const sectorInfo = sectorData.sector_performance.find(s => s.sector === sector);
        if (!sectorInfo) return;

        setChatLoading(true);
        setChatMessages(prev => [...prev, {
            role: 'user',
            content: `Analyze sentiment for ${sector} sector`
        }]);

        try {
            // Get all symbols in the sector
            const symbols = sectorInfo.symbols;

            // Fetch news for all symbols in sector
            const newsResponse = await fetch(`${baseUrl}/fetch_news_data_api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assets: symbols.slice(0, 10), // Limit to 10 stocks
                    user_email: 'user@example.com'
                })
            });

            const newsData = await newsResponse.json();

            const newsContext = newsData.message.map(item => ({
                asset: item.asset,
                title: item.title,
                highlights: item.highlights
            }));

            // Call OpenAI for sector analysis
            const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a financial analyst providing sector analysis. Be concise and insightful.'
                        },
                        {
                            role: 'user',
                            content: `Analyze the ${sector} sector sentiment based on:

Performance: ${sectorInfo.avg_return.toFixed(2)}% return
Stocks Analyzed: ${sectorInfo.num_stocks}
Recent News: ${JSON.stringify(newsContext)}

Provide sector outlook, key drivers, and investment considerations. Keep response under 300 words.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 400
                })
            });

            const aiData = await aiResponse.json();
            const analysis = aiData.choices[0].message.content;

            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: analysis
            }]);

        } catch (error) {
            console.error('Error analyzing sector:', error);
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Failed to analyze sector. Please try again.'
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Replace your current filteredData with this enhanced version:
const filteredData = mssData
    .filter(item => {
        // First apply the saved assets filter if active
        if (showingSavedOnly && !savedAssetSymbols.includes(item.symbol)) {
            return false;
        }
        
        // Then apply sector filter if active
        if (sectorFilter && item.sector !== sectorFilter) {
            return false;
        }
        
        // Existing search filter
        if (searchQuery && !item.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        // Existing model status filter
        if (modelStatusFilter === 'active') {
            if (!savedModels.has(item.symbol) || !activeModels[item.symbol]?.isActive) {
                return false;
            }
        } else if (modelStatusFilter === 'paused') {
            if (!savedModels.has(item.symbol) || activeModels[item.symbol]?.isActive) {
                return false;
            }
        } else if (modelStatusFilter === 'unsaved') {
            if (savedModels.has(item.symbol)) {
                return false;
            }
        }

        // Existing volume filter
        if (volumeFilter !== 'all' && item.volumeCategory) {
            if (volumeFilter !== item.volumeCategory) {
                return false;
            }
        }

        // Existing sector filter (from sector analysis)
        if (selectedSector !== 'all' && item.sector) {
            if (selectedSector !== item.sector) {
                return false;
            }
        }

        // Existing R² filter
        if (rSquaredFilter !== 'all') {
            const rSquared = parseFloat(item.r_squared);
            if (rSquaredFilter === 'high' && rSquared < 0.7) {
                return false;
            } else if (rSquaredFilter === 'medium' && (rSquared < 0.4 || rSquared >= 0.7)) {
                return false;
            } else if (rSquaredFilter === 'low' && rSquared >= 0.4) {
                return false;
            }
        }
        
        // Existing category filter
        if (selectedCategory === 'all') return true;
        return item.category === selectedCategory;
    })
    // Sort by R² when filter is active
    .sort((a, b) => {
        if (rSquaredFilter !== 'all') {
            return parseFloat(b.r_squared) - parseFloat(a.r_squared);
        }
        return 0;
    });

    // ============================================================
    // FILTERED ASSETS LOGIC - Assets of Interest Feature
    // ============================================================

    // This gets the filtered list based on whether we're showing saved assets only
    const getFilteredAssetsList = () => {
        if (showingSavedOnly) {
            // Show only assets that were saved today
            return mssData.filter(asset => savedAssetSymbols.includes(asset.symbol));
        } else if (sectorFilter) {
            // Show assets from selected sector (from Sector Deep Dive)
            return mssData.filter(asset => asset.sector === sectorFilter);
        } else {
            // Show all assets (default view)
            return mssData;
        }
    };
    
    const stableAssets = filteredData.filter(item => item.category === 'stable');
    const choppyAssets = filteredData.filter(item => item.category === 'choppy');
    const volatileAssets = filteredData.filter(item => item.category === 'volatile');

    const hasVolumeData = mssData.some(item => item.relativeVolume !== null && item.relativeVolume !== undefined);

    const displayData = getSortedFilteredData();


// ============================================================
// COMPONENT — CorrelationModal (shared for both bulk modals)
// Now includes: Sentiment row, Trade Recs accordion with
// filterable/expandable table.
// ============================================================

const CorrelationModal = ({ config, onClose }) => {
    const { title, icon, data, line1Label, line2Label, line1Key, line2Key, breakdownTitle, breakdownItems } = config;

    const corrColor = data.recent_correlation >= 0.6 ? '#10b981'
                    : data.recent_correlation >= 0.3 ? '#f59e0b' : '#ef4444';

    // Filter trade recs
    const filteredRecs = (data.trade_recommendations || []).filter(r =>
        tradeRecFilter === 'ALL' || r.action === tradeRecFilter
    );

    // Action filter pills
    const actionCounts = {};
    (data.trade_recommendations || []).forEach(r => {
        actionCounts[r.action] = (actionCounts[r.action] || 0) + 1;
    });
    const filterOptions = ['ALL', ...Object.keys(actionCounts).sort((a, b) => {
        const order = { BUY: 0, HOLD: 1, WATCH: 2, TRIM: 3, SELL: 4, WAIT: 5 };
        return (order[a] ?? 99) - (order[b] ?? 99);
    })];

    return (
        <div className="corr-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="corr-modal">

            {/* Header */}
            <div className="corr-modal-header">
                <h2>{icon} {title}</h2>
                <button className="corr-modal-close" onClick={onClose}>✕</button>
            </div>

            {/* Regime Banner */}
            <div className="corr-regime-banner" style={{ background: data.regime_color + '22', border: `1px solid ${data.regime_color}55` }}>
                <div style={{ background: data.regime_color, padding: '6px 14px', borderRadius: '20px' }}>
                    <span className="corr-regime-label">{data.regime}</span>
                </div>
                <span className="corr-regime-desc">{data.regime_description}</span>
            </div>

            {/* Sentiment Row (new) */}
            {data.sector_sentiment && (
                <div className="corr-sentiment-row">
                    <div className="corr-sentiment-badge" style={{ background: data.sector_sentiment.color }}>
                        {data.sector_sentiment.label}
                    </div>
                    <div className="corr-sentiment-details">
                        <div className="corr-sentiment-score">
                            <strong>Score: {data.sector_sentiment.score}/100</strong>
                            &nbsp;•&nbsp;Confidence: <strong>{data.sector_sentiment.confidence}</strong>
                            &nbsp;•&nbsp;Timeframe: <strong>1h</strong>
                        </div>
                        <div className="corr-sentiment-desc">{data.sector_sentiment.description}</div>
                        {/* Sub-component scores */}
                        {data.sector_sentiment.components && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '5px', flexWrap: 'wrap' }}>
                                {Object.entries(data.sector_sentiment.components).map(([k, v]) => (
                                    <span key={k} style={{ fontSize: '10px', color: '#64748b' }}>
                                        {k.charAt(0).toUpperCase() + k.slice(1)}: <span style={{ color: v >= 60 ? '#10b981' : v <= 40 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{v}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div className="corr-stats-row">
                <div className="corr-stat-card">
                    <div className="corr-stat-label">Correlation</div>
                    <div className="corr-stat-value" style={{ color: corrColor }}>{data.full_correlation}</div>
                </div>
                <div className="corr-stat-card">
                    <div className="corr-stat-label">Recent Corr</div>
                    <div className="corr-stat-value" style={{ color: corrColor }}>{data.recent_correlation}</div>
                </div>
                <div className="corr-stat-card">
                    <div className="corr-stat-label">Beta</div>
                    <div className="corr-stat-value" style={{ color: data.beta > 1 ? '#60a5fa' : '#94a3b8' }}>{data.beta}</div>
                </div>
                <div className="corr-stat-card">
                    <div className="corr-stat-label">Divergence</div>
                    <div className="corr-stat-value" style={{ color: data.divergence_score > 0 ? '#10b981' : '#ef4444' }}>
                        {data.divergence_score > 0 ? '+' : ''}{data.divergence_score}
                    </div>
                </div>
                {data.alpha !== undefined && (
                    <div className="corr-stat-card">
                        <div className="corr-stat-label">Alpha</div>
                        <div className="corr-stat-value" style={{ color: data.alpha >= 0 ? '#10b981' : '#ef4444' }}>
                            {data.alpha > 0 ? '+' : ''}{data.alpha}%
                        </div>
                    </div>
                )}
                <div className="corr-stat-card">
                    <div className="corr-stat-label">Corr Trend</div>
                    <div className="corr-stat-value" style={{ fontSize: '15px', color: data.correlation_trend === 'rising' ? '#10b981' : data.correlation_trend === 'falling' ? '#ef4444' : '#94a3b8' }}>
                        {data.correlation_trend === 'rising' ? '📈' : data.correlation_trend === 'falling' ? '📉' : '➡️'} {data.correlation_trend}
                    </div>
                </div>
            </div>

            {/* Accordion: Chart */}
            <div className="corr-accordion">
                <button className={`corr-accordion-trigger ${modalAccordions.chart ? 'open' : ''}`} onClick={() => toggleAccordion('chart')}>
                    <span>📊 Price Comparison (1h)</span>
                    <span className="corr-acc-arrow">▼</span>
                </button>
                {modalAccordions.chart && (
                    <div className="corr-accordion-body">
                        <div className="corr-chart-wrap">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.timeseries} margin={{ top: 8, right: 12, left: -10, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
                                    <YAxis stroke="#475569" tick={{ fontSize: 9 }} domain={['auto','auto']} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px', color: '#cbd5e1' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                                    <Line type="monotone" dataKey={line1Key} stroke="#f59e0b" strokeWidth={2} dot={false} name={line1Label} />
                                    <Line type="monotone" dataKey={line2Key} stroke="#60a5fa" strokeWidth={2} dot={false} name={line2Label} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Accordion: Trade Recommendations (new) */}
            {data.trade_recommendations && data.trade_recommendations.length > 0 && (
                <div className="corr-accordion">
                    <button className={`corr-accordion-trigger ${modalAccordions.tradeRecs ? 'open' : ''}`} onClick={() => toggleAccordion('tradeRecs')}>
                        <span>🎯 Trade Recommendations ({data.trade_recommendations.length})</span>
                        <span className="corr-acc-arrow">▼</span>
                    </button>
                    {modalAccordions.tradeRecs && (
                        <div className="corr-accordion-body">
                            {/* Filter pills */}
                            <div className="trade-recs-toolbar">
                                <div className="trade-recs-filter">
                                    {filterOptions.map(opt => (
                                        <button key={opt} className={`trade-filter-btn ${tradeRecFilter === opt ? 'active' : ''}`}
                                                onClick={() => setTradeRecFilter(opt)}>
                                            {opt}{opt !== 'ALL' && actionCounts[opt] ? ` (${actionCounts[opt]})` : ''}
                                        </button>
                                    ))}
                                </div>
                                <span style={{ fontSize: '11px', color: '#475569' }}>Click row to expand</span>
                            </div>

                            {/* Table */}
                            <table className="trade-recs-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Stock</th>
                                        <th style={{ textAlign: 'right' }}>Return</th>
                                        <th style={{ textAlign: 'right' }}>Expected</th>
                                        <th style={{ textAlign: 'right' }}>Gap</th>
                                        <th style={{ textAlign: 'right' }}>Corr</th>
                                        <th style={{ textAlign: 'right' }}>Align</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecs.map((rec, i) => (
                                        <>
                                            <tr key={rec.symbol} style={{ cursor: 'pointer' }}
                                                onClick={() => setExpandedTradeRec(expandedTradeRec === rec.symbol ? null : rec.symbol)}>
                                                <td><span className="trade-action-badge" style={{ background: rec.action_color }}>{rec.action}</span></td>
                                                <td><span className="corr-ticker-badge">{rec.symbol}</span></td>
                                                <td style={{ textAlign: 'right', color: rec.stock_return >= 0 ? '#10b981' : '#ef4444' }}>
                                                    {rec.stock_return >= 0 ? '+' : ''}{rec.stock_return}%
                                                </td>
                                                <td style={{ textAlign: 'right', color: '#64748b' }}>
                                                    {rec.expected_return >= 0 ? '+' : ''}{rec.expected_return}%
                                                </td>
                                                <td style={{ textAlign: 'right', color: rec.return_gap >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                    {rec.return_gap >= 0 ? '+' : ''}{rec.return_gap}%
                                                </td>
                                                <td style={{ textAlign: 'right', color: rec.correlation >= 0.5 ? '#10b981' : rec.correlation >= 0.2 ? '#f59e0b' : '#ef4444' }}>
                                                    {rec.correlation?.toFixed(2)}
                                                </td>
                                                <td style={{ textAlign: 'right', color: rec.alignment_score >= 65 ? '#10b981' : rec.alignment_score >= 35 ? '#f59e0b' : '#ef4444' }}>
                                                    {rec.alignment_score}
                                                </td>
                                            </tr>
                                            {/* Expandable detail row */}
                                            {expandedTradeRec === rec.symbol && (
                                                <tr key={`${rec.symbol}-detail`}>
                                                    <td colSpan={7} style={{ padding: '4px 8px 10px' }}>
                                                        <div className="trade-rec-detail">
                                                            <div className="trade-rec-detail-row"><strong>📋 Rationale:</strong> {rec.rationale}</div>
                                                            <div className="trade-rec-detail-row"><strong>📍 Entry:</strong> {rec.entry}</div>
                                                            <div className="trade-rec-detail-row"><strong>⚖️ Risk/Reward:</strong> {rec.risk_reward}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>

                            {filteredRecs.length === 0 && (
                                <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '16px 0' }}>
                                    No stocks match this filter.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Accordion: Insights */}
            <div className="corr-accordion">
                <button className={`corr-accordion-trigger ${modalAccordions.insights ? 'open' : ''}`} onClick={() => toggleAccordion('insights')}>
                    <span>💡 Insights & Signals</span>
                    <span className="corr-acc-arrow">▼</span>
                </button>
                {modalAccordions.insights && (
                    <div className="corr-accordion-body">
                        <ul className="corr-insights-list">
                            {data.insights.map((ins, i) => <li key={i}>{ins}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            {/* Accordion: Breakdown */}
            <div className="corr-accordion">
                <button className={`corr-accordion-trigger ${modalAccordions.breakdown ? 'open' : ''}`} onClick={() => toggleAccordion('breakdown')}>
                    <span>{breakdownTitle}</span>
                    <span className="corr-acc-arrow">▼</span>
                </button>
                {modalAccordions.breakdown && (
                    <div className="corr-accordion-body">
                        <table className="corr-breakdown-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th style={{ textAlign: 'right' }}>Correlation</th>
                                    <th style={{ textAlign: 'right' }}>Period Return</th>
                                    {data.top_contributors && <th style={{ textAlign: 'right' }}>Weight</th>}
                                    {data.top_contributors && <th style={{ textAlign: 'right' }}>Contribution</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {breakdownItems.map((item, i) => (
                                    <tr key={i}>
                                        <td><span className="corr-ticker-badge">{item.ticker || item.symbol}</span></td>
                                        <td style={{ textAlign: 'right', color: (item.correlation ?? 0) >= 0.5 ? '#10b981' : (item.correlation ?? 0) >= 0.2 ? '#f59e0b' : '#ef4444' }}>
                                            {item.correlation?.toFixed(3) ?? '—'}
                                        </td>
                                        <td style={{ textAlign: 'right', color: (item.period_return ?? item.return ?? 0) >= 0 ? '#10b981' : '#ef4444' }}>
                                            {(item.period_return ?? item.return ?? 0) >= 0 ? '+' : ''}{(item.period_return ?? item.return ?? 0).toFixed(2)}%
                                        </td>
                                        {data.top_contributors && <td style={{ textAlign: 'right', color: '#94a3b8' }}>{item.weight}%</td>}
                                        {data.top_contributors && (
                                            <td style={{ textAlign: 'right', color: item.contribution >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                                {item.contribution >= 0 ? '+' : ''}{item.contribution.toFixed(2)}%
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="corr-modal-footer">
                {data.timeframe && <span>Timeframe: 1h &nbsp;•&nbsp;</span>}
                Analysed {data.commodities_analyzed || data.tech_stocks_analyzed || '—'} assets
                &nbsp;•&nbsp;{data.timestamp && new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
    );
};


// ============================================================
// COMPONENT — StockAlignmentPanel (per-card, collapsible)
// Now includes: stock sentiment badge + trade rec card
// ============================================================

const StockAlignmentPanel = ({ symbol, data, onToggle, isOpen }) => {
    const scoreColor = data.alignment_score >= 65 ? '#10b981' : data.alignment_score >= 35 ? '#f59e0b' : '#ef4444';
    const rec = data.trade_recommendation || {};

    // Trade rec card background tint
    const recBg = rec.action === 'BUY'  ? 'rgba(16,185,129,0.08)'
               : rec.action === 'SELL' ? 'rgba(239,68,68,0.08)'
               : rec.action === 'HOLD' ? 'rgba(59,130,246,0.08)'
               : rec.action === 'TRIM' ? 'rgba(245,158,11,0.08)'
               : 'rgba(107,114,128,0.08)';
    const recBorder = rec.action_color || '#6366f1';

    return (
        <div className="stock-alignment-panel">
            {/* Header */}
            <div className="align-panel-header" onClick={onToggle}>
                <div className="align-panel-header-left">
                    <span style={{ fontSize: '18px' }}>🌾</span>
                    <span className="align-panel-title">Commodity Alignment — {symbol}</span>
                </div>
                <span className={`align-panel-chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="align-panel-body">

                    {/* Signal Banner */}
                    <div className="align-signal-banner" style={{ background: data.signal_color }}>
                        {data.signal === 'OUTPERFORMING' && '📈 '}
                        {data.signal === 'UNDERPERFORMING' && '📉 '}
                        {data.signal === 'ALIGNED' && '✅ '}
                        <strong>{data.signal}</strong> — {data.signal_description}
                    </div>

                    {/* Stock Sentiment Badge (new) */}
                    {data.stock_sentiment && (
                        <div className="align-stock-sentiment">
                            <div className="align-stock-sentiment-badge" style={{ background: data.stock_sentiment.color }}>
                                {data.stock_sentiment.label}
                            </div>
                            <div className="align-stock-sentiment-info">
                                <strong style={{ color: '#c7d2fe' }}>Score: {data.stock_sentiment.score}/100</strong>
                                &nbsp;• Confidence: {data.stock_sentiment.confidence} • 1h
                                <br/>{data.stock_sentiment.description}
                            </div>
                        </div>
                    )}

                    {/* Trade Rec Card (new) */}
                    {rec.action && (
                        <div className="align-trade-rec-card" style={{ background: recBg, borderColor: recBorder }}>
                            <div className="align-trade-rec-header">
                                <span className="align-trade-rec-action" style={{ background: rec.action_color }}>{rec.action}</span>
                                <span className="align-trade-rec-confidence">Confidence: {rec.sector_confidence}</span>
                            </div>
                            <div className="align-trade-rec-body">
                                <div className="align-trade-rec-row"><strong>📋 Why:</strong> {rec.rationale}</div>
                                <div className="align-trade-rec-row"><strong>📍 Entry:</strong> {rec.entry}</div>
                                <div className="align-trade-rec-row"><strong>⚖️ Risk/Reward:</strong> {rec.risk_reward}</div>
                            </div>
                        </div>
                    )}

                    {/* Score Ring + Details */}
                    <div className="align-score-ring">
                        <div className="align-score-circle" style={{ borderColor: scoreColor }}>
                            <span className="align-score-number" style={{ color: scoreColor }}>{data.alignment_score}</span>
                            <span className="align-score-sub">Score</span>
                        </div>
                        <div className="align-score-details">
                            <div className="align-score-detail-row">Correlation: <strong style={{ color: scoreColor }}>{data.correlation}</strong></div>
                            <div className="align-score-detail-row">Beta: <strong style={{ color: '#a5b4fc' }}>{data.beta}</strong></div>
                            <div className="align-score-detail-row">Gap: <strong style={{ color: data.return_gap >= 0 ? '#10b981' : '#ef4444' }}>{data.return_gap >= 0 ? '+' : ''}{data.return_gap}%</strong></div>
                        </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="align-mini-stats">
                        <div className="align-mini-stat">
                            <div className="align-mini-stat-label">Expected</div>
                            <div className="align-mini-stat-value" style={{ color: data.expected_return >= 0 ? '#10b981' : '#ef4444' }}>
                                {data.expected_return >= 0 ? '+' : ''}{data.expected_return}%
                            </div>
                        </div>
                        <div className="align-mini-stat">
                            <div className="align-mini-stat-label">Actual</div>
                            <div className="align-mini-stat-value" style={{ color: data.actual_return >= 0 ? '#10b981' : '#ef4444' }}>
                                {data.actual_return >= 0 ? '+' : ''}{data.actual_return}%
                            </div>
                        </div>
                        <div className="align-mini-stat">
                            <div className="align-mini-stat-label">Basket</div>
                            <div className="align-mini-stat-value" style={{ color: data.commodity_total_return >= 0 ? '#10b981' : '#ef4444' }}>
                                {data.commodity_total_return >= 0 ? '+' : ''}{data.commodity_total_return}%
                            </div>
                        </div>
                        <div className="align-mini-stat">
                            <div className="align-mini-stat-label">Alignment</div>
                            <div className="align-mini-stat-value" style={{ color: scoreColor }}>{data.alignment_score}/100</div>
                        </div>
                    </div>

                    {/* Per-Commodity Correlations */}
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                            Per-Commodity Correlation (1h)
                        </div>
                        {(data.per_commodity_correlations || []).slice(0, 4).map((item, i) => (
                            <div key={i} className="align-comm-row">
                                <span className="align-comm-ticker">{item.ticker}</span>
                                <span style={{ display: 'flex', gap: '16px' }}>
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>{item.period_return >= 0 ? '+' : ''}{item.period_return}%</span>
                                    <span style={{ color: Math.abs(item.correlation) >= 0.5 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                                        {item.correlation >= 0 ? '+' : ''}{item.correlation.toFixed(2)}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

       

        useEffect(() => {
           fetchTodaysSavedAssets('stocks');
       }, []);


return (
    <div>
        <style>{styles}{correlationModalStyles}{techSubsectorModalStyles}{institutionalRetailStyles}{sectorDeepDiveStyles}{assetInterestStyles}{tradeExecutionStyles}{trendAgeStyles}</style>
        <Header />
        <SideNavs />
        <div className="mss-wrapper">
            <div className="mss-header">
                <h1>Market Stability Score</h1>
                <p>The Market Stability Score (MSS) evaluates asset tradability based on volatility, trend clarity, and liquidity. Higher scores indicate better trading conditions.</p>
            </div>

            <div className="mss-controls">
                <div className="control-row">
                    <div className="control-group">
                        <label>Asset Class:</label>
                        <select 
                            value={selectedAssetClass} 
                            onChange={(e) => setSelectedAssetClass(e.target.value)}
                            disabled={loading}
                        >
                            <option value="forex">Forex</option>
                            <option value="stocks">Stocks</option>
                            <option value="indices">Stock Indices</option>
                            <option value="commodities">Commodities</option>
                            <option value="bonds">Bonds & Yields</option>
                            <option value="custom">Custom Symbols</option>
                        </select>
                    </div>

                    {selectedAssetClass === 'custom' && (
                        <div className="control-group">
                            <label>Symbols (comma-separated):</label>
                            <input
                                type="text"
                                value={customSymbols}
                                onChange={(e) => setCustomSymbols(e.target.value)}
                                placeholder="AAPL, MSFT, TSLA"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="control-group">
                        <label>Period (days):</label>
                        <select 
                            value={period} 
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setPeriod(val);
                                if (val !== 0) {
                                    setCustomPeriod('');
                                }
                            }}
                            disabled={loading}
                        >
                            <option value={10}>10 Days</option>
                            <option value={15}>15 Days</option>
                            <option value={20}>20 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={60}>60 Days</option>
                            <option value={90}>90 Days</option>
                            <option value={180}>180 Days</option>
                            <option value={0}>Custom...</option>
                        </select>
                    </div>

                    {period === 0 && (
                        <div className="control-group">
                            <label>Custom Period (days):</label>
                            <input
                                type="number"
                                value={customPeriod}
                                onChange={(e) => setCustomPeriod(e.target.value)}
                                placeholder="Enter days (e.g., 45)"
                                min="1"
                                max="730"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <button 
                        className="mss-calculate-btn"
                        onClick={calculateMSS}
                        disabled={loading}
                    >
                        {loading ? 'Calculating...' : 'Calculate MSS'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="mss-loading">
                    <div className="spinner"></div>
                    <p>Analyzing market data...</p>
                </div>
            )}

            {!loading && mssData.length > 0 && (
                <>
                    <div className="mss-summary">
                        <div className="summary-card stable">
                            <h3>🟢 Stable</h3>
                            <p className="big-number">{stableAssets.length}</p>
                            <p className="label">Assets (MSS ≥ 60)</p>
                        </div>
                        <div className="summary-card choppy">
                            <h3>🟡 Choppy</h3>
                            <p className="big-number">{choppyAssets.length}</p>
                            <p className="label">Assets (40-60)</p>
                        </div>
                        <div className="summary-card volatile">
                            <h3>🔴 Volatile</h3>
                            <p className="big-number">{volatileAssets.length}</p>
                            <p className="label">Assets (MSS &lt; 40)</p>
                        </div>
                    </div>

                    <div className="search-filter-container">
                        <input
                            type="text"
                            className="search-box"
                            placeholder="🔍 Search by asset name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${modelStatusFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setModelStatusFilter('all')}
                            >
                                All Models
                            </button>
                            <button
                                className={`filter-btn ${modelStatusFilter === 'active' ? 'active' : ''}`}
                                onClick={() => setModelStatusFilter('active')}
                            >
                                ▶️ Active
                            </button>
                            <button
                                className={`filter-btn ${modelStatusFilter === 'paused' ? 'active' : ''}`}
                                onClick={() => setModelStatusFilter('paused')}
                            >
                                ⏸️ Paused
                            </button>
                            <button
                                className={`filter-btn ${modelStatusFilter === 'unsaved' ? 'active' : ''}`}
                                onClick={() => setModelStatusFilter('unsaved')}
                            >
                                💾 Unsaved
                            </button>
                            {/* NEW BATCH UPDATE BUTTON */}
                            <button
                                className="mss-calculate-btn"
                                onClick={batchUpdateAllModels}
                                disabled={batchUpdating || savedModels.size === 0}
                                style={{ 
                                    padding: '12px 24px', 
                                    fontSize: '14px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    marginLeft: '12px'
                                }}
                            >
                                {batchUpdating ? '🔄 Updating All Models...' : '🔄 Auto-Update All Models'}
                            </button>
                        </div>
                        <div className="filter-buttons" style={{ marginTop: '12px' }}>
                            <button
                                className="mss-calculate-btn"
                                onClick={calculateRelativeVolume}
                                disabled={loadingVolume}
                                style={{ padding: '12px 24px', fontSize: '14px' }}
                            >
                                {loadingVolume ? '📊 Calculating Volume...' : '📊 Calculate Relative Volume'}
                            </button>
                            {selectedAssetClass === 'stocks' && (
                                <>
                                    {!sectorData ? (
                                        <button
                                            className="mss-calculate-btn"
                                            onClick={analyzeSectorPerformance}
                                            disabled={loadingSectors}
                                            style={{ padding: '12px 24px', fontSize: '14px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
                                        >
                                            {loadingSectors ? '🎯 Analyzing Sectors...' : '🎯 Analyze Sectors'}
                                        </button>
                                    ) : (
                                        <button
                                            className="sector-toggle-btn"
                                            onClick={() => setShowSectorAnalysis(!showSectorAnalysis)}
                                            style={{ padding: '12px 24px', fontSize: '14px' }}
                                        >
                                            {showSectorAnalysis ? '👁️ Hide Sector Analysis' : '👁️ Show Sector Analysis'}
                                        </button>
                                    )}
                                </>
                            )}
                            {hasVolumeData && (
                                <>
                                    <button
                                        className={`filter-btn ${volumeFilter === 'all' ? 'active' : ''}`}
                                        onClick={() => setVolumeFilter('all')}
                                    >
                                        All Volume
                                    </button>
                                    <button
                                        className={`filter-btn ${volumeFilter === 'high' ? 'active' : ''}`}
                                        onClick={() => setVolumeFilter('high')}
                                    >
                                        🔥 High Volume
                                    </button>
                                    <button
                                        className={`filter-btn ${volumeFilter === 'average' ? 'active' : ''}`}
                                        onClick={() => setVolumeFilter('average')}
                                    >
                                        📊 Average Volume
                                    </button>
                                    <button
                                        className={`filter-btn ${volumeFilter === 'low' ? 'active' : ''}`}
                                        onClick={() => setVolumeFilter('low')}
                                    >
                                        💤 Low Volume
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="filter-buttons" style={{ marginTop: '12px' }}>
                        <button
                            className={`filter-btn ${rSquaredFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setRSquaredFilter('all')}
                        >
                            All R² Values
                        </button>
                        <button
                            className={`filter-btn ${rSquaredFilter === 'high' ? 'active' : ''}`}
                            onClick={() => setRSquaredFilter('high')}
                        >
                            🎯 Strong Trend (R² ≥ 0.7)
                        </button>
                        <button
                            className={`filter-btn ${rSquaredFilter === 'medium' ? 'active' : ''}`}
                            onClick={() => setRSquaredFilter('medium')}
                        >
                            📊 Moderate Trend (0.4-0.7)
                        </button>
                        <button
                            className={`filter-btn ${rSquaredFilter === 'low' ? 'active' : ''}`}
                            onClick={() => setRSquaredFilter('low')}
                        >
                            💤 Weak Trend (R² less than 0.4)
                        </button>
                    </div>

                    <br />
                    {/* Add this with your other bulk analysis buttons */}
                    <button
                        className="mss-calculate-btn"
                        onClick={getAllAverageDailyRanges}
                        disabled={loadingAllADR || filteredData.length === 0}
                        style={{ 
                            padding: '12px 24px', 
                            fontSize: '14px',
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                        }}
                    >
                        {loadingAllADR ? '📊 Calculating...' : '📊 Calculate All ADR'}
                    </button><br /><br />
                    <button
                        className="mss-calculate-btn"
                        onClick={analyzeAllMeanReversion}
                        disabled={loadingAllMeanReversion || filteredData.length === 0}
                        style={{ 
                            padding: '12px 24px', 
                            fontSize: '14px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            marginLeft: '10px'
                        }}
                    >
                        {loadingAllMeanReversion ? '🔄 Analyzing...' : '🔄 Analyze All Mean Reversion'}
                    </button><br /><br />
                    <button
                        className="mss-calculate-btn"
                        onClick={fetchCommodityVsMaterials}
                        disabled={loadingCommodityVsMaterials}
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
                        }}
                    >
                        {loadingCommodityVsMaterials ? '🌾 Analyzing...' : '🌾 Commodities vs Materials'}
                    </button><br /><br />


                    <button
                        className="mss-calculate-btn"
                        onClick={fetchSp500VsTech}
                        disabled={loadingSp500VsTech}
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                        }}
                    >
                        {loadingSp500VsTech ? '📈 Analyzing...' : '📈 S&P 500 vs Tech'}
                    </button><br /><br />
                    <button className="mss-calculate-btn" onClick={fetchTechSubsectorAnalysis}
                            disabled={loadingTechSubsector}
                            style={{ padding:'12px 24px', fontSize:'14px',
                                        background:'linear-gradient(135deg,#0891b2 0%,#06b6d4 100%)' }}>
                        {loadingTechSubsector ? '💻 Analyzing...' : '💻 Tech Subsectors'}
                    </button><br /><br />
                    
                    <div className="sector-selector-group">
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', width: '100%' }}>
                            🏢 Sector Deep Dive:
                        </div>
                        {AVAILABLE_SECTORS.map(sector => (
                        <button
                            key={sector}
                            className={`sector-select-btn ${selectedSector === sector ? 'active' : ''}`}
                            onClick={() => fetchSectorDeepDive(sector)}
                            disabled={loadingSectorDive && selectedSector === sector}
                        >
                            {loadingSectorDive && selectedSector === sector ? '⏳' : ''} {sector}
                        </button>
                    ))}<br /><br />
                    <button
                        className="sector-select-btn"
                        onClick={() => {
                            setSectorFilter(null);
                            setSelectedSector("all");  // Add this line
                        }}
                        style={{ 
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            borderColor: '#ef4444',
                            color: 'white',
                            fontSize: '12px',
                            padding: '6px 12px'
                        }}
                    >
                        ✕ Show All Assets
                    </button><br /><br />
                    <button 
                        className={`show-saved-assets-btn ${showingSavedOnly ? 'active' : ''}`}
                        onClick={toggleShowSavedOnly}
                    >
                        {showingSavedOnly ? '✓ Showing Saved Assets' : '⭐ Show Saved Assets'}
                    </button><br /><br />

                        <button
                            className="trend-age-bulk-btn"
                            onClick={() => fetchTrendAgeBulk(allSymbols)}
                            disabled={loadingTrendAge}
                        >
                            {loadingTrendAge ? '⏳ Analyzing...' : '📊 Trend Age Analyzer'}
                        </button>
                                        


                </div>
                    {/* NEW: Trend Duration Controls */}
                    <div className="filter-buttons" style={{ marginTop: '12px' }}>
                        <button
                            className="mss-calculate-btn"
                            onClick={getAllTrendDurations}
                            disabled={loadingAllDurations || filteredData.length === 0}
                            style={{ 
                                padding: '12px 24px', 
                                fontSize: '14px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
                            }}
                        >
                            
                            {loadingAllDurations ? '⏱️ Analyzing...' : '⏱️ Analyze All Trend Durations'}
                        </button><br />

                        <button
                            className="mss-calculate-btn"
                            onClick={fetchAllCharts}
                            disabled={loadingAllCharts || filteredData.length === 0 || !tvLoaded}
                            style={{ 
                                padding: '12px 24px', 
                                fontSize: '14px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            }}
                        >
                            {loadingAllCharts ? '📊 Loading...' : !tvLoaded ? '⏳ Loading Charts...' : '📊 View All Charts'}
                        </button><br />
                        
                        
                        {Object.keys(trendDurations).length > 0 && (
                            <button
                                className="filter-btn"
                                onClick={sortByTrendDuration}
                                style={{ marginLeft: '12px' }}
                            >
                                {durationSortOrder === 'desc' ? '⬇️ Longest First' : '⬆️ Shortest First'}
                            </button>
                        )}
                    </div><br />

                    {showSectorAnalysis && sectorData && (
                        <div className="sector-analysis-container">
                            <div className="sector-header">
                                <h2>📊 Sector Performance Analysis</h2>
                                <button className="sector-close-btn" onClick={() => setShowSectorAnalysis(false)}>
                                    ✕ Close
                                </button>
                            </div>

                            <div className="sector-stats-grid">
                                <div className="sector-stat-card">
                                    <div className="sector-stat-label">Total Sectors</div>
                                    <div className="sector-stat-value">{sectorData.sector_performance?.length || 0}</div>
                                </div>
                                <div className="sector-stat-card">
                                    <div className="sector-stat-label">Strongest Sector</div>
                                    <div className="sector-stat-value" style={{ fontSize: '16px' }}>
                                        {sectorData.sector_performance?.[0]?.sector || 'N/A'}
                                    </div>
                                </div>
                                <div className="sector-stat-card">
                                    <div className="sector-stat-label">Avg Sector Return</div>
                                    <div className="sector-stat-value" style={{ color: sectorData.overall_avg_return >= 0 ? '#059669' : '#dc2626' }}>
                                        {sectorData.overall_avg_return?.toFixed(2)}%
                                    </div>
                                </div>
                                <div className="sector-stat-card">
                                    <div className="sector-stat-label">Total Money Flow</div>
                                    <div className="sector-stat-value" style={{ fontSize: '16px' }}>
                                        ${(sectorData.total_volume_dollars / 1e9).toFixed(2)}B
                                    </div>
                                </div>
                            </div>

                            <div className="sector-filters">
                                <button
                                    className={`sector-filter-btn ${selectedSector === 'all' ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedSector('all');
                                        setSelectedStock(null);
                                        setStockVsSectorData(null);
                                    }}
                                >
                                    All Sectors
                                </button>
                                {sectorData.sector_performance?.map(sector => (
                                    <button
                                        key={sector.sector}
                                        className={`sector-filter-btn ${selectedSector === sector.sector ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedSector(sector.sector);
                                            setSelectedStock(null);
                                            setStockVsSectorData(null);
                                        }}
                                    >
                                        {sector.sector} ({sector.avg_return >= 0 ? '+' : ''}{sector.avg_return.toFixed(1)}%)
                                    </button>
                                    
                                ))}
                                {selectedSector !== 'all' && (
                                    <button
                                        className="mss-calculate-btn"
                                        onClick={() => fetchSectorCharts(selectedSector)}
                                        disabled={loadingAllCharts || !tvLoaded}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '13px',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        {loadingAllCharts ? '📊 Loading...' : `📊 View ${selectedSector} Charts`}
                                    </button>
                                )}
                            </div>

                            <div className="sector-charts-grid">
                                {sectorData.sector_timeseries
                                    ?.filter(sectorTS => selectedSector === 'all' || sectorTS.sector === selectedSector)
                                    .map(sectorTS => {
                                        const baselineValue = sectorTS.data[0]?.index || 100;
                                        const enhancedData = sectorTS.data.map(point => ({
                                            ...point,
                                            change_pct: parseFloat(((point.index - baselineValue) / baselineValue * 100).toFixed(2))
                                        }));
                                        
                                        const values = enhancedData.map(d => d.change_pct);
                                        const minValue = Math.min(...values);
                                        const maxValue = Math.max(...values);
                                        const range = maxValue - minValue;
                                        const padding = range * 0.15;
                                        const yMin = minValue - padding;
                                        const yMax = maxValue + padding;
                                        
                                        const latestChange = enhancedData[enhancedData.length - 1]?.change_pct || 0;
                                        
                                        return (
                                            <div key={sectorTS.sector} className="sector-chart-container">
                                                <div className="sector-chart-title">
                                                    {sectorTS.sector} - Performance
                                                    <span style={{ 
                                                        marginLeft: '10px',
                                                        color: latestChange >= 0 ? '#059669' : '#dc2626',
                                                        fontWeight: 700
                                                    }}>
                                                        ({latestChange >= 0 ? '+' : ''}{latestChange.toFixed(2)}%)
                                                    </span>
                                                </div>
                                                <div style={{ width: '100%', height: '280px' }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart 
                                                            data={enhancedData} 
                                                            margin={{ top: 10, right: 15, left: 5, bottom: 10 }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                            <XAxis 
                                                                dataKey="date" 
                                                                stroke="#6b7280"
                                                                style={{ fontSize: '8px' }}
                                                                interval="preserveStartEnd"
                                                                tick={{ fontSize: 8 }}
                                                                height={30}
                                                            />
                                                            <YAxis 
                                                                stroke="#6b7280"
                                                                style={{ fontSize: '8px' }}
                                                                width={32}
                                                                domain={[yMin, yMax]}
                                                                tick={{ fontSize: 8 }}
                                                            />
                                                            <Tooltip 
                                                                contentStyle={{ 
                                                                    background: 'white', 
                                                                    border: '2px solid #2563eb',
                                                                    borderRadius: '8px',
                                                                    padding: '6px',
                                                                    fontSize: '10px'
                                                                }}
                                                            />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="change_pct" 
                                                                stroke="#2563eb" 
                                                                strokeWidth={2}
                                                                name="% Change"
                                                                dot={false}
                                                                isAnimationActive={false}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {selectedStock && stockVsSectorData && (
                                <div className="stock-comparison-container">
                                    <div className="stock-comparison-header">
                                        <h3>📈 {selectedStock} vs {stockVsSectorData.sector} Sector</h3>
                                        <button 
                                            className="sector-close-btn"
                                            onClick={() => { setSelectedStock(null); setStockVsSectorData(null); }}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>
                                    <div className="comparison-chart">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={stockVsSectorData.comparison_data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#6b7280"
                                                    style={{ fontSize: '11px' }}
                                                />
                                                <YAxis 
                                                    stroke="#6b7280"
                                                    style={{ fontSize: '11px' }}
                                                    domain={['auto', 'auto']}
                                                    label={{ value: '% Return', angle: -90, position: 'insideLeft', style: { fontSize: '11px' } }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        background: 'white', 
                                                        border: '2px solid #2563eb',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Legend />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="stock_return" 
                                                    stroke="#2563eb" 
                                                    strokeWidth={2}
                                                    name={`${selectedStock} %`}
                                                    dot={false}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="sector_return" 
                                                    stroke="#ef4444" 
                                                    strokeWidth={2}
                                                    name={`${stockVsSectorData.sector} %`}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderRadius: '8px' }}>
                                        <p style={{ margin: '5px 0', color: '#1e40af', fontWeight: 600 }}>
                                            <strong>Stock Performance:</strong> {stockVsSectorData.stock_performance >= 0 ? '+' : ''}{stockVsSectorData.stock_performance.toFixed(2)}%
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#1e40af', fontWeight: 600 }}>
                                            <strong>Sector Performance:</strong> {stockVsSectorData.sector_performance >= 0 ? '+' : ''}{stockVsSectorData.sector_performance.toFixed(2)}%
                                        </p>
                                        <p style={{ margin: '5px 0', color: stockVsSectorData.outperformance >= 0 ? '#059669' : '#dc2626', fontWeight: 700 }}>
                                            <strong>Outperformance:</strong> {stockVsSectorData.outperformance >= 0 ? '+' : ''}{stockVsSectorData.outperformance.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="category-filter">
                        <button 
                            className={selectedCategory === 'all' ? 'active' : ''}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All ({filteredData.length})
                        </button>
                        <button 
                            className={selectedCategory === 'stable' ? 'active' : ''}
                            onClick={() => setSelectedCategory('stable')}
                        >
                            Stable ({stableAssets.length})
                        </button>
                        <button 
                            className={selectedCategory === 'choppy' ? 'active' : ''}
                            onClick={() => setSelectedCategory('choppy')}
                        >
                            Choppy ({choppyAssets.length})
                        </button>
                        <button 
                            className={selectedCategory === 'volatile' ? 'active' : ''}
                            onClick={() => setSelectedCategory('volatile')}
                        >
                            Volatile ({volatileAssets.length})
                        </button>
                    </div>

                    <div className="mss-grid">
                        {filteredData.map((asset, index) => (
                            <div key={index} className="mss-card">
                                <div className="card-header">
                                    <div className="card-header-left">
                                        <h4>{asset.symbol}</h4>
                                        {asset.sector && (
                                            <span className={`sector-name-badge sector-${asset.sector.replace(/\s+/g, '-')}`}>
                                                🏢 {asset.sector}
                                            </span>
                                        )}
                                        {asset.trend && (
                                            <span className={`trend-badge ${asset.trend}`}>
                                                {asset.trend === 'uptrend' ? '📈 ' : asset.trend === 'downtrend' ? '📉 ' : '➡️ '}
                                                {asset.trend.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <a 
                                            href={`https://www.tradingview.com/chart/?symbol=${asset.symbol}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="chart-link"
                                        >
                                            📈 Chart
                                        </a>
                                        <button
                                            className="monte-carlo-btn"
                                            onClick={() => runMonteCarloSimulation(asset.symbol)}
                                            disabled={monteCarloLoading[asset.symbol]}
                                        >
                                            {monteCarloLoading[asset.symbol] ? '🎲 Simulating...' : '🎲 Monte Carlo'}
                                        </button>
                                        {savedModels.has(asset.symbol) ? (
                                            <>
                                                {activeModels[asset.symbol]?.isActive ? (
                                                    <button
                                                        className="deactivate-model-btn"
                                                        onClick={() => deactivateModel(asset)}
                                                        disabled={deactivatingModels[asset.symbol]}
                                                    >
                                                        {deactivatingModels[asset.symbol] ? '⏸️ Pausing...' : '⏸️ Pause'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="save-model-btn reactivate"
                                                        onClick={() => reactivateModel(asset)}
                                                        disabled={deactivatingModels[asset.symbol]}
                                                    >
                                                        {deactivatingModels[asset.symbol] ? '▶️ Activating...' : '▶️ Reactivate'}
                                                    </button>
                                                )}
                                                <button
                                                    className="delete-model-btn"
                                                    onClick={() => deleteModel(asset)}
                                                    disabled={deletingModels[asset.symbol]}
                                                >
                                                    {deletingModels[asset.symbol] ? '🗑️ Deleting...' : '🗑️ Delete'}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="save-model-btn"
                                                onClick={() => saveToForwardTest(asset)}
                                                disabled={
                                                    savingModels[asset.symbol] || 
                                                    !asset.trend ||
                                                    asset.trend === 'ranging'
                                                }
                                            >
                                                {savingModels[asset.symbol] ? '💾 Saving...' : '💾 Save Model'}
                                            </button>
                                        )}
                                        {!asset.symbol.includes('=') && !asset.symbol.startsWith('^') && sectorData && asset.sector && (
                                            <button
                                                className="chart-link"
                                                onClick={() => compareStockToSector(asset.symbol)}
                                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
                                            >
                                                🎯 vs Sector
                                            </button>
                                        )}
                                        <button
                                            className="analyze-asset-btn"
                                            onClick={() => analyzeAssetSentiment(asset.symbol)}
                                            disabled={analyzingAsset[asset.symbol]}
                                        >
                                            {analyzingAsset[asset.symbol] ? '🤖 Analyzing...' : '🤖 AI Analysis'}
                                        </button>
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => calculateRetracementEntry(asset.symbol)}
                                            disabled={loadingRetracement[asset.symbol]}
                                        >
                                            {loadingRetracement[asset.symbol] ? '📊 Calculating...' : '📊 Entry Points'}
                                        </button>
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => calculateTrendElasticity(asset.symbol)}
                                            disabled={loadingElasticity[asset.symbol]}
                                            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}
                                        >
                                            {loadingElasticity[asset.symbol] ? '⚡ Calculating...' : '⚡ Trend Elasticity'}
                                        </button>
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => getTrendDuration(asset.symbol)}
                                            disabled={loadingDurations[asset.symbol]}
                                            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                                        >
                                            {loadingDurations[asset.symbol] ? '⏱️ Analyzing...' : '⏱️ Trend Age'}
                                        </button>
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => getAverageDailyRange(asset.symbol)}
                                            disabled={loadingADR[asset.symbol]}
                                            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}
                                        >
                                            {loadingADR[asset.symbol] ? '📊 Calculating...' : '📊 Daily Range'}
                                        </button>
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => analyzeMeanReversion(asset.symbol)}
                                            disabled={loadingMeanReversion[asset.symbol]}
                                            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                                        >
                                            {loadingMeanReversion[asset.symbol] ? '🔄 Analyzing...' : '🔄 Mean Reversion'}
                                        </button>
                                        {/* Sector Peers button - only for stocks */}
                                        {!asset.symbol.includes('=') && !asset.symbol.startsWith('^') && asset.sector && (
                                            <button
                                                className="calculate-retracement-btn"
                                                onClick={() => fetchSectorPeersIndex(asset.symbol)}
                                                disabled={loadingSectorPeers[asset.symbol]}
                                                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                                            >
                                                {loadingSectorPeers[asset.symbol] ? '📊 Loading...' : '📊 vs Sector Peers'}
                                            </button>
                                        )}
                                        {asset.sector === 'Materials' && (
                                            <button
                                                className="stock-alignment-toggle"
                                                onClick={() => {
                                                    if (stockAlignmentData[asset.symbol]) {
                                                        // Already fetched — just toggle visibility
                                                        setShowAlignmentPanel(prev => ({
                                                            ...prev,
                                                            [asset.symbol]: !prev[asset.symbol]
                                                        }));
                                                    } else {
                                                        fetchStockCommodityAlignment(asset.symbol);
                                                    }
                                                }}
                                                disabled={loadingStockAlignment[asset.symbol]}
                                            >
                                                {loadingStockAlignment[asset.symbol] ? '🌾 Analyzing...' : '🌾 Commodity Fit'}
                                            </button>
                                        )}
                                        {asset.sector === 'Technology' && (
                                            <button className="tech-peer-toggle"
                                                    onClick={() => {
                                                        if (techPeerData[asset.symbol])
                                                            setShowTechPeerPanel(p => ({ ...p, [asset.symbol]: !p[asset.symbol] }));
                                                        else
                                                            fetchTechPeerAlignment(asset.symbol);
                                                    }}
                                                    disabled={loadingTechPeer[asset.symbol]}>
                                                {loadingTechPeer[asset.symbol] ? '💻 Analyzing...' : '💻 vs Peers'}
                                            </button>
                                        )}

                                          <button className="inst-retail-toggle"
                                                onClick={() => {
                                                    if (instRetailData[asset.symbol])
                                                        setShowInstRetailPanel(p => ({ ...p, [asset.symbol]: !p[asset.symbol] }));
                                                    else
                                                        fetchInstRetailAnalysis(asset.symbol);
                                                }}
                                                disabled={loadingInstRetail[asset.symbol]}>
                                            {loadingInstRetail[asset.symbol] ? '🏛️ Analyzing...' : '🏛️ Inst vs Retail'}
                                        </button>

                                          {/* Asset of Interest Button */}
                                          <button
                                            className={`asset-interest-btn ${assetsSaved[asset.symbol] ? 'saved' : ''}`}
                                            onClick={() => toggleAssetOfInterest(asset.symbol, 'stocks', asset.sector)}
                                            disabled={loadingSaveAsset[asset.symbol]}
                                        >
                                            {loadingSaveAsset[asset.symbol] ? '⏳' : (assetsSaved[asset.symbol] ? '⭐ Saved' : '☆ Save')}
                                        </button>

                                        {/* Stock Popularity Button */}
                                        <button
                                            className="stock-popularity-btn"
                                            onClick={() => {
                                                if (popularityData[asset.symbol])
                                                    setShowPopularityPanel(p => ({ ...p, [asset.symbol]: !p[asset.symbol] }));
                                                else
                                                    fetchStockPopularity(asset.symbol);
                                            }}
                                            disabled={loadingPopularity[asset.symbol]}
                                        >
                                            {loadingPopularity[asset.symbol] ? '⭐ Analyzing...' : '⭐ Popularity'}
                                        </button>

                                        <button
                                            className="trade-exec-btn"
                                            onClick={() => openTradeModal(asset)}
                                        >
                                            <span>📊</span>
                                            Execute Trade
                                        </button>

                                        <button
                                            className="trend-age-card-btn"
                                            onClick={() => {
                                                if (trendAgePanelData[asset.symbol])
                                                    setShowTrendAgePanel(p => ({ ...p, [asset.symbol]: !p[asset.symbol] }));
                                                else
                                                    fetchTrendAgeSingle(asset.symbol);
                                            }}
                                            disabled={loadingTrendAgePanel[asset.symbol]}
                                        >
                                            {loadingTrendAgePanel[asset.symbol] ? '⏳' : '📊 Trend Age'}
                                        </button>


                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '8px', 
                                            alignItems: 'center',
                                            marginTop: '10px',
                                            width: '100%'
                                        }}>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder={`Target price (current: $${asset.current_price})`}
                                                value={targetPriceInput[asset.symbol] || ''}
                                                onChange={(e) => setTargetPriceInput(prev => ({
                                                    ...prev,
                                                    [asset.symbol]: e.target.value
                                                }))}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e5e7eb',
                                                    fontSize: '13px'
                                                }}
                                            />
                                            <button
                                                className="calculate-retracement-btn"
                                                onClick={() => estimatePriceTarget(asset.symbol)}
                                                disabled={loadingPriceTarget[asset.symbol]}
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {loadingPriceTarget[asset.symbol] ? '🎯 Calculating...' : '🎯 Estimate'}
                                            </button>
                                        
                                        </div><br />
                                        <button
                                            className="calculate-retracement-btn"
                                            onClick={() => fetchChartData(asset.symbol, chartTimeframes[asset.symbol] || '1h')}
                                            disabled={loadingCharts[asset.symbol] || !tvLoaded}
                                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                                        >
                                            {loadingCharts[asset.symbol] ? '📊 Loading...' : 
                                             showChart[asset.symbol] ? '📊 Hide Chart' : '📊 View Chart'}
                                        </button>
                                    </div>
                                </div>
                                <p className="status">{asset.status}</p>
                                
                                {assetAnalysis[asset.symbol] && (
                                    <div className="ai-analysis-container">
                                        {assetAnalysis[asset.symbol].noData ? (
                                            <>
                                                <div className="ai-analysis-header">
                                                    <div className="ai-analysis-icon">📊</div>
                                                    <div className="ai-analysis-title">No Data Available</div>
                                                </div>
                                                <div className="ai-analysis-content">
                                                    <p style={{ margin: 0, color: '#6b7280' }}>
                                                        {assetAnalysis[asset.symbol].message}
                                                    </p>
                                                </div>
                                            </>
                                        ) : assetAnalysis[asset.symbol].error ? (
                                            <>
                                                <div className="ai-analysis-header">
                                                    <div className="ai-analysis-icon">⚠️</div>
                                                    <div className="ai-analysis-title">Analysis Error</div>
                                                </div>
                                                <div className="ai-analysis-content">
                                                    <p style={{ margin: 0, color: '#dc2626' }}>
                                                        {assetAnalysis[asset.symbol].message}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="ai-analysis-header">
                                                    <div className="ai-analysis-icon">🤖</div>
                                                    <div className="ai-analysis-title">AI Sentiment Analysis</div>
                                                </div>
                                                <div className="ai-analysis-content">
                                                    {assetAnalysis[asset.symbol].analysis.split('\n\n').map((section, idx) => {
                                                        const lines = section.split('\n');
                                                        const title = lines[0];
                                                        const content = lines.slice(1).join('\n');
                                                        
                                                        let sentimentClass = '';
                                                        if (title.toLowerCase().includes('bullish')) sentimentClass = 'ai-sentiment-positive';
                                                        else if (title.toLowerCase().includes('bearish')) sentimentClass = 'ai-sentiment-negative';
                                                        else if (title.toLowerCase().includes('neutral')) sentimentClass = 'ai-sentiment-neutral';
                                                        
                                                        return (
                                                            <div key={idx} className="ai-analysis-section">
                                                                <div className={`ai-analysis-section-title ${sentimentClass}`}>
                                                                    {title}
                                                                </div>
                                                                <div style={{ whiteSpace: 'pre-line' }}>
                                                                    {content}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                

                                {techPeerData[asset.symbol] && (
                                    <TechPeerPanel
                                        symbol={asset.symbol}
                                        data={techPeerData[asset.symbol]}
                                        isOpen={showTechPeerPanel[asset.symbol]}
                                        onToggle={() => setShowTechPeerPanel(p => ({ ...p, [asset.symbol]: !p[asset.symbol] }))}
                                    />
                                )}



                                

                                {retracementData[asset.symbol] && (
                                    <div className="retracement-analysis-container">
                                        <div className="retracement-header">
                                            <div className="retracement-icon">📊</div>
                                            <div className="retracement-title">Optimal Entry Analysis</div>
                                        </div>
                                        
                                        {retracementData[asset.symbol].entry_signal && (
                                            <div className={`entry-signal-banner ${retracementData[asset.symbol].entry_quality}`}>
                                                <strong>{retracementData[asset.symbol].entry_signal}</strong>
                                            </div>
                                        )}
                                        
                                        {retracementData[asset.symbol].entry_zones && (
                                            <>
                                                <div className="entry-zones-grid">
                                                    <div className="entry-zone-card aggressive">
                                                        <div className="entry-zone-label">🎯 Aggressive</div>
                                                        <div className="entry-zone-price">
                                                            ${retracementData[asset.symbol].entry_zones.aggressive_entry}
                                                        </div>
                                                    </div>
                                                    <div className="entry-zone-card optimal">
                                                        <div className="entry-zone-label">✅ Optimal</div>
                                                        <div className="entry-zone-price">
                                                            ${retracementData[asset.symbol].entry_zones.optimal_entry}
                                                        </div>
                                                    </div>
                                                    <div className="entry-zone-card conservative">
                                                        <div className="entry-zone-label">🛡️ Conservative</div>
                                                        <div className="entry-zone-price">
                                                            ${retracementData[asset.symbol].entry_zones.conservative_entry}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="retracement-stats-grid">
                                                    <div className="retracement-stat-item">
                                                        <div className="retracement-stat-label">Current Price</div>
                                                        <div className="retracement-stat-value">
                                                            ${retracementData[asset.symbol].current_price}
                                                        </div>
                                                    </div>
                                                    <div className="retracement-stat-item">
                                                        <div className="retracement-stat-label">Invalidation Level</div>
                                                        <div className="retracement-stat-value" style={{color: '#dc2626'}}>
                                                            ${retracementData[asset.symbol].entry_zones.invalidation_level}
                                                        </div>
                                                    </div>
                                                    <div className="retracement-stat-item">
                                                        <div className="retracement-stat-label">Avg Retracement</div>
                                                        <div className="retracement-stat-value">
                                                            {retracementData[asset.symbol].current_trend === 'uptrend' 
                                                                ? retracementData[asset.symbol].bullish_retracements.median_retracement_pct
                                                                : retracementData[asset.symbol].bearish_retracements.median_retracement_pct}%
                                                        </div>
                                                    </div>
                                                    <div className="retracement-stat-item">
                                                        <div className="retracement-stat-label">Patterns Analyzed</div>
                                                        <div className="retracement-stat-value">
                                                            {retracementData[asset.symbol].current_trend === 'uptrend'
                                                                ? retracementData[asset.symbol].bullish_retracements.count
                                                                : retracementData[asset.symbol].bearish_retracements.count}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {adrData[asset.symbol] && (
                                    <div className="retracement-analysis-container" style={{
                                        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                                        borderColor: adrData[asset.symbol].volatility_color
                                    }}>
                                        <div className="retracement-header">
                                            <div className="retracement-icon" style={{
                                                background: `linear-gradient(135deg, ${adrData[asset.symbol].volatility_color} 0%, ${adrData[asset.symbol].volatility_color}dd 100%)`
                                            }}>
                                                📊
                                            </div>
                                            <div className="retracement-title">Average Daily Range Analysis</div>
                                        </div>
                                        
                                        <div className="entry-signal-banner" style={{
                                            background: adrData[asset.symbol].volatility_color,
                                            color: 'white'
                                        }}>
                                            <strong>{adrData[asset.symbol].volatility_label}</strong>
                                            <br />
                                            ADR: ${adrData[asset.symbol].adr_dollars} ({adrData[asset.symbol].adr_pct}%)
                                        </div>
                                        
                                        <div className="entry-signal-banner" style={{
                                            background: adrData[asset.symbol].range_completion_pct >= 70 ? '#f59e0b' : '#10b981',
                                            color: 'white',
                                            marginTop: '10px'
                                        }}>
                                            <strong>{adrData[asset.symbol].range_status}</strong>
                                            <br />
                                            Today's Range: ${adrData[asset.symbol].current_range} ({adrData[asset.symbol].range_completion_pct}% of ADR used)
                                        </div>
                                        
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '15px',
                                            marginTop: '15px'
                                        }}>
                                            {/* Bullish Scenario */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                                padding: '15px',
                                                borderRadius: '10px',
                                                border: '2px solid #10b981'
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: '#065f46',
                                                    marginBottom: '10px',
                                                    textAlign: 'center'
                                                }}>
                                                    📈 BULLISH SCENARIO ({adrData[asset.symbol].bullish_probability}%)
                                                </div>
                                                <div style={{fontSize: '12px', color: '#047857', marginBottom: '5px'}}>
                                                    <strong>EOD Target:</strong> ${adrData[asset.symbol].bullish_eod_projection}
                                                </div>
                                                <div style={{fontSize: '12px', color: '#047857', marginBottom: '5px'}}>
                                                    <strong>Potential High:</strong> ${adrData[asset.symbol].bullish_potential_high}
                                                </div>
                                                <div style={{fontSize: '12px', color: '#047857'}}>
                                                    <strong>Potential Low:</strong> ${adrData[asset.symbol].bullish_potential_low}
                                                </div>
                                            </div>
                                            
                                            {/* Bearish Scenario */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                                padding: '15px',
                                                borderRadius: '10px',
                                                border: '2px solid #ef4444'
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: '#7f1d1d',
                                                    marginBottom: '10px',
                                                    textAlign: 'center'
                                                }}>
                                                    📉 BEARISH SCENARIO ({adrData[asset.symbol].bearish_probability}%)
                                                </div>
                                                <div style={{fontSize: '12px', color: '#991b1b', marginBottom: '5px'}}>
                                                    <strong>EOD Target:</strong> ${adrData[asset.symbol].bearish_eod_projection}
                                                </div>
                                                <div style={{fontSize: '12px', color: '#991b1b', marginBottom: '5px'}}>
                                                    <strong>Potential High:</strong> ${adrData[asset.symbol].bearish_potential_high}
                                                </div>
                                                <div style={{fontSize: '12px', color: '#991b1b'}}>
                                                    <strong>Potential Low:</strong> ${adrData[asset.symbol].bearish_potential_low}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="retracement-stats-grid" style={{marginTop: '15px'}}>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Current Price</div>
                                                <div className="retracement-stat-value">${adrData[asset.symbol].current_price}</div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Today's Open</div>
                                                <div className="retracement-stat-value">${adrData[asset.symbol].today_open}</div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Today's High</div>
                                                <div className="retracement-stat-value" style={{color: '#10b981'}}>
                                                    ${adrData[asset.symbol].today_high}
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Today's Low</div>
                                                <div className="retracement-stat-value" style={{color: '#ef4444'}}>
                                                    ${adrData[asset.symbol].today_low}
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Remaining Range</div>
                                                <div className="retracement-stat-value">
                                                    ${adrData[asset.symbol].remaining_range_dollars}
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Aggressive High</div>
                                                <div className="retracement-stat-value">${adrData[asset.symbol].aggressive_high}</div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Aggressive Low</div>
                                                <div className="retracement-stat-value">${adrData[asset.symbol].aggressive_low}</div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Days Analyzed</div>
                                                <div className="retracement-stat-value">{adrData[asset.symbol].lookback_period}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {popularityData[asset.symbol] && (
                                    <StockPopularityPanel
                                        symbol={asset.symbol}
                                        data={popularityData[asset.symbol]}
                                        isOpen={showPopularityPanel[asset.symbol]}
                                        onToggle={() => setShowPopularityPanel(p => ({
                                            ...p, [asset.symbol]: !p[asset.symbol]
                                        }))}
                                    />
                                )}

                                {trendAgePanelData[asset.symbol] && (
                                        <TrendAgePanel
                                            symbol={asset.symbol}
                                            data={trendAgePanelData[asset.symbol]}
                                            isOpen={showTrendAgePanel[asset.symbol]}
                                            onToggle={() => setShowTrendAgePanel(p => ({
                                                ...p, [asset.symbol]: !p[asset.symbol]
                                            }))}
                                        />
                                    )}

                                {priceTargetData[asset.symbol] && (
                                <div className="retracement-analysis-container" style={{
                                    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                                    borderColor: priceTargetData[asset.symbol].timeline_color
                                }}>
                                    <div className="retracement-header">
                                        <div className="retracement-icon" style={{
                                            background: `linear-gradient(135deg, ${priceTargetData[asset.symbol].timeline_color} 0%, ${priceTargetData[asset.symbol].timeline_color}dd 100%)`
                                        }}>
                                            🎯
                                        </div>
                                        <div className="retracement-title">Price Target Timeline</div>
                                    </div>
                                    
                                    <div className={`entry-signal-banner`} style={{
                                        background: priceTargetData[asset.symbol].timeline_color,
                                        color: 'white'
                                    }}>
                                        <strong>{priceTargetData[asset.symbol].timeline_label}</strong>
                                        <br />
                                        {priceTargetData[asset.symbol].estimated_days > 0 
                                            ? `Estimated: ${priceTargetData[asset.symbol].estimated_days} days`
                                            : 'Target unlikely to be reached'}
                                    </div>
                                    
                                    <div className="entry-zones-grid">
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Current Price</div>
                                            <div className="entry-zone-price" style={{fontSize: '14px'}}>
                                                ${priceTargetData[asset.symbol].current_price}
                                            </div>
                                        </div>
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Target Price</div>
                                            <div className="entry-zone-price" style={{fontSize: '14px'}}>
                                                ${priceTargetData[asset.symbol].target_price}
                                            </div>
                                        </div>
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Distance</div>
                                            <div className="entry-zone-price" style={{
                                                fontSize: '14px',
                                                color: priceTargetData[asset.symbol].price_distance >= 0 ? '#10b981' : '#ef4444'
                                            }}>
                                                {priceTargetData[asset.symbol].price_distance >= 0 ? '+' : ''}
                                                {priceTargetData[asset.symbol].price_distance_pct.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        background: 'white',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '8px'}}>
                                            <strong>Trend Analysis:</strong>
                                        </div>
                                        <div style={{fontSize: '13px', color: '#1f2937', marginBottom: '6px'}}>
                                            {priceTargetData[asset.symbol].trend_emoji} {priceTargetData[asset.symbol].analysis_trend}
                                        </div>
                                        <div style={{fontSize: '13px', color: '#1f2937', marginBottom: '6px'}}>
                                            {priceTargetData[asset.symbol].risk_assessment}
                                        </div>
                                        <div style={{fontSize: '12px', color: '#6b7280', fontStyle: 'italic'}}>
                                            {priceTargetData[asset.symbol].context}
                                        </div>
                                    </div>
                                    
                                    {priceTargetData[asset.symbol].estimated_days > 0 && (
                                        <div className="retracement-stats-grid">
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Probability</div>
                                                <div className="retracement-stat-value" style={{
                                                    color: priceTargetData[asset.symbol].probability >= 60 ? '#10b981' :
                                                        priceTargetData[asset.symbol].probability >= 40 ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {priceTargetData[asset.symbol].probability}%
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Best Case</div>
                                                <div className="retracement-stat-value">
                                                    {priceTargetData[asset.symbol].best_case_days > 0 
                                                        ? `${priceTargetData[asset.symbol].best_case_days} days` 
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Worst Case</div>
                                                <div className="retracement-stat-value">
                                                    {priceTargetData[asset.symbol].worst_case_days > 0 && priceTargetData[asset.symbol].worst_case_days < 999
                                                        ? `${priceTargetData[asset.symbol].worst_case_days} days` 
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="retracement-stat-item">
                                                <div className="retracement-stat-label">Trend Compatible</div>
                                                <div className="retracement-stat-value" style={{fontSize: '18px'}}>
                                                    {priceTargetData[asset.symbol].trend_compatible ? '✅' : '❌'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div style={{
                                        background: '#f9fafb',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#1f2937',
                                        lineHeight: '1.6',
                                        marginTop: '12px'
                                    }}>
                                        <strong>Recommendation:</strong>
                                        <br />
                                        {priceTargetData[asset.symbol].recommendation}
                                    </div>
                                </div>
                            )}

                            {stockAlignmentData[asset.symbol] && (
                                <StockAlignmentPanel
                                    symbol={asset.symbol}
                                    data={stockAlignmentData[asset.symbol]}
                                    isOpen={showAlignmentPanel[asset.symbol]}
                                    onToggle={() => setShowAlignmentPanel(prev => ({
                                        ...prev,
                                        [asset.symbol]: !prev[asset.symbol]
                                    }))}
                                />
                            )}

                                {elasticityData[asset.symbol] && (
                                <div className="elasticity-analysis-container">
                                    <div className="elasticity-header">
                                        <div className="elasticity-icon">⚡</div>
                                        <div className="elasticity-title">Trend Elasticity Analysis</div>
                                    </div>
                                    
                                    {elasticityData[asset.symbol].overall_elasticity && (
                                        <>
                                            <div className={`elasticity-signal-banner ${elasticityData[asset.symbol].elasticity_category}`}>
                                                <strong>
                                                    {elasticityData[asset.symbol].elasticity_category === 'strong' && '💪 STRONG TREND - Minimal retracements, powerful momentum'}
                                                    {elasticityData[asset.symbol].elasticity_category === 'moderate' && '📊 MODERATE TREND - Balanced retracements, steady movement'}
                                                    {elasticityData[asset.symbol].elasticity_category === 'weak' && '⚠️ WEAK TREND - Deep retracements, choppy movement'}
                                                </strong>
                                            </div>
                                            
                                            <div className="elasticity-metrics-grid">
                                                <div className="elasticity-metric-card overall">
                                                    <div className="elasticity-metric-label">Overall Elasticity Score</div>
                                                    <div className="elasticity-metric-value" style={{
                                                        color: elasticityData[asset.symbol].overall_elasticity >= 0.7 ? '#059669' :
                                                            elasticityData[asset.symbol].overall_elasticity >= 0.4 ? '#f59e0b' : '#dc2626'
                                                    }}>
                                                        {(elasticityData[asset.symbol].overall_elasticity * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="elasticity-metric-sublabel">
                                                        {elasticityData[asset.symbol].overall_elasticity >= 0.7 ? 'Excellent' :
                                                        elasticityData[asset.symbol].overall_elasticity >= 0.4 ? 'Good' : 'Poor'}
                                                    </div>
                                                </div>
                                                
                                                {elasticityData[asset.symbol].bullish_elasticity && (
                                                    <div className="elasticity-metric-card bullish">
                                                        <div className="elasticity-metric-label">📈 Bullish Elasticity</div>
                                                        <div className="elasticity-metric-value bullish">
                                                            {(elasticityData[asset.symbol].bullish_elasticity.elasticity_score * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="elasticity-metric-detail">
                                                            Avg Retracement: {elasticityData[asset.symbol].bullish_elasticity.avg_retracement_pct.toFixed(2)}%
                                                        </div>
                                                        <div className="elasticity-metric-detail">
                                                            Patterns: {elasticityData[asset.symbol].bullish_elasticity.pattern_count}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {elasticityData[asset.symbol].bearish_elasticity && (
                                                    <div className="elasticity-metric-card bearish">
                                                        <div className="elasticity-metric-label">📉 Bearish Elasticity</div>
                                                        <div className="elasticity-metric-value bearish">
                                                            {(elasticityData[asset.symbol].bearish_elasticity.elasticity_score * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="elasticity-metric-detail">
                                                            Avg Retracement: {elasticityData[asset.symbol].bearish_elasticity.avg_retracement_pct.toFixed(2)}%
                                                        </div>
                                                        <div className="elasticity-metric-detail">
                                                            Patterns: {elasticityData[asset.symbol].bearish_elasticity.pattern_count}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="elasticity-interpretation">
                                                <div className="interpretation-title">📖 What This Means:</div>
                                                <div className="interpretation-content">
                                                    {elasticityData[asset.symbol].overall_elasticity >= 0.7 ? (
                                                        <p>This asset shows <strong style={{color: '#059669'}}>strong trend elasticity</strong>. 
                                                        Retracements are shallow and brief, indicating powerful momentum. 
                                                        Ideal for trend-following strategies with tight stops.</p>
                                                    ) : elasticityData[asset.symbol].overall_elasticity >= 0.4 ? (
                                                        <p>This asset has <strong style={{color: '#f59e0b'}}>moderate trend elasticity</strong>. 
                                                        Retracements are balanced - not too deep, not too shallow. 
                                                        Good for swing trading with medium-sized stops.</p>
                                                    ) : (
                                                        <p>This asset exhibits <strong style={{color: '#dc2626'}}>weak trend elasticity</strong>. 
                                                        Deep retracements and choppy movement suggest unstable trends. 
                                                        Consider wider stops or wait for clearer trend confirmation.</p>
                                                    )}
                                                    
                                                    {asset.trend === 'uptrend' && elasticityData[asset.symbol].bullish_elasticity && (
                                                        <p style={{marginTop: '10px'}}>
                                                            Current uptrend shows average pullbacks of <strong>
                                                            {elasticityData[asset.symbol].bullish_elasticity.avg_retracement_pct.toFixed(2)}%</strong> before continuation.
                                                            Consider entries near this retracement level.
                                                        </p>
                                                    )}
                                                    
                                                    {asset.trend === 'downtrend' && elasticityData[asset.symbol].bearish_elasticity && (
                                                        <p style={{marginTop: '10px'}}>
                                                            Current downtrend shows average bounces of <strong>
                                                            {elasticityData[asset.symbol].bearish_elasticity.avg_retracement_pct.toFixed(2)}%</strong> before continuation.
                                                            Consider entries near this retracement level.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {instRetailData[asset.symbol] && (
                                    <InstRetailPanel
                                        symbol={asset.symbol}
                                        data={instRetailData[asset.symbol]}
                                        isOpen={showInstRetailPanel[asset.symbol]}
                                        onToggle={() => setShowInstRetailPanel(p => ({
                                            ...p, [asset.symbol]: !p[asset.symbol]
                                        }))}
                                    />
                                )}


                                {meanReversionData[asset.symbol] && (
                                <div className="mean-reversion-container">
                                    <div className="mean-reversion-header">
                                        <div className="mean-reversion-icon">🔄</div>
                                        <div className="mean-reversion-title">Mean Reversion Analysis</div>
                                    </div>
                                    
                                    {/* Regime Badge */}
                                    <div className="regime-badge" style={{
                                        background: meanReversionData[asset.symbol].regime_color,
                                        color: 'white',
                                        display: 'block'
                                    }}>
                                        {meanReversionData[asset.symbol].regime_label}
                                    </div>
                                    
                                    {/* Mean Reversion Score */}
                                    <div className="mr-score-container">
                                        <div className="mr-score-label">Mean Reversion Probability</div>
                                        <div className="mr-score-value" style={{
                                            color: meanReversionData[asset.symbol].mean_reversion_color
                                        }}>
                                            {meanReversionData[asset.symbol].mean_reversion_score}%
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: meanReversionData[asset.symbol].mean_reversion_color
                                        }}>
                                            {meanReversionData[asset.symbol].mean_reversion_label}
                                        </div>
                                    </div>
                                    
                                    {/* Regime Description */}
                                    <div style={{
                                        background: 'white',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                        fontSize: '13px',
                                        color: '#1f2937'
                                    }}>
                                        <strong>Regime:</strong> {meanReversionData[asset.symbol].regime_description}
                                    </div>
                                    
                                    {/* Mean Reversion Signals */}
                                    {meanReversionData[asset.symbol].mean_reversion_signals.length > 0 && (
                                        <div className="mr-signals-list">
                                            <div style={{ fontWeight: 700, marginBottom: '10px', color: '#1e40af' }}>
                                                Active Signals:
                                            </div>
                                            {meanReversionData[asset.symbol].mean_reversion_signals.map((signal, idx) => (
                                                <div key={idx} className="mr-signal-item">
                                                    • {signal}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Key Metrics Grid */}
                                    <div className="mr-targets-grid">
                                        <div className="mr-target-card">
                                            <div className="mr-target-label">RSI</div>
                                            <div className="mr-target-value" style={{
                                                color: meanReversionData[asset.symbol].rsi > 70 ? '#ef4444' :
                                                       meanReversionData[asset.symbol].rsi < 30 ? '#10b981' : '#6b7280'
                                            }}>
                                                {meanReversionData[asset.symbol].rsi}
                                            </div>
                                        </div>
                                        
                                        <div className="mr-target-card">
                                            <div className="mr-target-label">BB Position</div>
                                            <div className="mr-target-value">
                                                {meanReversionData[asset.symbol].bb_position_pct}%
                                            </div>
                                        </div>
                                        
                                        <div className="mr-target-card">
                                            <div className="mr-target-label">vs 20-day MA</div>
                                            <div className="mr-target-value" style={{
                                                color: meanReversionData[asset.symbol].sma_20_distance_pct >= 0 ? '#10b981' : '#ef4444'
                                            }}>
                                                {meanReversionData[asset.symbol].sma_20_distance_pct >= 0 ? '+' : ''}
                                                {meanReversionData[asset.symbol].sma_20_distance_pct}%
                                            </div>
                                        </div>
                                        
                                        <div className="mr-target-card">
                                            <div className="mr-target-label">vs 200-day MA</div>
                                            <div className="mr-target-value" style={{
                                                color: meanReversionData[asset.symbol].sma_200_distance_pct >= 0 ? '#10b981' : '#ef4444'
                                            }}>
                                                {meanReversionData[asset.symbol].sma_200_distance_pct >= 0 ? '+' : ''}
                                                {meanReversionData[asset.symbol].sma_200_distance_pct}%
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Reversion Targets */}
                                    <div style={{
                                        background: 'white',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        marginTop: '15px'
                                    }}>
                                        <div style={{ fontWeight: 700, marginBottom: '10px', color: '#1e40af' }}>
                                            Expected Reversion Target:
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '8px' }}>
                                            <strong>{meanReversionData[asset.symbol].primary_target_name}:</strong> ${meanReversionData[asset.symbol].primary_target}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                            Expected move: {meanReversionData[asset.symbol].expected_move_pct >= 0 ? '+' : ''}
                                            {meanReversionData[asset.symbol].expected_move_pct}%
                                        </div>
                                    </div>
                                    
                                    {/* Trading Recommendation */}
                                    <div style={{
                                        background: '#f9fafb',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginTop: '15px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#1f2937',
                                        textAlign: 'center'
                                    }}>
                                        {meanReversionData[asset.symbol].recommendation}
                                    </div>
                                </div>
                            )}

                                {showSectorPeersChart[asset.symbol] && sectorPeersData[asset.symbol] && (
                                <div className="sector-peers-chart-container">
                                    <div className="sector-peers-header">
                                        <div className="sector-peers-title">
                                            📊 {asset.symbol} vs {sectorPeersData[asset.symbol].sector} Sector
                                        </div>
                                        <button
                                            onClick={() => setShowSectorPeersChart(prev => ({
                                                ...prev,
                                                [asset.symbol]: false
                                            }))}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>
                                    
                                    {/* Performance Summary */}
                                    <div style={{
                                        background: 'white',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                                                    {asset.symbol} Return
                                                </div>
                                                <div style={{ 
                                                    fontSize: '18px', 
                                                    fontWeight: 700,
                                                    color: sectorPeersData[asset.symbol].target_stock_return >= 0 ? '#10b981' : '#ef4444'
                                                }}>
                                                    {sectorPeersData[asset.symbol].target_stock_return >= 0 ? '+' : ''}
                                                    {sectorPeersData[asset.symbol].target_stock_return}%
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                                                    Sector Avg
                                                </div>
                                                <div style={{ 
                                                    fontSize: '18px', 
                                                    fontWeight: 700,
                                                    color: sectorPeersData[asset.symbol].sector_avg_return >= 0 ? '#10b981' : '#ef4444'
                                                }}>
                                                    {sectorPeersData[asset.symbol].sector_avg_return >= 0 ? '+' : ''}
                                                    {sectorPeersData[asset.symbol].sector_avg_return}%
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                                                    Outperformance
                                                </div>
                                                <div style={{ 
                                                    fontSize: '18px', 
                                                    fontWeight: 700,
                                                    color: sectorPeersData[asset.symbol].outperformance >= 0 ? '#10b981' : '#ef4444'
                                                }}>
                                                    {sectorPeersData[asset.symbol].outperformance >= 0 ? '+' : ''}
                                                    {sectorPeersData[asset.symbol].outperformance}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* FIXED: Normalized Chart with Combined Data */}
                                    <div style={{ background: 'white', padding: '15px', borderRadius: '10px', height: '320px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart 
                                                data={(() => {
                                                    // Combine both datasets into one array with all dates
                                                    const combinedData = [];
                                                    const dateMap = new Map();
                                                    
                                                    // Add sector index data
                                                    sectorPeersData[asset.symbol].sector_index.forEach(point => {
                                                        dateMap.set(point.date, {
                                                            date: point.date,
                                                            sectorIndex: point.index_value,
                                                            stock: null
                                                        });
                                                    });
                                                    
                                                    // Add target stock data
                                                    sectorPeersData[asset.symbol].target_normalized.forEach(point => {
                                                        if (dateMap.has(point.date)) {
                                                            dateMap.get(point.date).stock = point.value;
                                                        } else {
                                                            dateMap.set(point.date, {
                                                                date: point.date,
                                                                sectorIndex: null,
                                                                stock: point.value
                                                            });
                                                        }
                                                    });
                                                    
                                                    // Convert to array and sort
                                                    return Array.from(dateMap.values()).sort((a, b) => 
                                                        new Date(a.date) - new Date(b.date)
                                                    );
                                                })()}
                                                margin={{ top: 10, right: 15, left: 5, bottom: 10 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#6b7280"
                                                    style={{ fontSize: '10px' }}
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <YAxis 
                                                    stroke="#6b7280"
                                                    style={{ fontSize: '10px' }}
                                                    tick={{ fontSize: 10 }}
                                                    domain={['auto', 'auto']}
                                                    label={{ value: 'Normalized (Start = 100)', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        background: 'white', 
                                                        border: '2px solid #4f46e5',
                                                        borderRadius: '8px',
                                                        fontSize: '11px'
                                                    }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                                
                                                {/* Sector Index Line */}
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="sectorIndex" 
                                                    stroke="#6b7280" 
                                                    strokeWidth={3}
                                                    strokeDasharray="5 5"
                                                    name={`${sectorPeersData[asset.symbol].sector} Index`}
                                                    dot={false}
                                                    connectNulls={true}
                                                />
                                                
                                                {/* Target Stock Line */}
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="stock" 
                                                    stroke="#4f46e5" 
                                                    strokeWidth={3}
                                                    name={asset.symbol}
                                                    dot={false}
                                                    connectNulls={true}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    {/* Peers Summary */}
                                    <div style={{
                                        marginTop: '15px',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        textAlign: 'center'
                                    }}>
                                        Compared against {sectorPeersData[asset.symbol].peers_analyzed} sector peers
                                    </div>
                                </div>
                            )}

                                

                                {monteCarloResults[asset.symbol] && (
                                    <div className="monte-carlo-results">
                                        <div className="monte-carlo-header">
                                            <div className="monte-carlo-icon">🎲</div>
                                            <div className="monte-carlo-title">Monte Carlo Prediction</div>
                                        </div>
                                        
                                        <div className="monte-carlo-probabilities">
                                            <div className="probability-card">
                                                <div className="probability-label">📈 Bullish Probability</div>
                                                <div className="probability-value bullish">
                                                    {(monteCarloResults[asset.symbol].bullishProb * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div className="probability-card">
                                                <div className="probability-label">📉 Bearish Probability</div>
                                                <div className="probability-value bearish">
                                                    {(monteCarloResults[asset.symbol].bearishProb * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`monte-carlo-signal ${
                                            monteCarloResults[asset.symbol].isBullish ? 'bullish' : 
                                            monteCarloResults[asset.symbol].isBearish ? 'bearish' : 
                                            'neutral'
                                        }`}>
                                            {monteCarloResults[asset.symbol].isBullish && '🚀 BULLISH SIGNAL - High probability of upward movement'}
                                            {monteCarloResults[asset.symbol].isBearish && '⚠️ BEARISH SIGNAL - High probability of downward movement'}
                                            {!monteCarloResults[asset.symbol].isBullish && !monteCarloResults[asset.symbol].isBearish && 
                                                '➡️ NEUTRAL - No strong directional bias'}
                                        </div>
                                        
                                        <div className="monte-carlo-timestamp">
                                            Based on 85-day analysis • {new Date(monteCarloResults[asset.symbol].timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                )}
                                {trendDurations[asset.symbol] && (
                                <div className="retracement-analysis-container" style={{
                                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                                    borderColor: trendDurations[asset.symbol].trend_color
                                }}>
                                    <div className="retracement-header">
                                        <div className="retracement-icon" style={{
                                            background: `linear-gradient(135deg, ${trendDurations[asset.symbol].trend_color} 0%, ${trendDurations[asset.symbol].trend_color}dd 100%)`
                                        }}>
                                            {trendDurations[asset.symbol].trend_emoji}
                                        </div>
                                        <div className="retracement-title">Trend Duration Analysis</div>
                                    </div>
                                    
                                    <div className={`entry-signal-banner ${
                                        trendDurations[asset.symbol].entry_priority === 'highest' ? 'excellent' :
                                        trendDurations[asset.symbol].entry_priority === 'high' ? 'good' :
                                        trendDurations[asset.symbol].entry_priority === 'medium' ? 'fair' : 'poor'
                                    }`}>
                                        <strong>{trendDurations[asset.symbol].entry_recommendation}</strong>
                                    </div>
                                    
                                    <div className="entry-zones-grid">
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Trend Type</div>
                                            <div className="entry-zone-price" style={{fontSize: '14px'}}>
                                                {trendDurations[asset.symbol].current_trend.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Duration</div>
                                            <div className="entry-zone-price" style={{fontSize: '14px'}}>
                                                {trendDurations[asset.symbol].trend_duration_days} days
                                            </div>
                                        </div>
                                        <div className="entry-zone-card">
                                            <div className="entry-zone-label">Age Status</div>
                                            <div className="entry-zone-price" style={{fontSize: '14px'}}>
                                                {trendDurations[asset.symbol].age_label}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="retracement-stats-grid">
                                        <div className="retracement-stat-item">
                                            <div className="retracement-stat-label">Freshness Score</div>
                                            <div className="retracement-stat-value" style={{
                                                color: trendDurations[asset.symbol].freshness_score >= 80 ? '#10b981' :
                                                    trendDurations[asset.symbol].freshness_score >= 60 ? '#f59e0b' : '#ef4444'
                                            }}>
                                                {trendDurations[asset.symbol].freshness_score}/100
                                            </div>
                                        </div>
                                        <div className="retracement-stat-item">
                                            <div className="retracement-stat-label">Total Move</div>
                                            <div className="retracement-stat-value" style={{
                                                color: trendDurations[asset.symbol].total_move_pct >= 0 ? '#10b981' : '#ef4444'
                                            }}>
                                                {trendDurations[asset.symbol].total_move_pct >= 0 ? '+' : ''}
                                                {trendDurations[asset.symbol].total_move_pct}%
                                            </div>
                                        </div>
                                        <div className="retracement-stat-item">
                                            <div className="retracement-stat-label">Avg/Day</div>
                                            <div className="retracement-stat-value">
                                                {trendDurations[asset.symbol].avg_move_per_day}%
                                            </div>
                                        </div>
                                        <div className="retracement-stat-item">
                                            <div className="retracement-stat-label">Entry Priority</div>
                                            <div className="retracement-stat-value" style={{textTransform: 'uppercase', fontSize: '12px'}}>
                                                {trendDurations[asset.symbol].entry_priority}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                                {/* Display chart in card (normal size, no overlays) */}
                                {showChart[asset.symbol] && chartData[asset.symbol] && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '15px',
                                        background: '#1a1a1a',
                                        borderRadius: '12px',
                                        border: '2px solid #4f46e5'
                                    }}>
                                        <TradingViewChart 
                                            data={chartData[asset.symbol]} 
                                            symbol={asset.symbol}
                                            isFullscreen={false}
                                        />
                                    </div>
                                )}
                                
                                <div className="card-metrics">
                                    <div className="metric">
                                        <span className="metric-label">MSS:</span>
                                        <span className="metric-value" style={{ color: '#2563eb' }}>{asset.mss}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Price:</span>
                                        <span className="metric-value">${asset.current_price}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Change:</span>
                                        <span 
                                            className="metric-value"
                                            style={{ color: asset.price_change >= 0 ? '#2563eb' : '#60a5fa' }}
                                        >
                                            {asset.price_change >= 0 ? '+' : ''}{asset.price_change}%
                                        </span>
                                    </div>
                                </div>
                                {asset.relativeVolume !== null && asset.relativeVolume !== undefined && (
                                    <div style={{ 
                                        background: asset.volumeCategory === 'high' ? 'rgba(16, 185, 129, 0.1)' : 
                                                   asset.volumeCategory === 'low' ? 'rgba(239, 68, 68, 0.1)' : 
                                                   'rgba(59, 130, 246, 0.1)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '18px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                                                Relative Volume:
                                            </span>
                                            <span style={{ 
                                                fontSize: '15px', 
                                                fontWeight: 700,
                                                color: asset.volumeCategory === 'high' ? '#059669' : 
                                                       asset.volumeCategory === 'low' ? '#dc2626' : '#2563eb'
                                            }}>
                                                {asset.relativeVolume}x
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                            Current: {asset.currentVolume?.toLocaleString()} | Avg: {asset.avgVolume?.toLocaleString()}
                                        </div>
                                        <span className={`trend-badge ${asset.volumeCategory}`} style={{ marginTop: '6px' }}>
                                            {asset.volumeCategory === 'high' ? '🔥 ' : asset.volumeCategory === 'low' ? '💤 ' : '📊 '}
                                            {asset.volumeCategory?.toUpperCase()} VOLUME
                                        </span>
                                    </div>
                                )}
                                <div className="card-details">
                                    <div className="detail-item">
                                        <span>Norm. Volatility:</span>
                                        <span>{asset.normalized_volatility}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>R² (Trend):</span>
                                        <span>{asset.r_squared}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Liquidity Factor:</span>
                                        <span>{asset.liquidity_factor}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Avg Volume:</span>
                                        <span>{asset.avg_volume.toLocaleString()}</span>
                                        </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}

            {/* Fullscreen Chart Modal */}
{fullscreenChart && chartData[fullscreenChart] && (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 99999,
        padding: window.innerWidth < 768 ? '10px' : '20px',
        overflow: 'auto'
    }}>
        <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            background: '#1a1a1a',
            borderRadius: '16px',
            padding: window.innerWidth < 768 ? '10px' : '20px',
            width: '100%',
            boxSizing: 'border-box',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <h2 style={{ 
                    color: 'white', 
                    margin: 0,
                    fontSize: window.innerWidth < 768 ? '18px' : '24px'
                }}>
                    {fullscreenChart} - Analysis
                </h2>
                <button
                    onClick={() => {
                        setFullscreenChart(null);
                        setCurrentChartSymbol(null);
                        setShowChatbot(false); // Close chatbot when closing chart
                        setShowOrb(true); // Reset orb
                    }}
                    style={{
                        padding: '8px 16px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600
                    }}
                >
                    ✕ Close
                </button>
            </div>
            
            {/* Legend for overlays */}
            {(retracementData[fullscreenChart] || elasticityData[fullscreenChart] || priceTargetData[fullscreenChart]) && (
                <div style={{
                    background: '#2a2a2a',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    color: '#e5e7eb',
                    fontSize: window.innerWidth < 768 ? '11px' : '13px'
                }}>
                    <strong>Overlays:</strong>
                    <div style={{ 
                        display: 'flex', 
                        gap: window.innerWidth < 768 ? '8px' : '15px', 
                        marginTop: '8px', 
                        flexWrap: 'wrap' 
                    }}>
                        {retracementData[fullscreenChart]?.entry_zones && (
                            <>
                                <span style={{color: '#10b981'}}>● Aggressive</span>
                                <span style={{color: '#fbbf24'}}>● Optimal</span>
                                <span style={{color: '#3b82f6'}}>● Conservative</span>
                                <span style={{color: '#ef4444'}}>● Stop</span>
                            </>
                        )}
                        {elasticityData[fullscreenChart] && (
                            <span style={{color: '#ec4899'}}>● Elastic Bands</span>
                        )}
                        {priceTargetData[fullscreenChart] && (
                            <span style={{color: '#8b5cf6'}}>● Target</span>
                        )}
                    </div>
                </div>
            )}
            
            {/* Fullscreen Chart */}
            <TradingViewChart 
                data={chartData[fullscreenChart]} 
                symbol={fullscreenChart}
                isFullscreen={true}
            />
            
            {/* ✅ CHATBOT ORB */}
            {showOrb && (
                <div 
                    className="ai-chatbot-orb"
                    onClick={() => {
                        setShowChatbot(true);
                        setShowOrb(false);
                    }}
                    title="Chat with Simons about this chart"
                    style={{ 
                        position: 'absolute',
                        bottom: '30px',
                        right: '30px',
                        zIndex: 1001
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.3-3.86-.84l-.29-.15-2.99.51.51-2.99-.15-.29C4.3 14.68 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                </div>
            )}
            {showChatbot && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1001,
                    pointerEvents: 'none' // Don't block chatbot
                }} />
            )}

            {showChatbot && (
                <div className="ai-chatbot-panel" style={{ 
                    display: 'flex',
                    position: 'absolute',
                    bottom: '30px',
                    right: '30px',
                    zIndex: 1002,
                    pointerEvents: 'auto'
                }}>
                    {/* Header */}
                    <div className="ai-chatbot-header">
                        <h3>
                            <span>🎯</span>
                            <span>Simons - Trading Assistant</span>
                        </h3>
                        <button 
                            className="ai-chatbot-close" 
                            onClick={() => {
                                setShowChatbot(false);
                                setShowOrb(true);
                                stopSpeaking();
                            }}
                        >
                            ✕
                        </button>
                    </div>
            
                    {/* Voice & Chart Settings - COMPACT */}
                    <div className="ai-chatbot-settings">
                        {/* Row 1: Voice Toggle + Stop Button */}
                        <div className="ai-setting-row">
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={voiceEnabled}
                                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                                    className="ai-setting-checkbox"
                                />
                                <span>🔊 Voice</span>
                            </label>
                            
                            {isSpeaking && (
                                <button onClick={stopSpeaking} className="ai-stop-btn">
                                    ⏹️ Stop
                                </button>
                            )}
                        </div>
                        
                        {/* Row 2: Voice Selector (only if enabled) */}
                        {voiceEnabled && (
                            <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => handleVoiceChange(e.target.value)}
                                className="ai-voice-select"
                            >
                                <option value="">Default Voice</option>
                                {availableVoices.map((voice, idx) => (
                                    <option key={idx} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        {/* Row 3: Chart Context Toggle */}
                        <div className="ai-setting-row" style={{ marginTop: '4px' }}>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={useChartContext}
                                    onChange={(e) => setUseChartContext(e.target.checked)}
                                    className="ai-setting-checkbox"
                                />
                                <span>📊 Chart Context</span>
                            </label>
                            
                            {useChartContext && currentChartSymbol && (
                                <div className="ai-chart-badge">
                                    {currentChartSymbol}
                                </div>
                            )}
                        </div>
                        
                        {useChartContext && !currentChartSymbol && (
                            <div style={{
                                fontSize: '11px',
                                color: '#f59e0b',
                                fontStyle: 'italic',
                                marginTop: '4px'
                            }}>
                                ⚠️ Chart context active for {fullscreenChart}
                            </div>
                        )}
                    </div>
                    
                    {/* Messages */}
                    <div className="ai-chatbot-messages">
                        {chatMessages.length === 0 && (
                            <div className="ai-welcome-message">
                                Hey there! I'm Simons, your trading assistant. I can analyze the {fullscreenChart} chart and help you make informed decisions. What would you like to explore?
                            </div>
                        )}
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`ai-message ${msg.role}`}>
                                {msg.image && (
                                    <img src={msg.image} alt="Uploaded chart" className="ai-image-preview" />
                                )}
                                <div>{msg.content}</div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="ai-loading">
                                <div className="ai-loading-spinner"></div>
                                <span>Simons is analyzing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Input */}
                    <div className="ai-chatbot-input-container">
                        <label className="ai-file-upload-btn" title="Upload chart image">
                            📎
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                        <input
                            type="text"
                            className="ai-chatbot-input"
                            placeholder="Ask Simons about this chart..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                            disabled={chatLoading}
                        />
                        <button 
                            className="ai-chatbot-send"
                            onClick={handleChatSend}
                            disabled={chatLoading || (!chatInput.trim() && !chatImage)}
                        >
                            {chatLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Image Attached Indicator */}
            {chatImage && showChatbot && (
                <div className="ai-image-attached" style={{
                    position: 'fixed',
                    bottom: window.innerWidth < 768 ? '670px' : '730px',
                    right: window.innerWidth < 768 ? '30px' : '50px',
                    zIndex: 1003
                }}>
                    <span>📷 Chart attached</span>
                    <button 
                        className="ai-image-remove"
                        onClick={() => setChatImage(null)}
                        title="Remove image"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
        </div>

    
)}
        
        {!loading && mssData.length === 0 && (
            <div className="mss-empty">
                <div className="empty-icon">📊</div>
                <h3>Ready to Analyze</h3>
                <p>Select an asset class and period, then click "Calculate MSS" to evaluate market stability.</p>
            </div>
        )}
    </div>

        {/* AI Chatbot */}
    {showChatbot && (
        <div className="ai-chatbot-panel" style={{ display: 'flex' }}>
            <div className="ai-chatbot-header">
                <h3>
                    <span>🎯</span>
                    <span>Simons - Trading Assistant</span>
                </h3>
                <button 
                    className="ai-chatbot-close" 
                    onClick={() => {
                        setShowChatbot(false);
                        setShowOrb(true); // Show orb when closing chat
                    }}
                >
                    ✕
                </button>
            </div>
            
            <div className="ai-chatbot-messages">
                {chatMessages.length === 0 && (
                    <div className="ai-welcome-message">
                        Hey there! I'm Simons, your trading assistant. I can help you analyze markets, understand trends, and review charts. What would you like to explore today?
                    </div>
                )}
                {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`ai-message ${msg.role}`}>
                        {msg.image && (
                            <img src={msg.image} alt="Uploaded chart" className="ai-image-preview" />
                        )}
                        <div>{msg.content}</div>
                    </div>
                ))}
                {chatLoading && (
                    <div className="ai-loading">
                        <div className="ai-loading-spinner"></div>
                        <span>Simons is analyzing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="ai-chatbot-input-container">
                <label className="ai-file-upload-btn" title="Upload chart image">
                    📎
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </label>
                <input
                    type="text"
                    className="ai-chatbot-input"
                    placeholder="Ask Simons about markets, trends, or upload a chart..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    disabled={chatLoading}
                />
                <button 
                    className="ai-chatbot-send"
                    onClick={handleChatSend}
                    disabled={chatLoading || (!chatInput.trim() && !chatImage)}
                >
                    {chatLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    )}

    {chatImage && (
        <div className="ai-image-attached">
            <span>📷 Chart attached</span>
            <button 
                className="ai-image-remove"
                onClick={() => setChatImage(null)}
                title="Remove image"
            >
                ✕
            </button>
        </div>
    )}

    {/* Chatbot Orb */}
    <div 
    className="ai-chatbot-orb"
    onClick={() => {
        setShowChatbot(!showChatbot);
        setShowOrb(false);
    }}
    title="Chat with Simons"
    style={{ display: showOrb ? 'flex' : 'none' }}
    >
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.68-.3-3.86-.84l-.29-.15-2.99.51.51-2.99-.15-.29C4.3 14.68 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
    </div>

        {showCommodityModal && commodityVsMaterialsData && (
            <CorrelationModal
                config={{
                    title: 'Commodities vs Materials Sector',
                    icon: '🌾',
                    data: commodityVsMaterialsData,
                    line1Label: 'Commodity Basket', line2Label: 'Materials Index',
                    line1Key: 'commodities',       line2Key: 'materials',
                    breakdownTitle: '📊 Per-Commodity Correlations',
                    breakdownItems: commodityVsMaterialsData.commodity_breakdowns
                }}
                onClose={() => setShowCommodityModal(false)}
            />
        )}

        {showSp500Modal && sp500VsTechData && (
            <CorrelationModal
                config={{
                    title: 'S&P 500 vs Technology Sector',
                    icon: '📈',
                    data: sp500VsTechData,
                    line1Label: 'S&P 500',          line2Label: 'Technology Index',
                    line1Key: 'sp500',              line2Key: 'technology',
                    breakdownTitle: '🏆 Top Tech Contributors',
                    breakdownItems: sp500VsTechData.top_contributors
                }}
                onClose={() => setShowSp500Modal(false)}
            />
        )}
        {showTechSubsectorModal && techSubsectorData && (
           <TechSubsectorModal
               data={techSubsectorData}
               onClose={() => setShowTechSubsectorModal(false)}
           />
       )}
        {showSectorDiveModal && sectorDeepDiveData && (
                <SectorDeepDiveModal
                    data={sectorDeepDiveData}
                    onClose={() => setShowSectorDiveModal(false)}
                />
        )}
        {showTradeModal && tradeModalAsset && (
                <TradeExecutionModal
                    asset={tradeModalAsset}
                    formData={tradeFormData}
                    onChange={handleTradeFormChange}
                    onSubmit={submitTradeOrder}
                    onClose={closeTradeModal}
                    error={tradeError}
                    success={tradeSuccess}
                    submitting={submittingTrade}
                />
            )}

            {showTrendAgeModal && trendAgeData && (
                <TrendAgeModal
                    data={trendAgeData}
                    sortBy={trendAgeSortBy}
                    onSortChange={setTrendAgeSortBy}
                    onClose={() => setShowTrendAgeModal(false)}
                />
            )}

        </div>
    );
}
