import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function UpdateNews() {
    const currencyArray = ['EURUSD', 'GBPUSD', 'EURGBP', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'USDZAR', 'EURAUD', 'GBPJPY'];
    const [outcome, setOutcome] = useState('');
    const [colorOutcome, setColorOutcome] = useState('');
    const [updateStatus, setUpdateStatus] = useState('Update');
    // State to store selected currencies
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    // State to control modal visibility
    const [showModal, setShowModal] = useState(false);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get('email');
    };

    // Function to handle currency selection in modal
    const handleCurrencySelect = (selectedCurrency) => {
        if (!selectedCurrencies.includes(selectedCurrency)) {
            setSelectedCurrencies([...selectedCurrencies, selectedCurrency]);
        }
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    useEffect(() => {
        async function fetchNewsData() {
            try {
                const email = await fetchEmailDataFromAPI();
                const response = await fetch(`${baseUrl}/fetch_user_news_data/${email}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const news_data = data['news_data'];
    
                const newCurrencies = [];
                for (let i = 0; i < news_data.length; i++) {
                    if (!selectedCurrencies.includes(news_data[i].symbol)) {
                        newCurrencies.push(news_data[i].symbol);
                    }
                }

                const uniqueArray = newCurrencies.filter((value, index) => newCurrencies.indexOf(value) === index);
    
                // Combine existing selectedCurrencies with newCurrencies array
                setSelectedCurrencies([...selectedCurrencies, ...uniqueArray]);
                if (selectedCurrencies.length > 0) {
                    const finalCurrencyArray = selectedCurrencies.filter((value, index) => selectedCurrencies.indexOf(value) === index);
                    setSelectedCurrencies(finalCurrencyArray);
                }
            } catch (error) {
                console.error("Error fetching news data:", error);
            }
        }
    
        fetchNewsData();
    }, []); // Add selectedCurrencies as a dependency if needed

    // Function to remove a selected currency
    const removeCurrency = (currencyToRemove) => {
        const updatedCurrencies = selectedCurrencies.filter(currency => currency !== currencyToRemove);
        setSelectedCurrencies(updatedCurrencies);
    };

    const updateNewsData = async () => {
        if (selectedCurrencies.length > 0) {
            setUpdateStatus('Updating...');
            setOutcome('');
            try {
                const email = await fetchEmailDataFromAPI();
                const response = await fetch(`${baseUrl}/update-news-data/${email}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ currencies: selectedCurrencies }),
                });

                if (response.ok) {
                    setOutcome('News Data updated successfully!');
                    setColorOutcome('updated-success');
                    setUpdateStatus('Update');
                } else {
                    throw new Error('Failed to update news data');
                }
            } catch (error) {
                setOutcome('Failed to update news data');
                setColorOutcome('updated-error');
                setUpdateStatus('Update');
            }
        } else {
            setOutcome('Please select currencies');
            setColorOutcome('updated-error');
            setUpdateStatus('Update');
        };
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Update News Data</h5>
                   
                    <br />
                    
                    <div className="update-news-div">
                        <button 
                            className="btn btn-primary currency-select-btn" 
                            onClick={toggleModal}
                        >
                            Select Currencies <i className="bi bi-chevron-down"></i>
                        </button>
                        
                        {/* Display selected currencies */}<br />
                        <div>
                            <h6>Selected Currencies:</h6>
                            <ul className="selected-currency-list">
                                {selectedCurrencies.map((currency, index) => (
                                    <li key={index} className="selected-currency-item">
                                        <span className="currency-badge">{currency}</span>
                                        <i onClick={() => removeCurrency(currency)} className="bi bi-x update-currency"></i>
                                    </li>
                                ))}
                            </ul>
                            
                            <button className="btn btn-primary" onClick={updateNewsData}>{updateStatus}</button><br /><br />
                            <p className={colorOutcome}>{outcome}</p>
                        </div>
                    </div>
                    
                    {/* Currency Selection Modal */}
                    {showModal && (
                        <div className="currency-modal-overlay">
                            <div className="currency-modal">
                                <div className="currency-modal-header">
                                    <h5>Select Currencies</h5>
                                    <button className="close-modal-btn" onClick={toggleModal}>
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                                <div className="currency-modal-body">
                                    {currencyArray.map((currency, index) => (
                                        <div 
                                            key={index} 
                                            className={`currency-option ${selectedCurrencies.includes(currency) ? 'currency-selected' : ''}`}
                                            onClick={() => handleCurrencySelect(currency)}
                                        >
                                            {currency}
                                            {selectedCurrencies.includes(currency) && (
                                                <i className="bi bi-check-lg currency-check"></i>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="currency-modal-footer">
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={toggleModal}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}