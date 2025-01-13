import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import SideNavs from "./side_navs";
import TradingHistoryLinks from "./trading_history_links";


export default function TradingHistory() {
    return(
        <div>
            <div className="header">
                <Header />
            </div>
            <TradingHistoryLinks />
            <div className="trading-history-analytics">
                <h5>Trading History Analytics:</h5>
                <div className="top-history-header">
                    <div>
                        <h6>Equity Amount</h6>
                        <p>R3000</p>
                    </div>
                    <div>
                        <h6>Profit</h6>
                        <p>+R1000</p>
                    </div>
                    <div>
                        <h6>ROI</h6>
                        <p>+4%</p>
                    </div>
                </div>
                <div className="middle-history-header">
                    <div>
                        <h6>Peak Value</h6>
                        <p>R4000</p>
                    </div>
                    <div>
                        <h6>Trough Value</h6>
                        <p>R2500</p>
                    </div>
                </div>
                <div className="bottom-history-header">
                    <div>
                        <h6>Maximum Drawdown</h6>
                        <p>-5%</p>
                    </div>
                    <div>
                        <h6>Risk of Ruin</h6>
                        <p>30%</p>
                    </div>
                </div>
                <div className="middle-analytics">
                    <div className="middle-analytics-equity-over-time">
                    <h6>Equity Over Time</h6>
                    <img src="/Users/motin/Downloads/snowAI/my-react-app2/src/snowAI.png" alt="equity" />
                    </div>
                    <div className="middle-analytics-overall">
                        <h6>Best Strategy:</h6>
                        <p>Mean Reversion</p>
                        <h6>Worst Strategy:</h6>
                        <p>Bounce Strategy</p>
                        <h6>Best TimeFrame:</h6>
                        <p>4H</p>
                        <h6>Worst TimeFrame:</h6>
                        <p>1H</p>
                        <h6>Days of Most Wins:</h6>
                        <p>Tuesday</p>
                        <h6>Days of Most Losses:</h6>
                        <p>Thursday</p>
                    </div>
                </div>
                <div className="analytics-footer">
                    <h6>AI Feedback:</h6>
                    <p>Current performance evaluation is good. Current performance evaluation is good.Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good. Current performance evaluation is good.</p>
                    <Link to="#" className="download-compiled-report"><i className="bi bi-download"></i> Download Compiled Report</Link>
                </div>
                
            </div>
            <br />
        </div>
    )
}