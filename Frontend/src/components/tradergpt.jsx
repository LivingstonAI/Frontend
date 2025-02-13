import React, { useState } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";


export default function TraderGPTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    asset: 'EURUSD',
    interval: '1h',
    numDays: 7
  });

  const [expanded, setExpanded] = useState(false);

  // Define forex pairs
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
          asset: formData.asset,
          interval: formData.interval,
          num_days: parseInt(formData.numDays)
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

  const renderContent = (msg) => {
    try {
      const content = formatContent(msg.content);
      let contentObj = typeof content === "string" ? JSON.parse(content) : content;
  
      console.log("Parsed Content Object:", contentObj);
      console.log("Message Type:", msg.message_type);
  
      // Ensure analysis is properly formatted JSON
      if (typeof contentObj.analysis === "string") {
        console.log("Raw analysis before parsing:", contentObj.analysis);
  
        // Fix common JSON format issues
        let fixedAnalysis = contentObj.analysis.replace(/'/g, '"'); // Convert single to double quotes
  
        // Extract only JSON-like content
        const jsonMatch = fixedAnalysis.match(/\{.*\}|\[.*\]/s); // Extracts JSON-like structures
  
        if (jsonMatch) {
          try {
            contentObj.analysis = JSON.parse(jsonMatch[0]); // Parse only extracted JSON
          } catch (e) {
            console.error("Final JSON parsing error:", e);
          }
        } else {
          console.error("No valid JSON found in analysis!");
        }
      }
  
      if (msg.message_type === "consensus") {
        return (
          <div className="consensus-message">
            <h3 className="consensus-title">Consensus Summary</h3>
  
            {contentObj.analysis.key_support_levels && (
              <div className="consensus-section">
                <strong>🔹 Key Support Levels:</strong> {contentObj.analysis.key_support_levels.join(", ")}
              </div>
            )}
  
            {contentObj.analysis.key_resistance_levels && (
              <div className="consensus-section">
                <strong>🔺 Key Resistance Levels:</strong> {contentObj.analysis.key_resistance_levels.join(", ")}
              </div>
            )}
  
            {contentObj.analysis.suggested_entry_price && (
              <div className="consensus-section">
                <strong>📈 Suggested Entry Price:</strong> {contentObj.analysis.suggested_entry_price}
              </div>
            )}
  
            {contentObj.analysis.stop_loss_level && (
              <div className="consensus-section">
                <strong>⛔ Stop Loss Level:</strong> {contentObj.analysis.stop_loss_level}
              </div>
            )}
  
            {contentObj.analysis.target_price && (
              <div className="consensus-section">
                <strong>🎯 Target Price:</strong> {contentObj.analysis.target_price}
              </div>
            )}
  
            {contentObj.analysis.overall_trend_direction && (
              <div className="consensus-section">
                <strong>📊 Overall Trend Direction:</strong> {contentObj.analysis.overall_trend_direction.toUpperCase()}
              </div>
            )}
  
            {contentObj.analysis.points_of_agreement && (
              <div className="consensus-section">
                <strong>✅ Points of Agreement:</strong>
                <ul>
                  {contentObj.analysis.points_of_agreement.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
  
            {contentObj.analysis.balancing_different_risk_tolerances && (
              <div className="consensus-section">
                <strong>⚖️ Risk Tolerance Balancing:</strong>
                <p>{contentObj.analysis.balancing_different_risk_tolerances}</p>
              </div>
            )}
  
            {contentObj.analysis.final_recommendation && (
              <div className="consensus-section">
                <strong>📢 Final Recommendation:</strong>
                <p className="recommendation">{contentObj.analysis.final_recommendation}</p>
              </div>
            )}
  
            {contentObj.analysis.risk_management_suggestions && (
              <div className="consensus-section">
                <strong>🚨 Risk Management Suggestions:</strong>
                <p>{contentObj.analysis.risk_management_suggestions}</p>
              </div>
            )}
          </div>
        );
      }
  
      // Default message rendering for other messages (analysis, recommendations)
      return (
        <div className="message-section">
          {contentObj.analysis && (
            <div>
              <h4>Analysis:</h4>
              <p>{contentObj.analysis}</p>
            </div>
          )}
          {contentObj.recommendation && (
            <div>
              <h4>Recommendation:</h4>
              <p className={`recommendation ${contentObj.recommendation.toUpperCase()}`}>
                {contentObj.recommendation.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      );
    } catch (e) {
      console.error("renderContent Error:", e);
      return <pre className="message-content-raw">{msg.content}</pre>;
    }
  };
  
  

  return (
    <div className="app-container">
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="trader-analysis-container">
          <div className="analysis-card">
            <div className="card-header">
              <h2 className="card-title">TraderGPT Analysis</h2>
            </div>

            <div className="form-grid">
              <select
                value={formData.asset}
                onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                className="form-control"
              >
                {forexPairs.map((pair) => (
                  <option key={pair.value} value={pair.value}>
                    {pair.label}
                  </option>
                ))}
              </select>

              <select
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                className="form-control"
              >
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
              </select>

              <input
                type="number"
                placeholder="Number of days"
                value={formData.numDays}
                onChange={(e) => setFormData({ ...formData, numDays: parseInt(e.target.value) })}
                className="form-control"
              />
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
  );
}