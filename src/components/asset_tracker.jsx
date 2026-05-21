import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus, FaTrash, FaSync, FaChartLine,
  FaVolumeUp, FaVolumeMute, FaClock, FaEdit, FaBell, FaBellSlash
} from 'react-icons/fa';
import { usePushNotifications } from "./usepushnotifications";

const BASE = 'https://backend-production-c0ab.up.railway.app';

const PAIRS = [
  // ========== FOREX ==========
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD',
  'NZDUSD', 'EURGBP', 'EURJPY', 'AUDJPY', 'EURCHF', 'GBPJPY',
  'GBPCHF', 'CADJPY', 'NZDJPY', 'EURAUD', 'EURCAD', 'CHFJPY',
  
  // ========== PRECIOUS METALS & COMMODITIES ==========
  'XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD',  // Metals
  'USOIL', 'UKOIL', 'NATGAS',              // Energy
  'WHEAT', 'CORN', 'SOYBN',               // Agriculture
  
  // ========== CRYPTO ==========
  'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'ADAUSD', 'DOTUSD',
  'DOGEUSD', 'SOLUSD', 'MATICUSD', 'AVAXUSD', 'LINKUSD',
  
  // ========== INDICES ==========
  'US30', 'NAS100', 'SPX500', 'US2000', 'VIX',
  'UK100', 'GER40', 'FRA40', 'SPA35', 'NETH25',
  'JPN225', 'HK50', 'CHINA50', 'SING30',
  'AUS200', 'CAN60', 'MEX35', 'BRA60', 'ARG35',
  
  // ========== US STOCKS (Major) ==========
  // Tech Giants & Semiconductors
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META',
  'AMD', 'INTC', 'ORCL', 'CSCO', 'ADBE', 'CRM', 'AVGO',
  'QCOM', 'TXN', 'AMAT', 'LRCX', 'KLAC', 'SNPS', 'CDNS',
  'MRVL', 'NXPI', 'MU', 'ADI', 'MPWR', 'SWKS', 'QRVO', 'ON',
  'IBM', 'ACN', 'ADSK', 'AKAM', 'ANSS', 'APH', 'ANET',
  'ASML', 'MCHP', 'MTSI', 'MSI', 'MDB', 'NTAP', 'NTNX',
  'PAYC', 'PTC', 'ROP', 'SAP', 'SLAB', 'STX', 'TER',
  'TSM', 'TYL', 'UMC', 'VRSN', 'WDC', 'ZBRA',
  
  // Software & Cloud
  'NOW', 'INTU', 'WDAY', 'PANW', 'CRWD', 'ZS', 'DDOG',
  'NET', 'SNOW', 'PLTR', 'TEAM', 'FTNT', 'OKTA', 'S', 'CYBR',
  
  // Fintech & Payments
  'V', 'MA', 'PYPL', 'ADP', 'FISV', 'FIS', 'SQ', 'UBER',
  'LYFT', 'DASH', 'PINS', 'SNAP', 'SPOT', 'ROKU', 'Z',
  'ZG', 'AFRM', 'COIN', 'HOOD', 'SOFI', 'RBLX',
  
  // Financial Services & Banks
  'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'BLK', 'SCHW',
  'AXP', 'SPGI', 'CME', 'ICE', 'MCO', 'BK', 'USB', 'PNC',
  'TFC', 'COF', 'AFL', 'AON', 'AJG', 'AMP', 'BEN', 'CBOE',
  'CINF', 'DFS', 'FITB', 'HBAN', 'HIG', 'IVZ', 'KEY',
  'L', 'MTB', 'NTRS', 'NDAQ', 'PFG', 'RF', 'RJF', 'STT',
  'SYF', 'TROW', 'WRB', 'CFG', 'CMA', 'ALLY',
  
  // Insurance
  'BRK-B', 'PGR', 'ALL', 'TRV', 'AIG', 'MET', 'PRU',
  
  // Healthcare & Pharma
  'JNJ', 'LLY', 'UNH', 'PFE', 'ABBV', 'MRK', 'TMO', 'ABT',
  'DHR', 'BMY', 'AMGN', 'GILD', 'CVS', 'CI', 'ELV', 'HUM',
  'VRTX', 'REGN', 'ISRG', 'BIIB', 'MRNA', 'BNTX', 'MCK',
  'CAH', 'COR', 'IDXX', 'ALGN', 'BAX', 'BDX', 'BSX', 'DXCM',
  'EW', 'ILMN', 'IQV', 'LH', 'MDT', 'SYK', 'ZBH', 'ZTS',
  
  // Consumer Discretionary & Retail
  'HD', 'MCD', 'NKE', 'SBUX', 'TJX', 'LOW', 'BKNG', 'MAR',
  'CMG', 'F', 'GM', 'ABNB', 'SHOP', 'MELI', 'EBAY', 'ETSY',
  'TGT', 'ROST', 'YUM', 'DPZ', 'QSR', 'AAL', 'DAL', 'UAL',
  'LUV', 'CCL', 'RCL', 'EA', 'TTWO', 'AZO', 'BBY', 'CPRT',
  'DHI', 'EXPE', 'GPC', 'GRMN', 'HLT', 'KMX', 'LEN', 'LVS',
  'MGM', 'NVR', 'ORLY', 'PHM', 'TSCO', 'ULTA', 'WYNN',
  
  // Consumer Staples
  'WMT', 'PG', 'KO', 'PEP', 'COST', 'PM', 'MO', 'MDLZ',
  'CL', 'KMB', 'GIS', 'KHC', 'STZ', 'ADM', 'CAG', 'CHD',
  'CLX', 'CPB', 'EL', 'HSY', 'K', 'KDP', 'KR', 'MNST',
  'SYY', 'TAP', 'TSN', 'WBA',
  
  // Energy
  'XOM', 'CVX', 'COP', 'EOG', 'SLB', 'MPC', 'PSX', 'VLO',
  'OXY', 'HAL', 'DVN', 'HES', 'BKR', 'APA', 'FANG', 'KMI',
  'LNG', 'MRO', 'OKE', 'WMB', 'EQT',
  
  // Industrials
  'BA', 'HON', 'UNP', 'CAT', 'GE', 'RTX', 'LMT', 'UPS',
  'DE', 'MMM', 'GD', 'NOC', 'FDX', 'CSX', 'CARR', 'CMI',
  'EMR', 'ETN', 'FAST', 'GWW', 'IR', 'ITW', 'JCI', 'MAS',
  'NSC', 'ODFL', 'OTIS', 'PCAR', 'PH', 'PWR', 'ROK', 'RSG',
  'WM', 'XYL',
  
  // Communication Services
  'T', 'VZ', 'CMCSA', 'NFLX', 'DIS', 'TMUS', 'CHTR', 'LYV',
  'MTCH', 'WBD',
  
  // Real Estate
  'AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'SPG', 'O', 'AVB',
  'DLR', 'EQR', 'EXR', 'HST', 'IRM', 'VTR', 'WELL', 'WY',
  
  // Materials & Chemicals
  'LIN', 'APD', 'SHW', 'ECL', 'DD', 'NEM', 'FCX', 'DOW',
  'LYB', 'ALB', 'NUE', 'STLD', 'VMC', 'MLM',
  
  // Utilities
  'NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'AEE',
  'AES', 'AWK', 'CMS', 'CNP', 'DTE', 'ED', 'EIX', 'ES',
  'ETR', 'FE', 'LNT', 'NI', 'NRG', 'PCG', 'PEG', 'PPL',
  'VST', 'WEC', 'XEL',
  
  // Chinese ADRs
  'BABA', 'JD', 'PDD', 'BIDU', 'NIO', 'XPEV', 'LI',
  
  // ========== BONDS ==========
  'US10Y', 'US30Y', 'US2Y', 'US5Y',
  
  // ========== ADDITIONAL STOCKS ==========
  'ASTS', 'PLUG', 'FCEL', 'RIVN', 'LCID', 'HOOD', 'DASH'
];

