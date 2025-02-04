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

    const [accountData, setAccountData] = useState(null);
    const [error, setError] = useState(null);

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


    // useEffect(() => {
    //     const fetchTrades = async () => {
    //         try {
    //             // Fetching data from the new API endpoint
    //             const response = await fetch(`${baseURL}/fetch-trading-data`);
    //             const parsedData = await response.json();
    //             setTrades(parsedData);
    //             console.log('Trade Data is', parsedData);
    //         } catch (error) {
    //             console.error('Error fetching trades:', error);
    //         }
    //     };
    
    //     fetchTrades();
    // }, []);

    

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
            const response = await fetch(`${baseURL}/fetch-account-data/?account_name=${accountName}`);
            
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

        //  My context: ${JSON.stringify(tellUsMore)}
        // My Trades: ${JSON.stringify(trades)}
        
        const systemMessage = {
            role: "system",
            content: `
            Your name is Livingston. You are an intelligent investment assistant.
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

              Give me answers in a clear and readable format please!

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
            "model": "gpt-4o-mini",
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
