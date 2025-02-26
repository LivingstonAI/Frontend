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
              <button onClick={fetchBacktestResults}>Refresh Data</button>
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
            <div className="loading">Loading backtest results...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : backtestData.length === 0 ? (
            <div className="no-data">No backtest results found</div>
          ) : (
            <div className="backtest-models">
              {backtestData.map((modelData, modelIndex) => (
                <div key={modelIndex} className="backtest-model">
                  <div 
                    className={`model-header ${expandedModel === modelIndex ? 'expanded' : ''}`}
                    onClick={() => handleModelClick(modelIndex)}
                  >
                    <h6>
                      {modelData.model_info.dataset} ({modelData.model_info.start_date} to {modelData.model_info.end_date})
                    </h6>
                    <span className="expand-icon">
                      {expandedModel === modelIndex ? '▼' : '▶'}
                    </span>
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
                      
                      <h6>Backtest Results ({modelData.results.length})</h6>
                      
                      <div className="results-list">
                        {modelData.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="result-item">
                            <div 
                              className={`result-header ${expandedResult === resultIndex ? 'expanded' : ''}`}
                              onClick={() => handleResultClick(resultIndex)}
                            >
                              <span>Run on: {new Date(result.created_at).toLocaleString()}</span>
                              <span className="metrics-preview">
                                Return: {formatValue(result.return_percent, true)} | 
                                Sharpe: {formatValue(result.sharpe_ratio)} | 
                                Win Rate: {formatValue(result.win_rate, true)}
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

      {/* Add CSS for new debug elements */}
      <style jsx>{`
        .debug-section {
          margin-bottom: 20px;
        }
        
        .debug-toggle-btn {
          background-color: #f0f0f0;
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
          background-color: #e0e0e0;
          border: 1px solid #ccc;
          padding: 3px 8px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 4px;
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
      `}</style>
    </div>
  );
}