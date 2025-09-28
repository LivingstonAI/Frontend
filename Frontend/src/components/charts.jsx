import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

// SciChart imports
import {
  SciChartSurface,
  NumericAxis,
  FastCandlestickRenderableSeries,
  FastLineRenderableSeries,
  XyDataSeries,
  OhlcDataSeries,
  EAxisAlignment,
  EAutoRange,
  NumberRange,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  RubberBandXyZoomModifier,
  EllipsePointMarker,
  SciChartJsNavyTheme,
  ESeriesType,
  parseColorToUIntArgb
} from "scichart";

export default function Charts() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Refs for chart containers
    const candlestickChartRef = useRef(null);
    const lineChartRef = useRef(null);
    
    // State management
    const [selectedAsset, setSelectedAsset] = useState('BTCUSD');
    const [chartType, setChartType] = useState('candlestick');
    const [sciChartSurface, setSciChartSurface] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Asset classes configuration
    const assetClasses = {
        'Crypto': ['BTCUSD', 'ETHUSD', 'ADAUSD', 'SOLUSD'],
        'Forex': ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'],
        'Stocks': ['AAPL', 'GOOGL', 'TSLA', 'MSFT'],
        'Commodities': ['XAUUSD', 'XAGUSD', 'USOIL', 'UKOIL']
    };

    // Generate sample OHLC data (replace with your API data)
    const generateSampleData = () => {
        const data = [];
        let basePrice = 50000;
        const now = new Date();
        
        for (let i = 0; i < 100; i++) {
            const date = new Date(now.getTime() - (100 - i) * 24 * 60 * 60 * 1000);
            const open = basePrice + (Math.random() - 0.5) * 1000;
            const high = open + Math.random() * 2000;
            const low = open - Math.random() * 1500;
            const close = low + Math.random() * (high - low);
            
            data.push({
                date: date.getTime(),
                open,
                high,
                low,
                close,
                volume: Math.random() * 1000000
            });
            
            basePrice = close;
        }
        return data;
    };

    // Initialize SciChart
    const initSciChart = async () => {
        setIsLoading(true);
        
        try {
            // Set your community license key here
            // SciChartSurface.setRuntimeLicenseKey("YOUR_COMMUNITY_LICENSE_KEY");
            
            const chartContainer = chartType === 'candlestick' ? 
                candlestickChartRef.current : lineChartRef.current;
                
            if (!chartContainer) return;

            // Create the SciChartSurface
            const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartContainer, {
                theme: new SciChartJsNavyTheme()
            });

            // Create X and Y axes
            const xAxis = new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Bottom,
                autoRange: EAutoRange.Always,
                axisTitle: "Time"
            });

            const yAxis = new NumericAxis(wasmContext, {
                axisAlignment: EAxisAlignment.Left,
                autoRange: EAutoRange.Always,
                axisTitle: "Price"
            });

            sciChartSurface.xAxes.add(xAxis);
            sciChartSurface.yAxes.add(yAxis);

            // Generate sample data
            const sampleData = generateSampleData();

            if (chartType === 'candlestick') {
                // Create OHLC DataSeries for candlestick chart
                const ohlcDataSeries = new OhlcDataSeries(wasmContext, {
                    dataSeriesName: selectedAsset
                });

                // Add data to the series
                sampleData.forEach(dataPoint => {
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
                    strokeUp: parseColorToUIntArgb("#50C878"),
                    strokeDown: parseColorToUIntArgb("#FF6347"),
                    fillUp: parseColorToUIntArgb("#50C878"),
                    fillDown: parseColorToUIntArgb("#FF6347"),
                    strokeThickness: 1
                });

                sciChartSurface.renderableSeries.add(candlestickSeries);
            } else {
                // Create XY DataSeries for line chart
                const lineDataSeries = new XyDataSeries(wasmContext, {
                    dataSeriesName: selectedAsset
                });

                // Add close prices to line chart
                sampleData.forEach(dataPoint => {
                    lineDataSeries.append(dataPoint.date, dataPoint.close);
                });

                // Create line renderable series
                const lineSeries = new FastLineRenderableSeries(wasmContext, {
                    dataSeries: lineDataSeries,
                    stroke: parseColorToUIntArgb("#50C878"),
                    strokeThickness: 2,
                    pointMarker: new EllipsePointMarker(wasmContext, {
                        width: 5,
                        height: 5,
                        fill: parseColorToUIntArgb("#50C878")
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
            
        } catch (error) {
            console.error("Error initializing SciChart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update chart data when asset or chart type changes
    useEffect(() => {
        if (sciChartSurface) {
            sciChartSurface.delete();
        }
        initSciChart();
        
        return () => {
            if (sciChartSurface) {
                sciChartSurface.delete();
            }
        };
    }, [selectedAsset, chartType]);

    // Handle asset selection
    const handleAssetChange = (asset) => {
        setSelectedAsset(asset);
    };

    // Handle chart type change
    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Charts</h5>
                    
                    {/* Controls */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {/* Asset Class Selector */}
                        <div>
                            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Asset Classes:</label>
                            {Object.entries(assetClasses).map(([category, assets]) => (
                                <div key={category} style={{ margin: '5px 0' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{category}:</span>
                                    {assets.map(asset => (
                                        <button
                                            key={asset}
                                            onClick={() => handleAssetChange(asset)}
                                            style={{
                                                margin: '0 5px',
                                                padding: '5px 10px',
                                                backgroundColor: selectedAsset === asset ? '#007bff' : '#f8f9fa',
                                                color: selectedAsset === asset ? 'white' : 'black',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {asset}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                        
                        {/* Chart Type Selector */}
                        <div>
                            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Chart Type:</label>
                            <button
                                onClick={() => handleChartTypeChange('candlestick')}
                                style={{
                                    margin: '0 5px',
                                    padding: '5px 15px',
                                    backgroundColor: chartType === 'candlestick' ? '#007bff' : '#f8f9fa',
                                    color: chartType === 'candlestick' ? 'white' : 'black',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Candlestick
                            </button>
                            <button
                                onClick={() => handleChartTypeChange('line')}
                                style={{
                                    margin: '0 5px',
                                    padding: '5px 15px',
                                    backgroundColor: chartType === 'line' ? '#007bff' : '#f8f9fa',
                                    color: chartType === 'line' ? 'white' : 'black',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Line
                            </button>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Loading chart...
                        </div>
                    )}

                    {/* Chart Container */}
                    <div style={{ position: 'relative', width: '100%', height: '600px', marginTop: '20px' }}>
                        <h6 style={{ marginBottom: '10px' }}>
                            {selectedAsset} - {chartType === 'candlestick' ? 'Candlestick' : 'Line'} Chart
                        </h6>
                        
                        {chartType === 'candlestick' && (
                            <div 
                                ref={candlestickChartRef} 
                                style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
                            />
                        )}
                        
                        {chartType === 'line' && (
                            <div 
                                ref={lineChartRef} 
                                style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
                            />
                        )}
                    </div>

                    {/* Chart Instructions */}
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h6>Chart Controls:</h6>
                        <ul style={{ marginBottom: '0' }}>
                            <li><strong>Zoom:</strong> Mouse wheel or rubber band selection</li>
                            <li><strong>Pan:</strong> Click and drag</li>
                            <li><strong>Reset Zoom:</strong> Double-click to zoom to extents</li>
                            <li><strong>Asset Selection:</strong> Click any asset button to switch instruments</li>
                            <li><strong>Chart Type:</strong> Toggle between candlestick and line charts</li>
                        </ul>
                    </div>
                    
                    <br />
                </div>
            </div>
        </div>
    );
}