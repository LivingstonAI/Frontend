import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

export default function Quizzifier() {
    const baseUrl = "https://backend-production-c0ab.up.railway.app";
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
    const [isAnswered, setIsAnswered] = useState(false); // Track if the current question is answered

    const fetchAPIKey = async () => {

        try {
            setStatusMessage("Fetching API key...");
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
            setStatusMessage("");
        } catch (error) {
            console.error("Error fetching API key:", error);
            setStatusMessage("Failed to fetch API key.");
        }
    };

    const fetchQuizData = async () => {
        if (!userInput.trim()) {
            alert("Please enter a topic or content for the quiz!");
            return;
        }

        setStatusMessage("Generating quiz...");
        setShowModal(true);
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI quiz generator. Based on the provided data, GENERATE A JSON QUIZ IN THIS FORMAT:
                            EXAMPLE 1:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 2:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 3:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            NB!! IT MUST BE IN THIS FORMAT OR THE APP WILL NOT WORK!!!! MAKE IT THIS JSON FORMAT!!!!
                            `,
                        
                        },
                        { role: "user", content: `Generate a quiz based on the following topic: ${userInput}` },
                    ],
                }),
            });
            const data = await response.json();
            const quizContent = JSON.parse(data.choices[0].message.content);
            setQuiz(quizContent);
            setStatusMessage("");
            setShowModal(false);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setStatusMessage("Failed to generate quiz.");
            setShowModal(false);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQuestion = quiz.data[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.answer;

        setSelectedAnswer(selectedOption); // Track selected answer
        setIsAnswered(true); // Mark question as answered

        setAnswers((prev) => [
            ...prev,
            {
                question: currentQuestion.question,
                selectedAnswer: selectedOption,
                correctAnswer: currentQuestion.answer,
                isCorrect,
            },
        ]);

        // Move to the next question after a delay
        setTimeout(() => {
            if (currentQuestionIndex < quiz.data.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                setQuizStarted(false);
            }
        }, 2000);
    };

    const handleStartQuiz = () => {
        if (!quiz) {
            alert("Please generate a quiz first!");
            return;
        }
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    const handleStartOver = () => {
        setQuizStarted(false);
        setQuiz(null);
        setUserInput("");
        setAnswers([]);
        setStatusMessage("");
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    useEffect(() => {
        fetchAPIKey();
    }, []);

    const correctAnswersCount = answers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswersCount = answers.length - correctAnswersCount;

    return (
        <div style={styles.container}>
        <div className="header">
                <Header />
            </div>
            <SideNavs />
            <div style={styles.mainBody}>
                {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
                {!quizStarted ? (
                    <div>
                        <h5 className="quiz-header">Welcome to the Quiz</h5>
                        <div style={styles.inputContainer}>
                            <textarea
                                placeholder="Enter your topic or content for the quiz..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                style={styles.textarea}
                            />
                            <button style={styles.generateButton} onClick={fetchQuizData}>
                                Generate Quiz
                            </button>
                        </div>
                        {quiz && (
                            <button style={styles.startButton} onClick={handleStartQuiz}>
                                Start Quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <h5 style={styles.quizTitle}>{quiz.title}</h5>
                        {currentQuestionIndex < quiz.data.length ? (
                            <div style={styles.questionContainer}>
                                <h6 className="quiz-header">{quiz.data[currentQuestionIndex].question}</h6>
                                <ul style={styles.optionsList}>
                                    {quiz.data[currentQuestionIndex].options.map((option, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                ...styles.option,
                                                backgroundColor:
                                                    isAnswered && option === quiz.data[currentQuestionIndex].answer
                                                        ? "#5bff33"
                                                        : isAnswered && option === selectedAnswer
                                                        ? "#ff4f33"
                                                        : "#f1f1f1",
                                                cursor: isAnswered ? "not-allowed" : "pointer",
                                            }}
                                            onClick={() => !isAnswered && handleAnswer(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                                {isAnswered && (
                                    <p>
                                        {selectedAnswer === quiz.data[currentQuestionIndex].answer
                                            ? "Correct! 🎉"
                                            : "Wrong! ❌"}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div style={styles.completionScreen}>
                                <h2>Quiz Completed! 🎉</h2>
                                <p>
                                    Correct Answers: {correctAnswersCount} / {answers.length}
                                </p>
                                <p>
                                    Incorrect Answers: {incorrectAnswersCount}
                                </p>
                                <h3>Feedback:</h3>
                                <ul style={styles.feedbackList}>
                                    {answers.map((answer, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                color: answer.isCorrect ? "#5bff33" : "#ff4f33",
                                            }}
                                        >
                                            Q: {answer.question}
                                            <br />
                                            Your Answer: {answer.selectedAnswer}{" "}
                                            {answer.isCorrect ? "✔️" : "❌"}
                                            <br />
                                            Correct Answer: {answer.correctAnswer}
                                        </li>
                                    ))}
                                </ul>
                                <button style={styles.startOverButton} onClick={handleStartOver}>
                                    Start Over
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {showModal && <div style={styles.modal}>Loading... Please wait</div>}
            </div>
        </div>
    );
}

const styles = {
    container: { fontFamily: "Arial, sans-serif" },
    inputContainer: { marginBottom: "20px" },
    textarea: { width: "100%", height: "100px", padding: "10px", marginBottom: "10px" },
    generateButton: { padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none", cursor: "pointer" },
    startButton: { padding: "10px 20px", background: "#28A745", color: "#fff", border: "none", cursor: "pointer" },
    questionContainer: { marginBottom: "20px" },
    optionsList: { listStyle: "none", padding: 0 },
    option: { padding: "10px", margin: "5px 0", background: "#f1f1f1", cursor: "pointer", borderRadius: "5px" },
    modal: { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" },
    statusMessage: { color: "gray", textAlign: "center" },
    quizTitle: { textAlign: "center", fontSize: "24px", marginBottom: "20px" },
    completionScreen: { textAlign: "center", marginTop: "20px" },
    feedbackList: { listStyle: "none", padding: 0, textAlign: "left" },
    startOverButton: { padding: "10px 20px", background: "#DC3545", color: "#fff", border: "none", cursor: "pointer", marginTop: "20px" },
};
