import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function AICouncil() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [availableCurrencies, setAvailableCurrencies] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [watchedAssets, setWatchedAssets] = useState([]);
    const [traderAnalyses, setTraderAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAssetForAnalysis, setSelectedAssetForAnalysis] = useState('');
    const [runningAnalysis, setRunningAnalysis] = useState(false);
    const [schedulerStatus, setSchedulerStatus] = useState({
        running: false,
        interval_hours: 4,
        last_run: null,
        next_run: null
    });
    const [schedulerLoading, setSchedulerLoading] = useState(false);

    useEffect(() => {
        setAvailableCurrencies(currencyPairs);
        fetchWatchedAssets();
        fetchTraderAnalyses();
        fetchSchedulerStatus();
    }, []);

    const currencyPairs = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD',
        'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD',
        'USDCNH', 'GBPAUD', 'EURCHF', 'AUDCAD', 'GBPCAD', 'EURCAD'
    ];

    const startScheduler = async () => {
        try {
            setSchedulerLoading(true);
            const response = await fetch(`${baseUrl}/api/start-analysis-scheduler/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setSchedulerStatus(data.status || {});
                setError('');
            } else {
                setError('Failed to start scheduler');
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setSchedulerLoading(false);
        }
    };

    const stopScheduler = async () => {
        try {
            setSchedulerLoading(true);
            const response = await fetch(`${baseUrl}/api/stop-analysis-scheduler/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setSchedulerStatus(data.status || {});
                setError('');
            } else {
                setError('Failed to stop scheduler');
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setSchedulerLoading(false);
        }
    };

    const fetchWatchedAssets = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/fetch-watched-trading-assets/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setWatchedAssets(data.watched_assets || []);
            }
        } catch (error) {
            setError('Failed to fetch watched assets');
        }
    };

    const fetchTraderAnalyses = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/fetch-trader-gpt-analyses/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setTraderAnalyses(data.analyses || []);
            }
        } catch (error) {
            setError('Failed to fetch analyses');
        } finally {
            setLoading(false);
        }
    };

    const addCurrencyToWatch = async (currency) => {
        try {
            const response = await fetch(`${baseUrl}/api/add-trading-asset-to-watch/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asset: currency })
            });
            
            if (response.ok) {
                fetchWatchedAssets();
                setSelectedCurrencies([]);
            } else {
                setError('Failed to add currency to watch list');
            }
        } catch (error) {
            setError('Network error occurred');
        }
    };

    const removeWatchedAsset = async (assetId) => {
        try {
            const response = await fetch(`${baseUrl}/api/remove-watched-trading-asset/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asset_id: assetId })
            });
            
            if (response.ok) {
                fetchWatchedAssets();
            } else {
                setError('Failed to remove asset');
            }
        } catch (error) {
            setError('Network error occurred');
        }
    };

    const runFreshAnalysis = async (asset) => {
        try {
            setRunningAnalysis(true);
            const response = await fetch(`${baseUrl}/api/run-fresh-trader-analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asset: asset })
            });
            
            if (response.ok) {
                fetchTraderAnalyses();
                setError('');
            } else {
                setError('Failed to run fresh analysis');
            }
        } catch (error) {
            setError('Network error occurred');
        } finally {
            setRunningAnalysis(false);
        }
    };

    const filteredAnalyses = traderAnalyses.filter(analysis =>
        analysis.asset.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRiskColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'low': return 'text-green-600';
            case 'medium': return 'text-yellow-600';
            case 'high': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish': return 'text-green-600 bg-green-50';
            case 'bearish': return 'text-red-600 bg-red-50';
            case 'neutral': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">AI Trading Council</h5>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Scheduler Control Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h6 className="text-lg font-semibold text-blue-800 mb-4">Analysis Scheduler</h6>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${schedulerStatus.running ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">
                                        Status: {schedulerStatus.running ? 'Running' : 'Stopped'}
                                    </span>
                                </div>
                                
                                {schedulerStatus.running && (
                                    <div className="text-sm text-gray-600">
                                        <span>Interval: {schedulerStatus.interval_hours}h</span>
                                        {schedulerStatus.last_run && (
                                            <span className="ml-3">
                                                Last run: {new Date(schedulerStatus.last_run).toLocaleString()}
                                            </span>
                                        )}
                                        {schedulerStatus.next_run && (
                                            <span className="ml-3">
                                                Next run: {new Date(schedulerStatus.next_run).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchSchedulerStatus}
                                    className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                                >
                                    Refresh Status
                                </button>
                                
                                {schedulerStatus.running ? (
                                    <button
                                        onClick={stopScheduler}
                                        disabled={schedulerLoading}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                                    >
                                        {schedulerLoading ? 'Stopping...' : 'Stop Scheduler'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={startScheduler}
                                        disabled={schedulerLoading}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                                    >
                                        {schedulerLoading ? 'Starting...' : 'Start Scheduler'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Currency Selection Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h6 className="text-lg font-semibold text-blue-800 mb-4">Select Currency Pairs to Analyze</h6>
                        
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                            {availableCurrencies.map(currency => (
                                <button
                                    key={currency}
                                    onClick={() => {
                                        if (selectedCurrencies.includes(currency)) {
                                            setSelectedCurrencies(prev => prev.filter(c => c !== currency));
                                        } else {
                                            setSelectedCurrencies(prev => [...prev, currency]);
                                        }
                                    }}
                                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                                        selectedCurrencies.includes(currency)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                                    }`}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>

                        {selectedCurrencies.length > 0 && (
                            <div className="flex gap-2">
                                {selectedCurrencies.map(currency => (
                                    <button
                                        key={`add-${currency}`}
                                        onClick={() => addCurrencyToWatch(currency)}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                                    >
                                        Add {currency} to Watch
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Watched Assets Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h6 className="text-lg font-semibold text-blue-800 mb-4">Watched Assets</h6>
                        
                        {watchedAssets.length === 0 ? (
                            <p className="text-gray-500">No assets being watched. Select currencies above to start analyzing.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {watchedAssets.map(asset => (
                                    <div key={asset.id} className="flex items-center justify-between bg-blue-50 p-3 rounded border">
                                        <span className="font-medium text-blue-800">{asset.asset}</span>
                                        <button
                                            onClick={() => removeWatchedAsset(asset.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h6 className="text-lg font-semibold text-blue-800">TraderGPT Analyses</h6>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Search analyses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <select
                                    value={selectedAssetForAnalysis}
                                    onChange={(e) => setSelectedAssetForAnalysis(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select Asset for Fresh Analysis</option>
                                    {watchedAssets.map(asset => (
                                        <option key={asset.id} value={asset.asset}>{asset.asset}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => selectedAssetForAnalysis && runFreshAnalysis(selectedAssetForAnalysis)}
                                    disabled={runningAnalysis || !selectedAssetForAnalysis}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                                >
                                    {runningAnalysis ? 'Analyzing...' : 'Run Analysis'}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-blue-600">Loading analyses...</p>
                            </div>
                        ) : filteredAnalyses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No analyses available yet. Add some assets to watch and wait for the AI council to analyze them.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAnalyses.map(analysis => (
                                    <div key={analysis.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-blue-800">{analysis.asset}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.market_sentiment)}`}>
                                                {analysis.market_sentiment} ({analysis.confidence_score}%)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Risk Level</label>
                                                <p className={`font-semibold ${getRiskColor(analysis.risk_level)}`}>
                                                    {analysis.risk_level}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Time Horizon</label>
                                                <p className="font-semibold text-gray-800">{analysis.time_horizon}</p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-sm font-medium text-gray-600">Entry Strategy</label>
                                            <p className="text-sm text-gray-700 mt-1">{analysis.entry_strategy}</p>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-sm font-medium text-gray-600">Key Factors</label>
                                            <p className="text-sm text-gray-700 mt-1">{analysis.key_factors}</p>
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                            <span>Updated: {new Date(analysis.updated_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => runFreshAnalysis(analysis.asset)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Refresh Analysis
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}