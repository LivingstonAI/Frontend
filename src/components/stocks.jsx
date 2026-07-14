import React, { useEffect, useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

    const [isBackgroundRunning, setIsBackgroundRunning] = React.useState(false);
    const [scannedAt, setScannedAt] = React.useState(null);
    const [scannerError, setScannerError] = React.useState(null);
    const pollRef = React.useRef(null);

    // Fetch on mount
    React.useEffect(() => { fetchWatchlist(); }, []);

    // -- AI Opportunity Analysis (external AI, copy/paste pattern) --
    const [aiAnalysis, setAiAnalysis] = React.useState({}); // keyed by ticker
    const [aiPromptScope, setAiPromptScope] = React.useState(null); // 'bulk' | single row object
    const [showAiPromptModal, setShowAiPromptModal] = React.useState(false);
    const [showAiPasteModal, setShowAiPasteModal] = React.useState(false);
    const [aiPasteText, setAiPasteText] = React.useState('');
    const [aiPasteError, setAiPasteError] = React.useState(null);
    const [aiCopied, setAiCopied] = React.useState(false);

     // -- Score-based filtering --
    const [filterMinScore, setFilterMinScore] = React.useState(0);
    const [filterAiVerdict, setFilterAiVerdict] = React.useState('ALL');

    // -- Daily snapshot save (for backtesting) --
    const [snapshotSaving, setSnapshotSaving] = React.useState(false);
    const [snapshotResult, setSnapshotResult] = React.useState(null);
    const [snapshotError,  setSnapshotError]  = React.useState(null);

    React.useEffect(() => {
        const loadCached = async () => {
            try {
                const result = await window.storage.get('scanner-ai-analyses');
                if (result?.value) setAiAnalysis(JSON.parse(result.value));
            } catch {}
        };
        loadCached();
    }, []);

    const saveAiAnalyses = async (updated) => {
        setAiAnalysis(updated);
        try { await window.storage.set('scanner-ai-analyses', JSON.stringify(updated)); } catch {}
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
        .filter(r => filterAiVerdict === 'ALL' || aiAnalysis[r.ticker]?.verdict === filterAiVerdict)
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

    const openBulkAIPrompt = () => { setAiPromptScope('bulk'); setShowAiPromptModal(true); };
    const openIndividualAIPrompt = (r) => { setAiPromptScope(r); setShowAiPromptModal(true); };

    const handlePasteAIResponse = () => {
        setAiPasteError(null);
        if (!aiPasteText.trim()) { setAiPasteError('Paste the JSON response first.'); return; }
        let parsed;
        try {
            const clean = aiPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();
            parsed = JSON.parse(clean);
        } catch (e) {
            setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`);
            return;
        }
        if (!Array.isArray(parsed)) {
            setAiPasteError('Expected a JSON array (one object per stock).');
            return;
        }
        const updated = { ...aiAnalysis };
        let addedCount = 0;
        parsed.forEach(item => {
            const t = String(item?.ticker || '').toUpperCase().trim();
            if (!t || item.verdict == null || item.thesis == null) return;
            updated[t] = { ...item, ticker: t, savedAt: new Date().toLocaleString() };
            addedCount += 1;
        });
        if (addedCount === 0) {
            setAiPasteError('No valid stock entries found — check the response matches the expected format.');
            return;
        }
        saveAiAnalyses(updated);
        setShowAiPasteModal(false);
        setAiPasteText('');
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
                body:    JSON.stringify({ stocks: filtered, aiAnalysis }),
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

                        {Object.keys(aiAnalysis).length > 0 && (
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

                {aiScanError && (
                    <div style={{ padding:'8px 20px', backgroundColor:'#fef2f2', borderBottom:'1px solid #fecaca', fontSize:'12px', color:'#b91c1c' }}>
                        ⚠️ AI scan error: {aiScanError}
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
                            display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#1d4ed8', fontWeight:'600',
                        }}>
                            <span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⚡</span>
                            A fresh scan is running in the background — showing the last cached results below until it finishes (auto-updates every 5s).
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
                                                    {aiAnalysis[r.ticker] && (() => {
                                                        const av = AI_VERDICT_CONFIG[aiAnalysis[r.ticker].verdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                        return (
                                                            <span title={aiAnalysis[r.ticker].thesis} style={{
                                                                padding:'2px 8px', borderRadius:'10px',
                                                                fontSize:'11px', fontWeight:'700',
                                                                backgroundColor: av.bg, color: av.color,
                                                                border:`1px solid ${av.border}`,
                                                                whiteSpace:'nowrap',
                                                            }}>
                                                                {av.icon} 🧠 {aiAnalysis[r.ticker].badge}
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

                                                {/* AI Opportunity Analysis (external AI) */}
                                                {aiAnalysis[r.ticker] ? (() => {
                                                    const a  = aiAnalysis[r.ticker];
                                                    const av = AI_VERDICT_CONFIG[a.verdict] || AI_VERDICT_CONFIG.NEUTRAL;
                                                    return (
                                                        <div style={{ padding:'12px 14px', backgroundColor: av.bg, borderRadius:'8px', border:`1px solid ${av.border}` }}>
                                                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                                                                <span style={{ fontSize:'11px', fontWeight:'700', color:av.color, letterSpacing:'0.07em' }}>
                                                                    🧠 AI OPPORTUNITY ASSESSMENT
                                                                </span>
                                                                <span style={{ padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', backgroundColor:av.color, color:'#fff' }}>
                                                                    {av.icon} {a.verdict?.replace('_',' ')} · {a.opportunityScore}/100
                                                                </span>
                                                                <button onClick={() => openIndividualAIPrompt(r)} style={{
                                                                    marginLeft:'auto', fontSize:'10px', color:av.color, background:'none',
                                                                    border:`1px solid ${av.border}`, borderRadius:'6px', cursor:'pointer', padding:'2px 8px',
                                                                }}>🔄 Re-ask</button>
                                                            </div>
                                                            <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55, marginBottom:'8px' }}>
                                                                {a.thesis}
                                                            </div>
                                                            {a.sectorRelation && (
                                                                <div style={{ fontSize:'12px', color:'#475569', lineHeight:1.5, padding:'8px 10px', backgroundColor:'rgba(255,255,255,0.6)', borderRadius:'7px', marginBottom: a.risks ? '6px' : 0 }}>
                                                                    <strong style={{ color:av.color }}>Sector context:</strong> {a.sectorRelation}
                                                                </div>
                                                            )}
                                                            {a.risks && (
                                                                <div style={{ fontSize:'12px', color:'#ef4444', lineHeight:1.5 }}>
                                                                    <strong>Risk:</strong> {a.risks}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })() : (
                                                    <button
                                                        onClick={() => openIndividualAIPrompt(r)}
                                                        style={{
                                                            padding:'10px', borderRadius:'9px',
                                                            background:'linear-gradient(135deg,#7c3aed,#db2777)',
                                                            color:'#fff', border:'none',
                                                            fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                            display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', width:'100%',
                                                        }}
                                                    >
                                                        🧠 Ask External AI for Opportunity Analysis
                                                    </button>
                                                )}

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
                const scopeStocks = aiPromptScope === 'bulk' ? filtered : (aiPromptScope ? [aiPromptScope] : []);
                const promptText  = scopeStocks.length ? buildScannerAIPrompt(scopeStocks) : '';
                const scopeLabel  = aiPromptScope === 'bulk' ? `${filtered.length} stocks shown` : aiPromptScope?.ticker;
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
                                        ].map(({ name, icon, color, bg, border, getUrl }) => (
                                            <button key={name} onClick={() => window.open(getUrl(promptText), '_blank')} style={{
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
                            <textarea
                                autoFocus
                                value={aiPasteText}
                                onChange={e => { setAiPasteText(e.target.value); setAiPasteError(null); }}
                                placeholder={`Paste the JSON array here. Should start with [\n  { "ticker": "AAPL", "verdict": "OPPORTUNITY", ... }\n]`}
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
                                                                        )}
                                                                        {q.beat != null && (
                                                                            <span style={{ fontSize: '10px' }}>{q.beat ? '✓' : '✗'}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Post-earnings reaction (fetch on demand) */}
                                                    {!e.isUpcoming && (
                                                        <div>
                                                            <button
                                                                onClick={async () => {
                                                                    setReactionLoading2(true);
                                                                    setStockReaction(null);
                                                                    const res = await fetch(`${BACKEND}/api/snowai_earnings_reaction_vault/`, {
                                                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ ticker: e.ticker, earningsDate: e.earningsDate }),
                                                                    });
                                                                    const json = await res.json();
                                                                    setStockReaction(json);
                                                                    setReactionLoading2(false);
                                                                }}
                                                                style={{ width: '100%', padding: '9px', borderRadius: '9px',
                                                                    backgroundColor: '#0f172a', color: '#60a5fa', border: '1px solid #1e3a5f',
                                                                    fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                                                                📊 Load Price Reaction
                                                            </button>
                                                            {reactionLoading2 && (
                                                                <div style={{ textAlign: 'center', padding: '12px', color: '#60a5fa', fontSize: '12px' }}>
                                                                    <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span> Fetching...
                                                                </div>
                                                            )}
                                                            {stockReaction && !reactionLoading2 && (
                                                                <ReactionPanel data={stockReaction} onClose={() => setStockReaction(null)} />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer CTA */}
                                                <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
                                                    <button
                                                        onClick={() => { setShowModal(false); if (onSelectTicker) onSelectTicker(e.ticker); }}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '9px',
                                                            background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                                                            color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                                                        → Open Full Screener for {e.ticker}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Reaction panel */}
                        {(reactionLoading || reactionData) && (
                            <div style={{ padding:'0 20px 16px' }}>
                                {reactionLoading && (
                                    <div style={{ padding:'20px', textAlign:'center', color:'#2563eb', backgroundColor:'#eff6ff', borderRadius:'12px', marginTop:'10px', fontSize:'13px' }}>
                                        <div style={{ fontSize:'22px', animation:'spin 0.8s linear infinite', display:'inline-block', marginBottom:'6px' }}>⏳</div>
                                        <div>Fetching post-earnings reaction for <strong>{reactionTicker}</strong>...</div>
                                        <div style={{ fontSize:'11px', color:'#64748b', marginTop:'3px' }}>Pulling ~2 weeks of price data around the earnings date</div>
                                    </div>
                                )}
                                {!reactionLoading && reactionData && (
                                    <ReactionPanel data={reactionData} onClose={() => setReactionData(null)} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bulk reaction results */}
            {showBulk && (
                <div style={{ margin:'0 0 20px', backgroundColor:'#fff', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
                    <div style={{ padding:'14px 20px', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div>
                            <div style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>⚡ Bulk Earnings Reaction</div>
                            <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)', marginTop:'2px' }}>Sorted by biggest D+1 move -- all % from pre-earnings close</div>
                        </div>
                        <button onClick={() => setShowBulk(false)} style={{ background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer' }}>×</button>
                    </div>
                    {bulkLoading && (
                        <div style={{ padding:'40px', textAlign:'center', color:'#7c3aed', fontSize:'13px' }}>
                            <div style={{ fontSize:'28px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'8px' }}>⏳</div>
                            <div>Fetching post-earnings data for multiple stocks...</div>
                            <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>~15-20s</div>
                        </div>
                    )}
                    {!bulkLoading && bulkReaction?.length > 0 && (
                        <>
                            <div style={{ overflowX:'auto' }}>
                                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor:'#f8fafc' }}>
                                            {['Ticker','Sector','Earnings Date','Earn Day','D+1','D+3','D+5','D+10'].map(h => (
                                                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontWeight:'700', color:'#64748b', borderBottom:'1px solid #e2e8f0', whiteSpace:'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bulkReaction.map((r, i) => {
                                            const col = v => v == null ? '#94a3b8' : v > 0 ? '#10b981' : '#ef4444';
                                            const bg  = v => v == null ? 'transparent' : v > 2 ? 'rgba(16,185,129,0.07)' : v < -2 ? 'rgba(239,68,68,0.07)' : 'transparent';
                                            const fmt = v => v == null ? '--' : `${v >= 0 ? '+' : ''}${v}%`;
                                            const sc  = SECTOR_COLORS[SECTOR_MAP[r.ticker]] || { bg:'#f1f5f9', border:'#94a3b8', text:'#334155' };
                                            return (
                                                <tr key={i} style={{ borderBottom:'1px solid #f8fafc' }}
                                                    onMouseEnter={e2=>e2.currentTarget.style.backgroundColor='#f8fafc'}
                                                    onMouseLeave={e2=>e2.currentTarget.style.backgroundColor=''}>
                                                    <td style={{ padding:'9px 12px', fontWeight:'800', color:'#1a1a1a' }}>{r.ticker}</td>
                                                    <td style={{ padding:'9px 12px' }}>
                                                        <span style={{ fontSize:'10px', padding:'1px 6px', borderRadius:'8px', backgroundColor:sc.bg, color:sc.text, border:`1px solid ${sc.border}40`, fontWeight:'700' }}>
                                                            {SECTOR_MAP[r.ticker]||'--'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding:'9px 12px', color:'#475569', whiteSpace:'nowrap' }}>{r.earningsDate}</td>
                                                    {[r.pctEarnDay, r.pctD1, r.pctD3, r.pctD5, r.pctD10].map((v, j) => (
                                                        <td key={j} style={{ padding:'9px 12px', fontWeight:'700', color:col(v), backgroundColor:bg(v), textAlign:'center' }}>{fmt(v)}</td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {bulkReaction.length > 2 && (() => {
                                const d1s = bulkReaction.filter(r=>r.pctD1!=null).map(r=>r.pctD1);
                                const d5s = bulkReaction.filter(r=>r.pctD5!=null).map(r=>r.pctD5);
                                const mean = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2) : '--';
                                const up   = bulkReaction.filter(r=>r.pctD1>0).length;
                                return (
                                    <div style={{ padding:'12px 20px', backgroundColor:'#f8fafc', borderTop:'1px solid #e2e8f0', display:'flex', gap:'20px', flexWrap:'wrap' }}>
                                        <span style={{ fontSize:'12px', color:'#475569' }}>Avg D+1: <strong style={{ color: parseFloat(mean(d1s))>=0?'#10b981':'#ef4444' }}>{mean(d1s)}%</strong></span>
                                        <span style={{ fontSize:'12px', color:'#475569' }}>Avg D+5: <strong style={{ color: parseFloat(mean(d5s))>=0?'#10b981':'#ef4444' }}>{mean(d5s)}%</strong></span>
                                        <span style={{ fontSize:'12px', color:'#475569' }}>Positive D+1: <strong style={{ color:'#10b981' }}>{up}/{bulkReaction.length}</strong> ({((up/bulkReaction.length)*100).toFixed(0)}%)</span>
                                    </div>
                                );
                            })()}
                        </>
                    )}
                    {!bulkLoading && bulkReaction?.length === 0 && (
                        <div style={{ padding:'32px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>No past earnings data found for the current calendar view</div>
                    )}
                </div>
            )}

            {/* Bulk reaction footer */}
            <div style={{ padding:'12px 20px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:'10px', flexShrink:0, backgroundColor:'#f8fafc' }}>
                <div style={{ flex:1, fontSize:'11px', color:'#64748b' }}>
                    <strong style={{ color:'#4c1d95' }}>⚡ Bulk Calculator</strong> -- see how every stock here reacted post-earnings vs its pre-report price
                </div>
                <button onClick={fetchBulkReaction} disabled={bulkLoading}
                    style={{ padding:'7px 14px', borderRadius:'9px', backgroundColor:'#7c3aed', color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor: bulkLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'5px', flexShrink:0 }}>
                    {bulkLoading
                        ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⏳</span> Calculating...</>
                        : '⚡ Bulk Reaction'}
                </button>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            {previewTicker && (
                <SabrinaEarningsPreview
                    ticker={previewTicker}
                    openaiKey={openaiKey}  // pass this prop into EarningsCalendar
                    onClose={() => setPreviewTicker(null)}
                />
            )}

        </div>
    );
}


// --- Chart & Insights Tab -----------------------------------------------------
function ChartInsightsTab({ ticker, stockData, earnings, news, marketauxNews, openaiKey, cachedNewsAnalysis, compactMode = false }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(false);
    const [chartError, setChartError] = useState(null);
    const [chartInterval, setChartInterval] = useState('1D');
    const [chartTheme, setChartTheme] = useState('light'); // 'light' | 'dark' | 'hud'
    const [chartType, setChartType] = useState('candlestick'); // 'candlestick' | 'line' | 'area'
    const [loadingChart, setLoadingChart] = useState(false);
    const [sabrinaLoading, setSabrinaLoading] = useState(false);
    const [sabrinaRec, setSabrinaRec] = useState(null); // persisted rec per ticker
    const [recError, setRecError] = useState(null);
    const [screenshotting, setScreenshotting] = useState(false);
    const [refreshTick, setRefreshTick] = useState(0);      // manual refresh trigger
    const [autoRefresh, setAutoRefresh] = useState(false);   // auto-refresh toggle
    const [refreshing, setRefreshing] = useState(false);     // spinner for refresh
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const autoRefreshRef = useRef(null);
    const twapSeriesRef  = useRef(null); // TWAP line series
    const bandTopRef     = useRef(null); // deviation band top
    const bandBotRef     = useRef(null); // deviation band bottom
    const [showTWAP, setShowTWAP]   = useState(false);
    const [twapStats, setTwapStats] = useState(null);
    // -- Extra indicator refs (backend-computed) --
    const rsiSeriesRef  = useRef(null);
    const bbMidRef      = useRef(null);
    const bbTopRef      = useRef(null);
    const bbBotRef      = useRef(null);
    const ema20Ref      = useRef(null);
    const ema50Ref      = useRef(null);
    const ema200Ref     = useRef(null);
    const rsiChartRef   = useRef(null);  // separate pane chart for RSI
    const rsiPaneRef    = useRef(null);  // DOM container for RSI pane
    const [showBB,    setShowBB]    = useState(false);
    const [showRSI,   setShowRSI]   = useState(false);
    const [showEMA,   setShowEMA]   = useState(false);
    const [rsiVal,    setRsiVal]    = useState(null);
    const [prePost,   setPrePost]   = useState(false);  // pre/post market toggle
    const [sessionNow, setSessionNow] = useState(null); // live session state
    // -- Analyst ratings --
    const [analystData,        setAnalystData]        = useState(null);
    const [analystLoading,     setAnalystLoading]     = useState(false);
    const [analystError,       setAnalystError]       = useState(null);
    const [showAnalystPanel,   setShowAnalystPanel]   = useState(false);
    // -- Earnings markers on chart --
    const [showEarningsMarkers, setShowEarningsMarkers] = useState(true);
    const earningsMarkersRef       = useRef([]); // cached for re-apply on refresh
    const showEarningsMarkersRef    = useRef(true); // ref mirror for closure safety

    // -- Drawing tools --
    const LINE_COLORS = [
        { id:'amber',  hex:'#f59e0b', label:'Amber'  },
        { id:'red',    hex:'#ef4444', label:'Red'    },
        { id:'green',  hex:'#10b981', label:'Green'  },
        { id:'blue',   hex:'#3b82f6', label:'Blue'   },
        { id:'purple', hex:'#8b5cf6', label:'Purple' },
        { id:'white',  hex:'#e5e7eb', label:'White'  },
    ];
    const drawingModeRef       = useRef(false);
    const [drawingMode,        setDrawingMode]        = useState(false);
    const [selectedLineColor,  setSelectedLineColor]  = useState('#f59e0b');
    const selectedLineColorRef = useRef('#f59e0b');
    const drawnLinesRef        = useRef([]);
    const [drawnLines,         setDrawnLines]         = useState([]);
    const [manualPrice,        setManualPrice]        = useState('');
    const [manualLabel,        setManualLabel]        = useState('');
    // -- Video recording --
    const [isRecording,        setIsRecording]        = useState(false);
    const [videoBlob,          setVideoBlob]          = useState(null);
    const [videoUrl,           setVideoUrl]           = useState(null);
    const [recordingProgress,  setRecordingProgress]  = useState(0); // 0-100
    const mediaRecorderRef     = useRef(null);
    const videoChunksRef       = useRef([]);
    // -- Price alerts --
    const [alerts,             setAlerts]             = useState([]);
    const [showAlertForm,      setShowAlertForm]      = useState(false);
    const [alertPrice,         setAlertPrice]         = useState('');
    const [alertDir,           setAlertDir]           = useState('above');
    const [firedAlerts,        setFiredAlerts]        = useState([]);
    // -- Annotations --
    const [annotations,        setAnnotations]        = useState({});
    // -- Compare mode --
    const [compareTicker,      setCompareTicker]      = useState(null);   // active compare ticker
    const [showComparePicker,  setShowComparePicker]  = useState(false);  // modal open
    const [compareSearch,      setCompareSearch]      = useState('');     // search input
    const [compareCategory,    setCompareCategory]    = useState('stocks');
    const [compareMode,        setCompareMode]        = useState('side'); // 'side' | 'stack'
    // -- Options flow --
    const [optionsData,        setOptionsData]        = useState(null);
    const [optionsLoading,     setOptionsLoading]     = useState(false);
    const [optionsError,       setOptionsError]       = useState(null);
    const [showOptionsPanel,   setShowOptionsPanel]   = useState(false);
    const [optionsExpiry,      setOptionsExpiry]      = useState(null);

    const [positions,         setPositions]         = useState([]);
    const [positionsLoading,  setPositionsLoading]  = useState(false);
    const [showPositions,     setShowPositions]      = useState(true);
    const positionLinesRef    = useRef({}); 
    // { [positionId]: { entry, sl, tp, current } } — holds priceLine refs per position

    useEffect(() => { drawingModeRef.current = drawingMode; }, [drawingMode]);
    useEffect(() => { showEarningsMarkersRef.current = showEarningsMarkers; }, [showEarningsMarkers]);
    useEffect(() => { selectedLineColorRef.current = selectedLineColor; }, [selectedLineColor]);

    // Lower -> Higher timeframes with smart default lookbacks
    const intervalConfig = {
        '1m':  { label: '1m',  group: 'Intraday' },
        '5m':  { label: '5m',  group: 'Intraday' },
        '15m': { label: '15m', group: 'Intraday' },
        '30m': { label: '30m', group: 'Intraday' },
        '1h':  { label: '1H',  group: 'Intraday' },
        '4h':  { label: '4H',  group: 'Intraday' },
        '1D':  { label: '1D',  group: 'Daily+'   },
        '1W':  { label: '1W',  group: 'Daily+'   },
        '1M':  { label: '1M',  group: 'Daily+'   },
        '3M':  { label: '3M',  group: 'Daily+'   },
        '6M':  { label: '6M',  group: 'Daily+'   },
        '1Y':  { label: '1Y',  group: 'Daily+'   },
        '2Y':  { label: '2Y',  group: 'Daily+'   },
    };
    const intervals = Object.keys(intervalConfig);

    // -- Load TradingView Lightweight Charts from CDN --
    useEffect(() => {
        if (window.LightweightCharts) { setChartLoaded(true); return; }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
        script.onload = () => setChartLoaded(true);
        script.onerror = () => setChartError('Failed to load chart library.');
        document.head.appendChild(script);
    }, []);

    // -- TWAP + Deviation Band computation --------------------------------------
    // Uses trapezoidal integration of close price over time (unix seconds)
    // TWAP(i) = integral[0..i](price dt) / (t_i - t_0)
    // Band = TWAP +/- 1 stddev of (price - TWAP) over the whole dataset
    // -- Live session tracker -----------------------------------------------------
    // Uses Intl.DateTimeFormat with America/New_York -- handles DST automatically
    // regardless of where the user's browser is located (e.g. South Africa, UTC+2).
    // This is the ONLY correct way to get NYC time -- manual offset math breaks on
    // DST transitions since getTimezoneOffset() reflects the LOCAL browser timezone.
    const getSessionState = () => {
        const now = new Date();

        // Extract NYC time parts directly from the IANA tz database
        const nyParts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hour:     'numeric',
            minute:   'numeric',
            second:   'numeric',
            weekday:  'short',
            hour12:   false,
        }).formatToParts(now);

        const part = (type) => parseInt(nyParts.find(p => p.type === type)?.value ?? '0', 10);
        const weekday = nyParts.find(p => p.type === 'weekday')?.value; // 'Mon','Tue'...
        const h    = part('hour') % 24;   // formatToParts can return 24 for midnight
        const m    = part('minute');
        const mins = h * 60 + m;

        // Build a Date object representing NYC "now" for display (toLocaleTimeString)
        // We need this so the session widget shows actual NYC clock time
        const nyTimeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        }).format(now);

        // Determine if NYC is currently on EDT (UTC-4) or EST (UTC-5)
        // by comparing UTC offset -- Intl handles the DST boundary precisely
        const nyOffsetMins = (() => {
            // Trick: format the same instant in UTC and NYC, diff them
            const utcH = parseInt(new Intl.DateTimeFormat('en-US', { timeZone:'UTC', hour:'numeric', hour12:false }).format(now), 10) % 24;
            const diff = ((h - utcH + 24) % 24);
            // diff will be 20 (= -4 mod 24) for EDT, 19 (= -5 mod 24) for EST
            return diff >= 12 ? diff - 24 : diff; // -> -4 or -5
        })();
        const tzLabel = nyOffsetMins === -4 ? 'EDT' : 'EST';

        const isWeekend = weekday === 'Sun' || weekday === 'Sat';
        if (isWeekend) return { session:'closed', label:'Market Closed', sub:'Weekend', color:'#6b7280', dot:'#6b7280', nyTimeStr, tzLabel };

        // NYSE session windows (minutes from midnight NYC)
        const PRE_OPEN   = 4  * 60;       // 04:00
        const MKT_OPEN   = 9  * 60 + 30;  // 09:30
        const MKT_CLOSE  = 16 * 60;       // 16:00
        const POST_CLOSE = 20 * 60;       // 20:00

        const minsUntil = (t) => t - mins;
        const fmt = (d) => {
            const abs = Math.abs(d);
            return `${Math.floor(abs/60).toString().padStart(2,'0')}:${(abs%60).toString().padStart(2,'0')}`;
        };

        if (mins < PRE_OPEN)   return { session:'closed',   label:'Market Closed', sub:`Pre-market opens in ${fmt(minsUntil(PRE_OPEN))}`,    color:'#6b7280', dot:'#6b7280', nyTimeStr, tzLabel };
        if (mins < MKT_OPEN)   return { session:'pre',      label:'Pre-Market',    sub:`Regular opens in ${fmt(minsUntil(MKT_OPEN))}`,        color:'#f59e0b', dot:'#f59e0b', nyTimeStr, tzLabel };
        if (mins < MKT_CLOSE)  return { session:'regular',  label:'Market Open',   sub:`Closes in ${fmt(minsUntil(MKT_CLOSE))}`,              color:'#10b981', dot:'#10b981', nyTimeStr, tzLabel };
        if (mins < POST_CLOSE) return { session:'post',     label:'After Hours',   sub:`Post-market closes in ${fmt(minsUntil(POST_CLOSE))}`,  color:'#60a5fa', dot:'#60a5fa', nyTimeStr, tzLabel };
        return                         { session:'closed',   label:'Market Closed', sub:'After-hours ended',                                   color:'#6b7280', dot:'#6b7280', nyTimeStr, tzLabel };
    };

    useEffect(() => {
        const tick = () => setSessionNow(getSessionState());
        tick();
        const id = setInterval(tick, 1000); // every second -- live NYC clock
        return () => clearInterval(id);
    }, []);

    // -- Alerts persistence -------------------------------------------------------
    useEffect(() => {
        (async () => {
            try {
                const ra = await window.storage.get('snowai-alerts');
                if (ra?.value) setAlerts(JSON.parse(ra.value));
            } catch {}
        })();
    }, []);

    const saveAlerts = async (al) => {
        setAlerts(al);
        try { await window.storage.set('snowai-alerts', JSON.stringify(al)); } catch {}
    };

    // Check price alerts on each refresh
    const checkAlerts = (candles) => {
        if (!alerts.length || !candles?.length) return;
        const latest = candles[candles.length - 1]?.close;
        if (!latest) return;
        const fired = []; const remaining = [];
        alerts.forEach(al => {
            if (al.ticker !== ticker) { remaining.push(al); return; }
            const hit = al.dir === 'above' ? latest >= al.price : latest <= al.price;
            if (hit) {
                fired.push(al);
                if (Notification.permission === 'granted')
                    new Notification(`🔔 ${al.ticker} Alert`, { body: `Price ${al.dir==='above'?'crossed above':'dropped below'} $${al.price} -- now $${latest.toFixed(2)}` });
            } else { remaining.push(al); }
        });
        if (fired.length) {
            setFiredAlerts(prev => [...prev, ...fired]);
            saveAlerts(remaining);
            // Browser notification -- works if user previously granted permission.
            // We don't ask for permission here; the toast is the primary alert.
            fired.forEach(al => {
                try {
                    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                        new Notification(`🔔 ${al.ticker} price alert`, {
                            body: `Price ${al.dir==='above'?'crossed above':'dropped below'} $${al.price.toFixed(2)}`,
                            tag:  `snowai-alert-${al.id}`,
                        });
                    }
                } catch {}
            });
        }
    };

    // -- Add a line at an exact price input --------------------------------------
    const addManualLine = (priceStr, label, color) => {
        const price = parseFloat(priceStr);
        if (!price || isNaN(price) || !seriesRef.current) return;
        const id = Date.now();
        try {
            const pl = seriesRef.current.createPriceLine({
                price,
                color: color || selectedLineColor,
                lineWidth: 1,
                lineStyle: 2,
                axisLabelVisible: true,
                title: label ? `${label} $${price.toFixed(2)}` : `$${price.toFixed(2)}`,
            });
            drawnLinesRef.current.push({ id, price, priceLine: pl, color: color || selectedLineColor, label });
            setDrawnLines(prev => [...prev, { id, price: price.toFixed(2), color: color || selectedLineColor, label }]);
        } catch(e) { console.error('[Draw] addManualLine failed', e); }
    };

    // -- Chart Video Recording ----------------------------------------------------
    // Strategy: grab the chart container's canvas element, attach MediaRecorder to
    // its captureStream(), then animate the chart by scrolling through logical range.
    // Each "frame" is the live canvas -- all styling/theme/indicators preserved.
    const recordChartVideo = async (targetDurationSec = 30) => {
        if (!chartRef.current || !seriesRef.current) return;
        setIsRecording(true);
        setVideoBlob(null);
        setVideoUrl(null);
        setRecordingProgress(0);
        videoChunksRef.current = [];

        try {
            const canvas = chartContainerRef.current?.querySelector('canvas');
            if (!canvas) throw new Error('Chart canvas not found');

            // -- Key insight: record at 24fps, control how long we WAIT per frame --
            // frameDelay = targetDuration / totalBars  (ms per candle step)
            // This makes the recording take targetDuration seconds in real time.
            // Since we capture the canvas stream at 24fps, the resulting video
            // naturally plays back at ~24fps and lasts ~targetDuration seconds.
            const PLAYBACK_FPS    = 24;
            const stream = canvas.captureStream(PLAYBACK_FPS);
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : MediaRecorder.isTypeSupported('video/webm')
                ? 'video/webm' : 'video/mp4';

            const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = e => { if (e.data.size > 0) videoChunksRef.current.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(videoChunksRef.current, { type: mimeType });
                const url  = URL.createObjectURL(blob);
                setVideoBlob(blob);
                setVideoUrl(url);
                setIsRecording(false);
                setRecordingProgress(100);
            };

            recorder.start(200);

            const allData    = seriesRef.current.data?.() ?? [];
            const totalBars  = allData.length;
            if (totalBars === 0) { recorder.stop(); return; }

            // Window size = how many bars are visible at once during recording.
            // Want ~120-150 bars -- enough context to read structure/trends without
            // being so zoomed out candles become invisible.
            // Cap at 60% of total so we don't show the whole dataset at once.
            const windowSize = Math.min(150, Math.max(80, Math.round(totalBars * 0.60)));
            const rightPad   = Math.round(windowSize * 0.15); // small right-side breathing room

            const frameDelay     = Math.max(50, Math.round((targetDurationSec * 1000) / totalBars));
            const barsPerStep    = frameDelay < 60 ? 2 : 1;
            const effectiveDelay = frameDelay * barsPerStep;

            console.log(`[Video] totalBars=${totalBars} windowSize=${windowSize} rightPad=${rightPad} frameDelay=${frameDelay}ms -> est. ${((totalBars/barsPerStep)*effectiveDelay/1000).toFixed(1)}s`);

            // -- Hard reset to bar 0 regardless of where user navigated ----------
            // scrollToPosition(0) alone isn't enough -- setVisibleLogicalRange is authoritative
            chartRef.current.timeScale().setVisibleLogicalRange({ from: 0, to: windowSize + rightPad });

            // Small delay so the chart actually renders frame 0 before recorder starts
            await new Promise(r => setTimeout(r, 400));

            let bar = 0;
            const animate = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
                if (bar >= totalBars) {
                    setTimeout(() => { try { recorder.stop(); } catch {} }, 1500);
                    return;
                }
                chartRef.current.timeScale().setVisibleLogicalRange({
                    from: Math.max(0, bar - Math.round(windowSize * 0.65)),
                    to:   bar + rightPad,
                });
                setRecordingProgress(Math.round((bar / totalBars) * 95));
                bar += barsPerStep;
                setTimeout(animate, effectiveDelay);
            };

            animate();

        } catch(e) {
            console.error('[Video] Recording failed:', e);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        try { mediaRecorderRef.current?.stop(); } catch {}
        setIsRecording(false);
    };

    const downloadVideo = () => {
        if (!videoBlob) return;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `${ticker}_${chartInterval}_${new Date().toISOString().slice(0,10)}.webm`;
        a.click();
    };

    // Options fetch
    const fetchOptions = async (sym) => {
        const BACKEND = 'https://backend-production-c0ab.up.railway.app';
        console.log('[Options] fetchOptions called for', sym, 'expiry:', optionsExpiry);
        setOptionsLoading(true);
        setOptionsError(null);
        setOptionsData(null);
        try {
            const url = `${BACKEND}/api/snowai_options_flow_vault/`;
            const body = JSON.stringify({ ticker: sym, expiry: optionsExpiry });
            console.log('[Options] POST', url, body);
            const res  = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body });
            console.log('[Options] Response status:', res.status);
            const json = await res.json();
            console.log('[Options] Response body:', json);
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setOptionsData(json);
        } catch (e) {
            console.error('[Options] Error:', e);
            setOptionsError(e.message);
        } finally {
            setOptionsLoading(false);
        }
    };

    // -- Fetch OHLCV + backend-computed indicators in one call ------------------
    const fetchChartData = async (sym, interval, activeIndicators, includePrePost = false) => {
        const BACKEND = 'https://backend-production-c0ab.up.railway.app';
        const res = await fetch(`${BACKEND}/api/snowai_thundervault_ohlcv_chart_stream/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: sym, interval, indicators: activeIndicators, prePost: includePrePost }),
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const json = await res.json();
        if (!json.candles?.length) throw new Error('No data returned for ' + sym);
        // Add value alias (needed for line/area series)
        json.candles = json.candles.map(c => ({ ...c, value: c.close }));
        return json;
    };

    // -- Fetch analyst ratings (separate endpoint) ----------------------------
    const fetchAnalystRatings = async (sym) => {
        const BACKEND = 'https://backend-production-c0ab.up.railway.app';
        setAnalystLoading(true);
        setAnalystError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_vortex_analyst_ratings_vault/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: sym }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed');
            setAnalystData(json);
            setShowAnalystPanel(true);
        } catch (e) {
            setAnalystError(e.message);
        } finally {
            setAnalystLoading(false);
        }
    };

    const fetchPositions = async (sym) => {
        if (!sym) return;
        setPositionsLoading(true);
        try {
            const res  = await fetch(`${BACKEND}/api/positions/?asset=${sym}`);
            const json = await res.json();
            setPositions(json.positions || []);
        } catch (e) {
            console.error('[Positions]', e);
        } finally {
            setPositionsLoading(false);
        }
    };

    const clearPositionLines = () => {
    if (!seriesRef.current) return;
    Object.values(positionLinesRef.current).forEach(group => {
        Object.values(group).forEach(pl => {
            try { seriesRef.current.removePriceLine(pl); } catch (_) {}
        });
    });
    positionLinesRef.current = {};
};

    const drawPositionLines = (positionList) => {
        if (!seriesRef.current || !showPositions) return;
        clearPositionLines();

        positionList.forEach(pos => {
            const isLong = pos.direction === 'long';
            const lines  = {};

            // Entry line — blue/white
            if (pos.entry_price) {
                lines.entry = seriesRef.current.createPriceLine({
                    price:            pos.entry_price,
                    color:            '#3b82f6',
                    lineWidth:        2,
                    lineStyle:        0, // solid
                    axisLabelVisible: true,
                    title:            `${pos.asset} Entry${pos.direction === 'short' ? ' (S)' : ' (L)'}  $${pos.entry_price}`,
                });
            }

            // SL line — always red
            if (pos.sl_price) {
                const slLabel = pos.sl_dollars
                    ? `SL  $${pos.sl_price}  (-$${Math.abs(pos.sl_dollars).toFixed(2)})`
                    : `SL  $${pos.sl_price}`;
                lines.sl = seriesRef.current.createPriceLine({
                    price:            pos.sl_price,
                    color:            '#ef4444',
                    lineWidth:        1,
                    lineStyle:        2, // dashed
                    axisLabelVisible: true,
                    title:            slLabel,
                });
            }

            // TP line — always green
            if (pos.tp_price) {
                const tpLabel = pos.tp_dollars
                    ? `TP  $${pos.tp_price}  (+$${Math.abs(pos.tp_dollars).toFixed(2)})`
                    : `TP  $${pos.tp_price}`;
                lines.tp = seriesRef.current.createPriceLine({
                    price:            pos.tp_price,
                    color:            '#10b981',
                    lineWidth:        1,
                    lineStyle:        2,
                    axisLabelVisible: true,
                    title:            tpLabel,
                });
            }

            // Current price line — amber, only if different from entry
            if (pos.current_price && Math.abs(pos.current_price - pos.entry_price) > 0.001) {
                const pnl = isLong
                    ? pos.current_price - pos.entry_price
                    : pos.entry_price  - pos.current_price;
                const pnlLabel = `${pnl >= 0 ? '▲' : '▼'} Now  $${pos.current_price}  (${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)})`;
                lines.current = seriesRef.current.createPriceLine({
                    price:            pos.current_price,
                    color:            pnl >= 0 ? '#f59e0b' : '#fb923c',
                    lineWidth:        1,
                    lineStyle:        1, // dotted
                    axisLabelVisible: true,
                    title:            pnlLabel,
                });
            }

            positionLinesRef.current[pos.id] = lines;
        });
    };

    // -- Helper: remove a series safely --------------------------------------
    const removeSeries = (chart, ref) => {
        if (ref.current && chart) { try { chart.removeSeries(ref.current); } catch {} ref.current = null; }
    };

    
    // Replace the existing applyEarningsMarkers function:
    const applyEarningsMarkers = (series, candles, markersOverride) => {
        if (!series || !candles?.length) return;
        const markerDates = markersOverride ?? earningsMarkersRef.current;

        if (!showEarningsMarkersRef.current || !markerDates.length) {
            try { series.setMarkers([]); } catch {}
            return;
        }

        const unixToDate = (t) => {
            if (typeof t === 'number') {
                const d = new Date(t * 1000);
                return [
                    d.getUTCFullYear(),
                    String(d.getUTCMonth() + 1).padStart(2, '0'),
                    String(d.getUTCDate()).padStart(2, '0'),
                ].join('-');
            }
            return String(t).slice(0, 10);
        };

        // Build date -> candle map — for intraday charts multiple candles
        // share the same date, so we pick the LAST candle of that day
        // (closing candle) which is the most meaningful anchor for earnings.
        const dateToCandle = {};
        candles.forEach(c => {
            dateToCandle[unixToDate(c.time)] = c; // later candles overwrite earlier ones = last of day
        });

        const markers = [];
        markerDates.forEach(({ date, label, upcoming, beat }) => {
            // For past earnings on daily+ charts: exact match.
            // For intraday: walk forward up to 5 trading days to find a candle
            // (earnings are often reported AH so the reaction shows next day).
            let candle = dateToCandle[date];
            if (!candle) {
                // Try next 5 calendar days — handles weekends / holidays
                for (let offset = 1; offset <= 5; offset++) {
                    const d  = new Date(date + 'T12:00:00Z');
                    d.setUTCDate(d.getUTCDate() + offset);
                    const ds = d.toISOString().slice(0, 10);
                    if (dateToCandle[ds]) { candle = dateToCandle[ds]; break; }
                }
            }
            if (!candle) return;

            // Colour logic:
            // upcoming  → blue  arrow down (from above)
            // beat      → green arrow up   (from below)
            // miss      → red   arrow up
            // unknown   → amber arrow up
            let color, shape, position;
            if (upcoming) {
                color    = '#3b82f6';
                shape    = 'arrowDown';
                position = 'aboveBar';
            } else if (beat === true) {
                color    = '#10b981';   // green = beat
                shape    = 'arrowUp';
                position = 'belowBar';
            } else if (beat === false) {
                color    = '#ef4444';   // red = miss
                shape    = 'arrowUp';
                position = 'belowBar';
            } else {
                color    = '#f59e0b';   // amber = no data
                shape    = 'arrowUp';
                position = 'belowBar';
            }

            markers.push({
                time:     candle.time,
                position,
                color,
                shape,
                text:     label || 'E',
                size:     2,
            });
        });

        // LightweightCharts requires markers sorted by time ascending
        markers.sort((a, b) => a.time - b.time);
        console.log('[Markers] placing', markers.length, 'markers');
        try { series.setMarkers(markers); } catch (e) { console.error('[Markers] setMarkers failed:', e); }
    };

    
    // Replace the existing fetchAndCacheEarningsDate function with this:
    const fetchAndCacheEarningsDate = async (sym, candles) => {
        console.log('🔔 fetchAndCacheEarningsDate CALLED for', sym, 'candles:', candles?.length);
        try {
            const BACKEND = 'https://backend-production-c0ab.up.railway.app';
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_history_chart_vault/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: sym }),
            });
            const json = await res.json();
            console.log('[EarningsHistory] raw response:', json);

            const allMarkers = [
                // Past earnings — colour by beat/miss
                ...(json.markers || []).map(m => ({
                    date:     m.date,
                    label:    buildMarkerLabel(m),
                    upcoming: false,
                    beat:     m.beat,
                    eps:      m.epsActual,
                    surprise: m.surprisePct,
                })),
                // Upcoming earnings
                ...(json.upcoming || []).map(m => ({
                    date:     m.date,
                    label:    `📅 E${m.epsEstimate != null ? ' est $' + m.epsEstimate : ''}`,
                    upcoming: true,
                    beat:     null,
                    eps:      null,
                    surprise: null,
                })),
            ];

            console.log('[EarningsHistory] total markers:', allMarkers.length);
            earningsMarkersRef.current = allMarkers;

            if (seriesRef.current && candles) {
                applyEarningsMarkers(seriesRef.current, candles, allMarkers);
            }
        } catch (e) {
            console.error('[EarningsHistory] fetch failed:', e);
            earningsMarkersRef.current = [];
        }
    };

    // Add this helper near the top of ChartInsightsTab (outside the component or inside before fetchAndCacheEarningsDate):
    const buildMarkerLabel = (m) => {
        const parts = ['E'];
        if (m.epsActual != null) {
            parts.push(`$${m.epsActual}`);
        }
        if (m.surprisePct != null) {
            parts.push(`(${m.surprisePct >= 0 ? '+' : ''}${m.surprisePct}%)`);
        }
        return parts.join(' ');
    };

    const applyIndicators = (chart, json, th) => {
        // clear old overlay series
        removeSeries(chart, twapSeriesRef);
        removeSeries(chart, bandTopRef);
        removeSeries(chart, bandBotRef);
        removeSeries(chart, bbMidRef);
        removeSeries(chart, bbTopRef);
        removeSeries(chart, bbBotRef);
        removeSeries(chart, ema20Ref);
        removeSeries(chart, ema50Ref);
        removeSeries(chart, ema200Ref);

        if (json.twap?.length) {
            const twapLine = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2, lineStyle: 1, title: 'TWAP', lastValueVisible: true, priceLineVisible: false });
            twapLine.setData(json.twap);
            twapSeriesRef.current = twapLine;
            const bTop = chart.addLineSeries({ color: 'rgba(245,158,11,0.25)', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
            bTop.setData(json.twapBandTop);
            bandTopRef.current = bTop;
            const bBot = chart.addLineSeries({ color: 'rgba(245,158,11,0.25)', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
            bBot.setData(json.twapBandBot);
            bandBotRef.current = bBot;
            setTwapStats(json.twapStats);
        } else { setTwapStats(null); }

        if (json.bbMid?.length) {
            const mid = chart.addLineSeries({ color: 'rgba(139,92,246,0.7)', lineWidth: 1, title: 'BB Mid', lastValueVisible: false, priceLineVisible: false });
            mid.setData(json.bbMid);
            bbMidRef.current = mid;
            const top = chart.addLineSeries({ color: 'rgba(139,92,246,0.4)', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
            top.setData(json.bbTop);
            bbTopRef.current = top;
            const bot = chart.addLineSeries({ color: 'rgba(139,92,246,0.4)', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
            bot.setData(json.bbBot);
            bbBotRef.current = bot;
        }

        if (json.ema20?.length) {
            const e20 = chart.addLineSeries({ color: '#10b981', lineWidth: 1, title: 'EMA20', lastValueVisible: false, priceLineVisible: false });
            e20.setData(json.ema20);
            ema20Ref.current = e20;
        }
        if (json.ema50?.length) {
            const e50 = chart.addLineSeries({ color: '#3b82f6', lineWidth: 1, title: 'EMA50', lastValueVisible: false, priceLineVisible: false });
            e50.setData(json.ema50);
            ema50Ref.current = e50;
        }
        if (json.ema200?.length) {
            const e200 = chart.addLineSeries({ color: '#ef4444', lineWidth: 1, title: 'EMA200', lastValueVisible: false, priceLineVisible: false });
            e200.setData(json.ema200);
            ema200Ref.current = e200;
        }

        // RSI badge (latest value)
        if (json.rsi?.length) {
            setRsiVal(json.rsi[json.rsi.length - 1]?.value ?? null);
        } else { setRsiVal(null); }
    };

    // Theme config lookup
    const getThemeConfig = (theme) => {
        if (theme === 'dark') return {
            bg: '#0f0f14', text: '#e0e0e0', grid: '#1e1e2e',
            border: '#2a2a3a', upColor: '#10b981', downColor: '#ef4444',
            lineColor: '#60a5fa', areaTop: 'rgba(96,165,250,0.25)', areaBot: 'rgba(96,165,250,0.02)',
        };
        if (theme === 'hud') return {
            bg: '#020b18', text: '#00d4ff', grid: '#0a2540',
            border: '#0d3a5c', upColor: '#00ffcc', downColor: '#ff4d6a',
            lineColor: '#00d4ff', areaTop: 'rgba(0,212,255,0.2)', areaBot: 'rgba(0,212,255,0.02)',
        };
        // light (default)
        return {
            bg: '#ffffff', text: '#333333', grid: '#f0f0f0',
            border: '#e0e0e0', upColor: '#10b981', downColor: '#ef4444',
            lineColor: '#2563eb', areaTop: 'rgba(37,99,235,0.2)', areaBot: 'rgba(37,99,235,0.02)',
        };
    };

    // -- Effect A: Create/recreate chart instance (ticker . theme . chartType change) --
    // Destroys old chart, builds fresh, fits content on first load
    useEffect(() => {
        if (!chartLoaded || !chartContainerRef.current || !ticker) return;
        const LC = window.LightweightCharts;

        if (chartRef.current) { try { chartRef.current.remove(); } catch {} chartRef.current = null; seriesRef.current = null; }

        const container = chartContainerRef.current;
        const th = getThemeConfig(chartTheme);
        const chart = LC.createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight || 360,
            layout: { background: { color: th.bg }, textColor: th.text },
            grid: { vertLines: { color: th.grid }, horzLines: { color: th.grid } },
            crosshair: { mode: LC.CrosshairMode.Normal },
            rightPriceScale: { borderColor: th.border },
            timeScale: { borderColor: th.border, timeVisible: true, secondsVisible: false },
            watermark: { visible: false },
        });
        chartRef.current = chart;

        const ro = new ResizeObserver(() => {
            if (chartRef.current && container.clientWidth > 0)
                chartRef.current.applyOptions({ width: container.clientWidth });
        });
        ro.observe(container);

        // Initial data load -- fitContent on first load
        const activeIndicators = [...(showTWAP?['twap']:[]), ...(showBB?['bb']:[]), ...(showRSI?['rsi']:[]), ...(showEMA?['ema']:[])];
        const initialLoad = async () => {
            setLoadingChart(true);
            setChartError(null);
            try {
                const json = await fetchChartData(ticker, chartInterval, activeIndicators, prePost);
                if (!chartRef.current) return;
                const th2 = getThemeConfig(chartTheme);
                let series;
                if (chartType === 'candlestick') {
                    series = chart.addCandlestickSeries({ upColor: th2.upColor, downColor: th2.downColor, borderUpColor: th2.upColor, borderDownColor: th2.downColor, wickUpColor: th2.upColor, wickDownColor: th2.downColor });
                    series.setData(json.candles);
                } else if (chartType === 'area') {
                    series = chart.addAreaSeries({ lineColor: th2.lineColor, topColor: th2.areaTop, bottomColor: th2.areaBot, lineWidth: 2 });
                    series.setData(json.candles.map(d => ({ time: d.time, value: d.value })));
                } else {
                    series = chart.addLineSeries({ color: th2.lineColor, lineWidth: 2 });
                    series.setData(json.candles.map(d => ({ time: d.time, value: d.value })));
                }
                seriesRef.current = series;
                applyIndicators(chart, json, th2);
                // Fetch upcoming earnings date async then re-apply markers
                // Pass candles directly so fetchAndCacheEarningsDate can paint
                // markers immediately when the async response comes back
                console.log('🔔 About to call fetchAndCacheEarningsDate for', ticker, 'candles:', json.candles?.length);
                fetchAndCacheEarningsDate(ticker, json.candles);
                // First paint with whatever is already cached (empty on first load)
                console.log('🔔 About to applyEarningsMarkers, series:', !!series, 'candles:', json.candles?.length);
                applyEarningsMarkers(series, json.candles);
                chart.timeScale().fitContent();
                setLastRefreshed(new Date());
            } catch (e) {
                setChartError('Could not load chart data. Check ticker or try again.');
            } finally {
                setLoadingChart(false);
            }
        };
        // -- Drawing mode click handler ----------------------------------------
        const handleChartClick = (param) => {
            if (!drawingModeRef.current || !param.point || !seriesRef.current) return;
            // coordinateToPrice lives on the series in LWC v4, not on priceScale
            const price = seriesRef.current.coordinateToPrice(param.point.y);
            if (price === null || price === undefined || isNaN(price)) return;
            const id = Date.now();
            const color = selectedLineColorRef.current;
            const pl = seriesRef.current.createPriceLine({
                price,
                color,
                lineWidth: 1,
                lineStyle: 2,
                axisLabelVisible: true,
                title: `$${price.toFixed(2)}`,
            });
            drawnLinesRef.current.push({ id, price, priceLine: pl, color });
            setDrawnLines(prev => [...prev, { id, price: price.toFixed(2), color }]);
        };
        chart.subscribeClick(handleChartClick);

        initialLoad();
        return () => { ro.disconnect(); chart.unsubscribeClick(handleChartClick); };
    }, [chartLoaded, ticker, chartType, chartTheme, showTWAP, showBB, showRSI, showEMA, prePost]); // < NO chartInterval here

    // -- Effect B: Refresh data only (interval change . manual refresh . auto-refresh) --
    // Preserves scroll/zoom position -- does NOT recreate the chart instance
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !ticker) return;

        const refreshData = async () => {
            setRefreshing(true);
            setChartError(null);
            try {
                const activeInd = [...(showTWAP?['twap']:[]), ...(showBB?['bb']:[]), ...(showRSI?['rsi']:[]), ...(showEMA?['ema']:[])];
                const json = await fetchChartData(ticker, chartInterval, activeInd, prePost);
                if (!seriesRef.current || !chartRef.current) return;

                // -- Viewport preservation ------------------------------------
                // We use getVisibleLogicalRange() (bar-index based) NOT
                // getVisibleRange() (time based). Reason: setData() triggers an
                // internal fitContent() inside LightweightCharts which resets the
                // time-based range before we can restore it. Logical range survives
                // this because it's index-relative and is re-applied AFTER the
                // internal fit completes.
                const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange();

                // Update price series in-place -- triggers LWC internal fitContent
                const mapData = (d) => chartType === 'candlestick' ? d : { time: d.time, value: d.value };
                seriesRef.current.setData(json.candles.map(mapData));

                // Update all indicator overlays in-place
                applyIndicators(chartRef.current, json, getThemeConfig(chartTheme));
                applyEarningsMarkers(seriesRef.current, json.candles);
                checkAlerts(json.candles);
                // After checkAlerts in refreshData():
                const latestClose = json.candles?.[json.candles.length - 1]?.close;
                if (latestClose && positions.length > 0) {
                    setPositions(prev => prev.map(pos => {
                        const isLong = pos.direction === 'long';
                        const pnl    = isLong
                            ? latestClose - pos.entry_price
                            : pos.entry_price - latestClose;
                        // Recalculate dollar distances live — these don't change, 
                        // but current_price drives the floating P&L line
                        return { ...pos, current_price: latestClose };
                    }));
                    // PATCH the backend for persistence
                    positions.forEach(pos => {
                        fetch(`${BACKEND}/api/positions/${pos.id}/price/`, {
                            method:  'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body:    JSON.stringify({ current_price: latestClose }),
                        }).catch(() => {});
                    });
                }

                // Restore logical position -- this runs AFTER the internal fit
                // so it wins. Only skip if we have no prior range (first load).
                if (logicalRange && logicalRange.from != null && logicalRange.to != null) {
                    chartRef.current.timeScale().setVisibleLogicalRange(logicalRange);
                }
                // If no prior range, leave whatever LWC fitted -- it's correct for first load
                setLastRefreshed(new Date());
                // End of refreshData() in Effect B, after setLastRefreshed:
                if (positions.length > 0 && showPositions) {
                    setTimeout(() => drawPositionLines(positions), 50);
                }
            } catch (e) {
                setChartError('Refresh failed. Check connection.');
            } finally {
                setRefreshing(false);
            }
        };

        refreshData();
    }, [chartInterval, refreshTick, prePost]); // < interval . manual refresh . prePost toggle

    useEffect(() => {
        if (ticker) fetchPositions(ticker);
    }, [ticker]);

    useEffect(() => {
        if (!positions.length) { clearPositionLines(); return; }
        if (showPositions && seriesRef.current) {
            drawPositionLines(positions);
        } else {
            clearPositionLines();
        }
    }, [positions, showPositions]);

    // -- Auto-refresh interval (30s) --
    useEffect(() => {
        if (autoRefreshRef.current) { clearInterval(autoRefreshRef.current); autoRefreshRef.current = null; }
        if (autoRefresh && ticker) {
            autoRefreshRef.current = setInterval(() => {
                setRefreshTick(t => t + 1); // nudges Effect B without rebuilding chart
            }, 30000);
        }
        return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
    }, [autoRefresh, ticker]);

    // -- Ask Sabrina for a full recommendation --
    const askSabrinaForRec = async (imageDataUrl = null) => {
        if (!openaiKey) { setRecError('OpenAI key not loaded yet.'); return; }
        setSabrinaLoading(true);
        setRecError(null);

        const priceInfo = stockData ? `
Ticker: ${ticker} | Name: ${stockData.longName || ticker}
Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'} | Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
P/E: ${stockData.trailingPE?.toFixed(2) || 'N/A'} | 52W High: $${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'} | 52W Low: $${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}
Sector: ${stockData.sector || 'N/A'} | Industry: ${stockData.industry || 'N/A'}` : `Ticker: ${ticker}`;

        const earningsInfo = earnings?.length ? `\nRecent Earnings (last 4Q):\n` + earnings.slice(0, 4).map(e =>
            `  ${e.quarter}: Rev $${e.revenue ? (e.revenue / 1e9).toFixed(2) + 'B' : 'N/A'}, EPS $${e.earnings ? (e.earnings / 1e9).toFixed(2) + 'B' : 'N/A'}`
        ).join('\n') : '';

        const yahooArticles = (news?.filter(n => n?.title) || []).slice(0, 4).map(n => {
            const parts = [`  * ${n.title}`];
            if (n.description) parts.push(`    ${n.description.substring(0, 180).trim()}`);
            return parts.join('\n');
        });
        const mktxArticles = (marketauxNews?.filter(n => n?.title) || []).slice(0, 4).map(n => {
            const parts = [`  * [Marketaux] ${n.title}`];
            if (n.description) parts.push(`    ${n.description.substring(0, 180).trim()}`);
            if (n.highlights && typeof n.highlights === 'string' && n.highlights.length > 10) {
                parts.push(`    KEY QUOTE: "${n.highlights.substring(0, 200).trim()}"`);
            }
            return parts.join('\n');
        });
        const allArticles = [...yahooArticles, ...mktxArticles];
        const newsInfo = allArticles.length
            ? `\nNews Articles (${allArticles.length} total):\n` + allArticles.join('\n\n')
            : '';

        const aiInsightsInfo = cachedNewsAnalysis ? `\nNews AI Analysis: ${cachedNewsAnalysis.bias} bias (${cachedNewsAnalysis.confidence}% confidence)\nTL;DR: ${cachedNewsAnalysis.tldr}` : '';

        const twapInfo = twapStats ? `\nTWAP Analysis (time-weighted avg price via integral):
  TWAP: $${twapStats.twap} | Current: $${twapStats.current}
  Deviation from TWAP: ${twapStats.deviation > 0 ? '+' : ''}${twapStats.deviation}% (+/-1sigma = $${twapStats.std})
  Signal: ${twapStats.signal === 'EXTENDED_ABOVE' ? 'Price is EXTENDED above TWAP -- mean reversion risk downward' : twapStats.signal === 'EXTENDED_BELOW' ? 'Price is EXTENDED below TWAP -- potential mean reversion bounce' : 'Price is NEAR TWAP -- no strong mean reversion pressure'}` : '';

        const textPrompt = `You are Sabrina, a sharp AI stock analyst. Give me a comprehensive trading recommendation for ${ticker}.

AVAILABLE DATA:
${priceInfo}${earningsInfo}${newsInfo}${aiInsightsInfo}${twapInfo}
${imageDataUrl ? '\nA chart screenshot has been attached. Analyse the price action, trend, support/resistance levels, and any patterns visible.' : '\nNo chart image provided -- base analysis on the fundamental data above.'}

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "verdict": "BUY" | "SELL" | "HOLD" | "WATCH",
  "confidence": <0-100>,
  "priceTarget": "<e.g. $195-210 in 3-6 months or N/A>",
  "timeframe": "<e.g. Short-term (1-3 months)>",
  "summary": "<2-3 sentences, sharp and direct>",
  "bullCase": "<1-2 sentences>",
  "bearCase": "<1-2 sentences>",
  "keyLevels": "<support and resistance if chart provided, else N/A>",
  "catalysts": ["<catalyst 1>", "<catalyst 2>"],
  "risks": ["<risk 1>", "<risk 2>"],
  "sabrinaQuote": "<one punchy first-person take, 1 sentence, with personality>"
}`;

        try {
            const messages = imageDataUrl ? [
                {
                    role: 'user',
                    content: [
                        { type: 'image_url', image_url: { url: imageDataUrl } },
                        { type: 'text', text: textPrompt }
                    ]
                }
            ] : [{ role: 'user', content: textPrompt }];

            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
                body: JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: 900, temperature: 0.65 })
            });
            const data = await res.json();
            const raw = data.choices?.[0]?.message?.content || '';
            const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
            setSabrinaRec({ ...parsed, generatedAt: new Date().toLocaleString(), hadChart: !!imageDataUrl });
        } catch (e) {
            setRecError('Sabrina hit a snag. Try again 😼');
        } finally {
            setSabrinaLoading(false);
        }
    };

    // -- Capture chart as image then send to Sabrina --
    const captureAndAnalyse = async () => {
        setScreenshotting(true);
        try {
            // TradingView Lightweight Charts has a built-in screenshot method
            if (chartRef.current) {
                const canvas = chartRef.current.takeScreenshot();
                const dataUrl = canvas.toDataURL('image/png');
                await askSabrinaForRec(dataUrl);
            } else {
                await askSabrinaForRec(null);
            }
        } catch {
            await askSabrinaForRec(null);
        } finally {
            setScreenshotting(false);
        }
    };

    const verdictConfig = {
        BUY:   { color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', icon: '📈', label: 'BUY' },
        SELL:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '📉', label: 'SELL' },
        HOLD:  { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '|', label: 'HOLD' },
        WATCH: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '👁', label: 'WATCH' },
    };
    const vc = verdictConfig[sabrinaRec?.verdict] || verdictConfig.WATCH;

    const recentEarnings = earnings?.slice(0, 6).filter(e => e.revenue || e.earnings) || [];

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: 'transparent' }}>

            {/* -- Chart Card -- */}
            {(() => {
            const th = getThemeConfig(chartTheme);
            const cardBg     = th.bg;
            const cardBorder = chartTheme === 'light' ? '#e8e8e8' : chartTheme === 'dark' ? '#2a2a3a' : '#0d3a5c';
            const cardShadow = chartTheme === 'hud'   ? '0 2px 16px rgba(0,212,255,0.12)' : chartTheme === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)';
            return (
            <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, boxShadow: cardShadow, marginBottom: '20px' }}>

                {/* Chart toolbar -- theme-aware, grouped intervals */}
                {(() => {
                    const th = getThemeConfig(chartTheme);
                    const toolbarBg     = chartTheme === 'light' ? '#fafafa' : chartTheme === 'dark' ? '#1a1a2e' : '#020f1f';
                    const toolbarBorder = chartTheme === 'light' ? '#f0f0f0' : chartTheme === 'dark' ? '#2a2a3a' : '#0d3a5c';
                    const titleColor    = chartTheme === 'hud'   ? '#00d4ff' : chartTheme === 'dark' ? '#e0e0e0' : '#1a1a1a';
                    const btnBase       = chartTheme === 'light' ? { bg: '#fff', text: '#555', border: '#e0e0e0' }
                                       : chartTheme === 'dark'  ? { bg: '#1e1e2e', text: '#aaa', border: '#2a2a3a' }
                                       :                          { bg: '#0a1f35', text: '#00aacc', border: '#0d3a5c' };
                    const btnActive     = chartTheme === 'hud'   ? { bg: '#00d4ff', text: '#020b18', border: '#00d4ff' }
                                       :                          { bg: '#2563eb',  text: '#fff',    border: '#2563eb' };
                    const intraday  = intervals.filter(iv => intervalConfig[iv].group === 'Intraday');
                    const daily     = intervals.filter(iv => intervalConfig[iv].group === 'Daily+');
                    return (
                        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${toolbarBorder}`, backgroundColor: toolbarBg, borderRadius: '12px 12px 0 0' }}>
                            {/* Row 1: title + chart type + theme */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: titleColor, marginRight: '4px' }}>
                                    {chartTheme === 'hud' ? 'HUD' : '📊'} {ticker}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {[['candlestick','🕯 Candle'],['area','📉 Area'],['line','~ Line']].map(([t, lbl]) => {
                                        const active = chartType === t;
                                        return <button key={t} onClick={() => setChartType(t)} style={{
                                            padding: '4px 10px', fontSize: '11px', fontWeight: '700', borderRadius: '6px',
                                            border: `1px solid ${active ? btnActive.border : btnBase.border}`,
                                            backgroundColor: active ? btnActive.bg : btnBase.bg,
                                            color: active ? btnActive.text : btnBase.text,
                                            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                                        }}>{lbl}</button>;
                                    })}
                                </div>
                                {/* Indicator toggles */}
                                {[
                                    { key: 'twap', label: 'TWAP TWAP',   active: showTWAP, toggle: () => setShowTWAP(s=>!s), color: '#f59e0b' },
                                    { key: 'bb',   label: 'BB',       active: showBB,   toggle: () => setShowBB(s=>!s),   color: '#8b5cf6' },
                                    { key: 'ema',  label: 'EMA',      active: showEMA,  toggle: () => setShowEMA(s=>!s),  color: '#10b981' },
                                    { key: 'rsi',  label: `RSI${rsiVal !== null ? ' ' + rsiVal.toFixed(0) : ''}`, active: showRSI, toggle: () => setShowRSI(s=>!s), color: rsiVal > 70 ? '#ef4444' : rsiVal < 30 ? '#10b981' : '#60a5fa' },
                                ].map(({ key, label, active, toggle, color }) => (
                                    <button key={key} onClick={toggle} style={{
                                        padding: '4px 9px', fontSize: '11px', fontWeight: '700', borderRadius: '6px',
                                        border: `1px solid ${active ? color : btnBase.border}`,
                                        backgroundColor: active ? color + '1a' : btnBase.bg,
                                        color: active ? color : btnBase.text,
                                        cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                                    }}>{label}</button>
                                ))}

                                {/* Session tracker widget */}
                                {sessionNow && (() => {
                                    const s = sessionNow;
                                    return (
                                        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'8px', backgroundColor: s.color+'14', border:`1px solid ${s.color}30`, marginLeft:'auto' }}>
                                            <span style={{ width:'7px', height:'7px', borderRadius:'50%', backgroundColor:s.dot, flexShrink:0,
                                                boxShadow: s.session === 'regular' ? `0 0 0 2px ${s.dot}30` : 'none',
                                                animation: s.session === 'regular' ? 'sessionPulse 2s ease-in-out infinite' : 'none',
                                            }} />
                                            <span style={{ fontSize:'11px', fontWeight:'700', color:s.color, whiteSpace:'nowrap' }}>{s.label}</span>
                                            <span style={{ fontSize:'10px', color:s.color, opacity:0.7, whiteSpace:'nowrap' }}>{s.nyTimeStr} {s.tzLabel}</span>
                                        </div>
                                    );
                                })()}

                                {/* Theme switcher */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[['light','Sun️'],['dark','🌙'],['hud','HUD HUD']].map(([t, lbl]) => {
                                        const active = chartTheme === t;
                                        return <button key={t} onClick={() => setChartTheme(t)} style={{
                                            padding: '4px 9px', fontSize: '11px', fontWeight: '700', borderRadius: '6px',
                                            border: `1px solid ${active ? btnActive.border : btnBase.border}`,
                                            backgroundColor: active ? btnActive.bg : btnBase.bg,
                                            color: active ? btnActive.text : btnBase.text,
                                            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                                        }}>{lbl}</button>;
                                    })}
                                </div>
                            </div>
                            {/* Row 2: interval groups */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: btnBase.text, opacity: 0.6, letterSpacing: '0.07em', flexShrink: 0 }}>INTRADAY</span>
                                {intraday.map(iv => {
                                    const active = chartInterval === iv;
                                    return <button key={iv} onClick={() => setChartInterval(iv)} style={{
                                        padding: '4px 9px', fontSize: '11px', fontWeight: '700', borderRadius: '6px',
                                        border: `1px solid ${active ? btnActive.border : btnBase.border}`,
                                        backgroundColor: active ? btnActive.bg : btnBase.bg,
                                        color: active ? btnActive.text : btnBase.text,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>{intervalConfig[iv].label}</button>;
                                })}
                                <div style={{ width: '1px', height: '18px', backgroundColor: toolbarBorder, flexShrink: 0 }} />
                                <span style={{ fontSize: '10px', fontWeight: '700', color: btnBase.text, opacity: 0.6, letterSpacing: '0.07em', flexShrink: 0 }}>DAILY+</span>
                                {daily.map(iv => {
                                    const active = chartInterval === iv;
                                    return <button key={iv} onClick={() => setChartInterval(iv)} style={{
                                        padding: '4px 9px', fontSize: '11px', fontWeight: '700', borderRadius: '6px',
                                        border: `1px solid ${active ? btnActive.border : btnBase.border}`,
                                        backgroundColor: active ? btnActive.bg : btnBase.bg,
                                        color: active ? btnActive.text : btnBase.text,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>{intervalConfig[iv].label}</button>;
                                })}
                                <div style={{ width:'1px', height:'16px', backgroundColor:toolbarBorder, flexShrink:0, alignSelf:'center' }} />
                                {/* Pre/Post market toggle -- intraday only */}
                                {(() => {
                                    const isIntraday = intervalConfig[chartInterval]?.group === 'Intraday';
                                    const active = prePost && isIntraday;
                                    return (
                                        <button
                                            onClick={() => isIntraday && setPrePost(p => !p)}
                                            title={isIntraday ? 'Toggle pre/post market data' : 'Pre/post only available on intraday timeframes'}
                                            style={{
                                                padding:'4px 10px', fontSize:'11px', fontWeight:'700', borderRadius:'6px',
                                                border:`1px solid ${active ? '#f59e0b' : btnBase.border}`,
                                                backgroundColor: active ? 'rgba(245,158,11,0.14)' : btnBase.bg,
                                                color: active ? '#f59e0b' : isIntraday ? btnBase.text : (btnBase.text + '50'),
                                                cursor: isIntraday ? 'pointer' : 'not-allowed',
                                                transition:'all 0.15s', whiteSpace:'nowrap', opacity: isIntraday ? 1 : 0.45,
                                            }}
                                        >🌅 Pre/Post</button>
                                    );
                                })()}
                            </div>
                        </div>
                    );
                })()}

                {/* Chart container -- explicit height so LightweightCharts renders correctly */}
                <div style={{ position: 'relative', width: '100%', height: '360px' }}>
                    {(loadingChart || !chartLoaded) && (() => {
                        const th2 = getThemeConfig(chartTheme);
                        const overlayBg   = chartTheme === 'dark' ? 'rgba(15,15,20,0.88)' : chartTheme === 'hud' ? 'rgba(2,11,24,0.88)' : 'rgba(255,255,255,0.9)';
                        const overlayText = chartTheme === 'hud' ? '#00d4ff' : chartTheme === 'dark' ? '#aaa' : '#666';
                        return (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: overlayBg, zIndex: 2 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
                                <div style={{ color: overlayText, fontSize: '14px' }}>{!chartLoaded ? 'Loading chart library...' : 'Fetching data...'}</div>
                            </div>
                        </div>
                        );
                    })()}
                    {chartError && !loadingChart && (() => {
                        const th3 = getThemeConfig(chartTheme);
                        const errBg = chartTheme === 'dark' ? 'rgba(15,15,20,0.95)' : chartTheme === 'hud' ? 'rgba(2,11,24,0.95)' : 'rgba(255,255,255,0.97)';
                        return (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', backgroundColor: errBg }}>
                            <div style={{ fontSize: '32px' }}>!️</div>
                            <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', padding: '0 20px' }}>{chartError}</div>
                            <button onClick={() => { setChartError(null); setChartInterval(chartInterval); }} style={{ marginTop: '8px', padding: '6px 14px', backgroundColor: chartTheme==='hud'?'#00d4ff':'#2563eb', color: chartTheme==='hud'?'#020b18':'#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Retry</button>
                        </div>
                        );
                    })()}
                    <div ref={chartContainerRef} style={{ width: '100%', height: '100%', cursor: drawingMode ? 'crosshair' : 'default' }} />
                    {drawingMode && (
                        <div style={{ position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)', backgroundColor:'rgba(245,158,11,0.9)', color:'#fff', fontSize:'11px', fontWeight:'700', padding:'4px 12px', borderRadius:'20px', pointerEvents:'none', whiteSpace:'nowrap', zIndex:10 }}>
                            Edit️ Click on chart to drop a level line
                        </div>
                    )}
                </div>

                {/* TWAP stats strip */}
                {showTWAP && twapStats && (() => {
                    const stripBg  = chartTheme === 'hud' ? '#020f1f' : chartTheme === 'dark' ? '#141420' : '#fffbeb';
                    const stripBdr = chartTheme === 'hud' ? '#0d3a5c' : chartTheme === 'dark' ? '#2a2a3a' : '#fde68a';
                    const isAbove  = twapStats.signal === 'EXTENDED_ABOVE';
                    const isBelow  = twapStats.signal === 'EXTENDED_BELOW';
                    const sigColor = isAbove ? '#ef4444' : isBelow ? '#10b981' : '#f59e0b';
                    const sigLabel = isAbove ? '^ Extended Above -- mean reversion risk v'
                                   : isBelow ? 'v Extended Below -- potential bounce ^'
                                   : '<-> Near TWAP -- balanced';
                    return (
                        <div style={{ padding: '9px 16px', borderTop: `1px solid ${stripBdr}`, backgroundColor: stripBg, display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.06em' }}>TWAP TWAP</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: chartTheme === 'light' ? '#333' : '#e0e0e0' }}>${twapStats.twap}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#aaa' }}>Deviation</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: twapStats.deviation > 0 ? '#ef4444' : '#10b981' }}>
                                    {twapStats.deviation > 0 ? '+' : ''}{twapStats.deviation}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: '#aaa' }}>+/-1sigma</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: chartTheme === 'light' ? '#555' : '#aaa' }}>${twapStats.std}</span>
                            </div>
                            <div style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: sigColor + '18', border: `1px solid ${sigColor}40`, fontSize: '11px', fontWeight: '700', color: sigColor }}>
                                {sigLabel}
                            </div>
                        </div>
                    );
                })()}

                {/* Position detail panel */}
                {showPositions && positions.length > 0 && (
                    <div style={{
                        padding:         '12px 16px',
                        borderTop:       `1px solid ${chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e2e8f0'}`,
                        backgroundColor: chartTheme==='hud'?'#020f1f':chartTheme==='dark'?'#141420':'#fffbeb',
                        display:         'flex', flexDirection: 'column', gap: '10px',
                    }}>
                        <div style={{
                            fontSize: '10px', fontWeight: '700',
                            color: '#f59e0b', letterSpacing: '0.08em',
                        }}>
                            📌 OPEN POSITIONS — {ticker}
                        </div>

                        {positions.map(pos => {
                            const isLong   = pos.direction === 'long';
                            const pnl      = pos.current_price
                                ? (isLong
                                    ? pos.current_price - pos.entry_price
                                    : pos.entry_price   - pos.current_price)
                                : null;
                            const pnlPct   = pnl != null
                                ? (pnl / pos.entry_price * 100).toFixed(2)
                                : null;
                            const rr = pos.sl_dollars && pos.tp_dollars
                                ? (Math.abs(pos.tp_dollars) / Math.abs(pos.sl_dollars)).toFixed(2)
                                : null;

                            return (
                                <div key={pos.id} style={{
                                    display:         'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                    gap:             '8px',
                                    padding:         '10px 12px',
                                    backgroundColor: chartTheme==='dark'||chartTheme==='hud' ? '#1e1e2e' : '#fff',
                                    borderRadius:    '8px',
                                    border:          `1px solid ${isLong ? '#3b82f630' : '#f8717130'}`,
                                    borderLeft:      `3px solid ${isLong ? '#3b82f6' : '#f87171'}`,
                                }}>
                                    {/* Asset + direction */}
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>
                                            POSITION
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: isLong ? '#3b82f6' : '#f87171' }}>
                                            {isLong ? '▲ LONG' : '▼ SHORT'}
                                        </div>
                                        {pos.notes && (
                                            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                                                {pos.notes.slice(0, 30)}{pos.notes.length > 30 ? '…' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Entry */}
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>ENTRY</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#3b82f6', fontFamily: 'monospace' }}>
                                            ${pos.entry_price}
                                        </div>
                                    </div>

                                    {/* SL */}
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>STOP LOSS</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444', fontFamily: 'monospace' }}>
                                            ${pos.sl_price ?? '—'}
                                        </div>
                                        {pos.sl_dollars != null && (
                                            <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '1px' }}>
                                                -${Math.abs(pos.sl_dollars).toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* TP */}
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>TAKE PROFIT</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', fontFamily: 'monospace' }}>
                                            ${pos.tp_price ?? '—'}
                                        </div>
                                        {pos.tp_dollars != null && (
                                            <div style={{ fontSize: '10px', color: '#10b981', marginTop: '1px' }}>
                                                +${Math.abs(pos.tp_dollars).toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Current price + live P&L */}
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>NOW</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#f59e0b', fontFamily: 'monospace' }}>
                                            ${pos.current_price?.toFixed(2) ?? '—'}
                                        </div>
                                        {pnl != null && (
                                            <div style={{ fontSize: '10px', color: pnl >= 0 ? '#10b981' : '#ef4444', marginTop: '1px', fontWeight: '700' }}>
                                                {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}{pnlPct}%)
                                            </div>
                                        )}
                                    </div>

                                    {/* R:R */}
                                    {rr && (
                                        <div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginBottom: '3px' }}>R:R</div>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: parseFloat(rr) >= 2 ? '#10b981' : parseFloat(rr) >= 1 ? '#f59e0b' : '#ef4444', fontFamily: 'monospace' }}>
                                                1:{rr}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Indicator legend strip */}
                {(showEMA || showBB || (showRSI && rsiVal !== null)) && (() => {
                    const stripBg  = chartTheme==='hud'?'#020f1f':chartTheme==='dark'?'#141420':'#f8f8ff';
                    const stripBdr = chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#ede9fe';
                    const textC    = chartTheme==='light'?'#555':'#aaa';
                    const rsiColor = rsiVal > 70 ? '#ef4444' : rsiVal < 30 ? '#10b981' : '#60a5fa';
                    return (
                        <div style={{ padding: '7px 16px', borderTop:`1px solid ${stripBdr}`, backgroundColor: stripBg, display:'flex', gap:'16px', flexWrap:'wrap', alignItems:'center' }}>
                            {showEMA && <span style={{ fontSize:'11px', color: textC }}>
                                <span style={{ color:'#10b981', fontWeight:'700' }}>- EMA20</span>
                                {'  '}<span style={{ color:'#3b82f6', fontWeight:'700' }}>- EMA50</span>
                                {'  '}<span style={{ color:'#ef4444', fontWeight:'700' }}>- EMA200</span>
                            </span>}
                            {showBB && <span style={{ fontSize:'11px', color:'#8b5cf6', fontWeight:'700' }}>
                                -- BB(20,2)
                            </span>}
                            {showRSI && rsiVal !== null && (
                                <span style={{ fontSize:'11px', display:'flex', alignItems:'center', gap:'6px' }}>
                                    <span style={{ color: textC }}>RSI(14)</span>
                                    <span style={{ fontWeight:'800', fontSize:'13px', color: rsiColor }}>{rsiVal.toFixed(1)}</span>
                                    <span style={{ padding:'2px 8px', borderRadius:'20px', backgroundColor: rsiColor+'18', border:`1px solid ${rsiColor}40`, color: rsiColor, fontSize:'10px', fontWeight:'700' }}>
                                        {rsiVal > 70 ? 'OVERBOUGHT' : rsiVal < 30 ? 'OVERSOLD' : 'NEUTRAL'}
                                    </span>
                                </span>
                            )}
                        </div>
                    );
                })()}

                {/* Chart action bar -- theme-aware */}
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#f0f0f0'}`, backgroundColor: chartTheme==='hud'?'#020f1f':chartTheme==='dark'?'#1a1a2e':'#fafafa', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', borderRadius: '0 0 12px 12px' }}>
                    {/* Manual refresh */}
                    <button
                        onClick={() => setRefreshTick(t => t + 1)}
                        disabled={refreshing || loadingChart}
                        title="Refresh chart data"
                        style={{
                            padding: '8px 13px', borderRadius: '9px', fontSize: '13px', fontWeight: '700',
                            border: `1px solid ${chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor: refreshing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.15s',
                        }}
                    >
                        <span style={{ display: 'inline-block', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>🔄</span>
                    </button>
                    {/* Auto-refresh toggle */}
                    <button
                        onClick={() => setAutoRefresh(a => !a)}
                        title={autoRefresh ? 'Auto-refresh ON (30s) -- click to disable' : 'Enable auto-refresh every 30s'}
                        style={{
                            padding: '8px 12px', borderRadius: '9px', fontSize: '12px', fontWeight: '700',
                            border: `1px solid ${autoRefresh ? (chartTheme==='hud'?'#00d4ff':'#10b981') : (chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0')}`,
                            backgroundColor: autoRefresh ? (chartTheme==='hud'?'rgba(0,212,255,0.12)':'rgba(16,185,129,0.1)') : (chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff'),
                            color: autoRefresh ? (chartTheme==='hud'?'#00d4ff':'#10b981') : (chartTheme==='hud'?'rgba(0,212,255,0.4)':chartTheme==='dark'?'#555':'#aaa'),
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.15s',
                        }}
                    >
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: autoRefresh ? (chartTheme==='hud'?'#00d4ff':'#10b981') : 'currentColor', display: 'inline-block', opacity: autoRefresh ? 1 : 0.35 }} />
                        {autoRefresh ? '30s' : 'Auto'}
                    </button>
                    {/* Last refreshed */}
                    {lastRefreshed && (
                        <span style={{ fontSize: '11px', color: chartTheme==='hud'?'rgba(0,212,255,0.35)':chartTheme==='dark'?'#3a3a4a':'#ccc' }}>
                            {lastRefreshed.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                        </span>
                    )}
                    <div style={{ width: '1px', height: '20px', backgroundColor: chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e8e8e8', flexShrink: 0 }} />
                    {/* Analyst ratings button */}
                    <button
                        onClick={() => analystData ? setShowAnalystPanel(p=>!p) : fetchAnalystRatings(ticker)}
                        disabled={analystLoading}
                        style={{
                            padding: '8px 13px', borderRadius: '9px', fontSize: '12px', fontWeight: '700',
                            border: `1px solid ${showAnalystPanel && analystData ? '#10b981' : chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: showAnalystPanel && analystData ? 'rgba(16,185,129,0.1)' : chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: showAnalystPanel && analystData ? '#10b981' : chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor: analystLoading ? 'wait' : 'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s',
                        }}
                    >
                        {analystLoading ? <span style={{animation:'spin 0.8s linear infinite',display:'inline-block'}}>⏳</span> : '🏦'} Analyst Ratings
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e8e8e8', flexShrink: 0 }} />
                    {/* TradingView link */}
                    <a
                        href={`https://www.tradingview.com/chart/?symbol=${ticker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${ticker} on TradingView`}
                        style={{
                            padding: '8px 13px', borderRadius: '9px', fontSize: '12px', fontWeight: '700',
                            border: `1px solid ${chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#2962ff',
                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2962ff'; e.currentTarget.style.color = '#2962ff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'; e.currentTarget.style.color = chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#2962ff'; }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v2H5v14h14v-5h2v7H3V3zm11 0h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/></svg>
                        TradingView
                    </a>
                    <div style={{ width: '1px', height: '20px', backgroundColor: chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e8e8e8', flexShrink: 0 }} />
                    {/* Earnings markers toggle */}
                    <button onClick={() => {
                        setShowEarningsMarkers(v => {
                            const next = !v;
                            // re-apply immediately using current candle data
                            if (seriesRef.current) {
                                if (!next) { try { seriesRef.current.setMarkers([]); } catch {} }
                                else { setRefreshTick(t => t + 1); }
                            }
                            return next;
                        });
                    }} title="Toggle earnings date markers on chart"
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${showEarningsMarkers?'#f59e0b':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: showEarningsMarkers?'rgba(245,158,11,0.12)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: showEarningsMarkers?'#f59e0b':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        💰 {showEarningsMarkers ? 'Earnings v' : 'Earnings'}
                    </button>
                    {/* Drawing tools toggle */}
                    <button onClick={() => setDrawingMode(m => !m)} title={drawingMode ? 'Drawing mode ON -- click chart to drop a line' : 'Enable drawing mode'}
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${drawingMode?'#f59e0b':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: drawingMode?'rgba(245,158,11,0.12)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: drawingMode?'#f59e0b':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        Edit️ {drawingMode ? 'Drawing' : 'Draw'}
                    </button>

                    {/* Compare */}
                    <button onClick={() => setShowComparePicker(true)}
                        title="Compare with another asset"
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${compareTicker?'#3b82f6':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: compareTicker?'rgba(59,130,246,0.12)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: compareTicker?'#3b82f6':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        + {compareTicker ? `vs ${compareTicker}` : 'Compare'}
                    </button>
                    {/* Video record */}
                    <button
                        onClick={() => isRecording ? stopRecording() : recordChartVideo(45)}
                        title={isRecording ? 'Stop recording' : 'Record chart playback video'}
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${isRecording?'#ef4444':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: isRecording?'rgba(239,68,68,0.12)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: isRecording?'#ef4444':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        {isRecording
                            ? <><span style={{ width:'8px', height:'8px', borderRadius:'2px', backgroundColor:'#ef4444', display:'inline-block', animation:'pulse 1s ease-in-out infinite' }} /> Stop ({recordingProgress}%)</>
                            : <>🎬 Record</>}
                    </button>
                    {/* Price alert */}
                    <button onClick={() => { console.log('[Alert] opening modal for', ticker); setShowAlertForm(true); }} title="Set price alert"
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${alerts.filter(a=>a.ticker===ticker).length?'#ef4444':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: alerts.filter(a=>a.ticker===ticker).length?'rgba(239,68,68,0.1)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: alerts.filter(a=>a.ticker===ticker).length?'#ef4444':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        🔔 {alerts.filter(a=>a.ticker===ticker).length > 0 ? `Alert (${alerts.filter(a=>a.ticker===ticker).length})` : 'Alert'}
                    </button>

                    {/* Options flow */}
                    <button onClick={() => { console.log('[Options] clicked, ticker:', ticker); setShowOptionsPanel(true); fetchOptions(ticker); }} disabled={optionsLoading}
                        title="Options flow -- put/call ratio, key strikes"
                        style={{ padding:'8px 12px', borderRadius:'9px', fontSize:'12px', fontWeight:'700',
                            border:`1px solid ${showOptionsPanel&&optionsData?'#8b5cf6':chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: showOptionsPanel&&optionsData?'rgba(139,92,246,0.1)':chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: showOptionsPanel&&optionsData?'#8b5cf6':chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor: optionsLoading?'wait':'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                        {optionsLoading ? <span style={{animation:'spin 0.8s linear infinite',display:'inline-block'}}>⏳</span> : '🎯'} Options
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e8e8e8', flexShrink: 0 }} />
                    {/* Position lines toggle */}
                    <button
                        onClick={() => setShowPositions(p => !p)}
                        title={positions.length > 0 ? `${positions.length} position(s) for ${ticker}` : 'No positions for this ticker'}
                        style={{
                            padding: '8px 12px', borderRadius: '9px', fontSize: '12px', fontWeight: '700',
                            border: `1px solid ${showPositions && positions.length > 0 ? '#3b82f6' : chartTheme==='hud'?'#0d3a5c':chartTheme==='dark'?'#2a2a3a':'#e0e0e0'}`,
                            backgroundColor: showPositions && positions.length > 0
                                ? 'rgba(59,130,246,0.12)'
                                : chartTheme==='hud'?'#0a1f35':chartTheme==='dark'?'#1e1e2e':'#fff',
                            color: showPositions && positions.length > 0
                                ? '#3b82f6'
                                : chartTheme==='hud'?'#00d4ff':chartTheme==='dark'?'#aaa':'#555',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                            opacity: positionsLoading ? 0.6 : 1,
                        }}
                    >
                        {positionsLoading
                            ? <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span>
                            : '📌'}
                        {positions.length > 0 ? `${positions.length} Position${positions.length > 1 ? 's' : ''}` : 'Positions'}
                    </button>
                    <button
                        onClick={captureAndAnalyse}
                        disabled={sabrinaLoading || screenshotting || !chartLoaded}
                        style={{
                            padding: '9px 18px', borderRadius: '10px',
                            background: sabrinaLoading || screenshotting ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                            border: 'none', color: '#fff', fontSize: '13px', fontWeight: '700',
                            cursor: sabrinaLoading || screenshotting ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {screenshotting ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>📸</span> Capturing...</> :
                         sabrinaLoading ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Analysing...</> :
                         <>😼 Send Chart to Sabrina</>}
                    </button>

                    <button
                        onClick={() => askSabrinaForRec(null)}
                        disabled={sabrinaLoading}
                        style={{
                            padding: '9px 16px', borderRadius: '10px',
                            backgroundColor: '#fff', border: '1px solid #e0e0e0',
                            color: '#555', fontSize: '13px', fontWeight: '600',
                            cursor: sabrinaLoading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        📋 Fundamentals Only
                    </button>

                    {sabrinaRec && (
                        <div style={{ marginLeft: 'auto', fontSize: '12px', color: chartTheme==='hud'?'rgba(0,212,255,0.5)':chartTheme==='dark'?'#555':'#aaa' }}>
                            Last rec: {sabrinaRec.generatedAt} {sabrinaRec.hadChart ? '. 📸 with chart' : '. 📋 fundamentals only'}
                        </div>
                    )}
                </div>
            </div>
            ); })()}

            {/* == ALERT MODAL ================================================== */}
            {showAlertForm && (
                <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }}
                    onClick={e => { if (e.target === e.currentTarget) setShowAlertForm(false); }}>
                    <div style={{ backgroundColor:'#fff', borderRadius:'16px', padding:'28px', width:'360px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ fontSize:'18px', fontWeight:'800', marginBottom:'6px' }}>🔔 Price Alert -- {ticker}</div>
                        <div style={{ fontSize:'12px', color:'#999', marginBottom:'20px' }}>
                            Auto-checks every 30s. Toast fires when level is breached.
                        </div>
                        <div style={{ marginBottom:'12px' }}>
                            <label style={{ fontSize:'12px', fontWeight:'700', color:'#555', display:'block', marginBottom:'6px' }}>DIRECTION</label>
                            <div style={{ display:'flex', gap:'8px' }}>
                                {['above','below'].map(d => (
                                    <button key={d} onClick={() => setAlertDir(d)}
                                        style={{ flex:1, padding:'9px', borderRadius:'8px', border:`2px solid ${alertDir===d?'#ef4444':'#e0e0e0'}`,
                                            backgroundColor: alertDir===d?'#fef2f2':'#fff',
                                            color: alertDir===d?'#ef4444':'#555', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
                                        {d === 'above' ? '^ Goes above' : 'v Drops below'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom:'20px' }}>
                            <label style={{ fontSize:'12px', fontWeight:'700', color:'#555', display:'block', marginBottom:'6px' }}>TARGET PRICE</label>
                            <input type="number" step="0.01" placeholder={`e.g. ${stockData?.currentPrice?.toFixed(2) || '195.00'}`}
                                value={alertPrice} onChange={e => setAlertPrice(e.target.value)}
                                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', border:'2px solid #e0e0e0', fontSize:'15px', fontWeight:'700', boxSizing:'border-box', outline:'none' }} />
                        </div>
                        {/* Existing alerts for this ticker */}
                        {alerts.filter(a => a.ticker === ticker).length > 0 && (
                            <div style={{ marginBottom:'16px' }}>
                                <div style={{ fontSize:'11px', fontWeight:'700', color:'#999', marginBottom:'8px', letterSpacing:'0.07em' }}>ACTIVE ALERTS</div>
                                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                                    {alerts.filter(a => a.ticker === ticker).map(a => (
                                        <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'20px', backgroundColor:'#fef2f2', border:'1px solid #fecaca', fontSize:'12px', color:'#b91c1c', fontWeight:'700' }}>
                                            {a.dir === 'above' ? '^' : 'v'} ${a.price}
                                            <button onClick={() => saveAlerts(alerts.filter(x => x.id !== a.id))}
                                                style={{ background:'none', border:'none', cursor:'pointer', color:'#b91c1c', fontWeight:'900', fontSize:'14px', lineHeight:1, padding:0 }}>x</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display:'flex', gap:'8px' }}>
                            <button onClick={() => {
                                if (!alertPrice) return;
                                const newAlert = { id: Date.now(), ticker, price: parseFloat(alertPrice), dir: alertDir };
                                console.log('[Alert] Saving alert:', newAlert);
                                saveAlerts([...alerts, newAlert]);
                                setAlertPrice('');
                                setShowAlertForm(false);
                            }} style={{ flex:1, padding:'11px', borderRadius:'9px', backgroundColor:'#ef4444', color:'#fff', border:'none', fontWeight:'800', fontSize:'14px', cursor:'pointer' }}>
                                Set Alert
                            </button>
                            <button onClick={() => setShowAlertForm(false)}
                                style={{ padding:'11px 16px', borderRadius:'9px', backgroundColor:'#f0f0f0', color:'#666', border:'none', fontSize:'14px', cursor:'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* == FIRED ALERT TOASTS ============================================ */}
            {firedAlerts.length > 0 && (
                <div style={{ position:'fixed', bottom:'90px', right:'24px', zIndex:9999, display:'flex', flexDirection:'column', gap:'8px' }}>
                    {firedAlerts.slice(-4).map((a, i) => (
                        <div key={a.id || i} style={{ padding:'14px 18px', backgroundColor:'#ef4444', color:'#fff', borderRadius:'12px', boxShadow:'0 4px 20px rgba(239,68,68,0.5)', fontSize:'13px', fontWeight:'700', display:'flex', gap:'12px', alignItems:'center', minWidth:'260px' }}>
                            <span style={{ fontSize:'20px' }}>🔔</span>
                            <div style={{ flex:1 }}>
                                <div>{a.ticker} {a.dir==='above'?'crossed above':'dropped below'} ${a.price}</div>
                                <div style={{ fontSize:'11px', opacity:0.8, marginTop:'2px' }}>{new Date().toLocaleTimeString()}</div>
                            </div>
                            <button onClick={() => setFiredAlerts(prev => prev.filter((_, j) => j !== i))}
                                style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', fontSize:'18px', fontWeight:'700', lineHeight:1 }}>x</button>
                        </div>
                    ))}
                </div>
            )}

            {/* == DRAWING TOOLKIT ============================================ */}
            {(drawingMode || drawnLines.length > 0) && (
                <div style={{ backgroundColor:'#fffbeb', borderRadius:'12px', border:'1px solid #fde68a', padding:'14px 16px', marginBottom:'16px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', flexWrap:'wrap', gap:'8px' }}>
                        <span style={{ fontSize:'13px', fontWeight:'700', color:'#92400e' }}>Edit️ Level Lines</span>
                        {drawnLines.length > 0 && (
                            <button onClick={() => {
                                drawnLinesRef.current.forEach(l => { try { seriesRef.current?.removePriceLine(l.priceLine); } catch(e) { console.warn('[Draw]', e); } });
                                drawnLinesRef.current = []; setDrawnLines([]);
                            }} style={{ fontSize:'11px', color:'#b45309', background:'none', border:'1px solid #fcd34d', borderRadius:'6px', cursor:'pointer', padding:'2px 8px' }}>Clear all</button>
                        )}
                    </div>

                    {/* Colour picker + manual input */}
                    {drawingMode && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'12px', alignItems:'flex-end' }}>
                            {/* Colour swatches */}
                            <div>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:'#b45309', marginBottom:'5px', letterSpacing:'0.07em' }}>COLOUR</div>
                                <div style={{ display:'flex', gap:'5px' }}>
                                    {LINE_COLORS.map(c => (
                                        <button key={c.id} onClick={() => setSelectedLineColor(c.hex)} title={c.label}
                                            style={{ width:'20px', height:'20px', borderRadius:'50%', backgroundColor:c.hex, border: selectedLineColor===c.hex ? '3px solid #1a1a1a' : '2px solid transparent', cursor:'pointer', flexShrink:0, transition:'border 0.1s' }} />
                                    ))}
                                </div>
                            </div>
                            {/* Manual price input */}
                            <div style={{ flex:1, minWidth:'160px' }}>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:'#b45309', marginBottom:'5px', letterSpacing:'0.07em' }}>EXACT PRICE</div>
                                <div style={{ display:'flex', gap:'5px' }}>
                                    <input type="number" step="0.01" placeholder="e.g. 195.50"
                                        value={manualPrice} onChange={e => setManualPrice(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { addManualLine(manualPrice, manualLabel, selectedLineColor); setManualPrice(''); setManualLabel(''); } }}
                                        style={{ flex:1, padding:'5px 8px', borderRadius:'6px', border:'1px solid #fcd34d', fontSize:'12px', backgroundColor:'#fff', outline:'none', minWidth:'80px' }} />
                                    <input type="text" placeholder="Label (optional)"
                                        value={manualLabel} onChange={e => setManualLabel(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { addManualLine(manualPrice, manualLabel, selectedLineColor); setManualPrice(''); setManualLabel(''); } }}
                                        style={{ flex:1, padding:'5px 8px', borderRadius:'6px', border:'1px solid #fcd34d', fontSize:'12px', backgroundColor:'#fff', outline:'none', minWidth:'90px' }} />
                                    <button onClick={() => { addManualLine(manualPrice, manualLabel, selectedLineColor); setManualPrice(''); setManualLabel(''); }}
                                        style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#f59e0b', color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap' }}>
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {drawingMode && (
                        <div style={{ fontSize:'11px', color:'#b45309', marginBottom: drawnLines.length > 0 ? '10px' : '0' }}>
                            Click anywhere on the chart to drop a line . or type an exact price above
                        </div>
                    )}

                    {/* Lines list */}
                    {drawnLines.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                            {drawnLines.map(l => (
                                <span key={l.id} style={{ padding:'4px 10px', borderRadius:'20px', backgroundColor: l.color + '18', border:`1px solid ${l.color}60`, fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', gap:'5px', color: l.color === '#e5e7eb' ? '#555' : l.color }}>
                                    <span style={{ width:'8px', height:'8px', borderRadius:'50%', backgroundColor:l.color, flexShrink:0 }} />
                                    {l.label ? `${l.label} ` : ''}${l.price}
                                    <button onClick={() => {
                                        const found = drawnLinesRef.current.find(x => x.id === l.id);
                                        if (found) { try { seriesRef.current?.removePriceLine(found.priceLine); } catch(e) { console.warn('[Draw]', e); } }
                                        drawnLinesRef.current = drawnLinesRef.current.filter(x => x.id !== l.id);
                                        setDrawnLines(prev => prev.filter(x => x.id !== l.id));
                                    }} style={{ background:'none', border:'none', cursor:'pointer', fontWeight:'900', fontSize:'13px', padding:0, lineHeight:1, color:'inherit', opacity:0.7 }}>x</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}


            {/* == OPTIONS FLOW PANEL ============================================ */}
            {showOptionsPanel && (
                <div style={{ backgroundColor:'#fff', borderRadius:'14px', border:'1px solid #e8e8e8', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', overflow:'hidden', marginBottom:'20px' }}>
                    {optionsLoading && (
                        <div style={{ padding:'40px', textAlign:'center', color:'#7c3aed', fontSize:'14px' }}>
                            <div style={{ fontSize:'28px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'8px' }}>⏳</div>
                            <div>Fetching options chain...</div>
                        </div>
                    )}
                    {optionsError && !optionsLoading && (
                        <div style={{ padding:'24px 20px' }}>
                            <div style={{ fontSize:'15px', fontWeight:'700', color:'#b91c1c', marginBottom:'8px' }}>!️ Options Error</div>
                            <div style={{ fontSize:'13px', color:'#ef4444', backgroundColor:'#fef2f2', padding:'12px', borderRadius:'8px', fontFamily:'monospace' }}>{optionsError}</div>
                            <div style={{ marginTop:'12px', display:'flex', gap:'8px' }}>
                                <button onClick={() => fetchOptions(ticker)} style={{ padding:'8px 16px', borderRadius:'8px', backgroundColor:'#8b5cf6', color:'#fff', border:'none', fontWeight:'700', cursor:'pointer' }}>Retry</button>
                                <button onClick={() => setShowOptionsPanel(false)} style={{ padding:'8px 16px', borderRadius:'8px', backgroundColor:'#f0f0f0', color:'#555', border:'none', cursor:'pointer' }}>Close</button>
                            </div>
                        </div>
                    )}
                    {optionsData && !optionsLoading && (() => {
                        const o = optionsData;
                        const pcr = o.putCallRatio;
                        const pcrColor = !pcr ? '#aaa' : pcr > 1.2 ? '#ef4444' : pcr < 0.7 ? '#10b981' : '#f59e0b';
                        const pcrLabel = !pcr ? 'N/A' : pcr > 1.2 ? 'Bearish -- more puts than calls' : pcr < 0.7 ? 'Bullish -- more calls than puts' : 'Neutral';
                        return (
                            <>
                                <div style={{ padding:'14px 20px', borderBottom:'1px solid #f0f0f0', backgroundColor:'#f5f3ff', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
                                    <div>
                                        <div style={{ fontWeight:'800', fontSize:'15px', color:'#4c1d95' }}>🎯 Options Flow -- {o.ticker} . {o.expiry}</div>
                                        <div style={{ fontSize:'12px', color:'#7c3aed', marginTop:'2px' }}>What big money is positioning for</div>
                                    </div>
                                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                                        {o.expiryDates?.length > 1 && (
                                            <select value={optionsExpiry || o.expiry} onChange={e => { setOptionsExpiry(e.target.value); fetchOptions(ticker); }}
                                                style={{ padding:'5px 9px', borderRadius:'8px', border:'1px solid #ddd6fe', fontSize:'12px', color:'#4c1d95' }}>
                                                {o.expiryDates.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        )}
                                        <button onClick={() => setShowOptionsPanel(false)} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#aaa' }}>x</button>
                                    </div>
                                </div>
                                {/* Layman explainer */}
                                <div style={{ padding:'10px 20px', backgroundColor:'#faf5ff', borderBottom:'1px solid #ede9fe', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                                    <span style={{ fontSize:'16px', flexShrink:0 }}>💡</span>
                                    <div style={{ fontSize:'12px', color:'#6b21a8', lineHeight:'1.6' }}>
                                        <strong>Calls</strong> = right to buy = bet the price goes up. <strong>Puts</strong> = right to sell = bet the price drops.
                                        <strong> Put/call ratio</strong> below 0.7 = mostly calls = bullish. Above 1.2 = mostly puts = bearish.
                                        <strong> Open interest</strong> = active contracts. High OI at a price = that level matters.
                                        <strong> IV</strong> = expected volatility. High IV = big swing expected.
                                    </div>
                                </div>
                                <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'12px' }}>
                                    <div style={{ padding:'14px', backgroundColor:'#f8f9fa', borderRadius:'10px', borderLeft:`4px solid ${pcrColor}` }}>
                                        <div style={{ fontSize:'11px', color:'#999', fontWeight:'700', letterSpacing:'0.07em', marginBottom:'6px' }}>PUT/CALL RATIO</div>
                                        <div style={{ fontSize:'26px', fontWeight:'800', color:pcrColor }}>{pcr?.toFixed(2) ?? 'N/A'}</div>
                                        <div style={{ fontSize:'11px', color:pcrColor, fontWeight:'600', marginTop:'3px' }}>{pcrLabel}</div>
                                    </div>
                                    <div style={{ padding:'14px', backgroundColor:'#f8f9fa', borderRadius:'10px', borderLeft:'4px solid #3b82f6' }}>
                                        <div style={{ fontSize:'11px', color:'#999', fontWeight:'700', letterSpacing:'0.07em', marginBottom:'6px' }}>VOLUME</div>
                                        <div style={{ fontSize:'18px', fontWeight:'800', color:'#1e40af' }}>{o.totalVolume?.toLocaleString() ?? 'N/A'}</div>
                                        <div style={{ fontSize:'11px', marginTop:'4px', display:'flex', gap:'8px' }}>
                                            <span style={{ color:'#10b981' }}>📈 {o.callVolume?.toLocaleString()}</span>
                                            <span style={{ color:'#ef4444' }}>📉 {o.putVolume?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ padding:'14px', backgroundColor:'#f8f9fa', borderRadius:'10px', borderLeft:'4px solid #6b7280' }}>
                                        <div style={{ fontSize:'11px', color:'#999', fontWeight:'700', letterSpacing:'0.07em', marginBottom:'6px' }}>CURRENT PRICE</div>
                                        <div style={{ fontSize:'22px', fontWeight:'800', color:'#1a1a1a' }}>${o.currentPrice?.toFixed(2) ?? 'N/A'}</div>
                                    </div>
                                </div>
                                {o.notableStrikes?.length > 0 && (
                                    <div style={{ padding:'0 20px 20px' }}>
                                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#999', letterSpacing:'0.07em', marginBottom:'10px' }}>TOP STRIKES BY OPEN INTEREST (within +/-25% of price)</div>
                                        <div style={{ overflowX:'auto' }}>
                                            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                                                <thead>
                                                    <tr style={{ backgroundColor:'#f8f9fa' }}>
                                                        {['Type','Strike','OI','Volume','IV %','Delta from Price'].map(h => (
                                                            <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontWeight:'700', color:'#555', borderBottom:'1px solid #f0f0f0' }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {o.notableStrikes.map((s, i) => {
                                                        const delta = o.currentPrice ? ((s.strike - o.currentPrice) / o.currentPrice * 100).toFixed(1) : null;
                                                        const isCall = s.type === 'call';
                                                        return (
                                                            <tr key={i} style={{ borderBottom:'1px solid #f8f8f8' }}>
                                                                <td style={{ padding:'8px 10px' }}>
                                                                    <span style={{ padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'700', backgroundColor:isCall?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:isCall?'#10b981':'#ef4444' }}>
                                                                        {isCall ? '📈 CALL' : '📉 PUT'}
                                                                    </span>
                                                                </td>
                                                                <td style={{ padding:'8px 10px', fontWeight:'700' }}>${s.strike}</td>
                                                                <td style={{ padding:'8px 10px' }}>{s.openInterest?.toLocaleString()}</td>
                                                                <td style={{ padding:'8px 10px' }}>{s.volume?.toLocaleString()}</td>
                                                                <td style={{ padding:'8px 10px', color:s.impliedVolatility>0.6?'#ef4444':'#333' }}>{s.impliedVolatility?(s.impliedVolatility*100).toFixed(1):'-'}</td>
                                                                <td style={{ padding:'8px 10px', fontWeight:'700', color:parseFloat(delta)>0?'#10b981':'#ef4444' }}>{delta!==null?`${parseFloat(delta)>0?'+':''}${delta}%`:'-'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}

            {/* == VIDEO PLAYER =============================================== */}
            {(isRecording || videoUrl) && (
                <div style={{ backgroundColor:'#fff', borderRadius:'14px', border:'1px solid #e8e8e8', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', overflow:'hidden', marginBottom:'20px' }}>
                    <div style={{ padding:'14px 20px', borderBottom:'1px solid #f0f0f0', backgroundColor:'#0f0f14', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div>
                            <div style={{ fontWeight:'800', fontSize:'15px', color:'#fff' }}>🎬 Chart Replay -- {ticker} . {chartInterval}</div>
                            <div style={{ fontSize:'12px', color:'#aaa', marginTop:'2px' }}>
                                {isRecording ? `Recording... ${recordingProgress}% -- animating through data` : '> Playback ready . loops . download to keep'}
                            </div>
                        </div>
                        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                            {videoUrl && !isRecording && (
                                <button onClick={downloadVideo}
                                    style={{ padding:'7px 14px', borderRadius:'8px', backgroundColor:'#2563eb', color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
                                    v Download .webm
                                </button>
                            )}
                            {videoUrl && (
                                <button onClick={() => { URL.revokeObjectURL(videoUrl); setVideoUrl(null); setVideoBlob(null); setRecordingProgress(0); }}
                                    style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#666' }}>x</button>
                            )}
                        </div>
                    </div>
                    {isRecording && (
                        <div style={{ padding:'20px', backgroundColor:'#0f0f14' }}>
                            <div style={{ height:'6px', backgroundColor:'#1e1e2e', borderRadius:'3px', overflow:'hidden', marginBottom:'10px' }}>
                                <div style={{ height:'100%', width:`${recordingProgress}%`, backgroundColor:'#ef4444', borderRadius:'3px', transition:'width 0.3s ease' }} />
                            </div>
                            <div style={{ fontSize:'12px', color:'#ef4444', fontWeight:'700', textAlign:'center' }}>
                                🔴 Recording chart replay... {recordingProgress}% -- chart is animating through {chartInterval} data
                            </div>
                        </div>
                    )}
                    {videoUrl && !isRecording && (
                        <div style={{ backgroundColor:'#0f0f14', padding:'0' }}>
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                style={{ width:'100%', display:'block', maxHeight:'480px', backgroundColor:'#000' }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* == COMPARE PICKER MODAL ======================================== */}
            {showComparePicker && (
                <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:9500, display:'flex', alignItems:'center', justifyContent:'center' }}
                    onClick={e => { if (e.target===e.currentTarget) setShowComparePicker(false); }}>
                    <div style={{ backgroundColor:'#fff', borderRadius:'18px', width:'560px', maxWidth:'95vw', maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding:'20px 24px 0', flexShrink:0 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                                <div>
                                    <div style={{ fontSize:'17px', fontWeight:'800', color:'#1a1a1a' }}>+ Compare with {ticker}</div>
                                    <div style={{ fontSize:'12px', color:'#999', marginTop:'2px' }}>Pick any asset -- a full chart opens side by side</div>
                                </div>
                                <button onClick={()=>setShowComparePicker(false)} style={{ background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#aaa' }}>x</button>
                            </div>
                            <input autoFocus type="text" placeholder="Search ticker or name... e.g. NVDA, Gold, EUR/USD"
                                value={compareSearch} onChange={e => setCompareSearch(e.target.value.toUpperCase())}
                                style={{ width:'100%', padding:'10px 14px', borderRadius:'10px', border:'2px solid #e0e0e0', fontSize:'14px', boxSizing:'border-box', outline:'none', marginBottom:'12px' }} />
                            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
                                {Object.keys(COMPARE_ASSETS).map(cat => (
                                    <button key={cat} onClick={() => setCompareCategory(cat)}
                                        style={{ padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', cursor:'pointer', border:'none',
                                            backgroundColor: compareCategory===cat ? '#3b82f6' : '#f0f0f0',
                                            color: compareCategory===cat ? '#fff' : '#555', textTransform:'capitalize' }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ overflowY:'auto', flex:1, padding:'0 24px 12px' }}>
                            {compareTicker && (
                                <div style={{ marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', backgroundColor:'#eff6ff', borderRadius:'8px', border:'1px solid #bfdbfe' }}>
                                    <span style={{ fontSize:'12px', color:'#3b82f6', fontWeight:'700' }}>Comparing: {compareTicker}</span>
                                    <button onClick={() => { setCompareTicker(null); setShowComparePicker(false); }}
                                        style={{ marginLeft:'auto', fontSize:'11px', color:'#ef4444', background:'none', border:'1px solid #fecaca', borderRadius:'6px', padding:'2px 8px', cursor:'pointer' }}>Remove</button>
                                </div>
                            )}
                            {(() => {
                                const allInCat = COMPARE_ASSETS[compareCategory] || [];
                                const filtered = compareSearch.length > 0
                                    ? Object.values(COMPARE_ASSETS).flat().filter(a => a.s.includes(compareSearch) || a.n.toUpperCase().includes(compareSearch))
                                    : allInCat;
                                if (filtered.length === 0) return <div style={{ padding:'24px', textAlign:'center', color:'#aaa', fontSize:'13px' }}>No results for "{compareSearch}"</div>;
                                return (
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:'6px' }}>
                                        {filtered.map(a => (
                                            <button key={a.s} onClick={() => { setCompareTicker(a.s); setShowComparePicker(false); setCompareSearch(''); }}
                                                style={{ padding:'8px 10px', borderRadius:'8px', border:`1px solid ${compareTicker===a.s?'#3b82f6':'#e8e8e8'}`,
                                                    backgroundColor: compareTicker===a.s?'#eff6ff':'#fafafa',
                                                    cursor:'pointer', textAlign:'left', transition:'all 0.1s' }}>
                                                <div style={{ fontSize:'12px', fontWeight:'800', color:compareTicker===a.s?'#3b82f6':'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.s}</div>
                                                {a.n !== a.s && <div style={{ fontSize:'10px', color:'#999', marginTop:'1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.n}</div>}
                                            </button>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                        <div style={{ padding:'12px 24px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                            <span style={{ fontSize:'12px', color:'#999', fontWeight:'600' }}>Layout:</span>
                            {[['side','[][] Side by side'],['stack','[]<> Stacked']].map(([m,lbl]) => (
                                <button key={m} onClick={() => setCompareMode(m)}
                                    style={{ padding:'5px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:'700', cursor:'pointer',
                                        border:`1px solid ${compareMode===m?'#3b82f6':'#e0e0e0'}`,
                                        backgroundColor: compareMode===m?'#eff6ff':'#fff',
                                        color: compareMode===m?'#3b82f6':'#555' }}>
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* == COMPARE DUAL CHART ============================================== */}
            {compareTicker && (
                <div style={{ marginBottom:'20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                        <div style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>
                            📊 {ticker} <span style={{ color:'#aaa', fontWeight:'400', margin:'0 4px' }}>vs</span> {compareTicker}
                        </div>
                        <div style={{ display:'flex', gap:'6px', marginLeft:'auto' }}>
                            <span className="compare-layout-toggle" style={{ display:'contents' }}>
                            {[['side','[][] Side'],['stack','[]<> Stack']].map(([m,lbl]) => (
                                <button key={m} onClick={() => setCompareMode(m)}
                                    style={{ padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                        border:`1px solid ${compareMode===m?'#3b82f6':'#e0e0e0'}`,
                                        backgroundColor: compareMode===m?'#eff6ff':'#fff',
                                        color: compareMode===m?'#3b82f6':'#555' }}>
                                    {lbl}
                                </button>
                            ))}
                            </span>
                            <button onClick={() => setShowComparePicker(true)}
                                style={{ padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'1px solid #e0e0e0', backgroundColor:'#fff', color:'#555' }}>
                                + Swap
                            </button>
                            <button onClick={() => setCompareTicker(null)}
                                style={{ padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'1px solid #fecaca', backgroundColor:'#fef2f2', color:'#ef4444' }}>
                                x Close
                            </button>
                        </div>
                    </div>
                    <div className="compare-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: compareMode==='side' ? '1fr 1fr' : '1fr',
                        gap: '14px', alignItems: 'start',
                    }}>
                        <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:'11px', fontWeight:'700', color:'#888', marginBottom:'5px', paddingLeft:'2px' }}>📈 {ticker} -- primary</div>
                            <ChartInsightsTab ticker={ticker} stockData={stockData} earnings={earnings} news={news}
                                marketauxNews={marketauxNews} openaiKey={openaiKey} cachedNewsAnalysis={cachedNewsAnalysis} compactMode={true} />
                        </div>
                        <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:'11px', fontWeight:'700', color:'#3b82f6', marginBottom:'5px', paddingLeft:'2px' }}>📈 {compareTicker} -- compare</div>
                            <ChartInsightsTab ticker={compareTicker} stockData={null} earnings={[]} news={[]}
                                marketauxNews={[]} openaiKey={openaiKey} cachedNewsAnalysis={null} compactMode={true} />
                        </div>
                    </div>
                </div>
            )}

            {/* -- Analyst Ratings Panel -- */}
            {showAnalystPanel && analystData && (() => {
                const s = analystData.summary;
                const pt = analystData.priceTarget;
                const ratings = analystData.recentRatings || [];
                const history = analystData.history || [];
                if (!s) return null;
                const consensusColors = { 'STRONG BUY':'#10b981','BUY':'#34d399','HOLD':'#f59e0b','SELL':'#f87171','STRONG SELL':'#ef4444' };
                const cc = consensusColors[s.consensus] || '#aaa';
                const total = s.total || 1;
                const bars = [
                    { label:'Strong Buy', val:s.strongBuy, color:'#10b981' },
                    { label:'Buy',        val:s.buy,       color:'#34d399' },
                    { label:'Hold',       val:s.hold,      color:'#f59e0b' },
                    { label:'Sell',       val:s.sell,      color:'#f87171' },
                    { label:'Strong Sell',val:s.strongSell,color:'#ef4444' },
                ];
                const actionColors = { upgrade:'#10b981', downgrade:'#ef4444', initiated:'#3b82f6', reiterated:'#f59e0b', maintain:'#aaa' };
                return (
                    <div style={{ backgroundColor:'#fff', borderRadius:'14px', border:'1px solid #e8e8e8', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', overflow:'hidden', marginBottom:'20px' }}>
                        {/* Header */}
                        <div style={{ padding:'16px 20px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
                            <div>
                                <div style={{ fontSize:'16px', fontWeight:'800', color:'#1a1a1a' }}>🏦 Analyst Ratings -- {analystData.ticker}</div>
                                <div style={{ fontSize:'12px', color:'#999', marginTop:'2px' }}>{s.total} analysts covering this stock</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                                {/* Consensus badge */}
                                <div style={{ padding:'8px 18px', borderRadius:'24px', backgroundColor:cc+'18', border:`2px solid ${cc}40`, fontSize:'14px', fontWeight:'800', color:cc }}>
                                    {s.consensus}
                                </div>
                                {/* Bullish % */}
                                <div style={{ textAlign:'center' }}>
                                    <div style={{ fontSize:'22px', fontWeight:'800', color:'#10b981' }}>{s.bullishPct}%</div>
                                    <div style={{ fontSize:'10px', color:'#aaa', fontWeight:'600' }}>BULLISH</div>
                                </div>
                                <button onClick={() => setShowAnalystPanel(false)} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#aaa', padding:'4px' }}>x</button>
                            </div>
                        </div>

                        <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px' }}>
                            {/* Rating breakdown bars */}
                            <div>
                                <div style={{ fontSize:'12px', fontWeight:'700', color:'#999', letterSpacing:'0.07em', marginBottom:'12px' }}>RATING BREAKDOWN</div>
                                {bars.map(b => (
                                    <div key={b.label} style={{ marginBottom:'8px' }}>
                                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'3px' }}>
                                            <span style={{ color:'#555', fontWeight:'600' }}>{b.label}</span>
                                            <span style={{ color:b.color, fontWeight:'700' }}>{b.val}</span>
                                        </div>
                                        <div style={{ height:'6px', borderRadius:'3px', backgroundColor:'#f0f0f0', overflow:'hidden' }}>
                                            <div style={{ height:'100%', width:`${(b.val/total)*100}%`, backgroundColor:b.color, borderRadius:'3px', transition:'width 0.6s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price target */}
                            {pt && (
                                <div>
                                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#999', letterSpacing:'0.07em', marginBottom:'12px' }}>PRICE TARGET ({pt.numberOfAnalysts} analysts)</div>
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                                        {[
                                            { label:'Mean Target', val:`$${pt.mean}`, big:true, color:'#2563eb' },
                                            { label:'Current Price', val:`$${pt.current}`, big:true, color:'#1a1a1a' },
                                            { label:'Low Target',  val:`$${pt.low}`,  big:false, color:'#ef4444' },
                                            { label:'High Target', val:`$${pt.high}`, big:false, color:'#10b981' },
                                        ].map(item => (
                                            <div key={item.label} style={{ padding:'10px 12px', backgroundColor:'#f8f9fa', borderRadius:'8px', borderLeft:`3px solid ${item.color}` }}>
                                                <div style={{ fontSize:'10px', color:'#999', fontWeight:'600', marginBottom:'4px' }}>{item.label}</div>
                                                <div style={{ fontSize: item.big?'20px':'15px', fontWeight:'800', color:item.color }}>{item.val}</div>
                                                {item.label==='Mean Target' && pt.current && (
                                                    <div style={{ fontSize:'11px', color: pt.mean >= pt.current ? '#10b981' : '#ef4444', fontWeight:'700', marginTop:'2px' }}>
                                                        {pt.mean >= pt.current ? '^' : 'v'} {Math.abs(((pt.mean - pt.current)/pt.current)*100).toFixed(1)}% upside
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent individual ratings */}
                        {ratings.length > 0 && (
                            <div style={{ padding:'0 20px 18px' }}>
                                <div style={{ fontSize:'12px', fontWeight:'700', color:'#999', letterSpacing:'0.07em', marginBottom:'10px' }}>RECENT ANALYST ACTIONS</div>
                                <div style={{ display:'flex', flexDirection:'column', gap:'6px', maxHeight:'240px', overflowY:'auto' }}>
                                    {ratings.map((r, i) => {
                                        const ac = actionColors[r.action?.toLowerCase()] || '#aaa';
                                        return (
                                            <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', backgroundColor:'#f8f9fa', borderRadius:'8px', flexWrap:'wrap' }}>
                                                <span style={{ fontSize:'11px', color:'#aaa', flexShrink:0, minWidth:'80px' }}>{r.date}</span>
                                                <span style={{ fontSize:'12px', fontWeight:'700', color:'#333', flex:1, minWidth:'100px' }}>{r.firm}</span>
                                                <span style={{ padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'700', backgroundColor:ac+'18', color:ac, border:`1px solid ${ac}30`, flexShrink:0 }}>
                                                    {r.action || 'Update'}
                                                </span>
                                                <span style={{ fontSize:'11px', color:'#555', flexShrink:0 }}>
                                                    {r.fromGrade && r.toGrade ? `${r.fromGrade} -> ${r.toGrade}` : r.toGrade || r.fromGrade || ''}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {analystError && <div style={{ padding:'12px 20px', color:'#ef4444', fontSize:'13px' }}>!️ {analystError}</div>}
                    </div>
                );
            })()}

            {recError && (
                <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '14px', marginBottom: '16px' }}>
                    !️ {recError}
                </div>
            )}

            {/* -- Sabrina's Recommendation Card -- */}
            {!compactMode && sabrinaRec && (
                <div style={{ backgroundColor: vc.bg, border: `2px solid ${vc.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    {/* Verdict header */}
                    <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${vc.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '36px', lineHeight: 1, flexShrink: 0 }}>{vc.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '22px', fontWeight: '800', color: vc.color }}>{vc.label}</span>
                                    <span style={{ backgroundColor: vc.color, color: '#fff', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>
                                        {sabrinaRec.confidence}% confidence
                                    </span>
                                    {sabrinaRec.priceTarget && sabrinaRec.priceTarget !== 'N/A' && (
                                        <span style={{ backgroundColor: '#fff', border: `1px solid ${vc.border}`, color: '#555', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                                            🎯 {sabrinaRec.priceTarget}
                                        </span>
                                    )}
                                    {sabrinaRec.timeframe && (
                                        <span style={{ fontSize: '12px', color: '#888' }}>. {sabrinaRec.timeframe}</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>{sabrinaRec.summary}</div>
                            </div>
                        </div>

                        {/* Sabrina quote */}
                        {sabrinaRec.sabrinaQuote && (
                            <div style={{ marginTop: '14px', padding: '12px 16px', backgroundColor: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderLeft: '3px solid #7c3aed', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '18px', flexShrink: 0 }}>😼</span>
                                <div style={{ fontSize: '14px', color: '#4c1d95', fontStyle: 'italic', lineHeight: '1.5' }}>"{sabrinaRec.sabrinaQuote}"</div>
                            </div>
                        )}
                    </div>

                    {/* Bull / Bear / Levels grid */}
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        {sabrinaRec.bullCase && (
                            <div style={{ backgroundColor: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', letterSpacing: '0.08em', marginBottom: '6px' }}>📈 BULL CASE</div>
                                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{sabrinaRec.bullCase}</div>
                            </div>
                        )}
                        {sabrinaRec.bearCase && (
                            <div style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '10px', padding: '12px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', letterSpacing: '0.08em', marginBottom: '6px' }}>📉 BEAR CASE</div>
                                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{sabrinaRec.bearCase}</div>
                            </div>
                        )}
                        {sabrinaRec.keyLevels && sabrinaRec.keyLevels !== 'N/A' && (
                            <div style={{ backgroundColor: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '10px', padding: '12px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', letterSpacing: '0.08em', marginBottom: '6px' }}>📐 KEY LEVELS</div>
                                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{sabrinaRec.keyLevels}</div>
                            </div>
                        )}
                    </div>

                    {/* Catalysts + Risks */}
                    {((sabrinaRec.catalysts?.length > 0) || (sabrinaRec.risks?.length > 0)) && (
                        <div style={{ padding: '0 20px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                            {sabrinaRec.catalysts?.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.08em', marginBottom: '8px' }}>🚀 CATALYSTS</div>
                                    {sabrinaRec.catalysts.map((c, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#333', alignItems: 'flex-start' }}>
                                            <span style={{ color: '#10b981', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>{c}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {sabrinaRec.risks?.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.08em', marginBottom: '8px' }}>!️ RISKS</div>
                                    {sabrinaRec.risks.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#333', alignItems: 'flex-start' }}>
                                            <span style={{ color: '#ef4444', fontWeight: '700', flexShrink: 0 }}>v</span>{r}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!compactMode && (
                <MomentumVelocityPanel
                    ticker={ticker}
                    openaiKey={openaiKey}
                />
            )}

            {/* -- Bottom context panels -- */}
            {!compactMode && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

                {/* News Insights */}
                {(news?.filter(n => n?.title).length > 0 || cachedNewsAnalysis) && (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>📰 News Context</div>
                        </div>
                        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* AI news analysis badge */}
                            {cachedNewsAnalysis && (() => {
                                const bColors = { BULLISH: '#10b981', BEARISH: '#ef4444', NEUTRAL: '#f59e0b', MIXED: '#2563eb' };
                                const bIcons  = { BULLISH: '📈', BEARISH: '📉', NEUTRAL: '➡️', MIXED: '🔀' };
                                const bc = bColors[cachedNewsAnalysis.bias] || '#2563eb';
                                return (
                                    <div style={{ padding: '10px 12px', backgroundColor: bc + '10', border: `1px solid ${bc}30`, borderLeft: `3px solid ${bc}`, borderRadius: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: bc, marginBottom: '4px', letterSpacing: '0.07em' }}>
                                            {bIcons[cachedNewsAnalysis.bias]} AI NEWS ANALYSIS . {cachedNewsAnalysis.bias} . {cachedNewsAnalysis.confidence}%
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{cachedNewsAnalysis.tldr}</div>
                                    </div>
                                );
                            })()}
                            {/* Top headlines */}
                            {news?.filter(n => n?.title).slice(0, 4).map((item, i) => {
                                const lower = item.title.toLowerCase();
                                const bull = ['surge','rally','gain','beat','soar','rise','record','profit'].some(w => lower.includes(w));
                                const bear = ['fall','drop','decline','miss','loss','crash','warn','layoff'].some(w => lower.includes(w));
                                const dot = bull ? '#10b981' : bear ? '#ef4444' : '#f59e0b';
                                return (
                                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: dot, flexShrink: 0, marginTop: '5px' }} />
                                        <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.4' }}>{item.title}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Earnings Snapshot */}
                {recentEarnings.length > 0 && (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>💰 Recent Earnings</div>
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                            {recentEarnings.map((e, i) => {
                                const rev = e.revenue ? (e.revenue / 1e9).toFixed(1) : null;
                                const eps = e.earnings ? (e.earnings / 1e9).toFixed(2) : null;
                                const prev = recentEarnings[i + 1];
                                const revTrend = prev?.revenue && e.revenue ? (e.revenue > prev.revenue ? '^' : 'v') : '';
                                const revColor = prev?.revenue && e.revenue ? (e.revenue > prev.revenue ? '#10b981' : '#ef4444') : '#999';
                                return (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < recentEarnings.length - 1 ? '1px solid #f4f4f4' : 'none' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', flexShrink: 0 }}>{e.quarter}</div>
                                        <div style={{ display: 'flex', gap: '14px', fontSize: '13px' }}>
                                            {rev && <span style={{ color: '#333' }}>Rev <strong>${rev}B</strong> <span style={{ color: revColor, fontSize: '11px' }}>{revTrend}</span></span>}
                                            {eps && <span style={{ color: '#333' }}>EPS <strong style={{ color: parseFloat(eps) >= 0 ? '#10b981' : '#ef4444' }}>${eps}B</strong></span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Stock Key Stats */}
                {stockData && (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>📌 Key Stats</div>
                        </div>
                        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                ['Price',       `$${stockData.currentPrice?.toFixed(2) || 'N/A'}`],
                                ['Market Cap',  stockData.marketCap ? `$${(stockData.marketCap/1e9).toFixed(1)}B` : 'N/A'],
                                ['P/E Ratio',   stockData.trailingPE?.toFixed(2) || 'N/A'],
                                ['52W High',    `$${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}`],
                                ['52W Low',     `$${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}`],
                                ['Div Yield',   stockData.dividendYield ? `${(stockData.dividendYield*100).toFixed(2)}%` : 'N/A'],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>{label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            }

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 600px) {
                    .chart-toolbar { flex-direction: column; align-items: flex-start !important; }
                }
            `}</style>
        </div>
    );
}

// --- Main Component -----------------------------------------------------------
export default function SnowAIStockScreener() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const popularStocks = [
        { name: "Apple", symbol: "AAPL", category: "Tech Giants" },
        { name: "Microsoft", symbol: "MSFT", category: "Tech Giants" },
        { name: "Google (Alphabet)", symbol: "GOOGL", category: "Tech Giants" },
        { name: "Amazon", symbol: "AMZN", category: "Tech Giants" },
        { name: "Meta (Facebook)", symbol: "META", category: "Tech Giants" },
        { name: "Tesla", symbol: "TSLA", category: "Tech Giants" },
        { name: "NVIDIA", symbol: "NVDA", category: "Tech Giants" },
        { name: "Netflix", symbol: "NFLX", category: "Tech Giants" },
        { name: "JPMorgan Chase", symbol: "JPM", category: "Financial" },
        { name: "Bank of America", symbol: "BAC", category: "Financial" },
        { name: "Wells Fargo", symbol: "WFC", category: "Financial" },
        { name: "Goldman Sachs", symbol: "GS", category: "Financial" },
        { name: "Morgan Stanley", symbol: "MS", category: "Financial" },
        { name: "Visa", symbol: "V", category: "Financial" },
        { name: "Mastercard", symbol: "MA", category: "Financial" },
        { name: "American Express", symbol: "AXP", category: "Financial" },
        { name: "Walmart", symbol: "WMT", category: "Retail" },
        { name: "Target", symbol: "TGT", category: "Retail" },
        { name: "Home Depot", symbol: "HD", category: "Retail" },
        { name: "Nike", symbol: "NKE", category: "Retail" },
        { name: "Starbucks", symbol: "SBUX", category: "Retail" },
        { name: "McDonald's", symbol: "MCD", category: "Retail" },
        { name: "Coca-Cola", symbol: "KO", category: "Retail" },
        { name: "PepsiCo", symbol: "PEP", category: "Retail" },
        { name: "FedEx", symbol: "FDX", category: "Retail" },
        { name: "Johnson & Johnson", symbol: "JNJ", category: "Healthcare" },
        { name: "Pfizer", symbol: "PFE", category: "Healthcare" },
        { name: "UnitedHealth", symbol: "UNH", category: "Healthcare" },
        { name: "Moderna", symbol: "MRNA", category: "Healthcare" },
        { name: "AbbVie", symbol: "ABBV", category: "Healthcare" },
        { name: "Eli Lilly", symbol: "LLY", category: "Healthcare" },
        { name: "Biogen", symbol: "BIIB", category: "Healthcare" },
        { name: "Cencora", symbol: "COR", category: "Healthcare" },
        { name: "Intel", symbol: "INTC", category: "Semiconductors" },
        { name: "AMD", symbol: "AMD", category: "Semiconductors" },
        { name: "Qualcomm", symbol: "QCOM", category: "Semiconductors" },
        { name: "Broadcom", symbol: "AVGO", category: "Semiconductors" },
        { name: "Texas Instruments", symbol: "TXN", category: "Semiconductors" },
        { name: "ExxonMobil", symbol: "XOM", category: "Energy" },
        { name: "Chevron", symbol: "CVX", category: "Energy" },
        { name: "ConocoPhillips", symbol: "COP", category: "Energy" },
        { name: "NextEra Energy", symbol: "NEE", category: "Energy" },
        { name: "Devon Energy", symbol: "DVN", category: "Energy" },
        { name: "Disney", symbol: "DIS", category: "Media" },
        { name: "Comcast", symbol: "CMCSA", category: "Media" },
        { name: "Warner Bros Discovery", symbol: "WBD", category: "Media" },
        { name: "Salesforce", symbol: "CRM", category: "Software" },
        { name: "Adobe", symbol: "ADBE", category: "Software" },
        { name: "Oracle", symbol: "ORCL", category: "Software" },
        { name: "ServiceNow", symbol: "NOW", category: "Software" },
        { name: "Ford", symbol: "F", category: "Automotive" },
        { name: "General Motors", symbol: "GM", category: "Automotive" },
        { name: "Rivian", symbol: "RIVN", category: "Automotive" },
        { name: "Lucid", symbol: "LCID", category: "Automotive" },
        { name: "NIO", symbol: "NIO", category: "Automotive" },
        { name: "Boeing", symbol: "BA", category: "Aerospace" },
        { name: "Lockheed Martin", symbol: "LMT", category: "Aerospace" },
        { name: "PayPal", symbol: "PYPL", category: "Fintech" },
        { name: "Square (Block)", symbol: "SQ", category: "Fintech" },
        { name: "Shopify", symbol: "SHOP", category: "Fintech" },
        { name: "Coinbase", symbol: "COIN", category: "Fintech" },
    ];

    const [ticker, setTicker] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [stockData, setStockData] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [financialsView, setFinancialsView] = useState('table');
    const [earningsView, setEarningsView] = useState('table');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
    const [aiAnalysisResults, setAiAnalysisResults] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [analysisFilterCategory, setAnalysisFilterCategory] = useState('All');
    const [mainCachedNewsAnalyses, setMainCachedNewsAnalyses] = useState({});
    // -- Hoisted news state (persists across tab switches) --
    const [hoistedMarketauxNews, setHoistedMarketauxNews] = useState([]);
    const [hoistedFetchingNews, setHoistedFetchingNews] = useState(false);
    const [hoistedNewsError, setHoistedNewsError] = useState(null);
    const [hoistedHasFetched, setHoistedHasFetched] = useState(false);
    const [hoistedActiveNewsTab, setHoistedActiveNewsTab] = useState('yahoo');
    // -- Hoisted news analysis state (so "View Analysis" button never disappears) --
    const [hoistedCachedAnalyses, setHoistedCachedAnalyses] = useState({});
    const [hoistedShowAnalysisModal, setHoistedShowAnalysisModal] = useState(false);
    const [OPENAI_API_KEY, setOPENAI_API_KEY] = useState("");
    const [showScanner, setShowScanner] = React.useState(false);


    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) setSelectedVoice(availableVoices[0]);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        const fetchOpenAIKey = async () => {
            try {
                const response = await fetch(`${baseUrl}/get_openai_key`);
                if (response.ok) {
                    const { OPENAI_API_KEY } = await response.json();
                    setOPENAI_API_KEY(OPENAI_API_KEY);
                }
            } catch (err) {
                console.error('Failed to fetch OpenAI key:', err);
            }
        };
        fetchOpenAIKey();
    }, []);

    // Sync cached news analyses so ChartInsightsTab can read them
    useEffect(() => {
        const syncNewsAnalyses = async () => {
            try {
                const result = await window.storage.get('news-analyses');
                if (result?.value) setMainCachedNewsAnalyses(JSON.parse(result.value));
            } catch {}
        };
        syncNewsAnalyses();
        // Re-sync whenever tab changes to 'chart' so it's always fresh
    }, [activeTab]);

    const fetchStockData = async (symbol) => {
        if (!symbol) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${symbol}`);
            const data = await response.json();
            if (response.ok) {
                setStockData(data.stock_info);
                setFinancials(data.financials);
                setEarnings(data.earnings);
                setNews(data.news || []);
                setTicker(symbol);
                // Reset hoisted news state for fresh ticker
                setHoistedMarketauxNews([]);
                setHoistedHasFetched(false);
                setHoistedNewsError(null);
                setHoistedActiveNewsTab('yahoo');
                setHoistedShowAnalysisModal(false);
            } else {
                setError(data.error || 'Failed to fetch stock data');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeStock = (stockData) => {
        const { earnings } = stockData;
        if (!earnings || earnings.length < 4) return { signal: 'INSUFFICIENT_DATA', confidence: 0, reason: 'Not enough data', revenueDeviation: 0, earningsDeviation: 0 };
        const recentQuarters = earnings.slice(0, 4);
        const olderQuarters = earnings.slice(4, 8);
        const recentRevenue = recentQuarters.filter(q => q.revenue && q.revenue !== 0).map(q => q.revenue);
        const recentEarnings = recentQuarters.filter(q => q.earnings && q.earnings !== 0).map(q => q.earnings);
        const olderRevenue = olderQuarters.filter(q => q.revenue && q.revenue !== 0).map(q => q.revenue);
        const olderEarnings = olderQuarters.filter(q => q.earnings && q.earnings !== 0).map(q => q.earnings);
        if (recentRevenue.length === 0 || olderRevenue.length === 0) return { signal: 'INSUFFICIENT_DATA', confidence: 0, reason: 'Not enough data', revenueDeviation: 0, earningsDeviation: 0 };
        const avgRecentRevenue = recentRevenue.reduce((a, b) => a + b, 0) / recentRevenue.length;
        const avgOlderRevenue = olderRevenue.reduce((a, b) => a + b, 0) / olderRevenue.length;
        const avgRecentEarnings = recentEarnings.length > 0 ? recentEarnings.reduce((a, b) => a + b, 0) / recentEarnings.length : 0;
        const avgOlderEarnings = olderEarnings.length > 0 ? olderEarnings.reduce((a, b) => a + b, 0) / olderEarnings.length : 0;
        const revenueDeviation = ((avgRecentRevenue - avgOlderRevenue) / Math.abs(avgOlderRevenue)) * 100;
        const earningsDeviation = avgOlderEarnings !== 0 ? ((avgRecentEarnings - avgOlderEarnings) / Math.abs(avgOlderEarnings)) * 100 : 0;
        const THRESHOLD = 10;
        let signal = 'NEUTRAL', confidence = 0, reason = '';
        if (Math.abs(revenueDeviation) > THRESHOLD || Math.abs(earningsDeviation) > THRESHOLD) {
            if (revenueDeviation > THRESHOLD || earningsDeviation > THRESHOLD) {
                signal = 'BULLISH';
                confidence = Math.min(95, 50 + Math.abs((revenueDeviation + earningsDeviation) / 2));
                reason = 'Revenue and/or earnings showing significant positive growth';
            } else {
                signal = 'BEARISH';
                confidence = Math.min(95, 50 + Math.abs((revenueDeviation + earningsDeviation) / 2));
                reason = 'Revenue and/or earnings showing significant decline';
            }
        } else {
            signal = 'NEUTRAL'; confidence = 70;
            reason = 'Performance is stable and within normal range';
        }
        return { signal, confidence: Math.round(confidence), reason, revenueDeviation: revenueDeviation.toFixed(2), earningsDeviation: earningsDeviation.toFixed(2), avgRecentRevenue: (avgRecentRevenue / 1e9).toFixed(2), avgOlderRevenue: (avgOlderRevenue / 1e9).toFixed(2), avgRecentEarnings: (avgRecentEarnings / 1e9).toFixed(2), avgOlderEarnings: (avgOlderEarnings / 1e9).toFixed(2) };
    };

    const runAIAnalysis = async () => {
        setAiAnalysisRunning(true);
        setError(null);
        const results = { bullish: [], bearish: [], neutral: [], insufficient: [], timestamp: new Date().toLocaleString() };
        try {
            for (const stock of popularStocks) {
                try {
                    const response = await fetch(`${baseUrl}/api/snowai_stock_screener_fetch_data/?ticker=${stock.symbol}`);
                    const data = await response.json();
                    if (response.ok && data.earnings) {
                        const analysis = analyzeStock(data);
                        const stockResult = { ...stock, ...analysis, currentPrice: data.stock_info?.currentPrice, marketCap: data.stock_info?.marketCap };
                        if (analysis.signal === 'BULLISH') results.bullish.push(stockResult);
                        else if (analysis.signal === 'BEARISH') results.bearish.push(stockResult);
                        else if (analysis.signal === 'NEUTRAL') results.neutral.push(stockResult);
                        else results.insufficient.push(stockResult);
                    }
                } catch (err) { console.error(`Error analyzing ${stock.symbol}:`, err); }
            }
            results.bullish.sort((a, b) => b.confidence - a.confidence);
            results.bearish.sort((a, b) => b.confidence - a.confidence);
            results.neutral.sort((a, b) => b.confidence - a.confidence);
            results.marketSentiment = calculateMarketSentiment(results);
            setAiAnalysisResults(results);
            setShowAnalysisModal(true);
        } catch (err) { setError('Failed to complete AI analysis'); }
        finally { setAiAnalysisRunning(false); }
    };

    const calculateMarketSentiment = (results) => {
        const allAnalyzedStocks = [...results.bullish, ...results.bearish, ...results.neutral];
        if (allAnalyzedStocks.length === 0) return null;
        let totalMarketCap = 0, weightedBullishScore = 0, weightedBearishScore = 0, weightedNeutralScore = 0;
        allAnalyzedStocks.forEach(stock => {
            const marketCap = stock.marketCap || 0;
            totalMarketCap += marketCap;
            if (stock.signal === 'BULLISH') weightedBullishScore += marketCap * (stock.confidence / 100);
            else if (stock.signal === 'BEARISH') weightedBearishScore += marketCap * (stock.confidence / 100);
            else weightedNeutralScore += marketCap * (stock.confidence / 100);
        });
        const bullishPercentage = totalMarketCap > 0 ? (weightedBullishScore / totalMarketCap) * 100 : 0;
        const bearishPercentage = totalMarketCap > 0 ? (weightedBearishScore / totalMarketCap) * 100 : 0;
        const neutralPercentage = totalMarketCap > 0 ? (weightedNeutralScore / totalMarketCap) * 100 : 0;
        const netSentiment = bullishPercentage - bearishPercentage;
        let marketOutlook = 'NEUTRAL', marketConfidence = 65, marketDescription = '';
        let indicesOutlook = { sp500: { direction: 'NEUTRAL', confidence: 65, reasoning: '' }, nasdaq: { direction: 'NEUTRAL', confidence: 65, reasoning: '' }, dowJones: { direction: 'NEUTRAL', confidence: 65, reasoning: '' } };
        if (netSentiment > 15) {
            marketOutlook = 'BULLISH'; marketConfidence = Math.min(85, 50 + netSentiment);
            marketDescription = 'Strong positive momentum across major stocks. Large-cap growth stocks are showing significant earnings expansion.';
            indicesOutlook = { sp500: { direction: 'BULLISH', confidence: Math.min(85, 50 + netSentiment * 0.9), reasoning: 'Broad-based strength across sectors driving index higher.' }, nasdaq: { direction: 'BULLISH', confidence: Math.min(90, 50 + netSentiment * 1.1), reasoning: 'Tech and growth stocks showing strong momentum.' }, dowJones: { direction: 'BULLISH', confidence: Math.min(80, 50 + netSentiment * 0.85), reasoning: 'Blue-chip stocks demonstrating solid performance.' } };
        } else if (netSentiment < -15) {
            marketOutlook = 'BEARISH'; marketConfidence = Math.min(85, 50 + Math.abs(netSentiment));
            marketDescription = 'Widespread weakness across major stocks. Earnings pressures and declining fundamentals suggest headwinds.';
            indicesOutlook = { sp500: { direction: 'BEARISH', confidence: Math.min(85, 50 + Math.abs(netSentiment) * 0.9), reasoning: 'Broad-based weakness across multiple sectors.' }, nasdaq: { direction: 'BEARISH', confidence: Math.min(90, 50 + Math.abs(netSentiment) * 1.1), reasoning: 'Tech sector showing significant weakness.' }, dowJones: { direction: 'BEARISH', confidence: Math.min(80, 50 + Math.abs(netSentiment) * 0.85), reasoning: 'Industrial and blue-chip stocks facing headwinds.' } };
        } else {
            marketDescription = 'Mixed signals across the market. Stocks showing stable performance with balanced signals, suggesting consolidation.';
        }
        const sectorBreakdown = {};
        allAnalyzedStocks.forEach(stock => {
            if (!sectorBreakdown[stock.category]) sectorBreakdown[stock.category] = { bullish: 0, bearish: 0, neutral: 0 };
            if (stock.signal === 'BULLISH') sectorBreakdown[stock.category].bullish++;
            else if (stock.signal === 'BEARISH') sectorBreakdown[stock.category].bearish++;
            else sectorBreakdown[stock.category].neutral++;
        });
        return { marketOutlook, marketConfidence: Math.round(marketConfidence), marketDescription, bullishPercentage: bullishPercentage.toFixed(1), bearishPercentage: bearishPercentage.toFixed(1), neutralPercentage: neutralPercentage.toFixed(1), bullishCount: results.bullish.length, bearishCount: results.bearish.length, neutralCount: results.neutral.length, totalCount: results.bullish.length + results.bearish.length + results.neutral.length, totalMarketCap: (totalMarketCap / 1e12).toFixed(2), indicesOutlook, sectorBreakdown };
    };

    const handleSearch = (e) => { e.preventDefault(); if (ticker) fetchStockData(ticker); };
    const handleStockClick = (symbol) => { fetchStockData(symbol); setShowModal(false); setShowAnalysisModal(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const formatNewsDate = (timestamp) => {
        if (!timestamp || timestamp === 'N/A') return 'N/A';
        try { return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch { return timestamp; }
    };

    const prepareFinancialsChartData = () => {
        if (!financials?.data || !financials?.columns) return [];
        return financials.columns.map((year, idx) => {
            const dataPoint = { year };
            let hasData = false;
            financials.data.forEach(row => {
                if (row.values?.[idx] !== null && row.values?.[idx] !== 0) { dataPoint[row.metric] = (row.values[idx] / 1e9).toFixed(2); hasData = true; }
            });
            return hasData ? dataPoint : null;
        }).filter(Boolean).reverse();
    };

    const prepareEarningsChartData = () => {
        if (!earnings?.length) return [];
        return earnings.map(e => {
            if ((e.revenue && e.revenue !== 0) || (e.earnings && e.earnings !== 0)) {
                return { quarter: e.quarter, revenue: e.revenue ? (e.revenue / 1e9).toFixed(2) : null, earnings: e.earnings ? (e.earnings / 1e9).toFixed(2) : null };
            }
            return null;
        }).filter(Boolean).reverse();
    };

    const getChartDomain = () => {
        const chartData = prepareEarningsChartData();
        if (!chartData.length) return [0, 'auto'];
        const allValues = chartData.flatMap(i => [parseFloat(i.revenue), parseFloat(i.earnings)].filter(v => !isNaN(v)));
        if (!allValues.length) return [0, 'auto'];
        const min = Math.min(...allValues), max = Math.max(...allValues), pad = (max - min) * 0.2;
        return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10];
    };

    const getFinancialChartDomain = () => {
        const chartData = prepareFinancialsChartData();
        if (!chartData.length) return [0, 'auto'];
        const allValues = chartData.flatMap(item => Object.entries(item).filter(([k]) => k !== 'year').map(([, v]) => parseFloat(v))).filter(v => !isNaN(v));
        if (!allValues.length) return [0, 'auto'];
        const min = Math.min(...allValues), max = Math.max(...allValues), pad = (max - min) * 0.2;
        return [Math.floor((min - pad) * 10) / 10, Math.ceil((max + pad) * 10) / 10];
    };

    const handleSpeak = () => {
        if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
        else {
            const utterance = new SpeechSynthesisUtterance(stockData?.longBusinessSummary || 'No description available.');
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const categories = ['All', ...new Set(popularStocks.map(s => s.category))];
    const filteredStocks = popularStocks.filter(s => {
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const styles = {
        container: { padding: '15px', maxWidth: '1400px', width: '100%', boxSizing: 'border-box' },
        searchSection: { marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        searchForm: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
        input: { padding: '10px 15px', fontSize: '16px', border: '2px solid #e0e0e0', borderRadius: '6px', width: '200px', maxWidth: '100%', outline: 'none', boxSizing: 'border-box' },
        searchButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' },
        browseButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' },
        aiAnalysisButton: { padding: '10px 25px', fontSize: '16px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', overflow: 'auto' },
        modalContent: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '1200px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', boxSizing: 'border-box' },
        closeButton: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
        modalHeader: { fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' },
        categoryFilter: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
        categoryButton: { padding: '8px 16px', fontSize: '14px', border: '2px solid #e0e0e0', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#fff', color: '#666', fontWeight: '500' },
        categoryButtonActive: { backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' },
        stockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '15px' },
        stockCard: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer', border: '2px solid transparent', textAlign: 'center' },
        stockName: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
        stockSymbol: { fontSize: '13px', color: '#2563eb', fontWeight: '700' },
        stockCategory: { fontSize: '11px', color: '#999', marginTop: '4px' },
        analysisCard: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px', border: '2px solid transparent', cursor: 'pointer' },
        analysisCardBullish: { borderLeft: '4px solid #10b981', backgroundColor: '#f0fdf4' },
        analysisCardBearish: { borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' },
        analysisCardNeutral: { borderLeft: '4px solid #f59e0b', backgroundColor: '#fffbeb' },
        signalBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '10px', whiteSpace: 'nowrap', flexShrink: 0 },
        bullishBadge: { backgroundColor: '#10b981', color: '#fff' },
        bearishBadge: { backgroundColor: '#ef4444', color: '#fff' },
        neutralBadge: { backgroundColor: '#f59e0b', color: '#fff' },
        confidenceBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#e0e0e0', color: '#333', whiteSpace: 'nowrap', flexShrink: 0 },
        analysisSection: { marginBottom: '30px' },
        analysisSectionTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' },
        deviationText: { fontSize: '13px', color: '#666', marginTop: '8px' },
        tabContainer: { display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
        tab: { padding: '12px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', borderBottom: '3px solid transparent', color: '#666', whiteSpace: 'nowrap', flexShrink: 0 },
        activeTabStyle: { borderBottom: '3px solid #2563eb', color: '#2563eb' },
        contentCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px', width: '100%', boxSizing: 'border-box', overflowX: 'auto' },
        viewToggle: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
        toggleButton: { padding: '8px 16px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', color: '#666', fontWeight: '500' },
        toggleButtonActive: { backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' },
        overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' },
        statBox: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #2563eb' },
        statLabel: { fontSize: '13px', color: '#666', marginBottom: '5px', fontWeight: '500' },
        statValue: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a', wordBreak: 'break-word' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', minWidth: '600px' },
        th: { textAlign: 'left', padding: '12px', backgroundColor: '#f8f9fa', fontWeight: '600', borderBottom: '2px solid #e0e0e0' },
        td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
        loading: { textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' },
        error: { padding: '15px', backgroundColor: '#fee', color: '#c33', borderRadius: '6px', marginTop: '15px' },
        companyHeader: { marginBottom: '20px' },
        companyName: { fontSize: '24px', fontWeight: '700', marginBottom: '5px' },
        companySymbol: { fontSize: '14px', color: '#666' },
        voiceControls: { display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' },
        voiceButton: { padding: '8px 16px', fontSize: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
        voiceButtonStop: { backgroundColor: '#ef4444' },
        marketSentimentCard: { padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '30px', border: '3px solid #e0e0e0', boxSizing: 'border-box', width: '100%', overflow: 'hidden' },
        marketSentimentBullish: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
        marketSentimentBearish: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
        marketSentimentNeutral: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
        sentimentHeader: { fontSize: '20px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%' },
        sentimentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '20px', width: '100%' },
        sentimentStatBox: { padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', boxSizing: 'border-box', minWidth: '0' },
        indicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px', width: '100%', maxWidth: '100%', margin: '20px 0 0 0' },
        indexCard: { padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid #e0e0e0', boxSizing: 'border-box', width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '0' },
        indexCardBullish: { borderColor: '#10b981' },
        indexCardBearish: { borderColor: '#ef4444' },
        indexCardNeutral: { borderColor: '#f59e0b' },
        indexName: { fontSize: '18px', fontWeight: '700', marginBottom: '10px' },
        indexDirection: { fontSize: '14px', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
        indexReasoning: { fontSize: '13px', color: '#666', lineHeight: '1.5', wordWrap: 'break-word', overflowWrap: 'break-word' },
    };

    return (
        <div>
            <div className="header"><Header /></div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header" style={{ padding: '15px', margin: 0 }}>SnowAI Stock Screener</h5>

                    <div style={styles.container}>

                        {/* Search Section */}
                        <div style={styles.searchSection}>
                            <div style={styles.searchForm}>
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                    placeholder="Enter ticker (e.g., AAPL)"
                                    style={styles.input}
                                />
                                <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
                                    {loading ? 'Loading...' : 'Search'}
                                </button>
                                <button onClick={() => setShowModal(true)} style={styles.browseButton}>
                                    📊 Browse Stocks
                                </button>
                                <button onClick={() => setShowCalendar(c => !c)}
                                    style={{ ...styles.browseButton, backgroundColor: showCalendar ? '#1e3a5f' : '#6366f1' }}>
                                    📅 {showCalendar ? 'Hide Calendar' : 'Earnings Calendar'}
                                </button>
                                <button onClick={runAIAnalysis} style={styles.aiAnalysisButton} disabled={aiAnalysisRunning}>
                                    {aiAnalysisRunning ? <><span>⏳</span><span>Analyzing...</span></> : <><span>🤖</span><span>AI Stock Analysis</span></>}
                                </button>
                                {aiAnalysisResults && (
                                    <button onClick={() => setShowAnalysisModal(true)} style={{ ...styles.browseButton, backgroundColor: '#f59e0b' }}>
                                        📊 View Results
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowScanner(true)}
                                    style={{
                                        ...styles.browseButton,
                                        backgroundColor: '#0f172a',
                                        display:'flex', alignItems:'center', gap:'7px',
                                    }}
                                >
                                    🔭 Trend Scanner
                                </button>

                            </div>
                            {error && <div style={styles.error}>{error}</div>}
                        </div>

                        {/* Earnings Calendar */}
                        {showCalendar && (
                            <EarningsCalendar openaiKey={OPENAI_API_KEY} onSelectTicker={(sym) => {
                                setTicker(sym);
                            
                                setShowCalendar(false);
                                // Trigger a search for the selected ticker
                                setTimeout(() => {
                                    const evt = new KeyboardEvent('keypress', { key: 'Enter', bubbles: true });
                                    document.querySelector('input[placeholder*="ticker"]')?.dispatchEvent(evt);
                                }, 100);
                            }} />
                        )}

                        {/* Browse Stocks Modal */}
                        {showModal && (
                            <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                    <button style={styles.closeButton} onClick={() => setShowModal(false)}>x</button>
                                    <div style={styles.modalHeader}>Select a Stock</div>
                                    <input type="text" placeholder="Search stocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...styles.input, width: '100%', marginBottom: '15px' }} />
                                    <div style={styles.categoryFilter}>
                                        {categories.map(category => (
                                            <button key={category} onClick={() => setSelectedCategory(category)} style={{ ...styles.categoryButton, ...(selectedCategory === category ? styles.categoryButtonActive : {}) }}>
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={styles.stockGrid}>
                                        {filteredStocks.map((stock, idx) => (
                                            <div key={idx} style={styles.stockCard} onClick={() => handleStockClick(stock.symbol)}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.2)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                                                <div style={styles.stockName}>{stock.name}</div>
                                                <div style={styles.stockSymbol}>{stock.symbol}</div>
                                                <div style={styles.stockCategory}>{stock.category}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Analysis Modal */}
                        {showAnalysisModal && aiAnalysisResults && (
                            <div style={styles.modalOverlay} onClick={() => setShowAnalysisModal(false)}>
                                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                    <button style={styles.closeButton} onClick={() => setShowAnalysisModal(false)}>x</button>
                                    <div style={styles.modalHeader}>🤖 AI Stock Analysis Results</div>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>Analysis completed at {aiAnalysisResults.timestamp}</p>

                                    {aiAnalysisResults.marketSentiment && (
                                        <div style={{ ...styles.marketSentimentCard, ...(aiAnalysisResults.marketSentiment.marketOutlook === 'BULLISH' ? styles.marketSentimentBullish : aiAnalysisResults.marketSentiment.marketOutlook === 'BEARISH' ? styles.marketSentimentBearish : styles.marketSentimentNeutral) }}>
                                            <div style={styles.sentimentHeader}>
                                                <span style={{ fontSize: '28px', flexShrink: 0 }}>{aiAnalysisResults.marketSentiment.marketOutlook === 'BULLISH' ? '📈' : aiAnalysisResults.marketSentiment.marketOutlook === 'BEARISH' ? '📉' : '➡️'}</span>
                                                <span style={{ flex: '1 1 auto', minWidth: 0 }}>Overall Market Sentiment: {aiAnalysisResults.marketSentiment.marketOutlook}</span>
                                                <span style={styles.confidenceBadge}>{aiAnalysisResults.marketSentiment.marketConfidence}% Confidence</span>
                                            </div>
                                            <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>{aiAnalysisResults.marketSentiment.marketDescription}</p>
                                            <div style={styles.sentimentGrid}>
                                                {[
                                                    { label: 'Bullish Signals', pct: aiAnalysisResults.marketSentiment.bullishPercentage, count: aiAnalysisResults.marketSentiment.bullishCount, color: '#10b981' },
                                                    { label: 'Bearish Signals', pct: aiAnalysisResults.marketSentiment.bearishPercentage, count: aiAnalysisResults.marketSentiment.bearishCount, color: '#ef4444' },
                                                    { label: 'Neutral/Stable', pct: aiAnalysisResults.marketSentiment.neutralPercentage, count: aiAnalysisResults.marketSentiment.neutralCount, color: '#f59e0b' },
                                                    { label: 'Total Market Cap', pct: `$${aiAnalysisResults.marketSentiment.totalMarketCap}T`, count: `${aiAnalysisResults.marketSentiment.totalCount} stocks analyzed`, color: '#2563eb' },
                                                ].map((item, i) => (
                                                    <div key={i} style={styles.sentimentStatBox}>
                                                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>{item.label}</div>
                                                        <div style={{ fontSize: '24px', fontWeight: '700', color: item.color }}>{item.pct}{i < 3 ? '%' : ''}</div>
                                                        <div style={{ fontSize: '12px', color: '#999' }}>{item.count}{i < 3 ? ' stocks' : ''}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '25px' }}>
                                                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>📊 US Stock Indices Outlook</h4>
                                                <div style={styles.indicesGrid}>
                                                    {[
                                                        { name: 'S&P 500', key: 'sp500' },
                                                        { name: 'NASDAQ Composite', key: 'nasdaq' },
                                                        { name: 'Dow Jones Industrial', key: 'dowJones' },
                                                    ].map(({ name, key }) => {
                                                        const idx = aiAnalysisResults.marketSentiment.indicesOutlook[key];
                                                        return (
                                                            <div key={key} style={{ ...styles.indexCard, ...(idx.direction === 'BULLISH' ? styles.indexCardBullish : idx.direction === 'BEARISH' ? styles.indexCardBearish : styles.indexCardNeutral) }}>
                                                                <div style={styles.indexName}>{name}</div>
                                                                <div style={styles.indexDirection}>
                                                                    <span style={{ ...styles.signalBadge, ...(idx.direction === 'BULLISH' ? styles.bullishBadge : idx.direction === 'BEARISH' ? styles.bearishBadge : styles.neutralBadge) }}>{idx.direction}</span>
                                                                    <span style={styles.confidenceBadge}>{idx.confidence}%</span>
                                                                </div>
                                                                <div style={styles.indexReasoning}>{idx.reasoning}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.categoryFilter}>
                                        <button onClick={() => setAnalysisFilterCategory('All')} style={{ ...styles.categoryButton, ...(analysisFilterCategory === 'All' ? styles.categoryButtonActive : {}) }}>All Stocks</button>
                                        {categories.filter(c => c !== 'All').map(category => (
                                            <button key={category} onClick={() => setAnalysisFilterCategory(category)} style={{ ...styles.categoryButton, ...(analysisFilterCategory === category ? styles.categoryButtonActive : {}) }}>{category}</button>
                                        ))}
                                    </div>

                                    {[
                                        { key: 'bullish', icon: '📈', label: 'Bullish Opportunities', cardStyle: styles.analysisCardBullish, badgeStyle: styles.bullishBadge, hoverShadow: 'rgba(16,185,129,0.2)', devColor: '#10b981' },
                                        { key: 'bearish', icon: '📉', label: 'Bearish Warnings', cardStyle: styles.analysisCardBearish, badgeStyle: styles.bearishBadge, hoverShadow: 'rgba(239,68,68,0.2)', devColor: '#ef4444' },
                                        { key: 'neutral', icon: '➡️', label: 'Neutral / Stable', cardStyle: styles.analysisCardNeutral, badgeStyle: styles.neutralBadge, hoverShadow: 'rgba(245,158,11,0.2)', devColor: '#666' },
                                    ].map(({ key, icon, label, cardStyle, badgeStyle, hoverShadow, devColor }) => {
                                        const filtered = analysisFilterCategory === 'All' ? aiAnalysisResults[key] : aiAnalysisResults[key].filter(s => s.category === analysisFilterCategory);
                                        if (!filtered.length) return null;
                                        return (
                                            <div key={key} style={styles.analysisSection}>
                                                <div style={styles.analysisSectionTitle}><span>{icon}</span><span>{label} ({filtered.length})</span></div>
                                                {filtered.map((stock, idx) => (
                                                    <div key={idx} style={{ ...styles.analysisCard, ...cardStyle }} onClick={() => handleStockClick(stock.symbol)}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${hoverShadow}`; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                                                            <div>
                                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>{stock.name} ({stock.symbol})</div>
                                                                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{stock.category}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <span style={{ ...styles.signalBadge, ...badgeStyle }}>{key.toUpperCase()}</span>
                                                                <span style={styles.confidenceBadge}>{stock.confidence}% Confidence</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{stock.reason}</div>
                                                        <div style={styles.deviationText}>
                                                            Revenue Growth: <strong style={{ color: devColor }}>{stock.revenueDeviation > 0 ? '+' : ''}{stock.revenueDeviation}%</strong> |
                                                            Earnings Growth: <strong style={{ color: devColor }}>{stock.earningsDeviation > 0 ? '+' : ''}{stock.earningsDeviation}%</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock Data */}
                        {stockData && (
                            <>
                                <div style={styles.companyHeader}>
                                    <div style={styles.companyName}>{stockData.longName || ticker}</div>
                                    <div style={styles.companySymbol}>{stockData.symbol} * {stockData.sector} * {stockData.industry}</div>
                                </div>

                                <div style={styles.tabContainer}>
                                    {[
                                        { id: 'overview',   label: 'Overview' },
                                        { id: 'financials', label: 'Financials' },
                                        { id: 'earnings',   label: 'Earnings' },
                                        { id: 'chart',      label: '📊 Chart' },
                                        { id: 'news',       label: 'News' },
                                    ].map(({ id, label }) => (
                                        <button key={id} style={{ ...styles.tab, ...(activeTab === id ? styles.activeTabStyle : {}) }} onClick={() => setActiveTab(id)}>
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'overview' && (
                                    <div style={styles.contentCard}>
                                        <h3>Company Overview</h3>
                                        <div style={styles.overviewGrid}>
                                            {[
                                                { label: 'Current Price', value: `$${stockData.currentPrice?.toFixed(2) || 'N/A'}` },
                                                { label: 'Market Cap', value: stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(2)}B` : 'N/A' },
                                                { label: 'P/E Ratio', value: stockData.trailingPE?.toFixed(2) || 'N/A' },
                                                { label: '52 Week High', value: `$${stockData.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}` },
                                                { label: '52 Week Low', value: `$${stockData.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}` },
                                                { label: 'Dividend Yield', value: stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : 'N/A' },
                                            ].map(({ label, value }, i) => (
                                                <div key={i} style={styles.statBox}>
                                                    <div style={styles.statLabel}>{label}</div>
                                                    <div style={styles.statValue}>{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <h4>About</h4>
                                            <div style={styles.voiceControls}>
                                                <button onClick={handleSpeak} style={{ ...styles.voiceButton, ...(isSpeaking ? styles.voiceButtonStop : {}) }}>
                                                    {isSpeaking ? 'Stop Stop Reading' : '🔊 Read Aloud'}
                                                </button>
                                                <select value={selectedVoice?.name || ''} onChange={e => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
                                                    {voices.map((voice, idx) => <option key={idx} value={voice.name}>{voice.name} ({voice.lang})</option>)}
                                                </select>
                                            </div>
                                            <p style={{ lineHeight: '1.6', color: '#444' }}>{stockData.longBusinessSummary || 'No description available.'}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'financials' && financials && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3>Financial Statements (Annual)</h3>
                                            <div style={styles.viewToggle}>
                                                {['table', 'chart'].map(v => (
                                                    <button key={v} onClick={() => setFinancialsView(v)} style={{ ...styles.toggleButton, ...(financialsView === v ? styles.toggleButtonActive : {}) }}>
                                                        {v === 'table' ? 'Table View' : 'Chart View'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {financialsView === 'table' ? (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={styles.table}>
                                                    <thead><tr><th style={styles.th}>Metric</th>{financials.columns?.map((col, idx) => <th key={idx} style={styles.th}>{col}</th>)}</tr></thead>
                                                    <tbody>{financials.data?.map((row, idx) => (<tr key={idx}><td style={{ ...styles.td, fontWeight: '600' }}>{row.metric}</td>{row.values?.map((val, i) => <td key={i} style={styles.td}>{val && val !== 0 ? `${(val / 1e9).toFixed(2)}B` : 'N/A'}</td>)}</tr>))}</tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={prepareFinancialsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" /><YAxis domain={getFinancialChartDomain()} label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip formatter={v => `${v}B`} /><Legend />
                                                    {financials.data?.map((row, idx) => <Line key={idx} type="monotone" dataKey={row.metric} stroke={['#2563eb', '#10b981', '#f59e0b', '#ef4444'][idx % 4]} strokeWidth={2} />)}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'earnings' && earnings && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3>Quarterly Earnings</h3>
                                            <div style={styles.viewToggle}>
                                                {['table', 'chart'].map(v => (
                                                    <button key={v} onClick={() => setEarningsView(v)} style={{ ...styles.toggleButton, ...(earningsView === v ? styles.toggleButtonActive : {}) }}>
                                                        {v === 'table' ? 'Table View' : 'Chart View'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {earningsView === 'table' ? (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={styles.table}>
                                                    <thead><tr><th style={styles.th}>Quarter</th><th style={styles.th}>Revenue</th><th style={styles.th}>Earnings</th></tr></thead>
                                                    <tbody>{earnings.map((e, idx) => (<tr key={idx}><td style={styles.td}>{e.quarter}</td><td style={styles.td}>{e.revenue && e.revenue !== 0 ? `${(e.revenue / 1e9).toFixed(2)}B` : 'N/A'}</td><td style={styles.td}>{e.earnings && e.earnings !== 0 ? `${(e.earnings / 1e9).toFixed(2)}B` : 'N/A'}</td></tr>))}</tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={prepareEarningsChartData()}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="quarter" /><YAxis domain={getChartDomain()} label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip formatter={v => v ? `${v}B` : 'N/A'} /><Legend />
                                                    <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
                                                    <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                )}

                                {/* -- Chart & Insights Tab -- */}
                                {activeTab === 'chart' && (
                                    <div style={{ ...styles.contentCard, padding: 0, backgroundColor: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
                                        <ChartInsightsTab
                                            ticker={ticker}
                                            stockData={stockData}
                                            earnings={earnings}
                                            news={news}
                                            marketauxNews={hoistedMarketauxNews}
                                            openaiKey={OPENAI_API_KEY}
                                            cachedNewsAnalysis={mainCachedNewsAnalyses[ticker] || null}
                                        />
                                    </div>
                                )}

                                {/* -- Enhanced News Tab -- */}
                                {activeTab === 'news' && (
                                    <div style={styles.contentCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                            <h3 style={{ margin: 0 }}>Recent News</h3>
                                            <div style={{ fontSize: '13px', color: '#999', backgroundColor: '#f0f4ff', padding: '6px 12px', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                                                💡 Tip: Fetch Deep News for Marketaux analysis
                                            </div>
                                        </div>
                                        <EnhancedNewsSection
                                            ticker={ticker}
                                            baseUrl={baseUrl}
                                            existingNews={news}
                                            openaiKey={OPENAI_API_KEY}
                                            stockData={stockData}
                                            hoistedMarketauxNews={hoistedMarketauxNews}
                                            setHoistedMarketauxNews={setHoistedMarketauxNews}
                                            hoistedFetchingNews={hoistedFetchingNews}
                                            setHoistedFetchingNews={setHoistedFetchingNews}
                                            hoistedNewsError={hoistedNewsError}
                                            setHoistedNewsError={setHoistedNewsError}
                                            hoistedHasFetched={hoistedHasFetched}
                                            setHoistedHasFetched={setHoistedHasFetched}
                                            hoistedActiveNewsTab={hoistedActiveNewsTab}
                                            setHoistedActiveNewsTab={setHoistedActiveNewsTab}
                                            hoistedCachedAnalyses={hoistedCachedAnalyses}
                                            setHoistedCachedAnalyses={setHoistedCachedAnalyses}
                                            hoistedShowAnalysisModal={hoistedShowAnalysisModal}
                                            setHoistedShowAnalysisModal={setHoistedShowAnalysisModal}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {!stockData && !loading && (
                            <div style={styles.loading}>
                                Enter a stock ticker, browse stocks, or run AI analysis to get started
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sabrina AI Chatbot -- always available */}
            <SabrinaChat
                stockData={stockData}
                financials={financials}
                earnings={earnings}
                news={news}
                ticker={ticker}
                openaiKey={OPENAI_API_KEY}
            />
            <TrendReversalScanner
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                onSelectTicker={handleStockClick}
                openaiKey={OPENAI_API_KEY}
            />

        </div>
    );
}