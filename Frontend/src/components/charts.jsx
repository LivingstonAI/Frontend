import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// Component styles
const styles = {
  header: {
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    color: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
  },
  controlsContainer: {
    background: 'rgba(248, 250, 252, 0.9)',
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  assetSection: {
    marginBottom: '20px'
  },
  categoryLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  assetButton: {
    margin: '4px 6px',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  assetButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.4)'
  },
  assetButtonInactive: {
    background: 'white',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  chartTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    flexWrap: 'wrap'
  },
  timeframeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
    flexWrap: 'wrap'
  },
  chartTypeButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textTransform: 'capitalize'
  },
  chartTypeButtonActive: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
  },
  chartTypeButtonInactive: {
    background: '#f1f5f9',
    color: '#475569',
    border: '2px solid #cbd5e1'
  },
  timeframeButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  timeframeButtonActive: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)'
  },
  timeframeButtonInactive: {
    background: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(79, 70, 229, 0.05)',
    borderRadius: '15px',
    marginBottom: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '15px'
  },
  chartContainer: {
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    marginBottom: '25px',
    width: '100%'
  },
  chartTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '15px',
    textAlign: 'center'
  },
  realTimeIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px'
  },
  liveIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    marginRight: '8px',
    animation: 'pulse 2s infinite'
  },
  priceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(79, 70, 229, 0.05)',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  currentPrice: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  priceChange: {
    fontSize: '1rem',
    fontWeight: '600'
  },
  priceChangePositive: {
    color: '#10b981'
  },
  priceChangeNegative: {
    color: '#ef4444'
  },
  dataStats: {
    background: 'rgba(16, 185, 129, 0.05)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontSize: '0.9rem',
    color: '#059669'
  },
  errorMessage: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.95rem'
  },
  drawingToolbar: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    background: 'rgba(248, 250, 252, 0.95)',
    borderRadius: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  toolButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    background: 'white',
    color: '#475569',
    border: '2px solid #e2e8f0'
  },
  toolButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent'
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    minWidth: '400px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
  },
  input: {
    padding: '10px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '15px'
  },
  select: {
    padding: '10px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '15px',
    cursor: 'pointer'
  },
  indicatorList: {
    background: 'rgba(248, 250, 252, 0.95)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px'
  },
  indicatorItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #e2e8f0'
  },
  deleteButton: {
    padding: '6px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  livingstonToggle: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    transition: 'all 0.3s ease',
    animation: 'floatOrb 3s ease-in-out infinite'
  },
  livingstonOrb: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6, #1e40af)',
    boxShadow: '0 0 20px rgba(96, 165, 250, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)',
    animation: 'pulse 2s infinite'
  },
  livingstonPanel: {
    position: 'fixed',
    bottom: '120px',
    right: '30px',
    width: '450px',
    maxWidth: 'calc(100vw - 40px)',
    maxHeight: '600px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '2px solid #3b82f6'
  },
  livingstonHeader: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  },
  livingstonHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  livingstonHeaderOrb: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6)',
    boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)',
    animation: 'pulse 2s infinite'
  },
  livingstonMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    background: '#f8fafc',
    maxHeight: '400px'
  },
  livingstonMessage: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  livingstonMessageUser: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '18px 18px 4px 18px',
    maxWidth: '80%',
    wordWrap: 'break-word'
  },
  livingstonMessageAI: {
    alignSelf: 'flex-start',
    background: 'white',
    color: '#1e293b',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    maxWidth: '80%',
    border: '1px solid #e2e8f0',
    wordWrap: 'break-word'
  },
  livingstonInputArea: {
    padding: '15px',
    borderTop: '1px solid #e2e8f0',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexShrink: 0
  },
  livingstonInputRow: {
    display: 'flex',
    gap: '10px'
  },
  livingstonInput: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.3s ease'
  },
  livingstonSendButton: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  livingstonImagePreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #3b82f6'
  },
  livingstonImageButton: {
    padding: '10px 16px',
    background: '#f1f5f9',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#475569',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  }
};

