import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Brain, DollarSign, Calendar, Target, Activity, BarChart3, Zap } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function TradingEconDashboard() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("EURUSD");
    const [economicData, setEconomicData] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [bias, setBias] = useState("NEUTRAL");
    const [confidence, setConfidence] = useState(0);
    const [loading, setLoading] = useState(false);

    const popularAssets = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "NZDUSD", "USDCAD", "EURJPY"];

    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    const fetchNewsAndEconomicData = async (asset) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/fetch_news_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    assets: [asset],
                    user_email: 'trader@example.com'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                setNewsData(data.message || []);
                setEconomicData(data.economic_events?.[0] || null);
                
                // Generate AI analysis
                await generateAIAnalysis(data, asset);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const generateAIAnalysis = async (data, asset) => {
        if (!OPENAI_API_KEY) return;
        
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

            const response = await fetch(`${baseUrl}/chat_gpt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (response.ok) {
                const result = await response.json();
                try {
                    const analysis = JSON.parse(result.response);
                    setAiAnalysis(analysis);
                    setBias(analysis.BIAS || "NEUTRAL");
                    setConfidence(analysis.CONFIDENCE || 0);
                } catch {
                    // Fallback if JSON parsing fails
                    setAiAnalysis({ raw: result.response });
                }
            }
        } catch (error) {
            console.error("Error generating AI analysis:", error);
        }
    };

    useEffect(() => {
        fetchAPIKey();
    }, []);

    useEffect(() => {
        if (OPENAI_API_KEY) {
            fetchNewsAndEconomicData(selectedAsset);
        }
    }, [selectedAsset, OPENAI_API_KEY]);

    const getBiasColor = (bias) => {
        switch (bias) {
            case 'BULLISH': return 'text-green-400';
            case 'BEARISH': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getBiasIcon = (bias) => {
        switch (bias) {
            case 'BULLISH': return <TrendingUp className="w-6 h-6" />;
            case 'BEARISH': return <TrendingDown className="w-6 h-6" />;
            default: return <Activity className="w-6 h-6" />;
        }
    };

    const parseEconomicEvents = (eventText) => {
        if (!eventText || typeof eventText !== 'string') return [];
        
        const events = [];
        const lines = eventText.split('\n');
        let currentEvent = {};
        
        lines.forEach(line => {
            if (line.startsWith('Date:')) {
                if (Object.keys(currentEvent).length > 0) {
                    events.push(currentEvent);
                }
                currentEvent = { date: line.replace('Date:', '').trim() };
            } else if (line.startsWith('Event:')) {
                currentEvent.event = line.replace('Event:', '').trim();
            } else if (line.startsWith('Actual:')) {
                currentEvent.actual = line.replace('Actual:', '').trim();
            } else if (line.startsWith('Forecast:')) {
                currentEvent.forecast = line.replace('Forecast:', '').trim();
            } else if (line.startsWith('Previous:')) {
                currentEvent.previous = line.replace('Previous:', '').trim();
            }
        });
        
        if (Object.keys(currentEvent).length > 0) {
            events.push(currentEvent);
        }
        
        return events.slice(0, 5); // Show top 5 events
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body flex">
                <SideNavs />
                <div className="flex-1 p-6">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Trading Economic Dashboard
                        </h1>
                        
                        {/* Asset Selector */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {popularAssets.map(asset => (
                                <button
                                    key={asset}
                                    onClick={() => setSelectedAsset(asset)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                        selectedAsset === asset 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {asset}
                                </button>
                            ))}
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-lg">Analyzing market data...</span>
                            </div>
                        )}

                        {!loading && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* AI Analysis Panel */}
                                <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <div className="flex items-center mb-4">
                                        <Brain className="w-6 h-6 text-purple-400 mr-2" />
                                        <h2 className="text-2xl font-bold">AI Market Analysis</h2>
                                    </div>
                                    
                                    {aiAnalysis ? (
                                        <div className="space-y-4">
                                            {/* Bias & Confidence */}
                                            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                                                <div className="flex items-center">
                                                    {getBiasIcon(bias)}
                                                    <span className={`ml-2 text-xl font-bold ${getBiasColor(bias)}`}>
                                                        {bias}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-400">Confidence</div>
                                                    <div className="text-2xl font-bold text-blue-400">{confidence}%</div>
                                                </div>
                                            </div>

                                            {/* Key Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {aiAnalysis.RISK_LEVEL && (
                                                    <div className="bg-gray-800 rounded-lg p-4">
                                                        <div className="flex items-center mb-2">
                                                            <AlertTriangle className="w-4 h-4 text-orange-400 mr-2" />
                                                            <span className="text-sm text-gray-400">Risk Level</span>
                                                        </div>
                                                        <div className="text-lg font-bold">{aiAnalysis.RISK_LEVEL}</div>
                                                    </div>
                                                )}
                                                
                                                {aiAnalysis.TIME_HORIZON && (
                                                    <div className="bg-gray-800 rounded-lg p-4">
                                                        <div className="flex items-center mb-2">
                                                            <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                                                            <span className="text-sm text-gray-400">Time Horizon</span>
                                                        </div>
                                                        <div className="text-lg font-bold">{aiAnalysis.TIME_HORIZON}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Key Factors */}
                                            {aiAnalysis.KEY_FACTORS && (
                                                <div className="bg-gray-800 rounded-lg p-4">
                                                    <h3 className="font-bold mb-2 flex items-center">
                                                        <Target className="w-4 h-4 text-green-400 mr-2" />
                                                        Key Factors
                                                    </h3>
                                                    <ul className="space-y-1 text-sm">
                                                        {Array.isArray(aiAnalysis.KEY_FACTORS) 
                                                            ? aiAnalysis.KEY_FACTORS.map((factor, idx) => (
                                                                <li key={idx} className="text-gray-300">• {factor}</li>
                                                            ))
                                                            : <li className="text-gray-300">{aiAnalysis.KEY_FACTORS}</li>
                                                        }
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Trading Levels */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {aiAnalysis.PRICE_TARGETS && (
                                                    <div className="bg-gray-800 rounded-lg p-4">
                                                        <h3 className="font-bold mb-2 text-green-400">Price Targets</h3>
                                                        <div className="text-sm text-gray-300">{aiAnalysis.PRICE_TARGETS}</div>
                                                    </div>
                                                )}
                                                
                                                {aiAnalysis.STOP_LOSS && (
                                                    <div className="bg-gray-800 rounded-lg p-4">
                                                        <h3 className="font-bold mb-2 text-red-400">Stop Loss</h3>
                                                        <div className="text-sm text-gray-300">{aiAnalysis.STOP_LOSS}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Entry Strategy */}
                                            {aiAnalysis.ENTRY_STRATEGY && (
                                                <div className="bg-gray-800 rounded-lg p-4">
                                                    <h3 className="font-bold mb-2 flex items-center">
                                                        <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                                                        Entry Strategy
                                                    </h3>
                                                    <div className="text-sm text-gray-300">{aiAnalysis.ENTRY_STRATEGY}</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-8">
                                            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>AI analysis will appear here once data is loaded</p>
                                        </div>
                                    )}
                                </div>

                                {/* Economic Events Panel */}
                                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <div className="flex items-center mb-4">
                                        <BarChart3 className="w-6 h-6 text-orange-400 mr-2" />
                                        <h2 className="text-xl font-bold">Economic Events</h2>
                                    </div>
                                    
                                    {economicData ? (
                                        <div className="space-y-3">
                                            {parseEconomicEvents(economicData.economic_events).map((event, idx) => (
                                                <div key={idx} className="bg-gray-800 rounded-lg p-3 border-l-4 border-blue-500">
                                                    <div className="text-sm font-semibold text-blue-400 mb-1">
                                                        {event.date}
                                                    </div>
                                                    <div className="text-sm font-medium mb-2">
                                                        {event.event?.replace(/🔴|🟠|🟢/g, '').trim()}
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-gray-400">Actual:</span>
                                                            <div className="font-medium">{event.actual || 'N/A'}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Forecast:</span>
                                                            <div className="font-medium">{event.forecast || 'N/A'}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400">Previous:</span>
                                                            <div className="font-medium">{event.previous || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-8">
                                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Economic events will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* News Section */}
                        {!loading && newsData.length > 0 && (
                            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <div className="flex items-center mb-4">
                                    <DollarSign className="w-6 h-6 text-green-400 mr-2" />
                                    <h2 className="text-xl font-bold">Market News</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {newsData.slice(0, 6).map((news, idx) => (
                                        <div key={idx} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                                            <div className="text-sm text-blue-400 mb-2">{news.source}</div>
                                            <h3 className="font-semibold mb-2 line-clamp-2">{news.title}</h3>
                                            <p className="text-sm text-gray-400 mb-3 line-clamp-3">{news.description}</p>
                                            {news.highlights && (
                                                <div className="text-xs text-yellow-400 bg-yellow-400/10 rounded px-2 py-1">
                                                    {news.highlights}
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