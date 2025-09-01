import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";

export default function EconomicStrengthIndex() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);
    const [selectedForexPairs, setSelectedForexPairs] = useState([]);
    const [economicData, setEconomicData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState('30d');
    
    const currencies = [
        { code: 'USD', name: 'US Dollar', color: '#2563eb' },
        { code: 'EUR', name: 'Euro', color: '#dc2626' },
        { code: 'GBP', name: 'British Pound', color: '#16a34a' },
        { code: 'JPY', name: 'Japanese Yen', color: '#ea580c' },
        { code: 'AUD', name: 'Australian Dollar', color: '#7c3aed' },
        { code: 'CAD', name: 'Canadian Dollar', color: '#0891b2' },
        { code: 'CHF', name: 'Swiss Franc', color: '#be123c' },
        { code: 'CNY', name: 'Chinese Yuan', color: '#059669' }
    ];

    const forexPairs = [
        { pair: 'EURUSD', name: 'EUR/USD', color: '#f59e0b' },
        { pair: 'GBPUSD', name: 'GBP/USD', color: '#ef4444' },
        { pair: 'USDJPY', name: 'USD/JPY', color: '#8b5cf6' },
        { pair: 'AUDUSD', name: 'AUD/USD', color: '#06b6d4' },
        { pair: 'USDCAD', name: 'USD/CAD', color: '#84cc16' },
        { pair: 'USDCHF', name: 'USD/CHF', color: '#f97316' },
        { pair: 'EURGBP', name: 'EUR/GBP', color: '#ec4899' },
        { pair: 'EURJPY', name: 'EUR/JPY', color: '#14b8a6' }
    ];

    // Data validation and cleaning function
    const cleanAndValidateData = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        return data.map(point => {
            const cleanedPoint = { ...point };
            
            // Ensure all ESI values are numbers
            selectedCurrencies.forEach(currency => {
                if (cleanedPoint[currency] !== undefined) {
                    const value = parseFloat(cleanedPoint[currency]);
                    cleanedPoint[currency] = isNaN(value) ? null : value;
                }
            });

            // Ensure all forex price values are numbers
            selectedForexPairs.forEach(pair => {
                const priceKey = `${pair}_price`;
                if (cleanedPoint[priceKey] !== undefined) {
                    const value = parseFloat(cleanedPoint[priceKey]);
                    cleanedPoint[priceKey] = isNaN(value) ? null : value;
                }
            });

            return cleanedPoint;
        }).filter(point => {
            // Remove points that have no valid data
            const hasValidESI = selectedCurrencies.some(currency => 
                point[currency] !== null && point[currency] !== undefined
            );
            const hasValidForex = selectedForexPairs.some(pair => 
                point[`${pair}_price`] !== null && point[`${pair}_price`] !== undefined
            );
            
            return hasValidESI || hasValidForex || selectedCurrencies.length === 0 && selectedForexPairs.length === 0;
        });
    };

    const fetchEconomicStrengthData = async () => {
        setLoading(true);
        try {
            console.log('Requesting data with:', {
                currencies: selectedCurrencies,
                forex_pairs: selectedForexPairs,
                date_range: dateRange
            });

            const response = await fetch(`${baseUrl}/api/economic-strength-index/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currencies: selectedCurrencies,
                    forex_pairs: selectedForexPairs,
                    date_range: dateRange
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);
                
                if (data.chart_data && Array.isArray(data.chart_data)) {
                    // Clean and validate the data before setting it
                    const cleanedData = cleanAndValidateData(data.chart_data);
                    console.log('Cleaned data points:', cleanedData.length);
                    setEconomicData(cleanedData);
                } else {
                    console.warn('Invalid chart_data received:', data.chart_data);
                    setEconomicData([]);
                }
            } else {
                console.error('Response not OK:', response.status);
                setEconomicData([]);
            }
        } catch (error) {
            console.error('Error fetching economic strength data:', error);
            setEconomicData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedCurrencies.length > 0 || selectedForexPairs.length > 0) {
            fetchEconomicStrengthData();
        } else {
            setEconomicData([]);
        }
    }, [selectedCurrencies, selectedForexPairs, dateRange]);

    const handleCurrencyToggle = (currencyCode) => {
        setSelectedCurrencies(prev => {
            if (prev.includes(currencyCode)) {
                return prev.filter(c => c !== currencyCode);
            } else {
                return [...prev, currencyCode];
            }
        });
    };

    const handleForexToggle = (forexPair) => {
        setSelectedForexPairs(prev => {
            if (prev.includes(forexPair)) {
                return prev.filter(f => f !== forexPair);
            } else {
                return [...prev, forexPair];
            }
        });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="esi-tooltip">
                    <p className="esi-tooltip-label">{`Date: ${label}`}</p>
                    {payload.map((entry, index) => {
                        // Only show entries with valid values
                        if (entry.value === null || entry.value === undefined) {
                            return null;
                        }

                        const isForex = entry.dataKey.includes('_price');
                        const displayName = isForex 
                            ? entry.dataKey.replace('_price', '').replace('USD', '/USD')
                            : `${entry.dataKey} ESI`;
                        const formattedValue = isForex 
                            ? entry.value.toFixed(4)
                            : entry.value.toFixed(2);
                        
                        return (
                            <p key={index} style={{ color: entry.color }} className="esi-tooltip-entry">
                                {`${displayName}: ${formattedValue}`}
                            </p>
                        );
                    }).filter(Boolean)}
                </div>
            );
        }
        return null;
    };

    // Improved Y-axis domain calculation with better error handling
    const getYAxisDomains = () => {
        if (!economicData || economicData.length === 0) {
            return { esi: [0, 100], forex: [0, 1] };
        }

        let minForex = Infinity, maxForex = -Infinity;
        let hasValidForexData = false;

        economicData.forEach(point => {
            selectedForexPairs.forEach(pair => {
                const priceKey = `${pair}_price`;
                const value = point[priceKey];
                if (value !== undefined && value !== null && !isNaN(value)) {
                    minForex = Math.min(minForex, value);
                    maxForex = Math.max(maxForex, value);
                    hasValidForexData = true;
                }
            });
        });

        // Ensure valid domain ranges
        const forexDomain = hasValidForexData && minForex !== Infinity && maxForex !== -Infinity
            ? [
                Math.max(0, minForex - (maxForex - minForex) * 0.05),
                maxForex + (maxForex - minForex) * 0.05
              ]
            : [0, 1];
        
        return {
            esi: [0, 100],
            forex: forexDomain
        };
    };

    const domains = getYAxisDomains();
    
    // Check if we have valid forex data to display
    const hasForexData = selectedForexPairs.length > 0 && economicData.some(point => 
        selectedForexPairs.some(pair => {
            const value = point[`${pair}_price`];
            return value !== undefined && value !== null && !isNaN(value);
        })
    );

    // Function to check if a data point has valid data for rendering
    const hasValidDataPoint = (point, dataKey) => {
        const value = point[dataKey];
        return value !== null && value !== undefined && !isNaN(value);
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Economic Strength Index with Forex Overlay</h5><br />
                    
                    {/* Controls Section */}
                    <div className="esi-controls">
                        <div className="esi-currency-selector">
                            <h6>Select ESI Currencies:</h6>
                            <div className="esi-currency-grid">
                                {currencies.map(currency => (
                                    <label key={currency.code} className="esi-currency-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCurrencies.includes(currency.code)}
                                            onChange={() => handleCurrencyToggle(currency.code)}
                                        />
                                        <span className="esi-checkmark" style={{borderColor: currency.color}}></span>
                                        <span className="esi-currency-label">
                                            {currency.code} - {currency.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-forex-selector">
                            <h6>Select Forex Pairs to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {forexPairs.map(forex => (
                                    <label key={forex.pair} className="esi-currency-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedForexPairs.includes(forex.pair)}
                                            onChange={() => handleForexToggle(forex.pair)}
                                        />
                                        <span className="esi-checkmark forex-checkmark" style={{borderColor: forex.color}}></span>
                                        <span className="esi-currency-label">
                                            {forex.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className="esi-date-range-selector">
                            <h6>Time Range:</h6>
                            <select 
                                value={dateRange} 
                                onChange={(e) => setDateRange(e.target.value)}
                                className="esi-select"
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="180d">Last 6 Months</option>
                                <option value="365d">Last Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="esi-chart-container">
                        {loading ? (
                            <div className="esi-loading">
                                <div className="esi-spinner"></div>
                                <p>Calculating Economic Strength Index and Forex Data...</p>
                            </div>
                        ) : economicData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart data={economicData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#374151"
                                        tick={{ fontSize: 12 }}
                                    />
                                    {/* Left Y-Axis for ESI */}
                                    <YAxis 
                                        yAxisId="esi"
                                        stroke="#374151"
                                        tick={{ fontSize: 12 }}
                                        domain={domains.esi}
                                        label={{ value: 'ESI Score', angle: -90, position: 'insideLeft' }}
                                    />
                                    {/* Right Y-Axis for Forex Prices */}
                                    {hasForexData && (
                                        <YAxis 
                                            yAxisId="forex"
                                            orientation="right"
                                            stroke="#6b7280"
                                            tick={{ fontSize: 12 }}
                                            domain={domains.forex}
                                            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
                                            label={{ value: 'Forex Price', angle: 90, position: 'insideRight' }}
                                        />
                                    )}
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    
                                    {/* ESI Lines */}
                                    {selectedCurrencies.map(currencyCode => {
                                        const currency = currencies.find(c => c.code === currencyCode);
                                        return (
                                            <Line
                                                key={currencyCode}
                                                yAxisId="esi"
                                                type="monotone"
                                                dataKey={currencyCode}
                                                stroke={currency?.color || '#6b7280'}
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                                name={`${currencyCode} ESI`}
                                                connectNulls={false}
                                            />
                                        );
                                    })}
                                    
                                    {/* Forex Lines */}
                                    {selectedForexPairs.map(forexPair => {
                                        const forex = forexPairs.find(f => f.pair === forexPair);
                                        const priceKey = `${forexPair}_price`;
                                        return (
                                            <Line
                                                key={priceKey}
                                                yAxisId="forex"
                                                type="monotone"
                                                dataKey={priceKey}
                                                stroke={forex?.color || '#6b7280'}
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 4 }}
                                                name={forex?.name || forexPair}
                                                connectNulls={false}
                                            />
                                        );
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="esi-no-data">
                                <p>Select currencies and/or forex pairs to view data</p>
                            </div>
                        )}
                    </div>

                    {/* Legend Info */}
                    {hasForexData && (
                        <div className="esi-legend-info">
                            <div className="legend-item">
                                <div className="legend-line solid"></div>
                                <span>ESI Scores (Left Axis, 0-100 scale)</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-line dashed"></div>
                                <span>Forex Prices (Right Axis, Price scale)</span>
                            </div>
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="esi-info">
                        <h6>About Economic Strength Index with Forex Overlay</h6>
                        <p>
                            The Economic Strength Index (ESI) aggregates all economic events for selected currencies, 
                            weighted by impact and normalized for comparison. Forex price overlays show actual market 
                            movements for comparison with economic strength indicators.
                        </p>
                        <div className="esi-methodology">
                            <strong>Methodology:</strong>
                            <ul>
                                <li>ESI: High impact events (3x), Medium (2x), Low (1x) weight</li>
                                <li>ESI: Values normalized using percentage deviation from forecast</li>
                                <li>Forex: Real-time price data overlayed with dashed lines</li>
                                <li>Dual Y-axes: Left for ESI (0-100), Right for Forex prices</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .esi-controls {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .esi-currency-selector h6,
                .esi-forex-selector h6,
                .esi-date-range-selector h6 {
                    color: #1e293b;
                    margin-bottom: 12px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .esi-forex-selector {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f1f5f9;
                    border-radius: 6px;
                    border-left: 3px solid #3b82f6;
                }

                .esi-currency-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .esi-currency-checkbox {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                }

                .esi-currency-checkbox:hover {
                    background-color: #e2e8f0;
                }

                .esi-currency-checkbox input[type="checkbox"] {
                    display: none;
                }

                .esi-checkmark {
                    width: 18px;
                    height: 18px;
                    border: 2px solid #cbd5e1;
                    border-radius: 3px;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .esi-checkmark.forex-checkmark {
                    border-radius: 50%;
                }

                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark {
                    background-color: currentColor;
                    border-color: currentColor;
                }

                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark::after {
                    content: '✓';
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                .esi-currency-label {
                    color: #374151;
                    font-size: 14px;
                }

                .esi-select {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background-color: white;
                    color: #374151;
                    font-size: 14px;
                    min-width: 150px;
                }

                .esi-chart-container {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }

                .esi-legend-info {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin: 15px 0;
                    padding: 10px;
                    background: #f8fafc;
                    border-radius: 6px;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #475569;
                }

                .legend-line {
                    width: 30px;
                    height: 2px;
                    background: #6b7280;
                }

                .legend-line.solid {
                    background: #2563eb;
                }

                .legend-line.dashed {
                    background: linear-gradient(to right, #f59e0b 50%, transparent 50%);
                    background-size: 8px 2px;
                }

                .esi-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: #6b7280;
                }

                .esi-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .esi-no-data {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: #6b7280;
                    font-size: 16px;
                }

                .esi-tooltip {
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid #334155;
                    border-radius: 6px;
                    padding: 12px;
                    color: white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .esi-tooltip-label {
                    margin: 0 0 8px 0;
                    font-weight: 600;
                    color: #e2e8f0;
                }

                .esi-tooltip-entry {
                    margin: 4px 0;
                    font-size: 14px;
                }

                .esi-info {
                    background: #f1f5f9;
                    border-left: 4px solid #3b82f6;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }

                .esi-info h6 {
                    color: #1e293b;
                    margin-bottom: 12px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .esi-info p {
                    color: #475569;
                    margin-bottom: 16px;
                    line-height: 1.6;
                }

                .esi-methodology {
                    color: #374151;
                }

                .esi-methodology strong {
                    color: #1e293b;
                }

                .esi-methodology ul {
                    margin: 8px 0 0 20px;
                    color: #475569;
                }

                .esi-methodology li {
                    margin: 4px 0;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .esi-controls {
                        padding: 15px;
                    }

                    .esi-currency-grid {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }

                    .esi-chart-container {
                        padding: 15px;
                        margin: 15px 0;
                    }

                    .esi-currency-checkbox {
                        padding: 10px;
                    }

                    .esi-select {
                        width: 100%;
                        margin-top: 8px;
                    }

                    .esi-info {
                        padding: 15px;
                        margin: 15px 0;
                    }

                    .esi-legend-info {
                        flex-direction: column;
                        gap: 15px;
                        align-items: center;
                    }
                }

                @media (max-width: 480px) {
                    .esi-currency-label {
                        font-size: 13px;
                    }

                    .esi-chart-container {
                        padding: 10px;
                    }

                    .esi-loading,
                    .esi-no-data {
                        height: 250px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}