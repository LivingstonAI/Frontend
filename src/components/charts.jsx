import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// Dark theme color palette with blue accents
const darkTheme = {
  bg: {
    primary: '#0a0e1a',
    secondary: '#121827',
    tertiary: '#1a2234',
    elevated: '#1e2740',
    modal: '#0f1421'
  },
  blue: {
    50: '#e6f1ff',
    100: '#b3d9ff',
    200: '#80c1ff',
    300: '#4da9ff',
    400: '#1a91ff',
    500: '#0077e6',
    600: '#005db3',
    700: '#004380',
    800: '#00294d',
    900: '#000f1a'
  },
  accent: {
    cyan: '#00d4ff',
    purple: '#a78bfa',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    pink: '#ec4899'
  },
  text: {
    primary: '#e5e7eb',
    secondary: '#9ca3af',
    tertiary: '#6b7280',
    muted: '#4b5563'
  },
  border: {
    light: '#1f2937',
    medium: '#374151',
    heavy: '#4b5563'
  }
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${darkTheme.bg.primary} 0%, ${darkTheme.bg.secondary} 100%)`,
    color: darkTheme.text.primary
  },
  mainContainer: {
    width: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: '0 20px'
  },
  header: {
    background: `linear-gradient(135deg, ${darkTheme.blue[700]} 0%, ${darkTheme.blue[900]} 100%)`,
    color: 'white',
    padding: '25px',
    borderRadius: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '2.2rem',
    fontWeight: '800',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    boxShadow: `0 20px 50px rgba(0, 119, 230, 0.3)`,
    border: `2px solid ${darkTheme.blue[600]}`
  },
  tradingModeSelector: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
    alignItems: 'center',
    background: darkTheme.bg.elevated,
    padding: '20px',
    borderRadius: '15px',
    border: `1px solid ${darkTheme.border.medium}`
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
    background: `linear-gradient(135deg, ${darkTheme.blue[500]} 0%, ${darkTheme.blue[700]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${darkTheme.blue[500]}40`
  },
  modeButtonInactive: {
    background: darkTheme.bg.tertiary,
    color: darkTheme.text.secondary,
    border: `2px solid ${darkTheme.border.medium}`
  },
  controlPanel: {
    background: darkTheme.bg.elevated,
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${darkTheme.border.medium}`
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: darkTheme.blue[300],
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  assetClassSection: {
    marginBottom: '20px'
  },
  assetClassTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: darkTheme.blue[400],
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  assetButton: {
    margin: '5px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  assetButtonActive: {
    background: `linear-gradient(135deg, ${darkTheme.blue[500]} 0%, ${darkTheme.blue[700]} 100%)`,
    color: 'white',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `0 8px 20px ${darkTheme.blue[500]}60`
  },
  assetButtonInactive: {
    background: darkTheme.bg.tertiary,
    color: darkTheme.text.secondary,
    border: `2px solid ${darkTheme.border.light}`
  },
  chartContainer: {
    background: darkTheme.bg.elevated,
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
    border: `1px solid ${darkTheme.border.medium}`,
    marginBottom: '25px'
  },
  chartTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: darkTheme.text.primary,
    marginBottom: '20px',
    textAlign: 'center'
  },
  priceDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${darkTheme.bg.tertiary} 0%, ${darkTheme.bg.secondary} 100%)`,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: `1px solid ${darkTheme.border.medium}`
  },
  currentPrice: {
    fontSize: '2rem',
    fontWeight: '800',
    color: darkTheme.blue[300]
  },
  tradePanel: {
    background: darkTheme.bg.elevated,
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${darkTheme.border.medium}`
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: darkTheme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '14px',
    background: darkTheme.bg.tertiary,
    border: `2px solid ${darkTheme.border.medium}`,
    borderRadius: '10px',
    color: darkTheme.text.primary,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '14px',
    background: darkTheme.bg.tertiary,
    border: `2px solid ${darkTheme.border.medium}`,
    borderRadius: '10px',
    color: darkTheme.text.primary,
    fontSize: '1rem',
    cursor: 'pointer',
    outline: 'none'
  },
  buttonPrimary: {
    width: '100%',
    padding: '16px',
    background: `linear-gradient(135deg, ${darkTheme.blue[500]} 0%, ${darkTheme.blue[700]} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: `0 8px 20px ${darkTheme.blue[500]}40`
  },
  buttonSecondary: {
    width: '100%',
    padding: '14px',
    background: darkTheme.bg.tertiary,
    color: darkTheme.text.primary,
    border: `2px solid ${darkTheme.border.medium}`,
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase'
  },
  tradeHistoryContainer: {
    background: darkTheme.bg.elevated,
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${darkTheme.border.medium}`
  },
  tradeCard: {
    background: darkTheme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: `1px solid ${darkTheme.border.medium}`,
    transition: 'all 0.3s ease'
  },
  tradeCardWin: {
    borderLeft: `5px solid ${darkTheme.accent.green}`,
    background: `${darkTheme.accent.green}10`
  },
  tradeCardLoss: {
    borderLeft: `5px solid ${darkTheme.accent.red}`,
    background: `${darkTheme.accent.red}10`
  },
  statCard: {
    background: darkTheme.bg.tertiary,
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: `1px solid ${darkTheme.border.medium}`
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: darkTheme.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  searchBar: {
    width: '100%',
    padding: '16px',
    background: darkTheme.bg.tertiary,
    border: `2px solid ${darkTheme.border.medium}`,
    borderRadius: '12px',
    color: darkTheme.text.primary,
    fontSize: '1rem',
    marginBottom: '20px',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: darkTheme.bg.modal,
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: `2px solid ${darkTheme.border.heavy}`
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: `4px solid ${darkTheme.border.medium}`,
    borderTop: `4px solid ${darkTheme.blue[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '20px auto'
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
  badgeOpen: {
    background: darkTheme.blue[500],
    color: 'white'
  },
  badgeClosed: {
    background: darkTheme.bg.tertiary,
    color: darkTheme.text.secondary
  },
  badgeWin: {
    background: darkTheme.accent.green,
    color: 'white'
  },
  badgeLoss: {
    background: darkTheme.accent.red,
    color: 'white'
  },
  timeframeContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap'
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
    background: `linear-gradient(135deg, ${darkTheme.accent.orange} 0%, #d97706 100%)`,
    color: 'white',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
  },
  timeframeButtonInactive: {
    background: darkTheme.bg.tertiary,
    color: darkTheme.text.secondary,
    border: `1px solid ${darkTheme.border.light}`
  },
  chartOverlay: {
    position: 'absolute',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    pointerEvents: 'none',
    zIndex: 10
  },
  overlayWin: {
    background: `${darkTheme.accent.green}dd`,
    color: 'white',
    border: `2px solid ${darkTheme.accent.green}`
  },
  overlayLoss: {
    background: `${darkTheme.accent.red}dd`,
    color: 'white',
    border: `2px solid ${darkTheme.accent.red}`
  }
};

export default function TradingTerminal() {
    const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app';
    
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const backtestIntervalRef = useRef(null);
    
    const [tradingMode, setTradingMode] = useState('LIVE'); // LIVE or BACKTEST
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
    const [orderType, setOrderType] = useState('BUY');
    const [quantity, setQuantity] = useState(1);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [tradeNotes, setTradeNotes] = useState('');
    
    // Trade history states
    const [tradeHistory, setTradeHistory] = useState([]);
    const [showTradeHistory, setShowTradeHistory] = useState(false);
    const [tradeStats, setTradeStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Overall performance states
    const [showOverallPerformance, setShowOverallPerformance] = useState(false);
    const [overallStats, setOverallStats] = useState(null);
    const [assetClassStats, setAssetClassStats] = useState({});
    const [assetBreakdown, setAssetBreakdown] = useState([]);
    const [sortBy, setSortBy] = useState('net_profit');
    const [sortOrder, setSortOrder] = useState('desc');
    
    // Backtest states
    const [backtestMode, setBacktestMode] = useState(false);
    const [backtestSession, setBacktestSession] = useState(null);
    const [backtestSpeed, setBacktestSpeed] = useState(2); // seconds per candle
    const [backtestCurrentIndex, setBacktestCurrentIndex] = useState(0);
    const [backtestBalance, setBacktestBalance] = useState(10000);
    const [backtestTrades, setBacktestTrades] = useState([]);
    const [backtestPaused, setBacktestPaused] = useState(false);
    
    // Open positions
    const [openPositions, setOpenPositions] = useState([]);

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

    // Get current asset info
    const getCurrentAssetInfo = () => {
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        return { symbol: selectedAsset, name: selectedAsset, assetClass: 'Unknown' };
    };

    useEffect(() => {
        setSelectedAssetInfo(getCurrentAssetInfo());
    }, [selectedAsset]);

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
        if (tvLoaded && tradingMode === 'LIVE') {
            fetchMarketData();
            
            const interval = setInterval(() => {
                fetchMarketData();
            }, timeframes[timeframe].updateInterval);
            
            return () => clearInterval(interval);
        }
    }, [selectedAsset, timeframe, tvLoaded, tradingMode]);

    // Initialize chart
    useEffect(() => {
        if (!tvLoaded || !chartContainerRef.current || marketData.length === 0) return;

        try {
            if (chartRef.current) {
                chartRef.current.remove();
            }
            chartContainerRef.current.innerHTML = '';

            const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 600,
                layout: {
                    background: { type: 'solid', color: darkTheme.bg.tertiary },
                    textColor: darkTheme.text.secondary,
                },
                grid: {
                    vertLines: { color: darkTheme.border.light },
                    horzLines: { color: darkTheme.border.light },
                },
                crosshair: {
                    mode: window.LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: darkTheme.border.medium,
                },
                timeScale: {
                    borderColor: darkTheme.border.medium,
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            let mainSeries;
            
            if (chartType === 'candlestick') {
                mainSeries = chart.addCandlestickSeries({
                    upColor: darkTheme.accent.green,
                    downColor: darkTheme.accent.red,
                    borderVisible: false,
                    wickUpColor: darkTheme.accent.green,
                    wickDownColor: darkTheme.accent.red,
                });
                mainSeries.setData(marketData);
            } else {
                mainSeries = chart.addLineSeries({
                    color: darkTheme.blue[400],
                    lineWidth: 3,
                });
                mainSeries.setData(marketData.map(d => ({ time: d.time, value: d.close })));
            }

            // Add trade markers
            if (tradeHistory.length > 0) {
                const markers = [];
                tradeHistory.forEach(trade => {
                    const entryTime = Math.floor(new Date(trade.entry_timestamp).getTime() / 1000);
                    
                    markers.push({
                        time: entryTime,
                        position: trade.order_type === 'BUY' ? 'belowBar' : 'aboveBar',
                        color: trade.order_type === 'BUY' ? darkTheme.accent.green : darkTheme.accent.red,
                        shape: trade.order_type === 'BUY' ? 'arrowUp' : 'arrowDown',
                        text: `${trade.order_type} @ ${trade.entry_price}`
                    });
                    
                    if (trade.exit_timestamp) {
                        const exitTime = Math.floor(new Date(trade.exit_timestamp).getTime() / 1000);
                        markers.push({
                            time: exitTime,
                            position: trade.order_type === 'BUY' ? 'aboveBar' : 'belowBar',
                            color: trade.profit_loss > 0 ? darkTheme.accent.green : darkTheme.accent.red,
                            shape: 'circle',
                            text: `EXIT: ${trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss?.toFixed(2)}`
                        });
                    }
                });
                mainSeries.setMarkers(markers);
            }

            chart.timeScale().fitContent();
            chartRef.current = chart;

        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, [marketData, chartType, tvLoaded, tradeHistory]);

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

    // Sort asset breakdown
    const sortAssetBreakdown = (data) => {
        return [...data].sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return multiplier * (a[sortBy] - b[sortBy]);
        });
    };

    // Start backtest
    const startBacktest = async () => {
        setBacktestMode(true);
        setBacktestCurrentIndex(0);
        setBacktestBalance(10000);
        setBacktestTrades([]);
        setBacktestPaused(false);
        
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

    // Backtest loop
    useEffect(() => {
        if (backtestMode && !backtestPaused && backtestCurrentIndex < marketData.length) {
            backtestIntervalRef.current = setTimeout(() => {
                const currentCandle = marketData[backtestCurrentIndex];
                setCurrentPrice(currentCandle.close);
                setBacktestCurrentIndex(prev => prev + 1);
                
                // Auto check stop loss / take profit
                // (simplified - you'd implement actual logic here)
                
            }, backtestSpeed * 1000);
        }
        
        return () => {
            if (backtestIntervalRef.current) {
                clearTimeout(backtestIntervalRef.current);
            }
        };
    }, [backtestMode, backtestPaused, backtestCurrentIndex, backtestSpeed, marketData]);

    const filteredAssets = Object.entries(assetClasses).reduce((acc, [category, assets]) => {
        const filtered = assets.filter(asset => 
            asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {});

    return (
        <div style={styles.pageContainer}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    ${styles.input}:focus {
                        border-color: ${darkTheme.blue[500]};
                        box-shadow: 0 0 0 3px ${darkTheme.blue[500]}30;
                    }
                    
                    ${styles.searchBar}:focus {
                        border-color: ${darkTheme.blue[500]};
                        box-shadow: 0 0 0 3px ${darkTheme.blue[500]}30;
                    }
                    
                    .asset-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0, 119, 230, 0.3);
                    }
                    
                    .button-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 12px 28px ${darkTheme.blue[500]}60;
                    }
                    
                    .trade-card:hover {
                        transform: translateX(5px);
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
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
                            background: `${darkTheme.accent.red}20`,
                            border: `2px solid ${darkTheme.accent.red}`,
                            color: darkTheme.accent.red,
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={styles.controlPanel}>
                        <div style={styles.sectionTitle}>
                            🎯 Select Asset
                        </div>
                        
                        <input
                            type="text"
                            placeholder="🔍 Search assets..."
                            style={styles.searchBar}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        
                        {Object.entries(filteredAssets).map(([category, assets]) => (
                            <div key={category} style={styles.assetClassSection}>
                                <div style={styles.assetClassTitle}>{category}</div>
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
                        
                        <div style={styles.timeframeContainer}>
                            <span style={styles.assetClassTitle}>⏰ Timeframe:</span>
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
                            <p style={{ color: darkTheme.text.secondary, marginTop: '20px' }}>
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
                                    <div style={{ color: darkTheme.text.secondary, fontSize: '1.1rem' }}>
                                        {selectedAssetInfo?.name} • {timeframes[timeframe].label}
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    color: priceChange >= 0 ? darkTheme.accent.green : darkTheme.accent.red
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
                                
                                {backtestMode && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '15px',
                                        background: darkTheme.bg.tertiary,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong style={{ color: darkTheme.blue[400] }}>Backtest Progress:</strong>{' '}
                                            {backtestCurrentIndex} / {marketData.length} candles
                                        </div>
                                        <div>
                                            <strong style={{ color: darkTheme.blue[400] }}>Balance:</strong>{' '}
                                            ${backtestBalance.toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => setBacktestPaused(!backtestPaused)}
                                            style={{
                                                ...styles.buttonSecondary,
                                                width: 'auto',
                                                padding: '10px 20px'
                                            }}
                                        >
                                            {backtestPaused ? '▶️ Resume' : '⏸️ Pause'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div style={styles.tradePanel}>
                                <div style={styles.sectionTitle}>
                                    💼 Execute Trade
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
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
                                            placeholder="Enter stop loss price"
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
                                            placeholder="Enter take profit price"
                                            value={takeProfit}
                                            onChange={(e) => setTakeProfit(e.target.value)}
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Trade Notes (Optional)</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        placeholder="Add notes about this trade..."
                                        value={tradeNotes}
                                        onChange={(e) => setTradeNotes(e.target.value)}
                                    />
                                </div>
                                
                                <button
                                    className="button-primary"
                                    style={styles.buttonPrimary}
                                    onClick={executeTrade}
                                >
                                    {orderType === 'BUY' ? '🟢' : '🔴'} Execute {orderType} Order @ ${currentPrice.toFixed(2)}
                                </button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                                <button
                                    onClick={() => {
                                        setShowTradeHistory(true);
                                        fetchTradeHistory();
                                    }}
                                    style={{
                                        ...styles.buttonSecondary,
                                        background: `linear-gradient(135deg, ${darkTheme.blue[600]} 0%, ${darkTheme.blue[800]} 100%)`,
                                        color: 'white',
                                        border: 'none'
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
                                        background: `linear-gradient(135deg, ${darkTheme.accent.purple} 0%, #6d28d9 100%)`,
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    🏆 Overall Performance
                                </button>
                                
                                {tradingMode === 'BACKTEST' && !backtestMode && (
                                    <button
                                        onClick={startBacktest}
                                        style={{
                                            ...styles.buttonSecondary,
                                            background: `linear-gradient(135deg, ${darkTheme.accent.cyan} 0%, #0891b2 100%)`,
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        ⚡ Start Backtest
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                    
                    {showTradeHistory && (
                        <div style={styles.modal} onClick={() => setShowTradeHistory(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: darkTheme.blue[300], margin: 0 }}>
                                        📊 Trade History - {selectedAssetInfo?.name}
                                    </h2>
                                    <button
                                        onClick={() => setShowTradeHistory(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: darkTheme.text.primary,
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
                                            <div style={{ ...styles.statValue, color: darkTheme.blue[400] }}>
                                                {tradeStats.closed_trades}
                                            </div>
                                            <div style={styles.statLabel}>Closed Trades</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: darkTheme.accent.green }}>
                                                {tradeStats.winning_trades}
                                            </div>
                                            <div style={styles.statLabel}>Winners</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: darkTheme.accent.red }}>
                                                {tradeStats.losing_trades}
                                            </div>
                                            <div style={styles.statLabel}>Losers</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ ...styles.statValue, color: darkTheme.accent.cyan }}>
                                                {tradeStats.win_rate}%
                                            </div>
                                            <div style={styles.statLabel}>Win Rate</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{ 
                                                ...styles.statValue, 
                                                color: tradeStats.net_profit >= 0 ? darkTheme.accent.green : darkTheme.accent.red 
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
                                            className="trade-card"
                                            style={{
                                                ...styles.tradeCard,
                                                ...(trade.status === 'CLOSED' && trade.profit_loss > 0 ? styles.tradeCardWin : {}),
                                                ...(trade.status === 'CLOSED' && trade.profit_loss < 0 ? styles.tradeCardLoss : {})
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div>
                                                    <span style={{
                                                        ...styles.badge,
                                                        ...(trade.order_type === 'BUY' ? { background: darkTheme.accent.green, color: 'white' } : { background: darkTheme.accent.red, color: 'white' })
                                                    }}>
                                                        {trade.order_type}
                                                    </span>
                                                    <span style={{
                                                        ...styles.badge,
                                                        ...(trade.status === 'OPEN' ? styles.badgeOpen : styles.badgeClosed),
                                                        marginLeft: '10px'
                                                    }}>
                                                        {trade.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: darkTheme.text.tertiary }}>
                                                    {new Date(trade.entry_timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ color: darkTheme.text.tertiary, fontSize: '0.85rem' }}>Entry Price</div>
                                                    <div style={{ color: darkTheme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                        ${trade.entry_price}
                                                    </div>
                                                </div>
                                                {trade.exit_price && (
                                                    <div>
                                                        <div style={{ color: darkTheme.text.tertiary, fontSize: '0.85rem' }}>Exit Price</div>
                                                        <div style={{ color: darkTheme.text.primary, fontSize: '1.1rem', fontWeight: '600' }}>
                                                            ${trade.exit_price}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {trade.profit_loss !== null && (
                                                <div style={{
                                                    padding: '10px',
                                                    background: trade.profit_loss >= 0 ? `${darkTheme.accent.green}20` : `${darkTheme.accent.red}20`,
                                                    borderRadius: '8px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <div style={{ 
                                                        fontSize: '1.3rem', 
                                                        fontWeight: '800',
                                                        color: trade.profit_loss >= 0 ? darkTheme.accent.green : darkTheme.accent.red 
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
                                                        background: darkTheme.accent.red,
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
                    
                    {showOverallPerformance && overallStats && (
                        <div style={styles.modal} onClick={() => setShowOverallPerformance(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ color: darkTheme.blue[300], margin: 0 }}>
                                        🏆 Overall Trading Performance
                                    </h2>
                                    <button
                                        onClick={() => setShowOverallPerformance(false)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: darkTheme.text.primary,
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
                                        <div style={{ ...styles.statValue, color: darkTheme.blue[400] }}>
                                            {overallStats.total_trades}
                                        </div>
                                        <div style={styles.statLabel}>Total Trades</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: darkTheme.accent.green }}>
                                            {overallStats.winning_trades}
                                        </div>
                                        <div style={styles.statLabel}>Winners</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: darkTheme.accent.cyan }}>
                                            {overallStats.win_rate}%
                                        </div>
                                        <div style={styles.statLabel}>Win Rate</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ 
                                            ...styles.statValue, 
                                            color: overallStats.net_profit >= 0 ? darkTheme.accent.green : darkTheme.accent.red 
                                        }}>
                                            ${overallStats.net_profit.toFixed(2)}
                                        </div>
                                        <div style={styles.statLabel}>Net P&L</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{ ...styles.statValue, color: darkTheme.accent.purple }}>
                                            {overallStats.profit_factor}
                                        </div>
                                        <div style={styles.statLabel}>Profit Factor</div>
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: darkTheme.blue[400], marginBottom: '15px' }}>
                                        Asset Class Breakdown
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                        {Object.entries(assetClassStats).map(([assetClass, stats]) => (
                                            <div key={assetClass} style={styles.statCard}>
                                                <h4 style={{ color: darkTheme.text.primary, marginBottom: '10px' }}>
                                                    {assetClass}
                                                </h4>
                                                <div style={{ fontSize: '0.9rem', color: darkTheme.text.secondary }}>
                                                    <div>Trades: {stats.total_trades}</div>
                                                    <div>Win Rate: {stats.win_rate}%</div>
                                                    <div style={{ 
                                                        color: stats.net_profit >= 0 ? darkTheme.accent.green : darkTheme.accent.red,
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h3 style={{ color: darkTheme.blue[400], margin: 0 }}>
                                            Per Asset Performance
                                        </h3>
                                        <select
                                            style={{ ...styles.select, width: 'auto', padding: '8px' }}
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="net_profit">Sort by P&L</option>
                                            <option value="win_rate">Sort by Win Rate</option>
                                            <option value="total_trades">Sort by Trades</option>
                                        </select>
                                    </div>
                                    
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {sortAssetBreakdown(assetBreakdown).map(asset => (
                                            <div key={asset.asset_symbol} style={styles.tradeCard}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4 style={{ color: darkTheme.text.primary, margin: '0 0 5px 0' }}>
                                                            {asset.asset_symbol} - {asset.asset_name}
                                                        </h4>
                                                        <span style={{ 
                                                            ...styles.badge,
                                                            background: darkTheme.bg.primary,
                                                            color: darkTheme.text.secondary
                                                        }}>
                                                            {asset.asset_class}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '1.5rem',
                                                        fontWeight: '800',
                                                        color: asset.net_profit >= 0 ? darkTheme.accent.green : darkTheme.accent.red
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
                                                        <div style={{ color: darkTheme.text.tertiary }}>Trades</div>
                                                        <div style={{ color: darkTheme.text.primary, fontWeight: '600' }}>
                                                            {asset.total_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: darkTheme.text.tertiary }}>Winners</div>
                                                        <div style={{ color: darkTheme.accent.green, fontWeight: '600' }}>
                                                            {asset.winning_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: darkTheme.text.tertiary }}>Losers</div>
                                                        <div style={{ color: darkTheme.accent.red, fontWeight: '600' }}>
                                                            {asset.losing_trades}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: darkTheme.text.tertiary }}>Win Rate</div>
                                                        <div style={{ color: darkTheme.accent.cyan, fontWeight: '600' }}>
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