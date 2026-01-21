import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
    const [selectedSector, setSelectedSector] = useState('all');
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

    // Add these states at the top
const [chartData, setChartData] = useState({});
const [loadingCharts, setLoadingCharts] = useState({});
const [showChart, setShowChart] = useState({});
const [loadingAllCharts, setLoadingAllCharts] = useState(false);
const [showAllChartsModal, setShowAllChartsModal] = useState(false);

// Import if you haven't already
import { createChart } from 'lightweight-charts';

// Function to fetch chart data for single asset
const fetchChartData = async (symbol) => {
    setLoadingCharts(prev => ({ ...prev, [symbol]: true }));
    
    try {
        const response = await fetch(`${baseUrl}/api/mss-fetch-chart-data-for-visualization/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbols: [symbol]
            })
        });

        const data = await response.json();
        
        if (data.success && data.data[symbol]?.success) {
            setChartData(prev => ({
                ...prev,
                [symbol]: data.data[symbol].data
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

// Function to fetch all charts
const fetchAllCharts = async () => {
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
            Object.keys(data.data).forEach(symbol => {
                if (data.data[symbol].success) {
                    chartsMap[symbol] = data.data[symbol].data;
                }
            });
            setChartData(chartsMap);
            setShowAllChartsModal(true);
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

// Chart component
const TradingViewChart = ({ data, symbol }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    
    useEffect(() => {
        if (!data || data.length === 0 || !chartContainerRef.current) return;
        
        // Create chart
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
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
        
        // Fit content
        chart.timeScale().fitContent();
        
        chartRef.current = chart;
        
        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
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
    }, [data]);
    
    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e40af',
                marginBottom: '8px',
                padding: '8px',
                background: '#f8fafc',
                borderRadius: '6px'
            }}>
                {symbol} - 1H Chart (45 Days)
            </div>
            <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
        </div>
    );
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
                alert(`✅ Successfully saved ${asset.symbol} with 5-Layer Elite Strategy:\n✓ Trend\n✓ R² Strength (20d)\n✓ Retracement\n✓ Avg Retracement\n✓ Monte Carlo`);
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
                setActiveModels(prev => ({
                    ...prev,
                    [asset.symbol]: { ...prev[asset.symbol], isActive: true }
                }));
                alert(`▶️ Successfully reactivated ${asset.symbol} with ${asset.trend.toUpperCase()} + 5-Layer Confirmation:\n✓ Trend\n✓ R² Strength (20d)\n✓ Retracement\n✓ Avg Retracement\n✓ Monte Carlo`);
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

        const messages = [
            {
                role: 'system',
                content: `You are Simons, a professional yet friendly trading and investing assistant named after legendary investor Jim Simons. Your purpose is to help traders analyze markets, understand trends, and make informed decisions.

${mssContext}

You have access to real-time Market Stability Score (MSS) data, which evaluates assets based on volatility, trend clarity, and liquidity. Higher MSS scores indicate better trading conditions.

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
                model: 'gpt-4o',
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
    
    const filteredData = mssData
    .filter(item => {
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

        // Existing sector filter
        if (selectedSector !== 'all' && item.sector) {
            if (selectedSector !== item.sector) {
                return false;
            }
        }

        // NEW: R² filter
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
    // NEW: Sort by R² (highest to lowest) when filter is active
    .sort((a, b) => {
        if (rSquaredFilter !== 'all') {
            return parseFloat(b.r_squared) - parseFloat(a.r_squared);
        }
        return 0; // Keep original order when no R² filter
    });

    const stableAssets = filteredData.filter(item => item.category === 'stable');
    const choppyAssets = filteredData.filter(item => item.category === 'choppy');
    const volatileAssets = filteredData.filter(item => item.category === 'volatile');

    const hasVolumeData = mssData.some(item => item.relativeVolume !== null && item.relativeVolume !== undefined);

    const displayData = getSortedFilteredData();


return (
    <div>
        <style>{styles}</style>
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
                    </button><br />
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
                        </button>
                        {/* Add this with your other bulk buttons */}
                        <button
                            className="mss-calculate-btn"
                            onClick={fetchAllCharts}
                            disabled={loadingAllCharts || filteredData.length === 0}
                            style={{ 
                                padding: '12px 24px', 
                                fontSize: '14px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            }}
                        >
                            {loadingAllCharts ? '📊 Loading Charts...' : '📊 View All Charts'}
                        </button>
                        
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
                                            {/* In card-actions */}
                                            <button
                                                className="calculate-retracement-btn"
                                                onClick={() => fetchChartData(asset.symbol)}
                                                disabled={loadingCharts[asset.symbol]}
                                                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                                            >
                                                {loadingCharts[asset.symbol] ? '📊 Loading...' : '📊 View Chart'}
                                            </button>
                                        </div>
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

                                {/* Display chart below card if loaded */}
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
                                        />
                                        <button
                                            onClick={() => setShowChart(prev => ({ ...prev, [asset.symbol]: false }))}
                                            style={{
                                                marginTop: '10px',
                                                padding: '8px 16px',
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: 600
                                            }}
                                        >
                                            ✕ Hide Chart
                                        </button>
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

        {!loading && mssData.length === 0 && (
            <div className="mss-empty">
                <div className="empty-icon">📊</div>
                <h3>Ready to Analyze</h3>
                <p>Select an asset class and period, then click "Calculate MSS" to evaluate market stability.</p>
            </div>
        )}
    </div>

          {/* Add this modal for viewing all charts */}
{showAllChartsModal && (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        overflow: 'auto',
        padding: '20px'
    }}>
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            background: '#1a1a1a',
            borderRadius: '16px',
            padding: '30px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h2 style={{ color: 'white', margin: 0 }}>
                    All Charts ({Object.keys(chartData).length} Assets)
                </h2>
                <button
                    onClick={() => setShowAllChartsModal(false)}
                    style={{
                        padding: '10px 20px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                >
                    ✕ Close
                </button>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                gap: '20px'
            }}>
                {Object.keys(chartData).map(symbol => (
                    chartData[symbol] && (
                        <div key={symbol} style={{
                            background: '#2a2a2a',
                            padding: '15px',
                            borderRadius: '12px'
                        }}>
                            <TradingViewChart 
                                data={chartData[symbol]} 
                                symbol={symbol}
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    </div>
)}

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
</div>
    );
}
