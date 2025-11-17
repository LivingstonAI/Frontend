import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIStockScreener() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const popularStocks = [
        // Tech Giants
        { name: "Apple", symbol: "AAPL", category: "Tech Giants" },
        { name: "Microsoft", symbol: "MSFT", category: "Tech Giants" },
        { name: "Google (Alphabet)", symbol: "GOOGL", category: "Tech Giants" },
        { name: "Amazon", symbol: "AMZN", category: "Tech Giants" },
        { name: "Meta (Facebook)", symbol: "META", category: "Tech Giants" },
        { name: "Tesla", symbol: "TSLA", category: "Tech Giants" },
        { name: "NVIDIA", symbol: "NVDA", category: "Tech Giants" },
        { name: "Netflix", symbol: "NFLX", category: "Tech Giants" },
        
        // Financial Services
        { name: "JPMorgan Chase", symbol: "JPM", category: "Financial" },
        { name: "Bank of America", symbol: "BAC", category: "Financial" },
        { name: "Wells Fargo", symbol: "WFC", category: "Financial" },
        { name: "Goldman Sachs", symbol: "GS", category: "Financial" },
        { name: "Morgan Stanley", symbol: "MS", category: "Financial" },
        { name: "Visa", symbol: "V", category: "Financial" },
        { name: "Mastercard", symbol: "MA", category: "Financial" },
        { name: "American Express", symbol: "AXP", category: "Financial" },
        
        // Consumer & Retail
        { name: "Walmart", symbol: "WMT", category: "Retail" },
        { name: "Target", symbol: "TGT", category: "Retail" },
        { name: "Home Depot", symbol: "HD", category: "Retail" },
        { name: "Nike", symbol: "NKE", category: "Retail" },
        { name: "Starbucks", symbol: "SBUX", category: "Retail" },
        { name: "McDonald's", symbol: "MCD", category: "Retail" },
        { name: "Coca-Cola", symbol: "KO", category: "Retail" },
        { name: "PepsiCo", symbol: "PEP", category: "Retail" },
        
        // Healthcare & Pharma
        { name: "Johnson & Johnson", symbol: "JNJ", category: "Healthcare" },
        { name: "Pfizer", symbol: "PFE", category: "Healthcare" },
        { name: "UnitedHealth", symbol: "UNH", category: "Healthcare" },
        { name: "Moderna", symbol: "MRNA", category: "Healthcare" },
        { name: "AbbVie", symbol: "ABBV", category: "Healthcare" },
        { name: "Eli Lilly", symbol: "LLY", category: "Healthcare" },
        
        // Semiconductor & Hardware
        { name: "Intel", symbol: "INTC", category: "Semiconductors" },
        { name: "AMD", symbol: "AMD", category: "Semiconductors" },
        { name: "Qualcomm", symbol: "QCOM", category: "Semiconductors" },
        { name: "Broadcom", symbol: "AVGO", category: "Semiconductors" },
        { name: "Texas Instruments", symbol: "TXN", category: "Semiconductors" },
        
        // Energy
        { name: "ExxonMobil", symbol: "XOM", category: "Energy" },
        { name: "Chevron", symbol: "CVX", category: "Energy" },
        { name: "ConocoPhillips", symbol: "COP", category: "Energy" },
        { name: "NextEra Energy", symbol: "NEE", category: "Energy" },
        
        // Entertainment & Media
        { name: "Disney", symbol: "DIS", category: "Media" },
        { name: "Comcast", symbol: "CMCSA", category: "Media" },
        { name: "Warner Bros Discovery", symbol: "WBD", category: "Media" },
        
        // Software & Cloud
        { name: "Salesforce", symbol: "CRM", category: "Software" },
        { name: "Adobe", symbol: "ADBE", category: "Software" },
        { name: "Oracle", symbol: "ORCL", category: "Software" },
        { name: "ServiceNow", symbol: "NOW", category: "Software" },
        
        // Automotive
        { name: "Ford", symbol: "F", category: "Automotive" },
        { name: "General Motors", symbol: "GM", category: "Automotive" },
        { name: "Rivian", symbol: "RIVN", category: "Automotive" },
        { name: "Lucid", symbol: "LCID", category: "Automotive" },
        
        // Aerospace & Defense
        { name: "Boeing", symbol: "BA", category: "Aerospace" },
        { name: "Lockheed Martin", symbol: "LMT", category: "Aerospace" },
        
        // E-commerce & Fintech
        { name: "PayPal", symbol: "PYPL", category: "Fintech" },
        { name: "Square (Block)", symbol: "SQ", category: "Fintech" },
        { name: "Shopify", symbol: "SHOP", category: "Fintech" },
        { name: "Coinbase", symbol: "COIN", category: "Fintech" },
    ];
    
    const [ticker, setTicker] = useState('');
    const [stockData, setStockData] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [financialsView, setFinancialsView] = useState('table');
    const [earningsView, setEarningsView] = useState('table');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const fetchStockData = async (symbol) => {
        if (!symbol) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${symbol}`);
            const data = await response.json();
            
            if (response.ok) {
                setStockData(data.stock_info);
                setFinancials(data.financials);
                setEarnings(data.earnings);
                setNews(data.news || []);
                setTicker(symbol);
            } else {
                setError(data.error || 'Failed to fetch stock data');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (ticker) {
            fetchStockData(ticker);
        }
    };

    const handleStockClick = (symbol) => {
        fetchStockData(symbol);
        setShowModal(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatNewsDate = (timestamp) => {
        if (!timestamp || timestamp === 'N/A') return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timestamp;
        }
    };

    const prepareFinancialsChartData = () => {
        if (!financials || !financials.data || !financials.columns) return [];
        
        const chartData = financials.columns.map((year, idx) => {
            const dataPoint = { year };
            let hasData = false;
            
            financials.data.forEach(row => {
                if (row.values && row.values[idx] !== null && row.values[idx] !== 0) {
                    dataPoint[row.metric] = (row.values[idx] / 1e9).toFixed(2);
                    hasData = true;
                }
            });
            
            return hasData ? dataPoint : null;
        }).filter(item => item !== null).reverse();
        
        return chartData;
    };

    const prepareEarningsChartData = () => {
        if (!earnings || earnings.length === 0) return [];
        
        return earnings.map(earning => {
            if ((earning.revenue && earning.revenue !== 0) || (earning.earnings && earning.earnings !== 0)) {
                return {
                    quarter: earning.quarter,
                    revenue: earning.revenue && earning.revenue !== 0 ? (earning.revenue / 1e9).toFixed(2) : null,
                    earnings: earning.earnings && earning.earnings !== 0 ? (earning.earnings / 1e9).toFixed(2) : null
                };
            }
            return null;
        }).filter(item => item !== null).reverse();
    };

    const getChartDomain = () => {
        const chartData = prepareEarningsChartData();
        if (!chartData || chartData.length === 0) return [0, 'auto'];
        
        let allValues = [];
        chartData.forEach(item => {
            if (item.revenue !== null) allValues.push(parseFloat(item.revenue));
            if (item.earnings !== null) allValues.push(parseFloat(item.earnings));
        });
        
        if (allValues.length === 0) return [0, 'auto'];
        
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        
        // Add 10% padding on both sides
        const padding = (maxValue - minValue) * 0.1;
        const domainMin = minValue - padding;
        const domainMax = maxValue + padding;
        
        return [Math.floor(domainMin), Math.ceil(domainMax)];
    };

    const getFinancialChartDomain = () => {
        const chartData = prepareFinancialsChartData();
        if (!chartData || chartData.length === 0) return [0, 'auto'];
        
        let allValues = [];
        chartData.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'year' && item[key] !== null) {
                    allValues.push(parseFloat(item[key]));
                }
            });
        });
        
        if (allValues.length === 0) return [0, 'auto'];
        
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        
        // Add 10% padding on both sides
        const padding = (maxValue - minValue) * 0.1;
        const domainMin = minValue - padding;
        const domainMax = maxValue + padding;
        
        return [Math.floor(domainMin), Math.ceil(domainMax)];
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const text = stockData?.longBusinessSummary || 'No description available.';
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const categories = ['All', ...new Set(popularStocks.map(s => s.category))];
    
    const filteredStocks = popularStocks.filter(stock => {
        const matchesCategory = selectedCategory === 'All' || stock.category === selectedCategory;
        const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const styles = {
        container: {
            padding: '15px',
            maxWidth: '1400px',
            width: '100%',
            boxSizing: 'border-box',
        },
        searchSection: {
            marginBottom: '20px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        searchForm: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        input: {
            padding: '10px 15px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            width: '200px',
            maxWidth: '100%',
            outline: 'none',
            boxSizing: 'border-box',
        },
        searchButton: {
            padding: '10px 25px',
            fontSize: '16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            whiteSpace: 'nowrap',
        },
        browseButton: {
            padding: '10px 25px',
            fontSize: '16px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            whiteSpace: 'nowrap',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px',
            overflow: 'auto',
        },
        modalContent: {
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        },
        closeButton: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#666',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s',
        },
        modalHeader: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1a1a1a',
        },
        categoryFilter: {
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
        },
        categoryButton: {
            padding: '8px 16px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '20px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            color: '#666',
            fontWeight: '500',
            transition: 'all 0.2s',
        },
        categoryButtonActive: {
            backgroundColor: '#2563eb',
            color: '#fff',
            borderColor: '#2563eb',
        },
        stockGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px',
            marginTop: '15px',
        },
        stockCard: {
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '2px solid transparent',
            textAlign: 'center',
        },
        stockName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '4px',
        },
        stockSymbol: {
            fontSize: '13px',
            color: '#2563eb',
            fontWeight: '700',
        },
        stockCategory: {
            fontSize: '11px',
            color: '#999',
            marginTop: '4px',
        },
        tabContainer: {
            display: 'flex',
            gap: '5px',
            marginBottom: '20px',
            borderBottom: '2px solid #e0e0e0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
        },
        tab: {
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: '3px solid transparent',
            transition: 'all 0.3s',
            color: '#666',
            whiteSpace: 'nowrap',
            flexShrink: 0,
        },
        activeTabStyle: {
            borderBottom: '3px solid #2563eb',
            color: '#2563eb',
        },
        contentCard: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'auto',
        },
        viewToggle: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
        },
        toggleButton: {
            padding: '8px 16px',
            fontSize: '14px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            color: '#666',
            fontWeight: '500',
            transition: 'all 0.2s',
        },
        toggleButtonActive: {
            backgroundColor: '#2563eb',
            color: '#fff',
            borderColor: '#2563eb',
        },
        overviewGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '20px',
        },
        statBox: {
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            borderLeft: '4px solid #2563eb',
        },
        statLabel: {
            fontSize: '13px',
            color: '#666',
            marginBottom: '5px',
            fontWeight: '500',
        },
        statValue: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            wordBreak: 'break-word',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px',
            minWidth: '600px',
        },
        th: {
            textAlign: 'left',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            fontWeight: '600',
            borderBottom: '2px solid #e0e0e0',
        },
        td: {
            padding: '12px',
            borderBottom: '1px solid #e0e0e0',
        },
        newsCard: {
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            marginBottom: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s',
        },
        newsTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px',
        },
        newsPublisher: {
            fontSize: '13px',
            color: '#666',
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '18px',
            color: '#666',
        },
        error: {
            padding: '15px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '6px',
            marginTop: '15px',
        },
        companyHeader: {
            marginBottom: '20px',
        },
        companyName: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '5px',
        },
        companySymbol: {
            fontSize: '14px',
            color: '#666',
        },
        voiceControls: {
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
            marginBottom: '15px',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        voiceButton: {
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
        },
        voiceButtonStop: {
            backgroundColor: '#ef4444',
        },
        voiceSelect: {
            padding: '8px 12px',
            fontSize: '14px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            outline: 'none',
            cursor: 'pointer',
            maxWidth: '250px',
        },
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Stock Screener</h5>
                    
                    <div style={styles.container}>
                        <div style={styles.searchSection}>
                            <div style={styles.searchForm}>
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                    placeholder="Enter ticker (e.g., AAPL)"
                                    style={styles.input}
                                />
                                <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
                                    {loading ? 'Loading...' : 'Search'}
                                </button>
                                <button onClick={() => setShowModal(true)} style={styles.browseButton}>
                                    📊 Browse Stocks
                                </button>
                            </div>
                            {error && <div style={styles.error}>{error}</div>}
                        </div>

                        {/* Modal */}
                        {showModal && (
                            <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        style={styles.closeButton}
                                        onClick={() => setShowModal(false)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        ×
                                    </button>
                                    
                                    <div style={styles.modalHeader}>Select a Stock</div>
                                    
                                    <input
                                        type="text"
                                        placeholder="Search stocks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{...styles.input, width: '100%', marginBottom: '15px'}}
                                    />
                                    
                                    <div style={styles.categoryFilter}>
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                style={{
                                                    ...styles.categoryButton,
                                                    ...(selectedCategory === category ? styles.categoryButtonActive : {})
                                                }}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div style={styles.stockGrid}>
                                        {filteredStocks.map((stock, idx) => (
                                            <div
                                                key={idx}
                                                style={styles.stockCard}
                                                onClick={() => handleStockClick(stock.symbol)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.2)';
                                                    e.currentTarget.style.borderColor = '#2563eb';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                }}
                                            >
                                                <div style={styles.stockName}>{stock.name}</div>
                                                <div style={styles.stockSymbol}>{stock.symbol}</div>
                                                <div style={styles.stockCategory}>{stock.category}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {stockData && (
                            <>
                                <div style={styles.companyHeader}>
                                    <div style={styles.companyName}>{stockData.longName || ticker}</div>
                                    <div style={styles.companySymbol}>{stockData.symbol} • {stockData.sector} • {stockData.industry}</div>
                                </div>

                                <div style={styles.tabContainer}>
                                    <button
                                        style={{...styles.tab, ...(activeTab === 'overview' ? styles.activeTabStyle : {})}}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        style={{...styles.tab, ...(activeTab === 'financials' ? styles.activeTabStyle : {})}}
                                        onClick={() => setActiveTab('financials')}
                                    >
                                        Financials
                                    </button>
                                    <button
                                        style={{...styles.tab, ...(activeTab === 'earnings' ? styles.activeTabStyle : {})}}
                                        onClick={() => setActiveTab('earnings')}
                                    >
                                        Earnings
                                    </button>
                                    <button
                                        style={{...styles.tab, ...(activeTab === 'news' ? styles.activeTabStyle : {})}}
                                        onClick={() => setActiveTab('news')}
                                    >
                                        News
                                    </button>
                                </div>

                                {activeTab === 'overview' && (
                                    <div style={styles.contentCard}>
                                        <h3>Company Overview</h3>
                                        <div style={styles.overviewGrid}>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>Current Price</div>
                                                <div style={styles.statValue}>${stockData.currentPrice?.toFixed(2) || 'N/A'}</div>
                                            </div>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>Market Cap</div>
                                                <div style={styles.statValue}>
                                                    ${stockData.marketCap ? (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
                                                </div>
                                            </div>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>P/E Ratio</div>
                                                <div style={styles.statValue}>{stockData.trailingPE?.toFixed(2) || 'N/A'}</div>
                                            </div>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>52 Week High</div>
                                                <div style={styles.statValue}>${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}</div>
                                            </div>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>52 Week Low</div>
                                                <div style={styles.statValue}>${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}</div>
                                            </div>
                                            <div style={styles.statBox}>
                                                <div style={styles.statLabel}>Dividend Yield</div>
                                                <div style={styles.statValue}>
                                                    {stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{marginTop: '20px'}}>
                                            <h4>About</h4>
                                            <div style={styles.voiceControls}>
                                                <button 
                                                    onClick={handleSpeak} 
                                                    style={{...styles.voiceButton, ...(isSpeaking ? styles.voiceButtonStop : {})}}
                                                >
                                                    {isSpeaking ? '⏹ Stop Reading' : '🔊 Read Aloud'}
                                                </button>
                                                <select 
                                                    value={selectedVoice?.name || ''} 
                                                    onChange={(e) => {
                                                        const voice = voices.find(v => v.name === e.target.value);
                                                        setSelectedVoice(voice);
                                                    }}
                                                    style={styles.voiceSelect}
                                                >
                                                    {voices.map((voice, idx) => (
                                                        <option key={idx} value={voice.name}>
                                                            {voice.name} ({voice.lang})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <p style={{lineHeight: '1.6', color: '#444'}}>{stockData.longBusinessSummary || 'No description available.'}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && financials && (
                                    <div style={styles.contentCard}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
                                            <h3>Financial Statements (Annual)</h3>
                                            <div style={styles.viewToggle}>
                                                <button
                                                    style={{...styles.toggleButton, ...(financialsView === 'table' ? styles.toggleButtonActive : {})}}
                                                    onClick={() => setFinancialsView('table')}
                                                >
                                                    Table View
                                                </button>
                                                <button
                                                    style={{...styles.toggleButton, ...(financialsView === 'chart' ? styles.toggleButtonActive : {})}}
                                                    onClick={() => setFinancialsView('chart')}
                                                >
                                                    Chart View
                                                </button>
                                            </div>
                                        </div>

                                        {financialsView === 'table' ? (
                                            <div style={{overflowX: 'auto'}}>
                                                <table style={styles.table}>
                                                    <thead>
                                                        <tr>
                                                            <th style={styles.th}>Metric</th>
                                                            {financials.columns?.map((col, idx) => (
                                                                <th key={idx} style={styles.th}>{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {financials.data?.map((row, idx) => (
                                                            <tr key={idx}>
                                                                <td style={{...styles.td, fontWeight: '600'}}>{row.metric}</td>
                                                                {row.values?.map((val, i) => (
                                                                    <td key={i} style={styles.td}>
                                                                        {val && val !== 0 ? `${(val / 1e9).toFixed(2)}B` : 'N/A'}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={prepareFinancialsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis 
                                                        domain={getFinancialChartDomain()}
                                                        label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} 
                                                    />
                                                    <Tooltip formatter={(value) => `${value}B`} />
                                                    <Legend />
                                                    {financials.data?.map((row, idx) => (
                                                        <Line 
                                                            key={idx}
                                                            type="monotone" 
                                                            dataKey={row.metric} 
                                                            stroke={['#2563eb', '#10b981', '#f59e0b', '#ef4444'][idx % 4]}
                                                            strokeWidth={2}
                                                        />
                                                    ))}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'earnings' && earnings && (
                                    <div style={styles.contentCard}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
                                            <h3>Quarterly Earnings</h3>
                                            <div style={styles.viewToggle}>
                                                <button
                                                    style={{...styles.toggleButton, ...(earningsView === 'table' ? styles.toggleButtonActive : {})}}
                                                    onClick={() => setEarningsView('table')}
                                                >
                                                    Table View
                                                </button>
                                                <button
                                                    style={{...styles.toggleButton, ...(earningsView === 'chart' ? styles.toggleButtonActive : {})}}
                                                    onClick={() => setEarningsView('chart')}
                                                >
                                                    Chart View
                                                </button>
                                            </div>
                                        </div>

                                        {earningsView === 'table' ? (
                                            <div style={{overflowX: 'auto'}}>
                                                <table style={styles.table}>
                                                    <thead>
                                                        <tr>
                                                            <th style={styles.th}>Quarter</th>
                                                            <th style={styles.th}>Revenue</th>
                                                            <th style={styles.th}>Earnings</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {earnings.map((earning, idx) => (
                                                            <tr key={idx}>
                                                                <td style={styles.td}>{earning.quarter}</td>
                                                                <td style={styles.td}>
                                                                    {earning.revenue && earning.revenue !== 0 ? `${(earning.revenue / 1e9).toFixed(2)}B` : 'N/A'}
                                                                </td>
                                                                <td style={styles.td}>
                                                                    {earning.earnings && earning.earnings !== 0 ? `${(earning.earnings / 1e9).toFixed(2)}B` : 'N/A'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={prepareEarningsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="quarter" />
                                                    <YAxis 
                                                        domain={getChartDomain()}
                                                        label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} 
                                                    />
                                                    <Tooltip formatter={(value) => value ? `${value}B` : 'N/A'} />
                                                    <Legend />
                                                    <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                                                    <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'news' && (
                                    <div style={styles.contentCard}>
                                        <h3>Recent News</h3>
                                        {news && news.length > 0 ? (
                                            news.map((item, idx) => (
                                                item && item.link && item.title ? (
                                                    <div
                                                        key={idx}
                                                        style={styles.newsCard}
                                                        onClick={() => item.link && window.open(item.link, '_blank')}
                                                    >
                                                        <div style={styles.newsTitle}>{item.title}</div>
                                                        <div style={styles.newsPublisher}>
                                                            {item.publisher} • {formatNewsDate(item.providerPublishTime)}
                                                        </div>
                                                    </div>
                                                ) : null
                                            ))
                                        ) : (
                                            <p>No recent news available.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {!stockData && !loading && (
                            <div style={styles.loading}>
                                Enter a stock ticker or browse stocks to get started
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}