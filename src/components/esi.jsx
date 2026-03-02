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

  // All US stocks from SECTOR_MAPPINGS
  const allStocks = useMemo(() => 
    Object.entries(SECTOR_MAPPINGS).map(([symbol, sector]) => ({
      symbol,
      sector,
      color: SECTOR_COLORS[sector] || '#6b7280',
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

  // ── Auto-discover all numeric keys from economicData and classify them ──
  const discoverKeys = useCallback((data) => {
    if (!data?.length) return [];
    const sample = data[0];
    const discovered = [];

    for (const key of Object.keys(sample)) {
      if (key === 'date') continue;
      // Check if there's actual numeric data for this key
      const hasData = data.some(d => d[key] != null && typeof d[key] === 'number');
      if (!hasData) continue;

      let cls, label;
      if (key.endsWith('_price')) {
        const pair = key.replace('_price', '');
        cls = 'Forex';
        label = forexPairs.find(p => p.pair === pair)?.name || pair;
      } else if (key.endsWith('_index')) {
        const sym = key.replace('_index', '');
        cls = 'Index';
        label = stockIndices.find(s => s.symbol === sym)?.displayName || sym;
      } else if (key.endsWith('_commodity')) {
        const sym = key.replace('_commodity', '');
        cls = 'Commodity';
        label = commodities.find(c => c.symbol === sym)?.displayName || sym;
      } else if (key.endsWith('_volume_ratio')) {
        const id = key.replace('_volume_ratio', '');
        cls = 'Volume';
        label = `${volumeAssets.find(a => a.id === id)?.name || id} Vol`;
      } else {
        // Bare key = ESI currency
        cls = 'ESI';
        label = `${key} ESI`;
      }

      discovered.push({ key, label, cls });
    }
    return discovered;
  }, [forexPairs, stockIndices, commodities, volumeAssets]);

  // ── Smart Correlation Engine ──
  // mode: 'all' | { single: 'ESI' } | { cross: ['ESI', 'Forex'] }
  const runMLAnalysis = async (mode = 'all') => {
    if (!economicData || economicData.length < 5) {
      setAnalysisError('Need at least 5 data points. Load some assets first!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStatus('Discovering data keys...');
    setAiInsights([]);
    setAnalysisError('');

    await new Promise(r => setTimeout(r, 50));

    try {
      const allKeys = discoverKeys(economicData);

      if (allKeys.length < 2) {
        setAnalysisError('Need at least 2 data series in the chart. Configure assets and load data first!');
        setIsAnalyzing(false);
        return;
      }

      // Filter keys based on mode
      let keysA, keysB, crossMode = false;
      if (mode === 'all') {
        keysA = allKeys;
        keysB = null; // will do all vs all
      } else if (mode.single) {
        keysA = allKeys.filter(k => k.cls === mode.single);
        keysB = null;
      } else if (mode.cross) {
        const [clsA, clsB] = mode.cross;
        keysA = allKeys.filter(k => k.cls === clsA);
        keysB = allKeys.filter(k => k.cls === clsB);
        crossMode = true;
      }

      if (keysA.length === 0 || (crossMode && keysB.length === 0)) {
        setAnalysisError('No data found for the selected asset class(es). Make sure those assets are loaded in the chart.');
        setIsAnalyzing(false);
        return;
      }

      // Build pairs
      const pairs = [];
      if (crossMode) {
        for (const a of keysA) for (const b of keysB) pairs.push([a, b]);
      } else {
        const pool = keysA;
        for (let i = 0; i < pool.length; i++)
          for (let j = i + 1; j < pool.length; j++)
            pairs.push([pool[i], pool[j]]);
      }

      const totalPairs = pairs.length;
      setAnalysisStatus(`Computing ${totalPairs.toLocaleString()} correlations across ${allKeys.length} series...`);
      await new Promise(r => setTimeout(r, 60));

      const findings = [];
      const BATCH = 30;

      for (let i = 0; i < pairs.length; i++) {
        const [kA, kB] = pairs[i];

        const rows = economicData.filter(d => d[kA.key] != null && d[kB.key] != null);
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
          setAnalysisProgress(Math.round((i / totalPairs) * 95));
          setAnalysisStatus(`Pair ${i.toLocaleString()} / ${totalPairs.toLocaleString()}...`);
          await new Promise(r => setTimeout(r, 0));
        }
      }

      setAnalysisProgress(98);
      setAnalysisStatus('Ranking results...');
      await new Promise(r => setTimeout(r, 40));

      const insights = findings
        .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
        .map(f => {
          const s = f.score;
          let term, styleClass;
          if (s > 0.8)       { term = 'Strong Positive';  styleClass = 'insight-positive-strong'; }
          else if (s > 0.5)  { term = 'Positive Trend';   styleClass = 'insight-positive'; }
          else if (s > 0.3)  { term = 'Weak Positive';    styleClass = 'insight-neutral'; }
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
      setAnalysisError(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Derive available classes from whatever is currently loaded in economicData
  const availableClasses = useMemo(() => {
    if (!economicData?.length) return [];
    return [...new Set(discoverKeys(economicData).map(k => k.cls))].sort();
  }, [economicData, discoverKeys]);

  // ── Toggle Handlers ──
  const toggle = (setter) => (val) => setter(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  const handleCurrencyToggle = toggle(setSelectedCurrencies);
  const handleForexToggle = toggle(setSelectedForexPairs);
  const handleStockIndexToggle = toggle(setSelectedStockIndices);
  const handleCommodityToggle = toggle(setSelectedCommodities);
  const handleVolumeAssetToggle = toggle(setSelectedVolumeAssets);
  const handleStockToggle = toggle(setSelectedStocks);

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
    if (corrSearch.trim()) {
      const q = corrSearch.toLowerCase();
      list = list.filter(i => i.nameA.toLowerCase().includes(q) || i.nameB.toLowerCase().includes(q));
    }
    if (corrFilter !== 'all') {
      if (corrFilter === 'strong_pos') list = list.filter(i => i.scoreNum > 0.8);
      else if (corrFilter === 'strong_neg') list = list.filter(i => i.scoreNum < -0.8);
      else if (corrFilter === 'positive') list = list.filter(i => i.scoreNum > 0.5);
      else if (corrFilter === 'negative') list = list.filter(i => i.scoreNum < -0.5);
      else if (corrFilter === 'weak') list = list.filter(i => Math.abs(i.scoreNum) <= 0.3);
    }
    if (corrClassFilter !== 'all') {
      list = list.filter(i => i.classA === corrClassFilter || i.classB === corrClassFilter);
    }
    return list;
  }, [aiInsights, corrSearch, corrFilter, corrClassFilter]);

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
          const isCom = entry.dataKey.includes('_commodity');
          const isVol = entry.dataKey.includes('_volume_ratio');
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

  // Total selected count
  const totalSelected = selectedCurrencies.length + selectedForexPairs.length + selectedStockIndices.length + selectedCommodities.length + selectedVolumeAssets.length + selectedStocks.length;

  const MODAL_TABS = [
    { id: 'currencies', label: '🌐 Currencies', count: selectedCurrencies.length },
    { id: 'forex', label: '💱 Forex', count: selectedForexPairs.length },
    { id: 'indices', label: '📈 Indices', count: selectedStockIndices.length },
    { id: 'commodities', label: '🛢️ Commodities', count: selectedCommodities.length },
    { id: 'volume', label: '📊 Volume', count: selectedVolumeAssets.length },
    { id: 'stocks', label: '🏢 US Stocks', count: selectedStocks.length },
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
                {selectedCurrencies.map(c => <span key={c} className="chip chip-esi">{c}</span>)}
                {selectedForexPairs.map(f => <span key={f} className="chip chip-forex">{f}</span>)}
                {selectedStockIndices.map(s => <span key={s} className="chip chip-stock">{stockIndices.find(i => i.symbol === s)?.displayName || s}</span>)}
                {selectedCommodities.map(c => <span key={c} className="chip chip-commodity">{commodities.find(i => i.symbol === c)?.displayName || c}</span>)}
                {selectedStocks.map(s => <span key={s} className="chip chip-usstock">{s}</span>)}
              </div>
            )}
          </div>

          {/* ── MODAL ── */}
          {modalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setModalOpen(false); }}>
              <div className="modal-container">
                <div className="modal-header">
                  <h3>Asset Configuration</h3>
                  <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                </div>

                {/* Tab bar */}
                <div className="modal-tabs">
                  {MODAL_TABS.map(tab => (
                    <button
                      key={tab.id}
                      className={`modal-tab ${modalTab === tab.id ? 'active' : ''}`}
                      onClick={() => { setModalTab(tab.id); setModalSearch(''); }}
                    >
                      {tab.label}
                      {tab.count > 0 && <span className="modal-tab-badge">{tab.count}</span>}
                    </button>
                  ))}
                </div>

                {/* Search (for stocks) */}
                {(modalTab === 'stocks') && (
                  <div className="modal-search-bar">
                    <input
                      type="text"
                      placeholder="Search by ticker or sector..."
                      value={modalSearch}
                      onChange={e => setModalSearch(e.target.value)}
                      className="modal-search-input"
                    />
                    {selectedStocks.length > 0 && (
                      <button className="modal-clear-btn" onClick={() => setSelectedStocks([])}>
                        Clear All ({selectedStocks.length})
                      </button>
                    )}
                  </div>
                )}

                {/* Tab Content */}
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
                      {/* Sector quick-select */}
                      <div className="sector-quick-bar">
                        {uniqueSectors.map(sector => {
                          const sectorStocks = allStocks.filter(s => s.sector === sector).map(s => s.symbol);
                          const allSelected = sectorStocks.every(s => selectedStocks.includes(s));
                          return (
                            <button
                              key={sector}
                              className={`sector-quick-btn ${allSelected ? 'active' : ''}`}
                              style={{ '--sector-color': SECTOR_COLORS[sector] || '#6b7280' }}
                              onClick={() => {
                                if (allSelected) setSelectedStocks(p => p.filter(s => !sectorStocks.includes(s)));
                                else setSelectedStocks(p => [...new Set([...p, ...sectorStocks])]);
                              }}
                            >
                              {sector}
                              <span>{sectorStocks.length}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="modal-stocks-info">
                        {selectedStocks.length} / {allStocks.length} selected
                        {modalFilteredStocks.length !== allStocks.length && ` (showing ${modalFilteredStocks.length})`}
                      </div>
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

          {/* ── AI ANALYSIS SECTION ── */}
          <div className="ai-analysis-container">
            <div className="ai-header">
              <div className="ai-title-group">
                <h6>🤖 TensorFlow.js Correlation Engine</h6>
                <span className="ai-subtitle">Auto-discovers all loaded data — no manual selection needed</span>
                {isAnalyzing && <span className="ai-status-text">{analysisStatus}</span>}
              </div>
            </div>

            {/* Analyze All */}
            <div className="ai-btn-row">
              <button onClick={() => runMLAnalysis('all')} disabled={isAnalyzing || economicData.length === 0} className="ai-analyze-btn ai-analyze-all">
                {isAnalyzing ? `⏳ ${analysisProgress}%` : '⚡ Analyze All Loaded Data'}
              </button>
            </div>

            {/* Single-class buttons — only shown if we have data */}
            {availableClasses.length >= 2 && (
              <div className="ai-class-section">
                <span className="ai-section-label">Within a class:</span>
                <div className="ai-class-btns">
                  {availableClasses.map(cls => (
                    <button
                      key={cls}
                      onClick={() => runMLAnalysis({ single: cls })}
                      disabled={isAnalyzing || economicData.length === 0}
                      className="ai-class-btn"
                    >
                      {cls} only
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cross-class buttons — all unique combos */}
            {availableClasses.length >= 2 && (
              <div className="ai-class-section">
                <span className="ai-section-label">Cross-class analysis:</span>
                <div className="ai-class-btns">
                  {availableClasses.flatMap((a, i) =>
                    availableClasses.slice(i + 1).map(b => (
                      <button
                        key={`${a}-${b}`}
                        onClick={() => runMLAnalysis({ cross: [a, b] })}
                        disabled={isAnalyzing || economicData.length === 0}
                        className="ai-class-btn ai-cross-btn"
                      >
                        {a} ↔ {b}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="ai-progress-track">
                <div className="ai-progress-fill" style={{ width: `${analysisProgress}%` }}></div>
                <span className="ai-progress-label">{analysisProgress}%</span>
              </div>
            )}

            {analysisError && (
              <div className="ai-error-message">⚠️ {analysisError}</div>
            )}

            {aiInsights.length > 0 && (
              <>
                {/* Correlation controls */}
                <div className="corr-controls">
                  <input
                    type="text"
                    placeholder="🔍 Search assets..."
                    value={corrSearch}
                    onChange={e => setCorrSearch(e.target.value)}
                    className="corr-search"
                  />
                  <select value={corrFilter} onChange={e => setCorrFilter(e.target.value)} className="corr-filter">
                    <option value="all">All relationships</option>
                    <option value="strong_pos">Strong Positive (&gt;0.8)</option>
                    <option value="strong_neg">Strong Negative (&lt;-0.8)</option>
                    <option value="positive">Positive (&gt;0.5)</option>
                    <option value="negative">Negative (&lt;-0.5)</option>
                    <option value="weak">Weak (±0.3)</option>
                  </select>
                  <select value={corrClassFilter} onChange={e => setCorrClassFilter(e.target.value)} className="corr-filter">
                    <option value="all">All classes</option>
                    {allClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                  <span className="corr-count">{filteredInsights.length.toLocaleString()} of {aiInsights.length.toLocaleString()} pairs</span>
                  <button className="corr-collapse-all" onClick={() => {
                    if (Object.keys(collapsedInsights).length < filteredInsights.length) {
                      const all = {};
                      filteredInsights.forEach(i => { all[i.id] = true; });
                      setCollapsedInsights(all);
                    } else {
                      setCollapsedInsights({});
                    }
                  }}>
                    {Object.keys(collapsedInsights).length < filteredInsights.length ? '▼ Collapse All' : '▶ Expand All'}
                  </button>
                </div>

                <div className="ai-results-grid">
                  {filteredInsights.slice(0, 200).map(insight => (
                    <div key={insight.id} className={`ai-card ${insight.styleClass}`}>
                      <div
                        className="ai-card-header"
                        onClick={() => setCollapsedInsights(p => ({ ...p, [insight.id]: !p[insight.id] }))}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="ai-pair-title-group">
                          <span className="ai-pair-title">{insight.nameA}</span>
                          <span className="ai-pair-vs">↔</span>
                          <span className="ai-pair-title">{insight.nameB}</span>
                        </div>
                        <div className="ai-card-header-right">
                          <span className="ai-class-tags">
                            <span className="ai-class-tag">{insight.classA}</span>
                            <span className="ai-class-tag">{insight.classB}</span>
                          </span>
                          <span className={`ai-score-badge ${parseFloat(insight.score) > 0.5 ? 'badge-pos' : parseFloat(insight.score) < -0.5 ? 'badge-neg' : 'badge-neu'}`}>
                            {parseFloat(insight.score) > 0 ? '+' : ''}{insight.score}
                          </span>
                          <span className="ai-collapse-icon">{collapsedInsights[insight.id] ? '▶' : '▼'}</span>
                        </div>
                      </div>
                      {!collapsedInsights[insight.id] && (
                        <div className="ai-card-body">
                          <strong>{insight.term}</strong>
                          <div className="ai-score-bar-wrap">
                            <div className="ai-score-bar-track">
                              <div
                                className="ai-score-bar-fill"
                                style={{
                                  width: `${Math.abs(parseFloat(insight.score)) * 100}%`,
                                  marginLeft: parseFloat(insight.score) >= 0 ? '50%' : `${50 - Math.abs(parseFloat(insight.score)) * 50}%`,
                                  background: parseFloat(insight.score) > 0.5 ? '#22c55e' : parseFloat(insight.score) < -0.5 ? '#ef4444' : '#94a3b8',
                                }}
                              ></div>
                              <div className="ai-score-bar-center"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredInsights.length > 200 && (
                    <div className="corr-overflow-notice">
                      Showing top 200 of {filteredInsights.length.toLocaleString()} pairs. Use filters to narrow results.
                    </div>
                  )}
                </div>
              </>
            )}

            {aiInsights.length === 0 && !isAnalyzing && !analysisError && economicData.length > 0 && (
              <p className="ai-hint">Click "Analyze All Loaded Data" — the engine auto-discovers every series in your chart and computes all pairwise correlations. No selection needed!</p>
            )}
          </div>

          {/* ── DOWNLOAD ── */}
          {economicData.length > 0 && (
            <div className="esi-download-section">
              <button onClick={() => {/* same as before */}} className="esi-download-btn download-all-btn">⬇ Download All CSV</button>
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

      <style jsx>{`
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

        /* ── MODAL ── */
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

        /* ── AI ANALYSIS ── */
        .ai-analysis-container { background: #eff6ff; color: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #bfdbfe; }
        .ai-header { margin-bottom: 14px; border-bottom: 1px solid #dbeafe; padding-bottom: 12px; }
        .ai-title-group h6 { margin: 0 0 2px; font-size: 1.05rem; color: #1e40af; }
        .ai-subtitle { font-size: 12px; color: #64748b; display: block; margin-bottom: 2px; }
        .ai-status-text { font-size: 0.8rem; color: #3b82f6; font-style: italic; display: block; margin-top: 4px; font-weight: 500; }
        .ai-btn-row { margin-bottom: 12px; }
        .ai-analyze-btn { background: #2563eb; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 14px; white-space: nowrap; }
        .ai-analyze-all { width: 100%; font-size: 15px; padding: 12px; letter-spacing: 0.02em; }
        .ai-analyze-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .ai-analyze-btn:disabled { background: #93c5fd; cursor: not-allowed; transform: none; box-shadow: none; }
        .ai-class-section { margin-bottom: 10px; display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
        .ai-section-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; padding-top: 6px; min-width: 110px; }
        .ai-class-btns { display: flex; gap: 5px; flex-wrap: wrap; flex: 1; }
        .ai-class-btn { padding: 5px 12px; background: white; border: 1px solid #bfdbfe; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; color: #1e40af; transition: all 0.15s; white-space: nowrap; }
        .ai-class-btn:hover:not(:disabled) { background: #dbeafe; border-color: #93c5fd; }
        .ai-class-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .ai-cross-btn { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .ai-cross-btn:hover:not(:disabled) { background: #dcfce7; border-color: #86efac; }
        .ai-progress-track { width: 100%; height: 8px; background: #dbeafe; border-radius: 4px; margin-bottom: 16px; overflow: hidden; position: relative; }
        .ai-progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #06b6d4); transition: width 0.15s linear; border-radius: 4px; }
        .ai-progress-label { position: absolute; right: 8px; top: -18px; font-size: 11px; color: #64748b; }
        .ai-error-message { background: #fee2e2; border: 1px solid #fecaca; border-radius: 7px; padding: 10px 14px; color: #991b1b; font-size: 13px; margin-bottom: 12px; }
        .ai-hint { text-align: center; color: #64748b; font-style: italic; margin: 16px 0; font-size: 14px; }

        /* ── CORRELATION CONTROLS ── */
        .corr-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; padding: 12px; background: white; border-radius: 8px; border: 1px solid #dbeafe; }
        .corr-search { flex: 1; min-width: 160px; padding: 7px 12px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; outline: none; }
        .corr-search:focus { border-color: #3b82f6; }
        .corr-filter { padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; background: white; }
        .corr-count { font-size: 12px; color: #64748b; white-space: nowrap; margin-left: auto; font-weight: 600; }
        .corr-collapse-all { padding: 6px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; cursor: pointer; white-space: nowrap; font-weight: 500; color: #475569; }
        .corr-collapse-all:hover { background: #e2e8f0; }
        .corr-overflow-notice { grid-column: 1 / -1; text-align: center; padding: 20px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; color: #854d0e; font-size: 13px; font-weight: 500; }

        /* ── INSIGHT CARDS ── */
        .ai-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
        .ai-card { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; transition: box-shadow 0.2s; }
        .ai-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .ai-card-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; gap: 8px; user-select: none; }
        .ai-pair-title-group { display: flex; align-items: center; gap: 5px; flex: 1; min-width: 0; }
        .ai-pair-title { font-weight: 700; font-size: 12px; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ai-pair-vs { color: #94a3b8; font-size: 14px; flex-shrink: 0; }
        .ai-card-header-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .ai-class-tags { display: flex; gap: 3px; }
        .ai-class-tag { font-size: 10px; padding: 1px 5px; background: #f1f5f9; color: #64748b; border-radius: 3px; font-weight: 500; }
        .ai-score-badge { padding: 2px 8px; border-radius: 10px; font-family: monospace; font-size: 12px; font-weight: 700; }
        .badge-pos { background: #dcfce7; color: #16a34a; }
        .badge-neg { background: #fee2e2; color: #dc2626; }
        .badge-neu { background: #f1f5f9; color: #64748b; }
        .ai-collapse-icon { font-size: 10px; color: #94a3b8; }
        .ai-card-body { padding: 8px 14px 12px; border-top: 1px solid #f1f5f9; }
        .ai-card-body strong { font-size: 12px; color: #475569; display: block; margin-bottom: 6px; }
        .ai-score-bar-wrap { margin-top: 4px; }
        .ai-score-bar-track { width: 100%; height: 6px; background: #f1f5f9; border-radius: 3px; position: relative; overflow: hidden; }
        .ai-score-bar-fill { position: absolute; height: 100%; border-radius: 3px; transition: width 0.3s; }
        .ai-score-bar-center { position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: #cbd5e1; }

        /* ── CARD BORDER COLORS ── */
        .insight-positive-strong { border-left: 3px solid #22c55e; }
        .insight-positive { border-left: 3px solid #86efac; }
        .insight-negative-strong { border-left: 3px solid #ef4444; }
        .insight-negative { border-left: 3px solid #fca5a5; }
        .insight-neutral { border-left: 3px solid #cbd5e1; }

        /* ── CHART ── */
        .esi-chart-container { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .esi-loading, .esi-no-data { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: #94a3b8; }
        .esi-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .esi-tooltip { background: rgba(15,23,42,0.95); border: 1px solid #334155; border-radius: 8px; padding: 12px; color: white; }
        .esi-tooltip-label { margin: 0 0 6px; font-weight: 600; color: #e2e8f0; font-size: 13px; }
        .esi-tooltip-entry { margin: 3px 0; font-size: 13px; }

        /* ── DOWNLOAD ── */
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
          .ai-class-section { flex-direction: column; gap: 6px; }
          .ai-section-label { min-width: unset; padding-top: 0; }
          .corr-controls { flex-direction: column; align-items: stretch; }
          .corr-search { width: 100%; }
          .corr-count { margin-left: 0; }
          .ai-results-grid { grid-template-columns: 1fr; }
          .esi-selector-bar { flex-direction: column; align-items: flex-start; }
          .modal-tabs { overflow-x: auto; flex-wrap: nowrap; padding: 10px 12px; }
        }
      `}</style>
    </div>
  );
}