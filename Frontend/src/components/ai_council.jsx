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

    const currencyPairs = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD',
        'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD',
        'USDCNH', 'GBPAUD', 'EURCHF', 'AUDCAD', 'GBPCAD', 'EURCAD'
    ];

    useEffect(() => {
        setAvailableCurrencies(currencyPairs);
        fetchWatchedAssets();
        fetchTraderAnalyses();
    }, []);

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
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getSentimentStyle = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish': return { color: '#10b981', backgroundColor: '#f0fdf4' };
            case 'bearish': return { color: '#ef4444', backgroundColor: '#fef2f2' };
            case 'neutral': return { color: '#6b7280', backgroundColor: '#f9fafb' };
            default: return { color: '#6b7280', backgroundColor: '#f9fafb' };
        }
    };

    // Styles object
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        },
        mainContent: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        pageTitle: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '24px',
            textAlign: 'center'
        },
        errorAlert: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '16px'
        },
        currencyGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px',
            marginBottom: '20px'
        },
        currencyButton: {
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #bfdbfe',
            backgroundColor: 'white',
            color: '#1e40af',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center'
        },
        currencyButtonSelected: {
            backgroundColor: '#1e40af',
            color: 'white',
            borderColor: '#1e40af'
        },
        addButtonsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
        },
        addButton: {
            backgroundColor: '#059669',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'background-color 0.2s ease'
        },
        watchedAssetsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
        },
        watchedAssetItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#eff6ff',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e0e7ff'
        },
        watchedAssetText: {
            fontWeight: '500',
            color: '#1e40af',
            fontSize: '14px'
        },
        removeButton: {
            color: '#dc2626',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
        },
        analysisHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
        },
        analysisControls: {
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        input: {
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        },
        select: {
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white',
            minWidth: '180px'
        },
        primaryButton: {
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s ease'
        },
        primaryButtonDisabled: {
            backgroundColor: '#9ca3af',
            cursor: 'not-allowed'
        },
        analysisGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
        },
        analysisCard: {
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '20px',
            backgroundColor: 'white',
            transition: 'box-shadow 0.2s ease'
        },
        analysisCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px'
        },
        analysisAssetTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0'
        },
        sentimentBadge: {
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500'
        },
        analysisMetrics: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
        },
        metricItem: {
            display: 'flex',
            flexDirection: 'column'
        },
        metricLabel: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '4px'
        },
        metricValue: {
            fontSize: '14px',
            fontWeight: '600'
        },
        analysisSection: {
            marginBottom: '12px'
        },
        analysisSectionTitle: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '4px'
        },
        analysisSectionContent: {
            fontSize: '13px',
            color: '#374151',
            lineHeight: '1.4'
        },
        analysisFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#9ca3af',
            borderTop: '1px solid #f3f4f6',
            paddingTop: '12px',
            marginTop: '16px'
        },
        refreshButton: {
            color: '#1e40af',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '500'
        },
        loadingText: {
            textAlign: 'center',
            padding: '40px',
            color: '#1e40af',
            fontSize: '16px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
            fontSize: '14px'
        }
    };

    // Media query styles for mobile
    const mobileStyles = `
        @media (max-width: 768px) {
            .analysis-header {
                flex-direction: column;
                align-items: stretch;
            }
            .analysis-controls {
                flex-direction: column;
                width: 100%;
            }
            .analysis-controls input,
            .analysis-controls select,
            .analysis-controls button {
                width: 100%;
            }
            .currency-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            .watched-assets-grid {
                grid-template-columns: 1fr;
            }
            .analysis-grid {
                grid-template-columns: 1fr;
            }
            .analysis-card-header {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `;

    return (
        <div style={styles.container}>
            <style>{mobileStyles}</style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div style={styles.mainContent}>
                    <h5 style={styles.pageTitle}>AI Trading Council</h5>
                    
                    {error && (
                        <div style={styles.errorAlert}>
                            {error}
                        </div>
                    )}

                    {/* Currency Selection Section */}
                    <div style={styles.card}>
                        <h6 style={styles.cardTitle}>Select Currency Pairs to Analyze</h6>
                        
                        <div className="currency-grid" style={styles.currencyGrid}>
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
                                    style={{
                                        ...styles.currencyButton,
                                        ...(selectedCurrencies.includes(currency) ? styles.currencyButtonSelected : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!selectedCurrencies.includes(currency)) {
                                            e.target.style.backgroundColor = '#eff6ff';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!selectedCurrencies.includes(currency)) {
                                            e.target.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>

                        {selectedCurrencies.length > 0 && (
                            <div style={styles.addButtonsContainer}>
                                {selectedCurrencies.map(currency => (
                                    <button
                                        key={`add-${currency}`}
                                        onClick={() => addCurrencyToWatch(currency)}
                                        style={styles.addButton}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                                    >
                                        Add {currency} to Watch
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Watched Assets Section */}
                    <div style={styles.card}>
                        <h6 style={styles.cardTitle}>Watched Assets</h6>
                        
                        {watchedAssets.length === 0 ? (
                            <p style={styles.emptyState}>No assets being watched. Select currencies above to start analyzing.</p>
                        ) : (
                            <div className="watched-assets-grid" style={styles.watchedAssetsGrid}>
                                {watchedAssets.map(asset => (
                                    <div key={asset.id} style={styles.watchedAssetItem}>
                                        <span style={styles.watchedAssetText}>{asset.asset}</span>
                                        <button
                                            onClick={() => removeWatchedAsset(asset.id)}
                                            style={styles.removeButton}
                                            onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                                            onMouseLeave={(e) => e.target.style.color = '#dc2626'}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Analysis Section */}
                    <div style={styles.card}>
                        <div className="analysis-header" style={styles.analysisHeader}>
                            <h6 style={styles.cardTitle}>TraderGPT Analyses</h6>
                            <div className="analysis-controls" style={styles.analysisControls}>
                                <input
                                    type="text"
                                    placeholder="Search analyses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={styles.input}
                                    onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                                <select
                                    value={selectedAssetForAnalysis}
                                    onChange={(e) => setSelectedAssetForAnalysis(e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="">Select Asset for Fresh Analysis</option>
                                    {watchedAssets.map(asset => (
                                        <option key={asset.id} value={asset.asset}>{asset.asset}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => selectedAssetForAnalysis && runFreshAnalysis(selectedAssetForAnalysis)}
                                    disabled={runningAnalysis || !selectedAssetForAnalysis}
                                    style={{
                                        ...styles.primaryButton,
                                        ...(runningAnalysis || !selectedAssetForAnalysis ? styles.primaryButtonDisabled : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!e.target.disabled) {
                                            e.target.style.backgroundColor = '#1d4ed8';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.target.disabled) {
                                            e.target.style.backgroundColor = '#1e40af';
                                        }
                                    }}
                                >
                                    {runningAnalysis ? 'Analyzing...' : 'Run Analysis'}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={styles.loadingText}>
                                <p>Loading analyses...</p>
                            </div>
                        ) : filteredAnalyses.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p>No analyses available yet. Add some assets to watch and wait for the AI council to analyze them.</p>
                            </div>
                        ) : (
                            <div className="analysis-grid" style={styles.analysisGrid}>
                                {filteredAnalyses.map(analysis => (
                                    <div 
                                        key={analysis.id} 
                                        style={styles.analysisCard}
                                        onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
                                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                                    >
                                        <div className="analysis-card-header" style={styles.analysisCardHeader}>
                                            <h3 style={styles.analysisAssetTitle}>{analysis.asset}</h3>
                                            <span style={{
                                                ...styles.sentimentBadge,
                                                ...getSentimentStyle(analysis.market_sentiment)
                                            }}>
                                                {analysis.market_sentiment} ({analysis.confidence_score}%)
                                            </span>
                                        </div>

                                        <div style={styles.analysisMetrics}>
                                            <div style={styles.metricItem}>
                                                <label style={styles.metricLabel}>Risk Level</label>
                                                <p style={{
                                                    ...styles.metricValue,
                                                    color: getRiskColor(analysis.risk_level)
                                                }}>
                                                    {analysis.risk_level}
                                                </p>
                                            </div>
                                            <div style={styles.metricItem}>
                                                <label style={styles.metricLabel}>Time Horizon</label>
                                                <p style={{...styles.metricValue, color: '#374151'}}>{analysis.time_horizon}</p>
                                            </div>
                                        </div>

                                        <div style={styles.analysisSection}>
                                            <label style={styles.analysisSectionTitle}>Entry Strategy</label>
                                            <p style={styles.analysisSectionContent}>{analysis.entry_strategy}</p>
                                        </div>

                                        <div style={styles.analysisSection}>
                                            <label style={styles.analysisSectionTitle}>Key Factors</label>
                                            <p style={styles.analysisSectionContent}>{analysis.key_factors}</p>
                                        </div>

                                        <div style={styles.analysisFooter}>
                                            <span>Updated: {new Date(analysis.updated_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => runFreshAnalysis(analysis.asset)}
                                                style={styles.refreshButton}
                                                onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                                                onMouseLeave={(e) => e.target.style.color = '#1e40af'}
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