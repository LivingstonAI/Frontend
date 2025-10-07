import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function AssetCorrelation() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [assetClasses, setAssetClasses] = useState(['forex', 'bonds', 'commodities', 'indices']);
    const [selectedClass, setSelectedClass] = useState('forex');
    const [assetData, setAssetData] = useState({});
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
    const [correlations, setCorrelations] = useState([]);
    const [showCorrelations, setShowCorrelations] = useState(false);
    const intervalRef = useRef(null);

    const styles = {
        mainBodyInfo: {
            padding: '25px',
            backgroundColor: '#0a0e27',
            minHeight: '100vh',
            color: '#e0e6ed'
        },
        header: {
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#ffffff',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '12px'
        },
        controlPanel: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#0f1535',
            borderRadius: '10px',
            border: '1px solid #1e293b'
        },
        selectGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        select: {
            padding: '10px 15px',
            backgroundColor: '#1e293b',
            color: '#e0e6ed',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end'
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        buttonSecondary: {
            padding: '10px 20px',
            backgroundColor: '#475569',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        buttonActive: {
            backgroundColor: '#10b981'
        },
        statusBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            backgroundColor: '#0f1535',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#94a3b8'
        },
        insightsSection: {
            marginBottom: '25px'
        },
        insightCard: {
            padding: '15px 20px',
            backgroundColor: '#0f1535',
            borderRadius: '8px',
            marginBottom: '12px',
            borderLeft: '4px solid',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
        },
        insightBullish: {
            borderLeftColor: '#10b981'
        },
        insightBearish: {
            borderLeftColor: '#ef4444'
        },
        insightInfo: {
            borderLeftColor: '#3b82f6'
        },
        insightWarning: {
            borderLeftColor: '#f59e0b'
        },
        insightIcon: {
            fontSize: '20px',
            marginTop: '2px'
        },
        insightContent: {
            flex: 1
        },
        insightMessage: {
            fontSize: '14px',
            color: '#e0e6ed',
            lineHeight: '1.6',
            marginBottom: '5px'
        },
        insightStrength: {
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '600',
            textTransform: 'uppercase'
        },
        assetsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
        },
        assetCard: {
            padding: '20px',
            backgroundColor: '#0f1535',
            borderRadius: '10px',
            border: '1px solid #1e293b',
            transition: 'all 0.2s ease'
        },
        assetName: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '1px solid #1e293b'
        },
        assetPrice: {
            fontSize: '22px',
            fontWeight: '700',
            color: '#3b82f6',
            marginBottom: '15px'
        },
        timeframeChanges: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        changeRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px'
        },
        changeLabel: {
            color: '#94a3b8',
            fontWeight: '500'
        },
        changeValue: {
            fontWeight: '700',
            fontSize: '14px'
        },
        positive: {
            color: '#10b981'
        },
        negative: {
            color: '#ef4444'
        },
        neutral: {
            color: '#94a3b8'
        },
        correlationsSection: {
            marginTop: '30px'
        },
        correlationsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '15px'
        },
        correlationCard: {
            padding: '15px 20px',
            backgroundColor: '#0f1535',
            borderRadius: '8px',
            border: '1px solid #1e293b'
        },
        correlationPair: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#e0e6ed',
            marginBottom: '8px'
        },
        correlationValue: {
            fontSize: '24px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '5px'
        },
        correlationLabel: {
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            textTransform: 'uppercase'
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '16px',
            color: '#94a3b8'
        },
        spinner: {
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #1e293b',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
        }
    };

    useEffect(() => {
        fetchAssetData();
    }, [selectedClass]);

    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => {
                fetchAssetData();
            }, 10000); // 10 seconds
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoRefresh, selectedClass]);

    const fetchAssetData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${baseUrl}/api/snowai-asset-correlation-data/?asset_class=${selectedClass}`
            );
            const result = await response.json();
            
            if (result.success) {
                setAssetData(result.data);
                setInsights(result.insights || []);
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error('Error fetching asset data:', error);
        }
        setLoading(false);
    };

    const fetchCorrelations = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${baseUrl}/api/snowai-asset-correlation-correlations/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        asset_class: selectedClass,
                        period: '3mo'
                    })
                }
            );
            const result = await response.json();
            
            if (result.success) {
                setCorrelations(result.correlations);
                setShowCorrelations(true);
            }
        } catch (error) {
            console.error('Error fetching correlations:', error);
        }
        setLoading(false);
    };

    const getChangeColor = (value) => {
        if (!value) return styles.neutral;
        return value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;
    };

    const getInsightStyle = (type) => {
        switch (type) {
            case 'bullish': return { ...styles.insightCard, ...styles.insightBullish };
            case 'bearish': return { ...styles.insightCard, ...styles.insightBearish };
            case 'warning': return { ...styles.insightCard, ...styles.insightWarning };
            default: return { ...styles.insightCard, ...styles.insightInfo };
        }
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'bullish': return '📈';
            case 'bearish': return '📉';
            case 'warning': return '⚠️';
            case 'correlation': return '🔗';
            default: return 'ℹ️';
        }
    };

    const getCorrelationColor = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 0.7) return '#10b981';
        if (absValue > 0.4) return '#3b82f6';
        if (absValue > 0.2) return '#f59e0b';
        return '#64748b';
    };

    const getCorrelationStrength = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 0.7) return 'Strong';
        if (absValue > 0.4) return 'Moderate';
        if (absValue > 0.2) return 'Weak';
        return 'Very Weak';
    };

    return (
        <div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .asset-card-hover:hover {
                    transform: translateY(-2px);
                    border-color: #3b82f6;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                }
                
                .button-hover:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                
                .select-hover:hover {
                    border-color: #3b82f6;
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={styles.mainBodyInfo}>
                    <h5 style={styles.header}>SnowAI Asset Correlation & Intermarket Analysis</h5>
                    
                    <div style={styles.controlPanel}>
                        <div style={styles.selectGroup}>
                            <label style={styles.label}>Asset Class</label>
                            <select 
                                style={styles.select}
                                className="select-hover"
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setShowCorrelations(false);
                                }}
                            >
                                <option value="forex">Forex</option>
                                <option value="bonds">Bonds & Yields</option>
                                <option value="commodities">Commodities</option>
                                <option value="indices">Stock Indices</option>
                            </select>
                        </div>
                        
                        <div style={styles.selectGroup}>
                            <label style={styles.label}>Timeframe View</label>
                            <select 
                                style={styles.select}
                                className="select-hover"
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.target.value)}
                            >
                                <option value="1d">Daily</option>
                                <option value="1wk">Weekly</option>
                                <option value="1mo">Monthly</option>
                                <option value="3mo">Quarterly</option>
                            </select>
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button 
                                style={styles.buttonSecondary}
                                className="button-hover"
                                onClick={fetchCorrelations}
                                disabled={loading}
                            >
                                📊 View Correlations
                            </button>
                        </div>
                    </div>
                    
                    <div style={styles.statusBar}>
                        <span>
                            <strong>Status:</strong> {loading ? 'Updating...' : 'Live'}
                        </span>
                        <span>
                            <strong>Last Updated:</strong> {lastUpdated || 'Never'}
                        </span>
                        <span>
                            <strong>Assets:</strong> {Object.keys(assetData).length}
                        </span>
                    </div>
                    
                    {insights.length > 0 && (
                        <div style={styles.insightsSection}>
                            <h6 style={{...styles.label, fontSize: '16px', marginBottom: '15px'}}>
                                🎯 Market Insights & Trading Opportunities
                            </h6>
                            {insights.map((insight, index) => (
                                <div key={index} style={getInsightStyle(insight.type)}>
                                    <div style={styles.insightIcon}>
                                        {getInsightIcon(insight.type)}
                                    </div>
                                    <div style={styles.insightContent}>
                                        <div style={styles.insightMessage}>
                                            {insight.message}
                                        </div>
                                        <div style={styles.insightStrength}>
                                            {insight.strength} signal
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {loading && Object.keys(assetData).length === 0 ? (
                        <div style={styles.loading}>
                            <div style={styles.spinner}></div>
                            <p style={{marginTop: '20px'}}>Loading asset data...</p>
                        </div>
                    ) : (
                        <>
                            {!showCorrelations ? (
                                <div style={styles.assetsGrid}>
                                    {Object.keys(assetData).length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <p style={{fontSize: '18px', marginBottom: '10px'}}>No data available</p>
                                            <p>Click "Refresh Now" to load asset data</p>
                                        </div>
                                    ) : (
                                        Object.entries(assetData).map(([assetName, data]) => (
                                            <div key={assetName} style={styles.assetCard} className="asset-card-hover">
                                                <div style={styles.assetName}>{assetName}</div>
                                                <div style={styles.assetPrice}>
                                                    ${data.current_price?.toFixed(4) || 'N/A'}
                                                </div>
                                                <div style={styles.timeframeChanges}>
                                                    {data['1d'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Daily:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1d'].percent)}}>
                                                                {data['1d'].percent > 0 ? '+' : ''}{data['1d'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['1wk'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Weekly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1wk'].percent)}}>
                                                                {data['1wk'].percent > 0 ? '+' : ''}{data['1wk'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['1mo'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Monthly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1mo'].percent)}}>
                                                                {data['1mo'].percent > 0 ? '+' : ''}{data['1mo'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['3mo'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Quarterly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['3mo'].percent)}}>
                                                                {data['3mo'].percent > 0 ? '+' : ''}{data['3mo'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div style={styles.correlationsSection}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                        <h6 style={{...styles.label, fontSize: '16px', margin: 0}}>
                                            🔗 Asset Correlations (3-Month Period)
                                        </h6>
                                        <button 
                                            style={styles.buttonSecondary}
                                            onClick={() => setShowCorrelations(false)}
                                        >
                                            ← Back to Assets
                                        </button>
                                    </div>
                                    
                                    {correlations.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <p>No correlation data available</p>
                                        </div>
                                    ) : (
                                        <div style={styles.correlationsGrid}>
                                            {correlations.slice(0, 20).map((corr, index) => (
                                                <div key={index} style={styles.correlationCard}>
                                                    <div style={styles.correlationPair}>
                                                        {corr.asset1} ↔ {corr.asset2}
                                                    </div>
                                                    <div 
                                                        style={{
                                                            ...styles.correlationValue,
                                                            color: getCorrelationColor(corr.correlation)
                                                        }}
                                                    >
                                                        {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                                                    </div>
                                                    <div style={styles.correlationLabel}>
                                                        {getCorrelationStrength(corr.correlation)} {corr.correlation > 0 ? 'Positive' : 'Negative'}
                                                        {corr.significant && ' • Significant'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
                                style={{...styles.button, ...(autoRefresh ? styles.buttonActive : {})}}
                                className="button-hover"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                            >
                                {autoRefresh ? '✓ Auto-Refresh ON' : 'Auto-Refresh OFF'}
                            </button>
                            
                            <button 
                                style={styles.button}
                                className="button-hover"
                                onClick={fetchAssetData}
                                disabled={loading}
                            >
                                🔄 Refresh Now
                            </button>
                            
                            <button 
                                style={styles.buttonSecondary}
                                className="button-hover"
                                onClick={fetchCorrelations}
                                disabled={loading}
                            >
                                📊 View Correlations
                            </button>
                        </div>
                    </div>
                    
                    <div style={styles.statusBar}>
                        <span>
                            <strong>Status:</strong> {loading ? 'Updating...' : 'Live'}
                        </span>
                        <span>
                            <strong>Last Updated:</strong> {lastUpdated || 'Never'}
                        </span>
                        <span>
                            <strong>Assets:</strong> {Object.keys(assetData).length}
                        </span>
                    </div>
                    
                    {insights.length > 0 && (
                        <div style={styles.insightsSection}>
                            <h6 style={{...styles.label, fontSize: '16px', marginBottom: '15px'}}>
                                🎯 Market Insights & Trading Opportunities
                            </h6>
                            {insights.map((insight, index) => (
                                <div key={index} style={getInsightStyle(insight.type)}>
                                    <div style={styles.insightIcon}>
                                        {getInsightIcon(insight.type)}
                                    </div>
                                    <div style={styles.insightContent}>
                                        <div style={styles.insightMessage}>
                                            {insight.message}
                                        </div>
                                        <div style={styles.insightStrength}>
                                            {insight.strength} signal
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {loading && Object.keys(assetData).length === 0 ? (
                        <div style={styles.loading}>
                            <div style={styles.spinner}></div>
                            <p style={{marginTop: '20px'}}>Loading asset data...</p>
                        </div>
                    ) : (
                        <>
                            {!showCorrelations ? (
                                <div style={styles.assetsGrid}>
                                    {Object.keys(assetData).length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <p style={{fontSize: '18px', marginBottom: '10px'}}>No data available</p>
                                            <p>Click "Refresh Now" to load asset data</p>
                                        </div>
                                    ) : (
                                        Object.entries(assetData).map(([assetName, data]) => (
                                            <div key={assetName} style={styles.assetCard} className="asset-card-hover">
                                                <div style={styles.assetName}>{assetName}</div>
                                                <div style={styles.assetPrice}>
                                                    ${data.current_price?.toFixed(4) || 'N/A'}
                                                </div>
                                                <div style={styles.timeframeChanges}>
                                                    {data['1d'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Daily:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1d'].percent)}}>
                                                                {data['1d'].percent > 0 ? '+' : ''}{data['1d'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['1wk'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Weekly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1wk'].percent)}}>
                                                                {data['1wk'].percent > 0 ? '+' : ''}{data['1wk'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['1mo'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Monthly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['1mo'].percent)}}>
                                                                {data['1mo'].percent > 0 ? '+' : ''}{data['1mo'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data['3mo'] && (
                                                        <div style={styles.changeRow}>
                                                            <span style={styles.changeLabel}>Quarterly:</span>
                                                            <span style={{...styles.changeValue, ...getChangeColor(data['3mo'].percent)}}>
                                                                {data['3mo'].percent > 0 ? '+' : ''}{data['3mo'].percent}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div style={styles.correlationsSection}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                        <h6 style={{...styles.label, fontSize: '16px', margin: 0}}>
                                            🔗 Asset Correlations (3-Month Period)
                                        </h6>
                                        <button 
                                            style={styles.buttonSecondary}
                                            onClick={() => setShowCorrelations(false)}
                                        >
                                            ← Back to Assets
                                        </button>
                                    </div>
                                    
                                    {correlations.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <p>No correlation data available</p>
                                        </div>
                                    ) : (
                                        <div style={styles.correlationsGrid}>
                                            {correlations.slice(0, 20).map((corr, index) => (
                                                <div key={index} style={styles.correlationCard}>
                                                    <div style={styles.correlationPair}>
                                                        {corr.asset1} ↔ {corr.asset2}
                                                    </div>
                                                    <div 
                                                        style={{
                                                            ...styles.correlationValue,
                                                            color: getCorrelationColor(corr.correlation)
                                                        }}
                                                    >
                                                        {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                                                    </div>
                                                    <div style={styles.correlationLabel}>
                                                        {getCorrelationStrength(corr.correlation)} {corr.correlation > 0 ? 'Positive' : 'Negative'}
                                                        {corr.significant && ' • Significant'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}