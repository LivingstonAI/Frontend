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

    const gptSystems = {
        'TraderHistoryGPT': {
            name: 'TraderHistoryGPT',
            color: 'rgba(59, 130, 246, 0.1)', // Blue
            borderColor: 'rgba(59, 130, 246, 0.3)',
            endpoint: 'trader_history_gpt_summary',
            chatEndpoint: 'trader_history_gpt_chat'
        },
        'MacroGPT': {
            name: 'MacroGPT',
            color: 'rgba(34, 197, 94, 0.1)', // Green
            borderColor: 'rgba(34, 197, 94, 0.3)',
            endpoint: 'macro_gpt_summary',
            chatEndpoint: 'macro_gpt_chat'
        },
        'IdeaGPT': {
            name: 'IdeaGPT',
            color: 'rgba(168, 85, 247, 0.1)', // Purple
            borderColor: 'rgba(168, 85, 247, 0.3)',
            endpoint: 'idea_gpt_summary',
            chatEndpoint: 'idea_gpt_chat'
        },
        'BacktestingGPT': {
            name: 'BacktestingGPT',
            color: 'rgba(249, 115, 22, 0.1)', // Orange
            borderColor: 'rgba(249, 115, 22, 0.3)',
            endpoint: 'backtesting_gpt_summary',
            chatEndpoint: 'backtesting_gpt_chat'
        },
        'PaperGPT': {
            name: 'PaperGPT',
            color: 'rgba(239, 68, 68, 0.1)', // Red
            borderColor: 'rgba(239, 68, 68, 0.3)',
            endpoint: 'paper_gpt_summary',
            chatEndpoint: 'paper_gpt_chat'
        },
        'ResearchGPT': {
            name: 'ResearchGPT',
            color: 'rgba(236, 72, 153, 0.1)', // Pink
            borderColor: 'rgba(236, 72, 153, 0.3)',
            endpoint: 'research_gpt_summary',
            chatEndpoint: 'research_gpt_chat'
        }
    };

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

    const fetchGPTSummary = async (gptType) => {
        try {
            const response = await fetch(`${baseUrl}/${gptSystems[gptType].endpoint}/`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setGptSummaries(prev => ({
                ...prev,
                [gptType]: data
            }));
        } catch (error) {
            console.error(`Error fetching ${gptType} summary:`, error);
        }
    };

    const sendChatMessage = async () => {
        if (!currentMessage.trim()) return;

        setIsLoading(true);
        const userMessage = currentMessage;
        setCurrentMessage('');

        // Add user message to chat
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

            // Add AI response to chat
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
        // Fetch initial summaries for all GPT systems
        Object.keys(gptSystems).forEach(gptType => {
            fetchGPTSummary(gptType);
        });
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Central Hub</h5>
                    
                    {/* GPT System Tabs */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginBottom: '20px', 
                        flexWrap: 'wrap',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '10px'
                    }}>
                        {Object.keys(gptSystems).map(gptType => (
                            <button
                                key={gptType}
                                onClick={() => setActiveGPT(gptType)}
                                style={{
                                    padding: '10px 15px',
                                    border: `2px solid ${gptSystems[gptType].borderColor}`,
                                    backgroundColor: activeGPT === gptType ? gptSystems[gptType].color : 'white',
                                    color: activeGPT === gptType ? '#1f2937' : '#6b7280',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: activeGPT === gptType ? 'bold' : 'normal',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {gptSystems[gptType].name}
                            </button>
                        ))}
                    </div>

                    {/* Active GPT Content */}
                    <div style={{ display: 'flex', gap: '20px', height: '70vh' }}>
                        {/* Summary Panel */}
                        <div style={{
                            flex: '1',
                            backgroundColor: gptSystems[activeGPT].color,
                            border: `2px solid ${gptSystems[activeGPT].borderColor}`,
                            borderRadius: '12px',
                            padding: '20px',
                            overflow: 'auto'
                        }}>
                            <h6 style={{ 
                                marginBottom: '15px', 
                                color: '#1f2937',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                {gptSystems[activeGPT].name} Summary
                            </h6>
                            
                            {gptSummaries[activeGPT] ? (
                                <div style={{ color: '#374151', lineHeight: '1.6' }}>
                                    {gptSummaries[activeGPT].summary ? (
                                        <div dangerouslySetInnerHTML={{ __html: gptSummaries[activeGPT].summary.replace(/\n/g, '<br>') }} />
                                    ) : (
                                        <div>
                                            <p><strong>Status:</strong> {gptSummaries[activeGPT].status || 'Processing...'}</p>
                                            {gptSummaries[activeGPT].metrics && (
                                                <div style={{ marginTop: '15px' }}>
                                                    <h7 style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Key Metrics:</h7>
                                                    <pre style={{ 
                                                        backgroundColor: 'rgba(255,255,255,0.5)', 
                                                        padding: '10px', 
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {JSON.stringify(gptSummaries[activeGPT].metrics, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ color: '#6b7280' }}>Loading summary...</div>
                            )}
                        </div>

                        {/* Chat Panel */}
                        <div style={{
                            flex: '1',
                            backgroundColor: 'white',
                            border: `2px solid ${gptSystems[activeGPT].borderColor}`,
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                padding: '15px',
                                backgroundColor: gptSystems[activeGPT].color,
                                borderBottom: `1px solid ${gptSystems[activeGPT].borderColor}`,
                                fontWeight: 'bold',
                                color: '#1f2937'
                            }}>
                                Chat with {gptSystems[activeGPT].name}
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: '1',
                                padding: '15px',
                                overflow: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {(chatMessages[activeGPT] || []).map((message, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '10px 15px',
                                            borderRadius: '12px',
                                            backgroundColor: message.role === 'user' 
                                                ? gptSystems[activeGPT].color 
                                                : '#f3f4f6',
                                            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                            maxWidth: '80%',
                                            border: `1px solid ${message.role === 'user' 
                                                ? gptSystems[activeGPT].borderColor 
                                                : '#d1d5db'}`
                                        }}
                                    >
                                        <div style={{ fontSize: '14px', color: '#374151' }}>
                                            {message.content}
                                        </div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: '#9ca3af', 
                                            marginTop: '5px',
                                            textAlign: 'right'
                                        }}>
                                            {message.timestamp}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div style={{
                                        padding: '10px 15px',
                                        borderRadius: '12px',
                                        backgroundColor: '#f3f4f6',
                                        alignSelf: 'flex-start',
                                        maxWidth: '80%',
                                        border: '1px solid #d1d5db',
                                        color: '#6b7280',
                                        fontStyle: 'italic'
                                    }}>
                                        {gptSystems[activeGPT].name} is thinking...
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div style={{
                                padding: '15px',
                                borderTop: `1px solid ${gptSystems[activeGPT].borderColor}`,
                                display: 'flex',
                                gap: '10px'
                            }}>
                                <textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Ask ${gptSystems[activeGPT].name} anything...`}
                                    style={{
                                        flex: '1',
                                        padding: '10px',
                                        border: `1px solid ${gptSystems[activeGPT].borderColor}`,
                                        borderRadius: '8px',
                                        resize: 'none',
                                        height: '60px',
                                        fontSize: '14px'
                                    }}
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendChatMessage}
                                    disabled={isLoading || !currentMessage.trim()}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: gptSystems[activeGPT].borderColor,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: isLoading || !currentMessage.trim() ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        opacity: isLoading || !currentMessage.trim() ? 0.5 : 1
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}