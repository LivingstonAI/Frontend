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
  const plotRefs = useRef({});

  useEffect(() => {
    fetchBacktestResults();
  }, []);

  useEffect(() => {
    // Render plots for expanded results
    if (expandedResult && backtestData[expandedModel]?.results[expandedResult]?.has_plot) {
      const resultData = backtestData[expandedModel].results[expandedResult];
      const plotId = `plot-${expandedModel}-${expandedResult}`;
      const plotRef = plotRefs.current[plotId];
      
      if (plotRef && resultData.plot_json) {
        // Clear any existing plot
        while (plotRef.firstChild) {
          plotRef.removeChild(plotRef.firstChild);
        }
        
        try {
          const plotData = typeof resultData.plot_json === 'string' ? 
              JSON.parse(resultData.plot_json) : resultData.plot_json;
          
          // Delay rendering the plot slightly to allow the DOM to stabilize
          setTimeout(() => {
            embed.embed_item(plotData, plotId);
          }, 100);
        } catch (e) {
          console.error("Failed to render plot:", e);
        }
      }
    }
  }, [expandedResult, expandedModel, backtestData]);

  const fetchBacktestResults = async () => {
    setLoading(true);
    try {
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
      if (data.status === 'success') {
        setBacktestData(data.data);
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

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <h5 className="major-upcoming-news-events-header">Backtested Results</h5><br /><br />
          
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
                                    <h6>Performance Chart</h6>
                                    <div 
                                      id={`plot-${modelIndex}-${resultIndex}`}
                                      className="bk-root" 
                                      ref={el => {
                                        if (el) plotRefs.current[`plot-${modelIndex}-${resultIndex}`] = el;
                                      }}
                                    ></div>
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
    </div>
  );
}