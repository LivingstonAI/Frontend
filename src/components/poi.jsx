import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    header: {
        width: '100%'
    },
    mainPageBody: {
        display: 'flex',
        flex: 1,
        position: 'relative'
    },
    mainBodyInfo: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto'
    },
    pageHeader: {
        color: '#0ea5e9',
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderBottom: '3px solid #7dd3fc',
        paddingBottom: '10px'
    },
    addPersonButton: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '20px',
        transition: 'background-color 0.3s'
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    modalHeader: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '600',
        color: '#0ea5e9'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '2px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    fileInput: {
        width: '100%',
        padding: '10px',
        border: '2px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        cursor: 'pointer'
    },
    imagePreview: {
        width: '100%',
        maxHeight: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginTop: '10px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '2px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '14px',
        minHeight: '80px',
        boxSizing: 'border-box',
        resize: 'vertical'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
    primaryButton: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    secondaryButton: {
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    peopleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    personCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
    },
    personCardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
    },
    personImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '15px'
    },
    personName: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: '10px'
    },
    personBio: {
        fontSize: '14px',
        color: '#4b5563',
        marginBottom: '10px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    cardButtons: {
        display: 'flex',
        gap: '8px',
        marginTop: '15px',
        flexWrap: 'wrap'
    },
    smallButton: {
        padding: '6px 12px',
        fontSize: '12px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600'
    },
    viewButton: {
        backgroundColor: '#0ea5e9',
        color: 'white'
    },
    chatButton: {
        backgroundColor: '#10b981',
        color: 'white'
    },
    editButton: {
        backgroundColor: '#f59e0b',
        color: 'white'
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        color: 'white'
    },
    detailSection: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
    },
    detailTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: '8px'
    },
    detailText: {
        fontSize: '14px',
        color: '#374151',
        lineHeight: '1.6'
    },
    videoContainer: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    iframe: {
        width: '100%',
        height: '315px',
        borderRadius: '8px',
        border: 'none'
    },
    chatContainer: {
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    chatMessages: {
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f9fafb'
    },
    chatMessage: {
        marginBottom: '12px',
        padding: '10px 14px',
        borderRadius: '12px',
        maxWidth: '75%',
        width: 'fit-content',
        wordWrap: 'break-word'
    },
    userMessage: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        marginLeft: 'auto'
    },
    aiMessage: {
        backgroundColor: '#e0f2fe',
        color: '#0c4a6e',
        border: '1px solid #bae6fd'
    },
    chatInputContainer: {
        display: 'flex',
        padding: '10px',
        backgroundColor: 'white',
        borderTop: '2px solid #e5e7eb'
    },
    chatInput: {
        flex: 1,
        padding: '10px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '14px',
        marginRight: '10px'
    },
    sendButton: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    generalChatSection: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid #7dd3fc'
    },
    generalChatHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    toggleChatButton: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    youtubeUrlInput: {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px'
    },
    addUrlButton: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },
    urlList: {
        listStyle: 'none',
        padding: 0,
        margin: '10px 0'
    },
    urlItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        marginBottom: '5px'
    },
    removeUrlButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    }
};

