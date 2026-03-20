import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import Header from "./header";
import SideNavs from "./side_navs";

// ─── FULL SECTOR MAPPINGS (500 stocks) ───────────────────────────────────────
const SECTOR_MAPPINGS = {
  'AAPL':'Technology','MSFT':'Technology','GOOGL':'Technology','GOOG':'Technology','AMZN':'Consumer Cyclical','NVDA':'Technology','TSLA':'Consumer Cyclical','META':'Technology','AMD':'Technology','INTC':'Technology','ORCL':'Technology','CSCO':'Technology','ADBE':'Technology','CRM':'Technology','AVGO':'Technology','QCOM':'Technology','TXN':'Technology','AMAT':'Technology','LRCX':'Technology','KLAC':'Technology','SNPS':'Technology','CDNS':'Technology','MRVL':'Technology','NXPI':'Technology','MU':'Technology','ADI':'Technology','MPWR':'Technology','SWKS':'Technology','QRVO':'Technology','ON':'Technology',
  'JPM':'Financial','BAC':'Financial','WFC':'Financial','C':'Financial','GS':'Financial','MS':'Financial','BLK':'Financial','SCHW':'Financial','AXP':'Financial','SPGI':'Financial','CME':'Financial','ICE':'Financial','MCO':'Financial','BK':'Financial','USB':'Financial','PNC':'Financial','TFC':'Financial','COF':'Financial','V':'Financial','MA':'Financial','PYPL':'Financial','ADP':'Financial','FISV':'Financial','FIS':'Financial',
  'JNJ':'Healthcare','LLY':'Healthcare','UNH':'Healthcare','PFE':'Healthcare','ABBV':'Healthcare','MRK':'Healthcare','TMO':'Healthcare','ABT':'Healthcare','DHR':'Healthcare','BMY':'Healthcare','AMGN':'Healthcare','GILD':'Healthcare','CVS':'Healthcare','CI':'Healthcare','ELV':'Healthcare','HUM':'Healthcare','VRTX':'Healthcare','REGN':'Healthcare','ISRG':'Healthcare','BIIB':'Healthcare','MRNA':'Healthcare','BNTX':'Healthcare','SGEN':'Healthcare','ALNY':'Healthcare','BGNE':'Healthcare','MCK':'Healthcare','CAH':'Healthcare','COR':'Healthcare','IDXX':'Healthcare','A':'Healthcare','WAT':'Healthcare',
  'HD':'Consumer Cyclical','MCD':'Consumer Cyclical','NKE':'Consumer Cyclical','SBUX':'Consumer Cyclical','TJX':'Consumer Cyclical','LOW':'Consumer Cyclical','BKNG':'Consumer Cyclical','MAR':'Consumer Cyclical','CMG':'Consumer Cyclical','F':'Consumer Cyclical','GM':'Consumer Cyclical','ABNB':'Consumer Cyclical','SHOP':'Consumer Cyclical','MELI':'Consumer Cyclical','EBAY':'Consumer Cyclical','ETSY':'Consumer Cyclical','TGT':'Consumer Cyclical','ROST':'Consumer Cyclical','YUM':'Consumer Cyclical','DPZ':'Consumer Cyclical','QSR':'Consumer Cyclical','AAL':'Consumer Cyclical','DAL':'Consumer Cyclical','UAL':'Consumer Cyclical','LUV':'Consumer Cyclical','CCL':'Consumer Cyclical','RCL':'Consumer Cyclical','EA':'Consumer Cyclical','TTWO':'Consumer Cyclical','RBLX':'Consumer Cyclical','U':'Consumer Cyclical','RIVN':'Consumer Cyclical','LCID':'Consumer Cyclical',
  'WMT':'Consumer Defensive','PG':'Consumer Defensive','KO':'Consumer Defensive','PEP':'Consumer Defensive','COST':'Consumer Defensive','PM':'Consumer Defensive','MO':'Consumer Defensive','MDLZ':'Consumer Defensive','CL':'Consumer Defensive','KMB':'Consumer Defensive','GIS':'Consumer Defensive','KHC':'Consumer Defensive','STZ':'Consumer Defensive',
  'XOM':'Energy','CVX':'Energy','COP':'Energy','EOG':'Energy','SLB':'Energy','MPC':'Energy','PSX':'Energy','VLO':'Energy','OXY':'Energy','HAL':'Energy','DVN':'Energy','HES':'Energy','BKR':'Energy',
  'BA':'Industrials','HON':'Industrials','UNP':'Industrials','CAT':'Industrials','GE':'Industrials','RTX':'Industrials','LMT':'Industrials','UPS':'Industrials','DE':'Industrials','MMM':'Industrials','GD':'Industrials','NOC':'Industrials','FDX':'Industrials','CSX':'Industrials','HWM':'Industrials','TDG':'Industrials','HEI':'Industrials','LHX':'Industrials','TXT':'Industrials',
  'T':'Communication','VZ':'Communication','CMCSA':'Communication','NFLX':'Communication','DIS':'Communication','TMUS':'Communication','CHTR':'Communication',
  'AMT':'Real Estate','PLD':'Real Estate','CCI':'Real Estate','EQIX':'Real Estate','PSA':'Real Estate','SPG':'Real Estate','O':'Real Estate',
  'LIN':'Materials','APD':'Materials','SHW':'Materials','ECL':'Materials','DD':'Materials','NEM':'Materials','FCX':'Materials','DOW':'Materials','LYB':'Materials','CE':'Materials','ALB':'Materials','EMN':'Materials','SQM':'Materials',
  'NEE':'Utilities','DUK':'Utilities','SO':'Utilities','D':'Utilities','AEP':'Utilities','EXC':'Utilities','SRE':'Utilities',
  'NOW':'Technology','INTU':'Technology','WDAY':'Technology','PANW':'Technology','CRWD':'Technology','ZS':'Technology','DDOG':'Technology','NET':'Technology','SNOW':'Technology','PLTR':'Technology','TEAM':'Technology','FTNT':'Technology','OKTA':'Technology','S':'Technology','CYBR':'Technology',
  'BRK-B':'Financial','PGR':'Financial','ALL':'Financial','TRV':'Financial','AIG':'Financial','MET':'Financial','PRU':'Financial',
  'BABA':'Technology','JD':'Consumer Cyclical','PDD':'Consumer Cyclical','BIDU':'Technology','NIO':'Consumer Cyclical','XPEV':'Consumer Cyclical','LI':'Consumer Cyclical',
  'IBM':'Technology','ACN':'Technology','ADSK':'Technology','AKAM':'Technology','ANSS':'Technology','APH':'Technology','ANET':'Technology','ASML':'Technology','KEYS':'Technology','MCHP':'Technology','MSI':'Technology','MDB':'Technology','NTAP':'Technology','NTNX':'Technology','PAYC':'Technology','PTC':'Technology','ROP':'Technology','SAP':'Technology','STX':'Technology','TER':'Technology','TSM':'Technology','TYL':'Technology','VRSN':'Technology','WDC':'Technology','ZBRA':'Technology','ZM':'Technology','DOCU':'Technology','TWLO':'Technology','SQ':'Technology','UBER':'Technology','LYFT':'Technology','DASH':'Technology','PINS':'Technology','SNAP':'Technology','SPOT':'Technology','ROKU':'Technology','AFRM':'Technology','COIN':'Technology','HOOD':'Technology','SOFI':'Technology','ASTS':'Technology',
  'AFL':'Financial','AMG':'Financial','AON':'Financial','AJG':'Financial','AMP':'Financial','BEN':'Financial','CBOE':'Financial','CINF':'Financial','DFS':'Financial','ERIE':'Financial','FITB':'Financial','GL':'Financial','HBAN':'Financial','HIG':'Financial','IVZ':'Financial','JKHY':'Financial','KEY':'Financial','L':'Financial','LNC':'Financial','MTB':'Financial','NTRS':'Financial','NDAQ':'Financial','PFG':'Financial','RF':'Financial','RJF':'Financial','STT':'Financial','SYF':'Financial','TROW':'Financial','WRB':'Financial','ZION':'Financial','CFG':'Financial','CMA':'Financial','FHN':'Financial','EWBC':'Financial','WAL':'Financial','WBS':'Financial','ALLY':'Financial',
  'ALGN':'Healthcare','BAX':'Healthcare','BDX':'Healthcare','BIO':'Healthcare','BSX':'Healthcare','DXCM':'Healthcare','EW':'Healthcare','EXAS':'Healthcare','HOLX':'Healthcare','HSIC':'Healthcare','ILMN':'Healthcare','INCY':'Healthcare','IQV':'Healthcare','LH':'Healthcare','MDT':'Healthcare','MOH':'Healthcare','NBIX':'Healthcare','PKI':'Healthcare','PODD':'Healthcare','RMD':'Healthcare','STE':'Healthcare','SYK':'Healthcare','TFX':'Healthcare','UHS':'Healthcare','WST':'Healthcare','XRAY':'Healthcare','ZBH':'Healthcare','ZTS':'Healthcare','TDOC':'Healthcare','DOCS':'Healthcare','VEEV':'Healthcare','HALO':'Healthcare','NVAX':'Healthcare','IONS':'Healthcare','UTHR':'Healthcare',
  'AZO':'Consumer Cyclical','BBY':'Consumer Cyclical','BURL':'Consumer Cyclical','CPRT':'Consumer Cyclical','DHI':'Consumer Cyclical','DRI':'Consumer Cyclical','EXPE':'Consumer Cyclical','GPC':'Consumer Cyclical','GRMN':'Consumer Cyclical','HAS':'Consumer Cyclical','HLT':'Consumer Cyclical','KMX':'Consumer Cyclical','LEN':'Consumer Cyclical','LVS':'Consumer Cyclical','MGM':'Consumer Cyclical','MHK':'Consumer Cyclical','NVR':'Consumer Cyclical','ORLY':'Consumer Cyclical','PHM':'Consumer Cyclical','POOL':'Consumer Cyclical','RL':'Consumer Cyclical','TSCO':'Consumer Cyclical','TPR':'Consumer Cyclical','ULTA':'Consumer Cyclical','VFC':'Consumer Cyclical','WHR':'Consumer Cyclical','WYNN':'Consumer Cyclical','APTV':'Consumer Cyclical','BWA':'Consumer Cyclical','DG':'Consumer Cyclical','DLTR':'Consumer Cyclical','DDS':'Consumer Cyclical','FIVE':'Consumer Cyclical','FL':'Consumer Cyclical','GPS':'Consumer Cyclical','GT':'Consumer Cyclical','HBI':'Consumer Cyclical','LAD':'Consumer Cyclical','LKQ':'Consumer Cyclical','M':'Consumer Cyclical','NCLH':'Consumer Cyclical','NWL':'Consumer Cyclical','PVH':'Consumer Cyclical',
  'ADM':'Consumer Defensive','CAG':'Consumer Defensive','CHD':'Consumer Defensive','CLX':'Consumer Defensive','CPB':'Consumer Defensive','EL':'Consumer Defensive','HSY':'Consumer Defensive','K':'Consumer Defensive','KDP':'Consumer Defensive','KR':'Consumer Defensive','KVUE':'Consumer Defensive','MKC':'Consumer Defensive','MNST':'Consumer Defensive','SJM':'Consumer Defensive','SYY':'Consumer Defensive','TAP':'Consumer Defensive','TSN':'Consumer Defensive','WBA':'Consumer Defensive','BG':'Consumer Defensive','HRL':'Consumer Defensive','POST':'Consumer Defensive',
  'APA':'Energy','CTRA':'Energy','FANG':'Energy','KMI':'Energy','LNG':'Energy','MRO':'Energy','NOV':'Energy','OKE':'Energy','TRGP':'Energy','WMB':'Energy','EQT':'Energy','AR':'Energy','FTI':'Energy','HP':'Energy','MTDR':'Energy','OVV':'Energy','PBF':'Energy','RIG':'Energy','SM':'Energy','XEC':'Energy',
  'AOS':'Industrials','CARR':'Industrials','CHRW':'Industrials','CMI':'Industrials','DOV':'Industrials','EMR':'Industrials','ETN':'Industrials','EXPD':'Industrials','FAST':'Industrials','FTV':'Industrials','GNRC':'Industrials','GWW':'Industrials','IEX':'Industrials','IR':'Industrials','ITW':'Industrials','J':'Industrials','JBHT':'Industrials','JCI':'Industrials','LDOS':'Industrials','MAS':'Industrials','NSC':'Industrials','ODFL':'Industrials','OTIS':'Industrials','PCAR':'Industrials','PH':'Industrials','PWR':'Industrials','ROK':'Industrials','ROL':'Industrials','RSG':'Industrials','SNA':'Industrials','SWK':'Industrials','TT':'Industrials','URI':'Industrials','VRSK':'Industrials','WAB':'Industrials','WM':'Industrials','XYL':'Industrials','ALK':'Industrials','JBLU':'Industrials','SAVE':'Industrials',
  'LYV':'Communication','MTCH':'Communication','NWSA':'Communication','NWS':'Communication','OMC':'Communication','PARA':'Communication','WBD':'Communication','IPG':'Communication','DISH':'Communication',
  'AVB':'Real Estate','ARE':'Real Estate','BXP':'Real Estate','CBRE':'Real Estate','DLR':'Real Estate','EQR':'Real Estate','ESS':'Real Estate','EXR':'Real Estate','FRT':'Real Estate','HST':'Real Estate','IRM':'Real Estate','KIM':'Real Estate','MAA':'Real Estate','REG':'Real Estate','SBAC':'Real Estate','SLG':'Real Estate','UDR':'Real Estate','VTR':'Real Estate','WELL':'Real Estate','WY':'Real Estate','INVH':'Real Estate','PEAK':'Real Estate','VNO':'Real Estate',
  'AMCR':'Materials','BALL':'Materials','CF':'Materials','CLF':'Materials','CTVA':'Materials','FMC':'Materials','IP':'Materials','MLM':'Materials','MOS':'Materials','NUE':'Materials','PKG':'Materials','PPG':'Materials','SEE':'Materials','STLD':'Materials','VMC':'Materials','AVY':'Materials','AA':'Materials','MP':'Materials','RS':'Materials',
  'AEE':'Utilities','AES':'Utilities','AWK':'Utilities','CMS':'Utilities','CNP':'Utilities','DTE':'Utilities','ED':'Utilities','EIX':'Utilities','ES':'Utilities','ETR':'Utilities','EVRG':'Utilities','FE':'Utilities','LNT':'Utilities','NI':'Utilities','NRG':'Utilities','PCG':'Utilities','PEG':'Utilities','PNW':'Utilities','PPL':'Utilities','VST':'Utilities','WEC':'Utilities','XEL':'Utilities','CEG':'Utilities',
};

