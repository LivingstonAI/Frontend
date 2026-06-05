import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const baseUrl = 'https://backend-production-c0ab.up.railway.app';

// ─── Colour helpers ───────────────────────────────────────────────────────────
const roi2col  = v => v > 0 ? '#00e5a0' : v < 0 ? '#ff4d6d' : '#8b949e';
const pnl2col  = v => v > 0 ? '#00e5a0' : v < 0 ? '#ff4d6d' : '#8b949e';

const SECTOR_PALETTE = [
  '#7c3aed','#0ea5e9','#f59e0b','#10b981',
  '#ef4444','#ec4899','#14b8a6','#f97316',
  '#6366f1','#84cc16','#06b6d4','#a855f7'
];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS_BASE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
  .mac-root *{box-sizing:border-box;}
  .mac-root{font-family:'Syne',sans-serif;min-height:100vh;}

  /* ── tabs ── */
  .mac-tabs{display:flex;gap:4px;padding:0 0 24px;margin-bottom:28px;}
  .mac-tab{padding:10px 22px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid transparent;transition:all .18s;}
  .mac-tab.active{background:#7c3aed;color:#fff;border-color:#7c3aed;}

  /* ── grid helpers ── */
  .mac-top-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-bottom:28px;}
  .mac-accounts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;}

  /* ── metrics ── */
  .met-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;}
  .met-label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;font-family:'DM Mono',monospace;}
  .met-value{font-size:15px;font-weight:700;font-family:'DM Mono',monospace;}

  /* ── filter row ── */
  .mac-filter-row{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0;}
  .mac-filter-btn{padding:7px 16px;border-radius:6px;border:1.5px solid;background:transparent;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;transition:all .18s;font-family:'Syne',sans-serif;}
  .mac-filter-btn.active{background:#7c3aed;color:#fff;border-color:#7c3aed;}

  /* ── section header ── */
  .sec-hdr{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
  .sec-hdr::after{content:'';flex:1;height:1px;}

  /* ── badges ── */
  .badge{display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:4px;font-size:11px;font-weight:700;font-family:'DM Mono',monospace;}
  .badge-green{background:#00e5a011;color:#00e5a0;border:1px solid #00e5a033;}
  .badge-red  {background:#ff4d6d11;color:#ff4d6d;border:1px solid #ff4d6d33;}

  /* ── buttons ── */
  .mac-btn{padding:9px 18px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-family:'Syne',sans-serif;transition:all .18s;}
  .mac-btn-purple{background:#7c3aed;color:#fff;}
  .mac-btn-purple:hover{background:#6d28d9;}
  .mac-btn-amber {background:#f59e0b;color:#0a0c10;}
  .mac-btn-amber:hover{background:#d97706;}
  .mac-btn-teal  {background:#00e5a0;color:#0a0c10;}
  .mac-btn-teal:hover{background:#00c990;}
  .mac-btn-danger{background:#ff4d6d22;color:#ff4d6d;border:1.5px solid #ff4d6d44;}
  .mac-btn-danger:hover{background:#ff4d6d33;}
  .mac-btn:disabled{opacity:.4;cursor:not-allowed;}

  /* ── monte carlo ── */
  .mc-btn{width:100%;margin-top:10px;padding:7px;border-radius:6px;border:1.5px solid #7c3aed44;background:#7c3aed11;color:#a78bfa;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-family:'Syne',sans-serif;transition:all .18s;}
  .mc-btn:hover{background:#7c3aed;color:#fff;border-color:#7c3aed;}
  .mc-btn:disabled{opacity:.4;cursor:not-allowed;}

  /* ── modal backdrop ── */
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);}
  .modal-box{border-radius:16px;padding:32px;width:90%;max-width:780px;max-height:85vh;overflow-y:auto;}
  .modal-box.sm{max-width:520px;}
  .modal-hdr{font-size:20px;font-weight:800;margin-bottom:6px;}
  .modal-sub{font-size:13px;margin-bottom:24px;}

  /* ── equity chart buttons ── */
  .eq-btn{padding:6px 14px;border-radius:6px;border:1.5px solid;background:transparent;cursor:pointer;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;text-transform:uppercase;letter-spacing:.04em;transition:all .18s;}
  .eq-btn.active{background:#7c3aed;color:#fff;border-color:#7c3aed;}

  /* ── loading ── */
  .mac-loading{display:flex;align-items:center;justify-content:center;padding:60px;font-size:14px;font-family:'DM Mono',monospace;gap:10px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner{width:18px;height:18px;border:2px solid;border-top-color:#7c3aed;border-radius:50%;animation:spin .7s linear infinite;}

  /* ── sector ── */
  .sector-legend{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;}
  .sector-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:2px;}

  /* ── edit form ── */
  .edit-field{display:flex;flex-direction:column;gap:6px;}
  .edit-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-family:'DM Mono',monospace;}
  .edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

  /* ── synth checkbox ── */
  .synth-check{display:none;}
  .synth-check + label{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;padding:10px 14px;border-radius:7px;border:1.5px solid;transition:all .18s;}
  .synth-check:checked + label{border-color:#f59e0b;color:#f59e0b;background:#f59e0b0a;}
  .synth-check + label .chk-box{width:16px;height:16px;border-radius:4px;border:1.5px solid;display:flex;align-items:center;justify-content:center;transition:all .18s;}
  .synth-check:checked + label .chk-box{background:#f59e0b;border-color:#f59e0b;}

  /* ── tooltip ── */
  .chart-tooltip{position:absolute;border-radius:7px;padding:10px 14px;font-size:12px;pointer-events:none;white-space:nowrap;z-index:50;font-family:'DM Mono',monospace;}

  /* ── theme toggle pill ── */
  .theme-toggle{display:flex;align-items:center;gap:0;border-radius:8px;overflow:hidden;border:1.5px solid;}
  .theme-toggle button{padding:7px 14px;border:none;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:.04em;font-family:'Syne',sans-serif;transition:all .18s;background:transparent;}
`;

const CSS_DARK = `
  .mac-root{background:#0a0c10;color:#e2e8f0;}
  .mac-tabs{border-bottom:1px solid #1e2530;}
  .mac-tab:not(.active){color:#64748b;border-color:#1e2530;}
  .mac-tab:not(.active):hover{border-color:#7c3aed33;color:#a78bfa;}
  .mac-card{background:#0d1117;border:1px solid #1e2530;border-radius:12px;padding:22px;}
  .mac-card-accent-green{border-top:3px solid #00e5a0;}
  .mac-card-accent-red  {border-top:3px solid #ff4d6d;}
  .mac-card-accent-blue {border-top:3px solid #7c3aed;}
  .acc-card{background:#0d1117;border:1.5px solid #1e2530;border-radius:10px;padding:16px;cursor:pointer;transition:all .2s;}
  .acc-card:hover{border-color:#7c3aed88;transform:translateY(-2px);box-shadow:0 6px 24px #7c3aed22;}
  .acc-card.selected{border-color:#7c3aed;background:#110d1a;box-shadow:0 0 0 2px #7c3aed44;}
  .met-label{color:#475569;}
  .mac-search{border:1.5px solid #1e2530;background:#0a0c10;color:#e2e8f0;}
  .mac-search::placeholder{color:#334155;}
  .mac-filter-btn{color:#64748b;border-color:#1e2530;}
  .mac-filter-btn:hover{border-color:#7c3aed55;color:#a78bfa;}
  .sec-hdr{color:#475569;}
  .sec-hdr::after{background:#1e2530;}
  .mac-btn-ghost{background:transparent;color:#64748b;border:1.5px solid #1e2530;}
  .mac-btn-ghost:hover{border-color:#7c3aed55;color:#a78bfa;}
  .modal-box{background:#0d1117;border:1.5px solid #1e2530;color:#e2e8f0;}
  .modal-hdr{color:#e2e8f0;}
  .modal-sub{color:#475569;}
  .eq-btn{color:#64748b;border-color:#1e2530;}
  .eq-btn:hover{border-color:#7c3aed55;color:#a78bfa;}
  .mac-loading{color:#334155;}
  .spinner{border-color:#1e2530;}
  .edit-label{color:#475569;}
  .edit-input{border:1.5px solid #1e2530;background:#0a0c10;color:#e2e8f0;}
  .edit-input:focus{border-color:#7c3aed;}
  .edit-input option{background:#0d1117;}
  .synth-check + label{color:#64748b;border-color:#1e2530;}
  .synth-check + label .chk-box{border-color:#334155;}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-track{background:#0a0c10;}
  ::-webkit-scrollbar-thumb{background:#1e2530;border-radius:3px;}
  ::-webkit-scrollbar-thumb:hover{background:#334155;}
  .chart-tooltip{background:#0d1117;border:1px solid #1e2530;color:#e2e8f0;}
  .theme-toggle{border-color:#1e2530;}
  .theme-toggle button{color:#64748b;}
  .theme-toggle button.t-active{background:#1e2530;color:#e2e8f0;}
`;

const CSS_LIGHT = `
  .mac-root{background:#f1f5f9;color:#0f172a;}
  .mac-tabs{border-bottom:1px solid #cbd5e1;}
  .mac-tab:not(.active){color:#64748b;border-color:#cbd5e1;}
  .mac-tab:not(.active):hover{border-color:#7c3aed55;color:#7c3aed;}
  .mac-card{background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:22px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
  .mac-card-accent-green{border-top:3px solid #059669;}
  .mac-card-accent-red  {border-top:3px solid #dc2626;}
  .mac-card-accent-blue {border-top:3px solid #7c3aed;}
  .acc-card{background:#ffffff;border:1.5px solid #e2e8f0;border-radius:10px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.05);}
  .acc-card:hover{border-color:#7c3aed88;transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,.12);}
  .acc-card.selected{border-color:#7c3aed;background:#faf5ff;box-shadow:0 0 0 2px #7c3aed22;}
  .met-label{color:#64748b;}
  .mac-search{border:1.5px solid #cbd5e1;background:#ffffff;color:#0f172a;}
  .mac-search::placeholder{color:#94a3b8;}
  .mac-filter-btn{color:#64748b;border-color:#cbd5e1;}
  .mac-filter-btn:hover{border-color:#7c3aed88;color:#7c3aed;}
  .sec-hdr{color:#64748b;}
  .sec-hdr::after{background:#e2e8f0;}
  .mac-btn-ghost{background:transparent;color:#64748b;border:1.5px solid #cbd5e1;}
  .mac-btn-ghost:hover{border-color:#7c3aed88;color:#7c3aed;}
  .modal-box{background:#ffffff;border:1.5px solid #e2e8f0;color:#0f172a;box-shadow:0 20px 60px rgba(0,0,0,.15);}
  .modal-hdr{color:#0f172a;}
  .modal-sub{color:#64748b;}
  .eq-btn{color:#64748b;border-color:#cbd5e1;}
  .eq-btn:hover{border-color:#7c3aed88;color:#7c3aed;}
  .mac-loading{color:#94a3b8;}
  .spinner{border-color:#e2e8f0;}
  .edit-label{color:#64748b;}
  .edit-input{border:1.5px solid #cbd5e1;background:#f8fafc;color:#0f172a;}
  .edit-input:focus{border-color:#7c3aed;}
  .edit-input option{background:#ffffff;}
  .synth-check + label{color:#64748b;border-color:#cbd5e1;}
  .synth-check + label .chk-box{border-color:#94a3b8;}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-track{background:#f1f5f9;}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}
  ::-webkit-scrollbar-thumb:hover{background:#94a3b8;}
  .chart-tooltip{background:#ffffff;border:1px solid #e2e8f0;color:#0f172a;box-shadow:0 4px 12px rgba(0,0,0,.1);}
  .theme-toggle{border-color:#cbd5e1;}
  .theme-toggle button{color:#94a3b8;}
  .theme-toggle button.t-active{background:#e2e8f0;color:#0f172a;}
`;

const getCss = (theme) => CSS_BASE + (theme === 'dark' ? CSS_DARK : CSS_LIGHT);

// ─── Mini SVG equity chart ────────────────────────────────────────────────────
function MiniSparkline({ data, color = '#7c3aed', width = 120, height = 36 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Equity Curve Chart ───────────────────────────────────────────────────────
function EquityChart({ data, initialCapital }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  if (!data || data.length === 0) return <div className="mac-loading">No trade data available</div>;

  const W = 1000, H = 320;
  const pad = { top: 20, right: 30, bottom: 40, left: 72 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;

  const maxB = Math.max(...data.map(d => d.balance));
  const minB = Math.min(...data.map(d => d.balance));
  const maxT = Math.max(...data.map(d => d.trade_number));

  const xS = t => pad.left + (t / (maxT || 1)) * iW;
  const yS = b => pad.top + iH - ((b - minB) / ((maxB - minB) || 1)) * iH;

  const path = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p.trade_number)} ${yS(p.balance)}`).join(' ');
  const area = `${path} L ${xS(maxT)} ${pad.top + iH} L ${xS(0)} ${pad.top + iH} Z`;
  const bLine = yS(initialCapital);

  return (
    <div style={{ position: 'relative' }}>
      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}>
          <div style={{ color: '#475569' }}>Trade #{tooltip.d.trade_number}</div>
          {tooltip.d.asset && <div style={{ color: '#a78bfa' }}>{tooltip.d.asset}</div>}
          <div style={{ color: pnl2col(tooltip.d.trade_amount) }}>
            {tooltip.d.trade_amount > 0 ? '+' : ''}{tooltip.d.trade_amount}
          </div>
          <div style={{ color: '#e2e8f0', fontWeight: 700 }}>${tooltip.d.balance?.toLocaleString()}</div>
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 340 }}>
        {/* gradient */}
        <defs>
          <linearGradient id="eq-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity=".18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0,.25,.5,.75,1].map((r, i) => {
          const y = pad.top + iH - r * iH;
          const v = minB + r * (maxB - minB);
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#1e2530" strokeWidth="1" strokeDasharray="4" />
              <text x={pad.left - 8} y={y + 4} fill="#475569" fontSize="11" textAnchor="end" fontFamily="DM Mono,monospace">
                ${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)}
              </text>
            </g>
          );
        })}
        {/* X axis labels */}
        {[0,.25,.5,.75,1].map((r, i) => {
          const x = pad.left + r * iW;
          return (
            <text key={i} x={x} y={H - pad.bottom + 18} fill="#475569" fontSize="11" textAnchor="middle" fontFamily="DM Mono,monospace">
              T{Math.round(r * maxT)}
            </text>
          );
        })}
        {/* baseline */}
        {bLine >= pad.top && bLine <= pad.top + iH && (
          <line x1={pad.left} y1={bLine} x2={W - pad.right} y2={bLine} stroke="#f59e0b" strokeWidth="1" strokeDasharray="6,3" opacity=".5" />
        )}
        {/* area fill */}
        <path d={area} fill="url(#eq-grad)" />
        {/* main line */}
        <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" />
        {/* dots */}
        {data.map((p, i) => (
          <circle
            key={i}
            cx={xS(p.trade_number)}
            cy={yS(p.balance)}
            r="5"
            fill={p.outcome === 'Win' ? '#00e5a0' : p.outcome === 'Loss' ? '#ff4d6d' : '#7c3aed'}
            stroke="#0d1117"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onMouseEnter={e => {
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) setTooltip({ d: p, x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', fontFamily: 'DM Mono,monospace', marginTop: 8 }}>
        <span><span style={{ color: '#00e5a0' }}>●</span> Win &nbsp;<span style={{ color: '#ff4d6d' }}>●</span> Loss</span>
        <span style={{ color: '#f59e0b' }}>— Baseline</span>
      </div>
    </div>
  );
}

// ─── Sector Chart ─────────────────────────────────────────────────────────────
function SectorChart({ sectorData }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  if (!sectorData || sectorData.length === 0) return <div className="mac-loading">No sector data</div>;

  // For each sector: bars showing avg ROI per sector
  const maxAbs = Math.max(...sectorData.map(s => Math.abs(s.avg_roi)), 1);
  const W = 700, H = 320;
  const pad = { top: 20, right: 30, bottom: 90, left: 60 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;
  const barW = Math.min(50, (iW / sectorData.length) - 8);
  const midY = pad.top + iH / 2;

  return (
    <div style={{ position: 'relative' }}>
      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}>
          <div style={{ color: '#a78bfa', fontWeight: 700 }}>{tooltip.s.sector}</div>
          <div>Avg ROI: <span style={{ color: roi2col(tooltip.s.avg_roi), fontWeight: 700 }}>{tooltip.s.avg_roi}%</span></div>
          <div>Trades: {tooltip.s.total_trades}</div>
          <div>Win Rate: {tooltip.s.win_rate}%</div>
        </div>
      )}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 280 }}>
        {/* grid */}
        {[-1, -0.5, 0, 0.5, 1].map((r, i) => {
          const y = midY - r * (iH / 2);
          const v = r * maxAbs;
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke={r === 0 ? '#334155' : '#1e2530'} strokeWidth={r === 0 ? 1.5 : 1} />
              <text x={pad.left - 6} y={y + 4} fill="#475569" fontSize="10" textAnchor="end" fontFamily="DM Mono,monospace">
                {v.toFixed(0)}%
              </text>
            </g>
          );
        })}
        {/* bars */}
        {sectorData.map((s, i) => {
          const x = pad.left + (i / sectorData.length) * iW + (iW / sectorData.length - barW) / 2;
          const norm = s.avg_roi / maxAbs;
          const barH = Math.abs(norm) * (iH / 2);
          const y = norm >= 0 ? midY - barH : midY;
          const col = SECTOR_PALETTE[i % SECTOR_PALETTE.length];
          return (
            <g key={i}
              onMouseEnter={e => { const r = svgRef.current?.getBoundingClientRect(); if (r) setTooltip({ s, x: e.clientX - r.left, y: e.clientY - r.top }); }}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x={x} y={y} width={barW} height={Math.max(barH, 2)} fill={col} rx="3" opacity=".85" />
              <rect x={x} y={y} width={barW} height={Math.max(barH, 2)} fill={col} rx="3" opacity=".15" />
              <text
                x={x + barW / 2}
                y={H - pad.bottom + 14}
                fill="#64748b"
                fontSize="10"
                textAnchor="middle"
                fontFamily="DM Mono,monospace"
                transform={`rotate(-35, ${x + barW / 2}, ${H - pad.bottom + 14})`}
              >
                {s.sector.length > 10 ? s.sector.slice(0, 10) + '…' : s.sector}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Multi-account comparison line chart ──────────────────────────────────────
function ComparisonChart({ curvesData }) {
  if (!curvesData || curvesData.length === 0) return <div className="mac-loading">Loading…</div>;

  const W = 1000, H = 320;
  const pad = { top: 20, right: 30, bottom: 40, left: 72 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;

  const allBalances = curvesData.flatMap(c => c.equity_curve.map(p => p.balance));
  const maxT = Math.max(...curvesData.flatMap(c => c.equity_curve.map(p => p.trade_number)), 1);
  const maxB = Math.max(...allBalances, 1);
  const minB = Math.min(...allBalances, 0);

  const xS = t => pad.left + (t / maxT) * iW;
  const yS = b => pad.top + iH - ((b - minB) / ((maxB - minB) || 1)) * iH;

  return (
    <div>
      <div className="sector-legend" style={{ marginBottom: 14 }}>
        {curvesData.map((c, i) => (
          <div key={c.account_id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', fontFamily: 'DM Mono,monospace' }}>
            <div style={{ width: 24, height: 3, background: SECTOR_PALETTE[i % SECTOR_PALETTE.length], borderRadius: 2 }} />
            {c.account_name}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 320 }}>
        {[0,.25,.5,.75,1].map((r, i) => {
          const y = pad.top + iH - r * iH;
          const v = minB + r * (maxB - minB);
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#1e2530" strokeWidth="1" strokeDasharray="4" />
              <text x={pad.left - 8} y={y + 4} fill="#475569" fontSize="11" textAnchor="end" fontFamily="DM Mono,monospace">
                ${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)}
              </text>
            </g>
          );
        })}
        {curvesData.map((c, ci) => {
          const col = SECTOR_PALETTE[ci % SECTOR_PALETTE.length];
          const pts = c.equity_curve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p.trade_number)} ${yS(p.balance)}`).join(' ');
          return <path key={c.account_id} d={pts} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" opacity=".9" />;
        })}
      </svg>
    </div>
  );
}

// ─── Monte Carlo Modal ────────────────────────────────────────────────────────
function MonteCarloModal({ results, onClose }) {
  if (!results) return null;
  const stats = results.statistics;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div className="modal-hdr">🎲 Monte Carlo Simulation</div>
            <div className="modal-sub">{results.account_name} · {results.num_simulations.toLocaleString()} scenarios</div>
          </div>
          <button className="mac-btn mac-btn-ghost" onClick={onClose} style={{ padding: '6px 12px' }}>✕</button>
        </div>
        <div style={{ padding: '12px 16px', background: '#7c3aed0a', border: '1px solid #7c3aed33', borderRadius: 8, marginBottom: 20, fontSize: 13, color: '#94a3b8', fontFamily: 'DM Mono,monospace' }}>
          Time horizon: ~{results.time_horizon.estimated_months.toFixed(1)} months ({results.time_horizon.estimated_days.toFixed(0)} days) · {results.time_horizon.avg_trades_per_day} trades/day
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Initial Capital',     val: `$${results.initial_capital.toLocaleString()}`,              col: '#e2e8f0' },
            { label: 'Mean Final Balance',  val: `$${stats.mean_final_balance.toLocaleString()}`,             col: pnl2col(stats.mean_final_balance - results.initial_capital) },
            { label: 'Median Balance',      val: `$${stats.median_final_balance.toLocaleString()}`,           col: pnl2col(stats.median_final_balance - results.initial_capital) },
            { label: 'Profit Probability',  val: `${stats.probability_of_profit}%`,                          col: stats.probability_of_profit > 50 ? '#00e5a0' : '#ff4d6d' },
            { label: '5th Pct (Worst)',     val: `$${stats.percentile_5.toLocaleString()}`,                  col: '#ff4d6d' },
            { label: '95th Pct (Best)',     val: `$${stats.percentile_95.toLocaleString()}`,                 col: '#00e5a0' },
            { label: 'Max Potential Loss',  val: `$${stats.max_potential_loss.toLocaleString()}`,            col: '#ff4d6d' },
            { label: 'Max Loss %',          val: `${stats.max_loss_percentage.toFixed(2)}%`,                 col: '#ff4d6d' },
            { label: 'Std Deviation',       val: `$${stats.std_deviation.toLocaleString()}`,                 col: '#a78bfa' },
          ].map(({ label, val, col }) => (
            <div key={label} style={{ background: '#0a0c10', border: '1px solid #1e2530', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5, fontFamily: 'DM Mono,monospace' }}>{label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: col, fontFamily: 'DM Mono,monospace' }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#7c3aed0a', border: '1px solid #7c3aed33', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: '#a78bfa' }}>Interpretation · </span>
          Over ~{results.time_horizon.estimated_months.toFixed(1)} months, {stats.probability_of_profit}% chance of profit.
          Range: <span style={{ color: '#ff4d6d' }}>${stats.percentile_5.toLocaleString()}</span> → <span style={{ color: '#00e5a0' }}>${stats.percentile_95.toLocaleString()}</span>.
          Max drawdown risk: <span style={{ color: '#ff4d6d' }}>{stats.max_loss_percentage.toFixed(1)}%</span>.
        </div>
      </div>
    </div>
  );
}

// ─── Synthesise Modal ─────────────────────────────────────────────────────────
function SynthesiseModal({ accounts, onClose, onSynthesize }) {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [wantSave, setWantSave] = useState(false);
  const [synthResult, setSynthResult] = useState(null);

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const computedName = selected.length > 0
    ? selected.map(id => accounts.find(a => a.account_id === id)?.account_name).filter(Boolean).join(', ')
    : '—';

  const handleRun = async () => {
    if (selected.length < 2) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/mac_synthesize_accounts_combined/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_ids: selected, save: wantSave })
      });
      const d = await res.json();
      if (d.success) setSynthResult(d);
      else alert('Error: ' + d.error);
    } finally {
      setSaving(false);
    }
  };

  if (synthResult) {
    const s = synthResult.synthesized;
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-hdr">✦ Synthesis Result</div>
          <div className="modal-sub">{s.account_name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Combined Capital', val: `$${s.initial_capital.toLocaleString()}` },
              { label: 'Net P&L',          val: `$${s.net_pnl.toLocaleString()}`, col: pnl2col(s.net_pnl) },
              { label: 'ROI',              val: `${s.roi}%`, col: roi2col(s.roi) },
              { label: 'Win Rate',         val: `${s.win_rate}%` },
              { label: 'Total Trades',     val: s.total_trades },
            ].map(({ label, val, col }) => (
              <div key={label} style={{ background: '#0a0c10', border: '1px solid #1e2530', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5, fontFamily: 'DM Mono,monospace' }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: col || '#e2e8f0', fontFamily: 'DM Mono,monospace' }}>{val}</div>
              </div>
            ))}
          </div>
          {synthResult.saved && (
            <div style={{ padding: '10px 14px', background: '#00e5a011', border: '1px solid #00e5a033', borderRadius: 7, marginBottom: 16, fontSize: 13, color: '#00e5a0', fontFamily: 'DM Mono,monospace' }}>
              ✓ Saved as new account: "{s.account_name}"
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="mac-btn mac-btn-purple" onClick={() => { onSynthesize(); onClose(); }}>
              Refresh Dashboard
            </button>
            <button className="mac-btn mac-btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">⟡ Synthesise Accounts</div>
        <div className="modal-sub">Select 2+ accounts to combine their performance into a unified view</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10, marginBottom: 20 }}>
          {accounts.map(acc => (
            <div key={acc.account_id}>
              <input className="synth-check" type="checkbox" id={`sc-${acc.account_id}`} checked={selected.includes(acc.account_id)} onChange={() => toggle(acc.account_id)} />
              <label htmlFor={`sc-${acc.account_id}`}>
                <span className="chk-box">{selected.includes(acc.account_id) && <span style={{ fontSize: 10, color: '#0a0c10', fontWeight: 900 }}>✓</span>}</span>
                <span>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{acc.account_name}</div>
                  <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono,monospace' }}>{acc.main_assets}</div>
                </span>
              </label>
            </div>
          ))}
        </div>

        {selected.length > 0 && (
          <div style={{ padding: '12px 14px', background: '#f59e0b0a', border: '1px solid #f59e0b33', borderRadius: 8, marginBottom: 18, fontSize: 13, color: '#f59e0b', fontFamily: 'DM Mono,monospace' }}>
            Combined name: <span style={{ fontWeight: 700 }}>{computedName}</span>
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
          <input type="checkbox" checked={wantSave} onChange={e => setWantSave(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#f59e0b', cursor: 'pointer' }} />
          Save as new account in the database
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mac-btn mac-btn-amber" disabled={selected.length < 2 || saving} onClick={handleRun}>
            {saving ? 'Synthesising…' : `⟡ Synthesise (${selected.length})`}
          </button>
          <button className="mac-btn mac-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Trade Modal ─────────────────────────────────────────────────────────
function EditTradeModal({ trade, onClose, onSaved }) {
  const [form, setForm] = useState({ ...trade });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/mac_edit_account_trade_entry/${trade.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      if (d.success) { onSaved(); onClose(); }
      else alert('Error: ' + d.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box sm" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">✎ Edit Trade</div>
        <div className="modal-sub" style={{ marginBottom: 20 }}>Trade #{trade.id} · {trade.asset}</div>

        <div className="edit-grid" style={{ marginBottom: 14 }}>
          {[
            { key: 'asset',                    label: 'Asset',             type: 'text'   },
            { key: 'order_type',               label: 'Order Type',        type: 'text'   },
            { key: 'strategy',                 label: 'Strategy',          type: 'text'   },
            { key: 'sector',                   label: 'Sector',            type: 'text'   },
            { key: 'day_of_week_entered',      label: 'Day Entered',       type: 'text'   },
            { key: 'day_of_week_closed',       label: 'Day Closed',        type: 'text'   },
            { key: 'trading_session_entered',  label: 'Session Entered',   type: 'text'   },
            { key: 'trading_session_closed',   label: 'Session Closed',    type: 'text'   },
          ].map(({ key, label, type }) => (
            <div className="edit-field" key={key}>
              <div className="edit-label">{label}</div>
              <input className="edit-input" type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="edit-grid" style={{ marginBottom: 14 }}>
          <div className="edit-field">
            <div className="edit-label">Outcome</div>
            <select className="edit-input" value={form.outcome || ''} onChange={e => set('outcome', e.target.value)}>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
            </select>
          </div>
          <div className="edit-field">
            <div className="edit-label">Amount</div>
            <input className="edit-input" type="number" step="0.01" value={form.amount || ''} onChange={e => set('amount', parseFloat(e.target.value))} />
          </div>
        </div>

        <div className="edit-field" style={{ marginBottom: 14 }}>
          <div className="edit-label">Date Entered</div>
          <input className="edit-input" type="datetime-local"
            value={form.date_entered ? form.date_entered.slice(0, 16) : ''}
            onChange={e => set('date_entered', e.target.value)} />
        </div>

        <div className="edit-field" style={{ marginBottom: 14 }}>
          <div className="edit-label">Emotional Bias</div>
          <textarea className="edit-input" rows={2} value={form.emotional_bias || ''} onChange={e => set('emotional_bias', e.target.value)} />
        </div>

        <div className="edit-field" style={{ marginBottom: 20 }}>
          <div className="edit-label">Reflection</div>
          <textarea className="edit-input" rows={2} value={form.reflection || ''} onChange={e => set('reflection', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mac-btn mac-btn-teal" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : '✓ Save Changes'}
          </button>
          <button className="mac-btn mac-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Account Trades Table ─────────────────────────────────────────────────────
function AccountTradesPanel({ accountId, accountName }) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTrade, setEditTrade] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${baseUrl}/mac_fetch_account_trades_list/${accountId}/`);
      const d = await r.json();
      if (d.success) setTrades(d.trades);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (accountId) { load(); setPage(1); } }, [accountId]);

  if (loading) return <div className="mac-loading"><div className="spinner" />&nbsp;Loading trades…</div>;
  if (!trades.length) return <div className="mac-loading">No trades for this account</div>;

  const pages = Math.ceil(trades.length / PER_PAGE);
  const paginated = trades.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {editTrade && <EditTradeModal trade={editTrade} onClose={() => setEditTrade(null)} onSaved={load} />}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'DM Mono,monospace' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e2530' }}>
              {['#', 'Asset', 'Type', 'Strategy', 'Sector', 'Session', 'Outcome', 'Amount', 'Date', 'Edit'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #1e253033' }}
                onMouseEnter={e => e.currentTarget.style.background = '#7c3aed08'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '8px 12px', color: '#475569' }}>{(page - 1) * PER_PAGE + i + 1}</td>
                <td style={{ padding: '8px 12px', color: '#a78bfa', fontWeight: 700 }}>{t.asset}</td>
                <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{t.order_type}</td>
                <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{t.strategy}</td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{t.sector || '—'}</td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{t.trading_session_entered}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ color: t.outcome === 'Win' ? '#00e5a0' : '#ff4d6d', fontWeight: 700 }}>
                    {t.outcome === 'Win' ? '▲' : '▼'} {t.outcome}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: pnl2col(t.outcome === 'Win' ? t.amount : -t.amount), fontWeight: 700 }}>
                  {t.outcome === 'Win' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </td>
                <td style={{ padding: '8px 12px', color: '#475569' }}>
                  {t.date_entered ? new Date(t.date_entered).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #1e2530', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Mono,monospace' }}
                    onClick={() => setEditTrade(t)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#a78bfa'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2530'; e.currentTarget.style.color = '#64748b'; }}
                  >✎</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <button className="mac-btn mac-btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontSize: 12, color: '#475569', fontFamily: 'DM Mono,monospace' }}>{page} / {pages}</span>
          <button className="mac-btn mac-btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MultiAccountAnalytics() {
  const [theme, setTheme] = useState('dark');
  const [tab, setTab] = useState('overview');    // overview | sector | compare | trades
  const [overview, setOverview] = useState(null);
  const [equityData, setEquityData] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [loadingOv, setLoadingOv] = useState(true);
  const [loadingEq, setLoadingEq] = useState(false);
  const [accFilter, setAccFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [mcResults, setMcResults] = useState(null);
  const [mcRunning, setMcRunning] = useState(false);
  const [showSynth, setShowSynth] = useState(false);
  const [synthAccFilter, setSynthAccFilter] = useState(false);
  const [tradesAccount, setTradesAccount] = useState(null);

  const loadOverview = async () => {
    setLoadingOv(true);
    try {
      const r = await fetch(`${baseUrl}/fetch_multi_account_performance_overview_data/`);
      const d = await r.json();
      if (d.success) {
        setOverview(d);
        if (!selectedAcc && d.all_accounts?.length) setSelectedAcc(d.all_accounts[0].account_id);
      }
    } finally { setLoadingOv(false); }
  };

  const loadEquity = async id => {
    setLoadingEq(true);
    try {
      const r = await fetch(`${baseUrl}/fetch_account_equity_curve_progression_data/${id}/`);
      const d = await r.json();
      if (d.success) setEquityData(d);
    } finally { setLoadingEq(false); }
  };

  const loadComparison = async () => {
    const r = await fetch(`${baseUrl}/fetch_all_accounts_equity_curves_comparison_data/`);
    const d = await r.json();
    if (d.success) setComparisonData(d.accounts_equity_data);
  };

  const loadSector = async () => {
    const r = await fetch(`${baseUrl}/mac_fetch_sector_performance_breakdown/`);
    const d = await r.json();
    if (d.success) setSectorData(d.sectors);
  };

  const runMC = async id => {
    setMcRunning(true);
    try {
      const r = await fetch(`${baseUrl}/execute_portfolio_monte_carlo_risk_simulation/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: id, num_simulations: 1000, num_trades: 100 })
      });
      const d = await r.json();
      if (d.success) setMcResults(d);
      else alert('MC error: ' + d.error);
    } finally { setMcRunning(false); }
  };

  useEffect(() => { loadOverview(); }, []);
  useEffect(() => { if (selectedAcc) loadEquity(selectedAcc); }, [selectedAcc]);
  useEffect(() => { if (tab === 'compare') loadComparison(); if (tab === 'sector') loadSector(); }, [tab]);

  const filtered = () => {
    if (!overview?.all_accounts) return [];
    let list = overview.all_accounts;
    if (accFilter === 'profitable') list = list.filter(a => a.roi > 0);
    if (accFilter === 'losing')     list = list.filter(a => a.roi < 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.account_name.toLowerCase().includes(q) ||
        a.main_assets.toLowerCase().includes(q) ||
        (a.sectors && a.sectors.toLowerCase().includes(q))
      );
    }
    return list;
  };

  if (loadingOv) return (
    <div><div className="header"><Header /></div>
      <div className="main-page-body"><SideNavs />
        <div className="main-body-info">
          <style>{CSS}</style>
          <div className="mac-root" style={{ padding: 24 }}>
            <div className="mac-loading"><div className="spinner" />Loading analytics…</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="header"><Header /></div>
      <div className="main-page-body"><SideNavs />
        <div className="main-body-info">
          <style>{CSS}</style>
          <div className="mac-root" style={{ padding: '24px 28px', maxWidth: 1440 }}>

            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#e2e8f0', margin: 0, letterSpacing: '-0.02em' }}>Multi-Account Analytics</h1>
                <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 13, fontFamily: 'DM Mono,monospace' }}>
                  {overview?.total_accounts || 0} accounts · live performance dashboard
                </p>
              </div>
              <button className="mac-btn mac-btn-amber" onClick={() => setShowSynth(true)}>⟡ Synthesise</button>
            </div>

            {/* Tabs */}
            <div className="mac-tabs">
              {[['overview','Overview'],['sector','Sector View'],['compare','Comparison'],['trades','Trade Entries']].map(([id, label]) => (
                <button key={id} className={`mac-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>{label}</button>
              ))}
            </div>

            {/* ── TAB: OVERVIEW ── */}
            {tab === 'overview' && overview && (
              <>
                {/* Top 3 KPI cards */}
                <div className="mac-top-grid" style={{ marginBottom: 28 }}>
                  {overview.best_performer && (
                    <div className="mac-card mac-card-accent-green">
                      <div className="sec-hdr">🏆 Best Performer</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{overview.best_performer.account_name}</div>
                      <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono,monospace', marginBottom: 12 }}>{overview.best_performer.main_assets}</div>
                      <div className="met-grid">
                        <div><div className="met-label">ROI</div><div className="met-value" style={{ color: '#00e5a0' }}>{overview.best_performer.roi}%</div></div>
                        <div><div className="met-label">Net P&L</div><div className="met-value" style={{ color: pnl2col(overview.best_performer.net_pnl) }}>${overview.best_performer.net_pnl}</div></div>
                        <div><div className="met-label">Win Rate</div><div className="met-value">{overview.best_performer.win_rate}%</div></div>
                        <div><div className="met-label">Trades</div><div className="met-value">{overview.best_performer.total_trades}</div></div>
                      </div>
                    </div>
                  )}
                  {overview.worst_performer && (
                    <div className="mac-card mac-card-accent-red">
                      <div className="sec-hdr">📉 Worst Performer</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{overview.worst_performer.account_name}</div>
                      <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono,monospace', marginBottom: 12 }}>{overview.worst_performer.main_assets}</div>
                      <div className="met-grid">
                        <div><div className="met-label">ROI</div><div className="met-value" style={{ color: '#ff4d6d' }}>{overview.worst_performer.roi}%</div></div>
                        <div><div className="met-label">Net P&L</div><div className="met-value" style={{ color: pnl2col(overview.worst_performer.net_pnl) }}>${overview.worst_performer.net_pnl}</div></div>
                        <div><div className="met-label">Win Rate</div><div className="met-value">{overview.worst_performer.win_rate}%</div></div>
                        <div><div className="met-label">Trades</div><div className="met-value">{overview.worst_performer.total_trades}</div></div>
                      </div>
                    </div>
                  )}
                  <div className="mac-card mac-card-accent-blue">
                    <div className="sec-hdr">📊 Portfolio Averages</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>All {overview.total_accounts} Accounts</div>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono,monospace', marginBottom: 12 }}>Combined portfolio</div>
                    <div className="met-grid">
                      <div><div className="met-label">Avg ROI</div><div className="met-value" style={{ color: roi2col(overview.averages.avg_roi) }}>{overview.averages.avg_roi}%</div></div>
                      <div><div className="met-label">Avg P&L</div><div className="met-value" style={{ color: pnl2col(overview.averages.avg_net_pnl) }}>${overview.averages.avg_net_pnl}</div></div>
                      <div><div className="met-label">Avg Win Rate</div><div className="met-value">{overview.averages.avg_win_rate}%</div></div>
                      <div><div className="met-label">Accounts</div><div className="met-value">{overview.total_accounts}</div></div>
                    </div>
                  </div>
                </div>

                {/* Accounts grid */}
                <div className="mac-card" style={{ marginBottom: 24 }}>
                  <div className="sec-hdr">All Accounts</div>
                  <input className="mac-search" placeholder="🔍  Search by name, asset or sector…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
                  <div className="mac-filter-row">
                    {[['all','All'],['profitable','Profitable'],['losing','Losing']].map(([v, l]) => (
                      <button key={v} className={`mac-filter-btn${accFilter === v ? ' active' : ''}`} onClick={() => setAccFilter(v)}>
                        {l} ({v === 'all' ? overview.all_accounts.length : v === 'profitable' ? overview.all_accounts.filter(a => a.roi > 0).length : overview.all_accounts.filter(a => a.roi < 0).length})
                      </button>
                    ))}
                  </div>
                  {search && <div style={{ fontSize: 12, color: '#475569', marginBottom: 12, fontFamily: 'DM Mono,monospace' }}>{filtered().length} result(s)</div>}
                  <div className="mac-accounts-grid">
                    {filtered().map(acc => (
                      <div key={acc.account_id}
                        className={`acc-card${selectedAcc === acc.account_id ? ' selected' : ''}`}
                        onClick={() => setSelectedAcc(acc.account_id)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#e2e8f0' }}>{acc.account_name}</div>
                          <span className={`badge ${acc.roi >= 0 ? 'badge-green' : 'badge-red'}`}>
                            {acc.roi >= 0 ? '▲' : '▼'} {acc.roi}%
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono,monospace', marginBottom: 10 }}>{acc.main_assets}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div><div className="met-label">P&L</div><div style={{ color: pnl2col(acc.net_pnl), fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono,monospace' }}>${acc.net_pnl}</div></div>
                          <div><div className="met-label">Win Rate</div><div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono,monospace' }}>{acc.win_rate}%</div></div>
                          <div><div className="met-label">Trades</div><div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono,monospace' }}>{acc.total_trades}</div></div>
                          <div><div className="met-label">Balance</div><div style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13, fontFamily: 'DM Mono,monospace' }}>${acc.current_balance?.toFixed(2)}</div></div>
                        </div>
                        <button className="mc-btn" disabled={mcRunning}
                          onClick={e => { e.stopPropagation(); runMC(acc.account_id); }}>
                          {mcRunning ? '…' : '🎲 Monte Carlo'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equity curve */}
                <div className="mac-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div className="sec-hdr" style={{ marginBottom: 0, flex: 1 }}>Equity Curve</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                    {overview.all_accounts.map(a => (
                      <button key={a.account_id} className={`eq-btn${selectedAcc === a.account_id ? ' active' : ''}`}
                        onClick={() => setSelectedAcc(a.account_id)}>{a.account_name}</button>
                    ))}
                  </div>
                  {loadingEq
                    ? <div className="mac-loading"><div className="spinner" />&nbsp;Loading…</div>
                    : <EquityChart data={equityData?.equity_curve} initialCapital={equityData?.initial_capital} />
                  }
                </div>
              </>
            )}

            {/* ── TAB: SECTOR ── */}
            {tab === 'sector' && (
              <div className="mac-card">
                <div className="sec-hdr">Sector Performance Breakdown</div>
                {!sectorData ? (
                  <div className="mac-loading"><div className="spinner" />&nbsp;Loading sector data…</div>
                ) : (
                  <>
                    <div className="sector-legend" style={{ marginBottom: 20 }}>
                      {sectorData.map((s, i) => (
                        <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', fontFamily: 'DM Mono,monospace' }}>
                          <div className="sector-dot" style={{ background: SECTOR_PALETTE[i % SECTOR_PALETTE.length] }} />
                          {s.sector}
                          <span style={{ color: roi2col(s.avg_roi), fontWeight: 700 }}>{s.avg_roi > 0 ? '+' : ''}{s.avg_roi}%</span>
                        </div>
                      ))}
                    </div>
                    <SectorChart sectorData={sectorData} />
                    <div style={{ marginTop: 28 }}>
                      <div className="sec-hdr">Sector Details</div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'DM Mono,monospace' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #1e2530' }}>
                              {['Sector','Trades','Wins','Losses','Win Rate','Avg ROI','Net P&L'].map(h => (
                                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', fontSize: 10 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sectorData.sort((a, b) => b.avg_roi - a.avg_roi).map((s, i) => (
                              <tr key={s.sector} style={{ borderBottom: '1px solid #1e253033' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#7c3aed08'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '9px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: SECTOR_PALETTE[i % SECTOR_PALETTE.length] }} />
                                    <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{s.sector}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '9px 12px', color: '#94a3b8' }}>{s.total_trades}</td>
                                <td style={{ padding: '9px 12px', color: '#00e5a0' }}>{s.winning_trades}</td>
                                <td style={{ padding: '9px 12px', color: '#ff4d6d' }}>{s.losing_trades}</td>
                                <td style={{ padding: '9px 12px', color: '#e2e8f0', fontWeight: 700 }}>{s.win_rate}%</td>
                                <td style={{ padding: '9px 12px', color: roi2col(s.avg_roi), fontWeight: 700 }}>{s.avg_roi > 0 ? '+' : ''}{s.avg_roi}%</td>
                                <td style={{ padding: '9px 12px', color: pnl2col(s.net_pnl), fontWeight: 700 }}>${s.net_pnl}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── TAB: COMPARE ── */}
            {tab === 'compare' && (
              <div className="mac-card">
                <div className="sec-hdr">All Accounts — Equity Curve Comparison</div>
                {!comparisonData
                  ? <div className="mac-loading"><div className="spinner" />&nbsp;Loading…</div>
                  : <ComparisonChart curvesData={comparisonData} />
                }
                {comparisonData && (
                  <div style={{ marginTop: 28 }}>
                    <div className="sec-hdr">Account Rankings</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                      {[...( overview?.all_accounts || [])].sort((a,b) => b.roi - a.roi).map((acc, i) => (
                        <div key={acc.account_id} style={{ background: '#0a0c10', border: '1px solid #1e2530', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? '#f59e0b' : '#334155', fontFamily: 'DM Mono,monospace', minWidth: 28 }}>#{i + 1}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{acc.account_name}</div>
                            <div style={{ fontSize: 12, color: roi2col(acc.roi), fontFamily: 'DM Mono,monospace', fontWeight: 700 }}>{acc.roi > 0 ? '+' : ''}{acc.roi}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: TRADES ── */}
            {tab === 'trades' && overview && (
              <div className="mac-card">
                <div className="sec-hdr">Trade Entries</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {overview.all_accounts.map(a => (
                    <button key={a.account_id}
                      className={`eq-btn${tradesAccount === a.account_id ? ' active' : ''}`}
                      onClick={() => setTradesAccount(a.account_id)}>{a.account_name}</button>
                  ))}
                </div>
                {tradesAccount
                  ? <AccountTradesPanel accountId={tradesAccount} accountName={overview.all_accounts.find(a => a.account_id === tradesAccount)?.account_name} />
                  : <div className="mac-loading" style={{ color: '#334155' }}>Select an account above to view and edit its trades</div>
                }
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      {mcResults && <MonteCarloModal results={mcResults} onClose={() => setMcResults(null)} />}
      {showSynth && overview && (
        <SynthesiseModal
          accounts={overview.all_accounts}
          onClose={() => setShowSynth(false)}
          onSynthesize={loadOverview}
        />
      )}
    </div>
  );
}