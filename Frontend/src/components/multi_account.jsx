import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';


const styles = `
.portfolio_container {
    width: 100%;
    background: #ffffff;
    min-height: 100vh;
    color: #1a1a2e;
    padding: 2rem;
}

.portfolio_content {
    max-width: 1800px;
    margin: 0 auto;
}

.portfolio_header {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #0066cc;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.portfolio_tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e8f0fe;
}

.portfolio_tab {
    background: transparent;
    border: none;
    color: #5f6368;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
}

.portfolio_tab:hover {
    color: #0066cc;
}

.portfolio_tab.active {
    color: #0066cc;
    border-bottom-color: #0066cc;
}

.metrics_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.metric_card {
    background: #ffffff;
    border: 2px solid #e8f0fe;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
}

.metric_card:hover {
    transform: translateY(-4px);
    border-color: #0066cc;
    box-shadow: 0 8px 24px rgba(0, 102, 204, 0.15);
}

.metric_label {
    font-size: 0.85rem;
    color: #5f6368;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.metric_value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.3rem;
}

.metric_subtext {
    font-size: 0.9rem;
    color: #80868b;
}

.positive {
    color: #0f9d58;
}

.negative {
    color: #ea4335;
}

.neutral {
    color: #f9ab00;
}

.chart_section {
    background: #ffffff;
    border: 2px solid #e8f0fe;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
}

.chart_title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #0066cc;
}

.accounts_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.account_card {
    background: #ffffff;
    border: 2px solid #e8f0fe;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
}

.account_header {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #0066cc;
    border-bottom: 2px solid #e8f0fe;
    padding-bottom: 0.5rem;
}

.account_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
}

.account_item:hover {
    background: #e8f0fe;
    border-left-color: #0066cc;
}

.account_rank {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0066cc;
    margin-right: 1rem;
}

.account_info {
    flex: 1;
}

.account_name {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.3rem;
    color: #1a1a2e;
}

.account_stats {
    font-size: 0.85rem;
    color: #5f6368;
}

.account_performance {
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    border-radius: 6px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 1.2rem;
    color: #5f6368;
}

.error {
    background: #fce8e6;
    border: 2px solid #ea4335;
    border-radius: 8px;
    padding: 1.5rem;
    color: #ea4335;
    text-align: center;
}

.charts_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.allocation_table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.allocation_table th {
    background: #e8f0fe;
    color: #0066cc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #0066cc;
}

.allocation_table td {
    padding: 1rem;
    border-bottom: 1px solid #e8f0fe;
}

.allocation_table tr:hover {
    background: #f8f9fa;
}

.priority_badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
}

.priority_high {
    background: #e6f4ea;
    color: #0f9d58;
    border: 1px solid #0f9d58;
}

.priority_medium {
    background: #fef7e0;
    color: #f9ab00;
    border: 1px solid #f9ab00;
}

.priority_low {
    background: #fce8e6;
    color: #ea4335;
    border: 1px solid #ea4335;
}

.scenario_legend {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.scenario_item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.scenario_color {
    width: 20px;
    height: 4px;
    border-radius: 2px;
}

.scenario_label {
    font-size: 0.9rem;
    color: #5f6368;
    font-weight: 600;
}

.mini_metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
}

.mini_metric {
    text-align: center;
}

.mini_metric_label {
    font-size: 0.75rem;
    color: #5f6368;
    text-transform: uppercase;
    margin-bottom: 0.3rem;
}

.mini_metric_value {
    font-size: 1.3rem;
    font-weight: 700;
}
`;

