import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function ProcessChecker() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [responses, setResponses] = useState({
        emotionalState: '',
        tradingLogic: '',
        strategyAlignment: '',
        sessionPerformance: '',
        riskExposure: '',
        marketConditions: '',
        mentorApproval: ''
    });
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFinalAction, setShowFinalAction] = useState(false);

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

    const handleResponse = (field, value) => {
        setResponses(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = () => {
        if (currentStep < 7) {
            setCurrentStep(currentStep + 1);
        } else {
            analyzeResponses();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const analyzeResponses = async () => {
        setIsAnalyzing(true);
        try {
            const analysisPrompt = `
                Analyze these trading validation responses and provide a 1-2 sentence AI feedback:
                
                Emotional State: ${responses.emotionalState}
                Trading Logic: ${responses.tradingLogic}
                Strategy Alignment: ${responses.strategyAlignment}
                Session Performance: ${responses.sessionPerformance}
                Risk Exposure: ${responses.riskExposure}
                Market Conditions: ${responses.marketConditions}
                Mentor Approval: ${responses.mentorApproval}
                
                Flag any concerns and give brief advice. Focus on emotional state, rule-breaking, overexposure, or market mismatch.
            `;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'user',
                            content: analysisPrompt
                        }
                    ],
                    max_tokens: 150
                })
            });

            const data = await response.json();
            setAiAnalysis(data.choices[0].message.content);
            setShowFinalAction(true);
        } catch (error) {
            console.error('Error analyzing responses:', error);
            setAiAnalysis('Analysis unavailable. Please review your responses manually.');
            setShowFinalAction(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetChecker = () => {
        setCurrentStep(1);
        setResponses({
            emotionalState: '',
            tradingLogic: '',
            strategyAlignment: '',
            sessionPerformance: '',
            riskExposure: '',
            marketConditions: '',
            mentorApproval: ''
        });
        setAiAnalysis('');
        setShowFinalAction(false);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">1️⃣ How do you feel right now?</h3>
                        <div className="pc-emotion-options-unique">
                            {[
                                { value: 'calm', emoji: '😎', text: 'Calm and focused' },
                                { value: 'neutral', emoji: '😐', text: 'Neutral, just following the plan' },
                                { value: 'anxious', emoji: '😕', text: 'Anxious or rushed' },
                                { value: 'frustrated', emoji: '😠', text: 'Frustrated (from past losses?)' },
                                { value: 'overconfident', emoji: '😁', text: 'Overconfident (feeling invincible?)' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-emotion-btn-unique ${responses.emotionalState === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('emotionalState', option.value)}
                                >
                                    <span className="pc-emoji-unique">{option.emoji}</span>
                                    <span className="pc-emotion-text-unique">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">2️⃣ What is your primary logic for this position?</h3>
                        <p className="pc-step-hint-unique">👉 E.g., My model indicates a long opportunity based on XYZ. Backtest supports it. News aligns.</p>
                        <textarea
                            className="pc-textarea-unique"
                            placeholder="Describe your trading logic in detail..."
                            value={responses.tradingLogic}
                            onChange={(e) => handleResponse('tradingLogic', e.target.value)}
                            rows="4"
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">3️⃣ Does this trade align with your pre-defined strategy?</h3>
                        <div className="pc-alignment-options-unique">
                            {[
                                { value: 'fully-aligns', icon: '✅', text: 'Yes — it fully aligns' },
                                { value: 'partially-aligns', icon: '⚠️', text: 'Partially aligns, but I see an opportunity' },
                                { value: 'no-alignment', icon: '❌', text: 'No — this is instinct or revenge trading' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-alignment-btn-unique ${responses.strategyAlignment === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('strategyAlignment', option.value)}
                                >
                                    <span className="pc-icon-unique">{option.icon}</span>
                                    <span className="pc-alignment-text-unique">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">4️⃣ What is your historical performance during this session?</h3>
                        <p className="pc-step-hint-unique">👉 Prompt: Is this normally a strong or weak session for you?</p>
                        <div className="pc-performance-options-unique">
                            {[
                                { value: 'strong', text: 'Strong' },
                                { value: 'neutral', text: 'Neutral' },
                                { value: 'weak', text: 'Weak' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-performance-btn-unique ${responses.sessionPerformance === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('sessionPerformance', option.value)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">5️⃣ What is your current drawdown / risk exposure today?</h3>
                        <p className="pc-step-hint-unique">👉 Prompt: Will this trade risk breaching your daily loss cap?</p>
                        <div className="pc-risk-options-unique">
                            {[
                                { value: 'within-limits', text: 'Within limits', color: 'green' },
                                { value: 'close-to-limit', text: 'Close to limit', color: 'orange' },
                                { value: 'exceeds-limit', text: 'Exceeds limit', color: 'red' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-risk-btn-unique pc-risk-${option.color}-unique ${responses.riskExposure === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('riskExposure', option.value)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">6️⃣ Does this trade match your market conditions criteria?</h3>
                        <div className="pc-market-options-unique">
                            {[
                                { value: 'conditions-match', icon: '✅', text: 'Yes, conditions are as required' },
                                { value: 'conditions-dont-match', icon: '❌', text: 'No, market isn\'t right but I\'m tempted' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-market-btn-unique ${responses.marketConditions === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('marketConditions', option.value)}
                                >
                                    <span className="pc-icon-unique">{option.icon}</span>
                                    <span className="pc-market-text-unique">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="pc-step-container-unique">
                        <h3 className="pc-step-title-unique">7️⃣ Final check — if your mentor/AI/you in 5 years saw this trade, would they approve?</h3>
                        <div className="pc-mentor-options-unique">
                            {[
                                { value: 'mentor-approve', icon: '✅', text: 'Yes — sound logic, within plan' },
                                { value: 'mentor-disapprove', icon: '❌', text: 'No — I\'d be embarrassed' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`pc-mentor-btn-unique ${responses.mentorApproval === option.value ? 'pc-selected-unique' : ''}`}
                                    onClick={() => handleResponse('mentorApproval', option.value)}
                                >
                                    <span className="pc-icon-unique">{option.icon}</span>
                                    <span className="pc-mentor-text-unique">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return responses.emotionalState !== '';
            case 2: return responses.tradingLogic.trim() !== '';
            case 3: return responses.strategyAlignment !== '';
            case 4: return responses.sessionPerformance !== '';
            case 5: return responses.riskExposure !== '';
            case 6: return responses.marketConditions !== '';
            case 7: return responses.mentorApproval !== '';
            default: return false;
        }
    };

    return (
        <div>
            <style jsx>{`
                .pc-main-container-unique {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .pc-progress-bar-unique {
                    width: 100%;
                    height: 8px;
                    background: #e3f2fd;
                    border-radius: 4px;
                    margin-bottom: 30px;
                    overflow: hidden;
                }

                .pc-progress-fill-unique {
                    height: 100%;
                    background: linear-gradient(90deg, #2196f3, #1976d2);
                    transition: width 0.3s ease;
                }

                .pc-step-container-unique {
                    margin-bottom: 30px;
                }

                .pc-step-title-unique {
                    color: #1976d2;
                    margin-bottom: 20px;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .pc-step-hint-unique {
                    color: #666;
                    font-style: italic;
                    margin-bottom: 15px;
                }

                .pc-emotion-options-unique {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .pc-emotion-btn-unique {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid #e3f2fd;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                }

                .pc-emotion-btn-unique:hover {
                    border-color: #2196f3;
                    background: #f5f9ff;
                }

                .pc-emotion-btn-unique.pc-selected-unique {
                    border-color: #2196f3;
                    background: #e3f2fd;
                }

                .pc-emoji-unique {
                    font-size: 1.5rem;
                    margin-right: 15px;
                }

                .pc-emotion-text-unique {
                    font-size: 1rem;
                    color: #333;
                }

                .pc-textarea-unique {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e3f2fd;
                    border-radius: 8px;
                    font-size: 1rem;
                    resize: vertical;
                    font-family: inherit;
                }

                .pc-textarea-unique:focus {
                    outline: none;
                    border-color: #2196f3;
                }

                .pc-alignment-options-unique,
                .pc-performance-options-unique,
                .pc-risk-options-unique,
                .pc-market-options-unique,
                .pc-mentor-options-unique {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .pc-alignment-btn-unique,
                .pc-performance-btn-unique,
                .pc-risk-btn-unique,
                .pc-market-btn-unique,
                .pc-mentor-btn-unique {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 2px solid #e3f2fd;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: left;
                }

                .pc-alignment-btn-unique:hover,
                .pc-performance-btn-unique:hover,
                .pc-risk-btn-unique:hover,
                .pc-market-btn-unique:hover,
                .pc-mentor-btn-unique:hover {
                    border-color: #2196f3;
                    background: #f5f9ff;
                }

                .pc-alignment-btn-unique.pc-selected-unique,
                .pc-performance-btn-unique.pc-selected-unique,
                .pc-risk-btn-unique.pc-selected-unique,
                .pc-market-btn-unique.pc-selected-unique,
                .pc-mentor-btn-unique.pc-selected-unique {
                    border-color: #2196f3;
                    background: #e3f2fd;
                }

                .pc-risk-btn-unique.pc-risk-green-unique.pc-selected-unique {
                    border-color: #4caf50;
                    background: #e8f5e8;
                }

                .pc-risk-btn-unique.pc-risk-orange-unique.pc-selected-unique {
                    border-color: #ff9800;
                    background: #fff3e0;
                }

                .pc-risk-btn-unique.pc-risk-red-unique.pc-selected-unique {
                    border-color: #f44336;
                    background: #ffebee;
                }

                .pc-icon-unique {
                    font-size: 1.2rem;
                    margin-right: 10px;
                }

                .pc-alignment-text-unique,
                .pc-market-text-unique,
                .pc-mentor-text-unique {
                    font-size: 1rem;
                    color: #333;
                }

                .pc-navigation-unique {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                }

                .pc-nav-btn-unique {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .pc-prev-btn-unique {
                    background: #f5f5f5;
                    color: #666;
                }

                .pc-prev-btn-unique:hover {
                    background: #e0e0e0;
                }

                .pc-next-btn-unique {
                    background: #2196f3;
                    color: white;
                }

                .pc-next-btn-unique:hover {
                    background: #1976d2;
                }

                .pc-next-btn-unique:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .pc-step-counter-unique {
                    color: #666;
                    font-weight: 500;
                }

                .pc-analysis-container-unique {
                    background: #f8f9fa;
                    border-left: 4px solid #2196f3;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                }

                .pc-analysis-title-unique {
                    color: #1976d2;
                    margin-bottom: 10px;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .pc-analysis-text-unique {
                    color: #333;
                    line-height: 1.6;
                }

                .pc-loading-unique {
                    text-align: center;
                    color: #666;
                    padding: 20px;
                }

                .pc-final-actions-unique {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                }

                .pc-final-action-btn-unique {
                    padding: 15px 30px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1.1rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .pc-proceed-btn-unique {
                    background: #4caf50;
                    color: white;
                }

                .pc-proceed-btn-unique:hover {
                    background: #45a049;
                }

                .pc-reconsider-btn-unique {
                    background: #ff9800;
                    color: white;
                }

                .pc-reconsider-btn-unique:hover {
                    background: #f57c00;
                }

                .pc-cancel-btn-unique {
                    background: #f44336;
                    color: white;
                }

                .pc-cancel-btn-unique:hover {
                    background: #d32f2f;
                }

                .pc-reset-btn-unique {
                    background: #2196f3;
                    color: white;
                    margin-top: 20px;
                }

                .pc-reset-btn-unique:hover {
                    background: #1976d2;
                }

                @media (max-width: 768px) {
                    .pc-main-container-unique {
                        padding: 15px;
                    }
                    
                    .pc-final-actions-unique {
                        flex-direction: column;
                    }
                    
                    .pc-final-action-btn-unique {
                        width: 100%;
                    }
                }
            `}</style>
            
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Process Checker — Trade Validation Flow</h5>
                    
                    <div className="pc-main-container-unique">
                        {!showFinalAction && (
                            <>
                                <div className="pc-progress-bar-unique">
                                    <div 
                                        className="pc-progress-fill-unique" 
                                        style={{ width: `${(currentStep / 7) * 100}%` }}
                                    />
                                </div>
                                
                                {renderStep()}
                                
                                <div className="pc-navigation-unique">
                                    <button 
                                        className="pc-nav-btn-unique pc-prev-btn-unique"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="pc-step-counter-unique">
                                        Step {currentStep} of 7
                                    </div>
                                    
                                    <button 
                                        className="pc-nav-btn-unique pc-next-btn-unique"
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                    >
                                        {currentStep === 7 ? 'Analyze' : 'Next'}
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {isAnalyzing && (
                            <div className="pc-loading-unique">
                                <p>✨ AI Analysis in progress...</p>
                                <p>Analyzing your responses for potential red flags...</p>
                            </div>
                        )}
                        
                        {showFinalAction && (
                            <div>
                                <div className="pc-analysis-container-unique">
                                    <h4 className="pc-analysis-title-unique">✨ AI Analysis / Feedback</h4>
                                    <p className="pc-analysis-text-unique">{aiAnalysis}</p>
                                </div>
                                
                                <div className="pc-final-actions-unique">
                                    <button 
                                        className="pc-final-action-btn-unique pc-proceed-btn-unique"
                                        onClick={() => alert('Trade approved! Proceed with confidence.')}
                                    >
                                        ✅ Proceed
                                    </button>
                                    <button 
                                        className="pc-final-action-btn-unique pc-reconsider-btn-unique"
                                        onClick={() => alert('Take a moment to reconsider your approach.')}
                                    >
                                        ⚠️ Reconsider
                                    </button>
                                    <button 
                                        className="pc-final-action-btn-unique pc-cancel-btn-unique"
                                        onClick={() => alert('Trade cancelled. Better to be safe.')}
                                    >
                                        ❌ Cancel
                                    </button>
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <button 
                                        className="pc-nav-btn-unique pc-reset-btn-unique"
                                        onClick={resetChecker}
                                    >
                                        Start New Process Check
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}