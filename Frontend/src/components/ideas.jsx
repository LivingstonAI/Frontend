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
            
            fetchIdeas();
            setError(null);
        } catch (err) {
            setError('Error creating idea: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Ideas Section</h5>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {/* Create Idea Form */}
                    <div className="create-idea-section">
                        <h6>Create New Idea</h6>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="idea_category">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="idea_category"
                                    name="idea_category"
                                    value={newIdea.idea_category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="idea_text">Description</label>
                                <textarea
                                    className="form-control"
                                    id="idea_text"
                                    name="idea_text"
                                    rows="3"
                                    value={newIdea.idea_text}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="idea_tracker">Status</label>
                                <select
                                    className="form-control"
                                    id="idea_tracker"
                                    name="idea_tracker"
                                    value={newIdea.idea_tracker}
                                    onChange={handleInputChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Idea'}
                            </button>
                        </form>
                    </div>
                    
                    {/* Display Ideas */}
                    <div className="ideas-list mt-4">
                        <h6>My Ideas</h6>
                        {loading && <p>Loading ideas...</p>}
                        {!loading && ideas.length === 0 && <p>No ideas found. Create your first idea!</p>}
                        
                        <div className="row">
                            {ideas.map(idea => (
                                <div className="col-md-4 mb-3" key={idea.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h6 className="card-title">{idea.idea_category}</h6>
                                            <p className="card-text">{idea.idea_text}</p>
                                            <div className="d-flex justify-content-between">
                                                <span className={`badge ${
                                                    idea.idea_tracker === 'Completed' ? 'bg-success' :
                                                    idea.idea_tracker === 'In Progress' ? 'bg-warning' : 'bg-secondary'
                                                }`}>
                                                    {idea.idea_tracker}
                                                </span>
                                                <small className="text-muted">
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
        </div>
    );
}