// ─── SESSION BADGE ────────────────────────────────────────────────────────────
function SessionBadge({ sessions }) {
  if (!sessions) return null;

  const configs = {
    sydney:  { label: 'Sydney',   open: '#eaf3de', openBorder: '#c0dd97', openText: '#27500a', closedText: '#85b7eb' },
    tokyo:   { label: 'Tokyo',    open: '#eaf3de', openBorder: '#c0dd97', openText: '#27500a', closedText: '#85b7eb' },
    london:  { label: 'London',   open: '#eaf3de', openBorder: '#c0dd97', openText: '#27500a', closedText: '#85b7eb' },
    nyc:     { label: 'New York', open: '#e6f1fb', openBorder: '#378add', openText: '#042c53', closedText: '#85b7eb',
               pre: '#faeeda', preBorder: '#fac775', preText: '#633806',
               post: '#eeedfe', postBorder: '#afa9ec', postText: '#26215c' },
  };

  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
      {Object.entries(sessions).map(([key, sess]) => {
        const cfg = configs[key];
        const status = sess.status;
        let bg, border, color, label;

        if (key === 'nyc') {
          if (status === 'open')         { bg = cfg.open;  border = cfg.openBorder;  color = cfg.openText;  label = 'NYC open'; }
          else if (status === 'pre_market')  { bg = cfg.pre;   border = cfg.preBorder;   color = cfg.preText;   label = 'NYC pre'; }
          else if (status === 'post_market') { bg = cfg.post;  border = cfg.postBorder;  color = cfg.postText;  label = 'NYC post'; }
          else                           { bg = 'transparent'; border = '#b5d4f4'; color = '#85b7eb'; label = 'NYC closed'; }
        } else {
          if (status === 'open') { bg = cfg.open; border = cfg.openBorder; color = cfg.openText; label = cfg.label + ' open'; }
          else                   { bg = 'transparent'; border = '#b5d4f4'; color = '#85b7eb'; label = cfg.label + ' closed'; }
        }

        return (
          <span key={key} style={{
            fontSize: 10, fontWeight: 500, padding: '2px 8px',
            borderRadius: 6, border: `1px solid ${border}`,
            background: bg, color,
          }}>{label}</span>
        );
      })}
    </div>
  );
}

