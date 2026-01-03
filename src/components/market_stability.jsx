import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
    if is_bullish_market_retracement(data=dataset):
        if is_uptrend(data=dataset):
            return_statement = 'buy'`;
            } else if (asset.trend === 'downtrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if is_bearish_market_retracement(data=dataset):
        if is_downtrend(data=dataset):
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
                    name: `[MSS] ${asset.symbol} - ${asset.trend.toUpperCase()}`,
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
                alert(`✅ Successfully saved ${asset.symbol} to forward testing!`);
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
    if is_bullish_market_retracement(data=dataset):
        if is_uptrend(data=dataset):
            return_statement = 'buy'`;
            } else if (asset.trend === 'downtrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if is_bearish_market_retracement(data=dataset):
        if is_downtrend(data=dataset):
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
                    name: `[MSS] ${asset.symbol} - ${asset.trend.toUpperCase()}`
                })
            });

            if (response.ok) {
                setActiveModels(prev => ({
                    ...prev,
                    [asset.symbol]: { ...prev[asset.symbol], isActive: true }
                }));
                alert(`▶️ Successfully reactivated ${asset.symbol} with ${asset.trend.toUpperCase()} strategy!`);
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
    
    const filteredData = mssData.filter(item => {
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
        
        if (selectedCategory === 'all') return true;
        return item.category === selectedCategory;
    });

    const stableAssets = filteredData.filter(item => item.category === 'stable');
    const choppyAssets = filteredData.filter(item => item.category === 'choppy');
    const volatileAssets = filteredData.filter(item => item.category === 'volatile');

    const hasVolumeData = mssData.some(item => item.relativeVolume !== null && item.relativeVolume !== undefined);

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
