import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        dayOfWeek: 'all',
        tradingSession: 'all',
        strategy: 'all',
        outcome: 'all',
        asset: 'all',
        timeFrame: 'all',  // New filter for time frame selection (month/week)
        selectedPeriod: 'all'  // New filter for specific period selection
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
    const equityCurveData = generateEquityCurveData();
    const metricsData = generateMetricsData();

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
                                    <h6>Equity Curve</h6>
                                    <Line data={equityCurveData} options={baseChartOptions} />
                                </div>
                            </div>

                            <div className="metrics-container">
                                <div className="metric-card">
                                    <h6>Win Rate</h6>
                                    <p>{metricsData.winRate.toFixed(2)}%</p>
                                </div>
                                <div className="metric-card">
                                    <h6>Average Win</h6>
                                    <p>${metricsData.averageWin.toFixed(2)}</p>
                                </div>
                                <div className="metric-card">
                                    <h6>Average Loss</h6>
                                    <p>${metricsData.averageLoss.toFixed(2)}</p>
                                </div>
                                <div className="metric-card">
                                    <h6>Profit Factor</h6>
                                    <p>{metricsData.profitFactor.toFixed(2)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}