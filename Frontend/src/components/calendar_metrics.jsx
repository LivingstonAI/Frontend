import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function UniqueEventCards() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [uniqueEvents, setUniqueEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter states
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedImpact, setSelectedImpact] = useState('high');
    
    const currencyArray = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    const impactLevels = ['low', 'medium', 'high'];
    
    // Fetch unique events based on filters
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Use the new endpoint that returns unique events
            const url = new URL(`${baseUrl}/api/unique-economic-events/`);
            url.searchParams.append('currency', selectedCurrency);
            url.searchParams.append('impact', selectedImpact);
            if (searchTerm) {
                url.searchParams.append('search', searchTerm);
            }
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            setUniqueEvents(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // Debounced search effect
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchEvents();
        }, 300);
        
        return () => clearTimeout(debounceTimer);
    }, [selectedCurrency, selectedImpact, searchTerm]);
    
    // Handle event click - navigate to details page
    const handleEventClick = (eventId) => {
        console.log(`Navigate to event details: ${eventId}`);
        // You would typically use router navigation here
        // For example: router.push(`/events/${eventId}`);
    };
    
    return (
                    
        <div className="eco-event-dashboard">
            <div className="header">
                        <Header />
                    </div>
                    <div className="main-page-body">
                        <SideNavs />
                        <div className="main-body-info">

            <div className="eco-event-header">
                <h5 className="eco-event-title">Economic Event Dashboard</h5>
            </div>
            
            <div className="eco-event-filters">
                <div className="eco-event-filter-group">
                    <label className="eco-event-label">Currency</label>
                    <select 
                        className="eco-event-select"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                        {currencyArray.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
                
                <div className="eco-event-filter-group">
                    <label className="eco-event-label">Impact</label>
                    <select 
                        className="eco-event-select"
                        value={selectedImpact}
                        onChange={(e) => setSelectedImpact(e.target.value)}
                    >
                        {impactLevels.map(impact => (
                            <option key={impact} value={impact}>
                                {impact.charAt(0).toUpperCase() + impact.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button 
                    className="eco-event-refresh-btn"
                    onClick={fetchEvents}
                >
                    Refresh Data
                </button>
            </div>
            
            <div className="eco-event-search-container">
                <div className="eco-event-search-wrapper">
                    <Search className="eco-event-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="eco-event-search-input"
                    />
                </div>
            </div>
            
            {loading && (
                <div className="eco-event-loading">
                    <div className="eco-event-spinner"></div>
                    <span>Loading events...</span>
                </div>
            )}
            
            {error && (
                <div className="eco-event-error">
                    Error: {error}
                </div>
            )}
            
            <div className="eco-event-stats">
                <span className="eco-event-count">
                    {uniqueEvents.length} unique events found
                </span>
                <span className="eco-event-filter-info">
                    {selectedCurrency} / {selectedImpact.charAt(0).toUpperCase() + selectedImpact.slice(1)} impact
                </span>
            </div>
            
            {!loading && uniqueEvents.length === 0 ? (
                <div className="eco-event-empty">
                    No events found for the selected filters.
                </div>
            ) : (
                <div className="eco-event-grid">
                    {uniqueEvents.map((event) => (
                        <div 
                            key={event.id} 
                            className={`eco-event-card eco-event-impact-${event.impact}`}
                            onClick={() => handleEventClick(event.id)}
                        >
                            <div className="eco-event-card-currency">{event.currency}</div>
                            <h6 className="eco-event-card-title">{event.event_name}</h6>
                            <div className="eco-event-card-impact">
                                {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
            <style jsx>{`
                .eco-event-dashboard {
                    font-family: 'Inter', sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1.5rem;
                }
                
                .eco-event-header {
                    margin-bottom: 1.5rem;
                }
                
                .eco-event-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0;
                }
                
                .eco-event-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background-color: #f7fafc;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .eco-event-filter-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .eco-event-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #4a5568;
                    margin-bottom: 0.375rem;
                }
                
                .eco-event-select {
                    padding: 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    background-color: white;
                    min-width: 120px;
                    font-size: 0.875rem;
                    color: #2d3748;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .eco-event-refresh-btn {
                    margin-top: auto;
                    padding: 0.5rem 1rem;
                    background-color: #4299e1;
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .eco-event-refresh-btn:hover {
                    background-color: #3182ce;
                }
                
                .eco-event-search-container {
                    margin-bottom: 1.5rem;
                }
                
                .eco-event-search-wrapper {
                    position: relative;
                    max-width: 400px;
                }
                
                .eco-event-search-icon {
                    position: absolute;
                    top: 50%;
                    left: 0.75rem;
                    transform: translateY(-50%);
                    color: #a0aec0;
                }
                
                .eco-event-search-input {
                    width: 100%;
                    padding: 0.625rem 0.75rem 0.625rem 2.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    color: #2d3748;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .eco-event-search-input:focus {
                    outline: none;
                    border-color: #4299e1;
                    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
                }
                
                .eco-event-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 2rem;
                    text-align: center;
                    color: #4a5568;
                    font-size: 0.875rem;
                }
                
                .eco-event-spinner {
                    width: 1.25rem;
                    height: 1.25rem;
                    border: 2px solid rgba(66, 153, 225, 0.3);
                    border-radius: 50%;
                    border-top-color: #4299e1;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .eco-event-error {
                    padding: 1rem;
                    background-color: #fff5f5;
                    border-radius: 0.375rem;
                    color: #e53e3e;
                    margin-bottom: 1.5rem;
                    font-size: 0.875rem;
                }
                
                .eco-event-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                    color: #4a5568;
                }
                
                .eco-event-count {
                    font-weight: 500;
                }
                
                .eco-event-filter-info {
                    color: #718096;
                }
                
                .eco-event-empty {
                    text-align: center;
                    padding: 3rem 1rem;
                    background-color: #f7fafc;
                    border-radius: 0.5rem;
                    color: #718096;
                    font-size: 0.875rem;
                }
                
                .eco-event-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
                
                .eco-event-card {
                    position: relative;
                    padding: 1.25rem;
                    border-radius: 0.5rem;
                    background-color: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    overflow: hidden;
                }
                
                .eco-event-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                
                .eco-event-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background-color: #4299e1;
                }
                
                .eco-event-impact-high::before {
                    background-color: #e53e3e;
                }
                
                .eco-event-impact-medium::before {
                    background-color: #ed8936;
                }
                
                .eco-event-impact-low::before {
                    background-color: #4299e1;
                }
                
                .eco-event-card-currency {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #718096;
                    margin-bottom: 0.5rem;
                }
                
                .eco-event-card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0 0 0.75rem 0;
                    line-height: 1.4;
                }
                
                .eco-event-card-impact {
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    display: inline-block;
                    background-color: #ebf8ff;
                    color: #3182ce;
                }
                
                .eco-event-impact-high .eco-event-card-impact {
                    background-color: #fff5f5;
                    color: #e53e3e;
                }
                
                .eco-event-impact-medium .eco-event-card-impact {
                    background-color: #fffaf0;
                    color: #dd6b20;
                }
                
                .eco-event-impact-low .eco-event-card-impact {
                    background-color: #ebf8ff;
                    color: #3182ce;
                }
            `}</style>
        </div>
        
        </div>
    </div>
    );
}