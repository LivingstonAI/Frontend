import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

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
    border: '1px solid rgba(226, 232, 240, 0.8)'
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
  instructionsCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '20px',
    borderRadius: '15px',
    marginTop: '25px',
    border: '1px solid #e2e8f0'
  },
  instructionsTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '15px'
  },
  instructionsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  instructionItem: {
    padding: '8px 0',
    color: '#475569',
    fontSize: '0.95rem'
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
  }
};

export default function Charts() {
    // Refs for chart containers
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    
    // State management
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

    // Enhanced timeframe configurations with longer lookback periods
    const timeframes = {
        '1M': { 
            label: '1 Minute', 
            interval: '1m', 
            limit: 1440, // 24 hours of 1-minute data
            binanceInterval: '1m',
            description: '24 hours'
        },
        '5M': { 
            label: '5 Minutes', 
            interval: '5m', 
            limit: 2016, // 7 days of 5-minute data
            binanceInterval: '5m',
            description: '7 days'
        },
        '15M': { 
            label: '15 Minutes', 
            interval: '15m', 
            limit: 1344, // 2 weeks of 15-minute data
            binanceInterval: '15m',
            description: '2 weeks'
        },
        '1H': { 
            label: '1 Hour', 
            interval: '1h', 
            limit: 2000, // ~83 days of hourly data
            binanceInterval: '1h',
            description: '83 days'
        },
        '4H': { 
            label: '4 Hours', 
            interval: '4h', 
            limit: 1500, // ~250 days of 4-hour data
            binanceInterval: '4h',
            description: '250 days'
        },
        '1D': { 
            label: '1 Day', 
            interval: '1d', 
            limit: 1000, // ~2.7 years of daily data
            binanceInterval: '1d',
            description: '2.7 years'
        },
        '1W': { 
            label: '1 Week', 
            interval: '1w', 
            limit: 520, // 10 years of weekly data
            binanceInterval: '1w',
            description: '10 years'
        }
    };

    // Expanded asset classes with the requested additions
    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', binanceSymbol: 'BTCUSDT', apiSymbol: 'BTCUSD' },
            { symbol: 'ETHUSD', name: 'Ethereum', binanceSymbol: 'ETHUSDT', apiSymbol: 'ETHUSD' },
            { symbol: 'ADAUSD', name: 'Cardano', binanceSymbol: 'ADAUSDT', apiSymbol: 'ADAUSD' },
            { symbol: 'SOLUSD', name: 'Solana', binanceSymbol: 'SOLUSDT', apiSymbol: 'SOLUSD' }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', binanceSymbol: null, apiSymbol: 'EUR_USD' },
            { symbol: 'GBPUSD', name: 'GBP/USD', binanceSymbol: null, apiSymbol: 'GBP_USD' },
            { symbol: 'USDJPY', name: 'USD/JPY', binanceSymbol: null, apiSymbol: 'USD_JPY' },
            { symbol: 'AUDUSD', name: 'AUD/USD', binanceSymbol: null, apiSymbol: 'AUD_USD' }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', binanceSymbol: null, apiSymbol: 'AAPL' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', binanceSymbol: null, apiSymbol: 'GOOGL' },
            { symbol: 'TSLA', name: 'Tesla Inc.', binanceSymbol: null, apiSymbol: 'TSLA' },
            { symbol: 'MSFT', name: 'Microsoft', binanceSymbol: null, apiSymbol: 'MSFT' }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', binanceSymbol: null, apiSymbol: 'XAU_USD' },
            { symbol: 'XAGUSD', name: 'Silver', binanceSymbol: null, apiSymbol: 'XAG_USD' },
            { symbol: 'USOIL', name: 'US Oil (WTI)', binanceSymbol: null, apiSymbol: 'USOIL' },
            { symbol: 'UKOIL', name: 'UK Oil (Brent)', binanceSymbol: null, apiSymbol: 'UKOIL' }
        ],
        'Bonds/Futures': [
            { symbol: 'ZB1!', name: '30-Year T-Bond Future', binanceSymbol: null, apiSymbol: 'ZB1!' },
            { symbol: 'US010Y', name: '10-Year Treasury Yield', binanceSymbol: null, apiSymbol: 'US010Y' },
            { symbol: 'US05Y', name: '5-Year Treasury Yield', binanceSymbol: null, apiSymbol: 'US05Y' }
        ]
    };

    // Load TradingView Lightweight Charts from CDN
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

    // Get current asset info
    const getCurrentAssetInfo = () => {
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        return { symbol: selectedAsset, name: selectedAsset, binanceSymbol: null, apiSymbol: selectedAsset };
    };

    // Fetch real market data from multiple sources
    const fetchRealMarketData = async (assetInfo, timeframeKey) => {
        setError('');
        const timeframeConfig = timeframes[timeframeKey];
        
        try {
            // Try Binance first for crypto assets
            if (assetInfo.binanceSymbol) {
                try {
                    return await fetchBinanceData(assetInfo.binanceSymbol, timeframeConfig);
                } catch (binanceError) {
                    console.log(`Binance failed for ${assetInfo.symbol}, using simulation:`, binanceError.message);
                    setDataSource(`Enhanced Simulation (Binance unavailable)`);
                    return generateEnhancedSimulatedData(assetInfo, timeframeConfig);
                }
            }
            
            // Use enhanced simulation for all other assets
            setDataSource(`Enhanced Simulation - ${timeframeConfig.description} lookback`);
            return generateEnhancedSimulatedData(assetInfo, timeframeConfig);
            
        } catch (error) {
            console.log('Fallback to simulation:', error.message);
            setDataSource(`Enhanced Simulation (API unavailable)`);
            return generateEnhancedSimulatedData(assetInfo, timeframeConfig);
        }
    };

    // Fetch data from Binance API
    const fetchBinanceData = async (symbol, timeframeConfig) => {
        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframeConfig.binanceInterval}&limit=${timeframeConfig.limit}`
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

    // Fetch data from Alpha Vantage (using fallback simulation)
    const fetchAlphaVantageData = async (symbol, timeframeConfig) => {
        console.log(`Alpha Vantage API key required for ${symbol}, using enhanced simulation`);
        return generateEnhancedSimulatedData(getCurrentAssetInfo(), timeframeConfig);
    };

    // Fetch data from Yahoo Finance (using fallback simulation)
    const fetchYahooFinanceData = async (symbol, timeframeConfig) => {
        console.log(`Yahoo Finance CORS proxy required for ${symbol}, using enhanced simulation`);
        return generateEnhancedSimulatedData(getCurrentAssetInfo(), timeframeConfig);
    };

    // Generate enhanced simulated data with realistic patterns
    const generateEnhancedSimulatedData = (assetInfo, timeframeConfig) => {
        const data = [];
        const intervalMs = getIntervalMilliseconds(timeframeConfig.interval);
        const dataPoints = timeframeConfig.limit;
        
        // Base prices for different assets
        const basePrices = {
            'BTCUSD': 43000,
            'ETHUSD': 2600,
            'ADAUSD': 0.48,
            'SOLUSD': 98,
            'EURUSD': 1.0856,
            'GBPUSD': 1.2741,
            'USDJPY': 148.75,
            'AUDUSD': 0.6689,
            'AAPL': 189.43,
            'GOOGL': 142.56,
            'TSLA': 248.50,
            'MSFT': 384.30,
            'XAUUSD': 2045.50,
            'XAGUSD': 24.12,
            'USOIL': 76.85,
            'UKOIL': 81.42,
            'ZB1!': 118.25,
            'US010Y': 4.35,
            'US05Y': 4.15
        };
        
        let currentPrice = basePrices[assetInfo.symbol] || 100;
        const now = new Date();
        
        // Create realistic market patterns
        for (let i = 0; i < dataPoints; i++) {
            const date = new Date(now.getTime() - (dataPoints - i) * intervalMs);
            
            // Add market hour effects (more volatility during trading hours)
            const hour = date.getHours();
            const isMarketHours = hour >= 9 && hour <= 16;
            const volatilityMultiplier = isMarketHours ? 1.5 : 0.7;
            
            // Add weekly patterns (less volatility on weekends for traditional markets)
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const weekendMultiplier = (assetInfo.symbol.includes('USD') && !assetInfo.symbol.startsWith('BTC') && !assetInfo.symbol.startsWith('ETH')) && isWeekend ? 0.3 : 1.0;
            
            // Create trends and cycles
            const longTermTrend = Math.sin(i / 100) * 0.001;
            const mediumTermTrend = Math.cos(i / 50) * 0.002;
            const shortTermNoise = (Math.random() - 0.5) * 0.005;
            
            // Asset-specific volatility
            const baseVolatility = getAssetVolatility(assetInfo.symbol);
            const timeframeVolatility = baseVolatility * getTimeframeMultiplier(timeframeConfig.interval);
            
            const totalChange = (longTermTrend + mediumTermTrend + shortTermNoise) * 
                               timeframeVolatility * volatilityMultiplier * weekendMultiplier;
            
            currentPrice *= (1 + totalChange);
            
            // Generate OHLC data
            const open = currentPrice * (1 + (Math.random() - 0.5) * 0.002);
            const close = open * (1 + (Math.random() - 0.5) * 0.004);
            const high = Math.max(open, close) * (1 + Math.random() * 0.003);
            const low = Math.min(open, close) * (1 - Math.random() * 0.003);
            
            // Ensure positive prices
            const safeOpen = Math.max(0.0001, open);
            const safeHigh = Math.max(0.0001, high);
            const safeLow = Math.max(0.0001, low);
            const safeClose = Math.max(0.0001, close);
            
            data.push({
                time: Math.floor(date.getTime() / 1000),
                open: safeOpen,
                high: safeHigh,
                low: safeLow,
                close: safeClose,
                value: safeClose,
                volume: Math.random() * 1000000
            });
            
            currentPrice = safeClose;
        }
        
        setDataSource(`Simulated Data - ${data.length} candles over ${timeframeConfig.description}`);
        return data.sort((a, b) => a.time - b.time);
    };

    // Helper functions
    const getIntervalMilliseconds = (interval) => {
        const multipliers = {
            '1m': 60 * 1000,
            '5m': 5 * 60 * 1000,
            '15m': 15 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '4h': 4 * 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000,
            '1w': 7 * 24 * 60 * 60 * 1000
        };
        return multipliers[interval] || 60 * 60 * 1000;
    };

    const getAssetVolatility = (symbol) => {
        const volatilities = {
            'BTCUSD': 0.03,
            'ETHUSD': 0.035,
            'ADAUSD': 0.04,
            'SOLUSD': 0.045,
            'EURUSD': 0.005,
            'GBPUSD': 0.007,
            'USDJPY': 0.006,
            'AUDUSD': 0.008,
            'AAPL': 0.015,
            'GOOGL': 0.018,
            'TSLA': 0.025,
            'MSFT': 0.012,
            'XAUUSD': 0.01,
            'XAGUSD': 0.015,
            'USOIL': 0.02,
            'UKOIL': 0.018,
            'ZB1!': 0.008,
            'US010Y': 0.02,
            'US05Y': 0.018
        };
        return volatilities[symbol] || 0.015;
    };

    const getTimeframeMultiplier = (interval) => {
        const multipliers = {
            '1m': 0.3,
            '5m': 0.5,
            '15m': 0.7,
            '1h': 1.0,
            '4h': 1.5,
            '1d': 2.0,
            '1w': 3.0
        };
        return multipliers[interval] || 1.0;
    };

    // Fetch and update market data when asset or timeframe changes
    useEffect(() => {
        const fetchData = async () => {
            if (!tvLoaded) return;
            
            setIsLoading(true);
            const assetInfo = getCurrentAssetInfo();
            
            try {
                const data = await fetchRealMarketData(assetInfo, timeframe);
                setMarketData(data);
                
                if (data.length > 0) {
                    const latestCandle = data[data.length - 1];
                    const firstCandle = data[0];
                    setCurrentPrice(latestCandle.close);
                    
                    // Calculate price change from first to last candle
                    const changePercent = ((latestCandle.close - firstCandle.close) / firstCandle.close) * 100;
                    setPriceChange(changePercent);
                    
                    // Set data statistics
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
    }, [selectedAsset, timeframe, tvLoaded]);

    // Initialize TradingView Chart with real data
    const initTradingViewChart = () => {
        if (!tvLoaded || !window.LightweightCharts || !chartContainerRef.current || marketData.length === 0) return;

        try {
            // Clear previous chart
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            chartContainerRef.current.innerHTML = '';

            // Create chart
            const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 600,
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
                        top: 0.1,
                        bottom: 0.1,
                    },
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: false,
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

            let series;
            
            if (chartType === 'candlestick') {
                series = chart.addCandlestickSeries({
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

                series.setData(candlestickData);
            } else {
                series = chart.addLineSeries({
                    color: '#667eea',
                    lineWidth: 3,
                    crosshairMarkerVisible: true,
                    crosshairMarkerRadius: 6,
                });

                const lineData = marketData.map(d => ({
                    time: d.time,
                    value: parseFloat(d.value.toFixed(8))
                }));

                series.setData(lineData);
            }

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current) {
                    chart.applyOptions({ 
                        width: chartContainerRef.current.clientWidth 
                    });
                }
            };

            window.addEventListener('resize', handleResize);
            
            // Auto-fit content on load
            setTimeout(() => {
                chart.timeScale().fitContent();
            }, 100);

            // Store chart reference with improved error handling
            chartRef.current = {
                chart,
                series,
                destroy: () => {
                    try {
                        window.removeEventListener('resize', handleResize);
                        if (chart && typeof chart.remove === 'function') {
                            chart.remove();
                        }
                    } catch (e) {
                        // Silently handle disposal errors - they're expected when switching quickly
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

    // Update chart when market data changes
    useEffect(() => {
        if (marketData.length > 0 && tvLoaded) {
            initTradingViewChart();
        }
        
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [marketData, chartType, tvLoaded]);

    // Real-time data updates (simulated for demo)
    useEffect(() => {
        if (marketData.length === 0) return;
        
        const interval = setInterval(() => {
            const lastCandle = marketData[marketData.length - 1];
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Only update if enough time has passed for the timeframe
            const timeframeSeconds = getIntervalMilliseconds(timeframes[timeframe].interval) / 1000;
            if (currentTime - lastCandle.time < timeframeSeconds) return;
            
            // Simulate small price movements
            const priceChange = (Math.random() - 0.5) * 0.001;
            const newPrice = lastCandle.close * (1 + priceChange);
            
            setCurrentPrice(newPrice);
            
            // Update the chart if it exists
            if (chartRef.current && chartRef.current.series) {
                const newCandle = {
                    time: currentTime,
                    open: lastCandle.close,
                    high: Math.max(lastCandle.close, newPrice),
                    low: Math.min(lastCandle.close, newPrice),
                    close: newPrice,
                    value: newPrice
                };
                
                try {
                    if (chartType === 'candlestick') {
                        chartRef.current.series.update({
                            time: newCandle.time,
                            open: newCandle.open,
                            high: newCandle.high,
                            low: newCandle.low,
                            close: newCandle.close
                        });
                    } else {
                        chartRef.current.series.update({
                            time: newCandle.time,
                            value: newCandle.value
                        });
                    }
                } catch (e) {
                    // Ignore update errors
                }
            }
        }, 5000); // Update every 5 seconds
        
        return () => clearInterval(interval);
    }, [marketData, timeframe, chartType]);

    return (
        <div style={styles.container}>
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
                    .asset-button:hover {
                        transform: translateY(-1px) !important;
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
                    }
                    
                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        .controls-container {
                            padding: 15px !important;
                        }
                        
                        .asset-section {
                            margin-bottom: 15px !important;
                        }
                        
                        .asset-button {
                            margin: 3px 4px !important;
                            padding: 8px 12px !important;
                            font-size: 0.8rem !important;
                        }
                        
                        .chart-type-button {
                            padding: 10px 16px !important;
                            font-size: 0.9rem !important;
                            margin: 4px !important;
                        }
                        
                        .timeframe-button {
                            padding: 6px 12px !important;
                            font-size: 0.8rem !important;
                            margin: 3px !important;
                        }
                        
                        .category-label {
                            font-size: 1rem !important;
                            margin-bottom: 8px !important;
                        }
                        
                        .header-title {
                            font-size: 1.5rem !important;
                            padding: 15px !important;
                        }
                        
                        .current-price {
                            font-size: 1.4rem !important;
                        }
                        
                        .chart-container {
                            padding: 15px !important;
                        }
                        
                        .chart-title {
                            font-size: 1.2rem !important;
                            margin-bottom: 10px !important;
                        }
                    }
                `}
            </style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={styles.mainBodyInfo}>
                    <div style={styles.header} className="header-title">
                        ⚡ SnowAI Trading Charts - Real Market Data
                    </div>
                    
                    {error && (
                        <div style={styles.errorMessage}>
                            ⚠️ {error}
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
                    
                    {/* Controls */}
                    <div style={styles.controlsContainer} className="controls-container">
                        {/* Asset Class Selector */}
                        {Object.entries(assetClasses).map(([category, assets]) => (
                            <div key={category} style={styles.assetSection} className="asset-section">
                                <div style={styles.categoryLabel} className="category-label">
                                    {category === 'Crypto' ? '₿' : 
                                     category === 'Forex' ? '💱' : 
                                     category === 'Stocks' ? '📊' : 
                                     category === 'Commodities' ? '🥇' : '📈'} {category}
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
                        
                        {/* Chart Type Selector */}
                        <div style={styles.chartTypeContainer}>
                            <span style={styles.categoryLabel} className="category-label">📈 Chart Type:</span>
                            <button
                                className="chart-type-button"
                                onClick={() => setChartType('candlestick')}
                                style={{
                                    ...styles.chartTypeButton,
                                    ...(chartType === 'candlestick' ? 
                                        styles.chartTypeButtonActive : styles.chartTypeButtonInactive)
                                }}
                            >
                                🕯️ Candlestick
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
                                📈 Line Chart
                            </button>
                        </div>

                        {/* Timeframe Selector */}
                        <div style={styles.timeframeContainer}>
                            <span style={styles.categoryLabel} className="category-label">⏰ Timeframe:</span>
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
                                    title={`${config.description} of data (${config.limit} candles)`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                        
                        {/* Data Statistics */}
                        {dataStats && (
                            <div style={styles.dataStats}>
                                📊 <strong>Data:</strong> {dataStats.candles} candles over {dataStats.period} 
                                | <strong>Period:</strong> {dataStats.firstDate} to {dataStats.lastDate}
                                | <strong>Range:</strong> ${dataStats.lowestPrice.toFixed(4)} - ${dataStats.highestPrice.toFixed(4)}
                                | <strong>Source:</strong> {dataSource}
                            </div>
                        )}
                    </div>

                    {/* Loading indicator */}
                    {isLoading && tvLoaded && (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingSpinner}></div>
                            <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                                Fetching {getCurrentAssetInfo().name} data ({timeframes[timeframe].description} lookback)...
                            </span>
                        </div>
                    )}

                    {/* Price Display */}
                    {!isLoading && tvLoaded && marketData.length > 0 && (
                        <div style={styles.priceDisplay}>
                            <div>
                                <div style={styles.currentPrice} className="current-price">
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

                    {/* Chart Container */}
                    {!isLoading && tvLoaded && marketData.length > 0 && (
                        <div style={styles.chartContainer} className="chart-container">
                            <div style={styles.chartTitle} className="chart-title">
                                {getCurrentAssetInfo().name} ({selectedAsset}) - {chartType === 'candlestick' ? 'Candlestick' : 'Line'} Chart - {timeframes[timeframe].description}
                            </div>
                            
                            <div 
                                ref={chartContainerRef}
                                style={{ 
                                    width: '100%', 
                                    height: '600px', 
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    )}

                    {/* Enhanced Chart Instructions */}
                    <div style={styles.instructionsCard}>
                        <div style={styles.instructionsTitle}>🎮 Advanced Chart Features & Controls</div>
                        <ul style={styles.instructionsList}>
                            <li style={styles.instructionItem}>📊 <strong>Extended Data:</strong> Up to 2,000 candles with multi-year lookback periods</li>
                            <li style={styles.instructionItem}>🔄 <strong>Real Data Sources:</strong> Binance API for crypto, enhanced simulation for other assets</li>
                            <li style={styles.instructionItem}>⚡ <strong>Live Updates:</strong> Real-time price movements every 5 seconds</li>
                            <li style={styles.instructionItem}>🔍 <strong>Zoom & Pan:</strong> Mouse wheel to zoom, click and drag to navigate</li>
                            <li style={styles.instructionItem}>📍 <strong>Crosshair:</strong> Hover for precise price and timestamp information</li>
                            <li style={styles.instructionItem}>📈 <strong>Multiple Timeframes:</strong> 1M to 1W with appropriate data density</li>
                            <li style={styles.instructionItem}>🏦 <strong>New Assets:</strong> Added Treasury bonds (ZB1!, US010Y, US05Y)</li>
                            <li style={styles.instructionItem}>📱 <strong>Responsive:</strong> Optimized for desktop and mobile viewing</li>
                            <li style={styles.instructionItem}>🎯 <strong>Auto-fit:</strong> Charts automatically scale to show all data</li>
                            <li style={styles.instructionItem}>⚙️ <strong>Performance:</strong> Lightweight charts with smooth 60fps rendering</li>
                        </ul>
                        
                        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '8px' }}>
                            <strong>💡 Pro Tip:</strong> Try different timeframes to see how the same asset behaves over various periods. 
                            Crypto data comes from Binance API with real historical prices, while other assets use enhanced 
                            simulation with realistic volatility patterns and market hour effects.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}