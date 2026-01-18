import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const styles = `
.sandbox-wrapper {
    padding: 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    min-height: 100vh;
}

.sandbox-header {
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: white;
    padding: 50px;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4);
    position: relative;
    overflow: hidden;
}

.sandbox-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

.sandbox-header h1 {
    margin: 0 0 15px 0;
    font-size: 42px;
    font-weight: 800;
    position: relative;
    z-index: 1;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.sandbox-header p {
    margin: 0;
    font-size: 18px;
    line-height: 1.7;
    opacity: 0.95;
    position: relative;
    z-index: 1;
}

.main-grid {
    display: grid;
    gap: 25px;
    grid-template-columns: 1fr;
}

.sandbox-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 35px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
}

.sandbox-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px rgba(59, 130, 246, 0.25);
}

.card-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 25px 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.input-label {
    color: #1e293b;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-field, .select-field {
    padding: 14px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s;
    background: white;
}

.input-field:focus, .select-field:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.function-selector {
    background: #f8fafc;
    padding: 25px;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
}

.function-selector-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.function-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-top: 15px;
}

.function-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: white;
    border-radius: 10px;
    border: 2px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s;
}

.function-checkbox:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.function-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #3b82f6;
}

.function-checkbox.checked {
    border-color: #3b82f6;
    background: #eff6ff;
}

.function-label {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    cursor: pointer;
}

.action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 25px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    flex: 1;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-secondary {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.status-banner {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 600;
}

.status-running {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
}

.status-completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.status-error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
}

.progress-container {
    margin: 25px 0;
}

.progress-bar {
    width: 100%;
    height: 35px;
    background: #e2e8f0;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 15px;
    transition: width 0.5s ease;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 25px;
}

.result-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
    transition: all 0.3s;
}

.result-card:hover {
    border-color: #3b82f6;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f5f9;
}

.result-id {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
}

.result-date {
    font-size: 12px;
    color: #94a3b8;
}

.result-metrics {
    display: grid;
    gap: 12px;
}

.metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.metric-label {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

.metric-value {
    font-weight: 700;
    font-size: 16px;
}

.metric-positive { color: #10b981; }
.metric-negative { color: #ef4444; }
.metric-neutral { color: #3b82f6; }

.view-details-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s;
}

.view-details-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 1200px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 30px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: white;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 24px;
    font-weight: 700;
}

.modal-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
}

.modal-body {
    padding: 30px;
}

.bokeh-plot-container {
    width: 100%;
    margin: 25px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-filter-section {
    background: #f8fafc;
    padding: 25px;
    border-radius: 16px;
    margin-bottom: 25px;
}

.filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.search-input {
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    width: 100%;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
}

.empty-state-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state-text {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
}

.tab-navigation {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    border-bottom: 2px solid #e2e8f0;
}

.tab-button {
    padding: 12px 24px;
    background: none;
    border: none;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
}

.tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
}

.tab-button:hover {
    color: #3b82f6;
}

@media (max-width: 768px) {
    .sandbox-wrapper {
        padding: 10px;
    }
    
    .sandbox-header {
        padding: 30px 20px;
    }
    
    .sandbox-header h1 {
        font-size: 32px;
    }
    
    .sandbox-card {
        padding: 20px;
    }
    
    .section-grid,
    .function-grid,
    .filter-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
}
`;

