import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function SnowAIMoments() {
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [moments, setMoments] = useState([]);
    const [filteredMoments, setFilteredMoments] = useState([]);
    const [collages, setCollages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid'); // 'grid', 'create', 'collage', 'detail'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedMoments, setSelectedMoments] = useState([]);
    const [stats, setStats] = useState(null);
    const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video', 'favorites'
    const [detailMoment, setDetailMoment] = useState(null);
    
    // Create moment state
    const [newMoment, setNewMoment] = useState({
        title: '',
        description: '',
        event_name: '',
        location: '',
        tags: '',
        media_type: 'image'
    });
    const [capturedMedia, setCapturedMedia] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // Collage state
    const [collageTitle, setCollageTitle] = useState('');
    const [collageAudio, setCollageAudio] = useState(null);
    const [generatingCollage, setGeneratingCollage] = useState(false);

    useEffect(() => {
        loadMoments();
        loadStats();
        loadCollages();
    }, []);

    useEffect(() => {
        filterMoments();
    }, [moments, searchQuery, selectedEvent, filterType]);

    const loadMoments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/snowai/moments/list/?page_size=100`);
            const data = await response.json();
            if (data.success) {
                setMoments(data.moments);
            }
        } catch (error) {
            console.error('Error loading moments:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai/stats/`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadCollages = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai/collages/list/`);
            const data = await response.json();
            if (data.success) {
                setCollages(data.collages);
            }
        } catch (error) {
            console.error('Error loading collages:', error);
        }
    };

    const filterMoments = () => {
        let filtered = [...moments];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(m => 
                m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Event filter
        if (selectedEvent) {
            filtered = filtered.filter(m => m.event_name === selectedEvent);
        }

        // Type filter
        if (filterType === 'favorites') {
            filtered = filtered.filter(m => m.is_favorite);
        } else if (filterType !== 'all') {
            filtered = filtered.filter(m => m.media_type === filterType);
        }

        setFilteredMoments(filtered);
    };

    const startCamera = async () => {
        try {
            setIsCapturing(true);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: false 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please check permissions.');
            setIsCapturing(false);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedMedia(imageData);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedMedia(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const createMoment = async () => {
        if (!newMoment.title || !capturedMedia) {
            alert('Please add a title and capture/upload media');
            return;
        }

        try {
            const payload = {
                ...newMoment,
                image_data: capturedMedia,
                moment_date: new Date().toISOString(),
                file_size_kb: Math.round(capturedMedia.length / 1024)
            };

            const response = await fetch(`${baseUrl}/snowai/moments/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                alert('Moment created successfully! 🎉');
                setNewMoment({
                    title: '',
                    description: '',
                    event_name: '',
                    location: '',
                    tags: '',
                    media_type: 'image'
                });
                setCapturedMedia(null);
                setView('grid');
                loadMoments();
                loadStats();
            }
        } catch (error) {
            console.error('Error creating moment:', error);
            alert('Failed to create moment');
        }
    };

    const toggleFavorite = async (momentUuid, currentStatus) => {
        try {
            const response = await fetch(`${baseUrl}/snowai/moments/${momentUuid}/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_favorite: !currentStatus })
            });

            const data = await response.json();
            if (data.success) {
                loadMoments();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const deleteMoment = async (momentUuid) => {
        if (!window.confirm('Are you sure you want to delete this moment?')) return;

        try {
            const response = await fetch(`${baseUrl}/snowai/moments/${momentUuid}/delete/`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                loadMoments();
                loadStats();
                setView('grid');
            }
        } catch (error) {
            console.error('Error deleting moment:', error);
        }
    };

    const toggleSelectMoment = (momentUuid) => {
        setSelectedMoments(prev => 
            prev.includes(momentUuid) 
                ? prev.filter(id => id !== momentUuid)
                : [...prev, momentUuid]
        );
    };

    const generateCollage = async () => {
        if (selectedMoments.length === 0) {
            alert('Please select at least one moment for the collage');
            return;
        }

        setGeneratingCollage(true);

        try {
            // Create a simple collage by combining images
            const selectedMomentObjects = moments.filter(m => selectedMoments.includes(m.uuid));
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 800;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#e8f4f8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.fillStyle = '#1a5f7a';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(collageTitle || 'My Moments', canvas.width / 2, 60);

            // Draw images in grid
            const gridSize = Math.ceil(Math.sqrt(selectedMomentObjects.length));
            const cellWidth = (canvas.width - 100) / gridSize;
            const cellHeight = (canvas.height - 150) / gridSize;

            let row = 0, col = 0;
            for (const moment of selectedMomentObjects) {
                if (moment.image_data) {
                    const img = new Image();
                    await new Promise((resolve) => {
                        img.onload = () => {
                            const x = 50 + col * cellWidth;
                            const y = 100 + row * cellHeight;
                            
                            // Draw with rounded corners and shadow
                            ctx.save();
                            ctx.shadowColor = 'rgba(0,0,0,0.2)';
                            ctx.shadowBlur = 10;
                            ctx.shadowOffsetX = 5;
                            ctx.shadowOffsetY = 5;
                            
                            const padding = 10;
                            ctx.drawImage(img, 
                                x + padding, y + padding, 
                                cellWidth - padding * 2, cellHeight - padding * 2
                            );
                            ctx.restore();

                            col++;
                            if (col >= gridSize) {
                                col = 0;
                                row++;
                            }
                            resolve();
                        };
                        img.src = moment.image_data;
                    });
                }
            }

            const collageImageData = canvas.toDataURL('image/png');

            // Save collage
            const response = await fetch(`${baseUrl}/snowai/collages/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: collageTitle || `Collage - ${new Date().toLocaleDateString()}`,
                    moment_uuids: selectedMoments,
                    collage_image_data: collageImageData,
                    audio_data: collageAudio,
                    event_name: selectedMomentObjects[0]?.event_name || ''
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Collage created successfully! 🎨');
                
                // Download collage
                const link = document.createElement('a');
                link.download = `${collageTitle || 'collage'}.png`;
                link.href = collageImageData;
                link.click();

                setSelectedMoments([]);
                setCollageTitle('');
                setCollageAudio(null);
                loadCollages();
                setView('grid');
            }
        } catch (error) {
            console.error('Error generating collage:', error);
            alert('Failed to generate collage');
        } finally {
            setGeneratingCollage(false);
        }
    };

    const uniqueEvents = [...new Set(moments.map(m => m.event_name).filter(Boolean))];

    return (
        <div className="snowai-moments-container">
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info snowai-moments-main">
                    
                    {/* Header Section */}
                    <div className="snowai-hero">
                        <div className="snowai-hero-content">
                            <h1 className="">
                                <span className="snowai-icon">❄️</span>
                                SnowAI Moments
                            </h1>
                            <p className="snowai-subtitle">Capture. Cherish. Remember.</p>
                        </div>
                        
                        {stats && (
                            <div className="snowai-stats-row">
                                <div className="snowai-stat-card">
                                    <div className="stat-number">{stats.total_moments}</div>
                                    <div className="stat-label">Moments</div>
                                </div>
                                <div className="snowai-stat-card">
                                    <div className="stat-number">{stats.total_favorites}</div>
                                    <div className="stat-label">Favorites</div>
                                </div>
                                <div className="snowai-stat-card">
                                    <div className="stat-number">{stats.total_collages}</div>
                                    <div className="stat-label">Collages</div>
                                </div>
                                <div className="snowai-stat-card">
                                    <div className="stat-number">{stats.unique_events}</div>
                                    <div className="stat-label">Events</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="snowai-nav-tabs">
                        <button 
                            className={`snowai-tab ${view === 'grid' ? 'active' : ''}`}
                            onClick={() => setView('grid')}
                        >
                            📸 Gallery
                        </button>
                        <button 
                            className={`snowai-tab ${view === 'create' ? 'active' : ''}`}
                            onClick={() => setView('create')}
                        >
                            ✨ Create Moment
                        </button>
                        <button 
                            className={`snowai-tab ${view === 'collage' ? 'active' : ''}`}
                            onClick={() => {
                                setView('collage');
                                setSelectedMoments([]);
                            }}
                        >
                            🎨 Make Collage
                        </button>
                    </div>

                    {/* GRID VIEW */}
                    {view === 'grid' && (
                        <div className="snowai-content">
                            {/* Search and Filter Bar */}
                            <div className="snowai-search-bar">
                                <input 
                                    type="text"
                                    placeholder="🔍 Search moments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="snowai-search-input"
                                />
                                
                                <select 
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    className="snowai-select"
                                >
                                    <option value="">All Events</option>
                                    {uniqueEvents.map(event => (
                                        <option key={event} value={event}>{event}</option>
                                    ))}
                                </select>

                                <div className="snowai-filter-chips">
                                    <button 
                                        className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilterType('all')}
                                    >
                                        All
                                    </button>
                                    <button 
                                        className={`filter-chip ${filterType === 'image' ? 'active' : ''}`}
                                        onClick={() => setFilterType('image')}
                                    >
                                        📷 Photos
                                    </button>
                                    <button 
                                        className={`filter-chip ${filterType === 'video' ? 'active' : ''}`}
                                        onClick={() => setFilterType('video')}
                                    >
                                        🎥 Videos
                                    </button>
                                    <button 
                                        className={`filter-chip ${filterType === 'favorites' ? 'active' : ''}`}
                                        onClick={() => setFilterType('favorites')}
                                    >
                                        ⭐ Favorites
                                    </button>
                                </div>
                            </div>

                            {/* Moments Grid */}
                            {loading ? (
                                <div className="snowai-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Loading your moments...</p>
                                </div>
                            ) : filteredMoments.length === 0 ? (
                                <div className="snowai-empty">
                                    <div className="empty-icon">📭</div>
                                    <h3>No moments yet</h3>
                                    <p>Start capturing your memories!</p>
                                    <button 
                                        className="snowai-btn-primary"
                                        onClick={() => setView('create')}
                                    >
                                        Create Your First Moment
                                    </button>
                                </div>
                            ) : (
                                <div className="snowai-moments-grid">
                                    {filteredMoments.map(moment => (
                                        <div 
                                            key={moment.uuid} 
                                            className="snowai-moment-card"
                                            onClick={() => {
                                                setDetailMoment(moment);
                                                setView('detail');
                                            }}
                                        >
                                            <div className="moment-image-container">
                                                {moment.image_data && (
                                                    <img 
                                                        src={moment.image_data} 
                                                        alt={moment.title}
                                                        className="moment-image"
                                                    />
                                                )}
                                                <button 
                                                    className={`moment-favorite-btn ${moment.is_favorite ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(moment.uuid, moment.is_favorite);
                                                    }}
                                                >
                                                    {moment.is_favorite ? '⭐' : '☆'}
                                                </button>
                                            </div>
                                            <div className="moment-info">
                                                <h3 className="moment-title">{moment.title}</h3>
                                                {moment.event_name && (
                                                    <span className="moment-event">{moment.event_name}</span>
                                                )}
                                                <p className="moment-date">
                                                    {new Date(moment.moment_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CREATE VIEW */}
                    {view === 'create' && (
                        <div className="snowai-content">
                            <div className="snowai-create-container">
                                <h2 className="section-title">✨ Create a New Moment</h2>
                                
                                <div className="create-form">
                                    {/* Media Capture Section */}
                                    <div className="media-capture-section">
                                        {!capturedMedia && !isCapturing && (
                                            <div className="capture-options">
                                                <button 
                                                    className="capture-btn camera-btn"
                                                    onClick={startCamera}
                                                >
                                                    📸 Take Photo
                                                </button>
                                                <button 
                                                    className="capture-btn upload-btn"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    📁 Upload File
                                                </button>
                                                <input 
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    onChange={handleFileUpload}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        )}

                                        {isCapturing && (
                                            <div className="camera-view">
                                                <video 
                                                    ref={videoRef} 
                                                    autoPlay 
                                                    playsInline
                                                    className="camera-preview"
                                                />
                                                <div className="camera-controls">
                                                    <button 
                                                        className="snowai-btn-primary"
                                                        onClick={capturePhoto}
                                                    >
                                                        📸 Capture
                                                    </button>
                                                    <button 
                                                        className="snowai-btn-secondary"
                                                        onClick={stopCamera}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {capturedMedia && (
                                            <div className="captured-preview">
                                                <img 
                                                    src={capturedMedia} 
                                                    alt="Captured moment"
                                                    className="preview-image"
                                                />
                                                <button 
                                                    className="remove-media-btn"
                                                    onClick={() => setCapturedMedia(null)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}

                                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    </div>

                                    {/* Form Fields */}
                                    <div className="form-fields">
                                        <div className="form-group">
                                            <label>Title *</label>
                                            <input 
                                                type="text"
                                                value={newMoment.title}
                                                onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                                                placeholder="Give this moment a name..."
                                                className="snowai-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea 
                                                value={newMoment.description}
                                                onChange={(e) => setNewMoment({...newMoment, description: e.target.value})}
                                                placeholder="What made this moment special?"
                                                className="snowai-textarea"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Event</label>
                                                <input 
                                                    type="text"
                                                    value={newMoment.event_name}
                                                    onChange={(e) => setNewMoment({...newMoment, event_name: e.target.value})}
                                                    placeholder="Birthday, Vacation, etc."
                                                    className="snowai-input"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Location</label>
                                                <input 
                                                    type="text"
                                                    value={newMoment.location}
                                                    onChange={(e) => setNewMoment({...newMoment, location: e.target.value})}
                                                    placeholder="Where was this?"
                                                    className="snowai-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Tags</label>
                                            <input 
                                                type="text"
                                                value={newMoment.tags}
                                                onChange={(e) => setNewMoment({...newMoment, tags: e.target.value})}
                                                placeholder="family, friends, adventure (comma-separated)"
                                                className="snowai-input"
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button 
                                                className="snowai-btn-primary"
                                                onClick={createMoment}
                                                disabled={!newMoment.title || !capturedMedia}
                                            >
                                                💾 Save Moment
                                            </button>
                                            <button 
                                                className="snowai-btn-secondary"
                                                onClick={() => {
                                                    setView('grid');
                                                    setCapturedMedia(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COLLAGE VIEW */}
                    {view === 'collage' && (
                        <div className="snowai-content">
                            <div className="snowai-collage-container">
                                <h2 className="section-title">🎨 Create a Moments Collage</h2>
                                
                                <div className="collage-instructions">
                                    <p>Select moments to include in your collage, then generate a beautiful downloadable memory!</p>
                                </div>

                                <div className="collage-form">
                                    <div className="form-group">
                                        <label>Collage Title</label>
                                        <input 
                                            type="text"
                                            value={collageTitle}
                                            onChange={(e) => setCollageTitle(e.target.value)}
                                            placeholder="My Amazing Memories"
                                            className="snowai-input"
                                        />
                                    </div>
                                </div>

                                <div className="selected-count">
                                    {selectedMoments.length} moment{selectedMoments.length !== 1 ? 's' : ''} selected
                                </div>

                                <div className="snowai-moments-grid">
                                    {moments.map(moment => (
                                        <div 
                                            key={moment.uuid} 
                                            className={`snowai-moment-card selectable ${selectedMoments.includes(moment.uuid) ? 'selected' : ''}`}
                                            onClick={() => toggleSelectMoment(moment.uuid)}
                                        >
                                            <div className="moment-image-container">
                                                {moment.image_data && (
                                                    <img 
                                                        src={moment.image_data} 
                                                        alt={moment.title}
                                                        className="moment-image"
                                                    />
                                                )}
                                                {selectedMoments.includes(moment.uuid) && (
                                                    <div className="selected-overlay">
                                                        <span className="checkmark">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="moment-info">
                                                <h3 className="moment-title">{moment.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="collage-actions">
                                    <button 
                                        className="snowai-btn-primary large"
                                        onClick={generateCollage}
                                        disabled={selectedMoments.length === 0 || generatingCollage}
                                    >
                                        {generatingCollage ? '⏳ Generating...' : '🎨 Generate Collage'}
                                    </button>
                                    <button 
                                        className="snowai-btn-secondary"
                                        onClick={() => setView('grid')}
                                    >
                                        Back to Gallery
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DETAIL VIEW */}
                    {view === 'detail' && detailMoment && (
                        <div className="snowai-content">
                            <div className="snowai-detail-container">
                                <button 
                                    className="back-btn"
                                    onClick={() => setView('grid')}
                                >
                                    ← Back to Gallery
                                </button>

                                <div className="detail-content">
                                    <div className="detail-image-section">
                                        {detailMoment.image_data && (
                                            <img 
                                                src={detailMoment.image_data} 
                                                alt={detailMoment.title}
                                                className="detail-image"
                                            />
                                        )}
                                    </div>

                                    <div className="detail-info-section">
                                        <div className="detail-header">
                                            <h2>{detailMoment.title}</h2>
                                            <button 
                                                className={`detail-favorite-btn ${detailMoment.is_favorite ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(detailMoment.uuid, detailMoment.is_favorite)}
                                            >
                                                {detailMoment.is_favorite ? '⭐ Favorited' : '☆ Add to Favorites'}
                                            </button>
                                        </div>

                                        {detailMoment.description && (
                                            <p className="detail-description">{detailMoment.description}</p>
                                        )}

                                        <div className="detail-metadata">
                                            {detailMoment.event_name && (
                                                <div className="meta-item">
                                                    <span className="meta-label">Event:</span>
                                                    <span className="meta-value">{detailMoment.event_name}</span>
                                                </div>
                                            )}
                                            {detailMoment.location && (
                                                <div className="meta-item">
                                                    <span className="meta-label">Location:</span>
                                                    <span className="meta-value">{detailMoment.location}</span>
                                                </div>
                                            )}
                                            <div className="meta-item">
                                                <span className="meta-label">Date:</span>
                                                <span className="meta-value">
                                                    {new Date(detailMoment.moment_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            {detailMoment.tags && (
                                                <div className="meta-item">
                                                    <span className="meta-label">Tags:</span>
                                                    <div className="tag-list">
                                                        {detailMoment.tags.split(',').map((tag, i) => (
                                                            <span key={i} className="tag-pill">{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="detail-actions">
                                            <button 
                                                className="delete-btn"
                                                onClick={() => deleteMoment(detailMoment.uuid)}
                                            >
                                                🗑️ Delete Moment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}