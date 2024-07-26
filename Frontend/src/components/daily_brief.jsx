import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function DailyBrief() {
    const [dailyBriefData, setDailyBriefData] = useState([]);
    const [filter, setFilter] = useState("");
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [updateStatus, setUpdateStatus] = useState("Manually Update");
    const [expandedSummaries, setExpandedSummaries] = useState({});

    useEffect(() => {
        fetchDailyBriefData();
    }, []);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const fetchDailyBriefData = () => {
        fetch(`${baseUrl}/fetch-daily-brief-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setDailyBriefData(data))
        .catch(error => console.error('Error fetching daily brief data:', error));
    };

    const handleManualUpdate = async () => {
        setUpdateStatus('Updating Daily Brief Data...');
        try {
            const response = await fetch(`${baseUrl}/daily-brief`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message);
            setUpdateStatus('Daily Brief Updated Successfully!');
            await sleep(2000);
            fetchDailyBriefData();  // Refresh the data after manual update
        } catch (error) {
            console.error('Error updating daily brief:', error);
            setUpdateStatus('Error Occurred');
        } finally {
            await sleep(2000);
            setUpdateStatus('Manually Update');
        }
    };

    const toggleSummary = (index) => {
        setExpandedSummaries((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

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
                            <button className="btn btn-primary" onClick={handleManualUpdate}>{updateStatus}</button>
                        </div>
                    </div>
                    <hr />
                    <div className="daily-brief-div">
                        {filteredBriefData.length > 0 ? (
                            filteredBriefData.map((brief, index) => (
                                <div key={index}>
                                    <p><b>Asset</b>: {brief.asset}</p>
                                    <p><b>Summary</b>: <br />
                                        {expandedSummaries[index] ? (
                                            <>
                                                {brief.summary}<br />
                                                <button className="btn btn-primary" onClick={() => toggleSummary(index)}>Read less</button>
                                            </>
                                        ) : (
                                            <>
                                                {brief.summary.length > 500 ? (
                                                    <>
                                                        {brief.summary.substring(0, 500)}...
                                                        <br /><button className="btn btn-primary" onClick={() => toggleSummary(index)}>Read more</button>
                                                    </>
                                                ) : (
                                                    brief.summary
                                                )}
                                            </>
                                        )}
                                    </p>
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
