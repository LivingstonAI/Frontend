import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus, FaTrash, FaSync, FaChartLine,
  FaVolumeUp, FaVolumeMute, FaClock, FaEdit
} from 'react-icons/fa';

const baseURL = 'https://backend-production-c0ab.up.railway.app';

const CURRENCY_PAIRS = [
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

// ─── POSITION BAR ─────────────────────────────────────────────────────────────
function PositionBar({ position }) {
  const { progress, sl_dollars, tp_dollars, unrealised_dollars, rr_ratio, status, direction } = position;

  // progress: -1 = SL, 0 = entry, +1 = TP
  // Map to 0–100% for the bar (0% = SL side, 50% = entry, 100% = TP side)
  const needlePercent = progress !== null
    ? Math.max(2, Math.min(98, ((progress + 1) / 2) * 100))
    : 50;

  const isProfit = unrealised_dollars !== null && unrealised_dollars > 0;
  const isLoss   = unrealised_dollars !== null && unrealised_dollars < 0;

  const statusColors = {
    open:    '#378add',
    sl_hit:  '#e24b4a',
    tp_hit:  '#639922',
  };

  return (
    <div style={{
      background: '#e6f1fb',
      border: '1px solid #b5d4f4',
      borderRadius: 10,
      padding: '10px 14px',
      marginTop: 8,
    }}>
      {/* Track */}
      <div style={{ position: 'relative', height: 28, marginBottom: 6 }}>
        {/* Background track */}
        <div style={{
          position: 'absolute', top: 10, left: 0, right: 0,
          height: 8, borderRadius: 4, background: '#b5d4f4',
        }} />
        {/* SL zone (left 50%) */}
        <div style={{
          position: 'absolute', top: 10, left: 0, width: '50%',
          height: 8, borderRadius: '4px 0 0 4px',
          background: 'rgba(226,75,74,0.35)',
        }} />
        {/* TP zone (right 50%) */}
        <div style={{
          position: 'absolute', top: 10, right: 0, width: '50%',
          height: 8, borderRadius: '0 4px 4px 0',
          background: 'rgba(99,153,34,0.35)',
        }} />
        {/* Entry line */}
        <div style={{
          position: 'absolute', top: 6, left: 'calc(50% - 1px)',
          width: 2, height: 16, background: '#185fa5', borderRadius: 1,
        }} />
        {/* Needle */}
        {progress !== null && (
          <div style={{
            position: 'absolute', top: 7,
            left: `calc(${needlePercent}% - 7px)`,
            width: 14, height: 14, borderRadius: '50%',
            background: statusColors[status] || '#378add',
            border: '2px solid #fff',
            boxShadow: `0 0 0 2px ${statusColors[status] || '#378add'}`,
            transition: 'left 0.4s ease',
          }} />
        )}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 500, marginBottom: 8 }}>
        <span style={{ color: '#a32d2d' }}>SL –${sl_dollars}</span>
        <span style={{ color: '#185fa5' }}>Entry</span>
        <span style={{ color: '#3b6d11' }}>TP +${tp_dollars}</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {[
          {
            val: unrealised_dollars !== null
              ? `${unrealised_dollars >= 0 ? '+' : ''}$${unrealised_dollars.toFixed(2)}`
              : 'N/A',
            lbl: 'Unrealised',
            color: isProfit ? '#3b6d11' : isLoss ? '#a32d2d' : '#185fa5',
          },
          {
            val: rr_ratio ? `${rr_ratio}×` : 'N/A',
            lbl: 'R:R ratio',
            color: '#185fa5',
          },
          {
            val: status === 'sl_hit' ? 'SL Hit' : status === 'tp_hit' ? 'TP Hit' : direction.toUpperCase(),
            lbl: 'Status',
            color: statusColors[status] || '#185fa5',
          },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #b5d4f4',
            borderRadius: 8, padding: '6px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: '#185fa5', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD POSITION MODAL ───────────────────────────────────────────────────────
function AddPositionModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    asset: 'EURUSD',
    direction: 'long',
    entry_price: '',
    sl_dollars: '',
    tp_dollars: '',
    current_price: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const rrRatio = form.sl_dollars && form.tp_dollars
    ? (parseFloat(form.tp_dollars) / parseFloat(form.sl_dollars)).toFixed(2)
    : null;

  const handleSave = async () => {
    if (!form.asset || !form.entry_price || !form.sl_dollars || !form.tp_dollars) {
      setError('Asset, entry price, SL $, and TP $ are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${baseURL}/snowai-trade-position-add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          entry_price: parseFloat(form.entry_price),
          sl_dollars: parseFloat(form.sl_dollars),
          tp_dollars: parseFloat(form.tp_dollars),
          current_price: form.current_price ? parseFloat(form.current_price) : null,
        }),
      });
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to save.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #b5d4f4',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 500,
    color: '#185fa5',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    display: 'block',
    marginBottom: 5,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,30,60,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #b5d4f4',
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0c447c 0%, #185fa5 60%, #378add 100%)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderRadius: '16px 16px 0 0',
        }}>
          <FaChartLine style={{ color: '#85b7eb', fontSize: 20 }} />
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 500, margin: 0, flex: 1 }}>
            Add trade position
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: 8, color: '#fff', width: 30, height: 30,
            cursor: 'pointer', fontSize: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              background: '#fcebeb', border: '1px solid #f09595',
              borderRadius: 8, padding: '8px 12px',
              color: '#791f1f', fontSize: 13, marginBottom: 14,
            }}>{error}</div>
          )}

          {/* Asset + Direction */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Asset / pair</label>
              <select value={form.asset} onChange={e => setForm(f => ({...f, asset: e.target.value}))} style={inputStyle}>
                {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Direction</label>
              <select value={form.direction} onChange={e => setForm(f => ({...f, direction: e.target.value}))} style={inputStyle}>
                <option value="long">Long (buy)</option>
                <option value="short">Short (sell)</option>
              </select>
            </div>
          </div>

          {/* Entry + Current */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Entry price</label>
              <input type="number" step="0.00001" placeholder="e.g. 1.08420"
                value={form.entry_price}
                onChange={e => setForm(f => ({...f, entry_price: e.target.value}))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Current price <span style={{ color: '#85b7eb' }}>(optional)</span></label>
              <input type="number" step="0.00001" placeholder="e.g. 1.08650"
                value={form.current_price}
                onChange={e => setForm(f => ({...f, current_price: e.target.value}))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* SL $ + TP $ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>SL amount ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 150"
                value={form.sl_dollars}
                onChange={e => setForm(f => ({...f, sl_dollars: e.target.value}))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>TP amount ($)</label>
              <input type="number" step="0.01" placeholder="e.g. 450"
                value={form.tp_dollars}
                onChange={e => setForm(f => ({...f, tp_dollars: e.target.value}))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* RR preview */}
          {rrRatio && (
            <div style={{
              background: '#e6f1fb', border: '1px solid #b5d4f4',
              borderRadius: 8, padding: '8px 14px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 14,
            }}>
              <span style={{ fontSize: 13, color: '#185fa5' }}>Risk : Reward ratio</span>
              <span style={{
                fontSize: 15, fontWeight: 500,
                color: parseFloat(rrRatio) >= 2 ? '#3b6d11' : parseFloat(rrRatio) >= 1 ? '#185fa5' : '#a32d2d',
              }}>1 : {rrRatio}</span>
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes <span style={{ color: '#85b7eb' }}>(optional)</span></label>
            <textarea
              rows={2}
              placeholder="e.g. Trend continuation, H4 structure..."
              value={form.notes}
              onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e6f1fb',
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          background: '#f7fafd',
          borderRadius: '0 0 16px 16px',
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #b5d4f4',
            color: '#185fa5', borderRadius: 8, padding: '9px 18px',
            fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            background: 'linear-gradient(135deg, #185fa5, #378add)',
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

  const handleUpdate = async () => {
    if (!price) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseURL}/snowai-trade-position-update-price/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: position.id, current_price: parseFloat(price) }),
      });
      if (res.ok) { onUpdated(); onClose(); }
    } catch { /* silent */ } finally { setSaving(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(10,30,60,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #b5d4f4',
        width: '100%', maxWidth: 340,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0c447c, #378add)',
          padding: '1rem 1.25rem',
          borderRadius: '14px 14px 0 0',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <FaEdit style={{ color: '#85b7eb' }} />
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Update current price</span>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: 6, color: '#fff',
            width: 26, height: 26, cursor: 'pointer', fontSize: 16,
          }}>×</button>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 13, color: '#185fa5', marginBottom: 10 }}>
            {position.asset} — Entry @ {position.entry_price}
          </p>
          <input
            type="number"
            step="0.00001"
            placeholder="Enter current price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{
              width: '100%', border: '1px solid #b5d4f4', borderRadius: 8,
              padding: '9px 12px', fontSize: 14, color: '#042c53',
              background: '#e6f1fb', outline: 'none',
            }}
            autoFocus
          />
        </div>
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #e6f1fb',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
          background: '#f7fafd', borderRadius: '0 0 14px 14px',
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #b5d4f4',
            color: '#185fa5', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleUpdate} disabled={saving} style={{
            background: 'linear-gradient(135deg, #185fa5, #378add)',
            border: 'none', color: '#fff', borderRadius: 8,
            padding: '7px 18px', fontSize: 13, cursor: 'pointer',
          }}>
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

  const statusColors = { open: '#185fa5', sl_hit: '#a32d2d', tp_hit: '#3b6d11' };
  const statusLabels = { open: 'Open', sl_hit: 'SL Hit', tp_hit: 'TP Hit' };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${position.asset} position?`)) return;
    setDeleting(true);
    try {
      await fetch(`${baseURL}/snowai-trade-position-delete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: position.id }),
      });
      onDelete();
    } catch { /* silent */ } finally { setDeleting(false); }
  };

  return (
    <div style={{
      border: '1px solid #b5d4f4',
      borderRadius: 12,
      marginBottom: 10,
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* Card top strip */}
      <div style={{
        background: 'linear-gradient(90deg, #0c447c, #185fa5)',
        height: 3,
      }} />

      {/* Header row */}
      <div style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
      }} onClick={() => setExpanded(e => !e)}>
        <div style={{
          background: '#e6f1fb',
          border: '1px solid #b5d4f4',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 13,
          fontWeight: 500,
          color: '#042c53',
        }}>{position.asset}</div>

        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: position.direction === 'long' ? '#3b6d11' : '#a32d2d',
          background: position.direction === 'long' ? '#eaf3de' : '#fcebeb',
          border: `1px solid ${position.direction === 'long' ? '#c0dd97' : '#f7c1c1'}`,
          borderRadius: 6,
          padding: '2px 8px',
        }}>
          {position.direction === 'long' ? '▲ LONG' : '▼ SHORT'}
        </span>

        <span style={{ fontSize: 12, color: '#185fa5', marginLeft: 4 }}>
          @ {position.entry_price}
        </span>

        {position.unrealised_dollars !== null && (
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: position.unrealised_dollars >= 0 ? '#3b6d11' : '#a32d2d',
            marginLeft: 'auto',
          }}>
            {position.unrealised_dollars >= 0 ? '+' : ''}${position.unrealised_dollars.toFixed(2)}
          </span>
        )}

        <span style={{
          fontSize: 10,
          fontWeight: 500,
          color: statusColors[position.status],
          background: '#e6f1fb',
          borderRadius: 5,
          padding: '2px 6px',
        }}>{statusLabels[position.status]}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 14px 14px' }}>
          <PositionBar position={position} />

          {position.notes && (
            <p style={{ fontSize: 12, color: '#185fa5', margin: '8px 0 0', fontStyle: 'italic' }}>
              📝 {position.notes}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onUpdatePrice(position); }}
              style={{
                background: '#e6f1fb', border: '1px solid #b5d4f4',
                color: '#185fa5', borderRadius: 8,
                padding: '6px 12px', fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <FaEdit size={11} /> Update price
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              disabled={deleting}
              style={{
                background: '#fcebeb', border: '1px solid #f7c1c1',
                color: '#791f1f', borderRadius: 8,
                padding: '6px 12px', fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                marginLeft: 'auto',
              }}
            >
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

  // Voice timer
  const [voiceTimer, setVoiceTimer] = useState({ isActive: false, minutes: 5, timeLeft: 0 });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(5);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const notify = (type, message, ms = 2500) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus({ type: '', message: '' }), ms);
  };

  // ── Assets API ──
  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseURL}/get-tracked-assets/`);
      if (res.ok) setAssets(await res.json());
    } catch { notify('error', 'Network error'); }
    finally { setIsLoading(false); }
  };

  const fetchAssetUpdates = async () => {
    setCurrentAction('refreshing');
    notify('info', 'Refreshing...');
    try {
      const res = await fetch(`${baseURL}/fetch-asset-update/`);
      if (res.ok) { setAssets(await res.json()); notify('success', 'Refresh complete'); }
      else notify('error', 'Refresh failed');
    } catch { notify('error', 'Network error'); }
    finally { setCurrentAction(''); }
  };

  const addAsset = async () => {
    if (!selectedAsset) { notify('warning', 'Select an asset first'); return; }
    setCurrentAction('adding');
    try {
      const res = await fetch(`${baseURL}/add-tracked-asset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`${baseURL}/remove-tracked-asset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchAssets();
    } catch { notify('error', 'Network error'); }
    finally { setProcessingId(null); }
  };

  // ── Positions API ──
  const fetchPositions = async () => {
    try {
      const res = await fetch(`${baseURL}/snowai-trade-positions/`);
      if (res.ok) setPositions(await res.json());
    } catch { /* silent */ }
  };

  // ── Voice Timer ──
  const readAssetPrices = () => {
    if (!assets.length) return;
    let txt = 'Asset update: ';
    assets.forEach((a, i) => {
      const dir = a.percent_change > 0 ? 'up' : a.percent_change < 0 ? 'down' : 'unchanged';
      txt += `${a.asset} is ${dir} ${Math.abs(a.percent_change)} percent`;
      if (i < assets.length - 1) txt += ', ';
    });
    const u = new SpeechSynthesisUtterance(txt);
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) u.voice = v;
    u.rate = 0.9; u.pitch = 1; u.volume = 0.8;
    window.speechSynthesis.speak(u);
  };

  const startVoiceTimer = () => {
    if (!assets.length) { notify('warning', 'Add assets first'); return; }
    setVoiceTimer({ isActive: true, minutes: tempMinutes, timeLeft: tempMinutes * 60 });
    readAssetPrices();
    timerRef.current = setInterval(() => { fetchAssetUpdates(); setTimeout(readAssetPrices, 2000); }, tempMinutes * 60 * 1000);
    countdownRef.current = setInterval(() => setVoiceTimer(p => ({ ...p, timeLeft: p.timeLeft - 1 })), 1000);
    setIsVoiceModalOpen(false);
    notify('success', `Voice timer started — every ${tempMinutes}min`);
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
  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(countdownRef.current); window.speechSynthesis.cancel(); }, []);

  const getStatusClass = () => ({ success: 'alert-success', error: 'alert-danger', warning: 'alert-warning', info: 'alert-info' }[actionStatus.type] || '');

  // Tab styles
  const tabStyle = (active) => ({
    flex: 1,
    padding: '8px 0',
    background: active ? 'linear-gradient(135deg, #0c447c, #378add)' : 'transparent',
    border: active ? 'none' : '1px solid #b5d4f4',
    color: active ? '#fff' : '#185fa5',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.2s',
  });

  return (
    <div className="asset-tracker mt-3 card shadow-sm">
      {showAddPosition && (
        <AddPositionModal
          onClose={() => setShowAddPosition(false)}
          onSaved={fetchPositions}
        />
      )}
      {updatingPosition && (
        <UpdatePriceModal
          position={updatingPosition}
          onClose={() => setUpdatingPosition(null)}
          onUpdated={fetchPositions}
        />
      )}

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
                    <span className="badge bg-success">
                      <FaClock className="me-1" />{formatTime(voiceTimer.timeLeft)}
                    </span>
                    <button className="btn btn-sm btn-outline-danger" onClick={stopVoiceTimer} title="Stop voice timer">
                      <FaVolumeMute />
                    </button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setIsVoiceModalOpen(true)} title="Voice timer">
                    <FaVolumeUp />
                  </button>
                )}
                <button className="btn btn-sm btn-primary" onClick={() => setIsModalOpen(true)}><FaPlus /> Add</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={fetchAssetUpdates} disabled={currentAction !== ''}>
                  <FaSync className={currentAction === 'refreshing' ? 'fa-spin' : ''} />
                </button>
              </>
            )}
            {activeTab === 'positions' && (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowAddPosition(true)}
                style={{ background: 'linear-gradient(135deg, #0c447c, #378add)', border: 'none' }}
              >
                <FaPlus /> New position
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button style={tabStyle(activeTab === 'assets')} onClick={() => setActiveTab('assets')}>
            📊 Tracked Assets
          </button>
          <button style={tabStyle(activeTab === 'positions')} onClick={() => setActiveTab('positions')}>
            📈 Positions ({positions.length})
          </button>
        </div>

        {actionStatus.message && (
          <div className={`alert ${getStatusClass()} py-1 mt-2 mb-0 small text-center`}>
            {actionStatus.message}
          </div>
        )}
      </div>

      <div className="card-body p-2">
        {/* ── ASSETS TAB ── */}
        {activeTab === 'assets' && (
          isLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted">Loading...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-muted mb-0">No assets tracked. Add one to start monitoring.</p>
            </div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <div className="fw-medium">{asset.asset}</div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${asset.percent_change > 0 ? 'bg-success' : asset.percent_change < 0 ? 'bg-danger' : 'bg-secondary'}`}>
                    {asset.percent_change > 0 ? '+' : ''}{asset.percent_change}%
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeAsset(asset.id, asset.asset)}
                    disabled={processingId === asset.id}
                  >
                    {processingId === asset.id
                      ? <span className="spinner-border spinner-border-sm" />
                      : <FaTrash size={12} />}
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* ── POSITIONS TAB ── */}
        {activeTab === 'positions' && (
          <div style={{ padding: '8px 4px' }}>
            {positions.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted mb-2">No positions yet.</p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddPosition(true)}
                  style={{ background: 'linear-gradient(135deg, #0c447c, #378add)', border: 'none' }}
                >
                  <FaPlus /> Add first position
                </button>
              </div>
            ) : (
              positions.map(pos => (
                <PositionCard
                  key={pos.id}
                  position={pos}
                  onDelete={fetchPositions}
                  onUpdatePrice={(p) => setUpdatingPosition(p)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Add asset modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0c447c, #378add)' }}>
                <h5 className="modal-title text-white">Add Asset to Track</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="modal-body">
                <select className="form-select form-select-lg mb-2" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)}>
                  <option value="">-- Select an asset --</option>
                  {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={addAsset}
                  disabled={!selectedAsset || currentAction === 'adding'}
                  style={{ background: 'linear-gradient(135deg, #185fa5, #378add)', border: 'none' }}
                >
                  {currentAction === 'adding' ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice timer modal */}
      {isVoiceModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0c447c, #378add)' }}>
                <h5 className="modal-title text-white"><FaVolumeUp className="me-2" />Voice Timer</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsVoiceModalOpen(false)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Interval (minutes)</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  value={tempMinutes}
                  onChange={e => setTempMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1" max="60"
                />
                <div className="small text-muted mt-2">Announces price changes for all tracked assets.</div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsVoiceModalOpen(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={startVoiceTimer}
                  style={{ background: 'linear-gradient(135deg, #185fa5, #378add)', border: 'none' }}
                >
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