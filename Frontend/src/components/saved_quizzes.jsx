import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SavedQuizzes() {
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
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
        } catch (err) {
            console.error("Error deleting quiz:", err);
            alert("Failed to delete quiz");
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

    const renderQuizDetails = (quiz) => {
        const isExpanded = expandedQuizzes[quiz.id];

        return (
            <div key={quiz.id} className="saved-quiz-card mb-4 border rounded-lg shadow-sm relative">
                
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
                        handleDeleteQuiz(quiz.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                >
                    Delete
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