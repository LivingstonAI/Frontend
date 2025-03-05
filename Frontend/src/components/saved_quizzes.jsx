import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SavedQuizzes() {
    const [savedQuizzes, setSavedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const renderQuizDetails = (quiz) => {
        return (
            <div key={quiz.id} className="saved-quiz-card mb-4 p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{quiz.quiz_name}</h3>
                    <span className="text-sm text-gray-500">
                        {new Date(quiz.created_at).toLocaleString()}
                    </span>
                </div>
                <div className="quiz-stats mb-2">
                    <p>
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
                            <p className="font-medium">{q.question}</p>
                            <div className="answers flex justify-between">
                                <span>Your Answer: {q.selected_answer}</span>
                                <span>Correct Answer: {q.correct_answer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return 
    <div>
        <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5>
                    <br />
            </div>
            </div>
            Loading saved quizzes...
        </div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Saved Quizzes</h5>
                    <br />
                    <div className="saved-quizzes-container">
                        {savedQuizzes.length === 0 ? (
                            <p>No saved quizzes found.</p>
                        ) : (
                            savedQuizzes.map(renderQuizDetails)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}