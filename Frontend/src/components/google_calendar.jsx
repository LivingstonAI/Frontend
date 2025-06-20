import React, { useEffect, useState } from "react";
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