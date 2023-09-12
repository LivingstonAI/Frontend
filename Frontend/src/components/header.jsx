import React from "react";
import { Link } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export default function Header() {
    const uniqueID = uuidv4();
    return (
        <div className="main-page-header"><br />
            {/* <img src="/Users/motin/Downloads/snowAI.png"></img> */}
            <div className="all-header-navs">
            <div className="header-navigations">
                <Link to="/" className="overview-link"><h5>snowAI</h5></Link>
                <Link to="/all_journals" className="overview-link"><h5>Main Page</h5></Link>
                {/* <Link to="/personal_info" className="personal-info-link"><i class="bi bi-person personal-info-link-icon"></i></Link> */}
            </div>
            <Link to="/" className="overview-link"><h5 className="sign-out-cta">Sign Out</h5></Link>
            </div>
        </div>
    )
}