import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';


const TradingDashboard = () => {
  const [timeFrame, setTimeFrame] = useState('month');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const accountName = Cookies.get('account_name');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months by default
      
      const response = await axios.get(`${baseUrl}/time-trading-analytics`, {
        params: {
          account_name: accountName,
          time_frame: timeFrame,
          start_date: startDate.toISOString(),
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  if (isLoading || !data) {
    return <div className="loading">Loading...</div>;
  }

  const { summary, by_day, by_session, by_asset, by_strategy, time_series } = data;

  return (
    <div className="dashboard-container">
      {/* Time Frame Selector */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Trading Analytics</h2>
        <select 
          className="time-frame-select"
          value={timeFrame} 
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="month">Monthly</option>
          <option value="week">Weekly</option>
          <option value="day">Daily</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Win Rate</span>
            <Activity size={16} color="#64748b" />
          </div>
          <div className="metric-value">{summary.win_rate.toFixed(2)}%</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Profit Factor</span>
            <TrendingUp size={16} color="#64748b" />
          </div>
          <div className="metric-value">{summary.profit_factor.toFixed(2)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Average Win</span>
            <ArrowUp size={16} color="#16a34a" />
          </div>
          <div className="metric-value">${summary.average_win.toFixed(2)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Average Loss</span>
            <ArrowDown size={16} color="#dc2626" />
          </div>
          <div className="metric-value">${Math.abs(summary.average_loss).toFixed(2)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-card">
        <h3 className="chart-title">Performance Over Time</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={time_series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="total" stroke="#2563eb" name="Profit/Loss" />
              <Line yAxisId="right" type="monotone" dataKey="win_rate" stroke="#16a34a" name="Win Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3 className="chart-title">Performance by Day</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day_of_week_entered" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Profit/Loss" />
                <Bar dataKey="win_rate" fill="#16a34a" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Performance by Session</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_session}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trading_session_entered" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Profit/Loss" />
                <Bar dataKey="win_rate" fill="#16a34a" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Performance by Asset</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_asset}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="asset" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Profit/Loss" />
                <Bar dataKey="win_rate" fill="#16a34a" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Performance by Strategy</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_strategy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Profit/Loss" />
                <Bar dataKey="win_rate" fill="#16a34a" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;