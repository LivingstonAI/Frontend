import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    // Fetch account data from the API
    const fetchAccountDataFromAPI = async () => {
        const accountName = Cookies.get('account_name');  // Get the account_name from cookies
        
        if (!accountName) {
            console.error('Account name not found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/view-trading-analytics?account_name=${accountName}`);
            const data = await response.json();
            if (response.ok) {
                setAccountData(data);  // Set the fetched data
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

    // Helper function to process trade data for charts
    const processTradeData = () => {
        if (!accountData) return { lineData: [], barData: [], pieData: [] };

        const lineData = [];
        const barData = { wins: 0, losses: 0, breakEven: 0 };
        const pieData = { assetDistribution: {} };

        accountData.trades.forEach(trade => {
            // Line chart data (outcome over time)
            lineData.push({
                date: new Date(trade.date), // Assuming the trade object has a 'date' field
                outcome: trade.outcome
            });

            // Bar chart data (trade outcome counts)
            if (trade.outcome === "Win") barData.wins++;
            else if (trade.outcome === "Loss") barData.losses++;
            else if (trade.outcome === "Break Even") barData.breakEven++;

            // Pie chart data (asset distribution)
            if (trade.asset in pieData.assetDistribution) {
                pieData.assetDistribution[trade.asset]++;
            } else {
                pieData.assetDistribution[trade.asset] = 1;
            }
        });

        return {
            lineData: lineData,
            barData: barData,
            pieData: pieData
        };
    };

    const { lineData, barData, pieData } = processTradeData();

    // Line chart data
    const lineChartData = {
        labels: lineData.map(item => item.date.toLocaleDateString()), 
        datasets: [{
            label: 'Trade Outcome',
            data: lineData.map(item => item.outcome === "Win" ? 1 : item.outcome === "Loss" ? -1 : 0), // Win=1, Loss=-1, BreakEven=0
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }]
    };

    // Bar chart data
    const barChartData = {
        labels: ['Wins', 'Losses', 'Break Even'],
        datasets: [{
            label: 'Trade Outcomes',
            data: [barData.wins, barData.losses, barData.breakEven],
            backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
        }]
    };

    // Pie chart data
    const pieChartData = {
        labels: Object.keys(pieData.assetDistribution),
        datasets: [{
            data: Object.values(pieData.assetDistribution),
            backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0'],
        }]
    };

    return (
        <div>
            {/* Header and Side Navigation stay intact */}
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

                            {/* Line Chart: Trade Outcomes Over Time */}
                            <h6>Trade Outcomes Over Time</h6>
                            <div className="chart-container">
                                <Line data={lineChartData} />
                            </div>

                            <br />

                            {/* Bar Chart: Trade Outcomes (Win/Loss/BreakEven) */}
                            <h6>Trade Outcomes Overview</h6>
                            <div className="chart-container">
                                <Bar data={barChartData} />
                            </div>

                            <br />

                            {/* Pie Chart: Asset Distribution */}
                            <h6>Asset Distribution</h6>
                            <div className="chart-container">
                                <Pie data={pieChartData} />
                            </div>

                            <br />

                            <h6>Trades Overview</h6>
                            <div className="trade-list">
                                {accountData.trades.length === 0 ? (
                                    <p>No trades recorded.</p>
                                ) : (
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
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
