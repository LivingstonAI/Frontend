import React, { useState, useEffect } from 'react';

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

  const renderTraderForm = (traderId) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h6 className="text-lg font-semibold mb-4 text-gray-800">
        {traderId === 'trader1' ? 'TraderGPT 1' : 'TraderGPT 2'} Settings
      </h6>
      
      <div className="mb-6">
        <h6 className="text-md font-medium mb-3 text-gray-700">Market Settings</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={traderSettings[traderId].asset}
            onChange={(e) => handleSettingChange(traderId, 'asset', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="30"
          />
        </div>
      </div>

      <div className="mb-4">
        <h6 className="text-md font-medium mb-3 text-gray-700">Personality Settings</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={traderSettings[traderId].style}
            onChange={(e) => handleSettingChange(traderId, 'style', e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <div className="flex items-center mb-2">
          <span className="text-blue-600 mr-2">📊</span>
          <span className="text-sm font-medium text-blue-800">Economic Events Included</span>
        </div>
        <div className="text-xs text-blue-600">
          Analysis will include economic events for: {extractCurrenciesFromPair(traderSettings[traderId].asset).join(' & ')}
        </div>
      </div>
    </div>
  );
}

  const renderContent = (msg) => {
    try {
      const content = formatContent(msg.content);
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      return (
        <div className="space-y-4">
          {contentObj.analysis && (
            <div>
              <h6 className="font-semibold text-gray-800 mb-2">Analysis:</h6>
              <div className="text-gray-700 whitespace-pre-wrap">
                {contentObj.analysis}
              </div>
            </div>
          )}
          {contentObj.recommendation && (
            <div>
              <h6 className="font-semibold text-gray-800 mb-2">Recommendation:</h6>
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                contentObj.recommendation.toLowerCase() === 'buy' 
                  ? 'bg-green-100 text-green-800' 
                  : contentObj.recommendation.toLowerCase() === 'sell'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {contentObj.recommendation.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <pre className="text-sm text-gray-600 whitespace-pre-wrap">{msg.content}</pre>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h5 className="text-xl font-bold text-white">TraderGPT Analysis</h5>
              <p className="text-blue-100 text-sm mt-1">
                Enhanced with Economic Events & Fundamental Analysis
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {renderTraderForm('trader1')}
                {renderTraderForm('trader2')}
              </div>

              <button 
                onClick={handleAnalysis} 
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Market & Economic Data...
                  </div>
                ) : (
                  'Generate Enhanced Analysis'
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="mt-8 space-y-6">
                  {/* Analysis Summary */}
                  {analysis.economic_events_included && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-green-600 mr-2">✅</span>
                        <span className="font-medium text-green-800">Economic Events Integrated</span>
                      </div>
                      <div className="text-sm text-green-700">
                        {analysis.currencies_analyzed && analysis.currencies_analyzed.map((curr, idx) => (
                          <div key={idx} className="mb-1">
                            {curr.pair}: {curr.base_currency} & {curr.quote_currency} economic events included
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={`data:image/png;base64,${analysis.chart_image}`}
                      alt="Trading Analysis Chart"
                      className={`w-full cursor-pointer transition-transform duration-200 ${expanded ? 'transform scale-105' : 'hover:transform hover:scale-102'}`}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </div>

                  <div className="space-y-4">
                    {analysis.conversation.map((msg, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className={`px-4 py-3 ${
                          msg.message_type === 'consensus' 
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                            : 'bg-gray-50 border-b border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {msg.trader_id}
                              {msg.message_type === 'consensus' && ' - Final Decision'}
                            </span>
                            {msg.responding_to && (
                              <span className="text-xs opacity-75">
                                Responding to {msg.responding_to}
                              </span>
                            )}
                          </div>
                          {msg.settings && (
                            <div className="text-xs mt-1 opacity-75">
                              {msg.settings.asset} • {msg.settings.interval} • {msg.settings.style} • {msg.settings.risk_tolerance} risk
                            </div>
                          )}
                        </div>
                        <div className="p-4">
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
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setExpanded(false)}
          >
            <img 
              src={`data:image/png;base64,${analysis.chart_image}`}
              alt="Expanded Chart"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );