import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link } from "react-router-dom";

export default function PerformanceReview() {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [profitList, setProfitList] = useState([]);
    const [winRate, setWinRate] = useState(0);
    const [lossRate, setLossRate] = useState(0);
    const [overallReturn, setOverallReturn] = useState(0);
    const [strategyMetrics, setStrategyMetrics] = useState({});
    const [modelData, setModelData] = useState([]);
    const [assetSummary, setAssetSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(true);
    const [reflectionsSummary, setReflectionsSummary] = useState('');
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isReflectionsExpanded, setIsReflectionsExpanded] = useState(false);
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const initialEquity = 10000;

    useEffect(() => {
        async function fetchAssets() {
            try {
                const response = await axios.get(`${baseURL}/get-user-assets`);
                const assetList = response.data.message;
                setAssets(assetList);
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoadingAssets(false);
            }
        }

        fetchAssets();
    }, []);

    useEffect(() => {
        if (selectedAsset) {
            setLoading(true);
            async function fetchAssetData() {
                try {
                    const response = await axios.get(`${baseURL}/fetch-asset-data/${selectedAsset}`);
                    const data = response.data;
                    setProfitList(data.overall.profit_list);
                    setWinRate(data.overall.win_rate);
                    setLossRate(data.overall.loss_rate);
                    setOverallReturn(data.overall.overall_return);
                    setStrategyMetrics(data.strategy_metrics);
                } catch (error) {
                    console.error('Error fetching asset data:', error);
                } finally {
                    setLoading(false);
                }
            }

            async function fetchModelData() {
                try {
                    const response = await axios.get(`${baseURL}/fetch-asset-data-from-models/${selectedAsset}`);
                    const data = response.data.data;
                    setModelData(data);
                } catch (error) {
                    console.error('Error fetching model data:', error);
                }
            }

            setAssetSummary('');
            fetchAssetData();
            fetchModelData();
        }
    }, [selectedAsset]);

    const calculateEquityCurve = (profits) => {
        let equity = initialEquity;
        return profits.map(profit => {
            equity += profit;
            return equity;
        });
    };

    const equityCurve = calculateEquityCurve(profitList);

    const data = {
        labels: equityCurve.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Equity Curve',
                data: equityCurve,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    // Prepare bar chart data for model returns comparison
    const getBarChartData = () => {
        if (!modelData || modelData.length === 0) return null;

        const labels = modelData.map(model => `Model ${model.model_id}`);
        const returns = modelData.map(model => parseFloat(model.overall_return) || 0);
        
        // Create gradient colors for better visual appeal
        const backgroundColors = returns.map(returnValue => 
            returnValue >= 0 
                ? 'rgba(54, 162, 235, 0.7)'  // Blue for positive returns
                : 'rgba(255, 99, 132, 0.7)'  // Red for negative returns
        );
        
        const borderColors = returns.map(returnValue => 
            returnValue >= 0 
                ? 'rgba(54, 162, 235, 1)'    // Darker blue border
                : 'rgba(255, 99, 132, 1)'    // Darker red border
        );

        return {
            labels,
            datasets: [
                {
                    label: 'Overall Return',
                    data: returns,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        };
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            title: {
                display: true,
                text: 'Model Performance Comparison',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                color: '#2c3e50'
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Return: ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Overall Return',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Models',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    const barChartData = getBarChartData();

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Performance Review</h5>
                    <br />
                    <div className="performance-review-div">
                        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i className="bi bi-list"></i></button><br />
                        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Select Assets</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                {loadingAssets ? (
                                    <p>Loading assets...</p>
                                ) : (
                                    assets.map((asset, index) => (
                                        <p key={index} onClick={() => setSelectedAsset(asset)} className="performance-select-asset">
                                            {asset}
                                        </p>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedAsset && (
                        <div>
                            <h6 className="performance-review-header">Model Performance Review for <Link to={`https://www.tradingview.com/chart/IArp0yBw/?symbol=${selectedAsset}`} target="_blank" className="performance-review-header-tradingview">{selectedAsset.toUpperCase()}</Link></h6><br />
                            {loading ? (
                                <p>Loading data...</p>
                            ) : (
                                <div className="personal-asset-review">
                                    {/* Bar Chart for Model Returns Comparison */}
                                    {barChartData && (
                                        <div className="model-returns-comparison">
                                            <div className="bar-chart-container">
                                                <Bar data={barChartData} options={barChartOptions} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="model-performance-review-div">
                                        {modelData.map((model, index) => (
                                            <div key={index} className="chart-container">
                                                <h6 className="performance-review-header">Model ID: {model.model_id}</h6>
                                                <Line
                                                    data={{
                                                        labels: model.equity_curve.map((_, idx) => idx + 1),
                                                        datasets: [
                                                            {
                                                                label: 'Equity Curve',
                                                                data: model.equity_curve,
                                                                fill: false,
                                                                backgroundColor: 'rgba(75,192,192,0.6)',
                                                                borderColor: 'rgba(75,192,192,1)',
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        maintainAspectRatio: true,
                                                    }}
                                                />
                                                <div className="model-metrics">
                                                    <p>Win Rate: {model.win_rate}%</p>
                                                    <p>Loss Rate: {model.loss_rate}%</p>
                                                    <p>Overall Return: {model.overall_return}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <br />
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .model-returns-comparison {
                    margin-bottom: 30px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }

                .bar-chart-container {
                    height: 400px;
                    position: relative;
                }

                .chart-container {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                    border-left: 4px solid #007bff;
                }

                .model-metrics {
                    display: flex;
                    gap: 20px;
                    margin-top: 15px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                }

                .model-metrics p {
                    margin: 0;
                    font-weight: 600;
                    color: #495057;
                    font-size: 14px;
                }

                .performance-review-header {
                    color: #2c3e50;
                    font-weight: 600;
                    margin-bottom: 15px;
                }

                .performance-review-header-tradingview {
                    color: #007bff;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .performance-review-header-tradingview:hover {
                    color: #0056b3;
                    text-decoration: underline;
                }

                .personal-asset-review {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                    margin-top: 20px;
                }

                .model-performance-review-div {
                    display: grid;
                    gap: 20px;
                }

                @media (max-width: 768px) {
                    .model-metrics {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .bar-chart-container {
                        height: 300px;
                    }
                }
            `}</style>
        </div>
    );
}