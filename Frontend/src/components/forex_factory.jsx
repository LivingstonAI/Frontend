import React, { useEffect, useState } from "react";
import { Upload, Camera, Save, Edit3, Trash2, Plus, AlertCircle, CheckCircle } from "lucide-react";

import Header from "./header";
import SideNavs from "./side_navs";

export default function ForexFactoryCapturer() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [economicEvents, setEconomicEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [notification, setNotification] = useState({ type: '', message: '' });

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
      showNotification('error', 'Failed to fetch API key');
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      showNotification('error', 'Please select a valid image file');
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processScreenshot = async () => {
    if (!selectedFile || !OPENAI_API_KEY) {
      showNotification('error', 'Please select a file and ensure API key is loaded');
      return;
    }

    setIsProcessing(true);
    try {
      const base64Image = await convertImageToBase64(selectedFile);
      
      const response = await fetch(`${baseUrl}/process_forex_screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          api_key: OPENAI_API_KEY
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process screenshot');
      }

      const data = await response.json();
      if (data.events && Array.isArray(data.events)) {
        setEconomicEvents(data.events);
        showNotification('success', `Successfully processed ${data.events.length} events`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error processing screenshot:', error);
      showNotification('error', 'Failed to process screenshot. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (index, field, value) => {
    const updatedEvents = [...economicEvents];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEconomicEvents(updatedEvents);
  };

  const addNewEvent = () => {
    const newEvent = {
      date_time: new Date().toISOString().slice(0, 16),
      currency: 'USD',
      impact: 'medium',
      event_name: '',
      actual: '',
      forecast: '',
      previous: ''
    };
    setEconomicEvents([...economicEvents, newEvent]);
    setEditingIndex(economicEvents.length);
  };

  const removeEvent = (index) => {
    const updatedEvents = economicEvents.filter((_, i) => i !== index);
    setEconomicEvents(updatedEvents);
    if (editingIndex === index) setEditingIndex(-1);
  };

  const saveEvents = async () => {
    if (economicEvents.length === 0) {
      showNotification('error', 'No events to save');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/save_forex_factory_news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: economicEvents }),
      });

      if (!response.ok) {
        throw new Error('Failed to save events');
      }

      showNotification('success', `Successfully saved ${economicEvents.length} events`);
      setEconomicEvents([]);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error saving events:', error);
      showNotification('error', 'Failed to save events. Please try again.');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="header">
        <Header />
      </div>
      
      <div className="main-page-body">
        <SideNavs />
        
        <div className="main-body-info" style={{ flex: 1, maxWidth: '1200px' }}>
          <h5 style={{ 
            color: '#1e40af', 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '30px',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '10px'
          }}>
            Forex Factory Screenshot Analyzer
          </h5>

          {/* Notification */}
          {notification.message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: notification.type === 'success' ? '#dcfce7' : '#fef2f2',
              border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              color: notification.type === 'success' ? '#166534' : '#dc2626'
            }}>
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {notification.message}
            </div>
          )}

          {/* Upload Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h6 style={{ color: '#1e40af', fontSize: '20px', marginBottom: '20px', fontWeight: '600' }}>
              Upload Forex Factory Screenshot
            </h6>
            
            <div style={{
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f0f9ff',
              transition: 'all 0.3s ease'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <Upload size={48} color="#3b82f6" />
                <div>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', margin: '0' }}>
                    Click to upload screenshot
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0 0' }}>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {previewUrl && (
              <div style={{ marginTop: '20px' }}>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }} 
                />
                <button
                  onClick={processScreenshot}
                  disabled={isProcessing}
                  style={{
                    marginTop: '15px',
                    padding: '12px 24px',
                    backgroundColor: isProcessing ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <Camera size={20} />
                  {isProcessing ? 'Processing...' : 'Analyze with GPT-4o-mini'}
                </button>
              </div>
            )}
          </div>

          {/* Events Table */}
          {economicEvents.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h6 style={{ color: '#1e40af', fontSize: '20px', margin: '0', fontWeight: '600' }}>
                  Economic Events ({economicEvents.length})
                </h6>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={addNewEvent}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={16} />
                    Add Event
                  </button>
                  <button
                    onClick={saveEvents}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Save size={16} />
                    Save All
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                      {['Date/Time', 'Currency', 'Impact', 'Event Name', 'Actual', 'Forecast', 'Previous', 'Actions'].map(header => (
                        <th key={header} style={{
                          padding: '12px 8px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {economicEvents.map((event, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="datetime-local"
                            value={event.date_time}
                            onChange={(e) => handleEdit(index, 'date_time', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <select
                            value={event.currency}
                            onChange={(e) => handleEdit(index, 'currency', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          >
                            {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'].map(curr => (
                              <option key={curr} value={curr}>{curr}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <select
                            value={event.impact}
                            onChange={(e) => handleEdit(index, 'impact', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="text"
                            value={event.event_name}
                            onChange={(e) => handleEdit(index, 'event_name', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="text"
                            value={event.actual || ''}
                            onChange={(e) => handleEdit(index, 'actual', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="text"
                            value={event.forecast || ''}
                            onChange={(e) => handleEdit(index, 'forecast', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="text"
                            value={event.previous || ''}
                            onChange={(e) => handleEdit(index, 'previous', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '13px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <button
                            onClick={() => removeEvent(index)}
                            style={{
                              padding: '6px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}