export default function Charts() {
    const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app/api/snowai-market-ohlc/';
    
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const savedVisibleRangeRef = useRef(null);
    const isInitialLoadRef = useRef(true);
    
    const [selectedAsset, setSelectedAsset] = useState('BTCUSD');
    const [chartType, setChartType] = useState('candlestick');
    const [timeframe, setTimeframe] = useState('1H');
    const [isLoading, setIsLoading] = useState(false);
    const [tvLoaded, setTvLoaded] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);
    const [marketData, setMarketData] = useState([]);
    const [dataSource, setDataSource] = useState('');
    const [error, setError] = useState('');
    const [dataStats, setDataStats] = useState(null);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Livingston AI Assistant States
    const [livingstonOpen, setLivingstonOpen] = useState(false);
    const [livingstonMessages, setLivingstonMessages] = useState([]);
    const [livingstonInput, setLivingstonInput] = useState('');
    const [livingstonLoading, setLivingstonLoading] = useState(false);
    const [councilDiscussion, setCouncilDiscussion] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Period separator states
    const [showPeriodSeparators, setShowPeriodSeparators] = useState(false);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [separatorsLoading, setSeparatorsLoading] = useState(false);
    
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
    
    // Drawing and indicator states
    const [movingAverages, setMovingAverages] = useState([]);
    const [showVolume, setShowVolume] = useState(false);
    
    // Modal states
    const [showMADialog, setShowMADialog] = useState(false);
    const [maConfig, setMaConfig] = useState({ type: 'SMA', period: 20, color: '#2196F3' });

    const timeframes = {
        '1M': { 
            label: '1 Minute', 
            interval: '1m', 
            binanceInterval: '1m',
            yfinancePeriod: '1d',
            description: '1 day',
            updateInterval: 10000
        },
        '5M': { 
            label: '5 Minutes', 
            interval: '5m', 
            binanceInterval: '5m',
            yfinancePeriod: '5d',
            description: '5 days',
            updateInterval: 10000
        },
        '15M': { 
            label: '15 Minutes', 
            interval: '15m', 
            binanceInterval: '15m',
            yfinancePeriod: '1mo',
            description: '1 month',
            updateInterval: 10000
        },
        '1H': { 
            label: '1 Hour', 
            interval: '1h', 
            binanceInterval: '1h',
            yfinancePeriod: '3mo',
            description: '3 months',
            updateInterval: 10000
        },
        '4H': { 
            label: '4 Hours', 
            interval: '4h', 
            binanceInterval: '4h',
            yfinancePeriod: '6mo',
            description: '6 months',
            updateInterval: 10000
        },
        '1D': { 
            label: '1 Day', 
            interval: '1d', 
            binanceInterval: '1d',
            yfinancePeriod: '2y',
            description: '2 years',
            updateInterval: 10000
        },
        '1W': { 
            label: '1 Week', 
            interval: '1w', 
            binanceInterval: '1w',
            yfinancePeriod: '10y',
            description: '10 years',
            updateInterval: 10000
        }
    };

    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', binanceSymbol: 'BTCUSDT', yfinanceSymbol: 'BTC-USD' },
            { symbol: 'ETHUSD', name: 'Ethereum', binanceSymbol: 'ETHUSDT', yfinanceSymbol: 'ETH-USD' },
            { symbol: 'ADAUSD', name: 'Cardano', binanceSymbol: 'ADAUSDT', yfinanceSymbol: 'ADA-USD' },
            { symbol: 'SOLUSD', name: 'Solana', binanceSymbol: 'SOLUSDT', yfinanceSymbol: 'SOL-USD' }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', binanceSymbol: null, yfinanceSymbol: 'EURUSD=X' },
            { symbol: 'GBPUSD', name: 'GBP/USD', binanceSymbol: null, yfinanceSymbol: 'GBPUSD=X' },
            { symbol: 'USDJPY', name: 'USD/JPY', binanceSymbol: null, yfinanceSymbol: 'JPY=X' },
            { symbol: 'AUDUSD', name: 'AUD/USD', binanceSymbol: null, yfinanceSymbol: 'AUDUSD=X' }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', binanceSymbol: null, yfinanceSymbol: 'AAPL' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', binanceSymbol: null, yfinanceSymbol: 'GOOGL' },
            { symbol: 'TSLA', name: 'Tesla Inc.', binanceSymbol: null, yfinanceSymbol: 'TSLA' },
            { symbol: 'MSFT', name: 'Microsoft', binanceSymbol: null, yfinanceSymbol: 'MSFT' }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', binanceSymbol: null, yfinanceSymbol: 'GC=F' },
            { symbol: 'XAGUSD', name: 'Silver', binanceSymbol: null, yfinanceSymbol: 'SI=F' },
            { symbol: 'USOIL', name: 'US Oil (WTI)', binanceSymbol: null, yfinanceSymbol: 'CL=F' },
            { symbol: 'UKOIL', name: 'UK Oil (Brent)', binanceSymbol: null, yfinanceSymbol: 'BZ=F' }
        ]
    };

    useEffect(() => {
        fetchAPIKey();
    }, []);

    const [transcriptInsights, setTranscriptInsights] = useState([]);
    
    useEffect(() => {
        const fetchCouncilDiscussion = async () => {
            if (!livingstonOpen) return;
            
            try {
                const response = await fetch(`${baseUrl}/api/livingston-ai-fetch-latest-council-discussion/`);
                const data = await response.json();
                
                if (data.success) {
                    if (data.has_discussion) {
                        setCouncilDiscussion(data.discussion);
                    }
                    
                    if (data.has_transcript_insights) {
                        setTranscriptInsights(data.transcript_insights);
                    }
                    
                    if (livingstonMessages.length === 0) {
                        let welcomeMsg = `Hello! I'm Livingston, your AI trading assistant.`;
                        
                        if (data.has_discussion) {
                            welcomeMsg += ` I have access to the latest AI Trading Council discussion from ${new Date(data.discussion.created_at).toLocaleDateString()}. The council discussed ${data.discussion.participating_assets.join(', ')} with a ${data.discussion.overall_economic_outlook} economic outlook.`;
                        }
                        
                        if (data.has_transcript_insights) {
                            welcomeMsg += ` I also have insights from ${data.transcript_insights_count} recent economic transcript analyses covering key themes and market predictions.`;
                        }
                        
                        welcomeMsg += ` How can I help you analyze the markets today?`;
                        
                        setLivingstonMessages([{
                            role: 'assistant',
                            content: welcomeMsg
                        }]);
                    }
                }
            } catch (error) {
                console.error('Error fetching council discussion:', error);
            }
        };
        
        fetchCouncilDiscussion();
    }, [livingstonOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [livingstonMessages]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendLivingstonMessage = async () => {
        if ((!livingstonInput.trim() && !selectedImage) || livingstonLoading) return;
        
        const userMessage = {
            role: 'user',
            content: livingstonInput,
            image: selectedImage
        };
        
        setLivingstonMessages(prev => [...prev, userMessage]);
        setLivingstonInput('');
        setLivingstonLoading(true);
        
        try {
            const messages = [
                {
                    role: 'system',
                    content: `You are Livingston, an expert AI trading assistant. You have access to the latest AI Trading Council discussion with the following context:
                    
${councilDiscussion ? `
Discussion Date: ${new Date(councilDiscussion.created_at).toLocaleString()}
Participating Assets: ${councilDiscussion.participating_assets.join(', ')}
Economic Outlook: ${councilDiscussion.overall_economic_outlook}
Market Sentiment: ${councilDiscussion.global_market_sentiment}
Volatility Level: ${councilDiscussion.market_volatility_level}
Major Themes: ${councilDiscussion.major_economic_themes.join(', ')}
Risk Factors: ${councilDiscussion.risk_factors_identified.join(', ')}
Opportunities: ${councilDiscussion.opportunity_areas.join(', ')}
Dominant Sentiment: ${councilDiscussion.dominant_sentiment}
Bullish Count: ${councilDiscussion.bullish_sentiment_count}
Bearish Count: ${councilDiscussion.bearish_sentiment_count}
Neutral Count: ${councilDiscussion.neutral_sentiment_count}
Confidence Score: ${councilDiscussion.average_confidence_score}

Summary: ${councilDiscussion.conversation_summary}
` : 'No recent council discussion available.'}

Use this context to provide informed trading insights. Be concise, helpful, and professional.`
                }
            ];
            
            livingstonMessages.forEach(msg => {
                if (msg.image) {
                    messages.push({
                        role: msg.role,
                        content: [
                            { type: 'text', text: msg.content },
                            { type: 'image_url', image_url: { url: msg.image } }
                        ]
                    });
                } else {
                    messages.push({
                        role: msg.role,
                        content: msg.content
                    });
                }
            });
            
            if (selectedImage) {
                messages.push({
                    role: 'user',
                    content: [
                        { type: 'text', text: livingstonInput || 'Analyze this image' },
                        { type: 'image_url', image_url: { url: selectedImage } }
                    ]
                });
            } else {
                messages.push({
                    role: 'user',
                    content: livingstonInput
                });
            }
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiResponse = {
                    role: 'assistant',
                    content: data.choices[0].message.content
                };
                setLivingstonMessages(prev => [...prev, aiResponse]);
            } else {
                throw new Error('Invalid response from OpenAI');
            }
            
        } catch (error) {
            console.error('Error sending message to Livingston:', error);
            setLivingstonMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error processing your request. Please try again.'
            }]);
        } finally {
            setLivingstonLoading(false);
            setSelectedImage(null);
        }
    };

    // Fetch weekly and monthly separator data
    const fetchPeriodSeparators = async () => {
        setSeparatorsLoading(true);
        const assetInfo = getCurrentAssetInfo();
        
        try {
            // Fetch weekly data
            const weeklyResponse = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: assetInfo.yfinanceSymbol,
                    interval: '1wk',
                    period: timeframes[timeframe].yfinancePeriod
                })
            });
            
            if (weeklyResponse.ok) {
                const weeklyResult = await weeklyResponse.json();
                if (weeklyResult.success && weeklyResult.data) {
                    setWeeklyData(weeklyResult.data);
                }
            }
            
            // Fetch monthly data
            const monthlyResponse = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: assetInfo.yfinanceSymbol,
                    interval: '1mo',
                    period: timeframes[timeframe].yfinancePeriod
                })
            });
            
            if (monthlyResponse.ok) {
                const monthlyResult = await monthlyResponse.json();
                if (monthlyResult.success && monthlyResult.data) {
                    setMonthlyData(monthlyResult.data);
                }
            }
            
        } catch (error) {
            console.error('Error fetching period separators:', error);
        } finally {
            setSeparatorsLoading(false);
        }
    };

    // Toggle period separators
    const togglePeriodSeparators = async () => {
        if (!showPeriodSeparators) {
            await fetchPeriodSeparators();
        }
        setShowPeriodSeparators(!showPeriodSeparators);
    };

    useEffect(() => {
        const loadTradingViewCharts = async () => {
            if (window.LightweightCharts) {
                setTvLoaded(true);
                return;
            }

            try {
                const cdnSources = [
                    'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js',
                    'https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js'
                ];

                let loaded = false;
                
                for (const src of cdnSources) {
                    if (loaded) break;
                    
                    try {
                        await new Promise((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = src;
                            script.crossOrigin = 'anonymous';
                            script.onload = () => {
                                console.log(`TradingView Lightweight Charts loaded from: ${src}`);
                                setTimeout(() => {
                                    if (window.LightweightCharts && window.LightweightCharts.createChart) {
                                        loaded = true;
                                        setTvLoaded(true);
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                }, 500);
                            };
                            script.onerror = reject;
                            document.head.appendChild(script);
                        });
                    } catch (e) {
                        continue;
                    }
                }

                if (!loaded) {
                    console.error('All CDN sources failed');
                    setTvLoaded(false);
                }
                
            } catch (error) {
                console.error('Error loading TradingView Lightweight Charts:', error);
                setTvLoaded(false);
            }
        };

        loadTradingViewCharts();
    }, []);

    const getCurrentAssetInfo = () => {
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        return { symbol: selectedAsset, name: selectedAsset, binanceSymbol: null, yfinanceSymbol: selectedAsset };
    };

    const fetchRealMarketData = async (assetInfo, timeframeKey) => {
        setError('');
        const timeframeConfig = timeframes[timeframeKey];
        
        try {
            if (assetInfo.binanceSymbol) {
                try {
                    const data = await fetchBinanceData(assetInfo.binanceSymbol, timeframeConfig);
                    return data;
                } catch (binanceError) {
                    console.log(`Binance failed for ${assetInfo.symbol}, trying yfinance:`, binanceError.message);
                    if (assetInfo.yfinanceSymbol) {
                        return await fetchYFinanceData(assetInfo.yfinanceSymbol, timeframeConfig);
                    }
                }
            }
            
            if (assetInfo.yfinanceSymbol) {
                return await fetchYFinanceData(assetInfo.yfinanceSymbol, timeframeConfig);
            }
            
            throw new Error('No data source available for this asset');
            
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw error;
        }
    };

    const fetchBinanceData = async (symbol, timeframeConfig) => {
        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframeConfig.binanceInterval}&limit=1000`
        );
        
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }
        
        const data = await response.json();
        setDataSource(`Binance API - ${data.length} candles over ${timeframeConfig.description}`);
        
        return data.map((kline) => {
            const [timestamp, open, high, low, close, volume] = kline;
            return {
                time: Math.floor(timestamp / 1000),
                open: parseFloat(open),
                high: parseFloat(high),
                low: parseFloat(low),
                close: parseFloat(close),
                value: parseFloat(close),
                volume: parseFloat(volume)
            };
        }).sort((a, b) => a.time - b.time);
    };

    const fetchYFinanceData = async (symbol, timeframeConfig) => {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                interval: timeframeConfig.interval,
                period: timeframeConfig.yfinancePeriod
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Backend API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data || result.data.length === 0) {
            throw new Error(result.error || 'No data returned from API');
        }
        
        setDataSource(`YFinance API - ${result.data_points} candles over ${timeframeConfig.description}`);
        
        return result.data.map(candle => ({
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            value: candle.close,
            volume: candle.volume || 0
        })).sort((a, b) => a.time - b.time);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!tvLoaded) return;
            
            setIsLoading(true);
            const assetInfo = getCurrentAssetInfo();
            
            try {
                const data = await fetchRealMarketData(assetInfo, timeframe);
                setMarketData(data);
                setLastUpdateTime(new Date());
                
                if (data.length > 0) {
                    const latestCandle = data[data.length - 1];
                    const firstCandle = data[0];
                    setCurrentPrice(latestCandle.close);
                    
                    const changePercent = ((latestCandle.close - firstCandle.close) / firstCandle.close) * 100;
                    setPriceChange(changePercent);
                    
                    setDataStats({
                        candles: data.length,
                        period: timeframes[timeframe].description,
                        firstDate: new Date(firstCandle.time * 1000).toLocaleDateString(),
                        lastDate: new Date(latestCandle.time * 1000).toLocaleDateString(),
                        highestPrice: Math.max(...data.map(d => d.high)),
                        lowestPrice: Math.min(...data.map(d => d.low))
                    });
                }
                
            } catch (error) {
                console.error('Error fetching market data:', error);
                setError(`Failed to fetch data for ${assetInfo.name}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
        isInitialLoadRef.current = true;
    }, [selectedAsset, timeframe, tvLoaded]);

    useEffect(() => {
        if (marketData.length === 0 || !tvLoaded) return;
        
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
        }
        
        const assetInfo = getCurrentAssetInfo();
        const timeframeConfig = timeframes[timeframe];
        
        updateIntervalRef.current = setInterval(async () => {
            console.log(`Auto-updating ${assetInfo.name} data...`);
            
            try {
                const newData = await fetchRealMarketData(assetInfo, timeframe);
                
                if (newData.length > 0) {
                    setMarketData(newData);
                    setLastUpdateTime(new Date());
                    
                    const latestCandle = newData[newData.length - 1];
                    const firstCandle = newData[0];
                    setCurrentPrice(latestCandle.close);
                    
                    const changePercent = ((latestCandle.close - firstCandle.close) / firstCandle.close) * 100;
                    setPriceChange(changePercent);
                    
                    setDataStats({
                        candles: newData.length,
                        period: timeframeConfig.description,
                        firstDate: new Date(firstCandle.time * 1000).toLocaleDateString(),
                        lastDate: new Date(latestCandle.time * 1000).toLocaleDateString(),
                        highestPrice: Math.max(...newData.map(d => d.high)),
                        lowestPrice: Math.min(...newData.map(d => d.low))
                    });
                    
                    console.log(`Updated ${assetInfo.name} - Latest price: ${latestCandle.close}`);
                }
            } catch (error) {
                console.error('Error during auto-update:', error);
            }
        }, timeframeConfig.updateInterval);
        
        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [selectedAsset, timeframe, marketData.length, tvLoaded]);

    const calculateEMA = (data, period) => {
        const k = 2 / (period + 1);
        let ema = data[0].close;
        const result = [];
        
        data.forEach((candle, i) => {
            if (i === 0) {
                ema = candle.close;
            } else {
                ema = candle.close * k + ema * (1 - k);
            }
            result.push({ time: candle.time, value: ema });
        });
        
        return result;
    };

    const calculateSMA = (data, period) => {
        const result = [];
        
        for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
            result.push({ time: data[i].time, value: sum / period });
        }
        
        return result;
    };

    const calculateWMA = (data, period) => {
        const result = [];
        const weights = Array.from({ length: period }, (_, i) => i + 1);
        const weightSum = weights.reduce((a, b) => a + b, 0);
        
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const wma = slice.reduce((sum, candle, idx) => sum + candle.close * weights[idx], 0) / weightSum;
            result.push({ time: data[i].time, value: wma });
        }
        
        return result;
    };

    const addMovingAverage = () => {
        const id = Date.now();
        let maData;
        
        if (maConfig.type === 'SMA') {
            maData = calculateSMA(marketData, parseInt(maConfig.period));
        } else if (maConfig.type === 'EMA') {
            maData = calculateEMA(marketData, parseInt(maConfig.period));
        } else if (maConfig.type === 'WMA') {
            maData = calculateWMA(marketData, parseInt(maConfig.period));
        }
        
        setMovingAverages([...movingAverages, {
            id,
            type: maConfig.type,
            period: parseInt(maConfig.period),
            color: maConfig.color,
            data: maData
        }]);
        
        setShowMADialog(false);
        setMaConfig({ type: 'SMA', period: 20, color: '#2196F3' });
    };

    const removeMovingAverage = (id) => {
        setMovingAverages(movingAverages.filter(ma => ma.id !== id));
    };

    const clearAllDrawings = () => {
        setMovingAverages([]);
        setShowPeriodSeparators(false);
        setWeeklyData([]);
        setMonthlyData([]);
    };

    const initTradingViewChart = () => {
        if (!tvLoaded || !window.LightweightCharts || !chartContainerRef.current || marketData.length === 0) return;

        try {
            if (chartRef.current && chartRef.current.chart) {
                try {
                    savedVisibleRangeRef.current = chartRef.current.chart.timeScale().getVisibleLogicalRange();
                } catch (e) {
                    console.debug('Could not save visible range:', e.message);
                }
            }

            if (chartRef.current) {
                chartRef.current.destroy();
            }
            chartContainerRef.current.innerHTML = '';

            const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 700,
                layout: {
                    background: { type: 'solid', color: 'white' },
                    textColor: '#333',
                },
                grid: {
                    vertLines: { color: '#f0f3fa' },
                    horzLines: { color: '#f0f3fa' },
                },
                crosshair: {
                    mode: window.LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: '#cccccc',
                    scaleMargins: {
                        top: 0.05,
                        bottom: showVolume ? 0.25 : 0.05,
                    },
                    autoScale: true,
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: false,
                    rightOffset: 5,
                    barSpacing: 10,
                    minBarSpacing: 3,
                },
                handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                },
                handleScale: {
                    axisPressedMouseMove: true,
                    mouseWheel: true,
                    pinch: true,
                },
            });

            let mainSeries;
            
            if (chartType === 'candlestick') {
                mainSeries = chart.addCandlestickSeries({
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    borderVisible: false,
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350',
                });
                
                const candlestickData = marketData.map(d => ({
                    time: d.time,
                    open: parseFloat(d.open.toFixed(8)),
                    high: parseFloat(d.high.toFixed(8)),
                    low: parseFloat(d.low.toFixed(8)),
                    close: parseFloat(d.close.toFixed(8))
                }));

                mainSeries.setData(candlestickData);
            } else {
                mainSeries = chart.addLineSeries({
                    color: '#667eea',
                    lineWidth: 3,
                    crosshairMarkerVisible: true,
                    crosshairMarkerRadius: 6,
                });

                const lineData = marketData.map(d => ({
                    time: d.time,
                    value: parseFloat(d.value.toFixed(8))
                }));

                mainSeries.setData(lineData);
            }

            const maSeries = {};
            movingAverages.forEach((ma, index) => {
                maSeries[ma.id] = chart.addLineSeries({
                    color: ma.color,
                    lineWidth: 2,
                    title: `${ma.type} ${ma.period}`,
                    lastValueVisible: true,
                    priceLineVisible: false
                });
                maSeries[ma.id].setData(ma.data);
            });
            
            // Add period separator lines
            const periodMarkers = [];
            
            if (showPeriodSeparators && weeklyData.length > 0) {
                weeklyData.forEach(week => {
                    periodMarkers.push({
                        time: week.time,
                        position: 'inBar',
                        color: '#3b82f680',
                        shape: 'arrowDown',
                        text: 'W'
                    });
                });
            }
            
            if (showPeriodSeparators && monthlyData.length > 0) {
                monthlyData.forEach(month => {
                    periodMarkers.push({
                        time: month.time,
                        position: 'inBar',
                        color: '#a855f780',
                        shape: 'arrowDown',
                        text: 'M'
                    });
                });
            }
            
            if (periodMarkers.length > 0) {
                mainSeries.setMarkers(periodMarkers);
            }
            
            let volumeSeries = null;
            if (showVolume) {
                volumeSeries = chart.addHistogramSeries({
                    color: '#26a69a',
                    priceFormat: {
                        type: 'volume',
                    },
                    priceScaleId: 'volume',
                });
                
                chart.priceScale('volume').applyOptions({
                    scaleMargins: {
                        top: 0.8,
                        bottom: 0,
                    },
                });
                
                const volumeData = marketData.map(d => ({
                    time: d.time,
                    value: d.volume,
                    color: d.close >= d.open ? '#26a69a80' : '#ef535080'
                }));
                
                volumeSeries.setData(volumeData);
            }

            const handleResize = () => {
                if (chartContainerRef.current) {
                    chart.applyOptions({ 
                        width: chartContainerRef.current.clientWidth 
                    });
                }
            };

            window.addEventListener('resize', handleResize);
            
            setTimeout(() => {
                if (isInitialLoadRef.current && savedVisibleRangeRef.current) {
                    try {
                        chart.timeScale().setVisibleLogicalRange(savedVisibleRangeRef.current);
                        isInitialLoadRef.current = false;
                    } catch (e) {
                        console.debug('Could not restore visible range:', e.message);
                        chart.timeScale().fitContent();
                    }
                } else if (isInitialLoadRef.current) {
                    chart.timeScale().fitContent();
                    const visibleLogicalRange = {
                        from: Math.max(0, marketData.length - 100),
                        to: marketData.length - 1
                    };
                    chart.timeScale().setVisibleLogicalRange(visibleLogicalRange);
                    isInitialLoadRef.current = false;
                } else if (savedVisibleRangeRef.current) {
                    try {
                        chart.timeScale().setVisibleLogicalRange(savedVisibleRangeRef.current);
                    } catch (e) {
                        console.debug('Could not restore visible range:', e.message);
                    }
                }
            }, 100);

            chartRef.current = {
                chart,
                series: mainSeries,
                maSeries,
                volumeSeries,
                destroy: () => {
                    try {
                        window.removeEventListener('resize', handleResize);
                        if (chart && typeof chart.remove === 'function') {
                            chart.remove();
                        }
                    } catch (e) {
                        console.debug('Chart disposal (normal):', e.message);
                    }
                }
            };

            console.log(`Chart initialized with ${marketData.length} data points`);
            
        } catch (error) {
            console.error('Error initializing TradingView chart:', error);
            setError(`Chart initialization failed: ${error.message}`);
        }
    };

    useEffect(() => {
        if (marketData.length > 0 && tvLoaded) {
            initTradingViewChart();
        }
        
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [marketData, chartType, tvLoaded, movingAverages, showVolume, showPeriodSeparators, weeklyData, monthlyData]);

return (
    <div style={{ width: '100%' }}>
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .asset-button:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
                }
                
                .main-body-info {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 20px !important;
                }
                
                .livingston-input:focus {
                    border-color: #3b82f6 !important;
                }
                
                .livingston-send:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
                }
                
                .livingston-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.6);
                }
                
                @media (max-width: 768px) {
                    .livingston-panel {
                        width: calc(100vw - 20px) !important;
                        right: 10px !important;
                        left: auto !important;
                        bottom: 100px !important;
                        max-height: 500px !important;
                    }
                    
                    .livingston-toggle {
                        right: 20px !important;
                        bottom: 20px !important;
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    .livingston-messages {
                        max-height: 300px !important;
                    }
                }
                
                @media (min-width: 769px) {
                    .livingston-panel {
                        bottom: 30px !important;
                    }
                }
            `}
        </style>
        <div className="header">
            <Header />
        </div>
        <div className="main-page-body">
            <SideNavs />
            <div className="main-body-info" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: '0 20px' }}>
                <div style={styles.header} className="header-title">
                    ⚡ SnowAI Trading Charts - Professional Tools
                </div>
        
        {showMADialog && (
            <>
                <div style={styles.modalOverlay} onClick={() => setShowMADialog(false)} />
                <div style={styles.modal}>
                    <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Add Moving Average</h3>
                    
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>
                        Type
                    </label>
                    <select 
                        style={styles.select}
                        value={maConfig.type}
                        onChange={(e) => setMaConfig({...maConfig, type: e.target.value})}
                    >
                        <option value="SMA">Simple Moving Average (SMA)</option>
                        <option value="EMA">Exponential Moving Average (EMA)</option>
                        <option value="WMA">Weighted Moving Average (WMA)</option>
                    </select>
                    
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>
                        Period
                    </label>
                    <input 
                        type="number" 
                        style={styles.input}
                        value={maConfig.period}
                        onChange={(e) => setMaConfig({...maConfig, period: e.target.value})}
                        min="2"
                        max="200"
                    />
                    
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>
                        Color
                    </label>
                    <input 
                        type="color" 
                        style={{...styles.input, height: '50px', cursor: 'pointer'}}
                        value={maConfig.color}
                        onChange={(e) => setMaConfig({...maConfig, color: e.target.value})}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button 
                            onClick={addMovingAverage}
                            style={{
                                ...styles.toolButton,
                                ...styles.toolButtonActive,
                                flex: 1
                            }}
                        >
                            Add Indicator
                        </button>
                        <button 
                            onClick={() => setShowMADialog(false)}
                            style={{
                                ...styles.toolButton,
                                flex: 1
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </>
        )}
        
        {error && (
            <div style={styles.errorMessage}>
                {error}
            </div>
        )}
        
        {!tvLoaded && (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                    Loading TradingView Lightweight Charts...
                </span>
            </div>
        )}
        
        <div style={styles.controlsContainer} className="controls-container">
            {Object.entries(assetClasses).map(([category, assets]) => (
                <div key={category} style={styles.assetSection} className="asset-section">
                    <div style={styles.categoryLabel} className="category-label">
                        {category}
                    </div>
                    <div>
                        {assets.map(asset => (
                            <button
                                key={asset.symbol}
                                className="asset-button"
                                onClick={() => setSelectedAsset(asset.symbol)}
                                style={{
                                    ...styles.assetButton,
                                    ...(selectedAsset === asset.symbol ? 
                                        styles.assetButtonActive : styles.assetButtonInactive)
                                }}
                            >
                                {asset.symbol}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            
            <div style={styles.chartTypeContainer}>
                <span style={styles.categoryLabel} className="category-label">Chart Type:</span>
                <button
                    className="chart-type-button"
                    onClick={() => setChartType('candlestick')}
                    style={{
                        ...styles.chartTypeButton,
                        ...(chartType === 'candlestick' ? 
                            styles.chartTypeButtonActive : styles.chartTypeButtonInactive)
                    }}
                >
                    Candlestick
                </button>
                <button
                    className="chart-type-button"
                    onClick={() => setChartType('line')}
                    style={{
                        ...styles.chartTypeButton,
                        ...(chartType === 'line' ? 
                            styles.chartTypeButtonActive : styles.chartTypeButtonInactive)
                    }}
                >
                    Line Chart
                </button>
            </div>

            <div style={styles.timeframeContainer}>
                <span style={styles.categoryLabel}>Timeframe:</span>
                {Object.entries(timeframes).map(([key, config]) => (
                    <button
                        key={key}
                        className="timeframe-button"
                        onClick={() => setTimeframe(key)}
                        style={{
                            ...styles.timeframeButton,
                            ...(timeframe === key ? 
                                styles.timeframeButtonActive : styles.timeframeButtonInactive)
                        }}
                        title={`${config.description} of data`}
                    >
                        {key}
                    </button>
                ))}
            </div>
            
            {dataStats && (
                <div style={styles.dataStats}>
                    <strong>Data:</strong> {dataStats.candles} candles over {dataStats.period} 
                    | <strong>Period:</strong> {dataStats.firstDate} to {dataStats.lastDate}
                    | <strong>Range:</strong> ${dataStats.lowestPrice.toFixed(4)} - ${dataStats.highestPrice.toFixed(4)}
                    | <strong>Source:</strong> {dataSource}
                    {lastUpdateTime && <> | <strong>Last Update:</strong> {lastUpdateTime.toLocaleTimeString()}</>}
                </div>
            )}
        </div>

        {isLoading && tvLoaded && (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                    Fetching {getCurrentAssetInfo().name} data ({timeframes[timeframe].description} lookback)...
                </span>
            </div>
        )}

        {!isLoading && tvLoaded && marketData.length > 0 && (
            <div style={styles.priceDisplay}>
                <div>
                    <div style={styles.currentPrice}>
                        ${currentPrice.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: getCurrentAssetInfo().symbol.includes('JPY') ? 3 : 
                                                  currentPrice < 1 ? 6 : 
                                                  currentPrice < 10 ? 4 : 2
                        })}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        {getCurrentAssetInfo().name} • {timeframes[timeframe].label} • {marketData.length} candles
                    </div>
                </div>
                <div style={styles.realTimeIndicator}>
                    <div style={styles.liveIndicator}></div>
                    <span style={{ color: '#10b981', fontWeight: '600', marginRight: '15px' }}>LIVE</span>
                    <div style={{
                        ...styles.priceChange,
                        ...(priceChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative)
                    }}>
                        {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                    </div>
                </div>
            </div>
        )}

        {!isLoading && tvLoaded && marketData.length > 0 && (
            <>
                <div style={styles.drawingToolbar}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                        <button
                            onClick={() => setShowMADialog(true)}
                            style={{
                                ...styles.toolButton,
                                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            📊 Add Moving Average
                        </button>
                        
                        <button
                            onClick={() => setShowVolume(!showVolume)}
                            style={{
                                ...styles.toolButton,
                                ...(showVolume ? styles.toolButtonActive : {})
                            }}
                        >
                            📈 Volume
                        </button>
                        
                        <button
                            onClick={togglePeriodSeparators}
                            disabled={separatorsLoading}
                            style={{
                                ...styles.toolButton,
                                ...(showPeriodSeparators ? styles.toolButtonActive : {}),
                                opacity: separatorsLoading ? 0.6 : 1
                            }}
                        >
                            {separatorsLoading ? '⏳ Loading...' : '📅 Week/Month Lines'}
                        </button>
                        
                        {(movingAverages.length > 0 || showPeriodSeparators) && (
                            <button
                                onClick={clearAllDrawings}
                                style={{
                                    ...styles.deleteButton,
                                    padding: '10px 16px'
                                }}
                            >
                                🗑️ Clear All
                            </button>
                        )}
                    </div>
                </div>

                {(movingAverages.length > 0 || showPeriodSeparators) && (
                    <div style={styles.indicatorList}>
                        <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>Active Indicators</h4>
                        
                        {movingAverages.map(ma => (
                            <div key={ma.id} style={styles.indicatorItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ 
                                        width: '20px', 
                                        height: '3px', 
                                        background: ma.color,
                                        borderRadius: '2px'
                                    }} />
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                        {ma.type} ({ma.period})
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeMovingAverage(ma.id)}
                                    style={styles.deleteButton}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        
                        {showPeriodSeparators && (
                            <div style={styles.indicatorItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ 
                                                width: '20px', 
                                                height: '3px', 
                                                background: '#3b82f6',
                                                borderRadius: '2px'
                                            }} />
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Weekly</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <div style={{ 
                                                width: '20px', 
                                                height: '3px', 
                                                background: '#a855f7',
                                                borderRadius: '2px'
                                            }} />
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Monthly</span>
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    {weeklyData.length} weeks, {monthlyData.length} months
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div style={styles.chartContainer}>
                    <div style={styles.chartTitle}>
                        {getCurrentAssetInfo().name} ({selectedAsset}) - {chartType === 'candlestick' ? 'Candlestick' : 'Line'} Chart
                    </div>
                    
                    <div 
                        ref={chartContainerRef}
                        style={{ 
                            width: '100%', 
                            height: '700px', 
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    />
                </div>
            </>
        )}
        
        {!livingstonOpen && (
            <button 
                className="livingston-toggle"
                style={styles.livingstonToggle}
                onClick={() => setLivingstonOpen(true)}
                title="Chat with Livingston AI"
            >
                <div style={styles.livingstonOrb}></div>
            </button>
        )}
        
        {livingstonOpen && (
            <div style={styles.livingstonPanel} className="livingston-panel">
                <div style={styles.livingstonHeader}>
                    <div style={styles.livingstonHeaderTitle}>
                        <div style={styles.livingstonHeaderOrb}></div>
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>Livingston</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>AI Trading Assistant</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setLivingstonOpen(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '5px 10px'
                        }}
                    >
                        ×
                    </button>
                </div>
                
                <div style={styles.livingstonMessages} className="livingston-messages">
                    {livingstonMessages.map((msg, idx) => (
                        <div key={idx} style={styles.livingstonMessage}>
                            {msg.image && (
                                <div style={{ marginBottom: '8px' }}>
                                    <img 
                                        src={msg.image} 
                                        alt="User uploaded" 
                                        style={styles.livingstonImagePreview}
                                    />
                                </div>
                            )}
                            <div style={msg.role === 'user' ? styles.livingstonMessageUser : styles.livingstonMessageAI}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {livingstonLoading && (
                        <div style={styles.livingstonMessage}>
                            <div style={styles.livingstonMessageAI}>
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: '#3b82f6',
                                        animation: 'pulse 1s infinite'
                                    }}></div>
                                    <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: '#3b82f6',
                                        animation: 'pulse 1s infinite 0.2s'
                                    }}></div>
                                    <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: '#3b82f6',
                                        animation: 'pulse 1s infinite 0.4s'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div style={styles.livingstonInputArea}>
                    {selectedImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={selectedImage} alt="Selected" style={styles.livingstonImagePreview} />
                            <button
                                onClick={() => setSelectedImage(null)}
                                style={{
                                    ...styles.deleteButton,
                                    fontSize: '0.8rem',
                                    padding: '6px 10px'
                                }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                    
                    <div style={styles.livingstonInputRow}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={styles.livingstonImageButton}
                            title="Attach image"
                        >
                            📎
                        </button>
                        <input
                            className="livingston-input"
                            type="text"
                            value={livingstonInput}
                            onChange={(e) => setLivingstonInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendLivingstonMessage()}
                            placeholder="Ask Livingston about the markets..."
                            style={styles.livingstonInput}
                            disabled={livingstonLoading}
                        />
                        <button
                            className="livingston-send"
                            onClick={sendLivingstonMessage}
                            style={styles.livingstonSendButton}
                            disabled={livingstonLoading || (!livingstonInput.trim() && !selectedImage)}
                        >
                            {livingstonLoading ? '...' : '📤'}
                        </button>
                    </div>
                    
                    {councilDiscussion && (
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#64748b', 
                            marginTop: '5px',
                            textAlign: 'center'
                        }}>
                            Using Council Discussion from {new Date(councilDiscussion.created_at).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
    </div>
    </div>
);
}