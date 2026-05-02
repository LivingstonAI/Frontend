import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Copy, Video, Users, Link as LinkIcon, AlertCircle, CheckCircle, FileText, ChevronDown, ChevronUp, Download, Globe } from 'lucide-react';

// ─── PeerJS loaded from CDN ───────────────────────────────────────────────────
// Add to your index.html:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.2/peerjs.min.js"></script>
// ─────────────────────────────────────────────────────────────────────────────

// ─── Supported languages for transcription ───────────────────────────────────
const LANGUAGES = [
  { code: 'en-US', label: '🇺🇸 English (US)' },
  { code: 'en-GB', label: '🇬🇧 English (UK)' },
  { code: 'af-ZA', label: '🇿🇦 Afrikaans' },
  { code: 'zh-CN', label: '🇨🇳 Chinese (Mandarin)' },
  { code: 'fr-FR', label: '🇫🇷 French' },
  { code: 'de-DE', label: '🇩🇪 German' },
  { code: 'hi-IN', label: '🇮🇳 Hindi' },
  { code: 'it-IT', label: '🇮🇹 Italian' },
  { code: 'ja-JP', label: '🇯🇵 Japanese' },
  { code: 'ko-KR', label: '🇰🇷 Korean' },
  { code: 'pt-BR', label: '🇧🇷 Portuguese (BR)' },
  { code: 'ru-RU', label: '🇷🇺 Russian' },
  { code: 'es-ES', label: '🇪🇸 Spanish' },
  { code: 'ar-SA', label: '🇸🇦 Arabic' },
];

// --- Responsive helper ---
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 600;

// --- Styles (Original Light Blue & White Theme + mobile responsive) ---
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
    padding: '12px 20px',
    boxShadow: '0 4px 20px rgba(0, 85, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.5px'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '16px',
    paddingTop: '24px',
    position: 'relative',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px 24px',
    boxShadow: '0 20px 40px rgba(14, 165, 233, 0.08)',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #e0f2fe'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px',
    marginTop: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  buttonPrimary: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
    marginBottom: '14px'
  },
  buttonPrimaryDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  buttonSecondary: {
    backgroundColor: '#f0f9ff',
    color: '#0ea5e9',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '15px 24px',
    fontSize: '15px',
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
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    marginBottom: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  peerIdBox: {
    marginTop: '20px',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    textAlign: 'left',
  },
  peerIdLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '3px',
    fontWeight: '500',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  peerIdValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.04em',
    wordBreak: 'break-all',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  // ── In-call screen ──────────────────────────────────────────────────────────
  videoContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0f172a',
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
  // PiP: smaller on mobile, sits above control bar
  localVideoContainer: {
    position: 'absolute',
    bottom: '90px',
    right: '12px',
    width: '110px',
    height: '80px',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
    border: '2px solid #334155',
    zIndex: 20
  },
  localVideoContainerDesktop: {
    position: 'absolute',
    bottom: '100px',
    right: '32px',
    width: '220px',
    height: '150px',
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
    transform: 'scaleX(-1)'
  },
  controlBar: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '10px 16px',
    borderRadius: '100px',
    display: 'flex',
    gap: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    zIndex: 30,
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  controlButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#ffffff',
    flexShrink: 0,
  },
  controlButtonActive: { backgroundColor: '#334155' },
  controlButtonInactive: { backgroundColor: '#ef4444' },
  hangupButton: {
    backgroundColor: '#ef4444',
    width: '58px',
    height: '44px',
    borderRadius: '22px',
    flexShrink: 0,
  },
  // Share box: full-width strip on mobile, floating card on desktop
  shareBox: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    padding: '10px 14px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  shareBoxDesktop: {
    position: 'absolute',
    top: '28px',
    left: '28px',
    right: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    padding: '14px 16px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '340px',
  },
  linkText: {
    fontSize: '12px',
    color: '#334155',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    fontFamily: "'Courier New', monospace",
    fontWeight: '600',
  },
  statusMessage: {
    color: '#ffffff',
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '17px',
    fontWeight: '500',
    zIndex: 5,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '80%',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  // ── Transcript panel ── mobile: bottom sheet; desktop: side panel ──────────
  transcriptPanel: {
    position: 'absolute',
    bottom: '80px',
    left: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '14px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    border: '1px solid #e0f2fe',
    zIndex: 30,
    overflow: 'hidden',
    transition: 'all 0.25s ease',
  },
  transcriptPanelDesktop: {
    position: 'absolute',
    bottom: '100px',
    left: '28px',
    right: 'auto',
    width: '320px',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    border: '1px solid #e0f2fe',
    zIndex: 30,
    overflow: 'hidden',
    transition: 'all 0.25s ease',
  },
  transcriptHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '11px 14px',
    backgroundColor: '#f0f9ff',
    borderBottom: '1px solid #bae6fd',
    cursor: 'pointer',
    userSelect: 'none',
  },
  transcriptHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
    letterSpacing: '0.02em',
  },
  transcriptHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  transcriptBody: {
    maxHeight: '180px',
    overflowY: 'auto',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  transcriptLine: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '7px 10px',
    borderLeft: '3px solid #0ea5e9',
  },
  transcriptInterim: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '4px 10px',
  },
  transcriptEmpty: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '14px 0',
    fontStyle: 'italic',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  transcriptToggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
  },
  transcriptDownloadBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '4px',
    transition: 'color 0.15s',
  },
  // ── Language picker ──────────────────────────────────────────────────────────
  langPickerWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  langPickerBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    transition: 'color 0.15s',
  },
  langDropdown: {
    position: 'absolute',
    bottom: '28px',
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e0f2fe',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 50,
    minWidth: '180px',
    overflow: 'hidden',
    maxHeight: '240px',
    overflowY: 'auto',
  },
  langOption: {
    padding: '9px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.1s',
  },
};

