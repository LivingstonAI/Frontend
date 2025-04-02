import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from 'axios';

export default function TradeIdeas() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [tradeIdeas, setTradeIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingIdea, setEditingIdea] = useState(null);
    const [formData, setFormData] = useState({
        heading: '',
        asset: '',
        trade_idea: '',
        trade_status: 'pending',
        target_price: '',
        stop_loss: '',
        entry_price: ''
    });
    
    // Filter states
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Configure axios
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Fetch trade ideas
    const fetchTradeIdeas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/trade-ideas/`, axiosConfig);
            setTradeIdeas(response.data.trade_ideas);
            setError(null);
        } catch (err) {
            console.error("Error fetching trade ideas:", err);
            setError("Failed to load trade ideas. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTradeIdeas();
    }, []);
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingIdea) {
                // Update existing idea
                await axios.put(
                    `${baseUrl}/api/trade-ideas/update/${editingIdea.id}/`, 
                    formData,
                    axiosConfig
                );
            } else {
                // Create new idea
                await axios.post(
                    `${baseUrl}/api/trade-ideas/create/`,
                    formData,
                    axiosConfig
                );
            }
            
            // Reset form and refresh list
            setFormData({
                heading: '',
                asset: '',
                trade_idea: '',
                trade_status: 'pending',
                target_price: '',
                stop_loss: '',
                entry_price: ''
            });
            setShowForm(false);
            setEditingIdea(null);
            fetchTradeIdeas();
            
        } catch (err) {
            console.error("Error saving trade idea:", err);
            setError("Failed to save trade idea. Please try again.");
        }
    };
    
    // Start editing an idea
    const handleEdit = (idea) => {
        setEditingIdea(idea);
        setFormData({
            heading: idea.heading,
            asset: idea.asset,
            trade_idea: idea.trade_idea,
            trade_status: idea.trade_status,
            target_price: idea.target_price || '',
            stop_loss: idea.stop_loss || '',
            entry_price: idea.entry_price || ''
        });
        setShowForm(true);
    };
    
    // Delete an idea
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this trade idea?")) {
            try {
                await axios.delete(
                    `${baseUrl}/api/trade-ideas/delete/${id}/`,
                    axiosConfig
                );
                fetchTradeIdeas();
            } catch (err) {
                console.error("Error deleting trade idea:", err);
                setError("Failed to delete trade idea. Please try again.");
            }
        }
    };
    
    // Filter ideas by status
    const filteredIdeas = filterStatus === 'all' 
        ? tradeIdeas 
        : tradeIdeas.filter(idea => idea.trade_status === filterStatus);
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="trade-ideas-header">
                        <h5 className="major-upcoming-news-events-header">Trade Ideas</h5>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setShowForm(true);
                                setEditingIdea(null);
                                setFormData({
                                    heading: '',
                                    asset: '',
                                    trade_idea: '',
                                    trade_status: 'pending',
                                    target_price: '',
                                    stop_loss: '',
                                    entry_price: ''
                                });
                            }}
                        >
                            + New Trade Idea
                        </button>
                    </div>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {/* Form for creating/editing trade ideas */}
                    {showForm && (
                        <div className="trade-idea-form-container">
                            <div className="card">
                                <div className="card-header">
                                    <h6>{editingIdea ? 'Edit Trade Idea' : 'Create New Trade Idea'}</h6>
                                    <button 
                                        className="btn-close" 
                                        onClick={() => setShowForm(false)}
                                    ></button>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="heading" className="form-label">Heading</label>
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
                                        
                                        <div className="mb-3">
                                            <label htmlFor="asset" className="form-label">Asset</label>
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
                                        
                                        <div className="mb-3">
                                            <label htmlFor="trade_idea" className="form-label">Trade Idea</label>
                                            <textarea
                                                className="form-control"
                                                id="trade_idea"
                                                name="trade_idea"
                                                rows="5"
                                                value={formData.trade_idea}
                                                onChange={handleInputChange}
                                                required
                                            ></textarea>
                                        </div>
                                        
                                        <div className="row mb-3">
                                            <div className="col">
                                                <label htmlFor="entry_price" className="form-label">Entry Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="entry_price"
                                                    name="entry_price"
                                                    value={formData.entry_price}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="col">
                                                <label htmlFor="target_price" className="form-label">Target Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="target_price"
                                                    name="target_price"
                                                    value={formData.target_price}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            
                                            <div className="col">
                                                <label htmlFor="stop_loss" className="form-label">Stop Loss</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="stop_loss"
                                                    name="stop_loss"
                                                    value={formData.stop_loss}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="trade_status" className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                id="trade_status"
                                                name="trade_status"
                                                value={formData.trade_status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="executed">Executed</option>
                                                <option value="closed">Closed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        
                                        <div className="d-flex justify-content-end">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                {editingIdea ? 'Update' : 'Create'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Filter section */}
                    <div className="trade-ideas-filter my-3">
                        <div className="btn-group" role="group">
                            <button 
                                type="button" 
                                className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filterStatus === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilterStatus('pending')}
                            >
                                Pending
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filterStatus === 'executed' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilterStatus('executed')}
                            >
                                Executed
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filterStatus === 'closed' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilterStatus('closed')}
                            >
                                Closed
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${filterStatus === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilterStatus('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>
                    
                    {/* Trade ideas list */}
                    <div className="trade-ideas-list">
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredIdeas.length === 0 ? (
                            <div className="alert alert-info" role="alert">
                                No trade ideas found. Create a new one!
                            </div>
                        ) : (
                            filteredIdeas.map(idea => (
                                <div className="card mb-3" key={idea.id}>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0">{idea.heading}</h6>
                                            <small className="text-muted">Asset: {idea.asset}</small>
                                        </div>
                                        <div>
                                            <span className={`badge ${
                                                idea.trade_status === 'pending' ? 'bg-warning' :
                                                idea.trade_status === 'executed' ? 'bg-primary' :
                                                idea.trade_status === 'closed' ? 'bg-success' : 'bg-secondary'
                                            }`}>
                                                {idea.trade_status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{idea.trade_idea}</p>
                                        
                                        <div className="row mb-3">
                                            {idea.entry_price && (
                                                <div className="col-md-4">
                                                    <strong>Entry:</strong> {idea.entry_price}
                                                </div>
                                            )}
                                            
                                            {idea.target_price && (
                                                <div className="col-md-4">
                                                    <strong>Target:</strong> {idea.target_price}
                                                </div>
                                            )}
                                            
                                            {idea.stop_loss && (
                                                <div className="col-md-4">
                                                    <strong>Stop Loss:</strong> {idea.stop_loss}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Created: {new Date(idea.date_created).toLocaleString()}
                                            </small>
                                            
                                            <div>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEdit(idea)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(idea.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
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