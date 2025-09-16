import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function SnowAICentralHub() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [activeGPT, setActiveGPT] = useState('TraderHistoryGPT');
    const [gptSummaries, setGptSummaries] = useState({});
    const [chatMessages, setChatMessages] = useState({});
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'chat'
    const [summariesLoading, setSummariesLoading] = useState(true);

    const gptSystems = {
        'TraderHistoryGPT': {
            name: 'TraderHistoryGPT',
            color: '#3b82f6', // Blue
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            endpoint: 'trader_history_gpt_summary',
            chatEndpoint: 'trader_history_gpt_chat'
        },
        'MacroGPT': {
            name: 'MacroGPT',
            color: '#22c55e', // Green
            bgColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            endpoint: 'macro_gpt_summary',
            chatEndpoint: 'macro_gpt_chat'
        },
        'IdeaGPT': {
            name: 'IdeaGPT',
            color: '#a855f7', // Purple
            bgColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            endpoint: 'idea_gpt_summary',
            chatEndpoint: 'idea_gpt_chat'
        },
        'BacktestingGPT': {
            name: 'BacktestingGPT',
            color: '#f97316', // Orange
            bgColor: 'rgba(249, 115, 22, 0.1)',
            borderColor: 'rgba(249, 115, 22, 0.3)',
            endpoint: 'backtesting_gpt_summary',
            chatEndpoint: 'backtesting_gpt_chat'
        },
        'PaperGPT': {
            name: 'PaperGPT',
            color: '#ef4444', // Red
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            endpoint: 'paper_gpt_summary',
            chatEndpoint: 'paper_gpt_chat'
        },
        'ResearchGPT': {
            name: 'ResearchGPT',
            color: '#ec4899', // Pink
            bgColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            endpoint: 'research_gpt_summary',
            chatEndpoint: 'research_gpt_chat'
        }
    };

    const styles = {
        container: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        header: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '30px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },
        tabsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
        },
        tabButton: {
            position: 'relative',
            padding: '20px 15px 15px',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            overflow: 'hidden',
        },
        tabButtonActive: {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        orbContainer: {
            position: 'relative',
            width: '60px',
            height: '60px',
            marginBottom: '5px',
        },
        orb: {
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 50%)',
            filter: 'blur(1px)',
            opacity: '0.9',
        },
        orbGlow: {
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '50%',
            opacity: '0.3',
            filter: 'blur(15px)',
        },
        contentCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(229, 231, 235, 0.8)',
            minHeight: '60vh',
        },
        modeToggle: {
            display: 'flex',
            marginBottom: '25px',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '4px',
        },
        modeButton: {
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            color: '#6b7280',
        },
        modeButtonActive: {
            backgroundColor: 'white',
            color: '#1f2937',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        summaryContent: {
            lineHeight: '1.7',
            color: '#374151',
        },
        chatContainer: {
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
        },
        messagesContainer: {
            flex: 1,
            overflowY: 'auto',
            padding: '0 5px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        message: {
            padding: '12px 16px',
            borderRadius: '18px',
            maxWidth: '80%',
            fontSize: '14px',
            lineHeight: '1.5',
            wordWrap: 'break-word',
        },
        userMessage: {
            alignSelf: 'flex-end',
            color: 'white',
            fontWeight: '500',
        },
        assistantMessage: {
            alignSelf: 'flex-start',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
        },
        inputContainer: {
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end',
        },
        textarea: {
            flex: 1,
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '16px',
            resize: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            minHeight: '50px',
            maxHeight: '120px',
            transition: 'border-color 0.2s ease',
            outline: 'none',
        },
        sendButton: {
            padding: '12px 24px',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            transition: 'all 0.2s ease',
            minWidth: '80px',
        },
        loadingMessage: {
            alignSelf: 'flex-start',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            fontStyle: 'italic',
            border: '1px solid #e5e7eb',
        },
        noSummaryMessage: {
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
            fontSize: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '2px dashed #d1d5db',
        },
        refreshButton: {
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
        }
    };

    // Animation keyframes (inject into head)
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-10px) scale(1.05); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
            .floating-orb {
                animation: float 4s ease-in-out infinite;
            }
            .pulsing-glow {
                animation: pulse 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    // Modified function to only fetch existing summaries, not generate new ones
    const fetchExistingSummaries = async () => {
        setSummariesLoading(true);
        const summaries = {};
        
        for (const gptType of Object.keys(gptSystems)) {
            try {
                const response = await fetch(`${baseUrl}/get_existing_summary/${gptType}/`);
                if (response.ok) {
                    const data = await response.json();
                    summaries[gptType] = data;
                } else {
                    // If no summary exists, set a placeholder
                    summaries[gptType] = {
                        status: 'No summary available',
                        summary: null,
                        metrics: {},
                        last_updated: null
                    };
                }
            } catch (error) {
                console.error(`Error fetching existing summary for ${gptType}:`, error);
                summaries[gptType] = {
                    status: 'Error loading summary',
                    summary: null,
                    metrics: {},
                    last_updated: null
                };
            }
        }
        
        setGptSummaries(summaries);
        setSummariesLoading(false);
    };

    // Function to manually trigger summary generation (optional)
    const generateSummary = async (gptType) => {
        try {
            const response = await fetch(`${baseUrl}/${gptSystems[gptType].endpoint}/`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setGptSummaries(prev => ({
                ...prev,
                [gptType]: data
            }));
        } catch (error) {
            console.error(`Error generating ${gptType} summary:`, error);
        }
    };

    const sendChatMessage = async () => {
        if (!currentMessage.trim()) return;

        setIsLoading(true);
        const userMessage = currentMessage;
        setCurrentMessage('');

        setChatMessages(prev => ({
            ...prev,
            [activeGPT]: [
                ...(prev[activeGPT] || []),
                { role: 'user', content: userMessage, timestamp: new Date().toLocaleTimeString() }
            ]
        }));

        try {
            const response = await fetch(`${baseUrl}/${gptSystems[activeGPT].chatEndpoint}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();

            setChatMessages(prev => ({
                ...prev,
                [activeGPT]: [
                    ...(prev[activeGPT] || []),
                    { role: 'assistant', content: data.response, timestamp: new Date().toLocaleTimeString() }
                ]
            }));
        } catch (error) {
            console.error(`Error sending message to ${activeGPT}:`, error);
            setChatMessages(prev => ({
                ...prev,
                [activeGPT]: [
                    ...(prev[activeGPT] || []),
                    { role: 'assistant', content: 'Sorry, I encountered an error processing your request.', timestamp: new Date().toLocaleTimeString() }
                ]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAPIKey();
        fetchExistingSummaries(); // Only fetch existing summaries, don't generate new ones
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const renderOrb = (gptType) => {
        const system = gptSystems[gptType];
        return (
            <div style={styles.orbContainer}>
                <div 
                    className="pulsing-glow"
                    style={{
                        ...styles.orbGlow,
                        backgroundColor: system.color,
                    }}
                />
                <div 
                    className="floating-orb"
                    style={{
                        ...styles.orb,
                        backgroundColor: system.color,
                    }}
                />
            </div>
        );
    };

    const renderSummaryContent = () => {
        if (summariesLoading) {
            return (
                <div style={{ 
                    color: '#6b7280', 
                    textAlign: 'center', 
                    padding: '40px',
                    fontSize: '16px'
                }}>
                    Loading summaries...
                </div>
            );
        }

        const summaryData = gptSummaries[activeGPT];
        
        if (!summaryData || !summaryData.summary) {
            return (
                <div style={styles.noSummaryMessage}>
                    <div style={{ marginBottom: '15px' }}>
                        No summary available for {gptSystems[activeGPT].name}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                        Summaries are generated automatically every 24 hours. 
                        {summaryData?.last_updated && (
                            <div>Last updated: {new Date(summaryData.last_updated).toLocaleString()}</div>
                        )}
                    </div>
                    <button
                        onClick={() => generateSummary(activeGPT)}
                        style={styles.refreshButton}
                    >
                        Generate Summary Now
                    </button>
                </div>
            );
        }

        return (
            <div style={styles.summaryContent}>
                {summaryData.summary && (
                    <div dangerouslySetInnerHTML={{ 
                        __html: summaryData.summary.replace(/\n/g, '<br>') 
                    }} />
                )}
                
                {summaryData.metrics && Object.keys(summaryData.metrics).length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Key Metrics:</h3>
                        <pre style={{ 
                            backgroundColor: gptSystems[activeGPT].bgColor,
                            padding: '20px', 
                            borderRadius: '12px',
                            fontSize: '13px',
                            whiteSpace: 'pre-wrap',
                            border: `1px solid ${gptSystems[activeGPT].borderColor}`,
                            overflow: 'auto'
                        }}>
                            {JSON.stringify(summaryData.metrics, null, 2)}
                        </pre>
                    </div>
                )}
                
                {summaryData.last_updated && (
                    <div style={{ 
                        marginTop: '20px', 
                        fontSize: '12px', 
                        color: '#6b7280',
                        textAlign: 'right'
                    }}>
                        Last updated: {new Date(summaryData.last_updated).toLocaleString()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div style={styles.mainContent}>
                        <h1 style={styles.header}>SnowAI Central Hub</h1>
                        
                        {/* GPT System Tabs */}
                        <div style={styles.tabsContainer}>
                            {Object.keys(gptSystems).map(gptType => (
                                <button
                                    key={gptType}
                                    onClick={() => {
                                        setActiveGPT(gptType);
                                        setViewMode('summary');
                                    }}
                                    style={{
                                        ...styles.tabButton,
                                        ...(activeGPT === gptType ? styles.tabButtonActive : {}),
                                        borderLeft: `4px solid ${gptSystems[gptType].color}`,
                                        color: activeGPT === gptType ? gptSystems[gptType].color : '#6b7280',
                                    }}
                                >
                                    {renderOrb(gptType)}
                                    {gptSystems[gptType].name}
                                </button>
                            ))}
                        </div>

                        {/* Content Card */}
                        <div style={{
                            ...styles.contentCard,
                            borderLeft: `4px solid ${gptSystems[activeGPT].color}`,
                        }}>
                            {/* Mode Toggle */}
                            <div style={styles.modeToggle}>
                                <button
                                    onClick={() => setViewMode('summary')}
                                    style={{
                                        ...styles.modeButton,
                                        ...(viewMode === 'summary' ? {
                                            ...styles.modeButtonActive,
                                            color: gptSystems[activeGPT].color
                                        } : {})
                                    }}
                                >
                                    📊 Summary
                                </button>
                                <button
                                    onClick={() => setViewMode('chat')}
                                    style={{
                                        ...styles.modeButton,
                                        ...(viewMode === 'chat' ? {
                                            ...styles.modeButtonActive,
                                            color: gptSystems[activeGPT].color
                                        } : {})
                                    }}
                                >
                                    💬 Chat
                                </button>
                            </div>

                            {/* Content */}
                            {viewMode === 'summary' ? (
                                <div>
                                    <h2 style={{ 
                                        color: gptSystems[activeGPT].color, 
                                        marginBottom: '20px',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        {gptSystems[activeGPT].name} Summary
                                    </h2>
                                    
                                    {renderSummaryContent()}
                                </div>
                            ) : (
                                <div>
                                    <h2 style={{ 
                                        color: gptSystems[activeGPT].color, 
                                        marginBottom: '20px',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        Chat with {gptSystems[activeGPT].name}
                                    </h2>
                                    
                                    <div style={styles.chatContainer}>
                                        <div style={styles.messagesContainer}>
                                            {(chatMessages[activeGPT] || []).map((message, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        ...styles.message,
                                                        ...(message.role === 'user' ? {
                                                            ...styles.userMessage,
                                                            backgroundColor: gptSystems[activeGPT].color,
                                                        } : styles.assistantMessage)
                                                    }}
                                                >
                                                    <div>{message.content}</div>
                                                    <div style={{ 
                                                        fontSize: '11px', 
                                                        opacity: 0.7, 
                                                        marginTop: '5px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {message.timestamp}
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div style={{
                                                    ...styles.message,
                                                    ...styles.loadingMessage
                                                }}>
                                                    {gptSystems[activeGPT].name} is thinking...
                                                </div>
                                            )}
                                        </div>

                                        <div style={styles.inputContainer}>
                                            <textarea
                                                value={currentMessage}
                                                onChange={(e) => setCurrentMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder={`Ask ${gptSystems[activeGPT].name} anything...`}
                                                style={{
                                                    ...styles.textarea,
                                                    borderColor: currentMessage.trim() ? gptSystems[activeGPT].color : '#e5e7eb'
                                                }}
                                                disabled={isLoading}
                                            />
                                            <button
                                                onClick={sendChatMessage}
                                                disabled={isLoading || !currentMessage.trim()}
                                                style={{
                                                    ...styles.sendButton,
                                                    backgroundColor: gptSystems[activeGPT].color,
                                                    opacity: isLoading || !currentMessage.trim() ? 0.5 : 1,
                                                    cursor: isLoading || !currentMessage.trim() ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {isLoading ? '...' : 'Send'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}