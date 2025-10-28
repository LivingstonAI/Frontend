import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function AssetCorrelation() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");

    useEffect(() => {
        fetchAPIKey();
    }, []);

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
    
    const [assetClasses, setAssetClasses] = useState(['forex', 'bonds', 'commodities', 'indices']);
    const [selectedClass, setSelectedClass] = useState('forex');
    const [assetData, setAssetData] = useState({});
    const [allAssetData, setAllAssetData] = useState({});
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
    const [loadingAI, setLoadingAI] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [latestCouncilDiscussion, setLatestCouncilDiscussion] = useState(null);
    const [assetSentiments, setAssetSentiments] = useState({});
    const [assetVolumes, setAssetVolumes] = useState({});
    const [loadingSentiment, setLoadingSentiment] = useState({});
    const [loadingVolume, setLoadingVolume] = useState({});
    const intervalRef = useRef(null);
    const chatEndRef = useRef(null);

    const styles = {
        controlPanel: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '25px',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        },
        selectGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        select: {
            padding: '10px 15px',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
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
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
        },
        buttonPurple: {
            padding: '10px 20px',
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
        },
        buttonActive: {
            backgroundColor: '#10b981',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
        },
        statusBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 25px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            marginBottom: '25px',
            fontSize: '13px',
            color: '#475569',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        },
        insightsSection: {
            marginBottom: '25px'
        },
        insightCard: {
            padding: '18px 25px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            marginBottom: '12px',
            borderLeft: '4px solid',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        },
        insightAI: {
            borderLeftColor: '#8b5cf6',
            backgroundColor: '#faf5ff'
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
            color: '#1e293b',
            lineHeight: '1.6',
            marginBottom: '5px',
            fontWeight: '500'
        },
        insightStrength: {
            fontSize: '12px',
            color: '#64748b',
            fontWeight: '600',
            textTransform: 'uppercase'
        },
        assetsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
        },
        assetCard: {
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        },
        assetHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '2px solid #f1f5f9'
        },
        assetName: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b'
        },
        assetActions: {
            display: 'flex',
            gap: '6px'
        },
        iconButton: {
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            backgroundColor: '#f1f5f9',
            color: '#475569'
        },
        iconButtonActive: {
            backgroundColor: '#3b82f6',
            color: '#ffffff'
        },
        assetPrice: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#3b82f6',
            marginBottom: '15px'
        },
        sentimentBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '12px',
            textTransform: 'uppercase'
        },
        bullishBadge: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
            border: '1px solid #10b981'
        },
        bearishBadge: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #ef4444'
        },
        neutralBadge: {
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #94a3b8'
        },
        sentimentReasoning: {
            fontSize: '13px',
            color: '#475569',
            lineHeight: '1.5',
            marginBottom: '12px',
            fontStyle: 'italic'
        },
        volumeInfo: {
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #e2e8f0'
        },
        volumeLevel: {
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        volumeDetails: {
            fontSize: '12px',
            color: '#64748b',
            lineHeight: '1.5'
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
            color: '#64748b',
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
            color: '#64748b'
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '16px',
            color: '#64748b'
        },
        spinner: {
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
        },
        chatButton: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 1000
        },
        chatPanel: {
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease',
            zIndex: 1001
        },
        chatPanelHidden: {
            transform: 'translateX(100%)'
        },
        chatHeader: {
            padding: '20px 25px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#8b5cf6',
            color: '#ffffff'
        },
        chatTitle: {
            fontSize: '18px',
            fontWeight: '700',
            margin: 0
        },
        closeButton: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '28px',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1'
        },
        chatMessages: {
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            backgroundColor: '#f8fafc'
        },
        messageUser: {
            alignSelf: 'flex-end',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '18px 18px 4px 18px',
            maxWidth: '75%',
            fontSize: '14px',
            lineHeight: '1.5'
        },
        messageAI: {
            alignSelf: 'flex-start',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            padding: '12px 18px',
            borderRadius: '18px 18px 18px 4px',
            maxWidth: '75%',
            fontSize: '14px',
            lineHeight: '1.5',
            border: '1px solid #e2e8f0'
        },
        chatInputContainer: {
            padding: '20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            backgroundColor: '#ffffff'
        },
        chatInputField: {
            flex: 1,
            padding: '12px 18px',
            border: '2px solid #e2e8f0',
            borderRadius: '24px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
        },
        sendButton: {
            padding: '12px 24px',
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        councilBanner: {
            padding: '15px 20px',
            backgroundColor: '#faf5ff',
            border: '2px solid #c084fc',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px'
        },
        councilTitle: {
            fontWeight: '700',
            color: '#6b21a8',
            marginBottom: '5px'
        },
        councilInfo: {
            color: '#7c3aed',
            lineHeight: '1.5'
        }
    };

    useEffect(() => {
        fetchAssetData();
        fetchAllAssetData();
        fetchLatestCouncilDiscussion();
    }, [selectedClass]);

    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => {
                fetchAssetData();
                fetchAllAssetData();
            }, 10000);
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

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Clear sentiments and volumes when switching asset classes
    useEffect(() => {
        setAssetSentiments({});
        setAssetVolumes({});
    }, [selectedClass]);

    const fetchLatestCouncilDiscussion = async () => {
        try {
            const response = await fetch(
                `${baseUrl}/api/snowai_fetch_latest_council_discussion_summary_for_frontend_v2/`
            );
            const result = await response.json();
            
            if (result.success) {
                setLatestCouncilDiscussion(result.council_data);
            }
        } catch (error) {
            console.error('Error fetching council discussion:', error);
        }
    };

    const fetchAssetData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${baseUrl}/api/snowai-asset-correlation-data/?asset_class=${selectedClass}`
            );
            const result = await response.json();
            
            if (result.success) {
                setAssetData(result.data);
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error('Error fetching asset data:', error);
        }
        setLoading(false);
    };

    const fetchAllAssetData = async () => {
        try {
            const allClasses = ['forex', 'bonds', 'commodities', 'indices'];
            const allData = {};
            
            for (const assetClass of allClasses) {
                const response = await fetch(
                    `${baseUrl}/api/snowai-asset-correlation-data/?asset_class=${assetClass}`
                );
                const result = await response.json();
                
                if (result.success) {
                    allData[assetClass] = result.data;
                }
            }
            
            setAllAssetData(allData);
        } catch (error) {
            console.error('Error fetching all asset data:', error);
        }
    };

    const getAssetSentiment = async (assetName) => {
        setLoadingSentiment(prev => ({ ...prev, [assetName]: true }));
        
        try {
            // Flatten all asset data for the API
            const allMovements = {};
            Object.entries(allAssetData).forEach(([assetClass, data]) => {
                Object.entries(data).forEach(([name, values]) => {
                    allMovements[`${assetClass}:${name}`] = values;
                });
            });

            const response = await fetch(
                `${baseUrl}/api/snowai_intermarket_council_driven_asset_sentiment_analysis_v2/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        asset_name: assetName,
                        asset_class: selectedClass,
                        all_asset_movements: allMovements,
                        openai_api_key: OPENAI_API_KEY
                    })
                }
            );

            const result = await response.json();
            
            if (result.success) {
                setAssetSentiments(prev => ({
                    ...prev,
                    [assetName]: result
                }));
            }
        } catch (error) {
            console.error('Error getting asset sentiment:', error);
        }
        
        setLoadingSentiment(prev => ({ ...prev, [assetName]: false }));
    };

    const getAssetVolume = async (assetName) => {
        setLoadingVolume(prev => ({ ...prev, [assetName]: true }));
        
        try {
            const response = await fetch(
                `${baseUrl}/api/snowai_advanced_volume_proportion_analyzer_for_trading_assets_v2/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        asset_name: assetName,
                        asset_class: selectedClass,
                        period: '1y'
                    })
                }
            );

            const result = await response.json();
            
            if (result.success) {
                setAssetVolumes(prev => ({
                    ...prev,
                    [assetName]: result
                }));
            }
        } catch (error) {
            console.error('Error getting asset volume:', error);
        }
        
        setLoadingVolume(prev => ({ ...prev, [assetName]: false }));
    };

    const getAIInsight = async () => {
        setLoadingAI(true);
        setInsights([]);
        
        try {
            const assetSummary = Object.entries(allAssetData).map(([assetClass, data]) => {
                return `${assetClass.toUpperCase()}: ${Object.entries(data).map(([name, values]) => 
                    `${name} (${values.current_price}, 1d: ${values['1d']?.percent}%)`
                ).join(', ')}`;
            }).join(' | ');

            const councilContext = latestCouncilDiscussion 
                ? `Latest AI Council Discussion: ${latestCouncilDiscussion.summary}. Economic Outlook: ${latestCouncilDiscussion.economic_outlook}. Key Themes: ${latestCouncilDiscussion.major_themes.join(', ')}.`
                : '';

            const prompt = `You are a financial analyst. ${councilContext} Based on this market data: ${assetSummary}. 
Provide a correlation insight for ${selectedClass} trading opportunities. 
Consider relationships between all asset classes (DXY vs forex, bonds vs equities, gold vs currencies, VIX vs risk assets, etc.). 
Keep your response to 2-3 sentences maximum. Be specific and actionable. No markdown formatting.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const aiMessage = data.choices[0].message.content.trim();

            setInsights([{
                type: 'ai',
                message: aiMessage,
                strength: 'AI Analysis'
            }]);
        } catch (error) {
            console.error('Error getting AI insight:', error);
            setInsights([{
                type: 'ai',
                message: 'Unable to generate AI insight at this time. Please try again.',
                strength: 'Error'
            }]);
        }
        
        setLoadingAI(false);
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            const assetSummary = Object.entries(allAssetData).map(([assetClass, data]) => {
                return `${assetClass.toUpperCase()}: ${Object.entries(data).map(([name, values]) => 
                    `${name} (${values.current_price}, Daily: ${values['1d']?.percent}%, Weekly: ${values['1wk']?.percent}%, Monthly: ${values['1mo']?.percent}%)`
                ).join(', ')}`;
            }).join('\n\n');

            const councilContext = latestCouncilDiscussion 
                ? `\n\nLatest AI Trading Council Discussion (${new Date(latestCouncilDiscussion.created_at).toLocaleString()}):\n` +
                  `Economic Outlook: ${latestCouncilDiscussion.economic_outlook}\n` +
                  `Market Sentiment: ${latestCouncilDiscussion.market_sentiment}\n` +
                  `Volatility: ${latestCouncilDiscussion.volatility_level}\n` +
                  `Key Themes: ${latestCouncilDiscussion.major_themes.join(', ')}\n` +
                  `Summary: ${latestCouncilDiscussion.summary}`
                : '';

            const conversationHistory = chatMessages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const systemPrompt = `You are a helpful financial assistant with access to live market data and the latest AI Trading Council discussion. Here's the current data:

${assetSummary}${councilContext}

Provide helpful, conversational responses about this market data. Reference the council discussion when relevant. Keep responses short, sweet, and useful (2-4 sentences max). No markdown formatting - plain text only. Be friendly and natural in conversation.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...conversationHistory,
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 200,
                    temperature: 0.8
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content.trim();

            setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            console.error('Error sending chat message:', error);
            setChatMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please try again.' 
            }]);
        }

        setChatLoading(false);
    };

    const getChangeColor = (value) => {
        if (!value) return styles.neutral;
        return value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;
    };

    const getInsightStyle = (type) => {
        if (type === 'ai') {
            return { ...styles.insightCard, ...styles.insightAI };
        }
        return styles.insightCard;
    };

    const getInsightIcon = (type) => {
        if (type === 'ai') return '🤖';
        return 'ℹ️';
    };

    const getSentimentBadgeStyle = (sentiment) => {
        switch(sentiment) {
            case 'bullish':
                return { ...styles.sentimentBadge, ...styles.bullishBadge };
            case 'bearish':
                return { ...styles.sentimentBadge, ...styles.bearishBadge };
            default:
                return { ...styles.sentimentBadge, ...styles.neutralBadge };
        }
    };

    const getVolumeLevelColor = (level) => {
        switch(level) {
            case 'high':
                return '#10b981';
            case 'low':
                return '#ef4444';
            default:
                return '#64748b';
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .asset-card-hover:hover {
                    transform: translateY(-2px);
                    border-color: #3b82f6;
                    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
                }
                
                .button-hover:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }
                
                .chat-button-hover:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
                }
                
                .select-hover:hover {
                    border-color: #3b82f6;
                }
                
                .select-hover:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .chat-input-focus:focus {
                    border-color: #8b5cf6;
                }

                .icon-button-hover:hover {
                    transform: scale(1.1);
                }

                @media (max-width: 768px) {
                    .chat-panel-mobile {
                        width: 100% !important;
                    }
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '25px' }}>
                        SnowAI Asset Correlation & Intermarket Analysis
                    </h5>
                    
                    {latestCouncilDiscussion && (
                        <div style={styles.councilBanner}>
                            <div style={styles.councilTitle}>
                                🎯 Latest AI Trading Council Discussion
                            </div>
                            <div style={styles.councilInfo}>
                                <strong>Outlook:</strong> {latestCouncilDiscussion.economic_outlook} • 
                                <strong> Sentiment:</strong> {latestCouncilDiscussion.market_sentiment} • 
                                <strong> Updated:</strong> {new Date(latestCouncilDiscussion.created_at).toLocaleString()}
                            </div>
                        </div>
                    )}
                    
                    <div style={styles.controlPanel}>
                        <div style={styles.selectGroup}>
                            <label style={styles.label}>Asset Class</label>
                            <select 
                                style={styles.select}
                                className="select-hover"
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setInsights([]);
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
                                style={styles.buttonPurple}
                                className="button-hover"
                                onClick={getAIInsight}
                                disabled={loadingAI}
                            >
                                {loadingAI ? '⏳ Analyzing...' : '🤖 Get AI Insight'}
                            </button>
                        </div>
                    </div>
                    
                    <div style={styles.statusBar}>
                        <span>
                            <strong style={{ color: '#1e293b' }}>Status:</strong> {loading ? 'Updating...' : 'Live'}
                        </span>
                        <span>
                            <strong style={{ color: '#1e293b' }}>Last Updated:</strong> {lastUpdated || 'Never'}
                        </span>
                        <span>
                            <strong style={{ color: '#1e293b' }}>Assets:</strong> {Object.keys(assetData).length}
                        </span>
                    </div>
                    
                    {insights.length > 0 && (
                        <div style={styles.insightsSection}>
                            <h6 style={{...styles.label, fontSize: '16px', marginBottom: '15px', color: '#1e293b'}}>
                                🎯 AI-Powered Market Insights
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
                                            {insight.strength}
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
                        <div style={styles.assetsGrid}>
                            {Object.keys(assetData).length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p style={{fontSize: '18px', marginBottom: '10px', fontWeight: '600', color: '#1e293b'}}>No data available</p>
                                    <p>Click "Refresh Now" to load asset data</p>
                                </div>
                            ) : (
                                Object.entries(assetData).map(([assetName, data]) => (
                                    <div key={assetName} style={styles.assetCard} className="asset-card-hover">
                                        <div style={styles.assetHeader}>
                                            <div style={styles.assetName}>{assetName}</div>
                                            <div style={styles.assetActions}>
                                                <button
                                                    style={{
                                                        ...styles.iconButton,
                                                        ...(assetSentiments[assetName] ? styles.iconButtonActive : {})
                                                    }}
                                                    className="icon-button-hover"
                                                    onClick={() => getAssetSentiment(assetName)}
                                                    disabled={loadingSentiment[assetName]}
                                                    title="Get AI Sentiment"
                                                >
                                                    {loadingSentiment[assetName] ? '⏳' : '🧠'}
                                                </button>
                                                <button
                                                    style={{
                                                        ...styles.iconButton,
                                                        ...(assetVolumes[assetName] ? styles.iconButtonActive : {})
                                                    }}
                                                    className="icon-button-hover"
                                                    onClick={() => getAssetVolume(assetName)}
                                                    disabled={loadingVolume[assetName]}
                                                    title="Check Volume"
                                                >
                                                    {loadingVolume[assetName] ? '⏳' : '📊'}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div style={styles.assetPrice}>
                                            ${data.current_price?.toFixed(4) || 'N/A'}
                                        </div>
                                        
                                        {assetSentiments[assetName] && (
                                            <>
                                                <div style={getSentimentBadgeStyle(assetSentiments[assetName].sentiment)}>
                                                    {assetSentiments[assetName].sentiment === 'bullish' && '📈'}
                                                    {assetSentiments[assetName].sentiment === 'bearish' && '📉'}
                                                    {assetSentiments[assetName].sentiment === 'neutral' && '➡️'}
                                                    {' '}{assetSentiments[assetName].sentiment}
                                                    {' '}({assetSentiments[assetName].confidence}%)
                                                </div>
                                                <div style={styles.sentimentReasoning}>
                                                    "{assetSentiments[assetName].reasoning}"
                                                </div>
                                            </>
                                        )}
                                        
                                        {assetVolumes[assetName] && (
                                            <div style={styles.volumeInfo}>
                                                <div style={styles.volumeLevel}>
                                                    <span style={{ color: getVolumeLevelColor(assetVolumes[assetName].volume_level) }}>
                                                        ●
                                                    </span>
                                                    Volume: {assetVolumes[assetName].volume_level.toUpperCase()}
                                                </div>
                                                <div style={styles.volumeDetails}>
                                                    {assetVolumes[assetName].description}<br/>
                                                    Current: {assetVolumes[assetName].current_volume.toLocaleString()}<br/>
                                                    vs Avg: {assetVolumes[assetName].vs_average_percent > 0 ? '+' : ''}{assetVolumes[assetName].vs_average_percent}%
                                                    {assetVolumes[assetName].trend !== 'insufficient_data' && (
                                                        <> • Trend: {assetVolumes[assetName].trend}</>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
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
                    )}
                </div>
            </div>

            {/* Chat Button */}
            <button 
                style={styles.chatButton}
                className="chat-button-hover"
                onClick={() => setShowChatPanel(true)}
            >
                💬
            </button>

            {/* Chat Side Panel */}
            <div 
                style={{
                    ...styles.chatPanel,
                    ...(showChatPanel ? {} : styles.chatPanelHidden)
                }}
                className="chat-panel-mobile"
            >
                <div style={styles.chatHeader}>
                    <h3 style={styles.chatTitle}>💬 AI Market Assistant</h3>
                    <button 
                        style={styles.closeButton}
                        onClick={() => setShowChatPanel(false)}
                    >
                        ×
                    </button>
                </div>
                
                <div style={styles.chatMessages}>
                    {chatMessages.length === 0 && (
                        <div style={{...styles.messageAI, maxWidth: '100%'}}>
                            Hi! I'm your AI market assistant with access to all current asset data and the latest AI Trading Council discussion. Ask me anything about market trends, correlations, or trading opportunities!
                        </div>
                    )}
                    {chatMessages.map((msg, index) => (
                        <div 
                            key={index} 
                            style={msg.role === 'user' ? styles.messageUser : styles.messageAI}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {chatLoading && (
                        <div style={styles.messageAI}>
                            Thinking...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                <div style={styles.chatInputContainer}>
                    <input
                        type="text"
                        style={styles.chatInputField}
                        className="chat-input-focus"
                        placeholder="Ask about market trends, correlations..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !chatLoading) {
                                sendChatMessage();
                            }
                        }}
                        disabled={chatLoading}
                    />
                    <button 
                        style={styles.sendButton}
                        onClick={sendChatMessage}
                        disabled={chatLoading || !chatInput.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}