import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function TradeIdeas() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [tradeIdeas, setTradeIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        heading: '',
        asset: '',
        trade_idea: '',
        trade_status: 'Open'
    });

    useEffect(() => {
        fetchTradeIdeas();
    }, []);

    const fetchTradeIdeas = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/trade-ideas/`, {
                headers: {
                    'Authorization': `Token ${Cookies.get('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch trade ideas');
            }
            
            const data = await response.json();
            setTradeIdeas(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/api/trade-ideas/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${Cookies.get('token')}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create trade idea');
            }
            
            // Reset form and refresh trade ideas
            setFormData({
                heading: '',
                asset: '',
                trade_idea: '',
                trade_status: 'Open'
            });
            fetchTradeIdeas();
        } catch (err) {
            setError(err.message);
        }
    };

    const updateTradeStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/trade-ideas/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${Cookies.get('token')}`
                },
                body: JSON.stringify({ trade_status: newStatus })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update trade status');
            }
            
            fetchTradeIdeas();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Trade Ideas</h5>
                    
                    <div className="trade-idea-form card">
                        <div className="card-body">
                            <h6 className="card-title">Add New Trade Idea</h6>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="heading">Heading</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="heading" 
                                        name="heading"
                                        value={formData.heading}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="asset">Asset</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="asset" 
                                        name="asset"
                                        value={formData.asset}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="trade_idea">Trade Idea</label>
                                    <textarea 
                                        className="form-control" 
                                        id="trade_idea" 
                                        name="trade_idea"
                                        value={formData.trade_idea}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="trade_status">Status</label>
                                    <select 
                                        className="form-control" 
                                        id="trade_status" 
                                        name="trade_status"
                                        value={formData.trade_status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Monitoring">Monitoring</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                    
                    <br />
                    
                    <div className="trade-ideas-list">
                        <h6>My Trade Ideas</h6>
                        {loading ? (
                            <p>Loading trade ideas...</p>
                        ) : tradeIdeas.length === 0 ? (
                            <p>No trade ideas yet. Create your first one above!</p>
                        ) : (
                            tradeIdeas.map(idea => (
                                <div key={idea.id} className="card mb-3">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <strong>{idea.heading}</strong>
                                        <span className={`badge bg-${
                                            idea.trade_status === 'Open' ? 'success' : 
                                            idea.trade_status === 'Closed' ? 'danger' : 'warning'
                                        }`}>
                                            {idea.trade_status}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-subtitle mb-2 text-muted">Asset: {idea.asset}</h6>
                                        <p className="card-text">{idea.trade_idea}</p>
                                        <div className="text-muted small">Created: {new Date(idea.date_created).toLocaleString()}</div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="btn-group" role="group">
                                            <button 
                                                className="btn btn-sm btn-outline-success" 
                                                onClick={() => updateTradeStatus(idea.id, 'Open')}
                                                disabled={idea.trade_status === 'Open'}
                                            >
                                                Mark Open
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-warning" 
                                                onClick={() => updateTradeStatus(idea.id, 'Monitoring')}
                                                disabled={idea.trade_status === 'Monitoring'}
                                            >
                                                Monitor
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger" 
                                                onClick={() => updateTradeStatus(idea.id, 'Closed')}
                                                disabled={idea.trade_status === 'Closed'}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