export default function SnowAISandboxV2() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [activeTab, setActiveTab] = useState('run'); // 'run' or 'results'
    
    // Configuration state
    const [config, setConfig] = useState({
        asset_symbol: 'AAPL',
        timeframe: '1d',
        start_year: 2020,
        end_year: 2024,
        initial_capital: 10000,
        take_profit: 4.0,
        stop_loss: 2.0,
        selected_functions: []
    });
    
    // Available functions
    const availableFunctions = [
        'is_uptrend',
        'is_downtrend',
        'is_ranging_market',
        'is_bullish_market_retracement',
        'is_bearish_market_retracement',
        'is_resistance_level',
        'is_support_level',
        'buy_hold',
        'sell_hold',
        'is_stable_market'
    ];
    
    // Training state
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [currentResult, setCurrentResult] = useState(null);
    
    // Results state
    const [savedResults, setSavedResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAsset, setFilterAsset] = useState('');
    const [filterTimeframe, setFilterTimeframe] = useState('');
    
    // Modal state
    const [selectedResultDetail, setSelectedResultDetail] = useState(null);
    
    useEffect(() => {
        loadSavedResults();
    }, []);
    
    useEffect(() => {
        filterResults();
    }, [savedResults, searchTerm, filterAsset, filterTimeframe]);
    
    const loadSavedResults = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-backtest/results/`);
            const data = await response.json();
            if (data.results) {
                setSavedResults(data.results);
            }
        } catch (error) {
            console.error('Error loading results:', error);
        }
    };
    
    const filterResults = () => {
        let filtered = savedResults;
        
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.asset_symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filterAsset) {
            filtered = filtered.filter(r => r.asset_symbol === filterAsset);
        }
        
        if (filterTimeframe) {
            filtered = filtered.filter(r => r.timeframe === filterTimeframe);
        }
        
        setFilteredResults(filtered);
    };
    
    const toggleFunction = (funcName) => {
        setConfig(prev => ({
            ...prev,
            selected_functions: prev.selected_functions.includes(funcName)
                ? prev.selected_functions.filter(f => f !== funcName)
                : [...prev.selected_functions, funcName]
        }));
    };
    
    const startBacktest = async () => {
        if (config.selected_functions.length === 0) {
            alert('Please select at least one trading function');
            return;
        }
        
        setIsRunning(true);
        setProgress(0);
        setStatus('Initializing backtest...');
        setCurrentResult(null);
        
        try {
            const response = await fetch(`${baseUrl}/api/snowai-backtest/run/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });
            
            const data = await response.json();
            
            if (data.session_id) {
                setSessionId(data.session_id);
                pollBacktestStatus(data.session_id);
            } else {
                setStatus('Error: ' + (data.error || 'Failed to start backtest'));
                setIsRunning(false);
            }
        } catch (error) {
            setStatus('Error: ' + error.message);
            setIsRunning(false);
        }
    };
    
    const pollBacktestStatus = async (id) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${baseUrl}/api/snowai-backtest/status/${id}/`);
                const data = await response.json();
                
                setProgress(data.progress || 0);
                setStatus(data.status || '');
                
                if (data.completed) {
                    clearInterval(interval);
                    setIsRunning(false);
                    setCurrentResult(data.result);
                    loadSavedResults(); // Refresh results list
                }
                
                if (data.error) {
                    clearInterval(interval);
                    setIsRunning(false);
                    setStatus('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 1000);
    };
    
    const loadBokehPlot = (plotJson, containerId) => {
        if (!plotJson || !window.Bokeh) return;
        
        try {
            const plotData = typeof plotJson === 'string' ? JSON.parse(plotJson) : plotJson;
            window.Bokeh.embed.embed_item(plotData, containerId);
        } catch (error) {
            console.error('Error loading Bokeh plot:', error);
        }
    };
    
    const openResultDetail = (result) => {
        setSelectedResultDetail(result);
        setTimeout(() => {
            if (result.plot_json) {
                loadBokehPlot(result.plot_json, 'modal-bokeh-plot');
            }
        }, 100);
    };
    
    const uniqueAssets = [...new Set(savedResults.map(r => r.asset_symbol))];
    const uniqueTimeframes = [...new Set(savedResults.map(r => r.timeframe))];
    
    return (
        <div>
            <style>{styles}</style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="sandbox-wrapper">
                        
                        <div className="sandbox-header">
                            <h1>❄️ SnowAI Sandbox v2</h1>
                            <p>Advanced AI-powered backtesting with Backtesting.py - Select your functions, configure parameters, and discover winning strategies</p>
                        </div>
                        
                        <div className="tab-navigation">
                            <button 
                                className={`tab-button ${activeTab === 'run' ? 'active' : ''}`}
                                onClick={() => setActiveTab('run')}
                            >
                                🚀 Run Backtest
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                                onClick={() => setActiveTab('results')}
                            >
                                📊 Saved Results ({savedResults.length})
                            </button>
                        </div>
                        
                        {activeTab === 'run' && (
                            <>
                                <div className="sandbox-card">
                                    <h2 className="card-title">⚙️ Backtest Configuration</h2>
                                    
                                    <div className="section-grid">
                                        <div className="input-group">
                                            <label className="input-label">📈 Asset Symbol</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={config.asset_symbol}
                                                onChange={(e) => setConfig({...config, asset_symbol: e.target.value.toUpperCase()})}
                                                placeholder="AAPL, TSLA, BTC-USD..."
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">⏱️ Timeframe</label>
                                            <select
                                                className="select-field"
                                                value={config.timeframe}
                                                onChange={(e) => setConfig({...config, timeframe: e.target.value})}
                                            >
                                                <option value="1m">1 Minute</option>
                                                <option value="5m">5 Minutes</option>
                                                <option value="15m">15 Minutes</option>
                                                <option value="1h">1 Hour</option>
                                                <option value="1d">1 Day</option>
                                                <option value="1wk">1 Week</option>
                                            </select>
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">📅 Start Year</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={config.start_year}
                                                onChange={(e) => setConfig({...config, start_year: parseInt(e.target.value)})}
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">📅 End Year</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={config.end_year}
                                                onChange={(e) => setConfig({...config, end_year: parseInt(e.target.value)})}
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">💰 Initial Capital ($)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={config.initial_capital}
                                                onChange={(e) => setConfig({...config, initial_capital: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">🎯 Take Profit (%)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="input-field"
                                                value={config.take_profit}
                                                onChange={(e) => setConfig({...config, take_profit: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                        
                                        <div className="input-group">
                                            <label className="input-label">🛑 Stop Loss (%)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="input-field"
                                                value={config.stop_loss}
                                                onChange={(e) => setConfig({...config, stop_loss: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="sandbox-card">
                                    <h2 className="card-title">🎯 Select Trading Functions</h2>
                                    
                                    <div className="function-selector">
                                        <div className="function-selector-title">
                                            ✨ Choose functions for entry/exit signals
                                            <span style={{fontSize: '14px', fontWeight: 'normal', color: '#64748b', marginLeft: '10px'}}>
                                                ({config.selected_functions.length} selected)
                                            </span>
                                        </div>
                                        
                                        <div className="function-grid">
                                            {availableFunctions.map(func => (
                                                <div 
                                                    key={func}
                                                    className={`function-checkbox ${config.selected_functions.includes(func) ? 'checked' : ''}`}
                                                    onClick={() => toggleFunction(func)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={config.selected_functions.includes(func)}
                                                        onChange={() => {}}
                                                    />
                                                    <label className="function-label">{func}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="action-buttons">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={startBacktest}
                                            disabled={isRunning || config.selected_functions.length === 0}
                                        >
                                            {isRunning ? '🔄 Running...' : '🚀 Start Backtest'}
                                        </button>
                                    </div>
                                </div>
                                
                                {isRunning && (
                                    <div className="sandbox-card">
                                        <div className="status-banner status-running">
                                            <span style={{fontSize: '24px'}}>⚡</span>
                                            <span>{status}</span>
                                        </div>
                                        
                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{width: `${progress}%`}}>
                                                    {progress}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {currentResult && (
                                    <div className="sandbox-card">
                                        <div className="status-banner status-completed">
                                            <span style={{fontSize: '24px'}}>✅</span>
                                            <span>Backtest Completed Successfully!</span>
                                        </div>
                                        
                                        <h2 className="card-title">📊 Results</h2>
                                        
                                        <div className="result-metrics">
                                            <div className="metric-row">
                                                <span className="metric-label">Total Return:</span>
                                                <span className={`metric-value ${parseFloat(currentResult.return_percent) >= 0 ? 'metric-positive' : 'metric-negative'}`}>
                                                    {parseFloat(currentResult.return_percent).toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="metric-row">
                                                <span className="metric-label">Win Rate:</span>
                                                <span className={`metric-value ${parseFloat(currentResult.win_rate) >= 50 ? 'metric-positive' : 'metric-negative'}`}>
                                                    {parseFloat(currentResult.win_rate).toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="metric-row">
                                                <span className="metric-label">Total Trades:</span>
                                                <span className="metric-value metric-neutral">
                                                    {currentResult.num_trades}
                                                </span>
                                            </div>
                                            <div className="metric-row">
                                                <span className="metric-label">Sharpe Ratio:</span>
                                                <span className="metric-value metric-neutral">
                                                    {parseFloat(currentResult.sharpe_ratio).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {currentResult.plot_json && (
                                            <div className="bokeh-plot-container" id="current-bokeh-plot"></div>
                                        )}
                                        
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                if (currentResult.plot_json) {
                                                    setTimeout(() => loadBokehPlot(currentResult.plot_json, 'current-bokeh-plot'), 100);
                                                }
                                            }}
                                        >
                                            📈 Load Chart
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {activeTab === 'results' && (
                            <>
                                <div className="sandbox-card">
                                    <h2 className="card-title">🔍 Search & Filter Results</h2>
                                    
                                    <div className="search-filter-section">
                                        <div className="filter-grid">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="🔍 Search by ID or symbol..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            
                                            <select
                                                className="select-field"
                                                value={filterAsset}
                                                onChange={(e) => setFilterAsset(e.target.value)}
                                            >
                                                <option value="">All Assets</option>
                                                {uniqueAssets.map(asset => (
                                                    <option key={asset} value={asset}>{asset}</option>
                                                ))}
                                            </select>
                                            
                                            <select
                                                className="select-field"
                                                value={filterTimeframe}
                                                onChange={(e) => setFilterTimeframe(e.target.value)}
                                            >
                                                <option value="">All Timeframes</option>
                                                {uniqueTimeframes.map(tf => (
                                                    <option key={tf} value={tf}>{tf}</option>
                                                ))}
                                            </select>
                                            
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setFilterAsset('');
                                                    setFilterTimeframe('');
                                                }}
                                            >
                                                🔄 Reset Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {filteredResults.length === 0 ? (
                                    <div className="sandbox-card">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📊</div>
                                            <div className="empty-state-text">No results found</div>
                                            <p style={{color: '#94a3b8', marginTop: '10px'}}>
                                                {savedResults.length === 0 
                                                    ? 'Run your first backtest to see results here' 
                                                    : 'Try adjusting your filters'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="results-grid">
                                        {filteredResults.map(result => (
                                            <div key={result.id} className="result-card">
                                                <div className="result-header">
                                                    <div className="result-id">
                                                        ID: {result.id.substring(0, 8)}...
                                                    </div>
                                                    <div className="result-date">
                                                        {new Date(result.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                
                                                <div style={{marginBottom: '15px'}}>
                                                    <div style={{fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '5px'}}>
                                                        {result.asset_symbol}
                                                    </div>
                                                    <div style={{fontSize: '14px', color: '#64748b'}}>
                                                        {result.timeframe} | {result.start_year} - {result.end_year}
                                                    </div>
                                                </div>
                                                
                                                <div className="result-metrics">
                                                    <div className="metric-row">
                                                        <span className="metric-label">Return:</span>
                                                        <span className={`metric-value ${parseFloat(result.return_percent) >= 0 ? 'metric-positive' : 'metric-negative'}`}>
                                                            {parseFloat(result.return_percent).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <div className="metric-row">
                                                        <span className="metric-label">Win Rate:</span>
                                                        <span className={`metric-value ${parseFloat(result.win_rate) >= 50 ? 'metric-positive' : 'metric-negative'}`}>
                                                            {parseFloat(result.win_rate).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <div className="metric-row">
                                                        <span className="metric-label">Trades:</span>
                                                        <span className="metric-value metric-neutral">
                                                            {result.num_trades}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    className="view-details-btn"
                                                    onClick={() => openResultDetail(result)}
                                                >
                                                    📊 View Full Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        
                        {selectedResultDetail && (
                            <div className="modal-overlay" onClick={() => setSelectedResultDetail(null)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="modal-title">
                                            📊 Backtest Results - {selectedResultDetail.asset_symbol}
                                        </div>
                                        <button 
                                            className="modal-close"
                                            onClick={() => setSelectedResultDetail(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    
                                    <div className="modal-body">
                                        <div style={{marginBottom: '25px'}}>
                                            <h3 style={{marginBottom: '10px', color: '#1e293b'}}>Configuration</h3>
                                            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '10px'}}>
                                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px'}}>
                                                    <div><strong>Asset:</strong> {selectedResultDetail.asset_symbol}</div>
                                                    <div><strong>Timeframe:</strong> {selectedResultDetail.timeframe}</div>
                                                    <div><strong>Period:</strong> {selectedResultDetail.start_year} - {selectedResultDetail.end_year}</div>
                                                    <div><strong>Initial Capital:</strong> ${selectedResultDetail.initial_capital}</div>
                                                    <div><strong>Take Profit:</strong> {selectedResultDetail.take_profit}%</div>
                                                    <div><strong>Stop Loss:</strong> {selectedResultDetail.stop_loss}%</div>
                                                </div>
                                                <div style={{marginTop: '15px'}}>
                                                    <strong>Functions Used:</strong>
                                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                                                        {JSON.parse(selectedResultDetail.selected_functions).map(func => (
                                                            <span key={func} style={{background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px'}}>
                                                                {func}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{marginBottom: '25px'}}>
                                            <h3 style={{marginBottom: '15px', color: '#1e293b'}}>Performance Metrics</h3>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
                                                {[
                                                    {label: 'Total Return', value: `${parseFloat(selectedResultDetail.return_percent).toFixed(2)}%`, type: parseFloat(selectedResultDetail.return_percent) >= 0 ? 'positive' : 'negative'},
                                                    {label: 'Annual Return', value: `${parseFloat(selectedResultDetail.annual_return).toFixed(2)}%`, type: 'neutral'},
                                                    {label: 'Buy & Hold Return', value: `${parseFloat(selectedResultDetail.buy_hold_return).toFixed(2)}%`, type: 'neutral'},
                                                    {label: 'Sharpe Ratio', value: parseFloat(selectedResultDetail.sharpe_ratio).toFixed(2), type: 'neutral'},
                                                    {label: 'Sortino Ratio', value: parseFloat(selectedResultDetail.sortino_ratio).toFixed(2), type: 'neutral'},
                                                    {label: 'Max Drawdown', value: `${parseFloat(selectedResultDetail.max_drawdown).toFixed(2)}%`, type: 'negative'},
                                                    {label: 'Win Rate', value: `${parseFloat(selectedResultDetail.win_rate).toFixed(2)}%`, type: parseFloat(selectedResultDetail.win_rate) >= 50 ? 'positive' : 'negative'},
                                                    {label: 'Total Trades', value: selectedResultDetail.num_trades, type: 'neutral'},
                                                    {label: 'Best Trade', value: `${parseFloat(selectedResultDetail.best_trade).toFixed(2)}%`, type: 'positive'},
                                                    {label: 'Worst Trade', value: `${parseFloat(selectedResultDetail.worst_trade).toFixed(2)}%`, type: 'negative'},
                                                    {label: 'Profit Factor', value: parseFloat(selectedResultDetail.profit_factor).toFixed(2), type: 'neutral'},
                                                    {label: 'Expectancy', value: `${parseFloat(selectedResultDetail.expectancy).toFixed(2)}%`, type: 'neutral'}
                                                ].map(metric => (
                                                    <div key={metric.label} style={{background: '#f8fafc', padding: '15px', borderRadius: '10px'}}>
                                                        <div style={{fontSize: '12px', color: '#64748b', marginBottom: '5px'}}>{metric.label}</div>
                                                        <div className={`metric-value metric-${metric.type}`} style={{fontSize: '20px'}}>
                                                            {metric.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {selectedResultDetail.plot_json && (
                                            <div>
                                                <h3 style={{marginBottom: '15px', color: '#1e293b'}}>Equity Curve</h3>
                                                <div className="bokeh-plot-container" id="modal-bokeh-plot"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
            <script src="https://cdn.bokeh.org/bokeh/release/bokeh-2.4.3.min.js"></script>
            <script src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-2.4.3.min.js"></script>
            <script src="https://cdn.bokeh.org/bokeh/release/bokeh-tables-2.4.3.min.js"></script>
        </div>
    );
}