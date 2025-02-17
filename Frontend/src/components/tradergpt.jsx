import React, { useState } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";


export default function TraderGPTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  
  const [traderSettings, setTraderSettings] = useState({
    trader1: {
      asset: 'EURUSD',
      interval: '1h',
      numDays: 7
    },
    trader2: {
      asset: 'EURUSD',
      interval: '1h',
      numDays: 7
    }
  });

  const forexPairs = [
    { value: 'EURUSD', label: 'EUR/USD - Euro/US Dollar' },
    { value: 'GBPUSD', label: 'GBP/USD - British Pound/US Dollar' },
    { value: 'USDJPY', label: 'USD/JPY - US Dollar/Japanese Yen' },
    { value: 'AUDUSD', label: 'AUD/USD - Australian Dollar/US Dollar' },
    { value: 'USDCHF', label: 'USD/CHF - US Dollar/Swiss Franc' },
    { value: 'NZDUSD', label: 'NZD/USD - New Zealand Dollar/US Dollar' },
    { value: 'USDCAD', label: 'USD/CAD - US Dollar/Canadian Dollar' },
    { value: 'EURJPY', label: 'EUR/JPY - Euro/Japanese Yen' },
    { value: 'GBPJPY', label: 'GBP/JPY - British Pound/Japanese Yen' }
  ];

  const handleSettingChange = (trader, field, value) => {
    setTraderSettings(prev => ({
      ...prev,
      [trader]: {
        ...prev[trader],
        [field]: value
      }
    }));
  };

  const formatContent = (content) => {
    if (!content) return '';
    try {
      if (typeof content === 'object') {
        return JSON.stringify(content, null, 2);
      }
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return content;
    }
  };

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://backend-production-c0ab.up.railway.app/api/trader-analysis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traders: traderSettings
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setAnalysis(data);
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to process analysis');
    } finally {
      setLoading(false);
    }
  };

  const renderTraderForm = (traderId) => (
    <div className="analysis-card">
      <h6 className="card-title">{traderId === 'trader1' ? 'TraderGPT 1' : 'TraderGPT 2'} Settings</h6>
      <div className="form-grid">
        <select
          value={traderSettings[traderId].asset}
          onChange={(e) => handleSettingChange(traderId, 'asset', e.target.value)}
          className="form-control"
        >
          {forexPairs.map((pair) => (
            <option key={pair.value} value={pair.value}>
              {pair.label}
            </option>
          ))}
        </select>

        <select
          value={traderSettings[traderId].interval}
          onChange={(e) => handleSettingChange(traderId, 'interval', e.target.value)}
          className="form-control"
        >
          <option value="5m">5 Minute</option>
          <option value="15m">15 Minute</option>
          <option value="1h">1 Hour</option>
          <option value="4h">4 Hours</option>
          <option value="1d">1 Day</option>
        </select>

        <input
          type="number"
          placeholder="Number of days"
          value={traderSettings[traderId].numDays}
          onChange={(e) => handleSettingChange(traderId, 'numDays', parseInt(e.target.value))}
          className="form-control"
          min="1"
          max="30"
        />
      </div>
    </div>
  );

  const renderContent = (msg) => {
    try {
      const content = formatContent(msg.content);
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      return (
        
        <div className="message-section">
          {contentObj.analysis && (
            <div>
              <h6>Analysis:</h6>
              <p>{contentObj.analysis}</p>
            </div>
          )}
          {contentObj.recommendation && (
            <div>
              <h6>Recommendation:</h6>
              <p className={`recommendation ${contentObj.recommendation.toLowerCase()}`}>
                {contentObj.recommendation.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <pre className="message-content-raw">{msg.content}</pre>;
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
                
    <div className="app-container">
      <div className="main-page-body">
        <div className="trader-analysis-container">
          <div className="analysis-card">
            <div className="card-header">
              <h5 className="card-title">TraderGPT Analysis</h5>
            </div>

            <div className="traders-form-container">
              {renderTraderForm('trader1')}
              {renderTraderForm('trader2')}
            </div>

            <button 
              onClick={handleAnalysis} 
              disabled={loading}
              className="analysis-button"
            >
              {loading ? 'Analyzing...' : 'Generate Analysis'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {analysis && (
              <div className="analysis-results">
                <div className="chart-container">
                  <img 
                    src={`data:image/png;base64,${analysis.chart_image}`}
                    alt="Trading Analysis Chart"
                    className={`responsive-image ${expanded ? 'expanded' : ''}`}
                    onClick={() => setExpanded(!expanded)}
                  />
                </div>

                <div className="conversation-container">
                  {analysis.conversation.map((msg, index) => (
                    <div key={index} className="message-container">
                      <div className={`message-header ${msg.message_type === 'consensus' ? 'consensus' : ''}`}>
                        <span className="trader-id">
                          {msg.trader_id}
                          {msg.responding_to && (
                            <span className="responding-to">
                              (Responding to {msg.responding_to})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="message-content">{renderContent(msg)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="overlay" onClick={() => setExpanded(false)}>
          <img 
            src={`data:image/png;base64,${analysis.chart_image}`}
            alt="Expanded Chart"
            className="expanded-image"
          />
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
}
