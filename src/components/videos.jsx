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
    .shortcut-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      animation: sas-up 0.3s ease both;
    }
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
const SPG = 'linear-gradient(135deg,#1db954,#1ed760)';
const SP_GREEN = '#1ed760';

const SP_TYPE = {
  track:    {label:'TRACK',    emoji:'🎵', color:'#1ed760'},
  album:    {label:'ALBUM',    emoji:'💿', color:'#a855f7'},
  playlist: {label:'PLAYLIST', emoji:'📋', color:'#3b82f6'},
  artist:   {label:'ARTIST',   emoji:'🎤', color:'#f59e0b'},
  episode:  {label:'EPISODE',  emoji:'🎙', color:'#ec4899'},
  show:     {label:'PODCAST',  emoji:'🎧', color:'#14b8a6'},
};

const parseSpotify = url => {
  if (!url) return {type:null,id:null};
  const m = url.match(/open\.spotify\.com\/(?:embed\/)?([a-z]+)\/([A-Za-z0-9]+)/);
  if (m) return {type:m[1],id:m[2]};
  const u = url.match(/spotify:([a-z]+):([A-Za-z0-9]+)/);
  if (u) return {type:u[1],id:u[2]};
  return {type:null,id:null};
};
const spEmbedUrl = (type,id) => `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
const SP_EMBED_H = {track:80,album:380,playlist:380,artist:380,episode:232,show:232};

const ytId = url => {
  if (!url) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]{11})/);
  return m ? m[1] : '';
};

// Auto-fetch YouTube video title
const fetchYoutubeTitle = async (videoId) => {
  try {
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const data = await response.json();
    return data.title || '';
  } catch (error) {
    console.error('Failed to fetch YouTube title:', error);
    return '';
  }
};

// Auto-fetch Instagram metadata
const fetchInstagramMetadata = async (url) => {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`https://api.instagram.com/oembed/?url=${encodedUrl}&omitscript=true`);
    const data = await response.json();
    return {
      title: data.title || '',
      author: data.author_name || '',
      thumbnail: data.thumbnail_url || ''
    };
  } catch (error) {
    console.error('Failed to fetch Instagram metadata:', error);
    return { title: '', author: '', thumbnail: '' };
  }
};

// Auto-fetch Spotify metadata
const fetchSpotifyMetadata = async (type, id) => {
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/${type}/${id}`);
    const data = await response.json();
    return {
      title: data.title || '',
      author: data.author_name || '',
      thumbnail: data.thumbnail_url || ''
    };
  } catch (error) {
    console.error('Failed to fetch Spotify metadata:', error);
    return { title: '', author: '', thumbnail: '' };
  }
};

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
const isReel  = url => url && (url.includes('/reel/') || url.includes('/tv/'));

// Voice Shortcut Helper Component
const VoiceShortcutHelper = ({ onClose, item, itemType, itemName }) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('ios');
  
  const getDeepLink = () => {
    if (item && itemType) {
      if (itemType === 'youtube') {
        return `${window.location.origin}/?action=play&type=youtube&id=${item.id}`;
      } else if (itemType === 'spotify') {
        return `${window.location.origin}/?action=play&type=spotify&id=${item.id}`;
      } else if (itemType === 'instagram') {
        return `${window.location.origin}/?action=play&type=instagram&id=${item.id}`;
      } else if (itemType === 'playlist') {
        return `${window.location.origin}/?action=playlist&name=${encodeURIComponent(itemName)}`;
      }
    }
    return `${window.location.origin}/?action=search&q=`;
  };
  
  const getSearchDeepLink = (query) => {
    return `${window.location.origin}/?action=search&q=${encodeURIComponent(query)}`;
  };
  
  const copyDeepLink = () => {
    navigator.clipboard.writeText(getDeepLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const copySearchLink = () => {
    const query = prompt('Enter your search query:', 'react tutorial');
    if (query) {
      navigator.clipboard.writeText(getSearchDeepLink(query));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(0,0,0,.8)', zIndex:1300, display:'flex', alignItems:'center', justifyContent:'center', padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{background:'#1a1a1a', borderRadius:T.rl, width:'100%', maxWidth:500, boxShadow:'0 25px 50px rgba(0,0,0,.5)', border:'1px solid rgba(255,255,255,.1)', overflow:'hidden'}}>
        <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:T.font, fontWeight:800, fontSize:16, color:'#fff'}}>🎤 Voice Shortcut Creator</div>
            <div style={{fontFamily:T.body, fontSize:11, color:'rgba(255,255,255,.7)', marginTop:2}}>Free Siri & Google Assistant integration</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)', border:'none', color:'#fff', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:17}}>×</button>
        </div>
        
        <div style={{padding:20}}>
          <div style={{display:'flex', gap:10, marginBottom:16}}>
            <button onClick={()=>setSelectedPlatform('ios')} style={{flex:1, padding:'8px 12px', background:selectedPlatform==='ios'? '#007aff' : 'rgba(255,255,255,.1)', border:'none', borderRadius:T.rs, color:'#fff', cursor:'pointer', fontFamily:T.body, fontSize:13, fontWeight:600}}>🍎 iPhone / Siri</button>
            <button onClick={()=>setSelectedPlatform('android')} style={{flex:1, padding:'8px 12px', background:selectedPlatform==='android'? '#3ddc84' : 'rgba(255,255,255,.1)', border:'none', borderRadius:T.rs, color:selectedPlatform==='android'? '#000' : '#fff', cursor:'pointer', fontFamily:T.body, fontSize:13, fontWeight:600}}>🤖 Android / Google</button>
          </div>
          
          {selectedPlatform === 'ios' ? (
            <div>
              <div style={{fontFamily:T.font, fontWeight:700, fontSize:13, color:'#fff', marginBottom:8}}>📱 Setup Siri Shortcut:</div>
              <ol style={{fontFamily:T.body, fontSize:12, color:'rgba(255,255,255,.7)', margin:'0 0 16px 20px', lineHeight:1.6}}>
                <li>Open <strong>Shortcuts</strong> app on your iPhone</li>
                <li>Tap <strong>+</strong> → <strong>Add Action</strong></li>
                <li>Search for <strong>"Open URLs"</strong></li>
                <li>Paste the link below into the URL field</li>
                <li>Tap <strong>Add to Siri</strong> → Record your voice phrase</li>
                <li>Example: <em>"Play my {itemName || 'saved item'}"</em></li>
              </ol>
            </div>
          ) : (
            <div>
              <div style={{fontFamily:T.font, fontWeight:700, fontSize:13, color:'#fff', marginBottom:8}}>📱 Setup Google Assistant Routine:</div>
              <ol style={{fontFamily:T.body, fontSize:12, color:'rgba(255,255,255,.7)', margin:'0 0 16px 20px', lineHeight:1.6}}>
                <li>Open <strong>Google Home</strong> app</li>
                <li>Go to <strong>Routines</strong> → <strong>New Routine</strong></li>
                <li>Add a trigger phrase (e.g., <em>"Play my {itemName || 'saved item'}"</em>)</li>
                <li>Add action: <strong>"Open URL"</strong> → Paste the link below</li>
                <li>Say <strong>"Hey Google"</strong> + your trigger phrase</li>
              </ol>
            </div>
          )}
          
          <div style={{background:'rgba(255,255,255,.05)', borderRadius:T.rs, padding:'12px', marginBottom:12}}>
            <div style={{fontFamily:T.body, fontSize:11, color:'rgba(255,255,255,.5)', marginBottom:4}}>Your Deep Link URL:</div>
            <div style={{fontFamily:'monospace', fontSize:11, color:'#86efac', wordBreak:'break-all', background:'rgba(0,0,0,.3)', padding:'8px', borderRadius:T.rs, marginBottom:8}}>{getDeepLink()}</div>
            <Btn onClick={copyDeepLink} style={{width:'100%', padding:'8px', background:'#007aff', color:'#fff', fontSize:12}}>
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Deep Link'}
            </Btn>
          </div>
          
          <div style={{marginBottom:12}}>
            <div style={{fontFamily:T.body, fontSize:11, color:'rgba(255,255,255,.5)', marginBottom:4}}>🔍 Search Shortcut (optional):</div>
            <Btn onClick={copySearchLink} style={{width:'100%', padding:'8px', background:'rgba(255,255,255,.1)', color:'#fff', fontSize:12}}>
              🔍 Create Search Shortcut
            </Btn>
          </div>
          
          <div style={{background:'rgba(59,130,246,.15)', borderRadius:T.rs, padding:'10px', border:'1px solid rgba(59,130,246,.3)'}}>
            <div style={{fontFamily:T.font, fontSize:11, color:'#60a5fa', marginBottom:4}}>💡 Pro Tip:</div>
            <div style={{fontFamily:T.body, fontSize:11, color:'rgba(255,255,255,.6)'}}>
              Add SnowAI to your home screen for the best experience! Open in Safari/Chrome → Share → Add to Home Screen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const igShortcode = url => {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
};

const InstaEmbed = ({url, loop=false}) => {
  const [loaded,    setLoaded]    = useState(false);
  const [errored,   setErrored]   = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [looping,   setLooping]   = useState(false);
  const [showNav,   setShowNav]   = useState(false);
  const silenceRef = useRef(null);
  const iframeRef  = useRef(null);
  const code = igShortcode(url);

  useEffect(() => {
    if (!loaded) return;
    const onBlur = () => {
      setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          setShowNav(true);
          window.focus();
        }
      }, 100);
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [loaded]);

  const startSilenceWatch = useCallback(() => {
    if (!loop) return;
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.name && entry.name.includes('instagram.com') && entry.name.includes('embed')) {
            setLooping(true);
            setTimeout(() => setLooping(false), 800);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      silenceRef.current = observer;
    } catch {}
  }, [loop]);

  const replayNow = () => {
    setLoaded(false);
    setLooping(true);
    setShowNav(false);
    setReloadKey(k => k + 1);
    setTimeout(() => setLooping(false), 600);
  };

  useEffect(() => { if (loaded) startSilenceWatch(); }, [loaded, startSilenceWatch]);
  useEffect(() => () => { try { silenceRef.current?.disconnect?.(); silenceRef.current?.unobserve?.(); } catch {} }, []);
  useEffect(() => { setLoaded(false); setErrored(false); setReloadKey(0); setShowNav(false); }, [url]);

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
      {showNav && (
        <div style={{position:'absolute',inset:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.82)',backdropFilter:'blur(4px)'}} className="sas-in">
          <div style={{background:'#1a1a1a',borderRadius:16,padding:'22px 20px',maxWidth:240,width:'90%',border:'1px solid rgba(255,255,255,.1)',boxShadow:'0 16px 48px rgba(0,0,0,.6)',display:'flex',flexDirection:'column',alignItems:'center',gap:13,textAlign:'center'}}>
            <div style={{fontSize:30}}>🤔</div>
            <div>
              <div style={{fontFamily:T.font,fontWeight:800,fontSize:14,color:'#fff',marginBottom:4}}>Where to?</div>
              <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.45)',lineHeight:1.5}}>You tapped the end screen. Replay here or open Instagram?</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7,width:'100%'}}>
              <button onClick={replayNow}
                style={{width:'100%',padding:'9px 0',background:IG,border:'none',color:'#fff',borderRadius:T.rs,cursor:'pointer',fontFamily:T.font,fontWeight:700,fontSize:13}}>
                ↺ Replay here
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer" onClick={()=>setShowNav(false)}
                style={{width:'100%',padding:'9px 0',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.75)',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:12,textDecoration:'none',display:'block',boxSizing:'border-box'}}>
                Open on Instagram ↗
              </a>
              <button onClick={()=>setShowNav(false)}
                style={{background:'none',border:'none',color:'rgba(255,255,255,.28)',cursor:'pointer',fontFamily:T.body,fontSize:11,padding:'2px 0'}}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {errored ? (
        <div style={{padding:'28px 20px',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:13,minHeight:200}}>
          <div style={{fontSize:34}}>🔒</div>
          <p style={{color:'rgba(255,255,255,.75)',fontFamily:T.body,fontSize:13,margin:0,lineHeight:1.5,maxWidth:260}}>Post may be private or login-required.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{padding:'9px 18px',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:13,textDecoration:'none'}}>Open on Instagram ↗</a>
        </div>
      ) : (
        <iframe key={reloadKey} ref={iframeRef} src={`https://www.instagram.com/p/${code}/embed/`}
          style={{width:'100%',minHeight:420,border:'none',display:'block',background:'#fff'}}
          scrolling="no" allowTransparency="true"
          onLoad={()=>setLoaded(true)}
          onError={()=>{setLoaded(true);setErrored(true);}}/>
      )}
      <div style={{padding:'8px 14px',background:'#111',borderTop:'1px solid #222',display:'flex',alignItems:'center',gap:8}}>
        {loaded && (
          <button onClick={replayNow}
            style={{background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.22)',color:'#fff',padding:'7px 14px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:11,fontWeight:700,whiteSpace:'nowrap',flexShrink:0}}>
            ↺ Replay
          </button>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{flex:1,textAlign:'center',padding:'7px 0',background:IG,color:'#fff',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:12,textDecoration:'none',display:'block'}}>
          Open on Instagram ↗
        </a>
      </div>
    </div>
  );
};

