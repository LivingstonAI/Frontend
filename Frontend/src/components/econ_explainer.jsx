import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Loader2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

export default function EconExplainer() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [cotData, setCotData] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [summaryVisible, setSummaryVisible] = useState(true);
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
    "The USD Index tracks the value of the US dollar relative to a basket of foreign currencies.",
    "Central bank policy decisions are among the most influential factors for currency movements.",
    "Extreme positioning in either direction can indicate an overbought or oversold market condition.",
    "Gold often moves inversely to the US dollar and real interest rates.",
    "Treasury bonds tend to rally during times of economic uncertainty.",
    "The COT report is released every Friday by the Commodity Futures Trading Commission (CFTC)."
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
    } finally {
      setLoading(false);
    }
  };

  // Function to generate AI summary
  const generateAiSummary = async (cotData, currency) => {
    setAiLoading(true);
    try {
      const currencyInfo = currencies.find(c => c.code === currency);
      const asset = currencyInfo?.asset;
      const assetData = cotData[asset];
      
      if (!assetData) {
        throw new Error("No data available for selected asset");
      }

      const prompt = `
        I need an economic analysis for ${currencyInfo.name} based on the following Commitment of Traders (COT) data:
        
        Date: ${assetData.Date}
        Percentage Noncommercial Long: ${assetData.Percentage_Noncommercial_Long}%
        Percentage Noncommercial Short: ${assetData.Percentage_Noncommercial_Short}%
        Percentage Commercial Long: ${assetData.Percentage_Commercial_Long}%
        Percentage Commercial Short: ${assetData.Percentage_Commercial_Short}%
        
        The COT report shows the positions of different types of traders in the futures market. Commercial traders are typically hedgers who use futures to reduce risk from their business operations. Non-commercial traders are typically large speculators like hedge funds and financial institutions.
        
        Please provide:
        1. A concise analysis of the current positioning (are speculators bullish or bearish?)
        2. What this might suggest about the economic outlook for this currency/asset
        3. Any potential market implications
        
        Keep the response under 300 words and focus on the practical implications for traders and investors.
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
      const data = await fetchCotData(currencyInfo.asset);
      if (data) {
        generateAiSummary(data, currency);
      }
    }
  };

  // Toggle summary visibility
  const toggleSummary = () => {
    setSummaryVisible(!summaryVisible);
  };

  // Refresh data
  const refreshData = () => {
    if (selectedCurrency) {
      handleCurrencySelect(selectedCurrency);
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
        <p className="econ-subheader">Select a currency to get economic insights based on COT reports</p>
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

          <div className="ai-summary-container">
            <div className="summary-header" onClick={toggleSummary}>
              <h6>Economic Analysis</h6>
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

        .econ-header h2 {
          color: #2c3e50;
          margin-bottom: 5px;
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

        .cot-data {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .cot-data h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 10px;
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

        .ai-summary-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #f8f9fa;
          cursor: pointer;
          border-bottom: 1px solid #e9ecef;
        }

        .summary-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .ai-summary {
          padding: 15px;
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