import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";

export default function EconomicStrengthIndex() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);
    const [selectedForexPairs, setSelectedForexPairs] = useState([]);
    const [selectedStockIndices, setSelectedStockIndices] = useState([]);
    const [selectedCommodities, setSelectedCommodities] = useState([]);
    const [selectedVolumeAssets, setSelectedVolumeAssets] = useState([]);
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

    const stockIndices = [
        { symbol: '^GSPC', name: 'S&P 500', displayName: 'S&P 500', color: '#dc2626' },
        { symbol: '^DJI', name: 'Dow Jones', displayName: 'Dow Jones', color: '#2563eb' },
        { symbol: '^IXIC', name: 'NASDAQ', displayName: 'NASDAQ', color: '#16a34a' },
        { symbol: '^RUT', name: 'Russell 2000', displayName: 'Russell 2000', color: '#ea580c' },
        { symbol: '^FTSE', name: 'FTSE 100', displayName: 'FTSE 100', color: '#7c3aed' },
        { symbol: '^GDAXI', name: 'DAX', displayName: 'DAX', color: '#0891b2' },
        { symbol: '^FCHI', name: 'CAC 40', displayName: 'CAC 40', color: '#be123c' },
        { symbol: '^N225', name: 'Nikkei 225', displayName: 'Nikkei 225', color: '#059669' },
        { symbol: '^HSI', name: 'Hang Seng', displayName: 'Hang Seng', color: '#f59e0b' },
        { symbol: '^AXJO', name: 'ASX 200', displayName: 'ASX 200', color: '#8b5cf6' }
    ];

    const commodities = [
        { symbol: 'GC=F', name: 'Gold', displayName: 'Gold', color: '#fbbf24' },
        { symbol: 'SI=F', name: 'Silver', displayName: 'Silver', color: '#9ca3af' },
        { symbol: 'CL=F', name: 'Crude Oil WTI', displayName: 'Crude Oil (WTI)', color: '#1f2937' },
        { symbol: 'BZ=F', name: 'Brent Crude', displayName: 'Brent Crude', color: '#374151' },
        { symbol: 'NG=F', name: 'Natural Gas', displayName: 'Natural Gas', color: '#3b82f6' },
        { symbol: 'HG=F', name: 'Copper', displayName: 'Copper', color: '#b45309' },
        { symbol: 'PL=F', name: 'Platinum', displayName: 'Platinum', color: '#6b7280' },
        { symbol: 'PA=F', name: 'Palladium', displayName: 'Palladium', color: '#4b5563' },
        { symbol: 'ZC=F', name: 'Corn', displayName: 'Corn', color: '#eab308' },
        { symbol: 'ZW=F', name: 'Wheat', displayName: 'Wheat', color: '#d97706' }
    ];

    // All available assets for volume tracking
    const volumeAssets = [
        ...forexPairs.map(fp => ({ ...fp, type: 'forex', id: fp.pair })),
        ...stockIndices.map(si => ({ ...si, type: 'stock', id: si.symbol, name: si.displayName })),
        ...commodities.map(cm => ({ ...cm, type: 'commodity', id: cm.symbol, name: cm.displayName }))
    ];

    const fetchEconomicStrengthData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/economic-strength-index/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currencies: selectedCurrencies,
                    forex_pairs: selectedForexPairs,
                    stock_indices: selectedStockIndices,
                    commodities: selectedCommodities,
                    volume_assets: selectedVolumeAssets,
                    date_range: dateRange
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);
                console.log('Chart data sample:', data.chart_data?.slice(0, 3));
                
                // Debug: Check for forex, stock indices, and volume keys
                if (data.chart_data && data.chart_data.length > 0) {
                    const samplePoint = data.chart_data[0];
                    const forexKeys = Object.keys(samplePoint).filter(key => key.includes('_price'));
                    const stockKeys = Object.keys(samplePoint).filter(key => key.includes('_index'));
                    const volumeKeys = Object.keys(samplePoint).filter(key => key.includes('_volume_ratio'));
                    console.log('Forex price keys found:', forexKeys);
                    console.log('Stock indices keys found:', stockKeys);
                    console.log('Volume ratio keys found:', volumeKeys);
                }
                
                setEconomicData(data.chart_data);
            }
        } catch (error) {
            console.error('Error fetching economic strength data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedCurrencies.length > 0 || selectedForexPairs.length > 0 || 
            selectedStockIndices.length > 0 || selectedVolumeAssets.length > 0 || 
            selectedCommodities.length > 0) {
            fetchEconomicStrengthData();
        }
    }, [selectedCurrencies, selectedForexPairs, selectedStockIndices, selectedVolumeAssets, selectedCommodities, dateRange]); // NEW DEPENDENCY

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

    const handleStockIndexToggle = (stockSymbol) => {
        setSelectedStockIndices(prev => {
            if (prev.includes(stockSymbol)) {
                return prev.filter(s => s !== stockSymbol);
            } else {
                return [...prev, stockSymbol];
            }
        });
    };

    const handleCommodityToggle = (commoditySymbol) => {
        setSelectedCommodities(prev => {
            if (prev.includes(commoditySymbol)) {
                return prev.filter(c => c !== commoditySymbol);
            } else {
                return [...prev, commoditySymbol];
            }
        });
    };

    const handleVolumeAssetToggle = (assetId) => {
        setSelectedVolumeAssets(prev => {
            if (prev.includes(assetId)) {
                return prev.filter(a => a !== assetId);
            } else {
                return [...prev, assetId];
            }
        });
    };

    // CSV Download Functions
    const convertToCSV = (data, headers) => {
        if (!data || data.length === 0) return '';
        
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                // Handle null/undefined values and escape commas
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
    };

    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDownloadESIData = (currencyCode) => {
        if (!economicData || economicData.length === 0) {
            alert('No data available to download');
            return;
        }

        // Filter data to only include date and the specific currency ESI
        const esiData = economicData
            .filter(row => row[currencyCode] !== undefined && row[currencyCode] !== null)
            .map(row => ({
                Date: row.date,
                ESI_Score: row[currencyCode].toFixed(2)
            }));

        if (esiData.length === 0) {
            alert(`No ESI data available for ${currencyCode}`);
            return;
        }

        const csv = convertToCSV(esiData, ['Date', 'ESI_Score']);
        const filename = `${currencyCode}_ESI_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(csv, filename);
    };

    const handleDownloadForexData = (forexPair) => {
        if (!economicData || economicData.length === 0) {
            alert('No data available to download');
            return;
        }

        const priceKey = `${forexPair}_price`;
        
        // Filter data to only include date and the specific forex price
        const forexData = economicData
            .filter(row => row[priceKey] !== undefined && row[priceKey] !== null)
            .map(row => ({
                Date: row.date,
                Price: row[priceKey].toFixed(4)
            }));

        if (forexData.length === 0) {
            alert(`No forex data available for ${forexPair}`);
            return;
        }

        const csv = convertToCSV(forexData, ['Date', 'Price']);
        const filename = `${forexPair}_Price_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(csv, filename);
    };

    const handleDownloadStockIndexData = (stockSymbol) => {
        if (!economicData || economicData.length === 0) {
            alert('No data available to download');
            return;
        }

        const indexKey = `${stockSymbol}_index`;
        
        // Filter data to only include date and the specific stock index price
        const stockData = economicData
            .filter(row => row[indexKey] !== undefined && row[indexKey] !== null)
            .map(row => ({
                Date: row.date,
                Index_Value: row[indexKey].toFixed(2)
            }));

        if (stockData.length === 0) {
            alert(`No stock index data available for ${stockSymbol}`);
            return;
        }

        const csv = convertToCSV(stockData, ['Date', 'Index_Value']);
        const stockInfo = stockIndices.find(s => s.symbol === stockSymbol);
        const displayName = stockInfo ? stockInfo.displayName.replace(/\s+/g, '_') : stockSymbol;
        const filename = `${displayName}_Index_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(csv, filename);
    };

    const handleDownloadCommodityData = (commoditySymbol) => {
        if (!economicData || economicData.length === 0) {
            alert('No data available to download');
            return;
        }

        const commodityKey = `${commoditySymbol}_commodity`;
        
        // Filter data to only include date and the specific commodity price
        const commodityData = economicData
            .filter(row => row[commodityKey] !== undefined && row[commodityKey] !== null)
            .map(row => ({
                Date: row.date,
                Price: row[commodityKey].toFixed(2)
            }));

        if (commodityData.length === 0) {
            alert(`No commodity data available for ${commoditySymbol}`);
            return;
        }

        const csv = convertToCSV(commodityData, ['Date', 'Price']);
        const commodityInfo = commodities.find(c => c.symbol === commoditySymbol);
        const displayName = commodityInfo ? commodityInfo.displayName.replace(/\s+/g, '_') : commoditySymbol;
        const filename = `${displayName}_Price_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(csv, filename);
    };


    const handleDownloadVolumeData = (assetId) => {
        if (!economicData || economicData.length === 0) {
            alert('No data available to download');
            return;
        }

        const volumeKey = `${assetId}_volume_ratio`;
        
        // Filter data to only include date and the specific volume ratio
        const volumeData = economicData
            .filter(row => row[volumeKey] !== undefined && row[volumeKey] !== null)
            .map(row => ({
                Date: row.date,
                Relative_Volume: row[volumeKey].toFixed(2)
            }));

        if (volumeData.length === 0) {
            alert(`No volume data available for ${assetId}`);
            return;
        }

        const csv = convertToCSV(volumeData, ['Date', 'Relative_Volume']);
        const assetInfo = volumeAssets.find(a => a.id === assetId);
        const displayName = assetInfo ? assetInfo.name.replace(/\s+/g, '_') : assetId;
        const filename = `${displayName}_RelativeVolume_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
        downloadCSV(csv, filename);
    };

    const handleDownloadAllData = () => {
        // Download all selected ESI currencies
        selectedCurrencies.forEach(currency => {
            setTimeout(() => handleDownloadESIData(currency), 100 * selectedCurrencies.indexOf(currency));
        });

        // Download all selected forex pairs
        selectedForexPairs.forEach(pair => {
            setTimeout(() => handleDownloadForexData(pair), 100 * (selectedCurrencies.length + selectedForexPairs.indexOf(pair)));
        });

        // Download all selected stock indices
        selectedStockIndices.forEach(symbol => {
            setTimeout(() => handleDownloadStockIndexData(symbol), 100 * (selectedCurrencies.length + selectedForexPairs.length + selectedStockIndices.indexOf(symbol)));
        });

        selectedCommodities.forEach(symbol => {
            setTimeout(() => handleDownloadCommodityData(symbol), 
                100 * (selectedCurrencies.length + selectedForexPairs.length + 
                    selectedStockIndices.length + selectedCommodities.indexOf(symbol)));
        });

        // Download all selected volume assets
        
        selectedVolumeAssets.forEach(assetId => {
            setTimeout(() => handleDownloadVolumeData(assetId), 
                100 * (selectedCurrencies.length + selectedForexPairs.length + 
                    selectedStockIndices.length + selectedCommodities.length + 
                    selectedVolumeAssets.indexOf(assetId)));
        });
    };

    const formatTooltipValue = (value, name) => {
        if (typeof value === 'number') {
            // Check if it's a volume ratio
            if (name.includes('Volume') || name.includes('volume_ratio')) {
                return [value.toFixed(2) + 'x', name];
            }
            // Check if it's a forex price (typically has more decimal places)
            if (name.includes('/')) {
                return [value.toFixed(4), name];
            }
            // Check if it's a stock index
            if (name.includes('Index') || name.includes('S&P') || name.includes('Dow') || name.includes('NASDAQ')) {
                return [value.toFixed(2), name];
            }
            return [value.toFixed(2), name];
        }
        return [value, name];
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="esi-tooltip">
                    <p className="esi-tooltip-label">{`Date: ${label}`}</p>
                    {payload.map((entry, index) => {
                        const isForex = entry.dataKey.includes('_price');
                        const isStockIndex = entry.dataKey.includes('_index');
                        const isCommodity = entry.dataKey.includes('_commodity');
                        const isVolume = entry.dataKey.includes('_volume_ratio');
                        
                        let displayName, formattedValue;
                        
                        if (isVolume) {
                            const assetId = entry.dataKey.replace('_volume_ratio', '');
                            const assetInfo = volumeAssets.find(a => a.id === assetId);
                            displayName = assetInfo ? `${assetInfo.name} Volume` : `${assetId} Volume`;
                            formattedValue = entry.value ? `${entry.value.toFixed(2)}x` : 'N/A';
                        } else if (isForex) {
                            displayName = entry.dataKey.replace('_price', '').replace('USD', '/USD');
                            formattedValue = entry.value?.toFixed(4) || 'N/A';
                        } else if (isStockIndex) {
                            const symbol = entry.dataKey.replace('_index', '');
                            const stockInfo = stockIndices.find(s => s.symbol === symbol);
                            displayName = stockInfo ? stockInfo.displayName : symbol;
                            formattedValue = entry.value?.toFixed(2) || 'N/A';
                        } 
                         else if (isCommodity) {
                            const symbol = entry.dataKey.replace('_commodity', '');
                            const commodityInfo = commodities.find(c => c.symbol === symbol);
                            displayName = commodityInfo ? commodityInfo.displayName : symbol;
                            formattedValue = entry.value?.toFixed(2) || 'N/A';
                         }
                        else {
                            displayName = `${entry.dataKey} ESI`;
                            formattedValue = entry.value?.toFixed(2) || 'N/A';
                        }
                        
                        return (
                            <p key={index} style={{ color: entry.color }} className="esi-tooltip-entry">
                                {`${displayName}: ${formattedValue}`}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    // Create separate Y-axes domains for ESI (0-100), Forex prices, Stock indices, and Volume ratios
    const getYAxisDomains = () => {
        if (!economicData || economicData.length === 0) return { esi: [0, 100], forex: [0, 1], stock: [0, 1000], volume: [0, 5] };

        let minForex = Infinity, maxForex = -Infinity;
        let minStock = Infinity, maxStock = -Infinity;
        let minVolume = Infinity, maxVolume = -Infinity;
        let hasForexData = false, hasStockData = false, hasVolumeData = false;

        economicData.forEach(point => {
            selectedForexPairs.forEach(pair => {
                const priceKey = `${pair}_price`;
                if (point[priceKey] !== undefined && point[priceKey] !== null) {
                    minForex = Math.min(minForex, point[priceKey]);
                    maxForex = Math.max(maxForex, point[priceKey]);
                    hasForexData = true;
                }
            });

            selectedStockIndices.forEach(symbol => {
                const indexKey = `${symbol}_index`;
                if (point[indexKey] !== undefined && point[indexKey] !== null) {
                    minStock = Math.min(minStock, point[indexKey]);
                    maxStock = Math.max(maxStock, point[indexKey]);
                    hasStockData = true;
                }
            });

            selectedCommodities.forEach(symbol => {
                const commodityKey = `${symbol}_commodity`;
                if (point[commodityKey] !== undefined && point[commodityKey] !== null) {
                    minCommodity = Math.min(minCommodity, point[commodityKey]);
                    maxCommodity = Math.max(maxCommodity, point[commodityKey]);
                    hasCommodityData = true;
                }
            });

            selectedVolumeAssets.forEach(assetId => {
                const volumeKey = `${assetId}_volume_ratio`;
                if (point[volumeKey] !== undefined && point[volumeKey] !== null) {
                    minVolume = Math.min(minVolume, point[volumeKey]);
                    maxVolume = Math.max(maxVolume, point[volumeKey]);
                    hasVolumeData = true;
                }
            });
        });

        const forexPadding = hasForexData ? (maxForex - minForex) * 0.05 : 0;
        const stockPadding = hasStockData ? (maxStock - minStock) * 0.05 : 0;
        const commodityPadding = hasCommodityData ? (maxCommodity - minCommodity) * 0.05 : 0;
        const volumePadding = hasVolumeData ? (maxVolume - minVolume) * 0.05 : 0;
        
        return {
            esi: [0, 100],
            forex: hasForexData ? [minForex - forexPadding, maxForex + forexPadding] : [0, 1],
            stock: hasStockData ? [minStock - stockPadding, maxStock + stockPadding] : [0, 1000],
            commodity: hasCommodityData ? [minCommodity - commodityPadding, maxCommodity + commodityPadding] : [0, 1000],
            volume: hasVolumeData ? [Math.max(0, minVolume - volumePadding), maxVolume + volumePadding] : [0, 5]
        };
    };

    const domains = getYAxisDomains();
    const hasForexData = selectedForexPairs.length > 0;
    const hasStockData = selectedStockIndices.length > 0;
    const hasCommodityData = selectedCommodities.length > 0;
    const hasVolumeData = selectedVolumeAssets.length > 0;

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Economic Strength Index with Multi-Asset and Volume Overlay</h5><br />
                    
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

                        <div className="esi-stock-selector">
                            <h6>Select Stock Indices to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {stockIndices.map(stock => (
                                    <label key={stock.symbol} className="esi-currency-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedStockIndices.includes(stock.symbol)}
                                            onChange={() => handleStockIndexToggle(stock.symbol)}
                                        />
                                        <span className="esi-checkmark stock-checkmark" style={{borderColor: stock.color}}></span>
                                        <span className="esi-currency-label">
                                            {stock.displayName}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-commodity-selector">
                            <h6>Select Commodities to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {commodities.map(commodity => (
                                    <label key={commodity.symbol} className="esi-currency-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCommodities.includes(commodity.symbol)}
                                            onChange={() => handleCommodityToggle(commodity.symbol)}
                                        />
                                        <span className="esi-checkmark commodity-checkmark" style={{borderColor: commodity.color}}></span>
                                        <span className="esi-currency-label">
                                            {commodity.displayName}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>


                        <div className="esi-volume-selector">
                            <h6>Select Assets for Relative Volume Overlay:</h6>
                            <div className="esi-currency-grid">
                                {volumeAssets.map(asset => (
                                    <label key={asset.id} className="esi-currency-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedVolumeAssets.includes(asset.id)}
                                            onChange={() => handleVolumeAssetToggle(asset.id)}
                                        />
                                        <span className="esi-checkmark volume-checkmark" style={{borderColor: asset.color}}></span>
                                        <span className="esi-currency-label">
                                            {asset.name} Volume
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

                    {/* Download Section */}
                    {economicData.length > 0 && (
                        <div className="esi-download-section">
                            <h6>Download Data as CSV:</h6>
                            <div className="esi-download-controls">
                                <div className="esi-download-group">
                                    <span className="download-label">ESI Data:</span>
                                    <div className="download-buttons">
                                        {selectedCurrencies.map(currency => (
                                            <button
                                                key={`esi-${currency}`}
                                                onClick={() => handleDownloadESIData(currency)}
                                                className="esi-download-btn esi-btn"
                                                title={`Download ${currency} ESI data as CSV`}
                                            >
                                                {currency} ESI
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {selectedForexPairs.length > 0 && (
                                    <div className="esi-download-group">
                                        <span className="download-label">Forex Data:</span>
                                        <div className="download-buttons">
                                            {selectedForexPairs.map(pair => (
                                                <button
                                                    key={`forex-${pair}`}
                                                    onClick={() => handleDownloadForexData(pair)}
                                                    className="esi-download-btn forex-btn"
                                                    title={`Download ${pair} price data as CSV`}
                                                >
                                                    {pair}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedStockIndices.length > 0 && (
                                    <div className="esi-download-group">
                                        <span className="download-label">Stock Indices:</span>
                                        <div className="download-buttons">
                                            {selectedStockIndices.map(symbol => {
                                                const stockInfo = stockIndices.find(s => s.symbol === symbol);
                                                return (
                                                    <button
                                                        key={`stock-${symbol}`}
                                                        onClick={() => handleDownloadStockIndexData(symbol)}
                                                        className="esi-download-btn stock-btn"
                                                        title={`Download ${stockInfo?.displayName || symbol} data as CSV`}
                                                    >
                                                        {stockInfo?.displayName || symbol}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selectedCommodities.length > 0 && (
                                    <div className="esi-download-group">
                                        <span className="download-label">Commodities:</span>
                                        <div className="download-buttons">
                                            {selectedCommodities.map(symbol => {
                                                const commodityInfo = commodities.find(c => c.symbol === symbol);
                                                return (
                                                    <button
                                                        key={`commodity-${symbol}`}
                                                        onClick={() => handleDownloadCommodityData(symbol)}
                                                        className="esi-download-btn commodity-btn"
                                                        title={`Download ${commodityInfo?.displayName || symbol} data as CSV`}
                                                    >
                                                        {commodityInfo?.displayName || symbol}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}


                                {selectedVolumeAssets.length > 0 && (
                                    <div className="esi-download-group">
                                        <span className="download-label">Volume Data:</span>
                                        <div className="download-buttons">
                                            {selectedVolumeAssets.map(assetId => {
                                                const assetInfo = volumeAssets.find(a => a.id === assetId);
                                                return (
                                                    <button
                                                        key={`volume-${assetId}`}
                                                        onClick={() => handleDownloadVolumeData(assetId)}
                                                        className="esi-download-btn volume-btn"
                                                        title={`Download ${assetInfo?.name || assetId} relative volume data as CSV`}
                                                    >
                                                        {assetInfo?.name || assetId} Vol
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {(selectedCurrencies.length > 0 || selectedForexPairs.length > 0 || selectedStockIndices.length > 0 || selectedCommodities.length > 0 || selectedVolumeAssets.length > 0) && (
                                    <div className="esi-download-group">
                                        <button
                                            onClick={handleDownloadAllData}
                                            className="esi-download-btn download-all-btn"
                                            title="Download all selected data as separate CSV files"
                                        >
                                            Download All Data
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chart Section */}
                    <div className="esi-chart-container">
                        {loading ? (
                            <div className="esi-loading">
                                <div className="esi-spinner"></div>
                                <p>Calculating Economic Strength Index, Multi-Asset Data, and Relative Volume...</p>
                            </div>
                        ) : economicData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart data={economicData}>
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
                                    {/* First Right Y-Axis for Forex Prices */}
                                    {hasForexData && (
                                        <YAxis 
                                            yAxisId="forex"
                                            orientation="right"
                                            stroke="#6b7280"
                                            tick={{ fontSize: 12 }}
                                            domain={domains.forex}
                                            tickFormatter={(value) => value.toFixed(4)}
                                            label={{ value: 'Forex Price', angle: 90, position: 'insideRight' }}
                                        />
                                    )}
                                    {/* Second Right Y-Axis for Stock Indices */}
                                    {hasStockData && (
                                        <YAxis 
                                            yAxisId="stock"
                                            orientation="right"
                                            stroke="#8b5cf6"
                                            tick={{ fontSize: 12 }}
                                            domain={domains.stock}
                                            tickFormatter={(value) => value.toFixed(0)}
                                            label={{ 
                                                value: 'Stock Index', 
                                                angle: 90, 
                                                position: hasForexData ? 'outside' : 'insideRight',
                                                offset: hasForexData ? 40 : 0
                                            }}
                                        />
                                    )}
                                    {/* Third Right Y-Axis for Volume Ratios */}
                                    {hasVolumeData && (
                                        <YAxis 
                                            yAxisId="volume"
                                            orientation="right"
                                            stroke="#f97316"
                                            tick={{ fontSize: 12 }}
                                            domain={domains.volume}
                                            tickFormatter={(value) => value.toFixed(1) + 'x'}
                                            label={{ 
                                                value: 'Relative Volume', 
                                                angle: 90, 
                                                position: 'outside',
                                                offset: (hasForexData && hasStockData) ? 80 : (hasForexData || hasStockData) ? 40 : 0
                                            }}
                                        />
                                    )}

                                    {/* Fourth Right Y-Axis for Commodities */}
                                    {hasCommodityData && (
                                        <YAxis 
                                            yAxisId="commodity"
                                            orientation="right"
                                            stroke="#fbbf24"
                                            tick={{ fontSize: 12 }}
                                            domain={domains.commodity}
                                            tickFormatter={(value) => '$' + value.toFixed(0)}
                                            label={{ 
                                                value: 'Commodity Price', 
                                                angle: 90, 
                                                position: 'outside',
                                                offset: (hasForexData && hasStockData && hasVolumeData) ? 120 : 
                                                        ((hasForexData && hasStockData) || (hasForexData && hasVolumeData) || (hasStockData && hasVolumeData)) ? 80 :
                                                        (hasForexData || hasStockData || hasVolumeData) ? 40 : 0
                                            }}
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
                                                dot={false}
                                                activeDot={{ r: 5 }}
                                                connectNulls={true}
                                                name={`${currencyCode} ESI`}
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
                                                dot={false}
                                                activeDot={{ r: 4 }}
                                                connectNulls={true}
                                                name={forex?.name || forexPair}
                                            />
                                        );
                                    })}

                                    {/* Stock Index Lines */}
                                    {selectedStockIndices.map(stockSymbol => {
                                        const stock = stockIndices.find(s => s.symbol === stockSymbol);
                                        const indexKey = `${stockSymbol}_index`;
                                        return (
                                            <Line
                                                key={indexKey}
                                                yAxisId="stock"
                                                type="monotone"
                                                dataKey={indexKey}
                                                stroke={stock?.color || '#8b5cf6'}
                                                strokeWidth={2}
                                                strokeDasharray="10 5"
                                                dot={false}
                                                activeDot={{ r: 4 }}
                                                connectNulls={true}
                                                name={stock?.displayName || stockSymbol}
                                            />
                                        );
                                    })}

                                    {/* Volume Lines */}
                                    {selectedVolumeAssets.map(assetId => {
                                        const asset = volumeAssets.find(a => a.id === assetId);
                                        const volumeKey = `${assetId}_volume_ratio`;
                                        return (
                                            <Line
                                                key={volumeKey}
                                                yAxisId="volume"
                                                type="monotone"
                                                dataKey={volumeKey}
                                                stroke={asset?.color || '#f97316'}
                                                strokeWidth={2}
                                                strokeDasharray="2 2"
                                                dot={false}
                                                activeDot={{ r: 3 }}
                                                connectNulls={true}
                                                name={`${asset?.name || assetId} Volume`}
                                            />
                                        );
                                    })}

                                    {/* Commodity Lines */}
                                    {selectedCommodities.map(commoditySymbol => {
                                        const commodity = commodities.find(c => c.symbol === commoditySymbol);
                                        const commodityKey = `${commoditySymbol}_commodity`;
                                        return (
                                            <Line
                                                key={commodityKey}
                                                yAxisId="commodity"
                                                type="monotone"
                                                dataKey={commodityKey}
                                                stroke={commodity?.color || '#fbbf24'}
                                                strokeWidth={2}
                                                strokeDasharray="8 4"
                                                dot={false}
                                                activeDot={{ r: 4 }}
                                                connectNulls={true}
                                                name={commodity?.displayName || commoditySymbol}
                                            />
                                        );
                                    })}

                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="esi-no-data">
                                <p>Select currencies, forex pairs, stock indices, and/or volume assets to view data</p>
                            </div>
                        )}
                    </div>

                    {/* Legend Info */}
                    {(hasForexData || hasStockData || hasVolumeData) && (
                        <div className="esi-legend-info">
                            <div className="legend-item">
                                <div className="legend-line solid"></div>
                                <span>ESI Scores (Left Axis, 0-100 scale)</span>
                            </div>
                            {hasForexData && (
                                <div className="legend-item">
                                    <div className="legend-line dashed"></div>
                                    <span>Forex Prices (Right Axis, Price scale)</span>
                                </div>
                            )}
                            {hasStockData && (
                                <div className="legend-item">
                                    <div className="legend-line dotted"></div>
                                    <span>Stock Indices (Right Axis, Index scale)</span>
                                </div>
                            )}
                            {hasVolumeData && (
                                <div className="legend-item">
                                    <div className="legend-line volume-line"></div>
                                    <span>Relative Volume (Right Axis, Volume ratio)</span>
                                </div>
                            )}
                            {hasCommodityData && (
                                <div className="legend-item">
                                    <div className="legend-line commodity-line"></div>
                                    <span>Commodities (Right Axis, Price scale)</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="esi-info">
                        <h6>About Economic Strength Index with Multi-Asset and Volume Overlay</h6>
                        <p>
                            The Economic Strength Index (ESI) aggregates all economic events for selected currencies, 
                            weighted by impact and normalized for comparison. Forex price and stock index overlays show 
                            actual market movements, while relative volume indicators show trading activity compared to historical averages.
                        </p>
                        <div className="esi-methodology">
                            <strong>Methodology:</strong>
                            <ul>
                                <li>ESI: High impact events (3x), Medium (2x), Low (1x) weight</li>
                                <li>ESI: Values normalized using percentage deviation from forecast</li>
                                <li>Forex: Real-time price data overlayed with dashed lines</li>
                                <li>Stock Indices: Real-time index data overlayed with dotted lines</li>
                                <li>Relative Volume: Current volume / 20-day average volume (dotted lines)</li>
                                <li>Multi-axis: Left for ESI (0-100), Multiple Right axes for prices/volume</li>
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
                .esi-stock-selector h6,
                .esi-volume-selector h6,
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

                .esi-stock-selector {
                    margin: 20px 0;
                    padding: 15px;
                    background: #faf5ff;
                    border-radius: 6px;
                    border-left: 3px solid #8b5cf6;
                }

                .esi-volume-selector {
                    margin: 20px 0;
                    padding: 15px;
                    background: #fef7ed;
                    border-radius: 6px;
                    border-left: 3px solid #f97316;
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

                .esi-checkmark.stock-checkmark {
                    border-radius: 2px;
                    transform: rotate(45deg);
                }

                .esi-checkmark.volume-checkmark {
                    border-radius: 3px;
                    background: linear-gradient(45deg, transparent 40%, currentColor 40%, currentColor 60%, transparent 60%);
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

                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark.stock-checkmark::after {
                    transform: rotate(-45deg);
                }

                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark.volume-checkmark::after {
                    content: '~';
                    font-size: 14px;
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

                /* Download Section Styles */
                .esi-download-section {
                    background: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #0ea5e9;
                }

                .esi-download-section h6 {
                    color: #0c4a6e;
                    margin-bottom: 15px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .esi-download-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .esi-download-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .download-label {
                    font-weight: 600;
                    color: #374151;
                    min-width: 110px;
                    font-size: 13px;
                }

                .download-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .esi-download-btn {
                    padding: 8px 16px;
                    border: 1px solid transparent;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 80px;
                }

                .esi-download-btn.esi-btn {
                    background: #3b82f6;
                    color: white;
                    border-color: #2563eb;
                }

                .esi-download-btn.esi-btn:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
                }

                .esi-download-btn.forex-btn {
                    background: #f59e0b;
                    color: white;
                    border-color: #d97706;
                }

                .esi-download-btn.forex-btn:hover {
                    background: #d97706;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);
                }

                .esi-download-btn.stock-btn {
                    background: #8b5cf6;
                    color: white;
                    border-color: #7c3aed;
                }

                .esi-download-btn.stock-btn:hover {
                    background: #7c3aed;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
                }

                .esi-download-btn.volume-btn {
                    background: #f97316;
                    color: white;
                    border-color: #ea580c;
                }

                .esi-download-btn.volume-btn:hover {
                    background: #ea580c;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);
                }

                .esi-download-btn.download-all-btn {
                    background: #10b981;
                    color: white;
                    border-color: #059669;
                    font-weight: 600;
                    padding: 10px 20px;
                }

                .esi-download-btn.download-all-btn:hover {
                    background: #059669;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
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
                    flex-wrap: wrap;
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

                .legend-line.dotted {
                    background: linear-gradient(to right, #8b5cf6 30%, transparent 30%);
                    background-size: 6px 2px;
                }

                .legend-line.volume-line {
                    background: linear-gradient(to right, #f97316 20%, transparent 20%);
                    background-size: 4px 2px;
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
                    max-width: 250px;
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

                .esi-commodity-selector {
                    margin: 20px 0;
                    padding: 15px;
                    background: #fef3c7;
                    border-radius: 6px;
                    border-left: 3px solid #fbbf24;
                }

                .esi-checkmark.commodity-checkmark {
                    border-radius: 50%;
                    position: relative;
                }

                .esi-checkmark.commodity-checkmark::before {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: currentColor;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                }

                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark.commodity-checkmark::before {
                    opacity: 1;
                }

                .esi-download-btn.commodity-btn {
                    background: #fbbf24;
                    color: #78350f;
                    border-color: #f59e0b;
                    font-weight: 600;
                }

                .esi-download-btn.commodity-btn:hover {
                    background: #f59e0b;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
                }

                .legend-line.commodity-line {
                    background: linear-gradient(to right, #fbbf24 40%, transparent 40%);
                    background-size: 10px 2px;
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

                    .esi-download-section {
                        padding: 15px;
                    }

                    .esi-download-group {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .download-label {
                        min-width: auto;
                    }

                    .download-buttons {
                        width: 100%;
                    }

                    .esi-download-btn {
                        flex: 1;
                        min-width: auto;
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

                    .download-buttons {
                        flex-direction: column;
                    }

                    .esi-download-btn {
                        width: 100%;
                    }

                    .esi-legend-info {
                        gap: 10px;
                    }

                    .legend-item {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
}