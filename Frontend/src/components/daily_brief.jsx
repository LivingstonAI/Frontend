import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function DailyBrief() {
    const [dailyBriefData, setDailyBriefData] = useState([]);
    const [filter, setFilter] = useState("");
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

    // Filter the briefings based on the filter input
    const filteredBriefData = dailyBriefData.filter(brief =>
        brief.asset.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>Daily Brief</h5>
                    <div className="daily-brief-upper-section">
                        <div className="daily-brief-asset-filter">
                            <input
                                type="text"
                                placeholder="Filter by Asset"
                                className="filter-input form-control"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            /><br />
                        </div>
                        <div className="manually-update">
                            <button className="btn btn-primary">Manually Update</button>
                        </div>
                    </div>
                    <hr />
                    <div className="daily-brief-div">
                        {filteredBriefData.length > 0 ? (
                            filteredBriefData.map((brief, index) => (
                                <div key={index}>
                                    <p><b>Asset</b>: {brief.asset}</p>
                                    <p><b>Summary</b>: <br />{brief.summary}</p>
                                    <p><b>Latest Update</b>: {new Date(brief.last_update).toLocaleString()}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