export default function SnowAIPeopleofInterest() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    
    const [people, setPeople] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editingPerson, setEditingPerson] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        accomplishments: '',
        bio: '',
        works: '',
        youtube_urls: [],
        estimated_iq: '',
        additional_notes: ''
    });
    
    const [imagePreview, setImagePreview] = useState(null);
    const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
    
    // Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    
    // General chat state
    const [generalChatMessages, setGeneralChatMessages] = useState([]);
    const [generalChatInput, setGeneralChatInput] = useState('');
    const [isSendingGeneralMessage, setIsSendingGeneralMessage] = useState(false);
    const [isGeneralChatOpen, setIsGeneralChatOpen] = useState(false);

    useEffect(() => {
        fetchAllPeople();
        fetchOpenAIKey();
    }, []);

    const fetchOpenAIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching OpenAI key:", error);
        }
    };

    const fetchAllPeople = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai_poi_get_all_people_unique_v1/`);
            const data = await response.json();
            if (data.success) {
                setPeople(data.people);
            }
        } catch (error) {
            console.error("Error fetching people:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addYoutubeUrl = () => {
        if (newYoutubeUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                youtube_urls: [...prev.youtube_urls, newYoutubeUrl.trim()]
            }));
            setNewYoutubeUrl('');
        }
    };

    const removeYoutubeUrl = (index) => {
        setFormData(prev => ({
            ...prev,
            youtube_urls: prev.youtube_urls.filter((_, i) => i !== index)
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: null,
            accomplishments: '',
            bio: '',
            works: '',
            youtube_urls: [],
            estimated_iq: '',
            additional_notes: ''
        });
        setImagePreview(null);
        setNewYoutubeUrl('');
    };

    const handleCreatePerson = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('accomplishments', formData.accomplishments);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('works', formData.works);
            formDataToSend.append('estimated_iq', formData.estimated_iq);
            formDataToSend.append('additional_notes', formData.additional_notes);
            formDataToSend.append('youtube_urls', JSON.stringify(formData.youtube_urls));
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            
            const response = await fetch(`${baseUrl}/snowai_poi_create_person_unique_v1/`, {
                method: 'POST',
                body: formDataToSend
            });
            const data = await response.json();
            if (data.success) {
                fetchAllPeople();
                setShowAddModal(false);
                resetForm();
            }
        } catch (error) {
            console.error("Error creating person:", error);
        }
    };

    const handleUpdatePerson = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('accomplishments', formData.accomplishments);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('works', formData.works);
            formDataToSend.append('estimated_iq', formData.estimated_iq);
            formDataToSend.append('additional_notes', formData.additional_notes);
            formDataToSend.append('youtube_urls', JSON.stringify(formData.youtube_urls));
            
            if (formData.image && typeof formData.image !== 'string') {
                formDataToSend.append('image', formData.image);
            }
            
            const response = await fetch(`${baseUrl}/snowai_poi_update_person_unique_v1/${editingPerson.id}/`, {
                method: 'POST',
                body: formDataToSend
            });
            const data = await response.json();
            if (data.success) {
                fetchAllPeople();
                setShowAddModal(false);
                setEditingPerson(null);
                resetForm();
            }
        } catch (error) {
            console.error("Error updating person:", error);
        }
    };

    const handleDeletePerson = async (personId) => {
        if (window.confirm('Are you sure you want to delete this person?')) {
            try {
                const response = await fetch(`${baseUrl}/snowai_poi_delete_person_unique_v1/${personId}/`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    fetchAllPeople();
                }
            } catch (error) {
                console.error("Error deleting person:", error);
            }
        }
    };

    const openEditModal = (person) => {
        setEditingPerson(person);
        setFormData({
            name: person.name,
            image: person.image_url, // Store URL for display
            accomplishments: person.accomplishments,
            bio: person.bio,
            works: person.works,
            youtube_urls: person.youtube_urls || [],
            estimated_iq: person.estimated_iq,
            additional_notes: person.additional_notes
        });
        setImagePreview(person.image_url); // Set existing image as preview
        setShowAddModal(true);
    };

    const openViewModal = (person) => {
        setSelectedPerson(person);
        setShowViewModal(true);
    };

    const openChatModal = (person) => {
        setSelectedPerson(person);
        setChatMessages([]);
        setShowChatModal(true);
    };

    const getYoutubeEmbedUrl = (url) => {
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || isSendingMessage || !OPENAI_API_KEY) return;

        const userMessage = chatInput.trim();
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatInput('');
        setIsSendingMessage(true);

        try {
            // Create context for the AI
            const context = `You are an AI assistant with extensive knowledge about ${selectedPerson.name}.
            
Bio: ${selectedPerson.bio}
Accomplishments: ${selectedPerson.accomplishments}
Works: ${selectedPerson.works}
Estimated IQ: ${selectedPerson.estimated_iq}
Additional Notes: ${selectedPerson.additional_notes}

Please answer questions about this person based on the information provided and your general knowledge about them. Be informative and engaging.`;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: context },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            } else {
                throw new Error("Invalid response from OpenAI");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, there was an error processing your message.' }]);
        } finally {
            setIsSendingMessage(false);
        }
    };

    const sendGeneralChatMessage = async () => {
        if (!generalChatInput.trim() || isSendingGeneralMessage || !OPENAI_API_KEY) return;

        const userMessage = generalChatInput.trim();
        setGeneralChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setGeneralChatInput('');
        setIsSendingGeneralMessage(true);

        try {
            // Create context with all people
            let allPeopleContext = "You have access to information about the following high-achieving individuals:\n\n";
            
            people.forEach(person => {
                allPeopleContext += `
