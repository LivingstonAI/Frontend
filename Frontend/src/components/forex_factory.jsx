import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ForexFactoryCapturer() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [economicEvents, setEconomicEvents] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Function to fetch the API key
    const fetchDataFromAPI = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage({ text: "Error fetching API key", type: "error" });
        }
    };

    useEffect(() => {
        fetchDataFromAPI();
    }, []);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setScreenshot(file);
            setMessage({ text: "", type: "" });
        } else {
            setMessage({ text: "Please upload a valid image file", type: "error" });
        }
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    // Analyze screenshot with GPT-4o-mini
    const analyzeScreenshot = async () => {
        if (!screenshot || !OPENAI_API_KEY) {
            setMessage({ text: "Please upload a screenshot and ensure API key is loaded", type: "error" });
            return;
        }

        setIsAnalyzing(true);
        setMessage({ text: "Analyzing screenshot...", type: "info" });

        try {
            const base64Image = await fileToBase64(screenshot);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `Analyze this Forex Factory screenshot and extract economic events data. Return a JSON array of events with the following structure for each event:

                                    EXAMPLE 1:
                                    {
                                        "date_time": "YYYY-MM-DD HH:MM:SS",
                                        "currency": "USD/EUR/GBP/JPY/AUD/CAD/CHF/CNY",
                                        "impact": "low/medium/high",
                                        "event_name": "Event name",
                                        "actual": "Actual value or null",
                                        "forecast": "Forecast value or null", 
                                        "previous": "Previous value or null"
                                    }
                                    
                                    EXAMPLE 2:
                                    {
                                        "date_time": "YYYY-MM-DD HH:MM:SS",
                                        "currency": "USD/EUR/GBP/JPY/AUD/CAD/CHF/CNY",
                                        "impact": "low/medium/high",
                                        "event_name": "Event name",
                                        "actual": "Actual value or null",
                                        "forecast": "Forecast value or null", 
                                        "previous": "Previous value or null"
                                    }

                                    EXAMPLE 3:
                                    {
                                        "date_time": "YYYY-MM-DD HH:MM:SS",
                                        "currency": "USD/EUR/GBP/JPY/AUD/CAD/CHF/CNY",
                                        "impact": "low/medium/high",
                                        "event_name": "Event name",
                                        "actual": "Actual value or null",
                                        "forecast": "Forecast value or null", 
                                        "previous": "Previous value or null"
                                    }

                                    EXAMPLE 4:
                                    {
                                        "date_time": "YYYY-MM-DD HH:MM:SS",
                                        "currency": "USD/EUR/GBP/JPY/AUD/CAD/CHF/CNY",
                                        "impact": "low/medium/high",
                                        "event_name": "Event name",
                                        "actual": "Actual value or null",
                                        "forecast": "Forecast value or null", 
                                        "previous": "Previous value or null"
                                    }

                                    EXAMPLE 5:
                                    {
                                        "date_time": "YYYY-MM-DD HH:MM:SS",
                                        "currency": "USD/EUR/GBP/JPY/AUD/CAD/CHF/CNY",
                                        "impact": "low/medium/high",
                                        "event_name": "Event name",
                                        "actual": "Actual value or null",
                                        "forecast": "Forecast value or null", 
                                        "previous": "Previous value or null"
                                    }

                                    Important notes:
                                    - Use ISO datetime format for date_time
                                    - Impact should be classified as low, medium, or high based on the color coding (red=high, orange=medium, yellow=low)
                                    - Currency should be one of the 8 supported currencies
                                    - Return only valid JSON array, no additional text
                                    - If a value is not available, use null`
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${base64Image}`
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const jsonResponse = data.choices[0].message.content;
            
            try {
                const parsedEvents = JSON.parse(jsonResponse);
                setEconomicEvents(parsedEvents);
                setMessage({ text: `Successfully extracted ${parsedEvents.length} events`, type: "success" });
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                setMessage({ text: "Error parsing GPT response. Please try again.", type: "error" });
            }

        } catch (error) {
            console.error("Error analyzing screenshot:", error);
            setMessage({ text: "Error analyzing screenshot. Please try again.", type: "error" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Handle event data changes
    const handleEventChange = (index, field, value) => {
        const updatedEvents = [...economicEvents];
        updatedEvents[index][field] = value;
        setEconomicEvents(updatedEvents);
    };

    // Remove event
    const removeEvent = (index) => {
        const updatedEvents = economicEvents.filter((_, i) => i !== index);
        setEconomicEvents(updatedEvents);
    };

    // Save events to backend
    const saveEvents = async () => {
        if (economicEvents.length === 0) {
            setMessage({ text: "No events to save", type: "error" });
            return;
        }

        setIsSaving(true);
        setMessage({ text: "Saving events...", type: "info" });

        try {
            const response = await fetch(`${baseUrl}/save_forex_factory_news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: economicEvents })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            setMessage({ text: `Successfully saved ${economicEvents.length} events`, type: "success" });
            setEconomicEvents([]);
            setScreenshot(null);
        } catch (error) {
            console.error("Error saving events:", error);
            setMessage({ text: "Error saving events. Please try again.", type: "error" });
        } finally {
            setIsSaving(false);
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
                    <h5 className="major-upcoming-news-events-header">Forex Factory Capturer</h5>
                    
                    {/* Message Display */}
                    {message.text && (
                        <div className={`message ${message.type}`} style={{
                            padding: '10px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            backgroundColor: message.type === 'error' ? '#ffebee' : 
                                           message.type === 'success' ? '#e8f5e8' : '#e3f2fd',
                            color: message.type === 'error' ? '#c62828' : 
                                   message.type === 'success' ? '#2e7d32' : '#1565c0',
                            border: `1px solid ${message.type === 'error' ? '#ffcdd2' : 
                                                message.type === 'success' ? '#c8e6c9' : '#bbdefb'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    {/* Upload Section */}
                    <div className="upload-section" style={{
                        backgroundColor: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '2px dashed #2196f3'
                    }}>
                        <h6 style={{ color: '#1976d2', marginBottom: '15px' }}>Upload Forex Factory Screenshot</h6>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{
                                marginBottom: '15px',
                                padding: '8px',
                                border: '1px solid #2196f3',
                                borderRadius: '4px',
                                backgroundColor: 'white'
                            }}
                        />
                        {screenshot && (
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ color: '#1976d2', margin: '0' }}>
                                    Selected: {screenshot.name}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={analyzeScreenshot}
                            disabled={!screenshot || isAnalyzing || !OPENAI_API_KEY}
                            style={{
                                backgroundColor: isAnalyzing ? '#ccc' : '#2196f3',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Screenshot'}
                        </button>
                    </div>

                    {/* Events Table */}
                    {economicEvents.length > 0 && (
                        <div className="events-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h6 style={{ color: '#1976d2', margin: '0' }}>Extracted Economic Events</h6>
                                <button
                                    onClick={saveEvents}
                                    disabled={isSaving}
                                    style={{
                                        backgroundColor: isSaving ? '#ccc' : '#4caf50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '5px',
                                        cursor: isSaving ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {isSaving ? 'Saving...' : `Save ${economicEvents.length} Events`}
                                </button>
                            </div>
                            
                            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#2196f3', color: 'white' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Date/Time</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Currency</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Impact</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Event</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actual</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Forecast</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Previous</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {economicEvents.map((event, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <input
                                                        type="datetime-local"
                                                        value={event.date_time ? event.date_time.slice(0, 16) : ''}
                                                        onChange={(e) => handleEventChange(index, 'date_time', e.target.value + ':00')}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <select
                                                        value={event.currency || ''}
                                                        onChange={(e) => handleEventChange(index, 'currency', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                        <option value="JPY">JPY</option>
                                                        <option value="AUD">AUD</option>
                                                        <option value="CAD">CAD</option>
                                                        <option value="CHF">CHF</option>
                                                        <option value="CNY">CNY</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <select
                                                        value={event.impact || ''}
                                                        onChange={(e) => handleEventChange(index, 'impact', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <input
                                                        type="text"
                                                        value={event.event_name || ''}
                                                        onChange={(e) => handleEventChange(index, 'event_name', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <input
                                                        type="text"
                                                        value={event.actual || ''}
                                                        onChange={(e) => handleEventChange(index, 'actual', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <input
                                                        type="text"
                                                        value={event.forecast || ''}
                                                        onChange={(e) => handleEventChange(index, 'forecast', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                                    <input
                                                        type="text"
                                                        value={event.previous || ''}
                                                        onChange={(e) => handleEventChange(index, 'previous', e.target.value)}
                                                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => removeEvent(index)}
                                                        style={{
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '4px 8px',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <br />
                </div>
            </div>
        </div>
    );
}