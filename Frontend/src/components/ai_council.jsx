import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function AICouncil() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [selectedPairs, setSelectedPairs] = useState([]);
    const [availablePairs] = useState([
        'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 
        'USDCHF', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY'
    ]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAnalyses = async () => {
        if (selectedPairs.length === 0) {
            setError('Please select at least one currency pair');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const userEmail = Cookies.get('user_email') || 'demo@example.com';
            
            const response = await fetch(`${baseUrl}/api/trader-gpt-advanced-forex-analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currency_pairs: selectedPairs,
                    user_email: userEmail
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analyses');
            }

            const data = await response.json();
            setAnalyses(data.analyses || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePairToggle = (pair) => {
        setSelectedPairs(prev => 
            prev.includes(pair) 
                ? prev.filter(p => p !== pair)
                : [...prev, pair]
        );
    };

    const getImpactColor = (impact) => {
        switch (impact?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish': return 'text-green-600';
            case 'bearish': return 'text-red-600';
            case 'neutral': return 'text-gray-600';
            default: return 'text-blue-600';
        }
    };

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
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
                    <h5 className="major-upcoming-news-events-header">AI Council - TraderGPT Analysis</h5>
                    
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h6 style={{ color: '#1e40af', marginBottom: '15px', fontWeight: '600' }}>Select Currency Pairs for Analysis</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                {availablePairs.map(pair => (
                                    <button
                                        key={pair}
                                        onClick={() => handlePairToggle(pair)}
                                        style={{
                                            padding: '8px 12px',
                                            border: selectedPairs.includes(pair) ? '2px solid #1e40af' : '2px solid #e5e7eb',
                                            borderRadius: '6px',
                                            backgroundColor: selectedPairs.includes(pair) ? '#eff6ff' : 'white',
                                            color: selectedPairs.includes(pair) ? '#1e40af' : '#374151',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: selectedPairs.includes(pair) ? '600' : '400',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {pair}
                                    </button>
                                ))}
                            </div>
                            
                            <button
                                onClick={fetchAnalyses}
                                disabled={loading || selectedPairs.length === 0}
                                style={{
                                    backgroundColor: loading || selectedPairs.length === 0 ? '#9ca3af' : '#1e40af',
                                    color: 'white',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: loading || selectedPairs.length === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? 'Analyzing...' : 'Get TraderGPT Analysis'}
                            </button>
                        </div>

                        {error && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                <div style={{ marginBottom: '10px' }}>🤖 TraderGPT is analyzing market conditions...</div>
                                <div style={{ fontSize: '14px' }}>This may take a few moments</div>
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: '20px' }}>
                            {analyses.map((analysis, index) => (
                                <div key={index} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h3 style={{ color: '#1e40af', fontWeight: '700', fontSize: '18px', margin: 0 }}>
                                            {analysis.currency_pair}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${getSentimentColor(analysis.sentiment)}`} style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                                                {analysis.sentiment?.toUpperCase()} {analysis.confidence_score}%
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px', fontSize: '13px' }}>Entry Strategy</div>
                                            <div style={{ color: '#1e40af', fontSize: '14px' }}>{analysis.entry_strategy}</div>
                                        </div>
                                        
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px', fontSize: '13px' }}>Risk Level</div>
                                            <div className={getRiskColor(analysis.risk_level)} style={{ fontSize: '14px', fontWeight: '600' }}>
                                                {analysis.risk_level?.toUpperCase()}
                                            </div>
                                        </div>
                                        
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px', fontSize: '13px' }}>Time Horizon</div>
                                            <div style={{ color: '#6b7280', fontSize: '14px' }}>{analysis.time_horizon}</div>
                                        </div>
                                        
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px', fontSize: '13px' }}>Target Price</div>
                                            <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: '600' }}>{analysis.target_price}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Key Factors</div>
                                        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ color: '#4b5563', fontSize: '13px', lineHeight: '1.5' }}>{analysis.key_factors}</div>
                                        </div>
                                    </div>

                                    {analysis.economic_events && analysis.economic_events.length > 0 && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Upcoming Economic Events</div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                {analysis.economic_events.slice(0, 3).map((event, idx) => (
                                                    <div key={idx} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>{event.event_name}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{event.currency} - {new Date(event.date_time).toLocaleDateString()}</div>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(event.impact)}`}>
                                                            {event.impact}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {analysis.recent_news && analysis.recent_news.length > 0 && (
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Related News</div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                {analysis.recent_news.slice(0, 2).map((news, idx) => (
                                                    <div key={idx} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>{news.title}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{news.source}</div>
                                                        {news.highlights && (
                                                            <div style={{ fontSize: '12px', color: '#4b5563', fontStyle: 'italic' }}>{news.highlights}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}