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
            case 'positive': return '#10b981';
            case 'negative': return '#ef4444';
            case 'mixed': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getOutlookColor = (outlook) => {
        switch (outlook) {
            case 'bullish': return '#10b981';
            case 'bearish': return '#ef4444';
            case 'uncertain': return '#f59e0b';
            default: return '#6b7280';
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
                            <div style={styles.loading}>
                                <div style={styles.spinner}></div>
                                <p>Loading dashboard data...</p>
                            </div>
                        ) : error ? (
                            <div style={styles.error}>{error}</div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                {dashboardData?.stats && (
                                    <div style={styles.statsGrid}>
                                        <div style={styles.statCard}>
                                            <div style={styles.statIcon}>📊</div>
                                            <div style={styles.statNumber}>
                                                {dashboardData.stats.total_transcripts}
                                            </div>
                                            <div style={styles.statLabel}>Total Transcripts</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={styles.statIcon}>✅</div>
                                            <div style={{...styles.statNumber, color: '#10b981'}}>
                                                {dashboardData.stats.analyzed_transcripts}
                                            </div>
                                            <div style={styles.statLabel}>Analyzed</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={styles.statIcon}>⏳</div>
                                            <div style={{...styles.statNumber, color: '#f59e0b'}}>
                                                {dashboardData.stats.pending_analysis}
                                            </div>
                                            <div style={styles.statLabel}>Pending Analysis</div>
                                        </div>
                                        <div style={styles.statCard}>
                                            <div style={styles.statIcon}>📈</div>
                                            <div style={{...styles.statNumber, color: '#3b82f6'}}>
                                                {Math.round(dashboardData.stats.analysis_completion_rate)}%
                                            </div>
                                            <div style={styles.statLabel}>Completion Rate</div>
                                        </div>
                                    </div>
                                )}

                                {/* Transcripts Section */}
                                <div style={styles.transcriptsSection}>
                                    <h3 style={styles.sectionTitle}>Recent Transcripts</h3>
                                    
                                    {/* Mobile Cards View */}
                                    <div style={styles.mobileCards}>
                                        {dashboardData?.transcripts?.map((transcript) => (
                                            <div key={transcript.transcript_uuid} style={styles.transcriptCard}>
                                                <div style={styles.cardHeader}>
                                                    <div style={styles.speakerInfo}>
                                                        <div style={styles.speakerName}>
                                                            {transcript.primary_speaker_name || 'Unknown'}
                                                        </div>
                                                        <div style={styles.organization}>
                                                            {transcript.speaker_organization || 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div style={styles.dateInfo}>
                                                        {formatDate(transcript.created_at)}
                                                    </div>
                                                </div>
                                                
                                                <div style={styles.cardTitle}>
                                                    {transcript.video_title?.substring(0, 80)}
                                                    {transcript.video_title?.length > 80 ? '...' : ''}
                                                </div>
                                                
                                                <div style={styles.cardFooter}>
                                                    <div style={styles.statusSection}>
                                                        {transcript.has_analysis ? (
                                                            <div style={styles.analysisStatusCard}>
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
                                                            <span style={{...styles.statusBadge, backgroundColor: '#6b7280'}}>
                                                                NOT ANALYZED
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div style={styles.actionSection}>
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
                                                                    opacity: processingAnalysis === transcript.transcript_uuid ? 0.7 : 1
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

                                    {/* Desktop Table View */}
                                    <div style={styles.desktopTable}>
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
                                                            <span style={{...styles.statusBadge, backgroundColor: '#6b7280'}}>
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
                                                                        opacity: processingAnalysis === transcript.transcript_uuid ? 0.7 : 1
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
                                </div>

                                {/* Analysis Details Modal */}
                                {analysisDetails && (
                                    <div style={styles.modal} onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            setAnalysisDetails(null);
                                            setSelectedTranscript(null);
                                        }
                                    }}>
                                        <div style={styles.modalContent}>
                                            <div style={styles.modalHeader}>
                                                <h3 style={styles.modalTitle}>Analysis Details</h3>
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
                                                    <h4 style={styles.sectionHeader}>📄 Transcript Information</h4>
                                                    <div style={styles.infoGrid}>
                                                        <div><strong>Speaker:</strong> {analysisDetails.transcript_info.primary_speaker_name}</div>
                                                        <div><strong>Organization:</strong> {analysisDetails.transcript_info.speaker_organization}</div>
                                                        <div><strong>Title:</strong> {analysisDetails.transcript_info.video_title}</div>
                                                        <div><strong>Word Count:</strong> {analysisDetails.transcript_info.word_count?.toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                {/* Executive Summary */}
                                                <div style={styles.infoSection}>
                                                    <h4 style={styles.sectionHeader}>📝 Executive Summary</h4>
                                                    <p style={styles.summary}>{analysisDetails.analysis.executive_summary}</p>
                                                </div>

                                                {/* Sentiment & Outlook */}
                                                <div style={styles.sentimentSection}>
                                                    <div style={styles.sentimentCard}>
                                                        <h5>📊 Overall Sentiment</h5>
                                                        <span style={{
                                                            ...styles.statusBadge,
                                                            backgroundColor: getSentimentColor(analysisDetails.analysis.overall_sentiment),
                                                            fontSize: '14px',
                                                            padding: '8px 16px'
                                                        }}>
                                                            {analysisDetails.analysis.overall_sentiment?.toUpperCase()}
                                                        </span>
                                                        <p style={styles.confidence}>
                                                            Confidence: {Math.round(analysisDetails.analysis.sentiment_confidence * 100)}%
                                                        </p>
                                                    </div>
                                                    <div style={styles.sentimentCard}>
                                                        <h5>📈 Market Outlook</h5>
                                                        <span style={{
                                                            ...styles.statusBadge,
                                                            backgroundColor: getOutlookColor(analysisDetails.analysis.market_outlook),
                                                            fontSize: '14px',
                                                            padding: '8px 16px'
                                                        }}>
                                                            {analysisDetails.analysis.market_outlook?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Key Themes */}
                                                {analysisDetails.analysis.key_themes?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4 style={styles.sectionHeader}>🏷️ Key Themes</h4>
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
                                                        <h4 style={styles.sectionHeader}>💡 Economic Opportunities</h4>
                                                        <div style={styles.listContainer}>
                                                            {analysisDetails.analysis.economic_opportunities.map((opportunity, index) => (
                                                                <div key={index} style={styles.listItem}>
                                                                    <p style={styles.listItemText}>{opportunity.opportunity}</p>
                                                                    <div style={styles.tagContainer}>
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
                                                    </div>
                                                )}

                                                {/* Economic Risks */}
                                                {analysisDetails.analysis.economic_risks?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4 style={styles.sectionHeader}>⚠️ Economic Risks</h4>
                                                        <div style={styles.listContainer}>
                                                            {analysisDetails.analysis.economic_risks.map((risk, index) => (
                                                                <div key={index} style={styles.listItem}>
                                                                    <p style={styles.listItemText}>{risk.risk}</p>
                                                                    <div style={styles.tagContainer}>
                                                                        {risk.impact_level && (
                                                                            <span style={{
                                                                                ...styles.confidenceTag,
                                                                                backgroundColor: risk.impact_level === 'high' ? '#ef4444' : 
                                                                                                risk.impact_level === 'medium' ? '#f59e0b' : '#10b981'
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
                                                    </div>
                                                )}

                                                {/* Market Predictions */}
                                                {analysisDetails.analysis.market_predictions?.length > 0 && (
                                                    <div style={styles.infoSection}>
                                                        <h4 style={styles.sectionHeader}>🔮 Market Predictions</h4>
                                                        <div style={styles.listContainer}>
                                                            {analysisDetails.analysis.market_predictions.map((prediction, index) => (
                                                                <div key={index} style={styles.listItem}>
                                                                    <p style={styles.listItemText}>{prediction.prediction}</p>
                                                                    <div style={styles.tagContainer}>
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
                                                    </div>
                                                )}

                                                {/* Analysis Info */}
                                                <div style={styles.analysisInfo}>
                                                    <h4 style={styles.sectionHeader}>📊 Analysis Metadata</h4>
                                                    <div style={styles.metadataGrid}>
                                                        <div><strong>Created:</strong> {formatDate(analysisDetails.analysis.analysis_created_at)}</div>
                                                        <div><strong>Completeness:</strong> {Math.round(analysisDetails.analysis.analysis_completeness_score * 100)}%</div>
                                                        <div><strong>Total Insights:</strong> {analysisDetails.analysis.key_insights_count}</div>
                                                    </div>
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
        margin: '0 auto',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    title: {
        color: '#1e293b',
        fontSize: '32px',
        marginBottom: '30px',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    loading: {
        textAlign: 'center',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #fecaca',
        fontSize: '16px',
        textAlign: 'center'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '30px 24px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
    },
    statIcon: {
        fontSize: '32px',
        marginBottom: '12px'
    },
    statNumber: {
        fontSize: '42px',
        fontWeight: '800',
        color: '#3b82f6',
        marginBottom: '8px',
        lineHeight: '1'
    },
    statLabel: {
        fontSize: '14px',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600'
    },
    transcriptsSection: {
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
    },
    sectionTitle: {
        padding: '24px',
        margin: '0',
        backgroundColor: '#f1f5f9',
        color: '#1e293b',
        borderBottom: '2px solid #e2e8f0',
        fontSize: '24px',
        fontWeight: '700'
    },
    
    // Mobile Cards (hidden on desktop)
    mobileCards: {
        display: 'block',
        padding: '16px',
        gap: '16px'
    },
    transcriptCard: {
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    speakerInfo: {
        flex: '1'
    },
    speakerName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '4px'
    },
    organization: {
        fontSize: '14px',
        color: '#64748b'
    },
    dateInfo: {
        fontSize: '12px',
        color: '#64748b',
        textAlign: 'right'
    },
    cardTitle: {
        fontSize: '14px',
        color: '#374151',
        marginBottom: '16px',
        lineHeight: '1.5'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
    },
    statusSection: {
        display: 'flex',
        alignItems: 'center'
    },
    analysisStatusCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px'
    },
    actionSection: {
        display: 'flex',
        gap: '8px'
    },

    // Desktop Table (hidden on mobile)
    desktopTable: {
        display: 'none'
    },
    table: {
        width: '100%'
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr 1.2fr 1.2fr 1fr',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: '600'
    },
    tableHeaderCell: {
        padding: '16px 12px',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        fontSize: '14px'
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr 1.2fr 1.2fr 1fr',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#f8fafc'
        }
    },
    tableCell: {
        padding: '16px 12px',
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
        padding: '6px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'center',
        display: 'inline-block',
        textTransform: 'uppercase'
    },
    insightsCount: {
        fontSize: '11px',
        color: '#64748b',
        fontStyle: 'italic'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    viewButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#2563eb',
            transform: 'translateY(-1px)'
        }
    },
    analyzeButton: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#059669',
            transform: 'translateY(-1px)'
        }
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '16px',
        backdropFilter: 'blur(4px)'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
    },
    modalHeader: {
        padding: '24px',
        borderBottom: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
    },
    modalTitle: {
        margin: '0',
        color: '#1e293b',
        fontSize: '24px',
        fontWeight: '700'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '32px',
        cursor: 'pointer',
        color: '#64748b',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#e2e8f0',
            color: '#1e293b'
        }
    },
    modalBody: {
        padding: '24px',
        overflow: 'auto',
        flex: 1
    },
    infoSection: {
        marginBottom: '28px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    },
    sectionHeader: {
        margin: '0 0 16px 0',
        color: '#1e293b',
        fontSize: '18px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        fontSize: '14px',
        lineHeight: '1.6'
    },
    summary: {
        fontSize: '16px',
        lineHeight: '1.7',
        color: '#374151',
        fontStyle: 'italic',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        margin: '0'
    },
    sentimentSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
    },
    sentimentCard: {
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    confidence: {
        margin: '12px 0 0 0',
        fontSize: '14px',
        color: '#64748b'
    },
    themesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    themeTag: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    listItem: {
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    listItemText: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#374151'
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    confidenceTag: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
    },
    timeframeTag: {
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    analysisInfo: {
        padding: '20px',
        backgroundColor: '#eff6ff',
        borderRadius: '12px',
        border: '1px solid #bfdbfe'
    },
    metadataGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        fontSize: '14px',
        lineHeight: '1.6'
    },

    // Media queries using CSS-in-JS approach
    '@media (min-width: 768px)': {
        mobileCards: {
            display: 'none'
        },
        desktopTable: {
            display: 'block'
        },
        container: {
            padding: '40px'
        },
        transcriptCard: {
            padding: '24px'
        }
    },
    '@media (max-width: 767px)': {
        title: {
            fontSize: '24px'
        },
        statsGrid: {
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
        },
        statCard: {
            padding: '20px 16px'
        },
        statNumber: {
            fontSize: '32px'
        },
        modalContent: {
            margin: '8px',
            maxHeight: '95vh'
        },
        modalHeader: {
            padding: '16px'
        },
        modalTitle: {
            fontSize: '20px'
        },
        modalBody: {
            padding: '16px'
        },
        infoSection: {
            padding: '16px'
        },
        sentimentSection: {
            gridTemplateColumns: '1fr'
        }
    }
};