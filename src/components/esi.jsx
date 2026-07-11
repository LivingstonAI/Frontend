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
  'IBM':'Technology', 'SPCX':'Technology','ACN':'Technology','ADSK':'Technology','AKAM':'Technology','ANSS':'Technology','APH':'Technology','ANET':'Technology','ASML':'Technology','KEYS':'Technology','MCHP':'Technology','MSI':'Technology','MDB':'Technology','NTAP':'Technology','NTNX':'Technology','PAYC':'Technology','PTC':'Technology','ROP':'Technology','SAP':'Technology','STX':'Technology','TER':'Technology','TSM':'Technology','TYL':'Technology','VRSN':'Technology','WDC':'Technology','ZBRA':'Technology','ZM':'Technology','DOCU':'Technology','TWLO':'Technology','SQ':'Technology','UBER':'Technology','LYFT':'Technology','DASH':'Technology','PINS':'Technology','SNAP':'Technology','SPOT':'Technology','ROKU':'Technology','AFRM':'Technology','COIN':'Technology','HOOD':'Technology','SOFI':'Technology','ASTS':'Technology',
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

// ─── MARKET PULSE ────────────────────────────────────────────────────────────
// SnowAI color palette: icy blues + white
// Tabs: Overview | All Sectors | Sectors | Indices | Commodities

const MP_SNOW = {
  primary:   '#38bdf8',   // sky-400
  bright:    '#0ea5e9',   // sky-500
  deep:      '#0284c7',   // sky-600
  navy:      '#0c4a6e',   // sky-950 (text on white)
  ice:       '#e0f2fe',   // sky-100
  frost:     '#f0f9ff',   // sky-50
  white:     '#ffffff',
  border:    '#bae6fd',   // sky-200
  sub:       '#0369a1',   // sky-700
  muted:     '#7dd3fc',   // sky-300
  chartBg:   '#040d14',
  chartGrid: '#0c2233',
};

const SNOW_REGIME_COLORS = {
  'Bull Trend':  '#22d3ee',
  'Bear Trend':  '#f87171',
  'Ranging':     '#fbbf24',
  'Volatile':    '#fb923c',
  'Insufficient Data': '#64748b',
};

const MP_TF_LIST = [
  { label:'1m',  interval:'1m',   period:'1d'  },
  { label:'5m',  interval:'5m',   period:'5d'  },
  { label:'15m', interval:'15m',  period:'5d'  },
  { label:'30m', interval:'30m',  period:'1mo' },
  { label:'1H',  interval:'60m',  period:'1mo' },
  { label:'4H',  interval:'60m',  period:'3mo' },
  { label:'1D',  interval:'1d',   period:'1y'  },
  { label:'1W',  interval:'1wk',  period:'2y'  },
  { label:'1M',  interval:'1mo',  period:'5y'  },
  { label:'3M',  interval:'3mo',  period:'max' },
  { label:'6M',  interval:'3mo',  period:'max' },
  { label:'1Y',  interval:'1mo',  period:'max' },
  { label:'2Y',  interval:'3mo',  period:'max' },
];

const MP_COMMODITY_GROUPS = {
  'Energy':     { symbols:['CL=F','BZ=F','NG=F','RB=F','HO=F'],  names:['Crude WTI','Brent','Nat Gas','Gasoline','Heating Oil'], color:'#ef4444' },
  'Metals':     { symbols:['GC=F','SI=F','HG=F','PL=F','PA=F'],  names:['Gold','Silver','Copper','Platinum','Palladium'],       color:'#fbbf24' },
  'Agriculture':{ symbols:['ZC=F','ZW=F','ZS=F','KC=F','CT=F'],  names:['Corn','Wheat','Soybean','Coffee','Cotton'],            color:'#84cc16' },
};

const MP_INDICES = [
  { symbol:'^GSPC', name:'S&P 500',      color:'#dc2626' },
  { symbol:'^DJI',  name:'Dow Jones',    color:'#2563eb' },
  { symbol:'^IXIC', name:'NASDAQ',       color:'#16a34a' },
  { symbol:'^RUT',  name:'Russell 2000', color:'#ea580c' },
  { symbol:'^FTSE', name:'FTSE 100',     color:'#7c3aed' },
  { symbol:'^GDAXI',name:'DAX',          color:'#0891b2' },
  { symbol:'^FCHI', name:'CAC 40',       color:'#be123c' },
  { symbol:'^N225', name:'Nikkei 225',   color:'#059669' },
  { symbol:'^HSI',  name:'Hang Seng',    color:'#f59e0b' },
  { symbol:'^AXJO', name:'ASX 200',      color:'#8b5cf6' },
  { symbol:'^KS11', name:'KOSPI',        color:'#e63946' },
];

// ── Live market cap cache ──
const _mpCapCache = {};
const mpMarketCap = (sym) => _mpCapCache[sym] || 50e9;

const mpFetchMarketCaps = async (tickers, baseUrl) => {
  const missing = tickers.filter(t => !_mpCapCache[t]);
  if (!missing.length) return;
  try {
    const res = await fetch(`${baseUrl}/api/esi_market_caps_v1/`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ tickers: missing }),
    });
    if (res.ok) {
      const j = await res.json();
      if (j.success && j.data) Object.entries(j.data).forEach(([t,cap]) => { if (cap) _mpCapCache[t] = cap; });
    }
  } catch(e) { console.warn('[mpFetchMarketCaps]', e); }
};

