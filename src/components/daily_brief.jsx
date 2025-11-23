import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function DailyBrief() {
    const [dailyBriefData, setDailyBriefData] = useState([]);
    const [filter, setFilter] = useState("");
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [updateStatus, setUpdateStatus] = useState("Manually Update");
    const [expandedSummaries, setExpandedSummaries] = useState({});
    const [selectedCurrencies, setSelectedCurrencies] = useState([]); // To hold selected currencies
    const [assetUpdateProcess, setAssetUpdateProcess] = useState('Update Selected Assets');
    const [showModal, setShowModal] = useState(false);

    const currencies = ['EURUSD', 'GBPUSD', 'EURGBP', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'USDZAR', 'EURAUD','GBPJPY'];

    // Initialize Bootstrap JavaScript
    useEffect(() => {
        // Bootstrap JS should be initialized here
        // The import in the header should be sufficient, but we can ensure it's loaded
        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
        bootstrapScript.integrity = 'sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p';
        bootstrapScript.crossOrigin = 'anonymous';
        document.body.appendChild(bootstrapScript);

        return () => {
            document.body.removeChild(bootstrapScript);
        };
    }, []);

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
        setShowModal(false); // Close modal
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

    const selectAllCurrencies = () => {
        setSelectedCurrencies([...currencies]);
    };

    const deselectAllCurrencies = () => {
        setSelectedCurrencies([]);
    };

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

                    {/* Button to open modal */}
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowModal(true)}
                    >
                        Select Currencies
                    </button><br /><br />
                    
                    <div className="manually-update">
                        <button className="btn btn-primary" onClick={handleSubmitCurrencies}>{assetUpdateProcess}</button>
                    </div>
                    <hr />

                    {/* Currency selection modal */}
                    {showModal && (
                        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Select Currencies</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <button className="btn btn-sm btn-outline-primary" onClick={selectAllCurrencies}>Select All</button>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={deselectAllCurrencies}>Deselect All</button>
                                        </div>
                                        <div className="row row-cols-2">
                                            {currencies.map((currency, index) => (
                                                <div key={index} className="col mb-2">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`currency-${index}`}
                                                            checked={selectedCurrencies.includes(currency)}
                                                            onChange={() => handleCurrencySelection(currency)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`currency-${index}`}>
                                                            {currency}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={handleSubmitCurrencies}>Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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