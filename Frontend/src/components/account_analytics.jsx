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
        if (!accountData || !accountData.trades) return { labels: [], datasets: [] };

        let cumulativeEquity = 0;
        const equityCurve = accountData.trades.map((trade, index) => {
            cumulativeEquity += trade.outcome === 'Win' ? trade.amount : trade.outcome === 'Loss' ? -trade.amount : 0;
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

                            <h6>Trades Overview</h6>
                            <div className="trade-list">
                                {accountData.trades.length > 0 ? (
                                    accountData.trades.map((trade, index) => (
                                        <div key={index} className="trade-card">
                                            <h6>{trade.asset} ({trade.order_type})</h6>
                                            <p><strong>Amount:</strong> ${trade.amount}</p>
                                            <p><strong>Outcome:</strong> {trade.outcome}</p>
                                            <p><strong>Strategy:</strong> {trade.strategy}</p>
                                            <p><strong>Entered on:</strong> {trade.day_of_week_entered}, {trade.trading_session_entered} session</p>
                                            {trade.day_of_week_closed && (
                                                <p><strong>Closed on:</strong> {trade.day_of_week_closed}, {trade.trading_session_closed} session</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No trades recorded.</p>
                                )}
                            </div>

                            <div className="trade-chart-container">
                                {/* Bar charts */}
                                <div className="chart-wrapper">
                                    <h6>Performance by Day of Week</h6>
                                    <Bar data={weekdayChartData} options={{ responsive: true }} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Trading Session</h6>
                                    <Bar data={sessionChartData} options={{ responsive: true }} />
                                </div>
                                <div className="chart-wrapper">

                                    <h6>Performance by Strategy</h6>
                                    <Bar data={strategyChartData} options={{ responsive: true }} />
                                </div> 
                                <div className="chart-wrapper">
                                    {/* Equity curve */}
                                    <h6>Equity Curve</h6>
                                    <Line data={equityCurveData} options={{ responsive: true }} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
