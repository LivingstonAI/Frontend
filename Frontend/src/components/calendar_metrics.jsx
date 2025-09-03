import React, { useEffect, useState } from "react";
import { Search, ArrowLeft, Info, BookOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Header from "./header";
import SideNavs from "./side_navs";

export default function CalendarData() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [uniqueEvents, setUniqueEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter states
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedImpact, setSelectedImpact] = useState('high');
    
    // Event detail view states
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventHistoryData, setEventHistoryData] = useState(null);
    const [eventHistoryLoading, setEventHistoryLoading] = useState(false);
    const [eventHistoryError, setEventHistoryError] = useState(null);
    
    // Explainer states
    const [showExplainer, setShowExplainer] = useState(false);
    const [explainerLoading, setExplainerLoading] = useState(false);
    const [explainerContent, setExplainerContent] = useState(null);
    
    const currencyArray = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
    const impactLevels = ['low', 'medium', 'high'];

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");

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
            console.error("Error fetching API key:", error);
        }
    };
    
    useEffect(() => {
        async function fetchData() {
            await fetchDataFromAPI();
        }
        fetchData();
    }, []); 
    
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
    
    // Fetch event history data
    const fetchEventHistory = async (eventName) => {
        setEventHistoryLoading(true);
        setEventHistoryError(null);
        
        try {
            // Build URL with parameters
            const url = new URL(`${baseUrl}/api/event-history/${encodeURIComponent(eventName)}/`);
            url.searchParams.append('currency', selectedCurrency);
            url.searchParams.append('impact', selectedImpact);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch event history');
            }
            
            const data = await response.json();
            setEventHistoryData(data);
        } catch (err) {
            setEventHistoryError(err.message);
            console.error("Error fetching event history:", err);
        } finally {
            setEventHistoryLoading(false);
        }
    };
    
    // Get explanation for an economic event
    const fetchEventExplanation = async () => {
        if (!selectedEvent || !OPENAI_API_KEY) return;
        
        setExplainerLoading(true);
        
        try {
            // Prepare the prompt
            const prompt = `
                Please provide a concise explanation of the economic indicator "${selectedEvent.event_name}" for ${selectedEvent.currency}.
                
                Cover these points:
                1. What is this economic indicator and what does it measure?
                2. Why is this indicator important for traders and investors?
                3. How might this indicator impact ${selectedEvent.currency} currency pairs?
                4. What are typical market reactions to changes in this indicator?
                5. Any tips for trading based on this indicator?
                
                Format your response with clear headings and bullet points where appropriate.
            `;
            
            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful economic analyst that provides clear and concise explanations about economic indicators and how they relate to trading.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate explanation');
            }
            
            const data = await response.json();
            setExplainerContent(data.choices[0].message.content);
            setShowExplainer(true);
        } catch (err) {
            console.error("Error generating explanation:", err);
            setExplainerContent("Sorry, we couldn't generate an explanation at this time. Please try again later.");
        } finally {
            setExplainerLoading(false);
        }
    };
    
    // Close explainer modal
    const closeExplainer = () => {
        setShowExplainer(false);
    };
    
    // Debounced search effect
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchEvents();
        }, 300);
        
        return () => clearTimeout(debounceTimer);
    }, [selectedCurrency, selectedImpact, searchTerm]);
    
    // Handle event click - fetch history and show detail view
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetail(true);
        fetchEventHistory(event.event_name);
    };
    
    // Handle back button click
    const handleBackClick = () => {
        setShowEventDetail(false);
        setSelectedEvent(null);
        setEventHistoryData(null);
    };
    
    // Check if there's meaningful chart data
    const hasChartData = eventHistoryData?.history?.some(item => 
        (item.actual_value !== null || item.forecast_value !== null)
    );
    
    return (
        <div className="eco-event-dashboard">
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    {!showEventDetail ? (
                        // Events List View
                        <>
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
                                            onClick={() => handleEventClick(event)}
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
                        </>
                    ) : (
                        // Event Detail View with Charts
                        <div className="event-detail">
                            <div className="event-detail-header">
                                <button 
                                    className="event-detail-back-btn"
                                    onClick={handleBackClick}
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back to Events</span>
                                </button>
                                
                                <div className="event-detail-title-container">
                                    <h5 className="event-detail-title">
                                        {selectedEvent.event_name} ({selectedEvent.currency})
                                    </h5>
                                
                                    <div className={`event-detail-impact event-impact-${selectedEvent.impact}`}>
                                        {selectedEvent.impact.charAt(0).toUpperCase() + selectedEvent.impact.slice(1)} Impact
                                    </div>
                                </div>
                                
                                <button 
                                    className="event-detail-explainer-btn"
                                    onClick={fetchEventExplanation}
                                    disabled={explainerLoading}
                                >
                                    <BookOpen size={16} />
                                    <span>{explainerLoading ? 'Generating...' : 'Explain This Indicator'}</span>
                                </button>
                            </div>
                            
                            {eventHistoryLoading && (
                                <div className="event-detail-loading">
                                    <div className="event-detail-spinner"></div>
                                    <span>Loading event history...</span>
                                </div>
                            )}
                            
                            {eventHistoryError && (
                                <div className="event-detail-error">
                                    Error: {eventHistoryError}
                                </div>
                            )}
                            
                            {!eventHistoryLoading && eventHistoryData && (
                                <>
                                    <div className="event-detail-stats">
                                        <div className="event-detail-stat-item">
                                            <span className="event-detail-stat-label">Data Points</span>
                                            <span className="event-detail-stat-value">{eventHistoryData.data_points}</span>
                                        </div>
                                        
                                        <div className="event-detail-stat-item">
                                            <span className="event-detail-stat-label">Currency</span>
                                            <span className="event-detail-stat-value">{eventHistoryData.currency}</span>
                                        </div>
                                        
                                        <div className="event-detail-stat-item">
                                            <span className="event-detail-stat-label">Impact</span>
                                            <span className={`event-detail-stat-value event-impact-text-${eventHistoryData.impact.toLowerCase()}`}>
                                                {eventHistoryData.impact}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {hasChartData ? (
                                        <div className="event-detail-charts">
                                            <div className="event-detail-chart-container">
                                                <h6 className="event-detail-chart-title">Actual vs Forecast Values</h6>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart
                                                        data={eventHistoryData.history}
                                                        margin={{
                                                            top: 5,
                                                            right: 30,
                                                            left: 20,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis 
                                                            dataKey="date" 
                                                            label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
                                                        />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="actual_value"
                                                            name="Actual"
                                                            stroke="#3182ce"
                                                            activeDot={{ r: 8 }}
                                                            connectNulls
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="forecast_value"
                                                            name="Forecast"
                                                            stroke="#805ad5"
                                                            connectNulls
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="previous_value"
                                                            name="Previous"
                                                            stroke="#718096"
                                                            connectNulls
                                                            strokeDasharray="5 5"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="event-detail-no-data">
                                            <Info size={24} />
                                            <p>No numeric data available for charting</p>
                                        </div>
                                    )}
                                    
                                    <div className="event-detail-table-container">
                                        <h6 className="event-detail-table-title">Historical Data</h6>
                                        <div className="event-detail-table-wrapper">
                                            <table className="event-detail-table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Actual</th>
                                                        <th>Forecast</th>
                                                        <th>Previous</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {eventHistoryData.history.map((item, index) => (
                                                        <tr key={item.id || index}>
                                                            <td>{item.date}</td>
                                                            <td>{item.actual || '-'}</td>
                                                            <td>{item.forecast || '-'}</td>
                                                            <td>{item.previous || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Explainer Modal */}
            {showExplainer && (
                <div className="explainer-modal-overlay">
                    <div className="explainer-modal">
                        <div className="explainer-modal-header">
                            <h3>Economic Indicator Explainer</h3>
                            <button 
                                className="explainer-modal-close"
                                onClick={closeExplainer}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="explainer-modal-content">
                            <h4>{selectedEvent?.event_name}</h4>
                            <div className="explainer-content-body">
                                {explainerLoading ? (
                                    <div className="explainer-loading">
                                        <div className="eco-event-spinner"></div>
                                        <span>Generating explanation...</span>
                                    </div>
                                ) : (
                                    <div className="explainer-text">
                                        {explainerContent && (
                                            <div dangerouslySetInnerHTML={{ __html: explainerContent.replace(/\n/g, '<br>') }} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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

                /* Event Detail Styles */
                .event-detail {
                    padding: 1rem 0;
                }
                
                .event-detail-header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                
                .event-detail-back-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.5rem 0.75rem;
                    background: none;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    color: #4a5568;
                    cursor: pointer;
                    width: fit-content;
                    transition: all 0.2s;
                }
                
                .event-detail-back-btn:hover {
                    background-color: #f7fafc;
                    border-color: #cbd5e0;
                }
                
                .event-detail-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0.5rem 0;
                }
                
                .event-detail-impact {
                    width: fit-content;
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    background-color: #ebf8ff;
                    color: #3182ce;
                }
                
                .event-detail-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 2rem;
                    text-align: center;
                    color: #4a5568;
                    font-size: 0.875rem;
                }
                
                .event-detail-spinner {
                    width: 1.25rem;
                    height: 1.25rem;
                    border: 2px solid rgba(66, 153, 225, 0.3);
                    border-radius: 50%;
                    border-top-color: #4299e1;
                    animation: spin 1s linear infinite;
                }
                
                .event-detail-error {
                    padding: 1rem;
                    background-color: #fff5f5;
                    border-radius: 0.375rem;
                    color: #e53e3e;
                    margin-bottom: 1.5rem;
                    font-size: 0.875rem;
                }
                
                .event-detail-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background-color: #f7fafc;
                    border-radius: 0.5rem;
                }
                
                .event-detail-stat-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .event-detail-stat-label {
                    font-size: 0.75rem;
                    color: #718096;
                    margin-bottom: 0.25rem;
                }
                
                .event-detail-stat-value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #2d3748;
                }
                
                .event-impact-text-high {
                    color: #e53e3e;
                }
                
                .event-impact-text-medium {
                    color: #dd6b20;
                }
                
                .event-impact-text-low {
                    color: #3182ce;
                }
                
                .event-detail-charts {
                    margin-bottom: 2rem;
                }
                
                .event-detail-chart-container {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }
                
                .event-detail-chart-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-top: 0;
                    margin-bottom: 1rem;
                }
                
                .event-detail-no-data {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 3rem 1rem;
                    background-color: #f7fafc;
                    border-radius: 0.5rem;
                    color: #718096;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                
                .event-detail-table-container {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }
                
                .event-detail-table-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-top: 0;
                    margin-bottom: 1rem;
                }
                
                .event-detail-table-wrapper {
                    overflow-x: auto;
                }
                
                .event-detail-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .event-detail-table th,
                .event-detail-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #e2e8f0;
                    text-align: left;
                }
                
                .event-detail-table th {
                    background-color: #f7fafc;
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 0.875rem;
                }
                
                .event-detail-table td {
                    font-size: 0.875rem;
                    color: #2d3748;
                }
                
                .event-detail-table tr:last-child td {
                    border-bottom: none;
                }
                
                /* New Explainer Button Styles */
                .event-detail-title-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .event-detail-explainer-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background-color: #4299e1;
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 1rem;
                }
                
                .event-detail-explainer-btn:hover {
                    background-color: #3182ce;
                }
                
                .event-detail-explainer-btn:disabled {
                    background-color: #a0aec0;
                    cursor: not-allowed;
                }
                
                /* Explainer Modal Styles */
                .explainer-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .explainer-modal {
                    width: 90%;
                    max-width: 700px;
                    max-height: 80vh;
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                }
                
                .explainer-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .explainer-modal-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #2d3748;
                }
                
                .explainer-modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #4a5568;
                    cursor: pointer;
                }
                
                .explainer-modal-content {
                    padding: 1rem;
                    overflow-y: auto;
                    flex: 1;
                }
                
                .explainer-modal-content h4 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #3182ce;
                }
                
                .explainer-content-body {
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: #4a5568;
                }
                
                .explainer-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 2rem;
                }
                
                .explainer-text {
                    white-space: pre-line;
                }
            `}</style>
        </div>
    );
}