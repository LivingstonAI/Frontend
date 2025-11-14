import React, { useEffect, useState } from "react";
import { Upload, Edit3, Save, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, Plus } from "lucide-react";
import Header from "./header";
import SideNavs from "./side_navs";


export default function ForexFactoryCapturer() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [economicEvents, setEconomicEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  // Function to correct dates to current year
  const correctDateToCurrentYear = (dateTimeString) => {
    if (!dateTimeString) return dateTimeString;
    
    try {
      const currentYear = new Date().getFullYear();
      const parsedDate = new Date(dateTimeString);
      
      // If the year is 2023 or 2024, update it to current year
      if (parsedDate.getFullYear() === 2023 || parsedDate.getFullYear() === 2024) {
        parsedDate.setFullYear(currentYear);
        return parsedDate.toISOString().slice(0, 19); // Remove the 'Z' suffix
      }
      
      return dateTimeString;
    } catch (error) {
      console.error('Error correcting date:', error);
      return dateTimeString;
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      setEconomicEvents([]);
      setSaveStatus(null);
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
    if (!selectedFile || !OPENAI_API_KEY) {
      alert('Please select a file and ensure API key is loaded');
      return;
    }

    setIsAnalyzing(true);
    setSaveStatus(null);

    try {
      const base64Image = await fileToBase64(selectedFile);
      
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this Forex Factory economic calendar screenshot and extract the economic events data. Return ONLY a valid JSON array of objects with the following structure:
                [
                  {
                    "date_time": "2024-12-01T14:30:00",
                    "currency": "USD",
                    "impact": "high",
                    "event_name": "Non-Farm Payrolls",
                    "actual": "150K",
                    "forecast": "160K",
                    "previous": "140K"
                  }
                ]
                
                Guidelines:
                - date_time: ISO format (YYYY-MM-DDTHH:MM:SS)
                - currency: 3-letter code (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY)
                - impact: "low", "medium", or "high"
                - event_name: Descriptive name of the economic event
                - actual, forecast, previous: String values (can be null/empty if not available)
                
                Extract all visible events from the calendar. If no events are clearly visible, return an empty array.`
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
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No response from GPT');
      }

      // Parse JSON response
      let events;
      try {
        // Clean the response in case it has markdown formatting
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        events = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response from GPT');
      }

      if (!Array.isArray(events)) {
        throw new Error('Response is not an array');
      }

      // Correct dates to current year before setting state
      const correctedEvents = events.map(event => ({
        ...event,
        date_time: correctDateToCurrentYear(event.date_time)
      }));

      setEconomicEvents(correctedEvents);
      setSaveStatus({ type: 'info', message: `Extracted ${correctedEvents.length} events (dates corrected to current year)` });
    } catch (error) {
      console.error('Analysis error:', error);
      setSaveStatus({ type: 'error', message: `Analysis failed: ${error.message}` });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle editing
  const handleEdit = (index, field, value) => {
    const updatedEvents = [...economicEvents];
    updatedEvents[index][field] = value;
    setEconomicEvents(updatedEvents);
  };

  // Delete event
  const deleteEvent = (index) => {
    const updatedEvents = economicEvents.filter((_, i) => i !== index);
    setEconomicEvents(updatedEvents);
  };

  const addNewEvent = () => {
    // Get current date/time in local timezone without conversion
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    const newEvent = {
      date_time: localDateTime,
      currency: '',
      impact: '',
      event_name: '',
      actual: '',
      forecast: '',
      previous: ''
    };
    setEconomicEvents([...economicEvents, newEvent]);
  };

  // Replace the saveEvents function in ForexFactoryCapturer with this:
  const saveEvents = async () => {
    if (economicEvents.length === 0) {
      alert('No events to save');
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      let savedCount = 0;
      const errors = [];

      // Save events one by one using the same REST API endpoint as Calendar
      for (const event of economicEvents) {
        try {
          // Format datetime for backend - append seconds if not present
          let dateTime = event.date_time;
          if (dateTime && !dateTime.includes(':00:00') && dateTime.length === 16) {
            dateTime = dateTime + ':00';
          }
          
          const response = await fetch(`${baseUrl}/api/economic-events/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date_time: dateTime,
              currency: event.currency,
              impact: event.impact,
              event_name: event.event_name,
              actual: event.actual || '',
              forecast: event.forecast || '',
              previous: event.previous || ''
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            errors.push(`Failed to save "${event.event_name}": ${errorData.detail || response.statusText}`);
          } else {
            savedCount++;
          }
        } catch (error) {
          errors.push(`Failed to save "${event.event_name}": ${error.message}`);
        }
      }

      if (savedCount > 0) {
        setSaveStatus({ 
          type: 'success', 
          message: `Successfully saved ${savedCount} events${errors.length > 0 ? ` (${errors.length} failed)` : ''}` 
        });
        
        // Clear the form after successful save
        setTimeout(() => {
          setEconomicEvents([]);
          setSelectedFile(null);
          setPreviewUrl(null);
          setSaveStatus(null);
        }, 2000);
      } else {
        setSaveStatus({ 
          type: 'error', 
          message: `Save failed. Errors: ${errors.join(', ')}` 
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus({ type: 'error', message: `Save failed: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .forex-capturer-container {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        .upload-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px dashed #3b82f6;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .upload-section:hover {
          border-color: #1e40af;
          transform: translateY(-2px);
        }

        .upload-input {
          display: none;
        }

        .upload-button {
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .upload-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .preview-section {
          margin: 1rem 0;
          text-align: center;
        }

        .preview-toggle {
          background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
          border: 1px solid #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .preview-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(59, 130, 246, 0.3);
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .analyze-button {
          background: linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem auto;
          transition: all 0.3s ease;
        }

        .analyze-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(29, 78, 216, 0.4);
        }

        .analyze-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
          margin-top: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #e2e8f0;
        }

        .table-container::-webkit-scrollbar {
          height: 8px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%);
        }

        .events-table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
          background: white;
        }

        .events-table th {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 1rem 0.75rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .events-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
          min-width: 120px;
        }

        .events-table tr:hover {
          background: #f8fafc;
        }

        .events-table input,
        .events-table select {
          width: 100%;
          min-width: 100px;
          padding: 0.4rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .events-table input:focus,
        .events-table select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .impact-high { background: #fef2f2; color: #dc2626; }
        .impact-medium { background: #fffbeb; color: #d97706; }
        .impact-low { background: #f0fdf4; color: #16a34a; }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .action-button {
          padding: 0.4rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .edit-button {
          background: linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .delete-button {
          background: linear-gradient(90deg, #fef2f2 0%, #fecaca 100%);
          color: #dc2626;
          border: 1px solid #f87171;
        }

        .action-button:hover {
          transform: scale(1.1);
        }

        .save-section {
          margin-top: 2rem;
          text-align: center;
        }

        .save-button {
          background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .save-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-message {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .status-success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .status-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .status-info {
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .no-events {
          text-align: center;
          color: #64748b;
          font-style: italic;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .add-event-section {
          margin: 1rem 0;
          text-align: center;
        }

        .add-button {
          background: linear-gradient(90deg, #16a34a 0%, #15803d 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);
        }
              
        @media (max-width: 768px) {
          .upload-section {
            padding: 1.5rem;
          }

          .upload-button {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .analyze-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }

          .save-button {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }

          .events-table th,
          .events-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .events-table input,
          .events-table select {
            font-size: 0.8rem;
            padding: 0.3rem;
          }

          .table-container {
            border-radius: 0;
          }

          .status-message {
            font-size: 0.9rem;
            padding: 0.5rem 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .upload-section {
            padding: 1rem;
          }

          .upload-button {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
          }

          .preview-toggle {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
          }

          .analyze-button {
            padding: 0.625rem 1.25rem;
            font-size: 0.85rem;
          }

          .save-button {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
          }
        }
       
        
        .main-body-info {
          flex: 1;
          padding: 2rem;
        }
        
        .major-upcoming-news-events-header {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e40af;
        }

        @media (max-width: 1024px) {
          .main-page-body {
            flex-direction: column;
          }
          
          .main-body-info {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .main-body-info {
            padding: 1rem;
          }
          
          .major-upcoming-news-events-header {
            font-size: 1.25rem;
          }
          
          .add-event-section {
            margin: 0.75rem 0;
          }
          
          .add-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .main-body-info {
            padding: 0.75rem;
          }
          
          .major-upcoming-news-events-header {
            font-size: 1.1rem;
          }
          
          br {
            display: none;
          }
          
          .add-button {
            padding: 0.625rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="forex-capturer-container">
        <div className="header">
          <Header />
        </div>
        <div className="main-page-body">
          <SideNavs />
          <div className="main-body-info">
            <h5 className="major-upcoming-news-events-header">
              Forex Factory Screenshot Analyzer
            </h5><br /><br /><br />

            <div className="upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="upload-input"
                id="screenshot-upload"
              />
              <label htmlFor="screenshot-upload" className="upload-button">
                <Upload size={20} />
                Upload Forex Factory Screenshot
              </label>
              <p style={{ margin: '1rem 0 0 0', color: '#64748b' }}>
                Select a screenshot of the Forex Factory economic calendar
              </p>
            </div>

            {previewUrl && (
              <div className="preview-section">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="preview-toggle"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                {showPreview && (
                  <div>
                    <img src={previewUrl} alt="Screenshot preview" className="preview-image" />
                  </div>
                )}
              </div>
            )}

            {selectedFile && (
              <button
                onClick={analyzeScreenshot}
                disabled={isAnalyzing || !OPENAI_API_KEY}
                className="analyze-button"
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing Screenshot...
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    Analyze with GPT-4o-mini
                  </>
                )}
              </button>
            )}

            {saveStatus && (
              <div className={`status-message status-${saveStatus.type}`}>
                {saveStatus.type === 'success' && <CheckCircle size={20} />}
                {saveStatus.type === 'error' && <AlertCircle size={20} />}
                {saveStatus.type === 'info' && <AlertCircle size={20} />}
                {saveStatus.message}
              </div>
            )}

            <div className="add-event-section">
              <button onClick={addNewEvent} className="add-button">
                <Plus size={20} />
                Add New Event
              </button>
            </div>

            {economicEvents.length > 0 ? (
              <>
                <div className="table-container">
                  <table className="events-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Currency</th>
                        <th>Impact</th>
                        <th>Event Name</th>
                        <th>Actual</th>
                        <th>Forecast</th>
                        <th>Previous</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {economicEvents.map((event, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="datetime-local"
                              value={event.date_time?.slice(0, 16) || ''}
                              onChange={(e) => handleEdit(index, 'date_time', e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              value={event.currency || ''}
                              onChange={(e) => handleEdit(index, 'currency', e.target.value)}
                            >
                              <option value="">Select</option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="AUD">AUD</option>
                              <option value="CAD">CAD</option>
                              <option value="CHF">CHF</option>
                              <option value="JPY">JPY</option>
                              <option value="CNY">CNY</option>
                            </select>
                          </td>
                          <td>
                            <select
                              value={event.impact || ''}
                              onChange={(e) => handleEdit(index, 'impact', e.target.value)}
                              className={`impact-${event.impact}`}
                            >
                              <option value="">Select</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={event.event_name || ''}
                              onChange={(e) => handleEdit(index, 'event_name', e.target.value)}
                              placeholder="Event name"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={event.actual || ''}
                              onChange={(e) => handleEdit(index, 'actual', e.target.value)}
                              placeholder="Actual"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={event.forecast || ''}
                              onChange={(e) => handleEdit(index, 'forecast', e.target.value)}
                              placeholder="Forecast"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={event.previous || ''}
                              onChange={(e) => handleEdit(index, 'previous', e.target.value)}
                              placeholder="Previous"
                            />
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => deleteEvent(index)}
                                className="action-button delete-button"
                                title="Delete event"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="save-section">
                  <button
                    onClick={saveEvents}
                    disabled={isSaving || economicEvents.length === 0}
                    className="save-button"
                  >
                    {isSaving ? (
                      <>
                        <div className="spinner"></div>
                        Saving Events...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save {economicEvents.length} Events
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : selectedFile && !isAnalyzing ? (
              <div className="no-events">
                Click "Analyze with GPT-4o-mini" to extract economic events from your screenshot
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}