Name: ${person.name}
Bio: ${person.bio}
Accomplishments: ${person.accomplishments}
Works: ${person.works}
Estimated IQ: ${person.estimated_iq}
---
`;
            });
            
            allPeopleContext += "\nPlease answer questions about these individuals or compare them based on the information provided.";

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: allPeopleContext },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                setGeneralChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            } else {
                throw new Error("Invalid response from OpenAI");
            }
        } catch (error) {
            console.error("Error sending general message:", error);
            setGeneralChatMessages(prev => [...prev, { role: 'ai', content: 'Sorry, there was an error processing your message.' }]);
        } finally {
            setIsSendingGeneralMessage(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Header />
            </div>
            <div style={styles.mainPageBody}>
                <SideNavs />
                <div style={styles.mainBodyInfo}>
                    <h5 style={styles.pageHeader}>SnowAI People of Interest</h5>
                    
                    {/* General Chat Section */}
                    <div style={styles.generalChatSection}>
                        <div style={styles.generalChatHeader}>
                            <div>
                                <h3 style={styles.modalHeader}>General AI Assistant</h3>
                                <p style={{ color: '#64748b', marginBottom: '0', fontSize: '14px' }}>
                                    Ask questions about any of the people in your collection or compare them.
                                </p>
                            </div>
                            <button
                                style={styles.toggleChatButton}
                                onClick={() => setIsGeneralChatOpen(!isGeneralChatOpen)}
                            >
                                {isGeneralChatOpen ? 'Close Chat' : 'Open Chat'}
                            </button>
                        </div>
                        
                        {isGeneralChatOpen && (
                            <div style={styles.chatContainer}>
                                <div style={styles.chatMessages}>
                                    {generalChatMessages.length === 0 && (
                                        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '20px' }}>
                                            Start a conversation about the people in your collection...
                                        </p>
                                    )}
                                    {generalChatMessages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                ...styles.chatMessage,
                                                ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.chatInputContainer}>
                                    <input
                                        type="text"
                                        style={styles.chatInput}
                                        value={generalChatInput}
                                        onChange={(e) => setGeneralChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendGeneralChatMessage()}
                                        placeholder="Ask about anyone in your collection..."
                                    />
                                    <button
                                        style={styles.sendButton}
                                        onClick={sendGeneralChatMessage}
                                        disabled={isSendingGeneralMessage}
                                    >
                                        {isSendingGeneralMessage ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        style={styles.addPersonButton}
                        onClick={() => {
                            setEditingPerson(null);
                            resetForm();
                            setShowAddModal(true);
                        }}
                    >
                        + Add New Person
                    </button>

                    {/* People Grid */}
                    <div style={styles.peopleGrid}>
                        {people.map((person) => (
                            <div
                                key={person.id}
                                style={{
                                    ...styles.personCard,
                                    ...(hoveredCard === person.id ? styles.personCardHover : {})
                                }}
                                onMouseEnter={() => setHoveredCard(person.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {person.image_url && (
                                    <img
                                        src={person.image_url}
                                        alt={person.name}
                                        style={styles.personImage}
                                    />
                                )}
                                <div style={styles.personName}>{person.name}</div>
                                <div style={styles.personBio}>{person.bio}</div>
                                {person.estimated_iq && (
                                    <div style={{ fontSize: '14px', color: '#0ea5e9', fontWeight: '600' }}>
                                        Estimated IQ: {person.estimated_iq}
                                    </div>
                                )}
                                <div style={styles.cardButtons}>
                                    <button
                                        style={{ ...styles.smallButton, ...styles.viewButton }}
                                        onClick={() => openViewModal(person)}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        style={{ ...styles.smallButton, ...styles.chatButton }}
                                        onClick={() => openChatModal(person)}
                                    >
                                        Chat with AI
                                    </button>
                                    <button
                                        style={{ ...styles.smallButton, ...styles.editButton }}
                                        onClick={() => openEditModal(person)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={{ ...styles.smallButton, ...styles.deleteButton }}
                                        onClick={() => handleDeletePerson(person.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Modal */}
                    {showAddModal && (
                        <div style={styles.modal} onClick={() => { setShowAddModal(false); setEditingPerson(null); }}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <h2 style={styles.modalHeader}>
                                    {editingPerson ? 'Edit Person' : 'Add New Person'}
                                </h2>
                                
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        style={styles.input}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Sabine Hossenfelder"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Image *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={styles.fileInput}
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={styles.imagePreview}
                                        />
                                    )}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Bio *</label>
                                    <textarea
                                        name="bio"
                                        style={styles.textarea}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Brief biography..."
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Accomplishments</label>
                                    <textarea
                                        name="accomplishments"
                                        style={styles.textarea}
                                        value={formData.accomplishments}
                                        onChange={handleInputChange}
                                        placeholder="Major achievements and contributions..."
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Published Works</label>
                                    <textarea
                                        name="works"
                                        style={styles.textarea}
                                        value={formData.works}
                                        onChange={handleInputChange}
                                        placeholder="Books, papers, projects..."
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>YouTube Videos</label>
                                    <div style={styles.youtubeUrlInput}>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={newYoutubeUrl}
                                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                            placeholder="Paste YouTube URL"
                                        />
                                        <button style={styles.addUrlButton} onClick={addYoutubeUrl}>
                                            Add
                                        </button>
                                    </div>
                                    {formData.youtube_urls.length > 0 && (
                                        <ul style={styles.urlList}>
                                            {formData.youtube_urls.map((url, idx) => (
                                                <li key={idx} style={styles.urlItem}>
                                                    <span style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {url}
                                                    </span>
                                                    <button
                                                        style={styles.removeUrlButton}
                                                        onClick={() => removeYoutubeUrl(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Estimated IQ</label>
                                    <input
                                        type="text"
                                        name="estimated_iq"
                                        style={styles.input}
                                        value={formData.estimated_iq}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 160+"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Additional Notes</label>
                                    <textarea
                                        name="additional_notes"
                                        style={styles.textarea}
                                        value={formData.additional_notes}
                                        onChange={handleInputChange}
                                        placeholder="Any other relevant information..."
                                    />
                                </div>

                                <div style={styles.buttonGroup}>
                                    <button
                                        style={styles.primaryButton}
                                        onClick={editingPerson ? handleUpdatePerson : handleCreatePerson}
                                    >
                                        {editingPerson ? 'Update Person' : 'Create Person'}
                                    </button>
                                    <button
                                        style={styles.secondaryButton}
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingPerson(null);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Details Modal */}
                    {showViewModal && selectedPerson && (
                        <div style={styles.modal} onClick={() => setShowViewModal(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <h2 style={styles.modalHeader}>{selectedPerson.name}</h2>
                                
                                {selectedPerson.image_url && (
                                    <img
                                        src={selectedPerson.image_url}
                                        alt={selectedPerson.name}
                                        style={{ ...styles.personImage, height: '250px' }}
                                    />
                                )}

                                {selectedPerson.estimated_iq && (
                                    <div style={styles.detailSection}>
                                        <div style={styles.detailTitle}>Estimated IQ</div>
                                        <div style={styles.detailText}>{selectedPerson.estimated_iq}</div>
                                    </div>
                                )}

                                <div style={styles.detailSection}>
                                    <div style={styles.detailTitle}>Biography</div>
                                    <div style={styles.detailText}>{selectedPerson.bio}</div>
                                </div>

                                {selectedPerson.accomplishments && (
                                    <div style={styles.detailSection}>
                                        <div style={styles.detailTitle}>Accomplishments</div>
                                        <div style={styles.detailText}>{selectedPerson.accomplishments}</div>
                                    </div>
                                )}

                                {selectedPerson.works && (
                                    <div style={styles.detailSection}>
                                        <div style={styles.detailTitle}>Published Works</div>
                                        <div style={styles.detailText}>{selectedPerson.works}</div>
                                    </div>
                                )}

                                {selectedPerson.youtube_urls && selectedPerson.youtube_urls.length > 0 && (
                                    <div style={styles.detailSection}>
                                        <div style={styles.detailTitle}>Videos</div>
                                        {selectedPerson.youtube_urls.map((url, idx) => {
                                            const embedUrl = getYoutubeEmbedUrl(url);
                                            return embedUrl ? (
                                                <div key={idx} style={styles.videoContainer}>
                                                    <iframe
                                                        style={styles.iframe}
                                                        src={embedUrl}
                                                        title={`Video ${idx + 1}`}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                )}

                                {selectedPerson.additional_notes && (
                                    <div style={styles.detailSection}>
                                        <div style={styles.detailTitle}>Additional Notes</div>
                                        <div style={styles.detailText}>{selectedPerson.additional_notes}</div>
                                    </div>
                                )}

                                <div style={styles.buttonGroup}>
                                    <button
                                        style={styles.secondaryButton}
                                        onClick={() => setShowViewModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Modal */}
                    {showChatModal && selectedPerson && (
                        <div style={styles.modal} onClick={() => setShowChatModal(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <h2 style={styles.modalHeader}>Chat about {selectedPerson.name}</h2>
                                <p style={{ color: '#6b7280', marginBottom: '15px', fontSize: '14px' }}>
                                    Ask questions about their life, work, and accomplishments.
                                </p>
                                
                                <div style={styles.chatContainer}>
                                    <div style={styles.chatMessages}>
                                        {chatMessages.length === 0 && (
                                            <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '20px' }}>
                                                Start a conversation...
                                            </p>
                                        )}
                                        {chatMessages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    ...styles.chatMessage,
                                                    ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)
                                                }}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={styles.chatInputContainer}>
                                        <input
                                            type="text"
                                            style={styles.chatInput}
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                            placeholder="Ask a question..."
                                        />
                                        <button
                                            style={styles.sendButton}
                                            onClick={sendChatMessage}
                                            disabled={isSendingMessage}
                                        >
                                            {isSendingMessage ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ ...styles.buttonGroup, marginTop: '15px' }}>
                                    <button
                                        style={styles.secondaryButton}
                                        onClick={() => {
                                            setShowChatModal(false);
                                            setChatMessages([]);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}