import React from "react";
import { Link } from "react-router-dom";


export default function TradingHistoryLinks() {
    return (
        <div className="trading-history-links">
            <Link to="/trading_history_analytics" className="trading-history-link">Overall</Link>
        </div>
    )
}