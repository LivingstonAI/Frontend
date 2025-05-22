import React, { useState, useEffect } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";

export default function TraderGPTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
  const baseUrl = "https://backend-production-c0ab.up.railway.app";

  
  const fetchAPIKey = async () => {
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
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);
  
  
  const [traderSettings, setTraderSettings] = useState({
    trader1: {
      asset: 'EURUSD',
      interval: '1h',
      numDays: 7,
      style: 'Conservative',
      focus: 'long-term trends and fundamental analysis',
      risk_tolerance: 'low',
    },
    trader2: {
      asset: 'EURUSD',
      interval: '1h',
      numDays: 7,
      style: 'Aggressive',
      focus: 'short-term momentum and technical patterns',
      risk_tolerance: 'high',
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

  const tradingStyles = [
    { value: 'Conservative', label: 'Conservative' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Aggressive', label: 'Aggressive' }
  ];

  const tradingFocus = [
    { value: 'long-term trends and fundamental analysis', label: 'Long-term & Fundamental' },
    { value: 'medium-term technical and fundamental mix', label: 'Medium-term Mixed' },
    { value: 'short-term momentum and technical patterns', label: 'Short-term Technical' }
  ];

  const riskTolerances = [
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' }
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

  const extractCurrenciesFromPair = (pair) => {
    const forexPairsMap = {
      'EURUSD': ['EUR', 'USD'],
      'GBPUSD': ['GBP', 'USD'],
      'USDJPY': ['USD', 'JPY'],
      'AUDUSD': ['AUD', 'USD'],
      'USDCHF': ['USD', 'CHF'],
      'NZDUSD': ['NZD', 'USD'],
      'USDCAD': ['USD', 'CAD'],
      'EURJPY': ['EUR', 'JPY'],
      'GBPJPY': ['GBP', 'JPY']
    };
    
    return forexPairsMap[pair] || [pair.slice(0, 3), pair.slice(3, 6)];
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
        // Get the last index dynamically
        const lastIndex = data.conversation.length - 1;
        console.log(data.conversation[lastIndex].content.analysis);
        const json_analysis = data.conversation[lastIndex].content.analysis;

        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: `Style this json into a more readable format. 
                  Include emojis and no markdowns.

                   
                  Presentation Instructions:
                - AVOID USING ASTERISKS, HASHTAGS, OR MARKDOWN FORMATTING
                - Use subtle emojis sparingly for visual emphasis 📊
                - Ensure a structured, professional presentation
                - Highlight economic events and fundamental analysis integration
                - Show how technical and fundamental factors align

                  
                  Json: 
                  ${json_analysis}

                  `,
                },
                { role: "user", content: `Generate a styled version of this json: ${json_analysis}` },
              ],
            }),
          });
          const data2 = await response.json();
          console.log(data2.choices[0].message.content);
          const new_styled_analysis = data2.choices[0].message.content;
          
          // Replace the original analysis with the styled one
          data.conversation[lastIndex].content.analysis = new_styled_analysis;
          
          setAnalysis(data);
        } catch (error) {
          console.error("Error:", error);
          // If styling fails, still set the analysis with the original data
          setAnalysis(data);
        }
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

  const renderTraderForm = (traderId) => {
    return (
      <div className="analysis-card">
        <h6 className="card-title">
          {traderId === 'trader1' ? 'TraderGPT 1' : 'TraderGPT 2'} Settings
        </h6>
        
        <div className="settings-group market-settings">
          <h6>Market Settings</h6>
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

        <div className="settings-group personality-settings">
          <h6>Personality Settings</h6>
          <div className="form-grid">
            <select
              value={traderSettings[traderId].style}
              onChange={(e) => handleSettingChange(traderId, 'style', e.target.value)}
              className="form-control"
            >
              {tradingStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>

            <select
              value={traderSettings[traderId].focus}
              onChange={(e) => handleSettingChange(traderId, 'focus', e.target.value)}
              className="form-control"
            >
              {tradingFocus.map((focus) => (
                <option key={focus.value} value={focus.value}>
                  {focus.label}
                </option>
              ))}
            </select>

            <select
              value={traderSettings[traderId].risk_tolerance}
              onChange={(e) => handleSettingChange(traderId, 'risk_tolerance', e.target.value)}
              className="form-control"
            >
              {riskTolerances.map((risk) => (
                <option key={risk.value} value={risk.value}>
                  {risk.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Economic Events Preview */}
        <div className="economic-events-preview">
          <div className="economic-events-header">
            <span className="economic-icon">📊</span>
            <span className="economic-title">Economic Events Included</span>
          </div>
          <div className="economic-currencies">
            Analysis will include economic events for: {extractCurrenciesFromPair(traderSettings[traderId].asset).join(' & ')}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (msg) => {
    try {
      const content = formatContent(msg.content);
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      return (
        <div className="message-section">
          {contentObj.analysis && (
            <div>
              <h6>Analysis:</h6>
              <div className="analysis-text">
                {contentObj.analysis}
              </div>
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
            <div className="trader-analysis-container">
              <div className="analysis-card">
                <div className="card-header">
                  <h5 className="card-title">TraderGPT Analysis</h5>
                  <p className="card-subtitle">
                    Enhanced with Economic Events & Fundamental Analysis
                  </p>
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
                  {loading ? (
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      Analyzing Market & Economic Data...
                    </div>
                  ) : (
                    'Generate Enhanced Analysis'
                  )}
                </button>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                {analysis && (
                  <div className="analysis-results">
                    {/* Analysis Summary */}
                    {analysis.economic_events_included && (
                      <div className="economic-summary">
                        <div className="economic-summary-header">
                          <span className="success-icon">✅</span>
                          <span className="success-title">Economic Events Integrated</span>
                        </div>
                        <div className="economic-summary-content">
                          {analysis.currencies_analyzed && analysis.currencies_analyzed.map((curr, idx) => (
                            <div key={idx} className="currency-info">
                              {curr.pair}: {curr.base_currency} & {curr.quote_currency} economic events included
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                            <div className="trader-info">
                              <span className="trader-id">
                                {msg.trader_id}
                                {msg.message_type === 'consensus' && ' - Final Decision'}
                              </span>
                              {msg.responding_to && (
                                <span className="responding-to">
                                  Responding to {msg.responding_to}
                                </span>
                              )}
                            </div>
                            {msg.settings && (
                              <div className="trader-settings-info">
                                {msg.settings.asset} • {msg.settings.interval} • {msg.settings.style} • {msg.settings.risk_tolerance} risk
                              </div>
                            )}
                          </div>
                          <div className="message-content">
                            {renderContent(msg)}
                          </div>
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
  );
}