import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, ChevronLeft, Edit2, Trash2, Volume2, VolumeX, PlusCircle, Folder, Image, MessageSquare, Save, X, List, Grid, RefreshCw } from "react-feather";

// Custom Brain Icon Component
const BrainIcon = ({ size = 30, color = "currentColor", className = "", ...props }) => {
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

// Voice selector icon
const MicIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const VOICE_STORAGE_KEY = 'chill_selected_voice_name';

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
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Voice selection state
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState(() => {
        try { return localStorage.getItem(VOICE_STORAGE_KEY) || ''; } catch { return ''; }
    });
    const [showVoiceSelector, setShowVoiceSelector] = useState(false);

    const navigate = useNavigate();
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    // Load voices and persist selection
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setAvailableVoices(voices);
                // If no saved voice, default to first English voice
                if (!selectedVoiceName) {
                    const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
                    if (defaultVoice) {
                        setSelectedVoiceName(defaultVoice.name);
                        try { localStorage.setItem(VOICE_STORAGE_KEY, defaultVoice.name); } catch {}
                    }
                }
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const handleVoiceChange = (voiceName) => {
        setSelectedVoiceName(voiceName);
        try { localStorage.setItem(VOICE_STORAGE_KEY, voiceName); } catch {}
        setShowVoiceSelector(false);
    };

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

    const fetchDataFromAPI = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    useEffect(() => { fetchDataFromAPI(); }, []);

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: selectedSection.section, text: editedText }),
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
                headers: { 'Content-Type': 'application/json' },
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
        if (!newSection.trim()) { alert("Please enter a section name"); return; }
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/create-chill-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: newSection, text: newText }),
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
            if (line.startsWith('## ')) return <h5 key={index} className="subheading">{line.replace('##', '').trim()}</h5>;
            else if (line.startsWith('### ')) return <p key={index} className="subpoint">{line.replace('###', '').trim()}</p>;
            else if (line.startsWith('-> ')) return <p key={index} className="note">{line.replace('->', '').trim()}</p>;
            else return <p key={index} className="content-text">{line}</p>;
        });
    };

    const getSelectedVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.name === selectedVoiceName) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    const readTextAloud = (text) => {
        if (!('speechSynthesis' in window)) { console.error("TTS not supported"); return; }
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/#{1,3}/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voice = getSelectedVoice();
        if (voice) utterance.voice = voice;
        utterance.volume = 1;
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const fetchImages = async () => {
        setImageProcess('Fetching Images...');
        try {
            const response = await fetch(`${baseUrl}/fetch-trading-images`);
            const data = await response.json();
            if (response.ok) {
                setImageFolders(prev => JSON.stringify(prev) !== JSON.stringify(data.folders) ? data.folders : prev);
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

    const handleFolderClick = (folder) => { setSelectedFolder(folder); setFolderState(true); };
    const closeFolder = () => setFolderState(false);
    const handleImageClick = (imageData) => setExpandedImage(imageData);
    const handleCloseExpandedImage = () => setExpandedImage(null);
    const cleanText = (text) => text.replace(/#{1,3}/g, '');

    const quizMe = async () => {
        try {
            await navigator.clipboard.writeText(cleanText(editedText));
            navigate('/quizifier');
        } catch (error) {
            console.error("Failed to copy text or open the link:", error);
        }
    };

    const handleHelperClick = () => setChatOpen(true);

    const handleSendMessage = async (input) => {
        if (!input.trim()) return;
        setUserInput('');
        setMessages(prev => [...prev, { role: "user", content: input }]);
        try {
            const response = await askAIHelper(selectedSection, input);
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        }
    };

    const askAIHelper = async (sectionData, input) => {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: `Hello! My name is Tlotlo Motingwe and I am 21 years old. I am the creator of this snowAI system, a private trading system to make my trading efficient. I am learning Korean and Chinese. I practice Shotokan and Taekwondo. I am a guitar player. I also am a kpop dancer. The system is very complex, but your job here is to answer my questions based on the data I provide you. I also aim to manage a hedge fund in the future :). Let's make magic together! You are an AI expert called Livingston and answer questions for the following section: ${editedText}. This is a trading platform.` },
                    { role: "user", content: input },
                ],
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    };

    const filteredSections = sections.filter(section =>
        section.section.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // English-only voices grouped by language for the selector
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const otherVoices = availableVoices.filter(v => !v.lang.startsWith('en'));

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

                        {/* ── CHAT WINDOW ── right-aligned, blue/white */}
                        {chatOpen && (
                            <div className="chat-window chat-window--blue">
                                <div className="chat-header chat-header--blue">
                                    <h4><MessageSquare size={22} /> Livingston AI Assistant</h4>
                                    <button onClick={() => setChatOpen(false)} className="close-btn close-btn--blue">
                                        <X size={22} />
                                    </button>
                                </div>
                                <div className="messages-container">
                                    {messages.length === 0 ? (
                                        <div className="empty-chat empty-chat--blue">
                                            <BrainIcon size={44} color="#1d6fd8" />
                                            <p>Ask Livingston about this section. The AI will analyze the content and provide insights.</p>
                                        </div>
                                    ) : (
                                        <div className="messages">
                                            {messages.map((msg, idx) => (
                                                <div key={idx} className={`message message--${msg.role === 'assistant' ? 'blue' : 'user'} ${msg.role}`}>
                                                    <div className="message-content">{msg.content}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="chat-input-container chat-input-container--blue">
                                    <input
                                        type="text"
                                        placeholder="Ask me something..."
                                        className="chat-input chat-input--blue"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(userInput); }}
                                    />
                                    <button
                                        onClick={() => handleSendMessage(userInput)}
                                        className="send-btn send-btn--blue"
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
                                        <RefreshCw size={30} className={imageProcess === 'Fetching Images...' ? 'spinning' : ''} />
                                        {imageProcess}
                                    </button>
                                    <div className="view-controls">
                                        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                            <Grid size={30} />
                                        </button>
                                        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                                            <List size={30} />
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
                                        <h6 className="section-subheading"><Folder size={30} /> Image Folders</h6>
                                        <div className="folder-grid">
                                            {Object.keys(imageFolders).map((folder, index) => (
                                                <button key={index} onClick={() => handleFolderClick(folder)} className="folder-btn">
                                                    <Folder size={30} />
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
                                    <h6><Folder size={30} /> {selectedFolder}</h6>
                                    <button onClick={closeFolder} className="close-folder-btn"><X size={30} /></button>
                                </div>
                                <div className="images-grid">
                                    {imageFolders[selectedFolder].map((imageData, index) => (
                                        <div key={index} className="image-card" onClick={() => handleImageClick(imageData)}>
                                            <img src={imageData.data} alt={imageData.filename || "Trading Image"} className="image-thumbnail" />
                                            <div className="image-name">{imageData.filename || `Image ${index + 1}`}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {expandedImage && (
                            <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
                                <div className="expanded-image-container" onClick={e => e.stopPropagation()}>
                                    <button className="close-expanded-btn" onClick={handleCloseExpandedImage}><X size={30} /></button>
                                    <img src={expandedImage.data} alt="Expanded Trading Image" className="expanded-image" />
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
                                        <Bookmark size={30} className="icon" />
                                        {selectedSection.section}
                                    </h4>

                                    {/* ── ACTION BUTTONS — bigger icons ── */}
                                    <div className="section-actions">
                                        {/* Voice selector */}
                                        <div className="voice-selector-wrapper" style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => setShowVoiceSelector(v => !v)}
                                                className="action-btn voice-picker-btn"
                                                title={`Voice: ${selectedVoiceName || 'Default'}`}
                                            >
                                                <MicIcon size={38} />
                                            </button>
                                            {showVoiceSelector && (
                                                <div className="voice-dropdown">
                                                    <div className="voice-dropdown-header">
                                                        <span>Choose Voice</span>
                                                        <button onClick={() => setShowVoiceSelector(false)} className="voice-close-btn">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                    {englishVoices.length > 0 && (
                                                        <>
                                                            <div className="voice-group-label">English</div>
                                                            {englishVoices.map(voice => (
                                                                <button
                                                                    key={voice.name}
                                                                    className={`voice-option ${voice.name === selectedVoiceName ? 'voice-option--active' : ''}`}
                                                                    onClick={() => handleVoiceChange(voice.name)}
                                                                >
                                                                    <span className="voice-name">{voice.name}</span>
                                                                    <span className="voice-lang">{voice.lang}</span>
                                                                </button>
                                                            ))}
                                                        </>
                                                    )}
                                                    {otherVoices.length > 0 && (
                                                        <>
                                                            <div className="voice-group-label">Other Languages</div>
                                                            {otherVoices.map(voice => (
                                                                <button
                                                                    key={voice.name}
                                                                    className={`voice-option ${voice.name === selectedVoiceName ? 'voice-option--active' : ''}`}
                                                                    onClick={() => handleVoiceChange(voice.name)}
                                                                >
                                                                    <span className="voice-name">{voice.name}</span>
                                                                    <span className="voice-lang">{voice.lang}</span>
                                                                </button>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {!editing && (
                                            <button onClick={handleHelperClick} className="action-btn assistant-btn" title="AI Assistant">
                                                {/* BIGGER icon: 42px */}
                                                <MessageSquare size={42} />
                                            </button>
                                        )}
                                        {!editing && !isSpeaking && (
                                            <button onClick={() => readTextAloud(selectedSection.text)} className="action-btn" title="Read Aloud">
                                                {/* BIGGER icon: 42px */}
                                                <Volume2 size={42} />
                                            </button>
                                        )}
                                        {isSpeaking && (
                                            <button onClick={stopSpeech} className="action-btn stop-btn" title="Stop Reading">
                                                <VolumeX size={42} />
                                            </button>
                                        )}
                                        {!editing && (
                                            <button onClick={() => setEditing(true)} className="action-btn" title="Edit">
                                                {/* BIGGER icon: 42px */}
                                                <Edit2 size={42} />
                                            </button>
                                        )}
                                        {editing && (
                                            <button onClick={handleSave} className="action-btn save-btn" title="Save">
                                                <Save size={42} />
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
                                        <ChevronLeft size={30} />
                                        Back to Sections
                                    </button>
                                    <div className="footer-actions">
                                        <button onClick={quizMe} className="footer-btn quiz-btn">
                                            <BrainIcon size={30} />
                                            Quiz Me
                                        </button>
                                        <button onClick={() => handleDelete(selectedSection.section)} className="footer-btn delete-btn">
                                            <Trash2 size={30} />
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
                                            <div key={index} className="section-item" onClick={() => fetchSectionData(section)}>
                                                <Bookmark size={30} className="section-icon" />
                                                <span className="section-name">{section.section}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-sections">
                                            {searchQuery ? "No sections match your search" : "No sections found. Create your first section below."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="add-section-container">
                            {!selectedSection && (
                                <button onClick={() => setShowNewEntryForm(!showNewEntryForm)} className="add-section-btn">
                                    <PlusCircle size={30} />
                                    {showNewEntryForm ? "Cancel" : "Add New Section"}
                                </button>
                            )}
                            {showNewEntryForm && (
                                <div className="new-section-form">
                                    <h5 className="form-title"><PlusCircle size={30} /> Create New Section</h5>
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
                                        <Save size={30} />
                                        Save New Section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── VOICE DROPDOWN & CHAT STYLES injected inline ── */}
            <style>{`
                /* ── Chat window: right-aligned, blue/white ── */
                .chat-window--blue {
                    position: fixed;
                    right: 24px;
                    top: 80px;
                    width: 380px;
                    max-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    border: 1.5px solid #1d6fd8;
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(29, 111, 216, 0.18);
                    z-index: 1000;
                    overflow: hidden;
                }
                .chat-header--blue {
                    background: linear-gradient(135deg, #1d6fd8 0%, #1251a3 100%);
                    color: #ffffff;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                }
                .chat-header--blue h4 {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                }
                .close-btn--blue {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    padding: 4px 6px;
                    display: flex;
                    align-items: center;
                    transition: background 0.2s;
                }
                .close-btn--blue:hover { background: rgba(255,255,255,0.3); }
                .empty-chat--blue {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 20px;
                    color: #1d6fd8;
                    text-align: center;
                    gap: 12px;
                    font-size: 14px;
                }
                .message--blue {
                    background: linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%);
                    color: #1251a3;
                    border-left: 3px solid #1d6fd8;
                    border-radius: 0 10px 10px 0;
                    padding: 10px 14px;
                    margin: 4px 0;
                    font-size: 13.5px;
                    line-height: 1.5;
                }
                .message--user {
                    background: #f0f4ff;
                    color: #333;
                    border-left: 3px solid #94b8f5;
                    border-radius: 0 10px 10px 0;
                    padding: 10px 14px;
                    margin: 4px 0;
                    font-size: 13.5px;
                    line-height: 1.5;
                }
                .chat-input-container--blue {
                    display: flex;
                    gap: 8px;
                    padding: 12px;
                    background: #f7f9ff;
                    border-top: 1px solid #dbeafe;
                    flex-shrink: 0;
                }
                .chat-input--blue {
                    flex: 1;
                    border: 1.5px solid #93c5fd;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 13px;
                    outline: none;
                    background: #fff;
                    color: #1a1a2e;
                    transition: border-color 0.2s;
                }
                .chat-input--blue:focus { border-color: #1d6fd8; }
                .send-btn--blue {
                    background: linear-gradient(135deg, #1d6fd8 0%, #1251a3 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .send-btn--blue:hover { opacity: 0.88; }
                .send-btn--blue:disabled { opacity: 0.4; cursor: not-allowed; }

                /* ── Voice dropdown ── */
                .voice-selector-wrapper { display: inline-block; }
                .voice-picker-btn { position: relative; }
                .voice-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: #fff;
                    border: 1.5px solid #1d6fd8;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(29, 111, 216, 0.16);
                    z-index: 999;
                    min-width: 280px;
                    max-height: 340px;
                    overflow-y: auto;
                    padding: 8px 0;
                }
                .voice-dropdown-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 14px 6px;
                    font-weight: 700;
                    font-size: 13px;
                    color: #1251a3;
                    border-bottom: 1px solid #dbeafe;
                    margin-bottom: 4px;
                }
                .voice-close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #888;
                    display: flex;
                    align-items: center;
                    padding: 2px;
                }
                .voice-close-btn:hover { color: #1d6fd8; }
                .voice-group-label {
                    padding: 4px 14px 2px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #6b90c9;
                }
                .voice-option {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    background: none;
                    border: none;
                    padding: 8px 14px;
                    cursor: pointer;
                    text-align: left;
                    transition: background 0.15s;
                    gap: 8px;
                }
                .voice-option:hover { background: #eff6ff; }
                .voice-option--active { background: #dbeafe !important; }
                .voice-option--active .voice-name { color: #1251a3; font-weight: 600; }
                .voice-name {
                    font-size: 13px;
                    color: #333;
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .voice-lang {
                    font-size: 11px;
                    color: #94a3b8;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    );
}