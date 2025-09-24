import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// Inline styles for the component
const snowaiTranscriptionStyles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  mainPageBody: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)'
  },
  mainBodyInfo: {
    flex: 1,
    padding: '20px',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    margin: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '@media (max-width: 768px)': {
      margin: '10px',
      padding: '15px'
    }
  },
  headerTitle: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    borderBottom: '3px solid #3b82f6',
    paddingBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '22px',
      marginBottom: '20px'
    }
  },
  sectionCard: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '25px',
    '@media (max-width: 768px)': {
      padding: '15px',
      marginBottom: '15px'
    }
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      fontSize: '18px'
    }
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2563eb'
    },
    ':disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    }
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginLeft: '10px',
    transition: 'all 0.2s'
  },
  buttonDanger: {
    padding: '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    color: '#166534',
    marginBottom: '15px'
  },
  alertError: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#dc2626',
    marginBottom: '15px'
  },
  transcriptCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    '@media (max-width: 768px)': {
      padding: '15px'
    }
  },
  transcriptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  transcriptTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '5px',
    flex: 1,
    minWidth: '200px'
  },
  transcriptMeta: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  transcriptPreview: {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5',
    marginTop: '10px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  searchContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '10px'
    }
  },
  searchInput: {
    flex: '2',
    minWidth: '200px'
  },
  filterSelect: {
    flex: '1',
    minWidth: '120px'
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '8px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  paginationButton: {
    padding: '8px 12px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
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
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '30px',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280'
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '20px',
    gap: '5px'
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s'
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6'
  },
  responsiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  }
};

