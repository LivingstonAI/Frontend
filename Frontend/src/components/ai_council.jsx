import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Target, BarChart3, Brain, RefreshCw } from 'lucide-react';

export default function AICouncil() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [selectedPairs, setSelectedPairs] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const availablePairs = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD',
        'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD',
        'EURCHF', 'AUDCAD', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'CADCHF',
        'CADJPY', 'AUDCHF', 'NZDJPY', 'CHFJPY'
    ];

    const handlePairSelection = (pair) => {
        setSelectedPairs(prev => {
            if (prev.includes(pair)) {
                return prev.filter(p => p !== pair);
            } else if (prev.length < 6) { // Limit to 6 pairs
                return [...prev, pair];
            }
            return prev;
        });
    };

    const fetchAnalyses = async () => {
        if (selectedPairs.length === 0) return;
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${baseUrl}/api/tradergpt-analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken') || '',
                },
                body: JSON.stringify({
                    currency_pairs: selectedPairs,
                    user_email: 'user@example.com' // You can get this from your auth system
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch analyses');
            }
            
            const data = await response.json();
            setAnalyses(data.analyses || []);
        } catch (err) {
            setError('Failed to fetch TraderGPT analyses. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'bearish':
                return <TrendingDown className="w-5 h-5 text-red-600" />;
            default:
                return <BarChart3 className="w-5 h-5 text-yellow-600" />;
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'bearish':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'low':
                return 'text-green-600 bg-green-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'high':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getConfidenceColor = (confidence) => {
        const conf = parseInt(confidence);
        if (conf >= 80) return 'text-green-600';
        if (conf >= 60) return 'text-blue-600';
        if (conf >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Brain className="w-8 h-8 text-blue-600" />
                        <h5 className="major-upcoming-news-events-header" style={{ margin: 0, color: '#1e40af' }}>
                            TraderGPT Analysis Council
                        </h5>
                    </div>

                    {/* Currency Pair Selection */}
                    <div style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px', 
                        padding: '24px', 
                        marginBottom: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h6 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Target className="w-5 h-5 text-blue-600" />
                            Select Currency Pairs (Max 6)
                        </h6>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            {availablePairs.map(pair => (
                                <button
                                    key={pair}
                                    onClick={() => handlePairSelection(pair)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: selectedPairs.includes(pair) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                        backgroundColor: selectedPairs.includes(pair) ? '#eff6ff' : 'white',
                                        color: selectedPairs.includes(pair) ? '#1d4ed8' : '#6b7280',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!selectedPairs.includes(pair)) {
                                            e.target.style.borderColor = '#9ca3af';
                                            e.target.style.backgroundColor = '#f9fafb';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!selectedPairs.includes(pair)) {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {pair}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={fetchAnalyses}
                            disabled={selectedPairs.length === 0 || loading}
                            style={{
                                backgroundColor: selectedPairs.length === 0 || loading ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: selectedPairs.length === 0 || loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4" />
                                    Get TraderGPT Analysis
                                </>
                            )}
                        </button>

                        {selectedPairs.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                    Selected: {selectedPairs.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
                        </div>
                    )}

                    {/* Analysis Results */}
                    {analyses.length > 0 && (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                            gap: '24px' 
                        }}>
                            {analyses.map((analysis, index) => (
                                <div 
                                    key={index}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e5e7eb'
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        paddingBottom: '16px',
                                        borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        <h4 style={{ 
                                            fontSize: '20px', 
                                            fontWeight: '700', 
                                            color: '#1f2937',
                                            margin: 0 
                                        }}>
                                            {analysis.currency_pair}
                                        </h4>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }} className={getSentimentColor(analysis.sentiment)}>
                                            {getSentimentIcon(analysis.sentiment)}
                                            {analysis.sentiment}
                                        </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '1fr 1fr', 
                                        gap: '16px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                                                CONFIDENCE
                                            </p>
                                            <p style={{ 
                                                fontSize: '24px', 
                                                fontWeight: '700', 
                                                margin: 0 
                                            }} className={getConfidenceColor(analysis.confidence_score)}>
                                                {analysis.confidence_score}%
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                                                RISK LEVEL
                                            </p>
                                            <span style={{ 
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }} className={getRiskColor(analysis.risk_level)}>
                                                {analysis.risk_level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Analysis Details */}
                                    <div style={{ space: '16px' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <h6 style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600', 
                                                color: '#374151',
                                                marginBottom: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <Target className="w-4 h-4 text-blue-600" />
                                                Entry Strategy
                                            </h6>
                                            <p style={{ 
                                                fontSize: '14px', 
                                                color: '#6b7280', 
                                                lineHeight: '1.5',
                                                margin: 0,
                                                backgroundColor: '#f8fafc',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                {analysis.entry_strategy}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <h6 style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600', 
                                                color: '#374151',
                                                marginBottom: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                Time Horizon
                                            </h6>
                                            <p style={{ 
                                                fontSize: '14px', 
                                                color: '#6b7280', 
                                                margin: 0,
                                                fontWeight: '500'
                                            }}>
                                                {analysis.time_horizon}
                                            </p>
                                        </div>

                                        <div>
                                            <h6 style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600', 
                                                color: '#374151',
                                                marginBottom: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                                Key Factors
                                            </h6>
                                            <div style={{ 
                                                backgroundColor: '#f8fafc',
                                                padding: '12px',
                                                borderRadius: '8px'
                                            }}>
                                                {analysis.key_factors.split(',').map((factor, idx) => (
                                                    <div key={idx} style={{ 
                                                        fontSize: '14px', 
                                                        color: '#6b7280', 
                                                        marginBottom: idx < analysis.key_factors.split(',').length - 1 ? '4px' : 0,
                                                        paddingLeft: '12px',
                                                        position: 'relative'
                                                    }}>
                                                        <span style={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            color: '#3b82f6'
                                                        }}>•</span>
                                                        {factor.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div style={{ 
                                        marginTop: '20px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #f3f4f6',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ 
                                            fontSize: '12px', 
                                            color: '#9ca3af',
                                            margin: 0
                                        }}>
                                            Analysis generated at {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && analyses.length === 0 && selectedPairs.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '2px dashed #e5e7eb'
                        }}>
                            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h6 style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>
                                Ready for Analysis
                            </h6>
                            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                                Click "Get TraderGPT Analysis" to generate insights for your selected pairs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}