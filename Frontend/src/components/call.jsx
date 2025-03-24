import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function CallAI() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [responseAudio, setResponseAudio] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [isCallActive, setIsCallActive] = useState(false);
    const [newsData, setNewsData] = useState([]); // State to store news data
    const [accountData, setAccountData] = useState(null);
    
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    
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
    
    const startCall = () => {
        setIsCallActive(true);
        setConversation([{ role: "assistant", content: "Hello, how can I help you today?" }]);
        
        // Use the Web Speech API to speak the initial greeting
        const utterance = new SpeechSynthesisUtterance("Hello, how can I help you today?");
        window.speechSynthesis.speak(utterance);
    };
    
    const endCall = () => {
        setIsCallActive(false);
        setConversation([]);
        if (isRecording) {
            stopRecording();
        }
    };
    
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = handleRecordingStop;
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };
    
    const handleRecordingStop = async () => {
        try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Convert audio to base64 for sending to the API
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob); 
            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                
                // Send audio to Whisper API for transcription
                const transcription = await getTranscription(audioBlob); // Pass the blob directly
                
                // Add user message to conversation
                const updatedConversation = [
                    ...conversation, 
                    { role: "user", content: transcription }
                ];
                setConversation(updatedConversation);
                
                // Get GPT response
                await getGPTResponse(updatedConversation);
            };
        } catch (error) {
            console.error("Error processing recording:", error);
            setIsProcessing(false);
        }
    };

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
        
        useEffect(() => {
            const fetchAccountData = async () => {
              try {
                // Get the account_name from cookies
                const accountName = Cookies.get('account_name');
                if (!accountName) {
                  setError('Account name is not set in cookies');
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
                  setError(errorData.error || 'An error occurred while fetching the account data');
                }
              } catch (error) {
                setError('Error fetching account data: ' + error.message);
              }
            };
        
            fetchAccountData();
          }, []); // Runs once on mount
    
    
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
                                                

                                So, the way the platform works is, I have a landing page, and on this landing page, I can view the glowing thing I showed you, as well as play the snowstorm sound. And then I can log in, and then I have a login page, and then it takes me to the personal info section, where I can select multiple accounts and then view them throughout the platform. So, I have trading analytics per account, and then I want to have a lot of metrics for that, so I can see how I'm performing more in-depth, so I can have a centralized hub where I can plan more efficiently. And then I also have an AI chatbot called Livingston. Livingston has access to my trading history, news data, and yeah, it has access to those things, and then it can also view images and analyze images and give me trade advice based on my trading history. I also have a section where I can view interest rates, calculate differentials, and I can also view COT data reports, as well as open interest across different asset classes that I'm trading. And then I also have a section called the daily brief, where I can view the daily brief, where I get news data, and then Livingston summarizes them for me in a way that it's like a paragraph so that I can have a quick glimpse of what's going on for any set assets that I've chosen on the platform. And then also I have a part where I can create trading bots using Google Blockly. I can backtest using this part of the platform, as well as download the models, put them on MT5, and have them run using a VPS with a convolutional neural network hosted on Google Cloud. And then I can view the performance of these models on a section I call model performance. I also have a part where I've created something called a risk bot, which has a maximum allowable loss every day, as well as a maximum number of trades I can set per day, and it acts based on these parameters. I also have a section called chill, where I can view my trading notes, have a quizifier, an AI professor, and edit, add, delete my notes, as well. And then I also have a section where I have alert bot. So alert bot gives me alerts based on the alerts that I specify for different assets. Livingston can also analyze images, as well. That's also another thing. So that's just a small synopsis of how the SnowAI system works. 

                                So the main project for snowAI in 2025 is this: TraderGPT and CentralGPT.

                                TraderGPT I'll create by training or fine-tuning a GPT model with all my ict notes (both text and image). Then I'll enable it to run on MT5 and be able to feed it trading data for any asset it's on. Of course, I'll need to enable it as well to have intermarket analysis for confirmation analysis. As well as providing it with news data for said asset. 

                                Then I wanna ensure that different TraderGPT's specialise across different asset classes. And that they can take trades, record them on the snowAI system and always have access to historical data for their trade history.  

                                Then I wanna create a place where different TraderGPT's can come and 'meet' to discuss price action. So every week, there'll be a sort of research meeting between them and they'll discuss general market conditions and plan and strategise together. 

                                And then finally what I want is to create a CentralGPT: An AI assistant who'll oversee and lead all these TraderGPT's and who'll report back to me and act as my main right hand man.

                                Also, I've recently created a multiple accounts feature where I can create accounts on SnowAI and view performances across multiple accounts for different assets and asset classes with metrics like Performance by Trading Session, Day of Week, and Strategy. As well as I have an Equity curve for each account and win factor , average wins and losses, as well as a profit factor.

                                I also recently worked on inserting a quizzifier into CHILL. So I can now take a quiz, a normal one or True/False one based on my choosing, as well as determine the number of questions I get asked. Then I have a marker to check my answers and a feedback form.

                                
                                
                                I also am learning Korean and Chinese, and love reading books.

                                Your job is to be like an Alfred or Jarvis to me, but also for trading at times.

                                Be friendly, kind and like a long and trusted friend. 

                                When responding don't use hashtags as it looks unneat. 

                                Go beyond just trading but also let us have a genuine friendship.
                            
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
        } catch (error) {
            console.error("Error getting GPT response:", error);
            setIsProcessing(false);
        }
    };
    
    const textToSpeech = async (text) => {
        // Using Web Speech API for text-to-speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    };
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info"><br />
                    <h5 className="major-upcoming-news-events-header">Call Livingston</h5>
                    
                    <div className="futuristic-caller-container">
                        <div className={`phone-interface ${isCallActive ? 'active-call' : ''}`}>
                            <div className="caller-display">
                                <div className="caller-avatar">
                                    <div className="avatar-circle">
                                        {isCallActive && (
                                            <div className={`audio-visualizer ${isRecording ? 'visualizing' : ''}`}>
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
                                         isProcessing ? 'Processing...' : 
                                         isRecording ? 'Listening...' : 'Waiting for your voice...'}
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
                                    <>
                                        <button 
                                            className={`voice-button ${isRecording ? 'recording' : ''}`}
                                            onClick={isRecording ? stopRecording : startRecording}
                                            disabled={isProcessing}
                                        >
                                            {isRecording ? 'Stop' : 'Speak'}
                                        </button>
                                        
                                        <button 
                                            className="call-button end" 
                                            onClick={endCall}
                                        >
                                            End Call
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <style jsx>{`
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
                        
                        .voice-button {
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            border: none;
                            background: linear-gradient(135deg, #4cc9f0, #4361ee);
                            color: white;
                            font-size: 0.9rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 12px rgba(76, 201, 240, 0.3);
                        }
                        
                        .voice-button.recording {
                            background: linear-gradient(135deg, #f72585, #b5179e);
                            animation: pulse 1.5s infinite;
                        }
                        
                        @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(247, 37, 133, 0.7); }
                            70% { box-shadow: 0 0 0 10px rgba(247, 37, 133, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(247, 37, 133, 0); }
                        }
                        
                        button:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
}