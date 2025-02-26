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
          <h5 className="major-upcoming-news-events-header">Backtested Results</h5><br /><br />
          
          {/* Debug Panel (Toggle Button) */}
          <div className="debug-section">
            <button 
              className="btn btn-primary debug-toggle-btn"
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
              <button className='btn btn-primary' onClick={fetchBacktestResults}>Refresh Data</button>
              <div className="debug-info">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
              <div className="bokeh-status">
                <h6>Bokeh Status</h6>
                <p>Bokeh Version: {embed?.version || 'Unknown'}</p>
                <p>Embed Available: {typeof embed?.embed_item === 'function' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div><br />
          
          {loading ? (
            <div className="loading">Loading backtest results...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : backtestData.length === 0 ? (
            <div className="no-data">No backtest results found</div>
          ) : (
            <div className="backtest-models">
              {backtestData.map((modelData, modelIndex) => (
                <div key={modelIndex} className="backtest-model">
                  <div className="model-header-container">
                    <div 
                      className={`model-header ${expandedModel === modelIndex ? '' : ''}`}
                      onClick={() => handleModelClick(modelIndex)}
                    >
                      <div className="model-title">
                        {modelData.model_info.dataset} ({modelData.model_info.start_date} to {modelData.model_info.end_date})
                      </div>
                      <span className="expand-icon">
                        {expandedModel === modelIndex ? '▼' : '▶'}
                      </span>
                    </div>
                    
                    {/* Add Delete Button */}
                    <button 
                      className="delete-model-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBacktestModel(modelData.model_info.id);
                      }}
                      disabled={deleteInProgress}
                    >
                      {deleteInProgress ? 'Deleting...' : 'Delete Model'}
                    </button>
                  </div><br />
                  
                  {expandedModel === modelIndex && (
                    <div className="model-details">
                      <div className="model-info">
                        <p><strong>Initial Capital:</strong> ${modelData.model_info.initial_capital}</p>
                        <div className="code-snippet">
                          <p><strong>Strategy Code:</strong></p>
                          <pre className="code-content">{modelData.model_info.code_snippet}</pre>
                        </div>
                      </div>
                      
                      <h6>Backtest Results ({modelData.results.length})</h6><br />
                      
                      <div className="results-list">
                        {modelData.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="result-item">
                            <div 
                              className={`result-header ${expandedResult === resultIndex ? '' : ''}`}
                              onClick={() => handleResultClick(resultIndex)}
                            >
                              <div className="result-header-content">
                                <span className="result-date">Run on: {new Date(result.created_at).toLocaleString()}</span>
                                <div className="metrics-preview">
                                  <span>Return: {formatValue(result.return_percent, true)}</span>
                                  <span>Sharpe: {formatValue(result.sharpe_ratio)}</span>
                                  <span>Win Rate: {formatValue(result.win_rate, true)}</span>
                                </div>
                              </div>
                              <span className="expand-icon">
                                {expandedResult === resultIndex ? '▼' : '▶'}
                              </span>
                            </div><br />
                            
                            {expandedResult === resultIndex && (
                              <div className="result-details">
                                <div className="metrics-grid">
                                  <div className="metric-group">
                                    <h6>Performance</h6>
                                    <div className="metric">
                                      <span>Return:</span>
                                      <span>{formatValue(result.return_percent, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Buy & Hold Return:</span>
                                      <span>{formatValue(result.buy_hold_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Annual Return:</span>
                                      <span>{formatValue(result.annual_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Exposure Time:</span>
                                      <span>{formatValue(result.exposure_time, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Risk Metrics</h6>
                                    <div className="metric">
                                      <span>Sharpe Ratio:</span>
                                      <span>{formatValue(result.sharpe_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Sortino Ratio:</span>
                                      <span>{formatValue(result.sortino_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Calmar Ratio:</span>
                                      <span>{formatValue(result.calmar_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Volatility (Ann.):</span>
                                      <span>{formatValue(result.volatility_annual, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Drawdowns</h6>
                                    <div className="metric">
                                      <span>Max Drawdown:</span>
                                      <span>{formatValue(result.max_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown:</span>
                                      <span>{formatValue(result.avg_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Max Drawdown Duration:</span>
                                      <span>{result.max_drawdown_duration}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown Duration:</span>
                                      <span>{result.avg_drawdown_duration}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Trade Statistics</h6>
                                    <div className="metrics-scrollable">
                                      <div className="metric">
                                        <span>Number of Trades:</span>
                                        <span>{result.num_trades}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Win Rate:</span>
                                        <span>{formatValue(result.win_rate, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Best Trade:</span>
                                        <span>{formatValue(result.best_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Worst Trade:</span>
                                        <span>{formatValue(result.worst_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Avg Trade:</span>
                                        <span>{formatValue(result.avg_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Max Trade Duration:</span>
                                        <span>{result.max_trade_duration}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Avg Trade Duration:</span>
                                        <span>{result.avg_trade_duration}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Profit Factor:</span>
                                        <span>{formatValue(result.profit_factor)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Expectancy:</span>
                                        <span>{formatValue(result.expectancy, true)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div><br />
                                
                                {result.has_plot && (
                                  <div className="plot-container">
                                    <div className="plot-header">
                                      <h6>Performance Chart</h6>
                                      <button 
                                        className="retry-plot-btn"
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
        .debug-section {
          margin-bottom: 20px;
        }
        
        .debug-toggle-btn {
          border: 1px solid #ccc;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .debug-panel {
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          padding: 15px;
          margin-top: 10px;
          border-radius: 4px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .debug-info {
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          background-color: #eee;
          padding: 10px;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 10px;
        }
        
        .bokeh-status {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        
        .plot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .retry-plot-btn {
          background-color: rgb(12, 128, 236);
          border: 1px solid #ccc;
          padding: 3px 8px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 4px;
          color: white;
        }
        
        .plot-error {
          color: #d9534f;
          background-color: #f9f2f2;
          padding: 10px;
          margin-top: 10px;
          border-radius: 4px;
          border-left: 3px solid #d9534f;
        }
        
        .bk-root {
          min-height: 400px;
          border: 1px solid #eee;
          background-color: white;
          border-radius: 4px;
          padding: 10px;
        }
        
        /* New styles for delete functionality */
        .model-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-wrap: wrap; /* Allow wrapping on small screens */
        }
        
        .model-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          cursor: pointer;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
          min-width: 0; /* Allow text to be truncated */
          margin-right: 10px; /* Space for the delete button */
        }
        
        .model-title {
          white-space: normal; /* Allow text to wrap */
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word; /* Break long words if needed */
          flex: 1;
        }
        
        .delete-model-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          align-self: flex-start;
          margin-top: 10px; /* Space when wrapped to next line */
        }
        
        @media (min-width: 768px) {
          .delete-model-btn {
            margin-top: 0; /* Reset margin on larger screens */
          }
        }
        
        .delete-model-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .delete-model-btn:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        /* Code snippet improvements */
        .code-snippet {
          margin-top: 8px;
          position: relative;
        }
        
        .code-content {
          background-color: #f0f0f0;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          max-height: none; /* Remove the height limit to show all content */
          border: 1px solid #ddd;
          white-space: pre-wrap; /* Allow wrapping of long lines */
          word-break: break-word; /* Break long words if needed */
        }
        
        /* Result header improvements */
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          cursor: pointer;
          background-color: #f5f5f5;
          transition: background-color 0.2s;
          flex-wrap: wrap; /* Allow content to wrap on mobile */
        }
        
        .result-header-content {
          display: flex;
          flex-direction: column; /* Stack date and metrics vertically */
          flex: 1;
          min-width: 0; /* Allow content to be truncated */
        }
        
        .result-date {
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .metrics-preview {
          display: flex;
          flex-wrap: wrap; /* Allow metrics to wrap */
          gap: 10px; /* Space between metrics */
          color: #555;
          font-size: 13px;
        }
        
        /* Mobile improvements */
        @media (max-width: 767px) {
          .metrics-grid {
            grid-template-columns: 1fr; /* Single column on mobile */
          }
          
          .model-header-container {
            flex-direction: column;
          }
          
          .model-header {
            width: 100%;
            margin-right: 0;
            margin-bottom: 8px;
          }
          
          .delete-model-btn {
            align-self: flex-end;
          }
        }
        
        /* Make the metrics scrollable on mobile for Trade Statistics */
        .metrics-scrollable {
          max-height: 200px;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        /* Main wrapper responsive adjustments */
        .main-body-info {
          padding: 15px;
          overflow-x: hidden; /* Prevent horizontal scrolling */
        }
      `}</style>
    </div>
  );
}