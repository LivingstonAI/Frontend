import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function SnowAIVideos() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    
    const [formData, setFormData] = useState({
        video_title: '',
        video_url: '',
        category_id: '',
        notes: ''
    });
    
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchVideos();
    }, []);

    useEffect(() => {
        // Filter videos based on search query
        if (searchQuery.trim() === '') {
            setFilteredVideos(videos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = videos.filter(video => 
                video.video_title.toLowerCase().includes(query) ||
                video.notes?.toLowerCase().includes(query) ||
                video.category_name.toLowerCase().includes(query)
            );
            setFilteredVideos(filtered);
        }
    }, [searchQuery, videos]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/snowai-video-categories/`);
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (err) {
            setError('Failed to fetch categories');
        }
    };

    const fetchVideos = async (categoryId = null) => {
        try {
            setLoading(true);
            const url = categoryId 
                ? `${baseUrl}/api/snowai-video-entries/?category_id=${categoryId}`
                : `${baseUrl}/api/snowai-video-entries/`;
            const response = await fetch(url);
            const data = await response.json();
            setVideos(data.videos || []);
            setFilteredVideos(data.videos || []);
        } catch (err) {
            setError('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setSearchQuery(''); // Clear search when filtering by category
        if (categoryId === 'all') {
            fetchVideos();
        } else {
            fetchVideos(categoryId);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        
        try {
            const response = await fetch(`${baseUrl}/api/snowai-video-categories/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_name: newCategory })
            });
            
            if (response.ok) {
                setNewCategory('');
                setIsAddingCategory(false);
                fetchCategories();
            }
        } catch (err) {
            setError('Failed to create category');
        }
    };

    const handleSubmitVideo = async (e) => {
        e.preventDefault();
        if (!formData.video_title || !formData.video_url || !formData.category_id) {
            setError('Please fill in all required fields');
            return;
        }
        
        try {
            const url = editingVideo
                ? `${baseUrl}/api/snowai-video-entries/${editingVideo.id}/update/`
                : `${baseUrl}/api/snowai-video-entries/create/`;
            
            const method = editingVideo ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setFormData({ video_title: '', video_url: '', category_id: '', notes: '' });
                setIsAddingVideo(false);
                setEditingVideo(null);
                setError('');
                
                if (selectedCategory === 'all') {
                    fetchVideos();
                } else {
                    fetchVideos(selectedCategory);
                }
            }
        } catch (err) {
            setError('Failed to save video');
        }
    };

    const handleEditVideo = (video) => {
        setEditingVideo(video);
        setFormData({
            video_title: video.video_title,
            video_url: video.video_url,
            category_id: video.category_id,
            notes: video.notes || ''
        });
        setIsAddingVideo(true);
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        
        try {
            const response = await fetch(`${baseUrl}/api/snowai-video-entries/${videoId}/delete/`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                if (selectedCategory === 'all') {
                    fetchVideos();
                } else {
                    fetchVideos(selectedCategory);
                }
                if (playingVideo?.id === videoId) {
                    setPlayingVideo(null);
                }
            }
        } catch (err) {
            setError('Failed to delete video');
        }
    };

    const handleCancelForm = () => {
        setIsAddingVideo(false);
        setEditingVideo(null);
        setFormData({ video_title: '', video_url: '', category_id: '', notes: '' });
        setError('');
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Videos of Interest</h5><br />
                    
                    <style>{styles}</style>
                    
                    <div className="snowai-videos-container">
                        {/* Category Management */}
                        <div className="snowai-category-section">
                            <div className="snowai-category-header">
                                <h6>Categories</h6>
                                <button 
                                    className="snowai-btn-add-category"
                                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                                >
                                    {isAddingCategory ? 'Cancel' : '+ Category'}
                                </button>
                            </div>
                            
                            {isAddingCategory && (
                                <form onSubmit={handleAddCategory} className="snowai-category-form">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="Category name"
                                        className="snowai-input"
                                    />
                                    <button type="submit" className="snowai-btn-save">Add</button>
                                </form>
                            )}
                            
                            <div className="snowai-category-filters">
                                <button
                                    className={`snowai-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => handleCategoryFilter('all')}
                                >
                                    All Videos
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`snowai-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryFilter(cat.id)}
                                    >
                                        {cat.category_name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="snowai-search-section">
                            <input
                                type="text"
                                placeholder="🔍 Search videos by title, notes, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="snowai-search-input"
                            />
                            {searchQuery && (
                                <button 
                                    className="snowai-clear-search"
                                    onClick={() => setSearchQuery('')}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Add Video Button */}
                        {!isAddingVideo && (
                            <button 
                                className="snowai-btn-add-video"
                                onClick={() => setIsAddingVideo(true)}
                            >
                                + Add Video
                            </button>
                        )}

                        {/* Add/Edit Video Form */}
                        {isAddingVideo && (
                            <div className="snowai-video-form-container">
                                <h6>{editingVideo ? 'Edit Video' : 'Add New Video'}</h6>
                                {error && <div className="snowai-error">{error}</div>}
                                <form onSubmit={handleSubmitVideo} className="snowai-video-form">
                                    <input
                                        type="text"
                                        placeholder="Video Title *"
                                        value={formData.video_title}
                                        onChange={(e) => setFormData({...formData, video_title: e.target.value})}
                                        className="snowai-input"
                                        required
                                    />
                                    <input
                                        type="url"
                                        placeholder="YouTube URL *"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                                        className="snowai-input"
                                        required
                                    />
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                        className="snowai-input"
                                        required
                                    >
                                        <option value="">Select Category *</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        placeholder="Notes (optional)"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="snowai-input snowai-textarea"
                                        rows="3"
                                    />
                                    <div className="snowai-form-actions">
                                        <button type="submit" className="snowai-btn-save">
                                            {editingVideo ? 'Update' : 'Save'}
                                        </button>
                                        <button type="button" onClick={handleCancelForm} className="snowai-btn-cancel">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Video Player */}
                        {playingVideo && (
                            <div className="snowai-video-player">
                                <div className="snowai-player-header">
                                    <h6>{playingVideo.video_title}</h6>
                                    <button 
                                        className="snowai-btn-close"
                                        onClick={() => setPlayingVideo(null)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="snowai-iframe-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${playingVideo.youtube_embed_id}`}
                                        title={playingVideo.video_title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                {playingVideo.notes && (
                                    <div className="snowai-video-notes">
                                        <strong>Notes:</strong> {playingVideo.notes}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Videos List */}
                        {loading ? (
                            <div className="snowai-loading">Loading videos...</div>
                        ) : filteredVideos.length === 0 ? (
                            <div className="snowai-empty">
                                {searchQuery ? `No videos found matching "${searchQuery}"` : 'No videos found. Add your first video!'}
                            </div>
                        ) : (
                            <div className="snowai-videos-list">
                                {searchQuery && (
                                    <div className="snowai-search-results-header">
                                        Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                                    </div>
                                )}
                                {filteredVideos.map(video => (
                                    <div key={video.id} className="snowai-video-card">
                                        <div 
                                            className="snowai-video-title"
                                            onClick={() => setPlayingVideo(video)}
                                        >
                                            {video.video_title}
                                        </div>
                                        <div className="snowai-video-meta">
                                            <span className="snowai-category-tag">{video.category_name}</span>
                                            <span className="snowai-date">
                                                {new Date(video.date_entered).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {video.notes && (
                                            <div className="snowai-video-card-notes">
                                                {video.notes.substring(0, 100)}{video.notes.length > 100 ? '...' : ''}
                                            </div>
                                        )}
                                        <div className="snowai-video-actions">
                                            <button 
                                                className="snowai-btn-action snowai-btn-play"
                                                onClick={() => setPlayingVideo(video)}
                                            >
                                                ▶ Play
                                            </button>
                                            <button 
                                                className="snowai-btn-action snowai-btn-edit"
                                                onClick={() => handleEditVideo(video)}
                                            >
                                                ✎ Edit
                                            </button>
                                            <button 
                                                className="snowai-btn-action snowai-btn-delete"
                                                onClick={() => handleDeleteVideo(video.id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = `
.snowai-videos-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.snowai-category-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
}

.snowai-category-header {
    margin-bottom: 15px;
}

.snowai-category-header h6 {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.snowai-btn-add-category {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.snowai-btn-add-category:hover {
    background: #0056b3;
}

.snowai-category-form {
    margin-bottom: 15px;
}

.snowai-category-form input {
    margin-right: 10px;
    margin-bottom: 10px;
}

.snowai-category-filters {
    margin-top: 15px;
}

.snowai-category-btn {
    background: white;
    border: 2px solid #007bff;
    padding: 8px 16px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    color: #007bff;
}

.snowai-category-btn:hover {
    background: #e7f3ff;
}

.snowai-category-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.snowai-search-section {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    position: relative;
}

.snowai-search-input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.snowai-search-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.snowai-clear-search {
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    background: #6c757d;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
}

.snowai-clear-search:hover {
    background: #5a6268;
}

.snowai-search-results-header {
    padding: 10px 15px;
    background: #e7f3ff;
    border-left: 4px solid #007bff;
    margin-bottom: 15px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #004085;
}

.snowai-btn-add-video {
    background: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    width: 100%;
}

.snowai-btn-add-video:hover {
    background: #218838;
}

.snowai-video-form-container {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 25px;
}

.snowai-video-form-container h6 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.snowai-video-form {
    /* no special styling needed */
}

.snowai-input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 2px solid #dee2e6;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.snowai-input:focus {
    outline: none;
    border-color: #007bff;
}

.snowai-textarea {
    resize: vertical;
    font-family: inherit;
}

.snowai-form-actions {
    margin-top: 10px;
}

.snowai-btn-save {
    background: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
}

.snowai-btn-save:hover {
    background: #218838;
}

.snowai-btn-cancel {
    background: #6c757d;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
}

.snowai-btn-cancel:hover {
    background: #5a6268;
}

.snowai-error {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 15px;
    border: 1px solid #f5c6cb;
}

.snowai-video-player {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    margin-bottom: 25px;
}

.snowai-player-header {
    margin-bottom: 15px;
    overflow: hidden;
}

.snowai-player-header h6 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: inline-block;
    max-width: calc(100% - 40px);
}

.snowai-btn-close {
    background: transparent;
    color: #6c757d;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 28px;
    float: right;
    line-height: 1;
    font-weight: 300;
    transition: color 0.3s ease;
}

.snowai-btn-close:hover {
    color: #dc3545;
}

.snowai-iframe-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;
}

.snowai-iframe-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.snowai-video-notes {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 5px;
    font-size: 14px;
    line-height: 1.6;
}

.snowai-video-notes strong {
    color: #495057;
}

.snowai-loading {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #6c757d;
}

.snowai-empty {
    text-align: center;
    padding: 60px 20px;
    font-size: 16px;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 8px;
}

.snowai-videos-list {
    /* no special styling needed */
}

.snowai-video-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    margin-bottom: 15px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.snowai-video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.snowai-video-title {
    font-size: 18px;
    font-weight: 600;
    color: #007bff;
    margin-bottom: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.snowai-video-title:hover {
    color: #0056b3;
    text-decoration: underline;
}

.snowai-video-meta {
    margin-bottom: 15px;
}

.snowai-category-tag {
    background: #e7f3ff;
    color: #007bff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    margin-right: 10px;
}

.snowai-date {
    color: #6c757d;
    font-size: 13px;
}

.snowai-video-card-notes {
    padding: 10px;
    background: #f8f9fa;
    border-left: 3px solid #dee2e6;
    margin-bottom: 12px;
    font-size: 13px;
    color: #495057;
    line-height: 1.5;
}

.snowai-video-actions {
    /* no special styling needed */
}

.snowai-btn-action {
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    margin-right: 8px;
    transition: all 0.3s ease;
}

.snowai-btn-play {
    background: #28a745;
    color: white;
}

.snowai-btn-play:hover {
    background: #218838;
}

.snowai-btn-edit {
    background: #ffc107;
    color: #212529;
}

.snowai-btn-edit:hover {
    background: #e0a800;
}

.snowai-btn-delete {
    background: #dc3545;
    color: white;
}

.snowai-btn-delete:hover {
    background: #c82333;
}

@media (max-width: 768px) {
    .snowai-videos-container {
        padding: 15px;
        margin: 0;
    }
    
    .snowai-category-btn {
        margin-right: 5px;
        margin-bottom: 8px;
        padding: 6px 12px;
        font-size: 13px;
    }
    
    .snowai-search-input {
        font-size: 14px;
    }
    
    .snowai-clear-search {
        right: 20px;
        padding: 5px 10px;
        font-size: 12px;
    }
    
    .snowai-video-title {
        font-size: 16px;
    }
    
    .snowai-btn-action {
        padding: 6px 12px;
        font-size: 12px;
        margin-bottom: 5px;
    }
}
`;