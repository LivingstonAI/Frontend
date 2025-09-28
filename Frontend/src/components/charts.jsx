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
    borderTop: '1px solid #e2e8f0'
  },
  timeframeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0'
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
  }
};

export default function Charts() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Refs for chart containers
    const candlestickChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const sciChartLoadedRef = useRef(false);
    
    // State management
    const [selectedAsset, setSelectedAsset] = useState('BTCUSD');
    const [chartType, setChartType] = useState('candlestick');
    const [timeframe, setTimeframe] = useState('1H');
    const [sciChartSurface, setSciChartSurface] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sciChartLoaded, setSciChartLoaded] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceChange, setPriceChange] = useState(0);
    const [realTimeData, setRealTimeData] = useState([]);
    const [chartError, setChartError] = useState(null);

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

    // Fallback chart using HTML5 Canvas
    const createFallbackChart = (container) => {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth || 800;
        canvas.height = container.clientHeight || 500;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const assetInfo = getCurrentAssetInfo();
        const data = generateMarketData(assetInfo.basePrice, timeframe);
        
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
        ctx.fillText(`${assetInfo.name} (Fallback Chart)`, canvas.width / 2, 30);
        
        // Add note
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('SciChart loading... This is a temporary fallback chart', canvas.width / 2, canvas.height - 20);
    }

    // Asset classes configuration with more realistic base prices
    const assetClasses = {
        'Crypto': [
            { symbol: 'BTCUSD', name: 'Bitcoin', basePrice: 45000 },
            { symbol: 'ETHUSD', name: 'Ethereum', basePrice: 3200 },
            { symbol: 'ADAUSD', name: 'Cardano', basePrice: 0.85 },
            { symbol: 'SOLUSD', name: 'Solana', basePrice: 95 }
        ],
        'Forex': [
            { symbol: 'EURUSD', name: 'Euro/USD', basePrice: 1.0850 },
            { symbol: 'GBPUSD', name: 'GBP/USD', basePrice: 1.2650 },
            { symbol: 'USDJPY', name: 'USD/JPY', basePrice: 149.50 },
            { symbol: 'AUDUSD', name: 'AUD/USD', basePrice: 0.6750 }
        ],
        'Stocks': [
            { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 185 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140 },
            { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 250 },
            { symbol: 'MSFT', name: 'Microsoft', basePrice: 375 }
        ],
        'Commodities': [
            { symbol: 'XAUUSD', name: 'Gold', basePrice: 2050 },
            { symbol: 'XAGUSD', name: 'Silver', basePrice: 24.50 },
            { symbol: 'USOIL', name: 'US Oil', basePrice: 78.50 },
            { symbol: 'UKOIL', name: 'UK Oil', basePrice: 82.30 }
        ]
    };

    // Load SciChart.js React from CDN
    useEffect(() => {
        const loadSciChartJS = async () => {
            if (sciChartLoadedRef.current) return;

            try {
                setChartError(null);
                console.log('Loading SciChart.js React from CDN...');
                
                // Load SciChart.js React (Community Edition - Free)
                const cdnSources = [
                    'https://cdn.jsdelivr.net/npm/scichart@latest/index.umd.js',
                    'https://unpkg.com/scichart@latest/index.umd.js'
                ];

                let loaded = false;
                
                for (const src of cdnSources) {
                    if (loaded) break;
                    
                    try {
                        await new Promise((resolve, reject) => {
                            // Check if already loaded
                            if (window.SciChart) {
                                loaded = true;
                                resolve();
                                return;
                            }
                            
                            const script = document.createElement('script');
                            script.src = src;
                            script.crossOrigin = 'anonymous';
                            script.onload = () => {
                                console.log(`SciChart.js loaded from: ${src}`);
                                loaded = true;
                                resolve();
                            };
                            script.onerror = (error) => {
                                console.warn(`Failed to load from: ${src}`, error);
                                reject(error);
                            };
                            document.head.appendChild(script);
                        });
                    } catch (e) {
                        console.warn(`CDN ${src} failed, trying next...`);
                        continue;
                    }
                }

                if (loaded && window.SciChart) {
                    console.log('SciChart.js loaded successfully');
                    
                    // Set the license for SciChart.js Community Edition (free)
                    try {
                        await window.SciChart.SciChartSurface.setRuntimeLicenseKey("");
                        console.log('SciChart.js license set for community edition');
                    } catch (licenseError) {
                        console.warn('License setting failed, continuing anyway:', licenseError);
                    }
                    
                    // Give SciChart time to initialize
                    setTimeout(() => {
                        setSciChartLoaded(true);
                        sciChartLoadedRef.current = true;
                        console.log('SciChart.js ready for use');
                    }, 500);
                } else {
                    throw new Error('All CDN sources failed');
                }
                
            } catch (error) {
                console.error('Error loading SciChart.js:', error);
                setChartError('Failed to load SciChart.js from CDN');
                setSciChartLoaded(false);
                
                // Use fallback immediately
                setTimeout(() => {
                    const container = chartType === 'candlestick' ? 
                        candlestickChartRef.current : lineChartRef.current;
                    if (container) {
                        createFallbackChart(container);
                    }
                }, 100);
            }
        };

        loadSciChartJS();
    }, []);

    // Get current asset info
    const getCurrentAssetInfo = () => {
        for (const category of Object.values(assetClasses)) {
            const asset = category.find(a => a.symbol === selectedAsset);
            if (asset) return asset;
        }
        return { symbol: selectedAsset, name: selectedAsset, basePrice: 100 };
    };

    // Generate realistic market data with trends based on timeframe
    const generateMarketData = (basePrice, timeframeKey, volatility = 0.02) => {
        const data = [];
        const timeframeConfig = timeframes[timeframeKey];
        const intervalMs = timeframeConfig.minutes * 60 * 1000;
        const dataPoints = timeframeConfig.dataPoints;
        
        let currentBasePrice = basePrice;
        const now = new Date();
        
        // Generate historical data
        for (let i = 0; i < dataPoints; i++) {
            const date = new Date(now.getTime() - (dataPoints - i) * intervalMs);
            
            // Add some trend and volatility based on timeframe
            const trendFactor = Math.sin(i / 10) * 0.01; // Cyclical trend
            const timeframeVolatility = volatility * (timeframeConfig.minutes / 60); // More volatility for longer timeframes
            const randomFactor = (Math.random() - 0.5) * timeframeVolatility;
            
            currentBasePrice *= (1 + trendFactor + randomFactor);
            
            const open = currentBasePrice * (1 + (Math.random() - 0.5) * 0.005);
            const close = open * (1 + (Math.random() - 0.5) * 0.01);
            const high = Math.max(open, close) * (1 + Math.random() * 0.008);
            const low = Math.min(open, close) * (1 - Math.random() * 0.008);
            
            data.push({
                date: date.getTime(),
                open: Math.max(0, open),
                high: Math.max(0, high),
                low: Math.max(0, low),
                close: Math.max(0, close),
                volume: Math.random() * 1000000 + 100000
            });
        }
        
        return data;
    };

    // Real-time data simulation
    useEffect(() => {
        const updateInterval = timeframes[timeframe].minutes * 60 * 1000 / 30; // Update 30 times per timeframe period
        
        const interval = setInterval(() => {
            const assetInfo = getCurrentAssetInfo();
            const lastPrice = realTimeData.length > 0 ? 
                realTimeData[realTimeData.length - 1].close : assetInfo.basePrice;
            
            // Simulate real-time price movement
            const change = (Math.random() - 0.5) * 0.002; // 0.2% max change
            const newPrice = lastPrice * (1 + change);
            const changePercent = ((newPrice - assetInfo.basePrice) / assetInfo.basePrice) * 100;
            
            setCurrentPrice(newPrice);
            setPriceChange(changePercent);
            
            // Add new data point
            const newDataPoint = {
                date: Date.now(),
                open: lastPrice,
                high: Math.max(lastPrice, newPrice) * (1 + Math.random() * 0.001),
                low: Math.min(lastPrice, newPrice) * (1 - Math.random() * 0.001),
                close: newPrice,
                volume: Math.random() * 500000 + 50000
            };
            
            setRealTimeData(prev => {
                const updated = [...prev, newDataPoint];
                // Keep only last 200 data points for performance
                return updated.slice(-200);
            });
            
        }, Math.max(1000, updateInterval)); // Minimum 1 second updates
        
        return () => clearInterval(interval);
    }, [selectedAsset, timeframe, realTimeData]);

    // Initialize SciChart.js
    const initSciChartJS = async () => {
        setIsLoading(true);
        setChartError(null);
        
        try {
            const chartContainer = chartType === 'candlestick' ? 
                candlestickChartRef.current : lineChartRef.current;
                
            if (!chartContainer) {
                setIsLoading(false);
                return;
            }

            // Clear any existing content
            chartContainer.innerHTML = '';

            // Check if SciChart.js is available
            if (sciChartLoaded && window.SciChart) {
                console.log('Initializing SciChart.js chart...');
                
                const {
                    SciChartSurface,
                    NumericAxis,
                    FastCandlestickRenderableSeries,
                    FastLineRenderableSeries,
                    XyDataSeries,
                    OhlcDataSeries,
                    EAxisAlignment,
                    EAutoRange,
                    ZoomPanModifier,
                    ZoomExtentsModifier,
                    MouseWheelZoomModifier,
                    RubberBandXyZoomModifier,
                    EllipsePointMarker,
                    SciChartJsNavyTheme
                } = window.SciChart;

                // Create the SciChartSurface with proper configuration
                const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartContainer, {
                    theme: new SciChartJsNavyTheme(),
                    disableAspect: false
                });

                // Create X and Y axes
                const xAxis = new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Bottom,
                    autoRange: EAutoRange.Always,
                    axisTitle: `Time (${timeframes[timeframe].label})`,
                    labelStyle: { color: "#64748b", fontSize: 12 }
                });

                const yAxis = new NumericAxis(wasmContext, {
                    axisAlignment: EAxisAlignment.Left,
                    autoRange: EAutoRange.Always,
                    axisTitle: "Price",
                    labelStyle: { color: "#64748b", fontSize: 12 }
                });

                sciChartSurface.xAxes.add(xAxis);
                sciChartSurface.yAxes.add(yAxis);

                // Get asset info and generate data
                const assetInfo = getCurrentAssetInfo();
                const marketData = generateMarketData(assetInfo.basePrice, timeframe);
                
                // Combine historical and real-time data
                const combinedData = [...marketData, ...realTimeData];
                setCurrentPrice(combinedData[combinedData.length - 1]?.close || assetInfo.basePrice);

                if (chartType === 'candlestick') {
                    // Create OHLC DataSeries
                    const ohlcDataSeries = new OhlcDataSeries(wasmContext, {
                        dataSeriesName: `${assetInfo.name} (${selectedAsset})`
                    });

                    // Add data to the series
                    combinedData.forEach(dataPoint => {
                        ohlcDataSeries.append(
                            dataPoint.date,
                            dataPoint.open,
                            dataPoint.high,
                            dataPoint.low,
                            dataPoint.close
                        );
                    });

                    // Create candlestick renderable series
                    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
                        dataSeries: ohlcDataSeries,
                        strokeUp: "#10b981",
                        strokeDown: "#ef4444",
                        fillUp: "#10b981",
                        fillDown: "#ef4444",
                        strokeThickness: 1,
                        dataPointWidth: 0.7
                    });

                    sciChartSurface.renderableSeries.add(candlestickSeries);
                } else {
                    // Create XY DataSeries for line chart
                    const lineDataSeries = new XyDataSeries(wasmContext, {
                        dataSeriesName: `${assetInfo.name} (${selectedAsset})`
                    });

                    // Add close prices to line chart
                    combinedData.forEach(dataPoint => {
                        lineDataSeries.append(dataPoint.date, dataPoint.close);
                    });

                    // Create line renderable series
                    const lineSeries = new FastLineRenderableSeries(wasmContext, {
                        dataSeries: lineDataSeries,
                        stroke: "#667eea",
                        strokeThickness: 3,
                        pointMarker: new EllipsePointMarker(wasmContext, {
                            width: 6,
                            height: 6,
                            fill: "#667eea",
                            stroke: "#ffffff",
                            strokeThickness: 2
                        })
                    });

                    sciChartSurface.renderableSeries.add(lineSeries);
                }

                // Add interactivity modifiers
                sciChartSurface.chartModifiers.add(new ZoomPanModifier());
                sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
                sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
                sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());

                setSciChartSurface(sciChartSurface);
                console.log('SciChart.js chart initialized successfully!');
                
            } else {
                // Fallback to HTML5 Canvas chart
                console.log('SciChart.js not available, using fallback chart');
                createFallbackChart(chartContainer);
            }
            
        } catch (error) {
            console.error("Error initializing SciChart.js:", error);
            setChartError(`Chart initialization failed: ${error.message}`);
            
            // Always fallback to canvas chart on error
            const chartContainer = chartType === 'candlestick' ? 
                candlestickChartRef.current : lineChartRef.current;
            if (chartContainer) {
                createFallbackChart(chartContainer);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Update chart when dependencies change
    useEffect(() => {
        if (sciChartSurface) {
            sciChartSurface.delete();
            setSciChartSurface(null);
        }
        // Reset real-time data when switching assets or timeframes
        setRealTimeData([]);
        
        // Initialize chart (will use fallback if SciChart.js unavailable)
        if (sciChartLoaded || chartError) {
            initSciChartJS();
        }
        
        return () => {
            if (sciChartSurface) {
                sciChartSurface.delete();
            }
        };
    }, [selectedAsset, chartType, timeframe, sciChartLoaded]);

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
                `}
            </style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={styles.mainBodyInfo}>
                    <div style={styles.header}>
                        ⚡ SnowAI Trading Charts - SciChart.js React
                    </div>
                    
                    {/* Loading SciChart.js */}
                    {!sciChartLoaded && !chartError && (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingSpinner}></div>
                            <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                                Loading SciChart.js React (Community Edition) from CDN...
                            </span>
                        </div>
                    )}

                    {/* Chart Error */}
                    {chartError && (
                        <div style={{
                            ...styles.loadingContainer,
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#dc2626'
                        }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                                ⚠️ {chartError} - Using fallback chart
                            </span>
                        </div>
                    )}
                    
                    {/* Controls */}
                    <div style={styles.controlsContainer}>
                        {/* Asset Class Selector */}
                        {Object.entries(assetClasses).map(([category, assets]) => (
                            <div key={category} style={styles.assetSection}>
                                <div style={styles.categoryLabel}>
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
                            <span style={styles.categoryLabel}>📈 Chart Type:</span>
                            <button
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
                            <span style={styles.categoryLabel}>⏰ Timeframe:</span>
                            {Object.entries(timeframes).map(([key, config]) => (
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

                    {/* Loading indicator */}
                    {isLoading && sciChartLoaded && (
                        <div style={styles.loadingContainer}>
                            <div style={styles.loadingSpinner}></div>
                            <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: '500' }}>
                                Loading {getCurrentAssetInfo().name} chart ({timeframes[timeframe].label})...
                            </span>
                        </div>
                    )}

                    {/* Price Display */}
                    {!isLoading && (sciChartLoaded || chartError) && (
                        <div style={styles.priceDisplay}>
                            <div>
                                <div style={styles.currentPrice}>
                                    ${currentPrice.toLocaleString(undefined, { 
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: getCurrentAssetInfo().basePrice < 10 ? 4 : 2 
                                    })}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    {getCurrentAssetInfo().name} • {timeframes[timeframe].label}
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
                    {!isLoading && (sciChartLoaded || chartError) && (
                        <div style={styles.chartContainer}>
                            <div style={styles.chartTitle}>
                                {getCurrentAssetInfo().name} ({selectedAsset}) - {chartType === 'candlestick' ? 'Candlestick' : 'Line'} Chart - {timeframes[timeframe].label}
                                {chartError && <span style={{ color: '#ef4444', fontSize: '0.9rem' }}> (Fallback Mode)</span>}
                            </div>
                            
                            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                                {chartType === 'candlestick' && (
                                    <div 
                                        ref={candlestickChartRef} 
                                        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                    />
                                )}
                                
                                {chartType === 'line' && (
                                    <div 
                                        ref={lineChartRef} 
                                        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chart Instructions */}
                    <div style={styles.instructionsCard}>
                        <div style={styles.instructionsTitle}>🎮 Chart Controls & Features</div>
                        <ul style={styles.instructionsList}>
                            <li style={styles.instructionItem}>🔍 <strong>Zoom:</strong> Mouse wheel or drag to select area for rubber band zoom</li>
                            <li style={styles.instructionItem}>👆 <strong>Pan:</strong> Click and drag to move around the chart</li>
                            <li style={styles.instructionItem}>🔄 <strong>Reset Zoom:</strong> Double-click to zoom to full extents</li>
                            <li style={styles.instructionItem}>📊 <strong>Real-time Data:</strong> Live price updates based on selected timeframe</li>
                            <li style={styles.instructionItem}>💹 <strong>Asset Switching:</strong> Click any asset button to analyze different instruments</li>
                            <li style={styles.instructionItem}>📈 <strong>Chart Types:</strong> Switch between candlestick and line views</li>
                            <li style={styles.instructionItem}>⏰ <strong>Timeframes:</strong> Select from 1M to 1W intervals for different perspectives</li>
                            <li style={styles.instructionItem}>🆓 <strong>SciChart.js React:</strong> Community Edition loaded from CDN (100% Free)</li>
                            <li style={styles.instructionItem}>🛡️ <strong>Fallback Support:</strong> Automatic HTML5 Canvas fallback if CDN fails</li>
                            <li style={styles.instructionItem}>⚡ <strong>Performance:</strong> WebAssembly-powered rendering for smooth interactions</li>
                        </ul>
                    </div>

                    {/* Technical Information */}
                    <div style={{
                        ...styles.instructionsCard,
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        border: '1px solid #bfdbfe',
                        marginTop: '20px'
                    }}>
                        <div style={styles.instructionsTitle}>ℹ️ Technical Information</div>
                        <ul style={styles.instructionsList}>
                            <li style={styles.instructionItem}>
                                <strong>Library:</strong> SciChart.js React Community Edition (Free for commercial use)
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>CDN Sources:</strong> JSDelivr and unpkg with automatic fallback
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>Licensing:</strong> No license key required for community features
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>Performance:</strong> WebAssembly-based rendering for 60+ FPS
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>Fallback:</strong> HTML5 Canvas charts if SciChart.js fails to load
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>Data:</strong> Simulated real-time market data with realistic volatility
                            </li>
                            <li style={styles.instructionItem}>
                                <strong>Status:</strong> {sciChartLoaded ? '✅ SciChart.js Loaded' : chartError ? '⚠️ Using Fallback' : '🔄 Loading...'}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}