import React, { useEffect, useState } from "react";
import YouTube from 'react-youtube';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';


// Inline styles for the component
const snowaiTranscriptionStyles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  mainPageBody: {
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
  },
  headerTitle: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '30px',
    borderBottom: '3px solid #3b82f6',
    paddingBottom: '10px',
  },
  sectionCard: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
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
  buttonSmall: {
    padding: '6px 12px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '500',
    marginLeft: '8px'
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
  alertWarning: {
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    border: '1px solid #fde68a',
    borderRadius: '6px',
    color: '#92400e',
    marginBottom: '15px'
  },
  cookieSection: {
    backgroundColor: '#fef7f0',
    border: '1px solid #fed7aa',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  collapsibleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    marginBottom: '15px'
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
  transcriptCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
  },
  searchInput: {
    flex: '2',
    minWidth: '200px'
  },
  filterSelect: {
    flex: '1',
    minWidth: '120px'
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
  },
  videoPlayerSection: {
    backgroundColor: '#000',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#000'
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
};

// Add CSS animation keyframes and mobile styles
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
    
    .video-wrapper-mobile {
      padding-bottom: 85% !important;
    }
  }
  
  @media (min-width: 769px) {
    .video-wrapper-mobile {
      padding-bottom: 45% !important;
    }
  }
