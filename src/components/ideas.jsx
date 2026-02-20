import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

// ─── Stock Trend Quality Analyzer ────────────────────────────────────────────

const STOCK_LIST = [
    // Tech Giants & Semiconductors
    "AAPL","MSFT","GOOGL","GOOG","AMZN","NVDA","TSLA","META","AMD","INTC","ORCL","CSCO",
    "ADBE","CRM","AVGO","QCOM","TXN","AMAT","LRCX","KLAC","SNPS","CDNS","MRVL","NXPI",
    "MU","ADI","MPWR","SWKS","QRVO","ON","IBM","AAOI","ACLS","ACN","ADSK","AKAM",
    "ANSS","APH","ANET","ASML","AVAV","KEYS","MCHP","MTSI","MSI","MDB","NTAP","NTNX",
    "PAYC","PTC","ROP","SAP","SLAB","STX","TER","TSM","TYL","UMC","VRSN","WDC","XLNX","ZBRA",
    // Software & Cloud
    "NOW","INTU","WDAY","PANW","CRWD","ZS","DDOG","NET","SNOW","PLTR","TEAM","FTNT","OKTA","S","CYBR",
    // Fintech & Payments
    "V","MA","PYPL","ADP","FISV","FIS","ZM","DOCU","TWLO","SQ","UBER","LYFT",
    "DASH","PINS","SNAP","SPOT","ROKU","Z","ZG","AFRM","COIN","HOOD","SOFI","RBLX","ASTS",
    // Financial Services & Banks
    "JPM","BAC","WFC","C","GS","MS","BLK","SCHW","AXP","SPGI","CME","ICE","MCO",
    "BK","USB","PNC","TFC","COF","AFL","AMG","AON","AJG","AMP","BEN",
    "CBOE","CINF","DFS","ERIE","FITB","FRC","GL","HBAN","HIG","IVZ","JKHY","KEY",
    "L","LNC","MTB","NTRS","NDAQ","PFG","RF","RJF","SIVB","STT","SYF","TROW",
    "WRB","ZION","CFG","CMA","FHN","EWBC","WAL","WBS","ALLY",
    // Insurance
    "BRK-B","PGR","ALL","TRV","AIG","MET","PRU",
    // Healthcare & Pharma
    "JNJ","LLY","UNH","PFE","ABBV","MRK","TMO","ABT","DHR","BMY","AMGN","GILD","CVS",
    "CI","ELV","HUM","VRTX","REGN","ISRG","BIIB","MRNA","BNTX","SGEN","ALNY","BGNE",
    "MCK","CAH","COR","IDXX","A","WAT","ALGN","ATRC","BAX","BDX","BIO","BSX",
    "CERN","DXCM","EW","EXAS","HOLX","HSIC","ILMN","INCY","IQV","LH","MDT","MOH",
    "NBIX","PKI","PODD","RMD","STE","SYK","TFX","UHS","WST","XRAY","ZBH","ZTS",
    "TDOC","DOCS","VEEV","HALO","NVAX","IONS","UTHR",
    // Consumer Discretionary & Retail
    "HD","MCD","NKE","SBUX","TJX","LOW","BKNG","MAR","CMG","F","GM","ABNB",
    "SHOP","MELI","EBAY","ETSY","TGT","ROST","YUM","DPZ","QSR","AAL","DAL","UAL",
    "LUV","CCL","RCL","EA","TTWO","U","RIVN","LCID",
    "AZO","BBY","BURL","CPRT","DHI","DRI","EXPE","GPC","GRMN","HAS","HLT","KMX",
    "LEN","LVS","MGM","MHK","NVR","ORLY","PHM","POOL","RL","TSCO","TPR","ULTA",
    "VFC","WHR","WYNN","APTV","BWA","DG","DLTR","DDS","FIVE","FL","FOXA","FOX",
    "GPS","GT","HBI","LAD","LKQ","M","NCLH","NWL","PVH",
    // Consumer Staples
    "WMT","PG","KO","PEP","COST","PM","MO","MDLZ","CL","KMB","GIS","KHC","STZ",
    "ADM","BF-B","CAG","CHD","CLX","CPB","EL","HSY","K","KDP","KR","KVUE",
    "MKC","MNST","SJM","SYY","TAP","TSN","WBA","BGS","BG","COKE","FLO","HRL","LANC","POST",
    // Energy
    "XOM","CVX","COP","EOG","SLB","MPC","PSX","VLO","OXY","HAL","DVN","HES","BKR",
    "APA","CTRA","FANG","KMI","LNG","MRO","NOV","OKE","TRGP","WMB","EQT","AR",
    "CLR","CNX","CQP","EXE","FTI","HP","MTDR","OVV","PBF","PR","RIG","SM","VAL","XEC",
    // Industrials
    "BA","HON","UNP","CAT","GE","RTX","LMT","UPS","DE","MMM","GD","NOC","FDX","CSX",
    "HWM","TDG","HEI","LHX","TXT","AOS","CARR","CHRW","CMI","DOV","EMR",
    "ETN","EXPD","FAST","FTV","GNRC","GWW","IEX","IR","ITW","J","JBHT","JCI",
    "LDOS","MAS","NSC","ODFL","OTIS","PCAR","PH","PWR","ROK","ROL","RSG","SNA",
    "SWK","TT","URI","VRSK","WAB","WM","XYL","ALK","JBLU","SAVE",
    // Communication Services & Media
    "T","VZ","CMCSA","NFLX","DIS","TMUS","CHTR","LYV","MTCH","NWSA","NWS","OMC","PARA",
    "WBD","IPG","DISH",
    // Real Estate & REITs
    "AMT","PLD","CCI","EQIX","PSA","SPG","O","AVB","ARE","BXP","CBRE","DLR","EQR",
    "ESS","EXR","FRT","HST","IRM","KIM","MAA","REG","SBAC","SLG","UDR","VTR",
    "WELL","WY","INVH","PEAK","VNO",
    // Materials & Chemicals
    "LIN","APD","SHW","ECL","DD","NEM","FCX","DOW","LYB","CE","ALB","EMN","SQM",
    "AMCR","BALL","CF","CLF","CTVA","FMC","IP","MLM","MOS","NUE","PKG","PPG",
    "SEE","STLD","SW","VMC","AVY","AA","MP","RS",
    // Utilities
    "NEE","DUK","SO","D","AEP","EXC","SRE","AEE","AES","AWK","CMS","CNP","DTE",
    "ED","EIX","ES","ETR","EVRG","FE","LNT","NI","NRG","PCG","PEG","PNW",
    "PPL","VST","WEC","XEL","CEG",
    // Chinese ADRs
    "BABA","JD","PDD","BIDU","NIO","XPEV","LI",
];

