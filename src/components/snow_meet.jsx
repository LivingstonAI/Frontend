import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, CameraOff, Mic, MicOff, PhoneOff, Copy,
  Video, Users, Link as LinkIcon, AlertCircle, CheckCircle,
  FileText, ChevronDown, ChevronUp, Download, Monitor, MonitorOff,
  Subtitles, Globe, X, Check
} from 'lucide-react';

/* ─────────────────────────────────────────────
   LANGUAGE LIST
───────────────────────────────────────────── */
const LANGUAGES = [
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { code: 'af-ZA', label: 'Afrikaans', flag: '🇿🇦' },
  { code: 'ar-SA', label: 'Arabic', flag: '🇸🇦' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'nl-NL', label: 'Dutch', flag: '🇳🇱' },
  { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
  { code: 'de-DE', label: 'German', flag: '🇩🇪' },
  { code: 'el-GR', label: 'Greek', flag: '🇬🇷' },
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
  { code: 'id-ID', label: 'Indonesian', flag: '🇮🇩' },
  { code: 'it-IT', label: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', label: 'Korean', flag: '🇰🇷' },
  { code: 'ms-MY', label: 'Malay', flag: '🇲🇾' },
  { code: 'pl-PL', label: 'Polish', flag: '🇵🇱' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ru-RU', label: 'Russian', flag: '🇷🇺' },
  { code: 'es-ES', label: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', label: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'sv-SE', label: 'Swedish', flag: '🇸🇪' },
  { code: 'th-TH', label: 'Thai', flag: '🇹🇭' },
  { code: 'tr-TR', label: 'Turkish', flag: '🇹🇷' },
  { code: 'uk-UA', label: 'Ukrainian', flag: '🇺🇦' },
  { code: 'vi-VN', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'zu-ZA', label: 'Zulu', flag: '🇿🇦' },
];

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const S = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    backgroundColor: '#f0f8ff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#0f1c2e',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #daeeff',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.4px',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748b',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '999px',
    padding: '4px 12px',
  },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  homeMain: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '32px 16px 60px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '36px 28px',
    width: '100%',
    maxWidth: '440px',
    border: '1px solid #bae6fd',
    boxShadow: '0 12px 36px rgba(14,165,233,0.09)',
  },
  cardTitle: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '8px',
    marginTop: 0,
    letterSpacing: '-0.5px',
  },
  cardSub: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '28px',
    lineHeight: 1.6,
  },
  btnPrimary: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 20px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
    minHeight: '52px',
    boxShadow: '0 4px 14px rgba(2,132,199,0.28)',
    transition: 'opacity .15s, transform .1s',
  },
  btnSecondary: {
    backgroundColor: '#f0f9ff',
    color: '#0284c7',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '15px 20px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '52px',
    transition: 'opacity .15s, transform .1s',
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#0f172a',
    background: '#ffffff',
    transition: 'border-color .15s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#94a3b8',
    fontSize: '13px',
    margin: '16px 0',
  },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#e2e8f0' },
  peerBox: {
    marginTop: '20px',
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  peerLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  peerValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0284c7',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '8px',
    flexShrink: 0,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '12px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },

  /* ── In-call ── */
  callScreen: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#0b1120',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200,
  },
  callTopbar: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(8px)',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  peerShareBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '7px 12px',
    flex: 1,
    minWidth: 0,
  },
  peerShareText: {
    fontSize: '12px',
    color: '#cbd5e1',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    minWidth: 0,
  },
  participantsBadge: {
    background: 'rgba(2,132,199,0.25)',
    color: '#38bdf8',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    border: '1px solid rgba(56,189,248,0.3)',
  },
  videoGrid: {
    flex: 1,
    display: 'grid',
    gap: '4px',
    padding: '4px',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#0b1120',
    position: 'relative',
  },
  videoTile: {
    position: 'relative',
    background: '#1e293b',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoEl: { width: '100%', height: '100%', objectFit: 'cover' },
  localVideoEl: { width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' },
  tileLabel: {
    position: 'absolute',
    bottom: '8px',
    left: '10px',
    background: 'rgba(0,0,0,0.55)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 9px',
    borderRadius: '999px',
  },
  waitingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    gap: '14px',
    background: 'rgba(11,17,32,0.85)',
    fontSize: '16px',
    textAlign: 'center',
    padding: '20px',
    zIndex: 5,
    borderRadius: '10px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid rgba(255,255,255,0.12)',
    borderTopColor: '#38bdf8',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  controlBar: {
    backgroundColor: 'rgba(0,0,0,0.82)',
    backdropFilter: 'blur(8px)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  ctrlBtn: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ffffff',
    transition: 'transform .12s',
    fontSize: '0',
  },
  ctrlOn: { backgroundColor: '#1e3a5f' },
  ctrlOff: { backgroundColor: '#dc2626' },
  ctrlActive: { backgroundColor: '#0284c7' },
  ctrlShare: { backgroundColor: '#059669' },
  ctrlShareOff: { backgroundColor: '#1e3a5f' },
  ctrlHangup: {
    backgroundColor: '#dc2626',
    width: '64px',
    borderRadius: '999px',
  },

  /* Transcript */
  transcriptPanel: {
    position: 'absolute',
    bottom: '90px',
    left: '12px',
    width: 'min(320px, calc(100vw - 24px))',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: '14px',
    border: '1px solid #bae6fd',
    zIndex: 50,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
  },
  transcriptHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: '#f0f9ff',
    borderBottom: '1px solid #bae6fd',
    cursor: 'pointer',
    userSelect: 'none',
  },
  transcriptTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#0284c7',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    animation: 'pulse 1.3s infinite',
  },
  pausedDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
  },
  transcriptBody: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  transcriptLine: {
    fontSize: '13px',
    color: '#1e293b',
    background: '#f8fafc',
    borderRadius: '6px',
    padding: '7px 10px',
    borderLeft: '3px solid #0284c7',
    lineHeight: 1.5,
  },
  transcriptTime: {
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: 600,
    marginRight: '5px',
  },
  transcriptInterim: {
    fontSize: '13px',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '2px 10px',
  },
  transcriptEmpty: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '16px 0',
    fontStyle: 'italic',
  },
  transcriptPaused: {
    fontSize: '13px',
    color: '#b45309',
    textAlign: 'center',
    padding: '16px 0',
    fontStyle: 'italic',
    background: '#fffbeb',
    borderRadius: '6px',
    margin: '4px 0',
  },

  /* ── Language Modal ── */
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  modalHeader: {
    padding: '18px 20px 14px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '6px',
  },
  langGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px',
    padding: '16px',
    overflowY: 'auto',
  },
  langItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0f172a',
    background: '#ffffff',
    transition: 'all .12s',
    userSelect: 'none',
  },
  langItemActive: {
    background: '#eff6ff',
    border: '1px solid #93c5fd',
    color: '#1d4ed8',
  },
  langFlag: { fontSize: '18px', lineHeight: 1, flexShrink: 0 },
  langCheck: { marginLeft: 'auto', flexShrink: 0 },
  modalFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  modalConfirm: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 22px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  /* camera-off avatar */
  camOffAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
  },
};