export default function SnowMeet() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [peerReady, setPeerReady]       = useState(false);
  const [myPeerId, setMyPeerId]         = useState('');
  const [appState, setAppState]         = useState('home'); // 'home' | 'creating' | 'joining' | 'incall'
  const [joinId, setJoinId]             = useState('');
  const [errorMsg, setErrorMsg]         = useState('');
  const [copied, setCopied]             = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [isMicOn, setIsMicOn]           = useState(true);
  const [isVideoOn, setIsVideoOn]       = useState(true);

  // ── Transcript state ───────────────────────────────────────────────────────
  const [transcriptOpen, setTranscriptOpen]       = useState(true);
  const [transcriptEnabled, setTranscriptEnabled] = useState(false);
  const [transcriptLines, setTranscriptLines]     = useState([]);
  const [interimText, setInterimText]             = useState('');
  const [isListening, setIsListening]             = useState(false);
  const [selectedLang, setSelectedLang]           = useState('en-US');
  const [showLangPicker, setShowLangPicker]       = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const localVideoRef  = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef        = useRef(null);
  const localStreamRef = useRef(null);
  const currentCallRef = useRef(null);
  const recognitionRef  = useRef(null);
  const transcriptEndRef = useRef(null);

  // ── 1. Boot PeerJS once on mount ───────────────────────────────────────────
  useEffect(() => {
    // PeerJS must be available on window (loaded via CDN script tag)
    if (typeof window.Peer === 'undefined') {
      setErrorMsg('PeerJS library not loaded. Add the CDN script to your index.html.');
      return;
    }

    const peer = new window.Peer(undefined, {
      host: '0.peerjs.com',
      port: 443,
      path: '/',
      secure: true,
    });

    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyPeerId(id);
      setPeerReady(true);
    });

    // ── Receive incoming call ────────────────────────────────────────────────
    peer.on('call', async (incomingCall) => {
      const stream = await initLocalMedia();
      if (!stream) return;
      incomingCall.answer(stream);
      currentCallRef.current = incomingCall;
      wireCallEvents(incomingCall);
      setAppState('incall');
    });

    peer.on('error', (err) => {
      setErrorMsg('Connection error: ' + err.message);
      console.error('PeerJS:', err);
    });

    return () => { peer.destroy(); };
  }, []);

  // ── 2. Mirror mic/cam toggles to live tracks ───────────────────────────────
  useEffect(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
  }, [isMicOn]);

  useEffect(() => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = isVideoOn; });
  }, [isVideoOn]);

  // ── Auto-scroll transcript to bottom ──────────────────────────────────────
  useEffect(() => {
    if (transcriptOpen) transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLines, interimText, transcriptOpen]);

  // ── Stop transcription when leaving call ──────────────────────────────────
  useEffect(() => {
    if (appState !== 'incall') stopTranscription();
    return () => stopTranscription();
  }, [appState]);

  // ── Restart recognition when language changes (only if already running) ───
  useEffect(() => {
    if (isListening) {
      stopTranscription();
      startTranscription();
    }
  }, [selectedLang]);

  const startTranscription = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          if (transcript) {
            setTranscriptLines(prev => [...prev, {
              text: transcript,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setInterimText('');
          }
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') console.error('Speech recognition error:', e.error);
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_) {}
      }
    };

    try { recognition.start(); } catch (_) {}
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  };

  const toggleTranscription = () => {
    if (isListening) {
      stopTranscription();
      setTranscriptEnabled(false);
    } else {
      setTranscriptEnabled(true);
      startTranscription();
    }
  };

  const downloadTranscript = () => {
    if (!transcriptLines.length) return;
    const text = transcriptLines.map(l => `[${l.time}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snowmeet-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const initLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      setErrorMsg('Could not access camera or microphone. Please allow permissions.');
      console.error(err);
      return null;
    }
  };

  const wireCallEvents = (call) => {
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setRemoteConnected(true);
    });
    call.on('close', () => hangup());
    call.on('error', (e) => setErrorMsg('Call error: ' + e.message));
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Host: get media, show call screen, wait for peer to call in */
  const startCall = async () => {
    if (!peerReady) { setErrorMsg('Still connecting to server, please wait.'); return; }
    setAppState('creating');
    const stream = await initLocalMedia();
    if (!stream) { setAppState('home'); return; }
    setAppState('incall');
  };

  /** Guest: get media, call the host by their Peer ID */
  const joinCall = async () => {
    const targetId = joinId.trim().replace(/.*[?&]call=/, ''); // handle pasted full URLs too
    if (!targetId) { setErrorMsg('Please enter a Peer ID.'); return; }
    if (!peerReady) { setErrorMsg('Still connecting to server, please wait.'); return; }

    setAppState('joining');
    const stream = await initLocalMedia();
    if (!stream) { setAppState('home'); return; }

    const outgoingCall = peerRef.current.call(targetId, stream);
    if (!outgoingCall) {
      setErrorMsg('Could not reach that Peer ID. Please check it and try again.');
      setAppState('home');
      return;
    }

    currentCallRef.current = outgoingCall;
    wireCallEvents(outgoingCall);
    setAppState('incall');
  };

  const hangup = () => {
    currentCallRef.current?.close();
    currentCallRef.current = null;
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setRemoteConnected(false);
    setIsMicOn(true);
    setIsVideoOn(true);
    setJoinId('');
    setTranscriptLines([]);
    setInterimText('');
    setTranscriptEnabled(false);
    setAppState('home');
  };

  const copyPeerId = () => {
    const text = myPeerId;
    // Clipboard fallback for iframes / older browsers
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const mobile = isMobile();

  return (
    <div style={styles.appContainer}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus { border-color: #0ea5e9 !important; }
      `}</style>

      {/* ════════════════ HOME SCREEN ════════════════ */}
      {appState !== 'incall' && (
        <>
          <header style={styles.header}>
            <div style={styles.logo}>
              <Video color="#0ea5e9" size={24} />
              SnowMeet
            </div>
            <div style={{ fontSize: '13px', color: peerReady ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: peerReady ? '#10b981' : '#f59e0b', animation: peerReady ? 'none' : 'pulse 1.5s infinite' }} />
              {peerReady ? 'Ready' : 'Connecting…'}
            </div>
          </header>

          <main style={styles.mainContent}>
            <div style={styles.card}>
              <h1 style={styles.title}>Premium Video Meetings</h1>
              <p style={styles.subtitle}>Free, instant calls — no sign-up needed.</p>

              {errorMsg && (
                <div style={styles.errorBox}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <button
                style={{ ...styles.buttonPrimary, ...(!peerReady || appState === 'creating' ? styles.buttonPrimaryDisabled : {}) }}
                onClick={startCall}
                disabled={!peerReady || appState === 'creating'}
              >
                <Video size={19} />
                {appState === 'creating' ? 'Starting…' : 'New Meeting'}
              </button>

              <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '13px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                or join with a Peer ID
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              <input
                style={styles.input}
                placeholder="Paste Peer ID here"
                value={joinId}
                onChange={e => { setJoinId(e.target.value); setErrorMsg(''); }}
                onKeyDown={e => e.key === 'Enter' && joinCall()}
              />
              <button
                style={{ ...styles.buttonSecondary, ...(!joinId || !peerReady || appState === 'joining' ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                onClick={joinCall}
                disabled={!joinId || !peerReady || appState === 'joining'}
              >
                <Users size={19} />
                {appState === 'joining' ? 'Joining…' : 'Join Meeting'}
              </button>

              {myPeerId && (
                <div style={styles.peerIdBox}>
                  <div style={{ minWidth: 0 }}>
                    <div style={styles.peerIdLabel}>Your Peer ID — share to receive calls</div>
                    <div style={styles.peerIdValue}>{myPeerId}</div>
                  </div>
                  <button style={styles.iconBtn} onClick={copyPeerId} title="Copy Peer ID">
                    {copied ? <CheckCircle size={20} color="#10b981" /> : <Copy size={20} />}
                  </button>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ════════════════ IN-CALL SCREEN ════════════════ */}
      {appState === 'incall' && (
        <div style={styles.videoContainer}>

          {/* Waiting overlay */}
          {!remoteConnected && (
            <div style={styles.statusMessage}>
              <div style={{ width: '38px', height: '38px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Waiting for the other person to join…
              <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{myPeerId}</span>
            </div>
          )}

          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            style={{ ...styles.remoteVideo, display: remoteConnected ? 'block' : 'none' }}
            autoPlay playsInline
          />

          {/* Share box — responsive */}
          <div style={mobile ? styles.shareBox : styles.shareBoxDesktop}>
            <LinkIcon size={15} color="#64748b" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Your Peer ID</span>
              <span style={styles.linkText}>{myPeerId}</span>
            </div>
            <button style={styles.iconBtn} onClick={copyPeerId} title="Copy">
              {copied ? <CheckCircle size={15} color="#10b981" /> : <Copy size={15} />}
            </button>
          </div>

          {/* Local PiP — smaller on mobile */}
          <div style={mobile ? styles.localVideoContainer : styles.localVideoContainerDesktop}>
            <video ref={localVideoRef} style={styles.localVideo} autoPlay playsInline muted />
          </div>

          {/* ── Transcript Panel ── */}
          <div style={mobile ? styles.transcriptPanel : styles.transcriptPanelDesktop}>
            <div style={styles.transcriptHeader} onClick={() => setTranscriptOpen(v => !v)}>
              <div style={styles.transcriptHeaderLeft}>
                <FileText size={14} color="#0ea5e9" />
                Transcript
                {isListening && (
                  <span style={styles.liveIndicator}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 1.4s infinite' }} />
                    Live
                  </span>
                )}
              </div>
              <div style={styles.transcriptHeaderRight}>
                {/* Language picker */}
                <div style={styles.langPickerWrapper} onClick={e => e.stopPropagation()}>
                  <button style={styles.langPickerBtn} onClick={() => setShowLangPicker(v => !v)} title="Change language">
                    <Globe size={13} />
                    {LANGUAGES.find(l => l.code === selectedLang)?.label.split(' ')[0]}
                  </button>
                  {showLangPicker && (
                    <div style={styles.langDropdown}>
                      {LANGUAGES.map(lang => (
                        <div
                          key={lang.code}
                          style={{ ...styles.langOption, backgroundColor: lang.code === selectedLang ? '#f0f9ff' : 'transparent' }}
                          onClick={() => { setSelectedLang(lang.code); setShowLangPicker(false); }}
                        >
                          {lang.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {transcriptLines.length > 0 && (
                  <button style={styles.transcriptDownloadBtn} onClick={e => { e.stopPropagation(); downloadTranscript(); }} title="Download">
                    <Download size={13} />
                  </button>
                )}
                <button style={styles.transcriptToggleBtn}>
                  {transcriptOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                </button>
              </div>
            </div>

            {transcriptOpen && (
              <div style={styles.transcriptBody}>
                {!transcriptEnabled && !transcriptLines.length && (
                  <div style={styles.transcriptEmpty}>
                    Press <strong style={{ color: '#0ea5e9' }}>CC</strong> in controls to start transcribing.
                  </div>
                )}
                {transcriptEnabled && isListening && !transcriptLines.length && !interimText && (
                  <div style={styles.transcriptEmpty}>Listening… start speaking.</div>
                )}
                {transcriptLines.map((line, i) => (
                  <div key={i} style={styles.transcriptLine}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginRight: '6px', fontWeight: '600' }}>{line.time}</span>
                    {line.text}
                  </div>
                ))}
                {interimText && <div style={styles.transcriptInterim}>…{interimText}</div>}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>

          {/* Control bar */}
          <div style={styles.controlBar}>
            <button
              style={{ ...styles.controlButton, ...(isMicOn ? styles.controlButtonActive : styles.controlButtonInactive) }}
              onClick={() => setIsMicOn(v => !v)} title={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              style={{ ...styles.controlButton, ...(isVideoOn ? styles.controlButtonActive : styles.controlButtonInactive) }}
              onClick={() => setIsVideoOn(v => !v)} title={isVideoOn ? 'Camera off' : 'Camera on'}
            >
              {isVideoOn ? <Video size={20} /> : <CameraOff size={20} />}
            </button>

            {/* CC button — blue when active, grey when off */}
            <button
              style={{
                ...styles.controlButton,
                backgroundColor: isListening ? '#0ea5e9' : '#334155',
                fontSize: '11px', fontWeight: '800', letterSpacing: '0.04em',
                boxShadow: isListening ? '0 0 0 3px rgba(14,165,233,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onClick={toggleTranscription}
              title={isListening ? 'Stop transcription' : 'Start transcription'}
            >
              CC
            </button>

            <button
              style={{ ...styles.controlButton, ...styles.hangupButton }}
              onClick={hangup} title="Leave call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}