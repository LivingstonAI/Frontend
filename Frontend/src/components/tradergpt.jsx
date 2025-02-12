import React, { useState } from 'react';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function TraderGPTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    asset: 'EURUSD',
    interval: '1h',
    numDays: 7
  });

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-production-c0ab.up.railway.app/api/trader-analysis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: formData.asset,
          interval: formData.interval,
          num_days: formData.numDays
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setAnalysis(data);
      } else {
        console.error('Analysis failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="header">
                      <Header />
                  </div>
                  <div className="main-page-body">
                      <SideNavs />
                      <div className="main-body-info">
                 
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
        </div>
        
        <button 
          onClick={handleAnalysis} 
          disabled={loading}
          className="btn btn-primary w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Generate Analysis'}
        </button>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={`data:image/png;base64,${analysis.chart_image}`}
                alt="Trading Analysis Chart"
                className="w-full"
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
                    <pre className="whitespace-pre-wrap font-sans text-gray-700">
                      {typeof msg.content === 'string' 
                        ? msg.content 
                        : JSON.stringify(msg.content, null, 2)}
                    </pre>
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
    </div>
  );
}
