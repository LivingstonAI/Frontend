import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNavs from "./side_navs";
import Header from "./header";
import LiveClock from "./view_clock";
import axios from 'axios';

export default function OverView() {
    const navigate = useNavigate();

    const registeredEmail = 'pythonappbrewery@gmail.com';

    const [trades, setTrades] = useState([]);
    let equityChange = 0;
    let totalROI = 0;

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await axios.get(`https://backend-production-c0ab.up.railway.app/all_trades/${registeredEmail}/`);
                const parsedData = JSON.parse(response.data.trades); // Parse the JSON string
                setTrades(parsedData);
            } catch (error) {
                console.error('Error fetching trades:', error);
            }
        };

        fetchTrades();
    }, []);
    

    // Calculate total ROI and limit trades for the summary
    const summaryTrades = trades.slice(0, 7); // Take the first 7 trades
    if (summaryTrades.length > 0) {
        totalROI = summaryTrades.reduce((total, trade) => total + trade.fields.roi, 0);
    }

    equityChange = trades.reduce((total, trade) => total + trade.fields.roi, 0);

    // Create a set to store unique assets
    const uniqueAssetsSet = new Set();
    trades.forEach(trade => uniqueAssetsSet.add(trade.fields.asset));
    const uniqueAssets = Array.from(uniqueAssetsSet);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                <LiveClock />
                    <h5 className="overview-summary-title">Summary:</h5>
                    <div className="entire-summary-div">
                    <h6>Trading Capital: {equityChange >= 0 ? `+${equityChange}` : equityChange}%</h6>
                        <div className="summary-of-all-trades">
                            <h6>Assets Traded:</h6>
                            {trades.length > 0 && (
                                <p>{uniqueAssets.join(', ')}</p>
                            )}
                            <h6>Return on Investment: {equityChange >= 0 ? `+${equityChange}` : -equityChange}%</h6>
                        </div>
                        {/* Other summary sections */}
                        <div className="summary-upcoming-news">
                    <h6>Upcoming News Events Based on Your Asset Preferance:</h6>
                    <p>14:30: USD(CPI)</p>
                    <p>20:00: CAD(NFP)</p>
                </div>
                <div className="summary-current-performance-eval">
                    <h6>Current Performance Evaluation:</h6>
                    <p>Good</p>
                </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
