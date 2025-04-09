import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from 'axios';

export default function TradeIdeas() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [tradeIdeas, setTradeIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Processing states
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState('');
    
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
        entry_price: '',
        outcome: 'pending'
    });
    
    // Filter states
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterOutcome, setFilterOutcome] = useState('all');
    const [filterAsset, setFilterAsset] = useState('all');
    
    // List of unique assets for filtering
    const [uniqueAssets, setUniqueAssets] = useState([]);

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    
    // Commonality analysis states
    const [showCommonalityAnalysis, setShowCommonalityAnalysis] = useState(false);
    const [commonalityAnalysis, setCommonalityAnalysis] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Configure axios
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Function to fetch the API key
    const fetchDataFromAPI = async () => {
        try {
        const response = await fetch(`${baseUrl}/get_openai_key`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { OPENAI_API_KEY } = await response.json();
        // Set the API key in state
        setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };
    
    // Fetch trade ideas
    const fetchTradeIdeas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/trade-ideas/`, axiosConfig);
            setTradeIdeas(response.data.trade_ideas);
            
            // Extract unique assets for filtering
            const assets = [...new Set(response.data.trade_ideas.map(idea => idea.asset))];
            setUniqueAssets(assets);
            
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
        fetchDataFromAPI();
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
        setIsProcessing(true);
        setProcessingAction(editingIdea ? 'Updating idea...' : 'Creating idea...');
        
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
                entry_price: '',
                outcome: 'pending'
            });
            setShowForm(false);
            setEditingIdea(null);
            fetchTradeIdeas();
            
        } catch (err) {
            console.error("Error saving trade idea:", err);
            setError("Failed to save trade idea. Please try again.");
        } finally {
            setIsProcessing(false);
            setProcessingAction('');
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
            entry_price: idea.entry_price || '',
            outcome: idea.outcome || 'pending'
        });
        setShowForm(true);
    };
    
    // Delete an idea
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this trade idea?")) {
            setIsProcessing(true);
            setProcessingAction('Deleting idea...');
            
            try {
                await axios.delete(
                    `${baseUrl}/api/trade-ideas/delete/${id}/`,
                    axiosConfig
                );
                fetchTradeIdeas();
            } catch (err) {
                console.error("Error deleting trade idea:", err);
                setError("Failed to delete trade idea. Please try again.");
            } finally {
                setIsProcessing(false);
                setProcessingAction('');
            }
        }
    };
    
    // Apply multiple filters
    const getFilteredIdeas = () => {
        return tradeIdeas.filter(idea => {
            const statusMatch = filterStatus === 'all' || idea.trade_status === filterStatus;
            const outcomeMatch = filterOutcome === 'all' || idea.outcome === filterOutcome;
            const assetMatch = filterAsset === 'all' || idea.asset === filterAsset;
            
            return statusMatch && outcomeMatch && assetMatch;
        });
    };
    
    // Get outcome badge color
    const getOutcomeBadgeColor = (outcome) => {
        switch(outcome) {
            case 'win': return 'bg-success';
            case 'loss': return 'bg-danger';
            case 'breakeven': return 'bg-warning';
            default: return 'bg-secondary';
        }
    };
    
    // Find commonalities in filtered ideas
    const findCommonalities = async () => {
        setIsAnalyzing(true);
        setShowCommonalityAnalysis(true);
        
        const filteredIdeas = getFilteredIdeas();
        
        try {
            // First check if API key is available
            if (!OPENAI_API_KEY) {
                await fetchDataFromAPI();
            }
            
            // Prepare filter context for better analysis
            let filterContext = "Analysis of trade ideas";
            if (filterStatus !== 'all') filterContext += ` with status: ${filterStatus}`;
            if (filterOutcome !== 'all') filterContext += ` and outcome: ${filterOutcome}`;
            if (filterAsset !== 'all') filterContext += ` for asset: ${filterAsset}`;
            
            // Call OpenAI API with new prompting for professional trader format and emojis
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are an experienced professional trader analyzing trade ideas. Provide a concise summary of patterns and insights in a professional manner. Include relevant emojis to enhance your points. Do not use markdown formatting. Keep your analysis brief and actionable. Write as if you're a seasoned market analyst speaking directly to the trader."
                        },
                        {
                            role: "user",
                            content: `${filterContext}. Please analyze these ${filteredIdeas.length} trade ideas and identify patterns, commonalities, success factors, or improvement areas, focusing on actionable insights: ${JSON.stringify(filteredIdeas)}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    }
                }
            );
            
            setCommonalityAnalysis(response.data.choices[0].message.content);
        } catch (err) {
            console.error("Error analyzing trade ideas:", err);
            setCommonalityAnalysis("Failed to analyze trade ideas. Please check your API key or try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    // Toggle analysis visibility with proper state handling
    const toggleAnalysis = () => {
        setShowCommonalityAnalysis(!showCommonalityAnalysis);
    };
    
    const filteredIdeas = getFilteredIdeas();
    
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
                        <div className="d-flex gap-2">
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
                                        entry_price: '',
                                        outcome: 'pending'
                                    });
                                }}
                                disabled={isProcessing}
                            >
                                + New Trade Idea
                            </button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {/* Processing indicator */}
                    {isProcessing && (
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Processing...</span>
                            </div>
                            <div>
                                {processingAction}
                            </div>
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
                                        disabled={isProcessing}
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
                                                disabled={isProcessing}
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
                                                disabled={isProcessing}
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
                                                disabled={isProcessing}
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
                                                    disabled={isProcessing}
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
                                                    disabled={isProcessing}
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
                                                    disabled={isProcessing}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="row mb-3">
                                            <div className="col">
                                                <label htmlFor="trade_status" className="form-label">Status</label>
                                                <select
                                                    className="form-select"
                                                    id="trade_status"
                                                    name="trade_status"
                                                    value={formData.trade_status}
                                                    onChange={handleInputChange}
                                                    disabled={isProcessing}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="executed">Executed</option>
                                                    <option value="closed">Closed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            
                                            <div className="col">
                                                <label htmlFor="outcome" className="form-label">Outcome</label>
                                                <select
                                                    className="form-select"
                                                    id="outcome"
                                                    name="outcome"
                                                    value={formData.outcome}
                                                    onChange={handleInputChange}
                                                    disabled={isProcessing}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="win">Win</option>
                                                    <option value="loss">Loss</option>
                                                    <option value="breakeven">Breakeven</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-end">
                                            <button 
                                                type="button" 
                                                className="btn btn-danger me-2"
                                                onClick={() => setShowForm(false)}
                                                disabled={isProcessing}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        {editingIdea ? 'Updating...' : 'Creating...'}
                                                    </>
                                                ) : (
                                                    editingIdea ? 'Update' : 'Create'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Filter section */}
                    <div className="trade-ideas-filters my-3">
                        <div className="row g-2">
                            <div className="col-md-4">
                                <div className="filter-group">
                                    <label className="form-label mb-1">Status Filter</label>
                                    <div className="btn-group w-100" role="group">
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
                            </div>
                            
                            <div className="col-md-4">
                                <div className="filter-group">
                                    <label className="form-label mb-1">Outcome Filter</label>
                                    <div className="btn-group w-100" role="group">
                                        <button 
                                            type="button" 
                                            className={`btn ${filterOutcome === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilterOutcome('all')}
                                        >
                                            All
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`btn ${filterOutcome === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilterOutcome('pending')}
                                        >
                                            Pending
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`btn ${filterOutcome === 'win' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilterOutcome('win')}
                                        >
                                            Wins
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`btn ${filterOutcome === 'loss' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilterOutcome('loss')}
                                        >
                                            Losses
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`btn ${filterOutcome === 'breakeven' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilterOutcome('breakeven')}
                                        >
                                            Breakeven
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-4">
                                <div className="filter-group">
                                    <label className="form-label mb-1">Asset Filter</label>
                                    <select
                                        className="form-select"
                                        value={filterAsset}
                                        onChange={(e) => setFilterAsset(e.target.value)}
                                    >
                                        <option value="all">All Assets</option>
                                        {uniqueAssets.map(asset => (
                                            <option key={asset} value={asset}>{asset}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            
                        </div>
                    </div>

                    {/* Commonality button moved below asset filter */}
                    <div className="col-12 mt-3">
                        <button 
                            className="btn btn-primary text-white w-50"
                            // style={{ backgroundColor: '#003366' }}
                            onClick={findCommonalities}
                            disabled={isAnalyzing || filteredIdeas.length === 0}
                        >
                        {isAnalyzing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-lightbulb me-1"></i>
                                            Find Commonality
                                        </>
                                    )}
                                </button>
                            </div>
                    
                    {/* Commonality Analysis Section with dark blue theme */}
                    {commonalityAnalysis && (
                        <div className="analysis-container my-3" style={{ display: showCommonalityAnalysis ? 'block' : 'none' }}>
                            <div className="card" style={{ borderColor: '' }}>
                                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'dodgerblue', color: 'white' }}>
                                    <h6 className="mb-0">
                                        <i className="bi bi-graph-up me-2"></i>
                                        AI Trade Analysis
                                    </h6>
                                    <div>
                                        <button 
                                            className="btn btn-sm btn-outline-light me-2" 
                                            onClick={toggleAnalysis}
                                        >
                                            {showCommonalityAnalysis ? 'Minimize' : 'Expand'}
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-light" 
                                            onClick={() => setShowCommonalityAnalysis(false)}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body" style={{ backgroundColor: '#f0f5fa' }}>
                                    {commonalityAnalysis.split('\n').map((paragraph, index) => (
                                        paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Filter summary */}
                    <div className="filter-summary my-2">
                        <small className="text-muted">
                            Showing {filteredIdeas.length} out of {tradeIdeas.length} trade ideas
                            {filterStatus !== 'all' && ` • Status: ${filterStatus}`}
                            {filterOutcome !== 'all' && ` • Outcome: ${filterOutcome}`}
                            {filterAsset !== 'all' && ` • Asset: ${filterAsset}`}
                        </small>
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
                                No trade ideas found with the current filters. Try different filters or create a new idea!
                            </div>
                        ) : (
                            filteredIdeas.map(idea => (
                                <div className="card mb-3" key={idea.id}>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0">{idea.heading}</h6>
                                            <small className="text-muted">Asset: {idea.asset}</small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <span className={`badge ${
                                                idea.trade_status === 'pending' ? 'bg-warning' :
                                                idea.trade_status === 'executed' ? 'bg-primary' :
                                                idea.trade_status === 'closed' ? 'bg-success' : 'bg-secondary'
                                            }`}>
                                                {idea.trade_status}
                                            </span>
                                            
                                            {idea.outcome && (
                                                <span className={`badge ${getOutcomeBadgeColor(idea.outcome)}`}>
                                                    {idea.outcome}
                                                </span>
                                            )}
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
                                                    disabled={isProcessing}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(idea.id)}
                                                    disabled={isProcessing}
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