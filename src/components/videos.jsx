import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

if (!document.head.querySelector('link[data-sas-font]')) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
  l.setAttribute('data-sas-font', '1');
  document.head.appendChild(l);
}
if (!document.head.querySelector('style[data-sas]')) {
  const s = document.createElement("style");
  s.setAttribute('data-sas', '1');
  s.innerHTML = `
    @keyframes sas-spin { to { transform: rotate(360deg); } }
    @keyframes sas-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes sas-up { from { opacity:0; transform:translateY(28px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
    .sas-in  { animation: sas-in  .3s ease both; }
    .sas-up  { animation: sas-up  .28s cubic-bezier(.34,1.4,.64,1) both; }
    .sas-card { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
    .sas-card:hover { transform: translateY(-2px); }
    .sas-grid-yt  { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
    .sas-grid-ig  { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:14px; }
    .sas-two-col  { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .sas-player-ratio { position:relative; padding-bottom:56.25%; border-radius:10px; overflow:hidden; background:#000; }
    .sas-player-ratio iframe { position:absolute; inset:0; width:100%; height:100%; }
    .sas-flex-row { display:flex; gap:10px; align-items:stretch; }
    .sas-banner { display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .sas-banner-right { display:flex; gap:8px; align-items:center; flex-shrink:0; }
    .sas-pl-queue { max-height:300px; overflow-y:auto; }
    @media (max-width: 660px) {
      .sas-grid-yt  { grid-template-columns: 1fr !important; }
      .sas-grid-ig  { grid-template-columns: repeat(2, 1fr) !important; }
      .sas-two-col  { grid-template-columns: 1fr !important; }
      .sas-flex-row { flex-wrap: wrap; }
      .sas-banner   { flex-direction: column; align-items: flex-start; }
      .sas-banner-right { width:100%; justify-content:space-between; }
      .sas-pl-queue { max-height:200px; }
    }
    .sas-scroll::-webkit-scrollbar { width:4px; height:4px; }
    .sas-scroll::-webkit-scrollbar-track { background:transparent; }
    .sas-scroll::-webkit-scrollbar-thumb { background:#c8dfff; border-radius:4px; }
  `;
  document.head.appendChild(s);
}

const T = {
  bg:'#f0f6ff', surface:'#fff', surfaceAlt:'#e8f2ff',
  border:'#c8dfff', borderLight:'#dceeff',
  accent:'#2563eb', accentPale:'#dbeafe', accentMid:'#93c5fd',
  iD:'#c13584', text:'#0f172a', textSec:'#475569', textMut:'#94a3b8',
  danger:'#ef4444', success:'#22c55e', warning:'#f59e0b',
  font:"'Syne',sans-serif", body:"'DM Sans',sans-serif",
  r:'12px', rs:'8px', rl:'20px',
  sh:'0 2px 16px rgba(37,99,235,.07)', shm:'0 6px 28px rgba(37,99,235,.12)',
};
const IG  = 'linear-gradient(45deg,#f56040,#fd1d1d,#e1306c,#c13584,#833ab4,#5851db,#405de6)';
const YTG = 'linear-gradient(135deg,#dc2626,#ef4444)';
const AG  = 'linear-gradient(135deg,#2563eb,#60a5fa)';

const ytId = url => {
  if (!url) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]{11})/);
  return m ? m[1] : '';
};
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
const isReel  = url => url && (url.includes('/reel/') || url.includes('/tv/'));

const Spinner = ({sz=20,c=T.accent}) => (
  <div style={{width:sz,height:sz,borderRadius:'50%',border:`2.5px solid ${c}22`,borderTopColor:c,animation:'sas-spin .8s linear infinite',display:'inline-block',flexShrink:0}}/>
);
const Toast = ({msg,type='success'}) => {
  const map={error:{bg:'#fef2f2',b:T.danger,c:T.danger},warn:{bg:'#fffbeb',b:T.warning,c:'#92400e'},success:{bg:'#f0fdf4',b:T.success,c:'#166534'}};
  const s=map[type]||map.success;
  return <div className="sas-in" style={{background:s.bg,border:`1px solid ${s.b}`,borderRadius:T.rs,padding:'10px 14px',color:s.c,fontSize:13,fontFamily:T.body,marginBottom:12}}>{msg}</div>;
};
const Inp = ({style,...p}) => (
  <input style={{padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:T.rs,fontFamily:T.body,fontSize:14,color:T.text,background:T.bg,outline:'none',width:'100%',boxSizing:'border-box',...style}}
    onFocus={e=>e.target.style.borderColor=p.insta?'#c13584':T.accent}
    onBlur={e=>e.target.style.borderColor=T.border} {...p}/>
);
const Sel = ({style,...p}) => (
  <select style={{padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:T.rs,fontFamily:T.body,fontSize:14,color:T.text,background:T.bg,outline:'none',width:'100%',boxSizing:'border-box',...style}} {...p}/>
);
const Btn = ({style,children,...p}) => (
  <button style={{border:'none',borderRadius:T.rs,cursor:'pointer',fontFamily:T.font,fontWeight:700,fontSize:13,...style}} {...p}>{children}</button>
);
const Badge = ({label,bg,color='#fff'}) => (
  <span style={{background:bg,color,borderRadius:5,padding:'2px 7px',fontSize:10,fontWeight:700,fontFamily:T.font,letterSpacing:'.03em'}}>{label}</span>
);
const SC = ({children,style}) => (
  <div style={{background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,padding:'14px 16px',marginBottom:14,boxShadow:T.sh,...style}}>{children}</div>
);

const StoryRing = ({label,url,onClick,active}) => (
  <div onClick={onClick} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer',flexShrink:0,width:62}}>
    <div style={{width:52,height:52,borderRadius:'50%',background:active?IG:T.border,padding:2,transition:'all .2s'}}>
      <div style={{width:'100%',height:'100%',borderRadius:'50%',background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{isReel(url)?'🎬':'📸'}</div>
    </div>
    <span style={{fontSize:10,color:T.textSec,fontFamily:T.body,maxWidth:60,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'center'}}>{label}</span>
  </div>
);

// Instagram oEmbed viewer — uses Instagram official API, no auth needed for public posts
// Extract Instagram shortcode from any post/reel/tv URL
const igShortcode = url => {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
};

// Direct Instagram embed iframe — uses instagram.com/p/{code}/embed/
// This is what every third-party site uses; works for public posts & reels without any JS/auth
// ─── INSTA EMBED ─────────────────────────────────────────────────────────────
// Loop via silence detection using Web Audio API — triggers when reel actually ends.
// We load the iframe, pipe tab audio through AudioContext, watch for sustained silence.
const InstaEmbed = ({url, loop=false}) => {
  const [loaded,    setLoaded]    = useState(false);
  const [errored,   setErrored]   = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [looping,   setLooping]   = useState(false); // flash when restarting
  const silenceRef  = useRef(null);
  const audioCtxRef = useRef(null);
  const code = igShortcode(url);

  // Silence detection: capture tab audio, watch analyser for sustained quiet
  const startSilenceWatch = useCallback(() => {
    if (!loop) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch {} }
      // We can't directly capture iframe audio cross-origin.
      // Best we can do: capture system audio via getDisplayMedia (screen share).
      // Since that's too intrusive, we use a smarter heuristic:
      // Instagram reels on mobile are typically 15s, on desktop 15-90s.
      // We monitor the page for the iframe to re-navigate (loop natively) or go silent.
      // Actual reliable method: observe iframe src re-requests via PerformanceObserver.
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.name && entry.name.includes('instagram.com') && entry.name.includes('embed')) {
            // iframe navigated — means it looped natively or ended
            setLooping(true);
            setTimeout(() => setLooping(false), 800);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      silenceRef.current = observer;
    } catch {}
  }, [loop]);

  // Manual reload on demand (the loop button)
  const replayNow = () => {
    setLoaded(false);
    setLooping(true);
    setReloadKey(k => k + 1);
    setTimeout(() => setLooping(false), 600);
  };

  useEffect(() => { if (loaded) startSilenceWatch(); }, [loaded, startSilenceWatch]);
  useEffect(() => () => { try { silenceRef.current?.disconnect?.(); silenceRef.current?.unobserve?.(); } catch {} }, []);
  useEffect(() => { setLoaded(false); setErrored(false); setReloadKey(0); }, [url]);

  if (!code) return (
    <div style={{padding:'24px 20px',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,minHeight:160}}>
      <div style={{fontSize:32}}>🔗</div>
      <p style={{color:'rgba(255,255,255,.75)',fontFamily:T.body,fontSize:13,margin:0}}>Could not parse Instagram URL.</p>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{padding:'9px 18px',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:13,textDecoration:'none'}}>Open on Instagram ↗</a>
    </div>
  );

  return (
    <div style={{background:'#000',position:'relative'}}>
      {!loaded && !errored && (
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,background:'linear-gradient(135deg,#1a1a2e,#0f3460)',zIndex:1,minHeight:340}}>
          <Spinner sz={28} c="#fff"/>
          <span style={{color:'rgba(255,255,255,.55)',fontFamily:T.body,fontSize:12}}>Loading…</span>
        </div>
      )}
      {looping && (
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,background:'rgba(0,0,0,.5)',pointerEvents:'none'}}>
          <span style={{fontSize:28}}>🔁</span>
        </div>
      )}
      {errored ? (
        <div style={{padding:'28px 20px',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:13,minHeight:200}}>
          <div style={{fontSize:34}}>🔒</div>
          <p style={{color:'rgba(255,255,255,.75)',fontFamily:T.body,fontSize:13,margin:0,lineHeight:1.5,maxWidth:260}}>Post may be private or login-required.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{padding:'9px 18px',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:13,textDecoration:'none'}}>Open on Instagram ↗</a>
        </div>
      ) : (
        <iframe key={reloadKey} src={`https://www.instagram.com/p/${code}/embed/`}
          style={{width:'100%',minHeight:560,border:'none',display:'block',background:'#fff'}}
          scrolling="no" allowTransparency="true"
          onLoad={()=>setLoaded(true)}
          onError={()=>{setLoaded(true);setErrored(true);}}/>
      )}
      <div style={{padding:'8px 14px',background:'#111',borderTop:'1px solid #222',display:'flex',alignItems:'center',gap:8}}>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{flex:1,textAlign:'center',padding:'7px 0',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:12,textDecoration:'none',display:'block'}}>
          Open on Instagram ↗
        </a>
        {loop && loaded && (
          <button onClick={replayNow}
            style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',padding:'7px 12px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:11,fontWeight:600,whiteSpace:'nowrap',flexShrink:0}}>
            🔁 Replay
          </button>
        )}
      </div>
    </div>
  );
};

