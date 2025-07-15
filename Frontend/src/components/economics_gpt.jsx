import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Send, TrendingUp, DollarSign, MessageSquare, Loader2 } from "lucide-react";

export default function EconomicsGPT() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [economicData, setEconomicData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const messagesEndRef = useRef(null);
    
    const currencies = [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
    ];
    
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
    
    const fetchEconomicDataForCurrency = async (currency) => {
        setIsFetchingData(true);
        try {
            const response = await fetch(`${baseUrl}/api/v1/economics/fetch-currency-economic-insights/${currency}/`);
            if (!response.ok) throw new Error("Failed to fetch economic data");
            const data = await response.json();
            setEconomicData(data);
            
            // Add system message about loaded data
            const systemMessage = {
                id: Date.now(),
                role: 'system',
                content: `Economic data for ${currency} has been loaded. I now have access to recent economic events, forecasts, and data for this currency. You can ask me questions about economic indicators, trends, or analysis for ${currency}.`,
                timestamp: new Date().toISOString()
            };
            setMessages([systemMessage]);
        } catch (error) {
            console.error("Error fetching economic data:", error);
            const errorMessage = {
                id: Date.now(),
                role: 'system',
                content: `Failed to load economic data for ${currency}. Please try again.`,
                timestamp: new Date().toISOString()
            };
            setMessages([errorMessage]);
        } finally {
            setIsFetchingData(false);
        }
    };
    
    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setMessages([]);
        setEconomicData([]);
        if (currency) {
            fetchEconomicDataForCurrency(currency);
        }
    };
    
    const sendMessageToGPT = async (userMessage, economicContext) => {
        const systemPrompt = `You are an expert economics analyst. You have access to the following economic data for ${selectedCurrency}:
        
        ${JSON.stringify(economicContext, null, 2)}
        
        Based on this data, provide insightful analysis and answers to user questions about ${selectedCurrency} economics, trends, forecasts, and market implications. Be specific and reference the actual data when relevant.`;
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) throw new Error('Failed to get response from OpenAI');
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return 'Sorry, I encountered an error while processing your request. Please try again.';
        }
    };
    
    const handleSendMessage = async () => {
        if (!currentMessage.trim() || !selectedCurrency || !OPENAI_API_KEY) return;
        
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: currentMessage,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage("");
        setIsLoading(true);
        
        try {
            const aiResponse = await sendMessageToGPT(currentMessage, economicData);
            
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="economics-gpt-main-container">
            <style jsx>{`
                .economics-gpt-main-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .economics-gpt-header-section {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border-bottom: 2px solid #3b82f6;
                }
                
                .economics-gpt-main-page-body {
                    display: flex;
                    min-height: calc(100vh - 80px);
                }
                
                .economics-gpt-content-area {
                    flex: 1;
                    padding: 20px;
                    background: white;
                    margin: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                }
                
                .economics-gpt-page-title {
                    color: #1e40af;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                
                .economics-gpt-currency-selector-section {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    color: white;
                }
                
                .economics-gpt-currency-selector-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .economics-gpt-currency-dropdown {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    background: white;
                    color: #1e40af;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .economics-gpt-currency-dropdown:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .economics-gpt-chat-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #f8fafc;
                    border-radius: 12px;
                    overflow: hidden;
                }
                
                .economics-gpt-messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    min-height: 400px;
                    max-height: 500px;
                }
                
                .economics-gpt-message-bubble {
                    margin-bottom: 16px;
                    max-width: 80%;
                    animation: fadeIn 0.3s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .economics-gpt-user-message {
                    margin-left: auto;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 12px 18px;
                    border-radius: 20px 20px 8px 20px;
                    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
                }
                
                .economics-gpt-ai-message {
                    background: white;
                    color: #334155;
                    padding: 12px 18px;
                    border-radius: 20px 20px 20px 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #3b82f6;
                }
                
                .economics-gpt-system-message {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 12px 18px;
                    border-radius: 12px;
                    text-align: center;
                    font-style: italic;
                    border: 1px solid #0ea5e9;
                }
                
                .economics-gpt-input-section {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }
                
                .economics-gpt-message-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 16px;
                    resize: vertical;
                    min-height: 48px;
                    max-height: 120px;
                    transition: all 0.3s ease;
                }
                
                .economics-gpt-message-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .economics-gpt-send-button {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    padding: 12px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    min-height: 48px;
                }
                
                .economics-gpt-send-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
                }
                
                .economics-gpt-send-button:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .economics-gpt-loading-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    font-style: italic;
                    padding: 12px 18px;
                }
                
                .economics-gpt-empty-state {
                    text-align: center;
                    color: #64748b;
                    font-size: 18px;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }
                
                .economics-gpt-data-loading {
                    background: #fef3c7;
                    color: #92400e;
                    padding: 12px 18px;
                    border-radius: 12px;
                    text-align: center;
                    font-weight: 500;
                    border: 1px solid #fbbf24;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h1 className="economics-gpt-page-title">
                        <TrendingUp size={36} />
                        EconomicsGPT
                    </h1>
                    
                    <div className="economics-gpt-currency-selector-section">
                        <h3 className="economics-gpt-currency-selector-title">
                            <DollarSign size={20} />
                            Select Currency for Analysis
                        </h3>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            className="economics-gpt-currency-dropdown"
                        >
                            <option value="">Choose a currency...</option>
                            {currencies.map(currency => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.code} - {currency.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="economics-gpt-chat-container">
                        <div className="economics-gpt-messages-area">
                            {!selectedCurrency ? (
                                <div className="economics-gpt-empty-state">
                                    <MessageSquare size={48} />
                                    <p>Select a currency to start analyzing economic data and asking questions!</p>
                                </div>
                            ) : isFetchingData ? (
                                <div className="economics-gpt-data-loading">
                                    <Loader2 size={20} className="animate-spin" />
                                    Loading economic data for {selectedCurrency}...
                                </div>
                            ) : (
                                <>
                                    {messages.map(message => (
                                        <div key={message.id} className="economics-gpt-message-bubble">
                                            <div className={
                                                message.role === 'user' ? 'economics-gpt-user-message' :
                                                message.role === 'system' ? 'economics-gpt-system-message' :
                                                'economics-gpt-ai-message'
                                            }>
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="economics-gpt-loading-indicator">
                                            <Loader2 size={16} className="animate-spin" />
                                            Analyzing economic data...
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>
                        
                        <div className="economics-gpt-input-section">
                            <textarea
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={selectedCurrency ? `Ask me about ${selectedCurrency} economics...` : "Select a currency first"}
                                className="economics-gpt-message-input"
                                disabled={!selectedCurrency || isFetchingData}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!currentMessage.trim() || !selectedCurrency || isLoading || isFetchingData}
                                className="economics-gpt-send-button"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}