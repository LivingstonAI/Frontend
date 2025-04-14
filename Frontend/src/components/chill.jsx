import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, ChevronLeft, Edit2, Trash2, Volume2, VolumeX, PlusCircle, Folder, Image, MessageSquare, Save, X, List, Grid, RefreshCw } from "react-feather";

// Custom Brain Icon Component
const BrainIcon = ({ size = 24, color = "currentColor", className = "", ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`feather feather-brain ${className}`}
      {...props}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 0 19.5v-15A2.5 2.5 0 0 1 2.5 2h7z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5h7A2.5 2.5 0 0 0 24 19.5v-15A2.5 2.5 0 0 0 21.5 2h-7z"></path>
      <path d="M12 2v20"></path>
      <path d="M7 7h.01"></path>
      <path d="M17 7h.01"></path>
      <path d="M7 12h.01"></path>
      <path d="M17 12h.01"></path>
      <path d="M7 17h.01"></path>
      <path d="M17 17h.01"></path>
    </svg>
  );
};

export default function Chill() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState("");
    const [newSection, setNewSection] = useState("");
    const [newText, setNewText] = useState("");
    const [showNewEntryForm, setShowNewEntryForm] = useState(false);
    const [showAddEntryButton, setShowAddEntryButton] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [imageFolders, setImageFolders] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);
    const [folderState, setFolderState] = useState(false);
    const [imageViewState, setImageViewState] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [userInput, setUserInput] = useState('');
    const [imageProcess, setImageProcess] = useState('View Trading Images');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        const fetchSections = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/fetch-chill-sections`);
                const data = await response.json();
                if (response.ok) {
                    setSections(data.sections);
                    setShowAddEntryButton(true);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    // Function to fetch the API key
    const fetchDataFromAPI = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    useEffect(() => {
        fetchDataFromAPI();
    }, []);

    const fetchSectionData = async (section) => {
        try {
            setImageViewState(false);
            setLoading(true);
            setShowNewEntryForm(false);
            const response = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(section.section)}`);
            const data = await response.json();
            if (response.ok) {
                setSelectedSection(data);
                setEditedText(data.text);
                setIsSpeaking(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching section data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setChatOpen(false);
        setSelectedSection(null);
        setMessages([]);
        setEditing(false);
        setImageViewState(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/edit-chill-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: selectedSection.section,
                    text: editedText,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSelectedSection({ ...selectedSection, text: editedText });
                setEditing(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error saving edited data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (section) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/delete-chill-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ section }),
            });
            const data = await response.json();
            if (response.ok) {
                setSections(sections.filter((s) => s.section !== section));
                setSelectedSection(null);
                setEditing(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewEntry = async () => {
        if (!newSection.trim()) {
            alert("Please enter a section name");
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/create-chill-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: newSection,
                    text: newText,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSections([...sections, { section: newSection }]);
                setNewSection("");
                setNewText("");
                setShowNewEntryForm(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error creating new entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderFormattedText = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            line = line.trim();
            if (!line) return null;

            if (line.startsWith('## ')) {
                return <h5 key={index} className="subheading">{line.replace('##', '').trim()}</h5>;
            } else if (line.startsWith('### ')) {
                return <p key={index} className="subpoint">{line.replace('###', '').trim()}</p>;
            } else if (line.startsWith('-> ')) {
                return <p key={index} className="note">{line.replace('->', '').trim()}</p>;
            } else {
                return <p key={index} className="content-text">{line}</p>;
            }
        });
    };

    const speechQueue = [];
    let speaking = false;
    
    const readTextAloud = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/#{1,3}/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            speechQueue.push(cleanText);
            processQueue();
            utterance.onend = () => {
                setIsSpeaking(false);
            };
            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Text-to-speech is not supported in this browser.");
        }
    };

    const processQueue = () => {
        if (speaking || speechQueue.length === 0) {
            return;
        }
    
        const text = speechQueue.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.volume = 1;
        utterance.pitch = 1;
        utterance.rate = 1;
    
        utterance.onstart = () => {
            speaking = true;
        };
        
        utterance.onend = () => {
            speaking = false;
            processQueue();
        };
        
        utterance.onerror = (event) => console.error("Speech error:", event.error);
    
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            utterance.voice = voices[0];
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    utterance.voice = voices[0];
                    window.speechSynthesis.speak(utterance);
                } else {
                    console.error("No voices available after voices changed.");
                }
            };
            return;
        }
    
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Error speaking the utterance:", error);
        }
    };
    
    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            speaking = false;
        } else {
            console.error("Text-to-speech is not supported in this browser.");
        }
    };   

    const fetchImages = async () => {
        setImageProcess('Fetching Images...');
        try {
            const response = await fetch(`${baseUrl}/fetch-trading-images`);
            const data = await response.json();
            if (response.ok) {
                setImageFolders(prevState => {
                    if (JSON.stringify(prevState) !== JSON.stringify(data.folders)) {
                        return data.folders;
                    }
                    return prevState;
                });
                setImageProcess('View Trading Images');
            } else {
                console.error(data.error);
                alert('Error fetching images.');
                setImageProcess('View Trading Images');
            }
        } catch (error) {
            console.error("Error fetching images:", error);            
            alert('Error fetching images.');
            setImageProcess('View Trading Images');
        }
    };

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        setFolderState(true);
    };   
    
    const closeFolder = () => {
        setFolderState(false);
    };

    const handleImageClick = (imageData) => {
        setExpandedImage(imageData);
    };

    const handleCloseExpandedImage = () => {
        setExpandedImage(null);
    };

    const cleanText = (text) => {
        return text.replace(/#{1,3}/g, '');
    };

    const quizMe = async () => {
        try {
            const cleanedText = cleanText(editedText);
            await navigator.clipboard.writeText(cleanedText);
            navigate('/quizifier');
        } catch (error) {
            console.error("Failed to copy text or open the link:", error);
        }
    };

    const handleHelperClick = () => {
        setChatOpen(true);
    };

    const handleSendMessage = async (userInput) => {
        if (!userInput.trim()) return;
        
        setUserInput('');
        // Add user message to chat
        setMessages((prev) => [...prev, { role: "user", content: userInput }]);
        
        try {
            const response = await askAIHelper(selectedSection, userInput);
            setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            setMessages((prev) => [...prev, { 
                role: "assistant", 
                content: "Sorry, I encountered an error processing your request. Please try again." 
            }]);
        }
    };

    const askAIHelper = async (sectionData, userInput) => {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + OPENAI_API_KEY,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: `Hello! My name is Tlotlo Motingwe and I am 21 years old. I am the creator of this snowAI system, a private trading system to make my trading efficient. 
                        I am learning Korean and Chinese. I practice Shotokan and Taekwondo. I am a guitar player. 
                        I also am a kpop dancer. The system is very complex, but your job here is to answer my questions based on the data I provide you. I also aim to manage a hedge fund in the future :). Let's make magic together!
                        You are an AI expert called Livingston and answer questions for the following section: ${editedText}. This is a trading platform.` 
                    },
                    { role: "user", content: userInput },
                ],
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    };

    // Filter sections based on search query
    const filteredSections = sections.filter(section => 
        section.section.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chill-container">
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="chill-interface">
                        <div className="chill-header">
                            <h5 className="chill-title">
                                <BookOpen className="icon" />
                                C.H.I.L.L Interface
                                <span className="version-tag">v2.0</span>
                            </h5>
                            <div className="chill-subtitle">Comprehensive Hybrid Interface for Learning & Logging</div>
                        </div>

                        {chatOpen && (
                            <div className="chat-window">
                                <div className="chat-header">
                                    <h4><MessageSquare size={18} /> Livingston AI Assistant</h4>
                                    <button onClick={() => setChatOpen(false)} className="close-btn">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="messages-container">
                                    {messages.length === 0 ? (
                                        <div className="empty-chat">
                                            <BrainIcon size={40} />
                                            <p>Ask Livingston about this section. The AI will analyze the content and provide insights.</p>
                                        </div>
                                    ) : (
                                        <div className="messages">
                                            {messages.map((msg, idx) => (
                                                <div key={idx} className={`message ${msg.role}`}>
                                                    <div className="message-content">{msg.content}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="chat-input-container">
                                    <input
                                        type="text"
                                        placeholder="Ask me something..."
                                        className="chat-input"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendMessage(userInput);
                                        }}
                                    />
                                    <button 
                                        onClick={() => handleSendMessage(userInput)} 
                                        className="send-btn"
                                        disabled={!userInput.trim()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        {imageViewState && (
                            <div className="dashboard-section">
                                <div className="section-controls">
                                    <button onClick={fetchImages} className="control-btn image-btn">
                                        <RefreshCw size={16} className={imageProcess === 'Fetching Images...' ? 'spinning' : ''} />
                                        {imageProcess}
                                    </button>
                                    
                                    <div className="view-controls">
                                        <button 
                                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid size={16} />
                                        </button>
                                        <button 
                                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List size={16} />
                                        </button>
                                    </div>
                                </div>

                                {!selectedSection && (
                                    <div className="search-container">
                                        <input
                                            type="text"
                                            placeholder="Search sections..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                )}

                                {imageFolders && (
                                    <div className="image-folders">
                                        <h6 className="section-subheading">
                                            <Folder size={16} /> Image Folders
                                        </h6>
                                        <div className="folder-grid">
                                            {Object.keys(imageFolders).map((folder, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleFolderClick(folder)}
                                                    className="folder-btn"
                                                >
                                                    <Folder size={16} />
                                                    <span>{folder}</span>
                                                    <span className="file-count">{imageFolders[folder].length}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedFolder && folderState && (
                            <div className="folder-view">
                                <div className="folder-header">
                                    <h6><Folder size={16} /> {selectedFolder}</h6>
                                    <button onClick={closeFolder} className="close-folder-btn">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="images-grid">
                                    {imageFolders[selectedFolder].map((imageData, index) => (
                                        <div
                                            key={index}
                                            className="image-card"
                                            onClick={() => handleImageClick(imageData)}
                                        >
                                            <img
                                                src={imageData.data}
                                                alt={imageData.filename || "Trading Image"}
                                                className="image-thumbnail"
                                            />
                                            <div className="image-name">{imageData.filename || `Image ${index + 1}`}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {expandedImage && (
                            <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
                                <div className="expanded-image-container" onClick={e => e.stopPropagation()}>
                                    <button className="close-expanded-btn" onClick={handleCloseExpandedImage}>
                                        <X size={20} />
                                    </button>
                                    <img
                                        src={expandedImage.data}
                                        alt="Expanded Trading Image"
                                        className="expanded-image"
                                    />
                                    <div className="image-filename">{expandedImage.filename || "Trading Image"}</div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="loading-container">
                                <div className="pulse-loader"></div>
                                <p>Loading C.H.I.L.L data...</p>
                            </div>
                        ) : selectedSection ? (
                            <div className="section-view">
                                <div className="section-header">
                                    <h4 className="section-title">
                                        <Bookmark size={18} className="icon" />
                                        {selectedSection.section}
                                    </h4>
                                    <div className="section-actions">
                                        {!editing && (
                                            <button 
                                                onClick={handleHelperClick} 
                                                className="action-btn assistant-btn"
                                                title="AI Assistant"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                        )}
                                        {!editing && !isSpeaking && (
                                            <button 
                                                onClick={() => readTextAloud(selectedSection.text)} 
                                                className="action-btn"
                                                title="Read Aloud"
                                            >
                                                <Volume2 size={16} />
                                            </button>
                                        )}
                                        {isSpeaking && (
                                            <button 
                                                onClick={stopSpeech} 
                                                className="action-btn stop-btn"
                                                title="Stop Reading"
                                            >
                                                <VolumeX size={16} />
                                            </button>
                                        )}
                                        {!editing && (
                                            <button 
                                                onClick={() => setEditing(true)} 
                                                className="action-btn"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        {editing && (
                                            <button 
                                                onClick={handleSave} 
                                                className="action-btn save-btn"
                                                title="Save"
                                            >
                                                <Save size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="section-content">
                                    {editing ? (
                                        <textarea
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            className="content-editor"
                                            placeholder="Enter section content..."
                                        />
                                    ) : (
                                        <div className="formatted-content">{renderFormattedText(selectedSection.text)}</div>
                                    )}
                                </div>

                                <div className="section-footer">
                                    <button onClick={handleBack} className="footer-btn back-btn">
                                        <ChevronLeft size={16} />
                                        Back to Sections
                                    </button>
                                    <div className="footer-actions">
                                        <button onClick={quizMe} className="footer-btn quiz-btn">
                                            <BrainIcon size={16} />
                                            Quiz Me
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(selectedSection.section)} 
                                            className="footer-btn delete-btn"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sections-view">
                                <div className={`sections-container ${viewMode}`}>
                                    {filteredSections.length > 0 ? (
                                        filteredSections.map((section, index) => (
                                            <div 
                                                key={index} 
                                                className="section-item"
                                                onClick={() => fetchSectionData(section)}
                                            >
                                                <Bookmark size={16} className="section-icon" />
                                                <span className="section-name">{section.section}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-sections">
                                            {searchQuery ? 
                                                "No sections match your search" : 
                                                "No sections found. Create your first section below."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="add-section-container">
                            {!selectedSection && (
                                <button 
                                    onClick={() => setShowNewEntryForm(!showNewEntryForm)} 
                                    className="add-section-btn"
                                >
                                    <PlusCircle size={16} />
                                    {showNewEntryForm ? "Cancel" : "Add New Section"}
                                </button>
                            )}

                            {showNewEntryForm && (
                                <div className="new-section-form">
                                    <h5 className="form-title">
                                        <PlusCircle size={18} />
                                        Create New Section
                                    </h5>
                                    <input
                                        type="text"
                                        className="section-name-input"
                                        placeholder="Section Name"
                                        value={newSection}
                                        onChange={(e) => setNewSection(e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Section Content"
                                        className="section-content-input"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                    />
                                    <button onClick={handleCreateNewEntry} className="save-new-section-btn">
                                        <Save size={16} />
                                        Save New Section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}