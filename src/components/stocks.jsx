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

function ScannerChart({ ticker, interval, onIntervalChange, onClose, mountDelay = 0, hideClose = false }) {
    const BACKEND      = 'https://backend-production-c0ab.up.railway.app';
    const containerRef = React.useRef(null);
    const chartRef     = React.useRef(null);
    const [chartLoading, setChartLoading] = React.useState(true);
    const [chartError,   setChartError]   = React.useState(null);
    const [chartReady,   setChartReady]   = React.useState(!!window.LightweightCharts);


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
                chartRef.current.applyOptions({ width: container.clientWidth });
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
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #1e293b',
            marginTop: '10px',
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

                
            </div>

            {/* Chart area */}
            <div style={{ position: 'relative', height: '300px' }}>
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

                <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
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
                body:    JSON.stringify({ limit: 1500, horizons: STABILITY_HORIZONS }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            const shownTickers = new Set(filtered.map(r => r.ticker));
            const relevantRows = (json.rows || []).filter(r => shownTickers.has(r.ticker));
            setStabilityData(computeStabilityByAsset(relevantRows, STABILITY_HORIZONS, 'ticker'));
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

                                                {/* Inline chart */}
                                                {(chartTicker === r.ticker || showAllCharts) && (
                                                    <ScannerChart
                                                        ticker={r.ticker}
                                                        interval={chartInterval}
                                                        onIntervalChange={(iv) => setChartInterval(iv)}
                                                        onClose={() => setChartTicker(null)}
                                                        mountDelay={showAllCharts ? rowIdx * 400 : 0}
                                                        hideClose={showAllCharts}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* No results after filter */}
                    {!loading && results && filtered.length === 0 && (
                        <div style={{ padding:'40px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>
                            <div style={{ fontSize:'32px', marginBottom:'10px' }}>🔭</div>
                            No stocks matched your filters. Try loosening the signal or direction filter.
                        </div>
                    )}
                </div>
            </div>

            
            <style>{`
                @keyframes modalSlideUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin          { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                @keyframes sabrnaTyping  { 0%,60%,100% { transform:translateY(0); opacity:0.4; } 30% { transform:translateY(-5px); opacity:1; } }
            `}</style>
            
        </div>

        {/* AI Prompt Modal */}
            {showAiPromptModal && (() => {
                const mode = aiPromptScope?.mode;
                const promptText = mode === 'synthesis'
                    ? buildSynthesisPrompt(aiPromptScope.ticker)
                    : mode === 'bulkSynthesis'
                        ? buildBulkSynthesisPrompt(aiPromptScope.tickers || [])
                        : buildScannerAIPrompt(aiPromptScope?.stocks || []);
                const scopeLabel = mode === 'synthesis'
                    ? `Synthesis for ${aiPromptScope.ticker}`
                    : mode === 'bulkSynthesis'
                        ? `Bulk synthesis — ${aiPromptScope.tickers?.length || 0} stocks`
                        : mode === 'bulk'
                            ? `${filtered.length} stocks shown`
                            : aiPromptScope?.ticker;
                return (
                    <div onClick={() => setShowAiPromptModal(false)} style={{
                        position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        zIndex:10030, padding:'20px', backdropFilter:'blur(3px)',
                    }}>
                        <div onClick={e => e.stopPropagation()} style={{
                            width:'min(680px,100%)', maxHeight:'85vh', borderRadius:'16px', overflow:'hidden',
                            display:'flex', flexDirection:'column', backgroundColor:'#fff',
                            boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:"'Segoe UI', system-ui, sans-serif",
                        }}>
                            <div style={{ padding:'20px 24px 16px', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', flexShrink:0 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                                    <div>
                                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                                            <span style={{ fontSize:'18px' }}>🧠</span>
                                            <span style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>AI Opportunity Prompt — {scopeLabel}</span>
                                        </div>
                                        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>
                                            Copy this prompt → paste into any AI below → copy their JSON response → hit "Paste Response"
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAiPromptModal(false)} style={{
                                        background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%',
                                        width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer',
                                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                                    }}>×</button>
                                </div>
                            </div>
                            <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
                                <div style={{
                                    backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px',
                                    padding:'16px', fontSize:'13px', lineHeight:1.7, color:'#333',
                                    fontFamily:'monospace', whiteSpace:'pre-wrap', wordBreak:'break-word',
                                }}>
                                    {promptText}
                                </div>
                                <div style={{
                                    marginTop:'14px', padding:'10px 14px', backgroundColor:'rgba(32,178,170,0.07)',
                                    border:'1px solid rgba(32,178,170,0.25)', borderRadius:'9px',
                                    display:'flex', gap:'10px', alignItems:'flex-start',
                                }}>
                                    <span style={{ fontSize:'16px', flexShrink:0 }}>💡</span>
                                    <div style={{ fontSize:'12px', color:'#0f766e', lineHeight:1.55 }}>
                                        <strong>Tip:</strong> Perplexity is the best pick here — it searches the web live and can pull current sector/ETF performance automatically.
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding:'14px 24px', borderTop:'1px solid #e2e8f0', display:'flex', flexDirection:'column', gap:'12px', flexShrink:0, backgroundColor:'#f8fafc' }}>
                                <div>
                                    <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.08em', marginBottom:'8px' }}>
                                        OPEN DIRECTLY IN (prompt auto-filled)
                                    </div>
                                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                                        {[
                                            { name:'Perplexity', icon:'🔍', color:'#20b2aa', bg:'rgba(32,178,170,0.08)', border:'rgba(32,178,170,0.35)', getUrl:p=>`https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
                                            { name:'ChatGPT',    icon:'✦',  color:'#10a37f', bg:'rgba(16,163,127,0.08)', border:'rgba(16,163,127,0.35)', getUrl:p=>`https://chatgpt.com/?q=${encodeURIComponent(p)}` },
                                            { name:'Gemini',     icon:'✦',  color:'#4285f4', bg:'rgba(66,133,244,0.08)', border:'rgba(66,133,244,0.35)', getUrl:p=>`https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
                                            { name:'Claude',     icon:'◆',  color:'#cc785c', bg:'rgba(204,120,92,0.08)', border:'rgba(204,120,92,0.35)', getUrl:p=>`https://claude.ai/new?q=${encodeURIComponent(p)}` },
                                            { name:'DeepSeek',   icon:'🐋', color:'#4d6bfe', bg:'rgba(77,107,254,0.08)', border:'rgba(77,107,254,0.35)', getUrl:()=>`https://chat.deepseek.com/` },
                                            { name:'Qwen',       icon:'✦',  color:'#8b5cf6', bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.35)', getUrl:()=>`https://chat.qwen.ai/` },
                                        ].map(({ name, icon, color, bg, border, getUrl }) => (
                                                <button key={name} onClick={() => { setAiLastOpenedSource(name); window.open(getUrl(promptText), '_blank'); }} style={{
                                                padding:'8px 14px', borderRadius:'9px', border:`1.5px solid ${border}`,
                                                backgroundColor:bg, color, fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap',
                                            }}>
                                                <span style={{ fontSize:'15px' }}>{icon}</span>{name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ height:'1px', backgroundColor:'#e2e8f0' }} />
                                <div style={{ display:'flex', gap:'10px' }}>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(promptText); setAiCopied(true); setTimeout(() => setAiCopied(false), 2000); }}
                                        style={{
                                            flex:1, padding:'10px',
                                            background: aiCopied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#4c1d95,#7c3aed)',
                                            border:'none', borderRadius:'9px', color:'#fff', fontWeight:'700', fontSize:'14px',
                                            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                                        }}
                                    >
                                        {aiCopied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Prompt</>}
                                    </button>
                                    <button
                                        onClick={() => { setShowAiPromptModal(false); setShowAiPasteModal(true); }}
                                        style={{
                                            flex:1, padding:'10px', backgroundColor:'#fff', border:'2px solid #7c3aed',
                                            borderRadius:'9px', color:'#7c3aed', fontWeight:'700', fontSize:'14px', cursor:'pointer',
                                            display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                                        }}
                                    >
                                        <span>📥</span> Paste Response
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* AI Paste Response Modal */}
            {showAiPasteModal && (
                <div onClick={() => { setShowAiPasteModal(false); setAiPasteError(null); }} style={{
                    position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    zIndex:10030, padding:'20px', backdropFilter:'blur(3px)',
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        width:'min(640px,100%)', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff',
                        boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:"'Segoe UI', system-ui, sans-serif",
                        display:'flex', flexDirection:'column',
                    }}>
                        <div style={{ padding:'18px 22px 14px', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', flexShrink:0 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                                <div>
                                    <div style={{ fontSize:'16px', fontWeight:'800', color:'#fff', marginBottom:'4px' }}>📥 Paste AI Response</div>
                                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)' }}>
                                        Paste the raw JSON array the AI returned — one object per stock.
                                    </div>
                                </div>
                                <button onClick={() => { setShowAiPasteModal(false); setAiPasteError(null); }} style={{
                                    background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%',
                                    width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                }}>×</button>
                            </div>
                        </div>
                        <div style={{ padding:'20px 22px 0' }}>
                            {(aiPromptScope?.mode !== 'synthesis' && aiPromptScope?.mode !== 'bulkSynthesis') && (
                                <div style={{ marginBottom:'10px' }}>
                                    <label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b', display:'block', marginBottom:'4px' }}>
                                        Which AI is this from?
                                    </label>
                                    <input
                                        type="text"
                                        list="ai-source-options"
                                        value={aiPasteSource || aiLastOpenedSource}
                                        onChange={e => setAiPasteSource(e.target.value)}
                                        placeholder="Perplexity, ChatGPT, Gemini, Claude, Deepseek, Qwen..."
                                        style={{ width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', boxSizing:'border-box' }}
                                    />
                                    <datalist id="ai-source-options">
                                        <option value="Perplexity" /><option value="ChatGPT" /><option value="Gemini" /><option value="Claude" /><option value="DeepSeek" /><option value="Qwen" />
                                    </datalist>
                                </div>
                            )}
                            <textarea
                                autoFocus
                                value={aiPasteText}
                                onChange={e => { setAiPasteText(e.target.value); setAiPasteError(null); }}
                                placeholder={
                                    aiPromptScope?.mode === 'synthesis'
                                        ? `Paste the JSON object here. Should start with {\n  "finalVerdict": "OPPORTUNITY", ...\n}`
                                        : aiPromptScope?.mode === 'bulkSynthesis'
                                            ? `Paste the JSON array here. Should start with [\n  { "ticker": "AAPL", "finalVerdict": "OPPORTUNITY", ... }\n]`
                                            : `Paste the JSON array here. Should start with [\n  { "ticker": "AAPL", "verdict": "OPPORTUNITY", ... }\n]`
                                }
                                style={{
                                    width:'100%', height:'260px', padding:'14px', borderRadius:'10px',
                                    border:`2px solid ${aiPasteError ? '#ef4444' : '#e2e8f0'}`,
                                    fontSize:'13px', fontFamily:'monospace', lineHeight:1.6, resize:'vertical',
                                    outline:'none', boxSizing:'border-box', color:'#1a1a1a',
                                    backgroundColor: aiPasteError ? '#fef2f2' : '#f8fafc',
                                }}
                            />
                            {aiPasteError && (
                                <div style={{ marginTop:'10px', padding:'10px 14px', backgroundColor:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', fontSize:'13px', color:'#b91c1c', lineHeight:1.5 }}>
                                    ⚠️ {aiPasteError}
                                </div>
                            )}
                        </div>
                        <div style={{ padding:'16px 22px', display:'flex', gap:'10px' }}>
                            <button
                                onClick={handlePasteAIResponse}
                                disabled={!aiPasteText.trim()}
                                style={{
                                    flex:1, padding:'11px',
                                    background: !aiPasteText.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#4c1d95)',
                                    border:'none', borderRadius:'9px', color:'#fff', fontWeight:'700', fontSize:'14px',
                                    cursor: !aiPasteText.trim() ? 'not-allowed' : 'pointer',
                                }}
                            >
                                ✓ Parse & Save
                            </button>
                            <button
                                onClick={() => { setShowAiPasteModal(false); setShowAiPromptModal(true); setAiPasteError(null); }}
                                style={{
                                    padding:'11px 16px', backgroundColor:'#fff', border:'1px solid #e2e8f0',
                                    borderRadius:'9px', color:'#64748b', fontWeight:'600', fontSize:'14px', cursor:'pointer',
                                }}
                            >
                                ← Back to prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stability Check Modal */}
        {showStabilityModal && stabilityData && (() => {
            const list = Object.values(stabilityData).sort((a, b) => (b.combined.stabilityScore ?? -1) - (a.combined.stabilityScore ?? -1));
            const HORIZON_LABELS = { 1:'1D', 3:'3D', 5:'5D', 10:'10D', 20:'20D' };
            return (
                <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:10040, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'16px', backdropFilter:'blur(4px)', overflowY:'auto' }}
                    onClick={() => setShowStabilityModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        width:'100%', maxWidth:'760px', borderRadius:'18px', overflow:'hidden', backgroundColor:'#fff',
                        boxShadow:'0 24px 80px rgba(0,0,0,0.3)', fontFamily:"'Segoe UI', system-ui, sans-serif",
                        marginTop:'8px', marginBottom:'24px',
                    }}>
                        <div style={{ padding:'18px 20px', background:'linear-gradient(135deg,#0f172a,#0891b2)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                            <div>
                                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                                    <Shield size={18} color="#fff" />
                                    <span style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>Stability Ranking</span>
                                </div>
                                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>
                                    Based on saved backtest history — {list.length} of the currently-shown stocks have prior data
                                </div>
                            </div>
                            <button onClick={() => setShowStabilityModal(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'30px', height:'30px', color:'#fff', fontSize:'16px', cursor:'pointer', flexShrink:0 }}>×</button>
                        </div>
                        <div style={{ padding:'16px 20px', maxHeight:'70vh', overflowY:'auto' }}>
                            {list.length === 0 ? (
                                <div style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>
                                    <Shield size={32} color="#cbd5e1" style={{ marginBottom:'10px' }} />
                                    <div style={{ fontSize:'13px' }}>None of the currently-shown stocks have saved backtest history yet. Save a scanner snapshot across a few different days to start building stability data.</div>
                                </div>
                            ) : (
                                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                                    {list.map((a, i) => {
                                        const info = stabilityLabel(a.combined.winRate);
                                        return (
                                            <div key={a.key}
                                                onClick={() => { setShowStabilityModal(false); onSelectTicker && onSelectTicker(a.key); onClose(); }}
                                                style={{
                                                    display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', borderRadius:'10px',
                                                    border:`1px solid ${info.color}30`, backgroundColor: i === 0 ? `${info.color}0d` : '#fff', cursor:'pointer',
                                                }}>
                                                {i === 0 && <Award size={16} color="#f59e0b" style={{ flexShrink:0 }} />}
                                                <span style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a', minWidth:'55px' }}>{a.key}</span>
                                                <span style={{ fontSize:'11px', color:'#94a3b8' }}>{a.occurrenceCount} occ.</span>
                                                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
                                                    <OccurrenceDots rows={a.rows} horizon={5} />
                                                    <div style={{ textAlign:'right', minWidth:'70px' }}>
                                                        <div style={{ fontSize:'15px', fontWeight:'900', color: info.color }}>{a.combined.stabilityScore != null ? `${a.combined.stabilityScore}%` : '—'}</div>
                                                        <div style={{ fontSize:'9px', fontWeight:'700', color: info.color }}>{info.label}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        })()}
                </>

    );
}

function BacktestTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div style={{ backgroundColor:'#0f172a', color:'#fff', padding:'8px 12px', borderRadius:'8px', fontSize:'12px', lineHeight:1.6 }}>
            <div style={{ fontWeight:'800' }}>{d.label}</div>
            <div>Avg return: <strong style={{ color: d.value >= 0 ? '#10b981' : '#ef4444' }}>{d.value >= 0 ? '+' : ''}{d.value}%</strong></div>
            {d.winRate != null && <div>Win rate: {d.winRate}%</div>}
            <div>Sample size: {d.count}</div>
        </div>
    );
}

function BacktestPlainEnglish({ btData }) {
    if (!btData || btData.totalSnapshots === 0) return null;
    const REF_HORIZON = '5';
    const MIN_SAMPLE  = 3;
    const insights = [];

    const overallCell = btData.aggregate?.ALL?.[REF_HORIZON];
    if (overallCell && overallCell.count > 0) {
        insights.push({
            Icon: Target, positive: overallCell.avgDirectionAdjustedReturn >= 0,
            text: `Across ${overallCell.count} saved signals, calling the direction right and holding 5 trading days worked out ${overallCell.winRate}% of the time — averaging ${overallCell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${overallCell.avgDirectionAdjustedReturn}% per trade.`,
        });
    }

    const signalEntries = Object.entries(btData.bySignal || {})
        .map(([key, hmap]) => ({ key, cell: hmap[REF_HORIZON] }))
        .filter(e => e.cell && e.cell.count >= MIN_SAMPLE);
    if (signalEntries.length > 0) {
        const sorted = [...signalEntries].sort((a, b) => b.cell.avgDirectionAdjustedReturn - a.cell.avgDirectionAdjustedReturn);
        const best  = sorted[0];
        const worst = sorted[sorted.length - 1];
        insights.push({
            Icon: TrendingUp, positive: true,
            text: `Strongest signal so far: ${best.key.replace(/_/g, ' ')} — right ${best.cell.winRate}% of the time over 5 days, averaging ${best.cell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${best.cell.avgDirectionAdjustedReturn}% (${best.cell.count} signals).`,
        });
        if (worst.key !== best.key) {
            insights.push({
                Icon: TrendingDown, positive: false,
                text: `Weakest signal: ${worst.key.replace(/_/g, ' ')} — right just ${worst.cell.winRate}% of the time, averaging ${worst.cell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${worst.cell.avgDirectionAdjustedReturn}% (${worst.cell.count} signals).`,
            });
        }
    }

    const strongCell = btData.byAiVerdict?.STRONG_OPPORTUNITY?.[REF_HORIZON];
    const avoidCell  = btData.byAiVerdict?.AVOID?.[REF_HORIZON] || btData.byAiVerdict?.CAUTION?.[REF_HORIZON];
    if (strongCell && strongCell.count >= MIN_SAMPLE && avoidCell && avoidCell.count >= MIN_SAMPLE) {
        const diff = Math.round((strongCell.avgDirectionAdjustedReturn - avoidCell.avgDirectionAdjustedReturn) * 10) / 10;
        insights.push({
            Icon: Brain, positive: diff >= 0,
            text: `Stocks the AI flagged as a strong opportunity beat the ones it flagged caution/avoid by ${diff >= 0 ? '+' : ''}${diff}pp on average over 5 days — ${diff >= 0 ? "the AI's opportunity calls appear to be adding real signal." : "worth a closer look — the cautious calls actually held up better here."}`,
        });
    }

    if (btData.totalSnapshots < 15) {
        insights.push({
            Icon: AlertTriangle, positive: null,
            text: `Only ${btData.totalSnapshots} snapshots saved so far — treat these numbers as early signal, not a verdict. More daily saves will make this meaningful.`,
        });
    }

    if (insights.length === 0) return null;

    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px' }}>
            {insights.map((ins, i) => {
                const color = ins.positive === true ? '#10b981' : ins.positive === false ? '#ef4444' : '#f59e0b';
                const bg    = ins.positive === true ? '#f0fdf4' : ins.positive === false ? '#fef2f2' : '#fffbeb';
                const Icon  = ins.Icon;
                return (
                    <div key={i} style={{
                        display:'flex', gap:'10px', alignItems:'flex-start',
                        padding:'10px 14px', backgroundColor:bg, borderRadius:'10px', border:`1px solid ${color}30`,
                    }}>
                        <Icon size={16} color={color} style={{ flexShrink:0, marginTop:'1px' }} />
                        <div style={{ fontSize:'12.5px', color:'#333', lineHeight:1.55 }}>{ins.text}</div>
                    </div>
                );
            })}
        </div>
    );
}

function BacktestReturnByHorizonChart({ aggregate, horizons }) {
    const HORIZON_LABELS = { 1:'1 Day', 3:'3 Days', 5:'5 Days', 10:'10 Days', 20:'20 Days' };
    const data = horizons.map(h => {
        const cell = aggregate?.ALL?.[String(h)];
        return {
            label:   HORIZON_LABELS[h] || `${h}D`,
            value:   cell?.avgDirectionAdjustedReturn ?? 0,
            winRate: cell?.winRate ?? null,
            count:   cell?.count ?? 0,
            hasData: !!(cell && cell.count > 0),
        };
    }).filter(d => d.hasData);

    if (data.length === 0) return null;

    return (
        <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                <BarChart3 size={15} color="#1a1a1a" />
                <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>Average Return by Holding Period</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<BacktestTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((d, i) => <Cell key={i} fill={d.value >= 0 ? '#10b981' : '#ef4444'} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function BacktestSignalComparisonChart({ bySignal, horizon, onHorizonChange, horizons }) {
    const SIG_LABELS = {
        RANGE_BREAKOUT_BULL: 'Range Breakout ▲', RANGE_BREAKOUT_BEAR: 'Range Breakout ▼',
        ACCELERATING_BULL:   'Accelerating ▲',    ACCELERATING_BEAR:   'Accelerating ▼',
        BREAKOUT:            'Breakout',          TREND_BUILDING:      'Trend Building', WATCH: 'Watch',
    };
    const MIN_SAMPLE = 3;
    const data = Object.entries(bySignal || {})
        .map(([key, hmap]) => {
            const cell = hmap[String(horizon)];
            return { label: SIG_LABELS[key] || key.replace(/_/g, ' '), value: cell?.avgDirectionAdjustedReturn ?? null, winRate: cell?.winRate ?? null, count: cell?.count ?? 0 };
        })
        .filter(d => d.value !== null && d.count >= MIN_SAMPLE)
        .sort((a, b) => b.value - a.value);

    if (data.length === 0) return null;

    return (
        <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <Telescope size={15} color="#1a1a1a" />
                    <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>Signal Performance</span>
                </div>
                <div style={{ display:'flex', gap:'4px' }}>
                    {horizons.map(h => (
                        <button key={h} onClick={() => onHorizonChange(String(h))} style={{
                            padding:'2px 9px', borderRadius:'12px', fontSize:'10px', fontWeight:'700', cursor:'pointer',
                            border:`1px solid ${String(horizon) === String(h) ? '#3b82f6' : '#e2e8f0'}`,
                            backgroundColor: String(horizon) === String(h) ? '#eff6ff' : '#fff',
                            color: String(horizon) === String(h) ? '#2563eb' : '#94a3b8',
                        }}>{h}D</button>
                    ))}
                </div>
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>min. 3 signals per type shown</span>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(160, data.length * 34)}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#334155' }} width={140} />
                    <Tooltip content={<BacktestTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {data.map((d, i) => <Cell key={i} fill={d.value >= 0 ? '#10b981' : '#ef4444'} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function BacktestGroupComparisonChart({ title, IconComp, data, horizon, onHorizonChange, horizons, labelize }) {
    const MIN_SAMPLE = 3;
    const chartData = Object.entries(data || {})
        .map(([key, hmap]) => {
            const cell = hmap[String(horizon)];
            return { label: labelize ? labelize(key) : key.replace(/_/g, ' '), value: cell?.avgDirectionAdjustedReturn ?? null, winRate: cell?.winRate ?? null, count: cell?.count ?? 0 };
        })
        .filter(d => d.value !== null && d.count >= MIN_SAMPLE)
        .sort((a, b) => b.value - a.value);

    if (chartData.length === 0) return null;

    return (
        <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <IconComp size={15} color="#1a1a1a" />
                    <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>{title}</span>
                </div>
                <div style={{ display:'flex', gap:'4px' }}>
                    {horizons.map(h => (
                        <button key={h} onClick={() => onHorizonChange(String(h))} style={{
                            padding:'2px 9px', borderRadius:'12px', fontSize:'10px', fontWeight:'700', cursor:'pointer',
                            border:`1px solid ${String(horizon) === String(h) ? '#3b82f6' : '#e2e8f0'}`,
                            backgroundColor: String(horizon) === String(h) ? '#eff6ff' : '#fff',
                            color: String(horizon) === String(h) ? '#2563eb' : '#94a3b8',
                        }}>{h}D</button>
                    ))}
                </div>
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>min. 3 per group shown</span>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 34)}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#334155' }} width={140} />
                    <Tooltip content={<BacktestTooltip />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {chartData.map((d, i) => <Cell key={i} fill={d.value >= 0 ? '#10b981' : '#ef4444'} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function GlobalPicksPlainEnglish({ gpData }) {
    if (!gpData || gpData.totalPicks === 0) return null;
    const REF_HORIZON = '5';
    const MIN_SAMPLE  = 3;
    const insights = [];

    const overallCell = gpData.aggregate?.ALL?.[REF_HORIZON];
    if (overallCell && overallCell.count > 0) {
        insights.push({
            Icon: Target, positive: overallCell.avgDirectionAdjustedReturn >= 0,
            text: `Across ${overallCell.count} saved global picks, the call was right ${overallCell.winRate}% of the time over 5 trading days — averaging ${overallCell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${overallCell.avgDirectionAdjustedReturn}% per pick.`,
        });
    }

    const recEntries = Object.entries(gpData.byRec || {})
        .map(([key, hmap]) => ({ key, cell: hmap[REF_HORIZON] }))
        .filter(e => e.cell && e.cell.count >= MIN_SAMPLE);
    if (recEntries.length > 0) {
        const sorted = [...recEntries].sort((a, b) => b.cell.avgDirectionAdjustedReturn - a.cell.avgDirectionAdjustedReturn);
        const best = sorted[0];
        insights.push({
            Icon: TrendingUp, positive: true,
            text: `Best-performing rec label: "${best.key}" — right ${best.cell.winRate}% of the time over 5 days, averaging ${best.cell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${best.cell.avgDirectionAdjustedReturn}% (${best.cell.count} picks).`,
        });
    }

    const topCell = gpData.byTopPick?.['Top Pick']?.[REF_HORIZON];
    const regCell = gpData.byTopPick?.['Regular']?.[REF_HORIZON];
    if (topCell && topCell.count >= MIN_SAMPLE && regCell && regCell.count >= MIN_SAMPLE) {
        const diff = Math.round((topCell.avgDirectionAdjustedReturn - regCell.avgDirectionAdjustedReturn) * 10) / 10;
        insights.push({
            Icon: Brain, positive: diff >= 0,
            text: `Picks flagged as "Top Pick" beat regular picks by ${diff >= 0 ? '+' : ''}${diff}pp on average over 5 days — ${diff >= 0 ? 'the top-pick flag appears to be adding real signal.' : "worth a look — regular picks actually held up better here."}`,
        });
    }

    const convEntries = Object.entries(gpData.byConvictionBucket || {})
        .filter(([k]) => k !== 'Unknown')
        .map(([key, hmap]) => ({ key, cell: hmap[REF_HORIZON] }))
        .filter(e => e.cell && e.cell.count >= MIN_SAMPLE);
    if (convEntries.length >= 2) {
        const rank = { '8-10': 3, '6-7': 2, '4-5': 1, '1-3': 0 };
        const sorted = [...convEntries].sort((a, b) => rank[b.key] - rank[a.key]);
        const high = sorted[0], low = sorted[sorted.length - 1];
        if (high && low && high.key !== low.key) {
            insights.push({
                Icon: Gauge, positive: high.cell.avgDirectionAdjustedReturn >= low.cell.avgDirectionAdjustedReturn,
                text: `High-conviction picks (${high.key}) averaged ${high.cell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${high.cell.avgDirectionAdjustedReturn}% vs ${low.cell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${low.cell.avgDirectionAdjustedReturn}% for low-conviction (${low.key}) — ${high.cell.avgDirectionAdjustedReturn >= low.cell.avgDirectionAdjustedReturn ? "conviction level tracks with results so far." : "conviction level isn't tracking with results yet."}`,
            });
        }
    }

    if (gpData.totalPicks < 15) {
        insights.push({
            Icon: AlertTriangle, positive: null,
            text: `Only ${gpData.totalPicks} global picks saved so far — treat these numbers as early signal, not a verdict.`,
        });
    }

    if (insights.length === 0) return null;

    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'22px' }}>
            {insights.map((ins, i) => {
                const color = ins.positive === true ? '#10b981' : ins.positive === false ? '#ef4444' : '#f59e0b';
                const bg    = ins.positive === true ? '#f0fdf4' : ins.positive === false ? '#fef2f2' : '#fffbeb';
                const Icon  = ins.Icon;
                return (
                    <div key={i} style={{
                        display:'flex', gap:'10px', alignItems:'flex-start',
                        padding:'10px 14px', backgroundColor:bg, borderRadius:'10px', border:`1px solid ${color}30`,
                    }}>
                        <Icon size={16} color={color} style={{ flexShrink:0, marginTop:'1px' }} />
                        <div style={{ fontSize:'12.5px', color:'#333', lineHeight:1.55 }}>{ins.text}</div>
                    </div>
                );
            })}
        </div>
    );
}

function GlobalPicksTopBottomPerformers({ rows, horizon }) {
    const resolved = (rows || [])
        .filter(r => !r.error && r.directionAdjustedReturns?.[horizon] != null)
        .map(r => ({ ...r, value: r.directionAdjustedReturns[horizon] }));
    if (resolved.length < 2) return null;

    const sorted = [...resolved].sort((a, b) => b.value - a.value);
    const best  = sorted[0];
    const worst = sorted[sorted.length - 1];

    const Card = ({ item, isBest }) => (
        <div style={{
            flex:1, minWidth:'220px', padding:'12px 14px', borderRadius:'10px',
            backgroundColor: isBest ? '#f0fdf4' : '#fef2f2',
            border:`1px solid ${isBest ? '#bbf7d0' : '#fecaca'}`,
        }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                {isBest ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
                <span style={{ fontSize:'10px', fontWeight:'800', color: isBest ? '#10b981' : '#ef4444', letterSpacing:'0.06em' }}>
                    {isBest ? 'BEST PERFORMER' : 'WORST PERFORMER'} · {horizon}D
                </span>
            </div>
            <div style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>
                {item.flag} {item.symbol} <span style={{ fontWeight:'500', color:'#64748b', fontSize:'12px' }}>({item.name})</span>
            </div>
            <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>
                {item.country} · {item.sector} · {item.rec} · saved {item.date}
            </div>
            <div style={{ fontSize:'20px', fontWeight:'900', color: isBest ? '#10b981' : '#ef4444', marginTop:'6px' }}>
                {item.value >= 0 ? '+' : ''}{item.value}%
            </div>
        </div>
    );

    return (
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'22px' }}>
            <Card item={best} isBest={true} />
            <Card item={worst} isBest={false} />
        </div>
    );
}

function GlobalPicksDetailTable({ rows, horizons, sortField, sortDir, onSort, onSelectTicker, onClose }) {
    if (!rows || rows.length === 0) return null;

    const sorted = [...rows].sort((a, b) => {
        let av, bv;
        if (sortField === 'date')          { av = a.date; bv = b.date; }
        else if (sortField === 'symbol')   { av = a.symbol; bv = b.symbol; }
        else if (sortField === 'country')  { av = a.country || ''; bv = b.country || ''; }
        else if (sortField === 'sector')   { av = a.sector || ''; bv = b.sector || ''; }
        else if (sortField === 'conviction') { av = a.conviction ?? -1; bv = b.conviction ?? -1; }
        else {
            av = a.directionAdjustedReturns?.[sortField]; av = av == null ? -Infinity : av;
            bv = b.directionAdjustedReturns?.[sortField]; bv = bv == null ? -Infinity : bv;
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const HORIZON_LABELS = { 1:'1D', 3:'3D', 5:'5D', 10:'10D', 20:'20D' };

    const SortHeader = ({ field, label, align = 'left' }) => (
        <th
            onClick={() => onSort(field)}
            style={{
                padding:'8px 10px', textAlign:align, fontWeight:'700', color: sortField === field ? '#7c3aed' : '#64748b',
                borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
            }}
        >
            {label} {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div style={{ marginBottom:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                <span style={{ fontSize:'14px' }}>🌍</span>
                <span style={{ fontSize:'12px', fontWeight:'800', color:'#1a1a1a' }}>Individual Picks — {rows.length} total</span>
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>click a column to sort · click a symbol to open in screener</span>
            </div>
            <div style={{ overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:'10px' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                    <thead>
                        <tr style={{ backgroundColor:'#f8fafc' }}>
                            <SortHeader field="symbol" label="Symbol" />
                            <SortHeader field="country" label="Country" />
                            <SortHeader field="sector" label="Sector" />
                            <SortHeader field="conviction" label="Conv." align="center" />
                            <SortHeader field="date" label="Saved" />
                            <th style={{ padding:'8px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Dir</th>
                            {horizons.map(h => (
                                <SortHeader key={h} field={String(h)} label={HORIZON_LABELS[h] || `${h}D`} align="center" />
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((r, i) => (
                            <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding:'7px 10px', fontWeight:'800', color:'#1a1a1a', whiteSpace:'nowrap' }}>
                                    {onSelectTicker ? (
                                        <span
                                            onClick={() => { onSelectTicker(r.symbol); onClose && onClose(); }}
                                            style={{ cursor:'pointer', color:'#2563eb', textDecoration:'underline dotted' }}
                                        >{r.flag} {r.symbol}</span>
                                    ) : <>{r.flag} {r.symbol}</>}
                                    {r.topPick && <span title="Flagged as Top Pick" style={{ marginLeft:'4px' }}>⭐</span>}
                                </td>
                                <td style={{ padding:'7px 10px', color:'#475569', whiteSpace:'nowrap' }}>{r.country}</td>
                                <td style={{ padding:'7px 10px', color:'#475569', whiteSpace:'nowrap' }}>{r.sector}</td>
                                <td style={{ padding:'7px 10px', textAlign:'center', color:'#475569' }}>{r.conviction ?? '—'}</td>
                                <td style={{ padding:'7px 10px', color:'#64748b', whiteSpace:'nowrap' }}>{r.date}</td>
                                <td style={{ padding:'7px 10px', textAlign:'center' }}>
                                    <span style={{
                                        fontSize:'10px', fontWeight:'700', padding:'1px 7px', borderRadius:'10px',
                                        backgroundColor: r.direction === 'BULLISH' ? '#f0fdf4' : r.direction === 'BEARISH' ? '#fef2f2' : '#f8fafc',
                                        color: r.direction === 'BULLISH' ? '#10b981' : r.direction === 'BEARISH' ? '#ef4444' : '#94a3b8',
                                    }}>{r.direction === 'BULLISH' ? '▲' : r.direction === 'BEARISH' ? '▼' : '→'}</span>
                                </td>
                                {horizons.map(h => {
                                    if (r.error) return <td key={h} style={{ padding:'7px 10px', textAlign:'center', color:'#cbd5e1' }} title={r.error}>err</td>;
                                    const v = r.directionAdjustedReturns?.[String(h)];
                                    if (v == null) return <td key={h} style={{ padding:'7px 10px', textAlign:'center', color:'#cbd5e1' }}>—</td>;
                                    return (
                                        <td key={h} style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color: v >= 0 ? '#10b981' : '#ef4444' }}>
                                            {v >= 0 ? '+' : ''}{v}%
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function computeAggregateFromRows(rows, horizons) {
    const cell = {};
    horizons.forEach(h => { cell[String(h)] = { count: 0, dirSum: 0, wins: 0 }; });
    (rows || []).forEach(r => {
        if (r.error) return;
        horizons.forEach(h => {
            const v = r.directionAdjustedReturns?.[String(h)];
            if (v == null) return;
            const c = cell[String(h)];
            c.count += 1; c.dirSum += v; if (v > 0) c.wins += 1;
        });
    });
    const out = { ALL: {} };
    horizons.forEach(h => {
        const c = cell[String(h)];
        out.ALL[String(h)] = c.count === 0
            ? { count: 0, avgReturn: null, avgDirectionAdjustedReturn: null, winRate: null }
            : {
                count: c.count,
                avgReturn: Math.round((c.dirSum / c.count) * 100) / 100,
                avgDirectionAdjustedReturn: Math.round((c.dirSum / c.count) * 100) / 100,
                winRate: Math.round((c.wins / c.count) * 1000) / 10,
            };
    });
    return out;
}

function normalizeRowsForPerfModal(rawRows, source) {
    return (rawRows || []).map(r => ({
        date: r.date,
        label: source === 'scanner' ? (r.signal || '').replace(/_/g, ' ') : (r.rec || ''),
        direction: r.direction,
        scoreLabel: source === 'scanner'
            ? `Score ${r.score != null ? Math.round(r.score) : '—'}`
            : `Conviction ${r.conviction ?? '—'}`,
        entryPrice: r.entryPrice,
        error: r.error,
        directionAdjustedReturns: r.directionAdjustedReturns,
        rawReturns: r.rawReturns,
    }));
}

function TickerReturnTimelineTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div style={{ backgroundColor:'#0f172a', color:'#fff', padding:'8px 12px', borderRadius:'8px', fontSize:'12px', lineHeight:1.6 }}>
            <div style={{ fontWeight:'800' }}>{d.date}</div>
            <div>{d.label}</div>
            <div>Return: <strong style={{ color: d.value >= 0 ? '#10b981' : '#ef4444' }}>{d.value >= 0 ? '+' : ''}{d.value}%</strong></div>
            {d.entryPrice != null && <div>Entry: ${d.entryPrice}</div>}
        </div>
    );
}

function TickerReturnTimelineChart({ rows, horizon }) {
    const data = (rows || [])
        .filter(r => !r.error && r.directionAdjustedReturns?.[horizon] != null)
        .map(r => ({ date: r.date, label: r.label, value: r.directionAdjustedReturns[horizon], entryPrice: r.entryPrice }))
        .sort((a, b) => a.date.localeCompare(b.date));
    if (data.length === 0) return null;
    return (
        <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                <Calendar size={15} color="#1a1a1a" />
                <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>Return Over Time — {horizon}D Horizon</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<TickerReturnTimelineTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((d, i) => <Cell key={i} fill={d.value >= 0 ? '#10b981' : '#ef4444'} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function ScannerBacktestTopBottomPerformers({ rows, horizon }) {
    const resolved = (rows || [])
        .filter(r => !r.error && r.directionAdjustedReturns?.[horizon] != null)
        .map(r => ({ ...r, value: r.directionAdjustedReturns[horizon] }));
    if (resolved.length < 2) return null;

    const sorted = [...resolved].sort((a, b) => b.value - a.value);
    const best  = sorted[0];
    const worst = sorted[sorted.length - 1];

    const Card = ({ item, isBest }) => (
        <div style={{
            flex:1, minWidth:'220px', padding:'12px 14px', borderRadius:'10px',
            backgroundColor: isBest ? '#f0fdf4' : '#fef2f2',
            border:`1px solid ${isBest ? '#bbf7d0' : '#fecaca'}`,
        }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                {isBest ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
                <span style={{ fontSize:'10px', fontWeight:'800', color: isBest ? '#10b981' : '#ef4444', letterSpacing:'0.06em' }}>
                    {isBest ? 'BEST SIGNAL' : 'WORST SIGNAL'} · {horizon}D
                </span>
            </div>
            <div style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>{item.ticker}</div>
            <div style={{ fontSize:'11px', color:'#64748b', marginTop:'2px' }}>
                {(item.signal || '').replace(/_/g,' ')} · {item.direction} · flagged {item.date}
            </div>
            <div style={{ fontSize:'20px', fontWeight:'900', color: isBest ? '#10b981' : '#ef4444', marginTop:'6px' }}>
                {item.value >= 0 ? '+' : ''}{item.value}%
            </div>
        </div>
    );

    return (
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'22px' }}>
            <Card item={best} isBest={true} />
            <Card item={worst} isBest={false} />
        </div>
    );
}

function ScannerBacktestDetailTable({ rows, horizons, onSelectAsset, onSelectTicker, onClose }) {
    const [search, setSearch] = React.useState('');
    const [sortField, setSortField] = React.useState('date');
    const [sortDir, setSortDir] = React.useState('desc');

    if (!rows || rows.length === 0) return null;

    const filtered = search.trim()
        ? rows.filter(r => r.ticker?.toUpperCase().includes(search.trim().toUpperCase()))
        : rows;

    const sorted = [...filtered].sort((a, b) => {
        let av, bv;
        if (sortField === 'date')        { av = a.date; bv = b.date; }
        else if (sortField === 'ticker') { av = a.ticker; bv = b.ticker; }
        else if (sortField === 'signal') { av = a.signal || ''; bv = b.signal || ''; }
        else if (sortField === 'score')  { av = a.score ?? -1; bv = b.score ?? -1; }
        else {
            av = a.directionAdjustedReturns?.[sortField]; av = av == null ? -Infinity : av;
            bv = b.directionAdjustedReturns?.[sortField]; bv = bv == null ? -Infinity : bv;
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const HORIZON_LABELS = { 1:'1D', 3:'3D', 5:'5D', 10:'10D', 20:'20D' };

    const onSort = (field) => {
        if (field === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const SortHeader = ({ field, label, align = 'left' }) => (
        <th onClick={() => onSort(field)} style={{
            padding:'8px 10px', textAlign:align, fontWeight:'700', color: sortField === field ? '#2563eb' : '#64748b',
            borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
        }}>
            {label} {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div style={{ marginBottom:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <Telescope size={14} />
                    <span style={{ fontSize:'12px', fontWeight:'800', color:'#1a1a1a' }}>Individual Signals — {filtered.length} of {rows.length}</span>
                </div>
                <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search ticker..."
                    style={{ padding:'4px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'11px', outline:'none', width:'130px' }}
                />
                <span style={{ fontSize:'10px', color:'#94a3b8' }}>click a column to sort · click a ticker for detailed stats</span>
            </div>
            <div style={{ overflowX:'auto', border:'1px solid #e2e8f0', borderRadius:'10px' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                    <thead>
                        <tr style={{ backgroundColor:'#f8fafc' }}>
                            <SortHeader field="ticker" label="Ticker" />
                            <SortHeader field="signal" label="Signal" />
                            <th style={{ padding:'8px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Dir</th>
                            <SortHeader field="score" label="Score" align="center" />
                            <SortHeader field="date" label="Date" />
                            {horizons.map(h => (
                                <SortHeader key={h} field={String(h)} label={HORIZON_LABELS[h] || `${h}D`} align="center" />
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((r, i) => (
                            <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding:'7px 10px', fontWeight:'800', whiteSpace:'nowrap' }}>
                                    <span onClick={() => onSelectAsset(r.ticker)} style={{ cursor:'pointer', color:'#7c3aed', textDecoration:'underline dotted' }}>
                                        {r.ticker}
                                    </span>
                                    {onSelectTicker && (
                                        <span onClick={() => { onSelectTicker(r.ticker); onClose && onClose(); }} title="Open in full screener"
                                            style={{ marginLeft:'6px', fontSize:'10px', color:'#94a3b8', cursor:'pointer' }}>↗</span>
                                    )}
                                </td>
                                <td style={{ padding:'7px 10px', color:'#475569', whiteSpace:'nowrap' }}>{(r.signal || '').replace(/_/g,' ')}</td>
                                <td style={{ padding:'7px 10px', textAlign:'center' }}>
                                    <span style={{
                                        fontSize:'10px', fontWeight:'700', padding:'1px 7px', borderRadius:'10px',
                                        backgroundColor: r.direction === 'BULLISH' ? '#f0fdf4' : r.direction === 'BEARISH' ? '#fef2f2' : '#f8fafc',
                                        color: r.direction === 'BULLISH' ? '#10b981' : r.direction === 'BEARISH' ? '#ef4444' : '#94a3b8',
                                    }}>{r.direction === 'BULLISH' ? '▲' : r.direction === 'BEARISH' ? '▼' : '→'}</span>
                                </td>
                                <td style={{ padding:'7px 10px', textAlign:'center', color:'#475569' }}>{r.score != null ? Math.round(r.score) : '—'}</td>
                                <td style={{ padding:'7px 10px', color:'#64748b', whiteSpace:'nowrap' }}>{r.date}</td>
                                {horizons.map(h => {
                                    if (r.error) return <td key={h} style={{ padding:'7px 10px', textAlign:'center', color:'#cbd5e1' }} title={r.error}>err</td>;
                                    const v = r.directionAdjustedReturns?.[String(h)];
                                    if (v == null) return <td key={h} style={{ padding:'7px 10px', textAlign:'center', color:'#cbd5e1' }}>—</td>;
                                    return (
                                        <td key={h} style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color: v >= 0 ? '#10b981' : '#ef4444' }}>
                                            {v >= 0 ? '+' : ''}{v}%
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {sorted.length === 0 && (
                            <tr><td colSpan={5 + horizons.length} style={{ padding:'20px', textAlign:'center', color:'#94a3b8' }}>No tickers match "{search}"</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TickerPerformanceModal({ symbol, rows, horizons, sourceLabel, onClose, onOpenInScreener }) {
    const [horizon, setHorizon] = React.useState('5');
    if (!symbol) return null;

    const resolvedCount = rows.filter(r => !r.error).length;
    const errorCount = rows.length - resolvedCount;
    const aggregate = computeAggregateFromRows(rows, horizons);
    const currentCell = aggregate.ALL[horizon];
    const stabilityStats = computeStabilityStats(rows, horizons);
    const stabilityInfo = stabilityLabel(stabilityStats.combined.winRate);

    const sortedByDate = [...rows].sort((a, b) => b.date.localeCompare(a.date));
    const firstDate = rows.length ? [...rows].sort((a, b) => a.date.localeCompare(b.date))[0].date : null;
    const lastDate  = rows.length ? sortedByDate[0].date : null;

    const resolvedAtHorizon = rows.filter(r => !r.error && r.directionAdjustedReturns?.[horizon] != null);
    const best  = resolvedAtHorizon.length ? [...resolvedAtHorizon].sort((a, b) => b.directionAdjustedReturns[horizon] - a.directionAdjustedReturns[horizon])[0] : null;
    const worst = resolvedAtHorizon.length ? [...resolvedAtHorizon].sort((a, b) => a.directionAdjustedReturns[horizon] - b.directionAdjustedReturns[horizon])[0] : null;

    return (
        <div
            style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.65)', zIndex:10035, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'16px', backdropFilter:'blur(4px)', overflowY:'auto' }}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} style={{
                width:'100%', maxWidth:'720px', borderRadius:'18px', overflow:'hidden',
                backgroundColor:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
                fontFamily:"'Segoe UI', system-ui, sans-serif", marginTop:'8px', marginBottom:'24px',
            }}>
                <div style={{ padding:'18px 20px', background:'linear-gradient(135deg,#0f172a,#1e3a5f)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                    <div>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                            <BarChart3 size={18} color="#fff" />
                            <span style={{ fontSize:'17px', fontWeight:'800', color:'#fff' }}>{symbol}</span>
                            <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 9px', borderRadius:'20px', backgroundColor:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.8)' }}>{sourceLabel}</span>
                        </div>
                        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)' }}>
                            {rows.length} occurrence{rows.length !== 1 ? 's' : ''} {firstDate && lastDate ? `· ${firstDate} → ${lastDate}` : ''}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%', width:'30px', height:'30px', color:'#fff', fontSize:'16px', cursor:'pointer', flexShrink:0 }}>×</button>
                </div>

                <div style={{ padding:'20px', maxHeight:'72vh', overflowY:'auto' }}>
                    <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
                        {horizons.map(h => (
                            <button key={h} onClick={() => setHorizon(String(h))} style={{
                                padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer',
                                border:`1px solid ${horizon === String(h) ? '#3b82f6' : '#e2e8f0'}`,
                                backgroundColor: horizon === String(h) ? '#eff6ff' : '#fff',
                                color: horizon === String(h) ? '#2563eb' : '#94a3b8',
                            }}>{h}D</button>
                        ))}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'10px', marginBottom:'22px' }}>
                        {[
                            { label:'Occurrences', value: rows.length, Icon: Repeat, color:'#3b82f6' },
                            { label:`Win Rate (${horizon}D)`, value: currentCell?.winRate != null ? `${currentCell.winRate}%` : '—', Icon: Target, color: currentCell?.winRate >= 50 ? '#10b981' : '#ef4444' },
                            { label:`Avg Return (${horizon}D)`, value: currentCell?.avgDirectionAdjustedReturn != null ? `${currentCell.avgDirectionAdjustedReturn >= 0 ? '+' : ''}${currentCell.avgDirectionAdjustedReturn}%` : '—', Icon: BarChart3, color: currentCell?.avgDirectionAdjustedReturn >= 0 ? '#10b981' : '#ef4444' },
                            { label:'Stability (Combined)', value: stabilityStats.combined.stabilityScore != null ? `${stabilityStats.combined.stabilityScore}%` : '—', Icon: Shield, color: stabilityInfo.color },
                            { label:'Data Errors', value: errorCount, Icon: AlertTriangle, color: errorCount > 0 ? '#f59e0b' : '#94a3b8' },
                        ].map((s, i) => (
                            <div key={i} style={{ padding:'12px', borderRadius:'10px', backgroundColor:'#f8fafc', border:'1px solid #e2e8f0' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
                                    <s.Icon size={12} color={s.color} />
                                    <span style={{ fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.05em' }}>{s.label.toUpperCase()}</span>
                                </div>
                                <div style={{ fontSize:'17px', fontWeight:'800', color:s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {(best || worst) && (
                        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'22px' }}>
                            {best && (
                                <div style={{ flex:1, minWidth:'200px', padding:'10px 12px', borderRadius:'10px', backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
                                        <Award size={13} color="#10b981" />
                                        <span style={{ fontSize:'10px', fontWeight:'800', color:'#10b981' }}>BEST CALL</span>
                                    </div>
                                    <div style={{ fontSize:'12px', color:'#333' }}>{best.date} · {best.label}</div>
                                    <div style={{ fontSize:'16px', fontWeight:'800', color:'#10b981' }}>+{best.directionAdjustedReturns[horizon]}%</div>
                                </div>
                            )}
                            {worst && (
                                <div style={{ flex:1, minWidth:'200px', padding:'10px 12px', borderRadius:'10px', backgroundColor:'#fef2f2', border:'1px solid #fecaca' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
                                        <TrendingDown size={13} color="#ef4444" />
                                        <span style={{ fontSize:'10px', fontWeight:'800', color:'#ef4444' }}>WORST CALL</span>
                                    </div>
                                    <div style={{ fontSize:'12px', color:'#333' }}>{worst.date} · {worst.label}</div>
                                    <div style={{ fontSize:'16px', fontWeight:'800', color:'#ef4444' }}>{worst.directionAdjustedReturns[horizon]}%</div>
                                </div>
                            )}
                        </div>
                    )}

                                        <div style={{ marginBottom:'22px' }}>
                        <div style={{ fontSize:'12px', fontWeight:'800', color:'#1a1a1a', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px' }}>
                            <Shield size={14} /> Stability by Horizon (Individual Days)
                        </div>
                        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                            {horizons.map(h => {
                                const cell = stabilityStats.byHorizon[String(h)];
                                const info = stabilityLabel(cell?.winRate);
                                return (
                                    <div key={h} style={{ padding:'8px 12px', borderRadius:'10px', backgroundColor: `${info.color}10`, border:`1px solid ${info.color}30`, minWidth:'70px', textAlign:'center' }}>
                                        <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8' }}>{h}D</div>
                                        <div style={{ fontSize:'15px', fontWeight:'900', color: info.color }}>{cell?.stabilityScore != null ? `${cell.stabilityScore}%` : '—'}</div>
                                        <div style={{ fontSize:'8px', color:'#94a3b8' }}>n={cell?.count ?? 0}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <BacktestReturnByHorizonChart aggregate={aggregate} horizons={horizons} />
                    <TickerReturnTimelineChart rows={rows} horizon={horizon} />

                    <div style={{ fontSize:'12px', fontWeight:'800', color:'#1a1a1a', marginBottom:'8px' }}>All Occurrences</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' }}>
                        {sortedByDate.map((r, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', backgroundColor:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0', flexWrap:'wrap' }}>
                                <span style={{ fontSize:'11px', color:'#64748b', minWidth:'75px' }}>{r.date}</span>
                                <span style={{ fontSize:'11px', color:'#475569' }}>{r.label}</span>
                                <span style={{
                                    fontSize:'10px', fontWeight:'700', padding:'1px 7px', borderRadius:'10px',
                                    backgroundColor: r.direction === 'BULLISH' ? '#f0fdf4' : r.direction === 'BEARISH' ? '#fef2f2' : '#f8fafc',
                                    color: r.direction === 'BULLISH' ? '#10b981' : r.direction === 'BEARISH' ? '#ef4444' : '#94a3b8',
                                }}>{r.direction}</span>
                                <span style={{ fontSize:'10px', color:'#94a3b8' }}>{r.scoreLabel}</span>
                                <span style={{ marginLeft:'auto', fontSize:'12px', fontWeight:'800',
                                    color: r.error ? '#94a3b8' : (r.directionAdjustedReturns?.[horizon] >= 0 ? '#10b981' : '#ef4444') }}>
                                    {r.error ? 'no data' : (r.directionAdjustedReturns?.[horizon] != null ? `${r.directionAdjustedReturns[horizon] >= 0 ? '+' : ''}${r.directionAdjustedReturns[horizon]}%` : '—')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {onOpenInScreener && (
                        <button onClick={onOpenInScreener} style={{
                            width:'100%', padding:'11px', borderRadius:'10px',
                            background:'linear-gradient(135deg,#1e3a5f,#2563eb)', color:'#fff', border:'none',
                            fontWeight:'700', fontSize:'13px', cursor:'pointer',
                        }}>→ Open {symbol} in Full Screener</button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ScannerHistoryModal({ isOpen, onClose, onSelectTicker }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';

    const [loading,       setLoading]       = React.useState(false);
    const [error,         setError]         = React.useState(null);
    const [rows,          setRows]          = React.useState([]);
    const [tickerSearch,  setTickerSearch]  = React.useState('');
    const [startDate,     setStartDate]     = React.useState('');
    const [endDate,       setEndDate]       = React.useState('');
    const [expandedKey,   setExpandedKey]   = React.useState(null);
    const [collapsedDates,setCollapsedDates]= React.useState({});

    // -- Backtest mode --
    const [viewMode,        setViewMode]        = React.useState('timeline'); // 'timeline' | 'backtest'
    const [btLoading,       setBtLoading]        = React.useState(false);
    const [btError,         setBtError]          = React.useState(null);
    const [btData,          setBtData]           = React.useState(null);
    const [btSignalFilter,  setBtSignalFilter]   = React.useState('');
    const [btDirFilter,     setBtDirFilter]      = React.useState('');
    const [btVerdictFilter, setBtVerdictFilter]  = React.useState('');
    const BT_HORIZONS = [1, 3, 5, 10, 20];

    const [btHorizonFocus, setBtHorizonFocus] = React.useState('5');

    // -- Global Picks backtest (second data source) --
    const [btSource, setBtSource] = React.useState('scanner'); // 'scanner' | 'globalPicks'
    const [gpCountryFilter, setGpCountryFilter] = React.useState('');
    const [gpSectorFilter, setGpSectorFilter] = React.useState('');
    const [gpRecFilter, setGpRecFilter] = React.useState('');
    const [gpMinConviction, setGpMinConviction] = React.useState('');
    const [gpTopPickOnly, setGpTopPickOnly] = React.useState(false);
    const [gpLoading, setGpLoading] = React.useState(false);
    const [gpError, setGpError] = React.useState(null);
    const [gpData, setGpData] = React.useState(null);
    const [gpHorizonFocus, setGpHorizonFocus] = React.useState('5');
    const [gpHasRun, setGpHasRun] = React.useState(false);
    const [gpSortField, setGpSortField] = React.useState('date');
    const [gpSortDir, setGpSortDir] = React.useState('desc');

    // -- Performance detail modal (works for either source) --
    const [perfModalAsset, setPerfModalAsset] = React.useState(null); // { symbol, source: 'scanner' | 'globalPicks' }

    const HIST_SIG = {
        RANGE_BREAKOUT_BULL: { color:'#10b981', bg:'#f0fdf4', icon:'🚀', label:'Range Breakout ▲' },
        RANGE_BREAKOUT_BEAR: { color:'#ef4444', bg:'#fef2f2', icon:'🔻', label:'Range Breakout ▼' },
        ACCELERATING_BULL:   { color:'#3b82f6', bg:'#eff6ff', icon:'⚡', label:'Accelerating ▲'   },
        ACCELERATING_BEAR:   { color:'#f97316', bg:'#fff7ed', icon:'⚡', label:'Accelerating ▼'   },
        BREAKOUT:            { color:'#8b5cf6', bg:'#faf5ff', icon:'📈', label:'Breakout'          },
        TREND_BUILDING:      { color:'#06b6d4', bg:'#ecfeff', icon:'📊', label:'Trend Building'    },
        WATCH:               { color:'#94a3b8', bg:'#f8fafc', icon:'👁', label:'Watch'             },
    };

    const HIST_AI_VERDICT = {
        STRONG_OPPORTUNITY: { color:'#10b981', bg:'#f0fdf4', icon:'🔥' },
        OPPORTUNITY:         { color:'#3b82f6', bg:'#eff6ff', icon:'📈' },
        NEUTRAL:             { color:'#94a3b8', bg:'#f8fafc', icon:'➡️' },
        CAUTION:             { color:'#f59e0b', bg:'#fffbeb', icon:'⚠️' },
        AVOID:               { color:'#ef4444', bg:'#fef2f2', icon:'⛔' },
    };

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const body = { limit: 500 };
            if (tickerSearch.trim()) body.ticker = tickerSearch.trim().toUpperCase();
            if (startDate) body.startDate = startDate;
            if (endDate)   body.endDate   = endDate;

            const res  = await fetch(`${BACKEND}/api/snowvault_scanner_snapshot_list/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setRows(json.results || []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => { if (isOpen) fetchHistory(); }, [isOpen]);

    const fetchBacktest = async () => {
        setBtLoading(true);
        setBtError(null);
        try {
            const body = { limit: 1000, horizons: BT_HORIZONS };
            if (tickerSearch.trim())   body.ticker    = tickerSearch.trim().toUpperCase();
            if (startDate)             body.startDate = startDate;
            if (endDate)               body.endDate   = endDate;
            if (btSignalFilter)        body.signal    = btSignalFilter;
            if (btDirFilter)           body.direction = btDirFilter;
            if (btVerdictFilter)       body.aiVerdict = btVerdictFilter;

            const res  = await fetch(`${BACKEND}/api/snowvault_scanner_backtest_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setBtData(json);
        } catch (e) {
            setBtError(e.message);
        } finally {
            setBtLoading(false);
        }
    };

    const fetchGlobalPicksBacktest = async () => {
        setGpLoading(true);
        setGpError(null);
        setGpHasRun(true);
        try {
            const body = { limit: 1000, horizons: BT_HORIZONS };
            if (tickerSearch.trim())    body.symbol        = tickerSearch.trim().toUpperCase();
            if (startDate)              body.startDate     = startDate;
            if (endDate)                body.endDate       = endDate;
            if (gpCountryFilter.trim()) body.country       = gpCountryFilter.trim();
            if (gpSectorFilter.trim())  body.sector        = gpSectorFilter.trim();
            if (gpRecFilter)            body.rec           = gpRecFilter;
            if (gpMinConviction)        body.minConviction = parseInt(gpMinConviction, 10);
            if (gpTopPickOnly)          body.topPickOnly   = true;

            const res  = await fetch(`${BACKEND}/api/snowvault_global_picks_backtest_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setGpData(json);
        } catch (e) {
            setGpError(e.message);
        } finally {
            setGpLoading(false);
        }
    };

    const runActiveFetch = () => {
        if (viewMode === 'timeline') { fetchHistory(); return; }
        if (btSource === 'globalPicks') { fetchGlobalPicksBacktest(); return; }
        fetchBacktest();
    };
    const isActiveFetchLoading = viewMode === 'timeline' ? loading : (btSource === 'globalPicks' ? gpLoading : btLoading);

        React.useEffect(() => {
        if (!isOpen || viewMode !== 'backtest') return;
        if (btSource === 'scanner' && !btData) fetchBacktest();
        // Global Picks intentionally does NOT auto-run — country/sector/rec
        // should be chosen first, then the user explicitly hits "Run Backtest".
    }, [isOpen, viewMode, btSource]);

    const fmtCap = (v) => {
        if (!v) return '—';
        if (v >= 1e12) return `$${(v/1e12).toFixed(1)}T`;
        if (v >= 1e9)  return `$${(v/1e9).toFixed(0)}B`;
        return `$${(v/1e6).toFixed(0)}M`;
    };

    const grouped = React.useMemo(() => {
        const map = {};
        rows.forEach(r => { if (!map[r.date]) map[r.date] = []; map[r.date].push(r); });
        return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
    }, [rows]);

    const toggleDateCollapse = (date) => setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));

    const BT_HORIZON_LABELS = { '1':'1D', '3':'3D', '5':'5D', '10':'10D', '20':'20D' };

    
    const renderBacktestTable = (title, dataObj, Icon) => {
        if (!dataObj || Object.keys(dataObj).length === 0) return null;
        return (
            <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'12px', fontWeight:'800', color:'#1a1a1a', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px' }}>
                    {Icon && <Icon size={14} />} {title}
                </div>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                        <thead>
                            <tr style={{ backgroundColor:'#f8fafc' }}>
                                <th style={{ padding:'7px 10px', textAlign:'left', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0' }}>Group</th>
                                {BT_HORIZONS.map(h => (
                                    <th key={h} style={{ padding:'7px 10px', textAlign:'center', fontWeight:'700', color:'#64748b', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap' }}>
                                        {BT_HORIZON_LABELS[h] || `${h}D`}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(dataObj).map(([key, horizonMap]) => (
                                <tr key={key} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                    <td style={{ padding:'7px 10px', fontWeight:'700', color:'#1a1a1a', whiteSpace:'nowrap' }}>
                                        {key === 'ALL' ? 'All Snapshots' : key.replace('_',' ')}
                                    </td>
                                    {BT_HORIZONS.map(h => {
                                        const cell = horizonMap[String(h)];
                                        if (!cell || cell.count === 0) return <td key={h} style={{ padding:'7px 10px', textAlign:'center', color:'#cbd5e1' }}>—</td>;
                                        const positive = cell.avgDirectionAdjustedReturn >= 0;
                                        return (
                                            <td key={h} style={{ padding:'7px 10px', textAlign:'center' }}>
                                                <div style={{ fontWeight:'800', color: positive ? '#10b981' : '#ef4444' }}>
                                                    {positive ? '+' : ''}{cell.avgDirectionAdjustedReturn}%
                                                </div>
                                                <div style={{ fontSize:'10px', color:'#94a3b8' }}>
                                                    {cell.winRate}% win · n={cell.count}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

        return (
        <>
        <div
            style={{
                position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:10025,
                display:'flex', alignItems:'flex-start', justifyContent:'center',
                padding:'16px', backdropFilter:'blur(4px)', overflowY:'auto',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width:'100%', maxWidth:'900px', borderRadius:'18px', overflow:'hidden',
                    backgroundColor:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.25)',
                    fontFamily:"'Segoe UI', system-ui, sans-serif", marginTop:'8px', marginBottom:'24px',
                }}
            >
                <div style={{ padding:'18px 20px 14px', background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #10b981 130%)' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                                <span style={{ fontSize:'20px' }}>📜</span>
                                <span style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>Scanner History</span>
                            </div>
                            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>
                                Saved daily snapshots for backtesting — trend signals + AI opportunity analysis over time
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%',
                            width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer',
                            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                        }}>×</button>
                    </div>

                    <div style={{ display:'flex', gap:'6px', marginTop:'14px', marginBottom:'10px' }}>
                        {[{ m:'timeline', label:'Timeline', Icon: Calendar }, { m:'backtest', label:'Backtest', Icon: BarChart3 }].map(({ m, label, Icon }) => (
                            <button key={m} onClick={() => setViewMode(m)} style={{
                                padding:'6px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:'800', cursor:'pointer',
                                border:`1px solid ${viewMode === m ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.2)'}`,
                                backgroundColor: viewMode === m ? '#10b981' : 'rgba(255,255,255,0.08)',
                                color: viewMode === m ? '#fff' : 'rgba(255,255,255,0.6)',
                                transition:'all 0.15s', display:'flex', alignItems:'center', gap:'6px',
                            }}><Icon size={14} /> {label}</button>
                        ))}
                    </div>

                    {viewMode === 'backtest' && (
                        <div style={{ display:'flex', gap:'6px', marginBottom:'10px' }}>
                            {[{ s:'scanner', label:'📊 Trend Scanner' }, { s:'globalPicks', label:'🌍 Global Picks' }].map(({ s, label }) => (
                                <button key={s} onClick={() => setBtSource(s)} style={{
                                    padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer',
                                    border:`1px solid ${btSource === s ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.2)'}`,
                                    backgroundColor: btSource === s ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                                    color: btSource === s ? '#fff' : 'rgba(255,255,255,0.55)',
                                }}>{label}</button>
                            ))}
                        </div>
                    )}

                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                        <input
                            type="text" value={tickerSearch}
                            onChange={e => setTickerSearch(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && runActiveFetch()}
                            placeholder={viewMode === 'backtest' && btSource === 'globalPicks' ? 'Filter symbol e.g. 7203.T' : 'Filter ticker e.g. NVDA'}
                            style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', fontWeight:'600', outline:'none', width:'140px', color:'#1a1a1a', backgroundColor:'#fff' }}
                        />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }} />
                        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)' }}>to</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                            style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }} />

                        {viewMode === 'backtest' && btSource === 'scanner' && (
                            <>
                                <select value={btSignalFilter} onChange={e => setBtSignalFilter(e.target.value)}
                                    style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }}>
                                    <option value="">All Signals</option>
                                    {Object.keys(HIST_SIG).map(s => <option key={s} value={s}>{HIST_SIG[s].label}</option>)}
                                </select>
                                <select value={btDirFilter} onChange={e => setBtDirFilter(e.target.value)}
                                    style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }}>
                                    <option value="">All Directions</option>
                                    <option value="BULLISH">Bullish</option>
                                    <option value="BEARISH">Bearish</option>
                                    <option value="NEUTRAL">Neutral</option>
                                </select>
                                <select value={btVerdictFilter} onChange={e => setBtVerdictFilter(e.target.value)}
                                    style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }}>
                                    <option value="">All AI Verdicts</option>
                                    {Object.keys(HIST_AI_VERDICT).map(v => <option key={v} value={v}>{v.replace('_',' ')}</option>)}
                                </select>
                            </>
                        )}

                        {viewMode === 'backtest' && btSource === 'globalPicks' && (
                            <>
                                <input type="text" value={gpCountryFilter} onChange={e => setGpCountryFilter(e.target.value)}
                                    placeholder="Country e.g. Japan"
                                    style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', width:'110px', color:'#1a1a1a', backgroundColor:'#fff' }} />
                                <input type="text" value={gpSectorFilter} onChange={e => setGpSectorFilter(e.target.value)}
                                    placeholder="Sector"
                                    style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', width:'100px', color:'#1a1a1a', backgroundColor:'#fff' }} />
                                <select value={gpRecFilter} onChange={e => setGpRecFilter(e.target.value)}
                                    style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }}>
                                    <option value="">All Recs</option>
                                    <option value="STRONG BUY">Strong Buy</option>
                                    <option value="BUY">Buy</option>
                                    <option value="WATCH">Watch</option>
                                    <option value="HOLD">Hold</option>
                                </select>
                                <input type="number" min="1" max="10" value={gpMinConviction} onChange={e => setGpMinConviction(e.target.value)}
                                    placeholder="Min conv."
                                    style={{ padding:'6px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', width:'80px', color:'#1a1a1a', backgroundColor:'#fff' }} />
                                <label style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color:'rgba(255,255,255,0.75)', cursor:'pointer' }}>
                                    <input type="checkbox" checked={gpTopPickOnly} onChange={e => setGpTopPickOnly(e.target.checked)} />
                                    Top Picks only
                                </label>
                            </>
                        )}

                        <button onClick={runActiveFetch} disabled={isActiveFetchLoading} style={{
                            padding:'6px 16px', borderRadius:'8px',
                            background: isActiveFetchLoading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg,#10b981,#059669)',
                            border:'none', color:'#fff', fontWeight:'800', fontSize:'12px',
                            cursor: isActiveFetchLoading ? 'wait' : 'pointer', display:'flex', alignItems:'center', gap:'6px',
                        }}>
                            {isActiveFetchLoading
                                ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⏳</span> {viewMode === 'backtest' ? 'Crunching...' : 'Loading...'}</>
                                : <>🔍 {viewMode === 'backtest' ? 'Run Backtest' : 'Search'}</>}
                        </button>
                        {(tickerSearch || startDate || endDate || btSignalFilter || btDirFilter || btVerdictFilter || gpCountryFilter || gpSectorFilter || gpRecFilter || gpMinConviction || gpTopPickOnly) && (
                                                        <button onClick={() => {
                                setTickerSearch(''); setStartDate(''); setEndDate('');
                                setBtSignalFilter(''); setBtDirFilter(''); setBtVerdictFilter('');
                                setGpCountryFilter(''); setGpSectorFilter(''); setGpRecFilter(''); setGpMinConviction(''); setGpTopPickOnly(false);
                                if (viewMode === 'backtest' && btSource === 'globalPicks') { setGpData(null); setGpHasRun(false); return; }
                                setTimeout(runActiveFetch, 0);
                            }}
                                style={{ padding:'6px 12px', borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.8)', fontSize:'12px', fontWeight:'600', cursor:'pointer' }}>
                                Clear
                            </button>
                        )}
                        {viewMode === 'timeline' && rows.length > 0 && (
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginLeft:'auto' }}>
                                {rows.length} snapshot{rows.length !== 1 ? 's' : ''} · {grouped.length} day{grouped.length !== 1 ? 's' : ''}
                            </span>
                        )}
                        {viewMode === 'backtest' && btSource === 'scanner' && btData && (
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginLeft:'auto' }}>
                                {btData.totalSnapshots} snapshot{btData.totalSnapshots !== 1 ? 's' : ''} evaluated
                            </span>
                        )}
                        {viewMode === 'backtest' && btSource === 'globalPicks' && gpData && (
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginLeft:'auto' }}>
                                {gpData.totalPicks} pick{gpData.totalPicks !== 1 ? 's' : ''} evaluated
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ maxHeight:'70vh', overflowY:'auto' }}>
                    {viewMode === 'timeline' && (
                    <>
                    {loading && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'10px' }}>⏳</div>
                            <div style={{ fontSize:'13px', color:'#94a3b8' }}>Loading saved snapshots...</div>
                        </div>
                    )}

                    {error && !loading && (
                        <div style={{ padding:'20px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px' }}>⚠️ {error}</div>
                    )}

                    {!loading && !error && grouped.length === 0 && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
                            <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>No saved snapshots yet</div>
                            <div style={{ fontSize:'13px', color:'#64748b' }}>
                                Run the Trend Scanner and hit "Save Today's Snapshot" to start building history here.
                            </div>
                        </div>
                    )}

                    {!loading && grouped.map(([date, dateRows]) => {
                        const collapsed = !!collapsedDates[date];
                        const dateObj   = new Date(date + 'T12:00:00');
                        const dateLabel = dateObj.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
                        const bullCount = dateRows.filter(r => r.direction === 'BULLISH').length;
                        const bearCount = dateRows.filter(r => r.direction === 'BEARISH').length;

                        return (
                            <div key={date} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <div onClick={() => toggleDateCollapse(date)} style={{
                                    padding:'12px 20px', display:'flex', alignItems:'center', gap:'10px',
                                    cursor:'pointer', backgroundColor:'#f8fafc', position:'sticky', top:0, zIndex:1,
                                }}>
                                    <span style={{ fontSize:'13px', transition:'transform 0.15s', transform: collapsed ? 'rotate(-90deg)' : 'none', display:'inline-block' }}>▾</span>
                                    <span style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>{dateLabel}</span>
                                    <span style={{ fontSize:'11px', color:'#94a3b8' }}>{dateRows.length} stocks</span>
                                    <span style={{ fontSize:'11px', color:'#10b981', fontWeight:'700' }}>{bullCount}▲</span>
                                    <span style={{ fontSize:'11px', color:'#ef4444', fontWeight:'700' }}>{bearCount}▼</span>
                                </div>

                                {!collapsed && (
                                    <div style={{ padding:'8px 20px 16px', display:'flex', flexDirection:'column', gap:'6px' }}>
                                        {dateRows.sort((a, b) => (b.score||0) - (a.score||0)).map(r => {
                                            const sc  = HIST_SIG[r.signal] || HIST_SIG.WATCH;
                                            const av  = HIST_AI_VERDICT[r.aiVerdict] || null;
                                            const key = `${r.date}_${r.ticker}`;
                                            const isExpanded = expandedKey === key;
                                            const dirColor = r.direction === 'BULLISH' ? '#10b981' : r.direction === 'BEARISH' ? '#ef4444' : '#94a3b8';

                                            return (
                                                <div key={key} style={{ borderRadius:'10px', border:`1px solid ${isExpanded ? sc.color : '#e2e8f0'}`, overflow:'hidden' }}>
                                                    <div onClick={() => setExpandedKey(isExpanded ? null : key)} style={{
                                                        padding:'9px 12px', display:'flex', alignItems:'center', gap:'10px',
                                                        cursor:'pointer', backgroundColor: isExpanded ? sc.bg : '#fff', flexWrap:'wrap',
                                                    }}>
                                                        <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a', minWidth:'52px' }}>{r.ticker}</span>
                                                        <span style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor:sc.bg, color:sc.color, whiteSpace:'nowrap' }}>
                                                            {sc.icon} {sc.label}
                                                        </span>
                                                        <span style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: dirColor+'15', color:dirColor }}>
                                                            {r.direction}
                                                        </span>
                                                        {av && (
                                                            <span style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor:av.bg, color:av.color, whiteSpace:'nowrap' }}>
                                                                {av.icon} 🧠 {r.aiVerdict?.replace('_',' ')}
                                                            </span>
                                                        )}
                                                        <span style={{ marginLeft:'auto', fontSize:'11px', color:'#64748b', fontWeight:'700' }}>
                                                            Score {r.score != null ? Math.round(r.score) : '—'}
                                                        </span>
                                                        <span style={{ fontSize:'11px', color:'#94a3b8', minWidth:'55px', textAlign:'right' }}>
                                                            {r.currentPrice != null ? `$${r.currentPrice}` : '—'}
                                                        </span>
                                                        <span style={{ fontSize:'11px', color:'#94a3b8', minWidth:'45px', textAlign:'right' }}>{fmtCap(r.marketCap)}</span>
                                                        {r.savedCount > 1 && (
                                                            <span title={`Refreshed ${r.savedCount}× that day`} style={{ fontSize:'10px', color:'#94a3b8' }}>×{r.savedCount}</span>
                                                        )}
                                                    </div>

                                                    {isExpanded && (
                                                        <div style={{ padding:'12px 14px', backgroundColor:'#fafafa', borderTop:`1px solid ${sc.color}`, display:'flex', flexDirection:'column', gap:'10px' }}>
                                                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(90px,1fr))', gap:'8px' }}>
                                                                {[
                                                                    { label:'ADX', value: r.rawScanner?.adxNow ?? '—' },
                                                                    { label:'ROC20', value: r.rawScanner?.roc20 != null ? `${r.rawScanner.roc20}%` : '—' },
                                                                    { label:'Vol Ratio', value: r.rawScanner?.volRatio != null ? `${r.rawScanner.volRatio}×` : '—' },
                                                                    { label:'From 52W High', value: r.rawScanner?.pctFromHigh != null ? `${r.rawScanner.pctFromHigh}%` : '—' },
                                                                    { label:'Sector', value: r.sector || '—' },
                                                                ].map((item, ii) => (
                                                                    <div key={ii} style={{ padding:'7px 9px', backgroundColor:'#fff', borderRadius:'7px', border:'1px solid #e2e8f0' }}>
                                                                        <div style={{ fontSize:'9px', fontWeight:'700', color:'#94a3b8', marginBottom:'2px' }}>{item.label.toUpperCase()}</div>
                                                                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#1a1a1a' }}>{item.value}</div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {r.aiSynthesis ? (
                                                                <div style={{ padding:'10px 12px', backgroundColor: av?.bg || '#f8fafc', borderRadius:'8px', border:`2px solid ${av?.color || '#e2e8f0'}` }}>
                                                                    <div style={{ fontSize:'10px', fontWeight:'700', color:av?.color || '#64748b', letterSpacing:'0.06em', marginBottom:'6px' }}>
                                                                        ✨🧠 AI SYNTHESIS ({r.aiSynthesis.runCountAtSynthesis} sources) — {r.aiSynthesis.finalOpportunityScore}/100
                                                                    </div>
                                                                    <div style={{ fontSize:'12px', color:'#333', lineHeight:1.55 }}>{r.aiSynthesis.synthesizedThesis}</div>
                                                                </div>
                                                            ) : r.aiRuns?.length > 0 ? (
                                                                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                                                    <div style={{ fontSize:'10px', fontWeight:'700', color:'#64748b', letterSpacing:'0.06em' }}>
                                                                        🧠 {r.aiRuns.length} AI RUN{r.aiRuns.length !== 1 ? 'S' : ''} (no synthesis saved that day)
                                                                    </div>
                                                                    {r.aiRuns.map((run, ri) => (
                                                                        <div key={ri} style={{ padding:'8px 10px', backgroundColor:'#f8fafc', borderRadius:'7px', border:'1px solid #e2e8f0', fontSize:'11px' }}>
                                                                            <strong>{run.source || 'AI'}:</strong> {run.verdict?.replace('_',' ')} ({run.opportunityScore}/100) — {run.thesis}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : r.aiAnalysis ? (
                                                                <div style={{ padding:'10px 12px', backgroundColor: av?.bg || '#f8fafc', borderRadius:'8px', border:`1px solid ${av?.color || '#e2e8f0'}30` }}>
                                                                    <div style={{ fontSize:'10px', fontWeight:'700', color:av?.color || '#64748b', letterSpacing:'0.06em', marginBottom:'6px' }}>
                                                                        🧠 AI ANALYSIS (legacy) — {r.aiOpportunityScore}/100
                                                                    </div>
                                                                    <div style={{ fontSize:'12px', color:'#333', lineHeight:1.55 }}>{r.aiAnalysis.thesis}</div>
                                                                </div>
                                                            ) : (
                                                                <div style={{ fontSize:'11px', color:'#94a3b8', fontStyle:'italic' }}>
                                                                    No AI analysis was attached when this snapshot was saved.
                                                                </div>
                                                            )}

                                                            {onSelectTicker && (
                                                                <button onClick={() => { onSelectTicker(r.ticker); onClose(); }} style={{
                                                                    padding:'8px', borderRadius:'8px',
                                                                    background:'linear-gradient(135deg,#1e3a5f,#2563eb)',
                                                                    color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor:'pointer',
                                                                }}>→ Open {r.ticker} in Screener</button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    </>
                    )}

                    {viewMode === 'backtest' && btSource === 'scanner' && (
                        <div style={{ padding:'20px' }}>
                            {btLoading && (
                                <div style={{ padding:'60px 20px', textAlign:'center' }}>
                                    <div style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'10px' }}>⏳</div>
                                    <div style={{ fontSize:'13px', color:'#94a3b8' }}>Pulling price history and computing forward returns...</div>
                                </div>
                            )}
                            {btError && !btLoading && (
                                <div style={{ padding:'16px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px', borderRadius:'8px' }}>⚠️ {btError}</div>
                            )}
                            {!btLoading && !btError && btData && btData.totalSnapshots === 0 && (
                                <div style={{ padding:'60px 20px', textAlign:'center' }}>
                                    <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
                                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>No snapshots match these filters</div>
                                </div>
                            )}
                            {!btLoading && !btError && btData && btData.totalSnapshots > 0 && (
                                <>
                                    <div style={{
                                        padding:'10px 14px', backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0',
                                        borderRadius:'8px', fontSize:'12px', color:'#065f46', lineHeight:1.6, marginBottom:'20px',
                                    }}>
                                        💡 Returns below are <strong>direction-adjusted</strong> — a BEARISH signal that saw price fall is counted as a <em>win</em>, not a loss. Win rate = % of resolved snapshots where the direction call was correct at that horizon. Horizons with no data yet are excluded, not guessed at.
                                    </div>
                                    <BacktestPlainEnglish btData={btData} />
                                    <ScannerBacktestTopBottomPerformers rows={btData.rows} horizon={btHorizonFocus} />
                                    <StabilityRankingTable rows={btData.rows} horizons={BT_HORIZONS} keyField="ticker"
                                        onSelectAsset={(t) => setPerfModalAsset({ symbol: t, source: 'scanner' })} />
                                    <BacktestReturnByHorizonChart aggregate={btData.aggregate} horizons={BT_HORIZONS} />
                                    <BacktestSignalComparisonChart bySignal={btData.bySignal} horizon={btHorizonFocus} onHorizonChange={setBtHorizonFocus} horizons={BT_HORIZONS} />
                                    {renderBacktestTable('Overall', btData.aggregate, BarChart3)}
                                    {renderBacktestTable('By Signal', btData.bySignal, Telescope)}
                                    {renderBacktestTable('By Direction', btData.byDirection, ArrowUpDown)}
                                    {Object.keys(btData.byAiVerdict || {}).length > 0 && renderBacktestTable('By AI Verdict', btData.byAiVerdict, Brain)}
                                                                        {renderBacktestTable('By Scanner Score', btData.byScoreBucket, Gauge)}
                                    <ScannerBacktestDetailTable
                                        rows={btData.rows} horizons={BT_HORIZONS}
                                        onSelectAsset={(ticker) => setPerfModalAsset({ symbol: ticker, source: 'scanner' })}
                                        onSelectTicker={onSelectTicker}
                                        onClose={onClose}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {viewMode === 'backtest' && btSource === 'globalPicks' && (
                        <div style={{ padding:'20px' }}>
                            {!gpHasRun && !gpLoading && (
                                <div style={{ padding:'50px 20px', textAlign:'center' }}>
                                    <div style={{ fontSize:'40px', marginBottom:'12px' }}>🌍</div>
                                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>
                                        Choose what to backtest
                                    </div>
                                    <div style={{ fontSize:'13px', color:'#64748b', maxWidth:'420px', margin:'0 auto', lineHeight:1.6 }}>
                                        Enter a <strong>country</strong> and/or <strong>sector</strong> above (or set a min conviction / Top Picks only), then hit <strong>Run Backtest</strong>. This pulls real price history for every matching pick, so it's not instant — that's why it doesn't run automatically.
                                    </div>
                                </div>
                            )}
                            {gpLoading && (
                                <div style={{ padding:'60px 20px', textAlign:'center' }}>
                                    <div style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'10px' }}>⏳</div>
                                    <div style={{ fontSize:'13px', color:'#94a3b8' }}>Pulling price history for global picks and computing forward returns...</div>
                                </div>
                            )}
                            {gpError && !gpLoading && (
                                <div style={{ padding:'16px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px', borderRadius:'8px' }}>⚠️ {gpError}</div>
                            )}
                            {gpHasRun && !gpLoading && !gpError && gpData && gpData.totalPicks === 0 && (
                                <div style={{ padding:'60px 20px', textAlign:'center' }}>
                                    <div style={{ fontSize:'40px', marginBottom:'12px' }}>🌍</div>
                                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>No global picks match these filters</div>
                                    <div style={{ fontSize:'13px', color:'#64748b' }}>Try a broader country/sector, or save picks from the Country-Sector Drill first.</div>
                                </div>
                            )}
                            {gpHasRun && !gpLoading && !gpError && gpData && gpData.totalPicks > 0 && (
                                <>
                                    <div style={{
                                        padding:'10px 14px', backgroundColor:'#eff6ff', border:'1px solid #bfdbfe',
                                        borderRadius:'8px', fontSize:'12px', color:'#1d4ed8', lineHeight:1.6, marginBottom:'20px',
                                    }}>
                                        💡 "Direction" here comes from the rec label — STRONG BUY/BUY count as bullish, anything with SELL/AVOID counts as bearish, WATCH/HOLD are treated as neutral (not flipped). Same direction-adjusted return logic as the Trend Scanner backtest.
                                    </div>
                                    <GlobalPicksPlainEnglish gpData={gpData} />
                                    <GlobalPicksTopBottomPerformers rows={gpData.rows} horizon={gpHorizonFocus} />
                                    <StabilityRankingTable rows={gpData.rows} horizons={BT_HORIZONS} keyField="symbol"
                                        onSelectAsset={(s) => setPerfModalAsset({ symbol: s, source: 'globalPicks' })} />
                                    <BacktestReturnByHorizonChart aggregate={gpData.aggregate} horizons={BT_HORIZONS} />
                                    <BacktestGroupComparisonChart
                                        title="Performance by Recommendation" IconComp={Brain}
                                        data={gpData.byRec} horizon={gpHorizonFocus} onHorizonChange={setGpHorizonFocus} horizons={BT_HORIZONS}
                                        labelize={k => k}
                                    />
                                    <BacktestGroupComparisonChart
                                        title="Performance by Country" IconComp={Telescope}
                                        data={gpData.byCountry} horizon={gpHorizonFocus} onHorizonChange={setGpHorizonFocus} horizons={BT_HORIZONS}
                                        labelize={k => k}
                                    />
                                    {renderBacktestTable('Overall', gpData.aggregate, BarChart3)}
                                    {renderBacktestTable('By Recommendation', gpData.byRec, Brain)}
                                    {renderBacktestTable('By Country', gpData.byCountry, Telescope)}
                                    {renderBacktestTable('By Sector', gpData.bySector, Gauge)}
                                    {renderBacktestTable('By Conviction', gpData.byConvictionBucket, Target)}
                                    {renderBacktestTable('Top Pick vs Regular', gpData.byTopPick, ArrowUpDown)}
                                    <GlobalPicksDetailTable
                                        rows={gpData.rows} horizons={BT_HORIZONS}
                                        sortField={gpSortField} sortDir={gpSortDir}
                                        onSort={(field) => {
                                            if (field === gpSortField) setGpSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                            else { setGpSortField(field); setGpSortDir('desc'); }
                                        }}
                                        onSelectTicker={onSelectTicker}
                                        onClose={onClose}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

                        <style>{`
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            `}</style>
        </div>

        {perfModalAsset && (
            <TickerPerformanceModal
                symbol={perfModalAsset.symbol}
                rows={
                    perfModalAsset.source === 'scanner'
                        ? normalizeRowsForPerfModal((btData?.rows || []).filter(r => r.ticker === perfModalAsset.symbol), 'scanner')
                        : normalizeRowsForPerfModal((gpData?.rows || []).filter(r => r.symbol === perfModalAsset.symbol), 'globalPicks')
                }
                horizons={BT_HORIZONS}
                sourceLabel={perfModalAsset.source === 'scanner' ? 'Trend Scanner' : 'Global Stock Picks'}
                onClose={() => setPerfModalAsset(null)}
                onOpenInScreener={onSelectTicker ? () => { onSelectTicker(perfModalAsset.symbol); setPerfModalAsset(null); onClose && onClose(); } : null}
            />
        )}
        </>
    );
}

function MomentumVelocityPanel({ ticker, openaiKey }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [data,     setData]     = React.useState(null);
    const [loading,  setLoading]  = React.useState(false);
    const [error,    setError]    = React.useState(null);
    const [interval, setInterval] = React.useState('1D');
    const [tab,      setTab]      = React.useState('overview'); // overview|roc|volume

    React.useEffect(() => {
        if (ticker) fetch_data();
    }, [ticker, interval]);

    const fetch_data = async () => {
        setLoading(true);
        setError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_momentum_velocity_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ ticker, interval }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setData(json);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // ── State config ─────────────────────────────────────────────────────────
    const STATE_CONFIG = {
        HIGH_VELOCITY: { color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'🚀', label:'High Velocity',  desc:'Strong momentum — stock is moving fast'         },
        BUILDING:      { color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', icon:'📈', label:'Building',       desc:'Momentum picking up — watch for breakout'        },
        LOW_VELOCITY:  { color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'🐢', label:'Low Velocity',   desc:'Weak momentum — moving but slowly'               },
        IDLE:          { color:'#94a3b8', bg:'#f8fafc', border:'#e2e8f0', icon:'😴', label:'Idle',           desc:'No momentum — stock is going nowhere right now'  },
        UNKNOWN:       { color:'#94a3b8', bg:'#f8fafc', border:'#e2e8f0', icon:'❓', label:'Unknown',        desc:'Not enough data'                                 },
    };

    const DIR_CONFIG = {
        BULLISH: { color:'#10b981', icon:'▲', label:'Bullish' },
        BEARISH: { color:'#ef4444', icon:'▼', label:'Bearish' },
        NEUTRAL: { color:'#94a3b8', icon:'→', label:'Neutral' },
    };

    if (!ticker) return null;

    const sc  = data ? (STATE_CONFIG[data.velocityState] || STATE_CONFIG.UNKNOWN) : null;
    const dc  = data ? (DIR_CONFIG[data.direction]       || DIR_CONFIG.NEUTRAL)   : null;

    // ── Mini sparkline helper ─────────────────────────────────────────────────
    const Sparkline = ({ series, color, zeroLine = false, height = 48 }) => {
        if (!series?.length) return null;
        const W      = 300;
        const H      = height;
        const vals   = series.map(s => s.value);
        const minV   = Math.min(...vals);
        const maxV   = Math.max(...vals);
        const range  = maxV - minV || 1;
        const norm   = v => H - ((v - minV) / range) * (H - 4) - 2;
        const pts    = series.map((s, i) => `${(i / (series.length - 1)) * W},${norm(s.value)}`).join(' ');
        const zeroY  = zeroLine ? norm(0) : null;

        return (
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:'block' }}>
                {zeroLine && zeroY !== null && (
                    <line x1="0" y1={zeroY} x2={W} y2={zeroY}
                        stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="3,2"/>
                )}
                <polyline points={pts} fill="none"
                    stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
                {/* Colour dots for positive/negative */}
                {zeroLine && series.map((s, i) => {
                    if (i % 5 !== 0) return null;
                    return (
                        <circle key={i}
                            cx={(i / (series.length - 1)) * W}
                            cy={norm(s.value)}
                            r="2"
                            fill={s.value >= 0 ? '#10b981' : '#ef4444'}
                        />
                    );
                })}
            </svg>
        );
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius:    '14px',
            border:          '1px solid #e2e8f0',
            boxShadow:       '0 4px 16px rgba(0,0,0,0.06)',
            overflow:        'hidden',
            marginBottom:    '20px',
            fontFamily:      "'Segoe UI', system-ui, sans-serif",
        }}>

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div style={{
                padding:    '14px 18px',
                background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
                display:    'flex', alignItems:'center',
                justifyContent:'space-between', flexWrap:'wrap', gap:'10px',
            }}>
                <div>
                    <div style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>
                        ⚡ Momentum Velocity — {ticker}
                    </div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', marginTop:'2px' }}>
                        ADX · ROC · Volume Velocity · Relative Strength
                    </div>
                </div>
                <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                    {/* Interval picker */}
                    {['15m','1h','1D','1W'].map(iv => (
                        <button key={iv} onClick={() => setInterval(iv)}
                            style={{
                                padding:'4px 10px', borderRadius:'6px', fontSize:'11px',
                                fontWeight:'700', cursor:'pointer', border:'none',
                                backgroundColor: interval === iv ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                color: interval === iv ? '#fff' : 'rgba(255,255,255,0.5)',
                                transition:'all 0.15s',
                            }}>{iv}</button>
                    ))}
                    <button onClick={fetch_data} disabled={loading}
                        style={{
                            padding:'4px 10px', borderRadius:'6px', fontSize:'11px',
                            fontWeight:'700', cursor:'pointer', border:'none',
                            backgroundColor:'rgba(255,255,255,0.1)',
                            color:'rgba(255,255,255,0.6)',
                        }}>
                        <span style={{ display:'inline-block', animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>🔄</span>
                    </button>
                </div>
            </div>

            {/* ── Loading ─────────────────────────────────────────────────────── */}
            {loading && (
                <div style={{ padding:'40px', textAlign:'center', color:'#64748b' }}>
                    <div style={{ fontSize:'28px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'8px' }}>⚡</div>
                    <div style={{ fontSize:'13px', fontWeight:'600' }}>Calculating momentum velocity...</div>
                </div>
            )}

            {/* ── Error ──────────────────────────────────────────────────────── */}
            {error && !loading && (
                <div style={{ padding:'16px 18px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px' }}>
                    ⚠️ {error}
                </div>
            )}

            {/* ── Main content ────────────────────────────────────────────────── */}
            {data && !loading && (
                <>
                    {/* ── Velocity score hero ── */}
                    <div style={{
                        padding:         '18px 20px',
                        backgroundColor: sc.bg,
                        borderBottom:    `3px solid ${sc.color}`,
                        display:         'flex', gap:'16px',
                        alignItems:      'center', flexWrap:'wrap',
                    }}>
                        {/* Big score circle */}
                        <div style={{
                            width:'80px', height:'80px', borderRadius:'50%',
                            backgroundColor: sc.color,
                            display:'flex', flexDirection:'column',
                            alignItems:'center', justifyContent:'center',
                            flexShrink:0,
                            boxShadow:`0 4px 20px ${sc.color}44`,
                        }}>
                            <div style={{ fontSize:'24px', fontWeight:'900', color:'#fff', lineHeight:1 }}>
                                {data.velocityScore ?? '—'}
                            </div>
                            <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.8)', fontWeight:'700', letterSpacing:'0.05em' }}>
                                /100
                            </div>
                        </div>

                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                                <span style={{ fontSize:'20px' }}>{sc.icon}</span>
                                <span style={{ fontSize:'18px', fontWeight:'800', color:sc.color }}>{sc.label}</span>
                                <span style={{
                                    padding:'3px 10px', borderRadius:'20px', fontSize:'12px',
                                    fontWeight:'700',
                                    backgroundColor: dc.color + '18',
                                    color:           dc.color,
                                    border:`1px solid ${dc.color}30`,
                                }}>
                                    {dc.icon} {dc.label}
                                </span>
                            </div>
                            <div style={{ fontSize:'13px', color:'#475569', lineHeight:1.5 }}>
                                {sc.desc}
                            </div>
                            {/* Velocity bar */}
                            <div style={{ marginTop:'10px' }}>
                                <div style={{ height:'6px', backgroundColor:'#e2e8f0', borderRadius:'3px', overflow:'hidden' }}>
                                    <div style={{
                                        height:'100%',
                                        width:`${data.velocityScore ?? 0}%`,
                                        backgroundColor: sc.color,
                                        borderRadius:'3px',
                                        transition:'width 1s ease',
                                    }}/>
                                </div>
                                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#94a3b8', marginTop:'3px', fontWeight:'700' }}>
                                    <span>IDLE</span>
                                    <span>LOW</span>
                                    <span>BUILDING</span>
                                    <span>HIGH ⚡</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Tab switcher ── */}
                    <div style={{
                        display:'flex', borderBottom:'2px solid #f1f5f9',
                        padding:'0 18px', backgroundColor:'#fafafa',
                    }}>
                        {[
                            { id:'overview', label:'Overview'       },
                            { id:'roc',      label:'ROC Chart'      },
                            { id:'volume',   label:'Volume Velocity'},
                        ].map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)}
                                style={{
                                    padding:'10px 16px', fontSize:'12px', fontWeight:'700',
                                    border:'none', backgroundColor:'transparent',
                                    borderBottom:`2px solid ${tab === t.id ? '#3b82f6' : 'transparent'}`,
                                    color: tab === t.id ? '#3b82f6' : '#94a3b8',
                                    cursor:'pointer', marginBottom:'-2px',
                                    transition:'all 0.15s', whiteSpace:'nowrap',
                                }}>{t.label}</button>
                        ))}
                    </div>

                    {/* ── Overview tab ── */}
                    {tab === 'overview' && (
                        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'14px' }}>

                            {/* Key metrics grid */}
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'10px' }}>
                                {[
                                    {
                                        label: 'ADX',
                                        value: data.adx != null ? data.adx.toFixed(1) : '—',
                                        sub:   data.adx >= 25 ? 'Trending 🔥' : data.adx >= 20 ? 'Weak trend' : 'Ranging 😴',
                                        color: data.adx >= 25 ? '#10b981' : data.adx >= 20 ? '#f59e0b' : '#94a3b8',
                                        tip:   'ADX > 25 = trending. < 20 = idling.',
                                    },
                                    {
                                        label: '+DI / -DI',
                                        value: data.plusDI != null ? `${data.plusDI.toFixed(1)} / ${data.minusDI.toFixed(1)}` : '—',
                                        sub:   data.plusDI > data.minusDI ? 'Bulls winning' : 'Bears winning',
                                        color: data.plusDI > data.minusDI ? '#10b981' : '#ef4444',
                                        tip:   '+DI > -DI = bullish pressure',
                                    },
                                    {
                                        label: 'Vol Ratio',
                                        value: data.volRatio != null ? `${data.volRatio}×` : '—',
                                        sub:   data.volRatio >= 1.5 ? 'High activity' : data.volRatio >= 1.0 ? 'Normal' : 'Low activity',
                                        color: data.volRatio >= 1.5 ? '#10b981' : data.volRatio >= 1.0 ? '#3b82f6' : '#94a3b8',
                                        tip:   '5-day vs 20-day avg volume',
                                    },
                                    {
                                        label: 'ROC 20d',
                                        value: data.roc20 != null ? `${data.roc20 >= 0 ? '+' : ''}${data.roc20}%` : '—',
                                        sub:   '20-day price change',
                                        color: data.roc20 >= 5 ? '#10b981' : data.roc20 >= 0 ? '#3b82f6' : data.roc20 >= -5 ? '#f59e0b' : '#ef4444',
                                        tip:   'Rate of change over 20 periods',
                                    },
                                    {
                                        label: 'Acceleration',
                                        value: data.acceleration != null ? `${data.acceleration >= 0 ? '+' : ''}${data.acceleration.toFixed(2)}` : '—',
                                        sub:   data.acceleration > 0 ? '⚡ Speeding up' : data.acceleration < 0 ? '🐢 Slowing down' : 'Steady',
                                        color: data.acceleration > 0.5 ? '#10b981' : data.acceleration < -0.5 ? '#ef4444' : '#f59e0b',
                                        tip:   'Is momentum itself accelerating?',
                                    },
                                    {
                                        label: 'vs SPY',
                                        value: data.relStrength != null ? `${data.relStrength >= 0 ? '+' : ''}${data.relStrength}%` : '—',
                                        sub:   data.relStrength > 0 ? 'Outperforming' : 'Underperforming',
                                        color: data.relStrength > 0 ? '#10b981' : '#ef4444',
                                        tip:   'Relative strength vs S&P 500',
                                    },
                                ].map((item, i) => (
                                    <div key={i} title={item.tip} style={{
                                        padding:'11px 13px',
                                        backgroundColor:'#f8fafc',
                                        borderRadius:'10px',
                                        borderLeft:`3px solid ${item.color}`,
                                        cursor:'help',
                                    }}>
                                        <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'4px' }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize:'17px', fontWeight:'800', color:item.color }}>
                                            {item.value}
                                        </div>
                                        <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'2px' }}>
                                            {item.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ROC multi-timeframe strip */}
                            <div style={{
                                padding:'12px 14px',
                                backgroundColor:'#f8fafc',
                                borderRadius:'10px',
                                border:'1px solid #e2e8f0',
                            }}>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                    RATE OF CHANGE — MULTI TIMEFRAME
                                </div>
                                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                                    {[
                                        { label:'5-bar',  val: data.roc5  },
                                        { label:'10-bar', val: data.roc10 },
                                        { label:'20-bar', val: data.roc20 },
                                        { label:'60-bar', val: data.roc60 },
                                    ].filter(r => r.val != null).map((r, i) => {
                                        const c = r.val >= 5 ? '#10b981' : r.val >= 0 ? '#3b82f6' : r.val >= -5 ? '#f59e0b' : '#ef4444';
                                        return (
                                            <div key={i} style={{
                                                padding:'8px 14px', borderRadius:'20px',
                                                backgroundColor: c + '15',
                                                border:`1px solid ${c}30`,
                                                display:'flex', flexDirection:'column', alignItems:'center',
                                            }}>
                                                <span style={{ fontSize:'10px', color:'#94a3b8', fontWeight:'600' }}>{r.label}</span>
                                                <span style={{ fontSize:'15px', fontWeight:'800', color:c }}>
                                                    {r.val >= 0 ? '+' : ''}{r.val}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Plain English summary */}
                            <div style={{
                                padding:'12px 14px',
                                backgroundColor: sc.bg,
                                borderRadius:'10px',
                                border:`1px solid ${sc.border}`,
                                borderLeft:`4px solid ${sc.color}`,
                            }}>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:sc.color, letterSpacing:'0.07em', marginBottom:'6px' }}>
                                    😼 WHAT THIS MEANS FOR YOU
                                </div>
                                <div style={{ fontSize:'13px', color:'#333', lineHeight:1.6 }}>
                                    {data.velocityState === 'HIGH_VELOCITY' && `${ticker} is moving fast right now. ADX of ${data.adx?.toFixed(0)} confirms a strong trend. Volume is ${data.volRatio}× normal — real money is behind this move.`}
                                    {data.velocityState === 'BUILDING' && `${ticker} is picking up steam. Momentum is ${data.acceleration > 0 ? 'accelerating' : 'present but not yet accelerating'}. ADX of ${data.adx?.toFixed(0)} suggests ${data.adx >= 20 ? 'a trend is forming' : 'still early — watch for confirmation'}.`}
                                    {data.velocityState === 'LOW_VELOCITY' && `${ticker} is moving slowly. ADX of ${data.adx?.toFixed(0)} is below 25 — no strong trend. Volume ratio of ${data.volRatio}× is ${data.volRatio < 1 ? 'below average — low conviction' : 'normal'}. Wait for a catalyst.`}
                                    {data.velocityState === 'IDLE' && `${ticker} is going nowhere right now. ADX of ${data.adx?.toFixed(0)} signals a ranging, trendless market. Trading this without a catalyst is a low-probability bet. Wait for velocity to build first.`}
                                    {data.relStrength != null && ` It's ${data.relStrength > 0 ? `outperforming SPY by ${data.relStrength}%` : `underperforming SPY by ${Math.abs(data.relStrength)}%`} over 20 bars.`}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ROC Chart tab ── */}
                    {tab === 'roc' && (
                        <div style={{ padding:'16px 18px' }}>
                            <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                10-BAR RATE OF CHANGE — positive = accelerating up, negative = accelerating down
                            </div>
                            <div style={{
                                padding:'14px',
                                backgroundColor:'#0f172a',
                                borderRadius:'10px',
                                marginBottom:'12px',
                            }}>
                                <Sparkline
                                    series={data.rocSeries}
                                    color="#60a5fa"
                                    zeroLine={true}
                                    height={80}
                                />
                                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#475569', marginTop:'6px' }}>
                                    <span>{data.rocSeries?.[0]?.date}</span>
                                    <span style={{ color:'#60a5fa', fontWeight:'700' }}>
                                        Now: {data.rocNow != null ? `${data.rocNow >= 0 ? '+' : ''}${data.rocNow}%` : '—'}
                                    </span>
                                    <span>{data.rocSeries?.[data.rocSeries.length-1]?.date}</span>
                                </div>
                            </div>
                            <div style={{ fontSize:'12px', color:'#64748b', lineHeight:1.6, padding:'0 2px' }}>
                                ROC above zero = price is higher than it was 10 bars ago (positive momentum).
                                ROC crossing zero from below = momentum turning bullish.
                                Bars where ROC is rising = acceleration. Bars where it's falling = deceleration.
                            </div>
                        </div>
                    )}

                    {/* ── Volume Velocity tab ── */}
                    {tab === 'volume' && (
                        <div style={{ padding:'16px 18px' }}>
                            <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                VOLUME RATIO (daily vol ÷ 20-day avg) — above 1.0 = above average activity
                            </div>
                            <div style={{
                                padding:'14px',
                                backgroundColor:'#0f172a',
                                borderRadius:'10px',
                                marginBottom:'12px',
                            }}>
                                <Sparkline
                                    series={data.volSeries}
                                    color="#f59e0b"
                                    zeroLine={false}
                                    height={80}
                                />
                                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#475569', marginTop:'6px' }}>
                                    <span>{data.volSeries?.[0]?.date}</span>
                                    <span style={{ color:'#f59e0b', fontWeight:'700' }}>
                                        Now: {data.volRatio != null ? `${data.volRatio}× avg` : '—'}
                                    </span>
                                    <span>{data.volSeries?.[data.volSeries.length-1]?.date}</span>
                                </div>
                            </div>

                            {/* Volume context */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
                                {[
                                    { label:'Today\'s Vol',   value: data.currentVolume?.toLocaleString() || '—', color:'#f59e0b' },
                                    { label:'5-day Avg',      value: data.volSma5?.toLocaleString()       || '—', color:'#94a3b8' },
                                    { label:'20-day Avg',     value: data.volSma20?.toLocaleString()      || '—', color:'#94a3b8' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding:'10px 12px', backgroundColor:'#f8fafc',
                                        borderRadius:'8px', border:'1px solid #e2e8f0',
                                        textAlign:'center',
                                    }}>
                                        <div style={{ fontSize:'10px', color:'#94a3b8', fontWeight:'600', marginBottom:'4px' }}>{item.label}</div>
                                        <div style={{ fontSize:'14px', fontWeight:'700', color:item.color }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop:'10px', fontSize:'12px', color:'#64748b', lineHeight:1.6 }}>
                                Volume confirms price moves. A price surge on {data.volRatio >= 1.5 ? 'high' : 'low'} volume like this ({data.volRatio}× average) is {data.volRatio >= 1.5 ? 'more likely to be sustained — real buyers/sellers are participating.' : 'less reliable — could be a false move without conviction behind it.'}
                            </div>
                        </div>
                    )}
                </>
            )}

            <style>{`
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            `}</style>
        </div>
    );
}

// --- Sabrina AI Chatbot Component --------------------------------------------
function SabrinaChat({ stockData, financials, earnings, news, ticker, openaiKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: `Hey! I'm Sabrina 😼 Your AI stock analyst. Search a stock to load live data, or just ask me anything about markets, investing, or finance right now. What's on your mind?`
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [orbPulse, setOrbPulse] = useState(true);
    const [pendingImage, setPendingImage] = useState(null); // { dataUrl, base64, mimeType }
    const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState(() => {
        try { return localStorage.getItem('sabrina_voice') || ''; } catch { return ''; }
    });
    const [showVoicePanel, setShowVoicePanel] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevTickerRef = useRef(null);

    // Load voices -- browsers load them async, need retry + event
    useEffect(() => {
        const load = () => {
            const v = window.speechSynthesis.getVoices();
            if (v.length > 0) {
                setVoices(v);
                setSelectedVoiceName(prev => {
                    if (prev) return prev; // keep persisted choice
                    try { const saved = localStorage.getItem('sabrina_voice'); if (saved) return saved; } catch {}
                    const english = v.find(x => x.lang.startsWith('en') && x.default)
                        || v.find(x => x.lang.startsWith('en'))
                        || v[0];
                    return english?.name || '';
                });
            }
        };

        load(); // try immediately
        window.speechSynthesis.onvoiceschanged = load; // fire when ready

        // Some browsers (Chrome) need a small delay nudge
        const t = setTimeout(load, 200);
        return () => clearTimeout(t);
    }, []);

    // Persist voice choice
    useEffect(() => {
        try { if (selectedVoiceName) localStorage.setItem('sabrina_voice', selectedVoiceName); } catch {}
    }, [selectedVoiceName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Greet when a new ticker loads
    useEffect(() => {
        if (ticker && ticker !== prevTickerRef.current) {
            prevTickerRef.current = ticker;
            setMessages([{
                role: 'assistant',
                content: `**${ticker}** data loaded 😼 I've got price, earnings, financials and news all in front of me. What do you want to know?`
            }]);
        }
    }, [ticker]);

    // Stop speech when chat closes
    useEffect(() => {
        if (!isOpen) { window.speechSynthesis.cancel(); setSpeakingMsgIdx(null); }
    }, [isOpen]);

    const buildSystemPrompt = () => {
        const hasData = !!stockData;
        let context = `You are Sabrina, a sharp, confident AI stock analyst assistant named after Sabrina Pasterski (the physicist). You're knowledgeable, direct, and occasionally witty.`;

        if (!hasData) {
            context += `\n\nIMPORTANT: No stock is currently loaded in the screener. You do NOT have access to live market data right now. You can still answer general finance and investing questions from your training knowledge, but be upfront that you don't have real-time prices or current data unless the user loads a stock first. Don't make up numbers.`;
        } else {
            context += `\n\nCURRENT STOCK DATA for ${stockData.longName || ticker} (${ticker}):
- Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'}
- Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
- P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
- 52-Week High: $${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}
- 52-Week Low: $${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}
- Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
- Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}
- Business: ${stockData.longBusinessSummary?.substring(0, 400) || 'N/A'}`;

            if (earnings?.length > 0) {
                context += `\n\nRECENT QUARTERLY EARNINGS:`;
                earnings.slice(0, 8).forEach(e => {
                    context += `\n- ${e.quarter}: Revenue $${e.revenue ? (e.revenue / 1e9).toFixed(2) + 'B' : 'N/A'}, Earnings $${e.earnings ? (e.earnings / 1e9).toFixed(2) + 'B' : 'N/A'}`;
                });
            }
            if (financials?.data) {
                context += `\n\nANNUAL FINANCIALS:`;
                financials.data.forEach(row => {
                    const vals = row.values?.map((v, i) => `${financials.columns?.[i]}: $${v ? (v / 1e9).toFixed(2) + 'B' : 'N/A'}`).join(', ');
                    context += `\n- ${row.metric}: ${vals}`;
                });
            }
            if (news?.length > 0) {
                context += `\n\nRECENT NEWS:`;
                news.slice(0, 5).forEach(item => {
                    if (item?.title) context += `\n- ${item.title} (${item.publisher || 'Unknown'})`;
                });
            }
        }
        context += `\n\nBe concise but insightful. Use **bold** for key figures. Don't be overly cautious -- give real analysis.`;
        return context;
    };

    const sendMessage = async () => {
        if ((!input.trim() && !pendingImage) || loading) return;
        if (!openaiKey) {
            setMessages(prev => [...prev,
                { role: 'user', content: input, image: pendingImage?.dataUrl },
                { role: 'assistant', content: "Can't reach my brain right now -- OpenAI key not loaded yet. Try again in a sec 😅" }
            ]);
            setInput(''); setPendingImage(null);
            return;
        }

        const userMsg = { role: 'user', content: input, image: pendingImage?.dataUrl };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        const currentImage = pendingImage;
        setInput(''); setPendingImage(null);
        setLoading(true);

        // Build OpenAI messages -- include images where present
        const apiMessages = [
            { role: 'system', content: buildSystemPrompt() },
            ...messages
                .filter(m => m.role !== 'system')
                .map(m => {
                    if (m.image) {
                        return {
                            role: m.role,
                            content: [
                                { type: 'image_url', image_url: { url: m.image } },
                                { type: 'text', text: m.content || '(image attached)' }
                            ]
                        };
                    }
                    return { role: m.role, content: m.content };
                }),
        ];

        // Add the current user message
        if (currentImage) {
            apiMessages.push({
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: currentImage.dataUrl } },
                    { type: 'text', text: currentInput || '(image attached)' }
                ]
            });
        } else {
            apiMessages.push({ role: 'user', content: currentInput });
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
                body: JSON.stringify({ model: 'gpt-4o-mini', messages: apiMessages, max_tokens: 700, temperature: 0.7 })
            });
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || "Hmm, lost my train of thought. Try again?";
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Network hiccup -- give me a sec 😼" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            setPendingImage({ dataUrl, mimeType: file.type });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleSpeak = (text, idx) => {
        if (speakingMsgIdx === idx) {
            window.speechSynthesis.cancel();
            setSpeakingMsgIdx(null);
            return;
        }
        window.speechSynthesis.cancel();
        // Strip markdown for speech
        const plain = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/<[^>]+>/g, '');
        const utt = new SpeechSynthesisUtterance(plain);
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) utt.voice = voice;
        utt.onend = () => setSpeakingMsgIdx(null);
        utt.onerror = () => setSpeakingMsgIdx(null);
        window.speechSynthesis.speak(utt);
        setSpeakingMsgIdx(idx);
    };

    const renderMessage = (text) => text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <>
            {/* -- Orb -- */}
            <div
                onClick={() => { setIsOpen(o => !o); setOrbPulse(false); }}
                title="Chat with Sabrina"
                className="sabrina-orb"
                style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
                    boxShadow: orbPulse ? '0 0 0 0 rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.5)' : '0 8px 32px rgba(124,58,237,0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10000, fontSize: '24px',
                    animation: orbPulse ? 'sabrinaPulse 2s infinite' : 'none',
                    transition: 'transform 0.2s', userSelect: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? 'x' : '😼'}
            </div>

            {/* -- Chat Panel -- */}
            {isOpen && (
                <div className="sabrina-panel" style={{
                    position: 'fixed',
                    // Desktop: anchored bottom-right above orb
                    // Mobile: full screen overlay
                    bottom: 0, right: 0,
                    width: '100vw', height: '100dvh',
                    maxWidth: '430px', maxHeight: 'calc(100dvh - 90px)',
                    // On small screens snap to full bottom sheet
                    borderRadius: window.innerWidth < 480 ? '20px 20px 0 0' : '20px',
                    marginBottom: window.innerWidth < 480 ? 0 : '90px',
                    marginRight: window.innerWidth < 480 ? 0 : '20px',
                    backgroundColor: '#0f0f14',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.3)',
                    display: 'flex', flexDirection: 'column', zIndex: 9999,
                    overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif",
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                        display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
                    }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '19px', flexShrink: 0,
                        }}>😼</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px', lineHeight: 1.2 }}>Sabrina</div>
                            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
                                {ticker ? `Loaded: ${ticker}` : 'No stock loaded -- ask anything'}
                                {' . '}
                                <span style={{ color: '#86efac' }}>o Online</span>
                            </div>
                        </div>
                        {/* Voice settings toggle */}
                        <button
                            onClick={() => setShowVoicePanel(v => !v)}
                            title="Voice settings"
                            style={{
                                background: showVoicePanel ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                                border: 'none', borderRadius: '8px', padding: '6px 8px',
                                color: '#fff', fontSize: '14px', cursor: 'pointer', flexShrink: 0,
                                transition: 'background 0.15s',
                            }}
                        >🔊</button>
                    </div>

                    {/* Voice panel (collapsible) */}
                    {showVoicePanel && (
                        <div style={{
                            padding: '10px 14px',
                            backgroundColor: '#1a1a2e',
                            borderBottom: '1px solid rgba(124,58,237,0.2)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>🔊 Voice</span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
                                    {voices.length > 0 ? `${voices.length} available` : 'Loading...'}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: 'auto' }}>
                                    Click 🔊 on any reply to read it
                                </span>
                            </div>
                            {voices.length > 0 ? (
                                <select
                                    value={selectedVoiceName}
                                    onChange={e => setSelectedVoiceName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '7px 10px',
                                        backgroundColor: '#0f0f14',
                                        border: '1px solid rgba(124,58,237,0.4)',
                                        borderRadius: '8px', color: '#f0f0f0',
                                        fontSize: '12px', outline: 'none', cursor: 'pointer',
                                    }}
                                >
                                    {voices.map((v, i) => (
                                        <option key={i} value={v.name}>
                                            {v.name} -- {v.lang}{v.default ? ' *' : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', padding: '6px 0' }}>
                                    No voices loaded yet -- try clicking the 🔊 button on a message first
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px', alignItems: 'flex-end' }}>
                                {msg.role === 'assistant' && (
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', flexShrink: 0,
                                    }}>😼</div>
                                )}
                                <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {/* Image preview in message */}
                                    {msg.image && (
                                        <img src={msg.image} alt="uploaded" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '10px', objectFit: 'cover' }} />
                                    )}
                                    {msg.content && (
                                        <div style={{
                                            padding: '9px 13px',
                                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            backgroundColor: msg.role === 'user' ? '#7c3aed' : '#1e1e2e',
                                            color: '#f0f0f0', fontSize: '13.5px', lineHeight: '1.5',
                                            border: msg.role === 'assistant' ? '1px solid rgba(124,58,237,0.2)' : 'none',
                                        }}
                                            dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                                        />
                                    )}
                                    {/* Speak button on assistant messages */}
                                    {msg.role === 'assistant' && msg.content && (
                                        <button
                                            onClick={() => handleSpeak(msg.content, idx)}
                                            title={speakingMsgIdx === idx ? 'Stop reading' : 'Read aloud'}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '13px', padding: '2px 6px', borderRadius: '6px',
                                                color: speakingMsgIdx === idx ? '#f59e0b' : 'rgba(255,255,255,0.3)',
                                                transition: 'color 0.15s',
                                                alignSelf: 'flex-start',
                                            }}
                                            onMouseEnter={e => { if (speakingMsgIdx !== idx) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                                            onMouseLeave={e => { if (speakingMsgIdx !== idx) e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                                        >
                                            {speakingMsgIdx === idx ? 'Stop Stop' : '🔊'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>😼</div>
                                <div style={{ padding: '9px 13px', backgroundColor: '#1e1e2e', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#7c3aed', animation: `sabrnaTyping 1.2s ${i * 0.2}s infinite` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Pending image preview */}
                    {pendingImage && (
                        <div style={{
                            padding: '8px 14px',
                            backgroundColor: '#1a1a2e',
                            borderTop: '1px solid rgba(124,58,237,0.15)',
                            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
                        }}>
                            <img src={pendingImage.dataUrl} alt="pending" style={{ height: '48px', width: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', flex: 1 }}>Image ready to send</span>
                            <button onClick={() => setPendingImage(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '16px', cursor: 'pointer' }}>x</button>
                        </div>
                    )}

                    {/* Input bar */}
                    <div style={{
                        padding: '10px 12px',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        backgroundColor: '#0f0f14',
                        display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0,
                    }}>
                        {/* Image upload button */}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach image"
                            style={{
                                background: pendingImage ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(124,58,237,0.3)',
                                borderRadius: '10px', padding: '8px 10px',
                                color: '#ccc', fontSize: '15px', cursor: 'pointer', flexShrink: 0,
                                transition: 'background 0.15s',
                            }}
                        >🖼️</button>

                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={ticker ? `Ask about ${ticker}...` : 'Ask me anything...'}
                            style={{
                                flex: 1, padding: '9px 13px', minWidth: 0,
                                backgroundColor: '#1e1e2e',
                                border: '1px solid rgba(124,58,237,0.3)',
                                borderRadius: '12px', color: '#f0f0f0',
                                fontSize: '13.5px', outline: 'none',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || (!input.trim() && !pendingImage)}
                            style={{
                                padding: '9px 14px', flexShrink: 0,
                                background: loading || (!input.trim() && !pendingImage) ? 'rgba(124,58,237,0.25)' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '16px', cursor: loading || (!input.trim() && !pendingImage) ? 'not-allowed' : 'pointer',
                                transition: 'background 0.15s',
                            }}
                        >^</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes sabrinaPulse {
                    0%   { box-shadow: 0 0 0 0 rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.5); }
                    70%  { box-shadow: 0 0 0 16px rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.3); }
                    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0), 0 8px 32px rgba(124,58,237,0.5); }
                }
                @keyframes sabrnaTyping {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30%           { transform: translateY(-4px); opacity: 1; }
                }
                @media (max-width: 480px) {
                    /* Sabrina chat panel full-screen on mobile */
                    .sabrina-panel {
                        bottom: 0 !important;
                        right: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        max-width: 100vw !important;
                        height: calc(100dvh - 72px) !important;
                        max-height: calc(100dvh - 72px) !important;
                        border-radius: 20px 20px 0 0 !important;
                        margin: 0 !important;
                    }
                    .sabrina-orb {
                        bottom: 16px !important;
                        right: 16px !important;
                        width: 52px !important;
                        height: 52px !important;
                        font-size: 22px !important;
                    }
                }
            `}</style>
        </>
    );
}

// --- AI News Analysis Modal ---------------------------------------------------
function NewsAnalysisModal({ isOpen, onClose, analysis, ticker, onReanalyse, isAnalysing }) {
    if (!isOpen) return null;

    const biasConfig = {
        BULLISH: { color: '#10b981', headerBg: '#f0fdf4', headerBorder: '#bbf7d0', badge: '#10b981', badgeText: '#fff', icon: '📈', label: 'Bullish' },
        BEARISH: { color: '#ef4444', headerBg: '#fef2f2', headerBorder: '#fecaca', badge: '#ef4444', badgeText: '#fff', icon: '📉', label: 'Bearish' },
        NEUTRAL: { color: '#f59e0b', headerBg: '#fffbeb', headerBorder: '#fde68a', badge: '#f59e0b', badgeText: '#fff', icon: '➡️', label: 'Neutral' },
        MIXED:   { color: '#2563eb', headerBg: '#eff6ff', headerBorder: '#bfdbfe', badge: '#2563eb', badgeText: '#fff', icon: '🔀', label: 'Mixed' },
    };

    const cfg = biasConfig[analysis?.bias] || biasConfig.NEUTRAL;

    const renderRich = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/#{1,3} (.*?)(\n|$)/g, '<span style="font-weight:700;font-size:15px;display:block;margin:12px 0 6px;color:#1a1a1a">$1</span>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, padding: '16px',
                backdropFilter: 'blur(3px)',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: 'min(680px, 100%)',
                    maxHeight: '92vh',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    animation: 'modalSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Header */}
                <div style={{
                    backgroundColor: cfg.headerBg,
                    borderBottom: `2px solid ${cfg.headerBorder}`,
                    padding: '24px 24px 20px',
                    flexShrink: 0,
                    position: 'relative',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '13px', color: '#666', fontWeight: '600', letterSpacing: '0.05em' }}>
                                    {analysis?.source === 'external' ? '🤖 External AI Analysis' : '😼 Sabrina\'s Analysis'}
                                </span>
                                <span style={{ fontSize: '11px', color: '#888', backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                                    {ticker}
                                </span>
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', lineHeight: 1.25, marginBottom: '12px' }}>
                                {cfg.icon} News Intelligence Report
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                    backgroundColor: cfg.badge, color: cfg.badgeText,
                                    padding: '5px 14px', borderRadius: '20px',
                                    fontSize: '12px', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase',
                                }}>
                                    {cfg.label} BIAS
                                </span>
                                {analysis?.confidence && (
                                    <span style={{
                                        backgroundColor: '#fff', color: '#555',
                                        padding: '5px 12px', borderRadius: '20px',
                                        fontSize: '12px', fontWeight: '600',
                                        border: '1px solid #e0e0e0',
                                    }}>
                                        {analysis.confidence}% confidence
                                    </span>
                                )}
                                {analysis?.articleCount && (
                                    <span style={{ fontSize: '12px', color: '#999' }}>
                                        . {analysis.articleCount} articles analysed
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
                            width: '34px', height: '34px', color: '#555', fontSize: '18px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
                        >x</button>
                    </div>

                    {/* Confidence bar */}
                    {analysis?.confidence && (
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontWeight: '600', letterSpacing: '0.07em' }}>
                                SIGNAL STRENGTH
                            </div>
                            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: '3px',
                                    width: `${analysis.confidence}%`,
                                    backgroundColor: cfg.color,
                                    transition: 'width 1s ease',
                                }} />
                            </div>
                        </div>
                    )}

                    {analysis?.generatedAt && (
                        <div style={{ marginTop: '10px', fontSize: '11px', color: '#aaa' }}>
                            Generated {analysis.generatedAt}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fff' }}>

                    {analysis?.sourceList?.length > 0 && (
    <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '8px' }}>
            SOURCES READ
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {analysis.sourceList.map((src, i) => (
                <span key={i} style={{
                    backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0',
                    color: '#475569', padding: '3px 10px',
                    borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                }}>
                    {src}
                </span>
            ))}
        </div>
    </div>
)}

                    {/* TL;DR */}
                    {analysis?.tldr && (
                        <div style={{
                            backgroundColor: cfg.headerBg,
                            border: `1px solid ${cfg.headerBorder}`,
                            borderLeft: `4px solid ${cfg.color}`,
                            borderRadius: '10px',
                            padding: '14px 18px',
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: cfg.color, letterSpacing: '0.1em', marginBottom: '6px' }}>TL;DR</div>
                            <div style={{ fontSize: '15px', color: '#1a1a1a', lineHeight: '1.6', fontWeight: '500' }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.tldr) }} />
                        </div>
                    )}

                    {/* Key themes */}
                    {analysis?.themes && analysis.themes.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>KEY THEMES</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {analysis.themes.map((theme, i) => (
                                    <span key={i} style={{
                                        backgroundColor: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        color: '#1d4ed8',
                                        padding: '5px 13px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                    }}>
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full summary */}
                    {analysis?.summary && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>FULL ANALYSIS</div>
                            <div style={{
                                fontSize: '14px', color: '#333', lineHeight: '1.75',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px', padding: '16px 18px',
                                border: '1px solid #e0e0e0',
                            }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.summary) }} />
                        </div>
                    )}

                    {/* Catalysts */}
                    {analysis?.catalysts && analysis.catalysts.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>
                                {analysis.bias === 'BEARISH' ? '!️ RISK CATALYSTS' : '🚀 KEY CATALYSTS'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {analysis.catalysts.map((c, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '10px', padding: '12px 16px',
                                        border: '1px solid #e8e8e8',
                                    }}>
                                        <div style={{
                                            width: '22px', height: '22px', borderRadius: '50%',
                                            backgroundColor: cfg.color + '20',
                                            color: cfg.color, fontSize: '11px', fontWeight: '800',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, marginTop: '1px',
                                        }}>{i + 1}</div>
                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: renderRich(c) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Risks */}
                    {analysis?.risks && analysis.risks.length > 0 && (
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.1em', marginBottom: '10px' }}>!️ WATCH-OUT RISKS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {analysis.risks.map((r, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                                        backgroundColor: '#fef2f2',
                                        borderRadius: '10px', padding: '12px 16px',
                                        border: '1px solid #fecaca',
                                    }}>
                                        <div style={{ color: '#ef4444', fontSize: '16px', flexShrink: 0, marginTop: '1px', fontWeight: '700' }}>v</div>
                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}
                                            dangerouslySetInnerHTML={{ __html: renderRich(r) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sabrina's Take */}
                    {analysis?.recommendation && (
                        <div style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderLeft: '4px solid #2563eb',
                            borderRadius: '10px',
                            padding: '16px 18px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '16px' }}>😼</span>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', letterSpacing: '0.1em' }}>SABRINA'S TAKE</div>
                            </div>
                            <div style={{ fontSize: '15px', color: '#1e3a5f', lineHeight: '1.65', fontStyle: 'italic' }}
                                dangerouslySetInnerHTML={{ __html: renderRich(analysis.recommendation) }} />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    padding: '14px 24px',
                    display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
                    flexShrink: 0,
                }}>
                    <button
                        onClick={onReanalyse}
                        disabled={isAnalysing}
                        style={{
                            padding: '9px 18px',
                            backgroundColor: isAnalysing ? '#93c5fd' : '#2563eb',
                            border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '14px', fontWeight: '600',
                            cursor: isAnalysing ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (!isAnalysing) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                        onMouseLeave={e => { if (!isAnalysing) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                    >
                        {isAnalysing
                            ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Analysing...</>
                            : <><span>🔄</span> Re-ask Sabrina</>}
                    </button>
                    <button onClick={onClose} style={{
                        padding: '9px 18px',
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px', color: '#555',
                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                        transition: 'background 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        Close
                    </button>
                    <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#bbb' }}>
                        Powered by Sabrina x GPT-4o mini
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

// --- News Section Component ---------------------------------------------------
function EnhancedNewsSection({
    ticker, baseUrl, existingNews, openaiKey, stockData,
    hoistedMarketauxNews, setHoistedMarketauxNews,
    hoistedFetchingNews, setHoistedFetchingNews,
    hoistedNewsError, setHoistedNewsError,
    hoistedHasFetched, setHoistedHasFetched,
    hoistedActiveNewsTab, setHoistedActiveNewsTab,
    hoistedCachedAnalyses, setHoistedCachedAnalyses,
    hoistedShowAnalysisModal, setHoistedShowAnalysisModal,
}) {
    // Use hoisted state -- all persists across tab switches
    const marketauxNews    = hoistedMarketauxNews  ?? [];
    const setMarketauxNews = setHoistedMarketauxNews  || useState([])[1];
    const fetchingNews     = hoistedFetchingNews   ?? false;
    const setFetchingNews  = setHoistedFetchingNews  || useState(false)[1];
    const newsError        = hoistedNewsError      ?? null;
    const setNewsError     = setHoistedNewsError    || useState(null)[1];
    const hasFetched       = hoistedHasFetched     ?? false;
    const setHasFetched    = setHoistedHasFetched   || useState(false)[1];
    const activeNewsTab    = hoistedActiveNewsTab  ?? 'yahoo';
    const setActiveNewsTab = setHoistedActiveNewsTab || useState('yahoo')[1];
    const [pendingArticle, setPendingArticle] = useState(null);

    // Analysis states -- use hoisted versions so they survive tab switches
    const showAnalysisModal    = hoistedShowAnalysisModal   ?? false;
    const setShowAnalysisModal = setHoistedShowAnalysisModal || useState(false)[1];
    const cachedAnalyses       = hoistedCachedAnalyses      ?? {};
    const setCachedAnalyses    = setHoistedCachedAnalyses   || useState({})[1];
    const [isAnalysing,    setIsAnalysing]    = useState(false);
    const [analysisError,  setAnalysisError]  = useState(null);
    const [showExternalPasteModal, setShowExternalPasteModal] = useState(false);
    const [showPromptModal,        setShowPromptModal]        = useState(false);
    const [externalPasteText,      setExternalPasteText]      = useState('');
    const [externalParseError,     setExternalParseError]     = useState(null);
    const [copied, setCopied] = useState(false);

    // Load cached analyses from storage on mount (only once)
    useEffect(() => {
        const loadCached = async () => {
            try {
                const result = await window.storage.get('news-analyses');
                if (result?.value) {
                    const parsed = JSON.parse(result.value);
                    setCachedAnalyses(parsed);
                }
            } catch {}
        };
        loadCached();
    }, []);

    const buildExternalPrompt = () => {
            const stockContext = stockData ? `
        Stock: ${stockData.longName || ticker} (${ticker})
        Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}
        Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'} | Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
        P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}
        52W High: $${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'} | 52W Low: $${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}` 
            : `Stock: ${ticker}`;

            return `You are a financial analyst. Search the web for as many recent news articles as possible about ${ticker} (${stockData?.longName || ticker}). Cast a wide net — aim for at least 15-20 articles from diverse sources (Bloomberg, Reuters, WSJ, CNBC, Seeking Alpha, earnings call transcripts, analyst reports, Reddit sentiment, etc).

        ${stockContext}

        After reading all articles, return ONLY a JSON object with no markdown, no backticks, no preamble:

        {
        "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
        "confidence": <integer 0-100>,
        "tldr": "<one punchy sentence — the single most important thing to know right now>",
        "themes": ["<theme1>", "<theme2>", "<theme3>", "<theme4>"],
        "summary": "<4-6 paragraph deep analysis referencing specific articles and sources, use **bold** for key figures and turning points>",
        "catalysts": ["<specific catalyst 1>", "<specific catalyst 2>", "<specific catalyst 3>", "<catalyst 4>"],
        "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
        "recommendation": "<a sharp, opinionated 2-3 sentence take. First person. Be direct.>",
        "articleCount": <number of articles you actually found and read>,
        "sourceList": ["<source1>", "<source2>", "<source3>"]
        }

        Do not include anything outside the JSON object. The response must be parseable by JSON.parse().`;
        };

    const handleExternalPaste = async () => {
        setExternalParseError(null);
        
        if (!externalPasteText.trim()) {
            setExternalParseError('Paste the JSON response first.');
            return;
        }

        let parsed;
        try {
            // Strip accidental code fences a user might have copy-pasted
            const clean = externalPasteText
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .trim();
            parsed = JSON.parse(clean);
        } catch (e) {
            setExternalParseError(
                `Invalid JSON — couldn't parse. Make sure you copied the full response. Error: ${e.message}`
            );
            return;
        }

        // Schema validation — these fields are required for the modal to render
        const required = ['bias', 'confidence', 'tldr', 'summary'];
        const missing  = required.filter(k => parsed[k] == null);
        if (missing.length > 0) {
            setExternalParseError(
                `JSON is missing required fields: ${missing.join(', ')}. ` +
                `Make sure the AI followed the prompt format exactly.`
            );
            return;
        }

        // Normalise bias to uppercase in case the AI lowercased it
        parsed.bias = String(parsed.bias).toUpperCase();
        if (!['BULLISH', 'BEARISH', 'NEUTRAL', 'MIXED'].includes(parsed.bias)) {
            parsed.bias = 'MIXED';
        }

        // Tag it so the modal can show a different source label
        const analysis = {
            ...parsed,
            generatedAt:   new Date().toLocaleString(),
            source:        'external', // used in the modal header below
        };

        await saveAnalysis(analysis); // reuses the exact same save function Sabrina uses
        setShowExternalPasteModal(false);
        setExternalPasteText('');
        setHoistedShowAnalysisModal(true);
    };

    const currentAnalysis = cachedAnalyses[ticker] || null;

    const saveAnalysis = async (newAnalysis) => {
        const updated = { ...cachedAnalyses, [ticker]: newAnalysis };
        setCachedAnalyses(updated);
        try {
            await window.storage.set('news-analyses', JSON.stringify(updated));
        } catch (err) {
            console.error('Storage save failed:', err);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp || timestamp === 'N/A') return 'N/A';
        try {
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return timestamp; }
    };

    const fetchMarketauxNews = async () => {
        if (!ticker) return;
        setFetchingNews(true);
        setNewsError(null);
        try {
            const response = await fetch(`${baseUrl}/fetch_news_data_api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assets: [ticker], user_email: 'screener@snowai.app' })
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            setMarketauxNews(data.message || []);
            setHasFetched(true);
            setActiveNewsTab('marketaux');
        } catch (err) {
            setNewsError(err.message || 'Failed to fetch news. Please try again.');
        } finally {
            setFetchingNews(false);
        }
    };

    const runNewsAnalysis = async () => {
        if (!openaiKey) {
            setAnalysisError("OpenAI key not loaded yet. Try again in a moment.");
            return;
        }

        setIsAnalysing(true);
        setAnalysisError(null);

        // Build article corpus from whatever news is available
        const allArticles = [
            ...(existingNews || []).filter(n => n?.title).map(n => ({
                title: n.title,
                description: n.description || '',
                source: n.publisher || 'Yahoo Finance',
            })),
            ...marketauxNews.filter(n => n?.title).map(n => ({
                title: n.title,
                description: n.description || '',
                highlights: typeof n.highlights === 'string' ? n.highlights : '',
                source: n.source || 'Marketaux',
            })),
        ];

        if (allArticles.length === 0) {
            setAnalysisError("No news articles loaded yet. Fetch some news first, then run analysis.");
            setIsAnalysing(false);
            return;
        }

        const stockContext = stockData ? `
Stock: ${stockData.longName || ticker} (${ticker})
Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}
Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'} | Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
P/E Ratio: ${stockData.trailingPE?.toFixed(2) || 'N/A'}` : `Stock: ${ticker}`;

        const articleDump = allArticles.slice(0, 12).map((a, i) =>
            `[${i + 1}] "${a.title}" -- ${a.source}\n${a.description || ''}${a.highlights ? '\nHighlight: ' + a.highlights : ''}`
        ).join('\n\n');

        const prompt = `You are Sabrina, a sharp AI stock analyst. Analyse these ${allArticles.length} news articles for ${ticker} and return a JSON object ONLY (no markdown, no backticks).

${stockContext}

NEWS ARTICLES:
${articleDump}

Return this exact JSON structure:
{
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "tldr": "<one punchy sentence summary>",
  "themes": ["<theme1>", "<theme2>", "<theme3>"],
  "summary": "<3-5 paragraph analysis using the news, referencing specific articles, with markdown bold for key points>",
  "catalysts": ["<catalyst 1>", "<catalyst 2>", "<catalyst 3>"],
  "risks": ["<risk 1>", "<risk 2>"],
  "recommendation": "<Sabrina's personal take in 2-3 sentences, direct and opinionated, first-person voice>"
}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1200,
                    temperature: 0.6,
                })
            });

            const data = await response.json();
            const raw = data.choices?.[0]?.message?.content || '';

            let parsed;
            try {
                // strip any accidental code fences
                const clean = raw.replace(/```json|```/g, '').trim();
                parsed = JSON.parse(clean);
            } catch {
                throw new Error("Sabrina returned unexpected format. Try again.");
            }

            const analysis = {
                ...parsed,
                generatedAt: new Date().toLocaleString(),
                articleCount: allArticles.length,
            };

            await saveAnalysis(analysis);
            setShowAnalysisModal(true);
        } catch (err) {
            setAnalysisError(err.message || 'Analysis failed. Try again.');
        } finally {
            setIsAnalysing(false);
        }
    };

    const getSentimentColor = (title) => {
        const lower = title?.toLowerCase() || '';
        if (['surge', 'rally', 'gain', 'beat', 'soar', 'rise', 'jump', 'up', 'high', 'record', 'profit', 'growth'].some(w => lower.includes(w)))
            return { dot: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' };
        if (['fall', 'drop', 'decline', 'miss', 'loss', 'down', 'low', 'crash', 'risk', 'warn', 'cut', 'layoff'].some(w => lower.includes(w)))
            return { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' };
        return { dot: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' };
    };

    const biasColors = { BULLISH: '#10b981', BEARISH: '#ef4444', NEUTRAL: '#f59e0b', MIXED: '#6366f1' };
    const biasIcons  = { BULLISH: '📈', BEARISH: '📉', NEUTRAL: '➡️', MIXED: '🔀' };
    const totalArticles = (existingNews?.filter(n => n?.title)?.length || 0) + marketauxNews.length;

    return (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>

            {/* -- Top bar: tabs + AI button -- */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {/* Yahoo tab */}
                <button onClick={() => setActiveNewsTab('yahoo')} style={{
                    padding: '8px 18px', borderRadius: '20px', border: '2px solid',
                    borderColor: activeNewsTab === 'yahoo' ? '#2563eb' : '#e0e0e0',
                    backgroundColor: activeNewsTab === 'yahoo' ? '#2563eb' : '#fff',
                    color: activeNewsTab === 'yahoo' ? '#fff' : '#666',
                    fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                    📰 Yahoo Finance ({existingNews?.filter(n => n?.title)?.length || 0})
                </button>

                {/* Marketaux tab */}
                <button
                    onClick={hasFetched ? () => setActiveNewsTab('marketaux') : fetchMarketauxNews}
                    disabled={fetchingNews}
                    style={{
                        padding: '8px 18px', borderRadius: '20px', border: '2px solid',
                        borderColor: activeNewsTab === 'marketaux' && hasFetched ? '#8b5cf6' : 'rgba(139,92,246,0.5)',
                        backgroundColor: activeNewsTab === 'marketaux' && hasFetched ? '#8b5cf6' : fetchingNews ? 'rgba(139,92,246,0.15)' : '#fff',
                        color: activeNewsTab === 'marketaux' && hasFetched ? '#fff' : '#8b5cf6',
                        fontWeight: '600', fontSize: '14px', cursor: fetchingNews ? 'wait' : 'pointer',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                >
                    {fetchingNews
                        ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>Fetching...</>
                        : hasFetched ? `🔮 Marketaux (${marketauxNews.length})` : '🔮 Fetch Deep News'}
                </button>

                {hasFetched && (
                    <button onClick={fetchMarketauxNews} disabled={fetchingNews} style={{
                        padding: '8px 14px', borderRadius: '20px', border: '2px solid #e0e0e0',
                        backgroundColor: '#fff', color: '#999', fontSize: '13px', cursor: 'pointer',
                    }}>🔄 Refresh</button>
                )}

                {/* Divider */}
                <div style={{ width: '1px', height: '28px', backgroundColor: '#e0e0e0', flexShrink: 0, display: totalArticles > 0 ? 'block' : 'none' }} />

                {/* AI Analyse button */}
                {totalArticles > 0 && (
                    <button
                        onClick={currentAnalysis ? () => setShowAnalysisModal(true) : runNewsAnalysis}
                        disabled={isAnalysing}
                        style={{
                            padding: '8px 18px', borderRadius: '20px',
                            border: '2px solid',
                            borderColor: currentAnalysis ? biasColors[currentAnalysis.bias] || '#db2777' : 'rgba(219,39,119,0.5)',
                            background: currentAnalysis
                                ? `linear-gradient(135deg, ${biasColors[currentAnalysis.bias]}22, ${biasColors[currentAnalysis.bias]}11)`
                                : isAnalysing ? 'rgba(219,39,119,0.1)' : '#fff',
                            color: currentAnalysis ? biasColors[currentAnalysis.bias] : '#db2777',
                            fontWeight: '700', fontSize: '14px',
                            cursor: isAnalysing ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (!isAnalysing) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        {isAnalysing ? (
                            <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>Analysing...</>
                        ) : currentAnalysis ? (
                            <>{biasIcons[currentAnalysis.bias]} View Analysis ({currentAnalysis.bias})</>
                        ) : (
                            <>😼 Ask Sabrina to Analyse</>
                        )}
                    </button>
                )}

                <button
                    onClick={() => setShowPromptModal(true)}
                    style={{
                        padding: '8px 16px', borderRadius: '20px',
                        border: '2px solid rgba(99,102,241,0.5)',
                        backgroundColor: '#fff',
                        color: '#6366f1',
                        fontWeight: '700', fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '7px',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.backgroundColor = '#eef2ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = '#fff'; }}
                >
                    🤖 Ask External AI
                </button>

                {/* Re-run option if cached analysis exists */}
                {currentAnalysis && (
                    <button
                        onClick={runNewsAnalysis}
                        disabled={isAnalysing}
                        style={{
                            padding: '8px 14px', borderRadius: '20px',
                            border: '2px solid #e0e0e0', backgroundColor: '#fff',
                            color: '#999', fontSize: '13px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                        }}
                        title="Re-run analysis with latest news"
                    >
                        🔄 Re-ask
                    </button>
                )}
            </div>

            {/* Cached analysis preview strip */}
            {currentAnalysis && !showAnalysisModal && (
                <div
                    onClick={() => setShowAnalysisModal(true)}
                    style={{
                        marginBottom: '16px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${biasColors[currentAnalysis.bias]}18, ${biasColors[currentAnalysis.bias]}08)`,
                        border: `1px solid ${biasColors[currentAnalysis.bias]}35`,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                        transition: 'box-shadow 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${biasColors[currentAnalysis.bias]}25`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                    <span style={{ fontSize: '20px' }}>{biasIcons[currentAnalysis.bias]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: biasColors[currentAnalysis.bias], marginBottom: '2px' }}>
                            😼 Sabrina's Analysis -- {currentAnalysis.bias} . {currentAnalysis.confidence}% confidence
                        </div>
                        <div style={{ fontSize: '13px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentAnalysis.tldr}
                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', flexShrink: 0 }}>Tap to expand Go</div>
                </div>
            )}

            {/* Error states */}
            {(newsError || analysisError) && (
                <div style={{
                    padding: '14px 18px', backgroundColor: '#fef2f2', borderRadius: '10px',
                    border: '1px solid #fecaca', color: '#b91c1c', marginBottom: '16px',
                    fontSize: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>!️</span>
                    <div><strong>{newsError ? "Couldn't load news:" : "Analysis error:"}</strong> {newsError || analysisError}</div>
                </div>
            )}

            {/* Yahoo Finance News */}
            {activeNewsTab === 'yahoo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {existingNews && existingNews.filter(n => n?.title).length > 0 ? (
                        existingNews.filter(n => n?.title).map((item, idx) => {
                            const sentiment = getSentimentColor(item.title);
                            return (
                                <div key={idx} onClick={() => item.link && setPendingArticle({ title: item.title, publisher: item.publisher, url: item.link })}
                                    style={{
                                        padding: '16px 18px', backgroundColor: sentiment.bg,
                                        borderRadius: '12px', border: `1px solid ${sentiment.border}`,
                                        cursor: item.link ? 'pointer' : 'default',
                                        transition: 'transform 0.15s, box-shadow 0.15s',
                                        display: 'flex', gap: '14px', alignItems: 'flex-start',
                                    }}
                                    onMouseEnter={e => { if (item.link) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: sentiment.dot, marginTop: '5px', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '6px', wordBreak: 'break-word' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            {item.publisher && <span style={{ backgroundColor: '#fff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e0e0e0', fontWeight: '500' }}>{item.publisher}</span>}
                                            <span>{formatDate(item.providerPublishTime)}</span>
                                            {item.link && <span style={{ color: '#2563eb' }}>Go Read more</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyNewsState message="No Yahoo Finance news available for this stock." />
                    )}
                </div>
            )}

            {/* Marketaux News */}
            {activeNewsTab === 'marketaux' && hasFetched && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {marketauxNews.length > 0 ? (
                        marketauxNews.map((item, idx) => {
                            const sentiment = getSentimentColor(item.title);
                            return (
                                <div key={idx} onClick={() => item.url && setPendingArticle({ title: item.title, source: item.source, url: item.url })}
                                    style={{
                                        padding: '18px 20px', backgroundColor: sentiment.bg,
                                        borderRadius: '14px', border: `1px solid ${sentiment.border}`,
                                        cursor: item.url ? 'pointer' : 'default', transition: 'transform 0.15s, box-shadow 0.15s',
                                    }}
                                    onMouseEnter={e => { if (item.url) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: '#8b5cf6', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>MARKETAUX</span>
                                        {item.source && <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>via {item.source}</span>}
                                        <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sentiment.dot, flexShrink: 0 }} />
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '10px' }}>{item.title}</div>
                                    {item.description && (
                                        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
                                            {item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description}
                                        </div>
                                    )}
                                    {(() => {
                                        // Debug: log raw highlights to console so we can see exact format
                                        // Backend debug: open browser console to see raw format
                                        if (item.highlights) console.log('[SnowAI highlights raw]', typeof item.highlights, JSON.stringify(item.highlights).substring(0, 300));

                                        const cleanText = (t) => {
                                            if (!t) return '';
                                            return String(t)
                                                .replace(/<[^>]+>/g, '')
                                                .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
                                                .replace(/\\n/g, ' ').replace(/\s+/g, ' ')
                                                .replace(/^[\s,']+|[\s,']+$/g, '')
                                                .trim();
                                        };

                                        const extractHighlight = (raw) => {
                                            if (raw == null) return '';

                                            // JS object with highlight key
                                            if (typeof raw === 'object' && !Array.isArray(raw)) {
                                                return cleanText(raw.highlight || raw.text || raw.content || '');
                                            }

                                            // Array -- grab first item
                                            if (Array.isArray(raw)) {
                                                if (raw.length === 0) return '';
                                                const first = raw[0];
                                                if (typeof first === 'object') return cleanText(first.highlight || first.text || '');
                                                return cleanText(String(first));
                                            }

                                            // String handling
                                            const s = String(raw).trim();

                                            // Pure plain string with no dict artifacts -> use directly
                                            if (!s.includes("'highlight'") && !s.includes('"highlight"') && !/\[\+?\d+ characters\]/.test(s)) {
                                                return cleanText(s);
                                            }

                                            // Python dict repr: {'highlight': 'text with apostrophe\'s here', 'sentiment': 0.5, ...}
                                            // GREEDY match from 'highlight': ' up to the LAST ', 'sentiment' occurrence
                                            // This handles apostrophes inside the text
                                            const pyMatch = s.match(/'highlight'\s*:\s*'([\s\S]*)',\s*'sentiment'/);
                                            if (pyMatch) return cleanText(pyMatch[1]);

                                            // Truncated repr: text[+345 characters] -- extract what came before
                                            const truncMatch = s.match(/^([\s\S]+?)\[\+?\d+ characters\]/);
                                            if (truncMatch) {
                                                // Also strip leading dict key if present: {'highlight': 'ACTUAL TEXT
                                                let extracted = truncMatch[1];
                                                const keyMatch = extracted.match(/'highlight'\s*:\s*'([\s\S]+)/);
                                                if (keyMatch) extracted = keyMatch[1];
                                                return extracted.length > 15 ? cleanText(extracted) : '';
                                            }

                                            // JSON-quoted key: {"highlight": "text"}
                                            try {
                                                const parsed = JSON.parse(s);
                                                return cleanText(parsed.highlight || parsed.text || '');
                                            } catch {}

                                            // Last resort: just clean whatever we have
                                            return cleanText(s);
                                        };

                                        const hlText = extractHighlight(item.highlights);
                                        const display = hlText.length > 280 ? hlText.substring(0, 280) + '...' : hlText;

                                        return display ? (
                                            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '10px 14px', borderLeft: `3px solid ${sentiment.dot}`, marginBottom: '10px' }}>
                                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', marginBottom: '4px', letterSpacing: '0.08em' }}>KEY HIGHLIGHT</div>
                                                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{display}</div>
                                            </div>
                                        ) : null;
                                    })()}
                                    {item.url && <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Go Read full article</div>}
                                </div>
                            );
                        })
                    ) : (
                        <EmptyNewsState message="No Marketaux news found for this ticker. Try a more popular stock." />
                    )}
                </div>
            )}



            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes sessionPulse { 0%,100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 0 5px rgba(16,185,129,0.08); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
                @media (max-width: 768px) {
                    .compare-grid { grid-template-columns: 1fr !important; }
                    .compare-layout-toggle { display: none !important; }
                }
                @keyframes articleModalPop {
                    from { opacity: 0; transform: scale(0.93) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            {/* Article Link Confirm Modal */}
            {pendingArticle && (
                <div
                    onClick={() => setPendingArticle(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10002, padding: '20px',
                        backdropFilter: 'blur(3px)',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: 'min(420px, 100%)',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                            animation: 'articleModalPop 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                    >
                        <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '22px', flexShrink: 0,
                                }}>🔗</div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '3px' }}>
                                        Open external article?
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#888' }}>
                                        {"You'll be taken to "}
                                        <strong style={{ color: '#2563eb' }}>
                                            {(() => { try { return new URL(pendingArticle.url).hostname.replace('www.', ''); } catch { return pendingArticle.url; } })()}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#f8f9fa', borderRadius: '10px',
                                padding: '12px 14px', border: '1px solid #e8e8e8', marginBottom: '20px',
                            }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', marginBottom: '6px' }}>
                                    {pendingArticle.title}
                                </div>
                                {(pendingArticle.publisher || pendingArticle.source) && (
                                    <span style={{
                                        fontSize: '11px', fontWeight: '600', color: '#555',
                                        backgroundColor: '#fff', padding: '2px 8px',
                                        borderRadius: '8px', border: '1px solid #e0e0e0',
                                    }}>
                                        {pendingArticle.publisher || pendingArticle.source}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => { window.open(pendingArticle.url, '_blank'); setPendingArticle(null); }}
                                    style={{
                                        flex: 1, padding: '11px 16px', backgroundColor: '#2563eb',
                                        border: 'none', borderRadius: '10px', color: '#fff',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                                >
                                    <span>Go</span> Yes, open article
                                </button>
                                <button
                                    onClick={() => setPendingArticle(null)}
                                    style={{
                                        flex: 1, padding: '11px 16px', backgroundColor: '#fff',
                                        border: '1px solid #e0e0e0', borderRadius: '10px', color: '#555',
                                        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f4f4f4'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    Stay here
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Modal */}
            <NewsAnalysisModal
                isOpen={showAnalysisModal}
                onClose={() => setShowAnalysisModal(false)}
                analysis={currentAnalysis}
                ticker={ticker}
                onReanalyse={() => { setShowAnalysisModal(false); runNewsAnalysis(); }}
                isAnalysing={isAnalysing}
            />

            {showPromptModal && (
    <div
        onClick={() => setShowPromptModal(false)}
        style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10003, padding: '20px',
            backdropFilter: 'blur(3px)',
        }}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                width: 'min(680px, 100%)',
                maxHeight: '85vh',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                animation: 'modalSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px 24px 16px',
                background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '18px' }}>🤖</span>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                                External AI Prompt — {ticker}
                            </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                            Copy this prompt → paste into any AI below → copy their JSON response → hit "Paste Response"
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPromptModal(false)}
                        style={{
                            background: 'rgba(255,255,255,0.12)', border: 'none',
                            borderRadius: '50%', width: '32px', height: '32px',
                            color: '#fff', fontSize: '17px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >×</button>
                </div>
            </div>

            {/* Prompt text area — scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: '#333',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {buildExternalPrompt()}
                </div>

                {/* Perplexity callout — since it actually searches */}
                <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(32,178,170,0.07)',
                    border: '1px solid rgba(32,178,170,0.25)',
                    borderRadius: '9px',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                    <div style={{ fontSize: '12px', color: '#0f766e', lineHeight: 1.55 }}>
                        <strong>Tip:</strong> Perplexity is the best pick here — it actually searches the web in real time and will pull fresh articles automatically. The others need web browsing enabled to do the same.
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', gap: '12px',
                flexShrink: 0,
                backgroundColor: '#f8fafc',
            }}>
                {/* AI launch buttons */}
                <div>
                    <div style={{
                        fontSize: '10px', fontWeight: '700', color: '#94a3b8',
                        letterSpacing: '0.08em', marginBottom: '8px',
                    }}>
                        OPEN DIRECTLY IN (prompt auto-filled)
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                     {[
                                            {
                                                name: 'Perplexity',
                                                icon: '🔍',
                                                color: '#20b2aa',
                                                bg: 'rgba(32,178,170,0.08)',
                                                border: 'rgba(32,178,170,0.35)',
                                                getUrl: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}`,
                                            },
                                            {
                                                name: 'ChatGPT',
                                                icon: '✦',
                                                color: '#10a37f',
                                                bg: 'rgba(16,163,127,0.08)',
                                                border: 'rgba(16,163,127,0.35)',
                                                getUrl: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`,
                                            },
                                            {
                                                name: 'Gemini',
                                                icon: '✦',
                                                color: '#4285f4',
                                                bg: 'rgba(66,133,244,0.08)',
                                                border: 'rgba(66,133,244,0.35)',
                                                getUrl: (p) => `https://gemini.google.com/app?q=${encodeURIComponent(p)}`,
                                            },
                                            {
                                                name: 'Claude',
                                                icon: '◆',
                                                color: '#cc785c',
                                                bg: 'rgba(204,120,92,0.08)',
                                                border: 'rgba(204,120,92,0.35)',
                                                getUrl: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}`,
                                            },
                                            {
                                                name: 'DeepSeek',
                                                icon: '🐋',
                                                color: '#4d6bfe',
                                                bg: 'rgba(77,107,254,0.08)',
                                                border: 'rgba(77,107,254,0.35)',
                                                // No documented ?q= prefill support — opens the chat; paste manually.
                                                getUrl: () => `https://chat.deepseek.com/`,
                                            },
                                            {
                                                name: 'Qwen',
                                                icon: '✦',
                                                color: '#8b5cf6',
                                                bg: 'rgba(139,92,246,0.08)',
                                                border: 'rgba(139,92,246,0.35)',
                                                // No documented ?q= prefill support — opens the chat; paste manually.
                                                getUrl: () => `https://chat.qwen.ai/`,
                                            },
                            ].map(({ name, icon, color, bg, border, getUrl }) => (       
                            <button
                                key={name}
                                onClick={() => window.open(getUrl(buildExternalPrompt()), '_blank')}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '9px',
                                    border: `1.5px solid ${border}`,
                                    backgroundColor: bg,
                                    color: color,
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    transition: 'all 0.15s',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = `0 4px 12px ${border}`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ fontSize: '15px' }}>{icon}</span>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

                {/* Copy + Paste row */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(buildExternalPrompt());
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                            flex: 1, padding: '10px',
                            background: copied
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                            border: 'none', borderRadius: '9px',
                            color: '#fff', fontWeight: '700', fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '7px',
                            transition: 'background 0.25s',
                        }}
                    >
                        {copied ? (
                            <><span>✓</span> Copied!</>
                        ) : (
                            <><span>📋</span> Copy Prompt</>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setShowPromptModal(false);
                            setShowExternalPasteModal(true);
                        }}
                        style={{
                            flex: 1, padding: '10px',
                            backgroundColor: '#fff',
                            border: '2px solid #2563eb',
                            borderRadius: '9px',
                            color: '#2563eb', fontWeight: '700', fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '7px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                        <span>📥</span> Paste Response
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

            {showExternalPasteModal && (
                <div
                    onClick={() => { setShowExternalPasteModal(false); setExternalParseError(null); }}
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10003, padding: '20px',
                        backdropFilter: 'blur(3px)',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: 'min(640px, 100%)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                            display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '18px 22px 14px',
                            background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                                        📥 Paste AI Response — {ticker}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                                        Paste the raw JSON the AI returned. It will be validated before saving.
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowExternalPasteModal(false); setExternalParseError(null); }}
                                    style={{
                                        background: 'rgba(255,255,255,0.15)', border: 'none',
                                        borderRadius: '50%', width: '32px', height: '32px',
                                        color: '#fff', fontSize: '17px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >×</button>
                            </div>
                        </div>

                        {/* Textarea */}
                        <div style={{ padding: '20px 22px 0' }}>
                            <textarea
                                autoFocus
                                value={externalPasteText}
                                onChange={e => { setExternalPasteText(e.target.value); setExternalParseError(null); }}
                                placeholder={`Paste the JSON here. Should start with {\n  "bias": "BULLISH",\n  "confidence": 82,\n  ...\n}`}
                                style={{
                                    width: '100%',
                                    height: '260px',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: `2px solid ${externalParseError ? '#ef4444' : '#e2e8f0'}`,
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    lineHeight: 1.6,
                                    resize: 'vertical',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    color: '#1a1a1a',
                                    backgroundColor: externalParseError ? '#fef2f2' : '#f8fafc',
                                    transition: 'border-color 0.15s, background-color 0.15s',
                                }}
                            />

                            {externalParseError && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '10px 14px',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#b91c1c',
                                    lineHeight: 1.5,
                                }}>
                                    ⚠️ {externalParseError}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 22px',
                            display: 'flex', gap: '10px',
                            backgroundColor: '#fff',
                        }}>
                            <button
                                onClick={handleExternalPaste}
                                disabled={!externalPasteText.trim()}
                                style={{
                                    flex: 1, padding: '11px',
                                    background: !externalPasteText.trim()
                                        ? 'rgba(124,58,237,0.3)'
                                        : 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                                    border: 'none', borderRadius: '9px',
                                    color: '#fff', fontWeight: '700', fontSize: '14px',
                                    cursor: !externalPasteText.trim() ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.15s',
                                }}
                            >
                                ✓ Parse & Display
                            </button>
                            <button
                                onClick={() => {
                                    setShowExternalPasteModal(false);
                                    setShowPromptModal(true);
                                    setExternalParseError(null);
                                }}
                                style={{
                                    padding: '11px 16px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0', borderRadius: '9px',
                                    color: '#64748b', fontWeight: '600', fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                ← Back to prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EmptyNewsState({ message }) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #e0e0e0',
        }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div style={{ color: '#666', fontSize: '15px' }}>{message}</div>
        </div>
    );
}

// --- Earnings Calendar Component ----------------------------------------------
function EarningsCalendar({ onSelectTicker, openaiKey }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [earnings,      setEarnings]      = React.useState([]);
    const [loading,       setLoading]       = React.useState(false);
    const [error,         setError]         = React.useState(null);
    const [currentMonth,  setCurrentMonth]  = React.useState(() => new Date());
    const [selectedDay,   setSelectedDay]   = React.useState(null);
    const [showModal,     setShowModal]     = React.useState(false);
    const [hoveredCell,      setHoveredCell]      = React.useState(null);
    const [reactionData,     setReactionData]     = React.useState(null);
    const [reactionLoading,  setReactionLoading]  = React.useState(false);
    const [reactionTicker,   setReactionTicker]   = React.useState(null);
    const [bulkReaction,     setBulkReaction]     = React.useState(null);
    const [bulkLoading,      setBulkLoading]      = React.useState(false);
    const [showBulk,         setShowBulk]         = React.useState(false);
    const [modalEarnings, setModalEarnings] = React.useState([]);
    const [search,        setSearch]        = React.useState('');
    const [sectorFilter,  setSectorFilter]  = React.useState('All');
    const [sortBy,        setSortBy]        = React.useState('date');

    const [selectedEarningsStock, setSelectedEarningsStock] = useState(null);
    const [stockReaction,         setStockReaction]         = useState(null);
    const [reactionLoading2,      setReactionLoading2]      = useState(false);

    const [searchTicker,    setSearchTicker]    = React.useState('');
    const [searchResults,   setSearchResults]   = React.useState(null);
    const [searchLoading,   setSearchLoading]   = React.useState(false);
    const [searchError,     setSearchError]     = React.useState(null);
    const [showSearchPanel, setShowSearchPanel] = React.useState(false);

    const [previewTicker, setPreviewTicker] = React.useState(null);

    // Fetch all earnings on mount + month change
    React.useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        setLoading(true); setError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_calendar_vault/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickers: ALL_CALENDAR_TICKERS }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setEarnings(json.results || []);
        } catch(e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // -- Calendar helpers (no date-fns needed -- pure JS) ----------------------
    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().slice(0, 10);

    // Build date -> earnings map
    const byDate = {};
    earnings.forEach(e => {
        const d = e.earningsDate?.slice(0, 10);
        if (!d) return;
        if (!byDate[d]) byDate[d] = [];
        byDate[d].push(e);
    });

    // Top 5 per day by market cap
    const top5 = (date) => {
        const list = byDate[date] || [];
        return [...list].sort((a, b) => (b.marketCap||0) - (a.marketCap||0)).slice(0, 5);
    };

    const openDay = (dateStr) => {
        const all = byDate[dateStr] || [];
        setSelectedDay(dateStr);
        setModalEarnings(all);
        setSearch(''); setSectorFilter('All');
        setShowModal(true);
    };

    // -- Filter + sort for modal -----------------------------------------------
    const sectors = ['All', ...new Set(Object.values(SECTOR_MAP))].sort();
    const filtered = modalEarnings.filter(e => {
        const matchSearch = !search || e.ticker.includes(search.toUpperCase()) || (e.name||'').toUpperCase().includes(search.toUpperCase());
        const matchSector = sectorFilter === 'All' || SECTOR_MAP[e.ticker] === sectorFilter;
        return matchSearch && matchSector;
    }).sort((a, b) => {
        if (sortBy === 'marketcap') return (b.marketCap||0) - (a.marketCap||0);
        if (sortBy === 'sector') return (SECTOR_MAP[a.ticker]||'').localeCompare(SECTOR_MAP[b.ticker]||'');
        return (a.earningsDate||'').localeCompare(b.earningsDate||'');
    });

    function SabrinaEarningsPreview({ ticker, openaiKey, onClose }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [step,     setStep]     = React.useState('idle'); // idle|fetching|thinking|done|error
    const [rawData,  setRawData]  = React.useState(null);
    const [preview,  setPreview]  = React.useState(null);
    const [error,    setError]    = React.useState(null);

    React.useEffect(() => { run(); }, [ticker]);

    const run = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setScannerError(null);
    if (forceRefresh) {
        setExpandedRow(null);
        setChartTicker(null);
        setSearch('');
    }
    try {
        const res  = await fetch(`${BACKEND}/api/snowai_trend_reversal_scanner_vault/`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                tickers:      tickersToScan,
                minMarketCap: CAP_OPTIONS[minCap],
                topN:         30,
                forceRefresh, // true = kick off a fresh background scan
            }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Server ${res.status}`);

        setResults(json);
        setScannedAt(json.scannedAt);
        setScannerError(json.lastError || null);
        setIsBackgroundRunning(!!json.isRunning);

        // If a fresh scan just kicked off, start polling for it to finish
        if (json.isRunning && !pollRef.current) {
            pollRef.current = setInterval(async () => {
                try {
                    const pRes  = await fetch(`${BACKEND}/api/snowai_trend_reversal_scanner_vault/`, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({
                            tickers:      tickersToScan,
                            minMarketCap: CAP_OPTIONS[minCap],
                            topN:         30,
                            forceRefresh: false, // just checking cache, not re-triggering
                        }),
                    });
                    const pJson = await pRes.json();
                    setResults(pJson);
                    setScannedAt(pJson.scannedAt);
                    setScannerError(pJson.lastError || null);
                    setIsBackgroundRunning(!!pJson.isRunning);

                    if (!pJson.isRunning) {
                        clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                } catch (e) {
                    console.error('[Scanner poll]', e);
                }
            }, 5000); // poll every 5s
        }
    } catch (e) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
};

// Load cached results instantly when the modal opens — no forceRefresh
React.useEffect(() => {
    if (isOpen && !results) {
        run(false);
    }
    return () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
}, [isOpen]);

React.useEffect(() => {
        if (isOpen && !results) {
            run(false);
        }
        return () => {
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        };
    }, [isOpen]);

    const forceResetScan = async () => {
        setResetting(true);
        setScannerError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_trend_reversal_scanner_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    tickers:      tickersToScan,
                    minMarketCap: CAP_OPTIONS[minCap],
                    topN:         30,
                    resetLock:    true,
                }),
            });
            const json = await res.json();
            setResults(json);
            setScannedAt(json.scannedAt);
            setScannerError(json.lastError || null);
            setIsBackgroundRunning(!!json.isRunning);
            setShowForceReset(false);
            setBackgroundRunningSince(null);

            if (json.isRunning && !pollRef.current) {
                pollRef.current = setInterval(async () => {
                    try {
                        const pRes  = await fetch(`${BACKEND}/api/snowai_trend_reversal_scanner_vault/`, {
                            method:  'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body:    JSON.stringify({
                                tickers:      tickersToScan,
                                minMarketCap: CAP_OPTIONS[minCap],
                                topN:         30,
                                forceRefresh: false,
                            }),
                        });
                        const pJson = await pRes.json();
                        setResults(pJson);
                        setScannedAt(pJson.scannedAt);
                        setScannerError(pJson.lastError || null);
                        setIsBackgroundRunning(!!pJson.isRunning);
                        if (!pJson.isRunning) {
                            clearInterval(pollRef.current);
                            pollRef.current = null;
                        }
                    } catch (e) {
                        console.error('[Scanner poll]', e);
                    }
                }, 5000);
            }
        } catch (e) {
            setScannerError(e.message);
        } finally {
            setResetting(false);
        }
    };


//     const run = async () => {
//         if (!ticker) return;
//         setStep('fetching');
//         setError(null);
//         setPreview(null);

//         // ── Step 1: fetch raw data ──────────────────────────────────────────
//         let data;
//         try {
//             const res  = await fetch(`${BACKEND}/api/snowai_earnings_preview_vault/`, {
//                 method:  'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body:    JSON.stringify({ ticker }),
//             });
//             data = await res.json();
//             if (!res.ok) throw new Error(data.error || `Server ${res.status}`);
//             setRawData(data);
//         } catch (e) {
//             setError(e.message);
//             setStep('error');
//             return;
//         }

//         if (!openaiKey) {
//             // Show data without AI narrative
//             setStep('done');
//             return;
//         }

//         // ── Step 2: ask Sabrina ─────────────────────────────────────────────
//         setStep('thinking');

//         const fmt = (v, prefix = '$') =>
//             v != null ? `${prefix}${typeof v === 'number' ? v.toFixed(2) : v}` : 'N/A';

//         const fmtRev = (v) => {
//             if (!v) return 'N/A';
//             if (v >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
//             if (v >= 1e9)  return `$${(v/1e9).toFixed(2)}B`;
//             if (v >= 1e6)  return `$${(v/1e6).toFixed(0)}M`;
//             return `$${v}`;
//         };

//         const histSummary = (data.historical || []).slice(0, 6).map((q, i) =>
//             `Q-${i+1} (${q.date}): EPS ${fmt(q.epsActual)} vs est ${fmt(q.epsEstimate)} ` +
//             `${q.surprisePct != null ? `(${q.surprisePct >= 0 ? '+' : ''}${q.surprisePct}% surprise)` : ''} ` +
//             `→ ${q.beat === true ? 'BEAT' : q.beat === false ? 'MISS' : 'N/A'}`
//         ).join('\n');

//         const trendSummary = (data.earningsTrend || []).slice(0, 2).map(t =>
//             `${t.period}: EPS est $${t.epsAvg?.toFixed(2) || 'N/A'} ` +
//             `(was $${t.eps30dAgo?.toFixed(2) || 'N/A'} 30d ago, $${t.eps90dAgo?.toFixed(2) || 'N/A'} 90d ago) ` +
//             `growth: ${t.growth != null ? (t.growth * 100).toFixed(1) + '%' : 'N/A'}`
//         ).join('\n');

//         const prompt = `You are Sabrina, a sharp AI stock analyst. Generate a comprehensive earnings preview report for ${ticker}.

// STOCK CONTEXT:
// Name: ${data.stockInfo?.name}
// Price: ${fmt(data.stockInfo?.currentPrice)} | Market Cap: ${data.stockInfo?.marketCap ? fmtRev(data.stockInfo.marketCap) : 'N/A'}
// Sector: ${data.stockInfo?.sector} | Industry: ${data.stockInfo?.industry}
// P/E: ${data.stockInfo?.trailingPE?.toFixed(1) || 'N/A'} | Fwd P/E: ${data.stockInfo?.forwardPE?.toFixed(1) || 'N/A'}
// Beta: ${data.stockInfo?.beta?.toFixed(2) || 'N/A'} | Short Ratio: ${data.stockInfo?.shortRatio?.toFixed(1) || 'N/A'}
// 52W High: ${fmt(data.stockInfo?.fiftyTwoWeekHigh)} | 52W Low: ${fmt(data.stockInfo?.fiftyTwoWeekLow)}

// UPCOMING EARNINGS:
// Date: ${data.upcomingDate || 'Unknown'} (${data.daysUntil != null ? data.daysUntil + ' days away' : 'N/A'})
// EPS Estimate: ${fmt(data.epsEstimate)}
// Revenue Estimate: ${fmtRev(data.revenueEstimate)}

// ESTIMATE REVISIONS (bullish if trending UP):
// ${trendSummary || 'No revision data available'}

// OPTIONS / MARKET POSITIONING:
// Implied Move: ±${data.impliedMove || 'N/A'}% (what options market expects)
// ATM IV: ${data.atmIV || 'N/A'}%
// Historical Avg Move on Earnings Day: ±${data.avgHistMove || 'N/A'}%
// ${data.impliedMove && data.avgHistMove
//     ? `Options are ${data.impliedMove > data.avgHistMove ? 'EXPENSIVE' : 'CHEAP'} vs history`
//     : ''}

// HISTORICAL BEAT RATE:
// Beat Rate: ${data.beatRate || 'N/A'}% (${data.beatCount}B / ${data.missCount}M over ${data.totalQuarters}Q)
// Avg EPS Surprise: ${data.avgSurprise != null ? (data.avgSurprise >= 0 ? '+' : '') + data.avgSurprise + '%' : 'N/A'}

// LAST 6 QUARTERS:
// ${histSummary || 'No historical data'}

// Return ONLY a JSON object (no markdown, no backticks):
// {
//   "verdict": "BEAT_LIKELY" | "MISS_LIKELY" | "IN_LINE" | "HIGH_UNCERTAINTY",
//   "confidence": <0-100>,
//   "tldr": "<one punchy sentence — the single most important thing to know>",
//   "impliedMoveVerdict": "<are options cheap or expensive vs history — 1 sentence>",
//   "estimateRevisionSignal": "<are estimates going up or down lately — 1 sentence>",
//   "beatPatternSignal": "<what does beat history tell us — 1 sentence>",
//   "keyThings": ["<thing to watch 1>", "<thing to watch 2>", "<thing to watch 3>"],
//   "bullCase": "<why they beat and stock pops — 2 sentences>",
//   "bearCase": "<why they miss and stock drops — 2 sentences>",
//   "optionsPlay": "<how to think about positioning given the IV vs history data — 1-2 sentences>",
//   "sabrinaQuote": "<Sabrina's personal punchy take in 1 sentence, first person, with personality>"
// }`;

//         try {
//             const res  = await fetch('https://api.openai.com/v1/chat/completions', {
//                 method:  'POST',
//                 headers: {
//                     'Content-Type':  'application/json',
//                     'Authorization': `Bearer ${openaiKey}`,
//                 },
//                 body: JSON.stringify({
//                     model:       'gpt-4o-mini',
//                     messages:    [{ role: 'user', content: prompt }],
//                     max_tokens:  900,
//                     temperature: 0.65,
//                 }),
//             });
//             const aiData = await res.json();
//             const raw    = aiData.choices?.[0]?.message?.content || '';
//             const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
//             setPreview(parsed);
//         } catch (e) {
//             console.error('[EarningsPreview] AI error:', e);
//             // Still show data panel without narrative
//         }
//         setStep('done');
//     };

    // ── Verdict config ────────────────────────────────────────────────────────
    const VERDICT = {
        BEAT_LIKELY:      { color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'🚀', label:'Beat Likely'      },
        MISS_LIKELY:      { color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'⚠️', label:'Miss Likely'      },
        IN_LINE:          { color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'➡️', label:'In Line Expected'  },
        HIGH_UNCERTAINTY: { color:'#8b5cf6', bg:'#faf5ff', border:'#ddd6fe', icon:'🎲', label:'High Uncertainty'  },
    };

    const fmtRev = (v) => {
        if (!v) return null;
        if (v >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
        if (v >= 1e9)  return `$${(v/1e9).toFixed(2)}B`;
        if (v >= 1e6)  return `$${(v/1e6).toFixed(0)}M`;
        return `$${v}`;
    };

    const vc = VERDICT[preview?.verdict] || VERDICT.HIGH_UNCERTAINTY;

    return (
        <div style={{
            position:  'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex:    10010,
            display:   'flex', alignItems: 'center', justifyContent: 'center',
            padding:   '16px',
            backdropFilter: 'blur(4px)',
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                width:           'min(720px, 100%)',
                maxHeight:       '92vh',
                borderRadius:    '18px',
                overflow:        'hidden',
                display:         'flex',
                flexDirection:   'column',
                backgroundColor: '#fff',
                boxShadow:       '0 24px 80px rgba(0,0,0,0.22)',
                fontFamily:      "'Segoe UI', system-ui, sans-serif",
                animation:       'modalSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
            }}>

                {/* ── Header ──────────────────────────────────────────────── */}
                <div style={{
                    padding:    '20px 24px 16px',
                    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                    flexShrink: 0,
                }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                                <span style={{ fontSize:'22px' }}>😼</span>
                                <span style={{ fontSize:'13px', fontWeight:'700', color:'rgba(255,255,255,0.8)', letterSpacing:'0.06em' }}>
                                    SABRINA'S EARNINGS PREVIEW
                                </span>
                            </div>
                            <div style={{ fontSize:'22px', fontWeight:'800', color:'#fff', lineHeight:1.2 }}>
                                {ticker} — {rawData?.stockInfo?.name || ticker}
                            </div>
                            {rawData?.upcomingDate && (
                                <div style={{ marginTop:'6px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                                    <span style={{
                                        backgroundColor:'rgba(255,255,255,0.15)',
                                        color:'#fff', fontSize:'12px', fontWeight:'700',
                                        padding:'3px 10px', borderRadius:'20px',
                                    }}>
                                        📅 {rawData.upcomingDate}
                                    </span>
                                    {rawData.daysUntil != null && (
                                        <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'12px' }}>
                                            {rawData.daysUntil === 0 ? '🔴 Today!' :
                                             rawData.daysUntil === 1 ? '🟡 Tomorrow' :
                                             `${rawData.daysUntil} days away`}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} style={{
                            background:'rgba(255,255,255,0.15)', border:'none',
                            borderRadius:'50%', width:'34px', height:'34px',
                            color:'#fff', fontSize:'18px', cursor:'pointer',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            flexShrink: 0,
                        }}>×</button>
                    </div>
                </div>

                {/* ── Body ────────────────────────────────────────────────── */}
                <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:'18px', backgroundColor:'#fff' }}>

                    {/* Loading states */}
                    {(step === 'fetching' || step === 'thinking') && (
                        <div style={{ padding:'40px 0', textAlign:'center' }}>
                            <div style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'12px' }}>
                                {step === 'fetching' ? '📡' : '🧠'}
                            </div>
                            <div style={{ fontSize:'15px', fontWeight:'700', color:'#333', marginBottom:'4px' }}>
                                {step === 'fetching' ? 'Gathering earnings data...' : 'Sabrina is thinking...'}
                            </div>
                            <div style={{ fontSize:'12px', color:'#999' }}>
                                {step === 'fetching'
                                    ? 'Pulling estimates, options IV, and beat history'
                                    : 'Synthesising estimates, options pricing, and patterns'}
                            </div>
                            {/* Animated dots */}
                            <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'16px' }}>
                                {[0,1,2].map(i => (
                                    <div key={i} style={{
                                        width:'8px', height:'8px', borderRadius:'50%',
                                        backgroundColor:'#7c3aed',
                                        animation:`sabrnaTyping 1.2s ${i*0.2}s infinite`,
                                    }}/>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div style={{ padding:'20px', backgroundColor:'#fef2f2', borderRadius:'12px', border:'1px solid #fecaca', color:'#b91c1c' }}>
                            <div style={{ fontWeight:'700', marginBottom:'6px' }}>⚠️ Couldn't load preview</div>
                            <div style={{ fontSize:'13px' }}>{error}</div>
                        </div>
                    )}

                    {step === 'done' && rawData && (
                        <>
                            {/* ── Verdict banner ── */}
                            {preview && (
                                <div style={{
                                    backgroundColor: vc.bg,
                                    border:`2px solid ${vc.border}`,
                                    borderLeft:`5px solid ${vc.color}`,
                                    borderRadius:'12px',
                                    padding:'16px 18px',
                                }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px', flexWrap:'wrap' }}>
                                        <span style={{ fontSize:'24px' }}>{vc.icon}</span>
                                        <span style={{ fontSize:'18px', fontWeight:'800', color:vc.color }}>{vc.label}</span>
                                        <span style={{
                                            backgroundColor:vc.color, color:'#fff',
                                            fontSize:'12px', fontWeight:'700',
                                            padding:'3px 10px', borderRadius:'20px',
                                        }}>{preview.confidence}% confidence</span>
                                    </div>
                                    <div style={{ fontSize:'15px', color:'#1a1a1a', fontWeight:'600', lineHeight:1.55, marginBottom:'10px' }}>
                                        {preview.tldr}
                                    </div>
                                    {/* Sabrina quote */}
                                    <div style={{
                                        padding:'10px 14px',
                                        backgroundColor:'rgba(124,58,237,0.06)',
                                        borderLeft:'3px solid #7c3aed',
                                        borderRadius:'6px',
                                        display:'flex', gap:'8px', alignItems:'flex-start',
                                    }}>
                                        <span style={{ fontSize:'16px', flexShrink:0 }}>😼</span>
                                        <div style={{ fontSize:'13px', color:'#4c1d95', fontStyle:'italic', lineHeight:1.55 }}>
                                            "{preview.sabrinaQuote}"
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Key numbers strip ── */}
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'10px' }}>
                                {[
                                    {
                                        label: 'EPS Estimate',
                                        value: rawData.epsEstimate != null ? `$${rawData.epsEstimate}` : 'N/A',
                                        color: '#2563eb',
                                        sub:   'consensus',
                                    },
                                    {
                                        label: 'Rev Estimate',
                                        value: fmtRev(rawData.revenueEstimate) || 'N/A',
                                        color: '#2563eb',
                                        sub:   'consensus',
                                    },
                                    {
                                        label: 'Implied Move',
                                        value: rawData.impliedMove != null ? `±${rawData.impliedMove}%` : 'N/A',
                                        color: '#8b5cf6',
                                        sub:   'options market',
                                    },
                                    {
                                        label: 'Hist Avg Move',
                                        value: rawData.avgHistMove != null ? `±${rawData.avgHistMove}%` : 'N/A',
                                        color: '#64748b',
                                        sub:   `last ${rawData.histMoves?.length || 0} qtrs`,
                                    },
                                    {
                                        label: 'Beat Rate',
                                        value: rawData.beatRate != null ? `${rawData.beatRate}%` : 'N/A',
                                        color: rawData.beatRate >= 70 ? '#10b981' : rawData.beatRate >= 50 ? '#f59e0b' : '#ef4444',
                                        sub:   `${rawData.beatCount}B / ${rawData.missCount}M`,
                                    },
                                    {
                                        label: 'Avg Surprise',
                                        value: rawData.avgSurprise != null ? `${rawData.avgSurprise >= 0 ? '+' : ''}${rawData.avgSurprise}%` : 'N/A',
                                        color: rawData.avgSurprise >= 0 ? '#10b981' : '#ef4444',
                                        sub:   `${rawData.totalQuarters} quarters`,
                                    },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding:'12px 14px',
                                        backgroundColor:'#f8fafc',
                                        borderRadius:'10px',
                                        borderLeft:`3px solid ${item.color}`,
                                    }}>
                                        <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'4px' }}>
                                            {item.label.toUpperCase()}
                                        </div>
                                        <div style={{ fontSize:'18px', fontWeight:'800', color:item.color }}>
                                            {item.value}
                                        </div>
                                        <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'2px' }}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ── Options vs history comparison bar ── */}
                            {rawData.impliedMove != null && rawData.avgHistMove != null && (
                                <div style={{
                                    padding:'14px 16px',
                                    backgroundColor:'#faf5ff',
                                    borderRadius:'10px',
                                    border:'1px solid #ddd6fe',
                                }}>
                                    <div style={{ fontSize:'11px', fontWeight:'700', color:'#7c3aed', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                        OPTIONS PRICING vs HISTORY
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                        {[
                                            { label:`Implied Move (options)`, val:rawData.impliedMove,  color:'#8b5cf6' },
                                            { label:`Hist Avg Move`,          val:rawData.avgHistMove,  color:'#64748b' },
                                        ].map((item, i) => {
                                            const max = Math.max(rawData.impliedMove, rawData.avgHistMove, 1);
                                            return (
                                                <div key={i}>
                                                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'3px' }}>
                                                        <span style={{ color:'#555', fontWeight:'600' }}>{item.label}</span>
                                                        <span style={{ color:item.color, fontWeight:'700' }}>±{item.val}%</span>
                                                    </div>
                                                    <div style={{ height:'6px', backgroundColor:'#ede9fe', borderRadius:'3px', overflow:'hidden' }}>
                                                        <div style={{
                                                            height:'100%',
                                                            width:`${(item.val / max) * 100}%`,
                                                            backgroundColor:item.color,
                                                            borderRadius:'3px',
                                                            transition:'width 0.8s ease',
                                                        }}/>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {preview?.impliedMoveVerdict && (
                                        <div style={{ marginTop:'10px', fontSize:'13px', color:'#5b21b6', fontStyle:'italic' }}>
                                            {preview.impliedMoveVerdict}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── AI signal cards ── */}
                            {preview && (
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'10px' }}>
                                    {[
                                        { label:'📊 ESTIMATE REVISIONS', text:preview.estimateRevisionSignal, borderColor:'#3b82f6' },
                                        { label:'🏆 BEAT PATTERN',        text:preview.beatPatternSignal,       borderColor:'#10b981' },
                                        { label:'🎯 OPTIONS PLAY',         text:preview.optionsPlay,             borderColor:'#8b5cf6' },
                                    ].filter(c => c.text).map((card, i) => (
                                        <div key={i} style={{
                                            padding:'12px 14px',
                                            backgroundColor:'#f8fafc',
                                            borderRadius:'10px',
                                            borderLeft:`3px solid ${card.borderColor}`,
                                        }}>
                                            <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'6px' }}>
                                                {card.label}
                                            </div>
                                            <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55 }}>
                                                {card.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Bull / Bear ── */}
                            {preview && (preview.bullCase || preview.bearCase) && (
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'10px' }}>
                                    {preview.bullCase && (
                                        <div style={{ padding:'12px 14px', backgroundColor:'rgba(16,185,129,0.06)', borderRadius:'10px', border:'1px solid rgba(16,185,129,0.2)' }}>
                                            <div style={{ fontSize:'10px', fontWeight:'700', color:'#10b981', letterSpacing:'0.07em', marginBottom:'6px' }}>🐂 BULL CASE</div>
                                            <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55 }}>{preview.bullCase}</div>
                                        </div>
                                    )}
                                    {preview.bearCase && (
                                        <div style={{ padding:'12px 14px', backgroundColor:'rgba(239,68,68,0.06)', borderRadius:'10px', border:'1px solid rgba(239,68,68,0.18)' }}>
                                            <div style={{ fontSize:'10px', fontWeight:'700', color:'#ef4444', letterSpacing:'0.07em', marginBottom:'6px' }}>🐻 BEAR CASE</div>
                                            <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55 }}>{preview.bearCase}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Things to watch ── */}
                            {preview?.keyThings?.length > 0 && (
                                <div>
                                    <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                        👁 KEY THINGS TO WATCH
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                                        {preview.keyThings.map((item, i) => (
                                            <div key={i} style={{
                                                display:'flex', gap:'10px', alignItems:'flex-start',
                                                padding:'10px 14px',
                                                backgroundColor:'#f8fafc',
                                                borderRadius:'8px',
                                                border:'1px solid #e2e8f0',
                                            }}>
                                                <div style={{
                                                    width:'20px', height:'20px', borderRadius:'50%',
                                                    backgroundColor:'#7c3aed',
                                                    color:'#fff', fontSize:'11px', fontWeight:'800',
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                    flexShrink:0, marginTop:'1px',
                                                }}>{i+1}</div>
                                                <div style={{ fontSize:'13px', color:'#333', lineHeight:1.5 }}>{item}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Historical quarters mini-table ── */}
                            {rawData.historical?.length > 0 && (
                                <div>
                                    <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'10px' }}>
                                        📜 LAST {rawData.historical.length} QUARTERS
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                                        {rawData.historical.map((q, i) => (
                                            <div key={i} style={{
                                                display:'flex', alignItems:'center', gap:'10px',
                                                padding:'8px 12px', borderRadius:'8px',
                                                backgroundColor: q.beat === true ? 'rgba(16,185,129,0.05)' : q.beat === false ? 'rgba(239,68,68,0.05)' : '#f8fafc',
                                                border:`1px solid ${q.beat === true ? 'rgba(16,185,129,0.2)' : q.beat === false ? 'rgba(239,68,68,0.15)' : '#e2e8f0'}`,
                                                flexWrap:'wrap',
                                            }}>
                                                <span style={{ fontSize:'11px', color:'#64748b', minWidth:'75px', fontWeight:'600' }}>
                                                    {q.date}
                                                </span>
                                                <span style={{ fontSize:'12px', fontWeight:'800',
                                                    color: q.beat === true ? '#10b981' : q.beat === false ? '#ef4444' : '#94a3b8' }}>
                                                    {q.epsActual != null ? `$${q.epsActual}` : '—'}
                                                </span>
                                                <span style={{ fontSize:'11px', color:'#94a3b8' }}>
                                                    {q.epsEstimate != null ? `est $${q.epsEstimate}` : ''}
                                                </span>
                                                {q.surprisePct != null && (
                                                    <span style={{
                                                        fontSize:'11px', fontWeight:'700',
                                                        padding:'1px 7px', borderRadius:'10px',
                                                        backgroundColor: q.surprisePct >= 0 ? '#f0fdf4' : '#fef2f2',
                                                        color: q.surprisePct >= 0 ? '#10b981' : '#ef4444',
                                                        border:`1px solid ${q.surprisePct >= 0 ? '#bbf7d0' : '#fecaca'}`,
                                                    }}>
                                                        {q.surprisePct >= 0 ? '+' : ''}{q.surprisePct}%
                                                    </span>
                                                )}
                                                <span style={{ marginLeft:'auto', fontSize:'11px', fontWeight:'800',
                                                    color: q.beat === true ? '#10b981' : q.beat === false ? '#ef4444' : '#94a3b8' }}>
                                                    {q.beat === true ? '✓ Beat' : q.beat === false ? '✗ Miss' : '—'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Re-run */}
                            <button onClick={run} style={{
                                padding:'11px', borderRadius:'10px',
                                background:'linear-gradient(135deg,#7c3aed,#db2777)',
                                color:'#fff', border:'none',
                                fontWeight:'700', fontSize:'14px', cursor:'pointer',
                                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                            }}>
                                🔄 Re-run Preview
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity:0; transform:translateY(24px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1);    }
                }
                @keyframes spin         { from { transform:rotate(0deg);   } to { transform:rotate(360deg); } }
                @keyframes sabrnaTyping { 0%,60%,100% { transform:translateY(0);    opacity:0.4; }
                                          30%          { transform:translateY(-4px); opacity:1;   } }
            `}</style>
        </div>
    );
}

    const fmtCap = (v) => {
        if (!v) return '--';
        if (v >= 1e12) return `$${(v/1e12).toFixed(1)}T`;
        if (v >= 1e9)  return `$${(v/1e9).toFixed(1)}B`;
        if (v >= 1e6)  return `$${(v/1e6).toFixed(0)}M`;
        return `$${v}`;
    };

    const fetchReaction = async (ticker, earningsDate) => {
        setReactionTicker(ticker);
        setReactionLoading(true);
        setReactionData(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_reaction_vault/`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ ticker, earningsDate }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `${res.status}`);
            setReactionData({ ...json, ticker, earningsDate });
        } catch(e) {
            setReactionData({ error: e.message, ticker, earningsDate });
        } finally {
            setReactionLoading(false);
        }
    };

    const searchEarnings = async (sym) => {
        if (!sym?.trim()) return;
        setSearchLoading(true);
        setSearchError(null);
        setSearchResults(null);
        setShowSearchPanel(true);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_search_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ ticker: sym.trim().toUpperCase() }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setSearchResults(json);
        } catch (e) {
            setSearchError(e.message);
        } finally {
            setSearchLoading(false);
        }
    };

    const fetchBulkReaction = async () => {
        const pastItems = earnings
            .filter(e => !e.isUpcoming && e.earningsDate)
            .map(e => ({ ticker: e.ticker, earningsDate: e.earningsDate }))
            .slice(0, 40);
        if (!pastItems.length) return;
        setBulkLoading(true);
        setBulkReaction(null);
        setShowBulk(true);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_reaction_vault/`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ tickers: pastItems }),
            });
            const json = await res.json();
            setBulkReaction(json.results || []);
        } catch(e) {
            setBulkReaction([]);
        } finally {
            setBulkLoading(false);
        }
    };

    const SENTIMENT_CONFIG = {
        strongly_bullish: { label:'Strongly Bullish', icon:'🚀', bg:'#f0fdf4', border:'#10b981', text:'#065f46' },
        bullish:          { label:'Bullish',           icon:'📈', bg:'#f0fdf4', border:'#34d399', text:'#065f46' },
        in_line:          { label:'In Line',           icon:'➡️', bg:'#f8fafc', border:'#94a3b8', text:'#334155' },
        bearish:          { label:'Bearish',           icon:'📉', bg:'#fef2f2', border:'#fca5a5', text:'#9f1239' },
        strongly_bearish: { label:'Strongly Bearish',  icon:'🔻', bg:'#fef2f2', border:'#ef4444', text:'#7f1d1d' },
    };

    const SentimentBadge = ({ e, compact }) => {
        if (!e.isUpcoming || !e.epsSentiment || !(e.pastActuals?.length >= 2)) return null;
        const cfg = SENTIMENT_CONFIG[e.epsSentiment] || SENTIMENT_CONFIG.in_line;
        return (
            <div style={{ marginTop: compact ? '3px' : '6px' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 9px', borderRadius:'12px',
                    backgroundColor:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text, fontSize:'11px', fontWeight:'800' }}>
                    {cfg.icon} {cfg.label}
                    {e.epsVsTrendPct != null && (
                        <span style={{ fontWeight:'500', opacity:0.8, marginLeft:'2px' }}>
                            ({e.epsVsTrendPct >= 0 ? '+' : ''}{e.epsVsTrendPct}% vs trend)
                        </span>
                    )}
                </div>
                {!compact && e.epsTrendAvg != null && (
                    <div style={{ marginTop:'4px', fontSize:'11px', color:'#64748b', lineHeight:'1.6' }}>
                        Est <strong style={{ color:'#1e40af' }}>${e.epsEstimate}</strong> vs {e.pastActuals?.length}Q weighted avg <strong>${e.epsTrendAvg}</strong>
                        {e.pastSurprises?.length > 0 && (
                            <span style={{ marginLeft:'6px', color: (e.pastSurprises.reduce((a,b)=>a+b,0)/e.pastSurprises.length) >= 0 ? '#10b981':'#ef4444' }}>
                                . Avg beat {(e.pastSurprises.reduce((a,b)=>a+b,0)/e.pastSurprises.length).toFixed(1)}%
                            </span>
                        )}
                    </div>
                )}
                {!compact && e.pastActuals?.length >= 2 && (() => {
                    const allVals = [...e.pastActuals, e.epsEstimate || 0];
                    const maxAbs  = Math.max(...allVals.map(Math.abs), 0.01);
                    return (
                        <div style={{ marginTop:'6px' }}>
                            <div style={{ display:'flex', gap:'3px', alignItems:'flex-end', height:'32px' }}>
                                {e.pastActuals.map((v, i) => (
                                    <div key={i} title={`Q-${e.pastActuals.length - i}: $${v}`}
                                        style={{ flex:1, minWidth:'8px', borderRadius:'3px 3px 0 0',
                                            height:`${Math.max(15, (Math.abs(v)/maxAbs)*100)}%`,
                                            backgroundColor: v >= 0 ? '#93c5fd' : '#fca5a5' }} />
                                ))}
                                <div title={`Upcoming est: $${e.epsEstimate}`}
                                    style={{ flex:1, minWidth:'8px', borderRadius:'3px 3px 0 0',
                                        height:`${Math.max(15, (Math.abs(e.epsEstimate||0)/maxAbs)*100)}%`,
                                        backgroundColor:cfg.border, border:`1.5px dashed ${cfg.text}` }} />
                            </div>
                            <div style={{ display:'flex', gap:'3px', marginTop:'2px' }}>
                                {e.pastActuals.map((_, i) => (
                                    <div key={i} style={{ flex:1, fontSize:'8px', color:'#94a3b8', textAlign:'center' }}>
                                        Q-{e.pastActuals.length - i}
                                    </div>
                                ))}
                                <div style={{ flex:1, fontSize:'8px', color:cfg.text, textAlign:'center', fontWeight:'800' }}>Est</div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    const fmtRev = (v) => {
        if (!v) return '--';
        if (Math.abs(v) >= 1e12) return `$${(v/1e12).toFixed(2)}T`;
        if (Math.abs(v) >= 1e9)  return `$${(v/1e9).toFixed(2)}B`;
        if (Math.abs(v) >= 1e6)  return `$${(v/1e6).toFixed(0)}M`;
        return `$${v}`;
    };

    

    const ReactionPanel = ({ data, onClose }) => {
        if (!data) return null;
        if (data.error) return (
            <div style={{ padding:'16px 20px', backgroundColor:'#fef2f2', borderRadius:'10px', border:'1px solid #fecaca', color:'#b91c1c', fontSize:'13px', marginTop:'10px' }}>
                ⚠️ {data.error}
                <button onClick={onClose} style={{ float:'right', background:'none', border:'none', cursor:'pointer', color:'#b91c1c', fontWeight:'700' }}>×</button>
            </div>
        );

        const sp = data.sparkline || [];
        const closes = sp.map(p => p.close).filter(Boolean);
        const minC = Math.min(...closes);
        const maxC = Math.max(...closes);
        const norm = v => maxC > minC ? ((v - minC) / (maxC - minC)) : 0.5;
        const W = 320, H = 80;
        const pts = sp.map((p, i) => `${(i/(sp.length-1||1))*W},${H - norm(p.close)*H}`).join(' ');
        const area = `M0,${H} L${pts.split(' ').map((p,i) => i===0 ? `${p}` : p).join(' L')} L${W},${H} Z`;

        const col = v => !v ? '#94a3b8' : v > 0 ? '#10b981' : '#ef4444';
        const fmt = v => v == null ? '--' : `${v >= 0 ? '+' : ''}${v}%`;
        const earnIdx = sp.findIndex(p => p.dayN === 0);

        return (
            <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden', marginTop:'10px', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
                <div style={{ padding:'12px 16px', background:'linear-gradient(135deg,#1e3a5f,#2563eb)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                        <span style={{ fontSize:'14px', fontWeight:'800', color:'#fff' }}>📊 {data.ticker} -- Post-Earnings Reaction</span>
                        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)', marginTop:'1px' }}>Earnings: {data.earningsDate}</div>
                    </div>
                    <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer', lineHeight:1 }}>×</button>
                </div>

                <div style={{ backgroundColor:'#0f172a', padding:'12px 16px 8px', position:'relative' }}>
                    <svg width="100%" viewBox={`0 0 ${W} ${H+4}`} style={{ display:'block' }}>
                        <defs>
                            <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02"/>
                            </linearGradient>
                        </defs>
                        <path d={`M${area}`} fill="url(#rg)" />
                        <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round"/>
                        {earnIdx >= 0 && (
                            <line
                                x1={(earnIdx/(sp.length-1||1))*W} y1="0"
                                x2={(earnIdx/(sp.length-1||1))*W} y2={H}
                                stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
                        )}
                        {sp.filter(p => [-1,0,1,3,5,10].includes(p.dayN)).map((p, i) => {
                            const xi = sp.indexOf(p);
                            const x  = (xi/(sp.length-1||1))*W;
                            const y  = H - norm(p.close)*H;
                            return <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#3b82f6" strokeWidth="1.5"/>;
                        })}
                    </svg>
                    <div style={{ fontSize:'9px', color:'#f59e0b', textAlign:'center', marginTop:'2px' }}>^ earnings day</div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0', borderTop:'1px solid #f1f5f9' }}>
                    {[
                        { label:'Earn Day', val:data.pctEarnDay },
                        { label:'D+1',      val:data.pctD1 },
                        { label:'D+3',      val:data.pctD3 },
                        { label:'D+5',      val:data.pctD5 },
                        { label:'D+10',     val:data.pctD10 },
                    ].map(({ label, val }, i) => (
                        <div key={i} style={{ padding:'10px 6px', textAlign:'center', borderRight: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                            <div style={{ fontSize:'10px', color:'#94a3b8', fontWeight:'600', marginBottom:'3px' }}>{label}</div>
                            <div style={{ fontSize:'13px', fontWeight:'800', color:col(val) }}>{fmt(val)}</div>
                        </div>
                    ))}
                </div>

                <div style={{ padding:'8px 16px', backgroundColor:'#f8fafc', borderTop:'1px solid #f1f5f9', fontSize:'11px', color:'#64748b' }}>
                    Pre-earnings close: <strong>${data.preClose}</strong> . All % relative to that price
                </div>
            </div>
        );
    };

    const fmtDate = (d) => {
        if (!d) return '--';
        const dt = new Date(d + 'T12:00:00');
        return dt.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
    };

    const isPast    = (d) => d < today;
    const isToday   = (d) => d === today;
    const isThisMonth = (d) => d?.startsWith(`${year}-${String(month+1).padStart(2,'0')}`);

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    return (
        <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", backgroundColor:'#f8fafc', borderRadius:'16px', border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:'24px' }}>
            {/* Header */}
            <div style={{ padding:'20px 24px', background:'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
                <div>
                    <div style={{ fontSize:'18px', fontWeight:'800', color:'#fff' }}>📅 Earnings Calendar</div>
                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>
                        {earnings.length} upcoming reports tracked across {Object.keys(SECTOR_MAP).length} stocks
                    </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth()-1, 1))}
                        style={{ width:'32px', height:'32px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.3)', backgroundColor:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
                    <span style={{ fontSize:'15px', fontWeight:'700', color:'#fff', minWidth:'160px', textAlign:'center' }}>{monthLabel}</span>
                    <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth()+1, 1))}
                        style={{ width:'32px', height:'32px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.3)', backgroundColor:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
                    <button onClick={fetchEarnings} disabled={loading}
                        style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.3)', backgroundColor:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>
                        {loading ? '⏳' : '↻ Refresh'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding:'12px 20px', backgroundColor:'#fef2f2', color:'#ef4444', fontSize:'13px', borderBottom:'1px solid #fecaca' }}>
                    ⚠️ {error} -- <button onClick={fetchEarnings} style={{ background:'none', border:'none', color:'#ef4444', textDecoration:'underline', cursor:'pointer' }}>retry</button>
                </div>
            )}

            {/* ── Earnings Search Bar ─────────────────────────────────────────── */}
            <div style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
            }}>
                <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                    <input
                        type="text"
                        value={searchTicker}
                        onChange={e => setSearchTicker(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && searchEarnings(searchTicker)}
                        placeholder="Search any ticker earnings history... e.g. AAPL"
                        style={{
                            flex: 1, padding: '9px 14px',
                            borderRadius: '9px',
                            border: '2px solid #e2e8f0',
                            fontSize: '14px', fontWeight: '600',
                            outline: 'none', color: '#1a1a1a',
                            backgroundColor: '#fff',
                        }}
                        onFocus={e  => e.target.style.borderColor = '#3b82f6'}
                        onBlur={e   => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button
                        onClick={() => searchEarnings(searchTicker)}
                        disabled={searchLoading || !searchTicker.trim()}
                        style={{
                            padding: '9px 20px', borderRadius: '9px',
                            background: searchLoading ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg,#1e3a5f,#2563eb)',
                            color: '#fff', border: 'none',
                            fontWeight: '700', fontSize: '14px',
                            cursor: searchLoading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {searchLoading
                            ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span> Loading...</>
                            : '🔍 Search'}
                    </button>
                    {showSearchPanel && (
                        <button
                            onClick={() => { setShowSearchPanel(false); setSearchResults(null); setSearchError(null); }}
                            style={{
                                padding: '9px 14px', borderRadius: '9px',
                                backgroundColor: '#fff', border: '1px solid #e2e8f0',
                                color: '#666', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                            }}
                        >✕ Close</button>
                    )}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Search any stock for full earnings history — past & upcoming
                </div>
            </div>

            {/* ── Search Results Panel ────────────────────────────────────────── */}
            {showSearchPanel && (
                <div style={{
                    margin: '0',
                    backgroundColor: '#fff',
                    borderBottom: '2px solid #e2e8f0',
                }}>
                    {searchError && (
                        <div style={{
                            padding: '16px 20px',
                            backgroundColor: '#fef2f2',
                            color: '#b91c1c',
                            fontSize: '14px',
                            display: 'flex', gap: '10px', alignItems: 'center',
                        }}>
                            <span>⚠️</span> {searchError}
                        </div>
                    )}

                    {searchLoading && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontSize: '28px', animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '10px' }}>⏳</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                Fetching full earnings history for {searchTicker}...
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                Pulling up to 10 years of quarterly data
                            </div>
                        </div>
                    )}

                    {searchResults && !searchLoading && (() => {
                        const r        = searchResults;
                        const stats    = r.stats || {};
                        const info     = r.stockInfo || {};
                        const past     = r.past     || [];
                        const upcoming = r.upcoming || [];
                        const trend    = r.epsTrend || [];

                        const beatColor = '#10b981';
                        const missColor = '#ef4444';
                        const neutColor = '#f59e0b';

                        // Mini sparkline dimensions
                        const SW = 200, SH = 48;
                        const epsVals  = trend.map(t => t.eps).filter(v => v != null);
                        const minEPS   = Math.min(...epsVals);
                        const maxEPS   = Math.max(...epsVals);
                        const rangeEPS = maxEPS - minEPS || 1;
                        const normEPS  = v => SH - ((v - minEPS) / rangeEPS) * (SH - 4) - 2;
                        const sparkPts = trend.map((t, i) =>
                            `${(i / Math.max(trend.length - 1, 1)) * SW},${normEPS(t.eps)}`
                        ).join(' ');

                        return (
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* ── Stock header ── */}
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>
                                            {r.ticker} — {info.name || r.ticker}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                                            {info.sector}{info.industry ? ` · ${info.industry}` : ''}
                                            {info.currentPrice ? ` · $${info.currentPrice?.toFixed(2)}` : ''}
                                            {info.pe ? ` · P/E ${info.pe?.toFixed(1)}` : ''}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPreviewTicker(r.ticker)}
                                        style={{
                                            padding:'10px 18px', borderRadius:'10px',
                                            background:'linear-gradient(135deg,#7c3aed,#db2777)',
                                            color:'#fff', border:'none',
                                            fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                            display:'flex', alignItems:'center', gap:'7px',
                                            alignSelf:'flex-start', flexShrink: 0,
                                        }}
                                    >
                                        😼 Sabrina's Earnings Preview
                                    </button>

                                    {/* Beat rate badge */}
                                    {stats.beatRate != null && (
                                        <div style={{
                                            padding: '10px 18px',
                                            borderRadius: '12px',
                                            backgroundColor: stats.beatRate >= 70 ? '#f0fdf4' : stats.beatRate >= 50 ? '#fffbeb' : '#fef2f2',
                                            border: `2px solid ${stats.beatRate >= 70 ? '#10b981' : stats.beatRate >= 50 ? '#f59e0b' : '#ef4444'}`,
                                            textAlign: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <div style={{
                                                fontSize: '24px', fontWeight: '800',
                                                color: stats.beatRate >= 70 ? beatColor : stats.beatRate >= 50 ? neutColor : missColor,
                                            }}>
                                                {stats.beatRate}%
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                                BEAT RATE
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                                                {stats.beatCount}B / {stats.missCount}M / {stats.totalQuarters}Q
                                            </div>
                                        </div>
                                    )}
                                    {stats.avgSurprise != null && (
                                        <div style={{
                                            padding: '10px 18px', borderRadius: '12px',
                                            backgroundColor: stats.avgSurprise >= 0 ? '#f0fdf4' : '#fef2f2',
                                            border: `2px solid ${stats.avgSurprise >= 0 ? '#10b981' : '#ef4444'}`,
                                            textAlign: 'center', flexShrink: 0,
                                        }}>
                                            <div style={{
                                                fontSize: '24px', fontWeight: '800',
                                                color: stats.avgSurprise >= 0 ? beatColor : missColor,
                                            }}>
                                                {stats.avgSurprise >= 0 ? '+' : ''}{stats.avgSurprise}%
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                                AVG SURPRISE
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                                                {stats.totalQuarters} quarters
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── EPS trend sparkline ── */}
                                {trend.length >= 3 && (
                                    <div style={{
                                        padding: '14px 16px',
                                        backgroundColor: '#0f172a',
                                        borderRadius: '12px',
                                        border: '1px solid #1e3a5f',
                                    }}>
                                        <div style={{
                                            fontSize: '11px', fontWeight: '700',
                                            color: '#64748b', letterSpacing: '0.07em',
                                            marginBottom: '10px',
                                        }}>
                                            EPS TREND — LAST {trend.length} QUARTERS
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <svg width="100%" viewBox={`0 0 ${SW} ${SH}`} style={{ flex: 1, maxHeight: `${SH}px` }}>
                                                <defs>
                                                    <linearGradient id={`epsg_${r.ticker}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02"/>
                                                    </linearGradient>
                                                </defs>
                                                {/* Fill area */}
                                                {trend.length > 1 && (
                                                    <path
                                                        d={`M0,${SH} ${trend.map((t, i) =>
                                                            `L${(i / (trend.length - 1)) * SW},${normEPS(t.eps)}`
                                                        ).join(' ')} L${SW},${SH} Z`}
                                                        fill={`url(#epsg_${r.ticker})`}
                                                    />
                                                )}
                                                {/* Line */}
                                                <polyline
                                                    points={sparkPts}
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="1.5"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Beat/miss dots */}
                                                {trend.map((t, i) => {
                                                    const x = (i / Math.max(trend.length - 1, 1)) * SW;
                                                    const y = normEPS(t.eps);
                                                    return (
                                                        <circle
                                                            key={i}
                                                            cx={x} cy={y} r="3"
                                                            fill={t.beat === true ? '#10b981' : t.beat === false ? '#ef4444' : '#f59e0b'}
                                                            stroke="#0f172a"
                                                            strokeWidth="1"
                                                        />
                                                    );
                                                })}
                                            </svg>
                                            {/* Quarter labels below */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                                                {trend.slice(-3).reverse().map((t, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{
                                                            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                                            backgroundColor: t.beat === true ? '#10b981' : t.beat === false ? '#ef4444' : '#f59e0b',
                                                        }}/>
                                                        <span style={{ fontSize: '11px', color: '#64748b' }}>{t.date}</span>
                                                        <span style={{
                                                            fontSize: '11px', fontWeight: '700',
                                                            color: t.beat === true ? '#10b981' : t.beat === false ? '#ef4444' : '#94a3b8',
                                                        }}>${t.eps}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Upcoming earnings ── */}
                                {upcoming.length > 0 && (
                                    <div>
                                        <div style={{
                                            fontSize: '11px', fontWeight: '700', color: '#3b82f6',
                                            letterSpacing: '0.08em', marginBottom: '8px',
                                        }}>
                                            📅 UPCOMING ({upcoming.length})
                                        </div>
                                        {upcoming.map((q, i) => (
                                            <div key={i} style={{
                                                padding: '10px 14px', borderRadius: '10px',
                                                backgroundColor: '#eff6ff',
                                                border: '1px solid #bfdbfe',
                                                marginBottom: '6px',
                                                display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
                                            }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', minWidth: '90px' }}>
                                                    {q.date}
                                                </span>
                                                {q.epsEstimate != null && (
                                                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                                                        EPS est <strong>${q.epsEstimate}</strong>
                                                    </span>
                                                )}
                                                {q.revenueFmt && (
                                                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                                                        Rev est <strong>{q.revenueFmt}</strong>
                                                    </span>
                                                )}
                                                <span style={{
                                                    marginLeft: 'auto', fontSize: '11px', fontWeight: '700',
                                                    backgroundColor: '#dbeafe', color: '#1d4ed8',
                                                    padding: '2px 8px', borderRadius: '10px',
                                                }}>Upcoming</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── Past earnings table ── */}
                                {past.length > 0 && (
                                    <div>
                                        <div style={{
                                            fontSize: '11px', fontWeight: '700', color: '#64748b',
                                            letterSpacing: '0.08em', marginBottom: '8px',
                                        }}>
                                            📊 PAST EARNINGS ({past.length} quarters)
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                                        {['Date', 'EPS Actual', 'EPS Est', 'Surprise', 'Revenue', 'Result'].map(h => (
                                                            <th key={h} style={{
                                                                padding: '8px 12px', textAlign: 'left',
                                                                fontWeight: '700', color: '#64748b',
                                                                borderBottom: '2px solid #e2e8f0',
                                                                whiteSpace: 'nowrap',
                                                            }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {past.map((q, i) => (
                                                        <tr key={i}
                                                            style={{ borderBottom: '1px solid #f1f5f9' }}
                                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                                                        >
                                                            <td style={{ padding: '9px 12px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
                                                                {q.date}
                                                            </td>
                                                            <td style={{ padding: '9px 12px', fontWeight: '800',
                                                                color: q.beat === true ? beatColor : q.beat === false ? missColor : '#94a3b8' }}>
                                                                {q.epsActual != null ? `$${q.epsActual}` : '—'}
                                                            </td>
                                                            <td style={{ padding: '9px 12px', color: '#64748b' }}>
                                                                {q.epsEstimate != null ? `$${q.epsEstimate}` : '—'}
                                                            </td>
                                                            <td style={{ padding: '9px 12px' }}>
                                                                {q.surprisePct != null ? (
                                                                    <span style={{
                                                                        padding: '2px 8px', borderRadius: '10px', fontWeight: '700',
                                                                        fontSize: '12px',
                                                                        backgroundColor: q.surprisePct >= 0 ? '#f0fdf4' : '#fef2f2',
                                                                        color: q.surprisePct >= 0 ? beatColor : missColor,
                                                                        border: `1px solid ${q.surprisePct >= 0 ? '#bbf7d0' : '#fecaca'}`,
                                                                    }}>
                                                                        {q.surprisePct >= 0 ? '+' : ''}{q.surprisePct}%
                                                                    </span>
                                                                ) : '—'}
                                                            </td>
                                                            <td style={{ padding: '9px 12px', color: '#475569' }}>
                                                                {q.revenueFmt || '—'}
                                                            </td>
                                                            <td style={{ padding: '9px 12px' }}>
                                                                {q.beat === true  && <span style={{ fontSize: '12px', fontWeight: '800', color: beatColor }}>✓ Beat</span>}
                                                                {q.beat === false && <span style={{ fontSize: '12px', fontWeight: '800', color: missColor }}>✗ Miss</span>}
                                                                {q.beat === null  && <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {past.length === 0 && upcoming.length === 0 && (
                                    <div style={{
                                        padding: '40px', textAlign: 'center',
                                        backgroundColor: '#f8fafc', borderRadius: '12px',
                                        border: '2px dashed #e2e8f0',
                                    }}>
                                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
                                        <div style={{ color: '#64748b', fontSize: '14px' }}>
                                            No earnings data found for {r.ticker}.
                                            This may be an ETF, index, or newly listed stock.
                                        </div>
                                    </div>
                                )}

                                {/* Open in screener CTA */}
                                <button
                                    onClick={() => { if (onSelectTicker) onSelectTicker(r.ticker); }}
                                    style={{
                                        padding: '12px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg,#1e3a5f,#2563eb)',
                                        color: '#fff', border: 'none',
                                        fontWeight: '700', fontSize: '14px',
                                        cursor: 'pointer', width: '100%',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                    }}
                                >
                                    → Open {r.ticker} in Full Stock Screener
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}

            {loading && !earnings.length && (
                <div style={{ padding:'60px', textAlign:'center', color:'#64748b' }}>
                    <div style={{ fontSize:'28px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'12px' }}>⏳</div>
                    <div style={{ fontSize:'14px' }}>Fetching earnings dates for {ALL_CALENDAR_TICKERS.length} stocks...</div>
                    <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'4px' }}>This takes ~15-30s the first time</div>
                </div>
            )}

            {(!loading || earnings.length > 0) && (
                <div style={{ padding:'0' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid #e2e8f0' }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:'11px', fontWeight:'700', color:'#64748b', letterSpacing:'0.07em', backgroundColor:'#f8fafc' }}>{d}</div>
                        ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} style={{ minHeight:'90px', borderRight:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9', backgroundColor:'#fafbfc' }} />;
                            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                            const top = top5(dateStr);
                            const total = (byDate[dateStr]||[]).length;
                            const isWknd = idx % 7 === 0 || idx % 7 === 6;
                            const past = isPast(dateStr);
                            const todayCell = isToday(dateStr);
                            return (
                                <div key={dateStr}
                                    onClick={() => top.length > 0 && openDay(dateStr)}
                                    style={{
                                        minHeight:'90px', padding:'6px', borderRight:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9',
                                        backgroundColor: todayCell ? '#eff6ff' : isWknd ? '#fafafa' : '#fff',
                                        cursor: top.length > 0 ? 'pointer' : 'default',
                                        position:'relative',
                                        outline: todayCell ? '2px solid #3b82f6' : 'none',
                                        outlineOffset:'-1px',
                                        opacity: past && !todayCell ? 0.6 : 1,
                                        transition:'background 0.1s',
                                    }}
                                    onMouseEnter={e => {
                                        if (top.length > 0) {
                                            e.currentTarget.style.backgroundColor = todayCell ? '#dbeafe' : '#f0f9ff';
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredCell({ dateStr, rect });
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = todayCell ? '#eff6ff' : isWknd ? '#fafafa' : '#fff';
                                        setHoveredCell(null);
                                    }}
                                >
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
                                        <span style={{ fontSize:'12px', fontWeight: todayCell ? '800' : '500', color: todayCell ? '#2563eb' : isWknd ? '#94a3b8' : '#374151' }}>
                                            {day}
                                        </span>
                                        {total > 5 && (
                                            <span style={{ fontSize:'9px', fontWeight:'700', color:'#64748b', backgroundColor:'#e2e8f0', borderRadius:'10px', padding:'1px 5px' }}>
                                                +{total - 5}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                                        {top.map(e => {
                                            const sc = SECTOR_COLORS[SECTOR_MAP[e.ticker]] || { bg:'#f1f5f9', border:'#94a3b8', text:'#334155' };
                                            return (
                                                <div key={e.ticker} style={{ fontSize:'10px', fontWeight:'700', padding:'1px 5px', borderRadius:'4px', backgroundColor:sc.bg, border:`1px solid ${sc.border}40`, color:sc.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%' }}>
                                                    {e.ticker}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hoveredCell && (() => {
                        const dayData = (byDate[hoveredCell.dateStr] || [])
                            .sort((a, b) => (b.marketCap||0) - (a.marketCap||0));
                        if (!dayData.length) return null;
                        const today2 = new Date().toISOString().slice(0, 10);
                        const isPastDay = hoveredCell.dateStr < today2;
                        return (
                            <div style={{
                                position:'fixed',
                                top: Math.min(hoveredCell.rect.bottom + 6, window.innerHeight - 320),
                                left: Math.min(hoveredCell.rect.left, window.innerWidth - 320),
                                width:'300px', zIndex:9800,
                                backgroundColor:'#fff', borderRadius:'12px',
                                boxShadow:'0 8px 40px rgba(0,0,0,0.18)',
                                border:'1px solid #e2e8f0', overflow:'hidden',
                                pointerEvents:'none',
                            }}>
                                <div style={{ padding:'10px 14px', backgroundColor:'#1e3a5f', color:'#fff' }}>
                                    <div style={{ fontSize:'12px', fontWeight:'800' }}>{fmtDate(hoveredCell.dateStr)}</div>
                                    <div style={{ fontSize:'11px', opacity:0.7, marginTop:'2px' }}>{dayData.length} companies reporting</div>
                                </div>
                                <div style={{ maxHeight:'260px', overflowY:'auto' }}>
                                    {dayData.slice(0, 8).map(e => {
                                        const sc = SECTOR_COLORS[SECTOR_MAP[e.ticker]] || { bg:'#f1f5f9', border:'#94a3b8', text:'#334155' };
                                        const beat = e.beat;
                                        const hasPastData = !e.isUpcoming && (e.epsActual != null || e.revenueActual != null);
                                        return (
                                            <div key={e.ticker} style={{ padding:'8px 14px', borderBottom:'1px solid #f1f5f9' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom: hasPastData ? '5px' : 0 }}>
                                                    <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a' }}>{e.ticker}</span>
                                                    <span style={{ fontSize:'10px', padding:'1px 6px', borderRadius:'10px', backgroundColor:sc.bg, color:sc.text, fontWeight:'700', border:`1px solid ${sc.border}40` }}>{SECTOR_MAP[e.ticker]}</span>
                                                    {!e.isUpcoming && beat != null && (
                                                        <span style={{ marginLeft:'auto', fontSize:'10px', fontWeight:'800', padding:'1px 7px', borderRadius:'10px',
                                                            backgroundColor: beat ? '#f0fdf4' : '#fef2f2',
                                                            color: beat ? '#10b981' : '#ef4444',
                                                            border: `1px solid ${beat ? '#bbf7d0' : '#fecaca'}` }}>
                                                            {beat ? '✓ Beat' : '✗ Miss'}
                                                        </span>
                                                    )}
                                                    {e.isUpcoming && (
                                                        <span style={{ marginLeft:'auto', fontSize:'10px', fontWeight:'800', padding:'1px 7px', borderRadius:'10px', backgroundColor:'#eff6ff', color:'#3b82f6', border:'1px solid #bfdbfe' }}>Upcoming</span>
                                                    )}
                                                </div>
                                                {hasPastData && (
                                                    <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                                                        {e.epsActual != null && (
                                                            <div style={{ fontSize:'11px', color:'#475569' }}>
                                                                EPS <strong style={{ color: beat ? '#10b981' : '#ef4444' }}>${e.epsActual}</strong>
                                                                {e.epsEstimate != null && <span style={{ color:'#94a3b8' }}> vs est ${e.epsEstimate}</span>}
                                                                {e.surprisePct != null && (
                                                                    <span style={{ fontWeight:'700', color: e.surprisePct >= 0 ? '#10b981' : '#ef4444', marginLeft:'3px' }}>
                                                                        ({e.surprisePct >= 0 ? '+' : ''}{e.surprisePct}%)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {e.revenueActual != null && (
                                                            <div style={{ fontSize:'11px', color:'#475569' }}>
                                                                Rev <strong style={{ color:'#1e40af' }}>{fmtRev(e.revenueActual)}</strong>
                                                                {e.revenueEstimate != null && <span style={{ color:'#94a3b8' }}> vs est {fmtRev(e.revenueEstimate)}</span>}
                                                            </div>
                                                        )}
                                                        {e.epsEstimate != null && e.epsActual == null && (
                                                            <div style={{ fontSize:'11px', color:'#475569' }}>EPS est <strong style={{ color:'#1e40af' }}>${e.epsEstimate}</strong></div>
                                                        )}

                                                        {!e.isUpcoming && e.historicalQuarters?.length > 0 && (
                                                            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                                                                <div style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.06em', marginBottom: '4px' }}>
                                                                    RECENT QUARTERS
                                                                </div>
                                                                {e.historicalQuarters.slice(0, 3).map((q, qi) => (
                                                                    <div key={qi} style={{ fontSize: '10px', color: '#475569', marginBottom: '2px', display: 'flex', gap: '6px' }}>
                                                                        <span style={{ color: '#94a3b8', minWidth: '70px' }}>{q.date?.slice(0, 7)}</span>
                                                                        {q.epsActual != null && (
                                                                            <span>EPS <strong style={{ color: q.beat ? '#10b981' : '#ef4444' }}>${q.epsActual}</strong></span>
                                                                        )}
                                                                        {q.surprisePct != null && (
                                                                            <span style={{ color: q.surprisePct >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                                                                ({q.surprisePct >= 0 ? '+' : ''}{q.surprisePct}%)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                    </div>
                                                )}
                                                {e.isUpcoming && (
                                                    <div style={{ marginTop:'4px' }}>
                                                        {e.epsEstimate != null && (
                                                            <div style={{ fontSize:'11px', color:'#475569', marginBottom:'3px' }}>
                                                                EPS est <strong style={{ color:'#1e40af' }}>${e.epsEstimate}</strong>
                                                                {e.revenueEstimate != null && <span style={{ color:'#94a3b8' }}> . Rev est {fmtRev(e.revenueEstimate)}</span>}
                                                            </div>
                                                        )}
                                                        <SentimentBadge e={e} compact={false} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ padding:'12px 20px', borderTop:'1px solid #e2e8f0', display:'flex', flexWrap:'wrap', gap:'6px', backgroundColor:'#f8fafc' }}>
                        {Object.entries(SECTOR_COLORS).map(([sector, c]) => (
                            <div key={sector} style={{ display:'flex', alignItems:'center', gap:'4px', padding:'2px 8px', borderRadius:'12px', backgroundColor:c.bg, border:`1px solid ${c.border}40`, fontSize:'10px', fontWeight:'700', color:c.text }}>
                                <div style={{ width:'6px', height:'6px', borderRadius:'50%', backgroundColor:c.border }} />
                                {sector}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Day detail modal */}
            {showModal && (
                <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:9600, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
                    onClick={e => { if (e.target===e.currentTarget) setShowModal(false); }}>
                    <div style={{ backgroundColor:'#fff', borderRadius:'16px', width:'100%', maxWidth:'740px', maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.3)', overflow:'hidden' }}>
                        {/* Modal header */}
                        <div style={{ padding:'18px 24px', background:'linear-gradient(135deg,#1e3a5f,#2563eb)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                            <div>
                                <div style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>📅 {fmtDate(selectedDay)}</div>
                                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>{modalEarnings.length} companies reporting</div>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer', lineHeight:1 }}>×</button>
                        </div>

                        {/* Controls */}
                        <div style={{ padding:'12px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center', flexShrink:0 }}>
                            <input type="text" placeholder="Search ticker or name..."
                                value={search} onChange={e => setSearch(e.target.value)}
                                style={{ flex:1, minWidth:'160px', padding:'7px 12px', borderRadius:'8px', border:'1px solid #e0e0e0', fontSize:'13px', outline:'none' }} />
                            <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
                                style={{ padding:'7px 10px', borderRadius:'8px', border:'1px solid #e0e0e0', fontSize:'13px', color:'#333', outline:'none' }}>
                                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                                style={{ padding:'7px 10px', borderRadius:'8px', border:'1px solid #e0e0e0', fontSize:'13px', color:'#333', outline:'none' }}>
                                <option value="marketcap">Sort: Market Cap</option>
                                <option value="sector">Sort: Sector</option>
                                <option value="date">Sort: Date</option>
                            </select>
                        </div>

                        {/* Results */}
                        <div style={{ overflowY:'auto', flex:1, padding:'8px 12px' }}>
                            {filtered.length === 0 ? (
                                <div style={{ padding:'40px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>No results match your filters</div>
                            ) : (
                                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                    {filtered.map(e => {
                                        const sc = SECTOR_COLORS[SECTOR_MAP[e.ticker]] || { bg:'#f1f5f9', border:'#94a3b8', text:'#334155' };
                                        const past = e.earningsDate < today;
                                        return (
                                            <div key={e.ticker}
                                                onClick={() => setSelectedEarningsStock(e)}
                                                style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', borderRadius:'10px', backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', cursor:'pointer', transition:'all 0.1s' }}
                                                onMouseEnter={e2 => { e2.currentTarget.style.backgroundColor='#eff6ff'; e2.currentTarget.style.borderColor='#bfdbfe'; }}
                                                onMouseLeave={e2 => { e2.currentTarget.style.backgroundColor='#f8fafc'; e2.currentTarget.style.borderColor='#e2e8f0'; }}
                                            >
                                                <div style={{ minWidth:'55px' }}>
                                                    <div style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>{e.ticker}</div>
                                                    <div style={{ fontSize:'10px', color:'#64748b', marginTop:'1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'120px' }}>{e.name}</div>
                                                </div>
                                                <div style={{ padding:'3px 8px', borderRadius:'12px', fontSize:'10px', fontWeight:'700', backgroundColor:sc.bg, border:`1px solid ${sc.border}40`, color:sc.text, whiteSpace:'nowrap', flexShrink:0 }}>
                                                    {SECTOR_MAP[e.ticker] || '--'}
                                                </div>
                                                <div style={{ fontSize:'12px', color:'#475569', fontWeight:'600', minWidth:'60px', textAlign:'right' }}>{fmtCap(e.marketCap)}</div>
                                                <div style={{ marginLeft:'auto', textAlign:'right', flexShrink:0 }}>
                                                    {e.epsActual != null && e.beat != null && (
                                                        <div style={{ fontSize:'11px', fontWeight:'800', padding:'1px 7px', borderRadius:'10px', marginBottom:'2px',
                                                            backgroundColor: e.beat ? '#f0fdf4' : '#fef2f2',
                                                            color: e.beat ? '#10b981' : '#ef4444',
                                                            border:`1px solid ${e.beat ? '#bbf7d0':'#fecaca'}` }}>
                                                            {e.beat ? '✓ Beat' : '✗ Missed'}
                                                        </div>
                                                    )}
                                                    {e.epsEstimate != null && (
                                                        <div style={{ fontSize:'11px', color:'#64748b' }}>EPS est <strong style={{ color:'#1e40af' }}>${e.epsEstimate}</strong></div>
                                                    )}
                                                    {e.epsActual != null && (
                                                        <div style={{ fontSize:'11px', color:'#64748b' }}>
                                                            Act. <strong style={{ color: e.beat ? '#10b981' : '#ef4444' }}>${e.epsActual}</strong>
                                                            {e.surprisePct != null && <span style={{ marginLeft:'4px', fontSize:'10px', color: e.surprisePct>=0?'#10b981':'#ef4444', fontWeight:'700' }}>({e.surprisePct>=0?'+':''}{e.surprisePct}%)</span>}
                                                        </div>
                                                    )}
                                                    {e.revenueActual != null && (
                                                        <div style={{ fontSize:'11px', color:'#64748b' }}>Rev <strong style={{ color:'#1e40af' }}>{fmtRev(e.revenueActual)}</strong>
                                                            {e.revenueEstimate != null && <span style={{ color:'#94a3b8' }}> vs {fmtRev(e.revenueEstimate)}</span>}
                                                        </div>
                                                    )}
                                                    {/* ADD: Historical quarters mini-chart for past earnings */}
                                                    {!e.isUpcoming && e.historicalQuarters?.length >= 2 && (() => {
                                                        const recent = e.historicalQuarters.slice(0, 4).reverse();
                                                        const maxAbs = Math.max(...recent.map(q => Math.abs(q.epsActual || 0)), 0.01);
                                                        return (
                                                            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px', marginTop: '4px' }}>
                                                                {recent.map((q, i) => (
                                                                    <div key={i}
                                                                        title={`${q.date?.slice(0,7)}: $${q.epsActual} (${q.surprisePct >= 0 ? '+' : ''}${q.surprisePct}%)`}
                                                                        style={{
                                                                            width: '10px',
                                                                            height: `${Math.max(20, (Math.abs(q.epsActual || 0) / maxAbs) * 100)}%`,
                                                                            backgroundColor: q.beat ? '#10b981' : '#ef4444',
                                                                            borderRadius: '2px 2px 0 0',
                                                                            opacity: 0.7 + (i / recent.length) * 0.3,
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}

                                                </div>
                                                <div style={{ flexShrink:0 }}>
                                                    {past
                                                        ? <span style={{ fontSize:'10px', fontWeight:'700', color:'#64748b', backgroundColor:'#f1f5f9', padding:'2px 6px', borderRadius:'6px' }}>Reported</span>
                                                        : <span style={{ fontSize:'10px', fontWeight:'700', color:'#2563eb', backgroundColor:'#eff6ff', padding:'2px 6px', borderRadius:'6px' }}>Upcoming</span>
                                                    }
                                                </div>
                                                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                                                    {e.isUpcoming && (
                                                        <button
                                                            onClick={ev => { ev.stopPropagation(); setPreviewTicker(e.ticker); }}
                                                            style={{
                                                                padding:'3px 8px', borderRadius:'6px', fontSize:'11px',
                                                                fontWeight:'700', border:'none',
                                                                background:'linear-gradient(135deg,#7c3aed,#db2777)',
                                                                color:'#fff', cursor:'pointer',
                                                            }}
                                                        >😼</button>
                                                    )}
                                                    <div style={{ fontSize:'11px', color:'#2563eb' }}>→</div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {selectedEarningsStock && (() => {
                                        const e = selectedEarningsStock;
                                        const sc = SECTOR_COLORS[SECTOR_MAP[e.ticker]] || { bg:'#f1f5f9', border:'#94a3b8', text:'#334155' };
                                        
                                        // Consistency score: % of past quarters that beat
                                        const hq = e.historicalQuarters || [];
                                        const beatCount = hq.filter(q => q.beat === true).length;
                                        const consistency = hq.length > 0 ? Math.round((beatCount / hq.length) * 100) : null;
                                        const avgSurprise = hq.length > 0 
                                            ? (hq.reduce((a, q) => a + (q.surprisePct || 0), 0) / hq.length).toFixed(1)
                                            : null;
                                        
                                        // Simple recommendation logic
                                        let rec = 'NEUTRAL', recColor = '#f59e0b', recIcon = '➡️';
                                        if (e.isUpcoming) {
                                            if (consistency >= 70 && parseFloat(avgSurprise) >= 3) {
                                                rec = 'POSITIVE SETUP'; recColor = '#10b981'; recIcon = '📈';
                                            } else if (consistency <= 40 || parseFloat(avgSurprise) < -2) {
                                                rec = 'CAUTIOUS'; recColor = '#ef4444'; recIcon = '⚠️';
                                            }
                                        } else {
                                            if (e.beat && e.surprisePct >= 5) {
                                                rec = 'BEAT — STRONG'; recColor = '#10b981'; recIcon = '🚀';
                                            } else if (e.beat) {
                                                rec = 'BEAT'; recColor = '#10b981'; recIcon = '📈';
                                            } else if (e.beat === false && e.surprisePct <= -5) {
                                                rec = 'MISS — WEAK'; recColor = '#ef4444'; recIcon = '🔻';
                                            } else if (e.beat === false) {
                                                rec = 'MISS'; recColor = '#ef4444'; recIcon = '📉';
                                            }
                                        }

                                        return (
                                            <div style={{
                                                position: 'absolute', right: 0, top: 0, bottom: 0,
                                                width: '300px', backgroundColor: '#fff',
                                                borderLeft: '1px solid #e2e8f0',
                                                display: 'flex', flexDirection: 'column',
                                                overflow: 'hidden', zIndex: 10,
                                            }}>
                                                {/* Header */}
                                                <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', flexShrink: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div>
                                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{e.ticker}</div>
                                                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{e.name}</div>
                                                        </div>
                                                        <button onClick={() => setSelectedEarningsStock(null)}
                                                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>×</button>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
                                                            backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}40` }}>
                                                            {SECTOR_MAP[e.ticker]}
                                                        </span>
                                                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
                                                            backgroundColor: recColor + '22', color: recColor, border: `1px solid ${recColor}40` }}>
                                                            {recIcon} {rec}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                    
                                                    {/* Current earnings */}
                                                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                                                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '8px' }}>
                                                            {e.isUpcoming ? 'UPCOMING REPORT' : 'LATEST REPORT'} — {e.earningsDate}
                                                        </div>
                                                        {e.epsEstimate != null && (
                                                            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                                                                EPS Est: <strong style={{ color: '#1e40af' }}>${e.epsEstimate}</strong>
                                                            </div>
                                                        )}
                                                        {e.epsActual != null && (
                                                            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                                                                EPS Actual: <strong style={{ color: e.beat ? '#10b981' : '#ef4444' }}>${e.epsActual}</strong>
                                                                {e.surprisePct != null && (
                                                                    <span style={{ marginLeft: '6px', fontWeight: '700', color: e.surprisePct >= 0 ? '#10b981' : '#ef4444' }}>
                                                                        ({e.surprisePct >= 0 ? '+' : ''}{e.surprisePct}%)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {e.revenueActual != null && (
                                                            <div style={{ fontSize: '12px', color: '#475569' }}>
                                                                Revenue: <strong style={{ color: '#1e40af' }}>{fmtRev(e.revenueActual)}</strong>
                                                                {e.revenueBeat != null && (
                                                                    <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: '700',
                                                                        color: e.revenueBeat ? '#10b981' : '#ef4444' }}>
                                                                        {e.revenueBeat ? '✓ Beat' : '✗ Miss'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {e.isUpcoming && e.epsSentiment && (
                                                            <div style={{ marginTop: '8px' }}>
                                                                {/* Reuse existing SentimentBadge component */}
                                                                <SentimentBadge e={e} compact={false} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Consistency score */}
                                                    {hq.length >= 2 && (
                                                        <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '8px' }}>
                                                                BEAT CONSISTENCY ({hq.length} quarters)
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '800',
                                                                    color: consistency >= 70 ? '#10b981' : consistency >= 50 ? '#f59e0b' : '#ef4444' }}>
                                                                    {consistency}%
                                                                </div>
                                                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                                    {beatCount}/{hq.length} beats<br/>
                                                                    {avgSurprise && <span>Avg surprise: <strong style={{ color: parseFloat(avgSurprise) >= 0 ? '#10b981' : '#ef4444' }}>{parseFloat(avgSurprise) >= 0 ? '+' : ''}{avgSurprise}%</strong></span>}
                                                                </div>
                                                            </div>
                                                            {/* Consistency bar */}
                                                            <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ height: '100%', width: `${consistency}%`,
                                                                    backgroundColor: consistency >= 70 ? '#10b981' : consistency >= 50 ? '#f59e0b' : '#ef4444',
                                                                    borderRadius: '3px', transition: 'width 0.6s ease' }} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Historical quarters table */}
                                                    {hq.length > 0 && (
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '8px' }}>
                                                                EARNINGS HISTORY
                                                            </div>
                                                            {hq.map((q, i) => (
                                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                                                    alignItems: 'center', padding: '6px 0',
                                                                    borderBottom: i < hq.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                                                    <span style={{ fontSize: '11px', color: '#64748b', minWidth: '65px' }}>
                                                                        {q.date?.slice(0, 7)}
                                                                    </span>
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        {q.epsActual != null && (
                                                                            <span style={{ fontSize: '12px', fontWeight: '700',
                                                                                color: q.beat ? '#10b981' : '#ef4444' }}>
                                                                                ${q.epsActual}
                                                                            </span>
                                                                        )}
                                                                        {q.surprisePct != null && (
                                                                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 5px',
                                                                                borderRadius: '8px',
                                                                                backgroundColor: q.surprisePct >= 0 ? '#f0fdf4' : '#fef2f2',
                                                                                color: q.surprisePct >= 0 ? '#10b981' : '#ef4444',
                                                                                border: `1px solid ${q.surprisePct >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
                                                                                {q.surprisePct >= 0 ? '+' : ''}{q.surprisePct}%
                                                                            </span>
                                   