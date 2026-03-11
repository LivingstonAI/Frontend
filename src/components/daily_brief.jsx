import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import "bootstrap/dist/css/bootstrap.min.css";

const ASSET_REGISTRY = {
  forex: {
    label: "Forex",
    assets: [
      'EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF',
      'NZDUSD','EURGBP','EURJPY','GBPJPY','AUDJPY','EURCHF',
      'USDZAR','EURAUD'
    ]
  },
  indices: {
    label: "Indices",
    assets: [
      'SPX','DJI','IXIC','RUT','VIX',
      'FTSE','DAX','CAC','IBEX','AEX','SMI','OMXS30','BFX',
      'N225','HSI','SHCOMP','STI','SENSEX','NIFTY','KOSPI','TWII','JKSE',
      'ASX200','TSX','MXX','IBOV','MERVAL'
    ]
  },
  commodities: {
    label: "Commodities",
    assets: [
      'XAUUSD','XAGUSD','XPTUSD','XPDUSD',
      'USOIL','UKOIL','NATGAS','GASOLINE','HEATING_OIL',
      'COPPER','ALUMINUM',
      'CORN','WHEAT','SOYBEANS','COFFEE','SUGAR','COTTON','COCOA','LUMBER'
    ]
  },
  bonds: {
    label: "Bonds",
    assets: ['US10Y','US30Y','US5Y','US3M','ZN','ZB','ZT','ZF']
  },
  stocks: {
    label: "Stocks",
    assets: [
      'AAPL','MSFT','GOOGL','GOOG','AMZN','NVDA','TSLA','META','AMD','INTC',
      'ORCL','CSCO','ADBE','CRM','AVGO','QCOM','TXN','AMAT','LRCX','KLAC',
      'SNPS','CDNS','MRVL','NXPI','MU','ADI','MPWR','IBM','ACN','ADSK',
      'AKAM','ANSS','APH','ANET','ASML','KEYS','MCHP','MSI','MDB','NTAP',
      'NTNX','PAYC','PTC','ROP','SAP','STX','TER','TSM','VRSN','WDC','ZBRA',
      'NOW','INTU','WDAY','PANW','CRWD','ZS','DDOG','NET','SNOW','PLTR',
      'TEAM','FTNT','OKTA','CYBR',
      'V','MA','PYPL','ADP','FISV','FIS','ZM','DOCU','TWLO','SQ','UBER',
      'LYFT','DASH','PINS','SNAP','SPOT','ROKU','AFRM','COIN','HOOD','SOFI',
      'RBLX','ASTS',
      'JPM','BAC','WFC','C','GS','MS','BLK','SCHW','AXP','SPGI','CME',
      'ICE','MCO','BK','USB','PNC','TFC','COF','AFL','AON','AJG','AMP',
      'BEN','CBOE','CINF','DFS','FITB','GL','HBAN','HIG','IVZ','KEY',
      'LNC','MTB','NTRS','NDAQ','PFG','RF','RJF','STT','SYF','TROW',
      'CFG','CMA','EWBC','WAL','WBS','ALLY',
      'BRK-B','PGR','ALL','TRV','AIG','MET','PRU',
      'JNJ','LLY','UNH','PFE','ABBV','MRK','TMO','ABT','DHR','BMY',
      'AMGN','GILD','CVS','CI','ELV','HUM','VRTX','REGN','ISRG','BIIB',
      'MRNA','BNTX','ALNY','MCK','CAH','IDXX','BAX','BDX','BSX','DXCM',
      'EW','HOLX','ILMN','INCY','IQV','LH','MDT','MOH','NBIX','PODD',
      'RMD','STE','SYK','UHS','ZBH','ZTS','TDOC','VEEV','NVAX',
      'HD','MCD','NKE','SBUX','TJX','LOW','BKNG','MAR','CMG','F','GM',
      'ABNB','SHOP','MELI','EBAY','ETSY','TGT','ROST','YUM','DPZ','AAL',
      'DAL','UAL','LUV','CCL','RCL','EA','TTWO','RIVN','LCID','AZO','BBY',
      'BURL','CPRT','DHI','DRI','EXPE','GPC','GRMN','HAS','HLT','KMX',
      'LEN','LVS','MGM','NVR','ORLY','PHM','POOL','RL','TSCO','ULTA',
      'WHR','WYNN','APTV','DG','DLTR','FIVE','FL','GPS','GT','LAD','LKQ',
      'NCLH','NWL','PVH',
      'WMT','PG','KO','PEP','COST','PM','MO','MDLZ','CL','KMB','GIS',
      'KHC','STZ','ADM','CAG','CHD','CLX','CPB','EL','HSY','KDP','KR',
      'MKC','MNST','SJM','SYY','TAP','TSN','WBA','BG','HRL',
      'XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN',
      'HES','BKR','APA','CTRA','FANG','KMI','LNG','MRO','OKE','TRGP',
      'WMB','EQT','AR','CQP','EXE','MTDR','OVV','PBF','RIG','SM',
      'BA','HON','UNP','CAT','GE','RTX','LMT','UPS','DE','MMM','GD',
      'NOC','FDX','CSX','HWM','TDG','HEI','LHX','TXT','CARR','CHRW',
      'CMI','DOV','EMR','ETN','EXPD','FAST','FTV','GNRC','GWW','IEX',
      'IR','ITW','JBHT','JCI','LDOS','MAS','NSC','ODFL','OTIS','PCAR',
      'PH','PWR','ROK','ROL','RSG','SNA','SWK','TT','URI','VRSK','WAB','WM',
      'T','VZ','CMCSA','NFLX','DIS','TMUS','CHTR','LYV','MTCH','NWSA',
      'OMC','PARA','WBD','IPG',
      'AMT','PLD','CCI','EQIX','PSA','SPG','O','AVB','ARE','BXP','CBRE',
      'DLR','EQR','ESS','EXR','FRT','HST','IRM','KIM','MAA','REG','SBAC',
      'UDR','VTR','WELL','WY','INVH','VNO',
      'LIN','APD','SHW','ECL','DD','NEM','FCX','DOW','LYB','CE','ALB',
      'EMN','SQM','AMCR','BALL','CF','CLF','CTVA','FMC','IP','MLM','MOS',
      'NUE','PKG','PPG','SEE','STLD','VMC','AVY','AA','MP','RS',
      'NEE','DUK','SO','D','AEP','EXC','SRE','AEE','AES','AWK','CMS',
      'CNP','DTE','ED','EIX','ES','ETR','EVRG','FE','LNT','NI','NRG',
      'PCG','PEG','PNW','PPL','VST','WEC','XEL','CEG',
      'BABA','JD','PDD','BIDU','NIO','XPEV','LI'
    ]
  }
};

