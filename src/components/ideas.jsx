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
                                                {/* Search row */}
                                                <div style={{ padding: "10px 14px 6px", borderBottom: "none" }}>
                                                    <input
                                                        placeholder="Search symbol or keyword..."
                                                        value={search}
                                                        onChange={e => setSearch(e.target.value)}
                                                        style={{ ...tqaStyles.searchInput, width: "100%", boxSizing: "border-box" }}
                                                    />
                                                </div>
                                                {/* Filter row */}
                                                <div style={{ padding: "0 14px 10px", borderBottom: "1px solid #F1F5F9" }}>
                                                    <select
                                                        value={filterDir}
                                                        onChange={e => setFilterDir(e.target.value)}
                                                        style={{ ...tqaStyles.filterSelect, width: "100%" }}
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

// ─── Trend Age Analyzer ──────────────────────────────────────────────────────

const TIMEFRAMES = [
    { days: 15,  label: "15d" },
    { days: 20,  label: "20d" },
    { days: 30,  label: "30d" },
    { days: 45,  label: "45d" },
    { days: 60,  label: "60d" },
    { days: 90,  label: "90d" },
    { days: 180, label: "180d" },
];

function classifyTrendAge(r2s) {
    const short = r2s.slice(0, 3);
    const mid   = r2s.slice(3, 5);
    const long  = r2s.slice(5, 7);
    const avgShort = short.reduce((a, b) => a + b, 0) / short.length;
    const avgMid   = mid.reduce((a, b) => a + b, 0) / mid.length;
    const avgLong  = long.reduce((a, b) => a + b, 0) / long.length;

    if (avgShort > 0.55 && avgMid > 0.55 && avgLong > 0.55)
        return { age: "Mature", emoji: "💪", color: "#15803D", bg: "#DCFCE7", border: "#86EFAC",
            description: "Strong R² across all timeframes. This trend has been clean and consistent for a long time — well-established with strong institutional backing. High conviction, but watch for exhaustion signs.",
            action: "Strong hold. Trend has durability but may be late-stage for new entries." };
    if (avgShort > 0.50 && avgLong < 0.40)
        return { age: "Early / Young", emoji: "🌱", color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD",
            description: "R² is high on short timeframes but drops off on longer ones. The trend is clean and directional recently, but hasn't been running long enough to show up on higher timeframes. This is a relatively early-stage trend.",
            action: "Potentially high-upside entry if fundamentals support it. Trend is fresh." };
    if (avgShort < 0.35 && avgLong > 0.50)
        return { age: "Aging / Exhausting", emoji: "⏳", color: "#D97706", bg: "#FEF9C3", border: "#FDE047",
            description: "R² is high on longer timeframes but dropping on shorter ones. The big trend is there, but recent price action is getting choppy and losing direction. Classic late-stage behaviour — distribution or consolidation likely.",
            action: "Caution. The trend exists but is losing steam. Watch for reversal signals." };
    if (avgShort > 0.45 && avgMid > 0.40 && avgLong < 0.45)
        return { age: "Developing", emoji: "📈", color: "#7C3AED", bg: "#EDE9FE", border: "#C4B5FD",
            description: "R² is solid on short and mid timeframes but hasn't yet shown up on longer ones. The trend is building momentum — past the very early stage but not yet fully established.",
            action: "Good risk/reward if direction is confirmed. Trend is gaining credibility." };
    if (avgMid > 0.50 && avgShort < 0.40 && avgLong < 0.40)
        return { age: "Choppy / Consolidating", emoji: "〰️", color: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5",
            description: "R² is only meaningful at mid-range timeframes. Short-term is noisy and long-term has no clear direction. Likely in a consolidation phase or range-bound.",
            action: "Avoid trend-following. Wait for a breakout with improving R² across timeframes." };
    if (avgShort < 0.30 && avgMid < 0.30 && avgLong < 0.30)
        return { age: "No Clear Trend", emoji: "🔀", color: "#64748B", bg: "#F1F5F9", border: "#CBD5E1",
            description: "R² is low across all timeframes. Price action is essentially random — no sustained directional move exists at any measured timeframe.",
            action: "No trend to trade. This is a range or noise market." };
    return { age: "Mixed / Unclear", emoji: "🔍", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0",
        description: "R² pattern doesn't fit a clear trend-age profile. The stock shows inconsistent trend quality across timeframes — could be transitioning between phases.",
        action: "Monitor for clarity. Check back after a few more sessions." };
}

