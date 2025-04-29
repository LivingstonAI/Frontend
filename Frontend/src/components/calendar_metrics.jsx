import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function CalendarData() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filter states
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedImpact, setSelectedImpact] = useState('high');
    
    const currencyArray = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    const impactLevels = ['low', 'medium', 'high'];
    
    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    
    // Fetch events based on filters
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(
                `${baseUrl}/api/data-calendar-economic-events/?currency=${selectedCurrency}&impact=${selectedImpact}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch events on initial load and when filters change
    useEffect(() => {
        fetchEvents();
    }, [selectedCurrency, selectedImpact]);
    
    // Handle event click
    const handleEventClick = (event) => {
        // You can add navigation or modal display logic here
        console.log(`Event clicked:`, event);
    };
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Calendar Data Metrics</h5>
                    
                    <div className="filter-controls mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-4">
                            <div className="filter-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency:</label>
                                <select 
                                    className="border rounded-md p-2 w-40"
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                >
                                    {currencyArray.map(currency => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Impact:</label>
                                <select 
                                    className="border rounded-md p-2 w-40"
                                    value={selectedImpact}
                                    onChange={(e) => setSelectedImpact(e.target.value)}
                                >
                                    {impactLevels.map(impact => (
                                        <option key={impact} value={impact}>{impact.charAt(0).toUpperCase() + impact.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="filter-group mt-6">
                                <button 
                                    className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={fetchEvents}
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {loading && (
                        <div className="flex justify-center p-4">
                            <div className="loader">Loading...</div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-red-500 p-4 bg-red-50 rounded mb-4">
                            Error: {error}
                        </div>
                    )}
                    
                    <div className="events-container">
                        <h6 className="text-lg font-medium mb-2">
                            {selectedCurrency} Events ({selectedImpact} impact)
                        </h6>
                        
                        {events.length === 0 && !loading ? (
                            <div className="p-4 bg-gray-50 rounded text-center">
                                No events found for the selected filters.
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {events.map((event) => (
                                    <div 
                                        key={event.id} 
                                        className="event-card p-3 border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h6 className="font-medium text-blue-600">{event.event_name}</h6>
                                                <div className="text-sm text-gray-500">{formatDate(event.date_time)}</div>
                                            </div>
                                            <div className="event-stats text-right">
                                                {event.actual && <div className="text-sm"><span className="font-medium">Actual:</span> {event.actual}</div>}
                                                {event.forecast && <div className="text-sm"><span className="font-medium">Forecast:</span> {event.forecast}</div>}
                                                {event.previous && <div className="text-sm"><span className="font-medium">Previous:</span> {event.previous}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}