const SECTOR_COLORS = {
  'Technology': '#6366f1','Financial': '#0ea5e9','Healthcare': '#10b981','Consumer Cyclical': '#f59e0b','Consumer Defensive': '#84cc16','Energy': '#ef4444','Industrials': '#8b5cf6','Communication': '#ec4899','Real Estate': '#14b8a6','Materials': '#f97316','Utilities': '#06b6d4',
};

// ─── CHART MODAL HELPERS ─────────────────────────────────────────────────────

const resolveYFinanceTicker = (name, cls) => {
  const ESI_CURRENCY_MAP = {
    'USD ESI':'DX-Y.NYB','EUR ESI':'EURUSD=X','GBP ESI':'GBPUSD=X',
    'JPY ESI':'JPY=X','AUD ESI':'AUD=X','CAD ESI':'CAD=X','CHF ESI':'CHF=X','CNY ESI':'CNY=X',
  };
  if (ESI_CURRENCY_MAP[name]) return ESI_CURRENCY_MAP[name];
  if (cls === 'Forex' || name.includes('/')) return name.replace('/', '') + '=X';
  const INDEX_MAP = {
    'S&P 500':'^GSPC','Dow Jones':'^DJI','NASDAQ':'^IXIC','Russell 2000':'^RUT',
    'FTSE 100':'^FTSE','DAX':'^GDAXI','CAC 40':'^FCHI','Nikkei 225':'^N225',
    'Hang Seng':'^HSI','ASX 200':'^AXJO',
  };
  if (INDEX_MAP[name]) return INDEX_MAP[name];
  const COMMODITY_MAP = {
    'Gold':'GC=F','Silver':'SI=F','Crude Oil (WTI)':'CL=F','Crude Oil WTI':'CL=F',
    'Brent Crude':'BZ=F','Natural Gas':'NG=F','Copper':'HG=F','Platinum':'PL=F',
    'Palladium':'PA=F','Corn':'ZC=F','Wheat':'ZW=F',
  };
  if (COMMODITY_MAP[name]) return COMMODITY_MAP[name];
  return name;
};

const CHART_TIMEFRAMES = [
  { label:'1m',  interval:'1m',   range:'1d'  },
  { label:'2m',  interval:'2m',   range:'5d'  },
  { label:'5m',  interval:'5m',   range:'5d'  },
  { label:'15m', interval:'15m',  range:'5d'  },
  { label:'30m', interval:'30m',  range:'1mo' },
  { label:'1H',  interval:'60m',  range:'1mo' },
  { label:'90m', interval:'90m',  range:'1mo' },
  { label:'1D',  interval:'1d',   range:'1y'  },
  { label:'5D',  interval:'5d',   range:'2y'  },
  { label:'1W',  interval:'1wk',  range:'2y'  },
  { label:'1M',  interval:'1mo',  range:'max' },
  { label:'3M',  interval:'3mo',  range:'max' },
];

const CHART_THEMES = {
  light: { bg:'#ffffff', panelBg:'#f8fafc', border:'#e2e8f0', text:'#0f172a', sub:'#64748b', grid:'#f1f5f9', cross:'#94a3b8' },
  dark:  { bg:'#0f172a', panelBg:'#1e293b', border:'#334155', text:'#f1f5f9', sub:'#94a3b8', grid:'#1e293b',  cross:'#475569' },
  hud:   { bg:'#000814', panelBg:'#0a1628', border:'#00d4ff33', text:'#00d4ff', sub:'#0099bb', grid:'#00d4ff0d', cross:'#00d4ff' },
};

const LINE_COLORS = {
  a: { light:'#2563eb', dark:'#60a5fa', hud:'#00d4ff' },
  b: { light:'#dc2626', dark:'#f87171', hud:'#ff6b35' },
};

// ─── STOCK INFO PANEL ────────────────────────────────────────────────────────

// Which classes count as US stocks (not macro assets)
const isStockClass = (cls) => cls && !['ESI','Forex','Index','Commodity','Volume'].includes(cls);

