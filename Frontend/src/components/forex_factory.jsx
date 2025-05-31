import React, { useEffect, useState } from "react";
import { Upload, Edit3, Save, Trash2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

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

      setEconomicEvents(events);
      setSaveStatus({ type: 'info', message: `Extracted ${events.length} events` });
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

  // Save events to backend
  const saveEvents = async () => {
    if (economicEvents.length === 0) {
      alert('No events to save');
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch(`${baseUrl}/save_forex_factory_news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: economicEvents })
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      const result = await response.json();
      setSaveStatus({ type: 'success', message: `Successfully saved ${economicEvents.length} events` });
      
      // Clear the form after successful save
      setTimeout(() => {
        setEconomicEvents([]);
        setSelectedFile(null);
        setPreviewUrl(null);
        setSaveStatus(null);
      }, 2000);
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
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        .header {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .main-page-body {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .main-body-info {
          flex: 1;
          padding: 2rem;
          background: white;
          margin: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .major-upcoming-news-events-header {
          color: #1e40af;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
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
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .analyze-button {
          background: linear-gradient(90deg, #059669 0%, #047857 100%);
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
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
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

        .events-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .events-table th {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 1rem 0.75rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .events-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }

        .events-table tr:hover {
          background: #f8fafc;
        }

        .events-table input,
        .events-table select {
          width: 100%;
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
          background: #dbeafe;
          color: #1e40af;
        }

        .delete-button {
          background: #fef2f2;
          color: #dc2626;
        }

        .action-button:hover {
          transform: scale(1.1);
        }

        .save-section {
          margin-top: 2rem;
          text-align: center;
        }

        .save-button {
          background: linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%);
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
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
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
            </h5>

            {/* Upload Section */}
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

            {/* Preview Section */}
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

            {/* Analyze Button */}
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

            {/* Status Messages */}
            {saveStatus && (
              <div className={`status-message status-${saveStatus.type}`}>
                {saveStatus.type === 'success' && <CheckCircle size={20} />}
                {saveStatus.type === 'error' && <AlertCircle size={20} />}
                {saveStatus.type === 'info' && <AlertCircle size={20} />}
                {saveStatus.message}
              </div>
            )}

            {/* Events Table */}
            {economicEvents.length > 0 ? (
              <>
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
                            value={event.date_time?.replace('Z', '') || ''}
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
                            <option value="JPY">JPY</option>
                            <option value="AUD">AUD</option>
                            <option value="CAD">CAD</option>
                            <option value="CHF">CHF</option>
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

                {/* Save Section */}
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