import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function MultiAccountAnalytics() {
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [performanceOverviewData, setPerformanceOverviewData] = useState(null);
    const [selectedAccountForEquityCurve, setSelectedAccountForEquityCurve] = useState(null);
    const [equityCurveData, setEquityCurveData] = useState(null);
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);
    const [isLoadingEquityCurve, setIsLoadingEquityCurve] = useState(false);

    // Fetch performance overview on mount
    useEffect(() => {
        fetchPerformanceOverview();
    }, []);

    // Fetch equity curve when account is selected
    useEffect(() => {
        if (selectedAccountForEquityCurve) {
            fetchEquityCurveForAccount(selectedAccountForEquityCurve);
        }
    }, [selectedAccountForEquityCurve]);

    const fetchPerformanceOverview = async () => {
        try {
            setIsLoadingOverview(true);
            const response = await fetch(`${baseUrl}/fetch_multi_account_performance_overview_data/`);
            const data = await response.json();
            
            if (data.success) {
                setPerformanceOverviewData(data);
                // Auto-select first account for equity curve
                if (data.all_accounts && data.all_accounts.length > 0) {
                    setSelectedAccountForEquityCurve(data.all_accounts[0].account_id);
                }
            }
        } catch (error) {
            console.error('Error fetching performance overview:', error);
        } finally {
            setIsLoadingOverview(false);
        }
    };

    const fetchEquityCurveForAccount = async (accountId) => {
        try {
            setIsLoadingEquityCurve(true);
            const response = await fetch(`${baseUrl}/fetch_account_equity_curve_progression_data/${accountId}/`);
            const data = await response.json();
            
            if (data.success) {
                setEquityCurveData(data);
            }
        } catch (error) {
            console.error('Error fetching equity curve:', error);
        } finally {
            setIsLoadingEquityCurve(false);
        }
    };

    const getColorForROI = (roi) => {
        if (roi > 0) return '#10b981';
        if (roi < 0) return '#ef4444';
        return '#6b7280';
    };

    const getColorForPnL = (pnl) => {
        if (pnl > 0) return '#10b981';
        if (pnl < 0) return '#ef4444';
        return '#6b7280';
    };

    const styles = {
        analyticsContainer: {
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
            backgroundColor: '#ffffff'
        },
        topCardsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        performanceCard: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        },
        cardTitle: {
            fontSize: '14px',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '15px',
            fontWeight: '600'
        },
        accountName: {
            fontSize: '20px',
            color: '#1f2937',
            fontWeight: '700',
            marginBottom: '10px'
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '15px'
        },
        metricItem: {
            display: 'flex',
            flexDirection: 'column'
        },
        metricLabel: {
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
        },
        metricValue: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
        },
        allAccountsSection: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        },
        sectionHeader: {
            fontSize: '18px',
            color: '#1f2937',
            fontWeight: '700',
            marginBottom: '20px',
            borderBottom: '2px solid #3b82f6',
            paddingBottom: '10px'
        },
        accountsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '15px'
        },
        accountCard: {
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '15px',
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
        },
        accountCardHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6'
        },
        accountCardSelected: {
            borderColor: '#3b82f6',
            backgroundColor: '#eff6ff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
        },
        equityCurveSection: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        },
        accountSelector: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '20px'
        },
        accountButton: {
            padding: '8px 16px',
            borderRadius: '6px',
            border: '2px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
        },
        accountButtonActive: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderColor: '#3b82f6'
        },
        chartContainer: {
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '400px',
            position: 'relative',
            border: '1px solid #e5e7eb'
        },
        svgChart: {
            width: '100%',
            height: '400px'
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#6b7280',
            fontSize: '16px'
        },
        badge: {
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            marginTop: '8px'
        },
        chartLegend: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            fontSize: '12px',
            color: '#6b7280'
        }
    };

    const renderEquityCurveChart = () => {
        if (!equityCurveData || !equityCurveData.equity_curve || equityCurveData.equity_curve.length === 0) {
            return <div style={styles.loadingSpinner}>No trade data available for this account</div>;
        }

        const data = equityCurveData.equity_curve;
        
        // Debug: log the equity curve data
        console.log('Equity Curve Data:', data);
        
        const width = 1000;
        const height = 350;
        const padding = { top: 20, right: 30, bottom: 40, left: 60 };

        const maxBalance = Math.max(...data.map(d => d.balance));
        const minBalance = Math.min(...data.map(d => d.balance));
        const maxTrade = Math.max(...data.map(d => d.trade_number));

        const xScale = (tradeNum) => padding.left + ((tradeNum / maxTrade) * (width - padding.left - padding.right));
        const yScale = (balance) => height - padding.bottom - ((balance - minBalance) / (maxBalance - minBalance)) * (height - padding.top - padding.bottom);

        const pathData = data.map((point, idx) => {
            const x = xScale(point.trade_number);
            const y = yScale(point.balance);
            return idx === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        }).join(' ');

        return (
            <div>
                <svg viewBox={`0 0 ${width} ${height}`} style={styles.svgChart}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = height - padding.bottom - (ratio * (height - padding.top - padding.bottom));
                        const balance = minBalance + (ratio * (maxBalance - minBalance));
                        return (
                            <g key={idx}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                    strokeDasharray="4"
                                />
                                <text x={padding.left - 10} y={y + 4} fill="#6b7280" fontSize="11" textAnchor="end">
                                    ${balance.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const x = padding.left + (ratio * (width - padding.left - padding.right));
                        const tradeNum = Math.round(ratio * maxTrade);
                        return (
                            <text key={idx} x={x} y={height - padding.bottom + 20} fill="#6b7280" fontSize="11" textAnchor="middle">
                                Trade {tradeNum}
                            </text>
                        );
                    })}

                    {/* Equity curve line */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                    />

                    {/* Data points */}
                    {data.map((point, idx) => (
                        <circle
                            key={idx}
                            cx={xScale(point.trade_number)}
                            cy={yScale(point.balance)}
                            r="4"
                            fill={point.outcome === 'Win' ? '#10b981' : point.outcome === 'Loss' ? '#ef4444' : '#3b82f6'}
                            stroke="#ffffff"
                            strokeWidth="2"
                        >
                            <title>
                                Trade {point.trade_number}
                                {point.asset ? ` - ${point.asset}` : ''}
                                {'\n'}Balance: ${point.balance}
                                {point.trade_amount !== undefined && point.trade_amount !== null ? `\nP&L: ${point.trade_amount}` : ''}
                            </title>
                        </circle>
                    ))}
                </svg>
                <div style={styles.chartLegend}>
                    <div>
                        <span style={{color: '#10b981'}}>● </span>Winning Trades
                        <span style={{marginLeft: '20px', color: '#ef4444'}}>● </span>Losing Trades
                    </div>
                    <div>
                        Initial: ${equityCurveData.initial_capital.toFixed(2)} → Current: ${equityCurveData.current_balance.toFixed(2)}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoadingOverview) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Multi-Account Analytics</h5>
                        <div style={styles.loadingSpinner}>Loading analytics data...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!performanceOverviewData) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Multi-Account Analytics</h5>
                        <div style={styles.loadingSpinner}>No data available</div>
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
                    <h5 className="major-upcoming-news-events-header">Multi-Account Analytics</h5>
                    
                    <div style={styles.analyticsContainer}>
                        {/* Top Performance Cards */}
                        <div style={styles.topCardsGrid}>
                            {/* Best Performer */}
                            {performanceOverviewData.best_performer && (
                                <div style={{...styles.performanceCard, borderTop: '4px solid #10b981'}}>
                                    <div style={styles.cardTitle}>🏆 Best Performer</div>
                                    <div style={styles.accountName}>{performanceOverviewData.best_performer.account_name}</div>
                                    <div style={styles.metricsGrid}>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>ROI</div>
                                            <div style={{...styles.metricValue, color: '#10b981'}}>
                                                {performanceOverviewData.best_performer.roi}%
                                            </div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Net P&L</div>
                                            <div style={{...styles.metricValue, color: getColorForPnL(performanceOverviewData.best_performer.net_pnl)}}>
                                                ${performanceOverviewData.best_performer.net_pnl}
                                            </div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Win Rate</div>
                                            <div style={styles.metricValue}>{performanceOverviewData.best_performer.win_rate}%</div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Total Trades</div>
                                            <div style={styles.metricValue}>{performanceOverviewData.best_performer.total_trades}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Worst Performer */}
                            {performanceOverviewData.worst_performer && (
                                <div style={{...styles.performanceCard, borderTop: '4px solid #ef4444'}}>
                                    <div style={styles.cardTitle}>📉 Worst Performer</div>
                                    <div style={styles.accountName}>{performanceOverviewData.worst_performer.account_name}</div>
                                    <div style={styles.metricsGrid}>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>ROI</div>
                                            <div style={{...styles.metricValue, color: '#ef4444'}}>
                                                {performanceOverviewData.worst_performer.roi}%
                                            </div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Net P&L</div>
                                            <div style={{...styles.metricValue, color: getColorForPnL(performanceOverviewData.worst_performer.net_pnl)}}>
                                                ${performanceOverviewData.worst_performer.net_pnl}
                                            </div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Win Rate</div>
                                            <div style={styles.metricValue}>{performanceOverviewData.worst_performer.win_rate}%</div>
                                        </div>
                                        <div style={styles.metricItem}>
                                            <div style={styles.metricLabel}>Total Trades</div>
                                            <div style={styles.metricValue}>{performanceOverviewData.worst_performer.total_trades}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Average Performance */}
                            <div style={{...styles.performanceCard, borderTop: '4px solid #3b82f6'}}>
                                <div style={styles.cardTitle}>📊 Average Performance</div>
                                <div style={styles.accountName}>Portfolio Metrics</div>
                                <div style={styles.metricsGrid}>
                                    <div style={styles.metricItem}>
                                        <div style={styles.metricLabel}>Avg ROI</div>
                                        <div style={{...styles.metricValue, color: getColorForROI(performanceOverviewData.averages.avg_roi)}}>
                                            {performanceOverviewData.averages.avg_roi}%
                                        </div>
                                    </div>
                                    <div style={styles.metricItem}>
                                        <div style={styles.metricLabel}>Avg Net P&L</div>
                                        <div style={{...styles.metricValue, color: getColorForPnL(performanceOverviewData.averages.avg_net_pnl)}}>
                                            ${performanceOverviewData.averages.avg_net_pnl}
                                        </div>
                                    </div>
                                    <div style={styles.metricItem}>
                                        <div style={styles.metricLabel}>Avg Win Rate</div>
                                        <div style={styles.metricValue}>{performanceOverviewData.averages.avg_win_rate}%</div>
                                    </div>
                                    <div style={styles.metricItem}>
                                        <div style={styles.metricLabel}>Total Accounts</div>
                                        <div style={styles.metricValue}>{performanceOverviewData.total_accounts}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* All Accounts Section */}
                        <div style={styles.allAccountsSection}>
                            <div style={styles.sectionHeader}>All Accounts Overview</div>
                            <div style={styles.accountsGrid}>
                                {performanceOverviewData.all_accounts.map((account) => (
                                    <div
                                        key={account.account_id}
                                        style={{
                                            ...styles.accountCard,
                                            ...(selectedAccountForEquityCurve === account.account_id ? styles.accountCardSelected : {})
                                        }}
                                        onClick={() => setSelectedAccountForEquityCurve(account.account_id)}
                                        onMouseEnter={(e) => {
                                            if (selectedAccountForEquityCurve !== account.account_id) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedAccountForEquityCurve !== account.account_id) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }
                                        }}
                                    >
                                        <div style={{fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '8px'}}>
                                            {account.account_name}
                                        </div>
                                        <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '12px'}}>
                                            {account.main_assets}
                                        </div>
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px'}}>
                                            <div>
                                                <div style={{color: '#6b7280'}}>ROI</div>
                                                <div style={{color: getColorForROI(account.roi), fontWeight: '600', fontSize: '14px'}}>
                                                    {account.roi}%
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{color: '#6b7280'}}>Net P&L</div>
                                                <div style={{color: getColorForPnL(account.net_pnl), fontWeight: '600', fontSize: '14px'}}>
                                                    ${account.net_pnl}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{color: '#6b7280'}}>Win Rate</div>
                                                <div style={{color: '#1f2937', fontWeight: '600'}}>{account.win_rate}%</div>
                                            </div>
                                            <div>
                                                <div style={{color: '#6b7280'}}>Trades</div>
                                                <div style={{color: '#1f2937', fontWeight: '600'}}>{account.total_trades}</div>
                                            </div>
                                        </div>
                                        <div style={{...styles.badge, backgroundColor: account.roi > 0 ? '#d1fae5' : '#fee2e2', color: account.roi > 0 ? '#065f46' : '#991b1b'}}>
                                            {account.roi > 0 ? '↑' : '↓'} ${account.current_balance.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Equity Curve Section */}
                        <div style={styles.equityCurveSection}>
                            <div style={styles.sectionHeader}>Account Equity Curve</div>
                            <div style={styles.accountSelector}>
                                {performanceOverviewData.all_accounts.map((account) => (
                                    <button
                                        key={account.account_id}
                                        style={{
                                            ...styles.accountButton,
                                            ...(selectedAccountForEquityCurve === account.account_id ? styles.accountButtonActive : {})
                                        }}
                                        onClick={() => setSelectedAccountForEquityCurve(account.account_id)}
                                        onMouseEnter={(e) => {
                                            if (selectedAccountForEquityCurve !== account.account_id) {
                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedAccountForEquityCurve !== account.account_id) {
                                                e.currentTarget.style.backgroundColor = '#ffffff';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }
                                        }}
                                    >
                                        {account.account_name}
                                    </button>
                                ))}
                            </div>
                            <div style={styles.chartContainer}>
                                {isLoadingEquityCurve ? (
                                    <div style={styles.loadingSpinner}>Loading equity curve...</div>
                                ) : (
                                    renderEquityCurveChart()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}