import React, { useState, useRef, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link, useParams, useNavigate } from "react-router-dom";
import LiveClock from "./view_clock";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '@chatscope/chat-ui-kit-react';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react';
import {v4 as uuidv4} from 'uuid';
import Cookies from 'js-cookie';
import * as ChatScope from '@chatscope/chat-ui-kit-react';
import openai from 'openai';



export default function ChatBotInterface() {
    let imageReadResponse = "";
    const [selectedFile, setSelectedFile] = useState(null);
    const [newsData, setNewsData] = useState([]); // State to store news data
    const [USER_EMAIL, setUSER_EMAIL] = useState("");
    const {conversationID} = useParams();
    const [journals, setJournals] = useState([]);
    const userEmail = 'pythonappbrewery@gmail.com';
    const [tellUsMore, setTellUsMore] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [chatID, setChatID] = useState(1);
    const uniqueID = uuidv4();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to track whether the chatbot div is blurred
    const [isBlurred, setIsBlurred] = useState(false);
    
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const [trades, setTrades] = useState([]);

    const fetchEmailDataFromAPI = async () => {
        return Cookies.get('email');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };

    // Function to fetch the API key
    const fetchDataFromAPI = async () => {
        try {
        const response = await fetch(`${baseURL}/get_openai_key`); // Assuming your API endpoint is at '/get_openai_key'
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const { OPENAI_API_KEY } = await response.json();
        // Set the API key in state
        setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        async function fetchData() {
            // await fetchEmailDataFromAPI(); // Fetch user email first
            await fetchDataFromAPI(); // Then fetch other data
        }
        fetchData();
    }, []); 


    useEffect(() => {
        async function fetchNewsData() {
            try {
                const response = await fetch(`${baseURL}/fetch_news_data/`);
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


    // Inside your component
    const saveConversationToBackend = async (conversationData) => {
        try {
            const email = await fetchEmailDataFromAPI(); 
            const response = await fetch(`${baseURL}/save_conversation/${email}/${conversationID}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `conversation_data=${encodeURIComponent(JSON.stringify(conversationData))}`,
            });
                
        } catch (error) {
            console.error('Error saving conversation in saving backend func:', error);
        }
        
    };
    // Inside your component
    const fetchUserConversations = async () => {

        try {
            const email = await fetchEmailDataFromAPI(); 
            const response = await fetch(`${baseURL}/fetch_conversations/${email}/`);
            const data = await response.json();

            const userConversations = data.conversations;
            // const conversationArray = JSON.parse(data.conversations.conversation);

        // Sort conversations by ID in descending order
        // conversationArray.sort((a, b) => b.id - a.id);

        // Update the state with sorted conversations
        // setConversations(conversationArray);

            // console.log(userConversations); // Display user conversations in the console
            setConversations(userConversations);
        } catch (error) {
            console.error('Error fetching user conversations:', error);
        }
    };
    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      

    useEffect(() => {

        async function fetchUserData() {
            try {
                const email = await fetchEmailDataFromAPI(); 
                const response = await fetch(`${baseURL}/get_user_data/${email}/`);
                const data = await response.json();
                setTellUsMore(data);
            } catch (error) {
                console.error('Error fetching journals:', error);
            }
        }
        fetchUserData();
    }, []);


    useEffect(() => {
        
        async function fetchJournals() {
            try {
                const email = fetchEmailDataFromAPI(); 
                const response = await fetch(`${baseURL}/all_journals/${email}/`);
                const data = await response.json();
                setJournals(data.journals);
            } catch (error) {
                console.error('Error fetching journals:', error);
        }
    }
        fetchJournals();
    }, []);

    


    useEffect(() => {   
        const fetchTrades = async () => {
            try {
                const email = await fetchEmailDataFromAPI(); 
                const response = await fetch(`${baseURL}/all_trades/${email}/`);
                const parsedData = await response.json();
                setTrades(parsedData);
               
            } catch (error) {
                console.error('Error fetching trades:', error);
            
    };
}
    fetchTrades();
    }, []);

    const [messages, setMessages] = useState([
        {
            message: 'Hello! My name is Livingston!', 
            sender: 'ChatGPT',
            direction: 'incoming'
        }
    ]);

    // (6) [{…}, {…}, {…}, {…}, {…}, {…}]
// 0
// : 
// {role: 'user', content: 'Hey!'}
// 1
// : 
// {role: 'assistant', content: 'Hello! How can I assist you with your trading today?'}
// 2
// : 
// {role: 'user', content: 'Hows it going?'}
// 3
// : 
// {role: 'assistant', content: "It's going well, thank you for asking! How about y…hing particular you'd like assistance with today?"}
// 4
// : 
// {role: 'user', content: img}
// 5
// : 
// {role: 'user', content: '<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABA…AAAAAAf/Z" style="max-width: 100%; height: 70%;">'}
// length
// : 
// 6

    const [gptMessages, setGptMessages] = useState([
        {
            message: 'Hello! My name is Livingston!', 
            sender: 'ChatGPT',
            direction: 'incoming'
        }
    ]);


    const [typing, setTyping] = useState(false);

    async function processMessageLivingston(ChatMessages, typeInput) {
        let apiMessages = ChatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === 'ChatGPT') {
                 role="assistant";
            } else {
                role="user";
            }
            return { role: role,  content: messageObject.message }
        });

        // 
        setGptMessages(messages);
        // console.log(`gpt messages are: ${gptMessages}`);
        // console.log(gptMessages)
        
        const systemMessage = {
            role: "system",
            content: `
              Your name is Livingston. You are an intelligent investment assistant.
              Your job is to assist my users, of my startup, snowAI, to guide them through the intricacies of trading.
              User context: ${JSON.stringify(tellUsMore)}
              User Trades: ${JSON.stringify(trades)}
              News Data: ${JSON.stringify(newsData)}


              Sometimes in your chat history you might see parts of the conversation where it looks like you answered but you didnt.

              This is due to the user sending an image and me using the GPT-4 Vision API to get a response.

              If the user asks you for more information on the image, you can just say you are unable to do so in a 
              nice manner, and ask if there is anything else they would like you to assist them with.

              When you answer questions about news data, please try and give a general bias or overview of the asset asked about or the 
              assets contained in the data. Please keep the answer brief and to the point giving something like a general bias for
              an asset or assets. Something along the lines of, 'The current bias for asset is x, because of x, y, z.'
              The goal with this news data is to help users make informed trading/investing decisions based on fundamental 
              news data.
              WHEN THE USER ASKS YOU FOR SENTIMENT DATA, PLEASE PROVIDE THEM WITH A GENERAL BIAS
              OF THE ASSETS THAT YOU HAVE AND PLEASE DO NOT PROVIDE ALL THE NEWS DATA AS IT
              IS HARD AND TEDIOUS TO READ!!!!!!!!!!!!
              SAY SOMETHING LIKE, FOR ASSET IN QUESTION THE OVERALL SENTIMENT IS SENTIMENT, AND GIVE A VERY BRIEF EXPLANTION
              BASED ON THIS DATA!!! DO NOT PROVIDE THE WHOLE DATA, BUT ALWAYS A SUMMARY AND GENERAL BIAS PLEASE!!!!
              Please be friendly. If possible, respond in shorter sentences or few phrases.
              Be helpful and give clear and concise responses to user queries.
              Act as a sort of 'Jarvis' from IronMan.
              Most of the time make the conversation about trading.
              If a user asks you to give them trading history analytics, give them trading history analytics based on the User Trade data you have about them and please give it immediately without delay.
              Please provide them with data on your own performance metrics based on the User Trade Data You have about them.
              Please include metrics such as win rate, total profit, average return on investment, loss rate, best and worst strategy, best and worst timeframe based on performance. You can decide in which order you wish these to be shown.
              Do not show the trades they took when giving this information.
              Please respond immediately and not say you are pulling up the data. If you can't, you can just indicate there was an error.
              The goal of snowAI is to empower traders worldwide and to create a world of abundance.

              Here's some things snowAI related that you can provide as customer support.
              1: The founder is Tlotlo Motingwe and he is 20 years old and a programmer and AI developer.
              2: snowAI is a relatively new startup and it's mission is to empower traders with the knowledge
              and psychology they need to succeed.
            `
          };
          
        
        const filteredMessages = apiMessages.filter(message => typeof message.content === 'string');
        const apiRequestBody = {
            "model": "gpt-4-1106-preview",
            "messages": [
                systemMessage,
                ...filteredMessages
            ]        
        }

        // console.log(apiMessages);
        // Filter messages with content of type string

        // console.log(filteredMessages);
        // alert(`input type is: ${typeInput}`)
        if (typeInput == "text"){

            await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + OPENAI_API_KEY, 
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(apiRequestBody)
            }) .then((data) => {
                return data.json();
            }) .then ((data) => {
                setMessages([
                    ...ChatMessages, {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT",
                        direction:"incoming"
                    }
                ])
    
                setTyping(false);
            })
        }
    else if (typeInput == "image") {
            // await delay(5000);
            setMessages([
            ...ChatMessages, {
                message: imageReadResponse,
                sender: "ChatGPT",
                direction:"incoming"
            }
        ])

        setTyping(false);
    }
    }

    // Inside your component
    const handleClearConversation = () => {
        const newConversationID = uuidv4();
        if (messages.length > 2) {
            saveConversationToBackend(messages);
            fetchUserConversations();
            
        }
        setMessages([]); // Update the messages state to an empty array
        navigate(`/conversation/${newConversationID}`)
    };


    const newChat = () => {
        setMessages([]);
        document.querySelector('.chatbot-div').style.display = 'block';
        document.querySelector('.phone-conversations-div').style.display = 'none';
    };


    const displayChat = async (chatID) => {
        try {
            const response = await fetch(`${baseURL}/fetch_conversation/${chatID}/`);
            const data = await response.json();
            const conversationArray = JSON.parse(data.conversations.conversation);
            // Set the parsed conversation data to your messages state
            setMessages(conversationArray);
            document.querySelector('.chatbot-div').style.display = 'block';
            document.querySelector('.phone-conversations-div').style.display = 'none';
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };


    const deleteConversation = async (conversationID) => {
        try {
            const response = await fetch(`${baseURL}/delete_conversation/${conversationID}/`, {
                method: 'POST',
            });

            if (response.ok) {
                // Remove the deleted conversation from the conversations list
                setConversations((prevConversations) => prevConversations.filter(conv => conv.id !== conversationID));
                newChat();
            } else {
                console.error('Error deleting conversation:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };
    

    useEffect(() => {
        if (messages.length > 1) {
            saveConversationToBackend(messages);
            fetchUserConversations();
        }
        fetchUserConversations();
    }, [messages]);
    
    
    useEffect(() => {
        setChatID(chatID);
        displayChat(conversationID);
    }, [])


    const askLivingston = async (content) => {
        handleSend(content);
    }


    const toggleModal = () => {
        setIsModalOpen(prevState => !prevState);
    };


    const viewConversations = () =>  {
        document.querySelector('.chatbot-div').style.display = 'none';
        document.querySelector('.phone-conversations-div').style.display = 'block';
        // fetchUserConversations();
    }


      // Call the fetchUserConversations function to retrieve the conversations
      useEffect(() => {
        fetchUserConversations();
         // Call fetchUserConversations when the component mounts
    }, []);    


    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing",
        };
        
        const newMessages = [...messages, newMessage];
    
        // If an image was sent, it will be added as a message
        if (message instanceof HTMLImageElement) {
            const imageMessage = {
                message: message.outerHTML ? message.outerHTML : message.src, // Assuming message.src is a fallback
                sender: "user",
                direction: "outgoing",
                isImage: true,
            };
    
            // Add the image message to the array
            newMessages.push(imageMessage);
    
            // Update the state with the newMessages array
            setMessages(newMessages);
            setTyping(true);
            console.log(`Response is: : ${imageReadResponse}`);
            await sendImageToServer(message.src);
            console.log(`New Response is: ${imageReadResponse}`);

            // await delay(5000);
            await processMessageLivingston(newMessages, 'image');
        }

        else {
            // New Messages are set over here.
        setMessages(newMessages);
    
        setTyping(true);
        await processMessageLivingston(newMessages, 'text');
        }
    
        // Continue with processing the message
    };
    
    const handleAttachClick = () => {
        // Create a hidden input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Limit to image files if needed
        fileInput.style.display = 'none';

        // Attach an event listener to handle file selection
        fileInput.addEventListener('change', (event) => {
            const selectedFile = event.target.files[0];

            // Handle the selected file
            if (selectedFile) {
                // Read the contents of the selected file as a data URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageDataUrl = e.target.result;                
                    
                    // Display the image using the data URL
                    displayImage(imageDataUrl);
                    
                };
                reader.readAsDataURL(selectedFile);
            }
        });

        // Trigger a click event on the file input to open the file selection dialog
        fileInput.click();
    };


    const sendImageToServer = async (imageDataUrl) => {
        // Extract base64 data from the imageDataUrl
        const base64Data = imageDataUrl.split(',')[1];

        // Send a POST request to the Django server
       await fetch(`${baseURL}/process-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageBase64: base64Data }),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log(data);
                const serverResponse = data.result
                imageReadResponse = serverResponse;
                console.log(serverResponse);
            })
            .catch(error => {
                console.error('Error sending image to server:', error);
            });
        };

    
    const displayImage = (imageDataUrl) => {
        // Create an img element for the image
        const imgElement = document.createElement('img');
        imgElement.src = imageDataUrl;
        imgElement.style.maxWidth = '100%'; // Optional: Set max width for responsiveness
        imgElement.style.height = '70%';   // Optional: Set height to auto for responsiveness

        // Send the image data to the Django server

        // Call the main function with the image URL
        // main(imageUrl);
        
    
        // Append the img element to the message list as a message
        handleSend(imgElement);
        // main(imageDataUrl); 

    };
    

    return (
        <div>
             <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                    {/* <div className="chatbot-liveclock">
                        <LiveClock />
                    </div> */}
                    <br />
            </div>
            {/* <ChatScope.FileInput onChange={handleFileUpload} /> */}
            <div className="top-phone-chat-div">
                <i className="bi bi-brush clear-conversation-icon-phone" onClick={newChat}></i>
                <button type="button" className="btn btn-light" onClick={viewConversations}>View Conversations</button>
            </div>
             <div className="phone-conversations-div">
            <h6>Chat History</h6>
                <h6><Link to={`/conversation/${uniqueID}`} className="chat-links" onClick={newChat}>New Chat</Link></h6>
                {conversations
                    .sort((a, b) => a.id - b.id) // Sort conversations by ascending ID
                    .map((conversation, index) => (
                        <h6 key={conversation.id}>
                            <Link onClick={() => displayChat(conversation.id)} to={`/conversation/${conversation.id}`} className="chat-links">
                                Chat {index + 1}
                            </Link>
                            <i className="bi bi-trash3" onClick={() => deleteConversation(conversation.id)}></i>
                        </h6>
                    ))}
            </div>
            <div className="ai-div">
                <div className={`chatbot-div ${isBlurred ? 'blur-content' : ''}`}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList 
                                scrollBehavior="smooth"
                                typingIndicator={typing ? <TypingIndicator content="Livingston is typing..." />: null}
                            >            
                                {messages.map((message, index) => {
                                    return <Message key={index} model={message}
                                    direction='outgoing'
                                    />
                                })}< br /><br />
                                 {/* <div className="ask-livingston-buttons">
                                    <button type="button" className="btn btn-light" onClick={() => askLivingston("Pull up trading history analytics")}>Analyze my trades <i className="bi bi-send"></i></button>
                                    <button type="button" className="btn btn-light" onClick={() => askLivingston("Summarize and analyze my journals")}>Summarize and analyze my journals <i className="bi bi-send"></i></button>
                                    <button type="button" className="btn btn-light" onClick={() => askLivingston("Suggest Books")}>Suggest Books <i className="bi bi-send"></i></button>
                                    <button type="button" className="btn btn-light" onClick={() => askLivingston("Please give me advice based on the data you have about me")}>Give me advice <i className="bi bi-send"></i></button>
                                </div> */}
                            <div id="imageContainer"></div>
                            </MessageList>
                            <MessageInput placeholder="Type message here..." onSend={handleSend} onAttachClick={handleAttachClick} />

                        </ChatContainer>
                    </MainContainer>
                    {/* <i className="bi bi-brush clear-conversation-icon" onClick={handleClearConversation}></i> */}
                </div>
                
            <div className="conversations-div">
                <h6>Chat History</h6>
                <h6><Link to={`/conversation/${uniqueID}`} className="chat-links" onClick={newChat}>New Chat</Link></h6>
                {conversations
                    .sort((a, b) => a.id - b.id) // Sort conversations by ascending ID
                    .map((conversation, index) => (
                        <h6 key={conversation.id}>
                            <Link onClick={() => displayChat(conversation.id)} to={`/conversation/${conversation.id}`} className="chat-links">
                                Chat {index + 1}
                            </Link>
                            <i className="bi bi-trash3" onClick={() => deleteConversation(conversation.id)}></i>
                        </h6>
                    ))}
            </div>
            </div>
        </div>
    )
}







import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
// import movingAverageBot from "./moving-average-bot.mq4";
// import movingAverageBot from ""
// import Loader from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// import Loader from 'react-loader-spinner';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';


export default function Models() {

    const [downloadedFile, setDownloadedFile] = useState('');
    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    const downloadFile = async () => {
        try {
          // Fetch the file content (replace with your actual API call)
          const response = await fetch(`${baseURL}/download-mq4`);
          const fileContent = await response.text();
      
          // Create a Blob from the file content
          const blob = new Blob([fileContent], { type: 'text/plain' });
      
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
      
          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.download = 'bot.mq4'; // Set the desired filename
      
          // Append the link to the body
          document.body.appendChild(link);
      
          // Trigger the download
          link.click();
      
          // Clean up and remove the link
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };
      
      

    const candlestickModels = ["Engulfing", "Pin Bar", "Morning Star", "Matching", "Three White Soldiers", "Doji Star", "Methods"];
    const technicalModels = ["Moving Averages", "BBands", "Relative Strength Index (RSI)", "Momentum Trading Bot"];
    const mlModels = ["LSTM Neural Network", "News Sentiment Analysis"];
    const dlModels = ["Reinforcement Learning with Moving Averages", "Reinforcement Learning with Stochastics", "Reinforcement Learning with Momentum", "Reinforcement Learning with MACD", "Reinforcement Learning with RSI", "Reinforcement Learning with all indicators"];

    const [candlestickButtons, setCandlestickButtons] = useState(candlestickModels);
    const [technicalButtons, setTechnicalButtons] = useState(technicalModels);
    const [mlButtons, setMlButtons] = useState(mlModels);
    const [dlButtons, setDlButtons] = useState(dlModels);

    const [chosenModels, setChosenModels] = useState([]);

    // Candlestick Models
    const [engulfing, setEngulfing] = useState(false);
    const [pinbar, setPinBar] = useState(false);
    const [morningStar, setMorningStar] = useState(false);
    const [matching, setMatching] = useState(false);
    const [threeWhiteSoldiers, setThreeWhiteSoldiers] = useState(false);
    const [dojiStar, setDojiStar] = useState(false);
    const [methods, setMethods] = useState(false);

    // Technical Indicators
    const [movingAverages, setMovingAverages] = useState(false);
    const [bbands, setBbands] = useState(false);
    const [rsi, setRsi] = useState(false);
    const [momentum, setMomentum] = useState(false);

    // Machine Learning Models
    const [lstmNN, setLstmNN] = useState(false);
    const [newsSentiment, setNewsSentiment] = useState(false);

    // Deep Learning Models
    const [rlMa, setRlMa] = useState(false);
    const [rlStch, setRlStch] = useState(false);
    const [rlMom, setRlMom] = useState(false);
    const [rlMaCD, setRlMaCD] = useState(false);
    const [rlRsi, setRlRsi] = useState(false);
    const [rlAll, setRlAll] = useState(false);

    const [mainPage, setMainPage] = useState(true);

    const [ma1Type, setMa1Type] = useState("");
    const [ma2Type, setMa2Type] = useState("");

    const [ma1, setMa1] = useState(0);
    const [ma2, setMa2] = useState(0);

    const [bbandsLength, setbbLength] = useState(200);
    const [bbandsStd, setBbandStd] = useState(2);

    const [rsiPeriod, setRsiPeriod] = useState(14);
    const [rsiOverbought, setRsiOverbought] = useState(70);
    const [rsiOversold, setRsiOversold] = useState(30);

    const [modelPerformance, setModelPerformance] = useState()

    const [testedModel, setTestedModel] = useState('');

    const [selectedModel, setSelectedModel] = useState('');

    const [availableModels, setAvailableModels] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [modelProcess, setModelProcess] = useState('Submit Model Paramaters');

    const [candlestickProcess, setCandlestickProcess] = useState('Backtest Candlestick Models');

    const [momentumProcess, setMomentumProcess] = useState('Backtest Momentum Model');

    const [timeFrame, setTimeFrame] = useState('5Min');

    const [backtestPeriod, setBacktestPeriod] = useState('0-25');

    const [modelDone, setModelDone] = useState('');

    // Function to handle adding or removing a model from chosenModels and set the corresponding boolean value
    const handleModelSelection = (model) => {
        // Toggle the selection for the clicked model

        setSelectedModel(model);
        switch (model) {
            case "Engulfing":
                setEngulfing(!engulfing);
                break;
            case "Pin Bar":
                setPinBar(!pinbar);
                break;
            case "Morning Star":
                setMorningStar(!morningStar);
                break;
            case "Matching":
                setMatching(!matching);
                break;
            case "Three White Soldiers":
                setThreeWhiteSoldiers(!threeWhiteSoldiers);
                break;
            case "Doji Star":
                setDojiStar(!dojiStar);
                break;
            case "Methods":
                setMethods(!methods);
                break;
            case "Moving Averages":
                setMovingAverages(!movingAverages);
                break;
            case "BBands":
                setBbands(!bbands);
                break;
            case "Relative Strength Index (RSI)":
                setRsi(!rsi);
                break;
            case "Momentum Trading Bot":
                setMomentum(!momentum);
                break;
            case "LSTM Neural Network":
                setLstmNN(!lstmNN);
                break;
            case "News Sentiment Analysis":
                setNewsSentiment(!newsSentiment);
                break;
            case "Reinforcement Learning with Moving Averages":
                setRlMa(!rlMa);
                break;
            case "Reinforcement Learning with Stochastics":
                setRlStch(!rlStch);
                break;
            case "Reinforcement Learning with Momentum":
                setRlMom(!rlMom);
                break;
            case "Reinforcement Learning with MACD":
                setRlMaCD(!rlMaCD);
                break;
            case "Reinforcement Learning with RSI":
                setRlRsi(!rlRsi);
                break;
            case "Reinforcement Learning with all indicators":
                setRlAll(!rlAll);
                break;
            default:
                break;
        }

        if (chosenModels.includes(model)) {
            setChosenModels(chosenModels.filter((chosen) => chosen !== model));
        } else {
            setChosenModels([...chosenModels, model]);
        }

        // console.log('')
    }

    const removeChosenModel = (model) => {
        setChosenModels(chosenModels.filter((chosen) => chosen !== model));
        handleModelSelection(model);
    };



    const saveParams = () => {
        // console.log('Button has been clicked!');
        
        // Create a data object with the parameters
        const data = {
            ma1Type,
            ma2Type,
            ma1,
            ma2,
        };

        // console.log(data);

        setIsLoading(true);
        setModelProcess('Backtesting Moving Average Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/${ma1Type}/${ma2Type}/${ma1}/${ma2}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {

            setIsLoading(false); // Request completed
            // Handle the response from the server
            // console.log('Data from API is:')
            // console.log(data);
            setModelPerformance(data);
            setTestedModel("Moving Average");
            // console.log(modelPerformance);
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            setIsLoading(false); // Request completed (even if there's an error)
            console.error('Error:', error);
            setModelProcess('Error Occured');
            });
    }


    const saveBbandsParams = () => {
        // console.log('Button has been clicked!');
        // console.log("MA1Type:", ma1Type);
        // console.log("MA2Type", ma2Type)
        // console.log("MA1:", ma1);
        // console.log("MA2:", ma2);

        // console.log("BBands Length:", bbandsLength);
        // console.log("BBands Std Dev:", bbandsStd);
        
        // Create a data object with the parameters
        const data = {
            bbandsLength, 
            bbandsStd,
        };

        // console.log(data);

        setModelProcess('Backtesting BBands Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/bbands/${bbandsLength}/${bbandsStd}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            // console.log('Data from API is:')
            // console.log(data);
            setModelPerformance(data);
            setTestedModel('BBANDS');
            // console.log(modelPerformance)
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            setModelProcess('Error Occured')
            });
    }

    const saveRSIParams = () => {

        const data = {
            rsiPeriod, 
            rsiOverbought,
            rsiOversold,
        };

        setModelProcess('Backtesting RSI Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/rsi/${rsiPeriod}/${rsiOverbought}/${rsiOversold}/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            console.log('Data from API is:');
            // console.log(data);
            setModelPerformance(data);
            setTestedModel('RSI Model');
            // console.log(modelPerformance);
            setModelProcess('Submit Model Parameters');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }


    const saveMomentumParams = () => {

        // console.log('Momentum Button has been clicked!');
        setMomentumProcess('Backtesting Momentum Model');

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/momentum/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            // console.log('Data from API is: ')
            // console.log(data);
            setModelPerformance(data);
            setTestedModel('Momentum Model');
            console.log(modelPerformance)
            setMomentumProcess('Backtest Momentum Model');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }

    const saveCandlestickParams = () => {

        setCandlestickProcess('Backtesting Candlestick Model');

        const data = {
            engulfing: engulfing,
            pinbar: pinbar,
            morningStar: morningStar,
            threeWhiteSoldiers: threeWhiteSoldiers,
            dojiStar: dojiStar,
            methods: methods,
        };

        // Make an HTTP POST request
        fetch(`${baseURL}/create-bot/candlesticks/${timeFrame}/${backtestPeriod}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response from the server
            console.log('Data from API is:');
            console.log(data);
            setModelPerformance(data);
            setTestedModel('Candlestick Model');
            console.log(modelPerformance);
            setCandlestickProcess('Backtest Candlestick Model');
            setModelDone('Model Done Backtesting!');
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }
// 不客气!如果你有任何其他问题，随时告诉我，我会尽力帮助你。

    
    const MA1Type = (e) => {
        setMa1Type(e.target.value)
    };

    const MA2Type = (e) => {
        setMa2Type(e.target.value)
    };

    const changeMA1 = (e) => {
        setMa1(e.target.value);
    };

    const changeMA2 = (e) => {
        setMa2(e.target.value);
    };

    const changeTimeframe = (e) => {
        setTimeFrame(e.target.value);
    };

    const changeBacktestPeriod = (e) => {
        setBacktestPeriod(e.target.value);
    }

    const changeBBLen = (e) => {
        setbbLength(e.target.value);
    };

    const changeBBStd = (e) => {
        setBbandStd(e.target.value);
    };


    const changeRsiPeriod = (e) => {
        setRsiPeriod(e.target.value);
    };


    const changeRsiOverbought = (e) => {
        setRsiOverbought(e.target.value);
    };


    const changeRsiOversold = (e) => {
        setRsiOversold(e.target.value)
    };


    const nextModel = () => {
        console.log('Next Button has been clicked!');
        setAvailableModels(!availableModels);
        console.log(`Selected Models are: ${availableModels}`);
        setModelPerformance("");
    };
    

    useEffect(() => {
        if (modelPerformance) {
            console.log('Model Perfomance: ');
            console.log(modelPerformance);
        };
        console.log(`Selected Model is ${selectedModel}`);
    })


    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
            </div>
            <div className="main-body-info">
                {availableModels && (
                    <div>
                        <h5>Create New Models</h5>
                        <div className="upper-models-div">
                            <div className="candlestick-models">
                                <h6>Candlestick Patterns</h6>
                                {candlestickButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                            <div className="technical-models">
                                <h6>Technical Indicators</h6>
                                {technicalButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="middle-models-div">
                            <div className="ml-models">
                                <h6>Machine Learning Models</h6>
                                {mlButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                            <div className="dl-models">
                                <h6>Deep Learning Models</h6>
                                {dlButtons.map((button, index) => (
                                    <button
                                        className={`btn btn-light ${chosenModels.includes(button) ? 'selected' : ''}`}
                                        key={index}
                                        onClick={() => handleModelSelection(button)}
                                    >
                                        {button}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="chosen-models">
                            <h6>Chosen Models</h6>
                            {chosenModels.map((chosen, index) => (
                                <button className="btn btn-light" key={index} onClick={() => removeChosenModel(chosen)}>
                                    {chosen} <i className="bi bi-x"></i>
                                </button>
                            ))}
                        </div><br />
                            <button className="btn btn-light create-models-next" onClick={nextModel}>Next</button>
                            <br /><br />
                            {/* <Loader type="Puff" color="#00BFFF" height={100} width={100} /> */}
                    </div>
                )}

                    {!availableModels && (
                        <div>
                            <button className="btn btn-light" onClick={nextModel}><i className="bi bi-arrow-left-circle"></i> Go Back</button>

                            {/* Moving Average Model */}
                            <div>
                                <h5 className="backtest-header">Backtest: ({selectedModel})</h5>
                            {movingAverages && (
                                    <div>
                                        
                            <div className="set-moving-average-model">
                                <h6>Moving Average Bot</h6>
                                <h6>Select Parameters to Use</h6><br />
        
                                <p>Select Moving Average Type</p>
                                <select class="form-select" aria-label="Default select example" onChange={MA1Type}>
                                <option selected>Select Type</option>
                                <option value="SMA">Simple Moving Average (SMA)</option>
                                <option value="EMA">Exponential Moving Average (EMA)</option>
                                </select><br />
        
                                <p>Enter Number</p>
                                <input className="form-control" type="number" value={ma1} onChange={changeMA1}></input><br />
        
                                <p>Select Moving Average Type</p>
                                <select class="form-select" aria-label="Default select example" onChange={MA2Type}>
                                <option selected>Select Type</option>
                                <option value="SMA">Simple Moving Average (SMA)</option>
                                <option value="EMA">Exponential Moving Average (EMA)</option>
                                </select><br />
                                
                                <p>Enter Number</p>
                                <input className="form-control" type="number" value={ma2} onChange={changeMA2}></input><br />
                                {/* <i className="bi bi-arrow-clockwise loading-icon"></i> */}

                                <p>Select Timeframe</p>
                                <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                    <option value="5Min">5Min</option>
                                    <option value="15Min">15Min</option>
                                    <option value="1H">1H</option>
                                    <option value="4H">4H</option>
                                    <option value="1D">1D</option>
                                </select><br />

                                <p>Select Period for Backtesting</p>
                                <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                    <option value="0-25">0% - 25%</option>
                                    <option value="25-50">25% - 50%</option>
                                    <option value="50-75">50% - 75%</option>
                                    <option value="75-100">75% - 100%</option>
                                </select><br />

                                <button className="btn btn-primary" onClick={saveParams}> {modelProcess}</button>

                            </div>
                            <br />
                                    </div>
                            )}
                            </div>

                             {/* BBands Model */}
                        <div>
                            {bbands && (
                                <div>
                                    <div className="set-bbands-model">
                                        <h6>Bollinger Bands Bot</h6>
                                        <h6>Select Parameters to Use</h6><br />
                                        <p>Enter Length</p>
                                        <input className="form-control" type="number" value={bbandsLength} onChange={changeBBLen}></input>
                                        <br />
                                        <p>Enter Standard Deviation Multiplier</p>
                                        <input className="form-control" type="number" value={bbandsStd} onChange={changeBBStd}></input><br />
                                        
                                        <p>Select Timeframe</p>
                                        <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                            <option value="5Min">5Min</option>
                                            <option value="15Min">15Min</option>
                                            <option value="1H">1H</option>
                                            <option value="4H">4H</option>
                                            <option value="1D">1D</option>
                                        </select><br />

                                        <p>Select Period for Backtesting</p>
                                        <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                            <option value="0-25">0% - 25%</option>
                                            <option value="25-50">25% - 50%</option>
                                            <option value="50-75">50% - 75%</option>
                                            <option value="75-100">75% - 100%</option>
                                        </select><br />

                                        <button className="btn btn-primary" onClick={saveBbandsParams}><i className="bi bi-arrow-clockwise"></i> {modelProcess}</button>
                                    </div><br /> 
                                </div>
                            )}
                        </div>

                            {/* RSI Model */}
                            {rsi && (
                                <div> 
                                    <div className="set-rsi-model">
                                        <h6>Relative Strength Index Bot</h6>
                                        <h6>Select Parameters to Use</h6><br />
        
                                        <p>Enter RSI Period</p>
                                        <input className="form-control" type="number" value={rsiPeriod} onChange={changeRsiPeriod}></input>
                                        <br />
        
                                        <p>Enter Overbought Level</p>
                                        <input className="form-control" type="number" value={rsiOverbought} onChange={changeRsiOverbought}></input><br />
        
                                        <p>Enter Oversold Level</p>
                                        <input className="form-control" type="number" value={rsiOversold} onChange={changeRsiOversold}></input><br />

                                        <p>Select Timeframe</p>
                                        <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                            <option value="5Min">5Min</option>
                                            <option value="15Min">15Min</option>
                                            <option value="1H">1H</option>
                                            <option value="4H">4H</option>
                                            <option value="1D">1D</option>
                                        </select><br />

                                        <p>Select Period for Backtesting</p>
                                        <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                            <option value="0-25">0% - 25%</option>
                                            <option value="25-50">25% - 50%</option>
                                            <option value="50-75">50% - 75%</option>
                                            <option value="75-100">75% - 100%</option>
                                        </select><br />

                                        
                                        <button className="btn btn-primary" onClick={saveRSIParams}><i className="bi bi-arrow-clockwise"></i> {modelProcess}</button>
                                    </div><br />
                                </div>
                            )}

                            {momentum && (

                                <div className="momentum-bot-div">
                                    <p>Select Timeframe</p>
                                <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                    <option value="5Min">5Min</option>
                                    <option value="15Min">15Min</option>
                                    <option value="1H">1H</option>
                                    <option value="4H">4H</option>
                                    <option value="1D">1D</option>
                                </select><br />

                                <p>Select Period for Backtesting</p>
                                <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                    <option value="0-25">0% - 25%</option>
                                    <option value="25-50">25% - 50%</option>
                                    <option value="50-75">50% - 75%</option>
                                    <option value="75-100">75% - 100%</option>
                                </select><br />

                                    <button className="btn btn-primary momentum-button" onClick={saveMomentumParams}> {momentumProcess}</button>
                                </div>
                            )}

                            {(engulfing || pinbar || morningStar || threeWhiteSoldiers || dojiStar || methods) && (
                                <div>
                                    <p>Select Timeframe</p>
                                    <select class="form-select" aria-label="Default select example" onChange={changeTimeframe}>
                                        <option value="5Min">5Min</option>
                                        <option value="15Min">15Min</option>
                                        <option value="1H">1H</option>
                                        <option value="4H">4H</option>
                                        <option value="1D">1D</option>
                                    </select><br />

                                    <p>Select Period for Backtesting</p>
                                    <select class="form-select" aria-label="Default select example" onChange={changeBacktestPeriod}>
                                        <option value="0-25">0% - 25%</option>
                                        <option value="25-50">25% - 50%</option>
                                        <option value="50-75">50% - 75%</option>
                                        <option value="75-100">75% - 100%</option>
                                    </select><br />

                                    <button className="btn btn-primary candlestick-button" onClick={saveCandlestickParams}> {candlestickProcess}</button>
                                </div>
                            )}

                                <br />    

                                {/* Conditional rendering of modelPerformance */}
                                {modelPerformance && (
                                    
                                <div className="model-performance">
                                    <p className="success-message">{modelDone}</p>
                                    {/* <p><a className='link' href="./moving-average-bot.mq4" download target="_blank" rel="noreferrer">Download Model</a></p> */}
                                    <button onClick={downloadFile} className="btn btn-sucess download-bot-file">Download Model</button>
                                    <p><h5>Model Performance: {testedModel}</h5></p>
                                    <p># Trades: {modelPerformance.Output['# Trades']}</p>
                                    <p>Start: {modelPerformance.Output.Start}</p>
                                    <p>End: {modelPerformance.Output.End}</p>
                                    <p>Duration: {modelPerformance.Output.Duration}</p>
                                    <p>Return [%]: {modelPerformance.Output['Return [%]']}</p>
                                    <p>Return (Ann.) [%]: {modelPerformance.Output['Return (Ann.) [%]']}</p>
                                    <p>Win Rate [%]: {modelPerformance.Output['Win Rate [%]']}</p>
                                    <p>Best Trade [%]: {modelPerformance.Output['Best Trade [%]']}</p>
                                    <p>Worst Trade [%]: {modelPerformance.Output['Worst Trade [%]']}</p>
                                    <p>Equity Final [$]: {modelPerformance.Output['Equity Final [$]']}</p>
                                    <p>Equity Peak [$]: {modelPerformance.Output['Equity Peak [$]']}</p>
                                    <p>Max. Drawdown Duration: {modelPerformance.Output['Max. Drawdown Duration']}</p>
                                    <p>Avg. Drawdown Duration: {modelPerformance.Output['Avg. Drawdown Duration']}</p>
                                    <p>Avg. Drawdown [%]: {modelPerformance.Output['Avg. Drawdown [%]']}</p>
                                    <p>Avg. Trade Duration: {modelPerformance.Output['Avg. Trade Duration']}</p>
                                    <p>Avg. Trade [%]: {modelPerformance.Output['Avg. Trade [%]']}</p>
                                    <p>Buy & Hold Return [%]: {modelPerformance.Output['Buy & Hold Return [%]']}</p>
                                    <p>Calmar Ratio: {modelPerformance.Output['Calmar Ratio']}</p>
                                    <p>Expectancy [%]: {modelPerformance.Output['Expectancy [%]']}</p>
                                    <p>Exposure Time [%]: {modelPerformance.Output['Exposure Time [%]']}</p>
                                    <p>Max. Drawdown [%]: {modelPerformance.Output['Max. Drawdown [%]']}</p>
                                    <p>Max. Trade Duration: {modelPerformance.Output['Max. Trade Duration']}</p>
                                    <p>Profit Factor: {modelPerformance.Output['Profit Factor']}</p>
                                    <p>SQN: {modelPerformance.Output.SQN}</p>
                                    <p>Sharpe Ratio: {modelPerformance.Output['Sharpe Ratio']}</p>
                                    <p>Sortino Ratio: {modelPerformance.Output['Sortino Ratio']}</p>
                                    <p>Volatility (Ann.) [%]: {modelPerformance.Output['Volatility (Ann.) [%]']}</p>
                                </div>
                                
                                )}
                        </div>
                    )}
                        {/* <button className="btn btn-primary" onClick={saveParams}>Sumbit</button> */}        
            </div>
        </div>
    );
}



















import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";

export default function MarketMakers() {

  const baseUrl = "https://backend-production-c0ab.up.railway.app";
  const [apiResponse, setApiResponse] = useState('')

  const [chartData, setChartData] = useState({
    labels: ['Australian Central Bank', 'British Central Bank', 'New Zealand Central Bank', 'Swiss Central Bank'],
    datasets: [
      {
        label: "Global Interest Rates",
        data: [4.35, 5.25, 5.5, 1.75],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${baseUrl}/interest-rates-data`);
//         const data = await response.json();

//         console.log('Returned Data');
//         setApiResponse(data)

//         // Extracting data for the chart
//         const centralBankRates = data['Interest Rates'].central_bank_rates;
//         console.log('Central Bank Rates');
//         console.log(centralBankRates);
//         const labels = centralBankRates.map((rate) => rate.central_bank);
//         console.log('Labels');
//         console.log(labels);
//         const interestRates = centralBankRates.map((rate) => rate.rate_pct);
//         console.log('Interest Rates');
//         console.log(interestRates);

//         setChartData({
//           labels: labels,
//           datasets: [
//             {
//               label: "Global Interest Rates",
//               data: interestRates,
//               backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 0.2)"],
//               borderColor: ["rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)", "rgba(75, 192, 192, 1)"],
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="global-interest-rates-header">
            <Link to="https://www.global-rates.com/en/interest-rates/central-banks/" target="_blank">
              <h5>Global Interest Rates</h5>
            </Link>
          </div>
          <div className="interest-rates-bar-chart-container">
            <Bar data={chartData} />
          </div>

          <h6>Calculate I</h6>
        </div>
      </div>
    </div>
  );
}
