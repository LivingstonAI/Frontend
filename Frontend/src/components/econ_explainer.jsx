import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';

export default function EconExplainer() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [analysis, setAnalysis] = useState('');
  const [cotData, setCotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [economicData, setEconomicData] = useState([]);
  
  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)', cotAsset: 'USD INDEX - ICE FUTURES U.S.' },
    { value: 'EUR', label: 'Euro (EUR)', cotAsset: 'EURO FX - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'GBP', label: 'British Pound (GBP)', cotAsset: 'BRITISH POUND - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'JPY', label: 'Japanese Yen (JPY)', cotAsset: 'JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'AUD', label: 'Australian Dollar (AUD)', cotAsset: 'AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)', cotAsset: 'CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'CHF', label: 'Swiss Franc (CHF)', cotAsset: 'SWISS FRANC - CHICAGO MERCANTILE EXCHANGE' },
    { value: 'NZD', label: 'New Zealand Dollar (NZD)', cotAsset: 'NZ DOLLAR - CHICAGO MERCANTILE EXCHANGE' },
  ];

  // Function to fetch the API key
  const fetchApiKey = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_openai_key`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOPENAI_API_KEY(data.OPENAI_API_KEY);
    } catch (error) {
      console.error("Error fetching API key:", error);
    }
  };

  const getCurrencyAsset = (currencyCode) => {
    const currency = currencyOptions.find(opt => opt.value === currencyCode);
    return currency ? currency.cotAsset : '';
  };

  const fetchCotData = async () => {
    try {
      setLoading(true);
      const asset = getCurrencyAsset(selectedCurrency);
      if (!asset) return;
      
      const response = await fetch(`${baseUrl}/generate_cot_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assets: [asset]
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch COT data');
      }
      
      const data = await response.json();
      setCotData(data[asset]);
      return data[asset];
    } catch (error) {
      console.error('Error fetching COT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEconomicEvents = async () => {
    try {
      // Fetch economic events based on the EconomicEvent model
      const response = await fetch(`${baseUrl}/economic_events/?currency=${selectedCurrency}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch economic events');
      }
      
      const data = await response.json();
      setEconomicData(data);
      return data;
    } catch (error) {
      console.error('Error fetching economic events:', error);
      return [];
    }
  };

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      
      const cotDataResult = await fetchCotData();
      const economicEvents = await fetchEconomicEvents();
      
      if (!cotDataResult) {
        setAnalysis("Unable to generate analysis: COT data not available.");
        setLoading(false);
        return;
      }
      
      // Construct prompt for GPT-4o-mini
      const prompt = `
        Analyze the following currency data for ${selectedCurrency}:
        
        COT Data (${cotDataResult.Date}):
        - Commercial Long: ${cotDataResult["Percentage Commercial Long"]}%
        - Commercial Short: ${cotDataResult["Percentage Commercial Short"]}%
        - Non-Commercial Long: ${cotDataResult["Percentage Noncommercial Long"]}%
        - Non-Commercial Short: ${cotDataResult["Percentage Noncommercial Short"]}%
        
        Recent Economic Events:
        ${economicEvents.map(event => 
          `- ${new Date(event.date_time).toLocaleDateString()}: ${event.event_name}
           (Actual: ${event.actual || 'N/A'}, Forecast: ${event.forecast || 'N/A'}, Previous: ${event.previous || 'N/A'})
           Impact: ${event.impact}`
        ).join('\n')}
        
        Please provide a concise analysis (200-300 words) of the current economic conditions for ${selectedCurrency}, 
        highlighting key points from the COT data and recent economic events. 
        Explain what the positioning of commercial and non-commercial traders might indicate about market sentiment.
      `;
      
      // Make API call to GPT-4o-mini
      const response = await fetch(`${baseUrl}/openai_analysis/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: "gpt-4o-mini",
          max_tokens: 500,
          api_key: OPENAI_API_KEY
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }
      
      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setAnalysis("Error generating analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  useEffect(() => {
    if (selectedCurrency && OPENAI_API_KEY) {
      generateAnalysis();
    }
  }, [selectedCurrency, OPENAI_API_KEY]);

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '20px',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const headingStyle = {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const collapseButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  const eventCardStyle = {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '10px',
    border: '1px solid #eee',
  };

  const impactBadgeStyle = (impact) => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 
      impact === 'high' ? '#ef4444' : 
      impact === 'medium' ? '#f59e0b' : 
      '#10b981',
    marginRight: '8px',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  };

  const cotImageStyle = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginTop: '10px',
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info" style={containerStyle}>
          <h5 className="major-upcoming-news-events-header">Economics Explainer</h5>
          <br />
          
          <div style={cardStyle}>
            <div style={headingStyle}>
              <h3>Currency Analysis</h3>
              <button 
                onClick={() => fetchCotData()}
                style={buttonStyle}
              >
                <RefreshCcw size={16} />
                Refresh Data
              </button>
            </div>
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={selectStyle}
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div style={gridStyle}>
              <div>
                <div style={headingStyle}>
                  <h4>AI Economic Analysis</h4>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    style={collapseButtonStyle}
                  >
                    {showExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                
                {showExplanation ? (
                  loading ? (
                    <div style={loadingStyle}>
                      <p>Generating analysis...</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ lineHeight: '1.6', fontSize: '14px' }}>{analysis}</p>
                    </div>
                  )
                ) : null}
              </div>
              
              <div>
                <h4 style={headingStyle}>COT Positioning</h4>
                {cotData ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                      <div>
                        <h5 style={{ fontSize: '14px', marginBottom: '5px' }}>Commercial</h5>
                        <div style={{ fontSize: '13px', marginBottom: '3px' }}>
                          Long: <strong>{cotData["Percentage Commercial Long"]}%</strong>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          Short: <strong>{cotData["Percentage Commercial Short"]}%</strong>
                        </div>
                      </div>
                      <div>
                        <h5 style={{ fontSize: '14px', marginBottom: '5px' }}>Non-Commercial</h5>
                        <div style={{ fontSize: '13px', marginBottom: '3px' }}>
                          Long: <strong>{cotData["Percentage Noncommercial Long"]}%</strong>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          Short: <strong>{cotData["Percentage Noncommercial Short"]}%</strong>
                        </div>
                      </div>
                    </div>
                    <div>
                      <img 
                        src={cotData["Plot URL"]} 
                        alt="COT Positioning Chart" 
                        style={cotImageStyle}
                      />
                    </div>
                  </div>
                ) : (
                  <p>Loading COT data...</p>
                )}
              </div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={headingStyle}>
              <h4>Recent Economic Events</h4>
            </div>
            
            {economicData.length > 0 ? (
              economicData.map((event, index) => (
                <div key={index} style={eventCardStyle}>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={impactBadgeStyle(event.impact)}>{event.impact.toUpperCase()}</span>
                    <strong>{event.event_name}</strong>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {new Date(event.date_time).toLocaleString()}
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '10px',
                    marginTop: '5px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <span style={{ color: '#666' }}>Actual: </span>
                      <span style={{ fontWeight: '600' }}>{event.actual || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Forecast: </span>
                      <span>{event.forecast || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Previous: </span>
                      <span>{event.previous || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent economic events found for {selectedCurrency}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}