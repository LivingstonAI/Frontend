import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import access_granted_audio from '../Access Granted Sound.mp3';
import access_denied_audio from '../Access Denied - Sound Effect (HD).mp3';
import tlotlo_motingwe from '../Tlotlo.jpg';

export default function Login() {
    const FIXED_USER_EMAIL = 'butterrobot83@gmail.com';
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
    const [backendFingerprintRegistered, setBackendFingerprintRegistered] = useState(false);
    const [fingerprintStatusLoading, setFingerprintStatusLoading] = useState(true);
    // Authentication flow states
    const [authStep, setAuthStep] = useState('password'); // password, fingerprint, face
    const [isMobile, setIsMobile] = useState(false);
    const [passwordVerified, setPasswordVerified] = useState(false);
    
    // Fingerprint authentication states
    const [fingerprintSupported, setFingerprintSupported] = useState(false);
    const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
    const [showFingerprintAuth, setShowFingerprintAuth] = useState(false);
    const [fingerprintStep, setFingerprintStep] = useState('prepare');

    const [showFingerprintReRegister, setShowFingerprintReRegister] = useState(false);

    
    const uniqueID = uuidv4();
    const baseURL = 'https://backend-production-c0ab.up.railway.app';
    const accessGrantedAudioRef = useRef(null);
    const accessDeniedAudioRef = useRef(null);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    
    // Camera and facial recognition refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // References for animation
    const scanlineRef = useRef(null);
    const containerRef = useRef(null);

        useEffect(() => {
        const validateFingerprintDomain = () => {
            const storedDomain = localStorage.getItem('fingerprintDomain');
            const currentDomain = window.location.hostname;
            
            // Only clear if domains are significantly different (not just localhost vs 127.0.0.1)
            const domainsMatch = storedDomain === currentDomain || 
                                (storedDomain === 'localhost' && currentDomain === '127.0.0.1') ||
                                (storedDomain === '127.0.0.1' && currentDomain === 'localhost');
            
            if (storedDomain && !domainsMatch) {
                console.log(`Domain changed from ${storedDomain} to ${currentDomain}, clearing fingerprint data`);
                localStorage.removeItem('fingerprintRegistered');
                localStorage.removeItem('fingerprintCredentialId');
                localStorage.removeItem('fingerprintCredentialRawId');
                localStorage.removeItem('fingerprintDomain');
                setFingerprintRegistered(false);
            }
            
            // Store current domain
            localStorage.setItem('fingerprintDomain', currentDomain);
        };
        
        validateFingerprintDomain();
    }, []);

    // Device detection
    const detectDevice = () => {
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                             window.innerWidth <= 768 || 
                             ('ontouchstart' in window);
        setIsMobile(isMobileDevice);
        return isMobileDevice;
    };

    // Persistent attempt tracking functions
    const getStoredAttempts = () => {
        const attempts = localStorage.getItem('loginAttempts');
        const lastAttemptTime = localStorage.getItem('lastAttemptTime');
        const currentTime = Date.now();
        
        // Reset attempts if more than 30 minutes have passed
        if (lastAttemptTime && (currentTime - parseInt(lastAttemptTime)) > 30 * 60 * 1000) {
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lastAttemptTime');
            localStorage.removeItem('accountLocked');
            return 0;
        }
        
        return attempts ? parseInt(attempts) : 0;
    };

    const storeFailedAttempt = () => {
        const currentAttempts = getStoredAttempts() + 1;
        localStorage.setItem('loginAttempts', currentAttempts.toString());
        localStorage.setItem('lastAttemptTime', Date.now().toString());
        
        if (currentAttempts >= 3) {
            localStorage.setItem('accountLocked', 'true');
        }
        
        return currentAttempts;
    };

    const clearAttempts = () => {
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastAttemptTime');
        localStorage.removeItem('accountLocked');
    };

    const isAccountLocked = () => {
        return localStorage.getItem('accountLocked') === 'true';
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
        
        // Clear any existing data
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
                    name: "butterrobot83@gmail.com",
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
            localStorage.setItem('fingerprintDomain', window.location.hostname); // Store domain

            // Register in backend after successful local registration
            const backendSuccess = await registerFingerprintInBackend();
            if (backendSuccess) {
                setFingerprintRegistered(true);
                speak("Fingerprint registered successfully in both device and backend.");
                setError("");
                return true;
            } else {
                speak("Fingerprint registered locally but backend registration failed.");
                setError("Warning: Fingerprint may not work on other sessions");
                return true;
            }
            
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
        localStorage.removeItem('fingerprintDomain');
        
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
                
                // Clear failed attempts on successful auth
                clearAttempts();
                
                const userEmail = email || 'butterrobot83@gmail.com';
                Cookies.set('email', userEmail);
                Cookies.set('account_name', userEmail);
                
                setAccessGranted(true);
                
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
                speak("Fingerprint authentication failed. Proceeding to facial recognition.");
                
                // On mobile, proceed to face recognition if fingerprint fails
                if (isMobile) {
                    setTimeout(() => {
                        setAuthStep('face');
                        startFacialRecognition();
                    }, 1000);
                } else {
                    setError("Fingerprint authentication cancelled or failed");
                }
            } else if (error.name === 'InvalidStateError') {
                speak("No fingerprint credentials found. Proceeding to facial recognition.");
                localStorage.removeItem('fingerprintCredentialId');
                localStorage.removeItem('fingerprintRegistered');
                localStorage.removeItem('fingerprintCredentialRawId');
                setFingerprintRegistered(false);
                
                if (isMobile) {
                    setTimeout(() => {
                        setAuthStep('face');
                        startFacialRecognition();
                    }, 1000);
                }
            } else {
                speak("Fingerprint authentication error. Please try again.");
                setError("Fingerprint authentication failed: " + error.message);
            }
            return false;
        }
    };

    const checkBackendFingerprintStatus = async () => {
    try {
        // Always use the fixed email for consistency
        const userEmail = FIXED_USER_EMAIL;
        const currentDomain = window.location.hostname;
        
        console.log(`Checking backend status for: ${userEmail} on domain: ${currentDomain}`);
        
        const response = await fetch(`${baseURL}/check_fingerprint_status/?email=${userEmail}&domain=${currentDomain}`);
        const result = await response.json();
        
        console.log('Backend fingerprint status result:', result);
        
        setBackendFingerprintRegistered(result.is_registered);
        return result.is_registered;
    } catch (error) {
        console.error("Error checking backend fingerprint status:", error);
        return false;
    } finally {
        setFingerprintStatusLoading(false);
    }
};

        // Register fingerprint in backend
        
        const registerFingerprintInBackend = async () => {
            try {
                // Always use the fixed email for consistency
                const userEmail = FIXED_USER_EMAIL;
                const currentDomain = window.location.hostname;
                
                console.log(`Registering fingerprint in backend for: ${userEmail} on domain: ${currentDomain}`);
                
                const response = await fetch(`${baseURL}/register_fingerprint/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, domain: currentDomain })
                });
                
                const result = await response.json();
                console.log('Backend registration result:', result);
                
                if (result.success) {
                    setBackendFingerprintRegistered(true);
                }
                return result.success;
            } catch (error) {
                console.error("Error registering fingerprint in backend:", error);
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
            const mobile = detectDevice();
            
            if (mobile && fingerprintSupported && fingerprintRegistered) {
                speak("Welcome to the secure authentication system. Mobile authentication sequence initiated.");
            } else if (mobile && fingerprintSupported && !fingerprintRegistered) {
                speak("Welcome to the secure authentication system. You can register your fingerprint for enhanced security.");
            } else {
                speak("Welcome to the secure authentication system. Please enter your credentials.");
            }
        }
    };

    // Initialize component
    // Complete initialization useEffect
        useEffect(() => {
            const initializeAuth = async () => {
                // Fetch API key first
                fetchAPIKey();
                
                // Check local fingerprint support first
                const localSupported = await checkFingerprintSupport();
                console.log('Local fingerprint supported:', localSupported);
                
                // Check backend status
                const backendRegistered = await checkBackendFingerprintStatus();
                console.log('Backend fingerprint registered:', backendRegistered);
                
                // Check local registration status
                const localRegistered = localStorage.getItem('fingerprintRegistered') === 'true';
                const hasCredentials = localStorage.getItem('fingerprintCredentialId') && 
                                    localStorage.getItem('fingerprintCredentialRawId');
                
                console.log('Local fingerprint registered:', localRegistered);
                console.log('Has credentials:', hasCredentials);
                
                // Only consider fingerprint fully registered if:
                // 1. Local storage says it's registered
                // 2. We have the credential data
                // 3. Backend says it's registered
                const fullyRegistered = localRegistered && hasCredentials && backendRegistered;
                
                console.log('Fully registered:', fullyRegistered);
                setFingerprintRegistered(fullyRegistered);
                
                // If local says registered but backend doesn't, try to register in backend
                if (localRegistered && hasCredentials && !backendRegistered) {
                    console.log('Local registered but not in backend, attempting backend registration...');
                    const backendSuccess = await registerFingerprintInBackend();
                    if (backendSuccess) {
                        setFingerprintRegistered(true);
                        console.log('Successfully registered in backend');
                    } else {
                        console.log('Failed to register in backend');
                    }
                }
                
                // Initialize device detection and stored attempts
                const mobile = detectDevice();
                const storedAttempts = getStoredAttempts();
                const locked = isAccountLocked();
                
                setFailedAttempts(storedAttempts);
                setIsLockedOut(locked);
                
                console.log(`Device: ${mobile ? 'Mobile' : 'Desktop'}, Stored attempts: ${storedAttempts}, Locked: ${locked}`);
                
                // Initialize audio elements
                const grantedAudio = new Audio(access_granted_audio);
                const deniedAudio = new Audio(access_denied_audio);
                
                accessGrantedAudioRef.current = grantedAudio;
                accessDeniedAudioRef.current = deniedAudio;
                
                // Start scanline animation
                const intervalId = setInterval(() => {
                    if (scanlineRef.current) {
                        scanlineRef.current.style.top = Math.random() * 100 + "%";
                        scanlineRef.current.style.opacity = (Math.random() * 0.4 + 0.2);
                    }
                }, 1000);
                
                // Add event listeners for user interaction
                const container = containerRef.current;
                if (container) {
                    container.addEventListener('click', handleUserInteraction);
                    container.addEventListener('keydown', handleUserInteraction);
                }
                
                // Cleanup function
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
            };
            
            initializeAuth();
        }, []);

    // Load voices when available
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

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
                
                // Clear failed attempts on successful face auth
                clearAttempts();
                
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                const userEmail = email || 'butterrobot83@gmail.com';
                Cookies.set('email', userEmail);
                
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
                
                // Store failed face recognition attempt
                const attempts = storeFailedAttempt();
                setFailedAttempts(attempts);
                setIsLockedOut(attempts >= 3);
            }
            
        } catch (error) {
            console.error("Error in facial recognition:", error);
            speak(`Facial recognition system error. Please try again.`);
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

    // Handle password verification
    const verifyPassword = async () => {
    setEmailError("");
    setPasswordError("");
    setError("");
    setLoading(true);

    if (!email) {
        setEmailError("Email is required.");
        speak("Please enter your email address.");
        setLoading(false);
        return false;
    }
    if (!password) {
        setPasswordError("Password is required.");
        speak("Please enter your password.");
        setLoading(false);
        return false;
    }

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
            const { email: responseEmail } = await response.json();
            setPasswordVerified(true);
            
            if (isMobile && fingerprintSupported) {
                if (fingerprintRegistered) {
                    // Try existing fingerprint
                    speak("Password verified. Please authenticate with your fingerprint.");
                    setAuthStep('fingerprint');
                    setLoading(false);
                    
                    setTimeout(() => {
                        authenticateWithFingerprint();
                    }, 1000);
                } else {
                    // Offer to register fingerprint
                    speak("Password verified. Would you like to set up fingerprint authentication for faster login?");
                    setShowFingerprintReRegister(true);
                    setLoading(false);
                }
            } else {
                // Desktop flow - complete login
                speak("Access granted. Welcome back, Mr Motingwe.");
                clearAttempts();
                Cookies.set('email', responseEmail);
                setAccessGranted(true);
                
                setTimeout(() => {
                    Cookies.set('account_name', responseEmail);
                    navigate(`/personal_info`);
                }, 3000);
            }
            
            return true;
        } else {
            const attempts = storeFailedAttempt();
            setFailedAttempts(attempts);
            
            if (attempts >= 3) {
                setIsLockedOut(true);
                setAuthStep('face');
                setError("ACCOUNT LOCKED: Too many failed attempts. Facial recognition required.");
                speak("Account locked due to multiple failed attempts. Please use facial recognition.");
            } else {
                const remainingAttempts = 3 - attempts;
                setError(`AUTHENTICATION FAILED: Invalid Credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
                speak(`Authentication failed. You have ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
            }
            
            setLoading(false);
            return false;
        }
    } catch (error) {
        setError("CONNECTION ERROR: Unable to reach authentication server");
        speak("Connection error. Please check your network and try again.");
        setLoading(false);
        return false;
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userInteracted) {
            handleUserInteraction();
            return;
        }
        
        // Check if account is locked from stored data
        if (isAccountLocked() && !faceVerified) {
            speak("Account is locked due to multiple failed attempts. Please use facial recognition.");
            setAuthStep('face');
            startFacialRecognition();
            return;
        }
        
        // Handle different authentication steps
        if (authStep === 'password') {
            await verifyPassword();
        } else if (authStep === 'fingerprint') {
            await authenticateWithFingerprint();
        } else if (authStep === 'face') {
            startFacialRecognition();
        }
    };

    const proceedToLogin = () => {
    clearAttempts();
    const userEmail = email || 'butterrobot83@gmail.com';
    Cookies.set('email', userEmail);
    setAccessGranted(true);
    
    setTimeout(() => {
        speak("Welcome back, Mr Motingwe.");
        Cookies.set('account_name', userEmail);
        navigate(`/personal_info`);
    }, 2000);
};

    const handleFingerprintReRegister = async (register) => {
    setShowFingerprintReRegister(false);


    
    if (register) {
        const success = await registerFingerprint();
        if (success) {
            setTimeout(() => {
                authenticateWithFingerprint();
            }, 1000);
        } else {
            // If registration fails, proceed to login
            proceedToLogin();
        }
    } else {
        // User declined, proceed to login
        speak("Fingerprint setup skipped. Logging you in now.");
        proceedToLogin();
    }
};

    // Get current step description for UI
    const getCurrentStepDescription = () => {
        if (isLockedOut) return "Account locked - biometric authentication required";
        
        switch (authStep) {
            case 'password':
                return isMobile ? "Step 1: Password verification" : "Password authentication";
            case 'fingerprint':
                return "Step 2: Fingerprint verification";
            case 'face':
                return "Facial recognition verification";
            default:
                return "Authentication required";
        }
    };

    // Get button text based on current step
    const getButtonText = () => {
        if (loading) {
            return (
                <>
                    <span className="hud-button-text">VERIFYING</span>
                    <span className="hud-loading-dots">...</span>
                </>
            );
        }
        
        if (isLockedOut && !faceVerified) return 'LOCKED - FACIAL SCAN REQUIRED';
        
        switch (authStep) {
            case 'password':
                return 'VERIFY PASSWORD';
            case 'fingerprint':
                return 'AUTHENTICATE WITH FINGERPRINT';
            case 'face':
                return 'START FACIAL RECOGNITION';
            default:
                return 'AUTHENTICATE';
        }
    };
    



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
                            {isMobile && (
                                <div className="step-indicator">
                                    STEP 2 OF 2
                                </div>
                            )}
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
                            {isMobile && authStep === 'face' && (
                                <div className="step-indicator">
                                    FALLBACK AUTHENTICATION
                                </div>
                            )}
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
                        <div className="hud-subtitle">{getCurrentStepDescription()}</div>
                        
                        {/* Authentication progress indicator for mobile */}
                        {isMobile && !isLockedOut && (
                            <div className="auth-progress">
                                <div className={`progress-step ${authStep === 'password' || passwordVerified ? 'active' : ''} ${passwordVerified ? 'complete' : ''}`}>
                                    1. PASSWORD
                                </div>
                                <div className="progress-arrow">→</div>
                                <div className={`progress-step ${authStep === 'fingerprint' && passwordVerified ? 'active' : ''}`}>
                                    2. FINGERPRINT
                                </div>
                            </div>
                        )}
                        
                        {/* Biometric options display */}
                        {fingerprintSupported && !isMobile && backendFingerprintRegistered && (
                            <div className="biometric-available">
                                🔒 Fingerprint authentication available
                            </div>
                        )}

                        {fingerprintSupported && !isMobile && !backendFingerprintRegistered && !fingerprintStatusLoading && (
                            <div className="biometric-setup">
                                📱 Fingerprint setup available
                            </div>
                        )}
                        
                        {isLockedOut && (
                            <div className="lockout-warning">
                                🔒 ACCOUNT LOCKED - FACIAL RECOGNITION REQUIRED
                                <div className="lockout-details">
                                    Failed attempts: {failedAttempts}/3
                                </div>
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
                        <form onSubmit={handleSubmit} className="hud-form">
                            {error && <div className="hud-error-message">{error}</div>}
                            
                            {/* Desktop fingerprint quick access */}
                            {!isMobile && fingerprintSupported && fingerprintRegistered  && backendFingerprintRegistered && !isLockedOut && authStep === 'password' && (
                                <button 
                                    type="button"
                                    className="hud-button fingerprint-quick-button"
                                    onClick={authenticateWithFingerprint}
                                    disabled={loading}
                                >
                                    🔓 QUICK FINGERPRINT ACCESS
                                </button>
                            )}
                            
                            {/* Desktop fingerprint registration */}
                            {!isMobile && fingerprintSupported && !fingerprintRegistered  && !backendFingerprintRegistered && !isLockedOut && authStep === 'password' && (
                                <button 
                                    type="button"
                                    className="hud-button fingerprint-register-button"
                                    onClick={registerFingerprint}
                                    disabled={loading}
                                >
                                    📱 REGISTER FINGERPRINT
                                </button>
                            )}

                            {showFingerprintReRegister && (
                            <div className="fingerprint-overlay">
                                <div className="fingerprint-container">
                                    <div className="fingerprint-header">
                                        <h3>FINGERPRINT SETUP</h3>
                                        <div className="status-indicator">
                                            ENHANCED SECURITY AVAILABLE
                                        </div>
                                    </div>
                                    
                                    <div className="fingerprint-reregister-content">
                                        <div className="fingerprint-icon">
                                            <svg viewBox="0 0 100 100" className="fingerprint-svg">
                                                <path d="M50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 Z" 
                                                    fill="none" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M50,20 C35,20 20,35 20,50 C20,65 35,80 50,80 C65,80 80,65 80,50 C80,35 65,20 50,20 Z" 
                                                    fill="none" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M50,30 C40,30 30,40 30,50 C30,60 40,70 50,70 C60,70 70,60 70,50 C70,40 60,30 50,30 Z" 
                                                    fill="none" stroke="currentColor" strokeWidth="1"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="reregister-message">
                                            <p>Set up fingerprint authentication for faster and more secure login on this device?</p>
                                            <p className="reregister-note">This is recommended for enhanced security.</p>
                                        </div>
                                        
                                        <div className="reregister-buttons">
                                            <button 
                                                className="hud-button fingerprint-setup-button"
                                                onClick={() => handleFingerprintReRegister(true)}
                                            >
                                                SET UP FINGERPRINT
                                            </button>
                                            <button 
                                                className="hud-button skip-button"
                                                onClick={() => handleFingerprintReRegister(false)}
                                            >
                                                SKIP FOR NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                            
                            {/* Password fields - show unless we're in face-only mode */}
                            {authStep !== 'face' && (
                                <>
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
                                                    disabled={authStep === 'fingerprint' || (isLockedOut && !faceVerified)}
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
                                                    disabled={authStep === 'fingerprint' || (isLockedOut && !faceVerified)}
                                                />
                                                <div className="hud-input-border"></div>
                                            </div>
                                            {passwordError && <div className="hud-field-error">{passwordError}</div>}
                                        </label>
                                    </div>
                                </>
                            )}
                            
                            {/* Show fingerprint button on mobile when in fingerprint step */}
                            {isMobile && authStep === 'fingerprint' && passwordVerified && (
                                <div className="mobile-fingerprint-section">
                                    <div className="step-description">
                                        Password verified! Now authenticate with your fingerprint.
                                    </div>
                                    <button 
                                        type="button"
                                        className="hud-button fingerprint-mobile-button"
                                        onClick={authenticateWithFingerprint}
                                        disabled={loading}
                                    >
                                        🔓 AUTHENTICATE WITH FINGERPRINT
                                    </button>
                                    <button 
                                        type="button"
                                        className="hud-button facial-recognition-fallback"
                                        onClick={() => {
                                            setAuthStep('face');
                                            startFacialRecognition();
                                        }}
                                        disabled={loading}
                                    >
                                        👁️ USE FACIAL RECOGNITION INSTEAD
                                    </button>
                                </div>
                            )}
                            
                            {/* Main authentication button */}
                            {authStep !== 'fingerprint' && (
                                <button 
                                    type="submit" 
                                    className={`hud-button ${loading ? 'hud-button-loading' : ''} ${isLockedOut && !faceVerified ? 'hud-button-disabled' : ''}`} 
                                    disabled={loading || (isLockedOut && !faceVerified && authStep !== 'face')}
                                >
                                    {getButtonText()}
                                </button>
                            )}
                            
                            {/* Locked out options */}
                            {isLockedOut && !faceVerified && authStep === 'password' && (
                                <div className="biometric-unlock-options">
                                    <button 
                                        type="button"
                                        className="hud-button facial-recognition-button"
                                        onClick={() => {
                                            setAuthStep('face');
                                            startFacialRecognition();
                                        }}
                                    >
                                        👁️ FACIAL RECOGNITION UNLOCK
                                    </button>
                                </div>
                            )}
                            
                            {/* Reset attempts button (for testing/admin purposes) */}
                            {process.env.NODE_ENV === 'development' && failedAttempts > 0 && (
                                <button 
                                    type="button"
                                    className="hud-button reset-attempts-button"
                                    onClick={() => {
                                        clearAttempts();
                                        setFailedAttempts(0);
                                        setIsLockedOut(false);
                                        setAuthStep('password');
                                        setPasswordVerified(false);
                                        speak("Login attempts reset for development.");
                                    }}
                                >
                                    🔄 RESET ATTEMPTS (DEV)
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>

        
            
            <style jsx>{`
            
                .fingerprint-reregister-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .reregister-message {
                    text-align: center;
                    color: rgba(0, 162, 255, 0.9);
                }

                .reregister-message p {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    letter-spacing: 1px;
                }

                .reregister-note {
                    font-size: 0.9rem !important;
                    color: rgba(0, 255, 157, 0.8) !important;
                }

                .reregister-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }

                .fingerprint-setup-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }

                .skip-button {
                    background: linear-gradient(90deg, 
                                rgba(100, 80, 0, 0.5) 0%, 
                                rgba(180, 140, 0, 0.6) 50%,
                                rgba(100, 80, 0, 0.5) 100%);
                    border-color: rgba(255, 215, 0, 0.5);
                    font-size: 0.9rem;
                }
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
                
                /* Authentication Progress Indicator */
                .auth-progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 1rem 0;
                    padding: 1rem;
                    background-color: rgba(0, 26, 56, 0.3);
                    border-radius: 4px;
                    border: 1px solid rgba(0, 162, 255, 0.2);
                }
                
                .progress-step {
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    border: 1px solid rgba(0, 162, 255, 0.3);
                    background-color: rgba(0, 26, 56, 0.5);
                    color: rgba(0, 162, 255, 0.6);
                    transition: all 0.3s ease;
                }
                
                .progress-step.active {
                    border-color: rgba(0, 162, 255, 0.8);
                    color: #00a2ff;
                    background-color: rgba(0, 162, 255, 0.1);
                    text-shadow: 0 0 5px rgba(0, 162, 255, 0.5);
                }
                
                .progress-step.complete {
                    border-color: rgba(0, 255, 157, 0.8);
                    color: #00ff9d;
                    background-color: rgba(0, 255, 157, 0.1);
                    text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
                }
                
                .progress-arrow {
                    margin: 0 1rem;
                    color: rgba(0, 162, 255, 0.6);
                    font-size: 1.2rem;
                }
                
                .step-indicator {
                    color: rgba(0, 162, 255, 0.7);
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    margin-top: 0.5rem;
                }
                
                /* Mobile-specific styles */
                .mobile-fingerprint-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin: 1rem 0;
                }
                
                .step-description {
                    color: #00ff9d;
                    background-color: rgba(0, 255, 157, 0.1);
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    padding: 1rem;
                    border-radius: 4px;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                    text-align: center;
                }
                
                .fingerprint-mobile-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }
                
                .facial-recognition-fallback {
                    background: linear-gradient(90deg, 
                                rgba(100, 80, 0, 0.5) 0%, 
                                rgba(180, 140, 0, 0.6) 50%,
                                rgba(100, 80, 0, 0.5) 100%);
                    border-color: rgba(255, 215, 0, 0.5);
                    font-size: 0.9rem;
                }
                
                .lockout-details {
                    font-size: 0.7rem;
                    margin-top: 0.5rem;
                    opacity: 0.8;
                }
                
                .reset-attempts-button {
                    background: linear-gradient(90deg, 
                                rgba(100, 0, 100, 0.5) 0%, 
                                rgba(180, 0, 180, 0.6) 50%,
                                rgba(100, 0, 100, 0.5) 100%);
                    border-color: rgba(255, 0, 255, 0.5);
                    font-size: 0.8rem;
                    margin-top: 1rem;
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
                
                @keyframes pulseFingerprintScan {
                    0% { 
                        border-color: #00ff9d;
                        box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
                    }
                    50% { 
                        border-color: #00a2ff;
                        box-shadow: 0 0 30px rgba(0, 162, 255, 0.7);
                    }
                    100% { 
                        border-color: #00ff9d;
                        box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
                    }
                }
                
                @keyframes rotateScan {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Biometric options styling */
                .biometric-options {
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
                
                .biometric-unlock-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                /* Button variations for biometric functions */
                .fingerprint-quick-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                    margin-bottom: 1rem;
                }
                
                .fingerprint-register-button {
                    background: linear-gradient(90deg, 
                                rgba(100, 80, 0, 0.5) 0%, 
                                rgba(180, 140, 0, 0.6) 50%,
                                rgba(100, 80, 0, 0.5) 100%);
                    border-color: rgba(255, 215, 0, 0.5);
                    margin-bottom: 1rem;
                }
                
                .fingerprint-unlock-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                }
                
                /* Base component styles */
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
                
                @keyframes pulseRed {
                    0% { box-shadow: 0 0 5px rgba(255, 69, 0, 0.3); }
                    50% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.6); }
                    100% { box-shadow: 0 0 5px rgba(255, 69, 0, 0.3); }
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
                
                .facial-recognition-button {
                    background: linear-gradient(90deg, 
                                rgba(0, 100, 50, 0.5) 0%, 
                                rgba(0, 180, 90, 0.6) 50%,
                                rgba(0, 100, 50, 0.5) 100%);
                    border-color: rgba(0, 255, 127, 0.5);
                    margin-top: 0.5rem;
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
                @media (max-width: 768px) {
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
                    
                    .auth-progress {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .progress-arrow {
                        transform: rotate(90deg);
                        margin: 0.5rem 0;
                    }
                    
                    .mobile-fingerprint-section {
                        gap: 1rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .hud-login-wrapper {
                        width: 95%;
                    }
                    
                    .hud-login-inner {
                        padding: 1rem;
                    }
                    
                    .hud-title {
                        font-size: 1.3rem;
                    }
                    
                    .hud-subtitle {
                        font-size: 0.8rem;
                    }
                    
                    .auth-progress {
                        padding: 0.75rem;
                    }
                    
                    .progress-step {
                        padding: 0.4rem 0.8rem;
                        font-size: 0.7rem;
                    }
                    
                    .step-description {
                        font-size: 0.8rem;
                        padding: 0.75rem;
                    }
                    
                    .hud-button {
                        padding: 0.6rem 1rem;
                        font-size: 0.8rem;
                        letter-spacing: 1px;
                    }

                }
            `}</style>
        </div>
    );
}

// views.py

// @csrf_exempt

// def check_fingerprint_status(request):

// class FingerPrintStatus(models.Model):

//  is_registered = # set to true since my fingerprint is already registered

// can you update my code such that it checks whether my fingerprint is registered in my djnago db, and if it is, no need to show the register fingerprint thing? because it would be easy with the current setup for someone to setup their fingerprint on their device, which is not mine. And since I'm the only user, that woule be inconvenient. so it checks the status in the backend, and if not registered, gives me the option too as it does already on mobile, then when I do it sets it in the backend to true.

// no need to provide the full code. just tell me what I need to update, but give me one file with all the updates.