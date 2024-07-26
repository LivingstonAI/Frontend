import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function DailyBrief() {
    const [dailyBriefData, setDailyBriefData] = useState(null);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        fetch(`${baseUrl}/fetch-daily-brief-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => setDailyBriefData(data))
        .catch(error => console.error('Error fetching daily brief data:', error));
    }, []);

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>Daily Brief</h5>
                    <hr />
                    {dailyBriefData ? (
                        <>
                            <p>Asset: {dailyBriefData.asset}</p>
                            <p>{dailyBriefData.summary}</p>
                            <p>{new Date(dailyBriefData.last_update).toLocaleString()}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
