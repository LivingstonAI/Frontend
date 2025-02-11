import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

export default function TraderGPTAnalysis() {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [asset, setAsset] = useState("eurusd");
    const [interval, setInterval] = useState("1h");
    const [numDays, setNumDays] = useState(7);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/trader-analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asset,
                    interval,
                    num_days: numDays
                })
            });
            const data = await response.json();
            console.log(data);
            if (data.status === 'success') {
                setAnalysis(data);
            }
        } catch (error) {
            console.error('Error fetching analysis:', error);
            console.log(error)
        }
        setLoading(false);
    };

    const getConsensusMessage = () => {
        if (!analysis?.messages) return null;
        return analysis.messages.find(msg => msg.message_type === "consensus");
    };

    const renderPriceChart = () => {
        if (!analysis?.market_data) return null;

        const consensus = getConsensusMessage()?.content;
        const levels = consensus?.analysis ? {
            support: parseFloat(consensus.analysis.match(/support.*?(\d+\.?\d*)/)?.[1]),
            resistance: parseFloat(consensus.analysis.match(/resistance.*?(\d+\.?\d*)/)?.[1]),
            entry: parseFloat(consensus.analysis.match(/entry.*?(\d+\.?\d*)/)?.[1]),
            stop_loss: parseFloat(consensus.analysis.match(/stop[- ]?loss.*?(\d+\.?\d*)/)?.[1]),
            target: parseFloat(consensus.analysis.match(/target.*?(\d+\.?\d*)/)?.[1])
        } : {};

        return (
            <LineChart width={800} height={400} data={analysis.market_data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Close" stroke="#8884d8" dot={false} />
                {levels.support && <ReferenceLine y={levels.support} stroke="green" strokeDasharray="3 3" label="Support" />}
                {levels.resistance && <ReferenceLine y={levels.resistance} stroke="red" strokeDasharray="3 3" label="Resistance" />}
                {levels.entry && <ReferenceLine y={levels.entry} stroke="blue" label="Entry" />}
                {levels.target && <ReferenceLine y={levels.target} stroke="green" label="Target" />}
                {levels.stop_loss && <ReferenceLine y={levels.stop_loss} stroke="red" label="Stop Loss" />}
            </LineChart>
        );
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={{ padding: '24px' }}>
                    <h5 className="major-upcoming-news-events-header">TraderGPT Analysis</h5>
                    
                    <div className="analysis-params" style={{ 
                        background: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Analysis Parameters</h3>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <input 
                                type="text"
                                placeholder="Asset (e.g. eurusd)"
                                value={asset}
                                onChange={(e) => setAsset(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    width: '160px'
                                }}
                            />
                            <select 
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    width: '160px'
                                }}
                            >
                                <option value="1h">1 Hour</option>
                                <option value="4h">4 Hours</option>
                                <option value="1d">1 Day</option>
                            </select>
                            <input 
                                type="number"
                                placeholder="Number of days"
                                value={numDays}
                                onChange={(e) => setNumDays(parseInt(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    width: '160px'
                                }}
                            />
                            <button 
                                onClick={fetchAnalysis}
                                disabled={loading}
                                style={{
                                    padding: '8px 16px',
                                    background: loading ? '#ccc' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? "Analyzing..." : "Analyze"}
                            </button>
                        </div>
                    </div>

                    {analysis && (
                        <>
                            <div className="chart-container" style={{ 
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                                    Interactive Price Chart with Analysis
                                </h3>
                                {renderPriceChart()}
                            </div>

                            <div className="consensus-container" style={{ 
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '24px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                                    Consensus Analysis
                                </h3>
                                {getConsensusMessage()?.content?.recommendation && (
                                    <div style={{ 
                                        padding: '16px',
                                        borderRadius: '4px',
                                        background: getConsensusMessage().content.recommendation === 'buy' ? '#d4edda' :
                                                   getConsensusMessage().content.recommendation === 'sell' ? '#f8d7da' :
                                                   '#fff3cd',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{ 
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            {getConsensusMessage().content.recommendation.toUpperCase()}
                                            <span style={{ 
                                                color: getConsensusMessage().content.recommendation === 'buy' ? 'green' : 'red'
                                            }}>
                                                {getConsensusMessage().content.recommendation === 'buy' ? '↑' : '↓'}
                                            </span>
                                        </div>
                                        <div>{getConsensusMessage().content.analysis}</div>
                                    </div>
                                )}
                            </div>

                            <div className="discussion-container" style={{ 
                                background: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                                    Trader Discussion
                                </h3>
                                {analysis.messages.filter(msg => msg.message_type === "discussion").map((message, index) => (
                                    <div key={index} style={{ 
                                        marginBottom: '16px',
                                        padding: '16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            {message.trader_id}
                                        </div>
                                        <div>{message.content}</div>
                                        {message.responding_to && (
                                            <div style={{ 
                                                fontSize: '14px',
                                                color: '#666',
                                                marginTop: '8px'
                                            }}>
                                                Responding to: {message.responding_to}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}