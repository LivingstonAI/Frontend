import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Brain, Telescope, ArrowUpDown, Gauge, BarChart3, AlertTriangle, Calendar, Globe, Award, Repeat, Shield } from 'lucide-react';
import Header from "./header";
import SideNavs from "./side_navs";

// --- Hardcoded asset universe for comparison picker ---------------------------
const COMPARE_ASSETS = {
    forex: [
        'EURUSD=X','GBPUSD=X','USDJPY=X','AUDUSD=X','USDCAD=X','USDCHF=X',
        'NZDUSD=X','EURGBP=X','EURJPY=X','GBPJPY=X','AUDJPY=X','EURCHF=X',
    ].map(s => ({ s, n: s.replace('=X','').replace('USD','USD ').trim() })),

    stocks: [
        // Tech Giants & Semiconductors
        'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC','ORCL','CSCO',
        'ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC','SNPS','CDNS','MRVL','NXPI',
        'MU','ADI','MPWR','SWKS','QRVO','ON','IBM','AAOI','ACLS','ACN','ADSK','AKAM',
        'ANSS','APH','ANET','ASML','AVAV','KEYS','MCHP','MTSI','MSI','MDB','NTAP','NTNX',
        'PAYC','PTC','ROP','SAP','SLAB','STX','TER','TSM','TYL','UMC','VRSN','WDC','ZBRA','SPCX',
        // Software & Cloud
        'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR','TEAM','FTNT','OKTA','S','CYBR',
        // Fintech & Payments
        'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER','LYFT',
        'DASH','PINS','SNAP','SPOT','ROKU','AFRM','COIN','HOOD','SOFI','RBLX','ASTS',
        // Financial Services & Banks
        'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME','ICE','MCO',
        'BK','USB','PNC','TFC','COF','AFL','AMG','AON','AJG','AMP','BEN','CBOE','CINF',
        'DFS','ERIE','FITB','GL','HBAN','HIG','IVZ','JKHY','KEY','L','LNC','MTB','NTRS',
        'NDAQ','PFG','RF','RJF','STT','SYF','TROW','WRB','ZION','CFG','CMA','FHN','EWBC',
        'WAL','WBS','ALLY',
        // Insurance
        'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
        // Healthcare & Pharma
        'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY','AMGN','GILD','CVS',
        'CI','ELV','HUM','VRTX','REGN','ISRG','BIIB','MRNA','BNTX','ALNY','BGNE',
        'MCK','CAH','COR','IDXX','A','WAT','ALGN','BAX','BDX','BIO','BSX','DXCM','EW',
        'HOLX','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PODD','RMD','STE','SYK',
        'TFX','UHS','WST','ZBH','ZTS','TDOC','DOCS','VEEV','HALO','NVAX','IONS','UTHR',
        // Consumer Discretionary & Retail
        'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM','ABNB',
        'SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','QSR','AAL','DAL','UAL',
        'LUV','CCL','RCL','EA','TTWO','U','RIVN','LCID','AZO','BBY','BURL','CPRT',
        'DHI','DRI','EXPE','GPC','GRMN','HAS','HLT','KMX','LEN','LVS','MGM','NVR',
        'ORLY','PHM','POOL','RL','TSCO','TPR','ULTA','VFC','WHR','WYNN','APTV','BWA',
        'DG','DLTR','DDS','FIVE','FL','GPS','GT','HBI','LAD','LKQ','M','NCLH','NWL','PVH',
        // Consumer Staples
        'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS','KHC','STZ',
        'ADM','CAG','CHD','CLX','CPB','EL','HSY','K','KDP','KR','KVUE','MKC','MNST',
        'SJM','SYY','TAP','TSN','WBA','BG','HRL','POST',
        // Energy
        'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN','HES','BKR',
        'APA','CTRA','FANG','KMI','LNG','MRO','NOV','OKE','TRGP','WMB','EQT','AR',
        'CQP','FTI','MTDR','OVV','PBF','RIG','SM',
        // Industrials
        'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD','NOC','FDX','CSX',
        'HWM','TDG','HEI','LHX','TXT','AOS','CARR','CHRW','CMI','DOV','EMR','ETN',
        'EXPD','FAST','FTV','GNRC','GWW','IEX','IR','ITW','JBHT','JCI','LDOS','MAS',
        'NSC','ODFL','OTIS','PCAR','PH','PWR','ROK','ROL','RSG','SNA','SWK','TT',
        'URI','VRSK','WAB','WM','XYL','ALK','JBLU',
        // Communication Services & Media
        'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA','OMC','PARA','WBD','IPG',
        // Real Estate & REITs
        'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE','DLR','EQR',
        'ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC','UDR','VTR','WELL','WY','INVH',
        // Materials & Chemicals
        'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB','EMN','SQM',
        'AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS','NUE','PKG','PPG',
        'SEE','STLD','VMC','AVY','AA','MP','RS',
        // Utilities
        'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS','CNP','DTE',
        'ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG','PCG','PEG','PNW','PPL',
        'VST','WEC','XEL','CEG',
        // Chinese ADRs
        'BABA','JD','PDD','BIDU','NIO','XPEV','LI',
    ].map(s => ({ s, n: s })),

    indices: [
        { s:'^GSPC', n:'S&P 500' },     { s:'^DJI',  n:'Dow Jones' },    { s:'^IXIC', n:'NASDAQ' },
        { s:'^RUT',  n:'Russell 2000' }, { s:'^VIX',  n:'VIX' },
        { s:'^FTSE', n:'FTSE 100' },     { s:'^GDAXI',n:'DAX' },          { s:'^FCHI', n:'CAC 40' },
        { s:'^IBEX', n:'IBEX 35' },      { s:'^AEX',  n:'AEX' },          { s:'^SSMI', n:'SMI' },
        { s:'^OMXS30',n:'OMX Stockholm'},{ s:'^BFX',  n:'BEL 20' },
        { s:'^N225', n:'Nikkei 225' },   { s:'^HSI',  n:'Hang Seng' },    { s:'000001.SS',n:'SSE Composite' },
        { s:'^STI',  n:'STI Singapore' },{ s:'^BSESN',n:'BSE Sensex' },   { s:'^NSEI', n:'NIFTY 50' },
        { s:'^KS11', n:'KOSPI' },        { s:'^TWII', n:'TAIEX' },        { s:'^JKSE', n:'IDX Composite' },
        { s:'^AXJO', n:'ASX 200' },      { s:'^GSPTSE',n:'TSX' },         { s:'^MXX',  n:'IPC Mexico' },
        { s:'^BVSP', n:'Bovespa' },      { s:'^MERV', n:'MERVAL' },
    ],

    commodities: [
        { s:'GC=F',  n:'Gold' },          { s:'SI=F',  n:'Silver' },        { s:'PL=F',  n:'Platinum' },
        { s:'PA=F',  n:'Palladium' },
        { s:'CL=F',  n:'Crude Oil WTI' }, { s:'BZ=F',  n:'Brent Crude' },   { s:'NG=F',  n:'Natural Gas' },
        { s:'RB=F',  n:'RBOB Gasoline' }, { s:'HO=F',  n:'Heating Oil' },
        { s:'HG=F',  n:'Copper' },        { s:'ALI=F', n:'Aluminium' },
        { s:'ZC=F',  n:'Corn' },          { s:'ZW=F',  n:'Wheat' },         { s:'ZS=F',  n:'Soybeans' },
        { s:'KC=F',  n:'Coffee' },        { s:'SB=F',  n:'Sugar' },         { s:'CT=F',  n:'Cotton' },
        { s:'CC=F',  n:'Cocoa' },         { s:'LBS=F', n:'Lumber' },
    ],

    bonds: [
        { s:'^TNX',  n:'10Y Treasury Yield' }, { s:'^TYX', n:'30Y Treasury Yield' },
        { s:'^FVX',  n:'5Y Treasury Yield' },  { s:'^IRX', n:'13W T-Bill' },
        { s:'ZN=F',  n:'10Y T-Note Futures' }, { s:'ZB=F', n:'T-Bond Futures' },
        { s:'ZT=F',  n:'2Y T-Note Futures' },  { s:'ZF=F', n:'5Y T-Note Futures' },
    ],
};


