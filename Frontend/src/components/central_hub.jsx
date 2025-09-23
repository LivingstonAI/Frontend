import React, { useEffect, useState, useRef } from "react";
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
    const [conversationHistoryLoading, setConversationHistoryLoading] = useState({});

    const [gptDiscussion, setGptDiscussion] = useState(null);
    const [discussionMessages, setDiscussionMessages] = useState([]);
    const [discussionLoading, setDiscussionLoading] = useState(false);
    const [triggeringDiscussion, setTriggeringDiscussion] = useState(false);

    // Voice reading states
    const [isReading, setIsReading] = useState(false);
    const [readingMessageId, setReadingMessageId] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const speechSynthRef = useRef(null);

    const gptSystems = {
        'TraderHistoryGPT': {
            name: 'TraderHistoryGPT',
            color: '#3b82f6', // Blue
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            endpoint: 'trader_history_gpt_summary',
            chatEndpoint: 'trader_history_gpt_chat',
            historyEndpoint: 'get_conversation_history/TraderHistoryGPT'
        },
        'MacroGPT': {
            name: 'MacroGPT',
            color: '#22c55e', // Green
            bgColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            endpoint: 'macro_gpt_summary',
            chatEndpoint: 'macro_gpt_chat',
            historyEndpoint: 'get_conversation_history/MacroGPT'
        },
        'IdeaGPT': {
            name: 'IdeaGPT',
            color: '#a855f7', // Purple
            bgColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            endpoint: 'idea_gpt_summary',
            chatEndpoint: 'idea_gpt_chat',
            historyEndpoint: 'get_conversation_history/IdeaGPT'
        },
        'BacktestingGPT': {
            name: 'BacktestingGPT',
            color: '#f97316', // Orange
            bgColor: 'rgba(249, 115, 22, 0.1)',
            borderColor: 'rgba(249, 115, 22, 0.3)',
            endpoint: 'backtesting_gpt_summary',
            chatEndpoint: 'backtesting_gpt_chat',
            historyEndpoint: 'get_conversation_history/BacktestingGPT'
        },
        'PaperGPT': {
            name: 'PaperGPT',
            color: '#ef4444', // Red
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            endpoint: 'paper_gpt_summary',
            chatEndpoint: 'paper_gpt_chat',
            historyEndpoint: 'get_conversation_history/PaperGPT'
        },
        'ResearchGPT': {
            name: 'ResearchGPT',
            color: '#ec4899', // Pink
            bgColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            endpoint: 'research_gpt_summary',
            chatEndpoint: 'research_gpt_chat',
            historyEndpoint: 'get_conversation_history/ResearchGPT'
        },
        'GPTDiscussion': {
            name: 'GPT Discussion',
            color: '#9ca3af', // Medium Gray
            bgColor: 'rgba(156, 163, 175, 0.15)',
            borderColor: 'rgba(156, 163, 175, 0.4)',
        }


    };

    // Systems that are used in discussion messages (includes CentralGPT)
    const discussionSystems = {
        ...gptSystems,
        'CentralGPT': {
            name: 'CentralGPT',
            color: '#6366f1', // Indigo
            bgColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
        }
    };

    // Voice reading functionality
    useEffect(() => {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            speechSynthRef.current = synth;

            const loadVoices = () => {
                const availableVoices = synth.getVoices();
                setVoices(availableVoices);
                
                // Select a natural-sounding voice (prefer neural/natural voices)
                const preferredVoice = availableVoices.find(voice => 
                    voice.name.includes('Neural') || 
                    voice.name.includes('Natural') ||
                    voice.name.includes('Enhanced') ||
                    (voice.lang.includes('en') && voice.localService)
                ) || availableVoices.find(voice => voice.lang.includes('en')) || availableVoices[0];
                
                setSelectedVoice(preferredVoice);
            };

            loadVoices();
            synth.addEventListener('voiceschanged', loadVoices);

            return () => {
                synth.removeEventListener('voiceschanged', loadVoices);
                synth.cancel();
            };
        }
    }, []);

    // Clean text for speech synthesis (remove markdown and HTML)
    const cleanTextForSpeech = (text) => {
        if (!text) return '';
        
        return text
            // Remove HTML tags
            .replace(/<[^>]*>/g, ' ')
            // Remove markdown formatting
            .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/```[\s\S]*?```/g, 'code block')
            .replace(/#{1,6}\s/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^\* /gm, '')
            .replace(/^- /gm, '')
            .replace(/^\d+\. /gm, '')
            // Clean up whitespace
            .replace(/\s+/g, ' ')
            .trim();
    };

    const speakText = (text, messageId = null) => {
        if (!speechSynthRef.current || !selectedVoice) return;

        // Stop any current speech
        speechSynthRef.current.cancel();

        const cleanText = cleanTextForSpeech(text);
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = selectedVoice;
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setIsReading(true);
            setReadingMessageId(messageId);
        };

        utterance.onend = () => {
            setIsReading(false);
            setReadingMessageId(null);
        };

        utterance.onerror = () => {
            setIsReading(false);
            setReadingMessageId(null);
            console.error('Speech synthesis error');
        };

        speechSynthRef.current.speak(utterance);
    };

    const stopReading = () => {
        if (speechSynthRef.current) {
            speechSynthRef.current.cancel();
            setIsReading(false);
            setReadingMessageId(null);
        }
    };

    const VoiceButton = ({ text, messageId, size = 'small', color = '#6b7280' }) => {
        const isCurrentlyReading = isReading && readingMessageId === messageId;
        const buttonSize = size === 'large' ? '24px' : '16px';
        
        return (
            <button
                onClick={() => isCurrentlyReading ? stopReading() : speakText(text, messageId)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    color: isCurrentlyReading ? color : '#6b7280',
                    backgroundColor: isCurrentlyReading ? `${color}20` : 'transparent',
                }}
                title={isCurrentlyReading ? 'Stop reading' : 'Read aloud'}
                onMouseOver={(e) => e.target.style.backgroundColor = `${color}20`}
                onMouseOut={(e) => e.target.style.backgroundColor = isCurrentlyReading ? `${color}20` : 'transparent'}
            >
                {isCurrentlyReading ? (
                    <svg width={buttonSize} height={buttonSize} viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                ) : (
                    <svg width={buttonSize} height={buttonSize} viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                )}
            </button>
        );
    };

    // Voice controls component
    const VoiceControls = () => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            fontSize: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '15px'
        }}>
            <span style={{ color: '#374151', fontWeight: '500' }}>Voice:</span>
            <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                }}
                style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#374151'
                }}
            >
                {voices.filter(voice => voice.lang.includes('en')).map(voice => (
                    <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
            {isReading && (
                <button
                    onClick={stopReading}
                    style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Stop All
                </button>
            )}
        </div>
    );

    // Markdown rendering function
    const renderMarkdown = (text) => {
        if (!text) return '';
        
        // Convert markdown to HTML
        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #1f2937;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 20px; font-weight: bold; margin: 25px 0 15px 0; color: #1f2937;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 24px; font-weight: bold; margin: 30px 0 20px 0; color: #1f2937;">$1</h1>')
            
            // Bold and italic
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em style="font-weight: bold; font-style: italic;">$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
            
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; overflow-x: auto; border: 1px solid #e5e7eb;"><code style="font-family: Monaco, Consolas, monospace; font-size: 13px;">$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: Monaco, Consolas, monospace; font-size: 13px;">$1</code>')
            
            // Lists
            .replace(/^\* (.*$)/gim, '<li style="margin: 5px 0; margin-left: 20px;">$1</li>')
            .replace(/^- (.*$)/gim, '<li style="margin: 5px 0; margin-left: 20px;">$1</li>')
            .replace(/^(\d+)\. (.*$)/gim, '<li style="margin: 5px 0; margin-left: 20px; list-style-type: decimal;">$2</li>')
            
            // Line breaks
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #3b82f6; text-decoration: underline;">$1</a>');
            
        // Wrap consecutive list items in ul tags
        html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul style="margin: 10px 0; padding-left: 0;">$&</ul>');
        
        return html;
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
            position: 'relative',
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
        clearButton: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: '#ef4444',
            color: 'white',
            transition: 'all 0.2s ease',
            marginLeft: '8px',
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
        },
        conversationControls: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '10px 0',
            borderBottom: '1px solid #e5e7eb',
        },
        conversationInfo: {
            fontSize: '12px',
            color: '#6b7280',
        },
        messageHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
        },
        summaryHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
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

    const fetchCurrentDiscussion = async () => {
        setDiscussionLoading(true);
        try {
            const response = await fetch(`${baseUrl}/get_current_gpt_discussion/`);
            if (response.ok) {
                const data = await response.json();
                setGptDiscussion(data.discussion);
                setDiscussionMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching GPT discussion:', error);
        } finally {
            setDiscussionLoading(false);
        }
    };

    const triggerManualDiscussion = async () => {
        setTriggeringDiscussion(true);
        try {
            const response = await fetch(`${baseUrl}/trigger_manual_gpt_discussion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                // Wait a moment for the discussion to complete
                setTimeout(() => {
                    fetchCurrentDiscussion();
                }, 2000);
            }
        } catch (error) {
            console.error('Error triggering GPT discussion:', error);
        } finally {
            setTriggeringDiscussion(false);
        }
    };

    // Load conversation history for a specific GPT
    const loadConversationHistory = async (gptType) => {
        if (conversationHistoryLoading[gptType] || chatMessages[gptType] || gptType === 'GPTDiscussion') {
            return; // Already loading or loaded, or it's GPT Discussion
        }

        setConversationHistoryLoading(prev => ({ ...prev, [gptType]: true }));
        
        try {
            const response = await fetch(`${baseUrl}/${gptSystems[gptType].historyEndpoint}/`);
            if (response.ok) {
                const data = await response.json();
                const formattedMessages = data.conversation_history.map(item => [
                    {
                        role: 'user',
                        content: item.user_message,
                        timestamp: new Date(item.timestamp).toLocaleTimeString()
                    },
                    {
                        role: 'assistant',
                        content: item.ai_response,
                        timestamp: new Date(item.timestamp).toLocaleTimeString()
                    }
                ]).flat();

                setChatMessages(prev => ({
                    ...prev,
                    [gptType]: formattedMessages
                }));
            } else {
                // No conversation history exists yet
                setChatMessages(prev => ({
                    ...prev,
                    [gptType]: []
                }));
            }
        } catch (error) {
            console.error(`Error loading conversation history for ${gptType}:`, error);
            setChatMessages(prev => ({
                ...prev,
                [gptType]: []
            }));
        } finally {
            setConversationHistoryLoading(prev => ({ ...prev, [gptType]: false }));
        }
    };

    // Clear conversation history for a specific GPT
    const clearConversationHistory = async (gptType) => {
        try {
            const response = await fetch(`${baseUrl}/clear_conversation_history/${gptType}/`, {
                method: 'POST',
            });
            
            if (response.ok) {
                setChatMessages(prev => ({
                    ...prev,
                    [gptType]: []
                }));
            }
        } catch (error) {
            console.error(`Error clearing conversation history for ${gptType}:`, error);
        }
    };

    // Modified function to only fetch existing summaries, not generate new ones
    const fetchExistingSummaries = async () => {
        setSummariesLoading(true);
        const summaries = {};
        
        // Only fetch for GPT systems that have endpoints (exclude GPTDiscussion)
        const gptTypesWithEndpoints = Object.keys(gptSystems).filter(key => 
            gptSystems[key].endpoint && key !== 'GPTDiscussion'
        );
        
        for (const gptType of gptTypesWithEndpoints) {
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
        if (!currentMessage.trim() || activeGPT === 'GPTDiscussion') return;

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
        fetchCurrentDiscussion();
    }, []);

    // Load conversation history when switching to chat mode
    useEffect(() => {
        if (viewMode === 'chat' && activeGPT !== 'GPTDiscussion') {
            loadConversationHistory(activeGPT);
        }
    }, [viewMode, activeGPT]);

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

    const renderDiscussionMessage = (message, index) => {
        const system = discussionSystems[message.gpt_system];
        const isTopicMessage = message.gpt_system === 'CentralGPT' && message.turn_number === 0;
        const messageId = `discussion-${index}`;
        
        return (
            <div 
                key={index}
                style={{
                    ...styles.message,
                    backgroundColor: isTopicMessage ? '#f0f9ff' : system?.bgColor || '#f9fafb',
                    border: `1px solid ${system?.borderColor || '#e5e7eb'}`,
                    borderLeft: `4px solid ${system?.color || '#6b7280'}`,
                    alignSelf: 'flex-start',
                    maxWidth: '100%',
                    margin: '10px 0',
                    position: 'relative'
                }}
            >
                <div style={styles.messageHeader}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: system?.color || '#6b7280'
                        }} />
                        <span style={{
                            fontWeight: 'bold',
                            color: system?.color || '#6b7280',
                            fontSize: '13px'
                        }}>
                            {message.gpt_system}
                        </span>
                        {message.turn_number > 0 && (
                            <span style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>
                                Round {message.turn_number}
                            </span>
                        )}
                    </div>
                    <VoiceButton 
                        text={message.message} 
                        messageId={messageId}
                        color={system?.color || '#6b7280'}
                    />
                </div>
                
                <div style={{
                    fontSize: isTopicMessage ? '16px' : '14px',
                    fontWeight: isTopicMessage ? 'bold' : 'normal',
                    color: '#374151',
                    lineHeight: '1.5'
                }}>
                    {isTopicMessage ? (
                        <span style={{ color: '#1f2937' }}>
                            {message.message.replace('Discussion Topic: ', '')}
                        </span>
                    ) : (
                        message.message
                    )}
                </div>
                
                <div style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    marginTop: '8px',
                    textAlign: 'right'
                }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        );
    };

    const renderDiscussionContent = () => {
        if (discussionLoading) {
            return (
                <div style={styles.noSummaryMessage}>
                    <div style={{ marginBottom: '15px' }}>Loading GPT Discussion...</div>
                </div>
            );
        }

        if (!gptDiscussion) {
            return (
                <div style={styles.noSummaryMessage}>
                    <div style={{ marginBottom: '15px', fontSize: '18px' }}>
                        No GPT Discussion Available
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280' }}>
                        GPT discussions happen automatically every 5 days, or you can trigger one manually.
                        The specialized AI systems will discuss SnowAI insights and share their perspectives.
                    </div>
                    <button
                        onClick={triggerManualDiscussion}
                        disabled={triggeringDiscussion}
                        style={{
                            ...styles.refreshButton,
                            backgroundColor: '#6366f1',
                            opacity: triggeringDiscussion ? 0.5 : 1,
                            cursor: triggeringDiscussion ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {triggeringDiscussion ? 'Starting Discussion...' : 'Start GPT Discussion'}
                    </button>
                </div>
            );
        }

        return (
            <div style={styles.summaryContent}>
                {/* Voice Controls */}
                <VoiceControls />
                
                {/* Discussion Header */}
                <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '25px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                            Discussion Overview
                        </h3>
                        <span style={{
                            fontSize: '12px',
                            color: gptDiscussion.is_active ? '#059669' : '#6b7280',
                            backgroundColor: gptDiscussion.is_active ? '#d1fae5' : '#f3f4f6',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontWeight: '600'
                        }}>
                            {gptDiscussion.is_active ? 'Active' : 'Completed'}
                        </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '13px' }}>
                        <div>
                            <strong>Started:</strong> {new Date(gptDiscussion.started_at).toLocaleString()}
                        </div>
                        <div>
                            <strong>Total Messages:</strong> {gptDiscussion.total_messages}
                        </div>
                        <div>
                            <strong>Trigger:</strong> {gptDiscussion.trigger_type === 'manual' ? 'Manual' : 'Scheduled'}
                        </div>
                        {gptDiscussion.completed_at && (
                            <div>
                                <strong>Completed:</strong> {new Date(gptDiscussion.completed_at).toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Discussion Messages */}
                <div style={{
                    marginBottom: '30px'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
                        Discussion Messages
                    </h3>
                    <div style={{
                        maxHeight: '500px',
                        overflowY: 'auto',
                        padding: '10px',
                        backgroundColor: '#fafbfc',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        {discussionMessages.map((message, index) => renderDiscussionMessage(message, index))}
                    </div>
                </div>

                {/* CentralGPT Summary */}
                {gptDiscussion.central_gpt_summary && (
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #bfdbfe',
                        borderLeft: '4px solid #3b82f6',
                        marginBottom: '25px'
                    }}>
                        <div style={styles.summaryHeader}>
                            <h3 style={{ 
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                margin: 0,
                                color: '#1e40af',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                CentralGPT Analysis
                            </h3>
                            <VoiceButton 
                                text={gptDiscussion.central_gpt_summary} 
                                messageId="central-gpt-summary"
                                size="large"
                                color="#3b82f6"
                            />
                        </div>
                        <div dangerouslySetInnerHTML={{ 
                            __html: renderMarkdown(gptDiscussion.central_gpt_summary)
                        }} />
                    </div>
                )}

                {/* Discussion Metrics */}
                {gptDiscussion.discussion_metrics && Object.keys(gptDiscussion.discussion_metrics).length > 0 && (
                    <div style={{
                        backgroundColor: '#f9fafb',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
                            Discussion Metrics
                        </h3>
                        
                        {/* Key Metrics Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                    {gptDiscussion.discussion_metrics.rounds_completed || 0}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Rounds</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                                    {gptDiscussion.discussion_metrics.total_words || 0}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Words</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                                    {gptDiscussion.discussion_metrics.participating_systems || 0}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>AI Systems</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                                    {gptDiscussion.discussion_metrics.discussion_duration_minutes || 0}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Minutes</div>
                            </div>
                        </div>

                        {/* Word Counts by GPT */}
                        {gptDiscussion.discussion_metrics.word_counts && (
                            <div style={{ marginTop: '15px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                                    Word Contributions by AI System:
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                                    {Object.entries(gptDiscussion.discussion_metrics.word_counts).map(([gpt, words]) => (
                                        <div key={gpt} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '8px 12px',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            fontSize: '13px'
                                        }}>
                                            <span style={{ color: discussionSystems[gpt]?.color || '#6b7280', fontWeight: '500' }}>
                                                {gpt}:
                                            </span>
                                            <span style={{ color: '#1f2937', fontWeight: '600' }}>{words}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Manual Trigger Button */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                        onClick={triggerManualDiscussion}
                        disabled={triggeringDiscussion}
                        style={{
                            ...styles.refreshButton,
                            backgroundColor: '#6366f1',
                            opacity: triggeringDiscussion ? 0.5 : 1,
                            cursor: triggeringDiscussion ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {triggeringDiscussion ? 'Starting New Discussion...' : 'Start New Discussion'}
                    </button>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                        Starting a new discussion will replace the current one
                    </div>
                </div>
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
                {/* Voice Controls */}
                <VoiceControls />
                
                {/* Summary Header with Voice Button */}
                <div style={styles.summaryHeader}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        Summary Content
                    </h3>
                    <VoiceButton 
                        text={summaryData.summary} 
                        messageId={`summary-${activeGPT}`}
                        size="large"
                        color={gptSystems[activeGPT].color}
                    />
                </div>

                {summaryData.summary && (
                    <div dangerouslySetInnerHTML={{ 
                        __html: renderMarkdown(summaryData.summary)
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
                                        if (gptType === 'GPTDiscussion') {
                                            fetchCurrentDiscussion();
                                        }
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
                            {/* Mode Toggle - only show for non-GPTDiscussion */}
                            {activeGPT !== 'GPTDiscussion' && (
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
                                        Summary
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
                                        Chat
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            {activeGPT === 'GPTDiscussion' ? (
                                <div>
                                    <h2 style={{ 
                                        color: gptSystems[activeGPT].color, 
                                        marginBottom: '20px',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        GPT Discussion Hub
                                    </h2>
                                    {renderDiscussionContent()}
                                </div>
                            ) : viewMode === 'summary' ? (
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

                                    {/* Voice Controls in Chat */}
                                    <VoiceControls />

                                    {/* Conversation Controls */}
                                    <div style={styles.conversationControls}>
                                        <div style={styles.conversationInfo}>
                                            Messages: {(chatMessages[activeGPT] || []).length} | 
                                            Persistent conversation memory enabled
                                        </div>
                                        <button
                                            onClick={() => clearConversationHistory(activeGPT)}
                                            style={styles.clearButton}
                                        >
                                            Clear History
                                        </button>
                                    </div>
                                    
                                    <div style={styles.chatContainer}>
                                        <div style={styles.messagesContainer}>
                                            {conversationHistoryLoading[activeGPT] ? (
                                                <div style={{
                                                    ...styles.message,
                                                    ...styles.loadingMessage
                                                }}>
                                                    Loading conversation history...
                                                </div>
                                            ) : (
                                                (chatMessages[activeGPT] || []).map((message, index) => {
                                                    const messageId = `chat-${activeGPT}-${index}`;
                                                    return (
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
                                                            {message.role === 'assistant' && (
                                                                <div style={{ 
                                                                    display: 'flex', 
                                                                    justifyContent: 'space-between', 
                                                                    alignItems: 'flex-start',
                                                                    marginBottom: '8px'
                                                                }}>
                                                                    <span style={{ 
                                                                        fontSize: '12px', 
                                                                        color: '#6b7280',
                                                                        fontWeight: '600'
                                                                    }}>
                                                                        {gptSystems[activeGPT].name}
                                                                    </span>
                                                                    <VoiceButton 
                                                                        text={message.content} 
                                                                        messageId={messageId}
                                                                        color={gptSystems[activeGPT].color}
                                                                    />
                                                                </div>
                                                            )}
                                                            
                                                            <div dangerouslySetInnerHTML={{ 
                                                                __html: message.role === 'assistant' ? renderMarkdown(message.content) : message.content 
                                                            }} />
                                                            
                                                            <div style={{ 
                                                                fontSize: '11px', 
                                                                opacity: 0.7, 
                                                                marginTop: '5px',
                                                                textAlign: 'right'
                                                            }}>
                                                                {message.timestamp}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
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