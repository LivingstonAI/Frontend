import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function IdeasSection() {
    const [ideas, setIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState({
        idea_category: '',
        idea_text: '',
        idea_tracker: 'Pending'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    // Predefined categories
    const categoryOptions = [
        { value: '', label: 'Select a category...' },
        { value: 'Feature Ideas', label: 'Feature Ideas' },
        { value: 'Trading Strategies', label: 'Trading Strategies' },
        { value: 'AI Enhancements', label: 'AI Enhancements' }
    ];
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // Fetch ideas when component mounts
    useEffect(() => {
        fetchIdeas();
    }, []);
    
    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/fetch-ideas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch ideas');
            }
            
            const data = await response.json();
            setIdeas(data);
            setError(null);
        } catch (err) {
            setError('Error fetching ideas: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIdea(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${baseUrl}/generate-idea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                body: JSON.stringify(newIdea)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create idea');
            }
            
            // Reset form and refresh ideas
            setNewIdea({
                idea_category: '',
                idea_text: '',
                idea_tracker: 'Pending'
            });
            
            // Hide the form after successful submission
            setShowCreateForm(false);
            
            fetchIdeas();
            setError(null);
        } catch (err) {
            setError('Error creating idea: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Toggle form visibility
    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    };

    // CSS styles (added inline)
    const styles = {
        container: {
            fontFamily: "'Poppins', sans-serif",
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '1rem'
        },
        sectionTitle: {
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0
        },
        createButton: {
            backgroundColor: showCreateForm ? '#e74c3c' : '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '4px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        },
        formContainer: {
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            marginBottom: '2rem',
            border: '1px solid #e0e0e0',
            animation: 'fadeIn 0.3s ease-in-out'
        },
        formTitle: {
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1.2rem',
            color: '#34495e'
        },
        formGroup: {
            marginBottom: '1.2rem'
        },
        label: {
            fontWeight: '500',
            marginBottom: '0.5rem',
            display: 'block',
            color: '#4a5568'
        },
        input: {
            width: '100%',
            padding: '0.6rem',
            borderRadius: '4px',
            border: '1px solid #cbd5e0',
            transition: 'border-color 0.2s ease',
            fontSize: '1rem'
        },
        saveButton: {
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '4px',
            fontWeight: '500',
            marginRight: '0.8rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        cancelButton: {
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '4px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        ideasListHeader: {
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1rem',
            marginTop: '1.5rem',
            color: '#34495e',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #f0f0f0'
        },
        card: {
            borderRadius: '8px',
            border: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        },
        cardHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
        },
        cardHeader: {
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #f0f0f0',
            padding: '0.8rem 1rem'
        },
        cardTitle: {
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: 0,
            color: '#2c3e50'
        },
        cardBody: {
            padding: '1rem',
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column'
        },
        cardText: {
            color: '#4a5568',
            marginBottom: '1rem',
            flex: '1 0 auto'
        },
        cardFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.8rem',
            borderTop: '1px solid #f0f0f0'
        },
        badge: {
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontWeight: '500',
            fontSize: '0.75rem'
        },
        badgePending: {
            backgroundColor: '#718096',
            color: 'white'
        },
        badgeInProgress: {
            backgroundColor: '#f39c12',
            color: 'white'
        },
        badgeCompleted: {
            backgroundColor: '#27ae60',
            color: 'white'
        },
        dateText: {
            fontSize: '0.75rem',
            color: '#718096'
        },
        spinnerContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 0'
        },
        spinner: {
            width: '2.5rem',
            height: '2.5rem',
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            borderTopColor: '#3498db',
            animation: 'spin 1s ease-in-out infinite'
        },
        emptyState: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginTop: '1rem'
        },
        emptyStateText: {
            color: '#718096',
            fontWeight: '500',
            marginTop: '1rem',
            textAlign: 'center'
        },
        errorAlert: {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
        }
    };

    // Dynamic card hover effect handler
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div style={styles.header}>
                        <h5 style={styles.sectionTitle}>Ideas Hub</h5>
                        <button 
                            style={styles.createButton} 
                            onClick={toggleCreateForm}
                            className="btn"
                        >
                            {showCreateForm ? 'Cancel' : '+ Create New Idea'}
                        </button>
                    </div>
                    
                    {error && <div style={styles.errorAlert}>{error}</div>}
                    
                    {/* Create Idea Form - only shown when showCreateForm is true */}
                    {showCreateForm && (
                        <div style={styles.formContainer}>
                            <h6 style={styles.formTitle}>Create New Idea</h6>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="idea_category">Category</label>
                                    <select
                                        style={styles.input}
                                        id="idea_category"
                                        name="idea_category"
                                        value={newIdea.idea_category}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    >
                                        {categoryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="idea_text">Description</label>
                                    <textarea
                                        style={styles.input}
                                        id="idea_text"
                                        name="idea_text"
                                        rows="3"
                                        value={newIdea.idea_text}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                        placeholder="Describe your idea here..."
                                    ></textarea>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label} htmlFor="idea_tracker">Status</label>
                                    <select
                                        style={styles.input}
                                        id="idea_tracker"
                                        name="idea_tracker"
                                        value={newIdea.idea_tracker}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <button type="submit" style={styles.saveButton} className="btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Idea'}
                                </button>
                                <button type="button" style={styles.cancelButton} className="btn" onClick={toggleCreateForm}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {/* Display Ideas */}
                    <div className="ideas-list">
                        <h6 style={styles.ideasListHeader}>My Ideas</h6>
                        
                        {loading && (
                            <div style={styles.spinnerContainer}>
                                <div style={styles.spinner}></div>
                            </div>
                        )}
                        
                        {!loading && ideas.length === 0 && (
                            <div style={styles.emptyState}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 9H9.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M15 9H15.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 14H16" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p style={styles.emptyStateText}>No ideas found. Click the "Create New Idea" button to get started!</p>
                            </div>
                        )}
                        
                        <div className="row">
                            {ideas.map(idea => (
                                <div className="col-md-4 mb-4" key={idea.id}>
                                    <div 
                                        style={{
                                            ...styles.card,
                                            ...(hoveredCard === idea.id ? styles.cardHover : {})
                                        }}
                                        className="card"
                                        onMouseEnter={() => setHoveredCard(idea.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div style={styles.cardHeader}>
                                            <h6 style={styles.cardTitle}>{idea.idea_category}</h6>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p style={styles.cardText}>{idea.idea_text}</p>
                                            <div style={styles.cardFooter}>
                                                <span style={{
                                                    ...styles.badge,
                                                    ...(idea.idea_tracker === 'Completed' ? styles.badgeCompleted : 
                                                       idea.idea_tracker === 'In Progress' ? styles.badgeInProgress : 
                                                       styles.badgePending)
                                                }}>
                                                    {idea.idea_tracker}
                                                </span>
                                                <small style={styles.dateText}>
                                                    {new Date(idea.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CSS animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}