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
                const email = await fetchEmailDataFromAPI();
                const response = await fetch(`${baseURL}/fetch_news_data/${email}`);
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
              Your job is to assist me as I trade.
              My context: ${JSON.stringify(tellUsMore)}
              My Trades: ${JSON.stringify(trades)}
              News Data: ${JSON.stringify(newsData)}

              My name is Tlotlo Motingwe. I am 21 years old. I have built a this trading system that uses your api. 
              I have integrated the ability the view different news articles on the platform and send them to you 
              so you can give me a general bias. Please respond with whether the sentiment is bullish or bearish
              and in a short manner. I have also built into the platform trading analytics to view how I have been performing over
              time, as well as a Market Maker Section to check different interest rates from central banks. Furthemore,
              I have intergated into the platform the ability for myself to create and backtest trading bots using a drag and drop(dnd) interface using
              Google Blockly and can send the code in the form of a string back to my backend hosted on Django to run the code to backtest 
              using Backtesting.py. Furthemore, I have made it such that if I am satisfied with the performance, I can save this code into a Model in Django
              and run it in my mt5 terminal. 

              I also am learning Korean and Chinese, and love reading books.

              Your job is to be like an Alfred or Jarvis to me, but also for trading at times.

              Be friendly, kind and like a long and trusted friend. 

              When responding don't use hashtags as it looks unneat. 

              Go beyond just trading but also let us have a genuine friendship.

            `
          };

        //     Sometimes in your chat history you might see parts of the conversation where it looks like you answered but you didnt.

        // This is due to the user sending an image and me using the GPT-4 Vision API to get a response.

        // If the user asks you for more information on the image, you can just say you are unable to do so in a 
        // nice manner, and ask if there is anything else they would like you to assist them with.

        // When you answer questions about news data, please try and give a general bias or overview of the asset asked about or the 
        // assets contained in the data. Please keep the answer brief and to the point giving something like a general bias for
        // an asset or assets. Something along the lines of, 'The current bias for asset is x, because of x, y, z.'
        // The goal with this news data is to help users make informed trading/investing decisions based on fundamental 
        // news data.
        // WHEN THE USER ASKS YOU FOR SENTIMENT DATA, PLEASE PROVIDE THEM WITH A GENERAL BIAS
        // OF THE ASSETS THAT YOU HAVE AND PLEASE DO NOT PROVIDE ALL THE NEWS DATA AS IT
        // IS HARD AND TEDIOUS TO READ!!!!!!!!!!!!
        // SAY SOMETHING LIKE, FOR ASSET IN QUESTION THE OVERALL SENTIMENT IS SENTIMENT, AND GIVE A VERY BRIEF EXPLANTION
        // BASED ON THIS DATA!!! DO NOT PROVIDE THE WHOLE DATA, BUT ALWAYS A SUMMARY AND GENERAL BIAS PLEASE!!!!
        // Please be friendly. If possible, respond in shorter sentences or few phrases.
        // Be helpful and give clear and concise responses to user queries.
        // Act as a sort of 'Jarvis' from IronMan.
        // Most of the time make the conversation about trading.
        // If a user asks you to give them trading history analytics, give them trading history analytics based on the User Trade data you have about them and please give it immediately without delay.
        // Please provide them with data on your own performance metrics based on the User Trade Data You have about them.
        // Please include metrics such as win rate, total profit, average return on investment, loss rate, best and worst strategy, best and worst timeframe based on performance. You can decide in which order you wish these to be shown.
        // Do not show the trades they took when giving this information.
        // Please respond immediately and not say you are pulling up the data. If you can't, you can just indicate there was an error.
        // The goal of snowAI is to empower traders worldwide and to create a world of abundance.

        // Here's some things snowAI related that you can provide as customer support.
        // 1: The founder is Tlotlo Motingwe and he is 20 years old and a programmer and AI developer.
        // 2: snowAI is a relatively new startup and it's mission is to empower traders with the knowledge
        // and psychology they need to succeed.
          
        
        const filteredMessages = apiMessages.filter(message => typeof message.content === 'string');
        const apiRequestBody = {
            "model": "ft:gpt-4o-mini-2024-07-18:personal:tradergptv2:AYFhBnww",
            "messages": [
                systemMessage,
                ...filteredMessages
            ]        
        }

        // Filter messages with content of type string

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
            // console.log(imageReadResponse);
            setMessages([
            ...ChatMessages, {
                message: imageReadResponse,
                sender: "ChatGPT",
                direction:"incoming"
            }
        ]);
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
        
        // Filter out messages that are not of type string
        const filteredMessages = newMessages.filter((msg) => typeof msg.message === 'string');
        
    
        // If an image was sent, it will be added as a message
        if (message instanceof HTMLImageElement) {
            const imageMessage = {
                message: message.outerHTML ? message.outerHTML : message.src, // Assuming message.src is a fallback
                sender: "user",
                direction: "outgoing",
                isImage: true,
            };
            
            // console.log(imageMessage);
            // Add the image message to the array
            filteredMessages.push(imageMessage);
    
            // Update the state with the newMessages array
            setMessages(filteredMessages);
            setTyping(true);
            // console.log(`Response is: : ${imageReadResponse}`);
            await sendImageToServer(message.src);
            // console.log(`New Response is: ${imageReadResponse}`);

            // await delay(5000);
            await processMessageLivingston(filteredMessages, 'image');
        }

        else {
            // New Messages are set over here.
        setMessages(filteredMessages);
    
        setTyping(true);
        await processMessageLivingston(filteredMessages, 'text');
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
                // console.log(data);
                const serverResponse = data.result;
                imageReadResponse = serverResponse;
                // console.log(serverResponse);
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
        imgElement.style.height = '50%';   // Optional: Set height to auto for responsiveness

        // Send the image data to the Django server
        
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
                <Link to={`/conversation/${uniqueID}`} onClick={newChat}><i className="bi bi-brush clear-conversation-icon-phone"></i></Link>
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
