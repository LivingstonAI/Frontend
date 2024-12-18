import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

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

    // Function to generate chart data for trades
    const generateTradeOutcomeChartData = () => {
        if (!accountData || !accountData.trades) return { labels: [], datasets: [] };

        const outcomes = accountData.trades.reduce(
            (acc, trade) => {
                acc[trade.outcome] = (acc[trade.outcome] || 0) + 1;
                return acc;
            },
            {}
        );

        const labels = Object.keys(outcomes);
        const data = labels.map(label => outcomes[label]);

        return {
            labels,
            datasets: [
                {
                    label: 'Trade Outcomes',
                    data,
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartData = generateTradeOutcomeChartData();

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

                            <h6>Trades Overview</h6>
                            <div className="trade-list">
                                {accountData.trades && accountData.trades.length > 0 ? (
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

                            {/* Displaying chart for trade outcomes */}
                            {accountData.trades && accountData.trades.length > 0 && (
                                <div className="trade-chart">
                                    <h6>Trade Outcomes Overview</h6>
                                    <Bar data={chartData} options={{ responsive: true }} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
