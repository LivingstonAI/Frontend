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
}

.mss-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    border-color: #2563eb;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-header h4 {
    margin: 0;
    font-size: 22px;
    color: #1e40af;
    font-weight: 700;
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
    display: flex;
    gap: 20px;
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 2px solid #dbeafe;
}

.metric {
    flex: 1;
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
    font-size: 20px;
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

            {/* Loading State */}
            {loading && (
                <div className="mss-loading">
                    <div className="spinner"></div>
                    <p>Analyzing market data...</p>
                </div>
            )}

            {/* Results */}
            {!loading && mssData.length > 0 && (
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
                            <p className="label">Assets (MSS &lt; 40)</p>
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

                    {/* Assets Grid */}
                    <div className="mss-grid">
                        {filteredData.map((asset, index) => (
                            <div 
                                key={index} 
                                className="mss-card"
                            >
                                <div className="card-header">
                                    <h4>{asset.symbol}</h4>
                                    <span className="mss-badge">
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
        </div>
    );
}
