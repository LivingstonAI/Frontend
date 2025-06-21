import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

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

    // Filter trades for current month
    const getMonthTrades = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const tradeDate = new Date(trade.date_entered);
            return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
        });
    };

    // Analytics calculations
    const calculateMetrics = (monthTrades) => {
        if (monthTrades.length === 0) return null;

        const wins = monthTrades.filter(trade => trade.amount > 0);
        const losses = monthTrades.filter(trade => trade.amount < 0);
        
        const winRate = (wins.length / monthTrades.length) * 100;
        const averageWin = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.amount, 0) / wins.length : 0;
        const averageLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => sum + trade.amount, 0)) / losses.length : 0;
        const grossWin = wins.reduce((sum, trade) => sum + trade.amount, 0);
        const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.amount, 0));
        const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 999 : 0;

        return {
            winRate: winRate.toFixed(2),
            averageWin: averageWin.toFixed(2),
            averageLoss: averageLoss.toFixed(2),
            profitFactor: profitFactor.toFixed(2),
            totalTrades: monthTrades.length,
            netProfit: (grossWin - grossLoss).toFixed(2)
        };
    };

    // Group trades by different categories
    const getPerformanceByCategory = (monthTrades, category) => {
        const grouped = {};
        
        monthTrades.forEach(trade => {
            let key = '';
            switch (category) {
                case 'day':
                    key = trade.day_of_week_entered || 'Unknown';
                    break;
                case 'session':
                    key = trade.trading_session_entered || 'Unknown';
                    break;
                case 'strategy':
                    key = trade.strategy || 'Unknown';
                    break;
                case 'asset':
                    key = trade.asset || 'Unknown';
                    break;
                default:
                    key = 'Unknown';
            }
            
            if (!grouped[key]) {
                grouped[key] = { total: 0, count: 0, wins: 0, losses: 0 };
            }
            
            grouped[key].total += trade.amount;
            grouped[key].count += 1;
            if (trade.amount > 0) grouped[key].wins += 1;
            else if (trade.amount < 0) grouped[key].losses += 1;
        });

        return Object.entries(grouped).map(([key, data]) => ({
            category: key,
            total: parseFloat(data.total.toFixed(2)),
            count: data.count,
            wins: data.wins,
            losses: data.losses,
            winRate: data.count > 0 ? ((data.wins / data.count) * 100).toFixed(1) : 0
        }));
    };

    // Generate equity curve data
    const getEquityCurveData = (monthTrades) => {
        const sortedTrades = [...monthTrades].sort((a, b) => new Date(a.date_entered) - new Date(b.date_entered));
        let runningTotal = 0;
        
        return sortedTrades.map((trade, index) => {
            runningTotal += trade.amount;
            return {
                tradeNumber: index + 1,
                equity: parseFloat(runningTotal.toFixed(2)),
                date: new Date(trade.date_entered).toLocaleDateString(),
                amount: trade.amount
            };
        });
    };

    // Custom tooltip for bar charts
    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0, color: payload[0].value >= 0 ? '#27ae60' : '#e74c3c' }}>
                        Total: ${payload[0].value}
                    </p>
                    <p style={{ margin: 0 }}>Trades: {data.count}</p>
                    <p style={{ margin: 0 }}>Win Rate: {data.winRate}%</p>
                    <p style={{ margin: 0 }}>Wins: {data.wins} | Losses: {data.losses}</p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for equity curve
    const CustomLineTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Trade #{data.tradeNumber}</p>
                    <p style={{ margin: 0 }}>Date: {data.date}</p>
                    <p style={{ margin: 0 }}>Running Total: ${data.equity}</p>
                    <p style={{ margin: 0, color: data.amount >= 0 ? '#27ae60' : '#e74c3c' }}>
                        Trade P&L: ${data.amount}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Interactive Bar Chart component
    const InteractiveBarChart = ({ data, title, color = '#007cba' }) => {
        if (!data || data.length === 0) return <div>No data available</div>;

        return (
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>{title}</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="category" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                        />
                        <YAxis 
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.total >= 0 ? '#27ae60' : '#e74c3c'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    // Interactive Line Chart for equity curve
    const InteractiveLineChart = ({ data, title }) => {
        if (!data || data.length === 0) return <div>No data available</div>;

        return (
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>{title}</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="tradeNumber" 
                            label={{ value: 'Trade Number', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis 
                            tickFormatter={(value) => `$${value}`}
                            label={{ value: 'Equity', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomLineTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#007cba" 
                            strokeWidth={2}
                            dot={{ fill: '#007cba', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#007cba', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
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
    const monthTrades = getMonthTrades();
    const metrics = calculateMetrics(monthTrades);

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
                                background: '#007cba',
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
                    {showAnalytics && metrics && (
                        <div className="analytics-section" style={{ 
                            marginBottom: '30px', 
                            padding: '20px', 
                            background: '#f9f9f9', 
                            borderRadius: '8px' 
                        }}>
                            <h3>Monthly Analytics - {getMonthName(currentDate)}</h3>
                            
                            {/* Key Metrics */}
                            <div className="metrics-grid" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                gap: '15px', 
                                marginBottom: '30px' 
                            }}>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Win Rate</h5>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007cba' }}>{metrics.winRate}%</div>
                                </div>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Average Win</h5>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>${metrics.averageWin}</div>
                                </div>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Average Loss</h5>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>${metrics.averageLoss}</div>
                                </div>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Profit Factor</h5>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007cba' }}>{metrics.profitFactor}</div>
                                </div>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Total Trades</h5>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007cba' }}>{metrics.totalTrades}</div>
                                </div>
                                <div className="metric-card" style={{ background: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                    <h5>Net Profit</h5>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        fontWeight: 'bold', 
                                        color: parseFloat(metrics.netProfit) >= 0 ? '#27ae60' : '#e74c3c' 
                                    }}>
                                        ${metrics.netProfit}
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Charts Grid */}
                            <div className="charts-grid" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <InteractiveBarChart 
                                    data={getPerformanceByCategory(monthTrades, 'day')} 
                                    title="Performance by Day of Week" 
                                />
                                <InteractiveBarChart 
                                    data={getPerformanceByCategory(monthTrades, 'session')} 
                                    title="Performance by Trading Session" 
                                />
                                <InteractiveBarChart 
                                    data={getPerformanceByCategory(monthTrades, 'strategy')} 
                                    title="Performance by Strategy" 
                                />
                                <InteractiveBarChart 
                                    data={getPerformanceByCategory(monthTrades, 'asset')} 
                                    title="Performance by Asset" 
                                />
                            </div>

                            {/* Interactive Equity Curve */}
                            <div style={{ marginTop: '20px' }}>
                                <InteractiveLineChart 
                                    data={getEquityCurveData(monthTrades)} 
                                    title="Monthly Equity Curve" 
                                />
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