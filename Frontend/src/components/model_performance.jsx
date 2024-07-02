import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { format, parseISO } from 'date-fns';

export default function ModelPerformance() {
    const [modelsData, setModelsData] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [showModelIndex, setShowModelIndex] = useState(null);
    const [totalProfitLoss, setTotalProfitLoss] = useState(null);
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        fetch(`${baseUrl}/get-model-performance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken') // Ensure CSRF token is sent with the request if required
            }
        })
            .then(response => response.json())
            .then(data => {
                setModelsData(data);
                setFilteredModels(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching model performance:', error));
    }, []);

    const handleToggleModelCode = (index) => {
        setShowModelIndex(prevIndex => prevIndex === index ? null : index);
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
        if (event.target.value === '') {
            setFilteredModels(modelsData);
        } else {
            setFilteredModels(modelsData.filter(model => model.model_id.toString().includes(event.target.value)));
        }
    };

    const handleCalculateTotalProfitLoss = () => {
        const total = filteredModels.reduce((acc, model) => acc + parseFloat(model.profit), 0);
        setTotalProfitLoss(total);
    };

    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'EEEE, d MMMM yyyy');
    };

    const groupModelsByDate = (models) => {
        return models.reduce((groupedModels, model) => {
            const formattedDate = formatDate(model.date_taken);
            if (!groupedModels[formattedDate]) {
                groupedModels[formattedDate] = [];
            }
            groupedModels[formattedDate].push(model);
            return groupedModels;
        }, {});
    };

    const groupedModels = groupModelsByDate(filteredModels);

    if (modelsData.length === 0) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5>Model Performance</h5><br />
                        <h5>Loading...</h5>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>Model Performance</h5><br />
                    <p>Filter by Model ID</p>
                    <input
                        type="text"
                        placeholder="Filter by Model ID"
                        value={filterValue}
                        onChange={handleFilterChange}
                        className="filter-input form-control"
                    /><br />
                    <button onClick={handleCalculateTotalProfitLoss} className="btn btn-primary calculate-pl-button">Calculate Total Profit/Loss</button><br /><br />
                    {totalProfitLoss !== null && <p>Total Profit/Loss: {totalProfitLoss}</p>} 
                    {Object.keys(groupedModels).map((date, index) => (
                        <div key={index}>
                            <h5 className="model-dates">{date}</h5>
                            <hr />
                            {groupedModels[date].map((model, modelIndex) => (
                                <div key={model.model_id} className="genesys-model-performance">
                                    <p>Model ID: {model.model_id}</p>
                                    <p>Initial Equity: {model.initial_equity}</p>
                                    <p>Order Ticket: {model.order_ticket}</p>
                                    <p>Asset: {model.asset}</p>
                                    <p>Profit: {model.profit}</p>
                                    <p>Volume: {model.volume}</p>
                                    <p>Type of Trade: {model.type_of_trade}</p>
                                    <p>Timeframe: {model.timeframe}</p>
                                    <p>Date Taken: {formatDate(model.date_taken)}</p>
                                    {showModelIndex === modelIndex && <p>Model Code: <br /> {model.model_code}</p>}
                                    <button onClick={() => handleToggleModelCode(modelIndex)} className="btn btn-primary">
                                        {showModelIndex === modelIndex ? "Hide Model Code" : "View Model Code"}
                                    </button>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
