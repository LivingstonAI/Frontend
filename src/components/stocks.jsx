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
        <div style={{ borderRadius:'12px', border:`1px solid ${bias.color}55`, backgroundColor:tk.card, padding:'14px', color:tk.text, fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', marginBottom:'8px' }}>
                <span style={chip(bias.color)}>{bias.icon} {analysis.bias} BIAS</span>
                <span style={chip(verdict.color)}>{verdict.icon} {String(analysis.verdict).replace(/_/g, ' ')}</span>
                {analysis.confidence != null && <span style={{ fontSize:'11px', color:tk.sub, fontWeight:'700' }}>{analysis.confidence}% conf</span>}
                {analysis.opportunityScore != null && <span style={{ fontSize:'11px', color:tk.sub, fontWeight:'700' }}>score {analysis.opportunityScore}/100</span>}
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

            <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', fontSize:'10px', color:tk.sub }}>
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
                    </div>
                </div>

                <div style={{ padding:'16px 20px', maxHeight:'70vh', overflowY:'auto' }}>
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
                    price: pos.sl_price, color: '#ef4444', lineWidth: 1, lineStyle: 2, axisLabelVisible: true,
                    title: pos.sl_dollars ? `SL $${pos.sl_price} (-$${Math.abs(pos.sl_dollars).toFixed(2)})` : `SL $${pos.sl_price}`,
                });
                if (pos.tp_price) lines.tp = seriesRef.current.createPriceLine({
                    price: pos.tp_price, color: '#10b981', lineWidth: 1, lineStyle: 2, axisLabelVisible: true,
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
                price, color, lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: label,
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
        const chart = LC.createChart(container, {
            