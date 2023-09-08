import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import SideNavs from "./side_navs";
import LiveClock from "./view_clock";
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AllTrades() {
    const navigate = useNavigate();
    const baseURL = 'https://backend-production-c0ab.up.railway.app'


    // const registeredEmail = 'pythonappbrewery@gmail.com';

    const [trades, setTrades] = useState([]);
    // Calculate total ROI
    const totalROI = trades.reduce((total, trade) => total + trade.fields.roi, 0);

    const fetchEmailDataFromAPI = () => {
       return Cookies.get('email');
    };



    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const email = fetchEmailDataFromAPI(); 
                const response = await axios.get(`${baseURL}/all_trades/${email}/`);
                const parsedData = JSON.parse(response.data.trades); // Parse the JSON string
                setTrades(parsedData);
               
            } catch (error) {
                console.error('Error fetching trades:', error);
            }
        };

        fetchTrades();
    }, []);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="journal-liveclock">
                        <LiveClock />
                    </div>
                    <h5 className="all-trades-header">All Trades</h5>
                    <Link to="/enter_new_trade" className="enter-new-trade-cta">Enter New Trade</Link>
                    <div className="all-trades-div">
                    <strong><p className="trading-equity-change">Trading Capital: {totalROI}%</p></strong>
                        {trades.map((trade, index) => (
                            <div key={index}>
                                <hr />
                                <p>Asset: {trade.fields.asset}</p>
                                <p>ROI: {trade.fields.roi}%</p>
                                <p>Date Taken: {new Date(trade.fields.entry_date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                <p>Date Closed: {new Date(trade.fields.exit_date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                <Link className="btn btn-secondary" to={`/full_trade/${trade.pk}`}>View Full Trade</Link>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
