import Header from "./header";
import SideNavs from "./side_navs";
import React, { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Activity, Play, Pause, Save, Eye, X, CheckSquare, Square } from "lucide-react";

const SnowAISandbox = () => {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // State management
    const [activeTab, setActiveTab] = useState('create'); // create, results, scheduled
    const [availableFunctions, setAvailableFunctions] = useState([]);
    const [selectedFunctions, setSelectedFunctions] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [sessionStatus, setSessionStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [bokehPlot, setBokehPlot] = useState(null);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAsset, setFilterAsset] = useState('');
    const [filterTimeframe, setFilterTimeframe] = useState('');
    const [filterMinWinRate, setFilterMinWinRate] = useState('');
    
    // Configuration
    const [config, setConfig] = useState({
        asset_symbol: 'BTCUSD',
        timeframe: '1h',
        initial_equity: 10000,
        max_iterations: 50,
        population_size: 20,
        take_profit: 4.0,
        stop_loss: 2.0,
    });

    // Load available functions on mount
    useEffect(() => {
        loadAvailableFunctions();
        if (activeTab === 'results') {
            loadResults();
        }
    }, [activeTab]);

    // Poll session status
    useEffect(() => {
        if (sessionId && sessionStatus?.status !== 'completed' && sessionStatus?.status !== 'failed') {
            const interval = setInterval(() => {
                pollSessionStatus();
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [sessionId, sessionStatus]);

    // Filter results
    useEffect(() => {
        filterResults();
    }, [results, searchTerm, filterAsset, filterTimeframe, filterMinWinRate]);

    // Initialize Bokeh when plot data changes
    useEffect(() => {
        if (bokehPlot && window.Bokeh) {
            try {
                const plotId = `bokeh-plot-${Date.now()}`;
                const plotElement = document.getElementById('bokeh-plot-container');
                if (plotElement) {
                    plotElement.innerHTML = `<div id="${plotId}"></div>`;
                    window.Bokeh.embed.embed_item(bokehPlot, plotId);
                }
            } catch (error) {
                console.error('Bokeh plot error:', error);
            }
        }
    }, [bokehPlot]);

    const loadAvailableFunctions = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai/functions/`);
            const data = await response.json();
            setAvailableFunctions(data.functions || []);
        } catch (error) {
            console.error('Error loading functions:', error);
        }
    };

    const loadResults = async () => {
        try {
            const params = new URLSearchParams();
            if (filterAsset) params.append('asset', filterAsset);
            if (filterTimeframe) params.append('timeframe', filterTimeframe);
            if (filterMinWinRate) params.append('min_win_rate', filterMinWinRate);
            
            const response = await fetch(`${baseUrl}/api/snowai/results/?${params}`);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Error loading results:', error);
        }
    };

    const filterResults = () => {
        let filtered = [...results];
        
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.asset_symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredResults(filtered);
    };

    const startBacktest = async () => {
        if (selectedFunctions.length === 0) {
            alert('Please select at least one function');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/snowai/start/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...config,
                    selected_functions: selectedFunctions,
                })
            });

            const data = await response.json();
            if (data.session_id) {
                setSessionId(data.session_id);
                setLogs([{ timestamp: new Date().toLocaleTimeString(), level: 'info', message: '🚀 Starting backtest...' }]);
            }
        } catch (error) {
            console.error('Error starting backtest:', error);
        }
    };

    const pollSessionStatus = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch(`${baseUrl}/api/snowai/status/${sessionId}/`);
            const data = await response.json();
            setSessionStatus(data);
            
            if (data.logs && data.logs.length > 0) {
                setLogs(prev => [...prev, ...data.logs]);
            }
        } catch (error) {
            console.error('Error polling status:', error);
        }
    };

    const viewStrategyDetail = async (resultId) => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai/strategy/${resultId}/`);
            const data = await response.json();
            setSelectedStrategy(data);
            
            if (data.plot_json) {
                try {
                    setBokehPlot(JSON.parse(data.plot_json));
                } catch (e) {
                    console.error('Error parsing plot JSON:', e);
                }
            }
        } catch (error) {
            console.error('Error loading strategy:', error);
        }
    };

    const toggleFunctionSelection = (funcId) => {
        setSelectedFunctions(prev => 
            prev.includes(funcId)
                ? prev.filter(id => id !== funcId)
                : [...prev, funcId]
        );
    };

    const selectAllInCategory = (category) => {
        const categoryFuncs = availableFunctions
            .filter(f => f.category === category)
            .map(f => f.function_id);
        
        const allSelected = categoryFuncs.every(id => selectedFunctions.includes(id));
        
        if (allSelected) {
            setSelectedFunctions(prev => prev.filter(id => !categoryFuncs.includes(id)));
        } else {
            setSelectedFunctions(prev => [...new Set([...prev, ...categoryFuncs])]);
        }
    };

    // Group functions by category
    const functionsByCategory = availableFunctions.reduce((acc, func) => {
        if (!acc[func.category]) acc[func.category] = [];
        acc[func.category].push(func);
        return acc;
    }, {});

    const categoryLabels = {
        'trend': 'Trend Detection',
        'retracement': 'Retracement Signals',
        'support_resistance': 'Support & Resistance',
        'market_condition': 'Market Conditions',
        'hold_strategy': 'Hold Strategies',
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
        <div style={{ padding: '20px', background: '#f0f4ff', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '16px',
                marginBottom: '30px',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', fontWeight: '700' }}>
                    ❄️ SnowAI Sandbox V2
                </h1>
                <p style={{ margin: 0, fontSize: '16px', opacity: 0.95 }}>
                    Advanced AI-powered backtesting with function selection, asset testing, and comprehensive analytics
                </p>
            </div>

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '30px',
                flexWrap: 'wrap',
            }}>
                {[
                    { id: 'create', label: '🚀 Create Backtest', icon: Play },
                    { id: 'results', label: '📊 View Results', icon: BarChart3 },
                    { id: 'scheduled', label: '📅 Scheduled Tests', icon: Calendar },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                background: activeTab === tab.id 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                                    : 'white',
                                color: activeTab === tab.id ? 'white' : '#1e40af',
                                boxShadow: activeTab === tab.id 
                                    ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* CREATE BACKTEST TAB */}
            {activeTab === 'create' && (
                <>
                    {/* Configuration Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '2px solid #dbeafe',
                    }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: '#1e40af', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <Activity size={20} />
                            Backtest Configuration
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                        }}>
                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Asset Symbol
                                </label>
                                <input
                                    type="text"
                                    value={config.asset_symbol}
                                    onChange={(e) => setConfig({...config, asset_symbol: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                    placeholder="e.g., BTCUSD, AAPL, EURUSD"
                                />
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Timeframe
                                </label>
                                <select
                                    value={config.timeframe}
                                    onChange={(e) => setConfig({...config, timeframe: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <option value="1m">1 Minute</option>
                                    <option value="5m">5 Minutes</option>
                                    <option value="15m">15 Minutes</option>
                                    <option value="30m">30 Minutes</option>
                                    <option value="1h">1 Hour</option>
                                    <option value="4h">4 Hours</option>
                                    <option value="1d">1 Day</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Initial Equity ($)
                                </label>
                                <input
                                    type="number"
                                    value={config.initial_equity}
                                    onChange={(e) => setConfig({...config, initial_equity: parseFloat(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Max Iterations
                                </label>
                                <input
                                    type="number"
                                    value={config.max_iterations}
                                    onChange={(e) => setConfig({...config, max_iterations: parseInt(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Population Size
                                </label>
                                <input
                                    type="number"
                                    value={config.population_size}
                                    onChange={(e) => setConfig({...config, population_size: parseInt(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Take Profit (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={config.take_profit}
                                    onChange={(e) => setConfig({...config, take_profit: parseFloat(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Stop Loss (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={config.stop_loss}
                                    onChange={(e) => setConfig({...config, stop_loss: parseFloat(e.target.value)})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Function Selection Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '2px solid #dbeafe',
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '700', 
                                color: '#1e40af',
                                margin: 0,
                            }}>
                                🎯 Select Trading Functions
                            </h2>
                            <div style={{
                                background: '#eff6ff',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#1e40af',
                            }}>
                                {selectedFunctions.length} Selected
                            </div>
                        </div>

                        {Object.entries(functionsByCategory).map(([category, functions]) => (
                            <div key={category} style={{
                                marginBottom: '20px',
                                padding: '20px',
                                background: '#f9fafb',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#374151',
                                        margin: 0,
                                    }}>
                                        {categoryLabels[category] || category}
                                    </h3>
                                    <button
                                        onClick={() => selectAllInCategory(category)}
                                        style={{
                                            padding: '6px 12px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: '#e5e7eb',
                                            color: '#374151',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Toggle All
                                    </button>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '12px',
                                }}>
                                    {functions.map(func => {
                                        const isSelected = selectedFunctions.includes(func.function_id);
                                        return (
                                            <div
                                                key={func.function_id}
                                                onClick={() => toggleFunctionSelection(func.function_id)}
                                                style={{
                                                    padding: '12px',
                                                    background: isSelected ? '#dbeafe' : 'white',
                                                    border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '10px',
                                                }}
                                            >
                                                {isSelected ? (
                                                    <CheckSquare size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                                                ) : (
                                                    <Square size={20} style={{ color: '#9ca3af', flexShrink: 0, marginTop: '2px' }} />
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: isSelected ? '#1e40af' : '#374151',
                                                        marginBottom: '4px',
                                                    }}>
                                                        {func.function_name}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                        lineHeight: '1.4',
                                                    }}>
                                                        {func.description}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={startBacktest}
                            disabled={selectedFunctions.length === 0 || sessionStatus?.status === 'running'}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: selectedFunctions.length === 0 || sessionStatus?.status === 'running'
                                    ? '#9ca3af'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '700',
                                cursor: selectedFunctions.length === 0 || sessionStatus?.status === 'running' ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                            }}
                        >
                            <Play size={20} />
                            {sessionStatus?.status === 'running' ? 'Training in Progress...' : 'Start AI Training'}
                        </button>
                    </div>

                    {/* Training Progress */}
                    {sessionId && sessionStatus && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '30px',
                            marginBottom: '30px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: '2px solid #dbeafe',
                        }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '700', 
                                color: '#1e40af', 
                                marginBottom: '20px',
                            }}>
                                📊 Training Progress
                            </h2>

                            {/* Progress Bar */}
                            <div style={{
                                width: '100%',
                                height: '30px',
                                background: '#dbeafe',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${sessionStatus.progress}%`,
                                    background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    transition: 'width 0.5s ease',
                                }}>
                                    {sessionStatus.progress}%
                                </div>
                            </div>

                            {/* Status Info */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '15px',
                                marginBottom: '20px',
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #dbeafe',
                                }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Status</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                                        {sessionStatus.status}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #dbeafe',
                                }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Iteration</div>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                                        {sessionStatus.current_iteration}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #dbeafe',
                                }}>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Asset</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                                        {config.asset_symbol}
                                    </div>
                                </div>
                            </div>

                            {/* Logs */}
                            <div style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                background: '#1e293b',
                                color: '#10b981',
                                padding: '20px',
                                borderRadius: '12px',
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                lineHeight: '1.8',
                            }}>
                                {logs.map((log, index) => (
                                    <div key={index} style={{ marginBottom: '8px' }}>
                                        <span style={{ color: '#60a5fa', marginRight: '10px' }}>
                                            [{log.timestamp}]
                                        </span>
                                        <span>{log.message}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Top Strategies */}
                            {sessionStatus.strategies && sessionStatus.strategies.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h3 style={{ 
                                        fontSize: '18px', 
                                        fontWeight: '700', 
                                        color: '#1e40af',
                                        marginBottom: '15px',
                                    }}>
                                        🏆 Top Strategies
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: '15px',
                                    }}>
                                        {sessionStatus.strategies.slice(0, 5).map((strategy, index) => (
                                            <div key={strategy.result_id} style={{
                                                background: '#f9fafb',
                                                padding: '20px',
                                                borderRadius: '12px',
                                                border: '2px solid #dbeafe',
                                            }}>
                                                <div style={{
                                                    display: 'inline-block',
                                                    padding: '6px 12px',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    marginBottom: '15px',
                                                }}>
                                                    #{index + 1}
                                                </div>
                                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                                    <strong>Buy:</strong> {strategy.buy_functions.join(', ')}
                                                </div>
                                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                                    <strong>Sell:</strong> {strategy.sell_functions.join(', ')}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '14px',
                                                    marginTop: '10px',
                                                }}>
                                                    <span>Win Rate:</span>
                                                    <span style={{ 
                                                        fontWeight: '700', 
                                                        color: strategy.win_rate >= 50 ? '#10b981' : '#ef4444'
                                                    }}>
                                                        {strategy.win_rate.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '14px',
                                                }}>
                                                    <span>P&L:</span>
                                                    <span style={{ 
                                                        fontWeight: '700', 
                                                        color: strategy.total_pnl >= 0 ? '#10b981' : '#ef4444'
                                                    }}>
                                                        ${strategy.total_pnl.toFixed(2)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => viewStrategyDetail(strategy.result_id)}
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '15px',
                                                        padding: '10px',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && (
                <>
                    {/* Filters */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '2px solid #dbeafe',
                    }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: '#1e40af', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <Filter size={20} />
                            Filter Results
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px',
                        }}>
                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Search Asset
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search..."
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 40px',
                                            border: '2px solid #dbeafe',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Timeframe
                                </label>
                                <select
                                    value={filterTimeframe}
                                    onChange={(e) => setFilterTimeframe(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <option value="">All Timeframes</option>
                                    <option value="1m">1 Minute</option>
                                    <option value="5m">5 Minutes</option>
                                    <option value="15m">15 Minutes</option>
                                    <option value="1h">1 Hour</option>
                                    <option value="4h">4 Hours</option>
                                    <option value="1d">1 Day</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ color: '#1e40af', fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                    Min Win Rate (%)
                                </label>
                                <input
                                    type="number"
                                    value={filterMinWinRate}
                                    onChange={(e) => setFilterMinWinRate(e.target.value)}
                                    placeholder="e.g., 50"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #dbeafe',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <button
                                onClick={loadResults}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '2px solid #dbeafe',
                    }}>
                        <h2 style={{ 
                            fontSize: '20px', 
                            fontWeight: '700', 
                            color: '#1e40af', 
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <BarChart3 size={20} />
                            Backtest Results ({filteredResults.length})
                        </h2>

                        {filteredResults.length === 0 ? (
                            <div style={{
                                padding: '60px',
                                textAlign: 'center',
                                color: '#6b7280',
                            }}>
                                <BarChart3 size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                                <p style={{ fontSize: '18px', fontWeight: '600' }}>No results found</p>
                                <p style={{ fontSize: '14px' }}>Try adjusting your filters or create a new backtest</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '20px',
                            }}>
                                {filteredResults.map(result => (
                                    <div key={result.session_id} style={{
                                        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                                        padding: '24px',
                                        borderRadius: '12px',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                        }}>
                                            <h3 style={{
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                color: '#1e40af',
                                                margin: 0,
                                            }}>
                                                {result.asset_symbol}
                                            </h3>
                                            <span style={{
                                                padding: '4px 12px',
                                                background: '#dbeafe',
                                                color: '#1e40af',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}>
                                                {result.timeframe}
                                            </span>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                            }}>
                                                <span style={{ color: '#6b7280' }}>Win Rate:</span>
                                                <span style={{
                                                    fontWeight: '700',
                                                    color: result.best_win_rate >= 50 ? '#10b981' : '#ef4444',
                                                }}>
                                                    {result.best_win_rate.toFixed(1)}%
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                            }}>
                                                <span style={{ color: '#6b7280' }}>P&L:</span>
                                                <span style={{
                                                    fontWeight: '700',
                                                    color: result.best_pnl >= 0 ? '#10b981' : '#ef4444',
                                                }}>
                                                    ${result.best_pnl.toFixed(2)}
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                            }}>
                                                <span style={{ color: '#6b7280' }}>Trades:</span>
                                                <span style={{ fontWeight: '700', color: '#1e40af' }}>
                                                    {result.total_trades}
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '14px',
                                            }}>
                                                <span style={{ color: '#6b7280' }}>Fitness:</span>
                                                <span style={{ fontWeight: '700', color: '#1e40af' }}>
                                                    {result.best_fitness.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            marginBottom: '15px',
                                        }}>
                                            {new Date(result.created_at).toLocaleString()}
                                        </div>

                                        <button
                                            onClick={() => {
                                                // Find first strategy for this session
                                                if (sessionStatus?.strategies) {
                                                    const strategy = sessionStatus.strategies[0];
                                                    if (strategy) {
                                                        viewStrategyDetail(strategy.result_id);
                                                    }
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* SCHEDULED TAB */}
            {activeTab === 'scheduled' && (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '30px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #dbeafe',
                }}>
                    <h2 style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#1e40af', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <Calendar size={20} />
                        Scheduled Backtests
                    </h2>
                    <div style={{
                        padding: '60px',
                        textAlign: 'center',
                        color: '#6b7280',
                    }}>
                        <Calendar size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>Scheduled Backtests Coming Soon</p>
                        <p style={{ fontSize: '14px' }}>Set up automated backtests to run daily, weekly, or monthly</p>
                    </div>
                </div>
            )}

            {/* STRATEGY DETAIL MODAL */}
            {selectedStrategy && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflowY: 'auto',
                }}
                onClick={() => {
                    setSelectedStrategy(null);
                    setBokehPlot(null);
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '30px',
                            maxWidth: '1200px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                        }}>
                        <button
                            onClick={() => {
                                setSelectedStrategy(null);
                                setBokehPlot(null);
                            }}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: '700',
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1e40af',
                            marginBottom: '30px',
                        }}>
                            Strategy Details
                        </h2>

                        {/* Functions Used */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '15px' }}>
                                🎯 Buy Functions
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                {selectedStrategy.buy_functions.map(func => (
                                    <span key={func.id} style={{
                                        padding: '8px 16px',
                                        background: '#dbeafe',
                                        color: '#1e40af',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                    }}>
                                        {func.name}
                                    </span>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '15px' }}>
                                🎯 Sell Functions
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {selectedStrategy.sell_functions.map(func => (
                                    <span key={func.id} style={{
                                        padding: '8px 16px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                    }}>
                                        {func.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px',
                        }}>
                            {[
                                { label: 'Fitness Score', value: selectedStrategy.fitness_score.toFixed(2), icon: TrendingUp },
                                { label: 'Win Rate', value: `${selectedStrategy.win_rate.toFixed(1)}%`, icon: Activity, color: selectedStrategy.win_rate >= 50 ? '#10b981' : '#ef4444' },
                                { label: 'Total P&L', value: `${selectedStrategy.total_pnl.toFixed(2)}`, icon: DollarSign, color: selectedStrategy.total_pnl >= 0 ? '#10b981' : '#ef4444' },
                                { label: 'Total Trades', value: selectedStrategy.total_trades, icon: BarChart3 },
                                { label: 'Winning Trades', value: selectedStrategy.winning_trades, icon: TrendingUp, color: '#10b981' },
                                { label: 'Losing Trades', value: selectedStrategy.losing_trades, icon: TrendingDown, color: '#ef4444' },
                                { label: 'Sharpe Ratio', value: selectedStrategy.sharpe_ratio?.toFixed(2) || 'N/A', icon: Activity },
                                { label: 'Max Drawdown', value: selectedStrategy.max_drawdown ? `${selectedStrategy.max_drawdown.toFixed(2)}%` : 'N/A', icon: TrendingDown, color: '#ef4444' },
                            ].map((metric, idx) => {
                                const Icon = metric.icon;
                                return (
                                    <div key={idx} style={{
                                        background: '#f9fafb',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: '2px solid #e5e7eb',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '10px',
                                        }}>
                                            <Icon size={20} style={{ color: '#6b7280' }} />
                                            <span style={{ fontSize: '14px', color: '#6b7280' }}>{metric.label}</span>
                                        </div>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            color: metric.color || '#1e40af',
                                        }}>
                                            {metric.value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bokeh Plot */}
                        {bokehPlot && (
                            <div style={{ marginTop: '30px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '15px' }}>
                                    📈 Equity Curve
                                </h3>
                                <div 
                                    id="bokeh-plot-container"
                                    style={{
                                        width: '100%',
                                        minHeight: '400px',
                                        background: '#f9fafb',
                                        borderRadius: '12px',
                                        padding: '20px',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Load Bokeh Script */}
            <script src="https://cdn.bokeh.org/bokeh/release/bokeh-2.4.3.min.js"></script>
        </div>
        </div>
        </div>  
    );
};

export default SnowAISandbox;
