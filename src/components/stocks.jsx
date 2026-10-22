import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
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

const SnowPositionMath = {
    resolveLeg(direction, entryPrice, quantity, { price, percent, dollars }, isTp) {
        const isLong = direction === 'long';
        const priceToPercent = (p) => {
            if (isTp) return isLong ? (p - entryPrice)/entryPrice*100 : (entryPrice - p)/entryPrice*100;
            return isLong ? (entryPrice - p)/entryPrice*100 : (p - entryPrice)/entryPrice*100;
        };
        const percentToPrice = (pct) => {
            if (isTp) return isLong ? entryPrice*(1+pct/100) : entryPrice*(1-pct/100);
            return isLong ? entryPrice*(1-pct/100) : entryPrice*(1+pct/100);
        };
        let resolvedPercent = null;
        if (price != null && price !== '') resolvedPercent = priceToPercent(parseFloat(price));
        else if (percent != null && percent !== '') resolvedPercent = parseFloat(percent);
        else if (dollars != null && dollars !== '' && quantity && entryPrice) resolvedPercent = (parseFloat(dollars) / (quantity * entryPrice)) * 100;
        if (resolvedPercent == null || isNaN(resolvedPercent)) return { price: null, percent: null, dollars: null };
        return {
            price: Math.round(percentToPrice(resolvedPercent) * 10000) / 10000,
            percent: Math.round(resolvedPercent * 10000) / 10000,
            dollars: Math.round(quantity * entryPrice * (resolvedPercent/100) * 100) / 100,
        };
    },
};