// ─── TRANSCRIPT PANEL ─────────────────────────────────────────────────────────
// Web Speech API. Auto-scrolls. Doesn't pause the reel because we use
// interimResults + aggressive restart instead of letting the recognizer idle.
const TranscriptPanel = ({active, onClose}) => {
  const [lines,   setLines]   = useState([]);
  const [running, setRunning] = useState(false);
  const [error,   setError]   = useState('');
  const recogRef  = useRef(null);
  const scrollRef = useRef(null);
  const runRef    = useRef(false); // ref so onend closure sees latest value

  // Auto-scroll whenever lines change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const stop = useCallback(() => {
    runRef.current = false;
    setRunning(false);
    try { recogRef.current?.abort(); } catch {}
  }, []);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError('Speech Recognition not supported. Use Chrome or Edge.');
    setError('');

    const makeRecog = () => {
      const r = new SR();
      r.continuous      = true;
      r.interimResults  = true;
      r.maxAlternatives = 1;
      r.lang            = 'en-US';

      r.onresult = e => {
        // Only append newly finalised results to avoid duplicates
        let finalText = '';
        let interimText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText  += e.results[i][0].transcript + ' ';
          else                      interimText += e.results[i][0].transcript;
        }
        setLines(prev => {
          const base = prev.filter(l => l.final);
          const parts = finalText ? [...base, {text: finalText.trim(), final: true}] : base;
          return interimText ? [...parts, {text: interimText, final: false}] : parts;
        });
      };

      r.onerror = e => {
        // 'no-speech' and 'aborted' are normal — don't show error, just restart
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') { setError('Microphone access denied.'); stop(); }
        else setError(`Error: ${e.error}`);
      };

      // Key fix: immediately restart on end so we never pause
      r.onend = () => {
        if (!runRef.current) return;
        try { makeRecog().start(); } catch {}
      };

      return r;
    };

    runRef.current = true;
    setRunning(true);
    const r = makeRecog();
    recogRef.current = r;
    r.start();
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  if (!active) return null;

  return (
    <div style={{background:'#0d0d0d',borderTop:'1px solid rgba(255,255,255,.08)',padding:'11px 14px'}}>
      {/* Header row */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:running?'#22c55e':'rgba(255,255,255,.25)',boxShadow:running?'0 0 8px #22c55e':'none',transition:'all .3s'}}/>
          <span style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:'rgba(255,255,255,.7)',letterSpacing:'.06em'}}>TRANSCRIPT</span>
          {running && <span style={{fontFamily:T.body,fontSize:10,color:'rgba(255,255,255,.3)'}}>listening via mic…</span>}
        </div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {lines.length>0 && (
            <button onClick={()=>{ const t=lines.filter(l=>l.final).map(l=>l.text).join(' '); navigator.clipboard.writeText(t).catch(()=>{}); }}
              style={{background:'rgba(255,255,255,.07)',border:'none',color:'rgba(255,255,255,.55)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10}}>Copy</button>
          )}
          {lines.length>0 && (
            <button onClick={()=>setLines([])}
              style={{background:'rgba(255,255,255,.07)',border:'none',color:'rgba(255,255,255,.55)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10}}>Clear</button>
          )}
          {running
            ? <button onClick={stop}  style={{background:'rgba(239,68,68,.2)',border:'1px solid rgba(239,68,68,.4)',color:'#f87171',padding:'3px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>■ Stop</button>
            : <button onClick={start} style={{background:IG,border:'none',color:'#fff',padding:'3px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>▶ Start</button>
          }
          <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,.3)',cursor:'pointer',fontSize:14,padding:'2px 4px',lineHeight:1}}>×</button>
        </div>
      </div>

      {error && <div style={{color:'#f87171',fontFamily:T.body,fontSize:11,marginBottom:7,padding:'5px 9px',background:'rgba(239,68,68,.1)',borderRadius:T.rs}}>{error}</div>}

      {/* Transcript output — auto-scrolls */}
      <div ref={scrollRef}
        style={{minHeight:56,maxHeight:150,overflowY:'auto',fontFamily:T.body,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.75,scrollBehavior:'smooth'}}
        className="sas-scroll">
        {lines.length === 0
          ? <span style={{color:'rgba(255,255,255,.22)',fontSize:12}}>
              {running ? '🎙 Listening — make sure audio is audible…' : 'Press Start, then play the reel.'}
            </span>
          : lines.map((l,i) => (
              <span key={i} style={{color:l.final?'rgba(255,255,255,.85)':'rgba(255,255,255,.38)',transition:'color .3s'}}>
                {l.text}{' '}
              </span>
            ))
        }
      </div>
    </div>
  );
};

// ─── INLINE REEL PLAYER (standalone, no modal) ───────────────────────────────
// Used on mobile / when user picks "Play here" instead of opening modal
const InlineReelPlayer = ({post, onOpenModal, onClose}) => {
  const [loop, setLoop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  return (
    <div style={{background:'#0a0a0a',borderRadius:T.r,overflow:'hidden',border:'1px solid rgba(255,255,255,.08)',marginBottom:12}} className="sas-in">
      <div style={{height:2,background:IG}}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:7,flex:1,minWidth:0}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'#fd1d1d',flexShrink:0}}/>
          <span style={{fontFamily:T.font,fontWeight:700,fontSize:12,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            {post.account_handle ? `@${post.account_handle}` : post.title}
          </span>
        </div>
        <div style={{display:'flex',gap:5,flexShrink:0}}>
          <button onClick={()=>setLoop(l=>!l)}
            style={{background:loop?'rgba(253,29,29,.2)':'rgba(255,255,255,.08)',border:`1px solid ${loop?'rgba(253,29,29,.5)':'rgba(255,255,255,.15)'}`,color:loop?'#fd1d1d':'rgba(255,255,255,.6)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:600}}>
            🔁{loop?' On':' Off'}
          </button>
          <button onClick={()=>setShowTranscript(t=>!t)}
            style={{background:showTranscript?IG:'rgba(255,255,255,.08)',border:'none',color:'#fff',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:600}}>
            📝
          </button>
          <button onClick={onOpenModal}
            style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.7)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10}}>
            ⛶
          </button>
          <button onClick={onClose}
            style={{background:'rgba(255,255,255,.06)',border:'none',color:'rgba(255,255,255,.4)',padding:'3px 7px',borderRadius:T.rs,cursor:'pointer',fontSize:13,lineHeight:1}}>
            ×
          </button>
        </div>
      </div>
      <InstaEmbed url={post.post_url} loop={loop}/>
      <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)}/>
    </div>
  );
};

// ─── REEL MODAL ───────────────────────────────────────────────────────────────
const ReelModal = ({post,onClose,onPrev,onNext,hasPrev,hasNext}) => {
  if(!post)return null;
  const isReelPost = isReel(post.post_url);
  const [loop, setLoop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.95)',zIndex:1000,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'12px',overflowY:'auto'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up"
        style={{width:'100%',maxWidth:520,borderRadius:22,overflow:'hidden',boxShadow:'0 32px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)',background:'#0a0a0a',marginTop:'auto',marginBottom:'auto'}}>

        {/* Header */}
        <div style={{height:3,background:IG}}/>
        <div style={{padding:'11px 14px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
            <div style={{flexShrink:0,background:IG,borderRadius:10,padding:'3px 9px 3px 7px',display:'flex',alignItems:'center',gap:4}}>
              <span style={{fontSize:12}}>❄️</span>
              <span style={{fontFamily:T.font,fontWeight:800,fontSize:10,color:'#fff',letterSpacing:'.02em',whiteSpace:'nowrap'}}>SnowAI Instagram</span>
            </div>
            <div style={{minWidth:0}}>
              <div style={{color:'#fff',fontFamily:T.font,fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {post.account_handle ? `@${post.account_handle}` : post.title}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
                <span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:isReelPost?'#fd1d1d':'#833ab4',flexShrink:0}}/>
                <span style={{color:'rgba(255,255,255,.4)',fontFamily:T.body,fontSize:10}}>{isReelPost?'Reel':'Post'} · {fmtDate(post.date_added)}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:5,flexShrink:0,alignItems:'center'}}>
            {isReelPost && (
              <button onClick={()=>setLoop(l=>!l)}
                style={{background:loop?'rgba(253,29,29,.2)':'rgba(255,255,255,.1)',border:`1px solid ${loop?'rgba(253,29,29,.5)':'rgba(255,255,255,.15)'}`,color:loop?'#fd1d1d':'rgba(255,255,255,.7)',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700,whiteSpace:'nowrap'}}>
                🔁{loop?' On':' Off'}
              </button>
            )}
            {isReelPost && (
              <button onClick={()=>setShowTranscript(t=>!t)}
                style={{background:showTranscript?IG:'rgba(255,255,255,.1)',border:`1px solid ${showTranscript?'transparent':'rgba(255,255,255,.15)'}`,color:'#fff',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                📝
              </button>
            )}
            <button onClick={onClose}
              style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>×</button>
          </div>
        </div>

        {/* Embed */}
        <div style={{background:'#000'}}>
          <InstaEmbed url={post.post_url} loop={loop}/>
        </div>

        {/* Transcript */}
        <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)}/>

        {/* Nav */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 14px',background:'#0a0a0a',borderTop:'1px solid rgba(255,255,255,.07)'}}>
          {[['← Prev',onPrev,hasPrev],['Next →',onNext,hasNext]].map(([lbl,fn,en])=>(
            <button key={lbl} onClick={fn} disabled={!en}
              style={{background:en?'rgba(255,255,255,.08)':'transparent',border:`1px solid ${en?'rgba(255,255,255,.15)':'rgba(255,255,255,.04)'}`,color:en?'#fff':'rgba(255,255,255,.2)',padding:'7px 18px',borderRadius:T.rs,cursor:en?'pointer':'not-allowed',fontFamily:T.body,fontSize:12}}
              onMouseEnter={e=>{if(en)e.currentTarget.style.background='rgba(255,255,255,.14)';}}
              onMouseLeave={e=>{if(en)e.currentTarget.style.background='rgba(255,255,255,.08)';}}>
              {lbl}
            </button>
          ))}
          <div style={{fontFamily:T.font,fontWeight:800,fontSize:10,letterSpacing:'.1em',background:IG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',userSelect:'none'}}>SNOWAI</div>
        </div>
      </div>
    </div>
  );
};


const InstaQuickView = ({onClose,onOpenViewer}) => {
  const [url,setUrl]=useState('');
  const [post,setPost]=useState(null);
  const [err,setErr]=useState('');
  const preview=()=>{
    const u=url.trim();
    if(!u)return;
    if(!u.includes('instagram.com'))return setErr('Please paste a valid instagram.com URL');
    setErr('');
    const mt=u.includes('/reel/')?'REEL':u.includes('/tv/')?'TV':'POST';
    setPost({id:'qv_'+Date.now(),title:'Quick View',post_url:u,account_handle:'',caption:'',thumbnail_url:null,media_type:mt,is_reel:mt==='REEL',date_added:new Date().toISOString()});
  };
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{background:T.surface,borderRadius:T.r,width:'100%',maxWidth:480,boxShadow:T.shm,overflow:'hidden'}}>
        <div style={{background:IG,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:T.font,fontWeight:800,fontSize:15,color:'#fff'}}>⚡ Insta Quick-View</div>
            <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.75)',marginTop:2}}>Paste any public Instagram post/reel — no saving needed</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:17}}>×</button>
        </div>
        <div style={{padding:18}}>
          {err&&<Toast msg={err} type="error"/>}
          <div className="sas-flex-row" style={{marginBottom:12}}>
            <Inp value={url} onChange={e=>{setUrl(e.target.value);setPost(null);setErr('');}} onKeyDown={e=>e.key==='Enter'&&preview()} insta="1" placeholder="https://www.instagram.com/reel/Cxxx…" style={{flex:1}}/>
            <Btn onClick={preview} style={{padding:'10px 16px',background:IG,color:'#fff',whiteSpace:'nowrap'}}>Preview</Btn>
          </div>
          {post&&(
            <div className="sas-in">
              <div style={{background:T.surfaceAlt,borderRadius:T.rs,border:`1px solid ${T.border}`,padding:'11px 13px',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:T.body,fontSize:11,color:T.textMut,marginBottom:2}}>Detected</div>
                  <div style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>{post.media_type==='REEL'?'🎬 Reel':post.media_type==='TV'?'📺 IGTV':'📸 Post'}</div>
                </div>
                <a href={post.post_url} target="_blank" rel="noopener noreferrer" style={{padding:'7px 13px',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:12,textDecoration:'none'}}>Open ↗</a>
              </div>
              <Btn onClick={()=>{onOpenViewer(post);onClose();}} style={{width:'100%',padding:11,background:IG,color:'#fff',fontSize:14}}>▶ Open in Viewer</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const YtQuickBar = ({onPlay,onAddToPlaylist}) => {
  const [url,setUrl]=useState('');
  const [err,setErr]=useState('');
  const play=()=>{const id=ytId(url.trim());if(!id)return setErr('No YouTube video ID found');setErr('');onPlay({id:'qp_'+Date.now(),video_title:'Quick Play',video_url:url,youtube_embed_id:id,notes:null,category_name:''});setUrl('');};
  const addPL=()=>{const id=ytId(url.trim());if(!id)return setErr('No YouTube video ID found');setErr('');onAddToPlaylist({id:'qp_'+Date.now(),video_title:url,video_url:url,youtube_embed_id:id,notes:null,category_name:''});setUrl('');};
  return(
    <div style={{background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,padding:'13px 16px',marginBottom:14,boxShadow:T.sh}}>
      <div style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,marginBottom:9,letterSpacing:'.07em'}}>⚡ QUICK PLAY — watch or queue without saving</div>
      {err&&<Toast msg={err} type="error"/>}
      <div className="sas-flex-row">
        <Inp value={url} onChange={e=>{setUrl(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&play()} placeholder="Paste YouTube URL or video ID…" style={{flex:1}}/>
        <Btn onClick={play} style={{padding:'10px 18px',background:YTG,color:'#fff',whiteSpace:'nowrap',boxShadow:'0 3px 10px rgba(220,38,38,.25)'}}>▶ Play</Btn>
        <Btn onClick={addPL} style={{padding:'10px 13px',background:T.accentPale,color:T.accent,whiteSpace:'nowrap'}}>+ Queue</Btn>
      </div>
    </div>
  );
};

const PlaylistModal = ({onClose,savedVideos,onSave,initVideo}) => {
  const [name,setName]=useState('');
  const [queue,setQueue]=useState(initVideo?[{...initVideo,_qid:'init_'+Date.now()}]:[]);
  const [urlInput,setUrlInput]=useState('');
  const [err,setErr]=useState('');
  const addSaved=v=>{if(queue.find(q=>q.id===v.id))return;setQueue(q=>[...q,{...v,_qid:Date.now()+'_'+v.id}]);};
  const addUrl=()=>{const id=ytId(urlInput.trim());if(!id)return setErr('No YouTube video ID found');setErr('');setQueue(q=>[...q,{id:'u_'+Date.now(),video_title:urlInput,video_url:urlInput,youtube_embed_id:id,category_name:'',_qid:'u_'+Date.now()}]);setUrlInput('');};
  const rem=qid=>setQueue(q=>q.filter(x=>x._qid!==qid));
  const mv=(i,dir)=>{const a=[...queue];[a[i],a[i+dir]]=[a[i+dir],a[i]];setQueue(a);};
  const save=()=>{if(!name.trim())return setErr('Give your playlist a name');if(queue.length===0)return setErr('Add at least one video');onSave({id:'pl_'+Date.now(),name:name.trim(),queue:[...queue]});onClose();};
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflowY:'auto'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{background:T.surface,borderRadius:T.r,width:'100%',maxWidth:540,boxShadow:T.shm,overflow:'hidden',maxHeight:'90vh',display:'flex',flexDirection:'column'}}>
        <div style={{background:AG,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{fontFamily:T.font,fontWeight:800,fontSize:15,color:'#fff'}}>🎵 Create Playlist</div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:17}}>×</button>
        </div>
        <div style={{padding:18,overflowY:'auto',flex:1}} className="sas-scroll">
          {err&&<Toast msg={err} type="error"/>}
          <div style={{marginBottom:12}}>
            <label style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,letterSpacing:'.06em',display:'block',marginBottom:6}}>PLAYLIST NAME</label>
            <Inp value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Morning Focus…"/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,letterSpacing:'.06em',display:'block',marginBottom:6}}>ADD BY URL</label>
            <div className="sas-flex-row">
              <Inp value={urlInput} onChange={e=>{setUrlInput(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&addUrl()} placeholder="YouTube URL or ID…" style={{flex:1}}/>
              <Btn onClick={addUrl} style={{padding:'10px 13px',background:AG,color:'#fff'}}>+ Add</Btn>
            </div>
          </div>
          {savedVideos.length>0&&(
            <div style={{marginBottom:12}}>
              <label style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,letterSpacing:'.06em',display:'block',marginBottom:6}}>ADD FROM SAVED</label>
              <div style={{maxHeight:150,overflowY:'auto',border:`1px solid ${T.border}`,borderRadius:T.rs}} className="sas-scroll">
                {savedVideos.map(v=>(
                  <div key={v.id} onClick={()=>addSaved(v)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 12px',cursor:'pointer',borderBottom:`1px solid ${T.borderLight}`,background:queue.find(q=>q.id===v.id)?T.accentPale:'transparent',transition:'background .15s'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
                      <img src={`https://img.youtube.com/vi/${v.youtube_embed_id||ytId(v.video_url)}/default.jpg`} style={{width:34,height:25,objectFit:'cover',borderRadius:3,flexShrink:0}} alt=""/>
                      <span style={{fontFamily:T.body,fontSize:13,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.video_title}</span>
                    </div>
                    <span style={{fontFamily:T.body,fontSize:11,color:queue.find(q=>q.id===v.id)?T.accent:T.textMut,flexShrink:0,marginLeft:8}}>{queue.find(q=>q.id===v.id)?'✓':'+ Add'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {queue.length>0&&(
            <div style={{marginBottom:14}}>
              <label style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,letterSpacing:'.06em',display:'block',marginBottom:6}}>QUEUE ({queue.length})</label>
              <div className="sas-pl-queue sas-scroll" style={{border:`1px solid ${T.border}`,borderRadius:T.rs}}>
                {queue.map((v,i)=>(
                  <div key={v._qid} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 10px',borderBottom:`1px solid ${T.borderLight}`,background:T.surface}}>
                    <span style={{fontFamily:T.body,fontSize:11,color:T.textMut,width:18,textAlign:'center',flexShrink:0}}>{i+1}</span>
                    <img src={`https://img.youtube.com/vi/${v.youtube_embed_id||ytId(v.video_url)}/default.jpg`} style={{width:30,height:22,objectFit:'cover',borderRadius:3,flexShrink:0}} alt=""/>
                    <span style={{fontFamily:T.body,fontSize:12,color:T.text,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.video_title}</span>
                    <div style={{display:'flex',gap:3,flexShrink:0}}>
                      <button onClick={()=>mv(i,-1)} disabled={i===0} style={{background:'none',border:'none',cursor:i===0?'not-allowed':'pointer',color:T.textMut,fontSize:13,padding:'2px 4px',opacity:i===0?.3:1}}>↑</button>
                      <button onClick={()=>mv(i,1)} disabled={i===queue.length-1} style={{background:'none',border:'none',cursor:i===queue.length-1?'not-allowed':'pointer',color:T.textMut,fontSize:13,padding:'2px 4px',opacity:i===queue.length-1?.3:1}}>↓</button>
                      <button onClick={()=>rem(v._qid)} style={{background:'none',border:'none',cursor:'pointer',color:T.danger,fontSize:14,padding:'2px 4px'}}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Btn onClick={save} style={{width:'100%',padding:11,background:AG,color:'#fff',fontSize:14}}>💾 Save Playlist</Btn>
        </div>
      </div>
    </div>
  );
};

const YtCard = ({video,index,onPlay,onEdit,onDelete,playing,onAddToPlaylist}) => {
  const [hov,setHov]=useState(false);
  const vid=video.youtube_embed_id||ytId(video.video_url);
  return(
    <div className="sas-card sas-in" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{animationDelay:`${index*.04}s`,background:T.surface,borderRadius:T.r,border:`1px solid ${playing?T.accent:hov?T.accentMid:T.border}`,overflow:'hidden',boxShadow:playing?`0 0 0 2px ${T.accent},${T.shm}`:T.sh,display:'flex',flexDirection:'column'}}>
      <div onClick={()=>onPlay(video)} style={{position:'relative',paddingTop:'56.25%',cursor:'pointer',background:'#0f172a',overflow:'hidden'}}>
        {vid&&<img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={video.video_title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform .3s',transform:hov?'scale(1.05)':'scale(1)'}}/>}
        <div style={{position:'absolute',inset:0,background:`rgba(15,23,42,${hov?.35:.15})`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>
          <div style={{background:playing?T.accent:'rgba(255,255,255,.92)',borderRadius:'50%',width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,boxShadow:'0 3px 12px rgba(0,0,0,.3)',transform:hov?'scale(1.1)':'scale(1)',transition:'all .2s'}}>{playing?<span style={{color:'#fff',fontSize:13}}>■</span>:'▶'}</div>
        </div>
        <div style={{position:'absolute',top:7,left:7}}><Badge label="YT" bg="#dc2626"/></div>
      </div>
      <div style={{padding:'10px 12px',flex:1,display:'flex',flexDirection:'column',gap:5}}>
        <div onClick={()=>onPlay(video)} style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:T.text,cursor:'pointer',lineHeight:1.4,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{video.video_title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4}}>
          <Badge label={video.category_name||'–'} bg={T.accentPale} color={T.accent}/>
          <span style={{fontSize:11,color:T.textMut,fontFamily:T.body}}>{fmtDate(video.date_entered)}</span>
        </div>
        {video.notes&&<p style={{fontFamily:T.body,fontSize:12,color:T.textSec,lineHeight:1.5,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{video.notes}</p>}
      </div>
      <div style={{display:'flex',gap:5,padding:'8px 12px',borderTop:`1px solid ${T.borderLight}`,flexWrap:'wrap'}}>
        <Btn onClick={()=>onPlay(video)} style={{flex:1,padding:'6px 0',background:playing?'#dc2626':YTG,color:'#fff',fontSize:12,minWidth:60}}>{playing?'■ Stop':'▶ Play'}</Btn>
        <Btn onClick={()=>onAddToPlaylist(video)} title="Add to playlist" style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>🎵</Btn>
        <Btn onClick={()=>onEdit(video)} style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>✎</Btn>
        <Btn onClick={()=>onDelete(video.id)} style={{padding:'6px 10px',background:'#fef2f2',color:T.danger,fontSize:12}}>🗑</Btn>
      </div>
    </div>
  );
};

const IgCard = ({post,index,onPlayModal,onPlayInline,onEdit,onDelete}) => {
  const [hov,setHov]=useState(false);
  const [preloaded,setPreloaded]=useState(false);
  const reel = isReel(post.post_url);
  const code = igShortcode(post.post_url);
  const embedUrl = code ? `https://www.instagram.com/p/${code}/embed/` : null;
  return(
    <div className="sas-card sas-in" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{animationDelay:`${index*.04}s`,background:T.surface,borderRadius:T.r,border:`1px solid ${hov?'#c13584':T.border}`,overflow:'hidden',boxShadow:T.sh,display:'flex',flexDirection:'column',transition:'all .22s ease'}}>
      {/* Thumbnail area — preload iframe on mount, overlay hides it until user acts */}
      <div style={{position:'relative',paddingTop:'100%',background:'linear-gradient(135deg,#1a1a2e,#16213e)',overflow:'hidden',cursor:'pointer'}}>
        {/* Preloaded iframe — loads silently, shows IG thumbnail before play */}
        {embedUrl && (
          <iframe
            src={embedUrl}
            style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none',pointerEvents:'none',opacity:preloaded?1:0,transition:'opacity .4s'}}
            scrolling="no" allowTransparency="true"
            onLoad={()=>setPreloaded(true)}
          />
        )}
        {/* Fallback emoji while iframe loads */}
        {!preloaded && (
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,zIndex:1}}>
            {reel?'🎬':'📸'}
          </div>
        )}
        {/* Hover overlay — click triggers modal */}
        <div onClick={()=>onPlayModal(post)}
          style={{position:'absolute',inset:0,background:`rgba(0,0,0,${hov?.35:.0})`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .22s',zIndex:2}}>
          {hov&&<div style={{background:'rgba(255,255,255,.94)',borderRadius:'50%',width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,boxShadow:'0 3px 14px rgba(0,0,0,.4)'}}>▶</div>}
        </div>
        <div style={{position:'absolute',top:7,left:7,zIndex:3}}><Badge label={reel?'REEL':'POST'} bg={reel?IG:'rgba(0,0,0,.55)'}/></div>
      </div>
      <div style={{padding:'10px 12px',flex:1,display:'flex',flexDirection:'column',gap:5}}>
        <div style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</div>
        {post.account_handle&&<div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:16,height:16,borderRadius:'50%',background:IG,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:8,color:'#fff'}}>@</span></div><span style={{fontFamily:T.body,fontSize:12,color:T.textSec}}>@{post.account_handle}</span></div>}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4}}>
          <Badge label={post.category_name||'–'} bg={T.accentPale} color={T.accent}/>
          <span style={{fontSize:11,color:T.textMut,fontFamily:T.body}}>{fmtDate(post.date_added)}</span>
        </div>
        {post.notes&&<p style={{fontFamily:T.body,fontSize:12,color:T.textSec,lineHeight:1.5,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{post.notes}</p>}
      </div>
      <div style={{display:'flex',gap:5,padding:'8px 12px',borderTop:`1px solid ${T.borderLight}`}}>
        <Btn onClick={()=>onPlayModal(post)} style={{flex:1,padding:'6px 0',background:IG,color:'#fff',fontSize:12}}>⛶ Modal</Btn>
        {reel && <Btn onClick={()=>onPlayInline(post)} style={{flex:1,padding:'6px 0',background:'#0a0a0a',color:'#fff',fontSize:12,border:`1px solid rgba(255,255,255,.15)`}}>▶ Here</Btn>}
        <Btn onClick={()=>onEdit(post)} style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>✎</Btn>
        <Btn onClick={()=>onDelete(post.id)} style={{padding:'6px 10px',background:'#fef2f2',color:T.danger,fontSize:12}}>🗑</Btn>
      </div>
    </div>
  );
};

const YtModal = ({video, embedId, onClose, playlist, onPlNext, onPlPrev, onPlJump, onPlLoop, loopPl, plIdx}) => {
  if (!video) return null;
  const hasPl = !!(playlist && playlist.queue && playlist.queue.length > 0);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{width:'100%',maxWidth:680,width:'100%',borderRadius:22,overflow:'hidden',boxShadow:'0 32px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)',background:'#0a0a0a',display:'flex',flexDirection:'column'}}>

        {/* ── HEADER ── */}
        <div style={{flexShrink:0}}>
          <div style={{height:3,background:YTG,width:'100%'}}/>
          <div style={{padding:'13px 16px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
              {/* SnowAI YT pill */}
              <div style={{flexShrink:0,background:YTG,borderRadius:10,padding:'3px 10px 3px 8px',display:'flex',alignItems:'center',gap:5,boxShadow:'0 2px 10px rgba(220,38,38,.4)'}}>
                <span style={{fontSize:13}}>❄️</span>
                <span style={{fontFamily:T.font,fontWeight:800,fontSize:11,color:'#fff',letterSpacing:'.02em',whiteSpace:'nowrap'}}>SnowAI YouTube</span>
              </div>
              <div style={{minWidth:0}}>
                <div style={{color:'#fff',fontFamily:T.font,fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{video.video_title}</div>
                <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
                  <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#ef4444',flexShrink:0}}/>
                  <span style={{color:'rgba(255,255,255,.45)',fontFamily:T.body,fontSize:10}}>
                    {video.category_name||'YouTube'}{hasPl?` · 📋 ${playlist.name} (${(plIdx??0)+1}/${playlist.queue.length})`:''}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>×</button>
          </div>
        </div>

        {/* ── PLAYER — true 16:9 via aspect-ratio ── */}
        <div style={{width:'100%',aspectRatio:'16/9',background:'#000',flexShrink:0}}>
          <iframe src={`https://www.youtube.com/embed/${embedId}?autoplay=1&enablejsapi=1`}
            title={video.video_title} frameBorder="0" style={{width:'100%',height:'100%',display:'block'}}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>

        {/* ── NOTES ── */}
        {video.notes && (
          <div style={{flexShrink:0,padding:'8px 14px',background:'#111',borderTop:'1px solid rgba(255,255,255,.06)'}}>
            <span style={{fontFamily:T.body,fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}><strong style={{color:'rgba(255,255,255,.7)'}}>Notes:</strong> {video.notes}</span>
          </div>
        )}

        {/* ── PLAYLIST CONTROLS (if active) ── */}
        {hasPl && (
          <div style={{flexShrink:0,borderTop:'1px solid rgba(255,255,255,.07)'}}>
            {/* prev / loop / next */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',gap:8}}>
              <button onClick={onPlPrev} disabled={plIdx===0&&!loopPl} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',color:'#fff',padding:'7px 18px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:12,opacity:(plIdx===0&&!loopPl)?.35:1}}>← Prev</button>
              <button onClick={onPlLoop} style={{background:loopPl?'rgba(239,68,68,.2)':'rgba(255,255,255,.06)',border:`1px solid ${loopPl?'rgba(239,68,68,.5)':'rgba(255,255,255,.12)'}`,color:loopPl?'#fca5a5':'rgba(255,255,255,.6)',padding:'7px 14px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:11,fontWeight:600}}>🔁 Loop {loopPl?'On':'Off'}</button>
              <div style={{fontFamily:T.font,fontWeight:800,fontSize:10,letterSpacing:'.1em',background:YTG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',userSelect:'none'}}>SNOWAI</div>
              <button onClick={onPlNext} disabled={plIdx===playlist.queue.length-1&&!loopPl} style={{background:'rgba(220,38,38,.7)',border:'none',color:'#fff',padding:'7px 18px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:12,opacity:(plIdx===playlist.queue.length-1&&!loopPl)?.35:1}}>Next →</button>
            </div>
            {/* queue strip */}
            <div style={{maxHeight:130,overflowY:'auto',borderTop:'1px solid rgba(255,255,255,.06)'}} className="sas-scroll">
              {playlist.queue.map((v,i)=>{
                const vid=v.youtube_embed_id||ytId(v.video_url);
                return (
                  <div key={(v._qid||v.id)+'_'+i} onClick={()=>onPlJump(i)}
                    style={{display:'flex',alignItems:'center',gap:8,padding:'7px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,.04)',background:i===plIdx?'rgba(239,68,68,.12)':'transparent',transition:'background .15s'}}
                    onMouseEnter={e=>{if(i!==plIdx)e.currentTarget.style.background='rgba(255,255,255,.05)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=i===plIdx?'rgba(239,68,68,.12)':'transparent';}}>
                    <span style={{fontFamily:T.body,fontSize:10,color:i===plIdx?'#f87171':'rgba(255,255,255,.3)',width:18,textAlign:'center',flexShrink:0}}>{i===plIdx?'▶':i+1}</span>
                    {vid&&<img src={`https://img.youtube.com/vi/${vid}/default.jpg`} style={{width:34,height:25,objectFit:'cover',borderRadius:4,flexShrink:0,opacity:i===plIdx?1:.7}} alt=""/>}
                    <span style={{fontFamily:T.body,fontSize:12,color:i===plIdx?'#fff':'rgba(255,255,255,.55)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:i===plIdx?600:400}}>{v.video_title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FOOTER (no playlist) ── */}
        {!hasPl && (
          <div style={{display:'flex',justifyContent:'center',padding:'9px 14px',background:'#0a0a0a',borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{fontFamily:T.font,fontWeight:800,fontSize:10,letterSpacing:'.1em',background:YTG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',userSelect:'none'}}>SNOWAI</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SnowAIStream() {
  const BASE='https://backend-production-c0ab.up.railway.app';
  const [tab,setTab]=useState('youtube');
  const [toast,setToast]=useState({msg:'',type:''});
  const [loading,setLoading]=useState(false);
  const showToast=(msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast({msg:'',type:''}),4000);};

  const [ytVideos,setYtVideos]=useState([]);
  const [ytFiltered,setYtFiltered]=useState([]);
  const [ytCats,setYtCats]=useState([]);
  const [ytCat,setYtCat]=useState('all');
  const [ytSearch,setYtSearch]=useState('');
  const [ytPlaying,setYtPlaying]=useState(null);
  const [ytFormOpen,setYtFormOpen]=useState(false);
  const [ytEditing,setYtEditing]=useState(null);
  const [ytForm,setYtForm]=useState({video_title:'',video_url:'',category_id:'',notes:''});
  const [ytCatForm,setYtCatForm]=useState(false);
  const [ytNewCat,setYtNewCat]=useState('');
  const [playlists,setPlaylists]=useState([]);
  const [showPLModal,setShowPLModal]=useState(false);
  const [activePL,setActivePL]=useState(null);
  const [pendingPLVid,setPendingPLVid]=useState(null);
  const [plIdx,setPlIdx]=useState(0);
  const [plLoop,setPlLoop]=useState(true);
  const plLoopRef=useRef(true);
  useEffect(()=>{plLoopRef.current=plLoop;},[plLoop]);

  const [igPosts,setIgPosts]=useState([]);
  const [igFiltered,setIgFiltered]=useState([]);
  const [igCats,setIgCats]=useState([]);
  const [igCat,setIgCat]=useState('all');
  const [igSearch,setIgSearch]=useState('');
  const [igPlaying,setIgPlaying]=useState(null);
  const [igPlayIdx,setIgPlayIdx]=useState(null);
  const [inlineReel,setInlineReel]=useState(null); // play reel in-page without modal
  const [igFormOpen,setIgFormOpen]=useState(false);
  const [igEditing,setIgEditing]=useState(null);
  const [igForm,setIgForm]=useState({title:'',post_url:'',category_id:'',account_handle:'',notes:''});
  const [igCatForm,setIgCatForm]=useState(false);
  const [igNewCat,setIgNewCat]=useState('');
  const [igView,setIgView]=useState('grid');
  const [showIgQV,setShowIgQV]=useState(false);

  useEffect(()=>{fetchYtCats();fetchYtVideos();},[]);
  useEffect(()=>{fetchIgCats();fetchIgPosts();},[]);
  useEffect(()=>{try{const s=localStorage.getItem('sas_playlists');if(s)setPlaylists(JSON.parse(s));}catch{}},[]);

  const savePLs=pls=>{setPlaylists(pls);try{localStorage.setItem('sas_playlists',JSON.stringify(pls));}catch{}};

  useEffect(()=>{if(!ytSearch.trim())return setYtFiltered(ytVideos);const q=ytSearch.toLowerCase();setYtFiltered(ytVideos.filter(v=>v.video_title?.toLowerCase().includes(q)||v.notes?.toLowerCase().includes(q)||v.category_name?.toLowerCase().includes(q)));},[ytSearch,ytVideos]);
  useEffect(()=>{if(!igSearch.trim())return setIgFiltered(igPosts);const q=igSearch.toLowerCase();setIgFiltered(igPosts.filter(p=>p.title?.toLowerCase().includes(q)||p.account_handle?.toLowerCase().includes(q)||p.caption?.toLowerCase().includes(q)||p.notes?.toLowerCase().includes(q)||p.category_name?.toLowerCase().includes(q)));},[igSearch,igPosts]);

  const fetchYtCats=async()=>{try{const r=await fetch(`${BASE}/api/snowai-video-categories/`);const d=await r.json();setYtCats(d.categories||[]);}catch{}};
  const fetchYtVideos=async(cid=null)=>{setLoading(true);try{const r=await fetch(cid?`${BASE}/api/snowai-video-entries/?category_id=${cid}`:`${BASE}/api/snowai-video-entries/`);const d=await r.json();setYtVideos(d.videos||[]);setYtFiltered(d.videos||[]);}catch{showToast('Failed to load videos','error');}finally{setLoading(false);}};
  const handleYtCatF=id=>{setYtCat(id);setYtSearch('');fetchYtVideos(id==='all'?null:id);};
  const handleYtAddCat=async e=>{e.preventDefault();if(!ytNewCat.trim())return;try{const r=await fetch(`${BASE}/api/snowai-video-categories/create/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category_name:ytNewCat})});if(r.ok){setYtNewCat('');setYtCatForm(false);fetchYtCats();}}catch{showToast('Failed','error');}};
  const handleYtSubmit=async e=>{e.preventDefault();if(!ytForm.video_title||!ytForm.video_url||!ytForm.category_id)return showToast('Fill all required fields','error');try{const url=ytEditing?`${BASE}/api/snowai-video-entries/${ytEditing.id}/update/`:`${BASE}/api/snowai-video-entries/create/`;const r=await fetch(url,{method:ytEditing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(ytForm)});if(r.ok){setYtForm({video_title:'',video_url:'',category_id:'',notes:''});setYtFormOpen(false);setYtEditing(null);fetchYtVideos(ytCat==='all'?null:ytCat);showToast(ytEditing?'Updated!':'Saved!');}}catch{showToast('Failed','error');}};
  const handleYtDelete=async id=>{if(!window.confirm('Delete?'))return;try{await fetch(`${BASE}/api/snowai-video-entries/${id}/delete/`,{method:'DELETE'});fetchYtVideos(ytCat==='all'?null:ytCat);if(ytPlaying?.id===id)setYtPlaying(null);showToast('Deleted');}catch{showToast('Failed','error');}};
  const handleYtEdit=v=>{setYtEditing(v);setYtForm({video_title:v.video_title,video_url:v.video_url,category_id:v.category_id,notes:v.notes||''});setYtFormOpen(true);};

  const handleSavePL=pl=>{const updated=[...playlists,pl];savePLs(updated);setPendingPLVid(null);showToast(`Playlist "${pl.name}" created!`);};
  const handleAddToPL=v=>{if(activePL){const updated=playlists.map(p=>p.id===activePL.id?{...p,queue:[...p.queue,{...v,_qid:Date.now()+'_'+v.id}]}:p);savePLs(updated);setActivePL(updated.find(p=>p.id===activePL.id));showToast(`Added to "${activePL.name}"`);}else{setPendingPLVid(v);setShowPLModal(true);}};
  const handleDelPL=id=>{const updated=playlists.filter(p=>p.id!==id);savePLs(updated);if(activePL?.id===id)setActivePL(null);showToast('Playlist deleted');};

  const fetchIgCats=async()=>{try{const r=await fetch(`${BASE}/api/snowai-insta-categories/`);const d=await r.json();setIgCats(d.categories||[]);}catch{}};
  const fetchIgPosts=async(cid=null)=>{setLoading(true);try{const r=await fetch(cid?`${BASE}/api/snowai-insta-posts/?category_id=${cid}`:`${BASE}/api/snowai-insta-posts/`);const d=await r.json();setIgPosts(d.posts||[]);setIgFiltered(d.posts||[]);}catch{showToast('Failed to load posts','error');}finally{setLoading(false);}};
  const handleIgCatF=id=>{setIgCat(id);setIgSearch('');fetchIgPosts(id==='all'?null:id);};
  const handleIgAddCat=async e=>{e.preventDefault();if(!igNewCat.trim())return;try{const r=await fetch(`${BASE}/api/snowai-insta-categories/create/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category_name:igNewCat})});if(r.ok){setIgNewCat('');setIgCatForm(false);fetchIgCats();}}catch{showToast('Failed','error');}};
  const handleIgSubmit=async e=>{e.preventDefault();if(!igForm.title||!igForm.post_url||!igForm.category_id)return showToast('Fill all required fields','error');if(!igForm.post_url.includes('instagram.com'))return showToast('Must be instagram.com URL','warn');try{const url=igEditing?`${BASE}/api/snowai-insta-posts/${igEditing.id}/update/`:`${BASE}/api/snowai-insta-posts/create/`;const r=await fetch(url,{method:igEditing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(igForm)});if(r.ok){setIgForm({title:'',post_url:'',category_id:'',account_handle:'',notes:''});setIgFormOpen(false);setIgEditing(null);fetchIgPosts(igCat==='all'?null:igCat);showToast(igEditing?'Updated!':'Saved!');}}catch{showToast('Failed','error');}};
  const handleIgDelete=async id=>{if(!window.confirm('Delete?'))return;try{await fetch(`${BASE}/api/snowai-insta-posts/${id}/delete/`,{method:'DELETE'});fetchIgPosts(igCat==='all'?null:igCat);showToast('Deleted');}catch{showToast('Failed','error');}};
  const handleIgEdit=p=>{setIgEditing(p);setIgForm({title:p.title,post_url:p.post_url,category_id:p.category_id,account_handle:p.account_handle||'',notes:p.notes||''});setIgFormOpen(true);};
  const handleIgPlay=p=>{const i=igFiltered.findIndex(x=>x.id===p.id);setIgPlayIdx(i>=0?i:null);setIgPlaying(p);};
  const handleIgNext=()=>{if(igPlayIdx===null)return;const n=igPlayIdx+1;if(n<igFiltered.length){setIgPlayIdx(n);setIgPlaying(igFiltered[n]);}};
  const handleIgPrev=()=>{if(igPlayIdx===null)return;const p=igPlayIdx-1;if(p>=0){setIgPlayIdx(p);setIgPlaying(igFiltered[p]);}};

  const secBtn=(active,insta)=>({padding:'10px 20px',background:active?(insta?IG:AG):'transparent',color:active?'#fff':T.textSec,border:`2px solid ${active?'transparent':T.border}`,borderRadius:T.rl,cursor:'pointer',fontFamily:T.font,fontWeight:700,fontSize:14,transition:'all .2s',boxShadow:active?T.shm:'none'});
  const catBtn=(active,insta)=>({padding:'5px 13px',background:active?(insta?IG:AG):T.surface,color:active?'#fff':T.accent,border:`1.5px solid ${active?'transparent':T.border}`,borderRadius:15,cursor:'pointer',fontFamily:T.body,fontWeight:600,fontSize:12,transition:'all .18s',whiteSpace:'nowrap'});
  const tareaStyle={width:'100%',padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:T.rs,fontFamily:T.body,fontSize:14,color:T.text,background:T.bg,outline:'none',resize:'vertical',marginBottom:10,boxSizing:'border-box'};

  const ytEmbedId=ytPlaying?(ytPlaying.youtube_embed_id||ytId(ytPlaying.video_url)):null;

  return(
    <div style={{background:T.bg,minHeight:'100vh',fontFamily:T.body}}>
      <div className="header"><Header/></div>
      <div className="main-page-body" style={{minHeight:'calc(100vh - 60px)'}}>
        <SideNavs/>
        <div className="main-body-info" style={{flex:1,padding:'16px 14px',background:T.bg,minWidth:0,overflow:'hidden'}}>

          <div style={{marginBottom:16}}>
            <h1 style={{fontFamily:T.font,fontWeight:800,fontSize:22,color:T.text,margin:0,letterSpacing:'-.02em'}}>
              SnowAI <span style={{background:AG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Stream</span>
            </h1>
            <p style={{fontFamily:T.body,color:T.textMut,margin:'3px 0 0',fontSize:12}}>YouTube & Instagram in one place.</p>
          </div>

          <div style={{display:'flex',gap:6,marginBottom:16,background:T.surface,padding:4,borderRadius:T.rl,border:`1px solid ${T.border}`,width:'fit-content',boxShadow:T.sh}}>
            <button style={secBtn(tab==='youtube',false)} onClick={()=>setTab('youtube')}>▶ YouTube</button>
            <button style={{...secBtn(tab==='instagram',true),background:tab==='instagram'?IG:undefined}} onClick={()=>setTab('instagram')}>📸 Instagram</button>
          </div>

          {toast.msg&&<Toast msg={toast.msg} type={toast.type}/>}

          {tab==='youtube'&&(
            <div className="sas-in">
              <YtQuickBar onPlay={v=>{setActivePL(null);setYtPlaying(v);}} onAddToPlaylist={handleAddToPL}/>


              {!activePL&&playlists.length>0&&(
                <SC style={{marginBottom:14}}>
                  <div style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,marginBottom:10,letterSpacing:'.07em'}}>🎵 YOUR PLAYLISTS</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {playlists.map(pl=>(
                      <div key={pl.id} style={{display:'flex',alignItems:'center',gap:0,background:T.accentPale,borderRadius:T.rs,overflow:'hidden',border:`1px solid ${T.border}`}}>
                        <button onClick={()=>{ setActivePL(pl); setPlIdx(0); const v=pl.queue[0]; if(v) setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} style={{padding:'6px 11px',background:'none',border:'none',cursor:'pointer',fontFamily:T.body,fontWeight:600,fontSize:13,color:T.accent}}>▶ {pl.name} <span style={{fontWeight:400,color:T.textMut}}>({pl.queue.length})</span></button>
                        <button onClick={()=>handleDelPL(pl.id)} style={{padding:'6px 8px',background:'none',border:'none',cursor:'pointer',color:T.danger,fontSize:14,borderLeft:`1px solid ${T.border}`}}>×</button>
                      </div>
                    ))}
                    <Btn onClick={()=>{setPendingPLVid(null);setShowPLModal(true);}} style={{padding:'6px 12px',background:T.accentPale,color:T.accent,border:`1px solid ${T.border}`}}>+ New</Btn>
                  </div>
                </SC>
              )}
              {!activePL&&playlists.length===0&&(
                <div style={{marginBottom:14}}>
                  <Btn onClick={()=>{setPendingPLVid(null);setShowPLModal(true);}} style={{padding:'7px 14px',background:T.accentPale,color:T.accent,border:`1.5px solid ${T.border}`,fontSize:13}}>🎵 Create Playlist</Btn>
                </div>
              )}


              <SC>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>Categories</span>
                  <Btn onClick={()=>setYtCatForm(v=>!v)} style={{padding:'5px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>{ytCatForm?'Cancel':'+ Category'}</Btn>
                </div>
                {ytCatForm&&(<form onSubmit={handleYtAddCat} style={{display:'flex',gap:8,marginBottom:10}}><Inp value={ytNewCat} onChange={e=>setYtNewCat(e.target.value)} placeholder="Category name" style={{flex:1}}/><Btn type="submit" style={{padding:'10px 14px',background:AG,color:'#fff'}}>Add</Btn></form>)}
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  <button style={catBtn(ytCat==='all',false)} onClick={()=>handleYtCatF('all')}>All</button>
                  {ytCats.map(c=><button key={c.id} style={catBtn(ytCat===c.id,false)} onClick={()=>handleYtCatF(c.id)}>{c.category_name}</button>)}
                </div>
              </SC>

              <div className="sas-flex-row" style={{marginBottom:12}}>
                <div style={{flex:1,position:'relative'}}><span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',fontSize:13,pointerEvents:'none'}}>🔍</span><Inp value={ytSearch} onChange={e=>setYtSearch(e.target.value)} placeholder="Search saved videos…" style={{paddingLeft:32}}/></div>
                <Btn onClick={()=>{setYtFormOpen(true);setYtEditing(null);setYtForm({video_title:'',video_url:'',category_id:'',notes:''}); }} style={{padding:'10px 16px',background:YTG,color:'#fff',whiteSpace:'nowrap'}}>+ Save</Btn>
              </div>

              {ytFormOpen&&(
                <SC className="sas-in">
                  <div style={{fontFamily:T.font,fontWeight:700,fontSize:13,marginBottom:12,color:T.text}}>{ytEditing?'✎ Edit':'+ Save Video'}</div>
                  <form onSubmit={handleYtSubmit}>
                    <div className="sas-two-col" style={{marginBottom:10}}><Inp value={ytForm.video_title} onChange={e=>setYtForm(f=>({...f,video_title:e.target.value}))} placeholder="Title *" required/><Inp value={ytForm.video_url} onChange={e=>setYtForm(f=>({...f,video_url:e.target.value}))} placeholder="YouTube URL *" required/></div>
                    <Sel value={ytForm.category_id} onChange={e=>setYtForm(f=>({...f,category_id:e.target.value}))} style={{marginBottom:10}} required><option value="">Category *</option>{ytCats.map(c=><option key={c.id} value={c.id}>{c.category_name}</option>)}</Sel>
                    <textarea value={ytForm.notes} onChange={e=>setYtForm(f=>({...f,notes:e.target.value}))} placeholder="Notes (optional)" rows={2} style={tareaStyle}/>
                    <div style={{display:'flex',gap:8}}><Btn type="submit" style={{padding:'9px 18px',background:AG,color:'#fff'}}>{ytEditing?'Update':'Save'}</Btn><Btn type="button" onClick={()=>{setYtFormOpen(false);setYtEditing(null);}} style={{padding:'9px 18px',background:T.surfaceAlt,color:T.textSec}}>Cancel</Btn></div>
                  </form>
                </SC>
              )}

              {loading?(<div style={{display:'flex',justifyContent:'center',padding:48}}><Spinner sz={32}/></div>):ytFiltered.length===0?(
                <div style={{textAlign:'center',padding:'44px 20px',background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,color:T.textMut,fontFamily:T.body}}>{ytSearch?`No videos matching "${ytSearch}"`:'No saved videos yet — Quick Play above or save one!'}</div>
              ):(
                <>
                  {ytSearch&&<div style={{padding:'6px 12px',background:T.accentPale,borderLeft:`4px solid ${T.accent}`,borderRadius:T.rs,marginBottom:10,fontFamily:T.body,fontSize:13,color:T.accent}}>{ytFiltered.length} result{ytFiltered.length!==1?'s':''}</div>}
                  <div className="sas-grid-yt">
                    {ytFiltered.map((v,i)=><YtCard key={v.id} video={v} index={i} playing={ytPlaying?.id===v.id} onPlay={v=>{setActivePL(null);setYtPlaying(v);}} onEdit={handleYtEdit} onDelete={handleYtDelete} onAddToPlaylist={handleAddToPL}/>)}
                  </div>
                </>
              )}
            </div>
          )}

          {tab==='instagram'&&(
            <div className="sas-in">
              <div style={{background:IG,borderRadius:T.r,padding:'13px 14px',marginBottom:12,boxShadow:'0 6px 24px rgba(193,53,132,.28)'}}>
                <div className="sas-banner">
                  <div>
                    <div style={{fontFamily:T.font,fontWeight:800,fontSize:17,color:'#fff',letterSpacing:'-.02em'}}>SnowAI Insta 📸</div>
                    <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.75)',marginTop:2}}>Save posts & reels, or quick-view any public URL via Instagram oEmbed.</div>
                  </div>
                  <div className="sas-banner-right">
                    <Btn onClick={()=>setShowIgQV(true)} style={{padding:'7px 12px',background:'rgba(255,255,255,.2)',color:'#fff',border:'1.5px solid rgba(255,255,255,.4)',fontSize:12,backdropFilter:'blur(4px)'}}>⚡ Quick-View</Btn>
                    <div style={{display:'flex',gap:3,background:'rgba(255,255,255,.15)',borderRadius:7,padding:3}}>
                      {[['⊞','grid'],['🎬','reels']].map(([ic,m])=>(
                        <button key={m} onClick={()=>setIgView(m)} style={{padding:'4px 10px',border:'none',borderRadius:5,cursor:'pointer',background:igView===m?'rgba(255,255,255,.9)':'transparent',color:igView===m?T.iD:'#fff',fontFamily:T.body,fontWeight:600,fontSize:12}}>{ic}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {igPosts.length>0&&(
                <SC>
                  <div style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,marginBottom:9,letterSpacing:'.07em'}}>QUICK ACCESS</div>
                  <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:3}} className="sas-scroll">
                    {igPosts.slice(0,14).map(p=><StoryRing key={p.id} label={p.account_handle||p.title} url={p.post_url} active={igPlaying?.id===p.id} onClick={()=>handleIgPlay(p)}/>)}
                  </div>
                </SC>
              )}

              <SC>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>Categories</span>
                  <Btn onClick={()=>setIgCatForm(v=>!v)} style={{padding:'5px 10px',background:'rgba(193,53,132,.1)',color:T.iD,fontSize:12}}>{igCatForm?'Cancel':'+ Category'}</Btn>
                </div>
                {igCatForm&&(<form onSubmit={handleIgAddCat} style={{display:'flex',gap:8,marginBottom:10}}><Inp value={igNewCat} onChange={e=>setIgNewCat(e.target.value)} placeholder="Category name" insta="1" style={{flex:1}}/><Btn type="submit" style={{padding:'10px 14px',background:IG,color:'#fff'}}>Add</Btn></form>)}
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  <button style={catBtn(igCat==='all',true)} onClick={()=>handleIgCatF('all')}>All</button>
                  {igCats.map(c=><button key={c.id} style={catBtn(igCat===c.id,true)} onClick={()=>handleIgCatF(c.id)}>{c.category_name}</button>)}
                </div>
              </SC>

              <div className="sas-flex-row" style={{marginBottom:12}}>
                <div style={{flex:1,position:'relative'}}><span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',fontSize:13,pointerEvents:'none'}}>🔍</span><Inp value={igSearch} onChange={e=>setIgSearch(e.target.value)} placeholder="Search posts, handles, captions…" style={{paddingLeft:32}}/></div>
                <Btn onClick={()=>{setIgFormOpen(true);setIgEditing(null);setIgForm({title:'',post_url:'',category_id:'',account_handle:'',notes:''}); }} style={{padding:'10px 16px',background:IG,color:'#fff',whiteSpace:'nowrap',boxShadow:'0 3px 10px rgba(193,53,132,.3)'}}>+ Save</Btn>
              </div>

              {igFormOpen&&(
                <SC style={{border:`1.5px solid ${T.iD}33`}} className="sas-in">
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}><div style={{width:4,height:22,borderRadius:3,background:IG}}/><span style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:T.text}}>{igEditing?'✎ Edit Post':'+ Save Post / Reel'}</span></div>
                  <form onSubmit={handleIgSubmit}>
                    <div className="sas-two-col" style={{marginBottom:10}}><Inp value={igForm.title} onChange={e=>setIgForm(f=>({...f,title:e.target.value}))} placeholder="Label *" insta="1" required/><Inp value={igForm.account_handle} onChange={e=>setIgForm(f=>({...f,account_handle:e.target.value}))} placeholder="@handle" insta="1"/></div>
                    <Inp value={igForm.post_url} onChange={e=>setIgForm(f=>({...f,post_url:e.target.value}))} placeholder="Instagram URL * (https://instagram.com/reel/…)" insta="1" style={{marginBottom:10}} required/>
                    <Sel value={igForm.category_id} onChange={e=>setIgForm(f=>({...f,category_id:e.target.value}))} style={{marginBottom:10}} required><option value="">Category *</option>{igCats.map(c=><option key={c.id} value={c.id}>{c.category_name}</option>)}</Sel>
                    <textarea value={igForm.notes} onChange={e=>setIgForm(f=>({...f,notes:e.target.value}))} placeholder="Notes (optional)" rows={2} style={tareaStyle}/>
                    <div style={{padding:'7px 11px',background:'#fff8f0',border:'1px solid #fed7aa',borderRadius:T.rs,fontFamily:T.body,fontSize:11,color:'#92400e',marginBottom:10}}>
                      💡 Uses Instagram oEmbed — works for <strong>public</strong> posts & reels only.
                    </div>
                    <div style={{display:'flex',gap:8}}><Btn type="submit" style={{padding:'9px 18px',background:IG,color:'#fff'}}>{igEditing?'Update':'Save'}</Btn><Btn type="button" onClick={()=>{setIgFormOpen(false);setIgEditing(null);}} style={{padding:'9px 18px',background:T.surfaceAlt,color:T.textSec}}>Cancel</Btn></div>
                  </form>
                </SC>
              )}

              {loading?(<div style={{display:'flex',justifyContent:'center',padding:48}}><Spinner sz={32}/></div>):igFiltered.length===0?(
                <div style={{textAlign:'center',padding:'44px 20px',background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,color:T.textMut,fontFamily:T.body}}>{igSearch?`No posts matching "${igSearch}"`:'No saved posts — use ⚡ Quick-View or save one!'}</div>
              ):igView==='grid'?(
                {inlineReel && (
                  <InlineReelPlayer
                    post={inlineReel}
                    onOpenModal={()=>{handleIgPlay(inlineReel);setInlineReel(null);}}
                    onClose={()=>setInlineReel(null)}
                  />
                )}
                <div className="sas-grid-ig">{igFiltered.map((p,i)=><IgCard key={p.id} post={p} index={i} onPlayModal={p=>{setInlineReel(null);handleIgPlay(p);}} onPlayInline={p=>{setInlineReel(r=>r?.id===p.id?null:p);}} onEdit={handleIgEdit} onDelete={handleIgDelete}/>)}</div>
              ):(
                <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:380,margin:'0 auto'}}>
                  {igFiltered.map((p,i)=>(
                    <div key={p.id} className="sas-card sas-in" style={{animationDelay:`${i*.05}s`,background:'#000',borderRadius:T.r,overflow:'hidden',border:`1px solid ${T.border}`}}>
                      <div onClick={()=>handleIgPlay(p)} style={{position:'relative',paddingTop:'120%',cursor:'pointer',overflow:'hidden',maxHeight:300}}>
                        <div style={{position:'absolute',inset:0}}>
                          {p.thumbnail_url?<img src={p.thumbnail_url} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',background:IG,opacity:.25}}/>}
                          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:48,height:48,borderRadius:'50%',background:'rgba(255,255,255,.92)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:'0 4px 18px rgba(0,0,0,.4)'}}>▶</div></div>
                        </div>
                      </div>
                      <div style={{padding:'10px 13px',background:'#111'}}>
                        <div style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:'#fff',marginBottom:3}}>{p.title}</div>
                        {p.account_handle&&<div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.55)',marginBottom:7}}>@{p.account_handle}</div>}
                        <div style={{display:'flex',gap:6}}>
                          <Btn onClick={()=>handleIgPlay(p)} style={{flex:1,padding:'7px 0',background:IG,color:'#fff',fontSize:12}}>▶ Open</Btn>
                          <a href={p.post_url} target="_blank" rel="noopener noreferrer" style={{padding:'7px 12px',background:'rgba(255,255,255,.1)',color:'#fff',borderRadius:T.rs,fontSize:12,textDecoration:'none',display:'flex',alignItems:'center'}}>↗</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {ytPlaying&&ytEmbedId&&<YtModal video={ytPlaying} embedId={ytEmbedId} onClose={()=>{setYtPlaying(null);setActivePL(null);}} playlist={activePL} onPlNext={()=>{ const n=plIdx<activePL.queue.length-1?plIdx+1:(plLoopRef.current?0:plIdx); setPlIdx(n); const v=activePL.queue[n]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlPrev={()=>{ const p=plIdx>0?plIdx-1:(plLoopRef.current?activePL.queue.length-1:0); setPlIdx(p); const v=activePL.queue[p]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlJump={i=>{ setPlIdx(i); const v=activePL.queue[i]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlLoop={()=>setPlLoop(l=>!l)} loopPl={plLoop} plIdx={plIdx}/>}
          {showIgQV&&<InstaQuickView onClose={()=>setShowIgQV(false)} onOpenViewer={p=>{setIgPlaying(p);setIgPlayIdx(null);}}/>}
          {igPlaying&&<ReelModal post={igPlaying} onClose={()=>{setIgPlaying(null);setIgPlayIdx(null);}} onNext={handleIgNext} onPrev={handleIgPrev} hasPrev={igPlayIdx!==null&&igPlayIdx>0} hasNext={igPlayIdx!==null&&igPlayIdx<igFiltered.length-1}/>}
          {showPLModal&&<PlaylistModal onClose={()=>{setShowPLModal(false);setPendingPLVid(null);}} savedVideos={ytVideos} onSave={handleSavePL} initVideo={pendingPLVid}/>}
        </div>
      </div>
    </div>
  );
}