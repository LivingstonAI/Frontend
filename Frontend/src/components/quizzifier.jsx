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
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [quizType, setQuizType] = useState('');
    const [numQuestions, setNumQuestions] = useState(0);
    
    // New state variables for chill sections
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");
    const [showSections, setShowSections] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

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

    // New function to fetch all section names
    const fetchChillSections = async () => {
        try {
            setStatusMessage("Fetching sections...");
            const response = await fetch(`${baseUrl}/fetch-chill-sections`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setSections(data.sections);
            setStatusMessage("");
            setShowSections(true);
        } catch (error) {
            console.error("Error fetching sections:", error);
            setStatusMessage("Failed to fetch sections.");
        }
    };

    
    // Function to clean markdown headings
const cleanMarkdownHeadings = (text) => {
    return text.replace(/^#{1,3}[\s]*/gm, '');
};

const fetchSectionData = async (sectionName) => {
    try {
        setStatusMessage("Fetching section data...");
        const response = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(sectionName)}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

       
        const cleanText = data.text.replace(/#{1,3}/g, ''); // Matches 1 to 3 '#' characters

        
        setUserInput(cleanText);
        setSelectedSection(sectionName);
        setStatusMessage("");
        setShowSections(false);
    } catch (error) {
        console.error("Error fetching section data:", error);
        setStatusMessage("Failed to fetch section data.");
    }
};

    const setParameters = () => {
        setShowOptions(true);
        console.log('Quiz Type', quizType);
        console.log('Num Questions', numQuestions);
    }

    const fetchQuizData = async () => {
        if (!userInput.trim()) {
            alert("Please enter a topic or content for the quiz!");
            return;
        }
        setShowOptions(false);
        setStatusMessage("Generating quiz...");
        setShowModal(false); // Close the modal
        console.log('Quiz Type', quizType);
        console.log('Num Questions', numQuestions);
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }



                            EXAMPLE 4:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }



                            EXAMPLE 5:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 6:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 7:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 8:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 9:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            EXAMPLE 10:
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
    
                            If the user selects a "True/False" quiz, generate the format as:
                            {
                                "title": "Quiz Title",
                                "data": [
                                    {
                                        "question": "Sample question?",
                                        "options": ["True", "False"],
                                        "answer": "Correct Answer"
                                    }
                                ]
                            }

                            MAKE SURE IT IS IN THIS JSON FORMAT OR THE CODE DOESN'T WORK!!!!
                            MAKE SURE IT IS IN THIS JSON FORMAT OR THE CODE DOESN'T WORK!!!!
                            MAKE SURE IT IS IN THIS JSON FORMAT OR THE CODE DOESN'T WORK!!!!
                            MAKE SURE IT IS IN THIS JSON FORMAT OR THE CODE DOESN'T WORK!!!!
                            MAKE SURE IT IS IN THIS JSON FORMAT OR THE CODE DOESN'T WORK!!!!
                            

    
                            THE QUIZ SHOULD CONTAIN ${numQuestions} QUESTIONS.
                            THE QUIZ SHOULD CONTAIN ${numQuestions} QUESTIONS.
                            THE QUIZ SHOULD CONTAIN ${numQuestions} QUESTIONS.
                            THE QUIZ SHOULD CONTAIN ${numQuestions} QUESTIONS.
                            THE QUIZ SHOULD CONTAIN ${numQuestions} QUESTIONS.

                            `,
                        },
                        { role: "user", content: `Generate a ${quizType} quiz based on the following topic: ${userInput}` },
                    ],
                }),
            });
            const data = await response.json();
            console.log("Quiz data fetched:", data);
            const quizContent = JSON.parse(data.choices[0].message.content);
            console.log("Parsed quiz content:", quizContent);
            setQuiz(quizContent);
            setStatusMessage("");
            setShowOptions(false)
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setStatusMessage("Failed to generate quiz.");
            setShowOptions(false);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQuestion = quiz.data[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.answer;

        setSelectedAnswer(selectedOption);
        setIsAnswered(true);

        setAnswers((prev) => [
            ...prev,
            {
                question: currentQuestion.question,
                selectedAnswer: selectedOption,
                correctAnswer: currentQuestion.answer,
                isCorrect,
            },
        ]);

        setTimeout(() => {
            if (currentQuestionIndex < quiz.data.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                console.log("All questions answered, ending quiz.");
                console.log(answers);
                console.log(currentQuestionIndex, quiz.data.length)
                setQuizStarted(false);
                setShowStats(true);
            }
        }, 2000); // Delay to show feedback before moving to the next question
    };

    const handleStartQuiz = () => {
        if (!quiz) {
            alert("Please generate a quiz first!");
            return;
        }
        setShowStats(false);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setIsAnswered(false);
        console.log("Quiz started.");
    };

    const handleStartOver = () => {
        console.log("Starting quiz over.");
        setQuizStarted(false);
        // setQuiz(null);
        // setUserInput("");
        setAnswers([]);
        setStatusMessage("");
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowStats(false);
    };

    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);

    const closeParametersModal = () => {
        setShowOptions(false);
    }

    const showSectionsModal = () => {
        fetchChillSections();
    }

    const closeSectionsModal = () => {
        setShowSections(false);
    }

    // Calculate the number of correct and incorrect answers
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
                            <div style={styles.inputActions}>
                                <button 
                                    // style={styles} 
                                    onClick={showSectionsModal}
                                    className="btn btn-primary"
                                >
                                    Browse Sections
                                </button>
                                {selectedSection && (
                                    <div style={styles.selectedSection}>
                                        <span>Selected: </span>
                                        <strong>{selectedSection}</strong>
                                    </div>
                                )}
                            </div>
                            <textarea
                                    placeholder="Enter your topic or content for the quiz..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    style={styles.textarea}
                                    className="form-control"
                                />
                            <button style={styles.generateButton} onClick={setParameters}>
                                Generate Quiz
                            </button>
                        </div>
                        {quiz && (
                            <button style={styles.startButton} onClick={handleStartQuiz} className="btn btn-primary">
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
                                    Correct Answers: {correctAnswersCount} / {quiz.data.length}
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
                {showStats && (
                    <div style={styles.completionScreen}>
                        <h2 style={styles.completionTitle}>Quiz Completed! 🎉</h2>
                        <p style={styles.statsText}>
                            Correct Answers: <strong>{correctAnswersCount}</strong> / {quiz.data.length}
                        </p>
                        <p style={styles.statsText}>
                            Incorrect Answers: <strong>{incorrectAnswersCount}</strong>
                        </p>
                        <h3 style={styles.feedbackTitle}>Feedback:</h3>
                        <ul style={styles.feedbackList}>
                            {answers.map((answer, index) => (
                                <li
                                    key={index}
                                    style={styles.feedbackItem}
                                >
                                    <p><strong>Q:</strong> {answer.question}</p>
                                    <p>
                                        <strong>Your Answer:</strong> {answer.selectedAnswer}{" "}
                                        {answer.isCorrect ? "✔️" : "❌"}
                                    </p>
                                    <p>
                                        <strong>Correct Answer:</strong> {answer.correctAnswer}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <button style={styles.startOverButton} onClick={handleStartOver} className="btn btn-primary">
                            Start Over
                        </button>
                    </div>
                )}
                
                {showModal && <div style={styles.modal}>Loading... Please wait</div>}
                
                
                {/* Modal for displaying sections */}
            {showSections && (
            <div style={modalStyles.overlay}>
                <div style={modalStyles.content}>
                    <h2>Browse Sections</h2>
                    
                    {/* Search input */}
                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search sections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                            className="form-control"
                        />
                    </div>
                    
                    <div style={styles.sectionsList}>
                    {sections.length > 0 ? (
                        sections
                            .filter(section => 
                                section.section.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((section, index) => (
                                <div 
                                    key={index} 
                                    style={styles.sectionItem}
                                    onClick={() => fetchSectionData(section.section)} 
                                >
                                    {section.section} <br />
                                </div>
                            ))
                    ) : (
                        <p>No sections available</p>
                    )}
                </div>
                <button style={styles.generateButton} onClick={closeSectionsModal}>
                    Close
                </button>
            </div>
        </div>
    )}
                
                {/* Modal for quiz options */}
                {showOptions && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.content}>
                            <h2>Select Quiz Options</h2>
                            <label>
                                Quiz Type:
                                <select
                                    value={quizType}
                                    onChange={(e) => setQuizType(e.target.value)}
                                    style={modalStyles.select}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="true/false">True/False</option>
                                </select>
                            </label>
                            <label>
                                Number of Questions:
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(e.target.value)}
                                    style={modalStyles.input}
                                />
                            </label>
                            <button style={styles.generateButton} onClick={fetchQuizData}>
                                Generate Quiz
                            </button><br /><br />
                            <button style={styles.generateButton} onClick={closeParametersModal}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    

    container: { fontFamily: "Arial, sans-serif" },
    mainBody: { padding: "20px" },
    inputContainer: { marginBottom: "20px" },
    inputActions: { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px" 
    },
    selectedSection: {
        padding: "5px 10px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
        fontSize: "14px"
    },
    textarea: { width: "100%", height: "100px", padding: "10px", marginBottom: "10px" },
    browseButton: { padding: "8px 15px", background: "#6c757d", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" },
    generateButton: { padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" },
    startButton: { padding: "10px 20px", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" },
    questionContainer: { marginBottom: "30px" },
    optionsList: { listStyle: "none", padding: "0" },
    option: { padding: "10px", margin: "5px 0", cursor: "pointer" },
    modal: { position: "fixed", top: "0", left: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" },
    statusMessage: { color: "#0d11f0", fontSize: "18px", textAlign: "center", marginBottom: "10px" },
    quizTitle: { fontSize: "24px", textAlign: "center", marginBottom: "20px" },
    sectionsList: {
        maxHeight: "300px",
        overflowY: "auto",
        margin: "15px 0",
        border: "1px solid #dee2e6",
        borderRadius: "5px",
    },
    sectionItem: {
        padding: "10px 15px",
        borderBottom: "1px solid #dee2e6",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        hoverBackgroundColor: "#f8f9fa",
    },
    completionScreen: {
        textAlign: "center",
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "0 auto"
    },
    completionTitle: {
        fontSize: "24px",
        color: "#333",
        marginBottom: "20px",
    },
    statsText: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "10px",
    },
    feedbackTitle: {
        fontSize: "20px",
        color: "#333",
        marginBottom: "15px",
    },
    feedbackList: {
        listStyle: "none",
        paddingLeft: "0",
        textAlign: "left",
        margin: "0",
    },
    feedbackItem: {
        backgroundColor: "#fff",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    startOverButton: {
        padding: "10px 20px",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "20px",
        fontSize: "16px",
    },

    searchContainer: {
        marginBottom: '15px',
        width: '100%',
      },
      searchInput: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
      }
};

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    content: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxHeight: "80vh",
        overflowY: "auto",
    },
    select: {
        width: "100%",
        marginBottom: "10px",
        padding: "8px",
    },
    input: {
        width: "100%",
        marginBottom: "20px",
        padding: "8px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },
};