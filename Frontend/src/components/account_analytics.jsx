import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState("");
    const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
    const [summaryExpanded, setSummaryExpanded] = useState(true);
    const [filters, setFilters] = useState({
        dayOfWeek: 'all',
        tradingSession: 'all',
        strategy: 'all',
        outcome: 'all',
        asset: 'all',
        timeFrame: 'all',
        selectedPeriod: 'all'
    });

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchAccountDataFromAPI = async () => {
        const accountName = Cookies.get('account_name');
        
        if (!accountName) {
            console.error('Account name not found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/get-trading-analytics?account_name=${accountName}`);
            const data = await response.json();
            if (response.ok) {
                // Parse date_entered strings into Date objects
                data.trades = data.trades.map(trade => ({
                    ...trade,
                    date_entered: trade.date_entered ? new Date(trade.date_entered) : null
                }));
                setAccountData(data);
            } else {
                console.error('Error fetching account data:', data.error);
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountDataFromAPI();
    }, []);

    // Get available time periods based on the selected time frame
    const getAvailableTimePeriods = () => {
        if (!accountData?.trades || filters.timeFrame === 'all') return ['all'];

        const dates = accountData.trades
            .filter(trade => trade.date_entered)
            .map(trade => trade.date_entered);

        if (dates.length === 0) return ['all'];

        const periods = new Set();
        dates.forEach(date => {
            if (filters.timeFrame === 'month') {
                // Format: "MMMM YYYY"
                const monthYear = date.toLocaleString('default', { 
                    month: 'long',
                    year: 'numeric'
                });
                periods.add(monthYear);
            } else if (filters.timeFrame === 'week') {
                // Get the Monday of the week
                const monday = new Date(date);
                monday.setDate(date.getDate() - date.getDay() + 1);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                
                const weekRange = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
                periods.add(weekRange);
            }
        });

        return ['all', ...Array.from(periods)].sort((a, b) => {
            if (a === 'all') return -1;
            if (b === 'all') return 1;
            return new Date(b.split(' ')[0]) - new Date(a.split(' ')[0]);
        });
    };

    // Filter trades based on current filter settings
    const getFilteredTrades = () => {
        if (!accountData?.trades) return [];

        return accountData.trades.filter(trade => {
            const dayMatch = filters.dayOfWeek === 'all' || trade.day_of_week_entered === filters.dayOfWeek;
            const sessionMatch = filters.tradingSession === 'all' || trade.trading_session_entered === filters.tradingSession;
            const strategyMatch = filters.strategy === 'all' || trade.strategy === filters.strategy;
            const outcomeMatch = filters.outcome === 'all' || trade.outcome === filters.outcome;
            const assetMatch = filters.asset === 'all' || trade.asset === filters.asset;

            let timeMatch = true;
            if (filters.timeFrame !== 'all' && filters.selectedPeriod !== 'all' && trade.date_entered) {
                if (filters.timeFrame === 'month') {
                    const tradeMonthYear = trade.date_entered.toLocaleString('default', { 
                        month: 'long',
                        year: 'numeric'
                    });
                    timeMatch = tradeMonthYear === filters.selectedPeriod;
                } else if (filters.timeFrame === 'week') {
                    const monday = new Date(trade.date_entered);
                    monday.setDate(trade.date_entered.getDate() - trade.date_entered.getDay() + 1);
                    const sunday = new Date(monday);
                    sunday.setDate(monday.getDate() + 6);
                    const weekRange = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
                    timeMatch = weekRange === filters.selectedPeriod;
                }
            }

            return dayMatch && sessionMatch && strategyMatch && outcomeMatch && assetMatch && timeMatch;
        });
    };

    // Get unique values for filter dropdowns
    const getUniqueValues = (field) => {
        if (!accountData || !accountData.trades) return [];
        return ['all', ...new Set(accountData.trades.map(trade => trade[field]))];
    };

    // Helper function for generating chart data
    const generateChartData = (field) => {
        if (!accountData || !accountData.trades) return { labels: [], datasets: [] };

        const filteredTrades = getFilteredTrades();

        const counts = filteredTrades.reduce((acc, trade) => {
            const key = trade[field];
            const outcome = trade.outcome;
            acc[key] = acc[key] || { Win: 0, Loss: 0, "Break-even": 0 };
            acc[key][outcome] = (acc[key][outcome] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const datasets = Object.keys(counts[labels[0]] || {}).map(outcome => ({
            label: outcome,
            data: labels.map(label => counts[label][outcome] || 0),
            backgroundColor: outcome === 'Win' ? '#4CAF50' : outcome === 'Loss' ? '#E57373' : '#FFC107',
        }));

        return { labels, datasets };
    };

    const generateEquityCurveData = () => {
        if (!accountData || !accountData.trades || !accountData.initial_capital) return { labels: [], datasets: [] };
    
        const filteredTrades = getFilteredTrades();
        let cumulativeEquity = accountData.initial_capital;
        const equityCurve = filteredTrades.map((trade, index) => {
            if (trade.outcome === 'Win') {
                cumulativeEquity += trade.amount;
            } else if (trade.outcome === 'Loss') {
                cumulativeEquity -= trade.amount;
            }
            return { x: index + 1, y: cumulativeEquity };
        });
    
        return {
            labels: equityCurve.map(point => `Trade ${point.x}`),
            datasets: [{
                label: 'Equity Curve',
                data: equityCurve.map(point => point.y),
                borderColor: '#1E88E5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                fill: true,
            }],
        };
    };

    const generateMetricsData = () => {
        if (!accountData || !accountData.trades) return {};
    
        const filteredTrades = getFilteredTrades();
        let totalWinsAmount = 0;
        let totalLossesAmount = 0;
        let numberOfWins = 0;
        let numberOfLosses = 0;
        let totalTrades = filteredTrades.length;
    
        filteredTrades.forEach(trade => {
            if (trade.outcome === 'Win') {
                totalWinsAmount += trade.amount;
                numberOfWins++;
            } else if (trade.outcome === 'Loss') {
                totalLossesAmount += trade.amount;
                numberOfLosses++;
            }
        });
    
        const winRate = (numberOfWins / totalTrades) * 100;
        const averageWin = numberOfWins ? totalWinsAmount / numberOfWins : 0;
        const averageLoss = numberOfLosses ? totalLossesAmount / numberOfLosses : 0;
        const profitFactor = numberOfLosses ? totalWinsAmount / Math.abs(totalLossesAmount) : 0;
    
        return {
            winRate,
            averageWin,
            averageLoss,
            profitFactor,
            numberOfWins,
            numberOfLosses,
        };
    };

    const fetchAISummary = async () => {
        console.log(accountData)
        if (!accountData) return;

        setAiSummaryLoading(true);
        try {
            const metricsData = generateMetricsData();
            const filteredTrades = getFilteredTrades();

            console.log(metricsData);
            console.log(filteredTrades);
            
            const response = await fetch(`${baseUrl}/ai-account-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_name: accountData.account_name,
                    metrics: metricsData,
                    trades: filteredTrades.map(trade => ({
                        outcome: trade.outcome,
                        amount: trade.amount,
                        day_of_week_entered: trade.day_of_week_entered,
                        trading_session_entered: trade.trading_session_entered,
                        strategy: trade.strategy,
                        asset: trade.asset
                    }))
                }),
            });

            const data = await response.json();

            console.log(data);
            
            if (response.ok && data.summary) {
                setAiSummary(data.summary);
                setSummaryExpanded(true); // Auto-expand when new summary is generated
            } else {
                console.error('Error fetching AI summary:', data.error);
                setAiSummary("Sorry, we couldn't generate an AI summary at this time.");
            }
        } catch (error) {
            console.error('Error fetching AI summary:', error);
            setAiSummary("Sorry, we couldn't generate an AI summary at this time.");
        } finally {
            setAiSummaryLoading(false);
        }
    };

    // Parse and format the AI summary for better display
    const formatAiSummary = () => {
        if (!aiSummary) return [];
        
        // Split the summary into sections based on emoji patterns
        // This will likely be sections like overall statement, metrics, patterns, recommendations
        const sections = [];
        let currentSection = "";
        
        aiSummary.split('\n').forEach(line => {
            // Check if line starts with an emoji (common emoji pattern: 1-2 characters at start of line)
            const emojiRegex = /^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;
            
            if (line.trim() === "") {
                // Skip empty lines
                return;
            } else if (emojiRegex.test(line) || sections.length === 0) {
                // Start a new section if we find an emoji at the start or this is the first line
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = line;
            } else {
                // Continue current section
                currentSection += "\n" + line;
            }
        });
        
        // Add the last section
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const toggleSummary = () => {
        setSummaryExpanded(!summaryExpanded);
    };

    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 14,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
        },
    };
    const weekdayChartData = generateChartData('day_of_week_entered');
    const sessionChartData = generateChartData('trading_session_entered');
    const strategyChartData = generateChartData('strategy');
    const assetChartData = generateChartData('asset'); // New asset chart data
    const equityCurveData = generateEquityCurveData();
    const metricsData = generateMetricsData();

    // Format AI summary into sections
    const summaryContent = formatAiSummary();

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="account-analytics">Account Analytics</h5>

                    {loading ? (
                        <div>Loading...</div>
                    ) : !accountData ? (
                        <div>No account data available.</div>
                    ) : (
                        <>
                            {/* Enhanced AI Summary Section */}
                            <div className="ai-summary-section" style={{
                                marginBottom: '20px',
                                backgroundColor: '#f0f7ff',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <h6 style={{
                                        margin: 0, 
                                        fontSize: '20px', 
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{marginRight: '10px'}}>✨</span>
                                        AI Trading Insights
                                    </h6>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        {aiSummary && !aiSummaryLoading && (
                                            <button 
                                                onClick={toggleSummary}
                                                className="btn btn-outline-primary"
                                                style={{
                                                    border: '1px solid #1E88E5',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'transparent',
                                                    color: '#1E88E5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                {summaryExpanded ? (
                                                    <>
                                                        <span style={{fontSize: '18px'}}>▼</span> 
                                                        Hide Summary
                                                    </>
                                                ) : (
                                                    <>
                                                        <span style={{fontSize: '18px'}}>▶</span> 
                                                        Show Summary
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <button 
                                            onClick={fetchAISummary}
                                            disabled={aiSummaryLoading}
                                            className="btn btn-primary"
                                            style={{
                                                backgroundColor: '#1E88E5',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <span style={{fontSize: '16px'}}>🔄</span>
                                            {aiSummaryLoading ? 'Generating...' : aiSummary ? 'Refresh Analysis' : 'Generate Analysis'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* AI Summary Content with Toggle */}
                                <div className="ai-summary-content" style={{
                                    overflow: 'hidden',
                                    maxHeight: summaryExpanded ? '2000px' : '0',
                                    opacity: summaryExpanded ? 1 : 0,
                                    transition: 'max-height 0.5s ease, opacity 0.5s ease',
                                    marginTop: summaryExpanded ? '15px' : 0
                                }}>
                                    {aiSummaryLoading ? (
                                        <div style={{
                                            textAlign: 'center', 
                                            width: '100%',
                                            padding: '30px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                        }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p style={{marginTop: '15px', color: '#555'}}>Analyzing your trading data...</p>
                                            <p style={{fontSize: '14px', color: '#777'}}>This may take a few moments</p>
                                        </div>
                                    ) : aiSummary ? (
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            overflow: 'hidden',
                                        }}>
                                            {summaryContent.map((section, index) => (
                                                <div 
                                                    key={index} 
                                                    style={{
                                                        padding: '16px 20px',
                                                        borderBottom: index < summaryContent.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                        backgroundColor: index % 2 === 0 ? 'white' : '#fafbff'
                                                    }}
                                                >
                                                    {section.split('\n').map((line, lineIdx) => (
                                                        <p key={lineIdx} style={{
                                                            margin: lineIdx === 0 ? '0 0 10px' : '10px 0',
                                                            fontWeight: lineIdx === 0 ? 'bold' : 'normal',
                                                            fontSize: lineIdx === 0 ? '16px' : '15px',
                                                            color: lineIdx === 0 ? '#1a1a1a' : '#444'
                                                        }}>
                                                            {line}
                                                        </p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center', 
                                            color: '#666',
                                            padding: '30px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                        }}>
                                            <p style={{fontSize: '16px', marginBottom: '5px'}}>No analysis generated yet</p>
                                            <p style={{fontSize: '14px', color: '#777'}}>
                                                Click "Generate Analysis" to get personalized insights about your trading performance
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="account-info">
                                <h6>Account: {accountData.account_name}</h6>
                                <p>Main Assets: {accountData.main_assets}</p>
                                <p>Initial Capital: ${accountData.initial_capital}</p>
                            </div>

                            <div className="filters-container">
                                {/* Time frame filter */}
                                <select
                                    value={filters.timeFrame}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        timeFrame: e.target.value,
                                        selectedPeriod: 'all' // Reset period when changing time frame
                                    })}
                                    className="filter-select form-control"
                                >
                                    <option value="all">All Time</option>
                                    <option value="month">By Month</option>
                                    <option value="week">By Week</option>
                                </select>

                                {/* Period filter */}
                                <select
                                    value={filters.selectedPeriod}
                                    onChange={(e) => setFilters({...filters, selectedPeriod: e.target.value})}
                                    className="filter-select form-control"
                                    disabled={filters.timeFrame === 'all'}
                                >
                                    {getAvailableTimePeriods().map(period => (
                                        <option key={period} value={period}>
                                            {period === 'all' ? 
                                                `All ${filters.timeFrame === 'month' ? 'Months' : 'Weeks'}` : 
                                                period}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.asset}
                                    onChange={(e) => setFilters({...filters, asset: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('asset').map(asset => (
                                        <option key={asset} value={asset}>
                                            {asset === 'all' ? 'All Assets' : asset}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.dayOfWeek}
                                    onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('day_of_week_entered').map(day => (
                                        <option key={day} value={day}>
                                            {day === 'all' ? 'All Days' : day}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.tradingSession}
                                    onChange={(e) => setFilters({...filters, tradingSession: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('trading_session_entered').map(session => (
                                        <option key={session} value={session}>
                                            {session === 'all' ? 'All Sessions' : session}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.strategy}
                                    onChange={(e) => setFilters({...filters, strategy: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('strategy').map(strategy => (
                                        <option key={strategy} value={strategy}>
                                            {strategy === 'all' ? 'All Strategies' : strategy}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.outcome}
                                    onChange={(e) => setFilters({...filters, outcome: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {['all', 'Win', 'Loss', 'Break-even'].map(outcome => (
                                        <option key={outcome} value={outcome}>
                                            {outcome === 'all' ? 'All Outcomes' : outcome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h6 className="trade-overview-header">Trades Overview</h6>

                            <div className="trade-chart-container">
                                <div className="chart-wrapper">
                                    <h6>Performance by Day of Week</h6>
                                    <Bar data={weekdayChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Trading Session</h6>
                                    <Bar data={sessionChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Strategy</h6>
                                    <Bar data={strategyChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Asset</h6>
                                    <Bar data={assetChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Equity Curve</h6>
                                    <Line data={equityCurveData} options={baseChartOptions} />
                                </div>
                            </div>

                            <div className="metrics-container" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '15px',
                                marginTop: '20px'
                            }}>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Win Rate</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: metricsData.winRate > 50 ? '#4CAF50' : '#E57373'
                                    }}>{metricsData.winRate.toFixed(2)}%</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Average Win</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#4CAF50'
                                    }}>${metricsData.averageWin.toFixed(2)}</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Average Loss</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#E57373'
                                    }}>${metricsData.averageLoss.toFixed(2)}</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Profit Factor</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: metricsData.profitFactor > 1 ? '#4CAF50' : '#E57373'
                                    }}>{metricsData.profitFactor.toFixed(2)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}