// --- Earnings calendar -- all monitored tickers with sector + name -------------
const SECTOR_MAP = {
    'AAPL':'Technology','MSFT':'Technology','GOOGL':'Technology','GOOG':'Technology',
    'AMZN':'Consumer Cyclical','NVDA':'Technology','TSLA':'Consumer Cyclical','META':'Technology',
    'AMD':'Technology','INTC':'Technology','ORCL':'Technology','CSCO':'Technology',
    'ADBE':'Technology','CRM':'Technology','AVGO':'Technology','QCOM':'Technology',
    'TXN':'Technology','AMAT':'Technology','LRCX':'Technology','KLAC':'Technology',
    'SNPS':'Technology','CDNS':'Technology','MRVL':'Technology','NXPI':'Technology',
    'MU':'Technology','ADI':'Technology','MPWR':'Technology','SWKS':'Technology',
    'QRVO':'Technology','ON':'Technology','IBM':'Technology','ACN':'Technology',
    'ADSK':'Technology','AKAM':'Technology','ANSS':'Technology','APH':'Technology',
    'ANET':'Technology','ASML':'Technology','KEYS':'Technology','MCHP':'Technology',
    'MSI':'Technology','MDB':'Technology','NTAP':'Technology','NTNX':'Technology',
    'PAYC':'Technology','PTC':'Technology','SAP':'Technology','STX':'Technology',
    'TER':'Technology','TSM':'Technology','TYL':'Technology','VRSN':'Technology',
    'WDC':'Technology','ZBRA':'Technology','ZM':'Technology','DOCU':'Technology',
    'TWLO':'Technology','SQ':'Technology','UBER':'Technology','LYFT':'Technology',
    'DASH':'Technology','PINS':'Technology','SNAP':'Technology','SPOT':'Technology',
    'ROKU':'Technology','AFRM':'Technology','COIN':'Technology','HOOD':'Technology',
    'SOFI':'Technology','RBLX':'Technology','ASTS':'Technology','NOW':'Technology',
    'INTU':'Technology','WDAY':'Technology','PANW':'Technology','CRWD':'Technology',
    'ZS':'Technology','DDOG':'Technology','NET':'Technology','SNOW':'Technology',
    'PLTR':'Technology','TEAM':'Technology','FTNT':'Technology','OKTA':'Technology',
    'S':'Technology','CYBR':'Technology','BABA':'Technology','BIDU':'Technology',
    'JPM':'Financial','BAC':'Financial','WFC':'Financial','C':'Financial',
    'GS':'Financial','MS':'Financial','BLK':'Financial','SCHW':'Financial',
    'AXP':'Financial','SPGI':'Financial','CME':'Financial','ICE':'Financial',
    'MCO':'Financial','BK':'Financial','USB':'Financial','PNC':'Financial',
    'TFC':'Financial','COF':'Financial','V':'Financial','MA':'Financial',
    'PYPL':'Financial','ADP':'Financial','FISV':'Financial','FIS':'Financial',
    'BRK-B':'Financial','PGR':'Financial','ALL':'Financial','TRV':'Financial',
    'AIG':'Financial','MET':'Financial','PRU':'Financial','AFL':'Financial',
    'AON':'Financial','AJG':'Financial','AMP':'Financial','CBOE':'Financial',
    'DFS':'Financial','FITB':'Financial','HBAN':'Financial','HIG':'Financial',
    'KEY':'Financial','LNC':'Financial','MTB':'Financial','NTRS':'Financial',
    'NDAQ':'Financial','RF':'Financial','RJF':'Financial','STT':'Financial',
    'SYF':'Financial','TROW':'Financial','ZION':'Financial','CFG':'Financial',
    'ALLY':'Financial',
    'JNJ':'Healthcare','LLY':'Healthcare','UNH':'Healthcare','PFE':'Healthcare',
    'ABBV':'Healthcare','MRK':'Healthcare','TMO':'Healthcare','ABT':'Healthcare',
    'DHR':'Healthcare','BMY':'Healthcare','AMGN':'Healthcare','GILD':'Healthcare',
    'CVS':'Healthcare','CI':'Healthcare','ELV':'Healthcare','HUM':'Healthcare',
    'VRTX':'Healthcare','REGN':'Healthcare','ISRG':'Healthcare','BIIB':'Healthcare',
    'MRNA':'Healthcare','BNTX':'Healthcare','ALNY':'Healthcare','BGNE':'Healthcare',
    'MCK':'Healthcare','CAH':'Healthcare','COR':'Healthcare','IDXX':'Healthcare',
    'BAX':'Healthcare','BDX':'Healthcare','BSX':'Healthcare','DXCM':'Healthcare',
    'EW':'Healthcare','HOLX':'Healthcare','ILMN':'Healthcare','INCY':'Healthcare',
    'IQV':'Healthcare','LH':'Healthcare','MDT':'Healthcare','MOH':'Healthcare',
    'NBIX':'Healthcare','PODD':'Healthcare','RMD':'Healthcare','STE':'Healthcare',
    'SYK':'Healthcare','ZBH':'Healthcare','ZTS':'Healthcare','TDOC':'Healthcare',
    'DOCS':'Healthcare','VEEV':'Healthcare','NVAX':'Healthcare','UTHR':'Healthcare',
    'HD':'Consumer Cyclical','MCD':'Consumer Cyclical','NKE':'Consumer Cyclical',
    'SBUX':'Consumer Cyclical','TJX':'Consumer Cyclical','LOW':'Consumer Cyclical',
    'BKNG':'Consumer Cyclical','MAR':'Consumer Cyclical','CMG':'Consumer Cyclical',
    'F':'Consumer Cyclical','GM':'Consumer Cyclical','ABNB':'Consumer Cyclical',
    'SHOP':'Consumer Cyclical','MELI':'Consumer Cyclical','EBAY':'Consumer Cyclical',
    'ETSY':'Consumer Cyclical','TGT':'Consumer Cyclical','ROST':'Consumer Cyclical',
    'YUM':'Consumer Cyclical','DPZ':'Consumer Cyclical','AAL':'Consumer Cyclical',
    'DAL':'Consumer Cyclical','UAL':'Consumer Cyclical','LUV':'Consumer Cyclical',
    'CCL':'Consumer Cyclical','RCL':'Consumer Cyclical','EA':'Consumer Cyclical',
    'TTWO':'Consumer Cyclical','RIVN':'Consumer Cyclical','LCID':'Consumer Cyclical',
    'AZO':'Consumer Cyclical','EXPE':'Consumer Cyclical','GRMN':'Consumer Cyclical',
    'HLT':'Consumer Cyclical','LEN':'Consumer Cyclical','LVS':'Consumer Cyclical',
    'MGM':'Consumer Cyclical','ORLY':'Consumer Cyclical','PHM':'Consumer Cyclical',
    'WYNN':'Consumer Cyclical','DG':'Consumer Cyclical','DLTR':'Consumer Cyclical',
    'NCLH':'Consumer Cyclical','NIO':'Consumer Cyclical','XPEV':'Consumer Cyclical',
    'LI':'Consumer Cyclical','JD':'Consumer Cyclical','PDD':'Consumer Cyclical',
    'WMT':'Consumer Defensive','PG':'Consumer Defensive','KO':'Consumer Defensive',
    'PEP':'Consumer Defensive','COST':'Consumer Defensive','PM':'Consumer Defensive',
    'MO':'Consumer Defensive','MDLZ':'Consumer Defensive','CL':'Consumer Defensive',
    'KMB':'Consumer Defensive','GIS':'Consumer Defensive','KHC':'Consumer Defensive',
    'STZ':'Consumer Defensive','ADM':'Consumer Defensive','CAG':'Consumer Defensive',
    'CHD':'Consumer Defensive','CLX':'Consumer Defensive','HSY':'Consumer Defensive',
    'KDP':'Consumer Defensive','KR':'Consumer Defensive','MKC':'Consumer Defensive',
    'MNST':'Consumer Defensive','SYY':'Consumer Defensive','TAP':'Consumer Defensive',
    'TSN':'Consumer Defensive','WBA':'Consumer Defensive','HRL':'Consumer Defensive',
    'XOM':'Energy','CVX':'Energy','COP':'Energy','EOG':'Energy','SLB':'Energy',
    'MPC':'Energy','PSX':'Energy','VLO':'Energy','OXY':'Energy','HAL':'Energy',
    'DVN':'Energy','HES':'Energy','BKR':'Energy','APA':'Energy','CTRA':'Energy',
    'KMI':'Energy','LNG':'Energy','MRO':'Energy','OKE':'Energy','TRGP':'Energy',
    'WMB':'Energy','EQT':'Energy','AR':'Energy','MTDR':'Energy','OVV':'Energy',
    'RIG':'Energy','SM':'Energy',
    'BA':'Industrials','HON':'Industrials','UNP':'Industrials','CAT':'Industrials',
    'GE':'Industrials','RTX':'Industrials','LMT':'Industrials','UPS':'Industrials',
    'DE':'Industrials','MMM':'Industrials','GD':'Industrials','NOC':'Industrials',
    'FDX':'Industrials','CSX':'Industrials','HWM':'Industrials','TDG':'Industrials',
    'LHX':'Industrials','EMR':'Industrials','ETN':'Industrials','FAST':'Industrials',
    'GWW':'Industrials','IR':'Industrials','ITW':'Industrials','JCI':'Industrials',
    'NSC':'Industrials','ODFL':'Industrials','OTIS':'Industrials','PWR':'Industrials',
    'ROK':'Industrials','RSG':'Industrials','SNA':'Industrials','SWK':'Industrials',
    'URI':'Industrials','WAB':'Industrials','WM':'Industrials','XYL':'Industrials',
    'ALK':'Industrials','JBLU':'Industrials',
    'T':'Communication','VZ':'Communication','CMCSA':'Communication',
    'NFLX':'Communication','DIS':'Communication','TMUS':'Communication',
    'CHTR':'Communication','LYV':'Communication','MTCH':'Communication',
    'PARA':'Communication','WBD':'Communication','IPG':'Communication',
    'AMT':'Real Estate','PLD':'Real Estate','CCI':'Real Estate','EQIX':'Real Estate',
    'PSA':'Real Estate','SPG':'Real Estate','O':'Real Estate','AVB':'Real Estate',
    'BXP':'Real Estate','CBRE':'Real Estate','DLR':'Real Estate','EQR':'Real Estate',
    'EXR':'Real Estate','IRM':'Real Estate','MAA':'Real Estate','SBAC':'Real Estate',
    'VTR':'Real Estate','WELL':'Real Estate','WY':'Real Estate','INVH':'Real Estate',
    'LIN':'Materials','APD':'Materials','SHW':'Materials','ECL':'Materials',
    'DD':'Materials','NEM':'Materials','FCX':'Materials','DOW':'Materials',
    'LYB':'Materials','ALB':'Materials','EMN':'Materials','SQM':'Materials',
    'CF':'Materials','CLF':'Materials','MLM':'Materials','NUE':'Materials',
    'PPG':'Materials','STLD':'Materials','VMC':'Materials','AA':'Materials',
    'MP':'Materials','RS':'Materials',
    'NEE':'Utilities','DUK':'Utilities','SO':'Utilities','D':'Utilities',
    'AEP':'Utilities','EXC':'Utilities','SRE':'Utilities','AEE':'Utilities',
    'AWK':'Utilities','CMS':'Utilities','CNP':'Utilities','DTE':'Utilities',
    'ED':'Utilities','EIX':'Utilities','ETR':'Utilities','FE':'Utilities',
    'NRG':'Utilities','PCG':'Utilities','PEG':'Utilities','PPL':'Utilities',
    'VST':'Utilities','WEC':'Utilities','XEL':'Utilities','CEG':'Utilities',
};

const SECTOR_COLORS = {
    'Technology':        { bg:'#eff6ff', border:'#3b82f6', text:'#1d4ed8' },
    'Financial':         { bg:'#f0fdf4', border:'#10b981', text:'#065f46' },
    'Healthcare':        { bg:'#fdf4ff', border:'#a855f7', text:'#6b21a8' },
    'Consumer Cyclical': { bg:'#fff7ed', border:'#f97316', text:'#9a3412' },
    'Consumer Defensive':{ bg:'#fefce8', border:'#eab308', text:'#713f12' },
    'Energy':            { bg:'#fff1f2', border:'#f43f5e', text:'#9f1239' },
    'Industrials':       { bg:'#f0f9ff', border:'#0ea5e9', text:'#0369a1' },
    'Communication':     { bg:'#faf5ff', border:'#8b5cf6', text:'#5b21b6' },
    'Real Estate':       { bg:'#f0fdfa', border:'#14b8a6', text:'#0f766e' },
    'Materials':         { bg:'#fdf2f8', border:'#ec4899', text:'#9d174d' },
    'Utilities':         { bg:'#f8fafc', border:'#64748b', text:'#334155' },
};

const ALL_CALENDAR_TICKERS = Object.keys(SECTOR_MAP);

