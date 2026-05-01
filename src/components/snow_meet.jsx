import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Copy, Video, Users, Link as LinkIcon, AlertCircle } from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, getDoc, arrayUnion, collection } from 'firebase/firestore';

// --- Global Firebase Config ---
let app, auth, db, appId;
try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  appId = typeof __app_id !== 'undefined' ? __app_id : 'default-snowmeet-id';
  if (firebaseConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase config not found or invalid. Signaling won't work locally without it.");
}

// --- Styles (No Tailwind, Light Blue & White Theme) ---
const styles = {
  appContainer: {
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f9fd',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#1e293b',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '16px 32px',
    boxShadow: '0 4px 20px rgba(0, 85, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0ea5e9', // Light professional blue
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.5px'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 20px 40px rgba(14, 165, 233, 0.08)',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #e0f2fe'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '12px',
    marginTop: 0
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  buttonPrimary: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
    marginBottom: '16px'
  },
  buttonSecondary: {
    backgroundColor: '#f0f9ff',
    color: '#0ea5e9',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  input: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a', // Dark background for video room
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  localVideoContainer: {
    position: 'absolute',
    bottom: '100px',
    right: '32px',
    width: '240px',
    height: '160px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '2px solid #334155',
    zIndex: 20
  },
  localVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)' // Mirror local video
  },
  controlBar: {
    position: 'absolute',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '12px 24px',
    borderRadius: '100px',
    display: 'flex',
    gap: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    zIndex: 30,
    alignItems: 'center'
  },
  controlButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#ffffff'
  },
  controlButtonActive: {
    backgroundColor: '#334155', // Grey/blue for active state
  },
  controlButtonInactive: {
    backgroundColor: '#ef4444', // Red for muted/off
  },
  hangupButton: {
    backgroundColor: '#ef4444',
    width: '64px',
    height: '48px',
    borderRadius: '24px',
  },
  shareBox: {
    position: 'absolute',
    top: '32px',
    left: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '350px'
  },
  linkText: {
    fontSize: '14px',
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  statusMessage: {
    color: '#ffffff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '20px',
    fontWeight: '500',
    zIndex: 5,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

// --- WebRTC Servers ---
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function SnowMeet() {
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState('home'); // 'home', 'creating', 'joining', 'incall'
  const [callId, setCallId] = useState('');
  const [joinId, setJoinId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  // Media States
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Refs for WebRTC & Elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  
  // Track processed candidates to avoid adding duplicates
  const processedOfferCandidates = useRef(0);
  const processedAnswerCandidates = useRef(0);
  const unsubscribeCall = useRef(null);

  // 1. Initialize Firebase Auth
  useEffect(() => {
    if (!auth) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setErrorMsg("Failed to connect to authentication server.");
      }
    };
    
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  // 2. Check URL for existing call ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callParam = params.get('call');
    if (callParam) {
      setJoinId(callParam);
    }
  }, []);

  // 3. Media Handlers
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn]);

  const initLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Media Error:", err);
      setErrorMsg("Could not access camera or microphone. Please allow permissions.");
      return null;
    }
  };

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection(servers);
    pcRef.current = pc;
    
    // Create empty remote stream
    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    // Add local tracks to peer connection
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    // Listen for remote tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track);
      });
      setRemoteConnected(true);
    };

    return pc;
  };

  // --- WebRTC Create Call (Host) ---
  const startCall = async () => {
    if (!user || !db) {
      setErrorMsg("Cannot create call: Server disconnected.");
      return;
    }
    
    setAppState('creating');
    const stream = await initLocalMedia();
    if (!stream) {
      setAppState('home');
      return;
    }

    const newCallId = Math.random().toString(36).substring(2, 9);
    setCallId(newCallId);
    
    // Update URL
    window.history.pushState({}, '', `?call=${newCallId}`);

    const pc = setupPeerConnection();
    const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', `calls_${newCallId}`);

    // Initialize document
    await setDoc(callDocRef, {
      offer: null,
      answer: null,
      offerCandidates: [],
      answerCandidates: []
    });

    // Handle ICE Candidates (Offer)
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await updateDoc(callDocRef, {
          offerCandidates: arrayUnion(event.candidate.toJSON())
        });
      }
    };

    // Create Offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await updateDoc(callDocRef, { offer });

    // Listen for Answer and Answer Candidates
    unsubscribeCall.current = onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      if (!pc.currentRemoteDescription && data.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }

      if (data.answerCandidates && Array.isArray(data.answerCandidates)) {
        data.answerCandidates.forEach((candidate, index) => {
          if (index >= processedAnswerCandidates.current) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
            processedAnswerCandidates.current++;
          }
        });
      }
    });

    setAppState('incall');
  };

  // --- WebRTC Join Call (Guest) ---
  const joinCall = async (idToJoin) => {
    if (!user || !db) {
      setErrorMsg("Cannot join call: Server disconnected.");
      return;
    }

    if (!idToJoin) {
      setErrorMsg("Please enter a meeting ID.");
      return;
    }

    setAppState('joining');
    
    const callDocRef = doc(db, 'artifacts', appId, 'public', 'data', `calls_${idToJoin}`);
    const callSnapshot = await getDoc(callDocRef);

    if (!callSnapshot.exists()) {
      setErrorMsg("Meeting not found. Please check the link or ID.");
      setAppState('home');
      return;
    }

    const stream = await initLocalMedia();
    if (!stream) {
      setAppState('home');
      return;
    }

    setCallId(idToJoin);
    // Update URL just in case they typed it manually
    if (!window.location.search.includes(idToJoin)) {
      window.history.pushState({}, '', `?call=${idToJoin}`);
    }

    const pc = setupPeerConnection();

    // Handle ICE Candidates (Answer)
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await updateDoc(callDocRef, {
          answerCandidates: arrayUnion(event.candidate.toJSON())
        });
      }
    };

    const callData = callSnapshot.data();
    
    if (!callData.offer) {
       setErrorMsg("Meeting has no active offer.");
       setAppState('home');
       return;
    }

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await updateDoc(callDocRef, { answer });

    // Listen for Offer Candidates
    unsubscribeCall.current = onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      if (data.offerCandidates && Array.isArray(data.offerCandidates)) {
        data.offerCandidates.forEach((candidate, index) => {
          if (index >= processedOfferCandidates.current) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
            processedOfferCandidates.current++;
          }
        });
      }
    });

    setAppState('incall');
  };

  const hangup = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }
    if (unsubscribeCall.current) {
      unsubscribeCall.current();
    }
    
    // Clean up DB manually if we wanted to, but let's just reset state
    setCallId('');
    setJoinId('');
    setRemoteConnected(false);
    processedOfferCandidates.current = 0;
    processedAnswerCandidates.current = 0;
    
    window.history.pushState({}, '', window.location.pathname);
    setAppState('home');
  };

  // Utility to handle clipboard copying due to iframe restrictions
  const copyToClipboard = () => {
    const textToCopy = window.location.origin + window.location.pathname + '?call=' + callId;
    
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <div style={styles.appContainer}>
      {appState === 'home' && (
        <>
          <header style={styles.header}>
            <div style={styles.logo}>
              <Video color="#0ea5e9" size={28} />
              SnowMeet
            </div>
            {user ? (
              <div style={{fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px'}}>
                 <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
                 System Ready
              </div>
            ) : (
              <div style={{fontSize: '14px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px'}}>
                 <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b'}}></div>
                 Connecting...
              </div>
            )}
          </header>

          <main style={styles.mainContent}>
            <div style={styles.card}>
              <h1 style={styles.title}>Premium Video Meetings</h1>
              <p style={styles.subtitle}>Connect seamlessly with your team using SnowMeet. Professional, secure, and fast.</p>
              
              {errorMsg && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} />
                  {errorMsg}
                </div>
              )}

              <button 
                style={styles.buttonPrimary} 
                onClick={startCall}
                disabled={!user || appState === 'creating'}
              >
                <Video size={20} />
                {appState === 'creating' ? 'Starting...' : 'New Meeting'}
              </button>
              
              <div style={{margin: '24px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '14px'}}>
                 <div style={{flex: 1, height: '1px', backgroundColor: '#e2e8f0'}}></div>
                 or
                 <div style={{flex: 1, height: '1px', backgroundColor: '#e2e8f0'}}></div>
              </div>

              <input 
                style={styles.input}
                placeholder="Enter meeting ID or paste link"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                onFocus={() => setErrorMsg('')}
              />
              <button 
                style={styles.buttonSecondary}
                onClick={() => joinCall(joinId.replace(/.*call=/, ''))} // Extracts ID if they pasted full link
                disabled={!joinId || !user || appState === 'joining'}
              >
                <Users size={20} />
                {appState === 'joining' ? 'Joining...' : 'Join Meeting'}
              </button>
            </div>
          </main>
        </>
      )}

      {appState === 'incall' && (
        <div style={styles.videoContainer}>
          {/* Main Remote Video */}
          {!remoteConnected && (
            <div style={styles.statusMessage}>
              <div className="spinner" style={{
                width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', 
                borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite'
              }}></div>
              Waiting for others to join...
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          <video 
            ref={remoteVideoRef} 
            style={{...styles.remoteVideo, display: remoteConnected ? 'block' : 'none'}} 
            autoPlay 
            playsInline
          />

          {/* Share Box Overlay */}
          <div style={styles.shareBox}>
            <LinkIcon size={18} color="#64748b" />
            <span style={styles.linkText}>
              {window.location.origin + window.location.pathname + '?call=' + callId}
            </span>
            <button style={styles.iconBtn} onClick={copyToClipboard} title="Copy Link">
              {copied ? <span style={{fontSize: '12px', fontWeight: 'bold'}}>Copied!</span> : <Copy size={18} />}
            </button>
          </div>

          {/* Picture in Picture Local Video */}
          <div style={styles.localVideoContainer}>
            <video 
              ref={localVideoRef} 
              style={styles.localVideo} 
              autoPlay 
              playsInline 
              muted // Always mute local video visually to avoid feedback
            />
          </div>

          {/* Bottom Control Bar */}
          <div style={styles.controlBar}>
            <button 
              style={{...styles.controlButton, ...(isMicOn ? styles.controlButtonActive : styles.controlButtonInactive)}}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            
            <button 
              style={{...styles.controlButton, ...(isVideoOn ? styles.controlButtonActive : styles.controlButtonInactive)}}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video size={22} /> : <CameraOff size={22} />}
            </button>
            
            <button 
              style={{...styles.controlButton, ...styles.hangupButton}}
              onClick={hangup}
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}