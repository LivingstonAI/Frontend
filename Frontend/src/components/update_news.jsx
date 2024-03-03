import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';


export default function UpdateNews() {
    const currencyArray = ['Select Currencies', 'EURUSD', 'GBPUSD', 'EURGBP', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'USDZAR', 'EURAUD','GBPJPY'];
    const [outcome, setOutcome] = useState('');
    const [colorOutcome, setColorOutcome] = useState('');
    const [updateStatus, setUpdateStatus] = useState('Update');
    // State to store selected currencies
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get('email');
    };


    // Function to handle select change and update selected currencies
    const handleCurrencyChange = (e) => {
        const selectedCurrency = e.target.value;
        // Check if the currency is already selected
        if (!selectedCurrencies.includes(selectedCurrency)) {
            // console.log(selectedCurrency);
            if (selectedCurrency !== 'Select Currencies'){
                setSelectedCurrencies([...selectedCurrencies, selectedCurrency]);
            };
        }
    };

    useEffect(() => {
        console.log('Selected Currencies are:')
        console.log(selectedCurrencies);   
    })

    useEffect(() => {
        async function fetchNewsData() {
            try {
                const email = await fetchEmailDataFromAPI();
                const response = await fetch(`${baseUrl}/fetch_news_data/${email}`);
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
                // console.log(selectedCurrencies);
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
                    const data = await response.json();
                    // console.log('Response is: ');
                    // console.log(data);
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
                    <p className="to-ask-livingston">(to ask Livingston)</p><br />
                    
                    <div className="update-news-div">
                        <select className='form-control' onChange={handleCurrencyChange}>
                            {currencyArray.map((currency, index) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>
                        {/* Display selected currencies */}<br />
                        <div>
                            <h6>Selected Currencies:</h6>
                            <ul>
                                {selectedCurrencies.map((currency, index) => (
                                    <li key={index}>
                                        {currency}
                                        <i onClick={() => removeCurrency(currency)} className="bi bi-x update-currency"></i>
                                    </li>
                                ))}
                            </ul>
                            
                            <button className="btn btn-primary" onClick={updateNewsData}>{updateStatus}</button><br /><br />
                            <p className={colorOutcome}>{outcome}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
