import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// Blue and white theme
const theme = {
  bg: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    modal: '#ffffff'
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  accent: {
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    pink: '#ec4899'
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    muted: '#94a3b8'
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    heavy: '#94a3b8'
  }
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.bg.secondary} 0%, ${theme.blue[50]} 100%)`,
    color: theme.text.primary
  },
  mainContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: '0 20px'
  },
  header: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[700]} 100%)`,
    color: 'white',
    padding: '25px',
    borderRadius: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '2.2rem',
    fontWeight: '800',
    boxShadow: `0 20px 50px rgba(59, 130, 246, 0.3)`,
    border: `2px solid ${theme.blue[400]}`
  },
  tradingModeSelector: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
    alignItems: 'center',
    background: theme.bg.elevated,
    padding: '20px',
    borderRadius: '15px',
    border: `1px solid ${theme.border.light}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  modeButton: {
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  modeButtonActive: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[700]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${theme.blue[500]}40`
  },
  modeButtonInactive: {
    background: theme.bg.tertiary,
    color: theme.text.secondary,
    border: `2px solid ${theme.border.medium}`
  },
  controlPanel: {
    background: theme.bg.elevated,
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: `1px solid ${theme.border.light}`
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: theme.blue[700],
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  assetButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    boxShadow: `0 4px 12px ${theme.blue[500]}40`
  },
  chartContainer: {
    background: theme.bg.elevated,
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${theme.border.light}`,
    marginBottom: '25px',
    position: 'relative'
  },
  chartTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: '20px',
    textAlign: 'center'
  },
  priceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${theme.blue[50]} 0%, ${theme.bg.secondary} 100%)`,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: `1px solid ${theme.border.light}`
  },
  currentPrice: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.blue[700]
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: theme.bg.modal,
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: `2px solid ${theme.border.medium}`
  },
  searchBar: {
    width: '100%',
    padding: '16px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '12px',
    color: theme.text.primary,
    fontSize: '1rem',
    marginBottom: '20px',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  assetClassSection: {
    marginBottom: '20px'
  },
  assetClassTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: theme.blue[600],
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  assetGridButton: {
    margin: '5px',
    padding: '12px 20px',
    border: `2px solid ${theme.border.light}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: theme.bg.primary,
    color: theme.text.primary
  },
  assetGridButtonActive: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[700]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 16px ${theme.blue[500]}50`,
    border: `2px solid ${theme.blue[600]}`
  },
  timeframeButton: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  timeframeButtonActive: {
    background: `linear-gradient(135deg, ${theme.accent.orange} 0%, #d97706 100%)`,
    color: 'white',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
  },
  timeframeButtonInactive: {
    background: theme.bg.tertiary,
    color: theme.text.secondary,
    border: `1px solid ${theme.border.light}`
  },
  orderPanel: {
    position: 'absolute',
    top: '80px',
    right: '25px',
    width: '350px',
    background: theme.bg.elevated,
    border: `2px solid ${theme.border.light}`,
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    zIndex: 100
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: theme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '10px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    color: theme.text.primary,
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    color: theme.text.primary,
    fontSize: '0.95rem',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonPrimary: {
    width: '100%',
    padding: '12px',
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[700]} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: `0 6px 16px ${theme.blue[500]}40`
  },
  buttonSecondary: {
    width: '100%',
    padding: '10px',
    background: theme.bg.tertiary,
    color: theme.text.primary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase'
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statCard: {
    background: theme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: `1px solid ${theme.border.light}`
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: theme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tradeCard: {
    background: theme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: `1px solid ${theme.border.light}`,
    transition: 'all 0.3s ease'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: `4px solid ${theme.border.medium}`,
    borderTop: `4px solid ${theme.blue[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '20px auto'
  }
};

export default function Charts() {
    const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app';
    
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const backtestIntervalRef = useRef(null);
    
    const [tradingMode, setTradingMode] = useState('LIVE');
    const [selectedAsset, setSelectedAsset] = useState('BTCUSD');
    const [selectedAssetInfo, setSelectedAssetInfo] = useState(null);
    const [chartType, setChartType] = useState('candlestick');
    const [timeframe, setTimeframe] = useState('1H');
    const [isLoading, setIsLoading] = useState(false);
    const [tvLoaded, setTvLoaded] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);
    const [marketData, setMarketData] = useState([]);
    const [error, setError] = useState('');
    
    // Trade execution states
    const [showOrderPanel, setShowOrderPanel] = useState(false);
    const [orderType, setOrderType] = useState('BUY');
    const [quantity, setQuantity] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [tradeNotes, setTradeNotes] = useState('');
    
    // Trade history states
    const [tradeHistory, setTradeHistory] = useState([]);
    const [showTradeHistory, setShowTradeHistory] = useState(false);
    const [tradeStats, setTradeStats] = useState(null);
    
    // Asset selection
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetSearchQuery, setAssetSearchQuery] = useState('');
    const [allAssets, setAllAssets] = useState({});
    
    // Overall performance states
    const [showOverallPerformance, setShowOverallPerformance] = useState(false);
    const [overallStats, setOverallStats] = useState(null);
    const [assetClassStats, setAssetClassStats] = useState({});
    const [assetBreakdown, setAssetBreakdown] = useState([]);
    const [sortBy, setSortBy] = useState('net_profit');
    
    // Backtest states
    const [backtestMode, setBacktestMode] = useState(false);
    const [backtestSession, setBacktestSession] = useState(null);
    const [backtestSpeed, setBacktestSpeed] = useState(2);
    const [backtestCurrentIndex, setBacktestCurrentIndex] = useState(0);
    const [backtestBalance, setBacktestBalance] = useState(10000);
    const [backtestTrades, setBacktestTrades] = useState([]);
    const [backtestPaused, setBacktestPaused] = useState(false);
    const [backtestData, setBacktestData] = useState([]);

    const timeframes = {
        '1M': { label: '1 Minute', interval: '1m', binanceInterval: '1m', yfinancePeriod: '1d', updateInterval: 10000 },
        '5M': { label: '5 Minutes', interval: '5m', binanceInterval: '5m', yfinancePeriod: '5d', updateInterval: 10000 },
        '15M': { label: '15 Minutes', interval: '15m', binanceInterval: '15m', yfinancePeriod: '1mo', updateInterval: 10000 },
        '1H': { label: '1 Hour', interval: '1h', binanceInterval: '1h', yfinancePeriod: '3mo', updateInterval: 10000 },
        '4H': { label: '4 Hours', interval: '4h', binanceInterval: '4h', yfinancePeriod: '6mo', updateInterval: 10000 },
        '1D': { label: '1 Day', interval: '1d', binanceInterval: '1d', yfinancePeriod: '2y', updateInterval: 10000 },
        '1W': { label: '1 Week', interval: '1w', binanceInterval: '1w', yfinancePeriod: '10y', updateInterval: 10000 }
    };

    // Fetch all assets from backend
    useEffect(() => {
        const fetchAllAssets = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/api/get-predefined-asset-lists/`);
                const result = await response.json();
                if (result.success) {
                    setAllAssets(result.asset_lists);
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };
        fetchAllAssets();
    }, []);

    // Convert asset lists to proper format
    const formatAssetForDisplay = (symbol, category) => {
        // Map yfinance symbols to display format
        const mapping = {
            '^GSPC': { symbol: 'SPX', name: 'S&P 500', assetClass: 'Indices', yfinanceSymbol: '^GSPC' },
            '^IXIC': { symbol: 'NDX', name: 'NASDAQ', assetClass: 'Indices', yfinanceSymbol: '^IXIC' },
            '^DJI': { symbol: 'DJI', name: 'Dow Jones', assetClass: 'Indices', yfinanceSymbol: '^DJI' },
            'EURUSD=X': { symbol: 'EURUSD', name: 'Euro/USD', assetClass: 'Forex', yfinanceSymbol: 'EURUSD=X' },
            'GBPUSD=X': { symbol: 'GBPUSD', name: 'GBP/USD', assetClass: 'Forex', yfinanceSymbol: 'GBPUSD=X' },
            'USDJPY=X': { symbol: 'USDJPY', name: 'USD/JPY', assetClass: 'Forex', yfinanceSymbol: 'USDJPY=X' },
            'GC=F': { symbol: 'XAUUSD', name: 'Gold', assetClass: 'Commodities', yfinanceSymbol: 'GC=F' },
            'SI=F': { symbol: 'XAGUSD', name: 'Silver', assetClass: 'Commodities', yfinanceSymbol: 'SI=F' },
            'CL=F': { symbol: 'USOIL', name: 'US Oil (WTI)', assetClass: 'Commodities', yfinanceSymbol: 'CL=F' },
            'BTC-USD': { symbol: 'BTCUSD', name: 'Bitcoin', assetClass: 'Crypto', yfinanceSymbol: 'BTC-USD', binanceSymbol: 'BTCUSDT' },
            'ETH-USD': { symbol: 'ETHUSD', name: 'Ethereum', assetClass: 'Crypto', yfinanceSymbol: 'ETH-USD', binanceSymbol: 'ETHUSDT' },
        };

        if (mapping[symbol]) {
            return mapping[symbol];
        }

        // For stocks, use as-is
        if (category === 'stocks') {
            return {
                symbol: symbol,
                name: symbol,
                assetClass: 'Stocks',
                yfinanceSymbol: symbol,
                binanceSymbol: null
            };
        }

        return {
            symbol: symbol,
            name: symbol,
            assetClass: category.charAt(0).toUpperCase() + category.slice(1),
            yfinanceSymbol: symbol,
            binanceSymbol: null
        };
    };

    const getCurrentAssetInfo = () => {
        // Search through all assets
        for (const [category, symbols] of Object.entries(allAssets)) {
            for (const symbol of symbols) {
                const formatted = formatAssetForDisplay(symbol, category);
                if (formatted.symbol === selectedAsset) {
                    return formatted;
                }
            }
        }
        return { symbol: selectedAsset, name: selectedAsset, assetClass: 'Unknown', yfinanceSymbol: selectedAsset };
    };

    useEffect(() => {
        setSelectedAssetInfo(getCurrentAssetInfo());
    }, [selectedAsset, allAssets]);

    // Load TradingView Lightweight Charts
    useEffect(() => {
        const loadTradingViewCharts = async () => {
            if (window.LightweightCharts) {
                setTvLoaded(true);
                return;
            }

            try {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    setTimeout(() => {
                        if (window.LightweightCharts) {
                            setTvLoaded(true);
                        }
                    }, 500);
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('Error loading TradingView Lightweight Charts:', error);
                setTvLoaded(false);
            }
        };

        loadTradingViewCharts();
    }, []);

    // Fetch market data
    const fetchMarketData = async (isInitial = false) => {
        if (isInitial) setIsLoading(true);
        
        const assetInfo = getCurrentAssetInfo();
        
        try {
            let data;
            if (assetInfo.binanceSymbol) {
                const response = await fetch(
                    `https://api.binance.com/api/v3/klines?symbol=${assetInfo.binanceSymbol}&interval=${timeframes[timeframe].binanceInterval}&limit=1000`
                );
                const rawData = await response.json();
                data = rawData.map((kline) => ({
                    time: Math.floor(kline[0] / 1000),
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                }));
            } else {
                const response = await fetch(`${BACKEND_API_URL}/api/snowai-market-ohlc/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        symbol: assetInfo.yfinanceSymbol,
                        interval: timeframes[timeframe].interval,
                        period: timeframes[timeframe].yfinancePeriod
                    })
                });
                const result = await response.json();
                data = result.data;
            }
            
            // Update market data
            setMarketData(data);
            
            if (data.length > 0) {
                const latest = data[data.length - 1];
                const first = data[0];
                setCurrentPrice(latest.close);
                setPriceChange(((latest.close - first.close) / first.close) * 100);
                
                // Update chart without reloading - just update the data
                if (!isInitial && candlestickSeriesRef.current && chartType === 'candlestick') {
                    candlestickSeriesRef.current.update(latest);
                } else if (!isInitial && candlestickSeriesRef.current && chartType === 'line') {
                    candlestickSeriesRef.current.update({ time: latest.time, value: latest.close });
                }
            }
            
        } catch (error) {
            console.error('Error fetching market data:', error);
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            if (isInitial) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tvLoaded && tradingMode === 'LIVE' && !backtestMode) {
            fetchMarketData(true);
            
            const interval = setInterval(() => {
                fetchMarketData(false);
            }, timeframes[timeframe].updateInterval);
            
            return () => clearInterval(interval);
        }
    }, [selectedAsset, timeframe, tvLoaded, tradingMode, backtestMode]);

    // Initialize chart
    useEffect(() => {
        if (!tvLoaded || !chartContainerRef.current || marketData.length === 0) return;

        try {
            // Only create chart if it doesn't exist
            if (!chartRef.current) {
                const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                    width: chartContainerRef.current.clientWidth,
                    height: 600,
                    layout: {
                        background: { type: 'solid', color: theme.bg.elevated },
                        textColor: theme.text.secondary,
                    },
                    grid: {
                        vertLines: { color: theme.border.light },
                        horzLines: { color: theme.border.light },
                    },
                    crosshair: {
                        mode: window.LightweightCharts.CrosshairMode.Normal,
                    },
                    rightPriceScale: {
                        borderColor: theme.border.medium,
                    },
                    timeScale: {
                        borderColor: theme.border.medium,
                        timeVisible: true,
                        secondsVisible: false,
                    },
                });

                chartRef.current = chart;
            }

            // Remove old series if exists
            if (candlestickSeriesRef.current) {
                chartRef.current.removeSeries(candlestickSeriesRef.current);
            }

            // Add new series
            let mainSeries;
            if (chartType === 'candlestick') {
                mainSeries = chartRef.current.addCandlestickSeries({
                    upColor: theme.accent.green,
                    downColor: theme.accent.red,
                    borderVisible: false,
                    wickUpColor: theme.accent.green,
                    wickDownColor: theme.accent.red,
                });
                mainSeries.setData(marketData);
            } else {
                mainSeries = chartRef.current.addLineSeries({
                    color: theme.blue[500],
                    lineWidth: 3,
                });
                mainSeries.setData(marketData.map(d => ({ time: d.time, value: d.close })));
            }

            candlestickSeriesRef.current = mainSeries;

            // Add trade markers
            if (tradeHistory.length > 0) {
                const markers = [];
                tradeHistory.forEach(trade => {
                    const entryTime = Math.floor(new Date(trade.entry_timestamp).getTime() / 1000);
                    
                    markers.push({
                        time: entryTime,
                        position: trade.order_type === 'BUY' ? 'belowBar' : 'aboveBar',
                        color: trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red,
                        shape: trade.order_type === 'BUY' ? 'arrowUp' : 'arrowDown',
                        text: `${trade.order_type} @ ${trade.entry_price}`
                    });
                    
                    if (trade.exit_timestamp) {
                        const exitTime = Math.floor(new Date(trade.exit_timestamp).getTime() / 1000);
                        markers.push({
                            time: exitTime,
                            position: trade.order_type === 'BUY' ? 'aboveBar' : 'belowBar',
                            color: trade.profit_loss > 0 ? theme.accent.green : theme.accent.red,
                            shape: 'circle',
                            text: `EXIT: ${trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss?.toFixed(2)}`
                        });
                    }
                });
                mainSeries.setMarkers(markers);
            }

            chartRef.current.timeScale().fitContent();

        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, [marketData, chartType, tvLoaded, tradeHistory]);

    // Backtest logic - show candles one by one
    useEffect(() => {
        if (backtestMode && !backtestPaused && backtestCurrentIndex < backtestData.length) {
            backtestIntervalRef.current = setTimeout(() => {
                const currentCandle = backtestData[backtestCurrentIndex];
                
                // Update the visible data by adding one candle at a time
                setMarketData(prev => [...prev, currentCandle]);
                setCurrentPrice(currentCandle.close);
                setBacktestCurrentIndex(prev => prev + 1);
                
                // Update chart with new candle
                if (candlestickSeriesRef.current) {
                    if (chartType === 'candlestick') {
                        candlestickSeriesRef.current.update(currentCandle);
                    } else {
                        candlestickSeriesRef.current.update({ time: currentCandle.time, value: currentCandle.close });
                    }
                }
                
            }, backtestSpeed * 1000);
        }
        
        return () => {
            if (backtestIntervalRef.current) {
                clearTimeout(backtestIntervalRef.current);
            }
        };
    }, [backtestMode, backtestPaused, backtestCurrentIndex, backtestSpeed, backtestData, chartType]);

    // Execute trade
    const executeTrade = async () => {
        if (!currentPrice) {
            alert('Wait for price data to load');
            return;
        }

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const assetInfo = getCurrentAssetInfo();
            
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-execute-trade-order-placement/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: assetInfo.symbol,
                    asset_name: assetInfo.name,
                    asset_class: assetInfo.assetClass,
                    order_type: orderType,
                    entry_price: currentPrice,
                    quantity: quantity,
                    stop_loss: stopLoss || null,
                    take_profit: takeProfit || null,
                    timezone: timezone,
                    notes: tradeNotes,
                    is_paper_trade: true
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(`${orderType} order placed successfully!`);
                setStopLoss('');
                setTakeProfit('');
                setTradeNotes('');
                setShowOrderPanel(false);
                fetchTradeHistory();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            alert('Failed to execute trade');
        }
    };

    // Fetch trade history
    const fetchTradeHistory = async () => {
        try {
            const assetInfo = getCurrentAssetInfo();
            const response = await fetch(
                `${BACKEND_API_URL}/api/snowai-fetch-trade-history-for-asset/?asset_symbol=${assetInfo.symbol}`
            );
            const result = await response.json();
            
            if (result.success) {
                setTradeHistory(result.trades);
                setTradeStats(result.statistics);
            }
        } catch (error) {
            console.error('Error fetching trade history:', error);
        }
    };

    // Fetch overall performance
    const fetchOverallPerformance = async () => {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-fetch-overall-trading-performance/`);
            const result = await response.json();
            
            if (result.success) {
                setOverallStats(result.overall_statistics);
                setAssetClassStats(result.asset_class_breakdown);
                setAssetBreakdown(result.asset_breakdown);
            }
        } catch (error) {
            console.error('Error fetching overall performance:', error);
        }
    };

    // Close trade
    const closeTrade = async (tradeId) => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-close-trade-order-execution/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trade_id: tradeId,
                    exit_price: currentPrice,
                    exit_reason: 'MANUAL',
                    timezone: timezone
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Trade closed successfully!');
                fetchTradeHistory();
            }
        } catch (error) {
            console.error('Error closing trade:', error);
        }
    };

    // Start backtest
    const startBacktest = async () => {
        setBacktestMode(true);
        setBacktestCurrentIndex(0);
        setBacktestBalance(10000);
        setBacktestTrades([]);
        setBacktestPaused(false);
        
        // Store full data for backtest
        setBacktestData([...marketData]);
        
        // Clear visible market data to show candles one by one
        setMarketData([]);
        
        const assetInfo = getCurrentAssetInfo();
        
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-start-paper-trading-backtest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: assetInfo.symbol,
                    asset_name: assetInfo.name,
                    timeframe: timeframe,
                    start_date: new Date(marketData[0].time * 1000).toISOString(),
                    end_date: new Date(marketData[marketData.length - 1].time * 1000).toISOString(),
                    initial_balance: 10000
                })
            });
            
            const result = await response.json();
            if (result.success) {
                setBacktestSession(result.session_data);
            }
        } catch (error) {
            console.error('Error starting backtest:', error);
        }
    };

    // Filter assets
    const getFilteredAssets = () => {
        const filtered = {};
        
        for (const [category, symbols] of Object.entries(allAssets)) {
            const categoryFiltered = symbols.filter(symbol => {
                const formatted = formatAssetForDisplay(symbol, category);
                return (
                    formatted.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                    formatted.name.toLowerCase().includes(assetSearchQuery.toLowerCase())
                );
            });
            
            if (categoryFiltered.length > 0) {
                filtered[category] = categoryFiltered;
            }
        }
        
        return filtered;
    };

    const filteredAssets = getFilteredAssets();

    return (
        <div style={styles.pageContainer}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    input:focus, select:focus {
                        border-color: ${theme.blue[500]} !important;
                        box-shadow: 0 0 0 3px ${theme.blue[500]}30 !important;
                    }
                    
                    .button-hover:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                    }
                `}
            </style>
            
            <div className="header">
                <Header />
            </div>
            
            <div className="main-page-body">
                <SideNavs />
                
                <div style={styles.mainContainer}>
                    <div style={styles.header}>
                        ⚡ SnowAI Professional Trading Terminal
                    </div>
                    
                    <div style={styles.tradingModeSelector}>
                        <span style={styles.sectionTitle}>📊 Trading Mode</span>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(tradingMode === 'LIVE' ? styles.modeButtonActive : styles.modeButtonInactive)
                            }}
                            onClick={() => {
                                setTradingMode('LIVE');
                                setBacktestMode(false);
                            }}
                        >
                            🔴 Live Trading
                        </button>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(tradingMode === 'BACKTEST' ? styles.modeButtonActive : styles.modeButtonInactive)
                            }}
                            onClick={() => setTradingMode('BACKTEST')}
                        >
                            ⏮️ Paper Trading / Backtest
                        </button>
                    </div>
                    
                    {error && (
                        <div style={{ 
                            background: `${theme.accent.red}20`,
                            border: `2px solid ${theme.accent.red}`,
                            color: theme.accent.red,
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={styles.controlPanel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={styles.sectionTitle}>
                                🎯 Current Asset
                            </div>
                            <button
                                style={styles.assetButton}
                                className="button-hover"
                                onClick={() => setShowAssetModal(true)}
                            >
                                {selectedAssetInfo?.symbol || 'Select Asset'} - {selectedAssetInfo?.name}
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ ...styles.assetClassTitle, marginBottom: 0 }}>⏰ Timeframe:</span>
                            {Object.keys(timeframes).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setTimeframe(key)}
                                    style={{
                                        ...styles.timeframeButton,
                                        ...(timeframe === key ? 
                                            styles.timeframeButtonActive : styles.timeframeButtonInactive)
                                    }}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {isLoading && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={styles.loadingSpinner}></div>
                            <p style={{ color: theme.text.secondary, marginTop: '20px' }}>
                                Loading market data...
                            </p>
                        </div>
                    )}
                    
                    {!isLoading && marketData.length > 0 && (
                        <>
                            <div style={styles.priceDisplay}>
                                <div>
                                    <div style={styles.currentPrice}>
                                        ${currentPrice.toLocaleString(undefined, { 
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 8
                                        })}
                                    </div>
                                    <div style={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
                                        {selectedAssetInfo?.name} • {timeframes[timeframe].label}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    color: priceChange >= 0 ? theme.accent.green : theme.accent.red
                                }}>
                                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                </div>
                            </div>
                            
                            <div style={styles.chartContainer}>
                                <div style={styles.chartTitle}>
                                    📈 {selectedAssetInfo?.name} ({selectedAsset})
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setChartType('candlestick')}
                                        style={{
                                            ...styles.modeButton,
                                            ...(chartType === 'candlestick' ? styles.modeButtonActive : styles.modeButtonInactive),
                                            width: 'auto'
                                        }}
                                    >
                                        🕯️ Candlestick
                                    </button>
                                    <button
                                        onClick={() => setChartType('line')}
                                        style={{
                                            ...styles.modeButton,
                                            ...(chartType === 'line' ? styles.modeButtonActive : styles.modeButtonInactive),
                                            width: 'auto'
                                        }}
                                    >
                                        📊 Line Chart
                                    </button>
                                </div>
                                
                                <div 
                                    ref={chartContainerRef}
                                    style={{ 
                                        width: '100%',
                                        height: '600px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                />
                                
                                {/* Floating Order Panel */}
                                {showOrderPanel && (
                                    <div style={styles.orderPanel}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0, color: theme.blue[700] }}>💼 Execute Trade</h3>
                                            <button
                                                onClick={() => setShowOrderPanel(false)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    fontSize: '1.5rem',
                                                    cursor: 'pointer',
                                                    color: theme.text.secondary
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Order Type</label>
                                            <select 
                                                style={styles.select}
                                                value={orderType}
                                                onChange={(e) => setOrderType(e.target.value)}
                                            >
                                                <option value="BUY">🟢 BUY</option>
                                                <option value="SELL">🔴 SELL</option>
                                            </select>
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Quantity</label>
                                            <input
                                                type="number"
                                                style={styles.input}
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                                min="0.01"
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Stop Loss</label>
                                            <input
                                                type="number"
                                                style={styles.input}
                                                placeholder="Optional"
                                                value={stopLoss}
                                                onChange={(e) => setStopLoss(e.target.value)}
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Take Profit</label>
                                            <input
                                                type="number"
                                                style={styles.input}
                                                placeholder="Optional"
                                                value={takeProfit}
                                                onChange={(e) => setTakeProfit(e.target.value)}
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Notes</label>
                                            <input
                                                type="text"
                                                style={styles.input}
                                                placeholder="Optional"
                                                value={tradeNotes}
                                                onChange={(e) => setTradeNotes(e.target.value)}
                                            />
                                        </div>
                                        
                                        <button
                                            style={styles.buttonPrimary}
                                            className="button-hover"
                                            onClick={executeTrade}
                                        >
                                            {orderType === 'BUY' ? '🟢' : '🔴'} Execute @ ${currentPrice.toFixed(2)}
                                        </button>
                                    </div>
                                )}
                                
                                {backtestMode && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '15px',
                                        background: theme.bg.tertiary,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: `1px solid ${theme.border.light}`
                                    }}>
                                        <div>
                                            <strong style={{ color: theme.blue[600] }}>Backtest Progress:</strong>{' '}
                                            {backtestCurrentIndex} / {backtestData.length} candles
                                        </div>
                                        <div>
                                            <strong style={{ color: theme.blue[600] }}>Balance:</strong>{' '}
                                            ${backtestBalance.toFixed(2)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => setBacktestPaused(!backtestPaused)}
                                                style={{
                                                    ...styles.buttonSecondary,
                                                    width: 'auto',
                                                    padding: '8px 16px'
                                                }}
                                            >
                                                {backtestPaused ? '▶️ Resume' : '⏸️ Pause'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setBacktestMode(false);
                                                    setMarketData(backtestData);
                                                }}
                                                style={{
                                                    ...styles.buttonSecondary,
                                                    width: 'auto',
                                                    padding: '8px 16px',
                                                    background: theme.accent.red,
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                ⏹️ Stop
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                <button
                                    onClick={() => setShowOrderPanel(!showOrderPanel)}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[700]} 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    className="button-hover"
                                >
                                    💼 {showOrderPanel ? 'Hide' : 'Show'} Order Panel
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setShowTradeHistory(true);
                                        fetchTradeHistory();
                                    }}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${theme.blue[600]} 0%, ${theme.blue[800]} 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    className="button-hover"
                                >
                                    📊 Trade History
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setShowOverallPerformance(true);
                                        fetchOverallPerformance();
                                    }}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${theme.accent.purple} 0%, #6d28d9 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    className="button-hover"
                                >
                                    🏆 Performance
                                </button>
                                
                                {tradingMode === 'BACKTEST' && !backtestMode && (
                                    <button
                                        onClick={startBacktest}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.accent.cyan} 0%, #0891b2 100%)`,
                                            color: 'white',
                                            border: 'none'
                                        }}
                                        className="button-hover"
                                    >
                                        ⚡ Start Backtest
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                    
                    {/* Asset Selection Modal */}
                    {showAssetModal && (
                        <div style={styles.modal} onClick={() => setShowAssetModal(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        🎯 Select Trading Asset
                                    </h2>
                                    <button
                                        onClick={() => setShowAssetModal(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <input
                                    type="text"
                                    placeholder="🔍 Search assets..."
                                    style={styles.searchBar}
                                    value={assetSearchQuery}
                                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                                />
                                
                                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {Object.entries(filteredAssets).map(([category, symbols]) => (
                                        <div key={category} style={styles.assetClassSection}>
                                            <div style={styles.assetClassTitle}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)} ({symbols.length})
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {symbols.map(symbol => {
                                                    const formatted = formatAssetForDisplay(symbol, category);
                                                    return (
                                                        <button
                                                            key={symbol}
                                                            onClick={() => {
                                                                setSelectedAsset(formatted.symbol);
                                                                setShowAssetModal(false);
                                                            }}
                                                            style={{
                                                                ...styles.assetGridButton,
                                                                ...(selectedAsset === formatted.symbol ? 
                                                                    styles.assetGridButtonActive : {})
                                                            }}
                                                            className="button-hover"
                                                        >
                                                            {formatted.symbol}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Trade History Modal */}
                    {showTradeHistory && (
                        <div style={styles.modal} onClick={() => setShowTradeHistory(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        📊 Trade History - {selectedAssetInfo?.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowTradeHistory(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                {tradeStats && (
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                        gap: '15px',
                                        marginBottom: '25px'
                                    }}>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.blue[600] }}>
                                                {tradeStats.closed_trades}
                                            </div>
                                            <div style={styles.statLabel}>Closed Trades</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.green }}>
                                                {tradeStats.winning_trades}
                                            </div>
                                            <div style={styles.statLabel}>Winners</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.red }}>
                                                {tradeStats.losing_trades}
                                            </div>
                                            <div style={styles.statLabel}>Losers</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: theme.accent.cyan }}>
                                                {tradeStats.win_rate}%
                                            </div>
                                            <div style={styles.statLabel}>Win Rate</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ 
                                                ...styles.statValue, 
                                                color: tradeStats.net_profit >= 0 ? theme.accent.green : theme.accent.red 
                                            }}>
                                                ${tradeStats.net_profit.toFixed(2)}
                                            </div>
                                            <div style={styles.statLabel}>Net P&L</div>
                                        </div>
                                    </div>
                                )}
                                
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {tradeHistory.map(trade => (
                                        <div 
                                            key={trade.trade_id}
                                            style={styles.tradeCard}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: trade.order_type === 'BUY' ? theme.accent.green : theme.accent.red,
                                                        color: 'white'
                                                    }}>
                                                        {trade.order_type}
                                                    </span>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: trade.status === 'OPEN' ? theme.blue[500] : theme.bg.tertiary,
                                                        color: trade.status === 'OPEN' ? 'white' : theme.text.secondary,
                                                        marginLeft: '10px'
                                                    }}>
                                                        {trade.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: theme.text.tertiary }}>
                                                    {new Date(trade.entry_timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ color: theme.text.tertiary, fontSize: '0.85rem' }}>Entry Price</div>
                                                    <div style={{ color: theme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                        ${trade.entry_price}
                                                    </div>
                                                </div>
                                                {trade.exit_price && (
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary, fontSize: '0.85rem' }}>Exit Price</div>
                                                        <div style={{ color: theme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                            ${trade.exit_price}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {trade.profit_loss !== null && (
                                                <div style={{
                                                    padding: '10px',
                                                    background: trade.profit_loss >= 0 ? `${theme.accent.green}20` : `${theme.accent.red}20`,
                                                    borderRadius: '8px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <div style={{ 
                                                        fontSize: '1.3rem', 
                                                        fontWeight: '800',
                                                        color: trade.profit_loss >= 0 ? theme.accent.green : theme.accent.red 
                                                    }}>
                                                        {trade.profit_loss >= 0 ? '+' : ''}${trade.profit_loss.toFixed(2)} ({trade.profit_loss_percentage >= 0 ? '+' : ''}{trade.profit_loss_percentage.toFixed(2)}%)
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {trade.status === 'OPEN' && (
                                                <button
                                                    onClick={() => closeTrade(trade.trade_id)}
                                                    style={{
                                                        ...styles.buttonSecondary,
                                                        background: theme.accent.red,
                                                        color: 'white',
                                                        border: 'none',
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    Close Position
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Overall Performance Modal */}
                    {showOverallPerformance && overallStats && (
                        <div style={styles.modal} onClick={() => setShowOverallPerformance(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: theme.blue[700], margin: 0 }}>
                                        🏆 Overall Trading Performance
                                    </h2>
                                    <button
                                        onClick={() => setShowOverallPerformance(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: theme.text.primary,
                                            fontSize: '2rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                    gap: '15px',
                                    marginBottom: '30px'
                                }}>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.blue[600] }}>
                                            {overallStats.total_trades}
                                        </div>
                                        <div style={styles.statLabel}>Total Trades</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.green }}>
                                            {overallStats.winning_trades}
                                        </div>
                                        <div style={styles.statLabel}>Winners</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.cyan }}>
                                            {overallStats.win_rate}%
                                        </div>
                                        <div style={styles.statLabel}>Win Rate</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ 
                                            ...styles.statValue, 
                                            color: overallStats.net_profit >= 0 ? theme.accent.green : theme.accent.red 
                                        }}>
                                            ${overallStats.net_profit.toFixed(2)}
                                        </div>
                                        <div style={styles.statLabel}>Net P&L</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: theme.accent.purple }}>
                                            {overallStats.profit_factor}
                                        </div>
                                        <div style={styles.statLabel}>Profit Factor</div>
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: theme.blue[600], marginBottom: '15px' }}>
                                        Asset Class Breakdown
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                        {Object.entries(assetClassStats).map(([assetClass, stats]) => (
                                            <div key={assetClass} style={styles.statCard}>
                                                <h4 style={{ color: theme.text.primary, marginBottom: '10px' }}>
                                                    {assetClass}
                                                </h4>
                                                <div style={{ fontSize: '0.9rem', color: theme.text.secondary }}>
                                                    <div>Trades: {stats.total_trades}</div>
                                                    <div>Win Rate: {stats.win_rate}%</div>
                                                    <div style={{ 
                                                        color: stats.net_profit >= 0 ? theme.accent.green : theme.accent.red,
                                                        fontWeight: '700',
                                                        marginTop: '5px'
                                                    }}>
                                                        P&L: ${stats.net_profit}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}