import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { embed } from '@bokeh/bokehjs';

export default function BacktestedResults() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [backtestData, setBacktestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModel, setExpandedModel] = useState(null);
  const [expandedResult, setExpandedResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const plotRefs = useRef({});

  useEffect(() => {
    fetchBacktestResults();
  }, []);

  useEffect(() => {
    // Render plots for expanded results
    if (expandedResult !== null && expandedModel !== null && 
        backtestData[expandedModel]?.results[expandedResult]?.has_plot) {
      
      const resultData = backtestData[expandedModel].results[expandedResult];
      const plotId = `plot-${expandedModel}-${expandedResult}`;
      const plotRef = plotRefs.current[plotId];
      
      // Debug information collection
      const newDebugInfo = { 
        timestamp: new Date().toISOString(),
        plotId,
        hasPlotRef: !!plotRef,
        hasPlotJSON: !!resultData.plot_json,
        plotJSONType: typeof resultData.plot_json,
        plotJSONLength: typeof resultData.plot_json === 'string' ? 
          resultData.plot_json.length : 'not a string'
      };
      
      setDebugInfo(prev => ({ ...prev, [plotId]: newDebugInfo }));
      
      if (plotRef && resultData.plot_json) {
        console.log(`Attempting to render plot ${plotId}`);
        
        // Clear any existing plot
        while (plotRef.firstChild) {
          plotRef.removeChild(plotRef.firstChild);
        }
        
        try {
          let plotData;
          
          // Safely parse the plot JSON if it's a string
          if (typeof resultData.plot_json === 'string') {
            try {
              plotData = JSON.parse(resultData.plot_json);
              console.log(`Successfully parsed plot JSON for ${plotId}`);
            } catch (parseError) {
              console.error(`JSON parse error for ${plotId}:`, parseError);
              setDebugInfo(prev => ({ 
                ...prev, 
                [plotId]: { ...prev[plotId], parseError: parseError.message, jsonSample: resultData.plot_json.substring(0, 100) + '...' } 
              }));
              return;
            }
          } else {
            plotData = resultData.plot_json;
          }
          
          // Validate that plotData has the expected structure
          if (!plotData || !plotData.doc || !plotData.doc.roots) {
            console.error(`Invalid plot data format for ${plotId}`, plotData);
            setDebugInfo(prev => ({ 
              ...prev, 
              [plotId]: { ...prev[plotId], error: 'Invalid plot data format', plotDataKeys: Object.keys(plotData || {}).join(', ') } 
            }));
            return;
          }
          
          // Delay rendering the plot slightly to allow the DOM to stabilize
          setTimeout(() => {
            try {
              console.log(`Embedding plot ${plotId}`);
              embed.embed_item(plotData, plotId);
              console.log(`Successfully embedded plot ${plotId}`);
              setDebugInfo(prev => ({ ...prev, [plotId]: { ...prev[plotId], status: 'success' } }));
            } catch (embedError) {
              console.error(`Embedding error for ${plotId}:`, embedError);
              setDebugInfo(prev => ({ 
                ...prev, 
                [plotId]: { ...prev[plotId], embedError: embedError.message } 
              }));
            }
          }, 300); // Increased delay for DOM stability
        } catch (e) {
          console.error(`Failed to render plot ${plotId}:`, e);
          setDebugInfo(prev => ({ 
            ...prev, 
            [plotId]: { ...prev[plotId], generalError: e.message } 
          }));
        }
      }
    }
  }, [expandedResult, expandedModel, backtestData]);

  const fetchBacktestResults = async () => {
    setLoading(true);
    try {
      console.log('Fetching backtest results...');
      const response = await fetch(`${baseUrl}/fetch-backtested-results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backtest data received:', data.status);
      
      if (data.status === 'success') {
        // Preprocess the data to ensure plot_json is properly formatted
        const processedData = data.data.map(model => ({
          ...model,
          results: model.results.map(result => ({
            ...result,
            has_plot: !!result.plot_json, // Ensure has_plot is set correctly based on actual presence of plot_json
          }))
        }));
        
        setBacktestData(processedData);
        console.log(`Loaded ${processedData.length} backtest models`);
      } else {
        setError(data.message || 'Failed to fetch backtest results');
      }
    } catch (error) {
      setError(`Error fetching backtest results: ${error.message}`);
      console.error('Error fetching backtest results:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBacktestModel = async (modelId) => {
    // Prevent multiple delete operations at once
    if (deleteInProgress) return;
    
    if (!window.confirm('Are you sure you want to delete this model and all associated results?')) {
      return;
    }
    
    setDeleteInProgress(true);
    
    try {
      console.log(`Deleting backtest model ${modelId}...`);
      const response = await fetch(`${baseUrl}/delete-backtest-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
        body: JSON.stringify({ model_id: modelId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        console.log('Model deleted successfully');
        // If the model was expanded, close it
        if (expandedModel !== null) {
          setExpandedModel(null);
          setExpandedResult(null);
        }
        // Refresh the data
        fetchBacktestResults();
      } else {
        setError(data.message || 'Failed to delete backtest model');
        console.error('Failed to delete backtest model:', data.message);
      }
    } catch (error) {
      setError(`Error deleting backtest model: ${error.message}`);
      console.error('Error deleting backtest model:', error);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const handleModelClick = (index) => {
    setExpandedModel(expandedModel === index ? null : index);
    setExpandedResult(null); // Close any expanded result when toggling model
  };

  const handleResultClick = (index) => {
    setExpandedResult(expandedResult === index ? null : index);
  };

  const formatValue = (value, isPercentage = false) => {
    if (typeof value === 'number') {
      return isPercentage 
        ? `${value.toFixed(2)}%` 
        : value.toFixed(2);
    }
    return value;
  };

  // Function to manually retry rendering a plot
  const retryRenderPlot = (modelIndex, resultIndex) => {
    if (backtestData[modelIndex]?.results[resultIndex]?.has_plot) {
      const plotId = `plot-${modelIndex}-${resultIndex}`;
      console.log(`Manually retrying plot render for ${plotId}`);
      
      // Force re-render by temporarily changing state
      setExpandedResult(null);
      setTimeout(() => {
        setExpandedResult(resultIndex);
      }, 100);
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
          <h5 className="major-upcoming-news-events-header">Backtested Results</h5>
          <br />
          
          {/* Debug Panel (Toggle Button) */}
          <div className="debug-section">
            <button 
              className="debug-toggle-btn"
              onClick={() => {
                const debugPanel = document.getElementById('plot-debug-panel');
                if (debugPanel) {
                  debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
                }
              }}
            >
              Toggle Debug Panel
            </button>
            
            {/* Debug Information Display */}
            <div id="plot-debug-panel" className="debug-panel" style={{ display: 'none' }}>
              <h6>Debug Information</h6>
              <button className='refresh-btn' onClick={fetchBacktestResults}>Refresh Data</button>
              <div className="debug-info">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
              <div className="bokeh-status">
                <h6>Bokeh Status</h6>
                <p>Bokeh Version: {embed?.version || 'Unknown'}</p>
                <p>Embed Available: {typeof embed?.embed_item === 'function' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading backtest results...</p>
            </div>
          ) : error ? (
            <div className="error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : backtestData.length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <p>No backtest results found</p>
            </div>
          ) : (
            <div className="backtest-models">
              {backtestData.map((modelData, modelIndex) => (
                <div key={modelIndex} className="backtest-model">
                  <div className="model-header-container">
                    <div 
                      className={`model-header ${expandedModel === modelIndex ? 'expanded' : ''}`}
                      onClick={() => handleModelClick(modelIndex)}
                    >
                      <p className="model-title">
                        {modelData.model_info.dataset} ({modelData.model_info.start_date} to {modelData.model_info.end_date})
                      </p>
                      <span className="expand-icon">
                        {expandedModel === modelIndex ? '▼' : '▶'}
                      </span>
                    </div>
                    
                    <button 
                      className="delete-model-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBacktestModel(modelData.model_info.id);
                      }}
                      disabled={deleteInProgress}
                    >
                      {deleteInProgress ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  
                  {expandedModel === modelIndex && (
                    <div className="model-details">
                      <div className="model-info">
                        <p><strong>Initial Capital:</strong> ${modelData.model_info.initial_capital}</p>
                        <div className="code-snippet">
                          <p><strong>Strategy Code:</strong></p>
                          <pre>{modelData.model_info.code_snippet}</pre>
                         

                        </div>
                      </div>
                      
                      <h6 className="results-heading">Backtest Results ({modelData.results.length})</h6>
                      
                      <div className="results-list">
                        {modelData.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="result-item">
                            <div 
                              className={`result-header ${expandedResult === resultIndex ? 'expanded' : ''}`}
                              onClick={() => handleResultClick(resultIndex)}
                            >
                              <span className="result-date">Run on: {new Date(result.created_at).toLocaleString()}</span>
                              <span className="metrics-preview">
                                <span className="metric-badge">Return: {formatValue(result.return_percent, true)}</span>
                                <span className="metric-badge">Sharpe: {formatValue(result.sharpe_ratio)}</span>
                                <span className="metric-badge">Win Rate: {formatValue(result.win_rate, true)}</span>
                              </span>
                              <span className="expand-icon">
                                {expandedResult === resultIndex ? '▼' : '▶'}
                              </span>
                            </div>
                            
                            {expandedResult === resultIndex && (
                              <div className="result-details">
                                <div className="metrics-grid">
                                  <div className="metric-group">
                                    <h6>Performance</h6>
                                    <div className="metric">
                                      <span>Return:</span>
                                      <span className="metric-value">{formatValue(result.return_percent, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Buy & Hold Return:</span>
                                      <span className="metric-value">{formatValue(result.buy_hold_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Annual Return:</span>
                                      <span className="metric-value">{formatValue(result.annual_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Exposure Time:</span>
                                      <span className="metric-value">{formatValue(result.exposure_time, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Risk Metrics</h6>
                                    <div className="metric">
                                      <span>Sharpe Ratio:</span>
                                      <span className="metric-value">{formatValue(result.sharpe_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Sortino Ratio:</span>
                                      <span className="metric-value">{formatValue(result.sortino_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Calmar Ratio:</span>
                                      <span className="metric-value">{formatValue(result.calmar_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Volatility (Ann.):</span>
                                      <span className="metric-value">{formatValue(result.volatility_annual, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Drawdowns</h6>
                                    <div className="metric">
                                      <span>Max Drawdown:</span>
                                      <span className="metric-value">{formatValue(result.max_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown:</span>
                                      <span className="metric-value">{formatValue(result.avg_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Max Drawdown Duration:</span>
                                      <span className="metric-value">{result.max_drawdown_duration}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown Duration:</span>
                                      <span className="metric-value">{result.avg_drawdown_duration}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Trade Statistics</h6>
                                    <div className="metric">
                                      <span>Number of Trades:</span>
                                      <span className="metric-value">{result.num_trades}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Win Rate:</span>
                                      <span className="metric-value">{formatValue(result.win_rate, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Best Trade:</span>
                                      <span className="metric-value">{formatValue(result.best_trade, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Worst Trade:</span>
                                      <span className="metric-value">{formatValue(result.worst_trade, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Trade:</span>
                                      <span className="metric-value">{formatValue(result.avg_trade, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Max Trade Duration:</span>
                                      <span className="metric-value">{result.max_trade_duration}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Trade Duration:</span>
                                      <span className="metric-value">{result.avg_trade_duration}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Profit Factor:</span>
                                      <span className="metric-value">{formatValue(result.profit_factor)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Expectancy:</span>
                                      <span className="metric-value">{formatValue(result.expectancy, true)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {result.has_plot && (
                                  <div className="plot-container">
                                    <div className="plot-header">
                                      <h6>Performance Chart</h6>
                                      <button 
                                        className="btn btn-primary retry-plot-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          retryRenderPlot(modelIndex, resultIndex);
                                        }}
                                      >
                                        Retry Loading Plot
                                      </button>
                                    </div>
                                    <div 
                                      id={`plot-${modelIndex}-${resultIndex}`}
                                      className="bk-root" 
                                      ref={el => {
                                        if (el) plotRefs.current[`plot-${modelIndex}-${resultIndex}`] = el;
                                      }}
                                    ></div>
                                    {debugInfo[`plot-${modelIndex}-${resultIndex}`]?.generalError && (
                                      <div className="plot-error">
                                        Error rendering plot. Check debug panel for details.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .main-body-info {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .major-upcoming-news-events-header {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 24px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 12px;
        }
        
        /* Debug Panel Styles */
        .debug-section {
          margin-bottom: 24px;
        }
        
        .debug-toggle-btn {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #555;
        }
        
        .debug-toggle-btn:hover {
          background-color: #e0e0e0;
        }
        
        .debug-panel {
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
          margin-top: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          max-height: 400px;
          overflow-y: auto;
        }
        
        .debug-panel h6 {
          margin-top: 0;
          margin-bottom: 12px;
          font-weight: 600;
          color: #333;
        }
        
        .refresh-btn {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
          margin-bottom: 12px;
        }
        
        .refresh-btn:hover {
          background-color: #3a7bc8;
        }
        
        .debug-info {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          background-color: #eee;
          padding: 12px;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 12px;
          white-space: pre-wrap;
          border: 1px solid #ddd;
        }
        
        .bokeh-status {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #ddd;
        }
        
        .bokeh-status h6 {
          margin-top: 0;
          margin-bottom: 8px;
        }
        
        .bokeh-status p {
          margin: 4px 0;
          font-size: 14px;
          color: #555;
        }
        
        /* Loading, Error and No Data States */
        .loading, .error, .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background-color: #f9f9f9;
          border-radius: 8px;
          margin-top: 24px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      
        
        .loading p, .error p, .no-data p {
          margin: 0;
          font-size: 16px;
          color: #555;
        }
        
        .error {
          background-color: #fff8f8;
          border-left: 4px solid #e74c3c;
        }
        
        .error-icon, .no-data-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
        
        /* Backtest Models Styles */
        .backtest-models {
          margin-top: 24px;
        }
        
        .backtest-model {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
        }
        
        .model-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding-right: 8px;
        }
        
        .model-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #f9f9f9;
          cursor: pointer;
          flex-grow: 1;
          transition: background-color 0.2s;
          border-bottom: 1px solid transparent;
        }
        
        .model-header:hover {
          background-color: #f0f0f0;
        }
        
        .model-header.expanded {
          background-color: #f0f0f0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .model-title {
          margin: 0;
          font-weight: 500;
          color: #333;
          font-size: 16px;
        }
        
        .expand-icon {
          color: #666;
          font-size: 14px;
          transition: transform 0.2s;
        }
        
        .model-header.expanded .expand-icon {
          transform: rotate(0deg);
        }
        
        .delete-model-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
          margin-left: 8px;
        }
        
        .delete-model-btn:hover:not(:disabled) {
          background-color: #c0392b;
        }
        
        .delete-model-btn:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
        
        .model-details {
          padding: 24px;
        }
        
        .model-info {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          border: 1px solid #eee;
        }
        
        .model-info p {
          margin: 0 0 12px 0;
          color: #333;
        }
        
        .code-snippet {
          margin-top: 12px;
        }
        
        .code-snippet p {
          margin: 0 0 8px 0;
        }
        
        .code-snippet pre {
          background-color: #f0f0f0;
          padding: 12px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          overflow-x: auto;
          
          border: 1px solid #ddd;
          margin: 0;
          white-space: pre-wrap;
          color: #333;
        }
        
        .results-heading {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
        
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .result-item {
          background-color: #fff;
          border-radius: 6px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background-color: #f5f5f5;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .result-header:hover {
          background-color: #ececec;
        }
        
        .result-header.expanded {
          background-color: #e8e8e8;
          border-bottom: 1px solid #ddd;
        }
        
        .result-date {
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }
        
        .metrics-preview {
          display: flex;
          gap: 8px;
        }
        
        .metric-badge {
          background-color: #e8f4fd;
          color: #2c82c9;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          display: inline-block;
        }
        
        .result-details {
          padding: 20px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .metric-group {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #eee;
}
`
}</style>
        
</div>
  );
}