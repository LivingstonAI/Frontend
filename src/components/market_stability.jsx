import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const styles = `
/* Market Stability Score Styles */

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
    position: relative;
}

.mss-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: #2563eb;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 10px;
}

.card-header-left {
    flex: 1;
    min-width: 0;
}

.card-header h4 {
    margin: 0;
    font-size: 22px;
    color: #1e40af;
    font-weight: 700;
    word-break: break-word;
}

.card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
    white-space: nowrap;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    white-space: nowrap;
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

.save-model-btn.reactivate:hover:not(:disabled) {
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
    white-space: nowrap;
}

.deactivate-model-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
}

.deactivate-model-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.mss-badge {
    padding: 8px 16px;
    border-radius: 24px;
    color: white;
    font-weight: 700;
    font-size: 18px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
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

.metric {
    min-width: 0;
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
    word-break: break-word;
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
    gap: 10px;
}

.detail-item span:first-child {
    color: #6b7280;
    font-weight: 500;
}

.detail-item span:last-child {
    font-weight: 600;
    color: #1e40af;
    text-align: right;
    word-break: break-word;
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
    .mss-wrapper {
        padding: 10px;
    }

    .mss-header {
        padding: 20px;
    }

    .mss-header h1 {
        font-size: 24px;
    }

    .mss-header p {
        font-size: 14px;
    }

    .mss-controls {
        padding: 20px;
    }

    .control-group {
        min-width: 100%;
    }

    .mss-calculate-btn {
        width: 100%;
        padding: 12px 24px;
    }

    .summary-card .big-number {
        font-size: 36px;
    }

    .mss-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .mss-card {
        padding: 20px;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .chart-link,
    .save-model-btn,
    .deactivate-model-btn {
        font-size: 12px;
        padding: 8px 12px;
    }

    .card-metrics {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .metric-value {
        font-size: 16px;
    }

    .category-filter {
        gap: 8px;
    }

    .category-filter button {
        padding: 10px 16px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .mss-header h1 {
        font-size: 20px;
    }

    .card-header h4 {
        font-size: 18px;
    }

    .summary-card {
        padding: 20px;
    }

    .summary-card .big-number {
        font-size: 28px;
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

    useEffect(() => {
        fetchAssetLists();
        fetchExistingModels();
    }, []);

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
                fetchExistingModels(); // Refresh to get latest state
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

            // Check current trend before reactivating
            if (!asset.trend || asset.trend === 'ranging' || asset.trend === 'unknown') {
                alert(`❌ Cannot reactivate ${asset.symbol}: No clear trend detected. Current market is ${asset.trend || 'unknown'}.`);
                setDeactivatingModels(prev => ({ ...prev, [asset.symbol]: false }));
                return;
            }

            // Determine model code based on CURRENT trend
            let modelCode = '';
            if (asset.trend === 'uptrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if buy_hold(dataset=dataset):
        if is_uptrend(data=dataset):
            return_statement = 'buy'`;
            } else if (asset.trend === 'downtrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if sell_hold(dataset=dataset):
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
                fetchExistingModels(); // Refresh to get latest state
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

    const fetchExistingModels = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-models/`);
            const models = await response.json();
            const assets = new Set(models.map(m => m.asset));
            setSavedModels(assets);
            
            // Track which models are active
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
        try {
            let symbols = [];
            
            if (selectedAssetClass === 'custom') {
                symbols = customSymbols.split(',').map(s => s.trim()).filter(s => s);
            } else if (assetLists) {
                symbols = assetLists[selectedAssetClass] || [];
            }

            const response = await fetch(`${baseUrl}/api/mss/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbols: symbols,
                    period: period
                })
            });

            const data = await response.json();
            if (data.success) {
                // Fetch trend data for each asset
                const enrichedData = await Promise.all(
                    data.data.map(async (asset) => {
                        try {
                            const trendResponse = await fetch(
                                `${baseUrl}/api/detect-trend/?symbol=${asset.symbol}&period=20`
                            );
                            const trendData = await trendResponse.json();
                            return {
                                ...asset,
                                trend: trendData.trend || 'unknown'
                            };
                        } catch (error) {
                            return {
                                ...asset,
                                trend: 'unknown'
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

    const saveToForwardTest = async (asset) => {
        setSavingModels(prev => ({ ...prev, [asset.symbol]: true }));

        try {
            // Determine model code based on trend
            let modelCode = '';
            if (asset.trend === 'uptrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if buy_hold(dataset=dataset):
        if is_uptrend(data=dataset):
            return_statement = 'buy'`;
            } else if (asset.trend === 'downtrend') {
                modelCode = `set_take_profit(number=4, type_of_setting='PERCENTAGE')
set_stop_loss(number=2, type_of_setting='PERCENTAGE')
if num_positions == 0:
    if sell_hold(dataset=dataset):
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
                fetchExistingModels(); // Refresh to get latest state
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

    const filteredData = mssData.filter(item => {
        if (selectedCategory === 'all') return true;
        return item.category === selectedCategory;
    });

    const stableAssets = mssData.filter(item => item.category === 'stable');
    const choppyAssets = mssData.filter(item => item.category === 'choppy');
    const volatileAssets = mssData.filter(item => item.category === 'volatile');

    return (
        <div>
            <style>{styles}</style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
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
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            disabled={loading}
                        >
                            <option value={20}>20 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={60}>60 Days</option>
                            <option value={90}>90 Days</option>
                            <option value={180}>180 Days</option>
                        </select>
                    </div>

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

                    <div className="category-filter">
                        <button 
                            className={selectedCategory === 'all' ? 'active' : ''}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All ({mssData.length})
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
                            <div 
                                key={index} 
                                className="mss-card"
                            >
                                <div className="card-header">
                                    <div className="card-header-left">
                                        <h4>{asset.symbol}</h4>
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
                                        {savedModels.has(asset.symbol) ? (
                                            activeModels[asset.symbol]?.isActive ? (
                                                <button
                                                    className="deactivate-model-btn"
                                                    onClick={() => deactivateModel(asset)}
                                                    disabled={deactivatingModels[asset.symbol]}
                                                >
                                                    {deactivatingModels[asset.symbol] ? '⏸️ Pausing...' : '⏸️ Deactivate'}
                                                </button>
                                            ) : (
                                                <button
                                                    className="save-model-btn reactivate"
                                                    onClick={() => reactivateModel(asset)}
                                                    disabled={deactivatingModels[asset.symbol]}
                                                >
                                                    {deactivatingModels[asset.symbol] ? '▶️ Activating...' : '▶️ Reactivate'}
                                                </button>
                                            )
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
                                    </div>
                                </div>
                                <p className="status">{asset.status}</p>
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
                </div>
            </div>
        </div>
    );
}
