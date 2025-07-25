import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function AICouncilConvos() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">AI Council Conversations</h5>
                   
                    <br />
    
                </div>
            </div>
        </div>
    );
}