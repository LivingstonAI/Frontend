import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ModelPerformance () {
    const [modelsData, setModelsData] = useState([]);
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
        .then(data => setModelsData(data))
        .catch(error => console.error('Error fetching model performance:', error));
    }, []);

    if (modelsData.length === 0) {
        return <div>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5>Model Performance</h5><br />
<<<<<<< HEAD
                    <h5>Loading...</h5>
=======
                    <p>Loading...</p>
>>>>>>> origin/main
                    </div>
                    </div>
        </div>;
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
                    <hr />
                    {modelsData.map(model => (
                        <div key={model.model_id} className="genesys-model-performance">
                            <p>Model ID: {model.model_id}</p>
                            <p>Initial Equity: {model.initial_equity}</p>
                            <p>Order Ticket: {model.order_ticket}</p>
                            <p>Asset: {model.asset}</p>
                            <p>Profit: {model.profit}</p>
                            <p>Volume: {model.volume}</p>
                            <p>Type of Trade: {model.type_of_trade}</p>
                            <p>Timeframe: {model.timeframe}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