function PositionLegFields({ label, color, priceVal, percentVal, dollarsVal, onSync }) {
    return (
        <div style={{ padding:'10px 12px', backgroundColor:'#f8fafc', borderRadius:'9px', border:`1px solid ${color}30` }}>
            <div style={{ fontSize:'11px', fontWeight:'800', color, marginBottom:'6px' }}>{label}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
                {[['price','Price ($)'],['percent','Percent (%)'],['dollars','Dollars ($)']].map(([field, lbl]) => (
                    <div key={field}>
                        <div style={{ fontSize:'9px', color:'#94a3b8', marginBottom:'2px' }}>{lbl}</div>
                        <input type="number" value={field==='price'?priceVal:field==='percent'?percentVal:dollarsVal}
                            onChange={e => onSync(field, e.target.value)}
                            style={{ width:'100%', padding:'5px 7px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', boxSizing:'border-box' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function PositionTicket({ isOpen, onClose, ticker, currentPrice, source = 'manual', onOpened, onDraftTp, onDraftSl, getEntryContext = null, contextPreview = null }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [direction, setDirection]   = React.useState('long');
    const [quantity, setQuantity]     = React.useState('10');
    const [entryPrice, setEntryPrice] = React.useState(currentPrice != null ? String(currentPrice) : '');
    const [notes, setNotes]           = React.useState('');
    const [tpPrice, setTpPrice] = React.useState(''); const [tpPercent, setTpPercent] = React.useState(''); const [tpDollars, setTpDollars] = React.useState('');
    const [slPrice, setSlPrice] = React.useState(''); const [slPercent, setSlPercent] = React.useState(''); const [slDollars, setSlDollars] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError]           = React.useState(null);
    const [tagsText, setTagsText] = React.useState('');
    const tpAnchor = React.useRef(null);
    const slAnchor = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            setEntryPrice(currentPrice != null ? String(currentPrice) : '');
            setDirection('long'); setQuantity('10'); setNotes(''); setTagsText('');
            setTpPrice(''); setTpPercent(''); setTpDollars('');
            setSlPrice(''); setSlPercent(''); setSlDollars('');
            tpAnchor.current = null; slAnchor.current = null;
            setError(null);
        }
    }, [isOpen, ticker]);

    const entry = parseFloat(entryPrice) || 0;
    const qty   = parseFloat(quantity) || 0;

    const syncTp = (field, value) => {
        tpAnchor.current = field;
        if (field === 'price')   setTpPrice(value);
        if (field === 'percent') setTpPercent(value);
        if (field === 'dollars') setTpDollars(value);
        if (!entry || !qty) return;
        const r = SnowPositionMath.resolveLeg(direction, entry, qty, { [field]: value }, true);
        if (r.price == null) { onDraftTp && onDraftTp(null); return; }
        if (field !== 'price')   setTpPrice(String(r.price));
        if (field !== 'percent') setTpPercent(String(r.percent));
        if (field !== 'dollars') setTpDollars(String(r.dollars));
        onDraftTp && onDraftTp(r.price);
    };
    const syncSl = (field, value) => {
        slAnchor.current = field;
        if (field === 'price')   setSlPrice(value);
        if (field === 'percent') setSlPercent(value);
        if (field === 'dollars') setSlDollars(value);
        if (!entry || !qty) return;
        const r = SnowPositionMath.resolveLeg(direction, entry, qty, { [field]: value }, false);
        if (r.price == null) { onDraftSl && onDraftSl(null); return; }
        if (field !== 'price')   setSlPrice(String(r.price));
        if (field !== 'percent') setSlPercent(String(r.percent));
        if (field !== 'dollars') setSlDollars(String(r.dollars));
        onDraftSl && onDraftSl(r.price);
    };

    // Direction / entry / quantity changed -> re-resolve from whichever field was edited last
    React.useEffect(() => {
        if (!isOpen || !entry || !qty) return;
        const tpVals = { price: tpPrice, percent: tpPercent, dollars: tpDollars };
        const slVals = { price: slPrice, percent: slPercent, dollars: slDollars };
        if (tpAnchor.current && tpVals[tpAnchor.current] !== '') syncTp(tpAnchor.current, tpVals[tpAnchor.current]);
        if (slAnchor.current && slVals[slAnchor.current] !== '') syncSl(slAnchor.current, slVals[slAnchor.current]);
    }, [direction, entryPrice, quantity]);

    const submit = async () => {
        if (!entry || !qty) { setError('Entry price and quantity are required.'); return; }
        setSubmitting(true); setError(null);
        try {
            let ctx = contextPreview || null;
            try { if (getEntryContext) ctx = await getEntryContext(); } catch (_) {}
            const res = await fetch(`${BACKEND}/api/snowvault_positions/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset: ticker, direction, quantity: qty, entryPrice: entry,
                    tpPrice: tpPrice || null, tpPercent: tpPercent || null, tpDollars: tpDollars || null,
                    slPrice: slPrice || null, slPercent: slPercent || null, slDollars: slDollars || null,
                    notes, source, entryContext: ctx, tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            onOpened && onOpened(json.position);
            onClose();
        } catch (e) { setError(e.message); }
        finally { setSubmitting(false); }
    };

    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(2,6,23,0.22)', zIndex:1000001, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'12px', pointerEvents:'none' }}>
            <div style={{ pointerEvents:'auto', width:'min(430px,100%)', maxHeight:'calc(100vh - 24px)', display:'flex', flexDirection:'column', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
                <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#0f172a,#1e3a5f)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
                    <span style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>📝 Open Position — {ticker}</span>
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'28px', height:'28px', color:'#fff', fontSize:'15px', cursor:'pointer' }}>×</button>
                </div>
                <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'12px', overflowY:'auto' }}>
                    <div style={{ display:'flex', gap:'8px' }}>
                        {['long','short'].map(d => (
                            <button key={d} onClick={() => setDirection(d)} style={{
                                flex:1, padding:'10px', borderRadius:'9px', fontWeight:'800', fontSize:'13px', cursor:'pointer',
                                border:`2px solid ${direction===d ? (d==='long'?'#10b981':'#ef4444') : '#e2e8f0'}`,
                                backgroundColor: direction===d ? (d==='long'?'#f0fdf4':'#fef2f2') : '#fff',
                                color: direction===d ? (d==='long'?'#10b981':'#ef4444') : '#94a3b8',
                            }}>{d === 'long' ? '▲ LONG' : '▼ SHORT'}</button>
                        ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                        <div><label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b' }}>Quantity (shares)</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', boxSizing:'border-box', marginTop:'3px' }} /></div>
                        <div><label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b' }}>Entry Price ($)</label>
                            <input type="number" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', boxSizing:'border-box', marginTop:'3px' }} /></div>
                    </div>
                    <PositionLegFields label="🎯 TAKE PROFIT" color="#10b981" priceVal={tpPrice} percentVal={tpPercent} dollarsVal={tpDollars} onSync={syncTp} />
                    <PositionLegFields label="🛑 STOP LOSS" color="#ef4444" priceVal={slPrice} percentVal={slPercent} dollarsVal={slDollars} onSync={syncSl} />
                                        {contextPreview && (
                        <div style={{ padding:'8px 10px', borderRadius:'9px', backgroundColor:'#f5f3ff', border:'1px solid #ddd6fe' }}>
                            <div style={{ fontSize:'10px', fontWeight:'800', color:'#6d28d9', letterSpacing:'0.06em', marginBottom:'5px' }}>🏷 RECORDED WITH THIS TRADE</div>
                            <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                                {[['Lens', contextPreview.lens],
                                  ['Signal', contextPreview.signal && String(contextPreview.signal).replace(/_/g, ' ')],
                                  ['AI', contextPreview.aiVerdict && String(contextPreview.aiVerdict).replace(/_/g, ' ')],
                                  ['Score', contextPreview.score],
                                  ['Stability', contextPreview.stability != null ? `${contextPreview.stability}%` : null],
                                  ['Earnings AI', contextPreview.earningsBias]]
                                    .filter(([, v]) => v != null && v !== '')
                                    .map(([k, v]) => (
                                        <span key={k} style={{ fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'10px', backgroundColor:'#ede9fe', color:'#5b21b6' }}>{k}: {v}</span>
                                    ))}
                            </div>
                            <div style={{ fontSize:'10px', color:'#7c3aed', marginTop:'5px', lineHeight:1.4 }}>
                                {contextPreview.signal ? 'The AI verdict is also filled in from a saved snapshot if it\'s under 7 days old.' : 'No scanner data on this chart. Open it from a scanner row or the Vault to capture the signal.'}
                            </div>
                        </div>
                    )}
                    <div><label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b' }}>Your tags (optional, comma separated)</label>
                        <input type="text" value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="e.g. earnings-play, dip-buy" style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', boxSizing:'border-box', marginTop:'3px' }} /></div>
                    <div><label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b' }}>Notes (optional)</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', boxSizing:'border-box', marginTop:'3px' }} /></div>
                    {error && <div style={{ padding:'8px 12px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'12px', borderRadius:'8px' }}>⚠️ {error}</div>}
                    <button onClick={submit} disabled={submitting} style={{
                        padding:'12px', borderRadius:'10px', background: submitting ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg,#1e3a5f,#2563eb)',
                        border:'none', color:'#fff', fontWeight:'800', fontSize:'14px', cursor: submitting ? 'wait' : 'pointer',
                    }}>{submitting ? '⏳ Opening...' : `${direction === 'long' ? '▲' : '▼'} Open ${direction.toUpperCase()} Position`}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function EditPositionModal({ isOpen, onClose, position, onUpdated, onDraftTp, onDraftSl }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [tpPrice, setTpPrice] = React.useState(''); const [tpPercent, setTpPercent] = React.useState(''); const [tpDollars, setTpDollars] = React.useState('');
    const [slPrice, setSlPrice] = React.useState(''); const [slPercent, setSlPercent] = React.useState(''); const [slDollars, setSlDollars] = React.useState('');
    const [notes, setNotes]           = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError]           = React.useState(null);

    React.useEffect(() => {
        if (isOpen && position) {
            setTpPrice(position.tp_price != null ? String(position.tp_price) : '');
            setTpPercent(position.tp_percent != null ? String(position.tp_percent) : '');
            setTpDollars(position.tp_dollars != null ? String(position.tp_dollars) : '');
            setSlPrice(position.sl_price != null ? String(position.sl_price) : '');
            setSlPercent(position.sl_percent != null ? String(position.sl_percent) : '');
            setSlDollars(position.sl_dollars != null ? String(position.sl_dollars) : '');
            setNotes(position.notes || ''); setError(null);
            onDraftTp && onDraftTp(position.tp_price != null ? position.tp_price : null);
            onDraftSl && onDraftSl(position.sl_price != null ? position.sl_price : null);
        }
    }, [isOpen, position]);

    if (!isOpen || !position) return null;
    const { entry_price: entry, quantity: qty, direction } = position;

    const syncTp = (field, value) => {
        if (field === 'price')   setTpPrice(value);
        if (field === 'percent') setTpPercent(value);
        if (field === 'dollars') setTpDollars(value);
        const r = SnowPositionMath.resolveLeg(direction, entry, qty, { [field]: value }, true);
        if (r.price == null) { onDraftTp && onDraftTp(null); return; }
        if (field !== 'price')   setTpPrice(String(r.price));
        if (field !== 'percent') setTpPercent(String(r.percent));
        if (field !== 'dollars') setTpDollars(String(r.dollars));
        onDraftTp && onDraftTp(r.price);
    };
    const syncSl = (field, value) => {
        if (field === 'price')   setSlPrice(value);
        if (field === 'percent') setSlPercent(value);
        if (field === 'dollars') setSlDollars(value);
        const r = SnowPositionMath.resolveLeg(direction, entry, qty, { [field]: value }, false);
        if (r.price == null) { onDraftSl && onDraftSl(null); return; }
        if (field !== 'price')   setSlPrice(String(r.price));
        if (field !== 'percent') setSlPercent(String(r.percent));
        if (field !== 'dollars') setSlDollars(String(r.dollars));
        onDraftSl && onDraftSl(r.price);
    };

    const submit = async () => {
        setSubmitting(true); setError(null);
        try {
            const res = await fetch(`${BACKEND}/api/snowvault_positions/${position.id}/`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tpPrice: tpPrice || null, tpPercent: tpPercent || null, tpDollars: tpDollars || null,
                    slPrice: slPrice || null, slPercent: slPercent || null, slDollars: slDollars || null,
                    notes,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            onUpdated && onUpdated(json.position);
            onClose();
        } catch (e) { setError(e.message); }
        finally { setSubmitting(false); }
    };

    return ReactDOM.createPortal(
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(2,6,23,0.22)', zIndex:1000001, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'12px', pointerEvents:'none' }}>
            <div style={{ pointerEvents:'auto', width:'min(430px,100%)', maxHeight:'calc(100vh - 24px)', display:'flex', flexDirection:'column', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
                <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#0f172a,#1e3a5f)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
                    <span style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>✏️ Edit Position — {position.asset}</span>
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'28px', height:'28px', color:'#fff', fontSize:'15px', cursor:'pointer' }}>×</button>
                </div>
                <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'12px', overflowY:'auto' }}>
                    <div style={{ fontSize:'12px', color:'#64748b' }}>{position.direction === 'long' ? '▲ LONG' : '▼ SHORT'} · {position.quantity} shares @ ${position.entry_price}</div>
                    <PositionLegFields label="🎯 TAKE PROFIT" color="#10b981" priceVal={tpPrice} percentVal={tpPercent} dollarsVal={tpDollars} onSync={syncTp} />
                    <PositionLegFields label="🛑 STOP LOSS" color="#ef4444" priceVal={slPrice} percentVal={slPercent} dollarsVal={slDollars} onSync={syncSl} />
                    <div><label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b' }}>Notes</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} style={{ width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', boxSizing:'border-box', marginTop:'3px' }} /></div>
                    {error && <div style={{ padding:'8px 12px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'12px', borderRadius:'8px' }}>⚠️ {error}</div>}
                    <button onClick={submit} disabled={submitting} style={{
                        padding:'12px', borderRadius:'10px', background: submitting ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg,#1e3a5f,#2563eb)',
                        border:'none', color:'#fff', fontWeight:'800', fontSize:'14px', cursor: submitting ? 'wait' : 'pointer',
                    }}>{submitting ? '⏳ Saving...' : '💾 Save Changes'}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ═══════════════════════════ Earnings AI toolkit ═══════════════════════════
const SnowEarningsAIStore = {
    KEY: 'snowvault_earnings_ai_v1',
    MONTH_KEY: 'snowvault_earnings_month_ai_v1',
    _read(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) { return {}; } },
    _write(key, obj) {
        try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { console.error('[EarningsAIStore]', e); }
        try { window.dispatchEvent(new Event('snowvault-earnings-ai-updated')); } catch (_) {}
    },
    get(ticker)  { return this._read(this.KEY)[String(ticker || '').toUpperCase()] || null; },
    set(ticker, analysis) {
        const all = this._read(this.KEY);
        all[String(ticker).toUpperCase()] = { ...analysis, savedAt: new Date().toISOString() };
        this._write(this.KEY, all);
    },
    remove(ticker) { const all = this._read(this.KEY); delete all[String(ticker).toUpperCase()]; this._write(this.KEY, all); },
    getMonth(key) { return this._read(this.MONTH_KEY)[key] || null; },
    setMonth(key, data) {
        const all = this._read(this.MONTH_KEY);
        all[key] = { ...data, savedAt: new Date().toISOString() };
        this._write(this.MONTH_KEY, all);
    },
};

function useEarningsAIStoreVersion() {
    const [v, setV] = React.useState(0);
    React.useEffect(() => {
        const bump = () => setV(x => x + 1);
        window.addEventListener('snowvault-earnings-ai-updated', bump);
        return () => window.removeEventListener('snowvault-earnings-ai-updated', bump);
    }, []);
    return v;
}

const SNOW_BIAS_STYLE = {
    BULLISH: { color:'#10b981', icon:'📈' }, BEARISH: { color:'#ef4444', icon:'📉' },
    NEUTRAL: { color:'#94a3b8', icon:'➡️' }, MIXED:   { color:'#8b5cf6', icon:'🔀' },
};
const SNOW_VERDICT_STYLE = {
    STRONG_OPPORTUNITY: { color:'#10b981', icon:'🔥' }, OPPORTUNITY: { color:'#3b82f6', icon:'📈' },
    NEUTRAL: { color:'#94a3b8', icon:'➡️' }, CAUTION: { color:'#f59e0b', icon:'⚠️' }, AVOID: { color:'#ef4444', icon:'⛔' },
};
const snowTimeAgo = (iso) => {
    if (!iso) return '';
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const h = Math.round(mins / 60);
    return h < 48 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

function saveEarningsAIResponse(ticker, parsed, source) {
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('Expected a single JSON object.');
    const missing = ['bias', 'verdict', 'tldr'].filter(k => parsed[k] == null || parsed[k] === '');
    if (missing.length) throw new Error(`Missing required fields: ${missing.join(', ')}`);
    const bias = String(parsed.bias).toUpperCase();
    SnowEarningsAIStore.set(ticker, {
        ...parsed, ticker: String(ticker).toUpperCase(),
        bias: SNOW_BIAS_STYLE[bias] ? bias : 'MIXED',
        verdict: String(parsed.verdict).toUpperCase().replace(/ /g, '_'),
        source: source || 'AI',
    });
}

const SNOW_SOURCE_RULES = `SOURCE-QUALITY RULES: weigh hard data (filings, the earnings release, estimate revisions, price and volume reaction, options positioning) above commentary. News and social coverage can be shaped by large players with positions to protect, so explicitly flag coverage that looks promotional, one-sided, coordinated or single-sourced, and discount it. Keep "what the numbers say" separate from "what the narrative says". This is research input, not personalised financial advice.`;

function buildEarningsAIPrompt(ticker, d) {
    const info = d.stockInfo || {}, stats = d.stats || {};
    const signed  = (v) => v == null ? 'n/a' : `${v >= 0 ? '+' : ''}${v}%`;
    const fmtCap  = (v) => !v ? 'n/a' : v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${(v / 1e6).toFixed(0)}M`;
    const past    = (d.past || []).slice(0, 12);
    const quarters = past.map(q =>
        `- ${q.date}: EPS ${q.epsActual ?? 'n/a'} vs est ${q.epsEstimate ?? 'n/a'} (${signed(q.surprisePct)}) → ${q.beat === true ? 'BEAT' : q.beat === false ? 'MISS' : 'n/a'}${q.revenueFmt ? ` · revenue ${q.revenueFmt}` : ''}`
    ).join('\n') || 'No historical quarters available.';
    const next = (d.upcoming || [])[0];

    return `You are a senior equity research analyst. Produce a COMPREHENSIVE earnings analysis of ${ticker}${info.name ? ` (${info.name})` : ''}: the most recent quarter(s), how earnings have trended over time, and what that means for an investment decision now. Finish with a clear directional bias.

Today is ${new Date().toISOString().slice(0, 10)}. Search the web for current information before answering instead of relying on memory. Cover: the latest earnings release and call (guidance, margins, segment drivers, management tone), analyst estimate revisions and rating/target changes since, how the stock actually reacted to recent reports (price move, volume), upcoming catalysts, and sector/macro context.

DATA FROM MY OWN SYSTEM (treat these numbers as ground truth; use the web to explain WHY and to fill gaps):
Company: ${info.name || ticker} · ${info.sector || 'n/a'}${info.industry ? ' / ' + info.industry : ''}
Price: ${info.currentPrice != null ? '$' + Number(info.currentPrice).toFixed(2) : 'n/a'} · Market cap: ${fmtCap(info.marketCap)} · P/E: ${info.pe != null ? Number(info.pe).toFixed(1) : 'n/a'} · Fwd P/E: ${info.fwdPE != null ? Number(info.fwdPE).toFixed(1) : 'n/a'}
Next report: ${next ? `${next.date}${next.epsEstimate != null ? ' · EPS estimate ' + next.epsEstimate : ''}` : 'no upcoming date found'}
Beat record: ${stats.beatRate != null ? `${stats.beatRate}% beat rate over ${stats.totalQuarters} quarters (${stats.beatCount} beats / ${stats.missCount} misses), average surprise ${signed(stats.avgSurprise)}` : 'n/a'}
Last ${past.length} reported quarters, newest first:
${quarters}

${SNOW_SOURCE_RULES}

Respond with ONLY a JSON object (no markdown, no backticks, no preamble) in exactly this shape:
{
  "ticker": "${ticker}",
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "opportunityScore": <integer 0-100>,
  "verdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
  "tldr": "<one punchy sentence>",
  "recentQuarter": "<3-4 sentences: what happened, versus expectations, what drove it>",
  "trendOverTime": "<3-4 sentences: growth, margins and the beat/miss pattern across the multi-quarter record>",
  "guidanceAndEstimates": "<2-3 sentences: guidance, estimate revisions, rating and target changes>",
  "sentimentSummary": "<2-3 sentences: general sentiment and how the stock reacted to past reports>",
  "narrativeRiskFlags": "<1-3 sentences on coverage that looks promotional, one-sided or coordinated; empty string if none>",
  "investmentAngle": "<3-4 sentences: how an investor might think about it (pre-earnings, post-earnings or wait) and why>",
  "catalysts": ["<catalyst>", "<catalyst>"],
  "risks": ["<risk>", "<risk>"],
  "sources": ["<publication or source name>", "<publication or source name>"]
}

Do not include anything outside the JSON object. The response must be parseable by JSON.parse().`;
}

function buildEarningsMonthPrompt(monthLabel, items, totalCount) {
    const signed = (v) => v == null ? 'n/a' : `${v >= 0 ? '+' : ''}${v}%`;
    const fmtCap = (v) => !v ? 'n/a' : v >= 1e12 ? `$${(v / 1e12).toFixed(1)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(0)}B` : `$${(v / 1e6).toFixed(0)}M`;
    const lines = items.map(e => {
        const hist = (e.historicalQuarters || []).slice(0, 4)
            .map(q => `${(q.date || '').slice(0, 7)} ${q.beat === true ? 'beat' : q.beat === false ? 'miss' : '?'} ${signed(q.surprisePct)}`).join(' | ') || 'n/a';
        const status = e.isUpcoming
            ? `UPCOMING ${e.earningsDate} · EPS est ${e.epsEstimate ?? 'n/a'}${e.epsVsTrendPct != null ? ` · est vs recent trend ${signed(e.epsVsTrendPct)} (${e.epsSentimentLabel || e.epsSentiment || 'n/a'})` : ''}`
            : `REPORTED ${e.earningsDate} · EPS ${e.epsActual ?? 'n/a'} vs est ${e.epsEstimate ?? 'n/a'} (${signed(e.surprisePct)}) ${e.beat === true ? 'BEAT' : e.beat === false ? 'MISS' : ''}`;
        return `- ${e.ticker} — ${e.name} (${SECTOR_MAP[e.ticker] || 'n/a'}, ${fmtCap(e.marketCap)}): ${status} · last quarters: ${hist}`;
    }).join('\n');

    return `You are a senior equity research analyst scanning the ${monthLabel} earnings calendar for the most attractive opportunities, using general news and market sentiment. Today is ${new Date().toISOString().slice(0, 10)}.

Below are the ${items.length} largest companies by market cap (out of ${totalCount} reporting this month). Search the web for recent articles, analyst commentary and market reaction for EACH of them before answering; do not rely on memory. Rank the most lucrative opportunities. UPCOMING names may be pre-earnings setups; REPORTED names may be post-earnings continuation or fade setups. It is fine to say "avoid" or "wait until it reports".

DATA FROM MY OWN SYSTEM (ground truth for the numbers):
${lines}

${SNOW_SOURCE_RULES}

Respond with ONLY a JSON object (no markdown, no backticks, no preamble) in exactly this shape:
{
  "overallTone": "<2-3 sentences: general sentiment across this earnings month>",
  "opportunities": [
    {
      "ticker": "<ticker>",
      "rank": <integer, 1 = best>,
      "stance": "LONG" | "SHORT" | "WATCH" | "AVOID",
      "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
      "conviction": <integer 1-10>,
      "timing": "<e.g. pre-earnings run-up | post-earnings continuation | wait until it reports>",
      "thesis": "<2-3 sentences: why, grounded in the data above plus what you found>",
      "narrativeRisk": "<1 sentence: any sign the coverage is promotional, one-sided or coordinated; empty string if none>",
      "mainRisk": "<1 sentence: what would invalidate this>"
    }
  ],
  "sectorTilts": [ { "sector": "<sector>", "tilt": "<one short sentence>" } ],
  "caveats": "<1-2 sentences>"
}

Include between 5 and 12 opportunities, best first. Do not include anything outside the JSON object. The response must be parseable by JSON.parse().`;
}

function ExternalAIModal({ isOpen, onClose, title, subtitle, promptText, onParsed }) {
    const [step, setStep]         = React.useState('prompt');
    const [pasteText, setPasteText] = React.useState('');
    const [source, setSource]     = React.useState('');
    const [lastOpened, setLastOpened] = React.useState('');
    const [error, setError]       = React.useState(null);
    const [copied, setCopied]     = React.useState(false);

    React.useEffect(() => {
        if (isOpen) { setStep('prompt'); setPasteText(''); setSource(''); setError(null); }
    }, [isOpen]);

    if (!isOpen) return null;

    const LAUNCHERS = [
        { name:'Perplexity', icon:'🔍', color:'#20b2aa', url:'https://www.perplexity.ai/',    prefill: p => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
        { name:'ChatGPT',    icon:'✦',  color:'#10a37f', url:'https://chatgpt.com/',          prefill: p => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
        { name:'Gemini',     icon:'✦',  color:'#4285f4', url:'https://gemini.google.com/app', prefill: p => `https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
        { name:'Claude',     icon:'◆',  color:'#cc785c', url:'https://claude.ai/new',         prefill: p => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
        { name:'DeepSeek',   icon:'🐋', color:'#4d6bfe', url:'https://chat.deepseek.com/' },
        { name:'Qwen',       icon:'✦',  color:'#8b5cf6', url:'https://chat.qwen.ai/' },
    ];
    const PREFILL_MAX = 3500;

    const copyPrompt = () => {
        try { navigator.clipboard.writeText(promptText); } catch (_) {}
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };
    const launch = (l) => {
        setLastOpened(l.name);
        copyPrompt(); // always copied, so a long prompt can just be pasted
        const canPrefill = l.prefill && encodeURIComponent(promptText).length <= PREFILL_MAX;
        window.open(canPrefill ? l.prefill(promptText) : l.url, '_blank');
    };
    const parse = () => {
        setError(null);
        if (!pasteText.trim()) { setError('Paste the AI response first.'); return; }
        try {
            const clean = pasteText.replace(/```json/gi, '').replace(/```/g, '').trim();
            let parsed;
            try { parsed = JSON.parse(clean); }
            catch (_) {
                const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
                if (s === -1 || e <= s) throw new Error('No JSON found in that text.');
                parsed = JSON.parse(clean.slice(s, e + 1));
            }
            onParsed(parsed, source.trim() || lastOpened || 'AI');
            onClose();
        } catch (e) { setError(e.message); }
    };

    return ReactDOM.createPortal(
        <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:1000002, backgroundColor:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:'12px', backdropFilter:'blur(3px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width:'min(680px,100%)', maxHeight:'calc(100vh - 24px)', display:'flex', flexDirection:'column', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
                <div style={{ padding:'16px 20px', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', flexShrink:0, display:'flex', justifyContent:'space-between', gap:'12px', alignItems:'flex-start' }}>
                    <div>
                        <div style={{ fontSize:'15px', fontWeight:'800', color:'#fff' }}>🤖 {title}</div>
                        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', marginTop:'3px', lineHeight:1.5 }}>
                            {subtitle || 'Copy the prompt, ask any AI, then paste its JSON reply back here.'}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'30px', height:'30px', color:'#fff', fontSize:'16px', cursor:'pointer', flexShrink:0 }}>×</button>
                </div>

                {step === 'prompt' ? (
                    <>
                        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
                            <div style={{ backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'14px', fontSize:'12px', lineHeight:1.6, color:'#333', fontFamily:'monospace', whiteSpace:'pre-wrap', wordBreak:'break-word', maxHeight:'38vh', overflowY:'auto' }}>
                                {promptText}
                            </div>
                            <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'6px' }}>
                                {promptText.length.toLocaleString()} characters · clicking an AI below copies this automatically. If it's too long to pre-fill, just paste it (Ctrl/Cmd+V).
                            </div>
                        </div>
                        <div style={{ padding:'12px 20px 16px', borderTop:'1px solid #e2e8f0', backgroundColor:'#f8fafc', flexShrink:0 }}>
                            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px' }}>
                                {LAUNCHERS.map(l => (
                                    <button key={l.name} onClick={() => launch(l)} style={{ padding:'7px 12px', borderRadius:'9px', border:`1.5px solid ${l.color}55`, backgroundColor:`${l.color}14`, color:l.color, fontWeight:'700', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
                                        <span>{l.icon}</span>{l.name}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display:'flex', gap:'8px' }}>
                                <button onClick={copyPrompt} style={{ flex:1, padding:'10px', borderRadius:'9px', border:'none', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer', background: copied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#4c1d95,#7c3aed)' }}>
                                    {copied ? '✓ Copied!' : '📋 Copy Prompt'}
                                </button>
                                <button onClick={() => setStep('paste')} style={{ flex:1, padding:'10px', borderRadius:'9px', border:'2px solid #7c3aed', backgroundColor:'#fff', color:'#7c3aed', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
                                    📥 Paste Response
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 0' }}>
                            <label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b', display:'block', marginBottom:'4px' }}>Which AI is this from?</label>
                            <input type="text" list="earnings-ai-sources" value={source || lastOpened} onChange={e => setSource(e.target.value)} placeholder="Perplexity, ChatGPT, Gemini, Claude, DeepSeek, Qwen..."
                                style={{ width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', boxSizing:'border-box', marginBottom:'10px' }} />
                            <datalist id="earnings-ai-sources">
                                {['Perplexity','ChatGPT','Gemini','Claude','DeepSeek','Qwen'].map(n => <option key={n} value={n} />)}
                            </datalist>
                            <textarea autoFocus value={pasteText} onChange={e => { setPasteText(e.target.value); setError(null); }} placeholder="Paste the JSON the AI returned..."
                                style={{ width:'100%', height:'240px', padding:'12px', borderRadius:'10px', border:`2px solid ${error ? '#ef4444' : '#e2e8f0'}`, fontSize:'12px', fontFamily:'monospace', lineHeight:1.6, resize:'vertical', outline:'none', boxSizing:'border-box', backgroundColor: error ? '#fef2f2' : '#f8fafc' }} />
                            {error && <div style={{ marginTop:'8px', padding:'8px 12px', backgroundColor:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', fontSize:'12px', color:'#b91c1c' }}>⚠️ {error}</div>}
                        </div>
                        <div style={{ padding:'14px 20px 16px', display:'flex', gap:'8px', flexShrink:0 }}>
                            <button onClick={parse} disabled={!pasteText.trim()} style={{ flex:1, padding:'11px', borderRadius:'9px', border:'none', color:'#fff', fontWeight:'700', fontSize:'13px', cursor: pasteText.trim() ? 'pointer' : 'not-allowed', background: pasteText.trim() ? 'linear-gradient(135deg,#7c3aed,#4c1d95)' : 'rgba(124,58,237,0.3)' }}>✓ Parse & Save</button>
                            <button onClick={() => setStep('prompt')} style={{ padding:'11px 16px', borderRadius:'9px', border:'1px solid #e2e8f0', backgroundColor:'#fff', color:'#64748b', fontWeight:'600', fontSize:'13px', cursor:'pointer' }}>← Back</button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

function EarningsAIResultCard({ analysis, theme = 'light', onReask, onRemove }) {
    if (!analysis) return null;
    const dark = theme === 'dark';
    const tk = dark
        ? { card:'rgba(255,255,255,0.05)', text:'#e2e8f0', sub:'#94a3b8', border:'rgba(255,255,255,0.1)' }
        : { card:'#f8fafc', text:'#1a1a1a', sub:'#64748b', border:'#e2e8f0' };
    const bias    = SNOW_BIAS_STYLE[analysis.bias] || SNOW_BIAS_STYLE.MIXED;
    const verdict = SNOW_VERDICT_STYLE[analysis.verdict] || SNOW_VERDICT_STYLE.NEUTRAL;
    const asList  = (v) => Array.isArray(v) ? v.filter(Boolean) : (v ? [String(v)] : []);
    const sections = [
        ['Latest quarter', analysis.recentQuarter], ['Trend over time', analysis.trendOverTime],
        ['Guidance & estimates', analysis.guidanceAndEstimates], ['Sentiment', analysis.sentimentSummary],
        ['Investment angle', analysis.investmentAngle],
    ].filter(([, v]) => v);
    const catalysts = asList(analysis.catalysts), risks = asList(analysis.risks), sources = asList(analysis.sources).slice(0, 8);
    const chip = (color) => ({ fontSize:'11px', fontWeight:'800', padding:'3px 10px', borderRadius:'20px', backgroundColor:`${color}22`, color, border:`1px solid ${color}55`, whiteSpace:'nowrap' });
    const head = { fontSize:'10px', fontWeight:'800', color:tk.sub, letterSpacing:'0.07em', marginBottom:'3px' };

    return (
        <div data-snow-readable="true" style={{ borderRadius:'12px', border:`1px solid ${bias.color}55`, backgroundColor:tk.card, padding:'14px', color:tk.text, fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', marginBottom:'8px' }}>
                <span style={chip(bias.color)}>{bias.icon} {analysis.bias} BIAS</span>
                <span style={chip(verdict.color)}>{verdict.icon} {String(analysis.verdict).replace(/_/g, ' ')}</span>
                {analysis.confidence != null && <span style={{ fontSize:'11px', color:tk.sub, fontWeight:'700' }}>{analysis.confidence}% conf</span>}
                {analysis.opportunityScore != null && <span style={{ fontSize:'11px', color:tk.sub, fontWeight:'700' }}>score {analysis.opportunityScore}/100</span>}
                <span style={{ marginLeft:'auto' }}><ReadAloudButton tone={theme} label={`${analysis.ticker || ''} earnings analysis`} /></span>
            </div>
            <div style={{ fontSize:'13.5px', fontWeight:'700', lineHeight:1.5, marginBottom:'10px' }}>{analysis.tldr}</div>

            {sections.map(([label, text]) => (
                <div key={label} style={{ marginBottom:'9px' }}>
                    <div style={head}>{label.toUpperCase()}</div>
                    <div style={{ fontSize:'12.5px', lineHeight:1.55 }}>{text}</div>
                </div>
            ))}

            {analysis.narrativeRiskFlags && (
                <div style={{ marginBottom:'9px', padding:'8px 10px', borderRadius:'8px', backgroundColor:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.35)' }}>
                    <div style={{ ...head, color:'#f59e0b' }}>⚠️ NARRATIVE RISK</div>
                    <div style={{ fontSize:'12px', lineHeight:1.5 }}>{analysis.narrativeRiskFlags}</div>
                </div>
            )}

            {(catalysts.length > 0 || risks.length > 0) && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'10px', marginBottom:'9px' }}>
                    {catalysts.length > 0 && (
                        <div><div style={{ ...head, color:'#10b981' }}>🚀 CATALYSTS</div>
                            {catalysts.map((c, i) => <div key={i} style={{ fontSize:'12px', lineHeight:1.5 }}>• {c}</div>)}</div>
                    )}
                    {risks.length > 0 && (
                        <div><div style={{ ...head, color:'#ef4444' }}>🛑 RISKS</div>
                            {risks.map((r, i) => <div key={i} style={{ fontSize:'12px', lineHeight:1.5 }}>• {r}</div>)}</div>
                    )}
                </div>
            )}

            {sources.length > 0 && (
                <div style={{ display:'flex', gap:'4px', flexWrap:'wrap', marginBottom:'8px' }}>
                    {sources.map((s, i) => <span key={i} style={{ fontSize:'10px', padding:'1px 8px', borderRadius:'10px', border:`1px solid ${tk.border}`, color:tk.sub }}>{s}</span>)}
                </div>
            )}

            <div data-snow-skip="true" style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', fontSize:'10px', color:tk.sub }}>
                <span>via {analysis.source || 'AI'} · {snowTimeAgo(analysis.savedAt)}</span>
                <span>· AI-generated research input, not financial advice</span>
                <span style={{ marginLeft:'auto', display:'flex', gap:'6px' }}>
                    {onReask  && <button onClick={onReask}  style={{ fontSize:'10px', padding:'2px 9px', borderRadius:'6px', border:`1px solid ${tk.border}`, backgroundColor:'transparent', color:tk.sub, cursor:'pointer' }}>🔄 Re-run</button>}
                    {onRemove && <button onClick={onRemove} style={{ fontSize:'10px', padding:'2px 9px', borderRadius:'6px', border:`1px solid ${tk.border}`, backgroundColor:'transparent', color:tk.sub, cursor:'pointer' }}>🗑</button>}
                </span>
            </div>
        </div>
    );
}

function EarningsAISidePanel({ ticker, onClose }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const storeVersion = useEarningsAIStoreVersion();
    const [loading, setLoading] = React.useState(false);
    const [error, setError]     = React.useState(null);
    const [prompt, setPrompt]   = React.useState(null);
    const analysis = React.useMemo(() => SnowEarningsAIStore.get(ticker), [ticker, storeVersion]);

    const run = async () => {
        setLoading(true); setError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_earnings_search_vault/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticker }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            if (!(json.past || []).length && !(json.upcoming || []).length) throw new Error(`No earnings data found for ${ticker} (ETF, index or newly listed?).`);
            setPrompt(buildEarningsAIPrompt(ticker, json));
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ padding:'12px', fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <span style={{ fontSize:'12px', fontWeight:'800', color:'#fff' }}>📈 Earnings AI · {ticker}</span>
                <button onClick={onClose} title="Hide this panel" style={{ marginLeft:'auto', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:'6px', color:'#94a3b8', width:'24px', height:'24px', cursor:'pointer' }}>×</button>
            </div>

            {analysis ? (
                <EarningsAIResultCard analysis={analysis} theme="dark" onReask={run} onRemove={() => SnowEarningsAIStore.remove(ticker)} />
            ) : (
                <div style={{ padding:'14px', borderRadius:'10px', border:'1px dashed rgba(255,255,255,0.18)', textAlign:'center' }}>
                    <div style={{ fontSize:'12px', color:'#94a3b8', lineHeight:1.5, marginBottom:'10px' }}>
                        No earnings AI analysis saved for {ticker} yet. Run one to see the bias, trend and catalysts here.
                    </div>
                    <button onClick={run} disabled={loading} style={{ padding:'8px 14px', borderRadius:'9px', border:'none', color:'#fff', fontWeight:'800', fontSize:'12px', cursor: loading ? 'wait' : 'pointer', background:'linear-gradient(135deg,#7c3aed,#db2777)' }}>
                        {loading ? '⏳ Loading earnings data...' : '🤖 Run Earnings AI Analysis'}
                    </button>
                </div>
            )}
            {error && <div style={{ marginTop:'8px', fontSize:'11px', color:'#fca5a5' }}>⚠️ {error}</div>}
            {loading && analysis && <div style={{ marginTop:'8px', fontSize:'11px', color:'#94a3b8' }}>⏳ Loading earnings data...</div>}

            <ExternalAIModal
                isOpen={!!prompt} onClose={() => setPrompt(null)}
                title={`Earnings AI — ${ticker}`} promptText={prompt || ''}
                onParsed={(parsed, source) => saveEarningsAIResponse(ticker, parsed, source)}
            />
        </div>
    );
}

function EarningsMonthAIModal({ isOpen, onClose, monthKey, monthLabel, items, onPickTicker }) {
    const storeVersion = useEarningsAIStoreVersion();
    const [limit, setLimit]       = React.useState(25);
    const [flowOpen, setFlowOpen] = React.useState(false);
    const saved  = React.useMemo(() => SnowEarningsAIStore.getMonth(monthKey), [monthKey, storeVersion]);
    const ranked = React.useMemo(() => [...items].sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, limit), [items, limit]);
    const prompt = React.useMemo(() => buildEarningsMonthPrompt(monthLabel, ranked, items.length), [monthLabel, ranked, items.length]);
    if (!isOpen) return null;

    const STANCE = { LONG:'#10b981', SHORT:'#ef4444', WATCH:'#f59e0b', AVOID:'#94a3b8' };
    const opps = saved && Array.isArray(saved.opportunities) ? [...saved.opportunities].sort((a, b) => (a.rank || 99) - (b.rank || 99)) : [];

    return ReactDOM.createPortal(
        <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:10050, backgroundColor:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'12px', overflowY:'auto', backdropFilter:'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width:'min(860px,100%)', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.3)', fontFamily:"'Segoe UI', system-ui, sans-serif", marginTop:'8px', marginBottom:'16px' }}>
                <div style={{ padding:'16px 20px', background:'linear-gradient(135deg,#1e3a5f,#7c3aed)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>🤖 AI Month Scan — {monthLabel}</div>
                            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', marginTop:'3px' }}>
                                {items.length} companies report this month · scanning the top {Math.min(limit, items.length)} by market cap
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'30px', height:'30px', color:'#fff', fontSize:'16px', cursor:'pointer', flexShrink:0 }}>×</button>
                    </div>
                    <div style={{ display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap', alignItems:'center' }}>
                        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>Scan top</span>
                        <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ padding:'5px 8px', borderRadius:'7px', border:'none', fontSize:'12px' }}>
                            {[15, 25, 40].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <button onClick={() => setFlowOpen(true)} disabled={ranked.length === 0} style={{ padding:'7px 16px', borderRadius:'9px', border:'none', color:'#fff', fontWeight:'800', fontSize:'12px', cursor:'pointer', background:'linear-gradient(135deg,#db2777,#7c3aed)' }}>
                            {saved ? '🔄 Re-run AI scan' : '🤖 Ask AI to scan'}
                        </button>
                        {saved && <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)' }}>last scan {snowTimeAgo(saved.savedAt)} via {saved.source}</span>}
                        {saved && <ReadAloudButton tone="dark" targetId="snow-month-scan-results" label={`${monthLabel} scan`} />}
                    </div>
                </div>

                <div id="snow-month-scan-results" style={{ padding:'16px 20px', maxHeight:'70vh', overflowY:'auto' }}>
                    {!saved && (
                        <div style={{ padding:'30px 10px', textAlign:'center', color:'#94a3b8', fontSize:'13px', lineHeight:1.6 }}>
                            Hit <strong>Ask AI to scan</strong>. The prompt lists this month's biggest reporters with their beat history, and asks the AI to search recent coverage and rank the best setups, discounting coverage that looks promotional.
                        </div>
                    )}
                    {saved && (
                        <>
                            {saved.overallTone && (
                                <div style={{ padding:'10px 14px', borderRadius:'10px', backgroundColor:'#f5f3ff', border:'1px solid #ddd6fe', fontSize:'13px', lineHeight:1.55, color:'#4c1d95', marginBottom:'14px' }}>
                                    <strong>Month tone:</strong> {saved.overallTone}
                                </div>
                            )}
                            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                                {opps.map((o, i) => {
                                    const sc = STANCE[String(o.stance).toUpperCase()] || '#94a3b8';
                                    const bs = SNOW_BIAS_STYLE[String(o.sentiment).toUpperCase()] || SNOW_BIAS_STYLE.MIXED;
                                    const conv = Math.max(0, Math.min(10, Number(o.conviction) || 0));
                                    return (
                                        <div key={`${o.ticker}-${i}`} style={{ padding:'11px 13px', borderRadius:'10px', border:'1px solid #e2e8f0', borderLeft:`4px solid ${sc}` }}>
                                            <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', marginBottom:'6px' }}>
                                                <span style={{ fontSize:'11px', fontWeight:'800', color:'#94a3b8' }}>#{o.rank ?? i + 1}</span>
                                                <span onClick={() => onPickTicker && onPickTicker(o.ticker)} title="Open this stock's earnings history" style={{ fontSize:'15px', fontWeight:'800', color:'#2563eb', cursor:'pointer', textDecoration:'underline dotted' }}>{o.ticker}</span>
                                                <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 9px', borderRadius:'10px', backgroundColor:`${sc}22`, color:sc }}>{String(o.stance).toUpperCase()}</span>
                                                <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 9px', borderRadius:'10px', backgroundColor:`${bs.color}22`, color:bs.color }}>{bs.icon} {String(o.sentiment).toUpperCase()}</span>
                                                <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px' }}>
                                                    <span style={{ width:'60px', height:'5px', borderRadius:'3px', backgroundColor:'#e2e8f0', overflow:'hidden', display:'inline-block' }}>
                                                        <span style={{ display:'block', height:'100%', width:`${conv * 10}%`, backgroundColor:sc }} />
                                                    </span>
                                                    <span style={{ fontSize:'11px', fontWeight:'800', color:'#475569' }}>{conv}/10</span>
                                                </span>
                                            </div>
                                            {o.timing && <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'4px' }}>⏱ {o.timing}</div>}
                                            <div style={{ fontSize:'12.5px', lineHeight:1.55, color:'#1a1a1a' }}>{o.thesis}</div>
                                            {o.narrativeRisk && <div style={{ fontSize:'11.5px', color:'#b45309', marginTop:'5px', lineHeight:1.5 }}>⚠️ <strong>Narrative risk:</strong> {o.narrativeRisk}</div>}
                                            {o.mainRisk && <div style={{ fontSize:'11.5px', color:'#b91c1c', marginTop:'3px', lineHeight:1.5 }}>🛑 <strong>Risk:</strong> {o.mainRisk}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                            {Array.isArray(saved.sectorTilts) && saved.sectorTilts.length > 0 && (
                                <div style={{ marginTop:'14px' }}>
                                    <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', letterSpacing:'0.07em', marginBottom:'6px' }}>SECTOR TILTS</div>
                                    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                                        {saved.sectorTilts.map((s, i) => <div key={i} style={{ fontSize:'12px', color:'#475569' }}><strong>{s.sector}:</strong> {s.tilt}</div>)}
                                    </div>
                                </div>
                            )}
                            {saved.caveats && <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'12px', lineHeight:1.5 }}>{saved.caveats}</div>}
                            <div style={{ fontSize:'10px', color:'#94a3b8', marginTop:'8px' }}>AI-generated research input, not financial advice. Sentiment can already be priced in, so treat this as a shortlist to verify.</div>
                        </>
                    )}
                </div>
            </div>

            <ExternalAIModal
                isOpen={flowOpen} onClose={() => setFlowOpen(false)}
                title={`Month scan — ${monthLabel}`} promptText={prompt}
                onParsed={(parsed, source) => {
                    if (!parsed || Array.isArray(parsed) || !Array.isArray(parsed.opportunities) || parsed.opportunities.length === 0) {
                        throw new Error('Expected a JSON object with a non-empty "opportunities" array.');
                    }
                    SnowEarningsAIStore.setMonth(monthKey, { ...parsed, source, monthLabel, scannedTickers: ranked.map(r => r.ticker) });
                }}
            />
        </div>,
        document.body
    );
}

const SnowVoice = (() => {
    const listeners = new Set();
    const IS_MOBILE = typeof navigator !== 'undefined' &&
        (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 900));
    // Starting guesses, used only until the real pace of the voice has been measured
    const DEFAULT_MS_PER_CHAR = IS_MOBILE ? 85 : 66;   // roughly 12 / 15 characters per second at normal speed
    const START_LAG_MS        = IS_MOBILE ? 350 : 120; // speech rarely begins the instant 'start' fires

    const lsGet = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
    const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
    const num = (k, def, lo, hi) => { const v = parseFloat(lsGet(k)); return v >= lo && v <= hi ? v : def; };
    const readMap = (k) => { try { return JSON.parse(lsGet(k) || '{}') || {}; } catch (_) { return {}; } };
    const paceMap = () => readMap('snow_voice_learned_pace');
    const badMap  = () => readMap('snow_voice_bad_boundaries');

    const state = {
        status: 'idle', id: null, label: '', progress: 0,
        rate:    num('snow_voice_rate', 1, 0.5, 2.5),
        hlPace:  num('snow_voice_hl_pace', 1, 0.4, 2.5),   // highlight speed multiplier (your nudge)
        hlDelay: num('snow_voice_hl_delay', 0, 0, 3000),   // ms the highlight is held back
        learned: null,                                     // measured ms per character at normal speed, for the current voice
        mode: '',                                          // 'voice timing' | 'estimated'
    };

    let token = 0, map = [], text = '', resumeAt = 0, wordStart = 0, est = null, tickTimer = null, lastCancelAt = 0;
    state.error = '';
    const timers = new Set();

    const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';
    const emit = () => listeners.forEach(fn => { try { fn({ ...state }); } catch (_) {} });
    const later = (fn, ms) => {
        if (!ms) { fn(); return; }
        const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
        timers.add(id);
    };
    const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
    const stopTick = () => { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } };
    const clearHighlight = () => { try { if (window.CSS && window.CSS.highlights) window.CSS.highlights.delete('snow-speaking'); } catch (_) {} };

    const ensureStyle = () => {
        if (document.getElementById('snow-voice-style')) return;
        const s = document.createElement('style');
        s.id = 'snow-voice-style';
        s.textContent = '::highlight(snow-speaking){background-color:#fde047;color:#0f172a;}';
        document.head.appendChild(s);
    };

    // ── text collection (skips buttons, inputs, svg and anything marked data-snow-skip) ──
    const SKIP = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'STYLE', 'SCRIPT', 'SVG', 'CANVAS', 'OPTION', 'DATALIST']);
    const collect = (rootEl) => {
        const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
            acceptNode(n) {
                if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                for (let p = n.parentElement; p && p !== rootEl; p = p.parentElement) {
                    if (SKIP.has(p.tagName.toUpperCase()) || p.hasAttribute('data-snow-skip')) return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        });
        const nodes = [];
        let t = '';
        let n = walker.nextNode();
        while (n) {
            if (t) t += ' ';
            nodes.push({ node: n, start: t.length, end: t.length + n.nodeValue.length });
            t += n.nodeValue;
            n = walker.nextNode();
        }
        return { nodes, text: t };
    };

    // Length-preserving cleanup, so character offsets still line up with the DOM text
    const clean = (s) => s
        .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, (m) => ' '.repeat(m.length))
        .replace(/[·•]/g, ',')
        .replace(/[▲▼△▽►◄→←↑↓●○◆◇■□✓✗⤢⛶]/g, ' ')
        .replace(/×/g, 'x');

    const keepInView = (range) => {
        try {
            const r = range.getBoundingClientRect();
            if (!r || (!r.width && !r.height)) return;
            let el = range.startContainer.parentElement;
            while (el && el !== document.body) {
                const cs = getComputedStyle(el);
                if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) {
                    const b = el.getBoundingClientRect();
                    if (r.top < b.top + 24 || r.bottom > b.bottom - 24) el.scrollTop += (r.top - b.top) - b.height / 3;
                    return;
                }
                el = el.parentElement;
            }
            if (r.top < 60 || r.bottom > window.innerHeight - 90) window.scrollBy({ top: r.top - window.innerHeight / 3 });
        } catch (_) {}
    };

    const highlight = (start, len) => {
        if (!(window.CSS && window.CSS.highlights) || typeof window.Highlight === 'undefined') return;
        const seg = map.find(m => start >= m.start && start < m.end);
        if (!seg || !seg.node.isConnected) return;
        const off = start - seg.start;
        const range = document.createRange();
        range.setStart(seg.node, off);
        range.setEnd(seg.node, Math.min(seg.node.nodeValue.length, off + len));
        window.CSS.highlights.set('snow-speaking', new window.Highlight(range));
        keepInView(range);
    };

    const onWord = (abs) => {
        const m = text.slice(abs).match(/^(\s*)(\S+)/);
        const start = abs + (m ? m[1].length : 0);
        const word  = m ? m[2].replace(/[.,;:!?)\]"']+$/, '') : '';
        wordStart = start;
        highlight(start, Math.max(1, word.length));
        state.progress = text.length ? start / text.length : 0;
        emit();
    };

    // ── timing model ──
    const msPerChar = () => (state.learned || DEFAULT_MS_PER_CHAR) / state.hlPace;

    // When each word should start, assuming the voice's measured pace plus a pause after punctuation
    const buildWords = (a, b) => {
        const seg = text.slice(a, b), re = /\S+/g, out = [];
        let m = re.exec(seg);
        while (m) { out.push({ at: a + m.index, len: m[0].length, last: m[0].slice(-1) }); m = re.exec(seg); }
        const mpc = msPerChar() / state.rate;
        let t = 0;
        out.forEach(w => {
            w.startMs = t;
            t += (w.len + 1) * mpc;
            if (',;:'.includes(w.last)) t += 180 / state.rate;
            else if ('.!?'.includes(w.last)) t += 380 / state.rate;
        });
        return out;
    };

    // Re-anchor the estimate so the clock agrees with the word currently highlighted
    const realignTo = (pos) => {
        if (!est || !est.words.length) return;
        let i = 0;
        while (i + 1 < est.words.length && est.words[i + 1].at <= pos) i++;
        est.tAudio = performance.now() - est.words[i].startMs - state.hlDelay;
        est.idx = i;
    };
    const rebuildEstimator = () => {
        if (!est) return;
        est.words = buildWords(est.a, est.b);
        realignTo(wordStart);
    };

    // One 45 ms tick drives the highlight from the real clock (no drifting chained timeouts)
    const startTick = () => {
        if (tickTimer) return;
        tickTimer = setInterval(() => {
            if (!est || state.status !== 'playing') return;
            const now = performance.now();
            if (est.boundaryMode) {
                if (now - est.lastBoundaryAt < 2200) return;
                est.boundaryMode = false;      // the voice stopped reporting words: carry on from the last real one
                realignTo(wordStart);
                state.mode = 'estimated'; emit();
            }
            const elapsed = now - est.tAudio - state.hlDelay;
            if (elapsed < 0) return;
            let k = est.idx;
            while (k + 1 < est.words.length && est.words[k + 1].startMs <= elapsed) k++;
            if (k !== est.idx && k >= 0) { est.idx = k; onWord(est.words[k].at); }
        }, 45);
    };

    // Short chunks avoid Chrome cutting long utterances off mid-way
    const chunkRanges = (from) => {
        const out = [];
        const MAX = 200;
        let i = from;
        while (i < text.length) {
            let end = Math.min(i + MAX, text.length);
            if (end < text.length) {
                const win = text.slice(i, end);
                let cut = Math.max(win.lastIndexOf('. '), win.lastIndexOf('! '), win.lastIndexOf('? '), win.lastIndexOf('; '));
                if (cut < 60) cut = Math.max(win.lastIndexOf(', '), win.lastIndexOf(' '));
                if (cut > 0) end = i + cut + 1;
            }
            out.push([i, end]);
            i = end;
        }
        return out;
    };

    const voiceObj = () => {
        const name = lsGet('sabrina_voice');
        if (name) {
            const v = window.speechSynthesis.getVoices().find(x => x.name === name);
            if (v) return v;
        }
        return null;
    };
    const voiceKey = () => { const v = voiceObj(); return v ? v.name : 'default'; };

        const synthBusy = () => { try { return window.speechSynthesis.speaking || window.speechSynthesis.pending; } catch (_) { return false; } };
    const safeCancel = () => {
        try { if (synthBusy()) { window.speechSynthesis.cancel(); lastCancelAt = performance.now(); } } catch (_) {}
    };

    const stopInternal = () => {
        token++;
        stopTick(); clearTimers();
        est = null;
        safeCancel();
        clearHighlight();
        state.status = 'idle'; state.id = null; state.progress = 0; state.mode = ''; state.error = '';
        emit();
    };

    // Keep the bar up with a reason instead of silently vanishing
    const fail = (message) => {
        token++;
        stopTick(); clearTimers();
        est = null;
        safeCancel();
        clearHighlight();
        state.status = 'error'; state.error = message; state.mode = '';
        emit();
    };

    const speakFrom = (start) => {
        const myToken = ++token;
        const wasBusy = synthBusy();
        safeCancel();
        clearTimers();
        const ranges = chunkRanges(start);
        if (!ranges.length) { stopInternal(); return; }

        const voice = voiceObj();
        const vKey  = voice ? voice.name : 'default';
        state.learned = paceMap()[vKey] || null;
        const distrust = !!badMap()[vKey];   // this voice has burst its word events before: don't trust them
        state.mode = 'estimated';
        state.status = 'playing';
        state.error = '';
        emit();
        startTick();
        let quick = 0;

        const playChunk = (k) => {
            if (myToken !== token) return;
            if (k >= ranges.length) { stopInternal(); return; }
            const [a, b] = ranges[k];
            const utt = new window.SpeechSynthesisUtterance(text.slice(a, b));
            if (voice) { utt.voice = voice; utt.lang = voice.lang; }
            utt.rate = state.rate;

            est = { a, b, words: buildWords(a, b), tAudio: performance.now() + START_LAG_MS, idx: -1, boundaryMode: false, lastBoundaryAt: 0 };
            let tStart = 0, prevB = null, fast = 0, good = 0, burst = distrust, ended = false, gotBoundary = false;

            // Nothing started in 4s = the browser almost certainly blocked or dropped the speech
            const startWatch = setTimeout(() => {
                if (myToken === token && !tStart) fail('No audio started. The browser may have blocked speech. Tap Retry, or pick another voice in the list.');
            }, 4000);
            timers.add(startWatch);

            utt.onstart = () => {
                if (myToken !== token) return;
                tStart = performance.now();
                clearTimeout(startWatch);
                if (est && est.a === a) est.tAudio = tStart + START_LAG_MS;   // anchor to when speech really began
                startTick();
            };
            utt.onboundary = (e) => {
                if (myToken !== token || burst || !est || est.a !== a) return;
                if (e.name && e.name !== 'word') return;
                gotBoundary = true;
                const now = performance.now();
                const c = a + (e.charIndex || 0);
                if (prevB) {
                    // Events arriving much faster than the speech could be spoken = a burst, not real timing
                    const expect = Math.max(1, c - prevB.c) * (msPerChar() / state.rate);
                    if (now - prevB.t < expect * 0.3) fast++; else good++;
                    if (fast >= 3 && fast > good) {
                        burst = true; est.boundaryMode = false;
                        const bad = badMap(); bad[vKey] = 1; lsSet('snow_voice_bad_boundaries', JSON.stringify(bad));
                        state.mode = 'estimated'; emit();
                        return;
                    }
                }
                prevB = { c, t: now };
                est.boundaryMode = true; est.lastBoundaryAt = now;
                if (state.mode !== 'voice timing') { state.mode = 'voice timing'; emit(); }
                later(() => { if (myToken === token) onWord(c); }, state.hlDelay);
            };
            utt.onend = () => {
                if (ended) return; ended = true;
                clearTimeout(startWatch);
                if (myToken !== token) return;
                const dur = tStart ? performance.now() - tStart : 0, chars = b - a;
                // 30+ characters can't be spoken in under 250 ms: the voice produced no audio
                if (chars >= 30 && dur < 250 && !gotBoundary) {
                    quick++;
                    if (quick >= 2) { fail('This voice finished instantly with no sound. Pick a different voice in the list.'); return; }
                } else quick = 0;
                // Learn how fast this voice really speaks
                if (tStart && chars >= 40 && dur > 400) {
                    const obs = Math.min(200, Math.max(30, dur * state.rate / chars));
                    state.learned = state.learned == null ? obs : 0.6 * state.learned + 0.4 * obs;
                    const m = paceMap(); m[vKey] = Math.round(state.learned * 10) / 10;
                    lsSet('snow_voice_learned_pace', JSON.stringify(m));
                }
                playChunk(k + 1);
            };
            utt.onerror = (e) => {
                clearTimeout(startWatch);
                if (myToken !== token) return;
                if (e.error === 'interrupted' || e.error === 'canceled') return;
                fail(e.error === 'not-allowed'
                    ? 'The browser blocked speech. Tap Retry (it has to start from a tap).'
                    : `Speech failed (${e.error || 'unknown error'}). Try another voice in the list.`);
            };
            window.speechSynthesis.speak(utt);
        };

        // Speak straight away when possible: phones only allow it inside the tap that started it.
        // A short delay is only needed right after a cancel(), which Chrome can otherwise swallow the new utterance on.
        const go = () => { if (myToken === token) playChunk(0); };
        if (wasBusy || performance.now() - lastCancelAt < 150) setTimeout(go, 80); else go();
    };

    return {
        supported,
        get state() { return state; },
                // Speak a silent utterance inside a tap, to unlock speech for later calls (iOS especially)
        prime() {
            if (!supported()) return;
            try {
                const u = new window.SpeechSynthesisUtterance(' ');
                u.volume = 0;
                window.speechSynthesis.speak(u);
            } catch (_) {}
        },
        subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
        start(id, el, label) {
            if (!supported() || !el) return false;
            ensureStyle();
            stopInternal();
            const c = collect(el);
            if (!c.text.trim()) return false;
            map = c.nodes; text = clean(c.text);
            state.id = id; state.label = label || ''; state.progress = 0;
            resumeAt = 0; wordStart = 0;
            speakFrom(0);
            return true;
        },
        pause() {
            if (state.status !== 'playing') return;
            resumeAt = wordStart; token++; stopTick(); clearTimers();
            try { window.speechSynthesis.cancel(); } catch (_) {}
            state.status = 'paused';
            emit();
        },
        resume() { if (state.status === 'paused') speakFrom(resumeAt); },
        stop() { stopInternal(); },
        setRate(r) {
            state.rate = r;
            lsSet('snow_voice_rate', String(r));
            if (state.status === 'playing') speakFrom(wordStart); else emit();
        },
        setVoiceName(name) {
            if (name) lsSet('sabrina_voice', name); else { try { localStorage.removeItem('sabrina_voice'); } catch (_) {} }
            if (state.status === 'playing') speakFrom(wordStart); else emit();
        },
        // Live highlight tuning (applies without restarting the audio)
        nudgePace(factor) {
            state.hlPace = Math.min(2.5, Math.max(0.4, Math.round(state.hlPace * factor * 1000) / 1000));
            lsSet('snow_voice_hl_pace', String(state.hlPace));
            rebuildEstimator(); emit();
        },
        nudgeDelay(ms) {
            state.hlDelay = Math.min(3000, Math.max(0, state.hlDelay + ms));
            lsSet('snow_voice_hl_delay', String(state.hlDelay));
            emit();
        },
        resetSync() {
            state.hlPace = 1; state.hlDelay = 0; state.learned = null;
            lsSet('snow_voice_hl_pace', '1'); lsSet('snow_voice_hl_delay', '0');
            const key = voiceKey();
            const p = paceMap(); delete p[key]; lsSet('snow_voice_learned_pace', JSON.stringify(p));
            const b = badMap();  delete b[key]; lsSet('snow_voice_bad_boundaries', JSON.stringify(b));
            if (state.status === 'playing') speakFrom(wordStart); else emit();
        },
    };
})();

function useSnowVoice(selector) {
    const [val, setVal] = React.useState(() => selector(SnowVoice.state));
    React.useEffect(() => SnowVoice.subscribe(s => setVal(selector(s))), []);
    return val;
}

function SnowVoiceBar() {
    const s = useSnowVoice(st => st);
    const [showSync, setShowSync] = React.useState(false);
    const [voices, setVoices] = React.useState(() => (SnowVoice.supported() ? window.speechSynthesis.getVoices() : []));
    React.useEffect(() => {
        if (!SnowVoice.supported()) return;
        const load = () => setVoices(window.speechSynthesis.getVoices());
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }, []);
    let currentVoice = '';
    try { currentVoice = localStorage.getItem('sabrina_voice') || ''; } catch (_) {}

    const ctl  = { background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'#e2e8f0', borderRadius:'8px', padding:'5px 11px', fontSize:'12px', fontWeight:'700', cursor:'pointer' };
    const sel  = { ...ctl, padding:'5px 6px', fontWeight:'600', backgroundColor:'#0f172a' };
    const step = { ...ctl, padding:'2px 10px', fontSize:'14px', lineHeight:1.2 };
    const followingVoice = s.mode === 'voice timing';

    return (
        <div style={{
            position:'fixed', left:'50%', transform:'translateX(-50%)', bottom:'14px', zIndex:2000000,
            width:'min(560px, 94vw)', backgroundColor:'rgba(10,22,40,0.97)', border:'1px solid rgba(124,58,237,0.5)',
            borderRadius:'14px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)', padding:'10px 12px',
            fontFamily:"'Segoe UI', system-ui, sans-serif",
        }}>
            {s.status === 'error' && (
                <div style={{ fontSize:'12px', color:'#fca5a5', lineHeight:1.5, marginBottom:'8px' }}>⚠️ {s.error}</div>
            )}
            <div style={{ height:'3px', borderRadius:'2px', backgroundColor:'rgba(255,255,255,0.12)', marginBottom:'8px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.round((s.progress || 0) * 100)}%`, backgroundColor:'#a78bfa', transition:'width 0.2s' }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                {s.status !== 'error' && (
                    <button onClick={() => (s.status === 'playing' ? SnowVoice.pause() : SnowVoice.resume())} style={ctl}>
                        {s.status === 'playing' ? '⏸ Pause' : '▶ Resume'}
                    </button>
                )}
                <button onClick={() => SnowVoice.stop()} style={ctl}>⏹ Stop</button>
                <span style={{ fontSize:'11px', color:'#94a3b8', flex:1, minWidth:'70px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    🔊 {s.label || 'Reading'}
                </span>
                <button onClick={() => setShowSync(v => !v)} title="Tune the yellow highlight" style={{ ...ctl, backgroundColor: showSync ? 'rgba(167,139,250,0.25)' : ctl.background }}>⚙ Sync</button>
                <select value={String(s.rate)} onChange={e => SnowVoice.setRate(parseFloat(e.target.value))} style={sel}>
                    {[0.75, 1, 1.25, 1.5, 1.75, 2].map(r => <option key={r} value={String(r)}>{r}×</option>)}
                </select>
                <select value={currentVoice} onChange={e => SnowVoice.setVoiceName(e.target.value)} style={{ ...sel, maxWidth:'150px' }}>
                    <option value="">Browser default</option>
                    {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
            </div>

            {showSync && (
                <div style={{ marginTop:'9px', paddingTop:'9px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'14px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', opacity: followingVoice ? 0.45 : 1 }}>
                        <span style={{ fontSize:'11px', color:'#94a3b8' }}>Highlight pace</span>
                        <button onClick={() => SnowVoice.nudgePace(1 / 1.12)} style={step}>−</button>
                        <span style={{ fontSize:'12px', fontWeight:'800', color:'#e2e8f0', minWidth:'40px', textAlign:'center' }}>{Math.round(s.hlPace * 100)}%</span>
                        <button onClick={() => SnowVoice.nudgePace(1.12)} style={step}>+</button>
                    </span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
                        <span style={{ fontSize:'11px', color:'#94a3b8' }}>Delay</span>
                        <button onClick={() => SnowVoice.nudgeDelay(-100)} style={step}>−</button>
                        <span style={{ fontSize:'12px', fontWeight:'800', color:'#e2e8f0', minWidth:'40px', textAlign:'center' }}>{(s.hlDelay / 1000).toFixed(1)}s</span>
                        <button onClick={() => SnowVoice.nudgeDelay(100)} style={step}>+</button>
                    </span>
                    <button onClick={() => SnowVoice.resetSync()} title="Reset pace/delay and forget what was learned for this voice" style={{ ...step, fontSize:'11px' }}>↺ Reset</button>
                    <span style={{ fontSize:'10px', color:'#64748b', flexBasis:'100%' }}>
                        {followingVoice
                            ? 'Following this voice\'s own word timing. Pace has no effect here; use Delay if the highlight leads the audio.'
                            : 'Estimated timing, learned from this voice as it speaks. If the highlight runs ahead, press Pace −. If it\'s early or late by a steady amount, use Delay.'}
                    </span>
                </div>
            )}
        </div>
    );
}

function ReadAloudButton({ tone = 'light', label = 'Read', beforeRead = null, targetId = null, style = {} }) {
    const wrapRef = React.useRef(null);
    const idRef   = React.useRef(`snow-read-${Math.random().toString(36).slice(2)}`);
    const status  = useSnowVoice(s => (s.id === idRef.current ? s.status : 'idle'));

    // Reading stops automatically when this card / modal goes away
    React.useEffect(() => () => { if (SnowVoice.state.id === idRef.current) SnowVoice.stop(); }, []);

    if (!SnowVoice.supported()) return null;

    const palette = tone === 'dark'
        ? { bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.18)', color:'#cbd5e1' }
        : { bg:'#f1f5f9', border:'#e2e8f0', color:'#475569' };
    const active = status !== 'idle';
    const pill = {
        padding:'2px 9px', borderRadius:'6px', fontSize:'10px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap',
        border:`1px solid ${status === 'error' ? '#f87171' : active ? '#a78bfa' : palette.border}`,
        backgroundColor: status === 'error' ? 'rgba(248,113,113,0.15)' : active ? 'rgba(167,139,250,0.2)' : palette.bg,
        color: status === 'error' ? '#f87171' : active ? '#a78bfa' : palette.color,
    };

    const click = async (e) => {
        e.stopPropagation();
        if (status === 'playing') { SnowVoice.pause(); return; }
        if (status === 'paused')  { SnowVoice.resume(); return; }
        // Anything awaited before speaking can cost phones the tap, so only do it when we have to
        if (beforeRead) {
            SnowVoice.prime();
            await beforeRead();
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        }
        const wrap = wrapRef.current;
        const el = targetId
            ? document.getElementById(targetId)
            : (wrap && (wrap.closest('[data-snow-readable]') || wrap.parentElement));
        SnowVoice.start(idRef.current, el, label);
    };

    return (
        <span ref={wrapRef} data-snow-skip="true" style={{ display:'inline-flex', alignItems:'center', gap:'4px', ...style }}>
            <button onClick={click} title="Read aloud" style={pill}>
                {status === 'playing' ? '⏸ Pause' : status === 'paused' ? '▶ Resume' : status === 'error' ? '↻ Retry' : '🔊 Read'}
            </button>
            {active && (
                <button onClick={(e) => { e.stopPropagation(); SnowVoice.stop(); }} title="Stop" style={pill}>⏹</button>
            )}
            {active && ReactDOM.createPortal(<SnowVoiceBar />, document.body)}
        </span>
    );
}

// ═══════════════════════════ Vault: assets of interest ═══════════════════════════
const SnowVaultInterest = (() => {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const state = { items: [], loaded: false, loading: false, error: null };
    const listeners = new Set();
    const emit = () => listeners.forEach(fn => { try { fn(); } catch (_) {} });
    const post = async (name, body) => {
        const res  = await fetch(`${BACKEND}/api/snowvault_interest_${name}/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
        return json;
    };
    const upsert = (asset) => {
        const i = state.items.findIndex(a => a.ticker === asset.ticker);
        state.items = i >= 0 ? state.items.map((a, k) => (k === i ? asset : a)) : [asset, ...state.items];
    };
    return {
        get: () => state,
        subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
        async load(force) {
            if (state.loading || (state.loaded && !force)) return;
            state.loading = true; state.error = null; emit();
            try { const json = await post('list'); state.items = json.assets || []; state.loaded = true; }
            catch (e) { state.error = e.message; }
            finally { state.loading = false; emit(); }
        },
        async add(ticker, extra)    { const j = await post('add', { ticker, ...(extra || {}) }); upsert(j.asset); emit(); return j.asset; },
        async update(ticker, patch) { const j = await post('update', { ticker, ...patch });      upsert(j.asset); emit(); return j.asset; },
        async remove(ticker)        { await post('remove', { ticker }); state.items = state.items.filter(a => a.ticker !== ticker); emit(); },
        async analyse(tickers)      { const j = await post('analyse', { tickers }); (j.assets || []).forEach(upsert); emit(); return j; },
    };
})();

function useVaultInterest() {
    const [, bump] = React.useState(0);
    React.useEffect(() => {
        const unsub = SnowVaultInterest.subscribe(() => bump(x => x + 1));
        SnowVaultInterest.load(false);
        return unsub;
    }, []);
    const st = SnowVaultInterest.get();
    return { items: st.items, loaded: st.loaded, loading: st.loading, error: st.error, byTicker: Object.fromEntries(st.items.map(a => [a.ticker, a])) };
}

// ⭐ toggle — drop it next to any ticker. `snapshot` = { name, sector, price, signal, direction, score }
function VaultStarButton({ ticker, snapshot = null, source = 'chart', tone = 'dark', style = {} }) {
    const { byTicker } = useVaultInterest();
    const [busy, setBusy] = React.useState(false);
    const [err, setErr]   = React.useState(null);
    const existing = byTicker[ticker];
    const inVault  = !!existing;
    const dark = tone === 'dark';

    const toggle = async (e) => {
        e.stopPropagation();
        if (busy) return;
        if (inVault && (existing.note || (existing.tags || []).length) && !window.confirm(`Remove ${ticker} from the vault? Its note and tags will be deleted.`)) return;
        setBusy(true); setErr(null);
        try {
            if (inVault) await SnowVaultInterest.remove(ticker);
            else await SnowVaultInterest.add(ticker, { source, snapshot });
        } catch (error) { setErr(error.message); }
        finally { setBusy(false); }
    };

    return (
        <button onClick={toggle} disabled={busy}
            title={err ? `Vault error: ${err}` : inVault ? `${ticker} is in your vault. Click to remove.` : `Add ${ticker} to your vault of assets of interest`}
            style={{
                padding:'3px 9px', borderRadius:'5px', fontSize:'11px', fontWeight:'700', cursor: busy ? 'wait' : 'pointer', whiteSpace:'nowrap',
                border: `1px solid ${err ? '#f87171' : inVault ? '#facc15' : (dark ? 'transparent' : '#e2e8f0')}`,
                backgroundColor: inVault ? 'rgba(250,204,21,0.18)' : (dark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'),
                color: err ? '#f87171' : inVault ? '#facc15' : (dark ? '#64748b' : '#475569'),
                ...style,
            }}
        >{err ? '⚠️ Vault' : inVault ? '★ Vault' : '☆ Vault'}</button>
    );
}

function VaultInterestModal({ isOpen, onClose, onSelectTicker }) {
    const { items, loading, error } = useVaultInterest();
    const [search, setSearch]     = React.useState('');
    const [tagFilter, setTagFilter] = React.useState('');
    const [sortBy, setSortBy]     = React.useState('added');
    const [addTicker, setAddTicker] = React.useState('');
    const [addNote, setAddNote]   = React.useState('');
    const [addTags, setAddTags]   = React.useState('');
    const [adding, setAdding]     = React.useState(false);
    const [localError, setLocalError] = React.useState(null);
    const [analysing, setAnalysing] = React.useState({});
    const [failed, setFailed]     = React.useState({});
    const [chartTicker, setChartTicker] = React.useState(null);
    const [chartInterval, setChartInterval] = React.useState('1D');
    const [editing, setEditing]   = React.useState(null); // { ticker, note, tags }

    const sinceAdded = (a) => (a.addedPrice && a.analysis && a.analysis.currentPrice != null)
        ? ((a.analysis.currentPrice - a.addedPrice) / a.addedPrice) * 100 : null;

    const allTags = React.useMemo(() => [...new Set(items.flatMap(a => a.tags || []))].sort(), [items]);
    const shown = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = items.filter(a =>
            (!q || a.ticker.toLowerCase().includes(q) || (a.name || '').toLowerCase().includes(q)) &&
            (!tagFilter || (a.tags || []).includes(tagFilter)));
        const keys = {
            added:  a => Date.parse(a.createdAt) || 0,
            score:  a => (a.analysis && a.analysis.score != null ? a.analysis.score : -1),
            since:  a => { const v = sinceAdded(a); return v == null ? -Infinity : v; },
        };
        if (sortBy === 'ticker') return [...list].sort((a, b) => a.ticker.localeCompare(b.ticker));
        return [...list].sort((a, b) => keys[sortBy](b) - keys[sortBy](a));
    }, [items, search, tagFilter, sortBy]);

    if (!isOpen) return null;

    const SIG = {
        RANGE_BREAKOUT_BULL: ['🚀', 'Range breakout ▲', '#10b981'], RANGE_BREAKOUT_BEAR: ['🔻', 'Range breakout ▼', '#ef4444'],
        ACCELERATING_BULL:   ['⚡', 'Accelerating ▲',   '#3b82f6'], ACCELERATING_BEAR:   ['⚡', 'Accelerating ▼',   '#f97316'],
        BREAKOUT:            ['📈', 'Breakout',          '#8b5cf6'], TREND_BUILDING:      ['📊', 'Trend building',    '#06b6d4'],
        WATCH:               ['👁', 'Watch',             '#94a3b8'],
    };

    const analyseTickers = async (tickers) => {
        const list = [...new Set(tickers)];
        if (!list.length) return;
        setLocalError(null);
        setAnalysing(prev => { const n = { ...prev }; list.forEach(t => { n[t] = true; }); return n; });
        try {
            for (let i = 0; i < list.length; i += 8) {
                const chunk = list.slice(i, i + 8);
                const json  = await SnowVaultInterest.analyse(chunk);
                const bad   = new Set(json.failed || []);
                setFailed(prev => { const n = { ...prev }; chunk.forEach(t => { if (bad.has(t)) n[t] = true; else delete n[t]; }); return n; });
                setAnalysing(prev => { const n = { ...prev }; chunk.forEach(t => delete n[t]); return n; });
            }
        } catch (e) { setLocalError(e.message); }
        finally { setAnalysing(prev => { const n = { ...prev }; list.forEach(t => delete n[t]); return n; }); }
    };

    const doAdd = async () => {
        const t = addTicker.trim().toUpperCase();
        if (!t) return;
        setAdding(true); setLocalError(null);
        try {
            const asset = await SnowVaultInterest.add(t, { source: 'manual', note: addNote, tags: addTags });
            setAddTicker(''); setAddNote(''); setAddTags('');
            analyseTickers([asset.ticker]);
        } catch (e) { setLocalError(e.message); }
        finally { setAdding(false); }
    };

    const saveEdit = async () => {
        if (!editing) return;
        try { await SnowVaultInterest.update(editing.ticker, { note: editing.note, tags: editing.tags }); setEditing(null); }
        catch (e) { setLocalError(e.message); }
    };

    const removeAsset = async (a) => {
        if ((a.note || (a.tags || []).length) && !window.confirm(`Remove ${a.ticker} from the vault? Its note and tags will be deleted.`)) return;
        try { await SnowVaultInterest.remove(a.ticker); if (chartTicker === a.ticker) setChartTicker(null); }
        catch (e) { setLocalError(e.message); }
    };

    const toggleChart = (a) => {
        if (chartTicker === a.ticker) { setChartTicker(null); return; }
        setChartTicker(a.ticker);
        // Stale analysis would make a trade's recorded context misleading, so refresh it when opening the chart
        if (!a.lastAnalysedAt || Date.now() - Date.parse(a.lastAnalysedAt) > 6 * 3600 * 1000) analyseTickers([a.ticker]);
    };

    const analysingCount = Object.keys(analysing).length;
    const btn = (color) => ({ padding:'4px 11px', borderRadius:'8px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:`1px solid ${color}55`, backgroundColor:`${color}12`, color });
    const inp = { padding:'7px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none' };

    return ReactDOM.createPortal(
        <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:10078, backgroundColor:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'12px', overflowY:'auto', backdropFilter:'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width:'min(940px,100%)', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.35)', fontFamily:"'Segoe UI', system-ui, sans-serif", marginTop:'8px', marginBottom:'16px' }}>
                <div style={{ padding:'16px 20px', background:'linear-gradient(135deg,#0f172a,#b45309)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>⭐ Vault: assets of interest ({items.length})</div>
                            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', marginTop:'3px', lineHeight:1.5 }}>
                                Stays here even when the scanner stops flagging them. Analyse on demand, chart them, trade them.
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'30px', height:'30px', color:'#fff', fontSize:'16px', cursor:'pointer', flexShrink:0 }}>×</button>
                    </div>
                    <div style={{ display:'flex', gap:'6px', marginTop:'12px', flexWrap:'wrap' }}>
                        <input value={addTicker} onChange={e => setAddTicker(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && doAdd()} placeholder="Ticker (e.g. NVDA)" style={{ ...inp, width:'120px' }} />
                        <input value={addNote} onChange={e => setAddNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && doAdd()} placeholder="Why it's interesting (optional)" style={{ ...inp, flex:'1 1 180px', minWidth:'140px' }} />
                        <input value={addTags} onChange={e => setAddTags(e.target.value)} onKeyDown={e => e.key === 'Enter' && doAdd()} placeholder="tags, comma, separated" style={{ ...inp, width:'160px' }} />
                        <button onClick={doAdd} disabled={adding || !addTicker.trim()} style={{ padding:'7px 16px', borderRadius:'8px', border:'none', fontWeight:'800', fontSize:'12px', color:'#fff', cursor: adding ? 'wait' : 'pointer', backgroundColor: addTicker.trim() ? '#f59e0b' : 'rgba(245,158,11,0.4)' }}>
                            {adding ? '⏳' : '＋ Add'}
                        </button>
                    </div>
                </div>

                <div style={{ padding:'10px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center', backgroundColor:'#f8fafc' }}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticker or name…" style={{ ...inp, width:'160px' }} />
                    <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} style={inp}>
                        <option value="">All tags</option>
                        {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inp}>
                        <option value="added">Newest added</option><option value="score">Highest score</option>
                        <option value="since">Best since added</option><option value="ticker">A → Z</option>
                    </select>
                    <button onClick={() => analyseTickers(items.map(a => a.ticker))} disabled={analysingCount > 0 || items.length === 0} style={{ ...btn('#7c3aed'), marginLeft:'auto' }}>
                        {analysingCount > 0 ? `⏳ Analysing ${analysingCount}…` : `🔄 Analyse all (${items.length})`}
                    </button>
                </div>

                <div style={{ padding:'14px 20px', maxHeight:'72vh', overflowY:'auto' }}>
                    {(error || localError) && <div style={{ padding:'10px 12px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'12px', borderRadius:'8px', marginBottom:'10px' }}>⚠️ {localError || error}</div>}
                    {loading && items.length === 0 && <div style={{ padding:'30px', textAlign:'center', color:'#94a3b8' }}>⏳ Loading…</div>}
                    {!loading && items.length === 0 && (
                        <div style={{ padding:'36px 10px', textAlign:'center', color:'#94a3b8', fontSize:'13px', lineHeight:1.6 }}>
                            Nothing here yet. Add a ticker above, or hit <b>☆ Vault</b> on any chart or scanner result.
                        </div>
                    )}
                    {items.length > 0 && shown.length === 0 && <div style={{ padding:'24px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>No matches.</div>}

                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                        {shown.map(a => {
                            const an = a.analysis;
                            const sg = an ? (SIG[an.signal] || SIG.WATCH) : null;
                            const dirColor = an ? (an.direction === 'BULLISH' ? '#10b981' : an.direction === 'BEARISH' ? '#ef4444' : '#94a3b8') : '#94a3b8';
                            const since = sinceAdded(a);
                            const busy = !!analysing[a.ticker];
                            const isEditing = editing && editing.ticker === a.ticker;
                            return (
                                <div key={a.ticker} style={{ border:'1px solid #e2e8f0', borderLeft:`4px solid ${an ? dirColor : '#e2e8f0'}`, borderRadius:'10px', padding:'10px 12px' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                                        <span style={{ fontSize:'15px', fontWeight:'800', color:'#1a1a1a' }}>{a.ticker}</span>
                                        <span style={{ fontSize:'11px', color:'#64748b' }}>{[a.name, a.sector].filter(Boolean).join(' · ')}</span>
                                        {sg && <span style={{ padding:'2px 9px', borderRadius:'10px', fontSize:'10px', fontWeight:'800', backgroundColor:`${sg[2]}18`, color:sg[2] }}>{sg[0]} {sg[1]}</span>}
                                        {an && <span style={{ padding:'2px 9px', borderRadius:'10px', fontSize:'10px', fontWeight:'800', backgroundColor:`${dirColor}18`, color:dirColor }}>{an.direction}</span>}
                                        {an && an.score != null && <span style={{ fontSize:'11px', fontWeight:'800', color:'#475569' }}>score {Math.round(an.score)}</span>}
                                        {failed[a.ticker] && <span style={{ fontSize:'10px', fontWeight:'700', color:'#b45309' }}>⚠️ no data (too little history?)</span>}
                                        <span style={{ marginLeft:'auto', fontSize:'12px', fontWeight:'800', color:'#1a1a1a' }}>{an && an.currentPrice != null ? `$${an.currentPrice}` : ''}</span>
                                    </div>

                                    <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'5px', fontSize:'11px', color:'#64748b' }}>
                                        {an ? (
                                            <>
                                                <span>ADX <b>{an.adxNow ?? '—'}</b></span>
                                                <span>ROC20 <b>{an.roc20 != null ? `${an.roc20}%` : '—'}</b></span>
                                                <span>Vol <b>{an.volRatio != null ? `${an.volRatio}×` : '—'}</b></span>
                                                <span>From 52W high <b>{an.pctFromHigh != null ? `${an.pctFromHigh}%` : '—'}</b></span>
                                            </>
                                        ) : <span>Not analysed yet</span>}
                                        {since != null && (
                                            <span style={{ fontWeight:'800', color: since >= 0 ? '#10b981' : '#ef4444' }}>
                                                since added {since >= 0 ? '+' : ''}{since.toFixed(2)}%
                                                <span style={{ fontWeight:'500', color:'#94a3b8' }}> (added ${a.addedPrice}{a.addedDirection ? ` as ${a.addedDirection}` : ''})</span>
                                            </span>
                                        )}
                                        <span style={{ color:'#94a3b8' }}>{a.lastAnalysedAt ? `analysed ${snowTimeAgo(a.lastAnalysedAt)}` : ''}</span>
                                    </div>

                                    {isEditing ? (
                                        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px' }}>
                                            <input value={editing.note} onChange={e => setEditing({ ...editing, note: e.target.value })} placeholder="Note" style={{ ...inp, flex:'1 1 200px' }} />
                                            <input value={editing.tags} onChange={e => setEditing({ ...editing, tags: e.target.value })} placeholder="tags, comma, separated" style={{ ...inp, width:'170px' }} />
                                            <button onClick={saveEdit} style={btn('#10b981')}>Save</button>
                                            <button onClick={() => setEditing(null)} style={btn('#64748b')}>Cancel</button>
                                        </div>
                                    ) : (
                                        (a.note || (a.tags || []).length > 0) && (
                                            <div style={{ marginTop:'7px', display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
                                                {a.note && <span style={{ fontSize:'12px', color:'#334155', lineHeight:1.5 }}>📝 {a.note}</span>}
                                                {(a.tags || []).map(t => <span key={t} style={{ fontSize:'10px', fontWeight:'700', padding:'1px 8px', borderRadius:'10px', backgroundColor:'#fef3c7', color:'#92400e' }}>{t}</span>)}
                                            </div>
                                        )
                                    )}

                                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'9px' }}>
                                        <button onClick={() => analyseTickers([a.ticker])} disabled={busy} style={btn('#7c3aed')}>{busy ? '⏳ Analysing…' : '🔄 Analyse'}</button>
                                        <button onClick={() => toggleChart(a)} style={btn('#2563eb')}>{chartTicker === a.ticker ? '▲ Hide chart' : '📊 Chart / Trade'}</button>
                                        {onSelectTicker && <button onClick={() => { onSelectTicker(a.ticker); onClose(); }} style={btn('#0891b2')}>→ Screener</button>}
                                        <button onClick={() => setEditing({ ticker: a.ticker, note: a.note || '', tags: (a.tags || []).join(', ') })} style={btn('#64748b')}>✏️ Note / tags</button>
                                        <button onClick={() => removeAsset(a)} style={{ ...btn('#ef4444'), marginLeft:'auto' }}>🗑 Remove</button>
                                    </div>

                                    {chartTicker === a.ticker && (
                                        <ScannerChart ticker={a.ticker} interval={chartInterval} onIntervalChange={setChartInterval} hideClose scannerMeta={an || null} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function VaultLauncher({ onSelectTicker, style = {} }) {
    const { items } = useVaultInterest();
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)} title="Assets you've marked as interesting, analysable even when the scanner doesn't flag them"
                style={{ padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap',
                         border:'1px solid rgba(245,158,11,0.5)', backgroundColor:'#f59e0b', color:'#fff', ...style }}>
                ⭐ Vault ({items.length})
            </button>
            <VaultInterestModal isOpen={open} onClose={() => setOpen(false)} onSelectTicker={onSelectTicker} />
        </>
    );
}

function ScannerChart({ ticker, interval, onIntervalChange, onClose, mountDelay = 0, hideClose = false, scannerMeta = null, height = 300, renderOverlay = null, extraLines = null, extraMarkers = null, focusPositionId = null, analysisAsOf = null }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';

    const containerRef     = React.useRef(null);
    const chartRef         = React.useRef(null);
    const seriesRef        = React.useRef(null);
    const emaRefs          = React.useRef({ e20: null, e50: null, e200: null });
    const firstLoadRef     = React.useRef(true);
    const refreshingRef    = React.useRef(false);
    const positionLinesRef = React.useRef({});
    const draftLinesRef    = React.useRef({});
    const positionsRef     = React.useRef([]);

    const [chartLoading, setChartLoading] = React.useState(true);
    const [chartError,   setChartError]   = React.useState(null);
    const [chartReady,   setChartReady]   = React.useState(!!window.LightweightCharts);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [metaExpanded, setMetaExpanded] = React.useState(false);
    const [isMobile,     setIsMobile]     = React.useState(typeof window !== 'undefined' && window.innerWidth < 640);

    const [showExtended,  setShowExtended]  = React.useState(false);
    const [refreshTick,   setRefreshTick]   = React.useState(0);
    const [refreshing,    setRefreshing]    = React.useState(false);
    const [refreshError,  setRefreshError]  = React.useState(null);
    const [autoRefresh,   setAutoRefresh]   = React.useState(false);
    const [autoSecs,      setAutoSecs]      = React.useState(30);
    const [lastRefreshed, setLastRefreshed] = React.useState(null);
    const [lastPrice,     setLastPrice]     = React.useState(null);
    const [marketSession, setMarketSession] = React.useState(null);
    const [autoCloseNotice, setAutoCloseNotice] = React.useState(null);

    const [positions,       setPositions]       = React.useState([]);
    const [showTicket,      setShowTicket]      = React.useState(false);
    const [editingPosition, setEditingPosition] = React.useState(null);

    const [showOverlays, setShowOverlays] = React.useState(true);
    const [showEarningsAI, setShowEarningsAI] = React.useState(false);
    const candlesRef    = React.useRef([]);
    const extraLinesRef = React.useRef([]);

    const [latestSavedAnalysis,   setLatestSavedAnalysis]   = React.useState(null);
    const [savedAnalysisExpanded, setSavedAnalysisExpanded] = React.useState(false);
    const [analysisLoaded, setAnalysisLoaded] = React.useState(false);
    const [sizeInfo, setSizeInfo] = React.useState('');

    const INTERVALS      = ['15m','1h','1D','1W','1M','3M','1Y'];
    const INTRADAY       = ['15m','1h'];
    const isIntraday     = INTRADAY.includes(interval);
    const extendedActive = showExtended && isIntraday;

    const SAVED_AI_VERDICT_COLORS = {
        STRONG_OPPORTUNITY: { color:'#10b981', icon:'🔥' },
        OPPORTUNITY:         { color:'#3b82f6', icon:'📈' },
        NEUTRAL:             { color:'#94a3b8', icon:'➡️' },
        CAUTION:             { color:'#f59e0b', icon:'⚠️' },
        AVOID:               { color:'#ef4444', icon:'⛔' },
    };

    const tbBtn = (active) => ({
        padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
        border: `1px solid ${active ? '#3b82f6' : 'transparent'}`,
        backgroundColor: active ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.07)',
        color: active ? '#93c5fd' : '#64748b', whiteSpace: 'nowrap', transition: 'all 0.15s',
    });

    // ── library, resize, fullscreen lock ──────────────────────────────────────
    React.useEffect(() => {
        if (window.LightweightCharts) { setChartReady(true); return; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
        s.onload = () => setChartReady(true);
        s.onerror = () => setChartError('Failed to load chart library');
        document.head.appendChild(s);
    }, []);

    React.useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    React.useEffect(() => {
        if (!isFullscreen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prevOverflow; window.removeEventListener('keydown', onKey); };
    }, [isFullscreen]);

    // ── data helpers ──────────────────────────────────────────────────────────
    const fetchChartJson = async () => {
        const res  = await fetch(`${BACKEND}/api/snowai_thundervault_ohlcv_chart_stream/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker, interval, indicators: ['ema'], prePost: extendedActive }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load data');
        return json;
    };

    const applyJson = (json) => {
        if (!seriesRef.current) return;
        candlesRef.current = json.candles || [];
        seriesRef.current.setData(json.candles || []);
        if (emaRefs.current.e20)  emaRefs.current.e20.setData(json.ema20   || []);
        if (emaRefs.current.e50)  emaRefs.current.e50.setData(json.ema50   || []);
        if (emaRefs.current.e200) emaRefs.current.e200.setData(json.ema200 || []);
        const last = json.candles && json.candles.length ? json.candles[json.candles.length - 1].close : null;
        if (last != null) setLastPrice(last);
    };

    // ── position + draft lines ────────────────────────────────────────────────
    const clearPositionLines = () => {
        if (!seriesRef.current) return;
        Object.values(positionLinesRef.current).forEach(group => {
            Object.values(group).forEach(pl => { try { seriesRef.current.removePriceLine(pl); } catch (_) {} });
        });
        positionLinesRef.current = {};
    };

    const drawPositionLines = (list) => {
        if (!seriesRef.current) return;
        clearPositionLines();
        (list || []).forEach(pos => {
            if (pos.status && pos.status !== 'OPEN') return;
            const isLong = pos.direction === 'long';
            const lines = {};
            try {
                if (pos.entry_price) lines.entry = seriesRef.current.createPriceLine({
                    price: pos.entry_price, color: '#3b82f6', lineWidth: 2, lineStyle: 0, axisLabelVisible: true,
                    title: `Entry ${isLong ? '(L)' : '(S)'} $${pos.entry_price}`,
                });
                if (pos.sl_price) lines.sl = seriesRef.current.createPriceLine({
                    price: pos.sl_price, color: '#ef4444', lineWidth: 2, lineStyle: 0, axisLabelVisible: true,
                    title: pos.sl_dollars ? `SL $${pos.sl_price} (-$${Math.abs(pos.sl_dollars).toFixed(2)})` : `SL $${pos.sl_price}`,
                });
                if (pos.tp_price) lines.tp = seriesRef.current.createPriceLine({
                    price: pos.tp_price, color: '#10b981', lineWidth: 2, lineStyle: 0, axisLabelVisible: true,
                    title: pos.tp_dollars ? `TP $${pos.tp_price} (+$${Math.abs(pos.tp_dollars).toFixed(2)})` : `TP $${pos.tp_price}`,
                });
            } catch (e) { console.error('[ScannerChart lines]', e); }
            positionLinesRef.current[pos.id] = lines;
        });
    };

    const setDraftLevel = (key, price, color, label) => {
        if (!seriesRef.current) return;
        if (draftLinesRef.current[key]) {
            try { seriesRef.current.removePriceLine(draftLinesRef.current[key]); } catch (_) {}
            delete draftLinesRef.current[key];
        }
        if (price != null && !isNaN(price)) {
            draftLinesRef.current[key] = seriesRef.current.createPriceLine({
                price, color, lineWidth: 2, lineStyle: 2, axisLabelVisible: true, title: label,
            });
        }
    };

    const clearDraftLines = () => {
        Object.keys(draftLinesRef.current).forEach(k => {
            try { seriesRef.current.removePriceLine(draftLinesRef.current[k]); } catch (_) {}
        });
        draftLinesRef.current = {};
    };

    const fetchPositions = async () => {
        if (!ticker) return [];
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_positions/?asset=${ticker}`);
            const json = await res.json();
            const list = (json.positions || []).filter(p => focusPositionId == null || p.id === focusPositionId);
            positionsRef.current = list;
            setPositions(list);
            drawPositionLines(list);
            return list;
        } catch (e) { console.error('[ScannerChart positions]', e); return []; }
    };

    const refreshPositionPrices = async () => {
        if (!positionsRef.current.some(p => p.status === 'OPEN')) return;
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_positions_refresh_prices/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assets: [ticker], includeExtended: extendedActive }),
            });
            const json = await res.json();
            if (!res.ok) return;
            setMarketSession(json.marketSession || null);
            const returned = json.positions || [];
            const justClosed = returned.filter(p => p.status !== 'OPEN' && (focusPositionId == null || p.id === focusPositionId));
            if (justClosed.length) {
                setAutoCloseNotice(justClosed.map(p =>
                    `${p.asset} ${p.direction} auto-closed at ${p.status === 'CLOSED_TP' ? 'TP' : 'SL'} (${p.realized_pnl_dollars >= 0 ? '+' : ''}$${p.realized_pnl_dollars})`
                ).join(' · '));
            }
            const returnedIds = new Set(returned.map(p => p.id));
            const merged = [...positionsRef.current.filter(p => !returnedIds.has(p.id)), ...returned.filter(p => p.status === 'OPEN' && (focusPositionId == null || p.id === focusPositionId))];
            positionsRef.current = merged;
            setPositions(merged);
            drawPositionLines(merged);
        } catch (e) { console.error('[ScannerChart refresh positions]', e); }
    };

    const handlePositionOpened  = () => { clearDraftLines(); fetchPositions(); };
    const handlePositionUpdated = () => { clearDraftLines(); fetchPositions(); };
    const closeTicket           = () => { clearDraftLines(); setShowTicket(false); };
    const closeEditModal        = () => { clearDraftLines(); setEditingPosition(null); };

    const computeLivePnl = (pos) => {
        if (pos.status !== 'OPEN' || pos.current_price == null) return null;
        const isLong = pos.direction === 'long';
        const pnlDollars = isLong ? (pos.current_price - pos.entry_price) * pos.quantity : (pos.entry_price - pos.current_price) * pos.quantity;
        const pnlPercent = (pos.entry_price && pos.quantity) ? (pnlDollars / (pos.entry_price * pos.quantity)) * 100 : null;
        return { pnlDollars, pnlPercent };
    };

    // ── refresh (manual + auto). Auto stops automatically when this chart unmounts ──
    const refreshInPlace = async () => {
        if (refreshingRef.current || !chartRef.current || !seriesRef.current) return;
        refreshingRef.current = true;
        setRefreshing(true); setRefreshError(null);
        try {
            const json = await fetchChartJson();
            if (!chartRef.current || !seriesRef.current) return;
            const logical = chartRef.current.timeScale().getVisibleLogicalRange();
            applyJson(json);
            if (logical && logical.from != null && logical.to != null) {
                chartRef.current.timeScale().setVisibleLogicalRange(logical);
            }
            await refreshPositionPrices();
            setLastRefreshed(new Date());
        } catch (e) { setRefreshError(e.message || 'Refresh failed'); }
        finally { refreshingRef.current = false; setRefreshing(false); }
    };

    React.useEffect(() => { if (refreshTick > 0) refreshInPlace(); }, [refreshTick]);

    React.useEffect(() => {
        if (!autoRefresh) return;
        const id = setInterval(() => setRefreshTick(t => t + 1), Math.max(5, Number(autoSecs) || 30) * 1000);
        return () => clearInterval(id);
    }, [autoRefresh, autoSecs]);

    // ── positions on mount / ticker change ────────────────────────────────────
    React.useEffect(() => {
        let alive = true;
        (async () => {
            const list = await fetchPositions();
            if (alive && list.some(p => p.status === 'OPEN')) refreshPositionPrices();
        })();
        return () => { alive = false; };
    }, [ticker]);

        // ── saved AI analysis for the fullscreen overlay ──────────────────────────
    // analysisAsOf set  -> latest snapshot ON OR BEFORE that date (what you knew when you took the trade)
    // analysisAsOf null -> latest snapshot overall
    React.useEffect(() => {
        if (!isFullscreen || !ticker) return;
        let alive = true;
        setLatestSavedAnalysis(null);
        setAnalysisLoaded(false);
        (async () => {
            try {
                const res  = await fetch(`${BACKEND}/api/snowvault_scanner_snapshot_list/`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(analysisAsOf ? { ticker, endDate: analysisAsOf, limit: 1 } : { ticker, limit: 1 }),
                });
                const json = await res.json();
                if (!alive) return;
                setLatestSavedAnalysis((json.results || [])[0] || null);
            } catch (e) { console.error('[ScannerChart saved analysis]', e); }
            finally { if (alive) setAnalysisLoaded(true); }
        })();
        return () => { alive = false; };
    }, [isFullscreen, ticker, analysisAsOf]);

        // ── chart creation: rebuilt on ticker / interval / fullscreen / pre-post change ──
    React.useEffect(() => {
        if (!chartReady || !containerRef.current || !ticker) return;
        const LC = window.LightweightCharts;

        if (chartRef.current) { try { chartRef.current.remove(); } catch {} }
        chartRef.current = null; seriesRef.current = null;
        emaRefs.current = { e20: null, e50: null, e200: null };
        positionLinesRef.current = {}; draftLinesRef.current = {};

        const container = containerRef.current;
        const host = container.parentElement || container;
        const measure = () => { const r = host.getBoundingClientRect(); return { w: Math.floor(r.width), h: Math.floor(r.height) }; };

        const first = measure();
        const chart = LC.createChart(container, {
            width:  first.w > 0 ? first.w : 600,
            height: first.h > 0 ? first.h : 300,
            layout: { background: { color: '#0f172a' }, textColor: '#94a3b8' },
            grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
            crosshair: { mode: LC.CrosshairMode.Normal },
            rightPriceScale: { borderColor: '#1e293b', scaleMargins: { top: 0.1, bottom: 0.06 } },
            timeScale: { borderColor: '#1e293b', timeVisible: true, secondsVisible: false },
        });
        chartRef.current = chart;
        seriesRef.current = chart.addCandlestickSeries({
            upColor: '#10b981', downColor: '#ef4444', borderUpColor: '#10b981', borderDownColor: '#ef4444',
            wickUpColor: '#10b981', wickDownColor: '#ef4444',
        });
        const lineOpts = (color, title) => ({ color, lineWidth: 1, title, lastValueVisible: false, priceLineVisible: false });
        emaRefs.current = {
            e20:  chart.addLineSeries(lineOpts('#10b981', 'EMA20')),
            e50:  chart.addLineSeries(lineOpts('#3b82f6', 'EMA50')),
            e200: chart.addLineSeries(lineOpts('#ef4444', 'EMA200')),
        };

        // Compare the chart's REAL rendered size with its parent box and fix any mismatch
        const syncSize = () => {
            if (chartRef.current !== chart) return;
            const { w, h } = measure();
            if (w <= 0 || h <= 0) return;
            const el  = container.firstElementChild;
            const cur = el ? el.getBoundingClientRect() : null;
            if (!cur || Math.abs(cur.width - w) > 1 || Math.abs(cur.height - h) > 1) {
                try { chart.resize(w, h, true); } catch (_) {}
            }
            const shown = el ? el.getBoundingClientRect() : cur;
            const label = `chart ${Math.round(shown ? shown.width : 0)}×${Math.round(shown ? shown.height : 0)} · area ${w}×${h}`;
            setSizeInfo(prev => (prev === label ? prev : label));
        };
        syncSize();
        requestAnimationFrame(() => { syncSize(); requestAnimationFrame(syncSize); });
        const ro = new ResizeObserver(syncSize);
        ro.observe(host);
        window.addEventListener('resize', syncSize);
        const watchdog = setInterval(syncSize, 500);

        let cancelled = false;
        const loadData = async () => {
            if (firstLoadRef.current && mountDelay > 0) await new Promise(r => setTimeout(r, mountDelay));
            firstLoadRef.current = false;
            if (cancelled || chartRef.current !== chart) return;
            setChartLoading(true); setChartError(null);
            try {
                const json = await fetchChartJson();
                if (cancelled || chartRef.current !== chart) return;
                applyJson(json);
                chart.timeScale().fitContent();
                drawPositionLines(positionsRef.current);
                setLastRefreshed(new Date());
                refreshPositionPrices();
            } catch (e) {
                if (!cancelled) setChartError(e.message);
            } finally {
                if (!cancelled) setChartLoading(false);
            }
        };
        loadData();

        return () => {
            cancelled = true;
            clearInterval(watchdog);
            window.removeEventListener('resize', syncSize);
            ro.disconnect();
            try { chart.remove(); } catch {}
            if (chartRef.current === chart) { chartRef.current = null; seriesRef.current = null; }
        };
    }, [chartReady, ticker, interval, isFullscreen, showExtended]);

        // Extra levels / markers supplied by a parent (e.g. the Positions chart modal)
    const extraKey = JSON.stringify([extraLines, extraMarkers]);
    React.useEffect(() => {
        if (chartLoading || !seriesRef.current) return;

        extraLinesRef.current.forEach(pl => { try { seriesRef.current.removePriceLine(pl); } catch (_) {} });
        extraLinesRef.current = [];
        (extraLines || []).forEach(l => {
            try {
                extraLinesRef.current.push(seriesRef.current.createPriceLine({
                    price: l.price, color: l.color, lineWidth: l.lineWidth || 2, lineStyle: l.lineStyle ?? 0,
                    axisLabelVisible: true, title: l.title,
                }));
            } catch (e) { console.error('[ScannerChart extra lines]', e); }
        });

        // Snap each event time to the latest loaded candle at or before it.
        // Events older than the loaded range are skipped, not faked.
        const candles = candlesRef.current;
        const snap = (ms) => {
            if (!candles.length || ms == null || isNaN(ms)) return null;
            const sec = ms / 1000;
            const numeric = typeof candles[0].time === 'number';
            let best = null;
            for (const k of candles) {
                const t = numeric ? k.time : Date.parse(`${k.time}T00:00:00Z`) / 1000;
                if (t <= sec) best = k.time; else break;
            }
            return best;
        };
        const markers = (extraMarkers || [])
            .map(m => ({ time: snap(m.ms), position: m.position, color: m.color, shape: m.shape, text: m.text, size: 2 }))
            .filter(m => m.time != null)
            .sort((a, b) => (a.time > b.time ? 1 : a.time < b.time ? -1 : 0));
        try { seriesRef.current.setMarkers(markers); } catch (e) { console.error('[ScannerChart markers]', e); }
    }, [chartLoading, extraKey]);

        // ── what's true right now, recorded with each trade (feeds the By-tag stats) ──
    const buildContextPreview = () => {
        const earn = SnowEarningsAIStore.get(ticker);
        const stab = scannerMeta && scannerMeta.stability && scannerMeta.stability.combined ? scannerMeta.stability.combined.stabilityScore : null;
        return {
            signal:          scannerMeta ? (scannerMeta.signal || null) : null,
            scanDirection:   scannerMeta ? (scannerMeta.direction || null) : null,
            score:           scannerMeta && scannerMeta.score != null ? Math.round(scannerMeta.score) : null,
            aiVerdict:       (scannerMeta && scannerMeta.aiVerdict) || null,
            stability:       stab,
            earningsBias:    earn ? earn.bias : null,
            earningsVerdict: earn ? earn.verdict : null,
            lens:            interval,
            extendedHours:   extendedActive,
        };
    };
    const getEntryContext = async () => {
        const ctx = buildContextPreview();
        if (!ctx.aiVerdict) {
            // Fall back to your latest saved snapshot, but only if it's recent enough to describe "now"
            try {
                const res  = await fetch(`${BACKEND}/api/snowvault_scanner_snapshot_list/`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticker, limit: 1 }),
                });
                const json = await res.json();
                const row  = (json.results || [])[0];
                if (row && row.aiVerdict && (Date.now() - Date.parse(row.date)) / 86400000 <= 7) {
                    ctx.aiVerdict = row.aiVerdict; ctx.aiVerdictDate = row.date;
                }
            } catch (_) {}
        }
        return ctx;
    };

    // ── render ────────────────────────────────────────────────────────────────
        // The panel is hidden while the trade ticket / edit modal is open, then comes back
    const earningsPanelVisible = showEarningsAI && !showTicket && !editingPosition;
    const chartContent = (
        <div data-snow-skip="true" style={{
            backgroundColor: '#0f172a',
            borderRadius: isFullscreen ? '0px' : '12px',
            overflow: 'hidden',
            border: isFullscreen ? 'none' : '1px solid #1e293b',
            marginTop: isFullscreen ? 0 : '10px',
            display: 'flex', flexDirection: isMobile ? 'column' : 'row',
            ...(isFullscreen ? { position: 'fixed', inset: 0, zIndex: 999999 } : {}),
        }}>
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e293b', display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap', backgroundColor:'#0a1628', flexShrink:0 }}>
                <span style={{ fontSize:'13px', fontWeight:'800', color:'#fff', flex:1, minWidth:'70px' }}>📊 {ticker}</span>

                {INTERVALS.map(iv => (
                    <button key={iv} onClick={() => onIntervalChange && onIntervalChange(iv)} style={{
                        padding:'3px 9px', borderRadius:'5px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none',
                        backgroundColor: interval === iv ? '#3b82f6' : 'rgba(255,255,255,0.07)',
                        color: interval === iv ? '#fff' : '#64748b', transition:'all 0.15s',
                    }}>{iv}</button>
                ))}

                <button
                    onClick={() => isIntraday && setShowExtended(s => !s)}
                    disabled={!isIntraday}
                    title={isIntraday ? 'Include pre-market & after-hours bars (positions re-price to match)' : 'Pre/post data only exists on intraday intervals (15m, 1h)'}
                    style={{ ...tbBtn(extendedActive), opacity: isIntraday ? 1 : 0.4, cursor: isIntraday ? 'pointer' : 'not-allowed' }}
                >🌅 Pre/Post</button>

                <button
                    onClick={() => { if (chartRef.current) { chartRef.current.priceScale('right').applyOptions({ autoScale: true }); chartRef.current.timeScale().fitContent(); } }}
                    title="Reset zoom: re-fit price and time to the data"
                    style={tbBtn(false)}
                >⤢ Fit</button>

                <button onClick={() => setRefreshTick(t => t + 1)} disabled={refreshing} title="Refresh chart + position P&L" style={tbBtn(false)}>
                    <span style={{ display:'inline-block', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>🔄</span>
                </button>

                <button onClick={() => setAutoRefresh(a => !a)} title="Auto-refresh — stops as soon as you close this chart" style={tbBtn(autoRefresh)}>
                    {autoRefresh ? '⏱ Auto ON' : '⏱ Auto'}
                </button>
                {autoRefresh && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px' }}>
                        <input type="number" min="5" value={autoSecs} onChange={e => setAutoSecs(e.target.value)}
                            style={{ width:'46px', padding:'2px 5px', borderRadius:'5px', border:'1px solid #1e3a5f', backgroundColor:'#0f172a', color:'#93c5fd', fontSize:'11px' }} />
                        <span style={{ fontSize:'10px', color:'#64748b' }}>sec</span>
                    </span>
                )}

                <a href={'https://www.tradingview.com/chart/?symbol=' + ticker} target="_blank" rel="noopener noreferrer" style={{
                    padding:'3px 9px', borderRadius:'5px', fontSize:'11px', fontWeight:'700', textDecoration:'none',
                    backgroundColor:'rgba(41,98,255,0.15)', color:'#2962ff', border:'1px solid rgba(41,98,255,0.3)', whiteSpace:'nowrap',
                }}>TV ↗</a>

                <button onClick={() => setIsFullscreen(f => !f)} title={isFullscreen ? 'Exit full view (Esc)' : 'Full view'} style={tbBtn(false)}>
                    {isFullscreen ? '⛶ Exit' : '⛶'}
                </button>

                <button onClick={() => setShowOverlays(o => !o)} title={showOverlays ? 'Hide the info cards on the chart' : 'Show the info cards'} style={tbBtn(!showOverlays)}>
                    {showOverlays ? '🗂 Hide info' : '🗂 Show info'}
                </button>
                <VaultStarButton ticker={ticker} source="chart"
                    snapshot={{ name: scannerMeta ? scannerMeta.name : undefined, sector: scannerMeta ? scannerMeta.sector : undefined,
                                price: (scannerMeta && scannerMeta.currentPrice != null) ? scannerMeta.currentPrice : lastPrice,
                                signal: scannerMeta ? scannerMeta.signal : undefined, direction: scannerMeta ? scannerMeta.direction : undefined,
                                score: scannerMeta ? scannerMeta.score : undefined }} />
                <button onClick={() => setShowEarningsAI(s => !s)} title="Show / hide the earnings AI analysis for this asset" style={tbBtn(showEarningsAI)}>📈 Earnings AI</button>
                <button onClick={() => setShowTicket(true)} title="Open paper position" style={tbBtn(true)}>📝 Trade</button>


                {!hideClose && (
                    <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', borderRadius:'5px', padding:'3px 10px', color:'#64748b', fontSize:'16px', cursor:'pointer', lineHeight:1 }}>×</button>
                )}
            </div>

            {/* Chart area */}
            <div style={{ position:'relative', ...(isFullscreen ? { flex:1, minHeight: isMobile ? '180px' : '320px' } : { height: `${height}px` }) }}>
                {showOverlays && scannerMeta && (
                    <div onClick={() => setMetaExpanded(e => !e)} style={{
                        position:'absolute', top:'8px', left:'8px', zIndex:3, backgroundColor:'rgba(10,22,40,0.92)', borderRadius:'10px',
                        border:'1px solid rgba(255,255,255,0.1)', padding: isMobile ? '6px 8px' : '8px 12px', cursor:'pointer',
                        maxWidth: isMobile ? '150px' : '220px', maxHeight:'46%', overflowY:'auto', backdropFilter:'blur(4px)',
                    }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                            <span style={{ fontSize: isMobile ? '10px':'11px', fontWeight:'800', color: scannerMeta.direction === 'BULLISH' ? '#10b981' : scannerMeta.direction === 'BEARISH' ? '#ef4444' : '#94a3b8' }}>
                                {scannerMeta.direction === 'BULLISH' ? '▲' : scannerMeta.direction === 'BEARISH' ? '▼' : '→'} {scannerMeta.signal ? scannerMeta.signal.replace(/_/g,' ') : scannerMeta.direction}
                            </span>
                            <span style={{ fontSize:'9px', color:'#64748b' }}>{metaExpanded ? '▾' : '▸'}</span>
                        </div>
                        {scannerMeta.score != null && (
                            <div style={{ fontSize: isMobile ? '9px':'10px', color:'#94a3b8', marginTop:'2px' }}>
                                Score <strong style={{ color:'#fff' }}>{Math.round(scannerMeta.score)}</strong>
                                {scannerMeta.stability && (
                                    <> · 🛡️ <strong style={{ color: stabilityLabel(scannerMeta.stability.combined.winRate).color }}>{scannerMeta.stability.combined.stabilityScore}%</strong></>
                                )}
                            </div>
                        )}
                        {metaExpanded && (
                            <div style={{ marginTop:'6px', paddingTop:'6px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', gap:'3px' }}>
                                {[
                                    ['ADX', scannerMeta.adxNow],
                                    ['ROC 20d', scannerMeta.roc20 != null ? `${scannerMeta.roc20}%` : null],
                                    ['Vol Ratio', scannerMeta.volRatio != null ? `${scannerMeta.volRatio}×` : null],
                                    ['From 52W High', scannerMeta.pctFromHigh != null ? `${scannerMeta.pctFromHigh}%` : null],
                                    ['Price', scannerMeta.currentPrice != null ? `$${scannerMeta.currentPrice}` : null],
                                ].filter(([, v]) => v != null).map(([label, val]) => (
                                    <div key={label} style={{ display:'flex', justifyContent:'space-between', gap:'10px', fontSize: isMobile ? '9px':'10px' }}>
                                        <span style={{ color:'#64748b' }}>{label}</span>
                                        <span style={{ color:'#fff', fontWeight:'700' }}>{val}</span>
                                    </div>
                                ))}
                                {scannerMeta.stability && (
                                    <div style={{ display:'flex', gap:'4px', marginTop:'4px', flexWrap:'wrap' }}>
                                        {Object.entries(scannerMeta.stability.byHorizon).map(([h, cell]) => (
                                            <span key={h} style={{ fontSize:'9px', padding:'1px 6px', borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.06)', color: stabilityLabel(cell?.winRate).color, fontWeight:'700' }}>
                                                {h}D {cell?.stabilityScore != null ? `${cell.stabilityScore}%` : '—'}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            {showOverlays && renderOverlay && renderOverlay({ positions, lastPrice, extendedActive, marketSession })}
                                {showOverlays && isFullscreen && analysisAsOf && analysisLoaded && !latestSavedAnalysis && (
                    <div style={{
                        position:'absolute', bottom:'34px', left:'8px', zIndex:3, backgroundColor:'rgba(10,22,40,0.92)',
                        borderRadius:'10px', border:'1px solid rgba(148,163,184,0.3)', padding: isMobile ? '6px 8px' : '8px 12px',
                        maxWidth: isMobile ? '160px' : '240px', backdropFilter:'blur(4px)',
                    }}>
                        <div style={{ fontSize:'9px', fontWeight:'700', color:'#64748b', letterSpacing:'0.06em', marginBottom:'3px' }}>📅 SAVED ANALYSIS</div>
                        <div style={{ fontSize:'10px', color:'#94a3b8', lineHeight:1.5 }}>None saved on or before {analysisAsOf} for {ticker}.</div>
                    </div>
                )}
                {showOverlays && isFullscreen && latestSavedAnalysis && (() => {
                    const av = SAVED_AI_VERDICT_COLORS[latestSavedAnalysis.aiVerdict] || SAVED_AI_VERDICT_COLORS.NEUTRAL;
                    return (
                        <div data-snow-readable="true" onClick={() => setSavedAnalysisExpanded(e => !e)} style={{
                            position:'absolute', bottom:'34px', left:'8px', zIndex:3, backgroundColor:'rgba(10,22,40,0.92)', borderRadius:'10px',
                            maxHeight: isMobile ? '34%' : '40%', overflowY:'auto', border:`1px solid ${av.color}50`, padding: isMobile ? '6px 8px' : '8px 12px', cursor:'pointer',
                            maxWidth: isMobile ? '160px' : '240px', backdropFilter:'blur(4px)',
                        }}>
                            <div style={{ fontSize:'9px', fontWeight:'700', color:'#64748b', letterSpacing:'0.06em', marginBottom:'3px' }}>{analysisAsOf ? (latestSavedAnalysis.date === analysisAsOf ? '📅 SAVED ANALYSIS · TRADE DAY' : '📅 SAVED ANALYSIS · LATEST BEFORE TRADE') : '📅 LAST SAVED ANALYSIS'}</div>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                                <span style={{ fontSize: isMobile ? '10px':'11px', fontWeight:'800', color: av.color }}>{av.icon} {latestSavedAnalysis.aiVerdict?.replace('_',' ') || 'No AI data'}</span>
                                <span style={{ fontSize:'9px', color:'#64748b' }}>{savedAnalysisExpanded ? '▾' : '▸'}</span>
                                <ReadAloudButton tone="dark" label="Saved analysis" beforeRead={() => setSavedAnalysisExpanded(true)} />
                            </div>
                            <div style={{ fontSize:'9px', color:'#94a3b8', marginTop:'2px' }}>{latestSavedAnalysis.date}</div>
                            {savedAnalysisExpanded && (
                                <div style={{ marginTop:'6px', paddingTop:'6px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                                    {latestSavedAnalysis.aiSynthesis?.synthesizedThesis && (
                                        <div style={{ fontSize:'10px', color:'#e2e8f0', lineHeight:1.5 }}>{latestSavedAnalysis.aiSynthesis.synthesizedThesis}</div>
                                    )}
                                    {!latestSavedAnalysis.aiSynthesis && latestSavedAnalysis.aiRuns?.length > 0 && (
                                        <div style={{ fontSize:'10px', color:'#e2e8f0', lineHeight:1.5 }}>{latestSavedAnalysis.aiRuns[0].thesis}</div>
                                    )}
                                    <div style={{ fontSize:'9px', color:'#64748b', marginTop:'4px' }}>Score {latestSavedAnalysis.score != null ? Math.round(latestSavedAnalysis.score) : '—'} · {latestSavedAnalysis.signal?.replace(/_/g,' ')}</div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {(chartLoading || !chartReady) && (
                    <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#0f172a', gap:'8px' }}>
                        <div style={{ fontSize:'22px', display:'inline-block', animation:'spin 1s linear infinite' }}>⏳</div>
                        <span style={{ fontSize:'12px', color:'#475569' }}>Loading {ticker}...</span>
                    </div>
                )}
                {chartError && !chartLoading && (
                    <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#0f172a', gap:'8px' }}>
                        <span style={{ fontSize:'20px' }}>⚠️</span>
                        <span style={{ fontSize:'12px', color:'#ef4444', textAlign:'center', padding:'0 20px' }}>{chartError}</span>
                    </div>
                )}
                <div ref={containerRef} style={{ position:'absolute', inset:0 }} />
            </div>

            {/* Legend / status */}
            <div style={{ padding:'7px 14px', backgroundColor:'#0a1628', borderTop:'1px solid #1e293b', display:'flex', gap:'16px', flexWrap:'wrap', alignItems:'center', flexShrink:0 }}>
                {[{ color:'#10b981', label:'EMA20' }, { color:'#3b82f6', label:'EMA50' }, { color:'#ef4444', label:'EMA200' }].map(item => (
                    <span key={item.label} style={{ fontSize:'10px', fontWeight:'700', color:item.color, display:'flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ width:'16px', height:'2px', backgroundColor:item.color, display:'inline-block', borderRadius:'1px' }} />{item.label}
                    </span>
                ))}
                <span style={{ marginLeft:'auto', fontSize:'10px', color:'#475569' }}>
                    Candles · EMAs · {interval}{extendedActive ? ' · +Pre/Post' : ''}
                    {lastRefreshed ? ` · ${lastRefreshed.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' })}` : ''}
                </span>
                {sizeInfo && <span style={{ fontSize:'9px', color:'#334155' }}>{sizeInfo}</span>}
                {refreshError && <span style={{ fontSize:'10px', color:'#ef4444' }}>⚠️ {refreshError}</span>}
            </div>

            {/* Open positions */}
            {(positions.length > 0 || autoCloseNotice) && (
                <div style={{ padding:'8px 14px', backgroundColor:'#0a1628', borderTop:'1px solid #1e293b', display:'flex', flexDirection:'column', gap:'6px', flexShrink:0, maxHeight: isFullscreen ? '26vh' : 'none', overflowY:'auto' }}>
                    {autoCloseNotice && (
                        <div style={{ fontSize:'11px', color:'#93c5fd', display:'flex', gap:'8px', alignItems:'center' }}>
                            <span>🔔 {autoCloseNotice}</span>
                            <button onClick={() => setAutoCloseNotice(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'14px' }}>×</button>
                        </div>
                    )}
                    {positions.length > 0 && (
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                            <span style={{ fontSize:'10px', fontWeight:'700', color:'#93c5fd', letterSpacing:'0.07em' }}>📌 OPEN POSITIONS</span>
                            {marketSession && (
                                <span style={{ fontSize:'9px', color:'#64748b' }}>
                                    {marketSession === 'regular' ? '● NYC open — TP/SL auto-close live' : '○ NYC closed — TP/SL auto-close paused'}
                                </span>
                            )}
                        </div>
                    )}
                    {positions.map(pos => {
                        const live = computeLivePnl(pos);
                        return (
                            <div key={pos.id} style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', fontSize:'11px', color:'#cbd5e1' }}>
                                <span style={{ fontWeight:'800', color: pos.direction === 'long' ? '#10b981' : '#ef4444' }}>{pos.direction === 'long' ? '▲' : '▼'} {pos.quantity}sh</span>
                                <span>@ ${pos.entry_price}</span>
                                {pos.sl_price && <span style={{ color:'#ef4444' }}>SL ${pos.sl_price}</span>}
                                {pos.tp_price && <span style={{ color:'#10b981' }}>TP ${pos.tp_price}</span>}
                                {live && (
                                    <span style={{ fontWeight:'800', color: live.pnlDollars >= 0 ? '#10b981' : '#ef4444' }}>
                                        <span style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#3b82f6', marginRight:'4px', animation:'pulse 2s ease-in-out infinite' }} />
                                        {live.pnlDollars >= 0 ? '+' : ''}${live.pnlDollars.toFixed(2)} ({live.pnlPercent >= 0 ? '+' : ''}{live.pnlPercent.toFixed(2)}%)
                                        {extendedActive && <span style={{ fontSize:'9px', color:'#93c5fd', marginLeft:'4px' }}>EXT</span>}
                                    </span>
                                )}
                                <button onClick={() => setEditingPosition(pos)} style={{ marginLeft:'auto', fontSize:'10px', padding:'2px 8px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.15)', backgroundColor:'rgba(255,255,255,0.06)', color:'#94a3b8', cursor:'pointer' }}>Edit</button>
                                <button onClick={async () => {
                                    try {
                                        await fetch(`${BACKEND}/api/snowvault_positions/${pos.id}/close/`, {
                                            method:'POST', headers:{'Content-Type':'application/json'},
                                            body: JSON.stringify({ closePrice: pos.current_price || pos.entry_price }),
                                        });
                                        fetchPositions();
                                    } catch (e) { console.error(e); }
                                }} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'6px', border:'1px solid rgba(239,68,68,0.3)', backgroundColor:'rgba(239,68,68,0.1)', color:'#ef4444', cursor:'pointer' }}>Close</button>
                            </div>
                        );
                    })}
                </div>
            )}

            <PositionTicket
                isOpen={showTicket} onClose={closeTicket} ticker={ticker}
                currentPrice={lastPrice ?? scannerMeta?.currentPrice ?? null} source="trend_scanner"
                getEntryContext={getEntryContext} contextPreview={buildContextPreview()}
                onOpened={handlePositionOpened}
                onDraftTp={(price) => setDraftLevel('tp', price, '#10b981', 'TP (draft)')}
                onDraftSl={(price) => setDraftLevel('sl', price, '#ef4444', 'SL (draft)')}
            />
            <EditPositionModal
                isOpen={!!editingPosition} onClose={closeEditModal} position={editingPosition}
                onUpdated={handlePositionUpdated}
                onDraftTp={(price) => setDraftLevel('tp', price, '#10b981', 'TP (draft)')}
                onDraftSl={(price) => setDraftLevel('sl', price, '#ef4444', 'SL (draft)')}
            />

            <style>{`
                @keyframes spin  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
            `}</style>
            </div>

            {earningsPanelVisible && (
                <div style={{
                    flexShrink: 0, overflowY: 'auto', backgroundColor: '#0a1628',
                    ...(isMobile
                        ? { width: '100%', borderTop: '1px solid #1e293b', maxHeight: isFullscreen ? '40%' : '360px', height: isFullscreen ? '40%' : 'auto' }
                        : { width: isFullscreen ? 'min(400px, 40vw)' : 'min(340px, 42%)', borderLeft: '1px solid #1e293b' }),
                }}>
                    <EarningsAISidePanel ticker={ticker} onClose={() => setShowEarningsAI(false)} />
                </div>
            )}
        </div>
    );

    return isFullscreen ? ReactDOM.createPortal(chartContent, document.body) : chartContent;
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
    const [scanMode, setScanMode] = React.useState('pullback'); // 'pullback' | 'breakout'
    // Pullbacks are ranked by pullback quality, so the client must not re-sort them by the breakout score
    React.useEffect(() => { setSortBy(scanMode === 'pullback' ? 'quality' : 'score'); }, [scanMode]);


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

    const TS_AI_CACHE_KEY = 'snowvault_trend_scanner_ai_cache';
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(TS_AI_CACHE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const today = new Date().toISOString().slice(0, 10);
                if (parsed.date === today) {
                    if (parsed.aiRuns) setAiRuns(parsed.aiRuns);
                    if (parsed.aiSynthesis) setAiSynthesis(parsed.aiSynthesis);
                }
            }
        } catch (e) { console.error('[TS AI cache load]', e); }
    }, []);
    React.useEffect(() => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem(TS_AI_CACHE_KEY, JSON.stringify({ date: today, aiRuns, aiSynthesis }));
        } catch (e) { console.error('[TS AI cache save]', e); }
    }, [aiRuns, aiSynthesis]);

    const [loadTodayLoading, setLoadTodayLoading] = React.useState(false);
    const [loadTodayStatus, setLoadTodayStatus] = React.useState(null);

    const checkAndLoadTodaySnapshot = async () => {
        setLoadTodayLoading(true);
        setLoadTodayStatus(null);
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const res = await fetch(`${BACKEND}/api/snowvault_scanner_snapshot_list/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDate: todayStr, endDate: todayStr, limit: 1000 }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            const rows = json.results || [];
            if (rows.length === 0) {
                setLoadTodayStatus({ ok: false, msg: 'No snapshot saved for today yet.' });
                return;
            }
            const newRuns = { ...aiRuns };
            const newSynth = { ...aiSynthesis };
            let loadedCount = 0;
            rows.forEach(r => {
                if (r.aiRuns?.length) { newRuns[r.ticker] = r.aiRuns; loadedCount++; }
                if (r.aiSynthesis) newSynth[r.ticker] = r.aiSynthesis;
            });
            setAiRuns(newRuns);
            setAiSynthesis(newSynth);
            setLoadTodayStatus({ ok: true, msg: `Loaded saved AI data for ${loadedCount} ticker${loadedCount !== 1 ? 's' : ''}.` });
        } catch (e) {
            setLoadTodayStatus({ ok: false, msg: e.message });
        } finally {
            setLoadTodayLoading(false);
        }
    };

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

    const activeList = (scanMode === 'pullback' ? results?.pullbackResults : results?.breakoutResults) ?? results?.results ?? [];
    const filtered = (activeList)
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
            if (sortBy === 'quality') return ((b.retrace && b.retrace.quality) || 0) - ((a.retrace && a.retrace.quality) || 0);
            if (sortBy === 'depth')   return ((b.retrace && b.retrace.depthPct) || 0) - ((a.retrace && a.retrace.depthPct) || 0);
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
                            onClick={checkAndLoadTodaySnapshot}
                            disabled={loadTodayLoading}
                            title="Pull today's AI analysis back from the backend — useful after a reload, switching tabs, or a different browser"
                            style={{
                                padding:'5px 12px', borderRadius:'20px',
                                fontSize:'11px', fontWeight:'800', cursor: loadTodayLoading ? 'wait' : 'pointer',
                                border:'1px solid rgba(14,165,233,0.4)',
                                backgroundColor: loadTodayLoading ? 'rgba(14,165,233,0.1)' : '#0ea5e9',
                                color: loadTodayLoading ? '#0ea5e9' : '#fff',
                                whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px',
                            }}
                        >
                            {loadTodayLoading ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>📥</span> Checking...</> : <>📥 Load Today's Saved Data</>}
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

                        <VaultLauncher onSelectTicker={(t) => { onSelectTicker && onSelectTicker(t); onClose(); }} />

                        <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
                            {[['pullback', '📉 Pullbacks', results?.pullbackCount ?? results?.pullbackResults?.length],
                              ['breakout', '🚀 Breakouts', results?.breakoutCount ?? results?.breakoutResults?.length]].map(([k, label, n]) => (
                                <button key={k} onClick={() => setScanMode(k)}
                                    title={k === 'pullback' ? 'Deep pullbacks in an uptrend (or bounces in a downtrend), ranked by pullback quality' : 'The original breakout / momentum list'}
                                    style={{
                                        padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap',
                                        border:`1px solid ${scanMode === k ? '#7c3aed' : '#e2e8f0'}`,
                                        backgroundColor: scanMode === k ? '#7c3aed' : '#fff', color: scanMode === k ? '#fff' : '#64748b',
                                    }}>
                                    {label}{n != null ? ` (${n})` : ''}
                                </button>
                            ))}
                        </div>
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
                                {[['score','Score'],['adx','ADX'],['roc','ROC'],['vol','Vol'],['cap','Cap'],['ext','Ext Move'],['quality','Quality'],['depth','Depth']].map(([k,l]) => (
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
                {loadTodayStatus && (
                    <div style={{
                        padding:'8px 20px', fontSize:'12px',
                        backgroundColor: loadTodayStatus.ok ? '#f0fdf4' : '#fffbeb',
                        borderBottom: `1px solid ${loadTodayStatus.ok ? '#bbf7d0' : '#fde68a'}`,
                        color: loadTodayStatus.ok ? '#065f46' : '#92400e',
                    }}>
                        {loadTodayStatus.ok ? '✓' : 'ℹ️'} {loadTodayStatus.msg}
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

                                                    {r.retrace && (
                                                        <span
                                                            title={`${r.retrace.mode === 'PULLBACK' ? 'Pullback in an uptrend' : 'Bounce in a downtrend'}: ${r.retrace.depthPct}% off the swing ${r.retrace.mode === 'PULLBACK' ? 'high' : 'low'}, gave back ${r.retrace.retracePct}% of a ${r.retrace.legPct}% leg, quality ${r.retrace.quality}/100`}
                                                            style={{
                                                                padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap',
                                                                backgroundColor: r.retrace.mode === 'PULLBACK' ? '#10b98118' : '#ef444418',
                                                                color: r.retrace.mode === 'PULLBACK' ? '#059669' : '#dc2626',
                                                                border: `1px solid ${r.retrace.mode === 'PULLBACK' ? '#10b98150' : '#ef444450'}`,
                                                            }}
                                                        >
                                                            {r.retrace.mode === 'PULLBACK' ? '📉 −' : '📈 +'}{r.retrace.depthPct}% · {r.retrace.retracePct}% of leg{r.retrace.stabilising ? ' ✓' : ''}
                                                        </span>
                                                    )}
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
                                                <div style={{ display:'flex', gap:'6px', justifyContent:'flex-end', alignItems:'center' }}>
                                                    <VaultStarButton ticker={r.ticker} tone="light" source="trend_scanner"
                                                        snapshot={{ name: r.name, sector: r.sector, price: r.currentPrice, signal: r.signal, direction: r.direction, score: r.score }} />
                                                    <ReadAloudButton label={`${r.ticker} analysis`} />
                                                </div>
                                                {/* Why it showed up */}
                                                <div style={{
                                                    padding:'10px 14px', backgroundColor: sc.bg,
                                                    borderRadius:'8px', borderLeft:`3px solid ${sc.color}`,
                                                }}>
                                                    <div style={{ fontSize:'11px', fontWeight:'700', color:sc.color, letterSpacing:'0.07em', marginBottom:'4px' }}>
                     