// ─── POSITION BAR ─────────────────────────────────────────────────────────────
function PositionBar({ pos }) {
  const {
    bar_position, sl_price, tp_price, entry_price,
    sl_dollars, tp_dollars, unrealised_dollars,
    price_pnl, pct_to_tp, pct_to_sl, rr_ratio, status, direction,
  } = pos;

  // bar_position: -1 = SL, 0 = entry, +1 = TP → map to 0–100% for needle
  const needlePct = bar_position !== null
    ? Math.max(2, Math.min(98, ((bar_position + 1) / 2) * 100))
    : 50;

  const isProfit = unrealised_dollars !== null && unrealised_dollars > 0;
  const isLoss   = unrealised_dollars !== null && unrealised_dollars < 0;

  const statusColor = { open: '#378add', sl_hit: '#e24b4a', tp_hit: '#639922' };
  const pnlColor = isProfit ? '#3b6d11' : isLoss ? '#a32d2d' : '#185fa5';

  const fmt = (n, decimals = 5) => n !== null && n !== undefined ? n.toFixed(decimals) : '–';
  const fmtUsd = (n) => n !== null && n !== undefined ? `${n >= 0 ? '+' : ''}$${Math.abs(n).toFixed(2)}` : '–';

  return (
    <div style={{ background: '#e6f1fb', border: '1px solid #b5d4f4', borderRadius: 10, padding: '10px 14px', marginTop: 8 }}>
      {/* Track */}
      <div style={{ position: 'relative', height: 32, marginBottom: 4 }}>
        <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 8, borderRadius: 4, background: '#c8dff5' }} />
        <div style={{ position: 'absolute', top: 12, left: 0, width: '50%', height: 8, borderRadius: '4px 0 0 4px', background: 'rgba(226,75,74,0.25)' }} />
        <div style={{ position: 'absolute', top: 12, right: 0, width: '50%', height: 8, borderRadius: '0 4px 4px 0', background: 'rgba(99,153,34,0.25)' }} />
        {/* Entry tick */}
        <div style={{ position: 'absolute', top: 8, left: 'calc(50% - 1px)', width: 2, height: 16, background: '#185fa5', borderRadius: 1 }} />
        {/* Needle */}
        {bar_position !== null && (
          <div style={{
            position: 'absolute', top: 8, left: `calc(${needlePct}% - 8px)`,
            width: 16, height: 16, borderRadius: '50%',
            background: statusColor[status] || '#378add',
            border: '2px solid #fff',
            boxShadow: `0 0 0 2px ${statusColor[status] || '#378add'}`,
            transition: 'left 0.4s ease',
          }} />
        )}
      </div>

      {/* Price labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 10 }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ color: '#a32d2d', fontWeight: 500 }}>SL {fmt(sl_price)}</div>
          <div style={{ color: '#791f1f', fontSize: 10 }}>–${sl_dollars}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#185fa5', fontWeight: 500 }}>Entry</div>
          <div style={{ color: '#0c447c', fontSize: 10 }}>{fmt(entry_price)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#3b6d11', fontWeight: 500 }}>TP {fmt(tp_price)}</div>
          <div style={{ color: '#27500a', fontSize: 10 }}>+${tp_dollars}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 8 }}>
        {[
          { v: pos.current_price ? fmt(pos.current_price) : '–', l: 'Current price', c: '#185fa5' },
          { v: fmtUsd(unrealised_dollars), l: 'P&L ($)', c: pnlColor },
          { v: price_pnl !== null ? (price_pnl >= 0 ? '+' : '') + price_pnl.toFixed(5) : '–', l: 'P&L (price)', c: pnlColor },
          { v: rr_ratio ? `${rr_ratio}×` : '–', l: 'R:R', c: '#185fa5' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #b5d4f4', borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 9, color: '#185fa5', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      {bar_position !== null && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { label: 'To TP', pct: pct_to_tp, color: '#639922', trackColor: '#c0dd97' },
            { label: 'To SL', pct: pct_to_sl, color: '#e24b4a', trackColor: '#f7c1c1' },
          ].map((b, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #b5d4f4', borderRadius: 8, padding: '6px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10 }}>
                <span style={{ color: '#185fa5', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{b.label}</span>
                <span style={{ color: b.color, fontWeight: 500 }}>{b.pct?.toFixed(1)}%</span>
              </div>
              <div style={{ background: b.trackColor, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                <div style={{ width: `${b.pct || 0}%`, height: 5, background: b.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADD POSITION MODAL ───────────────────────────────────────────────────────
function AddPositionModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    asset: 'EURUSD', direction: 'long',
    entry_price: '', sl_price: '', tp_price: '',
    sl_dollars: '', tp_dollars: '',
    current_price: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Live RR calc
  const rr = form.sl_dollars && form.tp_dollars
    ? (parseFloat(form.tp_dollars) / parseFloat(form.sl_dollars)).toFixed(2)
    : null;

  // Live pip value
  const pipVal = form.entry_price && form.sl_price && form.sl_dollars
    ? (parseFloat(form.sl_dollars) / Math.abs(parseFloat(form.entry_price) - parseFloat(form.sl_price))).toFixed(2)
    : null;

  const handleSave = async () => {
    const required = ['asset', 'entry_price', 'sl_price', 'tp_price', 'sl_dollars', 'tp_dollars'];
    if (required.some(k => !form[k])) { setError('All price and dollar fields are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-trade-position-add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          entry_price:   parseFloat(form.entry_price),
          sl_price:      parseFloat(form.sl_price),
          tp_price:      parseFloat(form.tp_price),
          sl_dollars:    parseFloat(form.sl_dollars),
          tp_dollars:    parseFloat(form.tp_dollars),
          current_price: form.current_price ? parseFloat(form.current_price) : null,
        }),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save.'); }
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const inp = {
    width: '100%', border: '1px solid #b5d4f4', borderRadius: 8,
    padding: '9px 12px', fontSize: 14, color: '#042c53',
    background: '#e6f1fb', outline: 'none', fontFamily: 'inherit',
  };
  const lbl = {
    fontSize: 11, fontWeight: 500, color: '#185fa5',
    textTransform: 'uppercase', letterSpacing: '0.4px',
    display: 'block', marginBottom: 5,
  };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 };
  const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(4,44,83,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #b5d4f4',
        width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #042c53 0%, #0c447c 50%, #185fa5 100%)',
          padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12,
          borderRadius: '16px 16px 0 0', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <FaChartLine style={{ color: '#85b7eb', fontSize: 20 }} />
          <div>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Add trade position</div>
            <div style={{ color: '#85b7eb', fontSize: 11, marginTop: 2 }}>Entry, SL price + $, TP price + $</div>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: 8, color: '#fff',
            width: 30, height: 30, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{ background: '#fcebeb', border: '1px solid #f09595', borderRadius: 8, padding: '8px 12px', color: '#791f1f', fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          {/* Asset + Direction */}
          <div style={row2}>
            <div>
              <label style={lbl}>Asset / pair</label>
              <select value={form.asset} onChange={e => f('asset', e.target.value)} style={inp}>
                {PAIRS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Direction</label>
              <select value={form.direction} onChange={e => f('direction', e.target.value)} style={inp}>
                <option value="long">▲ Long (buy)</option>
                <option value="short">▼ Short (sell)</option>
              </select>
            </div>
          </div>

          {/* Prices: SL price / Entry / TP price */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ ...lbl, marginBottom: 8 }}>Price levels</label>
            <div style={row3}>
              <div>
                <label style={{ ...lbl, color: '#a32d2d' }}>SL price</label>
                <input type="number" step="0.00001" placeholder="1.08120"
                  value={form.sl_price} onChange={e => f('sl_price', e.target.value)} style={{ ...inp, background: '#fcebeb', borderColor: '#f09595', color: '#501313' }} />
              </div>
              <div>
                <label style={{ ...lbl, color: '#0c447c' }}>Entry price</label>
                <input type="number" step="0.00001" placeholder="1.08420"
                  value={form.entry_price} onChange={e => f('entry_price', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ ...lbl, color: '#27500a' }}>TP price</label>
                <input type="number" step="0.00001" placeholder="1.09020"
                  value={form.tp_price} onChange={e => f('tp_price', e.target.value)} style={{ ...inp, background: '#eaf3de', borderColor: '#97c459', color: '#173404' }} />
              </div>
            </div>
          </div>

          {/* Dollar values */}
          <div style={row2}>
            <div>
              <label style={{ ...lbl, color: '#a32d2d' }}>SL amount ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 150"
                value={form.sl_dollars} onChange={e => f('sl_dollars', e.target.value)}
                style={{ ...inp, background: '#fcebeb', borderColor: '#f09595', color: '#501313' }} />
            </div>
            <div>
              <label style={{ ...lbl, color: '#27500a' }}>TP amount ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 450"
                value={form.tp_dollars} onChange={e => f('tp_dollars', e.target.value)}
                style={{ ...inp, background: '#eaf3de', borderColor: '#97c459', color: '#173404' }} />
            </div>
          </div>

          {/* Live metrics */}
          {(rr || pipVal) && (
            <div style={{ display: 'grid', gridTemplateColumns: rr && pipVal ? '1fr 1fr' : '1fr', gap: 8, marginBottom: 14 }}>
              {rr && (
                <div style={{ background: '#e6f1fb', border: '1px solid #b5d4f4', borderRadius: 8, padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#185fa5' }}>R:R ratio</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: parseFloat(rr) >= 2 ? '#3b6d11' : parseFloat(rr) >= 1 ? '#185fa5' : '#a32d2d' }}>
                    1 : {rr}
                  </span>
                </div>
              )}
              {pipVal && (
                <div style={{ background: '#e6f1fb', border: '1px solid #b5d4f4', borderRadius: 8, padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#185fa5' }}>Pip value</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#185fa5' }}>${pipVal}</span>
                </div>
              )}
            </div>
          )}

          {/* Current price (optional) */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Current price <span style={{ color: '#85b7eb', textTransform: 'none', letterSpacing: 0 }}>(optional — to see live P&L)</span></label>
            <input type="number" step="0.00001" placeholder="e.g. 1.08650"
              value={form.current_price} onChange={e => f('current_price', e.target.value)} style={inp} />
          </div>

          {/* Notes */}
          <div>
            <label style={lbl}>Notes <span style={{ color: '#85b7eb', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea rows={2} placeholder="e.g. H4 trend continuation, waiting for retest..."
              value={form.notes} onChange={e => f('notes', e.target.value)}
              style={{ ...inp, resize: 'vertical' }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid #e6f1fb',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          background: '#f4f8fd', borderRadius: '0 0 16px 16px',
          position: 'sticky', bottom: 0,
        }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #b5d4f4', color: '#185fa5', borderRadius: 8, padding: '9px 18px', fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            background: 'linear-gradient(135deg, #042c53, #185fa5)',
            border: 'none', color: '#fff', borderRadius: 8,
            padding: '9px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving...' : '💾 Save position'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UPDATE PRICE MODAL ───────────────────────────────────────────────────────
function UpdatePriceModal({ position, onClose, onUpdated }) {
  const [price, setPrice] = useState(position.current_price || '');
  const [saving, setSaving] = useState(false);

  // Live preview while typing
  const preview = (() => {
    if (!price || !position.entry_price) return null;
    const curr = parseFloat(price);
    const slDist = Math.abs(position.entry_price - position.sl_price);
    const pipVal = slDist > 0 ? position.sl_dollars / slDist : 0;
    const rawMove = curr - position.entry_price;
    const signedMove = position.direction === 'long' ? rawMove : -rawMove;
    const pnl = signedMove * pipVal;
    return { pnl: pnl.toFixed(2), move: rawMove.toFixed(5), positive: pnl >= 0 };
  })();

  const handleUpdate = async () => {
    if (!price) return;
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/snowai-trade-position-update-price/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: position.id, current_price: parseFloat(price) }),
      });
      if (res.ok) { onUpdated(); onClose(); }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(4,44,83,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #b5d4f4', width: '100%', maxWidth: 360 }}>
        <div style={{
          background: 'linear-gradient(135deg, #042c53, #185fa5)',
          padding: '1rem 1.25rem', borderRadius: '14px 14px 0 0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <FaEdit style={{ color: '#85b7eb' }} />
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Update current price</div>
            <div style={{ color: '#85b7eb', fontSize: 11 }}>{position.asset} — entry {position.entry_price}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, color: '#fff', width: 26, height: 26, cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <input
            type="number" step="0.00001" placeholder="Enter current market price"
            value={price} onChange={e => setPrice(e.target.value)} autoFocus
            style={{ width: '100%', border: '1px solid #b5d4f4', borderRadius: 8, padding: '10px 12px', fontSize: 15, color: '#042c53', background: '#e6f1fb', outline: 'none' }}
          />
          {/* Live preview */}
          {preview && (
            <div style={{
              marginTop: 10, background: preview.positive ? '#eaf3de' : '#fcebeb',
              border: `1px solid ${preview.positive ? '#c0dd97' : '#f7c1c1'}`,
              borderRadius: 8, padding: '8px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: preview.positive ? '#27500a' : '#791f1f' }}>
                Move: {preview.move}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: preview.positive ? '#3b6d11' : '#a32d2d' }}>
                {preview.positive ? '+' : ''}${preview.pnl}
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e6f1fb', display: 'flex', gap: 8, justifyContent: 'flex-end', background: '#f4f8fd', borderRadius: '0 0 14px 14px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #b5d4f4', color: '#185fa5', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleUpdate} disabled={saving} style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)', border: 'none', color: '#fff', borderRadius: 8, padding: '7px 18px', fontSize: 13, cursor: 'pointer' }}>
            {saving ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── POSITION CARD ────────────────────────────────────────────────────────────
function PositionCard({ position, onDelete, onUpdatePrice }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusColor = { open: '#185fa5', sl_hit: '#a32d2d', tp_hit: '#3b6d11' };
  const statusLabel = { open: 'Open', sl_hit: '⚡ SL Hit', tp_hit: '🎯 TP Hit' };
  const pnlColor = position.unrealised_dollars > 0 ? '#3b6d11' : position.unrealised_dollars < 0 ? '#a32d2d' : '#185fa5';

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${position.asset} ${position.direction} position?`)) return;
    setDeleting(true);
    try {
      await fetch(`${BASE}/snowai-trade-position-delete/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: position.id }),
      });
      onDelete();
    } catch { /* silent */ }
    finally { setDeleting(false); }
  };

  return (
    <div style={{ border: '1px solid #b5d4f4', borderRadius: 12, marginBottom: 10, background: '#fff', overflow: 'hidden' }}>
      {/* Top color strip */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #042c53, #185fa5, #378add)' }} />

      {/* Header — always visible, click to expand */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ background: '#e6f1fb', border: '1px solid #b5d4f4', borderRadius: 8, padding: '3px 10px', fontSize: 13, fontWeight: 500, color: '#042c53' }}>
          {position.asset}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '2px 7px', borderRadius: 6,
          background: position.direction === 'long' ? '#eaf3de' : '#fcebeb',
          border: `1px solid ${position.direction === 'long' ? '#c0dd97' : '#f7c1c1'}`,
          color: position.direction === 'long' ? '#27500a' : '#791f1f',
        }}>
          {position.direction === 'long' ? '▲' : '▼'} {position.direction.toUpperCase()}
        </span>
        <span style={{ fontSize: 11, color: '#185fa5' }}>@ {position.entry_price}</span>

        {position.unrealised_dollars !== null && (
          <span style={{ fontSize: 13, fontWeight: 500, color: pnlColor, marginLeft: 4 }}>
            {position.unrealised_dollars >= 0 ? '+' : ''}${Math.abs(position.unrealised_dollars).toFixed(2)}
          </span>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 5, background: '#e6f1fb', color: statusColor[position.status] }}>
          {statusLabel[position.status]}
        </span>
        <span style={{ fontSize: 12, color: '#85b7eb', marginLeft: 4 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: '0 14px 14px' }}>
          <PositionBar pos={position} />
          <SessionBadge sessions={position.sessions} />
          {position.notes && (
            <div style={{ fontSize: 12, color: '#185fa5', marginTop: 8, fontStyle: 'italic', padding: '6px 10px', background: '#e6f1fb', borderRadius: 6 }}>
              📝 {position.notes}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={e => { e.stopPropagation(); onUpdatePrice(position); }} style={{ background: '#e6f1fb', border: '1px solid #b5d4f4', color: '#185fa5', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FaEdit size={11} /> Update price
            </button>
            <button onClick={e => { e.stopPropagation(); handleDelete(); }} disabled={deleting} style={{ marginLeft: 'auto', background: '#fcebeb', border: '1px solid #f7c1c1', color: '#791f1f', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FaTrash size={11} /> {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ASSET TRACKER ───────────────────────────────────────────────────────
const AssetTracker = () => {
  const [assets, setAssets] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeTab, setActiveTab] = useState('assets');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [currentAction, setCurrentAction] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [updatingPosition, setUpdatingPosition] = useState(null);

  const [voiceTimer, setVoiceTimer] = useState({ isActive: false, minutes: 5, timeLeft: 0 });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(5);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [refreshingPositions, setRefreshingPositions] = useState(false);
  // Inside AssetTracker component, near the top:
  const push = usePushNotifications();

  const notify = (type, message, ms = 2500) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus({ type: '', message: '' }), ms);
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/get-tracked-assets/`);
      if (res.ok) setAssets(await res.json());
    } catch { notify('error', 'Network error'); }
    finally { setIsLoading(false); }
  };

  const fetchAssetUpdates = async () => {
    setCurrentAction('refreshing'); notify('info', 'Refreshing...');
    try {
      const res = await fetch(`${BASE}/fetch-asset-update/`);
      if (res.ok) { setAssets(await res.json()); notify('success', 'Refreshed'); }
      else notify('error', 'Refresh failed');
    } catch { notify('error', 'Network error'); }
    finally { setCurrentAction(''); }
  };

  const addAsset = async () => {
    if (!selectedAsset) { notify('warning', 'Select an asset first'); return; }
    setCurrentAction('adding');
    try {
      const res = await fetch(`${BASE}/add-tracked-asset/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: selectedAsset }),
      });
      if (res.ok) { setIsModalOpen(false); setSelectedAsset(''); fetchAssets(); }
      else notify('error', 'Failed to add');
    } catch { notify('error', 'Network error'); }
    finally { setCurrentAction(''); }
  };

  const removeAsset = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    setProcessingId(id);
    try {
      const res = await fetch(`${BASE}/remove-tracked-asset/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAssets();
    } catch { notify('error', 'Network error'); }
    finally { setProcessingId(null); }
  };

  
  const fetchPositions = async () => {
  try {
    const res = await fetch(`${BASE}/snowai-trade-positions/`);
    if (res.ok) setPositions(await res.json());
  } catch { /* silent */ }
};

const refreshPositionPrices = async () => {
  setRefreshingPositions(true);
  notify('info', 'Fetching live prices...');
  try {
    const res = await fetch(`${BASE}/snowai-trade-positions-refresh/`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setPositions(data.positions);
      notify('success', `Updated ${data.updated_count} of ${data.total} positions`);
    } else {
      notify('error', 'Refresh failed');
    }
  } catch {
    notify('error', 'Network error');
  } finally {
    setRefreshingPositions(false);
  }
};

  // Voice timer
  const readAssetPrices = () => {
    if (!assets.length) return;
    const txt = 'Asset update: ' + assets.map((a, i) => {
      const dir = a.percent_change > 0 ? 'up' : a.percent_change < 0 ? 'down' : 'unchanged';
      return `${a.asset} is ${dir} ${Math.abs(a.percent_change)} percent`;
    }).join(', ');
    const u = new SpeechSynthesisUtterance(txt);
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) u.voice = v;
    u.rate = 0.9; window.speechSynthesis.speak(u);
  };

  const startVoiceTimer = () => {
    if (!assets.length) { notify('warning', 'Add assets first'); return; }
    setVoiceTimer({ isActive: true, minutes: tempMinutes, timeLeft: tempMinutes * 60 });
    readAssetPrices();
    timerRef.current = setInterval(() => { fetchAssetUpdates(); setTimeout(readAssetPrices, 2000); }, tempMinutes * 60 * 1000);
    countdownRef.current = setInterval(() => setVoiceTimer(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000);
    setIsVoiceModalOpen(false);
    notify('success', `Voice timer — every ${tempMinutes}min`);
  };

  const stopVoiceTimer = () => {
    clearInterval(timerRef.current); clearInterval(countdownRef.current);
    timerRef.current = null; countdownRef.current = null;
    setVoiceTimer({ isActive: false, minutes: 5, timeLeft: 0 });
    window.speechSynthesis.cancel();
    notify('info', 'Voice timer stopped');
  };

  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => { fetchAssets(); fetchPositions(); }, []);
  useEffect(() => () => {
    clearInterval(timerRef.current); clearInterval(countdownRef.current);
    window.speechSynthesis.cancel();
  }, []);

  const tabStyle = active => ({
    flex: 1, padding: '7px 0', cursor: 'pointer', fontSize: 13, fontWeight: 500,
    border: active ? 'none' : '1px solid #b5d4f4',
    borderRadius: 8, transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #042c53, #185fa5)' : 'transparent',
    color: active ? '#fff' : '#185fa5',
  });

  const getStatusClass = () => ({ success: 'alert-success', error: 'alert-danger', warning: 'alert-warning', info: 'alert-info' }[actionStatus.type] || '');

  return (
    <div className="asset-tracker mt-3 card shadow-sm">
      {showAddPosition && <AddPositionModal onClose={() => setShowAddPosition(false)} onSaved={fetchPositions} />}
      {updatingPosition && <UpdatePriceModal position={updatingPosition} onClose={() => setUpdatingPosition(null)} onUpdated={fetchPositions} />}

      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-primary d-flex align-items-center">
            <FaChartLine className="me-2" /> Asset Tracker
          </h5>
          <div className="d-flex align-items-center gap-2">
            {activeTab === 'assets' && (
              <>
                {voiceTimer.isActive ? (
                  <>
                    <span className="badge bg-success"><FaClock className="me-1" />{formatTime(voiceTimer.timeLeft)}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={stopVoiceTimer}><FaVolumeMute /></button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setIsVoiceModalOpen(true)}><FaVolumeUp /></button>
                )}
                <button className="btn btn-sm btn-primary" onClick={() => setIsModalOpen(true)}><FaPlus /> Add</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchAssetUpdates} disabled={currentAction !== ''}>
                  <FaSync className={currentAction === 'refreshing' ? 'fa-spin' : ''} />
                </button>
              </>
            )}
            
            {activeTab === 'positions' && (
              <div className="d-flex gap-2 align-items-center">

                {/* Push notification toggle */}
                {push.isSupported && (
                  <button
                    className={`btn btn-sm ${push.isSubscribed ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={push.isSubscribed ? push.unsubscribe : push.subscribe}
                    disabled={push.isLoading}
                    title={push.isSubscribed ? 'Notifications on — click to disable' : 'Enable trade notifications'}
                    style={push.isSubscribed ? {
                      background: 'linear-gradient(135deg, #27500a, #3b6d11)',
                      border: 'none', color: '#fff'
                    } : {}}
                  >
                    {push.isLoading
                      ? <span className="spinner-border spinner-border-sm" />
                      : push.isSubscribed
                        ? <><FaBell /> <span style={{ fontSize: 11 }}>Alerts on</span></>
                        : <FaBellSlash />
                    }
                  </button>
                )}

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={refreshPositionPrices}
                  disabled={refreshingPositions}
                  title="Fetch live prices"
                >
                  <FaSync className={refreshingPositions ? 'fa-spin' : ''} />
                </button>

                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddPosition(true)}
                  style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)', border: 'none' }}
                >
                  <FaPlus /> New position
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button style={tabStyle(activeTab === 'assets')} onClick={() => setActiveTab('assets')}>📊 Tracked Assets</button>
          <button style={tabStyle(activeTab === 'positions')} onClick={() => setActiveTab('positions')}>📈 Positions ({positions.length})</button>
        </div>

        {actionStatus.message && (
          <div className={`alert ${getStatusClass()} py-1 mt-2 mb-0 small text-center`}>{actionStatus.message}</div>
        )}
      </div>

      <div className="card-body p-2">
        {activeTab === 'assets' && (
          isLoading ? (
            <div className="text-center py-3"><div className="spinner-border text-primary" /><p className="mt-2 text-muted">Loading...</p></div>
          ) : assets.length === 0 ? (
            <div className="text-center py-3"><p className="text-muted">No assets tracked. Add one to start monitoring.</p></div>
          ) : assets.map(a => (
            <div key={a.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
              <div className="fw-medium">{a.asset}</div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${a.percent_change > 0 ? 'bg-success' : a.percent_change < 0 ? 'bg-danger' : 'bg-secondary'}`}>
                  {a.percent_change > 0 ? '+' : ''}{a.percent_change}%
                </span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeAsset(a.id, a.asset)} disabled={processingId === a.id}>
                  {processingId === a.id ? <span className="spinner-border spinner-border-sm" /> : <FaTrash size={12} />}
                </button>
              </div>
            </div>
          ))
        )}

        {activeTab === 'positions' && (
          <div style={{ padding: '8px 4px' }}>
            {positions.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted mb-2">No positions yet.</p>
                <button className="btn btn-sm btn-primary" onClick={() => setShowAddPosition(true)}
                  style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)', border: 'none' }}>
                  <FaPlus /> Add first position
                </button>
              </div>
            ) : positions.map(pos => (
              <PositionCard key={pos.id} position={pos} onDelete={fetchPositions} onUpdatePrice={p => setUpdatingPosition(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Add asset modal */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(4,44,83,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)' }}>
                <h5 className="modal-title text-white">Add asset to track</h5>
                <button className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="modal-body">
                <select className="form-select form-select-lg" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)}>
                  <option value="">-- Select an asset --</option>
                  {PAIRS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={addAsset} disabled={!selectedAsset || currentAction === 'adding'}
                  style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)', border: 'none' }}>
                  {currentAction === 'adding' ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice timer modal */}
      {isVoiceModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(4,44,83,0.55)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)' }}>
                <h5 className="modal-title text-white"><FaVolumeUp className="me-2" />Voice timer</h5>
                <button className="btn-close btn-close-white" onClick={() => setIsVoiceModalOpen(false)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Interval (minutes)</label>
                <input type="number" className="form-control form-control-lg" value={tempMinutes}
                  onChange={e => setTempMinutes(Math.max(1, parseInt(e.target.value) || 1))} min="1" max="60" />
                <div className="small text-muted mt-2">Announces price changes for all tracked assets at this interval.</div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsVoiceModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={startVoiceTimer}
                  style={{ background: 'linear-gradient(135deg, #042c53, #185fa5)', border: 'none' }}>
                  <FaVolumeUp className="me-1" /> Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTracker;