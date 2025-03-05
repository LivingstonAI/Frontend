import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SavedQuizzes() {
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingQuizId, setDeletingQuizId] = useState(null);
    const [confirmDeleteQuiz, setConfirmDeleteQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [expandedQuizzes, setExpandedQuizzes] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const fetchSavedQuizzes = async () => {
        try {
            const csrftoken = Cookies.get('csrftoken');
            const response = await axios.get(`${baseUrl}/fetch-saved-quizzes`, {
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                }
            });

            setSavedQuizzes(response.data.quizzes);
            setFilteredQuizzes(response.data.quizzes);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching saved quizzes:", err);
            setError("Failed to load saved quizzes");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedQuizzes();
    }, []);

    const toggleQuizExpand = (quizId) => {
        setExpandedQuizzes(prev => ({
            ...prev,
            [quizId]: !prev[quizId]
        }));
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            setDeletingQuizId(quizId);
            const csrftoken = Cookies.get('csrftoken');
            await axios.delete(`${baseUrl}/delete-quiz/${quizId}`, {
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                }
            });

            // Remove the quiz from local state
            const updatedQuizzes = savedQuizzes.filter(quiz => quiz.id !== quizId);
            setSavedQuizzes(updatedQuizzes);
            setFilteredQuizzes(updatedQuizzes);
            
            // Reset the deleting state
            setDeletingQuizId(null);
            setConfirmDeleteQuiz(null);
        } catch (err) {
            console.error("Error deleting quiz:", err);
            alert("Failed to delete quiz");
            setDeletingQuizId(null);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = savedQuizzes.filter(quiz => 
            quiz.quiz_name.toLowerCase().includes(term)
        );
        setFilteredQuizzes(filtered);
    };

    const renderDeleteConfirmationModal = (quiz) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="mb-4">
                        Are you sure you want to delete the quiz "{quiz.quiz_name}"? 
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-between">
                        <button 
                            onClick={() => setConfirmDeleteQuiz(null)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            disabled={deletingQuizId === quiz.id}
                        >
                            {deletingQuizId === quiz.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderQuizDetails = (quiz) => {
        const isExpanded = expandedQuizzes[quiz.id];
        const isDeleting = deletingQuizId === quiz.id;

        return (
            <div key={quiz.id} className={`saved-quiz-card mb-4 border rounded-lg shadow-sm relative ${isDeleting ? 'opacity-50' : ''}`}>
                
                <div 
                    className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleQuizExpand(quiz.id)}
                >
                    <h3 className="text-lg font-semibold">{quiz.quiz_name}</h3>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                            {new Date(quiz.created_at).toLocaleString()}
                        </span>
                        <i 
                            className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} cursor-pointer`}
                        ></i>
                    </div>
                </div>

                {/* Delete button positioned absolutely */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent expanding/collapsing
                        setConfirmDeleteQuiz(quiz);
                    }}
                    className={`absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>

                {isExpanded && (
                    <div className="quiz-details p-4">
                        <div className="quiz-stats mb-4">
                            <p className="font-medium">
                                Score: {quiz.correct_answers} / {quiz.total_questions} 
                                ({((quiz.correct_answers / quiz.total_questions) * 100).toFixed(2)}%)
                            </p>
                        </div>
                        <div className="quiz-questions">
                            {quiz.questions.map((q, index) => (
                                <div 
                                    key={index} 
                                    className={`question mb-2 p-2 rounded ${q.is_correct ? 'bg-green-100' : 'bg-red-100'}`}
                                >
                                    <p className="font-medium mb-2">{q.question}</p>
                                    <div className="answers flex justify-between">
                                        <span>Your Answer: <br />{q.selected_answer}</span><br />
                                        <span>Correct Answer: <br />{q.correct_answer}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5><br />
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span className="ml-3">Loading saved quizzes...</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return <div className="error-container">{error}</div>;

    return (
        <div>
            {/* Confirmation Modal */}
            {confirmDeleteQuiz && renderDeleteConfirmationModal(confirmDeleteQuiz)}

            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5><br />
                    
                    {/* Search Input */}
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Search quizzes..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="saved-quizzes-container">
                        {filteredQuizzes.length === 0 ? (
                            <div className="empty-quizzes-container">
                                <p>No quizzes found.</p>
                            </div>
                        ) : (
                            filteredQuizzes.map(renderQuizDetails)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}