import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

const styles = `
/* Market Stability Score Styles */

.mss-description {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mss-description p {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
}

.mss-controls {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    color: #374151;
    font-size: 14px;
}

.control-group select,
.control-group input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    background: white;
}

.control-group select:focus,
.control-group input:focus {
    outline: none;
    border-color: #667eea;
}

.mss-calculate-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
}

.mss-calculate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.mss-calculate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.mss-loading {
    text-align: center;
    padding: 60px 20px;
}

.spinner {
    border: 4px solid #f3f4f6;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.mss-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.summary-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s;
}

.summary-card:hover {
    transform: translateY(-4px);
}

.summary-card h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #374151;
}

.summary-card .big-number {
    font-size: 48px;
    font-weight: 700;
    margin: 10px 0;
}

.summary-card.stable .big-number {
    color: #10b981;
}

.summary-card.choppy .big-number {
    color: #f59e0b;
}

.summary-card.volatile .big-number {
    color: #ef4444;
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
    padding: 10px 20px;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.category-filter button:hover {
    border-color: #667eea;
    color: #667eea;
}

.category-filter button.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.category-filter button.stable {
    border-color: #10b981;
    color: #10b981;
}

.category-filter button.stable.active {
    background: #10b981;
    border-color: #10b981;
    color: white;
}

.category-filter button.choppy {
    border-color: #f59e0b;
    color: #f59e0b;
}

.category-filter button.choppy.active {
    background: #f59e0b;
    border-color: #f59e0b;
    color: white;
}

.category-filter button.volatile {
    border-color: #ef4444;
    color: #ef4444;
}

.category-filter button.volatile.active {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
}

.mss-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.mss-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.mss-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.card-header h4 {
    margin: 0;
    font-size: 20px;
    color: #1f2937;
}

.mss-badge {
    padding: 6px 14px;
    border-radius: 20px;
    color: white;
    font-weight: 700;
    font-size: 16px;
}

.mss-card .status {
    color: #6b7280;
    font-size: 14px;
    margin: 0 0 15px 0;
    font-weight: 500;
}

.card-metrics {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e7eb;
}

.metric {
    flex: 1;
}

.metric-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
}

.metric-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
}

.card-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.detail-item span:first-child {
    color: #6b7280;
}

.detail-item span:last-child {
    font-weight: 600;
    color: #1f2937;
}

.click-hint {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    font-style: italic;
}

.view-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
}

.view-toggle button {
    padding: 10px 24px;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.view-toggle button:hover {
    border-color: #667eea;
}

.view-toggle button.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.historical-view {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.historical-view h3 {
    margin-top: 0;
    color: #1f2937;
}

.back-btn {
    padding: 10px 20px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background 0.2s;
    color: #374151;
}

.back-btn:hover {
    background: #e5e7eb;
}

.historical-chart {
    margin: 30px 0;
}

.chart-container {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 300px;
    padding: 20px;
    background: #f9fafb;
    border-radius: 8px;
    overflow-x: auto;
}

.chart-bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 8px;
}

.chart-bar {
    width: 100%;
    min-height: 2px;
    border-radius: 2px 2px 0 0;
    transition: opacity 0.2s;
}

.chart-bar:hover {
    opacity: 0.8;
}

.chart-label {
    font-size: 10px;
    color: #6b7280;
    margin-top: 8px;
    writing-mode: horizontal-tb;
    white-space: nowrap;
}

.chart-legend {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}

.historical-table {
    margin-top: 30px;
    overflow-x: auto;
}

.historical-table table {
    width: 100%;
    border-collapse: collapse;
}

.historical-table th {
    background: #f9fafb;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
}

.historical-table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #1f2937;
}

.historical-table tr:hover {
    background: #f9fafb;
}

.mss-empty {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.mss-empty h3 {
    color: #1f2937;
    margin-bottom: 10px;
}

.mss-empty p {
    color: #6b7280;
    font-size: 16px;
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
    const [historicalData, setHistoricalData] = useState(null);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [view, setView] = useState('overview'); // 'overview' or 'historical'

    // Fetch predefined asset lists on mount
    useEffect(() => {
        fetchAssetLists();
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
                setMssData(data.data);
                setView('overview');
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

    const fetchHistoricalMSS = async (symbol) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/mss/historical/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol,
                    period: 180
                })
            });

            const data = await response.json();
            if (data.success) {
                setHistoricalData(data.data);
                setSelectedSymbol(symbol);
                setView('historical');
            } else {
                alert('Error fetching historical data: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch historical data.');
        } finally {
            setLoading(false);
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
                    <h5 className="major-upcoming-news-events-header">Market Stability Score</h5>
                    
                    <div className="mss-description">
                        <p>The Market Stability Score (MSS) evaluates asset tradability based on volatility, trend clarity, and liquidity. Higher scores indicate better trading conditions.</p>
                    </div>

                    {/* Control Panel */}
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

                    {/* View Toggle */}
                    {mssData.length > 0 && (
                        <div className="view-toggle">
                            <button 
                                className={view === 'overview' ? 'active' : ''}
                                onClick={() => setView('overview')}
                            >
                                Overview
                            </button>
                            {historicalData && (
                                <button 
                                    className={view === 'historical' ? 'active' : ''}
                                    onClick={() => setView('historical')}
                                >
                                    Historical: {selectedSymbol}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="mss-loading">
                            <div className="spinner"></div>
                            <p>Analyzing market data...</p>
                        </div>
                    )}

                    {/* Results - Overview */}
                    {!loading && mssData.length > 0 && view === 'overview' && (
                        <>
                            {/* Summary Stats */}
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
                                    <p className="label">Assets (MSS less than 40)</p>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="category-filter">
                                <button 
                                    className={selectedCategory === 'all' ? 'active' : ''}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All ({mssData.length})
                                </button>
                                <button 
                                    className={selectedCategory === 'stable' ? 'active stable' : 'stable'}
                                    onClick={() => setSelectedCategory('stable')}
                                >
                                    Stable ({stableAssets.length})
                                </button>
                                <button 
                                    className={selectedCategory === 'choppy' ? 'active choppy' : 'choppy'}
                                    onClick={() => setSelectedCategory('choppy')}
                                >
                                    Choppy ({choppyAssets.length})
                                </button>
                                <button 
                                    className={selectedCategory === 'volatile' ? 'active volatile' : 'volatile'}
                                    onClick={() => setSelectedCategory('volatile')}
                                >
                                    Volatile ({volatileAssets.length})
                                </button>
                            </div>

                            {/* Assets Grid */}
                            <div className="mss-grid">
                                {filteredData.map((asset, index) => (
                                    <div 
                                        key={index} 
                                        className="mss-card"
                                        style={{ borderLeft: `4px solid ${asset.color}` }}
                                        onClick={() => fetchHistoricalMSS(asset.symbol)}
                                    >
                                        <div className="card-header">
                                            <h4>{asset.symbol}</h4>
                                            <span 
                                                className="mss-badge"
                                                style={{ backgroundColor: asset.color }}
                                            >
                                                {asset.mss}
                                            </span>
                                        </div>
                                        <p className="status">{asset.status}</p>
                                        <div className="card-metrics">
                                            <div className="metric">
                                                <span className="metric-label">Price:</span>
                                                <span className="metric-value">${asset.current_price}</span>
                                            </div>
                                            <div className="metric">
                                                <span className="metric-label">Change:</span>
                                                <span 
                                                    className="metric-value"
                                                    style={{ color: asset.price_change >= 0 ? '#10b981' : '#ef4444' }}
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
                                        <p className="click-hint">Click for historical MSS</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Historical View */}
                    {!loading && historicalData && view === 'historical' && (
                        <div className="historical-view">
                            <button 
                                className="back-btn"
                                onClick={() => setView('overview')}
                            >
                                ← Back to Overview
                            </button>
                            
                            <h3>Historical MSS: {selectedSymbol}</h3>
                            
                            <div className="historical-chart">
                                <div className="chart-container">
                                    {historicalData.map((point, index) => {
                                        const maxMss = Math.max(...historicalData.map(p => p.mss));
                                        const height = (point.mss / maxMss) * 100;
                                        let barColor = '#ef4444';
                                        if (point.mss >= 60) barColor = '#10b981';
                                        else if (point.mss >= 40) barColor = '#f59e0b';
                                        
                                        return (
                                            <div key={index} className="chart-bar-wrapper">
                                                <div 
                                                    className="chart-bar"
                                                    style={{ 
                                                        height: `${height}%`,
                                                        backgroundColor: barColor
                                                    }}
                                                    title={`${point.date}: MSS ${point.mss}`}
                                                ></div>
                                                {index % 10 === 0 && (
                                                    <span className="chart-label">
                                                        {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                                        <span>Stable (≥60)</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                                        <span>Choppy (40-60)</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                                        <span>Volatile (&lt;40)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="historical-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>MSS</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historicalData.slice().reverse().slice(0, 20).map((point, index) => {
                                            let status = 'Volatile';
                                            let statusColor = '#ef4444';
                                            if (point.mss >= 60) {
                                                status = 'Stable';
                                                statusColor = '#10b981';
                                            } else if (point.mss >= 40) {
                                                status = 'Choppy';
                                                statusColor = '#f59e0b';
                                            }
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>{point.date}</td>
                                                    <td><strong>{point.mss}</strong></td>
                                                    <td>${point.price}</td>
                                                    <td style={{ color: statusColor }}>
                                                        <strong>{status}</strong>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
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
    );
}