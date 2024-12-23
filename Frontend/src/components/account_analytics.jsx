import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchAccountDataFromAPI = async () => {
        const accountName = Cookies.get('account_name');
        
        if (!accountName) {
            console.error('Account name not found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/view-trading-analytics?account_name=${accountName}`);
            const data = await response.json();
            if (response.ok) {
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

    // Helper function for generating chart data
    const generateChartData = (field, filterBy = null) => {
        if (!accountData || !accountData.trades) return { labels: [], datasets: [] };

        const filteredTrades = filterBy
            ? accountData.trades.filter(trade => trade[filterBy])
            : accountData.trades;

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
    
        let cumulativeEquity = accountData.initial_capital; // Start from initial capital
        const equityCurve = accountData.trades.map((trade, index) => {
            // Calculate cumulative equity based on wins and losses
            if (trade.outcome === 'Win') {
                cumulativeEquity += trade.amount;
            } else if (trade.outcome === 'Loss') {
                cumulativeEquity -= trade.amount;
            }
            return { x: index + 1, y: cumulativeEquity };
        });
    
        return {
            labels: equityCurve.map(point => `Trade ${point.x}`),
            datasets: [
                {
                    label: 'Equity Curve',
                    data: equityCurve.map(point => point.y),
                    borderColor: '#1E88E5',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    fill: true,
                },
            ],
        };
    };

    const generateMetricsData = () => {
        if (!accountData || !accountData.trades) return {};
    
        let totalWinsAmount = 0;
        let totalLossesAmount = 0;
        let numberOfWins = 0;
        let numberOfLosses = 0;
        let totalTrades = accountData.trades.length;
    
        accountData.trades.forEach(trade => {
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
    
    const metricsData = generateMetricsData();
    

    
    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16, // Slightly larger font for readability
                        family: "'Arial', sans-serif", // Classic font similar to <p>
                        weight: "normal", // Normal weight to mimic <p> text
                    },
                    color: "#444", // Soft gray, close to <p> tag color
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14, // Typical font size for <p> tags
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444", // Match <p> tag text color
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 14, // Same as x-axis
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

                            <br />

                            <h6 className="trade-overview-header">Trades Overview</h6>
                            

                            <div className="trade-chart-container">
                                {/* Bar charts */}
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
                                    {/* Equity curve */}
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
                                    <p>{metricsData.averageWin.toFixed(2)}</p>
                                </div>
                                <div className="metric-card">
                                    <h6>Average Loss</h6>
                                    <p>{metricsData.averageLoss.toFixed(2)}</p>
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
