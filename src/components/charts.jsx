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
    tertiary: '#94a3b8',
    muted: '#cbd5e1'
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
    background: `linear-gradient(135deg, ${theme.blue[600]} 0%, ${theme.blue[700]} 100%)`,
    color: 'white',
    padding: '25px',
    borderRadius: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '2.2rem',
    fontWeight: '800',
    boxShadow: '0 10px 40px rgba(37, 99, 235, 0.3)',
    border: `2px solid ${theme.blue[500]}`
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
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
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
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
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
  chartContainer: {
    background: theme.bg.elevated,
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
    background: theme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: `1px solid ${theme.border.light}`
  },
  currentPrice: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.blue[600]
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
    padding: '20px',
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    background: theme.bg.modal,
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: `2px solid ${theme.border.medium}`
  },
  tradeModalOverlay: {
    position: 'absolute',
    top: '80px',
    right: '25px',
    width: '400px',
    background: theme.bg.elevated,
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: `2px solid ${theme.blue[400]}`,
    zIndex: 10
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.9rem',
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
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  buttonSecondary: {
    padding: '10px 20px',
    background: theme.bg.tertiary,
    color: theme.text.primary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  searchBar: {
    width: '100%',
    padding: '14px',
    background: theme.bg.tertiary,
    border: `2px solid ${theme.border.medium}`,
    borderRadius: '12px',
    color: theme.text.primary,
    fontSize: '1rem',
    marginBottom: '20px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  assetButton: {
    margin: '5px',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  assetButtonActive: {
    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
  },
  assetButtonInactive: {
    background: theme.bg.tertiary,
    color: theme.text.secondary,
    border: `2px solid ${theme.border.light}`
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
    border: `1px solid ${theme.border.light}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
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
    border: `4px solid ${theme.border.light}`,
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
    const lineSeriesRef = useRef(null);
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
    const [showTradePanel, setShowTradePanel] = useState(false);
    const [orderType, setOrderType] = useState('BUY');
    const [quantity, setQuantity] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [tradeNotes, setTradeNotes] = useState('');
    
    // Trade history states
    const [tradeHistory, setTradeHistory] = useState([]);
    const [showTradeHistory, setShowTradeHistory] = useState(false);
    const [tradeStats, setTradeStats] = useState(null);
    
    // Asset selection modal
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetSearchQuery, setAssetSearchQuery] = useState('');
    const [allAssets, setAllAssets] = useState({});
    
    // Overall performance states
    const [showOverallPerformance, setShowOverallPerformance] = useState(false);
    const [overallStats, setOverallStats] = useState(null);
    const [assetClassStats, setAssetClassStats] = useState({});
    const [assetBreakdown, setAssetBreakdown] = useState([]);
    
    // Backtest states
    const [backtestMode, setBacktestMode] = useState(false);
    const [backtestSession, setBacktestSession] = useState(null);
    const [backtestSpeed, setBacktestSpeed] = useState(1);
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

    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', binanceSymbol: 'BTCUSDT', yfinanceSymbol: 'BTC-USD', assetClass: 'Crypto' },
            { symbol: 'ETHUSD', name: 'Ethereum', binanceSymbol: 'ETHUSDT', yfinanceSymbol: 'ETH-USD', assetClass: 'Crypto' },
            { symbol: 'ADAUSD', name: 'Cardano', binanceSymbol: 'ADAUSDT', yfinanceSymbol: 'ADA-USD', assetClass: 'Crypto' },
            { symbol: 'SOLUSD', name: 'Solana', binanceSymbol: 'SOLUSDT', yfinanceSymbol: 'SOL-USD', assetClass: 'Crypto' }
        ],
        'Indices': [
            { symbol: 'SPX', name: 'S&P 500', binanceSymbol: null, yfinanceSymbol: '^GSPC', assetClass: 'Indices' },
            { symbol: 'NDX', name: 'NASDAQ 100', binanceSymbol: null, yfinanceSymbol: '^NDX', assetClass: 'Indices' },
            { symbol: 'DJI', name: 'Dow Jones', binanceSymbol: null, yfinanceSymbol: '^DJI', assetClass: 'Indices' }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', binanceSymbol: null, yfinanceSymbol: 'EURUSD=X', assetClass: 'Forex' },
            { symbol: 'GBPUSD', name: 'GBP/USD', binanceSymbol: null, yfinanceSymbol: 'GBPUSD=X', assetClass: 'Forex' },
            { symbol: 'USDJPY', name: 'USD/JPY', binanceSymbol: null, yfinanceSymbol: 'JPY=X', assetClass: 'Forex' }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', binanceSymbol: null, yfinanceSymbol: 'AAPL', assetClass: 'Stocks' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', binanceSymbol: null, yfinanceSymbol: 'GOOGL', assetClass: 'Stocks' },
            { symbol: 'TSLA', name: 'Tesla Inc.', binanceSymbol: null, yfinanceSymbol: 'TSLA', assetClass: 'Stocks' },
            { symbol: 'MSFT', name: 'Microsoft', binanceSymbol: null, yfinanceSymbol: 'MSFT', assetClass: 'Stocks' }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', binanceSymbol: null, yfinanceSymbol: 'GC=F', assetClass: 'Commodities' },
            { symbol: 'XAGUSD', name: 'Silver', binanceSymbol: null, yfinanceSymbol: 'SI=F', assetClass: 'Commodities' },
            { symbol: 'USOIL', name: 'US Oil (WTI)', binanceSymbol: null, yfinanceSymbol: 'CL=F', assetClass: 'Commodities' }
        ]
    };

    // Fetch all assets from backend
    useEffect(() => {
        const fetchAllAssets = async () => {
            try {
                const response = await fetch(`${BACKEND_API_URL}/api/mss/asset-lists/`);
                const result = await response.json();
                if (result.success) {
                    setAllAssets(result.asset_lists);
                }
            } catch (error) {
                console.error('Error fetching asset lists:', error);
            }
        };
        fetchAllAssets();
    }, []);

    // Get current asset info
    const getCurrentAssetInfo = () => {
        // First check in basic asset classes
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        
        // Then check in all assets loaded from backend
        for (const [category, symbols] of Object.entries(allAssets)) {
            if (symbols.includes(selectedAsset)) {
                return {
                    symbol: selectedAsset,
                    name: selectedAsset,
                    yfinanceSymbol: selectedAsset,
                    binanceSymbol: null,
                    assetClass: category.charAt(0).toUpperCase() + category.slice(1)
                };
            }
        }
        
        return { symbol: selectedAsset, name: selectedAsset, assetClass: 'Unknown' };
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
    const fetchMarketData = async () => {
        setIsLoading(true);
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
            
            setMarketData(data);
            setBacktestData(data); // Store for backtest
            
            if (data.length > 0) {
                const latest = data[data.length - 1];
                const first = data[0];
                setCurrentPrice(latest.close);
                setPriceChange(((latest.close - first.close) / first.close) * 100);
            }
            
        } catch (error) {
            console.error('Error fetching market data:', error);
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tvLoaded && tradingMode === 'LIVE' && !backtestMode) {
            fetchMarketData();
            
            const interval = setInterval(() => {
                fetchMarketData();
            }, timeframes[timeframe].updateInterval);
            
            return () => clearInterval(interval);
        }
    }, [selectedAsset, timeframe, tvLoaded, tradingMode, backtestMode]);

    // Initialize chart ONCE
    useEffect(() => {
        if (!tvLoaded || !chartContainerRef.current) return;

        try {
            // Clean up existing chart
            if (chartRef.current) {
                chartRef.current.remove();
            }
            chartContainerRef.current.innerHTML = '';

            // Create new chart
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

            // Create series based on chart type
            if (chartType === 'candlestick') {
                const candleSeries = chart.addCandlestickSeries({
                    upColor: theme.accent.green,
                    downColor: theme.accent.red,
                    borderVisible: false,
                    wickUpColor: theme.accent.green,
                    wickDownColor: theme.accent.red,
                });
                candlestickSeriesRef.current = candleSeries;
                lineSeriesRef.current = null;
            } else {
                const lineSeries = chart.addLineSeries({
                    color: theme.blue[500],
                    lineWidth: 3,
                });
                lineSeriesRef.current = lineSeries;
                candlestickSeriesRef.current = null;
            }

            chartRef.current = chart;

        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, [tvLoaded, chartType]);

    // Update chart data WITHOUT recreating chart
    useEffect(() => {
        if (!chartRef.current || marketData.length === 0) return;

        try {
            if (chartType === 'candlestick' && candlestickSeriesRef.current) {
                candlestickSeriesRef.current.setData(marketData);
            } else if (chartType === 'line' && lineSeriesRef.current) {
                lineSeriesRef.current.setData(marketData.map(d => ({ time: d.time, value: d.close })));
            }

            // Add trade markers
            if (tradeHistory.length > 0 && (candlestickSeriesRef.current || lineSeriesRef.current)) {
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
                
                const series = candlestickSeriesRef.current || lineSeriesRef.current;
                series.setMarkers(markers);
            }

            chartRef.current.timeScale().fitContent();

        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    }, [marketData, tradeHistory, chartType]);

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
                setShowTradePanel(false);
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

    // Start backtest - proper implementation
    const startBacktest = async () => {
        if (backtestData.length === 0) {
            alert('Please wait for market data to load first');
            return;
        }

        setBacktestMode(true);
        setBacktestCurrentIndex(0);
        setBacktestBalance(10000);
        setBacktestTrades([]);
        setBacktestPaused(false);
        
        // Clear chart and show first candle only
        if (candlestickSeriesRef.current) {
            candlestickSeriesRef.current.setData([backtestData[0]]);
        } else if (lineSeriesRef.current) {
            lineSeriesRef.current.setData([{ time: backtestData[0].time, value: backtestData[0].close }]);
        }
        
        setCurrentPrice(backtestData[0].close);
        
        const assetInfo = getCurrentAssetInfo();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/snowai-start-paper-trading-backtest/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_symbol: assetInfo.symbol,
                    asset_name: assetInfo.name,
                    timeframe: timeframe,
                    start_date: new Date(backtestData[0].time * 1000).toISOString(),
                    end_date: new Date(backtestData[backtestData.length - 1].time * 1000).toISOString(),
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

    // Backtest loop - show candles one by one
    useEffect(() => {
        if (backtestMode && !backtestPaused && backtestCurrentIndex < backtestData.length) {
            backtestIntervalRef.current = setTimeout(() => {
                const newIndex = backtestCurrentIndex + 1;
                
                if (newIndex < backtestData.length) {
                    // Update chart with candles up to current index
                    const visibleData = backtestData.slice(0, newIndex + 1);
                    
                    if (candlestickSeriesRef.current) {
                        candlestickSeriesRef.current.setData(visibleData);
                    } else if (lineSeriesRef.current) {
                        lineSeriesRef.current.setData(visibleData.map(d => ({ time: d.time, value: d.close })));
                    }
                    
                    const currentCandle = backtestData[newIndex];
                    setCurrentPrice(currentCandle.close);
                    setBacktestCurrentIndex(newIndex);
                    
                    // Fit content to show latest
                    if (chartRef.current) {
                        chartRef.current.timeScale().scrollToPosition(0, false);
                    }
                }
                
            }, backtestSpeed * 1000);
        }
        
        return () => {
            if (backtestIntervalRef.current) {
                clearTimeout(backtestIntervalRef.current);
            }
        };
    }, [backtestMode, backtestPaused, backtestCurrentIndex, backtestSpeed, backtestData]);

    // Stop backtest
    const stopBacktest = () => {
        setBacktestMode(false);
        setBacktestPaused(false);
        setBacktestCurrentIndex(0);
        
        // Restore full market data
        if (candlestickSeriesRef.current) {
            candlestickSeriesRef.current.setData(marketData);
        } else if (lineSeriesRef.current) {
            lineSeriesRef.current.setData(marketData.map(d => ({ time: d.time, value: d.close })));
        }
        
        if (marketData.length > 0) {
            setCurrentPrice(marketData[marketData.length - 1].close);
        }
    };

    // Filter assets for search
    const getFilteredAssets = () => {
        const filtered = {};
        
        for (const [category, symbols] of Object.entries(allAssets)) {
            const matches = symbols.filter(symbol => 
                symbol.toLowerCase().includes(assetSearchQuery.toLowerCase())
            );
            if (matches.length > 0) {
                filtered[category] = matches;
            }
        }
        
        return filtered;
    };

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
                        box-shadow: 0 0 0 3px ${theme.blue[100]} !important;
                    }
                    
                    button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={styles.sectionTitle}>
                                🎯 Current Asset: {selectedAssetInfo?.name || selectedAsset}
                            </div>
                            <button
                                onClick={() => setShowAssetModal(true)}
                                style={{
                                    ...styles.buttonSecondary,
                                    background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                🔍 Search & Select Asset
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                            <span style={{ color: theme.text.secondary, fontWeight: '600' }}>⏰ Timeframe:</span>
                            {Object.keys(timeframes).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setTimeframe(key)}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        ...(timeframe === key ? {
                                            background: `linear-gradient(135deg, ${theme.accent.orange} 0%, #d97706 100%)`,
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                        } : {
                                            background: theme.bg.tertiary,
                                            color: theme.text.secondary,
                                            border: `1px solid ${theme.border.light}`
                                        })
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
                                            width: 'auto',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        🕯️ Candlestick
                                    </button>
                                    <button
                                        onClick={() => setChartType('line')}
                                        style={{
                                            ...styles.modeButton,
                                            ...(chartType === 'line' ? styles.modeButtonActive : styles.modeButtonInactive),
                                            width: 'auto',
                                            padding: '10px 20px'
                                        }}
                                    >
                                        📊 Line Chart
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowTradePanel(!showTradePanel)}
                                        style={{
                                            ...styles.modeButton,
                                            background: `linear-gradient(135deg, ${theme.accent.green} 0%, #059669 100%)`,
                                            color: 'white',
                                            width: 'auto',
                                            padding: '10px 20px',
                                            marginLeft: 'auto'
                                        }}
                                    >
                                        💼 {showTradePanel ? 'Hide' : 'Show'} Trade Panel
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
                                
                                {showTradePanel && (
                                    <div style={styles.tradeModalOverlay}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0, color: theme.blue[700] }}>💼 Execute Trade</h3>
                                            <button
                                                onClick={() => setShowTradePanel(false)}
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
                                            <label style={styles.label}>Stop Loss (Optional)</label>
                                            <input
                                                type="number"
                                                style={styles.input}
                                                placeholder="Enter stop loss"
                                                value={stopLoss}
                                                onChange={(e) => setStopLoss(e.target.value)}
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Take Profit (Optional)</label>
                                            <input
                                                type="number"
                                                style={styles.input}
                                                placeholder="Enter take profit"
                                                value={takeProfit}
                                                onChange={(e) => setTakeProfit(e.target.value)}
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Notes (Optional)</label>
                                            <input
                                                type="text"
                                                style={styles.input}
                                                placeholder="Trade notes..."
                                                value={tradeNotes}
                                                onChange={(e) => setTradeNotes(e.target.value)}
                                            />
                                        </div>
                                        
                                        <button
                                            style={styles.buttonPrimary}
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
                                        border: `2px solid ${theme.blue[400]}`
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
                                                style={styles.buttonSecondary}
                                            >
                                                {backtestPaused ? '▶️ Resume' : '⏸️ Pause'}
                                            </button>
                                            <button
                                                onClick={stopBacktest}
                                                style={{
                                                    ...styles.buttonSecondary,
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
                                    onClick={() => {
                                        setShowTradeHistory(true);
                                        fetchTradeHistory();
                                    }}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${theme.blue[500]} 0%, ${theme.blue[600]} 100%)`,
                                        color: 'white',
                                        border: 'none',
                                        padding: '14px'
                                    }}
                                >
                                    📊 View Trade History
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
                                        border: 'none',
                                        padding: '14px'
                                    }}
                                >
                                    🏆 Overall Performance
                                </button>
                                
                                {tradingMode === 'BACKTEST' && !backtestMode && (
                                    <button
                                        onClick={startBacktest}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${theme.accent.cyan} 0%, #0891b2 100%)`,
                                            color: 'white',
                                            border: 'none',
                                            padding: '14px'
                                        }}
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
                                        🔍 Search & Select Asset
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
                                    placeholder="🔍 Search assets (e.g., AAPL, BTC, EURUSD)..."
                                    style={styles.searchBar}
                                    value={assetSearchQuery}
                                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                
                                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {Object.entries(getFilteredAssets()).map(([category, symbols]) => (
                                        <div key={category} style={{ marginBottom: '25px' }}>
                                            <h3 style={{ 
                                                color: theme.blue[600], 
                                                marginBottom: '12px',
                                                textTransform: 'uppercase',
                                                fontSize: '1.1rem',
                                                letterSpacing: '1px'
                                            }}>
                                                {category}
                                            </h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {symbols.map(symbol => (
                                                    <button
                                                        key={symbol}
                                                        onClick={() => {
                                                            setSelectedAsset(symbol);
                                                            setShowAssetModal(false);
                                                            setAssetSearchQuery('');
                                                        }}
                                                        style={{
                                                            ...styles.assetButton,
                                                            ...(selectedAsset === symbol ? styles.assetButtonActive : styles.assetButtonInactive)
                                                        }}
                                                    >
                                                        {symbol}
                                                    </button>
                                                ))}
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
                                            style={{
                                                ...styles.tradeCard,
                                                borderLeft: trade.status === 'CLOSED' && trade.profit_loss !== null
                                                    ? `5px solid ${trade.profit_loss > 0 ? theme.accent.green : theme.accent.red}`
                                                    : 'none'
                                            }}
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
                                                        marginTop: '10px',
                                                        width: '100%'
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
                                
                                <div>
                                    <h3 style={{ color: theme.blue[600], marginBottom: '15px' }}>
                                        Per Asset Performance
                                    </h3>
                                    
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {assetBreakdown.map(asset => (
                                            <div key={asset.asset_symbol} style={styles.tradeCard}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4 style={{ color: theme.text.primary, margin: '0 0 5px 0' }}>
                                                            {asset.asset_symbol} - {asset.asset_name}
                                                        </h4>
                                                        <span style={{ 
                                                            ...styles.badge,
                                                            background: theme.blue[100],
                                                            color: theme.blue[700]
                                                        }}>
                                                            {asset.asset_class}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '800',
                                                        color: asset.net_profit >= 0 ? theme.accent.green : theme.accent.red
                                                    }}>
                                                        ${asset.net_profit.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(4, 1fr)', 
                                                    gap: '10px',
                                                    marginTop: '15px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Trades</div>
                                                        <div style={{ color: theme.text.primary, fontWeight: '600' }}>
                                                            {asset.total_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Winners</div>
                                                        <div style={{ color: theme.accent.green, fontWeight: '600' }}>
                                                            {asset.winning_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Losers</div>
                                                        <div style={{ color: theme.accent.red, fontWeight: '600' }}>
                                                            {asset.losing_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: theme.text.tertiary }}>Win Rate</div>
                                                        <div style={{ color: theme.accent.cyan, fontWeight: '600' }}>
                                                            {asset.win_rate}%
                                                        </div>
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