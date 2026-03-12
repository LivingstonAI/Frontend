import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
if (!document.head.querySelector('link[data-snowaistream]')) {
  fontLink.setAttribute('data-snowaistream', 'true');
  document.head.appendChild(fontLink);
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyleEl = document.createElement("style");
globalStyleEl.setAttribute('data-snowaistream-styles', 'true');
globalStyleEl.innerHTML = `
  @keyframes sas-spin { to { transform: rotate(360deg); } }
  @keyframes sas-fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sas-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes sas-slideup { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes sas-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .sas-card-enter { animation: sas-fadein 0.35s ease both; }
  .sas-modal-enter { animation: sas-slideup 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  .sas-shimmer {
    background: linear-gradient(90deg, #e8f0ff 25%, #d0e4ff 50%, #e8f0ff 75%);
    background-size: 400px 100%;
    animation: sas-shimmer 1.4s infinite;
    border-radius: 8px;
  }
`;
if (!document.head.querySelector('style[data-snowaistream-styles]')) {
  document.head.appendChild(globalStyleEl);
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: '#f0f6ff',
  surface: '#ffffff',
  surfaceAlt: '#e8f2ff',
  border: '#c8dfff',
  borderLight: '#dceeff',
  accent: '#2563eb',
  accentLight: '#3b82f6',
  accentPale: '#dbeafe',
  accentMid: '#93c5fd',
  instaA: '#405de6',
  instaB: '#5851db',
  instaC: '#833ab4',
  instaD: '#c13584',
  instaE: '#e1306c',
  instaF: '#fd1d1d',
  instaG: '#f56040',
  instaH: '#f77737',
  instaI: '#fcaf45',
  instaJ: '#ffdc80',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  font: "'Syne', sans-serif",
  fontBody: "'DM Sans', sans-serif",
  radius: '12px',
  radiusSm: '8px',
  radiusLg: '20px',
  shadow: '0 4px 24px rgba(37,99,235,0.08)',
  shadowMd: '0 8px 32px rgba(37,99,235,0.13)',
  shadowLg: '0 16px 48px rgba(37,99,235,0.18)',
};

const instaGrad = `linear-gradient(45deg, ${T.instaG}, ${T.instaF}, ${T.instaE}, ${T.instaD}, ${T.instaC}, ${T.instaB}, ${T.instaA})`;
const accentGrad = `linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const extractYtId = (url) => {
  if (!url) return '';
  if (url.length === 11 && !url.includes('/')) return url;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : '';
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const extractInstaShortcode = (url) => {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
};

const isReel = (url) => url && url.includes('/reel/');

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
const Spinner = ({ size = 20, color = T.accent }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `2.5px solid ${color}22`,
    borderTopColor: color,
    animation: 'sas-spin 0.8s linear infinite',
    display: 'inline-block', flexShrink: 0
  }} />
);

const Toast = ({ msg, type }) => {
  const bg = type === 'error' ? '#fef2f2' : type === 'warn' ? '#fffbeb' : '#f0fdf4';
  const border = type === 'error' ? T.danger : type === 'warn' ? T.warning : T.success;
  const color = type === 'error' ? T.danger : type === 'warn' ? '#92400e' : '#166534';
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: T.radiusSm,
      padding: '12px 16px', color, fontSize: 13, fontFamily: T.fontBody,
      marginBottom: 12, animation: 'sas-fadein 0.3s ease'
    }}>
      {msg}
    </div>
  );
};

const InstaBadge = () => (
  <span style={{
    background: instaGrad, borderRadius: 6, padding: '2px 8px',
    fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: T.font,
    letterSpacing: '0.04em'
  }}>INSTA</span>
);

const YtBadge = () => (
  <span style={{
    background: '#dc2626', borderRadius: 6, padding: '2px 8px',
    fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: T.font,
    letterSpacing: '0.04em'
  }}>YT</span>
);

// ─── INSTAGRAM STORY RING ─────────────────────────────────────────────────────
const StoryRing = ({ label, url, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 6, cursor: 'pointer', flexShrink: 0, width: 72
    }}
  >
    <div style={{
      width: 60, height: 60, borderRadius: '50%',
      background: active ? instaGrad : T.border,
      padding: 2, transition: 'all 0.2s'
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: T.surface, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22
      }}>
        {isReel(url) ? '🎬' : '📸'}
      </div>
    </div>
    <span style={{
      fontSize: 11, color: T.textSecondary, fontFamily: T.fontBody,
      maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis',
      whiteSpace: 'nowrap', textAlign: 'center'
    }}>{label}</span>
  </div>
);

// ─── REEL MODAL ───────────────────────────────────────────────────────────────
const ReelModal = ({ post, onClose, onPrev, onNext, hasPrev, hasNext, baseUrl }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    setMediaUrl(null); setMediaError('');
    if (post?.is_reel || post?.media_type === 'VIDEO') {
      attemptMediaFetch();
    }
  }, [post?.id]);

  const attemptMediaFetch = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/snowai-insta-fetch-media/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_url: post.post_url })
      });
      const data = await res.json();
      if (res.ok && data.media_url) {
        setMediaUrl(data.media_url);
      } else {
        setMediaError(data.error || 'Media unavailable — open on Instagram');
      }
    } catch {
      setMediaError('Could not fetch media — open on Instagram');
    } finally {
      setMediaLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}
    >
      {/* Reel container */}
      <div
        onClick={e => e.stopPropagation()}
        className="sas-modal-enter"
        style={{
          width: '100%', maxWidth: 420,
          background: '#000', borderRadius: 20,
          overflow: 'hidden', position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: instaGrad, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16
            }}>
              {post.profile_pic ? (
                <img src={post.profile_pic} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              ) : '👤'}
            </div>
            <div>
              <div style={{ color: '#fff', fontFamily: T.font, fontWeight: 700, fontSize: 14 }}>
                {post.account_handle || 'instagram'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: T.fontBody, fontSize: 11 }}>
                {fmtDate(post.date_added)}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
            width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}>×</button>
        </div>

        {/* Media area - 9:16 aspect */}
        <div style={{
          width: '100%', paddingTop: '177.78%', position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          minHeight: 300
        }}>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16
          }}>
            {mediaLoading ? (
              <>
                <Spinner size={36} color="#fff" />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: T.fontBody, fontSize: 13 }}>
                  Fetching media…
                </span>
              </>
            ) : mediaUrl ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                controls autoPlay loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            ) : (
              <>
                <div style={{ fontSize: 64 }}>{isReel(post.post_url) ? '🎬' : '📸'}</div>
                {post.thumbnail_url ? (
                  <img
                    src={post.thumbnail_url}
                    alt="thumbnail"
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', opacity: 0.6
                    }}
                  />
                ) : null}
                <div style={{
                  position: 'absolute', bottom: 80, left: 0, right: 0,
                  textAlign: 'center', padding: '0 20px'
                }}>
                  {mediaError && (
                    <div style={{
                      background: 'rgba(0,0,0,0.6)', borderRadius: 10,
                      padding: '10px 16px', color: 'rgba(255,255,255,0.8)',
                      fontFamily: T.fontBody, fontSize: 12,
                      backdropFilter: 'blur(8px)'
                    }}>
                      {mediaError}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 16px', zIndex: 10
        }}>
          {post.caption && (
            <p style={{
              color: '#fff', fontFamily: T.fontBody, fontSize: 13,
              lineHeight: 1.5, marginBottom: 12,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {post.caption}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: '10px 0', textAlign: 'center',
                background: instaGrad, color: '#fff', borderRadius: T.radiusSm,
                fontFamily: T.font, fontWeight: 700, fontSize: 13,
                textDecoration: 'none', letterSpacing: '0.02em'
              }}
            >
              Open on Instagram ↗
            </a>
            {mediaError && (
              <button
                onClick={attemptMediaFetch}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  color: '#fff', borderRadius: T.radiusSm, cursor: 'pointer',
                  fontFamily: T.fontBody, fontSize: 12, backdropFilter: 'blur(4px)'
                }}
              >
                Retry ↺
              </button>
            )}
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button
              onClick={onPrev} disabled={!hasPrev}
              style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                padding: '8px 18px', borderRadius: T.radiusSm, cursor: hasPrev ? 'pointer' : 'not-allowed',
                fontFamily: T.fontBody, fontSize: 12, opacity: hasPrev ? 1 : 0.4
              }}
            >← Prev</button>
            <button
              onClick={onNext} disabled={!hasNext}
              style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
                padding: '8px 18px', borderRadius: T.radiusSm, cursor: hasNext ? 'pointer' : 'not-allowed',
                fontFamily: T.fontBody, fontSize: 12, opacity: hasNext ? 1 : 0.4
              }}
            >Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INSTAGRAM POST CARD ──────────────────────────────────────────────────────
const InstaPostCard = ({ post, index, onPlay, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="sas-card-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 0.04}s`,
        background: T.surface,
        borderRadius: T.radius,
        border: `1px solid ${hovered ? T.accentMid : T.border}`,
        overflow: 'hidden',
        boxShadow: hovered ? T.shadowMd : T.shadow,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={() => onPlay(post)}
        style={{
          position: 'relative', paddingTop: '100%', cursor: 'pointer',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          overflow: 'hidden'
        }}
      >
        {post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.caption || 'Instagram post'}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8
          }}>
            <span style={{ fontSize: 40 }}>{isReel(post.post_url) ? '🎬' : '📸'}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(37,99,235,${hovered ? 0.3 : 0})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s'
        }}>
          {hovered && (
            <div style={{
              background: 'rgba(255,255,255,0.95)', borderRadius: '50%',
              width: 48, height: 48, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20
            }}>▶</div>
          )}
        </div>

        {/* Type badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          {isReel(post.post_url) ? (
            <span style={{
              background: instaGrad, color: '#fff', borderRadius: 6,
              padding: '2px 8px', fontSize: 10, fontWeight: 700, fontFamily: T.font
            }}>REEL</span>
          ) : (
            <span style={{
              background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 6,
              padding: '2px 8px', fontSize: 10, fontWeight: 700, fontFamily: T.font,
              backdropFilter: 'blur(4px)'
            }}>POST</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <span style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 14,
            color: T.textPrimary, flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>{post.title}</span>
        </div>

        {post.account_handle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: instaGrad, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ fontSize: 10, color: '#fff' }}>@</span>
            </div>
            <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary }}>
              {post.account_handle}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            background: T.accentPale, color: T.accent, borderRadius: 6,
            padding: '2px 8px', fontSize: 11, fontFamily: T.fontBody, fontWeight: 500
          }}>{post.category_name}</span>
          <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fontBody }}>
            {fmtDate(post.date_added)}
          </span>
        </div>

        {post.notes && (
          <p style={{
            fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary,
            lineHeight: 1.5, margin: 0,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}>{post.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 14px',
        borderTop: `1px solid ${T.borderLight}`
      }}>
        <button onClick={() => onPlay(post)} style={{
          flex: 1, padding: '7px 0', background: accentGrad, color: '#fff',
          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
          fontFamily: T.font, fontWeight: 700, fontSize: 12
        }}>▶ View</button>
        <button onClick={() => onEdit(post)} style={{
          padding: '7px 12px', background: T.accentPale, color: T.accent,
          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
          fontFamily: T.fontBody, fontSize: 12
        }}>✎</button>
        <button onClick={() => onDelete(post.id)} style={{
          padding: '7px 12px', background: '#fef2f2', color: T.danger,
          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
          fontFamily: T.fontBody, fontSize: 12
        }}>🗑</button>
      </div>
    </div>
  );
};

// ─── YOUTUBE VIDEO CARD ───────────────────────────────────────────────────────
const YtVideoCard = ({ video, index, onPlay, onEdit, onDelete, playing }) => {
  const [hovered, setHovered] = useState(false);
  const ytId = video.youtube_embed_id || extractYtId(video.video_url);

  return (
    <div
      className="sas-card-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 0.04}s`,
        background: T.surface, borderRadius: T.radius,
        border: `1px solid ${playing ? T.accent : hovered ? T.accentMid : T.border}`,
        overflow: 'hidden',
        boxShadow: playing ? `0 0 0 2px ${T.accent}, ${T.shadowMd}` : hovered ? T.shadowMd : T.shadow,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <div
        onClick={() => onPlay(video)}
        style={{
          position: 'relative', paddingTop: '56.25%', cursor: 'pointer',
          background: '#0f172a', overflow: 'hidden'
        }}
      >
        {ytId && (
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={video.video_title}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(15,23,42,${hovered ? 0.4 : 0.15})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s'
        }}>
          <div style={{
            background: playing ? T.accent : 'rgba(255,255,255,0.9)',
            borderRadius: '50%', width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)'
          }}>
            {playing ? <span style={{ color: '#fff' }}>■</span> : '▶'}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <YtBadge />
        </div>
      </div>

      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          onClick={() => onPlay(video)}
          style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.textPrimary,
            cursor: 'pointer', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}
        >{video.video_title}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            background: T.accentPale, color: T.accent, borderRadius: 6,
            padding: '2px 8px', fontSize: 11, fontFamily: T.fontBody, fontWeight: 500
          }}>{video.category_name}</span>
          <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fontBody }}>
            {fmtDate(video.date_entered)}
          </span>
        </div>

        {video.notes && (
          <p style={{
            fontFamily: T.fontBody, fontSize: 12, color: T.textSecondary,
            lineHeight: 1.5, margin: 0,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}>{video.notes}</p>
        )}
      </div>

      <div style={{
        display: 'flex', gap: 6, padding: '10px 14px',
        borderTop: `1px solid ${T.borderLight}`
      }}>
        <button onClick={() => onPlay(video)} style={{
          flex: 1, padding: '7px 0',
          background: playing ? '#dc2626' : 'linear-gradient(135deg, #dc2626, #ef4444)',
          color: '#fff', border: 'none', borderRadius: T.radiusSm,
          cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 12
        }}>{playing ? '■ Stop' : '▶ Play'}</button>
        <button onClick={() => onEdit(video)} style={{
          padding: '7px 12px', background: T.accentPale, color: T.accent,
          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
          fontFamily: T.fontBody, fontSize: 12
        }}>✎</button>
        <button onClick={() => onDelete(video.id)} style={{
          padding: '7px 12px', background: '#fef2f2', color: T.danger,
          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
          fontFamily: T.fontBody, fontSize: 12
        }}>🗑</button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SnowAIVideos() {
  const BASE = 'https://backend-production-c0ab.up.railway.app';

  // Tab state: 'youtube' | 'instagram'
  const [activeSection, setActiveSection] = useState('youtube');

  // ── Shared UI state ──
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 4500);
  };

  // ── YouTube state ──
  const [ytVideos, setYtVideos] = useState([]);
  const [ytFiltered, setYtFiltered] = useState([]);
  const [ytCategories, setYtCategories] = useState([]);
  const [ytSelCat, setYtSelCat] = useState('all');
  const [ytSearch, setYtSearch] = useState('');
  const [ytPlaying, setYtPlaying] = useState(null);
  const [ytFormOpen, setYtFormOpen] = useState(false);
  const [ytEditing, setYtEditing] = useState(null);
  const [ytForm, setYtForm] = useState({ video_title: '', video_url: '', category_id: '', notes: '' });
  const [ytCatFormOpen, setYtCatFormOpen] = useState(false);
  const [ytNewCat, setYtNewCat] = useState('');

  // ── Instagram state ──
  const [instaPosts, setInstaPosts] = useState([]);
  const [instaFiltered, setInstaFiltered] = useState([]);
  const [instaCategories, setInstaCategories] = useState([]);
  const [instaSelCat, setInstaSelCat] = useState('all');
  const [instaSearch, setInstaSearch] = useState('');
  const [instaPlaying, setInstaPlaying] = useState(null);
  const [instaPlayIdx, setInstaPlayIdx] = useState(null);
  const [instaFormOpen, setInstaFormOpen] = useState(false);
  const [instaEditing, setInstaEditing] = useState(null);
  const [instaForm, setInstaForm] = useState({ title: '', post_url: '', category_id: '', account_handle: '', notes: '' });
  const [instaCatFormOpen, setInstaCatFormOpen] = useState(false);
  const [instaNewCat, setInstaNewCat] = useState('');
  const [instaView, setInstaView] = useState('grid'); // 'grid' | 'reels'

  // ── Load data ──
  useEffect(() => { fetchYtCategories(); fetchYtVideos(); }, []);
  useEffect(() => { fetchInstaCategories(); fetchInstaPosts(); }, []);

  // ── YT filter ──
  useEffect(() => {
    if (!ytSearch.trim()) return setYtFiltered(ytVideos);
    const q = ytSearch.toLowerCase();
    setYtFiltered(ytVideos.filter(v =>
      v.video_title.toLowerCase().includes(q) ||
      v.notes?.toLowerCase().includes(q) ||
      v.category_name?.toLowerCase().includes(q)
    ));
  }, [ytSearch, ytVideos]);

  // ── Insta filter ──
  useEffect(() => {
    if (!instaSearch.trim()) return setInstaFiltered(instaPosts);
    const q = instaSearch.toLowerCase();
    setInstaFiltered(instaPosts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.account_handle?.toLowerCase().includes(q) ||
      p.caption?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q) ||
      p.category_name?.toLowerCase().includes(q)
    ));
  }, [instaSearch, instaPosts]);

  // ── YouTube API ──
  const fetchYtCategories = async () => {
    try {
      const r = await fetch(`${BASE}/api/snowai-video-categories/`);
      const d = await r.json();
      setYtCategories(d.categories || []);
    } catch { showToast('Failed to load YT categories', 'error'); }
  };

  const fetchYtVideos = async (catId = null) => {
    setLoading(true);
    try {
      const url = catId
        ? `${BASE}/api/snowai-video-entries/?category_id=${catId}`
        : `${BASE}/api/snowai-video-entries/`;
      const r = await fetch(url);
      const d = await r.json();
      setYtVideos(d.videos || []);
      setYtFiltered(d.videos || []);
    } catch { showToast('Failed to load videos', 'error'); }
    finally { setLoading(false); }
  };

  const handleYtCatFilter = (id) => {
    setYtSelCat(id);
    setYtSearch('');
    fetchYtVideos(id === 'all' ? null : id);
  };

  const handleYtAddCat = async (e) => {
    e.preventDefault();
    if (!ytNewCat.trim()) return;
    try {
      const r = await fetch(`${BASE}/api/snowai-video-categories/create/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: ytNewCat })
      });
      if (r.ok) { setYtNewCat(''); setYtCatFormOpen(false); fetchYtCategories(); }
    } catch { showToast('Failed to add category', 'error'); }
  };

  const handleYtSubmit = async (e) => {
    e.preventDefault();
    if (!ytForm.video_title || !ytForm.video_url || !ytForm.category_id) {
      return showToast('Title, URL and category required', 'error');
    }
    try {
      const url = ytEditing
        ? `${BASE}/api/snowai-video-entries/${ytEditing.id}/update/`
        : `${BASE}/api/snowai-video-entries/create/`;
      const r = await fetch(url, {
        method: ytEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ytForm)
      });
      if (r.ok) {
        setYtForm({ video_title: '', video_url: '', category_id: '', notes: '' });
        setYtFormOpen(false); setYtEditing(null);
        fetchYtVideos(ytSelCat === 'all' ? null : ytSelCat);
        showToast(ytEditing ? 'Video updated!' : 'Video added!');
      }
    } catch { showToast('Failed to save video', 'error'); }
  };

  const handleYtDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await fetch(`${BASE}/api/snowai-video-entries/${id}/delete/`, { method: 'DELETE' });
      fetchYtVideos(ytSelCat === 'all' ? null : ytSelCat);
      if (ytPlaying?.id === id) setYtPlaying(null);
      showToast('Video deleted');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleYtEdit = (v) => {
    setYtEditing(v);
    setYtForm({ video_title: v.video_title, video_url: v.video_url, category_id: v.category_id, notes: v.notes || '' });
    setYtFormOpen(true);
  };

  // ── Instagram API ──
  const fetchInstaCategories = async () => {
    try {
      const r = await fetch(`${BASE}/api/snowai-insta-categories/`);
      const d = await r.json();
      setInstaCategories(d.categories || []);
    } catch { showToast('Failed to load Insta categories', 'error'); }
  };

  const fetchInstaPosts = async (catId = null) => {
    setLoading(true);
    try {
      const url = catId
        ? `${BASE}/api/snowai-insta-posts/?category_id=${catId}`
        : `${BASE}/api/snowai-insta-posts/`;
      const r = await fetch(url);
      const d = await r.json();
      setInstaPosts(d.posts || []);
      setInstaFiltered(d.posts || []);
    } catch { showToast('Failed to load posts', 'error'); }
    finally { setLoading(false); }
  };

  const handleInstaCatFilter = (id) => {
    setInstaSelCat(id);
    setInstaSearch('');
    fetchInstaPosts(id === 'all' ? null : id);
  };

  const handleInstaAddCat = async (e) => {
    e.preventDefault();
    if (!instaNewCat.trim()) return;
    try {
      const r = await fetch(`${BASE}/api/snowai-insta-categories/create/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: instaNewCat })
      });
      if (r.ok) { setInstaNewCat(''); setInstaCatFormOpen(false); fetchInstaCategories(); }
    } catch { showToast('Failed to add category', 'error'); }
  };

  const handleInstaSubmit = async (e) => {
    e.preventDefault();
    if (!instaForm.title || !instaForm.post_url || !instaForm.category_id) {
      return showToast('Title, URL and category required', 'error');
    }
    if (!instaForm.post_url.includes('instagram.com')) {
      return showToast('Please enter a valid Instagram URL', 'warn');
    }
    try {
      const url = instaEditing
        ? `${BASE}/api/snowai-insta-posts/${instaEditing.id}/update/`
        : `${BASE}/api/snowai-insta-posts/create/`;
      const r = await fetch(url, {
        method: instaEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instaForm)
      });
      if (r.ok) {
        setInstaForm({ title: '', post_url: '', category_id: '', account_handle: '', notes: '' });
        setInstaFormOpen(false); setInstaEditing(null);
        fetchInstaPosts(instaSelCat === 'all' ? null : instaSelCat);
        showToast(instaEditing ? 'Post updated!' : 'Post saved!');
      }
    } catch { showToast('Failed to save post', 'error'); }
  };

  const handleInstaDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`${BASE}/api/snowai-insta-posts/${id}/delete/`, { method: 'DELETE' });
      fetchInstaPosts(instaSelCat === 'all' ? null : instaSelCat);
      showToast('Post deleted');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleInstaEdit = (p) => {
    setInstaEditing(p);
    setInstaForm({
      title: p.title, post_url: p.post_url,
      category_id: p.category_id, account_handle: p.account_handle || '',
      notes: p.notes || ''
    });
    setInstaFormOpen(true);
  };

  const handleInstaPlay = (post) => {
    const idx = instaFiltered.findIndex(p => p.id === post.id);
    setInstaPlayIdx(idx);
    setInstaPlaying(post);
  };

  const handleInstaNext = () => {
    const next = instaPlayIdx + 1;
    if (next < instaFiltered.length) {
      setInstaPlayIdx(next);
      setInstaPlaying(instaFiltered[next]);
    }
  };

  const handleInstaPrev = () => {
    const prev = instaPlayIdx - 1;
    if (prev >= 0) {
      setInstaPlayIdx(prev);
      setInstaPlaying(instaFiltered[prev]);
    }
  };

  // ── SHARED LAYOUT ──
  const sectionBtnStyle = (active) => ({
    padding: '12px 28px',
    background: active ? accentGrad : 'transparent',
    color: active ? '#fff' : T.textSecondary,
    border: `2px solid ${active ? 'transparent' : T.border}`,
    borderRadius: T.radiusLg, cursor: 'pointer',
    fontFamily: T.font, fontWeight: 700, fontSize: 15,
    transition: 'all 0.25s ease',
    boxShadow: active ? T.shadowMd : 'none',
    letterSpacing: '0.02em'
  });

  const catBtnStyle = (active, isInsta = false) => ({
    padding: '7px 18px',
    background: active ? (isInsta ? instaGrad : accentGrad) : T.surface,
    color: active ? '#fff' : T.accent,
    border: `1.5px solid ${active ? 'transparent' : T.border}`,
    borderRadius: 20, cursor: 'pointer',
    fontFamily: T.fontBody, fontWeight: 600, fontSize: 13,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  });

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${T.border}`, borderRadius: T.radiusSm,
    fontFamily: T.fontBody, fontSize: 14, color: T.textPrimary,
    background: T.surface, boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s'
  };

  const ytEmbedId = ytPlaying ? (ytPlaying.youtube_embed_id || extractYtId(ytPlaying.video_url)) : null;

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fontBody }}>
      <div className="header"><Header /></div>
      <div className="main-page-body" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <SideNavs />
        <div className="main-body-info" style={{
          flex: 1, padding: 24, maxWidth: '100%',
          background: T.bg, margin: 0
        }}>

          {/* ── PAGE HEADER ── */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 28,
              color: T.textPrimary, margin: 0, letterSpacing: '-0.02em'
            }}>
              SnowAI{' '}
              <span style={{
                background: accentGrad,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Stream</span>
            </h1>
            <p style={{ fontFamily: T.fontBody, color: T.textMuted, margin: '6px 0 0', fontSize: 14 }}>
              Your curated media hub — YouTube & Instagram, all in one place.
            </p>
          </div>

          {/* ── SECTION SWITCHER ── */}
          <div style={{
            display: 'flex', gap: 10, marginBottom: 28,
            background: T.surface, padding: 6, borderRadius: T.radiusLg,
            border: `1px solid ${T.border}`, width: 'fit-content',
            boxShadow: T.shadow
          }}>
            <button style={sectionBtnStyle(activeSection === 'youtube')} onClick={() => setActiveSection('youtube')}>
              ▶ YouTube
            </button>
            <button
              style={{
                ...sectionBtnStyle(activeSection === 'instagram'),
                ...(activeSection === 'instagram' ? { background: instaGrad } : {})
              }}
              onClick={() => setActiveSection('instagram')}
            >
              📸 Instagram
            </button>
          </div>

          {/* Toast */}
          {toast.msg && <Toast msg={toast.msg} type={toast.type} />}

          {/* ════════════════════════════════════════════════════════════
              YOUTUBE SECTION
          ════════════════════════════════════════════════════════════ */}
          {activeSection === 'youtube' && (
            <div style={{ animation: 'sas-fadein 0.3s ease' }}>
              {/* Category section */}
              <div style={{
                background: T.surface, borderRadius: T.radius,
                border: `1px solid ${T.border}`, padding: '20px 24px',
                marginBottom: 20, boxShadow: T.shadow
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.textPrimary, margin: 0 }}>
                    Categories
                  </h3>
                  <button
                    onClick={() => setYtCatFormOpen(v => !v)}
                    style={{
                      padding: '6px 14px', background: T.accentPale, color: T.accent,
                      border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                      fontFamily: T.fontBody, fontWeight: 600, fontSize: 13
                    }}
                  >{ytCatFormOpen ? 'Cancel' : '+ Category'}</button>
                </div>

                {ytCatFormOpen && (
                  <form onSubmit={handleYtAddCat} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <input
                      value={ytNewCat}
                      onChange={e => setYtNewCat(e.target.value)}
                      placeholder="Category name"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button type="submit" style={{
                      padding: '11px 20px', background: accentGrad, color: '#fff',
                      border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                      fontFamily: T.font, fontWeight: 700, fontSize: 13
                    }}>Add</button>
                  </form>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button style={catBtnStyle(ytSelCat === 'all')} onClick={() => handleYtCatFilter('all')}>All</button>
                  {ytCategories.map(c => (
                    <button key={c.id} style={catBtnStyle(ytSelCat === c.id)} onClick={() => handleYtCatFilter(c.id)}>
                      {c.category_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search + Add */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
                  <input
                    value={ytSearch}
                    onChange={e => setYtSearch(e.target.value)}
                    placeholder="Search videos…"
                    style={{ ...inputStyle, paddingLeft: 38 }}
                  />
                </div>
                <button
                  onClick={() => { setYtFormOpen(true); setYtEditing(null); setYtForm({ video_title: '', video_url: '', category_id: '', notes: '' }); }}
                  style={{
                    padding: '11px 22px', background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: '#fff', border: 'none', borderRadius: T.radiusSm,
                    cursor: 'pointer', fontFamily: T.font, fontWeight: 700,
                    fontSize: 14, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                  }}
                >+ Add Video</button>
              </div>

              {/* Add/Edit Form */}
              {ytFormOpen && (
                <div style={{
                  background: T.surface, borderRadius: T.radius,
                  border: `1px solid ${T.border}`, padding: '24px',
                  marginBottom: 20, boxShadow: T.shadowMd,
                  animation: 'sas-fadein 0.3s ease'
                }}>
                  <h3 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, margin: '0 0 18px', color: T.textPrimary }}>
                    {ytEditing ? '✎ Edit Video' : '+ Add YouTube Video'}
                  </h3>
                  <form onSubmit={handleYtSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <input value={ytForm.video_title} onChange={e => setYtForm(f => ({ ...f, video_title: e.target.value }))}
                        placeholder="Video Title *" style={inputStyle} required />
                      <input value={ytForm.video_url} onChange={e => setYtForm(f => ({ ...f, video_url: e.target.value }))}
                        placeholder="YouTube URL *" style={inputStyle} required />
                    </div>
                    <select value={ytForm.category_id} onChange={e => setYtForm(f => ({ ...f, category_id: e.target.value }))}
                      style={{ ...inputStyle, marginBottom: 12 }} required>
                      <option value="">Select Category *</option>
                      {ytCategories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                    </select>
                    <textarea value={ytForm.notes} onChange={e => setYtForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Notes (optional)" rows={3}
                      style={{ ...inputStyle, resize: 'vertical', marginBottom: 14 }} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={{
                        padding: '11px 24px', background: accentGrad, color: '#fff',
                        border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                        fontFamily: T.font, fontWeight: 700, fontSize: 14
                      }}>{ytEditing ? 'Update' : 'Save'}</button>
                      <button type="button"
                        onClick={() => { setYtFormOpen(false); setYtEditing(null); }}
                        style={{
                          padding: '11px 24px', background: T.surfaceAlt, color: T.textSecondary,
                          border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                          fontFamily: T.fontBody, fontSize: 14
                        }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Player */}
              {ytPlaying && ytEmbedId && (
                <div style={{
                  background: T.surface, borderRadius: T.radius,
                  border: `1px solid ${T.border}`, padding: '20px',
                  marginBottom: 24, boxShadow: T.shadowLg,
                  animation: 'sas-fadein 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.textPrimary, margin: 0 }}>
                      {ytPlaying.video_title}
                    </h3>
                    <button onClick={() => setYtPlaying(null)} style={{
                      background: '#fef2f2', border: 'none', color: T.danger,
                      width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16
                    }}>×</button>
                  </div>
                  <div style={{ position: 'relative', paddingBottom: '50%', borderRadius: T.radiusSm, overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytEmbedId}?autoplay=1`}
                      title={ytPlaying.video_title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    />
                  </div>
                  {ytPlaying.notes && (
                    <div style={{
                      marginTop: 14, padding: '12px 16px',
                      background: T.surfaceAlt, borderRadius: T.radiusSm,
                      fontFamily: T.fontBody, fontSize: 13, color: T.textSecondary, lineHeight: 1.6
                    }}>
                      <strong>Notes:</strong> {ytPlaying.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>
              ) : ytFiltered.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: T.surface, borderRadius: T.radius,
                  border: `1px solid ${T.border}`, color: T.textMuted,
                  fontFamily: T.fontBody, fontSize: 15
                }}>
                  {ytSearch ? `No videos matching "${ytSearch}"` : 'No videos yet — add your first one!'}
                </div>
              ) : (
                <>
                  {ytSearch && (
                    <div style={{
                      padding: '8px 14px', background: T.accentPale,
                      borderLeft: `4px solid ${T.accent}`, borderRadius: T.radiusSm,
                      marginBottom: 14, fontFamily: T.fontBody, fontSize: 13, color: T.accent
                    }}>
                      {ytFiltered.length} result{ytFiltered.length !== 1 ? 's' : ''} for "{ytSearch}"
                    </div>
                  )}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 18
                  }}>
                    {ytFiltered.map((v, i) => (
                      <YtVideoCard
                        key={v.id} video={v} index={i}
                        playing={ytPlaying?.id === v.id}
                        onPlay={setYtPlaying}
                        onEdit={handleYtEdit}
                        onDelete={handleYtDelete}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              INSTAGRAM SECTION
          ════════════════════════════════════════════════════════════ */}
          {activeSection === 'instagram' && (
            <div style={{ animation: 'sas-fadein 0.3s ease' }}>

              {/* Insta header banner */}
              <div style={{
                background: instaGrad, borderRadius: T.radius,
                padding: '20px 24px', marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(193,53,132,0.3)'
              }}>
                <div>
                  <div style={{
                    fontFamily: T.font, fontWeight: 800, fontSize: 22,
                    color: '#fff', letterSpacing: '-0.02em'
                  }}>
                    SnowAI Insta 📸
                  </div>
                  <div style={{ fontFamily: T.fontBody, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                    Save posts & reels. Open on Instagram or try quick-view below.
                  </div>
                </div>
                {/* Grid / Reels toggle */}
                <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 4 }}>
                  <button
                    onClick={() => setInstaView('grid')}
                    style={{
                      padding: '6px 14px', border: 'none', borderRadius: 8, cursor: 'pointer',
                      background: instaView === 'grid' ? 'rgba(255,255,255,0.9)' : 'transparent',
                      color: instaView === 'grid' ? T.instaD : '#fff',
                      fontFamily: T.fontBody, fontWeight: 600, fontSize: 13
                    }}
                  >⊞ Grid</button>
                  <button
                    onClick={() => setInstaView('reels')}
                    style={{
                      padding: '6px 14px', border: 'none', borderRadius: 8, cursor: 'pointer',
                      background: instaView === 'reels' ? 'rgba(255,255,255,0.9)' : 'transparent',
                      color: instaView === 'reels' ? T.instaD : '#fff',
                      fontFamily: T.fontBody, fontWeight: 600, fontSize: 13
                    }}
                  >🎬 Reels</button>
                </div>
              </div>

              {/* Stories bar */}
              {instaPosts.length > 0 && (
                <div style={{
                  background: T.surface, borderRadius: T.radius,
                  border: `1px solid ${T.border}`, padding: '16px 20px',
                  marginBottom: 20, boxShadow: T.shadow
                }}>
                  <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.textMuted, marginBottom: 12, letterSpacing: '0.06em' }}>
                    QUICK ACCESS
                  </div>
                  <div style={{
                    display: 'flex', gap: 16, overflowX: 'auto',
                    paddingBottom: 4,
                    scrollbarWidth: 'thin'
                  }}>
                    {instaPosts.slice(0, 12).map(p => (
                      <StoryRing
                        key={p.id}
                        label={p.account_handle || p.title}
                        url={p.post_url}
                        active={instaPlaying?.id === p.id}
                        onClick={() => handleInstaPlay(p)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div style={{
                background: T.surface, borderRadius: T.radius,
                border: `1px solid ${T.border}`, padding: '20px 24px',
                marginBottom: 20, boxShadow: T.shadow
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.textPrimary, margin: 0 }}>Categories</h3>
                  <button
                    onClick={() => setInstaCatFormOpen(v => !v)}
                    style={{
                      padding: '6px 14px', background: 'rgba(193,53,132,0.1)', color: T.instaD,
                      border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                      fontFamily: T.fontBody, fontWeight: 600, fontSize: 13
                    }}
                  >{instaCatFormOpen ? 'Cancel' : '+ Category'}</button>
                </div>

                {instaCatFormOpen && (
                  <form onSubmit={handleInstaAddCat} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <input value={instaNewCat} onChange={e => setInstaNewCat(e.target.value)}
                      placeholder="Category name" style={{ ...inputStyle, flex: 1 }} />
                    <button type="submit" style={{
                      padding: '11px 20px', background: instaGrad, color: '#fff',
                      border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                      fontFamily: T.font, fontWeight: 700, fontSize: 13
                    }}>Add</button>
                  </form>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button style={catBtnStyle(instaSelCat === 'all', true)} onClick={() => handleInstaCatFilter('all')}>All</button>
                  {instaCategories.map(c => (
                    <button key={c.id} style={catBtnStyle(instaSelCat === c.id, true)} onClick={() => handleInstaCatFilter(c.id)}>
                      {c.category_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search + Add */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
                  <input
                    value={instaSearch} onChange={e => setInstaSearch(e.target.value)}
                    placeholder="Search posts, handles, captions…"
                    style={{ ...inputStyle, paddingLeft: 38 }}
                  />
                </div>
                <button
                  onClick={() => { setInstaFormOpen(true); setInstaEditing(null); setInstaForm({ title: '', post_url: '', category_id: '', account_handle: '', notes: '' }); }}
                  style={{
                    padding: '11px 22px', background: instaGrad, color: '#fff',
                    border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                    fontFamily: T.font, fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(193,53,132,0.35)'
                  }}
                >+ Add Post</button>
              </div>

              {/* Add/Edit Form */}
              {instaFormOpen && (
                <div style={{
                  background: T.surface, borderRadius: T.radius,
                  border: `1.5px solid ${T.instaD}33`, padding: '24px',
                  marginBottom: 20, boxShadow: T.shadowMd,
                  animation: 'sas-fadein 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 6, height: 28, borderRadius: 3, background: instaGrad }} />
                    <h3 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, margin: 0, color: T.textPrimary }}>
                      {instaEditing ? '✎ Edit Post' : '+ Save Instagram Post / Reel'}
                    </h3>
                  </div>
                  <form onSubmit={handleInstaSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <input value={instaForm.title} onChange={e => setInstaForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Title / Label *" style={inputStyle} required />
                      <input value={instaForm.account_handle} onChange={e => setInstaForm(f => ({ ...f, account_handle: e.target.value }))}
                        placeholder="@account_handle" style={inputStyle} />
                    </div>
                    <input value={instaForm.post_url} onChange={e => setInstaForm(f => ({ ...f, post_url: e.target.value }))}
                      placeholder="Instagram URL * (e.g. https://www.instagram.com/reel/Cxxx...)" style={{ ...inputStyle, marginBottom: 12 }} required />
                    <select value={instaForm.category_id} onChange={e => setInstaForm(f => ({ ...f, category_id: e.target.value }))}
                      style={{ ...inputStyle, marginBottom: 12 }} required>
                      <option value="">Select Category *</option>
                      {instaCategories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                    </select>
                    <textarea value={instaForm.notes} onChange={e => setInstaForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Notes (optional)" rows={2} style={{ ...inputStyle, resize: 'vertical', marginBottom: 14 }} />
                    <div style={{
                      padding: '10px 14px', background: '#fff8f0',
                      border: '1px solid #fed7aa', borderRadius: T.radiusSm,
                      fontFamily: T.fontBody, fontSize: 12, color: '#92400e', marginBottom: 14
                    }}>
                      💡 <strong>Tip:</strong> Paste the full Instagram post or reel URL. The backend will attempt to fetch metadata (thumbnail, caption). Reel playback requires the backend media-fetch endpoint — if unavailable, you'll get a direct Instagram link.
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={{
                        padding: '11px 24px', background: instaGrad, color: '#fff',
                        border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                        fontFamily: T.font, fontWeight: 700, fontSize: 14
                      }}>{instaEditing ? 'Update' : 'Save'}</button>
                      <button type="button" onClick={() => { setInstaFormOpen(false); setInstaEditing(null); }} style={{
                        padding: '11px 24px', background: T.surfaceAlt, color: T.textSecondary,
                        border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                        fontFamily: T.fontBody, fontSize: 14
                      }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Content */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={36} /></div>
              ) : instaFiltered.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: T.surface, borderRadius: T.radius,
                  border: `1px solid ${T.border}`, color: T.textMuted,
                  fontFamily: T.fontBody, fontSize: 15
                }}>
                  {instaSearch ? `No posts matching "${instaSearch}"` : 'No posts yet — save your first Instagram post or reel!'}
                </div>
              ) : (
                <>
                  {instaSearch && (
                    <div style={{
                      padding: '8px 14px', borderLeft: `4px solid ${T.instaD}`,
                      background: 'rgba(193,53,132,0.06)', borderRadius: T.radiusSm,
                      marginBottom: 14, fontFamily: T.fontBody, fontSize: 13, color: T.instaD
                    }}>
                      {instaFiltered.length} result{instaFiltered.length !== 1 ? 's' : ''} for "{instaSearch}"
                    </div>
                  )}

                  {instaView === 'grid' ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: 18
                    }}>
                      {instaFiltered.map((p, i) => (
                        <InstaPostCard
                          key={p.id} post={p} index={i}
                          onPlay={handleInstaPlay}
                          onEdit={handleInstaEdit}
                          onDelete={handleInstaDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Reels-style vertical scroll */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
                      {instaFiltered.map((p, i) => (
                        <div
                          key={p.id}
                          className="sas-card-enter"
                          style={{
                            animationDelay: `${i * 0.05}s`,
                            background: '#000', borderRadius: T.radius, overflow: 'hidden',
                            border: `1px solid ${T.border}`, boxShadow: T.shadowMd
                          }}
                        >
                          {/* Reel preview tile */}
                          <div
                            onClick={() => handleInstaPlay(p)}
                            style={{
                              position: 'relative', paddingTop: '177.78%', cursor: 'pointer',
                              background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                              maxHeight: 320, overflow: 'hidden'
                            }}
                          >
                            <div style={{ position: 'absolute', inset: 0, maxHeight: 320, overflow: 'hidden' }}>
                              {p.thumbnail_url ? (
                                <img src={p.thumbnail_url} alt={p.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{
                                  width: '100%', height: '100%', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center',
                                  background: instaGrad, opacity: 0.3
                                }} />
                              )}
                              <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                <div style={{
                                  width: 56, height: 56, borderRadius: '50%',
                                  background: 'rgba(255,255,255,0.9)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                                }}>▶</div>
                              </div>
                            </div>
                          </div>
                          {/* Reel info */}
                          <div style={{ padding: '14px 16px', background: '#111' }}>
                            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>{p.title}</div>
                            {p.account_handle && (
                              <div style={{ fontFamily: T.fontBody, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>@{p.account_handle}</div>
                            )}
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                              <button onClick={() => handleInstaPlay(p)} style={{
                                flex: 1, padding: '8px 0', background: instaGrad, color: '#fff',
                                border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                                fontFamily: T.font, fontWeight: 700, fontSize: 12
                              }}>▶ Open</button>
                              <a href={p.post_url} target="_blank" rel="noopener noreferrer" style={{
                                padding: '8px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff',
                                border: 'none', borderRadius: T.radiusSm, cursor: 'pointer',
                                fontFamily: T.fontBody, fontSize: 12, textDecoration: 'none',
                                display: 'flex', alignItems: 'center'
                              }}>↗</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Reel Modal */}
          {instaPlaying && (
            <ReelModal
              post={instaPlaying}
              onClose={() => setInstaPlaying(null)}
              onNext={handleInstaNext}
              onPrev={handleInstaPrev}
              hasPrev={instaPlayIdx > 0}
              hasNext={instaPlayIdx < instaFiltered.length - 1}
              baseUrl={BASE}
            />
          )}
        </div>
      </div>
    </div>
  );
}