import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function BoardofGovernors() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [analysisDetails, setAnalysisDetails] = useState(null);
    const [processingAnalysis, setProcessingAnalysis] = useState(null);
    const [error, setError] = useState('');

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/snowai-transcript-analysis-dashboard-data/`);
            if (!response.ok) throw new Error("Failed to fetch dashboard data");
            const result = await response.json();
            if (result.success) {
                setDashboardData(result.data);
            } else {
                setError(result.error || 'Failed to load data');
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Trigger AI analysis
    const triggerAnalysis = async (transcriptUuid) => {
        try {
            setProcessingAnalysis(transcriptUuid);
            setError('');
            
            const response = await fetch(`${baseUrl}/snowai-trigger-transcript-analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transcript_uuid: transcriptUuid })
            });
            
            const result = await response.json();
            if (result.success) {
                // Refresh dashboard data
                await fetchDashboardData();
                setError('');
            } else {
                setError(result.error || 'Failed to trigger analysis');
            }
        } catch (error) {
            console.error("Error triggering analysis:", error);
            setError(error.message);
        } finally {
            setProcessingAnalysis(null);
        }
    };

    // Get analysis details
    const getAnalysisDetails = async (transcriptUuid) => {
        try {
            const response = await fetch(`${baseUrl}/snowai-transcript-analysis-details/${transcriptUuid}/`);
            const result = await response.json();
            if (result.success) {
                setAnalysisDetails(result.data);
                setSelectedTranscript(transcriptUuid);
            } else {
                setError(result.error || 'Failed to load analysis details');
            }
        } catch (error) {
            console.error("Error fetching analysis details:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '#28a745';
            case 'negative': return '#dc3545';
            case 'mixed': return '#fd7e14';
            default: return '#6c757d';
        }
    };

    const getOutlookColor = (outlook) => {
        switch (outlook) {
            case 'bullish': return '#28a745';
            case 'bearish': return '#dc3545';
            case 'uncertain': return '#fd7e14';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div style={styles.container}>
                        <h2 style={styles.title}>AI Transcript Analysis Dashboard</h2>
                        
                        {loading ? (
                            <div style={styles.loading}>Loading dashboard data...</div>
                        ) : error ? (
                            <div style={styles.error}>{error}</div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                {dashboardData?.stats && (
                                    <div style={styles.statsGrid}>
                                        <div style={styles.statCard}>
                                            <div style={styles.statNumber}>
                                                {dashboardData.stats.total_transcripts}
                                            </div>
                                            <div style={styles.statLabel}>Total Transcripts</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{...styles.statNumber, color: '#28a745'}}>
                                                {dashboardData.stats.analyzed_transcripts}
                                            </div>
                                            <div style={styles.statLabel}>Analyzed</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{...styles.statNumber, color: '#fd7e14'}}>
                                                {dashboardData.stats.pending_analysis}
                                            </div>
                                            <div style={styles.statLabel}>Pending Analysis</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={{...styles.statNumber, color: '#007bff'}}>
                                                {Math.round(dashboardData.stats.analysis_completion_rate)}%
                                            </div>
                                            <div style={styles.statLabel}>Completion Rate</div>
                                        </div>
                                    </div>
                                )}

                                {/* Transcripts Table */}
                                <div style={styles.tableContainer}>
                                    <h3 style={styles.sectionTitle}>Recent Transcripts</h3>
                                    <div style={styles.table}>
                                        <div style={styles.tableHeader}>
                                            <div style={styles.tableHeaderCell}>Speaker</div>
                                            <div style={styles.tableHeaderCell}>Title</div>
                                            <div style={styles.tableHeaderCell}>Organization</div>
                                            <div style={styles.tableHeaderCell}>Date</div>
                                            <div style={styles.tableHeaderCell}>Status</div>
                                            <div style={styles.tableHeaderCell}>Actions</div>
                                        </div>
                                        
                                        {dashboardData?.transcripts?.map((transcript) => (
                                            <div key={transcript.transcript_uuid} style={styles.tableRow}>
                                                <div style={styles.tableCell}>
                                                    {transcript.primary_speaker_name || 'Unknown'}
                                                </div>
                                                <div style={styles.tableCell}>
                                                    {transcript.video_title?.substring(0, 50)}
                                                    {transcript.video_title?.length > 50 ? '...' : ''}
                                                </div>
                                                <div style={styles.tableCell}>
                                                    {transcript.speaker_organization || 'N/A'}
                                                </div>
                                                <div style={styles.tableCell}>
                                                    {formatDate(transcript.created_at)}
                                                </div>
                                                <div style={styles.tableCell}>
                                                    {transcript.has_analysis ? (
                                                        <div style={styles.analysisStatus}>
                                                            <span style={{
                                                                ...styles.statusBadge,
                                                                backgroundColor: getSentimentColor(transcript.analysis_sentiment)
                                                            }}>
                                                                {transcript.analysis_sentiment?.toUpperCase() || 'ANALYZED'}
                                                            </span>
                                                            <div style={styles.insightsCount}>
                                                                {transcript.key_insights_count} insights
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span style={{...styles.statusBadge, backgroundColor: '#6c757d'}}>
                                                            NOT ANALYZED
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={styles.tableCell}>
                                                    <div style={styles.actionButtons}>
                                                        {transcript.has_analysis ? (
                                                            <button 
                                                                style={styles.viewButton}
                                                                onClick={() => getAnalysisDetails(transcript.transcript_uuid)}
                                                            >
                                                                View Analysis
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                style={{
                                                                    ...styles.analyzeButton,
                                                                    opacity: processingAnalysis === transcript.transcript_uuid ? 0.6 : 1
                                                                }}
                                                                onClick={() => triggerAnalysis(transcript.transcript_uuid)}
                                                                disabled={processingAnalysis === transcript.transcript_uuid}
                                                            >
                                                                {processingAnalysis === transcript.transcript_uuid 
                                                                    ? 'Analyzing...' 
                                                                    : 'Analyze'
                                                                }
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Analysis Details Modal */}
                                {analysisDetails && (
                                    <div style={styles.modal}>
                                        <div style={styles.modalContent}>
                                            <div style={styles.modalHeader}>
                                                <h3>Analysis Details</h3>
                                                <button 
                                                    style={styles.closeButton}
                                                    onClick={() => {
                                                        setAnalysisDetails(null);
                                                        setSelectedTranscript(null);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            
                                            <div style={styles.modalBody}>
                                                {/* Transcript Info */}
                                                <div style={styles.infoSection}>
                                                    <h4>Transcript Information</h4>
                                                    <p><strong>Speaker:</strong> {analysisDetails.transcript_info.primary_speaker_name}</p>
                                                    <p><strong>Organization:</strong> {analysisDetails.transcript_info.speaker_organization}</p>
                                                    <p><strong>Title:</strong> {analysisDetails.transcript_info.video_title}</p>
                                                    <p><strong>Word Count:</strong> {analysisDetails.transcript_info.word_count?.toLocaleString()}</p>
                                                </div>

                                                {/* Executive Summary */}
                                                <div style={styles.infoSection}>
                                                    <h4>Executive Summary</h4>
                                                    <p style={styles.summary}>{analysisDetails.analysis.executive_summary}</p>
                                                </div>

                                                {/* Sentiment & Outlook */}
                                                <div style={styles.sentimentSection}>
                                                    <div style={styles.sentimentCard}>
                                                        <h5>Overall Sentiment</h5>
                                                        <span style={{
                                                            ...styles.statusBadge,
                                                            backgroundColor: getSentimentColor(analysisDetails.analysis.overall_sentiment),
                                                            fontSize: '14px'
                                                        }}>
                                                            {analysisDetails.analysis.overall_sentiment?.toUpperCase()}
                                                        </span>
                                                        <p>Confidence: {Math.round(analysisDetails.analysis.sentiment_confidence * 100)}%</p>
                                                    </div>
                                                    <div style={styles.sentimentCard}>
                                                        <h5>Market Outlook</h5>
                                                        <span style={{
                                                            ...styles.statusBadge,
                                                            backgroundColor: getOutlookColor(analysisDetails.analysis.market_outlook),
                                                            fontSize: '14px'
                                                        }}>
                                                            {analysisDetails.analysis.market_outlook?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Key Themes */}
                                                {analysisDetails.analysis.key_themes?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4>Key Themes</h4>
                                                        <div style={styles.themesContainer}>
                                                            {analysisDetails.analysis.key_themes.map((theme, index) => (
                                                                <span key={index} style={styles.themeTag}>
                                                                    {theme}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Economic Opportunities */}
                                                {analysisDetails.analysis.economic_opportunities?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4>Economic Opportunities</h4>
                                                        {analysisDetails.analysis.economic_opportunities.map((opportunity, index) => (
                                                            <div key={index} style={styles.listItem}>
                                                                <div style={styles.listItemContent}>
                                                                    <p>{opportunity.opportunity}</p>
                                                                    {opportunity.confidence && (
                                                                        <span style={styles.confidenceTag}>
                                                                            Confidence: {Math.round(opportunity.confidence * 100)}%
                                                                        </span>
                                                                    )}
                                                                    {opportunity.timeframe && (
                                                                        <span style={styles.timeframeTag}>
                                                                            {opportunity.timeframe.replace('_', ' ')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Economic Risks */}
                                                {analysisDetails.analysis.economic_risks?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4>Economic Risks</h4>
                                                        {analysisDetails.analysis.economic_risks.map((risk, index) => (
                                                            <div key={index} style={styles.listItem}>
                                                                <div style={styles.listItemContent}>
                                                                    <p>{risk.risk}</p>
                                                                    {risk.impact_level && (
                                                                        <span style={{
                                                                            ...styles.confidenceTag,
                                                                            backgroundColor: risk.impact_level === 'high' ? '#dc3545' : 
                                                                                            risk.impact_level === 'medium' ? '#fd7e14' : '#28a745'
                                                                        }}>
                                                                            {risk.impact_level} impact
                                                                        </span>
                                                                    )}
                                                                    {risk.probability && (
                                                                        <span style={styles.timeframeTag}>
                                                                            Probability: {Math.round(risk.probability * 100)}%
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Market Predictions */}
                                                {analysisDetails.analysis.market_predictions?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4>Market Predictions</h4>
                                                        {analysisDetails.analysis.market_predictions.map((prediction, index) => (
                                                            <div key={index} style={styles.listItem}>
                                                                <div style={styles.listItemContent}>
                                                                    <p>{prediction.prediction}</p>
                                                                    {prediction.timeframe && (
                                                                        <span style={styles.timeframeTag}>
                                                                            {prediction.timeframe.replace('_', ' ')}
                                                                        </span>
                                                                    )}
                                                                    {prediction.confidence && (
                                                                        <span style={styles.confidenceTag}>
                                                                            Confidence: {Math.round(prediction.confidence * 100)}%
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Economic Metrics */}
                                                <div style={styles.metricsGrid}>
                                                    {Object.keys(analysisDetails.analysis.inflation_mentions || {}).length > 0 && (
                                                        <div style={styles.metricCard}>
                                                            <h5>Inflation</h5>
                                                            {Object.entries(analysisDetails.analysis.inflation_mentions).map(([key, value]) => (
                                                                <p key={key}><strong>{key}:</strong> {value}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {Object.keys(analysisDetails.analysis.interest_rate_mentions || {}).length > 0 && (
                                                        <div style={styles.metricCard}>
                                                            <h5>Interest Rates</h5>
                                                            {Object.entries(analysisDetails.analysis.interest_rate_mentions).map(([key, value]) => (
                                                                <p key={key}><strong>{key}:</strong> {value}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {Object.keys(analysisDetails.analysis.gdp_mentions || {}).length > 0 && (
                                                        <div style={styles.metricCard}>
                                                            <h5>GDP</h5>
                                                            {Object.entries(analysisDetails.analysis.gdp_mentions).map(([key, value]) => (
                                                                <p key={key}><strong>{key}:</strong> {value}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {Object.keys(analysisDetails.analysis.unemployment_mentions || {}).length > 0 && (
                                                        <div style={styles.metricCard}>
                                                            <h5>Unemployment</h5>
                                                            {Object.entries(analysisDetails.analysis.unemployment_mentions).map(([key, value]) => (
                                                                <p key={key}><strong>{key}:</strong> {value}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Analysis Info */}
                                                <div style={styles.analysisInfo}>
                                                    <p><strong>Analysis Created:</strong> {formatDate(analysisDetails.analysis.analysis_created_at)}</p>
                                                    <p><strong>Completeness Score:</strong> {Math.round(analysisDetails.analysis.analysis_completeness_score * 100)}%</p>
                                                    <p><strong>Total Insights:</strong> {analysisDetails.analysis.key_insights_count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    title: {
        color: '#1a365d',
        fontSize: '28px',
        marginBottom: '30px',
        fontWeight: 'bold'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '2px solid #e2e8f0'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '8px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    tableContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e2e8f0'
    },
    sectionTitle: {
        padding: '20px',
        margin: '0',
        backgroundColor: '#f8fafc',
        color: '#1a365d',
        borderBottom: '2px solid #e2e8f0'
    },
    table: {
        width: '100%'
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr 1.2fr 1.2fr 1fr',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold'
    },
    tableHeaderCell: {
        padding: '15px 12px',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        fontSize: '14px'
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr 1.2fr 1.2fr 1fr',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background-color 0.2s'
    },
    tableCell: {
        padding: '15px 12px',
        borderRight: '1px solid #e2e8f0',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center'
    },
    analysisStatus: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
        textAlign: 'center',
        display: 'inline-block'
    },
    insightsCount: {
        fontSize: '11px',
        color: '#666'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    viewButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'background-color 0.2s'
    },
    analyzeButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'background-color 0.2s'
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    modalHeader: {
        padding: '20px',
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666'
    },
    modalBody: {
        padding: '20px',
        overflow: 'auto',
        flex: 1
    },
    infoSection: {
        marginBottom: '25px',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    summary: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#333',
        fontStyle: 'italic'
    },
    sentimentSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
    },
    sentimentCard: {
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        textAlign: 'center'
    },
    themesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    themeTag: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    listItem: {
        marginBottom: '15px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
    },
    listItemContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    confidenceTag: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        alignSelf: 'flex-start'
    },
    timeframeTag: {
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        alignSelf: 'flex-start'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
    },
    metricCard: {
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        border: '1px solid #bbdefb'
    },
    analysisInfo: {
        padding: '15px',
        backgroundColor: '#f1f8ff',
        borderRadius: '8px',
        border: '1px solid #c3dafe'
    },
    '@media (max-width: 768px)': {
        tableHeader: {
            gridTemplateColumns: '1fr 2fr 1fr'
        },
        tableRow: {
            gridTemplateColumns: '1fr 2fr 1fr'
        },
        statsGrid: {
            gridTemplateColumns: '1fr'
        },
        sentimentSection: {
            gridTemplateColumns: '1fr'
        },
        metricsGrid: {
            gridTemplateColumns: '1fr'
        }
    }
};