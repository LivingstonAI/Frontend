import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import * as d3 from 'd3';

export default function AccountAnalytics() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState("");
    const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
    const [summaryExpanded, setSummaryExpanded] = useState(true);
    const [sunburstData, setSunburstData] = useState(null);
    const [filters, setFilters] = useState({
        dayOfWeek: 'all',
        tradingSession: 'all',
        strategy: 'all',
        outcome: 'all',
        asset: 'all',
        timeFrame: 'all',
        selectedPeriod: 'all'
    });

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchAccountDataFromAPI = async () => {
        const accountName = Cookies.get('account_name');
        
        if (!accountName) {
            console.error('Account name not found');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/get-trading-analytics?account_name=${accountName}`);
            const data = await response.json();
            if (response.ok) {
                // Parse date_entered strings into Date objects
                data.trades = data.trades.map(trade => ({
                    ...trade,
                    date_entered: trade.date_entered ? new Date(trade.date_entered) : null
                }));
                setAccountData(data);
                
                // Generate sunburst data after setting account data
                if (data.trades && data.trades.length > 0) {
                    generateSunburstData(data.trades);
                }
            } else {
                console.error('Error fetching account data:', data.error);
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountDataFromAPI();
    }, []);

    // Generate data for the sunburst chart
    const generateSunburstData = (trades) => {
        // Create hierarchical structure for sunburst chart
        // Level 1: Strategy
        // Level 2: Asset
        // Level 3: Outcome (Win/Loss/Break-even)
        
        // First, group the data
        const strategyGroups = {};
        
        trades.forEach(trade => {
            const strategy = trade.strategy || 'Unknown';
            const asset = trade.asset || 'Unknown';
            const outcome = trade.outcome || 'Unknown';
            
            if (!strategyGroups[strategy]) {
                strategyGroups[strategy] = {};
            }
            
            if (!strategyGroups[strategy][asset]) {
                strategyGroups[strategy][asset] = {
                    'Win': 0,
                    'Loss': 0,
                    'Break-even': 0
                };
            }
            
            if (outcome in strategyGroups[strategy][asset]) {
                strategyGroups[strategy][asset][outcome]++;
            } else {
                strategyGroups[strategy][asset][outcome] = 1;
            }
        });
        
        // Convert to hierarchy structure
        const sunburstHierarchy = {
            name: "Trades",
            children: []
        };
        
        Object.keys(strategyGroups).forEach(strategy => {
            const strategyNode = {
                name: strategy,
                children: []
            };
            
            Object.keys(strategyGroups[strategy]).forEach(asset => {
                const assetNode = {
                    name: asset,
                    children: []
                };
                
                Object.keys(strategyGroups[strategy][asset]).forEach(outcome => {
                    const count = strategyGroups[strategy][asset][outcome];
                    if (count > 0) {
                        assetNode.children.push({
                            name: outcome,
                            value: count,
                            color: outcome === 'Win' ? '#4CAF50' : 
                                  outcome === 'Loss' ? '#E57373' : 
                                  '#FFC107'
                        });
                    }
                });
                
                if (assetNode.children.length > 0) {
                    strategyNode.children.push(assetNode);
                }
            });
            
            if (strategyNode.children.length > 0) {
                sunburstHierarchy.children.push(strategyNode);
            }
        });
        
        setSunburstData(sunburstHierarchy);
    };

    // Update sunburst data when filters change
    useEffect(() => {
        if (accountData?.trades) {
            generateSunburstData(getFilteredTrades());
        }
    }, [filters]);

    // Get available time periods based on the selected time frame
    const getAvailableTimePeriods = () => {
        if (!accountData?.trades || filters.timeFrame === 'all') return ['all'];

        const dates = accountData.trades
            .filter(trade => trade.date_entered)
            .map(trade => trade.date_entered);

        if (dates.length === 0) return ['all'];

        const periods = new Set();
        dates.forEach(date => {
            if (filters.timeFrame === 'month') {
                // Format: "MMMM YYYY"
                const monthYear = date.toLocaleString('default', { 
                    month: 'long',
                    year: 'numeric'
                });
                periods.add(monthYear);
            } else if (filters.timeFrame === 'week') {
                // Get the Monday of the week
                const monday = new Date(date);
                monday.setDate(date.getDate() - date.getDay() + 1);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                
                const weekRange = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
                periods.add(weekRange);
            }
        });

        return ['all', ...Array.from(periods)].sort((a, b) => {
            if (a === 'all') return -1;
            if (b === 'all') return 1;
            return new Date(b.split(' ')[0]) - new Date(a.split(' ')[0]);
        });
    };

    // Filter trades based on current filter settings
    const getFilteredTrades = () => {
        if (!accountData?.trades) return [];

        return accountData.trades.filter(trade => {
            const dayMatch = filters.dayOfWeek === 'all' || trade.day_of_week_entered === filters.dayOfWeek;
            const sessionMatch = filters.tradingSession === 'all' || trade.trading_session_entered === filters.tradingSession;
            const strategyMatch = filters.strategy === 'all' || trade.strategy === filters.strategy;
            const outcomeMatch = filters.outcome === 'all' || trade.outcome === filters.outcome;
            const assetMatch = filters.asset === 'all' || trade.asset === filters.asset;

            let timeMatch = true;
            if (filters.timeFrame !== 'all' && filters.selectedPeriod !== 'all' && trade.date_entered) {
                if (filters.timeFrame === 'month') {
                    const tradeMonthYear = trade.date_entered.toLocaleString('default', { 
                        month: 'long',
                        year: 'numeric'
                    });
                    timeMatch = tradeMonthYear === filters.selectedPeriod;
                } else if (filters.timeFrame === 'week') {
                    const monday = new Date(trade.date_entered);
                    monday.setDate(trade.date_entered.getDate() - trade.date_entered.getDay() + 1);
                    const sunday = new Date(monday);
                    sunday.setDate(monday.getDate() + 6);
                    const weekRange = `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
                    timeMatch = weekRange === filters.selectedPeriod;
                }
            }

            return dayMatch && sessionMatch && strategyMatch && outcomeMatch && assetMatch && timeMatch;
        });
    };

    // Get unique values for filter dropdowns
    const getUniqueValues = (field) => {
        if (!accountData || !accountData.trades) return [];
        return ['all', ...new Set(accountData.trades.map(trade => trade[field]))];
    };

    // Helper function for generating chart data
    const generateChartData = (field) => {
        if (!accountData || !accountData.trades) return { labels: [], datasets: [] };

        const filteredTrades = getFilteredTrades();

        const counts = filteredTrades.reduce((acc, trade) => {
            const key = trade[field];
            const outcome = trade.outcome;
            acc[key] = acc[key] || { Win: 0, Loss: 0, "Break-even": 0 };
            acc[key][outcome] = (acc[key][outcome] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const datasets = Object.keys(counts[labels[0]] || {}).map(outcome => ({
            label: outcome,
            data: labels.map(label => counts[label][outcome] || 0),
            backgroundColor: outcome === 'Win' ? '#4CAF50' : outcome === 'Loss' ? '#E57373' : '#FFC107',
        }));

        return { labels, datasets };
    };

    const generateEquityCurveData = () => {
        if (!accountData || !accountData.trades || !accountData.initial_capital) return { labels: [], datasets: [] };
    
        const filteredTrades = getFilteredTrades();
        let cumulativeEquity = accountData.initial_capital;
        const equityCurve = filteredTrades.map((trade, index) => {
            if (trade.outcome === 'Win') {
                cumulativeEquity += trade.amount;
            } else if (trade.outcome === 'Loss') {
                cumulativeEquity -= trade.amount;
            }
            return { x: index + 1, y: cumulativeEquity };
        });
    
        return {
            labels: equityCurve.map(point => `Trade ${point.x}`),
            datasets: [{
                label: 'Equity Curve',
                data: equityCurve.map(point => point.y),
                borderColor: '#1E88E5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                fill: true,
            }],
        };
    };

    const generateMetricsData = () => {
        if (!accountData || !accountData.trades) return {};
    
        const filteredTrades = getFilteredTrades();
        let totalWinsAmount = 0;
        let totalLossesAmount = 0;
        let numberOfWins = 0;
        let numberOfLosses = 0;
        let totalTrades = filteredTrades.length;
    
        filteredTrades.forEach(trade => {
            if (trade.outcome === 'Win') {
                totalWinsAmount += trade.amount;
                numberOfWins++;
            } else if (trade.outcome === 'Loss') {
                totalLossesAmount += trade.amount;
                numberOfLosses++;
            }
        });
    
        const winRate = totalTrades > 0 ? (numberOfWins / totalTrades) * 100 : 0;
        const averageWin = numberOfWins ? totalWinsAmount / numberOfWins : 0;
        const averageLoss = numberOfLosses ? totalLossesAmount / numberOfLosses : 0;
        const profitFactor = totalLossesAmount ? totalWinsAmount / Math.abs(totalLossesAmount) : numberOfWins > 0 ? Infinity : 0;
    
        return {
            winRate,
            averageWin,
            averageLoss,
            profitFactor,
            numberOfWins,
            numberOfLosses,
        };
    };

    const fetchAISummary = async () => {
        if (!accountData) return;

        setAiSummaryLoading(true);
        try {
            const metricsData = generateMetricsData();
            const filteredTrades = getFilteredTrades();
            
            const response = await fetch(`${baseUrl}/ai-account-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_name: accountData.account_name,
                    metrics: metricsData,
                    trades: filteredTrades.map(trade => ({
                        outcome: trade.outcome,
                        amount: trade.amount,
                        day_of_week_entered: trade.day_of_week_entered,
                        trading_session_entered: trade.trading_session_entered,
                        strategy: trade.strategy,
                        asset: trade.asset
                    }))
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.summary) {
                setAiSummary(data.summary);
                setSummaryExpanded(true); // Auto-expand when new summary is generated
            } else {
                console.error('Error fetching AI summary:', data.error);
                setAiSummary("Sorry, we couldn't generate an AI summary at this time.");
            }
        } catch (error) {
            console.error('Error fetching AI summary:', error);
            setAiSummary("Sorry, we couldn't generate an AI summary at this time.");
        } finally {
            setAiSummaryLoading(false);
        }
    };

    // Parse and format the AI summary for better display
    const formatAiSummary = () => {
        if (!aiSummary) return [];
        
        // Split the summary into sections based on emoji patterns
        // This will likely be sections like overall statement, metrics, patterns, recommendations
        const sections = [];
        let currentSection = "";
        
        aiSummary.split('\n').forEach(line => {
            // Check if line starts with an emoji (common emoji pattern: 1-2 characters at start of line)
            const emojiRegex = /^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;
            
            if (line.trim() === "") {
                // Skip empty lines
                return;
            } else if (emojiRegex.test(line) || sections.length === 0) {
                // Start a new section if we find an emoji at the start or this is the first line
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = line;
            } else {
                // Continue current section
                currentSection += "\n" + line;
            }
        });
        
        // Add the last section
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const toggleSummary = () => {
        setSummaryExpanded(!summaryExpanded);
    };

    // Sunburst Chart Component
    const SunburstChart = ({ data }) => {
        const chartRef = React.useRef(null);
        const svgRef = React.useRef(null);
        
        useEffect(() => {
            if (!data || !chartRef.current) return;
            
            // Clear previous chart if any
            d3.select(chartRef.current).selectAll("*").remove();
            
            const width = 600;
            const height = 500;
            const radius = Math.min(width, height) / 2;
            
            // Create the SVG element
            const svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("ref", svgRef)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);
            
            // Create hierarchical data
            const root = d3.hierarchy(data)
                .sum(d => d.value || 0);
            
            // Create partition layout
            const partition = d3.partition()
                .size([2 * Math.PI, radius]);
            
            partition(root);
            
            // Color scale
            const color = d3.scaleOrdinal(d3.schemeCategory10);
            
            // Arc generator
            const arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .innerRadius(d => d.y0)
                .outerRadius(d => d.y1);
            
            // Create the arcs
            const arcs = svg.selectAll("path")
                .data(root.descendants())
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", d => {
                    if (d.data.color) return d.data.color;  // Use predefined color for outcomes
                    return color(d.data.name);  // Use color scale for other levels
                })
                .attr("opacity", 0.8)
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .append("title")  // Add tooltips
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join(" > ")}\n${d.value} trades`);
            
            // Add labels
            const text = svg.selectAll("text")
                .data(root.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 20))
                .enter()
                .append("text")
                .attr("transform", d => {
                    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                    const y = (d.y0 + d.y1) / 2;
                    const rotation = x < 90 || x > 270 ? x : x + 180;
                    return `rotate(${x - 90}) translate(${y},0) rotate(${rotation < 90 || rotation > 270 ? 0 : 180})`;
                })
                .attr("dx", d => (d.x0 + d.x1) / 2 < Math.PI ? "6" : "-6")
                .attr("dy", ".35em")
                .attr("text-anchor", d => (d.x0 + d.x1) / 2 < Math.PI ? "start" : "end")
                .text(d => d.data.name)
                .style("font-size", "12px")
                .style("fill", "white")
                .style("font-weight", "bold")
                .style("pointer-events", "none");
                
            // Make arcs interactive
            arcs
                .style("cursor", "pointer")
                .on("mouseover", function() {
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr("stroke-width", 2);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("opacity", 0.8)
                        .attr("stroke-width", 1);
                });
                
        }, [data]);
        
        return (
            <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
        );
    };

    const baseChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 16,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 14,
                        family: "'Arial', sans-serif",
                        weight: "normal",
                    },
                    color: "#444",
                },
            },
        },
    };
    
    const weekdayChartData = generateChartData('day_of_week_entered');
    const sessionChartData = generateChartData('trading_session_entered');
    const strategyChartData = generateChartData('strategy');
    const assetChartData = generateChartData('asset');
    const equityCurveData = generateEquityCurveData();
    const metricsData = generateMetricsData();

    // Format AI summary into sections
    const summaryContent = formatAiSummary();

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="account-analytics">Account Analytics</h5>

                    {loading ? (
                        <div>Loading...</div>
                    ) : !accountData ? (
                        <div>No account data available.</div>
                    ) : (
                        <>
                            {/* Enhanced AI Summary Section */}
                            <div className="ai-summary-section" style={{
                                marginBottom: '20px',
                                backgroundColor: '#f0f7ff',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <h6 style={{
                                        margin: 0, 
                                        fontSize: '20px', 
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{marginRight: '10px'}}>✨</span>
                                        AI Trading Insights
                                    </h6>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        {aiSummary && !aiSummaryLoading && (
                                            <button 
                                                onClick={toggleSummary}
                                                className="btn btn-outline-primary"
                                                style={{
                                                    border: '1px solid #1E88E5',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'transparent',
                                                    color: '#1E88E5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                {summaryExpanded ? (
                                                    <>
                                                        <span style={{fontSize: '18px'}}>▼</span> 
                                                        Hide Summary
                                                    </>
                                                ) : (
                                                    <>
                                                        <span style={{fontSize: '18px'}}>▶</span> 
                                                        Show Summary
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <button 
                                            onClick={fetchAISummary}
                                            disabled={aiSummaryLoading}
                                            className="btn btn-primary"
                                            style={{
                                                backgroundColor: '#1E88E5',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <span style={{fontSize: '16px'}}>🔄</span>
                                            {aiSummaryLoading ? 'Generating...' : aiSummary ? 'Refresh Analysis' : 'Generate Analysis'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* AI Summary Content with Toggle */}
                                <div className="ai-summary-content" style={{
                                    overflow: 'hidden',
                                    maxHeight: summaryExpanded ? '2000px' : '0',
                                    opacity: summaryExpanded ? 1 : 0,
                                    transition: 'max-height 0.5s ease, opacity 0.5s ease',
                                    marginTop: summaryExpanded ? '15px' : 0
                                }}>
                                    {aiSummaryLoading ? (
                                        <div style={{
                                            textAlign: 'center', 
                                            width: '100%',
                                            padding: '30px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                        }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p style={{marginTop: '15px', color: '#555'}}>Analyzing your trading data...</p>
                                            <p style={{fontSize: '14px', color: '#777'}}>This may take a few moments</p>
                                        </div>
                                    ) : aiSummary ? (
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            overflow: 'hidden',
                                        }}>
                                            {summaryContent.map((section, index) => (
                                                <div 
                                                    key={index} 
                                                    style={{
                                                        padding: '16px 20px',
                                                        borderBottom: index < summaryContent.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                        backgroundColor: index % 2 === 0 ? 'white' : '#fafbff'
                                                    }}
                                                >
                                                    {section.split('\n').map((line, lineIdx) => (
                                                        <p key={lineIdx} style={{
                                                            margin: lineIdx === 0 ? '0 0 10px' : '10px 0',
                                                            fontWeight: lineIdx === 0 ? 'bold' : 'normal',
                                                            fontSize: lineIdx === 0 ? '16px' : '15px',
                                                            color: lineIdx === 0 ? '#1a1a1a' : '#444'
                                                        }}>
                                                            {line}
                                                        </p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center', 
                                            color: '#666',
                                            padding: '30px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                        }}>
                                            <p style={{fontSize: '16px', marginBottom: '5px'}}>No analysis generated yet</p>
                                            <p style={{fontSize: '14px', color: '#777'}}>
                                                Click "Generate Analysis" to get personalized insights about your trading performance
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="account-info">
                                <h6>Account: {accountData.account_name}</h6>
                                <p>Main Assets: {accountData.main_assets}</p>
                                <p>Initial Capital: ${accountData.initial_capital}</p>
                            </div>

                            <div className="filters-container">
                                {/* Time frame filter */}
                                <select
                                    value={filters.timeFrame}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        timeFrame: e.target.value,
                                        selectedPeriod: 'all' // Reset period when changing time frame
                                    })}
                                    className="filter-select form-control"
                                >
                                    <option value="all">All Time</option>
                                    <option value="month">By Month</option>
                                    <option value="week">By Week</option>
                                </select>

                                {/* Period filter */}
                                <select
                                    value={filters.selectedPeriod}
                                    onChange={(e) => setFilters({...filters, selectedPeriod: e.target.value})}
                                    className="filter-select form-control"
                                    disabled={filters.timeFrame === 'all'}
                                >
                                    {getAvailableTimePeriods().map(period => (
                                        <option key={period} value={period}>
                                            {period === 'all' ? 
                                                `All ${filters.timeFrame === 'month' ? 'Months' : 'Weeks'}` : 
                                                period}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.asset}
                                    onChange={(e) => setFilters({...filters, asset: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('asset').map(asset => (
                                        <option key={asset} value={asset}>
                                            {asset === 'all' ? 'All Assets' : asset}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.dayOfWeek}
                                    onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('day_of_week_entered').map(day => (
                                        <option key={day} value={day}>
                                            {day === 'all' ? 'All Days' : day}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.tradingSession}
                                    onChange={(e) => setFilters({...filters, tradingSession: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('trading_session_entered').map(session => (
                                        <option key={session} value={session}>
                                            {session === 'all' ? 'All Sessions' : session}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.strategy}
                                    onChange={(e) => setFilters({...filters, strategy: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {getUniqueValues('strategy').map(strategy => (
                                        <option key={strategy} value={strategy}>
                                            {strategy === 'all' ? 'All Strategies' : strategy}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.outcome}
                                    onChange={(e) => setFilters({...filters, outcome: e.target.value})}
                                    className="filter-select form-control"
                                >
                                    {['all', 'Win', 'Loss', 'Break-even'].map(outcome => (
                                        <option key={outcome} value={outcome}>
                                            {outcome === 'all' ? 'All Outcomes' : outcome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sunburst Chart Section */}
                            <div className="sunburst-section" style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                            }}>
                                <h6 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginBottom: '15px',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{marginRight: '10px'}}>🔄</span>
                                    Strategy-Asset Performance Breakdown
                                </h6>

                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                                }}>
                                    <p style={{marginBottom: '15px', color: '#555', fontStyle: 'italic'}}>
                                        This visualization shows how different strategies perform across various assets,
                                        with outcomes color-coded (Green = Win, Red = Loss, Yellow = Break-even).
                                        Hover over sections for more details.
                                    </p>
                                    
                                    {sunburstData ? (
                                        <div style={{height: '500px', width: '100%'}}>
                                            <SunburstChart data={sunburstData} />
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '50px 20px',
                                            color: '#777'
                                        }}>
                                            <p>No data available for sunburst visualization</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h6 className="trade-overview-header">Trades Overview</h6>

                            <div className="trade-chart-container">
                                <div className="chart-wrapper">
                                    <h6>Performance by Day of Week</h6>
                                    <Bar data={weekdayChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Trading Session</h6>
                                    <Bar data={sessionChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Strategy</h6>
                                    <Bar data={strategyChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Performance by Asset</h6>
                                    <Bar data={assetChartData} options={baseChartOptions} />
                                </div>
                                <div className="chart-wrapper">
                                    <h6>Equity Curve</h6>
                                    <Line data={equityCurveData} options={baseChartOptions} />
                                </div>
                            </div>

                            <div className="metrics-container" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '15px',
                                marginTop: '20px'
                            }}>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Win Rate</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: metricsData.winRate > 50 ? '#4CAF50' : '#E57373'
                                    }}>{metricsData.winRate.toFixed(2)}%</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Average Win</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#4CAF50'
                                    }}>${metricsData.averageWin.toFixed(2)}</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Average Loss</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: '#E57373'
                                    }}>${metricsData.averageLoss.toFixed(2)}</p>
                                </div>
                                <div className="metric-card" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    flex: '1 1 200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h6 style={{color: '#333', marginBottom: '10px'}}>Profit Factor</h6>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        color: metricsData.profitFactor > 1 ? '#4CAF50' : '#E57373'
                                    }}>{metricsData.profitFactor.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Add a Heatmap for Win/Loss patterns */}
                            <div className="heatmap-section" style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                padding: '20px',
                                marginTop: '20px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                            }}>
                                <h6 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginBottom: '15px',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <span style={{marginRight: '10px'}}>🔥</span>
                                    Win/Loss Pattern Heatmap
                                </h6>
                                
                                <div id="heatmap-container" style={{
                                    height: '300px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}>
                                    {/* Heatmap will be rendered here using D3 */}
                                    {/* We'll implement this in a useEffect after the component mounts */}
                                    <HeatmapChart trades={getFilteredTrades()} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Heatmap Component for Day/Session visualization
const HeatmapChart = ({ trades }) => {
    const chartRef = React.useRef(null);
    
    useEffect(() => {
        if (!trades || !trades.length || !chartRef.current) return;
        
        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();
        
        // Organize data for heatmap
        // Days of week as rows, sessions as columns
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const sessions = [...new Set(trades.map(t => t.trading_session_entered))].filter(s => s);
        
        // Create a matrix for win percentages
        const data = [];
        
        daysOfWeek.forEach(day => {
            sessions.forEach(session => {
                const daySessionTrades = trades.filter(t => 
                    t.day_of_week_entered === day && 
                    t.trading_session_entered === session
                );
                
                if (daySessionTrades.length > 0) {
                    const wins = daySessionTrades.filter(t => t.outcome === 'Win').length;
                    const winRate = (wins / daySessionTrades.length) * 100;
                    const totalAmount = daySessionTrades.reduce((sum, t) => {
                        if (t.outcome === 'Win') return sum + t.amount;
                        if (t.outcome === 'Loss') return sum - t.amount;
                        return sum;
                    }, 0);
                    
                    data.push({
                        day,
                        session,
                        winRate,
                        trades: daySessionTrades.length,
                        netAmount: totalAmount
                    });
                } else {
                    data.push({
                        day,
                        session,
                        winRate: 0,
                        trades: 0,
                        netAmount: 0
                    });
                }
            });
        });
        
        // Set up dimensions
        const margin = { top: 30, right: 30, bottom: 80, left: 80 };
        const width = chartRef.current.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
        
        // Create SVG
        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create scales
        const x = d3.scaleBand()
            .domain(sessions)
            .range([0, width])
            .padding(0.05);
        
        const y = d3.scaleBand()
            .domain(daysOfWeek)
            .range([0, height])
            .padding(0.05);
        
        // Color scale
        const color = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlGn)
            .domain([0, 100]); // 0% to 100% win rate
        
        // Create heatmap cells
        svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.session))
            .attr("y", d => y(d.day))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => d.trades === 0 ? "#f0f0f0" : color(d.winRate))
            .style("stroke", "white")
            .style("stroke-width", 1)
            .style("opacity", d => d.trades === 0 ? 0.5 : 0.8)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke-width", 2);
                
                // Show tooltip
                tooltip
                    .html(`
                        <div style="font-weight:bold">${d.day} - ${d.session}</div>
                        <div>Win Rate: ${d.winRate.toFixed(1)}%</div>
                        <div>Trades: ${d.trades}</div>
                        <div>Net P/L: $${d.netAmount.toFixed(2)}</div>
                    `)
                    .style("opacity", 0.9)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("opacity", d => d.trades === 0 ? 0.5 : 0.8)
                    .style("stroke-width", 1);
                tooltip.style("opacity", 0);
            });
        
        // Add labels
        svg.append("g")
            .style("font-size", 12)
            .style("font-family", "Arial")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        svg.append("g")
            .style("font-size", 12)
            .style("font-family", "Arial")
            .call(d3.axisLeft(y).tickSize(0));
        
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", 14)
            .style("font-weight", "bold")
            .text("Win Rate by Day and Session");
        
        // Add tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("border-radius", "3px")
            .style("padding", "8px")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
            .style("font-size", "12px")
            .style("pointer-events", "none");
        
        // Add legend
        const legendWidth = 200;
        const legendHeight = 20;
        
        const legendScale = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlGn)
            .domain([0, 100]);
        
        const legendAxis = d3.axisBottom(d3.scaleLinear().domain([0, 100]).range([0, legendWidth]))
            .ticks(5)
            .tickFormat(d => `${d}%`);
        
        const legend = svg.append("g")
            .attr("transform", `translate(${width/2 - legendWidth/2},${height + 50})`);
        
        legend.append("text")
            .attr("text-anchor", "middle")
            .attr("x", legendWidth / 2)
            .attr("y", -20)
            .style("font-size", 12)
            .text("Win Rate");
        
        // Create gradient for legend
        const defs = svg.append("defs");
        
        const linearGradient = defs.append("linearGradient")
            .attr("id", "win-rate-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        
        // Add color stops to gradient
        linearGradient.selectAll("stop")
            .data(d3.range(0, 101, 5))
            .enter().append("stop")
            .attr("offset", d => `${d}%`)
            .attr("stop-color", d => legendScale(d));
        
        // Draw the colored rectangle
        legend.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#win-rate-gradient)");
        
        // Add axis
        legend.append("g")
            .attr("transform", `translate(0,${legendHeight})`)
            .call(legendAxis);
        
    }, [trades]);
    
    return <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>;
};