// ── Batch OHLCV ──
const mpBatchFetch = async (tickers, interval, period, baseUrl) => {
  try {
    const res = await fetch(`${baseUrl}/api/esi_batch_ohlcv_v1/`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ tickers, interval, period }),
    });
    if (res.ok) { const j = await res.json(); if (j.success && j.data) return j.data; }
  } catch(_) {}
  // CORS fallback
  const out = {};
  await Promise.all(tickers.map(async ticker => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${period}&includePrePost=false`;
      const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      if (!r.ok) return;
      const d = await r.json();
      const result = d?.chart?.result?.[0];
      if (!result) return;
      const ts = result.timestamp || [];
      const q  = result.indicators?.quote?.[0] || {};
      out[ticker] = ts.map((t,i) => ({ time:t, close:q.close?.[i] })).filter(x => x.close != null);
    } catch(_) {}
  }));
  return out;
};

const mpFetch = async (ticker, interval, period, baseUrl) => {
  const b = await mpBatchFetch([ticker], interval, period, baseUrl);
  return b[ticker] || [];
};

// ── MSS fetch ──
const mpFetchMSS = async (symbols, baseUrl, periodDays = 60) => {
  try {
    const res = await fetch(`${baseUrl}/api/mss/calculate/`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ symbols, period: periodDays }),
    });
    if (res.ok) {
      const j = await res.json();
      if (j.success && j.data) {
        const map = {};
        j.data.forEach(d => { map[d.symbol] = d; });
        return map;
      }
    }
  } catch(e) { console.warn('[mpFetchMSS]', e); }
  return {};
};

// ── Pure JS helpers ──
const mpNormalize = (arr) => {
  const base = (arr || []).find(v => v != null);
  if (!base) return arr;
  return arr.map(v => v == null ? null : (v / base) * 100);
};

const mpRegime = (prices) => {
  const valid = (prices || []).filter(p => p != null && isFinite(p));
  if (valid.length < 3) return { label:'Insufficient Data', color:SNOW_REGIME_COLORS['Insufficient Data'], emoji:'⬜' };
  const last  = valid[valid.length - 1];
  const n20   = Math.min(20, valid.length);
  const n50   = Math.min(50, valid.length);
  const sma20 = valid.slice(-n20).reduce((a,b) => a+b, 0) / n20;
  const sma50 = valid.slice(-n50).reduce((a,b) => a+b, 0) / n50;
  const recentN = Math.min(20, valid.length);
  const rets  = valid.slice(-recentN).map((v,i,a) => i === 0 ? 0 : (v - a[i-1]) / a[i-1]);
  const vol   = Math.sqrt(rets.reduce((a,r) => a + r*r, 0) / rets.length) * 100;
  const ret   = ((last - valid[0]) / valid[0]) * 100;
  if (vol > 3.5) return { label:'Volatile',  color:SNOW_REGIME_COLORS['Volatile'],   emoji:'🟠' };
  if (last > sma20 && last > sma50 && ret > 2)  return { label:'Bull Trend', color:SNOW_REGIME_COLORS['Bull Trend'], emoji:'🟢' };
  if (last < sma20 && last < sma50 && ret < -2) return { label:'Bear Trend', color:SNOW_REGIME_COLORS['Bear Trend'], emoji:'🔴' };
  return { label:'Ranging', color:SNOW_REGIME_COLORS['Ranging'], emoji:'🟡' };
};

const mpPearson = (a, b) => {
  const pairs = (a||[]).map((v,i) => [v,(b||[])[i]]).filter(([x,y]) => x!=null && y!=null);
  if (pairs.length < 5) return null;
  const n=pairs.length, mx=pairs.reduce((s,[x])=>s+x,0)/n, my=pairs.reduce((s,[,y])=>s+y,0)/n;
  const num=pairs.reduce((s,[x,y])=>s+(x-mx)*(y-my),0);
  const dx=Math.sqrt(pairs.reduce((s,[x])=>s+(x-mx)**2,0)), dy=Math.sqrt(pairs.reduce((s,[,y])=>s+(y-my)**2,0));
  return (dx*dy)===0?0:num/(dx*dy);
};

const mpClassify = (stockPrices, sectorPrices) => {
  const corr = mpPearson(stockPrices, sectorPrices);
  if (corr===null) return { label:'Unknown',   color:'#94a3b8', emoji:'❓' };
  if (corr > 0.65) return { label:'Following', color:'#22d3ee', emoji:'✅' };
  if (corr < 0.25) return { label:'Diverging', color:'#f87171', emoji:'⚠️' };
  return              { label:'Neutral',    color:'#fbbf24', emoji:'〰️' };
};

const MP_MIN_PTS = 5; // minimum data points for a ticker to be included

const mpAlign = (seriesMap) => {
  const keys = Object.keys(seriesMap).filter(k => k !== '__times');
  if (!keys.length) return { __times: [] };

  // Pre-filter: drop any series with fewer than MP_MIN_PTS real points
  const validKeys = keys.filter(k => (seriesMap[k]||[]).filter(p => p != null).length >= MP_MIN_PTS);
  if (!validKeys.length) return { __times: [] };

  // Build union of all times from valid series only
  const allTimes = [...new Set(validKeys.flatMap(k => (seriesMap[k]||[]).map(p => p.time)))].sort((a,b)=>a-b);

  // Map time → close for each valid series
  const byTimeMaps = {};
  for (const key of validKeys) {
    byTimeMaps[key] = Object.fromEntries((seriesMap[key]||[]).map(p => [p.time, p.close]));
  }

  // Keep timestamps covered by at least 1 ticker (forward-fill handles gaps)
  // Use a low threshold: just 1 ticker minimum — the forward-fill takes care of the rest
  const threshold = Math.max(1, Math.ceil(validKeys.length * 0.2)); // 20% of valid tickers
  const filteredTimes = allTimes.filter(t =>
    validKeys.filter(k => byTimeMaps[k][t] != null).length >= threshold
  );

  // Build aligned arrays with forward-fill AND back-fill for missing values
  const result = {};
  for (const key of validKeys) {
    const raw = filteredTimes.map(t => byTimeMaps[key][t] ?? null);
    // Forward fill
    let last = null;
    const fwd = raw.map(v => { if (v != null) { last = v; return v; } return last; });
    // Back fill (fill leading nulls with first known value)
    let first = fwd.find(v => v != null) ?? null;
    result[key] = fwd.map(v => v ?? first);
  }
  result.__times = filteredTimes;
  return result;
};

const mpSectorIndex = (aligned, tickers) => {
  const valid = tickers.filter(t => aligned[t]?.some(v => v != null));
  if (!valid.length) return null;
  const totalCap = valid.reduce((s,t) => s + mpMarketCap(t), 0);
  return (aligned.__times || []).map((_,i) => {
    let weighted=0, weight=0;
    for (const t of valid) {
      const v = aligned[t][i];
      if (v != null) { const w = mpMarketCap(t)/totalCap; weighted += v*w; weight += w; }
    }
    return weight > 0 ? weighted/weight : null;
  });
};

// ── LWC chart builder (shared) ──
const buildMpChart = async (container, seriesList, opts = {}) => {
  const LWC = await new Promise((res, rej) => {
    if (window.LightweightCharts) { res(window.LightweightCharts); return; }
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
    s.onload = () => res(window.LightweightCharts); s.onerror = rej;
    document.head.appendChild(s);
  });

  const chart = LWC.createChart(container, {
    width:  container.clientWidth,
    height: opts.height || 360,
    layout: { background:{ type:'solid', color: MP_SNOW.chartBg }, textColor: MP_SNOW.muted, fontFamily:"'IBM Plex Mono',monospace" },
    grid:   { vertLines:{ color: MP_SNOW.chartGrid }, horzLines:{ color: MP_SNOW.chartGrid } },
    crosshair: { mode:1, vertLine:{ color: MP_SNOW.primary+'88', style:2 }, horzLine:{ color: MP_SNOW.primary+'88', style:2 } },
    rightPriceScale: { borderColor: MP_SNOW.chartGrid, textColor: MP_SNOW.muted },
    timeScale: { borderColor: MP_SNOW.chartGrid, textColor: MP_SNOW.muted, timeVisible:true },
    handleScroll:true, handleScale:true,
  });

  for (const s of seriesList) {
    const series = s.area
      ? chart.addAreaSeries({ lineColor:s.color, topColor:s.color+'44', bottomColor:s.color+'05', lineWidth:s.width||2, title:s.name||'', priceLineVisible:false, lastValueVisible:s.label!==false })
      : chart.addLineSeries({ color:s.color, lineWidth:s.width||1, title:s.name||'', priceLineVisible:false, lastValueVisible:s.label!==false });
    const seen = new Set();
    const pts  = (s.data||[]).filter(p => p.value != null && isFinite(p.value))
      .sort((a,b) => a.time - b.time)
      .filter(p => { if (seen.has(p.time)) return false; seen.add(p.time); return true; });
    if (pts.length) series.setData(pts);
  }

  chart.timeScale().fitContent();

  const ro = new ResizeObserver(() => {
    if (container && chart) chart.applyOptions({ width: container.clientWidth });
  });
  ro.observe(container);

  return chart;
};

// ── Regime badge ──
const RegimeBadge = ({ regime }) => (
  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, whiteSpace:'nowrap',
    background: regime.color+'22', color: regime.color, border:`1px solid ${regime.color}44` }}>
    {regime.emoji} {regime.label}
  </span>
);

// ── MSS badge ──
const MssBadge = ({ mss }) => {
  if (mss == null) return <span style={{ fontSize:10, color:'#94a3b8' }}>—</span>;
  const col = mss >= 47 ? '#22d3ee' : mss >= 30 ? '#fbbf24' : '#f87171';
  return (
    <span style={{ fontSize:10, fontWeight:800, fontFamily:'monospace', padding:'2px 8px', borderRadius:6,
      background: col+'22', color: col, border:`1px solid ${col}44` }}>
      MSS {mss}
    </span>
  );
};

// ── R² badge ──
const R2Badge = ({ r2 }) => {
  if (r2 == null) return null;
  return (
    <span style={{ fontSize:10, fontWeight:700, fontFamily:'monospace', padding:'2px 7px', borderRadius:6,
      background: MP_SNOW.ice, color: MP_SNOW.deep, border:`1px solid ${MP_SNOW.border}` }}>
      R² {r2.toFixed(3)}
    </span>
  );
};

// ─── VOICE READER ────────────────────────────────────────────────────────────
// Shared voice state — module-level so it persists across all instances
let _voiceList = [];
let _selectedVoiceURI = typeof localStorage !== 'undefined' ? (localStorage.getItem('snowai_voice_uri') || '') : '';

const getVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) { _voiceList = v; return v; }
  return _voiceList;
};

const speakText = (text) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  if (!text || !text.trim()) return;
  // Strip markdown
  const clean = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/#+\s/g, '').replace(/`[^`]*`/g, '').trim();
  const utt   = new SpeechSynthesisUtterance(clean);
  const voices = getVoices();
  if (_selectedVoiceURI) {
    const found = voices.find(v => v.voiceURI === _selectedVoiceURI);
    if (found) utt.voice = found;
  }
  utt.rate  = 1.0;
  utt.pitch = 1.0;
  window.speechSynthesis.speak(utt);
};

// Small hook for the voice selector panel
function useVoices() {
  const [voices, setVoices] = React.useState(getVoices());
  const [selectedURI, setSelectedURI] = React.useState(_selectedVoiceURI);
  React.useEffect(() => {
    const load = () => { const v = getVoices(); if (v.length) setVoices([...v]); };
    load();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = load;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, []);
  const choose = (uri) => {
    _selectedVoiceURI = uri;
    setSelectedURI(uri);
    if (typeof localStorage !== 'undefined') localStorage.setItem('snowai_voice_uri', uri);
  };
  return { voices, selectedURI, choose };
}

// Speak button — place anywhere
function SpeakBtn({ text, label = '🔊', style = {} }) {
  const [speaking, setSpeaking] = React.useState(false);
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const toggle = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    if (!text || !text.trim()) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/#+\s/g, '').replace(/`[^`]*`/g, '').trim();
    const utt   = new SpeechSynthesisUtterance(clean);
    const voices = getVoices();
    if (_selectedVoiceURI) { const f = voices.find(v => v.voiceURI === _selectedVoiceURI); if (f) utt.voice = f; }
    utt.rate = 1.0; utt.pitch = 1.0;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  };
  return (
    <button onClick={e => { e.stopPropagation(); toggle(); }}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      style={{ background: speaking ? '#0ea5e9' : '#e0f2fe', border:'1.5px solid #bae6fd', borderRadius:6, padding:'2px 7px', cursor:'pointer', fontSize:12, color: speaking ? 'white' : '#0369a1', transition:'all 0.14s', flexShrink:0, lineHeight:1, ...style }}>
      {speaking ? '⏹' : label}
    </button>
  );
}

// Voice selector panel — used in settings area
function VoiceSelector({ theme }) {
  const { voices, selectedURI, choose } = useVoices();
  const t = ADP_THEMES[theme] || ADP_THEMES.light;
  if (!voices.length) return <span style={{ fontSize:11, color:t.sub }}>No voices available</span>;
  // Group by language
  const langs = [...new Set(voices.map(v => v.lang.split('-')[0].toUpperCase()))].sort();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
      <span style={{ fontSize:11, fontWeight:700, color:t.sub, whiteSpace:'nowrap' }}>🔊 Voice:</span>
      <select
        value={selectedURI}
        onChange={e => choose(e.target.value)}
        style={{ padding:'5px 8px', border:'1.5px solid #bae6fd', borderRadius:7, fontSize:12, background:t.bg||'white', color:t.text||'#0f172a', outline:'none', maxWidth:220, cursor:'pointer' }}
      >
        <option value="">— Browser Default —</option>
        {langs.map(lang => (
          <optgroup key={lang} label={lang}>
            {voices.filter(v => v.lang.toUpperCase().startsWith(lang)).map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedURI && (
        <button onClick={() => speakText('Hello, this is a voice preview for SnowAI.')}
          style={{ padding:'4px 10px', background:'#0ea5e9', color:'white', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
          Preview
        </button>
      )}
    </div>
  );
}

// ─── AI SECTION RENDERER ─────────────────────────────────────────────────────
// ─── ASSET DETAIL PANEL ──────────────────────────────────────────────────────
// Per-row expandable panel: LWC price chart + stock info + MSS lookback control

const ADP_THEMES = {
  light: { bg:'#ffffff', panel:'#f8fafc', border:'#e2e8f0', text:'#0f172a', sub:'#64748b', grid:'#f1f5f9', cross:'#94a3b8', chartBg:'#ffffff' },
  dark:  { bg:'#0f172a', panel:'#1e293b', border:'#334155', text:'#f1f5f9', sub:'#94a3b8', grid:'#1e293b',  cross:'#475569', chartBg:'#0f172a' },
  hud:   { bg:'#000814', panel:'#0a1628', border:'#00d4ff33', text:'#00d4ff', sub:'#0099bb', grid:'#00d4ff0d', cross:'#00d4ff', chartBg:'#000814' },
};
const ADP_CHART_COLOR = { light:'#0ea5e9', dark:'#38bdf8', hud:'#00d4ff' };

const AI_SCOLS = ['#0ea5e9', '#22d3ee', '#f87171', '#7c3aed'];

function AiSectionRenderer({ text, theme }) {
  const t = theme || ADP_THEMES.dark;

  // Ensure plain string
  const txt = typeof text === 'string' ? text : (text ? String(text) : '');
  if (!txt.trim()) {
    return <p style={{ fontSize:12, color:t.sub, padding:'4px 0' }}>No analysis generated.</p>;
  }

  // Walk lines and group into sections
  const rawLines = txt.split('\n');
  const sections = [];
  let current = null;

  rawLines.forEach(function(line) {
    const hm = line.match(/^(\d+)\.\s+\*\*([^*]+)\*\*\s*(.*)$/);
    if (hm) {
      if (current) sections.push(current);
      current = { heading: hm[2].trim(), body: hm[3].trim(), idx: parseInt(hm[1], 10) - 1 };
    } else if (current) {
      const trimmed = line.trim();
      if (trimmed) current.body = current.body ? current.body + ' ' + trimmed : trimmed;
    }
    // ignore preamble lines before first section
  });
  if (current) sections.push(current);

  // Fallback: no sections detected — render raw
  if (!sections.length) {
    return (
      <p style={{ fontSize:12, color:t.text, lineHeight:1.65, whiteSpace:'pre-wrap', margin:0 }}>{txt}</p>
    );
  }

  return (
    <div>
      {sections.map(function(sec, si) {
        const sc = AI_SCOLS[sec.idx >= 0 && sec.idx < AI_SCOLS.length ? sec.idx : si % AI_SCOLS.length];
        return (
          <div key={si} style={{ marginBottom:12, padding:'10px 14px', background:t.bg, borderRadius:8, borderLeft:'3px solid '+sc, border:'1px solid '+sc+'22', borderLeftWidth:3 }}>
            <div style={{ fontWeight:800, fontSize:11, color:sc, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.07em' }}>
              {sec.heading}
            </div>
            <p style={{ fontSize:12, color:t.text, lineHeight:1.65, margin:0 }}>
              {sec.body || '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
}


function AssetDetailPanel({ symbol, baseUrl, defaultLookback = 60, onClose = null, embedded = false }) {
  // When embedded=true the panel is always "open" — controlled by parent via onClose
  const [open,        setOpen]        = useState(embedded);
  const [chartTheme,  setChartTheme]  = useState('dark');
  const [chartType,   setChartType]   = useState('area');   // area | line | candle
  const [lookback,    setLookback]    = useState(defaultLookback);
  const [lookbackInput, setLookbackInput] = useState(String(defaultLookback));
  const [chartTf,     setChartTf]     = useState('1D');
  const [chartStatus, setChartStatus] = useState('idle');
  const [priceInfo,   setPriceInfo]   = useState(null);

  // Stock info state
  const [infoOpen,    setInfoOpen]    = useState(false);
  const [infoData,    setInfoData]    = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError,   setInfoError]   = useState('');

  // MSS state
  const [mssData,     setMssData]     = useState(null);
  const [mssLoading2, setMssLoading2] = useState(false);

  // AI analysis state
  const [aiOpen,      setAiOpen]      = useState(false);
  const [aiData,      setAiData]      = useState(null);   // cached per symbol
  const [aiLoading,   setAiLoading]   = useState(false);
  const [aiError,     setAiError]     = useState('');

  const containerRef  = useRef(null);
  const chartRef      = useRef(null);
  const roRef         = useRef(null);

  const t   = ADP_THEMES[chartTheme];
  const col = ADP_CHART_COLOR[chartTheme];

  // ── LWC chart ──
  const buildChart = useCallback(async () => {
    if (!containerRef.current || !symbol) return;
    setChartStatus('loading');
    try {
      const LWC = await new Promise((res, rej) => {
        if (window.LightweightCharts) { res(window.LightweightCharts); return; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
        s.onload = () => res(window.LightweightCharts); s.onerror = rej;
        document.head.appendChild(s);
      });

      if (chartRef.current) { try { chartRef.current.remove(); } catch(_){} chartRef.current = null; }
      if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }

      const tfObj2 = MP_TF_LIST.find(x => x.label === chartTf) || MP_TF_LIST[6];

      // Fetch data — always get full OHLC from Yahoo for candles; backend only has close
      let rawData = [];
      const yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) + '?interval=' + tfObj2.interval + '&range=' + tfObj2.period + '&includePrePost=false';

      const fetchYahooOHLC = async () => {
        const r = await fetch('https://corsproxy.io/?' + encodeURIComponent(yahooUrl));
        if (!r.ok) return [];
        const d = await r.json();
        const result = d && d.chart && d.chart.result && d.chart.result[0];
        if (!result) return [];
        const ts = result.timestamp || [];
        const q  = (result.indicators && result.indicators.quote && result.indicators.quote[0]) || {};
        return ts.map(function(tm, i) {
          const o = q.open  ? q.open[i]  : null;
          const h = q.high  ? q.high[i]  : null;
          const l = q.low   ? q.low[i]   : null;
          const c = q.close ? q.close[i] : null;
          return { time:tm, open:o, high:h, low:l, close:c };
        }).filter(function(x) { return x.close != null && isFinite(x.close); });
      };

      if (chartType === 'candle') {
        // Always use Yahoo for candles — backend only returns close price
        try { rawData = await fetchYahooOHLC(); } catch(_) {}
      } else {
        // Try backend first for close-only charts (faster)
        try {
          const res = await fetch(baseUrl + '/api/esi_ohlcv_feed_v1/', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ ticker:symbol, interval:tfObj2.interval, range:tfObj2.period }),
          });
          if (res.ok) { const j = await res.json(); if (j.data && j.data.length) rawData = j.data; }
        } catch(_) {}
        if (!rawData.length) {
          try { rawData = await fetchYahooOHLC(); } catch(_) {}
        }
      }

      if (!rawData.length) { setChartStatus('error'); return; }

      // Wait one frame so the DOM has fully painted and clientWidth is accurate
      await new Promise(r => requestAnimationFrame(r));
      const chartW = containerRef.current.clientWidth || containerRef.current.offsetWidth || 600;
      const chartH = Math.max(containerRef.current.clientHeight || 0, 300);

      const chart = LWC.createChart(containerRef.current, {
        width: chartW, height: chartH,
        layout: { background:{ type:'solid', color:t.chartBg }, textColor:t.text, fontFamily:"'IBM Plex Mono',monospace" },
        grid:   { vertLines:{ color:t.grid }, horzLines:{ color:t.grid } },
        crosshair: { mode:1, vertLine:{ color:t.cross, style:2 }, horzLine:{ color:t.cross, style:2 } },
        rightPriceScale: { borderColor:t.border, textColor:t.sub },
        timeScale: { borderColor:t.border, textColor:t.sub, timeVisible:true, secondsVisible:false },
        handleScroll:true, handleScale:true,
      });

      const seen = new Set();
      const fmt  = (d) => typeof d.time==='number' ? d.time : Math.floor(new Date(d.time).getTime()/1000);

      let series;
      if (chartType === 'candle') {
        series = chart.addCandlestickSeries({
          upColor:'#22d3ee', downColor:'#f87171',
          borderUpColor:'#22d3ee', borderDownColor:'#f87171',
          wickUpColor:'#22d3ee', wickDownColor:'#f87171',
        });
        const pts = rawData
          .map(d => {
            const c = (typeof d.close === 'number' && isFinite(d.close)) ? d.close : null;
            if (c === null) return null;
            const o = (typeof d.open  === 'number' && isFinite(d.open))  ? d.open  : c;
            const h = (typeof d.high  === 'number' && isFinite(d.high))  ? Math.max(d.high, o, c) : Math.max(o, c);
            const l = (typeof d.low   === 'number' && isFinite(d.low))   ? Math.min(d.low,  o, c) : Math.min(o, c);
            return { time:fmt(d), open:o, high:h, low:l, close:c };
          })
          .filter(d => d !== null)
          .sort((a,b) => a.time - b.time)
          .filter(d => { if(seen.has(d.time)) return false; seen.add(d.time); return true; });
        if (pts.length) series.setData(pts);
        else { setChartStatus('error'); return; }
      } else if (chartType === 'line') {
        series = chart.addLineSeries({ color:col, lineWidth:2, priceLineVisible:true, priceLineColor:col, crosshairMarkerVisible:true, crosshairMarkerRadius:5 });
        const pts = rawData.map(d => ({ time:fmt(d), value:d.close })).filter(d=>d.value!=null&&isFinite(d.value)).sort((a,b)=>a.time-b.time).filter(d=>{if(seen.has(d.time))return false;seen.add(d.time);return true;});
        series.setData(pts);
      } else {
        series = chart.addAreaSeries({ lineColor:col, topColor:col+'44', bottomColor:col+'05', lineWidth:2, priceLineVisible:true, priceLineColor:col, crosshairMarkerVisible:true, crosshairMarkerRadius:5, crosshairMarkerBorderColor:col, crosshairMarkerBackgroundColor:t.chartBg });
        const pts = rawData.map(d => ({ time:fmt(d), value:d.close })).filter(d=>d.value!=null&&isFinite(d.value)).sort((a,b)=>a.time-b.time).filter(d=>{if(seen.has(d.time))return false;seen.add(d.time);return true;});
        series.setData(pts);
        if (pts.length > 1) setPriceInfo({ price: pts[pts.length-1].value, change: ((pts[pts.length-1].value - pts[0].value)/pts[0].value*100) });
      }

      chart.subscribeCrosshairMove(param => {
        if (param.seriesData?.has(series)) {
          const v = param.seriesData.get(series);
          if (v) setPriceInfo(p => ({ ...p, hover: v.value ?? v.close }));
        }
      });

      chart.timeScale().fitContent();
      chartRef.current = chart;
      const ro = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          const w = containerRef.current.clientWidth || containerRef.current.offsetWidth || 600;
          const h = Math.max(containerRef.current.clientHeight || 0, 300);
          chartRef.current.applyOptions({ width: w, height: h });
        }
      });
      ro.observe(containerRef.current); roRef.current = ro;
      setChartStatus('ok');
    } catch(e) { console.error(e); setChartStatus('error'); }
  }, [symbol, chartTf, chartType, chartTheme, baseUrl]);

  useEffect(() => { if (open) buildChart(); return () => { if(chartRef.current){try{chartRef.current.remove();}catch(_){}} if(roRef.current)roRef.current.disconnect(); }; }, [open, buildChart]);

  // Live theme update
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      layout: { background:{ color:t.chartBg }, textColor:t.text },
      grid:   { vertLines:{ color:t.grid }, horzLines:{ color:t.grid } },
      crosshair: { vertLine:{ color:t.cross }, horzLine:{ color:t.cross } },
      rightPriceScale:{ borderColor:t.border, textColor:t.sub },
      timeScale:{ borderColor:t.border, textColor:t.sub },
    });
  }, [chartTheme]);

  // ── Stock info ──
  const fetchInfo = async () => {
    if (infoData) { setInfoOpen(o => !o); return; }
    setInfoOpen(true); setInfoLoading(true); setInfoError('');
    try {
      const res = await fetch(`${baseUrl}/api/esi_stock_fundamentals_v1/`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ tickers:[symbol] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setInfoData(j.data?.[symbol] || null);
    } catch(e) { setInfoError(e.message); }
    setInfoLoading(false);
  };

  // ── MSS fetch ──
  const fetchMss = async () => {
    const lb = parseInt(lookbackInput) || defaultLookback;
    setLookback(lb);
    setMssLoading2(true);
    try {
      const res = await fetch(`${baseUrl}/api/mss/calculate/`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ symbols:[symbol], period:lb }),
      });
      if (res.ok) { const j = await res.json(); if(j.success&&j.data?.[0]) setMssData(j.data[0]); }
    } catch(_) {}
    setMssLoading2(false);
  };

  // ── AI Analysis ──
  const fetchAiAnalysis = async () => {
    if (aiData) { setAiOpen(o => !o); return; }  // cached — just toggle
    setAiOpen(true);
    setAiLoading(true);
    setAiError('');
    try {
      // 1. Fetch OpenAI key
      const keyRes = await fetch(baseUrl + '/get_openai_key');
      if (!keyRes.ok) throw new Error('Could not fetch API key');
      const { OPENAI_API_KEY } = await keyRes.json();
      if (!OPENAI_API_KEY) throw new Error('No API key returned');

      // 2. Fetch news + economic events
      const newsRes = await fetch(baseUrl + '/fetch_news_data_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: [symbol], user_email: 'internal@snowai' }),
      });
      if (!newsRes.ok) throw new Error('News API error ' + newsRes.status);
      const newsJson = await newsRes.json();

      // Extract arrays — force Array.from so strings/objects never reach .map()
      const NL = '\n';

      const rawMsg   = newsJson.message;
      const articles = Array.isArray(rawMsg) ? rawMsg : [];

      // econEvents: backend returns { economic_events: [...] } per asset
      const econRaw    = newsJson.economic_events;
      const econFirst  = Array.isArray(econRaw) ? econRaw[0] : null;
      const econInner  = econFirst ? econFirst.economic_events : null;
      const econEvents = Array.isArray(econInner) ? econInner : [];

      const newsBlock = articles.length > 0
        ? articles.slice(0, 3).map(function(a, i) {
            if (!a || typeof a !== 'object') return '';
            return '[' + (i+1) + '] ' + String(a.title||'no title') + ' | ' + String(a.description||'') + ' | Highlights: ' + String(a.highlights||'');
          }).filter(Boolean).join(NL)
        : 'No recent news found.';

      const econBlock = econEvents.length > 0
        ? econEvents.slice(0, 8).map(function(e) {
            if (!e || typeof e !== 'object') return '';
            return '• ' + String(e.event || e.name || e.title || JSON.stringify(e)).slice(0, 120);
          }).filter(Boolean).join(NL)
        : 'No upcoming economic events.';

      const mssBlock = mssData
        ? 'MSS: ' + mssData.mss + ' | R2: ' + (mssData.r_squared ? mssData.r_squared.toFixed(3) : '—') + ' | Volatility: ' + (mssData.volatility ? mssData.volatility.toFixed(4) : '—') + ' | Status: ' + (mssData.status || '—')
        : 'MSS data not available.';

      const infoBlock = infoData
        ? 'Company: ' + (infoData.name||symbol) + ' | Sector: ' + (infoData.sector||'—') + ' | Market Cap: ' + (infoData.market_cap ? (infoData.market_cap/1e9).toFixed(1)+'B' : '—') + ' | P/E: ' + (infoData.pe_ratio ? infoData.pe_ratio.toFixed(1) : '—') + ' | Analyst: ' + (infoData.recommendation ? infoData.recommendation.toUpperCase() : '—')
        : '';

      const prompt = [
        'You are a professional financial analyst. Analyse ' + symbol + ' and provide a concise insightful report based on the data below.',
        '',
        'FUNDAMENTALS:',
        infoBlock || 'Not available.',
        '',
        'MARKET STABILITY:',
        mssBlock,
        '',
        'RECENT NEWS (last 3 articles):',
        newsBlock,
        '',
        'UPCOMING ECONOMIC EVENTS:',
        econBlock,
        '',
        'Provide your analysis in exactly these 4 sections using this format:',
        '1. **Market Sentiment** — what the news and data suggest about sentiment',
        '2. **Technical Outlook** — based on MSS score and R2, trending cleanly or choppy?',
        '3. **Key Risks** — main risks from news and economic events',
        '4. **Analyst View** — short summary of what to watch for',
        '',
        'Keep each section to 2-3 sentences. Be direct and professional. No disclaimers.',
      ].join(NL);

      // 4. Call GPT-4o-mini
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });
      if (!gptRes.ok) {
        const errBody = await gptRes.json().catch(() => ({}));
        throw new Error((errBody && errBody.error && errBody.error.message) || ('OpenAI error ' + gptRes.status));
      }
      const gptJson = await gptRes.json();
      const rawText = (gptJson.choices && gptJson.choices[0] && gptJson.choices[0].message && gptJson.choices[0].message.content) || '';
      setAiData({ text: rawText, fetchedAt: new Date().toLocaleTimeString() });
    } catch(e) {
      setAiError(e.message || 'Unknown error');
    }
    setAiLoading(false);
  };


  const fmtPrice = v => { if(!v) return '—'; if(v>=1e4) return v.toLocaleString(undefined,{maximumFractionDigits:0}); if(v<0.01) return v.toFixed(5); if(v<10) return v.toFixed(4); return v.toFixed(2); };
  const fmtBig   = v => { if(!v) return '—'; if(v>=1e12) return (v/1e12).toFixed(2)+'T'; if(v>=1e9) return (v/1e9).toFixed(2)+'B'; if(v>=1e6) return (v/1e6).toFixed(2)+'M'; return v.toLocaleString(); };

  const displayPrice = priceInfo?.hover ?? priceInfo?.price;

  if (!open) return (
    <button onClick={e=>{e.stopPropagation();setOpen(true);}} className="adp-open-btn" title={`View ${symbol} details`}>
      📊
    </button>
  );

  return (
    <div className="adp-panel" onClick={e=>e.stopPropagation()}>

      {/* ── Top bar ── */}
      <div className="adp-topbar">
        <span className="adp-sym">{symbol}</span>
        {displayPrice && <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:13, color:col }}>{fmtPrice(displayPrice)}</span>}
        {priceInfo?.change != null && (
          <span style={{ fontSize:11, fontWeight:700, color:priceInfo.change>=0?'#22d3ee':'#f87171', background:priceInfo.change>=0?'#22d3ee18':'#f8717118', padding:'2px 7px', borderRadius:5 }}>
            {priceInfo.change>=0?'▲':'▼'} {Math.abs(priceInfo.change).toFixed(2)}%
          </span>
        )}
        <div className="adp-controls">
          {['area','line','candle'].map(ct => (
            <button key={ct} className={`adp-pill ${chartType===ct?'active':''}`} onClick={()=>setChartType(ct)} title={ct}>
              {ct==='area'?'▲':ct==='line'?'╱':'🕯'}
            </button>
          ))}
          <div className="adp-divider"/>
          {[['light','☀️'],['dark','🌙'],['hud','⬡']].map(([th,ic])=>(
            <button key={th} className={`adp-pill ${chartTheme===th?'active':''}`} onClick={()=>setChartTheme(th)}>{ic}</button>
          ))}
          <div className="adp-divider"/>
          {['5m','1H','1D','1W','1M'].map(tfl=>(
            <button key={tfl} className={`adp-pill ${chartTf===tfl?'active':''}`} onClick={()=>setChartTf(tfl)}>{tfl}</button>
          ))}
          <div className="adp-divider"/>
          <button className="adp-pill" onClick={fetchInfo} title="Stock info">ℹ️</button>
          <button className={`adp-pill ${aiOpen?'active':''}`} onClick={fetchAiAnalysis} title="AI Analysis" style={{ background: aiOpen ? '#7c3aed' : undefined, borderColor: aiOpen ? '#7c3aed' : undefined }}>🤖 AI</button>
          <button className="adp-close" onClick={()=>{ if(embedded && onClose) onClose(); else setOpen(false); }}>✕</button>
        </div>
      </div>

      {/* ── Body row: chart left | stock info right ── */}
      <div className="adp-body-row">

        {/* Left: chart column */}
        <div className="adp-chart-area" style={{ background:t.chartBg }}>
          {chartStatus==='loading' && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:t.chartBg, zIndex:5, gap:10 }}>
              <div style={{ width:20, height:20, border:`3px solid ${t.border}`, borderTopColor:col, borderRadius:'50%', animation:'esi-spin 0.7s linear infinite' }}/>
              <span style={{ color:t.sub, fontSize:12, fontFamily:'monospace' }}>Loading {symbol}…</span>
            </div>
          )}
          {chartStatus==='error' && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:t.chartBg, zIndex:5, gap:8 }}>
              <span style={{ fontSize:20 }}>⚠️</span>
              <span style={{ color:t.sub, fontSize:11 }}>No data for {symbol}</span>
              <button onClick={buildChart} style={{ padding:'5px 14px', background:col, color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>Retry</button>
            </div>
          )}
          <div ref={containerRef} style={{ width:'100%', height:320 }}/>

          {/* MSS bar below chart */}
          <div className="adp-mss-bar" style={{ background:t.panel, borderTop:`1px solid ${t.border}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:t.sub, whiteSpace:'nowrap' }}>MSS Lookback</span>
            <input
              type="number" min="5" max="730" value={lookbackInput}
              onChange={e=>setLookbackInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') fetchMss(); }}
              className="adp-lb-input"
              style={{ background:t.bg, border:`1px solid ${t.border}`, color:t.text }}
              placeholder="days"
            />
            <span style={{ fontSize:10, color:t.sub }}>days</span>
            <button onClick={fetchMss} disabled={mssLoading2} className="adp-lb-btn" style={{ background:col }}>
              {mssLoading2 ? '…' : 'Calc'}
            </button>
            {mssLoading2 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:t.sub }}>
                <div style={{ width:12, height:12, border:'2px solid '+t.border, borderTopColor:col, borderRadius:'50%', animation:'esi-spin 0.7s linear infinite' }}/>
                Computing {lookbackInput}d MSS + R²…
              </div>
            )}
            {mssData && !mssLoading2 && (
              <div className="adp-mss-results">
                <span style={{ fontSize:9, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', alignSelf:'center' }}>{lookback}d →</span>
                <span className="adp-mss-pill" style={{ color:mssData.mss>=47?'#22d3ee':mssData.mss>=30?'#fbbf24':'#f87171', background:(mssData.mss>=47?'#22d3ee':mssData.mss>=30?'#fbbf24':'#f87171')+'18' }}>MSS {mssData.mss}</span>
                <span className="adp-mss-pill" style={{ color:MP_SNOW.bright, background:MP_SNOW.ice }}>R² {mssData.r_squared != null ? mssData.r_squared.toFixed(3) : '—'}</span>
                <span className="adp-mss-pill" style={{ color:'#94a3b8', background:'#f1f5f9' }}>σ {mssData.volatility != null ? mssData.volatility.toFixed(4) : '—'}</span>
                <span style={{ fontSize:10, color:mssData.color||t.sub, fontWeight:700 }}>{mssData.status}</span>
              </div>
            )}
          </div>

          {/* Show info button if panel not open */}
          {!infoOpen && (
            <button onClick={fetchInfo}
              style={{ width:'100%', padding:'9px 0', background:MP_SNOW.ice, border:'none', borderTop:`1px solid ${MP_SNOW.border}`, color:MP_SNOW.deep, fontWeight:700, fontSize:12, cursor:'pointer', transition:'background 0.14s, color 0.14s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=MP_SNOW.bright; e.currentTarget.style.color='white'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=MP_SNOW.ice; e.currentTarget.style.color=MP_SNOW.deep; }}>
              ℹ️ Show Stock Info &amp; Analyst Data
            </button>
          )}
        </div>

        {/* Right: stock info (appears when ℹ️ clicked) */}
        {infoOpen && (
          <div className="adp-info-area" style={{ background:t.panel, borderLeft:`1px solid ${t.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px 8px', borderBottom:`1px solid ${t.border}`, position:'sticky', top:0, background:t.panel, zIndex:2 }}>
              <span style={{ fontWeight:800, fontSize:13, color:t.text }}>📋 {symbol}</span>
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                {infoData && <SpeakBtn text={symbol+'. '+infoData.name+'. '+infoData.sector+'. Price: '+fmtPrice(infoData.price)+'. Change: '+(infoData.change_pct||0).toFixed(2)+' percent. Market cap: '+fmtBig(infoData.market_cap)+'. Analyst rating: '+(infoData.recommendation||'unknown')} label="🔊" style={{ fontSize:11 }}/>}
                <button onClick={()=>setInfoOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:t.sub, fontSize:16, lineHeight:1 }}>✕</button>
              </div>
            </div>
            <div style={{ padding:'12px 14px', overflowY:'auto' }}>
              {infoLoading && (
                <div style={{ display:'flex', gap:8, alignItems:'center', color:t.sub, fontSize:12, padding:'20px 0' }}>
                  <div style={{ width:14, height:14, border:`2px solid ${t.border}`, borderTopColor:col, borderRadius:'50%', animation:'esi-spin 0.7s linear infinite' }}/> Loading…
                </div>
              )}
              {infoError && <div style={{ color:'#f87171', fontSize:11 }}>⚠️ {infoError}</div>}
              {infoData && !infoLoading && (
                <div>
                  {/* Company header */}
                  <div style={{ display:'flex', gap:10, marginBottom:12, alignItems:'flex-start' }}>
                    {infoData.logo_url && <img src={infoData.logo_url} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'contain', background:'white', border:`1px solid ${t.border}`, flexShrink:0 }} onError={e=>e.target.style.display='none'}/>}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:13, color:t.text, lineHeight:1.2 }}>{infoData.name||symbol}</div>
                      <div style={{ fontSize:11, color:t.sub }}>{infoData.sector} · {infoData.industry}</div>
                      <div style={{ fontSize:11, color:t.sub }}>{infoData.exchange} · {infoData.country}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:'monospace', fontWeight:800, fontSize:14, color:infoData.change_pct>=0?'#22d3ee':'#f87171' }}>${fmtPrice(infoData.price)}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:infoData.change_pct>=0?'#22d3ee':'#f87171', background:(infoData.change_pct>=0?'#22d3ee':'#f87171')+'18', padding:'1px 6px', borderRadius:4, marginTop:2 }}>
                        {infoData.change_pct>=0?'▲':'▼'} {Math.abs(infoData.change_pct||0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  {infoData.summary && <p style={{ fontSize:11, color:t.sub, lineHeight:1.5, margin:'0 0 10px', padding:'8px 10px', background:t.bg, borderRadius:6, border:`1px solid ${t.border}`, fontStyle:'italic' }}>{infoData.summary.slice(0,300)}…</p>}
                  {/* Metrics */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px 10px', marginBottom:10 }}>
                    {[
                      ['Mkt Cap', fmtBig(infoData.market_cap)],
                      ['P/E',     infoData.pe_ratio?.toFixed(1)||'—'],
                      ['P/B',     infoData.pb_ratio?.toFixed(2)||'—'],
                      ['EPS',     infoData.eps?'$'+infoData.eps.toFixed(2):'—'],
                      ['Revenue', fmtBig(infoData.revenue)],
                      ['Gross Mgn', infoData.gross_margin?(infoData.gross_margin*100).toFixed(1)+'%':'—'],
                      ['Net Mgn',  infoData.profit_margin?(infoData.profit_margin*100).toFixed(1)+'%':'—'],
                      ['ROE',     infoData.roe?(infoData.roe*100).toFixed(1)+'%':'—'],
                      ['D/E',     infoData.debt_equity?.toFixed(2)||'—'],
                      ['Beta',    infoData.beta?.toFixed(2)||'—'],
                      ['52W Hi',  infoData.week52_high?'$'+infoData.week52_high.toFixed(2):'—'],
                      ['52W Lo',  infoData.week52_low?'$'+infoData.week52_low.toFixed(2):'—'],
                      ['Div Yld', infoData.dividend_yield?(infoData.dividend_yield*100).toFixed(2)+'%':'None'],
                      ['Employees', fmtBig(infoData.employees)],
                      ['Avg Vol', fmtBig(infoData.avg_volume)],
                    ].map(([label,val]) => (
                      <div key={label} style={{ background:t.bg, borderRadius:6, padding:'5px 8px', border:`1px solid ${t.border}` }}>
                        <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.07em', color:t.sub, fontWeight:700 }}>{label}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:t.text, fontFamily:'monospace' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Analyst targets */}
                  {(infoData.target_mean || infoData.recommendation) && (
                    <div style={{ background:`${col}0d`, border:`1px solid ${col}33`, borderRadius:8, padding:'8px 10px' }}>
                      <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:col, marginBottom:6 }}>Analyst Targets</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(70px,1fr))', gap:6 }}>
                        {infoData.target_low  && <div style={{ background:t.bg, borderRadius:5, padding:'4px 7px' }}><div style={{ fontSize:9, color:t.sub }}>Low</div><div style={{ fontSize:12, fontWeight:700, color:t.text, fontFamily:'monospace' }}>${infoData.target_low.toFixed(2)}</div></div>}
                        {infoData.target_mean && <div style={{ background:t.bg, borderRadius:5, padding:'4px 7px' }}><div style={{ fontSize:9, color:t.sub }}>Mean</div><div style={{ fontSize:12, fontWeight:800, color:col, fontFamily:'monospace' }}>${infoData.target_mean.toFixed(2)}</div></div>}
                        {infoData.target_high && <div style={{ background:t.bg, borderRadius:5, padding:'4px 7px' }}><div style={{ fontSize:9, color:t.sub }}>High</div><div style={{ fontSize:12, fontWeight:700, color:t.text, fontFamily:'monospace' }}>${infoData.target_high.toFixed(2)}</div></div>}
                        {infoData.recommendation && <div style={{ background:t.bg, borderRadius:5, padding:'4px 7px' }}><div style={{ fontSize:9, color:t.sub }}>Rating</div><div style={{ fontSize:12, fontWeight:800, color:col }}>{infoData.recommendation.toUpperCase()}</div></div>}
                        {infoData.analyst_count && <div style={{ background:t.bg, borderRadius:5, padding:'4px 7px' }}><div style={{ fontSize:9, color:t.sub }}>Analysts</div><div style={{ fontSize:12, fontWeight:700, color:t.text }}>{infoData.analyst_count}</div></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>{/* adp-body-row */}

      {/* ── AI Analysis Panel — full width below chart row ── */}
      {aiOpen && (
        <div className="adp-ai-panel" style={{ background:t.panel, borderTop:`2px solid #7c3aed` }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${t.border}` }}>
            <span style={{ fontSize:15 }}>🤖</span>
            <span style={{ fontWeight:800, fontSize:13, color:'#7c3aed' }}>AI Analysis — {symbol}</span>
            {aiData && <span style={{ fontSize:10, color:t.sub, marginLeft:'auto' }}>Generated {aiData.fetchedAt}</span>}
            {aiData && <SpeakBtn text={aiData.text} label="🔊" style={{ background:'#7c3aed22', borderColor:'#7c3aed44', color:'#7c3aed' }}/>}
            <button onClick={() => setAiOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:t.sub, fontSize:16, lineHeight:1 }}>✕</button>
          </div>

          {/* Loading */}
          {aiLoading && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'24px 20px', color:'#7c3aed' }}>
              <div style={{ width:18, height:18, border:'2.5px solid #ede9fe', borderTopColor:'#7c3aed', borderRadius:'50%', animation:'esi-spin 0.7s linear infinite', flexShrink:0 }}/>
              <span style={{ fontSize:13, fontWeight:600 }}>Fetching news &amp; generating analysis with GPT-4o-mini…</span>
            </div>
          )}

          {/* Error */}
          {aiError && !aiLoading && (
            <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color:'#f87171', fontSize:12 }}>⚠️ {aiError}</span>
              <button onClick={()=>{ setAiData(null); fetchAiAnalysis(); }} style={{ padding:'4px 12px', background:'#7c3aed', color:'white', border:'none', borderRadius:6, cursor:'pointer', fontSize:11, fontWeight:700 }}>Retry</button>
            </div>
          )}

          {/* Content */}
          {aiData && !aiLoading && (
            <div style={{ padding:'14px 18px' }}>
              <AiSectionRenderer text={aiData.text} theme={t} />
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4 }}>
                <button onClick={()=>{ setAiData(null); fetchAiAnalysis(); }}
                  style={{ padding:'5px 14px', background:'#7c3aed22', border:'1px solid #7c3aed44', borderRadius:7, color:'#7c3aed', fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.14s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#7c3aed'; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#7c3aed22'; e.currentTarget.style.color='#7c3aed'; }}>
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ─── MP COMPARE MODAL ────────────────────────────────────────────────────────
function MpCompareModal({ symA, symB, score, baseUrl, onClose }) {
  const [layout,   setLayout]   = useState('side'); // 'side' | 'stack'
  const [tf,       setTf]       = useState('1D');
  const [theme,    setTheme]    = useState('dark');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 700);

  const t   = ADP_THEMES[theme] || ADP_THEMES.dark;
  const col = ADP_CHART_COLOR[theme] || '#38bdf8';
  const sc  = score > 0.5 ? '#22d3ee' : score < -0.5 ? '#f87171' : '#94a3b8';

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const TFS = ['5m','1H','1D','1W','1M'];
  // isStack: mobile always stacks; desktop follows user choice
  const isStack = isMobile ? true : layout === 'stack';

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:10000, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? 0 : 16 }}
    >
      <div style={{ display:'flex', flexDirection:'column', width:'100%', maxWidth:1300, height: isMobile ? '100dvh' : '88vh', borderRadius: isMobile ? 0 : 14, overflow:'hidden', background:t.bg, border:'1.5px solid '+t.border, boxShadow:'0 40px 100px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'10px 14px', background:t.panel, borderBottom:'1.5px solid '+t.border, flexShrink:0 }}>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:800, fontSize:13, color:'#22d3ee' }}>{symA}</span>
          <span style={{ color:t.sub, fontSize:12 }}>↔</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontWeight:800, fontSize:13, color:'#f87171' }}>{symB}</span>
          <span style={{ padding:'2px 9px', borderRadius:7, background:sc+'22', border:'1px solid '+sc+'44', color:sc, fontFamily:'monospace', fontSize:11, fontWeight:800 }}>
            ρ {score >= 0 ? '+' : ''}{score.toFixed(3)}
          </span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            {/* Timeframe */}
            <div style={{ display:'flex', gap:2, background:t.bg, borderRadius:7, padding:2, border:'1px solid '+t.border }}>
              {TFS.map(tfl => (
                <button key={tfl} onClick={() => setTf(tfl)}
                  style={{ padding:'3px 8px', border:'none', borderRadius:5, cursor:'pointer', fontFamily:"'IBM Plex Mono',monospace", fontSize:10, fontWeight:700, background: tf===tfl ? col : 'transparent', color: tf===tfl ? (theme==='dark'?'#0f172a':'white') : t.sub, transition:'all 0.12s' }}>
                  {tfl}
                </button>
              ))}
            </div>
            {/* Theme */}
            <div style={{ display:'flex', gap:2, background:t.bg, borderRadius:7, padding:2, border:'1px solid '+t.border }}>
              {[['light','☀️'],['dark','🌙'],['hud','⬡']].map(([th,ic]) => (
                <button key={th} onClick={() => setTheme(th)}
                  style={{ padding:'3px 8px', border:'none', borderRadius:5, cursor:'pointer', fontSize:11, fontWeight:700, background: theme===th ? t.border : 'transparent', color:t.text, transition:'all 0.12s' }}>
                  {ic}
                </button>
              ))}
            </div>
            {/* Layout toggle — desktop only */}
            {!isMobile && (
              <button onClick={() => setLayout(l => l==='side'?'stack':'side')}
                style={{ padding:'4px 10px', border:'1px solid '+t.border, borderRadius:7, background:t.panel, color:t.sub, cursor:'pointer', fontSize:12, fontWeight:700 }}
                title="Toggle layout">
                {layout==='side' ? '⬒ Stack' : '⬓ Side'}
              </button>
            )}
            <button onClick={onClose} style={{ padding:'4px 10px', border:'1px solid '+t.border, borderRadius:7, background:t.panel, color:t.sub, cursor:'pointer', fontSize:15, fontWeight:700, lineHeight:1 }}>✕</button>
          </div>
        </div>

        {/* Charts — side by side OR stacked. Each column scrolls independently. */}
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection: isStack ? 'column' : 'row' }}>
          <div style={{ flex:1, minHeight:0, minWidth:0, overflowY:'auto', overflowX:'hidden', borderRight: isStack ? 'none' : '1px solid '+t.border, borderBottom: isStack ? '1px solid '+t.border : 'none' }}>
            <AssetDetailPanel key={'cmp-a-'+symA} symbol={symA} baseUrl={baseUrl} defaultLookback={60} embedded onClose={()=>{}} />
          </div>
          <div style={{ flex:1, minHeight:0, minWidth:0, overflowY:'auto', overflowX:'hidden' }}>
            <AssetDetailPanel key={'cmp-b-'+symB} symbol={symB} baseUrl={baseUrl} defaultLookback={60} embedded onClose={()=>{}} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GLOBAL MARKET SCAN ──────────────────────────────────────────────────────

const GLOBAL_SCAN_MARKETS = [
  { id:'usa',       label:'United States',    flag:'🇺🇸', index:'^GSPC'    },
  { id:'korea',     label:'South Korea',      flag:'🇰🇷', index:'^KS11'    },
  { id:'japan',     label:'Japan',            flag:'🇯🇵', index:'^N225'    },
  { id:'uk',        label:'United Kingdom',   flag:'🇬🇧', index:'^FTSE'    },
  { id:'germany',   label:'Germany',          flag:'🇩🇪', index:'^GDAXI'   },
  { id:'france',    label:'France',           flag:'🇫🇷', index:'^FCHI'    },
  { id:'china',     label:'China (HK)',       flag:'🇨🇳', index:'^HSI'     },
  { id:'australia', label:'Australia',        flag:'🇦🇺', index:'^AXJO'    },
  { id:'canada',    label:'Canada',           flag:'🇨🇦', index:'^GSPTSE'  },
  { id:'india',     label:'India',            flag:'🇮🇳', index:'^BSESN'   },
  { id:'brazil',    label:'Brazil',           flag:'🇧🇷', index:'^BVSP'    },
];

const SCAN_PERIODS = [
  { value:'1wk',  label:'1W'  },
  { value:'1mo',  label:'1M'  },
  { value:'3mo',  label:'3M'  },
  { value:'6mo',  label:'6M'  },
  { value:'1y',   label:'1Y'  },
];

function GlobalMarketScan({ baseUrl }) {
  const [open,        setOpen]        = useState(false);
  const [activeMarket,setActiveMarket]= useState(null);   // market id string
  const [period,      setPeriod]      = useState('1mo');
  const [topN,        setTopN]        = useState(15);
  const [loading,     setLoading]     = useState(false);
  const [data,        setData]        = useState(null);   // last scan result
  const [error,       setError]       = useState('');
  // Cache: { [`${market}-${period}`]: result }
  const [cache,       setCache]       = useState({});
  // Which stock panels are open — reuse AssetDetailPanel
  const [openPanels,  setOpenPanels]  = useState(new Set());

  const togglePanel = (sym) => setOpenPanels(p => {
    const n = new Set(p); n.has(sym) ? n.delete(sym) : n.add(sym); return n;
  });



  // Sentiment modal state
const [sentimentOpen,   setSentimentOpen]   = useState(false);
const [sentimentMarket, setSentimentMarket] = useState(null); // the data object
const [includeStocks,   setIncludeStocks]   = useState(false);
const [gsmCopied,       setGsmCopied]       = useState(false);
const [gsmPasteOpen,    setGsmPasteOpen]    = useState(false);
const [gsmPasteText,    setGsmPasteText]    = useState('');
const [gsmParseError,   setGsmParseError]   = useState(null);
const [gsmAnalysis,     setGsmAnalysis]     = useState(null); // parsed result, keyed by market id

// Per-stock sentiment state
const [stockSentimentOpen,   setStockSentimentOpen]   = useState(false);
const [stockSentimentTarget, setStockSentimentTarget] = useState(null); // { stock, marketData }
const [stockCopied,          setStockCopied]          = useState(false);
const [stockPasteOpen,       setStockPasteOpen]       = useState(false);
const [stockPasteText,       setStockPasteText]       = useState('');
const [stockParseError,      setStockParseError]      = useState(null);
// Cache: { [symbol]: parsedAnalysis }
const [stockAnalysisCache,   setStockAnalysisCache]   = useState({});
const [showAllCharts,    setShowAllCharts]    = useState(false);
const [chartsRendered,   setChartsRendered]   = useState(0);  // stagger counter

  useEffect(() => {
    if (!showAllCharts || !data?.results?.length) return;

    // Reset counter first
    setChartsRendered(0);

    // Stagger: reveal one chart every 400ms so LWC has time to mount each one
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setChartsRendered(i);
      if (i >= data.results.length) clearInterval(interval);
    }, 400);

    return () => clearInterval(interval);
  }, [showAllCharts, data]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const scan = async (marketId, per) => {
    const key = `${marketId}-${per}`;
    // Use cache if available
    if (cache[key]) { setData(cache[key]); setActiveMarket(marketId); return; }

    setLoading(true);
    setError('');
    setData(null);
    setActiveMarket(marketId);
    setOpenPanels(new Set());
    setShowAllCharts(false);
    setChartsRendered(0);

    try {
      const res = await fetch(`${baseUrl}/api/global_market_scan_v1/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ market: marketId, period: per, top_n: topN }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Scan failed');
      setData(json);
      setCache(c => ({ ...c, [key]: json }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-scan when period changes and a market is already selected
  const handlePeriodChange = (per) => {
    setPeriod(per);
    if (activeMarket) scan(activeMarket, per);
  };

  const fmtCap = (v) => {
    if (!v) return '—';
    if (v >= 1e12) return (v/1e12).toFixed(1)+'T';
    if (v >= 1e9)  return (v/1e9).toFixed(1)+'B';
    if (v >= 1e6)  return (v/1e6).toFixed(0)+'M';
    return v.toLocaleString();
  };

  const fmtPrice = (v, ccy) => {
    if (!v) return '—';
    const formatted = v >= 1000
      ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
      : v >= 1 ? v.toFixed(2)
      : v.toFixed(4);
    return `${formatted} ${ccy || ''}`;
  };

  const buildGlobalScanPrompt = (marketData, includeStocks) => {
  if (!marketData) return '';

  const periodLabel = SCAN_PERIODS.find(p => p.value === marketData.period)?.label || marketData.period;

  // Build top performers block
  const topBlock = marketData.results
    .slice(0, 15)
    .map((s, i) => `${i + 1}. ${s.symbol} — ${s.name} | Return: ${s.return_pct >= 0 ? '+' : ''}${s.return_pct.toFixed(2)}% | Price: ${s.current_price} ${s.currency}${s.sector && s.sector !== '—' ? ' | Sector: ' + s.sector : ''}${s.market_cap ? ' | MCap: ' + (s.market_cap >= 1e12 ? (s.market_cap/1e12).toFixed(1)+'T' : s.market_cap >= 1e9 ? (s.market_cap/1e9).toFixed(1)+'B' : (s.market_cap/1e6).toFixed(0)+'M') : ''}`)
    .join('\n');

  // Full ticker list for the "include stocks" mode
  const fullTickerList = marketData.results.map(s => s.symbol).join(', ');

  const stockSearchBlock = includeStocks
    ? `\nSTOCKS TO RESEARCH INDIVIDUALLY:\n${fullTickerList}\n\nFor each of these stocks, search for recent news, earnings reports, analyst upgrades/downgrades, and any material catalysts or risks. You MUST include a "stockPicks" array in your JSON response (see schema below) with your top 5 investment opportunities from this list, each with a recommendation and reasoning.`
    : '';

  const stockPicksField = includeStocks
    ? `,\n  "stockPicks": [\n    {\n      "symbol": "<ticker>",\n      "name": "<company name>",\n      "rec": "BUY" | "HOLD" | "WATCH" | "AVOID",\n      "thesis": "<2-3 sentence investment thesis>",\n      "risk": "<main risk in one sentence>"\n    }\n  ]`
    : '';

  return `You are a professional global equity analyst and market researcher. I need a comprehensive sentiment and opportunity analysis for the ${marketData.label} stock market.

MARKET DATA (${periodLabel} timeframe):
- Index: ${marketData.index_symbol}
- Market: ${marketData.label} ${marketData.flag}
- Currency: ${marketData.currency}
- Period analysed: ${periodLabel}
- Universe scanned: ${marketData.scanned} stocks, ${marketData.found} returned data

TOP ${marketData.results.length} PERFORMERS (${periodLabel}):
${topBlock}
${stockSearchBlock}

YOUR TASK:
Search for as many recent news articles as possible — aim for 15-20+ sources. Cover Bloomberg, Reuters, WSJ, CNBC, Financial Times, local financial media for ${marketData.label}, and sector-specific publications.

Search for: overall market sentiment in ${marketData.label}, macroeconomic conditions, central bank policy, currency trends affecting ${marketData.currency}, sector rotation, foreign institutional flows, geopolitical factors, and any major corporate or regulatory events affecting the market.

After reading all articles, return ONLY a JSON object — no markdown, no backticks, no preamble:

{
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "tldr": "<one punchy sentence — the single most important thing happening in ${marketData.label} markets right now>",
  "themes": ["<theme1>", "<theme2>", "<theme3>", "<theme4>"],
  "summary": "<4-6 paragraph deep analysis. Reference specific articles and data points. Use **bold** for key figures and turning points. Cover: current market momentum, key macro drivers, sector leaders/laggards, risks, and forward outlook.>",
  "catalysts": ["<catalyst 1>", "<catalyst 2>", "<catalyst 3>", "<catalyst 4>"],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "recommendation": "<a sharp, opinionated 2-3 sentence take on the overall market. First person. Be direct about whether this market is worth allocating to right now.>",
  "articleCount": <number of articles you actually found and read>,
  "sourceList": ["<source1>", "<source2>", "<source3>"]${stockPicksField}
}

Return only the JSON object. It must be parseable by JSON.parse() with no surrounding text.`;
};

const buildStockPrompt = (stock, marketData) => {
  if (!stock || !marketData) return '';

  const periodLabel = SCAN_PERIODS.find(p => p.value === marketData.period)?.label || marketData.period;

  // Find rank in the scan results
  const rank = marketData.results.findIndex(s => s.symbol === stock.symbol) + 1;

  // Find peers from same sector in the scan results
  const peers = marketData.results
    .filter(s => s.symbol !== stock.symbol && s.sector === stock.sector && s.sector && s.sector !== '—')
    .slice(0, 4)
    .map(s => `${s.symbol} (${s.return_pct >= 0 ? '+' : ''}${s.return_pct.toFixed(2)}%)`)
    .join(', ');

  return `You are a professional equity analyst specialising in ${marketData.label} stocks. I need a deep investment analysis for ${stock.symbol} — ${stock.name}.

STOCK DATA:
- Symbol: ${stock.symbol}
- Company: ${stock.name}
- Market: ${marketData.label} ${marketData.flag} (${marketData.index_symbol})
- Currency: ${stock.currency || marketData.currency}
- Current Price: ${stock.current_price} ${stock.currency || marketData.currency}
- Return (${periodLabel}): ${stock.return_pct >= 0 ? '+' : ''}${stock.return_pct.toFixed(2)}%
- Ranked #${rank} of ${marketData.results.length} top performers in ${marketData.label} scan
${stock.sector && stock.sector !== '—' ? `- Sector: ${stock.sector}` : ''}
${stock.market_cap ? `- Market Cap: ${stock.market_cap >= 1e12 ? (stock.market_cap/1e12).toFixed(1)+'T' : stock.market_cap >= 1e9 ? (stock.market_cap/1e9).toFixed(1)+'B' : (stock.market_cap/1e6).toFixed(0)+'M'} ${stock.currency || marketData.currency}` : ''}
${peers ? `- Sector peers in scan: ${peers}` : ''}

YOUR TASK:
Search extensively for recent information on ${stock.symbol} / ${stock.name}. Aim for 10-15+ sources including:
- Recent earnings reports and guidance
- Analyst upgrades/downgrades and price target changes
- News about the company in the last 30-90 days
- Competitive position and sector trends in ${marketData.label}
- Any macro factors specific to ${marketData.label} affecting this stock
- Institutional ownership changes, insider activity
- Technical momentum context (the stock is up ${stock.return_pct.toFixed(2)}% over ${periodLabel})

After reading all sources, return ONLY a JSON object — no markdown, no backticks, no preamble:

{
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "rec": "BUY" | "HOLD" | "WATCH" | "AVOID",
  "targetUpside": <estimated % upside/downside as a number, e.g. 15.5 for +15.5%, negative for downside>,
  "tldr": "<one punchy sentence — the single most important thing about ${stock.symbol} right now>",
  "companySnapshot": "<2-3 sentences on what ${stock.name} actually does and its competitive position>",
  "themes": ["<theme1>", "<theme2>", "<theme3>"],
  "summary": "<4-5 paragraph deep analysis. Reference specific earnings, analyst calls, news events. Use **bold** for key figures. Cover: recent momentum, fundamental picture, competitive position, sector tailwinds/headwinds, outlook.>",
  "catalysts": ["<catalyst 1>", "<catalyst 2>", "<catalyst 3>"],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "recommendation": "<sharp, opinionated 2-3 sentence investment take. First person. Would you buy this right now and why/why not?>",
  "analystConsensus": "<what the analyst community is saying — consensus rating and average target if findable, or 'Data not found'>",
  "articleCount": <number of sources consulted>,
  "sourceList": ["<source1>", "<source2>", "<source3>"]
}

Return only the JSON object. It must be parseable by JSON.parse() with no surrounding text.`;
};

  return (
    <>
      {/* ── TRIGGER BUTTON ── */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '11px 22px', margin: '0 0 16px',
          background: 'linear-gradient(135deg, #1d4ed8, #6366f1)',
          color: 'white', border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(99,102,241,0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.4)'; }}
      >
        🌍 Global Market Scan
        <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '1px 8px', fontSize: 10, fontWeight: 800 }}>
          {GLOBAL_SCAN_MARKETS.length} MARKETS
        </span>
      </button>

      {/* ── MODAL ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: window.innerWidth < 700 ? 0 : 16,
          }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', maxWidth: 1200,
            height: window.innerWidth < 700 ? '100dvh' : '92vh',
            maxHeight: window.innerWidth < 700 ? '100dvh' : 940,
            borderRadius: window.innerWidth < 700 ? 0 : 18,
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
            border: '1.5px solid #e0e7ff',
            animation: 'esi-modal-in 0.18s ease',
          }}>

            {/* ── HEADER ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
              padding: '12px 16px', flexShrink: 0,
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              borderBottom: '1.5px solid #4338ca',
            }}>
              <span style={{ fontSize: 20 }}>🌍</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#e0e7ff' }}>Global Market Scan</span>
              <span style={{ fontSize: 11, color: '#a5b4fc' }}>Top performers by country/bloc</span>

              {/* Period pills */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 3, background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 3 }}>
                {SCAN_PERIODS.map(p => (
                  <button key={p.value} onClick={() => handlePeriodChange(p.value)}
                    style={{
                      padding: '4px 10px', border: 'none', borderRadius: 6, cursor: 'pointer',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
                      background: period === p.value ? '#6366f1' : 'transparent',
                      color: period === p.value ? '#fff' : '#a5b4fc',
                      transition: 'all 0.12s',
                    }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Top N selector */}
              <select value={topN} onChange={e => setTopN(parseInt(e.target.value))}
                style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #4338ca', background: '#312e81', color: '#ffffff', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                {[10,15,20,25,30].map(n => <option key={n} value={n} style={{ background: '#1e1b4b', color: '#ffffff' }}>Top {n}</option>)}
              </select>

              <button onClick={() => setOpen(false)}
                style={{ padding: '5px 11px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 7, background: 'rgba(255,255,255,0.08)', color: '#a5b4fc', cursor: 'pointer', fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                ✕
              </button>
            </div>

            {/* ── MARKET SELECTOR GRID ── */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 14px',
              background: '#f5f3ff', borderBottom: '1.5px solid #e0e7ff', flexShrink: 0,
            }}>
              {GLOBAL_SCAN_MARKETS.map(m => (
                <button key={m.id}
                  onClick={() => scan(m.id, period)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 13px', border: '2px solid',
                    borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                    borderColor: activeMarket === m.id ? '#6366f1' : '#c7d2fe',
                    background: activeMarket === m.id ? '#6366f1' : 'white',
                    color: activeMarket === m.id ? 'white' : '#4338ca',
                    opacity: loading ? 0.6 : 1,
                    boxShadow: activeMarket === m.id ? '0 3px 12px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  <span role="img" aria-label={m.label}
                    style={{ fontSize: 18, lineHeight: 1, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla',sans-serif" }}>
                    {m.flag}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── BODY ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#fafafa' }}>

              {/* Loading */}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 14, color: '#6366f1' }}>
                  <div style={{ width: 36, height: 36, border: '3.5px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'esi-spin 0.7s linear infinite' }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    Scanning {GLOBAL_SCAN_MARKETS.find(m => m.id === activeMarket)?.flag} {GLOBAL_SCAN_MARKETS.find(m => m.id === activeMarket)?.label}…
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>Fetching {topN}+ stocks via yfinance — takes ~8s</span>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>
                  ⚠️ {error}
                  <button onClick={() => scan(activeMarket, period)} style={{ marginLeft: 12, padding: '4px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Retry</button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !data && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 12, color: '#94a3b8' }}>
                  <span style={{ fontSize: 40 }}>🌍</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>Select a market above to scan</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', maxWidth: 340 }}>
                    Each scan fetches live yfinance data for 25–40 stocks, ranks them by {SCAN_PERIODS.find(p => p.value === period)?.label} return, and shows you the top {topN} performers.
                  </span>
                </div>
              )}

              {/* Results */}
              {data && !loading && (
                <>
                  {/* Result header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span role="img" aria-label={data.label}
                      style={{ fontSize: 28, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla',sans-serif" }}>
                      {data.flag}
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: '#1e1b4b' }}>{data.label}</div>
                      <div style={{ fontSize: 11, color: '#6366f1' }}>
                        Scanned {data.scanned} stocks · {data.found} returned data · Top {data.results.length} by {SCAN_PERIODS.find(p => p.value === data.period)?.label} return
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '4px 10px', background: '#ede9fe', color: '#6d28d9', borderRadius: 20, fontWeight: 700 }}>
                        Index: {data.index_symbol}
                      </span>
                      <span style={{ fontSize: 11, padding: '4px 10px', background: '#f0f9ff', color: '#0369a1', borderRadius: 20, fontWeight: 700 }}>
                        CCY: {data.currency}
                      </span>
                    </div>
                  </div>

                   {/* AI Sentiment button + Include Stocks toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setSentimentMarket(data);
                        setIncludeStocks(false);
                        setGsmAnalysis(prev => ({ ...prev, [data.market]: null }));
                        setSentimentOpen(true);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                        color: 'white', border: 'none', borderRadius: 9,
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 3px 12px rgba(124,58,237,0.35)',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 18px rgba(124,58,237,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(124,58,237,0.35)'; }}
                    >
                      🤖 AI Sentiment — {data.flag} {data.label}
                    </button>

                    {/* Include Stocks toggle — only shown after scan */}
                    <button
                      onClick={() => setIncludeStocks(s => !s)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 9, cursor: 'pointer',
                        border: `2px solid ${includeStocks ? '#6366f1' : '#c7d2fe'}`,
                        background: includeStocks ? '#ede9fe' : 'white',
                        color: includeStocks ? '#4338ca' : '#94a3b8',
                        fontSize: 12, fontWeight: 700, transition: 'all 0.14s',
                      }}
                    >
                      <span style={{
                        width: 16, height: 16, borderRadius: 4, border: '2px solid',
                        borderColor: includeStocks ? '#6366f1' : '#c7d2fe',
                        background: includeStocks ? '#6366f1' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: 'white', transition: 'all 0.12s', flexShrink: 0,
                      }}>
                        {includeStocks ? '✓' : ''}
                      </span>
                      Include Stocks
                      {includeStocks && <span style={{ fontSize: 10, background: '#6366f1', color: 'white', padding: '1px 6px', borderRadius: 4 }}>ON — AI will research each stock</span>}
                    </button>

                    <button
                      onClick={() => {
                        if (showAllCharts) {
                          // Collapse all
                          setShowAllCharts(false);
                          setChartsRendered(0);
                          setOpenPanels(new Set());
                        } else {
                          // Expand all — close any individually opened panels first
                          setOpenPanels(new Set());
                          setShowAllCharts(true);
                        }
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 9, cursor: 'pointer',
                        border: `2px solid ${showAllCharts ? '#0ea5e9' : '#bae6fd'}`,
                        background: showAllCharts ? '#0ea5e9' : 'white',
                        color: showAllCharts ? 'white' : '#0369a1',
                        fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                      }}
                    >
                      {showAllCharts ? '📉 Hide All Charts' : '📈 Show All Charts'}
                      {!showAllCharts && data?.results?.length && (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                          {data.results.length}
                        </span>
                      )}
                      {showAllCharts && chartsRendered < data?.results?.length && (
                        <span style={{ fontSize: 10, opacity: 0.8 }}>
                          {chartsRendered}/{data.results.length}
                        </span>
                      )}
                    </button>

                    {gsmAnalysis?.[data.market] && (
                      <span style={{ fontSize: 11, color: '#7c3aed', background: '#f5f3ff', padding: '4px 10px', borderRadius: 20, border: '1px solid #ddd6fe', fontWeight: 700 }}>
                        ✓ Analysis cached
                      </span>
                    )}
                  </div>

                  {/* Stock cards grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {data.results.map((stock, rank) => {
                      const isPanelOpen = openPanels.has(stock.symbol) || (showAllCharts && rank < chartsRendered);
                      const retColor = stock.return_pct >= 0 ? '#16a34a' : '#dc2626';
                      const retBg    = stock.return_pct >= 0 ? '#dcfce7' : '#fee2e2';
                      return (
                        <div key={stock.symbol} style={{ gridColumn: isPanelOpen ? '1 / -1' : 'auto' }}>
                          {/* Card */}
                          <div style={{
                            background: 'white', borderRadius: 12,
                            border: `1.5px solid ${isPanelOpen ? '#6366f1' : '#e2e8f0'}`,
                            padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
                            boxShadow: isPanelOpen ? '0 0 0 3px rgba(99,102,241,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
                            transition: 'all 0.15s',
                          }}>
                            {/* Row 1: rank + symbol + return */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: rank === 0 ? '#fbbf24' : rank === 1 ? '#94a3b8' : rank === 2 ? '#b45309' : '#e0e7ff',
                                color: rank < 3 ? 'white' : '#6366f1',
                                fontSize: 10, fontWeight: 800,
                              }}>
                                {rank + 1}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, fontSize: 13, color: '#1e1b4b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {stock.symbol}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {stock.name}
                                </div>
                              </div>
                              <span style={{ background: retBg, color: retColor, fontWeight: 800, fontSize: 13, fontFamily: 'monospace', padding: '3px 9px', borderRadius: 8, flexShrink: 0 }}>
                                {stock.return_pct >= 0 ? '+' : ''}{stock.return_pct.toFixed(2)}%
                              </span>
                            </div>

                            {/* Row 2: price + sector + market cap */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569', background: '#f8fafc', padding: '2px 7px', borderRadius: 5, border: '1px solid #e2e8f0' }}>
                                {fmtPrice(stock.current_price, stock.currency)}
                              </span>
                              {stock.sector && stock.sector !== '—' && (
                                <span style={{ fontSize: 10, background: '#ede9fe', color: '#6d28d9', padding: '2px 7px', borderRadius: 5, fontWeight: 600, border: '1px solid #ddd6fe' }}>
                                  {stock.sector}
                                </span>
                              )}
                              {stock.market_cap && (
                                <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto', fontFamily: 'monospace' }}>
                                  {fmtCap(stock.market_cap)}
                                </span>
                              )}
                            </div>

                            {/* Row 3: action buttons */}
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span role="img" aria-label={data.label}
                                style={{ fontSize: 18, lineHeight: 1, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>
                                {data.flag}
                              </span>

                              {/* AI analysis button */}
                              <button
                                onClick={() => {
                                  setStockSentimentTarget({ stock, marketData: data });
                                  setStockParseError(null);
                                  setStockSentimentOpen(true);
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  padding: '5px 10px', borderRadius: 7, cursor: 'pointer',
                                  border: '1.5px solid #ddd6fe',
                                  background: stockAnalysisCache[stock.symbol] ? '#7c3aed' : '#f5f3ff',
                                  color: stockAnalysisCache[stock.symbol] ? 'white' : '#7c3aed',
                                  fontSize: 11, fontWeight: 700, transition: 'all 0.14s',
                                }}
                                title="Get AI analysis for this stock"
                              >
                                🤖 {stockAnalysisCache[stock.symbol] ? 'View Analysis' : 'AI Analysis'}
                              </button>

                              {/* Chart button */}
                              <button
                                onClick={() => togglePanel(stock.symbol)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  padding: '5px 12px', borderRadius: 7, border: '1.5px solid',
                                  borderColor: isPanelOpen ? '#6366f1' : '#c7d2fe',
                                  background: isPanelOpen ? '#6366f1' : '#ede9fe',
                                  color: isPanelOpen ? 'white' : '#4338ca',
                                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                  transition: 'all 0.14s',
                                }}
                              >
                                📊 {isPanelOpen && !showAllCharts ? 'Close' : isPanelOpen ? 'Showing' : 'Chart'}
                              </button>
                            </div>
                          </div>

                          {/* Expandable AssetDetailPanel — reuses your existing component */}
                          {isPanelOpen && (
                            <div style={{ marginTop: 4, border: '1.5px solid #6366f1', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}>
                              <AssetDetailPanel
                                key={`gms-panel-${stock.symbol}`}
                                symbol={stock.symbol}
                                baseUrl={baseUrl}
                                defaultLookback={60}
                                embedded
                                onClose={() => togglePanel(stock.symbol)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: 16, padding: '10px 14px', background: '#f5f3ff', border: '1px solid #e0e7ff', borderRadius: 10, fontSize: 11, color: '#6d28d9', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span>📡 Data via yfinance · {data.failed > 0 ? `${data.failed} tickers had no data` : 'All tickers returned data'}</span>
                    <span>Scanned at {new Date().toLocaleTimeString()} · Period: {data.period}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── GLOBAL SCAN SENTIMENT MODAL ── */}
      {sentimentOpen && sentimentMarket && (
        <div
          onClick={() => setSentimentOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10010,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, backdropFilter: 'blur(5px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(720px, 100%)', maxHeight: '90vh',
              borderRadius: 18, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              background: '#fff',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
              animation: 'esi-modal-in 0.2s ease',
            }}
          >
            {/* Header */}
            <div style={{ padding: '18px 22px 14px', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 20, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>
                      {sentimentMarket.flag}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                      AI Sentiment — {sentimentMarket.label}
                    </span>
                    {includeStocks && (
                      <span style={{ fontSize: 10, background: '#7c3aed', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                        + {sentimentMarket.results.length} stocks
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                    Copy prompt → paste into any AI → copy their JSON → hit Paste Response
                  </div>
                </div>
                <button
                  onClick={() => setSentimentOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >×</button>
              </div>

              {/* Include stocks toggle inside modal too */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setIncludeStocks(s => !s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${includeStocks ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`,
                    background: includeStocks ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.08)',
                    color: includeStocks ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                    fontSize: 12, fontWeight: 700, transition: 'all 0.14s',
                  }}
                >
                  {includeStocks ? '✓' : '○'} Include {sentimentMarket.results.length} scanned stocks in analysis
                </button>
                {includeStocks && (
                  <span style={{ fontSize: 11, color: '#a78bfa' }}>
                    AI will research each stock + return top picks
                  </span>
                )}
              </div>
            </div>

            {/* Prompt preview */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              <div style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                padding: 14, fontSize: 11.5, lineHeight: 1.7, color: '#334155',
                fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {buildGlobalScanPrompt(sentimentMarket, includeStocks)}
              </div>

              {/* Perplexity tip */}
              <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(32,178,170,0.07)', border: '1px solid rgba(32,178,170,0.25)', borderRadius: 9, display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                <div style={{ fontSize: 12, color: '#0f766e', lineHeight: 1.55 }}>
                  <strong>Perplexity is best here</strong> — real-time web search across global financial media. For {sentimentMarket.label}, it'll pull local sources too.
                </div>
              </div>

              {/* Parsed analysis — shown after pasting */}
              {gsmAnalysis?.[sentimentMarket.market] && (() => {
                const parsed = gsmAnalysis[sentimentMarket.market];
                const bColors = { BULLISH:'#10b981', BEARISH:'#ef4444', NEUTRAL:'#f59e0b', MIXED:'#2563eb' };
                const bIcons  = { BULLISH:'📈', BEARISH:'📉', NEUTRAL:'➡️', MIXED:'🔀' };
                const bc = bColors[parsed.bias] || '#2563eb';
                return (
                  <div id="gsm-parsed-result" style={{ marginTop: 16 }}>
                    <div style={{ padding: '14px 16px', background: bc+'10', border: `2px solid ${bc}30`, borderLeft: `4px solid ${bc}`, borderRadius: 12, marginBottom: 12 }}>
                      {/* Bias + confidence */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16 }}>{bIcons[parsed.bias]}</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: bc }}>{parsed.bias}</span>
                        <span style={{ background: bc, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>{parsed.confidence}% confidence</span>
                        {parsed.articleCount && <span style={{ fontSize: 11, color: '#888' }}>· {parsed.articleCount} articles</span>}
                      </div>
                      <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>{parsed.tldr}</div>

                      {/* Themes */}
                      {parsed.themes?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                          {parsed.themes.map((t, i) => (
                            <span key={i} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Summary */}
                      {parsed.summary && (
                        <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7, background: '#fff', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10 }}
                          dangerouslySetInnerHTML={{ __html: parsed.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                        />
                      )}

                      {/* Catalysts + Risks */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        {parsed.catalysts?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.07em', marginBottom: 6 }}>🚀 CATALYSTS</div>
                            {parsed.catalysts.map((c, i) => (
                              <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 4, display: 'flex', gap: 6 }}>
                                <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{i+1}.</span>{c}
                              </div>
                            ))}
                          </div>
                        )}
                        {parsed.risks?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: '0.07em', marginBottom: 6 }}>⚠️ RISKS</div>
                            {parsed.risks.map((r, i) => (
                              <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 4, display: 'flex', gap: 6 }}>
                                <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>▼</span>{r}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recommendation */}
                      {parsed.recommendation && (
                        <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '3px solid #2563eb', borderRadius: 8, fontSize: 13, color: '#1e3a5f', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>
                          {parsed.recommendation}
                        </div>
                      )}

                      {/* Stock picks — only present if includeStocks was ON */}
                      {parsed.stockPicks?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#4338ca', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
                            🏆 Top Stock Picks
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {parsed.stockPicks.map((pick, i) => {
                              const recColors = { BUY:'#10b981', HOLD:'#f59e0b', WATCH:'#2563eb', AVOID:'#ef4444' };
                              const rc = recColors[pick.rec] || '#6366f1';
                              return (
                                <div key={i} style={{ background: 'white', border: `1px solid ${rc}33`, borderLeft: `3px solid ${rc}`, borderRadius: 8, padding: '10px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, fontSize: 13, color: '#1e1b4b' }}>{pick.symbol}</span>
                                    <span style={{ fontSize: 11, color: '#64748b' }}>{pick.name}</span>
                                    <span style={{ marginLeft: 'auto', background: rc+'20', color: rc, border: `1px solid ${rc}44`, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{pick.rec}</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.55, marginBottom: 4 }}>{pick.thesis}</div>
                                  {pick.risk && <div style={{ fontSize: 11, color: '#ef4444', fontStyle: 'italic' }}>⚠️ {pick.risk}</div>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sources */}
                      {parsed.sourceList?.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {parsed.sourceList.map((s, i) => (
                            <span key={i} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* AI launchers */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 8 }}>OPEN DIRECTLY IN</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { name:'Perplexity', icon:'🔍', color:'#20b2aa', bg:'rgba(32,178,170,0.08)', border:'rgba(32,178,170,0.35)', getUrl: p => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
                    { name:'ChatGPT',    icon:'✦',  color:'#10a37f', bg:'rgba(16,163,127,0.08)', border:'rgba(16,163,127,0.35)', getUrl: p => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
                    { name:'Gemini',     icon:'✦',  color:'#4285f4', bg:'rgba(66,133,244,0.08)', border:'rgba(66,133,244,0.35)', getUrl: p => `https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
                    { name:'Claude',     icon:'◆',  color:'#cc785c', bg:'rgba(204,120,92,0.08)', border:'rgba(204,120,92,0.35)', getUrl: p => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
                  ].map(({ name, icon, color, bg, border, getUrl }) => (
                    <button key={name}
                      onClick={() => window.open(getUrl(buildGlobalScanPrompt(sentimentMarket, includeStocks)), '_blank')}
                      style={{ padding: '8px 14px', borderRadius: 9, border: `1.5px solid ${border}`, background: bg, color, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${border}`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <span style={{ fontSize: 14 }}>{icon}</span> {name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: '#e2e8f0' }} />

              {/* Copy + Paste */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(buildGlobalScanPrompt(sentimentMarket, includeStocks));
                    setGsmCopied(true);
                    setTimeout(() => setGsmCopied(false), 2000);
                  }}
                  style={{
                    flex: 1, padding: 10, border: 'none', borderRadius: 9, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    background: gsmCopied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#1e1b4b,#4338ca)',
                    transition: 'background 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  }}
                >
                  {gsmCopied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Prompt</>}
                </button>
                <button
                  onClick={() => { setSentimentOpen(false); setGsmPasteOpen(true); setGsmParseError(null); }}
                  style={{ flex: 1, padding: 10, background: '#fff', border: '2px solid #7c3aed', borderRadius: 9, color: '#7c3aed', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf5ff'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <span>📥</span> Paste Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GLOBAL SCAN PASTE MODAL ── */}
      {gsmPasteOpen && (
        <div
          onClick={() => { setGsmPasteOpen(false); setGsmParseError(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 10011, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 'min(640px,100%)', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', animation: 'esi-modal-in 0.2s ease' }}
          >
            <div style={{ padding: '18px 22px 14px', background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                    📥 Paste AI Response
                    {sentimentMarket && <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>— {sentimentMarket.label}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Paste the raw JSON. It will be validated and displayed inline.</div>
                </div>
                <button onClick={() => { setGsmPasteOpen(false); setGsmParseError(null); }}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            <div style={{ padding: '18px 22px 0' }}>
              <textarea
                autoFocus
                value={gsmPasteText}
                onChange={e => { setGsmPasteText(e.target.value); setGsmParseError(null); }}
                placeholder={'{\n  "bias": "BULLISH",\n  "confidence": 78,\n  "tldr": "...",\n  ...\n}'}
                style={{ width: '100%', height: 240, padding: 14, borderRadius: 10, border: `2px solid ${gsmParseError ? '#ef4444' : '#ddd6fe'}`, fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', background: gsmParseError ? '#fef2f2' : '#faf5ff', transition: 'border-color 0.15s' }}
              />
              {gsmParseError && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#b91c1c' }}>⚠️ {gsmParseError}</div>
              )}
            </div>

            <div style={{ padding: 18, display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setGsmParseError(null);
                  if (!gsmPasteText.trim()) { setGsmParseError('Paste the JSON response first.'); return; }
                  let parsed;
                  try {
                    const clean = gsmPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    parsed = JSON.parse(clean);
                  } catch (e) {
                    setGsmParseError(`Invalid JSON — ${e.message}`);
                    return;
                  }
                  const required = ['bias','confidence','tldr','summary'];
                  const missing = required.filter(k => parsed[k] == null);
                  if (missing.length) { setGsmParseError(`Missing fields: ${missing.join(', ')}`); return; }
                  parsed.bias = String(parsed.bias).toUpperCase();
                  if (!['BULLISH','BEARISH','NEUTRAL','MIXED'].includes(parsed.bias)) parsed.bias = 'MIXED';
                  // Cache by market id
                  setGsmAnalysis(prev => ({ ...prev, [sentimentMarket.market]: parsed }));
                  setGsmPasteText('');
                  setGsmPasteOpen(false);
                  setSentimentOpen(true);
                  setTimeout(() => {
                    const el = document.getElementById('gsm-parsed-result');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                }}
                disabled={!gsmPasteText.trim()}
                style={{ flex: 1, padding: 11, background: !gsmPasteText.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#4c1d95)', border: 'none', borderRadius: 9, color: '#fff', fontWeight: 700, fontSize: 14, cursor: !gsmPasteText.trim() ? 'not-allowed' : 'pointer' }}
              >✓ Parse &amp; Display</button>
              <button
                onClick={() => { setGsmPasteOpen(false); setSentimentOpen(true); }}
                style={{ padding: '11px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >← Back</button>
            </div>
          </div>
        </div>
      )}
      {/* ── PER-STOCK SENTIMENT MODAL ── */}
      {stockSentimentOpen && stockSentimentTarget && (() => {
        const { stock, marketData } = stockSentimentTarget;
        const cached = stockAnalysisCache[stock.symbol];
        const retColor = stock.return_pct >= 0 ? '#16a34a' : '#dc2626';
        const rank = marketData.results.findIndex(s => s.symbol === stock.symbol) + 1;

        return (
          <div
            onClick={() => setStockSentimentOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10012, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ width: 'min(740px,100%)', maxHeight: '92vh', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '0 28px 90px rgba(0,0,0,0.35)', animation: 'esi-modal-in 0.2s ease' }}
            >
              {/* Header */}
              <div style={{ padding: '16px 22px 14px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #4c1d95)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 22, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>{marketData.flag}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 800, fontSize: 16, color: '#fff' }}>{stock.symbol}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{stock.name}</span>
                        <span style={{ background: (stock.return_pct >= 0 ? '#16a34a' : '#dc2626')+'33', color: retColor, border: `1px solid ${retColor}55`, padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace', fontSize: 12, fontWeight: 800 }}>
                          {stock.return_pct >= 0 ? '+' : ''}{stock.return_pct.toFixed(2)}%
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.1)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          #{rank} in {marketData.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
                        {stock.current_price} {stock.currency || marketData.currency}
                        {stock.sector && stock.sector !== '—' && ` · ${stock.sector}`}
                        {stock.market_cap && ` · ${stock.market_cap >= 1e9 ? (stock.market_cap/1e9).toFixed(1)+'B' : (stock.market_cap/1e6).toFixed(0)+'M'}`}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStockSentimentOpen(false)}
                    style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                  Copy prompt → paste into any AI → copy their JSON → Paste Response
                </div>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {/* Prompt preview */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, fontSize: 11.5, lineHeight: 1.7, color: '#334155', fontFamily: "'IBM Plex Mono',monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 12 }}>
                  {buildStockPrompt(stock, marketData)}
                </div>

                <div style={{ padding: '10px 14px', background: 'rgba(32,178,170,0.07)', border: '1px solid rgba(32,178,170,0.25)', borderRadius: 9, display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                  <div style={{ fontSize: 12, color: '#0f766e', lineHeight: 1.55 }}>
                    <strong>Perplexity is best</strong> — it'll search recent earnings, analyst calls, and local {marketData.label} financial media for {stock.name} in real time.
                  </div>
                </div>

                {/* Parsed analysis */}
                {cached && (() => {
                  const bColors = { BULLISH:'#10b981', BEARISH:'#ef4444', NEUTRAL:'#f59e0b', MIXED:'#2563eb' };
                  const bIcons  = { BULLISH:'📈', BEARISH:'📉', NEUTRAL:'➡️', MIXED:'🔀' };
                  const recColors = { BUY:'#10b981', HOLD:'#f59e0b', WATCH:'#2563eb', AVOID:'#ef4444' };
                  const bc  = bColors[cached.bias] || '#6366f1';
                  const rc  = recColors[cached.rec] || '#6366f1';
                  return (
                    <div id={`stock-parsed-${stock.symbol}`}>
                      {/* Bias bar */}
                      <div style={{ padding: '14px 16px', background: bc+'10', border: `2px solid ${bc}30`, borderLeft: `4px solid ${bc}`, borderRadius: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 18 }}>{bIcons[cached.bias]}</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: bc }}>{cached.bias}</span>
                          <span style={{ background: bc, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>{cached.confidence}% confidence</span>
                          {/* Recommendation pill */}
                          <span style={{ background: rc+'20', color: rc, border: `1px solid ${rc}44`, fontSize: 12, fontWeight: 800, padding: '3px 11px', borderRadius: 20 }}>{cached.rec}</span>
                          {/* Upside */}
                          {cached.targetUpside != null && (
                            <span style={{ background: cached.targetUpside >= 0 ? '#dcfce7' : '#fee2e2', color: cached.targetUpside >= 0 ? '#15803d' : '#b91c1c', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20, fontFamily: 'monospace' }}>
                              {cached.targetUpside >= 0 ? '▲' : '▼'} {Math.abs(cached.targetUpside).toFixed(1)}% est.
                            </span>
                          )}
                          {cached.articleCount && <span style={{ fontSize: 11, color: '#94a3b8' }}>· {cached.articleCount} sources</span>}
                        </div>

                        {/* TL;DR */}
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.5, marginBottom: 10 }}>{cached.tldr}</div>

                        {/* Company snapshot */}
                        {cached.companySnapshot && (
                          <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: 7, border: '1px solid #e2e8f0' }}>
                            {cached.companySnapshot}
                          </div>
                        )}

                        {/* Themes */}
                        {cached.themes?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                            {cached.themes.map((t, i) => (
                              <span key={i} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>{t}</span>
                            ))}
                          </div>
                        )}

                        {/* Summary */}
                        {cached.summary && (
                          <div style={{ fontSize: 13, color: '#333', lineHeight: 1.75, background: '#fff', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10 }}
                            dangerouslySetInnerHTML={{ __html: cached.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                          />
                        )}

                        {/* Catalysts + Risks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          {cached.catalysts?.length > 0 && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.07em', marginBottom: 6 }}>🚀 CATALYSTS</div>
                              {cached.catalysts.map((c, i) => (
                                <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 5, display: 'flex', gap: 6, lineHeight: 1.45 }}>
                                  <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{i+1}.</span>{c}
                                </div>
                              ))}
                            </div>
                          )}
                          {cached.risks?.length > 0 && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: '0.07em', marginBottom: 6 }}>⚠️ RISKS</div>
                              {cached.risks.map((r, i) => (
                                <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 5, display: 'flex', gap: 6, lineHeight: 1.45 }}>
                                  <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>▼</span>{r}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recommendation */}
                        {cached.recommendation && (
                          <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '3px solid #2563eb', borderRadius: 8, fontSize: 13, color: '#1e3a5f', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>
                            {cached.recommendation}
                          </div>
                        )}

                        {/* Analyst consensus */}
                        {cached.analystConsensus && cached.analystConsensus !== 'Data not found' && (
                          <div style={{ padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12, color: '#15803d', marginBottom: 10 }}>
                            🏦 <strong>Analyst Consensus:</strong> {cached.analystConsensus}
                          </div>
                        )}

                        {/* Sources */}
                        {cached.sourceList?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {cached.sourceList.map((s, i) => (
                              <span key={i} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Regenerate button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <button
                          onClick={() => { setStockAnalysisCache(c => { const n = {...c}; delete n[stock.symbol]; return n; }); }}
                          style={{ padding: '6px 14px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 7, color: '#7c3aed', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          🔄 Clear &amp; Regenerate
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* AI launchers */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 8 }}>OPEN DIRECTLY IN</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { name:'Perplexity', icon:'🔍', color:'#20b2aa', bg:'rgba(32,178,170,0.08)', border:'rgba(32,178,170,0.35)', getUrl: p => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
                      { name:'ChatGPT',    icon:'✦',  color:'#10a37f', bg:'rgba(16,163,127,0.08)', border:'rgba(16,163,127,0.35)', getUrl: p => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
                      { name:'Gemini',     icon:'✦',  color:'#4285f4', bg:'rgba(66,133,244,0.08)', border:'rgba(66,133,244,0.35)', getUrl: p => `https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
                      { name:'Claude',     icon:'◆',  color:'#cc785c', bg:'rgba(204,120,92,0.08)', border:'rgba(204,120,92,0.35)', getUrl: p => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
                    ].map(({ name, icon, color, bg, border, getUrl }) => (
                      <button key={name}
                        onClick={() => window.open(getUrl(buildStockPrompt(stock, marketData)), '_blank')}
                        style={{ padding: '8px 14px', borderRadius: 9, border: `1.5px solid ${border}`, background: bg, color, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${border}`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <span style={{ fontSize: 14 }}>{icon}</span> {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: '#e2e8f0' }} />

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(buildStockPrompt(stock, marketData));
                      setStockCopied(true);
                      setTimeout(() => setStockCopied(false), 2000);
                    }}
                    style={{ flex: 1, padding: 10, border: 'none', borderRadius: 9, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: stockCopied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#1e1b4b,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.25s' }}
                  >
                    {stockCopied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Prompt</>}
                  </button>
                  <button
                    onClick={() => { setStockSentimentOpen(false); setStockPasteOpen(true); setStockParseError(null); }}
                    style={{ flex: 1, padding: 10, background: '#fff', border: '2px solid #7c3aed', borderRadius: 9, color: '#7c3aed', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf5ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <span>📥</span> Paste Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── PER-STOCK PASTE MODAL ── */}
      {stockPasteOpen && stockSentimentTarget && (
        <div
          onClick={() => { setStockPasteOpen(false); setStockParseError(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 10013, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 'min(640px,100%)', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', animation: 'esi-modal-in 0.2s ease' }}
          >
            <div style={{ padding: '18px 22px 14px', background: 'linear-gradient(135deg, #0f172a, #7c3aed)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                    📥 Paste AI Response
                    <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>
                      — {stockSentimentTarget.stock.symbol} · {stockSentimentTarget.stock.name}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Paste the raw JSON. Validated and displayed inline.</div>
                </div>
                <button onClick={() => { setStockPasteOpen(false); setStockParseError(null); }}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            <div style={{ padding: '18px 22px 0' }}>
              <textarea
                autoFocus
                value={stockPasteText}
                onChange={e => { setStockPasteText(e.target.value); setStockParseError(null); }}
                placeholder={'{\n  "bias": "BULLISH",\n  "confidence": 82,\n  "rec": "BUY",\n  "targetUpside": 18.5,\n  "tldr": "...",\n  ...\n}'}
                style={{ width: '100%', height: 240, padding: 14, borderRadius: 10, border: `2px solid ${stockParseError ? '#ef4444' : '#ddd6fe'}`, fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', background: stockParseError ? '#fef2f2' : '#faf5ff', transition: 'border-color 0.15s' }}
              />
              {stockParseError && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#b91c1c' }}>⚠️ {stockParseError}</div>
              )}
            </div>

            <div style={{ padding: 18, display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setStockParseError(null);
                  if (!stockPasteText.trim()) { setStockParseError('Paste the JSON first.'); return; }
                  let parsed;
                  try {
                    const clean = stockPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    parsed = JSON.parse(clean);
                  } catch (e) {
                    setStockParseError(`Invalid JSON — ${e.message}`);
                    return;
                  }
                  const required = ['bias','confidence','rec','tldr','summary'];
                  const missing = required.filter(k => parsed[k] == null);
                  if (missing.length) { setStockParseError(`Missing fields: ${missing.join(', ')}`); return; }
                  parsed.bias = String(parsed.bias).toUpperCase();
                  if (!['BULLISH','BEARISH','NEUTRAL','MIXED'].includes(parsed.bias)) parsed.bias = 'MIXED';
                  parsed.rec = String(parsed.rec).toUpperCase();
                  if (!['BUY','HOLD','WATCH','AVOID'].includes(parsed.rec)) parsed.rec = 'HOLD';
                  const sym = stockSentimentTarget.stock.symbol;
                  setStockAnalysisCache(prev => ({ ...prev, [sym]: parsed }));
                  setStockPasteText('');
                  setStockPasteOpen(false);
                  setStockSentimentOpen(true);
                  setTimeout(() => {
                    const el = document.getElementById(`stock-parsed-${sym}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                }}
                disabled={!stockPasteText.trim()}
                style={{ flex: 1, padding: 11, background: !stockPasteText.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#4c1d95)', border: 'none', borderRadius: 9, color: '#fff', fontWeight: 700, fontSize: 14, cursor: !stockPasteText.trim() ? 'not-allowed' : 'pointer' }}
              >✓ Parse &amp; Display</button>
              <button
                onClick={() => { setStockPasteOpen(false); setStockSentimentOpen(true); }}
                style={{ padding: '11px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >← Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MARKET PULSE MAIN ───────────────────────────────────────────────────────
function MarketPulse({ baseUrl, allStocks, sectorColors }) {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState('overview');
  const [tf, setTf]               = useState('1D');

  // Active drill items
  const [activeSector,    setActiveSector]    = useState(null);
  const [activeIndex,     setActiveIndex]     = useState(null);
  const [activeCmdGroup,  setActiveCmdGroup]  = useState(null);

  // Data stores (all keyed by `${id}-${tf}`)
  const [overviewData,    setOverviewData]    = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [allSectorsData,  setAllSectorsData]  = useState(null);
  const [allSectorsLoad,  setAllSectorsLoad]  = useState(false);
  const [sectorCache,     setSectorCache]     = useState({});
  const [indexCache,      setIndexCache]      = useState({});
  const [cmdCache,        setCmdCache]        = useState({});
  const [loadingKeys,     setLoadingKeys]     = useState({});

  // MSS cache: { [symbol]: mssObj }
  const [mssCache,        setMssCache]        = useState({});
  const [mssLoading,      setMssLoading]      = useState({});

  // Correlation
  const [corrCache,    setCorrCache]    = useState({});
  const [corrLoading,  setCorrLoading]  = useState({});
  const [corrOpen,     setCorrOpen]     = useState(false);
  const [corrSearch,   setCorrSearch]   = useState('');
  const [corrFilter,   setCorrFilter]   = useState('all');
  const [corrExpanded,  setCorrExpanded]  = useState({});
  const [compareModal,  setCompareModal]  = useState(null); // { symA, symB, score }
  // Heatmap-specific filter + search
  const [heatSearch,    setHeatSearch]    = useState('');
  const [heatThresh,    setHeatThresh]    = useState('');    // min |ρ| to show cell

  // Filters
  const [mssFilter,    setMssFilter]    = useState('all');
  const [r2Filter,     setR2Filter]     = useState('all');
  const [clsFilter,    setClsFilter]    = useState('all');
  const [drillSearch,  setDrillSearch]  = useState('');   // search across all drill views
  const [showAllStocks, setShowAllStocks] = useState(false); // show individual stock lines on sector chart

  // MSS lookback (days) — shared across all assets in the current view
  const [mssLookback,  setMssLookback]  = useState(60);
  const [lbInput,      setLbInput]      = useState('60');

  // Active expanded asset panels — Set so multiple can be open simultaneously
  const [openPanels,   setOpenPanels]   = useState(new Set());
  const togglePanel = (sym) => setOpenPanels(p => { const n = new Set(p); n.has(sym) ? n.delete(sym) : n.add(sym); return n; });

  const tfObj   = MP_TF_LIST.find(t => t.label === tf) || MP_TF_LIST[6];
  const sectors = useMemo(() => [...new Set(allStocks.map(s => s.sector))].sort(), [allStocks]);

  // Chart container refs
  const overviewRef    = useRef(null);
  const overviewChart  = useRef(null);
  const allSecRef      = useRef(null);
  const allSecChart    = useRef(null);
  const drillRef       = useRef(null);
  const drillChart     = useRef(null);

  const [drillSentimentOpen,    setDrillSentimentOpen]    = useState(false);
  const [drillSentimentContext, setDrillSentimentContext] = useState(null); 
  // { type: 'sector'|'index'|'commodity', name, data, regime }
  const [drillCompareTicker,    setDrillCompareTicker]    = useState('');
  const [drillPasteOpen,        setDrillPasteOpen]        = useState(false);
  const [drillPasteText,        setDrillPasteText]        = useState('');
  const [drillParseError,       setDrillParseError]       = useState(null);
  const [drillParsedAnalysis,   setDrillParsedAnalysis]   = useState(null);
  const [drillCopied,           setDrillCopied]           = useState(false);

  // ── helpers ──
  const setLoading = (key, val) => setLoadingKeys(p => ({ ...p, [key]: val }));
  const isLoading  = (key) => loadingKeys[key] || false;

  const tfPeriodDays = useMemo(() => {
    const map = { '1m':1,'5m':5,'15m':5,'30m':30,'1H':30,'4H':90,'1D':365,'1W':730,'1M':1825,'3M':1825,'6M':1825,'1Y':1825,'2Y':1825 };
    return map[tf] || 365;
  }, [tf]);

  // ── MSS lazy fetch for visible symbols ──
  // force=true bypasses the cache (used after lookback changes)
  const fetchMSSForSymbols = useCallback(async (symbols, force = false) => {
    const needed = force
      ? symbols.filter(s => !mssLoading[s])
      : symbols.filter(s => !mssCache[s] && !mssLoading[s]);
    if (!needed.length) return;
    setMssLoading(p => { const n={...p}; needed.forEach(s => n[s]=true); return n; });
    const result = await mpFetchMSS(needed, baseUrl, mssLookback);
    setMssCache(p => {
      const next = force ? {} : { ...p };
      return { ...next, ...result };
    });
    setMssLoading(p => { const n={...p}; needed.forEach(s => delete n[s]); return n; });
  }, [mssLoading, baseUrl, mssLookback]);

  // ── FETCH OVERVIEW ──
  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const { interval, period } = tfObj;
      const idxTickers  = MP_INDICES.map(i => i.symbol);
      const cmdTickers  = Object.values(MP_COMMODITY_GROUPS).flatMap(g => [g.symbols[0]]);
      const sectorSamples = {};
      const allSectorT    = [];
      for (const sec of sectors) {
        // Use top 6 by market cap — keeps total batch under 60 (11 sectors × 6 = 66 + indices + commodities)
        const t = allStocks.filter(s => s.sector === sec).sort((a,b) => mpMarketCap(b.symbol)-mpMarketCap(a.symbol)).map(s => s.symbol).slice(0, 6);
        sectorSamples[sec] = t;
        allSectorT.push(...t);
      }
      await mpFetchMarketCaps(allSectorT, baseUrl);

      // Fetch indices+commodities first, then sectors in chunks to avoid backend 60-ticker cap
      const idxCmdBatch   = await mpBatchFetch([...new Set([...idxTickers, ...cmdTickers])], interval, period, baseUrl);
      // Fetch sector tickers in chunks of 50
      const sectorBatch   = {};
      const sectorChunks  = [];
      const uniqueSectorT = [...new Set(allSectorT)];
      for (let i = 0; i < uniqueSectorT.length; i += 50) sectorChunks.push(uniqueSectorT.slice(i, i+50));
      for (const chunk of sectorChunks) {
        const chunkData = await mpBatchFetch(chunk, interval, period, baseUrl);
        Object.assign(sectorBatch, chunkData);
      }
      const batch = { ...idxCmdBatch, ...sectorBatch };

      const indices = {};
      MP_INDICES.forEach(idx => { indices[idx.symbol] = batch[idx.symbol] || []; });

      const commodities = {};
      Object.entries(MP_COMMODITY_GROUPS).forEach(([grp, g]) => {
        commodities[grp] = batch[g.symbols[0]] || [];
      });

      const sectorLines = {};
      for (const sec of sectors) {
        const tickers = sectorSamples[sec];
        // Skip tickers with no/insufficient data before aligning
        const fetched = {};
        tickers.forEach(t => {
          const pts = batch[t] || [];
          if (pts.length >= MP_MIN_PTS) fetched[t] = pts;
        });
        if (!Object.keys(fetched).length) {
          sectorLines[sec] = { prices: null, times: [], regime: mpRegime(null) };
          continue;
        }
        const aligned  = mpAlign(fetched);
        const idx      = mpSectorIndex(aligned, Object.keys(fetched));
        const normForRegime = mpNormalize(idx);
        sectorLines[sec] = { prices: idx, times: aligned.__times || [], regime: mpRegime(normForRegime) };
      }
      setOverviewData({ indices, commodities, sectorLines });
    } catch(e) { console.error(e); }
    setOverviewLoading(false);
  }, [tf, baseUrl, sectors, allStocks]);

  // ── FETCH ALL SECTORS CHART ──
  const fetchAllSectors = useCallback(async () => {
    setAllSectorsLoad(true);
    try {
      const { interval, period } = tfObj;
      const allT = [];
      const sampleMap = {};
      for (const sec of sectors) {
        const t = allStocks.filter(s => s.sector === sec).sort((a,b) => mpMarketCap(b.symbol)-mpMarketCap(a.symbol)).map(s => s.symbol).slice(0, 15);
        sampleMap[sec] = t; allT.push(...t);
      }
      await mpFetchMarketCaps(allT, baseUrl);
      const batch = await mpBatchFetch([...new Set(allT)], interval, period, baseUrl);
      const lines = {};
      for (const sec of sectors) {
        const fetched = {};
        sampleMap[sec].forEach(t => {
          const pts = batch[t] || [];
          if (pts.length >= MP_MIN_PTS) fetched[t] = pts;
        });
        if (!Object.keys(fetched).length) {
          lines[sec] = { norm: null, times: [], regime: mpRegime(null) };
          continue;
        }
        const aligned = mpAlign(fetched);
        const idx     = mpSectorIndex(aligned, Object.keys(fetched));
        const norm    = mpNormalize(idx);
        lines[sec] = { norm, times: aligned.__times || [], regime: mpRegime(norm) };
      }
      setAllSectorsData(lines);
    } catch(e) { console.error(e); }
    setAllSectorsLoad(false);
  }, [tf, baseUrl, sectors, allStocks]);

  // ── FETCH SECTOR DRILL ──
  const fetchSector = useCallback(async (sector) => {
    const key = `${sector}-${tf}`;
    if (sectorCache[key]) return;
    setLoading(key, true);
    try {
      const { interval, period } = tfObj;
      const tickers = allStocks.filter(s => s.sector === sector).map(s => s.symbol);
      await mpFetchMarketCaps(tickers, baseUrl);
      const batch   = await mpBatchFetch(tickers, interval, period, baseUrl);

      // Skip tickers with insufficient data — use global MP_MIN_PTS threshold
      const fetched = {};
      const skipped = [];
      tickers.forEach(t => {
        const pts = batch[t] || [];
        if (pts.length >= MP_MIN_PTS) fetched[t] = pts;
        else skipped.push(t);
      });
      if (skipped.length) console.log(`[MarketPulse] Skipped ${skipped.length} tickers with <${MP_MIN_PTS} pts:`, skipped);

      const activeTickers = Object.keys(fetched);
      const aligned   = mpAlign(fetched);
      const sectorIdx = mpSectorIndex(aligned, activeTickers);
      const normIdx   = mpNormalize(sectorIdx);
      const regime    = mpRegime(sectorIdx);
      const times     = aligned.__times || [];

      // Build stock entries — include ALL tickers (even skipped ones) so user sees them,
      // but mark skipped ones as having no data
      const stocks = tickers.map(t => {
        const raw  = aligned[t] || [];
        const norm = mpNormalize(raw);
        const cls  = raw.length >= MP_MIN_PTS ? mpClassify(raw, sectorIdx) : { label:'No Data', color:'#94a3b8', emoji:'⬜' };
        const vals = (raw||[]).filter(v => v!=null);
        const ret  = vals.length>1 ? ((vals[vals.length-1]-vals[0])/vals[0]*100) : 0;
        const noData = skipped.includes(t);
        return { symbol:t, norm, raw, cls, ret:noData?'—':ret.toFixed(2), regime:noData?{ label:'No Data', color:'#94a3b8', emoji:'⬜' }:mpRegime(raw), noData };
      }).sort((a,b) => {
        if (a.noData && !b.noData) return 1;
        if (!a.noData && b.noData) return -1;
        return parseFloat(b.ret||0)-parseFloat(a.ret||0);
      });
      setSectorCache(p => ({ ...p, [key]: { aligned, sectorIdx, normIdx, regime, times, stocks } }));
    } catch(e) { console.error(e); }
    setLoading(key, false);
  }, [tf, allStocks, baseUrl]);

  // ── FETCH INDEX DRILL ──
  const fetchIndexDrill = useCallback(async () => {
    const key = `indices-${tf}`;
    if (indexCache[key]) return;
    setLoading(key, true);
    try {
      const { interval, period } = tfObj;
      const batch = await mpBatchFetch(MP_INDICES.map(i => i.symbol), interval, period, baseUrl);
      const entries = MP_INDICES.map(idx => {
        const pts  = batch[idx.symbol] || [];
        const vals = pts.map(p => p.close);
        const norm = mpNormalize(vals);
        const ret  = vals.length>1 ? ((vals[vals.length-1]-vals[0])/vals[0]*100) : 0;
        return { ...idx, pts, vals, norm, times: pts.map(p=>p.time), regime: mpRegime(vals), ret: ret.toFixed(2) };
      });
      setIndexCache(p => ({ ...p, [key]: entries }));
    } catch(e) { console.error(e); }
    setLoading(key, false);
  }, [tf, baseUrl]);

  // ── FETCH COMMODITY DRILL ──
  const fetchCmdDrill = useCallback(async (group) => {
    const key = `cmd-${group}-${tf}`;
    if (cmdCache[key]) return;
    setLoading(key, true);
    try {
      const { interval, period } = tfObj;
      const g     = MP_COMMODITY_GROUPS[group];
      const batch = await mpBatchFetch(g.symbols, interval, period, baseUrl);
      const entries = g.symbols.map((sym, i) => {
        const pts  = batch[sym] || [];
        const vals = pts.map(p => p.close);
        const ret  = vals.length>1 ? ((vals[vals.length-1]-vals[0])/vals[0]*100) : 0;
        return { symbol:sym, name:g.names[i], pts, vals, norm:mpNormalize(vals), times:pts.map(p=>p.time), regime:mpRegime(vals), ret:ret.toFixed(2) };
      });
      setCmdCache(p => ({ ...p, [key]: { entries, group, color: g.color } }));
    } catch(e) { console.error(e); }
    setLoading(key, false);
  }, [tf, baseUrl]);

  // ── FETCH SECTOR CORRELATIONS ──
  const fetchCorr = useCallback(async (sector) => {
    const key = `${sector}-${tf}`;
    if (corrCache[key]) { setCorrOpen(o => !o); return; }
    setCorrLoading(p => ({ ...p, [key]: true }));
    setCorrOpen(true);
    try {
      const sd = sectorCache[key];
      if (!sd) return;
      const tickers = sd.stocks.map(s => s.symbol);
      const matrix = [];
      let total=0, count=0;
      for (let i=0; i<tickers.length; i++) {
        for (let j=i+1; j<tickers.length; j++) {
          const s = mpPearson(sd.aligned[tickers[i]], sd.aligned[tickers[j]]);
          if (s!==null) { matrix.push({ a:tickers[i], b:tickers[j], score:s }); total+=s; count++; }
        }
      }
      matrix.sort((a,b) => Math.abs(b.score)-Math.abs(a.score));
      setCorrCache(p => ({ ...p, [key]: { matrix, avgCorr: count>0?total/count:0, tickers } }));
    } catch(e) { console.error(e); }
    setCorrLoading(p => ({ ...p, [`${sector}-${tf}`]: false }));
  }, [tf, sectorCache]);

  // ── Auto-triggers ──
  useEffect(() => { if (open && tab==='overview')    fetchOverview(); },    [open, tab, tf]);
  useEffect(() => { if (open && tab==='allsectors')  fetchAllSectors(); },  [open, tab, tf]);
  useEffect(() => { if (open && tab==='indices')     fetchIndexDrill(); },  [open, tab, tf]);
  useEffect(() => { if (open && tab==='sector' && activeSector)   fetchSector(activeSector); },   [open, tab, activeSector, tf]);
  useEffect(() => { if (open && tab==='commodities' && activeCmdGroup) fetchCmdDrill(activeCmdGroup); }, [open, tab, activeCmdGroup, tf]);

  // ── Chart: Overview ──
  useEffect(() => {
    if (!overviewData || !overviewRef.current || tab!=='overview') return;
    if (overviewChart.current) { try { overviewChart.current.remove(); } catch(_){} }
    const series = [];
    MP_INDICES.forEach(idx => {
      const pts = overviewData.indices[idx.symbol] || [];
      let base=null;
      series.push({ color:idx.color, width:2, name:idx.name, label:true, area:false, data: pts.map(p => { if(base==null)base=p.close; return { time:p.time, value:(p.close/base)*100 }; }) });
    });
    Object.entries(overviewData.sectorLines).forEach(([sec,{ prices,times }]) => {
      const norm = mpNormalize(prices);
      series.push({ color:sectorColors[sec]||'#6b7280', width:1.5, name:sec, label:false, area:false, data: times.map((t,i) => ({ time:t, value:norm[i] })).filter(p=>p.value!=null) });
    });
    Object.entries(overviewData.commodities).forEach(([grp, pts]) => {
      let base=null;
      series.push({ color:MP_COMMODITY_GROUPS[grp]?.color||'#94a3b8', width:1.5, name:grp, label:false, area:false, data: pts.map(p => { if(base==null)base=p.close; return { time:p.time, value:(p.close/base)*100 }; }) });
    });
    buildMpChart(overviewRef.current, series, { height:380 }).then(c => { overviewChart.current = c; });
  }, [overviewData, tab]);

  // ── Chart: All Sectors ──
  useEffect(() => {
    if (!allSectorsData || !allSecRef.current || tab!=='allsectors') return;
    if (allSecChart.current) { try { allSecChart.current.remove(); } catch(_){} }
    const series = Object.entries(allSectorsData).map(([sec,{ norm, times }]) => ({
      color: sectorColors[sec]||'#6b7280', width:2, name:sec, area:false, label:true,
      data: times.map((t,i) => ({ time:t, value:norm[i] })).filter(p=>p.value!=null),
    }));
    buildMpChart(allSecRef.current, series, { height:420 }).then(c => { allSecChart.current = c; });
  }, [allSectorsData, tab]);

  // ── Chart: Sector drill ──
  useEffect(() => {
    const key = `${activeSector}-${tf}`;
    const sd  = sectorCache[key];
    if (!sd || !drillRef.current || tab!=='sector') return;
    if (drillChart.current) { try { drillChart.current.remove(); } catch(_){} }
    const col  = sectorColors[activeSector]||'#38bdf8';
    const indexSeries = { color:col, width:3, name:`${activeSector} Index`, area:true, label:true,
      data: sd.times.map((t,i) => ({ time:t, value:sd.normIdx[i] })).filter(p=>p.value!=null) };
    const stockSeries = showAllStocks
      ? sd.stocks.slice(0,25).map(stock => ({
          color: stock.cls.label==='Diverging'?'#f8717188': stock.cls.label==='Following'?'#22d3ee55':'#94a3b833',
          width:1, name:stock.symbol, area:false, label:false,
          data: sd.times.map((t,i) => ({ time:t, value:stock.norm[i] })).filter(p=>p.value!=null),
        }))
      : [];
    buildMpChart(drillRef.current, [indexSeries, ...stockSeries], { height:340 }).then(c => { drillChart.current = c; });
  }, [sectorCache, activeSector, tf, tab, showAllStocks]);

  // ── Chart: Index drill ──
  const idxDrillRef   = useRef(null);
  const idxDrillChart = useRef(null);
  useEffect(() => {
    const key = `indices-${tf}`;
    const d   = indexCache[key];
    if (!d || !idxDrillRef.current || tab!=='indices') return;
    if (idxDrillChart.current) { try { idxDrillChart.current.remove(); } catch(_){} }
    const series = d.map(idx => ({
      color:idx.color, width:2, name:idx.name, area:false, label:true,
      data: idx.times.map((t,i) => ({ time:t, value:idx.norm[i] })).filter(p=>p.value!=null),
    }));
    buildMpChart(idxDrillRef.current, series, { height:340 }).then(c => { idxDrillChart.current = c; });
    // Lazy MSS fetch for all indices
    fetchMSSForSymbols(MP_INDICES.map(i => i.symbol));
  }, [indexCache, tf, tab]);

  // ── Chart: Commodity drill ──
  const cmdDrillRef   = useRef(null);
  const cmdDrillChart = useRef(null);
  useEffect(() => {
    const key = `cmd-${activeCmdGroup}-${tf}`;
    const d   = cmdCache[key];
    if (!d || !cmdDrillRef.current || tab!=='commodities') return;
    if (cmdDrillChart.current) { try { cmdDrillChart.current.remove(); } catch(_){} }
    const series = d.entries.map(e => ({
      color:d.color, width:2, name:e.name, area:false, label:true,
      data: e.times.map((t,i) => ({ time:t, value:e.norm[i] })).filter(p=>p.value!=null),
    }));
    buildMpChart(cmdDrillRef.current, series, { height:320 }).then(c => { cmdDrillChart.current = c; });
    fetchMSSForSymbols(MP_COMMODITY_GROUPS[activeCmdGroup]?.symbols || []);
  }, [cmdCache, activeCmdGroup, tf, tab]);

  // ── Filtered sector stocks ──
  const filteredStocks = useMemo(() => {
    const key = `${activeSector}-${tf}`;
    const sd  = sectorCache[key];
    if (!sd) return [];
    let list = sd.stocks;
    // Search
    if (drillSearch.trim()) {
      const q = drillSearch.toLowerCase();
      list = list.filter(s => s.symbol.toLowerCase().includes(q));
    }
    // Hide no-data stocks unless specifically searching for them
    if (!drillSearch.trim()) list = list.filter(s => !s.noData);
    if (clsFilter !== 'all') list = list.filter(s => s.cls.label === clsFilter);
    if (mssFilter !== 'all') {
      list = list.filter(s => {
        const m = mssCache[s.symbol]?.mss;
        if (m==null) return true;
        if (mssFilter==='stable')   return m >= 47;
        if (mssFilter==='choppy')   return m >= 30 && m < 47;
        if (mssFilter==='volatile') return m < 30;
        return true;
      });
    }
    if (r2Filter !== 'all') {
      list = list.filter(s => {
        const r = mssCache[s.symbol]?.r_squared;
        if (r==null) return true;
        if (r2Filter==='high')   return r >= 0.7;
        if (r2Filter==='medium') return r >= 0.4 && r < 0.7;
        if (r2Filter==='low')    return r < 0.4;
        return true;
      });
    }
    return list;
  }, [sectorCache, activeSector, tf, clsFilter, mssFilter, r2Filter, mssCache, drillSearch]);

  // Filtered indices (for search in index drill)
  const filteredIndices = useMemo(() => {
    const key = `indices-${tf}`;
    const d   = indexCache[key];
    if (!d) return [];
    if (!drillSearch.trim()) return d;
    const q = drillSearch.toLowerCase();
    return d.filter(idx => idx.name.toLowerCase().includes(q) || idx.symbol.toLowerCase().includes(q));
  }, [indexCache, tf, drillSearch]);

  // Filtered commodities (for search in commodity drill)
  const filteredCmdEntries = useMemo(() => {
    const key = `cmd-${activeCmdGroup}-${tf}`;
    const d   = cmdCache[key];
    if (!d) return [];
    if (!drillSearch.trim()) return d.entries;
    const q = drillSearch.toLowerCase();
    return d.entries.filter(e => e.name.toLowerCase().includes(q) || e.symbol.toLowerCase().includes(q));
  }, [cmdCache, activeCmdGroup, tf, drillSearch]);

  // Trigger lazy MSS fetch when filtered stocks change
  useEffect(() => {
    if (filteredStocks.length) fetchMSSForSymbols(filteredStocks.map(s => s.symbol));
  }, [filteredStocks]);

  // ── Filtered corr cards ──
  const filteredCorr = useMemo(() => {
    const key = `${activeSector}-${tf}`;
    const cd  = corrCache[key];
    if (!cd) return [];
    let list = cd.matrix;
    if (corrSearch.trim()) { const q=corrSearch.toLowerCase(); list=list.filter(c=>c.a.toLowerCase().includes(q)||c.b.toLowerCase().includes(q)); }
    if (corrFilter==='strong_pos') list=list.filter(c=>c.score>0.8);
    else if (corrFilter==='strong_neg') list=list.filter(c=>c.score<-0.8);
    else if (corrFilter==='positive')   list=list.filter(c=>c.score>0.5);
    else if (corrFilter==='negative')   list=list.filter(c=>c.score<-0.5);
    else if (corrFilter==='weak')       list=list.filter(c=>Math.abs(c.score)<=0.3);
    return list;
  }, [corrCache, activeSector, tf, corrSearch, corrFilter]);

  if (!open) return (
    <button className="mp-open-btn" onClick={() => setOpen(true)}>
      <span>❄️</span> Market Pulse <span className="mp-open-badge">LIVE</span>
    </button>
  );

  const TABS = [
    { id:'overview',    label:'🌐 Overview' },
    { id:'allsectors',  label:'📊 All Sectors' },
    { id:'sector',      label:'🏭 Sector Drill' },
    { id:'indices',     label:'📈 Indices' },
    { id:'commodities', label:'🛢️ Commodities' },
  ];

  const curSectorKey = `${activeSector}-${tf}`;
  const curSectorData = sectorCache[curSectorKey];
  const curIdxData    = indexCache[`indices-${tf}`];
  const curCmdData    = cmdCache[`cmd-${activeCmdGroup}-${tf}`];
  const curCorrData   = corrCache[curSectorKey];

  const buildDrillPrompt = (ctx, compareTicker) => {
      if (!ctx) return '';

      const { type, name, data, regime } = ctx;

      // Pull performance stats from the actual normalized series
      const normSeries = (() => {
          if (type === 'sector') {
              const key = `${name}-${tf}`;
              const sd = sectorCache[key];
              return sd?.normIdx || null;
          }
          if (type === 'index') {
              const key = `indices-${tf}`;
              const d = indexCache[key];
              const entry = d?.find(i => i.name === name);
              return entry?.norm || null;
          }
          if (type === 'commodity') {
              const key = `cmd-${name}-${tf}`;
              const d = cmdCache[key];
              return d?.entries?.[0]?.norm || null;
          }
          return null;
      })();

      const perfStats = (() => {
          if (!normSeries?.length) return 'Performance data not available.';
          const valid = normSeries.filter(v => v != null);
          if (valid.length < 2) return 'Insufficient data points.';
          const start = valid[0];
          const end = valid[valid.length - 1];
          const change = ((end - start) / start * 100).toFixed(2);
          const max = Math.max(...valid);
          const min = Math.min(...valid);
          const maxPct = ((max - start) / start * 100).toFixed(2);
          const minPct = ((min - start) / start * 100).toFixed(2);
          return `Return over ${tf}: ${change >= 0 ? '+' : ''}${change}% | Peak: +${maxPct}% | Trough: ${minPct}%`;
      })();

      // Top stocks for sector context
      const topStocksLine = (() => {
          if (type !== 'sector') return '';
          const key = `${name}-${tf}`;
          const sd = sectorCache[key];
          if (!sd?.stocks?.length) return '';
          const top5 = sd.stocks
              .filter(s => !s.noData)
              .slice(0, 5)
              .map(s => `${s.symbol} (${parseFloat(s.ret) >= 0 ? '+' : ''}${s.ret}%)`)
              .join(', ');
          return `\nTop performers: ${top5}`;
      })();

      // Commodity instruments
      const instrumentsLine = (() => {
          if (type !== 'commodity') return '';
          const key = `cmd-${name}-${tf}`;
          const d = cmdCache[key];
          if (!d?.entries) return '';
          return `\nInstruments: ${d.entries.map(e => `${e.name} (${parseFloat(e.ret) >= 0 ? '+' : ''}${e.ret}%)`).join(', ')}`;
      })();

      // Index components
      const indicesLine = (() => {
          if (type !== 'index') return '';
          const key = `indices-${tf}`;
          const d = indexCache[key];
          if (!d) return '';
          const others = d
              .filter(i => i.name !== name)
              .slice(0, 4)
              .map(i => `${i.name} (${parseFloat(i.ret) >= 0 ? '+' : ''}${i.ret}%)`)
              .join(', ');
          return others ? `\nRelated indices for context: ${others}` : '';
      })();

      const typeLabel = {
          sector: `the ${name} stock sector (market-cap weighted index)`,
          index: `the ${name} market index`,
          commodity: `the ${name} commodity group`,
      }[type];

      const searchInstructions = {
          sector: `Search for: recent news about ${name} sector stocks, sector rotation flows, institutional activity, regulatory developments, earnings trends, and macroeconomic factors affecting ${name} companies.`,
          index: `Search for: recent news driving the ${name} index, constituent stock performance, economic data releases affecting the index, central bank policy impacts, and technical market structure.`,
          commodity: `Search for: supply and demand news for ${name} commodities, geopolitical events affecting prices, storage/inventory data, production reports, and macro factors like dollar strength and inflation.`,
      }[type];

      const compareBlock = compareTicker?.trim()
          ? `\nADDITIONAL SEARCH: Also search specifically for recent news, earnings, analyst upgrades/downgrades, and catalysts for ${compareTicker.toUpperCase()}. Include a separate paragraph in your analysis comparing how ${compareTicker.toUpperCase()} fits within the broader ${name} ${type} picture — is it leading, lagging, or diverging from the group?`
          : '';

      return `You are a professional financial analyst and market researcher. I need a comprehensive sentiment analysis for ${typeLabel}.

  CURRENT MARKET DATA (${tf} timeframe):
  - Regime: ${regime?.label || 'Unknown'} ${regime?.emoji || ''}
  - ${perfStats}${topStocksLine}${instrumentsLine}${indicesLine}
  - Timeframe analyzed: ${tf}

  YOUR TASK:
  Search for as many recent news articles as possible — aim for 15-20+ sources including Bloomberg, Reuters, WSJ, CNBC, Financial Times, Seeking Alpha, analyst reports, and sector-specific publications.
  ${searchInstructions}${compareBlock}

  After reading all articles, return ONLY a JSON object with no markdown, no backticks, no preamble:

  {
    "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
    "confidence": <integer 0-100>,
    "tldr": "<one punchy sentence — the single most important thing happening right now>",
    "themes": ["<theme1>", "<theme2>", "<theme3>", "<theme4>"],
    "summary": "<4-6 paragraph deep analysis. Reference specific articles and data points. Use **bold** for key figures and turning points. Cover: current momentum, key drivers, risks, and outlook.>",
    "catalysts": ["<catalyst 1>", "<catalyst 2>", "<catalyst 3>", "<catalyst 4>"],
    "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
    "recommendation": "<a sharp, opinionated 2-3 sentence take on what to watch for. First person. Be direct.>",
    "articleCount": <number of articles you actually found and read>,
    "sourceList": ["<source1>", "<source2>", "<source3>"]${compareTicker?.trim() ? `,\n  "stockTake": "<2-3 sentence focused take on ${compareTicker.toUpperCase()} specifically and how it relates to the broader ${name} picture>"` : ''}
  }

  Return only the JSON object. It must be parseable by JSON.parse() with no surrounding text.`;
  };

  const DrillSentimentBtn = ({ type, name, regime }) => (
      <button
          onClick={() => {
              setDrillSentimentContext({ type, name, regime });
              setDrillCompareTicker('');
              setDrillParsedAnalysis(null);
              setDrillParseError(null);
              setDrillSentimentOpen(true);
          }}
          style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: '0 3px 10px rgba(124,58,237,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 16px rgba(124,58,237,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(124,58,237,0.3)'; }}
      >
          🤖 AI Sentiment
      </button>
  );

  return (
    <div className="mp-wrap">
      {/* ── TOP BAR ── */}
      <div className="mp-topbar">
        <div className="mp-topbar-left">
          <span style={{ fontSize:20 }}>❄️</span>
          <span className="mp-title">Market Pulse</span>
          <div className="mp-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`mp-tab ${tab===t.id?'active':''}`} onClick={() => { setTab(t.id); setDrillSearch(''); }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="mp-topbar-right">
          <div className="mp-tf-strip">
            {MP_TF_LIST.map(t => (
              <button key={t.label} className={`mp-tf-btn ${tf===t.label?'active':''}`} onClick={() => setTf(t.label)}>{t.label}</button>
            ))}
          </div>
          <VoiceSelector theme="dark" />
          <button className="mp-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="mp-body">

        {/* ══ OVERVIEW ══ */}
        {tab==='overview' && (
          <>
            {overviewLoading && <div className="mp-loading"><div className="mp-spinner"/><span>Fetching market data…</span></div>}
            {!overviewLoading && !overviewData && (
              <div className="mp-empty">
                <button className="mp-fetch-btn" onClick={fetchOverview}>❄️ Load Market Overview</button>
                <p>Indices · Sector indices (market-cap weighted) · Commodity groups</p>
              </div>
            )}
            <div className="mp-drill-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: MP_SNOW.navy }}>
                      Global Indices
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                      {curIdxData?.length ?? 0} indices · {tf}
                  </span>
              </div>
                <DrillSentimentBtn
                    type="index"
                    name="Global Indices"
                    regime={(() => {
                        const key = `indices-${tf}`;
                        const d = indexCache[key];
                        if (!d?.length) return { label: 'Unknown', emoji: '' };
                        const rets = d.map(i => parseFloat(i.ret));
                        const avg = rets.reduce((a, b) => a + b, 0) / rets.length;
                        return avg > 1 ? { label: 'Bull Trend', emoji: '🟢' } :
                              avg < -1 ? { label: 'Bear Trend', emoji: '🔴' } :
                              { label: 'Ranging', emoji: '🟡' };
                    })()}
                />
            </div>
            {overviewData && !overviewLoading && (
              <>
                <div className="mp-chart-box">
                  <div ref={overviewRef} style={{ width:'100%', height:380 }} />
                  <div className="mp-chart-sub">All series normalized to 100 · {tf}</div>
                </div>
                <div className="mp-legend-grid">
                  {/* Indices */}
                  <div className="mp-legend-group">
                    <div className="mp-legend-title">📈 Indices</div>
                    {MP_INDICES.map(idx => {
                      const pts = overviewData.indices[idx.symbol]?.map(p=>p.close).filter(Boolean)||[];
                      const reg = mpRegime(pts);
                      return (
                        <div key={idx.symbol} className="mp-legend-row">
                          <span className="mp-dot" style={{ background:idx.color }}/>
                          <span className="mp-legend-name">{idx.name}</span>
                          <RegimeBadge regime={reg}/>
                          <button className="mp-drill-btn" onClick={() => { setTab('indices'); fetchIndexDrill(); }}>Drill →</button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Sectors */}
                  <div className="mp-legend-group">
                    <div className="mp-legend-title">🏭 Sectors (mkt-cap weighted)</div>
                    {sectors.map(sec => {
                      const sd2 = overviewData.sectorLines[sec];
                      const col = sectorColors[sec]||'#6b7280';
                      return (
                        <div key={sec} className="mp-legend-row">
                          <span className="mp-dot" style={{ background:col }}/>
                          <span className="mp-legend-name">{sec}</span>
                          {sd2?.regime && <RegimeBadge regime={sd2.regime}/>}
                          <button className="mp-drill-btn" onClick={() => { setTab('sector'); setActiveSector(sec); fetchSector(sec); }}>Drill →</button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Commodities */}
                  <div className="mp-legend-group">
                    <div className="mp-legend-title">🛢️ Commodity Groups</div>
                    {Object.entries(overviewData.commodities).map(([grp, pts]) => {
                      const reg = mpRegime(pts.map(p=>p.close));
                      const col = MP_COMMODITY_GROUPS[grp]?.color||'#94a3b8';
                      return (
                        <div key={grp} className="mp-legend-row">
                          <span className="mp-dot" style={{ background:col }}/>
                          <span className="mp-legend-name">{grp}</span>
                          <RegimeBadge regime={reg}/>
                          <button className="mp-drill-btn" onClick={() => { setTab('commodities'); setActiveCmdGroup(grp); fetchCmdDrill(grp); }}>Drill →</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ══ ALL SECTORS ══ */}
        {tab==='allsectors' && (
          <>
            {allSectorsLoad && <div className="mp-loading"><div className="mp-spinner"/><span>Loading all sector indices…</span></div>}
            {!allSectorsLoad && !allSectorsData && (
              <div className="mp-empty">
                <button className="mp-fetch-btn" onClick={fetchAllSectors}>❄️ Load All Sector Charts</button>
                <p>All {sectors.length} sectors normalized to 100 · market-cap weighted</p>
              </div>
            )}
            {allSectorsData && !allSectorsLoad && (
              <>
                <div className="mp-chart-box">
                  <div ref={allSecRef} style={{ width:'100%', height:420 }} />
                  <div className="mp-chart-sub">All sectors normalized to 100 · market-cap weighted · {tf}</div>
                </div>
                <div className="mp-legend-group" style={{ marginTop:8 }}>
                  <div className="mp-legend-title">Sector Regimes</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:6 }}>
                    {Object.entries(allSectorsData).map(([sec,{ regime }]) => {
                      const col = sectorColors[sec]||'#6b7280';
                      const lastNorm = (() => { const sd2=allSectorsData[sec]; if(!sd2?.norm) return null; const v=sd2.norm.filter(x=>x!=null); return v.length ? v[v.length-1]-100 : null; })();
                      return (
                        <div key={sec} className="mp-legend-row">
                          <span className="mp-dot" style={{ background:col }}/>
                          <span className="mp-legend-name">{sec}</span>
                          <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:lastNorm>=0?'#22d3ee':'#f87171' }}>
                            {lastNorm!=null ? (lastNorm>=0?'+':'')+lastNorm.toFixed(1)+'%' : ''}
                          </span>
                          <RegimeBadge regime={regime}/>
                          <button className="mp-drill-btn" onClick={() => { setTab('sector'); setActiveSector(sec); fetchSector(sec); }}>Drill →</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ══ SECTOR DRILL ══ */}
        {tab==='sector' && (
          <>
            <div className="mp-pill-strip">
              {sectors.map(sec => (
                <button key={sec} className={`mp-sector-pill ${activeSector===sec?'active':''}`}
                  style={{ '--sc': sectorColors[sec]||'#38bdf8' }}
                  onClick={() => { setActiveSector(sec); setDrillSearch(''); fetchSector(sec); setCorrOpen(false); }}>
                  {sec}
                </button>
              ))}
            </div>
              {/* ── Drill search bar ── */}
              <div className="mp-drill-search-wrap">
                <span className="mp-drill-search-icon">🔍</span>
                <input
                  type="text"
                  className="mp-drill-search"
                  placeholder="Search…"
                  value={drillSearch}
                  onChange={e => setDrillSearch(e.target.value)}
                />
                {drillSearch && (
                  <button className="mp-drill-search-clear" onClick={() => setDrillSearch('')}>✕</button>
                )}
              </div>
            {!activeSector && <div className="mp-empty"><p>👆 Select a sector above</p></div>}
            {activeSector && isLoading(curSectorKey) && <div className="mp-loading"><div className="mp-spinner"/><span>Loading {activeSector}…</span></div>}
            {activeSector && curSectorData && !isLoading(curSectorKey) && (
              <>
                {/* Header */}
                <div className="mp-drill-header">
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                    <span className="mp-dot" style={{ width:14, height:14, background:sectorColors[activeSector]||'#38bdf8' }}/>
                    <span style={{ fontWeight:800, fontSize:16, color: MP_SNOW.navy }}>{activeSector}</span>
                    <RegimeBadge regime={curSectorData.regime}/>
                    <span style={{ fontSize:11, color:'#64748b' }}>{curSectorData.stocks.filter(s=>!s.noData).length} stocks · {tf}</span>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                    <button
                      onClick={() => setShowAllStocks(s => !s)}
                      style={{ padding:'6px 13px', border:'1.5px solid #bae6fd', borderRadius:8, background: showAllStocks ? '#0ea5e9' : 'white', color: showAllStocks ? 'white' : '#0369a1', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.14s', whiteSpace:'nowrap' }}>
                      {showAllStocks ? '📉 Hide Stocks' : '📈 Show Stocks'}
                    </button>
                    <button className="mp-corr-btn" onClick={() => fetchCorr(activeSector)} disabled={corrLoading[curSectorKey]}>
                      {corrLoading[curSectorKey] ? <><div className="mp-spinner-sm"/>Computing…</> : '🔗 Correlate All'}
                    </button>
                    <DrillSentimentBtn type="sector" name={activeSector} regime={curSectorData.regime} />
                  </div>
                </div>

                {/* Chart */}
                <div className="mp-chart-box">
                  <div ref={drillRef} style={{ width:'100%', height:340 }} />
                  <div className="mp-chart-sub">
                    <span style={{ color:sectorColors[activeSector]||'#38bdf8' }}>━━</span> Sector index &nbsp;
                    <span style={{ color:'#22d3ee' }}>─</span> Following &nbsp;
                    <span style={{ color:'#f87171' }}>─</span> Diverging &nbsp;
                    <span style={{ color:'#475569' }}>─</span> Neutral
                  </div>
                </div>

                {/* Filters + global MSS lookback */}
                <div className="mp-filter-bar">
                  <select className="mp-sel" value={clsFilter} onChange={e => setClsFilter(e.target.value)}>
                    <option value="all">All Behaviour</option>
                    <option value="Following">✅ Following</option>
                    <option value="Diverging">⚠️ Diverging</option>
                    <option value="Neutral">〰️ Neutral</option>
                  </select>
                  <select className="mp-sel" value={mssFilter} onChange={e => setMssFilter(e.target.value)}>
                    <option value="all">All MSS</option>
                    <option value="stable">🟢 Stable (≥47)</option>
                    <option value="choppy">🟡 Choppy (30–47)</option>
                    <option value="volatile">🔴 Volatile (&lt;30)</option>
                  </select>
                  <select className="mp-sel" value={r2Filter} onChange={e => setR2Filter(e.target.value)}>
                    <option value="all">All R²</option>
                    <option value="high">High R² (≥0.7)</option>
                    <option value="medium">Medium R² (0.4–0.7)</option>
                    <option value="low">Low R² (&lt;0.4)</option>
                  </select>
                  <div className="mp-lb-wrap">
                    <span style={{ fontSize:11, color:'#0369a1', fontWeight:700, whiteSpace:'nowrap' }}>MSS Lookback:</span>
                    <input type="number" min="5" max="730" value={lbInput} onChange={e=>setLbInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter'){
                        const v=parseInt(lbInput)||60;
                        setMssLookback(v);
                        const syms = filteredStocks.map(s=>s.symbol);
                        if(syms.length) fetchMSSForSymbols(syms, true);
                      }}}
                      className="mp-lb-input" placeholder="days"/>
                    <button className="mp-lb-apply" onClick={()=>{
                      const v=parseInt(lbInput)||60;
                      setMssLookback(v);
                      const syms = filteredStocks.map(s=>s.symbol);
                      if(syms.length) fetchMSSForSymbols(syms, true);
                    }}>Apply</button>
                  </div>
                  <span className="mp-count">{filteredStocks.length} / {curSectorData.stocks.filter(s=>!s.noData).length} ({curSectorData.stocks.length} total)</span>
                </div>

                {/* Stock table */}
                <div className="mp-table">
                  <div className="mp-table-head">
                    <span>Ticker</span><span>Return</span><span>Behaviour</span><span>Regime</span><span>MSS</span><span>R²</span>
                  </div>
                  {filteredStocks.map(stock => {
                    const mss = mssCache[stock.symbol];
                    const isPanelOpen = openPanels.has(stock.symbol);
                    return (
                      <React.Fragment key={stock.symbol}>
                        <div className={`mp-table-row ${isPanelOpen ? 'mp-table-row-active' : ''}`}>
                          <span className="mp-sym">{stock.symbol}</span>
                          <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:parseFloat(stock.ret)>=0?'#22d3ee':'#f87171' }}>
                            {parseFloat(stock.ret)>=0?'+':''}{stock.ret}%
                          </span>
                          <span className="mp-cls-badge" style={{ background:stock.cls.color+'22', color:stock.cls.color, border:`1px solid ${stock.cls.color}44` }}>
                            {stock.cls.emoji} {stock.cls.label}
                          </span>
                          <RegimeBadge regime={stock.regime}/>
                          {mssLoading[stock.symbol]
                            ? <span style={{ fontSize:10, color:'#94a3b8' }}>…</span>
                            : <MssBadge mss={mss?.mss}/>
                          }
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <R2Badge r2={mss?.r_squared}/>
                            <SpeakBtn
                              text={stock.symbol+'. Return: '+stock.ret+' percent. '+stock.cls.label+'. Regime: '+stock.regime.label+(mss?' MSS '+mss.mss+' R squared '+mss.r_squared?.toFixed(2):'')}
                              label="🔊" style={{ padding:'2px 5px', fontSize:10 }}
                            />
                            <button
                              className={`adp-open-btn ${isPanelOpen ? 'active' : ''}`}
                              onClick={e=>{ e.stopPropagation(); togglePanel(stock.symbol); }}
                              title="View chart & data"
                            >📊</button>
                          </div>
                        </div>
                        {isPanelOpen && (
                          <AssetDetailPanel
                            key={`panel-${stock.symbol}`}
                            symbol={stock.symbol}
                            baseUrl={baseUrl}
                            defaultLookback={mssLookback}
                            onClose={() => togglePanel(stock.symbol)}
                            embedded
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {/* Correlation section */}
                {corrOpen && (
                  <div className="mp-corr-section">
                    <div className="mp-corr-head">
                      <span style={{ fontWeight:800, fontSize:13, color: MP_SNOW.navy }}>🔗 {activeSector} Correlations</span>
                      {curCorrData && (
                        <span className="mp-avg-badge" style={{ background: curCorrData.avgCorr>0.5?'#dcfce7':curCorrData.avgCorr<0?'#fee2e2':'#fef9c3', color:curCorrData.avgCorr>0.5?'#15803d':curCorrData.avgCorr<0?'#b91c1c':'#854d0e' }}>
                          Avg ρ = {curCorrData.avgCorr>=0?'+':''}{curCorrData.avgCorr.toFixed(3)}
                        </span>
                      )}
                      <button onClick={() => setCorrOpen(false)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:16 }}>✕</button>
                    </div>
                    {corrLoading[curSectorKey] && <div className="mp-loading"><div className="mp-spinner"/><span>Computing…</span></div>}
                    {curCorrData && !corrLoading[curSectorKey] && (
                      <>
                        {/* Heatmap header + search/filter controls */}
                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                            <span style={{ fontSize:11, fontWeight:700, color:'#64748b' }}>Correlation Heatmap</span>
                            {/* Heatmap search */}
                            <div style={{ display:'flex', alignItems:'center', background:'white', border:'1.5px solid #bae6fd', borderRadius:7, padding:'0 8px', flex:'1 1 120px', minWidth:0, transition:'border-color 0.15s' }}
                              onFocusCapture={e=>e.currentTarget.style.borderColor='#0ea5e9'}
                              onBlurCapture={e=>e.currentTarget.style.borderColor='#bae6fd'}>
                              <span style={{ fontSize:11, flexShrink:0 }}>🔍</span>
                              <input
                                placeholder="Search ticker in heatmap…"
                                value={heatSearch}
                                onChange={e => setHeatSearch(e.target.value)}
                                style={{ border:'none', outline:'none', fontSize:11, padding:'6px 6px', flex:1, minWidth:0, background:'transparent', color:'#0c4a6e' }}
                              />
                              {heatSearch && <button onClick={() => setHeatSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:12, padding:'0 2px', lineHeight:1 }}>✕</button>}
                            </div>
                            {/* Min |ρ| threshold */}
                            <div style={{ display:'flex', alignItems:'center', gap:5, background:'white', border:'1.5px solid #bae6fd', borderRadius:7, padding:'4px 8px', flexShrink:0 }}>
                              <span style={{ fontSize:10, color:'#0369a1', fontWeight:700, whiteSpace:'nowrap' }}>Min |ρ|</span>
                              <input
                                type="number" min="0" max="1" step="0.05"
                                placeholder="0.00"
                                value={heatThresh}
                                onChange={e => setHeatThresh(e.target.value)}
                                style={{ width:52, border:'none', outline:'none', fontSize:11, fontFamily:'monospace', fontWeight:700, background:'transparent', color:'#0c4a6e', padding:0 }}
                              />
                              {heatThresh && <button onClick={() => setHeatThresh('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:11, padding:'0 2px', lineHeight:1 }}>✕</button>}
                            </div>
                            <SpeakBtn
                              text={'Correlation heatmap for ' + activeSector + '. Average correlation: ' + (curCorrData.avgCorr >= 0 ? 'positive ' : 'negative ') + Math.abs(curCorrData.avgCorr).toFixed(2) + '. Top pairs: ' + filteredCorr.slice(0,3).map(c => c.a + ' and ' + c.b + ' at ' + c.score.toFixed(2)).join(', ')}
                              label="🔊"
                              style={{ padding:'4px 8px' }}
                            />
                          </div>
                          {/* Heatmap grid */}
                          <div style={{ overflowX:'auto' }}>
                            <div style={{ display:'grid', gap:2, gridTemplateColumns:'repeat('+String(curCorrData.tickers.length+1)+', minmax(20px,1fr))', minWidth:300 }}>
                              <div/>
                              {curCorrData.tickers.map(t => {
                                const hl = heatSearch && t.toLowerCase().includes(heatSearch.toLowerCase());
                                return <div key={t} style={{ fontSize:7, fontWeight:700, color: hl ? '#0ea5e9' : '#64748b', textAlign:'center', overflow:'hidden', background: hl ? '#e0f2fe' : 'transparent', borderRadius:2 }}>{t}</div>;
                              })}
                              {curCorrData.tickers.map(rowT => {
                                const rowHl = heatSearch && rowT.toLowerCase().includes(heatSearch.toLowerCase());
                                const minAbs = heatThresh ? parseFloat(heatThresh) || 0 : 0;
                                return (
                                  <React.Fragment key={rowT}>
                                    <div style={{ fontSize:7, fontWeight:700, color: rowHl ? '#0ea5e9' : '#64748b', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:3, background: rowHl ? '#e0f2fe' : 'transparent', borderRadius:2 }}>{rowT}</div>
                                    {curCorrData.tickers.map(colT => {
                                      if (rowT===colT) return <div key={colT} style={{ background:'#1e293b', borderRadius:2, height:20 }}/>;
                                      const entry = curCorrData.matrix.find(m=>(m.a===rowT&&m.b===colT)||(m.a===colT&&m.b===rowT));
                                      const s   = entry ? entry.score : 0;
                                      const abs = Math.abs(s);
                                      // Dim cells below threshold or not matching search
                                      const colHl  = heatSearch && colT.toLowerCase().includes(heatSearch.toLowerCase());
                                      const passes = abs >= minAbs && (!heatSearch || rowHl || colHl);
                                      const bg = passes
                                        ? (s>0 ? 'rgba(34,211,238,'+(0.15+abs*0.7)+')' : 'rgba(248,113,113,'+(0.15+abs*0.7)+')')
                                        : 'rgba(100,116,139,0.08)';
                                      const textCol = passes ? '#fff' : '#cbd5e1';
                                      return (
                                        <div key={colT}
                                          onClick={() => { if(passes && entry) setCompareModal({ symA:rowT, symB:colT, score:s }); }}
                                          title={rowT+' ↔ '+colT+': '+(s>=0?'+':'')+s.toFixed(3)+(passes?' — click to compare':'')}
                                          style={{ background:bg, borderRadius:2, height:20, cursor: passes ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, fontWeight:700, color:textCol, transition:'transform 0.1s', outline: (rowHl||colHl)&&passes ? '1.5px solid #0ea5e9' : 'none' }}
                                          onMouseEnter={e2=>{ if(passes) e2.currentTarget.style.transform='scale(1.2)'; }}
                                          onMouseLeave={e2=>{ e2.currentTarget.style.transform='scale(1)'; }}
                                        >{passes && abs>0.4 ? (s>=0?'+':'')+s.toFixed(1) : ''}</div>
                                      );
                                    })}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        {/* Filters + cards */}
                        <div className="mp-corr-filters">
                          <input placeholder="🔍 Search cards…" value={corrSearch} onChange={e=>setCorrSearch(e.target.value)} className="mp-corr-search"/>
                          <select value={corrFilter} onChange={e=>setCorrFilter(e.target.value)} className="mp-sel">
                            <option value="all">All</option>
                            <option value="strong_pos">Strong Positive (&gt;0.8)</option>
                            <option value="strong_neg">Strong Negative (&lt;-0.8)</option>
                            <option value="positive">Positive (&gt;0.5)</option>
                            <option value="negative">Negative (&lt;-0.5)</option>
                            <option value="weak">Weak (±0.3)</option>
                          </select>
                          <span className="mp-count">{filteredCorr.length} pairs</span>
                        </div>
                        <div className="mp-corr-cards">
                          {filteredCorr.slice(0,200).map(c => {
                            const id=`${c.a}__${c.b}`, s=c.score, col2=s>0.5?'#22d3ee':s<-0.5?'#f87171':'#94a3b8';
                            return (
                              <div key={id} className="mp-corr-card" style={{ borderLeft:`3px solid ${col2}` }} onClick={()=>setCorrExpanded(p=>({...p,[id]:!p[id]}))}>
                                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                  <span style={{ fontWeight:800, fontSize:11, color: MP_SNOW.navy }}>{c.a}</span>
                                  <span style={{ fontSize:9, color:'#94a3b8' }}>↔</span>
                                  <span style={{ fontWeight:700, fontSize:11, color:'#475569' }}>{c.b}</span>
                                  <span style={{ marginLeft:'auto', fontFamily:'monospace', fontSize:11, fontWeight:800, color:col2, background:col2+'18', padding:'2px 7px', borderRadius:5 }}>{s>=0?'+':''}{s.toFixed(3)}</span>
                                  <SpeakBtn text={c.a+' and '+c.b+': correlation '+(s>=0?'positive ':'negative ')+Math.abs(s).toFixed(2)} label="🔊" style={{ padding:'1px 5px', fontSize:10 }}/>
                                  <span style={{ fontSize:9, color:'#cbd5e1' }}>{corrExpanded[id]?'▼':'▶'}</span>
                                </div>
                                {corrExpanded[id] && (
                                  <div style={{ paddingTop:8 }}>
                                    <div style={{ width:'100%', height:5, background:'#f1f5f9', borderRadius:3, position:'relative', overflow:'hidden' }}>
                                      <div style={{ position:'absolute', left:'50%', top:0, width:1.5, height:'100%', background:'#e2e8f0' }}/>
                                      <div style={{ position:'absolute', height:'100%', borderRadius:3, background:col2, width:`${Math.abs(s)*50}%`, left:s>=0?'50%':`${50-Math.abs(s)*50}%` }}/>
                                    </div>
                                    <div style={{ fontSize:9, color:'#64748b', marginTop:4 }}>
                                      {s>0.8?'Strong Positive':s>0.5?'Positive':s>0.3?'Weak Positive':s<-0.8?'Strong Inverse':s<-0.5?'Inverse':s<-0.3?'Weak Inverse':'No Relationship'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ══ INDICES DRILL ══ */}
        {tab==='indices' && (
          <>
            {isLoading(`indices-${tf}`) && <div className="mp-loading"><div className="mp-spinner"/><span>Loading indices…</span></div>}
            {!isLoading(`indices-${tf}`) && !curIdxData && (
              <div className="mp-empty"><button className="mp-fetch-btn" onClick={fetchIndexDrill}>❄️ Load Indices</button></div>
            )}
            {curIdxData && !isLoading(`indices-${tf}`) && (
              <>
              {/* ── Drill search bar ── */}
              <div className="mp-drill-search-wrap">
                <span className="mp-drill-search-icon">🔍</span>
                <input
                  type="text"
                  className="mp-drill-search"
                  placeholder="Search…"
                  value={drillSearch}
                  onChange={e => setDrillSearch(e.target.value)}
                />
                {drillSearch && (
                  <button className="mp-drill-search-clear" onClick={() => setDrillSearch('')}>✕</button>
                )}
              </div>

                <div className="mp-chart-box">
                  <div ref={idxDrillRef} style={{ width:'100%', height:340 }} />
                  <div className="mp-chart-sub">All indices normalized to 100 · {tf}</div>
                </div>
                <div className="mp-table">
                  <div className="mp-table-head">
                    <span>Index</span><span>Return ({tf})</span><span>Regime</span><span>MSS</span><span>R²</span>
                  </div>
                  <div style={{ padding:'0 0 6px', fontSize:11, color:'#0369a1', fontWeight:600 }}>{filteredIndices.length} / {curIdxData.length} indices</div>
                  {filteredIndices.map(idx => {
                    const mss = mssCache[idx.symbol];
                    return (
                      <React.Fragment key={idx.symbol}>
                        <div className="mp-table-row">
                          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                            <span className="mp-dot" style={{ background:idx.color, width:8, height:8 }}/>
                            <span className="mp-sym">{idx.name}</span>
                          </div>
                          <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:parseFloat(idx.ret)>=0?'#22d3ee':'#f87171' }}>
                            {parseFloat(idx.ret)>=0?'+':''}{idx.ret}%
                          </span>
                          <RegimeBadge regime={idx.regime}/>
                          {mssLoading[idx.symbol] ? <span style={{ fontSize:10, color:'#94a3b8' }}>…</span> : <MssBadge mss={mss?.mss}/>}
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <R2Badge r2={mss?.r_squared}/>
                            <button
                              className={`adp-open-btn ${openPanels.has(idx.symbol)?'active':''}`}
                              onClick={e=>{ e.stopPropagation(); togglePanel(idx.symbol); }}
                              title="View chart & data"
                            >📊</button>
                          </div>
                        </div>
                        {openPanels.has(idx.symbol) && (
                          <AssetDetailPanel
                            key={`panel-${idx.symbol}`}
                            symbol={idx.symbol}
                            baseUrl={baseUrl}
                            defaultLookback={mssLookback}
                            onClose={() => togglePanel(idx.symbol)}
                            embedded
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* ══ COMMODITIES DRILL ══ */}
        {tab==='commodities' && (
          <>
            <div className="mp-pill-strip">
              {Object.entries(MP_COMMODITY_GROUPS).map(([grp,g]) => (
                <button key={grp} className={`mp-sector-pill ${activeCmdGroup===grp?'active':''}`}
                  style={{ '--sc': g.color }}
                  onClick={() => { setActiveCmdGroup(grp); setDrillSearch(''); fetchCmdDrill(grp); }}>
                  {grp}
                </button>
              ))}
            </div>
              {/* ── Drill search bar ── */}
              <div className="mp-drill-search-wrap">
                <span className="mp-drill-search-icon">🔍</span>
                <input
                  type="text"
                  className="mp-drill-search"
                  placeholder="Search…"
                  value={drillSearch}
                  onChange={e => setDrillSearch(e.target.value)}
                />
                {drillSearch && (
                  <button className="mp-drill-search-clear" onClick={() => setDrillSearch('')}>✕</button>
                )}
              </div>
            {!activeCmdGroup && <div className="mp-empty"><p>👆 Select a commodity group above</p></div>}
            {activeCmdGroup && isLoading(`cmd-${activeCmdGroup}-${tf}`) && <div className="mp-loading"><div className="mp-spinner"/><span>Loading {activeCmdGroup}…</span></div>}
            {activeCmdGroup && curCmdData && !isLoading(`cmd-${activeCmdGroup}-${tf}`) && (
              <>
                <div className="mp-drill-header">
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                    <span className="mp-dot" style={{ width:14, height:14, background:curCmdData.color }}/>
                    <span style={{ fontWeight:800, fontSize:16, color: MP_SNOW.navy }}>{activeCmdGroup}</span>
                    <span style={{ fontSize:11, color:'#64748b' }}>{curCmdData.entries.length} instruments · {tf}</span>
                  </div>
                </div>
                <DrillSentimentBtn type="commodity" name={activeCmdGroup} regime={curCmdData.entries?.[0] ? mpRegime(curCmdData.entries[0].vals) : { label: 'Unknown', emoji: '' }} />
                <div className="mp-chart-box">
                  <div ref={cmdDrillRef} style={{ width:'100%', height:320 }} />
                  <div className="mp-chart-sub">Normalized to 100 · {tf}</div>
                </div>
                <div className="mp-table">
                  <div className="mp-table-head">
                    <span>Instrument</span><span>Return ({tf})</span><span>Regime</span><span>MSS</span><span>R²</span>
                  </div>
                  <div style={{ padding:'0 0 6px', fontSize:11, color:'#0369a1', fontWeight:600 }}>{filteredCmdEntries.length} / {curCmdData.entries.length} instruments</div>
                  {filteredCmdEntries.map(e => {
                    const mss = mssCache[e.symbol];
                    return (
                      <React.Fragment key={e.symbol}>
                        <div className="mp-table-row">
                          <div>
                            <span className="mp-sym">{e.name}</span>
                            <span style={{ fontSize:9, color:'#94a3b8', marginLeft:5 }}>{e.symbol}</span>
                          </div>
                          <span style={{ fontFamily:'monospace', fontSize:12, fontWeight:700, color:parseFloat(e.ret)>=0?'#22d3ee':'#f87171' }}>
                            {parseFloat(e.ret)>=0?'+':''}{e.ret}%
                          </span>
                          <RegimeBadge regime={e.regime}/>
                          {mssLoading[e.symbol] ? <span style={{ fontSize:10, color:'#94a3b8' }}>…</span> : <MssBadge mss={mss?.mss}/>}
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <R2Badge r2={mss?.r_squared}/>
                            <button
                              className={`adp-open-btn ${openPanels.has(e.symbol)?'active':''}`}
                              onClick={e2=>{ e2.stopPropagation(); togglePanel(e.symbol); }}
                              title="View chart & data"
                            >📊</button>
                          </div>
                        </div>
                        {openPanels.has(e.symbol) && (
                          <AssetDetailPanel
                            key={`panel-${e.symbol}`}
                            symbol={e.symbol}
                            baseUrl={baseUrl}
                            defaultLookback={mssLookback}
                            onClose={() => togglePanel(e.symbol)}
                            embedded
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

      </div>{/* mp-body */}

      {/* ── Heatmap Comparison Modal ── */}
      {compareModal && (
        <MpCompareModal
          symA={compareModal.symA}
          symB={compareModal.symB}
          score={compareModal.score}
          baseUrl={baseUrl}
          onClose={() => setCompareModal(null)}
        />
      )}
      {/* ── DRILL SENTIMENT MODAL ── */}
{drillSentimentOpen && drillSentimentContext && (
    <div
        onClick={() => setDrillSentimentOpen(false)}
        style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10010, padding: '20px',
            backdropFilter: 'blur(4px)',
        }}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                width: 'min(700px, 100%)',
                maxHeight: '88vh',
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                backgroundColor: '#fff',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                animation: 'esi-modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            }}
        >
            {/* Header */}
            <div style={{
                padding: '18px 22px 14px',
                background: 'linear-gradient(135deg, #0f172a, #4c1d95)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 18 }}>🤖</span>
                            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                                AI Sentiment — {drillSentimentContext.name}
                            </span>
                            {drillSentimentContext.regime && (
                                <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    padding: '2px 9px', borderRadius: 20,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    color: '#fff',
                                }}>
                                    {drillSentimentContext.regime.emoji} {drillSentimentContext.regime.label}
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                            Copy prompt → paste into any AI → copy their JSON response → hit Paste Response
                        </div>
                    </div>
                    <button
                        onClick={() => setDrillSentimentOpen(false)}
                        style={{
                            background: 'rgba(255,255,255,0.12)', border: 'none',
                            borderRadius: '50%', width: 32, height: 32,
                            color: '#fff', fontSize: 17, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >×</button>
                </div>

                {/* Optional comparison ticker input */}
                <div style={{
                    marginTop: 14,
                    display: 'flex', alignItems: 'center', gap: 8,
                    flexWrap: 'wrap',
                }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        + Include stock comparison (optional):
                    </span>
                    <input
                        type="text"
                        value={drillCompareTicker}
                        onChange={e => setDrillCompareTicker(e.target.value.toUpperCase())}
                        placeholder="e.g. AAPL, NVDA, TSLA..."
                        maxLength={10}
                        style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1.5px solid rgba(255,255,255,0.25)',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: 13, fontWeight: 600,
                            outline: 'none', width: 160,
                            fontFamily: "'IBM Plex Mono', monospace",
                        }}
                        onFocus={e => e.target.style.borderColor = '#a78bfa'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
                    />
                    {drillCompareTicker && (
                        <span style={{ fontSize: 11, color: '#a78bfa' }}>
                            AI will search {drillCompareTicker} separately and synthesise
                        </span>
                    )}
                </div>
            </div>

            {/* Prompt preview — scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: 16,
                    fontSize: 12,
                    lineHeight: 1.7,
                    color: '#334155',
                    fontFamily: "'IBM Plex Mono', monospace",
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {buildDrillPrompt(drillSentimentContext, drillCompareTicker)}
                </div>

                {/* Perplexity tip */}
                <div style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    backgroundColor: 'rgba(32,178,170,0.07)',
                    border: '1px solid rgba(32,178,170,0.25)',
                    borderRadius: 9,
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                    <div style={{ fontSize: 12, color: '#0f766e', lineHeight: 1.55 }}>
                        <strong>Perplexity is best here</strong> — it actually searches the web in real time and pulls fresh articles automatically. The others need browsing mode enabled to do the same.
                    </div>
                </div>

                {/* Parsed analysis result — shown after pasting */}
                {drillParsedAnalysis && (
                    <div id="drill-parsed-result" style={{ marginTop: 16 }}>
                        {/* Bias header */}
                        {(() => {
                            const bColors = { BULLISH: '#10b981', BEARISH: '#ef4444', NEUTRAL: '#f59e0b', MIXED: '#2563eb' };
                            const bIcons  = { BULLISH: '📈', BEARISH: '📉', NEUTRAL: '➡️', MIXED: '🔀' };
                            const bc = bColors[drillParsedAnalysis.bias] || '#2563eb';
                            return (
                                <div style={{
                                    padding: '14px 16px',
                                    backgroundColor: bc + '10',
                                    border: `2px solid ${bc}30`,
                                    borderLeft: `4px solid ${bc}`,
                                    borderRadius: 12, marginBottom: 12,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 16 }}>{bIcons[drillParsedAnalysis.bias]}</span>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: bc }}>{drillParsedAnalysis.bias}</span>
                                        <span style={{ backgroundColor: bc, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20 }}>
                                            {drillParsedAnalysis.confidence}% confidence
                                        </span>
                                        {drillParsedAnalysis.articleCount && (
                                            <span style={{ fontSize: 11, color: '#888' }}>
                                                · {drillParsedAnalysis.articleCount} articles
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                                        {drillParsedAnalysis.tldr}
                                    </div>
                                    {/* Themes */}
                                    {drillParsedAnalysis.themes?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                                            {drillParsedAnalysis.themes.map((t, i) => (
                                                <span key={i} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {/* Summary */}
                                    {drillParsedAnalysis.summary && (
                                        <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7, backgroundColor: '#fff', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 10 }}
                                            dangerouslySetInnerHTML={{ __html: drillParsedAnalysis.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                                        />
                                    )}
                                    {/* Stock take if present */}
                                    {drillParsedAnalysis.stockTake && (
                                        <div style={{ padding: '10px 14px', backgroundColor: '#faf5ff', border: '1px solid #ddd6fe', borderLeft: '3px solid #7c3aed', borderRadius: 8, marginBottom: 10 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em', marginBottom: 4 }}>
                                                🔍 {drillCompareTicker} TAKE
                                            </div>
                                            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>
                                                {drillParsedAnalysis.stockTake}
                                            </div>
                                        </div>
                                    )}
                                    {/* Catalysts + Risks side by side */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {drillParsedAnalysis.catalysts?.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.07em', marginBottom: 6 }}>🚀 CATALYSTS</div>
                                                {drillParsedAnalysis.catalysts.map((c, i) => (
                                                    <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 4, display: 'flex', gap: 6 }}>
                                                        <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>{c}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {drillParsedAnalysis.risks?.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: '0.07em', marginBottom: 6 }}>⚠️ RISKS</div>
                                                {drillParsedAnalysis.risks.map((r, i) => (
                                                    <div key={i} style={{ fontSize: 12, color: '#333', marginBottom: 4, display: 'flex', gap: 6 }}>
                                                        <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>▼</span>{r}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Recommendation */}
                                    {drillParsedAnalysis.recommendation && (
                                        <div style={{ marginTop: 10, padding: '10px 14px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '3px solid #2563eb', borderRadius: 8, fontSize: 13, color: '#1e3a5f', fontStyle: 'italic', lineHeight: 1.6 }}>
                                            {drillParsedAnalysis.recommendation}
                                        </div>
                                    )}
                                    {/* Source list */}
                                    {drillParsedAnalysis.sourceList?.length > 0 && (
                                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                            {drillParsedAnalysis.sourceList.map((s, i) => (
                                                <span key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '14px 22px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', gap: 12,
                flexShrink: 0,
                backgroundColor: '#f8fafc',
            }}>
                {/* AI Launchers */}
                <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 8 }}>
                        OPEN DIRECTLY IN (prompt auto-filled)
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                            { name: 'Perplexity', icon: '🔍', color: '#20b2aa', bg: 'rgba(32,178,170,0.08)', border: 'rgba(32,178,170,0.35)', getUrl: p => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
                            { name: 'ChatGPT',    icon: '✦',  color: '#10a37f', bg: 'rgba(16,163,127,0.08)', border: 'rgba(16,163,127,0.35)', getUrl: p => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
                            { name: 'Gemini',     icon: '✦',  color: '#4285f4', bg: 'rgba(66,133,244,0.08)', border: 'rgba(66,133,244,0.35)', getUrl: p => `https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
                            { name: 'Claude',     icon: '◆',  color: '#cc785c', bg: 'rgba(204,120,92,0.08)', border: 'rgba(204,120,92,0.35)', getUrl: p => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
                        ].map(({ name, icon, color, bg, border, getUrl }) => (
                            <button
                                key={name}
                                onClick={() => window.open(getUrl(buildDrillPrompt(drillSentimentContext, drillCompareTicker)), '_blank')}
                                style={{
                                    padding: '8px 14px', borderRadius: 9,
                                    border: `1.5px solid ${border}`,
                                    backgroundColor: bg, color,
                                    fontWeight: 700, fontSize: 13,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${border}`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <span style={{ fontSize: 14 }}>{icon}</span> {name}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ height: 1, backgroundColor: '#e2e8f0' }} />

                {/* Copy + Paste row */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(buildDrillPrompt(drillSentimentContext, drillCompareTicker));
                            setDrillCopied(true);
                            setTimeout(() => setDrillCopied(false), 2000);
                        }}
                        style={{
                            flex: 1, padding: 10,
                            background: drillCopied
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                            border: 'none', borderRadius: 9,
                            color: '#fff', fontWeight: 700, fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            transition: 'background 0.25s',
                        }}
                    >
                        {drillCopied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Prompt</>}
                    </button>
                    <button
                        onClick={() => { setDrillSentimentOpen(false); setDrillPasteOpen(true); setDrillParseError(null); }}
                        style={{
                            flex: 1, padding: 10,
                            backgroundColor: '#fff',
                            border: '2px solid #7c3aed',
                            borderRadius: 9, color: '#7c3aed',
                            fontWeight: 700, fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf5ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        <span>📥</span> Paste Response
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

{/* ── DRILL PASTE MODAL ── */}
{drillPasteOpen && (
    <div
        onClick={() => { setDrillPasteOpen(false); setDrillParseError(null); }}
        style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10010, padding: 20,
            backdropFilter: 'blur(4px)',
        }}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                width: 'min(640px, 100%)',
                borderRadius: 16, overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                display: 'flex', flexDirection: 'column',
                animation: 'esi-modal-in 0.2s ease',
            }}
        >
            <div style={{
                padding: '18px 22px 14px',
                background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                            📥 Paste AI Response
                            {drillSentimentContext && <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>— {drillSentimentContext.name}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                            Paste the raw JSON the AI returned. It will be validated and displayed inline.
                        </div>
                    </div>
                    <button
                        onClick={() => { setDrillPasteOpen(false); setDrillParseError(null); }}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >×</button>
                </div>
            </div>

            <div style={{ padding: '18px 22px 0' }}>
                <textarea
                    autoFocus
                    value={drillPasteText}
                    onChange={e => { setDrillPasteText(e.target.value); setDrillParseError(null); }}
                    placeholder={'Paste the JSON here. Should start with {\n  "bias": "BULLISH",\n  "confidence": 82,\n  ...\n}'}
                    style={{
                        width: '100%', height: 240,
                        padding: 14, borderRadius: 10,
                        border: `2px solid ${drillParseError ? '#ef4444' : '#ddd6fe'}`,
                        fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
                        lineHeight: 1.6, resize: 'vertical', outline: 'none',
                        boxSizing: 'border-box', color: '#1a1a1a',
                        backgroundColor: drillParseError ? '#fef2f2' : '#faf5ff',
                        transition: 'border-color 0.15s',
                    }}
                />
                {drillParseError && (
                    <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#b91c1c', lineHeight: 1.5 }}>
                        ⚠️ {drillParseError}
                    </div>
                )}
            </div>

            <div style={{ padding: 18, display: 'flex', gap: 10 }}>
                <button
                    onClick={() => {
                        setDrillParseError(null);
                        if (!drillPasteText.trim()) { setDrillParseError('Paste the JSON response first.'); return; }
                        let parsed;
                        try {
                            const clean = drillPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();
                            parsed = JSON.parse(clean);
                        } catch (e) {
                            setDrillParseError(`Invalid JSON — ${e.message}. Make sure you copied the full response.`);
                            return;
                        }
                        const required = ['bias', 'confidence', 'tldr', 'summary'];
                        const missing = required.filter(k => parsed[k] == null);
                        if (missing.length) { setDrillParseError(`Missing required fields: ${missing.join(', ')}`); return; }
                        parsed.bias = String(parsed.bias).toUpperCase();
                        if (!['BULLISH','BEARISH','NEUTRAL','MIXED'].includes(parsed.bias)) parsed.bias = 'MIXED';
                          setDrillParsedAnalysis(parsed);
                          setDrillPasteText('');
                          setDrillPasteOpen(false);
                          setDrillSentimentOpen(true);
                          // Auto-scroll to parsed result after modal re-renders
                          setTimeout(() => {
                              const el = document.getElementById('drill-parsed-result');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                    }}
                    disabled={!drillPasteText.trim()}
                    style={{
                        flex: 1, padding: 11,
                        background: !drillPasteText.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                        border: 'none', borderRadius: 9,
                        color: '#fff', fontWeight: 700, fontSize: 14,
                        cursor: !drillPasteText.trim() ? 'not-allowed' : 'pointer',
                        transition: 'background 0.15s',
                    }}
                >✓ Parse &amp; Display</button>
                <button
                    onClick={() => { setDrillPasteOpen(false); setDrillSentimentOpen(true); }}
                    style={{ padding: '11px 16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 9, color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >← Back</button>
            </div>
        </div>
    </div>
)}
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


          {/* ── GLOBAL MARKET SCAN ── */}
          <GlobalMarketScan baseUrl={baseUrl} />

          {/* ── MARKET PULSE ── */}
          <MarketPulse
            baseUrl={baseUrl}
            allStocks={allStocks}
            sectorColors={SECTOR_COLORS}
          />

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

        /* ════════════════════════════════════════
           MARKET PULSE — SnowAI (ice blue + white)
        ════════════════════════════════════════ */

        /* Open button */
        .mp-open-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; margin: 16px 0;
          background: linear-gradient(135deg, #0ea5e9, #38bdf8);
          color: white; border: none; border-radius: 10px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 18px rgba(14,165,233,0.35);
          transition: all 0.2s;
        }
        .mp-open-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(14,165,233,0.45); }
        .mp-open-badge { background: rgba(255,255,255,0.3); color: white; font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 800; }

        /* Container */
        /* ── LAYOUT ROOT ── */
        .mp-wrap {
          background: #ffffff; border: 1.5px solid #bae6fd;
          border-radius: 16px; margin: 0 0 20px;
          overflow: hidden; box-shadow: 0 4px 28px rgba(14,165,233,0.1);
          max-width: 100%; box-sizing: border-box;
        }
        /* ── TOP BAR ── */
        .mp-topbar {
          display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 14px;
          background: linear-gradient(135deg, #0c4a6e, #0369a1);
          border-bottom: 1px solid #0284c7; box-sizing: border-box; width: 100%;
        }
        .mp-topbar-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1 1 auto; min-width: 0; }
        .mp-topbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: 1 1 auto; min-width: 0; justify-content: flex-end; }
        .mp-title { font-weight: 800; font-size: 14px; color: #e0f2fe; font-family: 'IBM Plex Mono', monospace; white-space: nowrap; flex-shrink: 0; }
        .mp-tabs { display: flex; gap: 2px; background: rgba(0,0,0,0.2); border-radius: 9px; padding: 3px; flex-wrap: wrap; min-width: 0; }
        .mp-tab { padding: 5px 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 700; color: #7dd3fc; background: transparent; transition: all 0.14s; white-space: nowrap; flex-shrink: 0; }
        .mp-tab:hover { background: rgba(255,255,255,0.1); color: #e0f2fe; }
        .mp-tab.active { background: #38bdf8; color: #0c4a6e; }
        .mp-tf-strip { display: flex; gap: 2px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 3px; flex-wrap: wrap; min-width: 0; flex: 1 1 auto; }
        .mp-tf-btn { padding: 4px 7px; border: none; border-radius: 5px; cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700; background: transparent; color: #7dd3fc; transition: all 0.12s; white-space: nowrap; flex-shrink: 0; }
        .mp-tf-btn.active { background: #38bdf8; color: #0c4a6e; }
        .mp-tf-btn:hover:not(.active) { background: rgba(255,255,255,0.1); color: #e0f2fe; }
        .mp-close-btn { background: rgba(0,0,0,0.2); border: 1px solid #0284c7; border-radius: 7px; color: #7dd3fc; cursor: pointer; padding: 5px 10px; font-size: 14px; transition: all 0.14s; flex-shrink: 0; }
        .mp-close-btn:hover { background: rgba(255,255,255,0.1); color: #e0f2fe; }
        /* ── BODY ── */
        .mp-body { padding: 14px; background: #f0f9ff; box-sizing: border-box; width: 100%; overflow-x: hidden; }
        .mp-loading { display: flex; align-items: center; gap: 10px; padding: 40px; justify-content: center; color: #0369a1; font-size: 13px; }
        .mp-spinner { width: 22px; height: 22px; border: 3px solid #bae6fd; border-top-color: #0ea5e9; border-radius: 50%; animation: esi-spin 0.7s linear infinite; flex-shrink: 0; }
        .mp-spinner-sm { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: esi-spin 0.7s linear infinite; }
        .mp-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 20px; color: #0369a1; font-size: 13px; text-align: center; }
        .mp-empty p { margin: 0; }
        .mp-fetch-btn { padding: 11px 24px; background: linear-gradient(135deg,#0ea5e9,#38bdf8); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(14,165,233,0.3); }
        .mp-fetch-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,165,233,0.4); }
        /* ── CHART BOX ── */
        .mp-chart-box { background: #040d14; border-radius: 10px; overflow: hidden; margin-bottom: 12px; border: 1px solid #0c2233; width: 100%; box-sizing: border-box; }
        .mp-chart-sub { padding: 5px 12px 7px; font-size: 10px; color: #0369a1; display: flex; gap: 10px; flex-wrap: wrap; background: #040d14; border-top: 1px solid #0c2233; }
        /* ── LEGEND ── */
        .mp-legend-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 10px; }
        .mp-legend-group { background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 10px; padding: 10px 12px; }
        .mp-legend-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #0369a1; margin-bottom: 7px; }
        .mp-legend-row { display: flex; align-items: center; gap: 7px; padding: 3px 0; flex-wrap: wrap; min-height: 26px; }
        .mp-legend-name { font-size: 12px; font-weight: 600; color: #0c4a6e; flex: 1 1 60px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mp-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
        .mp-drill-btn { font-size: 11px; color: #0ea5e9; background: #e0f2fe; border: none; border-radius: 5px; padding: 3px 8px; cursor: pointer; font-weight: 700; margin-left: auto; transition: all 0.12s; white-space: nowrap; flex-shrink: 0; }
        .mp-drill-btn:hover { background: #0ea5e9; color: white; }
        /* ── PILLS ── */
        .mp-pill-strip { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .mp-sector-pill { padding: 5px 12px; border: 2px solid var(--sc); border-radius: 999px; background: transparent; color: var(--sc); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.14s; white-space: nowrap; }
        .mp-sector-pill:hover, .mp-sector-pill.active { background: var(--sc); color: white; }
        /* ── DRILL HEADER ── */
        .mp-drill-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .mp-corr-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: linear-gradient(135deg,#0ea5e9,#38bdf8); color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.16s; white-space: nowrap; flex-shrink: 0; box-shadow: 0 3px 10px rgba(14,165,233,0.3); }
        .mp-corr-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(14,165,233,0.4); }
        .mp-corr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        /* ── FILTER BAR ── */
        .mp-filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; padding: 10px 12px; background: white; border: 1.5px solid #bae6fd; border-radius: 10px; box-sizing: border-box; width: 100%; }
        .mp-sel { padding: 6px 8px; border: 1.5px solid #bae6fd; border-radius: 7px; font-size: 12px; background: white; color: #0c4a6e; cursor: pointer; outline: none; min-width: 0; flex: 1 1 auto; max-width: 180px; }
        .mp-sel:focus { border-color: #0ea5e9; }
        .mp-count { font-size: 11px; color: #0ea5e9; background: #e0f2fe; padding: 3px 10px; border-radius: 20px; font-weight: 700; border: 1px solid #bae6fd; white-space: nowrap; flex-shrink: 0; }
        /* ── TABLE — fluid columns, no fixed px ── */
        .mp-table { border: 1.5px solid #bae6fd; border-radius: 10px; overflow: hidden; margin-bottom: 14px; background: white; width: 100%; box-sizing: border-box; }
        /* Active row highlight */
        .mp-table-row-active { background: #e0f2fe !important; border-left: 3px solid #0ea5e9; }
        /* Panel inside table — span full width via negative margin trick */
        .adp-panel { margin: 0 -12px; border-radius: 0; border-left: none; border-right: none; border-top: 2px solid #0ea5e9; box-shadow: 0 4px 20px rgba(14,165,233,0.15); }
        .mp-table-head {
          display: grid;
          grid-template-columns: minmax(52px,0.65fr) minmax(58px,0.8fr) minmax(85px,1.1fr) minmax(85px,1.1fr) minmax(95px,1.4fr);
          gap: 6px; padding: 8px 12px;
          background: linear-gradient(135deg,#e0f2fe,#f0f9ff); border-bottom: 1.5px solid #bae6fd;
          font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: #0369a1;
        }
        .mp-table-row {
          display: grid;
          grid-template-columns: minmax(52px,0.65fr) minmax(58px,0.8fr) minmax(85px,1.1fr) minmax(85px,1.1fr) minmax(95px,1.4fr);
          gap: 6px; padding: 7px 12px; border-bottom: 1px solid #e0f2fe; align-items: center; transition: background 0.1s;
        }
        .mp-table-row:last-child { border-bottom: none; }
        .mp-table-row:hover { background: #f0f9ff; }
        .mp-sym { font-family: 'IBM Plex Mono', monospace; font-weight: 800; font-size: 12px; color: #0c4a6e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mp-cls-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        /* ── CORR ── */
        .mp-corr-section { background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 14px; margin-top: 12px; }
        .mp-corr-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .mp-avg-badge { font-family: monospace; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 8px; }
        .mp-corr-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .mp-corr-search { flex: 1; min-width: 120px; padding: 6px 10px; border: 1.5px solid #bae6fd; border-radius: 7px; font-size: 12px; outline: none; background: white; }
        .mp-corr-search:focus { border-color: #0ea5e9; }
        .mp-corr-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 7px; max-height: 380px; overflow-y: auto; }
        .mp-corr-card { background: white; border-radius: 8px; border: 1.5px solid #e0f2fe; padding: 9px 11px; cursor: pointer; transition: box-shadow 0.14s; }
        .mp-corr-card:hover { box-shadow: 0 3px 12px rgba(14,165,233,0.12); }
        /* ── ASSET DETAIL PANEL ── */
        .adp-open-btn { background: #e0f2fe; border: 1.5px solid #bae6fd; border-radius: 6px; padding: 3px 7px; cursor: pointer; font-size: 12px; line-height: 1; transition: all 0.14s; flex-shrink: 0; color: #0369a1; }
        .adp-open-btn:hover { background: #0ea5e9; color: white; transform: scale(1.08); }
        .adp-open-btn.active { background: #0ea5e9; color: white; border-color: #0369a1; box-shadow: 0 0 0 2px rgba(14,165,233,0.3); }
        .adp-panel { grid-column: 1 / -1; border-radius: 10px; overflow: hidden; border: 1.5px solid #bae6fd; margin: 4px 0 8px; box-shadow: 0 4px 20px rgba(14,165,233,0.1); width: 100%; box-sizing: border-box; }
        .adp-topbar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 8px 10px; background: linear-gradient(135deg,#0c4a6e,#0369a1); box-sizing: border-box; width: 100%; }
        .adp-sym { font-family: 'IBM Plex Mono',monospace; font-weight: 800; font-size: 13px; color: #e0f2fe; flex-shrink: 0; }
        .adp-controls { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; flex: 1 1 auto; justify-content: flex-end; min-width: 0; }
        .adp-pill { padding: 3px 8px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: transparent; color: #7dd3fc; cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.12s; white-space: nowrap; flex-shrink: 0; }
        .adp-pill:hover { background: rgba(255,255,255,0.1); color: #e0f2fe; }
        .adp-pill.active { background: #38bdf8; color: #0c4a6e; border-color: #38bdf8; }
        .adp-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 1px; flex-shrink: 0; }
        .adp-close { padding: 3px 9px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: rgba(248,113,113,0.2); color: #fca5a5; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.12s; flex-shrink: 0; }
        .adp-close:hover { background: #f87171; color: white; }
        /* Side-by-side body */
        /* adp-body-row: chart left, info right */
        .adp-body-row { display: flex; flex-direction: row; align-items: stretch; min-height: 360px; width: 100%; }
        .adp-chart-area { flex: 1 1 50%; min-width: 0; position: relative; display: flex; flex-direction: column; }
        .adp-info-area { flex: 0 0 340px; min-width: 260px; max-width: 380px; display: flex; flex-direction: column; overflow: hidden; }
        .adp-info-area > div:last-child { flex: 1 1 auto; overflow-y: auto; }
        .adp-mss-bar { display: flex; flex-direction: row; align-items: center; flex-wrap: wrap; gap: 8px; padding: 8px 12px; box-sizing: border-box; }
        .adp-lb-input { width: 55px; padding: 4px 7px; border-radius: 6px; font-size: 12px; outline: none; font-family: monospace; min-width: 0; }
        .adp-lb-btn { padding: 4px 11px; border: none; border-radius: 6px; color: white; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.12s; flex-shrink: 0; }
        .adp-lb-btn:hover { filter: brightness(1.15); }
        .adp-lb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .adp-mss-results { display: flex; flex-direction: row; align-items: center; gap: 6px; flex-wrap: wrap; }
        .adp-mss-pill { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-family: monospace; display: inline-block; width: fit-content; }
        .adp-info-panel { padding: 12px 14px; }
        /* ── AI Analysis Panel ── */
        .adp-ai-panel {
          border-top: 2px solid #7c3aed;
          animation: adp-slide-in 0.2s ease;
        }
        @keyframes adp-slide-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Mobile: stack vertically */
        @media (max-width: 640px) {
          .adp-body-row { flex-direction: column; }
          .adp-chart-area { min-height: 240px; }
          .adp-info-area { flex: 0 0 auto; max-width: 100%; border-left: none !important; border-top: 1px solid #bae6fd; min-width: 0; }
        }
        /* ── DRILL SEARCH BAR ── */
        .mp-drill-search-wrap {
          display: flex; align-items: center; gap: 0;
          background: white; border: 1.5px solid #bae6fd; border-radius: 9px;
          padding: 0 4px 0 10px; margin-bottom: 10px; width: 100%; box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .mp-drill-search-wrap:focus-within { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
        .mp-drill-search-icon { font-size: 13px; flex-shrink: 0; }
        .mp-drill-search {
          flex: 1; border: none; outline: none; padding: 9px 8px;
          font-size: 13px; color: #0c4a6e; background: transparent;
          font-family: inherit;
        }
        .mp-drill-search::placeholder { color: #bae6fd; }
        .mp-drill-search-clear {
          background: none; border: none; cursor: pointer; color: #94a3b8;
          font-size: 13px; padding: 4px 6px; border-radius: 5px; flex-shrink: 0;
          transition: all 0.12s;
        }
        .mp-drill-search-clear:hover { background: #fee2e2; color: #f87171; }

        /* ── LOOKBACK IN FILTER BAR ── */
        .mp-lb-wrap { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .mp-lb-input { width: 52px; padding: 5px 7px; border: 1.5px solid #bae6fd; border-radius: 7px; font-size: 12px; outline: none; font-family: monospace; background: white; color: #0c4a6e; min-width: 0; }
        .mp-lb-input:focus { border-color: #0ea5e9; }
        .mp-lb-apply { padding: 5px 10px; background: linear-gradient(135deg,#0ea5e9,#38bdf8); color: white; border: none; border-radius: 7px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.12s; white-space: nowrap; flex-shrink: 0; }
        .mp-lb-apply:hover { filter: brightness(1.1); }
        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .mp-table-head, .mp-table-row {
            grid-template-columns: minmax(50px,0.65fr) minmax(55px,0.8fr) minmax(80px,1fr) minmax(80px,1fr) minmax(80px,1.2fr);
          }
        }
        @media (max-width: 768px) {
          .mp-topbar-left, .mp-topbar-right { flex: 1 1 100%; justify-content: flex-start; }
          .mp-tabs { overflow-x: auto; flex-wrap: nowrap; }
          .mp-tf-strip { overflow-x: auto; flex-wrap: nowrap; }
          .mp-legend-grid { grid-template-columns: 1fr; }
          .mp-table-head, .mp-table-row {
            grid-template-columns: minmax(46px,0.6fr) minmax(52px,0.8fr) minmax(1fr,1fr) minmax(90px,1.3fr);
          }
          .mp-table-head > *:nth-child(4), .mp-table-row > *:nth-child(4) { display: none; }
          .mp-corr-cards { grid-template-columns: 1fr; }
          .mp-filter-bar { gap: 6px; }
          .mp-sel { font-size: 11px; max-width: 100%; }
          .adp-divider { display: none; }
          .adp-pill { padding: 3px 6px; font-size: 10px; }
        }
        @media (max-width: 480px) {
          .mp-body { padding: 10px; }
          .mp-table-head, .mp-table-row {
            grid-template-columns: minmax(44px,0.6fr) minmax(50px,0.75fr) minmax(1fr,1fr);
          }
          .mp-table-head > *:nth-child(3), .mp-table-row > *:nth-child(3),
          .mp-table-head > *:nth-child(4), .mp-table-row > *:nth-child(4) { display: none; }
          .mp-table-head > *:nth-child(5), .mp-table-row > *:nth-child(5) { display: flex; }
        }
      `}</style>
    </div>
  );
}