// ─── Trend Persistence Batch Scanner ─────────────────────────────────────────
// Scans all stocks, caches results in window.storage, shows narrative + searchable list

const STORAGE_KEY = "ideas_hub_trend_scan_v1";

function tierColor(persistence) {
    if (persistence >= 68) return { bg: "#DCFCE7", text: "#15803D", border: "#86EFAC" };
    if (persistence >= 50) return { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" };
    if (persistence >= 35) return { bg: "#FEF9C3", text: "#A16207", border: "#FDE047" };
    return { bg: "#FEE2E2", text: "#B91C1C", border: "#FCA5A5" };
}

function tierLabel(persistence) {
    if (persistence >= 68) return "Strong Holder";
    if (persistence >= 50) return "Moderate Holder";
    if (persistence >= 35) return "Weak Holder";
    return "Trend Fader";
}

function NarrativeSummary({ stocks }) {
    if (!stocks || stocks.length === 0) return null;

    const high   = stocks.filter(s => s.persistence >= 68);
    const mid    = stocks.filter(s => s.persistence >= 50 && s.persistence < 68);
    const low    = stocks.filter(s => s.persistence >= 35 && s.persistence < 50);
    const faders = stocks.filter(s => s.persistence < 35);

    const topNames  = high.slice(0, 5).map(s => s.symbol).join(", ");
    const midNames  = mid.slice(0, 4).map(s => s.symbol).join(", ");
    const fadNames  = faders.slice(0, 4).map(s => s.symbol).join(", ");

    const avgHighPersist = high.length ? (high.reduce((a, b) => a + b.persistence, 0) / high.length).toFixed(0) : 0;
    const avgLowPersist  = faders.length ? (faders.reduce((a, b) => a + b.persistence, 0) / faders.length).toFixed(0) : 0;

    const bullHigh = high.filter(s => s.direction === "Bullish").length;
    const bearHigh = high.length - bullHigh;

    return (
        <div style={tqaStyles.narrative}>
            <p style={tqaStyles.narrativeTitle}>📊 What the data says</p>

            {high.length > 0 && (
                <p style={tqaStyles.narrativePara}>
                    <strong style={{ color: "#15803D" }}>High-quality, well-known stocks</strong> like{" "}
                    <span style={{ color: "#15803D", fontWeight: 600 }}>{topNames}</span>{" "}
                    are showing the strongest trend persistence — averaging <strong>{avgHighPersist}%</strong> likelihood
                    of maintaining their current direction. Of these, {bullHigh} are trending bullish and {bearHigh} bearish.
                    These companies have the fundamentals to back their moves: strong margins, healthy balance sheets,
                    and consistent institutional interest. Their trends tend to hold because conviction drives them,
                    not hype.
                </p>
            )}

            {mid.length > 0 && (
                <p style={tqaStyles.narrativePara}>
                    <strong style={{ color: "#1D4ED8" }}>Mid-tier stocks</strong>
                    {midNames ? <> like <span style={{ color: "#1D4ED8", fontWeight: 600 }}>{midNames}</span></> : ""}{" "}
                    sit in the middle ground — they're trending, but with moderate conviction.
                    These can go either way depending on broader market conditions. Worth watching,
                    but confirmation before acting is wise.
                </p>
            )}

            {faders.length > 0 && (
                <p style={tqaStyles.narrativePara}>
                    <strong style={{ color: "#B91C1C" }}>Lower-quality or speculative stocks</strong>
                    {fadNames ? <> like <span style={{ color: "#B91C1C", fontWeight: 600 }}>{fadNames}</span></> : ""}{" "}
                    score the lowest — averaging just <strong>{avgLowPersist}%</strong> persistence likelihood.
                    These may show a trend on the chart, but weaker fundamentals mean the move is likely
                    driven by momentum or sentiment rather than real value. Reversals here are common.
                </p>
            )}

            <div style={tqaStyles.narrativeStats}>
                {[
                    { label: "Strong Holders", val: high.length, color: "#15803D", bg: "#DCFCE7" },
                    { label: "Moderate", val: mid.length, color: "#1D4ED8", bg: "#DBEAFE" },
                    { label: "Weak", val: low.length, color: "#A16207", bg: "#FEF9C3" },
                    { label: "Faders", val: faders.length, color: "#B91C1C", bg: "#FEE2E2" },
                ].map(s => (
                    <div key={s.label} style={{ ...tqaStyles.narrativeStat, background: s.bg }}>
                        <span style={{ fontSize: "18px", fontWeight: "800", color: s.color }}>{s.val}</span>
                        <span style={{ fontSize: "10px", color: s.color, fontWeight: "600" }}>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StockRow({ stock, expanded, onToggle }) {
    const c = tierColor(stock.persistence);
    const dirColor = stock.direction === "Bullish" ? "#15803D" : "#B91C1C";
    return (
        <div style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div
                onClick={onToggle}
                style={{ display: "flex", alignItems: "center", padding: "10px 14px", cursor: "pointer", gap: "10px", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
                {/* Symbol */}
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#0F172A", width: "56px", flexShrink: 0 }}>{stock.symbol}</span>

                {/* Direction badge */}
                <span style={{ fontSize: "11px", fontWeight: "600", color: dirColor, width: "58px", flexShrink: 0 }}>
                    {stock.direction === "Bullish" ? "▲" : "▼"} {stock.direction}
                </span>

                {/* Persistence bar */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${stock.persistence}%`, background: c.text, borderRadius: "3px", transition: "width 0.6s ease" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: c.text, width: "36px", flexShrink: 0 }}>{stock.persistence.toFixed(0)}%</span>
                </div>

                {/* Tier badge */}
                <span style={{ ...tqaStyles.tierBadge, background: c.bg, color: c.text, border: `1px solid ${c.border}`, display: "none" }} className="tqa-tier-badge">
                    {tierLabel(stock.persistence)}
                </span>

                {/* Quality score */}
                <span style={{ fontSize: "11px", color: "#94A3B8", width: "40px", textAlign: "right", flexShrink: 0 }}>Q:{stock.quality.toFixed(0)}</span>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
                    <polyline points="6 9 12 15 18 9" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {expanded && (
                <div style={{ padding: "0 14px 12px 14px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", animation: "tqa-fadeUp 0.2s ease" }}>
                    <p style={{ fontSize: "12px", color: "#475569", margin: "10px 0 8px", lineHeight: 1.6 }}>{stock.insight}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[
                            { label: "Quality", val: stock.quality.toFixed(0) + "/100" },
                            { label: "Trend", val: stock.trend_quality.toFixed(0) + "/100" },
                            { label: "Return", val: (stock.period_return > 0 ? "+" : "") + stock.period_return.toFixed(1) + "%" },
                            { label: "Max DD", val: stock.max_drawdown.toFixed(1) + "%" },
                        ].map(d => (
                            <div key={d.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "6px 10px", textAlign: "center" }}>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A" }}>{d.val}</div>
                                <div style={{ fontSize: "10px", color: "#94A3B8" }}>{d.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StockTrendModal() {
    const [open, setOpen]           = useState(false);
    const [scanning, setScanning]   = useState(false);
    const [progress, setProgress]   = useState({ done: 0, total: 0, current: "" });
    const [stocks, setStocks]       = useState(null);       // cached results
    const [cacheDate, setCacheDate] = useState(null);
    const [error, setError]         = useState(null);
    const [search, setSearch]       = useState("");
    const [expanded, setExpanded]   = useState({});
    const [filterDir, setFilterDir] = useState("All");
    const [listOpen, setListOpen]   = useState(false);
    const [storageLoading, setStorageLoading] = useState(false);

    const baseUrl = "https://backend-production-c0ab.up.railway.app";

    // Load cached data from storage on open
    const loadCache = async () => {
        setStorageLoading(true);
        try {
            const res = await window.storage.get(STORAGE_KEY);
            if (res && res.value) {
                const parsed = JSON.parse(res.value);
                setStocks(parsed.stocks);
                setCacheDate(parsed.date);
            }
        } catch (e) {
            // No cache yet — that's fine
        } finally {
            setStorageLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        if (!stocks) loadCache();
    };

    const runScan = async () => {
        setScanning(true);
        setError(null);
        setProgress({ done: 0, total: STOCK_LIST.length, current: "" });

        const results = [];
        // Process in small batches to avoid hammering the server
        const BATCH = 5;
        for (let i = 0; i < STOCK_LIST.length; i += BATCH) {
            const batch = STOCK_LIST.slice(i, i + BATCH);
            await Promise.all(batch.map(async (sym) => {
                try {
                    const res = await fetch(`${baseUrl}/ideas_hub_analyze_stock_trend_quality`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ symbol: sym, period: "6mo" }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        results.push({
                            symbol:        data.symbol,
                            persistence:   data.trend_persistence_likelihood,
                            quality:       data.company_quality_score,
                            trend_quality: data.overall_trend_quality,
                            direction:     data.direction,
                            period_return: data.period_return,
                            max_drawdown:  data.max_drawdown,
                            insight:       data.insight,
                        });
                    }
                } catch (_) {}
                setProgress(p => ({ ...p, done: p.done + 1, current: sym }));
            }));
        }

        // Sort by persistence desc
        results.sort((a, b) => b.persistence - a.persistence);

        const payload = { stocks: results, date: new Date().toLocaleString() };
        try {
            await window.storage.set(STORAGE_KEY, JSON.stringify(payload));
        } catch (_) {}

        setStocks(results);
        setCacheDate(payload.date);
        setScanning(false);
    };

    const filtered = (stocks || []).filter(s => {
        const matchSearch = s.symbol.includes(search.toUpperCase()) || s.insight.toLowerCase().includes(search.toLowerCase());
        const matchDir    = filterDir === "All" || s.direction === filterDir;
        return matchSearch && matchDir;
    });

    const progressPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

    return (
        <>
            <style>{`
                @keyframes tqa-spin { to { transform: rotate(360deg); } }
                @keyframes tqa-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .tqa-trigger-btn:hover { background: #1D4ED8 !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.4) !important; }
                .tqa-close-btn:hover { background: #F1F5F9 !important; }
                .tqa-scan-btn:hover:not(:disabled) { background: #15803D !important; }
                .tqa-scan-btn:disabled { opacity: 0.55; cursor: not-allowed; }
                .tqa-rescan-btn:hover { background: #EFF6FF !important; }
                @media (max-width: 520px) {
                    .tqa-search-row { flex-direction: column !important; }
                }
            `}</style>

            <button className="tqa-trigger-btn btn" onClick={handleOpen} style={tqaStyles.triggerBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: "7px", flexShrink: 0 }}>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trend Analyzer
            </button>

            {open && (
                <div style={tqaStyles.overlay} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div style={tqaStyles.modal}>

                        {/* ── Modal Header ── */}
                        <div style={tqaStyles.modalHeader}>
                            <div>
                                <p style={tqaStyles.modalTitle}>Trend Persistence Analyzer</p>
                                <p style={tqaStyles.modalSubtitle}>
                                    Which stocks are likely to hold their trend based on company quality?
                                </p>
                            </div>
                            <button className="tqa-close-btn" style={tqaStyles.closeBtn} onClick={() => setOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div style={{ padding: "16px 22px 22px" }}>

                            {/* ── No cache yet ── */}
                            {storageLoading && (
                                <div style={tqaStyles.emptyState}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "tqa-spin 1s linear infinite" }}>
                                        <circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                    </svg>
                                    <span style={{ fontSize: "13px", color: "#64748B" }}>Loading saved results...</span>
                                </div>
                            )}

                            {!storageLoading && !stocks && !scanning && (
                                <div style={tqaStyles.emptyState}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="#CBD5E1" strokeWidth="1.5"/>
                                        <path d="M12 8v4l3 3" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <p style={{ fontSize: "14px", color: "#64748B", textAlign: "center", margin: "8px 0 0", lineHeight: 1.6 }}>
                                        No scan results yet. Run the scan once and results will be saved — you won't need to run it again unless you want fresh data.
                                    </p>
                                    <button className="tqa-scan-btn" onClick={runScan} style={tqaStyles.scanBtn}>
                                        🚀 Run Full Scan ({STOCK_LIST.length} stocks)
                                    </button>
                                </div>
                            )}

                            {/* ── Scanning progress ── */}
                            {scanning && (
                                <div style={tqaStyles.progressBox}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
                                            Scanning stocks... {progress.done}/{progress.total}
                                        </span>
                                        <span style={{ fontSize: "13px", color: "#64748B" }}>{progressPct}%</span>
                                    </div>
                                    <div style={{ height: "8px", backgroundColor: "#E2E8F0", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                                        <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #2563EB, #7C3AED)", borderRadius: "4px", transition: "width 0.3s ease" }} />
                                    </div>
                                    {progress.current && (
                                        <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Currently analyzing: <strong>{progress.current}</strong></p>
                                    )}
                                    <p style={{ fontSize: "11px", color: "#94A3B8", margin: "6px 0 0" }}>
                                        This runs once and saves automatically. Grab a coffee ☕
                                    </p>
                                </div>
                            )}

                            {/* ── Results ── */}
                            {stocks && !scanning && (
                                <div style={{ animation: "tqa-fadeUp 0.3s ease" }}>

                                    {/* Cache info + rescan */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                                            Last scanned: <strong>{cacheDate}</strong> · {stocks.length} stocks
                                        </span>
                                        <button className="tqa-rescan-btn" onClick={runScan} style={tqaStyles.rescanBtn}>
                                            ↻ Refresh
                                        </button>
                                    </div>

                                    {/* Narrative summary */}
                                    <NarrativeSummary stocks={stocks} />

                                    {/* Expandable searchable list */}
                                    <div style={{ marginTop: "16px" }}>
                                        <button
                                            onClick={() => setListOpen(v => !v)}
                                            style={tqaStyles.listToggleBtn}
                                        >
                                            <span style={{ fontWeight: "600", fontSize: "13px", color: "#0F172A" }}>
                                                {listOpen ? "▲" : "▼"} View All Stocks ({stocks.length})
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>click to {listOpen ? "collapse" : "expand"}</span>
                                        </button>

                                        {listOpen && (
                                            <div style={tqaStyles.listContainer}>
                                                {/* Search + filter row */}
                                                <div className="tqa-search-row" style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F1F5F9" }}>
                                                    <input
                                                        placeholder="Search symbol or keyword..."
                                                        value={search}
                                                        onChange={e => setSearch(e.target.value)}
                                                        style={{ ...tqaStyles.searchInput, flex: 1 }}
                                                    />
                                                    <select
                                                        value={filterDir}
                                                        onChange={e => setFilterDir(e.target.value)}
                                                        style={tqaStyles.filterSelect}
                                                    >
                                                        <option value="All">All Directions</option>
                                                        <option value="Bullish">▲ Bullish</option>
                                                        <option value="Bearish">▼ Bearish</option>
                                                    </select>
                                                </div>

                                                {/* Column headers */}
                                                <div style={{ display: "flex", padding: "6px 14px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                                                    <span style={{ width: "56px", fontSize: "10px", fontWeight: "700", color: "#94A3B8", flexShrink: 0 }}>SYMBOL</span>
                                                    <span style={{ width: "58px", fontSize: "10px", fontWeight: "700", color: "#94A3B8", flexShrink: 0 }}>TREND</span>
                                                    <span style={{ flex: 1, fontSize: "10px", fontWeight: "700", color: "#94A3B8" }}>PERSISTENCE LIKELIHOOD</span>
                                                    <span style={{ width: "40px", fontSize: "10px", fontWeight: "700", color: "#94A3B8", textAlign: "right", flexShrink: 0 }}>QUAL</span>
                                                    <span style={{ width: "20px", flexShrink: 0 }}></span>
                                                </div>

                                                {/* Rows */}
                                                <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                                                    {filtered.length === 0 && (
                                                        <p style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>No stocks match your search.</p>
                                                    )}
                                                    {filtered.map(stock => (
                                                        <StockRow
                                                            key={stock.symbol}
                                                            stock={stock}
                                                            expanded={!!expanded[stock.symbol]}
                                                            onToggle={() => setExpanded(p => ({ ...p, [stock.symbol]: !p[stock.symbol] }))}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {error && <div style={tqaStyles.errorBox}>{error}</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const tqaStyles = {
    triggerBtn: {
        display: "flex", alignItems: "center",
        background: "#2563EB", color: "#fff",
        border: "none", padding: "0.55rem 1.1rem",
        borderRadius: "6px", fontWeight: "600", fontSize: "13px",
        cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap",
        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
    },
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "16px",
    },
    modal: {
        background: "#fff", border: "1px solid #E2E8F0",
        borderRadius: "16px", width: "100%", maxWidth: "660px",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
        animation: "tqa-fadeUp 0.3s cubic-bezier(0.34,1.2,0.64,1)",
    },
    modalHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "20px 22px 16px", borderBottom: "1px solid #F1F5F9",
        position: "sticky", top: 0, background: "#fff", zIndex: 10,
    },
    modalTitle: { fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 },
    modalSubtitle: { fontSize: "12px", color: "#94A3B8", margin: "3px 0 0" },
    closeBtn: {
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        color: "#64748B", borderRadius: "8px", padding: "6px",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, transition: "all 0.15s",
    },
    emptyState: {
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "12px", padding: "32px 16px", textAlign: "center",
    },
    scanBtn: {
        background: "#16A34A", color: "#fff", border: "none",
        borderRadius: "8px", padding: "12px 24px",
        fontWeight: "700", fontSize: "14px", cursor: "pointer",
        transition: "background 0.2s", marginTop: "8px",
        boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
    },
    progressBox: {
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "12px", padding: "20px",
    },
    rescanBtn: {
        background: "#fff", border: "1px solid #E2E8F0",
        borderRadius: "6px", padding: "5px 12px",
        fontSize: "12px", fontWeight: "600", color: "#64748B",
        cursor: "pointer", transition: "background 0.15s",
    },
    narrative: {
        background: "#EFF6FF", border: "1px solid #BFDBFE",
        borderRadius: "12px", padding: "16px", marginBottom: "4px",
    },
    narrativeTitle: { fontSize: "12px", fontWeight: "700", color: "#2563EB", margin: "0 0 10px" },
    narrativePara: { fontSize: "13px", color: "#1E3A5F", margin: "0 0 10px", lineHeight: 1.7 },
    narrativeStats: {
        display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap",
    },
    narrativeStat: {
        borderRadius: "10px", padding: "8px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
        flex: "1 1 60px",
    },
    listToggleBtn: {
        width: "100%", background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "10px", padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", transition: "background 0.15s",
    },
    listContainer: {
        border: "1px solid #E2E8F0", borderRadius: "10px",
        overflow: "hidden", marginTop: "8px",
        animation: "tqa-fadeUp 0.2s ease",
    },
    searchInput: {
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "7px", padding: "7px 11px", fontSize: "13px",
        color: "#0F172A", outline: "none", boxSizing: "border-box",
    },
    filterSelect: {
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "7px", padding: "7px 11px", fontSize: "13px",
        color: "#0F172A", cursor: "pointer",
    },
    tierBadge: {
        borderRadius: "20px", padding: "3px 10px",
        fontSize: "10px", fontWeight: "700",
    },
    errorBox: {
        marginTop: "14px", background: "#FEF2F2", border: "1px solid #FECACA",
        borderRadius: "8px", padding: "10px 14px", color: "#DC2626", fontSize: "13px",
    },
};

// ─── Main IdeasSection ────────────────────────────────────────────────────────

export default function IdeasSection() {
    const [ideas, setIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState({
        idea_category: '',
        idea_text: '',
        idea_tracker: 'Pending'
    });
    const [editingIdea, setEditingIdea] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [expandedIdeas, setExpandedIdeas] = useState({});
    const maxLength = 100;

    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const toggleText = (ideaId) => {
        setExpandedIdeas(prev => ({
            ...prev,
            [ideaId]: !prev[ideaId]
        }));
    };

    const categoryOptions = [
        { value: '', label: 'Select a category...' },
        { value: 'Feature Ideas', label: 'Feature Ideas' },
        { value: 'Trading Strategies', label: 'Trading Strategies' },
        { value: 'AI Enhancements', label: 'AI Enhancements' }
    ];

    const statusOptions = [
        { value: 'All', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
    ];

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/fetch-ideas`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Failed to fetch ideas');
            const data = await response.json();
            setIdeas(data);
            setError(null);
        } catch (err) {
            setError('Error fetching ideas: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingIdea) {
            setEditingIdea(prev => ({ ...prev, [name]: value }));
        } else {
            setNewIdea(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingIdea) {
                const response = await fetch(`${baseUrl}/update-idea`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idea_id: editingIdea.id,
                        idea_category: editingIdea.idea_category,
                        idea_text: editingIdea.idea_text,
                        idea_tracker: editingIdea.idea_tracker
                    })
                });
                if (!response.ok) throw new Error('Failed to update idea');
                setEditingIdea(null);
            } else {
                const response = await fetch(`${baseUrl}/generate-idea`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIdea)
                });
                if (!response.ok) throw new Error('Failed to create idea');
                setNewIdea({ idea_category: '', idea_text: '', idea_tracker: 'Pending' });
            }
            setShowCreateForm(false);
            fetchIdeas();
            setError(null);
        } catch (err) {
            setError(`Error ${editingIdea ? 'updating' : 'creating'} idea: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCreateForm = () => {
        if (editingIdea) setEditingIdea(null);
        setShowCreateForm(!showCreateForm);
    };

    const startEditingIdea = (idea) => {
        setEditingIdea({...idea});
        setShowCreateForm(true);
        setShowUpdateStatus(null);
    };

    const cancelEditing = () => {
        setEditingIdea(null);
        setShowCreateForm(false);
    };

    const deleteIdea = async (ideaId) => {
        setDeletingId(ideaId);
        try {
            const response = await fetch(`${baseUrl}/delete-idea`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea_id: ideaId })
            });
            if (!response.ok) throw new Error('Failed to delete idea');
            setIdeas(ideas.filter(idea => idea.id !== ideaId));
            setError(null);
            setHoveredCard(null);
            setDeleteConfirm(null);
        } catch (err) {
            setError('Error deleting idea: ' + err.message);
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const updateIdeaTracker = async (ideaId, newStatus) => {
        setUpdatingStatus(true);
        try {
            setIdeas(ideas.map(idea =>
                idea.id === ideaId ? { ...idea, idea_tracker: newStatus, isUpdating: true } : idea
            ));
            const response = await fetch(`${baseUrl}/update-idea-tracker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea_id: ideaId, idea_tracker: newStatus })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update idea status');
            }
            setIdeas(ideas.map(idea =>
                idea.id === ideaId ? { ...idea, idea_tracker: newStatus, isUpdating: false } : idea
            ));
            setShowUpdateStatus(null);
            setError(null);
        } catch (err) {
            fetchIdeas();
            setError('Error updating idea status: ' + err.message);
            console.error('Update error:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const [hoveredCard, setHoveredCard] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const toggleStatusDropdown = (ideaId) => {
        setShowUpdateStatus(showUpdateStatus === ideaId ? null : ideaId);
    };

    const StatusDropdown = ({ ideaId }) => (
        <div style={styles.statusDropdown}>
            <div style={{ ...styles.statusOption, ...styles.statusOptionPending }} onClick={() => updateIdeaTracker(ideaId, 'Pending')}>Pending</div>
            <div style={{ ...styles.statusOption, ...styles.statusOptionInProgress }} onClick={() => updateIdeaTracker(ideaId, 'In Progress')}>In Progress</div>
            <div style={{ ...styles.statusOption, ...styles.statusOptionCompleted }} onClick={() => updateIdeaTracker(ideaId, 'Completed')}>Completed</div>
        </div>
    );

    const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
    const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);

    const filteredIdeas = ideas.filter(idea => {
        const statusMatch = statusFilter === 'All' || idea.idea_tracker === statusFilter;
        const categoryMatch = categoryFilter === 'All' || idea.idea_category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    const uniqueCategories = ['All', ...new Set(ideas.map(idea => idea.idea_category))];

    return (
        <div style={styles.container}>
            {/* ── Header on top ── */}
            <div className="header">
                <Header />
            </div>

            {/* ── SideNavs below header, no flex ── */}
            <SideNavs />

            {/* ── Main body content ── */}
            <div className="main-body-info">
                {/* Page title row + action buttons */}
                <div style={styles.header}>
                    <p style={styles.sectionTitle}>Ideas Hub</p>
                    <div style={styles.headerActions}>
                        <StockTrendModal />
                        <button
                            style={styles.createButton}
                            onClick={toggleCreateForm}
                            className="btn"
                        >
                            {showCreateForm ? 'Cancel' : '+ Create New Idea'}
                        </button>
                    </div>
                </div>

                {error && <div style={styles.errorAlert}>{error}</div>}

                {/* Create / Edit Form */}
                {showCreateForm && (
                    <div style={styles.formContainer}>
                        <p style={styles.formTitle}>{editingIdea ? 'Edit Idea' : 'Create New Idea'}</p>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_category">Category</label>
                                <select
                                    style={styles.input}
                                    id="idea_category"
                                    name="idea_category"
                                    value={editingIdea ? editingIdea.idea_category : newIdea.idea_category}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                >
                                    {categoryOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_text">Description</label>
                                <textarea
                                    style={styles.input}
                                    id="idea_text"
                                    name="idea_text"
                                    rows="3"
                                    value={editingIdea ? editingIdea.idea_text : newIdea.idea_text}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Describe your idea here..."
                                ></textarea>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="idea_tracker">Status</label>
                                <select
                                    style={styles.input}
                                    id="idea_tracker"
                                    name="idea_tracker"
                                    value={editingIdea ? editingIdea.idea_tracker : newIdea.idea_tracker}
                                    onChange={handleInputChange}
                                    className="form-control"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" style={styles.saveButton} className="btn" disabled={loading}>
                                {loading ? (editingIdea ? 'Updating...' : 'Saving...') : (editingIdea ? 'Update Idea' : 'Save Idea')}
                            </button>
                            <button type="button" style={styles.cancelButton} className="btn" onClick={editingIdea ? cancelEditing : toggleCreateForm}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Ideas List */}
                <div className="ideas-list">
                    <div style={styles.ideasListHeader}>
                        <p style={styles.ideasListTitle}>My Ideas</p>
                        <div style={styles.filtersContainer}>
                            <div style={styles.filterGroup}>
                                <label style={styles.filterLabel}>Status:</label>
                                <select style={styles.filterSelect} value={statusFilter} onChange={handleStatusFilterChange}>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.filterGroup}>
                                <label style={styles.filterLabel}>Category:</label>
                                <select style={styles.filterSelect} value={categoryFilter} onChange={handleCategoryFilterChange}>
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'All' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading && !editingIdea && !showCreateForm && (
                        <div style={styles.spinnerContainer}>
                            <div style={styles.spinner}></div>
                        </div>
                    )}

                    {!loading && filteredIdeas.length === 0 && (
                        <div style={styles.emptyState}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 9H9.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 9H15.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 14H16" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p style={styles.emptyStateText}>
                                {ideas.length === 0
                                    ? 'No ideas found. Click the "Create New Idea" button to get started!'
                                    : 'No ideas match the selected filters.'}
                            </p>
                        </div>
                    )}

                    <div>
                        {filteredIdeas.map(idea => (
                            <div key={idea.id}>
                                <div
                                    style={{
                                        ...styles.card,
                                        ...(hoveredCard === idea.id ? styles.cardHover : {})
                                    }}
                                    className="card"
                                    onMouseEnter={() => setHoveredCard(idea.id)}
                                    onMouseLeave={() => {
                                        if (deleteConfirm !== idea.id && showUpdateStatus !== idea.id) {
                                            setHoveredCard(null);
                                        }
                                    }}
                                >
                                    {/* Delete confirmation overlay */}
                                    {deleteConfirm === idea.id && (
                                        <div style={styles.deleteConfirm}>
                                            <p style={styles.deleteConfirmText}>Are you sure you want to delete this idea?</p>
                                            <div style={styles.deleteConfirmButtons}>
                                                <button
                                                    style={styles.deleteConfirmYes}
                                                    onClick={() => deleteIdea(idea.id)}
                                                    disabled={deletingId === idea.id}
                                                >
                                                    {deletingId === idea.id ? 'Deleting...' : 'Yes, Delete'}
                                                </button>
                                                <button style={styles.deleteConfirmNo} onClick={() => setDeleteConfirm(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div style={styles.cardHeader}>
                                        <p style={styles.cardTitle}>{idea.idea_category}</p>
                                        {hoveredCard === idea.id && !deleteConfirm && (
                                            <div style={styles.cardActions}>
                                                <button
                                                    style={{ ...styles.iconButton, ...styles.editButton }}
                                                    onClick={() => startEditingIdea(idea)}
                                                    title="Edit Idea"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    style={{ ...styles.iconButton, ...styles.deleteButton }}
                                                    onClick={() => setDeleteConfirm(idea.id)}
                                                    title="Delete Idea"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={styles.cardBody}>
                                        <p style={styles.cardText}>
                                            {expandedIdeas[idea.id] ? idea.idea_text :
                                                (idea.idea_text.length > maxLength ?
                                                    `${idea.idea_text.slice(0, maxLength)}...` :
                                                    idea.idea_text)
                                            }
                                            {idea.idea_text.length > maxLength && (
                                                <span style={styles.readMoreLink} onClick={() => toggleText(idea.id)}>
                                                    {expandedIdeas[idea.id] ? ' Read Less' : ' Read More'}
                                                </span>
                                            )}
                                        </p>
                                        <div style={styles.cardFooter}>
                                            <div style={{ position: 'relative' }}>
                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        ...(idea.isUpdating ? styles.badgeUpdating :
                                                            idea.idea_tracker === 'Completed' ? styles.badgeCompleted :
                                                            idea.idea_tracker === 'In Progress' ? styles.badgeInProgress :
                                                            styles.badgePending)
                                                    }}
                                                    onClick={() => toggleStatusDropdown(idea.id)}
                                                >
                                                    {idea.isUpdating ? 'Updating...' : idea.idea_tracker}
                                                    {idea.isUpdating && <div style={styles.pulseAnimation}></div>}
                                                </span>
                                                {showUpdateStatus === idea.id && !idea.isUpdating && (
                                                    <StatusDropdown ideaId={idea.id} />
                                                )}
                                            </div>
                                            <small style={styles.dateText}>
                                                {new Date(idea.created_at).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Original styles (unchanged) ─────────────────────────────────────────────
const styles = {
    readMoreLink: {
        color: '#007BFF', cursor: 'pointer', fontSize: '14px',
        fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px',
        transition: 'color 0.3s ease',
    },
    container: {
        fontFamily: "'Poppins', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '10px',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    sectionTitle: {
        fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', margin: 0
    },
    createButton: {
        backgroundColor: '#3498db', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    formContainer: {
        backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    formTitle: {
        fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.2rem', color: '#34495e'
    },
    formGroup: { marginBottom: '1.2rem' },
    label: {
        fontWeight: '500', marginBottom: '0.5rem', display: 'block', color: '#4a5568'
    },
    input: {
        width: '100%', padding: '0.6rem', borderRadius: '4px',
        border: '1px solid #cbd5e0', transition: 'border-color 0.2s ease', fontSize: '1rem'
    },
    saveButton: {
        backgroundColor: '#2ecc71', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        marginRight: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#95a5a6', color: 'white', border: 'none',
        padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer',
    },
    ideasListHeader: {
        fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', marginTop: '1.5rem',
        color: '#34495e', paddingBottom: '0.5rem', borderBottom: '1px solid #f0f0f0'
    },
    ideasListTitle: { margin: 0 },
    card: {
        borderRadius: '8px', border: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative', marginBottom: '20px',
    },
    cardHover: {
        transform: 'translateY(-5px)', boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
    },
    cardHeader: {
        backgroundColor: '#f8f9fa', borderBottom: '1px solid #f0f0f0',
        padding: '0.8rem 1rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
    },
    cardTitle: { fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#2c3e50' },
    cardActions: { display: 'flex', gap: '6px' },
    cardBody: {
        padding: '1rem', flex: '1 0 auto', display: 'flex', flexDirection: 'column'
    },
    cardText: { color: '#4a5568', marginBottom: '1rem', flex: '1 0 auto' },
    cardFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0'
    },
    badge: {
        padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: '500',
        fontSize: '0.75rem', cursor: 'pointer'
    },
    badgePending: { backgroundColor: 'rgba(247, 20, 247, 0.788)', color: 'white' },
    badgeInProgress: { backgroundColor: '#f39c12', color: 'white' },
    badgeCompleted: { backgroundColor: '#27ae60', color: 'white' },
    badgeUpdating: {
        backgroundColor: '#3498db', color: 'white', position: 'relative', overflow: 'hidden'
    },
    dateText: { fontSize: '0.75rem', color: '#718096' },
    spinnerContainer: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0'
    },
    spinner: {
        width: '2.5rem', height: '2.5rem', border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%', borderTopColor: '#3498db',
        animation: 'spin 1s ease-in-out infinite'
    },
    emptyState: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '1rem'
    },
    emptyStateText: {
        color: '#718096', fontWeight: '500', marginTop: '1rem', textAlign: 'center'
    },
    errorAlert: {
        backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem',
        borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #fecaca'
    },
    iconButton: {
        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
        padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s ease'
    },
    deleteButton: { color: '#e74c3c' },
    editButton: {
        color: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderRadius: '4px', padding: '4px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s ease',
    },
    statusDropdown: {
        top: '100%', left: '0', zIndex: 10, backgroundColor: 'white',
        borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '0.5rem 0', width: '150px',
    },
    statusOption: {
        padding: '0.5rem 1rem', cursor: 'pointer',
        transition: 'background-color 0.2s ease', fontSize: '0.9rem'
    },
    statusOptionPending: { color: '#718096' },
    statusOptionInProgress: { color: '#f39c12' },
    statusOptionCompleted: { color: '#27ae60' },
    deleteConfirm: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        zIndex: 10, padding: '1rem',
    },
    deleteConfirmText: {
        fontWeight: '500', marginBottom: '1rem', textAlign: 'center', color: '#2c3e50'
    },
    deleteConfirmButtons: { display: 'flex', gap: '0.8rem' },
    deleteConfirmYes: {
        backgroundColor: '#e74c3c', color: 'white', border: 'none',
        padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '500', cursor: 'pointer',
    },
    deleteConfirmNo: {
        backgroundColor: '#3498db', color: 'white', border: 'none',
        padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '500', cursor: 'pointer',
    },
    pulseAnimation: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        animation: 'pulse 1.5s infinite'
    },
    filtersContainer: {
        display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap'
    },
    filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    filterLabel: { fontWeight: 500, fontSize: '14px', color: '#4A5568' },
    filterSelect: {
        padding: '6px 10px', borderRadius: '4px', border: '1px solid #E2E8F0',
        backgroundColor: '#F7FAFC', fontSize: '14px', color: '#2D3748', minWidth: '150px'
    },
};
