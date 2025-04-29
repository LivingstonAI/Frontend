import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function CalendarData() {

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const currencyArray = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']


    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Calendar Data Metrics</h5>
                   
                    <br />
                    
                </div>
                
            </div>
        </div>
    );
}