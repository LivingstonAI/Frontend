import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { useNavigate } from "react-router-dom";
import {
    BookOpen, Bookmark, ChevronLeft, Edit2, Trash2,
    Volume2, VolumeX, PlusCircle, Folder, MessageSquare,
    Save, X, List, Grid, RefreshCw, Pause, Play, RotateCcw, Download
} from "react-feather";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BrainIcon = ({ size = 30, color = "currentColor", className = "", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`feather feather-brain ${className}`} {...props}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 0 19.5v-15A2.5 2.5 0 0 1 2.5 2h7z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5h7A2.5 2.5 0 0 0 24 19.5v-15A2.5 2.5 0 0 0 21.5 2h-7z"/>
        <path d="M12 2v20"/><path d="M7 7h.01"/><path d="M17 7h.01"/>
        <path d="M7 12h.01"/><path d="M17 12h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/>
    </svg>
);
const MicIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);

const VOICE_STORAGE_KEY = 'chill_selected_voice_name';

// ─── Styles (all inline — zero CSS classname conflicts) ───────────────────────
const pillBase = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 18px', borderRadius: '50px', border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px',
    fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1,
    transition: 'all 0.18s ease', whiteSpace: 'nowrap', userSelect: 'none',
};
const S = {
    actionRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
    pillGhost: { ...pillBase, background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '1.5px solid rgba(255,255,255,0.15)' },
    pillBlue: { ...pillBase, background: 'linear-gradient(135deg,#1d6fd8,#1251a3)', color: '#fff', boxShadow: '0 2px 12px rgba(29,111,216,0.28)' },
    pillBlueOutline: { ...pillBase, background: 'transparent', color: '#1d6fd8', border: '1.5px solid #1d6fd8' },
    pillTeal: { ...pillBase, background: 'linear-gradient(135deg,#0891b2,#0e7490)', color: '#fff', boxShadow: '0 2px 12px rgba(8,145,178,0.28)' },
    pillRed: { ...pillBase, background: 'linear-gradient(135deg,#ef4444,#b91c1c)', color: '#fff', boxShadow: '0 2px 12px rgba(239,68,68,0.28)' },
    pillAmber: { ...pillBase, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', boxShadow: '0 2px 12px rgba(245,158,11,0.28)' },
    pillGreen: { ...pillBase, background: 'linear-gradient(135deg,#22c55e,#15803d)', color: '#fff', boxShadow: '0 2px 12px rgba(34,197,94,0.28)' },
    pillPurple: { ...pillBase, background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', boxShadow: '0 2px 12px rgba(139,92,246,0.28)' },
    pillOrange: { ...pillBase, background: 'linear-gradient(135deg,#f97316,#c2410c)', color: '#fff', boxShadow: '0 2px 12px rgba(249,115,22,0.28)' },
    toggleGroup: { display: 'inline-flex', borderRadius: '50px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.18)', gap: 0 },
    toggleBtnBase: { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, lineHeight: 1, transition: 'all 0.18s ease', whiteSpace: 'nowrap' },
    toggleBtnActive: { background: 'linear-gradient(135deg,#1d6fd8,#1251a3)', color: '#fff' },
    toggleBtnInactive: { background: 'rgba(255,255,255,0.06)', color: 'inherit', opacity: 0.7 },
    voicePickerWrap: { position: 'relative', display: 'inline-flex' },
    voiceDropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: '#fff', border: '2px solid #1d6fd8', borderRadius: '14px', boxShadow: '0 8px 36px rgba(29,111,216,0.18)', zIndex: 9998, minWidth: '290px', maxHeight: '360px', overflowY: 'auto', padding: '6px 0' },
    voiceDropdownHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 6px', fontWeight: 700, fontSize: '13px', color: '#1251a3', borderBottom: '1.5px solid #dbeafe', marginBottom: '4px' },
    voiceCloseBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'inline-flex', alignItems: 'center', padding: '2px' },
    voiceGroupLabel: { padding: '4px 14px 2px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b90c9' },
    voiceOptionBtn: (a) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: a ? '#dbeafe' : 'transparent', border: 'none', padding: '8px 14px', cursor: 'pointer', textAlign: 'left', gap: '8px', fontFamily: 'inherit' }),
    voiceOptionName: (a) => ({ fontSize: '13px', color: a ? '#1251a3' : '#333', fontWeight: a ? 700 : 400, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }),
    voiceOptionLang: { fontSize: '11px', color: '#94a3b8', flexShrink: 0 },
    // Livingston chat
    livingstonOverlay: { position: 'fixed', right: '28px', bottom: '28px', width: '400px', maxHeight: '72vh', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '2px solid #1d6fd8', borderRadius: '18px', boxShadow: '0 12px 48px rgba(29,111,216,0.22)', zIndex: 9999, overflow: 'hidden', fontFamily: 'inherit' },
    livingstonHeader: { background: 'linear-gradient(135deg,#1d6fd8,#1251a3)', color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
    livingstonHeaderTitle: { margin: 0, fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' },
    livingstonCloseBtn: { background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '5px 7px', display: 'inline-flex', alignItems: 'center' },
    livingstonMsgsArea: { flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f7f9ff', display: 'flex', flexDirection: 'column', gap: '8px' },
    livingstonEmptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', color: '#1d6fd8', textAlign: 'center', gap: '12px', fontSize: '14px', lineHeight: '1.5' },
    livingstonMsgAI: { alignSelf: 'flex-start', background: 'linear-gradient(135deg,#e8f0fe,#dbeafe)', color: '#1251a3', borderLeft: '3px solid #1d6fd8', borderRadius: '2px 12px 12px 2px', padding: '10px 14px', fontSize: '13.5px', lineHeight: '1.55', maxWidth: '88%', wordBreak: 'break-word', margin: 0 },
    livingstonMsgUser: { alignSelf: 'flex-end', background: '#1d6fd8', color: '#fff', borderRight: '3px solid #1251a3', borderRadius: '12px 2px 2px 12px', padding: '10px 14px', fontSize: '13.5px', lineHeight: '1.55', maxWidth: '88%', wordBreak: 'break-word', margin: 0 },
    livingstonInputRow: { display: 'flex', gap: '8px', padding: '12px', background: '#eef3ff', borderTop: '1.5px solid #bfdbfe', flexShrink: 0 },
    livingstonInput: { flex: 1, border: '1.5px solid #93c5fd', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', outline: 'none', background: '#fff', color: '#1a1a2e', fontFamily: 'inherit' },
    livingstonSendBtn: (d) => ({ background: 'linear-gradient(135deg,#1d6fd8,#1251a3)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 700, fontSize: '13px', cursor: d ? 'not-allowed' : 'pointer', opacity: d ? 0.4 : 1, flexShrink: 0, fontFamily: 'inherit' }),
    // Reader panel
    readerPanel: { background: 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '14px 18px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.1)' },
    readerLabel: { fontSize: '13px', fontWeight: 600, opacity: 0.7, marginRight: '4px' },
    // Word highlight
    wordHighlight: { background: '#fde047', color: '#1a1a2e', borderRadius: '3px', padding: '0 2px', transition: 'background 0.1s' },
};

// ─── Highlighted text renderer ────────────────────────────────────────────────
function HighlightedText({ text, highlightIndex }) {
    // Split the clean text into words, render each as a span
    const words = text.split(/(\s+)/); // keep whitespace tokens
    let wordIdx = 0;
    return (
        <>
            {words.map((token, i) => {
                if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
                const currentWord = wordIdx;
                wordIdx++;
                return (
                    <span
                        key={i}
                        data-word-index={currentWord}
                        style={currentWord === highlightIndex ? S.wordHighlight : undefined}
                    >
                        {token}
                    </span>
                );
            })}
        </>
    );
}

// ─── Formatted content with word highlighting ─────────────────────────────────
function FormattedContent({ text, highlightWordIndex, isReading }) {
    const lines = text.split('\n');
    // Build a flat word list offset map per line so highlight index is global
    let globalWordOffset = 0;

    return (
        <>
            {lines.map((line, i) => {
                line = line.trim();
                if (!line) return null;

                const cleanLine = line.replace(/^#{1,3}\s*/, '').replace(/^->\s*/, '');
                const wordsInLine = cleanLine.split(/\s+/).filter(Boolean).length;
                const lineOffset = globalWordOffset;
                globalWordOffset += wordsInLine;

                // Compute local highlight index for this line
                const localHighlight = (isReading && highlightWordIndex >= lineOffset && highlightWordIndex < lineOffset + wordsInLine)
                    ? highlightWordIndex - lineOffset
                    : -1;

                const content = isReading
                    ? <HighlightedText text={cleanLine} highlightIndex={localHighlight} />
                    : cleanLine;

                if (line.startsWith('## ')) return <h5 key={i} className="subheading">{content}</h5>;
                if (line.startsWith('### ')) return <p key={i} className="subpoint">{content}</p>;
                if (line.startsWith('-> ')) return <p key={i} className="note">{content}</p>;
                return <p key={i} className="content-text">{content}</p>;
            })}
        </>
    );
}

export default function Chill() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState("");
    const [newSection, setNewSection] = useState("");
    const [newText, setNewText] = useState("");
    const [showNewEntryForm, setShowNewEntryForm] = useState(false);
    const [imageFolders, setImageFolders] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);
    const [folderState, setFolderState] = useState(false);
    const [imageViewState, setImageViewState] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [userInput, setUserInput] = useState('');
    const [imageProcess, setImageProcess] = useState('View Trading Images');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState(() => {
        try { return localStorage.getItem(VOICE_STORAGE_KEY) || ''; } catch { return ''; }
    });
    const [showVoiceSelector, setShowVoiceSelector] = useState(false);

    // ── Reader state ──
    const [readState, setReadState] = useState('idle'); // 'idle' | 'playing' | 'paused'
    const [highlightWordIndex, setHighlightWordIndex] = useState(-1);
    const [isDownloading, setIsDownloading] = useState(false);

    const messagesEndRef = useRef(null);
    const sectionTopRef = useRef(null); // scroll target
    const uttRef = useRef(null);
    const navigate = useNavigate();
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    // Auto-scroll chat to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Scroll to TOP of section when a section is selected
    useEffect(() => {
        if (selectedSection) {
            setTimeout(() => {
                sectionTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }
    }, [selectedSection]);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setAvailableVoices(voices);
                if (!selectedVoiceName) {
                    const def = voices.find(v => v.lang.startsWith('en')) || voices[0];
                    if (def) {
                        setSelectedVoiceName(def.name);
                        try { localStorage.setItem(VOICE_STORAGE_KEY, def.name); } catch {}
                    }
                }
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const handleVoiceChange = (voiceName) => {
        setSelectedVoiceName(voiceName);
        try { localStorage.setItem(VOICE_STORAGE_KEY, voiceName); } catch {}
        setShowVoiceSelector(false);
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await fetch(`${baseUrl}/fetch-chill-sections`);
                const data = await r.json();
                if (r.ok) setSections(data.sections);
                else console.error(data.message);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${baseUrl}/get_openai_key`);
                if (!r.ok) return;
                const { OPENAI_API_KEY } = await r.json();
                setOPENAI_API_KEY(OPENAI_API_KEY);
            } catch (e) { console.error(e); }
        })();
    }, []);

    const fetchSectionData = async (section) => {
        try {
            setImageViewState(false); setLoading(true); setShowNewEntryForm(false);
            stopSpeech();
            const r = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(section.section)}`);
            const data = await r.json();
            if (r.ok) { setSelectedSection(data); setEditedText(data.text); }
            else console.error(data.message);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleBack = () => {
        stopSpeech();
        setChatOpen(false); setSelectedSection(null); setMessages([]);
        setEditing(false); setImageViewState(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const r = await fetch(`${baseUrl}/edit-chill-data`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: selectedSection.section, text: editedText }),
            });
            const data = await r.json();
            if (r.ok) { setSelectedSection({ ...selectedSection, text: editedText }); setEditing(false); }
            else console.error(data.message);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (section) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;
        try {
            setLoading(true);
            const r = await fetch(`${baseUrl}/delete-chill-entry`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section }),
            });
            const data = await r.json();
            if (r.ok) { setSections(sections.filter(s => s.section !== section)); setSelectedSection(null); setEditing(false); }
            else console.error(data.message);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreateNewEntry = async () => {
        if (!newSection.trim()) { alert("Please enter a section name"); return; }
        try {
            setLoading(true);
            const r = await fetch(`${baseUrl}/create-chill-data`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: newSection, text: newText }),
            });
            const data = await r.json();
            if (r.ok) {
                setSections([...sections, { section: newSection }]);
                setNewSection(""); setNewText(""); setShowNewEntryForm(false);
            } else console.error(data.message);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // ─── Speech helpers ────────────────────────────────────────────────────────
    const getSelectedVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.name === selectedVoiceName)
            || voices.find(v => v.lang.startsWith('en'))
            || voices[0];
    };

    const buildUtterance = (text) => {
        const clean = text.replace(/#{1,3}/g, '').replace(/->/g, '');
        const utt = new SpeechSynthesisUtterance(clean);
        const voice = getSelectedVoice();
        if (voice) utt.voice = voice;
        utt.volume = 1; utt.pitch = 1; utt.rate = 0.95;

        // Word boundary → highlight
        utt.onboundary = (e) => {
            if (e.name === 'word') {
                // charIndex maps to word index
                const textBefore = clean.substring(0, e.charIndex);
                const wordsBefore = textBefore.trim().split(/\s+/).filter(Boolean).length;
                setHighlightWordIndex(wordsBefore);
            }
        };
        utt.onend = () => {
            setReadState('idle');
            setHighlightWordIndex(-1);
        };
        utt.onerror = (e) => {
            if (e.error !== 'interrupted') console.error('Speech error:', e.error);
            setReadState('idle');
            setHighlightWordIndex(-1);
        };
        return utt;
    };

    const startReading = (text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utt = buildUtterance(text);
        uttRef.current = utt;
        setReadState('playing');
        setHighlightWordIndex(0);
        window.speechSynthesis.speak(utt);
    };

    const pauseReading = () => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setReadState('paused');
        }
    };

    const resumeReading = () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setReadState('playing');
        }
    };

    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        setReadState('idle');
        setHighlightWordIndex(-1);
    };

    const restartReading = () => {
        if (selectedSection) {
            stopSpeech();
            setTimeout(() => startReading(selectedSection.text), 80);
        }
    };

    // ─── Download audio via MediaRecorder (records system TTS output) ──────────
    const downloadAudio = async () => {
        if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
        if (isDownloading) return;

        // We need AudioContext + MediaRecorder to capture TTS.
        // Strategy: use a hidden AudioContext with a destination stream,
        // speak through it via Web Audio, record via MediaRecorder.
        // Simpler cross-browser approach: use MediaRecorder on a dest stream
        // from AudioContext connected to a ScriptProcessor or AudioWorklet.
        // 
        // However the MOST reliable approach for recording browser TTS is:
        // speechSynthesis → system audio → captured via getDisplayMedia (needs user permission)
        // OR just offer an MP3 download via a TTS REST API.
        //
        // Since we don't have an external TTS API, we'll use the cleanest
        // pure-browser approach: AudioContext + oscillator trick doesn't work for TTS.
        // 
        // REAL approach that works: record using MediaRecorder on a silent dest,
        // while also speaking. But TTS audio doesn't go through WebAudio graph.
        //
        // BEST PURE BROWSER APPROACH:
        // Use SpeechSynthesis to speak, and MediaRecorder on
        // AudioContext.createMediaStreamDestination() while routing
        // a dummy gain node — this captures NOTHING from TTS since TTS
        // bypasses WebAudio entirely.
        //
        // PRACTICAL SOLUTION that actually works:
        // Use the Web Speech API to speak while simultaneously recording
        // via getUserMedia (microphone) — user records what their speakers play.
        // This is unreliable and requires mic permission.
        //
        // REAL WORKING SOLUTION: generate audio client-side using the
        // browser's AudioContext with a speech synthesis polyfill, OR
        // use a simple approach: create a Blob from TTS via Web Worker.
        //
        // Since we're constrained to browser TTS only and MediaRecorder
        // cannot tap TTS output directly, we'll generate a plain-text file
        // and offer it as a download, while also speaking.
        // 
        // ── Actually the cleanest real solution: ──
        // Use the SpeechSynthesis Utterance with MediaRecorder
        // by routing through AudioContext.createMediaStreamDestination
        // using a Web Audio trick where we connect an audio source.
        // This still won't capture TTS.
        //
        // ── FINAL DECISION: ──
        // We'll download the text as a .txt file for import into
        // any TTS tool, AND also try to record using MediaRecorder
        // on AudioContext destination stream (works in some browsers
        // when TTS routes through the audio graph).

        setIsDownloading(true);
        const text = (selectedSection?.text || '').replace(/#{1,3}/g, '').replace(/->/g, '').trim();
        const sectionName = selectedSection?.section || 'section';

        try {
            // Try AudioContext MediaRecorder approach
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const dest = ctx.createMediaStreamDestination();

            // Create a very quiet oscillator to keep the stream alive
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0.00001; // nearly silent
            osc.connect(gain);
            gain.connect(dest);
            osc.start();

            const recorder = new MediaRecorder(dest.stream);
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

            recorder.onstop = () => {
                osc.stop();
                ctx.close();
                // The recording will only contain the silent oscillator,
                // not TTS audio (TTS bypasses WebAudio in all browsers).
                // So instead, we fall back to downloading as text.
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${sectionName.replace(/\s+/g, '_')}_notes.txt`;
                a.click();
                URL.revokeObjectURL(url);
                setIsDownloading(false);
                alert('Downloaded as text file. You can import this into any TTS app (e.g. macOS "say" command, Balabolka, or paste into Google TTS) to get audio in the voice of your choice.');
            };

            recorder.start();

            // Speak the content
            window.speechSynthesis.cancel();
            const utt = buildUtterance(text);
            const origOnEnd = utt.onend;
            utt.onend = (e) => {
                recorder.stop();
                if (origOnEnd) origOnEnd(e);
            };
            utt.onerror = (e) => {
                recorder.stop();
            };
            setReadState('playing');
            window.speechSynthesis.speak(utt);

        } catch (err) {
            console.error('Audio download error:', err);
            // Fallback: just download text
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sectionName.replace(/\s+/g, '_')}_notes.txt`;
            a.click();
            URL.revokeObjectURL(url);
            setIsDownloading(false);
        }
    };

    // ─── Chat ──────────────────────────────────────────────────────────────────
    const handleSendMessage = async (input) => {
        if (!input.trim()) return;
        setUserInput('');
        setMessages(prev => [...prev, { role: "user", content: input }]);
        try {
            const r = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI_API_KEY },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: `You are an AI expert called Livingston. Answer questions for the following section: ${editedText}. This is a trading platform.` },
                        { role: "user", content: input },
                    ],
                }),
            });
            const data = await r.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        }
    };

    const quizMe = async () => {
        try { await navigator.clipboard.writeText(editedText.replace(/#{1,3}/g, '')); navigate('/quizifier'); }
        catch (e) { console.error(e); }
    };

    const fetchImages = async () => {
        setImageProcess('Fetching Images...');
        try {
            const r = await fetch(`${baseUrl}/fetch-trading-images`);
            const data = await r.json();
            if (r.ok) { setImageFolders(p => JSON.stringify(p) !== JSON.stringify(data.folders) ? data.folders : p); setImageProcess('View Trading Images'); }
            else { alert('Error fetching images.'); setImageProcess('View Trading Images'); }
        } catch { alert('Error fetching images.'); setImageProcess('View Trading Images'); }
    };

    const filteredSections = sections.filter(s => s.section.toLowerCase().includes(searchQuery.toLowerCase()));
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const otherVoices = availableVoices.filter(v => !v.lang.startsWith('en'));
    const shortVoiceName = selectedVoiceName ? selectedVoiceName.split(' ').slice(0, 2).join(' ') : 'Voice';
    const isReading = readState !== 'idle';

    return (
        <div className="chill-container">
            <div className="header"><Header /></div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="chill-interface">
                        <div className="chill-header">
                            <h5 className="chill-title">
                                <BookOpen className="icon" />
                                C.H.I.L.L Interface
                                <span className="version-tag">v2.0</span>
                            </h5>
                            <div className="chill-subtitle">Comprehensive Hybrid Interface for Learning & Logging</div>
                        </div>

                        {/* ═══ LIVINGSTON CHAT ═══ */}
                        {chatOpen && (
                            <div style={S.livingstonOverlay}>
                                <div style={S.livingstonHeader}>
                                    <h4 style={S.livingstonHeaderTitle}><MessageSquare size={20} /> Livingston AI Assistant</h4>
                                    <button style={S.livingstonCloseBtn} onClick={() => setChatOpen(false)}><X size={20} /></button>
                                </div>
                                <div style={S.livingstonMsgsArea}>
                                    {messages.length === 0 ? (
                                        <div style={S.livingstonEmptyState}>
                                            <BrainIcon size={44} color="#1d6fd8" />
                                            <p style={{ margin: 0 }}>Ask Livingston about this section.<br />The AI will analyze the content and provide insights.</p>
                                        </div>
                                    ) : messages.map((msg, idx) => (
                                        <div key={idx} style={msg.role === 'assistant' ? S.livingstonMsgAI : S.livingstonMsgUser}>
                                            {msg.content}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div style={S.livingstonInputRow}>
                                    <input style={S.livingstonInput} type="text" placeholder="Ask me something..."
                                        value={userInput} onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(userInput); }} />
                                    <button style={S.livingstonSendBtn(!userInput.trim())}
                                        onClick={() => handleSendMessage(userInput)} disabled={!userInput.trim()}>Send</button>
                                </div>
                            </div>
                        )}

                        {/* ═══ IMAGE / SEARCH PANEL ═══ */}
                        {imageViewState && (
                            <div className="dashboard-section">
                                <div className="section-controls">
                                    <button onClick={fetchImages} className="control-btn image-btn">
                                        <RefreshCw size={18} className={imageProcess === 'Fetching Images...' ? 'spinning' : ''} />
                                        {imageProcess}
                                    </button>
                                    <div style={S.toggleGroup}>
                                        <button style={{ ...S.toggleBtnBase, ...(viewMode === 'grid' ? S.toggleBtnActive : S.toggleBtnInactive) }} onClick={() => setViewMode('grid')}>
                                            <Grid size={16} /> Grid
                                        </button>
                                        <button style={{ ...S.toggleBtnBase, ...(viewMode === 'list' ? S.toggleBtnActive : S.toggleBtnInactive) }} onClick={() => setViewMode('list')}>
                                            <List size={16} /> List
                                        </button>
                                    </div>
                                </div>
                                {!selectedSection && (
                                    <div className="search-container">
                                        <input type="text" placeholder="Search sections..." value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                                    </div>
                                )}
                                {imageFolders && (
                                    <div className="image-folders">
                                        <h6 className="section-subheading"><Folder size={18} /> Image Folders</h6>
                                        <div className="folder-grid">
                                            {Object.keys(imageFolders).map((folder, i) => (
                                                <button key={i} onClick={() => { setSelectedFolder(folder); setFolderState(true); }} className="folder-btn">
                                                    <Folder size={18} /><span>{folder}</span>
                                                    <span className="file-count">{imageFolders[folder].length}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedFolder && folderState && (
                            <div className="folder-view">
                                <div className="folder-header">
                                    <h6><Folder size={18} /> {selectedFolder}</h6>
                                    <button onClick={() => setFolderState(false)} className="close-folder-btn"><X size={18} /></button>
                                </div>
                                <div className="images-grid">
                                    {imageFolders[selectedFolder].map((imageData, i) => (
                                        <div key={i} className="image-card" onClick={() => setExpandedImage(imageData)}>
                                            <img src={imageData.data} alt={imageData.filename || "Trading Image"} className="image-thumbnail" />
                                            <div className="image-name">{imageData.filename || `Image ${i + 1}`}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {expandedImage && (
                            <div className="expanded-image-overlay" onClick={() => setExpandedImage(null)}>
                                <div className="expanded-image-container" onClick={e => e.stopPropagation()}>
                                    <button className="close-expanded-btn" onClick={() => setExpandedImage(null)}><X size={18} /></button>
                                    <img src={expandedImage.data} alt="Expanded Trading Image" className="expanded-image" />
                                    <div className="image-filename">{expandedImage.filename || "Trading Image"}</div>
                                </div>
                            </div>
                        )}

                        {/* ═══ MAIN CONTENT ═══ */}
                        {loading ? (
                            <div className="loading-container">
                                <div className="pulse-loader"></div>
                                <p>Loading C.H.I.L.L data...</p>
                            </div>
                        ) : selectedSection ? (
                            <div className="section-view" ref={sectionTopRef}>
                                {/* Section header + action buttons */}
                                <div className="section-header">
                                    <h4 className="section-title">
                                        <Bookmark size={18} className="icon" />
                                        {selectedSection.section}
                                    </h4>

                                    <div style={S.actionRow}>
                                        {/* Voice picker */}
                                        <div style={S.voicePickerWrap}>
                                            <button
                                                style={showVoiceSelector ? S.pillBlueOutline : S.pillGhost}
                                                onClick={() => setShowVoiceSelector(v => !v)}
                                                title={`Voice: ${selectedVoiceName || 'Default'}`}
                                            >
                                                <MicIcon size={16} /> {shortVoiceName}
                                            </button>
                                            {showVoiceSelector && (
                                                <div style={S.voiceDropdown}>
                                                    <div style={S.voiceDropdownHeader}>
                                                        <span>Choose Voice</span>
                                                        <button style={S.voiceCloseBtn} onClick={() => setShowVoiceSelector(false)}><X size={16} /></button>
                                                    </div>
                                                    {englishVoices.length > 0 && <>
                                                        <div style={S.voiceGroupLabel}>English</div>
                                                        {englishVoices.map(v => (
                                                            <button key={v.name} style={S.voiceOptionBtn(v.name === selectedVoiceName)} onClick={() => handleVoiceChange(v.name)}>
                                                                <span style={S.voiceOptionName(v.name === selectedVoiceName)}>{v.name}</span>
                                                                <span style={S.voiceOptionLang}>{v.lang}</span>
                                                            </button>
                                                        ))}
                                                    </>}
                                                    {otherVoices.length > 0 && <>
                                                        <div style={S.voiceGroupLabel}>Other Languages</div>
                                                        {otherVoices.map(v => (
                                                            <button key={v.name} style={S.voiceOptionBtn(v.name === selectedVoiceName)} onClick={() => handleVoiceChange(v.name)}>
                                                                <span style={S.voiceOptionName(v.name === selectedVoiceName)}>{v.name}</span>
                                                                <span style={S.voiceOptionLang}>{v.lang}</span>
                                                            </button>
                                                        ))}
                                                    </>}
                                                </div>
                                            )}
                                        </div>

                                        {/* AI Assistant */}
                                        {!editing && (
                                            <button style={S.pillBlue} onClick={() => setChatOpen(true)}>
                                                <MessageSquare size={16} /> Ask Livingston
                                            </button>
                                        )}

                                        {/* Edit / Save */}
                                        {!editing && (
                                            <button style={S.pillAmber} onClick={() => setEditing(true)}>
                                                <Edit2 size={16} /> Edit
                                            </button>
                                        )}
                                        {editing && (
                                            <button style={S.pillGreen} onClick={handleSave}>
                                                <Save size={16} /> Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* ── Reader controls bar (shown when not editing) ── */}
                                {!editing && (
                                    <div style={S.readerPanel}>
                                        <span style={S.readerLabel}>
                                            <Volume2 size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                            Read Aloud
                                        </span>

                                        {/* Play */}
                                        {readState === 'idle' && (
                                            <button style={S.pillTeal} onClick={() => startReading(selectedSection.text)}>
                                                <Play size={15} /> Play
                                            </button>
                                        )}

                                        {/* Pause */}
                                        {readState === 'playing' && (
                                            <button style={S.pillAmber} onClick={pauseReading}>
                                                <Pause size={15} /> Pause
                                            </button>
                                        )}

                                        {/* Resume */}
                                        {readState === 'paused' && (
                                            <button style={S.pillTeal} onClick={resumeReading}>
                                                <Play size={15} /> Resume
                                            </button>
                                        )}

                                        {/* Restart (shown when playing or paused) */}
                                        {readState !== 'idle' && (
                                            <button style={S.pillOrange} onClick={restartReading}>
                                                <RotateCcw size={15} /> Restart
                                            </button>
                                        )}

                                        {/* Stop (shown when playing or paused) */}
                                        {readState !== 'idle' && (
                                            <button style={S.pillRed} onClick={stopSpeech}>
                                                <VolumeX size={15} /> Stop
                                            </button>
                                        )}

                                        {/* Download notes */}
                                        <button
                                            style={{ ...S.pillPurple, marginLeft: 'auto', opacity: isDownloading ? 0.6 : 1 }}
                                            onClick={downloadAudio}
                                            disabled={isDownloading}
                                            title="Download notes as text file"
                                        >
                                            <Download size={15} />
                                            {isDownloading ? 'Reading...' : 'Download Notes'}
                                        </button>
                                    </div>
                                )}

                                {/* Section content */}
                                <div className="section-content">
                                    {editing ? (
                                        <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)}
                                            className="content-editor" placeholder="Enter section content..." />
                                    ) : (
                                        <div className="formatted-content">
                                            <FormattedContent
                                                text={selectedSection.text}
                                                highlightWordIndex={highlightWordIndex}
                                                isReading={isReading}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="section-footer">
                                    <button onClick={handleBack} className="footer-btn back-btn">
                                        <ChevronLeft size={16} /> Back to Sections
                                    </button>
                                    <div className="footer-actions">
                                        <button onClick={quizMe} className="footer-btn quiz-btn">
                                            <BrainIcon size={16} /> Quiz Me
                                        </button>
                                        <button onClick={() => handleDelete(selectedSection.section)} className="footer-btn delete-btn">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sections-view">
                                <div className={`sections-container ${viewMode}`}>
                                    {filteredSections.length > 0 ? (
                                        filteredSections.map((section, i) => (
                                            <div key={i} className="section-item" onClick={() => fetchSectionData(section)}>
                                                <Bookmark size={16} className="section-icon" />
                                                <span className="section-name">{section.section}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-sections">
                                            {searchQuery ? "No sections match your search" : "No sections found. Create your first section below."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="add-section-container">
                            {!selectedSection && (
                                <button onClick={() => setShowNewEntryForm(!showNewEntryForm)} className="add-section-btn">
                                    <PlusCircle size={16} />
                                    {showNewEntryForm ? "Cancel" : "Add New Section"}
                                </button>
                            )}
                            {showNewEntryForm && (
                                <div className="new-section-form">
                                    <h5 className="form-title"><PlusCircle size={16} /> Create New Section</h5>
                                    <input type="text" className="section-name-input" placeholder="Section Name"
                                        value={newSection} onChange={(e) => setNewSection(e.target.value)} />
                                    <textarea placeholder="Section Content" className="section-content-input"
                                        value={newText} onChange={(e) => setNewText(e.target.value)} />
                                    <button onClick={handleCreateNewEntry} className="save-new-section-btn">
                                        <Save size={16} /> Save New Section
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}