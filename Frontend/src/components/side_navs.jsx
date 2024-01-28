import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';



export default function SideNavs() {
    const uniqueID = uuidv4();
    return(
        <div className="all-side-navs">
        <div className="side-navs trading-history-links">
                <Link to="/personal_info" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-person"></i>Personal Info</p></button></Link>
              <Link to="/trading_history_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i> Trading Analytics</p></button></Link>
                <Link to="/market_makers" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i> Market Makers</p></button></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-chat-square-dots"></i> ChatBot</p></button></Link>
                {/* <Link to="#" className="side-nav"><p><i className="bi bi-book"></i>Books</p></Link> */}
                <Link to="/update_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-info-circle-fill"></i> Update News</p></button></Link>
                <Link to="/all_trades" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-newspaper"></i> Enter Trades</p></button></Link>
                <Link to="/models" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i> Create Models</p></button></Link>
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
                <Link to="/update_news" className="side-nav"><i class="bi bi-info-circle-fill"></i></Link>
                <Link to="/all_trades" className="side-nav"><i className="bi bi-newspaper"></i></Link>
                <Link to="/models" className="side-nav"><i className="bi bi-robot"></i></Link>
        </div>
        </div>
    )
}