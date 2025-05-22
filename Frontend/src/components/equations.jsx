import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Play, Pause, RefreshCw, Brain, Eye, Quote, Volume2, ChevronDown, ChevronUp, Zap, Target, Sparkles } from "lucide-react";

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

    // New state for our features
    const [currentEquation, setCurrentEquation] = useState(0);
    const [explanation, setExplanation] = useState("");
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(0);
    const [waveAnimation, setWaveAnimation] = useState(false);
    const [selectedScientist, setSelectedScientist] = useState(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [showObservatory, setShowObservatory] = useState(false);
    const [observatoryValue, setObservatoryValue] = useState(1);

    const equations = [
        {
            name: "Einstein's Mass-Energy Equivalence",
            equation: "E = mc²",
            context: "Special Relativity",
            description: "The most famous equation in physics, showing the equivalence of mass and energy.",
            field: "Physics",
            color: "#FF6B6B"
        },
        {
            name: "Schrödinger Equation",
            equation: "iℏ ∂ψ/∂t = Ĥψ",
            context: "Quantum Mechanics", 
            description: "The fundamental equation governing quantum mechanical systems.",
            field: "Physics",
            color: "#4ECDC4"
        },
        {
            name: "Euler's Identity",
            equation: "e^(iπ) + 1 = 0",
            context: "Complex Analysis",
            description: "Often called the most beautiful equation in mathematics.",
            field: "Mathematics",
            color: "#45B7D1"
        },
        {
            name: "Black-Scholes Equation",
            equation: "∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S - rV = 0",
            context: "Financial Mathematics",
            description: "The cornerstone of modern quantitative finance for option pricing.",
            field: "Finance",
            color: "#96CEB4"
        },
        {
            name: "Maxwell's Equations (Gauss's Law)",
            equation: "∇ · E = ρ/ε₀",
            context: "Electromagnetism",
            description: "One of the four fundamental equations describing electromagnetic fields.",
            field: "Physics",
            color: "#FFEAA7"
        },
        {
            name: "Navier-Stokes Equation",
            equation: "ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + f",
            context: "Fluid Dynamics",
            description: "Describes the motion of viscous fluid substances - a Clay Millennium Prize problem.",
            field: "Physics",
            color: "#DDA0DD"
        }
    ];

    const quotes = [
        {
            author: "Albert Einstein",
            quote: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
            field: "Physics"
        },
        {
            author: "Richard Feynman", 
            quote: "I would rather have questions that can't be answered than answers that can't be questioned.",
            field: "Physics"
        },
        {
            author: "Carl Friedrich Gauss",
            quote: "Mathematics is the queen of sciences and number theory is the queen of mathematics.",
            field: "Mathematics"
        },
        {
            author: "Isaac Newton",
            quote: "If I have seen further it is by standing on the shoulders of giants.",
            field: "Physics"
        },
        {
            author: "Marie Curie",
            quote: "Nothing in life is to be feared, it is only to be understood.",
            field: "Physics"
        },
        {
            author: "Leonhard Euler",
            quote: "Read Euler, read Euler, he is the master of us all.",
            field: "Mathematics"
        }
    ];

    const scientists = [
        {
            name: "Albert Einstein",
            field: "Theoretical Physics",
            born: "1879-1955",
            summary: "German-born theoretical physicist who revolutionized physics with his theories of relativity. Won Nobel Prize in 1921 for photoelectric effect. Known for wild hair, deep thoughts, and changing our understanding of space, time, and gravity forever."
        },
        {
            name: "Richard Feynman",
            field: "Quantum Physics",
            born: "1918-1988", 
            summary: "American physicist known for his work in quantum mechanics and particle physics. Won Nobel Prize in 1965. Famous for his curiosity, humor, and ability to explain complex concepts simply. Also played bongo drums and cracked safes for fun."
        },
        {
            name: "Marie Curie",
            field: "Radioactivity",
            born: "1867-1934",
            summary: "Polish-French physicist and chemist who conducted pioneering research on radioactivity. First woman to win Nobel Prize, first person to win Nobel Prizes in two different sciences. Her notebooks are still radioactive today."
        },
        {
            name: "Isaac Newton",
            field: "Classical Mechanics",
            born: "1643-1727",
            summary: "English mathematician and physicist who laid foundations of classical mechanics. Invented calculus, formulated laws of motion and universal gravitation. Legend says he discovered gravity when an apple fell on his head."
        }
    ];

    // API call to get equation explanation
    const generateExplanation = async (equation) => {
        if (!OPENAI_API_KEY) return;
        
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
                        content: `Explain this equation in simple but engaging terms for someone with a Grade 12 math background who works in quant finance: ${equation.equation} (${equation.name}). Make it about 100-150 words and focus on intuition and real-world applications.`
                    }],
                    max_tokens: 200,
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

    const nextEquation = () => {
        setCurrentEquation((prev) => (prev + 1) % equations.length);
        setExplanation("");
    };

    const nextQuote = () => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
    };

    const triggerWaveAnimation = () => {
        setWaveAnimation(true);
        setTimeout(() => setWaveAnimation(false), 2000);
    };

    const simulateAudioPlay = (scientist) => {
        setIsPlayingAudio(true);
        setSelectedScientist(scientist);
        // Simulate audio duration
        setTimeout(() => setIsPlayingAudio(false), 5000);
    };

    // Observatory visualization functions
    const renderSineWave = () => {
        const points = [];
        for (let x = 0; x <= 360; x += 5) {
            const y = 50 + 30 * Math.sin((x * Math.PI / 180) * observatoryValue);
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    const renderFibonacciSpiral = () => {
        const fib = [1, 1];
        for (let i = 2; i < 10; i++) {
            fib[i] = fib[i-1] + fib[i-2];
        }
        
        let path = '';
        let x = 100, y = 100;
        
        for (let i = 0; i < 8; i++) {
            const size = fib[i] * 2;
            path += `M ${x} ${y} A ${size} ${size} 0 0 1 ${x + size} ${y + size} `;
            x += size;
            y += size;
        }
        
        return path;
    };

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Equations & Physics Playground</h5>
                    <br />
                    
                    {/* Equation of the Day */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4" style={{borderLeftColor: equations[currentEquation].color}}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Zap className="mr-2" style={{color: equations[currentEquation].color}} />
                                Equation of the Day
                            </h3>
                            <button 
                                onClick={nextEquation}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Next
                            </button>
                        </div>
                        
                        <div className="text-center mb-4">
                            <div 
                                className={`text-4xl font-mono bg-gray-50 p-6 rounded-lg mb-4 transition-all duration-500 ${waveAnimation ? 'transform scale-105 shadow-lg' : ''}`}
                                style={{color: equations[currentEquation].color}}
                                onClick={triggerWaveAnimation}
                            >
                                {equations[currentEquation].equation}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-700">{equations[currentEquation].name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{equations[currentEquation].context} • {equations[currentEquation].field}</p>
                            <p className="text-gray-600">{equations[currentEquation].description}</p>
                        </div>

                        {/* Break it Down Feature */}
                        <div className="border-t pt-4">
                            <button 
                                onClick={() => generateExplanation(equations[currentEquation])}
                                disabled={isLoadingExplanation || !OPENAI_API_KEY}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center mb-3 transition-colors"
                            >
                                <Brain className="w-4 h-4 mr-2" />
                                {isLoadingExplanation ? "Breaking it down..." : "Break it Down"}
                            </button>
                            
                            {explanation && (
                                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                    <p className="text-gray-700">{explanation}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observatory */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Eye className="mr-2 text-purple-500" />
                                Mathematical Observatory
                            </h3>
                            <button 
                                onClick={() => setShowObservatory(!showObservatory)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                {showObservatory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        {showObservatory && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sine Wave Visualization */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Sine Wave: y = sin({observatoryValue}x)</h4>
                                        <svg width="100%" height="120" viewBox="0 0 360 100" className="border rounded">
                                            <polyline
                                                fill="none"
                                                stroke="#4ECDC4"
                                                strokeWidth="2"
                                                points={renderSineWave()}
                                            />
                                        </svg>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="3"
                                            step="0.1"
                                            value={observatoryValue}
                                            onChange={(e) => setObservatoryValue(parseFloat(e.target.value))}
                                            className="w-full mt-2"
                                        />
                                        <p className="text-sm text-gray-600 mt-1">Frequency: {observatoryValue}</p>
                                    </div>

                                    {/* Golden Ratio Spiral */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Fibonacci Spiral (φ = 1.618...)</h4>
                                        <svg width="100%" height="120" viewBox="0 0 200 120" className="border rounded">
                                            <path
                                                fill="none"
                                                stroke="#FFD93D"
                                                strokeWidth="2"
                                                d={renderFibonacciSpiral()}
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-600 mt-2">The golden ratio appears everywhere in nature!</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quote Generator */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Quote className="mr-2 text-indigo-500" />
                                Wisdom from the Giants
                            </h3>
                            <button 
                                onClick={nextQuote}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                New Quote
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <blockquote className="text-lg italic text-gray-700 mb-4">
                                "{quotes[currentQuote].quote}"
                            </blockquote>
                            <cite className="text-sm font-semibold text-gray-600">
                                — {quotes[currentQuote].author}, {quotes[currentQuote].field}
                            </cite>
                        </div>
                    </div>

                    {/* Scientist Audio Biographies */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Volume2 className="mr-2 text-orange-500" />
                            Scientist Life Stories
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {scientists.map((scientist, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{scientist.name}</h4>
                                            <p className="text-sm text-gray-600">{scientist.field} • {scientist.born}</p>
                                        </div>
                                        <button
                                            onClick={() => simulateAudioPlay(scientist)}
                                            disabled={isPlayingAudio}
                                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
                                        >
                                            {isPlayingAudio && selectedScientist?.name === scientist.name ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-700">{scientist.summary}</p>
                                    
                                    {isPlayingAudio && selectedScientist?.name === scientist.name && (
                                        <div className="mt-2 bg-orange-100 p-2 rounded text-sm text-orange-800">
                                            🎵 Playing AI-generated biography... (This is a simulation)
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <Target className="mr-2" />
                            Did You Know?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>• The number π appears in the most unexpected places, including the probability that two random numbers are coprime!</div>
                            <div>• E=mc² means a single raisin contains enough energy to power a city for a day (if we could convert it all).</div>
                            <div>• The Black-Scholes equation assumes constant volatility - which is why quant models keep evolving!</div>
                            <div>• Schrödinger's cat was meant to show how absurd quantum mechanics seemed, not support it!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}