export default function DailyBrief() {
  const [dailyBriefData, setDailyBriefData]     = useState([]);
  const [filter, setFilter]                       = useState("");
  const [updateStatus, setUpdateStatus]           = useState("Manually Update");
  const [isSyncing, setIsSyncing]                 = useState(false);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [selectedAssets, setSelectedAssets]       = useState([]);
  const [assetUpdateStatus, setAssetUpdateStatus] = useState("Update Selected Assets");
  const [showModal, setShowModal]                 = useState(false);
  const [activeCategory, setActiveCategory]       = useState("forex");
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';

  useEffect(() => { fetchDailyBriefData(); }, []);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const fetchDailyBriefData = () => {
    fetch(`${baseUrl}/fetch-daily-brief-data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') }
    })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => setDailyBriefData(data))
    .catch(err => console.error('Fetch error:', err));
  };

  const handleManualUpdate = async () => {
    setIsSyncing(true);
    setUpdateStatus("Updating...");
    try {
      const r = await fetch(`${baseUrl}/daily-brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': Cookies.get('csrftoken') }
      });
      if (!r.ok) throw new Error();
      setUpdateStatus("Updated Successfully!");
      await sleep(2000);
      fetchDailyBriefData();
    } catch {
      setUpdateStatus("Error Occurred");
    } finally {
      await sleep(2000);
      setUpdateStatus("Manually Update");
      setIsSyncing(false);
    }
  };

  const handleSubmitAssets = async () => {
    setShowModal(false);
    setAssetUpdateStatus("Updating Assets...");
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
      alert('Error occurred saving assets.');
    } finally {
      setAssetUpdateStatus("Update Selected Assets");
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

  return (
    <div>
      <div className="header"><Header /></div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">

          {/* Page header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #1a73e8'
          }}>
            <div>
              <h5 style={{ margin: 0, fontWeight: 700, color: '#1a1a2e', letterSpacing: 0.5 }}>
                Daily Brief
              </h5>
              <p style={{ margin: 0, fontSize: 12, color: '#5f6368', marginTop: 2 }}>
                {new Date().toUTCString()} — {dailyBriefData.length} report{dailyBriefData.length !== 1 ? 's' : ''}
              </p>
            </div>
            <span style={{
              background: '#e8f0fe', color: '#1a73e8', fontSize: 11,
              fontWeight: 600, padding: '3px 10px', borderRadius: 4,
              border: '1px solid #c5d8fd'
            }}>
              {dailyBriefData.length} ACTIVE
            </span>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filter by asset..."
              className="form-control"
              style={{ maxWidth: 240, fontSize: 13 }}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <button
              className="btn btn-primary"
              style={{ fontSize: 13 }}
              onClick={handleManualUpdate}
              disabled={isSyncing}
            >
              {updateStatus}
            </button>
            <button
              className="btn btn-outline-primary"
              style={{ fontSize: 13 }}
              onClick={() => setShowModal(true)}
            >
              Configure Assets
              {selectedAssets.length > 0 && (
                <span className="badge bg-primary ms-2">{selectedAssets.length}</span>
              )}
            </button>
            {selectedAssets.length > 0 && (
              <button className="btn btn-success" style={{ fontSize: 13 }} onClick={handleSubmitAssets}>
                {assetUpdateStatus}
              </button>
            )}
          </div>

          <hr style={{ borderColor: '#dce6f5', margin: '0 0 20px 0' }} />

          {/* Brief cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredData.length > 0 ? filteredData.map((brief, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #dce6f5',
                borderLeft: '4px solid #1a73e8',
                borderRadius: 6,
                padding: '14px 18px',
                boxShadow: '0 1px 4px rgba(26,115,232,0.06)'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 8
                }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#1a73e8' }}>
                    {brief.asset}
                  </span>
                  <span style={{ fontSize: 11, color: '#80868b' }}>
                    {new Date(brief.last_update).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#3c4043', lineHeight: 1.7 }}>
                  {expandedSummaries[i]
                    ? brief.summary
                    : brief.summary.length > 500
                      ? brief.summary.substring(0, 500) + '...'
                      : brief.summary}
                </p>
                {brief.summary.length > 500 && (
                  <button
                    onClick={() => toggleSummary(i)}
                    style={{
                      marginTop: 8, background: 'none', border: 'none',
                      color: '#1a73e8', fontSize: 12, cursor: 'pointer',
                      padding: 0, fontWeight: 600
                    }}
                  >
                    {expandedSummaries[i] ? '▲ Read less' : '▼ Read more'}
                  </button>
                )}
              </div>
            )) : (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                color: '#80868b', fontSize: 14, background: '#f8faff',
                borderRadius: 6, border: '1px dashed #dce6f5'
              }}>
                No reports available. Click <strong>Manually Update</strong> to fetch data.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Asset Config Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{
            background: '#fff', borderRadius: 8, width: '90%', maxWidth: 800,
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 40px rgba(26,115,232,0.15)'
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderBottom: '1px solid #dce6f5'
            }}>
              <h5 style={{ margin: 0, color: '#1a1a2e', fontWeight: 700 }}>Configure Assets</h5>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none', border: '1px solid #dce6f5', borderRadius: 4,
                  width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: '#5f6368',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >✕</button>
            </div>

            {/* Category tabs */}
            <div style={{
              display: 'flex', gap: 0, padding: '0 24px',
              borderBottom: '1px solid #dce6f5', overflowX: 'auto'
            }}>
              {Object.entries(ASSET_REGISTRY).map(([key, val]) => {
                const count = selectedAssets.filter(a => val.assets.includes(a)).length;
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    style={{
                      padding: '12px 18px', border: 'none', background: 'none',
                      fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                      borderBottom: isActive ? '2px solid #1a73e8' : '2px solid transparent',
                      color: isActive ? '#1a73e8' : '#5f6368',
                      marginBottom: -1
                    }}
                  >
                    {val.label}
                    {count > 0 && (
                      <span style={{
                        marginLeft: 6, background: '#1a73e8', color: '#fff',
                        borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button className="btn btn-sm btn-outline-primary" onClick={selectAllInCategory}>
                  Select all {ASSET_REGISTRY[activeCategory].label}
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={deselectAllInCategory}>
                  Deselect all
                </button>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 6
              }}>
                {ASSET_REGISTRY[activeCategory].assets.map((asset, i) => {
                  const checked = selectedAssets.includes(asset);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleAsset(asset)}
                      style={{
                        padding: '6px 10px', borderRadius: 4, cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, userSelect: 'none',
                        border: checked ? '1.5px solid #1a73e8' : '1.5px solid #dce6f5',
                        background: checked ? '#e8f0fe' : '#fafafa',
                        color: checked ? '#1a73e8' : '#3c4043',
                        transition: 'all 0.12s'
                      }}
                    >
                      {checked && <span style={{ marginRight: 4 }}>✓</span>}
                      {asset}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 24px', borderTop: '1px solid #dce6f5'
            }}>
              <span style={{ fontSize: 13, color: '#5f6368' }}>
                <strong style={{ color: '#1a73e8' }}>{selectedAssets.length}</strong> assets selected across all categories
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline-danger btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSubmitAssets}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}