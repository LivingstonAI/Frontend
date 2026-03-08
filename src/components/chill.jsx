import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import { useNavigate } from "react-router-dom";
import {
    BookOpen, Bookmark, ChevronLeft, Edit2, Trash2,
    Volume2, VolumeX, PlusCircle, Folder, MessageSquare,
    Save, X, List, Grid, RefreshCw, Pause, Play, RotateCcw, Download, FileText
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
    pillSlate: { ...pillBase, background: 'linear-gradient(135deg,#475569,#1e293b)', color: '#fff', boxShadow: '0 2px 12px rgba(71,85,105,0.28)' },
    pillDisabled: { ...pillBase, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', border: '1.5px solid rgba(255,255,255,0.1)', cursor: 'not-allowed' },
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
    readerPanel: { background: 'rgba(0,0,0,0.06)', borderRadius: '12px', padding: '14px 18px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.1)' },
    readerLabel: { fontSize: '13px', fontWeight: 600, opacity: 0.6, display: 'flex', alignItems: 'center', gap: '5px', marginRight: '4px' },
    readerDivider: { width: '1px', height: '28px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' },
    wordHighlight: { background: '#fde047', color: '#1a1a2e', borderRadius: '3px', padding: '0 2px' },
};

// ─── Word-highlighted text renderer ──────────────────────────────────────────
function HighlightedText({ text, highlightIndex }) {
    const tokens = text.split(/(\s+)/);
    let wordIdx = 0;
    return (
        <>
            {tokens.map((token, i) => {
                if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
                const idx = wordIdx++;
                return (
                    <span key={i} style={idx === highlightIndex ? S.wordHighlight : undefined}>
                        {token}
                    </span>
                );
            })}
        </>
    );
}

function FormattedContent({ text, highlightWordIndex, isReading }) {
    let globalWordOffset = 0;
    return (
        <>
            {text.split('\n').map((line, i) => {
                line = line.trim();
                if (!line) return null;
                const cleanLine = line.replace(/^#{1,3}\s*/, '').replace(/^->\s*/, '');
                const wordsInLine = cleanLine.split(/\s+/).filter(Boolean).length;
                const lineOffset = globalWordOffset;
                globalWordOffset += wordsInLine;
                const localHighlight = (isReading && highlightWordIndex >= lineOffset && highlightWordIndex < lineOffset + wordsInLine)
                    ? highlightWordIndex - lineOffset : -1;
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

    // ── Reader state ──────────────────────────────────────────────────────────
    // readState: 'idle' | 'playing' | 'paused'
    const [readState, setReadState] = useState('idle');
    const [highlightWordIndex, setHighlightWordIndex] = useState(-1);
    // resumeCharOffset: the charIndex we were at when paused
    const resumeCharOffsetRef = useRef(0);
    const lastBoundaryCharRef = useRef(0); // tracks latest charIndex from onboundary

    // ── Download state ────────────────────────────────────────────────────────
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

    const messagesEndRef = useRef(null);
    const sectionTopRef = useRef(null);
    const navigate = useNavigate();
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Scroll to TOP when section opens
    useEffect(() => {
        if (selectedSection) {
            setTimeout(() => sectionTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }
    }, [selectedSection]);

    // Load browser voices
    useEffect(() => {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices.length) return;
            setAvailableVoices(voices);
            if (!selectedVoiceName) {
                const def = voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (def) { setSelectedVoiceName(def.name); try { localStorage.setItem(VOICE_STORAGE_KEY, def.name); } catch {} }
            }
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    const handleVoiceChange = (name) => {
        setSelectedVoiceName(name);
        try { localStorage.setItem(VOICE_STORAGE_KEY, name); } catch {}
        setShowVoiceSelector(false);
    };

    // ── Data fetching ─────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await fetch(`${baseUrl}/fetch-chill-sections`);
                const d = await r.json();
                if (r.ok) setSections(d.sections);
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
            hardStop();
            const r = await fetch(`${baseUrl}/fetch-chill-data?section=${encodeURIComponent(section.section)}`);
            const d = await r.json();
            if (r.ok) { setSelectedSection(d); setEditedText(d.text); }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleBack = () => {
        hardStop();
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
            const d = await r.json();
            if (r.ok) { setSelectedSection({ ...selectedSection, text: editedText }); setEditing(false); }
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
            const d = await r.json();
            if (r.ok) { setSections(sections.filter(s => s.section !== section)); setSelectedSection(null); setEditing(false); }
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
            const d = await r.json();
            if (r.ok) { setSections([...sections, { section: newSection }]); setNewSection(""); setNewText(""); setShowNewEntryForm(false); }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // ─── Speech engine ────────────────────────────────────────────────────────
    // cleanText: strips markdown, used for both TTS and word counting
    const cleanForSpeech = (raw) => raw.replace(/#{1,3}/g, '').replace(/->/g, '');

    const getVoice = () => {
        const v = window.speechSynthesis.getVoices();
        return v.find(x => x.name === selectedVoiceName) || v.find(x => x.lang.startsWith('en')) || v[0];
    };

    /**
     * Speak `text` starting from character offset `fromChar`.
     * This is the core function — pause/resume both use it by slicing the string.
     */
    const speakFrom = (text, fromChar = 0) => {
        window.speechSynthesis.cancel();
        const slice = text.slice(fromChar);
        if (!slice.trim()) { setReadState('idle'); setHighlightWordIndex(-1); return; }

        // Count words before fromChar so highlight index stays globally correct
        const wordsBefore = text.slice(0, fromChar).trim().split(/\s+/).filter(Boolean).length;

        const utt = new SpeechSynthesisUtterance(slice);
        const voice = getVoice();
        if (voice) utt.voice = voice;
        utt.volume = 1; utt.pitch = 1; utt.rate = 0.95;

        utt.onboundary = (e) => {
            if (e.name !== 'word') return;
            // Track absolute char position for pause/resume
            lastBoundaryCharRef.current = fromChar + e.charIndex;
            // Global word index = words before this slice + words into this slice
            const localWordsBefore = slice.slice(0, e.charIndex).trim().split(/\s+/).filter(Boolean).length;
            setHighlightWordIndex(wordsBefore + localWordsBefore);
        };
        utt.onend = () => {
            setReadState('idle');
            setHighlightWordIndex(-1);
            resumeCharOffsetRef.current = 0;
            lastBoundaryCharRef.current = 0;
        };
        utt.onerror = (e) => {
            if (e.error !== 'interrupted') console.error('Speech error:', e.error);
            setReadState('idle');
            setHighlightWordIndex(-1);
        };

        window.speechSynthesis.speak(utt);
        setReadState('playing');
    };

    const startReading = () => {
        if (!selectedSection) return;
        resumeCharOffsetRef.current = 0;
        lastBoundaryCharRef.current = 0;
        setHighlightWordIndex(0);
        speakFrom(cleanForSpeech(selectedSection.text), 0);
    };

    /**
     * Pause — Chrome's speechSynthesis.pause() is broken (it never fires resume correctly).
     * Fix: we cancel instead, but save the last known char offset so we can restart from there.
     */
    const pauseReading = () => {
        // Save where we are (last word boundary char)
        resumeCharOffsetRef.current = lastBoundaryCharRef.current;
        window.speechSynthesis.cancel(); // cancel instead of pause — Chrome-safe
        setReadState('paused');
    };

    /**
     * Resume — restart speech from the saved char offset.
     */
    const resumeReading = () => {
        if (!selectedSection) return;
        speakFrom(cleanForSpeech(selectedSection.text), resumeCharOffsetRef.current);
    };

    const restartReading = () => {
        resumeCharOffsetRef.current = 0;
        lastBoundaryCharRef.current = 0;
        if (!selectedSection) return;
        speakFrom(cleanForSpeech(selectedSection.text), 0);
    };

    const hardStop = () => {
        window.speechSynthesis.cancel();
        setReadState('idle');
        setHighlightWordIndex(-1);
        resumeCharOffsetRef.current = 0;
        lastBoundaryCharRef.current = 0;
    };

    // ─── PDF Export via backend ───────────────────────────────────────────────
    const exportPdf = async () => {
        if (isExportingPdf || !selectedSection) return;
        setIsExportingPdf(true);
        try {
            const r = await fetch(`${baseUrl}/chill/export-section-pdf/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: selectedSection.section, text: selectedSection.text }),
            });
            if (!r.ok) throw new Error('PDF export failed');
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedSection.section.replace(/\s+/g, '_')}_notes.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert('PDF export failed. Make sure the backend has reportlab installed.');
        } finally {
            setIsExportingPdf(false);
        }
    };

    // ─── TTS Audio Download via backend (gTTS) ────────────────────────────────
    const downloadAudio = async () => {
        if (isDownloadingAudio || !selectedSection) return;
        setIsDownloadingAudio(true);
        try {
            const r = await fetch(`${baseUrl}/chill/download-section-audio/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: selectedSection.section, text: selectedSection.text }),
            });
            if (!r.ok) throw new Error('TTS failed');
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedSection.section.replace(/\s+/g, '_')}_audio.mp3`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert('Audio download failed. Make sure the backend has gTTS installed (pip install gtts).');
        } finally {
            setIsDownloadingAudio(false);
        }
    };

    // ─── Chat ─────────────────────────────────────────────────────────────────
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
            const d = await r.json();
            setMessages(prev => [...prev, { role: "assistant", content: d.choices[0].message.content }]);
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
            const d = await r.json();
            if (r.ok) { setImageFolders(p => JSON.stringify(p) !== JSON.stringify(d.folders) ? d.folders : p); setImageProcess('View Trading Images'); }
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
                                <BookOpen className="icon" /> C.H.I.L.L Interface
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
                                        <div key={idx} style={msg.role === 'assistant' ? S.livingstonMsgAI : S.livingstonMsgUser}>{msg.content}</div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div style={S.livingstonInputRow}>
                                    <input style={S.livingstonInput} type="text" placeholder="Ask me something..."
                                        value={userInput} onChange={e => setUserInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") handleSendMessage(userInput); }} />
                                    <button style={S.livingstonSendBtn(!userInput.trim())} onClick={() => handleSendMessage(userInput)} disabled={!userInput.trim()}>Send</button>
                                </div>
                            </div>
                        )}

                        {/* ═══ IMAGE / SEARCH PANEL ═══ */}
                        {imageViewState && (
                            <div className="dashboard-section">
                                <div className="section-controls">
                                    <button onClick={fetchImages} className="control-btn image-btn">
                                        <RefreshCw size={16} className={imageProcess === 'Fetching Images...' ? 'spinning' : ''} /> {imageProcess}
                                    </button>
                                    <div style={S.toggleGroup}>
                                        <button style={{ ...S.toggleBtnBase, ...(viewMode === 'grid' ? S.toggleBtnActive : S.toggleBtnInactive) }} onClick={() => setViewMode('grid')}>
                                            <Grid size={15} /> Grid
                                        </button>
                                        <button style={{ ...S.toggleBtnBase, ...(viewMode === 'list' ? S.toggleBtnActive : S.toggleBtnInactive) }} onClick={() => setViewMode('list')}>
                                            <List size={15} /> List
                                        </button>
                                    </div>
                                </div>
                                {!selectedSection && (
                                    <div className="search-container">
                                        <input type="text" placeholder="Search sections..." value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)} className="search-input" />
                                    </div>
                                )}
                                {imageFolders && (
                                    <div className="image-folders">
                                        <h6 className="section-subheading"><Folder size={16} /> Image Folders</h6>
                                        <div className="folder-grid">
                                            {Object.keys(imageFolders).map((folder, i) => (
                                                <button key={i} onClick={() => { setSelectedFolder(folder); setFolderState(true); }} className="folder-btn">
                                                    <Folder size={16} /><span>{folder}</span>
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
                                    <h6><Folder size={16} /> {selectedFolder}</h6>
                                    <button onClick={() => setFolderState(false)} className="close-folder-btn"><X size={16} /></button>
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
                                    <button className="close-expanded-btn" onClick={() => setExpandedImage(null)}><X size={16} /></button>
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
                                {/* ── Header row ── */}
                                <div className="section-header">
                                    <h4 className="section-title">
                                        <Bookmark size={16} className="icon" /> {selectedSection.section}
                                    </h4>
                                    <div style={S.actionRow}>
                                        {/* Voice picker */}
                                        <div style={S.voicePickerWrap}>
                                            <button style={showVoiceSelector ? S.pillBlueOutline : S.pillGhost}
                                                onClick={() => setShowVoiceSelector(v => !v)} title={`Voice: ${selectedVoiceName || 'Default'}`}>
                                                <MicIcon size={15} /> {shortVoiceName}
                                            </button>
                                            {showVoiceSelector && (
                                                <div style={S.voiceDropdown}>
                                                    <div style={S.voiceDropdownHeader}>
                                                        <span>Choose Voice</span>
                                                        <button style={S.voiceCloseBtn} onClick={() => setShowVoiceSelector(false)}><X size={15} /></button>
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
                                        {!editing && <button style={S.pillBlue} onClick={() => setChatOpen(true)}><MessageSquare size={15} /> Ask Livingston</button>}
                                        {!editing && <button style={S.pillAmber} onClick={() => setEditing(true)}><Edit2 size={15} /> Edit</button>}
                                        {editing && <button style={S.pillGreen} onClick={handleSave}><Save size={15} /> Save</button>}
                                    </div>
                                </div>

                                {/* ── Reader controls bar ── */}
                                {!editing && (
                                    <div style={S.readerPanel}>
                                        <span style={S.readerLabel}><Volume2 size={14} /> Read Aloud</span>
                                        <div style={S.readerDivider} />

                                        {/* Play (only when idle) */}
                                        {readState === 'idle' && (
                                            <button style={S.pillTeal} onClick={startReading}><Play size={14} /> Play</button>
                                        )}
                                        {/* Pause (only when playing) */}
                                        {readState === 'playing' && (
                                            <button style={S.pillAmber} onClick={pauseReading}><Pause size={14} /> Pause</button>
                                        )}
                                        {/* Resume (only when paused) */}
                                        {readState === 'paused' && (
                                            <button style={S.pillTeal} onClick={resumeReading}><Play size={14} /> Resume</button>
                                        )}
                                        {/* Restart (when playing or paused) */}
                                        {readState !== 'idle' && (
                                            <button style={S.pillOrange} onClick={restartReading}><RotateCcw size={14} /> Restart</button>
                                        )}
                                        {/* Stop (when playing or paused) */}
                                        {readState !== 'idle' && (
                                            <button style={S.pillRed} onClick={hardStop}><VolumeX size={14} /> Stop</button>
                                        )}

                                        <div style={{ ...S.readerDivider, marginLeft: 'auto' }} />

                                        {/* PDF export */}
                                        <button
                                            style={isExportingPdf ? S.pillDisabled : S.pillPurple}
                                            onClick={exportPdf}
                                            disabled={isExportingPdf}
                                            title="Export as styled PDF"
                                        >
                                            <FileText size={14} />
                                            {isExportingPdf ? 'Exporting…' : 'Export PDF'}
                                        </button>

                                        {/* Audio download via gTTS backend */}
                                        <button
                                            style={isDownloadingAudio ? S.pillDisabled : S.pillSlate}
                                            onClick={downloadAudio}
                                            disabled={isDownloadingAudio}
                                            title="Download MP3 via Google TTS"
                                        >
                                            <Download size={14} />
                                            {isDownloadingAudio ? 'Generating…' : 'Download MP3'}
                                        </button>
                                    </div>
                                )}

                                {/* ── Section content ── */}
                                <div className="section-content">
                                    {editing ? (
                                        <textarea value={editedText} onChange={e => setEditedText(e.target.value)}
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
                                        <ChevronLeft size={15} /> Back to Sections
                                    </button>
                                    <div className="footer-actions">
                                        <button onClick={quizMe} className="footer-btn quiz-btn"><BrainIcon size={15} /> Quiz Me</button>
                                        <button onClick={() => handleDelete(selectedSection.section)} className="footer-btn delete-btn"><Trash2 size={15} /> Delete</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sections-view">
                                <div className={`sections-container ${viewMode}`}>
                                    {filteredSections.length > 0 ? (
                                        filteredSections.map((section, i) => (
                                            <div key={i} className="section-item" onClick={() => fetchSectionData(section)}>
                                                <Bookmark size={15} className="section-icon" />
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
                                    <PlusCircle size={15} /> {showNewEntryForm ? "Cancel" : "Add New Section"}
                                </button>
                            )}
                            {showNewEntryForm && (
                                <div className="new-section-form">
                                    <h5 className="form-title"><PlusCircle size={15} /> Create New Section</h5>
                                    <input type="text" className="section-name-input" placeholder="Section Name"
                                        value={newSection} onChange={e => setNewSection(e.target.value)} />
                                    <textarea placeholder="Section Content" className="section-content-input"
                                        value={newText} onChange={e => setNewText(e.target.value)} />
                                    <button onClick={handleCreateNewEntry} className="save-new-section-btn">
                                        <Save size={15} /> Save New Section
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