/* ─────────────────────────────────────────────
   GRID LAYOUT HELPER
───────────────────────────────────────────── */
function gridStyle(count) {
  const narrow = typeof window !== 'undefined' && window.innerWidth <= 500;
  if (count === 1) return { gridTemplateColumns: '1fr' };
  if (count === 2) return narrow
    ? { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr' }
    : { gridTemplateColumns: '1fr 1fr' };
  if (count === 3) return narrow
    ? { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr 1fr' }
    : { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SnowMeet() {
  const [peerReady, setPeerReady] = useState(false);
  const [myPeerId, setMyPeerId] = useState('');
  const [appState, setAppState] = useState('home');
  const [joinId, setJoinId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Media controls — these now only affect what YOU send/see locally
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Remote peers
  const [remotePeers, setRemotePeers] = useState(new Map());

  // Transcript
  const [transcriptOpen, setTranscriptOpen] = useState(true);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ccEnabled, setCcEnabled] = useState(true);       // host toggle for recording
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [showLangModal, setShowLangModal] = useState(false);
  const [pendingLang, setPendingLang] = useState('en-US'); // lang selection in modal before confirming

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const callsRef = useRef(new Map());
  const recognitionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const transcriptEndRef = useRef(null);
  const MAX_PEERS = 3;

  /* ── Keyframe injection ── */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /* ── Boot PeerJS ── */
  useEffect(() => {
    if (typeof window.Peer === 'undefined') {
      setErrorMsg('PeerJS library not loaded. Add: <script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js">');
      return;
    }
    const peer = new window.Peer(undefined, {
      host: '0.peerjs.com', port: 443, path: '/', secure: true,
    });
    peerRef.current = peer;
    peer.on('open', id => { setMyPeerId(id); setPeerReady(true); });
    peer.on('call', async incomingCall => {
      if (!localStreamRef.current) await initLocalMedia();
      if (!localStreamRef.current) return;
      incomingCall.answer(localStreamRef.current);
      wireCall(incomingCall);
      setAppState('incall');
    });
    peer.on('error', err => setErrorMsg('Connection error: ' + err.message));
    return () => peer.destroy();
  }, []);

  /* ── Sync local video ── */
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  });

  /* ── Sync remote video refs ── */
  useEffect(() => {
    remotePeers.forEach((stream, pid) => {
      const el = remoteVideoRefs.current[pid];
      if (el && el.srcObject !== stream) el.srcObject = stream;
    });
  });

  /*
   * ── Mic toggle ──
   * We disable the local audio track so YOU don't transmit audio.
   * The remote stream is untouched — peers' audio is always played back
   * via their own <video> element regardless of your mic state.
   */
  useEffect(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
  }, [isMicOn]);

  /*
   * ── Cam toggle ──
   * Disabling the video track sends a black frame to peers (stream stays alive).
   * This way the peer connection is NOT closed — audio still flows both ways.
   */
  useEffect(() => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = isCamOn; });
  }, [isCamOn]);

  /* ── Transcript scroll ── */
  useEffect(() => {
    if (transcriptOpen) transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLines, interimText, transcriptOpen]);

  /* ── Start/stop transcription when in-call state or ccEnabled changes ── */
  useEffect(() => {
    if (appState === 'incall' && ccEnabled) {
      startTranscription(selectedLang);
    } else {
      stopTranscription();
    }
    return () => stopTranscription();
  }, [appState, ccEnabled]);

  /* ── Restart transcription when language changes (only if active) ── */
  useEffect(() => {
    if (appState === 'incall' && ccEnabled) {
      stopTranscription();
      setTimeout(() => startTranscription(selectedLang), 100);
    }
  }, [selectedLang]);

  /* ─────────── HELPERS ─────────── */

  const initLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch {
      setErrorMsg('Could not access camera or microphone. Please allow permissions.');
      return null;
    }
  };

  const wireCall = useCallback((call) => {
    const pid = call.peer;
    if (callsRef.current.has(pid)) return;
    callsRef.current.set(pid, call);
    call.on('stream', remoteStream => {
      setRemotePeers(prev => new Map(prev).set(pid, remoteStream));
    });
    call.on('close', () => dropPeer(pid));
    call.on('error', () => dropPeer(pid));
  }, []);

  const dropPeer = (pid) => {
    callsRef.current.get(pid)?.close();
    callsRef.current.delete(pid);
    setRemotePeers(prev => { const next = new Map(prev); next.delete(pid); return next; });
  };

  /* ─────────── ACTIONS ─────────── */

  const startMeeting = async () => {
    setErrorMsg('');
    const stream = await initLocalMedia();
    if (!stream) return;
    setAppState('incall');
  };

  const joinMeeting = async () => {
    setErrorMsg('');
    const targetId = joinId.trim().replace(/.*[?&]call=/, '');
    if (!targetId) { setErrorMsg('Please enter a Peer ID.'); return; }
    if (!peerReady) { setErrorMsg('Still connecting to server, please wait.'); return; }
    if (callsRef.current.size >= MAX_PEERS) { setErrorMsg('Room full (max 4 participants).'); return; }
    let stream = localStreamRef.current;
    if (!stream) { stream = await initLocalMedia(); if (!stream) return; }
    setAppState('incall');
    const outgoing = peerRef.current.call(targetId, stream);
    if (!outgoing) { setErrorMsg('Could not reach that Peer ID.'); setAppState('home'); return; }
    wireCall(outgoing);
  };

  const hangup = () => {
    stopTranscription();
    stopScreenShare();
    callsRef.current.forEach(c => { try { c.close(); } catch (_) {} });
    callsRef.current.clear();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    setRemotePeers(new Map());
    setIsMicOn(true); setIsCamOn(true); setIsSharingScreen(false);
    setJoinId(''); setTranscriptLines([]); setInterimText('');
    setAppState('home');
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) { stopScreenShare(); return; }
    try {
      const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      screenStreamRef.current = sStream;
      const screenTrack = sStream.getVideoTracks()[0];
      callsRef.current.forEach(call => {
        const sender = call.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream([
          ...localStreamRef.current.getAudioTracks(), screenTrack
        ]);
      }
      screenTrack.onended = () => stopScreenShare();
      setIsSharingScreen(true);
    } catch (err) {
      if (err.name !== 'NotAllowedError') setErrorMsg('Screen share failed: ' + err.message);
    }
  };

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack) {
      callsRef.current.forEach(call => {
        const sender = call.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(camTrack);
      });
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
  };

  const copyPeerId = () => {
    const fallback = (t) => {
      const ta = document.createElement('textarea');
      ta.value = t; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(myPeerId).catch(() => fallback(myPeerId));
    else fallback(myPeerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ─────────── TRANSCRIPT ─────────── */

  const startTranscription = (lang = selectedLang) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;
    recognitionRef.current = r;

    r.onstart = () => setIsListening(true);
    r.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript.trim();
        if (e.results[i].isFinal) {
          if (text) setTranscriptLines(prev => [...prev, {
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setInterimText('');
        } else { interim += text; }
      }
      if (interim) setInterimText(interim);
    };
    r.onerror = e => { if (e.error !== 'no-speech') console.warn('SR error:', e.error); };
    r.onend = () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_) {}
      }
    };
    try { r.start(); } catch (_) {}
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

  const downloadTranscript = () => {
    if (!transcriptLines.length) return;
    const langLabel = LANGUAGES.find(l => l.code === selectedLang)?.label || selectedLang;
    const header = `SnowMeet Transcript\nLanguage: ${langLabel}\nDate: ${new Date().toLocaleDateString()}\n${'─'.repeat(40)}\n\n`;
    const text = header + transcriptLines.map(l => `[${l.time}] ${l.text}`).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `snowmeet-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Language modal handlers ── */
  const openLangModal = () => {
    setPendingLang(selectedLang);
    setShowLangModal(true);
  };

  const confirmLang = () => {
    setSelectedLang(pendingLang);
    setShowLangModal(false);
  };

  /* ─────────── COMPUTED ─────────── */

  const totalParticipants = 1 + remotePeers.size;
  const hasRemotes = remotePeers.size > 0;
  const gStyle = { ...S.videoGrid, ...gridStyle(totalParticipants) };
  const remotePeersArr = [...remotePeers.entries()];
  const currentLangLabel = LANGUAGES.find(l => l.code === selectedLang)?.label || selectedLang;
  const currentLangFlag = LANGUAGES.find(l => l.code === selectedLang)?.flag || '🌐';

  /* ─────────── RENDER ─────────── */

  return (
    <div style={S.app}>

      {/* ══════════ HOME ══════════ */}
      {appState === 'home' && (
        <>
          <header style={S.header}>
            <div style={S.logo}>
              <Video size={22} color="#0284c7" />
              SnowMeet
            </div>
            <div style={S.statusPill}>
              <span style={{ ...S.statusDot, backgroundColor: peerReady ? '#10b981' : '#f59e0b' }} />
              {peerReady ? 'Ready' : 'Connecting…'}
            </div>
          </header>

          <main style={S.homeMain}>
            <div style={S.card}>
              <h1 style={S.cardTitle}>Premium Video Meetings</h1>
              <p style={S.cardSub}>No sign-up needed. Start a room and share your Peer ID — up to 4 people.</p>

              {errorMsg && (
                <div style={S.errorBox}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                style={{ ...S.btnPrimary, ...(!peerReady ? S.btnDisabled : {}) }}
                onClick={startMeeting}
                disabled={!peerReady}
              >
                <Video size={18} /> New Meeting
              </button>

              <div style={S.divider}>
                <div style={S.dividerLine} />
                or join with a Peer ID
                <div style={S.dividerLine} />
              </div>

              <input
                style={S.input}
                placeholder="Paste Peer ID here"
                value={joinId}
                onChange={e => { setJoinId(e.target.value); setErrorMsg(''); }}
                onKeyDown={e => e.key === 'Enter' && joinMeeting()}
              />
              <button
                style={{ ...S.btnSecondary, ...(!joinId || !peerReady ? S.btnDisabled : {}) }}
                onClick={joinMeeting}
                disabled={!joinId || !peerReady}
              >
                <Users size={18} /> Join Meeting
              </button>

              {myPeerId && (
                <div style={S.peerBox}>
                  <div style={{ minWidth: 0 }}>
                    <div style={S.peerLabel}>Your Peer ID — share to receive calls</div>
                    <div style={S.peerValue}>{myPeerId}</div>
                  </div>
                  <button style={S.iconBtn} onClick={copyPeerId} title="Copy Peer ID">
                    {copied ? <CheckCircle size={20} color="#10b981" /> : <Copy size={20} />}
                  </button>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ══════════ IN-CALL ══════════ */}
      {appState === 'incall' && (
        <div style={S.callScreen}>

          {/* Top bar */}
          <div style={S.callTopbar}>
            <div style={S.peerShareBox}>
              <LinkIcon size={14} color="#64748b" style={{ flexShrink: 0 }} />
              <span style={S.peerShareText}>{myPeerId}</span>
              <button style={{ ...S.iconBtn, color: '#64748b', padding: '4px' }} onClick={copyPeerId}>
                {copied ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={S.participantsBadge}>{totalParticipants} of max 4</div>
          </div>

          {/* Video grid */}
          <div style={gStyle}>

            {/* Local tile */}
            <div style={S.videoTile}>
              {isCamOn ? (
                <video ref={localVideoRef} style={S.localVideoEl} autoPlay playsInline muted />
              ) : (
                <>
                  {/* Keep the video element mounted (muted, hidden) so the stream stays wired */}
                  <video ref={localVideoRef} style={{ display: 'none' }} autoPlay playsInline muted />
                  <div style={S.camOffAvatar}>
                    <CameraOff size={28} />
                  </div>
                </>
              )}
              <div style={S.tileLabel}>You{isSharingScreen ? ' (screen)' : ''}{!isCamOn ? ' (cam off)' : ''}</div>
            </div>

            {/* Remote tiles */}
            {remotePeersArr.map(([pid], idx) => (
              <div key={pid} style={S.videoTile}>
                <video
                  ref={el => { if (el) remoteVideoRefs.current[pid] = el; }}
                  style={S.videoEl}
                  autoPlay
                  playsInline
                  // NOTE: no muted — we WANT to hear remote peers regardless of their cam/mic state
                />
                <div style={S.tileLabel}>Peer {idx + 1}</div>
              </div>
            ))}

            {!hasRemotes && (
              <div style={S.waitingOverlay}>
                <div style={S.spinner} />
                <div>Waiting for others to join…</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Share your Peer ID above</div>
              </div>
            )}
          </div>

          {/* Transcript panel — only show if CC is enabled */}
          {ccEnabled && (
            <div style={S.transcriptPanel}>
              <div style={S.transcriptHeader} onClick={() => setTranscriptOpen(v => !v)}>
                <div style={S.transcriptTitle}>
                  <FileText size={14} color="#0284c7" />
                  Live Transcript
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 400, fontStyle: 'italic' }}>
                    {currentLangFlag} {currentLangLabel.split(' ')[0]}
                  </span>
                  {isListening
                    ? <span style={S.liveDot} />
                    : <span style={S.pausedDot} />
                  }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {transcriptLines.length > 0 && (
                    <button
                      style={{ ...S.iconBtn, color: '#64748b', padding: '2px' }}
                      onClick={e => { e.stopPropagation(); downloadTranscript(); }}
                      title="Download transcript"
                    >
                      <Download size={14} />
                    </button>
                  )}
                  {transcriptOpen ? <ChevronDown size={16} color="#0284c7" /> : <ChevronUp size={16} color="#0284c7" />}
                </div>
              </div>

              {transcriptOpen && (
                <div style={S.transcriptBody}>
                  {transcriptLines.length === 0 && !interimText && (
                    <div style={S.transcriptEmpty}>
                      {isListening ? 'Listening… start speaking.' : 'Speech recognition not available.'}
                    </div>
                  )}
                  {transcriptLines.map((line, i) => (
                    <div key={i} style={S.transcriptLine}>
                      <span style={S.transcriptTime}>{line.time}</span>
                      {line.text}
                    </div>
                  ))}
                  {interimText && <div style={S.transcriptInterim}>…{interimText}</div>}
                  <div ref={transcriptEndRef} />
                </div>
              )}
            </div>
          )}

          {/* Control bar */}
          <div style={S.controlBar}>
            {/* Mic */}
            <button
              style={{ ...S.ctrlBtn, ...(isMicOn ? S.ctrlOn : S.ctrlOff) }}
              onClick={() => setIsMicOn(v => !v)}
              title={isMicOn ? 'Mute mic' : 'Unmute mic'}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            {/* Cam */}
            <button
              style={{ ...S.ctrlBtn, ...(isCamOn ? S.ctrlOn : S.ctrlOff) }}
              onClick={() => setIsCamOn(v => !v)}
              title={isCamOn ? 'Stop camera' : 'Start camera'}
            >
              {isCamOn ? <Camera size={22} /> : <CameraOff size={22} />}
            </button>

            {/* Screen share */}
            <button
              style={{ ...S.ctrlBtn, ...(isSharingScreen ? S.ctrlShare : S.ctrlShareOff) }}
              onClick={toggleScreenShare}
              title={isSharingScreen ? 'Stop sharing' : 'Share screen'}
            >
              {isSharingScreen ? <MonitorOff size={22} /> : <Monitor size={22} />}
            </button>

            {/* CC toggle */}
            <button
              style={{ ...S.ctrlBtn, ...(ccEnabled ? S.ctrlActive : S.ctrlOff) }}
              onClick={() => setCcEnabled(v => !v)}
              title={ccEnabled ? 'Disable captions' : 'Enable captions'}
            >
              <Subtitles size={22} />
            </button>

            {/* Language picker */}
            <button
              style={{
                ...S.ctrlBtn,
                width: 'auto',
                padding: '0 14px',
                borderRadius: '999px',
                ...S.ctrlOn,
                fontSize: '18px',
                gap: '6px',
              }}
              onClick={openLangModal}
              title="Pick transcript language"
            >
              <span style={{ fontSize: '18px' }}>{currentLangFlag}</span>
            </button>

            {/* Hang up */}
            <button
              style={{ ...S.ctrlBtn, ...S.ctrlHangup }}
              onClick={hangup}
              title="Leave call"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════ LANGUAGE MODAL ══════════ */}
      {showLangModal && (
        <div style={S.modalBackdrop} onClick={() => setShowLangModal(false)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>
                <Globe size={18} color="#0284c7" />
                Transcript language
              </h2>
              <button style={S.modalClose} onClick={() => setShowLangModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={S.langGrid}>
              {LANGUAGES.map(lang => {
                const active = pendingLang === lang.code;
                return (
                  <div
                    key={lang.code}
                    style={{ ...S.langItem, ...(active ? S.langItemActive : {}) }}
                    onClick={() => setPendingLang(lang.code)}
                  >
                    <span style={S.langFlag}>{lang.flag}</span>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lang.label}
                    </span>
                    {active && (
                      <span style={S.langCheck}>
                        <Check size={15} color="#1d4ed8" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={S.modalFooter}>
              <button style={S.modalConfirm} onClick={confirmLang}>
                Use {LANGUAGES.find(l => l.code === pendingLang)?.flag} {LANGUAGES.find(l => l.code === pendingLang)?.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}