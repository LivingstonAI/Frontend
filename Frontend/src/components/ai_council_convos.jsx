import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function AICouncilConvos() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [triggeringConversation, setTriggeringConversation] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedCards, setExpandedCards] = useState(new Set());

    useEffect(() => {
        fetchCouncilConversations();
    }, [currentPage]);

    const fetchCouncilConversations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/ai-council/conversations/?page=${currentPage}&page_size=10`);
            const data = await response.json();
            
            if (data.success) {
                setConversations(data.conversations);
                setTotalPages(data.pagination.total_pages);
            } else {
                console.error('Failed to fetch conversations:', data.error);
            }
        } catch (error) {
            console.error('Error fetching council conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const triggerManualConversation = async () => {
        try {
            setTriggeringConversation(true);
            const response = await fetch(`${baseUrl}/api/ai-council/trigger-conversation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken') || ''
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('AI Council conversation triggered successfully!');
                fetchCouncilConversations(); // Refresh the list
            } else {
                alert('Failed to trigger conversation: ' + data.error);
            }
        } catch (error) {
            console.error('Error triggering conversation:', error);
            alert('Error triggering conversation. Please try again.');
        } finally {
            setTriggeringConversation(false);
        }
    };

    const fetchConversationDetails = async (conversationId) => {
        try {
            const response = await fetch(`${baseUrl}/api/ai-council/conversations/${conversationId}/`);
            const data = await response.json();
            
            if (data.success) {
                setSelectedConversation(data);
            } else {
                console.error('Failed to fetch conversation details:', data.error);
            }
        } catch (error) {
            console.error('Error fetching conversation details:', error);
        }
    };

    const toggleCardExpansion = (conversationId) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(conversationId)) {
            newExpanded.delete(conversationId);
        } else {
            newExpanded.add(conversationId);
        }
        setExpandedCards(newExpanded);
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish': return '#4CAF50';
            case 'bearish': return '#f44336';
            case 'very_positive': return '#2E7D32';
            case 'positive': return '#4CAF50';
            case 'negative': return '#f44336';
            case 'very_negative': return '#c62828';
            default: return '#2196F3';
        }
    };

    const getVolatilityColor = (volatility) => {
        switch (volatility?.toLowerCase()) {
            case 'low': return '#4CAF50';
            case 'medium': return '#ff9800';
            case 'high': return '#f44336';
            case 'extreme': return '#c62828';
            default: return '#2196F3';
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const ConversationCard = ({ conversation }) => {
        const isExpanded = expandedCards.has(conversation.conversation_id);
        
        return (
            <div style={styles.conversationCard}>
                <div style={styles.cardHeader} onClick={() => toggleCardExpansion(conversation.conversation_id)}>
                    <h3 style={styles.cardTitle}>{conversation.title}</h3>
                    <div style={styles.cardStatus}>
                        <span style={{
                            ...styles.statusBadge,
                            backgroundColor: conversation.status === 'completed' ? '#4CAF50' : 
                                           conversation.status === 'running' ? '#ff9800' : '#f44336'
                        }}>
                            {conversation.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div style={styles.cardBasicInfo}>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Created:</span>
                        <span>{formatDateTime(conversation.created_at)}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Participants:</span>
                        <span>{conversation.total_participants} assets</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Economic Outlook:</span>
                        <span style={{ 
                            color: getSentimentColor(conversation.overall_economic_outlook),
                            fontWeight: 'bold'
                        }}>
                            {conversation.overall_economic_outlook?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>

                {isExpanded && (
                    <div style={styles.expandedContent}>
                        <div style={styles.metricsGrid}>
                            <div style={styles.metricCard}>
                                <h4 style={styles.metricTitle}>Market Sentiment</h4>
                                <div style={{
                                    color: getSentimentColor(conversation.global_market_sentiment),
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    {conversation.global_market_sentiment?.toUpperCase()}
                                </div>
                            </div>

                            <div style={styles.metricCard}>
                                <h4 style={styles.metricTitle}>Volatility Level</h4>
                                <div style={{
                                    color: getVolatilityColor(conversation.market_volatility_level),
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    {conversation.market_volatility_level?.toUpperCase()}
                                </div>
                            </div>

                            <div style={styles.metricCard}>
                                <h4 style={styles.metricTitle}>Avg Confidence</h4>
                                <div style={styles.metricValue}>
                                    {Math.round(conversation.average_confidence_score)}%
                                </div>
                            </div>

                            <div style={styles.metricCard}>
                                <h4 style={styles.metricTitle}>Execution Time</h4>
                                <div style={styles.metricValue}>
                                    {Math.round(conversation.execution_time_seconds)}s
                                </div>
                            </div>
                        </div>

                        <div style={styles.sentimentBreakdown}>
                            <h4 style={styles.sectionTitle}>Sentiment Breakdown</h4>
                            <div style={styles.sentimentBars}>
                                <div style={styles.sentimentBar}>
                                    <span>Bullish: {conversation.bullish_sentiment_count}</span>
                                    <div style={styles.barContainer}>
                                        <div style={{
                                            ...styles.bar,
                                            width: `${(conversation.bullish_sentiment_count / conversation.total_participants) * 100}%`,
                                            backgroundColor: '#4CAF50'
                                        }} />
                                    </div>
                                </div>
                                <div style={styles.sentimentBar}>
                                    <span>Bearish: {conversation.bearish_sentiment_count}</span>
                                    <div style={styles.barContainer}>
                                        <div style={{
                                            ...styles.bar,
                                            width: `${(conversation.bearish_sentiment_count / conversation.total_participants) * 100}%`,
                                            backgroundColor: '#f44336'
                                        }} />
                                    </div>
                                </div>
                                <div style={styles.sentimentBar}>
                                    <span>Neutral: {conversation.neutral_sentiment_count}</span>
                                    <div style={styles.barContainer}>
                                        <div style={{
                                            ...styles.bar,
                                            width: `${(conversation.neutral_sentiment_count / conversation.total_participants) * 100}%`,
                                            backgroundColor: '#2196F3'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {conversation.participating_assets && conversation.participating_assets.length > 0 && (
                            <div style={styles.participantsSection}>
                                <h4 style={styles.sectionTitle}>Participating Assets</h4>
                                <div style={styles.assetTags}>
                                    {conversation.participating_assets.map((asset, index) => (
                                        <span key={index} style={styles.assetTag}>
                                            {asset}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {conversation.major_economic_themes && conversation.major_economic_themes.length > 0 && (
                            <div style={styles.themesSection}>
                                <h4 style={styles.sectionTitle}>Major Economic Themes</h4>
                                <ul style={styles.themesList}>
                                    {conversation.major_economic_themes.map((theme, index) => (
                                        <li key={index} style={styles.themeItem}>{theme}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {conversation.conversation_summary && (
                            <div style={styles.summarySection}>
                                <h4 style={styles.sectionTitle}>Discussion Summary</h4>
                                <p style={styles.summaryText}>{conversation.conversation_summary}</p>
                            </div>
                        )}

                        <div style={styles.detailButtonContainer}>
                            <button 
                                style={styles.detailButton}
                                onClick={() => fetchConversationDetails(conversation.conversation_id)}
                            >
                                View Full Conversation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const ConversationDetails = ({ conversationData }) => {
        const { conversation, participants } = conversationData;
        
        return (
            <div style={styles.detailsModal}>
                <div style={styles.detailsContent}>
                    <div style={styles.detailsHeader}>
                        <h2>{conversation.title}</h2>
                        <button 
                            style={styles.closeButton}
                            onClick={() => setSelectedConversation(null)}
                        >
                            ×
                        </button>
                    </div>

                    <div style={styles.conversationTurns}>
                        <h3 style={styles.sectionTitle}>Discussion Turns</h3>
                        {conversation.conversation_data?.turns?.map((turn, index) => (
                            <div key={index} style={styles.turnCard}>
                                <div style={styles.turnHeader}>
                                    <span style={styles.participantName}>{turn.participant}</span>
                                    <span style={styles.turnRound}>Round {turn.round}</span>
                                    <span style={{
                                        ...styles.turnSentiment,
                                        color: getSentimentColor(turn.sentiment)
                                    }}>
                                        {turn.sentiment} ({turn.confidence}%)
                                    </span>
                                </div>
                                <p style={styles.turnMessage}>{turn.message}</p>
                            </div>
                        ))}
                    </div>

                    <div style={styles.participantsDetails}>
                        <h3 style={styles.sectionTitle}>Participants Details</h3>
                        {participants.map((participant, index) => (
                            <div key={index} style={styles.participantCard}>
                                <h4>{participant.participant_name}</h4>
                                <div style={styles.participantStats}>
                                    <span>Sentiment: <strong style={{ color: getSentimentColor(participant.market_sentiment) }}>
                                        {participant.market_sentiment}
                                    </strong></span>
                                    <span>Confidence: <strong>{participant.confidence_score}%</strong></span>
                                    <span>Risk: <strong>{participant.risk_assessment}</strong></span>
                                    <span>Turns: <strong>{participant.turns_spoken}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div style={styles.pagination}>
                <button 
                    style={{
                        ...styles.paginationButton,
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                <span style={styles.paginationInfo}>
                    Page {currentPage} of {totalPages}
                </span>
                
                <button 
                    style={{
                        ...styles.paginationButton,
                        opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            color: '#333'
        },
        header: {
            top: 0,
            zIndex: 100
        },
        mainPageBody: {
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        },
        mainBodyInfo: {
            flex: 1,
            padding: '20px',
            '@media (max-width: 768px)': {
                marginLeft: 0,
                padding: '15px'
            }
        },
        pageHeader: {
            marginBottom: '30px'
        },
        pageTitle: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1976d2',
            marginBottom: '10px'
        },
        controlsSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
        },
        triggerButton: {
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            opacity: triggeringConversation ? 0.7 : 1
        },
        conversationsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        conversationCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        },
        cardHeader: {
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1976d2',
            margin: 0
        },
        cardStatus: {
            display: 'flex',
            alignItems: 'center'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '16px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
        },
        cardBasicInfo: {
            padding: '20px'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            '@media (max-width: 480px)': {
                flexDirection: 'column',
                gap: '5px'
            }
        },
        infoLabel: {
            fontWeight: 'bold',
            color: '#666'
        },
        expandedContent: {
            borderTop: '1px solid #e0e0e0',
            padding: '20px'
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '25px'
        },
        metricCard: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
        },
        metricTitle: {
            fontSize: '14px',
            color: '#666',
            margin: '0 0 10px 0'
        },
        metricValue: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1976d2'
        },
        sentimentBreakdown: {
            marginBottom: '25px'
        },
        sectionTitle: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
        },
        sentimentBars: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        },
        sentimentBar: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        },
        barContainer: {
            flex: 1,
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden'
        },
        bar: {
            height: '100%',
            transition: 'width 0.3s ease'
        },
        participantsSection: {
            marginBottom: '25px'
        },
        assetTags: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
        },
        assetTag: {
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 'bold'
        },
        themesSection: {
            marginBottom: '25px'
        },
        themesList: {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        themeItem: {
            backgroundColor: '#f0f4ff',
            padding: '10px 15px',
            marginBottom: '8px',
            borderRadius: '6px',
            borderLeft: '4px solid #1976d2'
        },
        summarySection: {
            marginBottom: '20px'
        },
        summaryText: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            lineHeight: '1.6',
            margin: 0
        },
        detailButtonContainer: {
            textAlign: 'center'
        },
        detailButton: {
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginTop: '30px'
        },
        paginationButton: {
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
        },
        paginationInfo: {
            fontWeight: 'bold',
            color: '#666'
        },
        detailsModal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
        },
        detailsContent: {
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '100%'
        },
        detailsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
        },
        conversationTurns: {
            padding: '20px'
        },
        turnCard: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px'
        },
        turnHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '10px'
        },
        participantName: {
            fontWeight: 'bold',
            color: '#1976d2'
        },
        turnRound: {
            backgroundColor: '#e0e0e0',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
        },
        turnSentiment: {
            fontWeight: 'bold',
            fontSize: '14px'
        },
        turnMessage: {
            margin: 0,
            lineHeight: '1.5'
        },
        participantsDetails: {
            padding: '20px',
            borderTop: '1px solid #e0e0e0'
        },
        participantCard: {
            backgroundColor: '#f0f4ff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px'
        },
        participantStats: {
            display: 'flex',
            gap: '20px',
            marginTop: '10px',
            flexWrap: 'wrap'
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '50px',
            fontSize: '18px',
            color: '#666'
        },
        emptyState: {
            textAlign: 'center',
            padding: '50px',
            color: '#666'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Header />
            </div>
            <div style={styles.mainPageBody}>
                <SideNavs />
                <div style={styles.mainBodyInfo}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>AI Trading Council Conversations</h1>
                    </div>

                    <div style={styles.controlsSection}>
                        <button 
                            style={styles.triggerButton}
                            onClick={triggerManualConversation}
                            disabled={triggeringConversation}
                        >
                            {triggeringConversation ? 'Starting Discussion...' : 'Trigger New Discussion'}
                        </button>
                    </div>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            Loading conversations...
                        </div>
                    ) : conversations.length === 0 ? (
                        <div style={styles.emptyState}>
                            <h3>No conversations found</h3>
                            <p>Trigger your first AI Trading Council discussion!</p>
                        </div>
                    ) : (
                        <>
                            <div style={styles.conversationsContainer}>
                                {conversations.map((conversation) => (
                                    <ConversationCard 
                                        key={conversation.conversation_id} 
                                        conversation={conversation}
                                    />
                                ))}
                            </div>
                            <Pagination />
                        </>
                    )}

                    {selectedConversation && (
                        <ConversationDetails conversationData={selectedConversation} />
                    )}
                </div>
            </div>
        </div>
    );
}