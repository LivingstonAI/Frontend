import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';



export default function SideNavs() {
    const uniqueID = uuidv4();
    return(
        <div className="all-side-navs">
        <div className="side-navs trading-history-links">
                {/* <Link to="/overview" className="side-nav"><p><i className="bi bi-plus-lg"></i>Overview</p></Link> */}
              <Link to="/trading_history_analytics" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-bar-chart-line-fill"></i> Trading History Analytics</p></button></Link>
                <Link to="/all_journals" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-journal-bookmark-fill"></i> Personal Journal</p></button></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-robot"></i> ChatBot</p></button></Link>
                {/* <Link to="#" className="side-nav"><p><i className="bi bi-book"></i>Books</p></Link> */}
                <Link to="/all_trades" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i class="bi bi-info-circle-fill"></i> All Trades</p></button></Link>
                <Link to="/major_news" className="side-nav"><button className="btn btn-light side-nav-btn"><p><i className="bi bi-newspaper"></i> Upcoming News Events</p></button></Link>
                {/* <Link to="/payment" className="side-nav"><i class="bi bi-credit-card-fill"></i>Market Dictionary</Link> */}
        </div>
        <div className="side-navs-cellphone">
                {/* <Link to="/overview" className="side-nav"><i className="bi bi-plus-lg"></i></Link> */}
                <Link to="/trading_history_analytics" className="side-nav"><i className="bi bi-bar-chart-line-fill"></i></Link>
                <Link to="/all_journals" className="side-nav"><i className="bi bi-journal-bookmark-fill"></i></Link>
                <Link to={`/conversation/${uniqueID}`} className="side-nav"><i className="bi bi-robot"></i></Link>
                {/* <Link to="#" className="side-nav"><i className="bi bi-book"></i></Link> */}
                <Link to="/all_trades" className="side-nav"><i class="bi bi-info-circle-fill"></i></Link>
                <Link to="/major_news" className="side-nav"><i className="bi bi-newspaper"></i></Link>
        </div>
        </div>
    )
}