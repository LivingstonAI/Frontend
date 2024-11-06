import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

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
    const [isSpeaking, setIsSpeaking] = useState(false); // New state to track speaking status
    const [imageFolders, setImageFolders] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null); // Initialize state for expanded image
    const [folderState, setFolderState] = useState(false);
    const [imageViewState, setImageViewState] = useState(true);

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';


    useEffect(() => {
        const fetchSections = async () => {
            try {
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
                setIsSpeaking(false); // Reset speaking status
                
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
        setSelectedSection(null);
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
                return <h6 key={index}>{line.replace('##', '').trim()}</h6>;
            } else if (line.startsWith('### ')) {
                return <p key={index} style={{ marginLeft: '20px' }}>{line.replace('###', '').trim()}</p>;
            } else if (line.startsWith('-> ')) {
                return <p key={index} style={{ marginLeft: '20px', fontStyle: 'italic' }}>{line.replace('->', '').trim()}</p>;
            } else {
                return <p key={index}>{line}</p>;
            }
        });
    };


    const speechQueue = []; // Array to hold queued text
    let speaking = false; // Flag to check if currently speaking
    
    const readTextAloud = (text) => {
        if ('speechSynthesis' in window) {
            // Stop any ongoing speech before starting a new one
            window.speechSynthesis.cancel(); // Stop current speech

            // Clean the text
            const cleanText = text.replace(/#{1,3}/g, ''); // Matches 1 to 3 '#' characters
            
            // Speak the new text
            const utterance = new SpeechSynthesisUtterance(cleanText);
            speechQueue.push(cleanText);
            processQueue();
            utterance.onend = () => {
                setIsSpeaking(false); // Reset speaking status when done
            };
            setIsSpeaking(true); // Set speaking status to true
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Text-to-speech is not supported in this browser.");
        }
    };


    const processQueue = () => {
        if (speaking || speechQueue.length === 0) {
            return; // Exit if already speaking or nothing in the queue
        }
    
        const text = speechQueue.shift(); // Get the next text to speak
        const utterance = new SpeechSynthesisUtterance(text);
        console.log("Text to speak:", text); // Log the text
    
        // Set properties for the utterance
        utterance.volume = 1; // Range: 0 to 1
        utterance.pitch = 1;  // Range: 0 to 2
        utterance.rate = 1;   // Range: 0.1 to 10
    
        // Add event listeners
        utterance.onstart = () => {
            speaking = true; // Set speaking flag
            console.log("Speech started.");
        };
        
        utterance.onend = () => {
            speaking = false; // Reset speaking flag
            console.log("Speech finished.");
            processQueue(); // Process next item in queue
        };
        
        utterance.onerror = (event) => console.error("Speech error:", event.error);
    
        // Ensure voices are available
        const voices = window.speechSynthesis.getVoices();
        
        // Log available voices for debugging
        console.log("Available voices:", voices);
        
        if (voices.length > 0) {
            utterance.voice = voices[0]; // Select the first voice
        } else {
            // If voices are not loaded, wait for the voiceschanged event
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                console.log("Voices changed:", voices); // Log voices after change
                if (voices.length > 0) {
                    utterance.voice = voices[0]; // Select the first voice
                    window.speechSynthesis.speak(utterance); // Speak after voices are loaded
                } else {
                    console.error("No voices available after voices changed.");
                }
            };
            return; // Prevent speaking until voices are loaded
        }
    
        // Attempt to speak the utterance
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Error speaking the utterance:", error);
        }
    };
    
    // Function to stop speech synthesis
    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            setIsSpeaking(false); // Reset speaking flag

            speaking = false; // Reset speaking flag
            console.log("Speech stopped.");
        } else {
            console.error("Text-to-speech is not supported in this browser.");
        }
    };   

    const fetchImages = async () => {
        try {
            const response = await fetch(`${baseUrl}/fetch-trading-images`);
            const data = await response.json();
            if (response.ok) {
                // Only update state if the folders are different to avoid duplicates
                setImageFolders(prevState => {
                    // Check if data.folders is different from the previous state
                    if (JSON.stringify(prevState) !== JSON.stringify(data.folders)) {
                        return data.folders;
                    }
                    return prevState; // Return the same state if no change
                });
                console.log(data.folders);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
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
        setExpandedImage(imageData); // Set clicked image to be expanded
    };

    const handleCloseExpandedImage = () => {
        setExpandedImage(null); // Close the expanded image
    };


    const imageStateClear = () => {
        setImageViewState(false);
    }


    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="chill-div">
                        <h5>C.H.I.L.L Interface</h5><br />
                        {imageViewState && (
                    <div>
                        <button onClick={fetchImages}>View Images</button>
                        {imageFolders && (
                            <div>
                                <h6>Image Folders</h6>
                                {Object.keys(imageFolders).map((folder, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleFolderClick(folder)}
                                        style={{ marginRight: "10px" }}
                                        className="image-folder-button"
                                    >
                                        {folder}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            <br /><br />
            

            {selectedFolder && folderState && (
                <div>
                    <h6>Images in {selectedFolder}</h6>
                    <button onClick={closeFolder}>Close Folder</button>
                    <div className="images-container">
                        {imageFolders[selectedFolder].map((imageData, index) => (
                            <div
                                key={index}
                                className="image-item"
                                onClick={() => handleImageClick(imageData)} // Set the image to be expanded
                            >
                                <img
                                    src={imageData.data}
                                    alt={imageData.filename || "Trading Image"}
                                    className="thumbnail"
                                /> 
                            </div>
                            
                        ))}
                        
                    </div>
                    
                </div>
            )}

            {expandedImage && (
                <div className="expanded-image-container" onClick={handleCloseExpandedImage}>
                    <div className="expanded-image">
                        <img
                            src={expandedImage.data}
                            alt="Expanded Trading Image"
                            className="expanded-thumbnail"
                        />
                    </div>
                </div>
            )}
            <br />
      
                        {loading ? (
                            <div className="loading">
                                <p>Loading C.H.I.L.L data...</p>
                                <div>
                                
                            </div>
                            </div>
                        ) : selectedSection ? (
                            <div>
                                
                                <h6>{selectedSection.section}</h6>

                                {editing ? (
                                    <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        style={{ width: '100%', height: '300px' }}
                                    />
                                ) : (
                                    <div>{renderFormattedText(selectedSection.text)}</div>
                                )}

                                <div>
                                    {editing ? (
                                        <button onClick={handleSave}>Save</button>
                                    ) : (
                                        <button onClick={() => setEditing(true)}>Edit</button>
                                    )}<br /><br />
                                    <button onClick={handleBack}>Back</button><br /><br />
                                    <button onClick={() => handleDelete(selectedSection.section)}>Delete</button><br /><br />
                                    {!isSpeaking && (
                                    <button onClick={() => readTextAloud(selectedSection.text)}>Read Aloud</button>
                                )}
                                </div>
                                {/* Stop Speech Button */}
                                {isSpeaking && (
                                        <button onClick={stopSpeech}>
                                            Stop Speech
                                        </button>
                                    )}
                            </div>
                        ) : (
                            <div className="section-links">
                                {sections.map((section, index) => (
                                    <a key={index} href="#" onClick={() => fetchSectionData(section)} className="section-link">
                                        {section.section}
                                    </a>
                                ))}
                            </div>
                        )} <br />
                        <button onClick={() => setShowNewEntryForm(!showNewEntryForm)}>
                            {showNewEntryForm ? "Cancel" : "Add New Entry"}
                        </button>

                        {showNewEntryForm && (
                            <div>
                                <br /><h6>Create New Section</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Section Name"
                                    value={newSection}
                                    onChange={(e) => setNewSection(e.target.value)}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                />
                                <textarea
                                    placeholder="Section Content"
                                    className="form-control"
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    style={{ width: '100%', height: '150px' }}
                                />
                                <button onClick={handleCreateNewEntry}>Save New Entry</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
