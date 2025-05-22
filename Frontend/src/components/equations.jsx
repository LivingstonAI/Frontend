
import React, { useEffect, useState } from "react";
import { 
    Play, Pause, RefreshCw, Brain, Eye, Quote, Volume2, VolumeX, ChevronDown, ChevronUp, 
    Zap, Target, Sparkles, X, Search, Calendar, BookOpen, Headphones, Activity,
    TrendingUp, PieChart, BarChart3, Waves, Atom, FlaskConical, Lightbulb
} from "lucide-react";

export default function Equations() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    
    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };
  
    useEffect(() => {
        console.log("Fetching API key...");
        fetchAPIKey();
    }, []);

    // Core state
    const [currentEquation, setCurrentEquation] = useState(null);
    const [currentQuote, setCurrentQuote] = useState(null);
    const [currentScientist, setCurrentScientist] = useState(null);
    const [currentVisualization, setCurrentVisualization] = useState('sine');
    const [explanation, setExplanation] = useState("");
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    
    // Modal states
    const [showEquationModal, setShowEquationModal] = useState(false);
    const [showScientistModal, setShowScientistModal] = useState(false);
    const [showVisualizationModal, setShowVisualizationModal] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    
    // Audio and visualization states
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [visualizationParams, setVisualizationParams] = useState({
        amplitude: 1,
        frequency: 1,
        phase: 0,
        coefficient: 1
    });
    const [animationFrame, setAnimationFrame] = useState(0);

    // Initialize speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    // Animation loop for visualizations
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationFrame(prev => prev + 0.1);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Base equation templates for AI generation
    const equationCategories = [
        'Physics - Classical Mechanics',
        'Physics - Quantum Mechanics', 
        'Physics - Thermodynamics',
        'Physics - Electromagnetism',
        'Mathematics - Calculus',
        'Mathematics - Linear Algebra',
        'Mathematics - Number Theory',
        'Finance - Derivatives',
        'Finance - Risk Management',
        'Computer Science - Algorithms',
        'Statistics - Probability',
        'Chemistry - Kinetics'
    ];

    // Visualization functions
    const visualizationTypes = {
        sine: {
            name: 'Sine Wave',
            description: 'Classic trigonometric function',
            icon: Waves,
            render: () => {
                const points = [];
                for (let x = 0; x <= 400; x += 2) {
                    const y = 100 + visualizationParams.amplitude * 50 * Math.sin(
                        (x * Math.PI / 50) * visualizationParams.frequency + 
                        visualizationParams.phase + animationFrame
                    );
                    points.push(`${x},${y}`);
                }
                return (
                    <svg width="100%" height="200" viewBox="0 0 400 200" className="border rounded-lg">
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            points={points.join(' ')}
                        />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="#E5E7EB" strokeWidth="1" />
                    </svg>
                );
            }
        },
        cosine: {
            name: 'Cosine Wave',
            description: 'Phase-shifted sine function',
            icon: Activity,
            render: () => {
                const points = [];
                for (let x = 0; x <= 400; x += 2) {
                    const y = 100 + visualizationParams.amplitude * 50 * Math.cos(
                        (x * Math.PI / 50) * visualizationParams.frequency + animationFrame
                    );
                    points.push(`${x},${y}`);
                }
                return (
                    <svg width="100%" height="200" viewBox="0 0 400 200" className="border rounded-lg">
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            points={points.join(' ')}
                        />
                    </svg>
                );
            }
        },
        parabola: {
            name: 'Parabolic Function',
            description: 'Quadratic curve y = ax²',
            icon: TrendingUp,
            render: () => {
                const points = [];
                for (let x = -100; x <= 100; x += 2) {
                    const y = 150 - (visualizationParams.coefficient * x * x) / 200;
                    if (y >= 0 && y <= 200) {
                        points.push(`${x + 200},${y}`);
                    }
                }
                return (
                    <svg width="100%" height="200" viewBox="0 0 400 200" className="border rounded-lg">
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            points={points.join(' ')}
                        />
                    </svg>
                );
            }
        },
        exponential: {
            name: 'Exponential Growth',
            description: 'Natural exponential function',
            icon: BarChart3,
            render: () => {
                const points = [];
                for (let x = 0; x <= 200; x += 2) {
                    const y = 180 - Math.min(150, Math.exp((x - 100) / 50) * visualizationParams.coefficient);
                    if (y >= 0) {
                        points.push(`${x + 100},${y}`);
                    }
                }
                return (
                    <svg width="100%" height="200" viewBox="0 0 400 200" className="border rounded-lg">
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            points={points.join(' ')}
                        />
                    </svg>
                );
            }
        },
        spiral: {
            name: 'Logarithmic Spiral',
            description: 'Nature\'s favorite curve',
            icon: PieChart,
            render: () => {
                let path = '';
                for (let t = 0; t <= 6 * Math.PI; t += 0.1) {
                    const r = 5 * Math.exp(0.2 * t) * visualizationParams.amplitude;
                    const x = 200 + r * Math.cos(t + animationFrame);
                    const y = 100 + r * Math.sin(t + animationFrame);
                    
                    if (t === 0) {
                        path += `M ${x} ${y} `;
                    } else {
                        path += `L ${x} ${y} `;
                    }
                }
                return (
                    <svg width="100%" height="200" viewBox="0 0 400 200" className="border rounded-lg">
                        <path
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            d={path}
                        />
                    </svg>
                );
            }
        }
    };

    // AI Generation Functions
    const generateEquation = async (category) => {
        if (!OPENAI_API_KEY) return null;
        
        setIsGeneratingContent(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{
                        role: 'user',
                        content: `Generate a specific equation from ${category}. Format your response as JSON with: 
                        {
                            "name": "equation name",
                            "equation": "actual equation with proper symbols",
                            "context": "brief context",
                            "description": "2-3 sentence description",
                            "field": "field name",
                            "realWorldApplication": "practical application example",
                            "funFact": "interesting fact about this equation"
                        }
                        Make it engaging for someone new to the field but with Grade 12 math background.`
                    }],
                    max_tokens: 300,
                    temperature: 0.8
                })
            });
            
            const data = await response.json();
            const equation = JSON.parse(data.choices[0].message.content);
            return { ...equation, color: "#3B82F6" };
        } catch (error) {
            console.error('Error generating equation:', error);
            return null;
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const generateScientist = async () => {
        if (!OPENAI_API_KEY) return null;
        
        setIsGeneratingContent(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{
                        role: 'user',
                        content: `Generate information about a fascinating scientist or mathematician (not just the famous ones!). Format as JSON:
                        {
                            "name": "scientist name",
                            "field": "field/specialty",
                            "born": "birth-death years",
                            "nationality": "nationality",
                            "summary": "engaging 3-4 sentence biography",
                            "majorContribution": "key discovery/theory",
                            "quirkyFact": "interesting personal detail",
                            "modernRelevance": "why they matter today"
                        }
                        Include diverse scientists from different backgrounds and eras.`
                    }],
                    max_tokens: 350,
                    temperature: 0.9
                })
            });
            
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating scientist:', error);
            return null;
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const generateQuote = async () => {
        if (!OPENAI_API_KEY) return null;
        
        setIsGeneratingContent(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{
                        role: 'user',
                        content: `Generate an inspiring quote about mathematics, physics, or scientific discovery. Format as JSON:
                        {
                            "quote": "the actual quote",
                            "author": "author name",
                            "field": "their field",
                            "context": "brief context about when/why they said this",
                            "modernApplication": "how this applies to learning today"
                        }
                        Include both famous and lesser-known thinkers. Make it motivational for someone learning math/physics.`
                    }],
                    max_tokens: 250,
                    temperature: 0.8
                })
            });
            
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating quote:', error);
            return null;
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const generateExplanation = async (equation) => {
        if (!OPENAI_API_KEY || !equation) return;
        
        setIsLoadingExplanation(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{
                        role: 'user',
                        content: `Explain this equation in an engaging, intuitive way: ${equation.equation} (${equation.name}). 
                        The audience is someone with Grade 12 math who wants to fall in love with mathematics again.
                        Use analogies, real-world examples, and focus on the "why" and "so what".
                        Keep it 150-200 words and make it inspiring!`
                    }],
                    max_tokens: 250,
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            setExplanation(data.choices[0].message.content);
        } catch (error) {
            console.error('Error generating explanation:', error);
            setExplanation("Unable to generate explanation at the moment. Try again later!");
        }
        setIsLoadingExplanation(false);
    };

    // Text-to-speech function
    const speakText = (text) => {
        if (!speechSynthesis) return;
        
        if (isPlayingAudio) {
            speechSynthesis.cancel();
            setIsPlayingAudio(false);
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        
        speechSynthesis.speak(utterance);
    };

    // Modal Components
    const EquationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Choose Equation Category</h3>
                        <button 
                            onClick={() => setShowEquationModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-2">
                        {equationCategories.map((category, index) => (
                            <button
                                key={index}
                                onClick={async () => {
                                    const equation = await generateEquation(category);
                                    if (equation) {
                                        setCurrentEquation(equation);
                                        setExplanation("");
                                    }
                                    setShowEquationModal(false);
                                }}
                                disabled={isGeneratingContent}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50"
                            >
                                <div className="font-medium text-gray-800">{category}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const VisualizationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Choose Visualization</h3>
                        <button 
                            onClick={() => setShowVisualizationModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-2">
                        {Object.entries(visualizationTypes).map(([key, viz]) => {
                            const IconComponent = viz.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setCurrentVisualization(key);
                                        setShowVisualizationModal(false);
                                    }}
                                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                >
                                    <IconComponent className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-800">{viz.name}</div>
                                        <div className="text-sm text-gray-600">{viz.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Mathematical & Physics Playground
                </h1>
                
                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={() => setShowEquationModal(true)}
                        className="bg-white hover:bg-blue-50 rounded-lg shadow-lg p-4 border-l-4 border-blue-600 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">New Equation</h3>
                                <p className="text-sm text-gray-600">Discover mathematics</p>
                            </div>
                            <Zap className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={async () => {
                            const scientist = await generateScientist();
                            if (scientist) setCurrentScientist(scientist);
                        }}
                        disabled={isGeneratingContent}
                        className="bg-white hover:bg-blue-50 rounded-lg shadow-lg p-4 border-l-4 border-blue-600 transition-colors group disabled:opacity-50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">Meet a Genius</h3>
                                <p className="text-sm text-gray-600">Inspiring scientists</p>
                            </div>
                            <Brain className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => setShowVisualizationModal(true)}
                        className="bg-white hover:bg-blue-50 rounded-lg shadow-lg p-4 border-l-4 border-blue-600 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">Visualize</h3>
                                <p className="text-sm text-gray-600">See math in action</p>
                            </div>
                            <Eye className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={async () => {
                            const quote = await generateQuote();
                            if (quote) setCurrentQuote(quote);
                        }}
                        disabled={isGeneratingContent}
                        className="bg-white hover:bg-blue-50 rounded-lg shadow-lg p-4 border-l-4 border-blue-600 transition-colors group disabled:opacity-50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">Get Inspired</h3>
                                <p className="text-sm text-gray-600">Wisdom & quotes</p>
                            </div>
                            <Sparkles className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </button>
                </div>

                {/* Current Equation Display */}
                {currentEquation && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Zap className="mr-2 text-blue-600" />
                                {currentEquation.name}
                            </h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => speakText(`${currentEquation.name}. ${currentEquation.description}. ${currentEquation.funFact}`)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                                    title="Listen to equation"
                                >
                                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="text-center mb-4">
                            <div className="text-4xl font-mono bg-blue-50 p-6 rounded-lg mb-4 text-blue-800">
                                {currentEquation.equation}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-700">{currentEquation.context} • {currentEquation.field}</h4>
                            <p className="text-gray-600 mb-2">{currentEquation.description}</p>
                            
                            {currentEquation.funFact && (
                                <div className="bg-yellow-50 p-3 rounded-lg mb-3 border-l-4 border-yellow-400">
                                    <p className="text-sm text-yellow-800">
                                        <Lightbulb className="w-4 h-4 inline mr-1" />
                                        <strong>Fun Fact:</strong> {currentEquation.funFact}
                                    </p>
                                </div>
                            )}
                            
                            {currentEquation.realWorldApplication && (
                                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                    <p className="text-sm text-green-800">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        <strong>Real World:</strong> {currentEquation.realWorldApplication}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <button 
                                onClick={() => generateExplanation(currentEquation)}
                                disabled={isLoadingExplanation || !OPENAI_API_KEY}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center mb-3 transition-colors"
                            >
                                <Brain className="w-4 h-4 mr-2" />
                                {isLoadingExplanation ? "Breaking it down..." : "Break it Down"}
                            </button>
                            
                            {explanation && (
                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                    <p className="text-gray-700">{explanation}</p>
                                    <button 
                                        onClick={() => speakText(explanation)}
                                        className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                    >
                                        <Headphones className="w-4 h-4 mr-1" />
                                        Listen to explanation
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Current Scientist Display */}
                {currentScientist && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{currentScientist.name}</h3>
                                <p className="text-blue-600 font-medium">{currentScientist.field} • {currentScientist.nationality}</p>
                                <p className="text-sm text-gray-600">{currentScientist.born}</p>
                            </div>
                            <button 
                                onClick={() => speakText(`${currentScientist.name} was a ${currentScientist.field} expert. ${currentScientist.summary} ${currentScientist.quirkyFact} ${currentScientist.modernRelevance}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            >
                                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{currentScientist.summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-1">Major Contribution</h4>
                                <p className="text-sm text-blue-700">{currentScientist.majorContribution}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-1">Fun Fact</h4>
                                <p className="text-sm text-purple-700">{currentScientist.quirkyFact}</p>
                            </div>
                        </div>
                        
                        {currentScientist.modernRelevance && (
                            <div className="mt-4 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                <h4 className="font-semibold text-green-800 mb-1">Why They Matter Today</h4>
                                <p className="text-sm text-green-700">{currentScientist.modernRelevance}</p>
                            </div>
                        )}
                    </div>
                )}
                     {/* Current Quote Display */}
                    {currentQuote && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Quote className="mr-2 text-blue-600" />
                                    Words of Wisdom
                                </h3>
                                <button 
                                    onClick={() => speakText(`${currentQuote.author} once said: ${currentQuote.quote}. ${currentQuote.context} ${currentQuote.modernApplication}`)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                                >
                                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <blockquote className="text-lg italic text-gray-700 mb-4">
                                    "{currentQuote.quote}"
                                </blockquote>
                                <cite className="text-sm font-semibold text-blue-600 mb-2 block">
                                    — {currentQuote.author}, {currentQuote.field}
                                </cite>
                                
                                {currentQuote.context && (
                                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                                        <p className="text-sm text-blue-800">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            <strong>Context:</strong> {currentQuote.context}
                                        </p>
                                    </div>
                                )}
                                
                                {currentQuote.modernApplication && (
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            <Lightbulb className="w-4 h-4 inline mr-1" />
                                            <strong>For You:</strong> {currentQuote.modernApplication}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mathematical Visualization */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Eye className="mr-2 text-blue-600" />
                                Mathematical Visualization
                            </h3>
                            <button 
                                onClick={() => setShowVisualizationModal(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Change Function
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">
                                {visualizationTypes[currentVisualization].name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                {visualizationTypes[currentVisualization].description}
                            </p>
                            
                            {visualizationTypes[currentVisualization].render()}
                        </div>
                        
                        {/* Interactive Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amplitude: {visualizationParams.amplitude}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={visualizationParams.amplitude}
                                    onChange={(e) => setVisualizationParams(prev => ({
                                        ...prev,
                                        amplitude: parseFloat(e.target.value)
                                    }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency: {visualizationParams.frequency}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5"
                                    step="0.1"
                                    value={visualizationParams.frequency}
                                    onChange={(e) => setVisualizationParams(prev => ({
                                        ...prev,
                                        frequency: parseFloat(e.target.value)
                                    }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phase: {visualizationParams.phase.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="6.28"
                                    step="0.1"
                                    value={visualizationParams.phase}
                                    onChange={(e) => setVisualizationParams(prev => ({
                                        ...prev,
                                        phase: parseFloat(e.target.value)
                                    }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coefficient: {visualizationParams.coefficient}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={visualizationParams.coefficient}
                                    onChange={(e) => setVisualizationParams(prev => ({
                                        ...prev,
                                        coefficient: parseFloat(e.target.value)
                                    }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <button 
                                onClick={() => speakText(`This is a ${visualizationTypes[currentVisualization].name}. ${visualizationTypes[currentVisualization].description}. You can adjust the amplitude, frequency, phase, and coefficient to see how the function changes. Mathematics is all around us in wave patterns, growth curves, and natural spirals.`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
                            >
                                <Headphones className="w-4 h-4 mr-2" />
                                Learn About This Function
                            </button>
                        </div>
                    </div>

                    {/* Fun Math Facts */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <Target className="mr-2" />
                            Amazing Mathematical Facts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                <FlaskConical className="w-5 h-5 mb-2" />
                                The number π appears in the probability that two random numbers share no common factors - it's everywhere!
                            </div>
                            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                <Atom className="w-5 h-5 mb-2" />
                                Euler's identity e^(iπ) + 1 = 0 connects five of the most important numbers in mathematics in one beautiful equation.
                            </div>
                            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                <Waves className="w-5 h-5 mb-2" />
                                The same mathematics that describes ocean waves also explains quantum mechanics and the behavior of light.
                            </div>
                            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                <Sparkles className="w-5 h-5 mb-2" />
                                The Fibonacci sequence appears in flower petals, nautilus shells, and even the structure of galaxies!
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <button 
                                onClick={() => speakText("Mathematics is the universal language that describes everything from the smallest quantum particles to the largest cosmic structures. Every equation tells a story about how our universe works, and every pattern reveals the hidden order in apparent chaos. Keep exploring, and you'll discover that math isn't just numbers - it's the poetry of logical reasoning and the art of discovering truth.")}
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
                            >
                                <Volume2 className="w-4 h-4 mr-2" />
                                Hear the Magic of Mathematics
                            </button>
                        </div>
                    </div>

                    {/* Loading States */}
                    {isGeneratingContent && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                            <div className="flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
                                <span className="text-gray-700">Generating amazing content for you...</span>
                            </div>
                        </div>
                    )}

                        </div>
                
                            {/* Modals */}
                            {showEquationModal && <EquationModal />}
                            {showVisualizationModal && <VisualizationModal />}
            </div>
        // </div>
    );
}