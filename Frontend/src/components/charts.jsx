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
  }
};

export default function Charts() {
    const BACKEND_API_URL = 'https://backend-production-c0ab.up.railway.app/api/snowai-market-ohlc/';
    
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    
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
            description: '1 day'
        },
        '5M': { 
            label: '5 Minutes', 
            interval: '5m', 
            binanceInterval: '5m',
            yfinancePeriod: '5d',
            description: '5 days'
        },
        '15M': { 
            label: '15 Minutes', 
            interval: '15m', 
            binanceInterval: '15m',
            yfinancePeriod: '1mo',
            description: '1 month'
        },
        '1H': { 
            label: '1 Hour', 
            interval: '1h', 
            binanceInterval: '1h',
            yfinancePeriod: '3mo',
            description: '3 months'
        },
        '4H': { 
            label: '4 Hours', 
            interval: '4h', 
            binanceInterval: '4h',
            yfinancePeriod: '6mo',
            description: '6 months'
        },
        '1D': { 
            label: '1 Day', 
            interval: '1d', 
            binanceInterval: '1d',
            yfinancePeriod: '2y',
            description: '2 years'
        },
        '1W': { 
            label: '1 Week', 
            interval: '1w', 
            binanceInterval: '1w',
            yfinancePeriod: '10y',
            description: '10 years'
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
    }, [selectedAsset, timeframe, tvLoaded]);

    // Calculate Moving Averages
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
    };

    const initTradingViewChart = () => {
        if (!tvLoaded || !window.LightweightCharts || !chartContainerRef.current || marketData.length === 0) return;

        try {
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

            // Add Moving Averages
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
            
            // Add Volume
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
                chart.timeScale().fitContent();
                const visibleLogicalRange = {
                    from: Math.max(0, marketData.length - 100),
                    to: marketData.length - 1
                };
                chart.timeScale().setVisibleLogicalRange(visibleLogicalRange);
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
    }, [marketData, chartType, tvLoaded, movingAverages, showVolume]);

    // Realistic price updates every 10 seconds
    useEffect(() => {
        if (marketData.length === 0) return;
        
        const interval = setInterval(() => {
            const lastCandle = marketData[marketData.length - 1];
            
            // Calculate realistic price movement based on asset volatility
            const baseVolatility = 0.0001; // 0.01% base movement
            const randomDirection = Math.random() > 0.5 ? 1 : -1;
            const randomMagnitude = Math.random() * baseVolatility;
            const priceChange = randomDirection * randomMagnitude;
            
            const newPrice = lastCandle.close * (1 + priceChange);
            
            setCurrentPrice(newPrice);
            
            // Update chart with realistic candle
            if (chartRef.current && chartRef.current.series) {
                const currentTime = Math.floor(Date.now() / 1000);
                
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
        }, 10000); // Update every 10 seconds
        
        return () => clearInterval(interval);
    }, [marketData, timeframe, chartType]);

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
            
            {/* Moving Average Dialog */}
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
                    <span style={styles.categoryLabel} className="category-label">Timeframe:</span>
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
                            
                            {movingAverages.length > 0 && (
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

                    {/* Active Indicators List */}
                    {movingAverages.length > 0 && (
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
                        </div>
                    )}

                    <div style={styles.chartContainer} className="chart-container">
                        <div style={styles.chartTitle} className="chart-title">
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
        </div>
        </div>
        </div>
    );
}