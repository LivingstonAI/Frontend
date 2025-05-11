import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import access_granted_audio from '../Access Granted Sound.mp3';
import access_denied_audio from '../Access Denied - Sound Effect (HD).mp3';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [finalData, setFinalData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const uniqueID = uuidv4();
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const accessGrantedAudioRef = useRef(null);
    const accessDeniedAudioRef = useRef(null);

    // References for animation
    const scanlineRef = useRef(null);
    const containerRef = useRef(null);

    // Create the audio elements
    useEffect(() => {
        // Create references to the imported audio files
        const grantedAudio = new Audio(access_granted_audio);
        const deniedAudio = new Audio(access_denied_audio);
        
        accessGrantedAudioRef.current = grantedAudio;
        accessDeniedAudioRef.current = deniedAudio;
        
        // Add scan effect
        const intervalId = setInterval(() => {
            if (scanlineRef.current) {
                scanlineRef.current.style.top = Math.random() * 100 + "%";
                scanlineRef.current.style.opacity = (Math.random() * 0.4 + 0.2);
            }
        }, 1000);
        
        return () => {
            clearInterval(intervalId);
            if (accessGrantedAudioRef.current) {
                accessGrantedAudioRef.current.pause();
            }
            if (accessDeniedAudioRef.current) {
                accessDeniedAudioRef.current.pause();
            }
        };
    }, []);

    const playAccessGranted = () => {
        if (accessGrantedAudioRef.current) {
            accessGrantedAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const playAccessDenied = () => {
        if (accessDeniedAudioRef.current) {
            accessDeniedAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset error states
        setEmailError("");
        setPasswordError("");
        setError("");
        setLoading(true);

        // Validate inputs
        if (!email) {
            setEmailError("Email is required.");
            setLoading(false);
            return;
        }
        if (!password) {
            setPasswordError("Password is required.");
            setLoading(false);
            return;
        }

        // Perform login logic
        setFinalData([email, password]);
        const loginData = {
            email: email,
            password: password
        };
        
        try {
            // Simulate scanning effect
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const response = await fetch(`${baseURL}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (response.status === 200) {
                const { email } = await response.json();
                Cookies.set('email', email);
                
                // Show access granted message with animation
                setAccessGranted(true);
                playAccessGranted();
                
                // Wait for animation to complete before navigating
                setTimeout(() => {
                    navigate(`/personal_info`);
                }, 5000);
            } else {
                setError("AUTHENTICATION FAILED: Invalid Credentials");
                playAccessDenied();
            }
        } catch (error) {
            setError("CONNECTION ERROR: Unable to reach authentication server");
            playAccessDenied();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hud-container" ref={containerRef}>
            <div className="scanline" ref={scanlineRef}></div>
            <div className="hud-login-wrapper">
                <div className="hud-hexagon"></div>
                <div className="hud-login-inner">
                    <div className="hud-header">
                        <h3 className="hud-title">SECURE ACCESS</h3>
                        <div className="hud-subtitle">AUTHENTICATION REQUIRED</div>
                    </div>
                    
                    {accessGranted ? (
                        <div className="access-granted-container">
                            <div className="access-granted-text">ACCESS GRANTED</div>
                            <div className="access-granted-spinner"></div>
                            <div className="access-granted-message">Initializing secure connection...</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="hud-form">
                            {error && <div className="hud-error-message">{error}</div>}
                            
                            <div className="hud-input-group">
                                <label className="hud-label">
                                    <span className="hud-label-text">USER ID</span>
                                    <div className="hud-input-container">
                                        <input
                                            type="email"
                                            className="hud-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email"
                                        />
                                        <div className="hud-input-border"></div>
                                    </div>
                                    {emailError && <div className="hud-field-error">{emailError}</div>}
                                </label>
                            </div>
                            
                            <div className="hud-input-group">
                                <label className="hud-label">
                                    <span className="hud-label-text">SECURITY KEY</span>
                                    <div className="hud-input-container">
                                        <input
                                            type="password"
                                            className="hud-input"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                        />
                                        <div className="hud-input-border"></div>
                                    </div>
                                    {passwordError && <div className="hud-field-error">{passwordError}</div>}
                                </label>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`hud-button ${loading ? 'hud-button-loading' : ''}`} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="hud-button-text">VERIFYING</span>
                                        <span className="hud-loading-dots">...</span>
                                    </>
                                ) : 'AUTHENTICATE'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                /* HUD-style futuristic interface styles */
                .hud-container {
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #050b14;
                    overflow: hidden;
                    font-family: 'Rajdhani', 'Orbitron', sans-serif;
                }
                
                .scanline {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background-color: rgba(0, 162, 255, 0.3);
                    z-index: 2;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(0, 162, 255, 0.6);
                }
                
                .hud-login-wrapper {
                    position: relative;
                    width: 90%;
                    max-width: 480px;
                    background-color: rgba(11, 25, 48, 0.7);
                    border-radius: 4px;
                    border: 1px solid rgba(0, 162, 255, 0.5);
                    box-shadow: 0 0 30px rgba(0, 162, 255, 0.3), 
                                inset 0 0 20px rgba(0, 162, 255, 0.1);
                    overflow: hidden;
                    z-index: 1;
                }
                
                .hud-hexagon {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background: 
                        repeating-linear-gradient(
                            0deg,
                            rgba(0, 162, 255, 0.05) 0px,
                            rgba(0, 162, 255, 0.05) 1px,
                            transparent 1px,
                            transparent 10px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            rgba(0, 162, 255, 0.05) 0px,
                            rgba(0, 162, 255, 0.05) 1px,
                            transparent 1px,
                            transparent 10px
                        );
                    z-index: -1;
                }
                
                .hud-login-inner {
                    position: relative;
                    padding: 2rem;
                    z-index: 2;
                }
                
                .hud-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    position: relative;
                }
                
                .hud-header::before,
                .hud-header::after {
                    content: '';
                    position: absolute;
                    height: 1px;
                    background: linear-gradient(90deg, 
                                transparent 0%, 
                                rgba(0, 162, 255, 0.8) 50%, 
                                transparent 100%);
                    width: 80%;
                    left: 10%;
                }
                
                .hud-header::before {
                    top: -10px;
                }
                
                .hud-header::after {
                    bottom: -10px;
                }
                
                .hud-title {
                    font-size: 1.8rem;
                    color: #00a2ff;
                    letter-spacing: 2px;
                    margin: 0;
                    font-weight: 600;
                    text-shadow: 0 0 10px rgba(0, 162, 255, 0.7);
                }
                
                .hud-subtitle {
                    font-size: 0.9rem;
                    color: rgba(0, 162, 255, 0.8);
                    letter-spacing: 1px;
                    margin-top: 0.5rem;
                }
                
                .hud-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .hud-input-group {
                    position: relative;
                }
                
                .hud-label {
                    display: block;
                    width: 100%;
                }
                
                .hud-label-text {
                    display: block;
                    color: #00a2ff;
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    letter-spacing: 1px;
                }
                
                .hud-input-container {
                    position: relative;
                    overflow: hidden;
                }
                
                .hud-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background-color: rgba(0, 26, 56, 0.5);
                    border: 1px solid rgba(0, 162, 255, 0.3);
                    color: rgba(0, 225, 255, 0.9);
                    font-family: inherit;
                    letter-spacing: 1px;
                    outline: none;
                    transition: all 0.3s ease;
                    border-radius: 4px;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
                }
                
                .hud-input:focus {
                    border-color: rgba(0, 162, 255, 0.8);
                    box-shadow: 0 0 15px rgba(0, 162, 255, 0.4), 
                                inset 0 0 10px rgba(0, 0, 0, 0.3);
                }
                
                .hud-input::placeholder {
                    color: rgba(0, 162, 255, 0.4);
                }
                
                .hud-input-border {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    width: 100%;
                    background: linear-gradient(90deg, 
                                transparent 0%, 
                                rgba(0, 162, 255, 0.8) 50%, 
                                transparent 100%);
                    transform: scaleX(0.5);
                    transition: transform 0.3s ease;
                    opacity: 0.5;
                }
                
                .hud-input:focus ~ .hud-input-border {
                    transform: scaleX(1);
                    opacity: 1;
                }
                
                .hud-field-error {
                    color: #ff3e3e;
                    font-size: 0.75rem;
                    margin-top: 0.5rem;
                    letter-spacing: 0.5px;
                }
                
                .hud-error-message {
                    background-color: rgba(255, 0, 0, 0.15);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    color: #ff3e3e;
                    padding: 0.75rem;
                    border-radius: 4px;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                }
                
                .hud-button {
                    position: relative;
                    padding: 0.8rem 2rem;
                    background: linear-gradient(90deg, 
                                rgba(0, 50, 100, 0.5) 0%, 
                                rgba(0, 90, 180, 0.6) 50%,
                                rgba(0, 50, 100, 0.5) 100%);
                    border: 1px solid rgba(0, 162, 255, 0.5);
                    color: #ffffff;
                    font-family: inherit;
                    font-weight: 600;
                    font-size: 1rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-radius: 4px;
                    overflow: hidden;
                    text-shadow: 0 0 5px rgba(0, 162, 255, 0.7);
                    margin-top: 1rem;
                    box-shadow: 0 0 15px rgba(0, 162, 255, 0.3);
                }
                
                .hud-button::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        -45deg,
                        transparent 0%,
                        rgba(0, 162, 255, 0.1) 100%
                    );
                    transform: rotate(45deg);
                    z-index: 1;
                    transition: all 0.6s ease;
                }
                
                .hud-button:hover {
                    box-shadow: 0 0 20px rgba(0, 162, 255, 0.5);
                    border-color: rgba(0, 162, 255, 0.8);
                }
                
                .hud-button:hover::before {
                    left: 0;
                }
                
                .hud-button:active {
                    transform: translateY(2px);
                    box-shadow: 0 0 10px rgba(0, 162, 255, 0.3);
                }
                
                .hud-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .hud-button-loading {
                    background: linear-gradient(90deg, 
                                rgba(0, 50, 100, 0.5) 0%, 
                                rgba(0, 90, 180, 0.6) 50%,
                                rgba(0, 50, 100, 0.5) 100%);
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                .hud-loading-dots {
                    display: inline-block;
                    width: 20px;
                    text-align: left;
                    animation: loadingDots 1.5s infinite;
                }
                
                @keyframes loadingDots {
                    0% { content: "."; }
                    33% { content: ".."; }
                    66% { content: "..."; }
                    100% { content: "."; }
                }
                
                /* Access Granted Animation */
                .access-granted-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 0;
                    animation: fadeIn 0.5s ease;
                }
                
                .access-granted-text {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #00ff9d;
                    text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
                    letter-spacing: 2px;
                    animation: pulseGreen 2s infinite;
                }
                
                .access-granted-spinner {
                    width: 80px;
                    height: 80px;
                    margin: 2rem 0;
                    border: 4px solid rgba(0, 255, 157, 0.1);
                    border-top: 4px solid #00ff9d;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                .access-granted-message {
                    color: rgba(0, 255, 157, 0.8);
                    font-size: 1rem;
                    letter-spacing: 1px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes pulseGreen {
                    0% { text-shadow: 0 0 10px rgba(0, 255, 157, 0.7); }
                    50% { text-shadow: 0 0 20px rgba(0, 255, 157, 1); }
                    100% { text-shadow: 0 0 10px rgba(0, 255, 157, 0.7); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Add some responsive adjustments */
                @media (max-width: 480px) {
                    .hud-login-inner {
                        padding: 1.5rem;
                    }
                    
                    .hud-title {
                        font-size: 1.5rem;
                    }
                    
                    .hud-button {
                        padding: 0.7rem 1.5rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
}