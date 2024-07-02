import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { format, parseISO } from 'date-fns';
import { Chart, registerables } from "chart.js/auto"; // Import from "chart.js/auto" for correct import
Chart.register(...registerables);

export default function ModelPerformance() {
    const [modelsData, setModelsData] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [showModelIndex, setShowModelIndex] = useState(null);
    const [totalProfitLoss, setTotalProfitLoss] = useState(null);
    const [equityChart, setEquityChart] = useState(null);
    const chartContainer = useRef(null); // useRef hook for Canvas element
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        fetch(`${baseUrl}/get-model-performance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        })
            .then(response => response.json())
            .then(data => {
                setModelsData(data);
                setFilteredModels(data); // Initialize filteredModels with all data
                console.log(data);
            })
            .catch(error => console.error('Error fetching model performance:', error));
    }, []);

    useEffect(() => {
        if (!chartContainer.current) return; // Check if chartContainer.current is available
        
        if (equityChart) {
            equityChart.destroy(); // Destroy existing chart before rendering new one
        }

        const ctx = chartContainer.current.getContext('2d'); // Get context only if chartContainer.current is available

        const filteredModel = filteredModels.find(model => model.model_id.toString() === filterValue);
        if (filteredModel) {
            const profitArray = getProfitArrayForModelId(filterValue);
            const equityCurve = calculateEquityCurve(profitArray, parseFloat(filteredModel.initial_equity));
            setEquityChart(new Chart(ctx, {
                type: 'line',
                data: {
                    labels: equityCurve.map((_, index) => index + 1),
                    datasets: [{
                        label: 'Equity Curve',
                        data: equityCurve,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Equity Curve for Model ID ${filterValue}`,
                            padding: {
                                bottom: 10
                            }
                        }
                    }
                }
            }));
        }
    }, [filteredModels, filterValue]);

    const handleToggleModelCode = (index) => {
        setShowModelIndex(prevIndex => prevIndex === index ? null : index);
    };

    const handleFilterChange = (event) => {
        const { value } = event.target;
        setFilterValue(value);
        // Filter models based on model_id matching filterValue
        const filtered = modelsData.filter(model => model.model_id.toString().includes(value));
        setFilteredModels(filtered);
    };

    const handleCalculateTotalProfitLoss = () => {
        const total = filteredModels.reduce((acc, model) => acc + parseFloat(model.profit), 0);
        setTotalProfitLoss(total);
    };

    // Function to get an array of profits for a specific model ID
    const getProfitArrayForModelId = (modelId) => {
        // Filter models by modelId and extract profits
        const filteredProfits = filteredModels
            .filter(model => model.model_id.toString() === modelId)
            .map(model => parseFloat(model.profit));
    
    
        return filteredProfits;
    };

    // Function to calculate equity curve based on profit array and initial equity
    const calculateEquityCurve = (profits, initialEquity) => {
        const equityCurve = profits.reduce((acc, profit) => {
            const currentEquity = acc.length > 0 ? acc[acc.length - 1] + profit : initialEquity + profit;
            acc.push(currentEquity);
            return acc;
        }, []);
        return equityCurve;
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
                    <div className="model-performance-summary">
                        <div className="model-summary-chart">
                            <canvas ref={chartContainer}></canvas>
                        </div>
                        <div className="model-performance-metrics">
                            <p>Best Weekday: Monday</p>
                            <p>Worst Weekday: Tuesday</p>
                            <p>Best Timeframe: 1d</p>
                            <p>Worst Timeframe: 1H</p>
                            <p>Win Rate: 50%</p>
                            <p>Loss Rate: 50%</p>
                            <p>Overall Return: $1000</p>
                        </div>
                    </div><br />
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
