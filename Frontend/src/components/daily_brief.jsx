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
    const [selectedCurrencies, setSelectedCurrencies] = useState([]); // To hold selected currencies
    const [assetUpdateProcess, setAssetUpdateProcess] = useState('Update Selected Assets');

    const currencies = ['EURUSD', 'GBPUSD', 'EURGBP', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'USDZAR', 'EURAUD','GBPJPY'];

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
            console.log(data);
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

    const handleCurrencySelection = (currency) => {
        setSelectedCurrencies(prevState => 
            prevState.includes(currency) 
            ? prevState.filter(c => c !== currency) // Remove currency if already selected
            : [...prevState, currency] // Add currency to the list
        );
    };

    const handleSubmitCurrencies = async () => {
        setAssetUpdateProcess('Updating Assets...');
        try {
            const response = await fetch(`${baseUrl}/set-daily-brief-assets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                body: JSON.stringify({ assets: selectedCurrencies })
            });

            if (!response.ok) {
                alert('Network response was not ok');
                setAssetUpdateProcess('Update Selected Assets');
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message);
            alert(data.message);
            setAssetUpdateProcess('Update Selected Assets');
        } catch (error) {
            console.error('Error submitting currencies:', error);
            alert('Error occured!');
            setAssetUpdateProcess('Update Selected Assets');
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

                    <div className="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">

                                Select Currencies
                            </button>
                            <ul className="dropdown-menu">
                                {currencies.map((currency, index) => (
                                    <li key={index}>
                                        <a className="dropdown-item" onClick={() => handleCurrencySelection(currency)}>
                                            {currency}
                                            {selectedCurrencies.includes(currency) && <span> (Selected)</span>}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div><br />
                        
                        <div className="manually-update">
                            <button className="btn btn-primary" onClick={handleSubmitCurrencies}>{assetUpdateProcess}</button>
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