// Add CSS animation keyframes
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .snowai-responsive-hide {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default function VideoTranscription() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // State management
    const [activeTab, setActiveTab] = useState('extract');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // Extract transcript form state
    const [extractForm, setExtractForm] = useState({
        youtube_url: '',
        speaker_name: '',
        country_code: '',
        country_name: '',
        category: 'central_bank'
    });
    
    // Saved transcripts state
    const [savedTranscripts, setSavedTranscripts] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        search: '',
        category: '',
        country: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_items: 0
    });
    
    // Modal state
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Load saved transcripts on component mount and tab change
    useEffect(() => {
        if (activeTab === 'saved') {
            loadSnowAISavedTranscriptsData();
        }
    }, [activeTab, searchFilters, pagination.current_page]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const loadSnowAISavedTranscriptsData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.current_page.toString(),
                per_page: '10',
                ...searchFilters
            });
            
            const response = await fetch(`${baseUrl}/snowai_get_all_saved_transcripts?${params}`);
            const data = await response.json();
            
            if (response.ok) {
                setSavedTranscripts(data.transcripts);
                setPagination(data.pagination);
            } else {
                setError(data.error || 'Failed to load transcripts');
            }
        } catch (err) {
            setError('Network error loading transcripts');
        } finally {
            setLoading(false);
        }
    };

    const handleSnowAIExtractTranscriptSubmission = async (e) => {
        e.preventDefault();
        if (!extractForm.youtube_url.trim()) {
            setError('YouTube URL is required');
            return;
        }
        
        setLoading(true);
        setError('');
        setMessage('');
        
        try {
            const response = await fetch(`${baseUrl}/snowai_extract_youtube_transcript_from_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(extractForm)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage(data.existing ? 
                    'Transcript already exists in database' : 
                    `Transcript extracted successfully! Word count: ${data.word_count}`
                );
                if (!data.existing) {
                    setExtractForm({
                        youtube_url: '',
                        speaker_name: '',
                        country_code: '',
                        country_name: '',
                        category: 'central_bank'
                    });
                }
            } else {
                setError(data.error || 'Failed to extract transcript');
            }
        } catch (err) {
            setError('Network error extracting transcript');
        } finally {
            setLoading(false);
        }
    };

    const handleSnowAIDeleteTranscriptAction = async (transcriptId) => {
        if (!confirm('Are you sure you want to delete this transcript?')) {
            return;
        }
        
        try {
            const response = await fetch(`${baseUrl}/snowai_delete_transcript_record/${transcriptId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage('Transcript deleted successfully');
                loadSnowAISavedTranscriptsData();
            } else {
                setError(data.error || 'Failed to delete transcript');
            }
        } catch (err) {
            setError('Network error deleting transcript');
        }
    };

    const handleSnowAIViewTranscriptDetails = async (transcriptId) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/snowai_get_single_transcript_details/${transcriptId}`);
            const data = await response.json();
            
            if (response.ok) {
                setSelectedTranscript(data);
                setShowModal(true);
            } else {
                setError(data.error || 'Failed to load transcript details');
            }
        } catch (err) {
            setError('Network error loading transcript details');
        } finally {
            setLoading(false);
        }
    };

    const handleSnowAISearchFilterChange = (key, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setPagination(prev => ({
            ...prev,
            current_page: 1
        }));
    };

    const handleSnowAIPaginationChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            current_page: newPage
        }));
    };

    const formatSnowAIDuration = (seconds) => {
        if (!seconds) return 'Unknown';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatSnowAIDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
                    <div className="header">
                        <Header />
                    </div>
                    <div className="main-page-body">
                        <SideNavs />
                        <div className="main-body-info">
        <div style={snowaiTranscriptionStyles.mainContainer}>
            <div className="header">
                {/* Your existing Header component */}
            </div>
            <div style={snowaiTranscriptionStyles.mainPageBody}>
                {/* Your existing SideNavs component */}
                <div style={snowaiTranscriptionStyles.mainBodyInfo}>
                    <h5 style={snowaiTranscriptionStyles.headerTitle}>
                        SnowAI Video Transcription System
                    </h5>

                    {/* Tab Navigation */}
                    <div style={snowaiTranscriptionStyles.tabContainer}>
                        <button
                            style={{
                                ...snowaiTranscriptionStyles.tab,
                                ...(activeTab === 'extract' ? snowaiTranscriptionStyles.activeTab : {})
                            }}
                            onClick={() => setActiveTab('extract')}
                        >
                            📹 Extract Transcript
                        </button>
                        <button
                            style={{
                                ...snowaiTranscriptionStyles.tab,
                                ...(activeTab === 'saved' ? snowaiTranscriptionStyles.activeTab : {})
                            }}
                            onClick={() => setActiveTab('saved')}
                        >
                            📋 Saved Transcripts ({pagination.total_items})
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {message && (
                        <div style={snowaiTranscriptionStyles.alertSuccess}>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div style={snowaiTranscriptionStyles.alertError}>
                            {error}
                        </div>
                    )}

                    {/* Extract Transcript Tab */}
                    {activeTab === 'extract' && (
                        <div style={snowaiTranscriptionStyles.sectionCard}>
                            <h3 style={snowaiTranscriptionStyles.sectionTitle}>
                                🎯 Extract YouTube Video Transcript
                            </h3>
                            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                                Submit a YouTube URL to automatically extract and save the video transcript. 
                                Perfect for capturing central bank speeches, government addresses, and corporate announcements.
                            </p>

                            <form onSubmit={handleSnowAIExtractTranscriptSubmission}>
                                <div style={snowaiTranscriptionStyles.inputGroup}>
                                    <label style={snowaiTranscriptionStyles.label}>
                                        YouTube URL *
                                    </label>
                                    <input
                                        type="url"
                                        style={snowaiTranscriptionStyles.input}
                                        value={extractForm.youtube_url}
                                        onChange={(e) => setExtractForm(prev => ({
                                            ...prev,
                                            youtube_url: e.target.value
                                        }))}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        required
                                    />
                                </div>

                                <div style={snowaiTranscriptionStyles.responsiveGrid}>
                                    <div style={snowaiTranscriptionStyles.inputGroup}>
                                        <label style={snowaiTranscriptionStyles.label}>
                                            Speaker Name
                                        </label>
                                        <input
                                            type="text"
                                            style={snowaiTranscriptionStyles.input}
                                            value={extractForm.speaker_name}
                                            onChange={(e) => setExtractForm(prev => ({
                                                ...prev,
                                                speaker_name: e.target.value
                                            }))}
                                            placeholder="e.g., Jerome Powell"
                                        />
                                    </div>

                                    <div style={snowaiTranscriptionStyles.inputGroup}>
                                        <label style={snowaiTranscriptionStyles.label}>
                                            Country Code
                                        </label>
                                        <input
                                            type="text"
                                            style={snowaiTranscriptionStyles.input}
                                            value={extractForm.country_code}
                                            onChange={(e) => setExtractForm(prev => ({
                                                ...prev,
                                                country_code: e.target.value
                                            }))}
                                            placeholder="e.g., US, GB, EU"
                                            maxLength="10"
                                        />
                                    </div>
                                </div>

                                <div style={snowaiTranscriptionStyles.responsiveGrid}>
                                    <div style={snowaiTranscriptionStyles.inputGroup}>
                                        <label style={snowaiTranscriptionStyles.label}>
                                            Country Name
                                        </label>
                                        <input
                                            type="text"
                                            style={snowaiTranscriptionStyles.input}
                                            value={extractForm.country_name}
                                            onChange={(e) => setExtractForm(prev => ({
                                                ...prev,
                                                country_name: e.target.value
                                            }))}
                                            placeholder="e.g., United States"
                                        />
                                    </div>

                                    <div style={snowaiTranscriptionStyles.inputGroup}>
                                        <label style={snowaiTranscriptionStyles.label}>
                                            Content Category
                                        </label>
                                        <select
                                            style={snowaiTranscriptionStyles.select}
                                            value={extractForm.category}
                                            onChange={(e) => setExtractForm(prev => ({
                                                ...prev,
                                                category: e.target.value
                                            }))}
                                        >
                                            <option value="central_bank">Central Bank</option>
                                            <option value="government">Government</option>
                                            <option value="corporate">Corporate</option>
                                            <option value="academic">Academic</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={snowaiTranscriptionStyles.button}
                                    disabled={loading}
                                >
                                    {loading && <span style={snowaiTranscriptionStyles.loadingSpinner}></span>}
                                    {loading ? 'Extracting Transcript...' : '🚀 Extract & Save Transcript'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Saved Transcripts Tab */}
                    {activeTab === 'saved' && (
                        <>
                            {/* Search and Filter Section */}
                            <div style={snowaiTranscriptionStyles.sectionCard}>
                                <h3 style={snowaiTranscriptionStyles.sectionTitle}>
                                    🔍 Search & Filter Transcripts
                                </h3>
                                
                                <div style={snowaiTranscriptionStyles.searchContainer}>
                                    <div style={snowaiTranscriptionStyles.searchInput}>
                                        <input
                                            type="text"
                                            style={snowaiTranscriptionStyles.input}
                                            placeholder="Search transcripts, speakers, or content..."
                                            value={searchFilters.search}
                                            onChange={(e) => handleSnowAISearchFilterChange('search', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div style={snowaiTranscriptionStyles.filterSelect}>
                                        <select
                                            style={snowaiTranscriptionStyles.select}
                                            value={searchFilters.category}
                                            onChange={(e) => handleSnowAISearchFilterChange('category', e.target.value)}
                                        >
                                            <option value="">All Categories</option>
                                            <option value="central_bank">Central Bank</option>
                                            <option value="government">Government</option>
                                            <option value="corporate">Corporate</option>
                                            <option value="academic">Academic</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    
                                    <div style={snowaiTranscriptionStyles.filterSelect}>
                                        <input
                                            type="text"
                                            style={snowaiTranscriptionStyles.input}
                                            placeholder="Country filter..."
                                            value={searchFilters.country}
                                            onChange={(e) => handleSnowAISearchFilterChange('country', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Transcripts List */}
                            <div style={snowaiTranscriptionStyles.sectionCard}>
                                <h3 style={snowaiTranscriptionStyles.sectionTitle}>
                                    📚 Transcript Archive ({pagination.total_items} total)
                                </h3>

                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <span style={snowaiTranscriptionStyles.loadingSpinner}></span>
                                        Loading transcripts...
                                    </div>
                                ) : savedTranscripts.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                        No transcripts found. Try adjusting your search filters or extract a new transcript.
                                    </div>
                                ) : (
                                    <>
                                        {savedTranscripts.map((transcript) => (
                                            <div key={transcript.id} style={snowaiTranscriptionStyles.transcriptCard}>
                                                <div style={snowaiTranscriptionStyles.transcriptHeader}>
                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={snowaiTranscriptionStyles.transcriptTitle}>
                                                            {transcript.video_title || 'Untitled Video'}
                                                        </h4>
                                                        <div style={snowaiTranscriptionStyles.transcriptMeta}>
                                                            {transcript.speaker_name && (
                                                                <span>🎤 {transcript.speaker_name} • </span>
                                                            )}
                                                            {transcript.country && (
                                                                <span>🌍 {transcript.country} • </span>
                                                            )}
                                                            <span>📁 {transcript.category || 'Uncategorized'} • </span>
                                                            <span>📊 {transcript.word_count} words • </span>
                                                            <span>⏱️ {formatSnowAIDuration(transcript.duration_seconds)} • </span>
                                                            <span>📅 {formatSnowAIDate(transcript.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={snowaiTranscriptionStyles.buttonGroup}>
                                                        <button
                                                            style={{...snowaiTranscriptionStyles.button, padding: '6px 12px', fontSize: '12px'}}
                                                            onClick={() => handleSnowAIViewTranscriptDetails(transcript.id)}
                                                        >
                                                            👁️ View
                                                        </button>
                                                        <button
                                                            style={snowaiTranscriptionStyles.buttonDanger}
                                                            onClick={() => handleSnowAIDeleteTranscriptAction(transcript.id)}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div style={snowaiTranscriptionStyles.transcriptPreview}>
                                                    {transcript.transcript_preview}
                                                </div>
                                                
                                                {transcript.youtube_url && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <a 
                                                            href={transcript.youtube_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            style={{ 
                                                                color: '#3b82f6', 
                                                                fontSize: '12px', 
                                                                textDecoration: 'none' 
                                                            }}
                                                        >
                                                            🔗 Watch on YouTube
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Pagination */}
                                        {pagination.total_pages > 1 && (
                                            <div style={snowaiTranscriptionStyles.pagination}>
                                                <button
                                                    style={snowaiTranscriptionStyles.paginationButton}
                                                    disabled={!pagination.has_previous}
                                                    onClick={() => handleSnowAIPaginationChange(pagination.current_page - 1)}
                                                >
                                                    ← Previous
                                                </button>
                                                
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Page {pagination.current_page} of {pagination.total_pages}
                                                </span>
                                                
                                                <button
                                                    style={snowaiTranscriptionStyles.paginationButton}
                                                    disabled={!pagination.has_next}
                                                    onClick={() => handleSnowAIPaginationChange(pagination.current_page + 1)}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* Transcript Detail Modal */}
                    {showModal && selectedTranscript && (
                        <div style={snowaiTranscriptionStyles.modal}>
                            <div style={snowaiTranscriptionStyles.modalContent}>
                                <button
                                    style={snowaiTranscriptionStyles.closeButton}
                                    onClick={() => setShowModal(false)}
                                >
                                    ✕
                                </button>
                                
                                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    {selectedTranscript.video_title || 'Transcript Details'}
                                </h2>
                                
                                <div style={snowaiTranscriptionStyles.responsiveGrid}>
                                    <div>
                                        <strong>Speaker:</strong> {selectedTranscript.speaker_name || 'Unknown'}
                                    </div>
                                    <div>
                                        <strong>Country:</strong> {selectedTranscript.country_name || 'Unknown'}
                                    </div>
                                    <div>
                                        <strong>Category:</strong> {selectedTranscript.category || 'Uncategorized'}
                                    </div>
                                    <div>
                                        <strong>Duration:</strong> {formatSnowAIDuration(selectedTranscript.duration_seconds)}
                                    </div>
                                    <div>
                                        <strong>Word Count:</strong> {selectedTranscript.word_count}
                                    </div>
                                    <div>
                                        <strong>Created:</strong> {formatSnowAIDate(selectedTranscript.created_at)}
                                    </div>
                                </div>
                                
                                {selectedTranscript.youtube_url && (
                                    <div style={{ margin: '20px 0' }}>
                                        <a 
                                            href={selectedTranscript.youtube_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={snowaiTranscriptionStyles.button}
                                        >
                                            🎥 Watch on YouTube
                                        </a>
                                    </div>
                                )}
                                
                                <div style={{ marginTop: '20px' }}>
                                    <label style={snowaiTranscriptionStyles.label}>
                                        Full Transcript:
                                    </label>
                                    <textarea
                                        style={{
                                            ...snowaiTranscriptionStyles.textarea,
                                            minHeight: '300px',
                                            fontSize: '13px',
                                            lineHeight: '1.6'
                                        }}
                                        value={selectedTranscript.full_transcript}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
}