function R2Heatmap({ r2s }) {
    return (
        <div style={{ display: "flex", gap: "4px", alignItems: "flex-end" }}>
            {TIMEFRAMES.map((tf, i) => {
                const v = r2s[i] ?? 0;
                const pct = Math.round(v * 100);
                const col = v >= 0.6 ? "#15803D" : v >= 0.4 ? "#2563EB" : v >= 0.25 ? "#D97706" : "#DC2626";
                return (
                    <div key={tf.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", flex: 1 }}>
                        <span style={{ fontSize: "10px", fontWeight: "700", color: col }}>{pct}%</span>
                        <div style={{ width: "100%", height: "48px", background: "#F1F5F9", borderRadius: "4px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                            <div style={{ width: "100%", height: `${pct}%`, background: col, borderRadius: "4px", transition: "height 0.7s cubic-bezier(0.34,1.2,0.64,1)" }} />
                        </div>
                        <span style={{ fontSize: "9px", color: "#94A3B8" }}>{tf.label}</span>
                    </div>
                );
            })}
        </div>
    );
}


// ─── TradingView Lightweight Charts Component ─────────────────────────────────

const CHART_INTERVALS = [
    { label: "1m",  value: "1m"  },
    { label: "5m",  value: "5m"  },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1H",  value: "60m" },
    { label: "4H",  value: "240m"},
    { label: "1D",  value: "1d"  },
    { label: "1W",  value: "1wk" },
    { label: "1M",  value: "1mo" },
    { label: "3M",  value: "3mo" },
    { label: "6M",  value: "6mo" },
    { label: "1Y",  value: "1y"  },
    { label: "2Y",  value: "2y"  },
];

const CHART_THEMES = {
    light: {
        label: "☀️ Light",
        layout: { background: { color: "#ffffff" }, textColor: "#374151" },
        grid: { vertLines: { color: "#F3F4F6" }, horzLines: { color: "#F3F4F6" } },
        crosshair: { vertLine: { color: "#9CA3AF" }, horzLine: { color: "#9CA3AF" } },
        upColor: "#16A34A", downColor: "#DC2626",
        areaTopColor: "rgba(37,99,235,0.4)", areaBottomColor: "rgba(37,99,235,0.02)",
        lineColor: "#2563EB",
    },
    dark: {
        label: "🌙 Dark",
        layout: { background: { color: "#0F172A" }, textColor: "#94A3B8" },
        grid: { vertLines: { color: "#1E293B" }, horzLines: { color: "#1E293B" } },
        crosshair: { vertLine: { color: "#475569" }, horzLine: { color: "#475569" } },
        upColor: "#22C55E", downColor: "#EF4444",
        areaTopColor: "rgba(99,102,241,0.5)", areaBottomColor: "rgba(99,102,241,0.02)",
        lineColor: "#818CF8",
    },
    hud: {
        label: "💠 HUD",
        layout: { background: { color: "#020B18" }, textColor: "#38BDF8" },
        grid: { vertLines: { color: "rgba(56,189,248,0.08)" }, horzLines: { color: "rgba(56,189,248,0.08)" } },
        crosshair: { vertLine: { color: "rgba(56,189,248,0.6)" }, horzLine: { color: "rgba(56,189,248,0.6)" } },
        upColor: "#00E5FF", downColor: "#FF4C6A",
        areaTopColor: "rgba(0,229,255,0.35)", areaBottomColor: "rgba(0,229,255,0.01)",
        lineColor: "#00E5FF",
    },
};

// Load the TradingView lightweight-charts library once
let _tvLibLoaded = false;
let _tvLibLoading = false;
let _tvLibCallbacks = [];

function loadTVLib(cb) {
    if (_tvLibLoaded) { cb(); return; }
    _tvLibCallbacks.push(cb);
    if (_tvLibLoading) return;
    _tvLibLoading = true;
    const script = document.createElement("script");
    script.src = "https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js";
    script.onload = () => {
        _tvLibLoaded = true;
        _tvLibLoading = false;
        _tvLibCallbacks.forEach(fn => fn());
        _tvLibCallbacks = [];
    };
    document.head.appendChild(script);
}

function TradingViewChart({ symbol, theme = "light", chartType = "candle", interval = "1d", height = 320, onClose, fullscreenable = true }) {
    const { useEffect, useRef, useState } = React;
    const containerRef = useRef(null);  // the outer sizing div
    const canvasRef    = useRef(null);  // the div LightweightCharts renders into
    const chartRef     = useRef(null);
    const seriesRef    = useRef(null);

    const [localTheme,    setLocalTheme]    = useState(theme);
    const [localType,     setLocalType]     = useState(chartType);
    const [localInterval, setLocalInterval] = useState(interval);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [isFullscreen,  setIsFullscreen]  = useState(false);
    const [lastRefresh,   setLastRefresh]   = useState(null);

    const baseUrl = "https://backend-production-c0ab.up.railway.app";
    const th = CHART_THEMES[localTheme];

    // Always get exact pixel dimensions of the canvas container
    const getDims = () => {
        if (!canvasRef.current) return { w: 0, h: 0 };
        return { w: canvasRef.current.clientWidth, h: canvasRef.current.clientHeight };
    };

    const resizeChart = () => {
        if (!chartRef.current || !canvasRef.current) return;
        const { w, h } = getDims();
        if (w > 0 && h > 0) {
            // chart.resize() actually resizes the internal canvas — applyOptions does not
            chartRef.current.resize(w, h);
            chartRef.current.timeScale().fitContent();
        }
    };

    const fetchAndRender = async (sym, intv, type, themeKey) => {
        if (!canvasRef.current || !window.LightweightCharts) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}/ideas_hub_chart_data_v1`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: sym, interval: intv }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to fetch"); }
            const data = await res.json();

            const t = CHART_THEMES[themeKey];

            if (chartRef.current) {
                try { chartRef.current.remove(); } catch (_) {}
                chartRef.current = null;
                seriesRef.current = null;
            }

            const { w, h } = getDims();
            const chart = window.LightweightCharts.createChart(canvasRef.current, {
                width:  w || 600,
                height: h || height,
                layout: t.layout,
                grid:   t.grid,
                crosshair: { mode: 1, ...t.crosshair },
                rightPriceScale: { borderColor: t.grid.vertLines.color },
                timeScale: { borderColor: t.grid.vertLines.color, timeVisible: true, secondsVisible: false },
                handleScroll: true,
                handleScale: true,
            });
            chartRef.current = chart;

            let series;
            if (type === "candle") {
                series = chart.addCandlestickSeries({
                    upColor: t.upColor, downColor: t.downColor,
                    borderUpColor: t.upColor, borderDownColor: t.downColor,
                    wickUpColor: t.upColor, wickDownColor: t.downColor,
                });
                series.setData(data.ohlcv);
            } else if (type === "area") {
                series = chart.addAreaSeries({
                    topColor: t.areaTopColor, bottomColor: t.areaBottomColor,
                    lineColor: t.lineColor, lineWidth: 2,
                });
                series.setData(data.ohlcv.map(d => ({ time: d.time, value: d.close })));
            } else {
                series = chart.addLineSeries({ color: t.lineColor, lineWidth: 2 });
                series.setData(data.ohlcv.map(d => ({ time: d.time, value: d.close })));
            }
            seriesRef.current = series;
            chart.timeScale().fitContent();
            setLastRefresh(new Date().toLocaleTimeString());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Init
    useEffect(() => {
        loadTVLib(() => fetchAndRender(symbol, localInterval, localType, localTheme));
        return () => { if (chartRef.current) { try { chartRef.current.remove(); } catch (_) {} } };
    }, []);

    // Re-render on control changes
    useEffect(() => {
        if (_tvLibLoaded) fetchAndRender(symbol, localInterval, localType, localTheme);
    }, [localTheme, localType, localInterval]);

    // ResizeObserver on the OUTER container — fires when it changes size
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(() => {
            requestAnimationFrame(resizeChart);
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Fullscreen toggle — wait two rAF ticks for the fixed overlay to fully paint
    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(resizeChart));
    }, [isFullscreen]);

    const wrapStyle = isFullscreen ? {
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#000", display: "flex", flexDirection: "column",
        overflow: "hidden",
    } : {
        borderRadius: "10px", overflow: "hidden",
        border: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
    };

    const toolbarBg = localTheme === "light" ? "#F8FAFC" : localTheme === "dark" ? "#1E293B" : "#071120";
    const toolbarBorder = localTheme === "light" ? "#E2E8F0" : localTheme === "dark" ? "#334155" : "rgba(56,189,248,0.2)";
    const toolbarText = localTheme === "light" ? "#475569" : localTheme === "dark" ? "#94A3B8" : "#38BDF8";
    const activeBg = localTheme === "hud" ? "rgba(0,229,255,0.15)" : localTheme === "dark" ? "#334155" : "#E0E7FF";
    const activeText = localTheme === "hud" ? "#00E5FF" : localTheme === "dark" ? "#E2E8F0" : "#2563EB";

    const btnStyle = (active) => ({
        background: active ? activeBg : "transparent",
        color: active ? activeText : toolbarText,
        border: "none", borderRadius: "5px",
        padding: "3px 8px", fontSize: "11px", fontWeight: active ? "700" : "500",
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
    });

    const iconBtnStyle = {
        background: "transparent", border: "none", color: toolbarText,
        cursor: "pointer", padding: "3px 6px", borderRadius: "5px",
        display: "flex", alignItems: "center", fontSize: "14px", transition: "all 0.15s",
    };

    return (
        <div style={wrapStyle}>
            {/* ── Toolbar — single scrollable line in fullscreen to avoid pushing chart down ── */}
            <div style={{ background: toolbarBg, borderBottom: `1px solid ${toolbarBorder}`, padding: "6px 10px", display: "flex", alignItems: "center", gap: "4px", flexWrap: isFullscreen ? "nowrap" : "wrap", overflowX: isFullscreen ? "auto" : "visible", flexShrink: 0 }}>
                {/* Symbol label */}
                <span style={{ fontSize: "12px", fontWeight: "700", color: activeText, marginRight: "6px", fontFamily: "monospace" }}>{symbol}</span>

                {/* Divider */}
                <div style={{ width: "1px", height: "16px", background: toolbarBorder, margin: "0 4px" }} />

                {/* Chart type */}
                {[["candle","🕯️"],["area","〰"],["line","📈"]].map(([t, icon]) => (
                    <button key={t} style={btnStyle(localType === t)} onClick={() => setLocalType(t)} title={t}>{icon}</button>
                ))}

                <div style={{ width: "1px", height: "16px", background: toolbarBorder, margin: "0 4px" }} />

                {/* Interval pills — scrollable row */}
                <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
                    {CHART_INTERVALS.map(iv => (
                        <button key={iv.value} style={btnStyle(localInterval === iv.value)} onClick={() => setLocalInterval(iv.value)}>{iv.label}</button>
                    ))}
                </div>

                <div style={{ width: "1px", height: "16px", background: toolbarBorder, margin: "0 4px" }} />

                {/* Theme */}
                {Object.entries(CHART_THEMES).map(([k, v]) => (
                    <button key={k} style={btnStyle(localTheme === k)} onClick={() => setLocalTheme(k)}>{v.label}</button>
                ))}

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Refresh */}
                <button style={iconBtnStyle} onClick={() => fetchAndRender(symbol, localInterval, localType, localTheme)} title="Refresh">
                    ↻
                </button>

                {/* Fullscreen toggle */}
                {fullscreenable && (
                    <button style={iconBtnStyle} onClick={() => setIsFullscreen(f => !f)} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                        {isFullscreen ? "⊠" : "⛶"}
                    </button>
                )}

                {/* Close (when used inline in expanded rows) */}
                {onClose && (
                    <button style={{ ...iconBtnStyle, color: "#EF4444" }} onClick={onClose} title="Close chart">✕</button>
                )}
            </div>

            {/* ── Chart container — flex:1 in fullscreen fills all remaining space, explicit px otherwise ── */}
            <div style={{ position: "relative", width: "100%", ...(isFullscreen ? { flex: 1, minHeight: 0 } : { height: `${height}px` }) }}>
                {loading && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: th.layout.background.color, zIndex: 5, gap: "10px" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "ta-spin 1s linear infinite" }}>
                            <circle cx="12" cy="12" r="10" stroke={th.lineColor || "#2563EB"} strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                        </svg>
                        <span style={{ fontSize: "12px", color: th.layout.textColor }}>Loading chart data...</span>
                    </div>
                )}
                {error && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: th.layout.background.color, zIndex: 5 }}>
                        <span style={{ fontSize: "12px", color: "#EF4444" }}>⚠ {error}</span>
                    </div>
                )}
                <div ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
            </div>

            {/* ── Status bar ── */}
            {lastRefresh && !isFullscreen && (
                <div style={{ background: toolbarBg, borderTop: `1px solid ${toolbarBorder}`, padding: "3px 10px" }}>
                    <span style={{ fontSize: "10px", color: toolbarText }}>Last updated: {lastRefresh}</span>
                </div>
            )}
        </div>
    );
}


function TrendAgeModal() {
    const [open, setOpen]       = useState(false);
    const [tab, setTab]         = useState("single");   // "single" | "bulk"

    // Single analysis state
    const [symbol, setSymbol]           = useState("");
    const [customSymbol, setCustomSymbol] = useState("");
    const [loading, setLoading]         = useState(false);
    const [result, setResult]           = useState(null);
    const [singleError, setSingleError] = useState(null);

    // Bulk scan state
    const TA_BULK_CACHE_KEY = "ideas_hub_trend_age_bulk_v1";
    const [bulkStocks, setBulkStocks]       = useState(null);
    const [bulkDate, setBulkDate]           = useState(null);
    const [scanning, setScanning]           = useState(false);
    const [progress, setProgress]           = useState({ done: 0, total: 0, current: "" });
    const [cacheLoading, setCacheLoading]   = useState(false);
    const [bulkError, setBulkError]         = useState(null);
    const [search, setSearch]               = useState("");
    const [filterAge, setFilterAge]         = useState("All");
    const [filterDir, setFilterDir]         = useState("All");
    const [expanded, setExpanded]           = useState({});
    const [chartOpen, setChartOpen]         = useState({});   // which rows have chart open
    const [infoOpen, setInfoOpen]           = useState({});   // which rows have info popover open
    const [infoData, setInfoData]           = useState({});   // cached info per symbol
    const [infoLoading, setInfoLoading]     = useState({});   // loading state per symbol
    const [filterMcap, setFilterMcap]       = useState("All"); // market cap filter

    // ── Velocity tab state ──────────────────────────────────────────────────
    const VV_CACHE_KEY = "ideas_hub_velocity_bulk_v1";
    const [vvSymbol,      setVvSymbol]      = useState("");
    const [vvCustom,      setVvCustom]      = useState("");
    const [vvResult,      setVvResult]      = useState(null);
    const [vvLoading,     setVvLoading]     = useState(false);
    const [vvError,       setVvError]       = useState(null);
    const [vvBulk,        setVvBulk]        = useState(null);   // bulk velocity results
    const [vvBulkDate,    setVvBulkDate]    = useState("");
    const [vvScanning,    setVvScanning]    = useState(false);
    const [vvProgress,    setVvProgress]    = useState({ done: 0, total: 0 });
    const [vvCacheLoading,setVvCacheLoading]= useState(false);
    const [vvBulkError,   setVvBulkError]  = useState(null);
    const [vvSortBy,      setVvSortBy]      = useState("opp_score");  // opp_score | rvol | velocity_score
    const [vvFilterSig,   setVvFilterSig]   = useState("All");
    const [vvSearch,      setVvSearch]      = useState("");
    const [vvChartOpen,   setVvChartOpen]   = useState({});   // per-row chart toggle in velocity bulk
    const [vvLegendOpen,  setVvLegendOpen]  = useState(false); // signal legend panel
    const [allChartsMode, setAllChartsMode] = useState(false); // global all-charts view
    const [globalChartType,     setGlobalChartType]     = useState("candle");
    const [globalChartTheme,    setGlobalChartTheme]    = useState("light");
    const [globalChartInterval, setGlobalChartInterval] = useState("1d");

    const baseUrl = "https://backend-production-c0ab.up.railway.app";

    // ── Load cache when opening bulk tab ──────────────────────────────────────
    const loadBulkCache = async () => {
        setCacheLoading(true);
        try {
            const res = await window.storage.get(TA_BULK_CACHE_KEY);
            if (res && res.value) {
                const parsed = JSON.parse(res.value);
                setBulkStocks(parsed.stocks);
                setBulkDate(parsed.date);
            }
        } catch (_) {}
        finally { setCacheLoading(false); }
    };

    const handleOpen = () => {
        setOpen(true);
        if (!bulkStocks) loadBulkCache();
    };

    // ── Single analysis ───────────────────────────────────────────────────────
    const analyzeSingle = async () => {
        const ticker = (customSymbol.trim() || symbol).toUpperCase();
        if (!ticker) { setSingleError("Please select or enter a symbol."); return; }
        setLoading(true); setResult(null); setSingleError(null);
        try {
            const res = await fetch(`${baseUrl}/ideas_hub_trend_age_analysis_v1`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: ticker }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
            setResult(await res.json());
        } catch (e) { setSingleError(e.message); }
        finally { setLoading(false); }
    };

    // ── Bulk scan ─────────────────────────────────────────────────────────────
    const runBulkScan = async () => {
        setScanning(true); setBulkError(null);
        setProgress({ done: 0, total: STOCK_LIST.length, current: "" });
        const results = [];
        const BATCH = 5;
        for (let i = 0; i < STOCK_LIST.length; i += BATCH) {
            const batch = STOCK_LIST.slice(i, i + BATCH);
            await Promise.all(batch.map(async (sym) => {
                try {
                    const res = await fetch(`${baseUrl}/ideas_hub_trend_age_analysis_v1`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ symbol: sym }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const cl = classifyTrendAge(data.r2_by_timeframe.map(t => t.r2));
                        const mcap = data.market_cap || 0;
                        const mcTier = mcap >= 200e9 ? "Mega" : mcap >= 10e9 ? "Large" : mcap >= 2e9 ? "Mid" : mcap >= 300e6 ? "Small" : "Micro/Nano";
                        results.push({
                            symbol:     data.symbol,
                            name:       data.name || data.symbol,
                            direction:  data.direction,
                            age:        cl.age,
                            emoji:      cl.emoji,
                            color:      cl.color,
                            bg:         cl.bg,
                            border:     cl.border,
                            action:     cl.action,
                            short_avg:  data.short_avg_r2,
                            mid_avg:    data.mid_avg_r2,
                            long_avg:   data.long_avg_r2,
                            avg_r2:     Math.round(data.r2_by_timeframe.reduce((a,b) => a + b.r2, 0) / data.r2_by_timeframe.length * 100),
                            r2s:        data.r2_by_timeframe.map(t => t.r2),
                            market_cap: mcap,
                            mc_tier:    mcTier,
                            sector:     data.sector || "",
                            price:      data.current_price || 0,
                        });
                    }
                } catch (_) {}
                setProgress(p => ({ ...p, done: p.done + 1, current: sym }));
            }));
        }
        results.sort((a, b) => b.avg_r2 - a.avg_r2);
        const payload = { stocks: results, date: new Date().toLocaleString() };
        try { await window.storage.set(TA_BULK_CACHE_KEY, JSON.stringify(payload)); } catch (_) {}
        setBulkStocks(results); setBulkDate(payload.date); setScanning(false);
    };

    // ── Velocity functions ───────────────────────────────────────────────────
    const analyzeSingleVelocity = async () => {
        const ticker = (vvCustom.trim() || vvSymbol).toUpperCase();
        if (!ticker) { setVvError("Please select or enter a symbol."); return; }
        setVvLoading(true); setVvResult(null); setVvError(null);
        try {
            // Pass r2_avg from bulk cache if available
            const cached = bulkStocks ? bulkStocks.find(s => s.symbol === ticker) : null;
            const r2_avg = cached ? (cached.avg_r2 / 100) : 0;
            const res = await fetch(`${baseUrl}/ideas_hub_volume_velocity_v1`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: ticker, r2_avg }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
            setVvResult(await res.json());
        } catch(e) { setVvError(e.message); }
        finally { setVvLoading(false); }
    };

    // Load cached velocity bulk results on mount
    React.useEffect(() => {
        if (tab !== "velocity" || vvBulk || vvScanning) return;
        (async () => {
            setVvCacheLoading(true);
            try {
                const cached = await window.storage.get(VV_CACHE_KEY);
                if (cached) {
                    const p = JSON.parse(cached.value);
                    setVvBulk(p.stocks); setVvBulkDate(p.date);
                }
            } catch(_) {}
            finally { setVvCacheLoading(false); }
        })();
    }, [tab]);

    const runVelocityBulkScan = async () => {
        setVvScanning(true); setVvBulkError(null);
        setVvProgress({ done: 0, total: STOCK_LIST.length });
        const results = [];
        const BATCH = 5;
        for (let i = 0; i < STOCK_LIST.length; i += BATCH) {
            const batch = STOCK_LIST.slice(i, i + BATCH);
            await Promise.all(batch.map(async (sym) => {
                try {
                    const cached = bulkStocks ? bulkStocks.find(s => s.symbol === sym) : null;
                    const r2_avg = cached ? (cached.avg_r2 / 100) : 0;
                    const res = await fetch(`${baseUrl}/ideas_hub_volume_velocity_v1`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ symbol: sym, r2_avg }),
                    });
                    if (res.ok) {
                        const d = await res.json();
                        // Merge in trend age data from bulk cache
                        const ta = bulkStocks ? bulkStocks.find(s => s.symbol === sym) : null;
                        results.push({
                            symbol:         sym,
                            name:           ta?.name || sym,
                            // velocity data
                            rvol:           d.rvol,
                            rvol_fmt:       d.rvol_fmt,
                            velocity_score: d.velocity_score,
                            opp_score:      d.opp_score,
                            ad_score:       d.ad_score,
                            vol_slope_pct:  d.vol_slope_pct,
                            price_velocity: d.price_velocity,
                            dollar_liq_fmt: d.dollar_liq_fmt,
                            signal:         d.signal,
                            vol_bars:       d.vol_bars,
                            // trend age from cache
                            direction:      ta?.direction || "—",
                            age:            ta?.age || "—",
                            age_emoji:      ta?.emoji || "—",
                            age_color:      ta?.color || "#94A3B8",
                            avg_r2:         ta?.avg_r2 || 0,
                        });
                    }
                } catch(_) {}
                setVvProgress(p => ({ ...p, done: p.done + 1 }));
            }));
        }
        results.sort((a, b) => b.opp_score - a.opp_score);
        const payload = { stocks: results, date: new Date().toLocaleString() };
        try { await window.storage.set(VV_CACHE_KEY, JSON.stringify(payload)); } catch(_) {}
        setVvBulk(results); setVvBulkDate(payload.date); setVvScanning(false);
    };

    const vvFiltered = (vvBulk || [])
        .filter(s => {
            const mSig    = vvFilterSig === "All" || s.signal?.label === vvFilterSig;
            const mSearch = !vvSearch || s.symbol.includes(vvSearch.toUpperCase()) || (s.name||"").toLowerCase().includes(vvSearch.toLowerCase());
            return mSig && mSearch;
        })
        .sort((a, b) => b[vvSortBy] - a[vvSortBy]);

    // ── Derived ───────────────────────────────────────────────────────────────
    const cl     = result ? classifyTrendAge(result.r2_by_timeframe.map(t => t.r2)) : null;
    const avgR2  = result ? Math.round(result.r2_by_timeframe.reduce((a,b) => a + b.r2, 0) / result.r2_by_timeframe.length * 100) : 0;
    const progPct = progress.total > 0 ? Math.round(progress.done / progress.total * 100) : 0;

    const AGE_OPTIONS = ["All","Early / Young","Developing","Mature","Aging / Exhausting","Choppy / Consolidating","No Clear Trend","Mixed / Unclear"];

    const MCAP_TIERS = [
        { label: "All Caps",   value: "All" },
        { label: "🏔 Mega",    value: "Mega",       min: 200e9,  max: Infinity },
        { label: "🔵 Large",   value: "Large",      min: 10e9,   max: 200e9    },
        { label: "🟡 Mid",     value: "Mid",         min: 2e9,    max: 10e9     },
        { label: "🟠 Small",   value: "Small",      min: 300e6,  max: 2e9      },
        { label: "⚪ Micro",   value: "Micro/Nano", min: 0,      max: 300e6    },
    ];

    const filtered = (bulkStocks || []).filter(s => {
        const mSearch = s.symbol.includes(search.toUpperCase()) || s.age.toLowerCase().includes(search.toLowerCase()) || (s.name || "").toLowerCase().includes(search.toLowerCase());
        const mAge    = filterAge === "All" || s.age === filterAge;
        const mDir    = filterDir === "All" || s.direction === filterDir;
        const mCap    = filterMcap === "All" || s.mc_tier === filterMcap;
        return mSearch && mAge && mDir && mCap;
    });

    const fetchInfo = async (sym) => {
        if (infoData[sym] || infoLoading[sym]) return;
        setInfoLoading(p => ({ ...p, [sym]: true }));
        try {
            const res = await fetch(baseUrl + "/ideas_hub_stock_info_v1", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol: sym }),
            });
            if (res.ok) {
                const d = await res.json();
                setInfoData(p => ({ ...p, [sym]: d }));
            }
        } catch (_) {}
        finally { setInfoLoading(p => ({ ...p, [sym]: false })); }
    };

    // ── Bulk stats summary ────────────────────────────────────────────────────
    const bulkSummary = bulkStocks ? (() => {
        const counts = {};
        AGE_OPTIONS.slice(1).forEach(a => { counts[a] = bulkStocks.filter(s => s.age === a).length; });
        return counts;
    })() : null;

    return (
        <>
            <style>{`
                @keyframes ta-spin { to { transform: rotate(360deg); } }
                @keyframes ta-fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .ta-trigger-btn:hover { background: #6D28D9 !important; transform: translateY(-1px); }
                .ta-analyze-btn:hover:not(:disabled) { background: #1D4ED8 !important; }
                .ta-analyze-btn:disabled { opacity: 0.55; cursor: not-allowed; }
                .ta-close-btn:hover { background: #F1F5F9 !important; }
                .ta-tab:hover { background: #F1F5F9 !important; }
                .ta-scan-btn:hover:not(:disabled) { background: #6D28D9 !important; }
                .ta-rescan-btn:hover { background: #EFF6FF !important; }
                .ta-bulk-row:hover { background: #F8FAFC !important; }

                /* ── Row layout ── */
                .ta-row { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-bottom: 1px solid #F1F5F9; cursor: pointer; transition: background 0.1s; flex-wrap: nowrap; }
                .ta-row-left { display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; }
                .ta-row-symbol { font-size: 12px; font-weight: 700; color: #0F172A; white-space: nowrap; min-width: 40px; }
                .ta-row-age { display: flex; align-items: center; gap: 4px; min-width: 0; }
                .ta-row-age-text { font-size: 10px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
                .ta-row-spark { display: flex; gap: 2px; align-items: flex-end; height: 20px; width: 56px; flex-shrink: 0; }
                .ta-row-bands { display: flex; gap: 6px; flex-shrink: 0; }
                .ta-row-band { font-size: 11px; font-weight: 700; width: 34px; text-align: center; }
                .ta-row-btns { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }
                .ta-col-headers { display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; }

                /* expanded panels */
                .ta-expanded-wrap { display: grid; grid-template-columns: 220px 1fr; border-bottom: 1px solid #F1F5F9; background: #F8FAFC; }
                .ta-expanded-wrap.chart-closed { grid-template-columns: 1fr; }
                .ta-stats-panel { padding: 12px; border-right: 1px solid #E2E8F0; }
                .ta-expanded-wrap.chart-closed .ta-stats-panel { border-right: none; }
                .ta-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px; }

                /* ── Mobile ── */
                @media (max-width: 600px) {
                    .ta-controls { grid-template-columns: 1fr !important; }
                    /* hide band columns on mobile — show in expanded only */
                    .ta-row-bands { display: none; }
                    /* sparkline narrower */
                    .ta-row-spark { width: 40px; }
                    /* age text shorter */
                    .ta-row-age-text { max-width: 64px; }
                    /* stacked expanded panels */
                    .ta-expanded-wrap { grid-template-columns: 1fr !important; }
                    .ta-expanded-wrap .ta-stats-panel { border-right: none; border-bottom: 1px solid #E2E8F0; }
                    /* info grid 2 cols on mobile */
                    .ta-info-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    /* col headers hide band labels */
                    .ta-col-band-label { display: none; }
                }
                @media (max-width: 400px) {
                    .ta-row-spark { display: none; }
                    .ta-row-age-text { max-width: 50px; }
                    .ta-info-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            <button className="ta-trigger-btn btn" onClick={handleOpen} style={taStyles.triggerBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: "7px", flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Trend Age
            </button>

            {open && (
                <div style={taStyles.overlay} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div style={{ ...taStyles.modal, maxWidth: tab === "bulk" ? "860px" : tab === "velocity" ? "900px" : "580px" }}>

                        {/* ── Header ── */}
                        <div style={taStyles.header}>
                            <div>
                                <p style={taStyles.title}>Trend Age Analyzer</p>
                                <p style={taStyles.subtitle}>Where is a trend in its lifecycle — single stock or full bulk scan?</p>
                            </div>
                            <button className="ta-close-btn" style={taStyles.closeBtn} onClick={() => setOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* ── Tabs ── */}
                        <div style={taStyles.tabRow}>
                            {[["single","🔍 Single Stock"],["bulk","📊 Bulk Scan"],["velocity","⚡ Velocity"]].map(([t, label]) => (
                                <button key={t} className="ta-tab" onClick={() => setTab(t)}
                                    style={{ ...taStyles.tab, ...(tab === t ? taStyles.tabActive : {}) }}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div style={{ padding: "16px 22px 22px" }}>

                            {/* ════════════════ SINGLE TAB ════════════════ */}
                            {tab === "single" && (
                                <>
                                    <div className="ta-controls" style={taStyles.controls}>
                                        <div style={taStyles.controlGroup}>
                                            <label style={taStyles.ctrlLabel}>Select Stock</label>
                                            <select style={taStyles.select} value={symbol} onChange={e => { setSymbol(e.target.value); setCustomSymbol(""); }}>
                                                <option value="">-- Choose from list --</option>
                                                {STOCK_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div style={taStyles.controlGroup}>
                                            <label style={taStyles.ctrlLabel}>Or Type Symbol</label>
                                            <input style={taStyles.input} placeholder="e.g. NVDA, TSLA..."
                                                value={customSymbol} onChange={e => { setCustomSymbol(e.target.value.toUpperCase()); setSymbol(""); }} />
                                        </div>
                                        <button className="ta-analyze-btn" style={taStyles.analyzeBtn} onClick={analyzeSingle} disabled={loading}>
                                            {loading ? (
                                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "ta-spin 1s linear infinite" }}>
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                                    </svg>
                                                    Analyzing 7 timeframes...
                                                </span>
                                            ) : "Analyze Trend Age →"}
                                        </button>
                                    </div>

                                    {singleError && <div style={taStyles.errorBox}>{singleError}</div>}

                                    {result && cl && (
                                        <div style={{ animation: "ta-fadeUp 0.3s ease" }}>
                                            <div style={{ ...taStyles.heroCard, background: cl.bg, borderColor: cl.border }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                                                    <div>
                                                        <div style={{ fontSize: "26px", lineHeight: 1 }}>{cl.emoji}</div>
                                                        <div style={{ fontSize: "22px", fontWeight: "800", color: cl.color, marginTop: "5px" }}>{cl.age}</div>
                                                        <div style={{ display: "flex", gap: "7px", marginTop: "8px", flexWrap: "wrap" }}>
                                                            <span style={{ ...taStyles.badge, background: result.direction === "Bullish" ? "#DCFCE7" : "#FEE2E2", color: result.direction === "Bullish" ? "#15803D" : "#B91C1C" }}>
                                                                {result.direction === "Bullish" ? "▲" : "▼"} {result.direction}
                                                            </span>
                                                            <span style={{ ...taStyles.badge, background: "#F1F5F9", color: "#475569" }}>{result.symbol}</span>
                                                            <span style={{ ...taStyles.badge, background: "#F1F5F9", color: "#475569" }}>Avg R²: {avgR2}%</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: "36px" }}>
                                                        {cl.age === "Mature" ? "🔝" : cl.age === "Early / Young" ? "🚀" : cl.age === "Aging / Exhausting" ? "📉" : cl.age === "Developing" ? "📊" : "🔀"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={taStyles.section}>
                                                <p style={taStyles.sectionLabel}>R² by Timeframe</p>
                                                <R2Heatmap r2s={result.r2_by_timeframe.map(t => t.r2)} />
                                                <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                                                    {[["≥60%","#15803D","Strong"],["40-59%","#2563EB","Moderate"],["25-39%","#D97706","Weak"],["<25%","#DC2626","Noise"]].map(([r,c,l]) => (
                                                        <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: c }} />
                                                            <span style={{ fontSize: "10px", color: "#64748B" }}>{r} = {l}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={taStyles.insightBox}>
                                                <p style={taStyles.insightTitle}>🔍 What this means</p>
                                                <p style={taStyles.insightText}>{cl.description}</p>
                                            </div>
                                            <div style={{ ...taStyles.insightBox, background: "#F0FDF4", borderColor: "#BBF7D0", marginBottom: "16px" }}>
                                                <p style={{ ...taStyles.insightTitle, color: "#15803D" }}>⚡ What to do</p>
                                                <p style={taStyles.insightText}>{cl.action}</p>
                                            </div>

                                            <div style={taStyles.section}>
                                                <p style={taStyles.sectionLabel}>Per-Timeframe Detail</p>
                                                <div style={{ border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 70px 90px", padding: "7px 14px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                                                        {["Period","R² Bar","R²","Direction"].map(h => (
                                                            <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase" }}>{h}</span>
                                                        ))}
                                                    </div>
                                                    {result.r2_by_timeframe.map((tf, i) => {
                                                        const pct = Math.round(tf.r2 * 100);
                                                        const col = tf.r2 >= 0.6 ? "#15803D" : tf.r2 >= 0.4 ? "#2563EB" : tf.r2 >= 0.25 ? "#D97706" : "#DC2626";
                                                        return (
                                                            <div key={tf.label} style={{ display: "grid", gridTemplateColumns: "60px 1fr 70px 90px", padding: "9px 14px", borderBottom: i < result.r2_by_timeframe.length - 1 ? "1px solid #F1F5F9" : "none", alignItems: "center" }}>
                                                                <span style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A" }}>{tf.label}</span>
                                                                <div style={{ height: "6px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden", marginRight: "12px" }}>
                                                                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: "3px" }} />
                                                                </div>
                                                                <span style={{ fontSize: "12px", fontWeight: "700", color: col }}>{pct}%</span>
                                                                <span style={{ fontSize: "11px", fontWeight: "600", color: tf.direction === "Bullish" ? "#15803D" : "#B91C1C" }}>
                                                                    {tf.direction === "Bullish" ? "▲" : "▼"} {tf.direction}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ════════════════ BULK TAB ════════════════ */}
                            {tab === "bulk" && (
                                <>
                                    {cacheLoading && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "20px 0", color: "#64748B", fontSize: "13px" }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "ta-spin 1s linear infinite" }}>
                                                <circle cx="12" cy="12" r="10" stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                            </svg>
                                            Loading saved results...
                                        </div>
                                    )}

                                    {!cacheLoading && !bulkStocks && !scanning && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "28px 0", textAlign: "center" }}>
                                            <div style={{ fontSize: "40px" }}>🕐</div>
                                            <p style={{ fontSize: "14px", color: "#64748B", margin: 0, lineHeight: 1.6 }}>
                                                No bulk scan yet. Run it once and results are cached — open the modal instantly next time.
                                            </p>
                                            <button className="ta-scan-btn" onClick={runBulkScan} style={taStyles.scanBtn}>
                                                🚀 Run Bulk Trend Age Scan ({STOCK_LIST.length} stocks)
                                            </button>
                                        </div>
                                    )}

                                    {scanning && (
                                        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>Scanning... {progress.done}/{progress.total}</span>
                                                <span style={{ fontSize: "13px", color: "#64748B" }}>{progPct}%</span>
                                            </div>
                                            <div style={{ height: "8px", background: "#E2E8F0", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                                                <div style={{ height: "100%", width: `${progPct}%`, background: "linear-gradient(90deg, #7C3AED, #2563EB)", borderRadius: "4px", transition: "width 0.3s ease" }} />
                                            </div>
                                            {progress.current && <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Analyzing: <strong>{progress.current}</strong></p>}
                                        </div>
                                    )}

                                    {bulkStocks && !scanning && (
                                        <div style={{ animation: "ta-fadeUp 0.3s ease" }}>

                                            {/* Cache bar + View All Charts */}
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                                                <span style={{ fontSize: "11px", color: "#94A3B8" }}>Last scanned: <strong>{bulkDate}</strong> · {bulkStocks.length} stocks</span>
                                                <div style={{ display: "flex", gap: "6px" }}>
                                                    <button onClick={() => setAllChartsMode(m => !m)} style={{ background: allChartsMode ? "#7C3AED" : "#fff", color: allChartsMode ? "#fff" : "#7C3AED", border: "1px solid #7C3AED", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}>
                                                        {allChartsMode ? "📊 Hide All Charts" : "📊 View All Charts"}
                                                    </button>
                                                    <button className="ta-rescan-btn" onClick={runBulkScan} style={taStyles.rescanBtn}>↻ Refresh</button>
                                                </div>
                                            </div>

                                            {/* Global chart controls — shown when allChartsMode is on */}
                                            {allChartsMode && (
                                                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                                                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Global chart settings:</span>
                                                    <div style={{ display: "flex", gap: "3px" }}>
                                                        {[["candle","🕯️"],["area","〰"],["line","📈"]].map(([t,icon]) => (
                                                            <button key={t} onClick={() => setGlobalChartType(t)} style={{ background: globalChartType === t ? "#7C3AED" : "#fff", color: globalChartType === t ? "#fff" : "#475569", border: "1px solid #E2E8F0", borderRadius: "5px", padding: "3px 8px", fontSize: "11px", cursor: "pointer" }}>{icon} {t}</button>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: "flex", gap: "3px" }}>
                                                        {Object.entries(CHART_THEMES).map(([k,v]) => (
                                                            <button key={k} onClick={() => setGlobalChartTheme(k)} style={{ background: globalChartTheme === k ? "#7C3AED" : "#fff", color: globalChartTheme === k ? "#fff" : "#475569", border: "1px solid #E2E8F0", borderRadius: "5px", padding: "3px 8px", fontSize: "11px", cursor: "pointer" }}>{v.label}</button>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                                                        {CHART_INTERVALS.map(iv => (
                                                            <button key={iv.value} onClick={() => setGlobalChartInterval(iv.value)} style={{ background: globalChartInterval === iv.value ? "#7C3AED" : "#fff", color: globalChartInterval === iv.value ? "#fff" : "#475569", border: "1px solid #E2E8F0", borderRadius: "5px", padding: "3px 7px", fontSize: "10px", cursor: "pointer" }}>{iv.label}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Age distribution chips */}
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "16px" }}>
                                                {Object.entries(bulkSummary).filter(([,v]) => v > 0).map(([age, count]) => {
                                                    const sample = bulkStocks.find(s => s.age === age);
                                                    return (
                                                        <div key={age} onClick={() => setFilterAge(filterAge === age ? "All" : age)}
                                                            style={{ background: filterAge === age ? sample?.bg : "#F8FAFC", border: `1px solid ${filterAge === age ? sample?.border : "#E2E8F0"}`, borderRadius: "20px", padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.15s" }}>
                                                            <span style={{ fontSize: "12px" }}>{sample?.emoji}</span>
                                                            <span style={{ fontSize: "11px", fontWeight: "600", color: filterAge === age ? sample?.color : "#475569" }}>{age}</span>
                                                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>{count}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Search + direction filter */}
                                            <div style={{ marginBottom: "10px" }}>
                                                <input placeholder="Search symbol or name..." value={search} onChange={e => setSearch(e.target.value)}
                                                    style={{ ...taStyles.input, width: "100%", boxSizing: "border-box", marginBottom: "7px" }} />
                                                <select value={filterDir} onChange={e => setFilterDir(e.target.value)} style={{ ...taStyles.select, width: "100%", marginBottom: "10px" }}>
                                                    <option value="All">All Directions</option>
                                                    <option value="Bullish">▲ Bullish</option>
                                                    <option value="Bearish">▼ Bearish</option>
                                                </select>
                                                {/* Market cap filter chips */}
                                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginRight: "2px" }}>Mkt Cap:</span>
                                                    {MCAP_TIERS.map(tier => (
                                                        <button key={tier.value} onClick={() => setFilterMcap(filterMcap === tier.value ? "All" : tier.value)}
                                                            style={{ background: filterMcap === tier.value ? "#0F172A" : "#F8FAFC", color: filterMcap === tier.value ? "#fff" : "#475569", border: `1px solid ${filterMcap === tier.value ? "#0F172A" : "#E2E8F0"}`, borderRadius: "20px", padding: "4px 11px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                                                            {tier.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Results list */}
                                            <div style={{ border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                                                {/* ── Stock table — always visible ── */}
                                                {/* Column headers */}
                                                <div className="ta-col-headers">
                                                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", minWidth: "40px" }}>Symbol</span>
                                                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", flex: 1 }}>Age</span>
                                                    <span style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", width: "56px", flexShrink: 0 }}>R² Shape</span>
                                                    <span className="ta-col-band-label" style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", width: "34px", textAlign: "center", flexShrink: 0 }}>S</span>
                                                    <span className="ta-col-band-label" style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", width: "34px", textAlign: "center", flexShrink: 0 }}>M</span>
                                                    <span className="ta-col-band-label" style={{ fontSize: "9px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", width: "34px", textAlign: "center", flexShrink: 0 }}>L</span>
                                                    <span style={{ width: "68px", flexShrink: 0 }} />
                                                </div>

                                                <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                                                    {filtered.length === 0 && (
                                                        <p style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>No stocks match your filters.</p>
                                                    )}
                                                    {filtered.map(stock => (
                                                        <div key={stock.symbol}>
                                                            {/* ── Row — flexbox, wraps gracefully on mobile ── */}
                                                            <div className="ta-row ta-bulk-row"
                                                                onClick={() => setExpanded(p => ({ ...p, [stock.symbol]: !p[stock.symbol] }))}>

                                                                {/* Left: symbol + age */}
                                                                <div className="ta-row-left">
                                                                    <span className="ta-row-symbol">{stock.symbol}</span>
                                                                    <div className="ta-row-age">
                                                                        <span style={{ fontSize: "13px", lineHeight: 1 }}>{stock.emoji}</span>
                                                                        <span className="ta-row-age-text" style={{ color: stock.color }}>{stock.age.split("/")[0].trim()}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Sparkline */}
                                                                <div className="ta-row-spark">
                                                                    {stock.r2s.map((v, i) => {
                                                                        const barH = Math.max(3, Math.round(v * 20));
                                                                        const c = v >= 0.6 ? "#15803D" : v >= 0.4 ? "#2563EB" : v >= 0.25 ? "#D97706" : "#DC2626";
                                                                        return <div key={i} style={{ flex: 1, height: `${barH}px`, background: c, borderRadius: "2px" }} />;
                                                                    })}
                                                                </div>

                                                                {/* Band averages — hidden on small mobile via CSS */}
                                                                <div className="ta-row-bands">
                                                                    {[stock.short_avg, stock.mid_avg, stock.long_avg].map((v, i) => {
                                                                        const pct = Math.round(v * 100);
                                                                        const c = v >= 0.6 ? "#15803D" : v >= 0.4 ? "#2563EB" : v >= 0.25 ? "#D97706" : "#DC2626";
                                                                        return <span key={i} className="ta-row-band" style={{ color: c }}>{pct}%</span>;
                                                                    })}
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="ta-row-btns" onClick={e => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => { fetchInfo(stock.symbol); setInfoOpen(p => ({ ...p, [stock.symbol]: !p[stock.symbol] })); }}
                                                                        title="Stock info"
                                                                        style={{ background: infoOpen[stock.symbol] ? "#0EA5E9" : "transparent", border: "1px solid", borderColor: infoOpen[stock.symbol] ? "#0EA5E9" : "#E2E8F0", borderRadius: "5px", padding: "4px 7px", cursor: "pointer", fontSize: "11px", color: infoOpen[stock.symbol] ? "#fff" : "#64748B", transition: "all 0.15s", fontWeight: "700", lineHeight: 1 }}>
                                                                        ℹ
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setChartOpen(p => ({ ...p, [stock.symbol]: !p[stock.symbol] }))}
                                                                        title="Toggle chart"
                                                                        style={{ background: chartOpen[stock.symbol] ? "#7C3AED" : "transparent", border: "1px solid", borderColor: chartOpen[stock.symbol] ? "#7C3AED" : "#E2E8F0", borderRadius: "5px", padding: "4px 7px", cursor: "pointer", fontSize: "12px", color: chartOpen[stock.symbol] ? "#fff" : "#64748B", transition: "all 0.15s", lineHeight: 1 }}>
                                                                        📈
                                                                    </button>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 0.2s", transform: expanded[stock.symbol] ? "rotate(180deg)" : "rotate(0)", flexShrink: 0, cursor: "pointer" }} onClick={() => setExpanded(p => ({ ...p, [stock.symbol]: !p[stock.symbol] }))}>
                                                                        <polyline points="6 9 12 15 18 9" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    </svg>
                                                                </div>
                                                            </div>

                                                            {/* ── Info panel ── */}
                                                            {infoOpen[stock.symbol] && (
                                                                <div style={{ borderBottom: "1px solid #F1F5F9", background: "#F0F9FF", animation: "ta-fadeUp 0.15s ease" }}>
                                                                    {infoLoading[stock.symbol] && (
                                                                        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "8px", color: "#0EA5E9", fontSize: "12px" }}>
                                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "ta-spin 1s linear infinite" }}>
                                                                                <circle cx="12" cy="12" r="10" stroke="#0EA5E9" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                                                            </svg>
                                                                            Loading info for {stock.symbol}...
                                                                        </div>
                                                                    )}
                                                                    {infoData[stock.symbol] && (() => {
                                                                        const d = infoData[stock.symbol];
                                                                        const chg = d.day_change_pct || 0;
                                                                        const chgColor = chg >= 0 ? "#15803D" : "#B91C1C";
                                                                        return (
                                                                            <div style={{ padding: "12px 14px" }}>
                                                                                {/* Header row */}
                                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                                                                                    <div>
                                                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                                            <span style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>{d.name}</span>
                                                                                            <span style={{ fontSize: "10px", color: "#94A3B8" }}>{d.exchange}</span>
                                                                                        </div>
                                                                                        <div style={{ display: "flex", gap: "6px", marginTop: "5px", flexWrap: "wrap" }}>
                                                                                            <span style={{ background: "#0EA5E9", color: "#fff", borderRadius: "20px", padding: "2px 9px", fontSize: "10px", fontWeight: "700" }}>{d.market_cap_tier}</span>
                                                                                            <span style={{ background: "#F1F5F9", color: "#475569", borderRadius: "20px", padding: "2px 9px", fontSize: "10px" }}>{d.sector}</span>
                                                                                            <span style={{ background: "#F1F5F9", color: "#475569", borderRadius: "20px", padding: "2px 9px", fontSize: "10px" }}>{d.industry}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style={{ textAlign: "right" }}>
                                                                                        <div style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A" }}>${d.price}</div>
                                                                                        <div style={{ fontSize: "12px", fontWeight: "600", color: chgColor }}>{chg >= 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Info grid */}
                                                                                <div className="ta-info-grid">
                                                                                    {[
                                                                                        ["Mkt Cap",    d.market_cap_fmt],
                                                                                        ["P/E (TTM)",  d.pe_trailing],
                                                                                        ["P/E (Fwd)",  d.pe_forward],
                                                                                        ["Revenue",    d.revenue],
                                                                                        ["Rev Growth", d.revenue_growth],
                                                                                        ["Net Margin", d.net_margin],
                                                                                        ["Gross Margin",d.gross_margin],
                                                                                        ["ROE",        d.roe],
                                                                                        ["D/E Ratio",  d.debt_to_equity],
                                                                                        ["EPS (TTM)",  d.eps_trailing],
                                                                                        ["EPS (Fwd)",  d.eps_forward],
                                                                                        ["Free CF",    d.free_cashflow],
                                                                                        ["52W High",   d.week_52_high],
                                                                                        ["52W Low",    d.week_52_low],
                                                                                        ["Div Yield",  d.dividend_yield],
                                                                                    ].map(([label, val]) => (
                                                                                        <div key={label} style={{ background: "#fff", borderRadius: "7px", padding: "6px 8px", border: "1px solid #E0F2FE" }}>
                                                                                            <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.4px" }}>{label}</div>
                                                                                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A", marginTop: "1px" }}>{val || "N/A"}</div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>

                                                                                {/* Analyst row */}
                                                                                <div style={{ background: "#fff", border: "1px solid #E0F2FE", borderRadius: "8px", padding: "8px 10px", marginBottom: "8px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                                                                                    <div>
                                                                                        <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Analyst Rating</div>
                                                                                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0EA5E9", marginTop: "1px" }}>{d.recommendation}</div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Target (Mean)</div>
                                                                                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>${d.target_mean}</div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Range</div>
                                                                                        <div style={{ fontSize: "12px", color: "#475569" }}>${d.target_low} – ${d.target_high}</div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div style={{ fontSize: "9px", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>Analysts</div>
                                                                                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>{d.num_analysts}</div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Description */}
                                                                                {d.description && (
                                                                                    <p style={{ fontSize: "11px", color: "#475569", margin: 0, lineHeight: 1.65, borderTop: "1px solid #E0F2FE", paddingTop: "8px" }}>
                                                                                        {d.description}
                                                                                        {d.website && <> · <a href={d.website} target="_blank" rel="noopener noreferrer" style={{ color: "#0EA5E9" }}>{d.website.replace("https://","")}</a></>}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}

                                                            {/* ── Expanded: stats LEFT + chart RIGHT (stacks on mobile) ── */}
                                                            {(expanded[stock.symbol] || chartOpen[stock.symbol]) && (
                                                                <div style={{ animation: "ta-fadeUp 0.15s ease" }}>
                                                                    <div className={`ta-expanded-wrap${chartOpen[stock.symbol] ? "" : " chart-closed"}`}>

                                                                        {/* LEFT — trend age stats */}
                                                                        <div className="ta-stats-panel">
                                                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                                                                <span style={{ ...taStyles.badge, background: stock.direction === "Bullish" ? "#DCFCE7" : "#FEE2E2", color: stock.direction === "Bullish" ? "#15803D" : "#B91C1C", fontSize: "10px" }}>
                                                                                    {stock.direction === "Bullish" ? "▲" : "▼"} {stock.direction}
                                                                                </span>
                                                                                <span style={{ ...taStyles.badge, background: stock.bg, color: stock.color, border: `1px solid ${stock.border}`, fontSize: "10px" }}>
                                                                                    {stock.emoji} {stock.age}
                                                                                </span>
                                                                                <span style={{ ...taStyles.badge, background: "#F1F5F9", color: "#475569", fontSize: "10px" }}>
                                                                                    Avg R²: {stock.avg_r2}%
                                                                                </span>
                                                                            </div>
                                                                            <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 10px", lineHeight: 1.6 }}>{stock.action}</p>
                                                                            {/* Per-TF breakdown */}
                                                                            <div style={{ display: "flex", gap: "4px" }}>
                                                                                {TIMEFRAMES.map((tf, i) => {
                                                                                    const v = stock.r2s[i] ?? 0;
                                                                                    const pct = Math.round(v * 100);
                                                                                    const c = v >= 0.6 ? "#15803D" : v >= 0.4 ? "#2563EB" : v >= 0.25 ? "#D97706" : "#DC2626";
                                                                                    return (
                                                                                        <div key={tf.label} style={{ flex: 1, textAlign: "center" }}>
                                                                                            <div style={{ fontSize: "9px", fontWeight: "700", color: c }}>{pct}%</div>
                                                                                            <div style={{ height: "3px", background: "#E2E8F0", borderRadius: "2px", margin: "3px 0", overflow: "hidden" }}>
                                                                                                <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: "2px" }} />
                                                                                            </div>
                                                                                            <div style={{ fontSize: "8px", color: "#94A3B8" }}>{tf.label}</div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>

                                                                        {/* RIGHT — chart (only when chartOpen) */}
                                                                        {chartOpen[stock.symbol] && (
                                                                            <div>
                                                                                <TradingViewChart
                                                                                    symbol={stock.symbol}
                                                                                    theme="light"
                                                                                    chartType="candle"
                                                                                    interval="1d"
                                                                                    height={220}
                                                                                    fullscreenable={true}
                                                                                    onClose={() => setChartOpen(p => ({ ...p, [stock.symbol]: false }))}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* ── All-charts grid — BELOW the table, visible alongside it ── */}
                                                {allChartsMode && filtered.length > 0 && (
                                                    <div style={{ borderTop: "2px solid #E2E8F0" }}>
                                                        <div style={{ padding: "10px 12px 6px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#7C3AED" }}>📊 All Charts — {filtered.length} stocks</span>
                                                            <span style={{ fontSize: "10px", color: "#94A3B8" }}>Showing {filtered.length} charts · use filters above to narrow</span>
                                                        </div>
                                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "10px", padding: "10px 12px 14px", maxHeight: "65vh", overflowY: "auto" }}>
                                                            {filtered.map(stock => (
                                                                <div key={stock.symbol}>
                                                                    {/* Mini stats strip above each chart */}
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                                                                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A" }}>{stock.symbol}</span>
                                                                        <span style={{ fontSize: "11px" }}>{stock.emoji}</span>
                                                                        <span style={{ fontSize: "10px", fontWeight: "600", color: stock.color }}>{stock.age}</span>
                                                                        <span style={{ fontSize: "10px", color: stock.direction === "Bullish" ? "#15803D" : "#B91C1C", fontWeight: "600" }}>
                                                                            {stock.direction === "Bullish" ? "▲" : "▼"} {stock.direction}
                                                                        </span>
                                                                        <span style={{ fontSize: "10px", color: "#94A3B8", marginLeft: "auto" }}>R²avg: {stock.avg_r2}%</span>
                                                                    </div>
                                                                    <TradingViewChart
                                                                        key={`${stock.symbol}-${globalChartTheme}-${globalChartType}-${globalChartInterval}`}
                                                                        symbol={stock.symbol}
                                                                        theme={globalChartTheme}
                                                                        chartType={globalChartType}
                                                                        interval={globalChartInterval}
                                                                        height={240}
                                                                        fullscreenable={true}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {bulkError && <div style={{ ...taStyles.errorBox, marginTop: "12px" }}>{bulkError}</div>}
                                </>
                            )}

                            {/* ════════════════ VELOCITY TAB ════════════════ */}
                            {tab === "velocity" && (
                                <div style={{ animation: "ta-fadeUp 0.2s ease" }}>

                                    {/* ── Header explanation ── */}
                                    <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", borderRadius: "12px", padding: "16px 18px", marginBottom: "18px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "22px" }}>⚡</span>
                                            <span style={{ fontSize: "15px", fontWeight: "800", color: "#fff" }}>Volume & Velocity Analyser</span>
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: 1.7 }}>
                                            R² tells you <em style={{ color: "#C4B5FD" }}>direction quality</em>. Volume tells you <em style={{ color: "#67E8F9" }}>conviction behind the move</em>.<br/>
                                            <strong style={{ color: "#fff" }}>High R² + High RVOL + Accumulation = institutional money confirming the trend.</strong> That's where you want to be.
                                        </p>
                                        <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                                            {[
                                                ["RVOL", "Today's vol ÷ 20-day avg. >1.5x = elevated"],
                                                ["Velocity", "Normalised daily price movement %"],
                                                ["A/D Score", "% of high-vol days that closed up vs down"],
                                                ["Opp Score", "R² × 40% + Velocity × 35% + A/D × 25%"],
                                            ].map(([k, v]) => (
                                                <div key={k} style={{ flex: "1 1 160px" }}>
                                                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.5px" }}>{k}</div>
                                                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{v}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Signal legend ── */}
                                    <div style={{ marginBottom: "14px" }}>
                                        <button onClick={() => setVvLegendOpen(o => !o)}
                                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: "0", marginBottom: vvLegendOpen ? "10px" : "0" }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ transition: "transform 0.2s", transform: vvLegendOpen ? "rotate(180deg)" : "rotate(0)" }}>
                                                <polyline points="6 9 12 15 18 9" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#60A5FA" }}>
                                                {vvLegendOpen ? "Hide" : "Show"} signal guide — what do these classifications mean?
                                            </span>
                                        </button>

                                        {vvLegendOpen && (
                                            <div style={{ background: "#F8FAFF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "14px 16px", animation: "ta-fadeUp 0.15s ease" }}>
                                                <p style={{ fontSize: "11px", color: "#60A5FA", fontWeight: "700", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Signal Classifications — Quick Reference</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                    {[
                                                        { emoji:"🔥", label:"High Conviction",   color:"#15803D", bg:"#DCFCE7", border:"#86EFAC",
                                                          when:"R² high + RVOL ≥1.4x + A/D ≥55%",
                                                          meaning:"Institutions confirming the trend. Strong clarity + elevated volume + accumulation dominant.",
                                                          action:"Best setup. Look for entries on pullbacks. Size up." },
                                                        { emoji:"🚀", label:"Breakout Watch",     color:"#7C3AED", bg:"#EDE9FE", border:"#C4B5FD",
                                                          when:"RVOL ≥2.0x + R² still low/early",
                                                          meaning:"Volume spiking before trend forms. Classic early breakout pattern — institutions accumulating before the move is obvious.",
                                                          action:"Don't chase. Wait for R² to rise over next few sessions then confirm entry." },
                                                        { emoji:"📈", label:"Building Momentum",  color:"#2563EB", bg:"#DBEAFE", border:"#93C5FD",
                                                          when:"Opp score ≥55 + RVOL ≥1.1x",
                                                          meaning:"Moderate trend + above-average volume. Pieces assembling but not at full conviction yet.",
                                                          action:"Add to watchlist. If RVOL and R² both rise next scan, consider entry." },
                                                        { emoji:"⚠️", label:"Divergence",          color:"#D97706", bg:"#FEF9C3", border:"#FDE047",
                                                          when:"R² ≥0.55 + RVOL <0.8x",
                                                          meaning:"Clean price trend but volume drying up. Trend running out of fuel — price moves but fewer participants behind it.",
                                                          action:"Tighten stops. Don't add. Watch for volume to return or price to break structure." },
                                                        { emoji:"🌊", label:"Distribution",        color:"#DC2626", bg:"#FEE2E2", border:"#FCA5A5",
                                                          when:"RVOL ≥1.3x + A/D <35%",
                                                          meaning:"High volume but concentrated on down days. Smart money selling into strength (distributing to retail). Classic topping pattern.",
                                                          action:"Avoid longs. Reduce existing positions. High reversal risk." },
                                                        { emoji:"😴", label:"Low Activity",        color:"#64748B", bg:"#F1F5F9", border:"#CBD5E1",
                                                          when:"RVOL <0.7x + Velocity <35",
                                                          meaning:"Below-average volume, low price movement. No institutional interest visible. Market asleep.",
                                                          action:"Skip. Deploy capital elsewhere. Revisit when volume picks up." },
                                                        { emoji:"🔍", label:"Mixed / Noise",       color:"#64748B", bg:"#F8FAFC", border:"#E2E8F0",
                                                          when:"No dominant pattern",
                                                          meaning:"Metrics don't tell a coherent story. Could be transitioning between phases or reacting to a one-off event.",
                                                          action:"No edge. Wait for a cleaner signal." },
                                                    ].map(s => (
                                                        <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "10px", padding: "10px 12px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap", marginBottom: "4px" }}>
                                                                <span style={{ fontSize: "16px" }}>{s.emoji}</span>
                                                                <span style={{ fontSize: "12px", fontWeight: "800", color: s.color }}>{s.label}</span>
                                                                <span style={{ fontSize: "10px", background: "rgba(0,0,0,0.06)", color: s.color, borderRadius: "4px", padding: "1px 7px", fontWeight: "600", fontFamily: "monospace" }}>{s.when}</span>
                                                            </div>
                                                            <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 3px", lineHeight: 1.55 }}>{s.meaning}</p>
                                                            <p style={{ fontSize: "11px", color: s.color, fontWeight: "700", margin: 0 }}>→ {s.action}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p style={{ fontSize: "10px", color: "#93C5FD", margin: "10px 0 0", lineHeight: 1.6 }}>
                                                    <strong>Opp Score formula:</strong> R²avg × 40% + Velocity Score × 35% + A/D Score × 25% — all normalised 0–100. Run R² Bulk Scan first for best accuracy.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Single stock section ── */}
                                    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "14px 16px", marginBottom: "18px" }}>
                                        <p style={{ fontSize: "12px", fontWeight: "700", color: "#1D4ED8", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                                            🔍 <span>Single Stock Analysis</span>
                                        </p>
                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
                                            <select value={vvSymbol} onChange={e => { setVvSymbol(e.target.value); setVvCustom(""); }}
                                                style={{ ...taStyles.select, flex: "1 1 140px" }}>
                                                <option value="">-- Choose stock --</option>
                                                {STOCK_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <input placeholder="Or type symbol..." value={vvCustom}
                                                onChange={e => { setVvCustom(e.target.value.toUpperCase()); setVvSymbol(""); }}
                                                style={{ ...taStyles.input, flex: "1 1 120px" }} />
                                            <button onClick={analyzeSingleVelocity} disabled={vvLoading}
                                                style={{ background: "#0F172A", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", opacity: vvLoading ? 0.6 : 1 }}>
                                                {vvLoading ? "Analyzing..." : "⚡ Analyze →"}
                                            </button>
                                        </div>
                                        {vvError && <div style={{ ...taStyles.errorBox, marginTop: "10px" }}>{vvError}</div>}

                                        {/* Single result card */}
                                        {vvResult && (() => {
                                            const d = vvResult;
                                            const sig = d.signal;
                                            const maxVol = Math.max(...d.vol_bars.map(b => b.vol), 1);
                                            return (
                                                <div style={{ marginTop: "14px", animation: "ta-fadeUp 0.2s ease" }}>
                                                    {/* Signal hero */}
                                                    <div style={{ background: sig.bg, border: `1px solid ${sig.border}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                                                <span style={{ fontSize: "20px" }}>{sig.emoji}</span>
                                                                <span style={{ fontSize: "16px", fontWeight: "800", color: sig.color }}>{sig.label}</span>
                                                                <span style={{ fontSize: "11px", background: "#0F172A", color: "#fff", borderRadius: "20px", padding: "2px 8px", fontWeight: "700" }}>{d.symbol}</span>
                                                            </div>
                                                            <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.6, maxWidth: "480px" }}>{sig.detail}</p>
                                                        </div>
                                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                            <div style={{ fontSize: "28px", fontWeight: "900", color: sig.color, lineHeight: 1 }}>{Math.round(d.opp_score)}</div>
                                                            <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase" }}>Opp Score /100</div>
                                                        </div>
                                                    </div>

                                                    {/* Metric grid */}
                                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                                                        {[
                                                            ["⚡ RVOL",         d.rvol_fmt,                    d.rvol >= 2 ? "#15803D" : d.rvol >= 1.4 ? "#2563EB" : d.rvol < 0.7 ? "#DC2626" : "#475569"],
                                                            ["📊 Vol Score",    `${Math.round(d.velocity_score)}/100`,  d.velocity_score >= 65 ? "#15803D" : d.velocity_score >= 40 ? "#2563EB" : "#DC2626"],
                                                            ["🎯 A/D Score",    `${Math.round(d.ad_score)}%`,   d.ad_score >= 60 ? "#15803D" : d.ad_score <= 40 ? "#DC2626" : "#475569"],
                                                            ["📈 Price Vel.",   `${d.price_velocity.toFixed(2)}%/day`, d.price_velocity >= 1.5 ? "#7C3AED" : "#475569"],
                                                            ["📉 Vol Trend",    d.vol_slope_pct >= 0.5 ? "Rising ▲" : d.vol_slope_pct <= -0.5 ? "Falling ▼" : "Flat →", d.vol_slope_pct >= 0.5 ? "#15803D" : d.vol_slope_pct <= -0.5 ? "#DC2626" : "#94A3B8"],
                                                            ["💧 Liquidity",    d.dollar_liq_fmt,              "#2563EB"],
                                                        ].map(([label, val, color]) => (
                                                            <div key={label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "8px 10px" }}>
                                                                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: "700", marginBottom: "3px" }}>{label}</div>
                                                                <div style={{ fontSize: "14px", fontWeight: "800", color }}>{val}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Volume sparkline — 20 bars */}
                                                    <div style={{ background: "#0F172A", borderRadius: "10px", padding: "12px 14px" }}>
                                                        <div style={{ fontSize: "10px", color: "#475569", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>20-Day Volume Profile</div>
                                                        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "48px" }}>
                                                            {d.vol_bars.map((b, i) => {
                                                                const h = Math.max(4, Math.round((b.vol / maxVol) * 48));
                                                                const col = b.vs_avg >= 1.5 ? (b.is_up ? "#00E5FF" : "#FF4C6A") : b.is_up ? "#22C55E" : "#EF4444";
                                                                return (
                                                                    <div key={i} title={`${b.vs_avg.toFixed(1)}x avg`}
                                                                        style={{ flex: 1, height: `${h}px`, background: col, borderRadius: "2px 2px 0 0", opacity: b.vs_avg >= 1.0 ? 1 : 0.5 }} />
                                                                );
                                                            })}
                                                        </div>
                                                        <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                                                            {[["🟢 Up + high vol = Accumulation","#22C55E"],["🔴 Down + high vol = Distribution","#EF4444"],["🔵 Spike (1.5x+)","#00E5FF"]].map(([label,c]) => (
                                                                <span key={label} style={{ fontSize: "10px", color: "#475569" }}>{label}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* ── Bulk scan section ── */}
                                    <div style={{ border: "1px solid #BFDBFE", borderRadius: "12px", overflow: "hidden" }}>
                                        {/* Bulk header */}
                                        <div style={{ background: "#F8FAFC", padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                            <div>
                                                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>📊 Bulk Velocity Scan</span>
                                                {vvBulkDate && <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: "8px" }}>Last: {vvBulkDate}</span>}
                                                {!bulkStocks && <span style={{ fontSize: "11px", color: "#F59E0B", marginLeft: "8px" }}>⚠ Run the Bulk Scan (R² tab) first for best Opp Scores</span>}
                                            </div>
                                            <button onClick={runVelocityBulkScan} disabled={vvScanning}
                                                style={{ background: vvScanning ? "#E2E8F0" : "#0F172A", color: vvScanning ? "#94A3B8" : "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: "700", cursor: vvScanning ? "not-allowed" : "pointer" }}>
                                                {vvScanning ? `Scanning ${vvProgress.done}/${vvProgress.total}...` : (vvBulk ? "↻ Refresh" : `⚡ Run Velocity Scan (${STOCK_LIST.length} stocks)`)}
                                            </button>
                                        </div>

                                        {/* Progress bar */}
                                        {vvScanning && (
                                            <div style={{ padding: "10px 16px", background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
                                                <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${Math.round(vvProgress.done / Math.max(vvProgress.total,1) * 100)}%`, background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", borderRadius: "3px", transition: "width 0.3s" }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Cache loading */}
                                        {vvCacheLoading && (
                                            <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "10px", color: "#1D4ED8", fontSize: "13px" }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "ta-spin 1s linear infinite" }}>
                                                    <circle cx="12" cy="12" r="10" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10"/>
                                                </svg>
                                                Loading saved results...
                                            </div>
                                        )}

                                        {/* Empty state */}
                                        {!vvCacheLoading && !vvBulk && !vvScanning && (
                                            <div style={{ padding: "32px", textAlign: "center" }}>
                                                <div style={{ fontSize: "36px", marginBottom: "10px" }}>⚡</div>
                                                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 14px", lineHeight: 1.6 }}>
                                                    Scan all {STOCK_LIST.length} stocks for RVOL, velocity and opportunity scores.<br/>
                                                    Results are cached — opens instantly next time.
                                                </p>
                                                <button onClick={runVelocityBulkScan}
                                                    style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 22px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                                                    ⚡ Run Velocity Scan ({STOCK_LIST.length} stocks)
                                                </button>
                                            </div>
                                        )}

                                        {/* Results */}
                                        {vvBulk && !vvScanning && (
                                            <div>
                                                {/* Signal filter chips */}
                                                <div style={{ padding: "10px 14px 0", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                    {["All","High Conviction","Breakout Watch","Building Momentum","Divergence ⚠","Distribution","Low Activity"].map(sig => {
                                                        const count = sig === "All" ? vvBulk.length : vvBulk.filter(s => s.signal?.label === sig).length;
                                                        if (sig !== "All" && count === 0) return null;
                                                        const sigData = vvBulk.find(s => s.signal?.label === sig)?.signal;
                                                        const isActive = vvFilterSig === sig;
                                                        return (
                                                            <button key={sig} onClick={() => setVvFilterSig(isActive ? "All" : sig)}
                                                                style={{ background: isActive ? (sigData?.bg || "#0F172A") : "#F8FAFC", color: isActive ? (sigData?.color || "#fff") : "#475569", border: `1px solid ${isActive ? (sigData?.border || "#0F172A") : "#E2E8F0"}`, borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}>
                                                                {sig === "All" ? "All" : (vvBulk.find(s=>s.signal?.label===sig)?.signal?.emoji||"")} {sig} · {count}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Search + sort */}
                                                <div style={{ padding: "10px 14px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #EFF6FF" }}>
                                                    <input placeholder="Search symbol..." value={vvSearch} onChange={e => setVvSearch(e.target.value)}
                                                        style={{ ...taStyles.input, flex: "1 1 140px" }} />
                                                    <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                                        <span style={{ fontSize: "11px", color: "#94A3B8", alignSelf: "center", whiteSpace: "nowrap" }}>Sort by:</span>
                                                        {[["opp_score","🎯 Opp"],["rvol","⚡ RVOL"],["velocity_score","📊 Vel"],["ad_score","📥 A/D"]].map(([key,label]) => (
                                                            <button key={key} onClick={() => setVvSortBy(key)}
                                                                style={{ background: vvSortBy === key ? "#1D4ED8" : "#fff", color: vvSortBy === key ? "#fff" : "#1D4ED8", border: `1px solid ${vvSortBy === key ? "#1D4ED8" : "#BFDBFE"}`, borderRadius: "6px", padding: "4px 9px", fontSize: "11px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Table */}
                                                <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                                                    {/* Column headers */}
                                                    <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 52px 52px 52px 52px 56px 60px 28px", gap: "4px", padding: "6px 14px", background: "#EFF6FF", borderTop: "1px solid #BFDBFE", borderBottom: "1px solid #BFDBFE", position: "sticky", top: 0 }}>
                                                        {["Symbol","Signal","RVOL","Vel","A/D","R²","Opp","20D Vol",""].map(h => (
                                                            <span key={h} style={{ fontSize: "9px", fontWeight: "700", color: "#60A5FA", textTransform: "uppercase" }}>{h}</span>
                                                        ))}
                                                    </div>

                                                    {vvFiltered.length === 0 && (
                                                        <p style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>No stocks match your filters.</p>
                                                    )}

                                                    {vvFiltered.map(stock => {
                                                        const sig = stock.signal || {};
                                                        const maxBarVol = Math.max(...(stock.vol_bars||[]).map(b => b.vol), 1);
                                                        const chartIsOpen = vvChartOpen[stock.symbol];
                                                        return (
                                                            <div key={stock.symbol} style={{ borderBottom: "1px solid #F1F5F9" }}>
                                                                {/* ── Row ── */}
                                                                <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 52px 52px 52px 52px 56px 60px 28px", gap: "4px", padding: "9px 14px", alignItems: "center", transition: "background 0.1s" }}
                                                                    className="ta-bulk-row">

                                                                    {/* Symbol */}
                                                                    <div>
                                                                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A" }}>{stock.symbol}</div>
                                                                        <div style={{ fontSize: "9px", color: stock.age_color, fontWeight: "600" }}>{stock.age_emoji} {(stock.age||"").split("/")[0].trim()}</div>
                                                                    </div>

                                                                    {/* Signal */}
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                                                                        <span style={{ fontSize: "13px", flexShrink: 0 }}>{sig.emoji}</span>
                                                                        <span style={{ fontSize: "10px", fontWeight: "600", color: sig.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sig.label}</span>
                                                                    </div>

                                                                    {/* RVOL */}
                                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: stock.rvol >= 2 ? "#15803D" : stock.rvol >= 1.4 ? "#2563EB" : stock.rvol < 0.7 ? "#DC2626" : "#64748B" }}>
                                                                        {stock.rvol_fmt}
                                                                    </span>

                                                                    {/* Velocity score */}
                                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: stock.velocity_score >= 65 ? "#15803D" : stock.velocity_score >= 40 ? "#2563EB" : "#DC2626" }}>
                                                                        {Math.round(stock.velocity_score)}
                                                                    </span>

                                                                    {/* A/D score */}
                                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: stock.ad_score >= 60 ? "#15803D" : stock.ad_score <= 40 ? "#DC2626" : "#64748B" }}>
                                                                        {Math.round(stock.ad_score)}%
                                                                    </span>

                                                                    {/* R² avg */}
                                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: stock.avg_r2 >= 60 ? "#15803D" : stock.avg_r2 >= 40 ? "#2563EB" : "#DC2626" }}>
                                                                        {stock.avg_r2}%
                                                                    </span>

                                                                    {/* Opp score pill */}
                                                                    <div style={{ background: sig.bg || "#F1F5F9", border: `1px solid ${sig.border || "#E2E8F0"}`, borderRadius: "20px", padding: "3px 6px", textAlign: "center" }}>
                                                                        <span style={{ fontSize: "12px", fontWeight: "900", color: sig.color || "#475569" }}>{Math.round(stock.opp_score)}</span>
                                                                    </div>

                                                                    {/* Mini vol sparkline */}
                                                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "1px", height: "20px" }}>
                                                                        {(stock.vol_bars || []).slice(-10).map((b, i) => {
                                                                            const h = Math.max(2, Math.round((b.vol / maxBarVol) * 20));
                                                                            const col = b.vs_avg >= 1.5 ? (b.is_up ? "#1D4ED8" : "#EF4444") : b.is_up ? "#22C55E" : "#EF4444";
                                                                            return <div key={i} style={{ flex: 1, height: `${h}px`, background: col, borderRadius: "1px", opacity: 0.85 }} />;
                                                                        })}
                                                                    </div>

                                                                    {/* 📈 chart toggle */}
                                                                    <button
                                                                        onClick={e => { e.stopPropagation(); setVvChartOpen(p => ({ ...p, [stock.symbol]: !p[stock.symbol] })); }}
                                                                        title="Toggle chart"
                                                                        style={{ background: chartIsOpen ? "#1D4ED8" : "transparent", border: "1px solid", borderColor: chartIsOpen ? "#1D4ED8" : "#BFDBFE", borderRadius: "5px", padding: "3px 5px", cursor: "pointer", fontSize: "12px", color: chartIsOpen ? "#fff" : "#60A5FA", justifySelf: "center", transition: "all 0.15s", lineHeight: 1 }}>
                                                                        📈
                                                                    </button>
                                                                </div>

                                                                {/* ── Chart panel ── */}
                                                                {chartIsOpen && (
                                                                    <div style={{ borderTop: "1px solid #BFDBFE", background: "#EFF6FF", padding: "10px 14px", animation: "ta-fadeUp 0.15s ease" }}>
                                                                        {/* Signal context strip above chart */}
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                                                                            <div style={{ background: sig.bg, border: `1px solid ${sig.border}`, borderRadius: "20px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                                                                <span style={{ fontSize: "12px" }}>{sig.emoji}</span>
                                                                                <span style={{ fontSize: "11px", fontWeight: "700", color: sig.color }}>{sig.label}</span>
                                                                            </div>
                                                                            <span style={{ fontSize: "11px", color: "#64748B" }}>RVOL <strong style={{ color: stock.rvol >= 1.4 ? "#15803D" : "#DC2626" }}>{stock.rvol_fmt}</strong></span>
                                                                            <span style={{ fontSize: "11px", color: "#64748B" }}>A/D <strong style={{ color: stock.ad_score >= 60 ? "#15803D" : stock.ad_score <= 40 ? "#DC2626" : "#64748B" }}>{Math.round(stock.ad_score)}%</strong></span>
                                                                            <span style={{ fontSize: "11px", color: "#64748B" }}>Opp <strong style={{ color: sig.color }}>{Math.round(stock.opp_score)}/100</strong></span>
                                                                        </div>
                                                                        <TradingViewChart
                                                                            key={`vv-${stock.symbol}`}
                                                                            symbol={stock.symbol}
                                                                            theme="light"
                                                                            chartType="candle"
                                                                            interval="1d"
                                                                            height={280}
                                                                            fullscreenable={true}
                                                                            onClose={() => setVvChartOpen(p => ({ ...p, [stock.symbol]: false }))}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Footer summary */}
                                                <div style={{ padding: "8px 14px", background: "#EFF6FF", borderTop: "1px solid #BFDBFE", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                                    {["High Conviction","Breakout Watch","Building Momentum","Distribution"].map(sig => {
                                                        const count = vvBulk.filter(s => s.signal?.label === sig).length;
                                                        const sigData = vvBulk.find(s => s.signal?.label === sig)?.signal;
                                                        return count > 0 ? (
                                                            <span key={sig} style={{ fontSize: "11px", color: sigData?.color || "#475569", fontWeight: "600" }}>
                                                                {sigData?.emoji} {sig}: <strong>{count}</strong>
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {vvBulkError && <div style={{ ...taStyles.errorBox, margin: "12px" }}>{vvBulkError}</div>}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const taStyles = {
    triggerBtn: { display: "flex", alignItems: "center", background: "#7C3AED", color: "#fff", border: "none", padding: "0.55rem 1.1rem", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" },
    overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" },
    modal: { background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(15,23,42,0.15)", animation: "ta-fadeUp 0.3s cubic-bezier(0.34,1.2,0.64,1)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 22px 16px", borderBottom: "1px solid #F1F5F9", position: "sticky", top: 0, background: "#fff", zIndex: 10 },
    title: { fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 },
    subtitle: { fontSize: "12px", color: "#94A3B8", margin: "3px 0 0" },
    closeBtn: { background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" },
    tabRow: { display: "flex", borderBottom: "1px solid #F1F5F9", padding: "0 22px" },
    tab: { background: "transparent", border: "none", padding: "10px 16px", fontSize: "13px", fontWeight: "600", color: "#64748B", cursor: "pointer", borderBottom: "2px solid transparent", transition: "all 0.15s", marginBottom: "-1px" },
    tabActive: { color: "#7C3AED", borderBottomColor: "#7C3AED", background: "transparent" },
    controls: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" },
    controlGroup: { display: "flex", flexDirection: "column", gap: "4px" },
    ctrlLabel: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.7px" },
    select: { background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "8px 10px", color: "#0F172A", fontSize: "13px", cursor: "pointer", width: "100%" },
    input: { background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "8px 10px", color: "#0F172A", fontSize: "13px", width: "100%", outline: "none", boxSizing: "border-box" },
    analyzeBtn: { gridColumn: "1 / -1", background: "#2563EB", border: "none", borderRadius: "8px", padding: "11px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "background 0.2s" },
    scanBtn: { background: "#7C3AED", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontWeight: "700", fontSize: "14px", cursor: "pointer", transition: "background 0.2s", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" },
    rescanBtn: { background: "#fff", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", color: "#64748B", cursor: "pointer", transition: "background 0.15s" },
    errorBox: { background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", color: "#DC2626", fontSize: "13px", marginBottom: "14px" },
    heroCard: { border: "1px solid", borderRadius: "12px", padding: "18px", marginBottom: "16px" },
    badge: { borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "600", display: "inline-block" },
    section: { marginBottom: "16px" },
    sectionLabel: { fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "10px" },
    insightBox: { background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px", padding: "14px", marginBottom: "12px" },
    insightTitle: { fontSize: "11px", fontWeight: "700", color: "#2563EB", margin: "0 0 6px" },
    insightText: { fontSize: "13px", color: "#1E3A5F", margin: 0, lineHeight: 1.65 },
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
                        <TrendAgeModal />
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