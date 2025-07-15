import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Send, TrendingUp, DollarSign, MessageSquare, Loader2, Image, X, Upload, Volume2, VolumeX, Pause, Play } from "lucide-react";

export default function EconomicsGPT() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [economicData, setEconomicData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const speechSynthesisRef = useRef(null);
    
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
                content: `Economic data for ${currency} has been loaded. I now have access to recent economic events, forecasts, and data for this currency. You can ask me questions about economic indicators, trends, or analysis for ${currency}. You can also upload trading charts for visual analysis.`,
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
        // Stop any ongoing speech
        stopSpeech();
        
        setSelectedCurrency(currency);
        setMessages([]);
        setEconomicData([]);
        setUploadedImage(null);
        setImagePreview(null);
        if (currency) {
            fetchEconomicDataForCurrency(currency);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Check file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setUploadedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const speakText = (text, messageId) => {
        // Stop any ongoing speech
        stopSpeech();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Natural')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setCurrentSpeakingId(messageId);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setCurrentSpeakingId(null);
            setIsPaused(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setCurrentSpeakingId(null);
            setIsPaused(false);
        };

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        setIsPaused(false);
    };

    const pauseSpeech = () => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeSpeech = () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const toggleSpeech = (messageId) => {
        if (currentSpeakingId === messageId) {
            if (isPaused) {
                resumeSpeech();
            } else {
                pauseSpeech();
            }
        } else {
            stopSpeech();
        }
    };
    
    const sendMessageToGPT = async (userMessage, economicContext, imageData = null) => {
        const systemPrompt = `You are an expert economics analyst and trading chart specialist. You have access to the following economic data for ${selectedCurrency}:
        
        ${JSON.stringify(economicContext, null, 2)}
        
        ${imageData ? 'You are also analyzing a trading chart image that the user has uploaded.' : ''}
        
        Based on this data${imageData ? ' and the chart image' : ''}, provide insightful analysis and answers to user questions about ${selectedCurrency} economics, trends, forecasts, market implications, and technical analysis. Be specific and reference the actual data and chart patterns when relevant.`;
        
        const messages = [
            { role: 'system', content: systemPrompt },
            { 
                role: 'user', 
                content: imageData ? [
                    { type: 'text', text: userMessage },
                    { type: 'image_url', image_url: { url: imageData } }
                ] : userMessage
            }
        ];
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: messages,
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
        if ((!currentMessage.trim() && !uploadedImage) || !selectedCurrency || !OPENAI_API_KEY) return;
        
        const messageContent = currentMessage.trim() || (uploadedImage ? "Please analyze this trading chart" : "");
        
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: messageContent,
            image: uploadedImage,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage("");
        setIsLoading(true);
        
        try {
            const aiResponse = await sendMessageToGPT(messageContent, economicData, uploadedImage);
            
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, aiMessage]);
            
            // Clear the image after sending
            setUploadedImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
        
        // Load voices on component mount
        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
        
        return () => {
            // Cleanup: stop speech on unmount
            stopSpeech();
        };
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
                
                .economics-gpt-message-wrapper {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .economics-gpt-user-message {
                    margin-left: auto;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 12px 18px;
                    border-radius: 20px 20px 8px 20px;
                    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
                }
                
                .economics-gpt-message-image {
                    margin-top: 8px;
                    max-width: 300px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .economics-gpt-ai-message {
                    background: white;
                    color: #334155;
                    padding: 12px 18px;
                    border-radius: 20px 20px 20px 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #3b82f6;
                    white-space: pre-wrap;
                    flex: 1;
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
                
                .economics-gpt-tts-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    align-items: center;
                    margin-top: 4px;
                }
                
                .economics-gpt-tts-button {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 6px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    transition: all 0.3s ease;
                    min-width: 32px;
                    height: 32px;
                }
                
                .economics-gpt-tts-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                }
                
                .economics-gpt-tts-button:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .economics-gpt-tts-button.active {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    animation: pulse 2s infinite;
                }
                
                .economics-gpt-tts-button.paused {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .economics-gpt-stop-button {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    border: none;
                    padding: 4px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                    transition: all 0.3s ease;
                    min-width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .economics-gpt-stop-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
                }
                
                .economics-gpt-input-section {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .economics-gpt-image-upload-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .economics-gpt-image-upload-button {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .economics-gpt-image-upload-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
                }
                
                .economics-gpt-image-preview {
                    position: relative;
                    display: inline-block;
                }
                
                .economics-gpt-image-preview img {
                    max-width: 200px;
                    max-height: 100px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .economics-gpt-image-remove-button {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s ease;
                }
                
                .economics-gpt-image-remove-button:hover {
                    background: #dc2626;
                    transform: scale(1.1);
                }
                
                .economics-gpt-message-input-row {
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
                
                .economics-gpt-hidden {
                    display: none;
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
                                            <div className="economics-gpt-message-wrapper">
                                                <div className={
                                                    message.role === 'user' ? 'economics-gpt-user-message' :
                                                    message.role === 'system' ? 'economics-gpt-system-message' :
                                                    'economics-gpt-ai-message'
                                                }>
                                                    {message.content}
                                                    {message.image && (
                                                        <img 
                                                            src={message.image} 
                                                            alt="Trading chart" 
                                                            className="economics-gpt-message-image"
                                                        />
                                                    )}
                                                </div>
                                                {message.role === 'assistant' && (
                                                    <div className="economics-gpt-tts-controls">
                                                        <button
                                                            onClick={() => {
                                                                if (currentSpeakingId === message.id) {
                                                                    toggleSpeech(message.id);
                                                                } else {
                                                                    speakText(message.content, message.id);
                                                                }
                                                            }}
                                                            className={`economics-gpt-tts-button ${
                                                                currentSpeakingId === message.id ? 
                                                                    (isPaused ? 'paused' : 'active') : ''
                                                            }`}
                                                            title={
                                                                currentSpeakingId === message.id ?
                                                                    (isPaused ? 'Resume' : 'Pause') :
                                                                    'Listen'
                                                            }
                                                        >
                                                            {currentSpeakingId === message.id ? (
                                                                isPaused ? <Play size={14} /> : <Pause size={14} />
                                                            ) : (
                                                                <Volume2 size={14} />
                                                            )}
                                                        </button>
                                                        {currentSpeakingId === message.id && (
                                                            <button
                                                                onClick={stopSpeech}
                                                                className="economics-gpt-stop-button"
                                                                title="Stop"
                                                            >
                                                                <VolumeX size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="economics-gpt-loading-indicator">
                                            <Loader2 size={16} className="animate-spin" />
                                            Analyzing economic data and chart...
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>
                        
                        <div className="economics-gpt-input-section">
                            <div className="economics-gpt-image-upload-section">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    className="economics-gpt-hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="economics-gpt-image-upload-button"
                                    disabled={!selectedCurrency || isFetchingData}
                                >
                                    <Upload size={16} />
                                    Upload Chart
                                </button>
                                
                                {imagePreview && (
                                    <div className="economics-gpt-image-preview">
                                        <img src={imagePreview} alt="Chart preview" />
                                        <button
                                            onClick={removeImage}
                                            className="economics-gpt-image-remove-button"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="economics-gpt-message-input-row">
                                <textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={selectedCurrency ? 
                                        `Ask me about ${selectedCurrency} economics or upload a chart to analyze...` : 
                                        "Select a currency first"
                                    }
                                    className="economics-gpt-message-input"
                                    disabled={!selectedCurrency || isFetchingData}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={(!currentMessage.trim() && !uploadedImage) || !selectedCurrency || isLoading || isFetchingData}
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
        </div>
    );
}