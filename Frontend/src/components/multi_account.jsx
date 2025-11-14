import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

const styles = `
.portfolio_aggregate_analytics_container {
    width: 100%;
    background: #0a0e27;
    min-height: 100vh;
    color: #e8e9f3;
}

.portfolio_analytics_content_wrapper {
    padding: 2rem;
    max-width: 1800px;
    margin: 0 auto;
}

.portfolio_major_header_title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #00d4ff;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.portfolio_metrics_grid_supreme {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.portfolio_metric_card_elite {
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1329 100%);
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.portfolio_metric_card_elite:hover {
    transform: translateY(-4px);
    border-color: #00d4ff;
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);
}

.portfolio_metric_label_pro {
    font-size: 0.85rem;
    color: #8b92b0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.portfolio_metric_value_showcase {
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.3rem;
}

.portfolio_metric_subtext_detail {
    font-size: 0.9rem;
    color: #6c7a9b;
}

.portfolio_positive_indicator {
    color: #00ff88;
}

.portfolio_negative_indicator {
    color: #ff4757;
}

.portfolio_neutral_indicator {
    color: #ffa502;
}

.portfolio_chart_section_master {
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1329 100%);
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.portfolio_chart_title_bold {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #00d4ff;
}

.portfolio_accounts_ranking_supreme {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.portfolio_ranking_card_premium {
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1329 100%);
    border: 1px solid #2a3f5f;
    border-radius: 12px;
    padding: 1.5rem;
}

.portfolio_ranking_header_elite {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #00d4ff;
    border-bottom: 2px solid #2a3f5f;
    padding-bottom: 0.5rem;
}

.portfolio_account_item_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
}

.portfolio_account_item_row:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: #00d4ff;
}

.portfolio_account_rank_badge {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00d4ff;
    margin-right: 1rem;
}

.portfolio_account_info_block {
    flex: 1;
}

.portfolio_account_name_display {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.3rem;
}

.portfolio_account_stats_mini {
    font-size: 0.85rem;
    color: #8b92b0;
}

.portfolio_account_performance_badge {
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    border-radius: 6px;
}

.portfolio_loading_state_container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 1.2rem;
    color: #8b92b0;
}

.portfolio_error_state_display {
    background: rgba(255, 71, 87, 0.1);
    border: 1px solid #ff4757;
    border-radius: 8px;
    padding: 1.5rem;
    color: #ff4757;
    text-align: center;
}

.portfolio_monte_carlo_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.portfolio_allocation_table_wrapper {
    overflow-x: auto;
}

.portfolio_allocation_table_elite {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.portfolio_allocation_table_elite th {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #2a3f5f;
}

.portfolio_allocation_table_elite td {
    padding: 1rem;
    border-bottom: 1px solid #2a3f5f;
}

.portfolio_allocation_table_elite tr:hover {
    background: rgba(255, 255, 255, 0.03);
}

.portfolio_recommendation_badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
}

.portfolio_rec_high {
    background: rgba(0, 255, 136, 0.15);
    color: #00ff88;
    border: 1px solid #00ff88;
}

.portfolio_rec_medium {
    background: rgba(255, 165, 2, 0.15);
    color: #ffa502;
    border: 1px solid #ffa502;
}

.portfolio_rec_low {
    background: rgba(255, 71, 87, 0.15);
    color: #ff4757;
    border: 1px solid #ff4757;
}

.portfolio_tabs_container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #2a3f5f;
}

.portfolio_tab_button {
    background: transparent;
    border: none;
    color: #8b92b0;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
}

.portfolio_tab_button:hover {
    color: #00d4ff;
}

.portfolio_tab_button.active {
    color: #00d4ff;
    border-bottom-color: #00d4ff;
}
`;

