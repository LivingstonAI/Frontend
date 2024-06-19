import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import SideNavs from "./side_navs";
// import TradingHistoryLinks from "./trading_history_links";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useRef } from "react";
import { Chart } from "chart.js/auto"; // Import from "chart.js/auto" for correct import
import Cookies from 'js-cookie';


export default function TradingHistory() {

    const [analyticsData, setAnalyticsData] = useState({});
    const chartRef = useRef(null);
    const baseURL = 'https://backend-production-c0ab.up.railway.app'


    const fetchEmailDataFromAPI = () => {
        return Cookies.get('email');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = fetchEmailDataFromAPI(); 
                const response = await axios.get(`${baseURL}/user_overview/${email}/`);
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        // Destroy previous chart instance
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create new chart instance
        if (analyticsData.equity_over_time_labels && analyticsData.equity_over_time_data) {
            const ctx = document.getElementById("equityChart").getContext("2d");
            chartRef.current = new Chart(ctx, {
                type: "line",
                data: {
                    labels: analyticsData.equity_over_time_labels,
                    datasets: [
                        {
                            label: "Equity Over Time",
                            data: analyticsData.equity_over_time_data,
                            borderColor: "blue",
                            backgroundColor: "rgba(0, 0, 255, 0.2)",
                        },
                    ],
                },
            });
        }
        console.log(analyticsData);
    }, [analyticsData]);



    return(
        <div>
            <div className="header">
                <Header />
            </div>
            <SideNavs />
            {/* <TradingHistoryLinks /> */}
            <div className="trading-history-analytics">
                <h5>Trading History Analytics</h5>
                <div className="top-history-header">
                    <div>
                        <h6>Equity Amount</h6>
                        <p>${analyticsData.equity_amount}</p>
                    </div>
                    
                    <div>
                        <h6>Profit</h6>
                        <p>{analyticsData.profit >= 0 ? `+R${analyticsData.profit}` : `R${analyticsData.profit}`}</p>
                    </div>

                    <div>
                        <h6>ROI</h6>
                        <p>{analyticsData.roi && analyticsData.roi >= 0 ? `+${analyticsData.roi}%` : `${analyticsData.roi}%`}</p>
                    </div>

                </div>
                <div className="middle-history-header">
                    <div>
                        <h6>Win Rate</h6>
                        <p>{analyticsData.win_rate !== undefined ? `${analyticsData.win_rate.toFixed(2)}%` : "N/A"}</p>
                    </div>
                    <div>
                        <h6>Loss Rate</h6>
                        <p>{analyticsData.loss_rate !== undefined ? `${analyticsData.loss_rate.toFixed(2)}%` : "N/A"}</p>
                    </div>
                </div>

                <div className="bottom-history-header">
                    <div>
                        <h6>Maximum Drawdown</h6>
                        <p>{analyticsData.maximum_drawdown !== undefined ? `${analyticsData.maximum_drawdown.toFixed(2)}%` : "N/A"}</p>
                    </div>
                    <div>
                        <h6>Risk of Ruin</h6>
                        <p>{analyticsData.risk_of_ruin !== undefined ? `${analyticsData.risk_of_ruin.toFixed(2)}%` : "N/A"}</p>
                    </div>
                </div>
                <div className="middle-analytics">
                    <div className="middle-analytics-equity-over-time">
                    <h6>Equity Over Time</h6>
                    <canvas id="equityChart" width="550" height="300" className="equity-over-time-chart"></canvas>
                    </div>
                    <div className="middle-analytics-overall">
                            <h6 className="middle-analytics-overall-heading">Strategies</h6>          
                        <div className="strategy">
                            <div className="best-strategy">            
                                <h6 className="middle-analytics-overall-title">Best Strategy:</h6>
                                <p>{analyticsData.best_strategy}</p>
                            </div>  
                            <div className="worst-strategy">
                                <h6 className="middle-analytics-overall-title">Worst Strategy:</h6>
                                <p>{analyticsData.worst_strategy}</p>
                            </div>
                        </div>
                        <h6 className="middle-analytics-overall-heading">Timeframe</h6>
                        <div className="strategy">
                        <div className="best-strategy">
                            <h6 className="middle-analytics-overall-title">Best Timeframe:</h6>
                            <p>{analyticsData.best_timeframe}</p>
                        </div>
                        <div className="worst-strategy">
                            <h6 className="middle-analytics-overall-title">Worst Timeframe:</h6>
                            <p>{analyticsData.worst_timeframe}</p>
                        </div>
                        </div>
                        <h6 className="middle-analytics-overall-heading">Days</h6>
                        <div className="strategy">
                            <div className="best-strategy">
                                <h6 className="middle-analytics-overall-title">Day of Most Wins:</h6>
                                <p>{analyticsData.day_of_most_wins}</p>
                            </div>
                            <div className="worst-strategy">
                                <h6 className="middle-analytics-overall-title">Day of Most Losses:</h6>
                                <p>{analyticsData.day_of_most_losses}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="analytics-footer">
                    <h6>AI Feedback:</h6>
                    <p>Current performance evaluation is good. Current performance evaluation is good.Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good.</p>
                    <Link to="#" className="download-compiled-report"><i className="bi bi-download"></i> Download Compiled Report</Link>
                </div> */}
                
            </div>
            <br />
        </div>
    )
}