export default function MultiAccountAnalytics() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [portfolioData, setPortfolioData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchPortfolioAnalytics();
    }, []);

    const fetchPortfolioAnalytics = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/api/supreme_multi_account_analytics_endpoint/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch portfolio analytics');
            }

            const data = await response.json();
            setPortfolioData(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching portfolio analytics:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="portfolio_container">
                <style>{styles}</style>
                <Header />
                <SideNavs />
                <div className="loading">
                    Loading comprehensive portfolio analytics...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="portfolio_container">
                <style>{styles}</style>
                <Header />
                <SideNavs />
                <div className="error">
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!portfolioData) {
        return null;
    }

    const {
        overview_metrics,
        best_accounts,
        worst_accounts,
        individual_equity_curves,
        risk_metrics,
        capital_allocation,
        monte_carlo_simulations
    } = portfolioData;

    return (
        <div className="portfolio_container">
            <style>{styles}</style>
            <Header />
            <SideNavs />
            <div className="portfolio_content">
                <h1 className="portfolio_header">Multi-Account Portfolio Analytics</h1>

                {/* Tabs */}
                <div className="portfolio_tabs">
                    <button 
                        className={`portfolio_tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`portfolio_tab ${activeTab === 'performance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Individual Performance
                    </button>
                    <button 
                        className={`portfolio_tab ${activeTab === 'risk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('risk')}
                    >
                        Risk Analysis
                    </button>
                    <button 
                        className={`portfolio_tab ${activeTab === 'monte_carlo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monte_carlo')}
                    >
                        Monte Carlo Projections
                    </button>
                    <button 
                        className={`portfolio_tab ${activeTab === 'allocation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('allocation')}
                    >
                        Capital Allocation
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Key Metrics */}
                        <div className="metrics_grid">
                            <div className="metric_card">
                                <div className="metric_label">Total Portfolio Value</div>
                                <div className="metric_value">
                                    ${overview_metrics?.total_portfolio_value?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Across {overview_metrics?.total_accounts || 0} accounts
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Total P&L</div>
                                <div className={`metric_value ${overview_metrics?.total_pnl >= 0 ? 'positive' : 'negative'}`}>
                                    ${overview_metrics?.total_pnl?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    {overview_metrics?.total_pnl_percentage?.toFixed(2) || '0'}% return
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Portfolio Sharpe Ratio</div>
                                <div className={`metric_value ${overview_metrics?.portfolio_sharpe_ratio > 1 ? 'positive' : 'neutral'}`}>
                                    {overview_metrics?.portfolio_sharpe_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Risk-adjusted returns
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Overall Win Rate</div>
                                <div className={`metric_value ${overview_metrics?.overall_win_rate > 50 ? 'positive' : 'negative'}`}>
                                    {overview_metrics?.overall_win_rate?.toFixed(1) || '0'}%
                                </div>
                                <div className="metric_subtext">
                                    {overview_metrics?.total_trades || 0} total trades
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Max Drawdown</div>
                                <div className="metric_value negative">
                                    {overview_metrics?.max_drawdown?.toFixed(2) || '0'}%
                                </div>
                                <div className="metric_subtext">
                                    Portfolio-wide
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Profit Factor</div>
                                <div className={`metric_value ${overview_metrics?.profit_factor >= 1.5 ? 'positive' : overview_metrics?.profit_factor >= 1 ? 'neutral' : 'negative'}`}>
                                    {overview_metrics?.profit_factor?.toFixed(2) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Gross profit / Gross loss
                                </div>
                            </div>
                        </div>

                        {/* Account Rankings */}
                        <div className="accounts_grid">
                            {/* Best Performing */}
                            <div className="account_card">
                                <div className="account_header">🏆 Top Performing Accounts</div>
                                {best_accounts?.map((account, index) => (
                                    <div key={account.account_id} className="account_item">
                                        <span className="account_rank">#{index + 1}</span>
                                        <div className="account_info">
                                            <div className="account_name">{account.account_name}</div>
                                            <div className="account_stats">
                                                Sharpe: {account.sharpe_ratio?.toFixed(2)} | Win Rate: {account.win_rate?.toFixed(1)}% | Trades: {account.trade_count}
                                            </div>
                                        </div>
                                        <div className="account_performance positive">
                                            {account.total_return >= 0 ? '+' : ''}{account.total_return?.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Worst Performing */}
                            <div className="account_card">
                                <div className="account_header">⚠️ Underperforming Accounts</div>
                                {worst_accounts?.map((account, index) => (
                                    <div key={account.account_id} className="account_item">
                                        <span className="account_rank">#{index + 1}</span>
                                        <div className="account_info">
                                            <div className="account_name">{account.account_name}</div>
                                            <div className="account_stats">
                                                Sharpe: {account.sharpe_ratio?.toFixed(2)} | Win Rate: {account.win_rate?.toFixed(1)}% | Trades: {account.trade_count}
                                            </div>
                                        </div>
                                        <div className="account_performance negative">
                                            {account.total_return?.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Individual Performance Tab */}
                {activeTab === 'performance' && (
                    <div className="charts_grid">
                        {individual_equity_curves?.map((accountData) => (
                            <div key={accountData.account_id} className="chart_section">
                                <div className="chart_title">
                                    {accountData.account_name}
                                </div>
                                <div className="mini_metrics">
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Return</div>
                                        <div className={`mini_metric_value ${accountData.total_return >= 0 ? 'positive' : 'negative'}`}>
                                            {accountData.total_return >= 0 ? '+' : ''}{accountData.total_return?.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Sharpe</div>
                                        <div className="mini_metric_value" style={{color: '#0066cc'}}>
                                            {accountData.sharpe_ratio?.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Win Rate</div>
                                        <div className="mini_metric_value" style={{color: '#0066cc'}}>
                                            {accountData.win_rate?.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={accountData.equity_curve}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8f0fe" />
                                        <XAxis 
                                            dataKey="period" 
                                            stroke="#5f6368" 
                                            tick={{fontSize: 11}} 
                                            label={{value: 'Trading Period', position: 'insideBottom', offset: -5}} 
                                        />
                                        <YAxis 
                                            stroke="#5f6368" 
                                            tick={{fontSize: 11}} 
                                            label={{value: 'Equity ($)', angle: -90, position: 'insideLeft'}}
                                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                background: '#ffffff',
                                                border: '2px solid #0066cc',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 'Equity']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="equity" 
                                            stroke="#0066cc" 
                                            strokeWidth={3}
                                            dot={false}
                                            name="Account Equity"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>
                )}

                {/* Risk Analysis Tab */}
                {activeTab === 'risk' && (
                    <>
                        <div className="metrics_grid">
                            <div className="metric_card">
                                <div className="metric_label">Value at Risk (95%)</div>
                                <div className="metric_value negative">
                                    ${risk_metrics?.value_at_risk?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Daily VaR estimate
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Sortino Ratio</div>
                                <div className={`metric_value ${risk_metrics?.sortino_ratio > 1 ? 'positive' : 'neutral'}`}>
                                    {risk_metrics?.sortino_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Downside risk adjusted
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Calmar Ratio</div>
                                <div className={`metric_value ${risk_metrics?.calmar_ratio > 1 ? 'positive' : 'neutral'}`}>
                                    {risk_metrics?.calmar_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Return / Max Drawdown
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Portfolio Volatility</div>
                                <div className="metric_value neutral">
                                    {risk_metrics?.portfolio_volatility?.toFixed(2) || '0'}%
                                </div>
                                <div className="metric_subtext">
                                    Annualized std dev
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Beta</div>
                                <div className="metric_value">
                                    {risk_metrics?.beta?.toFixed(3) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Market sensitivity
                                </div>
                            </div>

                            <div className="metric_card">
                                <div className="metric_label">Recovery Factor</div>
                                <div className={`metric_value ${risk_metrics?.recovery_factor > 2 ? 'positive' : 'neutral'}`}>
                                    {risk_metrics?.recovery_factor?.toFixed(2) || '0'}
                                </div>
                                <div className="metric_subtext">
                                    Net profit / Max drawdown
                                </div>
                            </div>
                        </div>

                        {/* Individual Account Drawdowns */}
                        <div className="charts_grid">
                            {risk_metrics?.account_risk_details?.map((account) => (
                                <div key={account.account_id} className="chart_section">
                                    <div className="chart_title">{account.account_name} - Drawdown Analysis</div>
                                    <div style={{marginBottom: '1rem'}}>
                                        <span className="metric_label">Max Drawdown: </span>
                                        <span className="negative" style={{fontSize: '1.2rem', fontWeight: 700}}>
                                            {account.max_drawdown?.toFixed(2)}%
                                        </span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={account.drawdown_curve}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e8f0fe" />
                                            <XAxis dataKey="period" stroke="#5f6368" tick={{fontSize: 11}} />
                                            <YAxis stroke="#5f6368" tick={{fontSize: 11}} />
                                            <Tooltip 
                                                contentStyle={{
                                                    background: '#ffffff',
                                                    border: '2px solid #ea4335',
                                                    borderRadius: '8px'
                                                }}
                                                formatter={(value) => [`${value.toFixed(2)}%`, 'Drawdown']}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="drawdown" 
                                                stroke="#ea4335" 
                                                strokeWidth={2}
                                                dot={false}
                                                name="Drawdown %"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Monte Carlo Tab */}
                {activeTab === 'monte_carlo' && (
                    <div className="charts_grid">
                        {monte_carlo_simulations?.map((simulation) => (
                            <div key={simulation.account_id} className="chart_section">
                                <div className="chart_title">
                                    {simulation.account_name} - 1 Year Projection
                                </div>
                                <div className="mini_metrics">
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Best Case</div>
                                        <div className="mini_metric_value positive">
                                            +{simulation.best_case_pct?.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Expected</div>
                                        <div className="mini_metric_value" style={{color: '#0066cc'}}>
                                            {simulation.expected_pct >= 0 ? '+' : ''}{simulation.expected_pct?.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="mini_metric">
                                        <div className="mini_metric_label">Worst Case</div>
                                        <div className="mini_metric_value negative">
                                            {simulation.worst_case_pct?.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={simulation.projection_data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e8f0fe" />
                                        <XAxis 
                                            dataKey="period" 
                                            stroke="#5f6368" 
                                            tick={{fontSize: 11}} 
                                            label={{value: 'Days', position: 'insideBottom', offset: -5}} 
                                        />
                                        <YAxis 
                                            stroke="#5f6368" 
                                            tick={{fontSize: 11}} 
                                            label={{value: 'Return %', angle: -90, position: 'insideLeft'}} 
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                background: '#ffffff',
                                                border: '2px solid #0066cc',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value) => [`${value.toFixed(2)}%`, '']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="best_case" 
                                            stroke="#0f9d58" 
                                            strokeWidth={2}
                                            dot={false}
                                            name="Best Case"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="expected" 
                                            stroke="#0066cc" 
                                            strokeWidth={3}
                                            dot={false}
                                            name="Expected"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="worst_case" 
                                            stroke="#ea4335" 
                                            strokeWidth={2}
                                            dot={false}
                                            name="Worst Case"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div className="scenario_legend">
                                    <div className="scenario_item">
                                        <div className="scenario_color" style={{background: '#0f9d58'}}></div>
                                        <span className="scenario_label">Best Case (95th percentile)</span>
                                    </div>
                                    <div className="scenario_item">
                                        <div className="scenario_color" style={{background: '#0066cc'}}></div>
                                        <span className="scenario_label">Expected (median)</span>
                                    </div>
                                    <div className="scenario_item">
                                        <div className="scenario_color" style={{background: '#ea4335'}}></div>
                                        <span className="scenario_label">Worst Case (5th percentile)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Capital Allocation Tab */}
                {activeTab === 'allocation' && (
                    <>
                        <div className="chart_section">
                            <div className="chart_title">
                                Optimal Capital Allocation Recommendations
                            </div>
                            <div className="metric_subtext" style={{marginBottom: '1.5rem'}}>
                                Based on risk-adjusted returns (Sharpe ratio), drawdown control, and overall performance
                            </div>
                            <div style={{overflowX: 'auto'}}>
                                <table className="allocation_table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Account</th>
                                            <th>Current Capital</th>
                                            <th>Performance</th>
                                            <th>Sharpe Ratio</th>
                                            <th>Max Drawdown</th>
                                            <th>Win Rate</th>
                                            <th>Recommended %</th>
                                            <th>New Capital</th>
                                            <th>Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {capital_allocation?.map((allocation, idx) => (
                                            <tr key={idx}>
                                                <td style={{fontWeight: 700, color: '#0066cc', fontSize: '1.1rem'}}>#{idx + 1}</td>
                                                <td style={{fontWeight: 600}}>{allocation.account_name}</td>
                                                <td>${allocation.current_capital?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                <td className={allocation.total_return >= 0 ? 'positive' : 'negative'} style={{fontWeight: 700}}>
                                                    {allocation.total_return >= 0 ? '+' : ''}{allocation.total_return?.toFixed(2)}%
                                                </td>
                                                <td style={{fontWeight: 600}}>{allocation.sharpe_ratio?.toFixed(3)}</td>
                                                <td className="negative" style={{fontWeight: 600}}>
                                                    {allocation.max_drawdown?.toFixed(2)}%
                                                </td>
                                                <td style={{fontWeight: 600}}>{allocation.win_rate?.toFixed(1)}%</td>
                                                <td style={{fontWeight: 700, fontSize: '1.1rem', color: '#0066cc'}}>
                                                    {allocation.recommended_allocation?.toFixed(1)}%
                                                </td>
                                                <td style={{fontWeight: 600}}>
                                                    ${allocation.recommended_capital?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                                </td>
                                                <td>
                                                    <span className={`priority_badge priority_${allocation.priority?.toLowerCase()}`}>
                                                        {allocation.priority}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Allocation Visualization */}
                        <div className="chart_section">
                            <div className="chart_title">Current vs Recommended Allocation</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={capital_allocation}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e8f0fe" />
                                    <XAxis 
                                        dataKey="account_name" 
                                        stroke="#5f6368" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={120} 
                                        tick={{fontSize: 11}} 
                                    />
                                    <YAxis 
                                        stroke="#5f6368" 
                                        label={{ value: 'Allocation %', angle: -90, position: 'insideLeft' }} 
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#ffffff',
                                            border: '2px solid #0066cc',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, '']}
                                    />
                                    <Legend />
                                    <Bar dataKey="current_allocation" fill="#80868b" name="Current %" />
                                    <Bar dataKey="recommended_allocation" fill="#0066cc" name="Recommended %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Performance Comparison */}
                        <div className="chart_section">
                            <div className="chart_title">Account Performance Comparison</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={capital_allocation} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e8f0fe" />
                                    <XAxis 
                                        type="number" 
                                        stroke="#5f6368" 
                                        label={{value: 'Return %', position: 'insideBottom', offset: -5}} 
                                    />
                                    <YAxis 
                                        dataKey="account_name" 
                                        type="category" 
                                        stroke="#5f6368" 
                                        width={150} 
                                        tick={{fontSize: 11}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#ffffff',
                                            border: '2px solid #0066cc',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [`${value.toFixed(2)}%`, 'Return']}
                                    />
                                    <Bar dataKey="total_return" name="Total Return %">
                                        {capital_allocation?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.total_return >= 0 ? '#0f9d58' : '#ea4335'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}