export default function MultiAccountAnalytics() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [portfolioAggregatedData, setPortfolioAggregatedData] = useState(null);
    const [isLoadingPortfolioData, setIsLoadingPortfolioData] = useState(true);
    const [portfolioErrorMessage, setPortfolioErrorMessage] = useState(null);
    const [activePortfolioTab, setActivePortfolioTab] = useState('overview');

    useEffect(() => {
        fetchComprehensivePortfolioAnalytics();
    }, []);

    const fetchComprehensivePortfolioAnalytics = async () => {
        try {
            setIsLoadingPortfolioData(true);
            const response = await fetch(`${baseUrl}/api/supreme_multi_account_analytics_endpoint/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch portfolio analytics');
            }

            const analyticsData = await response.json();
            setPortfolioAggregatedData(analyticsData);
            setIsLoadingPortfolioData(false);
        } catch (error) {
            console.error('Error fetching portfolio analytics:', error);
            setPortfolioErrorMessage(error.message);
            setIsLoadingPortfolioData(false);
        }
    };

    if (isLoadingPortfolioData) {
        return (
            <div className="portfolio_aggregate_analytics_container">
                <style>{styles}</style>
                <Header />
                <SideNavs />
                <div className="portfolio_analytics_content_wrapper">
                    <div className="portfolio_loading_state_container">
                        Loading comprehensive portfolio analytics...
                    </div>
                </div>
            </div>
        );
    }

    if (portfolioErrorMessage) {
        return (
            <div className="portfolio_aggregate_analytics_container">
                <style>{styles}</style>
                <Header />
                <SideNavs />
                <div className="portfolio_analytics_content_wrapper">
                    <div className="portfolio_error_state_display">
                        Error: {portfolioErrorMessage}
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolioAggregatedData) {
        return null;
    }

    const {
        overview_metrics,
        best_accounts,
        worst_accounts,
        average_performance,
        equity_curves,
        risk_metrics,
        capital_allocation,
        monte_carlo_simulations,
        correlation_matrix
    } = portfolioAggregatedData;

    return (
        <div className="portfolio_aggregate_analytics_container">
            <style>{styles}</style>
            <Header />
            <SideNavs />
            <div className="portfolio_analytics_content_wrapper">
                <h5 className="portfolio_major_header_title">Multi-Account Portfolio Analytics</h5>

                {/* Portfolio Tabs */}
                <div className="portfolio_tabs_container">
                    <button 
                        className={`portfolio_tab_button ${activePortfolioTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActivePortfolioTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`portfolio_tab_button ${activePortfolioTab === 'risk' ? 'active' : ''}`}
                        onClick={() => setActivePortfolioTab('risk')}
                    >
                        Risk Analysis
                    </button>
                    <button 
                        className={`portfolio_tab_button ${activePortfolioTab === 'monte_carlo' ? 'active' : ''}`}
                        onClick={() => setActivePortfolioTab('monte_carlo')}
                    >
                        Monte Carlo
                    </button>
                    <button 
                        className={`portfolio_tab_button ${activePortfolioTab === 'allocation' ? 'active' : ''}`}
                        onClick={() => setActivePortfolioTab('allocation')}
                    >
                        Capital Allocation
                    </button>
                </div>

                {/* Overview Tab */}
                {activePortfolioTab === 'overview' && (
                    <>
                        {/* Key Metrics Grid */}
                        <div className="portfolio_metrics_grid_supreme">
                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Total Portfolio Value</div>
                                <div className="portfolio_metric_value_showcase">
                                    ${overview_metrics?.total_portfolio_value?.toLocaleString() || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Across {overview_metrics?.total_accounts || 0} accounts
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Total P&L</div>
                                <div className={`portfolio_metric_value_showcase ${overview_metrics?.total_pnl >= 0 ? 'portfolio_positive_indicator' : 'portfolio_negative_indicator'}`}>
                                    ${overview_metrics?.total_pnl?.toLocaleString() || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    {overview_metrics?.total_pnl_percentage?.toFixed(2) || '0'}% return
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Portfolio Sharpe Ratio</div>
                                <div className="portfolio_metric_value_showcase portfolio_positive_indicator">
                                    {overview_metrics?.portfolio_sharpe_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Risk-adjusted returns
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Win Rate</div>
                                <div className="portfolio_metric_value_showcase">
                                    {overview_metrics?.overall_win_rate?.toFixed(1) || '0'}%
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    {overview_metrics?.total_trades || 0} total trades
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Max Drawdown</div>
                                <div className="portfolio_metric_value_showcase portfolio_negative_indicator">
                                    {overview_metrics?.max_drawdown?.toFixed(2) || '0'}%
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Portfolio-wide
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Profit Factor</div>
                                <div className={`portfolio_metric_value_showcase ${overview_metrics?.profit_factor >= 1 ? 'portfolio_positive_indicator' : 'portfolio_negative_indicator'}`}>
                                    {overview_metrics?.profit_factor?.toFixed(2) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Gross profit / Gross loss
                                </div>
                            </div>
                        </div>

                        {/* Account Rankings */}
                        <div className="portfolio_accounts_ranking_supreme">
                            {/* Best Performing Accounts */}
                            <div className="portfolio_ranking_card_premium">
                                <div className="portfolio_ranking_header_elite">🏆 Top Performing Accounts</div>
                                {best_accounts?.map((account, index) => (
                                    <div key={account.account_id} className="portfolio_account_item_row">
                                        <span className="portfolio_account_rank_badge">#{index + 1}</span>
                                        <div className="portfolio_account_info_block">
                                            <div className="portfolio_account_name_display">{account.account_name}</div>
                                            <div className="portfolio_account_stats_mini">
                                                Sharpe: {account.sharpe_ratio?.toFixed(2)} | Win Rate: {account.win_rate?.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="portfolio_account_performance_badge portfolio_positive_indicator">
                                            +{account.total_return?.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Worst Performing Accounts */}
                            <div className="portfolio_ranking_card_premium">
                                <div className="portfolio_ranking_header_elite">⚠️ Underperforming Accounts</div>
                                {worst_accounts?.map((account, index) => (
                                    <div key={account.account_id} className="portfolio_account_item_row">
                                        <span className="portfolio_account_rank_badge">#{index + 1}</span>
                                        <div className="portfolio_account_info_block">
                                            <div className="portfolio_account_name_display">{account.account_name}</div>
                                            <div className="portfolio_account_stats_mini">
                                                Sharpe: {account.sharpe_ratio?.toFixed(2)} | Win Rate: {account.win_rate?.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="portfolio_account_performance_badge portfolio_negative_indicator">
                                            {account.total_return?.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Equity Curves */}
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">Portfolio Equity Curves</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={equity_curves}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis dataKey="date" stroke="#8b92b0" />
                                    <YAxis stroke="#8b92b0" />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#1a1f3a',
                                            border: '1px solid #2a3f5f',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="portfolio_value" 
                                        stroke="#00d4ff" 
                                        strokeWidth={3}
                                        name="Portfolio Value"
                                        dot={false}
                                    />
                                    {best_accounts?.slice(0, 3).map((account, idx) => (
                                        <Line 
                                            key={account.account_id}
                                            type="monotone" 
                                            dataKey={`account_${account.account_id}`}
                                            stroke={['#00ff88', '#ffa502', '#ff6b9d'][idx]}
                                            strokeWidth={2}
                                            name={account.account_name}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {/* Risk Analysis Tab */}
                {activePortfolioTab === 'risk' && (
                    <>
                        <div className="portfolio_metrics_grid_supreme">
                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Value at Risk (95%)</div>
                                <div className="portfolio_metric_value_showcase portfolio_negative_indicator">
                                    ${risk_metrics?.value_at_risk?.toLocaleString() || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Daily VaR estimate
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Sortino Ratio</div>
                                <div className="portfolio_metric_value_showcase portfolio_positive_indicator">
                                    {risk_metrics?.sortino_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Downside risk adjusted
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Calmar Ratio</div>
                                <div className="portfolio_metric_value_showcase">
                                    {risk_metrics?.calmar_ratio?.toFixed(3) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Return / Max Drawdown
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Portfolio Volatility</div>
                                <div className="portfolio_metric_value_showcase portfolio_neutral_indicator">
                                    {risk_metrics?.portfolio_volatility?.toFixed(2) || '0'}%
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Annualized std dev
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Beta</div>
                                <div className="portfolio_metric_value_showcase">
                                    {risk_metrics?.beta?.toFixed(3) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Market sensitivity
                                </div>
                            </div>

                            <div className="portfolio_metric_card_elite">
                                <div className="portfolio_metric_label_pro">Recovery Factor</div>
                                <div className="portfolio_metric_value_showcase portfolio_positive_indicator">
                                    {risk_metrics?.recovery_factor?.toFixed(2) || '0'}
                                </div>
                                <div className="portfolio_metric_subtext_detail">
                                    Net profit / Max drawdown
                                </div>
                            </div>
                        </div>

                        {/* Drawdown Chart */}
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">Portfolio Drawdown Analysis</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={risk_metrics?.drawdown_series || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis dataKey="date" stroke="#8b92b0" />
                                    <YAxis stroke="#8b92b0" />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#1a1f3a',
                                            border: '1px solid #2a3f5f',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="drawdown" 
                                        stroke="#ff4757" 
                                        fill="#ff475730"
                                        name="Drawdown %"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Correlation Matrix */}
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">Account Correlation Matrix</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis type="number" dataKey="x" stroke="#8b92b0" domain={[-1, 1]} />
                                    <YAxis type="number" dataKey="y" stroke="#8b92b0" domain={[-1, 1]} />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#1a1f3a',
                                            border: '1px solid #2a3f5f',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Scatter 
                                        data={correlation_matrix || []} 
                                        fill="#00d4ff"
                                    />
                                    <ReferenceLine x={0} stroke="#8b92b0" />
                                    <ReferenceLine y={0} stroke="#8b92b0" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {/* Monte Carlo Tab */}
                {activePortfolioTab === 'monte_carlo' && (
                    <>
                        <div className="portfolio_monte_carlo_grid">
                            {monte_carlo_simulations?.map((simulation, idx) => (
                                <div key={idx} className="portfolio_chart_section_master">
                                    <div className="portfolio_chart_title_bold">
                                        {simulation.account_name} - Monte Carlo Simulation
                                    </div>
                                    <div className="portfolio_metrics_grid_supreme" style={{marginBottom: '1rem'}}>
                                        <div className="portfolio_metric_card_elite">
                                            <div className="portfolio_metric_label_pro">Expected Value (1 Year)</div>
                                            <div className="portfolio_metric_value_showcase">
                                                ${simulation.expected_value?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                        <div className="portfolio_metric_card_elite">
                                            <div className="portfolio_metric_label_pro">95% Confidence Range</div>
                                            <div className="portfolio_metric_value_showcase" style={{fontSize: '1.2rem'}}>
                                                ${simulation.conf_lower?.toLocaleString()} - ${simulation.conf_upper?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={simulation.simulation_paths?.slice(0, 50) || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                            <XAxis dataKey="period" stroke="#8b92b0" />
                                            <YAxis stroke="#8b92b0" />
                                            <Tooltip 
                                                contentStyle={{
                                                    background: '#1a1f3a',
                                                    border: '1px solid #2a3f5f',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            {simulation.simulation_paths?.[0] && Object.keys(simulation.simulation_paths[0])
                                                .filter(key => key !== 'period')
                                                .slice(0, 20)
                                                .map((pathKey, pathIdx) => (
                                                    <Line 
                                                        key={pathKey}
                                                        type="monotone" 
                                                        dataKey={pathKey}
                                                        stroke={`rgba(0, 212, 255, ${0.1 + (pathIdx * 0.02)})`}
                                                        strokeWidth={1}
                                                        dot={false}
                                                    />
                                                ))
                                            }
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Capital Allocation Tab */}
                {activePortfolioTab === 'allocation' && (
                    <>
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">
                                Optimal Capital Allocation Recommendations
                            </div>
                            <div className="portfolio_allocation_table_wrapper">
                                <table className="portfolio_allocation_table_elite">
                                    <thead>
                                        <tr>
                                            <th>Account</th>
                                            <th>Current Capital</th>
                                            <th>Sharpe Ratio</th>
                                            <th>Max Drawdown</th>
                                            <th>Recommended Allocation</th>
                                            <th>New Capital</th>
                                            <th>Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {capital_allocation?.map((allocation, idx) => (
                                            <tr key={idx}>
                                                <td style={{fontWeight: 600}}>{allocation.account_name}</td>
                                                <td>${allocation.current_capital?.toLocaleString()}</td>
                                                <td>{allocation.sharpe_ratio?.toFixed(3)}</td>
                                                <td className="portfolio_negative_indicator">
                                                    {allocation.max_drawdown?.toFixed(2)}%
                                                </td>
                                                <td style={{fontWeight: 700, fontSize: '1.1rem'}}>
                                                    {allocation.recommended_allocation?.toFixed(1)}%
                                                </td>
                                                <td style={{fontWeight: 600}}>
                                                    ${allocation.recommended_capital?.toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className={`portfolio_recommendation_badge portfolio_rec_${allocation.priority?.toLowerCase()}`}>
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
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">Current vs Recommended Allocation</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={capital_allocation}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis dataKey="account_name" stroke="#8b92b0" angle={-45} textAnchor="end" height={100} />
                                    <YAxis stroke="#8b92b0" label={{ value: 'Allocation %', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#1a1f3a',
                                            border: '1px solid #2a3f5f',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="current_allocation" fill="#8b92b0" name="Current %" />
                                    <Bar dataKey="recommended_allocation" fill="#00d4ff" name="Recommended %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk-Return Scatter */}
                        <div className="portfolio_chart_section_master">
                            <div className="portfolio_chart_title_bold">Risk-Return Profile by Account</div>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="max_drawdown" 
                                        name="Max Drawdown" 
                                        stroke="#8b92b0"
                                        label={{ value: 'Risk (Max Drawdown %)', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="total_return" 
                                        name="Total Return" 
                                        stroke="#8b92b0"
                                        label={{ value: 'Return %', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            background: '#1a1f3a',
                                            border: '1px solid #2a3f5f',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [value?.toFixed(2), name]}
                                    />
                                    <Scatter 
                                        data={capital_allocation?.map(a => ({
                                            max_drawdown: Math.abs(a.max_drawdown),
                                            total_return: a.total_return,
                                            name: a.account_name
                                        }))} 
                                        fill="#00d4ff"
                                    >
                                        {capital_allocation?.map((entry, index) => (
                                            <text
                                                key={index}
                                                x={Math.abs(entry.max_drawdown)}
                                                y={entry.total_return}
                                                fill="#e8e9f3"
                                                fontSize={10}
                                            >
                                                {entry.account_name}
                                            </text>
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}