const TranscriptSaveModal = ({text, defaultTitle, defaultHandle, source, onClose, onSaved }) => {
  const BASE = 'https://backend-production-c0ab.up.railway.app';
  const [form, setForm] = useState({
    title:        defaultTitle || '',
    speaker_name: defaultHandle ? defaultHandle.replace('@','') : '',
    category:     source === 'youtube' ? 'youtube' : source === 'spotify' ? 'spotify' : 'instagram',
    transcript:   text || '',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');
  const [saved,  setSaved]  = useState(false);

  const save = async () => {
    if (!form.transcript.trim()) return setErr('No transcript text to save.');
    if (!form.title.trim())      return setErr('Please add a title.');
    setSaving(true); setErr('');
    try {
      const payload = {
        transcript_uuid:      crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        youtube_video_id:     source === 'youtube' ? (defaultTitle || '').slice(0,50) : null,
        youtube_url:          null,
        video_title:          form.title.slice(0,300),
        full_transcript_text: form.transcript,
        primary_speaker_name: form.speaker_name.slice(0,200) || null,
        content_category:     form.category.slice(0,100),
        transcription_method: 'web_speech_api',
        transcript_language:  'en',
        processing_status:    'completed',
      };
      const r = await fetch(`${BASE}/api/snowai-save-transcript/`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const d = await r.json().catch(()=>({}));
        throw new Error(d.error || `HTTP ${r.status}`);
      }
      setSaved(true);
      setTimeout(() => { onSaved?.(); onClose(); }, 1200);
    } catch(e) {
      setErr(e.message || 'Save failed. Check backend.');
    } finally {
      setSaving(false);
    }
  };

  const getSourceGradient = () => {
    if (source === 'youtube') return YTG;
    if (source === 'spotify') return SPG;
    return IG;
  };

  const field = (label, key, opts={}) => (
    <div style={{marginBottom:12}}>
      <label style={{display:'block',fontFamily:T.font,fontWeight:700,fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.05em',marginBottom:5}}>{label}</label>
      {opts.textarea
        ? <textarea value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} rows={opts.rows||5}
            style={{width:'100%',padding:'9px 11px',background:'#1a1a1a',border:'1.5px solid rgba(255,255,255,.12)',borderRadius:T.rs,color:'#fff',fontFamily:T.body,fontSize:12,resize:'vertical',outline:'none',lineHeight:1.6,boxSizing:'border-box'}}/>
        : <input value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={opts.placeholder||''}
            style={{width:'100%',padding:'9px 11px',background:'#1a1a1a',border:'1.5px solid rgba(255,255,255,.12)',borderRadius:T.rs,color:'#fff',fontFamily:T.body,fontSize:13,outline:'none',boxSizing:'border-box'}}/>
      }
    </div>
  );

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:1200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up"
        style={{width:'100%',maxWidth:480,borderRadius:18,overflow:'hidden',background:'#111',boxShadow:'0 24px 80px rgba(0,0,0,.8)',border:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{height:3,background:getSourceGradient()}}/>
        <div style={{padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{background:getSourceGradient(),borderRadius:8,padding:'3px 9px 3px 7px',display:'flex',alignItems:'center',gap:4}}>
              <span style={{fontSize:12}}>❄️</span>
              <span style={{fontFamily:T.font,fontWeight:800,fontSize:10,color:'#fff',whiteSpace:'nowrap'}}>Save Transcript</span>
            </div>
            <span style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.35)'}}>
              {source === 'youtube' ? 'YouTube' : source === 'spotify' ? 'Spotify' : 'Instagram'} · Web Speech API · {form.transcript.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:18,lineHeight:1}}>×</button>
        </div>
        <div style={{padding:'16px 18px',maxHeight:'70vh',overflowY:'auto'}} className="sas-scroll">
          {saved
            ? <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{fontSize:36,marginBottom:10}}>✅</div>
                <div style={{fontFamily:T.font,fontWeight:700,fontSize:15,color:'#86efac'}}>Saved!</div>
              </div>
            : <>
                {err && <div style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.3)',borderRadius:T.rs,padding:'8px 11px',color:'#f87171',fontFamily:T.body,fontSize:12,marginBottom:12}}>{err}</div>}
                {field('TITLE', 'title', {placeholder:`e.g. ${source === 'youtube' ? 'Interview with...' : source === 'spotify' ? 'Song/Album name...' : '@handle reel — topic'}`})}
                {field('SPEAKER / CREATOR', 'speaker_name', {placeholder:'e.g. John Smith or @username or Artist name'})}
                <div style={{marginBottom:12}}>
                  <label style={{display:'block',fontFamily:T.font,fontWeight:700,fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.05em',marginBottom:5}}>CATEGORY</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                    style={{width:'100%',padding:'9px 11px',background:'#1a1a1a',border:'1.5px solid rgba(255,255,255,.12)',borderRadius:T.rs,color:'#fff',fontFamily:T.body,fontSize:13,outline:'none'}}>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="spotify">Spotify</option>
                    <option value="interview">Interview</option>
                    <option value="lecture">Lecture / Talk</option>
                    <option value="podcast">Podcast</option>
                    <option value="music">Music</option>
                    <option value="central_bank">Central Bank</option>
                    <option value="government">Government</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {field('TRANSCRIPT', 'transcript', {textarea:true, rows:6})}
                <button onClick={save} disabled={saving}
                  style={{width:'100%',padding:'11px 0',background:getSourceGradient(),border:'none',color:source === 'spotify' ? '#000' : '#fff',borderRadius:T.rs,cursor:saving?'not-allowed':'pointer',fontFamily:T.font,fontWeight:700,fontSize:14,opacity:saving?.7:1}}>
                  {saving ? 'Saving…' : '💾 Save Transcript'}
                </button>
              </>
          }
        </div>
      </div>
    </div>
  );
};

const TranscriptPanel = ({active, onClose, onSave}) => {
  const [lines,   setLines]   = useState([]);
  const [running, setRunning] = useState(false);
  const [error,   setError]   = useState('');
  const recogRef  = useRef(null);
  const scrollRef = useRef(null);
  const runRef    = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const stop = useCallback(() => {
    runRef.current = false;
    setRunning(false);
    try { recogRef.current?.abort(); } catch {}
    try { recogRef.current?.stop(); } catch {}
    recogRef.current = null;
  }, []);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError('Speech Recognition not supported. Use Chrome or Edge.');
    setError('');

    const makeRecog = () => {
      const r = new SR();
      r.continuous = true; r.interimResults = true; r.maxAlternatives = 1; r.lang = 'en-US';
      r.onresult = e => {
        let finalText = '', interimText = '';
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
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') { setError('Microphone access denied.'); stop(); }
        else setError(`Error: ${e.error}`);
      };
      r.onend = () => {
        if (!runRef.current) return;
        try { const next = makeRecog(); recogRef.current = next; next.start(); } catch {}
      };
      return r;
    };

    runRef.current = true;
    setRunning(true);
    const r = makeRecog();
    recogRef.current = r;
    r.start();
  }, [stop]);

  useEffect(() => { if (!active) stop(); }, [active, stop]);
  useEffect(() => () => stop(), [stop]);

  if (!active) return null;

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:1100,
      background:'rgba(10,10,10,.97)', borderTop:'2px solid rgba(255,255,255,.1)',
      padding:'12px 16px', boxShadow:'0 -8px 32px rgba(0,0,0,.6)'
    }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:8,height:8,borderRadius:'50%',
            background:running?'#22c55e':'rgba(255,255,255,.2)',
            boxShadow:running?'0 0 8px #22c55e':'none',transition:'all .3s'
          }}/>
          <span style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:'rgba(255,255,255,.7)',letterSpacing:'.06em'}}>
            TRANSCRIPT
          </span>
          {running && <span style={{fontFamily:T.body,fontSize:10,color:'rgba(255,255,255,.3)'}}>🎙 listening…</span>}
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          {lines.filter(l=>l.final).length > 0 && (
            <button onClick={()=>{ navigator.clipboard.writeText(lines.filter(l=>l.final).map(l=>l.text).join(' ')).catch(()=>{}); }}
              style={{background:'rgba(255,255,255,.07)',border:'none',color:'rgba(255,255,255,.5)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10}}>
              Copy
            </button>
          )}
          {onSave && lines.filter(l=>l.final).length > 0 && (
            <button onClick={()=>onSave(lines.filter(l=>l.final).map(l=>l.text).join(' '))}
              style={{background:'rgba(34,197,94,.2)',border:'1px solid rgba(34,197,94,.4)',color:'#86efac',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
              💾 Save
            </button>
          )}
          {lines.length > 0 && (
            <button onClick={()=>setLines([])}
              style={{background:'rgba(255,255,255,.07)',border:'none',color:'rgba(255,255,255,.5)',padding:'3px 8px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10}}>
              Clear
            </button>
          )}
          {running
            ? <button onClick={stop}
                style={{background:'rgba(239,68,68,.25)',border:'1px solid rgba(239,68,68,.5)',color:'#f87171',padding:'4px 10px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                ■ Stop
              </button>
            : <button onClick={start}
                style={{background:IG,border:'none',color:'#fff',padding:'4px 10px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                ▶ Start
              </button>
          }
          <button onClick={onClose}
            style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',cursor:'pointer',fontSize:16,padding:'2px 5px',lineHeight:1}}>
            ×
          </button>
        </div>
      </div>

      {error && (
        <div style={{color:'#f87171',fontFamily:T.body,fontSize:11,marginBottom:7,padding:'5px 9px',background:'rgba(239,68,68,.1)',borderRadius:T.rs}}>
          {error}
        </div>
      )}

      <div ref={scrollRef}
        style={{height:80,overflowY:'auto',fontFamily:T.body,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.75,scrollBehavior:'smooth'}}
        className="sas-scroll">
        {lines.length === 0
          ? <span style={{color:'rgba(255,255,255,.2)',fontSize:12}}>
              {running ? 'Listening — audio must be audible to your mic…' : 'Press Start then play the video.'}
            </span>
          : lines.map((l,i) => (
              <span key={i} style={{color:l.final?'rgba(255,255,255,.85)':'rgba(255,255,255,.35)',transition:'color .3s'}}>
                {l.text}{' '}
              </span>
            ))
        }
      </div>
    </div>
  );
};

const InlineReelPlayer = ({post, onOpenModal, onClose}) => {
  const [loop, setLoop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
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
      {saveTranscript&&<TranscriptSaveModal text={saveTranscript} defaultTitle={post.title} defaultHandle={post.account_handle} source="instagram" onClose={()=>setSaveTranscript(null)}/>}
      <InstaEmbed url={post.post_url} loop={loop}/>
      <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
    </div>
  );
};

const ReelModal = ({post,onClose,onPrev,onNext,hasPrev,hasNext}) => {
  if(!post)return null;
  const isReelPost = isReel(post.post_url);
  const [loop, setLoop] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(()=>{
    if(!post.post_url)return;
    setMeta(null);
    const enc=encodeURIComponent(post.post_url);
    fetch(`https://api.instagram.com/oembed/?url=${enc}&omitscript=true&maxwidth=480`)
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>setMeta(d))
      .catch(()=>{});
  },[post.post_url]);

  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.95)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px',overflowY:'auto'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up"
        style={{width:'100%',maxWidth:500,borderRadius:22,overflow:'hidden',boxShadow:'0 32px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)',background:'#0a0a0a',margin:'auto'}}>
        <div style={{height:3,background:IG}}/>
        <div style={{padding:'11px 14px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
            <div style={{flexShrink:0,background:IG,borderRadius:10,padding:'3px 9px 3px 7px',display:'flex',alignItems:'center',gap:4}}>
              <span style={{fontSize:12}}>❄️</span>
              <span style={{fontFamily:T.font,fontWeight:800,fontSize:10,color:'#fff',letterSpacing:'.02em',whiteSpace:'nowrap'}}>SnowAI Instagram</span>
            </div>
            <div style={{minWidth:0}}>
              <div style={{color:'#fff',fontFamily:T.font,fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {post.account_handle?`@${post.account_handle}`:(meta?.author_name||post.title)}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
                <span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:isReelPost?'#fd1d1d':'#833ab4',flexShrink:0}}/>
                <span style={{color:'rgba(255,255,255,.4)',fontFamily:T.body,fontSize:10}}>{isReelPost?'Reel':'Post'} · {fmtDate(post.date_added)}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:5,flexShrink:0,alignItems:'center'}}>
            {isReelPost&&(
              <button onClick={()=>setLoop(l=>!l)}
                style={{background:loop?'rgba(253,29,29,.2)':'rgba(255,255,255,.1)',border:`1px solid ${loop?'rgba(253,29,29,.5)':'rgba(255,255,255,.15)'}`,color:loop?'#fd1d1d':'rgba(255,255,255,.7)',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                🔁{loop?' On':' Off'}
              </button>
            )}
            {isReelPost&&(
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
        <div style={{background:'#000'}}>
          <InstaEmbed url={post.post_url} loop={loop}/>
        </div>
        {(meta?.title||post.caption||post.notes||meta?.author_name)&&(
          <div style={{padding:'9px 14px',background:'#111',borderTop:'1px solid rgba(255,255,255,.07)'}}>
            {(meta?.title||post.caption)&&(
              <p style={{margin:'0 0 6px',fontFamily:T.body,fontSize:12,color:'rgba(255,255,255,.65)',lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical'}}>
                {meta?.title||post.caption}
              </p>
            )}
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {meta?.author_name&&<span style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.38)'}}>👤 {meta.author_name}</span>}
              {post.category_name&&<span style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.38)'}}>🏷 {post.category_name}</span>}
              {post.notes&&<span style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.38)',fontStyle:'italic'}}>📌 {post.notes}</span>}
            </div>
          </div>
        )}
        {saveTranscript&&<TranscriptSaveModal text={saveTranscript} defaultTitle={post.title} defaultHandle={post.account_handle} source="instagram" onClose={()=>setSaveTranscript(null)}/>}
        {showTranscript&&<TranscriptPanel active={true} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>}
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
  const [fetching, setFetching] = useState(false);
  
  const preview = async () => {
    const u = url.trim();
    if(!u) return;
    if(!u.includes('instagram.com')) return setErr('Please paste a valid instagram.com URL');
    setErr('');
    setFetching(true);
    
    const metadata = await fetchInstagramMetadata(u);
    const mt = u.includes('/reel/') ? 'REEL' : u.includes('/tv/') ? 'TV' : 'POST';
    
    setPost({
      id: 'qv_'+Date.now(),
      title: metadata.title || 'Quick View',
      post_url: u,
      account_handle: metadata.author || '',
      caption: metadata.title || '',
      thumbnail_url: metadata.thumbnail,
      media_type: mt,
      is_reel: mt === 'REEL',
      date_added: new Date().toISOString()
    });
    setFetching(false);
  };
  
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',zIndex:900,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{background:T.surface,borderRadius:T.r,width:'100%',maxWidth:480,boxShadow:T.shm,overflow:'hidden'}}>
        <div style={{background:IG,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:T.font,fontWeight:800,fontSize:15,color:'#fff'}}>⚡ Insta Quick-View</div>
            <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.75)',marginTop:2}}>Paste any public Instagram post/reel — auto-fetches metadata</div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:17}}>×</button>
        </div>
        <div style={{padding:18}}>
          {err&&<Toast msg={err} type="error"/>}
          <div className="sas-flex-row" style={{marginBottom:12}}>
            <Inp value={url} onChange={e=>{setUrl(e.target.value);setPost(null);setErr('');}} onKeyDown={e=>e.key==='Enter'&&preview()} insta="1" placeholder="https://www.instagram.com/reel/Cxxx…" style={{flex:1}}/>
            <Btn onClick={preview} style={{padding:'10px 16px',background:IG,color:'#fff',whiteSpace:'nowrap'}} disabled={fetching}>
              {fetching ? 'Fetching...' : 'Preview'}
            </Btn>
          </div>
          {post&&(
            <div className="sas-in">
              <div style={{background:T.surfaceAlt,borderRadius:T.rs,border:`1px solid ${T.border}`,padding:'11px 13px',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:T.body,fontSize:11,color:T.textMut,marginBottom:2}}>Detected</div>
                  <div style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>{post.media_type==='REEL'?'🎬 Reel':post.media_type==='TV'?'📺 IGTV':'📸 Post'}</div>
                  {post.account_handle && <div style={{fontSize:11,color:T.textSec,marginTop:2}}>@{post.account_handle}</div>}
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
  const [fetching, setFetching] = useState(false);
  
  const play = async () => {
    const id = ytId(url.trim());
    if(!id) return setErr('No YouTube video ID found');
    setErr('');
    setFetching(true);
    
    const title = await fetchYoutubeTitle(id);
    
    onPlay({
      id:'qp_'+Date.now(),
      video_title: title || 'Quick Play',
      video_url: url,
      youtube_embed_id: id,
      notes: null,
      category_name: ''
    });
    setUrl('');
    setFetching(false);
  };
  
  const addPL = async () => {
    const id = ytId(url.trim());
    if(!id) return setErr('No YouTube video ID found');
    setErr('');
    setFetching(true);
    
    const title = await fetchYoutubeTitle(id);
    
    onAddToPlaylist({
      id:'qp_'+Date.now(),
      video_title: title || url,
      video_url: url,
      youtube_embed_id: id,
      notes: null,
      category_name: ''
    });
    setUrl('');
    setFetching(false);
  };
  
  return(
    <div style={{background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,padding:'13px 16px',marginBottom:14,boxShadow:T.sh}}>
      <div style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,marginBottom:9,letterSpacing:'.07em'}}>⚡ QUICK PLAY — watch or queue without saving (auto-fetches titles)</div>
      {err&&<Toast msg={err} type="error"/>}
      <div className="sas-flex-row">
        <Inp value={url} onChange={e=>{setUrl(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&play()} placeholder="Paste YouTube URL or video ID…" style={{flex:1}}/>
        <Btn onClick={play} style={{padding:'10px 18px',background:YTG,color:'#fff',whiteSpace:'nowrap',boxShadow:'0 3px 10px rgba(220,38,38,.25)'}} disabled={fetching}>
          {fetching ? 'Loading...' : '▶ Play'}
        </Btn>
        <Btn onClick={addPL} style={{padding:'10px 13px',background:T.accentPale,color:T.accent,whiteSpace:'nowrap'}} disabled={fetching}>
          + Queue
        </Btn>
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

const YtCard = ({video,index,onPlayModal,onEdit,onDelete,onAddToPlaylist}) => {
  const [hov,setHov]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  const vid=video.youtube_embed_id||ytId(video.video_url);
  return(
    <div className="sas-card sas-in" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{animationDelay:`${index*.04}s`,background:T.surface,borderRadius:T.r,border:`1px solid ${expanded?T.accent:hov?T.accentMid:T.border}`,overflow:'hidden',boxShadow:expanded?`0 0 0 2px ${T.accent},${T.shm}`:T.sh,display:'flex',flexDirection:'column'}}>
      <div onClick={()=>setExpanded(e=>!e)} style={{position:'relative',paddingTop:'56.25%',cursor:'pointer',background:'#0f172a',overflow:'hidden'}}>
        {vid&&<img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={video.video_title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'transform .3s',transform:hov?'scale(1.05)':'scale(1)'}}/>}
        <div style={{position:'absolute',inset:0,background:`rgba(15,23,42,${hov?.35:.15})`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>
          <div style={{background:expanded?T.accent:'rgba(255,255,255,.92)',borderRadius:'50%',width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,boxShadow:'0 3px 12px rgba(0,0,0,.3)',transform:hov?'scale(1.1)':'scale(1)',transition:'all .2s'}}>{expanded?<span style={{color:'#fff',fontSize:13}}>■</span>:'▶'}</div>
        </div>
        <div style={{position:'absolute',top:7,left:7}}><Badge label="YT" bg="#dc2626"/></div>
      </div>
      {expanded && (
        <div style={{width:'100%',aspectRatio:'16/9',background:'#000',flexShrink:0}} className="sas-in">
          <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1`} title={video.video_title}
            frameBorder="0" style={{width:'100%',height:'100%',display:'block'}}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
      )}
      <div style={{padding:'10px 12px',flex:1,display:'flex',flexDirection:'column',gap:5}}>
        <div onClick={()=>setExpanded(e=>!e)} style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:T.text,cursor:'pointer',lineHeight:1.4,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{video.video_title}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4}}>
          <Badge label={video.category_name||'–'} bg={T.accentPale} color={T.accent}/>
          <span style={{fontSize:11,color:T.textMut,fontFamily:T.body}}>{fmtDate(video.date_entered)}</span>
        </div>
        {video.notes&&<p style={{fontFamily:T.body,fontSize:12,color:T.textSec,lineHeight:1.5,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{video.notes}</p>}
      </div>
      <div style={{display:'flex',gap:5,padding:'8px 12px',borderTop:`1px solid ${T.borderLight}`,flexWrap:'wrap'}}>
        <Btn onClick={()=>setExpanded(e=>!e)} style={{flex:1,padding:'6px 0',background:expanded?'#dc2626':YTG,color:'#fff',fontSize:12,minWidth:60}}>{expanded?'■ Stop':'▶ Play'}</Btn>
        <Btn onClick={()=>setShowTranscript(true)} style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}} title="Record Transcript">📝</Btn>
        <Btn onClick={()=>setShowVoiceHelper(true)} style={{padding:'6px 10px',background:'#667eea',color:'#fff',fontSize:12}} title="Create Voice Shortcut">🎤</Btn>
        <Btn onClick={()=>onPlayModal(video)} title="Open full view" style={{padding:'6px 10px',background:T.surfaceAlt,color:T.textSec,fontSize:13,border:`1px solid ${T.border}`}}>⛶</Btn>
        <Btn onClick={()=>onAddToPlaylist(video)} title="Add to playlist" style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>🎵</Btn>
        <Btn onClick={()=>onEdit(video)} style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>✎</Btn>
        <Btn onClick={()=>onDelete(video.id)} style={{padding:'6px 10px',background:'#fef2f2',color:T.danger,fontSize:12}}>🗑</Btn>
      </div>
      {saveTranscript && <TranscriptSaveModal text={saveTranscript} defaultTitle={video.video_title} source="youtube" onClose={()=>setSaveTranscript(null)}/>}
      <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
      {showVoiceHelper && <VoiceShortcutHelper onClose={()=>setShowVoiceHelper(false)} item={video} itemType="youtube" itemName={video.video_title} />}
    </div>
  );
};

const IgCard = ({post,index,onPlayModal,onEdit,onDelete}) => {
  const [hov,setHov]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [preloaded,setPreloaded]=useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  const reel = isReel(post.post_url);
  const code = igShortcode(post.post_url);
  const embedUrl = code ? `https://www.instagram.com/p/${code}/embed/` : null;
  return(
    <div className="sas-card sas-in" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{animationDelay:`${index*.04}s`,background:T.surface,borderRadius:T.r,border:`1px solid ${expanded?'#c13584':hov?'#c13584':T.border}`,overflow:'hidden',boxShadow:expanded?`0 0 0 2px #c13584,${T.shm}`:T.sh,display:'flex',flexDirection:'column',transition:'all .22s ease'}}>
      {!expanded && (
        <div onClick={()=>setExpanded(true)} style={{position:'relative',height:220,background:'linear-gradient(135deg,#1a1a2e,#16213e)',overflow:'hidden',cursor:'pointer',flexShrink:0}}>
          {embedUrl && (
            <iframe src={embedUrl}
              style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none',pointerEvents:'none',opacity:preloaded?1:0,transition:'opacity .4s'}}
              scrolling="no" allowTransparency="true"
              onLoad={()=>setPreloaded(true)}/>
          )}
          {!preloaded && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,zIndex:1}}>
              {reel?'🎬':'📸'}
            </div>
          )}
          <div style={{position:'absolute',inset:0,background:`rgba(0,0,0,${hov?.3:0})`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .22s',zIndex:2}}>
            {hov&&<div style={{background:'rgba(255,255,255,.94)',borderRadius:'50%',width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,boxShadow:'0 3px 14px rgba(0,0,0,.4)'}}>▶</div>}
          </div>
          <div style={{position:'absolute',top:7,left:7,zIndex:3}}><Badge label={reel?'REEL':'POST'} bg={reel?IG:'rgba(0,0,0,.55)'}/></div>
        </div>
      )}
      {expanded && (
        <div style={{background:'#000',borderTop:'2px solid #c13584',flexShrink:0}} className="sas-in">
          <iframe src={embedUrl}
            style={{width:'100%',minHeight:480,border:'none',display:'block'}}
            scrolling="no" allowTransparency="true"/>
        </div>
      )}
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
        <Btn onClick={()=>setExpanded(e=>!e)} style={{flex:1,padding:'6px 0',background:expanded?'rgba(193,53,132,.8)':IG,color:'#fff',fontSize:12}}>{expanded?'■ Stop':'▶ Play'}</Btn>
        <Btn onClick={()=>setShowTranscript(true)} style={{padding:'6px 10px',background:'rgba(193,53,132,.1)',color:T.iD,fontSize:12}} title="Record Transcript">📝</Btn>
        <Btn onClick={()=>setShowVoiceHelper(true)} style={{padding:'6px 10px',background:'#667eea',color:'#fff',fontSize:12}} title="Create Voice Shortcut">🎤</Btn>
        <Btn onClick={()=>onPlayModal(post)} title="Open full view" style={{padding:'6px 10px',background:T.surfaceAlt,color:T.textSec,fontSize:13,border:`1px solid ${T.border}`}}>⛶</Btn>
        <Btn onClick={()=>onEdit(post)} style={{padding:'6px 10px',background:T.accentPale,color:T.accent,fontSize:12}}>✎</Btn>
        <Btn onClick={()=>onDelete(post.id)} style={{padding:'6px 10px',background:'#fef2f2',color:T.danger,fontSize:12}}>🗑</Btn>
      </div>
      {saveTranscript && <TranscriptSaveModal text={saveTranscript} defaultTitle={post.title} defaultHandle={post.account_handle} source="instagram" onClose={()=>setSaveTranscript(null)}/>}
      <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
      {showVoiceHelper && <VoiceShortcutHelper onClose={()=>setShowVoiceHelper(false)} item={post} itemType="instagram" itemName={post.title} />}
    </div>
  );
};

const YtModal = ({video, embedId, onClose, playlist, onPlNext, onPlPrev, onPlJump, onPlLoop, loopPl, plIdx}) => {
  if (!video) return null;
  const hasPl = !!(playlist && playlist.queue && playlist.queue.length > 0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{width:'100%',maxWidth:680,borderRadius:22,overflow:'hidden',boxShadow:'0 32px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)',background:'#0a0a0a',display:'flex',flexDirection:'column'}}>
        <div style={{flexShrink:0}}>
          <div style={{height:3,background:YTG,width:'100%'}}/>
          <div style={{padding:'13px 16px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
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
            <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
              <button onClick={()=>setShowTranscript(t=>!t)}
                style={{background:showTranscript?YTG:'rgba(255,255,255,.1)',border:`1px solid ${showTranscript?'transparent':'rgba(255,255,255,.15)'}`,color:'#fff',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                📝
              </button>
              <button onClick={()=>setShowVoiceHelper(true)}
                style={{background:'#667eea',border:'none',color:'#fff',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
                🎤
              </button>
              <button onClick={onClose}
                style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>×</button>
            </div>
          </div>
        </div>
        <div style={{width:'100%',aspectRatio:'16/9',background:'#000',flexShrink:0}}>
          <iframe src={`https://www.youtube.com/embed/${embedId}?autoplay=1&enablejsapi=1`}
            title={video.video_title} frameBorder="0" style={{width:'100%',height:'100%',display:'block'}}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
        </div>
        {video.notes && (
          <div style={{flexShrink:0,padding:'8px 14px',background:'#111',borderTop:'1px solid rgba(255,255,255,.06)'}}>
            <span style={{fontFamily:T.body,fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}><strong style={{color:'rgba(255,255,255,.7)'}}>Notes:</strong> {video.notes}</span>
          </div>
        )}
        {hasPl && (
          <div style={{flexShrink:0,borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',gap:8}}>
              <button onClick={onPlPrev} disabled={plIdx===0&&!loopPl} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',color:'#fff',padding:'7px 18px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:12,opacity:(plIdx===0&&!loopPl)?.35:1}}>← Prev</button>
              <button onClick={onPlLoop} style={{background:loopPl?'rgba(239,68,68,.2)':'rgba(255,255,255,.06)',border:`1px solid ${loopPl?'rgba(239,68,68,.5)':'rgba(255,255,255,.12)'}`,color:loopPl?'#fca5a5':'rgba(255,255,255,.6)',padding:'7px 14px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:11,fontWeight:600}}>🔁 Loop {loopPl?'On':'Off'}</button>
              <div style={{fontFamily:T.font,fontWeight:800,fontSize:10,letterSpacing:'.1em',background:YTG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',userSelect:'none'}}>SNOWAI</div>
              <button onClick={onPlNext} disabled={plIdx===playlist.queue.length-1&&!loopPl} style={{background:'rgba(220,38,38,.7)',border:'none',color:'#fff',padding:'7px 18px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:12,opacity:(plIdx===playlist.queue.length-1&&!loopPl)?.35:1}}>Next →</button>
            </div>
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
        {!hasPl && (
          <div style={{display:'flex',justifyContent:'center',padding:'9px 14px',background:'#0a0a0a',borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <div style={{fontFamily:T.font,fontWeight:800,fontSize:10,letterSpacing:'.1em',background:YTG,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',userSelect:'none'}}>SNOWAI</div>
          </div>
        )}
        {saveTranscript&&<TranscriptSaveModal text={saveTranscript} defaultTitle={video.video_title} source="youtube" onClose={()=>setSaveTranscript(null)}/>}
        <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
        {showVoiceHelper && <VoiceShortcutHelper onClose={()=>setShowVoiceHelper(false)} item={video} itemType="youtube" itemName={video.video_title} />}
      </div>
    </div>
  );
};

// Spotify Card with Transcript and Voice Shortcut
const SpCard = ({ entry, index, onPlay, onEdit, onDelete }) => {
  const [hov, setHov] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  const m = SP_TYPE[entry.spotify_type] || SP_TYPE.track;
  const isTrack = entry.spotify_type === 'track';
  
  return (
    <div className="sas-card sas-in" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{animationDelay:`${index*.04}s`,background:'#0a0a0a',borderRadius:T.r,border:`1px solid ${hov?SP_GREEN:T.border}`,overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:T.sh,transition:'all .22s'}}>
      {isTrack && (
        <div style={{padding:'10px 10px 0'}}>
          <iframe src={spEmbedUrl(entry.spotify_type, entry.spotify_id)} width="100%" height={80} style={{border:'none',display:'block',borderRadius:6}} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
        </div>
      )}
      {!isTrack && (
        <div onClick={()=>onPlay(entry)} style={{height:110,cursor:'pointer',position:'relative',background:`linear-gradient(135deg,${m.color}22,${m.color}08)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:38}}>{m.emoji}</span>
          <div style={{position:'absolute',top:8,left:8}}><span style={{background:`${m.color}22`,color:m.color,border:`1px solid ${m.color}44`,borderRadius:5,padding:'2px 7px',fontSize:10,fontWeight:700,fontFamily:T.font}}>{m.emoji} {m.label}</span></div>
        </div>
      )}
      <div style={{padding:'10px 12px',flex:1,display:'flex',flexDirection:'column',gap:4}}>
        <div style={{fontFamily:T.font,fontWeight:700,fontSize:13,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{entry.title}</div>
        {entry.artist && <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{entry.artist}</div>}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4,marginTop:2}}>
          {isTrack && <span style={{background:`${m.color}22`,color:m.color,border:`1px solid ${m.color}44`,borderRadius:5,padding:'2px 7px',fontSize:10,fontWeight:700,fontFamily:T.font}}>{m.emoji} {m.label}</span>}
          <span style={{fontFamily:T.body,fontSize:10,color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.06)',padding:'2px 7px',borderRadius:20}}>{entry.category_name||'—'}</span>
          <span style={{fontFamily:T.body,fontSize:10,color:'rgba(255,255,255,.3)'}}>{fmtDate(entry.date_added)}</span>
        </div>
        {entry.notes && <p style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.35)',margin:0,lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{entry.notes}</p>}
      </div>
      <div style={{display:'flex',gap:5,padding:'8px 12px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <Btn onClick={()=>onPlay(entry)} style={{flex:1,padding:'6px 0',background:SPG,color:'#000',fontSize:12,fontWeight:700}}>▶ Play</Btn>
        <Btn onClick={()=>setShowTranscript(true)} style={{padding:'6px 10px',background:'rgba(30,215,96,.1)',color:SP_GREEN,fontSize:12}} title="Record Transcript">📝</Btn>
        <Btn onClick={()=>setShowVoiceHelper(true)} style={{padding:'6px 10px',background:'#667eea',color:'#fff',fontSize:12}} title="Create Voice Shortcut">🎤</Btn>
        <Btn onClick={()=>onEdit(entry)} style={{padding:'6px 10px',background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.5)',fontSize:12}}>✎</Btn>
        <Btn onClick={()=>onDelete(entry.id)} style={{padding:'6px 10px',background:'rgba(239,68,68,.1)',color:'#f87171',fontSize:12}}>🗑</Btn>
      </div>
      {saveTranscript && <TranscriptSaveModal text={saveTranscript} defaultTitle={entry.title} defaultHandle={entry.artist} source="spotify" onClose={()=>setSaveTranscript(null)}/>}
      <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
      {showVoiceHelper && <VoiceShortcutHelper onClose={()=>setShowVoiceHelper(false)} item={entry} itemType="spotify" itemName={entry.title} />}
    </div>
  );
};

// Spotify Modal with Transcript and Voice Shortcut
const SpModal = ({ entry, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  if (!entry) return null;
  const m = SP_TYPE[entry.spotify_type] || SP_TYPE.track;
  const isTrack = entry.spotify_type === 'track';
  const [showTranscript, setShowTranscript] = useState(false);
  const [saveTranscript, setSaveTranscript] = useState(null);
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px'}}>
      <div onClick={e=>e.stopPropagation()} className="sas-up" style={{width:'100%',maxWidth:580,borderRadius:22,overflow:'hidden',boxShadow:'0 32px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.06)',background:'#0a0a0a',display:'flex',flexDirection:'column'}}>
        <div style={{height:3,background:SPG,width:'100%'}}/>
        <div style={{padding:'13px 16px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,background:'#0a0a0a'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
            <div style={{flexShrink:0,background:SPG,borderRadius:10,padding:'3px 10px 3px 8px',display:'flex',alignItems:'center',gap:5}}>
              <span style={{fontSize:13}}>❄️</span>
              <span style={{fontFamily:T.font,fontWeight:800,fontSize:11,color:'#000',letterSpacing:'.02em',whiteSpace:'nowrap'}}>SnowAI Spotify</span>
            </div>
            <div style={{minWidth:0}}>
              <div style={{color:'#fff',fontFamily:T.font,fontWeight:700,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{entry.title}</div>
              <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
                <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:m.color,flexShrink:0}}/>
                <span style={{color:'rgba(255,255,255,.45)',fontFamily:T.body,fontSize:10}}>{m.emoji} {m.label} · {entry.category_name || 'Uncategorized'}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
            <button onClick={()=>setShowTranscript(t=>!t)}
              style={{background:showTranscript?SPG:'rgba(255,255,255,.1)',border:`1px solid ${showTranscript?'transparent':'rgba(255,255,255,.15)'}`,color:showTranscript?'#000':'#fff',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
              📝
            </button>
            <button onClick={()=>setShowVoiceHelper(true)}
              style={{background:'#667eea',border:'none',color:'#fff',padding:'4px 9px',borderRadius:T.rs,cursor:'pointer',fontFamily:T.body,fontSize:10,fontWeight:700}}>
              🎤
            </button>
            <button onClick={onClose}
              style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.8)',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontSize:17,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
          </div>
        </div>
        
        <div style={{background:'#000',padding: isTrack ? '12px' : '20px'}}>
          <iframe 
            src={spEmbedUrl(entry.spotify_type, entry.spotify_id)} 
            width="100%" 
            height={isTrack ? 80 : 380} 
            style={{border:'none',display:'block',borderRadius:8}} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          />
        </div>
        
        {entry.artist && (
          <div style={{flexShrink:0,padding:'8px 14px',background:'#111',borderTop:'1px solid rgba(255,255,255,.06)'}}>
            <span style={{fontFamily:T.body,fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}><strong style={{color:'rgba(255,255,255,.7)'}}>Artist:</strong> {entry.artist}</span>
          </div>
        )}
        {entry.notes && (
          <div style={{flexShrink:0,padding:'8px 14px',background:'#111',borderTop:'1px solid rgba(255,255,255,.06)'}}>
            <span style={{fontFamily:T.body,fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}><strong style={{color:'rgba(255,255,255,.7)'}}>Notes:</strong> {entry.notes}</span>
          </div>
        )}
        
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'#0a0a0a',borderTop:'1px solid rgba(255,255,255,.07)'}}>
          <button onClick={onPrev} disabled={!hasPrev} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',color:'#fff',padding:'7px 18px',borderRadius:T.rs,cursor:hasPrev?'pointer':'not-allowed',fontFamily:T.body,fontSize:12,opacity:hasPrev?1:0.35}}>← Prev</button>
          <a href={entry.spotify_url || `https://open.spotify.com/${entry.spotify_type}/${entry.spotify_id}`} target="_blank" rel="noopener noreferrer" style={{padding:'7px 18px',background:SPG,color:'#000',borderRadius:T.rs,fontFamily:T.font,fontWeight:700,fontSize:12,textDecoration:'none'}}>Open in Spotify ↗</a>
          <button onClick={onNext} disabled={!hasNext} style={{background:SPG,border:'none',color:'#000',padding:'7px 18px',borderRadius:T.rs,cursor:hasNext?'pointer':'not-allowed',fontFamily:T.body,fontSize:12,fontWeight:700,opacity:hasNext?1:0.35}}>Next →</button>
        </div>
        
        {saveTranscript && <TranscriptSaveModal text={saveTranscript} defaultTitle={entry.title} defaultHandle={entry.artist} source="spotify" onClose={()=>setSaveTranscript(null)}/>}
        <TranscriptPanel active={showTranscript} onClose={()=>setShowTranscript(false)} onSave={t=>{setShowTranscript(false);setSaveTranscript(t);}}/>
        {showVoiceHelper && <VoiceShortcutHelper onClose={()=>setShowVoiceHelper(false)} item={entry} itemType="spotify" itemName={entry.title} />}
      </div>
    </div>
  );
};

const SpotifyQuickPlay = ({ setSpPlaying }) => {
  const [spQUrl, setSpQUrl] = useState('');
  const [spQErr, setSpQErr] = useState('');
  const [fetching, setFetching] = useState(false);
  
  const doPlay = async () => {
    const { type, id } = parseSpotify(spQUrl.trim());
    if (!type || !id) return setSpQErr('Paste a valid Spotify link');
    setSpQErr('');
    setFetching(true);
    
    const metadata = await fetchSpotifyMetadata(type, id);
    
    setSpPlaying({ 
      id: 'qp_' + Date.now(), 
      title: metadata.title || 'Quick Play',
      artist: metadata.author || '',
      spotify_type: type, 
      spotify_id: id, 
      spotify_url: spQUrl 
    });
    setSpQUrl('');
    setFetching(false);
  };
  
  return (
    <>
      {spQErr && <Toast msg={spQErr} type="error"/>}
      <div className="sas-flex-row">
        <Inp 
          value={spQUrl} 
          onChange={e => { setSpQUrl(e.target.value); setSpQErr(''); }} 
          onKeyDown={e => e.key === 'Enter' && doPlay()} 
          placeholder="Paste Spotify URL or URI — auto-fetches title & artist…" 
          style={{ flex: 1 }}
        />
        <Btn onClick={doPlay} style={{ padding: '10px 18px', background: SPG, color: '#000', fontWeight: 700, whiteSpace: 'nowrap' }} disabled={fetching}>
          {fetching ? 'Loading...' : '▶ Play'}
        </Btn>
      </div>
    </>
  );
};

export default function SnowAIVideos() {
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
  const [igFormOpen,setIgFormOpen]=useState(false);
  const [igEditing,setIgEditing]=useState(null);
  const [igForm,setIgForm]=useState({title:'',post_url:'',category_id:'',account_handle:'',notes:''});
  const [igCatForm,setIgCatForm]=useState(false);
  const [igNewCat,setIgNewCat]=useState('');
  const [igView,setIgView]=useState('grid');
  const [showIgQV,setShowIgQV]=useState(false);

  const [spEntries,setSpEntries]=useState([]);
  const [spFiltered,setSpFiltered]=useState([]);
  const [spCats,setSpCats]=useState([]);
  const [spCat,setSpCat]=useState('all');
  const [spSearch,setSpSearch]=useState('');
  const [spTypeFilter,setSpTypeFilter]=useState('all');
  const [spPlaying,setSpPlaying]=useState(null);
  const [spPlayIdx,setSpPlayIdx]=useState(null);
  const [spFormOpen,setSpFormOpen]=useState(false);
  const [spEditing,setSpEditing]=useState(null);
  const [spForm,setSpForm]=useState({title:'',artist:'',spotify_url:'',category_id:'',notes:''});
  const [spCatForm,setSpCatForm]=useState(false);
  const [spNewCat,setSpNewCat]=useState('');
  const [spUrlPreview,setSpUrlPreview]=useState(null);

  // Deep link handler for voice shortcuts
  useEffect(() => {
    const handleDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');
      const type = urlParams.get('type');
      const id = urlParams.get('id');
      const query = urlParams.get('q');
      const playlistName = urlParams.get('name');
      
      if (action === 'play' && type && id) {
        if (type === 'youtube') {
          const video = ytVideos.find(v => v.id === id);
          if (video) {
            setTab('youtube');
            setYtPlaying(video);
            showToast(`Playing: ${video.video_title}`, 'success');
          } else {
            showToast('Video not found in your library', 'warn');
          }
        } else if (type === 'spotify') {
          const spotify = spEntries.find(s => s.id === id);
          if (spotify) {
            setTab('spotify');
            setSpPlaying(spotify);
            showToast(`Playing: ${spotify.title}`, 'success');
          } else {
            showToast('Spotify item not found', 'warn');
          }
        } else if (type === 'instagram') {
          const post = igPosts.find(p => p.id === id);
          if (post) {
            setTab('instagram');
            setIgPlaying(post);
            showToast(`Opening: ${post.title}`, 'success');
          } else {
            showToast('Post not found', 'warn');
          }
        }
      } else if (action === 'search' && query) {
        if (type === 'youtube') {
          setTab('youtube');
          setYtSearch(query);
          showToast(`Searching YouTube for: ${query}`, 'success');
        } else if (type === 'spotify') {
          setTab('spotify');
          setSpSearch(query);
          showToast(`Searching Spotify for: ${query}`, 'success');
        } else if (type === 'instagram') {
          setTab('instagram');
          setIgSearch(query);
          showToast(`Searching Instagram for: ${query}`, 'success');
        }
      } else if (action === 'playlist' && playlistName) {
        const playlist = playlists.find(p => p.name === playlistName);
        if (playlist && playlist.queue.length) {
          setActivePL(playlist);
          setPlIdx(0);
          setYtPlaying(playlist.queue[0]);
          setTab('youtube');
          showToast(`Playing playlist: ${playlistName}`, 'success');
        } else {
          showToast('Playlist not found', 'warn');
        }
      } else if (action === 'tab' && query) {
        setTab(query);
        showToast(`Switched to ${query} tab`, 'success');
      }
      
      // Clean URL after handling
      if (action) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    handleDeepLink();
    window.addEventListener('popstate', handleDeepLink);
    return () => window.removeEventListener('popstate', handleDeepLink);
  }, [ytVideos, spEntries, igPosts, playlists]);

  useEffect(()=>{fetchYtCats();fetchYtVideos();},[]);
  useEffect(()=>{fetchIgCats();fetchIgPosts();},[]);
  useEffect(()=>{fetchSpCats();fetchSpEntries();},[]);
  useEffect(()=>{try{const s=localStorage.getItem('sas_playlists');if(s)setPlaylists(JSON.parse(s));}catch{}},[]);
  useEffect(()=>{const{type,id}=parseSpotify(spForm.spotify_url||'');setSpUrlPreview(type&&id?{type,id}:null);},[spForm.spotify_url]);

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

  const fetchSpCats=async()=>{try{const r=await fetch(`${BASE}/api/snowai-spotify-categories/`);const d=await r.json();setSpCats(d.categories||[]);}catch{}};
  const fetchSpEntries=async(cid=null,typ=null)=>{setLoading(true);try{let url=`${BASE}/api/snowai-spotify-entries/`;const p=[];if(cid)p.push(`category_id=${cid}`);if(typ&&typ!=='all')p.push(`type=${typ}`);if(p.length)url+='?'+p.join('&');const r=await fetch(url);const d=await r.json();setSpEntries(d.entries||[]);setSpFiltered(d.entries||[]);}catch{showToast('Failed to load Spotify entries','error');}finally{setLoading(false);}};
  const handleSpCatF=id=>{setSpCat(id);setSpSearch('');fetchSpEntries(id==='all'?null:id,spTypeFilter);};
  const handleSpTypeF=t=>{setSpTypeFilter(t);setSpSearch('');fetchSpEntries(spCat==='all'?null:spCat,t);};
  const handleSpAddCat=async e=>{e.preventDefault();if(!spNewCat.trim())return;try{const r=await fetch(`${BASE}/api/snowai-spotify-categories/create/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category_name:spNewCat})});if(r.ok){setSpNewCat('');setSpCatForm(false);fetchSpCats();}}catch{showToast('Failed','error');}};
  const handleSpSubmit=async e=>{e.preventDefault();if(!spForm.title||!spForm.spotify_url||!spForm.category_id)return showToast('Title, URL and category required','error');const{type,id}=parseSpotify(spForm.spotify_url);if(!type||!id)return showToast('Could not parse Spotify URL','error');try{const url=spEditing?`${BASE}/api/snowai-spotify-entries/${spEditing.id}/update/`:`${BASE}/api/snowai-spotify-entries/create/`;const r=await fetch(url,{method:spEditing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...spForm,spotify_type:type,spotify_id:id})});if(r.ok){setSpForm({title:'',artist:'',spotify_url:'',category_id:'',notes:''});setSpFormOpen(false);setSpEditing(null);fetchSpEntries(spCat==='all'?null:spCat,spTypeFilter);showToast('Saved 🎵');}else{const d=await r.json();showToast(d.error||'Save failed','error');}}catch{showToast('Failed','error');}};
  const handleSpEdit=e=>{setSpEditing(e);setSpForm({title:e.title,artist:e.artist||'',spotify_url:e.spotify_url||`https://open.spotify.com/${e.spotify_type}/${e.spotify_id}`,category_id:e.category_id||'',notes:e.notes||''});setSpFormOpen(true);};
  const handleSpDelete=async id=>{if(!window.confirm('Delete?'))return;try{await fetch(`${BASE}/api/snowai-spotify-entries/${id}/delete/`,{method:'DELETE'});fetchSpEntries(spCat==='all'?null:spCat,spTypeFilter);if(spPlaying?.id===id)setSpPlaying(null);showToast('Deleted');}catch{showToast('Failed','error');}};
  const handleSpPlay = (entry) => {
    const idx = spFiltered.findIndex(e => e.id === entry.id);
    setSpPlayIdx(idx >= 0 ? idx : null);
    setSpPlaying(entry);
  };
  const handleSpNext = () => {
    if (spPlayIdx === null) return;
    const next = spPlayIdx + 1;
    if (next < spFiltered.length) {
      setSpPlayIdx(next);
      setSpPlaying(spFiltered[next]);
    }
  };
  const handleSpPrev = () => {
    if (spPlayIdx === null) return;
    const prev = spPlayIdx - 1;
    if (prev >= 0) {
      setSpPlayIdx(prev);
      setSpPlaying(spFiltered[prev]);
    }
  };

  const secBtn=(active,type)=>{
    let bg = 'transparent';
    let color = T.textSec;
    let border = `2px solid ${T.border}`;
    let shadow = 'none';
    if (active) {
      if (type === 'spotify') { bg = SPG; color = '#000'; }
      else if (type === 'instagram') { bg = IG; color = '#fff'; }
      else { bg = AG; color = '#fff'; }
      border = '2px solid transparent';
      shadow = T.shm;
    }
    return {padding:'10px 20px',background:bg,color,border,borderRadius:T.rl,cursor:'pointer',fontFamily:T.font,fontWeight:700,fontSize:14,transition:'all .2s',boxShadow:shadow};
  };

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
            <p style={{fontFamily:T.body,color:T.textMut,margin:'3px 0 0',fontSize:12}}>YouTube, Instagram & Spotify in one place with auto-fetch, transcript recording, and voice shortcuts! 🎤</p>
          </div>

          <div style={{display:'flex',gap:6,marginBottom:16,background:T.surface,padding:4,borderRadius:T.rl,border:`1px solid ${T.border}`,width:'fit-content',boxShadow:T.sh}}>
            <button style={secBtn(tab==='youtube','youtube')}   onClick={()=>setTab('youtube')}>▶ YouTube</button>
            <button style={secBtn(tab==='instagram','instagram')} onClick={()=>setTab('instagram')}>📸 Instagram</button>
            <button style={secBtn(tab==='spotify','spotify')}   onClick={()=>setTab('spotify')}>🎵 Spotify</button>
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
                <Btn onClick={()=>{setYtFormOpen(true);setYtEditing(null);setYtForm({video_title:'',video_url:'',category_id:'',notes:''});}} style={{padding:'10px 16px',background:YTG,color:'#fff',whiteSpace:'nowrap'}}>+ Save</Btn>
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
                    {ytFiltered.map((v,i)=><YtCard key={v.id} video={v} index={i} onPlayModal={v=>{setActivePL(null);setYtPlaying(v);}} onEdit={handleYtEdit} onDelete={handleYtDelete} onAddToPlaylist={handleAddToPL}/>)}
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
                    <div style={{fontFamily:T.body,fontSize:11,color:'rgba(255,255,255,.75)',marginTop:2}}>Save posts & reels, or quick-view any public URL with auto-fetch.</div>
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
                <Btn onClick={()=>{setIgFormOpen(true);setIgEditing(null);setIgForm({title:'',post_url:'',category_id:'',account_handle:'',notes:''});}} style={{padding:'10px 16px',background:IG,color:'#fff',whiteSpace:'nowrap',boxShadow:'0 3px 10px rgba(193,53,132,.3)'}}>+ Save</Btn>
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
                <div className="sas-grid-ig">{igFiltered.map((p,i)=><IgCard key={p.id} post={p} index={i} onPlayModal={handleIgPlay} onEdit={handleIgEdit} onDelete={handleIgDelete}/>)}</div>
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

          {tab==='spotify'&&(
            <div className="sas-in">
              <div style={{background:SPG,borderRadius:T.r,padding:'13px 16px',marginBottom:14,boxShadow:'0 6px 24px rgba(30,215,96,.25)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div>
                    <div style={{fontFamily:T.font,fontWeight:800,fontSize:17,color:'#000',letterSpacing:'-.02em'}}>SnowAI Spotify 🎵</div>
                    <div style={{fontFamily:T.body,fontSize:11,color:'rgba(0,0,0,.55)',marginTop:2}}>Save tracks, albums, playlists, podcasts — auto-fetches metadata + transcripts + voice shortcuts!</div>
                  </div>
                  <Btn onClick={()=>{setSpFormOpen(true);setSpEditing(null);setSpForm({title:'',artist:'',spotify_url:'',category_id:'',notes:''}); }} style={{padding:'8px 16px',background:'#000',color:SP_GREEN,fontSize:12,fontWeight:700,border:'none'}}>+ Save</Btn>
                </div>
              </div>

              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.r,padding:'13px 16px',marginBottom:14,boxShadow:T.sh}}>
                <div style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:T.textMut,marginBottom:9,letterSpacing:'.07em'}}>⚡ QUICK PLAY — listen without saving (auto-fetches title & artist)</div>
                <SpotifyQuickPlay setSpPlaying={setSpPlaying} />
              </div>

              {spPlaying && typeof spPlaying.id === 'string' && spPlaying.id.startsWith('qp_') && (
                <div style={{marginBottom:14,background:'#0a0a0a',borderRadius:T.r,border:'1px solid rgba(30,215,96,.3)',padding:'12px',boxShadow:'0 4px 24px rgba(30,215,96,.1)'}} className="sas-in">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:SP_GREEN,animation:'sas-spin 2s linear infinite'}}/>
                      <span style={{fontFamily:T.font,fontWeight:700,fontSize:11,color:SP_GREEN,letterSpacing:'.06em'}}>QUICK PLAY</span>
                      <span style={{background:`${(SP_TYPE[spPlaying.spotify_type]||SP_TYPE.track).color}22`,color:(SP_TYPE[spPlaying.spotify_type]||SP_TYPE.track).color,border:`1px solid ${(SP_TYPE[spPlaying.spotify_type]||SP_TYPE.track).color}44`,borderRadius:5,padding:'2px 7px',fontSize:10,fontWeight:700,fontFamily:T.font}}>
                        {(SP_TYPE[spPlaying.spotify_type]||SP_TYPE.track).emoji} {(SP_TYPE[spPlaying.spotify_type]||SP_TYPE.track).label}
                      </span>
                    </div>
                    <button onClick={()=>setSpPlaying(null)} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.5)',borderRadius:'50%',width:26,height:26,cursor:'pointer',fontSize:14}}>×</button>
                  </div>
                  {spPlaying.title && <div style={{color:'#fff',fontSize:12,marginBottom:8}}>{spPlaying.title}{spPlaying.artist && ` · ${spPlaying.artist}`}</div>}
                  <iframe src={spEmbedUrl(spPlaying.spotify_type,spPlaying.spotify_id)} width="100%" height={SP_EMBED_H[spPlaying.spotify_type]||380} style={{border:'none',display:'block',borderRadius:8}} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
                </div>
              )}

              <SC>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>Categories</span>
                  <Btn onClick={()=>setSpCatForm(v=>!v)} style={{padding:'5px 10px',background:'rgba(30,215,96,.12)',color:SP_GREEN,fontSize:12}}>{spCatForm?'Cancel':'+ Category'}</Btn>
                </div>
                {spCatForm&&(<form onSubmit={handleSpAddCat} style={{display:'flex',gap:8,marginBottom:10}}><Inp value={spNewCat} onChange={e=>setSpNewCat(e.target.value)} placeholder="Category name" style={{flex:1}}/><Btn type="submit" style={{padding:'10px 14px',background:SPG,color:'#000'}}>Add</Btn></form>)}
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  <button style={{padding:'5px 13px',background:spCat==='all'?SPG:'transparent',color:spCat==='all'?'#000':T.accent,border:`1.5px solid ${spCat==='all'?'transparent':T.border}`,borderRadius:15,cursor:'pointer',fontFamily:T.body,fontWeight:600,fontSize:12}} onClick={()=>handleSpCatF('all')}>All</button>
                  {spCats.map(c=><button key={c.id} style={{padding:'5px 13px',background:spCat===c.id?SPG:'transparent',color:spCat===c.id?'#000':T.accent,border:`1.5px solid ${spCat===c.id?'transparent':T.border}`,borderRadius:15,cursor:'pointer',fontFamily:T.body,fontWeight:600,fontSize:12}} onClick={()=>handleSpCatF(c.id)}>{c.category_name}</button>)}
                </div>
              </SC>

              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                {['all','track','album','playlist','artist','episode','show'].map(t=>{
                  const m=SP_TYPE[t]||{color:SP_GREEN,emoji:'',label:'All'};
                  const active=spTypeFilter===t;
                  return(<button key={t} onClick={()=>handleSpTypeF(t)} style={{padding:'5px 12px',background:active?`${m.color}22`:'transparent',color:active?m.color:T.textMut,border:`1px solid ${active?m.color:T.border}`,borderRadius:20,cursor:'pointer',fontFamily:T.body,fontWeight:600,fontSize:11,transition:'all .18s',whiteSpace:'nowrap'}}>
                    {t==='all'?'All':`${m.emoji} ${m.label}`}
                  </button>);
                })}
              </div>

              <div className="sas-flex-row" style={{marginBottom:12}}>
                <div style={{flex:1,position:'relative'}}><span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',fontSize:13,pointerEvents:'none'}}>🔍</span><Inp value={spSearch} onChange={e=>setSpSearch(e.target.value)} placeholder="Search saved entries…" style={{paddingLeft:32}}/></div>
                <Btn onClick={()=>{setSpFormOpen(true);setSpEditing(null);setSpForm({title:'',artist:'',spotify_url:'',category_id:'',notes:''}); }} style={{padding:'10px 16px',background:SPG,color:'#000',whiteSpace:'nowrap',fontWeight:700}}>+ Save</Btn>
              </div>

              {spFormOpen&&(
                <SC style={{border:'1px solid rgba(30,215,96,.2)'}} className="sas-in">
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}><div style={{width:4,height:22,borderRadius:3,background:SPG}}/><span style={{fontFamily:T.font,fontWeight:700,fontSize:14,color:T.text}}>{spEditing?'✎ Edit':'+ Save Spotify Link'}</span></div>
                  <form onSubmit={handleSpSubmit}>
                    <div style={{marginBottom:10}}>
                      <label style={{fontFamily:T.font,fontWeight:700,fontSize:10,color:T.textMut,letterSpacing:'.08em',display:'block',marginBottom:5}}>SPOTIFY URL *</label>
                      <Inp value={spForm.spotify_url} onChange={e=>setSpForm(f=>({...f,spotify_url:e.target.value}))} placeholder="https://open.spotify.com/track/… or spotify:track:…" required/>
                      {spUrlPreview&&<div style={{marginTop:5,display:'flex',alignItems:'center',gap:7}}><span style={{background:`${(SP_TYPE[spUrlPreview.type]||SP_TYPE.track).color}22`,color:(SP_TYPE[spUrlPreview.type]||SP_TYPE.track).color,border:`1px solid ${(SP_TYPE[spUrlPreview.type]||SP_TYPE.track).color}44`,borderRadius:5,padding:'2px 7px',fontSize:10,fontWeight:700,fontFamily:T.font}}>{(SP_TYPE[spUrlPreview.type]||SP_TYPE.track).emoji} {(SP_TYPE[spUrlPreview.type]||SP_TYPE.track).label}</span><span style={{fontFamily:T.body,fontSize:11,color:T.textMut}}>detected</span></div>}
                    </div>
                    <div className="sas-two-col" style={{marginBottom:10}}><Inp value={spForm.title} onChange={e=>setSpForm(f=>({...f,title:e.target.value}))} placeholder="Title *" required/><Inp value={spForm.artist} onChange={e=>setSpForm(f=>({...f,artist:e.target.value}))} placeholder="Artist / creator (optional)"/></div>
                    <Sel value={spForm.category_id} onChange={e=>setSpForm(f=>({...f,category_id:e.target.value}))} style={{marginBottom:10}} required><option value="">Category *</option>{spCats.map(c=><option key={c.id} value={c.id}>{c.category_name}</option>)}</Sel>
                    <textarea value={spForm.notes} onChange={e=>setSpForm(f=>({...f,notes:e.target.value}))} placeholder="Notes (optional)" rows={2} style={{width:'100%',padding:'10px 13px',border:`1.5px solid ${T.border}`,borderRadius:T.rs,fontFamily:T.body,fontSize:14,color:T.text,background:T.bg,outline:'none',resize:'vertical',marginBottom:12,boxSizing:'border-box'}}/>
                    <div style={{display:'flex',gap:8}}><Btn type="submit" style={{padding:'9px 18px',background:SPG,color:'#000',fontWeight:700}}>{spEditing?'Update':'Save 🎵'}</Btn><Btn type="button" onClick={()=>{setSpFormOpen(false);setSpEditing(null);}} style={{padding:'9px 18px',background:T.surfaceAlt,color:T.textSec}}>Cancel</Btn></div>
                  </form>
                </SC>
              )}

              {loading?(<div style={{display:'flex',justifyContent:'center',padding:48}}><Spinner sz={32}/></div>)
                :spFiltered.filter(e=>spSearch?e.title?.toLowerCase().includes(spSearch.toLowerCase())||e.artist?.toLowerCase().includes(spSearch.toLowerCase())||e.notes?.toLowerCase().includes(spSearch.toLowerCase()):true).length===0?(
                <div style={{textAlign:'center',padding:'48px 20px',background:T.surface,borderRadius:T.r,border:`1px solid ${T.border}`,color:T.textMut,fontFamily:T.body}}>
                  <div style={{fontSize:36,marginBottom:10}}>🎵</div>
                  {spSearch||spTypeFilter!=='all'?`No matches for "${spSearch||spTypeFilter}"`:'Nothing saved yet — use Quick Play or + Save!'}
                </div>
              ):(
                <div className="sas-grid-yt">
                  {spFiltered.filter(e=>spSearch?e.title?.toLowerCase().includes(spSearch.toLowerCase())||e.artist?.toLowerCase().includes(spSearch.toLowerCase())||e.notes?.toLowerCase().includes(spSearch.toLowerCase()):true).map((e,i)=>(
                    <SpCard key={e.id} entry={e} index={i} onPlay={handleSpPlay} onEdit={handleSpEdit} onDelete={handleSpDelete} />
                  ))}
                </div>
              )}
            </div>
          )}

          {ytPlaying&&ytEmbedId&&<YtModal video={ytPlaying} embedId={ytEmbedId} onClose={()=>{setYtPlaying(null);setActivePL(null);}} playlist={activePL} onPlNext={()=>{ const n=plIdx<activePL.queue.length-1?plIdx+1:(plLoopRef.current?0:plIdx); setPlIdx(n); const v=activePL.queue[n]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlPrev={()=>{ const p=plIdx>0?plIdx-1:(plLoopRef.current?activePL.queue.length-1:0); setPlIdx(p); const v=activePL.queue[p]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlJump={i=>{ setPlIdx(i); const v=activePL.queue[i]; setYtPlaying({...v,youtube_embed_id:v.youtube_embed_id||ytId(v.video_url)}); }} onPlLoop={()=>setPlLoop(l=>!l)} loopPl={plLoop} plIdx={plIdx}/>}
          {showIgQV&&<InstaQuickView onClose={()=>setShowIgQV(false)} onOpenViewer={p=>{setIgPlaying(p);setIgPlayIdx(null);}}/>}
          {igPlaying&&<ReelModal post={igPlaying} onClose={()=>{setIgPlaying(null);setIgPlayIdx(null);}} onNext={handleIgNext} onPrev={handleIgPrev} hasPrev={igPlayIdx!==null&&igPlayIdx>0} hasNext={igPlayIdx!==null&&igPlayIdx<igFiltered.length-1}/>}
          {spPlaying && !(typeof spPlaying.id === 'string' && spPlaying.id.startsWith('qp_')) && (
            <SpModal 
              entry={spPlaying} 
              onClose={() => { setSpPlaying(null); setSpPlayIdx(null); }} 
              onPrev={handleSpPrev} 
              onNext={handleSpNext} 
              hasPrev={spPlayIdx !== null && spPlayIdx > 0} 
              hasNext={spPlayIdx !== null && spPlayIdx < spFiltered.length - 1} 
            />
          )}
          {showPLModal&&<PlaylistModal onClose={()=>{setShowPLModal(false);setPendingPLVid(null);}} savedVideos={ytVideos} onSave={handleSavePL} initVideo={pendingPLVid}/>}
        </div>
      </div>
    </div>
  );
}