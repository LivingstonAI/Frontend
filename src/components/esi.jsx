import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import Header from "./header";
import SideNavs from "./side_navs";

export default function EconomicStrengthIndex() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // --- State Management ---
    const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);
    const [selectedForexPairs, setSelectedForexPairs] = useState([]);
    const [selectedStockIndices, setSelectedStockIndices] = useState([]);
    const [selectedCommodities, setSelectedCommodities] = useState([]);
    const [selectedVolumeAssets, setSelectedVolumeAssets] = useState([]);
    const [economicData, setEconomicData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState('30d');

    // --- AI/ML State ---
    const [aiInsights, setAiInsights] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisStatus, setAnalysisStatus] = useState('');
    
    // --- Asset Definitions ---
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

    const volumeAssets = [
        ...forexPairs.map(fp => ({ ...fp, type: 'forex', id: fp.pair })),
        ...stockIndices.map(si => ({ ...si, type: 'stock', id: si.symbol, name: si.displayName })),
        ...commodities.map(cm => ({ ...cm, type: 'commodity', id: cm.symbol, name: cm.displayName }))
    ];

    // --- Data Fetching ---
    const fetchEconomicStrengthData = async () => {
        setLoading(true);
        setAiInsights([]); // Reset AI when new data comes in
        setAnalysisProgress(0);
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
                if (data.chart_data && data.chart_data.length > 0) {
                    setEconomicData(data.chart_data);
                }
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
    }, [selectedCurrencies, selectedForexPairs, selectedStockIndices, selectedVolumeAssets, selectedCommodities, dateRange]);

    // --- Asynchronous Chunked ML Analysis ---
    const runMLAnalysis = async () => {
        if (!economicData || economicData.length < 5) return;
        
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setAnalysisStatus('Preparing data...');
        setAiInsights([]);

        // Allow UI to render the "Analyzing" state before starting CPU heavy work
        await new Promise(resolve => setTimeout(resolve, 100));

        // 1. Identify Keys
        const activeKeys = [];
        const prettyNames = {};

        const addKey = (key, name) => {
            const sample = economicData.find(d => d[key] !== undefined && d[key] !== null);
            if (sample) {
                activeKeys.push(key);
                prettyNames[key] = name;
            }
        };

        selectedCurrencies.forEach(c => addKey(c, `${c} ESI`));
        selectedForexPairs.forEach(f => {
            const pairName = forexPairs.find(p => p.pair === f)?.name || f;
            addKey(`${f}_price`, pairName);
        });
        selectedStockIndices.forEach(s => {
            const stockName = stockIndices.find(i => i.symbol === s)?.displayName || s;
            addKey(`${s}_index`, stockName);
        });
        selectedCommodities.forEach(c => {
            const comName = commodities.find(i => i.symbol === c)?.displayName || c;
            addKey(`${c}_commodity`, comName);
        });
        selectedVolumeAssets.forEach(v => {
            const volName = volumeAssets.find(a => a.id === v)?.name || v;
            addKey(`${v}_volume_ratio`, `${volName} Volume`);
        });

        // 2. Generate List of Pairs to Process
        const pairsToProcess = [];
        for (let i = 0; i < activeKeys.length; i++) {
            for (let j = i + 1; j < activeKeys.length; j++) {
                pairsToProcess.push({ keyA: activeKeys[i], keyB: activeKeys[j] });
            }
        }

        const totalPairs = pairsToProcess.length;
        const findings = [];
        const batchSize = 5; // Process 5 pairs at a time to keep UI responsive

        // 3. Process Batches Asynchronously
        for (let i = 0; i < totalPairs; i += batchSize) {
            // Calculate Progress
            const currentProgress = Math.round((i / totalPairs) * 100);
            setAnalysisProgress(currentProgress);
            setAnalysisStatus(`Analyzing pair ${i + 1} of ${totalPairs}...`);
            
            // Yield control to the main thread so React can render the progress bar
            await new Promise(resolve => setTimeout(resolve, 10));

            // Run TensorFlow operations synchronously within the batch
            tf.tidy(() => {
                const end = Math.min(i + batchSize, totalPairs);
                for (let j = i; j < end; j++) {
                    const { keyA, keyB } = pairsToProcess[j];
                    
                    // Filter clean data
                    const values = economicData.filter(row => 
                        row[keyA] !== null && row[keyA] !== undefined && 
                        row[keyB] !== null && row[keyB] !== undefined
                    );

                    if (values.length < 10) return;

                    const inputA = values.map(v => v[keyA]);
                    const inputB = values.map(v => v[keyB]);

                    const tensorA = tf.tensor1d(inputA);
                    const tensorB = tf.tensor1d(inputB);

                    // Z-Score Normalization
                    const meanA = tensorA.mean();
                    const stdA = tensorA.sub(meanA).square().mean().sqrt();
                    const normA = tensorA.sub(meanA).div(stdA);

                    const meanB = tensorB.mean();
                    const stdB = tensorB.sub(meanB).square().mean().sqrt();
                    const normB = tensorB.sub(meanB).div(stdB);

                    // Pearson Correlation
                    const correlationTensor = normA.mul(normB).mean();
                    const correlation = correlationTensor.dataSync()[0];

                    findings.push({
                        pair: [prettyNames[keyA], prettyNames[keyB]],
                        score: correlation,
                        type: 'correlation'
                    });
                }
            });
        }

        // 4. Finalize Results
        setAnalysisProgress(100);
        setAnalysisStatus('Finalizing insights...');
        
        const insights = findings.map(f => {
            const [item1, item2] = f.pair;
            const score = f.score;
            let description = '';
            let styleClass = '';
            let term = '';

            if (score > 0.8) {
                term = "Strong Positive Correlation";
                description = `Data indicates ${item1} and ${item2} move in near-perfect lockstep. When one rises, the other almost always follows.`;
                styleClass = 'insight-positive-strong';
            } else if (score > 0.5) {
                term = "Positive Trend";
                description = `There is a noticeable relationship where ${item1} and ${item2} tend to move in the same direction.`;
                styleClass = 'insight-positive';
            } else if (score < -0.8) {
                term = "Strong Inverse Relationship";
                description = `${item1} acts as a mirror to ${item2}. Usually, when one strengthens, the other weakens drastically.`;
                styleClass = 'insight-negative-strong';
            } else if (score < -0.5) {
                term = "Inverse Trend";
                description = `Generally, ${item1} and ${item2} move in opposite directions.`;
                styleClass = 'insight-negative';
            } else {
                return null;
            }

            return {
                id: `${item1}-${item2}`,
                title: `${item1} vs ${item2}`,
                term,
                description,
                score: score.toFixed(2),
                styleClass
            };
        }).filter(Boolean);

        insights.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

        setAiInsights(insights);
        setIsAnalyzing(false);
    };

    // --- Toggle Handlers ---
    const handleCurrencyToggle = (c) => setSelectedCurrencies(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
    const handleForexToggle = (f) => setSelectedForexPairs(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
    const handleStockIndexToggle = (s) => setSelectedStockIndices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    const handleCommodityToggle = (c) => setSelectedCommodities(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
    const handleVolumeAssetToggle = (v) => setSelectedVolumeAssets(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

    // --- CSV Download Functions ---
    const convertToCSV = (data, headers) => {
        if (!data || data.length === 0) return '';
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
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
        if (!economicData || economicData.length === 0) return;
        const esiData = economicData.filter(row => row[currencyCode] != null).map(row => ({ Date: row.date, ESI_Score: row[currencyCode].toFixed(2) }));
        if (esiData.length === 0) return;
        downloadCSV(convertToCSV(esiData, ['Date', 'ESI_Score']), `${currencyCode}_ESI_${dateRange}.csv`);
    };

    const handleDownloadForexData = (forexPair) => {
        if (!economicData || economicData.length === 0) return;
        const priceKey = `${forexPair}_price`;
        const forexData = economicData.filter(row => row[priceKey] != null).map(row => ({ Date: row.date, Price: row[priceKey].toFixed(4) }));
        if (forexData.length === 0) return;
        downloadCSV(convertToCSV(forexData, ['Date', 'Price']), `${forexPair}_Price_${dateRange}.csv`);
    };

    const handleDownloadStockIndexData = (stockSymbol) => {
        if (!economicData || economicData.length === 0) return;
        const indexKey = `${stockSymbol}_index`;
        const stockData = economicData.filter(row => row[indexKey] != null).map(row => ({ Date: row.date, Index_Value: row[indexKey].toFixed(2) }));
        if (stockData.length === 0) return;
        downloadCSV(convertToCSV(stockData, ['Date', 'Index_Value']), `${stockSymbol}_Index_${dateRange}.csv`);
    };

    const handleDownloadCommodityData = (commoditySymbol) => {
        if (!economicData || economicData.length === 0) return;
        const commodityKey = `${commoditySymbol}_commodity`;
        const commodityData = economicData.filter(row => row[commodityKey] != null).map(row => ({ Date: row.date, Price: row[commodityKey].toFixed(2) }));
        if (commodityData.length === 0) return;
        downloadCSV(convertToCSV(commodityData, ['Date', 'Price']), `${commoditySymbol}_Price_${dateRange}.csv`);
    };

    const handleDownloadVolumeData = (assetId) => {
        if (!economicData || economicData.length === 0) return;
        const volumeKey = `${assetId}_volume_ratio`;
        const volumeData = economicData.filter(row => row[volumeKey] != null).map(row => ({ Date: row.date, Relative_Volume: row[volumeKey].toFixed(2) }));
        if (volumeData.length === 0) return;
        downloadCSV(convertToCSV(volumeData, ['Date', 'Relative_Volume']), `${assetId}_RelativeVolume_${dateRange}.csv`);
    };

    const handleDownloadAllData = () => {
        let delay = 0;
        const step = 100;
        selectedCurrencies.forEach(c => setTimeout(() => handleDownloadESIData(c), delay += step));
        selectedForexPairs.forEach(f => setTimeout(() => handleDownloadForexData(f), delay += step));
        selectedStockIndices.forEach(s => setTimeout(() => handleDownloadStockIndexData(s), delay += step));
        selectedCommodities.forEach(c => setTimeout(() => handleDownloadCommodityData(c), delay += step));
        selectedVolumeAssets.forEach(v => setTimeout(() => handleDownloadVolumeData(v), delay += step));
    };

    // --- Tooltip & Axis ---
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
                        } else if (isCommodity) {
                            const symbol = entry.dataKey.replace('_commodity', '');
                            const commodityInfo = commodities.find(c => c.symbol === symbol);
                            displayName = commodityInfo ? commodityInfo.displayName : symbol;
                            formattedValue = entry.value?.toFixed(2) || 'N/A';
                         } else {
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

    const getYAxisDomains = () => {
        if (!economicData || economicData.length === 0) return { esi: [0, 100], forex: [0, 1], stock: [0, 1000], volume: [0, 5], commodity: [0, 1000] };
        let minForex = Infinity, maxForex = -Infinity;
        let minStock = Infinity, maxStock = -Infinity;
        let minVolume = Infinity, maxVolume = -Infinity;
        let minCommodity = Infinity, maxCommodity = -Infinity;
        let hasForex = false, hasStock = false, hasVolume = false, hasCommodity = false;

        economicData.forEach(point => {
            selectedForexPairs.forEach(pair => { const val = point[`${pair}_price`]; if (val) { minForex = Math.min(minForex, val); maxForex = Math.max(maxForex, val); hasForex = true; } });
            selectedStockIndices.forEach(sym => { const val = point[`${sym}_index`]; if (val) { minStock = Math.min(minStock, val); maxStock = Math.max(maxStock, val); hasStock = true; } });
            selectedCommodities.forEach(sym => { const val = point[`${sym}_commodity`]; if (val) { minCommodity = Math.min(minCommodity, val); maxCommodity = Math.max(maxCommodity, val); hasCommodity = true; } });
            selectedVolumeAssets.forEach(id => { const val = point[`${id}_volume_ratio`]; if (val) { minVolume = Math.min(minVolume, val); maxVolume = Math.max(maxVolume, val); hasVolume = true; } });
        });

        const pad = (min, max) => (max - min) * 0.05;
        return {
            esi: [0, 100],
            forex: hasForex ? [minForex - pad(minForex, maxForex), maxForex + pad(minForex, maxForex)] : [0, 1],
            stock: hasStock ? [minStock - pad(minStock, maxStock), maxStock + pad(minStock, maxStock)] : [0, 1000],
            commodity: hasCommodity ? [minCommodity - pad(minCommodity, maxCommodity), maxCommodity + pad(minCommodity, maxCommodity)] : [0, 1000],
            volume: hasVolume ? [Math.max(0, minVolume - pad(minVolume, maxVolume)), maxVolume + pad(minVolume, maxVolume)] : [0, 5]
        };
    };

    const domains = getYAxisDomains();
    const hasForexData = selectedForexPairs.length > 0;
    const hasStockData = selectedStockIndices.length > 0;
    const hasCommodityData = selectedCommodities.length > 0;
    const hasVolumeData = selectedVolumeAssets.length > 0;

    return (
        <div>
            <div className="header"><Header /></div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Economic Strength Index with AI Analysis</h5><br />
                    
                    {/* Controls Section */}
                    <div className="esi-controls">
                        <div className="esi-currency-selector">
                            <h6>Select ESI Currencies:</h6>
                            <div className="esi-currency-grid">
                                {currencies.map(currency => (
                                    <label key={currency.code} className="esi-currency-checkbox">
                                        <input type="checkbox" checked={selectedCurrencies.includes(currency.code)} onChange={() => handleCurrencyToggle(currency.code)} />
                                        <span className="esi-checkmark" style={{borderColor: currency.color}}></span>
                                        <span className="esi-currency-label">{currency.code} - {currency.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-forex-selector">
                            <h6>Select Forex Pairs to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {forexPairs.map(forex => (
                                    <label key={forex.pair} className="esi-currency-checkbox">
                                        <input type="checkbox" checked={selectedForexPairs.includes(forex.pair)} onChange={() => handleForexToggle(forex.pair)} />
                                        <span className="esi-checkmark forex-checkmark" style={{borderColor: forex.color}}></span>
                                        <span className="esi-currency-label">{forex.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-stock-selector">
                            <h6>Select Stock Indices to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {stockIndices.map(stock => (
                                    <label key={stock.symbol} className="esi-currency-checkbox">
                                        <input type="checkbox" checked={selectedStockIndices.includes(stock.symbol)} onChange={() => handleStockIndexToggle(stock.symbol)} />
                                        <span className="esi-checkmark stock-checkmark" style={{borderColor: stock.color}}></span>
                                        <span className="esi-currency-label">{stock.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-commodity-selector">
                            <h6>Select Commodities to Overlay:</h6>
                            <div className="esi-currency-grid">
                                {commodities.map(commodity => (
                                    <label key={commodity.symbol} className="esi-currency-checkbox">
                                        <input type="checkbox" checked={selectedCommodities.includes(commodity.symbol)} onChange={() => handleCommodityToggle(commodity.symbol)} />
                                        <span className="esi-checkmark commodity-checkmark" style={{borderColor: commodity.color}}></span>
                                        <span className="esi-currency-label">{commodity.displayName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="esi-volume-selector">
                            <h6>Select Assets for Relative Volume Overlay:</h6>
                            <div className="esi-currency-grid">
                                {volumeAssets.map(asset => (
                                    <label key={asset.id} className="esi-currency-checkbox">
                                        <input type="checkbox" checked={selectedVolumeAssets.includes(asset.id)} onChange={() => handleVolumeAssetToggle(asset.id)} />
                                        <span className="esi-checkmark volume-checkmark" style={{borderColor: asset.color}}></span>
                                        <span className="esi-currency-label">{asset.name} Volume</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className="esi-date-range-selector">
                            <h6>Time Range:</h6>
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="esi-select">
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="180d">Last 6 Months</option>
                                <option value="365d">Last Year</option>
                            </select>
                        </div>
                    </div>

                    {/* --- NEW: AI / ML ANALYSIS SECTION (BLUE/WHITE THEME) --- */}
                    <div className="ai-analysis-container">
                        <div className="ai-header">
                            <div className="ai-title-group">
                                <h6>🤖 TensorFlow.js AI Relationship Analyzer</h6>
                                {isAnalyzing && <span className="ai-status-text">{analysisStatus}</span>}
                            </div>
                            <button 
                                onClick={runMLAnalysis} 
                                disabled={isAnalyzing || economicData.length === 0}
                                className="ai-analyze-btn"
                            >
                                {isAnalyzing ? 'Processing...' : 'Analyze Relationships'}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {isAnalyzing && (
                            <div className="ai-progress-track">
                                <div className="ai-progress-fill" style={{width: `${analysisProgress}%`}}></div>
                            </div>
                        )}

                        {aiInsights.length > 0 && (
                            <div className="ai-results-grid">
                                {aiInsights.map(insight => (
                                    <div key={insight.id} className={`ai-card ${insight.styleClass}`}>
                                        <div className="ai-card-header">
                                            <span className="ai-pair-title">{insight.title}</span>
                                            <span className="ai-score-badge">Corr: {insight.score}</span>
                                        </div>
                                        <div className="ai-card-body">
                                            <strong>{insight.term}</strong>
                                            <p>{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {aiInsights.length === 0 && !isAnalyzing && economicData.length > 0 && (
                            <p className="ai-hint">Select your assets above and click "Analyze Relationships" to perform real-time statistical regression.</p>
                        )}
                    </div>

                    {/* Download Section */}
                    {economicData.length > 0 && (
                        <div className="esi-download-section">
                            <h6>Download Data as CSV:</h6>
                            <div className="esi-download-controls">
                                <div className="esi-download-group">
                                    <button onClick={handleDownloadAllData} className="esi-download-btn download-all-btn">Download All Data</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chart Section */}
                    <div className="esi-chart-container">
                        {loading ? (
                            <div className="esi-loading">
                                <div className="esi-spinner"></div>
                                <p>Loading Data...</p>
                            </div>
                        ) : economicData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart data={economicData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" stroke="#374151" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="esi" stroke="#374151" tick={{ fontSize: 12 }} domain={domains.esi} label={{ value: 'ESI Score', angle: -90, position: 'insideLeft' }} />
                                    
                                    {hasForexData && <YAxis yAxisId="forex" orientation="right" stroke="#6b7280" tick={{ fontSize: 12 }} domain={domains.forex} tickFormatter={(v) => v.toFixed(4)} label={{ value: 'Forex Price', angle: 90, position: 'insideRight' }} />}
                                    {hasStockData && <YAxis yAxisId="stock" orientation="right" stroke="#8b5cf6" tick={{ fontSize: 12 }} domain={domains.stock} tickFormatter={(v) => v.toFixed(0)} label={{ value: 'Stock Index', angle: 90, position: 'outside', offset: 40 }} />}
                                    {hasVolumeData && <YAxis yAxisId="volume" orientation="right" stroke="#f97316" tick={{ fontSize: 12 }} domain={domains.volume} tickFormatter={(v) => v.toFixed(1) + 'x'} label={{ value: 'Rel Volume', angle: 90, position: 'outside', offset: 80 }} />}
                                    {hasCommodityData && <YAxis yAxisId="commodity" orientation="right" stroke="#fbbf24" tick={{ fontSize: 12 }} domain={domains.commodity} tickFormatter={(v) => '$' + v.toFixed(0)} label={{ value: 'Commodity', angle: 90, position: 'outside', offset: 120 }} />}

                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    
                                    {selectedCurrencies.map(c => <Line key={c} yAxisId="esi" type="monotone" dataKey={c} stroke={currencies.find(i => i.code === c)?.color || '#6b7280'} strokeWidth={2} dot={false} connectNulls={true} name={`${c} ESI`} />)}
                                    {selectedForexPairs.map(f => <Line key={`${f}_price`} yAxisId="forex" type="monotone" dataKey={`${f}_price`} stroke={forexPairs.find(i => i.pair === f)?.color || '#6b7280'} strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls={true} name={forexPairs.find(i => i.pair === f)?.name || f} />)}
                                    {selectedStockIndices.map(s => <Line key={`${s}_index`} yAxisId="stock" type="monotone" dataKey={`${s}_index`} stroke={stockIndices.find(i => i.symbol === s)?.color || '#8b5cf6'} strokeWidth={2} strokeDasharray="10 5" dot={false} connectNulls={true} name={stockIndices.find(i => i.symbol === s)?.displayName || s} />)}
                                    {selectedCommodities.map(c => <Line key={`${c}_commodity`} yAxisId="commodity" type="monotone" dataKey={`${c}_commodity`} stroke={commodities.find(i => i.symbol === c)?.color || '#fbbf24'} strokeWidth={2} strokeDasharray="8 4" dot={false} connectNulls={true} name={commodities.find(i => i.symbol === c)?.displayName || c} />)}
                                    {selectedVolumeAssets.map(v => <Line key={`${v}_volume_ratio`} yAxisId="volume" type="monotone" dataKey={`${v}_volume_ratio`} stroke={volumeAssets.find(i => i.id === v)?.color || '#f97316'} strokeWidth={2} strokeDasharray="2 2" dot={false} connectNulls={true} name={`${volumeAssets.find(i => i.id === v)?.name || v} Volume`} />)}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="esi-no-data"><p>Select currencies, forex pairs, stock indices, and/or volume assets to view data</p></div>
                        )}
                    </div>

                    {/* Legend Info */}
                    {(hasForexData || hasStockData || hasVolumeData || hasCommodityData) && (
                        <div className="esi-legend-info">
                            <div className="legend-item"><div className="legend-line solid"></div><span>ESI Scores (Left Axis)</span></div>
                            {hasForexData && <div className="legend-item"><div className="legend-line dashed"></div><span>Forex Prices</span></div>}
                            {hasStockData && <div className="legend-item"><div className="legend-line dotted"></div><span>Stock Indices</span></div>}
                            {hasCommodityData && <div className="legend-item"><div className="legend-line commodity-line"></div><span>Commodities</span></div>}
                            {hasVolumeData && <div className="legend-item"><div className="legend-line volume-line"></div><span>Relative Volume</span></div>}
                        </div>
                    )}
                    
                    <div className="esi-info">
                        <h6>About this Dashboard</h6>
                        <p>The ESI aggregates economic events weighted by impact. Overlays show real market correlations.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .esi-controls { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .esi-currency-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
                .esi-currency-checkbox { display: flex; align-items: center; cursor: pointer; padding: 8px 12px; border-radius: 6px; transition: background-color 0.2s; }
                .esi-currency-checkbox:hover { background-color: #e2e8f0; }
                .esi-currency-checkbox input[type="checkbox"] { display: none; }
                .esi-checkmark { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center; }
                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark { background-color: currentColor; border-color: currentColor; }
                .esi-currency-checkbox input[type="checkbox"]:checked + .esi-checkmark::after { content: '✓'; color: white; font-size: 12px; font-weight: bold; }
                .esi-select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white; }
                .forex-checkmark { border-radius: 50%; }
                .stock-checkmark { border-radius: 2px; transform: rotate(45deg); }
                .commodity-checkmark { border-radius: 50%; }
                .volume-checkmark { background: linear-gradient(45deg, transparent 40%, currentColor 40%, currentColor 60%, transparent 60%); }

                /* Chart & General */
                .esi-chart-container { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
                .esi-loading, .esi-no-data { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #6b7280; }
                .esi-spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .esi-tooltip { background: rgba(15, 23, 42, 0.95); border: 1px solid #334155; border-radius: 6px; padding: 12px; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .esi-tooltip-label { margin: 0 0 8px 0; font-weight: 600; color: #e2e8f0; }
                .esi-tooltip-entry { margin: 4px 0; font-size: 14px; }

                /* Download Section */
                .esi-download-section { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
                .esi-download-btn { padding: 8px 16px; border: 1px solid transparent; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .download-all-btn { background: #10b981; color: white; border-color: #059669; font-weight: 600; padding: 10px 20px; }
                .download-all-btn:hover { background: #059669; transform: translateY(-1px); }

                /* NEW: AI Analysis Styles (Blue/White Theme) */
                .ai-analysis-container {
                    background: #eff6ff; /* Light Blue Background */
                    color: #1e293b;
                    padding: 20px;
                    border-radius: 12px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid #bfdbfe; /* Light Blue Border */
                }

                .ai-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #dbeafe;
                    padding-bottom: 15px;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .ai-title-group h6 { margin: 0; font-size: 1.1rem; color: #1e40af; display: flex; align-items: center; gap: 8px; }
                .ai-status-text { font-size: 0.85rem; color: #64748b; margin-left: 10px; font-style: italic; }

                .ai-analyze-btn {
                    background: #2563eb; /* Solid Blue */
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
                }

                .ai-analyze-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
                .ai-analyze-btn:disabled { background: #93c5fd; cursor: not-allowed; box-shadow: none; }

                .ai-progress-track {
                    width: 100%;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                
                .ai-progress-fill {
                    height: 100%;
                    background: #3b82f6;
                    transition: width 0.1s linear;
                }

                .ai-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
                
                .ai-card { 
                    background: white; 
                    border-radius: 8px; 
                    padding: 15px; 
                    border: 1px solid #e2e8f0; 
                    transition: transform 0.2s, box-shadow 0.2s; 
                }
                .ai-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                
                .ai-card-header { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: flex-start; }
                .ai-pair-title { font-weight: 700; font-size: 0.9rem; color: #1e3a8a; } /* Dark Blue Text */
                .ai-score-badge { background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-family: monospace; font-size: 0.8rem; white-space: nowrap; }
                
                .ai-card-body p { font-size: 0.85rem; color: #475569; margin: 5px 0 0 0; line-height: 1.4; }
                .ai-card-body strong { display: block; font-size: 0.9rem; margin-bottom: 4px; }
                
                .insight-positive-strong { border-left: 4px solid #22c55e; background: #f0fdf4; }
                .insight-positive-strong strong { color: #16a34a; }
                
                .insight-positive { border-left: 4px solid #86efac; }
                .insight-positive strong { color: #15803d; }
                
                .insight-negative-strong { border-left: 4px solid #ef4444; background: #fef2f2; }
                .insight-negative-strong strong { color: #b91c1c; }
                
                .insight-negative { border-left: 4px solid #fca5a5; }
                .insight-negative strong { color: #b91c1c; }
                
                .ai-hint { text-align: center; color: #64748b; font-style: italic; margin: 20px 0; }

                /* Legend Lines */
                .esi-legend-info { display: flex; justify-content: center; gap: 20px; margin: 15px 0; flex-wrap: wrap; }
                .legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; }
                .legend-line { width: 30px; height: 2px; background: #6b7280; }
                .legend-line.solid { background: #2563eb; }
                .legend-line.dashed { background: linear-gradient(to right, #f59e0b 50%, transparent 50%); background-size: 8px 2px; }
                .legend-line.dotted { background: linear-gradient(to right, #8b5cf6 30%, transparent 30%); background-size: 6px 2px; }
                .legend-line.volume-line { background: linear-gradient(to right, #f97316 20%, transparent 20%); background-size: 4px 2px; }
                .legend-line.commodity-line { background: linear-gradient(to right, #fbbf24 40%, transparent 40%); background-size: 10px 2px; }

                @media (max-width: 768px) {
                    .esi-currency-grid { grid-template-columns: 1fr; }
                    .ai-header { flex-direction: column; align-items: flex-start; }
                    .ai-analyze-btn { width: 100%; margin-top: 10px; }
                }
            `}</style>
        </div>
    );
}