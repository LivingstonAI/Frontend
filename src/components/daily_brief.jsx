import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import "bootstrap/dist/css/bootstrap.min.css";

// ─── ASSET REGISTRY ──────────────────────────────────────────────────────────
// All tickers mapped to Marketaux-compatible symbols.
// Forex: use plain pair (e.g. EURUSD). Commodities/indices/bonds: plain symbol without =F or ^.
const ASSET_REGISTRY = {
  forex: {
    label: "FOREX",
    icon: "₿",
    assets: [
      'EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF',
      'NZDUSD','EURGBP','EURJPY','GBPJPY','AUDJPY','EURCHF',
      'USDZAR','EURAUD'
    ]
  },
  indices: {
    label: "INDICES",
    icon: "◈",
    assets: [
      // US
      'SPX','DJI','IXIC','RUT','VIX',
      // European
      'FTSE','DAX','CAC','IBEX','AEX','SMI','OMXS30','BFX',
      // Asian
      'N225','HSI','SHCOMP','STI','SENSEX','NIFTY','KOSPI','TWII','JKSE',
      // Other
      'ASX200','TSX','MXX','IBOV','MERVAL'
    ]
  },
  commodities: {
    label: "COMMODITIES",
    icon: "◆",
    assets: [
      // Precious Metals
      'XAUUSD','XAGUSD','XPTUSD','XPDUSD',
      // Energy
      'USOIL','UKOIL','NATGAS','GASOLINE','HEATING_OIL',
      // Base Metals
      'COPPER','ALUMINUM',
      // Agricultural
      'CORN','WHEAT','SOYBEANS','COFFEE','SUGAR','COTTON','COCOA','LUMBER'
    ]
  },
  bonds: {
    label: "BONDS",
    icon: "⬡",
    assets: [
      'US10Y','US30Y','US5Y','US3M',
      'ZN','ZB','ZT','ZF'
    ]
  },
  stocks: {
    label: "STOCKS",
    icon: "▲",
    assets: [
      // Tech Giants & Semiconductors
      'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC',
      'ORCL','CSCO','ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC',
      'SNPS','CDNS','MRVL','NXPI','MU','ADI','MPWR','IBM','ACN','ADSK',
      'AKAM','ANSS','APH','ANET','ASML','KEYS','MCHP','MSI','MDB','NTAP',
      'NTNX','PAYC','PTC','ROP','SAP','STX','TER','TSM','VRSN','WDC','ZBRA',
      // Software & Cloud
      'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR',
      'TEAM','FTNT','OKTA','CYBR',
      // Fintech & Payments
      'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER',
      'LYFT','DASH','PINS','SNAP','SPOT','ROKU','AFRM','COIN','HOOD','SOFI',
      'RBLX','ASTS',
      // Financial Services & Banks
      'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME',
      'ICE','MCO','BK','USB','PNC','TFC','COF','AFL','AON','AJG','AMP',
      'BEN','CBOE','CINF','DFS','FITB','GL','HBAN','HIG','IVZ','KEY',
      'LNC','MTB','NTRS','NDAQ','PFG','RF','RJF','STT','SYF','TROW',
      'CFG','CMA','EWBC','WAL','WBS','ALLY',
      // Insurance
      'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
      // Healthcare & Pharma
      'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY',
      'AMGN','GILD','CVS','CI','ELV','HUM','VRTX','REGN','ISRG','BIIB',
      'MRNA','BNTX','ALNY','MCK','CAH','IDXX','BAX','BDX','BSX','DXCM',
      'EW','HOLX','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PODD',
      'RMD','STE','SYK','UHS','ZBH','ZTS','TDOC','VEEV','NVAX',
      // Consumer Discretionary & Retail
      'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM',
      'ABNB','SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','AAL',
      'DAL','UAL','LUV','CCL','RCL','EA','TTWO','RIVN','LCID','AZO','BBY',
      'BURL','CPRT','DHI','DRI','EXPE','GPC','GRMN','HAS','HLT','KMX',
      'LEN','LVS','MGM','NVR','ORLY','PHM','POOL','RL','TSCO','ULTA',
      'WHR','WYNN','APTV','DG','DLTR','FIVE','FL','GPS','GT','LAD','LKQ',
      'NCLH','NWL','PVH',
      // Consumer Staples
      'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS',
      'KHC','STZ','ADM','CAG','CHD','CLX','CPB','EL','HSY','KDP','KR',
      'MKC','MNST','SJM','SYY','TAP','TSN','WBA','BG','HRL',
      // Energy
      'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN',
      'HES','BKR','APA','CTRA','FANG','KMI','LNG','MRO','OKE','TRGP',
      'WMB','EQT','AR','CQP','EXE','MTDR','OVV','PBF','RIG','SM',
      // Industrials
      'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD',
      'NOC','FDX','CSX','HWM','TDG','HEI','LHX','TXT','CARR','CHRW',
      'CMI','DOV','EMR','ETN','EXPD','FAST','FTV','GNRC','GWW','IEX',
      'IR','ITW','JBHT','JCI','LDOS','MAS','NSC','ODFL','OTIS','PCAR',
      'PH','PWR','ROK','ROL','RSG','SNA','SWK','TT','URI','VRSK','WAB','WM',
      // Communication Services & Media
      'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA',
      'OMC','PARA','WBD','IPG',
      // Real Estate & REITs
      'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE',
      'DLR','EQR','ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC',
      'UDR','VTR','WELL','WY','INVH','VNO',
      // Materials & Chemicals
      'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB',
      'EMN','SQM','AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS',
      'NUE','PKG','PPG','SEE','STLD','VMC','AVY','AA','MP','RS',
      // Utilities
      'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS',
      'CNP','DTE','ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG',
      'PCG','PEG','PNW','PPL','VST','WEC','XEL','CEG',
      // Chinese ADRs
      'BABA','JD','PDD','BIDU','NIO','XPEV','LI'
    ]
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

  :root {
    --intel-bg: #03080f;
    --intel-panel: #070f1c;
    --intel-border: #0d2444;
    --intel-blue: #1a6bff;
    --intel-blue-glow: #1a6bff44;
    --intel-blue-dim: #0d3a8a;
    --intel-accent: #00d4ff;
    --intel-text: #c8daf2;
    --intel-text-dim: #4a6a8a;
    --intel-white: #e8f4ff;
    --intel-alert: #ff4b4b;
    --intel-success: #00ff88;
    --font-mono: 'Share Tech Mono', monospace;
    --font-ui: 'Barlow Condensed', sans-serif;
  }

  .intel-wrapper {
    background: var(--intel-bg);
    min-height: 100vh;
    font-family: var(--font-ui);
    color: var(--intel-text);
    position: relative;
    overflow: hidden;
  }

  .intel-wrapper::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(13,36,68,0.15) 2px,
        rgba(13,36,68,0.15) 4px
      );
    pointer-events: none;
    z-index: 0;
  }

  .intel-wrapper::after {
    content: '';
    position: fixed;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(ellipse at 60% 20%, rgba(26,107,255,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .intel-main {
    position: relative;
    z-index: 1;
    padding: 24px 32px;
  }

  /* ─── HEADER BAR ─── */
  .intel-masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--intel-border);
    padding-bottom: 16px;
    margin-bottom: 28px;
  }

  .intel-title-block {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .intel-title-block .classification {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--intel-blue);
    text-transform: uppercase;
    border: 1px solid var(--intel-blue-dim);
    padding: 2px 6px;
    opacity: 0.8;
  }

  .intel-title-block h1 {
    font-family: var(--font-ui);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--intel-white);
    margin: 0;
    line-height: 1;
  }

  .intel-title-block h1 span {
    color: var(--intel-blue);
  }

  .intel-status-cluster {
    display: flex;
    align-items: center;
    gap: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--intel-text-dim);
  }

  .status-dot {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .status-dot::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--intel-success);
    box-shadow: 0 0 6px var(--intel-success);
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .intel-timestamp {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--intel-text-dim);
    letter-spacing: 1px;
  }

  /* ─── CONTROL STRIP ─── */
  .intel-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .intel-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
  }

  .intel-search-wrap .search-prefix {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--intel-blue);
    pointer-events: none;
  }

  .intel-input {
    width: 100%;
    background: var(--intel-panel);
    border: 1px solid var(--intel-border);
    color: var(--intel-white);
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 8px 12px 8px 64px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 1px;
  }

  .intel-input:focus {
    border-color: var(--intel-blue);
    box-shadow: 0 0 0 1px var(--intel-blue-glow), inset 0 0 12px rgba(26,107,255,0.05);
  }

  .intel-input::placeholder {
    color: var(--intel-text-dim);
    font-size: 11px;
    letter-spacing: 2px;
  }

  .intel-btn {
    font-family: var(--font-ui);
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 8px 20px;
    border: 1px solid var(--intel-blue-dim);
    background: transparent;
    color: var(--intel-blue);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .intel-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(26,107,255,0.12), transparent);
    transition: left 0.4s;
  }

  .intel-btn:hover::before { left: 100%; }
  .intel-btn:hover {
    border-color: var(--intel-blue);
    background: rgba(26,107,255,0.08);
    box-shadow: 0 0 16px var(--intel-blue-glow);
    color: var(--intel-accent);
  }

  .intel-btn.primary {
    background: rgba(26,107,255,0.15);
    border-color: var(--intel-blue);
  }

  .intel-btn.danger {
    border-color: var(--intel-alert);
    color: var(--intel-alert);
  }
  .intel-btn.danger:hover {
    background: rgba(255,75,75,0.1);
    box-shadow: 0 0 16px rgba(255,75,75,0.3);
  }

  .intel-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-status {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--intel-text-dim);
    letter-spacing: 1px;
    align-self: center;
  }

  /* ─── DIVIDER ─── */
  .intel-divider {
    border: none;
    border-top: 1px solid var(--intel-border);
    margin: 20px 0;
    position: relative;
  }
  .intel-divider::after {
    content: '◆◆◆';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--intel-bg);
    padding: 0 10px;
    font-size: 6px;
    letter-spacing: 4px;
    color: var(--intel-border);
  }

  /* ─── BRIEF CARDS ─── */
  .intel-grid {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brief-card {
    background: var(--intel-panel);
    border: 1px solid var(--intel-border);
    border-left: 3px solid var(--intel-blue-dim);
    padding: 16px 20px;
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .brief-card:hover {
    border-left-color: var(--intel-blue);
    box-shadow: inset 0 0 30px rgba(26,107,255,0.04), 0 0 0 0.5px rgba(26,107,255,0.2);
  }

  .brief-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .asset-tag {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .asset-label {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--intel-accent);
    letter-spacing: 2px;
    font-weight: 400;
  }

  .asset-category-badge {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 2px;
    color: var(--intel-text-dim);
    border: 1px solid var(--intel-border);
    padding: 1px 5px;
    text-transform: uppercase;
  }

  .brief-meta {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--intel-text-dim);
    letter-spacing: 1px;
  }

  .brief-summary {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--intel-text);
    letter-spacing: 0.2px;
  }

  .read-toggle {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--intel-blue);
    background: none;
    border: none;
    padding: 4px 0;
    cursor: pointer;
    margin-top: 6px;
    display: block;
    transition: color 0.2s;
  }
  .read-toggle:hover { color: var(--intel-accent); }

  .no-data {
    text-align: center;
    padding: 80px 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--intel-text-dim);
  }

  .no-data .no-data-icon {
    font-size: 36px;
    color: var(--intel-border);
    margin-bottom: 16px;
  }

  /* ─── MODAL ─── */
  .intel-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .intel-modal {
    background: var(--intel-panel);
    border: 1px solid var(--intel-blue-dim);
    box-shadow: 0 0 60px rgba(26,107,255,0.2), 0 0 120px rgba(26,107,255,0.08);
    width: 90%;
    max-width: 820px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal-intel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--intel-border);
  }

  .modal-intel-header h4 {
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--intel-white);
    margin: 0;
  }

  .modal-intel-header .modal-close {
    background: none;
    border: 1px solid var(--intel-border);
    color: var(--intel-text-dim);
    width: 28px; height: 28px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { border-color: var(--intel-alert); color: var(--intel-alert); }

  .modal-intel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    scrollbar-width: thin;
    scrollbar-color: var(--intel-blue-dim) transparent;
  }

  .modal-intel-body::-webkit-scrollbar { width: 4px; }
  .modal-intel-body::-webkit-scrollbar-track { background: transparent; }
  .modal-intel-body::-webkit-scrollbar-thumb { background: var(--intel-blue-dim); }

  .modal-intel-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-top: 1px solid var(--intel-border);
  }

  .modal-actions {
    display: flex;
    gap: 8px;
  }

  .selected-count {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--intel-text-dim);
  }
  .selected-count span { color: var(--intel-accent); }

  /* ─── CATEGORY TABS ─── */
  .category-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .cat-tab {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 12px;
    background: transparent;
    border: 1px solid var(--intel-border);
    color: var(--intel-text-dim);
    cursor: pointer;
    transition: all 0.15s;
  }

  .cat-tab:hover { border-color: var(--intel-blue-dim); color: var(--intel-text); }
  .cat-tab.active {
    border-color: var(--intel-blue);
    background: rgba(26,107,255,0.1);
    color: var(--intel-blue);
  }

  /* ─── ASSET CHECKBOXES ─── */
  .asset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 4px;
  }

  .asset-checkbox-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    border: 1px solid var(--intel-border);
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--intel-text-dim);
  }

  .asset-checkbox-item:hover {
    border-color: var(--intel-blue-dim);
    color: var(--intel-text);
  }

  .asset-checkbox-item.checked {
    border-color: var(--intel-blue);
    background: rgba(26,107,255,0.1);
    color: var(--intel-accent);
  }

  .asset-check-box {
    width: 10px; height: 10px;
    border: 1px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 7px;
  }

  /* ─── SCROLLBAR (global) ─── */
  * { box-sizing: border-box; }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DailyBrief() {
  const [dailyBriefData, setDailyBriefData]     = useState([]);
  const [filter, setFilter]                       = useState("");
  const [updateStatus, setUpdateStatus]           = useState("SYNC INTEL");
  const [isSyncing, setIsSyncing]                 = useState(false);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [selectedAssets, setSelectedAssets]       = useState([]);
  const [assetUpdateStatus, setAssetUpdateStatus] = useState("DEPLOY ASSETS");
  const [showModal, setShowModal]                 = useState(false);
  const [activeCategory, setActiveCategory]       = useState("forex");
  const [time, setTime]                           = useState(new Date());
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';

  useEffect(() => {
    fetchDailyBriefData();
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const fetchDailyBriefData = () => {
    fetch(`${baseUrl}/fetch-daily-brief-data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') }
    })
    .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
    .then(data => setDailyBriefData(data))
    .catch(err => console.error('Fetch error:', err));
  };

  const handleManualUpdate = async () => {
    setIsSyncing(true);
    setUpdateStatus("ACQUIRING...");
    try {
      const r = await fetch(`${baseUrl}/daily-brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') }
      });
      if (!r.ok) throw new Error();
      setUpdateStatus("INTEL REFRESHED");
      await sleep(2000);
      fetchDailyBriefData();
    } catch {
      setUpdateStatus("UPLINK FAILED");
    } finally {
      await sleep(2000);
      setUpdateStatus("SYNC INTEL");
      setIsSyncing(false);
    }
  };

  const handleSubmitAssets = async () => {
    setShowModal(false);
    setAssetUpdateStatus("DEPLOYING...");
    try {
      const r = await fetch(`${baseUrl}/set-daily-brief-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') },
        body: JSON.stringify({ assets: selectedAssets })
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      alert(data.message);
    } catch {
      alert('Uplink failure — assets not saved.');
    } finally {
      setAssetUpdateStatus("DEPLOY ASSETS");
    }
  };

  const toggleAsset = (asset) => {
    setSelectedAssets(prev =>
      prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]
    );
  };

  const selectAllInCategory = () => {
    const cats = ASSET_REGISTRY[activeCategory].assets;
    setSelectedAssets(prev => [...new Set([...prev, ...cats])]);
  };

  const deselectAllInCategory = () => {
    const cats = new Set(ASSET_REGISTRY[activeCategory].assets);
    setSelectedAssets(prev => prev.filter(a => !cats.has(a)));
  };

  const toggleSummary = (i) =>
    setExpandedSummaries(s => ({ ...s, [i]: !s[i] }));

  const filteredData = dailyBriefData.filter(b =>
    b.asset.toLowerCase().includes(filter.toLowerCase())
  );

  const utcString = time.toUTCString().replace('GMT', 'UTC');

  return (
    <>
      <style>{styles}</style>
      <div className="intel-wrapper">
        <Header />
        <div style={{ display: 'flex' }}>
          <SideNavs />
          <div className="intel-main" style={{ flex: 1 }}>

            {/* ── MASTHEAD ── */}
            <div className="intel-masthead">
              <div className="intel-title-block">
                <span className="classification">UNCLASSIFIED</span>
                <h1>DAILY <span>BRIEF</span></h1>
              </div>
              <div className="intel-status-cluster">
                <span className="status-dot">UPLINK ACTIVE</span>
                <span className="intel-timestamp">{utcString}</span>
              </div>
            </div>

            {/* ── CONTROLS ── */}
            <div className="intel-controls">
              <div className="intel-search-wrap">
                <span className="search-prefix">FILTER://</span>
                <input
                  className="intel-input"
                  type="text"
                  placeholder="ASSET DESIGNATION..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
              </div>

              <button className="intel-btn primary" onClick={handleManualUpdate} disabled={isSyncing}>
                {updateStatus}
              </button>

              <button className="intel-btn" onClick={() => setShowModal(true)}>
                CONFIGURE ASSETS
              </button>

              {selectedAssets.length > 0 && (
                <button className="intel-btn primary" onClick={handleSubmitAssets}>
                  {assetUpdateStatus}
                </button>
              )}

              {selectedAssets.length > 0 && (
                <span className="btn-status">
                  {selectedAssets.length} ASSETS STAGED
                </span>
              )}
            </div>

            <div className="intel-divider" />

            {/* ── BRIEF FEED ── */}
            <div className="intel-grid">
              {filteredData.length > 0 ? (
                filteredData.map((brief, i) => (
                  <div className="brief-card" key={i}>
                    <div className="brief-card-header">
                      <div className="asset-tag">
                        <span className="asset-label">{brief.asset}</span>
                        <span className="asset-category-badge">INTEL</span>
                      </div>
                      <span className="brief-meta">
                        UPDATED // {new Date(brief.last_update).toLocaleString().toUpperCase()}
                      </span>
                    </div>
                    <p className="brief-summary" style={{ margin: 0 }}>
                      {expandedSummaries[i]
                        ? brief.summary
                        : brief.summary.length > 500
                          ? brief.summary.substring(0, 500) + '...'
                          : brief.summary
                      }
                    </p>
                    {brief.summary.length > 500 && (
                      <button className="read-toggle" onClick={() => toggleSummary(i)}>
                        {expandedSummaries[i] ? '▲ COLLAPSE REPORT' : '▼ EXPAND REPORT'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">◈</div>
                  <div>NO INTELLIGENCE REPORTS AVAILABLE</div>
                  <div style={{ marginTop: 8, fontSize: 9, letterSpacing: 4 }}>
                    INITIATE SYNC TO ACQUIRE DATA
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── ASSET CONFIG MODAL ── */}
        {showModal && (
          <div className="intel-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="intel-modal">
              <div className="modal-intel-header">
                <h4>◆ ASSET CONFIGURATION</h4>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <div className="modal-intel-body">
                {/* Category tabs */}
                <div className="category-tabs">
                  {Object.entries(ASSET_REGISTRY).map(([key, val]) => (
                    <button
                      key={key}
                      className={`cat-tab ${activeCategory === key ? 'active' : ''}`}
                      onClick={() => setActiveCategory(key)}
                    >
                      {val.icon} {val.label}
                      {selectedAssets.filter(a => val.assets.includes(a)).length > 0 && (
                        <span style={{ marginLeft: 5, color: 'var(--intel-accent)' }}>
                          [{selectedAssets.filter(a => val.assets.includes(a)).length}]
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Select/deselect row */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <button className="intel-btn" style={{ padding: '4px 12px', fontSize: 9 }} onClick={selectAllInCategory}>
                    SELECT ALL {ASSET_REGISTRY[activeCategory].label}
                  </button>
                  <button className="intel-btn" style={{ padding: '4px 12px', fontSize: 9 }} onClick={deselectAllInCategory}>
                    DESELECT ALL
                  </button>
                </div>

                {/* Asset checkboxes */}
                <div className="asset-grid">
                  {ASSET_REGISTRY[activeCategory].assets.map((asset, i) => (
                    <div
                      key={i}
                      className={`asset-checkbox-item ${selectedAssets.includes(asset) ? 'checked' : ''}`}
                      onClick={() => toggleAsset(asset)}
                    >
                      <div className="asset-check-box">
                        {selectedAssets.includes(asset) ? '✓' : ''}
                      </div>
                      {asset}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-intel-footer">
                <span className="selected-count">
                  <span>{selectedAssets.length}</span> ASSETS SELECTED ACROSS ALL CATEGORIES
                </span>
                <div className="modal-actions">
                  <button className="intel-btn danger" onClick={() => setShowModal(false)}>ABORT</button>
                  <button className="intel-btn primary" onClick={handleSubmitAssets}>CONFIRM & DEPLOY</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}