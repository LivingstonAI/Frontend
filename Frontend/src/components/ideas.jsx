import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

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
    const [showUpdateStatus, setShowUpdateStatus] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    
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
                    'Content-Type': 'application/json'
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
                    'Content-Type': 'application/json'
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

    // Delete idea function
    const deleteIdea = async (ideaId) => {
        setDeletingId(ideaId);
        
        try {
            const response = await fetch(`${baseUrl}/delete-idea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idea_id: ideaId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete idea');
            }
            
            // Remove the deleted idea from state
            setIdeas(ideas.filter(idea => idea.id !== ideaId));
            setError(null);
        } catch (err) {
            setError('Error deleting idea: ' + err.message);
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };
    
    // Update idea tracker status - FIXED VERSION
    const updateIdeaTracker = async (ideaId, newStatus) => {
        setUpdatingStatus(true);
        
        try {
            // Show updating status in UI immediately for better UX
            setIdeas(ideas.map(idea => {
                if (idea.id === ideaId) {
                    return { ...idea, idea_tracker: newStatus, isUpdating: true };
                }
                return idea;
            }));
            
            const response = await fetch(`${baseUrl}/update-idea-tracker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idea_id: ideaId,
                    idea_tracker: newStatus
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update idea status');
            }
            
            // Update the idea in the state with final status
            setIdeas(ideas.map(idea => {
                if (idea.id === ideaId) {
                    return { ...idea, idea_tracker: newStatus, isUpdating: false };
                }
                return idea;
            }));
            
            setShowUpdateStatus(null);
            setError(null);
        } catch (err) {
            // Revert the optimistic update if there was an error
            fetchIdeas(); // Refresh all ideas to ensure consistency
            setError('Error updating idea status: ' + err.message);
            console.error('Update error:', err);
        } finally {
            setUpdatingStatus(false);
        }
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
            flexDirection: 'column',
            position: 'relative'
        },
        cardHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
        },
        cardHeader: {
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #f0f0f0',
            padding: '0.8rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
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
            fontSize: '0.75rem',
            cursor: 'pointer'
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
        badgeUpdating: {
            backgroundColor: '#3498db',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
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
        },
        actionButtons: {
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            gap: '0.5rem'
        },
        iconButton: {
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.3rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
        },
        deleteButton: {
            color: '#e74c3c'
        },
        editButton: {
            color: '#3498db'
        },
        statusDropdown: {
            // position: 'absolute',
            top: '100%',
            left: '0',
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '0.5rem 0',
            width: '150px',
            animation: 'fadeIn 0.2s ease-in-out'
        },
        statusOption: {
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            fontSize: '0.9rem'
        },
        statusOptionHover: {
            backgroundColor: '#f8f9fa'
        },
        statusOptionPending: {
            color: '#718096'
        },
        statusOptionInProgress: {
            color: '#f39c12'
        },
        statusOptionCompleted: {
            color: '#27ae60'
        },
        deleteConfirm: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-in-out'
        },
        deleteConfirmText: {
            fontWeight: '500',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#2c3e50'
        },
        deleteConfirmButtons: {
            display: 'flex',
            gap: '0.8rem'
        },
        deleteConfirmYes: {
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            fontWeight: '500'
        },
        deleteConfirmNo: {
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            fontWeight: '500'
        },
        pulseAnimation: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            animation: 'pulse 1.5s infinite'
        }
    };

    // Dynamic card hover effect handler
    const [hoveredCard, setHoveredCard] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Function to handle status toggle
    const toggleStatusDropdown = (ideaId) => {
        setShowUpdateStatus(showUpdateStatus === ideaId ? null : ideaId);
    };

    // Status dropdown menu
    const StatusDropdown = ({ ideaId }) => (
        <div style={styles.statusDropdown}>
            <div 
                style={{
                    ...styles.statusOption,
                    ...styles.statusOptionPending
                }} 
                onClick={() => updateIdeaTracker(ideaId, 'Pending')}
            >
                Pending
            </div>
            <div 
                style={{
                    ...styles.statusOption,
                    ...styles.statusOptionInProgress
                }} 
                onClick={() => updateIdeaTracker(ideaId, 'In Progress')}
            >
                In Progress
            </div>
            <div 
                style={{
                    ...styles.statusOption,
                    ...styles.statusOptionCompleted
                }} 
                onClick={() => updateIdeaTracker(ideaId, 'Completed')}
            >
                Completed
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div style={styles.header}>
                        <p style={styles.sectionTitle}>Ideas Hub</p> <br /> <br />
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
                            <p style={styles.formTitle}>Create New Idea</p>
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
                        <p style={styles.ideasListHeader}>My Ideas</p>
                        
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
                                        onMouseLeave={() => {
                                            if (deleteConfirm !== idea.id && showUpdateStatus !== idea.id) {
                                                setHoveredCard(null);
                                            }
                                        }}
                                    >
                                        {/* Delete confirmation overlay */}
                                        {deleteConfirm === idea.id && (
                                            <div style={styles.deleteConfirm}>
                                                <p style={styles.deleteConfirmText}>Are you sure you want to delete this idea?</p>
                                                <div style={styles.deleteConfirmButtons}>
                                                    <button 
                                                        style={styles.deleteConfirmYes} 
                                                        onClick={() => deleteIdea(idea.id)}
                                                        disabled={deletingId === idea.id}
                                                    >
                                                        {deletingId === idea.id ? 'Deleting...' : 'Yes, Delete'}
                                                    </button>
                                                    <button 
                                                        style={styles.deleteConfirmNo} 
                                                        onClick={() => setDeleteConfirm(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div style={styles.cardHeader}>
                                            <p style={styles.cardTitle}>{idea.idea_category}</p>
                                            {hoveredCard === idea.id && !deleteConfirm && (
                                                <button 
                                                    style={{...styles.iconButton, ...styles.deleteButton}}
                                                    onClick={() => setDeleteConfirm(idea.id)}
                                                    title="Delete Idea"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p style={styles.cardText}>{idea.idea_text}</p>
                                            <div style={styles.cardFooter}>
                                                <div style={{ position: 'relative' }}>
                                                    <span 
                                                        style={{
                                                            ...styles.badge,
                                                            ...(idea.isUpdating ? styles.badgeUpdating : 
                                                                idea.idea_tracker === 'Completed' ? styles.badgeCompleted : 
                                                                idea.idea_tracker === 'In Progress' ? styles.badgeInProgress : 
                                                                styles.badgePending)
                                                        }}
                                                        onClick={() => toggleStatusDropdown(idea.id)}
                                                    >
                                                        {idea.isUpdating ? 'Updating...' : idea.idea_tracker}
                                                        {idea.isUpdating && <div style={styles.pulseAnimation}></div>}
                                                    </span>
                                                    {showUpdateStatus === idea.id && !idea.isUpdating && (
                                                        <StatusDropdown ideaId={idea.id} />
                                                    )}
                                                </div>
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
                
                @keyframes pulse {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}