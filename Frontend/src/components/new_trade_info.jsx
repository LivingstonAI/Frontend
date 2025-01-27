import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavs from "./side_navs";
import Header from "./header";
import Cookies from 'js-cookie';

export default function EnterNewTradeInfo() {
    const navigate = useNavigate();
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [process, setProcess] = useState('Record Trade');

    // State to hold form data
    const [tradeData, setTradeData] = useState({
        asset: "",
        order_type: "",
        strategy: "",
        day_of_week_entered: "",
        trading_session_entered: "",
        outcome: "",
        amount: "",
        emotional_bias: "",
        reflection: "",
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTradeData({
            ...tradeData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcess('Recording Trade...');

        const accountName = Cookies.get('account_name');
        if (!accountName) {
            alert('Account not found.');
            setProcess('Record Trade');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/create-new-trade-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_name: accountName,
                    ...tradeData,
                }),
            });

            if (response.ok) {
                alert('Trade recorded successfully!');
                setProcess('Record Trade');
            } else {
                alert('Error recording trade.');
                setProcess('Record Trade');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the trade.');
            setProcess('Record Trade');
        }
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <SideNavs />
            <div className="main-body-info">
                <h5>Enter New Trade</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Asset</label>
                        <input
                            type="text"
                            name="asset"
                            value={tradeData.asset}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="e.g., EURUSD"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Order Type</label>
                        <select
                            name="order_type"
                            value={tradeData.order_type}
                            className="form-control"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select order type</option>
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Strategy</label>
                        <input
                            type="text"
                            name="strategy"
                            value={tradeData.strategy}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="e.g., Breakout"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Day of Week Entered</label>
                        <input
                            type="text"
                            name="day_of_week_entered"
                            value={tradeData.day_of_week_entered}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="e.g., Monday"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Trading Session Entered</label>
                        <input
                            type="text"
                            name="trading_session_entered"
                            value={tradeData.trading_session_entered}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="e.g., London"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="outcome">Outcome of Trade</label>
                        <select
                            id="outcome"
                            name="outcome"
                            value={tradeData.outcome}
                            className="form-control"
                            onChange={handleChange}
                        >
                            <option value="">Select Outcome</option>
                            <option value="Win">Win</option>
                            <option value="Loss">Loss</option>
                            <option value="Break Even">Break Even</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={tradeData.amount}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="e.g., 150"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Emotional Bias (Optional)</label>
                        <textarea
                            name="emotional_bias"
                            value={tradeData.emotional_bias}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="Notes on your emotional state"
                        />
                    </div>
                    <div className="form-group">
                        <label>Reflection (Optional)</label>
                        <textarea
                            name="reflection"
                            value={tradeData.reflection}
                            className="form-control"
                            onChange={handleChange}
                            placeholder="What did you learn from this trade?"
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">{process}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