const ESI_FMT_NUM = (n, decimals = 2) => {
  if (n == null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
  if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
  if (Math.abs(n) >= 1e3)  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  return n.toFixed(decimals);
};

const ESI_FMT_PCT = (n) => n == null ? '—' : (n * 100).toFixed(2) + '%';

function StockInfoPanel({ ticker, sectorColor, baseUrl, insightId }) {
  const [open, setOpen]       = useState(false);
  const [data, setData]       = useState(null);   // cached once fetched
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const fetch_info = async () => {
    if (data) { setOpen(o => !o); return; }  // already cached — just toggle
    setOpen(true);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseUrl}/api/esi_stock_fundamentals_v1/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: [ticker] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.data?.[ticker] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sc = sectorColor || '#6366f1';

  const Stat = ({ label, value, highlight }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      <span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8', fontWeight:700 }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, color: highlight ? sc : '#1e293b', fontFamily:"'IBM Plex Mono', monospace" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ borderTop:'1px dashed #e2e8f0', marginTop:2 }}>
      {/* Trigger button */}
      <button
        onClick={e => { e.stopPropagation(); fetch_info(); }}
        className="sip-trigger-btn"
        style={{ '--sc': sc }}
      >
        <span style={{ fontSize:11 }}>🏦</span>
        <span style={{ fontWeight:700, fontSize:11 }}>{ticker}</span>
        <span style={{ fontSize:10, opacity:0.7 }}>Stock Info</span>
        {data && <span style={{ fontSize:9, background:sc+'22', color:sc, padding:'1px 5px', borderRadius:4, fontWeight:700, border:`1px solid ${sc}44` }}>cached</span>}
        <span style={{ marginLeft:'auto', fontSize:10, color:'#94a3b8', transition:'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {/* Collapsible content */}
      {open && (
        <div style={{ padding:'10px 13px 12px', background:'#fafcff', borderTop:'1px solid #e0eaff' }} onClick={e => e.stopPropagation()}>
          {loading && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', color:'#64748b', fontSize:12 }}>
              <div style={{ width:14, height:14, border:'2px solid #dbeafe', borderTopColor:sc, borderRadius:'50%', animation:'esi-spin 0.7s linear infinite', flexShrink:0 }} />
              Fetching {ticker} fundamentals…
            </div>
          )}
          {error && (
            <div style={{ padding:'6px 10px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, color:'#991b1b', fontSize:11 }}>
              ⚠️ {error}
              <button onClick={e => { e.stopPropagation(); setData(null); fetch_info(); }} style={{ marginLeft:8, background:'none', border:'none', color:'#2563eb', cursor:'pointer', fontSize:11, textDecoration:'underline' }}>retry</button>
            </div>
          )}
          {data && !loading && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {/* Company header */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                {data.logo_url && (
                  <img src={data.logo_url} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'contain', background:'white', border:'1px solid #e2e8f0', flexShrink:0 }} onError={e => e.target.style.display='none'} />
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:13, color:'#0f172a', lineHeight:1.2 }}>{data.name || ticker}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{data.sector} · {data.industry}</div>
                  <div style={{ fontSize:11, color:'#94a3b8' }}>{data.exchange} · {data.country}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:'monospace', fontWeight:800, fontSize:15, color: data.change_pct >= 0 ? '#16a34a' : '#dc2626' }}>
                    ${ESI_FMT_NUM(data.price, 2)}
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color: data.change_pct >= 0 ? '#16a34a' : '#dc2626', background: data.change_pct >= 0 ? '#dcfce7' : '#fee2e2', padding:'1px 6px', borderRadius:4, marginTop:2 }}>
                    {data.change_pct >= 0 ? '▲' : '▼'} {Math.abs(data.change_pct || 0).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Business description */}
              {data.summary && (
                <p style={{ fontSize:11, color:'#475569', lineHeight:1.5, margin:0, background:'white', padding:'8px 10px', borderRadius:6, border:'1px solid #e2e8f0', fontStyle:'italic' }}>
                  {data.summary.length > 280 ? data.summary.slice(0, 280) + '…' : data.summary}
                </p>
              )}

              {/* Key metrics grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))', gap:'8px 12px', background:'white', padding:'10px 12px', borderRadius:8, border:`1px solid ${sc}22` }}>
                <Stat label="Market Cap"   value={ESI_FMT_NUM(data.market_cap)} highlight />
                <Stat label="P/E Ratio"    value={data.pe_ratio ? data.pe_ratio.toFixed(1) : '—'} />
                <Stat label="P/B Ratio"    value={data.pb_ratio ? data.pb_ratio.toFixed(2) : '—'} />
                <Stat label="EPS (TTM)"    value={data.eps ? '$' + data.eps.toFixed(2) : '—'} />
                <Stat label="Rev (TTM)"    value={ESI_FMT_NUM(data.revenue)} highlight />
                <Stat label="Gross Margin" value={ESI_FMT_PCT(data.gross_margin)} />
                <Stat label="Profit Margin" value={ESI_FMT_PCT(data.profit_margin)} />
                <Stat label="ROE"          value={ESI_FMT_PCT(data.roe)} />
                <Stat label="Debt/Equity"  value={data.debt_equity ? data.debt_equity.toFixed(2) : '—'} />
                <Stat label="Div Yield"    value={data.dividend_yield ? ESI_FMT_PCT(data.dividend_yield) : 'None'} />
                <Stat label="52W High"     value={data.week52_high ? '$' + data.week52_high.toFixed(2) : '—'} />
                <Stat label="52W Low"      value={data.week52_low ? '$' + data.week52_low.toFixed(2) : '—'} />
                <Stat label="Avg Volume"   value={ESI_FMT_NUM(data.avg_volume, 0)} />
                <Stat label="Beta"         value={data.beta ? data.beta.toFixed(2) : '—'} />
                <Stat label="Employees"    value={ESI_FMT_NUM(data.employees, 0)} />
              </div>

              {/* Analyst targets */}
              {(data.target_high || data.target_low || data.target_mean) && (
                <div style={{ background:`linear-gradient(135deg, ${sc}0d, ${sc}05)`, border:`1px solid ${sc}33`, borderRadius:8, padding:'8px 12px' }}>
                  <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:sc, marginBottom:6 }}>Analyst Price Targets</div>
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                    {data.target_low  && <Stat label="Low"  value={'$' + data.target_low.toFixed(2)} />}
                    {data.target_mean && <Stat label="Mean" value={'$' + data.target_mean.toFixed(2)} highlight />}
                    {data.target_high && <Stat label="High" value={'$' + data.target_high.toFixed(2)} />}
                    {data.recommendation && <Stat label="Consensus" value={data.recommendation.toUpperCase()} highlight />}
                  </div>
                </div>
              )}

              <div style={{ fontSize:9, color:'#cbd5e1', textAlign:'right' }}>via yfinance · {new Date().toLocaleTimeString()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SINGLE CHART PANEL ──────────────────────────────────────────────────────

function ChartPanel({ ticker, label, side, theme, timeframe, isFullscreen, onFullscreen, baseUrl }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);
  const roRef        = useRef(null);
  const [status, setStatus]     = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [priceInfo, setPriceInfo] = useState(null);

  const t   = CHART_THEMES[theme];
  const col = LINE_COLORS[side][theme];

  const loadLWC = () => new Promise((resolve, reject) => {
    if (window.LightweightCharts) { resolve(window.LightweightCharts); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
    s.onload = () => resolve(window.LightweightCharts);
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const fetchData = async (sym, tf) => {
    const { interval, range } = CHART_TIMEFRAMES.find(x => x.label === tf) || CHART_TIMEFRAMES[4];

    // Try backend first
    try {
      const res = await fetch(`${baseUrl}/api/esi_ohlcv_feed_v1/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: sym, interval, range }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.length > 0) return json.data;
      }
    } catch (_) {}

    // Fallback: Yahoo Finance via CORS proxy
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=${interval}&range=${range}&includePrePost=false`;
    const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    const result = d?.chart?.result?.[0];
    if (!result) throw new Error('No data returned');
    const ts = result.timestamp || [];
    const q  = result.indicators?.quote?.[0] || {};
    return ts.map((t, i) => ({ time: t, close: q.close?.[i] })).filter(x => x.close != null);
  };

  const buildChart = useCallback(async () => {
    if (!containerRef.current || !ticker) return;
    setStatus('loading'); setErrorMsg('');

    try {
      const LWC = await loadLWC();

      // Tear down old chart
      if (chartRef.current) { try { chartRef.current.remove(); } catch (_) {} chartRef.current = null; }
      if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }

      const rawData = await fetchData(ticker, timeframe);

      const chart = LWC.createChart(containerRef.current, {
        width:  containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        layout: { background: { type: 'solid', color: t.bg }, textColor: t.text, fontFamily: "'IBM Plex Mono', 'Courier New', monospace" },
        grid:   { vertLines: { color: t.grid }, horzLines: { color: t.grid } },
        crosshair: { mode: 1, vertLine: { color: t.cross, style: 2 }, horzLine: { color: t.cross, style: 2 } },
        rightPriceScale: { borderColor: t.border, textColor: t.sub },
        timeScale: { borderColor: t.border, textColor: t.sub, timeVisible: true, secondsVisible: false },
        handleScroll: true, handleScale: true,
      });

      const series = chart.addAreaSeries({
        lineColor: col, topColor: col + '33', bottomColor: col + '05',
        lineWidth: 2,
        priceLineVisible: true, priceLineColor: col,
        crosshairMarkerVisible: true, crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: col, crosshairMarkerBackgroundColor: t.bg,
      });

      // Format + deduplicate data
      const seen = new Set();
      const formatted = rawData
        .map(d => ({ time: typeof d.time === 'number' ? d.time : Math.floor(new Date(d.time).getTime() / 1000), value: d.close ?? d.value ?? d.price }))
        .filter(d => d.value != null && isFinite(d.value))
        .sort((a, b) => a.time - b.time)
        .filter(d => { if (seen.has(d.time)) return false; seen.add(d.time); return true; });

      series.setData(formatted);
      chart.timeScale().fitContent();

      // Crosshair subscription
      chart.subscribeCrosshairMove(param => {
        if (param.seriesData?.has(series)) {
          const val = param.seriesData.get(series);
          if (val?.value != null) setPriceInfo(p => ({ ...p, hover: val.value }));
        }
      });

      // Last price + change
      if (formatted.length > 1) {
        const last  = formatted[formatted.length - 1].value;
        const first = formatted[0].value;
        setPriceInfo({ price: last, change: ((last - first) / first) * 100, hover: null });
      }

      chartRef.current  = chart;
      seriesRef.current = series;

      // ResizeObserver
      const ro = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
        }
      });
      ro.observe(containerRef.current);
      roRef.current = ro;

      setStatus('ok');
    } catch (err) {
      setStatus('error'); setErrorMsg(err.message || 'Failed to load chart');
    }
  }, [ticker, timeframe, theme]);

  useEffect(() => {
    buildChart();
    return () => {
      if (chartRef.current) { try { chartRef.current.remove(); } catch (_) {} }
      if (roRef.current) roRef.current.disconnect();
    };
  }, [buildChart]);

  // Live theme update without full rebuild
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      layout: { background: { color: t.bg }, textColor: t.text },
      grid: { vertLines: { color: t.grid }, horzLines: { color: t.grid } },
      crosshair: { vertLine: { color: t.cross }, horzLine: { color: t.cross } },
      rightPriceScale: { borderColor: t.border, textColor: t.sub },
      timeScale: { borderColor: t.border, textColor: t.sub },
    });
  }, [theme]);

  const fmtPrice = v => {
    if (v == null) return '—';
    if (v >= 10000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (v >= 1000)  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (v < 0.01)   return v.toFixed(6);
    if (v < 1)      return v.toFixed(5);
    if (v < 10)     return v.toFixed(4);
    return v.toFixed(2);
  };

  const displayPrice = priceInfo?.hover ?? priceInfo?.price;

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, minHeight:0, background:t.bg, borderRadius:10, overflow:'hidden', border:`1.5px solid ${t.border}`, position:'relative' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${t.border}`, background:t.panelBg, flexShrink:0, minWidth:0 }}>
        <div style={{ width:9, height:9, borderRadius:'50%', background:col, flexShrink:0 }} />
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, fontSize:12, color:t.text, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {label}
        </span>
        {displayPrice != null && (
          <span style={{ fontFamily:'monospace', fontSize:12, color:col, fontWeight:800, flexShrink:0 }}>{fmtPrice(displayPrice)}</span>
        )}
        {priceInfo?.change != null && (
          <span style={{ fontSize:11, fontWeight:700, color:priceInfo.change>=0?'#16a34a':'#dc2626', background:priceInfo.change>=0?'#dcfce7':'#fee2e2', padding:'2px 6px', borderRadius:5, flexShrink:0 }}>
            {priceInfo.change>=0?'+':''}{priceInfo.change.toFixed(2)}%
          </span>
        )}
        <button onClick={onFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} style={{ background:'none', border:'none', cursor:'pointer', color:t.sub, fontSize:14, padding:'2px 4px', borderRadius:5, flexShrink:0, lineHeight:1 }}>
          {isFullscreen ? '⊡' : '⤢'}
        </button>
      </div>
      {/* Chart */}
      <div style={{ flex:1, position:'relative', minHeight:0 }}>
        {status === 'loading' && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:t.bg, zIndex:5, gap:10 }}>
            <div style={{ width:28, height:28, border:`3px solid ${t.border}`, borderTopColor:col, borderRadius:'50%', animation:'esi-spin 0.7s linear infinite' }} />
            <span style={{ color:t.sub, fontSize:11, fontFamily:'monospace' }}>Loading {ticker}…</span>
          </div>
        )}
        {status === 'error' && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:t.bg, zIndex:5, padding:20, gap:8 }}>
            <span style={{ fontSize:22 }}>⚠️</span>
            <span style={{ color:t.sub, fontSize:11, textAlign:'center', fontFamily:'monospace' }}>{errorMsg}</span>
            <button onClick={buildChart} style={{ padding:'5px 14px', background:col, color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>Retry</button>
          </div>
        )}
        <div ref={containerRef} style={{ width:'100%', height:'100%' }} />
      </div>
    </div>
  );
}

// ─── CORRELATION CHART MODAL ─────────────────────────────────────────────────

function CorrelationChartModal({ insight, onClose, baseUrl }) {
  const [theme, setTheme]               = useState('dark');
  const [timeframe, setTimeframe]       = useState('1D');
  const [fullscreen, setFullscreen]     = useState(null); // null | 'a' | 'b'
  const isMobile                        = window.innerWidth < 700;
  const [layout, setLayout]             = useState(isMobile ? 'col' : 'row');

  useEffect(() => {
    if (insight) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [insight]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (fullscreen) setFullscreen(null); else onClose?.(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [fullscreen, onClose]);

  if (!insight) return null;

  const t      = CHART_THEMES[theme];
  const tickerA = resolveYFinanceTicker(insight.nameA, insight.classA);
  const tickerB = resolveYFinanceTicker(insight.nameB, insight.classB);
  const score   = insight.scoreNum ?? parseFloat(insight.score ?? 0);
  const scoreColor = score > 0.5 ? '#16a34a' : score < -0.5 ? '#dc2626' : '#94a3b8';

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? 0 : 16 }}
    >
      <div style={{
        display:'flex', flexDirection:'column',
        width:'100%', maxWidth:1440,
        height: isMobile ? '100dvh' : '92vh', maxHeight: isMobile ? '100dvh' : 940,
        borderRadius: isMobile ? 0 : 16,
        overflow:'hidden',
        background:t.bg, border:`1.5px solid ${t.border}`,
        boxShadow:'0 40px 120px rgba(0,0,0,0.7)',
        animation:'esi-modal-in 0.18s ease',
      }}>

        {/* ── TOOLBAR ── */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'10px 14px', borderBottom:`1.5px solid ${t.border}`, background:t.panelBg, flexShrink:0 }}>
          {/* Asset names + score */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0, flexWrap:'wrap' }}>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:800, fontSize:13, color:LINE_COLORS.a[theme], whiteSpace:'nowrap' }}>{insight.nameA}</span>
            <span style={{ color:t.sub, fontSize:11 }}>↔</span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:800, fontSize:13, color:LINE_COLORS.b[theme], whiteSpace:'nowrap' }}>{insight.nameB}</span>
            <span style={{ padding:'2px 9px', borderRadius:7, background:scoreColor+'22', border:`1px solid ${scoreColor}44`, color:scoreColor, fontFamily:'monospace', fontSize:11, fontWeight:800, whiteSpace:'nowrap' }}>
              ρ {score>=0?'+':''}{typeof score==='number'?score.toFixed(3):score}
            </span>
            <span style={{ fontSize:10, color:t.sub, fontStyle:'italic', whiteSpace:'nowrap' }}>{insight.term}</span>
          </div>

          {/* Timeframe pills */}
          <div style={{ display:'flex', gap:2, background:t.bg, borderRadius:8, padding:3, border:`1px solid ${t.border}`, overflowX:'auto', maxWidth: isMobile ? '100%' : 420, flexShrink:1 }}>
            {CHART_TIMEFRAMES.map(tf => (
              <button key={tf.label} onClick={() => setTimeframe(tf.label)} style={{
                padding:'4px 9px', borderRadius:6, border:'none', cursor:'pointer',
                fontFamily:"'IBM Plex Mono',monospace", fontSize:11, fontWeight:700,
                background: timeframe===tf.label ? LINE_COLORS.a[theme] : 'transparent',
                color: timeframe===tf.label ? '#fff' : t.sub,
                transition:'all 0.12s', whiteSpace:'nowrap', flexShrink:0,
              }}>{tf.label}</button>
            ))}
          </div>

          {/* Theme pills */}
          <div style={{ display:'flex', gap:2, background:t.bg, borderRadius:8, padding:3, border:`1px solid ${t.border}` }}>
            {[['light','☀️'],['dark','🌙'],['hud','⬡']].map(([th, ic]) => (
              <button key={th} onClick={() => setTheme(th)} style={{
                padding:'4px 9px', borderRadius:6, border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                background: theme===th ? t.border : 'transparent', color:t.text, transition:'all 0.12s',
              }}>{ic} {th[0].toUpperCase()+th.slice(1)}</button>
            ))}
          </div>

          {/* Layout toggle (desktop) */}
          {!isMobile && (
            <button onClick={() => setLayout(l => l==='row'?'col':'row')} title="Toggle layout" style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${t.border}`, background:t.panelBg, color:t.sub, cursor:'pointer', fontSize:13 }}>
              {layout==='row' ? '⬒' : '⬓'}
            </button>
          )}

          {/* Close */}
          <button onClick={onClose} style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${t.border}`, background:t.panelBg, color:t.sub, cursor:'pointer', fontSize:16, fontWeight:700, lineHeight:1 }}>✕</button>
        </div>

        {/* Correlation strength bar */}
        <div style={{ padding:'5px 14px', background:t.panelBg, borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <span style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:t.sub, whiteSpace:'nowrap' }}>Correlation strength</span>
          <div style={{ flex:1, height:5, background:t.grid, borderRadius:3, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', left:'50%', top:0, width:1.5, height:'100%', background:t.border }} />
            <div style={{ position:'absolute', height:'100%', borderRadius:3, background:`linear-gradient(90deg,${scoreColor}88,${scoreColor})`, width:`${Math.abs(score)*50}%`, left: score>=0 ? '50%' : `${50-Math.abs(score)*50}%` }} />
          </div>
          <span style={{ fontSize:9, color:t.sub, whiteSpace:'nowrap', fontFamily:'monospace' }}>
            <span style={{ color:LINE_COLORS.a[theme] }}>■</span> {tickerA} &nbsp; <span style={{ color:LINE_COLORS.b[theme] }}>■</span> {tickerB}
          </span>
        </div>

        {/* ── CHARTS ── */}
        <div style={{
          flex:1, minHeight:0, display:'flex',
          flexDirection: fullscreen ? 'column' : layout === 'col' ? 'column' : 'row',
          gap:8, padding:10, background:t.bg,
        }}>
          {(!fullscreen || fullscreen==='a') && (
            <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
              <ChartPanel
                key={`${tickerA}-${timeframe}-${theme}`}
                ticker={tickerA} label={`${insight.nameA}  ·  ${tickerA}`}
                side="a" theme={theme} timeframe={timeframe}
                isFullscreen={fullscreen==='a'}
                onFullscreen={() => setFullscreen(f => f==='a' ? null : 'a')}
                baseUrl={baseUrl}
              />
            </div>
          )}
          {(!fullscreen || fullscreen==='b') && (
            <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
              <ChartPanel
                key={`${tickerB}-${timeframe}-${theme}`}
                ticker={tickerB} label={`${insight.nameB}  ·  ${tickerB}`}
                side="b" theme={theme} timeframe={timeframe}
                isFullscreen={fullscreen==='b'}
                onFullscreen={() => setFullscreen(f => f==='b' ? null : 'b')}
                baseUrl={baseUrl}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'6px 14px', borderTop:`1px solid ${t.border}`, background:t.panelBg, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, flexWrap:'wrap', gap:4 }}>
          <div style={{ display:'flex', gap:12 }}>
            <span style={{ fontSize:10, color:t.sub }}><span style={{ color:LINE_COLORS.a[theme], fontWeight:700 }}>■</span> {insight.classA}</span>
            <span style={{ fontSize:10, color:t.sub }}><span style={{ color:LINE_COLORS.b[theme], fontWeight:700 }}>■</span> {insight.classB}</span>
          </div>
          <span style={{ fontSize:9, color:t.sub, fontStyle:'italic' }}>
            Yahoo Finance · {timeframe} · Scroll=zoom · Drag=pan · <kbd style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:3, padding:'1px 4px', fontSize:9, color:t.text }}>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function EconomicStrengthIndex() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';

  // ── Core State ──
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);
  const [selectedForexPairs, setSelectedForexPairs] = useState([]);
  const [selectedStockIndices, setSelectedStockIndices] = useState([]);
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [selectedVolumeAssets, setSelectedVolumeAssets] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30d');

  // ── Modal State ──
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('currencies');
  const [modalSearch, setModalSearch] = useState('');

  // ── AI/ML State ──
  const [aiInsights, setAiInsights] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [corrSearch, setCorrSearch] = useState('');
  const [corrFilter, setCorrFilter] = useState('all');
  const [collapsedInsights, setCollapsedInsights] = useState({});
  const [corrClassFilter, setCorrClassFilter] = useState('all');
  const [corrSort, setCorrSort]             = useState('abs_desc');   // abs_desc | abs_asc | pos_first | neg_first
  const [corrMinScore, setCorrMinScore]     = useState(0);            // 0–0.9 threshold

  // ── Chart Modal State ──
  const [chartInsight, setChartInsight] = useState(null);

  // ── Stock Info State (cache per ticker, persists for session) ──
  // Passed down as prop so StockInfoPanel can read/write the shared cache
  // (avoids re-fetching when a card is collapsed then re-expanded)

  // ── Asset Definitions ──
  const currencies = [
    { code: 'USD', name: 'US Dollar', color: '#2563eb' },
    { code: 'EUR', name: 'Euro', color: '#dc2626' },
    { code: 'GBP', name: 'British Pound', color: '#16a34a' },
    { code: 'JPY', name: 'Japanese Yen', color: '#ea580c' },
    { code: 'AUD', name: 'Australian Dollar', color: '#7c3aed' },
    { code: 'CAD', name: 'Canadian Dollar', color: '#0891b2' },
    { code: 'CHF', name: 'Swiss Franc', color: '#be123c' },
    { code: 'CNY', name: 'Chinese Yuan', color: '#059669' },
  ];

  const forexPairs = [
    { pair: 'EURUSD', name: 'EUR/USD', color: '#f59e0b' },
    { pair: 'GBPUSD', name: 'GBP/USD', color: '#ef4444' },
    { pair: 'USDJPY', name: 'USD/JPY', color: '#8b5cf6' },
    { pair: 'AUDUSD', name: 'AUD/USD', color: '#06b6d4' },
    { pair: 'USDCAD', name: 'USD/CAD', color: '#84cc16' },
    { pair: 'USDCHF', name: 'USD/CHF', color: '#f97316' },
    { pair: 'EURGBP', name: 'EUR/GBP', color: '#ec4899' },
    { pair: 'EURJPY', name: 'EUR/JPY', color: '#14b8a6' },
  ];

  const stockIndices = [
    { symbol: '^GSPC', name: 'S&P 500', displayName: 'S&P 500', color: '#dc2626' },
    { symbol: '^DJI', name: 'Dow Jones', displayName: 'Dow Jones', color: '#2563eb' },
    { symbol: '^IXIC', name: 'NASDAQ', displayName: 'NASDAQ', color: '#16a34a' },
    { symbol: '^RUT', name: 'Russell 2000', displayName: 'Russell 2000', color: '#ea580c' },
    { symbol: '^FTSE', name: 'FTSE 100', displayName: 'FTSE 100', color: '#7c3aed' },
    { symbol: '^GDAXI', name: 'DAX', displayName: 'DAX', color: '#0891b2' },
    { symbol: '^FCHI', name: 'CAC 40', displayName: 'CAC 40', color: '#be123c' },
    { symbol: '^N225', name: 'Nikkei 225', displayName: 'Nikkei 225', color: '#059669' },
    { symbol: '^HSI', name: 'Hang Seng', displayName: 'Hang Seng', color: '#f59e0b' },
    { symbol: '^AXJO', name: 'ASX 200', displayName: 'ASX 200', color: '#8b5cf6' },
  ];

  const commodities = [
    { symbol: 'GC=F', name: 'Gold', displayName: 'Gold', color: '#fbbf24' },
    { symbol: 'SI=F', name: 'Silver', displayName: 'Silver', color: '#9ca3af' },
    { symbol: 'CL=F', name: 'Crude Oil WTI', displayName: 'Crude Oil (WTI)', color: '#1f2937' },
    { symbol: 'BZ=F', name: 'Brent Crude', displayName: 'Brent Crude', color: '#374151' },
    { symbol: 'NG=F', name: 'Natural Gas', displayName: 'Natural Gas', color: '#3b82f6' },
    { symbol: 'HG=F', name: 'Copper', displayName: 'Copper', color: '#b45309' },
    { symbol: 'PL=F', name: 'Platinum', displayName: 'Platinum', color: '#6b7280' },
    { symbol: 'PA=F', name: 'Palladium', displayName: 'Palladium', color: '#4b5563' },
    { symbol: 'ZC=F', name: 'Corn', displayName: 'Corn', color: '#eab308' },
    { symbol: 'ZW=F', name: 'Wheat', displayName: 'Wheat', color: '#d97706' },
  ];

  const volumeAssets = useMemo(() => [
    ...forexPairs.map(fp => ({ ...fp, type: 'forex', id: fp.pair })),
    ...stockIndices.map(si => ({ ...si, type: 'stock', id: si.symbol, name: si.displayName })),
    ...commodities.map(cm => ({ ...cm, type: 'commodity', id: cm.symbol, name: cm.displayName })),
  ], []);

  const allStocks = useMemo(() =>
    Object.entries(SECTOR_MAPPINGS).map(([symbol, sector]) => ({
      symbol, sector, color: SECTOR_COLORS[sector] || '#6b7280',
    })).sort((a, b) => a.symbol.localeCompare(b.symbol))
  , []);

  const uniqueSectors = useMemo(() => [...new Set(Object.values(SECTOR_MAPPINGS))].sort(), []);

  // ── Data Fetching ──
  const fetchEconomicStrengthData = async () => {
    setLoading(true);
    setAiInsights([]);
    setAnalysisProgress(0);
    setAnalysisError('');
    try {
      const response = await fetch(`${baseUrl}/api/economic-strength-index/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currencies: selectedCurrencies,
          forex_pairs: selectedForexPairs,
          stock_indices: selectedStockIndices,
          commodities: selectedCommodities,
          volume_assets: selectedVolumeAssets,
          date_range: dateRange,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.chart_data?.length > 0) setEconomicData(data.chart_data);
      }
    } catch (error) {
      setAnalysisError(`Failed to fetch data: ${error.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCurrencies.length > 0 || selectedForexPairs.length > 0 ||
      selectedStockIndices.length > 0 || selectedVolumeAssets.length > 0 ||
      selectedCommodities.length > 0) {
      fetchEconomicStrengthData();
    }
  }, [selectedCurrencies, selectedForexPairs, selectedStockIndices, selectedVolumeAssets, selectedCommodities, dateRange]);

  const ASSET_LABELS = useMemo(() => {
    const m = {};
    currencies.forEach(c   => { m[c.code]                = `${c.code} ESI`; });
    forexPairs.forEach(f   => { m[f.pair+'_price']        = f.name; });
    stockIndices.forEach(s => { m[s.symbol+'_index']      = s.displayName; });
    commodities.forEach(c  => { m[c.symbol+'_commodity']  = c.displayName; });
    Object.keys(SECTOR_MAPPINGS).forEach(t => { m[t] = t; });
    return m;
  }, []);

  const labelOf = (key) => {
    if (ASSET_LABELS[key]) return ASSET_LABELS[key];
    const ticker = key.replace(/_stock$/, '');
    if (ASSET_LABELS[ticker]) return ASSET_LABELS[ticker];
    return key.replace(/_price|_index|_commodity|_volume_ratio|_stock/g,'').replace(/=F$/,'').replace(/^\^/,'');
  };

  const classOf = (key) => {
    if (key.endsWith('_price'))        return 'Forex';
    if (key.endsWith('_index'))        return 'Index';
    if (key.endsWith('_commodity'))    return 'Commodity';
    if (key.endsWith('_volume_ratio')) return 'Volume';
    if (key.endsWith('_stock'))        return SECTOR_MAPPINGS[key.replace('_stock','')] || 'Stock';
    if (SECTOR_MAPPINGS[key])          return SECTOR_MAPPINGS[key];
    return 'ESI';
  };

  const ALL_SECTORS = useMemo(() => [...new Set(Object.values(SECTOR_MAPPINGS))].sort(), []);
  const STATIC_MACRO_CLASSES = ['ESI','Forex','Index','Commodity'];
  const STATIC_MACRO_CROSS = [
    ['ESI','Forex'],['ESI','Index'],['ESI','Commodity'],
    ['Forex','Index'],['Forex','Commodity'],['Index','Commodity'],
  ];

  // ── Correlation engine ──
  const runMLAnalysis = async (mode = 'all') => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStatus('Fetching all assets…');
    setAiInsights([]);
    setAnalysisError('');
    await new Promise(r => setTimeout(r, 30));

    try {
      let stocksForMode = [];
      if (mode === 'all') {
        stocksForMode = allStocks.map(s => s.symbol);
      } else if (mode.single && ALL_SECTORS.includes(mode.single)) {
        stocksForMode = allStocks.filter(s => s.sector === mode.single).map(s => s.symbol);
      } else if (mode.cross) {
        const [a, b] = mode.cross;
        if (ALL_SECTORS.includes(a)) stocksForMode.push(...allStocks.filter(s => s.sector === a).map(s => s.symbol));
        if (ALL_SECTORS.includes(b)) stocksForMode.push(...allStocks.filter(s => s.sector === b).map(s => s.symbol));
      }
      const isMacroOnlyMode = mode !== 'all' && (
        (mode.single && !ALL_SECTORS.includes(mode.single)) ||
        (mode.cross && !ALL_SECTORS.includes(mode.cross[0]) && !ALL_SECTORS.includes(mode.cross[1]))
      );

      setAnalysisStatus(`Fetching ${isMacroOnlyMode ? 'macro' : `macro + ${stocksForMode.length} stocks`}…`);

      const res = await fetch(`${baseUrl}/api/economic-strength-index/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currencies:    currencies.map(c => c.code),
          forex_pairs:   forexPairs.map(f => f.pair),
          stock_indices: stockIndices.map(s => s.symbol),
          commodities:   commodities.map(c => c.symbol),
          stocks:        isMacroOnlyMode ? [] : stocksForMode,
          volume_assets: [],
          date_range:    dateRange,
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      const data = json.chart_data;

      if (!data?.length || data.length < 5) {
        setAnalysisError('Not enough data returned. Try a different date range.');
        setIsAnalyzing(false);
        return;
      }

      setAnalysisProgress(15);
      setAnalysisStatus('Classifying series…');
      await new Promise(r => setTimeout(r, 20));

      const allKeys = Object.keys(data[0])
        .filter(k => k !== 'date')
        .filter(k => data.some(d => d[k] != null && typeof d[k] === 'number'))
        .map(k => ({ key: k, label: labelOf(k), cls: classOf(k) }));

      if (allKeys.length < 2) {
        setAnalysisError('Not enough numeric series returned from API.');
        setIsAnalyzing(false);
        return;
      }

      let pairs = [];
      if (mode === 'all') {
        for (let i = 0; i < allKeys.length; i++)
          for (let j = i+1; j < allKeys.length; j++)
            pairs.push([allKeys[i], allKeys[j]]);
      } else if (mode.single) {
        const pool = allKeys.filter(k => k.cls === mode.single);
        for (let i = 0; i < pool.length; i++)
          for (let j = i+1; j < pool.length; j++)
            pairs.push([pool[i], pool[j]]);
      } else if (mode.cross) {
        const [clsA, clsB] = mode.cross;
        const poolA = allKeys.filter(k => k.cls === clsA);
        const poolB = allKeys.filter(k => k.cls === clsB);
        for (const a of poolA) for (const b of poolB) pairs.push([a, b]);
      }

      if (pairs.length === 0) {
        setAnalysisError('No pairs found for that selection — the API may not have returned data for that asset class.');
        setIsAnalyzing(false);
        return;
      }

      setAnalysisStatus(`Computing ${pairs.length.toLocaleString()} correlations…`);
      await new Promise(r => setTimeout(r, 20));

      const findings = [];
      const BATCH = 30;

      for (let i = 0; i < pairs.length; i++) {
        const [kA, kB] = pairs[i];
        const rows = data.filter(d => d[kA.key] != null && d[kB.key] != null);

        if (rows.length >= 5) {
          const score = tf.tidy(() => {
            const tA = tf.tensor1d(rows.map(d => d[kA.key]));
            const tB = tf.tensor1d(rows.map(d => d[kB.key]));
            const mA = tA.mean(); const mB = tB.mean();
            const nA = tA.sub(mA).div(tA.sub(mA).square().mean().sqrt().add(1e-8));
            const nB = tB.sub(mB).div(tB.sub(mB).square().mean().sqrt().add(1e-8));
            return nA.mul(nB).mean().dataSync()[0];
          });
          findings.push({ kA, kB, score });
        }

        if (i % BATCH === 0) {
          setAnalysisProgress(15 + Math.round((i / pairs.length) * 80));
          setAnalysisStatus(`Pair ${(i+1).toLocaleString()} / ${pairs.length.toLocaleString()}`);
          await new Promise(r => setTimeout(r, 0));
        }
      }

      setAnalysisProgress(97);
      setAnalysisStatus('Ranking…');
      await new Promise(r => setTimeout(r, 20));

      const insights = findings
        .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
        .map(f => {
          const s = f.score;
          let term, styleClass;
          if      (s >  0.8) { term = 'Strong Positive';  styleClass = 'insight-positive-strong'; }
          else if (s >  0.5) { term = 'Positive Trend';   styleClass = 'insight-positive'; }
          else if (s >  0.3) { term = 'Weak Positive';    styleClass = 'insight-neutral'; }
          else if (s < -0.8) { term = 'Strong Inverse';   styleClass = 'insight-negative-strong'; }
          else if (s < -0.5) { term = 'Inverse Trend';    styleClass = 'insight-negative'; }
          else if (s < -0.3) { term = 'Weak Inverse';     styleClass = 'insight-neutral'; }
          else               { term = 'No Relationship';  styleClass = 'insight-neutral'; }
          return {
            id: `${f.kA.key}__${f.kB.key}`,
            nameA: f.kA.label, nameB: f.kB.label,
            classA: f.kA.cls,  classB: f.kB.cls,
            term, styleClass,
            score: s.toFixed(3),
            scoreNum: s,
          };
        });

      setAiInsights(insights);
      setAnalysisProgress(100);
      setAnalysisStatus('');
    } catch (err) {
      setAnalysisError(`Failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Toggle Handlers ──
  const toggle = (setter) => (val) => setter(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  const handleCurrencyToggle    = toggle(setSelectedCurrencies);
  const handleForexToggle       = toggle(setSelectedForexPairs);
  const handleStockIndexToggle  = toggle(setSelectedStockIndices);
  const handleCommodityToggle   = toggle(setSelectedCommodities);
  const handleVolumeAssetToggle = toggle(setSelectedVolumeAssets);
  const handleStockToggle       = toggle(setSelectedStocks);

  // ── CSV Download ──
  const convertToCSV = (data, headers) => {
    if (!data?.length) return '';
    return [headers.join(','), ...data.map(row => headers.map(h => {
      const v = row[h];
      if (v == null) return '';
      if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
      return v;
    }).join(','))].join('\n');
  };
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
  };

  // ── Filtered Correlations ──
  const filteredInsights = useMemo(() => {
    let list = aiInsights;
    // search
    if (corrSearch.trim()) {
      const q = corrSearch.toLowerCase();
      list = list.filter(i => i.nameA.toLowerCase().includes(q) || i.nameB.toLowerCase().includes(q));
    }
    // strength filter
    if (corrFilter !== 'all') {
      if      (corrFilter === 'strong_pos') list = list.filter(i => i.scoreNum > 0.8);
      else if (corrFilter === 'strong_neg') list = list.filter(i => i.scoreNum < -0.8);
      else if (corrFilter === 'positive')   list = list.filter(i => i.scoreNum > 0.5);
      else if (corrFilter === 'negative')   list = list.filter(i => i.scoreNum < -0.5);
      else if (corrFilter === 'weak')       list = list.filter(i => Math.abs(i.scoreNum) <= 0.3);
    }
    // class filter
    if (corrClassFilter !== 'all') {
      list = list.filter(i => i.classA === corrClassFilter || i.classB === corrClassFilter);
    }
    // minimum absolute score threshold
    if (corrMinScore > 0) {
      list = list.filter(i => Math.abs(i.scoreNum) >= corrMinScore);
    }
    // sort
    if      (corrSort === 'abs_desc')  list = [...list].sort((a,b) => Math.abs(b.scoreNum) - Math.abs(a.scoreNum));
    else if (corrSort === 'abs_asc')   list = [...list].sort((a,b) => Math.abs(a.scoreNum) - Math.abs(b.scoreNum));
    else if (corrSort === 'pos_first') list = [...list].sort((a,b) => b.scoreNum - a.scoreNum);
    else if (corrSort === 'neg_first') list = [...list].sort((a,b) => a.scoreNum - b.scoreNum);
    return list;
  }, [aiInsights, corrSearch, corrFilter, corrClassFilter, corrSort, corrMinScore]);

  // Average correlation score for the current filtered set
  const avgCorrScore = useMemo(() => {
    if (!filteredInsights.length) return null;
    const avg = filteredInsights.reduce((s, i) => s + i.scoreNum, 0) / filteredInsights.length;
    return avg;
  }, [filteredInsights]);

  // ── Modal filtered assets ──
  const modalFilteredStocks = useMemo(() => {
    const q = modalSearch.toLowerCase();
    return allStocks.filter(s =>
      s.symbol.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
    );
  }, [allStocks, modalSearch]);

  // ── Chart helpers ──
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="esi-tooltip">
        <p className="esi-tooltip-label">{`Date: ${label}`}</p>
        {payload.map((entry, i) => {
          const isForex = entry.dataKey.includes('_price');
          const isStock = entry.dataKey.includes('_index');
          const isCom   = entry.dataKey.includes('_commodity');
          const isVol   = entry.dataKey.includes('_volume_ratio');
          let displayName, val;
          if (isVol) { displayName = `${entry.dataKey.replace('_volume_ratio', '')} Vol`; val = `${entry.value?.toFixed(2)}x`; }
          else if (isForex) { displayName = entry.dataKey.replace('_price', ''); val = entry.value?.toFixed(4); }
          else if (isStock) { const sym = entry.dataKey.replace('_index', ''); displayName = stockIndices.find(s => s.symbol === sym)?.displayName || sym; val = entry.value?.toFixed(2); }
          else if (isCom) { const sym = entry.dataKey.replace('_commodity', ''); displayName = commodities.find(c => c.symbol === sym)?.displayName || sym; val = `$${entry.value?.toFixed(2)}`; }
          else { displayName = `${entry.dataKey} ESI`; val = entry.value?.toFixed(2); }
          return <p key={i} style={{ color: entry.color }} className="esi-tooltip-entry">{`${displayName}: ${val || 'N/A'}`}</p>;
        })}
      </div>
    );
  };

  const getYAxisDomains = () => {
    if (!economicData?.length) return { esi: [0, 100], forex: [0, 1], stock: [0, 1000], volume: [0, 5], commodity: [0, 1000] };
    let minF = Infinity, maxF = -Infinity, minS = Infinity, maxS = -Infinity;
    let minV = Infinity, maxV = -Infinity, minC = Infinity, maxC = -Infinity;
    economicData.forEach(pt => {
      selectedForexPairs.forEach(f => { const v = pt[`${f}_price`]; if (v) { minF = Math.min(minF, v); maxF = Math.max(maxF, v); } });
      selectedStockIndices.forEach(s => { const v = pt[`${s}_index`]; if (v) { minS = Math.min(minS, v); maxS = Math.max(maxS, v); } });
      selectedCommodities.forEach(c => { const v = pt[`${c}_commodity`]; if (v) { minC = Math.min(minC, v); maxC = Math.max(maxC, v); } });
      selectedVolumeAssets.forEach(id => { const v = pt[`${id}_volume_ratio`]; if (v) { minV = Math.min(minV, v); maxV = Math.max(maxV, v); } });
    });
    const pad = (mn, mx) => (mx - mn) * 0.05;
    return {
      esi: [0, 100],
      forex: isFinite(minF) ? [minF - pad(minF, maxF), maxF + pad(minF, maxF)] : [0, 1],
      stock: isFinite(minS) ? [minS - pad(minS, maxS), maxS + pad(minS, maxS)] : [0, 1000],
      commodity: isFinite(minC) ? [minC - pad(minC, maxC), maxC + pad(minC, maxC)] : [0, 1000],
      volume: isFinite(minV) ? [Math.max(0, minV - pad(minV, maxV)), maxV + pad(minV, maxV)] : [0, 5],
    };
  };

  const domains = getYAxisDomains();

  const totalSelected = selectedCurrencies.length + selectedForexPairs.length + selectedStockIndices.length + selectedCommodities.length + selectedVolumeAssets.length + selectedStocks.length;

  const MODAL_TABS = [
    { id: 'currencies', label: '🌐 Currencies',  count: selectedCurrencies.length },
    { id: 'forex',      label: '💱 Forex',        count: selectedForexPairs.length },
    { id: 'indices',    label: '📈 Indices',       count: selectedStockIndices.length },
    { id: 'commodities',label: '🛢️ Commodities',  count: selectedCommodities.length },
    { id: 'volume',     label: '📊 Volume',        count: selectedVolumeAssets.length },
    { id: 'stocks',     label: '🏢 US Stocks',     count: selectedStocks.length },
  ];

  const allClasses = useMemo(() => {
    const classes = new Set(aiInsights.map(i => i.classA).concat(aiInsights.map(i => i.classB)));
    return [...classes].sort();
  }, [aiInsights]);

  return (
    <div>
      <div className="header"><Header /></div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <h5 className="major-upcoming-news-events-header">Economic Strength Index — AI Analysis</h5>
          <br />

          {/* ── ASSET SELECTOR BUTTON ── */}
          <div className="esi-selector-bar">
            <button className="open-modal-btn" onClick={() => setModalOpen(true)}>
              <span className="modal-btn-icon">⚙️</span>
              Configure Assets
              {totalSelected > 0 && <span className="modal-btn-badge">{totalSelected}</span>}
            </button>
            <div className="esi-date-inline">
              <label>Range:</label>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="esi-select-inline">
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
                <option value="180d">6 Months</option>
                <option value="365d">1 Year</option>
              </select>
            </div>
            {totalSelected > 0 && (
              <div className="selected-chips">
                {selectedCurrencies.map(c    => <span key={c} className="chip chip-esi">{c}</span>)}
                {selectedForexPairs.map(f    => <span key={f} className="chip chip-forex">{f}</span>)}
                {selectedStockIndices.map(s  => <span key={s} className="chip chip-stock">{stockIndices.find(i => i.symbol === s)?.displayName || s}</span>)}
                {selectedCommodities.map(c   => <span key={c} className="chip chip-commodity">{commodities.find(i => i.symbol === c)?.displayName || c}</span>)}
                {selectedStocks.map(s        => <span key={s} className="chip chip-usstock">{s}</span>)}
              </div>
            )}
          </div>

          {/* ── ASSET CONFIG MODAL ── */}
          {modalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setModalOpen(false); }}>
              <div className="modal-container">
                <div className="modal-header">
                  <h3>Asset Configuration</h3>
                  <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                </div>
                <div className="modal-tabs">
                  {MODAL_TABS.map(tab => (
                    <button key={tab.id} className={`modal-tab ${modalTab === tab.id ? 'active' : ''}`} onClick={() => { setModalTab(tab.id); setModalSearch(''); }}>
                      {tab.label}
                      {tab.count > 0 && <span className="modal-tab-badge">{tab.count}</span>}
                    </button>
                  ))}
                </div>
                {modalTab === 'stocks' && (
                  <div className="modal-search-bar">
                    <input type="text" placeholder="Search by ticker or sector..." value={modalSearch} onChange={e => setModalSearch(e.target.value)} className="modal-search-input" />
                    {selectedStocks.length > 0 && <button className="modal-clear-btn" onClick={() => setSelectedStocks([])}>Clear All ({selectedStocks.length})</button>}
                  </div>
                )}
                <div className="modal-body">
                  {modalTab === 'currencies' && (
                    <div className="modal-grid">
                      {currencies.map(c => (
                        <label key={c.code} className={`modal-item ${selectedCurrencies.includes(c.code) ? 'selected' : ''}`} style={{ '--item-color': c.color }}>
                          <input type="checkbox" checked={selectedCurrencies.includes(c.code)} onChange={() => handleCurrencyToggle(c.code)} />
                          <span className="modal-item-dot" style={{ background: c.color }}></span>
                          <span className="modal-item-primary">{c.code}</span>
                          <span className="modal-item-secondary">{c.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {modalTab === 'forex' && (
                    <div className="modal-grid">
                      {forexPairs.map(f => (
                        <label key={f.pair} className={`modal-item ${selectedForexPairs.includes(f.pair) ? 'selected' : ''}`} style={{ '--item-color': f.color }}>
                          <input type="checkbox" checked={selectedForexPairs.includes(f.pair)} onChange={() => handleForexToggle(f.pair)} />
                          <span className="modal-item-dot" style={{ background: f.color }}></span>
                          <span className="modal-item-primary">{f.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {modalTab === 'indices' && (
                    <div className="modal-grid">
                      {stockIndices.map(s => (
                        <label key={s.symbol} className={`modal-item ${selectedStockIndices.includes(s.symbol) ? 'selected' : ''}`} style={{ '--item-color': s.color }}>
                          <input type="checkbox" checked={selectedStockIndices.includes(s.symbol)} onChange={() => handleStockIndexToggle(s.symbol)} />
                          <span className="modal-item-dot" style={{ background: s.color }}></span>
                          <span className="modal-item-primary">{s.displayName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {modalTab === 'commodities' && (
                    <div className="modal-grid">
                      {commodities.map(c => (
                        <label key={c.symbol} className={`modal-item ${selectedCommodities.includes(c.symbol) ? 'selected' : ''}`} style={{ '--item-color': c.color }}>
                          <input type="checkbox" checked={selectedCommodities.includes(c.symbol)} onChange={() => handleCommodityToggle(c.symbol)} />
                          <span className="modal-item-dot" style={{ background: c.color }}></span>
                          <span className="modal-item-primary">{c.displayName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {modalTab === 'volume' && (
                    <div className="modal-grid">
                      {volumeAssets.map(v => (
                        <label key={v.id} className={`modal-item ${selectedVolumeAssets.includes(v.id) ? 'selected' : ''}`} style={{ '--item-color': v.color }}>
                          <input type="checkbox" checked={selectedVolumeAssets.includes(v.id)} onChange={() => handleVolumeAssetToggle(v.id)} />
                          <span className="modal-item-dot" style={{ background: v.color }}></span>
                          <span className="modal-item-primary">{v.name}</span>
                          <span className="modal-item-tag">{v.type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {modalTab === 'stocks' && (
                    <>
                      <div className="sector-quick-bar">
                        {uniqueSectors.map(sector => {
                          const sectorStocks = allStocks.filter(s => s.sector === sector).map(s => s.symbol);
                          const allSelected = sectorStocks.every(s => selectedStocks.includes(s));
                          return (
                            <button key={sector} className={`sector-quick-btn ${allSelected ? 'active' : ''}`} style={{ '--sector-color': SECTOR_COLORS[sector] || '#6b7280' }}
                              onClick={() => { if (allSelected) setSelectedStocks(p => p.filter(s => !sectorStocks.includes(s))); else setSelectedStocks(p => [...new Set([...p, ...sectorStocks])]); }}>
                              {sector}<span>{sectorStocks.length}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="modal-stocks-info">{selectedStocks.length} / {allStocks.length} selected{modalFilteredStocks.length !== allStocks.length && ` (showing ${modalFilteredStocks.length})`}</div>
                      <div className="modal-grid modal-grid-stocks">
                        {modalFilteredStocks.map(s => (
                          <label key={s.symbol} className={`modal-item modal-item-stock ${selectedStocks.includes(s.symbol) ? 'selected' : ''}`} style={{ '--item-color': s.color }}>
                            <input type="checkbox" checked={selectedStocks.includes(s.symbol)} onChange={() => handleStockToggle(s.symbol)} />
                            <span className="modal-item-dot" style={{ background: s.color }}></span>
                            <span className="modal-item-primary">{s.symbol}</span>
                            <span className="modal-item-tag" style={{ background: s.color + '22', color: s.color }}>{s.sector.replace(' ', '\u00A0')}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <span className="modal-footer-info">{totalSelected} assets selected across all categories</span>
                  <button className="modal-done-btn" onClick={() => setModalOpen(false)}>Done ✓</button>
                </div>
              </div>
            </div>
          )}

          {/* ── AI CORRELATION ENGINE ── */}
          <div className="ai-analysis-container">
            <div className="ai-header">
              <div className="ai-header-left">
                <div className="ai-header-icon">📡</div>
                <div>
                  <h6 className="ai-title">Correlation Engine</h6>
                  <p className="ai-subtitle">Uses all defined assets · No selection needed · Results sorted highest → lowest</p>
                </div>
              </div>
              <div className="ai-header-right">
                <button onClick={() => runMLAnalysis('all')} disabled={isAnalyzing} className="ai-analyze-small-btn">
                  {isAnalyzing ? <><span className="ai-btn-spinner-sm"></span>{analysisProgress}%</> : '⚡ Analyze All'}
                </button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="ai-progress-track">
                <div className="ai-progress-fill" style={{ width: `${analysisProgress}%` }} />
                <span className="ai-progress-txt">{analysisStatus}</span>
              </div>
            )}

            <div className="ai-classes-outer">
              <div className="ai-class-group">
                <div className="ai-class-group-label">Macro asset classes — within</div>
                <div className="ai-class-cards">
                  {STATIC_MACRO_CLASSES.map(cls => (
                    <button key={cls} onClick={() => runMLAnalysis({ single: cls })} disabled={isAnalyzing} className="ai-class-card within-card">
                      <span className="ai-class-card-name">{cls}</span>
                      <span className="ai-class-card-action">Find Correlations →</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ai-class-group">
                <div className="ai-class-group-label">Macro cross-class analysis</div>
                <div className="ai-class-cards">
                  {STATIC_MACRO_CROSS.map(([a, b]) => (
                    <button key={`${a}-${b}`} onClick={() => runMLAnalysis({ cross: [a, b] })} disabled={isAnalyzing} className="ai-class-card cross-card">
                      <span className="ai-class-card-name">{a} <span className="ai-vs">↔</span> {b}</span>
                      <span className="ai-class-card-action">Find Correlations →</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ai-class-group">
                <div className="ai-class-group-label">US stocks — within sector</div>
                <div className="ai-class-cards">
                  {ALL_SECTORS.map(sector => (
                    <button key={sector} onClick={() => runMLAnalysis({ single: sector })} disabled={isAnalyzing} className="ai-class-card sector-card" style={{ '--sector-col': SECTOR_COLORS[sector] || '#6b7280' }}>
                      <span className="ai-class-card-name">{sector}</span>
                      <span className="ai-class-card-action">Find Correlations →</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ai-class-group">
                <div className="ai-class-group-label">US stocks vs macro</div>
                <div className="ai-class-cards">
                  {ALL_SECTORS.map(sector => (
                    ['ESI','Forex','Index','Commodity'].map(macro => (
                      <button key={`${sector}-${macro}`} onClick={() => runMLAnalysis({ cross: [sector, macro] })} disabled={isAnalyzing} className="ai-class-card cross-sector-card" style={{ '--sector-col': SECTOR_COLORS[sector] || '#6b7280' }}>
                        <span className="ai-class-card-name">{sector} <span className="ai-vs">↔</span> {macro}</span>
                        <span className="ai-class-card-action">Find Correlations →</span>
                      </button>
                    ))
                  ))}
                </div>
              </div>
            </div>

            {analysisError && <div className="ai-error-message">⚠️ {analysisError}</div>}

            {/* ── RESULTS ── */}
            {aiInsights.length > 0 && (
              <>
                {/* ── CORRELATION CONTROLS ── */}
                <div className="corr-controls">
                  {/* Row 1: search + counts + avg score */}
                  <div className="corr-controls-row">
                    <input type="text" placeholder="🔍 Search ticker or name…" value={corrSearch} onChange={e => setCorrSearch(e.target.value)} className="corr-search" />
                    <span className="corr-count">{filteredInsights.length.toLocaleString()} / {aiInsights.length.toLocaleString()}</span>
                    {avgCorrScore != null && (
                      <span className="corr-avg-score" style={{ background: avgCorrScore > 0.5 ? '#dcfce7' : avgCorrScore < -0.5 ? '#fee2e2' : '#f1f5f9', color: avgCorrScore > 0.5 ? '#15803d' : avgCorrScore < -0.5 ? '#b91c1c' : '#64748b', border: `1px solid ${avgCorrScore > 0.5 ? '#bbf7d0' : avgCorrScore < -0.5 ? '#fecaca' : '#e2e8f0'}` }}>
                        avg ρ {avgCorrScore >= 0 ? '+' : ''}{avgCorrScore.toFixed(3)}
                      </span>
                    )}
                    <button className="corr-collapse-all" onClick={() => {
                      const allCollapsed = Object.keys(collapsedInsights).length >= filteredInsights.length;
                      if (!allCollapsed) { const all = {}; filteredInsights.forEach(i => { all[i.id] = true; }); setCollapsedInsights(all); }
                      else setCollapsedInsights({});
                    }}>
                      {Object.keys(collapsedInsights).length >= filteredInsights.length ? '▶ Expand' : '▼ Collapse'}
                    </button>
                  </div>
                  {/* Row 2: filters */}
                  <div className="corr-controls-row">
                    <select value={corrFilter} onChange={e => setCorrFilter(e.target.value)} className="corr-filter">
                      <option value="all">All strengths</option>
                      <option value="strong_pos">Strong Positive (&gt;0.8)</option>
                      <option value="strong_neg">Strong Negative (&lt;-0.8)</option>
                      <option value="positive">Positive (&gt;0.5)</option>
                      <option value="negative">Negative (&lt;-0.5)</option>
                      <option value="weak">Weak (±0.3)</option>
                    </select>
                    <select value={corrClassFilter} onChange={e => setCorrClassFilter(e.target.value)} className="corr-filter">
                      <option value="all">All classes</option>
                      <optgroup label="Macro">
                        {['ESI','Forex','Index','Commodity'].map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </optgroup>
                      <optgroup label="US Stock Sectors">
                        {ALL_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                      </optgroup>
                    </select>
                    <select value={corrSort} onChange={e => setCorrSort(e.target.value)} className="corr-filter">
                      <option value="abs_desc">↓ Strongest first</option>
                      <option value="abs_asc">↑ Weakest first</option>
                      <option value="pos_first">↓ Most positive</option>
                      <option value="neg_first">↓ Most negative</option>
                    </select>
                    <label className="corr-threshold-label">
                      min |ρ|
                      <input type="range" min="0" max="0.9" step="0.05" value={corrMinScore}
                        onChange={e => setCorrMinScore(parseFloat(e.target.value))}
                        className="corr-threshold-slider" />
                      <span className="corr-threshold-val">{corrMinScore.toFixed(2)}</span>
                    </label>
                    {(corrSearch || corrFilter !== 'all' || corrClassFilter !== 'all' || corrMinScore > 0) && (
                      <button className="corr-clear-btn" onClick={() => { setCorrSearch(''); setCorrFilter('all'); setCorrClassFilter('all'); setCorrMinScore(0); }}>
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="ai-results-grid">
                  {filteredInsights.slice(0, 300).map(insight => (
                    <div key={insight.id} className={`ai-card ${insight.styleClass}`}>
                      <div className="ai-card-header" onClick={() => setCollapsedInsights(p => ({ ...p, [insight.id]: !p[insight.id] }))}>
                        <div className="ai-pair-names">
                          <span className="ai-name-a">{insight.nameA}</span>
                          <span className="ai-pair-vs">↔</span>
                          <span className="ai-name-b">{insight.nameB}</span>
                        </div>
                        <div className="ai-card-header-right">
                          <span className={`ai-score-badge ${insight.scoreNum > 0.5 ? 'badge-pos' : insight.scoreNum < -0.5 ? 'badge-neg' : 'badge-neu'}`}>
                            {insight.scoreNum > 0 ? '+' : ''}{insight.score}
                          </span>
                          {/* ── VIEW CHARTS BUTTON ── */}
                          <button
                            className="ai-view-chart-btn"
                            onClick={e => { e.stopPropagation(); setChartInsight(insight); }}
                            title="View charts"
                          >
                            📈
                          </button>
                          <span className="ai-collapse-icon">{collapsedInsights[insight.id] ? '▶' : '▼'}</span>
                        </div>
                      </div>
                      {!collapsedInsights[insight.id] && (
                        <div className="ai-card-body">
                          <div className="ai-card-classes">
                            <span className="ai-class-tag">{insight.classA}</span>
                            <span className="ai-class-tag">{insight.classB}</span>
                            <strong className="ai-term-label">{insight.term}</strong>
                          </div>
                          <div className="ai-score-bar-wrap">
                            <div className="ai-score-bar-track">
                              <div className="ai-score-bar-center" />
                              <div className="ai-score-bar-fill" style={{
                                width: `${Math.abs(insight.scoreNum) * 50}%`,
                                left: insight.scoreNum >= 0 ? '50%' : `${50 - Math.abs(insight.scoreNum) * 50}%`,
                                background: insight.scoreNum > 0.5 ? '#16a34a' : insight.scoreNum < -0.5 ? '#dc2626' : '#94a3b8',
                              }} />
                            </div>
                          </div>
                          {/* Stock info panels — only shown when the asset is a stock */}
                          {isStockClass(insight.classA) && (
                            <StockInfoPanel
                              key={`sip-a-${insight.id}`}
                              ticker={insight.nameA}
                              sectorColor={SECTOR_COLORS[insight.classA] || '#6366f1'}
                              baseUrl={baseUrl}
                              insightId={`${insight.id}-a`}
                            />
                          )}
                          {isStockClass(insight.classB) && (
                            <StockInfoPanel
                              key={`sip-b-${insight.id}`}
                              ticker={insight.nameB}
                              sectorColor={SECTOR_COLORS[insight.classB] || '#6366f1'}
                              baseUrl={baseUrl}
                              insightId={`${insight.id}-b`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredInsights.length > 300 && (
                    <div className="corr-overflow-notice">Showing top 300 of {filteredInsights.length.toLocaleString()} pairs — use filters to narrow down.</div>
                  )}
                </div>
              </>
            )}

            {aiInsights.length === 0 && !isAnalyzing && !analysisError && (
              <p className="ai-hint">Click any button — uses all assets defined in the app, no selection required. 🚀</p>
            )}
          </div>

          {/* ── DOWNLOAD ── */}
          {economicData.length > 0 && (
            <div className="esi-download-section">
              <button onClick={() => {}} className="esi-download-btn download-all-btn">⬇ Download All CSV</button>
            </div>
          )}

          {/* ── CHART ── */}
          <div className="esi-chart-container">
            {loading ? (
              <div className="esi-loading">
                <div className="esi-spinner"></div>
                <p>Loading Data...</p>
              </div>
            ) : economicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={economicData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#374151" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="esi" stroke="#374151" tick={{ fontSize: 12 }} domain={domains.esi} label={{ value: 'ESI', angle: -90, position: 'insideLeft' }} />
                  {selectedForexPairs.length > 0 && <YAxis yAxisId="forex" orientation="right" stroke="#6b7280" tick={{ fontSize: 10 }} domain={domains.forex} tickFormatter={v => v.toFixed(4)} />}
                  {selectedStockIndices.length > 0 && <YAxis yAxisId="stock" orientation="right" stroke="#8b5cf6" tick={{ fontSize: 10 }} domain={domains.stock} tickFormatter={v => v.toFixed(0)} />}
                  {selectedVolumeAssets.length > 0 && <YAxis yAxisId="volume" orientation="right" stroke="#f97316" tick={{ fontSize: 10 }} domain={domains.volume} tickFormatter={v => v.toFixed(1) + 'x'} />}
                  {selectedCommodities.length > 0 && <YAxis yAxisId="commodity" orientation="right" stroke="#fbbf24" tick={{ fontSize: 10 }} domain={domains.commodity} tickFormatter={v => '$' + v.toFixed(0)} />}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {selectedCurrencies.map(c => <Line key={c} yAxisId="esi" type="monotone" dataKey={c} stroke={currencies.find(i => i.code === c)?.color || '#6b7280'} strokeWidth={2} dot={false} connectNulls name={`${c} ESI`} />)}
                  {selectedForexPairs.map(f => <Line key={`${f}_price`} yAxisId="forex" type="monotone" dataKey={`${f}_price`} stroke={forexPairs.find(i => i.pair === f)?.color || '#6b7280'} strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls name={forexPairs.find(i => i.pair === f)?.name || f} />)}
                  {selectedStockIndices.map(s => <Line key={`${s}_index`} yAxisId="stock" type="monotone" dataKey={`${s}_index`} stroke={stockIndices.find(i => i.symbol === s)?.color || '#8b5cf6'} strokeWidth={2} strokeDasharray="10 5" dot={false} connectNulls name={stockIndices.find(i => i.symbol === s)?.displayName || s} />)}
                  {selectedCommodities.map(c => <Line key={`${c}_commodity`} yAxisId="commodity" type="monotone" dataKey={`${c}_commodity`} stroke={commodities.find(i => i.symbol === c)?.color || '#fbbf24'} strokeWidth={2} strokeDasharray="8 4" dot={false} connectNulls name={commodities.find(i => i.symbol === c)?.displayName || c} />)}
                  {selectedVolumeAssets.map(v => <Line key={`${v}_volume_ratio`} yAxisId="volume" type="monotone" dataKey={`${v}_volume_ratio`} stroke={volumeAssets.find(i => i.id === v)?.color || '#f97316'} strokeWidth={2} strokeDasharray="2 2" dot={false} connectNulls name={`${volumeAssets.find(i => i.id === v)?.name || v} Vol`} />)}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="esi-no-data"><p>Configure assets above to view chart data</p></div>
            )}
          </div>

          <div className="esi-info">
            <h6>About this Dashboard</h6>
            <p>The ESI aggregates economic events weighted by impact. Overlays show real market data. Correlations are computed via TensorFlow.js Pearson correlation in your browser.</p>
          </div>
        </div>
      </div>

      {/* ── CORRELATION CHART MODAL ── */}
      <CorrelationChartModal
        insight={chartInsight}
        onClose={() => setChartInsight(null)}
        baseUrl={baseUrl}
      />

      <style jsx>{`
        /* ── KEYFRAMES ── */
        @keyframes esi-spin { to { transform: rotate(360deg); } }
        @keyframes esi-modal-in { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        /* ── SELECTOR BAR ── */
        .esi-selector-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
        .open-modal-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .open-modal-btn:hover { background: #0f172a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .modal-btn-icon { font-size: 16px; }
        .modal-btn-badge { background: #3b82f6; color: white; border-radius: 999px; padding: 2px 8px; font-size: 12px; font-weight: 700; }
        .esi-date-inline { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; }
        .esi-select-inline { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: white; font-size: 13px; }
        .selected-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .chip-esi { background: #dbeafe; color: #1d4ed8; }
        .chip-forex { background: #fef3c7; color: #d97706; }
        .chip-stock { background: #ede9fe; color: #7c3aed; }
        .chip-commodity { background: #fef9c3; color: #b45309; }
        .chip-usstock { background: #dcfce7; color: #15803d; }

        /* ── ASSET CONFIG MODAL ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); }
        .modal-container { background: white; border-radius: 16px; width: 100%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.3); overflow: hidden; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }
        .modal-close { background: #f1f5f9; border: none; border-radius: 8px; width: 32px; height: 32px; font-size: 16px; cursor: pointer; color: #64748b; transition: all 0.15s; }
        .modal-close:hover { background: #e2e8f0; color: #0f172a; }
        .modal-tabs { display: flex; gap: 2px; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
        .modal-tab { padding: 7px 14px; border: none; border-radius: 7px; background: transparent; cursor: pointer; font-size: 13px; font-weight: 500; color: #64748b; display: flex; align-items: center; gap: 6px; transition: all 0.15s; white-space: nowrap; }
        .modal-tab:hover { background: #e2e8f0; color: #1e293b; }
        .modal-tab.active { background: #1e293b; color: white; }
        .modal-tab-badge { background: #3b82f6; color: white; border-radius: 999px; padding: 1px 6px; font-size: 11px; font-weight: 700; }
        .modal-tab.active .modal-tab-badge { background: rgba(255,255,255,0.3); }
        .modal-search-bar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
        .modal-search-input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; }
        .modal-search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .modal-clear-btn { padding: 7px 14px; background: #fee2e2; color: #b91c1c; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .modal-body { flex: 1; overflow-y: auto; padding: 16px; }
        .modal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
        .modal-grid-stocks { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        .modal-item { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 2px solid transparent; border-radius: 8px; cursor: pointer; transition: all 0.15s; background: #f8fafc; }
        .modal-item:hover { background: #f1f5f9; border-color: #e2e8f0; }
        .modal-item.selected { background: color-mix(in srgb, var(--item-color) 8%, white); border-color: var(--item-color); }
        .modal-item input { display: none; }
        .modal-item-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .modal-item-primary { font-weight: 600; font-size: 13px; color: #1e293b; }
        .modal-item-secondary { font-size: 12px; color: #94a3b8; margin-left: auto; }
        .modal-item-tag { font-size: 11px; padding: 2px 7px; border-radius: 4px; background: #f1f5f9; color: #64748b; margin-left: auto; white-space: nowrap; font-weight: 500; }
        .modal-item-stock { padding: 8px 10px; }
        .modal-stocks-info { font-size: 13px; color: #64748b; padding: 8px 0 12px; font-weight: 500; }
        .sector-quick-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .sector-quick-btn { padding: 5px 12px; border: 2px solid var(--sector-color); border-radius: 999px; background: transparent; color: var(--sector-color); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px; }
        .sector-quick-btn:hover, .sector-quick-btn.active { background: var(--sector-color); color: white; }
        .sector-quick-btn span { font-size: 11px; opacity: 0.8; }
        .modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-footer-info { font-size: 13px; color: #64748b; }
        .modal-done-btn { padding: 10px 28px; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .modal-done-btn:hover { background: #0f172a; }

        /* ── AI ANALYSIS CONTAINER ── */
        .ai-analysis-container { background: #fff; border: 1.5px solid #dbeafe; border-radius: 16px; padding: 24px; margin: 20px 0; box-shadow: 0 4px 24px rgba(37,99,235,0.07); }
        .ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
        .ai-header-left { display: flex; align-items: center; gap: 12px; }
        .ai-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ai-header-icon { font-size: 26px; line-height: 1; }
        .ai-title { margin: 0 0 2px; font-size: 1.05rem; font-weight: 800; color: #1e3a8a; }
        .ai-subtitle { margin: 0; font-size: 11px; color: #94a3b8; }
        .ai-analyze-small-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s; white-space: nowrap; box-shadow: 0 2px 10px rgba(37,99,235,0.28); }
        .ai-analyze-small-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(37,99,235,0.38); }
        .ai-analyze-small-btn:disabled { background: linear-gradient(135deg,#93c5fd,#bfdbfe); box-shadow: none; cursor: not-allowed; }
        .ai-btn-spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: esi-spin 0.7s linear infinite; }
        .ai-progress-track { width: 100%; height: 6px; background: #dbeafe; border-radius: 3px; margin-bottom: 16px; overflow: hidden; position: relative; }
        .ai-progress-fill { height: 100%; background: linear-gradient(90deg,#2563eb,#06b6d4); border-radius: 3px; transition: width 0.12s linear; }
        .ai-progress-txt { position: absolute; top: 10px; left: 0; font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .ai-classes-outer { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
        .ai-class-group { background: #f8fbff; border: 1.5px solid #e0eaff; border-radius: 12px; padding: 14px 16px; }
        .ai-class-group-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #94a3b8; margin-bottom: 10px; }
        .ai-class-cards { display: flex; flex-wrap: wrap; gap: 7px; }
        .ai-class-card { display: flex; flex-direction: column; gap: 2px; padding: 9px 14px; border-radius: 9px; border: 1.5px solid; cursor: pointer; transition: all 0.14s; background: white; text-align: left; }
        .ai-class-card:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-class-card-name { font-size: 13px; font-weight: 700; line-height: 1.2; }
        .ai-class-card-action { font-size: 10px; font-weight: 500; opacity: 0.55; }
        .ai-vs { font-weight: 300; color: #94a3b8; }
        .within-card { border-color: #bfdbfe; color: #1e40af; }
        .within-card:hover:not(:disabled) { background: #eff6ff; border-color: #60a5fa; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.16); }
        .cross-card { border-color: #bbf7d0; color: #065f46; }
        .cross-card:hover:not(:disabled) { background: #f0fdf4; border-color: #4ade80; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.16); }
        .sector-card { border-color: var(--sector-col); color: var(--sector-col); }
        .sector-card:hover:not(:disabled) { background: color-mix(in srgb, var(--sector-col) 8%, white); transform: translateY(-2px); box-shadow: 0 4px 12px color-mix(in srgb, var(--sector-col) 30%, transparent); }
        .cross-sector-card { border-color: color-mix(in srgb, var(--sector-col) 50%, #bbf7d0); color: color-mix(in srgb, var(--sector-col) 70%, #065f46); }
        .cross-sector-card:hover:not(:disabled) { background: color-mix(in srgb, var(--sector-col) 6%, #f0fdf4); transform: translateY(-2px); box-shadow: 0 4px 12px color-mix(in srgb, var(--sector-col) 20%, transparent); }
        .ai-error-message { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; color: #991b1b; font-size: 13px; margin: 10px 0 14px; }
        .ai-hint { text-align: center; color: #94a3b8; font-size: 13px; padding: 24px 0 6px; font-style: italic; }

        /* ── CORRELATION CONTROLS ── */
        .corr-controls { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; padding: 12px 14px; background: #f8fbff; border: 1.5px solid #dbeafe; border-radius: 10px; }
        .corr-controls-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .corr-avg-score { font-size: 12px; padding: 4px 11px; border-radius: 20px; font-weight: 800; font-family: 'Courier New', monospace; white-space: nowrap; }
        .corr-threshold-label { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #64748b; font-weight: 600; white-space: nowrap; }
        .corr-threshold-slider { width: 80px; accent-color: #2563eb; cursor: pointer; }
        .corr-threshold-val { font-family: monospace; font-size: 12px; color: #2563eb; font-weight: 700; min-width: 28px; }
        .corr-clear-btn { padding: 5px 12px; background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.14s; }
        .corr-clear-btn:hover { background: #fecaca; }
        .corr-search { flex: 1; min-width: 160px; padding: 7px 12px; border: 1.5px solid #dbeafe; border-radius: 8px; font-size: 13px; outline: none; background: white; }
        .corr-search:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .corr-filter { padding: 7px 10px; border: 1.5px solid #dbeafe; border-radius: 8px; font-size: 13px; background: white; color: #1e293b; cursor: pointer; outline: none; }
        .corr-filter:focus { border-color: #2563eb; }
        .corr-count { font-size: 12px; color: #2563eb; background: #eff6ff; padding: 4px 11px; border-radius: 20px; font-weight: 700; border: 1px solid #bfdbfe; white-space: nowrap; }
        .corr-collapse-all { padding: 7px 13px; background: white; border: 1.5px solid #dbeafe; border-radius: 8px; font-size: 12px; cursor: pointer; white-space: nowrap; font-weight: 600; color: #2563eb; transition: all 0.14s; }
        .corr-collapse-all:hover { background: #eff6ff; }
        .corr-overflow-notice { grid-column: 1/-1; text-align: center; padding: 18px; background: #fefce8; border: 1px solid #fde047; border-radius: 10px; color: #854d0e; font-size: 13px; font-weight: 500; }

        /* ── INSIGHT CARDS ── */
        .ai-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 9px; }
        .ai-card { background: white; border-radius: 10px; border: 1.5px solid #e2e8f0; overflow: hidden; transition: box-shadow 0.16s, transform 0.16s; }
        .ai-card:hover { box-shadow: 0 5px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .ai-card-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 11px 13px 10px; cursor: pointer; user-select: none; gap: 8px; }
        .ai-pair-names { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
        .ai-name-a { font-size: 13px; font-weight: 800; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
        .ai-name-b { font-size: 12px; font-weight: 600; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
        .ai-pair-vs { font-size: 11px; color: #cbd5e1; font-weight: 400; line-height: 1; margin: 1px 0; }
        .ai-card-header-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
        .ai-score-badge { padding: 3px 9px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 12px; font-weight: 800; }
        .badge-pos { background: #dcfce7; color: #15803d; }
        .badge-neg { background: #fee2e2; color: #b91c1c; }
        .badge-neu { background: #f1f5f9; color: #64748b; }
        .ai-collapse-icon { font-size: 9px; color: #cbd5e1; }

        /* ── VIEW CHART BUTTON ── */
        .ai-view-chart-btn {
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          border-radius: 6px;
          padding: 3px 7px;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          transition: all 0.14s;
          flex-shrink: 0;
        }
        .ai-view-chart-btn:hover {
          background: #2563eb;
          border-color: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 3px 10px rgba(37,99,235,0.3);
        }

        .ai-card-body { padding: 8px 13px 12px; border-top: 1px solid #f1f5f9; }
        .ai-card-classes { display: flex; align-items: center; gap: 5px; margin-bottom: 7px; flex-wrap: wrap; }
        .ai-class-tag { font-size: 10px; padding: 2px 7px; background: #eff6ff; color: #2563eb; border-radius: 4px; font-weight: 700; border: 1px solid #dbeafe; }
        .ai-term-label { font-size: 11px; font-weight: 700; color: #475569; margin-left: auto; }
        .ai-score-bar-wrap { margin-top: 4px; }
        .ai-score-bar-track { width: 100%; height: 7px; background: #f1f5f9; border-radius: 4px; position: relative; overflow: hidden; }
        .ai-score-bar-fill { position: absolute; height: 100%; border-radius: 4px; }
        .ai-score-bar-center { position: absolute; left: 50%; top: 0; width: 1.5px; height: 100%; background: #e2e8f0; z-index: 1; }
        .insight-positive-strong { border-left: 3.5px solid #16a34a; }
        .insight-positive { border-left: 3.5px solid #4ade80; }
        .insight-negative-strong { border-left: 3.5px solid #dc2626; }
        .insight-negative { border-left: 3.5px solid #f87171; }
        /* ── STOCK INFO PANEL ── */
        .sip-trigger-btn {
          display: flex; align-items: center; gap: 6px;
          width: 100%; padding: 7px 13px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--sc) 6%, white), color-mix(in srgb, var(--sc) 3%, white));
          border: none; border-top: 1px solid color-mix(in srgb, var(--sc) 15%, #e2e8f0);
          cursor: pointer; text-align: left;
          color: color-mix(in srgb, var(--sc) 80%, #1e293b);
          transition: all 0.15s;
          font-family: inherit;
        }
        .sip-trigger-btn:hover {
          background: linear-gradient(135deg, color-mix(in srgb, var(--sc) 14%, white), color-mix(in srgb, var(--sc) 8%, white));
        }
        .sip-trigger-btn:hover span:first-of-type {
          transform: scale(1.2);
        }

        .insight-neutral { border-left: 3.5px solid #e2e8f0; }

        /* ── CHART ── */
        .esi-chart-container { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .esi-loading, .esi-no-data { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #94a3b8; }
        .esi-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: esi-spin 0.8s linear infinite; margin-bottom: 12px; }
        .esi-tooltip { background: rgba(15,23,42,0.95); border: 1px solid #334155; border-radius: 8px; padding: 12px; color: white; }
        .esi-tooltip-label { margin: 0 0 6px; font-weight: 600; color: #e2e8f0; font-size: 13px; }
        .esi-tooltip-entry { margin: 3px 0; font-size: 13px; }
        .esi-download-section { margin: 10px 0; }
        .esi-download-btn { padding: 9px 18px; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .download-all-btn { background: #10b981; color: white; }
        .download-all-btn:hover { background: #059669; }
        .esi-info { background: #f8fafc; border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 13px; color: #64748b; }
        .esi-info h6 { margin: 0 0 6px; color: #475569; font-weight: 700; }
        .esi-info p { margin: 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .modal-container { max-height: 95vh; border-radius: 12px 12px 0 0; position: fixed; bottom: 0; }
          .modal-overlay { align-items: flex-end; padding: 0; }
          .modal-grid { grid-template-columns: 1fr 1fr; }
          .modal-grid-stocks { grid-template-columns: 1fr 1fr; }
          .corr-controls { flex-direction: column; align-items: stretch; }
          .corr-search { width: 100%; min-width: unset; }
          .corr-count { margin-left: 0; }
          .ai-results-grid { grid-template-columns: 1fr; }
          .esi-selector-bar { flex-direction: column; align-items: flex-start; }
          .modal-tabs { overflow-x: auto; flex-wrap: nowrap; padding: 10px 12px; }
          .ai-class-card { flex: 1 1 calc(50% - 6px); }
        }
        @media (max-width: 480px) {
          .ai-class-card { flex: 1 1 100%; }
          .ai-analysis-container { padding: 16px; }
        }
      `}</style>
    </div>
  );
}