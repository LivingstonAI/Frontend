import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import Header from "./header";
import SideNavs from "./side_navs";

export default function DeepAccountDiagnostics() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [diagnosticsData, setDiagnosticsData] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-accounts-deep-analysis/`);
            const data = await response.json();
            if (data.success) {
                setAccounts(data.accounts);
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    const selectAccount = async (account) => {
        setSelectedAccount(account);
        setDiagnosticsData(null);
        setAiInsights(null);
        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}/api/deep-account-diagnostics/${account.id}/`);
            const data = await response.json();
            if (data.success) {
                setDiagnosticsData(data);
            }
        } catch (error) {
            console.error("Error fetching diagnostics:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAIInsights = async () => {
        if (!diagnosticsData) return;
        
        setAiLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/ai-enhanced-diagnostics/${selectedAccount.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    performance_data: diagnosticsData
                })
            });
            const data = await response.json();
            if (data.success) {
                setAiInsights(data.ai_insights);
            }
        } catch (error) {
            console.error("Error generating AI insights:", error);
        } finally {
            setAiLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const getPerformanceColor = (value) => {
        if (value > 0) return '#10B981';
        if (value < 0) return '#EF4444';
        return '#6B7280';
    };

    const getProbabilityColor = (probability) => {
        if (probability >= 70) return '#10B981';
        if (probability >= 50) return '#F59E0B';
        return '#EF4444';
    };


const styles = {
        container: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            backgroundColor: '#F8FAFC',
            minHeight: '100vh',
            padding: '20px'
        },
        header: {
            marginBottom: '30px',
            textAlign: 'center'
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
        },
        subtitle: {
            color: '#64748B',
            fontSize: '16px'
        },
        accountGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        accountCard: {
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        accountCardHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
            borderColor: '#3B82F6'
        },
        accountName: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1E293B'
        },
        accountDetails: {
            fontSize: '14px',
            color: '#64748B',
            marginBottom: '4px'
        },
        tabContainer: {
            display: 'flex',
            marginBottom: '30px',
            borderBottom: '2px solid #E2E8F0',
            overflowX: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px 8px 0 0'
        },
        tab: {
            padding: '12px 24px',
            cursor: 'pointer',
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            color: '#64748B',
            fontWeight: '500'
        },
        activeTab: {
            borderBottomColor: '#3B82F6',
            color: '#3B82F6',
            fontWeight: '600'
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        metricCard: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        metricValue: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '5px'
        },
        metricLabel: {
            fontSize: '14px',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
        },
        chartContainer: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        chartTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#1E293B'
        },
        probabilityCard: {
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            borderRadius: '16px',
            padding: '25px',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)'
        },
        probabilityValue: {
            fontSize: '36px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '8px'
        },
        probabilityLabel: {
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500'
        },
        aiButton: {
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '20px auto',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
        },
        aiToggleButton: {
            background: aiInsights ? '#22C55E' : '#8B5CF6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px'
        },
        aiInsightsContainer: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '25px',
            marginTop: '20px',
            border: '1px solid #8B5CF6',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)'
        },
        aiInsightsTitle: {
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        aiInsightsContent: {
            lineHeight: '1.6',
            color: '#374151',
            whiteSpace: 'pre-line'
        },
        tableContainer: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            backgroundColor: '#F8FAFC',
            color: '#1E293B',
            fontWeight: '600',
            padding: '12px',
            textAlign: 'left',
            borderRadius: '8px 8px 0 0',
            borderBottom: '2px solid #E2E8F0'
        },
        tableCell: {
            padding: '12px',
            borderBottom: '1px solid #E2E8F0',
            color: '#374151'
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px',
            color: '#64748B',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
        },
        streakContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
        },
        streakCard: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        riskMetricCard: {
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        riskMetricTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#1E293B'
        },
        riskMetricValue: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#3B82F6'
        },
        emotionalPattern: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #E2E8F0'
        },
        backButton: {
            background: '#6B7280',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease'
        }
    };















    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

    const renderOverviewTab = () => (
        <div>
            {/* Current Time-Based Probability */}
            <div style={styles.probabilityCard}>
                <div style={styles.probabilityValue}>
                    {diagnosticsData.time_analysis.time_based_win_probability}%
                </div>
                <div style={styles.probabilityLabel}>
                    Current Win Probability ({diagnosticsData.time_analysis.current_day} - {diagnosticsData.time_analysis.current_session})
                </div>
                <div style={{fontSize: '14px', marginTop: '10px', opacity: 0.8}}>
                    Based on your historical performance at this time
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                    <div style={{...styles.metricValue, color: getPerformanceColor(diagnosticsData.basic_metrics.net_pnl)}}>
                        {formatCurrency(diagnosticsData.basic_metrics.net_pnl)}
                    </div>
                    <div style={styles.metricLabel}>Net P&L</div>
                </div>
                <div style={styles.metricCard}>
                    <div style={{...styles.metricValue, color: diagnosticsData.basic_metrics.win_rate >= 50 ? '#10B981' : '#EF4444'}}>
                        {diagnosticsData.basic_metrics.win_rate}%
                    </div>
                    <div style={styles.metricLabel}>Win Rate</div>
                </div>
                <div style={styles.metricCard}>
                    <div style={{...styles.metricValue, color: '#667eea'}}>
                        {diagnosticsData.basic_metrics.total_trades}
                    </div>
                    <div style={styles.metricLabel}>Total Trades</div>
                </div>
                <div style={styles.metricCard}>
                    <div style={{...styles.metricValue, color: diagnosticsData.basic_metrics.risk_reward_ratio >= 1 ? '#10B981' : '#F59E0B'}}>
                        {diagnosticsData.basic_metrics.risk_reward_ratio}
                    </div>
                    <div style={styles.metricLabel}>Risk/Reward Ratio</div>
                </div>
            </div>

            {/* Monthly Performance Chart */}
            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Monthly Performance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={diagnosticsData.monthly_performance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px'}}
                            labelStyle={{color: '#FFFFFF'}}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="pnl" stroke="#667eea" strokeWidth={3} name="P&L" />
                        <Line type="monotone" dataKey="win_rate" stroke="#10B981" strokeWidth={2} name="Win Rate %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderPerformanceTab = () => (
        <div>
            {/* Asset Performance */}
            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Asset Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={diagnosticsData.asset_performance.slice(0, 8)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="asset" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px'}}
                            labelStyle={{color: '#FFFFFF'}}
                        />
                        <Bar dataKey="total_pnl" name="Total P&L">
                            {diagnosticsData.asset_performance.slice(0, 8).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getPerformanceColor(entry.total_pnl)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Strategy Performance */}
            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Strategy Performance</h3>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Strategy</th>
                                <th style={styles.tableHeader}>Trades</th>
                                <th style={styles.tableHeader}>Win Rate</th>
                                <th style={styles.tableHeader}>Total P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diagnosticsData.strategy_performance.map((strategy, index) => (
                                <tr key={index}>
                                    <td style={styles.tableCell}>{strategy.strategy}</td>
                                    <td style={styles.tableCell}>{strategy.total_trades}</td>
                                    <td style={{...styles.tableCell, color: strategy.win_rate >= 50 ? '#10B981' : '#EF4444'}}>
                                        {strategy.win_rate}%
                                    </td>
                                    <td style={{...styles.tableCell, color: getPerformanceColor(strategy.total_pnl)}}>
                                        {formatCurrency(strategy.total_pnl)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRiskTab = () => (
        <div>
            {/* Drawdown Analysis */}
            <div style={styles.metricsGrid}>
                <div style={styles.riskMetricCard}>
                    <div style={styles.riskMetricTitle}>Maximum Drawdown</div>
                    <div style={{...styles.riskMetricValue, color: '#EF4444'}}>
                        {diagnosticsData.drawdown_analysis.max_drawdown}%
                    </div>
                </div>
                <div style={styles.riskMetricCard}>
                    <div style={styles.riskMetricTitle}>Current Drawdown</div>
                    <div style={{...styles.riskMetricValue, color: getPerformanceColor(-diagnosticsData.drawdown_analysis.current_drawdown)}}>
                        {diagnosticsData.drawdown_analysis.current_drawdown}%
                    </div>
                </div>
                <div style={styles.riskMetricCard}>
                    <div style={styles.riskMetricTitle}>Current Balance</div>
                    <div style={styles.riskMetricValue}>
                        {formatCurrency(diagnosticsData.drawdown_analysis.current_balance)}
                    </div>
                </div>
                <div style={styles.riskMetricCard}>
                    <div style={styles.riskMetricTitle}>Peak Balance</div>
                    <div style={styles.riskMetricValue}>
                        {formatCurrency(diagnosticsData.drawdown_analysis.peak_balance)}
                    </div>
                </div>
            </div>

            {/* Risk Metrics */}
            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Advanced Risk Metrics</h3>
                <div style={styles.metricsGrid}>
                    <div style={styles.metricCard}>
                        <div style={{...styles.metricValue, color: '#667eea'}}>
                            {diagnosticsData.risk_metrics.sharpe_ratio}
                        </div>
                        <div style={styles.metricLabel}>Sharpe Ratio</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={{...styles.metricValue, color: '#F59E0B'}}>
                            {diagnosticsData.risk_metrics.volatility}%
                        </div>
                        <div style={styles.metricLabel}>Volatility</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={{...styles.metricValue, color: '#EF4444'}}>
                            {diagnosticsData.risk_metrics.var_95}%
                        </div>
                        <div style={styles.metricLabel}>VaR (95%)</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={{...styles.metricValue, color: '#EF4444'}}>
                            {diagnosticsData.risk_metrics.max_consecutive_losses}
                        </div>
                        <div style={styles.metricLabel}>Max Consecutive Losses</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPsychologyTab = () => (
        <div>
            {/* Streaks Analysis */}
            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Trading Streaks</h3>
                <div style={styles.streakContainer}>
                    <div style={styles.streakCard}>
                        <div style={{...styles.metricValue, color: '#10B981'}}>
                            {diagnosticsData.streaks_data.max_winning_streak}
                        </div>
                        <div style={styles.metricLabel}>Max Winning Streak</div>
                    </div>
                    <div style={styles.streakCard}>
                        <div style={{...styles.metricValue, color: '#EF4444'}}>
                            {diagnosticsData.streaks_data.max_losing_streak}
                        </div>
                        <div style={styles.metricLabel}>Max Losing Streak</div>
                    </div>
                    <div style={styles.streakCard}>
                        <div style={{...styles.metricValue, color: diagnosticsData.streaks_data.current_streak_type === 'win' ? '#10B981' : '#EF4444'}}>
                            {diagnosticsData.streaks_data.current_streak}
                        </div>
                        <div style={styles.metricLabel}>
                            Current {diagnosticsData.streaks_data.current_streak_type === 'win' ? 'Winning' : 'Losing'} Streak
                        </div>
                    </div>
                </div>
            </div>

            {/* Emotional Analysis */}
            {diagnosticsData.emotional_analysis.has_data && (
                <div style={styles.chartContainer}>
                    <h3 style={styles.chartTitle}>Emotional Patterns</h3>
                    {diagnosticsData.emotional_analysis.patterns.map((pattern, index) => (
                        <div key={index} style={styles.emotionalPattern}>
                            <span>{pattern.emotion}</span>
                            <span>{pattern.trade_count} trades</span>
                            <span style={{color: pattern.win_rate >= 50 ? '#10B981' : '#EF4444'}}>
                                {pattern.win_rate}% win rate
                            </span>
                            <span style={{color: getPerformanceColor(pattern.avg_pnl)}}>
                                {formatCurrency(pattern.avg_pnl)} avg
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={styles.container}>
                    <div className="header">
                        <Header />
                    </div>
                    <div className="main-page-body">
                        <SideNavs />
                        <div className="main-body-info">
            <div style={styles.header}>
                <h1 style={styles.title}>SnowAI Deep Account Diagnostics</h1>
                <p style={styles.subtitle}>Advanced Performance Analytics & AI-Powered Insights</p>
            </div>

            {!selectedAccount ? (
                <div>
                    <h2 style={{marginBottom: '20px', color: '#FFFFFF'}}>Select an Account to Analyze</h2>
                    <div style={styles.accountGrid}>
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                style={styles.accountCard}
                                onClick={() => selectAccount(account)}
                                onMouseEnter={(e) => Object.assign(e.target.style, styles.accountCardHover)}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0px)';
                                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                                    e.target.style.borderColor = '#2D3748';
                                }}
                            >
                                <div style={styles.accountName}>{account.account_name}</div>
                                <div style={styles.accountDetails}>Assets: {account.main_assets}</div>
                                <div style={styles.accountDetails}>
                                    Initial Capital: {formatCurrency(account.initial_capital)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px'}}>
                        <button
                            onClick={() => {
                                setSelectedAccount(null);
                                setDiagnosticsData(null);
                                setAiInsights(null);
                            }}
                            style={{
                                background: '#374151',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Accounts
                        </button>
                        <h2 style={{margin: 0, color: '#FFFFFF'}}>
                            {selectedAccount.account_name} - Deep Analysis
                        </h2>
                    </div>

                    {loading ? (
                        <div style={styles.loadingSpinner}>
                            <div>Loading comprehensive diagnostics...</div>
                        </div>
                    ) : diagnosticsData ? (
                        <div>
                            {/* Tab Navigation */}
                            <div style={styles.tabContainer}>
                                {['overview', 'performance', 'risk', 'psychology'].map((tab) => (
                                    <div
                                        key={tab}
                                        style={{
                                            ...styles.tab,
                                            ...(activeTab === tab ? styles.activeTab : {})
                                        }}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </div>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && renderOverviewTab()}
                            {activeTab === 'performance' && renderPerformanceTab()}
                            {activeTab === 'risk' && renderRiskTab()}
                            {activeTab === 'psychology' && renderPsychologyTab()}

                            {/* AI Insights Button */}
                            <button
                                onClick={generateAIInsights}
                                disabled={aiLoading}
                                style={{
                                    ...styles.aiButton,
                                    opacity: aiLoading ? 0.7 : 1,
                                    cursor: aiLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                🤖 {aiLoading ? 'Generating AI Insights...' : 'Generate AI Enhanced Diagnostics'}
                            </button>

                            {/* AI Insights Display */}
                            {aiInsights && (
                                <div style={styles.aiInsightsContainer}>
                                    <h3 style={styles.aiInsightsTitle}>
                                        🧠 AI-Enhanced Diagnostic Insights
                                    </h3>
                                    <div style={styles.aiInsightsContent}>
                                        {aiInsights}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
        </div>
        </div>
        
    );
}