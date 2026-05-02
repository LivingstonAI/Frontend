import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Copy, Video, Users, Link as LinkIcon, AlertCircle, CheckCircle, FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';

// ─── PeerJS loaded from CDN ───────────────────────────────────────────────────
// Add to your index.html:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.2/peerjs.min.js"></script>
// ─────────────────────────────────────────────────────────────────────────────

// --- Styles (Original Light Blue & White Theme — unchanged) ---
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
    color: '#0ea5e9',
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
  buttonPrimaryDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
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
    fontFamily: "'Inter', sans-serif",
  },
  // ── Peer ID display box (new, matches card aesthetic) ──
  peerIdBox: {
    marginTop: '24px',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    textAlign: 'left',
  },
  peerIdLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
    fontWeight: '500',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  peerIdValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0ea5e9',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.05em',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    transform: 'scaleX(-1)'
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
    backgroundColor: '#334155',
  },
  controlButtonInactive: {
    backgroundColor: '#ef4444',
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
    maxWidth: '380px'
  },
  linkText: {
    fontSize: '13px',
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '220px',
    fontFamily: "'Courier New', monospace",
    fontWeight: '600',
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
  },
  // ── Transcript panel ────────────────────────────────────────────────────────
  transcriptPanel: {
    position: 'absolute',
    bottom: '100px',
    left: '32px',
    width: '340px',
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
    padding: '12px 16px',
    backgroundColor: '#f0f9ff',
    borderBottom: '1px solid #bae6fd',
    cursor: 'pointer',
    userSelect: 'none',
  },
  transcriptHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0ea5e9',
    letterSpacing: '0.02em',
  },
  transcriptHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  transcriptBody: {
    maxHeight: '220px',
    overflowY: 'auto',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  transcriptLine: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '8px 12px',
    borderLeft: '3px solid #0ea5e9',
  },
  transcriptInterim: {
    fontSize: '13px',
    lineHeight: '1.55',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '4px 12px',
  },
  transcriptEmpty: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '16px 0',
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
  const [transcriptOpen, setTranscriptOpen]   = useState(true);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [interimText, setInterimText]         = useState('');
  const [isListening, setIsListening]         = useState(false);

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

  // ── Start / stop speech recognition when entering/leaving call ────────────
  useEffect(() => {
    if (appState === 'incall') {
      startTranscription();
    } else {
      stopTranscription();
    }
    return () => stopTranscription();
  }, [appState]);

  const startTranscription = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          if (transcript) {
            setTranscriptLines(prev => [...prev, { text: transcript, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setInterimText('');
          }
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (e) => {
      // 'no-speech' is normal — just restart
      if (e.error !== 'no-speech') console.error('Speech recognition error:', e.error);
    };

    recognition.onend = () => {
      // Auto-restart as long as we're still in a call
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_) {}
      }
    };

    try { recognition.start(); } catch (_) {}
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent auto-restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
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
  return (
    <div style={styles.appContainer}>

      {/* ════════════════ HOME SCREEN ════════════════ */}
      {appState !== 'incall' && (
        <>
          <header style={styles.header}>
            <div style={styles.logo}>
              <Video color="#0ea5e9" size={28} />
              SnowMeet
            </div>
            <div style={{ fontSize: '14px', color: peerReady ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: peerReady ? '#10b981' : '#f59e0b' }} />
              {peerReady ? 'System Ready' : 'Connecting…'}
            </div>
          </header>

          <main style={styles.mainContent}>
            <div style={styles.card}>
              <h1 style={styles.title}>Premium Video Meetings</h1>
              <p style={styles.subtitle}>
                Connect seamlessly with your team using SnowMeet.
                <br />Professional, secure, and free — no sign-up needed.
              </p>

              {errorMsg && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} />
                  {errorMsg}
                </div>
              )}

              {/* ── New Meeting ── */}
              <button
                style={{
                  ...styles.buttonPrimary,
                  ...(!peerReady || appState === 'creating' ? styles.buttonPrimaryDisabled : {})
                }}
                onClick={startCall}
                disabled={!peerReady || appState === 'creating'}
              >
                <Video size={20} />
                {appState === 'creating' ? 'Starting…' : 'New Meeting'}
              </button>

              <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '14px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                or join with a Peer ID
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              {/* ── Join Meeting ── */}
              <input
                style={styles.input}
                placeholder="Paste Peer ID here"
                value={joinId}
                onChange={e => { setJoinId(e.target.value); setErrorMsg(''); }}
                onKeyDown={e => e.key === 'Enter' && joinCall()}
              />
              <button
                style={{
                  ...styles.buttonSecondary,
                  ...(!joinId || !peerReady || appState === 'joining' ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                }}
                onClick={joinCall}
                disabled={!joinId || !peerReady || appState === 'joining'}
              >
                <Users size={20} />
                {appState === 'joining' ? 'Joining…' : 'Join Meeting'}
              </button>

              {/* ── Your Peer ID ── */}
              {myPeerId && (
                <div style={styles.peerIdBox}>
                  <div>
                    <div style={styles.peerIdLabel}>Your Peer ID — share to receive calls</div>
                    <div style={styles.peerIdValue}>{myPeerId}</div>
                  </div>
                  <button style={styles.iconBtn} onClick={copyPeerId} title="Copy Peer ID">
                    {copied
                      ? <CheckCircle size={20} color="#10b981" />
                      : <Copy size={20} />
                    }
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
              <div style={{
                width: '40px', height: '40px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: '#0ea5e9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Waiting for the other person to join…
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            style={{ ...styles.remoteVideo, display: remoteConnected ? 'block' : 'none' }}
            autoPlay
            playsInline
          />

          {/* Share box — shows host's Peer ID */}
          <div style={styles.shareBox}>
            <LinkIcon size={18} color="#64748b" />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                Your Peer ID
              </span>
              <span style={styles.linkText}>{myPeerId}</span>
            </div>
            <button style={styles.iconBtn} onClick={copyPeerId} title="Copy Peer ID">
              {copied
                ? <CheckCircle size={18} color="#10b981" />
                : <Copy size={18} />
              }
            </button>
          </div>

          {/* Local PiP */}
          <div style={styles.localVideoContainer}>
            <video
              ref={localVideoRef}
              style={styles.localVideo}
              autoPlay
              playsInline
              muted
            />
          </div>

          {/* ── Transcript Panel ── */}
          <div style={styles.transcriptPanel}>
            {/* Header — always visible, click to expand/collapse */}
            <div style={styles.transcriptHeader} onClick={() => setTranscriptOpen(v => !v)}>
              <div style={styles.transcriptHeaderLeft}>
                <FileText size={15} color="#0ea5e9" />
                Live Transcript
                {isListening && (
                  <span style={styles.liveIndicator}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                      animation: 'pulse 1.4s infinite'
                    }} />
                    Live
                    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
                  </span>
                )}
              </div>
              <div style={styles.transcriptHeaderRight}>
                {transcriptLines.length > 0 && (
                  <button
                    style={styles.transcriptDownloadBtn}
                    onClick={e => { e.stopPropagation(); downloadTranscript(); }}
                    title="Download transcript"
                  >
                    <Download size={14} />
                  </button>
                )}
                <button style={styles.transcriptToggleBtn} title={transcriptOpen ? 'Collapse' : 'Expand'}>
                  {transcriptOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              </div>
            </div>

            {/* Body — collapsible */}
            {transcriptOpen && (
              <div style={styles.transcriptBody}>
                {transcriptLines.length === 0 && !interimText && (
                  <div style={styles.transcriptEmpty}>
                    {isListening ? 'Listening… start speaking.' : 'Speech recognition not available.'}
                  </div>
                )}
                {transcriptLines.map((line, i) => (
                  <div key={i} style={styles.transcriptLine}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginRight: '6px', fontWeight: '600' }}>
                      {line.time}
                    </span>
                    {line.text}
                  </div>
                ))}
                {interimText && (
                  <div style={styles.transcriptInterim}>…{interimText}</div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>

          {/* Control bar */}
          <div style={styles.controlBar}>
            <button
              style={{ ...styles.controlButton, ...(isMicOn ? styles.controlButtonActive : styles.controlButtonInactive) }}
              onClick={() => setIsMicOn(v => !v)}
              title={isMicOn ? 'Mute mic' : 'Unmute mic'}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            <button
              style={{ ...styles.controlButton, ...(isVideoOn ? styles.controlButtonActive : styles.controlButtonInactive) }}
              onClick={() => setIsVideoOn(v => !v)}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video size={22} /> : <CameraOff size={22} />}
            </button>

            <button
              style={{ ...styles.controlButton, ...styles.hangupButton }}
              onClick={hangup}
              title="Leave call"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}