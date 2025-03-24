import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function CallAI() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [isCallActive, setIsCallActive] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [accountData, setAccountData] = useState(null);
    
    // Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const streamRef = useRef(null);
    
    // Parameters for silence detection
    const SILENCE_THRESHOLD = -50; // dB (adjust based on testing)
    const SILENCE_DURATION = 1500; // ms - wait this long after silence before sending
    
    // Fetch OpenAI API key on component mount
    useEffect(() => {
        fetchAPIKey();
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
    
    const fetchEmailDataFromAPI = async () => {
        // Implement this function to fetch email data
        // This was referenced but not defined in your original code
        return Cookies.get('user_email') || '';
    };
    
    // Cleanup function for audio processing
    const cleanupAudio = () => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
        
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop());
            streamRef.current = null;
        }
        
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.error("Error closing audio context:", e));
        }
        
        audioContextRef.current = null;
        analyserRef.current = null;
    };
    
    // Component cleanup
    useEffect(() => {
        return () => {
            cleanupAudio();
        };
    }, []);
    
    // Start a call with the AI assistant
    const startCall = () => {
        setIsCallActive(true);
        setConversation([{ role: "assistant", content: "Hello, how can I help you today?" }]);
        
        // Use the Web Speech API to speak the initial greeting
        const utterance = new SpeechSynthesisUtterance("Hello, how can I help you today?");
        window.speechSynthesis.speak(utterance);
        
        // Start listening immediately after greeting
        setTimeout(() => {
            startListening();
        }, 1500);
    };
    
    // End the call and clean up
    const endCall = () => {
        setIsCallActive(false);
        setConversation([]);
        if (isListening) {
            stopListening();
        }
        cleanupAudio();
    };
    
    // Function to detect silence
    const detectSilence = (analyser, dataArray) => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // Convert to dB
        const dB = 20 * Math.log10(average / 255);
        
        // If below threshold, consider it silence
        return dB < SILENCE_THRESHOLD;
    };
    
    // Start listening for voice input
    const startListening = async () => {
        try {
            cleanupAudio(); // Clean up any existing audio processing
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            // Set up audio context and analyser for silence detection
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            
            // Create media recorder
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = handleRecordingStop;
            
            // Start recording
            mediaRecorderRef.current.start();
            setIsListening(true);
            
            // Set up silence detection loop
            let silenceStart = null;
            const checkSilence = () => {
                if (!isListening || !analyserRef.current) return;
                
                const isSilent = detectSilence(analyserRef.current, dataArray);
                
                if (isSilent) {
                    if (silenceStart === null) {
                        silenceStart = Date.now();
                    } else if (Date.now() - silenceStart > SILENCE_DURATION) {
                        // Silence detected for long enough, stop listening and process
                        if (audioChunksRef.current.length > 0) {
                            stopListening();
                            return;
                        }
                    }
                } else {
                    // Reset silence timer if sound is detected
                    silenceStart = null;
                }
                
                // Continue checking
                requestAnimationFrame(checkSilence);
            };
            
            // Start the silence detection loop
            requestAnimationFrame(checkSilence);
            
        } catch (error) {
            console.error("Error starting listening:", error);
        }
    };
    
    // Stop listening and process the recorded audio
    const stopListening = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsListening(false);
            setIsProcessing(true);
        }
    };
    
    // Process the recorded audio after stopping
    const handleRecordingStop = async () => {
        try {
            if (audioChunksRef.current.length === 0) {
                setIsProcessing(false);
                // If no audio was captured, start listening again
                if (isCallActive) {
                    setTimeout(() => startListening(), 500);
                }
                return;
            }
            
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Convert audio to base64 for sending to the API
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob); 
            reader.onloadend = async () => {
                // Send audio to Whisper API for transcription
                const transcription = await getTranscription(audioBlob);
                
                if (transcription && transcription.trim() !== "") {
                    // Add user message to conversation
                    const updatedConversation = [
                        ...conversation, 
                        { role: "user", content: transcription }
                    ];
                    setConversation(updatedConversation);
                    
                    // Get GPT response
                    await getGPTResponse(updatedConversation);
                } else {
                    setIsProcessing(false);
                    // Start listening again if still in call
                    if (isCallActive) {
                        setTimeout(() => startListening(), 500);
                    }
                }
            };
        } catch (error) {
            console.error("Error processing recording:", error);
            setIsProcessing(false);
            // Start listening again if still in call
            if (isCallActive) {
                setTimeout(() => startListening(), 500);
            }
        }
    };
    
    // Fetch news data
    useEffect(() => {
        async function fetchNewsData() {
            try {
                const email = await fetchEmailDataFromAPI();
                const response = await fetch(`${baseUrl}/fetch_user_news_data/${email}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setNewsData(data);
            } catch (error) {
                console.error("Error fetching news data:", error);
            }
        }
        fetchNewsData();
    }, []);
    
    // Fetch account data
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                // Get the account_name from cookies
                const accountName = Cookies.get('account_name');
                if (!accountName) {
                    console.error('Account name is not set in cookies');
                    return;
                }
                
                // Fetch account data from the Django API with account_name as a query parameter
                const response = await fetch(`${baseUrl}/fetch-account-data/?account_name=${accountName}`);
                
                if (response.ok) {
                    const parsedData = await response.json();
                    setAccountData(parsedData); // Store account data
                    console.log('Account Data is ', parsedData);
                } else {
                    const errorData = await response.json();
                    console.error(errorData.error || 'An error occurred while fetching the account data');
                }
            } catch (error) {
                console.error('Error fetching account data: ' + error.message);
            }
        };
        
        fetchAccountData();
    }, []); // Runs once on mount
    
    // Get transcription from audio using Whisper API
    const getTranscription = async (audioBlob) => {
        try {
            // Create FormData and append the actual blob
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");
            formData.append("model", "whisper-1");
            
            const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    // Don't set Content-Type header when using FormData
                },
                body: formData
            });
            
            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("Error with transcription:", error);
            return "Sorry, I couldn't transcribe that.";
        }
    };
    
    // Get GPT response based on conversation
    const getGPTResponse = async (currentConversation) => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `
                                Your name is Livingston. You are an intelligent investment assistant.
                                
                                KEEP RESPONSES SHORT AND SWEET!
                                NO LONG RESPONSES PLEASE.
                                
                                Your job is to assist me as I trade.
                                //  My Trade Data: ${JSON.stringify(accountData)}

                                News Data: ${JSON.stringify(newsData)}

                                My name is Tlotlo Motingwe. I am 21 years old. 
                                                
                                // Platform description and features...
                                // [rest of system prompt omitted for brevity]
                                
                                KEEP RESPONSES SHORT AND SWEET!
                                NO LONG RESPONSES PLEASE.
                            `,
                        },
                        ...currentConversation.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                }),
            });
            
            const data = await response.json();
            const gptResponse = data.choices[0].message.content;
            
            // Add assistant response to conversation
            setConversation([
                ...currentConversation, 
                { role: "assistant", content: gptResponse }
            ]);
            
            // Convert GPT text response to speech
            await textToSpeech(gptResponse);
            
            setIsProcessing(false);
            
            // Wait for the speech to finish before listening again
            const estimatedSpeechTime = gptResponse.split(' ').length * 200; // Rough estimate: 200ms per word
            setTimeout(() => {
                if (isCallActive) {
                    startListening();
                }
            }, estimatedSpeechTime + 500); // Add a small buffer
            
        } catch (error) {
            console.error("Error getting GPT response:", error);
            setIsProcessing(false);
            // Start listening again if still in call
            if (isCallActive) {
                setTimeout(() => startListening(), 500);
            }
        }
    };
    
    // Convert text to speech
    const textToSpeech = async (text) => {
        return new Promise((resolve) => {
            // Using Web Speech API for text-to-speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onend = () => {
                resolve();
            };
            
            window.speechSynthesis.speak(utterance);
            
            // Fallback in case onend doesn't fire
            setTimeout(() => {
                resolve();
            }, text.split(' ').length * 200 + 2000);
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
                    <h5 className="major-upcoming-news-events-header">Call Livingston</h5>
                    
                    <div className="futuristic-caller-container">
                        <div className={`phone-interface ${isCallActive ? 'active-call' : ''}`}>
                            <div className="caller-display">
                                <div className="caller-avatar">
                                    <div className="avatar-circle">
                                        {isCallActive && (
                                            <div className={`audio-visualizer ${isListening ? 'visualizing' : ''}`}>
                                                <div className="bar"></div>
                                                <div className="bar"></div>
                                                <div className="bar"></div>
                                                <div className="bar"></div>
                                                <div className="bar"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="caller-info">
                                    <h3>Livingston AI</h3>
                                    <p className="status-text">
                                        {!isCallActive ? 'Ready to call' : 
                                         isProcessing ? 'Thinking...' : 
                                         isListening ? 'Listening...' : 'Speaking...'}
                                    </p>
                                </div>
                                
                                <div className="conversation-display">
                                    {conversation.map((msg, index) => (
                                        <div key={index} className={`message ${msg.role}`}>
                                            <p>{msg.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="call-controls">
                                {!isCallActive ? (
                                    <button 
                                        className="call-button start" 
                                        onClick={startCall}
                                    >
                                        Start Call
                                    </button>
                                ) : (
                                    <button 
                                        className="call-button end" 
                                        onClick={endCall}
                                    >
                                        End Call
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <style jsx>{`
                        // CSS remains the same as in your original code
                        .futuristic-caller-container {
                            display: flex;
                            justify-content: center;
                            padding: 2rem;
                        }
                        
                        .phone-interface {
                            width: 100%;
                            max-width: 500px;
                            background: linear-gradient(145deg, #f0f2f5, #e6eaf0);
                            border-radius: 24px;
                            padding: 2rem;
                            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                            color: #333;
                            overflow: hidden;
                        }
                        
                        .active-call {
                            border: 2px solid #4cc9f0;
                            box-shadow: 0 0 20px rgba(76, 201, 240, 0.3);
                        }
                        
                        .caller-display {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin-bottom: 2rem;
                        }
                        
                        .caller-avatar {
                            margin-bottom: 1.5rem;
                        }
                        
                        .avatar-circle {
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, #4361ee, #3a0ca3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                        }
                        
                        .audio-visualizer {
                            display: flex;
                            align-items: flex-end;
                            height: 60px;
                            width: 60px;
                            justify-content: space-between;
                        }
                        
                        .audio-visualizer .bar {
                            width: 8px;
                            background-color: #4cc9f0;
                            border-radius: 4px;
                        }
                        
                        .visualizing .bar:nth-child(1) { height: 20px; animation: sound 0.5s infinite alternate; }
                        .visualizing .bar:nth-child(2) { height: 40px; animation: sound 0.7s infinite alternate; }
                        .visualizing .bar:nth-child(3) { height: 60px; animation: sound 0.8s infinite alternate; }
                        .visualizing .bar:nth-child(4) { height: 40px; animation: sound 0.9s infinite alternate; }
                        .visualizing .bar:nth-child(5) { height: 20px; animation: sound 0.6s infinite alternate; }
                        
                        @keyframes sound {
                            0% { height: 10px; }
                            100% { height: 100%; }
                        }
                        
                        .caller-info {
                            text-align: center;
                        }
                        
                        .caller-info h3 {
                            font-size: 1.8rem;
                            margin: 0;
                            background: linear-gradient(90deg, #4cc9f0, #7209b7);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                        
                        .status-text {
                            font-size: 1rem;
                            color: #555;
                            margin-top: 0.5rem;
                        }
                        
                        .conversation-display {
                            width: 100%;
                            max-height: 200px;
                            overflow-y: auto;
                            margin-top: 1.5rem;
                            padding: 1rem;
                            background-color: rgba(245, 247, 250, 0.8);
                            border-radius: 12px;
                            border: 1px solid #ddd;
                        }
                        
                        .message {
                            margin-bottom: 0.8rem;
                            padding: 0.8rem;
                            border-radius: 12px;
                            max-width: 85%;
                        }
                        
                        .message.user {
                            background-color: #4361ee;
                            color: white;
                            align-self: flex-end;
                            margin-left: auto;
                        }
                        
                        .message.assistant {
                            background-color: #e9ecef;
                            color: #333;
                            align-self: flex-start;
                        }
                        
                        .message p {
                            margin: 0;
                        }
                        
                        .call-controls {
                            display: flex;
                            justify-content: center;
                            gap: 1.5rem;
                        }
                        
                        .call-button {
                            padding: 0.8rem 1.5rem;
                            border-radius: 50px;
                            border: none;
                            font-weight: bold;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }
                        
                        .call-button.start {
                            background: linear-gradient(90deg, #4cc9f0, #4361ee);
                            color: white;
                            padding: 1rem 2rem;
                            box-shadow: 0 4px 12px rgba(76, 201, 240, 0.3);
                        }
                        
                        .call-button.end {
                            background: linear-gradient(90deg, #f72585, #b5179e);
                            color: white;
                            box-shadow: 0 4px 12px rgba(247, 37, 133, 0.3);
                        }
                        
                        @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(247, 37, 133, 0.7); }
                            70% { box-shadow: 0 0 0 10px rgba(247, 37, 133, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(247, 37, 133, 0); }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
}