import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import access_granted_audio from '../Access Granted Sound.mp3';
import access_denied_audio from '../Access Denied - Sound Effect (HD).mp3';
import tlotlo_motingwe from '../Tlotlo.jpg';

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
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [showFacialRecognition, setShowFacialRecognition] = useState(false);
    const [facialRecognitionStep, setFacialRecognitionStep] = useState('prepare');
    const [faceVerified, setFaceVerified] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Fingerprint authentication states
    const [fingerprintSupported, setFingerprintSupported] = useState(false);
    const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
    const [showFingerprintAuth, setShowFingerprintAuth] = useState(false);
    const [fingerprintStep, setFingerprintStep] = useState('prepare');
    
    const uniqueID = uuidv4();
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const accessGrantedAudioRef = useRef(null);
    const accessDeniedAudioRef = useRef(null);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    
    // Camera and facial recognition refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanlineRef = useRef(null);
    const containerRef = useRef(null);

    // Device fingerprint for persistent lockout
    const getDeviceFingerprint = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return btoa(fingerprint).substring(0, 32);
    };

    // Check if device is mobile
    const detectMobileDevice = () => {
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasSmallScreen = window.innerWidth <= 768;
        
        return isMobileUserAgent || (isTouchDevice && hasSmallScreen);
    };

    // Persistent lockout management
    const LOCKOUT_KEY = 'auth_lockout_';
    const MAX_ATTEMPTS = 3;
    const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

    const getLockoutData = () => {
        const deviceId = getDeviceFingerprint();
        const lockoutData = localStorage.getItem(LOCKOUT_KEY + deviceId);
        
        if (!lockoutData) return null;
        
        try {
            return JSON.parse(lockoutData);
        } catch {
            return null;
        }
    };

    const setLockoutData = (attempts, isLocked = false) => {
        const deviceId = getDeviceFingerprint();
        const lockoutData = {
            attempts,
            isLocked,
            timestamp: Date.now(),
            deviceId
        };
        
        localStorage.setItem(LOCKOUT_KEY + deviceId, JSON.stringify(lockoutData));
    };

    const clearLockoutData = () => {
        const deviceId = getDeviceFingerprint();
        localStorage.removeItem(LOCKOUT_KEY + deviceId);
    };

    const checkLockoutStatus = () => {
        const lockoutData = getLockoutData();
        
        if (!lockoutData) {
            setFailedAttempts(0);
            setIsLockedOut(false);
            return;
        }

        const timePassed = Date.now() - lockoutData.timestamp;
        
        if (lockoutData.isLocked && timePassed < LOCKOUT_DURATION) {
            setIsLockedOut(true);
            setFailedAttempts(lockoutData.attempts);
            const remainingTime = Math.ceil((LOCKOUT_DURATION - timePassed) / (60 * 1000));
            speak(`Account is locked. ${remainingTime} minutes remaining. Please use biometric authentication.`);
        } else if (lockoutData.isLocked && timePassed >= LOCKOUT_DURATION) {
            // Lockout period expired
            clearLockoutData();
            setIsLockedOut(false);
            setFailedAttempts(0);
        } else {
            setFailedAttempts(lockoutData.attempts);
            setIsLockedOut(false);
        }
    };

    const fetchAPIKey = async () => {
        try {
            const response = await fetch(`${baseURL}/get_openai_key`);
            if (!response.ok) throw new Error("Network response was not ok");
            const { OPENAI_API_KEY } = await response.json();
            setOPENAI_API_KEY(OPENAI_API_KEY);
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    };

    // Check if WebAuthn and fingerprint are supported
    const checkFingerprintSupport = async () => {
        if (!window.PublicKeyCredential) {
            console.log("WebAuthn not supported");
            return false;
        }

        try {
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            setFingerprintSupported(available);
            
            const registered = localStorage.getItem('fingerprintRegistered') === 'true';
            const credentialId = localStorage.getItem('fingerprintCredentialId');
            const rawIdString = localStorage.getItem('fingerprintCredentialRawId');
            
            const fullyRegistered = registered && credentialId && rawIdString;
            setFingerprintRegistered(fullyRegistered);
            
            if (registered && !fullyRegistered) {
                localStorage.removeItem('fingerprintRegistered');
                localStorage.removeItem('fingerprintCredentialId');
                localStorage.removeItem('fingerprintCredentialRawId');
                console.log("Cleaned up incomplete fingerprint registration");
            }
            
            return available;
        } catch (error) {
            console.error("Error checking fingerprint support:", error);
            return false;
        }
    };

    // Register fingerprint for the user
    const registerFingerprint = async () => {
        if (!fingerprintSupported) {
            setError("Fingerprint authentication is not supported on this device");
            return false;
        }

        try {
            speak("Registering fingerprint. Please follow the device prompts.");
            console.log("Starting fingerprint registration...");
            
            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);
            
            localStorage.removeItem('fingerprintRegistered');
            localStorage.removeItem('fingerprintCredentialId');
            localStorage.removeItem('fingerprintCredentialRawId');
            
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: challenge,
                    rp: {
                        name: "Secure Access System",
                        id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
                    },
                    user: {
                        id: new TextEncoder().encode("tlotlo.motingwe"),
                        name: "tlotlo.motingwe@example.com",
                        displayName: "Tlotlo Motingwe",
                    },
                    pubKeyCredParams: [
                        { type: "public-key", alg: -7 },
                        { type: "public-key", alg: -257 },
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required",
                        requireResidentKey: true,
                    },
                    timeout: 60000,
                    attestation: "direct"
                }
            });

            if (credential && credential.id && credential.rawId) {
                console.log("Fingerprint credential created successfully");
                
                localStorage.setItem('fingerprintCredentialId', credential.id);
                localStorage.setItem('fingerprintCredentialRawId', Array.from(new Uint8Array(credential.rawId)).join(','));
                localStorage.setItem('fingerprintRegistered', 'true');
                
                setFingerprintRegistered(true);
                speak("Fingerprint registered successfully. You can now use fingerprint authentication.");
                setError("");
                return true;
            } else {
                throw new Error("Invalid credential response");
            }
        } catch (error) {
            console.error("Fingerprint registration failed:", error);
            
            localStorage.removeItem('fingerprintRegistered');
            localStorage.removeItem('fingerprintCredentialId');
            localStorage.removeItem('fingerprintCredentialRawId');
            
            let errorMessage = "Fingerprint registration failed";
            if (error.name === 'NotSupportedError') {
                errorMessage = "Fingerprint authentication is not supported on this device";
            } else if (error.name === 'SecurityError') {
                errorMessage = "Security error - make sure you're on HTTPS or localhost";
            } else if (error.name === 'NotAllowedError') {
                errorMessage = "Fingerprint registration was cancelled or not allowed";
            } else if (error.name === 'InvalidStateError') {
                errorMessage = "A fingerprint is already registered. Try authenticating instead.";
            } else {
                errorMessage = `Fingerprint registration failed: ${error.name} - ${error.message}`;
            }
            
            speak(errorMessage);
            setError(errorMessage);
            return false;
        }
    };

    // Authenticate with fingerprint
    const authenticateWithFingerprint = async () => {
        if (!fingerprintSupported || !fingerprintRegistered) return false;

        try {
            setShowFingerprintAuth(true);
            setFingerprintStep('scanning');
            speak("Please place your finger on the fingerprint sensor.");

            const credentialId = localStorage.getItem('fingerprintCredentialId');
            const rawIdString = localStorage.getItem('fingerprintCredentialRawId');
            
            if (!credentialId || !rawIdString) {
                throw new Error("No fingerprint credential found. Please re-register.");
            }

            const rawId = new Uint8Array(rawIdString.split(',').map(x => parseInt(x)));
            
            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: challenge,
                    allowCredentials: [{
                        type: "public-key",
                        id: rawId,
                        transports: ["internal"]
                    }],
                    userVerification: "required",
                    timeout: 60000,
                }
            });

            if (credential) {
                console.log("Fingerprint authentication successful!");
                setFingerprintStep('complete');
                speak("Fingerprint authentication successful. Access granted.");
                
                const userEmail = 'tlotlo.motingwe@example.com';
                Cookies.set('email', userEmail);
                Cookies.set('account_name', userEmail);
                
                // Clear lockout on successful biometric auth
                clearLockoutData();
                
                setAccessGranted(true);
                playAccessGranted();
                
                setTimeout(() => {
                    setShowFingerprintAuth(false);
                    navigate('/personal_info');
                }, 3000);
                
                return true;
            }
        } catch (error) {
            console.error("Fingerprint authentication failed:", error);
            setFingerprintStep('prepare');
            setShowFingerprintAuth(false);
            
            if (error.name === 'NotAllowedError') {
                speak("Fingerprint authentication was cancelled or failed.");
                setError("Fingerprint authentication cancelled or failed");
            } else if (error.name === 'InvalidStateError') {
                speak("No fingerprint credentials found. Please register your fingerprint first.");
                setError("No fingerprint credentials found. Please re-register.");
                localStorage.removeItem('fingerprintCredentialId');
                localStorage.removeItem('fingerprintRegistered');
                localStorage.removeItem('fingerprintCredentialRawId');
                setFingerprintRegistered(false);
            } else {
                speak("Fingerprint authentication error. Please try again.");
                setError("Fingerprint authentication failed: " + error.message);
            }
            return false;
        }
    };

    // Voice synthesis function
    const speak = (text) => {
        if (!userInteracted) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Natural')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    // Handle user interaction to enable audio
    const handleUserInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
            
            if (isMobile) {
                if (fingerprintSupported && fingerprintRegistered) {
                    speak("Welcome to the secure authentication system. Please use your fingerprint to authenticate.");
                } else if (fingerprintSupported && !fingerprintRegistered) {
                    speak("Welcome. Please register your fingerprint for secure mobile authentication.");
                } else {
                    speak("Welcome. Fingerprint authentication not available. Facial recognition will be used.");
                }
            } else {
                speak("Welcome to the secure authentication system. Please enter your credentials.");
            }
        }
    };

    // Play audio functions
    const playAccessGranted = () => {
        if (accessGrantedAudioRef.current && userInteracted) {
            accessGrantedAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const playAccessDenied = () => {
        if (accessDeniedAudioRef.current && userInteracted) {
            accessDeniedAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    // Start facial recognition camera
    const startFacialRecognition = async () => {
        setShowFacialRecognition(true);
        setFacialRecognitionStep('prepare');
        speak("Initiating facial recognition. Please position yourself in front of the camera.");
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            
            setTimeout(() => {
                setFacialRecognitionStep('capturing');
                speak("Please look directly at the camera. Capturing image in 3, 2, 1.");
                
                setTimeout(() => {
                    captureAndVerifyFace();
                }, 3000);
            }, 2000);
            
        } catch (error) {
            console.error("Error accessing camera:", error);
            speak("Camera access denied. Please ensure camera permissions are granted and try again.");
            setError("Camera access required for facial recognition");
        }
    };

    // Capture and verify face
    const captureAndVerifyFace = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        setFacialRecognitionStep('analyzing');
        speak("Analyzing facial features. Please wait.");
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const capturedImage = canvas.toDataURL('image/jpeg', 0.8);
        
        try {
            const referenceImageBase64 = await imageToBase64(tlotlo_motingwe);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Compare these two images and determine if they show the same person. Respond with only 'MATCH' if they are the same person, or 'NO_MATCH' if they are different people. Be strict in your comparison."
                                },
                                {
                                    type: "image_url",
                                    image_url: { url: referenceImageBase64 }
                                },
                                {
                                    type: "image_url",
                                    image_url: { url: capturedImage }
                                }
                            ]
                        }
                    ],
                    max_tokens: 10
                })
            });
            
            const result = await response.json();
            const verification = result.choices[0].message.content.trim();
            
            if (verification === 'MATCH') {
                setFaceVerified(true);
                setFacialRecognitionStep('complete');
                speak("Facial recognition successful. Identity verified.");
                
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                const userEmail = email || 'tlotlo.motingwe@example.com';
                Cookies.set('email', userEmail);
                
                // Clear lockout on successful biometric auth
                clearLockoutData();
                
                setTimeout(() => {
                    setShowFacialRecognition(false);
                    speak("Facial identity confirmed. Welcome back, Mr Motingwe.");
                    Cookies.set('account_name', userEmail);
                    navigate(`/personal_info`);
                }, 5000);
                
            } else {
                speak("Facial recognition failed. Identity could not be verified. Please try again.");
                setError("FACIAL RECOGNITION FAILED: Identity not verified");
                setFacialRecognitionStep('prepare');
            }
            
        } catch (error) {
            console.error("Error in facial recognition:", error);
            speak("Facial recognition system error. Please try again.");
            setError("SYSTEM ERROR: Facial recognition unavailable");
            setFacialRecognitionStep('prepare');
        }
    };

    // Helper function to convert image to base64
    const imageToBase64 = (imageUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
            img.src = imageUrl;
        });
    };

    // Auto-start authentication based on device type
    const startDeviceAppropriateAuth = async () => {
        if (!userInteracted) {
            handleUserInteraction();
            return;
        }

        if (isMobile) {
            // Mobile: Try fingerprint first, then facial recognition
            if (fingerprintSupported && fingerprintRegistered) {
                const success = await authenticateWithFingerprint();
                if (!success) {
                    // Fallback to facial recognition
                    setTimeout(() => {
                        startFacialRecognition();
                    }, 1000);
                }
            } else if (fingerprintSupported && !fingerprintRegistered) {
                // Offer to register fingerprint first
                const shouldRegister = await new Promise((resolve) => {
                    speak("Would you like to register your fingerprint for secure authentication?");
                    // Auto-proceed with registration for demo purposes
                    setTimeout(() => resolve(true), 2000);
                });
                
                if (shouldRegister) {
                    const registered = await registerFingerprint();
                    if (registered) {
                        await authenticateWithFingerprint();
                    } else {
                        startFacialRecognition();
                    }
                } else {
                    startFacialRecognition();
                }
            } else {
                // No fingerprint support, use facial recognition
                startFacialRecognition();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userInteracted) {
            handleUserInteraction();
            return;
        }
        
        // Check if this is a mobile device trying to use traditional login
        if (isMobile) {
            speak("Mobile devices use biometric authentication only.");
            setError("Mobile devices require biometric authentication. Please use fingerprint or facial recognition.");
            return;
        }
        
        if (isLockedOut) {
            speak("Account is locked due to multiple failed attempts. Please try facial recognition.");
            if (!faceVerified) {
                startFacialRecognition();
            }
            return;
        }
        
        setEmailError("");
        setPasswordError("");
        setError("");
        setLoading(true);

        if (!email) {
            setEmailError("Email is required.");
            speak("Please enter your email address.");
            setLoading(false);
            return;
        }
        if (!password) {
            setPasswordError("Password is required.");
            speak("Please enter your password.");
            setLoading(false);
            return;
        }

        setFinalData([email, password]);
        const loginData = { email: email, password: password };
        
        try {
            speak("Verifying credentials. Please wait.");
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const response = await fetch(`${baseURL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
    
            if (response.status === 200) {
                const { email } = await response.json();
                Cookies.set('email', email);
                
                // Clear lockout on successful login
                clearLockoutData();
                
                setAccessGranted(true);
                speak("Access granted. Welcome back, Mr Motingwe. Initializing secure connection.");
                playAccessGranted();
                
                setTimeout(() => {
                    Cookies.set('account_name', email);
                    navigate(`/personal_info`);
                }, 5000);
            } else {
                const currentAttempts = failedAttempts + 1;
                setFailedAttempts(currentAttempts);
                playAccessDenied();
                
                if (currentAttempts >= MAX_ATTEMPTS) {
                    setIsLockedOut(true);
                    setLockoutData(currentAttempts, true);
                    setError("ACCOUNT LOCKED: Too many failed attempts. Facial recognition required.");
                    speak("Account locked due to multiple failed attempts. Please use facial recognition.");
                } else {
                    const remainingAttempts = MAX_ATTEMPTS - currentAttempts;
                    setLockoutData(currentAttempts, false);
                    setError(`AUTHENTICATION FAILED: Invalid Credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
                    speak(`Authentication failed. You have ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
                }
            }
        } catch (error) {
            setError("CONNECTION ERROR: Unable to reach authentication server");
            speak("Connection error. Please check your network and try again.");
            playAccessDenied();
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    useEffect(() => {
        const mobile = detectMobileDevice();
        setIsMobile(mobile);
        
        fetchAPIKey();
        checkFingerprintSupport();
        checkLockoutStatus();
        
        const grantedAudio = new Audio(access_granted_audio);
        const deniedAudio = new Audio(access_denied_audio);
        
        accessGrantedAudioRef.current = grantedAudio;
        accessDeniedAudioRef.current = deniedAudio;
        
        const intervalId = setInterval(() => {
            if (scanlineRef.current) {
                scanlineRef.current.style.top = Math.random() * 100 + "%";
                scanlineRef.current.style.opacity = (Math.random() * 0.4 + 0.2);
            }
        }, 1000);
        
        const container = containerRef.current;
        if (container) {
            container.addEventListener('click', handleUserInteraction);
            container.addEventListener('keydown', handleUserInteraction);
        }
        
        return () => {
            clearInterval(intervalId);
            if (accessGrantedAudioRef.current) {
                accessGrantedAudioRef.current.pause();
            }
            if (accessDeniedAudioRef.current) {
                accessDeniedAudioRef.current.pause();
            }
            if (container) {
                container.removeEventListener('click', handleUserInteraction);
                container.removeEventListener('keydown', handleUserInteraction);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Auto-start mobile authentication after user interaction
    useEffect(() => {
        if (userInteracted && isMobile && !isLockedOut && !accessGranted) {
            // Small delay to let user see the interface
            const timer = setTimeout(() => {
                startDeviceAppropriateAuth();
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [userInteracted, isMobile, isLockedOut, accessGranted]);

    // Load voices when available
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    return (
        <div className="hud-container" ref={containerRef}>
            <div className="scanline" ref={scanlineRef}></div>
            
            {/* Fingerprint Authentication Overlay */}
            {showFingerprintAuth && (
                <div className="fingerprint-overlay">
                    <div className="fingerprint-container">
                        <div className="fingerprint-header">
                            <h3>FINGERPRINT AUTHENTICATION</h3>
                            <div className="status-indicator">
                                STATUS: {fingerprintStep.toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="fingerprint-scanner">
                            <div className={`fingerprint-icon ${fingerprintStep === 'scanning' ? 'scanning' : ''}`}>
                                <svg viewBox="0 0 100 100" className="fingerprint-svg">
                                    <path d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z" 
                                          fill="none" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M50,20 C35,20 20,35 20,50 C20,65 35,80 50,80 C65,80 80,65 80,50 C80,35 65,20 50,20 Z" 
                                          fill="none" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M50,30 C40,30 30,40 30,50 C30,60 40,70 50,70 C60,70 70,60 70,50 C70,40 60,30 50,30 Z" 
                                          fill="none" stroke="currentColor" strokeWidth="1"/>
                                </svg>
                            </div>
                            
                            {fingerprintStep === 'scanning' && (
                                <div className="fingerprint-prompt">
                                    Place your finger on the sensor
                                </div>
                            )}
                            
                            {fingerprintStep === 'complete' && (
                                <div className="fingerprint-success">
                                    ✓ FINGERPRINT VERIFIED
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Facial Recognition Overlay */}
            {showFacialRecognition && (
                <div className="facial-recognition-overlay">
                    <div className="facial-recognition-container">
                        <div className="facial-recognition-header">
                            <h3>FACIAL RECOGNITION</h3>
                            <div className="status-indicator">
                                STATUS: {facialRecognitionStep.toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="camera-container">
                            <video ref={videoRef} autoPlay muted className="camera-feed" />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            
                            {facialRecognitionStep === 'capturing' && (
                                <div className="capture-overlay">
                                    <div className="capture-frame"></div>
                                </div>
                            )}
                            
                            {facialRecognitionStep === 'analyzing' && (
                                <div className="analyzing-overlay">
                                    <div className="analyzing-spinner"></div>
                                    <div className="analyzing-text">ANALYZING...</div>
                                </div>
                            )}
                        </div>
                        
                        <div className="facial-recognition-controls">
                            {facialRecognitionStep === 'prepare' && (
                                <button 
                                    onClick={startFacialRecognition}
                                    className="hud-button"
                                >
                                    START SCAN
                                </button>
                            )}
                            
                            {facialRecognitionStep === 'complete' && faceVerified && (
                                <div className="verification-success">
                                    ✓ IDENTITY VERIFIED
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="hud-login-wrapper">
                <div className="hud-hexagon"></div>
                <div className="hud-login-inner">
                    <div className="hud-header">
                        <h3 className="hud-title">SECURE ACCESS</h3>
                        <div className="hud-subtitle">
                            {isMobile ? "BIOMETRIC AUTHENTICATION" : "AUTHENTICATION REQUIRED"}
                        </div>
                        
                        {/* Device type indicator */}
                        <div className="device-indicator">
                            {isMobile ? "📱 MOBILE DEVICE DETECTED" : "💻 DESKTOP DEVICE DETECTED"}
                        </div>
                        
                        {/* Biometric options display */}
                        {isMobile && (
                            <div className="mobile-auth-info">
                                {fingerprintSupported && fingerprintRegistered ? (
                                    <div className="biometric-available">
                                        🔒 Fingerprint authentication ready
                                    </div>
                                ) : fingerprintSupported ? (
                                    <div className="biometric-setup">
                                        📱 Fingerprint setup required
                                    </div>
                                ) : (
                                    <div className="biometric-fallback">
                                        👁️ Facial recognition available
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {isLockedOut && (
                            <div className="lockout-warning">
                                🔒 ACCOUNT LOCKED - BIOMETRIC AUTHENTICATION REQUIRED
                            </div>
                        )}
                    </div>
                    
                    {accessGranted ? (
                        <div className="access-granted-container">
                            <div className="access-granted-text">ACCESS GRANTED</div>
                            <div className="access-granted-spinner"></div>
                            <div className="access-granted-message">Initializing secure connection...</div>
                        </div>
                    ) : (
                        <div>
                            {error && <div className="hud-error-message">{error}</div>}
                            
                            {/* Mobile Authentication Interface */}
                            {isMobile ? (
                                <div className="mobile-auth-container">
                                    {!isLockedOut && (
                                        <div className="mobile-auth-buttons">
                                            {fingerprintSupported && fingerprintRegistered && (
                                                <button 
                                                    type="button"
                                                    className="hud-button fingerprint-quick-button"
                                                    onClick={authenticateWithFingerprint}
                                                    disabled={loading}
                                                >
                                                    🔓 AUTHENTICATE WITH FINGERPRINT
                                                </button>
                                            )}
                                            
                                            {fingerprintSupported && !fingerprintRegistered && (
                                                <button 
                                                    type="button"
                                                    className="hud-button fingerprint-register-button"
                                                    onClick={registerFingerprint}
                                                    disabled={loading}
                                                >
                                                    📱 REGISTER FINGERPRINT
                                                </button>
                                            )}
                                            
                                            <button 
                                                type="button"
                                                className="hud-button facial-recognition-button"
                                                onClick={startFacialRecognition}
                                                disabled={loading}
                                            >
                                                👁️ FACIAL RECOGNITION
                                            </button>
                                        </div>
                                    )}
                                    
                                    {isLockedOut && (
                                        <div className="mobile-lockout-options">
                                            {fingerprintSupported && fingerprintRegistered && (
                                                <button 
                                                    type="button"
                                                    className="hud-button fingerprint-unlock-button"
                                                    onClick={authenticateWithFingerprint}
                                                >
                                                    🔓 FINGERPRINT UNLOCK
                                                </button>
                                            )}
                                            <button 
                                                type="button"
                                                className="hud-button facial-recognition-button"
                                                onClick={startFacialRecognition}
                                            >
                                                👁️ FACIAL RECOGNITION UNLOCK
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Desktop Authentication Interface */
                                <form onSubmit={handleSubmit} className="hud-form">
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
                                                    disabled={isLockedOut && !faceVerified}
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
                                                    disabled={isLockedOut && !faceVerified}
                                                />
                                                <div className="hud-input-border"></div>
                                            </div>
                                            {passwordError && <div className="hud-field-error">{passwordError}</div>}
                                        </label>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className={`hud-button ${loading ? 'hud-button-loading' : ''} ${isLockedOut && !faceVerified ? 'hud-button-disabled' : ''}`} 
                                        disabled={loading || (isLockedOut && !faceVerified)}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="hud-button-text">VERIFYING</span>
                                                <span className="hud-loading-dots">...</span>
                                            </>
                                        ) : isLockedOut && !faceVerified ? 'LOCKED - BIOMETRIC SCAN REQUIRED' : 'AUTHENTICATE'}
                                    </button>
                                    
                                    {/* Desktop biometric unlock when locked out */}
                                    {isLockedOut && !faceVerified && (
                                        <div className="desktop-unlock-options">
                                            <button 
                                                type="button"
                                                className="hud-button facial-recognition-button"
                                                onClick={startFacialRecognition}
                                            >
                                                👁️ FACIAL RECOGNITION UNLOCK
                                            </button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
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
                
                /* Fingerprint Authentication Overlay */
                .fingerprint-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .fingerprint-container {
                    background-color: rgba(11, 25, 48, 0.9);
                    border: 1px solid rgba(0, 162, 255, 0.5);
                    border-radius: 8px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(0, 162, 255, 0.3);
                }
                
                .fingerprint-header h3 {
                    color: #00a2ff;
                    font-size: 1.5rem;
                    letter-spacing: 2px;
                    margin: 0 0 1rem 0;
                    text-shadow: 0 0 10px rgba(0, 162, 255, 0.7);
                }
                
                .fingerprint-scanner {
                    margin: 2rem 0;
                }
                
                .fingerprint-icon {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 1rem auto;
                    border: 3px solid rgba(0, 162, 255, 0.5);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    background-color: rgba(0, 26, 56, 0.5);
                }
                
                .fingerprint-icon.scanning {
                    border-color: #00ff9d;
                    animation: pulseFingerprintScan 2s infinite;
                    box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
                }
                
                .fingerprint-svg {
                    width: 80px;
                    height: 80px;
                    color: rgba(0, 162, 255, 0.8);
                }
                
                .fingerprint-icon.scanning .fingerprint-svg {
                    color: #00ff9d;
                    animation: rotateScan 3s linear infinite;
                }
                
                .fingerprint-prompt {
                    color: #00a2ff;
                    font-size: 1.1rem;
                    letter-spacing: 1px;
                    animation: pulse 2s infinite;
                }
                
                .fingerprint-success {
                    color: #00ff9d;
                    font-size: 1.3rem;
                    font-weight: bold;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
                    animation: pulseGreen 2s infinite;
                }
                
                /* Device indicator */
                .device-indicator {
                    color: rgba(0, 162, 255, 0.7);
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    margin-top: 0.5rem;
                    padding: 0.3rem 0.8rem;
                    border: 1px solid rgba(0, 162, 255, 0.3);
                    border-radius: 15px;
                    background-color: rgba(0, 162, 255, 0.05);
                }
                
                /* Mobile auth specific styles */
                .mobile-auth-info {
                    margin: 1rem 0;
                    font-size: 0.9rem;
                }
                
                .biometric-available {
                    color: #00ff9d;
                    background-color: rgba(0, 255, 157, 0.1);
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    padding: 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 1px;
                }
                
                .biometric-setup {
                    color: #ffa500;
                    background-color: rgba(255, 165, 0, 0.1);
                    border: 1px solid rgba(255, 165, 0, 0.3);
                    padding: 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 1px;
                }
                
                .biometric-fallback {
                    color: #00a2ff;
                    background-color: rgba(0, 162, 255, 0.1);
                    border: 1px solid rgba(0, 162, 255, 0.3);
                    padding: 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 1px;
                }
                
                .mobile-auth-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .mobile-auth-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .mobile-lockout-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .desktop-unlock-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                /* Button variations for different auth methods */
                .fingerprint-quick-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }
                
                .fingerprint-register-button {
                    background: linear-gradient(90deg, 
                                rgba(100, 80, 0, 0.5) 0%, 
                                rgba(180, 140, 0, 0.6) 50%,
                                rgba(100, 80, 0, 0.5) 100%);
                    border-color: rgba(255, 215, 0, 0.5);
                }
                
                .fingerprint-unlock-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }
                
                .facial-recognition-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }
                
                /* HUD Login wrapper and existing styles */
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
                
                .lockout-warning {
                    background-color: rgba(255, 69, 0, 0.2);
                    border: 1px solid rgba(255, 69, 0, 0.5);
                    color: #ff4500;
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-top: 1rem;
                    letter-spacing: 1px;
                    animation: pulseRed 2s infinite;
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
                
                .hud-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background-color: rgba(0, 26, 56, 0.2);
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
                
                .hud-button-disabled {
                    background: linear-gradient(90deg, 
                                rgba(100, 50, 0, 0.5) 0%, 
                                rgba(180, 90, 0, 0.6) 50%,
                                rgba(100, 50, 0, 0.5) 100%);
                    border-color: rgba(255, 162, 0, 0.5);
                    cursor: not-allowed;
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
                
                .hud-loading-dots {
                    display: inline-block;
                    width: 20px;
                    text-align: left;
                    animation: loadingDots 1.5s infinite;
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
                
                /* Facial Recognition Overlay Styles */
                .facial-recognition-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .facial-recognition-container {
                    background-color: rgba(11, 25, 48, 0.9);
                    border: 1px solid rgba(0, 162, 255, 0.5);
                    border-radius: 8px;
                    padding: 2rem;
                    max-width: 600px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(0, 162, 255, 0.3);
                }
                
                .facial-recognition-header h3 {
                    color: #00a2ff;
                    font-size: 1.5rem;
                    letter-spacing: 2px;
                    margin: 0 0 1rem 0;
                    text-shadow: 0 0 10px rgba(0, 162, 255, 0.7);
                }
                
                .status-indicator {
                    color: rgba(0, 162, 255, 0.8);
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    margin-bottom: 2rem;
                }
                
                .camera-container {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                    margin: 0 auto 2rem auto;
                    border: 2px solid rgba(0, 162, 255, 0.5);
                    border-radius: 8px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                }
                
                .camera-feed {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .capture-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.3);
                }
                
                .capture-frame {
                    width: 200px;
                    height: 200px;
                    border: 3px solid #00ff9d;
                    border-radius: 50%;
                    animation: pulseCapture 1s infinite;
                }
                
                @keyframes pulseCapture {
                    0% { 
                        transform: scale(1);
                        border-color: #00ff9d;
                    }
                    50% { 
                        transform: scale(1.1);
                        border-color: #00a2ff;
                    }
                    100% { 
                        transform: scale(1);
                        border-color: #00ff9d;
                    }
                }
                
                .analyzing-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.8);
                }
                
                .analyzing-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(0, 162, 255, 0.1);
                    border-top: 4px solid #00a2ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                
                .analyzing-text {
                    color: #00a2ff;
                    font-size: 1.2rem;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px rgba(0, 162, 255, 0.7);
                }
                
                .verification-success {
                    color: #00ff9d;
                    font-size: 1.5rem;
                    font-weight: bold;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
                    animation: pulseGreen 2s infinite;
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
                
                /* Mobile responsive adjustments */
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
                    
                    .facial-recognition-container,
                    .fingerprint-container {
                        padding: 1.5rem;
                    }
                    
                    .camera-container {
                        max-width: 300px;
                    }
                    
                    .fingerprint-icon {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .fingerprint-svg {
                        width: 60px;
                        height: 60px;
                    }
                    
                    .biometric-unlock-options {
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}