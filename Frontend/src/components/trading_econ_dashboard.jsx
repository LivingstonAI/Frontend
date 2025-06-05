import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Brain, DollarSign, Calendar, Target, Activity, BarChart3, Zap } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function TradingEconDashboard() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [selectedAsset, setSelectedAsset] = useState("EURUSD");
    const [economicData, setEconomicData] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [bias, setBias] = useState("NEUTRAL");
    const [confidence, setConfidence] = useState(0);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [apiKeyLoaded, setApiKeyLoaded] = useState(false);

    const popularAssets = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "NZDUSD", "USDCAD", "EURJPY"];

    const fetchAPIKey = async () => {
        try {
            setError(null);
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.OPENAI_API_KEY) {
                setApiKey(data.OPENAI_API_KEY);
                setApiKeyLoaded(true);
            } else {
                throw new Error("No API key found in response");
            }
        } catch (error) {
            console.error("Error fetching API key:", error);
            setError(`Failed to load API key: ${error.message}`);
            setApiKeyLoaded(true); // Set to true to stop loading state
        }
    };

    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);

    // CSS Styles object
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            color: '#1e293b'
        },
        mainContent: {
            flex: 1,
            padding: '2rem',
            background: 'rgba(248, 250, 252, 0.8)'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        assetButton: {
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            margin: '0.25rem'
        },
        activeAssetButton: {
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: 'white',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            transform: 'translateY(-2px)'
        },
        inactiveAssetButton: {
            backgroundColor: 'white',
            color: '#475569',
            border: '2px solid #e2e8f0'
        },
        analyzeButton: {
            padding: '1rem 2rem',
            borderRadius: '0.75rem',
            fontWeight: '700',
            fontSize: '1.125rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '1rem 0'
        },
        analyzeButtonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            background: '#9ca3af'
        },
        card: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)'
        },
        loadingSpinner: {
            width: '3rem',
            height: '3rem',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        errorCard: {
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '2px solid #fecaca',
            color: '#dc2626',
            marginBottom: '1rem'
        },
        biasIndicator: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white'
        },
        metricCard: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s ease'
        },
        newsCard: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        economicEvent: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '0.75rem',
            padding: '1rem',
            borderLeft: '4px solid #3b82f6',
            marginBottom: '1rem'
        },
        welcomeCard: {
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '2px solid #bae6fd',
            textAlign: 'center',
            color: '#0c4a6e'
        }
    };

    const fetchNewsAndEconomicData = async (asset) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${baseUrl}/fetch_news_data_api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    assets: [asset],
                    user_email: 'butterrobot83@gmail.com'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch news data: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.message && !data.economic_events) {
                throw new Error("No data received from API");
            }
            
            setNewsData(Array.isArray(data.message) ? data.message : []);
            setEconomicData(data.economic_events?.[0] || null);
            
            // Generate AI analysis if API key is available
            if (apiKey) {
                await generateAIAnalysis(data, asset);
            } else {
                setError("AI analysis unavailable: No API key");
            }
            
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(`Failed to fetch market data: ${error.message}`);
            // Reset data on error
            setNewsData([]);
            setEconomicData(null);
            setAiAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    const generateAIAnalysis = async (data, asset) => {
        if (!apiKey) {
            setError("Cannot generate AI analysis: API key not available");
            return;
        }
        
        try {
            const prompt = `Analyze the following trading data for ${asset}:

NEWS DATA:
${JSON.stringify(data.message?.slice(0, 3) || [], null, 2)}

ECONOMIC EVENTS:
${data.economic_events?.[0]?.economic_events || 'No recent events'}

Provide a comprehensive trading analysis with:
1. BIAS: BULLISH/BEARISH/NEUTRAL
2. CONFIDENCE: 1-100%
3. KEY_FACTORS: Top 3 factors affecting price
4. RISK_LEVEL: LOW/MEDIUM/HIGH
5. ENTRY_STRATEGY: Recommended approach
6. TIME_HORIZON: SHORT/MEDIUM/LONG term outlook
7. PRICE_TARGETS: Potential levels
8. STOP_LOSS: Risk management levels

Format as JSON object.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.choices || !result.choices[0]) {
                throw new Error("Invalid response from OpenAI API");
            }
            
            const aiResponse = result.choices[0].message.content;

            console.log('AI Response');
            console.log(aiResponse);
            
                try {
                // Extract JSON from markdown code block if present
                let jsonString = aiResponse;
                if (aiResponse.includes('```json')) {
                    const start = aiResponse.indexOf('```json') + 7;
                    const end = aiResponse.lastIndexOf('```');
                    jsonString = aiResponse.substring(start, end).trim();
                } else if (aiResponse.includes('```')) {
                    const start = aiResponse.indexOf('```') + 3;
                    const end = aiResponse.lastIndexOf('```');
                    jsonString = aiResponse.substring(start, end).trim();
                }
                
                const analysis = JSON.parse(jsonString);
                setAiAnalysis(analysis);
                setBias(analysis.BIAS || "NEUTRAL");
                setConfidence(parseInt(analysis.CONFIDENCE) || 0);
            } catch (parseError) {
                console.warn("Failed to parse AI response as JSON, using raw response");
                setAiAnalysis({ raw: aiResponse });
                setBias("NEUTRAL");
                setConfidence(0);
            }
        } catch (error) {
            console.error("Error generating AI analysis:", error);
            setError(`AI analysis failed: ${error.message}`);
        }
    };

    const handleAnalyze = () => {
        if (!apiKeyLoaded || loading) return;
        setHasAnalyzed(true);
        fetchNewsAndEconomicData(selectedAsset);
    };

    const handleAssetChange = (asset) => {
        setSelectedAsset(asset);
        // Reset analysis state when asset changes
        if (hasAnalyzed) {
            setNewsData([]);
            setEconomicData(null);
            setAiAnalysis(null);
            setBias("NEUTRAL");
            setConfidence(0);
            setError(null);
        }
    };

    const getBiasColor = (bias) => {
        switch (bias) {
            case 'BULLISH': return '#10b981';
            case 'BEARISH': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    const getBiasIcon = (bias) => {
        switch (bias) {
            case 'BULLISH': return <TrendingUp style={{ width: '1.5rem', height: '1.5rem' }} />;
            case 'BEARISH': return <TrendingDown style={{ width: '1.5rem', height: '1.5rem' }} />;
            default: return <Activity style={{ width: '1.5rem', height: '1.5rem' }} />;
        }
    };

    const parseEconomicEvents = (eventText) => {
        if (!eventText || typeof eventText !== 'string') return [];
        
        const events = [];
        const lines = eventText.split('\n');
        let currentEvent = {};
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            if (trimmedLine.startsWith('Date:')) {
                if (Object.keys(currentEvent).length > 0) {
                    events.push(currentEvent);
                }
                currentEvent = { date: trimmedLine.replace('Date:', '').trim() };
            } else if (trimmedLine.startsWith('Event:')) {
                currentEvent.event = trimmedLine.replace('Event:', '').trim();
            } else if (trimmedLine.startsWith('Actual:')) {
                currentEvent.actual = trimmedLine.replace('Actual:', '').trim();
            } else if (trimmedLine.startsWith('Forecast:')) {
                currentEvent.forecast = trimmedLine.replace('Forecast:', '').trim();
            } else if (trimmedLine.startsWith('Previous:')) {
                currentEvent.previous = trimmedLine.replace('Previous:', '').trim();
            }
        });
        
        if (Object.keys(currentEvent).length > 0) {
            events.push(currentEvent);
        }
        
        return events.slice(0, 5);
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .asset-button:hover:not(:disabled) {
                    background-color: #f1f5f9 !important;
                    border-color: #3b82f6 !important;
                }
                .news-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.15);
                    border-color: #3b82f6;
                }
                .metric-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
                }
                .analyze-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div style={styles.mainContent}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={styles.title}>
                            Trading Economic Dashboard
                        </h1>
                        
                        {/* Error Display */}
                        {error && (
                            <div style={styles.errorCard}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                                    <strong>Error</strong>
                                </div>
                                <p style={{ margin: 0 }}>{error}</p>
                            </div>
                        )}
                        
                        {/* Asset Selector */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {popularAssets.map(asset => (
                                <button
                                    key={asset}
                                    onClick={() => handleAssetChange(asset)}
                                    className="asset-button"
                                    style={{
                                        ...styles.assetButton,
                                        ...(selectedAsset === asset ? styles.activeAssetButton : styles.inactiveAssetButton)
                                    }}
                                    disabled={loading}
                                >
                                    {asset}
                                </button>
                            ))}
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            className="analyze-button"
                            style={{
                                ...styles.analyzeButton,
                                ...(loading || !apiKeyLoaded ? styles.analyzeButtonDisabled : {})
                            }}
                            disabled={loading || !apiKeyLoaded}
                        >
                            <Brain style={{ width: '1.25rem', height: '1.25rem' }} />
                            {loading ? 'Analyzing...' : `Analyze ${selectedAsset}`}
                        </button>

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
                                <div style={styles.loadingSpinner}></div>
                                <span style={{ marginLeft: '1rem', fontSize: '1.125rem', color: '#3b82f6' }}>
                                    Analyzing market data...
                                </span>
                            </div>
                        )}

                        {/* Welcome Message */}
                        {!hasAnalyzed && !loading && (
                            <div style={styles.welcomeCard}>
                                <Brain style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: '#0369a1' }} />
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0c4a6e' }}>
                                    Welcome to Trading Dashboard
                                </h2>
                                <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                                    Select an asset and click "Analyze" to get comprehensive market analysis including:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left' }}>
                                    <div>• AI-powered sentiment analysis</div>
                                    <div>• Economic events impact</div>
                                    <div>• Latest market news</div>
                                    <div>• Trading recommendations</div>
                                </div>
                            </div>
                        )}

                        {/* Analysis Results */}
                        {!loading && hasAnalyzed && (aiAnalysis || newsData.length > 0 || economicData) && (
                            <div style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                                {/* AI Analysis Panel */}
                                <div style={{ ...styles.card, gridColumn: '1 / 3' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <Brain style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6', marginRight: '0.75rem' }} />
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>AI Market Analysis</h2>
                                    </div>
                                    
                                    {aiAnalysis ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {/* Bias & Confidence */}
                                            <div style={styles.biasIndicator}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ color: getBiasColor(bias) }}>
                                                        {getBiasIcon(bias)}
                                                    </span>
                                                    <span style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                                        {bias}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Confidence</div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{confidence}%</div>
                                                </div>
                                            </div>

                                            {/* Key Metrics Grid */}
                                            <div style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                {aiAnalysis.RISK_LEVEL && (
                                                    <div style={styles.metricCard} className="metric-card">
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                            <AlertTriangle style={{ width: '1rem', height: '1rem', color: '#f59e0b', marginRight: '0.5rem' }} />
                                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Risk Level</span>
                                                        </div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af' }}>
                                                            {aiAnalysis.RISK_LEVEL}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {aiAnalysis.TIME_HORIZON && (
                                                    <div style={styles.metricCard} className="metric-card">
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                            <Calendar style={{ width: '1rem', height: '1rem', color: '#3b82f6', marginRight: '0.5rem' }} />
                                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Time Horizon</span>
                                                        </div>
                                                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af' }}>
                                                            {aiAnalysis.TIME_HORIZON}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Key Factors */}
                                            {aiAnalysis.KEY_FACTORS && (
                                                <div style={styles.metricCard}>
                                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#1e40af' }}>
                                                        <Target style={{ width: '1rem', height: '1rem', color: '#10b981', marginRight: '0.5rem' }} />
                                                        Key Factors
                                                    </h3>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {Array.isArray(aiAnalysis.KEY_FACTORS) 
                                                            ? aiAnalysis.KEY_FACTORS.map((factor, idx) => (
                                                                <li key={idx} style={{ color: '#475569', marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative' }}>
                                                                    <span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>•</span>
                                                                    {factor}
                                                                </li>
                                                            ))
                                                            : <li style={{ color: '#475569', paddingLeft: '1rem', position: 'relative' }}>
                                                                <span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>•</span>
                                                                {aiAnalysis.KEY_FACTORS}
                                                              </li>
                                                        }
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Trading Levels */}
                                            <div style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                {aiAnalysis.PRICE_TARGETS && (
                                                    <div style={styles.metricCard}>
                                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#10b981' }}>Price Targets</h3>
                                                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>{aiAnalysis.PRICE_TARGETS}</div>
                                                    </div>
                                                )}
                                                
                                                {aiAnalysis.STOP_LOSS && (
                                                    <div style={styles.metricCard}>
                                                        <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>Stop Loss</h3>
                                                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>{aiAnalysis.STOP_LOSS}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Entry Strategy */}
                                            {aiAnalysis.ENTRY_STRATEGY && (
                                                <div style={styles.metricCard}>
                                                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#1e40af' }}>
                                                        <Zap style={{ width: '1rem', height: '1rem', color: '#f59e0b', marginRight: '0.5rem' }} />
                                                        Entry Strategy
                                                    </h3>
                                                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>{aiAnalysis.ENTRY_STRATEGY}</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem 0' }}>
                                            <Brain style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5, color: '#3b82f6' }} />
                                            <p>AI analysis will appear here once data is loaded</p>
                                        </div>
                                    )}
                                </div>

                                {/* Economic Events Panel */}
                                <div style={styles.card}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <BarChart3 style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b', marginRight: '0.75rem' }} />
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Economic Events</h2>
                                    </div>
                                    
                                    {economicData ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {parseEconomicEvents(economicData.economic_events).map((event, idx) => (
                                                <div key={idx} style={styles.economicEvent}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6', marginBottom: '0.5rem' }}>
                                                        {event.date}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem', color: '#1e293b' }}>
                                                        {event.event?.replace(/🔴|🟠|🟢/g, '').trim()}
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                        <div>
                                                            <span style={{ color: '#64748b' }}>Actual:</span>
                                                            <div style={{ fontWeight: '500', color: '#1e40af' }}>{event.actual || 'N/A'}</div>
                                                        </div>
                                                        <div>
                                                            <span style={{ color: '#64748b' }}>Forecast:</span>
                                                            <div style={{ fontWeight: '500', color: '#1e40af' }}>{event.forecast || 'N/A'}</div>
                                                        </div>
                                                        <div>
                                                            <span style={{ color: '#64748b' }}>Previous:</span>
                                                            <div style={{ fontWeight: '500', color: '#1e40af' }}>{event.previous || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#64748b', padding: '4rem 0' }}>
                                            <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5, color: '#3b82f6' }} />
                                            <p>Economic events will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* News Section */}
                        {!loading && hasAnalyzed && newsData.length > 0 && (
                            <div style={{ ...styles.card, marginTop: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', marginRight: '0.75rem' }} />
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>Market News</h2>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {newsData.slice(0, 6).map((news, idx) => (
                                        <div key={idx} style={styles.newsCard} className="news-card">
                                            <div style={{ fontSize: '0.875rem', color: '#3b82f6', marginBottom: '0.5rem', fontWeight: '600' }}>
                                                {news.source}
                                            </div>
                                            <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', lineHeight: '1.4' }}>
                                                {news.title}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                                                {news.description}
                                            </p>
                                            {news.highlights && (
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#1e40af',
                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                    borderRadius: '0.5rem',
                                                    padding: '0.5rem 0.75rem',
                                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                                }}>
                                                    {(() => {
                                                        if (typeof news.highlights === 'string') {
                                                            return news.highlights;
                                                        } else if (typeof news.highlights === 'object' && news.highlights.highlight) {
                                                            return news.highlights.highlight;
                                                        } else {
                                                            return 'Market highlight available';
                                                        }
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}