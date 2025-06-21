import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function GoogleCalendar() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [accountData, setAccountData] = useState(null);
    const [trades, setTrades] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTrades, setSelectedTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const accountName = Cookies.get('account_name');

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!accountName) {
                throw new Error('Account name not found. Please log in again.');
            }

            const response = await fetch(`${baseUrl}/api/trades-calendar/?account_name=${accountName}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No trading data found for this account.');
                } else if (response.status === 401) {
                    throw new Error('Unauthorized access. Please log in again.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`Failed to fetch trades: ${response.status}`);
                }
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from server.');
            }
            
            // Normalize amounts based on outcome and adjust dates
            const normalizedTrades = data.map(trade => ({
                ...trade,
                amount: trade.outcome === 'Loss' ? -Math.abs(trade.amount) : Math.abs(trade.amount),
                // Shift the date back by 2 days before processing
                date_entered: trade.date_entered ? (() => {
                    const originalDate = new Date(trade.date_entered);
                    originalDate.setDate(originalDate.getDate() - 1);
                    return originalDate.toISOString();
                })() : null
            }));
            
            setTrades(normalizedTrades);
        } catch (error) {
            console.error('Error fetching trades:', error);
            setError(error.message || 'An unexpected error occurred while loading your trades.');
        } finally {
            setLoading(false);
        }
    };

    // Get trades for current month
    const getCurrentMonthTrades = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const tradeDate = new Date(trade.date_entered);
            return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
        });
    };

    // Analytics calculations
    const calculateAnalytics = () => {
        const monthTrades = getCurrentMonthTrades();
        
        if (monthTrades.length === 0) {
            return {
                winRate: 0,
                averageWin: 0,
                averageLoss: 0,
                profitFactor: 0,
                totalWins: 0,
                totalLosses: 0,
                totalTrades: 0,
                netPnL: 0
            };
        }

        const wins = monthTrades.filter(trade => trade.amount > 0);
        const losses = monthTrades.filter(trade => trade.amount < 0);
        
        const totalWins = wins.reduce((sum, trade) => sum + trade.amount, 0);
        const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + trade.amount, 0));
        
        const winRate = (wins.length / monthTrades.length) * 100;
        const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
        const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
        const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
        const netPnL = monthTrades.reduce((sum, trade) => sum + trade.amount, 0);

        return {
            winRate,
            averageWin,
            averageLoss,
            profitFactor,
            totalWins: wins.length,
            totalLosses: losses.length,
            totalTrades: monthTrades.length,
            netPnL
        };
    };

    // Performance by day of week
    const getDayOfWeekPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const dayPerformance = {
            'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 
            'Friday': 0, 'Saturday': 0, 'Sunday': 0
        };

        monthTrades.forEach(trade => {
            if (trade.day_of_week_entered && dayPerformance.hasOwnProperty(trade.day_of_week_entered)) {
                dayPerformance[trade.day_of_week_entered] += trade.amount;
            }
        });

        return {
            labels: Object.keys(dayPerformance),
            datasets: [{
                label: 'P&L by Day of Week',
                data: Object.values(dayPerformance),
                backgroundColor: Object.values(dayPerformance).map(value => 
                    value >= 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(dayPerformance).map(value => 
                    value >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by trading session
    const getTradingSessionPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const sessionPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.trading_session_entered) {
                if (!sessionPerformance[trade.trading_session_entered]) {
                    sessionPerformance[trade.trading_session_entered] = 0;
                }
                sessionPerformance[trade.trading_session_entered] += trade.amount;
            }
        });

        return {
            labels: Object.keys(sessionPerformance),
            datasets: [{
                label: 'P&L by Trading Session',
                data: Object.values(sessionPerformance),
                backgroundColor: Object.values(sessionPerformance).map(value => 
                    value >= 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(sessionPerformance).map(value => 
                    value >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by strategy
    const getStrategyPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const strategyPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.strategy) {
                if (!strategyPerformance[trade.strategy]) {
                    strategyPerformance[trade.strategy] = 0;
                }
                strategyPerformance[trade.strategy] += trade.amount;
            }
        });

        return {
            labels: Object.keys(strategyPerformance),
            datasets: [{
                label: 'P&L by Strategy',
                data: Object.values(strategyPerformance),
                backgroundColor: Object.values(strategyPerformance).map(value => 
                    value >= 0 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(strategyPerformance).map(value => 
                    value >= 0 ? 'rgba(168, 85, 247, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by asset
    const getAssetPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const assetPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.asset) {
                if (!assetPerformance[trade.asset]) {
                    assetPerformance[trade.asset] = 0;
                }
                assetPerformance[trade.asset] += trade.amount;
            }
        });

        return {
            labels: Object.keys(assetPerformance),
            datasets: [{
                label: 'P&L by Asset',
                data: Object.values(assetPerformance),
                backgroundColor: Object.values(assetPerformance).map(value => 
                    value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(assetPerformance).map(value => 
                    value >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Equity curve
    const getEquityCurve = () => {
        const monthTrades = getCurrentMonthTrades()
            .sort((a, b) => new Date(a.date_entered) - new Date(b.date_entered));

        let runningTotal = 0;
        const equityData = [0]; // Start at 0
        const labels = ['Start'];

        monthTrades.forEach((trade, index) => {
            runningTotal += trade.amount;
            equityData.push(runningTotal);
            labels.push(`Trade ${index + 1}`);
        });

        return {
            labels,
            datasets: [{
                label: 'Equity Curve',
                data: equityData,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const getTradesForDate = (day) => {
        if (!day) return [];
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dateString = new Date(year, month, day).toISOString().split('T')[0];
        
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const tradeDate = new Date(trade.date_entered).toISOString().split('T')[0];
            return tradeDate === dateString;
        });
    };

    const handleDateClick = (day) => {
        if (!day) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const clickedDate = new Date(year, month, day);
        
        const dayTrades = getTradesForDate(day);
        
        if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
            // If clicking the same date, close it
            setSelectedDate(null);
            setSelectedTrades([]);
        } else {
            setSelectedDate(clickedDate);
            setSelectedTrades(dayTrades);
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setSelectedDate(null);
        setSelectedTrades([]);
    };

    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getProfitLossColor = (outcome, amount) => {
        if (amount < 0) return 'loss';
        if (amount > 0) return 'profit';
        if (amount === 0) return 'neutral';
        return 'neutral';
    };

    const formatAmount = (amount) => {
        if (amount === 0) return '0';
        const absAmount = Math.abs(amount);
        if (absAmount >= 1000) {
            return (absAmount / 1000).toFixed(1) + 'k';
        }
        return absAmount.toString();
    };

    // Fixed currency formatting function
    const formatCurrency = (amount) => {
        if (amount === 0) return '$0';
        if (amount < 0) {
            return `-$${Math.abs(amount)}`;
        } else {
            return `$${amount}`;
        }
    };

    const getDayTotal = (dayTrades) => {
        return dayTrades.reduce((total, trade) => total + trade.amount, 0);
    };

    const handleRetry = () => {
        fetchTrades();
    };

    const days = getDaysInMonth(currentDate);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const analytics = calculateAnalytics();

    // Error state
    if (error && !loading) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div className="error-container" style={{
                            background: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '20px 0',
                            textAlign: 'center'
                        }}>
                            <h4 style={{color: '#c33', marginBottom: '10px'}}>
                                Unable to Load Trading Data
                            </h4>
                            <p style={{color: '#666', marginBottom: '15px'}}>
                                {error}
                            </p>
                            <button 
                                onClick={handleRetry}
                                style={{
                                    background: '#007cba',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div className="loading" style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666'
                        }}>
                            Loading trades...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Trading Calendar</h5><br />
                    
                    {/* Analytics Toggle Button */}
                    <div style={{ marginBottom: '20px' }}>
                        <button 
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            style={{
                                background: showAnalytics ? '#ef4444' : '#007cba',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                        </button>
                    </div>

                    {/* Analytics Section */}
                    {showAnalytics && (
                        <div style={{ marginBottom: '30px' }}>
                            {/* Key Metrics */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '15px',
                                marginBottom: '30px'
                            }}>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Win Rate</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.winRate >= 50 ? '#22c55e' : '#ef4444' }}>
                                        {analytics.winRate.toFixed(1)}%
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Average Win</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                                        ${analytics.averageWin.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Average Loss</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                                        ${analytics.averageLoss.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Profit Factor</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.profitFactor >= 1 ? '#22c55e' : '#ef4444' }}>
                                        {analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Net P&L</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.netPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                                        ${analytics.netPnL.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Total Trades</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280' }}>
                                        {analytics.totalTrades}
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                                    <h6 style={{ marginBottom: '15px' }}>Performance by Day of Week</h6>
                                    <Bar data={getDayOfWeekPerformance()} options={chartOptions} />
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                                    <h6 style={{ marginBottom: '15px' }}>Performance by Trading Session</h6>
                                    <Bar data={getTradingSessionPerformance()} options={chartOptions} />
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                                    <h6 style={{ marginBottom: '15px' }}>Performance by Strategy</h6>
                                    <Bar data={getStrategyPerformance()} options={chartOptions} />
                                </div>
                                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                                    <h6 style={{ marginBottom: '15px' }}>Performance by Asset</h6>
                                    <Bar data={getAssetPerformance()} options={chartOptions} />
                                </div>
                            </div>

                            {/* Equity Curve */}
                            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                                <h6 style={{ marginBottom: '15px' }}>Equity Curve</h6>
                                <Line data={getEquityCurve()} options={chartOptions} />
                            </div>
                        </div>
                    )}
                    
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button 
                                className="nav-button" 
                                onClick={() => navigateMonth(-1)}
                            >
                                &#8249;
                            </button>
                            <h3 className="month-year">{getMonthName(currentDate)}</h3>
                            <button 
                                className="nav-button" 
                                onClick={() => navigateMonth(1)}
                            >
                                &#8250;
                            </button>
                        </div>

                        <div className="calendar-grid">
                            {weekdays.map(day => (
                                <div key={day} className="weekday-header">
                                    {day}
                                </div>
                            ))}
                            
                            {days.map((day, index) => {
                                const dayTrades = getTradesForDate(day);
                                const isSelected = selectedDate && 
                                    selectedDate.getDate() === day && 
                                    selectedDate.getMonth() === currentDate.getMonth();
                                
                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${day ? 'active' : 'inactive'} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day && (
                                            <>
                                                <span className="day-number">{day}</span>
                                                {dayTrades.length > 0 && (
                                                    <div className="trade-amounts">
                                                        {dayTrades.slice(0, 4).map((trade, i) => (
                                                            <div
                                                                key={i}
                                                                className={`trade-amount ${getProfitLossColor(trade.outcome, trade.amount)}`}
                                                                title={`${trade.asset} - ${trade.outcome}: ${formatCurrency(trade.amount)}`}
                                                            >
                                                                {trade.amount > 0 ? '+' : '-'}{formatAmount(trade.amount)}
                                                            </div>
                                                        ))}
                                                        {dayTrades.length > 4 && (
                                                            <div className="trade-count">+{dayTrades.length - 4}</div>
                                                        )}
                                                        {dayTrades.length > 1 && (
                                                            <div className={`day-total ${getProfitLossColor('', getDayTotal(dayTrades))}`}>
                                                                Total: {getDayTotal(dayTrades) > 0 ? '+' : ''}{formatAmount(getDayTotal(dayTrades))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedDate && selectedTrades.length > 0 && (
                            <div className="trade-details">
                                <h4>Trades for {selectedDate.toLocaleDateString()}</h4>
                                <div className="trades-list">
                                    {selectedTrades.map((trade, index) => (
                                        <div key={index} className="trade-card">
                                            <div className="trade-header">
                                                <h5>{trade.asset}</h5>
                                                <span className={`trade-outcome ${getProfitLossColor(trade.outcome, trade.amount)}`}>
                                                    {formatCurrency(trade.amount)}
                                                </span>
                                            </div>
                                            <div className="trade-info">
                                                <div className="trade-row">
                                                    <span className="label">Order Type:</span>
                                                    <span>{trade.order_type}</span>
                                                </div>
                                                <div className="trade-row">
                                                    <span className="label">Strategy:</span>
                                                    <span>{trade.strategy}</span>
                                                </div>
                                                <div className="trade-row">
                                                    <span className="label">Day Entered:</span>
                                                    <span>{trade.day_of_week_entered}</span>
                                                </div>
                                                {trade.day_of_week_closed && (
                                                    <div className="trade-row">
                                                        <span className="label">Day Closed:</span>
                                                        <span>{trade.day_of_week_closed}</span>
                                                    </div>
                                                )}
                                                <div className="trade-row">
                                                    <span className="label">Session Entered:</span>
                                                    <span>{trade.trading_session_entered}</span>
                                                </div>
                                                {trade.trading_session_closed && (
                                                    <div className="trade-row">
                                                        <span className="label">Session Closed:</span>
                                                        <span>{trade.trading_session_closed}</span>
                                                    </div>
                                                )}
                                                <div className="trade-row">
                                                    <span className="label">Outcome:</span>
                                                    <span className={getProfitLossColor(trade.outcome, trade.amount)}>
                                                        {trade.outcome}
                                                    </span>
                                                </div>
                                                {trade.emotional_bias && (
                                                    <div className="trade-row">
                                                        <span className="label">Emotional Bias:</span>
                                                        <span>{trade.emotional_bias}</span>
                                                    </div>
                                                )}
                                                {trade.reflection && (
                                                    <div className="trade-row">
                                                        <span className="label">Reflection:</span>
                                                        <span>{trade.reflection}</span>
                                                    </div>
                                                )}
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