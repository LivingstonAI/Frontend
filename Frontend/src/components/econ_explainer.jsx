import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Loader2, ChevronDown, ChevronUp, RefreshCw, Calendar } from "lucide-react";

export default function EconExplainer() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [cotData, setCotData] = useState(null);
  const [economicEvents, setEconomicEvents] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [eventsVisible, setEventsVisible] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");

  const currencies = [
    { code: "USD", name: "US Dollar", asset: "USD INDEX - ICE FUTURES U.S." },
    { code: "EUR", name: "Euro", asset: "EURO FX - CHICAGO MERCANTILE EXCHANGE" },
    { code: "GBP", name: "British Pound", asset: "BRITISH POUND - CHICAGO MERCANTILE EXCHANGE" },
    { code: "JPY", name: "Japanese Yen", asset: "JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE" },
    { code: "AUD", name: "Australian Dollar", asset: "AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
    { code: "CAD", name: "Canadian Dollar", asset: "CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
    { code: "CHF", name: "Swiss Franc", asset: "SWISS FRANC - CHICAGO MERCANTILE EXCHANGE" },
    { code: "NZD", name: "New Zealand Dollar", asset: "NZ DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
    { code: "GOLD", name: "Gold", asset: "GOLD - COMMODITY EXCHANGE INC." },
    { code: "USTB", name: "UST Bond", asset: "UST BOND - CHICAGO BOARD OF TRADE" },
    { code: "UST10Y", name: "UST 10Y Note", asset: "UST 10Y NOTE - CHICAGO BOARD OF TRADE" },
    { code: "UST5Y", name: "UST 5Y Note", asset: "UST 5Y NOTE - CHICAGO BOARD OF TRADE" },
    { code: "NASDAQ", name: "Nasdaq Mini", asset: "NASDAQ MINI - CHICAGO MERCANTILE EXCHANGE" },
    { code: "SP500", name: "E-Mini S&P 500", asset: "E-MINI S&P 500 -" },
    { code: "DJRE", name: "Dow Jones Real Estate", asset: "DOW JONES U.S. REAL ESTATE IDX - CHICAGO BOARD OF TRADE" },
  ];

  const loadingMessages = [
    "Loading market data... 📊",
    "Analyzing COT reports... 📈",
    "Fetching economic events... 📅",
    "Crunching the numbers... 🧮",
    "Consulting the financial oracles... 🔮",
    "Summoning economic wisdom... 📚",
    "Decoding market sentiment... 🧠",
    "Checking what the smart money is doing... 💰",
    "Analyzing institutional positions... 🏦",
    "Digging into financial data... ⛏️",
    "Scanning the economic horizon... 🔭"
  ];

  const tradingFacts = [
    "Did you know? The Commitment of Traders (COT) report shows the positions of different types of traders in the futures market.",
    "Commercial traders are typically hedgers who use futures to reduce risk from their business operations.",
    "Non-commercial traders are typically large speculators like hedge funds and financial institutions.",
    "When commercial and non-commercial positions diverge significantly, it often signals a potential market turning point.",
    "High-impact economic events typically cause the most market volatility and price movement.",
    "The USD Index tracks the value of the US dollar relative to a basket of foreign currencies.",
    "Central bank policy decisions are among the most influential factors for currency movements.",
    "Extreme positioning in either direction can indicate an overbought or oversold market condition.",
    "Gold often moves inversely to the US dollar and real interest rates.",
    "Treasury bonds tend to rally during times of economic uncertainty.",
    "The COT report is released every Friday by the Commodity Futures Trading Commission (CFTC).",
    "Economic surprises (actual vs forecast) often drive short-term market reactions."
  ];

  // Function to fetch the API key
  const fetchApiKey = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_openai_key`);
      if (!response.ok) throw new Error("Network response was not ok");
      const { OPENAI_API_KEY } = await response.json();
      setOPENAI_API_KEY(OPENAI_API_KEY);
    } catch (error) {
      console.error("Error fetching API key:", error);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  // Function to generate random loading message
  const getRandomLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    return loadingMessages[randomIndex];
  };

  // Function to get random trading fact
  const getRandomTradingFact = () => {
    const randomIndex = Math.floor(Math.random() * tradingFacts.length);
    return tradingFacts[randomIndex];
  };

  // Update loading message periodically
  useEffect(() => {
    let interval;
    if (loading || aiLoading) {
      setLoadingMessage(getRandomLoadingMessage());
      interval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage());
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading, aiLoading]);

  // Function to fetch COT data
  const fetchCotData = async (asset) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/cot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assets: [asset] }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch COT data");
      const data = await response.json();
      setCotData(data);
      return data;
    } catch (error) {
      console.error("Error fetching COT data:", error);
      alert("Failed to fetch COT data. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch economic events
  const fetchEconomicEvents = async (currencyCode) => {
    console.log('Currency is: ', currencyCode);
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/economic-events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: currencyCode }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch economic events");
      const data = await response.json();
      setEconomicEvents(data.events);
      return data.events;
    } catch (error) {
      console.error("Error fetching economic events:", error);
      setEconomicEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to generate AI summary including both COT and economic events data
  const generateAiSummary = async (cotData, events, currency) => {
    setAiLoading(true);
    try {
      const currencyInfo = currencies.find(c => c.code === currency);
      const asset = currencyInfo?.asset;
      const assetData = cotData[asset];
      
      if (!assetData) {
        throw new Error("No data available for selected asset");
      }

      // Format economic events for the prompt
      let eventsText = "";
      if (events && events.length > 0) {
        eventsText = "Recent Economic Events:\n";
        events.slice(0, 10).forEach(event => {
          eventsText += `- ${event.date_time}: ${event.event_name} (Impact: ${event.impact})\n`;
          eventsText += `  Actual: ${event.actual || 'N/A'}, Forecast: ${event.forecast || 'N/A'}, Previous: ${event.previous || 'N/A'}\n`;
        });
      } else {
        eventsText = "No recent economic events data available.";
      }

      const prompt = `
        I need a comprehensive economic analysis for ${currencyInfo.name} based on the following data:
        
        === COT DATA ===
        Date: ${assetData.Date}
        Percentage Noncommercial Long: ${assetData.Percentage_Noncommercial_Long}%
        Percentage Noncommercial Short: ${assetData.Percentage_Noncommercial_Short}%
        Percentage Commercial Long: ${assetData.Percentage_Commercial_Long}%
        Percentage Commercial Short: ${assetData.Percentage_Commercial_Short}%
        
        === ECONOMIC EVENTS DATA ===
        ${eventsText}
        
        Background Information:
        - The COT report shows the positions of different types of traders in the futures market. 
        - Commercial traders are typically hedgers who use futures to reduce risk from their business operations. 
        - Non-commercial traders are typically large speculators like hedge funds and financial institutions.
        - Economic events provide context about the macroeconomic environment affecting this currency.
        
        Please provide:
        1. A concise analysis of the current positioning (are speculators bullish or bearish?)
        2. How the economic events data supports or contradicts the positioning data
        3. What this suggests about the economic climate for ${currencyInfo.name}
        4. Any potential market implications or trading considerations
        
        Keep the response well-structured with clear sections and focus on practical implications.
      `;

      const response = await fetch(`${baseUrl}/api/generate_econ_ai_summary/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt,
          api_key: OPENAI_API_KEY
        }),
      });
      
      if (!response.ok) throw new Error("Failed to generate AI summary");
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiSummary("Failed to generate economic analysis. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle currency selection
  const handleCurrencySelect = async (currency) => {
    setSelectedCurrency(currency);
    const currencyInfo = currencies.find(c => c.code === currency);
    if (currencyInfo) {
      const cotDataResult = await fetchCotData(currencyInfo.asset);
      const eventsResult = await fetchEconomicEvents(currency);
      
      if (cotDataResult) {
        generateAiSummary(cotDataResult, eventsResult, currency);
      }
    }
  };

  // Toggle summary visibility
  const toggleSummary = () => {
    setSummaryVisible(!summaryVisible);
  };

  // Toggle events visibility
  const toggleEvents = () => {
    setEventsVisible(!eventsVisible);
  };

  // Refresh data
  const refreshData = () => {
    if (selectedCurrency) {
      handleCurrencySelect(selectedCurrency);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get impact color class
  const getImpactClass = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'high-impact';
      case 'medium':
        return 'medium-impact';
      case 'low':
        return 'low-impact';
      default:
        return '';
    }
  };

  return (
    <div className="econ-explainer">
      <div className="header">
          <Header />
      </div>
      <div className="main-page-body">
          <SideNavs />
                      
      <div className="econ-header">
        <h5>Economics Explainer</h5>
        <p className="econ-subheader">Select a currency to get comprehensive economic insights based on COT reports and economic events</p>
      </div>

      <div className="currency-selector">
        <label htmlFor="currency-select">Select Currency/Asset:</label>
        <select 
          id="currency-select" 
          value={selectedCurrency} 
          onChange={(e) => handleCurrencySelect(e.target.value)}
          disabled={loading || aiLoading}
        >
          <option value="">-- Select Currency --</option>
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.name}
            </option>
          ))}
        </select>
        
        {selectedCurrency && (
          <button 
            className="refresh-btn" 
            onClick={refreshData} 
            disabled={loading || aiLoading}
          >
            <RefreshCw className={loading || aiLoading ? "spin" : ""} size={16} />
          </button>
        )}
      </div>

      {(loading || aiLoading) && (
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={24} />
          <p className="loading-message">{loadingMessage}</p>
          <p className="trading-fact">
            <strong>Trading Fact:</strong> {getRandomTradingFact()}
          </p>
        </div>
      )}

      {!loading && !aiLoading && selectedCurrency && cotData && (
        <div className="results-container">
          <div className="cot-data">
            <h6>COT Report: {currencies.find(c => c.code === selectedCurrency)?.name}</h6>
            {Object.keys(cotData).map(asset => {
              const data = cotData[asset];
              return (
                <div key={asset} className="asset-data">
                  <div className="cot-details">
                    <div className="cot-detail">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{data.Date}</span>
                    </div>
                    <div className="cot-detail">
                      <span className="detail-label">Non-commercial Long:</span>
                      <span className="detail-value">{data.Percentage_Noncommercial_Long}%</span>
                    </div>
                    <div className="cot-detail">
                      <span className="detail-label">Non-commercial Short:</span>
                      <span className="detail-value">{data.Percentage_Noncommercial_Short}%</span>
                    </div>
                    <div className="cot-detail">
                      <span className="detail-label">Commercial Long:</span>
                      <span className="detail-value">{data.Percentage_Commercial_Long}%</span>
                    </div>
                    <div className="cot-detail">
                      <span className="detail-label">Commercial Short:</span>
                      <span className="detail-value">{data.Percentage_Commercial_Short}%</span>
                    </div>
                  </div>

                  {data.Plot_URL && (
                    <div className="cot-chart">
                      <img src={data.Plot_URL} alt={`COT Chart for ${asset}`} className="responsive-image" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="economic-events-container">
            <div className="events-header" onClick={toggleEvents}>
              <h6>
                <Calendar size={18} className="header-icon" />
                Economic Events
              </h6>
              {eventsVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {eventsVisible && (
              <div className="economic-events">
                {economicEvents && economicEvents.length > 0 ? (
                  <table className="events-table">
                    <thead>
                      <tr>
                        <th>Date/Time</th>
                        <th>Event</th>
                        <th>Impact</th>
                        <th>Actual</th>
                        <th>Forecast</th>
                        <th>Previous</th>
                      </tr>
                    </thead>
                    <tbody>
                      {economicEvents.map((event, index) => (
                        <tr key={index}>
                          <td>{formatDate(event.date_time)}</td>
                          <td>{event.event_name}</td>
                          <td>
                            <span className={`impact-badge ${getImpactClass(event.impact)}`}>
                              {event.impact}
                            </span>
                          </td>
                          <td>{event.actual || 'N/A'}</td>
                          <td>{event.forecast || 'N/A'}</td>
                          <td>{event.previous || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-events">No recent economic events data available for this currency.</p>
                )}
              </div>
            )}
          </div>

          <div className="ai-summary-container">
            <div className="summary-header" onClick={toggleSummary}>
              <h6>Comprehensive Economic Analysis</h6>
              {summaryVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {summaryVisible && (
              <div className="ai-summary">
                {aiSummary.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .econ-explainer {
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 100%;
        }

        .econ-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 15px;
        }

        .econ-header h5 {
          color: #2c3e50;
          margin-bottom: 5px;
          font-size: 1.5rem;
        }

        .econ-subheader {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
        }

        .currency-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .currency-selector label {
          font-weight: 600;
          color: #495057;
          min-width: 150px;
        }

        .currency-selector select {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background-color: white;
          font-size: 1rem;
          color: #495057;
          cursor: pointer;
        }

        .refresh-btn {
          background-color:rgb(51, 144, 238);
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .refresh-btn:hover {
          background-color:rgb(41, 143, 245);
        }

        .refresh-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
          border: 1px dashed #ced4da;
          border-radius: 8px;
          background-color: #f8f9fa;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
          color: #3498db;
        }

        .loading-message {
          font-size: 1.1rem;
          color: #495057;
          margin-bottom: 20px;
        }

        .trading-fact {
          font-size: 0.9rem;
          color: #6c757d;
          background-color: #e9ecef;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #3498db;
          text-align: left;
          line-height: 1.4;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cot-data,
        .economic-events-container,
        .ai-summary-container {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .cot-data h6,
        .economic-events-container h6,
        .ai-summary-container h6 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .header-icon {
          margin-right: 8px;
        }

        .asset-data {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        @media (min-width: 768px) {
          .asset-data {
            grid-template-columns: 1fr 2fr;
          }
          .cot-chart {
            max-width: 100%;
          }  
        }

        .cot-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cot-detail {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px dotted #e9ecef;
        }

        .detail-label {
          font-weight: 600;
          color: #495057;
        }

        .detail-value {
          color: #212529;
        }

        .cot-chart {
          display: flex;
          justify-content: center;
          max-width: 100%;
          overflow: hidden;
        }

        .cot-chart img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .events-header,
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #e9ecef;
        }

        .events-header h6,
        .summary-header h6 {
          margin: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        .economic-events {
          margin-top: 15px;
        }

        .events-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .events-table th {
          background-color: #f8f9fa;
          padding: 8px;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
        }

        .events-table td {
          padding: 8px;
          border-bottom: 1px solid #e9ecef;
        }

        .impact-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .high-impact {
          background-color: #ffcdd2;
          color: #c62828;
        }

        .medium-impact {
          background-color: #fff9c4;
          color: #f57f17;
        }

        .low-impact {
          background-color: #c8e6c9;
          color: #2e7d32;
        }

        .no-events {
          color: #6c757d;
          font-style: italic;
          padding: 10px 0;
        }

        .ai-summary {
          padding: 15px 0;
          color: #212529;
          line-height: 1.6;
        }

        .ai-summary p {
          margin-top: 0;
          margin-bottom: 12px;
        }

        .ai-summary p:last-child {
          margin-bottom: 0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
    </div>
  );
}