import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

// Component styles
const styles = {
  container: {
    width: '100%',
    minHeight: '100vh'
  },
  mainBodyInfo: {
    width: '100%',
    maxWidth: 'none', // Remove max width restriction
    boxSizing: 'border-box'
  },
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
    border: '1px solid rgba(226, 232, 240, 0.8)',
    width: '100%',
    boxSizing: 'border-box'
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
    width: '100%',
    boxSizing: 'border-box'
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
    const [realTimeData, setRealTimeData] = useState([]);
    
    // Store base data to maintain consistency
    const [baseDataCache, setBaseDataCache] = useState({});

    // Timeframe configurations
    const timeframes = {
        '1M': { label: '1 Minute', minutes: 1, dataPoints: 100 },
        '5M': { label: '5 Minutes', minutes: 5, dataPoints: 100 },
        '15M': { label: '15 Minutes', minutes: 15, dataPoints: 100 },
        '1H': { label: '1 Hour', minutes: 60, dataPoints: 100 },
        '4H': { label: '4 Hours', minutes: 240, dataPoints: 100 },
        '1D': { label: '1 Day', minutes: 1440, dataPoints: 100 },
        '1W': { label: '1 Week', minutes: 10080, dataPoints: 52 }
    };

    // Asset classes configuration with realistic base prices
    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', basePrice: 67420.50 },
            { symbol: 'ETHUSD', name: 'Ethereum', basePrice: 3245.80 },
            { symbol: 'ADAUSD', name: 'Cardano', basePrice: 0.3642 },
            { symbol: 'SOLUSD', name: 'Solana', basePrice: 158.94 }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', basePrice: 1.0923 },
            { symbol: 'GBPUSD', name: 'GBP/USD', basePrice: 1.2645 },
            { symbol: 'USDJPY', name: 'USD/JPY', basePrice: 149.82 },
            { symbol: 'AUDUSD', name: 'AUD/USD', basePrice: 0.6698 }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 227.52 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 166.89 },
            { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 248.98 },
            { symbol: 'MSFT', name: 'Microsoft', basePrice: 418.34 }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', basePrice: 2654.80 },
            { symbol: 'XAGUSD', name: 'Silver', basePrice: 31.24 },
            { symbol: 'USOIL', name: 'US Oil', basePrice: 68.72 },
            { symbol: 'UKOIL', name: 'UK Oil', basePrice: 72.15 }
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
                // Try multiple CDN sources for better reliability
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
                                // Wait a bit for the library to initialize
                                setTimeout(() => {
                                    if (window.LightweightCharts && window.LightweightCharts.createChart) {
                                        loaded = true;
                                        setTvLoaded(true);
                                        resolve();
                                    } else {
                                        console.warn('Library loaded but createChart not available');
                                        reject();
                                    }
                                }, 500);
                            };
                            script.onerror = () => {
                                console.warn(`Failed to load from: ${src}`);
                                reject();
                            };
                            document.head.appendChild(script);
                        });
                    } catch (e) {
                        console.warn(`CDN ${src} failed, trying next...`);
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
        return { symbol: selectedAsset, name: selectedAsset, basePrice: 100 };
    };

    // Generate base market data (consistent seed-based data)
    const generateBaseMarketData = (symbol, basePrice) => {
        // Use symbol as seed for consistent data
        const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Simple seeded random function
        const seededRandom = (index) => {
            const x = Math.sin(seed + index) * 10000;
            return x - Math.floor(x);
        };

        const data = [];
        let currentPrice = basePrice;
        const now = Date.now();
        
        // Generate 500 points of base data (enough for all timeframes)
        for (let i = 0; i < 500; i++) {
            // Create more realistic price movement
            const trendFactor = Math.sin(i / 20) * 0.02; // Long-term trend
            const volatility = (seededRandom(i) - 0.5) * 0.025; // Random volatility
            const momentum = (seededRandom(i + 100) - 0.5) * 0.01; // Momentum
            
            currentPrice *= (1 + trendFactor + volatility + momentum);
            
            const open = currentPrice * (1 + (seededRandom(i + 200) - 0.5) * 0.005);
            const close = open * (1 + (seededRandom(i + 300) - 0.5) * 0.015);
            const high = Math.max(open, close) * (1 + seededRandom(i + 400) * 0.012);
            const low = Math.min(open, close) * (1 - seededRandom(i + 500) * 0.012);
            
            data.push({
                time: Math.floor((now - (500 - i) * 60000) / 1000), // 1 minute intervals
                open: Math.max(0.01, parseFloat(open.toFixed(6))),
                high: Math.max(0.01, parseFloat(high.toFixed(6))),
                low: Math.max(0.01, parseFloat(low.toFixed(6))),
                close: Math.max(0.01, parseFloat(close.toFixed(6))),
                value: Math.max(0.01, parseFloat(close.toFixed(6)))
            });
        }
        
        return data;
    };

    // Get cached base data or generate new
    const getBaseData = (symbol) => {
        if (!baseDataCache[symbol]) {
            const assetInfo = getCurrentAssetInfo();
            const baseData = generateBaseMarketData(symbol, assetInfo.basePrice);
            setBaseDataCache(prev => ({
                ...prev,
                [symbol]: baseData
            }));
            return baseData;
        }
        return baseDataCache[symbol];
    };

    // Aggregate data based on timeframe
    const aggregateDataForTimeframe = (baseData, timeframeKey) => {
        const timeframeConfig = timeframes[timeframeKey];
        const intervalMs = timeframeConfig.minutes * 60 * 1000;
        const intervalSeconds = timeframeConfig.minutes * 60;
        
        const aggregated = [];
        const dataPoints = timeframeConfig.dataPoints;
        
        // Group base data by timeframe intervals
        for (let i = 0; i < dataPoints; i++) {
            const startTime = Math.floor((Date.now() - (dataPoints - i) * intervalMs) / 1000);
            const endTime = startTime + intervalSeconds;
            
            // Find all base data points in this interval
            const intervalData = baseData.filter(point => 
                point.time >= startTime && point.time < endTime
            );
            
            if (intervalData.length > 0) {
                // Aggregate OHLC data
                const open = intervalData[0].open;
                const close = intervalData[intervalData.length - 1].close;
                const high = Math.max(...intervalData.map(d => d.high));
                const low = Math.min(...intervalData.map(d => d.low));
                
                aggregated.push({
                    time: startTime,
                    open: parseFloat(open.toFixed(6)),
                    high: parseFloat(high.toFixed(6)),
                    low: parseFloat(low.toFixed(6)),
                    close: parseFloat(close.toFixed(6)),
                    value: parseFloat(close.toFixed(6))
                });
            } else {
                // If no data in interval, use previous close or base price
                const prevClose = aggregated.length > 0 ? 
                    aggregated[aggregated.length - 1].close : 
                    getCurrentAssetInfo().basePrice;
                
                aggregated.push({
                    time: startTime,
                    open: parseFloat(prevClose.toFixed(6)),
                    high: parseFloat(prevClose.toFixed(6)),
                    low: parseFloat(prevClose.toFixed(6)),
                    close: parseFloat(prevClose.toFixed(6)),
                    value: parseFloat(prevClose.toFixed(6))
                });
            }
        }
        
        return aggregated;
    };

    // Real-time data simulation
    useEffect(() => {
        const updateInterval = Math.max(3000, timeframes[timeframe].minutes * 1000); // Slower updates
        
        const interval = setInterval(() => {
            const baseData = getBaseData(selectedAsset);
            if (baseData.length === 0) return;
            
            const assetInfo = getCurrentAssetInfo();
            const lastPrice = baseData[baseData.length - 1]?.close || assetInfo.basePrice;
            
            // More realistic price movement
            const volatilityFactor = assetInfo.symbol.includes('USD') ? 0.001 : 0.002;
            const change = (Math.random() - 0.5) * volatilityFactor;
            const newPrice = lastPrice * (1 + change);
            const changePercent = ((newPrice - assetInfo.basePrice) / assetInfo.basePrice) * 100;
            
            setCurrentPrice(newPrice);
            setPriceChange(changePercent);
            
            // Update real-time data less frequently
            if (realTimeData.length < 5) {
                const newDataPoint = {
                    time: Math.floor(Date.now() / 1000),
                    open: lastPrice,
                    high: Math.max(lastPrice, newPrice) * (1 + Math.random() * 0.001),
                    low: Math.min(lastPrice, newPrice) * (1 - Math.random() * 0.001),
                    close: newPrice,
                    value: newPrice
                };
                
                setRealTimeData(prev => [...prev, newDataPoint]);
            }
            
        }, updateInterval);
        
        return () => clearInterval(interval);
    }, [selectedAsset, timeframe, baseDataCache]);

    // Initialize TradingView Chart
    const initTradingViewChart = () => {
        if (!tvLoaded || !window.LightweightCharts || !chartContainerRef.current) return;

        setIsLoading(true);

        try {
            // Clear previous chart
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            chartContainerRef.current.innerHTML = '';

            // Create chart with proper API
            const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: window.innerWidth <= 768 ? 450 : 600, // Increased mobile height
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
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            // Get consistent data
            const baseData = getBaseData(selectedAsset);
            const marketData = aggregateDataForTimeframe(baseData, timeframe);
            
            // Set current price from latest data
            const latestPrice = marketData[marketData.length - 1]?.close || getCurrentAssetInfo().basePrice;
            setCurrentPrice(latestPrice);

            let series;
            
            if (chartType === 'candlestick') {
                // Create candlestick series using proper API
                series = chart.addCandlestickSeries({
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    borderVisible: false,
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350',
                });

                // Convert data format for candlestick
                const candlestickData = marketData.map(d => ({
                    time: d.time,
                    open: parseFloat(d.open.toFixed(6)),
                    high: parseFloat(d.high.toFixed(6)),
                    low: parseFloat(d.low.toFixed(6)),
                    close: parseFloat(d.close.toFixed(6))
                }));

                series.setData(candlestickData);
            } else {
                // Create line series using proper API
                series = chart.addLineSeries({
                    color: '#667eea',
                    lineWidth: 3,
                });

                // Convert data format for line chart
                const lineData = marketData.map(d => ({
                    time: d.time,
                    value: parseFloat(d.value.toFixed(6))
                }));

                series.setData(lineData);
            }

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current) {
                    chart.applyOptions({ 
                        width: chartContainerRef.current.clientWidth,
                        height: window.innerWidth <= 768 ? 450 : 600
                    });
                }
            };

            window.addEventListener('resize', handleResize);
            
            // Store chart reference
            chartRef.current = {
                chart,
                series,
                destroy: () => {
                    try {
                        window.removeEventListener('resize', handleResize);
                        chart.remove();
                    } catch (e) {
                        console.warn('Error destroying chart:', e);
                    }
                }
            };

            console.log('TradingView chart initialized successfully!');
            
        } catch (error) {
            console.error('Error initializing TradingView chart:', error);
            // Fallback: create a simple canvas chart
            createFallbackChart();
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback chart using HTML5 Canvas
    const createFallbackChart = () => {
        if (!chartContainerRef.current) return;
        
        chartContainerRef.current.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = chartContainerRef.current.clientWidth || 800;
        canvas.height = window.innerWidth <= 768 ? 450 : 600;
        canvas.style.width = '100%';
        canvas.style.height = (window.innerWidth <= 768 ? 450 : 600) + 'px';
        chartContainerRef.current.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const baseData = getBaseData(selectedAsset);
        const data = aggregateDataForTimeframe(baseData, timeframe);
        
        // Simple fallback chart rendering
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const minPrice = Math.min(...data.map(d => d.low));
        const maxPrice = Math.max(...data.map(d => d.high));
        const priceRange = maxPrice - minPrice;
        
        data.forEach((point, i) => {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            const y = padding + (1 - (point.close - minPrice) / priceRange) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add title
        ctx.fillStyle = '#1e293b';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${getCurrentAssetInfo().name} (Fallback Chart)`, canvas.width / 2, 30);
        
        // Add note
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Chart library loading... This is a temporary fallback', canvas.width / 2, canvas.height - 20);
    };

    // Update chart when dependencies change
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        // Reset real-time data when switching assets or timeframes
        setRealTimeData([]);
        
        if (tvLoaded) {
            initTradingViewChart();
        }
        
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [selectedAsset, chartType, timeframe, tvLoaded]);

    // Update real-time data on existing chart
    useEffect(() => {
        if (chartRef.current && realTimeData.length > 0) {
            const lastDataPoint = realTimeData[realTimeData.length - 1];
            
            if (chartType === 'candlestick') {
                chartRef.current.series.update({
                    time: lastDataPoint.time,
                    open: parseFloat(lastDataPoint.open.toFixed(6)),
                    high: parseFloat(lastDataPoint.high.toFixed(6)),
                    low: parseFloat(lastDataPoint.low.toFixed(6)),
                    close: parseFloat(lastDataPoint.close.toFixed(6))
                });
            } else {
                chartRef.current.series.update({
                    time: lastDataPoint.time,
                    value: parseFloat(lastDataPoint.value.toFixed(6))
                });
            }
        }
    }, [realTimeData]);

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
                    
                    /* Full width layout styles */
                    .main-page-body {
                        width: 100% !important;
                        max-width: none !important;
                    }
                    
                    .main-body-info {
                        width: 100% !important;
                        max-width: none !important;
                        margin-left: 0 !important;
                    }
                    
                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        .main-body-info {
                            padding: 0 10px !important;
                        }
                        
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
                        
                        .price-display {
                            flex-direction: column !important;
                            gap: 15px !important;
                            text-align: center !important;
                        }
                        
                        .real-time-indicator {
                            justify-content: center !important;
                        }
                    }
                    
                    @media (min-width: 769px) {
                        .main-body-info {
                            padding: 0 30px !important;
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
                        ⚡ SnowAI Trading Charts
                    </div>
                    
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
                                    {category === 'Crypto' ? '₿' : category === 'Forex' ? '💱' : 
                                     category === 'Stocks' ? '📊' : '🥇'} {category}
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
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {isLoading && tvLoaded && (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingSpinner}></div>
                            <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                                Loading {getCurrentAssetInfo().name} chart ({timeframes[timeframe].label})...
                            </span>
                        </div>
                    )}

                    {/* Price Display */}
                    {!isLoading && tvLoaded && (
                        <div style={styles.priceDisplay} className="price-display">
                            <div>
                                <div style={styles.currentPrice} className="current-price">
                                    ${currentPrice.toLocaleString(undefined, { 
                                        minimumFractionDigits: getCurrentAssetInfo().basePrice < 1 ? 4 : 2, 
                                        maximumFractionDigits: getCurrentAssetInfo().basePrice < 1 ? 6 : 2 
                                    })}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    {getCurrentAssetInfo().name} • {timeframes[timeframe].label}
                                </div>
                            </div>
                            <div style={styles.realTimeIndicator} className="real-time-indicator">
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
                    {!isLoading && tvLoaded && (
                        <div style={styles.chartContainer} className="chart-container">
                            <div style={styles.chartTitle} className="chart-title">
                                {getCurrentAssetInfo().name} ({selectedAsset}) - {chartType === 'candlestick' ? 'Candlestick' : 'Line'} Chart - {timeframes[timeframe].label}
                            </div>
                            
                            <div 
                                ref={chartContainerRef}
                                style={{ 
                                    width: '100%', 
                                    height: window.innerWidth <= 768 ? '450px' : '600px', 
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    )}

                    {/* Chart Instructions */}
                    <div style={styles.instructionsCard}>
                        <div style={styles.instructionsTitle}>🎮 Chart Controls & Features</div>
                        <ul style={styles.instructionsList}>
                            <li style={styles.instructionItem}>🔍 <strong>Zoom:</strong> Mouse wheel or pinch to zoom in/out</li>
                            <li style={styles.instructionItem}>👆 <strong>Pan:</strong> Click and drag to move around the chart</li>
                            <li style={styles.instructionItem}>📊 <strong>Crosshair:</strong> Hover over the chart to see price and time details</li>
                            <li style={styles.instructionItem}>📈 <strong>Consistent Data:</strong> Realistic market data that stays consistent across timeframes</li>
                            <li style={styles.instructionItem}>💹 <strong>Asset Switching:</strong> Click any asset button to analyze different instruments</li>
                            <li style={styles.instructionItem}>🕯️ <strong>Chart Types:</strong> Switch between professional candlestick and line views</li>
                            <li style={styles.instructionItem}>⏰ <strong>Timeframes:</strong> Select from 1M to 1W intervals for different perspectives</li>
                            <li style={styles.instructionItem}>⚡ <strong>Full Width:</strong> Charts now utilize the full screen width on laptops</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}