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


function PositionTicket({ isOpen, onClose, ticker, currentPrice, source = 'manual', onOpened, onDraftTp, onDraftSl }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';
    const [direction, setDirection]   = React.useState('long');
    const [quantity, setQuantity]     = React.useState('10');
    const [entryPrice, setEntryPrice] = React.useState(currentPrice != null ? String(currentPrice) : '');
    const [notes, setNotes]           = React.useState('');
    const [tpPrice, setTpPrice] = React.useState(''); const [tpPercent, setTpPercent] = React.useState(''); const [tpDollars, setTpDollars] = React.useState('');
    const [slPrice, setSlPrice] = React.useState(''); const [slPercent, setSlPercent] = React.useState(''); const [slDollars, setSlDollars] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError]           = React.useState(null);
    const tpAnchor = React.useRef(null);
    const slAnchor = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            setEntryPrice(currentPrice != null ? String(currentPrice) : '');
            setDirection('long'); setQuantity('10'); setNotes('');
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
            const res = await fetch(`${BACKEND}/api/snowvault_positions/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset: ticker, direction, quantity: qty, entryPrice: entry,
                    tpPrice: tpPrice || null, tpPercent: tpPercent || null, tpDollars: tpDollars || null,
                    slPrice: slPrice || null, slPercent: slPercent || null, slDollars: slDollars || null,
                    notes, source,
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
                                                <ReadAloudButton label={`${r.ticker} analysis`} style={{ alignSelf:'flex-end' }} />
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

                                                {/* Inline chart */}
                                                {(chartTicker === r.ticker || showAllCharts) && (
                                                    <ScannerChart
                                                        ticker={r.ticker}
                                                        interval={chartInterval}
                                                        onIntervalChange={(iv) => setChartInterval(iv)}
                                                        onClose={() => setChartTicker(null)}
                                                        mountDelay={showAllCharts ? rowIdx * 400 : 0}
                                                        hideClose={showAllCharts}
                                                        scannerMeta={{ ...r, stability: stabilityData?.[r.ticker] || null }}
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

function GlobalPicksTrendScanModal({ isOpen, onClose, onSelectTicker }) {
    const BACKEND = 'https://backend-production-c0ab.up.railway.app';

    const [loading, setLoading] = React.useState(false);
    const [isBackgroundRunning, setIsBackgroundRunning] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [countryFilter, setCountryFilter] = React.useState('ALL');
    const [dirFilter, setDirFilter] = React.useState('ALL');
    const [collapsedCountries, setCollapsedCountries] = React.useState({});
    const [expandedTicker, setExpandedTicker] = React.useState(null);
    const pollRef = React.useRef(null);

        const [gpChartTicker, setGpChartTicker] = React.useState(null);
    const [gpChartInterval, setGpChartInterval] = React.useState('1D');
    const [gpShowAllCharts, setGpShowAllCharts] = React.useState(false);
    const [gpShowAllChartsByCountry, setGpShowAllChartsByCountry] = React.useState({});
    const toggleCountryCharts = (country) => setGpShowAllChartsByCountry(prev => ({ ...prev, [country]: !prev[country] }));

    

        // -- AI Opportunity Analysis (external AI, copy/paste, same pattern as Trend Scanner) --
    const [aiRuns, setAiRuns] = React.useState({});
    const [aiSynthesis, setAiSynthesis] = React.useState({});
    const [aiPromptScope, setAiPromptScope] = React.useState(null);
    const [showAiPromptModal, setShowAiPromptModal] = React.useState(false);
    const [showAiPasteModal, setShowAiPasteModal] = React.useState(false);
    const [aiPasteText, setAiPasteText] = React.useState('');
    const [aiPasteSource, setAiPasteSource] = React.useState('');
    const [aiPasteError, setAiPasteError] = React.useState(null);
    const [aiCopied, setAiCopied] = React.useState(false);
    const [aiLastOpenedSource, setAiLastOpenedSource] = React.useState('');

    // -- Stability check (reuses shared helpers built for the Trend Scanner) --
    const GP_STABILITY_HORIZONS = [1, 3, 5, 10, 20];
    const [gpStabilityLoading, setGpStabilityLoading] = React.useState(false);
    const [gpStabilityError, setGpStabilityError] = React.useState(null);
    const [gpStabilityRows, setGpStabilityRows] = React.useState([]);
    const [gpStabilityData, setGpStabilityData] = React.useState(null);
    const [perfModalTicker, setPerfModalTicker] = React.useState(null);

    const GP_AI_VERDICT_CONFIG = {
        STRONG_OPPORTUNITY: { color:'#10b981', bg:'#f0fdf4', border:'#bbf7d0', icon:'🔥' },
        OPPORTUNITY:         { color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', icon:'📈' },
        NEUTRAL:             { color:'#94a3b8', bg:'#f8fafc', border:'#e2e8f0', icon:'➡️' },
        CAUTION:             { color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'⚠️' },
        AVOID:               { color:'#ef4444', bg:'#fef2f2', border:'#fecaca', icon:'⛔' },
    };

    const GP_SIG = {
        RANGE_BREAKOUT_BULL: { color:'#10b981', bg:'#f0fdf4', icon:'🚀', label:'Range Breakout ▲' },
        RANGE_BREAKOUT_BEAR: { color:'#ef4444', bg:'#fef2f2', icon:'🔻', label:'Range Breakout ▼' },
        ACCELERATING_BULL:   { color:'#3b82f6', bg:'#eff6ff', icon:'⚡', label:'Accelerating ▲'   },
        ACCELERATING_BEAR:   { color:'#f97316', bg:'#fff7ed', icon:'⚡', label:'Accelerating ▼'   },
        BREAKOUT:            { color:'#8b5cf6', bg:'#faf5ff', icon:'📈', label:'Breakout'          },
        TREND_BUILDING:      { color:'#06b6d4', bg:'#ecfeff', icon:'📊', label:'Trend Building'    },
        WATCH:               { color:'#94a3b8', bg:'#f8fafc', icon:'👁', label:'Watch'             },
    };

        // -- Local (same-browser, same-day) AI data persistence — survives reload/tab-switch
    // but is NOT shared across devices and is separate from Trend Scanner's backend save --
    const GP_AI_CACHE_KEY = 'snowvault_global_picks_ai_cache';
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(GP_AI_CACHE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const today = new Date().toISOString().slice(0, 10);
                if (parsed.date === today) {
                    if (parsed.aiRuns) setAiRuns(parsed.aiRuns);
                    if (parsed.aiSynthesis) setAiSynthesis(parsed.aiSynthesis);
                }
            }
        } catch (e) { console.error('[GP AI cache load]', e); }
    }, []);
    React.useEffect(() => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem(GP_AI_CACHE_KEY, JSON.stringify({ date: today, aiRuns, aiSynthesis }));
        } catch (e) { console.error('[GP AI cache save]', e); }
    }, [aiRuns, aiSynthesis]);
    const run = async (forceRefresh = false) => {
        setLoading(true);
        setError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_global_picks_trend_scan_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ forceRefresh }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setData(json);
            setIsBackgroundRunning(!!json.isRunning);

            if (json.isRunning && !pollRef.current) {
                pollRef.current = setInterval(async () => {
                    try {
                        const pRes  = await fetch(`${BACKEND}/api/snowai_global_picks_trend_scan_vault/`, {
                            method:  'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body:    JSON.stringify({ forceRefresh: false }),
                        });
                        const pJson = await pRes.json();
                        setData(pJson);
                        setIsBackgroundRunning(!!pJson.isRunning);
                        if (!pJson.isRunning) { clearInterval(pollRef.current); pollRef.current = null; }
                    } catch (e) { console.error('[GlobalPicksTrendScan poll]', e); }
                }, 5000);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const forceReset = async () => {
        setLoading(true);
        try {
            const res  = await fetch(`${BACKEND}/api/snowai_global_picks_trend_scan_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ resetLock: true }),
            });
            const json = await res.json();
            setData(json);
            setIsBackgroundRunning(!!json.isRunning);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (isOpen && !data) run(false);
        return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
    }, [isOpen]);

    const toggleCountryCollapse = (country) => setCollapsedCountries(prev => ({ ...prev, [country]: !prev[country] }));

    const countryEntries = React.useMemo(() => {
        if (!data?.countries) return [];
        return Object.entries(data.countries)
            .filter(([country]) => countryFilter === 'ALL' || country === countryFilter)
            .map(([country, cData]) => {
                const tickers = cData.tickers.filter(t => {
                    if (search.trim() && !t.ticker.toUpperCase().includes(search.trim().toUpperCase())) return false;
                    if (dirFilter !== 'ALL' && t.direction !== dirFilter) return false;
                    return true;
                });
                return [country, { ...cData, tickers }];
            })
            .filter(([, cData]) => cData.tickers.length > 0)
            .sort((a, b) => (b[1].summary?.avgScore || 0) - (a[1].summary?.avgScore || 0));
    }, [data, search, dirFilter, countryFilter]);

    const allCountryNames = data?.countries ? Object.keys(data.countries).sort() : [];

    const fmtCap = (v) => {
        if (!v) return '—';
        if (v >= 1e12) return `$${(v/1e12).toFixed(1)}T`;
        if (v >= 1e9)  return `$${(v/1e9).toFixed(0)}B`;
        return `$${(v/1e6).toFixed(0)}M`;
    };

        const buildGpCohortContext = () => {
        if (!data?.countries) return '';
        return Object.entries(data.countries).map(([country, cData]) => {
            const s = cData.summary || {};
            return `- ${cData.flag} ${country}: ${s.bullish} bullish / ${s.bearish} bearish / ${s.neutral} neutral of ${s.total} picks · avg score ${s.avgScore ?? 'n/a'}`;
        }).join('\n');
    };

    const buildGpAIPrompt = (tickerObjs) => {
        const cohortCtx = buildGpCohortContext();
        const lines = tickerObjs.map(t => {
            const catalystsStr = Array.isArray(t.catalysts) && t.catalysts.length ? t.catalysts.join('; ') : 'none listed';
            return `### ${t.ticker} — ${t.name || ''} (${t.flag || ''} ${t.country}, sector: ${t.pickSector || t.sector || 'Unknown'})
Original Pick: ${t.pickRec}${t.conviction != null ? ` · conviction ${t.conviction}/10` : ''}${t.topPick ? ' · ⭐ Top Pick' : ''}
Original Thesis: ${t.thesis || 'none recorded'}
Original Risk Note: ${t.risk || 'none recorded'}
Catalysts Noted: ${catalystsStr}
Analyst Target: ${t.analystTarget || 'N/A'}

Fresh Technical Scan: Signal ${t.signal} · Direction ${t.direction} · Score ${t.score}/100
Price: $${t.currentPrice ?? 'N/A'} · Market Cap: ${t.marketCap ? '$' + (t.marketCap/1e9).toFixed(1) + 'B' : 'N/A'}
ADX: ${t.adxNow ?? 'N/A'} · ROC20: ${t.roc20 ?? 'N/A'}% · Volume Ratio: ${t.volRatio ?? 'N/A'}× · From 52W High: ${t.pctFromHigh ?? 'N/A'}%`;
        }).join('\n\n');

        return `You are a hedge-fund-grade equity research analyst. Below are stocks originally recommended by an AI (with a written thesis) via a Country-Sector Drill feature, now ALSO re-checked with a fresh technical trend scan. Assess how genuinely LUCRATIVE each is right now — weighing whether the fresh technical signal supports or contradicts the original thesis, and whether the move looks country/sector-wide or stock-specific.

Search the web for current country/sector-wide context and recent company-specific news for each ticker below before answering — don't rely on memorized data.

PEER COHORT ACROSS ALL COUNTRIES CURRENTLY TRACKED:
${cohortCtx || 'No cohort data available.'}

STOCK(S) TO ANALYSE:
${lines}

For EACH stock above, respond with ONLY a JSON array (no markdown, no backticks, no preamble), one object per stock, in this exact shape:
[
  {
    "ticker": "<ticker>",
    "opportunityScore": <integer 0-100>,
    "verdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
    "badge": "<max 4 words, punchy, for a small inline UI badge>",
    "cohortRelation": "<1-2 sentences: does the fresh technical signal support or contradict the original AI thesis? Country/sector-wide or stock-specific?>",
    "thesis": "<2-3 sentences: your updated synthesis>",
    "risks": "<1-2 sentences: the main thing that would invalidate this>"
  }
]

Do not include anything outside the JSON array. The response must be parseable by JSON.parse().`;
    };

    const buildGpSynthesisPrompt = (ticker) => {
        const runs = aiRuns[ticker] || [];
        const runLines = runs.map((run, i) => `  Analysis ${i + 1} — source: ${run.source || 'Unknown AI'}
  Verdict: ${run.verdict} · Opportunity Score: ${run.opportunityScore}/100
  Thesis: ${run.thesis}
  Cohort Relation: ${run.cohortRelation || 'N/A'}
  Risks: ${run.risks || 'N/A'}`).join('\n\n');

        return `You are a hedge-fund-grade equity research analyst acting purely as a SYNTHESIS layer — do not do new independent research. ${runs.length} different AI models have each independently analysed the same stock, ${ticker}. Synthesise these ${runs.length} analyses into one final, most defensible verdict — explicitly flag where they agree, where they disagree, and why.

${runLines}

Respond with ONLY a JSON object (no markdown, no backticks, no preamble):
{
  "finalVerdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
  "finalOpportunityScore": <integer 0-100>,
  "agreementLevel": "HIGH" | "MODERATE" | "LOW",
  "consensusSummary": "<2-3 sentences>",
  "disagreements": "<1-2 sentences — empty string if none>",
  "synthesizedThesis": "<3-4 sentences: your final take>"
}

Do not include anything outside the JSON object. The response must be parseable by JSON.parse().`;
    };

    const buildGpBulkSynthesisPrompt = (tickers) => {
        const sections = tickers.map(ticker => {
            const runs = aiRuns[ticker] || [];
            const runLines = runs.map((run, i) => `  Analysis ${i + 1} — source: ${run.source || 'Unknown AI'}
  Verdict: ${run.verdict} · Opportunity Score: ${run.opportunityScore}/100
  Thesis: ${run.thesis}
  Cohort Relation: ${run.cohortRelation || 'N/A'}
  Risks: ${run.risks || 'N/A'}`).join('\n\n');
            return `## ${ticker}\n${runLines}`;
        }).join('\n\n---\n\n');

        return `You are a hedge-fund-grade equity research analyst acting purely as a SYNTHESIS layer — do not do new independent research. For EACH stock below, multiple AI models have each independently analysed it. Synthesise the analyses for EACH stock into one final, most defensible verdict per stock.

${sections}

For EACH stock above, respond with ONLY a JSON array (no markdown, no backticks, no preamble):
[
  {
    "ticker": "<ticker>",
    "finalVerdict": "STRONG_OPPORTUNITY" | "OPPORTUNITY" | "NEUTRAL" | "CAUTION" | "AVOID",
    "finalOpportunityScore": <integer 0-100>,
    "agreementLevel": "HIGH" | "MODERATE" | "LOW",
    "consensusSummary": "<2-3 sentences per stock>",
    "disagreements": "<1-2 sentences per stock — empty string if none>",
    "synthesizedThesis": "<3-4 sentences per stock>"
  }
]

Do not include anything outside the JSON array. The response must be parseable by JSON.parse().`;
    };

    
    const openBulkAIPrompt = () => {
        if (!data?.countries) return;
        const allTickerObjs = Object.entries(data.countries).flatMap(([country, cData]) =>
            cData.tickers.map(t => ({ ...t, country, flag: cData.flag }))
        );
        setAiPromptScope({ mode: 'bulk', tickerObjs: allTickerObjs });
        setShowAiPromptModal(true);
    };
    const openCountryAIPrompt = (country) => {
        const cData = data?.countries?.[country];
        if (!cData?.tickers?.length) return;
        const tickerObjs = cData.tickers.map(t => ({ ...t, country, flag: cData.flag }));
        setAiPromptScope({ mode: 'country', country, tickerObjs });
        setShowAiPromptModal(true);
    };
    const openIndividualAIPrompt = (tObj) => { setAiPromptScope({ mode: 'individual', tickerObjs: [tObj], ticker: tObj.ticker }); setShowAiPromptModal(true); };
    const openSynthesisPrompt = (ticker) => { setAiPromptScope({ mode: 'synthesis', ticker }); setShowAiPromptModal(true); };
    const bulkSynthesisEligibleTickers = data?.countries
        ? [...new Set(Object.values(data.countries).flatMap(c => c.tickers.map(t => t.ticker)))].filter(t => (aiRuns[t] || []).length >= 2)
        : [];
    const openBulkSynthesisPrompt = () => {
        if (bulkSynthesisEligibleTickers.length === 0) return;
        setAiPromptScope({ mode: 'bulkSynthesis', tickers: bulkSynthesisEligibleTickers });
        setShowAiPromptModal(true);
    };

    const handleGpPasteAIResponse = () => {
        setAiPasteError(null);
        if (!aiPasteText.trim()) { setAiPasteError('Paste the JSON response first.'); return; }
        const clean = aiPasteText.replace(/```json/gi, '').replace(/```/g, '').trim();

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
            updated[ticker] = { ...parsed, runCountAtSynthesis: (aiRuns[ticker] || []).length, savedAt: new Date().toLocaleString() };
            setAiSynthesis(updated);
            setShowAiPasteModal(false);
            setAiPasteText('');
            return;
        }

        if (aiPromptScope?.mode === 'bulkSynthesis') {
            let parsed;
            try { parsed = JSON.parse(clean); }
            catch (e) { setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`); return; }
            if (!Array.isArray(parsed)) { setAiPasteError('Expected a JSON array (one synthesis object per stock).'); return; }
            const updated = { ...aiSynthesis };
            let added = 0;
            parsed.forEach(item => {
                const t = String(item?.ticker || '').toUpperCase().trim();
                if (!t || item.finalVerdict == null || item.synthesizedThesis == null) return;
                updated[t] = { ...item, runCountAtSynthesis: (aiRuns[t] || []).length, savedAt: new Date().toLocaleString() };
                added += 1;
            });
            if (added === 0) { setAiPasteError('No valid synthesis entries found.'); return; }
            setAiSynthesis(updated);
            setShowAiPasteModal(false);
            setAiPasteText('');
            return;
        }

        let parsed;
        try { parsed = JSON.parse(clean); }
        catch (e) { setAiPasteError(`Invalid JSON — couldn't parse. Error: ${e.message}`); return; }
        if (!Array.isArray(parsed)) { setAiPasteError('Expected a JSON array (one object per stock).'); return; }
        const source  = aiPasteSource.trim() || aiLastOpenedSource || 'AI';
        const updated = { ...aiRuns };
        let added = 0;
        parsed.forEach(item => {
            const t = String(item?.ticker || '').toUpperCase().trim();
            if (!t || item.verdict == null || item.thesis == null) return;
            if (!updated[t]) updated[t] = [];
            updated[t] = [...updated[t], { ...item, ticker: t, source, savedAt: new Date().toLocaleString() }];
            added += 1;
        });
        if (added === 0) { setAiPasteError('No valid stock entries found.'); return; }
        setAiRuns(updated);
        setShowAiPasteModal(false);
        setAiPasteText('');
        setAiPasteSource('');
    };

    const getGpConsensus = (ticker) => {
        const runs = aiRuns[ticker];
        if (!runs || runs.length === 0) return null;
        const scores = runs.map(r => r.opportunityScore).filter(v => typeof v === 'number');
        const meanScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
        const counts = {};
        runs.forEach(r => { if (r.verdict) counts[r.verdict] = (counts[r.verdict]||0) + 1; });
        const modeVerdict = Object.keys(counts).length ? Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0] : null;
        const agreement = (modeVerdict && runs.length) ? Math.round((counts[modeVerdict]/runs.length) * 100) : null;
        return { meanScore, modeVerdict, agreement, runCount: runs.length };
    };

    const runGpStabilityCheck = async () => {
        if (!data?.countries) return;
        const allTickers = [...new Set(Object.values(data.countries).flatMap(c => c.tickers.map(t => t.ticker)))];
        if (allTickers.length === 0) return;
        setGpStabilityLoading(true);
        setGpStabilityError(null);
        try {
            const res  = await fetch(`${BACKEND}/api/snowvault_global_picks_backtest_vault/`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ symbols: allTickers, limit: 5000, horizons: GP_STABILITY_HORIZONS }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `Server ${res.status}`);
            setGpStabilityRows(json.rows || []);
            setGpStabilityData(computeStabilityByAsset(json.rows || [], GP_STABILITY_HORIZONS, 'symbol'));
        } catch (e) {
            setGpStabilityError(e.message);
        } finally {
            setGpStabilityLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div style={{
            position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:10060,
            display:'flex', alignItems:'flex-start', justifyContent:'center',
            padding:'16px', backdropFilter:'blur(4px)', overflowY:'auto',
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                width:'100%', maxWidth:'920px', borderRadius:'18px', overflow:'hidden',
                backgroundColor:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.25)',
                fontFamily:"'Segoe UI', system-ui, sans-serif", marginTop:'8px', marginBottom:'24px',
            }}>
                <div style={{ padding:'18px 20px 14px', background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #7c3aed 130%)' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                        <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                                <span style={{ fontSize:'20px' }}>🌍</span>
                                <span style={{ fontSize:'16px', fontWeight:'800', color:'#fff' }}>Global Picks Trend Scan</span>
                            </div>
                            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>
                                Same trend-scanner signals (ADX, ROC, breakouts) run across every saved Country-Sector Drill pick — grouped by country
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background:'rgba(255,255,255,0.12)', border:'none', borderRadius:'50%',
                            width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer', flexShrink:0,
                        }}>×</button>
                    </div>

                    <div style={{ display:'flex', gap:'8px', marginTop:'14px', flexWrap:'wrap', alignItems:'center' }}>
                        <button onClick={() => run(true)} disabled={loading || isBackgroundRunning} style={{
                            padding:'8px 20px', borderRadius:'9px',
                            background: (loading || isBackgroundRunning) ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#db2777)',
                            border:'none', color:'#fff', fontWeight:'800', fontSize:'13px',
                            cursor: (loading || isBackgroundRunning) ? 'wait' : 'pointer',
                            display:'flex', alignItems:'center', gap:'7px',
                        }}>
                            {loading ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⚡</span> Loading...</>
                                : isBackgroundRunning ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⚡</span> Scanning...</>
                                : <><span>🔭</span> Run Fresh Scan</>}
                        </button>

                                                <button
                            onClick={openBulkAIPrompt}
                            disabled={!data || data.totalTickers === 0}
                            style={{
                                padding:'8px 16px', borderRadius:'9px',
                                background: (!data || data.totalTickers === 0) ? 'rgba(219,39,119,0.2)' : 'linear-gradient(135deg,#7c3aed,#db2777)',
                                border:'none', color:'#fff', fontWeight:'800', fontSize:'12px',
                                cursor: (!data || data.totalTickers === 0) ? 'not-allowed' : 'pointer',
                                display:'flex', alignItems:'center', gap:'6px',
                            }}
                        >🧠 AI Opportunity Scan</button>

                        <button
                            onClick={openBulkSynthesisPrompt}
                            disabled={bulkSynthesisEligibleTickers.length === 0}
                            title={bulkSynthesisEligibleTickers.length === 0 ? 'Needs 2+ AI runs on at least one ticker' : `Synthesize ${bulkSynthesisEligibleTickers.length} tickers`}
                            style={{
                                padding:'8px 16px', borderRadius:'9px',
                                background: bulkSynthesisEligibleTickers.length === 0 ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border:'none', color: bulkSynthesisEligibleTickers.length === 0 ? 'rgba(255,255,255,0.4)' : '#fff',
                                fontWeight:'800', fontSize:'12px',
                                cursor: bulkSynthesisEligibleTickers.length === 0 ? 'not-allowed' : 'pointer',
                                display:'flex', alignItems:'center', gap:'6px',
                            }}
                        >✨ Synthesize All ({bulkSynthesisEligibleTickers.length})</button>

                        <button
                            onClick={runGpStabilityCheck}
                            disabled={gpStabilityLoading || !data || data.totalTickers === 0}
                            style={{
                                padding:'8px 16px', borderRadius:'9px',
                                background: (gpStabilityLoading || !data || data.totalTickers === 0) ? 'rgba(8,145,178,0.2)' : '#0891b2',
                                border:'none', color:'#fff', fontWeight:'800', fontSize:'12px',
                                cursor: (gpStabilityLoading || !data || data.totalTickers === 0) ? 'not-allowed' : 'pointer',
                                display:'flex', alignItems:'center', gap:'6px',
                            }}
                        >
                            {gpStabilityLoading ? <><span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>🛡️</span> Checking...</> : <>🛡️ Check Stability</>}
                        </button>

                        {data && (
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)' }}>
                                {data.totalTickers} tickers · {data.totalCountries} countries
                                {data.scannedAt ? ` · as of ${data.scannedAt}` : ''}
                            </span>
                        )}
                    </div>

                    {data && (
                        <div style={{ display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap', alignItems:'center' }}>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search ticker..."
                                style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', outline:'none', width:'130px', color:'#1a1a1a', backgroundColor:'#fff' }} />
                            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
                                style={{ padding:'6px 8px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', color:'#1a1a1a', backgroundColor:'#fff' }}>
                                <option value="ALL">All Countries</option>
                                {allCountryNames.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                                                        {['ALL','BULLISH','BEARISH','NEUTRAL'].map(d => (
                                <button key={d} onClick={() => setDirFilter(d)} style={{
                                    padding:'5px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', cursor:'pointer',
                                    border:`1px solid ${dirFilter === d ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`,
                                    backgroundColor: dirFilter === d ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    color:'#fff',
                                }}>{d === 'ALL' ? 'All Dirs' : d}</button>
                            ))}
                            <button onClick={() => setGpShowAllCharts(s => !s)} style={{
                                padding:'5px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer',
                                border:`1px solid ${gpShowAllCharts ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.2)'}`,
                                backgroundColor: gpShowAllCharts ? 'rgba(124,58,237,0.2)' : 'transparent', color:'#fff',
                            }}>{gpShowAllCharts ? '📊 Hide All Charts' : '📊 Show All Charts'}</button>
                        </div>
                    )}
                </div>

                <div style={{ maxHeight:'70vh', overflowY:'auto' }}>
                    {!loading && !data && !error && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'48px', marginBottom:'14px' }}>🌍</div>
                            <div style={{ fontSize:'16px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>Ready to scan</div>
                            <div style={{ fontSize:'13px', color:'#64748b', maxWidth:'380px', margin:'0 auto', lineHeight:1.6 }}>
                                Hit <strong>Run Fresh Scan</strong> to check every saved Global Stock Pick for the same trend signals the Trend Scanner looks for.
                            </div>
                        </div>
                    )}
                    {loading && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block', marginBottom:'10px' }}>⚡</div>
                            <div style={{ fontSize:'13px', color:'#94a3b8' }}>Loading...</div>
                        </div>
                    )}
                    {error && !loading && (
                        <div style={{ padding:'20px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px' }}>⚠️ {error}</div>
                    )}
                    {isBackgroundRunning && (
                        <div style={{ padding:'10px 20px', backgroundColor:'#faf5ff', borderBottom:'1px solid #ddd6fe', fontSize:'12px', color:'#6b21a8', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                            <span style={{ animation:'spin 0.8s linear infinite', display:'inline-block' }}>⚡</span>
                            Fresh scan running in the background — showing cached results below (auto-updates every 5s).
                            <button onClick={forceReset} style={{ marginLeft:'auto', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', border:'1px solid #ef4444', backgroundColor:'#fff', color:'#ef4444', cursor:'pointer' }}>
                                ⚠️ Stuck? Force Reset
                            </button>
                        </div>
                    )}

                    {!loading && data && countryEntries.length === 0 && data.totalTickers > 0 && (
                        <div style={{ padding:'40px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>No picks match your filters.</div>
                    )}
                    {!loading && data && data.totalTickers === 0 && !isBackgroundRunning && (
                        <div style={{ padding:'60px 20px', textAlign:'center' }}>
                            <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
                            <div style={{ fontSize:'15px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>No Global Stock Picks saved yet</div>
                            <div style={{ fontSize:'13px', color:'#64748b' }}>Save some via the Country-Sector Drill feature first.</div>
                        </div>
                    )}

                    {countryEntries.map(([country, cData]) => {
                        const collapsed = !!collapsedCountries[country];
                        const s = cData.summary || {};
                        return (
                            <div key={country} style={{ borderBottom:'1px solid #f1f5f9' }}>
                                <div onClick={() => toggleCountryCollapse(country)} style={{
                                    padding:'12px 20px', display:'flex', alignItems:'center', gap:'10px',
                                    cursor:'pointer', backgroundColor:'#f8fafc', position:'sticky', top:0, zIndex:1, flexWrap:'wrap',
                                }}>
                                    <span style={{ fontSize:'13px', transition:'transform 0.15s', transform: collapsed ? 'rotate(-90deg)' : 'none', display:'inline-block' }}>▾</span>
                                    <span style={{ fontSize:'18px' }}>{cData.flag}</span>
                                    <span style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a1a' }}>{country}</span>
                                    <span style={{ fontSize:'11px', color:'#94a3b8' }}>{s.total} picks</span>
                                    <span style={{ fontSize:'11px', color:'#10b981', fontWeight:'700' }}>{s.bullish}▲</span>
                                    <span style={{ fontSize:'11px', color:'#ef4444', fontWeight:'700' }}>{s.bearish}▼</span>
                                                                        <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'700' }}>{s.neutral}→</span>
                                    {cData.sessionDate && (
                                        <span style={{ fontSize:'10px', color:'#94a3b8' }}>· picked {cData.sessionDate}</span>
                                    )}
                                        
                                                                        <button
                                        onClick={(e) => { e.stopPropagation(); openCountryAIPrompt(country); }}
                                        style={{
                                            marginLeft: s.avgScore != null ? '10px' : 'auto',
                                            padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', cursor:'pointer',
                                            border:'1px solid rgba(124,58,237,0.4)',
                                            background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'#fff',
                                            whiteSpace:'nowrap',
                                        }}
                                    >🧠 Scan {country}</button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleCountryCharts(country); }}
                                        style={{
                                            padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'800', cursor:'pointer',
                                            border:`1px solid ${gpShowAllChartsByCountry[country] ? 'rgba(15,23,42,0.6)' : 'rgba(15,23,42,0.3)'}`,
                                            background: gpShowAllChartsByCountry[country] ? '#0f172a' : 'linear-gradient(135deg,#0f172a,#1e3a5f)',
                                            color:'#fff', whiteSpace:'nowrap',
                                        }}
                                    >{gpShowAllChartsByCountry[country] ? '📊 Hide Charts' : '📊 Show All Charts'}</button>
                                    {s.avgScore != null && (
                                        <span style={{ marginLeft: s.avgScore != null ? '0' : 'auto', fontSize:'11px', color:'#64748b', fontWeight:'700' }}>Avg score {s.avgScore}</span>
                                    )}
                                </div>

                                {!collapsed && (
                                    <div style={{ padding:'8px 20px 16px', display:'flex', flexDirection:'column', gap:'6px' }}>
                                                                                {cData.tickers.map((t, tIdx) => {
                                            const sc = GP_SIG[t.signal] || GP_SIG.WATCH;
                                            const dirColor = t.direction === 'BULLISH' ? '#10b981' : t.direction === 'BEARISH' ? '#ef4444' : '#94a3b8';
                                            const key = `${country}_${t.ticker}`;
                                            const countryChartsOn = gpShowAllCharts || !!gpShowAllChartsByCountry[country];
                                            const isExpanded = countryChartsOn || expandedTicker === key;
                                            return (
                                                <div key={key} style={{ borderRadius:'10px', border:`1px solid ${isExpanded ? sc.color : '#e2e8f0'}`, overflow:'hidden' }}>
                                                    <div onClick={() => setExpandedTicker(isExpanded ? null : key)} style={{
                                                        padding:'9px 12px', display:'flex', alignItems:'center', gap:'10px',
                                                        cursor:'pointer', backgroundColor: isExpanded ? sc.bg : '#fff', flexWrap:'wrap',
                                                    }}>
                                                        <span style={{ fontSize:'13px', fontWeight:'800', color:'#1a1a1a', minWidth:'55px' }}>{t.ticker}</span>
                                                        <span style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor:sc.bg, color:sc.color, whiteSpace:'nowrap' }}>
                                                            {sc.icon} {sc.label}
                                                        </span>
                                                        <span style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: dirColor+'15', color:dirColor }}>
                                                            {t.direction}
                                                        </span>
                                                                                                                {(() => {
                                                            const synth = aiSynthesis[t.ticker];
                                                            const runs  = aiRuns[t.ticker];
                                                            if (synth) {
                                                                const av = GP_AI_VERDICT_CONFIG[synth.finalVerdict] || GP_AI_VERDICT_CONFIG.NEUTRAL;
                                                                return (
                                                                    <span title={synth.synthesizedThesis} style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap' }}>
                                                                        ✨ {av.icon} Synth ({synth.runCountAtSynthesis})
                                                                    </span>
                                                                );
                                                            }
                                                            if (runs?.length >= 2) {
                                                                const c  = getGpConsensus(t.ticker);
                                                                const av = GP_AI_VERDICT_CONFIG[c?.modeVerdict] || GP_AI_VERDICT_CONFIG.NEUTRAL;
                                                                return (
                                                                    <span title={`${c.runCount} AI runs · ${c.agreement}% agreement`} style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap' }}>
                                                                        🧠 ×{c.runCount} · {c.meanScore}
                                                                    </span>
                                                                );
                                                            }
                                                            if (runs?.length === 1) {
                                                                const av = GP_AI_VERDICT_CONFIG[runs[0].verdict] || GP_AI_VERDICT_CONFIG.NEUTRAL;
                                                                return (
                                                                    <span title={runs[0].thesis} style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: av.bg, color: av.color, border:`1px solid ${av.border}`, whiteSpace:'nowrap' }}>
                                                                        {av.icon} 🧠 {runs[0].badge}
                                                                    </span>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                        {gpStabilityData?.[t.ticker] && (() => {
                                                            const s = gpStabilityData[t.ticker];
                                                            const info = stabilityLabel(s.combined.winRate);
                                                            return (
                                                                <span title={`${s.combined.winRate}% win rate across ${s.occurrenceCount} occurrences (combined horizons)`} style={{ padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'700', backgroundColor: `${info.color}18`, color: info.color, border:`1px solid ${info.color}40`, whiteSpace:'nowrap' }}>
                                                                    🛡️ {s.combined.stabilityScore}%
                                                                </span>
                                                            );
                                                        })()}
                                                        {t.topPick && <span title="Top Pick">⭐</span>}
                                                        {t.pickRec && (
                                                            <span style={{ fontSize:'10px', color:'#64748b' }}>{t.pickRec}{t.conviction != null ? ` · conv ${t.conviction}` : ''}</span>
                                                        )}
                                                        <span style={{ marginLeft:'auto', fontSize:'11px', color:'#64748b', fontWeight:'700' }}>Score {Math.round(t.score)}</span>
                                                        <span style={{ fontSize:'11px', color:'#94a3b8', minWidth:'55px', textAlign:'right' }}>
                                                            {t.currentPrice != null ? `$${t.currentPrice}` : '—'}
                                                        </span>
                                                        <span style={{ fontSize:'11px', color:'#94a3b8', minWidth:'45px', textAlign:'right' }}>{fmtCap(t.marketCap)}</span>
                                                    </div>
                                                    {isExpanded && (
                                                        <div style={{ padding:'12px 14px', backgroundColor:'#fafafa', borderTop:`1px solid ${sc.color}`, display:'flex', flexDirection:'column', gap:'10px' }}>
                                                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(90px,1fr))', gap:'8px' }}>
                                                                {[
                                                                    { label:'ADX', value: t.adxNow ?? '—' },
                                                                    { label:'ROC20', value: t.roc20 != null ? `${t.roc20}%` : '—' },
                                                                    { label:'Vol Ratio', value: t.volRatio != null ? `${t.volRatio}×` : '—' },
                                                                    { label:'From 52W High', value: t.pctFromHigh != null ? `${t.pctFromHigh}%` : '—' },
                                                                    { label:'Sector', value: t.pickSector || t.sector || '—' },
                                                                ].map((item, ii) => (
                                                                    <div key={ii} style={{ padding:'7px 9px', backgroundColor:'#fff', borderRadius:'7px', border:'1px solid #e2e8f0' }}>
                                                                        <div style={{ fontSize:'9px', fontWeight:'700', color:'#94a3b8', marginBottom:'2px' }}>{item.label.toUpperCase()}</div>
                                                                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#1a1a1a' }}>{item.value}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                                                                                        {(() => {
                                                                const runs  = aiRuns[t.ticker] || [];
                                                                const synth = aiSynthesis[t.ticker];
                                                                const c     = getGpConsensus(t.ticker);
                                                                return (
                                                                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                                                                        {synth && (() => {
                                                                            const av = GP_AI_VERDICT_CONFIG[synth.finalVerdict] || GP_AI_VERDICT_CONFIG.NEUTRAL;
                                                                            return (
                                                                                <div style={{ padding:'12px 14px', backgroundColor: av.bg, borderRadius:'8px', border:`2px solid ${av.color}` }}>
                                                                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                                                                                        <span style={{ fontSize:'11px', fontWeight:'700', color:av.color, letterSpacing:'0.07em' }}>✨🧠 AI SYNTHESIS ({synth.runCountAtSynthesis} sources)</span>
                                                                                        <span style={{ padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', backgroundColor:av.color, color:'#fff' }}>
                                                                                            {av.icon} {synth.finalVerdict?.replace('_',' ')} · {synth.finalOpportunityScore}/100
                                                                                        </span>
                                                                                        <span style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8' }}>{synth.agreementLevel} agreement</span>
                                                                                    </div>
                                                                                    <div style={{ fontSize:'13px', color:'#333', lineHeight:1.55, marginBottom:'8px' }}>{synth.synthesizedThesis}</div>
                                                                                    {synth.consensusSummary && <div style={{ fontSize:'12px', color:'#475569', lineHeight:1.5, marginBottom:'6px' }}><strong>Agree on:</strong> {synth.consensusSummary}</div>}
                                                                                    {synth.disagreements && <div style={{ fontSize:'12px', color:'#b45309', lineHeight:1.5 }}><strong>Diverge on:</strong> {synth.disagreements}</div>}
                                                                                </div>
                                                                            );
                                                                        })()}

                                                                        {c && c.runCount >= 2 && (
                                                                            <div style={{ display:'flex', gap:'14px', alignItems:'center', padding:'8px 12px', backgroundColor:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0', flexWrap:'wrap' }}>
                                                                                <span style={{ fontSize:'11px', color:'#64748b' }}><strong style={{ color:'#1a1a1a' }}>{c.runCount}</strong> AI runs</span>
                                                                                <span style={{ fontSize:'11px', color:'#64748b' }}>Mean score <strong style={{ color:'#1a1a1a' }}>{c.meanScore}</strong></span>
                                                                                <span style={{ fontSize:'11px', color:'#64748b' }}>Agreement <strong style={{ color: c.agreement >= 70 ? '#10b981' : c.agreement >= 40 ? '#f59e0b' : '#ef4444' }}>{c.agreement}%</strong></span>
                                                                                {!synth && (
                                                                                    <button onClick={() => openSynthesisPrompt(t.ticker)} style={{ marginLeft:'auto', padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', cursor:'pointer', border:'1px solid rgba(124,58,237,0.4)', background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'#fff' }}>✨ Synthesize with AI</button>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {runs.length > 0 && (
                                                                            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                                                                {runs.map((run, idx) => {
                                                                                    const av = GP_AI_VERDICT_CONFIG[run.verdict] || GP_AI_VERDICT_CONFIG.NEUTRAL;
                                                                                    return (
                                                                                        <div key={idx} style={{ padding:'9px 11px', backgroundColor: av.bg, borderRadius:'8px', border:`1px solid ${av.border}` }}>
                                                                                            <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'4px', flexWrap:'wrap' }}>
                                                                                                <span style={{ fontSize:'10px', fontWeight:'800', color:'#64748b', backgroundColor:'#fff', padding:'1px 7px', borderRadius:'10px', border:'1px solid #e2e8f0' }}>{run.source || 'AI'}</span>
                                                                                                <span style={{ fontSize:'11px', fontWeight:'800', color:av.color }}>{av.icon} {run.verdict?.replace('_',' ')} · {run.opportunityScore}/100</span>
                                                                                            </div>
                                                                                            <div style={{ fontSize:'12px', color:'#333', lineHeight:1.5 }}>{run.thesis}</div>
                                                                                            {run.cohortRelation && <div style={{ fontSize:'11px', color:'#475569', lineHeight:1.5, marginTop:'4px' }}><strong>Cohort:</strong> {run.cohortRelation}</div>}
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}

                                                                        <button
                                                                            onClick={() => openIndividualAIPrompt({ ...t, country, flag: cData.flag })}
                                                                            style={{
                                                                                padding:'10px', borderRadius:'9px',
                                                                                background: runs.length > 0 ? '#fff' : 'linear-gradient(135deg,#7c3aed,#db2777)',
                                                                                color: runs.length > 0 ? '#7c3aed' : '#fff',
                                                                                border: runs.length > 0 ? '1.5px solid #7c3aed' : 'none',
                                                                                fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                                                                display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', width:'100%',
                                                                            }}
                                                                        >{runs.length > 0 ? `🧠 Add Another AI's Take (${runs.length} so far)` : '🧠 Ask External AI for Opportunity Analysis'}</button>
                                                                    </div>
                                                                );
                                                            })()}

                                                            {gpStabilityData?.[t.ticker] && (() => {
                                                                const s = gpStabilityData[t.ticker];
                                                                const info = stabilityLabel(s.combined.winRate);
                                                                return (
                                                                    <div style={{ padding:'12px 14px', backgroundColor: `${info.color}10`, borderRadius:'8px', border:`1px solid ${info.color}30` }}>
                                                                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                                                                            <Shield size={13} color={info.color} />
                                                                            <span style={{ fontSize:'11px', fontWeight:'700', color: info.color, letterSpacing:'0.07em' }}>HISTORICAL STABILITY</span>
                                                                            <span style={{ padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', backgroundColor: info.color, color:'#fff' }}>{s.combined.stabilityScore}% · {info.label}</span>
                                                                            <span style={{ fontSize:'10px', color:'#94a3b8' }}>{s.occurrenceCount} past occurrences</span>
                                                                            <button onClick={() => setPerfModalTicker(t.ticker)} style={{ marginLeft:'auto', fontSize:'10px', color: info.color, background:'none', border:`1px solid ${info.color}40`, borderRadius:'6px', cursor:'pointer', padding:'2px 8px' }}>View Details</button>
                                                                        </div>
                                                                        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                                                                            {GP_STABILITY_HORIZONS.map(h => {
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
                                                                                                                        {countryChartsOn || gpChartTicker === t.ticker ? (
                                                                <ScannerChart
                                                                    ticker={t.ticker}
                                                                    interval={gpChartInterval}
                                                                    onIntervalChange={setGpChartInterval}
                                                                    onClose={() => setGpChartTicker(null)}
                                                                    hideClose={countryChartsOn}
                                                                    mountDelay={countryChartsOn ? tIdx * 400 : 0}
                                                                    scannerMeta={t}
                                                                />
                                                            ) : (
                                                                <button onClick={() => setGpChartTicker(t.ticker)} style={{
                                                                    padding:'8px', borderRadius:'8px',
                                                                    background:'linear-gradient(135deg,#0f172a,#1e3a5f)',
                                                                    color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor:'pointer',
                                                                }}>📊 Show Chart</button>
                                                            )}

                                                            {onSelectTicker && (
                                                                <button onClick={() => { onSelectTicker(t.ticker); onClose(); }} style={{
                                                                    padding:'8px', borderRadius:'8px',
                                                                    background:'linear-gradient(135deg,#1e3a5f,#2563eb)',
                                                                    color:'#fff', border:'none', fontWeight:'700', fontSize:'12px', cursor:'pointer',
                                                                }}>→ Open {t.ticker} in Screener</button>
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
                                        {gpStabilityError && (
                        <div style={{ padding:'12px 20px', backgroundColor:'#fef2f2', color:'#b91c1c', fontSize:'13px' }}>⚠️ Stability check error: {gpStabilityError}</div>
                    )}

                    {gpStabilityRows.length > 0 && (
                        <div style={{ padding:'20px' }}>
                            <StabilityRankingTable rows={gpStabilityRows} horizons={GP_STABILITY_HORIZONS} keyField="symbol"
                                onSelectAsset={(sym) => setPerfModalTicker(sym)} title="Global Picks Stability Ranking (All Countries)" />
                        </div>
                    )}
                </div>
            </div>

                        <style>{`
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            `}</style>
        </div>

        {showAiPromptModal && (() => {
            const mode = aiPromptScope?.mode;
                        const promptText = mode === 'synthesis'
                ? buildGpSynthesisPrompt(aiPromptScope.ticker)
                : mode === 'bulkSynthesis'
                    ? buildGpBulkSynthesisPrompt(aiPromptScope.tickers || [])
                    : buildGpAIPrompt(aiPromptScope?.tickerObjs || []);
            const scopeLabel = mode === 'synthesis' ? `Synthesis for ${aiPromptScope.ticker}`
                : mode === 'bulkSynthesis' ? `Bulk synthesis — ${aiPromptScope.tickers?.length || 0} tickers`
                : mode === 'country' ? `${aiPromptScope.country} — ${(aiPromptScope?.tickerObjs || []).length} tickers`
                : mode === 'bulk' ? `${(aiPromptScope?.tickerObjs || []).length} tickers (all countries)`
                : aiPromptScope?.ticker;
            return (
                <div onClick={() => setShowAiPromptModal(false)} style={{
                    position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    zIndex:10070, padding:'20px', backdropFilter:'blur(3px)',
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
                                    <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>Copy this prompt → paste into any AI below → copy their JSON response → hit "Paste Response"</div>
                                </div>
                                <button onClick={() => setShowAiPromptModal(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer', flexShrink:0 }}>×</button>
                            </div>
                        </div>
                        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
                            <div style={{ backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'16px', fontSize:'13px', lineHeight:1.7, color:'#333', fontFamily:'monospace', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                                {promptText}
                            </div>
                            <div style={{ marginTop:'14px', padding:'10px 14px', backgroundColor:'rgba(32,178,170,0.07)', border:'1px solid rgba(32,178,170,0.25)', borderRadius:'9px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                                <span style={{ fontSize:'16px', flexShrink:0 }}>💡</span>
                                <div style={{ fontSize:'12px', color:'#0f766e', lineHeight:1.55 }}>
                                    <strong>Tip:</strong> Perplexity and Qwen both search the web in real time — Qwen's search tends to be the most comprehensive. ChatGPT, Gemini, and Claude need web browsing enabled to do the same; DeepSeek has a toggleable search mode.
                                </div>
                            </div>
                        </div>
                        <div style={{ padding:'14px 24px', borderTop:'1px solid #e2e8f0', display:'flex', flexDirection:'column', gap:'12px', flexShrink:0, backgroundColor:'#f8fafc' }}>
                            <div>
                                <div style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.08em', marginBottom:'8px' }}>OPEN DIRECTLY IN (prompt auto-filled)</div>
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
                                            padding:'8px 14px', borderRadius:'9px', border:`1.5px solid ${border}`, backgroundColor:bg, color, fontWeight:'700', fontSize:'13px', cursor:'pointer',
                                            display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap',
                                        }}><span style={{ fontSize:'15px' }}>{icon}</span>{name}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ height:'1px', backgroundColor:'#e2e8f0' }} />
                            <div style={{ display:'flex', gap:'10px' }}>
                                <button onClick={() => { navigator.clipboard.writeText(promptText); setAiCopied(true); setTimeout(() => setAiCopied(false), 2000); }} style={{
                                    flex:1, padding:'10px', background: aiCopied ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#4c1d95,#7c3aed)',
                                    border:'none', borderRadius:'9px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                                }}>{aiCopied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Prompt</>}</button>
                                <button onClick={() => { setShowAiPromptModal(false); setShowAiPasteModal(true); }} style={{
                                    flex:1, padding:'10px', backgroundColor:'#fff', border:'2px solid #7c3aed', borderRadius:'9px', color:'#7c3aed', fontWeight:'700', fontSize:'14px', cursor:'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                                }}><span>📥</span> Paste Response</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })()}

        {showAiPasteModal && (
            <div onClick={() => { setShowAiPasteModal(false); setAiPasteError(null); }} style={{
                position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center',
                zIndex:10070, padding:'20px', backdropFilter:'blur(3px)',
            }}>
                <div onClick={e => e.stopPropagation()} style={{
                    width:'min(640px,100%)', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fff',
                    boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:"'Segoe UI', system-ui, sans-serif", display:'flex', flexDirection:'column',
                }}>
                    <div style={{ padding:'18px 22px 14px', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', flexShrink:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                            <div>
                                <div style={{ fontSize:'16px', fontWeight:'800', color:'#fff', marginBottom:'4px' }}>📥 Paste AI Response</div>
                                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)' }}>Paste the raw JSON the AI returned.</div>
                            </div>
                            <button onClick={() => { setShowAiPasteModal(false); setAiPasteError(null); }} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'32px', height:'32px', color:'#fff', fontSize:'17px', cursor:'pointer' }}>×</button>
                        </div>
                    </div>
                    <div style={{ padding:'20px 22px 0' }}>
                        {aiPromptScope?.mode !== 'synthesis' && aiPromptScope?.mode !== 'bulkSynthesis' && (
                            <div style={{ marginBottom:'10px' }}>
                                <label style={{ fontSize:'11px', fontWeight:'700', color:'#64748b', display:'block', marginBottom:'4px' }}>Which AI is this from?</label>
                                <input type="text" list="gp-ai-source-options" value={aiPasteSource || aiLastOpenedSource} onChange={e => setAiPasteSource(e.target.value)}
                                    placeholder="Perplexity, ChatGPT, Gemini, Claude, DeepSeek, Qwen..."
                                    style={{ width:'100%', padding:'7px 10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'12px', outline:'none', boxSizing:'border-box' }} />
                                <datalist id="gp-ai-source-options">
                                    <option value="Perplexity" /><option value="ChatGPT" /><option value="Gemini" /><option value="Claude" /><option value="DeepSeek" /><option value="Qwen" />
                                </datalist>
                            </div>
                        )}
                        <textarea autoFocus value={aiPasteText} onChange={e => { setAiPasteText(e.target.value); setAiPasteError(null); }}
                            placeholder={aiPromptScope?.mode === 'synthesis' ? `Paste the JSON object here.` : `Paste the JSON array here.`}
                            style={{
                                width:'100%', height:'260px', padding:'14px', borderRadius:'10px',
                                border:`2px solid ${aiPasteError ? '#ef4444' : '#e2e8f0'}`, fontSize:'13px', fontFamily:'monospace', lineHeight:1.6,
                                resize:'vertical', outline:'none', boxSizing:'border-box', color:'#1a1a1a', backgroundColor: aiPasteError ? '#fef2f2' : '#f8fafc',
                            }} />
                        {aiPasteError && (
                            <div style={{ marginTop:'10px', padding:'10px 14px', backgroundColor:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', fontSize:'13px', color:'#b91c1c', lineHeight:1.5 }}>⚠️ {aiPasteError}</div>
                        )}
                    </div>
                    <div style={{ padding:'16px 22px', display:'flex', gap:'10px' }}>
                        <button onClick={handleGpPasteAIResponse} disabled={!aiPasteText.trim()} style={{
                            flex:1, padding:'11px', background: !aiPasteText.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#4c1d95)',
                            border:'none', borderRadius:'9px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor: !aiPasteText.trim() ? 'not-allowed' : 'pointer',
                        }}>✓ Parse & Save</button>
                        <button onClick={() => { setShowAiPasteModal(false); setShowAiPromptModal(true); setAiPasteError(null); }} style={{
                            padding:'11px 16px', backgroundColor:'#fff', border:'1px solid #e2e8f0', borderRadius:'9px', color:'#64748b', fontWeight:'600', fontSize:'14px', cursor:'pointer',
                        }}>← Back to prompt</button>
                    </div>
                </div>
            </div>
        )}

        {perfModalTicker && (
            <TickerPerformanceModal
                symbol={perfModalTicker}
                rows={normalizeRowsForPerfModal((gpStabilityRows || []).filter(r => r.symbol === perfModalTicker), 'globalPicks')}
                horizons={GP_STABILITY_HORIZONS}
                sourceLabel="Global Stock Picks"
                onClose={() => setPerfModalTicker(null)}
                onOpenInScreener={onSelectTicker ? () => { onSelectTicker(perfModalTicker); setPerfModalTicker(null); onClose && onClose(); } : null}
            />
        )}
        </>
    );
}

function PositionOverlayCard({ position, livePositions, lastPrice, extendedActive, marketSession }) {
    const [expanded, setExpanded] = React.useState(true);
    const mobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const live      = (livePositions || []).find(p => p.id === position.id) || position;
    const isOpenPos = live.status === 'OPEN';
    const isLong    = live.direction === 'long';
    const mark      = isOpenPos ? (live.current_price ?? lastPrice) : live.closed_price;

    let pnlD = null, pnlP = null;
    if (!isOpenPos && live.realized_pnl_dollars != null) {
        pnlD = live.realized_pnl_dollars; pnlP = live.realized_pnl_percent;
    } else if (mark != null) {
        pnlD = isLong ? (mark - live.entry_price) * live.quantity : (live.entry_price - mark) * live.quantity;
        pnlP = (live.entry_price && live.quantity) ? (pnlD / (live.entry_price * live.quantity)) * 100 : null;
    }
    const pnlColor = (pnlD ?? 0) >= 0 ? '#10b981' : '#ef4444';

    const STATUS = {
        OPEN: ['OPEN', '#3b82f6'], CLOSED_TP: ['CLOSED · TP hit', '#10b981'],
        CLOSED_SL: ['CLOSED · SL hit', '#ef4444'], CLOSED_MANUAL: ['CLOSED · manual', '#94a3b8'],
    };
    const [statusText, statusColor] = STATUS[live.status] || [live.status, '#94a3b8'];

    const away    = (level) => (isOpenPos && level != null && mark) ? (Math.abs(level - mark) / mark) * 100 : null;
    const fmtWhen = (d) => d ? new Date(d).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    const rr      = (live.tp_dollars && live.sl_dollars) ? (Math.abs(live.tp_dollars) / Math.abs(live.sl_dollars)).toFixed(2) : null;
    const tpAway  = away(live.tp_price);
    const slAway  = away(live.sl_price);

    const rows = [
        ['Size', `${live.quantity} sh @ $${live.entry_price}`, '#e2e8f0'],
        [isOpenPos ? 'Now' : 'Exit', mark != null ? `$${Number(mark).toFixed(2)}${isOpenPos && extendedActive ? ' (ext)' : ''}` : '—', '#e2e8f0'],
        ['TP', live.tp_price != null ? `$${live.tp_price} · +$${Math.abs(live.tp_dollars ?? 0).toFixed(2)} · ${Number(live.tp_percent ?? 0).toFixed(2)}%${tpAway != null ? ` · ${tpAway.toFixed(2)}% away` : ''}` : '—', '#10b981'],
        ['SL', live.sl_price != null ? `$${live.sl_price} · -$${Math.abs(live.sl_dollars ?? 0).toFixed(2)} · ${Number(live.sl_percent ?? 0).toFixed(2)}%${slAway != null ? ` · ${slAway.toFixed(2)}% away` : ''}` : '—', '#ef4444'],
        ...(rr ? [['R:R', `1 : ${rr}`, '#e2e8f0']] : []),
        ['Opened', fmtWhen(live.opened_at), '#94a3b8'],
        ...(!isOpenPos ? [['Closed', fmtWhen(live.closed_at), '#94a3b8']] : []),
        ...(live.notes ? [['Notes', live.notes, '#94a3b8']] : []),
        ...(live.source && live.source !== 'manual' ? [['Source', String(live.source).replace(/_/g, ' '), '#94a3b8']] : []),
    ];

    return (
        <div onClick={() => setExpanded(e => !e)} style={{
            position:'absolute', top:'8px', left:'8px', zIndex:3, backgroundColor:'rgba(10,22,40,0.94)',
            borderRadius:'10px', border:`1px solid ${statusColor}60`, padding: mobile ? '6px 9px' : '9px 13px',
            cursor:'pointer', maxWidth: mobile ? '215px' : '300px', maxHeight:'46%', overflowY:'auto',
            backdropFilter:'blur(4px)',
        }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                <span style={{ fontSize: mobile ? '11px' : '12px', fontWeight:'800', color: isLong ? '#10b981' : '#ef4444' }}>{isLong ? '▲ LONG' : '▼ SHORT'}</span>
                <span style={{ fontSize:'9px', fontWeight:'800', padding:'1px 7px', borderRadius:'10px', backgroundColor: statusColor + '25', color: statusColor }}>{statusText}</span>
                <span style={{ fontSize:'9px', color:'#64748b', marginLeft:'auto' }}>{expanded ? '▾' : '▸'}</span>
            </div>

            {pnlD != null && (
                <div style={{ fontSize: mobile ? '13px' : '15px', fontWeight:'900', color: pnlColor, marginTop:'3px' }}>
                    {isOpenPos && <span style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#3b82f6', marginRight:'5px', animation:'pulse 2s ease-in-out infinite' }} />}
                    {pnlD >= 0 ? '+' : '-'}${Math.abs(pnlD).toFixed(2)}
                    {pnlP != null && <span style={{ fontSize:'11px', fontWeight:'700' }}> ({pnlP >= 0 ? '+' : ''}{pnlP.toFixed(2)}%)</span>}
                </div>
            )}

            {expanded && (
                <div style={{ marginTop:'7px', paddingTop:'7px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', gap:'3px' }}>
                    {rows.map(([label, value, color]) => (
                        <div key={label} style={{ display:'flex', justifyContent:'space-between', gap:'10px', fontSize: mobile ? '9px' : '10px' }}>
                            <span style={{ color:'#64748b', flexShrink:0 }}>{label}</span>
                            <span style={{ color, fontWeight:'700', textAlign:'right' }}>{value}</span>
                        </div>
                    ))}
                    {isOpenPos && marketSession && (
                        <div style={{ fontSize:'9px', color:'#64748b', marginTop:'3px' }}>
                            {marketSession === 'regular' ? '● NYC open — TP/SL auto-close live' : '○ NYC closed — TP/SL auto-close paused'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}