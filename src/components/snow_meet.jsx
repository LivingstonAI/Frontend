import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, CameraOff, Mic, MicOff, PhoneOff, Copy,
  Video, Users, Link as LinkIcon, AlertCircle, CheckCircle,
  FileText, ChevronDown, ChevronUp, Download, Monitor, MonitorOff,
  Subtitles, Globe, X, Check, MessageSquare, Send, Smile
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

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '👏', '🔥', '🎉', '😢'];

/* ─────────────────────────────────────────────
   ICE SERVERS
───────────────────────────────────────────── */
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.stunprotocol.org:3478' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
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
   STYLES (Enhanced mobile + background overlays)
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

  /* Main call body */
  callBody: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
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
    // Background gradient overlay for virtual background effect
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(2,132,199,0.15), rgba(0,0,0,0.6))',
      pointerEvents: 'none',
      zIndex: 1,
    }
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
    zIndex: 2,
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
  ctrlHighlight: { backgroundColor: '#7c3aed' },

  /* ── Transcript panel (bottom-left overlay on video) ── */
  transcriptPanel: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    width: 'min(300px, calc(50vw - 16px))',
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: '12px',
    border: '1px solid rgba(56,189,248,0.25)',
    zIndex: 50,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  transcriptHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: 'rgba(2,132,199,0.15)',
    borderBottom: '1px solid rgba(56,189,248,0.2)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  transcriptTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#38bdf8',
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
    maxHeight: '180px',
    overflowY: 'auto',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  transcriptLine: {
    fontSize: '12px',
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '6px',
    padding: '6px 9px',
    borderLeft: '2px solid #38bdf8',
    lineHeight: 1.5,
  },
  transcriptTime: {
    fontSize: '10px',
    color: '#64748b',
    fontWeight: 600,
    marginRight: '5px',
  },
  transcriptInterim: {
    fontSize: '12px',
    color: '#94a3b8',
    fontStyle: 'italic',
    padding: '2px 9px',
  },
  transcriptEmpty: {
    fontSize: '12px',
    color: '#64748b',
    textAlign: 'center',
    padding: '14px 0',
    fontStyle: 'italic',
  },

  /* ── Chat panel (fullscreen on mobile, overlay on right on desktop) ── */
  chatPanel: {
    width: '280px',
    backgroundColor: 'rgba(11,17,32,0.97)',
    borderLeft: '1px solid rgba(56,189,248,0.15)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      top: 'auto',
      width: '100%',
      height: '70vh',
      borderLeft: 'none',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      zIndex: 300,
      backgroundColor: 'rgba(15,23,42,0.98)',
      backdropFilter: 'blur(20px)',
    }
  },
  chatHeader: {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(56,189,248,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#38bdf8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  chatMsg: {
    fontSize: '13px',
    color: '#e2e8f0',
    lineHeight: 1.5,
  },
  chatMsgMine: {
    alignSelf: 'flex-end',
    background: 'rgba(2,132,199,0.25)',
    border: '1px solid rgba(56,189,248,0.3)',
    borderRadius: '10px 10px 2px 10px',
    padding: '7px 11px',
    maxWidth: '85%',
    fontSize: '13px',
    color: '#e2e8f0',
  },
  chatMsgTheirs: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px 10px 10px 2px',
    padding: '7px 11px',
    maxWidth: '85%',
    fontSize: '13px',
    color: '#e2e8f0',
  },
  chatMsgSender: {
    fontSize: '10px',
    color: '#64748b',
    marginBottom: '3px',
    fontWeight: 600,
  },
  chatMsgSystem: {
    fontSize: '11px',
    color: '#475569',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: '2px 0',
  },
  chatInputRow: {
    padding: '10px',
    borderTop: '1px solid rgba(56,189,248,0.15)',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(56,189,248,0.2)',
    borderRadius: '10px',
    padding: '9px 12px',
    fontSize: '13px',
    color: '#e2e8f0',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.4,
    maxHeight: '80px',
  },
  chatSendBtn: {
    background: '#0284c7',
    border: 'none',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    flexShrink: 0,
  },

  /* ── Emoji reaction picker ── */
  emojiPickerOverlay: {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(15,23,42,0.96)',
    border: '1px solid rgba(56,189,248,0.25)',
    borderRadius: '14px',
    padding: '10px 12px',
    display: 'flex',
    gap: '6px',
    zIndex: 100,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  emojiBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '22px',
    padding: '4px 6px',
    borderRadius: '8px',
    transition: 'transform .12s',
    lineHeight: 1,
  },

  /* ── Floating emoji reaction (4 second animation) ── */
  floatingEmoji: {
    position: 'absolute',
    bottom: '100px',
    fontSize: '36px',
    pointerEvents: 'none',
    zIndex: 200,
    animation: 'floatUp 4s ease-out forwards',
    userSelect: 'none',
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
    backgroundColor: 'rgb(2, 132, 199)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 22px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  camOffAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    zIndex: 2,
  },
};

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

  // Media controls
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
  const [ccEnabled, setCcEnabled] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [showLangModal, setShowLangModal] = useState(false);
  const [pendingLang, setPendingLang] = useState('en-US');

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Refs
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const callsRef = useRef(new Map());
  const dataChannelsRef = useRef(new Map());
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const transcriptEndRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const MAX_PEERS = 3;

  const myShortId = myPeerId ? myPeerId.slice(0, 6) : 'Me';

  /* ── Keyframe injection ── */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      @keyframes floatUp {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        70%  { opacity: 0.8; transform: translateY(-120px) scale(1.2); }
        100% { opacity: 0; transform: translateY(-180px) scale(0.8); }
      }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
      
      /* Mobile responsive overrides for chat */
      @media (max-width: 768px) {
        .chat-panel-mobile {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          top: auto !important;
          width: 100% !important;
          height: 70vh !important;
          border-left: none !important;
          border-top-left-radius: 20px !important;
          border-top-right-radius: 20px !important;
          z-index: 300 !important;
          background-color: rgba(15, 23, 42, 0.98) !important;
          backdrop-filter: blur(20px) !important;
        }
      }
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
      host: '0.peerjs.com',
      port: 443,
      path: '/',
      secure: true,
      config: ICE_SERVERS
    });

    peerRef.current = peer;

    peer.on('open', id => {
      setMyPeerId(id);
      setPeerReady(true);
      setErrorMsg('');
    });

    peer.on('call', async incomingCall => {
      if (!localStreamRef.current) await initLocalMedia();
      if (!localStreamRef.current) {
        setErrorMsg('Could not initialize camera/microphone');
        return;
      }
      // Ensure local audio track is enabled based on current mic state
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
      incomingCall.answer(localStreamRef.current);
      wireCall(incomingCall);
      setAppState('incall');
    });

    peer.on('connection', conn => {
      setupDataChannel(conn);
    });

    peer.on('error', err => {
      console.error('PeerJS error:', err);
      if (err.type === 'peer-unavailable') {
        setErrorMsg('The Peer ID you entered is not available.');
      } else if (err.type === 'network') {
        setErrorMsg('Network error. Check your internet connection.');
      } else {
        setErrorMsg('Connection error: ' + err.message);
      }
    });

    return () => {
      if (peer.destroy) peer.destroy();
    };
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

  /* ── Mic toggle ── */
  useEffect(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = isMicOn; });
  }, [isMicOn]);

  /* ── Cam toggle - ensures local video feed updates ── */
  useEffect(() => {
    const tracks = localStreamRef.current?.getVideoTracks();
    if (tracks) {
      tracks.forEach(t => { t.enabled = isCamOn; });
    }
    // Also update the local video element display
    if (localVideoRef.current && localStreamRef.current) {
      // Force a re-render of the local video element
      const currentStream = localVideoRef.current.srcObject;
      if (currentStream) {
        localVideoRef.current.srcObject = null;
        localVideoRef.current.srcObject = currentStream;
      }
    }
  }, [isCamOn]);

  /* ── Transcript scroll ── */
  useEffect(() => {
    if (transcriptOpen) transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLines, interimText, transcriptOpen]);

  /* ── Chat scroll ── */
  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  /* ── Chat unread badge ── */
  useEffect(() => {
    if (!chatOpen && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage && !lastMessage.mine && !lastMessage.system) {
        // Increment unread count for incoming messages when chat closed
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [chatMessages, chatOpen]);

  /*
   * TRANSCRIPT
   */
  useEffect(() => {
    if (appState === 'incall' && ccEnabled) {
      startTranscription(selectedLang);
    } else {
      stopTranscription();
    }
    return () => stopTranscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, ccEnabled]);

  const selectedLangRef = useRef(selectedLang);
  useEffect(() => {
    selectedLangRef.current = selectedLang;
    if (appState === 'incall' && ccEnabled && recognitionActiveRef.current) {
      try { recognitionRef.current?.stop(); } catch (_) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang]);

  /* ── Close emoji picker on outside click ── */
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = () => setShowEmojiPicker(false);
    setTimeout(() => window.addEventListener('click', handler), 0);
    return () => window.removeEventListener('click', handler);
  }, [showEmojiPicker]);

  /* ─────────── DATA CHANNEL HELPERS ─────────── */
  const setupDataChannel = useCallback((conn) => {
    conn.on('open', () => {
      dataChannelsRef.current.set(conn.peer, conn);
    });
    conn.on('data', data => {
      handleDataMessage(data, conn.peer);
    });
    conn.on('close', () => {
      dataChannelsRef.current.delete(conn.peer);
    });
    conn.on('error', err => {
      console.warn('Data channel error:', err);
      dataChannelsRef.current.delete(conn.peer);
    });
  }, []);

  const handleDataMessage = useCallback((data, fromPid) => {
    try {
      const msg = typeof data === 'string' ? JSON.parse(data) : data;
      if (msg.type === 'chat') {
        const chatEntry = {
          id: Date.now() + Math.random(),
          from: fromPid.slice(0, 6),
          text: msg.text,
          mine: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, chatEntry]);
        if (!chatOpen) setUnreadCount(c => c + 1);
      } else if (msg.type === 'emoji') {
        spawnFloatingEmoji(msg.emoji);
      } else if (msg.type === 'peer_list') {
        if (Array.isArray(msg.peers)) {
          msg.peers.forEach(pid => {
            if (pid !== peerRef.current?.id && !callsRef.current.has(pid)) {
              connectToPeer(pid);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse data message:', e);
    }
  }, [chatOpen]);

  const broadcastData = useCallback((payload) => {
    const str = JSON.stringify(payload);
    dataChannelsRef.current.forEach((conn) => {
      try {
        if (conn.open) conn.send(str);
      } catch (e) {
        console.warn('Send error:', e);
      }
    });
  }, []);

  /* ─────────── PEER MESH ─────────── */
  const connectToPeer = useCallback(async (targetId) => {
    if (!peerRef.current || callsRef.current.has(targetId)) return;

    let stream = localStreamRef.current;
    if (!stream) {
      stream = await initLocalMedia();
      if (!stream) return;
    }

    const outgoing = peerRef.current.call(targetId, stream);
    if (outgoing) wireCall(outgoing);

    const conn = peerRef.current.connect(targetId, { reliable: true });
    setupDataChannel(conn);
  }, [setupDataChannel]);

  /* ─────────── HELPERS ─────────── */
  const initLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Please allow camera and microphone access.');
      } else if (err.name === 'NotFoundError') {
        setErrorMsg('No camera or microphone found.');
      } else {
        setErrorMsg('Could not access camera or microphone: ' + err.message);
      }
      return null;
    }
  };

  const wireCall = useCallback((call) => {
    const pid = call.peer;
    if (callsRef.current.has(pid)) return;
    callsRef.current.set(pid, call);

    call.on('stream', remoteStream => {
      remoteStream.getAudioTracks().forEach(track => { track.enabled = true; });
      setRemotePeers(prev => new Map(prev).set(pid, remoteStream));

      const existingPeers = [...callsRef.current.keys()].filter(p => p !== pid);
      if (existingPeers.length > 0) {
        setTimeout(() => {
          const conn = dataChannelsRef.current.get(pid);
          if (conn?.open) {
            conn.send(JSON.stringify({ type: 'peer_list', peers: existingPeers }));
          } else {
            const dc = peerRef.current?.connect(pid, { reliable: true });
            if (dc) {
              setupDataChannel(dc);
              dc.on('open', () => {
                dc.send(JSON.stringify({ type: 'peer_list', peers: existingPeers }));
              });
            }
          }
        }, 1500);
      }
    });

    call.on('close', () => dropPeer(pid));
    call.on('error', () => dropPeer(pid));
  }, [setupDataChannel]);

  const dropPeer = (pid) => {
    const call = callsRef.current.get(pid);
    if (call) { try { call.close(); } catch (e) {} }
    callsRef.current.delete(pid);
    dataChannelsRef.current.delete(pid);
    setRemotePeers(prev => {
      const next = new Map(prev);
      next.delete(pid);
      return next;
    });
    delete remoteVideoRefs.current[pid];
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      system: true,
      text: `Peer ${pid.slice(0, 6)} left the call.`,
    }]);
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
    let targetId = joinId.trim();
    if (targetId.includes('?call=')) targetId = targetId.split('?call=')[1];
    if (!targetId) { setErrorMsg('Please enter a Peer ID.'); return; }
    if (!peerReady) { setErrorMsg('Still connecting to server, please wait.'); return; }
    if (callsRef.current.size >= MAX_PEERS) { setErrorMsg('Room full (max 4 participants).'); return; }

    let stream = localStreamRef.current;
    if (!stream) {
      stream = await initLocalMedia();
      if (!stream) return;
    }
    stream.getAudioTracks().forEach(t => { t.enabled = isMicOn; });

    setAppState('incall');
    try {
      await connectToPeer(targetId);
    } catch (err) {
      setErrorMsg('Could not reach that Peer ID.');
      setAppState('home');
    }
  };

  const hangup = () => {
    stopTranscription();
    stopScreenShare();

    callsRef.current.forEach(call => { try { call.close(); } catch (_) {} });
    callsRef.current.clear();
    dataChannelsRef.current.forEach(conn => { try { conn.close(); } catch (_) {} });
    dataChannelsRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }

    setRemotePeers(new Map());
    remoteVideoRefs.current = {};
    setIsMicOn(true);
    setIsCamOn(true);
    setIsSharingScreen(false);
    setJoinId('');
    setTranscriptLines([]);
    setInterimText('');
    setChatMessages([]);
    setChatInput('');
    setUnreadCount(0);
    setFloatingEmojis([]);
    setAppState('home');
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) { stopScreenShare(); return; }
    try {
      const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      screenStreamRef.current = sStream;
      const screenTrack = sStream.getVideoTracks()[0];

      callsRef.current.forEach(call => {
        const senders = call.peerConnection?.getSenders();
        if (senders) {
          const videoSender = senders.find(s => s.track?.kind === 'video');
          if (videoSender && screenTrack) videoSender.replaceTrack(screenTrack);
        }
      });

      if (localVideoRef.current && localStreamRef.current) {
        const newStream = new MediaStream([...localStreamRef.current.getAudioTracks(), screenTrack]);
        localVideoRef.current.srcObject = newStream;
      }

      screenTrack.onended = () => stopScreenShare();
      setIsSharingScreen(true);
    } catch (err) {
      if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
        setErrorMsg('Screen share failed: ' + err.message);
      }
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    setIsSharingScreen(false);
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack) {
      callsRef.current.forEach(call => {
        const senders = call.peerConnection?.getSenders();
        if (senders) {
          const videoSender = senders.find(s => s.track?.kind === 'video');
          if (videoSender) videoSender.replaceTrack(camTrack);
        }
      });
    }
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  };

  const copyToClipboard = (text) => {
    const fallback = (t) => {
      const ta = document.createElement('textarea');
      ta.value = t;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallback(text));
    } else { fallback(text); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ─────────── TRANSCRIPT ─────────── */
  const startTranscription = (lang) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recognitionActiveRef.current) return;

    try {
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = lang || selectedLangRef.current;
      recognitionRef.current = r;
      recognitionActiveRef.current = true;

      r.onstart = () => setIsListening(true);

      r.onresult = e => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript.trim();
          if (e.results[i].isFinal) {
            if (text) {
              setTranscriptLines(prev => [...prev, {
                text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
            }
            setInterimText('');
          } else {
            interim += text;
          }
        }
        if (interim) setInterimText(interim);
      };

      r.onerror = e => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('Speech recognition error:', e.error);
        }
      };

      r.onend = () => {
        setIsListening(false);
        if (recognitionActiveRef.current) {
          try {
            r.lang = selectedLangRef.current;
            r.start();
            setIsListening(true);
          } catch (_) {
            recognitionActiveRef.current = false;
          }
        }
      };

      r.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      recognitionActiveRef.current = false;
    }
  };

  const stopTranscription = () => {
    recognitionActiveRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) {}
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

  /* ─────────── CHAT ─────────── */
  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    const entry = {
      id: Date.now(),
      from: myShortId,
      text,
      mine: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, entry]);
    broadcastData({ type: 'chat', text });
    setChatInput('');
    chatInputRef.current?.focus();
  };

  const handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  const openChat = () => {
    setChatOpen(true);
    setUnreadCount(0);
  };

  /* ─────────── EMOJI REACTIONS ─────────── */
  const spawnFloatingEmoji = (emoji) => {
    const id = Date.now() + Math.random();
    const left = 20 + Math.random() * 60;
    setFloatingEmojis(prev => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 4000);
  };

  const sendEmoji = (emoji) => {
    spawnFloatingEmoji(emoji);
    broadcastData({ type: 'emoji', emoji });
    setShowEmojiPicker(false);
  };

  /* ─────────── LANGUAGE MODAL ─────────── */
  const openLangModal = () => { setPendingLang(selectedLang); setShowLangModal(true); };
  const confirmLang = () => { setSelectedLang(pendingLang); setShowLangModal(false); };

  /* ─────────── COMPUTED ─────────── */
  const totalParticipants = 1 + remotePeers.size;
  const gStyle = { ...S.videoGrid, ...gridStyle(totalParticipants) };
  const remotePeersArr = [...remotePeers.entries()];
  const hasRemotes = remotePeers.size > 0;
  const currentLangLabel = LANGUAGES.find(l => l.code === selectedLang)?.label || selectedLang;
  const currentLangFlag = LANGUAGES.find(l => l.code === selectedLang)?.flag || '🌐';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

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
                  <button style={S.iconBtn} onClick={() => copyToClipboard(myPeerId)} title="Copy Peer ID">
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
              <button style={{ ...S.iconBtn, color: '#64748b', padding: '4px' }} onClick={() => copyToClipboard(myPeerId)}>
                {copied ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <div style={S.participantsBadge}>{totalParticipants} of max 4</div>
          </div>

          {/* Main body: video + optional chat */}
          <div style={S.callBody}>
            {/* Video grid (relative so transcript panel overlays it) */}
            <div style={{ ...gStyle, position: 'relative' }}>
              {/* Local tile with virtual background feel */}
              <div style={S.videoTile}>
                {isCamOn ? (
                  <video ref={localVideoRef} style={S.localVideoEl} autoPlay playsInline muted />
                ) : (
                  <>
                    <video ref={localVideoRef} style={{ display: 'none' }} autoPlay playsInline muted />
                    <div style={S.camOffAvatar}><CameraOff size={28} /></div>
                  </>
                )}
                <div style={S.tileLabel}>
                  You{isSharingScreen ? ' (screen)' : ''}{!isCamOn ? ' (cam off)' : ''}
                </div>
              </div>

              {/* Remote tiles with subtle gradient overlay for background effect */}
              {remotePeersArr.map(([pid], idx) => (
                <div key={pid} style={S.videoTile}>
                  <video
                    ref={el => { if (el) remoteVideoRefs.current[pid] = el; }}
                    style={S.videoEl}
                    autoPlay
                    playsInline
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

              {/* Floating emoji reactions */}
              {floatingEmojis.map(fe => (
                <div
                  key={fe.id}
                  style={{ ...S.floatingEmoji, left: `${fe.left}%` }}
                >
                  {fe.emoji}
                </div>
              ))}

              {/* Transcript panel */}
              {ccEnabled && (
                <div style={S.transcriptPanel}>
                  <div style={S.transcriptHeader} onClick={() => setTranscriptOpen(v => !v)}>
                    <div style={S.transcriptTitle}>
                      <FileText size={12} color="#38bdf8" />
                      Transcript
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>
                        {currentLangFlag}
                      </span>
                      {isListening ? <span style={S.liveDot} /> : <span style={S.pausedDot} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {transcriptLines.length > 0 && (
                        <button
                          style={{ ...S.iconBtn, color: '#64748b', padding: '2px' }}
                          onClick={e => { e.stopPropagation(); downloadTranscript(); }}
                          title="Download"
                        >
                          <Download size={12} />
                        </button>
                      )}
                      <span style={{ color: '#38bdf8', fontSize: '12px', lineHeight: 1 }}>
                        {transcriptOpen ? '▾' : '▸'}
                      </span>
                    </div>
                  </div>

                  {transcriptOpen && (
                    <div style={S.transcriptBody}>
                      {transcriptLines.length === 0 && !interimText && (
                        <div style={S.transcriptEmpty}>
                          {isListening ? 'Listening… start speaking.' : 'Mic inactive.'}
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

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div style={S.emojiPickerOverlay} onClick={e => e.stopPropagation()}>
                  {EMOJI_REACTIONS.map(em => (
                    <button
                      key={em}
                      style={S.emojiBtn}
                      onClick={() => sendEmoji(em)}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'none'; }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat side panel - fullscreen on mobile */}
            {chatOpen && (
              <div style={isMobile ? { ...S.chatPanel, position: 'fixed', bottom: 0, left: 0, right: 0, top: 'auto', width: '100%', height: '70vh', borderLeft: 'none', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 300, backgroundColor: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(20px)' } : S.chatPanel}>
                <div style={S.chatHeader}>
                  <div style={S.chatTitle}>
                    <MessageSquare size={14} />
                    Chat
                  </div>
                  <button
                    style={{ ...S.iconBtn, color: '#64748b', padding: '4px' }}
                    onClick={() => setChatOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={S.chatMessages}>
                  {chatMessages.length === 0 && (
                    <div style={{ ...S.chatMsgSystem, marginTop: '20px' }}>
                      No messages yet. Say hi! 👋
                    </div>
                  )}
                  {chatMessages.map(msg => {
                    if (msg.system) return (
                      <div key={msg.id} style={S.chatMsgSystem}>{msg.text}</div>
                    );
                    return (
                      <div key={msg.id} style={msg.mine ? S.chatMsgMine : S.chatMsgTheirs}>
                        {!msg.mine && <div style={S.chatMsgSender}>{msg.from}</div>}
                        <div>{msg.text}</div>
                        <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px', textAlign: msg.mine ? 'right' : 'left' }}>
                          {msg.time}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div style={S.chatInputRow}>
                  <textarea
                    ref={chatInputRef}
                    style={S.chatInput}
                    placeholder="Type a message…"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    rows={1}
                  />
                  <button style={S.chatSendBtn} onClick={sendChat} title="Send">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Control bar */}
          <div style={S.controlBar}>
            <button
              style={{ ...S.ctrlBtn, ...(isMicOn ? S.ctrlOn : S.ctrlOff) }}
              onClick={() => setIsMicOn(v => !v)}
              title={isMicOn ? 'Mute mic' : 'Unmute mic'}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            <button
              style={{ ...S.ctrlBtn, ...(isCamOn ? S.ctrlOn : S.ctrlOff) }}
              onClick={() => setIsCamOn(v => !v)}
              title={isCamOn ? 'Stop camera' : 'Start camera'}
            >
              {isCamOn ? <Camera size={22} /> : <CameraOff size={22} />}
            </button>

            <button
              style={{ ...S.ctrlBtn, ...(isSharingScreen ? S.ctrlShare : S.ctrlShareOff) }}
              onClick={toggleScreenShare}
              title={isSharingScreen ? 'Stop sharing' : 'Share screen'}
            >
              {isSharingScreen ? <MonitorOff size={22} /> : <Monitor size={22} />}
            </button>

            <button
              style={{ ...S.ctrlBtn, ...(ccEnabled ? S.ctrlActive : S.ctrlOff) }}
              onClick={() => setCcEnabled(v => !v)}
              title={ccEnabled ? 'Disable captions' : 'Enable captions'}
            >
              <Subtitles size={22} />
            </button>

            <button
              style={{
                ...S.ctrlBtn,
                width: 'auto',
                padding: '0 14px',
                borderRadius: '999px',
                ...S.ctrlOn,
                fontSize: '18px',
              }}
              onClick={openLangModal}
              title="Pick transcript language"
            >
              <span style={{ fontSize: '18px' }}>{currentLangFlag}</span>
            </button>

            <button
              style={{ ...S.ctrlBtn, ...(showEmojiPicker ? S.ctrlHighlight : S.ctrlOn) }}
              onClick={e => { e.stopPropagation(); setShowEmojiPicker(v => !v); }}
              title="React with emoji"
            >
              <Smile size={22} />
            </button>

            <button
              style={{
                ...S.ctrlBtn,
                ...(chatOpen ? S.ctrlHighlight : S.ctrlOn),
                position: 'relative',
              }}
              onClick={() => chatOpen ? setChatOpen(false) : openChat()}
              title="Chat"
            >
              <MessageSquare size={22} />
              {unreadCount > 0 && !chatOpen && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '2px solid #0b1120',
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

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
                    {active && <span style={S.langCheck}><Check size={15} color="#1d4ed8" /></span>}
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