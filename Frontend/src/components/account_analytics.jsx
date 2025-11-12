import React, { useEffect, useState } from "react";
import { Bar, Line } from 'react-chartjs-2';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';


export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState("");
    const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
    const [summaryExpanded, setSummaryExpanded] = useState(true);
    const [simulationData, setSimulationData] = useState(null);
    const [simulationLoading, setSimulationLoading] = useState(false);
    const [simulationExpanded, setSimulationExpanded] = useState(false);
    const [selectedSimulationPeriod, setSelectedSimulationPeriod] = useState('month');
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
        // Mock account name - replace with: const accountName = Cookies.get('account_name');

        const accountName = Cookies.get('account_name');
        
        if (!accountName) {
            console.error('Account name not found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/get-trading-analytics?account_name=${accountName}`);
            const data = await response.json();
            if (response.ok) {
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

    const getAvailableTimePeriods = () => {
        if (!accountData?.trades || filters.timeFrame === 'all') return ['all'];

        const dates = accountData.trades
            .filter(trade => trade.date_entered)
            .map(trade => trade.date_entered);

        if (dates.length === 0) return ['all'];

        const periods = new Set();
        dates.forEach(date => {
            if (filters.timeFrame === 'month') {
                const monthYear = date.toLocaleString('default', { 
                    month: 'long',
                    year: 'numeric'
                });
                periods.add(monthYear);
            } else if (filters.timeFrame === 'week') {
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

    const getUniqueValues = (field) => {
        if (!accountData || !accountData.trades) return [];
        return ['all', ...new Set(accountData.trades.map(trade => trade[field]))];
    };

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
        if (!accountData) return;

        setAiSummaryLoading(true);
        try {
            const metricsData = generateMetricsData();
            const filteredTrades = getFilteredTrades();
            
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
            
            if (response.ok && data.summary) {
                setAiSummary(data.summary);
                setSummaryExpanded(true);
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

    const runSimulation = async () => {
        if (!accountData) return;

        setSimulationLoading(true);
        try {
            const response = await fetch(`${baseUrl}/simulate-trading-performance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_name: accountData.account_name,
                    simulation_period: selectedSimulationPeriod,
                    num_simulations: 1000
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setSimulationData(data);
                setSimulationExpanded(true);
            } else {
                console.error('Error running simulation:', data.error);
                alert(data.error || "Sorry, we couldn't run the simulation at this time.");
            }
        } catch (error) {
            console.error('Error running simulation:', error);
            alert("Sorry, we couldn't run the simulation at this time.");
        } finally {
            setSimulationLoading(false);
        }
    };

    const generateProjectionCurveData = (caseType) => {
        if (!simulationData || !accountData) return { labels: [], datasets: [] };

        const initial = accountData.initial_capital;
        const projection = simulationData.projections[caseType];
        const expectedTrades = simulationData.expected_trades;
        
        // Generate a smooth curve from initial to final balance
        const points = Math.min(expectedTrades, 50); // Cap at 50 points for performance
        const increment = (projection.balance - initial) / points;
        
        const curve = [];
        for (let i = 0; i <= points; i++) {
            curve.push(initial + (increment * i));
        }

        const colors = {
            best_case: { border: '#4CAF50', bg: 'rgba(76, 175, 80, 0.2)' },
            expected_case: { border: '#FFC107', bg: 'rgba(255, 193, 7, 0.2)' },
            worst_case: { border: '#E57373', bg: 'rgba(229, 115, 115, 0.2)' }
        };

        return {
            labels: curve.map((_, i) => `Trade ${Math.floor((i / points) * expectedTrades)}`),
            datasets: [{
                label: `${caseType.replace('_', ' ').toUpperCase()} Projection`,
                data: curve,
                borderColor: colors[caseType].border,
                backgroundColor: colors[caseType].bg,
                fill: true,
                tension: 0.4,
            }],
        };
    };

    const formatAiSummary = () => {
        if (!aiSummary) return [];
        
        const sections = [];
        let currentSection = "";
        
        aiSummary.split('\n').forEach(line => {
            const emojiRegex = /^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;
            
            if (line.trim() === "") {
                return;
            } else if (emojiRegex.test(line) || sections.length === 0) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = line;
            } else {
                currentSection += "\n" + line;
            }
        });
        
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const toggleSummary = () => {
        setSummaryExpanded(!summaryExpanded);
    };

    const toggleSimulation = () => {
        setSimulationExpanded(!simulationExpanded);
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
    const assetChartData = generateChartData('asset');
    const equityCurveData = generateEquityCurveData();
    const metricsData = generateMetricsData();
    const summaryContent = formatAiSummary();

    return (
        <div style={{ flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div> 
                <SideNavs />
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#fafafa' }}>
                    <h5 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>Account Analytics</h5>

                    {loading ? (
                        <div>Loading...</div>
                    ) : !accountData ? (
                        <div>No account data available.</div>
                    ) : (
                        <>
                            {/* Performance Simulation Section */}
                            <div style={{
                                marginBottom: '20px',
                                backgroundColor: '#fff3e0',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '2px solid #ff9800'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <h6 style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ marginRight: '10px' }}>📊</span>
                                        Performance Forecast
                                    </h6>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            value={selectedSimulationPeriod}
                                            onChange={(e) => setSelectedSimulationPeriod(e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #ff9800',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="week">1 Week</option>
                                            <option value="2weeks">2 Weeks</option>
                                            <option value="3weeks">3 Weeks</option>
                                            <option value="month">1 Month</option>
                                            <option value="3months">3 Months</option>
                                            <option value="6months">6 Months</option>
                                            <option value="9months">9 Months</option>
                                            <option value="year">1 Year</option>
                                        </select>
                                        {simulationData && !simulationLoading && (
                                            <button
                                                onClick={toggleSimulation}
                                                style={{
                                                    border: '1px solid #ff9800',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'transparent',
                                                    color: '#ff9800',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {simulationExpanded ? '▼ Hide' : '▶ Show'}
                                            </button>
                                        )}
                                        <button
                                            onClick={runSimulation}
                                            disabled={simulationLoading}
                                            style={{
                                                backgroundColor: '#ff9800',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                color: 'white',
                                                cursor: simulationLoading ? 'not-allowed' : 'pointer',
                                                opacity: simulationLoading ? 0.6 : 1
                                            }}
                                        >
                                            <span style={{ fontSize: '16px' }}>🔮</span>
                                            {simulationLoading ? ' Running...' : simulationData ? ' Re-run Simulation' : ' Run Simulation'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    overflow: 'hidden',
                                    maxHeight: simulationExpanded ? '5000px' : '0',
                                    opacity: simulationExpanded ? 1 : 0,
                                    transition: 'max-height 0.5s ease, opacity 0.5s ease'
                                }}>
                                    {simulationLoading ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                border: '5px solid #f3f3f3',
                                                borderTop: '5px solid #ff9800',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                margin: '0 auto 15px'
                                            }} />
                                            <p style={{ color: '#555' }}>Running 1000 Monte Carlo simulations...</p>
                                            <p style={{ fontSize: '14px', color: '#777' }}>Analyzing historical patterns</p>
                                        </div>
                                    ) : simulationData ? (
                                        <div style={{ marginTop: '20px' }}>
                                            {/* Projection Cards */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                                <div style={{
                                                    backgroundColor: '#e8f5e9',
                                                    borderRadius: '8px',
                                                    padding: '20px',
                                                    border: '2px solid #4CAF50'
                                                }}>
                                                    <h6 style={{ color: '#2e7d32', marginBottom: '10px', fontSize: '16px' }}>🎯 Best Case (95th %ile)</h6>
                                                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#1b5e20' }}>
                                                        ${simulationData.projections.best_case.balance.toLocaleString()}
                                                    </p>
                                                    <p style={{ fontSize: '18px', color: '#4CAF50', margin: 0 }}>
                                                        +{simulationData.projections.best_case.return_pct.toFixed(2)}%
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                        Profit: ${simulationData.projections.best_case.profit.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div style={{
                                                    backgroundColor: '#fff9e6',
                                                    borderRadius: '8px',
                                                    padding: '20px',
                                                    border: '2px solid #FFC107'
                                                }}>
                                                    <h6 style={{ color: '#f57f17', marginBottom: '10px', fontSize: '16px' }}>📈 Expected Case (Median)</h6>
                                                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#f57f17' }}>
                                                        ${simulationData.projections.expected_case.balance.toLocaleString()}
                                                    </p>
                                                    <p style={{ fontSize: '18px', color: simulationData.projections.expected_case.return_pct >= 0 ? '#4CAF50' : '#E57373', margin: 0 }}>
                                                        {simulationData.projections.expected_case.return_pct >= 0 ? '+' : ''}{simulationData.projections.expected_case.return_pct.toFixed(2)}%
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                        Profit: ${simulationData.projections.expected_case.profit.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div style={{
                                                    backgroundColor: '#ffebee',
                                                    borderRadius: '8px',
                                                    padding: '20px',
                                                    border: '2px solid #E57373'
                                                }}>
                                                    <h6 style={{ color: '#c62828', marginBottom: '10px', fontSize: '16px' }}>⚠️ Worst Case (5th %ile)</h6>
                                                    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#b71c1c' }}>
                                                        ${simulationData.projections.worst_case.balance.toLocaleString()}
                                                    </p>
                                                    <p style={{ fontSize: '18px', color: '#E57373', margin: 0 }}>
                                                        {simulationData.projections.worst_case.return_pct.toFixed(2)}%
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                        Profit: ${simulationData.projections.worst_case.profit.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Risk Metrics */}
                                            <div style={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                marginBottom: '20px'
                                            }}>
                                                <h6 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>⚡ Risk Analysis</h6>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                                                    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                                        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>Expected Drawdown</p>
                                                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff9800', margin: 0 }}>
                                                            {simulationData.risk_metrics.expected_drawdown_pct.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                                        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>Worst Drawdown (95th)</p>
                                                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#E57373', margin: 0 }}>
                                                            {simulationData.risk_metrics.worst_drawdown_pct.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                                        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>Avg Recovery Time</p>
                                                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E88E5', margin: 0 }}>
                                                            {simulationData.risk_metrics.avg_recovery_weeks.toFixed(1)} weeks
                                                        </p>
                                                    </div>
                                                    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                                        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>Probability of Profit</p>
                                                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#4CAF50', margin: 0 }}>
                                                            {simulationData.risk_metrics.probability_of_profit.toFixed(1)}%
                                                        </p>
                                                    </div>
                                                    <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                                        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>Risk of Ruin (50% loss)</p>
                                                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#c62828', margin: 0 }}>
                                                            {simulationData.risk_metrics.risk_of_ruin.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Historical Stats */}
                                            <div style={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                marginBottom: '20px'
                                            }}>
                                                <h6 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>📚 Historical Performance Used</h6>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Win Rate</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{simulationData.historical_stats.win_rate}%</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Avg Win</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0', color: '#4CAF50' }}>${simulationData.historical_stats.avg_win}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Avg Loss</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0', color: '#E57373' }}>${simulationData.historical_stats.avg_loss}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Total Trades</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{simulationData.historical_stats.total_trades}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Trades/Week</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{simulationData.historical_stats.avg_trades_per_week}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Expected Trades</p>
                                                        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{simulationData.expected_trades}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Projection Equity Curves */}
                                            <div style={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                marginBottom: '20px'
                                            }}>
                                                <h6 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>📉 Projection Scenarios</h6>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                                    <div style={{ height: '300px' }}>
                                                        <h6 style={{ marginBottom: '10px', fontSize: '14px', color: '#2e7d32' }}>Best Case Trajectory</h6>
                                                        <div style={{ height: '260px' }}>
                                                            <Line data={generateProjectionCurveData('best_case')} options={{
                                                                ...baseChartOptions,
                                                                plugins: {
                                                                    legend: { display: false }
                                                                }
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div style={{ height: '300px' }}>
                                                        <h6 style={{ marginBottom: '10px', fontSize: '14px', color: '#f57f17' }}>Expected Case Trajectory</h6>
                                                        <div style={{ height: '260px' }}>
                                                            <Line data={generateProjectionCurveData('expected_case')} options={{
                                                                ...baseChartOptions,
                                                                plugins: {
                                                                    legend: { display: false }
                                                                }
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div style={{ height: '300px' }}>
                                                        <h6 style={{ marginBottom: '10px', fontSize: '14px', color: '#c62828' }}>Worst Case Trajectory</h6>
                                                        <div style={{ height: '260px' }}>
                                                            <Line data={generateProjectionCurveData('worst_case')} options={{
                                                                ...baseChartOptions,
                                                                plugins: {
                                                                    legend: { display: false }
                                                                }
                                                            }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }}>
                                            <p style={{ fontSize: '16px', marginBottom: '5px' }}>No simulation run yet</p>
                                            <p style={{ fontSize: '14px', color: '#777' }}>
                                                Select a time period and click "Run Simulation" to forecast your trading performance
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Summary Section */}
                            <div style={{
                                marginBottom: '20px',
                                backgroundColor: '#f0f7ff',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <h6 style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ marginRight: '10px' }}>✨</span>
                                        AI Trading Insights
                                    </h6>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {aiSummary && !aiSummaryLoading && (
                                            <button
                                                onClick={toggleSummary}
                                                style={{
                                                    border: '1px solid #1E88E5',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'transparent',
                                                    color: '#1E88E5',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {summaryExpanded ? '▼ Hide' : '▶ Show'}
                                            </button>
                                        )}
                                        <button
                                            onClick={fetchAISummary}
                                            disabled={aiSummaryLoading}
                                            style={{
                                                backgroundColor: '#1E88E5',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                color: 'white',
                                                cursor: aiSummaryLoading ? 'not-allowed' : 'pointer',
                                                opacity: aiSummaryLoading ? 0.6 : 1
                                            }}
                                        >
                                            <span style={{ fontSize: '16px' }}>🔄</span>
                                            {aiSummaryLoading ? ' Generating...' : aiSummary ? ' Refresh' : ' Generate'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    overflow: 'hidden',
                                    maxHeight: summaryExpanded ? '2000px' : '0',
                                    opacity: summaryExpanded ? 1 : 0,
                                    transition: 'max-height 0.5s ease, opacity 0.5s ease'
                                }}>
                                    {aiSummaryLoading ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                border: '5px solid #f3f3f3',
                                                borderTop: '5px solid #1E88E5',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                margin: '0 auto 15px'
                                            }} />
                                            <p style={{ color: '#555' }}>Analyzing your trading data...</p>
                                        </div>
                                    ) : aiSummary ? (
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
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
                                            padding: '30px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }}>
                                            <p style={{ fontSize: '16px' }}>No analysis generated yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Info */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '20px',
                                marginBottom: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <h6 style={{ marginBottom: '10px' }}>Account: {accountData.account_name}</h6>
                                <p style={{ margin: '5px 0' }}>Main Assets: {accountData.main_assets}</p>
                                <p style={{ margin: '5px 0' }}>Initial Capital: ${accountData.initial_capital}</p>
                            </div>

                            {/* Filters */}
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                marginBottom: '20px',
                                flexWrap: 'wrap'
                            }}>
                                <select
                                    value={filters.timeFrame}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        timeFrame: e.target.value,
                                        selectedPeriod: 'all'
                                    })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="all">All Time</option>
                                    <option value="month">By Month</option>
                                    <option value="week">By Week</option>
                                </select>

                                <select
                                    value={filters.selectedPeriod}
                                    onChange={(e) => setFilters({ ...filters, selectedPeriod: e.target.value })}
                                    disabled={filters.timeFrame === 'all'}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
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
                                    onChange={(e) => setFilters({ ...filters, asset: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    {getUniqueValues('asset').map(asset => (
                                        <option key={asset} value={asset}>
                                            {asset === 'all' ? 'All Assets' : asset}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.dayOfWeek}
                                    onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    {getUniqueValues('day_of_week_entered').map(day => (
                                        <option key={day} value={day}>
                                            {day === 'all' ? 'All Days' : day}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.tradingSession}
                                    onChange={(e) => setFilters({ ...filters, tradingSession: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    {getUniqueValues('trading_session_entered').map(session => (
                                        <option key={session} value={session}>
                                            {session === 'all' ? 'All Sessions' : session}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.strategy}
                                    onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    {getUniqueValues('strategy').map(strategy => (
                                        <option key={strategy} value={strategy}>
                                            {strategy === 'all' ? 'All Strategies' : strategy}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.outcome}
                                    onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        fontSize: '14px'
                                    }}
                                >
                                    {['all', 'Win', 'Loss', 'Break-even'].map(outcome => (
                                        <option key={outcome} value={outcome}>
                                            {outcome === 'all' ? 'All Outcomes' : outcome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h6 style={{ marginTop: '30px', marginBottom: '20px', fontSize: '20px' }}>Trades Overview</h6>

                            {/* Charts */}
                            <div style={{ marginBottom: '30px' }}>
                                {/* Day of Week and Trading Session */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
                                    gap: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        height: '350px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <h6 style={{ marginBottom: '15px' }}>Performance by Day of Week</h6>
                                        <div style={{ height: '280px' }}>
                                            <Bar data={weekdayChartData} options={baseChartOptions} />
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        height: '350px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <h6 style={{ marginBottom: '15px' }}>Performance by Trading Session</h6>
                                        <div style={{ height: '280px' }}>
                                            <Bar data={sessionChartData} options={baseChartOptions} />
                                        </div>
                                    </div>
                                </div>

                                {/* Strategy and Asset */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
                                    gap: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        height: '350px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <h6 style={{ marginBottom: '15px' }}>Performance by Strategy</h6>
                                        <div style={{ height: '280px' }}>
                                            <Bar data={strategyChartData} options={baseChartOptions} />
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        height: '350px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <h6 style={{ marginBottom: '15px' }}>Performance by Asset</h6>
                                        <div style={{ height: '280px' }}>
                                            <Bar data={assetChartData} options={baseChartOptions} />
                                        </div>
                                    </div>
                                </div>

                                {/* Equity Curve - Centered and Full Width */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        height: '400px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        width: window.innerWidth >= 768 ? '85%' : '100%',
                                        maxWidth: '1400px'
                                    }}>
                                        <h6 style={{ marginBottom: '15px' }}>Equity Curve</h6>
                                        <div style={{ height: '330px' }}>
                                            <Line data={equityCurveData} options={baseChartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '15px'
                            }}>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <h6 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>Win Rate</h6>
                                    <p style={{
                                        fontSize: '28px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: metricsData.winRate > 50 ? '#4CAF50' : '#E57373'
                                    }}>{metricsData.winRate.toFixed(2)}%</p>
                                </div>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <h6 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>Average Win</h6>
                                    <p style={{
                                        fontSize: '28px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#4CAF50'
                                    }}>${metricsData.averageWin.toFixed(2)}</p>
                                </div>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <h6 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>Average Loss</h6>
                                    <p style={{
                                        fontSize: '28px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#E57373'
                                    }}>${metricsData.averageLoss.toFixed(2)}</p>
                                </div>
                                <div style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <h6 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>Profit Factor</h6>
                                    <p style={{
                                        fontSize: '28px',
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
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}