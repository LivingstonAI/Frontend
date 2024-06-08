import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


export default function SideNavs() {
    const uniqueID = uuidv4();
    const [timeNY, setTimeNY] = useState('');
    const [timeLondon, setTimeLondon] = useState('');
    const [timeTokyo, setTimeTokyo] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            
            // New York time
            const formatterNY = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...options });
            setTimeNY(formatterNY.format(now));

            // London time
            const formatterLondon = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', ...options });
            setTimeLondon(formatterLondon.format(now));

            // Tokyo time
            const formatterTokyo = new Intl.DateTimeFormat('en-JP', { timeZone: 'Asia/Tokyo', ...options });
            setTimeTokyo(formatterTokyo.format(now));
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return(
        <div className="all-side-navs">
        <div className="side-navs trading-history-links">
                <Link to="/personal_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-person"></i>Personal Info</p></button></Link>
              <Link to="/trading_history_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i> Analytics</p></button></Link>
                <Link to="/market_makers" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i> Market Makers</p></button></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-chat-square-dots"></i> ChatBot</p></button></Link>
                {/* <Link to="#" className="side-nav"><p><i className="bi bi-book"></i>Books</p></Link> */}
                <Link to="/update_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-newspaper"></i> Update News</p></button></Link>
                <Link to="/all_trades" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-info-circle-fill"></i> Enter Trades</p></button></Link>
                <Link to="/scratch" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i> Create Models</p></button></Link>
                <Link to="/model_performance" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-pen-fill"></i> Performances</p></button></Link>
                {/* <Link to="/payment" className="side-nav"><i class="bi bi-credit-card-fill"></i>Market Dictionary</Link> */}
        </div>
        <div className="side-navs-cellphone">
                {/* <Link to="/overview" className="side-nav"><i className="bi bi-plus-lg"></i></Link> */}
                <Link to="/personal_info" className="side-nav"><i className="bi bi-person"></i></Link>
                <Link to="/trading_history_analytics" className="side-nav"><i className="bi bi-bar-chart-line-fill"></i></Link>
                <Link to="/market_makers" className="side-nav"><i className="bi bi-journal-bookmark-fill" /></Link>
                {/* <Link to="/all_journals" className="side-nav"><i className="bi bi-journal-bookmark-fill"></i></Link> */}
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><i className="bi bi-chat-square-dots"></i></Link>
                {/* <Link to="#" className="side-nav"><i className="bi bi-book"></i></Link> */}
                <Link to="/update_news" className="side-nav"><i class="bi bi-newspaper"></i></Link>
                <Link to="/all_trades" className="side-nav"><i className="bi bi-info-circle-fill"></i></Link>
                <Link to="/scratch" className="side-nav"><i className="bi bi-robot"></i></Link>
                <Link to="/model_performance" className="side-nav"><i className="bi bi-pen-fill"></i></Link>
        </div>
        <br />
        <div className="timezones">
                <div className="clock">
                    <h5>New York</h5>
                    <p>{timeNY}</p>
                </div>
                <div className="clock">
                    <h5>London</h5>
                    <p>{timeLondon}</p>
                </div>
                <div className="clock">
                    <h5>Tokyo</h5>
                    <p>{timeTokyo}</p>
                </div>
            </div>
        </div>
    )
}