function ScannerChart({ ticker, interval, onIntervalChange, onClose, mountDelay = 0, hideClose = false, scannerMeta = null }) {
    const BACKEND      = 'https://backend-production-c0ab.up.railway.app';
    const containerRef = React.useRef(null);
    const chartRef     = React.useRef(null);
    const [chartLoading, setChartLoading] = React.useState(true);
    const [chartError,   setChartError]   = React.useState(null);
    const [chartReady,   setChartReady]   = React.useState(!!window.LightweightCharts);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [metaExpanded, setMetaExpanded] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth < 640);

    React.useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);


    const INTERVALS = ['15m','1h','1D','1W','1M','3M','1Y'];

    React.useEffect(() => {
        if (window.LightweightCharts) { setChartReady(true); return; }
        const s  = document.createElement('script');
        s.src    = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
        s.onload = () => setChartReady(true);
        s.onerror= () => setChartError('Failed to load chart library');
        document.head.appendChild(s);
    }, []);

    React.useEffect(() => {
        if (!chartReady || !containerRef.current) return;
        const LC = window.LightweightCharts;

        if (chartRef.current) {
            try { chartRef.current.remove(); } catch {}
            chartRef.current = null;
        }

        const container = containerRef.current;
        const chart = LC.createChart(container, {
            width:           container.clientWidth,
            height:          300,
            layout:          { background: { color: '#0f172a' }, textColor: '#94a3b8' },
            grid:            { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
            crosshair:       { mode: LC.CrosshairMode.Normal },
            rightPriceScale: { borderColor: '#1e293b' },
            timeScale:       { borderColor: '#1e293b', timeVisible: true, secondsVisible: false },
        });
        chartRef.current = chart;

                const ro = new ResizeObserver(() => {
            if (chartRef.current && container.clientWidth > 0) {
                chartRef.current.applyOptions({
                    width:  container.clientWidth,
                    height: container.clientHeight || 300,
                });
            }
        });
        ro.observe(container);

        const loadData = async () => {
            if (mountDelay > 0) {
                await new Promise(r => setTimeout(r, mountDelay));
                if (!chartRef.current) return; // chart got unmounted during the wait
            }
            setChartLoading(true);
            setChartError(null);
            try {
                const res  = await fetch(`${BACKEND}/api/snowai_thundervault_ohlcv_chart_stream/`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ ticker, interval, indicators: ['ema'] }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Failed to load data');
                if (!chartRef.current) return;

                const series = chart.addCandlestickSeries({
                    upColor:         '#10b981',
                    downColor:       '#ef4444',
                    borderUpColor:   '#10b981',
                    borderDownColor: '#ef4444',
                    wickUpColor:     '#10b981',
                    wickDownColor:   '#ef4444',
                });
                series.setData(json.candles);

                if (json.ema20 && json.ema20.length > 0) {
                    const e20 = chart.addLineSeries({
                        color: '#10b981', lineWidth: 1,
                        title: 'EMA20', lastValueVisible: false, priceLineVisible: false,
                    });
                    e20.setData(json.ema20);
                }
                if (json.ema50 && json.ema50.length > 0) {
                    const e50 = chart.addLineSeries({
                        color: '#3b82f6', lineWidth: 1,
                        title: 'EMA50', lastValueVisible: false, priceLineVisible: false,
                    });
                    e50.setData(json.ema50);
                }
                if (json.ema200 && json.ema200.length > 0) {
                    const e200 = chart.addLineSeries({
                        color: '#ef4444', lineWidth: 1,
                        title: 'EMA200', lastValueVisible: false, priceLineVisible: false,
                    });
                    e200.setData(json.ema200);
                }

                chart.timeScale().fitContent();
                // At the end of loadData() in Effect A, after fitContent():
                if (positions.length > 0) {
                    // small timeout so the series is fully settled before drawing
                    setTimeout(() => drawPositionLines(positions), 50);
                }
            } catch (e) {
                setChartError(e.message);
            } finally {
                setChartLoading(false);
            }
        };

        loadData();

        return () => {
            ro.disconnect();
            try { chart.remove(); } catch {}
        };
    }, [chartReady, ticker, interval]);

        return (
        <div style={{
            backgroundColor: '#0f172a',
            borderRadius: isFullscreen ? '0px' : '12px',
            overflow: 'hidden',
            border: isFullscreen ? 'none' : '1px solid #1e293b',
            marginTop: isFullscreen ? 0 : '10px',
            ...(isFullscreen ? { position: 'fixed', inset: 0, zIndex: 10050, display: 'flex', flexDirection: 'column' } : {}),
        }}>
            {/* Toolbar */}
            <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
                backgroundColor: '#0a1628',
            }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff', flex: 1, minWidth: 0 }}>
                    📊 {ticker}
                </span>

                {INTERVALS.map(iv => (
                    <button
                        key={iv}
                        onClick={() => onIntervalChange && onIntervalChange(iv)}
                        style={{
                            padding: '3px 9px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: interval === iv ? '#3b82f6' : 'rgba(255,255,255,0.07)',
                            color: interval === iv ? '#fff' : '#64748b',
                            transition: 'all 0.15s',
                        }}
                    >
                        {iv}
                    </button>
                ))}

                <a
                                    
                    href={'https://www.tradingview.com/chart/?symbol=' + ticker}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        padding: '3px 9px',
                        borderRadius: '5px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        backgroundColor: 'rgba(41,98,255,0.15)',
                        color: '#2962ff',
                        border: '1px solid rgba(41,98,255,0.3)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    TV ↗
                </a>

                <button
                    onClick={() => setIsFullscreen(f => !f)}
                    title={isFullscreen ? 'Exit full view' : 'Full view'}
                    style={{
                        padding: '3px 9px', borderRadius: '5px', fontSize: '13px', fontWeight: '700',
                        cursor: 'pointer', border: 'none', backgroundColor: 'rgba(255,255,255,0.07)', color: '#94a3b8',
                    }}
                >
                    {isFullscreen ? '⛶ Exit' : '⛶'}
                </button>
                
            </div>

                        {/* Chart area */}
            <div style={{ position: 'relative', height: isFullscreen ? 'calc(100vh - 230px)' : '300px', minHeight: isFullscreen ? '320px' : '300px' }}>
                {scannerMeta && (
                    <div
                        onClick={() => setMetaExpanded(e => !e)}
                        style={{
                            position: 'absolute', top: '8px', left: '8px', zIndex: 3,
                            backgroundColor: 'rgba(10,22,40,0.92)', borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '6px 8px' : '8px 12px',
                            cursor: 'pointer', maxWidth: isMobile ? '150px' : '220px', backdropFilter: 'blur(4px)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: scannerMeta.direction === 'BULLISH' ? '#10b981' : scannerMeta.direction === 'BEARISH' ? '#ef4444' : '#94a3b8' }}>
                                {scannerMeta.direction === 'BULLISH' ? '▲' : scannerMeta.direction === 'BEARISH' ? '▼' : '→'} {scannerMeta.signal ? scannerMeta.signal.replace(/_/g,' ') : scannerMeta.direction}
                            </span>
                            <span style={{ fontSize: isMobile ? '9px' : '10px', color: '#64748b' }}>{metaExpanded ? '▾' : '▸'}</span>
                        </div>
                        {scannerMeta.score != null && (
                            <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#94a3b8', marginTop: '2px' }}>
                                Score <strong style={{ color: '#fff' }}>{Math.round(scannerMeta.score)}</strong>
                                {scannerMeta.stability && (
                                    <> · 🛡️ <strong style={{ color: stabilityLabel(scannerMeta.stability.combined.winRate).color }}>{scannerMeta.stability.combined.stabilityScore}%</strong></>
                                )}
                            </div>
                        )}
                        {metaExpanded && (
                            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {[
                                    ['ADX', scannerMeta.adxNow],
                                    ['ROC 20d', scannerMeta.roc20 != null ? `${scannerMeta.roc20}%` : null],
                                    ['Vol Ratio', scannerMeta.volRatio != null ? `${scannerMeta.volRatio}×` : null],
                                    ['From 52W High', scannerMeta.pctFromHigh != null ? `${scannerMeta.pctFromHigh}%` : null],
                                    ['Price', scannerMeta.currentPrice != null ? `$${scannerMeta.currentPrice}` : null],
                                ].filter(([, v]) => v != null).map(([label, val]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: isMobile ? '9px' : '10px' }}>
                                        <span style={{ color: '#64748b' }}>{label}</span>
                                        <span style={{ color: '#fff', fontWeight: '700' }}>{val}</span>
                                    </div>
                                ))}
                                {scannerMeta.stability && (
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                        {Object.entries(scannerMeta.stability.byHorizon).map(([h, cell]) => (
                                            <span key={h} title={`${h}D stability`} style={{
                                                fontSize: '9px', padding: '1px 6px', borderRadius: '8px',
                                                backgroundColor: 'rgba(255,255,255,0.06)', color: stabilityLabel(cell?.winRate).color, fontWeight: '700',
                                            }}>{h}D {cell?.stabilityScore != null ? `${cell.stabilityScore}%` : '—'}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {(chartLoading || !chartReady) && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0f172a',
                        gap: '8px',
                    }}>
                        <div style={{
                            fontSize: '22px',
                            display: 'inline-block',
                            animation: 'spin 1s linear infinite',
                        }}>
                            ⏳
                        </div>
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                            Loading {ticker}...
                        </span>
                    </div>
                )}

                {chartError && !chartLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0f172a',
                        gap: '8px',
                    }}>
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                        <span style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center', padding: '0 20px' }}>
                            {chartError}
                        </span>
                    </div>
                )}

                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

            </div>

            {/* EMA legend */}
            <div style={{
                padding: '7px 14px',
                backgroundColor: '#0a1628',
                borderTop: '1px solid #1e293b',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
            }}>
                {[
                    { color: '#10b981', label: 'EMA20'  },
                    { color: '#3b82f6', label: 'EMA50'  },
                    { color: '#ef4444', label: 'EMA200' },
                ].map(item => (
                    <span
                        key={item.label}
                        style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        <span style={{
                            width: '16px',
                            height: '2px',
                            backgroundColor: item.color,
                            display: 'inline-block',
                            borderRadius: '1px',
                        }} />
                        {item.label}
                    </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#334155' }}>
                    Candles · EMAs · {interval}
                </span>
            </div>
        </div>
    );
}

function computeStabilityStats(rows, horizons) {
    const byHorizon = {};
    let combinedWins = 0, combinedTotal = 0;
    horizons.forEach(h => {
        let wins = 0, total = 0;
        (rows || []).forEach(r => {
            if (r.error) return;
            const v = r.directionAdjustedReturns?.[String(h)];
            if (v == null) return;
            total += 1; if (v > 0) wins += 1;
            combinedTotal += 1; if (v > 0) combinedWins += 1;
        });
        const winRate = total > 0 ? Math.round((wins / total) * 1000) / 10 : null;
        const stabilityScore = winRate != null ? Math.round(Math.abs(winRate - 50) * 2 * 10) / 10 : null;
        byHorizon[String(h)] = { winRate, stabilityScore, count: total };
    });
    const combinedWinRate = combinedTotal > 0 ? Math.round((combinedWins / combinedTotal) * 1000) / 10 : null;
    const combinedStability = combinedWinRate != null ? Math.round(Math.abs(combinedWinRate - 50) * 2 * 10) / 10 : null;
    return { byHorizon, combined: { winRate: combinedWinRate, stabilityScore: combinedStability, count: combinedTotal } };
}

function computeStabilityByAsset(rows, horizons, keyField) {
    const grouped = {};
    (rows || []).forEach(r => {
        const key = r[keyField];
        if (!key) return;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
    });
    const out = {};
    Object.entries(grouped).forEach(([key, assetRows]) => {
        const stats = computeStabilityStats(assetRows, horizons);
        out[key] = { key, occurrenceCount: assetRows.length, rows: assetRows, ...stats };
    });
    return out;
}

function stabilityLabel(winRate) {
    if (winRate == null) return { label: 'No Data', color: '#94a3b8' };
    if (winRate >= 70) return { label: 'Consistently Positive', color: '#10b981' };
    if (winRate <= 30) return { label: 'Consistently Negative', color: '#ef4444' };
    return { label: 'Mixed / Unstable', color: '#f59e0b' };
}

function OccurrenceDots({ rows, horizon }) {
    const sorted = [...(rows || [])].sort((a, b) => a.date.localeCompare(b.date));
    return (
        <div style={{ display:'flex', gap:'2px', flexWrap:'wrap', maxWidth:'170px' }}>
            {sorted.map((r, i) => {
                const v = r.directionAdjustedReturns?.[String(horizon)];
                const color = v == null ? '#e2e8f0' : v >= 0 ? '#10b981' : '#ef4444';
                return <span key={i} title={`${r.date}: ${v != null ? (v >= 0 ? '+' : '') + v + '%' : 'no data'}`}
                    style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor: color, display:'inline-block' }} />;
            })}
        </div>
    );
}

function StabilityRankingTable({ rows, horizons, keyField, onSelectAsset, title = 'Asset Stability Ranking', minOccurrences = 2 }) {
    const [horizonFocus, setHorizonFocus] = React.useState('combined');
    const [search, setSearch] = React.useState('');

    const byAsset = React.useMemo(() => computeStabilityByAsset(rows, horizons, keyField), [rows, horizons, keyField]);
    let list = Object.values(byAsset).filter(a => a.occurrenceCount >= minOccurrences);
    if (search.trim()) {
        const q = search.trim().toUpperCase();
        list = list.filter(a => a.key.toUpperCase().includes(q));
    }
    list = [...list].sort((a, b) => {
        const av = horizonFocus === 'combined' ? (a.combined.stabilityScore ?? -1) : (a.byHorizon[horizonFocus]?.stabilityScore ?? -1);
        const bv = horizonFocus === 'combined' ? (b.combined.stabilityScore ?? -1) : (b.byHorizon[horizonFocus]?.stabilityScore ?? -1);
        return bv - av;
    });

    if (list.length === 0) return null;

    const HORIZON_LABELS = { 1:'1D', 3:'3D', 5:'5D', 10:'10D', 20:'20D' };
    const chip = (active) => ({
        padding:'2px 9px', borderRadius:'12px', fontSize:'10px', fontWeight:'700', cursor:'pointer',
        border:`1px solid ${active ? '#0891b2' : '#e2e8f0'}`,
        backgroundColor: active ? '#ecfeff' : '#fff', color: active ? '#0891b2' : '#94a3b8',
    });

    return (
        <div style={{ marginBottom:'22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <Shield size={15} color="#1a1a1a" />
                    <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>{title}</span>
                </div>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    style={{ padding:'4px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'11px', outline:'none', width:'110px' }} />
                <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                    <button onClick={() => setHorizonFocus('combined')} style={chip(horizonFocus === 'combined')}>Combined</button>
                    {horizons.map(h => (
                        <button key={h} onClick={() => setHorizonFocus(String(h))} style={chip(horizonFocus === String(h))}>{HORIZON_LABELS[h] || `${h}D`}</button>
                    ))}
                </div>
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>min {minOccurrences} occurrences · click to see full stats</span>
            </div>
            <div style={{ overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:'10px' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                    <thead>
                        <tr style={{ backgroundColor:'#f8fafc' }}>
                            <th style={{ padding:'7px 10px', textAlign:'left', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Asset</th>
                            <th style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Occ.</th>
                            <th style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Win Rate</th>
                            <th style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Stability</th>
                            <th style={{ padding:'7px 10px', textAlign:'left', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Pattern</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((a, i) => {
                            const cell = horizonFocus === 'combined' ? a.combined : a.byHorizon[horizonFocus];
                            const info = stabilityLabel(cell?.winRate);
                            const dotHorizon = horizonFocus === 'combined' ? (horizons.includes(5) ? 5 : horizons[0]) : horizonFocus;
                            return (
                                <tr key={a.key} onClick={() => onSelectAsset(a.key)}
                                    style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', backgroundColor: i === 0 ? `${info.color}08` : 'transparent' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i === 0 ? `${info.color}08` : 'transparent'}
                                >
                                    <td style={{ padding:'7px 10px', fontWeight:'800', color:'#1a1a1a', whiteSpace:'nowrap' }}>
                                        {i === 0 && '🏆 '}{a.key}
                                    </td>
                                    <td style={{ padding:'7px 10px', textAlign:'center', color:'#64748b' }}>{a.occurrenceCount}</td>
                                    <td style={{ padding:'7px 10px', textAlign:'center', color:'#475569' }}>{cell?.winRate != null ? `${cell.winRate}%` : '—'}</td>
                                    <td style={{ padding:'7px 10px', textAlign:'center' }}>
                                        <div style={{ fontSize:'13px', fontWeight:'900', color: info.color }}>{cell?.stabilityScore != null ? `${cell.stabilityScore}%` : '—'}</div>
                                        <div style={{ fontSize:'9px', fontWeight:'700', color: info.color }}>{info.label}</div>
                                    </td>
                                    <td style={{ padding:'7px 10px' }}><OccurrenceDots rows={a.rows} horizon={dotHorizon} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


function TrendReversalScanner({ isOpen, onClose, onSelectTicker }) {
    const BACKEND    = 'https://backend-production-c0ab.up.railway.app';
    const ALL_TICKERS = Object.keys(SECTOR_MAP);

    const [loading,     setLoading]     = React.useState(false);
    const [results,     setResults]     = React.useState(null);
    const [error,       setError]       = React.useState(null);
    const [minCap,      setMinCap]      = React.useState('10B');
    const [filterSig,   setFilterSig]   = React.useState('ALL');
    const [filterDir,   setFilterDir]   = React.useState('ALL');
    const [sortBy,      setSortBy]      = React.useState('score');
    const [expandedRow, setExpandedRow] = React.useState(null);
    const [search,      setSearch]      = React.useState('');
    const [chartTicker, setChartTicker] = React.useState(null);
    const [chartInterval, setChartInterval] = React.useState('1D');
    const [showAllCharts, setShowAllCharts] = React.useState(false);


    // -- Watchlist state --
    const [watchlist,        setWatchlist]        = React.useState([]);
    const [watchlistLoading, setWatchlistLoading] = React.useState(false);
    const [addInput,         setAddInput]         = React.useState('');
    const [addCategory,      setAddCategory]      = React.useState('stocks');
    const [useWatchlistOnly, setUseWatchlistOnly] = React.useState(false);

    // -- Score / AI verdict filtering --
    const [filterMinScore,  setFilterMinScore]  = React.useState(0);
    const [filterAiVerdict, setFilterAiVerdict] = React.useState('ALL');

    const [isBackgroundRunning, setIsBackgroundRunning] = React.useState(false);
    const [scannedAt, setScannedAt] = React.useState(null);
    const [scannerError, setScannerError] = React.useState(null);
    const pollRef = React.useRef(null);

    const [backgroundRunningSince, setBackgroundRunningSince] = React.useState(null);
    const [showForceReset, setShowForceReset] = React.useState(false);
    const [resetting, setResetting] = React.useState(false);

    React.useEffect(() => {
        if (isBackgroundRunning) {
            setBackgroundRunningSince(prev => prev || Date.now());
        } else {
            setBackgroundRunningSince(null);
            setShowForceReset(false);
        }
    }, [isBackgroundRunning]);

    React.useEffect(() => {
        if (!backgroundRunningSince) return;
        const check = () => {
            if (Date.now() - backgroundRunningSince > 3 * 60 * 1000) setShowForceReset(true);
        };
        check();
        const id = setInterval(check, 15000);
        return () => clearInterval(id);
    }, [backgroundRunningSince]);

    // Fetch on mount
    React.useEffect(() => { fetchWatchlist(); }, []);

    // -- AI Opportunity Analysis (external AI, copy/paste pattern, multi-source) --
    const [aiRuns, setAiRuns] = React.useState({});          // { TICKER: [ {source, verdict, opportunityScore, badge, thesis, sectorRelation, risks, savedAt} ] }
    const [aiSynthesis, setAiSynthesis] = React.useState({}); // { TICKER: {finalVerdict, finalOpportunityScore, agreementLevel, consensusSummary, disagreements, synthesizedThesis, runCountAtSynthesis, savedAt} }
    const [aiPromptScope, setAiPromptScope] = React.useState(null); // { mode:'bulk'|'individual'|'synthesis', stocks?, ticker? }
    const [showAiPromptModal, setShowAiPromptModal] = React.useState(false);
    const [showAiPasteModal, setShowAiPasteModal] = React.useState(false);
    const [aiPasteText, setAiPasteText] = React.useState('');
    const [aiPasteSource, setAiPasteSource] = React.useState('');
    const [aiPasteError, setAiPasteError] = React.useState(null);
    const [aiCopied, setAiCopied] = React.useState(false);
    const [aiLastOpenedSource, setAiLastOpenedSource] = React.useState('');

    // -- Daily snapshot save (for backtesting) --
    const [snapshotSaving, setSnapshotSaving] = React.useState(false);
    const [snapshotResult, setSnapshotResult] = React.useState(null);
    const [snapshotError,  setSnapshotError]  = React.useState(null);

    // -- Stability check (against saved backtest history) --
    const STABILITY_HORIZONS = [1, 3, 5, 10, 20];
    const [stabilityLoading, setStabilityLoading] = React.useState(false);
    const [stabilityError,   setStabilityError]   = React.useState(null);
    const [stabilityData,    setStabilityData]    = React.useState(null);
    const [showStabilityModal, setShowStabilityModal] = React.useState(false);

    React.useEffect(() => {
        const loadCached = async () => {
            try {
                const runsRes = await window.storage.get('scanner-ai-runs');
                if (runsRes?.value) setAiRuns(JSON.parse(runsRes.value));
            } catch {}
            try {
                const synthRes = await window.storage.get('scanner-ai-synthesis');
                if (synthRes?.value) setAiSynthesis(JSON.parse(synthRes.value));
            } catch {}
        };
        loadCached();
    }, []);

    const saveAiRuns = async (updated) => {
        setAiRuns(updated);
        try { await window.storage.set('scanner-ai-runs', JSON.stringify(updated)); } catch {}
    };

    const saveAiSynthesis = async (updated) => {
        setAiSynthesis(updated);
        try { await window.storage.set('scanner-ai-synthesis', JSON.stringify(updated)); } catch {}
    };

    const removeAiRun = (ticker, runIdx) => {
        const updated = { ...aiRuns };
        updated[ticker] = (updated[ticker] || []).filter((_, i) => i !== runIdx);
        if (updated[ticker].length === 0) delete updated[ticker];
        saveAiRuns(updated);
    };

    // -- Consensus math: mean score, mode verdict, agreement % ------------------
    const getConsensus = (ticker) => {
        const runs = aiRuns[ticker];
        if (!runs || runs.length === 0) return null;
        const scores = runs.map(r => r.opportunityScore).filter(v => typeof v === 'number');
        const meanScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
        const counts = {};
        runs.forEach(r => { if (r.verdict) counts[r.verdict] = (counts[r.verdict]||0) + 1; });
        const modeVerdict = Object.keys(counts).length
            ? Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0]
            : null;
        const agreement = (modeVerdict && runs.length) ? Math.round((counts[modeVerdict]/runs.length) * 100) : null;
        return { meanScore, modeVerdict, agreement, runCount: runs.length };
    };

    const getEffectiveVerdict = (ticker) => {
        if (aiSynthesis[ticker]) return aiSynthesis[ticker].finalVerdict;
        const c = getConsensus(ticker);
        return c?.modeVerdict || null;
    };

    const fetchWatchlist = async () => {
        setWatchlistLoading(true);
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_watchlist_list/`);
            const json = await res.json();
            setWatchlist(json.assets || []);
        } catch(e) { console.error('[Watchlist]', e); }
        finally { setWatchlistLoading(false); }
    };

    const addToWatchlist = async (sym, category) => {
        if (!sym.trim()) return;
        await fetch(`${BACKEND}/api/snowvault_watchlist_add/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ symbol: sym.trim().toUpperCase(), category }),
        });
        fetchWatchlist();
        setAddInput('');
    };

    const removeFromWatchlist = async (sym) => {
        await fetch(`${BACKEND}/api/snowvault_watchlist_remove/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ symbol: sym }),
        });
        fetchWatchlist();
    };

    // When running the scanner, swap tickers based on toggle:
    // Replace the existing `ALL_TICKERS` in run() with:
    const tickersToScan = useWatchlistOnly
        ? watchlist.map(a => a.symbol)
        : [...new Set([...ALL_TICKERS, ...watchlist.map(a => a.symbol)])];
    // then pass tickersToScan into the POST body instead of ALL_TICKERS

    const CAP_OPTIONS = {
        '1B':   1_000_000_000,
        '10B':  10_000_000_000,
        '50B':  50_000_000_000,
        '100B': 100_000_000_000,
        '500B': 500_000_000_000,
    };

    const SIG = {
        RANGE_BREAKOUT_BULL: { color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'🚀', label:'Range Breakout ▲' },
        RANGE_BREAKOUT_BEAR: { color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'🔻', label:'Range Breakout ▼' },
        ACCELERATING_BULL:   { color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', icon:'⚡', label:'Accelerating ▲'   },
        ACCELERATING_BEAR:   { color:'#f97316', bg:'#fff7ed', border:'#fed7aa', icon:'⚡', label:'Accelerating ▼'   },
        BREAKOUT:            { color:'#8b5cf6', bg:'#faf5ff', border:'#ddd6fe', icon:'📈', label:'Breakout'          },
        TREND_BUILDING:      { color:'#06b6d4', bg:'#ecfeff', border:'#a5f3fc', icon:'📊', label:'Trend Building'    },
        WATCH:               { color:'#94a3b8', bg:'#f8fafc', border:'#e2e8f0', icon:'👁',  label:'Watch'            },
    };

    const AI_VERDICT_CONFIG = {
        STRONG_OPPORTUNITY: { color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'🔥' },
        OPPORTUNITY:         { color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', icon:'📈' },
        NEUTRAL:             { color:'#94a3b8', bg:'#f8fafc', border:'#e2e8f0', icon:'➡️' },
        CAUTION:             { color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'⚠️' },
        AVOID:               { color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'⛔' },
    };

    const SNOWVAULT_SECTOR_ETF_HINTS = {
        'Technology':          'XLK',
        'Financial':            'XLF',
        'Healthcare':           'XLV',
        'Consumer Cyclical':    'XLY',
        'Consumer Defensive':   'XLP',
        'Energy':               'XLE',
        'Industrials':          'XLI',
        'Communication':        'XLC',
        'Real Estate':          'XLRE',
        'Materials':            'XLB',
        'Utilities':            'XLU',
    };

    const fmtCap = (v) => {
        if (!v) return '—';
        if (v >= 1e12) return `$${(v/1e12).toFixed(1)}T`;
        if (v >= 1e9)  return `$${(v/1e9).toFixed(0)}B`;
        return `$${(v/1e6).toFixed(0)}M`;
    };

    const run = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        setExpandedRow(null);
        setChartTicker(null);
        setSearch('');
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_trend_reversal_scanner_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                tickers:      tickersToScan,
                minMarketCap: CAP_OPTIONS[minCap],
                topN:         30,
                forceRefresh: true,   // user explicitly asked for fresh data
            }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setResults(json);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const filtered = (results?.results || [])
        .filter(r => !search || r.ticker.includes(search) || (r.name || '').toUpperCase().includes(search))
        .filter(r => filterSig === 'ALL' || r.signal === filterSig)
        .filter(r => filterDir === 'ALL' || r.direction === filterDir)
        .filter(r => (r.score || 0) >= filterMinScore)
        .filter(r => filterAiVerdict === 'ALL' || getEffectiveVerdict(r.ticker) === filterAiVerdict)
        .sort((a, b) => {
            if (sortBy === 'score') return b.score      - a.score;
            if (sortBy === 'adx')   return b.adxNow     - a.adxNow;
            if (sortBy === 'roc')   return (b.roc20||0) - (a.roc20||0);
            if (sortBy === 'vol')   return (b.volRatio||0) - (a.volRatio||0);
            if (sortBy === 'cap')   return (b.marketCap||0) - (a.marketCap||0);
            if (sortBy === 'ext')   return Math.abs(b.extendedChangePct||0) - Math.abs(a.extendedChangePct||0);
            return 0;
        });

    const buildScannerCohortContext = () => {
        const bySector = {};
        filtered.forEach(r => {
            const sec = r.sector || 'Unknown';
            if (!bySector[sec]) bySector[sec] = { bullish: 0, bearish: 0, neutral: 0, total: 0, scores: [] };
            bySector[sec].total += 1;
            if (r.direction === 'BULLISH') bySector[sec].bullish += 1;
            else if (r.direction === 'BEARISH') bySector[sec].bearish += 1;
            else bySector[sec].neutral += 1;
            if (typeof r.score === 'number') bySector[sec].scores.push(r.score);
        });
        return Object.entries(bySector).map(([sec, c]) => {
            const avg = c.scores.length ? (c.scores.reduce((a,b)=>a+b,0)/c.scores.length).toFixed(1) : 'n/a';
            const etf = SNOWVAULT_SECTOR_ETF_HINTS[sec] || 'n/a';
            return `- ${sec} (tracking ETF ~${etf}): ${c.bullish} bullish / ${c.bearish} bearish / ${c.neutral} neutral of ${c.total} scanner hits · avg score ${avg}`;
        }).join('\n');
    };

    const buildScannerAIPrompt = (scopeStocks) => {
        const cohortCtx = buildScannerCohortContext();
        const stockLines = scopeStocks.map(r => {
            const etf = SNOWVAULT_SECTOR_ETF_HINTS[r.sector] || null;
            return `### ${r.ticker} — ${r.name || ''} (${r.sector || 'Unknown sector'}${etf ? `, sector ETF ~${etf}` : ''})
Signal: ${r.signal} · Direction: ${r.direction} · Scanner Score: ${r.score}/100
Price: $${r.currentPrice ?? 'N/A'} · Market Cap: ${r.marketCap ? '$' + (r.marketCap/1e9).toFixed(1) + 'B' : 'N/A'}
ADX: ${r.adxNow ?? 'N/A'} · ROC20: ${r.roc20 ?? 'N/A'}% · Volume Ratio: ${r.volRatio ?? 'N/A'}× · From 52W High: ${r.pctFromHigh ?? 'N/A'}%`;
        }).join('\n\n');

        return `You are a hedge-fund-grade equity research analyst. A technical trend-reversal scanner just flagged the stock(s) below. Assess how genuinely LUCRATIVE each opportunity is — not just the technical signal in isolation, but cross-checked against what's actually happening in that stock's sector right now, so a signal that's really just broad sector rotation (or a stock quietly lagging while its whole sector rips) gets called out rather than missed.

Search the web for current sector performance (via each stock's tracking ETF and general sector news) and recent company-specific news for each ticker below before answering — don't rely on memorized data, markets move fast.

PEER COHORT WITHIN THIS SAME SCAN (how many of the scanner's OTHER hits in each sector are bullish/bearish right now — tells you if a move is sector-wide or stock-specific):
${cohortCtx || 'No peer cohort data available.'}

STOCK(S) TO ANALYSE:
${stockLines}

For EACH stock above, respond with ONLY a JSON array (no markdown, no backticks, no preamble), one object per stock, in this exact shape:
[
  {
    "ticker": "<ticker>",
    "opportunityScore": <integer 0-100>,
    "verdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
    "badge": "<max 4 words, punchy, for a small inline UI badge>",
    "sectorRelation": "<1-2 sentences: is this stock leading, lagging, or in line with its sector ETF and sector peers right now? Stock-specific or sector-wide move?>",
    "thesis": "<2-3 sentences: your synthesis of whether this is a lucrative opportunity right now, weighing the technical signal against sector/macro backdrop>",
    "risks": "<1-2 sentences: the main thing that would invalidate this thesis>"
  }
]

Do not include anything outside the JSON array. The response must be parseable by JSON.parse().`;
    };

    const buildSynthesisPrompt = (ticker) => {
        const runs = aiRuns[ticker] || [];
        const stockRow = filtered.find(x => x.ticker === ticker) || (results?.results || []).find(x => x.ticker === ticker);
        const runLines = runs.map((run, i) => `### Analysis ${i + 1} — source: ${run.source || 'Unknown AI'}
Verdict: ${run.verdict} · Opportunity Score: ${run.opportunityScore}/100
Thesis: ${run.thesis}
Sector Relation: ${run.sectorRelation || 'N/A'}
Risks: ${run.risks || 'N/A'}`).join('\n\n');

        return `You are a hedge-fund-grade equity research analyst acting purely as a SYNTHESIS layer — do not do new independent research. ${runs.length} different AI models have each independently analysed the same stock, ${ticker}${stockRow ? ' — ' + stockRow.name : ''}, for opportunity. Your job is to critically synthesise these ${runs.length} analyses into one final, most defensible verdict — explicitly flag where they agree, where they disagree, and what might explain any disagreement (different weighting of sector vs stock-specific factors, different data recency, etc).

${runLines}

Respond with ONLY a JSON object (no markdown, no backticks, no preamble):
{
  "finalVerdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
  "finalOpportunityScore": <integer 0-100>,
  "agreementLevel": "HIGH" | "MODERATE" | "LOW",
  "consensusSummary": "<2-3 sentences: what do the analyses actually agree on?>",
  "disagreements": "<1-2 sentences on where they diverge and why — empty string if none>",
  "synthesizedThesis": "<3-4 sentences: your final, most defensible take after weighing all ${runs.length} inputs>"
}
Do not include anything outside the JSON object. The response must be parseable by JSON.parse().`;
    };

    const buildBulkSynthesisPrompt = (tickers) => {
        const sections = tickers.map(ticker => {
            const runs = aiRuns[ticker] || [];
            const runLines = runs.map((run, i) => `  Analysis ${i + 1} — source: ${run.source || 'Unknown AI'}
  Verdict: ${run.verdict} · Opportunity Score: ${run.opportunityScore}/100
  Thesis: ${run.thesis}
  Sector Relation: ${run.sectorRelation || 'N/A'}
  Risks: ${run.risks || 'N/A'}`).join('\n\n');
            return `## ${ticker}\n${runLines}`;
        }).join('\n\n---\n\n');

        return `You are a hedge-fund-grade equity research analyst acting purely as a SYNTHESIS layer — do not do new independent research. For EACH stock below, multiple AI models have each independently analysed it for opportunity. Your job is to critically synthesise the analyses for EACH stock into one final, most defensible verdict per stock — explicitly flag where the models agree, where they disagree, and what might explain any disagreement.

${sections}

For EACH stock above, respond with ONLY a JSON array (no markdown, no backticks, no preamble), one object per stock, in this exact shape:
[
  {
    "ticker": "<ticker>",
    "finalVerdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
    "finalOpportunityScore": <integer 0-100>,
    "agreementLevel": "HIGH" | "MODERATE" | "LOW",
    "consensusSummary": "<2-3 sentences: what do the analyses for this stock actually agree on?>",
    "disagreements": "<1-2 sentences on where they diverge for this stock and why — empty string if none>",
    "synthesizedThesis": "<3-4 sentences: your final, most defensible take on this stock after weighing all inputs>"
  }
]

Do not include anything outside the JSON array. The response must be parseable by JSON.parse().`;
    };

    const openBulkAIPrompt       = () => { setAiPromptScope({ mode: 'bulk', stocks: filtered }); setShowAiPromptModal(true); };
    const openIndividualAIPrompt = (r) => { setAiPromptScope({ mode: 'individual', stocks: [r], ticker: r.ticker }); setShowAiPromptModal(true); };
    const openSynthesisPrompt    = (ticker) => { setAiPromptScope({ mode: 'synthesis', ticker }); setShowAiPromptModal(true); };

    const bulkSynthesisEligibleTickers = filtered
        .map(r => r.ticker)
        .filter(t => (aiRuns[t] || []).length >= 2);

    const openBulkSynthesisPrompt = () => {
        if (bulkSynthesisEligibleTickers.length === 0) return;
        setAiPromptScope({ mode: 'bulkSynthesis', tickers: bulkSynthesisEligibleTickers });
        setShowAiPromptModal(true);
    };
    const handlePasteAIResponse = () => {
        setAiPasteError(null);
        if (!aiPasteText.trim()) { setAiPasteError('Paste the JSON response first.'); return; }
        const clean = aiPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();

        // ── Synthesis mode: expects a single JSON object ─────────────────────
        if (aiPromptScope?.mode === 'synthesis') {
            let parsed;
            try { parsed = JSON.parse(clean); }
            catch (e) { setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`); return; }
            if (Array.isArray(parsed) || parsed.finalVerdict == null || parsed.synthesizedThesis == null) {
                setAiPasteError('Expected a single JSON object with finalVerdict + synthesizedThesis.');
                return;
            }
            const ticker  = aiPromptScope.ticker;
            const updated = { ...aiSynthesis };
            updated[ticker] = {
                ...parsed,
                runCountAtSynthesis: (aiRuns[ticker] || []).length,
                savedAt: new Date().toLocaleString(),
            };
            saveAiSynthesis(updated);
            setShowAiPasteModal(false);
            setAiPasteText('');
            return;
        }

        // ── Bulk synthesis mode: expects a JSON array, one synthesis per ticker ──
        if (aiPromptScope?.mode === 'bulkSynthesis') {
            let parsed;
            try { parsed = JSON.parse(clean); }
            catch (e) { setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`); return; }
            if (!Array.isArray(parsed)) {
                setAiPasteError('Expected a JSON array (one synthesis object per stock).');
                return;
            }
            const updated = { ...aiSynthesis };
            let addedCount = 0;
            parsed.forEach(item => {
                const t = String(item?.ticker || '').toUpperCase().trim();
                if (!t || item.finalVerdict == null || item.synthesizedThesis == null) return;
                updated[t] = {
                    ...item,
                    runCountAtSynthesis: (aiRuns[t] || []).length,
                    savedAt: new Date().toLocaleString(),
                };
                addedCount += 1;
            });
            if (addedCount === 0) {
                setAiPasteError('No valid synthesis entries found — check the response matches the expected format.');
                return;
            }
            saveAiSynthesis(updated);
            setShowAiPasteModal(false);
            setAiPasteText('');
            return;
        }

        // ── Bulk / individual mode: expects a JSON array, appends new runs ──
        let parsed;
        try { parsed = JSON.parse(clean); }
        catch (e) { setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`); return; }
        if (!Array.isArray(parsed)) {
            setAiPasteError('Expected a JSON array (one object per stock).');
            return;
        }
        const source  = aiPasteSource.trim() || aiLastOpenedSource || 'AI';
        const updated = { ...aiRuns };
        let addedCount = 0;
        parsed.forEach(item => {
            const t = String(item?.ticker || '').toUpperCase().trim();
            if (!t || item.verdict == null || item.thesis == null) return;
            if (!updated[t]) updated[t] = [];
            updated[t] = [...updated[t], { ...item, ticker: t, source, savedAt: new Date().toLocaleString() }];
            addedCount += 1;
        });
        if (addedCount === 0) {
            setAiPasteError('No valid stock entries found — check the response matches the expected format.');
            return;
        }
        saveAiRuns(updated);
        setShowAiPasteModal(false);
        setAiPasteText('');
        setAiPasteSource('');
    };

    const saveTodaySnapshot = async () => {
        if (!filtered.length) return;
        setSnapshotSaving(true);
        setSnapshotError(null);
        setSnapshotResult(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_scanner_snapshot_save/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ stocks: filtered, aiRuns, aiSynthesis }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setSnapshotResult(json);
        } catch (e) {
            setSnapshotError(e.message);
        } finally {
            setSnapshotSaving(false);
        }
    };

        const runStabilityCheck = async () => {
        if (!filtered.length) return;
        setStabilityLoading(true);
        setStabilityError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_scanner_backtest_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ tickers: filtered.map(r => r.ticker), limit: 5000, horizons: STABILITY_HORIZONS }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setStabilityData(computeStabilityByAsset(json.rows || [], STABILITY_HORIZONS, 'ticker'));
            setShowStabilityModal(true);
        } catch (e) {
            setStabilityError(e.message);
        } finally {
            setStabilityLoading(false);
        }
    };

    // ── Score ring ────────────────────────────────────────────────────────────
    const ScoreRing = ({ score }) => {
        const c = score >= 70 ? '#10b981' : score >= 45 ? '#3b82f6' : score >= 25 ? '#f59e0b' : '#94a3b8';
        return (
            <div style={{
                width:'42px', height:'42px', borderRadius:'50%',
                backgroundColor: c, flexShrink:0,
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                boxShadow:`0 2px 8px ${c}44`,
            }}>
                <span style={{ fontSize:'13px', fontWeight:'900', color:'#fff', lineHeight:1 }}>{Math.round(score)}</span>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
        <div
            style={{
                position:'fixed', inset:0,
                backgroundColor:'rgba(0,0,0,0.6)',
                zIndex:10020,
                display:'flex', alignItems:'flex-start', justifyContent:'center',
                padding:'16px',
                backdropFilter:'blur(4px)',
                overflowY:'auto',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width:'100%', maxWidth:'860px',
                    borderRadius:'18px', overflow:'hidden',
                    backgroundColor:'#fff',
                    boxShadow:'0 24px 80px rgba(0,0,0,0.25)',
                    fontFamily:"'Segoe UI', system-ui, sans-serif",
                    marginTop:'8px', marginBottom:'24px',
                    animation:'modalSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    padding:'18px 20px 14px',
                    background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2563eb 100%)',
                }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                                <span style={{ fontSize:'20px' }}>🔭</span>
                                <span style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>
                                    Trend Reversal & Velocity Scanner
                                </span>
                            </div>
                            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>
                                Detects ranging→trending transitions, rising momentum & volume confirmation across {ALL_TICKERS.length} stocks
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background:'rgba(255,255,255,0.12)', border:'none',
                            borderRadius:'50%', width:'32px', height:'32px',
                            color:'#fff', fontSize:'17px', cursor:'pointer',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            flexShrink:0,
                        }}>×</button>
                    </div>

                    {/* Controls row */}
                    <div style={{ display:'flex', gap:'8px', marginTop:'14px', flexWrap:'wrap', alignItems:'center' }}>
                        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', fontWeight:'700', whiteSpace:'nowrap' }}>
                            MIN CAP
                        </span>
                        {Object.keys(CAP_OPTIONS).map(k => (
                            <button key={k} onClick={() => setMinCap(k)}
                                style={{
                                    padding:'4px 10px', borderRadius:'6px',
                                    fontSize:'11px', fontWeight:'700',
                                    cursor:'pointer', border:'none',
                                    backgroundColor: minCap === k ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: minCap === k ? '#fff' : 'rgba(255,255,255,0.5)',
                                    transition:'all 0.15s',
                                }}>{k}</button>
                        ))}
                        <div style={{ width:'1px', height:'20px', backgroundColor:'rgba(255,255,255,0.15)', flexShrink:0 }}/>
                        <button
                            onClick={() => run(true)}
                            disabled={loading || isBackgroundRunning}
                            style={{
                                padding:'8px 20px', borderRadius:'9px',
                                background: (loading || isBackgroundRunning) ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg,#3b82f6,#2563eb)',
                                border:'none', color:'#fff',
                                fontWeight:'800', fontSize:'13px',
                                cursor: (loading || isBackgroundRunning) ? 'wait' : 'pointer',
                                display:'flex', alignItems:'center', gap:'7px',
                                boxShadow: (loading || isBackgroundRunning) ? 'none' : '0 4px 14px rgba(59,130,246,0.4)',
                                transition:'all 0.2s',
                            }}
                        >
                            {loading
                                ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block', fontSize:'15px' }}>⚡</span> Loading...</>
                                : isBackgroundRunning
                                ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block', fontSize:'15px' }}>⚡</span> Scanning in background...</>
                                : <><span>🔭</span> Run Fresh Scan</>}
                        </button>
                        {results && (
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)' }}>
                                {results.count} hits · {results.totalScanned} scanned
                                {scannedAt ? ` · as of ${scannedAt}` : ''}
                            </span>
                        )}
                        {results?.marketSession && (
                            <span style={{
                                padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'800',
                                backgroundColor: results.marketSession === 'pre' ? 'rgba(59,130,246,0.15)' : results.marketSession === 'post' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.08)',
                                color: results.marketSession === 'pre' ? '#93c5fd' : results.marketSession === 'post' ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                            }}>
                                {results.marketSession === 'pre' ? '🌅 Pre-Market' : results.marketSession === 'post' ? '🌆 After-Hours' : results.marketSession === 'regular' ? '🟢 Regular' : '🌙 Closed'}
                            </span>
                        )}
                    </div>
                </div>
                

                {/* ── Filter bar ── */}
                {results && !loading && (
                    <div style={{
                        padding:'10px 14px',
                        backgroundColor:'#f8fafc',
                        borderBottom:'1px solid #e2e8f0',
                        display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center',
                    }}>
                        {/* Search */}
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value.toUpperCase())}
                            placeholder="Filter... e.g. NVDA"
                            style={{
                                padding:'5px 11px', borderRadius:'8px',
                                border:'2px solid #e2e8f0', fontSize:'12px',
                                fontWeight:'600', outline:'none', width:'130px',
                                color:'#1a1a1a', backgroundColor:'#fff',
                            }}
                            onFocus={e  => e.target.style.borderColor = '#3b82f6'}
                            onBlur={e   => e.target.style.borderColor = '#e2e8f0'}
                        />

                        <div style={{ width:'1px', height:'16px', backgroundColor:'#e2e8f0', flexShrink:0 }}/>

                        {/* Signal filters */}
                        <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                            {['ALL', ...Object.keys(SIG)].map(s => {
                                const cfg    = SIG[s];
                                const active = filterSig === s;
                                return (
                                    <button key={s} onClick={() => setFilterSig(s)}
                                        style={{
                                            padding:'3px 9px', borderRadius:'20px',
                                            fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                            border:`1px solid ${active && cfg ? cfg.color : '#e2e8f0'}`,
                                            backgroundColor: active && cfg ? cfg.bg : '#fff',
                                            color: active && cfg ? cfg.color : '#94a3b8',
                                            transition:'all 0.15s', whiteSpace:'nowrap',
                                        }}>
                                        {s === 'ALL' ? 'All' : (cfg?.icon + ' ' + cfg?.label)}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ width:'1px', height:'16px', backgroundColor:'#e2e8f0', flexShrink:0 }}/>

                        {/* Direction filters */}
                        {['ALL','BULLISH','BEARISH','NEUTRAL'].map(d => (
                            <button key={d} onClick={() => setFilterDir(d)}
                                style={{
                                    padding:'3px 9px', borderRadius:'20px',
                                    fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                    border:`1px solid ${filterDir === d ? '#3b82f6' : '#e2e8f0'}`,
                                    backgroundColor: filterDir === d ? '#eff6ff' : '#fff',
                                    color: filterDir === d ? '#3b82f6' : '#94a3b8',
                                    transition:'all 0.15s',
                                }}>{d === 'ALL' ? 'All Dirs' : d}</button>
                        ))}

                        <div style={{ width:'1px', height:'16px', backgroundColor:'#e2e8f0', flexShrink:0 }}/>

                        {/* Min score filter */}
                        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                            <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'600', whiteSpace:'nowrap' }}>Min Score:</span>
                            {[0, 40, 60, 80].map(threshold => (
                                <button key={threshold} onClick={() => setFilterMinScore(threshold)}
                                    style={{
                                        padding:'3px 9px', borderRadius:'20px',
                                        fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                        border:`1px solid ${filterMinScore === threshold ? '#f59e0b' : '#e2e8f0'}`,
                                        backgroundColor: filterMinScore === threshold ? '#fffbeb' : '#fff',
                                        color: filterMinScore === threshold ? '#b45309' : '#94a3b8',
                                        transition:'all 0.15s',
                                    }}>{threshold === 0 ? 'Any' : `${threshold}+`}</button>
                            ))}
                        </div>

                        {(Object.keys(aiRuns).length > 0 || Object.keys(aiSynthesis).length > 0) && (
                            <>
                                <div style={{ width:'1px', height:'16px', backgroundColor:'#e2e8f0', flexShrink:0 }}/>
                                <div style={{ display:'flex', alignItems:'center', gap:'5px', flexWrap:'wrap' }}>
                                    <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'600', whiteSpace:'nowrap' }}>AI Verdict:</span>
                                    {['ALL', ...Object.keys(AI_VERDICT_CONFIG)].map(v => {
                                        const cfg = AI_VERDICT_CONFIG[v];
                                        const active = filterAiVerdict === v;
                                        return (
                                            <button key={v} onClick={() => setFilterAiVerdict(v)}
                                                style={{
                                                    padding:'3px 9px', borderRadius:'20px',
                                                    fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                                    border:`1px solid ${active && cfg ? cfg.color : '#e2e8f0'}`,
                                                    backgroundColor: active && cfg ? cfg.bg : '#fff',
                                                    color: active && cfg ? cfg.color : '#94a3b8',
                                                    transition:'all 0.15s', whiteSpace:'nowrap',
                                                }}>
                                                {v === 'ALL' ? 'All' : `${cfg.icon} ${v.replace('_',' ')}`}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        <div style={{ width:'1px', height:'16px', backgroundColor:'#e2e8f0', flexShrink:0 }}/>
<button
                            onClick={openBulkAIPrompt}
                            disabled={filtered.length === 0}
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor: filtered.length === 0 ? 'not-allowed' : 'pointer',
                                border:'1px solid rgba(219,39,119,0.4)',
                                background:'linear-gradient(135deg,#7c3aed,#db2777)',
                                color:'#fff', opacity: filtered.length === 0 ? 0.5 : 1,
                                whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            🧠 AI Opportunity Scan ({filtered.length})
                        </button>

                        <button
                            onClick={openBulkSynthesisPrompt}
                            disabled={bulkSynthesisEligibleTickers.length === 0}
                            title={bulkSynthesisEligibleTickers.length === 0 ? 'Needs 2+ AI runs on at least one shown stock' : `Synthesize ${bulkSynthesisEligibleTickers.length} stocks with 2+ AI opinions each`}
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor: bulkSynthesisEligibleTickers.length === 0 ? 'not-allowed' : 'pointer',
                                border:'1px solid rgba(99,102,241,0.4)',
                                background: bulkSynthesisEligibleTickers.length === 0 ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                color: bulkSynthesisEligibleTickers.length === 0 ? '#94a3b8' : '#fff',
                                whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            ✨ Synthesize All ({bulkSynthesisEligibleTickers.length})
                        </button>

                                                <button
                            onClick={saveTodaySnapshot}
                            disabled={snapshotSaving || filtered.length === 0}
                            title="Save today's snapshot of shown stocks + any AI analysis for backtesting later"
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor: (snapshotSaving || filtered.length === 0) ? 'not-allowed' : 'pointer',
                                border:'1px solid rgba(16,185,129,0.4)',
                                backgroundColor: snapshotSaving ? 'rgba(16,185,129,0.1)' : '#10b981',
                                color: snapshotSaving ? '#10b981' : '#fff',
                                opacity: filtered.length === 0 ? 0.5 : 1,
                                whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            {snapshotSaving
                                ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>💾</span> Saving...</>
                                : <>💾 Save Today's Snapshot</>}
                        </button>

                        <button
                            onClick={runStabilityCheck}
                            disabled={stabilityLoading || filtered.length === 0}
                            title="Rank currently-shown stocks by historical stability using saved backtest history"
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor: (stabilityLoading || filtered.length === 0) ? 'not-allowed' : 'pointer',
                                border:'1px solid rgba(8,145,178,0.4)',
                                backgroundColor: stabilityLoading ? 'rgba(8,145,178,0.1)' : '#0891b2',
                                color: stabilityLoading ? '#0891b2' : '#fff',
                                opacity: filtered.length === 0 ? 0.5 : 1,
                                whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            {stabilityLoading
                                ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>🛡️</span> Checking...</>
                                : <>🛡️ Check Stability</>}
                        </button>

                        {/* Sort */}

                        <button
                            onClick={() => setShowAllCharts(s => !s)}
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor:'pointer',
                                border:`1px solid ${showAllCharts ? '#7c3aed' : '#e2e8f0'}`,
                                backgroundColor: showAllCharts ? '#faf5ff' : '#fff',
                                color: showAllCharts ? '#7c3aed' : '#64748b',
                                transition:'all 0.15s', whiteSpace:'nowrap',
                                display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            {showAllCharts ? '📊 Hide All Charts' : '📊 Show All Charts'}
                        </button>

                        {/* Sort */}
                        <div style={{ marginLeft:'auto', display:'flex', gap:'4px', alignItems:'center', flexWrap:'wrap' }}>
                            <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'600' }}>Sort:</span>
                                {[['score','Score'],['adx','ADX'],['roc','ROC'],['vol','Vol'],['cap','Cap'],['ext','Ext Move']].map(([k,l]) => (
                                <button key={k} onClick={() => setSortBy(k)}
                                    style={{
                                        padding:'3px 8px', borderRadius:'6px',
                                        fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none',
                                        backgroundColor: sortBy === k ? '#1e3a5f' : '#e2e8f0',
                                        color: sortBy === k ? '#fff' : '#64748b',
                                    }}>{l}</button>
                            ))}
                        </div>
                    </div>
                )}


                {snapshotResult && (
                    <div style={{ padding:'8px 20px', backgroundColor:'#f0fdf4', borderBottom:'1px solid #bbf7d0', fontSize:'12px', color:'#065f46', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                        💾 Snapshot saved for {snapshotResult.date} — {snapshotResult.savedNew.length} new · {snapshotResult.updatedExisting.length} updated
                        {snapshotResult.errors.length > 0 && ` · ${snapshotResult.errors.length} failed`}
                        <button onClick={() => setSnapshotResult(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#065f46', cursor:'pointer', fontSize:'14px', fontWeight:'900', lineHeight:1, padding:0 }}>×</button>
                    </div>
                )}
                                {snapshotError && (
                    <div style={{ padding:'8px 20px', backgroundColor:'#fef2f2', borderBottom:'1px solid #fecaca', fontSize:'12px', color:'#b91c1c' }}>
                        ⚠️ Snapshot save error: {snapshotError}
                    </div>
                )}
                {stabilityError && (
                    <div style={{ padding:'8px 20px', backgroundColor:'#fef2f2', borderBottom:'1px solid #fecaca', fontSize:'12px', color:'#b91c1c' }}>
                        ⚠️ Stability check error: {stabilityError}
                    </div>
                )}

                {/* ── Watchlist panel ── */}
                <div style={{ padding:'12px 14px', backgroundColor:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', marginBottom:'10px' }}>
                        <span style={{ fontSize:'12px', fontWeight:'700', color:'#1e3a5f' }}>📌 My Watchlist</span>
                        <button onClick={() => setUseWatchlistOnly(w => !w)} style={{
                            padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                            border:'1px solid',
                            borderColor:   useWatchlistOnly ? '#2563eb' : '#e2e8f0',
                            backgroundColor: useWatchlistOnly ? '#eff6ff' : '#fff',
                            color:           useWatchlistOnly ? '#2563eb' : '#94a3b8',
                            cursor:'pointer',
                        }}>
                            {useWatchlistOnly ? 'Watchlist Only' : 'All + Watchlist'}
                        </button>
                    </div>

                    {/* Add row */}
                    <div style={{ display:'flex', gap:'6px', marginBottom:'10px', flexWrap:'wrap' }}>
                        <input
                            value={addInput}
                            onChange={e => setAddInput(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && addToWatchlist(addInput, addCategory)}
                            placeholder="Add ticker e.g. TSLA"
                            style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid #e2e8f0', fontSize:'12px', width:'130px', outline:'none' }}
                        />
                        <select value={addCategory} onChange={e => setAddCategory(e.target.value)}
                            style={{ padding:'5px 8px', borderRadius:'7px', border:'1px solid #e2e8f0', fontSize:'12px', color:'#333' }}>
                            {['stocks','forex','crypto','indices','commodities','bonds','etf','other'].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <button onClick={() => addToWatchlist(addInput, addCategory)} style={{
                            padding:'5px 12px', borderRadius:'7px', backgroundColor:'#2563eb',
                            color:'#fff', border:'none', fontSize:'12px', fontWeight:'700', cursor:'pointer',
                        }}>+ Add</button>
                    </div>

                    {/* Watchlist chips */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {watchlist.length === 0 && (
                            <span style={{ fontSize:'11px', color:'#94a3b8' }}>No assets yet — add some above</span>
                        )}
                        {watchlist.map(a => (
                            <div key={a.symbol} style={{
                                display:'flex', alignItems:'center', gap:'5px',
                                padding:'3px 10px', borderRadius:'20px',
                                backgroundColor:'#eff6ff', border:'1px solid #bfdbfe',
                                fontSize:'12px', fontWeight:'700', color:'#1d4ed8',
                            }}>
                                {a.symbol}
                                <span style={{ fontSize:'10px', color:'#94a3b8', fontWeight:'400' }}>{a.category}</span>
                                <button onClick={() => removeFromWatchlist(a.symbol)} style={{
                                    background:'none', border:'none', cursor:'pointer',
                                    color:'#94a3b8', fontSize:'13px', fontWeight:'900',
                                    lineHeight:1, padding:0,
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ maxHeight:'65vh', overflowY:'auto' }}>

                    {isBackgroundRunning && (
                        <div style={{
                            padding:'10px 20px', backgroundColor:'#eff6ff', borderBottom:'1px solid #bfdbfe',
                            display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#1d4ed8', fontWeight:'600', flexWrap:'wrap',
                        }}>
                            <span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⚡</span>
                            A fresh scan is running in the background — showing cached results below (auto-updates every 5s).
                            {showForceReset && (
                                <button
                                    onClick={forceResetScan}
                                    disabled={resetting}
                                    style={{
                                        marginLeft:'auto', padding:'4px 12px', borderRadius:'20px',
                                        fontSize:'11px', fontWeight:'800', cursor: resetting ? 'wait' : 'pointer',
                                        border:'1px solid #ef4444', backgroundColor:'#fff', color:'#ef4444',
                                        display:'flex', alignItems:'center', gap:'5px', whiteSpace:'nowrap',
                                    }}
                                >
                                    {resetting ? '⏳ Resetting...' : '⚠️ Stuck? Force Reset & Rescan'}
                                </button>
                            )}
                        </div>
                    )}
                    {scannerError && (
                        <div style={{
                            padding:'10px 20px', backgroundColor:'#fef2f2', borderBottom:'1px solid #fecaca',
                            fontSize:'12px', color:'#b91c1c',
                        }}>
                            ⚠️ Last scan error: {scannerError}
                        </div>
                    )}

                    {/* Empty prompt */}
                    {!loading && results && filtered.length === 0 && !isBackgroundRunning && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'48px', marginBottom:'14px' }}>🔭</div>
                            <div style={{ fontSize:'16px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>
                                No hits at this cap threshold
                            </div>
                            <div style={{ fontSize:'13px', color:'#64748b', maxWidth:'380px', margin:'0 auto', lineHeight:1.6 }}>
                                Try a lower market cap, or hit <strong>Run Fresh Scan</strong> to check right now.
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'40px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'14px' }}>⚡</div>
                            <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>
                                Scanning {ALL_TICKERS.length} stocks...
                            </div>
                            <div style={{ fontSize:'12px', color:'#94a3b8', lineHeight:1.6 }}>
                                Calculating ADX, ROC, volume velocity & breakout patterns.<br/>
                                This takes <strong>2-4 minutes</strong> for the full universe. Grab a coffee ☕<br/>
                                <span style={{ fontSize:'11px', color:'#cbd5e1', marginTop:'4px', display:'block' }}>
                                    Running in batches to avoid rate limits — hang tight
                                </span>

                            </div>
                            <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'18px' }}>
                                {[0,1,2,3,4].map(i => (
                                    <div key={i} style={{
                                        width:'8px', height:'8px', borderRadius:'50%',
                                        backgroundColor:'#3b82f6',
                                        animation:`sabrnaTyping 1.2s ${i*0.15}s infinite`,
                                    }}/>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div style={{ padding:'20px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px' }}>
                            ⚠️ {error}
                            <button onClick={run} style={{ marginLeft:'12px', color:'#b91c1c', background:'none', border:'1px solid #fecaca', borderRadius:'6px', padding:'2px 8px', cursor:'pointer', fontSize:'12px' }}>
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && filtered.length > 0 && (
                        <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:'8px' }}>
                            {filtered.map((r, rowIdx) => {
                                const sc      = SIG[r.signal] || SIG.WATCH;
                                const isExpanded = showAllCharts || expandedRow === r.ticker;
                                const dirColor   = r.direction === 'BULLISH' ? '#10b981' : r.direction === 'BEARISH' ? '#ef4444' : '#94a3b8';
                                return (
                                    <div key={r.ticker} style={{
                                        borderRadius:'12px',
                                        border:`1px solid ${isExpanded ? sc.color : '#e2e8f0'}`,
                                        overflow:'hidden',
                                        transition:'border-color 0.2s',
                                        boxShadow: isExpanded ? `0 4px 20px ${sc.color}22` : 'none',
                                    }}>
                                        {/* Main row */}
                                        <div
                                            onClick={() => {
                                                if (showAllCharts) return; // rows are all force-expanded
                                                setExpandedRow(isExpanded ? null : r.ticker);
                                                if (isExpanded) setChartTicker(null);
                                            }}
                                            style={{
                                                padding:'11px 14px',
                                                display:'flex', alignItems:'center', gap:'10px',
                                                cursor: showAllCharts ? 'default' : 'pointer',
                                                backgroundColor: isExpanded ? sc.bg : '#fff',
                                                transition:'background 0.15s',
                                            }}
                                            onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                            onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#fff'; }}
                                        >
                                            <ScoreRing score={r.score} />

                                            {/* Ticker + name */}
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                                                    <span style={{ fontSize:'15px', fontWeight:'800', color:'#1a1a1a' }}>{r.ticker}</span>
                                                    <span style={{
                                                        padding:'2px 8px', borderRadius:'10px',
                                                        fontSize:'11px', fontWeight:'700',
                                                        backgroundColor: sc.bg, color: sc.color,
                                                        border:`1px solid ${sc.border}`,
                                                        whiteSpace:'nowrap',
                                                    }}>{sc.icon} {sc.label}</span>
                                                    <span style={{
                                                        padding:'2px 8px', borderRadius:'10px',
                                                        fontSize:'11px', fontWeight:'700',
                                                        backgroundColor: dirColor + '15',
                                                        color: dirColor,
                                                        border:`1px solid ${dirColor}30`,
                                                    }}>
                                                        {r.direction === 'BULLISH' ? '▲' : r.direction === 'BEARISH' ? '▼' : '→'} {r.direction}
                                                    </span>
                                                                                                        {(() => {
                                                        const synth = aiSynthesis[r.ticker];
                                                        const runs  = aiRuns[r.ticker];
                                                        if (synth) {
                                                            const av = AI_VERDICT_CONFIG[synth.finalVerdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                            return (
                                                                <span title={synth.synthesizedThesis} style={{
                                                                    padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700',
                                                                    backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap',
                                                                }}>
                                                                    ✨ {av.icon} Synth ({synth.runCountAtSynthesis})
                                                                </span>
                                                            );
                                                        }
                                                        if (runs?.length >= 2) {
                                                            const c  = getConsensus(r.ticker);
                                                            const av = AI_VERDICT_CONFIG[c?.modeVerdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                            return (
                                                                <span title={`${c.runCount} AI runs · ${c.agreement}% agreement`} style={{
                                                                    padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700',
                                                                    backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap',
                                                                }}>
                                                                    🧠 ×{c.runCount} · {c.meanScore}
                                                                </span>
                                                            );
                                                        }
                                                        if (runs?.length === 1) {
                                                            const av = AI_VERDICT_CONFIG[runs[0].verdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                            return (
                                                                <span title={runs[0].thesis} style={{
                                                                    padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700',
                                                                    backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap',
                                                                }}>
                                                                    {av.icon} 🧠 {runs[0].badge}
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                    {stabilityData?.[r.ticker] && (() => {
                                                        const s = stabilityData[r.ticker];
                                                        const info = stabilityLabel(s.combined.winRate);
                                                        return (
                                                            <span title={`${s.combined.winRate}% win rate across ${s.occurrenceCount} occurrences (combined horizons)`} style={{
                                                                padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700',
                                                                backgroundColor: `${info.color}18`, color: info.color, border:`1px solid ${info.color}40`, whiteSpace:'nowrap',
                                                            }}>
                                                                🛡️ {s.combined.stabilityScore}%
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                                    {r.name} · {r.sector}
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div style={{ display:'flex', gap:'12px', alignItems:'center', flexShrink:0 }}>
                                                <div style={{ textAlign:'center', minWidth:'36px' }}>
                                                    <div style={{ fontSize:'13px', fontWeight:'800', color: r.adxNow >= 25 ? '#10b981' : r.adxNow >= 20 ? '#f59e0b' : '#94a3b8' }}>
                                                        {r.adxNow?.toFixed(0)}
                                                    </div>
                                                    <div style={{ fontSize:'9px', color:'#94a3b8', fontWeight:'600' }}>ADX</div>
                                                </div>
                                                <div style={{ textAlign:'center', minWidth:'44px' }}>
                                                    <div style={{ fontSize:'13px', fontWeight:'800', color: (r.roc20||0) >= 0 ? '#10b981' : '#ef4444' }}>
                                                        {r.roc20 != null ? `${r.roc20 >= 0 ? '+' : ''}${r.roc20}%` : '—'}
                                                    </div>
                                                    <div style={{ fontSize:'9px', color:'#94a3b8', fontWeight:'600' }}>ROC20</div>
                                                </div>
                                                <div style={{ textAlign:'center', minWidth:'36px' }}>
                                                    <div style={{ fontSize:'13px', fontWeight:'800', color: (r.volRatio||0) >= 1.3 ? '#10b981' : '#94a3b8' }}>
                                                        {r.volRatio != null ? `${r.volRatio}×` : '—'}
                                                    </div>
                                                    <div style={{ fontSize:'9px', color:'#94a3b8', fontWeight:'600' }}>VOL</div>
                                                </div>
                                                {r.extendedChangePct != null && (
                                                    <div style={{ textAlign:'center', minWidth:'48px' }}>
                                                        <div style={{ fontSize:'13px', fontWeight:'800', color: r.extendedChangePct >= 0 ? '#10b981' : '#ef4444' }}>
                                                            {r.extendedChangePct >= 0 ? '+' : ''}{r.extendedChangePct}%
                                                        </div>
                                                        <div style={{ fontSize:'9px', color:'#94a3b8', fontWeight:'600' }}>
                                                            {r.marketSession === 'pre' ? 'PRE' : 'POST'}{r.extendedMoveConfirms ? ' ✓' : ''}
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={{ textAlign:'right', minWidth:'55px' }}>
                                                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#1a1a1a' }}>
                                                        {r.currentPrice != null ? `$${r.currentPrice}` : '—'}
                                                    </div>
                                                    <div style={{ fontSize:'10px', color:'#94a3b8' }}>{fmtCap(r.marketCap)}</div>
                                                </div>
                                            </div>

                                            <div style={{
                                                fontSize:'14px',
                                                color: isExpanded ? sc.color : '#94a3b8',
                                                flexShrink:0, transition:'transform 0.2s',
                                                transform: isExpanded ? 'rotate(90deg)' : 'none',
                                            }}>›</div>
                                        </div>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div style={{
                                                padding:'14px 16px',
                                                backgroundColor:'#fafafa',
                                                borderTop:`1px solid ${sc.border}`,
                                                display:'flex', flexDirection:'column', gap:'12px',
                                            }}>
                                                {/* Why it showed up */}
                                                <div style={{
                                                    padding:'10px 14px', backgroundColor: sc.bg,
                                                    borderRadius:'8px', borderLeft:`3px solid ${sc.color}`,
                                                }}>
                                                    <div style={{ fontSize:'11px', fontWeight:'700', color:sc.color, letterSpacing:'0.07em', marginBottom:'4px' }}>
                                                        WHY THIS SHOWED UP
                                                    </div>
                                                    <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55 }}>
                                                        {r.rangeToTrend && `ADX moved from ${r.adx20Ago?.toFixed(0)} → ${r.adxNow?.toFixed(0)} over 20 bars — classic range-to-trend transition. `}
                                                        {r.adxRising && !r.rangeToTrend && `ADX rising (was ${r.adx5Ago?.toFixed(0)}, now ${r.adxNow?.toFixed(0)}) — trend is strengthening. `}
                                                        {r.rocAccelerating && `ROC accelerating (+${r.acceleration?.toFixed(2)} above recent avg) — momentum is speeding up. `}
                                                        {r.volConfirming && `Volume is ${r.volRatio}× the 20-day average — real conviction behind the move. `}
                                                        {r.breakingOut && `Price breaking above recent range highs. `}
                                                                                                                {r.earningsNearby && r.earningsBeat === true  && `Recent earnings beat (${r.daysSinceEarnings}d ago) may be fuelling this. `}
                                                        {r.earningsNearby && r.earningsBeat === false && `Recent earnings miss (${r.daysSinceEarnings}d ago) — trend is despite bad earnings. `}
                                                    </div>
                                                </div>

                                                {stabilityData?.[r.ticker] && (() => {
                                                    const s = stabilityData[r.ticker];
                                                    const info = stabilityLabel(s.combined.winRate);
                                                    return (
                                                        <div style={{ padding:'12px 14px', backgroundColor: `${info.color}10`, borderRadius:'8px', border:`1px solid ${info.color}30` }}>
                                                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                                                                <Shield size={13} color={info.color} />
                                                                <span style={{ fontSize:'11px', fontWeight:'700', color: info.color, letterSpacing:'0.07em' }}>
                                                                    HISTORICAL STABILITY
                                                                </span>
                                                                <span style={{ padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', backgroundColor: info.color, color:'#fff' }}>
                                                                    {s.combined.stabilityScore}% · {info.label}
                                                                </span>
                                                                <span style={{ fontSize:'10px', color:'#94a3b8' }}>{s.occurrenceCount} past occurrences</span>
                                                            </div>
                                                            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                                                                {STABILITY_HORIZONS.map(h => {
                                                                    const cell = s.byHorizon[String(h)];
                                                                    const hinfo = stabilityLabel(cell?.winRate);
                                                                    return (
                                                                        <div key={h} style={{ padding:'5px 9px', borderRadius:'8px', backgroundColor:'#fff', border:`1px solid ${hinfo.color}30`, textAlign:'center', minWidth:'50px' }}>
                                                                            <div style={{ fontSize:'9px', color:'#94a3b8', fontWeight:'700' }}>{h}D</div>
                                                                            <div style={{ fontSize:'12px', fontWeight:'800', color: hinfo.color }}>{cell?.stabilityScore != null ? `${cell.stabilityScore}%` : '—'}</div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Metrics grid */}

                                                {/* AI Opportunity Analysis (external AI, multi-source + synthesis) */}
                                                {(() => {
                                                    const runs  = aiRuns[r.ticker] || [];
                                                    const synth = aiSynthesis[r.ticker];
                                                    const c     = getConsensus(r.ticker);

                                                    return (
                                                        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>

                                                            {/* Synthesis — shown first if it exists */}
                                                            {synth && (() => {
                                                                const av = AI_VERDICT_CONFIG[synth.finalVerdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                                return (
                                                                    <div style={{ padding:'12px 14px', backgroundColor: av.bg, borderRadius:'8px', border:`2px solid ${av.color}` }}>
                                                                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                                                                            <span style={{ fontSize:'11px', fontWeight:'700', color:av.color, letterSpacing:'0.07em' }}>
                                                                                ✨🧠 AI SYNTHESIS ({synth.runCountAtSynthesis} sources)
                                                                            </span>
                                                                            <span style={{ padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', backgroundColor:av.color, color:'#fff' }}>
                                                                                {av.icon} {synth.finalVerdict?.replace('_',' ')} · {synth.finalOpportunityScore}/100
                                                                            </span>
                                                                            <span style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8' }}>
                                                                                {synth.agreementLevel} agreement
                                                                            </span>
                                                                        </div>
                                                                        <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55, marginBottom:'8px' }}>
                                                                            {synth.synthesizedThesis}
                                                                        </div>
                                                                        {synth.consensusSummary && (
                                                                            <div style={{ fontSize:'12px', color:'#475569', lineHeight:1.5, marginBottom:'6px' }}>
                                                                                <strong>Agree on:</strong> {synth.consensusSummary}
                                                                            </div>
                                                                        )}
                                                                        {synth.disagreements && (
                                                                            <div style={{ fontSize:'12px', color:'#b45309', lineHeight:1.5 }}>
                                                                                <strong>Diverge on:</strong> {synth.disagreements}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}

                                                            {/* Consensus stat strip — only when 2+ runs */}
                                                            {c && c.runCount >= 2 && (
                                                                <div style={{ display:'flex', gap:'14px', alignItems:'center', padding:'8px 12px', backgroundColor:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0', flexWrap:'wrap' }}>
                                                                    <span style={{ fontSize:'11px', color:'#64748b' }}>
                                                                        <strong style={{ color:'#1a1a1a' }}>{c.runCount}</strong> AI runs
                                                                    </span>
                                                                    <span style={{ fontSize:'11px', color:'#64748b' }}>
                                                                        Mean score <strong style={{ color:'#1a1a1a' }}>{c.meanScore}</strong>
                                                                    </span>
                                                                    <span style={{ fontSize:'11px', color:'#64748b' }}>
                                                                        Mode verdict <strong style={{ color:'#1a1a1a' }}>{c.modeVerdict?.replace('_',' ')}</strong>
                                                                    </span>
                                                                    <span style={{ fontSize:'11px', color:'#64748b' }}>
                                                                        Agreement <strong style={{ color: c.agreement >= 70 ? '#10b981' : c.agreement >= 40 ? '#f59e0b' : '#ef4444' }}>{c.agreement}%</strong>
                                                                    </span>
                                                                    {!synth && (
                                                                        <button onClick={() => openSynthesisPrompt(r.ticker)} style={{
                                                                            marginLeft:'auto', padding:'5px 12px', borderRadius:'20px',
                                                                            fontSize:'11px', fontWeight:'800', cursor:'pointer',
                                                                            border:'1px solid rgba(124,58,237,0.4)',
                                                                            background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'#fff',
                                                                        }}>
                                                                            ✨ Synthesize with AI
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Individual run chips */}
                                                            {runs.length > 0 && (
                                                                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                                                    {runs.map((run, idx) => {
                                                                        const av = AI_VERDICT_CONFIG[run.verdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                                        return (
                                                                            <div key={idx} style={{ padding:'9px 11px', backgroundColor: av.bg, borderRadius:'8px', border:`1px solid ${av.border}` }}>
                                                                                <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'4px', flexWrap:'wrap' }}>
                                                                                    <span style={{ fontSize:'10px', fontWeight:'800', color:'#64748b', backgroundColor:'#fff', padding:'1px 7px', borderRadius:'10px', border:'1px solid #e2e8f0' }}>
                                                                                        {run.source || 'AI'}
                                                                                    </span>
                                                                                    <span style={{ fontSize:'11px', fontWeight:'800', color:av.color }}>
                                                                                        {av.icon} {run.verdict?.replace('_',' ')} · {run.opportunityScore}/100
                                                                                    </span>
                                                                                    <button onClick={() => removeAiRun(r.ticker, idx)} title="Remove this run" style={{
                                                                                        marginLeft:'auto', background:'none', border:'none', cursor:'pointer',
                                                                                        color:'#94a3b8', fontSize:'13px', fontWeight:'900', lineHeight:1, padding:0,
                                                                                    }}>×</button>
                                                                                </div>
                                                                                <div style={{ fontSize:'12px', color:'#333', lineHeight:1.5 }}>{run.thesis}</div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            <button
                                                                onClick={() => openIndividualAIPrompt(r)}
                                                                style={{
                                                                    padding:'10px', borderRadius:'9px',
                                                                    background: runs.length > 0 ? '#fff' : 'linear-gradient(135deg,#7c3aed,#db2777)',
                                                                    color: runs.length > 0 ? '#7c3aed' : '#fff',
                                                                    border: runs.length > 0 ? '1.5px solid #7c3aed' : 'none',
                                                                    fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', width:'100%',
                                                                }}
                                                            >
                                                                {runs.length > 0 ? `🧠 Add Another AI's Take (${runs.length} so far)` : '🧠 Ask External AI for Opportunity Analysis'}
                                                            </button>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Metrics grid */}
                                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:'8px' }}>
                                                    {[
                                                        { label:'ADX Now',      value: r.adxNow?.toFixed(1),   color: r.adxNow >= 25 ? '#10b981' : r.adxNow >= 20 ? '#f59e0b' : '#94a3b8', sub: r.adxNow >= 25 ? 'Trending' : r.adxNow >= 20 ? 'Building' : 'Ranging' },
                                                        { label:'ADX 20d Ago',  value: r.adx20Ago?.toFixed(1) || '—', color:'#94a3b8', sub:'was' },
                                                        { label:'+DI / -DI',    value: `${r.plusDI?.toFixed(0)} / ${r.minusDI?.toFixed(0)}`, color: r.plusDI > r.minusDI ? '#10b981' : '#ef4444', sub: r.plusDI > r.minusDI ? 'Bulls ▲' : 'Bears ▼' },
                                                        { label:'ROC 5d',       value: r.roc5  != null ? `${r.roc5  >= 0 ? '+' : ''}${r.roc5}%`  : '—', color:(r.roc5||0)  >= 0 ? '#10b981':'#ef4444', sub:'' },
                                                        { label:'ROC 20d',      value: r.roc20 != null ? `${r.roc20 >= 0 ? '+' : ''}${r.roc20}%` : '—', color:(r.roc20||0) >= 0 ? '#10b981':'#ef4444', sub:'' },
                                                        { label:'Acceleration', value: r.acceleration != null ? `${r.acceleration >= 0 ? '+' : ''}${r.acceleration?.toFixed(2)}` : '—', color:(r.acceleration||0) > 0 ? '#10b981':'#ef4444', sub:(r.acceleration||0) > 0 ? '⚡ Speeding up':'🐢 Slowing' },
                                                        { label:'Vol Ratio',    value: r.volRatio != null ? `${r.volRatio}×` : '—', color:(r.volRatio||0) >= 1.3 ? '#10b981':'#94a3b8', sub:'5d / 20d avg' },
                                                        { label:'From 52W High',value: r.pctFromHigh != null ? `${r.pctFromHigh}%` : '—', color:(r.pctFromHigh||0) >= -5 ? '#10b981':'#94a3b8', sub:'' },
                                                        { label:'Mkt Cap',      value: fmtCap(r.marketCap), color:'#3b82f6', sub: r.sector },
                                                    ].map((item, ii) => (
                                                        <div key={ii} style={{
                                                            padding:'8px 10px', backgroundColor:'#fff',
                                                            borderRadius:'8px', border:'1px solid #e2e8f0',
                                                            borderLeft:`2px solid ${item.color}`,
                                                        }}>
                                                            <div style={{ fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'3px' }}>{item.label}</div>
                                                            <div style={{ fontSize:'14px', fontWeight:'800', color:item.color }}>{item.value}</div>
                                                            {item.sub && <div style={{ fontSize:'9px', color:'#94a3b8', marginTop:'1px' }}>{item.sub}</div>}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Earnings */}
                                                {r.lastEarningsDate && (
                                                    <div style={{
                                                        display:'flex', gap:'8px', alignItems:'center',
                                                        padding:'8px 12px', borderRadius:'8px', fontSize:'12px',
                                                        backgroundColor: r.earningsBeat === true ? 'rgba(16,185,129,0.08)' : r.earningsBeat === false ? 'rgba(239,68,68,0.08)' : '#f8fafc',
                                                        border:`1px solid ${r.earningsBeat === true ? '#bbf7d0' : r.earningsBeat === false ? '#fecaca' : '#e2e8f0'}`,
                                                        flexWrap:'wrap',
                                                    }}>
                                                        <span style={{ fontSize:'14px' }}>💰</span>
                                                        <span style={{ color:'#64748b' }}>
                                                            Last earnings: <strong>{r.lastEarningsDate}</strong>
                                                            {r.daysSinceEarnings != null && ` (${r.daysSinceEarnings}d ago)`}
                                                        </span>
                                                        {r.earningsBeat === true  && <span style={{ color:'#10b981', fontWeight:'700' }}>✓ Beat</span>}
                                                        {r.earningsBeat === false && <span style={{ color:'#ef4444', fontWeight:'700' }}>✗ Miss</span>}
                                                        {r.earningsNearby && (
                                                            <span style={{ marginLeft:'auto', fontSize:'10px', fontWeight:'700', color:'#f59e0b', backgroundColor:'#fffbeb', padding:'1px 7px', borderRadius:'10px', border:'1px solid #fde68a' }}>
                                                                Recent
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                                                    {!showAllCharts && (
                                                        <button
                                                            onClick={() => setChartTicker(chartTicker === r.ticker ? null : r.ticker)}
                                                            style={{
                                                                flex:1, padding:'9px', borderRadius:'9px',
                                                                background: chartTicker === r.ticker
                                                                    ? '#0f172a'
                                                                    : 'linear-gradient(135deg,#0f172a,#1e3a5f)',
                                                                color:'#fff', border:`1px solid ${chartTicker === r.ticker ? '#3b82f6' : 'transparent'}`,
                                                                fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                                                            }}
                                                        >
                                                            {chartTicker === r.ticker ? '📊 Hide Chart' : '📊 Show Chart'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { onSelectTicker && onSelectTicker(r.ticker); onClose(); }}
                                                        style={{
                                                            flex:1, padding:'9px', borderRadius:'9px',
                                                            background:'linear-gradient(135deg,#1e3a5f,#2563eb)',
                                                            color:'#fff', border:'none',
                                                            fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                            display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                                                        }}
                                                    >→ Open in Screener</button>
                                                </div>

                                            