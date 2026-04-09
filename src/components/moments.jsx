import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIMoments() {
    
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [moments, setMoments] = useState([]);
    const [filteredMoments, setFilteredMoments] = useState([]);
    const [slideshows, setSlideshows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedMoments, setSelectedMoments] = useState([]);
    const [stats, setStats] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [detailMoment, setDetailMoment] = useState(null);
    const [editingMoment, setEditingMoment] = useState(null);
    const [playingSlideshow, setPlayingSlideshow] = useState(null);
    
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
    
    const [slideshowTitle, setSlideshowTitle] = useState('');
    const [slideshowAudio, setSlideshowAudio] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [creatingSlideshow, setCreatingSlideshow] = useState(false);
    const audioInputRef = useRef(null);
    
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioPlayerRef = useRef(null);

    useEffect(() => {
        loadMoments();
        loadStats();
        loadSlideshows();
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

    const loadSlideshows = async () => {
        try {
            const response = await fetch(`${baseUrl}/snowai/slideshows/list/`);
            const data = await response.json();
            if (data.success) {
                setSlideshows(data.slideshows);
            }
        } catch (error) {
            console.error('Error loading slideshows:', error);
        }
    };

    const filterMoments = () => {
        let filtered = [...moments];

        if (searchQuery) {
            filtered = filtered.filter(m => 
                m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedEvent) {
            filtered = filtered.filter(m => m.event_name === selectedEvent);
        }

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
            alert('Could not access camera');
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
                if (file.type.startsWith('video/')) {
                    setNewMoment({...newMoment, media_type: 'video'});
                } else {
                    setNewMoment({...newMoment, media_type: 'image'});
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const createMoment = async () => {
        if (!newMoment.title || !capturedMedia) {
            alert('Please add a title and media');
            return;
        }

        try {
            const payload = {
                ...newMoment,
                [newMoment.media_type === 'video' ? 'video_data' : 'image_data']: capturedMedia,
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
                alert('Moment created! 🎉');
                resetMomentForm();
                setView('grid');
                loadMoments();
                loadStats();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create moment');
        }
    };

    const updateMoment = async () => {
        if (!editingMoment || !editingMoment.title) {
            alert('Please add a title');
            return;
        }

        try {
            const payload = {
                title: editingMoment.title,
                description: editingMoment.description,
                event_name: editingMoment.event_name,
                location: editingMoment.location,
                tags: editingMoment.tags,
            };

            if (capturedMedia) {
                payload[editingMoment.media_type === 'video' ? 'video_data' : 'image_data'] = capturedMedia;
            }

            const response = await fetch(`${baseUrl}/snowai/moments/${editingMoment.uuid}/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                alert('Moment updated! ✨');
                setEditingMoment(null);
                setCapturedMedia(null);
                setView('grid');
                loadMoments();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update');
        }
    };

    const resetMomentForm = () => {
        setNewMoment({
            title: '',
            description: '',
            event_name: '',
            location: '',
            tags: '',
            media_type: 'image'
        });
        setCapturedMedia(null);
    };

    const startEditMoment = (moment) => {
        setEditingMoment({...moment});
        setCapturedMedia(null);
        setView('edit');
    };

    const toggleFavorite = async (momentUuid, currentStatus) => {
        try {
            const response = await fetch(`${baseUrl}/snowai/moments/${momentUuid}/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_favorite: !currentStatus })
            });

            const data = await response.json();
            if (data.success) {
                loadMoments();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteMoment = async (momentUuid) => {
        if (!window.confirm('Delete this moment?')) return;

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
            console.error('Error:', error);
        }
    };

    const toggleSelectMoment = (momentUuid) => {
        setSelectedMoments(prev => 
            prev.includes(momentUuid) 
                ? prev.filter(id => id !== momentUuid)
                : [...prev, momentUuid]
        );
    };

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSlideshowAudio(reader.result);
                
                const audio = new Audio(reader.result);
                audio.addEventListener('loadedmetadata', () => {
                    setAudioDuration(audio.duration);
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const createSlideshow = async () => {
        if (selectedMoments.length === 0) {
            alert('Select at least one moment');
            return;
        }

        if (!slideshowAudio) {
            alert('Please upload audio');
            return;
        }

        setCreatingSlideshow(true);

        try {
            const selectedMomentObjects = moments.filter(m => selectedMoments.includes(m.uuid));

            const response = await fetch(`${baseUrl}/snowai/slideshows/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: slideshowTitle || `Slideshow - ${new Date().toLocaleDateString()}`,
                    moment_uuids: selectedMoments,
                    audio_data: slideshowAudio,
                    audio_duration_seconds: audioDuration,
                    event_name: selectedMomentObjects[0]?.event_name || ''
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Slideshow created! 🎬');
                setSelectedMoments([]);
                setSlideshowTitle('');
                setSlideshowAudio(null);
                setAudioDuration(0);
                loadSlideshows();
                loadStats();
                setView('grid');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create slideshow');
        } finally {
            setCreatingSlideshow(false);
        }
    };

    const playSlideshow = async (slideshowUuid) => {
        try {
            const response = await fetch(`${baseUrl}/snowai/slideshows/${slideshowUuid}/`);
            const data = await response.json();
            if (data.success) {
                setPlayingSlideshow(data.slideshow);
                setCurrentSlideIndex(0);
                setView('play-slideshow');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const startSlideshowPlayback = () => {
        if (!playingSlideshow) return;
        
        setIsPlaying(true);
        
        if (audioPlayerRef.current) {
            audioPlayerRef.current.play();
        }

        const totalSlides = playingSlideshow.moments.length;
        const timePerSlide = playingSlideshow.audio_duration_seconds / totalSlides;

        const interval = setInterval(() => {
            setCurrentSlideIndex(prev => {
                const next = prev + 1;
                if (next >= totalSlides) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.pause();
                        audioPlayerRef.current.currentTime = 0;
                    }
                    return 0;
                }
                return next;
            });
        }, timePerSlide * 1000);
    };

    const stopSlideshowPlayback = () => {
        setIsPlaying(false);
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
        setCurrentSlideIndex(0);
    };

    const deleteSlideshow = async (slideshowUuid) => {
        if (!window.confirm('Delete this slideshow?')) return;

        try {
            const response = await fetch(`${baseUrl}/snowai/slideshows/${slideshowUuid}/delete/`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                loadSlideshows();
                loadStats();
                if (view === 'play-slideshow') {
                    setView('grid');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const uniqueEvents = [...new Set(moments.map(m => m.event_name).filter(Boolean))];

    // Continue in next message due to length...
    return (
        <div style={styles.container}>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info" style={styles.mainContent}>
                    
                    {/* Hero */}
                    <div style={styles.hero}>
                        <div style={styles.heroContent}>
                            <h1 style={styles.title}>
                                <span>❄️</span> SnowAI Moments
                            </h1>
                            <p style={styles.subtitle}>Capture. Cherish. Remember.</p>
                        </div>
                        
                        {stats && (
                            <div style={styles.statsRow}>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{stats.total_moments}</div>
                                    <div style={styles.statLabel}>Moments</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{stats.total_favorites}</div>
                                    <div style={styles.statLabel}>Favorites</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{stats.total_slideshows}</div>
                                    <div style={styles.statLabel}>Slideshows</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statNumber}>{stats.unique_events}</div>
                                    <div style={styles.statLabel}>Events</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div style={styles.navTabs}>
                        <button 
                            style={view === 'grid' ? {...styles.tab, ...styles.tabActive} : styles.tab}
                            onClick={() => setView('grid')}
                        >
                            📸 Gallery
                        </button>
                        <button 
                            style={view === 'create' ? {...styles.tab, ...styles.tabActive} : styles.tab}
                            onClick={() => {
                                resetMomentForm();
                                setView('create');
                            }}
                        >
                            ✨ Create
                        </button>
                        <button 
                            style={view === 'slideshow' ? {...styles.tab, ...styles.tabActive} : styles.tab}
                            onClick={() => {
                                setView('slideshow');
                                setSelectedMoments([]);
                            }}
                        >
                            🎬 Slideshow
                        </button>
                    </div>

                    {/* GRID */}
                    {view === 'grid' && (
                        <div style={styles.content}>
                            <div style={styles.searchBar}>
                                <input 
                                    type="text"
                                    placeholder="🔍 Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={styles.input}
                                />
                                
                                <select 
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">All Events</option>
                                    {uniqueEvents.map(event => (
                                        <option key={event} value={event}>{event}</option>
                                    ))}
                                </select>

                                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                    {['all', 'image', 'video', 'favorites'].map(type => (
                                        <button 
                                            key={type}
                                            style={filterType === type ? {...styles.chip, ...styles.chipActive} : styles.chip}
                                            onClick={() => setFilterType(type)}
                                        >
                                            {type === 'all' ? 'All' : type === 'image' ? '📷 Photos' : type === 'video' ? '🎥 Videos' : '⭐ Favorites'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loading ? (
                                <div style={styles.loading}>
                                    <div style={styles.spinner}></div>
                                    <p>Loading...</p>
                                </div>
                            ) : filteredMoments.length === 0 ? (
                                <div style={styles.empty}>
                                    <div style={{fontSize: '5rem'}}>📭</div>
                                    <h3>No moments yet</h3>
                                    <button style={styles.btnPrimary} onClick={() => setView('create')}>
                                        Create First Moment
                                    </button>
                                </div>
                            ) : (
                                <div style={styles.grid}>
                                    {filteredMoments.map(moment => (
                                        <div 
                                            key={moment.uuid} 
                                            style={styles.card}
                                            onClick={() => {
                                                setDetailMoment(moment);
                                                setView('detail');
                                            }}
                                        >
                                            <div style={styles.cardMedia}>
                                                {moment.media_type === 'video' && moment.video_data ? (
                                                    <video 
                                                        src={moment.video_data}
                                                        style={styles.media}
                                                        muted
                                                    />
                                                ) : moment.image_data ? (
                                                    <img 
                                                        src={moment.image_data} 
                                                        alt={moment.title}
                                                        style={styles.media}
                                                    />
                                                ) : null}
                                                <button 
                                                    style={moment.is_favorite ? {...styles.fav, background: '#ffc6d3'} : styles.fav}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(moment.uuid, moment.is_favorite);
                                                    }}
                                                >
                                                    {moment.is_favorite ? '⭐' : '☆'}
                                                </button>
                                            </div>
                                            <div style={{padding: '1.25rem'}}>
                                                <h3 style={styles.cardTitle}>{moment.title}</h3>
                                                {moment.event_name && (
                                                    <span style={styles.badge}>{moment.event_name}</span>
                                                )}
                                                <p style={styles.cardDate}>
                                                    {new Date(moment.moment_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Slideshows */}
                            {slideshows.length > 0 && (
                                <div style={{marginTop: '3rem'}}>
                                    <h2 style={styles.sectionTitle}>🎬 Your Slideshows</h2>
                                    <div style={styles.grid}>
                                        {slideshows.map(slideshow => (
                                            <div key={slideshow.uuid} style={styles.card}>
                                                <div style={styles.cardMedia}>
                                                    {slideshow.preview_image && (
                                                        <img 
                                                            src={slideshow.preview_image} 
                                                            alt={slideshow.title}
                                                            style={styles.media}
                                                        />
                                                    )}
                                                    <button
                                                        style={{...styles.playBtn}}
                                                        onClick={() => playSlideshow(slideshow.uuid)}
                                                    >
                                                        ▶️ Play
                                                    </button>
                                                </div>
                                                <div style={{padding: '1.25rem'}}>
                                                    <h3 style={styles.cardTitle}>{slideshow.title}</h3>
                                                    <p style={styles.cardDate}>
                                                        {slideshow.total_moments} moments • {Math.round(slideshow.audio_duration_seconds)}s
                                                    </p>
                                                    <button
                                                        style={styles.deleteBtn}
                                                        onClick={() => deleteSlideshow(slideshow.uuid)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CREATE */}
                    {view === 'create' && (
                        <div style={styles.content}>
                            <div style={styles.formContainer}>
                                <h2 style={styles.sectionTitle}>✨ Create Moment</h2>
                                
                                <div style={styles.form}>
                                    {!capturedMedia && !isCapturing && (
                                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                                            <button style={styles.captureBtn} onClick={startCamera}>
                                                📸 Camera
                                            </button>
                                            <button style={styles.captureBtn} onClick={() => fileInputRef.current?.click()}>
                                                📁 Upload
                                            </button>
                                            <input 
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleFileUpload}
                                                style={{display: 'none'}}
                                            />
                                        </div>
                                    )}

                                    {isCapturing && (
                                        <div style={{textAlign: 'center'}}>
                                            <video 
                                                ref={videoRef} 
                                                autoPlay 
                                                playsInline
                                                style={styles.preview}
                                            />
                                            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem'}}>
                                                <button style={styles.btnPrimary} onClick={capturePhoto}>
                                                    📸 Capture
                                                </button>
                                                <button style={styles.btnSecondary} onClick={stopCamera}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {capturedMedia && (
                                        <div style={{position: 'relative', maxWidth: '500px', margin: '0 auto'}}>
                                            {newMoment.media_type === 'video' ? (
                                                <video 
                                                    src={capturedMedia}
                                                    controls
                                                    style={styles.preview}
                                                />
                                            ) : (
                                                <img 
                                                    src={capturedMedia} 
                                                    alt="Preview"
                                                    style={styles.preview}
                                                />
                                            )}
                                            <button 
                                                style={styles.removeBtn}
                                                onClick={() => setCapturedMedia(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <canvas ref={canvasRef} style={{display: 'none'}} />

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}>
                                        <input 
                                            type="text"
                                            value={newMoment.title}
                                            onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                                            placeholder="Title *"
                                            style={styles.input}
                                        />

                                        <textarea 
                                            value={newMoment.description}
                                            onChange={(e) => setNewMoment({...newMoment, description: e.target.value})}
                                            placeholder="Description"
                                            style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
                                            rows={4}
                                        />

                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                            <input 
                                                type="text"
                                                value={newMoment.event_name}
                                                onChange={(e) => setNewMoment({...newMoment, event_name: e.target.value})}
                                                placeholder="Event"
                                                style={styles.input}
                                            />

                                            <input 
                                                type="text"
                                                value={newMoment.location}
                                                onChange={(e) => setNewMoment({...newMoment, location: e.target.value})}
                                                placeholder="Location"
                                                style={styles.input}
                                            />
                                        </div>

                                        <input 
                                            type="text"
                                            value={newMoment.tags}
                                            onChange={(e) => setNewMoment({...newMoment, tags: e.target.value})}
                                            placeholder="Tags (comma-separated)"
                                            style={styles.input}
                                        />

                                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                                            <button 
                                                style={styles.btnPrimary}
                                                onClick={createMoment}
                                                disabled={!newMoment.title || !capturedMedia}
                                            >
                                                💾 Save
                                            </button>
                                            <button 
                                                style={styles.btnSecondary}
                                                onClick={() => {
                                                    setView('grid');
                                                    resetMomentForm();
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

                    {/* EDIT */}
                    {view === 'edit' && editingMoment && (
                        <div style={styles.content}>
                            <div style={styles.formContainer}>
                                <h2 style={styles.sectionTitle}>✏️ Edit Moment</h2>
                                
                                <div style={styles.form}>
                                    <p style={{fontWeight: 600, color: '#1a5f7a'}}>Current Media:</p>
                                    <div style={{marginBottom: '1rem'}}>
                                        {editingMoment.media_type === 'video' && editingMoment.video_data ? (
                                            <video 
                                                src={editingMoment.video_data}
                                                controls
                                                style={styles.preview}
                                            />
                                        ) : editingMoment.image_data ? (
                                            <img 
                                                src={editingMoment.image_data}
                                                alt={editingMoment.title}
                                                style={styles.preview}
                                            />
                                        ) : null}
                                    </div>

                                    {!capturedMedia && (
                                        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                                            <button 
                                                style={styles.captureBtn}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                📁 Upload New Media
                                            </button>
                                            <input 
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleFileUpload}
                                                style={{display: 'none'}}
                                            />
                                        </div>
                                    )}

                                    {capturedMedia && (
                                        <div style={{position: 'relative', maxWidth: '500px', margin: '0 auto 1rem'}}>
                                            <p style={{fontWeight: 600, color: '#1a5f7a'}}>New Media:</p>
                                            {editingMoment.media_type === 'video' ? (
                                                <video 
                                                    src={capturedMedia}
                                                    controls
                                                    style={styles.preview}
                                                />
                                            ) : (
                                                <img 
                                                    src={capturedMedia} 
                                                    alt="New"
                                                    style={styles.preview}
                                                />
                                            )}
                                            <button 
                                                style={styles.removeBtn}
                                                onClick={() => setCapturedMedia(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                        <input 
                                            type="text"
                                            value={editingMoment.title}
                                            onChange={(e) => setEditingMoment({...editingMoment, title: e.target.value})}
                                            style={styles.input}
                                        />

                                        <textarea 
                                            value={editingMoment.description || ''}
                                            onChange={(e) => setEditingMoment({...editingMoment, description: e.target.value})}
                                            style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
                                            rows={4}
                                        />

                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                            <input 
                                                type="text"
                                                value={editingMoment.event_name || ''}
                                                onChange={(e) => setEditingMoment({...editingMoment, event_name: e.target.value})}
                                                style={styles.input}
                                            />

                                            <input 
                                                type="text"
                                                value={editingMoment.location || ''}
                                                onChange={(e) => setEditingMoment({...editingMoment, location: e.target.value})}
                                                style={styles.input}
                                            />
                                        </div>

                                        <input 
                                            type="text"
                                            value={editingMoment.tags || ''}
                                            onChange={(e) => setEditingMoment({...editingMoment, tags: e.target.value})}
                                            style={styles.input}
                                        />

                                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                                            <button 
                                                style={styles.btnPrimary}
                                                onClick={updateMoment}
                                            >
                                                ✅ Update
                                            </button>
                                            <button 
                                                style={styles.btnSecondary}
                                                onClick={() => {
                                                    setView('grid');
                                                    setEditingMoment(null);
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

                    {/* SLIDESHOW CREATION */}
                    {view === 'slideshow' && (
                        <div style={styles.content}>
                            <div style={styles.formContainer}>
                                <h2 style={styles.sectionTitle}>🎬 Create Slideshow</h2>
                                
                                <div style={styles.info}>
                                    <p>Select moments and upload audio. Slideshow will play all moments with your audio!</p>
                                </div>

                                <div style={styles.form}>
                                    <input 
                                        type="text"
                                        value={slideshowTitle}
                                        onChange={(e) => setSlideshowTitle(e.target.value)}
                                        placeholder="Slideshow Title"
                                        style={styles.input}
                                    />

                                    <div>
                                        <label style={{fontWeight: 600, color: '#1a5f7a'}}>Upload Audio *</label>
                                        <input 
                                            ref={audioInputRef}
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleAudioUpload}
                                            style={styles.input}
                                        />
                                        {slideshowAudio && (
                                            <div style={{marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '10px'}}>
                                                <audio src={slideshowAudio} controls style={{width: '100%'}} />
                                                <p>Duration: {Math.round(audioDuration)}s</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={styles.selectedCount}>
                                    {selectedMoments.length} selected
                                </div>

                                <div style={styles.grid}>
                                    {moments.map(moment => (
                                        <div 
                                            key={moment.uuid} 
                                            style={selectedMoments.includes(moment.uuid) ? {...styles.card, border: '3px solid #38bdf8'} : styles.card}
                                            onClick={() => toggleSelectMoment(moment.uuid)}
                                        >
                                            <div style={styles.cardMedia}>
                                                {moment.media_type === 'video' && moment.video_data ? (
                                                    <video 
                                                        src={moment.video_data}
                                                        style={styles.media}
                                                        muted
                                                    />
                                                ) : moment.image_data ? (
                                                    <img 
                                                        src={moment.image_data} 
                                                        alt={moment.title}
                                                        style={styles.media}
                                                    />
                                                ) : null}
                                                {selectedMoments.includes(moment.uuid) && (
                                                    <div style={styles.selectedOverlay}>
                                                        <span style={{fontSize: '3rem', color: '#fff'}}>✓</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{padding: '1.25rem'}}>
                                                <h3 style={styles.cardTitle}>{moment.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                                    <button 
                                        style={{...styles.btnPrimary, padding: '1.25rem 3rem', fontSize: '1.2rem'}}
                                        onClick={createSlideshow}
                                        disabled={selectedMoments.length === 0 || !slideshowAudio || creatingSlideshow}
                                    >
                                        {creatingSlideshow ? '⏳ Creating...' : '🎬 Create'}
                                    </button>
                                    <button 
                                        style={styles.btnSecondary}
                                        onClick={() => setView('grid')}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SLIDESHOW PLAYER */}
                    {view === 'play-slideshow' && playingSlideshow && (
                        <div style={styles.content}>
                            <div style={styles.formContainer}>
                                <button 
                                    style={styles.backBtn}
                                    onClick={() => {
                                        stopSlideshowPlayback();
                                        setView('grid');
                                    }}
                                >
                                    ← Back
                                </button>

                                <h2 style={styles.sectionTitle}>{playingSlideshow.title}</h2>

                                <div style={styles.player}>
                                    {playingSlideshow.moments[currentSlideIndex] && (
                                        <div style={styles.slideContainer}>
                                            {playingSlideshow.moments[currentSlideIndex].media_type === 'video' && playingSlideshow.moments[currentSlideIndex].video_data ? (
                                                <video 
                                                    src={playingSlideshow.moments[currentSlideIndex].video_data}
                                                    style={styles.slideMedia}
                                                    autoPlay
                                                    muted
                                                    loop
                                                />
                                            ) : playingSlideshow.moments[currentSlideIndex].image_data ? (
                                                <img 
                                                    src={playingSlideshow.moments[currentSlideIndex].image_data}
                                                    alt={playingSlideshow.moments[currentSlideIndex].title}
                                                    style={styles.slideMedia}
                                                />
                                            ) : null}
                                            <div style={styles.slideTitle}>
                                                {playingSlideshow.moments[currentSlideIndex].title}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.controls}>
                                    <div style={styles.progress}>
                                        Slide {currentSlideIndex + 1} of {playingSlideshow.moments.length}
                                    </div>
                                    
                                    <audio 
                                        ref={audioPlayerRef}
                                        src={playingSlideshow.audio_data}
                                        style={{display: 'none'}}
                                    />

                                    <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                                        {!isPlaying ? (
                                            <button 
                                                style={styles.playBtnLarge}
                                                onClick={startSlideshowPlayback}
                                            >
                                                ▶️ Play
                                            </button>
                                        ) : (
                                            <button 
                                                style={styles.stopBtn}
                                                onClick={stopSlideshowPlayback}
                                            >
                                                ⏹️ Stop
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DETAIL */}
                    {view === 'detail' && detailMoment && (
                        <div style={styles.content}>
                            <div style={styles.formContainer}>
                                <button 
                                    style={styles.backBtn}
                                    onClick={() => setView('grid')}
                                >
                                    ← Back
                                </button>

                                <div style={styles.detailContent}>
                                    <div style={styles.detailMedia}>
                                        {detailMoment.media_type === 'video' && detailMoment.video_data ? (
                                            <video 
                                                src={detailMoment.video_data}
                                                controls
                                                style={{width: '100%', borderRadius: '15px'}}
                                            />
                                        ) : detailMoment.image_data ? (
                                            <img 
                                                src={detailMoment.image_data} 
                                                alt={detailMoment.title}
                                                style={{width: '100%', borderRadius: '15px'}}
                                            />
                                        ) : null}
                                    </div>

                                    <div style={styles.detailInfo}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem'}}>
                                            <h2 style={{margin: 0}}>{detailMoment.title}</h2>
                                            <button 
                                                style={detailMoment.is_favorite ? {...styles.chip, background: '#ffc6d3', color: '#fff'} : styles.chip}
                                                onClick={() => toggleFavorite(detailMoment.uuid, detailMoment.is_favorite)}
                                            >
                                                {detailMoment.is_favorite ? '⭐ Favorited' : '☆ Favorite'}
                                            </button>
                                        </div>

                                        {detailMoment.description && (
                                            <p style={{color: '#5c8fa3', lineHeight: 1.6}}>{detailMoment.description}</p>
                                        )}

                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                                            {detailMoment.event_name && (
                                                <div>
                                                    <strong style={{color: '#1a5f7a'}}>Event:</strong> {detailMoment.event_name}
                                                </div>
                                            )}
                                            {detailMoment.location && (
                                                <div>
                                                    <strong style={{color: '#1a5f7a'}}>Location:</strong> {detailMoment.location}
                                                </div>
                                            )}
                                            <div>
                                                <strong style={{color: '#1a5f7a'}}>Date:</strong>{' '}
                                                {new Date(detailMoment.moment_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            {detailMoment.tags && (
                                                <div>
                                                    <strong style={{color: '#1a5f7a'}}>Tags:</strong>
                                                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem'}}>
                                                        {detailMoment.tags.split(',').map((tag, i) => (
                                                            <span key={i} style={styles.badge}>{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #d1e9f0'}}>
                                            <button 
                                                style={{...styles.btnPrimary, flex: 1}}
                                                onClick={() => startEditMoment(detailMoment)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                style={{...styles.deleteBtn, flex: 1}}
                                                onClick={() => deleteMoment(detailMoment.uuid)}
                                            >
                                                🗑️ Delete
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

const styles = {
    container: {
        fontFamily: "'Quicksand', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #e8f4f8 100%)',
    },
    mainContent: {padding: 0},
    hero: {
        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
        padding: '3rem 2rem',
        borderRadius: '0 0 40px 40px',
        boxShadow: '0 10px 40px rgba(26, 95, 122, 0.15)',
        marginBottom: '2rem',
    },
    heroContent: {textAlign: 'center'},
    title: {
        fontFamily: "'Satisfy', cursive",
        fontSize: '3.5rem',
        color: '#ffffff',
        margin: '0 0 0.5rem 0',
        textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#e0f2fe',
        fontWeight: 300,
        margin: 0,
        letterSpacing: '2px',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginTop: '2rem',
    },
    statCard: {
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '20px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    statNumber: {fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem'},
    statLabel: {fontSize: '0.9rem', color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500},
    navTabs: {display: 'flex', gap: '0.5rem', padding: '1.5rem 2rem 0 2rem', flexWrap: 'wrap'},
    tab: {
        padding: '0.875rem 1.75rem',
        background: '#ffffff',
        border: '2px solid #d1e9f0',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#5c8fa3',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(26, 95, 122, 0.08)',
    },
    tabActive: {
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff',
        borderColor: '#0ea5e9',
        boxShadow: '0 5px 20px rgba(14, 165, 233, 0.3)',
    },
    content: {padding: '2rem'},
    searchBar: {
        background: '#ffffff',
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
    },
    input: {
        padding: '0.875rem 1.25rem',
        border: '2px solid #d1e9f0',
        borderRadius: '15px',
        fontSize: '1rem',
        fontFamily: "'Quicksand', sans-serif",
        background: '#f0f9ff',
        flex: 1,
        minWidth: '200px',
    },
    chip: {
        padding: '0.625rem 1.25rem',
        background: '#ffffff',
        border: '2px solid #d1e9f0',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#5c8fa3',
        cursor: 'pointer',
    },
    chipActive: {
        background: '#38bdf8',
        color: '#ffffff',
        borderColor: '#38bdf8',
        boxShadow: '0 2px 10px rgba(14, 165, 233, 0.3)',
    },
    loading: {textAlign: 'center', padding: '4rem 2rem'},
    spinner: {
        width: '60px',
        height: '60px',
        border: '4px solid #d1e9f0',
        borderTop: '4px solid #38bdf8',
        borderRadius: '50%',
        margin: '0 auto 1.5rem',
        animation: 'spin 1s linear infinite',
    },
    empty: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)',
        cursor: 'pointer',
        position: 'relative',
    },
    cardMedia: {
        position: 'relative',
        width: '100%',
        paddingTop: '75%',
        background: 'linear-gradient(135deg, #e0f2fe, #d1e9f0)',
        overflow: 'hidden',
    },
    media: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    fav: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        zIndex: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    selectedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(14, 165, 233, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {fontSize: '1.1rem', fontWeight: 700, color: '#1a5f7a', margin: '0 0 0.5rem 0'},
    badge: {
        display: 'inline-block',
        background: '#e0f2fe',
        color: '#0284c7',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 600,
    },
    cardDate: {fontSize: '0.9rem', color: '#5c8fa3', margin: 0},
    btnPrimary: {
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff',
        padding: '0.875rem 2rem',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: "'Quicksand', sans-serif",
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    },
    btnSecondary: {
        background: '#ffffff',
        color: '#1a5f7a',
        padding: '0.875rem 2rem',
        border: '2px solid #d1e9f0',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: "'Quicksand', sans-serif",
        cursor: 'pointer',
    },
    formContainer: {maxWidth: '900px', margin: '0 auto'},
    sectionTitle: {fontSize: '2rem', color: '#1a5f7a', margin: '0 0 2rem 0', textAlign: 'center'},
    form: {
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)',
    },
    captureBtn: {
        padding: '1.25rem 2.5rem',
        borderRadius: '20px',
        fontSize: '1.1rem',
        fontWeight: 600,
        fontFamily: "'Quicksand', sans-serif",
        cursor: 'pointer',
        border: 'none',
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    },
    preview: {width: '100%', maxWidth: '500px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)'},
    removeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontSize: '1.5rem',
        color: '#1a5f7a',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    info: {
        background: '#e0f2fe',
        padding: '1.25rem',
        borderRadius: '15px',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#1a5f7a',
    },
    selectedCount: {
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff',
        padding: '0.875rem 1.5rem',
        borderRadius: '15px',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '1.1rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    },
    backBtn: {
        background: '#ffffff',
        border: '2px solid #d1e9f0',
        padding: '0.75rem 1.5rem',
        borderRadius: '15px',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1a5f7a',
        cursor: 'pointer',
        marginBottom: '2rem',
    },
    player: {
        background: '#000000',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    },
    slideContainer: {
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
    },
    slideMedia: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    slideTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff',
        padding: '1rem',
        fontSize: '1.5rem',
        fontWeight: 600,
        textAlign: 'center',
    },
    controls: {
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(26, 95, 122, 0.08)',
    },
    progress: {
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#1a5f7a',
        marginBottom: '1.5rem',
        fontWeight: 600,
    },
    playBtnLarge: {
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff',
        padding: '1.5rem 3rem',
        border: 'none',
        borderRadius: '30px',
        fontSize: '1.5rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
    },
    stopBtn: {
        background: '#ff6b6b',
        color: '#ffffff',
        padding: '1.5rem 3rem',
        border: 'none',
        borderRadius: '30px',
        fontSize: '1.5rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
    },
    detailContent: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(26, 95, 122, 0.08)',
    },
    detailMedia: {marginBottom: '2rem'},
    detailInfo: {display: 'flex', flexDirection: 'column', gap: '1.5rem'},
    deleteBtn: {
        background: '#ffe0e0',
        border: '2px solid #ffb3b3',
        padding: '0.75rem 1.5rem',
        borderRadius: '15px',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#cc0000',
        cursor: 'pointer',
    },
    playBtn: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#ffffff',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '25px',
        fontSize: '1.2rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: 3,
    },
};