import React, { useState } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';


export default function TraderGPTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    asset: 'EURUSD',
    interval: '1h',
    numDays: 7
  });

  const formatContent = (content) => {
    if (!content) return '';
    
    try {
      // If content is already an object, stringify it
      if (typeof content === 'object') {
        return JSON.stringify(content, null, 2);
      }
      
      // If content is a string containing JSON, parse and re-stringify it
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If parsing fails, return the original content
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
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      return (
        <div className="space-y-2">
          {contentObj.analysis && (
            <div>
              <h4 className="font-semibold">Analysis:</h4>
              <p className="text-gray-700">{contentObj.analysis}</p>
            </div>
          )}
          {contentObj.recommendation && (
            <div>
              <h4 className="font-semibold">Recommendation:</h4>
              <p className={`font-medium ${
                contentObj.recommendation === 'buy' ? 'text-green-600' :
                contentObj.recommendation === 'sell' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {contentObj.recommendation.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <pre className="whitespace-pre-wrap font-sans text-gray-700">{msg.content}</pre>;
    }
  };

  return (
    <div>
    <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info"></div>
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">TraderGPT Analysis</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Asset (e.g., EURUSD)"
            value={formData.asset}
            onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
            className="form-control w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          /><br />
          
          <select
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
            className="form-control w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select><br />
          
          <input
            type="number"
            placeholder="Number of days"
            value={formData.numDays}
            onChange={(e) => setFormData({ ...formData, numDays: parseInt(e.target.value) })}
            className="form-control w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div><br />
        
        <button 
          onClick={handleAnalysis} 
          disabled={loading}
          className="btn btn-primary w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
  
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
  
        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="w-full overflow-x-auto">
            <img 
              src={`data:image/png;base64,${analysis.chart_image}`}
              alt="Trading Analysis Chart"
              className="responsive-image"
            />

            </div>
            
            <div className="space-y-4">
              {analysis.conversation.map((msg, index) => (
                <div 
                  key={index}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <div className={`px-6 py-4 border-b ${
                    msg.message_type === 'consensus' ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-lg font-semibold ${
                      msg.message_type === 'consensus' ? 'text-green-700' : 'text-gray-800'
                    }`}>
                      {msg.trader_id}
                      {msg.responding_to && (
                        <span className="text-sm text-gray-500 ml-2 font-normal">
                          (Responding to {msg.responding_to})
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="px-6 py-4">
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
    </div>
  );
  
}