`;
if (!document.head.querySelector('style[data-snowai]')) {
  styleSheet.setAttribute('data-snowai', 'true');
  document.head.appendChild(styleSheet);
}

export default function VideoTranscription() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    // State management
    const [activeTab, setActiveTab] = useState('extract');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showCookieSection, setShowCookieSection] = useState(false);
    
    // Video player state
    const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [currentVideoId, setCurrentVideoId] = useState('');
    const [player, setPlayer] = useState(null);
    const [videoPlatform, setVideoPlatform] = useState('youtube'); // 'youtube' or 'bilibili'
    
    // Extract transcript form state
    const [extractForm, setExtractForm] = useState({
        youtube_url: '',
        speaker_name: '',
        country_code: '',
        country_name: '',
        category: 'central_bank',
        cookies: ''
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

    // Extract video ID from YouTube URL
    const extractVideoId = (url) => {
        if (!url) return '';
        
        // Handle direct video ID
        if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
            return url;
        }
        
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return '';
    };

    // Extract Bilibili video info from URL
    const extractBilibiliInfo = (url) => {
        if (!url) return null;
        
        // Handle bilibili.tv format (international version with numeric ID)
        const bilitvMatch = url.match(/bilibili\.tv\/(?:en\/)?video\/(\d+)/);
        if (bilitvMatch && bilitvMatch[1]) {
            return { tvid: bilitvMatch[1], type: 'tv' };
        }
        
        // Handle BV ID (preferred format for bilibili.com)
        const bvMatch = url.match(/(?:bilibili\.com\/video\/)?(BV[a-zA-Z0-9]+)/);
        if (bvMatch && bvMatch[1]) {
            return { bvid: bvMatch[1], type: 'bv' };
        }
        
        // Handle AV ID format
        const avMatch = url.match(/(?:bilibili\.com\/video\/)?av(\d+)/i);
        if (avMatch && avMatch[1]) {
            return { aid: avMatch[1], type: 'av' };
        }
        
        // Handle direct BV or AV ID
        if (url.startsWith('BV') && url.length >= 10) {
            return { bvid: url, type: 'bv' };
        }
        if (/^\d+$/.test(url) && url.length > 5) {
            // Assume long numeric IDs are bilibili.tv IDs
            return { tvid: url, type: 'tv' };
        }
        
        return null;
    };

    // Detect platform from URL
    const detectPlatform = (url) => {
        if (!url) return 'youtube';
        
        if (url.includes('bilibili.com') || url.includes('bilibili.tv') || url.startsWith('BV') || url.startsWith('av')) {
            return 'bilibili';
        }
        
        return 'youtube';
    };

    const handleOpenVideoPlayer = () => {
        setShowVideoPlayerModal(true);
        setVideoUrl('');
        setCurrentVideoId('');
        setVideoPlatform('youtube');
    };

    const handleLoadVideo = () => {
        const platform = detectPlatform(videoUrl);
        setVideoPlatform(platform);
        
        if (platform === 'youtube') {
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                setCurrentVideoId(videoId);
                setError('');
            } else {
                setError('Invalid YouTube URL or Video ID');
                setCurrentVideoId('');
            }
        } else if (platform === 'bilibili') {
            const bilibiliInfo = extractBilibiliInfo(videoUrl);
            if (bilibiliInfo) {
                // Check if it's bilibili.tv (international version)
                if (bilibiliInfo.type === 'tv') {
                    // Open in new tab instead of embedding
                    const bilitvUrl = `https://www.bilibili.tv/en/video/${bilibiliInfo.tvid}`;
                    window.open(bilitvUrl, '_blank');
                    setMessage('Bilibili.tv videos cannot be embedded. Opening in new tab...');
                    setCurrentVideoId('');
                } else {
                    // bilibili.com videos can be embedded
                    setCurrentVideoId(JSON.stringify(bilibiliInfo));
                    setError('');
                }
            } else {
                setError('Invalid Bilibili URL or Video ID. Use format: BV1xx411c7XD or https://bilibili.com/video/BV...');
                setCurrentVideoId('');
            }
        }
    };

    const handlePlayTranscriptVideo = (url) => {
        const platform = detectPlatform(url);
        setVideoPlatform(platform);
        
        if (platform === 'youtube') {
            const videoId = extractVideoId(url);
            if (videoId) {
                setVideoUrl(url);
                setCurrentVideoId(videoId);
                setShowVideoPlayerModal(true);
            }
        } else if (platform === 'bilibili') {
            const bilibiliInfo = extractBilibiliInfo(url);
            if (bilibiliInfo) {
                setVideoUrl(url);
                setCurrentVideoId(JSON.stringify(bilibiliInfo));
                setShowVideoPlayerModal(true);
            }
        }
    };

    const onPlayerReady = (event) => {
        setPlayer(event.target);
    };

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
            const payload = { ...extractForm };
            
            // Parse cookies if provided
            if (extractForm.cookies.trim()) {
                try {
                    // Try to parse as JSON first
                    const cookiesObject = JSON.parse(extractForm.cookies);
                    payload.cookies = cookiesObject;
                } catch (jsonError) {
                    // If not JSON, try to parse as cookie string format
                    const cookiesObject = {};
                    const cookiePairs = extractForm.cookies.split(';');
                    
                    for (const pair of cookiePairs) {
                        const [name, value] = pair.split('=').map(s => s.trim());
                        if (name && value) {
                            cookiesObject[name] = value;
                        }
                    }
                    
                    if (Object.keys(cookiesObject).length > 0) {
                        payload.cookies = cookiesObject;
                    } else {
                        setError('Invalid cookie format. Use JSON format or name=value; pairs');
                        setLoading(false);
                        return;
                    }
                }
            }
            
            const response = await fetch(`${baseUrl}/snowai_extract_youtube_transcript_from_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
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
                        category: 'central_bank',
                        cookies: ''
                    });
                }
            } else {
                if (data.needs_cookies) {
                    setError(data.error);
                    setShowCookieSection(true);
                } else {
                    setError(data.error || 'Failed to extract transcript');
                }
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

    const handleCookieHelp = () => {
        setShowCookieSection(!showCookieSection);
    };

    const sampleCookieData = () => {
        setExtractForm(prev => ({
            ...prev,
            cookies: JSON.stringify({
                "session_token": "your_session_token_here",
                "VISITOR_INFO1_LIVE": "your_visitor_info_here",
                "__Secure-3PSID": "your_secure_psid_here"
            }, null, 2)
        }));
    };

    const youtubeOpts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body" style={snowaiTranscriptionStyles.mainPageBody}>
                <SideNavs />
                <div className="main-body-info" style={snowaiTranscriptionStyles.mainBodyInfo}>
                    <h5 style={snowaiTranscriptionStyles.headerTitle}>
                        SnowAI Video Transcription System
                    </h5>

                    {/* Video Player Button */}
                    <div style={{ marginBottom: '20px' }}>
                        <button
                            style={{...snowaiTranscriptionStyles.button, backgroundColor: '#8b5cf6'}}
                            onClick={handleOpenVideoPlayer}
                        >
                            🎬 Open YouTube Video Player
                        </button>
                    </div>

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
                        <>
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

                            {/* Cookie Section */}
                            <div style={snowaiTranscriptionStyles.cookieSection}>
                                <div 
                                    style={snowaiTranscriptionStyles.collapsibleHeader}
                                    onClick={handleCookieHelp}
                                >
                                    <h4 style={{ margin: 0, color: '#92400e' }}>
                                        🍪 YouTube Authentication (Optional)
                                    </h4>
                                    <span>{showCookieSection ? '▼' : '▶'}</span>
                                </div>

                                {showCookieSection && (
                                    <>
                                        <div style={snowaiTranscriptionStyles.alertWarning}>
                                            <strong>When do you need cookies?</strong><br/>
                                            If you see "Sign in to confirm you're not a bot" errors, YouTube requires authentication cookies to bypass bot detection.
                                        </div>

                                        <div style={snowaiTranscriptionStyles.inputGroup}>
                                            <label style={snowaiTranscriptionStyles.label}>
                                                YouTube Cookies (JSON format or name=value pairs)
                                                <button
                                                    type="button"
                                                    style={snowaiTranscriptionStyles.buttonSmall}
                                                    onClick={sampleCookieData}
                                                >
                                                    Sample Format
                                                </button>
                                            </label>
                                            <textarea
                                                style={{
                                                    ...snowaiTranscriptionStyles.textarea,
                                                    minHeight: '100px',
                                                    fontSize: '12px',
                                                    fontFamily: 'monospace'
                                                }}
                                                value={extractForm.cookies}
                                                onChange={(e) => setExtractForm(prev => ({
                                                    ...prev,
                                                    cookies: e.target.value
                                                }))}
                                                placeholder='{"session_token": "value", "VISITOR_INFO1_LIVE": "value"} or session_token=value; VISITOR_INFO1_LIVE=value'
                                            />
                                        </div>

                                        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
                                            <strong>How to get YouTube cookies:</strong><br/>
                                            1. Open YouTube in your browser and sign in<br/>
                                            2. Open Developer Tools (F12) → Network tab<br/>
                                            3. Refresh the page and find any YouTube request<br/>
                                            4. Copy cookie values like session_token, VISITOR_INFO1_LIVE, __Secure-3PSID<br/>
                                            5. Paste them above in JSON format or as name=value pairs
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
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
                                                        {transcript.youtube_url && (
                                                            <button
                                                                style={{...snowaiTranscriptionStyles.button, padding: '6px 12px', fontSize: '12px', backgroundColor: '#8b5cf6'}}
                                                                onClick={() => handlePlayTranscriptVideo(transcript.youtube_url)}
                                                            >
                                                                ▶️ Play
                                                            </button>
                                                        )}
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

                    {/* Video Player Modal */}
                    {showVideoPlayerModal && (
                        <div style={snowaiTranscriptionStyles.modal}>
                            <div style={{...snowaiTranscriptionStyles.modalContent, maxWidth: '1400px', width: '95%'}}>
                                <button
                                    style={snowaiTranscriptionStyles.closeButton}
                                    onClick={() => setShowVideoPlayerModal(false)}
                                >
                                    ✕
                                </button>
                                
                                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                                    🎬 YouTube Video Player
                                </h2>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={snowaiTranscriptionStyles.inputGroup}>
                                        <label style={snowaiTranscriptionStyles.label}>
                                            YouTube or Bilibili URL / Video ID
                                        </label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <input
                                                type="text"
                                                style={{...snowaiTranscriptionStyles.input, flex: 1, minWidth: '250px'}}
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="YouTube: https://youtube.com/watch?v=... | Bilibili: https://bilibili.com/video/BV..."
                                            />
                                            <button
                                                style={snowaiTranscriptionStyles.button}
                                                onClick={handleLoadVideo}
                                            >
                                                Load Video
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                                            Supports: YouTube URLs/IDs • Bilibili URLs (BV/AV format)
                                        </div>
                                    </div>
                                </div>

                                {currentVideoId ? (
                                    videoPlatform === 'youtube' ? (
                                        <div style={snowaiTranscriptionStyles.videoWrapper} className="video-wrapper-mobile">
                                            <YouTube
                                                videoId={currentVideoId}
                                                opts={youtubeOpts}
                                                onReady={onPlayerReady}
                                                style={snowaiTranscriptionStyles.videoIframe}
                                            />
                                        </div>
                                    ) : JSON.parse(currentVideoId).type === 'tv' ? (
                                        <div style={{
                                            ...snowaiTranscriptionStyles.videoPlayerSection,
                                            minHeight: '400px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            padding: '40px'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '64px', marginBottom: '20px' }}>🚫</p>
                                                <h3 style={{ marginBottom: '15px', color: '#fff' }}>Bilibili.tv Cannot Be Embedded</h3>
                                                <p style={{ marginBottom: '20px', color: '#d1d5db', maxWidth: '500px' }}>
                                                    Due to platform restrictions, bilibili.tv videos cannot be embedded. 
                                                    Please use bilibili.com videos (BV/AV format) instead, or watch directly on Bilibili.tv.
                                                </p>
                                                <a
                                                    href={`https://www.bilibili.tv/en/video/${JSON.parse(currentVideoId).tvid}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        ...snowaiTranscriptionStyles.button,
                                                        backgroundColor: '#00a1d6',
                                                        display: 'inline-block',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    🔗 Watch on Bilibili.tv
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={snowaiTranscriptionStyles.videoWrapper} className="video-wrapper-mobile">
                                            <iframe
                                                src={`https://player.bilibili.com/player.html?${
                                                    JSON.parse(currentVideoId).type === 'bv' 
                                                        ? `bvid=${JSON.parse(currentVideoId).bvid}` 
                                                        : `aid=${JSON.parse(currentVideoId).aid}`
                                                }&page=1&high_quality=1&danmaku=0`}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none'
                                                }}
                                                scrolling="no"
                                                allowFullScreen={true}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div style={{
                                        ...snowaiTranscriptionStyles.videoPlayerSection,
                                        minHeight: '400px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9ca3af'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '48px', marginBottom: '10px' }}>📺</p>
                                            <p>Enter a YouTube or Bilibili URL/ID to start watching</p>
                                            <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
                                                <p style={{ margin: '5px 0' }}><strong>YouTube:</strong> https://youtube.com/watch?v=dQw4w9WgXcQ</p>
                                                <p style={{ margin: '5px 0' }}><strong>Bilibili (CN):</strong> https://bilibili.com/video/BV1xx411c7XD</p>
                                                <p style={{ margin: '5px 0' }}><strong>Bilibili (International):</strong> https://bilibili.tv/en/video/4786992439237120</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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
                                    <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{...snowaiTranscriptionStyles.button, backgroundColor: '#8b5cf6'}}
                                            onClick={() => {
                                                handlePlayTranscriptVideo(selectedTranscript.youtube_url);
                                                setShowModal(false);
                                            }}
                                        >
                                            ▶️ Play Video
                                        </button>
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
    );
}