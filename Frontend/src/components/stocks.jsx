import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIStockScreener() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [ticker, setTicker] = useState('AAPL');
    const [stockData, setStockData] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchStockData = async () => {
        if (!ticker) return;
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching:', `${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${ticker}`);
            const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${ticker}`);
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Data received:', data);
            
            if (response.ok) {
                setStockData(data.stock_info);
                setFinancials(data.financials);
                setEarnings(data.earnings);
                setNews(data.news);
            } else {
                setError(data.error || 'Failed to fetch stock data');
            }
        } catch (err) {
            console.error('Full error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStockData();
    };

    const styles = {
        container: {
            maxWidth: '1400px',
        },
        searchSection: {
            marginBottom: '30px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        searchForm: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
        },
        input: {
            padding: '10px 15px',
            fontSize: '16px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            width: '200px',
            outline: 'none',
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
        },
        tabContainer: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            borderBottom: '2px solid #e0e0e0',
        },
        tab: {
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: '3px solid transparent',
            transition: 'all 0.3s',
        },
        activeTabStyle: {
            borderBottom: '3px solid #2563eb',
            color: '#2563eb',
        },
        contentCard: {
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
        },
        overviewGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px',
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
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '5px',
        },
        companySymbol: {
            fontSize: '16px',
            color: '#666',
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
                            </div>
                            {error && <div style={styles.error}>{error}</div>}
                        </div>

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
                                            <p style={{lineHeight: '1.6', color: '#444'}}>{stockData.longBusinessSummary || 'No description available.'}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && financials && (
                                    <div style={styles.contentCard}>
                                        <h3>Financial Statements (Annual)</h3>
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
                                                                {val ? `$${(val / 1e9).toFixed(2)}B` : 'N/A'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'earnings' && earnings && (
                                    <div style={styles.contentCard}>
                                        <h3>Quarterly Earnings</h3>
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
                                                            {earning.revenue ? `$${(earning.revenue / 1e9).toFixed(2)}B` : 'N/A'}
                                                        </td>
                                                        <td style={styles.td}>
                                                            {earning.earnings ? `$${(earning.earnings / 1e9).toFixed(2)}B` : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'news' && (
                                    <div style={styles.contentCard}>
                                        <h3>Recent News</h3>
                                        {news.length > 0 ? (
                                            news.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    style={styles.newsCard}
                                                    onClick={() => window.open(item.link, '_blank')}
                                                >
                                                    <div style={styles.newsTitle}>{item.title}</div>
                                                    <div style={styles.newsPublisher}>
                                                        {item.publisher} • {item.providerPublishTime}
                                                    </div>
                                                </div>
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
                                Enter a stock ticker above to get started
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}