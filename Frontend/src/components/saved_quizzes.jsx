import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SavedQuizzes() {
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuizzes, setExpandedQuizzes] = useState({});

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
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
                setLoading(false);
            } catch (err) {
                console.error("Error fetching saved quizzes:", err);
                setError("Failed to load saved quizzes");
                setLoading(false);
            }
        };

        fetchSavedQuizzes();
    }, []);

    const toggleQuizExpand = (quizId) => {
        setExpandedQuizzes(prev => ({
            ...prev,
            [quizId]: !prev[quizId]
        }));
    };

    const renderQuizDetails = (quiz) => {
        const isExpanded = expandedQuizzes[quiz.id];

        return (
            <div key={quiz.id} className="saved-quiz-card mb-4 border rounded-lg shadow-sm">
                <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleQuizExpand(quiz.id)}
                >
                    <h3 className="text-lg font-semibold">{quiz.quiz_name}</h3>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                            {new Date(quiz.created_at).toLocaleString()}
                        </span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

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
                                        <span>Your Answer: {q.selected_answer}</span>
                                        <span>Correct Answer: {q.correct_answer}</span>
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
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5>
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
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5>
                    <div className="saved-quizzes-container">
                        {savedQuizzes.length === 0 ? (
                            <div className="empty-quizzes-container">
                                <p>No saved quizzes found.</p>
                            </div>
                        ) : (
                            savedQuizzes.map(renderQuizDetails)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}